package com.skp.tms.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.skp.tms.common.base.CommonVar;
import com.skp.tms.dao.CommonDAO;

@org.springframework.stereotype.Service("commonService")
public class CommonService {
	
	@Resource(name="commonDAO")
	private CommonDAO dao;
	
	public int viewInt(Map<String,Object> pMap) throws Exception {
		return dao.viewInt(pMap);
	}
	
	public String viewStr(Map<String,Object> pMap) throws Exception {
		return dao.viewStr(pMap);
	}
	
	@SuppressWarnings("rawtypes")
	public List list(Map<String,Object> pMap) throws Exception {
		return dao.list(pMap);
	}

	public int insert(Map<String,Object> pMap) throws Exception {
		return dao.insert(pMap);
	}
	
	public int update(Map<String,Object> pMap) throws Exception {
		return dao.update(pMap);
	}
	
	
	public int delete(Map<String,Object> pMap) throws Exception {
		return dao.update(pMap);
	}
	
	
	/**
	 *  TX 가 필요하다면 메소드를 로직별로 추가하자
	 *  
	 *  예시 - tx01
	 *  테스트는 꼭 해야함
	 *  boolean 타입이 tx가 무사히 커밋됬을때만 true 가 넘어 가는지 체크는 해야함.
	 * */
	//@Transactional(propagation=Propagation.REQUIRED, isolation=Isolation.SERIALIZABLE, readOnly=false, rollbackFor={Exception.class})
	@Transactional(propagation=Propagation.REQUIRED, isolation=Isolation.SERIALIZABLE, rollbackFor={Exception.class})
	public boolean tx01(Map<String,Object> pMap) throws Exception {
		
		boolean flag = false;
		
		pMap.put(CommonVar._SQL_ID , "smaple.insert01");
		dao.insert(pMap);
		
		pMap.put(CommonVar._SQL_ID , "smaple.update02");
		dao.update(pMap);
		
		pMap.put(CommonVar._SQL_ID , "smaple.update03");
		dao.update(pMap);
		
		flag = true;
		
		return flag;
	}
	
	
	
	
}
