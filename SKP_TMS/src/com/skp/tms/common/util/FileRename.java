package com.skp.tms.common.util;

import java.io.File;
import java.io.IOException;

import com.oreilly.servlet.multipart.FileRenamePolicy;



/**
 * Desc     :  업로드 파일명+현재시간+.ext 로 파일명을 저장한다. 
 */
public class FileRename  implements FileRenamePolicy  {   
   
	
	public FileRename(){};
	
	public File rename(File f) {   
    	 
          String suffix = f.getName().substring( f.getName().lastIndexOf(".")+1).toLowerCase();
          String ff = f.getName().replace("."+suffix , "");
             
          String uniqueFileName = null;
          try{
        	  uniqueFileName =  ff + DateUtil.getDate("yyyyMMddHHmmss", 1, 0);
          } catch (Exception e) {
        	  e.printStackTrace();
		  }
  
          String name = f.getName();   
          String body = null;   
          String ext = null;   
  
          int dot = name.lastIndexOf(".");   
          if (dot != -1) {   
               body = name.substring(0, dot);   
               ext = name.substring(dot);  // includes "."   
          } else {   
               body = name;   
               ext = "";   
          }   
       
          String tempName = uniqueFileName + ext;   
          f = new File(f.getParent(), tempName);   
          if (createNewFile(f)) {   
               return f;   
          }   
  
          int count = 0;   
          while (!createNewFile(f) && count < 9999) {   
               count++;   
               String newName = uniqueFileName + "_" + count + ext;   
               f = new File(f.getParent(), newName);   
          }   
  
          return f;   
     }   
  
     private boolean createNewFile(File f) {   
          try {   
               return f.createNewFile();   
          }   
          catch (IOException ignored) {   
               return false;   
          }   
     }   
}

