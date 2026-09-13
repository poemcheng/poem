export const SITE = {
  title: 'CYUT IEM Digital Twin Guide',
  department: '朝陽科技大學工業工程與管理系',
  campusCenter: [120.71462, 24.06874],
  sources: {
    labs: 'https://iem.cyut.edu.tw/p/404-1032-9806.php?Lang=zh-tw',
    floor5: 'https://iem.cyut.edu.tw/p/404-1032-63128.php?Lang=zh-tw',
    floor6: 'https://iem.cyut.edu.tw/p/404-1032-61729.php?Lang=zh-tw',
    osmE: 'https://www.openstreetmap.org/way/292141618',
    cyutCampus: 'https://web.cyut.edu.tw/p/412-1000-4553.php?Lang=en',
    cyutCampus3d: 'https://web.cyut.edu.tw/p/412-1000-5103.php?Lang=en',
    cyutBuildings: 'https://web.cyut.edu.tw/p/412-1000-4556.php?Lang=en',
    scienceBuilding: 'https://web.cyut.edu.tw/p/404-1000-18934.php?Lang=zh-tw',
    teachingBuilding: 'https://web.cyut.edu.tw/p/404-1000-18935.php?Lang=zh-tw',
    managementBuilding: 'https://web.cyut.edu.tw/p/405-1000-18937%2Cc4556.php?Lang=zh-tw',
    humanitiesBuilding: 'https://www.cyut.edu.tw/Navigation/f03.htm',
    computerRooms: 'https://system.cyut.edu.tw/p/412-1073-5371.php?Lang=zh-tw'
  }
};

export const BUILDINGS = {
  A: {code:'A', name:'行政大樓', en:'Administration Building', role:'行政與學生服務', openable:false, description:'校級行政與學生服務據點。', iemAccess:['行政支援','學生事務辦理'], modeled:true},
  M: {code:'M', name:'資訊大樓', en:'Information Building', role:'資訊學院', openable:false, description:'資訊學院教學與專業教室所在大樓；官方樓層資料使用 M- 房號。', iemAccess:['資訊相關課程','自主學習區 M-118'], modeled:true},
  G: {code:'G', name:'人文與科技大樓', en:'Humanities and Technology Building', role:'共同／人文科技教學', openable:false, description:'普通教室、電腦教室與跨領域教學空間所在大樓；官方樓層資料使用 G- 房號。', iemAccess:['普通教室','G-510 電腦教室','共同課程'], modeled:true},
  E: {code:'E', name:'理工大樓', en:'Science and Engineering Building', role:'工管系核心據點', openable:true, description:'工管系主要辦公、專業教室、研究實驗室集中於 5F 與 6F；普通教室 E-510 及自主學習區 E-521 亦位於 5F。', iemAccess:['系辦公室','專業教室','實驗室','E-510 普通教室','E-521 自主學習'], modeled:true},
  T1:{code:'T1', name:'教學大樓', en:'Teaching Building', role:'共同教學／普通教室', openable:true, description:'1F–8F 分布大量普通教室與自主學習空間，是工管學生共同與通識課程常用場域。', iemAccess:['T1-201~203','T1-301~303','T1-401~407','T1-501~507','T1-601~607','自主學習區'], modeled:true},
  D: {code:'D', name:'設計大樓', en:'Design Building', role:'設計學院', openable:false, description:'設計學院專業教學與工作室場域。', iemAccess:['跨院選修','展演與設計活動'], modeled:true},
  T2:{code:'T2', name:'管理大樓', en:'Management Building', role:'管理學院／普通教室', openable:true, description:'管理學院教學空間與普通教室，並設置 T2-504／508 等電腦教室。', iemAccess:['T2-803 普通教室','T2-504 電腦教室','T2-508 自由上機','管理類選修'], modeled:true},
  L: {code:'L', name:'波錠紀念圖書館', en:'Poding Memorial Library', role:'圖書與自習', openable:false, description:'圖書、自習、檢索與學習資源中心；L-503 為檢索訓練／電腦實習教室。', iemAccess:['借閱','自習','L-503 檢索／電腦實習'], modeled:true},
  ATH:{code:'ATH', name:'體育館', en:'Athletics Building', role:'體育與大型活動', openable:false, description:'體育課程、校級活動與運動空間。', iemAccess:['體育課','活動場地'], modeled:true},
  KDG:{code:'KDG', name:'幼兒園', en:'Kindergarten', role:'附設幼兒園', openable:false, description:'朝陽官方各大樓列表列有幼兒園；目前僅列於完整校園資訊面板，尚未建立精確 3D footprint。', iemAccess:[], modeled:false},
  R:{code:'R', name:'宿舍大樓', en:'Dormitory Building', role:'學生住宿', openable:false, description:'朝陽官方各大樓列表列有宿舍大樓；目前列入完整校園導覽資訊，尚未建立精確 3D footprint。', iemAccess:['住宿／生活服務'], modeled:false}
};

export const CLASSROOMS = {
  'E-510': {code:'E-510', building:'E', floor:5, type:'ordinary', name:'普通教室 E-510', en:'General Classroom E-510', source:SITE.sources.scienceBuilding, official:true, room:{w:10.8,d:8.2,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:5,cols:6,aisle:0.9,front:'display'}, notes:'朝陽理工大樓官方樓層用途列示之普通教室。'},
  'T1-601': {code:'T1-601', building:'T1', floor:6, type:'ordinary', name:'普通教室 T1-601', en:'General Classroom T1-601', source:SITE.sources.teachingBuilding, official:true, room:{w:11.2,d:8.4,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:6,cols:6,aisle:1.0,front:'display'}, notes:'教學大樓 6F 官方列示普通教室 T1-601~603、605~607。'},
  'T2-803': {code:'T2-803', building:'T2', floor:8, type:'ordinary', name:'普通教室 T2-803', en:'General Classroom T2-803', source:SITE.sources.managementBuilding, official:true, room:{w:10.8,d:8.0,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:5,cols:6,aisle:0.9,front:'display'}, notes:'管理大樓 8F 官方列示普通教室 T2-803。'},
  'G-211': {code:'G-211', building:'G', floor:2, type:'ordinary', name:'普通教室 G-211', en:'General Classroom G-211', source:SITE.sources.humanitiesBuilding, official:true, room:{w:10.6,d:8.0,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:5,cols:6,aisle:0.9,front:'display'}, notes:'人文與科技大樓官方樓層用途列示 G-211~213 普通教室。'},
  'T2-504': {code:'T2-504', building:'T2', floor:5, type:'computer', name:'電腦教室 T2-504', en:'Computer Classroom T2-504', source:SITE.sources.computerRooms, official:true, room:{w:12.0,d:8.6,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:5,cols:8,computers:41,front:'projector'}, notes:'官方圖資處資料列示 41 部電腦、29 坪。'},
  'G-510': {code:'G-510', building:'G', floor:5, type:'computer', name:'電腦教室 G-510', en:'Computer Classroom G-510', source:SITE.sources.computerRooms, official:true, room:{w:12.4,d:8.8,h:3.2,pattern:'tile',windows:'right'}, layout:{rows:4,cols:9,computers:36,front:'projector'}, notes:'官方圖資處資料列示 36 部電腦、備用 4 部，空間 30 坪。'}
};

export const FLOOR_TWIN = {
  5: {label:'5F', rooms:[
    {code:'E-508', name:'工管系辦公室', x:-4.8, z:-0.4, w:3.3, d:2.1, kind:'office'},
    {code:'E-509', name:'專題研討室', x:-4.8, z:2.4, w:3.3, d:2.2, kind:'seminar'},
    {code:'E-510', name:'普通教室', x:-1.2, z:-2.6, w:3.2, d:2.1, kind:'classroom', classroom:true},
    {code:'E-516.1', name:'機電整合實驗室', x:1.2, z:2.6, w:3.0, d:2.3, kind:'lab', lab:true},
    {code:'E-516.2', name:'專題研討空間', x:4.6, z:2.6, w:3.0, d:2.3, kind:'seminar'},
    {code:'E-520', name:'會議室', x:6.2, z:-1.0, w:2.4, d:2.6, kind:'meeting'},
    {code:'E-521', name:'自主學習區', x:3.9, z:-2.5, w:2.8, d:1.9, kind:'seminar'}
  ]},
  6: {label:'6F', rooms:[
    {code:'E-607', name:'亞健康族群健康促進中心', x:-5.8, z:-3.0, w:2.6, d:2.1, kind:'lab'},
    {code:'E-608', name:'TPM訓練道場', x:-5.8, z:-0.5, w:2.6, d:2.4, kind:'lab'},
    {code:'E-609', name:'智慧製造與人機協作實驗室', x:-5.8, z:2.7, w:2.6, d:2.4, kind:'lab', lab:true},
    {code:'E-616', name:'逆向工程實驗室', x:0.4, z:3.6, w:3.0, d:2.2, kind:'lab', lab:true},
    {code:'E-617', name:'品質管理暨自動化檢測實驗室', x:3.8, z:3.6, w:3.2, d:2.2, kind:'lab', lab:true},
    {code:'E-619', name:'人因工程實驗室', x:4.4, z:0.4, w:3.6, d:2.3, kind:'lab', lab:true},
    {code:'E-620', name:'計量分析與生產決策實驗室', x:6.5, z:-2.4, w:2.6, d:3.1, kind:'lab'}
  ]}
};

export const LABS = {
  'E-516.1': {code:'E-516.1', floor:5, name:'機電整合實驗室', en:'Mechatronics Integration Laboratory', publicDescription:'以空壓、油壓與 PLC 為核心，逐步銜接機電整合模擬工作站與週邊系統整合訓練。', source:SITE.sources.labs, room:{w:15.5,d:10.5,h:3.25,pattern:'vinyl',wall:'lab',openCeiling:true,windows:[{wall:'back',x:4.4,y:2.0,w:3.2,h:1.0}]}, layoutStyle:'training', entryView:{target:[0,1.2,0],yaw:.68,pitch:.34,dist:19}, walkView:{target:[0,1.3,2.1],yaw:0,pitch:.10,dist:6.3}, research:['PLC','機電整合','空壓／油壓','伺服控制'], equipment:[
    {id:'plc1',model:'plcPanel',name:'PLC 多功能訓練箱',x:-4.7,z:-3.2,yaw:0,provenance:'official',major:true},
    {id:'servo',model:'servoTrainer',name:'伺服馬達教學模組',x:-1.8,z:-3.2,yaw:0,provenance:'official',major:true},
    {id:'pneu',model:'pneumaticTrainer',name:'空壓／油壓訓練工作站',x:1.5,z:-3.0,yaw:0,provenance:'official'},
    {id:'arm1',model:'linearArmTrainer',name:'螺桿機械手臂模組',x:4.9,z:-2.6,yaw:Math.PI,provenance:'official'},
    {id:'arm2',model:'rotaryArmTrainer',name:'旋轉機械手臂模組',x:4.7,z:1.6,yaw:Math.PI/2,provenance:'official'},
    {id:'desk',model:'workstation',name:'程式與控制工作站',x:-4.4,z:2.8,yaw:0,provenance:'current'},
    {id:'table',model:'labTable',name:'教學示範桌',x:.5,z:2.4,yaw:0,provenance:'current'}
  ]},
  'E-609': {code:'E-609', floor:6, name:'智慧製造與人機協作實驗室', previousPublicName:'虛擬製造與模擬實驗室', en:'Smart Manufacturing and Human-Robot Collaboration Laboratory', publicDescription:'官方公開資料以數位化製造、虛擬實境製造模擬、智慧型虛擬環境與人機互動為核心；現場已升級為智慧製造與人機協作展示與研究場域。', source:SITE.sources.labs, room:{w:18,d:12,h:3.35,pattern:'tile',wall:'e609',openCeiling:true,windows:[{wall:'back',x:-5.7,y:1.7,w:4,h:1,curtains:true},{wall:'back',x:4.6,y:1.7,w:3.8,h:1,curtains:true},{wall:'right',x:-3.4,y:1.7,w:1.3,h:1,curtains:true}]}, layoutStyle:'e609-photo-calibrated', entryView:{target:[0,1.25,0],yaw:.86,pitch:.30,dist:18.5}, walkView:{target:[0,1.25,2.3],yaw:0,pitch:.11,dist:6.8}, research:['智慧製造','Human-Robot Collaboration','Digital Twin','3D 人體掃描','足底壓力','戰情室'], equipment:[
    {id:'wall',model:'videoWall6',name:'6 螢幕智慧製造戰情室',x:0,z:-5.72,yaw:0,provenance:'current',major:true},
    {id:'warbench',model:'longBench',name:'戰情室控制／展示工作檯',x:0,z:-4.42,yaw:0,provenance:'current'},
    {id:'ur7e',model:'ur7eCell',name:'UR7e 協作機器人工作站',x:-1.9,z:0,yaw:-.15,provenance:'current',major:true},
    {id:'tm5900',model:'tm5900Cell',name:'TM5-900 協作機器人工作站',x:2.7,z:.15,yaw:.28,provenance:'current',major:true},
    {id:'bodyScan',model:'bodyScanner',name:'3D 人體掃描系統',x:-6.4,z:-.7,yaw:Math.PI/2,provenance:'current',major:true},
    {id:'pressure',model:'pressureMat',name:'足底壓力分析系統',x:6,z:2.8,yaw:Math.PI,provenance:'current',major:true},
    {id:'frontDesk',model:'dualWorkstation',name:'掃描／量測工作站',x:-5.4,z:3.55,yaw:Math.PI,provenance:'current'},
    {id:'table1',model:'labTable',name:'中央量測桌',x:0,z:3.15,yaw:0,provenance:'current'},
    {id:'table2',model:'labTable',name:'前側討論桌',x:.1,z:5,yaw:0,provenance:'current'},
    {id:'cabinet',model:'glassCabinet',name:'器材櫃',x:6.9,z:-2.7,yaw:Math.PI/2,provenance:'current'},
    {id:'d455',model:'d455Tripod',name:'Intel RealSense D455 視覺感測站',x:-.2,z:-2.7,yaw:0,provenance:'current'}
  ]},
  'E-616': {code:'E-616', floor:6, name:'逆向工程實驗室', en:'Reverse Engineering Laboratory', publicDescription:'利用 3D 掃描取得現有工件形狀，經曲面建構與編修後銜接 CAD/CAM、NC 加工或快速成型。', source:SITE.sources.labs, room:{w:14.5,d:10,h:3.25,pattern:'vinyl',wall:'lab',openCeiling:true,windows:[{wall:'back',x:3.6,y:1.9,w:3,h:1.1}]}, layoutStyle:'reverse-engineering', entryView:{target:[0,1.2,0],yaw:.72,pitch:.33,dist:15.5}, walkView:{target:[0,1.25,2],yaw:0,pitch:.10,dist:6}, research:['3D 掃描','逆向工程','CAD/CAM','快速成型'], equipment:[
    {id:'scan',model:'structuredLightScanner',name:'3D Scanner 掃描站',x:-3.8,z:-1.3,yaw:0,provenance:'official',major:true},
    {id:'turn',model:'scanTurntable',name:'掃描轉台／樣品平台',x:-.4,z:-.8,yaw:0,provenance:'official'},
    {id:'cad1',model:'cadWorkstation',name:'CAD/CAM 工作站 A',x:4.1,z:-2.6,yaw:0,provenance:'official'},
    {id:'cad2',model:'cadWorkstation',name:'CAD/CAM 工作站 B',x:4.1,z:.2,yaw:0,provenance:'official'},
    {id:'printer',model:'threeDPrinter',name:'3D 快速成型／列印設備',x:-4.6,z:3,yaw:Math.PI/2,provenance:'official',major:true},
    {id:'server',model:'serverRack',name:'資料／運算伺服器',x:5.7,z:3.1,yaw:Math.PI/2,provenance:'official'}
  ]},
  'E-617': {code:'E-617', floor:6, name:'品質管理暨自動化檢測實驗室', en:'Quality Management & Automated Inspection Laboratory', publicDescription:'支援品質管理、電腦視覺、自動化檢測與接觸／非接觸式量測等教學與研究。', source:SITE.sources.labs, room:{w:15.5,d:10.3,h:3.25,pattern:'vinyl',wall:'lab',openCeiling:true,windows:[{wall:'back',x:-3.8,y:1.9,w:2.8,h:1}]}, layoutStyle:'inspection', entryView:{target:[0,1.2,0],yaw:.66,pitch:.34,dist:16.4}, walkView:{target:[0,1.2,2.2],yaw:0,pitch:.10,dist:6}, research:['Machine Vision','自動化檢測','CMM','品質工程'], equipment:[
    {id:'fanuc',model:'fanucER4Cell',name:'Fanuc ER-4 自動檢測／取放工作站',x:-1.1,z:0,yaw:.15,provenance:'current',major:true},
    {id:'vision',model:'visionConveyor',name:'電腦視覺輸送檢測站',x:3.8,z:-1.4,yaw:Math.PI/2,provenance:'official',major:true},
    {id:'cmm',model:'cmmMachine',name:'CNC 三次元量測概念站',x:-4.9,z:-2.2,yaw:0,provenance:'official'},
    {id:'laser',model:'laserScannerBench',name:'3D 雷射／光學檢測站',x:-4.8,z:2.4,yaw:0,provenance:'official'},
    {id:'qaPC',model:'dualWorkstation',name:'品質分析工作站',x:5.1,z:3,yaw:Math.PI,provenance:'current'}
  ]},
  'E-619': {code:'E-619', floor:6, name:'人因工程實驗室', en:'Human Factors Engineering Laboratory', publicDescription:'官方公開設施包含動作分析、力量測、生理訊號認知與模擬分析軟體，用於產品操作績效與肌肉骨骼等人因評估。', source:SITE.sources.labs, room:{w:17,d:11,h:3.25,pattern:'vinyl',wall:'lab',openCeiling:true,windows:[{wall:'back',x:4.6,y:1.9,w:3.2,h:1}]}, layoutStyle:'human-factors', entryView:{target:[0,1.2,0],yaw:.75,pitch:.33,dist:17.2}, walkView:{target:[0,1.25,2],yaw:0,pitch:.10,dist:6.3}, research:['眼動追蹤','XR/VR','動作分析','生理訊號','Depth Sensing'], equipment:[
    {id:'tobii',model:'tobiiFusionStation',name:'Tobii Pro Fusion 眼動工作站',x:-5.5,z:-2.8,yaw:0,provenance:'current',major:true},
    {id:'quest',model:'quest3Station',name:'Meta Quest 3 XR 實驗站',x:-4.8,z:2.6,yaw:Math.PI,provenance:'current',major:true},
    {id:'d455',model:'d455Tripod',name:'Intel RealSense D455',x:-1.4,z:-2.8,yaw:0,provenance:'current'},
    {id:'l515',model:'l515Tripod',name:'Intel RealSense L515',x:1.5,z:-2.8,yaw:0,provenance:'current'},
    {id:'motion',model:'motionCaptureZone',name:'動作分析區',x:0,z:.7,yaw:0,provenance:'official',major:true},
    {id:'force',model:'forcePlate',name:'力量測平台',x:3.9,z:1.1,yaw:0,provenance:'official'},
    {id:'physio',model:'physioStation',name:'生理訊號認知／紀錄工作站',x:5.5,z:-2.4,yaw:0,provenance:'official'},
    {id:'observer',model:'dualWorkstation',name:'人因資料分析工作站',x:5.3,z:3.2,yaw:Math.PI,provenance:'current'}
  ]}
};
