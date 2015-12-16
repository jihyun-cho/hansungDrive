/*
 *	 ※ 각 코드의 작성 시점에 대한 표기
 *		- ORI : 원래 jqGrid(4.4.5)의 소스코드
 *		- FO1: FrameOne 1.0에서 추가/수정한 부분
 * 		- eHR: eHR 프로젝트를 수행하면서 추가/수정한 부분
 * 		- FO1=>eHR: FrameOne 1.0에서 작성하고 eHR에서 수정한 부분
 *		- FO2a: FrameOne 2.0a에서 추가/수정한 부분  
 */

/**
 * 	현재 row의 상태를 나타내는 상수
 */
var NORMAL	= 'N';		//조회 이후 수정하지 않은 row
var INSERT	= 'I';		//조회 이후 신규 생성한 row
var UPDATE 	= 'U';		//수정한 row
var DELETE 	= 'D';		//삭제한 row

/**
 *	그리드의 데이터를 수집할 때 수집 조건에 관한 flag 
 */
var UPDATED_ROWS 	= ':u';	//업데이트된 row들 ('I', 'U')만 선택
var ALL_ROWS 		= ':a';	//모든 row들을 선택


///////////////////////////////////////////////////////   그리드 공통 메서드 - start   //////////////////////////////////////////////////////////////

/**
 *  FrameOne에서 customizing한 jqGrid의 기본 속성 정의 (FO1=>eHR)
 */
$.extend($.jgrid.defaults, {
    
    datatype: 'local',
    editurl:'clientArray',
    mtype: 'POST',
    viewrecords: false, //그리드 우측 하단 레코드 갯수 노출 여부
    gridview: true, //true로 하면 그리드 로딩 속도가 빨라지지만  treeGrid, subGrid, or afterInsertRow event를 사용할 수 없다.
    //multiselect: false,
    //multikey:'shiftKey',
    loadtext:"",
    rowNum:40,// rows per page 기본값
    //rowList:[10,20,40,100],   // rows per page 에 대한 콤보박스 설정       
    jsonReader : {  //그리드 데이터바인딩 key 정의
        root: "data",
        page: "page",
        total: "totalPage",
        records: "totalCount",
        repeatitems: false, //각 row가 Map의 형태
        userData: "userData"
    },      
    cellEdit:true,  //cell 단위 edit를 한다. onSelectRow 이벤트는 무시됨
    foRowEditable:true, //rowEdit 모드일 때(cellEdit가 false일 때) true이면 행편집 가능, false이면 행편집 불가
    cellsubmit:'clientArray',   //cellEdit:true일 경우 saveCell() 에서 ajax요청을 보내지 않도록 설정
    shrinkToFit:true,   //true일 경우, 칼럼모델의 width보다 그리드에 맞추는 것을 우선함
    //scrollOffset:0,   //스크롤바를 강제로 없앰
    rownumbers:false, //true일 경우, 그리드 좌측에 순번 칼럼이 생성된다.
    isInitialized:false,	//그리드 생성후 단 한번만 수행하는 작업을 체크하기 위한 flag
    
    //그리드 리사이즈시 사용하는 전역변수 대용 속성들
    resizeFactor:{
        isResizableX:true, //가로방향 리사이즈 적용 여부
        isResizableY:true, //세로방향 리사이즈 적용 여부
        reOffsetY:0, //세로방향 리사이즈 offset의 합
        VPH:0, //메인화면영역의 높이 (view port height)  
        lastVPH:0 //바로 전 리사이즈 이벤트시의 메인화면영역 높이 (last viewport height)
    },
    
    //------------------------ 이벤트 핸들러 - start ----------------------------
    afterInsertRow : function(rowid, rowdata, rowelem){
        dc('call afterInsertRow');

        //---------- 행추가 후처리 - start ----------
        var grd = this, $grd = $(grd), colModel = grd.p.colModel, iRow, iCol;
        for(var i=0; i<colModel.length; i++){
            tempColModel = colModel[i]; 
            
            //editableOnlyAdd인 칼럼의 cell에 대하여 편집 가능하도록 처리한다
            ////사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음
            if(tempColModel.editableOnlyAdd /* && tempColModel.formatter != foSelectBoxFmt */){
                $('#'+rowid+' td').eq(getColIndex(colModel, tempColModel.name)).removeClass('not-editable-cell');
            }
            
            //행추가 이미지 버튼을 눌렀을때 백글운드 색을 적용
            //사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음
            if(tempColModel.editable == true || /* tempColModel.formatter == foSelectBoxFmt ||*/ tempColModel.formatter == foCheckboxFmt || tempColModel.formatter == foDateFmt || tempColModel.formatter == foPopupFmt){
                $('#'+rowid+' td').eq(getColIndex(colModel, tempColModel.name)).addClass('inputBgGrid');
            }
        }//end for
        //---------- 행추가 후처리 - end ----------
        
        execFuncIfExistInObj(this, 'customAfterInsertRow', arguments);      //사용자정의 이벤트 핸들러 실행              
    },
    
    beforeProcessing : function(data, status, xhr){
        dc('call beforeProcessing');
        execFuncIfExistInObj(this, 'customBeforeProcessing', arguments);
    },
    
    beforeRequest : function(){ //datatype이 function일 경우에는 호출되지 않는다.
        dc('call beforeRequest');
        execFuncIfExistInObj(this, 'customBeforeRequest', arguments);
    },
    
    beforeSelectRow : function(rowid, e){
        dc('call beforeSelectRow');

        //공통화 작업 하다가 중지
        //var elem = e.target;      //td가 될 수도, input이 될 수도 있다.
        //var editable = $('#'+rowid).attr("editable") || "0";
        //dc('editable:'+editable);             
        
        execFuncIfExistInObj(this, 'customBeforeSelectRow', arguments);
        
        return true;    //beforeSelectRow()의 리턴값이 false일 경우 onSelectRow()가 호출되지 않음에 주의할 것!
    },
    
    /**
     *  gridComplete가 호출되는 시점 정리 (발견하면 계속 추가)
     *  
     *      - 그리드 생성 후
     *      - afterInsertRow 후 
     */
    gridComplete : function(){
        dc('call gridComplete');
        
		//최초 1회만 실행되는 영역
        //원래 최초 1회만 실행되는 영역을 onInitGrid()에서 모두 처리하려고 했었으나,
        //수행 시점상의 문제가 있어서 어쩔 수 없이 gridComplete에서 처리해야 하는 부분이 있었음
		if(! this.p.isInitialized){

	        //최초 datatype을 local로 하여 초기로딩을 막은 후 gridComplete시점에서 datatype을 바꾼다.
	        $(this).jqGrid('setGridParam', {datatype:retrieveGridData});        
	        
	        this.p.isInitialized = true;
		}
        
        execFuncIfExistInObj(this, 'customGridComplete', arguments);
    },
    
    /**
     *	그리드 생성 직후 최초 1회만 수행되는 함수 (FO2a)
     *		- jqGrid 4.4.5 에 onInitGrid() 가 추가되었기에 override함.
     *		- 함수 내용의 대부분은 eHR에서 작성
     */
    onInitGrid : function(){
    	dc('call onInitGrid');

    	var grd = this, gp = grd.p, cm = gp.colModel, $grd = $(grd), grdId = grd.id;
    	
        // Page Input Box Readonly 설정.(2012/06/20)
        $('.ui-pg-input').attr('readonly',true);

        //--------------- 리사이즈 바인딩 영역 - start --------------- 
        
        var $window =$(window), 
        rf = gp.resizeFactor,
        initW = gp.width, //최초 그리드 생성시 width
        initH = gp.height; //최초 그리드 생성시 height
        rf['initW'] = initW;
        rf['initH'] = initH;
        rf['lastW'] = initW; //리사이즈 직전의 그리드 width
        //dc('@ 최초 그리드 width: '+initW+', height: '+initH);

        //직전 리사이즈시 viewport(window)의 width, height (리사이즈시 계속 갱신)
        rf['lastVPW'] = $window.width();            
        rf['lastVPH'] = $window.height(); 
        
        //리사이즈 이벤트 스로틀링 임계치 (millisecond)
        var delay = 600; 

        //현재 그리드가 존재하는 페이지에서 jQuery dialog 팝업이 떴는데, 그 안에도 그리드가 존재했다가 팝업이 닫혔을 경우,
        //현재 존재하지 않는 팝업 내에 있던 그리드에 대한 리사이즈를 시도해서 에러를 발생시키기 때문에 막았음.
        var $gbox = $('#gbox_' + grdId);
        if($gbox.length == 0){ return false; }              

        //---------- 리사이즈 이벤트 바인딩 - start ------------
        $window.resize($.throttle(delay, function(){ //jQuery throttle
            
            //iPad, iPhone의 safari에서 그리드 리사이즈 무한루프가 발생하여 계속 width가 증가하는 현상이 있어서,
            //초기 리사이즈만 수행하고 이후 리사이즈는 막기로 한다. (어차피 모바일 기기에서 브라우저의 리사이즈는 없으므로)
            var isMacMobile = /(Mac\sOS\sX)(.*)(Mobile)/gi.test(navigator.userAgent);
            dc('@ isMacMobile: '+isMacMobile);
            if(isMacMobile){ 
                dc('@ Mac OS의 Mobile Browser 에서는 그리드 리사이즈를 사용하지 않습니다.');
                return; 
            }
            
            setTimeout(function(){ resizeGridHorizontal(grd); }, 0);                    //가로 리사이즈 (1차)          
            setTimeout(function(){ resizeGridVertical(grd); }, ((delay/3)*1));  //세로 리사이즈
            setTimeout(function(){ resizeGridHorizontal(grd); }, ((delay/3)*2));    //가로 리사이즈 (2차)
        }));
        //---------- 리사이즈 이벤트 바인딩 - end ------------
        //--------------- 리사이즈 바인딩 영역 - end ----------------
        
        //--------------- 화면 요건을 판단하여 초기 리사이즈 실행 - start ----------------
        setTimeout(function(){ resizeGridHorizontalInitially(grd); }, 0);                   //가로 리사이즈 (1차)
        setTimeout(function(){ resizeGridVerticalInitially(grd); }, ((delay/3)*1));     //세로 리사이즈
        setTimeout(function(){ resizeGridHorizontalInitially(grd); }, ((delay/3)*2));   //가로 리사이즈 (2차) - 이 코드는 필요없을 지도 모르지만 리사이즈의 안정성을 위해 넣었다.  
        //--------------- 화면 요건을 판단하여 초기 리사이즈 실행 - end ----------------                     
        
        //--------------- 그리드 컬럼 필수값 표시 - start ---------------
        for(var i=0; i<cm.length; i++){
            var c = cm[i], cv = c.valid_rules;
            if(cv && cv.required){ //필수일 경우
                $('#jqgh_' + grd.id + '_' + c.name, $gbox).addClass('reqitem'); //필수값을 시각적으로 구분하기 위해 css 클래스를 삽입.
            }
        }           
        //--------------- 그리드 컬럼 필수값 표시 - end ---------------
        
        //shrinkToFit true일때 그리드 가로 스크롤이 생기는 현상에 대해서 처리
        if(gp.shrinkToFit){
            $('.ui-jqgrid-bdiv', $gbox).css({'overflow-x':'hidden', 'overflow-y':'auto'});
        }
        
        //그리드에서 TAB을 클릭시 포커스가 URL로 옮겨지는 현상에 대해서 처리
        $('#'+grd.id).attr({'tabindex':'-1'});
        
        //그리드 생성 후 각 페이지에서 최초 1회만 실행할 로직이 있는 경우를 위한 확장포인트 (FO2a)
        execFuncIfExistInObj(this, 'customOnInitGrid', arguments);
    },
    
    loadBeforeSend : function(xhr, settings){
        dc('call loadBeforeSend');
        execFuncIfExistInObj(this, 'customLoadBeforeSend', arguments);
    },
    
    //조회 결과를 받고 그리드에 출력하기 전 시점에 호출
    beforeLoadComplete : function(data){
        dc('call beforeLoadComplete');
        
        var    grd = this,
              $grd = $(this),
          colModel = grd.p.colModel, tempColModel;
        
        //그리드에서 입력할수 있는 셀에 사용자가 직관적으로 알아 볼수 있도록 셀 백그라운드 색을 설정함
        if( $(this).jqGrid('getGridParam','cellEdit') == true){
            for(var i=0; i<colModel.length; i++){
                tempColModel = colModel[i]; 
                //alert(tempColModel.name +" "+tempColModel.editable);

                if( tempColModel.editable == true || 
                		
                		//사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음
                        (tempColModel.editable == false && (/*tempColModel.formatter == foSelectBoxFmt ||*/ tempColModel.formatter == foCheckboxFmt) )){ 
                    $grd.setColProp(tempColModel.name,{classes:'inputBgGrid'});
                }
                
            }
        }
        
        execFuncIfExistInObj(this, 'customBeforeLoadComplete', arguments);
    },
    
    loadComplete : function(data){
        dc('call loadComplete');
        
        // 2013-01-25 => 그리드 공통 loadComplete Event 처리 fucntion 호출
        // 여러개 그리드를 동시에 조회한 경우 loadComplete event가 공통에서 자동 처리 되지 않는 경우
        // 각자 그리드에서 사용할 수 있도록 function으로 만듬.
        commonGridLoadComplte(this); 
        
        execFuncIfExistInObj(this, 'customLoadComplete', arguments);
    },          
    
    loadError : function(xhr, status, error){
        dc('call loadError');
        execFuncIfExistInObj(this, 'customLoadError', arguments);
    },
    
    onCellSelect : function(rowid, iCol, cellcontent, e){
        dc('call onCellSelect');
        execFuncIfExistInObj(this, 'customOnCellSelect', arguments);
    },
    
    ondblClickRow : function(rowid, iRow, iCol, e){
        dc('call ondblClickRow');
        execFuncIfExistInObj(this, 'customOndblClickRow', arguments);
    },
    
    onHeaderClick : function(gridstate){
        dc('call onHeaderClick');
        execFuncIfExistInObj(this, 'customOnHeaderClick', arguments);
    }, 
    
    //페이징 버튼 클릭시 - 최근 조회 파라미터 자동 유지
    onPaging : function(pgButton){
        dc('call onPaging');

        //그리드 정보 파라미터 전달
        //주의! - 여기서 postData에 추가한 파라미터들은 retrieveGridData()의 complete콜백에서 반드시 삭제해 주어야 한다.
        var grd = this, p = grd.p, postData = p.postData;
        $.extend(postData, {gridId:grd.id, gridDsNm:p.dataset});
        
        postData.DO_COUNTTOT = "false"; //페이징 쿼리 수행 안함
        
        var ret = execFuncIfExistInObj(this, 'customOnPaging', arguments);
        return ret;
    },
    
    onRightClickRow : function(rowid, iRow, iCol, e){
        dc('call onRightClickRow');
        execFuncIfExistInObj(this, 'customOnRightClickRow', arguments);
    },

    onSelectAll : function(aRowids, status){
        dc('call onSelectAll');
        execFuncIfExistInObj(this, 'customOnSelectAll', arguments);
    },
    
    //row를 마우스로 select할 때마다 toggle 처리. 그리드 속성 cellEdit가 true일 경우에는 호출되지 않는다.
    onSelectRow : function(rowId, status){
        dc('call onSelectRow');
        execFuncIfExistInObj(this, 'customOnSelectRow', arguments);
    },
    
    //헤더 컬럼 클릭시 (sort) - 최근 조회 파라미터 자동 유지
    onSortCol : function(index, iCol, sortorder){
        dc('call onSortCol('+index+', '+iCol+', '+sortorder+')');
        
        //그리드 정보 파라미터 전달
        //주의! - 여기서 postData에 추가한 파라미터들은 retrieveGridData()의 complete콜백에서 반드시 삭제해 주어야 한다.
        var grd = this, $grd = $(grd) , p = grd.p, postData = p.postData;
        $.extend(postData, {gridId:grd.id, gridDsNm:p.dataset});
        
        postData.DO_COUNTTOT = "false"; //페이징 쿼리 수행 안함
        
        //현재 그리드에 조회된 행이 없을 경우에는 수행 안함.
        if($grd.jqGrid('getMatchedStateRowCnt', NORMAL) === 0){ return 'stop'; }
        
        return execFuncIfExistInObj(this, 'customOnSortCol', arguments);
    },
    
    resizeStart : function(event, index){
        dc('call resizeStart');
        execFuncIfExistInObj(this, 'customResizeStart', arguments);
    },
    
    resizeStop : function(newwidth, index){
        dc('call resizeStop');
        execFuncIfExistInObj(this, 'customResizeStop', arguments);
    }, 
    
    serializeGridData : function(){
        dc('call serializeGridData');
        execFuncIfExistInObj(this, 'customSerializeGridData', arguments);
    },
    //------------------------ 이벤트 핸들러 - end ----------------------------           
    
    //--------- Cell 전용 이벤트 핸들러 (cellSubmit:'clientArray'일 경우)- start --------------        
    formatCell : function(rowid, cellname, value, iRow, iCol){
        dc('call formatCell');
        execFuncIfExistInObj(this, 'customFormatCell', arguments);
    },
    
    beforeEditCell : function(rowid, cellname, value, iRow, iCol){
        dc('call beforeEditCell');
        execFuncIfExistInObj(this, 'customBeforeEditCell', arguments);
    },
    
    onSelectCell : function(rowid, celname, value, iRow, iCol){ //used only for noneditable cels
        dc('call onSelectCell');
        execFuncIfExistInObj(this, 'customOnSelectCell', arguments);
    },
    
    afterEditCell : function(rowid, cellname, value, iRow, iCol){
        dc('call afterEditCell');
        // 그리드 Edit Box 설정 (날짜형, 숫자형 입력 설정) 
        setCommonEditCell(this, rowid, cellname, value, iRow, iCol);
        
        execFuncIfExistInObj(this, 'customAfterEditCell', arguments);
        
    },
    
    beforeSaveCell : function(rowid, cellname, value, iRow, iCol){
        dc('call beforeSaveCell');
        //execFuncIfExistInObj(this, 'customBeforeSaveCell', arguments); //return을 줘야 하므로 gridCellValidation 에서 호출하도록 변경함. 
        return gridCellValidation(this, rowid, cellname, value, iRow, iCol); 
    },
    
    beforeSubmitCell : function(rowid, cellname, value, iRow, iCol){
        dc('call beforeSubmitCell');
        execFuncIfExistInObj(this, 'customBeforeSubmitCell', arguments);
    },          

    afterSaveCell : function(rowid, cellname, value, iRow, iCol){
        dc('call afterSaveCell');
        execFuncIfExistInObj(this, 'customAfterSaveCell', arguments);
    }           
    //--------- Cell 전용 이벤트 핸들러 (cellSubmit:'clientArray'일 경우)- end --------------      
    
    //TODO : local sorting 구현여부 타진
});


/**
 *   MIN_WIDTH_VIEWPORT 값에서 body의 margin을 제외한 폭을 리턴한다. (eHR)
 */
function getBodyMinWidth(){
    dc('@ 그리드의 width를 MIN_WIDTH_VIEWPORT 기준으로(body margin 제외) 맞춘다.');
    var $bd = $('body'), lMgn = $bd.css('margin-left'), rMgn = $bd.css('margin-right'),
    lMgnNum = foParseInt(lMgn.substring(0, lMgn.indexOf('px'))), 
    rMgnNum = foParseInt(rMgn.substring(0, rMgn.indexOf('px'))), 
    bodyMinWidth = MIN_WIDTH_VIEWPORT - (lMgnNum + rMgnNum);                            
    dc('@ bodyMinWidth('+bodyMinWidth+') = MIN_WIDTH_VIEWPORT('+MIN_WIDTH_VIEWPORT+') - (body left margin('+lMgnNum+') + body right margin('+rMgnNum+'))');
    return bodyMinWidth; 
}


/**
 *  그리드의 "초기" 가로 리사이즈를 수행한다. (eHR) 
 *      - 그리드의 크기가 커서 화면을 벗어나는 일이 발생하지 않게 하기 위해 사용. 
 *      - 그리드 생성 후 처음에만 호출되고 이후에는 호출되지 않는다.
 *      - 부모 엘리먼트의 width에 그리드의 width를 맞춘다.
 */
function resizeGridHorizontalInitially(gridObj){
    
    var grd = gridObj, $grd = $(grd), rf = grd.p.resizeFactor, $gbox = $('#gbox_' + grd.id);    
    
    if(rf.isResizableX){
        dc('\n------------- '+grd.id+' "초기" 가로 리사이즈 - start --------------');
        
        var $wRef = rf.refId ? $('#'+rf.refId) : $gbox.parent(), //width 참조 대상 
        newGW = $wRef.innerWidth(), curVPW = $(window).width();
        dc('@ curVPW: '+curVPW+', MIN_WIDTH_VIEWPORT: '+MIN_WIDTH_VIEWPORT);
        
        //현재 viewport의 width가 MIN_WIDTH_VIEWPORT보다 작을 경우 그리드가 축소되는 것에 대한 제한을 걸어야 하는데,
        if(curVPW < MIN_WIDTH_VIEWPORT){

            //그리드의 width 참조 대상 엘리먼트가 body라면(그리드가 가로로 꽉 차게 하나 배열된 상태라면) 
            //그리드의 width를 MIN_WIDTH_VIEWPORT 기준으로(body margin 제외) 맞춘다.
            if($wRef.prop('tagName').toUpperCase() === 'BODY'){
                newGW = getBodyMinWidth();
            
            //그리드의 width 참조 대상 엘리먼트가 body가 아닐 경우 (ex: table 안에 들어가 있는 경우),
            }else{
                //그리드 생성시 따로 정해놓은 최소 width 상수 (resizeFactor.minWidth)가 있을 경우에 해당 값으로 width를 설정한다.   
                if(rf.minWidth){
                    dc('@ 그리드 생성시 지정한 최소 width('+rf.minWidth+') 적용');
                    newGW = rf.minWidth;
                }
            }
        }
        
        dc('@ '+grd.id+' 의 "초기" 리사이즈(가로방향) - width 참조 대상 엘리먼트 ('+$wRef[0].tagName+', width: '+$wRef.innerWidth()+'), 그리드에 새로 설정할 width: '+newGW);
        $grd.jqGrid('setGridWidth' ,newGW); //resize
//      rf['initW'] = newGW;
        rf['lastW'] = newGW;
        dc('------------- '+grd.id+' "초기" 가로 리사이즈 - end ---------------\n');
    }   
    
}


/**
 *  그리드의 "초기" 세로 리사이즈를 수행한다. (eHR)
 *      - 1024x768 화면 기준으로 viewport의 정상적인 height를 제시한 상수(MIN_HEIGHT_VIEWPORT)를 기준으로 현재 높이와의 차를 계산하여 그 차만큼 초기 리사이즈를 수행한다.
 */
function resizeGridVerticalInitially(gridObj){

    var grd = gridObj, $grd = $(grd), rf = grd.p.resizeFactor, initH = rf.initH;
    
    if(rf.isResizableY){
        if( ! isNaN(initH)){
            dc('\n------------- '+grd.id+' "초기" 세로 리사이즈 - start --------------');
            
            var winH = $(window).height(), 
            sh = rf.standardHeight, //1024기준에서 컨텐츠가 아래로 넘치는 화면의 경우, MIN_HEIGHT_VIEWPORT을 대체할 값을 지정하여, 큰 화면에서 열었을 때 그리드의 height가 비정상적으로 커지지 않도록 한다. 
            offsetH = winH - (sh ? sh : MIN_HEIGHT_VIEWPORT),
            newGH = initH + offsetH;
            
            //새로 계산된 height가 최초 그리드 생성시 지정한 height보다 작으면 초기 height만큼만 리사이즈한다. (그리드가 눌리지 않도록)
            var offsetIgnored = 0; 
            if(newGH < initH){ 
                offsetIgnored = newGH - initH; //줄어들 때 반영되지 못한 offset을 이후에 반영해 주어야 오차가 없다.
                dc('세로 리사이즈 축소시 최초 그리드 높이를 유지해 주기 위해 무시된 offset: '+offsetIgnored);
                newGH = initH;
            }
            rf.reOffsetY = offsetIgnored;   //초기화
            
            dc('@ 초기 그리드('+grd.id+')의 높이 : '+initH);
            dc('@ offsetH('+offsetH+') = winH('+winH+') - MIN_HEIGHT_VIEWPORT('+MIN_HEIGHT_VIEWPORT+')');
            dc('@ 새로 설정할 height (초기 그리드 높이 + offsetH) = '+newGH);
            $grd.jqGrid('setGridHeight', newGH); //resize
            dc('------------- '+grd.id+' "초기" 세로 리사이즈 - end ---------------\n');
        }               
    }
}


/**
 *  그리드의 가로 리사이즈를 수행한다. (eHR)
 *      - 부모 엘리먼트의 width에 그리드의 width를 맞춘다.
 */
function resizeGridHorizontal(gridObj){
    
    var grd = gridObj, $grd = $(grd), rf = grd.p.resizeFactor, $gbox = $('#gbox_' + grd.id);

    if(rf.isResizableX){
        
        var curVPW = $(window).width(); //현재 메인프레임 width
        dc('@ curVPW: '+curVPW);
        
        //실제 viewport의 전후 width를 비교하여 차이가 있을 때에만 리사이즈를 수행한다.
        if(rf.lastVPW !== curVPW){
            dc('\n------------- '+grd.id+' 이벤트 가로 리사이즈 - start --------------');
            
            //참조용 엘리먼트의 크기에 맞춘다
            var $wRef = rf.refId ? $('#'+rf.refId) : $gbox.parent(), //width 참조 대상
                  newGW = $wRef.innerWidth();
            
            //현재 메인프레임의 width가 MIN_WIDTH_VIEWPORT보다 작을 경우 그리드가 축소되는 것에 대한 제한을 걸어야 하는데,
            if(curVPW < MIN_WIDTH_VIEWPORT){

                //그리드의 width 참조 대상 엘리먼트가 body라면(그리드가 가로로 꽉 차게 하나 배열된 상태라면) 
                //그리드의 width를 MIN_WIDTH_VIEWPORT 기준으로(body margin 제외) 맞춘다.
                if($wRef.prop('tagName') === 'BODY'){
                    newGW = getBodyMinWidth();                                          

                //그리드의 width 참조 대상 엘리먼트가 body가 아닐 경우 (ex: table 안에 들어가 있는 경우),  
                }else{
                    
                    //그리드를 갑자기 줄이는 경우 : 급격히 최소화할 때 => 그리드 생성시 따로 정해놓은 최소 width 상수 (resizeFactor.minWidth)가 있을 경우에 해당 값으로 width를 설정
                    var SHRINK_WIDTH_THRESHOLD = 200, //급격함을 판단하는 경계값
                    widthDiffer = rf.lastW - newGW; //이번 턴의 리사이즈에서 줄어든 width
                    dc('@ widthDiffer: '+widthDiffer+', SHRINK_WIDTH_THRESHOLD');
                    
                    if(widthDiffer > SHRINK_WIDTH_THRESHOLD){ //한 번의 리사이즈 스로틀링에서 특정 값 이상 줄이면 급격히 줄이는 것으로 판단하자.
                        if(rf.minWidth){
                            dc('@ 그리드 생성시 지정한 최소 width('+rf.minWidth+') 적용');
                            newGW = rf.minWidth;
                        }                       
                        
                    //일반적인 경우: 천천히 리사이즈 => 직전 그리드 width 적용
                    }else{
                        dc('@ 직전 그리드 width('+rf.lastW+') 적용');
                        newGW = rf.lastW; 
                    }
                    
                }
            }
            
            dc('@ 그리드 리사이즈(가로방향) - '+ grd.id + '의 width 참조 대상 엘리먼트 ('+$wRef[0].tagName+', width: '+$wRef.innerWidth()+')');
            dc(grd.id+ '에 새로 설정할 width: '+newGW);
            
            $grd.jqGrid('setGridWidth' ,newGW); //resize
            rf['lastW'] = newGW;
            
            //eHR에서 억지로 jqGrid의 버그(헤더칼럼 병합시 헤더와 내용의 열이 어긋남)을 보정하였으나, FrameOne2.0a에서는 보정하는 기능을 제외한다.
            // 병합 칼럼이 존재하고 shrinkToFit이 true일 경우, 헤더(제목줄)의 리사이즈 이상현상에 대한 보정
            resizeGroupHeader($grd); //병합 칼럼이 존재하고 shrinkToFit이 true일 경우, 헤더(제목줄)의 리사이즈 이상현상에 대한 보정
            
            rf['lastVPW'] = curVPW;
            dc('------------- '+grd.id+' 이벤트 가로 리사이즈 - end ---------------\n');
        }
        
    }

}


/**
 *  그리드의 세로 리사이즈를 수행한다. (eHR)
 *      - 현재 window의 height를 기준으로, window가 늘어나거나 줄어든 만큼의 offset을 그리드의 height에 더하거나 빼 준다.
 */
function resizeGridVertical(gridObj){
    
    var grd = gridObj, $grd = $(grd), gp = grd.p, rf = gp.resizeFactor, initH = rf.initH;
    
    var curVPH = $(window).height(); //현재 메인프레임 height
    dc('@ curVPH: '+curVPH);
    
    rf['VPH'] = curVPH; //메인 영역을 리사이즈 최소 임계치와 비교함
    var newReOffsetY = rf.reOffsetY + (rf.VPH - rf.lastVPH); //reOffsetY에 스로틀 전까지의 변경내역을 누적하여 기록한다. 
    dc(grd.id + '의 newReOffsetY('+newReOffsetY+') = rf.reOffsetY('+rf.reOffsetY+') + (rf.VPH('+rf.VPH+') - rf.lastVPH('+rf.lastVPH+'))');
    rf['reOffsetY'] = newReOffsetY; 
    
    //세로방향으로 리사이즈 하도록 설정되어 있으면 실행
    if(rf.isResizableY){
        
        //그리드의 height가 %로 설정되어 있는 경우, 내용에 따라 자동적으로 height가 증가하며, 계산이 불가하므로 리사이즈를 skip한다.
        dc('gp.height: '+gp.height+', type: '+typeof(gp.height)+', isNan: '+isNaN(gp.height));
        if( ! isNaN(initH)){
            dc('\n------------- '+grd.id+' 이벤트 세로 리사이즈 - start --------------');

            var rFIn = gp.resizeFactor, 
            curGH = gp.height,  
            newGH = curGH + rFIn.reOffsetY;
            
            //새로 계산된 height가 최초 그리드 생성시 지정한 height보다 작으면 초기 height만큼만 리사이즈한다.
            var offsetIgnored = 0; 
            if(newGH < initH){ 
                offsetIgnored = newGH - initH; //줄어들 때 반영되지 못한 offset을 이후에 반영해 주어야 오차가 없다.
                dc('세로 리사이즈 축소시 최초 그리드 높이를 유지해 주기 위해 무시된 offset: '+offsetIgnored);
                newGH = initH;
            }                           
            dc(grd.id+ '에 새로 설정할 height: '+newGH);
            $grd.jqGrid('setGridHeight', newGH); //resize
            rFIn.reOffsetY = offsetIgnored; //초기화                       
            dc('rFIn.reOffsetY가 '+offsetIgnored+'으로 초기화 됨');
            dc('------------- '+grd.id+' 이벤트 세로 리사이즈 - end ---------------\n');
        }
    }               
    
    rf['lastVPH'] = rf.VPH;
    dc(grd.id + '의 갱신된 lastVPH : '+rf.lastVPH+'\n');
}


/**
 *  그리드 공통 onLoadComplte Event 처리 (eHR)
 */
function commonGridLoadComplte(grd){

    //---------- colModel의 editableOnlyAdd가 true인 칼럼의 cell에 한해서 편집 불가능하게 막는다. - start ----------
    //editableOnlyAdd가 true인 칼럼의 cell에 한해서 addClass('not-editable-cell') 처리를 하여 editable을 막는다.
        var $grd = $(grd),
          colModel = grd.p.colModel,
          tempColModel;
    
    for(var i=0; i<colModel.length; i++){
        tempColModel = colModel[i]; 

        // 2012.10.10 수정 => foSelectBoxFmt를 사용할 경우는 editable 제외(항상 not-editable-cell 이어야함) 
        if(tempColModel.editableOnlyAdd /* && tempColModel.formatter != foSelectBoxFmt */){
            tempColModel.editable = true;   //일단 editable은 무조건 true여야 편집을 하건 막건 할 수 있다.
            //각 tr의 루프를 돌면서 인덱스 i번째 cell에 addClass('not-editable-cell') 처리함.
            $('tr.jqgrow', grd).each(function(){
                $('td', this).each(function(idx){
                    if(i == idx){
                        $(this).addClass('not-editable-cell');
                    }
                });
            });
        }
    }
    //---------- colModel의 editableOnlyAdd가 true인 칼럼의 cell에 한해서 편집 불가능하게 막는다. - end ----------

    // 2013-01-18 수정 => Safari에서 shirnkToFit=true 일 경우 해상도에 따라 
    // 가로 스크롤바가 생기는 현상이 발생하여 Safari의 경우 overflow-x:hidden 처리
    // 2013-05-14 주석처리 => 아래의 if 조건을 만족시킬 경우, 이 코드가 그리드를 조회할 때 마다 그리드의 width를 조금씩 줄이는 버그를 발생시키기 때문에 주석처리 함.
    /*
    var shrink = grd.p.shrinkToFit;
    var app_version = navigator.userAgent.toUpperCase();
    if((app_version.indexOf('SAFARI') != -1 || app_version.indexOf('CHROME') != -1 || app_version.indexOf('FIREFOX') != -1 || app_version.indexOf('OPERA') != -1) && shrink == true && grd.p.height == "100%") { 
        $(".ui-jqgrid-bdiv", '#gbox_'+$grd[0].id).css({'margin':'0em', 'padding':'0', 'overflow-x':'hidden'});
        $("#"+$grd[0].id).jqGrid('setGridWidth' ,grd.p.width-8);
    }
    */
}


/**
 * FrameOne에서 기본적으로 정의한 addRowParams와 사용자정의 addRowParams을 병합한 속성을 리턴한다. (FO1)
 * @param param 사용자정의 addRowParams
 * @returns 병합된 addRowParams
 */
function getAddRowParams(params){
    var ret = {};
    //var rownumForId = $grid1.jqGrid('getGridParam', 'reccount') + 1;  //add용 rowId 생성
    var defaultParams = {
            //rowID : rownumForId,  //grid속성에 idPrefix가 존재하면 자동으로 적용되기 때문에 여기서 idPrefix를 주면 안된다.
            //initdata : {invid:'100', invdate:'2012-03-15', tax:2000, total:50000, note:'test', rowStatus:'a'},
            initdata : {},
            position :"last",
            useDefValues : false,
            useFormatter : false,
            addRowParams : {extraparam:{}}          
        };
    
    $.extend(true, ret, defaultParams, params);
    
    return ret;
}


/**
 *  그리드 조회 함수 (FO1=>eHR)
 *      - jqGrid의 datatype 속성으로 지정되는 함수
 */
function retrieveGridData(postData){
    //dc('call retrieveGridData');
    
    //콜백함수를 추출하여 별도의 변수에 할당
    var callback = postData.pCall; 
    delete postData.pCall;  //조회시 설정한 콜백함수를 paging에서도 사용하기 위해 delete하지 않으려고 했으나... 
    //그러나 delete를 하지 않으니 postData가 ajax data로 넘어갈 때 콜백함수가 그 요소에 포함되어 있으므로 미리 호출되어 버리는 문제가 발생했다.
    //callback 함수를 일단 delete 한 후 complete에서 다시 postData에 넣어서 유지하도록 하자!
    
    //사용자입력 파라미터 추출 및 postData에 병합
    $.extend(true, postData, postData.param);
    delete postData.param;
    
    var gridId = this.id,
          $gridObj = $('#'+gridId),
          url = $gridObj.jqGrid('getGridParam', 'url');
          //page = postData['page'],
          //rowsPerPage = $gridObj.jqGrid('getGridParam', 'rowNum')
    
    $.ajax({
        url:url,
        data:postData,
        dataType:'json',
        beforeSend : function(jqXHR, settings){
            //dc("retrieveGridData() beforeSend : " + jqXHR);
            openLoadingImage({pLoad: true});    //로딩이미지 노출
        },
        complete : function(jqXHR, textStatus){
//          dc("grid loading complete : " + jqXHR.responseText);
            
            closeLoadingImage();    //로딩이미지 닫기
            
            var returnData = JSON.parse(jqXHR.responseText);

            $gridObj.get(0).p.beforeLoadComplete.call($gridObj.get(0), returnData);

            //ajax 응답객체로부터 수행결과코드 및 출력해 주어야할 메세지를 선별하여 리턴.
            var retMsg = getReturnMsg(returnData);
            
            //그리드 데이터 삭제
            $gridObj.jqGrid('clearGridData');
            
            //결과가 성공일 경우 그리드의 데이터를 갱신한다.
            if(retMsg.errCd == ERR_CD_SUCCESS){ 

                $gridObj.jqGrid('bindGridData', returnData);

                //사용자정의 콜백함수 수행
                if($.isFunction(callback)){             
                    callback(postData.svcId, returnData, retMsg.errCd, retMsg.msgTp, retMsg.msgCd, retMsg.msgText);
                    postData.pCall = callback;  //callbak을 다시 postData에 넣어주자
                }
                
            }//end success
            
            //loadComplete() 수행
            //printObj($gridObj.get(0).p);
            
            //datatype이 function일 경우 그리드 속성 loadComplete가 자동으로 호출되지 않으므로 여기서 직접 호출해 주었다.
            $gridObj.get(0).p.loadComplete.call($gridObj.get(0), returnData);   //호출자를 그리드객체로 하여 호출

            //선별된 메세지를 타입에 맞추어 출력(alert or footer출력 등)
            outMessage(retMsg);
            
            //세션 만료시 : 권한없음 에러코드일 경우 에러페이지로 페이지 이동 ERR_CD_NO_AUTH : -10
            if(retMsg.errCd == ERR_CD_NO_AUTH){
                dc("ERR_CD_NO_AUTH: " +ERR_CD_NO_AUTH);
                goSessionExpiredPage({alert:false}); //outMessage()에서 alert처리를 하므로 false로 셋팅
            }
            
            //onPaging콜백에서 추가한 파라미터 삭제
            delete postData.gridId;
            delete postData.gridDsNm;
        
            //eHR에서 억지로 jqGrid의 버그(헤더칼럼 병합시 헤더와 내용의 열이 어긋남)을 보정하였으나, FrameOne2.0a에서는 보정하는 기능을 제외한다.
            // 병합 칼럼이 존재하고 shrinkToFit이 true일 경우, 헤더(제목줄)의 리사이즈 이상현상에 대한 보정
            resizeGroupHeader($gridObj);
        }
    });
}


/**
 *  데이터 조회 이후 특정 브라우저에서 세로 스크롤바가 생기지 않는 문제점을 강제적으로 해결한 함수 (eHR)
 *      - overflow:auto가 자동으로 적용되어야 하는데 그리드를 클릭해야만 적용되기 때문에 상태 갱신을 위해서 overflow를 hidden으로 한 직후 auto로 전환해 주었다.
 *      - 이상 현상을 보이는 브라우저 목록 : IE8 
 */
function showHiddenScrollbar(gridId){
    //dc('navigator.appVersion : '+navigator.appVersion);
    if(navigator.appVersion.indexOf('MSIE 8.0') >= 0){ //예외 브라우저 목록
        $('.ui-jqgrid-bdiv', '#gbox_'+gridId).css('overflow', 'hidden').css('overflow', 'auto');
    }
}


/**
 * 	jqGrid colModel객체와 칼럼명을 받아서, 해당 칼럼명이 몇 번째 인덱스인지 반환한다. (FO1)
 * 		- multiselect:true등의 옵션으로 체크박스 td가 호출된다 해도 colModel에도 반영되기 때문에 인덱스 추출에는 문제가 없다.
 * @param colName
 * @return colIndexNo
 */		
function getColIndex(jqGridColModel, colName){
	var colIndexNo = null;
	var name = null;
	for(var i=0; i<jqGridColModel.length; i++){
		name = jqGridColModel[i].name;
		if(name === colName){
			colIndexNo = i;
			//dc('## getColIndex() > name : '+name+', colIndexNo : '+colIndexNo);
			break;
		}
	}
	return colIndexNo;
}


/**
 *  그리드 팝업 버튼 클릭 (FO1)
 */
function gridPopupBtnOnClick(grdId, rowId, sColName, userFunc){
	
	var $grd = $("#"+grdId);
    var idxRow    = $grd.jqGrid('getInd', rowId);
    var cellObjNm = "#" + idxRow + "_" + sColName; 
    var iColIdx   = getColIndex($grd.jqGrid('getGridParam', 'colModel'), sColName); 

    $grd.jqGrid("editCell",idxRow, iColIdx, true);
    
    // 그리드 팝업 Function 호출 
    var fn_user = eval(userFunc); 
    if($.isFunction(fn_user)){
        fn_user(grdId, rowId, sColName, idxRow, 'POP');       
    }
}


/**
 *  FrameOne jqGrid date formatter (FO1=>eHR)
 *      - Ymd형식 => Y-m-d 형식으로 변환
 *      - Ymd 형식의 경우 jqGrid 내장 formatter로 해결할 수 없기에 정의함.
 *      - date.js의 DATE_DELIMETER 상수에 종속성을 갖고 있다.
 */
function foDateFmt(cellvalue, opts, rwdat, _act){
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
    
    var strParam    =  '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name +'\"';
    var addImg =  "";

    // Footer Row일 경우 rowid가 없음.
    // Footer의 경우 Select Box를 그리지 않음.
    if(opts.rowId == "") {
        return cellvalue;
    }
    
    var showbtn_always = false;
    //if(!$.fmatter.isUndefined(opts.colModel.formatoptions) && !$.fmatter.isUndefined(opts.colModel.formatoptions.showbtn_always) ) {
   	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.showbtn_always !== undefined) {
        showbtn_always = opts.colModel.formatoptions.showbtn_always;
    }
    
    // 입력 가능한 컬럼일 경우만 달력버튼 삽입 
    var dateType = 'DAY';
    if($(this).jqGrid('getGridParam','cellEdit') && 
            ( opts.colModel.editable || opts.colModel.editableOnlyAdd || showbtn_always ) ) 
    {
        
        // 달력 버튼을 Enable/Disable여부(Default값은 true)
        // 달력 버튼을 Row별로 값을 체크하여 Enable/Disable 시켜야 할 경우에 사용.
        var yn_enable = true; 
        if( typeof(foUserDatePopupEnable) != "undefined"  && $.isFunction(foUserDatePopupEnable)){
            yn_enable = foUserDatePopupEnable(cellvalue, opts, rwdat, _act);
        }
        
        var img_src   = CONST.IMG_PATH_CAL;
        var btn_style = "style='cursor:pointer; float:right;' "; 
        if( yn_enable == false || (opts.colModel.editableOnlyAdd && _act == 'add') ) {
            //입력 불가능한 Cell일 경우
            btn_style = "style='float:right;' disabled ";
            img_src   = CONST.IMG_PATH_CAL_DIS;
        }

        // 2012/12/11 수정 => date_type 옵션 추가(월 달력 옵션) 
        //if(!$.fmatter.isUndefined(opts.colModel.formatoptions) && !$.fmatter.isUndefined(opts.colModel.formatoptions.date_type) ) {
       	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.date_type !== undefined) {
            dateType = opts.colModel.formatoptions.date_type;
        }
        addImg = "<img src='" + img_src + "' tabindx: '-1' onClick='datePickerBtnOnClick("+ strParam +", \"" + dateType +  "\");' " +  btn_style + " />"; 
    }

    //현재 포맷이 Y-m-d 인지 체크 
    var regex   = /^\d{4}-\d{2}-\d{2}$/; //Y-m-d 포맷 
    
    // 일자입력 최대길이 
    var max_len = 8;
    if(dateType == 'MONTH') {
        // 월입력 Format일 경우 
        max_len = 6;
        regex   = /^\d{4}-\d{2}$/;       //Y-m 포맷 
    }

    var newDate = ""; 
    if(cellvalue == null || cellvalue.length < max_len){
        newDate = "";
    }else if(regex.test(cellvalue)){
        // 현재 포맷이 Y-m-d 이면 그대로 리턴한다.
        newDate =  cellvalue; 
    }else{
        cellvalue = cellvalue +"";

        if(dateType == 'MONTH') {
            var y = cellvalue.substring(0,4);
            var m = cellvalue.substring(4,6);
            newDate = String(y)+'-'+String(m);  //Y-m 형식 
        }else {
            var y = cellvalue.substring(0,4);
            var m = cellvalue.substring(4,6);
            var d = cellvalue.substring(6,8);
            newDate = String(y)+'-'+String(m)+'-'+String(d);    //Y-m-d 형식
        }
    }
    
    // 날짜형 값이 없을 경우  return
    return  addImg + newDate ;
}


/**
 * 	FrameOne jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymd형식으로 변환
 */
function foDateUnfmt(cellvalue, opts, cellObj){
	var ret = cellvalue.replace(/-/g, '');	//하이픈 제거
	return ret;
}


/**
 *  FrameOne jqGrid Popup formatter (FO1=>eHR)
 *      - 코드와 Popup Icon을 Dispaly
 */
function foPopupFmt(cellvalue, opts, rwdat, _act){
	 opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정

    // CellValue 값이 없을 경우
    if(cellvalue == null){
        cellvalue = ""; 
    }
    
    // 팝업 버튼을 Enable/Disable여부(Default값은 true)
    // 팝업 버튼을 Row별로 값을 체크하여 Enable/Disable 시켜야 할 경우에 사용.
    var yn_enable = true; 
    if( typeof(foUserPopupEnable) != "undefined"  && $.isFunction(foUserPopupEnable)){
        yn_enable = foUserPopupEnable(cellvalue, opts, rwdat, _act);
    }
    
    if($(this).jqGrid('getGridParam','cellEdit') == false &&  $(this).jqGrid('getGridParam','foRowEditable') == false) {
        return cellvalue;
    } 
    
    var img_src   = CONST.IMG_PATH_SRCH_GRID;
    var btn_style = "style='cursor:pointer; float:right;' "; 
    if( yn_enable == false || (opts.colModel.editableOnlyAdd && _act == 'add') ) {
        //입력 불가능한 Cell일 경우
        btn_style = "style='float:right;' disabled ";
        img_src   = CONST.IMG_PATH_SRCH_GRID_DIS;
    }
    
    var param  =  '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name +'\",\"'+ opts.colModel.popup_func+ '\"';
    var addImg =  "";

    addImg = "<img  src='" + img_src + "' onClick='setTimeout(function(){gridPopupBtnOnClick("+ param + ");}, 0);' " + btn_style +  " />";
    
    return addImg + cellvalue;
}


/**
 * 	FrameOne jqGrid Popup unformatter (FO1)
 */
function foPopupUnfmt(cellvalue, opts, cellObj){
	return cellvalue; 
}


/**
 *  DatePicker 달력 버튼 클릭 (FO1=>eHR)
 */
function datePickerBtnOnClick(grdId, rowId, sColName, dateType, yn_call_custom){
	rowId = getPRowId(rowId, grdId);	//rowId 보정
	
    var $grd = $("#"+grdId);
    
    var idxRow   = $grd.jqGrid('getInd', rowId);
    var cellDate = "#" + idxRow + "_" + sColName; 
    var colModel = $grd.jqGrid('getGridParam', 'colModel'); 
    var iColIdx  = getColIndex(colModel, sColName); 

    if(yn_call_custom != 'Y') {
        // custom_element 에서 호출한것이 아닐경우
        // Cell 이 Edit 상태가 아니므로 editCell 처리.
        $grd.jqGrid("editCell",idxRow, iColIdx, true);
    }

    // Date Format 설정  
    var date_format =  '';
    if(dateType == 'MONTH') {
        date_format = 'yymm';
    }else {
        date_format = 'yymmdd';
    }
    
    // 2013/02/08 수정 => Range of years to display in drop-down 옵션 추가 
    var year_range  = 'c-40:c+10'; // Range of years to display in drop-down
    //if(!$.fmatter.isUndefined(colModel[iColIdx].formatoptions) && !$.fmatter.isUndefined(colModel[iColIdx].formatoptions.year_range) ) {
   	if(colModel[iColIdx].formatoptions !== undefined && colModel[iColIdx].formatoptions.year_range !== undefined) {
        year_range = colModel[iColIdx].formatoptions.year_range;
    }

    // DatePicker ( 월, 요일 ) 설정 정보 가져오기 
    var datePickerFormat = getDatePickerDefault(CONST.G_LANGUAGE);
    
    $(cellDate, $grd).datepicker(
    {               
            //dateFormat: 'yy-mm-dd', //형식(2012-03-03)
            dateFormat: date_format, //형식(20120303) //그리드에서 edit시 unformat 처리를 하기 때문에 datepicker에서 박아주는 값도 format 되지 않은 값이어야 한다.
            yearRange:  year_range, 
            monthNamesShort: datePickerFormat.monthNamesShort,  
            dayNamesMin: datePickerFormat.DayNamesMin, 
            changeMonth: true, //월변경가능
            changeYear: true, //년변경가능
            //showOn: "button",
            //buttonImage:CONST.IMG_PATH_CAL,
            //buttonImageOnly:true,
            showMonthAfterYear: true , //년 뒤에 월 표시
            onClose: function () { 
                $(this).datepicker('destroy'); 
                $grd.jqGrid("saveCell", idxRow, iColIdx);
                //$(this).focus();
            }
    });

    if(yn_call_custom == 'Y') {
        $(cellDate, $grd).focus();
    }
}


/**
 *  셀에 링크가 걸린 것을 시각적으로 표현해 주는 formatter (eHR)
 *      - common.css의 .pointer에 의존  
 */
function foLinkFmt(cellvalue, opts, rwdat, _act){
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
    var colModel  = opts.colModel;

    var new_formatted_cellvalue = "";

    if(cellvalue == null) cellvalue = "";

    if( opts.colModel.link_func == undefined )  {
        // 그리드 link Function 이 정의 되어있지 않을 경우 
        new_formatted_cellvalue = '<span class="pointer">' + cellvalue + '</span>'; 
    }else {
        // 그리드 link Function 이 정의 되어있을 경우 
        var param  =  "'" + opts.gid + "','" + opts.rowId + "','" +opts.colModel.name + "'";
        new_formatted_cellvalue = '<span class="pointer"><a onclick="' + opts.colModel.link_func + '(' + param + ');return false;">' + cellvalue + '</a></span>'; 
    }
    return new_formatted_cellvalue; 
} 


/**
 *  foLinkFmt의 unformatter (eHR)
 */
function foLinkUnfmt(cellvalue, opts, cellObj){ 
    return (cellvalue == 'undefined') ? "" : cellvalue;
}


/**
 *  주민등록번호 Cell formatter (eHR)
 */
function foResNoFmt(cellvalue, opts, rwdat, _act){
    if(cellvalue == null || $.trim(cellvalue).length === 0){ return ''; }
    cellvalue = cellvalue.replace(/-/g, '').replace(/(\d{6})([0-9*]{7})/g, '$1-$2');
    return cellvalue;
}


/**
 *  주민등록번호 Cell unformatter (eHR)
 */
function foResNoUnfmt(cellvalue, opts, cellObj){
    var ret = cellvalue.replace(/-/g, '');  // 하이픈 제거
    return ret;
}


/**
 *  사업자등록번호 cell formatter (eHR)
 */
function foBizNoFmt(cellvalue, opts, rwdat, _act){
    if(cellvalue == null || $.trim(cellvalue).length === 0){ return ''; }
    cellvalue = cellvalue.replace(/-/g, '').replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3');
    return cellvalue;
}


/**
 *  사업자등록번호 Cell unformatter (eHR)
 */
function foBizNoUnfmt(cellvalue, opts, cellObj){
    var ret = cellvalue.replace(/-/g, '');  // 하이픈 제거
    return ret;
}


/**
 *  FrameOne jqGrid Cell 유효성 검사 (FO1=>eHR)
 * 		- beforeSaveCell 이벤트 처리시 유효성 검사(날짜형과 숫자형에 대해서만 처리)
 */
function gridCellValidation(grdObj, rowid, cellname, value, iRow, iCol){
    
    var $grd = $(grdObj);
    var colModel = $grd.jqGrid('getGridParam', 'colModel');

    // 팝업Data 유효성 체크가 아닐 경우 값이 Blank이면 Skip.
    // 팝업Data 유효성 체크의 경우는 코드값이 blank이면 코드명의 값도 Clear시켜줘야 함으로   사용자가 정의한 팝업 Function을 호출해야 함.
    if(value == "" && colModel[iCol].formatter != foPopupFmt) return value;
    
    if(colModel[iCol].formatter == foDateFmt) {

        // 2012/12/11 수정 => date_type 추가(월 달력 옵션) 
        var dateType ='DAY';
        if(colModel[iCol].formatoptions!= undefined && colModel[iCol].formatoptions.date_type != undefined ) {
            dateType = colModel[iCol].formatoptions.date_type;
        }
        
        // 날짜 유효성 체크 및  년월을 제외한 일자만 입력할 경우 앞에 현재년월을 채워준다.
        var strYymmdd = "";
        if(dateType == 'MONTH') {
            strYymmdd = removeChar(checkValidMonth( value ), DATE_DELIMETER);
         
        }else {
            strYymmdd = removeChar(checkValidDate( value ),  DATE_DELIMETER); 
        }
        
        if( strYymmdd == "" ){
            // 날짜입력 오류 처리 
            showMessage("ERR_DATE");
            return " ";
        }
        value = strYymmdd;
        
    }else if (colModel[iCol].formatter == "number" || colModel[iCol].formatter == "currency") {
        
        var ndecimalPlaces = 0;
        if(colModel[iCol].formatoptions!= undefined && colModel[iCol].formatoptions.decimalPlaces != undefined) {
            ndecimalPlaces = colModel[iCol].formatoptions.decimalPlaces;
        }else if(colModel[iCol].formatter == "number") {
            ndecimalPlaces = $.jgrid.formatter.number.decimalPlaces;
        }else if(colModel[iCol].formatter == "currency") {
            ndecimalPlaces = $.jgrid.formatter.currency.decimalPlaces;
        }
        
        // 소숫점이 있을 경우 '.' 입력이 가능하여 Cell Edit 완료시 숫자 유효성 체크를 해줘야함.
        if( ndecimalPlaces > 0){ 
            if(isNaN(value)) {
                // 숫자형 오류 처리 
                showMessage("ERR_NUMBER");
                return "0";
            }

            // 정수부분의 자릿수 제한을 한번더 체크한다. 
            if(colModel[iCol].editoptions!= undefined && colModel[iCol].editoptions.maxlength != undefined) {
                var nMaxLength = colModel[iCol].editoptions.maxlength;
                var arrNoStr = value.split('.');
                // 정수부분의 최대 입력가능 자릿수 보다 클 경우 오류 처리
                if(removeChar(arrNoStr[0], "-").length >  parseInt(nMaxLength) - ndecimalPlaces) {
                    showMessage("ERR_MAXLEN"); // 최대 입력 자릿수 초과
                    return "0";
                }
            }
        }
        
    } else if ( colModel[iCol].formatter == foPopupFmt ) { 
        
        if( $grd.jqGrid('getCellOriValue', rowid , cellname) == value) return value;
        if( colModel[iCol].popup_func == undefined ) return value; 
        
        // 그리드 팝업 Function 호출 
        var fn_user = eval(colModel[iCol].popup_func); 
        if($.isFunction(fn_user)){
            fn_user($grd.attr('id'), rowid, cellname, iRow, 'GET');     
        }
        
    } else if ( colModel[iCol].formatter == foResNoFmt ) {  
        // 주민등록번호 유효성 검사 
        value = value.replace(/-/g, ''); // 하이픈 제거
        if(!checkJoomin(value)){ 
            //showMessage("ERR_RESNO");
            showMessage("MSG_COM_VAL_008");
            return " ";
        }
    } else if ( colModel[iCol].formatter == foBizNoFmt ) { 

        // 사업자등록 유효성 검사 
        if(!checkBizNo(value)){ 
            //showMessage("ERR_BIZNO");
            showMessage("MSG_COM_VAL_009");
            return " ";
        }
        
    } 
    
    if(grdObj.p.customBeforeSaveCell && colModel[iCol].formatter != foPopupFmt) {
        //return을 줘야 하므로 gridCellValidation 에서 호출하도록 변경함. 
        var argArr = [rowid, cellname, value, iRow, iCol];
        return execFuncIfExistInObj(grdObj, 'customBeforeSaveCell', argArr);
    } 
    return value; 
}


/**
 *  그리드 Edit Box 설정 (Css, 숫자입력만 가능하도록 설정 (FO1=>eHR))
 *  숫자형, Date협 입력 설정 
 */
function setCommonEditCell(grdObj, rowid, cellname, value, iRow, iCol) {
    var $grd = $(grdObj);

    var editCellNm = "#" + iRow + "_" + cellname;
    var colModel = $grd.jqGrid('getGridParam', 'colModel');
    
    if(colModel[iCol].formatter == foDateFmt) {
        // Data 입력 설정 
        $(editCellNm,$grd).css("ime-mode","disabled");
        //$(editCellNm,$grd).css("background-color","#FFE400");
        $(editCellNm,$grd).numeric( { allow:"-" } );

        // input box focus시   select 처리 
        $(editCellNm,$grd).focus(function() { 
            $(this).select();
        });
        
    }else if (colModel[iCol].formatter == foResNoFmt) {
        
        $(editCellNm,$grd).css("ime-mode","disabled");
        $(editCellNm,$grd).css("text-align",'center');
        $(editCellNm,$grd).attr("maxlength",14);
        $(editCellNm,$grd).numeric( { allow:"-" } );

        // input box focus시   select 처리 
        $(editCellNm,$grd).focus(function() { 
            $(this).val(foResNoFmt(value)); 
            $(this).select();
        });
        
    }else if (colModel[iCol].formatter == foBizNoFmt) {
        
        $(editCellNm,$grd).css("ime-mode","disabled");
        $(editCellNm,$grd).css("text-align",'center');
        $(editCellNm,$grd).attr("maxlength",12);
        $(editCellNm,$grd).numeric( { allow:"-" } );

        // input box focus시   select 처리 
        $(editCellNm,$grd).focus(function() { 
            $(this).val(foBizNoFmt(value)); 
            $(this).select();
        });
        
    }else if (colModel[iCol].formatter == "integer") {
        // integer 입력 설정 => 양의 정수만 입력 가능 
        $(editCellNm,$grd).css({"ime-mode":"disabled", "text-align":"right"});
        //$(editCellNm,$grd).css("background-color","#FFE400");
        $(editCellNm,$grd).numeric();

        // input box focus시   select 처리 
        $(editCellNm,$grd).focus(function() { 
            $(this).select();
        });
    }else if (colModel[iCol].formatter == "number" || colModel[iCol].formatter == "currency" ) {
        // number/currency 입력 설정  => 소숫점과 숫자만 입력가능

        $(editCellNm,$grd).css({"ime-mode":"disabled", "text-align":"right"});
        //$(editCellNm,$grd).css("background-color","#FFE400");
        
        var ndecimalPlaces = 0;
        if(colModel[iCol].formatoptions!= undefined && colModel[iCol].formatoptions.decimalPlaces != undefined) {
            ndecimalPlaces = colModel[iCol].formatoptions.decimalPlaces;
        }else if(colModel[iCol].formatter == "number") {
            ndecimalPlaces = $.jgrid.formatter.number.decimalPlaces;
        }else if(colModel[iCol].formatter == "currency") {
            ndecimalPlaces = $.jgrid.formatter.currency.decimalPlaces;
        }
        
        if( ndecimalPlaces == 0){
            $(editCellNm,$grd).numeric(); 
        }else {
            $(editCellNm,$grd).numeric( { allow:"." } ); 
        }
        // input box focus시   select 처리 
        $(editCellNm,$grd).focus(function() { 
            $(this).select();
        });
    }
}


/**
 *  FrameOne jqGrid checkbox formatter (eHR)
 *      - colModel에서 editable이 true가 아니라면 update flag를 산출할 수 없고, 스페이스바로 체크박스를 선택할 수 없다.
 */
function foCheckboxFmt(cval, opts, rwdat, _act){
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
	
    //dc('call foCheckboxFmt(cval:'+cval+', opts:'+JSON.stringify(opts)+')');
    //여기서의 this는 그리드 테이블 객체이다.
    //그러나 이 formatter가 실행되는 시점에서는 tr들이 다 구성되지 않은 상황이라서 이벤트 바인딩 등을 할 수 없다.
    //그래서 그리드가 initialized될 때 checkbox에 대한 이벤트 바인딩을 delegate로 처리하였다.

    // 2012.07.13 추가 ( 체크박스를 컬럼값에 따라 disabled setting을 위해 Custom Function 추가)
    //----- 체크박스 Custom Function 호출  - start -----   
    if(opts.colModel.fncustom_checkbox != undefined) { 
        var fncustom_checkbox = eval(opts.colModel.fncustom_checkbox); 
        if($.isFunction(fncustom_checkbox)){
            opts = fncustom_checkbox(cval, opts, rwdat, _act);
        }
    }
    //----- 체크박스 Custom Function 호출  - end   -----
        
    //----- 행추가를 할 경우 value에 공백문자가 들어가므로 기본값 처리를 해 주었음 - start -----
    var defaultChkVal =  opts.colModel.editoptions.value.split(':')[1] || '0';
    opts.colModel.formatoptions =  $.extend({}, opts.colModel.formatoptions,  {defaultValue:defaultChkVal}); 
    //----- 행추가를 할 경우 value에 공백문자가 들어가므로 기본값 처리를 해 주었음 - end -----
    
    var op = $.extend({},opts.checkbox), ds;
    
    //if(!$.fmatter.isUndefined(opts.colModel.formatoptions)) {
   	if(opts.colModel.formatoptions != undefined) {
        op = $.extend({},op,opts.colModel.formatoptions);
    }
       	
    if(op.disabled==true) {ds = "disabled=true";} else {ds="";}
    
    // 옵션 disabled 적용 (2013.05.03) 
    if(opts.colModel.disabled == true) {ds = "disabled=true";} else {ds="";}
        
    //if($.fmatter.isEmpty(cval) || $.fmatter.isUndefined(cval) ) {cval = $.fn.fmatter.defaultFormat(cval,op);}
    if($.fmatter.isEmpty(cval) || cval === undefined ) {cval = $.fn.fmatter.defaultFormat(cval,op);}
    cval=cval+"";cval=cval.toUpperCase();
    var bchk = cval.search(/(FALSE|0|NO|OFF|\s|N)/i)<0 ? " checked='checked' " : "";

    //20121004 - onclick 이벤트를 그리드 complete시 delegate해 주는 것에서 inline 처리하는 것으로 변경
    var onclickParam = "this, '"+ opts.gid +"', '"+ opts.rowId +"', " + opts.pos;   
    
    //onclick이벤트핸들러 추가.
    return "<input type=\"checkbox\" " + bchk  + " value=\""+ cval+"\" offval=\"no\" "+ds+ " onclick=\"return checkboxOnclick("+ onclickParam +")\"/>";        
}


/**
 *  FrameOne jqGrid checkbox unformatter (eHR)
 */
function foCheckboxUnfmt(cellvalue, opts, cellObj){
    return $(':checkbox', cellObj).val();   //체크박스 value를 리턴한다.
}


/**
 *  그리드 내의 체크박스를 클릭했을 때 실행하는 공통 함수 (eHR)
 */
function checkboxOnclick(checkboxObj, gridId, rowId, cellPos){
	
    dc('call checkboxOnclick > checkboxValue:'+checkboxObj.value+', gridId:'+gridId+', rowId:'+rowId+', cellPos:'+cellPos);
    var $curGrid = $('#'+gridId),
          iRow = $curGrid.jqGrid('getInd', rowId),
          iCol = cellPos,
          $chkbx = $(checkboxObj); 
    
    // 2012.07.13 수정 ( 체크박스 click시 Cell에 Value Setting)
    //----- 체크박스 Click시 그리드 Cell의 Value값 Setting  - start -----
    var colModel = $curGrid.jqGrid('getGridParam', 'colModel');
    var ccm = colModel[iCol]; //current colModel
    
    //if(!$.fmatter.isUndefined(ccm.formatoptions)) {
   	if(ccm.formatoptions !== undefined) {
        if(ccm.formatoptions.readonly){
            return false;
        }
    }

    // 그리드 입력 불가능일 경우 
    if($curGrid.jqGrid('getGridParam','cellEdit') == false &&  $curGrid.jqGrid('getGridParam','foRowEditable') == false) {
        return false;
    }
    
    var checkVal   =  '1';
    var uncheckVal =  '0';

    //if(!$.fmatter.isUndefined(ccm.editoptions)) {
   	if(ccm.editoptions !== undefined) {
        checkVal   =  ccm.editoptions.value.split(':')[0] || '1';
        uncheckVal =  ccm.editoptions.value.split(':')[1] || '0';
    }
    
    if($chkbx.is(':checked')) {
         $curGrid.jqGrid('setCell', rowId, ccm.name, checkVal,   '','', true);
    }else {
         $curGrid.jqGrid('setCell', rowId, ccm.name, uncheckVal, '','', true);
    }
    //----- 체크박스 Click시 그리드 Cell의 Value값 Setting  - end   -----
    
    //----- 사용자정의 이벤트 핸들러(check_func) 호출 - start -----
    var check_func_str = colModel[cellPos].check_func;
    if(check_func_str != null){
        var check_func = eval(check_func_str);
        if($.isFunction(check_func)){
            var args = {
                grdId:gridId, 
                rowId:rowId, 
                colName:ccm.name, 
                iRow:iRow, 
                iCol:iCol, 
                thisObj:checkboxObj, 
                value:$curGrid.jqGrid('getCell', rowId, ccm.name)
            };
            check_func(args);
        }
    }   
    //----- 사용자정의 이벤트 핸들러(check_func) 호출 - end -----

    return true;
}


/**
 *  그리드 내부에 있는 버튼들을 생성할 때 공통으로 호출하는 메서드 (eHR)
 *  공통모듈 내에서 호출하며, 사용자가 직접 호출하지는 않는다.
 */
function getGridBtnHtml(opts, btnTitle, handlerStr, cssClass){
	
    var param  = '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name + '\"';
    handlerStr = handlerStr + '(' + param + ')';    //onclick 함수를 문자열로 정의
    var btnHtml = "<input type='button' class='"+ cssClass +"' onclick='"+ handlerStr + "' value='" + btnTitle + "' title='" + btnTitle + "' value='"+btnTitle+"'/>"; 
    return btnHtml;
}


/**
 * 그리드 내부에 있는 '출력' 이미지버튼의 html태그 문자열 리턴 (eHR)
 */
function getGridPrintImgBtnHtml(opts, handlerStr){
    return getGridPrintBtnHtml(opts, handlerStr, printBtnNm, 'comm_default_btn');
}


/**
 *  그리드 내부에 있는 이미지버튼들을 생성할 때 공통으로 호출하는 메서드 (eHR)
 */
function getGridPrintBtnHtml(opts, handlerStr, btnTitle, btnCssClass){
    var param  = '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name + '\"';
    handlerStr = handlerStr + '(' + param + ')';
    return "<input type=\"button\" class=\""+ btnCssClass +"\" onclick='"+ handlerStr + "' title='" + btnTitle + "' value='"+ btnTitle +"' style=\"background:url("+ imagePrint + ") no-repeat left top\" />"; 
}

/**
 *  그리드 내부에 있는 라디오 버튼의 html태그 문자열을 리턴한다 (eHR)
 */
function getGridRadioBtnHtml(opts, handlerStr, value, bCheckd){
    var param     = '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name + '\"';
    var $grd      = $("#" + opts.gid);
    var rowIndex  = $.jgrid.stripPref($grd.jqGrid('getGridParam', 'idPrefix'), opts.rowId);
    var cell_name = opts.colModel.name;          // input Name 
    var cell_id   = rowIndex + '_' +  cell_name; // input ID 
    handlerStr    = handlerStr + '(' + param + ')';
    
    var checkd_html = "";
    if(bCheckd) checkd_html="checked"; 
    
    return "<input type='radio' name='" + cell_name + "' id='" + cell_id  + "' " + checkd_html + " value='" + value + "' onclick='"+ handlerStr + "'  />"; 
}

//----- 그리드 행편집 버튼(행 추가, 행 삽입, 행 삭제, 행 위로 이동, 행 아래로 이동) 공통화 - start -----

/**
 * 행 추가 (eHR)
 */
function foAddGridRow(event, btnOpts){
    foStopPropagation(event);   //버튼이 grid inline에 존재할 경우 반드시 먼저 실행
    var $grd =$('#'+btnOpts.grdId);
    var params = btnOpts['ADD'] || {},
          initdata = params.initdata || {};
    params.initdata = initdata;
    
    //새로운 순번을 생성하여 순번 칼럼에 맵핑한다.
    var rowcntObj = {}, rowcntColNm = params.rowcntColNm || 'ROWCNT'; //칼럼명이 넘어오지 않으면 'ROWCNT'라는 칼럼을 순번칼럼으로 가정한다.
    rowcntObj[rowcntColNm] = $grd.jqGrid('getNewRowCnt', rowcntColNm);
    $.extend(true, initdata, rowcntObj);
    
    $grd.jqGrid('addRow', getAddRowParams(params));
}


/**
 * 행 삽입 (eHR)
 */
function foInsertGridRow(event, selectedRowId, btnOpts){
    foStopPropagation(event);
    var $grd =$('#'+btnOpts.grdId);
    var params = $.extend({rowId: selectedRowId}, btnOpts['INSERT']),
          initdata = params.initdata || {};
    
    //새로운 순번을 생성하여 순번 칼럼에 맵핑한다.
    var rowcntObj = {}, rowcntColNm = params.rowcntColNm || 'ROWCNT'; //칼럼명이 넘어오지 않으면 'ROWCNT'라는 칼럼을 순번칼럼으로 가정한다.
    rowcntObj[rowcntColNm] = $grd.jqGrid('getNewRowCnt', rowcntColNm);
    $.extend(true, initdata, rowcntObj);
    
    $grd.jqGrid('addRow', getAddRowParams(params));
}


/**
 *  행 삭제 (eHR) 
 */
function foDeleteGridRow(event, selectedRowId, btnOpts){
    foStopPropagation(event);
    var $grd =$('#'+btnOpts.grdId);

    //그리드에 존재해야 하는 최소 행 갯수일 경우 삭제하지 않는다.
    var minRowNum = btnOpts.DELETE.minRowNum;
    var curRowSize = $('.jqgrow', $grd).size();
    if(curRowSize <= minRowNum){
    	//"최소한 하나의 행은 존재해야 합니다." 와 같은 메세지 정의 필요
    	//showMessage('', String(minRowNum));
        return;
    }
    
    $grd.jqGrid('delRowData', selectedRowId); //행 삭제
}


/**
 *  그리드 행 위로/아래로 이동 (eHR)
 */
function foMoveGridRow(selectedRowId, type, btnOpts){

    var $grd = $('#'+btnOpts.grdId);  
    var movedRowId = $grd.jqGrid('foMoveRow', selectedRowId, type); //행 이동 
    
    //행 이동 이후 수행할 작업을 함수로 정의한 경우 실행한다.
    var userFunc = window[btnOpts[type].userFunc];
    if( $.isFunction(userFunc)  ){
        var o = {};
        o['grdId'] = btnOpts.grdId;
        o['selectedRowId'] = selectedRowId;
        o['movedRowId'] = movedRowId;
        userFunc(o);
    }
}


/**
 *  그리드 행편집버튼(행 추가, 행 삽입, 행 삭제, 행 위로 이동, 행 아래로 이동) 생성 (eHR)
 */
function foRowEditBtns(o){
    
    var rowId = o.opts.rowId, //rowId
          space = o.space ? String(o.space) + 'px' : '5px', //버튼 간격을 따로 입력하지 않으면 기본값 처리
          marginStr = 'margin-right:'+space+'; ',
          btnGbnArr = o.btnGbnArr, btnOpts = o.btnOpts;
    btnOpts['grdId'] = o.opts.gid; //그리드 id 전달
          
    var html = "<div class='inGridBtns'>";
    for(var i=0; i<btnGbnArr.length; i++){
        
        var styleStr = '';
        if(i !== (btnGbnArr.length -1)){ //마지막 버튼이 아니면 버튼 간격 margin 추가
            styleStr += marginStr;          
        }
        
        switch(btnGbnArr[i]){
        case 'UP' : //행 위로 이동
            //JSON.stringify(btnOpts) : JSON을 넘기고 onclick핸들러에서 따옴표처리를 하지 않았기 때문에 객체가 인수로 넘어간다.
            html += "<div class='ui-icon ui-icon-circle-arrow-n' onclick='foMoveGridRow(\""+ rowId +"\",\"UP\" , "+ JSON.stringify(btnOpts) +")' style='"+ styleStr +"'></div>"; break; 
        case 'DOWN': //행 아래로 이동
            html += "<div class='ui-icon ui-icon-circle-arrow-s' onclick='foMoveGridRow(\""+ rowId +"\",\"DOWN\" , "+ JSON.stringify(btnOpts) +")' style='"+ styleStr +"'></div>"; break;  
        case 'ADD': //행 추가
            btnOpts['ADD']['position'] = 'last'; //마지막 행 다음에 추가
            html += "<div class='ui-icon ui-icon-circle-plus' onclick='foAddGridRow(event, "+ JSON.stringify(btnOpts) +")' style='"+ styleStr +"'></div>"; break; 
        case 'INSERT': //행 삽입
            html += "<div class='ui-icon ui-icon-circle-plus' onclick='foInsertGridRow(event, \""+ rowId +"\", "+ JSON.stringify(btnOpts) +")' style='"+ styleStr +"'></div>"; break; 
        case 'DELETE': //행 삭제
            html += "<div class='lastBtn ui-icon ui-icon-circle-minus' onclick='foDeleteGridRow(event, \""+ rowId +"\", "+ JSON.stringify(btnOpts) +")' style='"+ styleStr +"'></div>";break;           
        }
        
    }         
    html += "</div>";
    return html;
}
//----- 그리드 행편집 버튼(행 추가, 행 삽입, 행 삭제, 행 위로 이동, 행 아래로 이동) 공통화 - end -----


/** 
 *  그리드 팝업 Custom Element 생성 Function (eHR) 
 */
function foPopupCustomElement(value, options) {
    var $gridObj  = this;
    var grdId     = this.id;
    var colModel  = $gridObj.p.colModel;
    var rowid     = $gridObj.p.selrow;
    
    rowid = getPRowId(rowid, grdId); //rowId 보정
    
    var colIdx    = getColIndex(colModel, options.name);
    var popup_func= colModel[colIdx].popup_func; 

    // Input Box 넓이 구하기 => TD Width - 15px; 
    var $curTd = $('#' + rowid + ' td').eq(colIdx);
    var input_width =  ($curTd.width() - 24) ;
    
    var pop_elem = $("<input>").attr({type: 'text',  
                                      name: options.name,
                                      id: options.id,  
                                      value: value, 
                                      style: 'width:' + input_width + 'px;float:left;'
                                     }).add( $("<img>").attr({  
                                                              src: CONST.IMG_PATH_SRCH_GRID, 
                                                              tabindx: '-1',
                                                              style: 'width:14px;cursor:pointer; margin-top: 3px;float:right;'
                                                             }).click(function() { 
                                                                 // My custom function here. 
                                                                 gridPopupBtnOnClick(grdId, rowid, options.name, popup_func);
                                                             }) 
                                           ).appendTo($("<div>"));  

    setTimeout(function(){
        $('#'+options.id, $gridObj).focus();
    }, 0);

    return pop_elem; 
}


/** 
 *  그리드 팝업 Custom Value Function (eHR) 
 */
function foPopupCustomValue(elem, operation, value) {
    if (operation == 'get') {
        return $(elem).val();
    } else if (operation == 'set') {
        $(elem).val(value);
    }
} 


/** 
 *  그리드 Calendar팝업 Custom Element 생성 Function (eHR) 
 */
function foDateCustomElement(value, options) {
    var $gridObj  = this;
    var grdId     = this.id;
    var colModel  = $gridObj.p.colModel;
    var rowid     = $gridObj.p.selrow;
    var colIdx    = getColIndex(colModel, options.name);
    var popup_func= colModel[colIdx].popup_func; 

    // Input Box 넓이 구하기 => TD Width - 15px; 
    var $curTd = $('#' + rowid + ' td').eq(colIdx);
    var input_width =  ($curTd.width() - 28) ;

    // 2012/12/11 수정 => date_type 추가(월 달력 옵션) 
    var dateType = 'DAY';
    //if(!$.fmatter.isUndefined(colModel[colIdx].formatoptions) && !$.fmatter.isUndefined(colModel[colIdx].formatoptions.date_type) ) {
   	if(colModel[colIdx].formatoptions !== undefined && colModel[colIdx].formatoptions.date_type !== undefined) {
        dateType = colModel[colIdx].formatoptions.date_type;
    }
    
    var pop_elem = $("<input>").attr({type: 'text',  
                                      name: options.name,
                                      id: options.id,  
                                      value: value, 
                                      style: 'width:' + input_width + 'px;float:left;'
                                     }).add( $("<img>").attr({  
                                                              src: CONST.IMG_PATH_CAL, 
                                                              tabindx: '-1',
                                                              style: 'cursor:pointer; margin-top: 2px;float:right;'
                                                             }).click(function() { 
                                                                 // My custom function here. 
                                                                  datePickerBtnOnClick(grdId, rowid, options.name, dateType, "Y");
                                                             }) 
                                           ).appendTo($("<div>"));  

    setTimeout(function(){
        $('#'+options.id, $gridObj).focus();
    }, 0);

    return pop_elem; 
}


/** 
 *  그리드 Calendar팝업 Custom Value Function (eHR) 
 */
function foDateCustomValue(elem, operation, value) {
    if (operation == 'get') {
        return $(elem).val();
    } else if (operation == 'set') {
        $(elem).val(value);
    }
} 


/**
 *  그리드 순번 표시(행추가, 행삭제시 이벤트가 발생한 행부터 순번을 재계산하여 Setting 한다. (eHR))  
 */
function setGridCellRowCnt(grdid, index_start){ 
    var gridArr  = $("#" + grdid).getDataIDs(); 
    for(var i=index_start; i<=gridArr.length; i++) {
        $("#" + grdid).jqGrid('setCell', gridArr[i-1], "ROWCNT", i,  '','', true);
    }
}


/**
 * 그리드 체크박스 컬럼 disable 속성 변경 처리 (eHR)
 * @param    grd          : 그리드
 * @param    opts         : 그리드 option 
 * @param    cellNm       : 그리드 Cell name
 * @param    disable_flag : Disabled 여부 (true/false)
 */
function setGridCheckBoxDisabled(grd, opts, cellNm, disable_flag){
    var $grd = $(grd);
    
	if(disable_flag){
		opts.colModel.formatoptions =  $.extend({}, opts.colModel.formatoptions,  {disabled: true}); 
	}else { 
		opts.colModel.formatoptions =  $.extend({}, opts.colModel.formatoptions,  {disabled: false}); 
	}
	return opts;
}


/**
 * 그리드의 체크박스 전체선택, 전체취소 (eHR)  
 * 
 * @param jsmap
 * @return
 */
function selectAllGrid(grdId, cellname, checkVal)
{
    var $grd = $("#" + grdId);
    
	// 열려있는 editable 닫기
    $grd.jqGrid('saveDataToLocal');
    
	var gridArr = $grd.getDataIDs();
 	for(var i=0; i<gridArr.length;  i++) { 
 	    $grd.jqGrid('setCell', gridArr[i], cellname, checkVal,  '','', true);
	}
}


/**
 *	idPrefix가 포함된 rowId를 리턴한다.	(pRowId = prefixed rowId) (FO2a)
 *
 * @param rowId - idPrefix가 제거된 rowId 
 * @param o - 그리드 참조변수, 그리드 jQuery객체, 혹은 그리드 id 
 *	@return idPrefix가 포함된 rowId
 */
function getPRowId(rowId, o){
	
	var px;
	try{
		if( !rowId || $.trim(rowId).length === 0 || !o){ return ''; }
		var $t = jo(o);
		if($t.size() === 0){
			alert('getPRowId() > '+ o + ' is invalid');
			return '';
		}
		var grd = $t[0];
		if(!grd.grid) { 
			alert('getPRowId() > '+ o + ' is not a grid');
			return ''; 
		}
		//idPrefix가 존재하지 않거나, 이미 넘어온 rowId에 idPrefix가 붙어 있을 경우
		px = grd.p.idPrefix;
		if(!px || rowId.indexOf(px) >= 0){
			return rowId;
		}
	}catch(e){
		alert('getPRowId() : '+ e);
	}	
	return px + rowId;  	
}


/**
 * 	병합 칼럼이 존재하고 shrinkToFit이 true일 경우, 헤더(제목줄)의 리사이즈 이상현상에 대한 보정
 * 		- 컨셉: 내용(body)은 제대로 리사이즈 되니까, 내용에 맞춰서 헤더(제목줄)을 다시 한 번 리사이즈 해 주자!
 */
function resizeGroupHeader($grd){
	
	var gp = $grd[0].p, $gbox = $grd.closest('div[id^=gbox_]');
	
	if(gp.groupHeader && gp.shrinkToFit){
//		dc('@ 헤더 병합 리사이즈 보정 수행');
		
		var $fths = $('.jqg-first-row-header > th', $gbox), //그리드 헤더 상단의 숨겨진 row에 속한 th 객체집합
		$ftds = $('.jqgrow:first > td', $gbox), //그리드 내용(body)의 첫번째 row에 속한 td 객체집합
		tdWBArr = [], //조정 전 td width 배열 
		thWBArr = [], //조정 전 헤더(th) width 배열
		thWAArr = []; //조정 후 헤더(th) width 배열
		
		//첫번째 데이터 행 td들의 width를 배열에 담는다.
		//본 루프에서 바로 처리해도 되지만 디버깅의 어려움으로 인해 배열 이후 다시 루프를 돌도록 설계.
		$ftds.each(function(i){
			tdWBArr.push($(this).width());	
		});	
		
		//----- 디버깅용 - start -----
		if(isDebugConsoleEnabled){
			$fths.each(function(i){
				thWBArr.push($(this).width());
			});			
//			dc('@ 조정 전 내용 width: '+JSON.stringify(tdWBArr));
//			dc('@ 조정 전 헤더 width: '+JSON.stringify(thWBArr));
		}
		//----- 디버깅용 - end ------
		
		var browser = getBrowser(); //브라우저 명
		var offsetSafari = 5; //safari width 조정 보정치
		var offsetChrome = 2; //chrome width 조정 보정치
		var offsetOpera = 1; //opera width 조정 보정치
		
		//헤더 width 조정
		for(var i=0; i<tdWBArr.length; i++){
			
			var $th = $fths.eq(i);
			if($th.css('display') === 'none'){ continue; } //hidden 칼럼 skip
			
			var newWidth = tdWBArr[i];
			if(browser === 'CHROME'){
				if(i === 0){
//					dc('@@ chrome 보정');
					newWidth = newWidth + offsetChrome;
				}
			}else if(browser === 'OPERA'){
				if(i === 0){
//					dc('@@ opera 보정');
					newWidth = newWidth + offsetOpera;
				}
				
			}else if(browser === 'SAFARI'){
//				dc('@@ safari 보정');
				newWidth = newWidth + offsetSafari;
			}
//			dc('@@ newWidth: '+newWidth);
	
			$th.width(newWidth); //width 조정
		}
		
		//----- 디버깅용 - start -----
		if(isDebugConsoleEnabled){
			$fths.each(function(i){
				thWAArr.push($(this).width());
			});
//			dc('@ 조정 후 헤더 width: '+JSON.stringify(thWAArr)+'\n\n');
		}	
		//----- 디버깅용 - end ------
		
	}

}
/////////////////////////////////////////////////////   그리드 공통 메서드 - end   //////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////   jqGrid 확장 - start   //////////////////////////////////////////////////////////////
(function ($) {
	/*
	 *	FrameOne의 사상에 맞게 jqGrid가 작동할 수 있도록 jqGrid의 소스를 메서드 단위로 override하거나, 혹은 새로운 메서드를 추가한 부분.
	 */
	$.jgrid.extend({

        /**
         *  setCell override 메서드
         *  	- jqGrid 4.4.5 소스에 FrameOne/eHR 커스터마이징 적용
         *  	- eHR에서 커스터마이징 했던 사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음  
         * 
         * @param rowid tr의 rowid
         * @param colname 그리드의 colNames에 지정한 칼럼명
         * @param nData 셀(td)에 저장할 값
         * @param cssp 셀(td)에 지정할 css class, jQuery의 addClass()의 호출인자가 됨. (String, JSON 다 받음)
         * @param attrp 셀(td)에 지정할 속성, jQuery의 attr()의 호출인자가 됨 (JSON만 받음)
         * @param forceupd true일 경우 title속성의 update를 실행한다.(?)
         * @param rewrite  true OR NULL 일 경우 Cell 을 formatter를 적용하여 하위 element를 다시 그린다. 
         * @returns
         */     		
		setCell : function(rowid,colname,nData,cssp,attrp, forceupd, rewrite) {
			dc('call setCell(rowid:'+rowid+', colname:'+colname+', nData:'+nData+', cssp:'+cssp+', attrp:'+attrp+', forceupd:'+forceupd+')');
			
			//사용자정의 select box 관련 코드(eHR): FrameOne2.0a 반영하지 않음
			//if(rewrite == null) rewrite = true;
			
			return this.each(function(){
				var $t = this, pos =-1,v, title;
				if(!$t.grid) {return;}
				if(isNaN(colname)) {
					$($t.p.colModel).each(function(i){
						if (this.name === colname) {
							pos = i;return false;
						}
					});
				} else {pos = parseInt(colname,10);}
				if(pos>=0) {
					var ind = $t.rows.namedItem(rowid);
					if (ind){
						var tcell = $("td:eq("+pos+")",ind);
						
						//FO1
                        //--------------------------------- rowStatus 삽입 - start -------------------------------------
                        var $tr = $(ind);
                        var rowStatus    = $tr.attr('__rowStatus'); 
                        var formatter    = $t.p.colModel[pos].formatter;
                        var status_check = true;
                        
                        // 2012-12-17 수정 (eHR)
                        //  => row의 변경상태를 체크할때 예외적으로 변경여부 체크시 제외할 컬럼을 설정하여 
                        //     체크할수 있도록 status_check를 추가함.  설정을 안했을 경우 Default 값은  true임. 
                        if($t.p.colModel[pos].status_check != undefined){ 
                            status_check = $t.p.colModel[pos].status_check; 
                        }
                        
                        if(rowStatus == null && status_check == true){

                            //콤보박스/체크박스인 경우 (eHR)
                        	//사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음
                            if(/*formatter === foSelectBoxFmt || */ formatter === foCheckboxFmt){
                           	
                                // 2012.10.04 추가  
                                // 콤보박스/체크박스는 saveCell이 아닌 onchange/onclick Event시 UPDATE 여부 체크를 하므로, 
                                // title 속성의 값과 비교하지 않고 변경여부Flag를 무조건 Update 상태로 변경한다.
                                rowStatus = UPDATE;
                            
                            //그 외의 경우 (FO1)  
                            }else {
                                var oriData = null;
                                var newData = null;
    
                                oriData = $.trim(tcell.attr('title'));
                                newData = $.trim(nData); 
    
                                dc('before unformat > colname : '+colname+', oriData : "'+ oriData + '", newData : "' + newData+'"');
                                
                                //---------- formatting 문제로 무조건 UPDATE 처리되는 현상 보정 - start ----------
                                //현재 row의 변경상태를 체크하기 위해서 수정전 값과 수정후 값을 비교하는데 데이터 포맷팅이 문제가 되었다.
                                //newData는 unformat 된 상태인데 반해 oriData는 format된 상태이기 때문이다.
                                //그래서 oriData를 unformat 으로 한 다음 비교를 하려고 했는데, $.unformat()의 인자로 text만 가진 td 엘리먼트를 받게 되어 있기 때문에 다시 문제가 되었다.
                                //왜나하면 이 시점에서 비교하는 td 엘리먼트는 수정상태의 input 객체를 모두 포함하고 있는 td들이기 때문에 unformat 함수에서 $td.text() 를 호출해도 
                                //값을 얻을 수 없기 때문이었다. 그래서 이 경우, $.unformat()의 인자로 넘기기 위한 td객체를 하나씩 생성해서 oriData의 값을 text로 삽입해서 처리했다.                          
                                var $tempOriDataTd = $('<td/>');
                                $tempOriDataTd.text(oriData);
                                oriData = $.unformat($tempOriDataTd.get(0),{rowId:rowid, colModel:$t.p.colModel[pos]},pos);
                                $tempOriDataTd = null;  //메모리에서 삭제하도록 처리                            
                                //---------- formatting 문제로 무조건 UPDATE 처리되는 현상 보정 - end ----------
                                
                                //---------- 숫자 계열의 formatter를 사용하는 경우 float로 변환하여 비교 - start ---------- 
                                if(formatter === 'integer' || formatter === 'number' || formatter === 'currency'){
                                    oriData = parseFloat(oriData);
                                    newData = parseFloat(newData);
                                }
                                //---------- 숫자 계열의 formatter를 사용하는 경우 float로 변환하여 비교 - end ---------- 
    
                                dc('after unformat > colname : '+colname+', oriData : "'+ oriData + '", newData : "' + newData+'"');
                                
                                if(oriData != newData){
                                    rowStatus = UPDATE;
                                }
                            }
                            
                            if(rowStatus != null){
                                $tr.attr('__rowStatus', rowStatus);
                                dc('rowStatus was added as "'+rowStatus+'"');                               
                            }
                        }
                        
                        dc('@ current rowstatus : ' + rowStatus);               
                        //--------------------------------- rowStatus 삽입 - end -------------------------------------                        						
						
						if(nData !== "" || forceupd === true) {
							v = $t.formatter(rowid, nData, pos,ind,'edit');
							
							//(eHR)
                            //-------------- title 속성 갱신작업 수정 - start ----------------
                            //title = $t.p.colModel[pos].title ? {"title":$.jgrid.stripHtml(v)} : {};   //원래 소스코드
                            var titleValue;
                            
                            //콤보박스/체크박스의 경우에는 title속성을 사용한 UPDATE 상태 체크작업을 하지 않기 때문에 빈 값을 넣어준다.
                            //사용자정의 콤보(foSelectBoxFmt)는 FrameOne2.0a에 반영하지 않음
                            if(/*formatter === foSelectBoxFmt || */ formatter === foCheckboxFmt){    
                                titleValue = '';
                            //그 외의 경우   
                            }else{  
                                titleValue = $.jgrid.stripHtml(v);  
                            }
                            title = $t.p.colModel[pos].title ? {"title":titleValue} : {};   
                            dc('after title : '+title.title);
                            //-------------- title 속성 갱신작업 수정 - end ----------------							
							
							if($t.p.treeGrid && $(".tree-wrap",$(tcell)).length>0) {
								$("span",$(tcell)).html(v).attr(title);
							} else {
								$(tcell).html(v).attr(title);
							}
							if($t.p.datatype === "local") {
								var cm = $t.p.colModel[pos], index;
								nData = cm.formatter && typeof cm.formatter === 'string' && cm.formatter === 'date' ? $.unformat.date.call($t,nData,cm) : nData;
								index = $t.p._index[$.jgrid.stripPref($t.p.idPrefix, rowid)];
								if(index !== undefined) {
									$t.p.data[index][cm.name] = nData;
								}
							}
						}
						if(typeof cssp === 'string'){
							$(tcell).addClass(cssp);
						} else if(cssp) {
							$(tcell).css(cssp);
						}
						if(typeof attrp === 'object') {$(tcell).attr(attrp);}
					}
				}
			});
		},
		
		
        /**
         *  setRowData() override 메서드
         *  	- jqGrid 4.4.5 소스에 FrameOne/eHR 커스터마이징 적용 
         * 
         * @param rowid tr의 rowid
         * @param data 해당 그리드 row에 셋팅할 값들이 Map 형태로 들어있는 javacript 객체.
         * @param cssp row(tr)에 지정할 css class, jQuery의 addClass()의 호출인자가 됨. (String, JSON 다 받음)
         */		
		setRowData : function(rowid, data, cssp) {
			dc('call setRowData('+rowid+')');
			var nm, success=true, title;
			this.each(function(){
				if(!this.grid) {return false;}
				var t = this, vl, ind, cp = typeof cssp, lcdata={};
				
				//FO1
                //--------------------------------- rowStatus 삽입 - start -------------------------------------
                //로컬저장 전/후의 데이터를 비교해서 rowStatus 속성을 업데이트 한다.
                var $tr = $('#'+rowid, $(t));
                var rowStatus = $tr.attr('__rowStatus'); 
                var colModel = $(t).jqGrid('getGridParam', 'colModel');

                if(rowStatus == null){
                    
                    var idx = 0;
                    var oriData,
                          newData;
                    var $tds = $tr.children('td');
                    var tdIdx, $curTd;
            
                    for (var key in data){
                        
                        //data 파라미터에는 있고 실제칼럼에는 없는 값 (oper같은 경우 edit시에 edit라고 생성되므로 반드시 제외시켜야 한다.)
                        if(key == 'id' || key == 'oper'){ continue; }
                        
                        tdIdx = getColIndex(colModel, key);     //각 key에 해당하는 필드명이 colModel의 몇 번째 인덱스인지 반환
                        $curTd = $tds.eq(tdIdx);
                        oriData = $.trim($tds.eq(tdIdx).attr('title'));
                        newData = $.trim(data[key]);
                        
                        dc('key : '+key+', oriData : "'+ oriData + '", newData : "' + newData+'" - unformat 전');
                        //---------- formatting 문제로 무조건 UPDATE 처리되는 현상 보정 - start ----------
                        //setCell() 주석 참고 
                        var $tempOriDataTd = $('<td/>');
                        $tempOriDataTd.text(oriData);
                        oriData = $.unformat($tempOriDataTd.get(0),{rowId:rowid, colModel:colModel[tdIdx]},tdIdx);
                        $tempOriDataTd = null;  //메모리에서 삭제하도록 처리
                        //---------- formatting 문제로 무조건 UPDATE 처리되는 현상 보정 - end ----------

                        //---------- 숫자 계열의 formatter를 사용하는 경우 float로 변환하여 비교 - start ---------- 
                        var formatter = t.p.colModel[idx].formatter;

                        if( formatter === 'integer' || formatter === 'number' || formatter === 'currency'){
                            oriData = parseFloat(oriData);
                            newData = parseFloat(newData);
                        }
                        //---------- 숫자 계열의$ formatter를 사용하는 경우 float로 변환하여 비교 - end ----------                     
                        dc('key : '+key+', oriData : "'+ oriData + '", newData : "' + newData+'" - unformat 후');
                        
                        if(oriData != newData){
                            rowStatus = UPDATE;
                            break;
                        }
                        idx++;
                        
                    }//end for
                    
                    if(rowStatus != null){
                        $tr.attr('__rowStatus', rowStatus);
                        dc('rowStatus was added as "'+rowStatus+'"');
                    }
                }
                
                dc('@ current rowstatus : ' + rowStatus);               
                //--------------------------------- rowStatus 삽입 - end -------------------------------------				
				
				ind = t.rows.namedItem(rowid);
				if(!ind) { return false; }
				if( data ) {
					try {
						$(this.p.colModel).each(function(i){
							nm = this.name;
							if( data[nm] !== undefined) {
								lcdata[nm] = this.formatter && typeof this.formatter === 'string' && this.formatter == 'date' ? $.unformat.date.call(t,data[nm],this) : data[nm];
								vl = t.formatter( rowid, data[nm], i, data, 'edit');
								title = this.title ? {"title":$.jgrid.stripHtml(vl)} : {};
								if(t.p.treeGrid===true && nm == t.p.ExpandColumn) {
									$("td[role='gridcell']:eq("+i+") > span:first",ind).html(vl).attr(title);
								} else {
									$("td[role='gridcell']:eq("+i+")",ind).html(vl).attr(title);
								}
							}
						});
						if(t.p.datatype === 'local') {
							var id = $.jgrid.stripPref(t.p.idPrefix, rowid),
							pos = t.p._index[id], key;
							if(t.p.treeGrid) {
								for(key in t.p.treeReader){
									if(t.p.treeReader.hasOwnProperty(key)) {
										delete lcdata[t.p.treeReader[key]];
									}
								}
							}
							if(pos !== undefined) {
								t.p.data[pos] = $.extend(true, t.p.data[pos], lcdata);
							}
							lcdata = null;
						}
					} catch (e) {
						success = false;
					}
				}
				if(success) {
					if(cp === 'string') {$(ind).addClass(cssp);} else if(cp === 'object') {$(ind).css(cssp);}
					$(t).triggerHandler("jqGridAfterGridComplete");
				}
			});
			return success;
		},		
		
		
		/**
		 *	addRow override 메서드
         *  	- jqGrid 4.4.5 소스에 FrameOne/eHR 커스터마이징 적용
         *  
		 *		- idPrefix가 그리드 설정에 존재할 경우 생기는 오류 패치 
		 *		- row편집 모드에서 cell 편집 모드로 변경함.
		 */
		addRow : function ( p ) {
            dc('call addRow');

            //FO1
            //----- rowId 생성 - start -----
            var idPrefix = this.getGridParam('idPrefix');
            var lastIdx = 0;
            $(this).find('tr.jqgrow').each(function(){
                var tr = this, rowId = tr.id
                ,tmpIdx = parseInt(rowId.substring(idPrefix.length, rowId.length), 10);
                if(tmpIdx > lastIdx){ //eHR
                    lastIdx = tmpIdx; 
                }
            });			
            
            //ADD시 새로운 ID를 만들 때 기존 ID와 겹치면 안된다.
            var newRowId = lastIdx + 1;             
            //----- rowId 생성 - end ------

            //2012/06/21 추가 -> 그리드 행이 하나도 없을 경우에는 사용자가 position을 별도로 지정했더라도 position=first 로 변경 (eHR) 
            if($('.jqgrow', $(this)).length == 0){
                p = $.extend(true, p || {}, {position :"first"});
            }            
			
			p = $.extend(true, {
				//rowID : null,
				rowID : newRowId, //(FO1)
				initdata : {},
				position :"first",
				useDefValues : true,
				useFormatter : false,
				addRowParams : {extraparam:{}},
				doEdit : true //20121018 추가 -> 파라미터를 false로 넘겼을 경우 addRow한 행에 editCell을 수행하지 않도록 처리 (eHR)
			},p  || {});
			
			return this.each(function(){
				if (!this.grid ) { return; }
				var $t = this;
				p.rowID = $.isFunction(p.rowID) ? p.rowID.call($t, p) : ( (p.rowID != null) ? p.rowID : $.jgrid.randId());
				if(p.useDefValues === true) {
					$($t.p.colModel).each(function(){
						if( this.editoptions && this.editoptions.defaultValue ) {
							var opt = this.editoptions.defaultValue,
							tmp = $.isFunction(opt) ? opt.call($t) : opt;
							p.initdata[this.name] = tmp;
						}
					});
				}
				
				//ORI
				//$($t).jqGrid('addRowData', p.rowID, p.initdata, p.position);
				//p.rowID = $t.p.idPrefix + p.rowID;

				//FO1, eHR
                //---------- FrameOne 수정 start ----------
                $($t).jqGrid('saveDataToLocal');    // - 열려있는 editable 닫기
                if($t.p.selrow){ $($t).jqGrid('resetSelection', $t.p.selrow); } //마지막으로 선택된 row의 선택상태 초기화
                
                //baseRowId 정의 
                // (1) addRowParam을 통해 rowId를 넘겼을 경우에는 해당 rowId를 사용한다 (행삽입 버튼이 그리드 inline에 존재하는 경우)
                // (2) rowId가 넘어오지 않았을 경우에는 가장 최근에 선택된 rowId를 기준점으로 사용한다. (행삽입 버튼이 그리드 바깥에 존재하는 경우)
                var baseRowId = p.rowId || ($('tr.jqgrow', $t).eq($t.p.iRow - 1).attr('id')); //삽입 기준 row의 rowId
                var baseRowIndex = (baseRowId == null) ? 1 : $($t).jqGrid('getInd', baseRowId); //삽입 기준 row의 인덱스번호
                $t.p.iRow = baseRowIndex;
                
                //baseRowId가 null 일 경우는, 그리드에 선택된 row가 없다는 말이다. 이 경우에는 행삽입이라도 행추가처럼 동작하도록 처리한다.
                if(baseRowId == null){
                    p.position = 'last';
                }
                
                //실제 행 삽입(추가) 작업
                $($t).jqGrid('addRowData', p.rowID, p.initdata, p.position, baseRowId); //행삽입시(before, after) 4번째가 필요하여 추가하였다.
                
                p.rowID = $t.p.idPrefix + p.rowID; //FO2a
                
                //FO1 구현시 오류 보정을 위해 정의되었으나 FO2a에서 사용하지 않음
                //grid에 선언된 idPrefix가 반영된 rowID로 p.rowID를 변경
                //var idPrefix = $($t).jqGrid('getGridParam', 'idPrefix');
                //idPrefix = (idPrefix == null) ? '' : idPrefix; 
                //p.rowID = idPrefix + p.rowID;
                //---------- FrameOne 수정 end -----------
				
				$("#"+$.jgrid.jqID(p.rowID), "#"+$.jgrid.jqID($t.p.id)).addClass("jqgrid-new-row");
				if(p.useFormatter) {
					$("#"+$.jgrid.jqID(p.rowID)+" .ui-inline-edit", "#"+$.jgrid.jqID($t.p.id)).click();
				} else {
					var opers = $t.p.prmNames,
					oper = opers.oper;
					p.addRowParams.extraparam[oper] = opers.addoper;

					//ORI
					//$($t).jqGrid('editRow', p.rowID, p.addRowParams);
					//$($t).jqGrid('setSelection', p.rowID);
					
					//FO1, eHR
                    //---------- FrameOne 수정 start ----------
                    var activeRowIdx; //행 추가 후 어떤 row를 활성화 할 것인가?
                    if(p.position === 'before'){    //위로 행삽입 
                        activeRowIdx = $t.p.iRow;
                    }else if(p.position === 'after'){ //아래로 행삽입
                        activeRowIdx = $t.p.iRow + 1;
                    }else{ //행추가
                        activeRowIdx = $t.rows.length - 1; 
                    }
                    
                    //activeColIdx 만들기 - colModel에서 첫 번째 editable cell을 찾자
                    var colModel = $t.p.colModel;
                    var activeColIdx = 0;
                    for(var i=0; i<colModel.length; i++){
                        if(colModel[i].editable || colModel[i].editableOnlyAdd){
                            activeColIdx = i;
                            break;
                        }
                    }

                    if(p.doEdit){
                        setTimeout(function(){
                            $($t).jqGrid("editCell", activeRowIdx, activeColIdx, true);
                        }, 0);
                    }
                    //---------- FrameOne 수정 end -----------					
				}
			});
		},

		
		/**
		 *	addRowData override 메서드 
         *  	- jqGrid 4.4.5 소스에 FrameOne/eHR 커스터마이징 적용
		 *
		 *		- 행 추가시 rowStatus를 'I'로 변경하는 코드 추가 
		 * 
		 * @param rowid
		 * @param rdata
		 * @param pos
		 * @param src
		 * @returns {Boolean}
		 */		
		addRowData : function(rowid,rdata,pos,src) {
			dc('call addRowData(rowid:'+rowid+', rdata:'+rdata+', pos:'+pos+', src:'+src+')');
			if(!pos) {pos = "last";}
			var success = false, nm, row, gi, si, ni,sind, i, v, prp="", aradd, cnm, cn, data, cm, id;
			if(rdata) {
				if($.isArray(rdata)) {
					aradd=true;
					pos = "last";
					cnm = rowid;
				} else {
					rdata = [rdata];
					aradd = false;
				}
				this.each(function() {
					var t = this, datalen = rdata.length;
					ni = t.p.rownumbers===true ? 1 :0;
					gi = t.p.multiselect ===true ? 1 :0;
					si = t.p.subGrid===true ? 1 :0;
					if(!aradd) {
						if(rowid !== undefined) { rowid = String(rowid);}
						else {
							rowid = $.jgrid.randId();
							if(t.p.keyIndex !== false) {
								cnm = t.p.colModel[t.p.keyIndex+gi+si+ni].name;
								if(rdata[0][cnm] !== undefined) { rowid = rdata[0][cnm]; }
							}
						}
					}
					cn = t.p.altclass;
					var k = 0, cna ="", lcdata = {},
					air = $.isFunction(t.p.afterInsertRow) ? true : false;
					while(k < datalen) {
						data = rdata[k];
						row=[];
						if(aradd) {
							try {
								rowid = data[cnm];
								if(rowid===undefined) {
									rowid = $.jgrid.randId();
								}
							}
							catch (e) {rowid = $.jgrid.randId();}
							cna = t.p.altRows === true ?  (t.rows.length-1)%2 === 0 ? cn : "" : "";
						}
						id = rowid;
						rowid  = t.p.idPrefix + rowid;
						if(ni){
							prp = t.formatCol(0,1,'',null,rowid, true);
							row[row.length] = "<td role=\"gridcell\" class=\"ui-state-default jqgrid-rownum\" "+prp+">0</td>";
						}
						if(gi) {
							v = "<input role=\"checkbox\" type=\"checkbox\""+" id=\"jqg_"+t.p.id+"_"+rowid+"\" class=\"cbox\"/>";
							prp = t.formatCol(ni,1,'', null, rowid, true);
							row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
						}
						if(si) {
							row[row.length] = $(t).jqGrid("addSubGridCell",gi+ni,1);
						}
						for(i = gi+si+ni; i < t.p.colModel.length;i++){
							cm = t.p.colModel[i];
							nm = cm.name;
							lcdata[nm] = data[nm];
							v = t.formatter( rowid, $.jgrid.getAccessor(data,nm), i, data );
							prp = t.formatCol(i,1,v, data, rowid, lcdata);
							row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
						}
						row.unshift( t.constructTr(rowid, false, cna, lcdata, data, false ) );
						row[row.length] = "</tr>";
						if(t.rows.length === 0){
							$("table:first",t.grid.bDiv).append(row.join(''));
						} else {
						switch (pos) {
							case 'last':
								$(t.rows[t.rows.length-1]).after(row.join(''));
								sind = t.rows.length-1;
								break;
							case 'first':
								$(t.rows[0]).after(row.join(''));
								sind = 1;
								break;
							case 'after':
								sind = t.rows.namedItem(src);
								if (sind) {
									if($(t.rows[sind.rowIndex+1]).hasClass("ui-subgrid")) { $(t.rows[sind.rowIndex+1]).after(row); }
									else { $(sind).after(row.join('')); }
								}
								sind++;
								break;
							case 'before':
								sind = t.rows.namedItem(src);
								if(sind) {$(sind).before(row.join(''));sind=sind.rowIndex;}
								sind--;
								break;
						}
						}
						if(t.p.subGrid===true) {
							$(t).jqGrid("addSubGrid",gi+ni, sind);
						}
						t.p.records++;
						t.p.reccount++;
						$(t).triggerHandler("jqGridAfterInsertRow", [rowid,data,data]);
						if(air) { t.p.afterInsertRow.call(t,rowid,data,data); }
						k++;
						if(t.p.datatype === 'local') {
							lcdata[t.p.localReader.id] = id;
							t.p._index[id] = t.p.data.length;
							t.p.data.push(lcdata);
							lcdata = {};
						}
					}
					if( t.p.altRows === true && !aradd) {
						if (pos === "last") {
							if ((t.rows.length-1)%2 === 1)  {$(t.rows[t.rows.length-1]).addClass(cn);}
						} else {
							$(t.rows).each(function(i){
								if(i % 2 ===1) { $(this).addClass(cn); }
								else { $(this).removeClass(cn); }
							});
						}
					}
					t.updatepager(true,true);
					success = true;
					
					//FO1
                    //----------------------------- rowStatus 삽입 - start -------------------------------------
                    //해당 row(tr)에 rowStatus 'I'를 삽입.
                    $('#'+rowid, $(t)).attr('__rowStatus', INSERT);
                    dc('rowStatus was added as '+INSERT);
                    //----------------------------- rowStatus 삽입 - end -------------------------------------					
				});
			}
			return success;
		},
		
		
		/**
		 * 	delRowData override 메서드
         *  	- jqGrid 4.4.5 소스에 FrameOne/eHR 커스터마이징 적용
		 * 
		 * 		- jqGrid 객체에 삭제된 row의 정보를 저장하는 기능 추가
		 * 		- 행삭제시에도 gridComplete가 호출된다는 것이 주의할 것
		 */		
		delRowData : function(rowid) {
			var success = false, rowInd, ia, ri;
			this.each(function() {
				var $t = this;
				rowInd = $t.rows.namedItem(rowid);
				if(!rowInd) {return false;}
				
				//FO1
                else {
                    //-------------- 삭제 row의 정보 저장 - start ----------------------
                    //각 row별로 루프를 돌며 saveRow 처리를 해서. 각  셀의 input box를 닫아준다.
                    $($t).jqGrid('saveDataToLocal');
                    if($t.p.selrow){ $($t).jqGrid('resetSelection', $t.p.selrow); } //마지막으로 선택된 row의 선택상태 초기화

                    var deleteRowData = $($t).jqGrid('getRowData', rowid);  //json 형태
                    var currentRowStatus = $(rowInd).attr('__rowStatus');
                    //현재 row의 상태가 'I'인 것(신규 row)은 정보를 저장하지 않는다.
                    if(currentRowStatus != INSERT){
                        deleteRowData['__rowStatus'] = DELETE;  //rowStatus를 'D'로 삽입
                        var deletedRowsArray = $($t).data('deletedRows');
                        if(deletedRowsArray == null){
                            $($t).data('deletedRows', new Array());
                        }
                        $($t).data('deletedRows').push(deleteRowData);
                    }
                    
                    //삭제할 row가 마지막 row인지의 정보
                    var isLastRow = $(rowInd).next('.jqgrow').length == 0 ? true : false;
                    dc('delRowData isLastRow : '+isLastRow);
                    //-------------- 삭제 row의 정보 저장 - end ----------------------
                    
					ri = rowInd.rowIndex;
					$(rowInd).remove();
					$t.p.records--;
					$t.p.reccount--;
					$t.updatepager(true,false);
					success=true;
					if($t.p.multiselect) {
						ia = $.inArray(rowid,$t.p.selarrrow);
						if(ia !== -1) { $t.p.selarrrow.splice(ia,1);}
					}
					if ($t.p.multiselect && $t.p.selarrrow.length > 0) {
						$t.p.selrow = $t.p.selarrrow[$t.p.selarrrow.length-1];
					} else {
						$t.p.selrow = null;
					}                    
                    
                }				
					
				if($t.p.datatype === 'local') {
					var id = $.jgrid.stripPref($t.p.idPrefix, rowid),
					pos = $t.p._index[id];
					if(pos !== undefined) {
						$t.p.data.splice(pos,1);
						$t.refreshIndex();
					}
				}
				if( $t.p.altRows === true && success ) {
					var cn = $t.p.altclass;
					$($t.rows).each(function(i){
						if(i % 2 ==1) { $(this).addClass(cn); }
						else { $(this).removeClass(cn); }
					});
				}
				
				//FO1
                //-------------- 커서 활성화 처리 - start ----------------------
                var activeRowIdx = isLastRow ? ri-1 : ri;   //ri(그리드제목줄을 포함한 row의 인덱스)가 마지막 row일 경우에는 ri-1을 해 준다.
                dc('delRowData > activeRowIdx : '+activeRowIdx);
                $t.p.iRow = activeRowIdx;
                $t.p.iCol = 0;

                //editCell() 호출시 savedRow 데이터가 존재하면 지워버린 row의 정보를 save시도하기 때문에 에러를 발생시키기 때문에 초기화 시켰음
                $t.p.savedRow = [];
                
                //editCell을 수행할 cell의 index 조정 (FO2a)
                //특정 조건을 만족하면 1, 아니면 0 => jqGrid 소스의 editCell에서 차용한 조건 
                //(editCell이 작동하지 않는 조건이면 그 다음셀을 선택하는 개념)
                var nm = $t.p.colModel[0].name; 
                var activeCellIdx = (nm=='subgrid' || nm=='cb' || nm=='rn') ? 1 : 0;  
                
                //삭제한 row의 바로 전 row를 선택상태로 만들기 위해 editCell() 호출
                if($($t).jqGrid("getDataIDs").length > 0){ //남은 row가 존재할 경우에만
                	$($t).jqGrid("editCell", activeRowIdx, activeCellIdx, false);
                }
                //-------------- 커서 활성화 처리 - end ----------------------				
				
			});
			return success;
		},
			
			
        /**
         *  삭제된 ROW의 정보를 획득한다. (추가한 함수(FO1)) 
         */     
        getDeletedData : function(){
            var deletedRows = null;
            this.each(function(){
                var $t = this;
                var deletedRowsArray = $($t).data('deletedRows');
                if(deletedRowsArray == null){
                    $($t).data('deletedRows', new Array());
                }               
                deletedRows = $($t).data('deletedRows'); 
            });
            dc('getDeletedData size :'+deletedRows.length);
            return deletedRows;
        },
		
        
		/**
		 * 	foMoveRow 메서드  - FrameOne 추가 메서드
		 * 		- jqGrid의 행을 이동(UP/DOWN)하는 메서드
		 */		
		foMoveRow : function(rowid, type) {
			var $t        = this;
			var gridArr   = $($t).getDataIDs();
			var currRow   = $($t).jqGrid('getInd', rowid);
			var arrIndex  = currRow-1;  // Array는 0부터 시작, Row 번호는 1부터 시작.
			var moveRowId = "";         // 이동할 ROW ID  
			var moveRow   = 0;          // 이동할 ROW 번호
				
			if(type.toUpperCase() == "UP") {
				// 위로 이동 
				if(currRow <= 1){
					return;
				}        
				moveRowId= gridArr[arrIndex-1]; // 윗행의 Row Id Get
				moveRow  = currRow-1;
				
			}else if(type.toUpperCase() == "DOWN") {
				// 아래로 이동 
				if(currRow == gridArr.length){
					return;
				}
				moveRowId= gridArr[arrIndex+1]; // 아래행의 Row Id Get  
				moveRow  = currRow+1;
			}else {
				return;
			}
			// 열려있는 editable 닫기
			$($t).jqGrid('saveDataToLocal');
			
			var rowData1 = $($t).getRowData(moveRowId);
			var rowData2 = $($t).getRowData(rowid);
			var rowStatus1 = $('#'+moveRowId, $($t)).attr('__rowStatus'); 
			var rowStatus2 = $('#'+rowid,     $($t)).attr('__rowStatus'); 

			if(rowStatus1 == undefined) rowStatus1 = null;
			if(rowStatus2 == undefined) rowStatus2 = null;
			
			$('#'+moveRowId, $($t)).attr('__rowStatus', rowStatus2);
			$('#'+rowid,     $($t)).attr('__rowStatus', rowStatus1);    
			
			$($t).setRowData(moveRowId, rowData2);
			$($t).setRowData(rowid,     rowData1);

			// 윗행으로 ROW FOCUS 이동 
			$($t).jqGrid('resetSelection');
			$($t).jqGrid("editCell", moveRow, 0, true);
			return moveRowId;
		},        
        
		
        /**
         *  그리드의 row에 대한 loop를 돌면서 saveRow 메서드를 호출한다. (추가한 함수(FO1))
         *      - 트랜젝션 보내기 전에 각 row의 rowStatus를 정리하고, 열려있는 input 들을 닫는 용도로 사용한다.
         */     
        saveDataToLocal : function(){
            this.each(function(){
                var $t = this;
                //cellEdit 모드일 경우
                if($t.p.cellEdit){  
                    $($t).jqGrid("saveCell", $t.p.iRow, $t.p.iCol); //현재 선택된 cell만 활성화되었을 가능성이 있음
                //rowEdit 모드일 경우    
                }else{  
                    $($t).find('tr.jqgrow').each(function(idx){
                        var tr = this;
                        $($t).jqGrid('saveRow', tr.id, {"url" : "clientArray"});
                    });
                }
            });
        },		
		
		
		/**
		 * 	해당 그리드의 모든 데이터를 JSON array의 형태로 리턴하되 변경된 row만 리턴한다. (추가한 함수(FO1=>eHR))
		 * 호출시 내부적으로 saveDataToLocal()을 호출하여 그리드상의 열려 있는 모든 input들을 닫아주어야 한다.
		 * 
		 * @param rowCollectCondition 상수 UPDATE_ROWS 혹은 ALL_ROWS
		 * @returns
		 */		
		getGridData : function(rowCollectCondition){
            var res = {}, resall, len, j=0, colModel;
            this.each(function(){
                var $t = this,nm,ind;
                resall = [];
                len = $t.rows.length;       
                colModel = $t.p.colModel;
            
                //각 row별로 루프를 돌며 saveRow 처리를 해서. 각  셀의 input box를 닫아준다.
                $($t).jqGrid('saveDataToLocal');
                
                while(j<len){
                    ind = $t.rows[j];
                    var trRowStatus = $(ind).attr('__rowStatus');       //NORMAL이 아닌 row들은 모두 rowStatus값을 가지고 있을 것이다. 
                    var rowStatus = trRowStatus != null ? trRowStatus : NORMAL;     
                    
                    if( $(ind).hasClass('jqgrow') ) {
                        //td루프
                        $('td',ind).each( function(i) {     
                
                            var oriValue = $.trim(this.title);
                            nm = colModel[i].name;
                            
                            if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn') {
                            
                                if($t.p.treeGrid===true && nm == $t.p.ExpandColumn) {
                                    res[nm] = $.jgrid.htmlDecode($("span:first",this).html());
                                } else {
                                    try {
                                        //dc('rowId : '+ind.id+',cellvalue : '+this+' tdIdx : '+i+', colModel : '+JSON.stringify(colModel[i]));                                     
                                        //dc('res[nm] : '+res[nm]);
                                        res[nm] = $.unformat(this,{rowId:ind.id, colModel:colModel[i]},i);
                                        //dc('res[nm] : '+res[nm]);
                                    } catch (e){
                                        res[nm] = $.jgrid.htmlDecode($(this).html());
                                    }
                                }
                            }
                        });
                        
                        //각 row data의 JSON map에 rowStatus를 기록한다.
                        res['__rowStatus'] = rowStatus;
                        //각 row data의 Grid 행번호/RowID 를 기록한다. 
                        res['__rowId']     = ind.id;
                        res['__rowIndex']  = ind.rowIndex;
                        
                        if(rowCollectCondition == UPDATED_ROWS && rowStatus == NORMAL){
                            j++;
                            continue;   //업데이트row만 추출하려고 할 때 업데이트 되지 않은 row는 결과 배열에 포함시키지 않는다.
                        }
                        
                        resall.push(res); res={};
                    }
                    j++;
                }               
                
            });
            
            dc('getGridData size :'+resall.length);
            return resall ? resall: res;
        },

        
        /**
         *  그리드 파라미터 전송용 데이터셋 객체를 생성하여 리턴한다. (추가한 함수(FO1))
         */     
        getGridDatasetParam : function(rowCollectCondition){
            var ret = {};
            this.each(function(){
                var $t = this;
                ret["data"] =  $($t).jqGrid("getGridData", rowCollectCondition);
                ret["deletedData"] = $($t).data('deletedRows');
            });
            return ret;         
        },
		
		
        /**
         *  그리드를 조회하는 절차를 하나로 묶은 함수 (추가한 함수(FO1=>eHR))
         * @param o
         */     
        retrieve : function(o){ 
            this.each(function(){
                if(!this.grid) {return false;}
                var t = this;
                //dc('call retrieve');
                $(t).jqGrid('setGridParam', {postData:o});   //DO_COUNTTOT 파라미터를 true로 주어야 서비스 레이어에서 카운트 쿼리를 실행한다.      
                $(t).jqGrid().trigger('reloadGrid',[{page:1}]); //전송
            }); 
        },		
		
        
        /**
         *	조회된 데이터를 그리드에 바인딩하는 함수 (추가한 함수(eHR))
         * 
         * @param returnData
         */
        bindGridData : function(returnData){
            
            this.each(function(){
                if(!this.grid) {return false;}
                
                var $gridObj = $(this);
                
                // 2012.06.22 수정
                //---------- deletedRows의 초기화 - start ----------
                $gridObj.data('deletedRows', null);
                //---------- deletedRows의 초기화 - end   ----------
                
                var gridData;
                //2012.05.24 수정 -> 그리드 Parameter에 dataset 명이 있을 경우  -- Start 
                // 해당 Dataset명의 Data를 그리드에 Mapping 한다. 
                var dataset_name = $gridObj.jqGrid('getGridParam', 'dataset');
                
                if( dataset_name == null || dataset_name == "") {
                    //ds_로 시작하는 항목 중 첫 번째 것을 그리드에 보여줄 데이터로 사용한다.
                    for(var key in returnData){
                        if(key.indexOf("ds_") >= 0){
                            gridData = returnData[key];
                            dataset_name = key;
                            break;
                        }
                    }
                }else {
                    gridData = returnData[dataset_name];
                    if(gridData == undefined){
                        alert('Dataset Name is not valid.');
                    }
                }

                var  postData    = $gridObj.jqGrid('getGridParam', 'postData');
                var  rowsPerPage = $gridObj.jqGrid('getGridParam', 'rowNum');
                var  page        = postData['page'];
                
                //totalPage 계산 수행
                var  totalCount = 0;
                //2012.06.15 수정 -> Multi DataSet조회를 위해 totalCount를 
                //                  DataSet별로 설정한 값으로 가져오도록 수정 
                if(returnData[dataset_name + '.totalCount'] != undefined){
                    totalCount = returnData[dataset_name + '.totalCount'];
                    $gridObj[0].p.lastTotalCount = totalCount;
                }else if(returnData['totalCount'] != undefined){
                    totalCount = returnData['totalCount'];
                    $gridObj[0].p.lastTotalCount = totalCount;
                }else{
                    totalCount = $gridObj[0].p.lastTotalCount;
                }
                
                var  totalPage = Math.ceil(totalCount / rowsPerPage);
                
                gridData['page'] = page;
                gridData['totalCount'] = totalCount;
                gridData['totalPage'] = totalPage;
        
                $gridObj[0].addJSONData(gridData);  //그리드에 데이터 바인딩
                
                //특정 브라우저에서 세로 스크롤바가 생기지 않는 문제점을 강제적으로 해결
                showHiddenScrollbar($gridObj[0].id);
            }); 

        },        
		        
        
		/**
		 * GridNav override 메서드
		 * 		- jQuery와의 버그로 인해 커스터마이징 했었으나(FO1), jqGrid 4.4.5 버전에서 정상 작동하기 때문에 override하지 않음
		 */
        
        
        /**
         *	그리드 저장 전 유효성검사시 사용하는 함수 (추가한 함수(eHR))
         * 
         * @param rowCollectCondition
         * @param chkChange
         * @returns {Boolean}
         */
        checkValidation : function(rowCollectCondition, chkChange) {
            var ret        = {};
            var chkFlag     = true;  // 유효셩 Check 결과 flag 
            
            // rowCollectCondition : 상수 UPDATE_ROWS 혹은 ALL_ROWS
            // ==> Default값은  UPDATED_ROWS
            if(rowCollectCondition == undefined || rowCollectCondition == null) rowCollectCondition = UPDATED_ROWS;
            
            // 그리드 변경여부 체크 Flag ==> Default값은 true
            if(chkChange == undefined  || rowCollectCondition == null) chkChange = true;
            
            this.each(function(){
                var grd = this;
                
                // 변경된 Data정보 가져오기 : 그리드  파라미터 전송할 데이터셋 객체를 생성하여 리턴한다.
                ret = $(grd).jqGrid("getGridDatasetParam", rowCollectCondition);
                
                // 그리드 Data 변경된 자료가 있는지 체크 (2012.06.22 추가)
                if(chkChange) {
                    if( ret["data"].length == 0 && (ret["deletedData"] == null || ret["deletedData"].length == 0) ){
                        showMessage('ERR_NOCHANGE');
                        chkFlag = false;
                        return false;
                    }
                }
                
                var colModel   = grd.p.colModel;
                var colNames   = grd.p.colNames;
                var valid_rules;   // 그리드에서 정의한 Validation 체크 Rule 
                var cellValue;     // 그리드 Cell Value
                var rowIndex;      // 그리드 행번호  
                
                
                //TODO:팝업조회와 연결된 칼럼이 닫혀있지 않은 상황이라면 validation의 결과를 false로 한다.
                
                
                for(var i=0; i < ret["data"].length; i++){
                    
                    for(var j=0; j<colModel.length; j++){   //colModel 루프

                        valid_rules = colModel[j].valid_rules;
                        cellValue   = ret["data"][i][colModel[j].name];
                        rowIndex    = ret["data"][i]["__rowIndex"];
                        
                        // Validation Check할 Rule이 없을 경우 Skip
                        if(valid_rules == null) continue;

                        // 1. 필수 입력 체크 
                        if(valid_rules.required){
                            
                            if( cellValue.trim() == '' || (valid_rules.number && parseFloat(cellValue.trim()) === 0)) {
                                //유효성검사 메시지에 칼럼헤더명을 그대로 사용할 수 없을 경우, colModel의 valid_title 속성에 유효성검사 타이틀을 별도 지정한다.
                                var valid_title = colModel[j].valid_title || colNames[j];     
                                showMessage("ERR_REQUIRED", valid_title);
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }

                        // 2. Byte 입력 제한  체크
                        if(valid_rules.maxbyte  != undefined){ 
                            // Byte 입력 제한  체크  
                            if(cellValue.getByte() > valid_rules.maxbyte) {
                                showMessage("ERR_MAXBYTE", String(valid_rules.maxbyte));
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            } 
                        }

                        // 3. 숫자 입력 오류  체크  
                        if(valid_rules.number){ 
                            if(cellValue.isNumber() == false) {
                                showMessage("ERR_NUMBER");
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }

                        // 4. 영문자 입력 오류  체크  
                        if(valid_rules.alpha){ 
                            if(cellValue.isAlpha() == false) {
                                showMessage("ERR_ALPHA");
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }
                        
                        // 5. 영문자 입력 오류  체크  
                        if(valid_rules.alpha_blank){ 
                            if(cellValue.isAlphaBlank() == false) {
                                showMessage("ERR_ALPHA");
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }

                        // 6. 영문자/숫자 입력 오류  체크  
                        if(valid_rules.alphanum){ 
                            if(cellValue.isAlphaNum() == false) {
                                showMessage("ERR_ALPHANUM");
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }
                        
                        // 7. Email 입력 오류  체크  
                        if(valid_rules.email){ 
                            if(cellValue.isEmail() == false) {
                                showMessage("ERR_EMAIL");
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }

                        // 8. 사업자번호 입력 오류  체크  
                        if(valid_rules.bizno && isEmpty(cellValue.trim()) == false){ 
                            // 사업자등록 유효성 검사 
                            if(!checkBizNo(cellValue)){ 
                                //showMessage("ERR_BIZNO");
                                showMessage("MSG_COM_VAL_009");                                
                                $(grd).jqGrid("editCell", rowIndex, j, true);
                                chkFlag = false;
                                return false;
                            }
                        }
                        
                    }//end for(Column Loop) 
                    
                }// end for(Row Loop)
                
            });
            return chkFlag; 
        },        
        
        
        /**
         *  해당 cell의 값을 리턴한다. (추가한 함수(eHR))
         *      - editable, non-editable상태에 관계없이 값을 조회한다. 
         */
        getCellVal : function(rowId, colNm){
            var val;
            this.each(function(){
                if(!this.grid) {return false;}
                var  $t = this, $grd = $($t);
                val = $('#' + $grd.jqGrid('getInd', rowId) + "_" +  colNm).val(); //editable 상태의 value
                if( ! val){
                    val = $grd.jqGrid('getCell', rowId, colNm);
                }
            });
            return val;
        },        
        
		
        /**
         *	해당 셀이 원래 가지고 있던 값(조회 후 수정 전)을 리턴한다. (추가한 함수(eHR)) 
         * 
         * @param rowid
         * @param col
         * @returns {Boolean}
         */
		getCellOriValue : function(rowid,col) {
			var ret = false;
			this.each(function(){
				var $t=this, pos=-1;
				if(!$t.grid) {return;}
				if(isNaN(col)) {
					$($t.p.colModel).each(function(i){
						if (this.name === col) {
							pos = i;return false;
						}
					});
				} else {pos = parseInt(col,10);}
				
				if(pos>=0) {
					var ind = $t.rows.namedItem(rowid);
					if(ind){
						ret = $("td:eq("+pos+")",ind).attr('title');
					}
				}
			});
			return ret;
		},
        
        
        /**
         *  행 추가시 새로운 순번을 생성하여 리턴한다. (추가한 함수(eHR))
         *      - 현재 그리드의 (가장 높은 순번 칼럼값 + 1) 을 리턴한다.
         *      - 인수: 순번 칼럼의 칼럼명
         */
        getNewRowCnt : function(rowcntColNm){
            var $grd = $(this);
            var lastRowcnt = 0, $rows = $grd.find('tr.jqgrow');
            if($rows.size() === 0){
                return 1; //데이터 row가 존재하지 않을 경우
            }
            $rows.each(function(){
                var tr = this, rowId = tr.id,
                tmpRowcnt = $grd.getCell(rowId, rowcntColNm);
                if( ! tmpRowcnt){
                    return true; //continue
                }
                tmpRowcnt = Number(tmpRowcnt);
                if(tmpRowcnt > lastRowcnt){
                    lastRowcnt = tmpRowcnt; 
                }
            });
            var newRowCnt = lastRowcnt + 1;
            return newRowCnt;
        },      
        
        
        /**
         *  그리드의 width를 부모엘리먼트, 혹은 기타 참조엘리먼트의 width에 맞춘다. (추가한 함수(eHR))
         *  	- 그리드가 숨겨진 탭에 있다가 나타났을 경우 width가 0이 되어 보이지 않는 등의 현상을 동적으로 보정하기 위해 작성한 함수
         */
        refreshGridWidth : function(){
            return this.each(function () {
                var grd = this, $grd = $(grd), grdId = grd.id, rf = grd.p.resizeFactor, parent = $('#gbox_' + grdId).parent();
                var $wRef = rf ? (rf.refId ? $('#'+rf.refId) :parent) : parent, //width 참조 대상
                     newGW = $wRef.innerWidth();
                $grd.jqGrid('setGridWidth' ,newGW);
            });
        },        
        
        
        /**
         *  현재 그리드에서, 인수로 받은 상태와 동일한 rowStatus를 갖는 row의 갯수를 반환한다.
         *  	- 호출 방법: $grid1.jqGrid('getMatchedStateRowCnt', INSERT) 혹은 $grid1.jqGrid('getMatchedStateRowCnt', INSERT, UPDATE) ...  
         *  	- 인수로 사용 가능한 상수: INSERT, UPDATE (문자열이 아닌 전역변수임)    
         */
        getMatchedStateRowCnt : function(){
            var ret = 0, args = arguments;
            if(args.length === 0){ return 0; }
        	this.each(function () {
        		var grd = this;
        		$('.jqgrow', grd).each(function(idx){
        			var $tr = $(this), rs = $tr.attr('__rowStatus');
        			for(var i=0; i<args.length; i++){
        				rs = (rs === undefined) ? NORMAL : rs;
        				//dc('@@ rs: '+rs+', args['+i+']: '+args[i]);
        				if(rs === args[i]){
        					ret++;
        				}
        			}
        		});
            });
        	return ret;
        }        

	}); 
	
})(jQuery);
///////////////////////////////////////////////////////   jqGrid 확장 - end   //////////////////////////////////////////////////////////////