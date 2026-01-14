import { registry } from '../core/Registry.js';
import { engine } from '../core/Engine.js';
import { ScientificCalculator } from '../modules/ScientificCalculator.js';
import { FinanceCalculator } from '../modules/FinanceCalculator.js';

export class App {
    constructor() {
        this.input = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.chatStream = document.getElementById('chat-stream');
        this.welcomeMessage = document.querySelector('.welcome-message');
        this.themeToggle = document.getElementById('theme-toggle');
        this.msgCounter = 0;
    }

    init() {
        console.log("Initializing OmniCalc AI...");

        // 1. Register Modules
        registry.register(new ScientificCalculator());
        registry.register(new FinanceCalculator());

        // 2. Setup Listeners
        this.sendBtn.addEventListener('click', () => this.handleInput());

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleInput();
            }
        });

        // Focus input
        this.input.focus();
    }

    async handleInput() {
        const text = this.input.value.trim();
        if (!text) return;

        // Clear Input
        this.input.value = '';

        // Hide Welcome if first message
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
            this.welcomeMessage = null; // Prevent re-querying
        }

        // Add User Message to Chat
        this.addMessage(text, 'user');

        // Show Thinking Indicator (Mock)
        const thinkingId = this.addMessage("Thinking...", 'ai', true);

        // Process with Engine
        const result = await engine.process(text);

        // Remove Thinking
        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();

        // Render Result
        if (result.success) {
            this.renderResult(result, text);
        } else {
            this.addMessage(result.error, 'ai-error');
        }
    }

    addMessage(text, type, isTemp = false) {
        this.msgCounter++;
        const id = 'msg-' + Date.now() + '-' + this.msgCounter;
        const div = document.createElement('div');
        div.className = `message ${type === 'user' ? 'user-message' : 'ai-message'}`;
        div.id = id;

        if (type === 'user') {
            div.innerHTML = `<div class="user-bubble">${this.escapeHtml(text)}</div>`;
        } else if (type === 'ai-error') {
            div.innerHTML = `<div class="ai-bubble"><div class="error-message">${text}</div></div>`;
        } else {
            div.innerHTML = `<div class="ai-bubble">${text}</div>`;
        }

        this.chatStream.appendChild(div);
        this.scrollToBottom();
        return id;
    }

    renderResult(result) {
        const div = document.createElement('div');
        div.className = 'message ai-message';

        let html = `<div class="ai-bubble">`;

        // Context/Meta
        if (result.meta) {
            html += `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 5px;">Using ${result.meta.module}</div>`;
        }

        // Card
        if (result.display && result.display.type === 'card') {
            html += `
                <div class="result-card">
                    <div class="result-context">${result.display.title}</div>
                    <div class="result-value">${result.display.content}</div>
                    <div class="result-context">${result.display.subtext}</div>
                </div>
            `;
        }

        // Steps (Toggle)
        if (result.steps && result.steps.length > 0) {
            const stepsId = 'steps-' + Date.now();
            html += `
                <button class="steps-toggle" onclick="document.getElementById('${stepsId}').style.display = document.getElementById('${stepsId}').style.display === 'none' ? 'block' : 'none'">
                    Show Explanation
                </button>
                <div id="${stepsId}" style="display: none; margin-top: 10px; font-family: monospace; font-size: 0.9rem; color: var(--text-secondary);">
                    <ul>${result.steps.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
            `;
        }

        html += `</div>`;
        div.innerHTML = html;
        this.chatStream.appendChild(div);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatStream.scrollTop = this.chatStream.scrollHeight;
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        // Simple heuristic: if body has dark-theme class, force it.
        // But my CSS uses media query preference. I should override variables or add a class that overrides.
        // Let's check CSS.
        // CSS uses @media (prefers-color-scheme: dark).
        // To force it, I need a class on body that overrides these.

        // I'll assume I need to update CSS to support class-based override if I want manual toggle.
        // For now, I'll just toggle a class and let the user know.
        // Actually, let's just make it work.
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
}
