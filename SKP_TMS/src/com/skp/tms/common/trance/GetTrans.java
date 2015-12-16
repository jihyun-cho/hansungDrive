package com.skp.tms.common.trance;

import java.text.DecimalFormat;

import com.pointi.coordtrans.CoordTrans;
import com.pointi.coordtrans.LonAndLat;
import com.pointi.coordtrans.TM;

/**
 * Desc     : 좌표변환 기능 제공
 */
public class GetTrans {
	
	
	/*
	public static void main(String[] args) {
		test();
	}
	*/
	
	@SuppressWarnings("unused")
	public static void test() {

		/** 좌표변환 test : [ wgs84 -> katech ] */
		double Wx = 130.846653;
		double Wy = 37.517623;
		PointD pt = getGToK(Wx, Wy);
		
		/** 좌표변환 test : [ wgs84 <- katech ] */
		double kx = 302082.0849042797;
		double ky = 545466.9823443831;
		PointD ppt = getKToG(kx, ky);

		/** 좌표변환 test : [ bessel <-> katech <-> wgs84 ] */
		 String s[] = BesselToKatec("4579940", "1303472");
		 PointD p = getKToG(  new Double(s[0]) , new Double(s[1]) );
		 
		 /*
		 double d[] = coordXY( new Double(s[0]) , new Double(s[1]) ) ;
		 */
		 
	}

	
	/**
	 * <pre>
	 * 두 포인트의 미터단위 거리를 구한다.
	 * @param a katech 시작 포인트
	 * @param a katech 종료 포인트
	 * @return distance in meter
	 * </pre>
	 * */
	public static double getDistance( double a , double b , double c , double d ){
		PointD stPT = getGToK(a, b);
		PointD edPT = getGToK(c, d);
		 
        double width=Math.abs(stPT.x - edPT.x);
        double height=Math.abs(stPT.y - edPT.y);
         
        double result=Math.pow(width,2)+Math.pow(height,2);
        result=Math.sqrt(result);
         
        return result;
    }
	


	public static String[] getBeTo84(  Object a , Object b ){
		String s[] = BesselToKatec( a.toString() , b.toString() );
		PointD p = getKToG(  new Double(s[0]) , new Double(s[1]) );
		String r[] ={ String.valueOf(p.x) , String.valueOf(p.y) }; 
		return r;
	}
	
	
	/**
	 * katech -> wgs84
	 * */
	public static PointD getKToG(double x, double y) {
		DecimalFormat df = new DecimalFormat("0.########");
		int srcEllips = 0;
		int srcSystem = 4;
		int desEllips = 1;
		int desSystem = 0;

		PointD srcPoint = new PointD(0, 0);
		PointD desPoint = new PointD(0, 0);

		Conversion conv = new Conversion(0, 0, 0, 0);
		conv.SetSrcType(srcEllips, srcSystem);
		conv.SetDstType(desEllips, desSystem);
		srcPoint = new PointD(x, y);
		desPoint = conv.Conv(srcPoint);

		return new PointD(Double.parseDouble(df.format(desPoint.x)),	Double.parseDouble(df.format(desPoint.y)));
	}

	/**
	 * wgs84 -> katech
	 * */
	public static PointD getGToK(double x, double y) {
		int srcEllips = 1;
		int srcSystem = 0;
		int desEllips = 0;
		int desSystem = 4;

		PointD srcPoint = new PointD(0, 0);
		PointD desPoint = new PointD(0, 0);

		Conversion conv = new Conversion(0, 0, 0, 0);
		conv.SetSrcType(srcEllips, srcSystem);
		conv.SetDstType(desEllips, desSystem);
		srcPoint = new PointD(x, y);
		desPoint = conv.Conv(srcPoint);

		return new PointD(Math.floor(desPoint.x), Math.floor(desPoint.y));
	}

	
	 public static String[] BesselToKatec(String s, String s1)   {
	        double d = Double.parseDouble(s);
	        double d1 = Double.parseDouble(s1);
	        double d2 = d / 36000D;
	        double d3 = d1 / 36000D;
	        LonAndLat lonandlat = new LonAndLat(d2, d3);
	        TM tm = CoordTrans.convLLToTM(lonandlat, CoordTrans.KATEC, CoordTrans.Bessel);
	        double d4 = tm.getX();
	        double d5 = tm.getY();
	        String s2[] = {(new Double(d4)).toString() , (new Double(d5)).toString() };
	        return s2;
	    }
	    

	 public static String[] KatecToBessel(String s, String s1)  {
	        double d = Double.parseDouble(s);
	        double d1 = Double.parseDouble(s1);
	        TM tm = new TM(d, d1);
	        LonAndLat lonandlat = CoordTrans.convTMToLL(tm, CoordTrans.KATEC, CoordTrans.Bessel);
	        double d2 = lonandlat.getLon() * 36000D;
	        double d3 = lonandlat.getLat() * 36000D;
	        String s2[] = {(new Double(d2)).toString() , (new Double(d3)).toString() };
	        return s2;
	    }
	
	 /*
	public static double excelRound(double dNumber, int intNumDigits) {
	    return Double.parseDouble(String.format("%." + Integer.toString(intNumDigits) + "f", dNumber));
	  }
	
	public static String transferBesselLatLon(double katechX, double katechY){
		
	    final double cv_A = 6377397.155;
	    final double cv_EE = 0.006674372231802;
	    final double cv_EE_D = 0.006719218799175;
	    final double cv_K = 0.9999;
	    final double cv_E1 = 0.001674184801115;

	    final double cv_FE = 400000.0;
	    final double cv_FN = 600000.0;
	    final double cv_LON_O = 2.2340214425527400;
	    final double cv_M0 = 4207077.70785048;

	    double  CS_M1 = cv_M0 + ( katechY - cv_FN ) / cv_K;

	    double  CS_U1 = CS_M1 / cv_A / ( 1- cv_EE / 4 - 3 * Math.pow(cv_EE,2)/64 -5* Math.pow(cv_EE,3)/256 );

	    double CS_LAT1 = CS_U1 + (3*cv_E1/2-27*Math.pow(cv_E1,3)/32)*Math.sin(2*CS_U1) + (21*Math.pow(cv_E1,2)/16-55*Math.pow(cv_E1,4)/32) * Math.sin(4*CS_U1)
	    			   + (151*Math.pow(cv_E1,3)/96) * Math.sin(6*CS_U1) + 1097*Math.pow(cv_E1,4)/512 * Math.sin(8*CS_U1);

	    double CS_V1 = cv_A / Math.pow(1-cv_EE*Math.pow(Math.sin(CS_LAT1),2),0.5);

	    double CS_P1 = cv_A*(1-cv_EE)/Math.pow(1-cv_EE*Math.pow(Math.sin(CS_LAT1),2),1.5); 

	    double CS_T1 = Math.pow(Math.tan(CS_LAT1),2);

	    double CS_C1 = cv_EE_D*Math.pow(Math.cos(CS_LAT1),2);

	    double CS_D = (katechX - cv_FE)/CS_V1/cv_K;

	    double CS_LAT =CS_LAT1 - CS_V1 * Math.tan(CS_LAT1)/CS_P1*Math.pow(CS_D,2)/2-(5+3*CS_T1 + 10*CS_C1-4*Math.pow(CS_C1,2)-9*cv_EE_D)*Math.pow(CS_D,4)/24
	    +(61+90*CS_T1+298*CS_C1+45*Math.pow(CS_T1,2)-252*cv_EE_D-3*Math.pow(CS_C1,2))*Math.pow(CS_D,6)/720;

	    double CS_LON = cv_LON_O+(CS_D - (1+2*CS_T1+CS_C1)*Math.pow(CS_D,3)/6+(5-2*CS_C1+28*CS_T1-3*Math.pow(CS_C1,2)+8*cv_EE_D+24*Math.pow(CS_T1,2))*Math.pow(CS_D,5)/120)/Math.cos(CS_LAT1);

	    double X_BG = excelRound(CS_LON * 180 / 3.1415926535897932384626433832795028842,7);
	    double Y_BG = excelRound(CS_LAT * 180 / 3.1415926535897932384626433832795028842,7);
	    
	    String besselLonLat = X_BG + ":" + Y_BG;
	    
	    return besselLonLat;
	    
	}
	
	public static double[] coordXY(double katechX, double katechY){
		
		String besselLonLat = transferBesselLatLon(katechX, katechY);
		
		Double X_GG = Double.parseDouble(besselLonLat.split(":")[0]);
		Double Y_GG = Double.parseDouble(besselLonLat.split(":")[1]);
		
		final double cv_A = 6377397.155;
		final double cv_F = 0.0033427731821748; 
		final double cv_E = 0.081696831;
		final double cv_EE = 0.006674372;
	        
		final double DX = -128;
		final double DY = 481;
		final double DZ = 664;
		final double DA = 739.845;
		final double DF = 0.000010037499008;    

	    double CS_LAT_RAD = Y_GG * 0.0174532925199433;
	    double CS_LON_RAD = X_GG * 0.0174532925199433;

	    double CS_P = cv_A * ( 1 - cv_EE ) / Math.pow( 1- cv_EE * Math.pow(Math.sin(CS_LAT_RAD),2),1.5);
	    
	    double CS_V = cv_A / Math.pow ( 1 - cv_EE * Math.pow(Math.sin(CS_LAT_RAD),2) , 0.5 );
	    
	    double CS_LAT_GRS_DS = ( -1.0 * DX * Math.sin(CS_LAT_RAD) * Math.cos(CS_LON_RAD) - ( DY ) * Math.sin(CS_LAT_RAD)*Math.sin(CS_LON_RAD) 
	    		                             + DZ * Math.cos(CS_LAT_RAD) + ( cv_A * DF + cv_F * DA ) * Math.sin(2.0 * CS_LAT_RAD )) / (CS_P * Math.sin( 1.0 / 3600 / 180 * 3.1415926535897932384626433832795028842));
	    
	    double CS_LON_GRS_DS = ( -1.0 * DX * Math.sin(CS_LON_RAD) + DY * Math.cos(CS_LON_RAD) ) / ( CS_V * Math.cos(CS_LAT_RAD) * Math.sin(1.0 / 3600 / 180 * 3.1415926535897932384626433832795028842 ));
	    
	    double coordX = X_GG + CS_LON_GRS_DS / 3600.0;
	    double coordY = Y_GG + CS_LAT_GRS_DS / 3600.0;
	    
	    double[] retrunXY = {coordX,coordY}; 
	    
	    return retrunXY;
	}
	*/
}
