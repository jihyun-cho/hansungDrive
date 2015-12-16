<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" 			uri="http://java.sun.com/jstl/core_rt"         %>	
<%@ taglib prefix="fn"			uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt"			uri="http://java.sun.com/jsp/jstl/fmt"        %>
<%
String contextPath = "";
if( request.getContextPath().endsWith("/") == false ){
	contextPath = request.getContextPath();
}
com.skp.tms.common.base.CommonVar._CONTEXT_PATH = contextPath;
%>
<c:set var="_CONTEXT_PATH" value="<%=com.skp.tms.common.base.CommonVar._CONTEXT_PATH%>" />
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>

<title>SKT TMS솔루션</title>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
  
   
<script type="text/javascript">
   	<%-- #################################################################
   			전역 변수 zone
   	################################################################# --%>
   	var _CONTEXT_PATH = "${_CONTEXT_PATH}";
   	var CONST = {
   		CONTEXT_PATH: "${_CONTEXT_PATH}",
   		IMG_PATH_SRCH: '${_CONTEXT_PATH}/images/button/btn_search.gif', 
   		IMG_PATH_SRCH_GRID: '${_CONTEXT_PATH}/images/button/btn_search.gif', 
   		IMG_PATH_SRCH_GRID_DIS: '${_CONTEXT_PATH}/images/button/btn_search_dis.gif', 
   		IMG_PATH_CAL: '${_CONTEXT_PATH}/images/button/calendar.gif', 
   		IMG_PATH_CAL_DIS: '${_CONTEXT_PATH}/images/button/calendar_dis.gif', 
   		IMG_PATH_LOADER: '${_CONTEXT_PATH}/images/ajax-loader.gif', 
   		G_LANGUAGE: '', 	
   		KFR_IMG_PATH_CAL: '${_CONTEXT_PATH}/asset/images/sys/btn_gray_calendar.png',
   		KCU_IMG_PATH_SRCH_GRID: '${_CONTEXT_PATH}/asset/images/sys/searchButton.png' 
   	};
</script>
    
<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/common/json2.js" charset="utf-8"></script>
   
<%-- ## 시작 - import 순서가 꼬이면 안됨 ####################################################################################### --%>
<!-- 
<link rel="stylesheet" type="text/css" href="http://trirand.com/blog/jqgrid/themes/redmond/jquery-ui-custom.css" />  
<link rel="stylesheet" type="text/css" href="http://trirand.com/blog/jqgrid/themes/ui.jqgrid.css" /> 
<link rel="stylesheet" type="text/css" href="http://trirand.com/blog/jqgrid/themes/ui.multiselect.css" /> 
   
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="http://trirand.com/blog/jqgrid/js/jquery.jqGrid.js"></script>
<script type="text/javascript" src="http://trirand.com/blog/jqgrid/js/i18n/grid.locale-en.js"></script>
-->
<link rel="stylesheet" type="text/css" href="${_CONTEXT_PATH}/jqGrid/themes/redmond/jquery-ui.css" /> 
<link rel="stylesheet" type="text/css" href="${_CONTEXT_PATH}/jqGrid/css/ui.jqgrid.css" /> 
<link rel="stylesheet" type="text/css" href="${_CONTEXT_PATH}/jqGrid/css/ui.multiselect.css" /> 
   
<script type='text/javascript' src="${_CONTEXT_PATH}/js/jquery/jquery-1.11.0.min.js"></script>
<script type='text/javascript' src="${_CONTEXT_PATH}/jqGrid/js/jquery.jqGrid.custom.js"></script>
<script type='text/javascript' src="${_CONTEXT_PATH}/jqGrid/js/i18n/grid.locale-kr.js"></script>

<script type='text/javascript' src="${_CONTEXT_PATH}/jqGrid/js/jquery.custExtend.js"></script>
<%-- ## 종료 - import 순서가 꼬이면 안됨 ####################################################################################### --%>

<link  rel="stylesheet" href="${_CONTEXT_PATH}/css/daterpicker/jquery-ui-daterangepicker.css" />
<link  rel="stylesheet" href="${_CONTEXT_PATH}/asset/css/sys/layout.css" />

<script src="${_CONTEXT_PATH}/js/jquery/daterpicker/jquery-ui-1.10.3.custom.min.js"></script>
<script src="${_CONTEXT_PATH}/js/jquery/daterpicker/daterangepicker.jQuery.js"></script>
<script src="${_CONTEXT_PATH}/js/jquery/daterpicker/jquery.ui.datepicker-ko.js"></script>


<style>
	.ui-jqgrid tr.jqgrow td {vertical-align:middle !important}
	html, body { margin:0 }
	#bcWrapTable { display:none }

	/** 그리드 내 센터정렬이 아닌 colModel 의 패딩 재정의 */
   .ui-jqgrid tr.jqgrow td.colLeft {padding-left: 5px;}
   .ui-jqgrid tr.jqgrow td.colRight {padding-right: 5px;}
</style>

<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/common.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/browser.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/collection.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/download.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/string.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/validate.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/js/common/util/base64.js"></script>

<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/jquery/plugins/jquery.cookie.js" charset="utf-8"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/jquery/plugins/jquery.alphanumeric.pack.js" charset="utf-8"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/jquery/plugins/jquery.blockUI.js"></script>
<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/jquery/plugins/jquery.ba-throttle-debounce.min.js" charset="utf-8"></script>

<%-- <script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/tms-common.js" charset="utf-8"></script> <!-- 운송 공통 자바스크립트 --> --%>

<script type="text/javascript" src="${_CONTEXT_PATH}/asset/js/sys/common.js" charset="utf-8"></script>	