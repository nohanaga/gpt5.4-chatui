"""
GPT-5.4 Chat UI - Flask Backend
リッチなチャット UI で reasoning summary とレスポンスをストリーミング表示する。
"""
import json
import os

import httpx
from dotenv import load_dotenv
from flask import Flask, Response, render_template, request, stream_with_context
from openai import OpenAI

load_dotenv(override=True)

# --- Azure OpenAI / OpenAI クライアント設定 ---
ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "https://your-resource-name.openai.azure.com/")
MODEL = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5.4-mini")
API_KEY = os.getenv("AZURE_OPENAI_API_KEY")

# httpx クライアントを長時間ストリーミング用にカスタマイズ
# - read タイムアウトを長め (推論モデルは reasoning に時間がかかる)
# - keepalive を抑制して中間プロキシのアイドル切断を回避
_http_client = httpx.Client(
    timeout=httpx.Timeout(connect=10.0, read=600.0, write=60.0, pool=10.0),
    limits=httpx.Limits(max_connections=20, max_keepalive_connections=0),
    http2=False,
)

client = OpenAI(base_url=ENDPOINT, api_key=API_KEY, http_client=_http_client, max_retries=2)

app = Flask(__name__)

# 進行中ストリームの response_id を保持（cancel 用）
import threading
_active_streams: dict[str, str] = {}  # session_id -> response_id
_active_lock = threading.Lock()


# =====================================================================
# Tool Search デモ用: CRM ネームスペース（GPT-5.4 の deferred loading）
# =====================================================================
CRM_NAMESPACE = {
    "type": "namespace",
    "name": "crm",
    "description": "CRM tools for customer lookup and order management.",
    "tools": [
        {
            "type": "function",
            "name": "list_open_orders",
            "description": "List open orders for a given customer ID.",
            "defer_loading": True,
            "parameters": {
                "type": "object",
                "properties": {"customer_id": {"type": "string", "description": "顧客ID 例: CUST-12345"}},
                "required": ["customer_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "get_shipping_eta",
            "description": "Look up shipping ETA details for an order.",
            "defer_loading": True,
            "parameters": {
                "type": "object",
                "properties": {"order_id": {"type": "string", "description": "注文ID 例: ORD-1001"}},
                "required": ["order_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "search_customer",
            "description": "Search customers by name or email substring.",
            "defer_loading": True,
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
                "additionalProperties": False,
            },
        },
    ],
}


def _execute_mock_function(name: str, arguments: str) -> dict:
    """tool_search 経由で呼ばれた関数のモック実装。"""
    try:
        args = json.loads(arguments) if arguments else {}
    except json.JSONDecodeError:
        args = {}

    if name == "list_open_orders":
        cid = args.get("customer_id", "UNKNOWN")
        return {
            "customer_id": cid,
            "orders": [
                {"order_id": "ORD-1001", "status": "processing", "total_jpy": 12800},
                {"order_id": "ORD-1003", "status": "shipped", "total_jpy": 4200},
            ],
        }
    if name == "get_shipping_eta":
        oid = args.get("order_id", "UNKNOWN")
        return {
            "order_id": oid,
            "carrier": "Yamato",
            "eta": "2026-04-25T14:00:00+09:00",
            "tracking_url": f"https://example.com/track/{oid}",
        }
    if name == "search_customer":
        q = args.get("query", "")
        return {
            "query": q,
            "matches": [
                {"customer_id": "CUST-12345", "name": "山田 太郎", "email": "taro@example.com"},
                {"customer_id": "CUST-67890", "name": "鈴木 花子", "email": "hanako@example.com"},
            ],
        }
    return {"error": f"unknown function: {name}"}


def sse(event: str, data: dict) -> str:
    """Server-Sent Events フォーマット"""
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.route("/")
def index():
    return render_template("index.html", model=MODEL)


@app.route("/api/chat", methods=["POST"])
def chat():
    body = request.get_json(force=True)
    user_input = (body.get("message") or "").strip()
    effort = body.get("effort", "medium")  # none / low / medium / high / xhigh
    previous_response_id = body.get("previous_response_id")
    use_mcp = bool(body.get("use_mcp", False))
    use_tool_search = bool(body.get("use_tool_search", False))
    session_id = body.get("session_id") or "default"
    show_reasoning_text = bool(body.get("show_reasoning_text", False))
    verbosity = body.get("verbosity") or "medium"  # low / medium / high
    if verbosity not in ("low", "medium", "high"):
        verbosity = "medium"
    use_preambles = bool(body.get("use_preambles", False))

    if not user_input:
        return Response(
            sse("error", {"message": "empty message"}),
            mimetype="text/event-stream",
        )

    # Microsoft Learn MCP サーバ定義 (Responses API native MCP tool)
    mcp_tools = [
        {
            "type": "mcp",
            "server_label": "microsoft_learn",
            "server_url": "https://learn.microsoft.com/api/mcp",
            "require_approval": "never",
        }
    ]

    @stream_with_context
    def generate():
        # ハートビート: 中間プロキシのアイドルタイムアウトを防ぐ
        yield ": connected\n\n"

        # ベース kwargs
        base_kwargs: dict = {
            "model": MODEL,
            "stream": True,
            "text": {"verbosity": verbosity},
        }
        if effort == "none":
            base_kwargs["reasoning"] = {"effort": "none"}
        else:
            base_kwargs["reasoning"] = {"effort": effort, "summary": "detailed"}

        # Preambles: ツール呼び出し前にプラン提示と進捗ナレーションを行わせる
        # 公式 GPT-5 prompting guide "Tool preambles" の <tool_preambles> ブロックを採用
        # https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide
        if use_preambles:
            base_kwargs["instructions"] = (
                "<tool_preambles>\n"
                "- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.\n"
                "- Then, immediately outline a structured plan detailing each logical step you'll follow.\n"
                "- As you execute your file edit(s) or tool call(s), narrate each step succinctly and sequentially, marking progress clearly.\n"
                "- Finish by summarizing completed work distinctly from your upfront plan.\n"
                "- Respond in the same language as the user's question.\n"
                "</tool_preambles>"
            )

        tools: list = []
        if use_mcp:
            tools.extend(mcp_tools)
        if use_tool_search:
            tools.append(CRM_NAMESPACE)
            tools.append({"type": "tool_search"})
        if tools:
            base_kwargs["tools"] = tools
            # tool_search デモでは並列呼び出しを抑止して挙動を分かりやすく
            if use_tool_search:
                base_kwargs["parallel_tool_calls"] = False

        if show_reasoning_text:
            base_kwargs["include"] = ["reasoning.encrypted_content"]
            base_kwargs["store"] = False

        # 初回入力
        next_input = user_input
        next_previous_id = previous_response_id

        # tool_search デモ用: 関数呼び出しを最大数ターン解決する
        max_iterations = 4
        try:
            for _iter in range(max_iterations):
                kwargs = dict(base_kwargs)
                kwargs["input"] = next_input
                if next_previous_id:
                    kwargs["previous_response_id"] = next_previous_id

                stream = client.responses.create(**kwargs)

                # この応答内で見つかった function_call を保持（tool_search の解決）
                pending_function_calls: list[dict] = []
                # mcp_call の output_index → 内部 ID マッピング
                mcp_calls: dict[int, str] = {}
                # function_call の output_index → 蓄積バッファ
                fcall_buf: dict[int, dict] = {}
                last_response_id: str | None = None

                for event in stream:
                    etype = event.type

                    # ===== ライフサイクル =====
                    if etype == "response.created":
                        rid = getattr(event.response, "id", None)
                        last_response_id = rid
                        if rid:
                            with _active_lock:
                                _active_streams[session_id] = rid
                        yield sse(
                            "lifecycle",
                            {"phase": "created", "response_id": rid, "model": getattr(event.response, "model", "")},
                        )
                    elif etype == "response.in_progress":
                        yield sse("lifecycle", {"phase": "in_progress"})
                    elif etype == "response.queued":
                        yield sse("lifecycle", {"phase": "queued"})
                    elif etype == "response.incomplete":
                        inc_resp = getattr(event, "response", None)
                        inc = getattr(inc_resp, "incomplete_details", None) if inc_resp else None
                        yield sse(
                            "incomplete",
                            {"reason": getattr(inc, "reason", "unknown") if inc else "unknown"},
                        )

                    # ===== Reasoning summary =====
                    elif etype == "response.reasoning_summary_text.delta":
                        yield sse("reasoning_delta", {"delta": event.delta})
                    elif etype == "response.reasoning_summary_text.done":
                        yield sse("reasoning_done", {})
                    elif etype == "response.reasoning_summary_part.added":
                        yield sse("reasoning_part_added", {})
                    elif etype == "response.reasoning_summary_part.done":
                        yield sse("reasoning_part_done", {})

                    # ===== Reasoning 本体テキスト (encrypted_content 取得時) =====
                    elif etype == "response.reasoning_text.delta":
                        yield sse("reasoning_text_delta", {"delta": getattr(event, "delta", "")})
                    elif etype == "response.reasoning_text.done":
                        yield sse("reasoning_text_done", {})

                    # ===== Refusal =====
                    elif etype == "response.refusal.delta":
                        yield sse("refusal_delta", {"delta": getattr(event, "delta", "")})
                    elif etype == "response.refusal.done":
                        yield sse("refusal_done", {"refusal": getattr(event, "refusal", "")})

                    # ===== 出力テキスト =====
                    elif etype == "response.output_text.delta":
                        yield sse("text_delta", {"delta": event.delta})
                    elif etype == "response.output_text.done":
                        yield sse("text_done", {})

                    # ===== Annotation (引用 URL) =====
                    elif etype == "response.output_text.annotation.added":
                        ann = getattr(event, "annotation", None)
                        if ann is not None:
                            a_dict = ann if isinstance(ann, dict) else (
                                ann.model_dump() if hasattr(ann, "model_dump") else dict(ann.__dict__)
                            )
                            yield sse("annotation", {"annotation": a_dict})

                    # ===== Function call 引数 (tool_search 経由 / 通常) =====
                    elif etype == "response.function_call_arguments.delta":
                        idx = getattr(event, "output_index", 0)
                        buf = fcall_buf.setdefault(idx, {"args": ""})
                        buf["args"] += getattr(event, "delta", "")
                        yield sse(
                            "function_args_delta",
                            {"index": idx, "delta": getattr(event, "delta", "")},
                        )
                    elif etype == "response.function_call_arguments.done":
                        idx = getattr(event, "output_index", 0)
                        args_str = getattr(event, "arguments", "") or fcall_buf.get(idx, {}).get("args", "")
                        yield sse(
                            "function_args_done",
                            {"index": idx, "arguments": args_str},
                        )

                    # ===== MCP イベント =====
                    elif etype == "response.mcp_list_tools.in_progress":
                        yield sse("mcp_list_start", {})
                    elif etype == "response.mcp_list_tools.completed":
                        yield sse("mcp_list_done", {})
                    elif etype == "response.mcp_list_tools.failed":
                        yield sse("mcp_list_failed", {})

                    # ===== output_item.added =====
                    elif etype == "response.output_item.added":
                        item = getattr(event, "item", None)
                        if item is None:
                            continue
                        itype = getattr(item, "type", None)
                        idx = getattr(event, "output_index", 0)

                        if itype == "mcp_call":
                            mcp_calls[idx] = getattr(item, "id", f"mcp_{idx}")
                            yield sse(
                                "mcp_call_start",
                                {
                                    "index": idx,
                                    "name": getattr(item, "name", ""),
                                    "server_label": getattr(item, "server_label", ""),
                                },
                            )
                        elif itype == "tool_search_call":
                            yield sse(
                                "tool_search_call_start",
                                {"index": idx, "id": getattr(item, "id", "")},
                            )
                        elif itype == "function_call":
                            namespace = getattr(item, "namespace", "") or ""
                            fname = getattr(item, "name", "")
                            call_id = getattr(item, "call_id", None) or getattr(item, "id", "")
                            fcall_buf.setdefault(idx, {"args": ""}).update(
                                {
                                    "name": fname,
                                    "namespace": namespace,
                                    "call_id": call_id,
                                }
                            )
                            yield sse(
                                "function_call_start",
                                {
                                    "index": idx,
                                    "name": fname,
                                    "namespace": namespace,
                                    "call_id": call_id,
                                },
                            )

                    # ===== MCP 引数 =====
                    elif etype == "response.mcp_call_arguments.delta":
                        yield sse(
                            "mcp_args_delta",
                            {
                                "index": getattr(event, "output_index", 0),
                                "delta": getattr(event, "delta", ""),
                            },
                        )
                    elif etype == "response.mcp_call_arguments.done":
                        yield sse(
                            "mcp_args_done",
                            {
                                "index": getattr(event, "output_index", 0),
                                "arguments": getattr(event, "arguments", ""),
                            },
                        )

                    elif etype == "response.mcp_call.in_progress":
                        yield sse(
                            "mcp_call_progress",
                            {"index": getattr(event, "output_index", 0)},
                        )

                    # ===== output_item.done =====
                    elif etype == "response.output_item.done":
                        item = getattr(event, "item", None)
                        if item is None:
                            continue
                        itype = getattr(item, "type", None)
                        idx = getattr(event, "output_index", 0)

                        if itype == "mcp_call":
                            output = getattr(item, "output", None)
                            error = getattr(item, "error", None)
                            yield sse(
                                "mcp_call_done",
                                {
                                    "index": idx,
                                    "name": getattr(item, "name", ""),
                                    "server_label": getattr(item, "server_label", ""),
                                    "arguments": getattr(item, "arguments", ""),
                                    "output": output if isinstance(output, str) else (
                                        json.dumps(output, ensure_ascii=False, default=str)
                                        if output is not None else ""
                                    ),
                                    "error": str(error) if error else None,
                                },
                            )
                        elif itype == "mcp_list_tools":
                            tools_list = getattr(item, "tools", []) or []
                            yield sse(
                                "mcp_list_tools",
                                {
                                    "server_label": getattr(item, "server_label", ""),
                                    "tools": [
                                        {
                                            "name": getattr(t, "name", "") if not isinstance(t, dict) else t.get("name", ""),
                                            "description": (
                                                (getattr(t, "description", "") if not isinstance(t, dict) else t.get("description", "")) or ""
                                            )[:200],
                                        }
                                        for t in tools_list
                                    ],
                                },
                            )
                        elif itype == "tool_search_call":
                            args = getattr(item, "arguments", None) or {}
                            if isinstance(args, str):
                                try:
                                    args = json.loads(args)
                                except json.JSONDecodeError:
                                    args = {"query": args}
                            yield sse(
                                "tool_search_call_done",
                                {
                                    "index": idx,
                                    "query": (args.get("query") if isinstance(args, dict) else "") or "",
                                },
                            )
                        elif itype == "tool_search_output":
                            ts_tools = getattr(item, "tools", []) or []
                            namespaces_payload = []
                            for ns in ts_tools:
                                ns_name = getattr(ns, "name", "") if not isinstance(ns, dict) else ns.get("name", "")
                                ns_tools = getattr(ns, "tools", []) if not isinstance(ns, dict) else ns.get("tools", [])
                                namespaces_payload.append(
                                    {
                                        "name": ns_name,
                                        "tools": [
                                            {
                                                "name": (getattr(tt, "name", "") if not isinstance(tt, dict) else tt.get("name", "")),
                                                "defer_loading": bool(
                                                    getattr(tt, "defer_loading", False) if not isinstance(tt, dict) else tt.get("defer_loading", False)
                                                ),
                                            }
                                            for tt in (ns_tools or [])
                                        ],
                                    }
                                )
                            yield sse(
                                "tool_search_output",
                                {"index": idx, "namespaces": namespaces_payload},
                            )
                        elif itype == "function_call":
                            namespace = getattr(item, "namespace", "") or fcall_buf.get(idx, {}).get("namespace", "")
                            fname = getattr(item, "name", "") or fcall_buf.get(idx, {}).get("name", "")
                            call_id = (
                                getattr(item, "call_id", None)
                                or getattr(item, "id", None)
                                or fcall_buf.get(idx, {}).get("call_id", "")
                            )
                            args_str = getattr(item, "arguments", "") or fcall_buf.get(idx, {}).get("args", "")
                            yield sse(
                                "function_call_done",
                                {
                                    "index": idx,
                                    "name": fname,
                                    "namespace": namespace,
                                    "call_id": call_id,
                                    "arguments": args_str,
                                },
                            )
                            # 自動実行のため記録 (tool_search デモ時のみ)
                            if use_tool_search and call_id:
                                pending_function_calls.append(
                                    {
                                        "call_id": call_id,
                                        "name": fname,
                                        "arguments": args_str,
                                        "index": idx,
                                    }
                                )

                    elif etype == "response.mcp_call.failed":
                        yield sse(
                            "mcp_call_failed",
                            {
                                "index": getattr(event, "output_index", 0),
                                "error": str(getattr(event, "error", "unknown")),
                            },
                        )

                    # 完了
                    elif etype == "response.completed":
                        last_response_id = event.response.id
                        usage = getattr(event.response, "usage", None)
                        # function_call が pending している場合は中間 completed として扱う
                        if pending_function_calls:
                            # まだ最終ではないので、ここでは「完了」イベントを送らない
                            with _active_lock:
                                _active_streams.pop(session_id, None)
                            break  # for event in stream
                        payload = {"response_id": event.response.id}
                        if usage:
                            payload["usage"] = {
                                "input_tokens": usage.input_tokens,
                                "output_tokens": usage.output_tokens,
                                "reasoning_tokens": getattr(
                                    usage.output_tokens_details, "reasoning_tokens", 0
                                ),
                                "total_tokens": usage.total_tokens,
                            }
                        yield sse("lifecycle", {"phase": "completed"})
                        yield sse("completed", payload)
                        with _active_lock:
                            _active_streams.pop(session_id, None)

                    elif etype == "response.failed" or etype == "error":
                        yield sse(
                            "error",
                            {"message": str(getattr(event, "error", "unknown"))},
                        )
                        with _active_lock:
                            _active_streams.pop(session_id, None)

                # 次イテレーション判定
                if not pending_function_calls:
                    return  # ストリーム終了

                # モック実行 + UI 通知
                next_input = []
                for fc in pending_function_calls:
                    result = _execute_mock_function(fc["name"], fc["arguments"])
                    output_str = json.dumps(result, ensure_ascii=False)
                    yield sse(
                        "function_call_result",
                        {
                            "index": fc["index"],
                            "name": fc["name"],
                            "call_id": fc["call_id"],
                            "output": output_str,
                        },
                    )
                    next_input.append(
                        {
                            "type": "function_call_output",
                            "call_id": fc["call_id"],
                            "output": output_str,
                        }
                    )
                next_previous_id = last_response_id

            # max_iterations 到達
            yield sse(
                "error",
                {"message": f"tool_search の関数解決が {max_iterations} 回で収束しませんでした。"},
            )

        except (httpx.RemoteProtocolError, httpx.ReadError, httpx.ReadTimeout) as e:
            # ストリームが途中で切れた場合
            yield sse(
                "error",
                {
                    "message": (
                        f"接続が途中で切断されました ({type(e).__name__}): {e}. "
                        "推論モデルは応答までに時間がかかることがあります。"
                        "もう一度お試しください。"
                    )
                },
            )
        except Exception as e:  # noqa: BLE001
            yield sse("error", {"message": f"{type(e).__name__}: {e}"})

    resp = Response(generate(), mimetype="text/event-stream")
    # SSE 用ヘッダ: バッファリング/圧縮/キャッシュを無効化
    resp.headers["Cache-Control"] = "no-cache, no-transform"
    resp.headers["X-Accel-Buffering"] = "no"
    resp.headers["Connection"] = "keep-alive"
    return resp


@app.route("/api/cancel", methods=["POST"])
def cancel():
    """進行中のレスポンスをキャンセル。session_id 経由で response_id を解決。"""
    body = request.get_json(force=True) or {}
    session_id = body.get("session_id") or "default"
    with _active_lock:
        rid = _active_streams.pop(session_id, None)
    if not rid:
        return {"ok": False, "reason": "no active stream"}, 404
    try:
        client.responses.cancel(rid)
        return {"ok": True, "response_id": rid}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": f"{type(e).__name__}: {e}"}, 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True, threaded=True)
