<%--############################################################################
# Filename    : listVehiclePopup.jsp
# Description : 차량팝업
# Date        : 2014. 07. 17.
# Update      : 
# Author      : LBC SOFT
################################################################################--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/header.jsp" %>

<script type="text/javascript">


$(function(){
	
	initSearch();
	
	initGrid();	 //그리드 초기화
	initEvent();
	
	document.getElementById("vhclNo").focus();
});


<%-- #################################################################
browser event zone
################################################################# --%>	

// 브라우져 리사이즈 할 때, jqGrid 의 자동 width 리사이징
$(window).bind('resize', function() {
	// 그리드 다수
	var arrGrid = {};
	if (arrGrid = $('.ui-jqgrid-btable:visible')) {
		arrGrid.each(function(index) {
			var gridId = $(this).attr('id');
			var gridParentWidth = $('#gbox_' + gridId).parent().width();
			$('#' + gridId).setGridWidth(gridParentWidth ,false);
		});
	}
}).trigger('resize');


function initSearch()
{
	var searchVhclNo = "${SEARCH_VHCL_NO}";
	if(searchVhclNo != '') {
		$("#vhclNo").val(searchVhclNo);
	}
}



function initGrid() {
	$grid1 = $("#grid1");
	
	//그리드 옵션 (사용자정의)
	var options = {
	    url:'/tms/getTmsVhclNoListData',						//그리드 조회 url
	    datatype: 'json',
	    postData : {VHCL_NO:$("#vhclNo").val()},
	    jsonReader : {
	        root:'rows'
	        ,page:'page'
	        ,total:'total'
	        ,records:'records'
	    }, 
	    idPrefix:'grid1_',	                    		//grid 데이터가 출력되거나 row가 삽입될 때 각 row(tr엘리먼트)는 "idPrefix + 화면내 row 순번" 형태의 엘리먼트 id를 갖게 된다.	
	    width:100 * $grid1.parent().width() / 100,    	//jQuery객체.getWidthByPercent(퍼센트값) 을 호출하여 부모객체에 대한 상대적인 너비를 얻을 수 있다.
	    height: '450',		//그리드 높이(픽셀)
	    colNames:[
	            '',
				'거리(km)',
				'관리번호',
				'차량번호',
				'차량종류',
				'톤급',
				'운전원',
				'기착상태',
				'가용예정일시',
				'착지',
				'차량최종위치',
				'모바일번호',
				'금액(월)',
				'금액(일)',
				'배차건수(월)',
				'배차건수(일)',
				'VHCL_KND_CD',
				'VHCL_TON_CD',
				'POINT'
		],	//화면에 출력되는 그리드 칼럼명
		colModel :[	//그리드 칼럼 정의 (name:데이터맵핑용 이름, index:정렬기준칼럼 파라미터 전송시 사용, sortable:칼럼헤더에 정렬기능을 넣을 것인지 여부) 	      
	    	//본 템플릿에서는 체크박스의 체크상태를 저장/조회하지는 않고, 용법만을 제시한다.
	    	{name:'USE_YN',				index:'USE_YN',             width:'20', editable:true,  align:'center', sortable:false, edittype:'checkbox', editoptions:{value:'1:0'}, formatter:'checkbox', formatoptions:{disabled:false} },
	      	{name:'DISTANCE',   		index:'DISTANCE',  			width:60, 	editable:false, align:'center', sortable:false, formatter: function(cellValue, options, rowObject){
				if(cellValue != 999){
					//return cellValue.toFixed(2);
					return '';
				} else{
					return '';
				}
			}},
	      	{name:'CNTRL_NO',   		index:'CNTRL_NO',  			width:80, 	editable:false, align:'center', sortable:false},
		  	{name:'EQP_NO',   			index:'EQP_NO', 			width:90, 	editable:false, align:'center', sortable:true},		  	
	      	{name:'VHCL_KND_NM', 		index:'VHCL_KND_NM',   		width:60, 	editable:false, align:'center', sortable:false}, 
	      	{name:'VHCL_TON_NM', 		index:'VHCL_TON_NM',   		width:40, 	editable:false, align:'center', sortable:false},
	      	{name:'DRIVER_NM', 			index:'DRIVER_NM',   		width:60, 	editable:false, align:'center', sortable:false},
	      	{name:'TRKG_EVT_TCD_NM',	index:'TRKG_EVT_TCD_NM',   	width:80, 	editable:false, align:'center', sortable:false},
	      	{name:'REQ_VHCL_KND_NM',	index:'REQ_VHCL_KND_NM',   	width:80, 	editable:false, align:'center', sortable:false},
	      	{name:'TRKG_NODE_NM', 		index:'TRKG_NODE_NM',   	width:80, 	editable:false, align:'right', 	sortable:false},
	      	{name:'LAST_REGION', 		index:'LAST_REGION',   		width:150, 	editable:false, align:'right', 	sortable:false},
	      	{name:'DRIVER_TEL_NO', 		index:'DRIVER_TEL_NO',   	width:100, 	editable:false, align:'center', sortable:false},
	      	{name:'MONTH_AMT', 			index:'MONTH_AMT',   		width:80, 	editable:false, align:'right', 	sortable:false, formatter:'currency',formatoptions:{decimalPlaces: 0}},
	      	{name:'DAY_AMT', 			index:'DAY_AMT',   			width:80, 	editable:true, 	align:'right', 	sortable:false, formatter:'currency',formatoptions:{decimalPlaces: 0}},
	      	{name:'MONTH_DSPH_COUNT', 	index:'MONTH_DSPH_COUNT',   width:80, 	editable:false, align:'right', 	sortable:false},
	      	{name:'DAY_DSPH_COUNT', 	index:'DAY_DSPH_COUNT',   	width:80, 	editable:false, align:'right', 	sortable:false},
	      	{name:'VHCL_KND_CD', 		index:'VHCL_KND_CD',   		width:40, 	editable:false, align:'center', hidden:true},
	      	{name:'VHCL_TON_CD', 		index:'VHCL_TON_CD',   		width:40, 	editable:false, align:'center', hidden:true},
	      	{name:'POINT', 				index:'POINT',   			width:40, 	editable:false, align:'center', hidden:true}
	    ],
	    shrinkToFit: false,
		rowNum:50,
		scrollOffset:0,
		pager: '#grid1_pager',	//페이징엘리먼트의 jQuery selector
	    footerrow : true,
	    viewrecords:true,
	    ondblClickRow : function(rowid, iRow, iCol, e){
	    	var rowData  = $grid1.jqGrid('getRowData', rowid); //조회결과
	    	dsphAssign(rowData);
	    	
	    },
	    onBeforeSelectRow : function(rowid, e){
	    	$("#grid1 input[type=checkbox]").prop('checked',false);	
			$("#"+rowid+" input[type=checkbox]").prop('checked',true);			
		    return(true);
	    },
	    onSelectCell : function(rowid, celname, value, iRow, iCol){
	    },
	    loadComplete : function(data){ 
	    	var rows = $grid1.jqGrid('getRowData');
	    	var totalMonthAmt=0, totalDayAmt = 0, totalMonthDsphCount = 0, totalDayDsphCount = 0;

	    	
	    	if(rows.length > 0){
	    		
	    		log(rows.length);
	    		
	    		
	    		for(var i=0;i<rows.length;i++){
	    			log(rows[i].MONTH_AMT);
	    			
	    			totalMonthAmt += Number(rows[i].MONTH_AMT);
	    			totalDayAmt += Number(rows[i].DAY_AMT); 
	    			totalMonthDsphCount += Number(rows[i].MONTH_DSPH_COUNT);
					totalDayDsphCount += Number(rows[i].DAY_DSPH_COUNT);
	    		}				
	    	}
	    	$grid1.jqGrid('footerData', 'set', {DRIVER_TEL_NO:'합  계',MONTH_AMT:totalMonthAmt, DAY_AMT:totalDayAmt, MONTH_DSPH_COUNT:totalMonthDsphCount,  DAY_DSPH_COUNT: totalDayDsphCount});
		}
	};

	//그리드 생성 
	$grid1.jqGrid(options);

}

function searchBtnOnClick() {
	
	var tmpOrderBy = document.getElementsByName("orderBy");
	var orderBy;

	for(var i=0; i<tmpOrderBy.length; i++){
		if(tmpOrderBy[i].checked) {
			orderBy = tmpOrderBy[i].value;
			break;
		}
	}
	
	var parameter = {
			VHCL_KND_CD : $("select[name=vhclKndCd]").val()
		,	VHCL_TON_CD : $("select[name=vhclTonCd]").val()
		,	CNTRL_NO : $("#cntrlNo").val()
		,	VHCL_NO : $("#vhclNo").val()
		,	ORDER_BY : orderBy
	};
	
	$grid1.setGridParam({postData:parameter}).trigger("reloadGrid");
}

function dsphAssign(rowData) {

	$grid = $("#grid1", opener.document);
	var openerSelectRow = $grid.jqGrid('getGridParam', 'selrow');
	//opener.vhclData(rowData, openerSelectRow, $('#flag').val());
	opener.vhclData(rowData, openerSelectRow, 'popup');
	
	window.close();
	return true;
}


function selectBtnOnClick() {
 	var rowIds = $("#grid1").jqGrid('getDataIDs');
 	var check = 0;
 	var tempRowData;
 	
 	for (var i = 0; i < rowIds.length; i++) {//iterate over each row
        rowData = $("#grid1").getRowData(rowIds[i]);	
        if (rowData.USE_YN == '1') {
        	check++;
    		tempRowData = rowData;
       	}
    }   
    
    if(check == 0) {
    	alert("체크된 항목이 없습니다. 최소한 1건 이상 체크되어야 합니다.");	
		return;
    } else if(check >= 2) {
    	alert("1건만  체크되어야 합니다.");
		return;
    } else if(check == 1) {

		$grid = $("#grid1", opener.document);
		var openerSelectRow = $grid.jqGrid('getGridParam', 'selrow');
		var openerRowData = $grid.jqGrid('getRowData', openerSelectRow);
		
		//opener.vhclData(tempRowData, openerSelectRow, $('#flag').val());
		opener.vhclData(tempRowData, openerSelectRow, 'popup');
    }
    
 	window.close();
}


function tranCallBack(svcId, data, errCd, msgTp, msgCd, msgText){
	
	//결과가 성공일 경우
	if(errCd != ERR_CD_SUCCESS){ 
		return;
	}
	
	if(svcId == "search") {
		
	} else if(svcId=="save") {
		alert("처리되었습니다.");
		searchBtnOnClick();	//재조회
	}
}

function eventKeydown() {
	if(event.keyCode == 113) {
		searchBtnOnClick();
	}
}

function initEvent() {
	
	$("#cntrlNo").bind("keydown", function(event) {
		  var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
		  if (keycode == 13) {
		    searchBtnOnClick();
		    return false;
		  } else {
		    return true;
		  }
		});
		
	$("#vhclNo").bind("keydown", function(event) {
	  var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
	  if (keycode == 13) {
	    searchBtnOnClick();
	    return false;
	  } else {
	    return true;
	  }
	});
	
	document.onkeydown = eventKeydown;
}


</script>
<div id="popup">
<form name="tmsForm" id=tmsForm method="post">
	<!-- 차량조회 -->
	<h1>차량조회</h1>

	<div class="wrap">
		<!-- search -->
		<div class="searchBox">
			<!-- btn -->
			<div class="blueBtn">
				<a href="javascript:selectBtnOnClick();"><img src="/tms/asset/images/sys/btn_blue_check.png" alt="선택" title="선택"/></a>
				<a href="javascript:searchBtnOnClick();"><img src="/tms/asset/images/sys/btn_blue_search.png" alt="조회" title="조회"/></a>
			</div>
			<!-- //btn -->

			<label>차량종류</label>
			<select id="vhclKndCd" name="vhclKndCd" class="select">
				<option value=''>전체</option>
				<c:if test="${fn:length(carList) > 0}">
					<c:forEach items="${carList}" var="resultList" varStatus="sts">
						<option value="${resultList.CD}">${resultList.CD_NM}</option>
					</c:forEach>
				</c:if>			
			</select>
			<label>톤수</label>
			<select id="vhclTonCd" name="vhclTonCd" class="select">
				<option value=''>전체</option>
				<c:if test="${fn:length(carTon) > 0}">
					<c:forEach items="${carTon}" var="resultList" varStatus="sts">
						<option value="${resultList.CD}">${resultList.CD_NM}</option>
					</c:forEach>
				</c:if>
			</select>
			<label id="exeCorpLabel">관리번호</label>
			<input type="text" id="cntrlNo" name="cntrlNo" class="input" maxlength="7" style="ime-mode:inactive">
			<label id="exeCorpLabel">차량번호</label>
			<input type="text" id="vhclNo" name="vhclNo" class="input" maxlength="9" style="ime-mode:active">
			<br><br>
			<label>거리</label>
			<input type="radio" name="orderBy" value="DISTANCE" checked>
			<label>선호구간</label>
			<input type="radio" name="orderBy" value="PREFER">
			<label>실적</label>
			(금액<input type="radio" name="orderBy" value="RESULT">, 배차건수<input type="radio" name="orderBy" value="COUNT">)
			<label>평점</label>
			<input type="radio" name="orderBy" value="POINT">
		</div>
		<!-- //search -->

		<div class="group">
			<div class="section">
				<div style="height:500px; background:#eee;">
					<table id="grid1"></table> 
					<div id="grid1_pager"></div>
				</div>
			</div>
		</div>
	</div>
	<!-- //차량조회 -->

	<a href="#" class="closeBtn" onclick="window.close();"><img src="/tms/asset/images/sys/btn_popup_close.png" alt="닫기" title="닫기"/></a>
</form>		
</div>