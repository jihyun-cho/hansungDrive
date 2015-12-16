<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
	강부장님이 샘플 소스
 --%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>

<title>SKT TMS솔루션</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />	
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/jquery/plugins/jqGrid/ui.jqgrid.css" media="screen"/>
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/jquery/plugins/jquery-ui/themes/smoothness/jquery-ui.css" media="screen"/>
<link rel="stylesheet" type="text/css" href="/tms/asset/css/sys/layout.css" media="screen"/>

<style type="text/css">
	html, body { margin:0 }
	#bcWrapTable { display:none }
</style>

<script type="text/javascript">
var CONST = {
	CONTEXT_PATH: "",
	IMG_PATH_SRCH: '/tms/images/button/btn_search.gif', 
	IMG_PATH_SRCH_GRID: '/tms/images/button/btn_search.gif', 
	IMG_PATH_SRCH_GRID_DIS: '/tms/images/button/btn_search_dis.gif', 
	IMG_PATH_CAL: '/tms/images/button/calendar.gif', 
	IMG_PATH_CAL_DIS: '/tms/images/button/calendar_dis.gif', 
	IMG_PATH_LOADER: '/tms/images/ajax-loader.gif', 
	G_LANGUAGE: '', 	
	KFR_IMG_PATH_CAL: '/tms/asset/images/sys/btn_gray_calendar.png',
	KCU_IMG_PATH_SRCH_GRID: '/tms/asset/images/sys/searchButton.png' 
}
</script>

<script type="text/javascript" src="/tms/asset/js/sys/common/json2.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/jquery.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.cookie.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.alphanumeric.pack.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.blockUI.js"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery.ba-throttle-debounce.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jquery-ui/jquery-ui-custom.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/common/frameone-common-kfr.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/kio-common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/tms-common.js" charset="utf-8"></script> <!-- 운송 공통 자바스크립트 -->
<script type="text/javascript" src="/tms/asset/js/sys/kcu-common.js" charset="utf-8"></script> <!-- 계약 공통 자바스크립트 -->
<script type="text/javascript" src="/tms/asset/js/sys/kcc-common.js" charset="utf-8"></script> <!-- 정산 공통 자바스크립트 -->
<script type="text/javascript" src="/tms/asset/js/sys/common.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jqGrid/jquery.jqGrid.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/jquery/plugins/jqGrid/i18n/grid.locale-kr.js" charset="utf-8"></script>
<script type="text/javascript" src="/tms/asset/js/sys/common/frameone.jquery.jqGrid.kfr.js" charset="utf-8"></script>

	
</head>
<body>
<script type="text/javascript">

	var msgCode = "";
	var msg = "";
	if(msgCode !=""){
		alert(msg);
	}
	
	$(function(){ 
		viewResizeEvent("wrapper", false);
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
				<!--
				<li>	
					<h2>견적관리</h2>
					<ul class="snb">
						<li><a href="/kcu/listEstimate.fo">견적 조회</a></li>
					</ul>
				</li>	
				<li>	
					<h2>계약관리</h2>
					<ul class="snb">
						<li><a href="/kcu/listContract.fo">매출 계약 관리</a></li>
						<li><a href="/kcu/listPurchaseContract.jsp.fo">매입 계약 관리</a></li>
					</ul>
				</li>	
				<li>	
					<h2>주문관리</h2>
					<ul class="snb">
						<li><a href="/kio/listOrder.fo">주문 조회/등록</a></li>
						<li><a href="/kio/listOrderContract.fo">계약 주문 등록</a></li>
						<li><a href="/kio/inputFormFixOrder.fo">고정물량주문 등록</a></li>
						<li><a href="/kio/listContractLspOrder.fo">지정물량주문 조회</a></li>
						<li><a href="/kio/inputFormContractLspOrder.fo">지정물량주문 등록</a></li>
						<li><a href="/kio/inputFormRecord.fo">대당운송실적 등록</a></li>
						<li><a href="/kio/listKxIfOrder.fo">통합물류연계 등록</a></li>
					</ul>
				</li>
				-->	
				<li>	
					<h2>운송관리</h2>
					<ul class="snb">
						<li><a href="/tms/kang/listTms">배차관리</a></li>
						<li><a href="/tms/kang/listTmsResult">실적관리</a></li>
						<li><a href="/tms/kang/listTmsCurrent">운송현황</a></li>
						<!--  
						<li><a href="/tms/listTmsAssignSign.fo">운송가맹점 배정 결과</a></li>
						<li><a href="/tms/listTmsBranch.fo">화물정보망 조회</a></li>
						<li><a href="/tms/listTmsState.fo">운송상태 관리</a></li>
						<li><a href="/gis/gisMain.fo">관제</a></li>
						<li><a href="/kxp/trafficMain.fo">경로검색</a></li>
						<li><a href="/gis/gisTracking.fo">실적현황</a></li>
						<li><a href="/tms/listTmsFpis.fo">운송실적(FPIS)</a></li>
						-->
					</ul>
				</li>
				<!--	
				<li>	
					<h2>정산관리</h2>
					<ul class="snb">
						<li><a href="/kcc/viewKccCorpList.fo">정산 조직 변경</a></li>
						<li><a href="/kcc/arConfirmList.fo">매출 정산 확정</a></li>
						<li><a href="/kcc/arChargeConfirmListLoad.fo">매출 청구 확정</a></li>
						<li><a href="/kcc/viewSalesSlip.fo">매출 회계 전기(SAP)</a></li>
						<li><a href="/kcc/viewSalesSlipCancel.fo">매출 회계 전기 취소</a></li>
						<li><a href="/kcc/apConfirmList.fo">매입 정산 확정</a></li>
						<li><a href="/kcc/viewReceiptSlip.fo">매입 회계 전기(SAP)</a></li>
						<li><a href="/kcc/salesSlipStatus.fo">회계 전표 현황</a></li>
						<li><a href="/kcc/salesInvoices.fo">거래 명세서</a></li>
						<li><a href="/kcc/salesDeposit.fo">입금내역</a></li>
						<li><a href="/kcc/salesPayment.fo">지급내역</a></li>
						<li><a href="/kcc/arManual.fo">매뉴얼 매출 입력</a></li>
						<li><a href="/kcc/arManualPymt.fo">매뉴얼 매출 정산 승인</a></li>
						<li><a href="/kcc/apManual.fo">매뉴얼 매입 입력</a></li>
						<li><a href="/kcc/apManualPymt.fo">매뉴얼 매입 정산 승인</a></li>
					</ul>
				</li>	
				<li>	
					<h2>기준정보</h2>
					<ul class="snb">
						<li><a href="/mdm/admin/userMgmTempMain.fo">임시 회원 관리</a></li>
						<li><a href="/mdm/userMgm.fo">고객/가맹점 관리</a></li>
						<li><a href="/mdm/admin/userMgmAdminMainEtc.fo">일반고객 조회</a></li>
						<li><a href="/mdm/admin/userGrdMgmMain.fo">운송가맹점 등급 관리</a></li>
						<li><a href="/mdm/admin/userGrdMgmShprMain.fo">화주/주선 등급 관리</a></li>
						<li><a href="/mdm/eqpMgmMain.fo">차량조회-운송가맹점</a></li>
						<li><a href="/mdm/admin/eqpMgmMainCls.fo">차량조회-직영/위수탁</a></li>
						<li><a href="/kio/admin/listOrderOpenStepTime.fo">주문공개 시간설정</a></li>
						<li><a href="/kcc/listCalculationArApBizcd.fo">매출입 항목코드</a></li>
						<li><a href="/mdm/admin/authMgmList.fo">권한관리</a></li>
						<li><a href="/mdm/admin/menuMgmList.fo">메뉴관리</a></li>
						<li><a href="/mdm/customItemMstr.fo">품목관리</a></li>
						<li><a href="/mdm/admin/internalUserMain.fo">내부사용자 관리</a></li>
						<li><a href="/mdm/admin/cmmnCodeMain.fo">공통코드 관리</a></li>
						<li><a href="/mdm/nodeManager.fo">노드관리</a></li>
						<li><a href="/mdm/admin/corpMgmList.fo">조직 관리</a></li>
						<li><a href="/mdm/favorRouteMain.fo">선호구간관리</a></li>
						<li><a href="/mdm/admin/payInfoSendFailList.fo">결제정보전송실패내역</a></li>
						<li><a href="/mdm/admin/eqpMgmEmp.fo">직영차량 운전원관리</a></li>
					</ul>
				</li>	
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