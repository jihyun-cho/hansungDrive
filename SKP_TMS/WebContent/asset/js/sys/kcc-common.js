//조직정보
function fnSearchCoprId(args){
	var popupUrl = CONST.CONTEXT_PATH + args.url;
    var popupNm = "corpIdpopup";
    var popupWidth = '800';
    var popupHeight = '600';
    var popupScrollbars = '1';
    var userFunc = "";
   
    if(args.name != undefined && args.name != ""){ popupNm = args.name; }
    if(args.width != undefined && args.width != ""){ popupWidth = args.width; }
    if(args.height != undefined && args.height != ""){ popupHeight = args.height; }
    if(args.scrollbars != undefined && args.scrollbars != ""){ popupScrollbars = args.scrollbars; }
    if(args.userFunc != undefined && args.userFunc != ""){ userFunc = args.userFunc; }
    
    var po = {};	
    po['mappingArr'] = args.mappingArr;
	po['returnArr'] = args.retParams;
	po['readonlyArr'] = args.readonlyArr;
	var poJSON = JSON.stringify(po);
	
	var options = {
			isGrid: false, 	//그리드에서 호출할 경우 true
			grdId: null,	//isGrid가 true일 경우에만 유효
			rowId: null,	//isGrid가 true일 경우에만 유효
			windowName: popupNm, // name of window
			windowURL: popupUrl, 
			width : popupWidth,	//사용자정의값 우선
			height: popupHeight,
			scrollbars : popupScrollbars,
			param : {po:poJSON,userFunc:userFunc}
	
			//returnArr의 구조
			//OPENER창에 POPUP GRID정보 값 저장 할 파라미터
			//elemId - html엘리먼트 id (필수)
			//popGridNm - 팝업의 GRID 컬럼 이름
			//returnArr: [
			// 	{elemId:'txt1', popGridElemNM:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'txt2', popGridElemNM:'NAME'}     //부서 명	
			//]
			
			//mappingArr의 구조
			//	elemId - 그리드칼럼명 or html엘리먼트 id (필수)
			//	rsNm - 쿼리의 결과 칼럼명 or Alias (필수)
			//	paramNm - 쿼리의 파라미터로 쓰여야 할 경우, 파라미터명을 지정 (선택)
			//	popElemId - 검색팝업의 조회조건으로 써야할 경우 팝업에서 해당id를 갖는 input에 바인딩하기 위해 선언(선택) 
			//	noClear - true : mappingArr에 정의한  폼엘리먼트의 값을 초기화하지 않는다. (선택)
			//mappingArr: [
			// 	{elemId:'DPT_CD', rsNm:'CODE', paramNm:'DPT_CD', popElemId:'DPT_VAL'},	 //부서 코드	 
			//	{elemId:'DPT_NM', rsNm:'NAME'}     //부서 명	
			//],
			// 검색 조건으로 추가할 파라미터
			//searchParam: { P_SEARCH_ALL_YN:"Y" } //검색조건으로 추가할 파라미터 (ex: { ABC: 123 })
	};	
 

	var popup = openWindowPopup(options);
	popup.focus();		

}