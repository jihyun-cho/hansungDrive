<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String contextPath = "";
if( request.getContextPath().endsWith("/") == false ){
	contextPath = request.getContextPath();
}
com.skp.tms.common.base.CommonVar._CONTEXT_PATH = contextPath;
%>
 오늘 날짜는 : ${today}
 
