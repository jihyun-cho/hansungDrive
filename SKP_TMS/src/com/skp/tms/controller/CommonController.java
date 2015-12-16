package com.skp.tms.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.skp.tms.common.base.CommonVar;
import com.skp.tms.common.util.CommonUtil;
import com.skp.tms.service.CommonService;



@org.springframework.stereotype.Controller
@RequestMapping(value="/common")
public class CommonController {

	private Logger log = Logger.getLogger(getClass());


	@Resource(name = "commonService")
	private CommonService service;
	
		
	
	/** 
	 * 요율구분 리스트
	 * */ 
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/getCM035List",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getCM035List( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			// 세션
			request.getSession();
			
			// DB 통신
			pMap.put(CommonVar._SQL_ID, "common.getCM035List");
			sqlRetList =  service.list(pMap);
			resultMap.put("CM035", sqlRetList);

			// 응답값 세팅
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
			resultMap.remove(CommonVar._AJAX_SUCCES_FLAG_NAME);

		} catch (SQLException se) {
			CommonUtil.setConsoleErrorPrint ( se , log );
			return CommonUtil.resultAjaxError( "sql", resultMap );		
		} catch (Exception e) {
			CommonUtil.setConsoleErrorPrint ( e , log );
			return CommonUtil.resultAjaxError( "", resultMap );		
		}
		return resultMap;
	}
		
		
}