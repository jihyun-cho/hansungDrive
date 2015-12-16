package com.skp.tms.common.trance;


/**
 * Desc     : 좌표 변환 관련 기능 제공
 */
public class Conversion  {

    public static double PI = 3.14159265358979;
    public static double EPSLN = 0.0000000001;
    public static double S2R = 4.84813681109536E-06;
    public static int X_W2B = 128;
    public static int Y_W2B =-481;
    public static int Z_W2B =-664;

    int m_eSrcEllips;
    int m_eSrcSystem;
    int m_eDstEllips;
    int m_eDstSystem;

    double[] m_arMajor = new double[2];
    double[] m_arMinor = new double[2];

    double[] m_arScaleFactor = new double[7];
    double[] m_arLonCenter = new double[7];
    double[] m_arLatCenter = new double[7];
    double[] m_arFalseNorthing = new double[7];
    double[] m_arFalseEasting = new double[7];

    static final long max_iter = 6; // maximun number of iterations

    // Internal Value for Tm2Geo
    double m_dSrcE0, m_dSrcE1, m_dSrcE2, m_dSrcE3;
    double m_dSrcE, m_dSrcEs, m_dSrcEsp;
    double m_dSrcMl0, m_dSrcInd;

    // Internal Value for Geo2Tm
    double m_dDstE0, m_dDstE1, m_dDstE2, m_dDstE3;
    double m_dDstE, m_dDstEs, m_dDstEsp;
    double m_dDstMl0, m_dDstInd;

    // Internal Value for DatumTrans
    double m_dTemp;
    double m_dEsTemp;
    int m_iDeltaX;
    int m_iDeltaY;
    int m_iDeltaZ;
    double m_dDeltaA, m_dDeltaF;

    public Conversion(int eSrcEllips, int eSrcSystem,
                      int eDstEllips , int eDstSystem){

        SetSrcType(eSrcEllips, eSrcSystem);
        SetDstType(eDstEllips, eDstSystem);

        m_arMajor[GeoEllips.kBessel1984] = 6377397.155;
        m_arMinor[GeoEllips.kBessel1984] = 6356078.96325;

        m_arMajor[GeoEllips.kWgs84] = 6378137.0;
        m_arMinor[GeoEllips.kWgs84] = 6356752.3142;
 
        m_arScaleFactor[GeoSystem.kKatec] = 0.9999;
        m_arLonCenter[GeoSystem.kKatec] = 2.23402144255274;
        m_arLatCenter[GeoSystem.kKatec] = 0.663225115757845;
        m_arFalseNorthing[GeoSystem.kKatec] = 600000.0;
        m_arFalseEasting[GeoSystem.kKatec] = 400000.0;

       
    } 

    // Set Internal Values
    public void SetSrcType(int eEllips, int eSystem) {
        m_eSrcEllips = eEllips;
        m_eSrcSystem = eSystem;

        double temp = m_arMinor[m_eSrcEllips] / m_arMajor[m_eSrcEllips];
        m_dSrcEs = 1.0 - temp * temp;
        m_dSrcE = Math.sqrt(m_dSrcEs);
        m_dSrcE0 = e0fn(m_dSrcEs);
        m_dSrcE1 = e1fn(m_dSrcEs);
        m_dSrcE2 = e2fn(m_dSrcEs);
        m_dSrcE3 = e3fn(m_dSrcEs);
        m_dSrcMl0 = m_arMajor[m_eSrcEllips] * mlfn(m_dSrcE0, m_dSrcE1, m_dSrcE2, m_dSrcE3, m_arLatCenter[m_eSrcSystem]);
        m_dSrcEsp = m_dSrcEs / (1.0 - m_dSrcEs);

        if (m_dSrcEs < 0.00001)
            m_dSrcInd = 1.0;
        else
            m_dSrcInd = 0.0;

        InitDatumVar();
    }

    public void SetDstType(int eEllips, int eSystem){
        m_eDstEllips = eEllips;
        m_eDstSystem = eSystem;

        double temp = m_arMinor[m_eDstEllips] / m_arMajor[m_eDstEllips];
        m_dDstEs = 1.0 - temp * temp;
        m_dDstE = Math.sqrt(m_dDstEs);
        m_dDstE0 = e0fn(m_dDstEs);
        m_dDstE1 = e1fn(m_dDstEs);
        m_dDstE2 = e2fn(m_dDstEs);
        m_dDstE3 = e3fn(m_dDstEs);
        m_dDstMl0 = m_arMajor[m_eDstEllips] * mlfn(m_dDstE0, m_dDstE1, m_dDstE2, m_dDstE3, m_arLatCenter[m_eDstSystem]);
        m_dDstEsp = m_dDstEs / (1.0 - m_dDstEs);

        if (m_dDstEs < 0.00001)
            m_dDstInd = 1.0;
        else
            m_dDstInd = 0.0;

        InitDatumVar();
    }

    public void InitDatumVar(){
        int iDefFact;
        double dF;

        iDefFact = m_eSrcEllips - m_eDstEllips;
        m_iDeltaX = iDefFact * X_W2B;
        m_iDeltaY = iDefFact * Y_W2B;
        m_iDeltaZ = iDefFact * Z_W2B;

        m_dTemp = m_arMinor[m_eSrcEllips] / m_arMajor[m_eSrcEllips];
        dF = 1.0 - m_dTemp; // flattening
        m_dEsTemp = 1.0 - m_dTemp * m_dTemp; // e2

        m_dDeltaA = m_arMajor[m_eDstEllips] - m_arMajor[m_eSrcEllips]; // output major axis - input major axis
        m_dDeltaF = m_arMinor[m_eSrcEllips] / m_arMajor[m_eSrcEllips] - m_arMinor[m_eDstEllips] / m_arMajor[m_eDstEllips]; // Output Flattening - input flattening
    }

    public PointD Conv(PointD _in ){
        double dInLon, dInLat;
        double dOutLon, dOutLat;
        double dTmX, dTmY;
        PointD _out = new PointD();
        PointD din = new PointD();
        PointD dout = new PointD();
        PointD tm = new PointD();
        if (m_eSrcSystem == GeoSystem.kGeographic){
            din.x = D2R(_in.x);
            din.y = D2R(_in.y);
        }
        else{

            Tm2Geo(_in.x, _in.y,  din);
        }

        if (m_eSrcEllips == m_eDstEllips){

            dout.x = din.x;
            dout.y = din.y;
        }
        else{

            DatumTrans(din.x, din.y, dout);
        }
        if (m_eDstSystem == GeoSystem.kGeographic){

            _out.x = R2D(dout.x);
            _out.y = R2D(dout.y);
    
        }
        else{
            Geo2Tm(dout.x, dout.y, tm);

            _out.x = tm.x;
            _out.y = tm.y;
        }
        return _out;
    }
    public double D2R(double degree){
        return (degree * PI / 180.0);
    }

    public double R2D(double radian){
        return (radian * 180.0 / PI);
    }


    public void Tm2Geo(double x, double y, PointD _point){
        double lon, lat;
        double con; // temporary angles
        double phi; // temporary angles
        double delta_Phi; // difference between longitudes
        long i; // counter variable
        double sin_phi, cos_phi, tan_phi; // sin cos and tangent values
        double c, cs, t, ts, n, r, d, ds; // temporary variables
        double f, h, g, temp; // temporary variables

        if (m_dSrcInd != 0)
        {
            f = Math.exp(x / (m_arMajor[m_eSrcEllips] * m_arScaleFactor[m_eSrcSystem]));
            g = 0.5 * (f - 1.0 / f);
            temp = m_arLatCenter[m_eSrcSystem] + y / (m_arMajor[m_eSrcEllips] * m_arScaleFactor[m_eSrcSystem]);
            h = Math.cos(temp);
            con = Math.sqrt((1.0 - h * h) / (1.0 + g * g));
            lat = asinz(con);//lat = asinz(con);

            if (temp < 0)
                lat *= -1;

            if ((g == 0) && (h == 0))
                lon = m_arLonCenter[m_eSrcSystem];
            else
                lon = Math.atan(g / h) + m_arLonCenter[m_eSrcSystem];
        }

        // TM to LL inverse equations from here

        x -= m_arFalseEasting[m_eSrcSystem];
        y -= m_arFalseNorthing[m_eSrcSystem];

        con = (m_dSrcMl0 + y / m_arScaleFactor[m_eSrcSystem]) / m_arMajor[m_eSrcEllips];
        phi = con;

        i = 0;
        while(true)
        {
            delta_Phi = ((con + m_dSrcE1 * Math.sin(2.0 * phi) - m_dSrcE2 * Math.sin(4.0 * phi) +
                          m_dSrcE3 * Math.sin(6.0 * phi)) / m_dSrcE0) - phi;
            phi = phi + delta_Phi;
            if (Math.abs(delta_Phi) <= EPSLN) break;

            if (i >= max_iter){              
                return;
            }
            i++;
        }

        if (Math.abs(phi) < (Math.PI / 2))
        {
            sin_phi = Math.sin(phi);
            cos_phi = Math.cos(phi);
            tan_phi = Math.tan(phi);
            c = m_dSrcEsp * cos_phi * cos_phi;
            cs = c * c;
            t = tan_phi * tan_phi;
            ts = t * t;
            con = 1.0 - m_dSrcEs * sin_phi * sin_phi;
            n = m_arMajor[m_eSrcEllips] / Math.sqrt(con);
            r = n * (1.0 - m_dSrcEs) / con;
            d = x / (n * m_arScaleFactor[m_eSrcSystem]);
            ds = d * d;
            lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * m_dSrcEsp - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * m_dSrcEsp - 3.0 * cs)));
            lon = m_arLonCenter[m_eSrcSystem] + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * m_dSrcEsp + 24.0 * ts))) / cos_phi);
        }
        else
        {
            lat = Math.PI*0.5 * Math.sin(y);
            lon = m_arLonCenter[m_eSrcSystem];
        }
        _point.x = lon;
        _point.y = lat;
    }

    public void DatumTrans(double dInLon, double dInLat, PointD _dout){//dOutLon, dOutLat
        double dRm, dRn;
        double dDeltaPhi, dDeltaLamda;
        dRm = m_arMajor[m_eSrcEllips] * (1.0-m_dEsTemp) / Math.pow(1.0-m_dEsTemp*Math.sin(dInLat)*Math.sin(dInLat), 1.5);
        dRn = m_arMajor[m_eSrcEllips] / Math.sqrt(1.0 - m_dEsTemp*Math.sin(dInLat)*Math.sin(dInLat));
        dDeltaPhi = ((((-m_iDeltaX*Math.sin(dInLat)*Math.cos(dInLon) - m_iDeltaY*Math.sin(dInLat)*Math.sin(dInLon)) +
                       m_iDeltaZ*Math.cos(dInLat)) + m_dDeltaA*dRn*m_dEsTemp*Math.sin(dInLat)*Math.cos(dInLat)/m_arMajor[m_eSrcEllips]) +
                       m_dDeltaF*(dRm/m_dTemp+dRn*m_dTemp)*Math.sin(dInLat)*Math.cos(dInLat))/dRm;
        dDeltaLamda = (-m_iDeltaX * Math.sin(dInLon) + m_iDeltaY * Math.cos(dInLon)) / (dRn * Math.cos(dInLat));
        _dout.x = dInLon + dDeltaLamda;
        _dout.y = dInLat + dDeltaPhi;
    }

    public void Geo2Tm(double lon, double lat, PointD _point){
        double delta_lon; 
        double sin_phi, cos_phi; 
        double al, als; 
        double b, c, t, tq;
        double con, n, ml; 

        delta_lon = lon - m_arLonCenter[m_eDstSystem];
        sin_phi = Math.sin(lat);
        cos_phi = Math.cos(lat);

        if (m_dDstInd != 0){
            b = cos_phi * Math.sin(delta_lon);
            if ((Math.abs(Math.abs(b) - 1.0)) < 0.0000000001){
                
                return;
            }
        }
        else
        {
            b = 0;
            _point.x = 0.5 * m_arMajor[m_eDstEllips] * m_arScaleFactor[m_eDstSystem] * Math.log((1.0 + b) / (1.0 - b));
            con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1.0 - b * b));
            if (lat < 0){
                con = -con;
                _point.y = m_arMajor[m_eDstEllips] * m_arScaleFactor[m_eDstSystem] * (con - m_arLatCenter[m_eDstSystem]);
            }
        }

        al = cos_phi * delta_lon;
        als = al * al;
        c = m_dDstEsp * cos_phi * cos_phi;
        tq = Math.tan(lat);
        t = tq * tq;
        con = 1.0 - m_dDstEs * sin_phi * sin_phi;
        n = m_arMajor[m_eDstEllips] / Math.sqrt(con);
        ml = m_arMajor[m_eDstEllips] * mlfn(m_dDstE0, m_dDstE1, m_dDstE2, m_dDstE3, lat);

        _point.x = m_arScaleFactor[m_eDstSystem] * n * al * (1.0 + als / 6.0 * (1.0 - t + c + als / 20.0 * (5.0 - 18.0 * t + t * t + 72.0 * c - 58.0 * m_dDstEsp))) + m_arFalseEasting[m_eDstSystem];
        _point.y = m_arScaleFactor[m_eDstSystem] * (ml - m_dDstMl0 + n * tq * (als * (0.5 + als / 24.0 * (5.0 - t + 9.0 * c + 4.0 * c * c + als / 30.0 * (61.0 - 58.0 * t + t * t + 600.0 * c - 330.0 * m_dDstEsp))))) + m_arFalseNorthing[m_eDstSystem];
    }


    public void D2Dms(double dInDecimalDegree, int iOutDegree, int iOutMinute, double dOutSecond){

        double dTmpMinute;

        iOutDegree = (int)dInDecimalDegree;
        dTmpMinute = (dInDecimalDegree - iOutDegree) * 60.0;
        iOutMinute = (int)dTmpMinute;
        dOutSecond = (dTmpMinute - iOutMinute) * 60.0;
        if ((dOutSecond+0.00001) >= 60.0)
        {
            if (iOutMinute == 59)
            {
                iOutDegree++;
                iOutMinute = 0;
                dOutSecond = 0.0;
            }
            else {
                iOutMinute++;
                dOutSecond = 0.0;
            }
        }
    }


    double e0fn(double x)
    {
        return 1.0 - 0.25 * x * (1.0 + x / 16.0 * (3.0 + 1.25 * x));
    }

    double e1fn(double x)
    {
        return 0.375 * x * (1.0 + 0.25 * x * (1.0 + 0.46875 * x));
    }

    double e2fn(double x)
    {
        return 0.05859375 * x * x * (1.0 + 0.75 * x);
    }

    double e3fn(double x)
    {
        return x * x * x * (35.0 / 3072.0);
    }

    double e4fn(double x)
    {
        double con, com;

        con = 1.0 + x;
        com = 1.0 - x;
        return Math.sqrt(Math.pow(con, con) * Math.pow(com, com));
    }

    double mlfn(double e0, double e1, double e2, double e3, double phi){
        return e0 * phi - e1 * Math.sin(2.0 * phi) + e2 * Math.sin(4.0 * phi) - e3 * Math.sin(6.0 * phi);
    }

    double asinz(double value)
    {
        if (Math.abs(value) > 1.0)
            value = (value>0?1:-1);

        return Math.sin(value);
    }


}

