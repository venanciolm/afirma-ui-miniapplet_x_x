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

import java.util.concurrent.Executor;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.farmafene.afirma.Main;
import com.farmafene.afirma.dto.AddDataMessageRequest;
import com.farmafene.afirma.dto.AddDataMessageResponse;
import com.farmafene.afirma.dto.CmdMessageResponse;
import com.farmafene.afirma.dto.CoSignMessageRequest;
import com.farmafene.afirma.dto.CoSignMessageResponse;
import com.farmafene.afirma.dto.CounterSignMessageRequest;
import com.farmafene.afirma.dto.CounterSignMessageResponse;
import com.farmafene.afirma.dto.EchoMessageResponse;
import com.farmafene.afirma.dto.GetBase64FromTextMessageRequest;
import com.farmafene.afirma.dto.GetBase64FromTextMessageResponse;
import com.farmafene.afirma.dto.GetCurrentLogMessageResponse;
import com.farmafene.afirma.dto.GetErrorMessageMessageResponse;
import com.farmafene.afirma.dto.GetErrorTypeMessageResponse;
import com.farmafene.afirma.dto.GetFileNameContentBase64MessageRequest;
import com.farmafene.afirma.dto.GetFileNameContentBase64MessageResponse;
import com.farmafene.afirma.dto.GetMultiFileNameContentBase64MessageRequest;
import com.farmafene.afirma.dto.GetMultiFileNameContentBase64MessageResponse;
import com.farmafene.afirma.dto.GetRemainingDataMessageResponse;
import com.farmafene.afirma.dto.GetTextFromBase64MessageRequest;
import com.farmafene.afirma.dto.GetTextFromBase64MessageResponse;
import com.farmafene.afirma.dto.SaveDataToFileMessageRequest;
import com.farmafene.afirma.dto.SaveDataToFileMessageResponse;
import com.farmafene.afirma.dto.SetStickySignatoryMessageRequest;
import com.farmafene.afirma.dto.SetStickySignatoryMessageResponse;
import com.farmafene.afirma.dto.SignMessageRequest;
import com.farmafene.afirma.dto.SignMessageResponse;

import es.gob.afirma.miniapplet.MiniAfirmaWrapper;

@Path("/")
public class AfirmaRest {

	private MiniAfirmaWrapper wrapper;
	private Executor executor;

	public AfirmaRest() {
	}

	@GET
	@Path("exit")
	@Produces(MediaType.APPLICATION_JSON)
	public CmdMessageResponse exit() {
		final CmdMessageResponse m = new CmdMessageResponse();
		m.setCall("exit");
		return m;
	}

	@GET
	@Path("test")
	@Produces(MediaType.APPLICATION_JSON)
	public CmdMessageResponse test() {
		final CmdMessageResponse m = new CmdMessageResponse();
		m.setCall("test");
		return m;
	}

	@GET
	@Path("open")
	@Produces(MediaType.APPLICATION_JSON)
	public CmdMessageResponse open() {
		final CmdMessageResponse m = new CmdMessageResponse();
		m.setCall("open");
		this.executor.execute(new Runnable() {
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
	public SignMessageResponse sign(final SignMessageRequest msg) {
		final SignMessageResponse response = new SignMessageResponse();
		try {
			response.setMsg(this.wrapper.sign(msg.getAlgorithm(), msg.getFormat(), msg.getExtraParams()));
		} catch (final Exception e) {
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
	public SetStickySignatoryMessageResponse setStickySignatory(final SetStickySignatoryMessageRequest request) {
		final SetStickySignatoryMessageResponse response = new SetStickySignatoryMessageResponse();
		try {
			this.wrapper.setStickySignatory(request.getSticky());
		} catch (final Exception e) {
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
	public CoSignMessageResponse coSign(final CoSignMessageRequest request) {
		final CoSignMessageResponse response = new CoSignMessageResponse();
		try {
			response.setMsg(this.wrapper.coSign(request.getData(), request.getAlgorithm(), request.getFormat(), request.getExtraParams()));
		} catch (final Exception e) {
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
	public CounterSignMessageResponse counterSign(final CounterSignMessageRequest request) {
		final CounterSignMessageResponse response = new CounterSignMessageResponse();
		try {
			response.setMsg(this.wrapper.counterSign(request.getAlgorithm(), request.getFormat(), request.getExtraParams()));
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getFileNameContentBase64(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("getFileNameContentBase64")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public GetFileNameContentBase64MessageResponse getFileNameContentBase64(final GetFileNameContentBase64MessageRequest request) {
		final GetFileNameContentBase64MessageResponse response = new GetFileNameContentBase64MessageResponse();
		try {
			response.setMsg(this.wrapper.getFileNameContentBase64(request.getTitle(), request.getExtensions(), request.getDescription(),
					request.getFilePath()));
		} catch (final Exception e) {
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
	public GetMultiFileNameContentBase64MessageResponse getMultiFileNameContentBase64(final GetMultiFileNameContentBase64MessageRequest request) {
		final GetMultiFileNameContentBase64MessageResponse response = new GetMultiFileNameContentBase64MessageResponse();
		try {
			response.setMsgs(this.wrapper.getMultiFileNameContentBase64(request.getTitle(), request.getExtensions(), request.getDescription(),
					request.getFilePath()));
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#saveDataToFile(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String)
	 */
	@POST
	@Path("saveDataToFile")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SaveDataToFileMessageResponse saveDataToFile(final SaveDataToFileMessageRequest request) {
		final SaveDataToFileMessageResponse response = new SaveDataToFileMessageResponse();
		try {
			response.setMsg(this.wrapper.saveDataToFile(request.getTitle(), request.getFileName(), request.getExtension(), request.getDescription()));
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 *
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getTextFromBase64(java.lang.String,
	 *      java.lang.String)
	 */
	@POST
	@Path("getTextFromBase64")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public GetTextFromBase64MessageResponse getTextFromBase64(final GetTextFromBase64MessageRequest request) {
		final GetTextFromBase64MessageResponse response = new GetTextFromBase64MessageResponse();
		try {
			response.setMsg(this.wrapper.getTextFromBase64(request.getData(), request.getCharset()));
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 *
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getBase64FromText(java.lang.String,
	 *      java.lang.String)
	 */
	@POST
	@Path("getBase64FromText")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public GetBase64FromTextMessageResponse getBase64FromText(final GetBase64FromTextMessageRequest request) {
		final GetBase64FromTextMessageResponse response = new GetBase64FromTextMessageResponse();
		try {
			response.setMsg(this.wrapper.getBase64FromText(request.getPlainText(), request.getCharset()));
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getErrorMessage()
	 */
	@GET
	@Path("getErrorMessage")
	@Produces(MediaType.APPLICATION_JSON)
	public GetErrorMessageMessageResponse getErrorMessage() {
		final GetErrorMessageMessageResponse response = new GetErrorMessageMessageResponse();
		try {
			response.setMsg(this.wrapper.getErrorMessage());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getErrorType()
	 */
	@GET
	@Path("getErrorType")
	@Produces(MediaType.APPLICATION_JSON)
	public GetErrorTypeMessageResponse getErrorType() {
		final GetErrorTypeMessageResponse response = new GetErrorTypeMessageResponse();
		try {
			response.setMsg(this.wrapper.getErrorType());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#echo()
	 */
	@GET
	@Path("echo")
	@Produces(MediaType.APPLICATION_JSON)
	public EchoMessageResponse echo() {
		final EchoMessageResponse response = new EchoMessageResponse();
		try {
			response.setMsg(this.wrapper.echo());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 *
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getRemainingData()
	 */
	@GET
	@Path("getRemainingData")
	@Produces(MediaType.APPLICATION_JSON)
	public GetRemainingDataMessageResponse getRemainingData() {
		final GetRemainingDataMessageResponse response = new GetRemainingDataMessageResponse();
		try {
			response.setMsg(this.wrapper.getRemainingData());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 *
	 * @param request
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#addData(java.lang.String)
	 */
	@POST
	@Path("addData")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public AddDataMessageResponse addData(final AddDataMessageRequest request) {
		final AddDataMessageResponse response = new AddDataMessageResponse();
		try {
			this.wrapper.addData(request.getData());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 *
	 * @return
	 * @see es.gob.afirma.miniapplet.MiniAfirma#getCurrentLog()
	 */
	@GET
	@Path("getCurrentLog")
	@Produces(MediaType.APPLICATION_JSON)
	public GetCurrentLogMessageResponse getCurrentLog() {
		final GetCurrentLogMessageResponse response = new GetCurrentLogMessageResponse();
		try {
			response.setMsg(this.wrapper.getCurrentLog());
		} catch (final Exception e) {
			response.setError(1);
			response.setDescError(e);
		}
		return response;
	}

	/**
	 * Devuelve el valor de la propiedad 'wrapper'
	 * @return Propiedad wrapper
	 */
	public MiniAfirmaWrapper getWrapper() {
		return this.wrapper;
	}

	/**
	 * Asigna el valor de la propiedad 'wrapper'
	 * @param wrapper valor que se le quiere dar a la propiedad 'wrapper'
	 */
	public void setWrapper(final MiniAfirmaWrapper wrapper) {
		this.wrapper = wrapper;
	}

	/**
	 * Devuelve el valor de la propiedad 'executor'
	 * @return Propiedad executor
	 */
	public Executor getExecutor() {
		return this.executor;
	}

	/**
	 * Asigna el valor de la propiedad 'executor'
	 * @param executor valor que se le quiere dar a la propiedad 'executor'
	 */
	public void setExecutor(final Executor executor) {
		this.executor = executor;
	}
}
