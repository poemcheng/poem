# TRC 2026 Logistics Digital Twin V5

This version is rebuilt from the uploaded TRC2026 package and the official logistics competition manual rather than the earlier stylized demo layout.

## Source-grounded competition flow

- 5-minute preparation: order confirmation, robot checks, program loading, A/B communication and safety confirmation.
- After START, Robot A and Robot B execute in parallel.
- Robot A: A start / empty pallet -> 130 cm narrow lane and A1-A3 -> 8-degree loaded ramp -> C1-C3 dynamic obstacles -> D handshake -> shipping zone -> D end.
- Robot B: E start -> scan physical Basket-1..6 QR -> look up the pre-drawn order -> recognize D/E/F/G material-class QR -> pick/place -> carry each completed basket to D -> stack 2 baskets/layer x 3 layers -> handshake -> E end.
- All six basket QR faces are kept toward the field interior after stacking.
- The competition clock continues during simulated pause/E-stop; the 20-minute time limit remains authoritative.

## Source dimensions represented

- A: 14.040 x 4.940 m; selectable lanes 1.30 / 1.47 / 1.57 m.
- B: 14.040 x 4.970 m; 8-degree / 4-degree / flat lanes; 1.64 m clear width.
- C: 13.870 x 4.970 m; three 0.4 x 0.4 x 0.8 m carts moving at 0.8 m/s.
- D: 13.870 x 4.940 m.
- E: 6.940 x 2.940 m.
- Pallet: 1.10 x 1.10 x 0.17 m.
- Basket: 0.62 x 0.43 x 0.24 m.

## Scoring represented

- Smart logistics delivery: 68 points.
- Smart sorting / shipping: 65 points.
- Combined system-integration display: 133 points.

## Robot model

- Robot A: autonomous forklift engineering proxy.
- Robot B: MIO AMR GLB engineering asset plus UR7e URDF/kinematic model.
- RGB/depth tool-frame visualization and MoveIt2-style joint trajectories are included for the digital-twin demonstration.

## Run locally

```bash
python -m http.server 8080
```

Then open the V5 directory in the browser through `http://localhost:8080/`.
