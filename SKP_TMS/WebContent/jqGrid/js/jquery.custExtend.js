/**로그아웃 URL*/
var _COMMON_LOGOUT_PAGE = "/tms";	
/**ajax 멱등제어*/
var _LOADING_CNT = 0;

/**
 * 로딩 이미지 노출 시작
 * @author 김응기c
 */
function loading_st(){
   if(_LOADING_CNT <= 1){
	   _LOADING_CNT++;
	   $("#loading").show();
	   setTimeout("loading_ed();",60000);
   }
}

/**
 * 로딩 이미지 노출 종료
 * @author 김응기c
 */
function loading_ed(){
	_LOADING_CNT--;
	if(_LOADING_CNT <= 0){
		$("#loading").hide();
		_LOADING_CNT = 0;
	}
}


/**
 * <pre>
 * ajax에러 중 세션이 끊겼을 때 호출 
 * @author 김응기c , 조지현j
 * </pre>
 */
function sesChk() {
	alert("session 시간이 만료 되었습니다. 다시 로그인 부탁 드립니다");
	location.replace( _COMMON_LOGOUT_PAGE );
}





///////////////////////////////////////////////////////   jQuery 확장 - start   //////////////////////////////////////////////////////////////

/**
* jqGrid format currency 커스텀마이즈 - 초기값
*/
function custCurrency(val , obj , row){
	if(val) {
		val = val.toString().currency();	
	}
	return val;
}


/**
* jqGrid format currency 커스텀마이즈 - 옵션값:dataEvents
*/
function custFnCurrency(e){
	$(e.target).val($(e.target).val().replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '').replace(/a-z/gi,'').replace(/[ #\&\+\-%@=\/\\\:;,'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/g,'')); 
	if ( $(e.target).val().indexOf(".") != -1 ) {
		
		var sosu = $(e.target).val().split(".")[1];

		if ( sosu != "" ) {
			if ( sosu.indexOf(".") != -1 ) {
				sosu = sosu.split(".")[0];
			}
			var ret = $(e.target).val().split(".")[0]+"."+sosu.charAt(0);
			$(e.target).val(ret);	
		}
		
	}
	$(e.target).val($(e.target).val().currency());
	
	return e;
}


(function ($) {
	
	
	// ajax 호출 함수
	$.fn.tmsAjax = function(params, callMethod) {
		var targetID = $(this);
		var callbacks = $.Callbacks();
		//var callFunction = callMethod;

		var param = $.extend({
			url : null,
			data : {}
		}, params || {});

		//loading_st();
		
		$.ajax({
			async : param.async,
			type : "post",
			url : param.url,
			cache : false,
			dataType : "json",
			data : param.data,
			success : function(data, status) {
				callbacks.add(callMethod);
				callbacks.fire(targetID, data);
				//loading_ed();
			},
			error : function(data, status, errorThrown) {
				//loading_ed();
				if (data.responseText.indexOf('sessionTimeOutCheck') != -1 ) sesChk();

			}
		});
	};
	
	/**
	 *  자신(jQuery랩핑된 폼 객체)이 가지고 있는 폼필드들을 객체로 만들어 리턴한다. (FO1)
	 *      - 내부적으로 사용되고 있는 serializeArray() 메서드가 disabled 된 폼필드들을 가져오지 않는 것에 주의할 것 !!!
	 */ 
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    var inputValue = "";
	    
	    $.each(a, function() {
	        inputValue = this.value;
	        //---------- Date형 Input Data unfomat처리 - start ----------
	        if($('#' + this.name).hasClass('calendar') == true) {
	            inputValue = inputValue.replace(/-/g, '');  //하이픈 제거
	        }else if($('#' + this.name).hasClass('number') == true && $('#' + this.name).attr("mask") ) {
	            inputValue = inputValue.replace(/,/g, '');  //,  제거
	        }   
	        //---------- Date형 Input Data unfomat처리 - end   ----------
	        if (o[this.name] !== undefined) {   
	            if (!o[this.name].push) {   
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(inputValue || '');    
	        } else {    
	            o[this.name] = inputValue || '';    
	        }
	    });
	    return o;
	};  
	
	
	/**
	 * 	서버에서 리턴받은 javascript객체를 자신(jQuery랩핑된 폼 객체)에게 바인딩하는 함수.
	 * 	두 번째 인수인 datasetName이 주어지지 않으면 넘어온 data의 속성 각각을 폼의 하위엘리먼트와 매칭시키고,
	 * datasetName이 주어지면 넘어온 data에서 해당 datasetName을 가진 key를 찾아서 그 하위 속성들을 폼의 하위엘리먼트와 매칭시킨다. 
	 */	
	$.fn.populateToForm = function(resultData, datasetName){
		var $frm = this,
			  frm = $frm.get(0),
			  data;
		
		if(frm.tagName.toUpperCase() !== 'FORM'){
			alert('populateToForm() - form element use only');
			return;
		}
		
		//데이터셋명이 없을 경우 - 현재 data객체의 속성을 그대로 폼엘리먼트와 매칭
		if(datasetName == null){
			data = resultData;
			
		//데이터셋명이 존재할 경우 - 현재 data객체에서 데이터셋명을 가진 객체를 얻어내어 하위 속성들을 폼엘리먼트와 매칭	
		}else{
			if( ! resultData[datasetName]){
				alert('There is no dataset named '+datasetName);
				return;
			}
			data = resultData[datasetName]['data'][0];
	
			//데이터셋일 경우만 binding할 데이타가 없을 경우 form을 clear 시킨다. 
			if(data == undefined) { 
				frm.reset();
				return;
			}
		}
		populateProcess(data, $frm);
	};
	
	
	/**
	 *   populateToForm에서 내부적으로 쓰이는 함수 (FO1=>eHR)
	 */
	populateProcess = function(data, $frm){
	    
	    var dataValue;
	    for(dataKey in data){
	        
	        dataValue = data[dataKey];
	        //dc(dataKey + "=" + dataValue);
	        
	        $frm.find(':input').each(function(idx){
	            
	            var input = this,
	                  $input = $(input),
	                  inputName = input.name,
	                  initValue = input.value;
	
	            if(input.name != "undefined" && dataKey === inputName){
	                var  type = input.type.toLowerCase();
	
	                if(type === 'radio'){
	                    if(dataValue === initValue){
	                        //dc('1 - input  : ' + type + ' '+  inputName + ' ' + initValue + ' ' + dataValue);
	                        $input.attr('checked', 'checked');
	                    }
	                    
	                }else if(type == 'checkbox'){
	                    if(dataValue.push){ //체크박스의 값이 배열일 경우
	                        $input.val(dataValue);  //일반적인 처리
	                    }else{  //체크박스의 값이 배열이 아닐 경우의 예외처리, 배열일 경우에는 val() 함수만으로도 처리 가능하다.
	                        $input.val([dataValue]);
	                    }
	                    
	                }else{
	
	                    //---------- Date형/숫자형 Input Data fomat처리 - start ----------
	                    if($input.hasClass('calendar') == true) {
	                        // 날짜형 Format 
	                        dataValue = formatDateStr(dataValue); 
	                    }else if($input.hasClass('number') == true && $('#' + this.name).attr("mask")) {
	
	                        // 숫자형 Format 
	                        if( $(this).attr("dec")  == undefined) { 
	                            dataValue = formatNo(dataValue);
	                        }else {
	                            dataValue = formatNo(dataValue, $(this).attr("dec") );
	                        }
	                    }
	                    //---------- Date형/숫자형 Input Data fomat처리 - end   ----------
	                    
	                    $input.val(dataValue);  //일반적인 처리
	                    
	                }
	            }
	        });
	    }           
	};	
	
	
	/**
	 * 입력 Form Validation 체크(필수입력, Byte 입력 제한 등...(eHR)) 
	 */
	$.fn.checkFormValidation = function()
	{
	    var $frm    = this;
	    var rsltChk = true;
	    
	    $frm.find(':input').each(function(){
	
	        var $input = $(this);
	
	        // 1. 필수 입력 체크 
	        if($input.attr("required") != undefined){
	            if(checkRequired($input) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	
	        // 2. Byte 입력 제한  체크
	        if($input.attr("maxbyte") != undefined){
	            if(checkMaxbyte($input, $input.attr("maxbyte")) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	
	        // 3. 숫자 입력 오류  체크  
	        if($input.attr("number") != undefined){
	            if(checkNumber($input) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	
	        // 4. 영문자 입력 오류  체크  
	        if($input.attr("alpha") != undefined){
	            if(checkAlphabet($input) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	
	        // 5. 영문자/숫자 입력 오류  체크  
	        if($input.attr("alphanum") != undefined){
	            if(checkAlphaNumeric($input) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	        
	        // 6. Email 입력 오류  체크  
	        if($(this).attr("email") != undefined){
	            if(checkEmail($input) == false) {
	                rsltChk = false;
	                return rsltChk;
	            }
	        }
	    });
	    return rsltChk; 
	};      
	
	
	/**
	 *  폼 내의 모든 엘리먼트의 값을 초기화한다. (eHR)
	 *      initData - {엘리먼트id(혹은 엘리먼트name) : 사용자정의초기값, .... } 형태의 객체 
	 */
	$.fn.resetForm = function(initData){
	    var $frm = this;
	    $frm.find(':input').each(function(){
	        var $elem = $(this), id = this.id, name = this.name, userVal, type = (nvl(this.type,"")).toLowerCase();
	
	        //라디오버튼일 경우, 엘리먼트의 값을 초기화해서는 안되며, 선택상태만 초기화해야 한다.
	        if(type === 'radio'){ 
	            $elem.prop('checked', false);
	            return true; 
	        }
	        
	        //사용자정의 값이 존재할 경우 그 값으로 초기화
	        if(initData){
	            if(initData[id]){ //현재 loop의 엘리먼트id에 해당하는 data key가 존재할 경우
	                userVal = initData[id]; 
	            }else if(initData[name]){ //현재 loop의 엘리먼트name에 해당하는 data key가 존재할 경우
	                userVal = initData[name]; 
	            }
	            if(userVal){
	                if(userVal.toLowerCase() === 'null'){ userVal = ''; } //initData에 /공백문자를 넘겼을 경우 인식하지 못하기 때문에, 초기값을 공백문자로 하고 싶으면 'null' 문자열을 사용한다.
	                $elem.val(userVal);
	                return true; //loop continue
	            }
	        }
	        
	        //class가 calendar일 경우 오늘날짜로 초기화하는 것을 기본으로 하고, 그 외의 경우 사용자정의값으로 override
	        if($elem.hasClass('calendar')){
	            var today = new Date();
	            var todayStr = String(today.getFullYear()) + '-' + String(today.getMonth()+1).lpad(2, '0') + '-' + String(today.getDate()).lpad(2, '0'); 
	            $elem.val(todayStr);
	            return true; 
	        }
	        
	        //디폴트 초기화
	        if(type === 'checkbox'){    //체크박스일 경우
	            $elem.prop('checked', false);
	        }else{
	            $elem.val('');  //기타의 경우 null 초기화
	        }
	        
	    });
	};    
	
	
	/**
	 *	부모의 사이즈를 기준으로, 입력받은 퍼센트(%)값에 해당하는 width 값을 리턴한다. 	
	 */
	$.fn.getWidthByPercent = function(inputPercent){
		return inputPercent * $(this).parent().width() / 100;
	};
	
	
	/**
	 *	부모의 사이즈를 기준으로, 입력받은 퍼센트(%)값에 해당하는 height 값을 리턴한다. 	
	 */
	$.fn.getHeightByPercent = function(inputPercent){
		return inputPercent * $(this).parent().height() / 100;
	};	

})(jQuery);
///////////////////////////////////////////////////////   jQuery 확장 - end   //////////////////////////////////////////////////////////////