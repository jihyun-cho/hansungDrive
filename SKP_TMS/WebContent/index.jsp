<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String contextPath = "";
if( request.getContextPath().endsWith("/") == false ){
	contextPath = request.getContextPath();
}
com.skp.tms.common.base.CommonVar._CONTEXT_PATH = contextPath;
%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="refresh" content="1;url=<%=com.skp.tms.common.base.CommonVar._CONTEXT_PATH%>/sample/today">
    <meta name="description" content="TMS">
    <meta name="author" content="cozyhyun">
    <title>TMS</title>
</head>
<body>
</body>
</html>