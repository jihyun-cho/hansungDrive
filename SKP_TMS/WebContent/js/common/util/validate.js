/** #####################################################################################
 * 비밀번호 작성규칙 
 *  koti 는 비밀번호 작성규칙이 없는듯.. 상황에 맞쳐서 하자.
 *  
 *  # 조지현
 #####################################################################################*/


/**
 * <pre>
 * compare1 에 compare2의 num자리의 글자가 있나 비교 없으면 -1
 * </pre>
 */
function cozyIndexOf(compare1, compare2, num) {
	return compare1.indexOf(compare2.charAt(num));
}

/**
 * <pre>
 * 숫자만
 * !!전화번호를[선, 중, 후]로 나누기
 * </pre>
 */
function phoneCheck(replaceTel) {
	var tel = replaceTel;
	var tel1;
	var tel2;
	var telLen = tel.length;
	var pushSet = new Array();

	switch (telLen) {
	case 9:
		tel1 = tel.substring(2, 5);
		tel2 = tel.substring(5, 9);
		pushSet.push(tel1);
		pushSet.push(tel2);
		pushSet.push(tel1 + tel1);
		break;
	case 10:
		if (cateTel = "02") { // 서울국번
			tel1 = tel.substring(2, 6);
			tel2 = tel.substring(6, 10);
		} else { // 핸폰 + 그외 국번
			tel1 = tel.substring(3, 6);
			tel2 = tel.substring(6, 10);
		}
		pushSet.push(tel1);
		pushSet.push(tel2);
		pushSet.push(tel1 + tel1);
		break;
	case 11:
		tel1 = tel.substring(3, 7);
		tel2 = tel.substring(7, 11);
		pushSet.push(tel1);
		pushSet.push(tel2);
		pushSet.push(tel1 + tel1);
		break;
	}
	return pushSet;
}

/**
 * <pre>
 * 필수값체크
 * </pre>
 */
function fnCheckForm(fieldlist, firstPW, secondPW) {
	for ( var i = 0; i < fieldlist.length; i++) {
		var frm = document.getElementById(fieldlist[i][0]);
		if (!frm) {
			alert(fieldlist[i][0] + ' 오류!');
			return false;
		}
		// 공백이 있어야 되는 오브젝트
		if (frm.id != "com_address" && frm.id != "com_name") {
			if (/\s/g.test(frm.value)) {
				alert(fieldlist[i][1] + "을(를) 공백없이 입력하세요.");
				if (frm.type != "hidden") {
					frm.value = "";
					frm.focus();
				}
				return false;
			}
		}

		if (frm.value == "") {
			alert(fieldlist[i][1] + "은(는) 필수입력 항목 입니다.\n정보를 모두 입력 하시기 바랍니다.");
			if (frm.type != "hidden") {
				frm.value = "";
				frm.focus();
			}
			return false;
		}
	}
	return true;
}

/**
 * <pre>
 * 유효성검증
 * </pre>
 */
function validationUser(eId, eName, ePw, eRePw, eTel) {
	/* 아이디 / 비밀번호 작성규칙 적용 */
	var idChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var regexp_repeat = /(.)\1\1/; // 같은 문자 3번

	var regexp = /[0-9a-zA-Z]/;

	/* ------------ 시작 - 아이디 작성 규칙 (for security) ----------------- */
	var adminIdVal = $(eId).val();

	if (idChars.indexOf(adminIdVal.charAt(0)) == -1) {
		alert("아이디는 첫글자에 영문으로 구성되어야  합니다.");
		$(eId).val('').focus();
		return false;
	}

	for ( var i = 0; i < adminIdVal.length; i++) {
		if (regexp.test(adminIdVal.charAt(i)) == false) {
			alert("[ 영문자 , 숫자 ] 조합으로 구성되어야 합니다.");
			$(eId).val('').focus();
			return false;
		}
	}

	if (regexp_repeat.test(adminIdVal)) {
		alert("아이디는 3자리 이상 같은 숫자나 문자를 입력할 수 없습니다.");
		$(eId).val('').focus();
		return false;
	}

	/* ------------ 시작 - 이름 작성 규칙 ----------------- */
	/*
	 * var adminNameVal = $(eName).val();
	 * 
	 * if(hangul_check(adminNameVal)) { alert("이름을 한글로 입력해 주세요.");
	 * $(eName).val('').focus(); return false; }
	 * 
	 * if( adminNameVal.length <=1 ) { alert("한글로 두글자 이상 입력해 주세요.");
	 * $(eName).val('').focus(); return false; }
	 */

	/* ------------ 시작 - 비밀번호 작성 규칙 (for security) ----------------- */
	var pw = $(ePw);
	var rePw = $(eRePw);
	var id = $(eId);
	var tel = $(eTel);

	if (pw.length != 0) {
		var validationPwMsg = validationPw(pw.val(), rePw.val(), id.val(), tel
				.val());

		if (validationPwMsg != '') {
			alert(validationPwMsg);
			$(ePw).val('').focus();
			$(eRePw).val('');
			return false;
		}
	}
	return true;
}

/**
 * - 비번확인이 다를때
 *  - 숫자가 제일 앞이나 제일 뒤에 오는 구성의 패스워드 허용: '1whtlago' , 'whtlago1' 비허용: 'whtlago12' -
 * 아이디를 포함하고 있을때
 *  - 같은 문자가 3번이상 반복될때 : aaa , AAA , !!! , 111
 *  - 정방향 나열만 체크 - 영어 소문자 / 대문자 / 숫자 가 순서대로 나열 : abc , ABC , 123 - 키보드 순서대로 나열 :
 * [`12 , ~!@ , qwe] , [`12 , ~!@ , qwe] 역순
 *  - 전화번호 가운데 , 뒷 , 가운데+ 뒷 자리를 포함 : ex) 01027058900 -> pw : 2705 , 8900 ,
 * 27058900 체크
 *  - 사전적 의미의 단어는 체크안함. TEXT 메세지 처리경고.. 화면설계 나옴 업데이트 하자.
 */
function validationPw(pw1, pw2, id, tel) {

	var tk = "`~!@#$%^&*()_+-=[]{};:\'\"\\<>?,./";

	var val_num = "0123456789";
	var val_Low = "abcdefghijklmnopqrstuvwxyz";
	var val_UPP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var val_con0 = "~!@#$%^&*()_+";
	var val_con1 = "`1234567890-=";
	var val_con2 = "QWERTYUIOP{}|";
	var val_con3 = "ASDFGHJKL:\"";
	var val_con4 = "ZXCVBNM<>?";
	var val_con5 = "qwertyuiop[]\\";
	var val_con6 = "asdfghjkl\;\'";
	var val_con7 = "zxcvbnm,./";

	var ifPw = new Array(val_num, val_Low, val_UPP, val_con0, val_con0
			.reverse(), val_con1, val_con1.reverse(), val_con2, val_con2
			.reverse(), val_con3, val_con3.reverse(), val_con4, val_con4
			.reverse(), val_con5, val_con5.reverse(), val_con6, val_con6
			.reverse(), val_con7, val_con7.reverse());
	var ifMsg = new Array('비밀번호는 012처럼 연속된 숫자를 입력할 수 없습니다.',
			'비밀번호는 abc처럼 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 ABC처럼 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 ~!@처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 @!~처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 `12처럼 키보드에 연속된 문자나 숫자를 입력할 수 없습니다.',
			'비밀번호는 21`처럼 키보드에 연속된 문자나 숫자를 입력할 수 없습니다.',
			'비밀번호는 QWE처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 EWQ처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 ASD처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 DSA처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 ZXC처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 CXZ처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 qwe처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 ewq처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 asd처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 dsa처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 zxc처럼 키보드에 연속된 문자를 입력할 수 없습니다.',
			'비밀번호는 cxz처럼 키보드에 연속된 문자를 입력할 수 없습니다.');

	var sss = '';
	var msg = '';

	// 동일비번
	if (pw1 != pw2) {
		return msg = "비밀번호가 일치하지 않습니다.";
	}

	// 첫자리 숫자 체크
	if (cozyIndexOf(ifPw[0], pw1, 0) != -1) {
		for ( var i = 0; i < 3; i++) {
			sss += pw1.charAt(i);
		}
		return msg = sss + " : 비밀번호는  첫자리는 숫자를 입력할 수 없습니다.";
	}

	// 끝자리만 숫자 체크
	var pwNumCnt = 0;
	var pwNumCnt1 = 0;

	for ( var c = 0; c < pw1.length - 1; c++) {
		if (cozyIndexOf(ifPw[0], pw1, c) != -1) {
			pwNumCnt++;
		}
	}

	if (cozyIndexOf(ifPw[0], pw1, pw1.length - 1) != -1) {
		pwNumCnt++;
		pwNumCnt1++;
	}

	if (pwNumCnt == 1 && pwNumCnt1 == 1) {
		return msg = pw1 + " : 비밀번호는  끝자리만 숫자를 입력할 수 없습니다.";
	}

	// 2종류의 이상 체크
	pwNumCnt = 0;
	pwNumCnt1 = 0;
	var pwNumCnt2 = 0;

	for ( var i = 0; i < pw1.length; i++) {
		if (cozyIndexOf(tk, pw1, i) != -1) {
			pwNumCnt = 1;
		}
		if (cozyIndexOf(ifPw[0], pw1, i) != -1) {
			pwNumCnt1 = 1;
		}
		if (cozyIndexOf(ifPw[1], pw1, i) != -1
				|| cozyIndexOf(ifPw[2], pw1, i) != -1) {
			pwNumCnt2 = 1;
		}
	}

	var totalPwNumCnt = pwNumCnt + pwNumCnt1 + pwNumCnt2;

	if (totalPwNumCnt < 2) {
		return msg = pw1 + " : 비밀번호는 2종류 이상의 영어대/소문자, 숫자, 특수문자을 조합하세요.";
	}

	pwNumCnt = 0;
	pwNumCnt1 = 0;
	pwNumCnt2 = 0;

	// 10자리 이상 체크
	if (pw1.length < 10) {
		return msg = pw1.length + "자리 : 비밀번호는 10자리 이상 입력할 수 있습니다.";
	}

	// 같거나 연속된 문자 3자리
	for ( var i = 0; i < pw1.length - 2; i++) {
		sss = pw1.charAt(i) + pw1.charAt(i + 1) + pw1.charAt(i + 2);
		if ((pw1.charAt(i) == pw1.charAt(i + 1))
				&& (pw1.charAt(i) == pw1.charAt(i + 2))) {
			return msg = sss + " : " + '같은 문자 3자리가 올수 없습니다.';
		}
		for ( var j = 0; j < ifPw.length; j++) {
			if (ifPw[j].indexOf(sss) != -1) {
				return msg = sss + " : " + ifMsg[j];
			}
		}
	}

	if (tel) {
		ifPw = new Array(id, " ", phoneCheck(tel)[0], phoneCheck(tel)[1],
				phoneCheck(tel)[2], phoneCheck(tel)[2]);

		ifMsg = new Array('비밀번호에 아이디가 포함될 수 없습니다.', '비밀번호는 공백을 포함될 수 없습니다.',
				'비밀번호는 전화번호 가운데자리를 입력할 수 없습니다', '비밀번호는 전화번호 뒷자리를 입력할 수 없습니다',
				'비밀번호는 전화번호 가운데자리 + 뒷자리를 입력할 수 없습니다');

	} else {
		ifPw = new Array(id, " ");

		ifMsg = new Array('비밀번호에 아이디가 포함될 수 없습니다.', '비밀번호는 공백을 포함될 수 없습니다.');
	}

	// 아이디 , 공백 ,전화번호 포함 체크
	for ( var i = 0; i < ifMsg.length; i++) {
		if (pw1.indexOf(ifPw[i]) != -1) {
			return msg = ifPw[i] + " : " + ifMsg[i];
		}
	}

	return msg;
}

/**
 * #####################################################################################
 * 달력 검사 시작 # 조지현
 * #####################################################################################
 */

/**
 * <pre>
 * 날짜포맷에맞는지 검사
 * </pre>
 */
function isDateFormat(d) {
	var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
	return d.match(df);
}

/**
 * <pre>
 * 윤년여부검사
 * </pre>
 */
function isLeaf(year) {
	var leaf = false;
	if (year % 4 == 0) {
		leaf = true;
		if (year % 100 == 0)
			leaf = false;
		if (year % 400 == 0)
			leaf = true;
	}
	return leaf;
}

/**
 * <pre>
 * 날짜가유효한지 검사
 * </pre>
 */
function isValidDate(d) {
	var isValid = false;

	var dataValue = "";
	if ( typeof d == 'string') {
		dataValue = d;
	} else {
		dataValue = d.value;
	}
	
	
	if (dataValue.length == 5) {
		if (dataValue.substring(4, 5) != '-') {
			dataValue = dataValue.substring(0, 4) + "-" + dataValue.substring(4, 5);
		}
		return;
	} else if (dataValue.length == 8) {
		if (dataValue.substring(7, 8) != '-') {
			dataValue = dataValue.substring(0, 7) + "-" + dataValue.substring(7, 8);
		}
		return;
	} else if (dataValue.length == 10) {
		if (dataValue.substring(4, 5) != '-' && dataValue.substring(7, 8) != '-') {
			alert('날짜 형식에 위배 : yyyy-mm-dd');
			dataValue = "";
			return;
		} else {
			if (!isDateFormat(dataValue)) {
				alert('날짜 형식에 위배 : yyyy-mm-dd');
				dataValue = "";
				return;
			}
			var month_day = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
			var dateToken = dataValue.split('-');

			var year = Number(dateToken[0]);
			var month = Number(dateToken[1]);
			var day = Number(dateToken[2]);

			// 윤년일 때
			if (isLeaf(year)) {
				if (month == 2) {
					if (day <= month_day[month - 1] + 1) {
						isValid = true;
					}
				} else {
					if (day <= month_day[month - 1]) {
						isValid = true;
					}
				}
			} else {
				if (day <= month_day[month - 1]) {
					isValid = true;
				}
			}
		}
	} else if (dataValue.length > 10) {
		alert('날짜 형식에 위배 : yyyy-mm-dd');
		dataValue = "";
		return;
	} else {
		return;
	}

	if (!isValid) {
		alert('날짜 형식에 위배 : yyyy-mm-dd');
		dataValue = "";
		return false;
	}
	return isValid;
}


function dateDiff( st , ed , flag){
	var mo = 0;
	if ( flag == "day")			mo = 1000 * 60*60 *24;
	else  if ( flag == "hour")  	mo = 1000 * 60*60;
    else if ( flag == "min" )	mo = 1000 * 60; 
	else if ( flag == "sec")		mo = 1000; 
	
	var stDT = new Date( st.substring(0,4) , st.substring(4,6) ,st.substring(6,8) , st.substring(8,10) , st.substring(10,12) , st.substring(12,14) );
	var edDT = new Date( ed.substring(0,4) , ed.substring(4,6) ,ed.substring(6,8) , ed.substring(8,10) , ed.substring(10,12) , ed.substring(12,14) );
	var diff = ( edDT.getTime() - stDT.getTime())/mo;
	return Math.floor(diff);

}