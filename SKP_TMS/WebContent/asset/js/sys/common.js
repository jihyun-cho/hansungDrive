$(function(){
	for (var i=0; i<$("#gnb .snb").find('a').length; i++) {
		if(i < 10) $("#gnb .snb a").eq(i).attr('id','menu-0'+i);
		else $("#gnb .snb a").eq(i).attr('id','menu-'+i);
	}

	$('#gnb h2').click(function(){
		$('#gnb .snb').not($(this).parents('li').children('.snb')).hide();
		$(this).parents('li').children('.snb').toggle();
		$('#gnb h2').removeClass();
		$(this).addClass("active");
	});

	
	
//	$('#gnb h2').mouseenter(function(){
//		$('#gnb .snb').hide();
//		$(this).parents('li').children('.snb').show();
//	});
	
	$('#gnb').mouseleave(function(){
		$('#gnb .snb').hide();
	});
	/* gnb end */

	/* tab start */
	var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>닫기</span></li>";

	var tabs = $("#container").tabs();

	function addTab(tabName,tabUrl,tabId) {
		
		var label = tabName,
			url = tabUrl,
			id = "tabs-"+tabId,
			li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

		if($("#" + id).length != 1){
			//탭 컨텐츠 삽입
			//tabContentHtml = tabName + "에 관련된 컨텐츠가 뿌려집니다.";

			tabs.find(".ui-tabs-nav").append(li);
			tabs.find("#content").append("<iframe class='ifrm' id='" + id + "' width='100%' src='" + url + "?tab_id=" + id + "' frameborder='0' scrolling='no'></iframe>");
			tabs.tabs("refresh");
		}
		$(".ui-tabs-anchor[href$='" + tabId + "']").trigger("click");
		
		parent.popupArrayClose();	//팝업 일괄 닫기
	}

	$("#gnb .snb a")
		.click(function() {
			var tabName = $(this).html(),
			tabUrl = $(this).attr('href'),
			tabId = $(this).attr("id").substr(5,2);
			
			if(tabName != '관제' && tabName != '경로검색' && tabName != "실적현황"){	//관제,경로검색 메뉴는 팝업!!!!
				addTab(tabName,tabUrl,tabId);
				$('#gnb .snb li').removeClass();
				$(this).parent('li').addClass("active");
			}else{
				var wid = $(window).width();
				var hei = $(window).height();
				var gisPopup = window.open(tabUrl, tabId, 'width=' + wid + ', height=' + hei + ', resizable=yes, scrollbars=yes');
				gisPopup.focus();
			}
			return false;
			/*
			$("#gnb h2").removeClass();
			$("#gnb .snb li").removeClass();
			$(this).parent('li').addClass("active");
			$(this).parents('.snb').prev().addClass("active");
			*/
	});

	tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls"),
			tabId = panelId.substr(5,2);
		$("#" + panelId).remove();
		tabs.tabs("refresh");
		
		parent.popupArrayClose();	//팝업 일괄 닫기
		/*
		$("#gnb h2").removeClass();
		$("#gnb .snb li").removeClass();

		var snb = $("#content div[aria-expanded='true'").attr('id').substr(5,2);
		$("#gnb .snb").find("#menu-"+snb).parent('li').addClass("active");
		$("#gnb .snb").find("#menu-"+snb).parents('.snb').prev().addClass("active");
		*/
	});

	tabs.bind("keyup", function(event) {
		if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
			var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls"),
				tabId = panelId.substr(5,2);
			$("#" + panelId).remove();
			tabs.tabs("refresh");
			
			/*
			$("#gnb h2").removeClass();
			$("#gnb .snb li").removeClass();

			var snb = $("#content div[aria-expanded='true'").attr('id').substr(5,2);
			$("#gnb .snb").find("#menu-"+snb).parent('li').addClass("active");
			$("#gnb .snb").find("#menu-"+snb).parents('.snb').prev().addClass("active");
			*/
		}
	});
	/* tab end */
});





/**
 *  Popup Window OPEN (eHR)
 */
function openWindowPopup(popOptions)
{
	// Popup Window Default 옵션
	var defaultPopupOptions = {	
			width:500,      // sets the width in pixels of the window.
			height:500,     // sets the height in pixels of the window.
			centerScreen:1, // center window over entire screen {1 (YES) or 0 (NO)}. overrides top and left
			left:0,         // left position when the window appears.
			location:0,     // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
			menubar:0,      // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
			resizable:0,    // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
			scrollbars:0,   // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
			status:0,       // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
			windowName:null,// name of window set from the name attribute of the element that invokes the click
			windowURL:null, // url used for the popup
			top:0,          // top position when the window appears.
			toolbar:0,      // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
			alwaysRaised:1, // Always in front of all other browser windows. Signed script required.
			dependent:1,    // Subwindow closes if the window that opened it closes.
			directories:0
	};

	var settings = $.extend(defaultPopupOptions, popOptions);
	
	// 2013-01-20 수정 ==>  Safari, Chrome 팝업창 높이 조정 
	// Sarari는 IE에 비해 팝업창이 크게 뜨고, Chrome은 팝업창이 작게떠서 크기 조정.
	var app_version = navigator.appVersion.toUpperCase();
    if(app_version.indexOf('CHROME') >= 0) { 
    	settings.height = parseInt(settings.height, 10) + 5;
    }else if(app_version.indexOf('SAFARI') >= 0) { 
    	settings.height = parseInt(settings.height, 10) - 75;
    }
    
	// PopupWindow를 중앙에 출력 하고자 할 경우 
	if(settings.centerScreen) {  
		
		if (getBrowser().indexOf('IE') >= 0) { //hacked together for IE browsers
			settings.top  = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (settings.height/2)));
			settings.left = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (settings.width/2)));
			
			//콘도팬션 팝업 호출
			if(settings.centerScreen == 2){
				settings.top  = 230; 
				settings.left = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (settings.width/2)));
			}
		}else{
			settings.top  = window.screenY + (((window.outerHeight/2) - (settings.height/2)));
			settings.left = window.screenX + (((window.outerWidth/2) - (settings.width/2)));
		}
		
	}
	
	var windowFeatures = 'height='       + settings.height +
						 ',width='       + settings.width +
						 ',left='        + settings.left +
						 ',top='         + settings.top +
						 ',location='    + settings.location +
						 ',menuBar='     + settings.menubar +
						 ',resizable='   + settings.resizable +
						 ',scrollbars='  + settings.scrollbars +
						 ',status='      + settings.status + 
						 ',toolbar='     + settings.toolbar +
						 ',alwaysRaised='+ settings.alwaysRaised +
						 ',dependent='   + settings.dependent +
						 ',directories=' + settings.directories;

	// 파라메터값 생성 
	var param    = "";
	var cntParam = 0;
	for(variable in settings.param)
	{
		if(cntParam == 0) param += "?";
		else param += "&";
		
		param += variable + "=" + encodeURIComponent(settings.param[variable]); //Prameter Add
		
		cntParam ++; // Count 
	}
	
	settings.windowURL = settings.windowURL + param;
	
	//IE(?)에서 window.open()에서 윈도우 명에 공백이나 특수문자가 들어가면 팝업 자체가 뜨지 않으므로 공백/특수문자를 제거한다.
	if(settings.windowName != null && settings.windowName.length > 0){
		settings.windowName = settings.windowName.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]/gi, '');
	}
	
	var objWin = window.open(settings.windowURL, settings.windowName, windowFeatures);
	
	if (objWin == null) {
		// 팝업차단 : failed for most browsers 
		//showMessage("ERR_POPBLOCK");
		//alert("ERR_POPBLOCK");
	}else { 
		setTimeout(function() { 
			if (objWin.innerHeight === 0) { 
				// 팝업차단 : failed for chrome 
			    //showMessage("ERR_POPBLOCK");
				//alert("ERR_POPBLOCK");
			}else {
				objWin.focus();
			}
		}, 100); 
	}
	
	/**
	 * 팝업 일괄 관리용 
	 * - 일괄 닫기를 사용하기 위해 전역 팝업 변수에 담기
	if(opener != null){	//다중 팝업
		opener.top.parent.popupArray.push(objWin);
	}else{	//단일 팝업
		parent.popupArray.push(objWin);
	}
	* */
	
	return objWin;
}


/**
 *  Popup Window 닫기 (eHR)
 */
function closeWindowPopup(resultData, rowId, userFunc){
	
	if(userFunc != "undefined" && isEmpty(userFunc) == false){
		// 코드 검색 후 실행할 사용자 정의 함수 호출(조회 결과값 Data를 parameter로  넘김)
		var fn_user = eval("opener." + userFunc);
		if((typeof fn_user) != undefined){
			fn_user(resultData, rowId);
		}
	}
	self.close();
}
