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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="TMS">
    <meta name="author" content="cozyhyun">

    <title>TMS</title>

</head>

<body>

	<div class="error" style="font-size:smaller; position:absolute; width:600px; height:200px; top:50%; left:50%; margin-left:-300px; margin-top:-100px;">
		<img alt="에러 페이지" src="<%=com.skp.tms.common.base.CommonVar._CONTEXT_PATH%>/images/error.jpg" style="border:0px;" />
	</div>

	

</body>
</html>