package com.skp.tms.common.util;

import java.util.HashMap;



/**
 * Desc     : jsp 페이징 기능 제공
 */
public class PagingUtil {
	private int totalRecord; // 전체 레코드 갯수
	private int numPerPage; // 페이지당 default 글 수
	private int pagePerBlock = 10; // 블록당 default 페이지 수
	private int totalPage; // 총페이지 수
	private int totalBlock; // 총 블록수
	private int nowPage; // 현재 페이지
	private int nowBlock; // 현재 블럭
	@SuppressWarnings("unused")
	private String pagePath; // 리스트 페이지 경로
	private String tblBar = null; // 페이지바

	public PagingUtil() {

	}
	
	
	// pagePerBlock를 controller에서 세팅 가능하게 설정
	public void setPagePerBlock(int pagePerBlock){
		this.pagePerBlock = pagePerBlock;
	}
	
	public int getPagePerBlock(){
		return pagePerBlock;
	}
	
	
	
	
	
	/**
	 * <pre>
	 * mysq 용  jqgrid 페이지 처리 
	 * </pre>
	 * */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public HashMap setPaging4jqGrid( String totalCount , String page , String rows, HashMap pMap ) {
		
		int pageStart = (Integer.parseInt(page) -1)*Integer.parseInt(rows);
		int pageEnd = Integer.parseInt(rows);
		double d = Double.parseDouble(totalCount) / Double.parseDouble(rows);
		int total = (int)Math.ceil(d);
		
		pMap.put("pageStart",pageStart);
		pMap.put("pageEnd", pageEnd);
		pMap.put("pageTotal", total);
		
		return pMap;
	}
	
	
	

	/**
	 *  <PRE>
	 *  페이지 네비게이션 설정 - 일반
	 *  </PRE> 
	 *  */
	public String makePageBar(int numPerPage, int totalRecord, int nowPage, String pagePath) {

		this.numPerPage = numPerPage;
		this.totalRecord = totalRecord;
		this.nowPage = nowPage;
		this.pagePath = pagePath;
		this.totalPage = (int) Math.ceil((double) this.totalRecord	/ this.numPerPage);
		this.totalBlock = (int) Math.ceil((double) this.totalPage		/ this.pagePerBlock);		
		this.nowBlock = (int) ((double) (this.nowPage -1) / this.pagePerBlock);					

		StringBuffer pageLink = new StringBuffer(1024);
		if (totalRecord > 0) {
			/*
			if(nowBlock >= 0){
				pageLink.append("<a class=\"direction\" href='javascript:goPage(");
				pageLink.append((nowBlock *0)+1);
				pageLink.append(")'>");
				pageLink.append("<img src='/images/btn_prev.gif'>");	//맨처음페이지
				pageLink.append("</a>&nbsp;");
			}
			*/
			// 이전페이지 블록이 존재하는 경우 
			if (nowBlock > 0) {
				int linkPageNo = ((nowBlock -1) * pagePerBlock + 1 );
				pageLink.append("<a class=\"direction\" href='javascript:goPage(").append(linkPageNo).append(")'>");
				pageLink.append("<img src='/images/btn_prev.gif'></a>&nbsp;");	//전페이지
			}
			
			
			
			for (int i = 0; i < pagePerBlock; i++) {
				
				// 내가 현재 보고 있는 페이지 블록인 경우(숫자를 굵은 글씨로)				
				if ((nowBlock * pagePerBlock + i) +1 == nowPage) {
					pageLink.append("<a class=\"onpage\">");
					pageLink.append((nowBlock * pagePerBlock + i + 1));
					pageLink.append("</a>&nbsp;");
				} else {
					pageLink.append("<a href='javascript:goPage(");
					pageLink.append(((nowBlock * pagePerBlock) + i + 1) + ")'>[");
					pageLink.append(((nowBlock * pagePerBlock) + i + 1));
					pageLink.append("]</a>&nbsp;");
					
				}
				if ((nowBlock * pagePerBlock) + i + 1 == totalPage)
					break;
				// 내가 이동해서 보고자 하는 페이지 인 경우(숫자에 링크를 건다)
			}

			if (totalBlock > nowBlock + 1) {
				pageLink.append("<a class=\"direction\" href='javascript:goPage(");
				pageLink.append(((nowBlock + 1) * pagePerBlock + 1) + ")'>");
				pageLink.append("<img src='/images/btn_next.gif'>");	//다음페이지
				pageLink.append("</a>&nbsp;");
			}
			/*
			if(nowBlock < totalBlock ){
				pageLink.append("<a class=\"direction\" href='javascript:goPage(");
				pageLink.append((totalPage)  + ")'>");
				pageLink.append("<img src='/images/btn_last.gif'>");	//맨끝페이지
				pageLink.append("</a>");
			}
			*/
		}
		tblBar = pageLink.toString();

		return tblBar;
	}
	
	
	
	/**
	 *  <PRE>
	 *  페이지 네비게이션 설정 - bootstrap 3
	 *  </PRE> 
	 *  */
	public String pageBar4Boots3(int numPerPage, int totalRecord, int nowPage, String pagePath) {

		this.numPerPage = numPerPage;
		this.totalRecord = totalRecord;
		this.nowPage = nowPage;
		this.pagePath = pagePath;
		this.totalPage = (int) Math.ceil((double) this.totalRecord	/ this.numPerPage);
		this.totalBlock = (int) Math.ceil((double) this.totalPage		/ this.pagePerBlock);		
		this.nowBlock = (int) ((double) (this.nowPage -1) / this.pagePerBlock);					

		StringBuilder pageLink = new StringBuilder();
		pageLink.append("<ul class=\"pagination pagination-sm pagination-centered\">");
		
		if (totalRecord > 0) {
			/*
			if(nowBlock >= 0){
				pageLink.append("<a class=\"direction\" href='javascript:goPage(");
				pageLink.append((nowBlock *0)+1);
				pageLink.append(")'>");
				pageLink.append("<img src='/images/btn_prev.gif'>");	//맨처음페이지
				pageLink.append("</a>&nbsp;");
			}
			*/
			// 이전페이지 블록이 존재하는 경우 
			if (nowBlock > 0) {
				int linkPageNo = ((nowBlock -1) * pagePerBlock + 1 );
				pageLink.append("<li>");
				//pageLink.append("<a href='javascript:goPage(").append(linkPageNo).append(")'>&laquo;</a>");
				pageLink.append("<a href='javascript:goPage(").append(linkPageNo).append(")'>&lt;</a>");
				pageLink.append("</li>");	//전페이지
			}
			
			
			
			for (int i = 0; i < pagePerBlock; i++) {
				
				// 내가 현재 보고 있는 페이지 블록인 경우(숫자를 굵은 글씨로)				
				if ((nowBlock * pagePerBlock + i) +1 == nowPage) {
					pageLink.append("<li class=\"active\">");
					pageLink.append("<a href=\"#\">");
					pageLink.append((nowBlock * pagePerBlock + i + 1));
					pageLink.append("<span class=\"sr-only\">(current)</span>");
					pageLink.append("</a>");
					pageLink.append("</li>");
				} else {
					pageLink.append("<li>");
					pageLink.append("<a href='javascript:goPage(");
					pageLink.append(((nowBlock * pagePerBlock) + i + 1) + ")'>");
					pageLink.append(((nowBlock * pagePerBlock) + i + 1));
					pageLink.append("</a>");
					pageLink.append("</li>");
					
				}
				if ((nowBlock * pagePerBlock) + i + 1 == totalPage)
					break;
				// 내가 이동해서 보고자 하는 페이지 인 경우(숫자에 링크를 건다)
			}

			if (totalBlock > nowBlock + 1) {
				
				//다음페이지
				pageLink.append("<li>");
				pageLink.append("<a href='javascript:goPage(");
				pageLink.append(((nowBlock + 1) * pagePerBlock + 1) + ")'>");
				//pageLink.append("&raquo;");
				pageLink.append("&gt;");
				pageLink.append("</a>");
				pageLink.append("</li>");
			}
			/*
			if(nowBlock < totalBlock ){
				pageLink.append("<a class=\"direction\" href='javascript:goPage(");
				pageLink.append((totalPage)  + ")'>");
				pageLink.append("<img src='/images/btn_last.gif'>");	//맨끝페이지
				pageLink.append("</a>");
			}
			*/
		}
		
		pageLink.append("</ul>");
		
		tblBar = pageLink.toString();

		return tblBar;
	}
	
	
	
	

	// 페이지 생성
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public HashMap pageView(int pageCnt,String page, int totSize, String pagePath) throws NumberFormatException {

		// 페이징 처리시작
		int pageSize = pageCnt; // row 수
		int myPage = 0; // default page
		
		myPage = Integer.parseInt(page);// page  형변환
		
		int sNum = (pageSize * myPage); // 시작값 계산		
		sNum = sNum==1?sNum:sNum+1;
		int eNum = sNum - 1 + pageSize < totSize ? sNum - 1 + pageSize : totSize; // 끝나는 값 계산
	
		// 보여주는 pageView만들기
		String pageView = pageBar4Boots3(pageSize, totSize, myPage, pagePath);
	
		HashMap hMap = new HashMap();

		// 보낼값 넣어주기
		hMap.put("sNum", sNum);
		hMap.put("eNum", eNum);
		hMap.put("pageView", pageView);
		return hMap;
	}

}
