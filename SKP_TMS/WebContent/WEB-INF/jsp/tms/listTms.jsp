<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
<title>SKT TMS솔루션</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/jquery/plugins/jqGrid/ui.jqgrid.css" media="screen"/>
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/jquery/plugins/jquery-ui/themes/smoothness/jquery-ui.css" media="screen"/>
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/layout.css" media="screen"/>

<script type="text/javascript" src="/tms/asset/js/sys/common/json2.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/jquery.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.cookie.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.alphanumeric.pack.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.blockUI.js"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.ba-throttle-debounce.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery-ui/jquery-ui-custom.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/common/frameone-common-kfr.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/kio-common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/tms-common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/kcu-common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/kcc-common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/common.js" charset="utf-8"></script>


<%--############################################################################
# Filename    : listTms.jsp
# Description : 배차관리 
# Date        : 2013-06-17
# Update      : 
# Author      : sykang
################################################################################--%>
<style type="text/css">
.ui-jqgrid tr.jqgrow td {vertical-align:middle !important}
</style>
<script type="text/javascript">
var $grid1;

/**
 * 	DOMContentLoaded   
 */
$(function(){
	$("#<%=request.getParameter("tab_id")%>", parent.document).height($(document).height());
	
	alert("11");
	initGrid();	 //그리드 초기화
	alert("22");
	initCal();
	initEvent();
}); 

$(document).ready(function() {
	//$(".ifrm", parent.document).height($(document).height());

	$('a.more').click(function(){
		$(".moreBtn").toggle();
		return false;
	});
});


/**
 * 	1-2. 그리드를 생성/초기화 하는 함수 
 */	
function initGrid()
{
	$grid1 = $("#grid1");

	//그리드 옵션 (사용자정의)
	var options = {
	    url:'/tms/listTmsData',						//그리드 조회 url
	    dataset: 'ds_node',                  		//DataSet명 
	    idPrefix:'grid1_',	                    	//grid 데이터가 출력되거나 row가 삽입될 때 각 row(tr엘리먼트)는 "idPrefix + 화면내 row 순번" 형태의 엘리먼트 id를 갖게 된다.	
	    width:$grid1.getWidthByPercent(100),    	//jQuery객체.getWidthByPercent(퍼센트값) 을 호출하여 부모객체에 대한 상대적인 너비를 얻을 수 있다.
	    height:'516',								//그리드 높이(픽셀)
	    colNames:[
	    	'ROWCNT',
   			'배차상태',
   			'고객',
   			'상차지',
   			'하차지',
   			'품목',
   			'요율구분',
   			'수송량',
   			'중량(톤)',
   			'청구금액',
   			'관리번호',
   			'차량번호',
   			'배차번호',
			'차량톤급',
   			'차량종류',
   			'상차요청일시',
   			'하차요청일시',
  			'주문번호',
   			'주문일시',
   			'운송거리',
   			'물량갯수',
   			'요청사항'
		],	//화면에 출력되는 그리드 칼럼명
		colModel :[	//그리드 칼럼 정의 (name:데이터맵핑용 이름, index:정렬기준칼럼 파라미터 전송시 사용, sortable:칼럼헤더에 정렬기능을 넣을 것인지 여부) 	      
	    	//본 템플릿에서는 체크박스의 체크상태를 저장/조회하지는 않고, 용법만을 제시한다.
	      	{name:'ROWCNT', 			index:'ROWCNT',   			width:0, 	editable:false, align:'center', sortable:false, hidden:true},
	      	{name:'SCD_NM', 			index:'SCD_NM', 			width:100, 	editable:false, align:'center', sortable:false},
	      	{name:'SHPR_NM', 			index:'SHPR_NM', 			width:100, 	editable:false, align:'center',	sortable:false}, 
	      	{name:'DEP_ADDR', 			index:'DEP_ADDR', 			width:200, 	editable:false, align:'left', 	sortable:false},
	      	{name:'ARR_ADDR', 			index:'ARR_ADDR', 			width:200, 	editable:false, align:'left', 	sortable:false},
	      	{name:'ITEM_NM', 			index:'ITEM_NM', 			width:80, 	editable:false, align:'center', sortable:false},
	      	{name:'RATE_CLS_NM', 		index:'RATE_CLS_NM', 		width:80, 	editable:false, align:'center', sortable:false},
	      	{name:'TOT_QTY', 			index:'TOT_QTY', 			width:50, 	editable:false, align:'right', 	sortable:false},
	      	{name:'TOT_TON', 			index:'TOT_TON', 			width:50, 	editable:false, align:'right', 	sortable:false},
	      	{name:'TOT_AMT', 			index:'TOT_AMT',   			width:100, 	editable:false, align:'right', 	sortable:false},
	      	{name:'CNTRL_NO', 			index:'CNTRL_NO',   		width:60, 	editable:true,  align:'center', sortable:false},
	      	{name:'VHCL_NO', 			index:'VHCL_NO',   			width:100, 	editable:true,  align:'center', sortable:false},
	      	{name:'MNF_NO', 			index:'MNF_NO',   			width:70, 	editable:false, align:'center', sortable:false},
	      	{name:'VHCL_TON_NM', 		index:'VHCL_TON_NM', 		width:50, 	editable:false, align:'center', sortable:false},
	      	{name:'VHCL_KND_NM', 		index:'VHCL_KND_NM', 		width:60, 	editable:false, align:'center', sortable:false},
		  	{name:'DEP_REQ_DATETIME',   index:'DEP_REQ_DATETIME', 	width:100, 	editable:false, align:'center', sortable:false},
	      	{name:'ARR_REQ_DATETIME',   index:'ARR_REQ_DATETIME',  	width:90, 	editable:false, align:'center', sortable:false},
	      	{name:'EO_ID', 				index:'EO_ID',   			width:90, 	editable:false, align:'center', sortable:false},
	      	{name:'INS_DATETIME',   	index:'INS_DATETIME',  		width:90, 	editable:false, align:'center', sortable:false},
	      	{name:'TOT_TRNS_DISTANCE', 	index:'TOT_TRNS_DISTANCE', 	width:60, 	editable:true,  align:'right', 	sortable:false},
	      	{name:'ITEM_CNT', 			index:'ITEM_CNT', 			width:60, 	editable:true,  align:'right', 	sortable:false},
	      	{name:'REMK', 				index:'REMK', 				width:60, 	editable:true,  align:'left', 	sortable:false}
	    ],
	    rownumbers : true,
	    shrinkToFit: false,
		rowNum:30,
		scrollOffset:0,
		multiselect: true,
	    pager: '#grid1_pager',	//페이징엘리먼트의 jQuery selector
	    footerrow : true,
	    viewrecords:true,
	    customOndblClickRow : function(rowid, iRow, iCol, e){ 
	    },
	    customBeforeSelectRow : function(rowid, e){
	    },
	    customOnSelectCell : function(rowid, celname, value, iRow, iCol){
	    },	
	    customOnCellSelect : function(rowid, iCol, cellcontent, e){
	    },
	    customBeforeEditCell : function(rowid, cellname, value, iRow, iCol) {	    	
	    },
	    customAfterEditCell : function(rowid, cellname, value, iRow, iCol) {
	    },
	    customAfterSaveCell : function(rowid, cellname, value, iRow, iCol) {
	    },
	    customOnSelectRow : function(rowid, status) {	    	
	    },
	    customLoadComplete : function(data){ 
		},
		resizeFactor:{
	    	isResizableX:true,
	    	isResizableY:false
	    } 
	};

	alert("555")
	//그리드 생성 
	$grid1.jqGrid(options);
	alert("66");
    $grid1.jqGrid('clearGridData');
    alert("77");

}

/**
 * 	1-3. 조회버튼  처리 함수 (그리드 데이터 조회)
 */
function searchBtnOnClick(){
	alert("1");
	
	var options = {
 		svcId : "search", 	    //서비스ID - 사용자정의 콜백을 여러 함수가 공유할 때 분기 플래그로서 사용.
 		param :  {
 					DO_COUNTTOT:"true",
 					TMS_SCD:$("#tms_scd").val()
 				 }, //전송할 파라미터
 		pCall :  tranCallBack   //콜백 함수
 	};
 	$grid1.jqGrid("retrieve", options);

 	alert("1");
 	
 	return true;
}


/**
 * 	1-4.CallBack 함수  : Transaction 후 처리 해야 할 내용
 */
function tranCallBack(svcId, data, errCd, msgTp, msgCd, msgText){
	
	 if(svcId == "search") {
		 alert("2");
	 }
}

/**
 * 	1-4.달력초기화
 */
function initCal(){
	$(".ui-datepicker-trigger").addClass("inputBtn");
	$( ".inputBtn" ).css( "cursor", "pointer" );
}


/**
* 1-9.SEARCH INPUT KeyDown 이벤트 및 F2 찾기 이벤트 추가
*/
function initEvent(){
	document.onkeydown = eventKeydown;
}

/**
* 1-10.F2 찾기 이벤트 함수
*/
function eventKeydown() {
	if(event.keyCode== 113){
		 searchBtnOnClick();
	}
}

function mouseOutOver(obj){
	if(obj == 'Y'){
		$('#moreBtn').hide();	
	}else{
		$('#moreBtn').show();
	}
}

</script>

<form name="tmsForm" id=tmsForm method="post">
<h3>배차관리</h3>
<!-- search -->
<div class="searchBox">
	<div class="blueBtn">
		<a href="#" onclick="searchBtnOnClick();"><img src="/tms/asset/images/sys/btn_blue_search.png" title="조회" /></a>
		<a href="#" onclick="saveButtonOnClick();"><img src="/tms/asset/images/sys/btn_blue_save.png" title="매입매출거리저장" /></a>
	</div>
	<label>상차일자</label>
	<input type="text" class="input calendar" maxlength="8" onblur="kioAfterDateChange(this); return false;" onclick="kioBeforeDateChange(this); return false;" name="depStartDate" id="depStartDate" style="width:90px;" value=""/>
	~
	<input type="text" class="input calendar"  maxlength="8" onblur="kioAfterDateChange(this); return false;" onclick="kioBeforeDateChange(this); return false;" name="depEndDate" id="depEndDate" style="width:90px;" value=""/>
	<label>배차선택</label>
	<select id="tms_scd" name="tms_scd" class="select" required="false">
		<option value="1">전체</option>
		<option value="2">배차확정</option>
	</select>
	<label>배차상태</label>
	<select id="mnf_scd" name="tms_scd" class="select" required="false">
		<option value="1">전체</option>
		<option value="2">배차확정</option>
	</select>
</div>
<div class="group">
	<div class="section">
		<div class="btnG">
			<a href="#" onClick="tmsPlan();" class="grayBtn"><span>배차계획확정</span></a>
			<a href="#" onClick="tmsDecision();" class="grayBtn"><span>배차확정</span></a>
			<a href="#" onClick="tmsResultConfirm();" class="grayBtn"><span>운송실적확정</span></a>
			<a href="#" class="grayBtn more" onmouseout="javascript:mouseOutOver('Y');"><span>추가기능</span></a>
			<div class="moreBtn" id="moreBtn" style="display:none;z-index:1000" onmouseout="javascript:mouseOutOver('Y');" onmouseover="javascript:mouseOutOver('N');">
				<a href="#" onClick="tmsMixed();">혼적처리</a>
				<a href="#" onClick="tmsPlanCancel();">배차계획확정취소</a>
				<a href="#" onClick="tmsDecisionCancel();">배차확정취소</a>
				<a href="#" onClick="tmsResultCancel();">운송실적확정취소</a>
			</div>
		</div>
		<div style="height:590px; width:99.8%; background:#eee;"> 
			<table id="grid1"></table> 
			<div id="grid1_pager"></div>
		</div>
	</div>
</div>
</form>


<script type="text/javascript">
	var msgCode = "${SVC_MSG_CD}";
	var msg = "${SVC_MSG_TEXT}";

	if(msgCode !="") {
		alert(msg);
	}
	
	$(function(){ 
		viewResizeEvent("wrapper", false);
	});
	
</script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jqGrid/jquery.jqGrid.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jqGrid/i18n/grid.locale-kr.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/common/frameone.jquery.jqGrid.kfr.js" charset="utf-8"></script>
