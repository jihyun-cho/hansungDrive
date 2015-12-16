package com.skp.tms.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.skp.tms.common.base.BaseDao;

@Repository("tmsDAO")
public class TmsDAO extends BaseDao {

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int viewInt(Map pMap) throws Exception {
		return super.viewInt(pMap);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String viewStr(Map pMap) throws Exception {
		return super.viewStr(pMap);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List list(Map pMap) throws Exception {
		return super.list(pMap);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int insert(Map pMap) throws Exception {
		return super.insert(pMap);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int update(Map pMap) throws Exception {
		return super.update(pMap);
	}

}
