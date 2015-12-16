

/**
 * 실행거점 얻기
 */
function selectCorpInfo(svcId) {
	
	var param = {
	 		
		svcId  : svcId,
	 	strUrl : contextPath + "/mdm/selectCorpInfo.fo",
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
		
		if(svcId == "eqpMgmMain"     || svcId == "eqpMgmMainCls" || 
		   svcId == "favorRouteList" || svcId == "payInfoSendFailList" ||
		   svcId == "eqpMgmAddPopup") {
			
			if(admin == "Y") {
				
				str += "<option value=''>전체</option>";
			}
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
	
	if(svcId == "favorRouteList") {
		
		selectLspInfo();
	}
	
	else if(svcId == "favorRouteListPop") {
		
		setDefaultValue();
	}
	
	else if(svcId == "favorRouteAddUpdPopup") {
		
		setDefaultValue2();
	}
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