# TRC 2026 Logistics Digital Twin V6

Safety-supervised, demo-oriented digital twin for the TRC 2026 logistics system-integration task.

## V6 changes

- Rebuilt A–E geometry from the uploaded TRC2026 dimensions/assembly data rather than toy-like closed zone boxes.
- Robot A uses a preflight-validated A-zone path and predictive C1/C2/C3 dynamic-obstacle windows plus a runtime minimum-distance guard.
- D-zone uses a mutual-exclusion token: A parks first; B transfers baskets one-by-one; after handshake B must clear D before A can ship.
- Robot B completes all six baskets in E before transfer to D; item and basket transfers are animated rather than teleported.
- Voice/text control uses deterministic intents and rejects ambiguous or unsafe state transitions.
- HMI exposes mission state, D-zone interlock, safety clearance, recognized speech, intent, plan/preconditions, RGB-D, score and E-stop state.

## Demo commands

- `開始完整流程`
- `執行配送任務`
- `執行分揀任務`
- `暫停`
- `繼續`
- `重置`
- `緊急停止`
- `解除急停`
- `看 D 區鏡頭`
- `看 E 區鏡頭`
- `總覽`

Unsafe shortcuts such as `A機直接前往D區` are intentionally rejected by the Safety Supervisor because they violate task-state preconditions.

## Safety logic

C-zone uses predictive time-window authorization before crossing each 0.8 m/s moving obstacle and retains a runtime minimum-clearance abort/retry guard. D-zone is serialized using a token so Robot A and Robot B cannot occupy the transfer lane simultaneously.

The deployed page reuses the verified MIO/UR7e asset bundle from `../trc-mio-ur7e-demo-v5/assets.js`.
