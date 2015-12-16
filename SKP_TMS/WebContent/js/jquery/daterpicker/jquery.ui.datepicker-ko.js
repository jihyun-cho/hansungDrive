/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */



/**-------------------------------------------------------------------------------------
 * 달력 라이브러리 한글화 시작  -  조지현J
   -------------------------------------------------------------------------------------*/
jQuery(function($) {
	$.datepicker.regional['ko'] = {
		closeText : '닫기',
		prevText : '이전달',
		nextText : '다음달',
		currentText : '오늘',
		monthNames : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월','10월', '11월', '12월' ],
		monthNamesShort : [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월','9월', '10월', '11월', '12월' ],
		dayNames : [ '일', '월', '화', '수', '목', '금', '토' ],
		dayNamesShort : [ '일', '월', '화', '수', '목', '금', '토' ],
		dayNamesMin : [ '일', '월', '화', '수', '목', '금', '토' ],
		weekHeader : 'Wk',
		dateFormat : 'yy-mm-dd',
		firstDay : 0,
		isRTL : false,
		duration : 200,
		// yearSuffix: '년',
		// yearRange: 'c-100:c+10', // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를
		// 표시할것인가.
		showAnim: "slide", //애니메이션을 적용한다.
		showMonthAfterYear : true, /* 년도를 월보다 앞에 표시 */
		changeYear : true, /* 연도 수정 가능 */
		changeMonth : true, /* 월 수정 가능 */
		 showOn: "button", /* focus/button/both 달력에 나타나는 이벤트 */
		 buttonImage: "/images/btn_calendar.gif", //버튼 이미지 
		 buttonImageOnly: true, //버튼 이미지를 사용할 경우 이미지만 표시 유무 
		 buttonText:'선택', //버튼 title 
		 showOtherMonths : true, /* 이전/다음달의 여분 날짜 보이기 */
		 selectOtherMonths : true	/* 이전/다음달의 여부 날짜 선택 유무 */
	};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
/**-------------------------------------------------------------------------------------
 * 달력 라이브러리 한글화 종료  -  조지현J
   -------------------------------------------------------------------------------------*/
	
	
/**-------------------------------------------------------------------------------------
 * 달력 라이브러리 함수화 시작  -  조지현J
   -------------------------------------------------------------------------------------*/
	var datepicker_default = {	
	};
	
	datepicker_default.dateFormat = "yy-mm-dd";
	datepicker_default.onClose = function(dateText, inst) {
		var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
		var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
		$(this).datepicker("option", "defaultDate", new Date(year, month, 1));
		$(this).datepicker('setDate', new Date(year, month, 1));
	};
	
	datepicker_default.beforeShow = function() {
		if ($(this).val() != '') {
			var selectDate = $(this).val().split("-");
			var year = Number(selectDate[0]);
			var month = Number(selectDate[1]) - 1;
			$(this).datepicker("option", "defaultDate",
			new Date(year, month, 1));
		} else {
			
		}
	};
	
	var datepicker_default2 = {	
	};

	datepicker_default2.dateFormat = "yy-mm-dd";
	datepicker_default2.onClose = function(dateText, inst) {
		var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
		var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
		$(this).datepicker("option", "defaultDate", new Date(year, month, 1));
		$(this).datepicker('setDate', new Date(year, month, 1));
	};

	datepicker_default2.beforeShow = function() {
		var anyDt = $(this);
		if (anyDt.val() != '') {
			var selectDate = anyDt.val().split("-");
			var year = Number(selectDate[0]);
			var month = Number(selectDate[1]) - 1;
			$(this).datepicker("option", "defaultDate",new Date(year, month, 1));
		} else {
			alert('날짜 형식에 위배 : yyyy-mm-dd');
		}
	};
});
/**-------------------------------------------------------------------------------------
 * 달력 라이브러리 함수화 종료  -  조지현J
   -------------------------------------------------------------------------------------*/
