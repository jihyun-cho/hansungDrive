/**
 * HashMap 객체 정의
 */
HashMap = function() {
	
    this.initialize();
};

HashMap.prototype = {
		
    oStruct     : null,
    sSize       : 0,    
    
    /**
     * 객체 생성시
     */
    initialize : function() { 
    	
        this.oStruct = {};
        
        return;
    },
    
    /**
     * 내용 전체 삭제
     */
    clear : function() {
    	
        this.oStruct = {};
        this.sSize = 0;
        
        return;
    },
    
    /**
     * key가 있는지 판단
     */
    containsKey : function(sKey) {
    	
        for(var x in this.oStruct) {
        
        	if(x == sKey && this.oStruct[sKey] != undefined) {
        		
        		return true;
        	}
        }
        
        return false;
    },
    
    /**
     * value가 있는지 판단
     */
    containsValue : function (value) {
    	
        for(var prop in this.map) {
        	
            if (this.map[prop] == value) {
            	
            	return true;
            }
        }
        
        return false;
    },
    
    /**
     * key의 collection을 가져옴
     */
    keySet : function() {
    	
        var keySet = new Array();
        
        for(var x in this.oStruct) {
        
        	if (this.oStruct[x] != undefined) {
        		
        		keySet.push(x);
        	}
        }
        
        return keySet;
    },
    
    /**
     * key의 value를 가져옴
     */
    get : function(sKey) {
    	
        if(!this.containsKey(sKey)) {
        	
        	return null;
        }
            
        return this.oStruct[sKey];
    },
    
    /**
     * 값이 있는지 판단
     */
    isEmpty : function() {
    	
        return (this.sSize <= 0) ? true : false;
    },
    
    /**
     * 값을 입력
     */
    put : function(sKey, oObj) {
    	
        oOldObj = null;
        
        if( this.containsKey(sKey) ) {
        	
        	oOldObj = this.get(sKey);
        }
            
        else {
        	
        	this.sSize++;
        }
   
        this.oStruct[sKey] = oObj;

        return oOldObj;
    },
    
    /**
     * 값을 지움
     */
    remove : function(sKey) {
    	
        if(!this.containsKey(sKey)) {
        	
        	return null;
        }
            
        oldObj = this.oStruct[sKey];
        this.oStruct[sKey] = undefined;
        this.sSize--;
        
        return oldObj;
    },
    
    /**
     * 전체 크기
     */
    size : function() {
    	
        return this.sSize;
    },
    
    toString : function() {
    	
        var str = '[';
        
        for(var x in this.oStruct) {
        	
        	str += x+' : '+this.oStruct[x]+',';
        }
            
        str += ']';
        
        return str;
    }
};