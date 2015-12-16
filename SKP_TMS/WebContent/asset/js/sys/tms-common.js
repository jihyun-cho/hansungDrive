/*
 * 팝업창 닫기
 */
function btnTmsPopupClose() {
	window.close();
	return true;
}


/*
 * String 형식을 날짜 시간 형식으로 변환 하는 함수
 */
function tmsFoDateCon(cellvalue, options, rowObject) {
	if(cellvalue == null || $.trim(cellvalue).length === 0) {return '';}

	var cellDate = "";
	var cellTime = "";
	cellDate = cellvalue.substring(0, 4) +'-'+ cellvalue.substring(4, 6) +'-'+ cellvalue.substring(6, 8);
	cellTime = cellvalue.substring(8, 10) +":"+ cellvalue.substring(10, 12);
	
	cellvalue = cellDate +" "+ cellTime;
	return cellvalue;
}


/*
 * 날짜 시간 형식을 String으로 변환 하는 함수
 */
function tmsFoUnDateCon(cellvalue, options, rowObject) { 
	cellvalue = cellvalue.replace(/-/g, '');
	cellvalue = cellvalue.replace(/:/g, '');
	cellvalue = cellvalue.replace(/ /g, '');
	return cellvalue;
}


function tmsDateFmt(cellvalue, opts, rwdat, _act){	
	
	var mnfScd = rwdat.MNF_SCD;
	var exeAuthScd = rwdat.EXE_AUTH_SCD;
	var flag = rwdat.FLAG; //지사인지(Y) 운송가맹점인(N)
	
	if(cellvalue == "-"){
		return "-";
		
	}else{
		opts['rowId'] = getPRowId(opts.rowId, opts.gid);
		var cell_name = opts.colModel.name;
		
	    var addImg =  "";
	    var addComboBox = "";
	    var addComboBoxSub = "";
	    var addInput ="";
	    
	    var txtId = "txt_"+opts['rowId']+"_"+cell_name;
	    var comboBoxId = "cb_"+opts['rowId']+"_"+cell_name;
	    var comboBoxIdSub = "cbSub_"+opts['rowId']+"_"+cell_name;
	    
	    var cellvalueDate ="";
	    var cellvalueTime = "";
	    var cellvalueMin = "";

	    if(nvl(cellvalue,"") == "" || isNaN(cellvalue) || cellvalue.length < 12 ){  
	    	var tempDate = new Date();
	    	var hours = tempDate.getHours();
	    	var min = tempDate.getMinutes();
	    	
	    	cellvalueDate = formatDate(new Date());
	    	cellvalueTime = hours;
	    	cellvalueMin = min;
	    	cellvalue = cellvalueDate + cellvalueTime + cellvalueMin + ""; 
	    }else{
	    	cellvalueDate = cellvalue.substring(0,8);
	    	cellvalueTime = cellvalue.substring(8,10);
	    	cellvalueMin = cellvalue.substring(10,12);
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
/*	    if( !editCheck || (opts.colModel.editableOnlyAdd && _act == 'add') ) {
	        //입력 불가능한 Cell일 경우
	        btn_style = "style='disabled;' ";
	        //img_src   = CONST.IMG_PATH_CAL_DIS;        
	        comboBox_style = "disabled";
	    }
*/
	    if(mnfScd > 200) {
	        onClick = "onClick=\"\"";
	        comboBox_style = "disabled";
	    }else{
	    	if(exeAuthScd == 'A10' || exeAuthScd == 'A11' || exeAuthScd == 'A12'){//운송가맹점이 조작
	    		if(flag == 'Y'){
	    			onClick = "onClick=\"\"";
	    	        comboBox_style = "disabled";
	    		}else{
	    			if(mnfScd > 200) {
	        	        onClick = "onClick=\"\"";
	        	        comboBox_style = "disabled";
	        	    }else{
	        	    	onClick = "onClick=\"tmsDatePickerBtnOnClick(\'"+txtId+"');\"";
	        	    }
	    		}
		    }else{//지사가 조작
		    	if(flag == 'Y'){
		    		onClick = "onClick=\"tmsDatePickerBtnOnClick(\'"+txtId+"');\"";
		    	}else{
		    		onClick = "onClick=\"\"";
	    	        comboBox_style = "disabled";
		    	}
		    }
	    }
	    
    	
	    /*
	    if(mnfScd > 200) {
	        onClick = "onClick=\"\"";
	        comboBox_style = "disabled";
	    }else{
	    	onClick = "onClick=\"tmsDatePickerBtnOnClick(\'"+txtId+"');\"";
	    }
	    */
	   	if(opts.colModel.formatoptions !== undefined && opts.colModel.formatoptions.date_type !== undefined) {
	        dateType = opts.colModel.formatoptions.date_type;
	    }
	   	
	    addImg = "<img class=\"inputBtn\" alt=\"달력\" src=\"" + img_src + "\"   style='height:22px;' "+onClick+"/>";
	    addComboBox = "<select id='"+comboBoxId+"' class='selectGrid' style='margin-left:2px;' "+comboBox_style+" >";
	    addComboBoxSub = "<select id='"+comboBoxIdSub+"' class='selectGrid' style='margin-left:2px;' "+comboBox_style+" >";

	    //시간
	    var tmpTime = "";
//	    addComboBox += "<option value=\"\" >선택</option>";		
	    for(var i = 0; i < 24; i++){
		   if(i < 10){
			   tmpTime = "0"+i;
		   }else{
			   tmpTime = i;
		   }
		   
		   if(cellvalueTime != tmpTime){
			   addComboBox += "<option value=\""+tmpTime+"\" label='"+tmpTime+"'></option>";		
		   }else{
			   addComboBox += "<option value=\""+tmpTime+"\" label='"+tmpTime+"' selected></option>";		 
		   }
	   }	   
	   addComboBox += "</select>";
	   
	    //분
		var tmpMin = "";
//		addComboBoxSub += "<option value=\"\" >선택</option>";   
		for(var i = 0; i < 60; i++){
			if(i < 10){
				tmpMin = "0"+i;
			}else{
				tmpMin = i;
			}
			if(cellvalueMin != tmpMin){
				addComboBoxSub += "<option value=\""+tmpMin+"\" label='"+tmpMin+"'></option>";		
			}else{
				addComboBoxSub += "<option value=\""+tmpMin+"\" label='"+tmpMin+"' selected></option>";		 
			}
		}	   
		addComboBoxSub += "</select>";
		   
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
	    
	    
	    if(mnfScd > 200){
	    	addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' readonly=\"readonly\"/>";
	    }else{
	    	if(exeAuthScd == 'A10' || exeAuthScd == 'A11' || exeAuthScd == 'A12'){//운송가맹점이 조작
	    		if(flag == 'Y'){
	    			addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' readonly=\"readonly\"/>";
	    		}else{
	    			if(mnfScd > 200){
	    				addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' readonly=\"readonly\"/>";
	    			}else{
	    				addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' maxlength=\"8\" onblur=\"kioAfterDateChange(this);\" onclick=\"kioBeforeDateChange(this);\" />";
	    			}
	    		}
				
		    }else{//지사가 조작
		    	if(flag == 'Y'){
		    		addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' maxlength=\"8\" onblur=\"kioAfterDateChange(this);\" onclick=\"kioBeforeDateChange(this);\" />";
		    	}else{
		    		addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' readonly=\"readonly\"/>";
		    	}
		    }
	    }
    	
	    	
	    
	    
	    /*
	    if(mnfScd > 200){
	    	addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' readonly=\"readonly\"/>";
	    }else{
	    	addInput = "<input type='text' id='"+txtId+"' class=\"inputGrid\" style=\"width:70px;ime-mode:disabled; \"  value='"+newDate+"' maxlength=\"8\" onblur=\"kioAfterDateChange(this);\" onclick=\"kioBeforeDateChange(this);\" />";
	    }
	    */
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
					 
					nextFoucs($(dateObj));
					
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
	    return  addInput + addImg + addComboBox + addComboBoxSub;
	}
}
/**
 * 	주문 jqGrid date unformatter (FO1)
 *		- Y-m-d 형식 => Ymdhhmm형식으로 변환
 */
function tmsDateUnfmt(cellvalue, opts, cellObj){
	
	var cell_name = opts.colModel.name;  
	var txtId = "txt_"+opts.rowId+"_"+cell_name;
    var comboBoxId = "cb_"+opts.rowId+"_"+cell_name;
    var comboBoxIdSub = "cbSub_"+opts.rowId+"_"+cell_name;
    var txtObj = $("#"+txtId);
    var comboBoxObj = $("#"+comboBoxId);
    var comboBoxObjSub = $("#"+comboBoxIdSub);
    var ret = txtObj.val().replace(/-/g, '');
    ret +=$("#"+comboBoxId+" option:selected").val();
    ret +=$("#"+comboBoxIdSub+" option:selected").val();
	return ret;
}

/**
 * 주문 달력 이벤트
 * @param obj
 */
function tmsDatePickerBtnOnClick(obj)
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

function tmsUpLoad(cellvalue, opts, rwdat, _act){
	//E:분실, N:미확인, Y:확인
	var result = "";
	var mnfScd = rwdat.MNF_SCD;
	var exeAuthScd = rwdat.EXE_AUTH_SCD;
	var flag = rwdat.FLAG;
	
	if(rwdat.STOP_CCD == '1'){
		result = "-";
	}else{
		if(rwdat.SEQ == '4'){
			var count = opts.rowId / 4;
			if(cellvalue == 'E'){
				return "인수증 분실";
			}else if(cellvalue == 'N'){
				/*
				result += "<form id=\"frm"+ count +"\" name=\"frm"+ count +"\" enctype=\"multipart/form-data\" method=\"post\" target=\"receiptframe\">";
				result += "<input type=\"file\" id=\"file\" name=\"file\"></input>";
				result += "<input type=\"hidden\" name=\"upLoadShmptNo"+ count +"\" value=\""+ rwdat.SHMPT_NO +"\"></input>";
				result += "<input type=\"hidden\" name=\"upLoadMnfNo"+ count +"\" value=\""+ rwdat.MNF_NO +"\"></input>";
				result += "<input type=\"hidden\" name=\"upLoadVhclNo"+ count +"\" value=\""+ rwdat.VHCL_NO +"\"></input>";
				result += "<input type=\"hidden\" name=\"count\" value=\""+ count +"\"></input>";
				result += "<input type=\"button\" value=\"인수증전송\" onclick=\"javascript:receipt('"+ count +"');\"></input>";
				result += "</form>";
				*/
				if(exeAuthScd == 'A10' || exeAuthScd == 'A11' || exeAuthScd == 'A12'){//운송가맹점이 조작
					if(flag == 'Y'){
						return '-';
					}else{
						if(mnfScd > 200){
							return '-';
						}else{
							result += "<form id=\"frm"+ count +"\" name=\"frm"+ count +"\" enctype=\"multipart/form-data\" method=\"post\" target=\"receiptframe\">";
							result += "<input type=\"file\" id=\"file"+ count +"\" name=\"file\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadShmptNo\" value=\""+ rwdat.SHMPT_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadMnfNo\" value=\""+ rwdat.MNF_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadmnfScd\" value=\""+ rwdat.MNF_SCD +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadVhclNo\" value=\""+ rwdat.VHCL_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"count\" value=\""+ count +"\"></input>";
							result += "<input type=\"button\" value=\"인수증전송\" onclick=\"javascript:receipt('"+ count +"','"+ rwdat.MNF_SCD +"', '"+ rwdat.TRANS_DIVISION +"', '"+ rwdat.INS_TYPE+"');\"></input>";
							result += "</form>";
						}	
					}
				}else{
					if(flag == 'Y'){
						if(mnfScd > 200){
							return '-';
						}else{
							result += "<form id=\"frm"+ count +"\" name=\"frm"+ count +"\" enctype=\"multipart/form-data\" method=\"post\" target=\"receiptframe\">";
							result += "<input type=\"file\" id=\"file"+ count +"\" name=\"file\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadShmptNo\" value=\""+ rwdat.SHMPT_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadMnfNo\" value=\""+ rwdat.MNF_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadmnfScd\" value=\""+ rwdat.MNF_SCD +"\"></input>";
							result += "<input type=\"hidden\" name=\"upLoadVhclNo\" value=\""+ rwdat.VHCL_NO +"\"></input>";
							result += "<input type=\"hidden\" name=\"count\" value=\""+ count +"\"></input>";
							result += "<input type=\"button\" value=\"인수증전송\" onclick=\"javascript:receipt('"+ count +"','"+ rwdat.MNF_SCD +"', '"+ rwdat.TRANS_DIVISION +"', '"+ rwdat.INS_TYPE+"');\"></input>";
							result += "</form>";
						}
					}else{
						return '-';
					}
				}
				
			}else if(cellvalue == 'Y'){
				return "인수증 완료 처리";
			}
		}else{
			result = "-";
		}
	}
	return result;
}


/**
 * 주문 운송사조회 팝업
*/
function tmsSearchLsp(args){
    
    var popupUrl = CONST.CONTEXT_PATH + "/tms/popup/listLspPopup.fo";
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