package com.skp.tms.common.filter;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.log4j.Logger;

import com.skp.tms.common.util.CommonUtil;
import com.skp.tms.common.util.SecurityUtil;




/**
 * Desc     : 서블릿 호출시 전처리기능으로 requestParameter 보안처리 기능 제공
 */			
public final class XssFilter implements Filter {

	public FilterConfig filterConfig;
	//log4j class
	private static Logger logger = Logger.getLogger(XssFilter.class);
			
	static class FilteredRequest extends HttpServletRequestWrapper{

		@SuppressWarnings({ "rawtypes", "unused" })
		private Map parameterMap = null;
		
		
		private static Pattern[] patterns = new Pattern[]{       
			// Script fragments     
			Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE),
			// src='...'    
			Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),  
			Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
			// lonely script tags 
			Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
			Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),   
			// eval(...) 
			Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
			// expression(...)  
			Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL), 
			// javascript:... 
			Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),  
			// vbscript:...   
			Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
			// onload(...)=...   
			Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL) 
		}; 
			
		public FilteredRequest(HttpServletRequest servletRequest) {
			super(servletRequest);				
		}
	
					
		public String getHeader(String name) {   
	        String value = super.getHeader(name);  
	        if (value == null)   
	            return null;   
	        return stripXSS(value);   
	           
	    }   
		
		public String getParameter(String paramName) {
    		String value = super.getParameter(paramName);
    		value = stripXSS(value);
    		return value;
    	}


	    @Override    
	    public String[] getParameterValues(String parameter) {         
	    	String[] values = super.getParameterValues(parameter);  
	    	if (values == null) {             
	    		return null;        
	    	}           
	    	
	    	int count = values.length;      
	    	String[] encodedValues = new String[count];       
	    	for (int i = 0; i < count; i++) {   
	    		encodedValues[i] = stripXSS(values[i]); 
	    	}
	    	return encodedValues;  
	    } 
		   
	    
	    // parameter , parameterValues 메소드 모두 xss를 필터한다.
		private String stripXSS(String value) { 
	        if (value != null) { 
	  
	            // Avoid null characters 
	             value = value.replaceAll("\0", ""); 
	  
	            // Remove all sections that match a pattern 
	            for (Pattern scriptPattern : patterns){ 
	                value = scriptPattern.matcher(value).replaceAll(""); 
	            } 
	           
	            // nullcheck , XSS 방어 
	            try{
	            	value = CommonUtil.checkNull(value, "");	
	            	value = SecurityUtil.xssFilter(value);
	            }catch(Exception e){
	            	logger.info(e.toString());
	            }
	        } 
	        return value; 
	    } 

	}
	
	public void doFilter(ServletRequest request, ServletResponse response,FilterChain chain) throws IOException, ServletException
	{
		  chain.doFilter(new FilteredRequest((HttpServletRequest)request), response);
    }

    public void destroy() {
    	this.filterConfig = null;
    }

    public void init(FilterConfig filterConfig) throws ServletException{
    	this.filterConfig = filterConfig;
    }	

}
