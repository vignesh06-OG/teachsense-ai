# Accessibility & Usability (WCAG 2.1 AA) — TeachSense AI

TeachSense AI is engineered to meet WCAG 2.1 Level AA accessibility standards, ensuring inclusive usability for all educators and evaluators.

---

## 1. Visual Accessibility & Contrast
- **Color Contrast**: All primary text (`#f8fafc`) against dark slate surfaces (`#020617` / `#0f172a`) maintains a contrast ratio exceeding **12:1**, well above the 4.5:1 WCAG AA minimum.
- **Color Independence**: Status indications (e.g. Approved vs Pending vs Uncertain) do not rely solely on color; every badge pairs semantic icons (`CheckCircle2`, `AlertTriangle`, `XCircle`) with clear text labels.
- **Focus Indicators**: Interactive elements feature high-visibility focus rings (`focus:ring-2 focus:ring-indigo-500/40`).

---

## 2. Keyboard Navigation
- All interactive controls (buttons, tabs, selects, modals, links) are natively keyboard focusable with logical tab orders (`tabindex=0`).
- Modal dialogs and review queues support `Escape` dismiss and `Enter` confirmation.
- Form inputs feature explicit associated `<label>` attributes and aria-describedby validation hints.

---

## 3. Screen Reader Compatibility
- Semantic HTML5 structure throughout (`<main>`, `<header>`, `<nav>`, `<section>`, `<footer>`, `<article>`, `<table>`, `<th>`, `<tr>`).
- Non-text elements (icons, badges, 3D Canvas) include accessible `aria-label` or role descriptors.
- The React Three Fiber 3D Canvas hero is contained inside an aria-hidden decorative wrapper so it does not interfere with screen readers.
