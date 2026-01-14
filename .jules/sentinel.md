## 2025-05-15 - Input Validation in Calculator
**Vulnerability:** The calculator used `new Function()` (equivalent to `eval()`) to execute mathematical expressions. While the UI restricted input, the underlying function was vulnerable to arbitrary code execution if the input state was manipulated.
**Learning:** Even simple "client-side only" apps need input validation if they use dangerous functions like `eval`. Relying on UI constraints is insufficient security.
**Prevention:** I implemented a strict allowlist regex to validate the expression before passing it to the evaluation engine, ensuring only numbers and mathematical operators are executed.
