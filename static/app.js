// GPT-5.4 Chat - フロントエンド

// ===== i18n =====
const I18N = {
    ja: {
        newChat: '新しいチャット',
        toggleTheme: 'テーマ切替',
        toggleLang: 'Switch to English',
        themeDark: 'ダーク',
        themeLight: 'ライト',
        reasoningEffort: '推論モード',
        mcpServer: 'MCP サーバ',
        mcpDesc: 'learn.microsoft.com の公式ドキュメントを検索',
        toolSearch: 'Tool Search',
        toolSearchDesc: 'deferred ツールを動的にロードする GPT-5.4 新機能のデモ',
        toolSearchTitle: 'Tool Search',
        toolSearchQueryLabel: '検索クエリ',
        toolSearchResolved: '解決された名前空間',
        toolSearchDeferBadge: 'deferred',
        functionCallTitle: '関数呼び出し',
        functionMockNote: '※ デモ用モック実行',
        suggest5: '顧客 CUST-12345 の未処理注文を確認',
        suggest6: 'Azure AI Search の 2026年3月の Update を教えて',
        options: 'オプション',
        showReasoningText: '推論本体テキストを表示',
        showPreambles: 'ツール呼び出し前の Preamble を表示',
        verbosity: 'Verbosity（出力冗長度）',
        model: 'モデル',
        askCopilot: 'Ask Copilot',
        welcomeTitle: 'GPT-5.4 へようこそ',
        welcomeBody: '質問を入力してください。推論サマリーと回答をストリーミング表示します。',
        suggest1: '相対性理論を分かりやすく説明して',
        suggest2: 'フィボナッチを Python で実装',
        suggest3: '7つの橋の問題を証明して',
        suggest4: 'SQL の JOIN を例で教えて',
        placeholder: 'GPT-5.4 に質問する… (Shift+Enter で改行)',
        send: '送信',
        stop: '停止',
        hint: 'Enter で送信 / Shift+Enter で改行',
        you: 'あなた',
        assistantName: 'GPT-5.4',
        refusalTitle: 'モデルが要求を拒否しました',
        incompleteTitle: '応答が不完全に終了しました',
        cancelTitle: 'ユーザーにより停止されました',
        thinking: '考え中…',
        reasoningRunning: '実行中',
        reasoningDone: '完了',
        reasoningView: '推論を表示',
        tabSummary: 'Summary',
        tabBody: '本体テキスト',
        toolRunning: '実行中…',
        toolDone: '完了',
        toolFailed: '失敗',
        toolArgs: '引数',
        toolResult: '結果',
        mcpListLabel: 'MCP ツール一覧',
        toolsSuffix: 'tools',
        newChatHeading: '新しいチャット',
        newChatBody: '質問を入力してください。',
        responding: '応答中…',
        errorMsg: 'エラーが発生しました',
        errorPrefix: 'エラー',
        references: '参考リンク',
        reasonMaxTokens: '出力トークン上限に達しました',
        reasonContentFilter: 'コンテンツフィルタにより停止',
        reasonMaxTools: 'ツール呼び出し上限に達しました',
        reasonOther: '理由',
        usageFmt: (u) => `tokens · input ${u.input_tokens} · output ${u.output_tokens} · reasoning ${u.reasoning_tokens} · total ${u.total_tokens}`,
    },
    en: {
        newChat: 'New chat',
        toggleTheme: 'Toggle theme',
        toggleLang: '日本語に切替',
        themeDark: 'Dark',
        themeLight: 'Light',
        reasoningEffort: 'Reasoning effort',
        mcpServer: 'MCP server',
        mcpDesc: 'Search official docs at learn.microsoft.com',
        toolSearch: 'Tool Search',
        toolSearchDesc: 'GPT-5.4 deferred tools loaded dynamically (demo)',
        toolSearchTitle: 'Tool Search',
        toolSearchQueryLabel: 'Search query',
        toolSearchResolved: 'Resolved namespaces',
        toolSearchDeferBadge: 'deferred',
        functionCallTitle: 'Function call',
        functionMockNote: '* mock executed for demo',
        suggest5: 'List open orders for CUST-12345',
        suggest6: 'What are the Azure AI Search updates in March 2026?',
        options: 'Options',
        showReasoningText: 'Show reasoning body text',
        showPreambles: 'Show preambles before tool calls',
        verbosity: 'Verbosity',
        model: 'Model',
        askCopilot: 'Ask Copilot',
        welcomeTitle: 'Welcome to GPT-5.4',
        welcomeBody: 'Enter a question. The reasoning summary and answer will stream.',
        suggest1: 'Explain relativity simply',
        suggest2: 'Implement Fibonacci in Python',
        suggest3: 'Prove the Seven Bridges of Königsberg',
        suggest4: 'Teach SQL JOIN with examples',
        placeholder: 'Ask GPT-5.4… (Shift+Enter for newline)',
        send: 'Send',
        stop: 'Stop',
        hint: 'Enter to send / Shift+Enter for newline',
        you: 'You',
        assistantName: 'GPT-5.4',
        refusalTitle: 'The model refused the request',
        incompleteTitle: 'Response ended incompletely',
        cancelTitle: 'Stopped by user',
        thinking: 'Thinking…',
        reasoningRunning: 'Running',
        reasoningDone: 'Done',
        reasoningView: 'Show reasoning',
        tabSummary: 'Summary',
        tabBody: 'Body text',
        toolRunning: 'Running…',
        toolDone: 'Done',
        toolFailed: 'Failed',
        toolArgs: 'Arguments',
        toolResult: 'Result',
        mcpListLabel: 'MCP tool list',
        toolsSuffix: 'tools',
        newChatHeading: 'New chat',
        newChatBody: 'Enter your question.',
        responding: 'Responding…',
        errorMsg: 'An error occurred',
        errorPrefix: 'Error',
        references: 'References',
        reasonMaxTokens: 'Output token limit reached',
        reasonContentFilter: 'Stopped by content filter',
        reasonMaxTools: 'Tool call limit reached',
        reasonOther: 'Reason',
        usageFmt: (u) => `tokens · input ${u.input_tokens} · output ${u.output_tokens} · reasoning ${u.reasoning_tokens} · total ${u.total_tokens}`,
    },
};
let currentLang = (localStorage.getItem('chatLang') === 'en') ? 'en' : 'ja';
function t(key) { return I18N[currentLang][key]; }
function applyI18n(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (I18N[currentLang][k] !== undefined) el.textContent = I18N[currentLang][k];
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el => {
        const k = el.getAttribute('data-i18n-title');
        if (I18N[currentLang][k] !== undefined) el.title = I18N[currentLang][k];
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const k = el.getAttribute('data-i18n-placeholder');
        if (I18N[currentLang][k] !== undefined) el.placeholder = I18N[currentLang][k];
    });
    if (!root) document.documentElement.lang = currentLang;
}

// ===== Theme =====
let currentTheme = localStorage.getItem('chatTheme') || 'dark';
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const link = document.getElementById('hljsTheme');
    if (link) {
        link.href = (currentTheme === 'light')
            ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/styles/github.min.css'
            : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/styles/github-dark.min.css';
    }
    const lbl = document.querySelector('.theme-label');
    if (lbl) lbl.textContent = (currentTheme === 'light') ? t('themeLight') : t('themeDark');
    try {
        mermaid.initialize({ startOnLoad: false, theme: (currentTheme === 'light') ? 'default' : 'dark', securityLevel: 'loose' });
    } catch {}
}
applyTheme();
applyI18n();

// ===== Markdown / Mermaid セットアップ =====
mermaid.initialize({ startOnLoad: false, theme: (currentTheme === 'light') ? 'default' : 'dark', securityLevel: 'loose' });

let mermaidCounter = 0;

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// marked v12: extension で mermaid を独自処理
marked.use({
    gfm: true,
    breaks: true,
    renderer: {
        code(code, infostring) {
            // marked v12 では token オブジェクトが渡る場合がある
            let text, lang;
            if (typeof code === 'object' && code !== null) {
                text = code.text;
                lang = (code.lang || '').trim().split(/\s+/)[0];
            } else {
                text = code;
                lang = (infostring || '').trim().split(/\s+/)[0];
            }
            if (lang.toLowerCase() === 'mermaid') {
                const id = `mmd-${++mermaidCounter}`;
                // raw mermaid ソースをそのまま埋め込む（HTML エスケープ）
                return `<pre class="mermaid-src" data-mmd-id="${id}">${escapeHtml(text)}</pre>`;
            }
            // 通常コード: hljs でハイライト
            let highlighted;
            if (lang && hljs.getLanguage(lang)) {
                try { highlighted = hljs.highlight(text, { language: lang }).value; } catch {}
            }
            if (!highlighted) {
                try { highlighted = hljs.highlightAuto(text).value; } catch { highlighted = escapeHtml(text); }
            }
            const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
            return `<pre><code${langClass}>${highlighted}</code></pre>`;
        }
    }
});

/**
 * Markdown を安全な HTML に変換。mermaid コードブロックは <pre.mermaid-src> として残し、
 * 後段で <div.mermaid> に変換して描画する。
 */
function renderMarkdown(src) {
    if (!src) return '';
    const html = marked.parse(src);
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['foreignObject'],
        ADD_ATTR: ['target', 'data-mmd-id']
    });
}

/**
 * 要素内の mermaid ソース (<pre.mermaid-src>) を <div.mermaid> に置換し描画する。
 */
async function renderMermaidIn(el) {
    const sources = el.querySelectorAll('pre.mermaid-src');
    if (!sources.length) return;
    const nodes = [];
    sources.forEach(src => {
        const div = document.createElement('div');
        div.className = 'mermaid';
        // textContent でデコード済みの生ソースを取得
        div.textContent = src.textContent;
        src.replaceWith(div);
        nodes.push(div);
    });
    try {
        await mermaid.run({ nodes });
    } catch (e) {
        // 個別ノードのエラーフォールバック
        nodes.forEach(n => {
            if (!n.dataset.processed) {
                n.outerHTML = `<pre class="mermaid-error">Mermaid 構文エラー: ${escapeHtml(e.message || String(e))}\n\n--- source ---\n${escapeHtml(n.textContent)}</pre>`;
            }
        });
    }
}

const $messages = document.getElementById('messages');
const $form = document.getElementById('composerForm');
const $input = document.getElementById('input');
const $send = document.getElementById('sendBtn');
const $cancel = document.getElementById('cancelBtn');
const $status = document.getElementById('status');
const $newChat = document.getElementById('newChatBtn');

const SESSION_ID = (() => {
    let id = sessionStorage.getItem('chatSessionId');
    if (!id) {
        id = 'sess_' + Math.random().toString(36).slice(2, 12);
        sessionStorage.setItem('chatSessionId', id);
    }
    return id;
})();

let previousResponseId = null;
let streaming = false;
let abortCtrl = null;

// textarea 自動リサイズ
$input.addEventListener('input', () => {
    $input.style.height = 'auto';
    $input.style.height = Math.min($input.scrollHeight, 200) + 'px';
});

// Enter で送信、Shift+Enter で改行
$input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        $form.requestSubmit();
    }
});

// 候補ボタン
document.querySelectorAll('.suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
        $input.value = btn.textContent;
        $input.dispatchEvent(new Event('input'));
        $input.focus();
    });
});

// 新しいチャット
$newChat.addEventListener('click', () => {
    if (streaming) return;
    previousResponseId = null;
    $messages.innerHTML = `
        <div class="welcome">
            <h1>${escapeHtml(t('newChatHeading'))}</h1>
            <p>${escapeHtml(t('newChatBody'))}</p>
        </div>`;
});

// テーマ切替
const $themeToggle = document.getElementById('themeToggle');
if ($themeToggle) {
    $themeToggle.addEventListener('click', () => {
        currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        localStorage.setItem('chatTheme', currentTheme);
        applyTheme();
    });
}

// 言語切替
const $langToggle = document.getElementById('langToggle');
if ($langToggle) {
    const updateLangLabel = () => {
        const lbl = $langToggle.querySelector('.lang-label');
        if (lbl) lbl.textContent = (currentLang === 'ja') ? '日本語' : 'English';
    };
    updateLangLabel();
    $langToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'ja') ? 'en' : 'ja';
        localStorage.setItem('chatLang', currentLang);
        applyI18n();
        updateLangLabel();
        const lbl = document.querySelector('.theme-label');
        if (lbl) lbl.textContent = (currentTheme === 'light') ? t('themeLight') : t('themeDark');
    });
}

function getEffort() {
    const el = document.querySelector('input[name="effort"]:checked');
    return el ? el.value : 'medium';
}

function getMcpEnabled() {
    const el = document.getElementById('mcpToggle');
    return !!(el && el.checked);
}

function getToolSearchEnabled() {
    const el = document.getElementById('toolSearchToggle');
    return !!(el && el.checked);
}

function getReasoningTextEnabled() {
    const el = document.getElementById('reasoningTextToggle');
    return !!(el && el.checked);
}

function getVerbosity() {
    const el = document.querySelector('input[name="verbosity"]:checked');
    return el ? el.value : 'medium';
}

function getPreamblesEnabled() {
    const el = document.getElementById('preamblesToggle');
    return !!(el && el.checked);
}

// MCP トグルの状態表示
const $mcpToggle = document.getElementById('mcpToggle');
if ($mcpToggle) {
    const updateMcpBadge = () => {
        const card = $mcpToggle.closest('.mcp-toggle').querySelector('.mcp-card');
        const status = card.querySelector('.mcp-status');
        if ($mcpToggle.checked) {
            card.classList.add('on');
            status.textContent = 'ON';
        } else {
            card.classList.remove('on');
            status.textContent = 'OFF';
        }
    };
    $mcpToggle.addEventListener('change', updateMcpBadge);
    updateMcpBadge();
}

// Tool Search トグルの状態表示
const $toolSearchToggle = document.getElementById('toolSearchToggle');
if ($toolSearchToggle) {
    const updateTsBadge = () => {
        const card = $toolSearchToggle.closest('.mcp-toggle').querySelector('.mcp-card');
        const status = card.querySelector('.mcp-status');
        if ($toolSearchToggle.checked) {
            card.classList.add('on');
            status.textContent = 'ON';
        } else {
            card.classList.remove('on');
            status.textContent = 'OFF';
        }
    };
    $toolSearchToggle.addEventListener('change', updateTsBadge);
    updateTsBadge();
}

function clearWelcome() {
    const w = $messages.querySelector('.welcome');
    if (w) w.remove();
}

function addUserMessage(text) {
    clearWelcome();
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `
        <div class="msg-row">
            <div class="avatar user">You</div>
            <div class="msg-body">
                <div class="msg-author">${escapeHtml(t('you'))}</div>
                <div class="msg-content"></div>
            </div>
        </div>`;
    div.querySelector('.msg-content').textContent = text;
    $messages.appendChild(div);
    scrollToBottom();
}

function addAssistantMessage() {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="msg-row">
            <div class="avatar assistant">AI</div>
            <div class="msg-body">
                <div class="msg-author">${escapeHtml(t('assistantName'))}</div>
                <div class="phase-timeline" hidden></div>
                <div class="banner refusal-banner" hidden>
                    <div class="banner-head">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        <span>${escapeHtml(t('refusalTitle'))}</span>
                    </div>
                    <div class="banner-body refusal-text"></div>
                </div>
                <div class="banner incomplete-banner" hidden>
                    <div class="banner-head">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>${escapeHtml(t('incompleteTitle'))}</span>
                    </div>
                    <div class="banner-body incomplete-text"></div>
                </div>
                <div class="tool-call reasoning-card" hidden>
                    <div class="tool-header">
                        <span class="tool-spinner reasoning-spinner"></span>
                        <svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>
                        <svg class="tool-icon reasoning-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.66 17h4.68M12 3a7 7 0 0 0-4 12.74V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26A7 7 0 0 0 12 3z"/></svg>
                        <span class="tool-name reasoning-label">${escapeHtml(t('thinking'))}</span>
                        <span class="tool-server"></span>
                        <span class="tool-status reasoning-status">${escapeHtml(t('reasoningRunning'))}</span>
                    </div>
                    <div class="tool-body">
                        <div class="reasoning-tabs" hidden>
                            <button class="reasoning-tab active" data-tab="summary">${escapeHtml(t('tabSummary'))}</button>
                            <button class="reasoning-tab" data-tab="text">${escapeHtml(t('tabBody'))}</button>
                        </div>
                        <div class="reasoning-pane reasoning-summary"></div>
                        <div class="reasoning-pane reasoning-text" hidden></div>
                    </div>
                </div>
                <div class="tools" hidden></div>
                <div class="msg-content"></div>
                <div class="annotations" hidden>
                    <div class="annotations-title">${escapeHtml(t('references'))}</div>
                    <div class="annotations-list"></div>
                </div>
                <div class="usage" hidden></div>
            </div>
        </div>`;
    $messages.appendChild(div);

    const phaseEl = div.querySelector('.phase-timeline');
    const refusalBanner = div.querySelector('.refusal-banner');
    const refusalText = div.querySelector('.refusal-text');
    const incBanner = div.querySelector('.incomplete-banner');
    const incText = div.querySelector('.incomplete-text');
    const reasoningEl = div.querySelector('.reasoning-card');
    const reasoningSummaryPane = div.querySelector('.reasoning-summary');
    const reasoningTextPane = div.querySelector('.reasoning-text');
    const reasoningTabs = div.querySelector('.reasoning-tabs');
    const reasoningLabel = div.querySelector('.reasoning-label');
    const reasoningSpinner = div.querySelector('.reasoning-spinner');
    const reasoningStatus = div.querySelector('.reasoning-status');
    const reasoningHeader = reasoningEl.querySelector('.tool-header');
    const toolsEl = div.querySelector('.tools');
    const contentEl = div.querySelector('.msg-content');
    const annotationsEl = div.querySelector('.annotations');
    const annotationsList = div.querySelector('.annotations-list');
    const usageEl = div.querySelector('.usage');

    reasoningEl.classList.add('running');
    reasoningHeader.addEventListener('click', () => reasoningEl.classList.toggle('open'));

    // ===== タブ切替 =====
    reasoningTabs.querySelectorAll('.reasoning-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            reasoningTabs.querySelectorAll('.reasoning-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            reasoningSummaryPane.hidden = (tab !== 'summary');
            reasoningTextPane.hidden = (tab !== 'text');
        });
    });

    // ===== Phase timeline =====
    const phaseLabels = (currentLang === 'ja')
        ? ['作成', '待機', '生成中', '推論', 'ツール', '出力', '完了']
        : ['Created', 'Queued', 'In progress', 'Reasoning', 'Tool', 'Output', 'Completed'];
    const phases = [
        ['created', phaseLabels[0]],
        ['queued', phaseLabels[1]],
        ['in_progress', phaseLabels[2]],
        ['reasoning', phaseLabels[3]],
        ['tool', phaseLabels[4]],
        ['text', phaseLabels[5]],
        ['completed', phaseLabels[6]],
    ];
    const phaseMap = new Map();
    function buildTimeline() {
        phaseEl.innerHTML = '';
        phases.forEach(([key, label], i) => {
            const node = document.createElement('div');
            node.className = 'phase-node';
            node.dataset.phase = key;
            node.innerHTML = `<span class="phase-dot"></span><span class="phase-label">${label}</span>`;
            phaseEl.appendChild(node);
            phaseMap.set(key, node);
            if (i < phases.length - 1) {
                const sep = document.createElement('div');
                sep.className = 'phase-sep';
                phaseEl.appendChild(sep);
            }
        });
    }
    function setPhase(key, status) {
        if (phaseEl.hidden) { phaseEl.hidden = false; buildTimeline(); }
        const node = phaseMap.get(key);
        if (!node) return;
        node.classList.remove('active', 'done');
        if (status) node.classList.add(status);
    }
    function markPhaseDone(key) {
        const n = phaseMap.get(key);
        if (n) { n.classList.remove('active'); n.classList.add('done'); }
    }

    // ===== Reasoning summary パート管理 =====
    let currentPart = null;
    function ensurePart() {
        if (!currentPart) {
            const el = document.createElement('div');
            el.className = 'reasoning-part';
            reasoningSummaryPane.appendChild(el);
            currentPart = { el, raw: '', timer: null };
        }
        return currentPart;
    }
    function renderCurrentPart(final = false) {
        if (!currentPart) return;
        const html = renderMarkdown(currentPart.raw);
        currentPart.el.innerHTML = html + (final ? '' : '<span class="streaming-cursor">▍</span>');
        if (final) {
            currentPart.el.querySelectorAll('pre code').forEach(b => {
                try { hljs.highlightElement(b); } catch {}
            });
        }
    }
    function scheduleReasoningRender() {
        const p = currentPart;
        if (!p || p.timer) return;
        p.timer = setTimeout(() => {
            p.timer = null;
            renderCurrentPart(false);
            scrollToBottom();
        }, 60);
    }
    function finalizePart() {
        if (currentPart) {
            if (currentPart.timer) { clearTimeout(currentPart.timer); currentPart.timer = null; }
            renderCurrentPart(true);
        }
        currentPart = null;
    }

    // ===== Reasoning 本体テキスト =====
    let reasoningTextRaw = '';
    let reasoningTextTimer = null;
    function showReasoningTextTab() {
        if (reasoningTabs.hidden) reasoningTabs.hidden = false;
    }
    function renderReasoningText(final = false) {
        showReasoningTextTab();
        const html = renderMarkdown(reasoningTextRaw);
        reasoningTextPane.innerHTML = html + (final ? '' : '<span class="streaming-cursor">▍</span>');
        if (final) {
            reasoningTextPane.querySelectorAll('pre code').forEach(b => {
                try { hljs.highlightElement(b); } catch {}
            });
        }
    }
    function scheduleReasoningTextRender() {
        if (reasoningTextTimer) return;
        reasoningTextTimer = setTimeout(() => {
            reasoningTextTimer = null;
            renderReasoningText(false);
            scrollToBottom();
        }, 60);
    }

    // ===== Refusal =====
    let refusalRaw = '';
    function showRefusal(text) {
        refusalRaw += text;
        refusalBanner.hidden = false;
        refusalText.textContent = refusalRaw;
    }

    // ===== MCP ツール呼び出しの DOM 管理 =====
    const toolPanels = new Map();
    const ensureToolsVisible = () => { if (toolsEl.hidden) toolsEl.hidden = false; };

    function createToolPanel(index, name, server) {
        ensureToolsVisible();
        const root = document.createElement('div');
        root.className = 'tool-call running';
        root.innerHTML = `
            <div class="tool-header">
                <span class="tool-spinner"></span>
                <svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>
                <svg class="tool-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z"/></svg>
                <span class="tool-name"></span>
                <span class="tool-server"></span>
                <span class="tool-status">${escapeHtml(t('toolRunning'))}</span>
            </div>
            <div class="tool-body">
                <div class="tool-section">
                    <div class="tool-section-title">${escapeHtml(t('toolArgs'))}</div>
                    <pre class="tool-args"></pre>
                </div>
                <div class="tool-section tool-output-section" hidden>
                    <div class="tool-section-title">${escapeHtml(t('toolResult'))}</div>
                    <div class="tool-output"></div>
                </div>
            </div>`;
        root.querySelector('.tool-name').textContent = name || 'tool';
        root.querySelector('.tool-server').textContent = server ? `@ ${server}` : '';
        root.querySelector('.tool-header').addEventListener('click', () =>
            root.classList.toggle('open')
        );
        toolsEl.appendChild(root);
        const panel = {
            root,
            argsEl: root.querySelector('.tool-args'),
            outputEl: root.querySelector('.tool-output'),
            outputSection: root.querySelector('.tool-output-section'),
            statusEl: root.querySelector('.tool-status'),
            spinner: root.querySelector('.tool-spinner'),
            argsBuf: '',
        };
        toolPanels.set(index, panel);
        scrollToBottom();
        return panel;
    }

    function getOrCreatePanel(index, name, server) {
        return toolPanels.get(index) || createToolPanel(index, name, server);
    }

    let rawText = '';
    // ===== Text segments (preamble 分離表示用) =====
    // ツール呼び出しを振り起こした text_delta ストリームは複数セグメントに分かれるため、
    // text_done ごとに 1 つの <div class="text-segment"> を作成して追加する。
    // ツール呼び出しが始まった時点で、さかのぼり finalize されたセグメントは preamble と確定させる。
    // completed 時に最後のセグメントを「最終回答 (final)」に升格させる。
    const segments = [];
    let currentSeg = null;
    function ensureSegment() {
        if (currentSeg) return currentSeg;
        const el = document.createElement('div');
        el.className = 'text-segment streaming';
        // ツールパネルと同じタイムラインに掳入して時系列順を保つ
        ensureToolsVisible();
        toolsEl.appendChild(el);
        currentSeg = { el, text: '' };
        scrollToBottom();
        return currentSeg;
    }
    function finalizeSegment() {
        if (!currentSeg) return;
        try {
            currentSeg.el.innerHTML = renderMarkdown(currentSeg.text);
        } catch {
            currentSeg.el.textContent = currentSeg.text;
        }
        currentSeg.el.classList.remove('streaming');
        segments.push(currentSeg);
        currentSeg = null;
    }
    function markFinalizedAsPreambles() {
        // すでに finalize されているセグメントを全て preamble と確定
        segments.forEach(s => {
            if (!s.el.classList.contains('preamble') && !s.el.classList.contains('final')) {
                s.el.classList.add('preamble');
            }
        });
    }
    let renderTimer = null;
    const scheduleRender = () => {
        if (renderTimer) return;
        renderTimer = setTimeout(() => {
            renderTimer = null;
            if (!currentSeg) return;
            currentSeg.el.innerHTML = renderMarkdown(currentSeg.text)
                + '<span class="streaming-cursor">▍</span>';
            scrollToBottom();
        }, 60);
    };

    return {
        // ===== Lifecycle =====
        onLifecycle(payload) {
            const ph = payload.phase;
            if (ph === 'created') { setPhase('created', 'done'); setPhase('queued', 'active'); }
            else if (ph === 'queued') { setPhase('queued', 'active'); }
            else if (ph === 'in_progress') { markPhaseDone('queued'); setPhase('in_progress', 'active'); }
            else if (ph === 'completed') {
                ['queued', 'in_progress', 'reasoning', 'tool', 'text'].forEach(markPhaseDone);
                setPhase('completed', 'done');
            }
        },
        onIncomplete(payload) {
            incBanner.hidden = false;
            const reasonMap = {
                max_output_tokens: t('reasonMaxTokens'),
                content_filter: t('reasonContentFilter'),
                'max_tool_calls': t('reasonMaxTools'),
            };
            incText.textContent = reasonMap[payload.reason] || `${t('reasonOther')}: ${payload.reason}`;
        },

        // ===== Reasoning summary =====
        onReasoningDelta(text) {
            if (reasoningEl.hidden) {
                reasoningEl.hidden = false;
                reasoningEl.classList.add('open');
            }
            markPhaseDone('in_progress');
            setPhase('reasoning', 'active');
            const p = ensurePart();
            p.raw += text;
            scheduleReasoningRender();
            scrollToBottom();
        },
        onReasoningDone() { finalizePart(); },
        onReasoningPartAdded() { finalizePart(); },
        onReasoningPartDone() { finalizePart(); },

        // ===== Reasoning 本体テキスト =====
        onReasoningTextDelta(text) {
            if (reasoningEl.hidden) {
                reasoningEl.hidden = false;
                reasoningEl.classList.add('open');
            }
            showReasoningTextTab();
            reasoningTextRaw += text;
            scheduleReasoningTextRender();
        },
        onReasoningTextDone() {
            if (reasoningTextTimer) { clearTimeout(reasoningTextTimer); reasoningTextTimer = null; }
            renderReasoningText(true);
        },

        // ===== Refusal =====
        onRefusalDelta(text) { showRefusal(text); },
        onRefusalDone(refusal) {
            if (refusal && !refusalRaw) {
                refusalRaw = refusal;
                refusalBanner.hidden = false;
                refusalText.textContent = refusalRaw;
            }
        },

        // ===== Annotation (引用 URL) =====
        onAnnotation(ann) {
            if (!ann) return;
            const t = ann.type || '';
            // url_citation: title, url
            // file_citation: file_id, filename
            let title, url;
            if (t.includes('url')) {
                url = ann.url || ann.uri;
                title = ann.title || ann.name || url;
            } else if (t.includes('file')) {
                title = ann.filename || ann.title || ann.file_id;
                url = null;
            } else {
                title = ann.title || JSON.stringify(ann).slice(0, 80);
                url = ann.url;
            }
            if (!title) return;
            annotationsEl.hidden = false;
            const chip = document.createElement('a');
            chip.className = 'anno-chip';
            chip.target = '_blank';
            chip.rel = 'noopener';
            if (url) chip.href = url;
            chip.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <span class="anno-title"></span>`;
            chip.querySelector('.anno-title').textContent = title;
            annotationsList.appendChild(chip);
        },

        // ===== Cancel =====
        onCancelled() {
            contentEl.classList.remove('cursor');
            finalizePart();
            reasoningSpinner.style.display = 'none';
            const banner = document.createElement('div');
            banner.className = 'banner cancel-banner';
            banner.innerHTML = `<div class="banner-head">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>${escapeHtml(t('cancelTitle'))}</span></div>`;
            div.querySelector('.msg-body').appendChild(banner);
        },

        // ===== MCP ハンドラ =====
        onMcpListTools(payload) {
            ensureToolsVisible();
            markPhaseDone('in_progress');
            setPhase('tool', 'active');
            const root = document.createElement('div');
            root.className = 'tool-call mcp-list';
            const list = (payload.tools || [])
                .map(t => `<li><code>${escapeHtml(t.name)}</code> <span>${escapeHtml(t.description || '')}</span></li>`)
                .join('');
            root.innerHTML = `
                <div class="tool-header">
                    <svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                    <span class="tool-name">${escapeHtml(t('mcpListLabel'))}</span>
                    <span class="tool-server">@ ${escapeHtml(payload.server_label || '')}</span>
                    <span class="tool-status">${(payload.tools || []).length} ${escapeHtml(t('toolsSuffix'))}</span>
                </div>
                <div class="tool-body"><ul class="mcp-tool-list">${list}</ul></div>`;
            root.querySelector('.tool-header').addEventListener('click', () => root.classList.toggle('open'));
            toolsEl.appendChild(root);
            scrollToBottom();
        },
        onMcpCallStart(payload) {
            markPhaseDone('reasoning');
            setPhase('tool', 'active');
            // この直前に text_done したセグメントは preamble と確定
            markFinalizedAsPreambles();
            ensureToolsVisible();
            const p = createToolPanel(payload.index, payload.name, payload.server_label);
            p.root.classList.add('open');
        },
        onMcpArgsDelta(payload) {
            const p = getOrCreatePanel(payload.index, '', '');
            p.argsBuf += payload.delta || '';
            p.argsEl.textContent = p.argsBuf;
            scrollToBottom();
        },
        onMcpArgsDone(payload) {
            const p = getOrCreatePanel(payload.index, '', '');
            try {
                p.argsEl.textContent = JSON.stringify(JSON.parse(payload.arguments), null, 2);
            } catch {
                p.argsEl.textContent = payload.arguments || p.argsBuf;
            }
        },
        onMcpCallProgress(payload) {
            const p = getOrCreatePanel(payload.index, '', '');
            p.statusEl.textContent = t('toolRunning');
        },
        onMcpCallDone(payload) {
            const p = getOrCreatePanel(payload.index, payload.name, payload.server_label);
            p.spinner.style.display = 'none';
            p.root.classList.remove('running');
            if (payload.error) {
                p.root.classList.add('failed');
                p.statusEl.textContent = t('toolFailed');
                p.outputSection.hidden = false;
                p.outputEl.innerHTML = `<pre class="tool-error">${escapeHtml(payload.error)}</pre>`;
            } else {
                p.root.classList.add('done');
                p.statusEl.textContent = t('toolDone');
                p.outputSection.hidden = false;
                // 結果を JSON 整形 + 折り畳み
                let pretty = payload.output || '';
                try { pretty = JSON.stringify(JSON.parse(pretty), null, 2); } catch {}
                p.outputEl.innerHTML = `<pre class="tool-result">${escapeHtml(pretty)}</pre>`;
                // デフォルトで折りたたむ（クリックで開く）
                p.root.classList.remove('open');
            }
            scrollToBottom();
        },
        onMcpCallFailed(payload) {
            const p = getOrCreatePanel(payload.index, '', '');
            p.spinner.style.display = 'none';
            p.root.classList.remove('running');
            p.root.classList.add('failed');
            p.statusEl.textContent = t('toolFailed');
            p.outputSection.hidden = false;
            p.outputEl.innerHTML = `<pre class="tool-error">${escapeHtml(payload.error)}</pre>`;
        },

        // ===== Tool Search ハンドラ =====
        onToolSearchStart(payload) {
            ensureToolsVisible();
            markPhaseDone('in_progress');
            setPhase('tool', 'active');
            markFinalizedAsPreambles();
            const root = document.createElement('div');
            root.className = 'tool-call running tool-search-call';
            root.dataset.tsIndex = String(payload.index);
            root.innerHTML = `
                <div class="tool-header">
                    <span class="tool-spinner"></span>
                    <svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>
                    <svg class="tool-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                    <span class="tool-name">${escapeHtml(t('toolSearchTitle'))}</span>
                    <span class="tool-server">@ tool_search</span>
                    <span class="tool-status">${escapeHtml(t('toolRunning'))}</span>
                </div>
                <div class="tool-body">
                    <div class="tool-section ts-query-section" hidden>
                        <div class="tool-section-title">${escapeHtml(t('toolSearchQueryLabel'))}</div>
                        <pre class="ts-query"></pre>
                    </div>
                    <div class="tool-section ts-result-section" hidden>
                        <div class="tool-section-title">${escapeHtml(t('toolSearchResolved'))}</div>
                        <div class="ts-namespaces"></div>
                    </div>
                </div>`;
            root.querySelector('.tool-header').addEventListener('click', () => root.classList.toggle('open'));
            root.classList.add('open');
            toolsEl.appendChild(root);
            scrollToBottom();
        },
        onToolSearchDone(payload) {
            const root = toolsEl.querySelector(`.tool-search-call[data-ts-index="${payload.index}"]`);
            if (!root) return;
            root.classList.remove('running');
            root.classList.add('done');
            root.querySelector('.tool-spinner').style.display = 'none';
            root.querySelector('.tool-status').textContent = t('toolDone');
            if (payload.query) {
                const sec = root.querySelector('.ts-query-section');
                sec.hidden = false;
                root.querySelector('.ts-query').textContent = payload.query;
            }
        },
        onToolSearchOutput(payload) {
            // 別アイテムなので、対応する tool_search_call を直近から探す
            const calls = toolsEl.querySelectorAll('.tool-search-call');
            const root = calls[calls.length - 1];
            if (!root) return;
            const sec = root.querySelector('.ts-result-section');
            const list = root.querySelector('.ts-namespaces');
            sec.hidden = false;
            list.innerHTML = '';
            (payload.namespaces || []).forEach(ns => {
                const nsEl = document.createElement('div');
                nsEl.className = 'ts-namespace';
                const tools = (ns.tools || []).map(tt => `
                    <li>
                        <code>${escapeHtml(tt.name)}</code>
                        ${tt.defer_loading ? `<span class="ts-defer"></span>` : ''}
                    </li>`).join('');
                nsEl.innerHTML = `
                    <div class="ts-ns-head"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg><strong>${escapeHtml(ns.name)}</strong></div>
                    <ul class="ts-tool-list">${tools}</ul>`;
                list.appendChild(nsEl);
            });
            // i18n のラベル差し替え
            list.querySelectorAll('.ts-defer').forEach(el => el.textContent = t('toolSearchDeferBadge'));
            scrollToBottom();
        },

        // ===== Function call (tool_search 経由 / 一般) =====
        onFunctionCallStart(payload) {
            ensureToolsVisible();
            markPhaseDone('reasoning');
            setPhase('tool', 'active');
            markFinalizedAsPreambles();
            const root = document.createElement('div');
            root.className = 'tool-call running function-call';
            root.dataset.fcIndex = String(payload.index);
            const displayName = payload.namespace ? `${payload.namespace}.${payload.name}` : payload.name;
            root.innerHTML = `
                <div class="tool-header">
                    <span class="tool-spinner"></span>
                    <svg class="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>
                    <svg class="tool-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <span class="tool-name"></span>
                    <span class="tool-server">${escapeHtml(t('functionCallTitle'))}</span>
                    <span class="tool-status">${escapeHtml(t('toolRunning'))}</span>
                </div>
                <div class="tool-body">
                    <div class="tool-section">
                        <div class="tool-section-title">${escapeHtml(t('toolArgs'))}</div>
                        <pre class="tool-args"></pre>
                    </div>
                    <div class="tool-section tool-output-section" hidden>
                        <div class="tool-section-title">${escapeHtml(t('toolResult'))} <span class="fc-mock-note">${escapeHtml(t('functionMockNote'))}</span></div>
                        <pre class="tool-output"></pre>
                    </div>
                </div>`;
            root.querySelector('.tool-name').textContent = displayName;
            root.querySelector('.tool-header').addEventListener('click', () => root.classList.toggle('open'));
            root.classList.add('open');
            toolsEl.appendChild(root);
            scrollToBottom();
        },
        onFunctionArgsDelta(payload) {
            const root = toolsEl.querySelector(`.function-call[data-fc-index="${payload.index}"]`);
            if (!root) return;
            const argsEl = root.querySelector('.tool-args');
            argsEl.textContent = (argsEl.textContent || '') + (payload.delta || '');
        },
        onFunctionArgsDone(payload) {
            const root = toolsEl.querySelector(`.function-call[data-fc-index="${payload.index}"]`);
            if (!root) return;
            const argsEl = root.querySelector('.tool-args');
            try {
                argsEl.textContent = JSON.stringify(JSON.parse(payload.arguments || '{}'), null, 2);
            } catch {
                argsEl.textContent = payload.arguments || argsEl.textContent;
            }
        },
        onFunctionCallDone(payload) {
            const root = toolsEl.querySelector(`.function-call[data-fc-index="${payload.index}"]`);
            if (!root) return;
            const displayName = payload.namespace ? `${payload.namespace}.${payload.name}` : payload.name;
            root.querySelector('.tool-name').textContent = displayName;
            const argsEl = root.querySelector('.tool-args');
            if (payload.arguments) {
                try {
                    argsEl.textContent = JSON.stringify(JSON.parse(payload.arguments), null, 2);
                } catch {
                    argsEl.textContent = payload.arguments;
                }
            }
        },
        onFunctionCallResult(payload) {
            const root = toolsEl.querySelector(`.function-call[data-fc-index="${payload.index}"]`);
            if (!root) return;
            root.classList.remove('running');
            root.classList.add('done');
            root.querySelector('.tool-spinner').style.display = 'none';
            root.querySelector('.tool-status').textContent = t('toolDone');
            const sec = root.querySelector('.tool-output-section');
            const outEl = root.querySelector('.tool-output');
            sec.hidden = false;
            let pretty = payload.output || '';
            try { pretty = JSON.stringify(JSON.parse(pretty), null, 2); } catch {}
            outEl.textContent = pretty;
            // 折りたたんで表示
            root.classList.remove('open');
            scrollToBottom();
        },

        onTextDelta(text) {
            // 推論が完了したら panel を閉じてステータスを「完了」へ
            if (!reasoningEl.hidden && reasoningEl.classList.contains('running')) {
                finalizePart();
                reasoningEl.classList.remove('running');
                reasoningEl.classList.add('done');
                reasoningSpinner.style.display = 'none';
                reasoningLabel.textContent = t('reasoningView');
                reasoningStatus.textContent = t('reasoningDone');
                reasoningEl.classList.remove('open');
            }
            markPhaseDone('reasoning');
            markPhaseDone('tool');
            setPhase('text', 'active');
            contentEl.classList.remove('cursor');
            rawText += text;
            ensureSegment();
            currentSeg.text += text;
            scheduleRender();
        },
        onTextDone() {
            if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
            finalizeSegment();
            // 最新セグメントに対してハイライト・ダイアグラム描画
            const last = segments[segments.length - 1];
            if (last) {
                last.el.querySelectorAll('pre code').forEach(b => {
                    try { hljs.highlightElement(b); } catch {}
                });
                renderMermaidIn(last.el).then(scrollToBottom);
            }
        },
        onCompleted(payload) {
            contentEl.classList.remove('cursor');
            finalizePart();
            if (!reasoningEl.hidden && reasoningEl.classList.contains('running')) {
                reasoningEl.classList.remove('running');
                reasoningEl.classList.add('done');
                reasoningSpinner.style.display = 'none';
                reasoningLabel.textContent = t('reasoningView');
                reasoningStatus.textContent = t('reasoningDone');
            }
            // 未 finalize のセグメントが残っていたら閉じる
            if (currentSeg) finalizeSegment();
            // 最後のセグメントを final に昇格し、toolsEl から contentEl へ移動
            // (それ以前は preamble として toolsEl にツールパネルと交互に残す)
            if (segments.length > 0) {
                segments.slice(0, -1).forEach(s => {
                    if (!s.el.classList.contains('final')) s.el.classList.add('preamble');
                });
                const last = segments[segments.length - 1];
                last.el.classList.remove('preamble', 'streaming');
                last.el.classList.add('final');
                // 最終セグメントだけ本文エリアへ移動
                if (last.el.parentElement !== contentEl) {
                    contentEl.appendChild(last.el);
                }
                // 最終セグメントのコードハイライトを再適用
                last.el.querySelectorAll('pre code').forEach(b => {
                    try { hljs.highlightElement(b); } catch {}
                });
                renderMermaidIn(last.el);
            }
            if (payload.usage) {
                const u = payload.usage;
                usageEl.hidden = false;
                usageEl.textContent = I18N[currentLang].usageFmt(u);
            }
        },
        onError(msg) {
            contentEl.classList.remove('cursor');
            const err = document.createElement('div');
            err.style.color = 'var(--danger)';
            err.style.marginTop = '6px';
            err.textContent = `${t('errorPrefix')}: ${msg}`;
            div.querySelector('.msg-body').appendChild(err);
        }
    };
}

function scrollToBottom() {
    $messages.scrollTop = $messages.scrollHeight;
}

function setStreaming(on) {
    streaming = on;
    $send.disabled = on;
    $send.style.display = on ? 'none' : 'grid';
    $input.disabled = on;
    if ($cancel) $cancel.hidden = !on;
    $status.className = 'status' + (on ? ' streaming' : '');
    $status.textContent = on ? t('responding') : '';
}

async function cancelStream() {
    if (!streaming) return;
    try {
        await fetch('/api/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: SESSION_ID }),
        });
    } catch {}
    if (abortCtrl) {
        try { abortCtrl.abort(); } catch {}
    }
}

if ($cancel) {
    $cancel.addEventListener('click', cancelStream);
}

async function sendMessage(text) {
    addUserMessage(text);
    const handlers = addAssistantMessage();
    setStreaming(true);
    abortCtrl = new AbortController();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                effort: getEffort(),
                previous_response_id: previousResponseId,
                use_mcp: getMcpEnabled(),
                use_tool_search: getToolSearchEnabled(),
                show_reasoning_text: getReasoningTextEnabled(),
                verbosity: getVerbosity(),
                use_preambles: getPreamblesEnabled(),
                session_id: SESSION_ID,
            }),
            signal: abortCtrl.signal,
        });

        if (!res.ok || !res.body) {
            throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // SSE フレームを分割（\n\n 区切り）
            let idx;
            while ((idx = buffer.indexOf('\n\n')) !== -1) {
                const frame = buffer.slice(0, idx);
                buffer = buffer.slice(idx + 2);
                handleSSEFrame(frame, handlers);
            }
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            handlers.onCancelled();
        } else {
            handlers.onError(e.message || String(e));
            $status.className = 'status error';
            $status.textContent = t('errorMsg');
        }
    } finally {
        setStreaming(false);
        abortCtrl = null;
    }
}

function handleSSEFrame(frame, handlers) {
    let event = 'message';
    let data = '';
    for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    if (!data) return;

    let payload;
    try { payload = JSON.parse(data); } catch { return; }

    switch (event) {
        case 'lifecycle': handlers.onLifecycle(payload); break;
        case 'incomplete': handlers.onIncomplete(payload); break;
        case 'reasoning_delta': handlers.onReasoningDelta(payload.delta); break;
        case 'reasoning_done': handlers.onReasoningDone(); break;
        case 'reasoning_part_added': handlers.onReasoningPartAdded(); break;
        case 'reasoning_part_done': handlers.onReasoningPartDone(); break;
        case 'reasoning_text_delta': handlers.onReasoningTextDelta(payload.delta); break;
        case 'reasoning_text_done': handlers.onReasoningTextDone(); break;
        case 'refusal_delta': handlers.onRefusalDelta(payload.delta); break;
        case 'refusal_done': handlers.onRefusalDone(payload.refusal); break;
        case 'annotation': handlers.onAnnotation(payload.annotation); break;
        case 'text_delta': handlers.onTextDelta(payload.delta); break;
        case 'text_done': handlers.onTextDone(); break;
        case 'mcp_list_tools': handlers.onMcpListTools(payload); break;
        case 'mcp_call_start': handlers.onMcpCallStart(payload); break;
        case 'mcp_args_delta': handlers.onMcpArgsDelta(payload); break;
        case 'mcp_args_done': handlers.onMcpArgsDone(payload); break;
        case 'mcp_call_progress': handlers.onMcpCallProgress(payload); break;
        case 'mcp_call_done': handlers.onMcpCallDone(payload); break;
        case 'mcp_call_failed': handlers.onMcpCallFailed(payload); break;
        case 'tool_search_call_start': handlers.onToolSearchStart(payload); break;
        case 'tool_search_call_done': handlers.onToolSearchDone(payload); break;
        case 'tool_search_output': handlers.onToolSearchOutput(payload); break;
        case 'function_call_start': handlers.onFunctionCallStart(payload); break;
        case 'function_args_delta': handlers.onFunctionArgsDelta(payload); break;
        case 'function_args_done': handlers.onFunctionArgsDone(payload); break;
        case 'function_call_done': handlers.onFunctionCallDone(payload); break;
        case 'function_call_result': handlers.onFunctionCallResult(payload); break;
        case 'completed':
            previousResponseId = payload.response_id;
            handlers.onCompleted(payload);
            break;
        case 'error': handlers.onError(payload.message); break;
    }
}

$form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (streaming) return;
    const text = $input.value.trim();
    if (!text) return;
    $input.value = '';
    $input.style.height = 'auto';
    sendMessage(text);
});
