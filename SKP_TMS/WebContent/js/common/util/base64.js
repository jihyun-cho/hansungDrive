
	function deco(form) {
		var InStr = form.ar1.value;
		var len_1 = InStr.length;
		var ttb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var len_res = InStr.length % 4;
		var len_div = len_1 - len_res;
		var re = new makeArray(3);
		var In = new makeArray(4);
		var DecNum = new makeArray(4);
		var i = 0;
		var Stat = "";
		var tmp16, tmp16s;
		var EnB = 4;
		var str = "";
		while (1) {
			if (i >= len_1)
				break;
			for (k = 1; k <= 4; k++) {
				In[k] = InStr.charAt(i++);
				DecNum[k] = ttb.indexOf(In[k]);
			}
			if (i >= len_div) {
				Stat = "End";
				if (len_res == 3 || DecNum[4] == 64)
					EnB = 3;
				if (len_res == 2 || DecNum[3] == 64)
					EnB = 2;
			}
			re[1] = (DecNum[1] << 2) + (DecNum[2] >> 4);
			re[2] = ((DecNum[2] & 15) << 4) + (DecNum[3] >> 2);
			re[3] = ((DecNum[3] & 3) << 6) | DecNum[4];
			for (var k = 1; k <= 3; k++) {
				if (k < EnB) {
					tmp16 = re[k].toString(16);
					tmp16s = "%" + tmp16;
					str = str + tmp16s;
				}
			}
		}
		str = unescape(str);
		form.ar1.value = str;
	}
	

	/**
	 * base64 js 인코딩
	 * */
	function base64Enc(a) {

		var InStr = a;
		var ttb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var len_1 = InStr.length;
		var len_res = InStr.length % 3;
		var len_div = len_1 - len_res;
		var ra = new makeArray(4);
		var i = 0;
		var Stat = "";
		var str = "";
		while (1) {
			if (i >= len_1)		break;
			if (i >= len_div)	Stat = "End";
			A = eval(InStr.charCodeAt(i++));
			B = eval(InStr.charCodeAt(i++));
			C = eval(InStr.charCodeAt(i++));
			if (i > len_div) {
				Stat = "End";
				if (len_res >= 1)	C = 0;
				if (len_res == 1)	B = 0;
			}
			ra[1] = A >> 2;
			ra[2] = ((A & 3) << 4) + (B >> 4);
			ra[3] = ((B & 15) << 2) + (C >> 6);
			ra[4] = C & 63;
			if (Stat == "End" && len_res >= 1)		ra[4] = 64;
			if (Stat == "End" && len_res == 1)		ra[3] = 64;
			for (var k = 1; k <= 4; k++)
				str = str + ttb.substr(ra[k], 1);
		}
		//alert(str);
		return str;
	}
	
	function makeArray(n) {
		this.length = n;
		for ( var i = 1; i <= n; i++) {
			this[i] = null;
		}
		return this;
	}