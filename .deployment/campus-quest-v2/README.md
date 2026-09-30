# 朝陽校園探索 v2 — Web / Quest 3

本專案來自本次交付的 CYUT_CampusQuest_Realistic_v2.zip。

預定入口： https://poemcheng.github.io/poem/campus-quest-v2/

電腦：Chrome / Edge 開啟頁面，點選「進入校園」。WASD 移動、滑鼠拖曳環顧、E 互動、V 切換視角、Tab 任務、M 地圖。

Quest 3：Meta Quest Browser 開啟相同的 HTTPS 網址，點選「在 Quest 3 開啟 VR」。左握把傳送、右扳機互動、右搖桿分段轉向、左 X 任務平板。首次載入需下載場景與材質。

模型為公開資料參考的程序建築重建，標高、室內與樓層幾何是設計值，不是實測數位雙生。實體 Quest 3 尚未驗收。

## 建置

部署來源以校驗碼保護的壓縮來源分段保存於此目錄；`restore.py` 可還原完整、可編輯的 HTML/CSS/JavaScript/Python 原始碼到 `campus-quest-v2/`。原有 RailSlope 網站根入口保留不變。

`python .deployment/campus-quest-v2/restore.py`

`python -m pip install numpy scipy pillow`

`python campus-quest-v2/tools/generate_materials.py`

`node campus-quest-v2/tests/spatial.test.cjs`

GitHub Actions 會建立材質、執行空間測試、發布 Pages，並檢查線上資源。學習進度只存於瀏覽器，不會送到 GitHub。
