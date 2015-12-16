package com.skp.tms.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.StringTokenizer;

import org.apache.log4j.Logger;

/**
 * Desc     :  날짜 유틸 기능 제공
 */
public class DateUtil {
	
	
	@SuppressWarnings("unused")
	private static Logger logger = Logger.getLogger(DateUtil.class);

	
	/**
	 * 날짜 차이 계산
	 * @author 조지현
	 * */
	public static int dateDiff(Object st, Object ed , String flag) throws Exception {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

		int mosu = 0;
		if ( flag == "day")			mosu = 1000 * 60*60 *24;
		else  if ( flag == "hour")  	mosu = 1000 * 60*60;
	    else if ( flag == "min" )	mosu = 1000 * 60; 
		else if ( flag == "sec")		mosu = 1000; 
		
		Date stDT = formatter.parse(st.toString());
		Date edDT = formatter.parse(ed.toString());

		long diff = (edDT.getTime() - stDT.getTime()) /mosu;

		return (int) Math.floor(diff);
	}
	
	
	
	/**
	 * 오늘 요일 구하기
	 * @author 조지현
	 * */
	public static String getWeekDay() throws Exception {
		Calendar cal = Calendar.getInstance();
		String[] week = { "일", "월", "화", "수", "목", "금", "토" };
		return week[cal.get(Calendar.DAY_OF_WEEK) - 1];
	}
	 
	 
	
	
	/**
	 * <PRE>
	 *  주간 시작일(일) , 종료일(토) 구하기
	 * EX) 지난주 
	 * 		System.out.println( getDayOfWeeks( getDate("yyyy-MM-dd" , 1 , -(7*1)) )[0] );
	 * 		System.out.println( getDayOfWeeks( getDate("yyyy-MM-dd" , 1 , -(7*1)) )[1] );
	 * @author 조지현
	 * </PRE>
	 */
	@SuppressWarnings("static-access")
	public static String[] getDayOfWeeks(String thisday) throws Exception {
		
		int year = 0 , month = 0,  day = 0;
		SimpleDateFormat dataFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cDate = Calendar.getInstance();  // Calendar 클래스의 인스턴스 생성
		StringTokenizer st = new StringTokenizer(thisday, "-");
		if (st.hasMoreTokens()) {
			year = Integer.parseInt(st.nextToken());
			month = Integer.parseInt(st.nextToken());
			day = Integer.parseInt(st.nextToken());
		}
		cDate.set(year, month-1, day);
		int dayOfWeek = cDate.get(Calendar.DAY_OF_WEEK);
		cDate.add(cDate.DATE,  -dayOfWeek+1);
		String startResult = dataFormat.format(cDate.getTime());	    
		cDate.add(cDate.DATE,  6);
		String endResult =  dataFormat.format(cDate.getTime());
		String result[] = { startResult , endResult };
		return result;
	}
	
	
	
	/**
	 * <PRE>
	 * 월변 말일 구하기
	 * EX) 지난달 예제
	 * 		System.out.println( getLastDayOfMonth(getDate("yyyy-MM-dd" , 2 , -1))[0] );
	 * 		System.out.println( getLastDayOfMonth(getDate("yyyy-MM-dd" , 2 , -1))[1] );
	 * </PRE>
	 *  @author 조지현 보완
	 */
	public static String[] getLastDayOfMonth(String thisday) throws Exception {
		
		int year = 0 , month = 0,  day = 0;
		SimpleDateFormat dataFormat = new SimpleDateFormat("yyyy-MM-01");
		Calendar cDate = Calendar.getInstance();  // Calendar 클래스의 인스턴스 생성
		StringTokenizer st = new StringTokenizer(thisday, "-");
		if (st.hasMoreTokens()) {
			year = Integer.parseInt(st.nextToken());
			month = Integer.parseInt(st.nextToken());
			day = Integer.parseInt(st.nextToken());
		}
		cDate.set(year, month-1, day);
	
		int lastDayOfMonth = cDate.getActualMaximum(Calendar.DAY_OF_MONTH);
		String startResult = dataFormat.format(cDate.getTime());
		dataFormat = new SimpleDateFormat("yyyy-MM-");
		String endResult = dataFormat.format(cDate.getTime()) + String.valueOf(lastDayOfMonth);
		String result[] = { startResult , endResult };
		return result;
	}
	
	
	
	
	 /**
	  * <PRE>
	  * 해당 년도에 몇번째 주인지
	  * EX) getYearWeek( CommonUtil.getDate("yyyy-MM-dd", 1, 0) );
	  * </PRE>
	  * @author 조지현
	  */
	 public static int getYearWeek(String thisday) {
		 
		 int year = 0, month = 0,day = 0;
		 Calendar cDate = Calendar.getInstance();  // Calendar 클래스의 인스턴스 생성
		 StringTokenizer st = new StringTokenizer(thisday, "-");
		 if (st.hasMoreTokens()) {
			 year = Integer.parseInt(st.nextToken());
			 month = Integer.parseInt(st.nextToken());
			 day = Integer.parseInt(st.nextToken());
		 }
		 cDate.set(year, month-1, day);
		 return cDate.get(Calendar.WEEK_OF_YEAR);
	 }
	 
	 

	 
	 
	 /**
	  * <PRE>
	  * 현재 날짜로부터 날짜 계산
	  * EX) CommonUtil.getDate( "yyyy-MM-dd" ,  new int[]{1 , 2 } , new int[]{-1 , -1} )
	  * </PRE>
	  * 
	  * @author 조지현 보완
	  * @param pat  날짜패턴
	  * 		  field  1 = 일(한달), 2 = 월, 3 = 년, 해당사하잉 없을 경우 날짜 계산 안함
	  *        amount 빼거나 더할 일자 또는 월 또는 년
	  * @return String 패턴으로 된 날짜
	  * @throws Exception
	  */
	 public static String getDate(String pat, int[] field, int[] amount) throws Exception{
		 
		 SimpleDateFormat	dataFormat		= new SimpleDateFormat(pat);
		 String				serverDate		= null;
		 Calendar cal = Calendar.getInstance();
		 for ( int i = 0 ; i < field.length ; i++) {
			 switch(field[i]){
				 case 1 :	 cal.add(Calendar.DAY_OF_MONTH, amount[i]);	 break;
				 case 2 :	 cal.add(Calendar.MONTH, amount[i]);				 break;
				 case 3 :	 cal.add(Calendar.YEAR, amount[i]);					 break;
			 }
			 if( i == field.length-1)	 serverDate = dataFormat.format(cal.getTime());	 
		 }
		 return serverDate;
	 }
	 
	 
	/**
	 * <PRE>
	 * 현재 날짜로부터 날짜 계산
	 * EX) getDate('yyyyMMdd',2,-3) ,  오늘 CommonUtil.getDate("yyyyMMddHHmmss", 1, 0);
	 * </PRE>
	 * 
	 * @author 남지훈
	 * @param pat  날짜패턴
	 * 		  field  1 = 일(한달), 2 = 월, 3 = 년, 해당사하잉 없을 경우 날짜 계산 안함
	 *        amount 빼거나 더할 일자 또는 월 또는 년
	 * @return String 패턴으로 된 날짜
	 * @throws Exception
	 */
	public static String getDate(String pat, int field, int amount) throws Exception{

		SimpleDateFormat	dataFormat		= new SimpleDateFormat(pat);
		String				serverDate		= null;
		Calendar cal = Calendar.getInstance();
		switch(field){
			case 1 :
				cal.add(Calendar.DAY_OF_MONTH, amount);
				break;
			case 2 :
				cal.add(Calendar.MONTH, amount);
				break;
			case 3 :
				cal.add(Calendar.YEAR, amount);
				break;
		}
		serverDate = dataFormat.format(cal.getTime());
		return serverDate;
	}
	
	
	/**
	 * 현재 시분초 구하기(HHMMSS)
	 * @return
	 */
	public static String getTime() {
		Calendar cal = Calendar.getInstance();
		
		int hh = cal.get(Calendar.HOUR_OF_DAY);
		int mm = cal.get(Calendar.MINUTE);
		int ss = cal.get(Calendar.SECOND);
		
		String hhh = null;
		String mmm = null;
		String sss = null;
		
		if(hh < 10) {
			hhh = "0" + hh;
		} else {
			hhh = "" + hh;
		}
		
		if (mm < 10) {
			mmm = "0" + mm;
		} else {
			mmm = "" + mm;
		}

		if (ss < 10) {
			sss = "0" + ss;
		} else {
			sss = "" + ss;
		}
		
		return hhh + "" + mmm + "" + sss;
	}
	
	/**
	 * 문자열로 넘어온 날짜를 주어진 포멧으로 변한하여 리턴한다.
	 * formatDate("20100630",".") => 2010.06.30
	 * @param date
	 * @param c
	 * @return
	 */
	public static String formatDate(String date, char c) {
		String newDate = null;
		date = date.trim();
		
		if(date == null || date.equals("")) {
			return "";
		}
		
		if(date.length() != 8) {
			return date;
		}
		
		newDate = date.substring(0,4) + c + date.substring(4,6) + c + date.substring(6,8);
		return newDate;
	}
	

	/**
	 * 현재 날짜 
	 * @param 
	 * @return
	 */
	public String getDay(){
		String time = "";
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		
		time = sdf.format(cal.getTime());
		
		return time;
    }
	
	/**
	 * Desc : 날짜 더하기 빼기
	 * @Method name : setDateFormat
	 * @param gc
	 * @param fm
	 * @return
	 */
	public static String setDateFormat (GregorianCalendar gc , String fm) {
	    
	    if(fm == null) return fm;
	    
	    SimpleDateFormat sdf = new SimpleDateFormat(fm);
	    return sdf.format(gc.getTime());
	    
	   }
	
	
	
}
