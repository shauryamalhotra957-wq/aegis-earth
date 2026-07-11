# Data Sources

The app ships with synthetic crisis data so demos are repeatable and safe. The included records are realistic enough to exercise the engine, but they are not claims about real-time disasters.

## Optional Live Source

The `useLiveSignals` hook can call the National Weather Service active alerts endpoint for selected United States coordinates:

`https://api.weather.gov/alerts/active?point={lat},{lon}`

Those alerts are converted into the same signal model used by the local engine. If the request fails or the selected point is outside NWS coverage, the app continues using local synthetic signals.

## Future Production Sources

- NASA FIRMS for near-real-time fire detections.
- NOAA/NCEI for historical weather and climate features.
- Verified emergency management feeds for shelters, road closures, and hospital capacity.
- Human-in-the-loop field reports from trusted responder organizations.
