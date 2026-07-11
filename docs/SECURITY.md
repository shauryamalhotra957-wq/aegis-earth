# Security And Safety

## Threat Model

Aegis Earth is a browser-only demo. Primary risks are untrusted text in exported reports, malformed scenario inputs, privacy leakage from accidental live feeds, and over-trust in automated recommendations.

## Controls

- React escapes rendered text by default.
- `escapeHtml` is used before generating downloadable brief text.
- Scenario knobs are clamped and validated before the engine uses them.
- Optional live feed failures are contained and never block the local app.
- No secrets are required or stored.
- Local storage is parsed defensively and falls back to defaults on malformed data.

## Operational Warning

Real emergency deployment would require authenticated data sources, audit logs, role-based access control, agency validation, data-sharing agreements, adversarial testing, and formal human approval gates.
