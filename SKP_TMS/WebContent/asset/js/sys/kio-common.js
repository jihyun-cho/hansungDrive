/*
* KFR System Order Common JAVASCRIPT 파일
**/

/**
 *  주문 jqGrid date formatter (FO1=>eHR)
 *      - Ymd형식 => Y-m-d 형식으로 변환
 *      - Ymd 형식의 경우 jqGrid 내장 formatter로 해결할 수 없기에 정의함.
 *      - date.js의 DATE_DELIMETER 상수에 종속성을 갖고 있다.
 *      cell edit속성은 항상 false여야 한다
 */
function kioDateFmt(cellvalue, opts, rwdat, _act){	
	opts['rowId'] = getPRowId(opts.rowId, opts.gid);
	var cell_name = opts.colModel.name;  
    var addImg =  "";
    var addComboBox = "";
    var addInput ="";
    var editCheck=true;
    
    var txtId = "txt_"+opts['rowId']+"_"+cell_name;
    var comboBoxId = "cb_"+opts['rowId']+"_"+cell_name;
    var cellvalueDate ="";
    var cellvalueTime = "";

    if( nvl(cellvalue,"") == "" || isNaN(cellvalue) || cellvalue.length < 12 ){    
    	cellvalueDate = formatDate(new Date());
    	cellvalueTime = "0900";
    	cellvalue = cellvalueDate+cellvalueTime; 
    }else{
    	cellvalueDate = cellvalue.substring(0,8);
    	cellvalueTime = cellvalue.substring(8,12);
    }
    

    // Footer Row일 경우 rowid가 없음.
    // Footer의 경우 Select Box를 그리지 않음.
    if(opts.rowId == "") {
        return cellvalue;
    }

    var showbtn_always = false;
    
   	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.showbtn_always !== undefined) {
        showbtn_always = opts.colModel.formatoptions.showbtn_always;
    }
    
    var dateType = 'DAY';
    
          
    // 달력 버튼을 Enable/Disable여부(Default값은 true)
    // 달력 버튼을 Row별로 값을 체크하여 Enable/Disable 시켜야 할 경우에 사용.    
    var img_src   = CONST.KFR_IMG_PATH_CAL;
    var btn_style = "style='cursor:pointer;'"; 
    var comboBox_style = "";
    if( !editCheck || (opts.colModel.editableOnlyAdd && _act == 'add') ) {
        //입력 불가능한 Cell일 경우
        btn_style = "style='disabled;' ";
        //img_src   = CONST.IMG_PATH_CAL_DIS;        
        comboBox_style = "disabled";
    }

   	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.date_type !== undefined) {
        dateType = opts.colModel.formatoptions.date_type;
    }
    addImg = "<img class=\"inputBtn\" alt=\"달력\" src=\"" + img_src + "\"  onClick=\"kioDatePickerBtnOnClick(\'"+txtId+"');\" style='height:22px;'" +  btn_style + " />";
    addComboBox ="<select id='"+comboBoxId+"' class='selectGrid' style='margin-left:2px;' "+comboBox_style+" >";

    var tmpTime="",tmpMin="";	
    for(var i=0;i<24;i++){
	   if(i<10) tmpTime = "0"+i;
	   else tmpTime = i;
	   
	   for(var j=0;j<=55;j=j+30){
		   if(j<10) tmpMin = "0"+j;
		   else tmpMin = j;	
		   if(cellvalueTime != tmpTime+tmpMin){
			   addComboBox += "<option value=\""+tmpTime+tmpMin+"\" label='"+tmpTime+":"+tmpMin+"'></option>";		
		   }else{
			   addComboBox += "<option value=\""+tmpTime+tmpMin+"\" label='"+tmpTime+":"+tmpMin+"' selected></option>";		 
		   }
	   }
   }	   
    addComboBox += "</select>";
    

	   
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
    if(cellvalueDate == null || cellvalueDate.length < max_len){
        newDate = "";
    }else if(regex.test(cellvalueDate)){
        // 현재 포맷이 Y-m-d 이면 그대로 리턴한다.
        newDate =  cellvalueDate; 
    }else{
    	cellvalueDate = cellvalueDate +"";

        if(dateType == 'MONTH') {
            var y = cellvalueDate.substring(0,4);
            var m = cellvalueDate.substring(4,6);
            newDate = String(y)+'-'+String(m);  //Y-m 형식 
        }else {
            var y = cellvalueDate.substring(0,4);
            var m = cellvalueDate.substring(4,6);
            var d = cellvalueDate.substring(6,8);
            newDate = String(y)+'-'+String(m)+'-'+String(d);    //Y-m-d 형식
        }
    }
    
    addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"'  maxlength=\"8\" onblur=\"kioAfterDateChange(this);\" onclick=\"kioBeforeDateChange(this);\" />";   
    
    var dateObj = "#"+txtId; 
    
    setTimeout(function(){
    	//$(dateObj).css("ime-mode","disabled");   // 한글입력불가 
    	//$(dateObj).numeric( { allow:'"' + DATE_DELIMETER+ '"' } );  // 숫자만 입력(허용문자 => 날짜 구분자'-') 
    	$(dateObj).numeric();
    	$(dateObj).focus(function() { 
	        $(this).select();
	    });
    	  	
    	
	 // calendar input box값 변셩시 validation 체크  처리
    	$(dateObj).bind('change keypress blur', function(e) {
    		
    		if (!(e.which == 13 || e.which == 0 || e.which == undefined)){
    			return;
    		}
    		 
			// 입력 가능한 컬럼일 경우 만 validation 체크 
			if(!($(dateObj).prop("readonly")) ) {
				
				if($(dateObj).val() == "" ) return; 

				date_type ='DAY';
				if($(dateObj).attr("dateType")  != undefined) {
					date_type = $(dateObj).attr("dateType").toUpperCase();
				}
				
				// 날짜 유효성 체크 및  년월을 제외한 일자만 입력할 경우 앞에 현재년월을 채워준다.
				var strYymmdd = "";
				if(date_type == 'MONTH') {
					strYymmdd = checkValidMonth($(dateObj).val() );
				 
				}else {
					strYymmdd = checkValidDate($(dateObj).val() );
				}
				$(dateObj).val(strYymmdd);
				 
				//nextFoucs($(dateObj));
				
				if( strYymmdd == "" ){
					// 날짜입력 오류 처리 
					showMessage('MSG_COM_VAL_013');
					$(dateObj).focus();
					//e.preventDefault();
					return;
				}
			}
		});
    }, 0);
    return  addInput+ addImg + addComboBox;
}





/**
 * 	주문 jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymdhhmm형식으로 변환
 */
function kioDateUnfmt(cellvalue, opts, cellObj){
	
	var cell_name = opts.colModel.name;  
	var txtId = "txt_"+opts.rowId+"_"+cell_name;
    var comboBoxId = "cb_"+opts.rowId+"_"+cell_name;
    var txtObj = $("#"+txtId);
    var comboBoxObj = $("#"+comboBoxId);
    var ret = txtObj.val().replace(/-/g, '');
    ret +=$("#"+comboBoxId+" option:selected").val();
	return ret;
}




/*
 * 주문 String 형식을 날짜 시간 형식으로 변환 하는 함수
 */
function kioFoDateCon(cellvalue, options, rowObject) {
	if(cellvalue == null || $.trim(cellvalue).length == 0) {return '';}
	
	cellvalue = cellvalue.replace(/[^0-9]/g,'');
	if($.trim(cellvalue).length == 0 || cellvalue.length < 10) {return '';}
	
	strYymmdd = checkValidDate(cellvalue.substring(0,8));
	if(strYymmdd==""){return '';} //날짜오류
	if(!( 0 <= parseInt(cellvalue.substring(8, 10)) && parseInt(cellvalue.substring(8, 10)) <= 23 )){ return "";} //시간요류
	if(!( 0 <= parseInt(cellvalue.substring(10, 12)) && parseInt(cellvalue.substring(10, 12)) <= 59 )){ return "";} //분요류
	
	var tmpTime = 30 * parseInt((parseInt(cellvalue.substring(10, 12)) / 30)) ;
	
	var strTime = "";
	if(tmpTime < 10 ){
		strTime = "0" + tmpTime;
	}else{
		strTime = tmpTime;
	}
		
	var cellDate = "";
	var cellTime = "";
	cellDate = cellvalue.substring(0, 4) +'-'+ cellvalue.substring(4, 6) +'-'+ cellvalue.substring(6, 8);
	cellTime = cellvalue.substring(8, 10) + ":"+ strTime;
		
	cellvalue = cellDate +" "+ cellTime;
	return cellvalue;
}


/*
 * 날짜 시간 형식을 String으로 변환 하는 함수
 */
function kioFoUnDateCon(cellvalue, options, rowObject) { 
	cellvalue = cellvalue.replace(/-/g, '');
	cellvalue = cellvalue.replace(/:/g, '');
	cellvalue = cellvalue.replace(/ /g, '');
	return cellvalue;
}


/*
 * 주문 String 형식을 숫자 형식으로 변환 반환
 */
function kioFoNumberFmt(cellvalue, options, rowObject) {
	if(cellvalue == null || $.trim(cellvalue).length == 0) {return '';}
	
	cellvalue = cellvalue.replace(/[^0-9]/g,'');
	return cellvalue;
}



/**
 * 주문 달력 이벤트
 * @param obj
 */
function kioDatePickerBtnOnClick(obj)
{
 
	var date_format = 'yy-mm-dd';
	var year_range  = 'c-40:c+10'; // Range of years to display in drop-down

    // DatePicker ( 월, 요일 ) 설정 정보 가져오기 
    var datePickerFormat = getDatePickerDefault(CONST.G_LANGUAGE);
	var $obj = $("#"+obj);
	
	$obj.datepicker(
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
		            showMonthAfterYear: true , //년 뒤에 월 표시,
		            onClose: function (formated,dates) { 
		                $(this).datepicker('destroy'); 			         
		            }		            
		    });
	$obj.datepicker('show');
	
}

/**
 * 날짜 필드 Validation 추가
 * flag : true , false 
 *        true : 초기값을 현재날짜로 셋팅
 *        false : 초기값 셋팅 하지 않음
 */
function dateFieldChange(dateObj,flag){
	var $dateObj = dateObj;
	//$dateObj.css("ime-mode","disabled");   // 한글입력불가 	
	//$dateObj.numeric( { allow:'"' + DATE_DELIMETER+ '"' } );  // 숫자만 입력(허용문자 => 날짜 구분자'-') 
	$dateObj.numeric(); 
	
	if(flag != undefined && !flag){
		;
	}else{
		$dateObj.val(formatDate(new Date()));
	}
	
	$dateObj.focus(function() { 
        $(this).select();
    });
	
	
	// calendar input box값 변셩시 validation 체크  처리 
	$dateObj.bind('change keypress blur', function(e) {

		if (!(e.which == 13 || e.which == 0 || e.which == undefined)){
			return;
		}
	
		// 입력 가능한 컬럼일 경우 만 validation 체크 
		if(!($(dateObj).prop("readonly")) ) {
			
			if($dateObj.val() == "" ) return; 
			date_type ='DAY';
			if($dateObj.attr("dateType")  != undefined) {
				date_type = $dateObj.attr("dateType").toUpperCase();
			}
			// 날짜 유효성 체크 및  년월을 제외한 일자만 입력할 경우 앞에 현재년월을 채워준다.
			var strYymmdd = "";
			if(date_type == 'MONTH') {
				strYymmdd = checkValidMonth($dateObj.val() );
			 
			}else {
				strYymmdd = checkValidDate($dateObj.val() );
			}
	
			$dateObj.val(strYymmdd);
			//nextFoucs($dateObj);
			            
			if( strYymmdd == "" ){
				// 날짜입력 오류 처리 
				showMessage('MSG_COM_VAL_013');
				$dateObj.focus();
				//e.preventDefault();
				return;
			}
		}
	});
}




/**
 * 주문 고객조회 팝업
*/
function kioSearchCustomer(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listCustomer.fo";
    var popupNm = "searchPopUpCustomer";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
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
 
		
	var popup = openWindowPopup(options);
	popup.focus();		

 }


/**
 * 주문 품목조회 팝업
*/
function kioSearchItem(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listItem.fo";
    var popupNm = "searchPopUpItem";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = 'true';
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    
    
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
			param : {po:poJSON,userFunc:userFunc,customerSearchImg:customerSearchImg}
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }





/**
 * 주문 운송사조회 팝업
*/
function kioSearchLsp(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listLspInfo.fo";
    var popupNm = "searchPopUpLsp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = 'true';
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    
    
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
			param : {po:poJSON,userFunc:userFunc,customerSearchImg:customerSearchImg}
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }






/**
 * 주문 고정물량 등록 고객조회 팝업
*/
function kioSearchFixOrderCustomer(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listFixOrderCustomer.fo";
    var popupNm = "searchPopUpFixOrderCustomer";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
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
 
		
	var popup = openWindowPopup(options);
	popup.focus();		

 }




/**
* 주문 입력 팝업 화면 호출
**/	
function showInputPopUp(data){
 
	var userFunc = "";
	
    if(data.userFunc != undefined && data.userFunc != ""){ userFunc = data.userFunc; }
    
    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "inputOrderPopUp", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/inputPopupOrder.fo", 
			width : 1010,	//사용자정의값 우선
			height: 722,
			scrollbars : "no",
			userFunc:userFunc,
			param : {}
	};	
    
    kioInputOrder(options);
}






/**
 * 주문 입력 팝업
*/
function kioInputOrder(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/inputPopupOrder.fo";
    var popupNm = "inputOrderPopUp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = true;
    var params = "";
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    if(args.param != undefined && args.param != ""){ params = args.param; }
    params['userFunc'] = userFunc;
    params['customerSearchImg'] = customerSearchImg;
    
    var po = {};	
	po['returnArr'] = "";
	po['mappingArr'] = "";
	
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
			param :  params
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }




/**
* 주문수정 팝업 화면 호출
**/	
function showEditPopUp(data){
 
	var soId = "";
	var userFunc = "";
	
    if(data.SO_ID != undefined && data.SO_ID != ""){ soId = data.SO_ID; }
    if(data.userFunc != undefined && data.userFunc != ""){ userFunc = data.userFunc; }
    
    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "editOrderPopUp", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/editOrder.fo", 
			width : 1010,	//사용자정의값 우선
			height: 722,
			scrollbars : "no",
			userFunc:userFunc,
			param : {soid:soId}
	};	
    
    
	kioEditOrder(options);
}



/**
 * 주문 수정 팝업
*/
function kioEditOrder(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/editOrder.fo";
    var popupNm = "editOrderPopUp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = true;
    var params = "";
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    if(args.param != undefined && args.param != ""){ params = args.param; }
    params['userFunc'] = userFunc;
    params['customerSearchImg'] = customerSearchImg;
    
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
			param :  params
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }





/**
 * 주문 차량조회조회 팝업
*/
function kioSearchVehicle(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listVehicle.fo";
    var popupNm = "searchPopUpVehicle";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = true;
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    
    
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
			param : {po:poJSON,userFunc:userFunc,customerSearchImg:customerSearchImg}
	
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
 
	
	var popup = openWindowPopup(options);
	popup.focus();		

 }






/**
* 복사확인 팝업 화면 호출
**/	
function showConfirmOrderCopyPopUp(data){

    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "confirmOrderCopy", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/confirmOrderCopy.fo", 
			width : 1010,	//사용자정의값 우선
			height: 722,
			scrollbars : "no",
			userFunc : data.userFunc,
			SO_ID : data.SO_ID
	};	
 
    kioConfirmOrderCopy(options);
}


/**
 * 복사확인 팝업
*/
function kioConfirmOrderCopy(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/confirmOrderCopy.fo";
    var popupNm = "confirmOrderCopy";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = false;
    var soId = "";
    var params = {};
  
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    if(args.SO_ID != undefined && args.SO_ID != ""){ soId = args.SO_ID; }
    
    params['soid'] = soId;
    params['userFunc'] = userFunc;
    params['customerSearchImg'] = customerSearchImg;
    
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
			param : params
	
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
 
	var popup = openWindowPopup(options);

	popup.focus();		

 }











/**
* 간편주문 입력 팝업 화면 호출
**/	
function showSimpleInputPopUp(data){
 
    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "inputSimpleOrderPopUp", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/inputSimpleOrder.fo", 
			width : 460,	//사용자정의값 우선
			height: 770,
			scrollbars : "no",
			userFunc : data.userFunc,
			param : {}
	};	
    
    kioSimpleInputOrder(options);
}






/**
 * 간편주문 입력 팝업
*/
function kioSimpleInputOrder(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/inputSimpleOrder.fo";
    var popupNm = "inputSimpleOrderPopUp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var params = "";
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.param != undefined && args.param != ""){ params = args.param; }
    params['userFunc'] = userFunc;
    
    var po = {};	
	po['returnArr'] = "";
	po['mappingArr'] = "";
	
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
			param :  params
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }











/**
* 간편주문수정 팝업 화면 호출
**/	
function showSimpleEditPopUp(data){
 
	var soId = "";
	var userFunc = "";
	
    if(data.SO_ID != undefined && data.SO_ID != ""){ soId = data.SO_ID; }
    if(data.userFunc != undefined && data.userFunc != ""){ userFunc = data.userFunc; }
    
    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "editSimpleOrderPopUp", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/editSimpleOrder.fo", 
			width : 460,	//사용자정의값 우선
			height: 770,
			scrollbars : "no",
			userFunc:userFunc,
			param : {soid:soId}
	};	
    
    
	kioSimpleEditOrder(options);
}



/**
 * 간편주문 수정 팝업
*/
function kioSimpleEditOrder(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/editSimpleOrder.fo";
    var popupNm = "editSimpleOrderPopUp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var params = "";
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    if(args.param != undefined && args.param != ""){ params = args.param; }
    params['userFunc'] = userFunc;
    
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
			param :  params
	
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
 
	var popup = openWindowPopup(options);
	popup.focus();		

 }





/**
 * 공개단계이력정보 팝업 
*/	
function kioOpenStepHstList(args){
	var o = {
				popupUrl: CONST.CONTEXT_PATH + "/kio/sub/listOpenStepHst.fo", //팝업페이지 URL
				popupNm: 'openStepHstList',	//팝업윈도우 name
				popupWidth: 580,	 //팝업 가로크기(없으면 기본값)
				popupHeight: 410 //팝업 세로크기(없으면 기본값)
			};
	var options = {
					windowName: o.popupNm, // name of window
					windowURL: o.popupUrl, 
					width : o.popupWidth,	//사용자정의값 우선
					height: o.popupHeight,
					param : {
								SO_ID:args.SO_ID
							}
					};	
	
	var popup = openWindowPopup(options);
	popup.focus();		
}



/**
 * 계약정보 확인 팝업 
*/	
function kioContractInfo(args){
	var o = {
				popupUrl: CONST.CONTEXT_PATH + "/kio/sub/searchContractInfo.fo", //팝업페이지 URL
				popupNm: 'searchContractInfo',	//팝업윈도우 name
				popupWidth: 900,	 //팝업 가로크기(없으면 기본값)
				popupHeight: 450 //팝업 세로크기(없으면 기본값)
			};
	
	var options = {
					windowName: o.popupNm, // name of window
					windowURL: o.popupUrl, 
					width : o.popupWidth,	//사용자정의값 우선
					height: o.popupHeight,
					param : {
								CNTRT_NO:args.CNTRT_NO
							  , TYPE:args.TYPE 
							}
					};	
	
	var popup = openWindowPopup(options);
	popup.focus();		
}




/**
 * 그리드 높이 설정(IE7용)
*/
function gridHeight(height)
{	
	$('div.ui-jqgrid-bdiv>table.ui-jqgrid-btable>tbody>tr').each(function () {	        
		if ($(this).hasClass("jqgrow")) {
	    document.getElementById($(this).attr("id")).style.height = height+"px";  
	    }
	});
	
	$('div.frozen-bdiv>table.ui-jqgrid-btable>tbody>tr').each(function () {	
	    if ($(this).hasClass("jqgrow")) {
	    $(this).height(parseInt(height)+2);	
	    }
	});}


/**
 * IE버전확인
*/
function getInternetExplorerVersion() {
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		rv = parseFloat(RegExp.$1);
	}
	return rv;
}





/**
 * 숫자와 특수문자 허용,한글 방지 추가
*/
function numberNotHangul(obj,ALLOW_DELIMETER){	
	var $obj = obj;
	$obj.css("ime-mode","disabled");	
	$obj.keyup(function(e){
		if($(this).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '') != $(this).val()){
			$(this).val($(this).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));
		}
		return e;
	});	
	
	
	//$(dateObj).numeric( { allow:'"' + DATE_DELIMETER+ '"' } );  // 숫자만 입력(허용문자 => 날짜 구분자'-') 
	if(ALLOW_DELIMETER != undefined && ALLOW_DELIMETER != null && $.trim(ALLOW_DELIMETER) != ""){
		$obj.numeric({allow:'"'+ALLOW_DELIMETER+'"'});
	}else{
		$obj.numeric();
	}	
	
}

/**
 * 한글 방지 추가
*/
function notHangul(obj){	
	var $obj = obj;
	$obj.css("ime-mode","disabled");	
	$obj.keyup(function(e){
		if($(this).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '') != $(this).val()){
			$(this).val($(this).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));
		}		
		return e;
	});
}



/**
 * tabIndex 셋팅
 */

function initTabIndex(tabElms){
	$("*").each(function (index, domEle) {
		$(domEle).attr("tabindex","-1");			
	 
    });
    
	var index = 10;
	for(var i=0; i<tabElms.length; i++){		
	
		if(tabElms[i].attr("readonly") == undefined){
			tabElms[i].attr("tabindex",++index);			
		}
		
	}
	
	
	
}


/**
 * 금액 계산 함수
 */
function calAmt(elemReqQty,elemRateAmt,elemAmt,reqClsCd){
	
	//NULL값 처리
	if(elemReqQty.val() == "" || elemRateAmt.val() == ""){		
		return;
	}
	
	
	var $reqQty = elemReqQty;
	var $rateAmt = elemRateAmt;
	var $amt = elemAmt;
	var reqQtyFloat = parseFloat($reqQty.val());
   	var reqQtyInt = parseInt($reqQty.val());	     	
   	var reqQty  = $reqQty.val();
   	var rateAmtFloat = parseFloat($rateAmt.val().replace(/,/g, ''));
   	var unitVal = reqQty;
   	var amt = "";
   	
   	if(reqClsCd == "3"){
		$reqQty.val(parseInt($reqQty.val()));
	}else{
		$reqQty.val(parseFloat($reqQty.val()));
	}
			
	reqQtyFloat = parseFloat($reqQty.val());
   	reqQtyInt = parseInt($reqQty.val());	     	
   	reqQty  = $reqQty.val();
   	rateAmtFloat = parseFloat($rateAmt.val().replace(/,/g, ''));
   	unitVal = reqQty;
   	
   	//정상적인 의뢰량을 입력시에만 처리함
   	if(reqQtyFloat == reqQty){			 
		 //요율 구분이 대수일 경우엔 금액 = 요율금액을 그대로 유지한다.
		 if(reqClsCd == "3"){
		 	 unitVal = 1;				 
		     if(reqClsCd == "3" && reqQtyInt > 99){
		     	$reqQty.val("99");
		     	showMessage("MSG_COM_VAL_014","요율구분이 대당일 경우 의뢰량은 99를 넘을수 없습니다");
		     }
		    amt = rateAmtFloat;	
		 }else{			      
	    	 amt = rateAmtFloat * unitVal;			      
	     }
	     $amt.val(parseInt(amt));  
	    
	     kioAfterAmtChange($amt);    
    }
	
}


/**
 *  현재 object의 다음 index에 포커스
 */
function nextFoucs(dateObj){
	var $dateObj = dateObj;	
	var tabables = $("*[tabindex != '-1']:visible");
    var index = tabables.index($dateObj);
    tabables.eq(index + 1).focus();
}

//승진

//우편번호 포맷 변경(하이픈 추가)
function kioAfterPostChange(obj) {
	if(obj == null || $.trim(obj).length == 0){ 
		return ''; 
	}
	obj = obj.replace(/-/g, '').replace(/(\d{3})(\d{3})/g, '$1-$2');
	return obj;
}

//우편번호 포맷 변경(하이픈 추가)
function kioAfterPostChange2(obj) {
	var cellvalue = $(obj).val();
	if(cellvalue == null || $.trim(cellvalue).length == 0){ 
		return ''; 
	}
	cellvalue = cellvalue.replace(/-/g, '').replace(/(\d{3})(\d{3})/g, '$1-$2');
	$(obj).val(cellvalue);
}

//우편번호 포맷 변경(하이픈 제거)
function kioBeforePostChange(obj){
	var cellvalue = $(obj).val();
	if(cellvalue == null || $.trim(cellvalue).length == 0){
		return ''; 
	}
	var re = cellvalue.replace(/-/g, '');
	$(obj).val(re);
}

//날짜 변경 포맷(하이픈 추가)
function kioAfterDateChange(obj) {
	var cellvalue = $(obj).val();
	if(cellvalue == null || $.trim(cellvalue).length == 0){
		return '';
	}
    cellvalue = cellvalue.replace(/-/g, '').replace(/(\d{4})(\d{1,2})(\d{2})/g, '$1-$2-$3');
    $(obj).val(cellvalue);
}
//날짜 변경 포맷(하이픈 추가)
function kioAfterDateChange2(obj) {
	if(obj == null || $.trim(obj).length == 0){
		return '';
	}
	obj = obj.replace(/-/g, '').replace(/(\d{4})(\d{1,2})(\d{2})/g, '$1-$2-$3');
	return obj;
}
//날짜 변경 포맷(하이픈 제거)
function kioBeforeDateChange(obj) {
	var cellvalue = $(obj).val();
	if(cellvalue == null || $.trim(cellvalue).length == 0){
		return ''; 
	}
	var re = cellvalue.replace(/-/g, '');	//하이픈 제거
	$(obj).val(re);
}

//금액 변경_포맷
function kioAfterAmtChange(obj){
	var cellvalue = $(obj).val();
	cellvalue = cellvalue.replace(/,/g, '');
	var retValue = '';
    for(var i=1 ; i <= cellvalue.length; i++){
		if(i > 1 && (i % 3) == 1){
			retValue = cellvalue.charAt(cellvalue.length - i) + "," + retValue;
		} else {
			retValue = cellvalue.charAt(cellvalue.length - i) + retValue;
		}
	}
    checkNumber(obj);
	$(obj).val(retValue); 			
	
}

//금액 변경_포맷
function kioAfterAmtChange2(obj){
	var cellvalue = obj + "";
	var retValue = '';
    
	cellvalue = cellvalue.replace(/[^0-9]/g,'');
	if($.trim(cellvalue) == "" || cellvalue == "undefined") return "";
	else {
		for(var i=1 ; i <= cellvalue.length; i++){
			if(i > 1 && (i % 3) == 1){
				retValue = cellvalue.charAt(cellvalue.length - i) + "," + retValue;
			} else {
				retValue = cellvalue.charAt(cellvalue.length - i) + retValue;
			}
		}
	}
	return retValue; 				 
}
//금액 변경_포맷
function kioBeforeAmtChange(obj){
	var cellvalue = $(obj).val();
	cellvalue = cellvalue.replace(/[^0-9]/g,'');
	
	if(cellvalue == null || $.trim(cellvalue).length == 0){
		return ''; 
	}
	var re = cellvalue.replace(/,/g, '');
	$(obj).val(re);
}

//금액 변경_포맷
function kioBeforeAmtChange2(obj){
	if(obj == null || $.trim(obj).length == 0){
		return ''; 
	}
	return obj.replace(/,/g, '');
}

//전화번호 나누기
function hpAfterChage(obj, flag){
	var result = "";
	
	if(obj == null || $.trim(obj).length == 0){
		return ''; 
	}
	var temp = obj.split('-');
	result = temp[flag - 1];
	return result;
	
}

//노드 검색 팝업
function kioSearchStNode(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/listStNode.fo";
    var popupNm = "searchPopUpStNode";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";

   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    
    var po = {};	
    po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
 
	
	var popup = openWindowPopup(options);
	popup.focus();		

}
 
//우편번호(주소) 검색
function kioSearchAddress(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/searchAddress.fo";
    var popupNm = "searchPopUpAddress";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    
    var po = {};	
    po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
 

	var popup = openWindowPopup(options);
	popup.focus();		

}

function kioItemDetail(args){
	var o = {
		popupUrl: CONST.CONTEXT_PATH + "/kio/sub/detailItemInfo.fo", //팝업페이지 URL
		popupNm: 'searchItemPopup',	//팝업윈도우 name
		popupWidth: 580,	 //팝업 가로크기(없으면 기본값)
		popupHeight: 410 //팝업 세로크기(없으면 기본값)
	};
	var options = {
			windowName: o.popupNm, // name of window
			windowURL: o.popupUrl, 
			width : o.popupWidth,	//사용자정의값 우선
			height: o.popupHeight,
			param : {
						CUST_SHPR_ID:args.CUST_SHPR_ID,
						SO_ID:args.SO_ID,
						DO_COUNTTOT:"true"
					}
	};	
	
	var popup = openWindowPopup(options);
	popup.focus();		
	
}




//고정 물량 등록 팝업
function kioNewFixOrder(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/inputPopUpFixOrder.fo";
	var popupNm = "newFixOrder";
	var popupWidth = '850';
	var popupHeight = '550';
	var popupScrollbars = '1';
	var userFunc = "";
	 
	if(args.name != undefined && args.name != ""){ popupNm = args.name; }
	if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
	if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
	if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
	if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
	  
	var po = {};	
	po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
	var popup = openWindowPopup(options);
	popup.focus();		

}




//고정 물량 수정 팝업
function kioEditGpFixOrder(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/editPopUpFixOrder.fo";
	var popupNm = "newFixOrder";
	var popupWidth = '850';
	var popupHeight = '550';
	var popupScrollbars = '1';
	var userFunc = "";
	 
	if(args.name != undefined && args.name != ""){ popupNm = args.name; }
	if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
	if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
	if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
	if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
	  
	var po = {};	
	po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
	var popup = openWindowPopup(options);
	popup.focus();		

}



/**
* 고정 물량 수정 팝업 호출
**/	
function showEditFixPopUp(data){
 
	var fixId = "";
	var userFunc = "";	
	var width = "";	
	var height = "";
	
    if(data.FIX_OD_ID != undefined && data.FIX_OD_ID != ""){ fixId = data.FIX_OD_ID; }
    if(data.userFunc != undefined && data.userFunc != ""){ userFunc = data.userFunc; }
    if(data.width != undefined && data.width != ""){ width = data.width; }
    if(data.height != undefined && data.height != ""){ height = data.height; }
    
    var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: "editFixOrderPopUp", // name of window
			windowURL: CONST.CONTEXT_PATH + "/kio/sub/editFixOrder.fo", 
			width : width,	//사용자정의값 우선
			height: height,
			scrollbars : "1",
			param : {fixid:fixId,userFunc:userFunc}
	};	
    
    kioEditFixOrder(options);
}



/**
 * 고정 물량 수정 팝업
*/
function kioEditFixOrder(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/editFixOrder.fo";
    var popupNm = "editFixOrderPopUp";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
    var customerSearchImg = true;
    var params = "";
    
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    if(args.customerSearchImg != undefined && args.customerSearchImg != ""){ customerSearchImg = args.customerSearchImg; }
    if(args.param != undefined && args.param != ""){ params = args.param; }

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
			param : params
	
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
 

	var popup = openWindowPopup(options);
	popup.focus();		

 }

/**
 * 공개단계이력정보 팝업 
*/	
function kioEoScdList(args){
	var o = {
				popupUrl: CONST.CONTEXT_PATH + "/kio/sub/listEoScdHst.fo", //팝업페이지 URL
				popupNm: 'eoScdList',	//팝업윈도우 name
				popupWidth: 580,	 //팝업 가로크기(없으면 기본값)
				popupHeight: 410 //팝업 세로크기(없으면 기본값)
			};
	var options = {
					windowName: o.popupNm, // name of window
					windowURL: o.popupUrl, 
					width : o.popupWidth,	//사용자정의값 우선
					height: o.popupHeight,
					param : {
								SO_ID:args.SO_ID
							}
					};	
	
	var popup = openWindowPopup(options);
	popup.focus();		
}


//조직정보
function kioCoprId(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/searchCorpInfo.fo";
    var popupNm = "corpIdpopup";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    
    var po = {};	
    po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
 

	var popup = openWindowPopup(options);
	popup.focus();		

}

//실행거점
function kioExeCorpId(args){
	var popupUrl = CONST.CONTEXT_PATH + "/kio/sub/searchExeCorpInfo.fo";
    var popupNm = "exeCorpIdpopup";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    
    var po = {};	
    po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
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
 

	var popup = openWindowPopup(options);
	popup.focus();		

}