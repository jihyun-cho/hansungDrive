<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
	
</head>
<body>
<script type="text/javascript">

	var msgCode = "";
	var msg = "";
	if(msgCode !=""){
		alert(msg);
	}
	
	$(function(){ 
		//viewResizeEvent("wrapper", false);
	});

	//모든 팝업을 넣는 변수
	var popupArray = new Array(); //전역 팝업 배열
	
	//전체 팝업 닫기
	function popupArrayClose(){
		for(var i=0;i<popupArray.length;i++){
			popupArray[i].close();
		}
	}

</script>
<div id="wrap">
	<!-- header -->
	<div id="header">

 		<h1><!--  <a href="/tms/common/main"><img src="/tms/asset/images/sys/header_ci.gif" alt="TMS 솔루션" /></a>--></h1>
		<!-- gnb -->
		<div id="gnb">
			<ul>
				<li>	
					<h2>배차관리</h2>
					<ul class="snb">
						<li><a href="/tms/tms01">배차의뢰 관리</a></li>
					</ul>
				</li>
				<!-- 
				<li>	
					<h2>게시물관리</h2>
					<ul class="snb">
						<li><a href="/notice/noticeList.fo">공지사항</a></li>
						<li><a href="/qna/inquiryList.fo">의견/문의 조회</a></li>
						<li><a href="/application/management.fo">가입신청서 관리</a></li>
					</ul>
				</li>
				-->
			</ul>
		</div>

		<div class="account">
			<strong>관리자 - 쪼지현(98001309) / 연구개발부)개발1팀</strong>
			<a target="_top" href="javascript:logout();">로그아웃</a>
		</div>
	</div>
	<div id="container">
		<ul>
			<li><a href="#tabs-0">메인</a></li>
		</ul>
		<div id="content">
			<!-- 메인 -->
			<div id="tabs-0">
				<!--  
				<div style="margin:80px 0 5px; height:350px; text-align:center; background:#f0f1f2;"><img src="/tms/asset/images/sys/main.jpg" alt="" /></div>
				<div style="margin-bottom:80px; font-family:dotum; font-size:11px; text-align:center;">Copyright ⓒ 2013 CJ Korea Express Coporation. All rights reserved.</div>
				-->
			</div>
		</div>
	</div>
</div>
</body>
</html>