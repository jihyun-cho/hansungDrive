package com.skp.tms.common.base;

import java.util.List;
import java.util.Map;

public class BaseDao extends CommonBaseDao {
	
	
	public int viewInt(Map<String,Object>paramMap) throws Exception {
		return this.queryForInt(paramMap.get(CommonVar._SQL_ID).toString(),paramMap);
	}
	
	public String viewStr(Map<String,Object>paramMap) throws Exception {
		return this.queryForStr(paramMap.get(CommonVar._SQL_ID).toString(),paramMap);
	}

	@SuppressWarnings("rawtypes")
	public List list(Map<String,Object>paramMap) throws Exception {
		return this.queryForList(paramMap.get(CommonVar._SQL_ID).toString(),paramMap);
	}
	
	
	public int insert(Map<String,Object>paramMap) throws Exception {
		return this.insert(paramMap.get(CommonVar._SQL_ID).toString(),paramMap);
	}
	
	
	public int update(Map<String,Object>paramMap) throws Exception {
		return this.update(paramMap.get(CommonVar._SQL_ID).toString(),paramMap);
	}
	
	
}
