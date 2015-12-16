package com.skp.tms.common.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;


/**
 * Desc     : 보안처리에 적용할 함수 제공
 */
public class SecurityUtil {
	
	
	//log4j class
	private static Logger logger = Logger.getLogger(SecurityUtil.class);
	
	
	
	private static Pattern[] patterns = new Pattern[]{       
		Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE),
		Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),  
		Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
		Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
		Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),   
		Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
		Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
		Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),  
		Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
		Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL) 
	}; 
	
	
	
	/** 
	*	<PRE>
	 * 파일 확장자 검증
	*	</PRE>
	 * @param fileName 검증할 파일이름
	 * @param fileExt 파일이름을 검증할 확장자 배열
	 * @return aFileExt 배열에 포함되는 파일이름은 true 을 반환함. 
	 * String aFileExt[] = {"doc", "txt", "xls", "ppt", "pdf", "bmp", "jpg", "hwp", "gif", "zip" ,"png"	};
	 * */
	public static boolean fileExtFilter(String fileName , String[] aFileExt){
		boolean extFlag = false;

		String aFileExtFilter[] = fileName.split("\\.");
		if ( aFileExtFilter.length >= 2 ) {
			String fileExt = aFileExtFilter[ aFileExtFilter.length-1 ]; 
			
 			for ( String i : aFileExt ) {
				if (fileExt.equals(i)) {
					extFlag = true;
					break;
				}
			}
		} 
		return extFlag;
	}

	
	
	
	/**
	 *	<PRE>
	 * xss 방어 
	 *	</PRE>
	 **/ 
	public static String xssFilter(String input) throws Exception {
		
	    String output = CommonUtil.checkNull(input , "");
		try {
			output = output.replaceAll("<", "&lt;");
			output = output.replaceAll(">", "&gt;");
			output = output.replaceAll("\\(", "&#40;");
			output = output.replaceAll("\\)", "&#41;");
			//output = output.replaceAll("\"", "&quot;");		// json string 에 " 이 변환되서 오므로 주석처리함.
		} catch (Exception e) {
			e.printStackTrace();
		}
		return output;
	}
	
	
	

	
	/**
    * <pre>
    *  HttpServletRequest 혹은 @ReqeustBody 의 객체의 필수값 체크
    *  R : 필수값
    *  N : 필수값 & 더블형 
    *  @author 김응기 , 조지현
    *  @return [0] : true/false String , [1] bad parameter(or body) name 
    * </pre> 
    * */
	@SuppressWarnings("rawtypes")
	public static String[] paramsChk(Map<String,Object> params, Map<String,Object> paramsReqs) throws Exception {
	
		if(paramsReqs.isEmpty()) 	return new String[]{"true",""};
		
		Object key = null;
		Iterator iterator = paramsReqs.keySet().iterator();
		String result[] = new String[]{"false",""};
		
		while (iterator.hasNext()) {
			key = iterator.next();		   
			logger.debug( String.format("-----------------params.get(\"%s\")" , key ));
			logger.debug("-----------------="+  params.get(key) );
			//logger.debug( params.get(key) instanceof String );
			//logger.debug( params.get(key) instanceof List );
			//logger.debug( params.get(key) instanceof HashMap );

			if(paramsReqs != null 
			   && !paramsReqs.isEmpty() 
			   && paramsReqs.containsKey(key)
			   ){
				   //필수 요구 사항일 경우
				   if(paramsReqs.get(key).toString().toUpperCase().contains("R")){
					   
					    if(params.get(key) != null  && params.containsKey(key) ) {
					    	
					    	if ( params.get(key) instanceof String  ) {
					    		if("".equals(CommonUtil.checkNull(params.get(key).toString().trim(),""))){
						    		result = new String[]{"false",key.toString()};
						    		break;
						    	}else{
						    		result = new String[]{"true",""};
						    	}
					    	
					    	// 리스트	
					    	} else  if ( params.get(key) instanceof List  ) {
					    		
					    		ArrayList paList = new ArrayList();
					    		paList = (ArrayList) params.get(key);
					    		for ( int i = 0 ; i <  paList.size(); i++) {
					    			if("".equals(CommonUtil.checkNull( paList.get(i).toString().trim(),""))){
							    		result = new String[]{"false",key.toString()};
							    		break;
							    	}else{
							    		result = new String[]{"true",""};
							    	}
					    		}
					    		
					    	// JSON 링크맵 	
					    	} else if ( params.get(key) instanceof LinkedHashMap ) {
					    		LinkedHashMap lhm = new LinkedHashMap();
					    		lhm = (LinkedHashMap) params.get(key);
					    		
					    		
					    		Object subKey = null;
					    		Iterator subIterator = lhm.keySet().iterator();
					    		
					    		while (subIterator.hasNext()) {
					    			subKey = subIterator.next();		
					    		
					    			if(lhm != null 
			    					   && !lhm.isEmpty() 
			    					   && lhm.containsKey(subKey)
			    					){
					    				if( lhm.get(subKey) != null  ) {
									    	if ( lhm.get(subKey) instanceof String  ) {
									    		if("".equals(CommonUtil.checkNull( lhm.get(subKey).toString().trim(),""))){
										    		result = new String[]{"false",key.toString()};
										    		break;
										    	}else{
										    		//logger.debug( String.format("-----------------lhm.get(\"%s\")" , subKey ));
													//logger.debug( String.format("-----------------=%s" ,  lhm.get(subKey).toString() ));
										    		result = new String[]{"true",""};
										    	}
									    	} else if ( lhm.get(subKey) instanceof List  ) {
									    		
									    		ArrayList paList = new ArrayList();
									    		paList = (ArrayList) lhm.get(subKey);
									    		for ( int i = 0 ; i <  paList.size(); i++) {
									    			if("".equals(CommonUtil.checkNull( paList.get(i).toString().trim(),""))){
											    		result = new String[]{"false",key.toString()};
											    		break;
											    	}else{
											    		//logger.debug( String.format("-----------------lhm.get(\"%s\")" , subKey ));
														//logger.debug( String.format("-----------------=%s" ,  lhm.get(subKey).toString() ));
											    		result = new String[]{"true",""};
											    	}
									    		}
									    	}
					    				}
					    				
					    			} else {
					    				result = new String[]{"false",key.toString()};
								    	break;
					    			}
					    		
					    		}
					    	}
					    }else{
					    	result = new String[]{"false",key.toString()};
					    	break;
					    }
				   }
				   
				   //숫자타입 확인
				   if(paramsReqs.get(key).toString().toUpperCase().contains("N")){
					   if(params.get(key) != null && params.containsKey(key)	) {	  
						  
						   if (params.get(key) instanceof String || (params.get(key) instanceof Integer) || (params.get(key) instanceof Double)) {
								if(!isStringDouble(params.get(key).toString())){
						    		result = new String[]{"false",key.toString()};
						    		break;
						    	}else{
						    		result = new String[]{"true",""};;
						    	}	 
							// 리스트	
						   } else  if ( params.get(key) instanceof List  ) {	
						   
					    		ArrayList paList = new ArrayList();
					    		paList = (ArrayList) params.get(key);
					    		for ( int i = 0 ; i <  paList.size(); i++) {
					    			if(!isStringDouble(paList.get(i).toString())){
							    		result = new String[]{"false", key.toString()};
							    		break;
							    	}else{
							    		result = new String[]{"true",""};
							    	}
					    		}
					    		// JSON 링크맵 	
					    	} else if ( params.get(key) instanceof LinkedHashMap ) {
					    		
					    		LinkedHashMap lhm = new LinkedHashMap();
					    		lhm = (LinkedHashMap) params.get(key);
					    		
					    		Object subKey = null;
					    		Iterator subIterator = lhm.keySet().iterator();
					    		
					    		while (subIterator.hasNext()) {
					    			subKey = subIterator.next();		
					    		
					    			if(lhm != null 
			    					   && !lhm.isEmpty() 
			    					   && lhm.containsKey(subKey)
			    					){
					    				if( lhm.get(subKey) != null  ) {
									    	if ( lhm.get(subKey) instanceof String  ) {
									    		if(!isStringDouble(lhm.get(subKey).toString())){
										    		result = new String[]{"false",key.toString()};
										    		break;
										    	}else{
										    		//logger.debug( String.format("-----------------lhm.get(\"%s\")" , subKey ));
													//logger.debug( String.format("-----------------=%s" ,  lhm.get(subKey).toString() ));
										    		result = new String[]{"true",""};
										    	}
									    	} else if ( lhm.get(subKey) instanceof List  ) {
									    		
									    		ArrayList paList = new ArrayList();
									    		paList = (ArrayList) lhm.get(subKey);
									    		for ( int i = 0 ; i <  paList.size(); i++) {
									    			if(!isStringDouble(paList.get(i).toString())){
											    		result = new String[]{"false",key.toString()};
											    		break;
											    	}else{
											    		//logger.debug( String.format("-----------------lhm.get(\"%s\")" , subKey ));
														//logger.debug( String.format("-----------------=%s" ,  lhm.get(subKey).toString() ));
											    		result = new String[]{"true",""};
											    	}
									    		}
									    	}
					    				}
					    				
					    			} else {
					    				result = new String[]{"false",key.toString()};
								    	break;
					    			}
					    		
					    		}
					    	} 
				    	
					    }else{
					    	result = new String[]{"false",key.toString()};
					    	break;
					    }
				   }   
				} 
			}	
	
		return result;
	}
	
	
		
		
	/**
	 *   PathVariable 애노테이션으로 넘어온 변수들 중 
	 *   DB 숫자타입이 "" 으로 들어가기 전  client side 로 리턴.
	 * */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Map stripXSSParams(Map params) throws Exception{
		
		Object key = null;		
		Iterator iterator = params.keySet().iterator();

		while (iterator.hasNext()) {
			key = iterator.next();	
			if(params.get(key) instanceof String){
				params.put(key, stripXSS(params.get(key)) );	
			}
		}
		return params;
	}
	
	
	
	/**
	 * <pre>xss 체크 (널체크 포함)</pre>
	 * */
	private static String stripXSS(Object value) throws Exception{
		
		String v = CommonUtil.checkNull(value , "");
        if (!v.equals("")) { 
             v = v.replaceAll("\0", ""); 
            for (Pattern scriptPattern : patterns){ 
                v = scriptPattern.matcher(v).replaceAll(""); 
            } 
           	v = xssFilter(v);
        } 
        return v; 
    } 
	


	
	/**
	 * <pre>[스트링->더블] 타입 변환 체크</pre>
	 * */
   public static boolean isStringDouble(String s) {
	    try {
	        Double.parseDouble(s);
	        return true;
	    } catch (NumberFormatException e) {
	        return false;
	    }
	 }
   
   
   /**
	 * <PRE> 
	 * 연속한 3자리에 문자가 동일할 때, true 반환
	 * ex) 11ddd(true) , 1212a!d(false)
	 * </PRE>
	 * @param pw 패스워드
	 */
	public static boolean valiSame(String pw ) throws Exception {
		boolean flag = false;
		try {
			for (int i = 2  ; i < pw.length() ; i ++){
				if (pw.charAt(i - 2) == pw.charAt(i - 1) && pw.charAt(i - 2) == pw.charAt(i )) {
					flag = true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return flag;
	}

	
	/**
	 * <PRE> 
	 * 패스워드 검증 메소드
	 * 	1. 10자리 이상 검증
	 *  2. id 비포함 검증
	 *  3. 연속한 동일문자는 3번이상 검증
	 *  4. 알파벳 + 숫자 검증
	 *  5. 키보드 연속문자 3번이상 검증
	 *  6. 공백포함 검증
	 * 
	 * 검증에서 걸리면 false 반환
	 * </PRE>
	 * @param pw 패스워드
	 * @param id 아이디
	 * @throws Exception 
	 */
	public static boolean validationPW(String pw, String id) throws Exception {
		boolean flag = false;
		Pattern pLen = Pattern.compile(".{9,}"); 						// 길이
		//Pattern pNonStr = Pattern.compile("[^a-zA-z]+"); 		// 알파벳 이외 문자
		Pattern pNonStr = Pattern.compile("[0-9]+"); 				// 숫자
		Pattern pStr = Pattern.compile("[a-zA-Z]+"); 				// 알파벳
		Pattern pCont1 = Pattern.compile("(\\w)\\1\\1"); 	// 같은문자 반복1
		Pattern pCont2 = Pattern.compile("(\\W)\\1\\1"); 	// 같은문자 반복2
		Pattern pSpace = Pattern.compile("[\\s]"); 					// 공백

		if (pLen.matcher(pw).matches()) {
			if (!pNonStr.matcher(pw).matches() && !pStr.matcher(pw).matches()) {
				if (pCont1.matcher(pw).find() == false
						&& pCont2.matcher(pw).find() == false) {
					if (contains(pw, id) == false) {
						if (valiContinue(pw) == false) {
							if (pSpace.matcher(pw).find() == false) {
								flag = true;
							} else {
								flag = false; // 공백포함
							}
						} else {
							flag = false; // 키보드 연속문자 3번
						}
					} else {
						flag = false; // id 포함
					}
				} else {
					flag = false; // 같은문자 3번
				}
			} else {
				flag = false; // password 영문자+숫자 조합
			}
		} else {
			flag = false; // password 10자리 이상
		}
		return flag;
	}
	
	
	/**
	 * <pre>
	 * 키보드 연속 나열문자 체크 
	 * @param 비밀번호
	 * @return 비밀번호 정책에 어긋날 때는 true 을 반환함
	 * </pre>
	 * */
	public static boolean valiContinue(String pw) throws Exception {
		boolean flag = false;
		String pattern1 = "`1234567890-=";
		String pattern2 = "~!@#$%^&*()_+";
		String pattern3 = "qwertyuiop[]\\";
		String pattern4 = "QWERTYUIOP{}|";
		String pattern5 = "asdfghjkl;'";
		String pattern6 = "ASDFGHJKL:\"";
		String pattern7 = "zxcvbnm,./";
		String pattern8 = "ZXCVBNM<>?";
		String pattern[] = { pattern1, pattern2, pattern3, pattern4, pattern5,	pattern6, pattern7, pattern8 };

		for (int j = 0; j < pattern.length; j++) {
			for (int i = 2; i < pw.length(); i++) {
				if (pattern[j].indexOf(pw.substring(i - 2, i + 1)) != -1) {
					flag = true;
				}
			}
		}
		return flag;
	}
	
	
	/**
	 * <PRE> 
	 * 1.4 에는 해당 함수 없음; 문자 포함 검증 함수
	 * 검증 문자에 포함 문자가 없으면 false 반환
	 * </PRE>
	 * @param a 검증 문자
	 * @param b 포함 문자
	 */
	public static boolean contains(String a , String b) throws Exception {
	    boolean flag = false;
		try{
		  if ( a.indexOf(b) > -1 ) {
				flag = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return flag;
	}
	
	
	
	/**
	 * <PRE> 
	 * 파일 다운로드 우회 차단
	 * </PRE>
	 * @param input 검증할 입력값
	 */
	public static String downFilter(String input) throws Exception {
		input = CommonUtil.checkNull(input, "");
		String output = input;
		try {
			// 치환 순서 주의
			output = cozyReplaceAll(output, "../", "");
			output = cozyReplaceAll(output, "./", "");
			output = cozyReplaceAll(output, "..\\", "");
			output = cozyReplaceAll(output, ".\\", "");
			output = cozyReplaceAll(output, "%", "");
			//output = cozyReplaceAll(output, ";", "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return output;
	}
	
	
	/**
	 * <PRE> 
	 * 파일 업로드 우회 차단
	 * </PRE>
	 * @param input 검증할 입력값
	 */
	public static String akFilter(String input) throws Exception {
		input = CommonUtil.checkNull(input, "");
		String output = input;
		try {
			output = cozyReplaceAll(output, "../", "");
			output = cozyReplaceAll(output, "./", "");
			output = cozyReplaceAll(output, "..\\", "");
			output = cozyReplaceAll(output, ".\\", "");
			output = cozyReplaceAll(output, "%", "");
			output = cozyReplaceAll(output, ";", "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return output;
	}
	
	
	/** replaceAll 메소드 기능 */ 
	public static String cozyReplaceAll(String strOld, String strTarget, String strReplace)  throws Exception {
		String strNew = null;
		try {
			StringBuffer strbfNew = new StringBuffer();

			int intTargetLength = strTarget.length();
			int intStartIndex = 0;
			int intEndIndex = 0;

			while ((intStartIndex = strOld.indexOf(strTarget)) > -1) {
				intEndIndex = intStartIndex + intTargetLength;
				strbfNew.append(strOld.substring(0, intStartIndex)).append(strReplace);
				strOld = strOld.substring(intEndIndex);
			}
			strbfNew.append(strOld);
			strNew = strbfNew.toString();
		} catch (NullPointerException npe) {
			npe.printStackTrace();
		}

		return strNew;
	}
	

}
