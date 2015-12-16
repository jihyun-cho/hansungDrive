package com.skp.tms.common.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.FileChannel;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;


/**
 * Stream을 이용한 파일복사 코드 스니핏
 */
public class FileUtil {
	
	
	private static Logger logger = Logger.getLogger(FileUtil.class);

	
	/**
	 * Temp 디렉토리 생성
	 * @param dirPath : 생성 경로
	 * @return
	 */
	public static void makeDir(String dirPath){
		File dir = new File(dirPath);
		if(!dir.isDirectory()){
			dir.mkdirs();
		}
	}
	
	
	
	
    /**
	 * Temp 디렉토리 삭제
	 * @param dirPath : 삭제 경로
	 * @return
	 */
	public static void delTempDir(String dirPath){
		File file = new File(dirPath);
		String[] fnameList = file.list();
		int fCnt = fnameList.length;
		String childPath = "";
		for(int i = 0; i < fCnt; i++) {
			childPath = dirPath+"/"+fnameList[i];
			File f = new File(childPath);
		  	if( ! f.isDirectory()) {
		    	f.delete();   //파일이면 바로 삭제
		  	} else {
		  		delTempDir(childPath);
		    }
		}
		
		File f = new File(dirPath);
		f.delete();   //폴더는 맨 나중에 삭제
	}
	
	
	
	/** 단말용 */
	public static String encodeFileToBase64Binary(String fileName)	throws Exception {
 
		File file = new File(fileName);
		byte[] bytes = loadFile(file);
		byte[] encoded = Base64.encodeBase64(bytes);
		String encodedString = new String(encoded);
 
		return encodedString;
	}
	
	
	/** 단말용 */
	private static byte[] loadFile(File file) throws IOException {
	    InputStream is = new FileInputStream(file);
 
	    long length = file.length();
	    byte[] bytes = new byte[(int)length];
	    int offset = 0;
	    int numRead = 0;
	    while (offset < bytes.length  && (numRead=is.read(bytes, offset, bytes.length-offset)) >= 0) {
	        offset += numRead;
	    }
 
	    if (offset < bytes.length) {
	        throw new IOException("Could not completely read file "+file.getName());
	    }
 
	    is.close();
	    return bytes;
	}
	
	
	
	
	/**
	 * source에서 target으로의 파일 복사
	 * @param source
	 * @param target
	 */
	public static void normalCopy(String source, String target) throws Exception {

		// 스트림 선언
		FileInputStream inputStream = null;
		FileOutputStream outputStream = null;

		try {
			// 복사 대상이 되는 파일 생성
			File sourceFile = new File(source);
			
			// 스트림 생성
			inputStream = new FileInputStream(sourceFile);
			outputStream = new FileOutputStream(target);
			int bytesRead = 0;

			// 인풋스트림을 아웃픗스트림에 쓰기
			//byte[] buffer = new byte[1024];
			long length = sourceFile.length();
			byte[] buffer = new byte[(int)length];
			while ((bytesRead = inputStream.read(buffer, 0, 1024)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}
			
		} catch (Exception e) {
			logger.info(e);
		} finally {
			outputStream.close();
			inputStream.close();
		}

	}

	
	
	
	/**
	 * Buffer를 이용한 파일복사 코드 스니핏
	 */
	public void bufferCopy(String source, String target)  throws Exception {
		// 스트림, 버퍼 선언
		FileInputStream inputStream = null;
		FileOutputStream outputStream = null;
		BufferedInputStream bin = null;
		BufferedOutputStream bout = null;

		try {
			// 복사 대상이 되는 파일 생성
			File sourceFile = new File(source);

			// 스트림 생성
			inputStream = new FileInputStream(sourceFile);
			outputStream = new FileOutputStream(target);

			// 버퍼 생성
			bin = new BufferedInputStream(inputStream);
			bout = new BufferedOutputStream(outputStream);

			// 버퍼를 통한 스트림 쓰기
			int bytesRead = 0;
			//byte[] buffer = new byte[1024];
			long length = sourceFile.length();
			byte[] buffer = new byte[(int)length];

			while ((bytesRead = bin.read(buffer, 0, 1024)) != -1) {
				bout.write(buffer, 0, bytesRead);
			}

		} catch (Exception e) {
			logger.info(e);
		} finally {
			outputStream.close();
			inputStream.close();
			bin.close();
			bout.close();
		}

	}
	
	
	

	/**
	 * NIO Channel을 이용한 파일복사 코드 스니핏
	 */
	public static void channelCopy(String source, String target) throws Exception {

		// 스트림, 채널 선언
		FileInputStream inputStream = null;
		FileOutputStream outputStream = null;
		FileChannel fcin = null;
		FileChannel fcout = null;

		try {
			// 복사 대상이 되는 파일 생성
			File sourceFile = new File(source);
			
			// 스트림 생성
			inputStream = new FileInputStream(sourceFile);
			outputStream = new FileOutputStream(target);

			// 채널 생성
			fcin = inputStream.getChannel();
			fcout = outputStream.getChannel();

			// 채널을 통한 스트림 전송
			long size = fcin.size();
			fcin.transferTo(0, size, fcout);

		} catch (Exception e) {
			logger.info(e);
		} finally {
			fcout.close();
			fcin.close();
			outputStream.close();
			inputStream.close();
		}

	}

}