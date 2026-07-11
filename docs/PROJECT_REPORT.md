# Aegis Earth Project Report

## Abstract

Aegis Earth is a browser-based disaster resilience command center. It demonstrates how emergency signals can be converted into explainable risk scoring, fairness-aware intervention planning, and 72-hour response simulation.

The project is intentionally scoped as a safe research demo: all default data is synthetic, optional live data comes from public weather alerts, and the interface clearly states that it is not an official emergency-management system.

## Research Question

Can a local, transparent decision engine help emergency leaders answer what to do first when hazards, infrastructure fragility, population exposure, and uncertain reports collide?

## System Overview

The app has four main layers:

- Data layer: synthetic regions, crisis signals, logistics hubs, and resources.
- Decision engine: risk scoring, trust scoring, optimization, simulation, and sanitization.
- Interface layer: command map, triage roster, scenario lab, trust feed, mission timeline, and equity guardrail.
- Verification layer: unit tests, UI tests, production build, dependency audit, architecture docs, and security notes.

## Algorithms

### Risk Scoring

Each region receives a score from:

- Base hazard intensity.
- Fresh signal pressure.
- Population exposure.
- Infrastructure fragility.
- Equity need.
- Cascade risk.

The output includes confidence and human-readable drivers so a reviewer can challenge the result.

### Signal Trust

Reports are scored by channel reliability, source confidence, recency, corroboration, and social-report discounting. Unverified social reports influence the model less than weather, satellite, hospital, or responder signals.

### Optimization

Candidate interventions are generated for each region-resource pair. The optimizer ranks actions by impact, speed, fairness, cost, scarcity, and operational constraints. It then selects missions under budget, team, and duplicate-resource limits.

### Scenario Simulation

The simulator projects response outcomes at six-hour intervals across 72 hours. It reacts to budget, team count, ethical floor, climate stress, infrastructure shock, public trust, and scenario mode.

## Safety And Ethics

Aegis Earth does not claim operational authority. It is a decision-support prototype and should not replace emergency agencies, verified local data, or human approval.

Safety controls include:

- Synthetic data by default.
- Optional public alert feed only.
- Sanitized executive brief export.
- No secrets or API keys.
- Defensive local-storage parsing.
- Documented threat model and production requirements.

## Verification Summary

Latest local verification:

- `npm test`: 6 test files, 13 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.
- Browser QA: app opened locally, no console errors, no horizontal overflow, scenario mode and region selection worked.
- Deck QA: final PPTX rendered to 8 slide images; independent layout bounds check found 0 out-of-canvas elements.

## Future Work

Production deployment would need:

- Authenticated agency workspaces.
- Verified geospatial and emergency data adapters.
- Role-based permissions.
- Audit logs.
- Human approval gates.
- Bias and fairness audits.
- Formal validation with emergency-management experts.
