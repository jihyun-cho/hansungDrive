package com.skp.tms.common.util;

import java.io.InputStream;
import java.rmi.dgc.VMID;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.skp.tms.common.base.CommonVar;
import com.skp.tms.common.trance.GetTrans;
import com.skp.tms.common.trance.PointD;

/**
 * Desc     : 공통 유틸 기능 제공
 */
public class CommonUtil {
	
	
	private static Logger logger = Logger.getLogger(CommonUtil.class);

	
	/**
	 * TODO jqgrid에 관련된 속성을 resultMap을 풋<br>
	 * <br>
	 * @return HashMap
	 * @author 조지현
	 */	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static HashMap setResultMap ( HashMap resultMap ,  List sqlRetList , String page , String pageTotal , String records ) {
		resultMap.put("rows", sqlRetList);
		resultMap.put("page", page);
		resultMap.put("total", pageTotal );
		resultMap.put("records", records);
		return  resultMap;
	}
	
	
	
	/**
	 * <pre>
	 *    [MAP]타입 ->[Json String]타입으로 변환한다.
	 *  lib 추가 : jackson-core-asl-1.7.1.jar , ackson-mapper-asl-1.7.1.jar 
	 * @author 조지현
	 * </pre>
	 * */
	public static String convertObjectToJson(Object obj) throws Exception {
		if (obj==null) {
			return "";
		}
		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(obj);
		return json;
	}

	
	
	/**
	 * List<HashMap> 모든 value를 String 형으로 변환한다.
	 * @author 조지현
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static ArrayList convertAllToString(ArrayList<HashMap> list){
		ArrayList<HashMap> returnList = new ArrayList();
		for ( int i = 0 ; i < list.size(); i++) {
			HashMap paramMap = list.get(i);
			returnList.add((HashMap) convertAllToString(paramMap) );
		}
		return returnList;
	}
	
	
	
	
	/**
	 * HashMap 모든 value를 String 형으로 변환한다.
	 * @author 이재한
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Map convertAllToString(Map parmaMap){
		
		Set keySet = parmaMap.keySet();
		Iterator ita = keySet.iterator();
		
		while(ita.hasNext()){
			
			String key = (String)ita.next();
			Object value = parmaMap.get(key);
			
			if(value instanceof String ){
				continue;
			} else if(value instanceof Number ){
				parmaMap.put(key, String.valueOf(value));
			} else if(value instanceof List ){
				List<Map> list = (List<Map>)value; 
				for(Map data : list )
				{
					data = convertAllToString(data);
				}
			} else if(value instanceof Map ){
				parmaMap.put(key, convertAllToString((Map)value) );
			} else if ( checkNull(value,"").equals("")){
				parmaMap.put(key, "");
			}
		}
		return parmaMap;
	}
	
	
	/**
	 * <pre>
	 * 콤마 추가
	 * </pre>
	 * */
	public static String insertComma(String paramString) throws Exception{
			String str1 = "";
			String str2 = "";

			if ((paramString == null) || (paramString.length() < 1))	return "";
			
			if ((paramString.charAt(0) == '-')	|| (paramString.charAt(0) == '+')) {
				str2 = paramString.substring(0, 1);
				paramString = paramString.substring(1, paramString.length());
			}

			int i = paramString.length() % 3;
			str1 = paramString.substring(0, i);
			for (; i < paramString.length(); i += 3) {
				if (i > 0)
					str1 = str1 + ",";
				if (i + 3 > paramString.length())
					str1 = str1	+ paramString.substring(i, paramString.length());
				else
					str1 = str1 + paramString.substring(i, i + 3);
			}
			return str2 + str1;
	}
	
	
	
	/**
	 * <pre>
	 * DESC : catch 문 공통 에러 콘솔 프린트
	 *           , java security 에  printStackTrace() 구문을 빼야할 경우를 대비해서 공통 컴포넌트를 만듬
	 * @author 조지현
	 * </pre>
	 * */
	public static void setConsoleErrorPrint ( Exception e , Logger log ) {
		e.printStackTrace();
		log.warn(e);
	}
	
	
	
	/**
	 * <pre>
	 * DESC : catch 문 공통 ajax 리턴
	 * @author 조지현
	 * </pre>
	 * */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static HashMap resultAjaxError ( String errType , LinkedHashMap resultMap ) throws Exception {
		
		if ( errType.equals("sql")) {
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  CommonVar._SQL_ERR_MSG);
		} else {
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._DEF_ERR_MSG);
		}
		return resultMap;		
		
	}
	
	
	
	/**
	 * <pre>
	 *  desc : from request to map
	 *           -> 변환가능 오브젝트 : String , String[]
	 *  @param request HttpServletRequest
	 *  @param paramMap 가공 or 인젝션할 map
	 *  @return paramMap 가공한 map   
	 *  @author 조지현 
	 *  </pre> 
	 *  */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static HashMap<String,Object> paramToMap(HttpServletRequest request , HashMap paramMap) throws Exception{
	
		Enumeration<String> e = request.getParameterNames();  
		
		while (e.hasMoreElements()) {  
			String key = (String) e.nextElement();  
			String[] vals = request.getParameterValues(key);
			
			// String
			if ( key.endsWith("[]") == false ) {
				paramMap.put(key,  checkNull( SecurityUtil.xssFilter(vals[0]) , "" ) );
			} else if ( key.endsWith("[]") == true ) {
				
				// String[] -> list 
				List arrList = new ArrayList();  
			    for(String s : vals) { 
			    	arrList.add( checkNull( SecurityUtil.xssFilter(s) , "" ) );
			    }  
			    paramMap.put(key , arrList ) ;
			    
			    // SecurityUtil 에서 편집하기 귀찮음.
				// paramMap.put(key , (List)Arrays.asList( valStrings ) ) ;
			}
			
		}  
		  
		return paramMap;
	}
	
	
	
	
	/**
	 * <pre>
	 *  [Json String] 타입 requestbody을 [MAP] 타입으로 변환한다.
	 * @author 조지현
	 * </pre>
	 * */
	public static HashMap<String, Object> convertJsonToMap(String json) throws Exception {
       ObjectMapper objectMapper = new ObjectMapper();
       TypeReference<HashMap<String, Object>> typeReference = new TypeReference<HashMap<String, Object>>() { };
       HashMap<String, Object> object = objectMapper.readValue(json, typeReference);
       return object;
   }


	/**
	 * <pre>
	 *  [Json String] 타입 requestbody을 [LIST] 타입으로 변환한다.
	 * @author 조지현
	 * </pre>
	 * */
	@SuppressWarnings("rawtypes")
	public static ArrayList<HashMap> convertJsonToList(String json) throws Exception {
       ObjectMapper objectMapper = new ObjectMapper();
       ArrayList<HashMap> object = objectMapper.readValue(json, new TypeReference<ArrayList<HashMap>>() {});
       return object;
   }
	
	
	
	/**
	 * convert wgs84 to katech
	 * */
	public static double[] wgsToKat( double args[]) throws Exception {
		
		PointD kat = GetTrans.getGToK(  args[0] , args[1]);
		double[] result = { kat.x , kat.y	};
		return result;
	}
	
	
	
	/**
	 *  폼전송한 스트링 복호화 
	 *  */
	@SuppressWarnings("restriction")
	public static String base64Dec(Object arg) throws java.io.IOException {
		if (arg == null || arg.toString().equals("")) {
			return "";
		} else {
			sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
			byte[] b1 = decoder.decodeBuffer(arg.toString());
			String result = new String(b1);
			return result;
		}
	}
	
	
	
	/**
	 * 2차원배열 -> ArrayList
	 * */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static ArrayList twoDArrayToList( String[][] twoDArray) {
	    ArrayList list = new ArrayList();
	    
	    for (String[] array : twoDArray) {
	        list.addAll(Arrays.asList(array));
	    }
	    return list;
	}
	
	
	
	
	/**
	 * SSL 인증 무효화
	 */
	public static void disableCertificateValidation() {
		// Create a trust manager that does not validate certificate chains   
		TrustManager[] trustAllCerts = new TrustManager[] {      
				new X509TrustManager() {       
					public X509Certificate[] getAcceptedIssuers() {          
						return new X509Certificate[0];        
					}       
					public void checkClientTrusted(X509Certificate[] certs, String authType) {}       
					public void checkServerTrusted(X509Certificate[] certs, String authType) {}   
				}
		};    
		// Ignore differences between given hostname and certificate hostname   
		HostnameVerifier hv = new HostnameVerifier() {     
			public boolean verify(String hostname, SSLSession session) { 
				return true; 
			}   
		};    
		// Install the all-trusting trust manager   
		try {     
			SSLContext sc = SSLContext.getInstance("SSL");     
			sc.init(null, trustAllCerts, new SecureRandom());     
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());     
			HttpsURLConnection.setDefaultHostnameVerifier(hv);   
		} catch (Exception e) {
			logger.info("######################################");
			logger.info("####### disableCertificateValidation #######");
			logger.info("######################################");
			e.printStackTrace();
			
		} 
	}
		

	
	

	
	/**
	 * 3번째 자리 수 마다 [,] 삽입
	 * getCurrencyType("1000000") => 1,000,000
	 * @param value
	 * @return
	 */
	public static String getCurrencyType(String value){
		if(value != null ){
			if(value.length() > 3){
				value = getCurrencyType(value.substring(0,value.length()-3)) + ","+ value.substring(value.length()-3);
			}
		}
		return value;
	}
	
	
    
	/**
	 * NULL 체크하여 NULL일 경우 iValue 값으로 리턴
	 * @param str
	 * @param iValue
	 * @return
	 */
    public static String checkNull(Object str, String sValue) {
    	if ( str == null || str.equals("") ) {
    		str = sValue;
    	}
    	return String.valueOf(str);
    }
    
    
    
    /**
     * Desc : 배열일 넣어올때 NULL 체크하여 NULL일 경우 iValue 값으로 리턴
     * @Method name : checkNullArray
     * @param 
     * @return String[]
     * @throws 
     */
    public static String[] checkNullArray(String str[], String sValue){
    	for(int i = 0; i < str.length; i++){
    		if ( str == null || str.equals("") ) {
        		str[i] = sValue;
        	}
    	}
    	return str;
    }
    
    
    
    
    /**
     * 모바일(안드로이드) APP 버전 정보 가져오기
     * @return
     * @throws Exception
     */
    public String version() throws Exception {
    	String sResult = "";
    	
    	Properties env = new Properties();
    	InputStream is = getClass().getResourceAsStream("/remicon.properties");
    	env.load(is);
    	sResult = env.getProperty("android_version");
    	return sResult;
    }
    
    
    
    
    /**
     * 제한된 글자수 많큼 자름.
     */	
    public static String cutString(String str,int maxNum) {
        int tLen =str.length();
        int count = 0;  
        char c;
        int s=0;
        for(s=0;s<tLen;s++){
            c = str.charAt(s);
            if(count > maxNum) break;
            if(c>127) count +=2;
            else count ++;
        }     
        return (tLen >s)? str.substring(0,s)+"..." : str;
    }
	
	

	/**
	 * http://levin01.tistory.com/372
	 * 유일 아이디 생성
	 * */
	public String getVMID(){
		VMID getUID = new java.rmi.dgc.VMID();
		String getStrUID = String.valueOf(getUID).toUpperCase();
		return getStrUID.replaceAll("-","");
	}
	
	
	
	
		
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Boolean checkMapParamsNull(Map map){
		
		Map<String, Object> parameters = map;
		Boolean result = true;
		
		for(String parameter : parameters.keySet()) {
			if(parameters.get(parameter) instanceof String[]){
				String[] a = (String[])parameters.get(parameter);
		   	    if(a.length < 1){
		   	    	result = false;
		   	    	break;
		   	    }
			}else if(parameters.get(parameter) instanceof String){
				if(parameters.get(parameter).toString().trim() == null || parameters.get(parameter).toString().trim().equals("")){
					result = false;
					break;
				}
			}else if(parameters.get(parameter) == null){
				result = false;
				break;
			}else;			      
		}		
		return result;
     }
	
	
	
}
