
var loading  = "<div style='text-align:center;padding-top:5px;'><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/bigLoading.gif' alt='검색중...'/></div>";
var noData   = "<center><img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/img_noresult.gif' alt='결과없음'/></center>";

$(document).ready(function() {
	
	resize();
	calendar();

	if(jType == "T00") {
		
		selectCorpInfo("gisTracking");
	}
	
	else {
		
		selectTracking();
	}
});

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
	var corp    = data.corpInfo;
	var len     = getSize(corp);
	var str     = "";
	
	if(len < 1) {
		
		str += "<option value='-1'>없음</option>";
	}
	
	else {
	
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
	
	selectTracking();
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

function resize() {
	
	$(window).resize(function() {

		var width  = Number($(this).width()) - 30;
		var height = Number($(this).height());
		var hei    = height - 200;
		
		$('#content').css('width', width + 'px');
		$(".result").css({
			
			"height" : hei + "px",
			"overflow-y" : "auto"
		});
		
	}).resize();
}

/**
 * 달력
 */
function calendar() {
	
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
		$("#searchStart").val(toFullDate);
}

/**
 * 차량 실적현황 조회
 */
function selectTracking() {

	var searchStart  = $("#searchStart").val();
	var searchType   = $("select[name=searchType] option:selected").val();
	var baseCorpId   = $("select[name=baseCorpId] option:selected").val();
	var eqpClsCd     = $("select[name=eqpClsCd] option:selected").val();
	var shprId       = $("input[name=shprId]").val();
	var lspId        = $("input[name=lspId]").val();
	var shprNm       = $("#SHPR_NAME").val();
	var vhclNo       = $("#VHCL_NO").val();
	
	var param = {
			
 		svcId:"selectTracking",
 		strUrl: CONST.CONTEXT_PATH + "/gis/selectTracking.fo",
 		param : {searchStart:searchStart,searchType:searchType,baseCorpId:baseCorpId,eqpClsCd:eqpClsCd,shprId:shprId,lspId:lspId,SHPR_NAME:shprNm,VHCL_NO:vhclNo},
 		pCall : selectTrackingCallback,
 		pLoad : false	      // 로딩이미지 노출 여부  
 	};

	$(".result").html(loading);
	
 	transaction(param);	
}

function selectTrackingCallback(svcId, data, errCd, msgTp, msgCd, msgText) {
	
	var obj = data.ds_trkg;
	var len = getSize(obj);
	var str = "";
	
	if(len < 1) {
		
		str = noData;
	}
	
	else {
		
		str = "";
		
		for(var i = 0 ; i < len ; i++) {
			
			var vhclNo  = obj[i].VHCL_NO;
			var mnfNo   = obj[i].MNF_NO;
			var corpId  = obj[i].CORP_ID;
			var shmptNo = obj[i].SHMPT_NO;
			var cntrlNo = obj[i].CNTRL_NO;
			var arr     = obj[i].evtArr;
			var drvCd   = obj[i].DRV_CD;
			var aLen    = getSize(arr);
			var strr    = "";
			
			str += "<table>";
			str += "<tr>";
			str += "<th rowspan='3'><div>" + cntrlNo + "<br/>(" + drvCd + " | " + vhclNo + ")</div></th>";
			str += "<td colspan='4' style='border-bottom:1px solid #bbb;text-align:left;padding-left:5px;'><b>소속거점</b> : " + corpId + ", <b>배차번호</b> : " + mnfNo + ", <b>운송장번호</b> : " + shmptNo + "</td>";
			str += "</tr>";
			str += "<tr>";
			
			for(var j = 0 ; j < aLen ; j++) {
				
				var img   = arr[j].img;
				var addr  = arr[j].ADDR;
				var pgiDt = arr[j].PGI_DT;
				var evtDt = arr[j].EVT_DT;
				var evtNm = arr[j].EVT_NM;
				var iTit  = evtNm + "\n예정시간 : " + pgiDt + "\n" + "보고시간 : " + evtDt;
				var imgs  = "<img src='" + CONST.CONTEXT_PATH + "/asset/images/sys/" + img + ".png' alt='" + evtNm + "' title='" + iTit + "'/>";
				var addrs = addr != null && addr != "" && addr.length > 6 ? addr.substring(0, 6) + "..." : addr;
				
				str += "<td align='center'>";
				str += imgs;						
				str += "</td>";
				
				strr += "<td><div title='" + addr + "'>" + addrs + "</div></td>";
			}
			
			str += "</tr>";
			str += "<tr>";
			str += strr;
			str += "</tr>";
			str += "</table>";
			str += "<br/>";
		}
	}
	
	$(".result").html(str);
}

function keyEvent() {
	
	if(event.keyCode == 13) {
		
		selectTracking();
	}
}