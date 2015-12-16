<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
	
    <script type="text/javascript">
    	<%-- #################################################################
    			전역 변수 zone
    	################################################################# --%>
    	var _GRID1 = {};
    	var _GRID2 = {};

    	<%-- #################################################################
				ready zone
		################################################################# --%>
		$(document).ready(function() {

			// 탭
			$("#<%=request.getParameter("tab_id")%>", parent.document).height($(document).height());
			
			// 그리드 
			_GRID1 = $("#grid1"); 
			_GRID2 = $("#grid2");
			
			// 그리드 옵션 세팅
			var gridOption1 = {
				    url: _CONTEXT_PATH+'/sample/jqGrid/getTmsOdToHdList'
				    ,datatype: "json"
				    ,jsonReader : {
				        root:"rows"
				        ,page:"page"
				        ,total:"total"
				        ,records:"records"
				    }
				    ,colNames : [ 
						'주문번호'
						,'고객ID'
						,'요율구분'
						,'총수량'
						,'총중량'
						,'총금액'
						,'운송예상거리'
						,'일'
						,'시'
						,'분'
						,'시도'
						,'구군'
						,'동리'
						,'우편번호'
						,'주소'
						,'상세주소'
						,'일'
						,'시'
						,'분'
						,'일'
						,'시'
						,'분'
				    ]
				    ,colModel:[
						{name:'EO_ID'						,index:'EO_ID'						,width:80	,editable: false,sortable:false,align:'center'
			            	/*
							,formatter: function () {
			                    return '<input  type="checkbox"  onclick="checkBox(event,this)" >';
			                }
						    , cellattr : function( rowId, val, rowObject, cm, rdata) {
								// ....
						    }
							*/
						}
						,{name:'SHPR_ID'					,index:'SHPR_ID'					,width:80	,editable: false,sortable:false,align:'center'}
						,{name:'RATE_CLS_CD'			,index:'RATE_CLS_CD'			,width:50	,editable: false,sortable:false,align:'center'}
						,{name:'TOT_QTY'					,index:'TOT_QTY'					,width:50	,editable: false,sortable:false,align:'center'	,formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}}
						,{name:'TOT_WT'					,index:'TOT_WT'					,width:50	,editable: false,sortable:false,align:'center'	,formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}}
						,{name:'TOT_AMT'				,index:'TOT_AMT'					,width:80	,editable: false,sortable:false,align:'center'	,formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}}
						,{name:'TOT_DISTANCE'			,index:'TOT_DISTANCE'			,width:80	,editable: true,sortable:false,align:'center'	,formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}}
						,{name:'INS_DATE'				,index:'INS_DATE'					,width:80	,editable: true,sortable:false,align:'center'	
							,formatter:function(cellValue, options, rowObject){
								cellValue = cellValue.replace(/-/g,'');
								var insYMD = cellValue.substr(0,4)+"-"+cellValue.substr(4,2)+"-"+cellValue.substr(6,2);
			                    return insYMD;
			                }	
							, editoptions:{	
								size:10
								, dataInit:function(el){ 
									setTimeout(function() {setDatePicker(el),100});
								} 
								, defaultValue: function(){ 
									return "<%=com.skp.tms.common.util.DateUtil.getDate("yyyy-MM-dd",1,0)%>";
								} 
							} 
						}
						,{name:'INS_HH'					,index:'INS_HH'					,width:40	,editable: true,sortable:false,align:'center'
							,edittype: 'select'
							,editoptions: {
								value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;"
								,dataInit: function(el) {$(el).width(38);}
							}  
						}
						,{name:'INS_MI'					,index:'INS_MI'						,width:40	,editable: true,sortable:false,align:'center'
							,edittype: 'select'
							,editoptions: {
								value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;24:24;25:25;26:26;27:27;28:28;29:29;30:30;31:31;32:32;33:33;34:34;35:35;36:36;37:37;38:38;39:39;40:40;41:41;42:42;43:43;44:44;45:45;46:46;47:47;48:48;49:49;50:50;51:51;52:52;53:53;54:54;55:55;56:56;57:57;58:58;59:59;60:60;"
								,dataInit: function(el) {$(el).width(38);
								}
							}	
						}
						,{name:'DEP_SIDO_NM'			,index:'DEP_SIDO_NM'			,width:50	,editable: false,sortable:false,align:'center'}
						,{name:'DEP_GUGUN_NM'		,index:'DEP_GUGUN_NM'		,width:50	,editable: false,sortable:false,align:'center'}
						,{name:'DEP_DONGRI_NM'		,index:'DEP_DONGRI_NM'		,width:50	,editable: false,sortable:false,align:'center'}
						,{name:'DEP_ZIP'					,index:'DEP_ZIP'					,width:80	,editable: false,sortable:false,align:'center',formatter:'currency'	,formatoptions:{thousandsSeparator:"-", decimalPlaces: 0}}
						,{name:'DEP_ADDR1'				,index:'DEP_ADDR1'				,width:150	,editable: false,sortable:false,align:'center'}
						,{name:'DEP_ADDR2'				,index:'DEP_ADDR2'				,width:200	,editable: false,sortable:false,align:'center'}
						,{name:'DEP_PGI_DATE'			,index:'DEP_PGI_DATE'			,width:80	,editable: false,sortable:false,align:'center'
							,formatter:function(cellValue, options, rowObject){
								cellValue = cellValue.replace(/-/g,'');
								var insYMD = cellValue.substr(0,4)+"-"+cellValue.substr(4,2)+"-"+cellValue.substr(6,2);
			                    return insYMD;
			                }	
							, editoptions:{	
								size:10
								, dataInit:function(el){ 
									setTimeout(function() {setDatePicker(el),100});
								} 
								, defaultValue: function(){ 
									return "<%=com.skp.tms.common.util.DateUtil.getDate("yyyy-MM-dd",1,0)%>";
								} 
							} 							
						}
						,{name:'DEP_PGI_HH'			,index:'DEP_PGI_HH'			,width:60	,editable: false,sortable:false,align:'center'
							,edittype: 'select'
								,editoptions: {
									value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;"
									,dataInit: function(el) {$(el).width(38);}
								}  			
						}
						,{name:'DEP_PGI_MI'			,index:'DEP_PGI_MI'			,width:60	,editable: false,sortable:false,align:'center'
							,edittype: 'select'
								,editoptions: {
									value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;24:24;25:25;26:26;27:27;28:28;29:29;30:30;31:31;32:32;33:33;34:34;35:35;36:36;37:37;38:38;39:39;40:40;41:41;42:42;43:43;44:44;45:45;46:46;47:47;48:48;49:49;50:50;51:51;52:52;53:53;54:54;55:55;56:56;57:57;58:58;59:59;60:60;"
									,dataInit: function(el) {$(el).width(38);
									}
								}							
						}
						,{name:'DEP_REQ_DATE'		,index:'DEP_REQ_DATE'			,width:80	,editable: false,sortable:false,align:'center'
							,formatter:function(cellValue, options, rowObject){
								cellValue = cellValue.replace(/-/g,'');
								var insYMD = cellValue.substr(0,4)+"-"+cellValue.substr(4,2)+"-"+cellValue.substr(6,2);
			                    return insYMD;
			                }	
							, editoptions:{	
								size:10
								, dataInit:function(el){ 
									setTimeout(function() {setDatePicker(el),100});
								} 
								, defaultValue: function(){ 
									return "<%=com.skp.tms.common.util.DateUtil.getDate("yyyy-MM-dd",1,0)%>";
								} 
							} 								
						}
						,{name:'DEP_REQ_HH'			,index:'DEP_REQ_HH'			,width:60	,editable: false,sortable:false,align:'center'
							,edittype: 'select'
								,editoptions: {
									value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;"
									,dataInit: function(el) {$(el).width(38);}
								}  							
						}
						,{name:'DEP_REQ_MI'			,index:'DEP_REQ_MI'			,width:60	,editable: false,sortable:false,align:'center'
							,edittype: 'select'
								,editoptions: {
									value: "00:00;01:01;02:02;03:03;04:04;05:05;06:06;07:07;08:08;09:09;10:10;11:11;12:12;13:13;14:14;15:15;16:16;17:17;18:18;19:19;20:20;21:21;22:22;23:23;24:24;25:25;26:26;27:27;28:28;29:29;30:30;31:31;32:32;33:33;34:34;35:35;36:36;37:37;38:38;39:39;40:40;41:41;42:42;43:43;44:44;45:45;46:46;47:47;48:48;49:49;50:50;51:51;52:52;53:53;54:54;55:55;56:56;57:57;58:58;59:59;60:60;"
									,dataInit: function(el) {$(el).width(38);
									}
								}														
						}
				    ]
		            ,ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }		// 다수 그리드는 동기(순차적)요청 해야한다.
		            
		            ,multiselect: true	// 멀티 셀렉트 박스가 첫번째 컬럼에 생김
				    ,rowNum:10
				    ,idPrefix:'grid1_'	    

				    ,width: _GRID1.getWidthByPercent(100)
				    ,height: _GRID1.getHeightByPercent(100) - 49	// ie7 는 랜더링이 틀려서 1px 더 줄임
				    ,autowidth: false	// 오토 조절 가능 (width 옵션과 동시 사용 불가!)  
				    ,viewrecords: true

				    ,pager: '#pager1'
				    ,emptyrecords : "데이터가 없습니다."

				    ,cellEdit : true
				    ,cellsubmit  : 'remote'		// can have two values: 'remote' or 'clientArray'. 
				    ,cellurl: _CONTEXT_PATH+'/sample/jqGrid/updateTmsOdToHdInfo'

				    ,onCellSelect: function(rowid, iCol, cellcontent, e) {  
				        log("onCellSelect : " + rowid+','+iCol+','+cellcontent+','+e);
				    }

				    ,beforeSubmitCell : function(rowid, cellname, value) {
				        log("beforeSubmitCell : " + rowid+','+ cellname+','+ value);

				     	// 테이블 PK 에 따라 세팅해야함
				        var pkName1 = "EO_ID";
				        var pkValue1 = "";
				        var list = "grid1";
				        var confirmMsg =cellname+"을(를) 수정하시겠습니까?";

				        // 다중 pk 라  key:true 속성을 줄 수 없을 때
			    	    var tdList = $("#"+list+">tbody>#"+rowid+">td");
			    	    var continueFlag = true;
			    	    
			    	 	// 1행이 checkbox 인지 체크(multiselect)
			    	    var index = 0;
			    	    if ( tdList[0].getAttribute("aria-describedby") == list+"_cb") {		
			    	    	index = 1;
			    	    }
			    	    
			    	    // 선택한 값 가져오기
			    	    for ( var i = index ; i < tdList.length && continueFlag==true; i++) {
			    	        var td = tdList[i];
			    	        var ariaAttr = td.getAttribute("aria-describedby");
			    	        // pk 체크
			    	        if ( ariaAttr == list+"_"+pkName1 ) {
			    	        	pkValue1 = td.innerText;		//idx = td.textContent;   ie 에서 안됨
			    	            continueFlag = false;
			    	        }
			    	    }

			    	    // 컨펌창 Y/N 선택 값 확인
			    	    var cellInfo = {}; 
			    	    var cancelYN = "N"; 
			    	    if ( confirm(confirmMsg) ) {
			    	        cancelYN = "Y"; 
			    	    } 
			    	    cellInfo = {id:rowid, pk1: pkValue1 ,cellName:cellname, cellValue:value,cancelYN:cancelYN};
			    	    //log(cellInfo);
    			        return cellInfo;
    			        
    			    }
				    ,afterSubmitCell : function(data) {
				        var result = $.parseJSON(data.responseText);
				        return [ result.successFlag , result.msg ];
				    }
				    ,beforeSaveCell: function(rowid,celname,value,iRow,iCol) {
				        //log('beforeSaveCell: '+rowid+','+celname+','+value+','+iRow+','+iCol);
				    }
				    ,afterSaveCell: function () {
				        $(this).trigger('reloadGrid');
				    }
			};

		    var gridOption2 = {
		    	    url: _CONTEXT_PATH+'/sample/jqGrid/getTmsOdToDtlList'
		    	    ,datatype: "json"
		    	    ,jsonReader : {
		    		    root:"rows"
		    		    ,page:"page"
		    		    ,total:"total"
		    		    ,records:"records"
		    	    }
		    	    ,colNames : [ 
						'운송주문번호'
						,'주문번호'
						,'운송계획번호'
						,'운송상태이름'
						,'품목ID'
						,'ITEM_NM'
						,'QTY'
						,'WT'
						,'AMT'
						,'EST_DISTANCE'
						,'ARR_SIDO_NM'
						,'ARR_GUGUN_NM'
						,'ARR_DONGRI_NM'
						,'ARR_ZIP'
						,'ARR_ADDR1'
						,'ARR_ADDR2'
						,'ARR_COORD_X'
						,'ARR_COORD_Y'
						,'ARR_DLVRY_DATE'
						,'ARR_DLVRY_TIME'
						,'ARR_REQ_DATE'
						,'ARR_REQ_TIME'
		    	    ]
		    	    ,colModel:[
						{name:'TOL_NO',index:'TOL_NO', width:80, editable: false,sortable:false,align:'center'}
						,{name:'EO_ID',index:'EO_ID', width:80, editable: false,sortable:false,align:'center'}
						,{name:'SHMPT_NO',index:'SHMPT_NO', width:80, editable: false,sortable:false,align:'center'}
						,{name:'TOL_SNM',index:'TOL_SNM', width:80, editable: false,sortable:false,align:'center'}
						,{name:'ITEM_ID',index:'ITEM_ID', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ITEM_NM',index:'ITEM_NM', width:55, editable: false,sortable:false,align:'center'}
						,{name:'QTY',index:'QTY', width:55, editable: true,sortable:false,align:'center'}
						,{name:'WT',index:'WT', width:55, editable: false,sortable:false,align:'center'}
						,{name:'AMT',index:'AMT', width:55, editable: false,sortable:false,align:'center'}
						,{name:'EST_DISTANCE',index:'EST_DISTANCE', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_SIDO_NM',index:'ARR_SIDO_NM', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_GUGUN_NM',index:'ARR_GUGUN_NM', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_DONGRI_NM',index:'ARR_DONGRI_NM', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_ZIP',index:'ARR_ZIP', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_ADDR1',index:'ARR_ADDR1', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_ADDR2',index:'ARR_ADDR2', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_COORD_X',index:'ARR_COORD_X', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_COORD_Y',index:'ARR_COORD_Y', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_DLVRY_DATE',index:'ARR_DLVRY_DATE', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_DLVRY_TIME',index:'ARR_DLVRY_TIME', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_REQ_DATE',index:'ARR_REQ_DATE', width:55, editable: false,sortable:false,align:'center'}
						,{name:'ARR_REQ_TIME',index:'ARR_REQ_TIME', width:55, editable: false,sortable:false,align:'center'}

		    	    ]
		    	    ,ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }		// 다수 그리드는 동기(순차적)요청 해야한다.
		    	    ,rowNum:10

		    	    ,width: _GRID2.getWidthByPercent(100)
		    	    ,height: _GRID2.getHeightByPercent(100) - 49	// ie7 는 랜더링이 틀려서 1px 더 줄임
		    	    ,autowidth: false	// true면 colModel width값 무시 
		    	    ,viewrecords: true

		    	    ,pager: '#pager2'
		    	    ,emptyrecords : "데이터가 없습니다."

		    	    ,cellEdit : true
		    	    ,cellsubmit  : 'remote'		// can have two values: 'remote' or 'clientArray'. 
		    	    ,cellurl: _CONTEXT_PATH+'/sample/jqGrid/updateTmsOdToDtlInfo'

		    	    ,onCellSelect: function(rowid, iCol, cellcontent, e) {  
		    	        log("onCellSelect : " + rowid+','+iCol+','+cellcontent+','+e);
		    	    }

		    	    ,beforeSubmitCell : function(rowid, cellname, value) {
		    	        log("beforeSubmitCell : " + rowid+','+ cellname+','+ value);
					
		    	        // 테이블 PK 에 따라 세팅해야함
		    	        var pkName1 = "TOL_NO";
		    	        var pkName2 = "EO_ID";
						var pkValue1 = "";
						var pkValue2 = "";
						var list = "grid2";
						var confirmMsg =cellname+"을(를) 수정하시겠습니까?";
						
						var tdList = $("#"+list+">tbody>#"+rowid+">td");
						var continueFlag = true;
						
						// 1행이 checkbox 인지 체크(multiselect)
						var index = 0;
						if ( tdList[0].getAttribute("aria-describedby") == list+"_cb") {		
						    index = 1;
						}
						
						// 선택한 값 가져오기
						for ( var i = index ; i < tdList.length && continueFlag==true; i++) {
						    var td = tdList[i];
						    var ariaAttr = td.getAttribute("aria-describedby");
						    // pk 체크
						    if ( ariaAttr == list+"_"+pkName1 ) {
						        pkValue1 = td.innerText;		//idx = td.textContent;   ie 에서 안됨
						        continueFlag = false;
						    }
						}
						
						continueFlag = true;
						for ( var i = index ; i < tdList.length && continueFlag==true; i++) {
						    var td = tdList[i];
						    var ariaAttr = td.getAttribute("aria-describedby");
						    // pk 체크
						    if ( ariaAttr == list+"_"+pkName2 ) {
						        pkValue2 = td.innerText;		//idx = td.textContent;   ie 에서 안됨
						        continueFlag = false;
						    }
						}
						
						
						// 컨펌창 Y/N 선택 값 확인
						var cellInfo = {}; 
						var cancelYN = "N"; 
						if ( confirm(confirmMsg) ) {
						    cancelYN = "Y"; 
						} 
						cellInfo = {id:rowid, pk1: pkValue1 ,pk2: pkValue2 ,cellName:cellname, cellValue:value,cancelYN:cancelYN};
						//log(cellInfo);
						return cellInfo;

		            }
		    	    ,afterSubmitCell : function(data) {
		    	        var result = $.parseJSON(data.responseText);
		    	        return [ result.successFlag , result.msg ];
		    	    }
		    	    ,beforeSaveCell: function(rowid,celname,value,iRow,iCol) {
		    	        //log('beforeSaveCell: '+rowid+','+celname+','+value+','+iRow+','+iCol);
		    	    }
		    	    ,afterSaveCell: function () {
		    	        //$(this).trigger('reloadGrid');
		    	    }
		    };
			     
		    
			// 그리드 옵션 세팅
			_GRID1.jqGrid(gridOption1);
			_GRID2.jqGrid(gridOption2);
		     
			// 그리드 해더 세팅
			_GRID1.jqGrid('setGroupHeaders', {
				useColSpanStyle: true 
				,groupHeaders:[
				               {startColumnName: 'INS_DATE', numberOfColumns: 3, titleText: '<em>주문날짜</em>'}
				               ,{startColumnName: 'DEP_SIDO_NM', numberOfColumns: 6, titleText: '<em>상차지</em>'}
				               ,{startColumnName: 'DEP_PGI_DATE', numberOfColumns: 3, titleText: '<em>상차지 출발날짜</em>'}
				               ,{startColumnName: 'DEP_REQ_DATE', numberOfColumns: 3, titleText: '<em>상차지 출발요청날짜</em>'}
				]	
			});
		
		});


    	<%-- #################################################################
				browser event zone
		################################################################# --%>	
		// 로드 이벤트
		$(window).load( function() {
			setTimeout(function(){setDatePicker("#gridInsDate1" , _CONTEXT_PATH);},5);
			setTimeout(function(){
				var calBtns = $("img.ui-datepicker-trigger");
				for ( var i =0 ; i < calBtns.length ; i++) {
					var inputH = $(calBtns[i]).prev().height();
					inputH = inputH + 4; // add padding
					$(calBtns[i]).attr("style", "vertical-align:middle;cursor: pointer;height:"+inputH+"px;");
				}
			},10);
		});
		
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
		
		
		
    	<%-- #################################################################
				pagecontext function zone
		################################################################# --%>
		/** 그리드 검색 결과 	*/
		function retrievalGrid(){
			var firstName = $("#firstName").val();	
			var lastName = $("#lastName").val();	

			var parameter = {
				firstName:firstName
				,lastName:lastName
			};
			_GRID1.setGridParam({postData:parameter}).trigger("reloadGrid");
			_GRID2.setGridParam({postData:parameter}).trigger("reloadGrid");
		}
		
    </script>

</head>

<body>


<!-- content -->
<div id="content">

	<div>
		<!-- 제목 -->
		<h3>멀티 그리드 테스트</h3>
			
		<!-- search -->
		<div class="searchBox">
			<!-- btn -->
			<div class="blueBtn">
				<a href="javascript:retrievalGrid();return false;"><img src="/tms/asset/images/sys/btn_blue_search.png" alt="조회"/></a>
			</div>
			<!-- //btn -->
			<label>Fisrt Name</label>
			<input type="text" class="input" style="width:90px;" id="firstName" name="firstName"/>
			
			<label>Last Name</label>
			<input type="text" class="input" style="width:90px;" id="lastName" name="lastName"/>
			
		</div>
		<!-- //search -->
	
	
		<div class="group">
			<div class="section leftSec" style="width:100%;">		
				<div style="height:280px; width:99.8%; background:#eee;">
					<table id="grid1" ></table>
					<div id="pager1" ></div>
				</div>
			</div>
		</div>
		<!-- // 제목 -->
	
		<div class="group">
			<div class="section leftSec" style="width:100%;">		
				<div style="height:280px; width:99.8%; background:#eee;">
					<table id="grid2" ></table>
					<div id="pager2" ></div>
				</div>
			</div>
		</div>


	</div>
</div>
	
<%@ include file="/WEB-INF/jsp/common/footer.jsp" %>