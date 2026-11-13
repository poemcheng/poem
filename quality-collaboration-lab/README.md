# 品質協作實驗室：AI 與機器人的品質驗證

研究衍生可攜教學版 `2026.11-teaching.1`。免登入、沒有API金鑰、沒有CDN與外部字型，互動紀錄只在瀏覽器記憶體，重新整理後清除。依鄭淳詩的三個研究案例設計；不是正式研究系統的替代品，也沒有覆寫原Sites網站。

- 體驗入口：https://poemcheng.github.io/poem/quality-collaboration-lab/
- 原始碼：https://github.com/poemcheng/poem/tree/master/quality-collaboration-lab
- 原始碼包：網站中的 `source.zip`
- 操作及講者指引：`docs/GUIDE.md`
- 授權：MIT，僅適用本教學程式與新撰文件。

## 三站體驗

**DrawIQ**：7個自製案例，切換運算子、內容狀態與來源核准檢查；模擬採納仍保持待審。原稿封存機制中的缺口，以最小規則表示；本版補強規則不代表原DrawIQ已修補。

**醫療器械**：兩條二維運動軌跡使用同一事件與延遲，比較有／無執行閘門。24組固定種子教學情境可重現、可匯出CSV。模型包含停止後恢復、太晚發現而失敗、持續佔區而中止；不執行MuJoCo、PPO或真機。

**教學平台**：用28張合成教案卡重現原先只驗9情境的缺口；乾淨安裝暴露7份本機教案依賴；來源版本與媒體損毀分開處理。檢查可以攔截損毀，不會自行修復。不是原平台112職類組合或336影片的重製。

## 執行

網站直接開啟即可。下載 `index.html` 後可在一般桌面瀏覽器開啟；若環境限制file URL，使用Python標準庫：

```sh
cd quality-collaboration-lab
python -m http.server 8000 --bind 127.0.0.1
# 開啟 http://127.0.0.1:8000
```

手機可從公開HTTPS入口操作。手機實體硬體與Safari未在本次本地環境驗收；390px視窗已測。

## 編輯與測試

`core.js` 為可獨立檢驗的規則與二維模型；`app.js` 為互動介面；`style.css`為版型；`build.py`會把三者內嵌成單一HTML。

```sh
python build.py
node --test tests/core.test.cjs
python -m pip install playwright
python -m playwright install chromium
python tests/browser_test.py
```

瀏覽器政策禁止本地URL時，可做純記憶體DOM驗證：

```sh
UI_TEST_IN_MEMORY=1 python tests/browser_test.py
```

純記憶體模式不等同HTTP／實際公開網站驗收；報告會明確記錄測試傳輸方式。測試下載的CSV與JSON只含測試操作，不是人類受試資料。

## 證據邊界

1. 歷史摘要：來自作者既有文件，未在本版重新執行原實驗。
2. 互動結果：本教學版新產生的合成示例，匯出檔附`evidence_kind`。
3. 39項核心測試：軟體規則測試，不是39個真實工程圖或機器人任務。
4. 自評：自製0–10課堂回饋，不是NASA-TLX或能力認證，不自動記錄預設值。
5. 不可推導真機保護距離、臨床效度或身心負荷降低百分比。

原始研究的完整效益仍需圖族隔離、獨立標註、實機與人員對照研究。歷史模擬均時的分母未於此包重新核對，因此不提供其新顯著性或真人減負推論。

## 來源

- D01：DrawIQ_Manuscript_Revised_20261105、DrawIQ_S2_Evidence_Audit_20261105；0.4.8封存機制紀錄。原文件由作者管理，不在此重發客戶圖面。
- M01：附件四_醫械智取隊_視覺與強化學習_學術技術修訂，2026-11-02，表15、附錄B。只引用明示的彙總數字，不重建或假造原逐試次資料。
- T01：spiral-clinical-tutor-v5，2026-10-24部署修正，固定commit `ce0c7cb764a26fb7bc68bdab813d88c47bef7e45`。原平台：https://github.com/poemcheng/spiral-clinical-tutor-v5

## 發布與保留既有內容

本版放在獨立子目錄。現有Pages流程僅新增本目錄的重建、測試與複製；既有RailSlope根目錄與Campus Quest內容維持原發布程序。原Sites網址保留，不以本版宣稱已修復原站。
