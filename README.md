# 邊緣 AI 智慧停車場監控系統（3 小時課堂實作）

> 角色定位：系統整合商（SI）

## 1) 專案目標（課堂版）

在 **3 小時內** 完成一條可展示、可驗證的端到端資料流：

- 邊緣端（Hub8735）產生「車位狀態」事件（`empty` / `occupied`）
- 透過 MQTT 發佈 JSON
- Node-RED 接收、解析、判斷
- Dashboard 即時可視化
- 觸發 Discord Webhook 警報

---

## 2) 功能規格（Functional Specifications）

### 使用者故事
作為停車場管理員，我希望在戰情室網頁即時看到剩餘車位，並在 VIP 車位異常佔用時立刻收到 Discord 警報。

### 驗收條件（Class Acceptance Criteria）

1. 邊緣端可在狀態變更後 **1 秒內** 發送 MQTT 訊息。
2. 訊息格式為合法 JSON，含最少欄位：
   - `spot_id`
   - `status`
   - `confidence`
   - `ts`（ISO8601）
3. Dashboard 至少包含：
   - 文字狀態（Text）
   - 使用率或佔用率（Gauge）
4. 當 `status == "occupied"` 且 `confidence < threshold` 時，觸發 Discord 警報。

---

## 3) 系統架構（Device-to-Enterprise）

- **Edge**：Hub8735（AMB82-Mini）
- **Protocol**：MQTT（LAN）
- **Middleware**：Node-RED + Aedes Broker
- **Visualization**：Node-RED Dashboard
- **Notification**：Discord Webhook（HTTP POST）

```text
Hub8735 -> MQTT Topic(parking/status) -> Node-RED(json/switch/function)
        -> Dashboard(text/gauge)
        -> HTTP Request -> Discord
```

---

## 4) 訊息契約（JSON Schema 簡化）

### Topic
`parking/status`

### Payload 範例

```json
{
  "spot_id": "A1",
  "status": "occupied",
  "confidence": 0.82,
  "ts": "2026-04-09T10:30:00Z"
}
```

### 欄位說明

- `spot_id`: 車位識別碼（例如 A1）
- `status`: `empty` 或 `occupied`
- `confidence`: 0.0 ~ 1.0
- `ts`: 事件時間戳

---

## 5) 3 小時課程節奏（Minute-by-minute）

- **00:00 - 00:20**：需求說明、架構導覽、MQTT 與 JSON 契約
- **00:20 - 01:00**：Hub8735 端（按鈕模擬）發送 MQTT
- **01:00 - 01:40**：Node-RED Flow（mqtt in -> json -> dashboard）
- **01:40 - 02:20**：告警邏輯（switch/function/http request）
- **02:20 - 02:45**：整合測試、故障注入（斷網/錯誤格式）
- **02:45 - 03:00**：成果展示與 Q&A

---

## 6) Hub8735 程式（按鈕模擬版）

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "教室_WIFI";
const char* password = "WIFI_密碼";
const char* mqtt_server = "192.168.X.X";

const int buttonPin = 0;
int lastButtonState = HIGH;
bool isOccupied = false;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("Hub8735_Parking")) {
      // connected
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  int buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && lastButtonState == HIGH) {
    isOccupied = !isOccupied;

    String payload = "{\"spot_id\":\"A1\",\"status\":\"";
    payload += (isOccupied ? "occupied" : "empty");
    payload += "\",\"confidence\":0.95,\"ts\":\"2026-04-09T10:30:00Z\"}";

    client.publish("parking/status", payload.c_str());
    delay(500);
  }
  lastButtonState = buttonState;
}
```

---

## 7) Node-RED Flow 設計

### 最小可用流程

1. `mqtt in`（topic: `parking/status`）
2. `json`（string -> object）
3. `change`（抽出 `msg.payload.status` 供 text）
4. `ui_text`（顯示車位狀態）
5. `ui_gauge`（顯示使用率或 occupancy）
6. `switch`（`status == occupied` AND `confidence < threshold`）
7. `function`（組裝 Discord 內容）
8. `http request`（POST 到 Discord Webhook）

### Function 節點範例

```javascript
const p = msg.payload;
msg.payload = {
  content: `🚨 警報：${p.spot_id} VIP 車位疑似異常佔用\nconfidence=${p.confidence}\nts=${p.ts}`
};
return msg;
```

---

## 8) 進階：如何把「按鈕模擬」升級為「影像辨識」

如果你想在同一堂課展示 AI 感，可用「雙模式」策略：

### 模式 A（基礎保底）
按鈕模擬，確保資料流一定成功。

### 模式 B（加分展示）
在 Hub8735 端導入現成物件偵測結果（例如 car/person 類別），只要結果有車且落在 ROI（車格區域）即判定 `occupied`。

#### 最小升級步驟

1. 影像來源：攝影機畫面
2. 推論輸出：bounding box + class + score
3. 規則判定：
   - `class == car`
   - `score >= 0.7`
   - box 與車格 ROI 交疊率 >= 0.3
4. 狀態去抖動：連續 N 幀成立才改變狀態
5. 仍沿用同一 MQTT JSON 契約（前後端不用改）

#### 課堂建議

- 若模型推論速度不穩，保持每 1~2 秒發一筆事件即可
- 重點是教會「AI 結果如何落地為可營運的事件資料流」

---

## 9) 測試計畫

### 功能測試

- 按鈕切換 -> Dashboard 狀態更新
- `status=occupied & confidence<threshold` -> Discord 告警

### 壓力與穩定性（課堂簡版）

- 連續 100 筆事件不丟包（可接受少量重送）
- 斷線重連後 10 秒內恢復發報

### 故障注入

- 發送非法 JSON
- 關閉 broker 再重啟
- 將 webhook URL 設錯驗證錯誤處理

---

## 10) SI 交付物（課堂版）

- 架構圖 1 張
- MQTT topic 與 payload 規格 1 份
- Node-RED flow 匯出檔 1 份
- 操作手冊（啟動/測試/排錯）1 份
- 驗收紀錄（測試截圖/結果）1 份

---

## 11) 常見排錯清單

- MQTT 連不上：確認 broker IP、port 1883、防火牆
- Dashboard 無資料：`json` 節點前後 `debug` 查看 payload 型別
- Discord 無告警：檢查 webhook URL、`Content-Type`、POST method
- 狀態跳動：增加去抖（按鈕）或多幀確認（影像）

---

## 12) 總結

這份設計能在 3 小時內完成「邊緣事件 -> 中控可視化 -> 自動告警」的完整閉環。若要延伸到正式案場，只需在不改資料契約前提下，將按鈕模擬替換為真實影像推論即可。
