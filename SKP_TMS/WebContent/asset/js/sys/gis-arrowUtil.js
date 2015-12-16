
/**
 * 화살표 만들기
 */
function ArrowUtil() {
	
	this.angle        = 0;
	this.chkDist      = 10;
	
	this.getPointFeature = function(stPnt, enPnt) {
		
		// 좌표계 변환하여 거리를 계산한다.
		var stCxy     = getKatech_epsg3857(stPnt.x, stPnt.y);
		var enCxy     = getKatech_epsg3857(enPnt.x, enPnt.y);
		
		// 두 좌표간 거리계산
		var dist      = Math.sqrt(Math.pow(enCxy.lon - stCxy.lon, 2) + Math.pow(enCxy.lat - stCxy.lat, 2));

		// 거리가 기준거리보다 짧으면 화살표를 그리지 않는다.
		if(dist > this.chkDist) {
			
			var angle = this.getAngle(stCxy, enCxy);
			var w     = this.getWeight();
			var cX    = stCxy.lon + ((enCxy.lon - stCxy.lon) / 2);
			var cY    = stCxy.lat + ((enCxy.lat - stCxy.lat) / 2);
			var cenXy = get3857LonLat_Katech(cX, cY);
			
			// 폴리곤 그리기로 화살표 그리기위해 객체 생성
			var p1    = get3857LonLat_Katech(cX - w, cY - w);
			var p2    = get3857LonLat_Katech(cX + w, cY);
			var p3    = get3857LonLat_Katech(cX - w, cY + w);
			
			// 좌표배열
			var p     = [];
			
			p.push(new Tmap.Geometry.Point(p1.lon, p1.lat));
			p.push(new Tmap.Geometry.Point(p2.lon, p2.lat));
			p.push(new Tmap.Geometry.Point(p3.lon, p3.lat));
			
			// 폴리곤 객체생성
			var ring  = new Tmap.Geometry.LinearRing(p);
			var pCol  = new Tmap.Geometry.Polygon(ring);
			
			pCol.rotate(angle, new Tmap.Geometry.Point(cenXy.lon, cenXy.lat));
			
			// 폴리곤 스타일
			var style = new Object();
			
			style.fillColor   = "#ff0000";
			style.strokeColor = "#ff0000";
			style.strokeWidth = 1;
			
			// vector Feature 생성
			var feat  = new Tmap.Feature.Vector(pCol, null, style);
			
			return feat;
		}
		
		else {
			
			return null;
		}
	};
	
	/**
	 * 포인트 진행각도 계산하기
	 */
	this.getAngle = function(p1, p2) {
		
		var a    = Math.abs(p1.lon - p2.lon);
		var b    = Math.abs(p1.lat - p2.lat);
		var c    = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		var radi = Math.acos(a / c);
		var deg  = Math.round(radi * 180 / Math.PI);
		
		var quad = 0;
		
		// 1, 4분면
		if((p2.lon - p1.lon) >= 0) {			
			
			if((p2.lat - p1.lat) >=0) { quad = 1; }
			else                      { quad = 4; }
		}
		
		// 2, 3분면
		else {
			
			if((p2.lat - p1.lat) > 0) { quad = 2; }
			else                      { quad = 3; }
		}
		
		// 사분면에 따라 각도 계산
		switch(quad) {
		
			case 1 : this.angle = deg; break;
			case 2 : this.angle = 180 - deg; break;
			case 3 : this.angle = 180 + deg; break;
			case 4 : this.angle = 360 - deg; break;
		}
		
		return this.angle;
	};
	
	/**
	 * 화살표 크기 결정하기
	 */
	this.getWeight = function() {
		
		var z = map.getZoom();
		var w = 2 * (20 - z);
		
		return w;
	};
}