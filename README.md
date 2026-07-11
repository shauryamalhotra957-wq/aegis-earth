# Aegis Earth

Aegis Earth is a ship-ready public-good demo: a disaster resilience command center that turns noisy crisis signals into explainable risk scores, ranked interventions, equity checks, and a 72-hour response simulation.

It is intentionally self-contained. The core engine runs locally, the demo data is synthetic and documented, and optional live weather alerts can be pulled from the National Weather Service when the browser has network access.

## Why This Project

Emergency teams already have satellites, weather feeds, drone imagery, reports, maps, shelters, hospitals, and responder rosters. The difficult part is not "more data"; it is deciding what to do first, why that decision is fair, and how the plan changes when conditions worsen.

Aegis Earth demonstrates that bridge:

- Explainable multi-hazard risk scoring.
- Trust scoring for incoming reports.
- Resource allocation with cost, speed, fairness, and operational constraints.
- A 72-hour response simulator that compares projected outcomes.
- Exportable executive brief for decision rooms.
- Defensive input handling, typed data models, and unit tests.

## Run It

```bash
npm install
npm run dev
```

Then open the URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Verify It

```bash
npm test
npm run build
```

## Pitch It

The companion deck is saved at `docs/aegis-earth-pitch.pptx`. Use it for a five-minute professor or panel demo: it frames the problem, proves the product is real, explains the decision engine, and lists verification evidence.

## Research Anchors

This project was shaped by public disaster-data and AI-for-social-good research patterns:

- National Weather Service API documentation: https://www.weather.gov/documentation/services-web-api
- NASA FIRMS active fire API documentation: https://firms.modaps.eosdis.nasa.gov/api/
- NOAA/NCEI data access documentation: https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation
- Harvard Data-Smart disaster response AI overview: https://datasmart.hks.harvard.edu/ai-disaster-response-data
- "Generative AI for Social Impact" research preprint: https://arxiv.org/abs/2601.04238

## Safety Note

Aegis Earth is a research and portfolio demo. It is not an official emergency management system, and it should not be used as the sole basis for real emergency decisions without domain review, verified data, and institutional approval.
