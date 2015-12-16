/** #####################################################################################
 * js 공통함수 관리
 #####################################################################################*/


/**
 * ie 호환 디버그 
 */
function log(arg){
	if(typeof console != 'undefined'){
		console.log(arg);				
	} 
}


/**
 * <pre>
 * script tag 생성
 * </pre> 
 */
function addJavascript(jsname) {
	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);
}

/**
 * <pre>
 * 로딩바 생성
 * </pre> 
 */
function addLoadingBar() {
	 var $bar = $('<div></div>');
	 $bar.attr('id', "loading");
	 $bar.appendTo('body');
}



