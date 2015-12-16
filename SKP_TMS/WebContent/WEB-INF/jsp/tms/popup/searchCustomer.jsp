<%--############################################################################
# Filename    : searchCustomer.jsp
# Description : 고객사 조회
# Date        : 2014-07-22
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
var paramObj;
var paramUserFunc;
var $grid1;
	

/**
 * 	DOMContentLoaded   
 */
$(function(){
	initGrid();	 //그리드 초기화
	initDefaultSetting();
	paramObj = JSON.parse('${param.po}');
	paramUserFunc = '${param.userFunc}';	
	initEvent();
}); 


function initDefaultSetting() {
	document.getElementById("txtUserName").focus();
}


/**
 * 	1-1. 그리드를 생성/초기화 하는 함수 
 */	
function initGrid()
{
	$grid1 = $("#grid1");
	
	//그리드 옵션 (사용자정의)
	var options = {
	    url:'/tms/searchCustomerData',						//그리드 조회 url
	    datatype: 'json',
	    postData : {SHPR_NM:$("#txtUserName").val()},
	    jsonReader : {
	        root:'rows'
	        ,page:'page'
	        ,total:'total'
	        ,records:'records'
	    }, 
	    idPrefix:'grid1_',	 
	    width:$grid1.getWidthByPercent(100),    //jQuery객체.getWidthByPercent(퍼센트값) 을 호출하여 부모객체에 대한 상대적인 너비를 얻을 수 있다.
	    height: 349,		//그리드 높이(픽셀)
	    colNames:[
   			'',
   			'고객ID',
   			'고객명',
   			'전화번호',
   			'이메일주소',
   			'대표자명',
   			'주소'
		],	//화면에 출력되는 그리드 칼럼명
		colModel :[	//그리드 칼럼 정의 (name:데이터맵핑용 이름, index:정렬기준칼럼 파라미터 전송시 사용, sortable:칼럼헤더에 정렬기능을 넣을 것인지 여부) 	      
	    	//본 템플릿에서는 체크박스의 체크상태를 저장/조회하지는 않고, 용법만을 제시한다.
			{name:'USE_YN',				index:'USE_YN',		width:'20',     editable:true,  align:'center', sortable:false, edittype:'checkbox', editoptions:{value:'1:0'}, formatter:'checkbox', formatoptions:{disabled:false} },	    
	      	{name:'SHPR_ID',		    index:'SHPR_ID',    width:'100',    editable:false, align:'center', sortable:false},
	      	{name:'SHPR_NM',			index:'SHPR_NM',    width:'120',    editable:false,	align:'center', sortable:true},
	      	{name:'C_TEL',				index:'C_TEL',      width:'100',    editable:false, align:'center', sortable:false},
	      	{name:'C_EMAIL',            index:'C_EMAIL',    width:'150',    editable:false, align:'center', sortable:false},
	      	{name:'C_PRSNT_NM',		    index:'C_PRSNT_NM', width:'120',    editable:false, align:'center', sortable:false},
	      	{name:'C_ADDR',				index:'C_ADDR',     width:'310',	editable:false, align:'left',  	sortable:false} 
	    ],
	    rownumbers: false,
	    pager: '#grid1_pager',	//페이징엘리먼트의 jQuery selector
	    customOndblClickRow : function(rowid, iRow, iCol, e){ 
	    	//row double Click시 호출
	    },
	    customOnSelectCell : function(rowid, celname, value, iRow, iCol){ 
	    	//cell 클릭시 호출
	    },
	    customLoadComplete : function(data){ 
	    	//그리드  Data Loading 완료시 호출
		},
		resizeFactor:{
	    	isResizableX:true,
	    	isResizableY:false
	    } ,
	    beforeSelectRow: function(rowid, e)
		{
		    $("#grid1 input[type=checkbox]").prop('checked',false);	
			$("#"+rowid+" input[type=checkbox]").prop('checked',true);
		    return(true);
		},
		ondblClickRow: function (rowid,iRow,iCol,e) {		 
                var data = $('#grid1').getRowData(rowid);
                doubleClickRow(data);
        },  
        loadComplete: function () {
		    var $this = $(this);
		    var ids = $this.jqGrid('getDataIDs');
		    var  l = ids.length;

		    for (var i = 0; i <  l; i++) {	
		     	 $this.setRowData(ids[i], false, {height: 25});
		    }
		    
		}, 
		editable:false,
		viewrecords: true,
		sortname: 'invdate',		
        shrinkToFit:false
	    
	};
	

	//그리드 생성 
	$grid1.jqGrid(options);

}

/**
 * 	1-2. 조회버튼  처리 함수 (그리드 데이터 조회)
 */
function searchBtnOnClick() {
	var parameter = {SHPR_NM : $("#txtUserName").val()};
	$grid1.setGridParam({postData:parameter}).trigger("reloadGrid");
}


/**
 * 	1-3.CallBack 함수  : Transaction 후 처리 해야 할 내용
 */
function tranCallBack(svcId, data, errCd, msgTp, msgCd, msgText) 
{
	//결과가 성공일 경우
	if(errCd != ERR_CD_SUCCESS){ 
		return;
	}
	
	if(svcId == "search") {
		
	} else {
		;
	}
}


/**
* 1-4.Grid Row 더블 클릭 함수
*/

function doubleClickRow(rowData){
	setOpenerParams(rowData);
		
    setTimeout(function(){
  		if(paramUserFunc != null && paramUserFunc != "" ) {
	 		$(opener.location).attr("href", "javascript:"+paramUserFunc+"({id:'" + rowData.SHPR_ID+"', nm:'"+rowData.SHPR_NM+"'});");
 		}
	
		window.close();
	}, 0);
   
    return true;
}

/**
 * 	1-5.선택버튼 함수
 */
function selectBtnOnClick(){
	var rowIds = $("#grid1").jqGrid('getDataIDs');
    
    var chk = false;
    var rowData;
    for (i = 0; i < rowIds.length; i++) {
        rowData = $("#grid1").getRowData(rowIds[i]);
        
        if (rowData.USE_YN == '1') {
        	 setOpenerParams(rowData);
        	 chk = true;
        } 
    } 
    
    //선택된 값이 없을때 opner 파라미터 초기화
    if(!chk){
  	  if(paramObj.returnArr != 'undefined' && paramObj.returnArr != null){	 
	  	for(var i=0; i<paramObj.returnArr.length; i++){
			var returnArrObj = paramObj.returnArr[i];			
			var elemId = returnArrObj['elemId'];	
			$("#"+elemId,opener.document).val("");			
			}
		}
    }    
    
    if(!chk){
    	setTimeout(function(){
		 if(paramUserFunc != null && paramUserFunc != "" ) {
		 		$(opener.location).attr("href", "javascript:"+paramUserFunc+"();");
		 	}
		 	
		  window.close();   	
		}, 0);
    }else{
    	setTimeout(function(){
		 if(paramUserFunc != null && paramUserFunc != "" ) {
		 	for (i = 0; i < rowIds.length; i++) {
		        rowData = $("#grid1").getRowData(rowIds[i]);
		        
		        if (rowData.USE_YN == '1') {
		        	$(opener.location).attr("href", "javascript:"+paramUserFunc+"({id:'" + rowData.SHPR_ID+"', nm:'"+rowData.SHPR_NM+"'});");
		        } 
		    }
		 		
		 	}
		 	
		  window.close();   	
		}, 0);
    }
    
}

/**
* 1-6.팝업창의 선택 내용을 OPENER 창의 입력필드에 값 전달
*/
function setOpenerParams(rowData){
	if(paramObj.returnArr != 'undefined' && paramObj.returnArr != null){	 
		for(var i=0; i<paramObj.returnArr.length; i++){
			var returnArrObj = paramObj.returnArr[i];
			var elemId = returnArrObj['elemId'];
			var val = rowData[returnArrObj['popGridElemNM']];	
			$("#"+elemId,opener.document).val(val);			
		}
	}
}




/**
* 1-7.SEARCH INPUT KeyDown 이벤트 및 F2 찾기 이벤트 추가
*/
function initEvent(){

	$("#txtUserName").bind("keydown", function(event) {
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
	if(event.keyCode == 113){
		 searchBtnOnClick();
	}
}

</script>
</head>

<body>
<form name="frm">
<div id="popup">
	<!-- 고객사조회 -->
	<h1>고객사조회</h1>

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
			<input type="text" id="txtUserName" class="input" style="width:100px;ime-mode:active;" maxlength="20" style="ime-mode:active" />
			</div>
		<!-- //search -->

		<div class="group">
			<div class="section">
				<div id="mydiv" style="height:400px; background:#eee;">
				<!-- 그리드 엘리먼트 -->
					<table id="grid1"></table> 
					<div id="grid1_pager"></div> 
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