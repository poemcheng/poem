# RailSafe Insight — Week 2 (2026-11-07)

W2 investigated two *candidate* North-Link Railway monitoring zones, not approved field assets. Internal W1 data yielded **8 candidate associations** (6 for Northlinkline_132 and 2 for Northlinkline_125) by route and kilometer overlap. Matching a kilometrage interval does NOT establish identical slope, side, geometry, or asset identity. No restricted TRA row-level data is included in this public repository.

## Evidence gates
- G1 source CRS: BLOCK; trial EPSG:3826/3828 conversions are unverified hypotheses.
- G2 confirmed slope asset identity: BLOCK; engineering review pending.
- G3 ASF real Sentinel-1 SLC scene ID: BLOCK; ASF API unreachable in this execution environment.
- G4 HyP3 interferograms / deformation: BLOCK; no jobs submitted, no real coherence or LOS displacement.
- Local metadata screening tests: 6/6 PASS (does not verify satellite data).

## Reproduce the first-pass screening
1. Run W1 ASF catalog search on a network-connected approved workstation.
2. Export scene metadata with `scene_id,relative_orbit,flight_direction,polarization,beam_mode,acquired_at,frame`.
3. Run `python week2_screen.py input_scenes.csv`.
4. Manually verify same look geometry, complete coverage, temporal/perpendicular baselines before any HyP3 processing.

This project is a **decision-support prototype**, never a railway signalling, intrusion-protection or safety-control system.
