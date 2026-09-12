window.IEM_DATA = {
  meta: {
    title: "CYUT IEM Smart Guide",
    subtitle: "朝陽科技大學｜工業工程與管理系智慧導覽",
    department: "工業工程與管理系",
    departmentEn: "Department of Industrial Engineering and Management",
    address: "413310 臺中市霧峰區吉峰東路168號",
    phone: "04-23323000 #7034",
    email: "iem@cyut.edu.tw",
    building: "理工大樓 / Science and Engineering Building",
    osmWayId: 292141618,
    buildingCenter: [120.71513, 24.06911],
    campusCenter: [120.71462, 24.06874],
    sources: {
      labs: "https://iem.cyut.edu.tw/p/404-1032-9806.php?Lang=zh-tw",
      floor5: "https://iem.cyut.edu.tw/p/404-1032-63128.php?Lang=zh-tw",
      floor6: "https://iem.cyut.edu.tw/p/404-1032-61729.php?Lang=zh-tw",
      building: "https://web.cyut.edu.tw/p/404-1000-18934.php?Lang=zh-tw",
      contact: "https://b08.cyut.edu.tw/p/404-1032-9847.php?Lang=zh-tw",
      osm: "https://www.openstreetmap.org/way/292141618"
    }
  },
  floors: {
    "1": {label:"1F",title:"製造程序與專業教室",subtitle:"Manufacturing process & professional classrooms",note:"朝陽校級樓層資料列有工管系專業教室；E-101 為工管系製造程序實習工廠。",enabled:true},
    "2": {label:"2F",title:"營建工程系／一般教室",enabled:false},
    "3": {label:"3F",title:"資工／營建專業教室",enabled:false},
    "4": {label:"4F",title:"理工學院／營建系",enabled:false},
    "5": {label:"5F",title:"工管系辦公室與專題空間",subtitle:"Department office, project & seminar spaces",note:"依工管系官方 5F 配置圖重畫互動版。",enabled:true},
    "6": {label:"6F",title:"工管系研究實驗室",subtitle:"Industrial engineering research laboratories",note:"依工管系官方 6F 配置圖重畫互動版。",enabled:true},
    "7": {label:"7F",title:"應化系／教授研究室",enabled:false}
  },
  rooms: {
    e101:{code:"E-101",floor:1,type:"lab",name:"製造程序實習工廠",en:"Manufacturing Process Workshop",short:"工具機原理、製造程序與實作訓練。",description:"提供製造程序相關設備，使學生藉由實際操作理解工具機原理與特性，支援製造程序實習與工程訓練。",equipment:[{name:"製造程序工具機與實習設備",kind:"Manufacturing"},{name:"加工與量測實作區",kind:"Practice"},{name:"製程安全與操作訓練",kind:"Training"}],research:["製造程序","工具機","工程實作"],source:"labs"},
    e508:{code:"E-508",floor:5,type:"office",name:"工業工程與管理系辦公室",en:"IEM Department Office",short:"系辦行政、學生與訪客服務窗口。",description:"工業工程與管理系系辦公室，位於理工大樓 5 樓。",equipment:[{name:"系務與行政服務",kind:"Service"},{name:"電話 04-23323000 #7034",kind:"Contact"},{name:"iem@cyut.edu.tw",kind:"Email"}],research:["系務","教學服務","訪客導引"],source:"contact"},
    e509:{code:"E-509",floor:5,type:"seminar",name:"工管系研究生專題討論室",en:"Graduate Project Discussion Room",short:"研究生討論、專題研討與論文工作空間。",description:"依工管系 5F 官方配置圖標示之研究生專題討論室。",equipment:[{name:"研究討論空間",kind:"Seminar"},{name:"專題與論文討論",kind:"Research"}],research:["研究生","專題研討"],source:"floor5"},
    e5161:{code:"E-516.1",floor:5,type:"lab",name:"機電整合實驗室",en:"Mechatronics Integration Laboratory",short:"PLC、空壓油壓與機電整合實作。",description:"由空壓、油壓基礎延伸至 PLC 控制與機電整合工作站，培養 PLC 程式與週邊系統整合能力。",equipment:[{name:"PLC 基礎實驗箱",kind:"Control"},{name:"空壓／油壓訓練設備",kind:"Pneumatics & Hydraulics"},{name:"機電整合模擬工作站",kind:"Mechatronics"}],research:["PLC","機電整合","自動化"],source:"labs"},
    e5162:{code:"E-516.2",floor:5,type:"seminar",name:"工管系大學生專題研討室",en:"Undergraduate Project Seminar Room",short:"大學生專題與團隊研討空間。",description:"依工管系 5F 官方配置圖標示之大學生專題研討室。",equipment:[{name:"專題研討空間",kind:"Project"},{name:"團隊協作",kind:"Collaboration"}],research:["大專生專題","團隊協作"],source:"floor5"},
    e520:{code:"E-520",floor:5,type:"meeting",name:"會議室",en:"Conference Room",short:"理工大樓 5F 會議與研討空間。",description:"校級樓層資料與工管系 5F 配置圖均標示 E-520 會議室。",equipment:[{name:"會議與研討",kind:"Meeting"}],research:["會議","研討"],source:"floor5"},
    e607:{code:"E-607",floor:6,type:"lab",name:"亞健康族群健康促進中心",en:"Health Promotion Center",short:"人因分析、雲端資料庫、ICT 與 IoT 應用。",description:"結合人因工程分析、雲端資料庫設計與資通訊科技，支援健康促進、資料分析與物聯網應用。",equipment:[{name:"健康促進訓練與評估平台",kind:"Health"},{name:"雲端資料庫／ICT",kind:"Cloud"},{name:"物聯網應用",kind:"IoT"}],research:["健康促進","人因工程","IoT","雲端資料"],source:"labs"},
    e608:{code:"E-608",floor:6,type:"lab",name:"TPM 訓練道場",en:"TPM Training Lab",short:"設備工程師 TPM 六大技能實作。",description:"培養設備工程技能，涵蓋螺絲螺帽、潤滑、空壓、油壓、電氣與傳動等 TPM 六大技能。",equipment:[{name:"螺絲／螺帽訓練模組",kind:"TPM"},{name:"潤滑／傳動訓練模組",kind:"TPM"},{name:"空壓／油壓／電氣訓練模組",kind:"TPM"}],research:["TPM","設備保全","設備工程"],source:"labs"},
    e609:{code:"E-609",floor:6,type:"lab",name:"虛擬製造與模擬實驗室",en:"Virtual Manufacturing & Simulation Laboratory",short:"數位製造、VR/AR、智慧型虛擬環境與人機互動。",description:"以製造導向的人機互助介面為核心，發展數位化製造、VR 製造模擬、VR/AR 非接觸遙控、智慧型虛擬環境與觸感互動等技術。",equipment:[{name:"虛擬實境製造模擬平台",kind:"VR"},{name:"擴增實境互動平台",kind:"AR"},{name:"智慧型虛擬環境／人機互動",kind:"HCI"}],research:["數位製造","VR","AR","人機互動","模擬"],source:"labs"},
    e616:{code:"E-616",floor:6,type:"lab",name:"逆向工程實驗室",en:"Reverse Engineering Laboratory",short:"3D 掃描、曲面重建與 CAD/CAM 整合。",description:"利用 3D 掃描取得現有工件形狀，經曲面建構與編修後銜接 CAD/CAM、NC 加工或快速成型。",equipment:[{name:"3D 掃描系統",kind:"3D Scanning"},{name:"曲面建模與逆向工程軟體",kind:"CAD"},{name:"CAD/CAM 與 NC／快速成型流程",kind:"CAM"}],research:["3D 掃描","逆向工程","CAD/CAM","快速成型"],source:"labs"},
    e617:{code:"E-617",floor:6,type:"lab",name:"品質管理暨自動化檢測實驗室",en:"Quality Management & Automated Inspection Laboratory",short:"品質管理、電腦視覺與自動化檢測。",description:"支援品質管理與自動化檢測課程及研究所電腦視覺系統、自動化檢測等進階課程。",equipment:[{name:"電腦視覺檢測系統",kind:"Machine Vision"},{name:"自動化檢測實作平台",kind:"Inspection"},{name:"品質管理分析工具",kind:"Quality"}],research:["品質管理","電腦視覺","自動檢測"],source:"labs"},
    e619:{code:"E-619",floor:6,type:"lab",name:"人因工程實驗室",en:"Human Factors Engineering Laboratory",short:"動作、力量與生理訊號的人因量測與評估。",description:"兼具教學與研究，主要設施包含動作分析系統、力量測系統、生理訊號認知系統，以及模擬與分析軟體，用於產品操作績效與肌肉骨骼力學等人因評估。",equipment:[{name:"動作分析系統",kind:"Motion Analysis"},{name:"力量測系統",kind:"Force Measurement"},{name:"生理訊號認知系統",kind:"Physiological Signals"},{name:"人因模擬與分析軟體",kind:"Ergonomics"}],research:["人因工程","動作分析","生理訊號","肌肉骨骼"],source:"labs"},
    e620:{code:"E-620",floor:6,type:"lab",name:"計量分析與生產決策實驗室",en:"Quantitative Analysis & Production Decision Laboratory",short:"電腦設備、專業軟體與生產決策分析。",description:"提供電腦設備與應用軟體，支援專業軟體操作、分析設計，以及硬體裝設與維修演練。",equipment:[{name:"資料分析與決策工作站",kind:"Analytics"},{name:"生產與決策分析軟體",kind:"Decision Support"},{name:"電腦硬體實作資源",kind:"Computing"}],research:["計量分析","生產決策","資料分析"],source:"labs"}
  },
  floorGeometry:{
    "1":{rooms:{e101:{x:14,y:18,w:72,h:58}},corridors:[{x:10,y:80,w:80,h:6}],labels:[{x:50,y:12,text:"理工大樓 1F｜工管系製造程序實習區"}]},
    "5":{rooms:{e508:{x:25,y:14,w:18,h:17},e509:{x:25,y:33,w:18,h:17},e5161:{x:50,y:68,w:14,h:19},e5162:{x:65,y:68,w:17,h:19},e520:{x:86,y:41,w:11,h:22}},corridors:[{x:20,y:10,w:5,h:50},{x:20,y:56,w:69,h:6},{x:47,y:59,w:5,h:30},{x:47,y:63,w:42,h:5}],utilities:[{x:18,y:5,w:8,h:8,label:"樓梯"},{x:31,y:5,w:6,h:8,label:"電梯"},{x:43,y:51,w:6,h:8,label:"電梯"},{x:42,y:70,w:6,h:12,label:"WC"},{x:88,y:66,w:6,h:15,label:"樓梯"}],labels:[{x:50,y:7,text:"理工大樓 5F｜工管系辦公室與專題空間"}]},
    "6":{rooms:{e607:{x:14,y:8,w:16,h:14},e608:{x:14,y:24,w:16,h:19},e609:{x:14,y:45,w:16,h:18},e616:{x:44,y:72,w:17,h:17},e617:{x:62,y:72,w:18,h:17},e619:{x:62,y:53,w:21,h:15},e620:{x:83,y:36,w:14,h:28}},corridors:[{x:9,y:7,w:5,h:59},{x:9,y:64,w:77,h:6},{x:39,y:66,w:5,h:24},{x:42,y:68,w:43,h:5}],utilities:[{x:7,y:3,w:8,h:7,label:"樓梯"},{x:17,y:3,w:6,h:7,label:"電梯"},{x:27,y:60,w:7,h:8,label:"電梯"},{x:31,y:70,w:7,h:15,label:"WC"},{x:86,y:70,w:7,h:16,label:"樓梯"}],labels:[{x:50,y:6,text:"理工大樓 6F｜工管系研究實驗室"}]}
  }
};
