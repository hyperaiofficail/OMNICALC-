# OmniCalc AI Platform - Design Document

## Executive Summary
OmniCalc AI is a world-class professional AI platform integrating 5,000+ calculators into a single intelligent system. It is designed to feel like an AI reasoning engine rather than a traditional calculator app, prioritizing extreme accuracy, AI-driven intelligence, and Gemini-level UI/UX.

---

## 1. High-Level Architecture Design
The platform follows a modular, layered architecture to ensure separation of concerns, scalability, and maintainability.

### Core Layers
1.  **UI / UX Layer (Presentation)**
    *   Handles user interaction (chat, formula input, visual output).
    *   Responsible for "Gemini-inspired" rendering.
    *   Completely decoupled from logic.
2.  **AI Interpretation Layer (Router)**
    *   Analyzes user input (Natural Language or Formula).
    *   Detects intent and extracts parameters.
    *   Selects the appropriate Calculator Module.
    *   *Constraint:* Never performs the final calculation itself.
3.  **Deterministic Calculation Engine (Execution)**
    *   Orchestrates the execution of the selected calculator module.
    *   Ensures thread safety, precision handling, and error trapping.
4.  **Calculator Module System (Plugins)**
    *   A collection of independent, versioned calculator modules (e.g., Scientific, Finance, Engineering).
    *   Each module provides metadata (keywords, parameters) and pure execution logic.
5.  **Data & Caching Layer**
    *   Manages ephemeral state (current session) and persistent history.
    *   Caches results of frequent calculations.
6.  **Infrastructure & Scaling Layer**
    *   Handles module loading, service workers, and potential server-side offloading.

---

## 2. UI / UX Design Principles
*   **Gemini-Inspired Minimalism:** Clean whitespace, modern typography, card-based results.
*   **Search-First Experience:** The primary interface is a smart input field (Chat/Search) that accepts both text and math.
*   **Zero Clutter:** Advanced controls appear only when needed.
*   **Result Cards:** Outputs are presented as interactive cards (e.g., a graph card, a table card, a simple result card).
*   **Adaptive Theme:** Automatic Dark/Light mode based on system preference.
*   **Responsive:** Mobile-first design that scales perfectly to desktop.

---

## 3. AI Interpretation Design
The "Brain" of the system.
*   **Input Parsing:** Uses regex/heuristics (and eventually LLM integration) to understand "Calculate the mortgage for 500k at 3%" vs "sin(45)".
*   **Intent Routing:** Maps parsed intent to a specific `CalculatorModule` ID.
*   **Parameter Extraction:** Normalizes inputs (e.g., converts "500k" to `500000`).

---

## 4. Deterministic Calculation Engine Design
The "Muscle" of the system.
*   **Pure Functions:** Execution logic is side-effect free.
*   **Precision:** Uses libraries (like `Decimal.js` or `BigInt`) where standard floating-point fails.
*   **Safety:** Execution runs in a sandboxed environment (or strict context) to prevent arbitrary code execution.

---

## 5. Calculator Module System
A plugin-based framework.
*   **Interface:**
    ```typescript
    interface CalculatorModule {
      id: string;
      tags: string[];
      description: string;
      validate(input: any): boolean;
      calculate(input: any): Result;
    }
    ```
*   **Discovery:** Modules register themselves in a central `Registry`.
*   **Extensibility:** New domains (Crypto, Health) are added by creating new modules without touching the core engine.

---

## 6. Performance-First Design
*   **Lazy Loading:** Specific calculator modules are loaded only when required.
*   **Web Workers:** Heavy computations run off the main thread to keep UI smooth.
*   **Memoization:** Repeats of identical queries return cached results instantly.

---

## 7. Data & Caching Design
*   **In-Memory Cache:** LRU cache for recent results.
*   **Versioning:** Cache keys include module version to ensure correctness after updates.

---

## 8. Scalability & Infrastructure
*   **Client-Side Focus:** Initial architecture focuses on a heavy client (PWA) to reduce server costs and latency.
*   **API Ready:** The Core Engine can be wrapped in a Node.js/Python API for server-side deployment.

---

## 9. Security & Reliability
*   **Input Sanitization:** Strict validation before passing data to `eval()` or calculation logic.
*   **No Hallucinations:** The AI Router *suggests* the tool, but the *tool* (Math Logic) provides the answer.

---

## 10. Design Outcome
The goal is a platform that feels **Instant**, **Unbreakable**, and **Professional**.
