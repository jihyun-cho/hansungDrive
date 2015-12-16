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
 * <pre>
 * ie9호환성toLowerCase 오류 해결 함수1
 * ie의 버전을 구한다.
 * </pre>
 */
function getInternetExplorerVersion() {
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

/**
 * <pre>
 * ie9호환성toLowerCase 오류 해결 함수2
 * ie 버전별 참조여부를 설정
 * </pre>
 */
function setSrcForIE() {
	var ver = getInternetExplorerVersion();
	if (ver > -1) {
		if (ver < 10 & ver >= 8.0) {
			addJavascript('http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE8.js');
		}
	}
}

setSrcForIE();
