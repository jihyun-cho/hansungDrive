package com.skp.tms.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.skp.tms.common.base.CommonVar;
import com.skp.tms.common.util.CommonUtil;
import com.skp.tms.common.util.PagingUtil;
import com.skp.tms.common.util.SecurityUtil;
import com.skp.tms.service.SampleService;




@org.springframework.stereotype.Controller
@RequestMapping("/sample")
public class SampleController {

	@Resource(name = "sampleService")
	private SampleService service;

	// log4j class
	private Logger log = Logger.getLogger(getClass());

	private String jspPackName = "/sample";
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping("/today")
	public String today( HttpServletRequest request, ModelMap model) throws Exception{
		log.debug("##########################");
		log.debug("it is today");
		log.debug("##########################");
		HashMap pMap = new HashMap();
		pMap = CommonUtil.paramToMap(request, pMap);
		pMap.put(CommonVar._SQL_ID, "sample.getToday");
		String result = service.viewStr(pMap);
		model.put("today", result);
		return jspPackName+"/today";
	}
	
	
		
	/** 페이지 이동 + model 전송 */ 
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping("/jqGrid/test")
	public String test( HttpServletRequest request, ModelMap model) throws Exception{
		HashMap pMap = new HashMap();
		request.getSession();
		
		pMap = CommonUtil.paramToMap(request, pMap);
		pMap.put(CommonVar._SQL_ID, "sample.test");
		List result = service.list(pMap);
		model.put(CommonVar._AJAX_RETURN_RESULT_NAME, result);
		return jspPackName+"/jqGrid/test";
	}
	
	
	
	
	/** ###################################################################
	 *  ## main
	 *  ################################################################### */
	/** 단순 페이지 이동 */ 
	@RequestMapping("/jqGrid/main")
	public String main( HttpServletRequest request, ModelMap model) throws Exception{
		request.getSession();
		return jspPackName+"/jqGrid/main";
	}
	
	
	
	/** ###################################################################
	 *  ## multiGrid 샘플
	 *  ################################################################### */
	
	/** 단순 페이지 이동 */ 
	@RequestMapping("/jqGrid/multiGrid")
	public String multiGrid( HttpServletRequest request, ModelMap model) throws Exception{
		request.getSession();
		return jspPackName+"/jqGrid/multiGrid";
	}
	
	
	
	/** 
	 * grid1 : 운송해더 리스트
	 * */ 
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jqGrid/getTmsOdToHdList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getTmsOdToHdList( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetListCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			// 세션
			request.getSession();
	
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"),"1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"),"10"));
			// 필수 파라미터 리스트
			pChk.put("page", "R");
			pChk.put("rows", "R");

			// 필수 파라미터 체크
			String secChk[] = SecurityUtil.paramsChk(pMap,pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			// DB 통신
			// 총 갯수
			pMap.put(CommonVar._SQL_ID, "sample.getTmsOdToHdListCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			// 페이징 처리
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			// 페이징 리스트
			pMap.put(CommonVar._SQL_ID, "sample.getTmsOdToHdList");
			sqlRetList =  service.list(pMap);
			resultMap.put("rows", sqlRetList);
			resultMap.put("page", page);
			resultMap.put("total", String.valueOf(pMap.get("pageTotal")));
			resultMap.put("records", sqlRetListCnt);

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
	
	
	
	/** 
	 * grid2 : 운송디테일 리스트
	 * */ 
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jqGrid/getTmsOdToDtlList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getTmsOdToDtlList( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetListCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			// 세션
			request.getSession();
	
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"),"1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"),"10"));
			// 필수 파라미터 리스트
			pChk.put("page", "R");
			pChk.put("rows", "R");

			// 필수 파라미터 체크
			String secChk[] = SecurityUtil.paramsChk(pMap,pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			// DB 통신
			// 총 갯수
			pMap.put(CommonVar._SQL_ID, "sample.getTmsOdToDtlListCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			// 페이징 처리
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			// 페이징 리스트
			pMap.put(CommonVar._SQL_ID, "sample.getTmsOdToDtlList");
			sqlRetList =  service.list(pMap);
			resultMap.put("rows", sqlRetList);
			resultMap.put("page", page);
			resultMap.put("total", String.valueOf(pMap.get("pageTotal")));
			resultMap.put("records", sqlRetListCnt);

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
	
	
	
	
	/** 운송해더 업데이트 예제 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jqGrid/updateTmsOdToHdInfo",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public HashMap updateTmsOdToHdInfo( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._DEF_ERR_MSG);
		int sqlRetInt = 0;
		
		try {
			// 세션
			request.getSession();
	
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			// 필수 파라미터 리스트
			pChk.put("pk1", "R");				// dom으로 가져온 primaryKey 
			pChk.put("cellName", "R");			// 수정할 컬럼네임
			pChk.put("cellValue", "R");			// 수정할 컬럼값
			pChk.put("cancelYN", "R");			// 컨펌창 YN 값

			// 필수 파라미터 체크
			String secChk[] = SecurityUtil.paramsChk(pMap,pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			/** 
			 * [jqGrid의 beforeSubmitCell 옵션]에서 컨펌창 취소를 선택할 경우
			 * update 없이 afterSubmitCell 으로 넘어간다.
			 */
			if(CommonUtil.checkNull(pMap.get("cancelYN"),"N").equals("N")){
				resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._UPDATE_CANCEL_MSG);
				return resultMap;
			};
			
			
			// DB 통신
			// view단에서 [시/분]이 분기되어 업데이트 되므로, 서버사이드에서 TIME 컬럼을 합쳐서 인서트한다.
			pMap.put(CommonVar._SQL_ID, "sample.getTmsOdToHdInfo");
			List l = service.list(pMap);
			if (l.size() < 1 ) {
				throw new SQLException("검색 결과가 없습니다.");
			}
			
			HashMap hm = (HashMap) l.get(0);
			if (pMap.get("cellName").toString().endsWith("INS_HH")) {
				pMap.put("cellName", "INS_TIME");
				pMap.put("cellValue", pMap.get("cellValue").toString()+hm.get("INS_MI"));
			} else if (pMap.get("cellName").toString().endsWith("INS_MI")) {
				pMap.put("cellName", "INS_TIME");
				pMap.put("cellValue", hm.get("INS_HH")+pMap.get("cellValue").toString());
			} else if (pMap.get("cellName").toString().endsWith("DEP_PGI_HH")) {
				pMap.put("cellName", "DEP_PGI_TIME");
				pMap.put("cellValue", pMap.get("cellValue").toString()+hm.get("DEP_PGI_MI"));
			} else if (pMap.get("cellName").toString().endsWith("DEP_PGI_MI")) {
				pMap.put("cellName", "DEP_PGI_TIME");
				pMap.put("cellValue", hm.get("DEP_PGI_HH")+pMap.get("cellValue").toString());
			} else if (pMap.get("cellName").toString().endsWith("DEP_REQ_HH")) {
				pMap.put("cellName", "DEP_REQ_TIME");
				pMap.put("cellValue", pMap.get("cellValue").toString()+hm.get("DEP_REQ_MI"));
			} else if (pMap.get("cellName").toString().endsWith("DEP_REQ_MI")) {
				pMap.put("cellName", "DEP_REQ_TIME");
				pMap.put("cellValue", hm.get("DEP_REQ_HH")+pMap.get("cellValue").toString());
			}
			
			pMap.put(CommonVar._SQL_ID, "sample.updateTmsOdToHdInfo");
			sqlRetInt = service.update(pMap);
			
			// 응답값 세팅
			if ( sqlRetInt > 0 ) {
				resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._UPDATE_SUCCESS_MSG);
			}
		} catch (SQLException se) {
			CommonUtil.setConsoleErrorPrint ( se , log );
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._SQL_ERR_MSG);
			return resultMap;		
		} catch (Exception e) {
			CommonUtil.setConsoleErrorPrint ( e , log );
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._TEP_ERR_MSG);
			return resultMap;		
		}
		return resultMap;
	}
	
	
	
	
	/** 운송디테일 업데이트 예제 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jqGrid/updateTmsOdToDtlInfo",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public HashMap updateTmsOdToDtlInfo( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._DEF_ERR_MSG);
		int sqlRetInt = 0;
		
		try {
			// 세션
			request.getSession();
			
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			// 필수 파라미터 리스트
			pChk.put("pk1", "R");				// dom으로 가져온 primaryKey 
			pChk.put("pk2", "R");				// dom으로 가져온 primaryKey 
			pChk.put("cellName", "R");			// 수정할 컬럼네임
			pChk.put("cellValue", "R");			// 수정할 컬럼값
			pChk.put("cancelYN", "R");			// 컨펌창 YN 값
			
			// 필수 파라미터 체크
			String secChk[] = SecurityUtil.paramsChk(pMap,pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			/** 
			 * [jqGrid의 beforeSubmitCell 옵션]에서 컨펌창 취소를 선택할 경우
			 * update 없이 afterSubmitCell 으로 넘어간다.
			 */
			if(CommonUtil.checkNull(pMap.get("cancelYN"),"N").equals("N")){
				resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._UPDATE_CANCEL_MSG);
				return resultMap;
			};
			
			// DB 통신
			pMap.put(CommonVar._SQL_ID, "sample.updateTmsOdToDtlInfo");
			sqlRetInt = service.update(pMap);
			
			// 응답값 세팅
			if ( sqlRetInt > 0 ) {
				resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._UPDATE_SUCCESS_MSG);
			}
		} catch (SQLException se) {
			CommonUtil.setConsoleErrorPrint ( se , log );
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._SQL_ERR_MSG);
			return resultMap;		
		} catch (Exception e) {
			CommonUtil.setConsoleErrorPrint ( e , log );
			resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._TEP_ERR_MSG);
			return resultMap;		
		}
		return resultMap;
	}
	
	
	
	
}