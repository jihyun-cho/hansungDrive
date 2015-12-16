/**
 * <pre>
 * 동적 form 생성  
 * for 엑셀 다운로드 
 * </pre>
 */
jQuery.download = function(url, data, method){
	if( url ){ 
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'"></form>')
		.appendTo('body').submit().remove();
	};
};
