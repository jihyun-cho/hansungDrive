/*
 *	 ※ 각 코드의 작성 시점에 대한 표기
 *		- FO1: FrameOne 1.0에서 추가/수정한 부분
 * 		- eHR: eHR 프로젝트를 수행하면서 추가/수정한 부분
 * 		- FO1=>eHR: FrameOne 1.0에서 작성하고 eHR에서 수정한 부분
 *		- FO2a: FrameOne 2.0a에서 추가/수정한 부분  
 *
 *	 ※ javascript 소스 통합 (2013.06.14)
 *		- 페이지 로딩 속도 향상을 목적으로 util.js, date.js, string.js, number.js, popup.js를 frameone-common.js에 통합하였다.
 *		- 통합된 js들은 FO1 시절에 유입된 것으로서 완벽하게 필요성 검토 및 최적화 되지 않은 코드이기 때문에, 지속적으로 각 함수의 필요성을 제고하고 정리 및 최적화 할 필요가 있다.
 */

/**
 * 	디버깅 콘솔 메서드 dc() 사용 여부 (FO1)
 * 		- 운영시에는 false로 설정할 것
 */
var isDebugConsoleEnabled = true;

$(window).keydown(function (e) {
	
	if((event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || event.keyCode == 116) {
		
		event.keyCode      = 0;
		event.cancelBubble = true;
		
		return false;
	}
});

/**
 * 	1024x768 화면 기준으로, 윈도우 작업표시줄 30px를 제외한 1024x738 스크린에 브라우저를 가득 채우고,
 * 해당 브라우저는 하나의 툴바를 가지고 있다고 가정했을 경우, 
 * 브라우저에서 내용을 출력할 수 있는 공간(viewport)의 크기는 대략 다음과 같다.
 */
//FO1
//var MIN_WIDTH_VIEWPORT = 980;		//레프트 포함
//var MIN_WIDTH_VIEWPORT = 830;		//레프트 제외
//var MIN_HEIGHT_VIEWPORT = 595;

//eHR
//2012/07/11 수정 : Left Size 변경(151 -> 180)  
var MIN_WIDTH_VIEWPORT  = 810; //(20120917)  
//var MIN_HEIGHT_VIEWPORT = 485; //IE8, 브라우저 메뉴줄, 브라우저 즐겨찾기 목록줄 존재 - 그러나 크롬 등 메뉴줄이 없는 브라우저에서는 그리드가 너무 커진다.
var MIN_HEIGHT_VIEWPORT = 570;	 //(20120913)  

/**
 *  ajax 호출 결과가 성공일 경우 응답의 ErrorMsg 값. (FO1=>eHR)
 */
var ERR_CD_SUCCESS = "0";	//ajax 호출 결과가 성공일 경우 응답의 ErrorMsg 값.
var ERR_CD_NO_AUTH = "-10";	//ajax 호출시 세션이 만료되었을 경우

/**
 * 	메세지 추출시 키값 정의 (FO1)
 */
var ERROR_CODE 			= "ErrorCode";					//수행결과 코드
var MESSAGE_CODE 		= "SVC_MSG_CD";			//메세지 코드
var MESSAGE_TEXT 		= "SVC_MSG_TEXT"; 		//메세지
var ERROR_MESSAGE_CODE 	= "SVC_ERR_MSG_CD";		//에러메세지 코드
var ERROR_MESSAGE_TEXT 	= "SVC_ERR_MSG_TEXT";	//에러메세지
var STATUS_MESSAGE_CODE = "SVC_STS_MSG_CD";		//상태메세지 코드
var STATUS_MESSAGE_TEXT = "SVC_STS_MSG_TEXT"; 	//상태메세지

/**
 * 	메세지 유형 (FO1)
 */
var MSG_TP_ERR		= "error";	//에러 메세지
var MSG_TP_MSG 		= "msg";		//일반 메세지
var MSG_TP_STATUS 	= "status";	//상태 메세지

/** 
 * 	jQuery ajax 전역 설정 - 사용자가 오버라이딩 하지 않는 이상 이 설정이 적용됨. (FO1=>eHR)
 */
$.ajaxSetup({
	type:'POST',
	dataType:'json',
	headers:{'AjaxType':'FrameOne'},	//FrameOne에서 정한 공통 JSON 형식
	error : function(jqXHR, textStatus, errorThrown){
		var status = jqXHR.status;
		dc('@@ status: '+status);
		if(status == '0'){ return; } //0은 에러가 아니다.
		alert("Service Temporarily Unavailable (staus : " + status +")");
	}
});

//============================== FO1의 util.js에 있던 코드들 - start ==============================
/* string prototype */ 
/**
 * 공백 문자를 제거
 */ 
String.prototype.trim = function()
{ 
   return this.replace(/^\s+|\s+$/g,"");
} // end of function

/**
 * 왼쪽에 위치한 공백 문자를 제거
 */
String.prototype.ltrim = function()
{
    return this.replace(/^\s+/, "");
} // end of function

/**
 * 오른쪽에 위치한 공백 문자를 제거
 */
String.prototype.rtrim = function()
{
	return this.replace(/\s+$/, "");
} // end of function

/** 
 * 문자열의 왼쪽을 padding 문자로 채운다
 */
String.prototype.lpad = function( maxLength, fillChar )
{
  var srcStr = this.substr( 0, maxLength );
  var cnt = 0;

  for( var inx = srcStr.length; inx < maxLength; inx++ ) {
    srcStr = fillChar.charAt(cnt) + srcStr;
    cnt++;
    cnt = ( cnt == fillChar.length ) ? 0 : cnt;
  }
  return srcStr;

} // end of function

/** 
 * 문자열의 오른쪽을 padding 문자로 채운다
 */
String.prototype.rpad = function( maxLength, fillChar )
{

  var srcStr = this.substr( 0, maxLength );
  var cnt = 0;

  for( var inx = srcStr.length; inx < maxLength; inx++ ) {
    srcStr = srcStr + fillChar.charAt(cnt);
    cnt++;
    cnt = ( cnt == fillChar.length ) ? 0 : cnt;
  }

  return srcStr;

} // end of function

/** 
 * 문자열이 null,Blank 인지 체크 
 */
String.prototype.isNull = function( pattern )
{
  if( this == undefined || this == null || this == '' ) return true;
  return false;
} // end of function

/** 
 * 영문자 유효성 체크 
 */
String.prototype.isAlpha = function()
{
  var str = this.trim();

  if( str.isNull() ) return true;
  return (/^[a-zA-Z]+$/).test(str);
} // end of function

/** 
 * 영문자(Blank허용) 유효성 체크 
 */
String.prototype.isAlphaBlank = function()
{
  var str = this.trim();

  if( str.isNull() ) return true;
  return (/^[\sa-zA-Z]+$/).test(str);
} // end of function


/** 
 * 영문자/숫자 유효성 체크 
 */
String.prototype.isAlphaNum = function()
{
  var str = this.trim();

  if( str.isNull() ) return true;
  return (/^[0-9a-zA-Z]+$/).test(str);
} // end of function

/** 
 * 숫자형 유효성 체크 
 */
String.prototype.isNumber = function()
{
  var str = this.trim();

  str = removeChar(str, "[,]");
  str = removeChar(str, "[-]");
  str = removeChar(str, "[+]");
  str = removeChar(str, "[.]");
  if( str.isNull() ) return true;

  return (/^[0-9]+$/).test(str);
} // end of function

/**
 *  입력문자열 바이트 계산 
 */
String.prototype.getByte = function( utf8Yn )
{
  var str = this.trim();

  var utf8Add = ( utf8Yn == true ) ? 2 : 1;
  var len = 0;

  for( var i = 0; i < str.length; i++, len++ ) {
    if( str.charCodeAt(i) < 0 || str.charCodeAt(i) > 127 ) len += utf8Add; // add Extra 2 when charSet is UTF-8
  }
  return len;
} // end of function

/** 
 * 이메일 유효성 체크 
 */
String.prototype.isEmail = function()
{
  var str = this.trim();
  if( str.isNull() ) return true;
  return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(str);
}


/** 
 * 특수문자 체크 
 */
String.prototype.isSpecialChar = function()
{
	var str = this.trim();
	if( str.isNull() ) return true;

	var re = /[~!@\#$%<>^&*\()\-=+_\']/gi;  
	return re.test(str);
}


/**
 *  필수 입력 체크 (eHR)
 */
function checkRequired(obj)
{
	$objInput = $(obj);

	if($objInput.hasClass("number")){

		if( $objInput.val() == '' || parseFloat($objInput.val().trim()) == 0) {
			showMessage("MSG_COM_VAL_001", $objInput.attr("title") );
			$objInput.focus();
			return false;
		}else {
		    return true;
		}
	}else {
		if( $objInput.val() == '') {
			showMessage("MSG_COM_VAL_001", $objInput.attr("title") );
			$objInput.focus();
			return false;
		}else {
		    return true;
		}
	}
}


/**
 *  Email 입력 오류  체크  
 */
function checkEmail(obj)
{
	var $objInput = $(obj);

	// Email 유효성  체크  
	if($objInput.val().isEmail() == false) {
		showMessage("MSG_COM_VAL_034");
		$objInput.focus();
		return false;
	}else {
	    return true;
	}
}

/**
 *  Byte 입력 제한  체크  
 */
function checkMaxbyte(obj, maxByte)
{
	var $objInput = $(obj);
	var val = $objInput.val(); 
	//숫자포맷팅이 되어 있는 경우 콤마를 제거하여 검사한다.
	if($objInput.hasClass("number") && $objInput.attr("mask")){
		val = delCommas(val);
	}
	// Byte 입력 제한  체크  
	if(val.getByte() > maxByte) {
		showMessage("MSG_COM_VAL_035", maxByte);
		$objInput.select();
		$objInput.focus();
		return false;
	}else {
	    return true;
	}
}

/**
 *  숫자형 유효성 체크 
 */
function checkNumber(obj)
{
	var $objInput = $(obj);

	// 숫자 입력 체크  
	if($objInput.val().isNumber() == false) {
		showMessage("MSG_COM_VAL_038");
		$objInput.focus();
		return false;
	}else {
	    return true;
	}
}

/**
 *  영문자 유효성 체크 
 */
function checkAlphabet(obj)
{
	var $objInput = $(obj);

	// 영문자  입력 체크  
	if($objInput.val().isAlpha() == false) {
		showMessage("MSG_COM_VAL_039");
		$objInput.focus();
		return false;
	}else {
	    return true;
	}
}

/**
 *  영문자/숫자 유효성 체크 
 */
function checkAlphaNumeric(obj)
{
	$objInput = $(obj);

	// 영문자/숫자 입력   체크  
	if($objInput.val().isAlphaNum() == false) {
		showMessage("MSG_COM_VAL_040");
		$objInput.focus();
		return false;
	}else {
	    return true;
	}
}
/**
 *  주민등록번호 체크
 */
function checkJoomin(ssn){
	ssn = removeChar(ssn, "-");
	var Resno = '' + ssn;
	var buf = new Array(13);
	var sum = 0, i;
	var multipliers = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];

	if (isNaN(Resno) || Resno == "") {
		// alert("정상적인 주민등록번호가 아닙니다.\n다시입력 하여 주십시오.");
		return false;
	}

	var birthYear = (Resno.charAt(6) == "1" || Resno.charAt(6) == "2" || Resno.charAt(6) == "5" || Resno.charAt(6) == "6") ? "19" : "20";
	birthYear += Resno.substr(0, 2);
	var birthMonth = Resno.substr(2, 2) - 1;
	var birthDate = Resno.substr(4, 2);

	var birth = new Date(birthYear, birthMonth, birthDate);
	var now = new Date();

	if (birth.getFullYear() > now.getFullYear()
			|| birth.getFullYear() % 100 != Resno.substr(0, 2)
			|| birth.getMonth() != birthMonth || birth.getDate() != birthDate) {
		// alert("정상적인 주민등록번호가 아닙니다.\n다시입력 하여 주십시오.");
		return false;
	}

	for (i = 0; i < 13; i++)
		buf[i] = parseInt(Resno.charAt(i));

	for (i = 0, sum = 0; i < 12; i++)
		sum = sum + (buf[i] * multipliers[i]);

	var val = ((11 - (sum % 11)) % 10);

	if (val != buf[12]) {
		// alert("잘못된 주민등록번호입니다.\n다시입력 하여 주십시오.");
		return false;
	} else {
		return true;
	}
}	
/**
 *  사업자등록번호 체크
 */
function checkBizNo(vencode)
{
/*
  if (vencode.length == 10)
    return true;
  else
    return false;
*/
  vencode = vencode.trim();
  vencode = removeChar(vencode, "-");
  if (vencode.length != 10) return false;
  if(vencode == "") return false;
  //아래의 로직에서 888-88-88888이면 무조건 통과되므로, 888-88-88888 이면 오류처리
  if(vencode == "8888888888") return false;

  var sum = 0;
  var getlist =new Array(10);
  var chkvalue =new Array("1","3","7","1","3","7","1","3","5");

  for(var i=0; i<10; i++) { getlist[i] = vencode.substring(i, i+1); }

  for(var i=0; i<9; i++) { sum += getlist[i]*chkvalue[i]; }

  sum = sum + parseInt((getlist[8]*5)/10, 10);
  sidliy = sum % 10;
  sidchk = 0;

  if(sidliy != 0) { sidchk = 10 - sidliy; }
  else { sidchk = 0; }
  if(sidchk != getlist[9]) { return false; }
  return true;
}



/*
 * timeStamp의 값을 구한다.
 * 2008년 05월 30일 9시 30분 20초의 timeStamp의 값을 구하는 경우
 * mktime(9,30,20,5,30,2008)  //결과 1212107420
 * mktime(시간, 분, 초, 월, 일, 년)
 * 2012.07.13 khn
 * */
function mktime(h, i, s, m, d, y){
    var mkt = new Date(y, m-1, d, h, i, s);
    if( mktime.arguments.length == 0 ) mkt = new Date();
    return Math.floor(mkt.getTime()/1000);
}
/*
 * 기간 검색 필트( input:text )에 값을 셋팅한다.
 * startID 		:	시작날짜 ID
 * endID		:	종료날짜 ID
 * startDate	:	시작날짜
 * endDate		:	종료날짜
 */
function dateQuickSelect(startID, endID, startDate, endDate){
	$("#"+startID).val(startDate);
	$("#"+endID).val(endDate);
}
/*
 * timeStamp를 기준으로 날짜 format형식을 가져옴
 * date('Ymd','1212107420')  //결과 20080530
 * date(날짜포멧형식,timeStamp)
 * 2012.07.13 khn
 * */
function date (format, timestamp) {
    var that = this,
        jsdate, f, formatChr = /\\?([a-z])/gi,
        formatChrCb,
        _pad = function (n, c) {
            if ((n = n + '').length < c) {
                return new Array((++c) - n.length).join('0') + n;
            }
            return n;
        },
        txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        d: function () { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () { // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () { // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            return j > 4 && j < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[j % 10] || 'th';
        },
        w: function () { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
                b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5) + 1;
        },
 
        // Week
        W: function () { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },
 
        // Month
        F: function () { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () { // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },
 
        // Year
        L: function () { // Is leap year?; 0 or 1
            return new Date(f.Y(), 1, 29).getMonth() === 1 | 0;
        },
        o: function () { // ISO-8601 year
            var n = f.n(),
                W = f.W(),
                Y = f.Y();
            return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
        },
        Y: function () { // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () { // Last two digits of year; 00...99
            return (f.Y() + "").slice(-2);
        },
 
        // Time
        a: function () { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () { // AM or PM
            return f.a().toUpperCase();
        },
        B: function () { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2,
                // Hours
                i = jsdate.getUTCMinutes() * 60,
                // Minutes
                s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () { // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () { // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },
 
        // Timezone
        e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
/*              return this.date_default_timezone_get();
*/
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0),
                // Jan 1
                c = Date.UTC(f.Y(), 0),
                // Jan 1 UTC
                b = new Date(f.Y(), 6),
                // Jul 1
                d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return 0 + ((a - c) !== (b - d));
        },
        O: function () { // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset(),
                a = Math.abs(tzo);
            return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.

            return 'UTC';
        },
        Z: function () { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },
 
        // Full Date/Time
        c: function () { // ISO-8601 date.
            return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () { // Seconds since UNIX epoch
            return jsdate.getTime() / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}


/**
 * null을 공백 또는 대체 문자로 리턴함.
 * @param s1 체크할 문자열
 * @param s2 대체할 문자열
 * 작성자 : 2012.09.05 KimHeatNim
 */
function nvl(s1, s2) {
    if(s1 == null) {
        if(s2 == null) {
            return "";
        } else {
            return s2;
        }
    }
    return s1;
}
//============================== FO1의 util.js에 있던 코드들 - end ===============================

//============================= FO1의 date.js에 있던 코드들 - start ==============================
var DATE_DELIMETER = "-";
/*
 * 날짜문자열을 구분자로 잘라서 배열로 리턴.
 */
function splitDateStr(dateStr) {
	var dateStr = formatDateStr(removeChar(dateStr, DATE_DELIMETER));

	var arr = dateStr.split(DATE_DELIMETER);

	arr[0] = parseInt(arr[0], 10);
	arr[1] = parseInt(arr[1], 10) - 1;
	arr[2] = parseInt(arr[2], 10);

	return arr;
}

/**
 * 주어진 날짜형 문자열에 일정 연 수를
 * 더한 날짜형 문자열로 돌려준다.
 */
function afterYears(dateStr, addYear) {
	addYear = parseInt(addYear);

	var dateArr = splitDateStr(dateStr);

	var date = new Date(dateArr[0], dateArr[1], dateArr[2]);

	date.setFullYear(date.getFullYear() + addYear);

	return formatDate(date);
}


/**
 * 주어진 날짜형 문자열에 일정 개월 수를
 * 더한 날짜형 문자열로 돌려준다.
 */
function afterMonths(dateStr, addMonth) {
	addMonth = parseInt(addMonth);

	var dateArr = splitDateStr(dateStr);

	var date = new Date(dateArr[0], dateArr[1], dateArr[2]);

	date.setMonth(date.getMonth() + addMonth);

	return formatDate(date);
}


/**
 * 주어진 날짜형 문자열에 일정 일 수를
 * 더한 날짜형 문자열로 돌려준다.
 */
function afterDays(dateStr, addDay) {
	addDay = parseInt(addDay);

	var dateArr = splitDateStr(dateStr);

	var date = new Date(dateArr[0], dateArr[1], dateArr[2]);

	date.setDate(date.getDate() + addDay);

	return formatDate(date);
}

/**
 * 해당 문자영의 공백 여부를 확인한다.
 */
function isEmpty(str) {
	if((str == null ) || (str == "")) return true;
	else return false; 
}

/**
 * 주어진 날짜 문자열을 형식화한다.
 */
function formatDateStr(dateStr) {
	/* 값이 없으면 빈 문자열을 돌려 준다. */
 
	if ( isEmpty(dateStr) ) return "";

	dateStr = removeChar(dateStr, DATE_DELIMETER);
	
	var result = "";

	var len = dateStr.length;

	if (len >= 4) {
		result += dateStr.substr(0, 4);
		if (len >= 6) {
			result += DATE_DELIMETER + dateStr.substr(4, 2);
			if (len >= 8) {
				result += DATE_DELIMETER + dateStr.substr(6, 2);
			}
		}
	}
	
	/*
	return dateStr.substr(0, 4) + DATE_DELIMETER
			+ dateStr.substr(4, 2) + DATE_DELIMETER
			+ dateStr.substr(6, 2);*/

	return result;
}


/**
 * 주어진 객체의 값을 날짜형 문자열이라고
 * 가정하고 형식화한다.
 */
function formatDateStrObj(obj) {
	obj.value = formatDateStr(obj.value);
}


/**
 * 주어진 Date 객체의 값을 형식화한다.
 */
function formatDate(date) {
	var year  = date.getFullYear();
	var month = date.getMonth() + 1;
	var day   = date.getDate();

	return ateStr = year + DATE_DELIMETER
			+ (month < 10 ? "0" : "" ) + month + DATE_DELIMETER
			+ (day   < 10 ? "0" : "" ) + day;
}

/**
 * 현재 시스템 일자 값을 형식화하여 돌려 준다.
 */
function getSysDateStr() {
	return formatDate(new Date());
}


/**
 * 날짜 여부를 확인
 * @param sYmd	: 입력스트링
 * @return		: Boolean
 */
function isDateYmd(sYmd) {
	if(isEmpty(sYmd) || sYmd.length < 8)   { 
		return false;
	}
	
	var dateArr = splitDateStr(sYmd);

	var dateYmd = new Date(dateArr[0], dateArr[1], dateArr[2]);
		
    if( dateArr[0] == dateYmd.getFullYear()  && 
    	dateArr[1] == dateYmd.getMonth()     && 
    	dateArr[2] == dateYmd.getDate() ) {
    	return true;
    	
    } else {
    	return false;
    }
}


/**
 * 날짜 입력시 년월을 제외한 일자만 입력할 경우 앞에 현재년월을 채워준다. 
 */
function checkValidDate(strCalText) { 
	if(isEmpty(strCalText)) return;
	strCalText = removeChar(strCalText, DATE_DELIMETER);           // 입력일자  
	var strCurrDate = removeChar(getSysDateStr(), DATE_DELIMETER); // 현재일자 
  
	var strYymmdd = strCalText;
	if(strCalText.length < 8) {
		if (strCalText.length == 1 || strCalText.length == 3) {
			strYymmdd = strCurrDate.substring(0, 7-strCalText.length)  + "0" + strCalText;
		} else {
			strYymmdd = strCurrDate.substring(0, 8-strCalText.length) + strCalText;
		}
	}
	
	if(isDateYmd(strYymmdd)){
		return formatDateStr(strYymmdd);
	}else {
		return "";
	}
}
//============================= FO1의 date.js에 있던 코드들 - end ===============================

//============================ FO1의 string.js에 있던 코드들 - start ===============================
/**
 * 문자열에 들어 있는 특정한 문자를 지운다.
 *
 * @param removedChar
 *            지워질 문자열.
 */
function removeChar(str, removedChar) {
	if (typeof (str) == "undefined" || str == null)
		return str;

	if (typeof (removedChar) == "undefined" || removedChar == null)
		return str;

	if (typeof (str) != "string")
		str = new String(str);

	var regExp = new RegExp(removedChar, "g");

	return str.replace(regExp, "");
}

/**
 * Text형 입력폼의 값에서 슬래쉬('/')를 제거하여 다시 Text형 입력폼의 값으로 세팅한다.
 *
 * @param obj
 *            Text형 입력폼 객체
 * @param ch
 *            제거할 문자.
 */
function removeCharObj(obj, ch) {
	obj.value = removeChar(obj.value, ch);
}

/** 
 * 주어진 문자열의 왼쪽을 padding 문자로 채운다
 */
function lpad(str, maxLength, padding) {
    if (str.length >= maxLength) {
        return str;
    }else{
        var len = maxLength - str.length;
        var pad_str = str;
        for (var i=0; i<len; i++)
            pad_str = padding + pad_str;

        return pad_str;
    }
}

/** 
 * 주어진 문자열의 오른쪽을 padding 문자로 채운다
 */
function rpad(str, maxLength, padding) {
    if (str.length >= maxLength)
        return str;
    else
    {
        var len = maxLength - str.length;
        var pad_str = str;
        for (var i=0; i<len; i++)
            pad_str = pad_str + padding;

        return pad_str;
    }
}

/**
 * 왼쪽에 위치한 whitespace 문자를 제거
 */
function ltrim(str) {
    return str.replace(/^\s+/, "");
}

/**
 *  오른쪽에 위치한 whitespace 문자를 제거
 */
function rtrim(str) {
    return str.replace(/\s+$/, "");
}


/**
 *	문자열에 천단위 콤마 추가 
 */
function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


/**
 * 	문자열에서 콤마 삭제
 */
function delCommas(nStr){
	return nStr.replace(/,/g, '');
}


/**
 *	문자열에서 하이픈(-) 삭제 
 */
function delHyphens(str){
	return str.replace(/-/g, '');
}
//============================= FO1의 string.js에 있던 코드들 - end ===============================

//============================ FO1의 number.js에 있던 코드들 - start ==============================
var DIGIT_COMMA = ",";

/**
 * 소수점 이하 index자리에서 반올림
 *
 * @param num    원 수치값
 * @param index  소수점이하 유효자리수
 */
function round (num, index) {
	var pow = Math.pow(10, parseInt(index));

	return Math.round(parseFloat(num) * pow) / pow;
}


/**
 * 소수점 이하 index자리에서 버림
 *
 * @param num    원 수치값
 * @param index  소수점이하 유효자리수
 */
function floor (num, index) {
	var pow = Math.pow(10, parseInt(index));

	return Math.floor(parseFloat(num) * pow) / pow;
}


/**
 * 소수점 이하 index자리에서 올림
 *
 * @param num    원 수치값
 * @param index  소수점이하 유효자리수
 */
function ceil (num, index) {
	var pow = Math.pow(10, parseInt(index));

	return Math.ceil(parseFloat(num) * pow) / pow;
}


/**
 * JavaScript인 경우
 */
function getCorrectPow(no) {
	var noStr = new String(no);

	var dotIndex = noStr.lastIndexOf(".");

	var correctPow = 1;

	if ( dotIndex > -1 ) {
		correctPow = Math.pow(10, noStr.length - dotIndex - 1);
	}

	return correctPow;
}


/**
 * 주어진 수치 문자열에, 뒤에서 3자리씩 마다 컴마(,)를
 * 삽입한다.
 *
 * @param  noStr  컴마를 삽입할 문자열
 *         noDec  소수점 자릿수
 */
function formatNo(noStr, noDec) {
	//if ( event != undefined && isControlKey() ) return;
	//if ( isControlKey() ) return true;

	var noStr = removeChar(noStr, ',');

	if(noDec == null || noDec == "") noDec = 0;
		
	var signPart = ""; // 기호부
	var intPart  = ""; // 정수부
	var floatPat = ""; // 소수부

	// 기호부, 정수부, 소수부를 분리한다.
	if ( noStr.charAt(0) == '-' ) {
		signPart = "-";
	}

	var arrNoStr = noStr.split('.');
	intPart   = removeChar(arrNoStr[0],signPart);
	if(arrNoStr.length == 1) {
		floatPart = "";
	}else {
		floatPart = arrNoStr[1];
	}

	// 정수부에 3자리마다 컴마(,)를 삽입한다.
	var buff = "";
	for (var i = 1, index = intPart.length - 1; i <= intPart.length; i++, index--) {
		buff = intPart.charAt(index) + buff;

		// 가장 마지막 자리 앞에는 컴마를 넣지 않는다.
		if ( i % 3 == 0 && i < intPart.length ) {
			buff = ',' + buff;
		}
	}
	if(buff == "") buff = "0";
	
	if(noDec > 0) {
		// 기호부, 컴마가 들어간 정수부, 소수부를 합쳐 돌려준다.
		return signPart + buff + "." + floatPart.rpad(noDec, "0");
	}else {
		// 기호부, 컴마가 들어간 정수부, 소수부를 합쳐 돌려준다.
		return signPart + buff;
	}
}



/**
 * Text형 입력폼의 값을 3자리마다 컴마를 찍은 값으로
 * 세팅한다.
 *
 * @param  obj  Text형 입력폼 객체
 *         noDec  소수점 자릿수
 */
function formatNoObj(obj, noDec) {
	 
	//if ( event != undefined && isControlKey() ) return;
	//if ( isControlKey() ) return true;

	obj.value = formatNo(obj.value, noDec);
}

function toNumber(v) {
    var val;
    var n = (String(v).replace(/[^\d.]/g, ""));

    if (n.indexOf('.') >= 0) {
        val = Number(String(n.split('.')[0]).replace(/[^\d]/g, "")).toLocaleString()
            + "." + 
            String(n.split('.')[1].replace(/[^\d]/g, ""));
    }
    else {
        val = Number(String(n).replace(/[^\d]/g, "")).toLocaleString();
    }

    return val;
}
//============================ FO1의 number.js에 있던 코드들 - end ===============================

//===================== 공통팝업을 위한 공통함수를 정의하는 코드들 (popup.js) - start ======================
/**
 * 공통 조회팝업 호출
 */
function openSearchPopup(o){

	//현재시점의 폼엘리먼트 혹은 그리드의 초기데이터를 mappingArr에 바인딩
	addInitValToMap(o); 
	
	//기존 o에서 param으로 보낼 것만 추출
	var po = {};	
	po['isGrid'] = o['isGrid'];
	po['grdId'] = o['grdId'];
	po['rowId'] = o['rowId'];
	po['mappingArr'] = o['mappingArr'];
	po['userFunc'] = o['userFunc'];
	po['searchParam'] = o['searchParam'];

	if(po['isGrid']){
		$("#" + o['grdId']).jqGrid('saveDataToLocal');
	}
	var poJSON = JSON.stringify(po);
	//alert(poJSON);
	
	var options = {
			windowName: o.popupNm, // name of window
			windowURL: o.popupUrl, 
			width : o.popupWidth || 600,	//사용자정의값 우선
			height: o.popupHeight || 450,
			param : {po:poJSON}
	};	
	//2013-01-24 수정 
	setTimeout(function(){
		openWindowPopup(options);
	}, 0);
}


/**
 * 	공통 단건조회 수행
 */
function getUniqueData(o){
	//쿼리의 파라미터로 쓰일 값들을 추출하여 객체화한다.
	var queryParam = getMappingObj(o, 'paramNm');
	
	//쿼리 파라미터가 없을 경우
	if($.isEmptyObject(queryParam)){
		initAllElemGridVal(o);	//폼엘리먼트 or 그리드값 초기화
		return;	
	}

	//validation check
	if( ! checkFormValidation(o, 'paramNm') ){
		return ;
	}
	
	//현재시점의 폼엘리먼트 혹은 그리드의 초기데이터를 mappingArr에 바인딩
	addInitValToMap(o); 
	
	//트랜젝션 파라미터 설정
	var param = {
		strUrl: o.searchUrl, // 조회 url
		param: getMergedObject({START_ROW:1, END_ROW:2}, queryParam, o.searchParam),   // 전송할 파라미터 설정 
		pCall: function(svcId, data, errCd, msgTp, msgCd, msgText){ 
					var ret = setElemGridSearchResult(o, errCd, data);	//조회하여 단건이면 값 채움
					if(ret){
						var rowData = data['ds_search']['data'][0];	//검색팝업의 조회결과
						exeFunc(o, rowData);	//사용자정의 콜백 실행
						return; 
					}
					
					//팝업의 조회 input 관련 맵핑정보를 객체화하여 팝업생성 옵션에 추가
					openSearchPopup(o); //검색팝업 호출

					//조회 결과 Data 건수가 1건이 아닐 경우 
					initAllElemGridVal(o);	//폼엘리먼트 or 그리드값 초기화
				},
		//로딩이미지 노출 여부
		pLoad : true 
	};

	//트랜젝션 실행
	transaction(param);	
}

/**
 * 	현재시점의 폼엘리먼트 혹은 그리드의 초기데이터를 mappingArr에 바인딩한다.
 */
function addInitValToMap(o){
	
	for(var i=0; i<o.mappingArr.length; i++){
		var mappingObj = o.mappingArr[i];
		var elemId = mappingObj['elemId'];
		var val = $.trim(getElemGridVal(o, elemId));
		if(val.length === 0){
			continue;
		}
		mappingObj['initVal'] = val;
	}
}

/**
 *	검색결과가 단건이면 폼엘리먼트나 그리드에 결과를 출력하고 true를 리턴
 *	결과가 단건이 아니면(결과가 없거나 복수일 경우) false를 리턴
 */
function setElemGridSearchResult(o, errCd, data){

	if(errCd != ERR_CD_SUCCESS){
		return false;	//성공이 아니면 false
	}
	//조회 결과가 단건일 경우 폼엘리먼트나 그리드에 값을 채우고 종료한다.
	var searchResult = data['ds_search']['data'];	//단건
	
	if(searchResult.length === 1){
		for(var i=0; i<o.mappingArr.length; i++){
			var mappingObj = o.mappingArr[i];
			var elemId = mappingObj['elemId'];
			var val = searchResult[0][mappingObj['rsNm']];	//배열의 0번째 인덱스에서 값 추출
			var noClear = mappingObj['noClear'];	// 초기화하지 않는 엘리먼트 check
			dc('elemId: '+elemId+', val: '+val);
			if(noClear == true){
				dc('noClear: '+elemId);
				continue; 
			}
			
			setElemGridVal(o, elemId, val);
		}		
		return true;
	}
	return false;
}

/**
 *	jQuery selector에 사용할 컨텍스트를 획득한다.
 * 		- 우선순위 1 : o.ctx 에 명시적으로 셋팅한 window 객체
 * 		- 우선순위 2 : 전역변수 bindingContext에 지정한 문자열 값에 따라서 window 객체 선택
 * 		- 우선순위 3 : opener가 존재할 경우 opener
 * 		- 우선순위 4 : 현재 window
 * 
 * 	 ※ document가 아니라 window 객체를 리턴하는 것으로 변경함. (IE8 호환성보기에서의 오류로 인해 부모창에서 직접 함수호출을 할 수 있도록) 
 */
function getBindngContext(o){
	var ctx = null, bctx = window.bindingContext;
	if(o.ctx){
		ctx = o.ctx; 
	}else if(bctx){
		if(bctx === 'THIS'){ //순환참조가 우려되어 객체 바인딩을 하지 않고 문자열 구분자로 처리
			ctx = window;
		}
	}else if(opener){
		ctx = opener;
	}else{
		ctx = window;
	}
//	dc(ctx.name);
	return ctx;
}

/**
 *	해당 엘리먼트 혹은 그리드 칼럼의 값을 리턴 
 */
function getElemGridVal(o, elemId){
	
	var ctxDoc = getBindngContext(o).document; 
	var val;
	if(o.isGrid){ //그리드일 경우
		var $grd = $("#" + o.grdId, ctxDoc);
		val = $('#' + $grd.jqGrid('getInd', o.rowId) + "_" +  elemId, ctxDoc).val(); //editable 상태의 value
		if(val == undefined) {
			val = $grd.jqGrid('getCell', o.rowId, elemId);
		}
	}else{ //그리드가 아닐 경우
		val = $('#' + elemId, ctxDoc).val();
	}
	return val;
}

/**
 * 해당 id를 가진 폼엘리먼트나, 그리드의 해당 칼럼명의 칼럼값을 설정한다.
 */
function setElemGridVal(o, elemId, val){
	
	var ctx = getBindngContext(o);
	var ctxDoc = ctx.document;
	
	if(o.isGrid){ //그리드일 경우
		/*	
		 * IE8의 호환성보기 모드에서 "해당 인터페이스를 지원하지 않습니다" 라는 오류가 jQuery 소스에서 발생하여서 수정함. 	
		 *	(popup <=> opener간 객체 전달시, 일부 IE버전에서 부정한 접근으로 간주하여 오류처리 하는 듯 함) 
		 * 현재 컨텍스트에서 다른 윈도우의 jqGrid.setCell()을 호출하지 않고, 직접 다른 윈도우의 객체를 얻어와서
		 * 그 컨텍스트에서 jqGrid.setCell()을 랩핑한 함수를  직접 호출하도록 수정하였음.
		 */
		//$('#'+o.grdId, ctxDoc).jqGrid('setCell', o.rowId, elemId, val, '','', true); //수정 전
		ctx.setGridCell(o.grdId, o.rowId, elemId, val); //수정 후
		
	}else{ //그리드가 아닐 경우
		$('#' + elemId, ctxDoc).val(val);
	}
}


/**
 * 	jqGrid의 setCell을 랩핑한한 함수
 */
function setGridCell(grdId, rowId, elemId, val){
	dc('@ setGridCell('+grdId+', '+rowId+', '+elemId+', '+val+')');
	$('#'+grdId).jqGrid('setCell', rowId, elemId, val, '','', true);
}


/**
 *	인수의 mappingArr에 정의한 모든 폼엘리먼트, 그리드의 칼럼값을 초기화한다. 
 */
function initAllElemGridVal(o){
	
	for(var i=0; i<o.mappingArr.length; i++){
		var mappingObj = o.mappingArr[i];
		var elemId = mappingObj['elemId'];
		var noClear = mappingObj['noClear']; // 초기화하지 않는 엘리먼트 check
		
		if(noClear == true){
			continue;
		}
		setElemGridVal(o, elemId);
	}		
}


/**
 *	 인수로부터 특정 파라미터를 추출하여 객체로 리턴한다. 
 *  (쿼리로 넘길 이름:값 혹은, 팝업에서 조회 input에 바인딩할 이름:값) 
 */
function getMappingObj(o, mappingName){
	
	var ret = {};
	for(var i=0; i<o.mappingArr.length; i++){
		var mappingObj = o.mappingArr[i];
		var mappingNm = mappingObj[mappingName];
		if( ! mappingNm){
			continue;
		}
		var val = getElemGridVal(o, mappingObj['elemId']) +'';
		if(val.length == 0){
			continue;
		}
		ret[mappingNm] = val;  
	}		
	return ret;
}


/**
 *	 인수로부터 popElemId로 지정된 파라미터를  
 *   특정 파라미터를 추출하여 객체로 리턴한다.
 */
function checkFormValidation(o, mappingName){
	var ctxDoc = getBindngContext(o).document;
	for(var i=0; i<o.mappingArr.length; i++){
		var mappingObj = o.mappingArr[i];
		var mappingNm = mappingObj[mappingName];
		var popupElemNm = mappingObj['popElemId'];
		if( ! popupElemNm){
			continue;
		}
		if( ! mappingNm){
			continue;
		}
		
		var val = getElemGridVal(o, mappingObj['elemId']) +'';
		
		if(val.length < 2){
			// 엘리먼트 focus
			if(o.isGrid){ 
				//그리드일 경우
				//$('#'+o.grdId, ctxDoc).jqGrid("editCell", $('#'+o.grdId, ctxDoc).jqGrid('getInd', o.rowId), 4, true);
				// $('#'+o.grdId, ctxDoc).jqGrid('setCell', o.rowId, mappingObj['elemId'], ' ', ' ',' ', true);
				// 2013-01-22 수정 : 2글자 이하일 경우 초기화 처리 
				showMessage("MSG_COM_VAL_042", "2");
				setTimeout(function(){
					initAllElemGridVal(o);
				}, 0);
			}else{ 
				//그리드가 아닐 경우

				initAllElemGridVal(o);
				showMessage("MSG_COM_VAL_042", "2");
				setTimeout(function(){
					$('#' + mappingObj['elemId'], ctxDoc).focus();
				}, 10);
			}
			return false;
		}
	}		
	return true;
}



/**
 * 	인수로 받은 함수를 실행
 */
function exeFunc(o, rowData){
	
	var arg = {};	
	arg['grdId'] = o.grdId;	//그리드일 경우 그리드ID
	arg['rowId'] = o.rowId;	//그리드일 경우 그리드 rowId
	arg['rowData'] = rowData;//조회결과에서 선택한 그리드 row의 내용을 객체화 한 것
	
	var func = o.userFunc;
    if(func != null && typeof(func) === 'string' && func.length > 0){ //팝업에서도 호출해야 하기 때문에 string => eval 방식으로 정했다.
    	//팝업에서 exeFunc()를 호출했을 경우
    	if(opener){	
    		func = "opener." + func;
    	}
    	try{
    		func = eval(func);
    		var funcType = typeof(func); //본 페이지에서 호출했을 경우는 function, 팝업에서 호출하면 object 값을 갖는다. 
    		if(funcType === 'function' || funcType === 'object'){
            	func.call(this, arg);
            }    		
    	}catch(e){
    		alert('exeFunc error : '+e.message);	//eval 실패
    	}
    }
}


/**
 * 	팝업 조회 결과 처리
 *		- 부모창에 값 바인딩 후 팝업 종료
 */
function resolvePopupResult(po, rowData){

	for(var i=0; i<po.mappingArr.length; i++){
		var mappingObj = po.mappingArr[i];
		var elemId = mappingObj['elemId'];
		var noClear = mappingObj['noClear'];	// 초기화하지 않는 엘리먼트 check
		var val = rowData[mappingObj['rsNm']];	// 배열의 0번째 인덱스에서 값 추출
		
		if(noClear == true){
			continue; 
		}
		setElemGridVal(po, elemId, val);				
	}
	
	exeFunc(po, rowData);	//사용자정의 콜백 실행
	window.close();	//창 닫기
}


/**
 * 팝업의 조회용 input에 기본값으로 지정할 것이 있으면 바인딩 한다.
 */
function bindPopupElemMapping(po){

	for(var i=0; i<po.mappingArr.length; i++){
		var mappingObj = po.mappingArr[i];
		var popElemId = mappingObj['popElemId'];
		var val = mappingObj['initVal'];
		if( ! popElemId){
			continue;
		}
		var $input = $('#' + popElemId);
		if($input.length == 0){
			continue;
		}
		$input.val(val);		
	}	
}

/**
 * paramNm으로 선언한 값들을 key:value 객체로 만들어 리턴한다.
 */
function getSearchParamObj(o){
	var ret = {};
	for(var i=0; i<o.mappingArr.length; i++){
		var mappingObj = o.mappingArr[i];
		var paramNm = mappingObj['paramNm'];
		dc(paramNm);
		if( ! paramNm){
			continue;
		}
		var val = mappingObj['initVal'];
		dc(val);
		ret[paramNm] = val;
	}
	return ret;
}
//===================== 공통팝업을 위한 공통함수를 정의하는 코드들 (popup.js) - end =======================

//======================== 공통팝업 템플릿을 정의하는 코드들 (popup.js) - start =========================
/**
 * 거래처 검색 팝업 (템플릿 코드)
 * 		- TODO: bindingContext 고려
 */
function searchCustomer(opts){

	var o = {
		isGrid: false, //그리드에서 호출할 경우 true
		grdId: null,	//isGrid가 true일 경우에만 유효
		rowId: null,	//isGrid가 true일 경우에만 유효
		searchUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/searchCust.fo", //그리드 조회 URL
		popupUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/commCustPopup.fo", //팝업페이지 URL
		popupNm: 'searchCustomerPopup',	//팝업윈도우 name
		popupWidth: 550,	 //팝업 가로크기(없으면 기본값)
		popupHeight: 450, //팝업 세로크기(없으면 기본값)
		//mappingArr의 구조
		//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
		//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
		//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
		//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
		//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
		mappingArr: [
		 	{elemId:'CUST_CD',     rsNm:'CODE', paramNm:'CUST_CD', popElemId:'CUST_VAL'},	 //거래처 코드	 
			{elemId:'CUST_NM',      rsNm:'NAME'}     //거래처 명	
		],
		// 검색 조건으로 추가할 파라미터
		searchParam: {  } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};
	
	//opts를 정의했을 경우에는 opts를 병합한다. 
	//프로퍼티명(ex: mappingArr)이 같은 것이 존재할 경우에는 opts가 o를 덮어쓴다. 	
	if(opts && (!$.isEmptyObject(opts))){
		$.extend(o, opts);
	}
	
	var eventType = opts.type;
	if(eventType == 'POP') {
		openSearchPopup(o);	//팝업 호출
	}else if(eventType == 'GET') {
		getUniqueData(o);	//단건 검색
	}	
}

/**
 * 부서 검색 팝업
 * 
 */
function searchDpt(opts){
	var o = {
		isGrid: false, 	//그리드에서 호출할 경우 true
		grdId: null,	//isGrid가 true일 경우에만 유효
		rowId: null,	//isGrid가 true일 경우에만 유효
		searchUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/searchDept.fo", //그리드 조회 URL
		popupUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/commDeptPopup.fo", //팝업페이지 URL
		popupNm: 'searchDptPopup',	//팝업윈도우 name
		popupWidth: 550,	 		//팝업 가로크기(없으면 기본값)
		popupHeight: 370, 			//팝업 세로크기(없으면 기본값)
		//mappingArr의 구조
		//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
		//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
		//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
		//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
		//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
		mappingArr: [
		 	{elemId:'DPT_CD', rsNm:'CODE', paramNm:'DPT_CD', popElemId:'DPT_VAL'},	 //부서 코드	 
			{elemId:'DPT_NM', rsNm:'NAME'}     //부서 명	
		],
		// 검색 조건으로 추가할 파라미터
		searchParam: { P_SEARCH_ALL_YN:"Y" } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};
	
	//opts를 정의했을 경우에는 opts를 병합한다. 
	//프로퍼티명(ex: mappingArr)이 같은 것이 존재할 경우에는 opts가 o를 덮어쓴다. 	
	if(opts && (!$.isEmptyObject(opts))){
		$.extend(o, opts);
	}
	
	var eventType = opts.type;
	 
	if(eventType == 'POP') {
		openSearchPopup(o);	//팝업 호출
	}else if(eventType == 'GET') {
		getUniqueData(o);	//단건 검색
	}
}

/**
 * 사용자 검색 팝업
 * 
 */
function searchUser(opts){
	var o = {
		isGrid: false, 	//그리드에서 호출할 경우 true
		grdId: null,	//isGrid가 true일 경우에만 유효
		rowId: null,	//isGrid가 true일 경우에만 유효
		searchUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/searchUser.fo", 	//그리드 조회 URL
		popupUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/commUserPopup.fo", 	//팝업페이지 URL
		popupNm: 'searchUserPopup',	//팝업윈도우 name
		popupWidth: 550,	 		//팝업 가로크기(없으면 기본값)
		popupHeight: 450, 			//팝업 세로크기(없으면 기본값)
		//mappingArr의 구조
		//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
		//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
		//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
		//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
		//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
		mappingArr: [
		 	{elemId:'USER_ID', rsNm:'CODE', paramNm:'SEARCH_VAL', popElemId:'SEARCH_VAL'},	 //부서 코드	 
			{elemId:'USER_NM', rsNm:'NAME'}     //부서 명	
		],
		// 검색 조건으로 추가할 파라미터
		searchParam: { } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};
	
	//opts를 정의했을 경우에는 opts를 병합한다. 
	//프로퍼티명(ex: mappingArr)이 같은 것이 존재할 경우에는 opts가 o를 덮어쓴다. 	
	if(opts && (!$.isEmptyObject(opts))){
		$.extend(o, opts);
	}
	
	var eventType = opts.type;
	 
	if(eventType == 'POP') {
		openSearchPopup(o);	//팝업 호출
	}else if(eventType == 'GET') {
		getUniqueData(o);	//단건 검색
	}
}

/**
 * 사원 검색 팝업
 * 
 */
function searchEmp(opts){
	var o = {
		isGrid: false, 	//그리드에서 호출할 경우 true
		grdId: null,	//isGrid가 true일 경우에만 유효
		rowId: null,	//isGrid가 true일 경우에만 유효
		searchUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/searchEmp.fo", 	//그리드 조회 URL
		popupUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/commEmpPopup.fo", 	//팝업페이지 URL
		popupNm: 'searchEmpPopup',	//팝업윈도우 name
		popupWidth: 550,	 		//팝업 가로크기(없으면 기본값)
		popupHeight: 450, 			//팝업 세로크기(없으면 기본값)
		//mappingArr의 구조
		//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
		//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
		//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
		//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
		//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
		mappingArr: [
		 	{elemId:'EMP_CD', rsNm:'CODE', paramNm:'SEARCH_VAL', popElemId:'SEARCH_VAL'},	 //부서 코드	 
			{elemId:'EMP_NM', rsNm:'NAME'}     //부서 명	
		],
		// 검색 조건으로 추가할 파라미터
		searchParam: { } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};
	
	//opts를 정의했을 경우에는 opts를 병합한다. 
	//프로퍼티명(ex: mappingArr)이 같은 것이 존재할 경우에는 opts가 o를 덮어쓴다. 	
	if(opts && (!$.isEmptyObject(opts))){
		$.extend(o, opts);
	}
	
	var eventType = opts.type;
	 
	if(eventType == 'POP') {
		openSearchPopup(o);	//팝업 호출
	}else if(eventType == 'GET') {
		getUniqueData(o);	//단건 검색
	}
}


/**
 * 우편번호 검색 팝업 (템플릿 코드)
 * 
 * 		- TODO: bindingContext 고려
 */
function searchPost(opts){

	var o = {
		isGrid: false, //그리드에서 호출할 경우 true
		grdId: null,	//isGrid가 true일 경우에만 유효
		rowId: null,	//isGrid가 true일 경우에만 유효
		searchUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/searchPost.fo", //그리드 조회 URL
		popupUrl: CONST.CONTEXT_PATH + "/common/syscommon/commonPage/findPost.fo", //팝업페이지 URL
		popupNm: 'searchPostPopup',	//팝업윈도우 name
		popupWidth: 600,	 //팝업 가로크기(없으면 기본값)
		popupHeight: 470, //팝업 세로크기(없으면 기본값)
		//mappingArr의 구조
		//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
		//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
		//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
		//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
		//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
		mappingArr: [
			 			{elemId:'ADDR_ZIP', rsNm:'ZIP_CD', paramNm:'SEARCH_VAL', popElemId:'SEARCH_VAL'},  //우편번호
			 		 	{elemId:'ADDR', rsNm:'ADDRESS'} //거래처 명
			 		],
		// 검색 조건으로 추가할 파라미터
		searchParam: {  } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};
	
	//opts를 정의했을 경우에는 opts를 병합한다. 
	//프로퍼티명(ex: mappingArr)이 같은 것이 존재할 경우에는 opts가 o를 덮어쓴다. 	
	if(opts && (!$.isEmptyObject(opts))){
		$.extend(o, opts);
	}

	var eventType = opts.type;
	if(eventType == 'POP') {
		openSearchPopup(o);	//팝업 호출
	}else if(eventType == 'GET') {
		getUniqueData(o);	//단건 검색
	}	
}
//======================== 공통팝업 템플릿을 정의하는 코드들 (popup.js) - end ==========================


/**
 *	콘솔에 로그를 출력하는 console.log()를 Wrapping한 함수 (FO1=>eHR) 
 */
function dc(str){
	var c = window.console;
	if (isDebugConsoleEnabled && c){
		c.log(str);
	}
}


/**
 *	해당 자바스크립트 객체가 가지고 있는 속성들을 모두 출력한다. (FO1) 
 */
function printObj(obj, hasOwnPropertyBool){
	for(var key in obj){
		if( ! hasOwnPropertyBool || obj.hasOwnProperty(key)){
			dc('key:'+key+', value:'+obj[key]+'\n');
		}
	}
}


/**
 *  여러 개의 javascript 객체를 하나로 묶어서 리턴해 주는 함수 (FO1)
 *	 	- 시그니처 상에는 인수가 1개로 되어 있지만, 함수의 목적이 여러 개의 인수를 받아서 하나로 묶는 것이기 때문에 
 *		   실제 호출시에는  여러 개의 인수를 받아들인다.
 */
function getMergedObject(obj){
	var ret = {};
	for(var i=0; i < arguments.length; i++){
		$.extend(true, ret, arguments[i]);	
	}
	return ret; 
}


/**
 *	그리드가 아닌 일반 javascript 객체를 데이터셋 파라미터로 보내고 싶을 때,
 *	데이터셋 형태로 받을 수 있도록 해당 JSON 형식으로 wrapping해 주는 함수 (FO1) 
 */
function wrapDatasetParam(obj){
	var ret = {};
	ret["data"] = [obj];
	ret["deletedData"]  = [];
	return ret;
}


/**
 * 공통 ajax 호출 함수 (FO1)
 *
 *		호출인자가 jQuery.ajax() 함수와 동일하나 다음의 인수속성들이 추가되었다. 
 *			- pCall (사용자정의 콜백 함수)
 *			- pLoad (로딩이미지 노출 여부)
 */
function ajax(options){
	//개발자가 options 에 정의한 함수를 별도의 객체에 move한다.
	var customFunctions = {};	
	for(key in options){
		var value = options[key];
		if($.isFunction(value)){	//함수일 경우
			customFunctions[key] = value;
			delete options[key];
		}
	}
	
	var o = {},
	      defaultOptions = {
			dataType : 'text',		//공통 ajax함수에서는 plain text 타입을 기본으로 사용한다.
			headers:{'AjaxType':'raw'},	//개발자가 서버에서 Write한 결과를 그대로 받도록 하는 규약
			beforeSend : function(jqXHR, settings){	//공통 ajax 이벤트핸들러를 먼저 호출하고 사용자정의 이벤트핸들러를 호출한다.
				dc("beforeSend");
				openLoadingImage({pLoad: options.pLoad});	//로딩이미지 노출
				execFuncIfExistInObj(customFunctions, 'beforeSend', arguments);		
			},
			success : function(data, textStatus, jqXHR){
				dc("success");
				execFuncIfExistInObj(customFunctions, 'success', arguments);
			},
			error : function(jqXHR, textStatus, errorThrown){
				dc("error");
				alert("Service Temporarily Unavailable (staus : " + jqXHR.status+")");			
				execFuncIfExistInObj(customFunctions, 'error', arguments);
			},
			complete : function(jqXHR, textStatus){
				dc("complete");
				closeLoadingImage();	//로딩이미지 닫기				
				
				var returnData = jqXHR.responseText;
		
				//------------------------------------- 쿠키에서 메세지 읽는 처리 - start -------------------------------------------
				//쿠키에서 메세지 값을 읽어들이며 메세지를 조회해서 어떤 메세지를 뿌려주어야 할 지 정하고 메세지타입을 결정한다.
				//메세지 타입은 동시에 존재할 수 없고 한 요청에 하나만 존재할 수 있다고 가정한다. 그러므로 이 중에서 한 set의 msgTp, msgCd, msgText만 출력 대상이 된다.
		        var pairs = document.cookie.split('; ');
				var key, value, errCd, msgTp, msgCd, msgText;
		        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
					key = pair[0]; value = pair[1];
					if(key === ERROR_CODE){								//결과 코드
						errCd = value;
					}else if(key === ERROR_MESSAGE_CODE){		//에러메세지 코드
						msgTp = MSG_TP_ERR; msgCd = value;
					}else if(key === ERROR_MESSAGE_TEXT){		//에러메세지
						msgText = value;
					}else if(key === MESSAGE_CODE){					//메세지 코드
						msgTp = MSG_TP_MSG; msgCd = value;
					}else if(key === MESSAGE_TEXT){					//메세지 
						msgText = value;
					}else if(key === STATUS_MESSAGE_CODE){	//상태메세지 코드
						msgTp = MSG_TP_STATUS; msgCd = value;
					}else if(key === STATUS_MESSAGE_TEXT){	//상태메세지
						msgText = value;
					}
		        }//end for
		        
		        //메세지 decode - 인코딩된 문자열의 space가 +로 변경되었기 때문에 수동으로 복원해 준다.
		        msgText = decodeURIComponent(msgText || '').replace(/\+/g, ' ');	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
				//dc('errCd : '+errCd+'\nmsgTp:'+msgTp+'\nmsgCd:'+msgCd+'\nmsgText:'+msgText);
		        var retMsg = {errCd:errCd, msgTp:msgTp, msgCd:msgCd, msgText:msgText};
				//------------------------------------- 쿠키에서 메세지 읽는 처리 - end -------------------------------------------

				//사용자정의 complete 실행
				execFuncIfExistInObj(customFunctions, 'complete', arguments);	
				
				//사용자정의 콜백 실행
				var callback = customFunctions['pCall'];		
				if((errCd == ERR_CD_SUCCESS) && $.isFunction(callback)){
					callback(returnData, errCd, msgTp, msgCd, msgText);
				}
				
				//선별된 메세지를 타입에 맞추어 출력(alert or footer출력 등)
				
				outMessage(retMsg);
				
				//세션 만료 : 권한없음 에러코드일 경우 에러페이지로 페이지 이동 ERR_CD_NO_AUTH : -10
				if(retMsg.errCd == ERR_CD_NO_AUTH){
					dc("ajax : "+ERR_CD_NO_AUTH);
					goSessionExpiredPage({alert:false}); //outMessage()에서 alert처리를 하므로 false로 셋팅
				}				
				
				//------------------------------------- 메세지 쿠키를 지워주는 처리 - start -------------------------------------------
				var cookieOpt = {path:'/'};
				$.cookie(ERROR_CODE, null, cookieOpt);
				$.cookie(ERROR_MESSAGE_CODE, null, cookieOpt);
				$.cookie(ERROR_MESSAGE_TEXT, null, cookieOpt);
				$.cookie(MESSAGE_CODE, null, cookieOpt);
				$.cookie(MESSAGE_TEXT, null, cookieOpt);
				$.cookie(STATUS_MESSAGE_CODE, null, cookieOpt);
				$.cookie(STATUS_MESSAGE_TEXT, null, cookieOpt);
				//------------------------------------- 메세지 쿠키를 지워주는 처리 - end -------------------------------------------
			}
		};			
	
	$.extend(o, defaultOptions, options);
	$.ajax(o);
}


/**
 * 	첫 번째 인수로 받은 객체의 속성으로 두 번째 인수의 이름을 갖는 함수가 존재하면 세 번째 인수인 인수배열을 넘겨서 해당 함수를 실행한다. (FO1)
 */
function execFuncIfExistInObj(obj, functionName, args){
	var func;
	//obj가 grid 일수도, grid.p 일수도 있다.
	if(obj.p){
		func = obj.p[functionName];
	}else{
		func = obj[functionName];
	}
	
	if($.isFunction(func)){
		return func.apply(obj, args);
	}	
}


/**
 * 	ajax 응답객체로부터 수행결과코드 및 출력해 주어야할 메세지를 선별하여 리턴하는 함수. (FO1)
 * 
 * @param returnData
 */
function getReturnMsg(returnData){
	//응답 객체에서 메세지 값을 읽어들이며 메세지를 조회해서 어떤 메세지를 뿌려주어야 할 지 정하고 메세지타입을 결정한다.
	//메세지 타입은 동시에 존재할 수 없고 한 요청에 하나만 존재할 수 있다. 그러므로 이 중에서 한 set의 msgTp, msgCd, msgText만 출력 대상이 된다.
	var errCd, normalMsgCd, normalMsgText, statusMsgCd, statusMsgText, errMsgCd, errMsgText, msgTp, msgCd, msgText;
	
	errCd 			= returnData[ERROR_CODE]; 					//결과 코드
	errMsgCd 		= returnData[ERROR_MESSAGE_CODE];	//에러메세지 코드
	errMsgText 		= returnData[ERROR_MESSAGE_TEXT];		//에러메세지
	normalMsgCd 	= returnData[MESSAGE_CODE];				//메세지 코드
	normalMsgText = returnData[MESSAGE_TEXT];				//메세지
	statusMsgCd 	= returnData[STATUS_MESSAGE_CODE];	//상태메세지 코드
	statusMsgText = returnData[STATUS_MESSAGE_TEXT];	//상태메세지
	
	if(errMsgCd !=null && errMsgCd.length > 0){
		msgTp = MSG_TP_ERR;	msgCd = errMsgCd; msgText = errMsgText;
	}else if(normalMsgCd !=null && normalMsgCd.length > 0){
		msgTp = MSG_TP_MSG;	 msgCd = normalMsgCd; msgText = normalMsgText;
	}else if(statusMsgCd !=null && statusMsgCd.length > 0){
		msgTp = MSG_TP_STATUS; msgCd = statusMsgCd; msgText = statusMsgText;
	}
	
	dc('errCd : '+errCd+'\nmsgTp:'+msgTp+'\nmsgCd:'+msgCd+'\nmsgText:'+msgText);
	return {errCd:errCd, msgTp:msgTp, msgCd:msgCd, msgText:msgText};
}


/**
 * 	응답 메세지를 선별하여 alert()이나 footer에 출력한다. (FO1=>eHR)
 */
function outMessage(retMsg){
	if(retMsg.msgText == null || retMsg.msgText.length == 0){ return; }	//값이 없으면 리턴
	
	//에러메세지나 일반메세지는 alert을 띄운다.
	if(retMsg.msgTp === MSG_TP_ERR || retMsg.msgTp === MSG_TP_MSG){ 	
		alert(retMsg.msgText.replace(/\\n/gi, '\n'));
		
	//상태메세지는 footer에 출력한다.
	}else if(retMsg.msgTp === MSG_TP_STATUS){
		var t = getFOTopWin(window);
		if(t.FO_BOTTOM_FRAME && typeof(t.FO_BOTTOM_FRAME.document) == 'object' ) {
			$("#divMessageFooter", t.FO_BOTTOM_FRAME.document).text(retMsg.msgText);
		}
	}
}


/**
 * 	상태표시줄 메세지 삭제 (FO1=>eHR)
 */
function clearMessage(){
	var doc = getFOTopWin(window).FO_BOTTOM_FRAME.document;
	if(typeof(doc) == 'object' ) {
		$("#divMessageFooter", doc).text("");
	}
}


/**
 * open change password page (FO1=>eHR)
 * @param userId 
 */
function openPasswdChangeWin(userId){ 

	var options = {
		strUrl : CONST.CONTEXT_PATH + "/common/syscommon/authority/pwdChangePage.fo", 
		popupName : "openChangePwd",  
		popupOpts : {	//jQuery-UI dialog options
			title : "Change Password",
			width : 300,
			height: 200,
			speed  : 700,
	        show: {effect: 'fold', duration: 1000},  
			hide: {effect: "fold", duration: 1000}
		},		
		param : {g_userId: userId}, 
		pCall : function(data){}	//콜백이 필요할 경우에만 정의
	};
	
	openPopup(options);
}

function openExpiredPasswdChangeWin(userId){ 

	var options = {
		strUrl : CONST.CONTEXT_PATH + "/common/syscommon/authority/expiredPwdChangePage.fo", 
		popupName : "openChangeExpiredPwd",  
		popupOpts : {	//jQuery-UI dialog options
			title : "Change Password",
			width : 300,
			height: 200,
			speed  : 700,
	        show: {effect: 'fold', duration: 1000},  
			hide: {effect: "fold", duration: 1000}
		},		
		param : {g_userId: userId}, 
		pCall : function(data){}	//콜백이 필요할 경우에만 정의
	};
	
	openPopup(options);
}

/**
 * 	close password change popup (FO1=>eHR)
 */
function closePasswdChangeWin(){
	closeDlg("openChangePwd");
}

function closeExpiredPasswdChangeWin(){
	closeDlg("openChangeExpiredPwd");
}

//---------- 메시지 조회 관련 - start ----------

/**
* 	FO_MESSAGE_FRAME의 window객체 획득 (eHR)
*/
function getMsgFrame(o){

	if(o == null){ o = window; } //초기값
//	dc('@ getMsgFrame('+o.name+')');
	
	var t = getFOTopWin(o); //top
	var tmf = t.FO_MESSAGE_FRAME;
	
	//재귀호출 종료 조건 1 - 메세지 프레임 존재
	if(tmf){
//		dc('@ 메세지 프레임이 존재하여 재귀호출 종료');
		return tmf;
		
	}else{
//		dc('@ 현재 레벨에서 메세지 프레임이 존재하지 않음');
		
		var oo = o.opener;
		
		//재귀호출 종료 조건 2 - 메세지 프레임이 없는데 opener도 존재하지 않음
		if(! oo){
//			dc('@ 메세지 프레임을 못찾았는데 opener도 존재하지 않으므로 종료');
			return null; 
		}

		//재귀호출 종료 조건 3 - cross domain opener일 경우
		//여기서 opener를 재귀적으로 호출하는 것은, 팝업에서 메세지를 찾을 때 팝업에 메세지 프레임(messageCache.jsp)이 존재하지 않을 경우,
		//계속 opener를 찾아가면서 메세지 프레임이 있는 window (ex: viewMain.jsp)를 찾아가기 위함이다.
		//그런데 eHR이 다른 도메인의 페이지(ex: CJWorld)에서 <a href="blabla" target="_blank"/> 태그를 사용하여 창이 생성되었을 때,
		//그 다른 도메인의 페이지가 opener가 되어 버리는 문제 때문에 크로스도메인 접근권한 에러를 발생시키는 일이 있었다.
		//그래서 opener가 존재하더라도 에러(크로스도메인 접근에러)가 발생하면, 어차피 메세지 프레임이 없을 것이므로 null을 리턴하도록 처리하였다.
		if(isInaccessibleWin(oo)){
//			dc('@ opener가 다른 도메인 소속이므로 재귀호출 종료');
			return null;
		}
		
		return getMsgFrame(oo); //재귀호출
	}
}


/**
* 	캐싱된 메시지 객체에서 해당 메시지코드의 메시지를 조회한다. (eHR)
* FO_MESSAGE_FRAME에 저장된 세션로케일에 해당하는 메시지가 없을 경우,
* FO_MESSAGE_FRAME에 저장된 시스템기본로케일을 얻어서 메시지를 조회한다. 
*/
function getCachedMsg(messageCd){

	var msgFrame = getMsgFrame();
	if( ! msgFrame){ return null; }
	var msgObj = msgFrame.cachedMsg;
	return msgObj[messageCd];
}


/**
* 	해당 코드의 메시지를 조회한 후 필요한 동작을 실행 (eHR)
* 		(1) 브라우저에 캐싱된 메시지 목록을 먼저 탐색
* 		(2) (1)에서 실패했을 경우 서버 transaction 수행
*/
function retrieveMessage(messageCd, bindInfo, act){

	var retrievedCachedMsg = getCachedMsg(messageCd); 
	if(retrievedCachedMsg != null){
		return processMessage(retrievedCachedMsg, bindInfo, act);
		
	}else{
		
		//showConfirm에서 호출했을 경우는 메세지 캐싱 목록에 해당하는 코드만 넣을 것을 가이드 (개발자 대상 가이드이므로 다국어 불필요)
		//ajax를 통해 confirm용 메세지를 조회할 경우 javascript 수행을 block할 수 없으므로 이렇게 처리하였음. 
		if(act === 'confirm'){
			var guideMsg = 'showConfirm()에 인수로 들어가는 메세지 코드는 반드시\n메세지 캐싱 목록에 정의된 코드여야 합니다.\n'
				               + '캐싱 대상 코드가 아닐 경우에는 showConfirmByText()를 사용하여\n메세지 코드가 아닌 해석된 메세지 문자열을 인수로 넣어서 호출해 주십시오.';
			alert(guideMsg);
			return;
		}
		
		var options = {
			strUrl : CONST.CONTEXT_PATH + '/frameone/syscommon/searchMessage.fo',
			param : {msgCode: messageCd},
			pCall : function(svcId, data, errCd, msgTp, msgCd, msgText){
				processMessage(data.msgText, bindInfo, act);       
			},
			pLoad : false
		};
		transaction(options);
	}
}


/**
*	조회가 완료된 메시지를 바인딩 인수와 결합하여 사용자에게 피드백한다. 	
*/
function processMessage(message, bindInfo, act){
	var boundMessage = replaceMessageBind(message, bindInfo); 
	if(act === 'alert'){
		alert(boundMessage.replace(/\\n/gi, '\n'));
	}else if(act === 'confirm'){
		return confirm(boundMessage);
	}else if($.isFunction(act)){
		act.call(this, boundMessage);
	}
}

	
/** 
* 메세지를 조회하여 alert 출력 
* @param	messageCd	 메세지 코드
* @param	bindInfo 메세지 코드에 바인딩할 정보(바인딩 정보가 여러건일경우 "|"로 구분 ex: "사용자|부서|직급"
*/
function showMessage(messageCd, bindInfo) {
	retrieveMessage(messageCd, bindInfo, 'alert');
}


/**
* 메시지를 조회하여 confirm 출력 
* 	- 이 함수의 인수로 넘기는 메세지코드는 반드시 messageFrame의 캐싱 대상이어야 한다.
* 	  (transaction으로 넘어가게 될 경우 현재 스레드를 block 시킬 수 없기 때문에)
* @param	messageCd	 메세지 코드
* @param	bindInfo 메세지 코드에 바인딩할 정보(바인딩 정보가 여러건일경우 "|"로 구분 ex: "사용자|부서|직급"
*/
function showConfirm(messageCd, bindInfo) {
	return retrieveMessage(messageCd, bindInfo, 'confirm');
}


/** 
* 메세지 텍스트를 인수로 받아서 alert 출력 
* @param	message	 메세지 텍스트
* @param	bindInfo 바인딩 정보
*/
function showMessageByText(message, bindInfo) {
	alert(replaceMessageBind(message, bindInfo));
}


/**
* 메시지 텍스트를 인수로 받아서 confirm 출력 
* @param	message	 메세지 텍스트
* @param	bindInfo 바인딩 정보
*/
function showConfirmByText(message, bindInfo) {
	return confirm(replaceMessageBind(message, bindInfo));
}


/**
* 메시지 바인딩 처리 
* @param	message	 메세지
* @param	bindInfo 바인딩 정보
*/
function replaceMessageBind(message, bindInfo) {
	var arrBind;
	if(bindInfo != null && bindInfo.length > 0)
	{
		arrBind = bindInfo.split("|");
		for(var i=0; i<arrBind.length; i++)
		{
			message = message.replace( "{" + i + "}", arrBind[i]);
		}
	}
	return message;
}

//---------- 메시지 조회 관련 - end ----------


/**
 *  Popup Window OPEN (eHR)
 */
function openWindowPopup(popOptions)
{
	// Popup Window Default 옵션
	var defaultPopupOptions = {	
			width:500,      // sets the width in pixels of the window.
			height:500,     // sets the height in pixels of the window.
			centerScreen:1, // center window over entire screen {1 (YES) or 0 (NO)}. overrides top and left
			left:0,         // left position when the window appears.
			location:0,     // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
			menubar:0,      // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
			resizable:0,    // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
			scrollbars:0,   // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
			status:0,       // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
			windowName:null,// name of window set from the name attribute of the element that invokes the click
			windowURL:null, // url used for the popup
			top:0,          // top position when the window appears.
			toolbar:0,      // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
			alwaysRaised:1, // Always in front of all other browser windows. Signed script required.
			dependent:1,    // Subwindow closes if the window that opened it closes.
			directories:0
	};

	var settings = $.extend(defaultPopupOptions, popOptions);
	
	// 2013-01-20 수정 ==>  Safari, Chrome 팝업창 높이 조정 
	// Sarari는 IE에 비해 팝업창이 크게 뜨고, Chrome은 팝업창이 작게떠서 크기 조정.
	var app_version = navigator.appVersion.toUpperCase();
    if(app_version.indexOf('CHROME') >= 0) { 
    	settings.height = parseInt(settings.height, 10) + 5;
    }else if(app_version.indexOf('SAFARI') >= 0) { 
    	settings.height = parseInt(settings.height, 10) - 75;
    }
   
	// PopupWindow를 중앙에 출력 하고자 할 경우 
	if(settings.centerScreen) {  
		
//		if (getBrowser().indexOf('IE') >= 0) { //hacked together for IE browsers
//			settings.top  = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (settings.height/2)));
//			settings.left = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (settings.width/2)));
			
			//콘도팬션 팝업 호출
//			if(settings.centerScreen == 2){
//				settings.top  = 230; 
//				settings.left = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (settings.width/2)));
//			}
//		}else{
			settings.top  = window.screenY + (((window.outerHeight/2) - (settings.height/2)));
			settings.left = window.screenX + (((window.outerWidth/2) - (settings.width/2)));
//		}
		 
	}
	    
	var windowFeatures = 'height='       + settings.height +
						 ',width='       + settings.width +
						 ',left='        + settings.left +
						 ',top='         + settings.top +
						 ',location='    + settings.location +
						 ',menuBar='     + settings.menubar +
						 ',resizable='   + settings.resizable +
						 ',scrollbars='  + settings.scrollbars +
						 ',status='      + settings.status + 
						 ',toolbar='     + settings.toolbar +
						 ',alwaysRaised='+ settings.alwaysRaised +
						 ',dependent='   + settings.dependent +
						 ',directories=' + settings.directories;

	// 파라메터값 생성 
	var param    = "";
	var cntParam = 0;
	for(variable in settings.param)
	{
		if(cntParam == 0) param += "?";
		else param += "&";
		
		param += variable + "=" + encodeURIComponent(settings.param[variable]); //Prameter Add
		
		cntParam ++; // Count 
	}
	
	settings.windowURL = settings.windowURL + param;
	
	//IE(?)에서 window.open()에서 윈도우 명에 공백이나 특수문자가 들어가면 팝업 자체가 뜨지 않으므로 공백/특수문자를 제거한다.
	if(settings.windowName != null && settings.windowName.length > 0){
		settings.windowName = settings.windowName.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]/gi, '');
	}
	
	var objWin = window.open(settings.windowURL, settings.windowName, windowFeatures);
	
	if (objWin == null) {
		// 팝업차단 : failed for most browsers 
		showMessage("MSG_COM_ERR_043");
	}else { 
		setTimeout(function() { 
			if (objWin.innerHeight === 0) { 
				// 팝업차단 : failed for chrome 
			    showMessage("MSG_COM_ERR_043");
			}else {
				objWin.focus();
			}
		}, 100); 
	}
	
	/**
	 * 팝업 일괄 관리용 
	 * - 일괄 닫기를 사용하기 위해 전역 팝업 변수에 담기
	 * */
	if(opener != null){	//다중 팝업
		
		var top_op = null;
		var op = opener;
		while(true){
			
			if(op.opener != null){
				op = op.opener;
			}else{
				top_op = op;
				break;
			}
		}
		top_op.top.parent.popupArray.push(objWin);
		
	}else{	//단일 팝업
		parent.popupArray.push(objWin);
	}
	
	return objWin;
}


/**
 *  Popup Window 닫기 (eHR)
 */
function closeWindowPopup(resultData, rowId, userFunc){
	
	if(userFunc != "undefined" && isEmpty(userFunc) == false){
		// 코드 검색 후 실행할 사용자 정의 함수 호출(조회 결과값 Data를 parameter로  넘김)
		var fn_user = eval("opener." + userFunc);
		if((typeof fn_user) != undefined){
			fn_user(resultData, rowId);
		}
	}
	self.close();
}


/**
 * 코드 검색 결과값 Setting 
 * @param errCd    : 결과코드
 * @param data     : 조회결과 Data
 * @param colName  : 조회결과 Date의 코드명 컬럼명
 * @param grdId    : 그리드 ID
 * @param rowId    : 그리드 rowid
 * @param nameObjNm: 코드명 Object ID 
 * @param userFunc : 코드 검색 후 실행할 사용자 정의 함수명 
 * @returns
 */
/*
function setCommonPopupResult(errCd, dataRslt, grdId, rowId, codeNm, nameNm, userFunc){

    // 결과가 성공이 아닐 경우 Return 
	if(errCd != ERR_CD_SUCCESS) return false;
	var data = dataRslt['data'];

	if( data.length == 1) {
		// 조회 결과 Data 건수가 1건일 경우 
		
		if( isEmpty(grdId) == true ) {
			$('#'+codeNm).val(data[0]["CODE"]);
			$('#'+nameNm).val(data[0]["NAME"]);
		}else {
            var $grd = $("#" + grdId);
		    
            var idxRow = $grd.jqGrid('getInd', rowId);
			//$('#'+ idxRow + "_"+ codeNm).val(data[0]["CODE"]);  
			//$grd.jqGrid("saveCell", idxRow,  getColIndex($grd.jqGrid('getGridParam', 'colModel'), codeNm) ); 

            $grd.jqGrid('setCell', rowId, codeNm, data[0]["CODE"], '','', true);
            $grd.jqGrid('setCell', rowId, nameNm, data[0]["NAME"], '','', true);
		}
		// 코드 검색 후 실행할 사용자 정의 함수 호출(조회 결과값 Data를 parameter로  넘김)
		var fn_user = eval(userFunc); 
		if($.isFunction(fn_user)){
			fn_user(data[0], rowId);		
		}
		return true;
	}else {
		// 조회 결과 Data 건수가 1건이 아닐 경우 
		return false;
	}
}
*/

/**
 * 코드 검색 팝업에서 사용할 Main 화면의 Code값 가져오기 
 * @param   grdObj : 그리드 Object
 * @param   rowId  : 그리드 rowid
 * @param   codeNm : 코드 컬럼명 
 * @returns 
 */
/*
function getPopupCodeValue(grdid, rowId, codeNm, nameNm){
	
	var codeValue = "";
	
	if(isEmpty(grdid) == true) {
		// 그리드가 아닐 경우 
		codeValue = $('#'+codeNm).val();
		
		// 코드값이 없을 경우 코드명 컬럼값 Clear 
		if ( codeValue == "" ) {
			$('#'+nameNm).val("");
		}
	}else {
		// 그리드일  경우 
		var $grd = $("#" + grdid);
		codeValue = $('#' + $grd.jqGrid('getInd', rowId) + "_" +  codeNm ).val();

		if( codeValue == undefined) {
			codeValue = $grd.jqGrid('getCell', rowId, codeNm);
		}
		
		// 코드값이 없을 경우 코드명 컬럼값 Clear 
		if ( codeValue == "" ) {
			$grd.jqGrid('setCell', rowId, nameNm, '', '','', true);
		}
	}
	return codeValue;
}
*/


/**
 * 거래처 코드 검색 함수
 * @param   grdId     : 그리드 Object ID
 * @param   rowId     : 그리드 rowid
 * @param   codeObjNm : 코드  Object ID 
 * @param   nameObjNm : 코드명 Object ID(그리드일 경우 크도명 컬럼명)
 * @param   userFunc  : 코드 검색 후 실행할 사용자 정의 함수명 
 * @returns 
 */
/*
function getTplCustPopup(grdId, rowId, codeNm, nameNm, userFunc){
	
	var codeValue = getPopupCodeValue(grdId, rowId, codeNm, nameNm);
	
	if ( codeValue == "") {
		// 코드 검색 후 실행할 사용자 정의 함수 호출(조회 결과값 Data를 parameter로  넘김)
		var fn_user = eval(userFunc); 
		if($.isFunction(fn_user)){
			fn_user(null, rowId);	
		}
		return;
	}
	
	//트랜젝션 파라미터 설정
	var param = {
		svcId : "cust",                                                       // 서비스ID 
		strUrl: CONST.CONTEXT_PATH + '/common/syscommon/commonPage/searchCust.fo', // 조회 url
		param : {START_ROW:1, END_ROW:2, SEARCH_VAL:codeValue},               // 전송할 파라미터 설정 
		pCall : function(svcId, data, errCd, msgTp, msgCd, msgText){  
			
			    // 코드 검색 결과 Setting => 조회결과 Data
			    // @param data     : 조회결과 Data, 조회결과 Date의 코드명 컬럼명, 코드명 Object ID 사용자 정의 함수
			    var rslt = setCommonPopupResult(errCd, data["ds_search"], grdId, rowId, codeNm, nameNm, userFunc); 

			    // 코드 검색 조회 결과 Data 건수가 1건이 아닐 경우 팝업을 띄우고, 해당 Object 초기화. 
			    if(rslt == false) {
			    	openTplCustPopup(grdId, rowId, codeNm, nameNm, userFunc);
			    	if( isEmpty(grdId) == true ) {
						$('#'+codeNm).val("");
						$('#'+nameNm).val("");
			    	}else {
						$('#'+grdId).jqGrid('setCell', rowId, codeNm, '', '','', true);
						$('#'+grdId).jqGrid('setCell', rowId, nameNm, '', '','', true);
			    	}
			    }
		},
		//로딩이미지 노출 여부
		pLoad : true 
	};

	//트랜젝션 실행
	transaction(param);	
}
*/


/**
 * 거래처 코드 공통 팝업 템플릿
 * @param   grdId    : 그리드 Object ID
 * @param   rowId    : 그리드 rowid
 * @param   codeNm   : 코드  Object ID 
 * @param   nameNm   : 코드명 Object ID(그리드일 경우 크도명 컬럼명)
 * @param   userFunc : 코드 검색 후 실행할 사용자 정의 함수명 
 * @returns
 */
/*
function openTplCustPopup(grdId, rowId, codeNm, nameNm, userFunc){

	var codeValue = getPopupCodeValue(grdId, rowId, codeNm, nameNm); 

	var options = {
		
		strUrl : CONST.CONTEXT_PATH + "/common/syscommon/commonPage/commCustPopup.fo", 
		popupName : "openTplCustPopup",                                
		popupOpts : {	//jQuery-UI dialog options
			width  : 600,
			height : 480
		},
		param : {
			 CUST_VAL :codeValue,
			 GRD_ID: grdId, 
			 ROW_ID: rowId, 
			 CODE_NM: codeNm, 
			 NAME_NM: nameNm,
			 USER_FUNC: userFunc
		},
		pCall : function(data){}	//콜백이 필요할 경우에만 정의
	};
	openPopup(options);
}
*/


/**
 * 	우편번호 조회
 * @param    codeObjNm : 우편번호 Object ID
 * @param    addrObjNm : 주소   Object ID
 */
function openZipCode(codeObjNm, addrObjNm){

	var options = {
			
		strUrl : CONST.CONTEXT_PATH + "/common/syscommon/commonPage/findPost.fo", 
		popupName  : "openZipCodePopup",                                
		popupOpts  : {	//jQuery-UI dialog options
			width  : 600,
			height : 450
		},
		param : {
			CODE_OBJNM: codeObjNm, ADDR_OBJNM: addrObjNm 
		},
		pCall : function(data){}	//콜백이 필요할 경우에만 정의
	};	
	
	openPopup(options);
}

/**
 * 공통 팝업 스크립트 (FO1=>eHR)
 */
function openPopup(o){
	
	closeDlg(o.popupName);	//다이얼로그 초기화 (삭제)
	
	//공통 다이얼로그 옵션
	var defaultDialogOpts = {	
		autoOpen:true,
		modal:true,
		closeOnEscape:true,	//ESC로 종료할 것인지
		width:100,
		height:100,
		position:'auto',
		resizable:false,
		beforeClose: function(event, ui) { 
			// close 이벤트가 trigger 될 때
			var func = o.pBeforeCloseCall;
			if( func != null || func != undefined ){
				var funcType = typeof(func); //본 페이지에서 호출했을 경우는 function, 팝업에서 호출하면 object 값을 갖는다. 
	    		if(funcType === 'function' || funcType === 'object'){
	            	func.call(this);
	            }
			}
    		
         },
		close: function(ev, ui) {
			// close 이벤트가 종료되고 난 후 
			$(this).dialog('destroy'); 
	        $(this).remove(); 

        },
        open: function(ev, ui) {	
        	// open 이벤트가 trigger 될 때
    		var func = o.pOpenCall;
			if( func != null || func != undefined ){
				var funcType = typeof(func); //본 페이지에서 호출했을 경우는 function, 팝업에서 호출하면 object 값을 갖는다. 
	    		if(funcType === 'function' || funcType === 'object'){
	            	func.call(this);
	            }
			}
        }
	}; 
	
	var mergedDialogOpts = $.extend(defaultDialogOpts, o.popupOpts);
	var mergedParam      = $.extend(o.param, {POPUP_NM: o.popupName});
	//dc('mergedDialogOpts : '+JSON.stringify(mergedDialogOpts));

	//팝업(jQuery-UI dialog) 호출
	jqLoad($("<div id="+o.popupName+" />"), o.strUrl, mergedParam, o.pCall, true).dialog(mergedDialogOpts);
}


/**
 * 	jQuery .load() 함수를 랩핑한 함수 (FO1)
 * 		- 사용자정의 콜백함수를 인수로 받아 호출하기 위해서 랩핑하였음.
 */
function jqLoad($obj, strUrl, param, callback, isPopup){
	
	//jQuery .load 함수의 인수로 사용할 콜백 정의
	var loadCallback = function(responseText, textStatus, XMLHttpRequest){
		dc('call jqLoadCallback');
		//dc('responseText : '+responseText);
		
		//ajax 응답이 text/html 이라면 거의 콜백에서 처리할 일이 없겠지만,
		//에러가 발생했을 경우 (ex: 접근 권한 에러)에는 application/json 형태로 에러정보가 날아오기 때문에 공통 처리를 해 주어야 한다.
		var contentType = XMLHttpRequest.getResponseHeader("Content-Type") || "";
		if(contentType.indexOf("application/json") >= 0){
			
			var returnData = JSON.parse(responseText);
			var retMsg = getReturnMsg(returnData);
			outMessage(retMsg);	//선별된 메세지를 타입에 맞추어 출력(alert or footer출력 등)			
			
			//결과가 실패일 경우 
			if(retMsg.errCd != ERR_CD_SUCCESS){ 

				//팝업(jQuery-UI dialog)일 경우에는 팝업을 닫는다.
				if(isPopup){
					$obj.remove();
					$obj.dialog("destroy");
				}
				return; //사용자정의 콜백을 수행하지 않는다.
			}
		}
		
		callback(responseText);	//사용자정의 콜백 수행
	};
	
	return $obj.load(strUrl, param, loadCallback);
}


/**
 * 공통 팝업 닫기
 * @param popupName
 */
function closeDlg(popupName, resultData, userFunc){
	popupName = "#"+ popupName;
	
	if($(popupName).dialog("isOpen") == true){ 
		//$(popupName).dialog('destroy'); 
        //$(popupName).remove(); 
		$(popupName).dialog('close'); 

		// 코드 검색 후 실행할 사용자 정의 함수 호출(조회 결과값 Data를 parameter로  넘김)
		var fn_user = eval(userFunc); 
		if($.isFunction(fn_user)){
			fn_user(resultData);		
		}
		return true;
	}
}


/**
 * 데이터를 전송/저장하는 함수. (FO1=>eHR)
 */		
function transaction(o){
	//전송할 데이터 셋팅
	var data = {};
	$.extend(data, o.param, o.inDs); 
	
	dc('---------- transaction data - start ----------');
	dc(JSON.stringify(data));	//디버깅용 전송 파라미터 출력
	dc('---------- transaction data - end -----------');
	
	//TODO: 전송할 데이터가 없을 경우 메세지 처리
	
	//call ajax
	$.ajax({
		
		url : o.strUrl,
		data : JSON.stringify(data),
		contentType : "application/json",
		beforeSend : function(jqXHR, settings){
			//dc("transaction() beforeSend : " + jqXHR);
			openLoadingImage({pLoad: o.pLoad});	//로딩이미지 노출
		},
		complete : function(jqXHR, textStatus){
			//dc("transaction() complete : " + jqXHR.responseText);
			
			closeLoadingImage();	//로딩이미지 닫기			
			
			//서버에서 에러 발생시 HtmlErrorHandlingFilter에서 SVC_ERR_DETAIL에 에러메세지를 담는데,
			//이 에러메세지에 JSON parsing이 불가능한 문자가 들어 있을 경우 JSON.parse()에서 에러가 발생하고
			//200 에러와 함께 이후 콜백이 수행되지 않는 문제 때문에 try ~ catch로 감싸주고, catch절에서 빈 메세지를 셋팅함.
			var returnData;
			try{
				returnData = JSON.parse(jqXHR.responseText);
			}catch(e){
				returnData = {ERROR_CODE:-1,ERROR_MESSAGE_CODE: '-1', ERROR_MESSAGE_TEXT: ''};
			}
			
			//ajax 응답객체로부터 수행결과코드 및 출력해 주어야할 메세지를 선별하여 리턴.
			var retMsg = getReturnMsg(returnData);
			//선별된 메세지를 타입에 맞추어 출력(alert or footer출력 등)
			outMessage(retMsg);
			
			//세션 만료시 : 권한없음 에러코드일 경우 에러페이지로 페이지 이동 ERR_CD_NO_AUTH : -10
			if(retMsg.errCd == ERR_CD_NO_AUTH){
				dc("transaction : "+ERR_CD_NO_AUTH);
				goSessionExpiredPage({alert:false}); //outMessage()에서 alert처리를 하므로 false로 셋팅
			}
			
			//사용자정의 콜백 실행
			//if((retMsg.errCd == ERR_CD_SUCCESS) && $.isFunction(o.pCall)){
			if($.isFunction(o.pCall)){ //사용자정의 에러처리를 해야 할 수도 있기 때문에 수정함
				o.pCall(o.svcId, returnData, retMsg.errCd, retMsg.msgTp, retMsg.msgCd, retMsg.msgText);		
			}
		}
	});
	
}


//eHR
//========================= 로딩이미지 관련 코드 - start ==============================

//	로딩이미지 제어를 위한 변수 (ajax call이 발생할 때 마다 (+)해 주고 ajax complete시 (-)해서, complete시 0이 되면 로딩이미지를 닫는다.)
var ajaxCallCount = 0;


/**
 *	eHR의 최상위 parent window까지 거슬러 올라가면서 
 *		(1) 현재 window의 위쪽을 점유하고 있는 parent들의 height의 합을 리턴한다.
 * 		(2) parent들의 scrollTop을 리턴한다.
 * 			 실험 결과, 자기 자신 (window.self)의 scrollTop()은 보정값으로 넣지 않아야 정상적으로 동작했다.
 * 
 * 		- FrameOne2.0a 에서는 로딩이미지의 수직위치를 center정렬 하는 것만 기본으로 제공하기 때문에, 이 함수는 deprecated 처리하고 참고용으로만 제공한다.
 */
function getRecursiveParentOffset(o, po){
	
	//param object 초기화
	if(po == null){ 
		po = {};
		po['offset'] = 0;
		po['scrollTop'] = 0;
		po['lvl'] = 0; //레벨은 디버깅만을 위한 변수임.
	}
	dc('@ getRecursiveParentOffset() > offset: '+po.offset+', scrollTop: '+po.scrollTop+', lvl: '+po.lvl);
	
	var p = o.parent;
	
	//재귀호출을 멈추는 조건 1 - (parent == self)
	if(p === o){
		dc('@ parent가 self와 같으므로 재귀호출 종료 > window.name: '+ o.name);
		return po;

	}else{
		
		//재귀호출을 멈추는 조건 2 - 현재 레벨의 parent가 다른 도메인 소속일 경우
		if(isInaccessibleWin(p)){
			dc('@ parent가 다른 도메인 소속이므로 재귀호출 종료');
			return po;
		}		

		po['lvl']++;
		
		//scrollTop 더하기
		var pScrollTop = $(p).scrollTop();
		dc('@@ parent '+po.lvl+' depth scrollTop: '+pScrollTop);
		po['scrollTop'] += pScrollTop; 
		
		//LOADIMG_OFFSET_Y 더하기
		var pOffsetY = p.LOADIMG_OFFSET_Y; 
		if(pOffsetY){
			po['offset'] += pOffsetY; 
			dc('@@ parent '+po.lvl+' depth LOADIMG_OFFSET_Y: '+pOffsetY);
		}					 
		
		return getRecursiveParentOffset(p, po); //재귀호출
	}		
	
}


/**
 * 여러가지 요인을 고려하여 로딩이미지의 수직위치(단위:픽셀)을 결정한다.
 * 
 * 		- FrameOne2.0a 에서는 로딩이미지의 수직위치를 center정렬 하는 것만 기본으로 제공하기 때문에, 이 함수는 deprecated 처리하고 참고용으로만 제공한다.
 */
function getLoaderTop(o){
	
	//로딩이미지 파일의 height 값을 입력한다.
	var imgHeight = o.imgHeight ? o.imgHeight : 35;
	
	//-------------------- 로딩이미지 수직위치 보정 - start -----------------------
	//프레임셋 혹은 상위 프레임에서 현재 페이지의 위쪽으로 점유하고 있는 높이가 있다면 로딩이미지의 수직 위치 지정시
	//해당 값들을 감해 주어야 한다. 이 보정값들은 프레임셋을 구성하고 있는 페이지(ex: viewMain.jsp), 혹은 iframe을 포함하고 
	//있는 페이지(ex: statisticsWrapper.jsp)에 LOADIMG_OFFSET_Y 라는 이름의 변수로 지정되어 있다고 가정한다.
	//또한 부모 window가 스크롤바를 가지고 있다면 해당 window의 scrollTop에 대한 보정 작업도 해 주어야 한다. 
	var offsetObj = getRecursiveParentOffset(window);

	//상위 window들이 현재 페이지의 위쪽을 차지하는 만큼의 height 합 (<=0)
	var offset = offsetObj.offset; 
	
	//상위 window들이 가지고 있는 scrollTop의 합
	var scrollTop = offsetObj.scrollTop;
	//-------------------- 로딩이미지 수직위치 보정 - end -----------------------
	
	var $winTop = $(getFOTopWin(window)); //topmost window
	
	//브라우저에서 눈에 보이는 영역(viewport, 스크롤바 제외)의 height (Opera는 예외적으로 값을 얻어와야 한다.)
	var winTopHeight = getBrowser() != 'OPERA' ? $winTop.height() : $winTop[0].innerHeight; 
	
	//로딩이미지가 뿌려질 top position
	var loaderTop = (winTopHeight / 2) - (imgHeight / 2) + offset + scrollTop; 
	
	dc('@@ winTopHeight: '+winTopHeight+', imgHeight: '+imgHeight+', offset: '+offset+', scrollTop: '+scrollTop+', loaderTop: '+loaderTop);	
	
	return loaderTop;
}


/**
* 	로딩이미지 노출
* 	- ajaxCallCount 전역변수에 종속성을 가지고 있다.
*/
function openLoadingImage(o){
	
	dc('ajaxCallCount:'+ajaxCallCount);
	if(o && o.pLoad && ajaxCallCount <= 0){

		var imgPath = o.imgPath ? o.imgPath : CONST.IMG_PATH_LOADER;	
		
		$.blockUI({
			message: '<img src="'+ imgPath +'" />',
			//메세지(로딩이미지를 감싸고 있는 box)영역에 대한 css
	        css: {
	        	//top: getLoaderTop(o), //FrameOne2.0a 에서는 로딩이미지의 수직위치를 center정렬 하는 것만 기본으로 제공하기 때문에 주석처리한다.
	        	centerX: true,
	        	centerY: true,
	       	    border: 'none',
	       	    backgroundColor: 'transparent',
	       	    opacity: 1 //로딩이미지 자체는 온전히 보여야 한다.
	       	},        
	        //오버레이영역에 대한 css
		    overlayCSS:  { 
		        opacity: 0,	//오버레이가 덮지 않는 것 처럼 보이면서 block한다. 
		        cursor: 'wait' //오버레이영역의 커서 모양 
		    }
		});
		
	}
	ajaxCallCount++;
}


/**
* 	로딩이미지 닫기
* 	- ajacCallCount 전역변수에 종속성을 가지고 있다.
*/	
function closeLoadingImage(){
	ajaxCallCount--;
	if(ajaxCallCount <= 0){
		$.unblockUI();
	}
	dc('ajaxCallCount:'+ajaxCallCount);	
}

//========================= 로딩이미지 관련 코드 -end ===============================

/**
 * 	stopPropagation의 크로스브라우징 처리 (eHR)
 * 		- jQuery를 통해서 바인딩하지 않고 html태그에 inline으로 바인딩된 이벤트일 경우의 stopPropagation 대안
 * 	    - jQuery를 통해서 바인딩한 이벤트인 경우에는 그냥 jQueryEvent객체.stopPropagation()을 호출하면 된다. 
 */
function foStopPropagation(e){
	//예제코드에는 인수로 넘어온 event객체가 없을 경우 window.event로 대체하는 fallback 처리가 있었으나, 
	//어차피 window.event는 IE7이하에서만 동작하므로, 인수로 넘어온 객체가 없을 경우 그냥 리턴 처리하였다.
	if(!e){ return; }
	e.cancelBubble = true;
	if (e.stopPropagation){ e.stopPropagation(); }
}


/**
 * 	라디오버튼의 필수값 유효성검사
 * 		- 라디오버튼은 여러개가 하나의 name으로 묶이므로 순차적인 validation을 할 수 없어서 별도 처리한다.
 * 		- 라디오버튼의 name과 title을 인수로 받는다.
 * 		- true: 체크된 것이 존재 / false: 체크된 것이 존재하지 않음.
 */
function validateRadioRequired(radioName, radioTitle){
	var $radios = $(':radio[name='+ radioName +']'); 
	var $chkRadio = $radios.filter(':checked');  
	if($chkRadio.val() === undefined){ 
		showMessage('MSG_COM_VAL_001', radioTitle);
		$radios.eq(0).focus(); //첫번째 radio에 focus
		return false; 
	}
	return true;
}


/**
 * 	Calendar 버튼 숨기기 / 보이기 (Show/Hide 구분에 따라 버튼 이미지 변경 (eHR)) 
 */
function foShowHideCalendar($objTd, yn_show) {

	 $objTd.find('.ui-datepicker-trigger').each(function(idx){

		var $imgObj = $(this);
		
		if(yn_show == true) {
			$imgObj.show();
		}else {
			$imgObj.hide();
		}      
	 });
}


/**
 * 	Calendar 버튼 Enable/Disable 처리(Enable 여부에 따라 버튼 이미지 변경 (eHR)) 
 */
function foEnableCalendarImg($objTd, yn_enable) {

	 $objTd.find('.ui-datepicker-trigger').each(function(idx){

		var $imgObj = $(this);
		
		if(yn_enable == true) {
			$imgObj.attr('src', CONST.KFR_IMG_PATH_CAL);
			$imgObj.attr('disabled', false);
			$imgObj.css('cursor', 'pointer');
		}else {
			$imgObj.attr('src', CONST.IMG_PATH_CAL_DIS);
			$imgObj.attr('disabled', true);
			$imgObj.css('cursor', 'default');
		}      
	 });
}


/**
 * 	그리드 Calendar 버튼 Enable/Disable 처리(Enable 여부에 따라 버튼 이미지 변경 (eHR)) 
 */
function foGridEnableCalendarImg($objTd, yn_enable) {

	 $objTd.find('img').each(function(idx){

		var $imgObj = $(this);
		
		if(yn_enable == true) {
			$imgObj.attr('src', CONST.KFR_IMG_PATH_CAL);
			$imgObj.attr('disabled', false);
			$imgObj.css('cursor', 'pointer');
		}else {
			$imgObj.attr('src', CONST.IMG_PATH_CAL_DIS);
			$imgObj.attr('disabled', true);
			$imgObj.css('cursor', 'default');
		}      
	 });
}


/**
 * 	현재 브라우저 정보를 리턴한다. (eHR)
 */
function getBrowser(){

	var agent = navigator.userAgent.toUpperCase();
	if(agent.indexOf('MSIE') >= 0){
		if(agent.indexOf('MSIE 7.0') >= 0){
			return 'IE_7';
		}else if(agent.indexOf('MSIE 8.0') >= 0){
			return 'IE_8';
		}else if(agent.indexOf('MSIE 9.0') >= 0){
			return 'IE_9';
		}else{
			return 'IE'; //기타 버전
		} 
	}else if(agent.indexOf('FIREFOX') >= 0){
		return 'FIREFOX';
	//크롬과 사파리는 같이 웹킷을 사용하기 때문에 크롬을 찾는 구문이 위에 있어야 한다.	
	}else if(agent.indexOf('CHROME') >= 0){
		return 'CHROME';
	}else if(agent.indexOf('SAFARI') >= 0){
		return 'SAFARI';
	}else if(agent.indexOf('OPERA') >= 0){
		return 'OPERA';
	}
}


/**
 * 	최상위 윈도우가 다른 도메인에 존재할 경우 window.top 프로퍼티를 사용하면 접근에러가 발생하므로,
 *	다른 방식으로 topmost window 객체를 리턴하기 위해 만든 함수. (eHR)
 */
function getFOTopWin(o){
	dc('call getFOTopWin('+o+')');

	var p = o.parent;
	
	//재귀호출을 멈추는 조건 1 - (parent == self)
	if(p === o){
		dc('@ parent가 self와 같으므로 재귀호출 종료 > return window name: '+o.name);
		return o;

	}else{
		
		//재귀호출을 멈추는 조건 2 - 현재 레벨의 parent가 다른 도메인 소속일 경우
		if(isInaccessibleWin(p)){
			dc('@ parent가 다른 도메인 소속이므로 재귀호출 종료');
			return o;
		}
		
		//재귀호출
		return getFOTopWin(p);
	}	
	
}


/**
 *	접근할 수 없는 윈도우 객체일 경우 true를 리턴한다. (eHR)
 *
 *		자바스크립트에서는 다른 도메인의 window객체의 프로퍼티에 접근하는 것을 원칙적으로 금하고 있다.
 *		parent나 opener를 참조하려 할 때 parent나 opener가 다른 도메인의 소속일 경우 이런 상황을 만날 수 있는데,
 *		이럴 때 스크립트 에러로 인해 페이지가 멈추는 것을 막기 위해, 일부러 에러를 발생시킨 후 try~catch로 감싸주어
 *		접근 가능여부를 판별해서, 타 도메인 문서의 참조 가능성을 미연에 방지하도록 처리했다.
 *		타 도메인 윈도우의 프로퍼티를 참조하는 것은 대부분의 브라우저에서는 에러로 처리하지만,
 *		유독 webkit 계열에서는 에러로 처리되지 않는다. 그러므로 좀 더 확실한 에러발생 조건을 만들기 위해서 getElementById를 사용하였다.
 *
 *	@param w window객체
 */
function isInaccessibleWin(w){
	try{
		w.document.getElementById('');
	}catch(e){
		dc('@ window 프로퍼티 접근 불가 - 다른 도메인의 parent나 opener를 참조했을 수 있음');
		return true; //접근 불가
	}
	return false;
}


/**
* 	이미지 preload (캐싱)
*/
function imgPreload(imgPathArray) {
	$(imgPathArray).each(function(){
	  $('<img/>')[0].src = this;
	});
}


/**
 *  시작일이 종료일보다 클 경우 메세지와 함께 false를 리턴한다. 
 *	 정상인 경우에는 true를 리턴한다.
 *	@param fromDtId: 시작일 input의 element id
 *	@param toDtId: 종료일 input의 element id
 */
function isValidFromToDate(fromDtId, toDtId){
	var $fdt = $('#'+fromDtId);
	$tdt = $('#'+toDtId);
	fdt = delHyphens($.trim($fdt.val())), 
	tdt = delHyphens($.trim($tdt.val()));
	if(fdt > tdt){
		showMessage('MSG_COM_VAL_016');
		$tdt.focus().trigger();
		return false;
	}
	return true;
}


/**
 *   날짜형 INPUT DatePicker(Calendar) 설정 
 */
function setCommonDatePicker($dateObj){

	// DatePicker ( 월, 요일 ) 설정 정보 가져오기 
	var datePickerFormat = getDatePickerDefault(CONST.G_LANGUAGE);
	var date_type   = 'DAY';
	var date_format =  '';
    var year_range  = 'c-40:c+10'; // Range of years to display in drop-down
	
	// 일자 유형 Attribute  (월:MONTH, 일자:DAY)
	if( $dateObj.attr("dateType")  != undefined) {
		date_type =  $dateObj.attr("dateType").toUpperCase();
	}

	// 년도 범위 Attribute (2013-01-15 추가)
    // either relative to today's year (-nn:+nn), relative to currently displayed year
    // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n) 
	if( $dateObj.attr("yearRange")  != undefined) {
		year_range =  $dateObj.attr("yearRange");
	}
	
	// Date Format 설정  
	if(date_type == 'MONTH') {
		date_format = 'yy-mm';
		$dateObj.attr("maxlength", "7");      // 입력글자수 제한 
	}else {
		date_format = 'yy-mm-dd';
		$dateObj.attr("maxlength", "10");     // 입력글자수 제한 
	}
	
	$dateObj.datepicker(
	{	monthNamesShort: datePickerFormat.monthNamesShort,	
		dayNamesMin: datePickerFormat.DayNamesMin, 
		dateFormat: date_format, //형식(2012-03-03)
		yearRange:  year_range, 
		changeMonth: true, //월변경가능
	    changeYear: true, //년변경가능
		showMonthAfterYear: true,  //년 뒤에 월 표시
		showOn: "button",
		buttonText: '',	 //달력아이콘의 툴팁. obj.val()로 설정하면 가장 마지막 엘리먼트의 값만 반영되므로 그냥 없앴다.
		buttonImage: CONST.KFR_IMG_PATH_CAL,
		buttonImageOnly: true,
		onSelect: function () {   
			// 날짜 선택후 사용자  Function 호출
			if(typeof(customDatePickerSelect) !== "undefined" && $.isFunction(customDatePickerSelect)){
				customDatePickerSelect(this.id);
			}
			$dateObj.focus();
        }   				
	});
	
	// calendar input box 숫자만 입력할 수 있게 설정
	$dateObj.css("ime-mode","disabled");   // 한글입력불가 
	$dateObj.numeric( { allow:'"' + DATE_DELIMETER+ '"' } );  // 숫자만 입력(허용문자 => 날짜 구분자'-') 

	// input box focus시  value값 select 처리 
	$dateObj.focus(function() { 
		if(!($dateObj.prop("readonly")) ) {
			$dateObj.select();
		}
	});
	
	// calendar input box값 변셩시 validation 체크  처리 
	$dateObj.change(function() {
		// 입력 가능한 컬럼일 경우 만 validation 체크 
		if(!($dateObj.prop("readonly")) ) {
			
			if( $dateObj.val() == "" ) return; 

			date_type ='DAY';
			if( $dateObj.attr("dateType")  != undefined) {
				date_type =  $dateObj.attr("dateType").toUpperCase();
			}
			
			// 날짜 유효성 체크 및  년월을 제외한 일자만 입력할 경우 앞에 현재년월을 채워준다.
			var strYymmdd = "";
			if(date_type == 'MONTH') {
				strYymmdd = checkValidMonth( $dateObj.val() );
			 
			}else {
				strYymmdd = checkValidDate( $dateObj.val() );
			}
			$dateObj.val(strYymmdd);
			 
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
 * 	페이지 내의 폼 엘리먼트들에 관한 초기화 작업을 수행한다.
 */
function formElementInit(){
	
	// jQuery-UI 버튼 스타일 생성. 
	// 버튼에 대해서 사용자정의 스타일을 사용할 경우에는 이 행을 삭제한다.
	//$("button").button().css({'font-size':'12px', 'font-family':'굴림', 'padding':'0px'});

    // readonly 컬럼 tabindex 설정 
	$('input[readonly]').attr('tabindex','-1').keydown(function(e){
		if(e.keyCode == 8){
			e.preventDefault();
		}
	});
	
	// 숫자형 입력 설정 
	$('.number')
	.each(function() {
		// 숫자형 입력시 허용할 문자 설정  -> 소숫점 자리가 있을 경우 "." 입력허용 설정
		if( $(this).attr("dec")  == undefined || $(this).attr("dec") == "0" ) {
			if($(this).attr("mask"))  {
				$(this).numeric( { allow:"-" });
			}else {
				$(this).numeric();
			}
		}else {
			$(this).numeric( { allow:"-,." } ); 
		}
	})
	// input box focus시  value값 select 처리 
	.focus(function() {  
		if(!($(this).prop("readonly")) && $(this).attr("mask")) {
			$(this).val(removeChar($(this).val(), ','));
			$(this).select();
		}
	})
	// number 입력시 mask처리 
	.blur(function() {
		if(!($(this).prop("readonly")) ) {
			if(isNaN($(this).val())) {
				showMessage("MSG_COM_VAL_038"); //숫자만 입력
				$(this).val("");
				$(this).focus();
				return;
			}

			if( $(this).attr("mask")) {
				if( $(this).attr("dec")  == undefined) { 
					formatNoObj(this, 0);
				}else {
	
					// 소숫점부분을 제외한 정수부분의 자릿수 제한 체크한다. 
					if($(this).attr("maxlength") != undefined && $(this).attr("maxlength") != "") {
						var nMaxLength = parseInt( $(this).attr("maxlength") );
						var arrNoStr = $(this).val().split('.'); 
						// 정부 최대 입력가능 자릿수 보다 클 경우 오류 처리
						if(removeChar(arrNoStr[0], "-").length >  nMaxLength - parseInt($(this).attr("dec")) ) {
							showMessage("MSG_COM_VAL_041"); // 최대 입력 자릿수 초과 
							$(this).val("0");
							$(this).focus();
							return;
						}
					}
					
					formatNoObj(this, $(this).attr("dec"));
				}
				
			}
		}
	});

	// calendar DatePicker 설정 
	$('.calendar').each(function() {
		var $dateObj = $(this);
		// 날짜형 Input calendar DatePicker 설정  
		setCommonDatePicker($dateObj);
	});
			
	// input에서 엔터키 입력시, 해당 input에 걸려있는 onchange이벤트의 이벤트핸들러를 호출하도록 엔터키의 onkeydown이벤트를 바인딩하도록 처리함.
	// 원래 onchange이벤트르 직접적으로 trigger하려고 했었으나, 두 번 호출되는 문제가 있어서, 대안으로 포커스를 이동함으로써 간접적으로 
	// onchange이벤트를 trigger하는 것으로 처리하였다. 각 페이지에서 "enterexe"라는 class를 각 input에 등록함으로써 적용 가능하다. 
	$('.enterexe').bind({
		keydown: function(e){
			if(e.keyCode === 13){
				e.preventDefault();
 				var $i = $(this),
					$ni = $i.nextAll('input:not(:hidden):eq(0)'), //next input
					$di; //dummy input	
 				//이후 input이 존재하지않을 경우 임시 생성 (td로 나뉜 테이블의 경우 거의 없을 것이다.)
				if($ni.length === 0){
					$di = $('<input/>');
					$di.css({width:'1px'}); //최대한 눈에 띄지 않도록 크기를 작게 조정 (display:none일 경우 포커스를 이동할 수 없다.)
					$di.insertAfter($i);
					$ni = $di;	
				}
				$ni.focus();
 				$i.focus();
 				if($di != null && $di.length > 0){
 					$di.remove(); //임시생성 input 삭제
 				}
			}
		}	
	});	

	//IE8에서 <button/> 태그 클릭시 자동 submit 되는 현상이 있어서
	//모든 form의 onsubmit 이벤트를 일단 막도록 처리한다. (eHR)
	$('form').submit(function(e){
		e.preventDefault();
	});	
}


/**
 * jQuery object를 리턴한다. (FO2a)
 * @param o - string일 경우: id로 찾고 name으로 찾는다. / object일 경우: 한 번 랩핑해서 리턴한다.
 */
function jo(o){
	var $t, to = typeof(o);
	if( ! o){ return null; }
	if(to === 'string'){
		$t = $('#'+o);
		if($t.length === 0){
			$t = $('*[name='+o+']');
		}
	}else if(to === 'object' && !$.isFunction(o)){
		$t = $(o);
	}
	if($t.length === 0){
		return null;
	}
	return $t; 
}


/**
 *	JSON.stringify()를 wrapping한 함수 (FO2a) 
 * @param o 
 */
function sf(o){
	return (o && typeof(o) === 'object') ? JSON.stringify(o) : '';
}


/**
 *	인수 문자열이 빈 값일 경우 true, 아니면 false를 리턴한다. (FO2a)
 */
function isBlank(str){
	return str ? ( $.trim(str).length > 0 ? false : true ) : true;
}


/**
 *	인수 문자열이 빈 값일 경우 false, 아니면 true를 리턴한다. (FO2a)
 */
function isNotBlank(str){
	return ! isBlank(str);
}


/**
 * 엘리먼트의 value가 빈 값이면 true, 아니면 false를 리턴한다. (FO2a)
 * @param o - jo() 참고 
 */
function isBlankField(o){
	var $t = jo(o);
	if($t == null){ return true; }
	return isBlank($t.val());
}


/**
 *	엘리먼트의 value가 빈 값이면 true, 아니면 false를 리턴한다.  (FO2a)
 */
function isNotBlankField(o){
	return ! isBlankField(o); 
}


/**
 * 엘리먼트 value의 문자열 길이가 len 보다 작으면 true, 아니면 false를 리턴한다. (FO2a)
 * @param o - jo() 참고
 * @param len - 제한하고자 하는 문자열의 최소 길이
 * @param noAlert - true일 경우 메세지 alert이 호출되지 않는다. 
 */
function isShorter(o, len, noAlert){
	var $t = jo(o), s, ret;
	if($t == null){ return false; }
	ret = $.trim($t.val()).length < len ? true : false;
	if( ! noAlert && ret){
		showMessage('MSG_COM_VAL_042', String(len)); //len 글자 이상 입력해 주십시오.
	}
	return ret;
}


/**
 *  DatePicker ( 월, 요일 ) 설정 정보 (FO1) 
 */
function getDatePickerDefault(language) {
    // calendar Default UI Setting 
    // 달력(datepicker) 설정 
    var strmonthNamesShort = "";
    var strDayNamesMin     = "";
    if(language == "ko"){
        strmonthNamesShort = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
        strDayNamesMin     = ['일','월','화','수','목','금','토']; 
    }else {
        strmonthNamesShort = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        strDayNamesMin     = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    }
    var ret = { monthNamesShort:strmonthNamesShort,  DayNamesMin:strDayNamesMin };
    return ret;
}


/**
 * 필요한 경우 image preloading 수행
 */
imgPreload([ CONST.IMG_PATH_LOADER ]);


/**
 * 	DOMContentLoaded
 */
$(function(){
	
	formElementInit(); 
	
});
/**
 * 
 * @param id 테이블 혹은 div 아이디
 * @param isTop TOP 프레임여부, true : viewTop 프레임 컨텐츠, false : viewHome 프레임안의 컨텐츠
 */
 //jQuery throttle
var delay1 = 600; 	
var $window1 = $(window);
/*
 * 화면 리사이즈 함수
 */
function viewResizeEvent(className, isTop){
	var objWrapper = $("." + className);
	if(objWrapper.length > 0){
		if(isTop){
			setTimeout(function(){ resizeTOPHorizontal(objWrapper); }, 0); 
			setTimeout(function(){ resizeTOPHorizontal(objWrapper); }, ((delay1/3)*2));
			
			$window1.resize($.throttle(delay1, function(){
				setTimeout(function(){ resizeTOPHorizontal(objWrapper); }, 0); 
				setTimeout(function(){ resizeTOPHorizontal(objWrapper); }, ((delay1/3)*2));
			}));
		}else{
			setTimeout(function(){ resizeTableHorizontal(objWrapper); }, 0); 
			setTimeout(function(){ resizeTableHorizontal(objWrapper); }, ((delay1/3)*2));
			
		    $window1.resize($.throttle(delay1, function(){
		    	setTimeout(function(){ resizeTableHorizontal(objWrapper); }, 0); 
				setTimeout(function(){ resizeTableHorizontal(objWrapper); }, ((delay1/3)*2));
		    	
			}));
		}
	}	
}
/*
 * 테이블을 수직으로 리사이즈 시킴
 */
function resizeTOPHorizontal(table){
	var resizeWidth = $(window).width();
	if(resizeWidth > 1024){
		table.width(resizeWidth);
	}
}
/*
 * 테이블을 수평으로 리사이즈 시킴
 */
function resizeTableHorizontal(table){
	var resizeWidth = $('body').width();
   	if(resizeWidth > 830){
   		table.width(resizeWidth);
	}
   	if(table.id =="wrapperAll"){
    	var resizeHeight = $('body').height();
    	if(resizeHeight > 463){
    		table.height(resizeHeight);
    	}			    	
    }
}


/**
 * 	closeAllPopupAndGetFirstOpener()에서 재귀적으로 opener를 찾아가면서 현재 레벨의 popup들을 close할 경우,
 * 	이후 명령이 실행되지 않는다던지, 아니면 chrome에서 스크립트 오류로 페이지가 멈춘다던지 하는 문제가 있었다.
 * 	그래서 재귀호출시 window를 바로 종료하지 않고, 전역변수 배열에 window의 레퍼런스를 저장하여, 
 * goSessionExpiredPage()가 호출 완료된 이후에 일괄적으로 window.close() 처리를 하도록 설계하였다.
 */
var winToCloseArr = [];
	
/**
 * 	현재 window에서 계속 opener를 찾아 내려가면서 팝업의 참조를 winToCloseArr에 담고,
 * 최초의 부모페이지(opener)의 참조를 리턴한다.
 * 인수는 반드시 각 위상의 topmost window여야 한다.
 */
function closeAllPopupAndGetFirstOpener(o){
	
	dc('closeAllPopupAndGetFirstOpener() > '+o.name);
	var op = o.opener;
	
	//재귀호출을 멈추는 조건 - 더 이상 opener가 없을 경우
	if(! op){
		dc('@@ opener가 존재하지 않음');
		return o;
		
	//재귀호출을 하는 조건 - opener가 존재
	}else{
		
		//opener가 존재하더라도, 크로스도메인 상황일 경우에는 재귀호출을 멈춘다.
		if(isInaccessibleWin(op)){
			dc('@ opener가 다른 도메인 소속이므로 재귀호출 종료');
			return o;
		}		
		
//		o.close(); //현재 위상의 팝업 닫기 - 이렇게 할 경우 예상치 못한 문제가 생긴다.
		winToCloseArr.push(o); //배열에 담았다가 나중에 일괄 close() 처리를 한다.
		
		return closeAllPopupAndGetFirstOpener(getFOTopWin(op)); //재귀호출
	}
}


/**
 * 세션 만료시 페이지 이동
 * 팝업일경우에 팝업창을 닫고 부모창을 이동 시킴
 * 		- 현재 window에서 계속 opener를 찾아 내려가면서 팝업을 닫고, 
 * 		- 최초의 부모페이지를 세션만료 페이지로 이동시킨다.	
 */
function goSessionExpiredPage(opts){
	dc('============== goSessionExpiredPage() - start ===============');

	if( ! opts){ opts = {}; }
	
	//FrameOne 도메인 내의 window들 중, 최상위 opener를 fo 라고 하자 (ex: viewMain.jsp), 만약 opener가 없으면 자기 자신을 반환할 것이다.
	var fo = closeAllPopupAndGetFirstOpener(getFOTopWin(window));
	var tw = getFOTopWin(fo); //fo를 기준으로 재귀적으로 찾은 topmost window
	
	//만약 세션이 만료된 후에 로그인이 필요한 명령을 수행했을 경우, 
	//3번의 page request가 발생(top, left ,main 페이지 호출)하여 goSessionExpiredPage()도 3회가 호출되는 문제가 있다. 
	//어차피 세션만료 이후에 할 수 있는 작업은 거의 없으므로, (로그인 페이지로 이동하거나, 윈도우 닫기) 
	//연속적인 세션만료 응답 중 최초 세션만료 요청 발생시에, 존재기간이 짧은 쿠키를 하나 생성하여, 
	//해당 쿠키가 존재하는 시간 동안에는 goSessionExpiredPage()의 호출을 하지 않도록 설정하자.
	if($.cookie('FO_SESSION_EXPIRED') === 'Y'){
		dc('@ 이미 세션만료된 상태에서 다시 goSessionExpiredPage() 호출함.');
		return;
	}else{
		
		//최초 goSessionExpiredPage() 호출 이후 expireSecond 만큼 goSessionExpiredPage()의 호출을 SKIP한다.
	   var expireSecond = 5;    	
	   var date = new Date();
	   date.setTime(date.getTime()+(expireSecond*1000));
	   var expires = "; expires="+date.toGMTString();
	   document.cookie = "FO_SESSION_EXPIRED=Y"+ expires +"; path=/";
	}
	
	//alert을 띄워도 되는 상황인지 판단하여 에러메시지 alert을 띄운다.
	if(opts.alert){
		showMessage('MSG_COM_CFM_010');
	}
	
	var expUrl = getSessionExpiredReturnUrl(); //세션만료 후 이동 페이지 (ex: 로그인)
	
	//fo의 opener가 존재할 경우
	var foo = fo.opener;
	if(foo){
		dc('@ fo의 opener가 존재할 경우');
		
		if(isInaccessibleWin(foo)){
			dc('@ 접근할 수 없는(다른 도메인의) opener임, 현재 창을 닫음');
			fo.close();
			
		}else{
			dc('@ 접근할 수 있는(같은 도메인의) opener임: '+foo.name);
			//실제로 이 경우로 들어올 일은 없음, 왜냐하면 closeAllPopupAndGetFirstOpener()에서 이미 한 단계 거르기 때문에 
			
		}
		
	//fo의 opener가 존재하지 않을 경우	
	}else{
		
		var fop = fo.parent; //fo의 parent
		
		//fo의 parent가 존재할 경우
		if(fo != fop){
			dc('@ fo의 parent가 존재함.');
			
			if(isInaccessibleWin(fop)){
				dc('@ 접근할 수 없는(다른 도메인의) parent임');
				
				//같은 도메인의 topmost window의 name이 "FO_VIEWMAIN" (프레임셋 페이지(viewMain.jsp)에 정의)일 경우에만 세션만료 페이지로 이동함.
				//이 케이스는 eHR의 포켓가이드 (CJWorld에 eHR이 Iframe으로 삽입) 때문에 발생하였음.
				if(tw.name === 'FO_VIEWMAIN'){
					dc('@ FrameOne의 메인화면(프레임셋)을 통째로 삽입한 케이스이므로, 세션만료 페이지로 전환');
					tw.location.href = expUrl;
				
				//그 외의 경우 (ex: 포켓가이드)
				}else{
					dc('@ 별다른 액션을 취하지 않는다.');
					//별다른 액션을 취하지 않는다.
				}
				
			}else{
				dc('@ 접근할 수 있는 (같은 도메인의) parent임: '+fop.name+', topmost window를 세션만료 페이지로 전환');
				tw.location.href = expUrl;
			}
			
		//fo의 parent가 존재하지 않을 경우	
		}else{
			dc('@ parent가 존재하지 않음. 현재 창을 세션만료 페이지로 전환');
			fo.location.href = expUrl;
			
		}
		
	}

	//-------- 종료해야 했던 팝업윈도우들을 일괄 close() - start ---------
	for(var i=0; i<winToCloseArr.length; i++){
		dc('winToCloseArr['+i+']: '+winToCloseArr[i]);
		winToCloseArr[i].close();
	}
	winToCloseArr = [];
	//-------- 종료해야 했던 팝업윈도우들을 일괄 close() - end ----------
	
	//kfr 팝업창 닫기
	if(parent.popupArrayClose){
		parent.popupArrayClose();
	}
	if(opener != null){
		var top_op = null;
		var op = opener;
		
		while(true){
			if(op.opener != null){
				op = op.opener;
			}else{
				top_op = op;
				break;
			}
		}
		
		self.close();
		top_op.top.parent.popupArrayClose();
	}
	
	dc('============== goSessionExpiredPage() - end ================');
}


/**
 * 	세션 만료시 포워딩해야 할 페이지의 url 리턴
 */
function getSessionExpiredReturnUrl(){
	var  url = "/common/login.fo"; //로그인 페이지
	return CONST.CONTEXT_PATH + url;
}


///////////////////////////////////////////////////////   jQuery 확장 - start   //////////////////////////////////////////////////////////////
(function ($) {
	
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