/**
 * <pre>
 * 숫자/돈 형식에 ,으로 구분하여 가독성 높임
 * </pre>
 */
String.prototype.currency = function() {
	var num = this;
	num = num.toString().replace(/ /g,'');
	var result = "0";
	if (num.indexOf(".") !=-1) {
		var num0 = num.split(".")[0];
		var num1 = num.split(".")[1];
		num0= num0.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		result =num0+"."+num1; 
	} else {
		result = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
	}
	return result;
};


/**
 * <pre>
 * reverse함수 추가 
 * return string reverse value
 * </pre>
 */
String.prototype.reverse = function() {
	var s = "";
	var i = this.length;
	while (i > 0) {
		s += this.substring(i - 1, i);
		i--;
	}
	return s;
};

/**
 * <pre>
 * trim함수 추가 
 * </pre>
 */
String.prototype.trim = function() {
	if (typeof this == 'undefined' || this == null) {
		return "";
	} else {
		return this.replace(/(^\s*)|(\s*$)/gi, "");
	}
};

/**
 * <pre>
 * LTrim함수 추가 
 * </pre>
 */
String.prototype.LTrim = function() {
	if (typeof this == 'undefined' || this == null) {
		return "";
	} else {
		return this.replace(/(^\s*)/gi, "");
	}
};

/**
 * <pre>
 * RTrim함수 추가 
 * </pre>
 */
String.prototype.RTrim = function() {
	if (typeof this == 'undefined' || this == null) {
		return "";
	} else {
		return this.replace(/(\s*$)/gi, "");
	}
};

/**
 * <pre>
 * 한글싸이즈구하는 script 
 * </pre>
 */
function getByteLength(s) {
	var len = 0;
	if (s == null)
		return 0;
	for ( var i = 0; i < s.length; i++) {
		var c = escape(s.charAt(i));
		if (c.length == 1)
			len++;
		else if (c.indexOf("%u") != -1)
			len += 2;
		else if (c.indexOf("%") != -1)
			len += c.length / 3;
	}
	return len;
}

/**
 * <pre>
 * 한글만(128이상) 입력가능 체크 
 * </pre>
 */
function hangul_check(val) {
	for ( var i = 0; i < val.length; i++) {
		var CodeNum = val.charCodeAt(i);
		if (CodeNum < 128) {
			return true;
		}
	}
}
