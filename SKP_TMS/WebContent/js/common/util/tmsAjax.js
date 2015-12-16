/**로그아웃 URL*/
var _COMMON_LOGOUT_PAGE = "/tms";	
/**ajax 멱등제어*/
var _LOADING_CNT = 0;



/**
 * <pre>
 * jquery아작스 공통모듈
 * </pre>
 */


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
 * 공통 ajax 모듈
 * @author 유경민k , 김응기c , 조지현j
 */
$(function() {
	jQuery(function($) {
		// ajax 호출 함수
		$.fn.tmsAjax = function(params, callMethod) {
			var targetID = $(this);
			var callbacks = $.Callbacks();
			//var callFunction = callMethod;

			var param = $.extend({
				url : null,
				data : {}
			}, params || {});

			loading_st();
			
			$.ajax({
				async : true,
				type : "post",
				url : param.url,
				cache : false,
				dataType : "json",
				data : param.data,
				success : function(data, status) {
					callbacks.add(callMethod);
					callbacks.fire(targetID, data);
					loading_ed();
				},
				error : function(data, status, errorThrown) {
					loading_ed();
					if (data.responseText.indexOf('sessionTimeOutCheck') != -1 ) sesChk();

				}
			});
		};
	});
});

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
