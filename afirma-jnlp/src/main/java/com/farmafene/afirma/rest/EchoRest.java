/*
 * Copyright (c) 2009-2015 farmafene.com
 * All rights reserved.
 * 
 * Permission is hereby granted, free  of charge, to any person obtaining
 * a  copy  of this  software  and  associated  documentation files  (the
 * "Software"), to  deal in  the Software without  restriction, including
 * without limitation  the rights to  use, copy, modify,  merge, publish,
 * distribute,  sublicense, and/or sell  copies of  the Software,  and to
 * permit persons to whom the Software  is furnished to do so, subject to
 * the following conditions:
 * 
 * The  above  copyright  notice  and  this permission  notice  shall  be
 * included in all copies or substantial portions of the Software.
 * 
 * THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 * EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 * MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package com.farmafene.afirma.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.PrivilegedActionException;
import java.security.cert.CertificateEncodingException;
import java.util.concurrent.Executors;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.farmafene.afirma.Main;
import com.farmafene.afirma.dto.CoSignMessageRequest;
import com.farmafene.afirma.dto.CoSignMessageResponse;
import com.farmafene.afirma.dto.CounterSignMessageRequest;
import com.farmafene.afirma.dto.CounterSignMessageResponse;
import com.farmafene.afirma.dto.EchoMsg;
import com.farmafene.afirma.dto.GetFileNameContentBase64MessageRequest;
import com.farmafene.afirma.dto.GetFileNameContentBase64MessageResponse;
import com.farmafene.afirma.dto.GetMultiFileNameContentBase64MessageRequest;
import com.farmafene.afirma.dto.GetMultiFileNameContentBase64MessageResponse;
import com.farmafene.afirma.dto.SaveDataToFileMessageRequest;
import com.farmafene.afirma.dto.SaveDataToFileMessageResponse;
import com.farmafene.afirma.dto.SetStickySignatoryMessageRequest;
import com.farmafene.afirma.dto.SetStickySignatoryMessageResponse;
import com.farmafene.afirma.dto.SignMessageRequest;
import com.farmafene.afirma.dto.SignMessageResponse;

import es.gob.afirma.core.AOException;
import es.gob.afirma.miniapplet.MiniAfirmaWrapper;

@Path("/afirma")
public class EchoRest {

	private MiniAfirmaWrapper wrapper;

	@GET
	@Path("test")
	@Produces(MediaType.APPLICATION_JSON)
	public EchoMsg test() {
		EchoMsg m = new EchoMsg();
		m.setIn("In");
		m.setOut("!out");
		return m;
	}

	@GET
	@Path("open")
	@Produces(MediaType.APPLICATION_JSON)
	public EchoMsg open() {
		EchoMsg m = new EchoMsg();
		m.setIn("In");
		m.setOut("!out");
		Executors.newSingleThreadExecutor().execute(new Runnable() {
			@Override
			public void run() {
				Main.item.doClick();
			}
		});
		return m;
	}

	/**
	 * 
	 * @param msg
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#sign(java.lang.String,java.lang.String,
	 *      java.lang.String)
	 */
	@POST
	@Path("sign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SignMessageResponse sign(SignMessageRequest msg) {
		SignMessageResponse response = new SignMessageResponse();
		try {
			response.setMsg(wrapper.sign(msg.getAlgorithm(), msg.getFormat(),
					msg.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#setStickySignatory(boolean)
	 */
	@POST
	@Path("setStickySignatory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SetStickySignatoryMessageResponse setStickySignatory(
			SetStickySignatoryMessageRequest request) {
		SetStickySignatoryMessageResponse response = new SetStickySignatoryMessageResponse();
		try {
			wrapper.setStickySignatory(request.getSticky());
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#coSign(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("coSign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public CoSignMessageResponse coSign(CoSignMessageRequest request) {
		CoSignMessageResponse response = new CoSignMessageResponse();
		try {
			response.setMsg(wrapper.coSign(request.getData(),
					request.getAlgorithm(), request.getFormat(),
					request.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#counterSign(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@POST
	@Path("counterSign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public CounterSignMessageResponse counterSign(
			CounterSignMessageRequest request) {
		CounterSignMessageResponse response = new CounterSignMessageResponse();
		try {
			response.setMsg(wrapper.counterSign(request.getAlgorithm(),
					request.getFormat(), request.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#saveDataToFile(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("saveDataToFile")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SaveDataToFileMessageResponse saveDataToFile(
			SaveDataToFileMessageRequest request) {
		SaveDataToFileMessageResponse response = new SaveDataToFileMessageResponse();
		try {
			response.setMsg(wrapper.saveDataToFile(request.getTitle(),
					request.getFileName(), request.getExtension(),
					request.getDescription()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getFileNameContentBase64(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("getFileNameContentBase64")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public GetFileNameContentBase64MessageResponse getFileNameContentBase64(
			GetFileNameContentBase64MessageRequest request) {
		GetFileNameContentBase64MessageResponse response = new GetFileNameContentBase64MessageResponse();
		try {
			response.setMsg(wrapper.getFileNameContentBase64(
					request.getTitle(), request.getExtensions(),
					request.getDescription(), request.getFilePath()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * 
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getMultiFileNameContentBase64(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("getMultiFileNameContentBase64")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public GetMultiFileNameContentBase64MessageResponse getMultiFileNameContentBase64(
			GetMultiFileNameContentBase64MessageRequest request) {
		GetMultiFileNameContentBase64MessageResponse response = new GetMultiFileNameContentBase64MessageResponse();
		try {
			response.setMsgs(wrapper.getMultiFileNameContentBase64(
					request.getTitle(), request.getExtensions(),
					request.getDescription(), request.getFilePath()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
=======
	 * @param algorithm
	 * @param format
	 * @param extraParams
	 * @return
	 * @throws PrivilegedActionException
	 * @throws IOException
	 * @throws AOException
	 * @throws CertificateEncodingException
	 * @throws IncompatiblePolicyException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#sign(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@POST
	@Path("sign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SignMessageResponse sign(SignMessageRequest msg) {
		SignMessageResponse response = new SignMessageResponse();
		try {
			response.setMsg(wrapper.sign(msg.getAlgorithm(), msg.getFormat(),
					msg.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param sticky
	 * @see es.gob.afirma.miniapplet.MiniAfirma#setStickySignatory(boolean)
	 */
	@POST
	@Path("setStickySignatory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SetStickySignatoryMessageResponse setStickySignatory(
			SetStickySignatoryMessageRequest request) {
		SetStickySignatoryMessageResponse response = new SetStickySignatoryMessageResponse();
		try {
			wrapper.setStickySignatory(request.getSticky());
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param data
	 * @param algorithm
	 * @param format
	 * @param extraParams
	 * @return
	 * @throws PrivilegedActionException
	 * @throws IOException
	 * @throws AOException
	 * @throws CertificateEncodingException
	 * @throws IncompatiblePolicyException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#coSign(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("coSign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public CoSignMessageResponse coSign(CoSignMessageRequest request) {
		CoSignMessageResponse response = new CoSignMessageResponse();
		try {
			response.setMsg(wrapper.coSign(request.getData(),
					request.getAlgorithm(), request.getFormat(),
					request.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param algorithm
	 * @param format
	 * @param extraParams
	 * @return
	 * @throws PrivilegedActionException
	 * @throws IOException
	 * @throws AOException
	 * @throws CertificateEncodingException
	 * @throws IncompatiblePolicyException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#counterSign(java.lang.String,
	 *      java.lang.String, java.lang.String)
	 */
	@POST
	@Path("counterSign")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public CounterSignMessageResponse counterSign(
			CounterSignMessageRequest request) {
		CounterSignMessageResponse response = new CounterSignMessageResponse();
		try {
			response.setMsg(wrapper.counterSign(request.getAlgorithm(),
					request.getFormat(), request.getExtraParams()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param title
	 * @param fileName
	 * @param extension
	 * @param description
	 * @return
	 * @throws PrivilegedActionException
	 * @throws IOException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#saveDataToFile(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("saveDataToFile")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SaveDataToFileMessageResponse saveDataToFile(
			SaveDataToFileMessageRequest request){
		SaveDataToFileMessageResponse response = new SaveDataToFileMessageResponse();
		try {
			response.setMsg(wrapper.saveDataToFile(request.getTitle(),
					request.getFileName(), request.getExtension(),
					request.getDescription()));
		} catch (Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param title
	 * @param extensions
	 * @param description
	 * @param filePath
	 * @return
	 * @throws IOException
	 * @throws PrivilegedActionException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getFileNameContentBase64(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	public String getFileNameContentBase64(String title, String extensions,
			String description, String filePath) throws IOException,
			PrivilegedActionException {
		return wrapper.getFileNameContentBase64(title, extensions, description,
				filePath);
	}

	/**
	 * @param title
	 * @param extensions
	 * @param description
	 * @param filePath
	 * @return
	 * @throws IOException
	 * @throws PrivilegedActionException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getMultiFileNameContentBase64(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	public String[] getMultiFileNameContentBase64(String title,
			String extensions, String description, String filePath)
			throws IOException, PrivilegedActionException {
		return wrapper.getMultiFileNameContentBase64(title, extensions,
				description, filePath);
>>>>>>> branch 'development' of https://github.com/venanciolm/afirma-ui-miniapplet_x_x.git
	}

	/**
	 * @param data
	 * @param charset
	 * @return
	 * @throws IOException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getTextFromBase64(java.lang.String,
	 *      java.lang.String)
	 */
	public String getTextFromBase64(String data, String charset)
			throws IOException {
		return wrapper.getTextFromBase64(data, charset);
	}

	/**
	 * @param plainText
	 * @param charset
	 * @return
	 * @throws UnsupportedEncodingException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getBase64FromText(java.lang.String,
	 *      java.lang.String)
	 */
	public String getBase64FromText(String plainText, String charset)
			throws UnsupportedEncodingException {
		return wrapper.getBase64FromText(plainText, charset);
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getErrorMessage()
	 */
	public String getErrorMessage() {
		return wrapper.getErrorMessage();
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getErrorType()
	 */
	public String getErrorType() {
		return wrapper.getErrorType();
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#echo()
	 */
	public String echo() {
		return wrapper.echo();
	}

	/**
	 * @return
	 * @throws IOException
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getRemainingData()
	 */
	public String getRemainingData() throws IOException {
		return wrapper.getRemainingData();
	}

	/**
	 * @param data
	 * @see es.gob.afirma.miniapplet.MiniAfirma#addData(java.lang.String)
	 */
	public void addData(String data) {
		wrapper.addData(data);
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getCurrentLog()
	 */
	public String getCurrentLog() {
		return wrapper.getCurrentLog();
	}
}
