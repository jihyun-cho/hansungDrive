<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
	
	<!-- 
	그리드의 row 높이, edit-cell 의 높이 조절을 하고 싶을 때
	<style>
	#grid1 tr.jqgrow td { height: 30px; padding-top: 0px;}
	#grid1 tr.jqgrow td input,select { padding: 0px; height: 24px; }
	</style>
	 -->
	
    <script type="text/javascript">
    	<%-- #################################################################
    			전역 변수 zone
    	################################################################# --%>
    	
    	/** 셀안에 입력한 차량번호 */
    	var _KEY_IN_VHCL_NO_VALUE = "";
    	
    	var _GRID1 = {};
    	var _GRID2 = {};

    	/** 요율구분 리스트 - ajax 이용해 저장 */
    	var _GRID_RATE_CLS = "";
    	
    	/** 그리드 가로 크기 */
    	var _GRID_WIDTH = {
    			SMALL : 80
    			, MIDDLE : 100
    			, LARGE : 150
    	};
    
    	
    	<%-- #################################################################
				ready zone
		################################################################# --%>
    	
		$(document).ready(function() {

			// 탭
			$("#<%=request.getParameter("tab_id")%>", parent.document).height($(document).height());
			
			// 달력 세팅
			var dateObj = $(".input.cal");		// frameone 관련 js 를 피하기 위해 [.calendear] 을 [.cal] 로 수정
			setDatePicker(dateObj , _CONTEXT_PATH);
			initCal(dateObj);
			$("#startDepPgiDate").val("<%= com.skp.tms.common.util.DateUtil.getDate("yyyy-MM-dd",1,-7) %>");
 			//$("#startDepPgiDate").val("2014-07-01");
			$("#endDepPgiDate").val("<%= com.skp.tms.common.util.DateUtil.getDate("yyyy-MM-dd",1,0) %>");
			
			// 요율구분 콜
			getCM035List();	
			
			// 그리드 세팅
			initGrid();
		
			document.onkeydown = function() {
				if(event.keyCode == 113){
					retrievalGrid(true);
				}
			};
			
		});


    	<%-- #################################################################
				browser event zone
		################################################################# --%>	
		// 로드 이벤트
		//$(window).load( function() {
		//});
		
		
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
    	
    	/** hover가 안먹어서 세팅 */
    	function setGridHover(grids) {
    		for ( var i =0 ; i < grids.length; i ++) {
    			grids[i].mouseover(function (e) {
    				var rowId = $(e.target).parents("tr:first").attr('id');
    				$("#"+rowId).addClass("ui-state-hover");
    			}).mouseout(function (e) {
    				var rowId = $(e.target).parents("tr:first").attr('id');
    				$("#"+rowId).removeClass("ui-state-hover");
    			});
    		}
    	}
    	
    	/** 그리드 세팅 */
    	function initGrid()  {
    		// 그리드 
			_GRID1 = $("#grid1"); 
			_GRID2 = $("#grid2"); 
			
			setGridHover(new Array(_GRID1,_GRID2));
			 
			// 그리드 옵션 세팅
			var gridOption1 = {
				    url: _CONTEXT_PATH+'/getTmsHdList'
				    , postData : {shprId : $("#shprId").val() ,depAddrId : $("#depAddrId").val() , startDepPgiDate : $("#startDepPgiDate").val() , endDepPgiDate : $("#endDepPgiDate").val() }
				    , datatype: "json"
				    , jsonReader : {
				        root:"rows"
				        , page:"page"
				        , total:"total"
				        , records:"records"
				    }
				    , colNames : [ 
						'배차상태','고객','상차지 주소','하차지 주소','품목'
						,'차량톤급','차량종류'	,'<span style="color:red;">요율구분</span>','<span style="color:red;">수송량</span>','<span style="color:red;">중량(톤)</span>'
						,'<span style="color:red;">청구금액</span>','<span style="color:red;">차량번호</span>','배차번호','상차일시'	,'하차일시'
						,'주문번호','주문일시'	,'<span style="color:red;">운송거리(Km)</span>','요청사항'
						/* hidden */
						,'RATE_CLS_CD'		
						,'VHCL_NO'			/* 차량번호 = EQP_NO */
						,'CNTRL_NO'		/* 관리번호 */
						,'DRIVER_NM'		/* 운전자명 */
						,'DRIVER_TEL_NO'	/* 운전자번호 */
						,'EQP_TON_CD'		
						,'EQP_KND_CD'		
						
				    ]
				    , colModel:[
				        // 배차상태       
						{name:'CAR_ALLOW_STATS'		,index:'CAR_ALLOW_STATS'		,width:_GRID_WIDTH.MIDDLE	,editable: false,sortable:false,align:'center'
							 , formatter:function(cellValue, options, rowObject){
								 var val = "<span style='text-decoration:underline;color:blue;cursor:pointer;'>"+cellValue+"</span>";
								 return val;
				            }
						}
						// 고객
						, {name:'SHPR_NM'					,index:'SHPR_NM'						,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'center'}
						// 상차지 주소
						, {name:'DEP_ADDR1'				,index:'DEP_ADDR1'					,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'left',classes:'colLeft'
						    , cellattr: function(rowId, value, rowObject, colModel, arrData) {
						    	var detailAddr = rowObject.DEP_ADDR2;
						    	return ' title="'+detailAddr+'"'; 
						    }
						}
						// 하차지 주소
						, {name:'ARR_ADDR1'					,index:'ARR_ADDR1'					,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'left',classes:'colLeft'
						    , cellattr: function(rowId, value, rowObject, colModel, arrData) {
						    	var detailAddr = rowObject.ARR_ADDR2;
						    	return ' title="'+detailAddr+'"'; 
						    }
						}
						// 품목
						, {name:'ITEM_NM'					,index:'ITEM_NM'						,width:_GRID_WIDTH.MIDDLE	,editable: false,sortable:false,align:'center'}
						// 차량톤급 - DB or JAVA 단에서 , 붙이는 함수 태워야함. 
						, {name:'EQP_TON_NM'				,index:'EQP_TON_NM'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'right',classes:'colRight'}
						// 차량종류
						, {name:'EQP_KND_NM'				,index:'EQP_KND_NM'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 요율구분
						, {name:'RATE_CLS_NM'				,index:'RATE_CLS_NM'				,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'center'
							, edittype: 'select'	
							, editoptions: {	
								value: _GRID_RATE_CLS
								// , size : 1
								, dataInit: function(el) {
									$(el).width(78);
								}
								, dataEvents :[{
									type:'change'
									, fn : function (e) {	// 값이 바뀌면 바로 저장
										var clsTarget = $(e.target);
										var selectRow = $(clsTarget).parent().parent();
										var selectRowId = selectRow.attr("id");
										var rowIndex = selectRow.attr("id").split("_")[1];
										var colModel = _GRID1.getGridParam().colModel;
										
										var continueFlag = 0; 
										for(var j=1; continueFlag == 0 &&j<colModel.length; j++) {
											if( _GRID1.find('#'+selectRow.attr("id")+' td:eq('+j+')').hasClass('edit-cell')){
												_GRID1.jqGrid('saveCell' , parseInt(rowIndex) , j);
												continueFlag = -1;
											}
										}
									}
								}]
							} 
						}
						// 수송량 - 요율구분이 대당일때는 총 수량은 무조건 1이 되야 한다.
						, {name:'TOT_QTY'						,index:'TOT_QTY'						,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'right',classes:'colRight'	
							, formatter: custCurrency
							, edittype:'text'
							, editoptions:{
								dataInit: function (elem) {
									$(elem).css("ime-mode","disabled"); 
									$(elem).numeric({allow:"." });  
								}
								, dataEvents:[{ type:'blur' , data:{} , fn:custFnCurrency }, { type:'keyup' , data:{} , fn: function(e) { custFnCurrency(e); }}]
							}
							, unformat:function(cellValue, options, rowObject){var strValue = cellValue.replace(/,/g, '');return $.trim(strValue);}
							//, editrules:{ required: true, ...}
						}
						
						// 중량(톤)
						, {name:'TOT_WT'						,index:'TOT_WT'						,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'right',classes:'colRight'
							, formatter: custCurrency
							, edittype:'text'
							, editoptions:{
								dataInit: function (elem) {
									$(elem).css("ime-mode","disabled"); 
									$(elem).numeric({allow:"." });  
								}
								, dataEvents:[{ type:'blur' , data:{} , fn:custFnCurrency }, { type:'keyup' , data:{} , fn: function(e) { custFnCurrency(e); }}]
							}
							, unformat:function(cellValue, options, rowObject){var strValue = cellValue.replace(/,/g, '');return $.trim(strValue);}
							//, editrules:{ required: true, ...}
						}
						// 청구금액 - 특수문자가 입력이 안되게 해야함.
						, {name:'TOT_AMT'					,index:'TOT_AMT'						,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'right',classes:'colRight'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}, unformat:function(cellValue, options, rowObject){var strValue = cellValue.replace(/,/g, '');return $.trim(strValue);}
							, editoptions:{	dataInit: function (elem) {	$(elem).css("ime-mode","disabled");/*$(elem).numeric({allow:"." });*/	}}
						}
						// 차량번호
						, {name:'EQP_NO'						,index:'EQP_NO'						,width:_GRID_WIDTH.MIDDLE	 ,editable: true,sortable:false,align:'center'
							
							, edittype:'text'
							, editoptions:{
								dataEvents:[ { type:'keydown' , data:{}, fn: custCarSearch } ]
							}
							, cellattr: function(rowId, value, rowObject, colModel, arrData) {
				      			
								if(value == '&#160;'){
				      				//return 'title=더블클릭하면&#13차량조회팝업';
				      			} else{
				      				return rowObject.VHCL_NO+'class="not-editable-cell"';
				      			}
			   				}
							 , formatter:function(cellValue, options, rowObject){
			   					var rowId = options.gid + "_" + options.rowId;
			   					var rowData = _GRID1.jqGrid('getRowData', rowId);
			   					var strValue;
			   					if($.trim(cellValue) != '' && $.trim(cellValue) != 'null'){
			   						strValue = cellValue;
			   					}  else{
			   						strValue = '';
			   					} 					
			   					strValue += ' ' + '<img src="${_CONTEXT_PATH}/asset/images/sys/searchButton.png" onclick="carSearch(\''+rowId+'\');" style="cursor:pointer;vertical-align:middle;float:right;"/>';
			   					   					
				                return $.trim(strValue);
			            	}
			            	, unformat:function(cellValue, options, rowObject){
			           			var strValue = cellValue.replace(/' '/g, '');	//공백제거
			            		return $.trim(strValue);
			            	}
						}
						// 배차번호
						, {name:'MNF_NO'						,index:'MNF_NO'						,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'right',classes:'colRight'}
						// 상차일시
						, {name:'DEP_PGI_DATETIME'		,index:'DEP_PGI_DATETIME'		,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 하차일시
						, {name:'ARR_DLVRY_DATETIME'	,index:'ARR_DLVRY_DATETIME'	,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						
						// 주문번호
						, {name:'EO_ID'							,index:'EO_ID'							,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 주문일시
						, {name:'INS_DATETIME'				,index:'INS_DATETIME'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 운송거리(Km)
						, {name:'EST_DISTANCE'				,index:'EST_DISTANCE'				,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'right',classes:'colRight'
							, formatter: custCurrency
							, edittype:'text'
							, editoptions:{
								dataInit: function (elem) {
									$(elem).css("ime-mode","disabled"); 
									$(elem).numeric({allow:"." });  
								}
								, dataEvents:[{ type:'blur' , data:{} , fn:custFnCurrency }
												  , { type:'keyup' , data:{} , fn:custFnCurrency}]
							}
							//,valid_rules:{required:true, regex : /^[0-9]+$/}		
						}
						// 요청사항
						, {name:'REMK'							,index:'REMK'							,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// hidden
						, {name:'RATE_CLS_CD'					,index:'RATE_CLS_CD'				,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'VHCL_NO'						,index:'VHCL_NO'						,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'CNTRL_NO'						,index:'CNTRL_NO'					,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'DRIVER_NM'					,index:'DRIVER_NM'					,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'DRIVER_TEL_NO'				,index:'DRIVER_TEL_NO'				,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'EQP_TON_CD'					,index:'EQP_TON_CD'				,width:0 , editable:false , sortable:false, hidden:true}
						, {name:'EQP_KND_CD'					,index:'EQP_KND_CD'				,width:0 , editable:false , sortable:false, hidden:true}
				    ]
		            , ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }		// 다수 그리드는 동기(순차적)요청 해야한다.
		            
		            , multiselect: true	// 멀티 셀렉트 박스가 첫번째 컬럼에 생김
		            , rownumbers : true // 맨 앞줄에 row 번호 부여. 
					, rownumWidth : 20 // rownumbers size 지정 
				    , rowNum:30
				    , shrinkToFit: false
					, scrollOffset:0
				    , idPrefix:'grid1_'	    

				    , width: 99.8*_GRID1.getWidthByPercent(100)/100
				    , height: _GRID1.getHeightByPercent(100) - 49	// ie7 는 랜더링이 틀려서 1px 더 줄임
				    , autowidth: false	// 오토 조절 가능 (width 옵션과 동시 사용 불가!)  
				    , viewrecords: true

				    , footerrow : true
				    , pager: '#pager1'
				    , emptyrecords : "데이터가 없습니다."

				    , cellEdit : true
				    , cellsubmit  : 'clientArray'		// can have two values: 'remote' or 'clientArray'.
				    
				    , loadComplete : function(data){ 
				    	
				    	var rows= _GRID1.jqGrid('getRowData');
				    	var totalQty=0, totalWt = 0, total = 0, totalAmt = 0, totalDisTance = 0;

				    	if(rows.length > 0){
				    		for(var i=0;i<rows.length;i++){
				    			totalQty += Number( rows[i].TOT_QTY.replace(/,/g,''));		// custCurreny 사용하면 ,를 제거해야함
				    			totalWt += Number(rows[i].TOT_WT); 
				    			totalAmt += Number(rows[i].TOT_AMT);
				    			totalDisTance += Number(rows[i].EST_DISTANCE);
				    		}				
				    	}
				    	_GRID1.jqGrid('footerData', 'set', {RATE_CLS_NM:'합  계',TOT_QTY:totalQty, TOT_WT:totalWt, TOT_AMT:totalAmt, EST_DISTANCE:totalDisTance});
					}
				    , onCellSelect: function(rowid, iCol, cellcontent, e) {  
				    	
				    	
		    	        var tr = _GRID1.find('#'+rowid);
		    	        var tdList = $(tr).find("td");
		        		var td = $(tdList).eq(iCol);
		        		var editFalse = "not-editable-cell";
		        		
		        		var startDepPgiDate = $("#startDepPgiDate").val();
	        			var endDepPgiDate = $("#endDepPgiDate").val();	
	        			var retrievalDate = {
	        				startDepPgiDate : startDepPgiDate
	        				, endDepPgiDate : endDepPgiDate
	        			};
	        			
		        		var eoId = "";
		        		
		        		 // 차량번호 colModel에 대한 이벤트
		    	        if ( $(td).attr("aria-describedby").indexOf("EQP_NO") > -1 ) {
		        			// 차량번호가 안지워지게 한다.
			        		//log( td.attr("class"));
		        			var existClass = td.attr("class"); 
			        		if ( existClass.indexOf(editFalse) > -1) {
			        			$(td).removeClass(editFalse);
			        		}
		    	        	$(td).css("ime-mode","active");
				    	    $(td).attr("maxlength",9);	
				    	    
				    	// 배차상태 colModel에 대한 이벤트
		        		} else if ( $(td).attr("aria-describedby").indexOf("CAR_ALLOW_STATS") > -1 ) {
		        			
		        			// 주문번호를 구한다.
		        			var colModelContinue =0;
		            		for( var i=0; colModelContinue==0 && i < tdList.length; i++){ 
		            			var findTd =tdList[i];
		            			if ( $(findTd).attr("aria-describedby").indexOf("EO_ID") > -1) {
		            				eoId = $(findTd).text();
		            				colModelContinue =1;
		            			} 
		            		}
		            		colModelContinue =0;
		        			
		            		var parameter = {};
		            		$.extend(parameter,retrievalDate , {eoId:eoId , initFlag : "N"})
		            		
		        			_GRID2.setGridParam({postData:parameter}).trigger("reloadGrid");
		            	
		            		
		            	// 수송량 colModel에 대한 이벤트
		        		} else if ( $(td).attr("aria-describedby").indexOf("TOT_QTY") > -1 ) {
					    	
					    	var clsTarget = $(td).prev();
					    	var clsVal = $(clsTarget).text();
					    	
					    	if ( clsVal == "개당") {
					    		_GRID1.setColProp('TOT_QTY',{editable:true});
					    	} else if ( clsVal == "톤당") {
					        	_GRID1.setColProp('TOT_QTY',{editable:false});
					    	} else if ( clsVal == "대당") {
					    		_GRID1.setColProp('TOT_QTY',{editable:false});
					    	}
					    	
		        		}
		    	       	    
				    }
				    , beforeSaveCell: function(rowid,celname,value,iRow,iCol) {
				    	
				    	/** 시작 - 요율구분에 따라 수송량 값과 속성을 변경한다 ############### */
				     	// 요율구분-개당
				        if ( celname=="RATE_CLS_NM" && value =="1") {
				      		// 이벤트 없음
				        	
				        // 요율구분-톤당
				        } else if ( celname=="RATE_CLS_NM" && value =="2") {
				        	
				        	var clsTarget = _GRID1.find("#"+rowid+">td:eq("+iCol+")");		// 요율구분 엘레먼트
							var qtyTarget = $(clsTarget).next();
							var wtTarget = $(qtyTarget).next();
							var wtValue = $(wtTarget).text();
							$(qtyTarget).text(wtValue).attr({"title":wtValue});						// 수송량 값은 중량과 값이 된다.
							
				        // 요율구분-대당	
				        } else if ( celname=="RATE_CLS_NM" && value =="3") {
				        	
				        	var clsTarget = _GRID1.find("#"+rowid+">td:eq("+iCol+")");		// 요율구분 엘레먼트
							var qtyTarget = $(clsTarget).next();
							if ($(qtyTarget).text() != "1") {
								$(qtyTarget).text("1").attr({"title":"1"});									// 수송량  값은 1
							}
							
				        // 중량	
				        } else if ( celname=="TOT_WT" ) {
				        	
				        	var wtTarget = _GRID1.find("#"+rowid+">td:eq("+iCol+")");		// 중량 엘레먼트
							var qtyTarget = $(wtTarget).prev();
							var clsTarget = $(wtTarget).prev().prev();
							
							// 수송량값은 중량값과 같다
							if ($(clsTarget).text() == "톤당") {
					        	_GRID1.setColProp('TOT_QTY',{editable:true});
								$(qtyTarget).text(value).attr({"title":value});	
					        	_GRID1.setColProp('TOT_QTY',{editable:false});

							}
				        }
				        /** 종료 - 요율구분에 따라 수송량 값과 속성을 변경한다 ############### */
				        
				    }
			};

			
			var gridOption2 = {
		    	    url: _CONTEXT_PATH+'/getTmsDtlList'
		    	    , datatype: "json"
		    	    , postData : {
		    	    	initFlag : "Y"
		    	    }
		    	    , jsonReader : {
		    		    root:"rows"
		    		    , page:"page"
		    		    , total:"total"
		    		    , records:"records"
		    	    }
		    	    , colNames : [ 
		 				'배차상태'
		    	        ,'운송주문번호'
						,'운송계획번호'
						,'하차지 주소'
						,'품목'
						,'수량'
						,'무게'
						,'청구금액'
						,'운송거리(Km)'
						,'하차일시'
						,'하차요청일시'
						,'주문번호'
		    	    ]
		    	    , colModel:[
		    	        // 배차상태        
						{name:'TOL_SNM'							, index:'TOL_SNM'					, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
						// 운송주문번호
						, {name:'TOL_NO'							, index:'TOL_NO'						, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
						// 운송계획번호
						, {name:'SHMPT_NO'						, index:'SHMPT_NO'					, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
						// 하차지 주소
						, {name:'ARR_ADDR'						, index:'ARR_ADDR'					, width:250							, editable: false,sortable:false,align:'center'}
						// 품목
						, {name:'ITEM_NM'						, index:'ITEM_NM'						, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
						// 수량
						, {name:'QTY'								, index:'QTY'							, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'right',classes:'colRight'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 무게
						, {name:'WT'								, index:'WT'								, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'right',classes:'colRight'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 청구금액
						, {name:'AMT'								, index:'AMT'							, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'right',classes:'colRight'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 운송거리(Km)
						, {name:'EST_DISTANCE'				, index:'EST_DISTANCE'				, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'right',classes:'colRight'}
						// 하차일시
						, {name:'ARR_DLVRY_DATETIME'		, index:'ARR_DLVRY_DATE'			, width:_GRID_WIDTH.LARGE	, editable: false,sortable:false,align:'center'}
						// 하차요청일시
						, {name:'ARR_REQ_DATETIME'		, index:'ARR_REQ_DATE'			, width:_GRID_WIDTH.LARGE	, editable: false,sortable:false,align:'center'}
						// 주문번호
						, {name:'EO_ID'							, index:'EO_ID'							, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
		    	    ]
		    	    , ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }		// 다수 그리드는 동기(순차적)요청 해야한다.
		            , multiselect: true	// 멀티 셀렉트 박스가 첫번째 컬럼에 생김
		            , rownumbers : true // 맨 앞줄에 row 번호 부여. 
					//, rownumWidth : 20 // rownumbers size 지정 
				    , rowNum:30
				    , shrinkToFit: false
					, scrollOffset:0
				    , idPrefix:'grid2_'	    

				    , width: 99.8*_GRID2.getWidthByPercent(100)/100
				    , height: _GRID2.getHeightByPercent(100) - 49	// ie7 는 랜더링이 틀려서 1px 더 줄임
				    , autowidth: false	// 오토 조절 가능 (width 옵션과 동시 사용 불가!)  
				    , viewrecords: true

				    , footerrow : true
				    , pager: '#pager2'
				    , emptyrecords : "데이터가 없습니다."

				    , cellEdit : true
				    , cellsubmit  : 'clientArray'		// can have two values: 'remote' or 'clientArray'. 

					, loadComplete : function(data){ 
					   	var rows= _GRID2.jqGrid('getRowData');
					   	var totalQty=0, totalWt = 0, total = 0, totalAmt = 0, totalDisTance = 0;
					
					   	if(rows.length > 0){
					   		for(var i=0;i<rows.length;i++){
					   			totalQty += Number( rows[i].QTY);
					   			totalWt += Number(rows[i].WT); 
					   			totalAmt += Number(rows[i].AMT);
					   			totalDisTance += Number(rows[i].EST_DISTANCE);
					   		}				
					   	}
					   	_GRID2.jqGrid('footerData', 'set', {ITEM_NM:'합  계', QTY:totalQty, WT:totalWt, AMT:totalAmt, EST_DISTANCE:totalDisTance});

	 			    }	
		    	    , afterSubmitCell : function(data) {
		    	        var result = $.parseJSON(data.responseText);
		    	        return [ result.successFlag , result.msg ];
		    	    }
		    };
			
			// 그리드 드로우
			_GRID1.jqGrid(gridOption1);
			_GRID2.jqGrid(gridOption2);
    	}
    	
    	/** 요율구분 리스트 콜 */
    	function getCM035List() {
    		var url = _CONTEXT_PATH+"/common/getCM035List";
    		var dataOp = {};
    		 $().tmsAjax({"url" : url , "data" : dataOp , async : false} , callbackCM035List );
    	}
    	
		/** 요율구분 리스트 콜백 */
		function callbackCM035List ( obj , data ) {
			var CM035 = data.CM035; 
			for ( var i=0;i<CM035.length;i++) {
				if ( i != (CM035.length-1) ) {
					_GRID_RATE_CLS += CM035[i].CD+":"+CM035[i].CD_NM +";";
				} else {
					_GRID_RATE_CLS += CM035[i].CD+":"+CM035[i].CD_NM;
				}
			}
		}
		
		
    	
    	/** 그리드 검색 결과 	*/
		function retrievalGrid(flag){
			var parameter = {};
    		if ( flag ) {
    			var startDepPgiDate = $("#startDepPgiDate").val();
    			var endDepPgiDate = $("#endDepPgiDate").val();	
    			var depAddrId = $("#depAddrId").val();	
    			var shprId = $("#shprId").val();	
    			parameter = {
    				startDepPgiDate : startDepPgiDate
    				, endDepPgiDate : endDepPgiDate
    				, depAddrId : depAddrId
    				, shprId : shprId
    			};
    		}
			
			_GRID1.setGridParam({postData:parameter}).trigger("reloadGrid");
			_GRID2.setGridParam({postData:parameter}).trigger("reloadGrid");
		}
    	
    	
    	/** 수정중인 셀이 stop */
    	function editStop(grid , selectRows){
			var colModel = grid.getGridParam().colModel;
			var gridData = [];
			
			for(var i=0; i<selectRows.length ; i++) {
				for(var j=1; j<colModel.length; j++) {
					if( grid.find(' tr#'+selectRows[i]+' td:eq('+j+')').hasClass('edit-cell')){
						grid.saveCell(selectRows[i], j);		// 혹은 // grid.jqGrid('saveCell',selectRows[i],j);
					}
				}
				var rowData = grid.getRowData(selectRows[i]);
				gridData.push(rowData);
	    	}
			
    	}
    	
    	
    	/** 첫번째 그리드 업데이트 */
    	function updateGrid01(){
    		
    		var selectRows = _GRID1.jqGrid('getGridParam', 'selarrrow');
    		if(selectRows.length == 0) {
    			alert("선택된 데이터가 없습니다.");
    			return false;
    		}

    		editStop(_GRID1 , selectRows);
    		
    		var url = _CONTEXT_PATH+"/updateTmsHdInfos";
    		// 검색 파라미터
			var startDepPgiDate = $("#startDepPgiDate").val();
			var endDepPgiDate = $("#endDepPgiDate").val();	
			// 업데이트가 가능한 컬럼
			var updateRows = new Array();
			
			for(var i=0; i<selectRows.length; i++) {
				var checked = $("#"+selectRows[i] +" input[type=checkbox]").prop("checked");
				
				if ( checked == true ) {
					var getRowData = _GRID1.jqGrid('getRowData', selectRows[i]);
					var rateClsCd = 1;
					switch ( getRowData.RATE_CLS_NM ) {
						case "개당" : rateClsCd = "1"; break;  
						case "톤당" : rateClsCd = "2"; break;  
						case "대당" : rateClsCd = "3"; break;  
					}
					var updateRowData = {
							EO_ID : getRowData.EO_ID
							, VHCL_NO : getRowData.EO_ID
							, TOT_QTY : getRowData.TOT_QTY
							, TOT_WT : getRowData.TOT_WT
							, TOT_AMT : getRowData.TOT_AMT
							, TOT_DISTANCE : getRowData.TOT_DISTANCE
							, RATE_CLS_CD : rateClsCd
					};
					
					updateRows.push(updateRowData);
				}
			}
			
			// 파라미터 세팅
			var dataOp = {
				startDepPgiDate : startDepPgiDate
				, endDepPgiDate : endDepPgiDate
				, rowList : JSON.stringify(updateRows)
			};
			
			// ajax 콜
			$().tmsAjax({"url" : url , "data" : dataOp , async : true} , callbackUpdateGrid01 );

		}
    	
    	
		/** 업데이트 콜백 */
		function callbackUpdateGrid01 ( obj , data ) {
			alert(data.msg);
			if (data.successFlag == true ) {
				// 그리드 리로드 하자
				_GRID1.trigger("reloadGrid");
			}
		}
    	
    	
    	
    	<%-- #################################################################
				대통에서 따와서 수정이 필요한 부분
		################################################################# --%>
    	
    	/** 차량팝업 오픈 - 차량번호 셀 안에 버튼 클릭 */
    	function carSearch(rowId){
    		var check = 'notKeyIn';
    		var popup = window.open(_CONTEXT_PATH + '/getTmsVhclNoList?check='+check, 'popup', 'width=1000, height=760, scrollbars=auto');
    		popup.focus();	 
    	}
    	
    	
    	
    	
    	/** 차량팝업 오픈 - 차량번호 셀 안에 텍스트입력 후 엔터 */
    	function custCarSearch ( evt ){
        	if (evt.keyCode == 13) {
        		var keyInValue = $(this).val(); 
        		_KEY_IN_VHCL_NO_VALUE = keyInValue;
        		
        		var url = _CONTEXT_PATH+"/getTmsVhclNoListData";
        		var dataOp = {
        				VHCL_NO : keyInValue
        		};
        		$(this).tmsAjax({"url" : url , "data" : dataOp , async : false} , callbackCustCarSearch );
        	}
    	}
    	
    	
    	/** 차량팝업 오픈 - 차량번호 셀 안에 텍스트입력 후 엔터 콜백 */
    	function callbackCustCarSearch( obj , data ) {
 			
    		if (data.successFlag == false ) {
				alert(data.msg);
				return;
			}
    		
    		var carList = data.rows;
    		var input = $(obj);
    		var td = $(obj).parent();
    		var tr = $(td).parent();
    		var rowId = $(tr).attr("id");
    		var iRow = parseInt($(input).attr("id").replace("_EQP_NO"));
    		
    		if ( carList.length == 0 ) {
    			alert('데이터가 없습니다.');
    			$(obj).val("");
    			
    		} else if ( carList.length == 1 ) {
    			var rowData = carList[0];
    			editRowCarSearchInfo(_GRID1, rowData , rowId, iRow);
    			
    		} else if ( carList.length > 1 ) {
        		var popup = window.open(_CONTEXT_PATH + '/getTmsVhclNoList?VHCL_NO='+_KEY_IN_VHCL_NO_VALUE, 'popup', 'width=1000, height=760, scrollbars=auto');
        		popup.focus();	
    			$(obj).val("");

    		}
    		
    	}
    	
    	
    	/** 차량번호 관련 데이터 응답값 - 자식 popup에서 호출 요청하는 함수 */
		function vhclData(rowData, rowId, knd){
    		var tmpRow = rowId.split("_"); 
    		var iRow = tmpRow[1];
    		var id = iRow + "_VHCL_NO";
    		$("#" + id).val(rowData.EQP_NO);
    		editRowCarSearchInfo( _GRID1, rowData, rowId, iRow )
    	}
    	
    	
    	/** 차량번호 관련 응답값을 그리드에 업데이트 한다. */
    	function editRowCarSearchInfo( grid, rowData, rowId, iRow ){
			
    		var gridRowData = grid.jqGrid("getRowData", rowId);
			grid.jqGrid('setRowData',rowId,{
    			EQP_NO : rowData.EQP_NO	/* 차량번호 */
    			//, CNTRL_NO:rowData.CNTRL_NO		/* 관리번호 */
    			, MNF_NO:rowData.CNTRL_NO		/* 관리번호 */
    			, DRIVER_NM:rowData.DRIVER_NM		/* 운전자명 */
    			, DRIVER_TEL_NO:rowData.DRIVER_TEL_NO		/* 운전자번호 */
    			, EQP_TON_NM:rowData.VHCL_TON_NM		/* 차톤값 */
    			, EQP_KND_NM:rowData.VHCL_KND_NM		/* 차종명 */
    			, EQP_TON_CD:rowData.VHCL_TON_CD		/* 차톤코드 */
    			, EQP_KND_CD:rowData.VHCL_KND_CD		/* 차종코드*/
    		});
			
			
			var colModel = grid.jqGrid('getGridParam', 'colModel'); 
    		var colModelContinue = 0;
    		var iColIdx;
    		for( var i=0; colModelContinue==0 && i < colModel.length; i++){ 
    			if ( colModel[i].name == "EQP_NO") {
    				iColIdx = i;
    				colModelContinue =1;
    			} 
    		}
    		colModelContinue =0;
    		
    		
    		// 수정한 엘레먼트의 class 값 변경 - 차량번호 값이 지워지지 않도록 세팅
    		var eqpNoTd = grid.find('#'+rowId+' td').eq(iColIdx);
    		var existClass = eqpNoTd.attr("class");
    		eqpNoTd.removeClass(existClass);
    		eqpNoTd.addClass("not-editable-cell ui-state-highlight");
    		
    		//차량팝업으로 차량 조회후 아래 ROW로 포커스 이동
    		var rows = grid.jqGrid('getRowData');
    		if(rows.length > parseInt(iRow)) {
    			// 수정한 엘레먼트의 class 값 변경 - 인풋태그가 나오도록 수정
    			var nextIRow = parseInt(iRow)+1;
    			var nextEqpNoTd = grid.find('#'+rowId.split("_")[0]+"_"+(nextIRow).toString()+' td').eq(iColIdx);
    			var existNesstClass = nextEqpNoTd.attr("class");
    			nextEqpNoTd.removeClass(existNesstClass);
    			nextEqpNoTd.addClass("edit-cell ui-state-highlight");
    	  		grid.jqGrid("editCell", nextIRow, iColIdx, true);
    		}
    		
    	}

    	
//고객조회
function searchCustomer()
{
	tmsSearchCustomer({type:'custPopUp',width:'800',height:'600',scrollbars:'no',retParams:[{elemId:'shprNm',popGridElemNM:'SHPR_NM'},{elemId:'shprId',popGridElemNM:'SHPR_ID'}],userFunc:'popupAfter'});
	return false;
}


/**
 * 주문 고객조회 팝업
*/
function tmsSearchCustomer(args){
    
    var popupUrl = "/tms/searchCustomer";
    var popupNm = "searchPopUpCustomer";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = 'auto';
    var userFunc = "";
    
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
 
    var po = {};	
	po['returnArr'] = args.retParams;
	po['mappingArr'] = args.mappingArr;
	var poJSON = JSON.stringify(po);
	
	var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: popupNm, // name of window
			windowURL: popupUrl, 
			width : popupWidth,	//사용자정의값 우선
			height: popupHeight,
			scrollbars : popupScrollbars,
			param : {po:poJSON,userFunc:userFunc}
	};	
 
	var popup = openWindowPopup(options);
	popup.focus();		
}
    	
    	
    	
/**
 * 주소조회 팝업 오픈
*/
function searchAddr () {
	
	var searchAddr = $("#depAddrNm").val();
	//var popup = window.open( _CONTEXT_PATH + "/searchAddr?searchAdd="+searchAdd, 'searchAddr', 'width=800, height=600, scrollbars=no' );
	//popup.focus();

	var po = {};
	po['returnArr'] = [{elemId:'depAddrNm',popGridElemNM:'HDONG_NM'},{elemId:'depAddrId',popGridElemNM:'HDONG_CD'}];
	po['mappingArr'] = {searchAddr : searchAddr};
	var poJSON = JSON.stringify(po);
	var userFunc = "returnAddr";
	
	var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "searchAddr", // name of window
			windowURL: _CONTEXT_PATH + "/searchAddr", 
			width : "450",
			height: "600",
			scrollbars : "no",
			param : {po:poJSON,userFunc:userFunc}
	};	
	var popup = openWindowPopup(options);
	popup.focus();	
	return false;
}    	


/**
 * 주소조회 팝업 리턴
 */
function returnAddr( returnObj) {
	//log( returnObj)
}


</script>

</head>
<body>

<!-- content -->
<div id="content">

	<div>
		
		<!-- 제목 -->
		<h3>배차의뢰 관리</h3>
		<!-- // 제목 -->
		
		<!-- searchBox -->
		<div class="searchBox">
			
			<!-- blueBtn -->
			<div class="blueBtn">
				<a href="#" onclick="javascript:retrievalGrid(true);return false;" title="조회"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_blue_search.png" alt="조회"/></a>
				<a href="#" onclick="javascript:updateGrid01();return false;" title="저장"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_blue_save.png" title="저장" /></a>
			</div>
			<!-- //blueBtn -->
			
			<!-- 검색 -->
			<label>상차일자</label>
			<input type="text" class="input cal" maxlength="8" name="startDepPgiDate" id="startDepPgiDate" style="width:90px;" /> ~ <input type="text" class="input cal"  maxlength="8" name="endDepPgiDate" id="endDepPgiDate" style="width:90px;" />
			<label>고객</label>
			<input  type="text" readonly class="input readonly" style="width:100px;" name="shprNm" id="shprNm" onclick="searchCustomer();"  />
			<a href="#" onclick="searchCustomer();" title="검색"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_gray_search.png" class="inputBtn" alt="검색" /></a>
			<input type="hidden" name="shprId" id="shprId" />
			
			<label>상차지</label>
			<input type="text" class="input" style="width:100px;" name="depAddrNm" id="depAddrNm" onchange="javascript:$('#depAddrId').val('');" onkeyup="javascript: if(event.keyCode ==13 ) { searchAddr(); }"  />
			<a href="#" onclick="searchAddr();" title="검색"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_gray_search.png" class="inputBtn" alt="검색" /></a>
			<input type="hidden" name="depAddrId" id="depAddrId" />
			
			<!-- <a href="#" onclick="javascript:retrievalGrid();return false;"><button class="inputBtn" style="width:30px; height:26px;">전체</button></a> -->
			<!--// 검색 -->
			
			
		</div>
		<!-- //searchBox -->
		
		<!-- group -->
		<div class="group">
			<div class="section">
			
				<!-- btnG -->
				<div class="btnG">
					<a href="#" onclick="javascript:void(0);" class="grayBtn" title="배차계획확정"><span title="배차계획확정">배차계획확정</span></a>
					<a href="#" onclick="javascript:void(0);" class="grayBtn" title="배차지시"><span title="배차지시">배차지시</span></a>
					<a href="#" onclick="javascript:void(0);" class="grayBtn" title="배차확정"><span title="배차확정">배차확정</span></a>
					<a href="#" onclick="javascript:void(0);" class="grayBtn" title="기능버튼"><span title="기능버튼">기능버튼</span></a>
				</div>
				<!--// btnG -->
				
				<!-- grid1 -->
				<div style="height:400px; background:#eee;">
					<table id="grid1" ></table>
					<div id="pager1" ></div>
				</div>
				<!--// grid1 -->
				
			</div>
		</div>
		<!--// group -->
	

		<!-- grid2 -->
		<div class="group">
				<div class="section">
				<div style="height:150px; background:#eee;">
					<table id="grid2" ></table>
					<div id="pager2" ></div>
				</div>
			</div>
		</div>
		<!--// grid2 -->
		

	</div>
</div>
<!--// content -->

<br/><%-- 프레임속에서 grid2 가 짤리는 것 방지 --%>
	
<%@ include file="/WEB-INF/jsp/common/footer.jsp" %>