
/**
 * 지도관련
 */
var map;
var tData;
var mVhcl = null;
var mFrei = null;
var mainO = null;
var marP  = null;
var wms   = null;
var aroundLonLat;
var line;
var arrows;
var lineXy  = [];

var tFlag   = false;
var vFlag   = false;
var fFlag   = false;
var rFlag   = false;
var mapHei  = 0;

var corpXy  = null;

/**
 * 마우스 클릭 Event 객체
 */
var evt_    = null;

/**
 * 화물검색인지, 차량검색인지 Flag
 */
var tabFlag = "v";

/**
 * 차량정보 / 화물정보 저장용(팝업표출용)
 */
var hash  = null;
var hash1 = null;

/**
 * marker 객체 저장용
 */
var mHash  = null;
var mHash1 = null;

/**
 * ajax 검색시 사용할 로딩 이미지 및 텍스트
 */ 
var loading   = "<div style='text-align:center;padding-top:5px;'><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/loading.gif' alt='검색중...'/></div>";
var noData    = "<div style='text-align:center;padding-top:5px;'>검색결과가 없습니다.</div>";
var initData  = "<div style='text-align:center;padding-top:5px;'>검색버튼을 눌러 검색하여 주십시오.</div>";

/**
 * 이전 검색 광역시/도, 시/군/구
 */
var preSido = "";
var preGu   = "";

$(document).ready(function() {
	
	initNavi("v", "");
	resize();
	init();
	clickFunction();
	selectSido();
});

/**
 * 지도 로딩함수
 */
function init() {
	
	if(jType == "T00") {
		
		// 실행거점 얻기
		selectCorpInfo("gisMain");
	}
	
	map    = new Tmap.Map({div:'map',width:"100%",height:(Number($(window).height()) - 250) + "px", maxZoom:19,minZoom:7});

	mainO  = new Tmap.Layer.Markers();
	map.addLayers([mainO]);
	
	wms    = new Tmap.Layer.Vector('Tmap Vector Layer', {renderers:['SVG', 'CANVAS', 'VML']});
	map.addLayers([wms]);
	
   	line   = new Tmap.Layer.Vector("vectorLayerID");
   	map.addLayer(line);
   	
   	arrows = new Tmap.Layer.Vector("vectorLayerID");
   	map.addLayer(arrows);
   	
   	mFrei  = new Tmap.Layer.Markers( "MarkerLayer",{projection:pr_katech});
	map.addLayer(mFrei); 
	
	mVhcl  = new Tmap.Layer.Markers( "MarkerLayer",{projection:pr_katech});
	map.addLayer(mVhcl);
	
	marP   = new Tmap.Layer.Markers( "MarkerLayer",{projection:pr_katech});
	map.addLayer(marP);
	
	map.events.register("moveend", map, getAddress);
	map.events.register("zoomend", map, getAddress);
	map.events.register("zoomend", map, setKoreaExMainOffice);
	map.events.register("moveend", map, selectVhclByArea);
	map.events.register("zoomend", map, selectVhclByArea);
	map.events.register("moveend", map, selectFreightByArea);
	map.events.register("zoomend", map, selectFreightByArea);
	map.events.register("moveend", map, drawTrafficInfo);
	map.events.register("zoomend", map, drawTrafficInfo);
	map.events.register("movestart", map, closePopup);
	map.events.register("zoomend", map, closePopup);
	map.events.register("zoomend", map, drawLineRoute);
	map.events.register("movestart", map, closeSidoGuDong);
	map.events.register("zoomstart", map, closeSidoGuDong);
	
	var initXy = get3857LonLat(initX, initY);
	
	map.setCenter(new Tmap.LonLat(initXy.lon, initXy.lat), 17);
}

/**
 * 기준거점 얻기
 */
function selectCorpInfo(svcId) {
	
	var param = {
	 		
		svcId  : svcId,
	 	strUrl : CONST.CONTEXT_PATH + "/mdm/selectCorpInfo.fo",
	 	param  : {viewId:svcId},
	 	pCall  : selectCorpInfoCallback,
	 	pLoad  : false  
 	};
	
	// ajax 요청
 	transaction(param);
}

/**
 * 기준거점 얻기 Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function selectCorpInfoCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	var sCorpId = data.CORP_ID;		// Session CORP_ID
	var corp    = data.corpInfo;
	var len     = getSize(corp);
	var str     = "";
	
	if(len < 1) {
		
		str += "<option value='-1'>없음</option>";
	}
	
	else {
	
		corpXy = new HashMap();
		
		for(var i = 0 ; i < len ; i++) {
	
			var corpId = corp[i].CORP_ID;
			var corpNm = corp[i].CORP_NM;
			var x      = corp[i].X;
			var y      = corp[i].Y;
			
			var xy     = getKatechLonLat(x, y);
			
			corpXy.put(corpId, xy);
			
			if(sCorpId == corpId) {
			
				str  += "<option value='" + corpId + "' selected>" + corpNm + "</option>";			
			}	
			
			else {
			
				str  += "<option value='" + corpId + "'>" + corpNm + "</option>";
			}		
		}	
	}
	
	$("select[name=baseCorpIdV]").empty();
	$("select[name=baseCorpIdV]").append(str);
	
	$("select[name=baseCorpIdF]").empty();
	$("select[name=baseCorpIdF]").append(str);
}

/**
 * 데이터 객체 Size 얻기
 * @param obj
 * @returns {Number}
 */
function getSize(obj) {
	
	var len = 0;
	
	try {
		
		len = obj.length;
	}
	
	catch(err) {  }
	
	return len;
}

/**
 * 대한통운 본사 로고 표시하기
 */
function setKoreaExMainOffice() {
	
	var zoom = map.getZoom();
	
	if(zoom >= 17) {
		
	    addMarkers("koreaEx", 14134550.4711845, 4517724.2751733, CONST.CONTEXT_PATH + "/asset/images/common/koreaex.png", "100%", 50, "0", false);
	}
	
	else {
		
		removeMarkerObj("m", "a", null);
	}
}

var pr_3857   = new Tmap.Projection("EPSG:3857");	// EPSG3857
var pr_4326   = new Tmap.Projection("EPSG:4326");	// WGS84GEO
var pr_katech = new Tmap.Projection("KATECH");	    // KATECH

/**
 * 좌표변환(WGS84GEO -> EPSG3857)
 * @param coordX
 * @param coordY
 * @returns
 */
function get3857LonLat(coordX, coordY) {

	return new Tmap.LonLat(coordX, coordY).transform(pr_4326, pr_3857);
}

/**
 * 좌표변환(KATECH -> EPSG3857)
 * @param coordX
 * @param coordY
 * @returns
 */
function get3857LonLat_Katech(coordX, coordY) {
	
	return new Tmap.LonLat(coordX, coordY).transform(pr_katech, pr_3857);
}

/**
 * 좌표변환(EPSG3857 -> KATECH)
 * @param coordX
 * @param coordY
 * @returns
 */
function getKatech_epsg3857(coordX, coordY) {
	
	return new Tmap.LonLat(coordX, coordY).transform(pr_3857, pr_katech);
}

/**
 * 좌표변환(WGS84GEO -> KATECH)
 * @param coordX
 * @param coordY
 * @returns
 */
function getKatechLonLat(coordX, coordY) {
	
	return new Tmap.LonLat(coordX, coordY).transform(pr_4326, pr_katech);
}

/**
 * 차량번호로 배차번호 가져오기
 * @param vhclNo
 */
function getMnfNo(vhclNo) {
	
	var searchType   = $("select[name=searchType] option:selected").val();
	var selectBranch = $("select[name=baseCorpId] option:selected").val();
	var lspId        = $("#lspId").val();
	var shprId       = $("#shprId").val();
	var searchStart  = $("#searchStartV").val();
	
	var param = {
	 		
		svcId  : "getMnfNo",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/getMnfNo.fo",
	 	param  : {VHCL_NO:vhclNo,searchStart:searchStart,searchType:searchType,selectBranchV:selectBranch,lspId:lspId,shprId:shprId},
	 	pCall  : getMnfNoCallback,
	 	pLoad  : false
 	};

 	// ajax 요청
 	transaction(param);
}

/**
 * getMnfNo Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function getMnfNoCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	var obj    = data.mnfNo;
	var vhclNo = data.vhclNo;
	var len    = getSize(obj);
	var sMnfNo = $("input[name=MNF_NO]").val();
	var str    = "";
	
	if(len < 1) {
		
		str = "<option value=''>없음</option>";
	}
	
	else {

		for(var i = 0 ; i < len ; i++) {
			
			var mnfNo = obj[i].MNF_NO;
			
			if(sMnfNo != "" && sMnfNo) {
				
				if(sMnfNo == mnfNo) {
					
					str += "<option value='" + mnfNo + "!" + vhclNo + "' selected>" + mnfNo + "</option>";
				}
				
				else {
					
					str += "<option value='" + mnfNo + "!" + vhclNo + "'>" + mnfNo + "</option>";
				}
			}
			
			else {
				
				str += "<option value='" + mnfNo + "!" + vhclNo + "'>" + mnfNo + "</option>";
			}
		}
		
		$("select[name=mnfNo]").html(str);
	}
	
	getTolNoSub();
}

/**
 * 운송오더 분할 번호 가져오기
 */
function getTolNoSub() {
	
	$("#shprInfo").css("display", "none");
	
	var data   = $("select[name=mnfNo] option:selected").val();
	var mnfNo  = data.split("!")[0];
	var vhclNo = data.split("!")[1];
	
	var param = {
	 		
		svcId  : "getTolNoSub",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/getTolNoSub.fo",
	 	param  : {MNF_NO:mnfNo,VHCL_NO:vhclNo},
	 	pCall  : getTolNoSubCallback,
	 	pLoad  : false
 	};

 	// ajax 요청
 	transaction(param);
}

/**
 * getTolNoSub Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function getTolNoSubCallback(svcId, data, errCd, msgTp, msgCd, msgText) {

	$("#trkgEvt").text(data.trkgEvt);
	
	var obj     = data.tolNoSub;
	var len     = getSize(obj);
	var opt     = "";
	
	if(obj < 1) {

		$("select[name=tolNoSub]").html("<option value=''>없음</option>");
		$("select[name=tolNoSub]").attr("disabled", true);
	}
	
	else {
		
		for(var i = 0 ; i < len ; i++) {
			
			var tolNoSub = obj[i].TOL_NO_SUB;
			
			opt += "<option value='" + tolNoSub + "'>" + tolNoSub + "</option>";
		}
		
		$("select[name=tolNoSub]").attr("disabled", false);
		$("select[name=tolNoSub]").html(opt);
	}
	
	getShprInfo();
}

/**
 * 해당 차량의 화물정보 얻기
 */
function getShprInfo() {
	
	// 차량번호 / 배차번호 얻기
	var tolNoSub = $("select[name=tolNoSub] option:selected").val();
	
	var param    = {
	 		
		svcId  : "getShprInfo",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/getShprInfo.fo",
	 	param  : {TOL_NO_SUB:tolNoSub},
	 	pCall  : getShprInfoCallback,
	 	pLoad  : false
 	};
	
 	// ajax 요청
 	transaction(param);
}

/**
 * getShprInfo 함수 Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function getShprInfoCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	var d        = $("select[name=mnfNo] option:selected").val();
	
	var mnfNo    = d.split("!")[0];
	var vhclNo   = d.split("!")[1];
	var obj      = data.shprInfo;
	var tolNoSub = data.tolNoSub;
	
	var shprNm   = "";
	var itemNm   = "";
	var shprDt   = "";
	var soId     = "";
	
	if(obj == null) {
		
		shprNm  = "-";
		itemNm  = "-";
		shprDt  = "-";
		soId    = "";
	}
	
	else {
		
		shprNm  = obj.SHPR_NM;
		itemNm  = obj.ITEM_NM;
		shprDt  = obj.SHPR_DT;
		soId    = obj.SO_ID;
	}
	
	
	$("#shprItemNm").text(shprNm + " | " + itemNm);
	$("#shprDt").text(shprDt);
	$("#viewPopup").attr("onclick", "viewPopup(\"" + vhclNo + "\", \"" + tolNoSub + "\", \"" + mnfNo + "\", \"" + soId + "\")");
}

/**
 * 드라이버 코드를 받아 드라이버 유형명을 Return 한다.
 * @param dCode
 */
function getDriverCodeNm(dCode) {
	
	if(dCode == "T06") {
		
		return "(직영)";
	}
	
	else if(dCode == "T04") {
		
		return "(운송가맹)";
	}
	
	else if(dCode == "T05") {
		
		return "(차주)";
	}
	
	else {
		
		return "( - )";
	}
}

/**
 * 화주 유형명을 Return
 * @param shprTp
 * @returns {String}
 */
function getShprTpNm(shprTp) {
	
	if(shprTp == "T01") {
		
		return "주선가맹";
	}
	
	else if(shprTp == "T02") {
		
		return "법인화주";
	}
	
	else if(shprTp == "T03") {
		
		return "개인화주";
	}
	
	else {
		
		return "-";
	}
}

/**
 * 지도위에 Marker 올리기
 * @param id
 * @param x
 * @param y
 * @param img
 * @param width
 * @param height
 * @param mod : mod값에 따라 분기할 때 사용
 */
function addMarkers(id, x, y, img, width, height, mod, event) {
	
	var size  = new Tmap.Size(width, height);
	var xy    = new Tmap.LonLat(x, y);
	var iStr  = makeIconStr(mod, img);
	var icon  = new Tmap.IconHtml(iStr, size, null);
    var maObj = new Tmap.Markers(xy, icon);

    // 차량 Marker / 화물 Marker
    if(mod == "1" || mod == "2" || mod == "3" || mod == "4") {

    	maObj.param = id;
    	
    	// 차량
    	if(mod == "1") { 

    		maObj.events.register("click", maObj, onClickEventHandler);
    		mVhcl.addMarker(maObj);
    		
    		mHash.put(id, maObj);
    	}
    	
    	// 반경검색 중심 Marker (차량)
    	else if(mod == "3") {
    		
    		maObj.events.unregister("click", maObj, onClickEventHandler);
    		mVhcl.addMarker(maObj);
    	}

    	// 반경검색 중심 Marker (화물)
    	else if(mod == "4") {
    		
    		maObj.events.unregister("click", maObj, onClickEventHandler);
    		mFrei.addMarker(maObj);
    	}
    	
    	// 화물
    	else { 
    		
    		maObj.events.register("click", maObj, onClickEventHandler);
    		mFrei.addMarker(maObj);
    		
    		mHash1.put(id, maObj);
    	}
    }

    // 대한통운 Marker
    else if(mod == "0") {
    		
		mainO.addMarker(maObj);
	}

    else {
		
		marP.addMarker(maObj);
		
		maObj.param = id;
		maObj.x     = x;
		maObj.y     = y;
		
		if(event == true) {
			
			maObj.events.register("click", maObj, onClickEventHandler4RouteIcon);
		}
	}
}

/**
 * 지도위에 Line 그리기
 * @param pointList
 * @param extent
 */
function addLine(pointList, extent) {
	
	var lineString = new Tmap.Geometry.LineString(pointList);
	var lineColl   = new Tmap.Geometry.Collection(lineString);
	var liObj      = new Tmap.Feature.Vector(lineColl, null, styleOption1);
	
	line.addFeatures(liObj);
	
	if(extent == true) {
		
		map.zoomToExtent(line.getDataExtent());
	}
	
	// 화살표 그리기
	var arrow      = new ArrowUtil();
	
	for(var i = 0 ; i < pointList.length - 1 ; i++) {
		
		var aObj   = arrow.getPointFeature(pointList[i], pointList[i + 1]);
		
		if(aObj != null) {
			
			arrows.addFeatures(aObj);
		}
	}
}

/**
 * 소통정보 라인 그리기
 * @param style
 * @param pointList
 */
function addTrafficLine(style, pointList) {
	
	var lineString   = new Tmap.Geometry.LineString(pointList);
	var lineColl     = new Tmap.Geometry.Collection(lineString);
	var liObj        = new Tmap.Feature.Vector(lineColl, null, style);
	
	wms.addFeatures(liObj);
}


/**
 * 운행정보 보기 팝업
 * @param vhclNo
 * @param tolNoSub
 * @param mnfNo
 * @param soId
 */
function viewPopup(vhclNo, tolNoSub, mnfNo, soId) {

	if(vhclNo   == "" || !vhclNo   || vhclNo   == "undefined" || vhclNo   == null || 
	   tolNoSub == "" || !tolNoSub || tolNoSub == "undefined" || tolNoSub == null ||
	   mnfNo    == "" || !mnfNo    || mnfNo    == "undefined" || mnfNo    == null ||
	   soId     == "" || !soId     || soId     == "undefined" || soId     == null) {
	   
		alert("데이터가 없습니다.");
	}
	
	else {
		
		var param    = {
		 		
			svcId  : "gisPopInfo",
		 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/gisPopInfo.fo",
		 	param  : {mnfNo:mnfNo,vhclNo:vhclNo,tolNoSub:tolNoSub,soId:soId},
		 	pCall  : viewPopupCallback,
		 	pLoad  : false
	 	};
		
	 	// ajax 요청
	 	transaction(param);
		
		/*var options = {		
				
			isGrid     : false, 	//그리드에서 호출할 경우 true
			grdId      : null,	//isGrid가 true일 경우에만 유효
			rowId      : null,	//isGrid가 true일 경우에만 유효
			windowName : "addEqp", // name of window
			windowURL  : CONST.CONTEXT_PATH + "/gis/sub/gisPop.fo", 
			width      : "500",	//사용자정의값 우선
			height     : "650",
			scrollbars : "yes",
			param      : {mnfNo:mnfNo,vhclNo:vhclNo,tolNoSub:tolNoSub,soId:soId}
		};
		
		openWindowPopup(options);	*/
	}
}

/**
 * 운행정보 보기 Callback
 * @param svcId
 * @param data
 * @param errCd
 */
function viewPopupCallback(svcId, data, errCd) {
	
	$("#vhclNoPop").text(data.vhclNo);
	$("#lastGpsTime").text(data.popInfo.LAST_GPS_TIME);
	$("#mnfNoPop").text(data.mnfNo);
	$("#tolNoSubPop").text(data.tolNoSub);
	$("#curAddr").text(data.curAddr1 + "(" + data.curAddr + ")");
	$("#trkgEvtNm").text(data.popInfo.TRKG_EVT_NM);
	$("#shprNm").text(data.popInfo.SHPR_NM);
	$("#itemNm").text(data.popInfo.ITEM_NM);
	$("#qty").text(data.popInfo.QTY);
	$("#wt").text(data.popInfo.WT);
	$("#depAddr").text(data.popInfo.DEP_ADDR);
	$("#depReqDt").text(data.popInfo.DEP_REQ_DT);
	$("#depPgiDt").text(data.popInfo.DEP_PGI_DT);
	$("#arrAddr").text(data.popInfo.ARR_ADDR);
	$("#arrReqDt").text(data.popInfo.ARR_REQ_DT);
	$("#arrDlvryDt").text(data.popInfo.ARR_DLVRY_DT);
	
	$("#popupContent").css("display", "");
}

/**
 * 운행정보 보기 팝업 닫기
 */
function closeToolTip() {
	
	$("#popupContent").css("display", "none");
}

/**
 * 경로조회하기
 * @param vhclNo
 * @returns
 */
function viewRoute(vhclNo, x, y, mod) {
	
	mod = !mod || mod == "" || mod == null ? "1" : mod;
	
	// 상단 검색버튼 초기화
	$("#vehicleBtn").removeClass("active");
	$("#freightBtn").removeClass("active");
	$("#vehicleBtn a").attr("href", "javascript:btnOnClickHandler('vehicleBtn', 'on');");
	$("#freightBtn a").attr("href", "javascript:btnOnClickHandler('freightBtn', 'on');");
	
	var param = {
	
		svcId : "selectRoute",
		strUrl: CONST.CONTEXT_PATH + "/gis/vhcl/selectRoute.fo",
		param : {vhclNo:vhclNo, searchStartV:$('#searchStartV').val(),mod:mod,x:x,y:y},
		pCall :  selectRouteCallback
	};
	
	transaction(param);	
}

/**
 * viewRoute Callback
 * @param svcId
 * @param data
 * @param errCd
 */
function selectRouteCallback(svcId, data, errCd) {
	
	var obj    = data.ds_Route;
	var len    = getSize(obj);
	var mods   = data.mod;
	var vhclNo = data.vhclNo;
	
	$("#cargoInfo").css("display", "none");
	
	// 지도상 객체 지우기
	removeMarkerObj("v", "a", null);
	removeMarkerObj("f", "a", null);
	removeMarkerObj("p", "a", null);
	removeLineObj();
	
	if(len < 1) {
		
		alert("조회된 경로가 없습니다.");
		
		rFlag = false;
	}
	
	else {
		
		var p  = [];
		var aX = data.x;
		var aY = data.y;
		var dX = null;
		var dY = null;
		
		for(var i = 0 ; i < len ; i++) {
			
			var x  = obj[i].X;
			var y  = obj[i].Y;
			var xy = get3857LonLat_Katech(x, y);
			
			if(i == 0) {
				
				dX = x;
				dY = y;
			}
			
			p.push(new Tmap.Geometry.Point(xy.lon, xy.lat));
		}
		
		var aXy = get3857LonLat_Katech(aX, aY);
		
		p.push(new Tmap.Geometry.Point(aXy.lon, aXy.lat));
		
		// 레벨이 바뀔때 화살표를 다시 그리기 위해
		// 좌표를 저장해 놓는다.(전역객체로 저장)
		lineXy = p;
		
		addMarkers(vhclNo, dX, dY, CONST.CONTEXT_PATH + "/asset/images/sys/departure.png", 17, 29, "5", false);
		addMarkers(vhclNo, aX, aY, CONST.CONTEXT_PATH + "/asset/images/sys/arrival.png", 17, 29, "5", true);
		
		// 좌표변환 및 LonLat 객체 생성
		var cxy  = get3857LonLat_Katech(aX, aY);
		var xy   = new Tmap.LonLat(cxy.lon, cxy.lat);
		
		// 중심좌표이동 및 Extent
		if(mods == "1")      { addLine(p, true);                         }
		else if(mods == "2") { map.setCenter(xy, 18); addLine(p, false); }
		else                 { addLine(p, false);                        }
		
		rFlag = true;
	}
}

/**
 * Marker객체 클릭 이벤트 핸들러
 * @param e
 */
function onClickEventHandler(e) {
	
	var m = (this.param).split("_")[0];
	var i = (this.param).split("_")[1];
	
	if(m == "vhcl") { clickVehiCleList(i, "1"); }
	else            { clickFreightList(i, "1"); }
}

/**
 * 지도에 올릴 이미지 텍스트 만들기
 * @param mod
 * @param img
 * @returns {String}
 */
function makeIconStr(mod, img) {
	
	var str    = "<div>";
		str   += "<img src='" + img + "' alt='차량이미지' style='cursor:pointer;'/>";
		str   += "</div>";
		
	return str;
}

/**
 * 경로보기시 아이콘 클릭시 이벤트 핸들러
 * @param e
 */
function onClickEventHandler4RouteIcon(e) {
	
	viewRoute(this.param, this.x, this.y, "2");
}

/**
 * Marker 객체 삭제
 * @param target
 * @param mod
 * @param obj
 */
function removeMarkerObj(target, mod, obj) {
	
	// 모두 지우기
	if(mod == "a") {
		
		// 차량
		if(target == "v") {
			
			mVhcl.clearMarkers();
			if(mHash != null) { mHash.clear(); }
		}
		
		else if(target == "f") {
			
			mFrei.clearMarkers();
			if(mHash1 != null) { mHash1.clear(); }
		}
		
		else if(target == "m") {
			
			mainO.clearMarkers();
		}
		
		else {
			
			marP.clearMarkers();
		}
	}
	
	// 부분 지우기
	else {
		
		// 차량
		if(target == "v") {
			
			mVhcl.removeMarker(obj);
		}
		
		else if(target == "f") {
			
			mFrei.removeMarker(obj);
		}
		
		else if(target == "m") {
			
			mainO.removeMarker(obj);
		}
		
		else {
			
			marP.removeMarker(obj);
		}
	}
}

/**
 * 운행경로정보 및 화살표 삭제
 */
function removeLineObj() {
	
	line.destroyFeatures();
	line.removeAllFeatures();
	arrows.destroyFeatures();
	arrows.removeAllFeatures();
	
	lineXy = [];
	rFlag  = false;
}

/**
 * 차량검색, 교통정보 탭 클릭시
 * @param mod
 */
function tabClick(mod) {

	if(mod == "vf") {
		
		$("#trTab").removeClass("active");
		$("#vfTab").addClass("active");
		$("#container").css("display", "");
		$("#container1").css("display", "none");
		$("#btnArea").css("display", "");
		$("#areaDiv").css("display", "");
	}
	
	else if(mod == "tr") {
	
		$("#trTab").addClass("active");
		$("#vfTab").removeClass("active");
		$("#container").css("display", "none");
		$("#container1").css("display", "");
		$("#btnArea").css("display", "none");
		$("#areaDiv").css("display", "none");
	}
}

/**
 * 화면 Resize함수
 */
function resize() {

	var width  = Number($(this).width()) - 400;
	var height = Number($(this).height());
	
	$('#content').css('width', width + 'px');
	$("#popupContent").css('width', width + 'px');
	$('#leftSec .list').css('height', height - 210 +'px');
	$('#content #map').css('height', height - 210 +'px');
	$("#trafficIframe").css("height", height - 150 + "px");
}

/**
 * 탭 클릭 함수
 */
function clickFunction() {
	
	$("#area_sido").click(function () {
		
		$("#selectGu").css("display", "none");
		$("#selectDong").css("display", "none");
	
		$("#selectSido").toggle();
		$("#selectSido").val($("#selectSidoInp").val());
	});
	
	$("#area_gu").click(function () {
	
		$("#selectSido").css("display", "none");
		$("#selectDong").css("display", "none");
	
		selectGu();
	
		$("#selectGu").toggle();
	});
	
	$("#area_dong").click(function () {
	
		$("#selectSido").css("display", "none");
		$("#selectGu").css("display", "none");
	
		selectDong();
	
		$("#selectDong").toggle();
		$("#selectDong").val($("#selectDongInp").val());
	});	

	$('#selectSido').change(function() {
		
		$('#area_gu').html('시/군/구');
		$('#area_dong').html('읍/면/동');
		
		$("#area_sido").text($("#selectSido option:selected").text());
		$("#selectSidoInp").val($("#selectSido option:selected").val());
		
		$("#selectSido").toggle();
		
		$("#selectGuInp").val("");
		$("#selectDongInp").val("");
	});
	
	$('#selectGu').change(function(){

		$('#area_dong').html('읍/면/동');
	
		$("#area_gu").text($("#selectGu option:selected").text());
		$("#selectGuInp").val($("#selectGu option:selected").val());
		
		$("#selectGu").toggle();
	});
	
	$('#selectDong').change(function(){
	
		$("#area_dong").text($("#selectDong option:selected").text());
		$("#selectDongInp").val($("#selectDong option:selected").val());
	
		$("#selectDong").toggle();
				
		selectArea();
	});
	
	$('#startDateBtn').click(function(){
		$('input[name=searchStart]').focus();void(0);
	});
	
	$("#searchStart").datepicker({
		dateFormat: 'yymmdd',
		changeMonth: true,
		changeYear: true
	});
	
	var today = new Date();
	var toYear = today.getFullYear();
		var toMonth = today.getMonth()+1;
	var toDate = today.getDate();
	toMonth = "0"+toMonth;
		toMonth = toMonth.substring(toMonth.length-2, toMonth.length);
	toDate = "0"+toDate;
		toDate = toDate.substring(toDate.length-2, toDate.length);
		
		var toFullDate = toYear+toMonth+toDate;	
		$("#searchStartV").val(toFullDate);
		$("#searchStartF").val(toFullDate);
}

/**
 * 지도영역을 누르면 지역 Select box 닫기
 */
function closeSidoGuDong() {
	
	$("#selectSido").css("display", "none");
	$("#selectGu").css("display", "none");
	$("#selectDong").css("display", "none");
}

/**
 * 차량 / 화물 탭 클릭 함수
 * @param mod
 */
function vehicleFreightTab(mod, mods) {

	var vhcl = "";
	var frei = "";
	
	// 차량
	if(vFlag == false) { removeMarkerObj("v", "a", null); }
	
	// 화물
	if(fFlag == false) { removeMarkerObj("f", "a", null); }
	
	removeMarkerObj("p", "a", null);
	removeLineObj(); // 경로정보 라인 지우기
	
	// 차량 탭을 눌렀는지 화물 탭을 눌렀는지 mod값을 저장시켜놓는다.
	// 실행거점 불러오는 함수에서 사용
	$("input[name=tabMod0]").val(mod);
	
	if(mod == "v") {
	
		vhcl = "";
		frei = "none";
		
		$("#searchTypeSpan").css("display", "");
		$("#searchTypeSpan1").css("display", "");
		$("#vIndex").show();
		$("#fIndex").hide();
		
		$("#frTapLi").removeClass('active');
		$("#vhTapLi").addClass('active');	
				
		$('#searchOptTitle').text('차량 검색');
		$("#searchStart").attr("onkeypress", "keyEvent('vhcl');");
		
		var type = $("select[name=searchType] option:selected").val();
		
		if(type == "3") {
			
			$("select[name=roundMeter]").css("display", vhcl);
			$("#roundSearchSpan").css("display", vhcl);
		}
	}
	
	else {
	
		vhcl = "none";
		frei = "";
		
		$("#searchTypeSpan").css("display", "none");
		$("#searchTypeSpan1").css("display", "none");
		$("#vIndex").hide();
		$("#fIndex").show();
		
		$("#vhTapLi").removeClass('active');
		$("#frTapLi").addClass('active');
		
		$('#searchOptTitle').text('화물 검색');
		$("#searchStart").attr("onkeypress", "keyEvent('frei');");
		
		$("select[name=roundMeter]").css("display", "none");
		$("#roundSearchSpan").css("display", "none");
	}
	
	tabFlag = mod;
	
	$('#resultListV').css("display", vhcl);
	$('#resultListF').css("display", frei);
	$("#div_pageV").css("display", vhcl);
	$("#div_pageF").css("display", frei);
	
	// 상단 검색 버튼이 안눌려 있는 경우 왼쪽 결과리스트 영역을 초기화한다.
	if(vFlag == false) { $("#resultListV").html(initData);	initNavi("v", ""); }
	if(fFlag == false) { $("#resultListF").html(initData);  initNavi("f", ""); }
	
	// 운행정보 ToolTip 가리기
	closeToolTip();
	
	$('#pageNum').val('1');
	$("#cargoInfo").css("display", "none");
	
	$("select[name=baseCorpIdV]").css("display", vhcl);
	$("select[name=baseCorpIdF]").css("display", frei);
	$("select[name=searchTypeV]").css("display", vhcl);
	$("select[name=searchTypeF]").css("display", frei);
	
	$("#vehicleSearch").css("display", vhcl);
	$("#freightSearch").css("display", frei);
}

/**
 * 엔터키 이벤트 핸들러
 * @param mod
 */
function keyEvent(mod) {

	if(event.keyCode == 13) {

		if(mod == "vhcl") {
		
			searchBtnClick('v');
		}
		
		else {
		
			searchBtnClick('f');
		}
	}
}

/**
 * 좌표로 주소 검색
 */
function getAddress(e) {

	var center  = map.getCenter();
	var cX      = center.lon;
	var cY      = center.lat;
	
	var param = {
			 		
		svcId  : "selectAddrByCenterCoord",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/selectAddrByCenterCoord.fo",
	 	param  : {centerX:cX.toString(),centerY:cY.toString()},
	 	pCall  : selectAddrByCenterCoordCallback,
	 	pLoad  : false 
 	};
	
 	// ajax 요청
 	transaction(param);
}

function selectAddrByCenterCoordCallback(svcId, data, errCd) {

	var siCode   = data.addrCode.SI_CODE;
	var guCode   = data.addrCode.GU_CODE;
	var dongCode = data.addrCode.DONG_CODE;
	var sido     = data.addrCode.SI_NAME;
	var gugun    = data.addrCode.GU_NAME;
	var dong     = data.addrCode.DONG_NAME;
	
	$("#area_sido").text(sido);
	$("#area_gu").text(gugun);
	$("#area_dong").text(dong);
	$("#selectSidoInp").val(siCode);
	$("#selectGuInp").val(guCode);
	$("#selectDongInp").val(dongCode);
}

/**
 * 광역시/도 리스트 얻기
 */	
function selectSido() {
	
 	var param = {
 			
		svcId  : "selectSido", 	   //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
		strUrl : CONST.CONTEXT_PATH + "/gis/selectSido.fo",	//전송 url 
		pCall  : selectSidoGuDongCallback   //콜백 함수
	};
	
 	$("#selectSido").empty();
	transaction(param);
}

/**
 * 시/군/구 리스트 얻기
 */
function selectGu() {

	var sido  = $("#selectSidoInp").val();
	
	if(!sido || sido == "") {
		
		alert("광역시/도를 선택하여 주십시오.");
	}
	
	else {
		
		// 구 검색시 광역시/도가 바뀌지 않은 경우는 검색안함(이미 검색한 데이터가 있기때문에)
		if(preSido != sido) {
			
			var param = {
		 			
				svcId : "selectGu", 	   //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
				strUrl: CONST.CONTEXT_PATH + "/gis/selectGu.fo",	//전송 url 
				param :  {selectSido:sido}, //전송할 파라미터
				pCall :  selectSidoGuDongCallback   //콜백 함수
			};
		 	
			preSido = sido;
			
			$("#selectGu").empty();
			transaction(param);
		}
		
		else {
			
			$("#selectGu option[value=" + $("#selectGuInp").val() + "]").attr("selected", true);
		}
	}
}

/**
 * 읍 / 면 / 동 리스트 얻기
 */
function selectDong() {
	
	var gu = $("#selectGuInp").val();
	
	if(!gu || gu == "") {
		
		alert("시/군/구를 선택하여 주십시오.");
	}
	
	else {
		
		if(preGu != gu) {
			
			var param = {
		 			
				svcId : "selectDong", 	   //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
				strUrl: CONST.CONTEXT_PATH + "/gis/selectDong.fo",	//전송 url 
				param :  {selectGu:gu}, //전송할 파라미터
				pCall :  selectSidoGuDongCallback   //콜백 함수
			};
			
			preGu = gu;
			
			$("#selectDong").empty();
			transaction(param);
		}
		
		else {
			
			$("#selectDong option[value=" + $("#selectDongInp").val() + "]").attr("selected", true);
		}
	}
}

/**
 * 광역시/도, 시/군/구, 읍/면/동 리스트 얻기 Callback
 * @param svcId
 * @param data
 * @param errCd
 */
function selectSidoGuDongCallback(svcId, data, errCd) {

	var obj      = data.ds_sidoGuDong;
	var len      = getSize(obj);
	var str      = "";
	var id       = "";
	
	// 광역시 / 도
	if(svcId == "selectSido") {
		
		str      = "";
		id       = "selectSido";
		
		for(var i = 0 ; i < len ; i++) {
			
			str += "<option value='" + obj[i].SI_CODE + "'>" + obj[i].SI_NAME + "</option>";
		}
	}
	
	// 시 / 군 / 구
	else if(svcId == "selectGu") {
		
		id       = "selectGu";
		str      = "";
		
		for(var j = 0 ; j < len ; j++) {
			
			str += "<option value='" + obj[j].GU_CODE + "'>" + obj[j].GU_NAME + "</option>";
		}
	}
	
	// 읍 / 면 / 동
	else {
		
		id       = "selectDong";
		str      = "";
		
		for(var k = 0 ; k < len ; k++) {
			
			str += "<option value='" + obj[k].DONG_CODE + "'>" + obj[k].DONG_NAME + "</option>";
		}
	}
	
	$("#" + id).append(str);
	$("#" + id + " option[value=" + $("#" + id + "Inp").val() + "]").attr("selected", true);
}

/**
 * 읍 / 면 / 동 선택시 지도이동
 */
function selectArea() {
	
	var sido  = $("#area_sido").text();
	var gu    = $("#area_gu").text();
	var dong  = $("#area_dong").text();
	
	var param = {
			 		
		svcId  : "selectCenterCoord",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/selectCenterByAddr.fo",
	 	param  : {sido:sido,gugun:gu,dong:dong,bunji:"",addrFlag:"F01"},
	 	pCall  : selectAreaCallback,
	 	pLoad  : false  
 	};
	
 	// ajax 요청
 	transaction(param);
}

/**
 * selectArea Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function selectAreaCallback(svcId, data, errCd, msgTp, msgCd, msgText) {

	var x = data.coordX;
	var y = data.coordY;
	
	if(x == "0.0" || !x || x == null || y == "0.0" || !y || y == null) {
	
		alert("제공되지 않는 주소 입니다.");
	}
	
	else {
	
		map.setCenter(new Tmap.LonLat(x, y), 17);
	}
}

/**
 * 지도 이동시 차량검색하기
 */
function selectVhclByArea() {

	// 상단의 차량 버튼이 눌러져있을 때만 한다.
	if(vFlag == true) {
	
		var type = $("select[name=searchType] option:selected").val();
		
		if(type == "3") {
			
			$("select[name=searchType] option[value=1]").attr("selected", true);
		}
		
		changeSearchType();
		
		initNavi("v", "");
		selectVhcl("2");
	}
}

/**
 * 지도 이동시 화물검색하기
 */
function selectFreightByArea() {
	
	if(fFlag == true) {
		
		initNavi("f", "");
		selectFreight("2");
	}
}

/**
 * 검색버튼 클릭시
 * @param mod
 */
function searchBtnClick(mod) {
	
	// 상단 버튼 초기화
	btnOnClickHandler('vehicleBtn', 'off'); 
	btnOnClickHandler('freightBtn', 'off');
	
	$('#pageNum').val("1");
	
	if(mod == "v") {
		
		selectVhcl();
	}
	
	else {
		
		selectFreight();
	}
}

/**
 * 차량검색
 * @param val
 */
function selectVhcl(val) {

	$("#cargoInfo").css("display", "none");
	
	// 현재 보고있는 지도상에 대한 검색인 경우는 val이 있음(Extent기능을 안쓰기 위함)
	if(!val) { val = "0"; }
	
	var mbr      = map.getExtent();
	
	var minCoord = null;
	var maxCoord = null;
	var minX     = null;
	var minY     = null;
	var maxX     = null;
	var maxY     = null;

	// 현재 보고 있는 지도상의 데이터 검색시 사용
	if(val == "1" || val == "2") {
	
		minCoord = getKatech_epsg3857(mbr.left, mbr.bottom);
		maxCoord = getKatech_epsg3857(mbr.right, mbr.top);
		minX     = minCoord.lon;
		minY     = minCoord.lat;
		maxX     = maxCoord.lon;
		maxY     = maxCoord.lat;
	}
	
	var searchType    = $("select[name=searchType] option:selected").val();
	var searchStartV  = $("#searchStartV").val();
	var selectBranchV = $("select[name=baseCorpIdV] option:selected").val();
	var vhclNo        = $('#VHCL_NO').val();
	var trkgEvtCd     = $('#TRKG_EVT_TCD option:selected').val();
	var aroundMeter   = null;
	var coordX        = null;
	var coordY        = null;
	var eqpClsCd      = $("#eqpClsCdSelect option:selected").val();
	var lspId         = $("#lspId").val();
	var shprId        = $("#shprId").val();
	
	if(searchType == "3") { 
	
		var coord     = corpXy.get(selectBranchV);
		
		aroundMeter = $("select[name=roundMeter] option:selected").val();
		coordX      = coord.lon;
		coordY      = coord.lat;
	}
	else { 
		
		aroundMeter = null;
		coordX      = null;
		coordY      = null;
	}
	
	var param = {
 			
		svcId : "selectVhcl", 	   //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
		strUrl: CONST.CONTEXT_PATH + "/gis/vhcl/selectVhcl.fo",	//전송 url 
		param : {searchType:searchType,
			     joinType:jType,
			     searchStartV:searchStartV, 
			     selectBranchV:selectBranchV, 
			     VHCL_NO:vhclNo,
			     TRKG_EVT_TCD:trkgEvtCd,
			     pageNum:$('#pageNum').val(),
			     mod:val,
			     minX:minX,
			     minY:minY,
			     maxX:maxX,
			     maxY:maxY,
			     aroundMeter:aroundMeter,
			     coordX:coordX,
			     coordY:coordY,
			     eqpClsCd:eqpClsCd,
			     lspId:lspId,
			     shprId:shprId},
		pCall :  selectVhclCallback   //콜백 함수
	};
	
 	if(val == "1" || val == "2") {
 		
 		if(tabFlag == "v") {

 			$("#div_pageF").css("display", "none");
 			$("#div_pageV").css("display", "");
 			$("#resultListF").css("display", "none");
 	 	 	$("#resultListV").css("display", "");
 	 		$("#resultListV").html(loading);
 		}
 	}
 	
 	else {
 		
 		$("#div_pageF").css("display", "none");
		$("#div_pageV").css("display", "");
 		$("#resultListF").css("display", "none");
 	 	$("#resultListV").css("display", "");
 		$("#resultListV").html(loading);
 	}
 	
	transaction(param);	
}

/**
 * 차량검색 콜백
 * @param svcId
 * @param data
 * @param errCd
 */
function selectVhclCallback(svcId, data, errCd) {
	
	// DB 데이터 얻기
    var obj     = data.ds_Vhcl;
    var len     = getSize(obj);
    var mod     = data.mod;
    var sType   = $("select[name=searchType] option:selected").val();
    
    // 상단 검색 버튼 클릭시
	if(mod == "1" || mod == "2") {
	
   		removeMarkerObj("v", "a", null); // 차량삭제
   		
   		// 상단의 화물버튼이 비활성인 경우는 화물도 삭제한다. 
   		if(fFlag == false) {
   			
   			removeMarkerObj("f", "a", null); // 화물삭제
   		}
	}
	
	// 검색버튼클릭시
	else {
	
		removeMarkerObj("v", "a", null); // 차량삭제
   		removeMarkerObj("f", "a", null); // 화물삭제
	}

	// 지도상의 Marker 및 경로정보 초기화
	removeLineObj();
	removeMarkerObj("p", "a", null); // 경로보기
	
	$("#cargoInfo").css("display", "none");
	
	mHash = new HashMap();
	
    // 검색결과
    var str     = "";
    
    // 반경검색시 선택한 중심지점도 지도에 표출한다.
    if(sType == "3") {
		
		moveToCorp("V");
		addMarkers("vhclPoint", data.coordX, data.coordY, CONST.CONTEXT_PATH + "/asset/images/sys/point.png", 26, 30, "3", true);
	}
    
    if(len < 1) {
    
    	str    += noData;
    }
    
    else {
    
    	// 각 차량정보 저장용 객체
    	hash              = new HashMap();
    
    	str               = "<ul>";
    	
    	for(var i = 0 ; i < len ; i++) {
    	
    		var drvData   = obj[i].DRV_DATA;
    		var dCode     = obj[i].DRV_CD;
    		var mnfScd    = obj[i].MNF_SCD;
    		var x         = (drvData.split("!"))[1];
    		var y         = (drvData.split("!"))[2];
    		var vhclNo    = obj[i].VHCL_NO;
    		var mnfScdNm  = obj[i].MNF_SCD_NM;
    		var corpId    = obj[i].CORP_ID;
    		var corpNm    = obj[i].CORP_NM;
    		var vhclKnd   = (drvData.split("!"))[3];
    		var tonNm     = getTonCdChk(obj[i].TON);
    		var drvNm     = (drvData.split("!"))[0];
    		var mobNo     = obj[i].MOBILE_NO;
    		var lastTime  = obj[i].LAST_GPS_TM;
    		var logs      = loginLogoutHist(obj[i].INS_DT);
    		var img       = CONST.CONTEXT_PATH + "/asset/images/sys/" + dCode + "_" + mnfScd + ".PNG";
		    
		    var h         = new HashMap();
		    
		    h.put("DRIVER_NAME", drvNm);
		    h.put("MOBILE_NO", mobNo);
		    h.put("VHCL_KND_NM", vhclKnd);
		    h.put("VHCL_NO", vhclNo);
		    h.put("x", x);
		    h.put("y", y);
		    h.put("DRIVER_CODE", dCode);
		    h.put("MNF_SCD", mnfScd);
		    h.put("MNF_SCD_NM", mnfScdNm);
		    h.put("TON_NM", tonNm);
		    h.put("CORP_ID", corpId);
		    h.put("CORP_NM", corpNm);
		    h.put("LAST_GPS_TIME", lastTime);
		    h.put("img", img);
		    
		    hash.put("vhcl_" + i, h);
		    
		    if(mod == "2" || mod == "1") {
		    
		    	str      += "<li id='li" + i + "' onclick='clickVehiCleList(\"" + i + "\", \"1\");' style='cursor:pointer;'>";
		    }
		    
		    else {
		    
		    	str      += "<li id='li" + i + "' onclick='clickVehiCleList(\"" + i + "\");' style='cursor:pointer;'>";
		    }
		    
		    
		    str          += "<h3><a href='javascript:' hidefocus='true'><span></span> " + vhclNo + " " + getDriverCodeNm(dCode) + "</a><em>" + mnfScdNm + "</em></h3>";
		    str          += "<span class='info'><b>" + drvNm + "</b> : " + mobNo + " ( " + corpNm + " | " + vhclKnd + " " + tonNm + " )</span>";
		    str          += "<br/><p>최종추적시간 : " + lastTime;
		    str          += logs;
		    str          += "</li>";
		    
		    addMarkers("vhcl_" + i, x, y, img, 26, 30, "1", false);
    	}
    	
    	str   += "</ul>";
    	
    	// 검색버튼을 눌러서 검색했을 때만 Extent 기능 사용
    	if(mod == "0") {
    	
    		map.zoomToExtent(mVhcl.getDataExtent());
    	}
    }
    
    $("#resultListV").html(str);
    initNavi("v", data.page_view);
}

/**
 * 검색결과 클릭시
 * @param i
 * @param modes
 */
function clickVehiCleList(i, modes) {

	closePopup();					 // 팝업 닫기
	removeLineObj();				 // 경로정보 삭제
	removeMarkerObj("p", "a", null); // 경로정보 출발, 도착 아이콘 삭제
	
	$("#resultListV li").removeClass('active');
	
	if(hash != null) {
		
		var key = "vhcl_" + i;
		var b   = hash.containsKey(key);
		
		if(b == true) {
		
			var h      = hash.get(key);
			var x      = h.get("x");
			var y      = h.get("y");

			if(x == "" || x == null || !x || x == "undefined" || x == 0.0 || x == 0 || 
			   y == "" || y == null || !y || y == "undefined" || y == 0.0 || y == 0) {
			
				alert("유효하지 않은 좌표 입니다.");
				
				return;
			}
			
			// 좌표로 이동전 지우고 다시 그려서 위로 보이게 한다.(겹친 경우)
			var bb = mHash.containsKey(key);
			
			if(bb == true) {
			
				removeMarkerObj("v", "p", mHash.get(key));
				mHash.remove(key);
			}
			
			addMarkers(key, x, y, h.get("img"), 26, 30, "1", false);
			
			// 좌표변환 및 LonLat 객체 생성
			var cxy  = get3857LonLat_Katech(x, y);
			var xy   = new Tmap.LonLat(cxy.lon, cxy.lat);
			
			// 중심좌표이동
			// 바운더리 검색시 중심좌표 이동안함
			if(!modes) {
			
				map.setCenter(xy, 18);
			}
			
			
			// 팝업 띄우기
			makePopup(h, xy);
		}
		
		else {
		
			alert("유효하지 않은 좌표 입니다.");
		}
	}
	
	else {
	
		alert("유효하지 않은 좌표 입니다.");
	}
	
	$("#li" + i).addClass("active");		
}

/**
 * Popup 함수 (차량용)
 * @param h
 * @param xy
 */
function makePopup(h, xy) {

	// 영/공차 구분
	var m    = h.get("MNF_SCD");
	var str  = "<h3>";
		str += "<a href='javascript:'>" + h.get("VHCL_NO") + "</a> <em>" + h.get("MNF_SCD_NM") + "</em>";
		str += "</h3>";
	
	// 화면위치 계산
	// 영차인 경우 mnfNo select box 만들기
	// 공차
	if(m == "2") { 
	
		str += "<div class='sec'>";
		str += "배차번호 : <select class='select' name='mnfNo' style='width:100px;' onchange='getTolNoSub();'></select>&nbsp;&nbsp;&nbsp;&nbsp;";
		str += "운송주문번호 : <select class='select' name='tolNoSub' style='width:100px;' onchange='getShprInfo();'></select>";
		str += "</div>";
	}
		
	str += "<div class='sec'>";
	str += "<span class='info'><b>" + h.get("DRIVER_NAME") + "</b> : " + h.get("MOBILE_NO") + " ( " + h.get("CORP_NM") + " | " + h.get("VHCL_KND_NM") + " " + h.get("TON_NM") + " )</span>";
	str += "<p>최종추적시간 : " + h.get("LAST_GPS_TIME");
	
	if(m == "2") {
	
		str += "<br/><span id='trkgEvtSpan'>운행보고상태 : <span id='trkgEvt'></span></span></p>";
	}
	
	else {
		
		str += "</p>";
	}
	
	str += "</div>";
	
	if(m == "2") {
	
		str += "<div class='sec'>";
		str += "<span class='info'>";
		str += "화주정보 : <span id='shprItemNm'>　</span><br/>주문일자 : <span id='shprDt'></span>";
		str += "</span>";
		str += "</div>";
		str += "<div class='centerBtn'>";
		str += "<a href='javascript:' onclick='' id='viewPopup'>운행정보</a>&nbsp;";
		str += "<a href='javascript:' onclick='viewRoute(\"" + h.get("VHCL_NO") + "\", \"" + h.get("x") + "\",\"" + h.get("y") + "\");' id='viewRoute'>경로정보</a>";
		str += "</div>";
	}
	
	else {
	
		str += "<div class='centerBtn'>";
		str += "<a href='javascript:' onclick='viewRoute(\"" + h.get("VHCL_NO") + "\", \"" + h.get("x") + "\",\"" + h.get("y") + "\");' id='viewRoute'>경로정보</a>";
		str += "</div>";
	}
	
	str += "<a href='javascript:' class='closeBtn'><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/btn_layer_close.gif' alt='닫기' onclick='closePopup();'/></a>";
	
	$("#cargoInfo").css("display", "block");
	$("#cargoInfo").html(str);
	
	// 팝업창 위치를 초기화하고 다시 띄운다.
	initPopupLoc();
	
	// 팝업 띄우기
	var pix  = map.getPixelFromLonLat(xy);
	
	var t    = Number(pix.y) + 190;
	var l    = Number(pix.x) + 410;
	
	var top  = 0;
	var left = 0;
	
	var mapH = Number($(window).height());
	var mapW = Number($(window).width());
	var cHei = Number($("#cargoInfo").height());
	var cWid = Number($("#cargoInfo").width());
	var t1   = t + cHei;
	var l1   = l + cWid;
	
	/*alert(mapH + "/" + t1 + "/" + t + "/" + cHei);*/
	//alert(mapW + "/" + (l + cWid) + "/" + l);
	
	if(mapH >= t1) { top = t;              }
	else           { top = t - cHei - 16;  }
	
	if(mapW >= l1) { left = l;             }
	else           { left = l - cWid - 28; }
	
	$("#cargoInfo").css({
	
		"top"  : top + "px",
		"left" : left + "px"
	});
	
	if(m == "2") { getMnfNo(h.get("VHCL_NO")); }
}

// 팝업창 위치 초기화하기
function initPopupLoc() {

	$("#cargoInfo").css({
	
		"top"  : "0px",
		"left" : "0px"
	});
}

/**
 * 차량 팝업 닫기
 */
function closePopup() {

	$("#cargoInfo").css("display", "none");
	$(".list li").removeClass('active');
	
	// 운행정보 ToolTip 닫기
	closeToolTip();
}

/**
 * 화물검색
 * @param val
 */
function selectFreight(val) {

	$("#cargoInfo").css("display", "none");
	
	// 현재 보고있는 지도상에 대한 검색인 경우는 val이 있음(Extent기능을 안쓰기 위함)
	if(!val) { val = "0"; }
	
	var mbr      = map.getExtent();
	
	var minCoord = null;
	var maxCoord = null;
	var minX     = null;
	var minY     = null;
	var maxX     = null;
	var maxY     = null;

	// 현재 보고 있는 지도상의 데이터 검색시 사용
	if(val == "1" || val == "2") {
	
		minCoord = getKatech_epsg3857(mbr.left, mbr.bottom);
		maxCoord = getKatech_epsg3857(mbr.right, mbr.top);
		minX     = minCoord.lon;
		minY     = minCoord.lat;
		maxX     = maxCoord.lon;
		maxY     = maxCoord.lat;
	}
	
	var searchStartF  = $("#searchStartF").val();
	var selectBranchF = $("select[name=baseCorpIdF] option:selected").val();
	var soId          = $("input[name=soId]").val();
	var shprNm        = $("#SHPR_NAME").val();
	var freightStatus = $("select[name=freightStatus] option:selected").val();
	var lspId         = $("#lspId").val();
	var shprId        = $("#shprId").val();
	
	var param = {
			
		svcId : "selectFreight", 	   //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
		strUrl: CONST.CONTEXT_PATH + "/gis/freight/selectFreight.fo",	//전송 url 
		param : {searchStartF:searchStartF,
			     selectBranchF:selectBranchF,
			     soId:soId,
			     SHPR_NAME:shprNm, 
			     freightStatus:freightStatus,
			     lspId:lspId,
			     shprId:shprId,
			     pageNum:$('#pageNum').val(),
			     mod:val,
			     minX:minX,
			     minY:minY,
			     maxX:maxX,
			     maxY:maxY},
		pCall :  selectFreightCallback   //콜백 함수
	};
	
	if(val == "1" || val == "2") {
 		
 		if(tabFlag == "f") {
 			
 			$("#div_pageV").css("display", "none");
 			$("#div_pageF").css("display", "");
 			$("#resultListV").css("display", "none");
 	 		$("#resultListF").css("display", "");
 	 		$("#resultListF").html(loading);
 		}
 	}
 	
 	else {
 		
 		$("#div_pageV").css("display", "none");
		$("#div_pageF").css("display", "");
 		$("#resultListV").css("display", "none");
 		$("#resultListF").css("display", "");
 		$("#resultListF").html(loading);
 	}
	
	transaction(param);	
}

function selectFreightCallback(svcId, data, errCd) {

	var obj = data.ds_Freight;
	var len = getSize(obj);
	var mod = data.mod;
	
	// 상단 검색 버튼 클릭시
	if(mod == "1" || mod == "2") {
		
		removeMarkerObj("f", "a", null); // 화물삭제
		
		// 상단의 차량검색버튼이 비활성인 경우 차량도 삭제한다.
		if(vFlag == false) {
			
			removeMarkerObj("v", "a", null); // 차량삭제
		}
	}
	
	// 검색버튼 클릭시
	else {
		
		removeMarkerObj("f", "a", null); // 화물삭제
		removeMarkerObj("v", "a", null); // 차량삭제
	}
	
	// 지도상 Marker객체 및 경로정보 초기화
	removeLineObj();
	removeMarkerObj("p", "a", null); // 경로보기
	
	mHash1 = new HashMap();
	
	// 검색결과
	var str = "";
	
	if(len < 1) {
		
		str = noData;
	}
	
	else {
		
		hash1 = new HashMap();
		
		str   = "<ul>";
		
		for(var i = 0 ; i < len ; i++) {
			
			var soId      = obj[i].SO_ID;
			var eoScdNm   = obj[i].EO_SCD_NM;
			var corpNm    = obj[i].CORP_NM;
			var shprNm    = obj[i].SHPR_NM;
			var shprDt    = obj[i].SHPR_DT;
			var shprTel   = obj[i].SHPR_TEL;
			var shprTp    = obj[i].SHPR_TP;
			var itemNm    = obj[i].ITEM_NM;
			var eoScd     = obj[i].EO_SCD;
			var x         = obj[i].X;
			var y         = obj[i].Y;
			var drvCd     = obj[i].DRV_CD;
			var drvNm     = obj[i].DRV_NM;
			var vCorpNm   = obj[i].V_CORP_NM;
			var vhclNo    = obj[i].VHCL_NO;
			var trkgEvt   = "-";
			var mnfNo     = obj[i].MNF_NO;
			var tolNoSub  = obj[i].TOL_NO_SUB;
			var mobileNo  = obj[i].MOBILE_NO;
			var vKnd      = obj[i].V_KND;
			var ton       = getTonCdChk(obj[i].TON);
			var lastGpsTm = obj[i].LAST_GPS_TM;
			var xyCnt     = obj[i].CNT;
			
			var img     = "";
			
			if(eoScd == "100") {
				
				img     = CONST.CONTEXT_PATH + "/asset/images/sys/" + drvCd + "_2.PNG";
			}
			
			else {
				
				if(xyCnt == 1) {
					
					img = CONST.CONTEXT_PATH + "/asset/images/sys/f_" + eoScd + ".PNG";
				}
				
				else {
					
					img = CONST.CONTEXT_PATH + "/asset/images/sys/f_" + eoScd + "_more.png";
				}
			}
			
			var h       = new HashMap();
			
		    h.put("SO_ID", soId);
		    h.put("SHPR_NM", shprNm);
		    h.put("SHPR_TEL", shprTel);
		    h.put("SHPR_DT", shprDt);
		    h.put("SHPR_TP", shprTp);
		    h.put("x", x);
		    h.put("y", y);
		    h.put("ITEM_NM", itemNm);
		    h.put("EO_SCD", eoScd);
		    h.put("EO_SCD_NM", eoScdNm);
		    h.put("CORP_NM", corpNm);
		    h.put("V_CORP_NM", vCorpNm);
		    h.put("VHCL_NO", vhclNo);
		    h.put("TRKG_EVT", trkgEvt);
		    h.put("MNF_NO", mnfNo);
		    h.put("TOL_NO_SUB", tolNoSub);
		    h.put("DRV_CD", drvCd);
		    h.put("DRV_NM", drvNm);
		    h.put("MOBILE_NO", mobileNo);
		    h.put("V_KND", vKnd);
		    h.put("TON", ton);
		    h.put("LAST_GPS_TIME", lastGpsTm);
		    h.put("img", img);
		    
		    hash1.put("frei_" + i, h);
		    
		    if(mod == "2" || mod == "1") {
		    
		    	str      += "<li id='liF" + i + "' onclick='clickFreightList(\"" + i + "\", \"1\");' style='cursor:pointer;'>";
		    }
		    
		    else {
		    
		    	str      += "<li id='liF" + i + "' onclick='clickFreightList(\"" + i + "\");' style='cursor:pointer;'>";
		    }
			
			str  += "<h3><a href='javascript:' hidefocus='true'><span></span> " + soId + " (" + getShprTpNm(shprTp) + ")</a> <em>" + eoScdNm + "</em></h3>";
			str  += "<span class='info'><b>" + shprNm + "</b> ( " + corpNm + " )</span>";
			str  += "<p>품목 : " + itemNm + "</p>";
			str  += "<p>연락처 : " + shprTel + " | 주문일자 : " + shprDt + "</p>";
			str  += "<div>";
			str  += "</div>";
			str  += "</li>";
			
			addMarkers("frei_" + i, x, y, img, 26, 30, "2", false);
		}
		
		str  += "</ul>";
		
		// 검색버튼을 눌러서 검색했을 때만 Extent 기능 사용
    	if(mod == "0") {
    	
    		map.zoomToExtent(mFrei.getDataExtent());
    	}
	}
	
	$("#resultListF").html(str);
    initNavi("f", data.page_view); 
}

/**
 * 검색결과 클릭시 (화물용)
 * @param i
 * @param modes
 */
function clickFreightList(i, modes) {

	closePopup();					 // 팝업 닫기
	removeLineObj();				 // 경로정보 삭제
	removeMarkerObj("p", "a", null); // 경로정보 출발, 도착 아이콘 삭제
	
	$("#resultListF li").removeClass('active');
	
	if(hash1 != null) {
		
		var key = "frei_" + i;
		var b   = hash1.containsKey(key);
		
		if(b == true) {
		
			var h      = hash1.get(key);
			var x      = h.get("x");
			var y      = h.get("y");
			
			if(x == "" || x == null || !x || x == "undefined" || x == 0.0 || x == 0 || 
			   y == "" || y == null || !y || y == "undefined" || y == 0.0 || y == 0) {
			
				alert("유효하지 않은 좌표 입니다.");
				
				return;
			}
			
			// 좌표로 이동전 지우고 다시 그려서 위로 보이게 한다.(겹친 경우)
			var bb = mHash1.containsKey(key);
			
			if(bb == true) {
			
				removeMarkerObj("f", "p", mHash1.get(key));
				mHash1.remove(key);
			}
			
			addMarkers(key, x, y, h.get("img"), 26, 30, "2", false);
			
			// 좌표변환 및 LonLat 객체 생성
			var cxy  = get3857LonLat_Katech(x, y);
			var xy   = new Tmap.LonLat(cxy.lon, cxy.lat);
			
			// 중심좌표이동
			// 바운더리 검색시 중심좌표 이동안함
			if(!modes) {
			
				map.setCenter(xy, 18);
			}
			
			
			// 팝업 띄우기
			makePopupF(h, xy);
		}
		
		else {
		
			alert("유효하지 않은 좌표 입니다.");
		}
	}
	
	else {
	
		alert("유효하지 않은 좌표 입니다.");
	}
	
	$("#liF" + i).addClass("active");
}

/**
 * Popup 함수 (화물용)
 * @param h
 * @param xy
 */
function makePopupF(h, xy) {

	// 영/공차 구분
	var eo   = h.get("EO_SCD");
	
	var str  = "";
	
	if(eo == "100") {
		
		str  = "<h3>";
		str += "<a href='javascript:'>" + h.get("VHCL_NO") + "</a> <em>영차</em>";
		str += "</h3>";
		str += "<div class='sec'>";
		str += "배차번호 : " + h.get("MNF_NO") + "&nbsp;&nbsp;&nbsp;&nbsp;";
		str += "주문번호 : " + h.get("SO_ID");
		str += "</div>";
		str += "<div class='sec'>";
		str += "<span class='info'><b>" + h.get("DRV_NM") + "</b> : " + h.get("MOBILE_NO") + " ( " + h.get("CORP_NM") + " | " + h.get("V_KND") + " " + h.get("TON") + " )</span>";
		str += "<p>최종추적시간 : " + h.get("LAST_GPS_TIME");
		str += "<br/><span id='trkgEvtSpan'>운행보고상태 : <span id='trkgEvtSpanF'></span></span></p>";
		str += "</div>";
		str += "<div class='sec'>";
		str += "<span class='info'>";
		str += "화주정보 : " + h.get("SHPR_NM") + " | " + h.get("ITEM_NM") + "<br/>주문일자 : " + h.get("SHPR_DT");
		str += "</span>";
		str += "</div>";
		str += "<div class='centerBtn'>";
		str += "<a href='javascript:' onclick='viewPopup(\"" + h.get("VHCL_NO") + "\", \"" + h.get("TOL_NO_SUB") + "\", \"" + h.get("MNF_NO") + "\", \"" + h.get("SO_ID") + "\")' id='viewPopup'>운행정보</a>&nbsp;";
		str += "<a href='javascript:' onclick='viewRoute(\"" + h.get("VHCL_NO") + "\", \"" + h.get("x") + "\",\"" + h.get("y") + "\");' id='viewRoute'>경로정보</a>";
		str += "</div>";
	}
	
	else {
		
		str  = "<h3>";
		str += "<a href='javascript:'>" + h.get("SO_ID") + "</a> <em>" + h.get("EO_SCD_NM") + "</em>";
		str += "</h3>";
		str += "<div class='sec'>";
		str += "<span><b>" + h.get("SHPR_NM") + "</b>　( " + h.get("CORP_NM") + " ) - " + getShprTpNm(h.get("SHPR_TP")) + "</span><br/>";
		str += "<p>품목 : <span>" + h.get("ITEM_NM") + "<br/>";
		str += "연락처 : " + h.get("SHPR_TEL") + " | 주문일자 : " + h.get("SHPR_DT") + "</span></p>";
		str += "</div>";
	}
	
	str += "<a href='javascript:' class='closeBtn'><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/btn_layer_close.gif' alt='닫기' onclick='closePopup();'/></a>";
	
	$("#cargoInfo").css("display", "block");
	$("#cargoInfo").html(str);
	
	// 팝업창 위치를 초기화하고 다시 띄운다.
	initPopupLoc();
	
	// 팝업 띄우기
	var pix  = map.getPixelFromLonLat(xy);
	
	var t    = Number(pix.y) + 190;
	var l    = Number(pix.x) + 410;
	
	var top  = 0;
	var left = 0;
	
	var mapH = Number($(window).height());
	var mapW = Number($(window).width());
	var cHei = Number($("#cargoInfo").height());
	var cWid = Number($("#cargoInfo").width());
	var t1   = t + cHei;
	var l1   = l + cWid;
	
	/*alert(mapH + "/" + t1 + "/" + t + "/" + cHei);*/
	//alert(mapW + "/" + (l + cWid) + "/" + l);
	
	if(mapH >= t1) { top = t;              }
	else           { top = t - cHei - 16;  }
	
	if(mapW >= l1) { left = l;             }
	else           { left = l - cWid - 28; }
	
	$("#cargoInfo").css({
	
		"top"  : top + "px",
		"left" : left + "px"
	});
	
	if(eo == "100") { getTrkgEvt(h.get("MNF_NO"), h.get("VHCL_NO")); }
}

/**
 * 페이징 처리 검색
 * @param pageNum
 */
function goPage(pageNum) {

	$("#pageNum").val(pageNum);		//페이징 번호
	
	var status = $('input[name=tabMod0]').val();
	
	if(status == 'v') {
	 	
		if(vFlag == true) { selectVhcl("2"); }
		else              { selectVhcl();    }
	}
	
	else {
		
		if(fFlag == true) { selectFreight("2"); }
		else              { selectFreight();    }
	}
}
// 페이징 end

// 상단 버튼 이벤트 핸들러
function btnOnClickHandler(id, mod) {

	var mode = "";
	var type = $("select[name=searchType] option:selected").val();

	if(mod == "on") {

		mode = "off";	
			
		// 교통정보
		if(id == "trafficBtn") {
	
			showTraffic("on");
		}
		
		// 차량검색
		else if(id == "vehicleBtn") {

			vFlag = true;
			
			if(type == "3") {
				
				$("select[name=searchType] option[value=1]").attr("selected", true);
			}
			
			changeSearchType();
			initNavi("v", "");
			selectVhcl("1");
			vehicleFreightTab("v");
		}
		
		// 화물검색
		else {
		
			fFlag = true;
			
			initNavi("f", "");
			selectFreight("1");
			vehicleFreightTab("f");
		}
		
		$("#" + id).addClass("active");
	}
	
	else {
	
		mode = "on";
	
		// 교통정보
		if(id == "trafficBtn") {
	
			showTraffic("off");
		}
		
		// 차량검색
		else if(id == "vehicleBtn") {
		
			vFlag = false;
		}
		
		// 화물검색
		else {
		
			fFlag = false;
		}
		
		$("#" + id).removeClass("active");
	}
	
	$("#" + id + " a").attr("href", "javascript:btnOnClickHandler('" + id + "', '" + mode + "');");
}

/**
 * 주소 select box 닫기
 */
function hideAddrPopup() {

	$("#selectSido").css("display", "none");
	$("#selectGu").css("display", "none");
	$("#selectDong").css("display", "none");
}

/**
 * 페이징 네비게이션 초기화
 */
function initNavi(mode, pageView) {
	
	var navi = "<strong>1</strong>";
	var id   = "";
	
	if(mode == "v") { id = "div_pageV"; }
	else            { id = "div_pageF"; }
	
	if(pageView == "" || !pageView) {
		
		$("#" + id).html(navi);
	}
		
	else {
		
		$("#" + id).html(pageView);
	}
}

/**
 * 소통정보표출 - 백터방식
 */
function drawTrafficInfo() {
	
	if(wms != null) { wms.removeAllFeatures(); }
	
	if(tFlag == true) {
		
		var zoom    = map.getZoom();
		var mbr     = map.getExtent();

		var minLon  = mbr.left;
		var minLat  = mbr.bottom;
		var maxLon  = mbr.right;
		var maxLat  = mbr.top;
		
		var param = {
		 		
			svcId  : "showTraffic",
		 	strUrl : CONST.CONTEXT_PATH + "/kxp/selectTrafficInfo.fo",
		 	param  : {minLon:minLon.toString(),minLat:minLat.toString(),maxLon:maxLon.toString(),maxLat:maxLat.toString(),zoomLevel:zoom},
		 	pCall  : drawTrafficInfoCallback,
		 	pLoad  : false
	 	};
		
	 	// ajax 요청
	 	transaction(param);
	}
}

function drawTrafficInfoCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	if(tFlag == true) {
		
		var obj = data.trafficInfo;
		var z   = data.zoom;
		var len = getSize(obj);
		
		if(len > 0) {
			
			for(var i = 0 ; i < len ; i++) {
				
				var geo  = obj[i].geometry;
				var prop = obj[i].properties;
				var type = geo.type;
				
				if(type == "LineString") {
					
					var coord = geo.coordinates;
					var cong  = prop.congestion;
					
					var lens  = getSize(coord);
					var p     = [];
					
					for(var j = 0 ; j < lens ; j++) {
						
						var x = coord[j][0];
						var y = coord[j][1];
					
						p.push(new Tmap.Geometry.Point(x, y));
					}
					
					var style = getStyleOption(z, cong);
					
					addTrafficLine(style, p);
				}
			}
		}
	}
	
	else {
		
		if(wms != null) { wms.removeAllFeatures(); }
	}
}

/**
 * 교통정보 보기 / 숨기기
 * @param flag
 */
function showTraffic(flag) {
	
	if(flag == "on") {
		
		tFlag = true;
		
		drawTrafficInfo();
	}
	
	else {
		
		tFlag = false;
		
		wms.removeAllFeatures();
	}
}

/**
 * Zoom Level 변경시 화살표 크기 변경 (경로보기 기능)
 * @param e
 */
function drawLineRoute(e) {
	
	if(rFlag == true) {
		
		arrows.destroyFeatures();
		arrows.removeAllFeatures();
		
		// 화살표 그리기
		var arrow    = new ArrowUtil();
		
		for(var i = 0 ; i < lineXy.length - 1 ; i++) {
			
			var aObj = arrow.getPointFeature(lineXy[i], lineXy[i + 1]);
			
			if(aObj != null) {
				
				arrows.addFeatures(aObj);
			}
		}
	}
}

/**
 * 차량운행보고 상태 얻기 
 * @param mnfNo
 * @param vhclNo
 */
function getTrkgEvt(mnfNo, vhclNo) {
	
	var param = {
	 		
		svcId  : "getTrkgEvt",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/getTrkgEvt.fo",
	 	param  : {MNF_NO:mnfNo,VHCL_NO:vhclNo},
	 	pCall  : getTrkgEvtCallback,
	 	pLoad  : false
 	};
	
 	// ajax 요청
 	transaction(param);
}

function getTrkgEvtCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	$("#trkgEvtSpanF").text(data.trkgEvt);
}

/**
 * 톤수 체크해서 단위 붙이기
 * @param tonCd
 * @returns {String}
 */
function getTonCdChk(tonCd) {
	
	var ton = "";
	
	if(!tonCd || tonCd == "" || tonCd == null || tonCd == "null") {
		
		ton = "-";
	}
	
	else {
		
		if(tonCd == "톤수없음") {
			
			ton = tonCd;
		}
		
		else {
			
			ton = tonCd + "톤";
		}
	}
	
	return ton;
}

/**
 * 차량의 로그인, 로그아웃 상태 만들기
 */
function loginLogoutHist(insDt) {
	
	if(insDt == null || insDt == "" || insDt == "/" || insDt == "null") {
		
		return "</p>";
	}
	
	else {
		
		var d   = insDt.split("/");
		var log = d[0] == "Y" ? "로그인 중" : "로그아웃";
		
		return "<br/>상태 : " + log + " ( " + d[1] + " )</p>"; 
	}
}

/**
 * 검색유형 바꿀 때 검색조건 바꾸기
 */
function changeSearchType() {
	
	var type = $("select[name=searchType] option:selected").val();
	
	if(type == "1" || type == "2") {
		
		$("#roundSearchSpan").css("display", "none");
		$("select[name=roundMeter]").css("display", "none");	
	}
	
	else {
		
		$("#roundSearchSpan").css("display", "");
		$("select[name=roundMeter]").css("display", "");
		
		btnOnClickHandler('vehicleBtn', 'off');
	}
}

/**
 * 지사좌표로 이동
 * @param mod
 */
function moveToCorp(mod) {
	
	var corpId = $("select[name=baseCorpId" + mod + "] option:selected").val();
	var cXy    = corpXy.get(corpId); 
	var xyy    = get3857LonLat_Katech(cXy.lon, cXy.lat);
	
	map.setCenter(new Tmap.LonLat(xyy.lon, xyy.lat), 14);
}

