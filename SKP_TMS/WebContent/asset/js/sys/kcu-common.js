/**
 *  FrameOne jqGrid date formatter (FO1=>eHR)
 *      - Ymd형식 => Y-m-d 형식으로 변환
 *      - Ymd 형식의 경우 jqGrid 내장 formatter로 해결할 수 없기에 정의함.
 *      - date.js의 DATE_DELIMETER 상수에 종속성을 갖고 있다.
 */
function foItemFmt(cellvalue, opts, rwdat, _act){

	dc("==========foItemFmt===========");
	dc(cellvalue);
	dc(opts);
	dc("==========rwdat.LCC_CD===========");
	dc(rwdat.LCC_CD);
	dc(_act);
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
    
    var strParam    =  '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name +'\"';
    var evt = "gridCallItemFunc(\""+opts.rowId+"\",\"" +opts.colModel.name+"\");"; 
			        
    if(cellvalue  == undefined ||  cellvalue == "undefined"){
    cellvalue="";
    }
    // Footer Row일 경우 rowid가 없음.
    // Footer의 경우 Select Box를 그리지 않음.
    if(opts.rowId == "") {
        return cellvalue;
    }

    var showbtn_always = false;
          
	var img_src   = CONST.KCU_IMG_PATH_SRCH_GRID;
	var btn_style = "style='cursor:pointer; float:right;' "; 

	addImg = "<img class='btn_item' src='" + img_src +  "' tabindx: '-1' onClick='"+evt+"' " +btn_style+">"; 

    // 날짜형 값이 없을 경우  return
    return  addImg + cellvalue ;
}

/**
 * 	FrameOne jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymd형식으로 변환
 */
function foItemUnfmt(cellvalue, opts, cellObj){	
	return cellvalue;
}

/**
 *  FrameOne jqGrid date formatter (FO1=>eHR)
 *      - Ymd형식 => Y-m-d 형식으로 변환
 *      - Ymd 형식의 경우 jqGrid 내장 formatter로 해결할 수 없기에 정의함.
 *      - date.js의 DATE_DELIMETER 상수에 종속성을 갖고 있다.
 */
function foNodeFmt(cellvalue, opts, rwdat, _act){

	dc("==========foNodeFmt===========");
	dc(cellvalue);
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
    
    var strParam    =  '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name +'\"';
    var evt = "gridCallNodeFunc(\""+opts.rowId+"\",\"" +opts.colModel.name+"\");"; 
			        
    if(cellvalue  == undefined ||  cellvalue == "undefined"){
    cellvalue="";
    }
    // Footer Row일 경우 rowid가 없음.
    // Footer의 경우 Select Box를 그리지 않음.
    if(opts.rowId == "") {
        return cellvalue;
    }

    var showbtn_always = false;
 
	var img_src   = CONST.KCU_IMG_PATH_SRCH_GRID;
	var btn_style = "style='cursor:pointer; float:right;' "; 

	addImg = "<img class='btn_item' src='" + img_src +  "' tabindx: '-1' onClick='"+evt+"' " +btn_style+">"; 

    // 날짜형 값이 없을 경우  return
    return  addImg + cellvalue ;
}

/**
 * 	FrameOne jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymd형식으로 변환
 */
function foNodeUnfmt(cellvalue, opts, cellObj){	
	return cellvalue;
}

/**
 *  FrameOne jqGrid date formatter (FO1=>eHR)
 *      - Ymd형식 => Y-m-d 형식으로 변환
 *      - Ymd 형식의 경우 jqGrid 내장 formatter로 해결할 수 없기에 정의함.
 *      - date.js의 DATE_DELIMETER 상수에 종속성을 갖고 있다.
 */
function kcuDateFmt(cellvalue, opts, rwdat, _act){
	
	var y, m, d;
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);	//rowId 보정
       
    var strParam    =  '\"' + opts.gid +'\",\"' + opts.rowId +'\",\"' +opts.colModel.name +'\"';
    var addImg =  "";

    if(opts.rowId == "") {
        return cellvalue;
    }
      
    // 입력 가능한 컬럼일 경우만 달력버튼 삽입 
    var dateType = 'DAY';
   
    var img_src   = CONST.KFR_IMG_PATH_CAL;
    var btn_style = "style='cursor:pointer; float:right;' "; 
      
   	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.date_type !== undefined) {
        dateType = opts.colModel.formatoptions.date_type;
    }    
    addImg = "<img src='" + img_src + "' tabindx: '-1' onClick='calBtnOnClick("+ strParam +", \"" + dateType +  "\");' " +  btn_style + " />"; 

    //현재 포맷이 Y-m-d 인지 체크 
    var regex   = /^\d{4}-\d{2}-\d{2}$/; //Y-m-d 포맷 
    
    // 일자입력 최대길이 
    var max_len = 8;
    if(dateType == 'MONTH') {
        // 월입력 Format일 경우 
        max_len = 6;
        regex   = /^\d{4}-\d{2}$/;       //Y-m 포맷 
    }

    var formatNewDate = ""; 
    var newDate = ""; 
    if(cellvalue == null || cellvalue.length < max_len){
    	formatNewDate = "";
    }else if(regex.test(cellvalue)){
        // 현재 포맷이 Y-m-d 이면 그대로 리턴한다.
    	formatNewDate =  cellvalue; 
    }else{
        cellvalue = cellvalue +"";

        if(dateType == 'MONTH') {
            y = cellvalue.substring(0,4);
            m = cellvalue.substring(4,6);
            formatNewDate = String(y)+'-'+String(m);  //Y-m 형식 
            newDate = String(y)+String(m);  //Y-m 형식 
        }else {
            y = cellvalue.substring(0,4);
            m = cellvalue.substring(4,6);
            d = cellvalue.substring(6,8);
            formatNewDate = String(y)+'-'+String(m)+'-'+String(d);    //Y-m-d 형식
            newDate = String(y)+String(m)+String(d);  //Y-m 형식 
        }
    }
    
	if(opts.colModel.name == "TERM_STAT_DATE" && copyCheck){ 

        if(cellvalue!=""){

			copyCheck = false;  //이거 때문에 날짜 여러번 못 봐꿨음
			
         	var ids = $grid1.jqGrid('getDataIDs');
         	var rateHstData = $grid1.jqGrid('getRowData', ids[0]); // 마지막 차수 데이터
			var lastRateHstData = $grid1.jqGrid('getRowData', ids[1]); // 마지막 차수 데이터

        	var from_dt = new Date(y, m-1, d);  //복사한 차수의 적용일자
        	
			//적용일자에서 하루 뺀 일자가 마지막 차수의 만료일자로 set
			var date = new Date(Date.parse(from_dt) - 1*1000*60*60*24);
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var year = date.getFullYear();

            if((month+"").length < 2){
            	month = "0" + month;
            }
            if((day+"").length < 2){
            	day = "0" + day;
            }
			var newEndDate = String(year) + String(month) + String(day); //마지막 차수의 만료일자

			if(parseInt(newDate) >= parseInt(rateHstData.TERM_END_DATE)){
      			
      			alert("날짜를 다시 입력 하세요.");
            	return addImg;
            }
   
            var setLastRateHst = {RATE_HST_NO : lastRateHstData.RATE_HST_NO, TERM_STAT_DATE : lastRateHstData.TERM_STAT_DATE, TERM_END_DATE : newEndDate , DB_YN : lastRateHstData.DB_YN };
          
            $grid1.setRowData(ids[1], setLastRateHst);

        	 return formatNewDate;
        }
	
	    return  addImg ;
	    
    }else {
   	
  		return formatNewDate;
 	 } 
	
}

/**
 * 	FrameOne jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymd형식으로 변환
 */ 
function kcuDateUnfmt(cellvalue, opts, cellObj){
	var ret = cellvalue.replace(/-/g, '');	//하이픈 제거
	return ret;
}

/** 
 *  그리드 Calendar팝업 Custom Element 생성 Function (eHR) 
 */
function kcuDateCustomElement(value, options) {
    var $gridObj  = this;
    var grdId     = this.id;
    var colModel  = $gridObj.p.colModel;
    var rowid     = $gridObj.p.selrow;
    var colIdx    = getColIndex(colModel, options.name);
    var popup_func= colModel[colIdx].popup_func; 

    // Input Box 넓이 구하기 => TD Width - 15px; 
    var $curTd = $('#' + rowid + ' td').eq(colIdx);
    var input_width =  ($curTd.width() - 40) ;

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
                                      style: 'width:' + input_width + 'px;float:left;',
                                      readonly : 'readonly'
                                                                         
                                     }).add( $("<img>").attr({  
                                                              src: CONST.KFR_IMG_PATH_CAL, 
                                                              tabindx: '-1',
                                                              style: 'cursor:pointer; margin-top: 2px;float:right;'
                                                             }).click(function() { 
                                                                 // My custom function here. 
                                                                 calBtnOnClick(grdId, rowid, options.name, dateType, "Y");
                                                             }) 
                                           ).appendTo($("<div>")); 

    setTimeout(function(){
        $('#'+options.id, $gridObj).focus();
    }, 0);

    return pop_elem; 
}

/**
 *  DatePicker 달력 버튼 클릭 (FO1=>eHR)
 */
function calBtnOnClick(grdId, rowId, sColName, dateType, yn_call_custom){

	copyCheck = true;
	dc("=========calBtnOnClick============");
	dc(yn_call_custom);

	rowId = getPRowId(rowId, grdId);	//rowId 보정

	var ids = $grid1.jqGrid('getDataIDs');

	var rowData = $grid1.jqGrid('getRowData', ids[1]);	
	
	dc("==============rowData===================");
	dc(rowData);
	
	var startDay 	= rowData.TERM_STAT_DATE;
	var endDay 		= rowData.TERM_END_DATE;
	var year 		= startDay.substring(0, 4);
	var month 		= startDay.substring(4,6);
	var day 		= startDay.substring(6,8);

	if( month.length == 1 ) month = "0" + month;
	if( day.length   == 1 ) day  = "0" + day;
	
	day = parseInt(day) + 2;

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
	        $grd.jqGrid('saveRow', ids[idxRow+1], true);
	    },
	    minDate: new Date(year, month - 1, day)
    });

    if(yn_call_custom == 'Y') {
        $(cellDate, $grd).focus();
    }
}

/** 
 *  그리드 Calendar팝업 Custom Value Function (eHR) 
 */
function kcuDateCustomValue(elem, operation, value) {
    if (operation == 'get') {
        return $(elem).val();
    } else if (operation == 'set') {
        $(elem).val(value);
    }
} 

function gridCallItemFunc(id,cellName){

    $("#hdGridId").val(id);
    $("#hdCellNm").val(cellName);
	kioSearchItem({type:'itemPopUp',width:'800',height:'600',scrollbars:'no',userFunc:'gridItemFunc',customerSearchImg:'false',mappingArr:[{elemId:'searchShprNm',popElemId:'txtCustNm'},{elemId:'searchShprId',popElemId:'txtCustId'}],retParams:[{elemId:'hdNm',popGridElemNM:'ITEM_NM'},{elemId:'hdCd',popGridElemNM:'ITEM_CD'}]});
}

function gridItemFunc(){
	$grid2.jqGrid('setCell', $("#hdGridId").val(),	$("#hdCellNm").val(), $("#hdNm").val());
    $grid2.jqGrid('setCell', $("#hdGridId").val(), 'ITEM_CD', $("#hdCd").val());
}


function gridCallNodeFunc(id,cellName){

    $("#hdGridId").val(id);
    $("#hdCellNm").val(cellName);
	kioSearchStNode({type:'popup',width:'800',height:'600',scrollbars:'no',userFunc:'gridNodeFunc',customerSearchImg:'false',retParams:[{elemId:'hdNm',popGridElemNM:'NODE_NM'},{elemId:'hdCd',popGridElemNM:'NODE_ID'}]});
			   
}

function gridNodeFunc(){

    if($("#hdCellNm").val() == 'DEP_NODE_NM'){
	
		$grid2.jqGrid('setCell', $("#hdGridId").val(),$("#hdCellNm").val(), $("#hdNm").val());
		$grid2.jqGrid('setCell', $("#hdGridId").val(),'DEP_NODE_ID', $("#hdCd").val());
		
	}else if($("#hdCellNm").val() == 'ARR_NODE_NM'){
	
		$grid2.jqGrid('setCell', $("#hdGridId").val(),$("#hdCellNm").val(), $("#hdNm").val());
		$grid2.jqGrid('setCell', $("#hdGridId").val(),'ARR_NODE_ID', $("#hdCd").val());
		
	}	
}

/**
 * 매출계약상세조회 팝업
*/
function kcuSendCntrtNotoDetailPage(args){
	
    var popupUrl = CONST.CONTEXT_PATH + "/kcu/inputFormContract.fo";
    var popupNm = "sendrow";
    var popupWidth = '1250';
    var popupHeight = '650';
    var popupScrollbars = 'auto';
    var userFunc = "";
    var cntrt_no = "";
    var cntrt_stat = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.cntrt_no != undefined && args.cntrt_no != ""){ cntrt_no = args.cntrt_no; }
    if(args.cntrt_stat != undefined && args.cntrt_stat != ""){ cntrt_stat = args.cntrt_stat; }
	
	var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: popupNm, // name of window
			windowURL: popupUrl, 
			width : popupWidth,	//사용자정의값 우선
			height: popupHeight,
			scrollbars : popupScrollbars,
			param : { 
					cntrt_no:cntrt_no
				  , cntrt_stat : cntrt_stat
			}
	
			//returnArr의 구조
			//OPENER창에 POPUP GRID정보 값 저장 할 파라미터
			//elemId - html엘리먼트 id (필수)
			//popGridNm - 팝업의 GRID 컬럼 이름
			//returnArr: [
			// 	{elemId:'txt1', popGridElemNM:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'txt2', popGridElemNM:'NAME'}     //부서 명	
			//]
			
			//mappingArr의 구조
			//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
			//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
			//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
			//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
			//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
			//mappingArr: [
			// 	{elemId:'DPT_CD', rsNm:'CODE', paramNm:'DPT_CD', popElemId:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'DPT_NM', rsNm:'NAME'}     //부서 명	
			//],
			// 검색 조건으로 추가할 파라미터
			//searchParam: { P_SEARCH_ALL_YN:"Y" } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};	
 
 	dc("=========sendCntrtData===========");	
	dc(options);	
	var popup = openWindowPopup(options);
	popup.focus();		

 }

/**
 * 매입계약상세조회 팝업
*/
function kcuSendPchCntrtNotoDetailPage(args){

    var popupUrl = CONST.CONTEXT_PATH + "/kcu/inputFormPurchaseContract.fo";
    var popupNm = "sendrow";
    var popupWidth = '1250';
    var popupHeight = '650';
    var popupScrollbars = 'auto';
    var userFunc = "";
    var cntrt_no = "";
    var cntrt_stat = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.cntrt_no != undefined && args.cntrt_no != ""){ cntrt_no = args.cntrt_no; }
    if(args.cntrt_stat != undefined && args.cntrt_stat != ""){ cntrt_stat = args.cntrt_stat; }

	var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: popupNm, // name of window
			windowURL: popupUrl, 
			width : popupWidth,	//사용자정의값 우선
			height: popupHeight,
			scrollbars : popupScrollbars,
			param : { 
				cntrt_no:cntrt_no
			  , cntrt_stat : cntrt_stat
			}
	
			//returnArr의 구조
			//OPENER창에 POPUP GRID정보 값 저장 할 파라미터
			//elemId - html엘리먼트 id (필수)
			//popGridNm - 팝업의 GRID 컬럼 이름
			//returnArr: [
			// 	{elemId:'txt1', popGridElemNM:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'txt2', popGridElemNM:'NAME'}     //부서 명	
			//]
			
			//mappingArr의 구조
			//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
			//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
			//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
			//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
			//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
			//mappingArr: [
			// 	{elemId:'DPT_CD', rsNm:'CODE', paramNm:'DPT_CD', popElemId:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'DPT_NM', rsNm:'NAME'}     //부서 명	
			//],
			// 검색 조건으로 추가할 파라미터
			//searchParam: { P_SEARCH_ALL_YN:"Y" } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};	
 
	dc(options);	
	var popup = openWindowPopup(options);
	popup.focus();		

}

/**
 * 운송사조회 팝업
*/
function kcuSearchLsp(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kcu/sub/lspSearch.fo";
    var popupNm = "custPopUp";
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
 * 청구고객사 팝업
*/
function kcuSearchCustCntrt(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kcu/sub/custCntrtNoSearch.fo";
    var popupNm = "searchPopUpCustomerCntrtNo";
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
 * 매출계약차수조회 팝업
 */
function kcuSearchTbcuRateHst(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kcu/sub/tbcuRateHstSearch.fo";
    var popupNm = "searchPopUpTbcuRateHst";
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
 * 매입계약차수조회 팝업
 */
function kcuSearchRateHst(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kcu/sub/rateHstSearch.fo";
    var popupNm = "searchPopUpCustomerRateHst";
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