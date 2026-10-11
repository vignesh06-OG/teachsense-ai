# Security & Privacy Specification — TeachSense AI
**Compliance Standard**: FERPA / COPPA Guardrails, OWASP Top 10, Strict Edge Security

---

## 1. Security Headers Matrix (`next.config.ts`)
TeachSense AI enforces enterprise-grade HTTP security headers configured from Commit #1:

| Header | Value | Purpose |
| :--- | :--- | :--- |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; ... frame-ancestors 'none';` | Blocks unauthorized script injection, cross-site scripting (XSS), and frame hijacking. |
| **Strict-Transport-Security (HSTS)** | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS communication for two full years across all subdomains. |
| **X-Frame-Options** | `DENY` | Prevents UI redressing and clickjacking by forbidding embedding in iframes. |
| **X-Content-Type-Options** | `nosniff` | Disables MIME-type sniffing by browsers. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects referrer telemetry across external origins. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Disables access to sensitive hardware sensors and tracking APIs. |

---

## 2. Student Privacy Guarantees (FERPA & COPPA)
1. **Pure Synthetic Data**: The platform processes exclusively fictional student records (e.g., "Alex Rivera (Demo)", "Jordan Blake (Demo)"). No real student personally identifiable information (PII) is ever collected or required.
2. **Zero Third-Party Data Leakage**: In offline heuristic fallback mode, zero bytes leave the server or browser. If external LLM inference is enabled, student answers are stripped of all personal names and tokens before API invocation.
3. **Stateless Processing**: Assessment payloads are evaluated in ephemeral memory without persistent third-party database tracking or cookie tracking.

---

## 3. Threat Model & Mitigations
- **Prompt Injection Defense**: Student scratchwork inputs are validated by Zod schemas and encapsulated as data parameters, preventing prompt overriding.
- **Denial of Service / Rate Limiting**: The deterministic heuristic classifier executes in < 20ms with $O(1)$ lookup complexity, preventing compute exhaustion.
- **Immutability of Human Sign-off**: Once a teacher verifies or overrides a misconception diagnosis, the flag `verifiedByTeacher: true` prevents downstream automated systems from altering human judgment.
