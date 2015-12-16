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
import com.skp.tms.service.TmsService;



@org.springframework.stereotype.Controller
public class TmsController {

	private Logger log = Logger.getLogger(getClass());


	@Resource(name = "tmsService")
	private TmsService service;
	
	
	
	/**
	 * TODO 주소팝업호출<br>
	 * <br>
	 * @author 조지현
	 */	
	@SuppressWarnings({ "rawtypes" })
	@RequestMapping("/searchAddr")
	public String searchAddr( HttpServletRequest request, ModelMap model) throws Exception{
		
		HashMap pMap = new HashMap();
		pMap = CommonUtil.paramToMap(request, pMap);
		String po = CommonUtil.checkNull(pMap.get("po"), "");
		String searchAddr = "";
		if ( po.equals("") == false ) {
			HashMap hm = CommonUtil.convertJsonToMap(po);
			searchAddr =  CommonUtil.checkNull(((HashMap)hm.get("mappingArr")).get("searchAddr") , "");
		}
		model.put("searchAddr", searchAddr);
		return "/popup/searchAddr";
	}
	
	
	/**
	 * TODO 주소팝업결과<br>
	 * <br>
	 * @author 조지현
	 */	
	@SuppressWarnings({"rawtypes", "unchecked"})
	@RequestMapping(value="/searchAddrList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap searchAddrData(HttpServletRequest request) throws Exception {
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetListCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			request.getSession();
	
			pMap = CommonUtil.paramToMap(request, pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"), "1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"), "30"));
			pChk.put("page", "R");
			pChk.put("rows", "R");

			String secChk[] = SecurityUtil.paramsChk(pMap, pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			pMap.put(CommonVar._SQL_ID, "common.searchAddrCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			pMap.put(CommonVar._SQL_ID, "common.searchAddrList");
			sqlRetList =  service.list(pMap);
			CommonUtil.setResultMap(resultMap, sqlRetList, page, String.valueOf(pMap.get("pageTotal")), sqlRetListCnt);
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);

		} catch (SQLException se) {
			CommonUtil.setConsoleErrorPrint ( se , log );
			return CommonUtil.resultAjaxError( "sql", resultMap );		
		} catch (Exception e) {
			CommonUtil.setConsoleErrorPrint ( e , log );
			return CommonUtil.resultAjaxError( "", resultMap );		
		}
		return resultMap;
	}
	
	
	
	@RequestMapping("/listTms")
	public String listTms(HttpServletRequest request) throws Exception{
		request.getSession();
		
		System.out.println("####################################");
		
		return "/listTms";
	}
	
	
	/** ajax getList 예제 */ 
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/listTmsData",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getPersonList(HttpServletRequest request) throws Exception {
		
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
			
			// 총 갯수
			pMap.put(CommonVar._SQL_ID, "tms.getPersonListCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			// 페이징 처리
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			// 페이징 리스트
			pMap.put(CommonVar._SQL_ID, "tms.getPersonList");
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
	 * TODO 메인 페이지 이동
	 */	
	@RequestMapping("/main")
	public String defaultGrid( HttpServletRequest request, ModelMap model) throws Exception{
		request.getSession();
		return "/main";
	}
	
	
	/** 
	 * TODO 배차의뢰 페이지 이동
	 * */
	@RequestMapping("/tms01")
	public String tms01(HttpServletRequest request) throws Exception{
		request.getSession();
		return "/tms01";
	}
	
	
	
	/**
	 * TODO 배차의뢰 해더 리스트<br>
	 * <br>
	 * @author 조지현
	 */	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/getTmsHdList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getTmsHdList( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetCnt = "0";
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
			pMap.put(CommonVar._SQL_ID, "tms.getTmsHdCnt");
			sqlRetCnt = service.viewStr(pMap);
			
			// 페이징 처리
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetCnt ,page ,rows ,pMap);
			
			// 토탈 사이즈가 1이상일 때 페이징 리스트 구한다.
			if ( Integer.parseInt(sqlRetCnt) > 0 ) {					
				pMap.put(CommonVar._SQL_ID, "tms.getTmsHdList");
				sqlRetList =  service.list(pMap);
			}
			
			// 응답값 세팅
			CommonUtil.setResultMap(resultMap, sqlRetList, page, String.valueOf(pMap.get("pageTotal")), sqlRetCnt);
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);

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
	 * TODO 배차의뢰 디테일 리스트<br>
	 * <br>
	 * @author 조지현
	 */	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/getTmsDtlList",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getTmsOdToDtlList( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			// 세션
			request.getSession();
	
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"),"1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"),"10"));
			// 필수 파라미터 리스트
			pChk.put("initFlag", "R");
			pChk.put("page", "R");
			pChk.put("rows", "R");

			// 필수 파라미터 체크
			String secChk[] = SecurityUtil.paramsChk(pMap,pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			// 초기화면일 때는 그냥 리턴
			String page = pMap.get("page").toString();
			if ( CommonUtil.checkNull( pMap.get("initFlag") ,"N").equals("Y") ) {
				// 응답값 세팅
				CommonUtil.setResultMap(resultMap, sqlRetList, page, CommonUtil.checkNull(pMap.get("pageTotal"),"0"), sqlRetCnt);
				resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);
				return resultMap;
			}
			
			// DB 통신
			// 총 갯수
			pMap.put(CommonVar._SQL_ID, "tms.getTmsDtlCnt");
			sqlRetCnt = service.viewStr(pMap);
			
			// 페이징 처리
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetCnt ,page ,rows ,pMap);
			

			// 토탈 사이즈가 1이상일 때 페이징 리스트 구한다.
			if ( Integer.parseInt(sqlRetCnt) > 0 ) {
				pMap.put(CommonVar._SQL_ID, "tms.getTmsDtlList");
				sqlRetList =  service.list(pMap);
			}	
			
			// 응답값 세팅
			CommonUtil.setResultMap(resultMap, sqlRetList, page, String.valueOf(pMap.get("pageTotal")), sqlRetCnt);
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);

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
	 * TODO 배차의뢰 해더정보 업데이트<br>
	 * <br>
	 * @author 조지현
	 */	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/updateTmsHdInfos",produces = "application/json;charset=UTF-8")
	@ResponseBody
	public HashMap updateTmsHdInfo( HttpServletRequest request) throws Exception{
		
		HashMap pMap = new HashMap();
		HashMap subMap  = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		ArrayList<HashMap> paramRowList = new ArrayList<HashMap>();
		
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		resultMap.put(CommonVar._AJAX_ERR_MSG_NAME, CommonVar._DEF_ERR_MSG);
		
		try {
			// 세션
			request.getSession();
	
			// 파라미터 세팅
			pMap = CommonUtil.paramToMap(request, pMap);
			// 파라미터 널 체크 - checked rowData
			String jsonStr = CommonUtil.checkNull(pMap.get("rowList"),"");
			if ( jsonStr.equals("")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  CommonVar._EMPTY_DATA_MSG);
				return resultMap;
			}
			// json -> list<map>
			paramRowList = CommonUtil.convertJsonToList(jsonStr);
			
			// 필수 파라미터 체크
			for ( int i =0 ; i < paramRowList.size() ; i++) {
				subMap = (HashMap) paramRowList.get(i);
				pChk.put("EO_ID", "R"); 
				pChk.put("RATE_CLS_CD", "R"); 
				pChk.put("TOT_QTY", "R"); 
				pChk.put("TOT_WT", "R"); 
				pChk.put("TOT_AMT", "R"); 
			
				String secChk[] = SecurityUtil.paramsChk(subMap , pChk);
				if ( secChk[0].equals("false")) {
					resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%d번째 %s." , i , CommonVar._INCORRECT_DATA_MSG /* ,secChk[1]*/ ) );
					return resultMap;
				}
			}
			
			// DB 통신
			// sqlID 는 서비스에 있음
			boolean flag = service.txUpdateTmsHdInfo(paramRowList);
			
			// 응답값 세팅
			if ( flag == true ) {
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
	
	

	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping("/getTmsVhclNoList")
	public String getTmsVhclNoList( HttpServletRequest request, ModelMap model) throws Exception{

		
		HashMap pMap = new HashMap();
		pMap = CommonUtil.paramToMap(request, pMap);
		
		System.out.println("#############>>>>>>>>>>>>>>>>>>>"+ pMap);

		//장비종류
		pMap.put(CommonVar._SQL_ID, "common.getCM038List");
		List resultList = service.list(pMap);
		model.put("carList", resultList);
		
		//장비톤급
		pMap.put(CommonVar._SQL_ID, "common.getCM039List");
		List resultList1 = service.list(pMap);
		model.put("carTon", resultList1);
		
		model.put("SEARCH_VHCL_NO", pMap.get("VHCL_NO"));

		return "/popup/listVehiclePopup";
	}
	
	
	
	
	
	/**
	 * TODO 차량검색팝업결과<br>
	 * <br>
	 * @param request
	 * @param response
	 * @param inParams
	 * @return
	 * @author Sang Youn Kang
	 * @since 2014. 7. 15. 
	 */
	@SuppressWarnings({"rawtypes", "unchecked"})
	@RequestMapping(value="/getTmsVhclNoListData",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getTmsVhclNoListData(HttpServletRequest request) throws Exception {
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetListCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			request.getSession();
	
			pMap = CommonUtil.paramToMap(request, pMap);
			
			System.out.println("############################################"+ pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"), "1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"), "30"));

			pChk.put("page", "R");
			pChk.put("rows", "R");

			String secChk[] = SecurityUtil.paramsChk(pMap, pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			pMap.put(CommonVar._SQL_ID, "tms.getTmsVhclNoListCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			pMap.put(CommonVar._SQL_ID, "tms.getTmsVhclNoList");
			sqlRetList =  service.list(pMap);
			
			CommonUtil.setResultMap(resultMap, sqlRetList, page, String.valueOf(pMap.get("pageTotal")), sqlRetListCnt);
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);

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
	 * TODO 고객조회팝업<br>
	 * <br>
	 * @param request
	 * @param response
	 * @param inParams
	 * @return
	 * @author Sang Youn Kang
	 * @since 2014. 7. 15. 
	 */	
	@SuppressWarnings({ "rawtypes" })
	@RequestMapping("/searchCustomer")
	public String getSearchCustomer( HttpServletRequest request, ModelMap model) throws Exception{
		
		HashMap pMap = new HashMap();
		pMap = CommonUtil.paramToMap(request, pMap);
		model.put("SEARCH_SHPR_NM", pMap.get("SHPR_NM"));

		return "/popup/searchCustomer";
	}
	
	
	/**
	 * TODO 고객조회팝업결과<br>
	 * <br>
	 * @param request
	 * @param response
	 * @param inParams
	 * @return
	 * @author Sang Youn Kang
	 * @since 2014. 7. 15. 
	 */	
	@SuppressWarnings({"rawtypes", "unchecked"})
	@RequestMapping(value="/searchCustomerData",produces="application/json;charset=UTF-8")
	@ResponseBody
	public HashMap getSearchCustomerData(HttpServletRequest request) throws Exception {
		
		HashMap pMap = new HashMap();
		HashMap pChk = new HashMap();
		LinkedHashMap resultMap = new LinkedHashMap();
		resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, false);
		
		PagingUtil pu = new PagingUtil();
		
		String sqlRetListCnt = "0";
		List<HashMap> sqlRetList = new ArrayList();
		
		try {
			request.getSession();
	
			pMap = CommonUtil.paramToMap(request, pMap);
			
			System.out.println("############################################"+ pMap);
			pMap.put("page", CommonUtil.checkNull(pMap.get("page"), "1"));
			pMap.put("rows", CommonUtil.checkNull(pMap.get("rows"), "30"));

			pChk.put("page", "R");
			pChk.put("rows", "R");

			String secChk[] = SecurityUtil.paramsChk(pMap, pChk);
			if ( secChk[0].equals("false")) {
				resultMap.put(CommonVar._AJAX_ERR_MSG_NAME,  String.format( "%s : bad body check" , secChk[1]) );
				return resultMap;
			}
			
			pMap.put(CommonVar._SQL_ID, "common.getCustomerListCnt");
			sqlRetListCnt = service.viewStr(pMap);
			
			String page = pMap.get("page").toString();
			String rows = pMap.get("rows").toString();
			pu.setPaging4jqGrid(sqlRetListCnt ,page ,rows ,pMap);
			
			pMap.put(CommonVar._SQL_ID, "common.getCustomerList");
			sqlRetList =  service.list(pMap);
			CommonUtil.setResultMap(resultMap, sqlRetList, page, String.valueOf(pMap.get("pageTotal")), sqlRetListCnt);
			resultMap.put(CommonVar._AJAX_SUCCES_FLAG_NAME, true);

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
