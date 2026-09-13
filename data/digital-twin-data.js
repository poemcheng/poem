export const SITE = {
  title: 'CYUT IEM Digital Twin Guide',
  department: '朝陽科技大學工業工程與管理系',
  campusCenter: [120.71462, 24.06874],
  sources: {
    labs: 'https://iem.cyut.edu.tw/p/404-1032-9806.php?Lang=zh-tw',
    floor5: 'https://iem.cyut.edu.tw/p/404-1032-63128.php?Lang=zh-tw',
    floor6: 'https://iem.cyut.edu.tw/p/404-1032-61729.php?Lang=zh-tw',
    osmE: 'https://www.openstreetmap.org/way/292141618'
  }
};

export const FLOOR_TWIN = {
  5: {
    label: '5F',
    rooms: [
      {code:'E-508', name:'工管系辦公室', x:-4.8, z:-0.4, w:3.3, d:2.1, kind:'office'},
      {code:'E-509', name:'專題研討室', x:-4.8, z:2.4, w:3.3, d:2.2, kind:'seminar'},
      {code:'E-516.1', name:'機電整合實驗室', x:1.2, z:2.6, w:3.0, d:2.3, kind:'lab', lab:true},
      {code:'E-516.2', name:'專題研討空間', x:4.6, z:2.6, w:3.0, d:2.3, kind:'seminar'},
      {code:'E-520', name:'會議室', x:6.2, z:-1.0, w:2.4, d:2.6, kind:'meeting'}
    ]
  },
  6: {
    label: '6F',
    rooms: [
      {code:'E-607', name:'亞健康族群健康促進中心', x:-5.8, z:-3.0, w:2.6, d:2.1, kind:'lab'},
      {code:'E-608', name:'TPM訓練道場', x:-5.8, z:-0.5, w:2.6, d:2.4, kind:'lab'},
      {code:'E-609', name:'智慧製造與人機協作實驗室', x:-5.8, z:2.7, w:2.6, d:2.4, kind:'lab', lab:true},
      {code:'E-616', name:'逆向工程實驗室', x:0.4, z:3.6, w:3.0, d:2.2, kind:'lab', lab:true},
      {code:'E-617', name:'品質管理暨自動化檢測實驗室', x:3.8, z:3.6, w:3.2, d:2.2, kind:'lab', lab:true},
      {code:'E-619', name:'人因工程實驗室', x:4.4, z:0.4, w:3.6, d:2.3, kind:'lab', lab:true},
      {code:'E-620', name:'計量分析與生產決策實驗室', x:6.5, z:-2.4, w:2.6, d:3.1, kind:'lab'}
    ]
  }
};

export const LABS = {
  'E-516.1': {
    code: 'E-516.1',
    floor: 5,
    name: '機電整合實驗室',
    en: 'Mechatronics Integration Laboratory',
    publicDescription: '以空壓、油壓與 PLC 為核心，逐步銜接機電整合模擬工作站與週邊系統整合訓練。',
    source: SITE.sources.labs,
    room: {w: 15.5, d: 10.5, h: 3.25},
    layoutStyle: 'training',
    research: ['PLC', '機電整合', '空壓／油壓', '伺服控制'],
    equipment: [
      {id:'plc1', model:'plcPanel', name:'PLC 多功能訓練箱', x:-4.7, z:-3.2, yaw:0, provenance:'official'},
      {id:'servo', model:'servoTrainer', name:'伺服馬達教學模組', x:-1.8, z:-3.2, yaw:0, provenance:'official'},
      {id:'pneu', model:'pneumaticTrainer', name:'空壓／油壓訓練工作站', x:1.5, z:-3.0, yaw:0, provenance:'official'},
      {id:'arm1', model:'linearArmTrainer', name:'螺桿機械手臂模組', x:4.9, z:-2.6, yaw:Math.PI, provenance:'official'},
      {id:'arm2', model:'rotaryArmTrainer', name:'旋轉機械手臂模組', x:4.7, z:1.6, yaw:Math.PI/2, provenance:'official'},
      {id:'desk', model:'workstation', name:'程式與控制工作站', x:-4.4, z:2.8, yaw:0, provenance:'current'}
    ]
  },

  'E-609': {
    code: 'E-609',
    floor: 6,
    name: '智慧製造與人機協作實驗室',
    previousPublicName: '虛擬製造與模擬實驗室',
    en: 'Smart Manufacturing and Human-Robot Collaboration Laboratory',
    publicDescription: '官方公開資料以數位化製造、虛擬實境製造模擬、智慧型虛擬環境與人機互動為核心；現場已升級為智慧製造與人機協作展示與研究場域。',
    source: SITE.sources.labs,
    room: {w: 18.0, d: 12.0, h: 3.35},
    layoutStyle: 'e609-photo-calibrated',
    research: ['智慧製造', 'Human-Robot Collaboration', 'Digital Twin', '3D 人體掃描', '足底壓力', '戰情室'],
    equipment: [
      {id:'wall', model:'videoWall6', name:'6 螢幕智慧製造戰情室', x:0, z:-5.72, yaw:0, provenance:'current', major:true},
      {id:'warbench', model:'longBench', name:'戰情室控制／展示工作檯', x:0, z:-4.45, yaw:0, provenance:'current'},
      {id:'ur7e', model:'ur7eCell', name:'UR7e 協作機器人工作站', x:-1.9, z:0.2, yaw:-0.2, provenance:'current', major:true},
      {id:'tm5900', model:'tm5900Cell', name:'TM5-900 協作機器人工作站', x:2.6, z:0.45, yaw:0.25, provenance:'current', major:true},
      {id:'bodyScan', model:'bodyScanner', name:'3D 人體掃描系統', x:-6.4, z:-0.5, yaw:Math.PI/2, provenance:'current', major:true},
      {id:'pressure', model:'pressureMat', name:'足底壓力分析系統', x:5.9, z:3.5, yaw:Math.PI, provenance:'current', major:true},
      {id:'frontDesk', model:'dualWorkstation', name:'掃描／量測工作站', x:-5.4, z:3.5, yaw:Math.PI, provenance:'current'},
      {id:'table1', model:'labTable', name:'中央量測桌', x:0.2, z:3.15, yaw:0, provenance:'current'},
      {id:'cabinet', model:'glassCabinet', name:'器材櫃', x:6.9, z:-2.8, yaw:Math.PI/2, provenance:'current'},
      {id:'d455', model:'d455Tripod', name:'Intel RealSense D455 視覺感測站', x:-0.2, z:-2.7, yaw:0, provenance:'current'}
    ]
  },

  'E-616': {
    code: 'E-616',
    floor: 6,
    name: '逆向工程實驗室',
    en: 'Reverse Engineering Laboratory',
    publicDescription: '利用 3D 掃描取得現有工件形狀，經曲面建構與編修後銜接 CAD/CAM、NC 加工或快速成型。',
    source: SITE.sources.labs,
    room: {w: 14.5, d: 10.0, h: 3.25},
    layoutStyle: 'reverse-engineering',
    research: ['3D 掃描', '逆向工程', 'CAD/CAM', '快速成型'],
    equipment: [
      {id:'scan', model:'structuredLightScanner', name:'3D Scanner 掃描站', x:-3.8, z:-1.3, yaw:0, provenance:'official', major:true},
      {id:'turn', model:'scanTurntable', name:'掃描轉台／樣品平台', x:-0.4, z:-0.8, yaw:0, provenance:'official'},
      {id:'cad1', model:'cadWorkstation', name:'CAD/CAM 工作站 A', x:4.1, z:-2.6, yaw:0, provenance:'official'},
      {id:'cad2', model:'cadWorkstation', name:'CAD/CAM 工作站 B', x:4.1, z:0.2, yaw:0, provenance:'official'},
      {id:'printer', model:'threeDPrinter', name:'3D 快速成型／列印設備', x:-4.6, z:3.0, yaw:Math.PI/2, provenance:'official'},
      {id:'server', model:'serverRack', name:'資料／運算伺服器', x:5.7, z:3.1, yaw:Math.PI/2, provenance:'official'}
    ]
  },

  'E-617': {
    code: 'E-617',
    floor: 6,
    name: '品質管理暨自動化檢測實驗室',
    en: 'Quality Management & Automated Inspection Laboratory',
    publicDescription: '支援品質管理、電腦視覺、自動化檢測與接觸／非接觸式量測等教學與研究。',
    source: SITE.sources.labs,
    room: {w: 15.5, d: 10.3, h: 3.25},
    layoutStyle: 'inspection',
    research: ['Machine Vision', '自動化檢測', 'CMM', '品質工程'],
    equipment: [
      {id:'fanuc', model:'fanucER4Cell', name:'Fanuc ER-4 自動檢測／取放工作站', x:-1.1, z:0.0, yaw:0.15, provenance:'current', major:true},
      {id:'vision', model:'visionConveyor', name:'電腦視覺輸送檢測站', x:3.8, z:-1.4, yaw:Math.PI/2, provenance:'official', major:true},
      {id:'cmm', model:'cmmMachine', name:'CNC 三次元量測概念站', x:-4.9, z:-2.2, yaw:0, provenance:'official'},
      {id:'laser', model:'laserScannerBench', name:'3D 雷射／光學檢測站', x:-4.8, z:2.4, yaw:0, provenance:'official'},
      {id:'qaPC', model:'dualWorkstation', name:'品質分析工作站', x:5.1, z:3.0, yaw:Math.PI, provenance:'current'}
    ]
  },

  'E-619': {
    code: 'E-619',
    floor: 6,
    name: '人因工程實驗室',
    en: 'Human Factors Engineering Laboratory',
    publicDescription: '官方公開設施包含動作分析、力量測、生理訊號認知與模擬分析軟體，用於產品操作績效與肌肉骨骼等人因評估。',
    source: SITE.sources.labs,
    room: {w: 17.0, d: 11.0, h: 3.25},
    layoutStyle: 'human-factors',
    research: ['眼動追蹤', 'XR/VR', '動作分析', '生理訊號', 'Depth Sensing'],
    equipment: [
      {id:'tobii', model:'tobiiFusionStation', name:'Tobii Pro Fusion 眼動工作站', x:-5.5, z:-2.8, yaw:0, provenance:'current', major:true},
      {id:'quest', model:'quest3Station', name:'Meta Quest 3 XR 實驗站', x:-4.8, z:2.6, yaw:Math.PI, provenance:'current', major:true},
      {id:'d455', model:'d455Tripod', name:'Intel RealSense D455', x:-1.4, z:-2.8, yaw:0, provenance:'current'},
      {id:'l515', model:'l515Tripod', name:'Intel RealSense L515', x:1.5, z:-2.8, yaw:0, provenance:'current'},
      {id:'motion', model:'motionCaptureZone', name:'動作分析區', x:0, z:0.7, yaw:0, provenance:'official', major:true},
      {id:'force', model:'forcePlate', name:'力量測平台', x:3.9, z:1.1, yaw:0, provenance:'official'},
      {id:'physio', model:'physioStation', name:'生理訊號認知／紀錄工作站', x:5.5, z:-2.4, yaw:0, provenance:'official'},
      {id:'observer', model:'dualWorkstation', name:'人因資料分析工作站', x:5.3, z:3.2, yaw:Math.PI, provenance:'current'}
    ]
  }
};
