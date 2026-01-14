import { Engine } from '../core/Engine.js';
import { registry } from '../core/Registry.js';
import { CacheManager } from '../core/Cache.js';
import { IntentParser } from '../ai/IntentParser.js';
import { calculators } from '../calculators/index.js';

class App {
    constructor() {
        this.engine = new Engine();
        this.cache = new CacheManager();
        this.parser = new IntentParser(registry);

        // Register calculators
        calculators.forEach(c => registry.register(c));

        this.currentExp = "0";
        this.isRadians = true;
        this.lastAns = 0;

        this.ui = {
            display: document.getElementById('curr-display'),
            prevDisplay: document.getElementById('prev-display'),
            radLabel: document.getElementById('rad-label'),
            degLabel: document.getElementById('deg-label'),
            aiInput: document.getElementById('ai-input'),
            calcSource: document.getElementById('calc-source'),
            perfMetrics: document.getElementById('perf-metrics')
        };

        this.bindEvents();
    }

    bindEvents() {
        // AI Input
        this.ui.aiInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                await this.handleAIRequest(this.ui.aiInput.value);
            }
        });

        // Toggle Rad/Deg
        document.getElementById('rad-deg-toggle').addEventListener('click', () => this.toggleMode());

        // Keypad Buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const value = btn.dataset.value;
                this.handleButton(action, value);
            });
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            // Prevent default if it's a calculator key to avoid scrolling etc if needed,
            // but for now let's just capture
            if((e.key >= 0 && e.key <= 9) || e.key === '.') this.insertText(e.key);
            if(e.key === 'Enter') this.calculate();
            if(e.key === 'Backspace') this.command('DEL');
            if(e.key === 'Escape') this.command('AC');
            if(['+','-','*','/','(',')','^'].includes(e.key)) this.insertText(e.key);
        });
    }

    async handleAIRequest(query) {
        this.ui.calcSource.innerText = "Analyzing Intent...";
        const start = performance.now();

        const intent = await this.parser.parse(query);
        const calculator = registry.get(intent.calculatorId);

        if (calculator) {
            this.ui.calcSource.innerText = `Calculator: ${calculator.name}`;

            // If we have params, calculate immediately
            if (Object.keys(intent.params).length > 0) {
                // Check cache first
                const cacheKey = this.cache.generateKey(intent.calculatorId, intent.params);
                let result = this.cache.get(cacheKey);

                let timeMs = 0;
                if (result) {
                     timeMs = performance.now() - start; // Just measuring overhead
                     this.ui.perfMetrics.innerText = `Latency: ${timeMs.toFixed(2)}ms (Cached)`;
                } else {
                    const res = calculator.calculate(this.engine, intent.params);
                    result = res.result;
                    timeMs = res.timeMs; // Engine time
                    this.cache.set(cacheKey, result);

                    // Total time including AI parsing
                    const totalTime = performance.now() - start;
                    this.ui.perfMetrics.innerText = `Latency: ${totalTime.toFixed(2)}ms (Engine: ${timeMs.toFixed(2)}ms)`;
                }

                this.currentExp = result.toString();
                this.ui.display.innerText = this.currentExp;
                this.ui.prevDisplay.innerText = query + " =";
                this.lastAns = result;
            } else {
                // Just switch context? Or invalid params?
                this.ui.display.innerText = "Input Needed";
            }
        } else {
            this.ui.calcSource.innerText = "Unknown Intent";
        }
    }

    handleButton(action, value) {
        switch(action) {
            case 'insert': this.insertText(value); break;
            case 'command': this.command(value); break;
            case 'calculate': this.calculate(); break;
            case 'mode': this.setMode(value); break;
            case 'func': this.insertFunc(value); break;
            case 'const': this.insertText(value === 'pi' ? 'pi' : 'e'); break;
        }
    }

    insertText(val) {
        if (this.currentExp === "0" && !isNaN(val)) {
            this.currentExp = val;
        } else if (this.currentExp === "Error") {
            this.currentExp = val;
        } else {
            this.currentExp += val;
        }
        this.updateScreen();
    }

    insertFunc(fn) {
        if (this.currentExp === "0") this.currentExp = "";

        switch(fn) {
            case 'sin': this.currentExp += "sin("; break;
            case 'cos': this.currentExp += "cos("; break;
            case 'tan': this.currentExp += "tan("; break;
            case 'ln': this.currentExp += "log("; break; // mathjs uses log for ln usually, log10 for base 10? Wait. Mathjs: log(x) is ln(x). log(x, 10) is base 10.
            case 'log': this.currentExp += "log10("; break;
            case 'sqrt': this.currentExp += "sqrt("; break;
            case '!': this.currentExp += "!"; break;
            case 'inv': this.currentExp += "asin("; break; // Simplify for demo
        }
        this.updateScreen();
    }

    command(cmd) {
        if (cmd === 'AC') {
            this.currentExp = "0";
            this.ui.prevDisplay.innerText = "Ans = " + this.lastAns;
        } else if (cmd === 'DEL') {
            if (this.currentExp.length > 1) {
                this.currentExp = this.currentExp.slice(0, -1);
            } else {
                this.currentExp = "0";
            }
        }
        this.updateScreen();
    }

    calculate() {
        this.ui.calcSource.innerText = "Calculator: Basic Math";
        const start = performance.now();

        let expression = this.currentExp;

        // Pre-process for trig mode
        // MathJS trig functions take radians. If we are in deg mode, we need to convert.
        // But doing string replacement is brittle.
        // Better: scope unit definitions or use 'deg' unit.
        // MathJS supports units: sin(45 deg).

        if (!this.isRadians) {
            // Crude regex to append ' deg' to numbers inside trig functions?
            // Or simpler: define global config?
            // MathJS doesn't have a global switch for trig functions mode easily without units.
            // Let's inject a transform or assume user input needs handling.
            // For now, let's just stick to the previous logic of manual conversion if needed,
            // OR use the mathjs unit feature which is powerful.

            // Let's try to append ' deg' to standalone numbers if we can... no that's hard.
            // Let's manually replace sin(x) with sin(x deg) ?
            // Regex replacer:
            expression = expression.replace(/(sin|cos|tan|asin|acos|atan)\(([^)]+)\)/g, (match, fn, args) => {
                // If args is just a number, append deg
                if (!isNaN(args)) return `${fn}(${args} deg)`;
                return match;
            });
        }

        const res = this.engine.evaluate(expression);
        const end = performance.now();

        if (res.error) {
            this.currentExp = "Error";
            console.error(res.error);
        } else {
            this.lastAns = res.result;
            this.ui.prevDisplay.innerText = this.currentExp + " =";
            this.currentExp = res.result.toString();
            this.ui.perfMetrics.innerText = `Latency: ${res.timeMs.toFixed(2)}ms`;
        }
        this.updateScreen();
    }

    updateScreen() {
        this.ui.display.innerText = this.currentExp;
    }

    toggleMode() {
        this.isRadians = !this.isRadians;
        this.updateModeUI();
    }

    setMode(mode) {
        this.isRadians = (mode === 'rad');
        this.updateModeUI();
    }

    updateModeUI() {
        this.ui.radLabel.className = this.isRadians ? 'active-mode' : 'inactive-mode';
        this.ui.degLabel.className = this.isRadians ? 'inactive-mode' : 'active-mode';
    }
}

// Initialize
const app = new App();
