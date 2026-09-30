/* Campus topology interpreted from CYUT's public illustrated map, NOT surveyed geometry.
 * Local game units are nominal metres. Map-up is toward the dormitory; it is NOT geographic north.
 * Heights, footprints, terrain and interiors are authored approximations, not verified as-built data.
 */
window.CQ = window.CQ || {};
CQ.DATA = {
  version:'0.1.0', title:'朝陽校園探索 · Campus Quest',
  boundary:{minX:-235,maxX:190,minZ:-290,maxZ:265},
  spawn:{x:8,z:210,yaw:0},
  source:{map:'https://web.cyut.edu.tw/p/412-1000-4553.php?Lang=zh-tw',
    mapImage:'https://web.cyut.edu.tw/var/file/0/1000/img/867/654228018.jpg',
    iem:'https://iem.cyut.edu.tw/p/404-1032-9800.php?Lang=zh-tw',
    floor5:'https://iem.cyut.edu.tw/p/404-1032-63128.php?Lang=zh-tw',
    floor6:'https://iem.cyut.edu.tw/p/404-1032-61729.php?Lang=zh-tw', checked:'2026-09-30'},
  buildings:[
    {id:'E',name:'理工大樓',en:'SCIENCE & ENGINEERING',x:-55,z:30,w:43,d:74,h:26,floors:7,tone:[.74,.76,.71],shape:'engineering',door:[-27,16],interior:'lab',info:'工管系官方網站列有理工大樓 5、6 樓的系辦與實驗室配置。本版室內是工管教學情境，不是實際樓層複製。'},
    {id:'T',name:'教學大樓',en:'TEACHING BUILDING',x:-42,z:-128,w:59,d:47,h:27,floors:7,tone:[.75,.72,.66],door:[-40,-99],interior:'classroom',info:'以公開校園地圖的相對位置配置。可進入示意教室，查看工管學習主題。'},
    {id:'D',name:'設計大樓',en:'DESIGN BUILDING',x:44,z:-128,w:62,d:48,h:29,floors:8,tone:[.79,.70,.63],door:[40,-98],info:'校園探索與跨域任務地點。立面、尺度與室內未經現地測量。'},
    {id:'M',name:'管理大樓',en:'MANAGEMENT BUILDING',x:127,z:-123,w:45,d:63,h:32,floors:9,tone:[.69,.75,.76],door:[98,-100],info:'物流配送任務的其中一站。建築位置依公開示意圖，非測繪座標。'},
    {id:'L',name:'波錠紀念圖書館',en:'PODING MEMORIAL LIBRARY',x:129,z:-34,w:40,d:75,h:22,floors:5,tone:[.82,.67,.51],shape:'library',door:[103,-30],interior:'library',info:'探索、閱讀空間與配送地點。可進入閱讀空間；書架與平面配置是遊戲示意。'},
    {id:'G',name:'人文與科技大樓',en:'HUMANITIES & TECHNOLOGY',x:129,z:57,w:36,d:69,h:30,floors:8,tone:[.77,.78,.71],door:[105,55],info:'人文與科技跨域探索地點；本版開放建築外部，不開放實際樓層。'},
    {id:'I',name:'資訊大樓',en:'INFORMATION BUILDING',x:70,z:39,w:26,d:43,h:23,floors:6,tone:[.72,.75,.76],door:[52,36],info:'程式設計、資料分析與智慧系統的任務延伸地點。建築是簡化模型。'},
    {id:'A',name:'行政大樓',en:'ADMINISTRATION',x:6,z:73,w:64,d:31,h:17,floors:4,tone:[.83,.76,.59],shape:'admin',door:[5,51],info:'以校園地圖所示紅磚廣場旁的位置配置；不是實際行政業務系統。'},
    {id:'GYM',name:'體育館',en:'GYMNASIUM',x:-105,z:5,w:40,d:38,h:16,floors:3,tone:[.79,.68,.58],door:[-78,5],info:'可由戶外探索體育館、球場與運動場。室內體育設施尚未重建。'},
    {id:'AV',name:'航空大樓',en:'AVIATION BUILDING',x:-72,z:-201,w:76,d:31,h:21,floors:5,tone:[.68,.76,.79],door:[-70,-179],info:'校方目前公開地圖標示的航空大樓；本版只提供外部探索。'},
    {id:'HALL',name:'宿舍大樓',en:'DORMITORY BUILDING',x:38,z:-225,w:82,d:39,h:30,floors:8,tone:[.83,.68,.54],shape:'dorm',door:[36,-199],info:'主校區宿舍大樓。外部可探索；不重建住宿者房間或個人資訊。'},
    {id:'K',name:'幼兒園',en:'PRESCHOOL',x:108,z:136,w:38,d:29,h:9,floors:2,tone:[.86,.69,.55],door:[82,135],info:'僅建立外部位置示意，不設定兒童 NPC 或室內進入功能。'},
    {id:'OP',name:'實習工廠',en:'OPERATION LAB',x:-105,z:80,w:38,d:23,h:8,floors:1,tone:[.68,.71,.70],door:[-80,80],info:'依公開校園地圖配置的實習工廠外部；操作任務統一在示意工管實驗室。'},
    {id:'HANGAR',name:'飛機修護實作機棚',en:'HANGAR / RICH STARTUP HUB',x:-174,z:-240,w:48,d:31,h:13,floors:2,tone:[.72,.74,.75],shape:'hangar',door:[-173,-219],info:'公開地圖標示飛機修護實作機棚／RICH 創業基地。外觀是遊戲簡化模型。'}
  ],
  places:[
    {id:'GATE',name:'校門管制站',x:8,z:218,info:'故事起點；迎新 NPC 與任務說明。'},
    {id:'PLAZA',name:'紅磚廣場',x:6,z:24,info:'校園中央活動空間；遊戲集會與探索區。'},
    {id:'TRACK',name:'運動場',x:-170,z:-117,info:'運動場與跑道；場地尺寸為遊戲設定。'},
    {id:'COURT',name:'籃排球場',x:-105,z:-73,info:'戶外球場外部探索區。'},
    {id:'YOUTH',name:'青春廣場／籃球場',x:-151,z:34,info:'依校方地圖標示的位置配置。'},
    {id:'P1',name:'第一機車停車場',x:-16,z:131,info:'靜態停車場模型；不連接真實車牌或人員資訊。'},
    {id:'P2',name:'第二汽車停車場',x:-84,z:134,info:'外部探索與道路環境。'},
    {id:'P3',name:'第一汽車停車場',x:56,z:140,info:'外部探索與物流路徑環境。'},
    {id:'BUS',name:'公車站／YouBike 站',x:-14,z:187,info:'站點位置示意，不提供即時公車或車輛資訊。'},
    {id:'DORM2',name:'第二宿舍：校外延伸',x:-219,z:-208,info:'校方地圖註明距主校區約 2 公里。本版只顯示出口指標，沒有把宿舍錯放到主校區內。'}
  ],
  delivery:['L','M','D'],
  quality:[9.96,10.05,10.14,9.88,10.00,10.09,9.91,10.11]
};
