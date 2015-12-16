<%--############################################################################
# Filename    : searchAddr.jsp
# Description : 주소 조회
# Date        : 2014-07-23
# Update      : 
# Author      : LBC SOFT
################################################################################--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/common/header.jsp" %>

<style>
#mydiv table thead th  {
height:25px;
}
</style>

<script type="text/javascript">

//브라우져 리사이즈 할 때, jqGrid 의 자동 width 리사이징
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


//그리드 테이블 객체를 사용할 때 일일이 jQuery selector로 참조하지 않기 위해 페이지 전역변수를 선언하였음.
var _PARAM_OBJ;
var _PARAM_USER_FUNC;
var _GRID1;
var _SEARCH_ADDR = "${searchAddr}";
	
/**
 * 	DOMContentLoaded   
 */
$(function(){

	$("#searchAddr").val(_SEARCH_ADDR).focus();
	
	initGrid();	 //그리드 초기화
	_PARAM_OBJ = JSON.parse('${param.po}');
	_PARAM_USER_FUNC = '${param.userFunc}';	
	initEvent();
	
	/* 
	// 결과가 하나일 때 오프너의 상차지 자동완성
	if ( _GRID1.find("tbody").find("tr[class!='jqgfirstrow']").length == 1) {
		doubleClickRow(_GRID1.getRowData(_GRID1.find("tbody").find("tr[class!='jqgfirstrow']").eq(0).attr("id")));
	}
	 */
	
}); 




/**
 * 	1-1. 그리드를 생성/초기화 하는 함수 
 */	
function initGrid() {
	_GRID1 = $("#grid1");
	
	//그리드 옵션 (사용자정의)
	var options = {
	    url: _CONTEXT_PATH+"/searchAddrList"
	    ,datatype: 'json'
	    ,postData : {searchAddr: $("#searchAddr").val() }
	    ,jsonReader : {
	        root:'rows'
	        ,page:'page'
	        ,total:'total'
	        ,records:'records'
	    } 
	    ,colNames:[
			''
			, '주소'
			/* 히든 */
			, 'HDONG_NM'
			, 'HDONG_CD'
		]
		,colModel :[ 	      
			{name:'USE_YN',				index:'USE_YN',		width:'20',     editable:true,  align:'center', sortable:false, edittype:'checkbox', editoptions:{value:'1:0'}, formatter:'checkbox', formatoptions:{disabled:false} }	    
			,{name:'FULL_DONG_NM',	index:'FULL_DONG_NM',    width:'300',    editable:false, align:'left', sortable:false, classes:"colLeft"}
			,{name:'HDONG_NM',		index:'HDONG_NM',    width:'0',    editable:false,	align:'center', sortable:false ,hidden:true}
			,{name:'HDONG_CD',		index:'HDONG_CD',    width:'0',    editable:false,	align:'center', sortable:false ,hidden:true}
		]

	    , ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }
   
	    , multiselect: false	// 멀티 셀렉트 박스가 첫번째 컬럼에 생김
        //, rownumbers : true // 맨 앞줄에 row 번호 부여. 
		//, rownumWidth : 20 // rownumbers size 지정 
	    , rowNum:30
	    , shrinkToFit: false
		, scrollOffset:0
	    , idPrefix:'grid1_'	    

	    , width: 99.8*_GRID1.getWidthByPercent(100)/100
	    , height: _GRID1.getHeightByPercent(100) - 49	// ie7 는 랜더링이 틀려서 1px 더 줄임
	    , autowidth: false	// 오토 조절 가능 (width 옵션과 동시 사용 불가!)  
	    , viewrecords: true

	    , pager: '#pager1'
	    , emptyrecords : "데이터가 없습니다."

	    , cellEdit : false
	    , cellsubmit  : 'clientArray'		// can have two values: 'remote' or 'clientArray'.
	    
		,ondblClickRow: function (rowid,iRow,iCol,e) {		 
                var data = _GRID1.getRowData(rowid);
                doubleClickRow(data);
        }
        ,loadComplete: function () {
		    var $this = $(this);
		    var ids = $this.jqGrid('getDataIDs');
		    var  l = ids.length;
	    	for (var i = 0; i <  l; i++) {	
		     	 $this.setRowData(ids[i], false, {height: 25});
		    }
		} 
	};
	

	//그리드 생성 
	_GRID1.jqGrid(options);

}

/**
 * 	1-2. 조회버튼  처리 함수 (그리드 데이터 조회)
 */
function searchBtnOnClick() {
	var parameter = {
		searchAddr : $("#searchAddr").val()
	};
	_GRID1.setGridParam({postData : parameter}).trigger("reloadGrid");
}


/**
 * 1-4.Grid Row 더블 클릭 함수
 */
function doubleClickRow(rowData) {
	setOpenerParams(rowData);

	setTimeout(function() {
		if (_PARAM_USER_FUNC != null && _PARAM_USER_FUNC != "") {
			$(opener.location).attr("href","javascript:" + _PARAM_USER_FUNC + "({id:'"+ rowData.HDONG_CD + "', nm:'"+ rowData.HDONG_NM + "'});");
		}
		window.close();
	}, 50);

	return true;
}

/**
 * 	1-5.선택버튼 함수
 */
function selectBtnOnClick() {
	var rowIds = _GRID1.jqGrid('getDataIDs');

	var chk = false;
	var rowData;
	for ( var i = 0; i < rowIds.length; i++) {
		rowData = _GRID1.getRowData(rowIds[i]);
		if (rowData.USE_YN == '1') {
			setOpenerParams(rowData);
			chk = true;
		}
	}

	//선택된 값이 없을때 opner 파라미터 초기화
	if (!chk) {
		if (_PARAM_OBJ.returnArr != 'undefined' && _PARAM_OBJ.returnArr != null) {
			for ( var i = 0; i < _PARAM_OBJ.returnArr.length; i++) {
				var returnArrObj = _PARAM_OBJ.returnArr[i];
				var elemId = returnArrObj['elemId'];
				$("#" + elemId, opener.document).val("");
			}
		}
	}

	if (!chk) {
		setTimeout(function() {
			if (_PARAM_USER_FUNC != null && _PARAM_USER_FUNC != "") {
				$(opener.location).attr("href","javascript:" + _PARAM_USER_FUNC + "();");
			}
			window.close();
		}, 50);
	} else {
		setTimeout(function() {
			if (_PARAM_USER_FUNC != null && _PARAM_USER_FUNC != "") {
				for (i = 0; i < rowIds.length; i++) {
					rowData = _GRID1.getRowData(rowIds[i]);
					if (rowData.USE_YN == '1') {
						$(opener.location).attr("href","javascript:" + _PARAM_USER_FUNC + "({id:'"+ rowData.HDONG_CD + "', nm:'"+ rowData.HDONG_NM + "'});");
					}
				}
			}
			window.close();
		}, 50);
	}

}

/**
 * 1-6.팝업창의 선택 내용을 OPENER 창의 입력필드에 값 전달
 */
function setOpenerParams(rowData) {
	if (_PARAM_OBJ.returnArr != 'undefined' && _PARAM_OBJ.returnArr != null) {
		for ( var i = 0; i < _PARAM_OBJ.returnArr.length; i++) {
			var returnArrObj = _PARAM_OBJ.returnArr[i];
			var elemId = returnArrObj['elemId'];
			var val = rowData[returnArrObj['popGridElemNM']];
			$("#" + elemId, opener.document).val(val);
		}
	}
}

/**
 * 1-7.SEARCH INPUT KeyDown 이벤트 및 F2 찾기 이벤트 추가
 */
function initEvent() {

	$("#searchAddr").bind(	"keydown",
			function(event) {
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


/**
 * 1-8.F2 찾기 이벤트 함수
 */
function eventKeydown() {
	if (event.keyCode == 113) {
		searchBtnOnClick();
	}
}

</script>
</head>

<body>
<form name="frm">
<div id="popup">
	<!-- 주소조회 -->
	<h1>주소조회</h1>

	<div class="wrap">
		<!-- search -->
		<div class="searchBox">
			<!-- btn -->
			<div class="blueBtn">			
			    <a href="#" onClick="javascript:selectBtnOnClick();" ><img src="/tms/asset/images/sys/btn_blue_check.png" alt="선택" title="선택"/></a>
				<a href="#" onClick="javascript:searchBtnOnClick();" ><img src="/tms/asset/images/sys/btn_blue_search.png" alt="조회" title="조회"/></a>
			</div>
			<!-- //btn -->			
			<label>고객명</label>
			<input type="text" id="searchAddr" class="input" style="width:100px;ime-mode:active;" maxlength="20" style="ime-mode:active" />
			</div>
		<!-- //search -->

		<div class="group">
			<div class="section">
				<div id="mydiv" style="height:400px; background:#eee;">
				<!-- 그리드 엘리먼트 -->
					<table id="grid1"></table> 
					<div id="pager1"></div> 
				</div>
			</div>
		</div>
	</div>
	<!-- //고객사조회 -->

	<a href="#" class="closeBtn" onclick="javascript:selectBtnOnClick();"><img src="/tms/asset/images/sys/btn_popup_close.png" alt="닫기" title="닫기"/></a>
</div>
</form>
</body>
</html>