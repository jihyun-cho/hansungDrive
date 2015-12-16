package com.skp.tms.bean;

import java.util.HashMap;

import com.skp.tms.common.util.CommonUtil;



/**
 * @author 조지현 ## 세션관리 클래스
 * 지금은 안쓸듯
 * */
public class AdminBean {

	private String adminId; // 관리자 아이디
	private String adminNm; // 관리자 이름
	private String adminGrd; // 관리자 권한
	
	public AdminBean(){}
	
	@SuppressWarnings("rawtypes")
	public AdminBean( HashMap map) throws Exception{
		this.adminId = map.get("ADMIN_ID").toString();
		this.adminNm =   map.get("ADMIN_NM").toString();
		this.adminGrd =   map.get("ADMIN_GRD").toString();
		
	}
	
	public String getAdminId() {
		return CommonUtil.checkNull(adminId,"");
	}

	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}


	public String getAdminNm() {
		return CommonUtil.checkNull(adminNm,"");
	}

	public void setAdminNm(String adminNm) {
		this.adminNm = adminNm;
	}

	public String getAdminGrd() {
		return adminGrd;
	}

	public void setAdminGrd(String adminGrd) {
		this.adminGrd = adminGrd;
	}

}
