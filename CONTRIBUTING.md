# Contributing

## Local Setup

```bash
npm install
npm run dev
```

## Required Checks

Run before submitting changes:

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

## Engineering Rules

- Keep crisis data synthetic unless the source is documented.
- Add tests for engine behavior that changes risk, fairness, allocation, or scenario outcomes.
- Do not add secrets or private data.
- Keep recommendation logic explainable.
- Update `docs/SECURITY.md` if a change affects data flow or threat model.
