package com.skp.tms.common.base;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.ibatis.sqlmap.client.SqlMapClient;

public class CommonBaseDao extends SqlMapClientDaoSupport {
	
	@Resource(name="sqlMapClientMySql")
	protected void init(SqlMapClient sqlMapClient) {
		super.setSqlMapClient(sqlMapClient);		
	}	
	
	@SuppressWarnings("rawtypes")
	public int update(String sqlId, Map paramMap) throws Exception {
		return getSqlMapClientTemplate().update(sqlId, paramMap);
	}
	
	public int update(String sqlId) throws Exception {
		return getSqlMapClientTemplate().update(sqlId);
	}
	
	@SuppressWarnings("rawtypes")
	public int delete(String sqlId, Map paramMap) throws Exception {
		return getSqlMapClientTemplate().delete(sqlId, paramMap);
	}
	
	public int delete(String sqlId) throws Exception {
		return getSqlMapClientTemplate().delete(sqlId);
	}
	
	@SuppressWarnings("rawtypes")
	public int insert(String sqlId, Map paramMap) throws Exception {
		return getSqlMapClientTemplate().update(sqlId, paramMap);
	}
	
	@SuppressWarnings("rawtypes")
	public Object insertObj(String sqlId, Map paramMap) throws Exception {
		return getSqlMapClientTemplate().insert(sqlId, paramMap);
	}
	
	@SuppressWarnings("rawtypes")
	public int queryForInt(String sqlId, Map paramMap) throws Exception {
		Integer intVal = (Integer)getSqlMapClientTemplate().queryForObject(sqlId, paramMap);
		return intVal.intValue();
	}
	
	public int queryForInt(String sqlId) throws Exception {
		Integer intVal = (Integer)getSqlMapClientTemplate().queryForObject(sqlId);
		return intVal.intValue();
	}
	
	@SuppressWarnings("rawtypes")
	public String queryForStr(String sqlId, Map paramMap) throws Exception {
		return (String)getSqlMapClientTemplate().queryForObject(sqlId, paramMap);
	}
	
	public String queryForStr(String sqlId) throws Exception {
		return (String)getSqlMapClientTemplate().queryForObject(sqlId);
	}
	
	@SuppressWarnings("rawtypes")
	public List queryForList(String sqlId, Map paramMap) throws Exception {
		return getSqlMapClientTemplate().queryForList(sqlId, paramMap);
	}
	
	@SuppressWarnings("rawtypes")
	public List queryForList(String sqlId) throws Exception {
		return getSqlMapClientTemplate().queryForList(sqlId);
	}
}
