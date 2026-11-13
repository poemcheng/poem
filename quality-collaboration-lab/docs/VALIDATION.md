# 本機驗證紀錄

日期：2026-11-13。版本：2026.11-teaching.1。

- Node.js v22.16.0：39項核心單元測試通過、0失敗。
- Chromium/Linux：9組UI工作流程檢查通過。涵蓋三站、待審狀態、配對CSV、活動JSON、自評不自動提交、匯出HTML重載、390px六視圖無橫向溢出、鍵盤焦點與無額外對外請求。
- 本機瀏覽器以`page.set_content`載入自包含HTML，因執行環境禁止file及loopback URL。這些測試不等同公開HTTPS或實體iPhone/Safari驗收。
- 公開HTTPS驗收須另執行`tests/live_test.py`，CI紀錄與artifact應另外查核，不能由本文件推定成功。
- 測試輸出CSV、JSON為自動測試的合成活動，不是真實受試資料。
- 開源程式是教學規則與玩具運動模型，沒有重跑DrawIQ原研究、原300組物理模擬、PPO、實體機器人或臨床訓練研究。
