
/**
 * 차량정보 저장용(팝업표출용)
 */
var hash  = null;

/**
 * marker 객체 저장용
 */
var mHash = null;

/**
 * ajax 검색시 사용할 로딩 이미지
 */
var loading = "<div style='text-align:center;padding-top:5px;'><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/loading.gif' alt='검색중...'/></div>";


/**
 * 실행거점 얻기
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
 * 실행거점 얻기 Callback
 * @param svcId
 * @param data
 * @param errCd
 * @param msgTp
 * @param msgCd
 * @param msgText
 */
function selectCorpInfoCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	var sCorpId = data.CORP_ID;		// Session CORP_ID
	var admin   = data.adminYn;
	var corp    = data.corpInfo;
	var len     = getSize(corp);
	var str     = "";
	
	if(len < 1) {
		
		str += "<option value='-1'>없음</option>";
	}
	
	else {
	
			
		if(admin == "Y") {
			
			str += "<option value=''>전체</option>";
		}
		
		for(var i = 0 ; i < len ; i++) {
	
			var corpId = corp[i].CORP_ID;
			var corpNm = corp[i].CORP_NM;
			
			if(sCorpId == corpId) {
			
				str  += "<option value='" + corpId + "' selected>" + corpNm + "</option>";			
			}	
			
			else {
			
				str  += "<option value='" + corpId + "'>" + corpNm + "</option>";
			}		
		}	
	}
	
	$("select[name=baseCorpId]").empty();
	$("select[name=baseCorpId]").append(str);
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
		
	    addMarkers("koreaEx", 14134550.4711845, 4517724.2751733, CONST.CONTEXT_PATH + "/asset/images/common/koreaex.png", "100%", 50, "0");
	}
	
	else {
		
		mainO.clearMarkers();
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
	
	var param = {
	 		
		svcId  : "getMnfNo",
	 	strUrl : CONST.CONTEXT_PATH + "/gis/vhcl/getMnfNo.fo",
	 	param  : {VHCL_NO:vhclNo},
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
	$("#shprDt").text("( 주문일자 : " + shprDt + ")");
	$("#viewPopup").attr("onclick", "viewPopup(\"" + vhclNo + "\", \"" + tolNoSub + "\", \"" + mnfNo + "\", \"" + soId + "\")");
	$("#viewRoute").attr("onclick", "viewRoute(\"" + vhclNo + "\");");
}

/**
 * 직영차량의 경우 드라이버 유형명을 Return 한다.
 * @param dCode
 */
function getDriverCodeNm(dCode) {
	
	if(dCode == "T06") {
		
		return "(직영)";
	}
	
	else {
		
		return "";
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
function addMarkers(id, x, y, img, width, height, mod) {
	
	var size  = new Tmap.Size(width, height);
	var xy    = new Tmap.LonLat(x, y);
	var iStr  = makeIconStr(mod, img);
	var icon  = new Tmap.IconHtml(iStr, size, null);
    var maObj = new Tmap.Markers(xy, icon);

    // 일반 Marker
    if(mod == "1") {

    	maObj.param = id;
    	maObj.events.register("click", maObj, onClickEventHandler);
    	
    	markers.addMarker(maObj);
    	mHash.put(id, maObj);
    }

    // 대한통운 Marker
    else if(mod == "0") {
    		
		mainO.addMarker(maObj);
	}

    else {
		
		marP.addMarker(maObj);
	}
}

/**
 * 지도위에 Line 그리기
 * @param pointList
 * @param extent
 */
function addLine(pointList, extent) {
	
	var lineString   = new Tmap.Geometry.LineString(pointList);
	var lineColl     = new Tmap.Geometry.Collection(lineString);
	var liObj        = new Tmap.Feature.Vector(lineColl, null, styleOption);
	
	vectorLayer.addFeatures(liObj);
	
	if(extent == true) {
		
		map.zoomToExtent(vectorLayer.getDataExtent());
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
		
		var options = {		
				
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
		
		openWindowPopup(options);	
	}
}

/**
 * 경로조회하기
 * @param vhclNo
 * @returns
 */
function viewRoute(vhclNo){
 
	var param = {
	
		svcId : "selectRoute",
		strUrl: CONST.CONTEXT_PATH + "/gis/vhcl/selectRoute.fo", 
		param : {vhclNo:vhclNo, searchStartV:$('#searchStart').val()},
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
	
	var obj = data.ds_Route;
	var len = getSize(obj);
	
	vectorLayer.removeAllFeatures();
	markers.clearMarkers();
	marP.clearMarkers();
	
	$("#cargoInfo").css("display", "none");
	
	if(len < 1) {
		
		alert("조회된 경로가 없습니다.");
	}
	
	else {
		
		var p = [];
		var aX = null;
		var aY = null;
		
		for(var i = 0 ; i < len ; i++) {
			
			var x  = obj[i].X;
			var y  = obj[i].Y;
			var xy = get3857LonLat_Katech(x, y);
			
			p.push(new Tmap.Geometry.Point(xy.lon, xy.lat));
			
			if(i == len - 1) {
				
				aX = x;
				aY = y;
			}
		}
		
		addMarkers("point", aX, aY, CONST.CONTEXT_PATH + "/asset/images/sys/point.png", 17, 29, "2");
		addLine(p, true);
	}
}

/**
 * 소통정보 On Off 버튼 함수
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
 * 소통정보표출
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
		 		
			svcId  : "drawTrafficInfo",
		 	strUrl : CONST.CONTEXT_PATH + "/kxp/selectTrafficInfo.fo",
		 	param  : {minLon:minLon.toString(),minLat:minLat.toString(),maxLon:maxLon.toString(),maxLat:maxLat.toString(),zoomLevel:zoom},
		 	pCall  : drawTrafficInfoCallback,
		 	pLoad  : false
	 	};
		
	 	// ajax 요청
	 	transaction(param);
	}
}

/**
 * 소통정보 표출 Callback
 */ 
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
 * Marker객체 클릭 이벤트 핸들러
 * @param e
 */
function onClickEventHandler(e) {
	
	var i   = (this.param).split("_")[1];
	
	clickVehiCleList(i, "1");
}

/**
 * 지도에 올릴 이미지 텍스트 만들기
 * @param mod
 * @param img
 * @returns {String}
 */
function makeIconStr(mod, img) {
	
	var style  = "";
	
	if(mod == "1") { style = "style='cursor:pointer;'"; }
	else           { style = "";                        }
	
	var str    = "<div>";
		str   += "<img src='" + img + "' alt='차량이미지' " + style + "/>";
		str   += "</div>";
		
	return str;
}

