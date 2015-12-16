<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
	
    <script type="text/javascript">
    	<%-- #################################################################
    			전역 변수 zone
    	################################################################# --%>
    	var _GRID1 = {};
    	var _GRID2 = {};

    	/** 요율구분 리스트 - ajax 이용해 저장 */
    	var _GRID_RATE_CLS1 = "";	
    	
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
			
			setDatePicker($(".input.calendar") , _CONTEXT_PATH);
			initCal();
			
			getCM035List();	// 요율구분 리스트 콜
			
			// 그리드 
			_GRID1 = $("#grid1"); 
			_GRID2 = $("#grid2"); 
			
			// 그리드 옵션 세팅
			var gridOption1 = {
				    url: _CONTEXT_PATH+'/getTmsHdList'
				    , datatype: "json"
				    , jsonReader : {
				        root:"rows"
				        , page:"page"
				        , total:"total"
				        , records:"records"
				    }
				    , colNames : [ 
						'배차상태','고객','상차지 주소','하차지 주소','품목'
						,'차량톤급','차량종류'	,'요율구분','수송량','중량(톤)'
						,'청구금액','차량번호','배차번호','상차일시'	,'하차일시'
						,'주문번호','주문일시'	,'운송거리(Km)','요청사항'
				    ]
				    , colModel:[
				        // 배차상태       
						{name:'CAR_ALLOW_STATS'		,index:'CAR_ALLOW_STATS'		,width:_GRID_WIDTH.MIDDLE	,editable: false,sortable:false,align:'center'}
						// 고객
						, {name:'SHPR_NM'					,index:'SHPR_NM'						,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'center'}
						// 상차지 주소
						, {name:'DEP_ADDR1'				,index:'DEP_ADDR1'					,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'center'
						    , cellattr: function(rowId, value, rowObject, colModel, arrData) {
						    	var detailAddr = rowObject.DEP_ADDR2;
						    	return ' title="'+detailAddr+'"'; 
						    }
						}
						// 하차지 주소
						, {name:'ARR_ADDR1'					,index:'ARR_ADDR1'					,width:_GRID_WIDTH.LARGE	,editable: false,sortable:false,align:'center'
						    , cellattr: function(rowId, value, rowObject, colModel, arrData) {
						    	var detailAddr = rowObject.ARR_ADDR2;
						    	return ' title="'+detailAddr+'"'; 
						    }
						}
						// 품목
						, {name:'ITEM_NM'					,index:'ITEM_NM'						,width:_GRID_WIDTH.MIDDLE	,editable: false,sortable:false,align:'center'}
						
						// 차량톤급 - DB or JAVA 단에서 , 붙이는 함수 태워야함. 
						, {name:'EQP_TON_CD'				,index:'EQP_TON_CD'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 차량종류
						, {name:'EQP_KND_CD'				,index:'EQP_KND_CD'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 요율구분
						, {name:'RATE_CLS_NM'				,index:'RATE_CLS_NM'				,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'center'
							, edittype: 'select'
							, editoptions: {
								value: _GRID_RATE_CLS1
								, dataInit: function(el) {$(el).width(78);}
								/* 						
						        ,dataEvents: [{
								                 type: 'change',
								                 fn: function(el) {
								                     var clsTarget = $(el.target);		// 요율구분 엘레먼트
								                     var newValue = clsTarget.val();	// 요율구분 값
								                     // 요율구분이 대당일때 수송량은 1로 바뀜.
								                     if ( newValue == "3" ) {	
								                     	var qtyTarget = $(clsTarget).parent().next();
								                     	$(qtyTarget).text("1").attr({"title":"1"});
								                     // 요율구분이 대당이 아닐때
								                     } else {
								                     	...	 
								                     }
						                  		}
						           }]
						         */
								}  	
						}
						// 수송량 - 요율구분이 대당일때는 총 수량은 무조건 1이 되야 한다.
						, {name:'TOT_QTY'						,index:'TOT_QTY'						,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'center'	
							, formatter: custCurrency
							, edittype:'text'
							, editoptions:{
								dataInit: function (elem) {
									$(elem).css("ime-mode","disabled"); 
									//$(elem).css("text-align","right"); 
									$(elem).numeric({allow:"." });  
									//$(elem).addClass('inputGrid');
								}
								, dataEvents:[{ type:'blur' , data:{} , fn:custFnCurrency }
								  				, { type:'keyup' , data:{} , fn:custFnCurrency}]
							}
							//,valid_rules:{required:true, regex : /^[0-9]+$/}
						}
						// 중량(톤)
						, {name:'TOT_WT'						,index:'TOT_WT'						,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}
						}
						// 청구금액
						, {name:'TOT_AMT'					,index:'TOT_AMT'						,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 차량번호
						, {name:'EQP_NO'						,index:'EQP_NO'						,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 배차번호
						, {name:'MNF_NO'						,index:'MNF_NO'						,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 상차일시
						, {name:'DEP_PGI_DATETIME'		,index:'DEP_PGI_DATETIME'		,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 하차일시
						, {name:'ARR_DLVRY_DATETIME'	,index:'ARR_DLVRY_DATETIME'	,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						
						// 주문번호
						, {name:'EO_ID'							,index:'EO_ID'							,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 주문일시
						, {name:'INS_DATETIME'				,index:'INS_DATETIME'				,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}
						// 운송거리(Km)
						, {name:'EST_DISTANCE'				,index:'EST_DISTANCE'				,width:_GRID_WIDTH.SMALL	,editable: true,sortable:false,align:'center'
							, formatter: custCurrency
							, edittype:'text'
							, editoptions:{
								dataInit: function (elem) {
									$(elem).css("ime-mode","disabled"); 
									//$(elem).css("text-align","right"); 
									$(elem).numeric({allow:"." });  
									//$(elem).addClass('inputGrid');
								}
								, dataEvents:[{ type:'blur' , data:{} , fn:custFnCurrency }
												  , { type:'keyup' , data:{} , fn:custFnCurrency}]
							}
							//,valid_rules:{required:true, regex : /^[0-9]+$/}		
						}
						// 요청사항
						, {name:'REMK'							,index:'REMK'							,width:_GRID_WIDTH.SMALL	,editable: false,sortable:false,align:'center'}

				    ]
		            , ajaxGridOptions: { contentType: 'application/json; charset=utf-8' , async:false }		// 다수 그리드는 동기(순차적)요청 해야한다.
		            
		            , multiselect: true	// 멀티 셀렉트 박스가 첫번째 컬럼에 생김
		            , rownumbers : true // 맨 앞줄에 row 번호 부여. 
					, rownumWidth : 20 // rownumbers size 지정 
				    , rowNum:30
				    , shrinkToFit: false
					, scrollOffset:0
				    , idPrefix:'grid1_'	    

				    , width: _GRID1.getWidthByPercent(100)
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
		    	        log("onCellSelect : " + rowid+','+iCol+','+cellcontent);
		    	        log(e);
				    }

				    , beforeSubmitCell : function(rowid,celname,value,iRow,iCol) {
				        //log("beforeSubmitCell : " + rowid+','+ cellname+','+ value);
				        log("beforeSubmitCell : "+rowid+','+celname+','+value+','+iRow+','+iCol);
    			    }
				    , beforeSaveCell: function(rowid,celname,value,iRow,iCol) {
				        log('beforeSaveCell: '+rowid+','+celname+','+value+','+iRow+','+iCol);
				        
				     	// 요율구분-개당
				        if ( celname=="RATE_CLS_NM" && value =="1") {
				        	_GRID1.setColProp('TOT_QTY',{editable:true});
				      
				        // 요율구분-톤당
				        } else if ( celname=="RATE_CLS_NM" && value =="2") {
				        	
				        	var clsTarget = _GRID1.find("#"+rowid+">td:eq("+iCol+")");		// 요율구분 엘레먼트
							var qtyTarget = $(clsTarget).next();
							var wtTarget = $(qtyTarget).next();
							var wtValue = $(wtTarget).text();
							$(qtyTarget).text(wtValue).attr({"title":wtValue});						// 수송량 값은 중량과 값이 된다.
							
				        	_GRID1.setColProp('TOT_QTY',{editable:true});
				       
				        // 요율구분-대당	
				        } else if ( celname=="RATE_CLS_NM" && value =="3") {
				        	
				        	var clsTarget = _GRID1.find("#"+rowid+">td:eq("+iCol+")");		// 요율구분 엘레먼트
							var qtyTarget = $(clsTarget).next();
							if ($(qtyTarget).text() != "1") {
								$(qtyTarget).text("1").attr({"title":"1"});									// 수송량  값은 1
							}
							_GRID1.setColProp('TOT_QTY',{editable:false});
				        }
				        
				    }
				    , afterSaveCell: function () {
				    	log("afterSaveCell");
				    	
				        //$(this).trigger('reloadGrid');
				    }
			};

			
			var gridOption2 = {
		    	    url: _CONTEXT_PATH+'/getTmsDtlList'
		    	    , datatype: "json"
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
						, {name:'QTY'								, index:'QTY'							, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 무게
						, {name:'WT'								, index:'WT'								, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 청구금액
						, {name:'AMT'								, index:'AMT'							, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'
							, formatter:'currency'	,formatoptions:{thousandsSeparator:",", decimalPlaces: 0}	
						}
						// 운송거리(Km)
						, {name:'EST_DISTANCE'				, index:'EST_DISTANCE'				, width:_GRID_WIDTH.SMALL	, editable: false,sortable:false,align:'center'}
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
					, rownumWidth : 20 // rownumbers size 지정 
				    , rowNum:30
				    , shrinkToFit: false
					, scrollOffset:0
				    , idPrefix:'grid2_'	    

				    , width: _GRID2.getWidthByPercent(100)
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
				    , onCellSelect: function(rowid, iCol, cellcontent, e) {  
		    	        log("onCellSelect : " + rowid+','+iCol+','+cellcontent);
		    	        log(e);
		    	    }

		    	    , beforeSubmitCell : function(rowid, cellname, value) {
		    	        log("beforeSubmitCell : " + rowid+','+ cellname+','+ value);
						
		    	        /* cell 서밋 예제 
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
						 */

		            }
		    	    , afterSubmitCell : function(data) {
		    	        var result = $.parseJSON(data.responseText);
		    	        return [ result.successFlag , result.msg ];
		    	    }
		    	    , beforeSaveCell: function(rowid,celname,value,iRow,iCol) {
		    	        //log('beforeSaveCell: '+rowid+','+celname+','+value+','+iRow+','+iCol);
		    	    }
		    	    , afterSaveCell: function () {
		    	        //$(this).trigger('reloadGrid');
		    	    }
		    };
			
			
			
			// 그리드 옵션 세팅
			_GRID1.jqGrid(gridOption1);
			_GRID2.jqGrid(gridOption2);
		     
/* 			
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
 */		
		});


    	<%-- #################################################################
				browser event zone
		################################################################# --%>	
		// 로드 이벤트
		$(window).load( function() {

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
					_GRID_RATE_CLS1 += CM035[i].CD+":"+CM035[i].CD_NM +";";
				} else {
					_GRID_RATE_CLS1 += CM035[i].CD+":"+CM035[i].CD_NM;
				}
			}
		}
    	
    	
    	/** 수정해야함 - 장소조회 */
    	function searchStNode(gubun){
    		if(gubun=='dep'){
    			tmsSearchStNode({type:'custPopUp',width:'800',height:'600',scrollbars:'no',retParams:[{elemId:'depNodeNm',popGridElemNM:'NODE_NM'},{elemId:'depNodeId',popGridElemNM:'NODE_ID'}],paramUserFunc:'setStNode'});
    		} else{
    			tmsSearchStNode({type:'custPopUp',width:'800',height:'600',scrollbars:'no',retParams:[{elemId:'arrNodeNm',popGridElemNM:'NODE_NM'},{elemId:'arrNodeId',popGridElemNM:'NODE_ID'}],paramUserFunc:'setStNode'});
    		}
    		
    		return false;
    	}
    	
    	
    	/** 수정해야함 - 주문 고객조회 팝업 	*/
    	function tmsSearchStNode(args){
    	    
    	    var popupUrl = _CONTEXT_PATH + "/popup/listStNodePopup";
    	    var popupNm = "searchNode";
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
    	 
    		var stNodePopup = openWindowPopup(options);
    		stNodePopup.focus();		
    	}

    	    	
    	
    	/** 그리드 검색 결과 	*/
		function retrievalGrid(){
    		
			var startDepPgiDate = $("#startDepPgiDate").val();
			var endDepPgiDate = $("#endDepPgiDate").val();	
			var parameter = {
					startDepPgiDate : startDepPgiDate
				, endDepPgiDate : endDepPgiDate
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
		<h3>배차의뢰 관리</h3>
		<!-- // 제목 -->
		
			
		<!-- searchBox -->
		<div class="searchBox">
			
			<!-- blueBtn -->
			<div class="blueBtn">
				<a href="#" onclick="javascript:retrievalGrid();return false;"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_blue_search.png" alt="조회"/></a>
				<a href="#" onclick="javascript:void(0);"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_blue_save.png" title="매입매출거리저장" /></a>
			</div>
			<!-- //blueBtn -->
			
			<!-- 검색 -->
			<label>상차일자</label>
			<input type="text" class="input calendar" maxlength="8" name="startDepPgiDate" id="startDepPgiDate" style="width:90px;" /> ~ <input type="text" class="input calendar"  maxlength="8" name="endDepPgiDate" id="endDepPgiDate" style="width:90px;" />
			<label>상차지</label>
			<input type="text" alt_name="상차지"  class="input readonly" style="width:100px;" name="depNodeNm" id="depNodeNm" readonly="readonly"/>
				<a href="#" onClick="searchStNode('dep');" id="shprNmImg"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_gray_search.png" class="inputBtn" alt="검색" /></a>
			<input type="hidden" name="depNodeId" id="depNodeId" value='' class="input" style="width:90px;"/>
			<label>하차지</label>
			<input type="text" alt_name="하차지"  class="input readonly" style="width:100px;" name="arrNodeNm" id="arrNodeNm" readonly="readonly"/>
				<a href="#" onClick="searchStNode('arr');" id="shprNmImg"><img src="${_CONTEXT_PATH}/asset/images/sys/btn_gray_search.png" class="inputBtn" alt="검색" /></a>
			<input type="hidden" name="arrNodeId" id="arrNodeId" value='' class="input" style="width:90px;"/>
			<!--// 검색 -->
			
		</div>
		<!-- //searchBox -->
		
		<!-- group -->
		<div class="group">
			<div class="section">
			
				<!-- btnG -->
				<div class="btnG">
					<a href="#" onclick="javascript:void(0);" class="grayBtn"><span>주문등록</span></a>
					<a href="#" onclick="javascript:void(0);" class="grayBtn"><span>주문수정</span></a>
					<a href="#" onclick="javascript:void(0);" class="grayBtn"><span>배차계획확정</span></a>
				</div>
				<!--// btnG -->
				
				<!-- grid1 -->
				<div style="height:400px; width:99.8%; background:#eee;">
					<table id="grid1" ></table>
					<div id="pager1" ></div>
				</div>
				<!--// grid1 -->
				
			</div>
		</div>
		<!--// group -->
	

		<!-- grid2 -->
		<div class="group">
			<div class="section leftSec" style="width:100%;">		
				<div style="height:150px; width:99.8%; background:#eee;">
					<table id="grid2" ></table>
					<div id="pager2" ></div>
				</div>
			</div>
		</div>
		<!--// grid2 -->

	</div>
</div>
<!--// content -->
	
<%@ include file="/WEB-INF/jsp/common/footer.jsp" %>