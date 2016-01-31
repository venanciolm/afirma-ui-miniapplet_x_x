/*
 * //success : function( Anything response,String textStatus, jqXHR jqXHR)
 * //error : function(jqXHR jqXHR,String textStatus, String errorThrown)
 * //beforeSend : function(jqXHR jqXHR, PlainObject settings) {
 * //complete : function(jqXHR jqXHR,String textStatus) {
 */
InvokerObserver = function() {
}
InvokerObserver.constructor = InvokerObserver;
InvokerObserver.prototype.toString = function() {
	return "InvokerObserver";
}
InvokerObserver.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
}

InvokerAfirmaClient = function() {
	this._server = "https://localhost:9999/afirma/";
	this._invoker = function(/* String */command, /* Any */parameters,
			successCallback, errorCallback, beforeSendCallback,
			completeCallback) {
		var urlCommand = this._server + command;
		$.ajax({
			data : JSON.stringify(parameters, undefined, 2),
			url : urlCommand,
			type : 'POST',
			contentType : 'application/json',
			crossOrigin : true,
			dataType : 'json',
			beforeSend : function(/* jqXHR */jqXHR, /* PlainObject */
			settings) {
				if (beforeSendCallback) {
					beforeSendCallback(/* jqXHR */jqXHR, /* PlainObject */
					settings)
				}
			},
			complete : function( /* jqXHR */jqXHR, /* String */
			textStatus) {
				if (completeCallback) {
					completeCallback( /* jqXHR */jqXHR, /* String */
					textStatus)
				}
			},
			success : function(/* Anything */response, /* String */
			textStatus, /* jqXHR */jqXHR) {
				if (response.error == 0) {
					if (successCallback) {
						successCallback(/* Anything */response, /* String */
						textStatus, /* jqXHR */
						jqXHR);
					}
				} else {
					if (errorCallback) {
						errorCallback(/* jqXHR */jqXHR,/* String */
						textStatus,/* String */
						response.descError);
					}
				}
			},
			error : function(/* jqXHR */jqXHR,/* String */textStatus,/* String */
			errorThrown) {
				if (errorCallback) {
					errorCallback(/* jqXHR */jqXHR,/* String */textStatus,/* String */
					errorThrown);
				}
			}
		});
	};
}
InvokerAfirmaClient.constructor = InvokerAfirmaClient;
InvokerAfirmaClient.prototype = new InvokerObserver();
InvokerAfirmaClient.prototype.toString = function() {
	return "InvokerAfirmaClient";
}
InvokerAfirmaClient.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	this._invoker(/* String */command, /* Any */parameters, successCallback,
			errorCallback, beforeSendCallback, completeCallback);
}
//
//
//
// PreInvoker!
//
PreInvokerAfirmaClient = function(invokerSubject) {
	this._invoker = new InvokerAfirmaClient();
	this._subject = invokerSubject;
}
PreInvokerAfirmaClient.constructor = PreInvokerAfirmaClient;
PreInvokerAfirmaClient.prototype = new InvokerObserver();
PreInvokerAfirmaClient.prototype.toString = function() {
	return "PreInvokerAfirmaClient";
}
PreInvokerAfirmaClient.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	var invoker = this;
	var p_success = function(/* Any */response,/* String */textStatus,/* jqXHR */
	jqXHR) {
		invoker._subject.remove(invoker);
		invoker._subject.register(invoker._invoker);
		invoker._invoker.invoke(/* String */command, /* Any */
		parameters, successCallback, errorCallback, beforeSendCallback,
				completeCallback);
	}
	var p_error = function(/* jqXHR */jqXHR,/* String */textStatus, /* String */
	errorThrown) {
		if (errorCallback) {
			errorCallback(jqXHR, textStatus, errorThrown);
		}
		if (completeCallback) {
			completeCallback(jqXHR, textStatus);
		}
	}
	// beforeSend : function(jqXHR jqXHR, PlainObject settings);
	p_beforeSend = beforeSendCallback;
	// complete : function(jqXHR jqXHR,String textStatus);
	p_complete = undefined;
	var echoParams = undefined;
	this._invoker.invoke(/* String */"echo", /* Any */
	echoParams, p_success, p_error, p_beforeSend, p_complete);
}
//
//
//
// Manejador del cliente
//
var InvokerSubject = function() {
	this._observers = [];
}
InvokerSubject.constructor = InvokerSubject;
InvokerSubject.prototype.toString = function() {
	return "InvokerSubject={with " + this._observers.length + " observers}";
}
InvokerSubject.prototype.register = function(observer) {
	this._observers.push(observer);
}
InvokerSubject.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	for (i = 0; i < this._observers.length; i++) {
		this._observers[i].invoke(/* String */command, /* Any */parameters,
				successCallback, errorCallback, beforeSendCallback,
				completeCallback);
	}
}
InvokerSubject.prototype.remove = function(observer) {
	for (i = 0; i < this._observers.length; i++) {
		if (this._observers[i] === observer) {
			this._observers.splice(i, 1);
			break;
		}
	}
}
//
//
// JavaScript client
// 
var AfirmaClient = function(/* AfirmaClient */parent) {
	this._command;
	this._invoker;
	this._successCallback;
	this._errorCallback;
	this._beforeSendCallback;
	this._completeCallback;
	this.BUFFER_SIZE = 1024 * 1024;
	this.B64_BUFFER_SIZE = this.BUFFER_SIZE * 3 / 4;
	this.EOF = "%%EOF%%";
	this._data;
	this._pemCertificate;
	this._root = parent;
	var root = this._root;
	while (root) {
		this._root = root;
		root = root._root;
	}
	if (this._root) {
		this._invoker = this._root._invoker;
	} else {
		this._invoker = new InvokerSubject();
		this._invoker.register(new PreInvokerAfirmaClient(this._invoker));
	}
	if (parent) {
		this._successCallback = parent._successCallback;
		this._errorCallback = parent._errorCallback;
		this._beforeSendCallback = parent._beforeSendCallback;
		this._completeCallback = parent._completeCallback;
	}
}
AfirmaClient.constructor = AfirmaClient;
AfirmaClient.prototype.setServer = function(/* String */serverBaseUrl) {
	this._server = serverBaseUrl;
}
AfirmaClient.prototype.getFinalSuccessCallback = function() {
	if (this._root) {
		return this._root._successCallback;
	} else {
		return this._successCallback;
	}
}
AfirmaClient.prototype.setSuccessCallback = function(callback) {
	this._successCallback = callback;
}
AfirmaClient.prototype.getFinalErrorCallback = function() {
	if (this._root) {
		return this._root._errorCallback;
	} else {
		return this._errorCallback;
	}
}
AfirmaClient.prototype.setErrorCallback = function(callback) {
	this._errorCallback = callback;
}
AfirmaClient.prototype.getFinalBeforeSendCallback = function() {
	if (this._root) {
		return this._root._beforeSendCallback;
	} else {
		return this._beforeSendCallback;
	}
}
AfirmaClient.prototype.setBeforeSendCallback = function(callback) {
	this._beforeSendCallback = callback;
}
AfirmaClient.prototype.getFinalCompleteCallback = function() {
	if (this._root) {
		return this._root._completeCallback;
	} else {
		return this._completeCallback;
	}
}
AfirmaClient.prototype.setCompleteCallback = function(callback) {
	this._completeCallback = callback;
}
AfirmaClient.prototype.setCommand = function(/* String */command) {
	this._command = command;
}
AfirmaClient.prototype.invoke = function( /* Any */parameters) {
	this._invoker.invoke(/* String */this._command, /* Any */
	parameters, this._successCallback, this._errorCallback,
			this._beforeSendCallback, this._completeCallback)
}
AfirmaClient.prototype.getData = function() {
	return this._data;
}
AfirmaClient.prototype.getPemCertificate = function() {
	return this._pemCertificate;
}
AfirmaClient.prototype.setData = function(/* string */data) {
	this._data = data;
}
AfirmaClient.prototype.addData = function(/* string */data) {
	this._data = this._data + data;
}
AfirmaClient.prototype.echo = function() {
	var client = this;
	var cEcho = new AfirmaClient(this);
	cEcho.setCommand("echo");
	cEcho.invoke(undefined);
}
AfirmaClient.prototype.getWrappedErrorCallback = function() {
	var client = this;
	return function(/* jqXHR */jqXHR,/* String */
	textStatus,/* String */errorThrown) {
		if (client._errorCallback) {
			client._errorCallback(jqXHR, textStatus, errorThrown);
		}
		if (client._completeCallback) {
			client._completeCallback(jqXHR, textStatus);
		}
	}
}
AfirmaClient.prototype.signMsg = function(/* String */textPlain,/* Any */
parameters,/* String */charset) {
	if (!textPlain) {
		return;
	}
	var client = this;
	var cBase64 = new AfirmaClient(this);
	cBase64.setErrorCallback(client.getWrappedErrorCallback());
	cBase64.setCompleteCallback(undefined);
	cBase64.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		client.signBase64(response.msg, parameters);
	});
	var item = new Object();
	item.plainText = textPlain;
	item.charset = charset;
	cBase64.setCommand("getBase64FromText");
	cBase64.invoke(item);
}
AfirmaClient.prototype.signBase64 = function(/* String */base64,/* Any */
parameters) {
	if (!base64) {
		return;
	}
	var client = this;
	var cAddData = new AfirmaClient(this);
	client.setData(base64);
	cAddData.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		if (client.getData() && client.getData().length > 0) {
			client.signBase64(client.getData(), parameters);
		} else {
			client.sign(parameters);
		}
	});
	cAddData.setErrorCallback(client.getWrappedErrorCallback());
	cAddData.setBeforeSendCallback(client._beforeSendCallback);
	cAddData.setCompleteCallback(undefined);
	var msgRequest;
	if (client.BUFFER_SIZE < client.getData().length) {
		msgRequest = client.getData().substring(0, client.BUFFER_SIZE);
		client.setData(client.getData().substring(client.BUFFER_SIZE));
	} else {
		msgRequest = client.getData();
		client.setData("");
	}
	var parametersCarga = new Object();
	parametersCarga.data = msgRequest;
	cAddData.setCommand("addData");
	cAddData.invoke(parametersCarga);
}
AfirmaClient.prototype.sign = function(/* Any */parameters) {
	var client = this;
	var cSign = new AfirmaClient(this);
	client.setData("");
	cSign.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		if (client.EOF != response.msg && 0 == response.error) {
			client._data += response.msg;
			response.msg = null;
			cRemaining = new AfirmaClient(cSign);
			cRemaining.setErrorCallback(client.getWrappedErrorCallback());
			cRemaining.setBeforeSendCallback(undefined);
			cRemaining.setCompleteCallback(undefined);
			cRemaining.setCommand("getRemainingData");
			cRemaining.invoke(undefined);
		} else if (0 != response.error) {
			client.setData("");
			if (client._successCallback) {
				client._successCallback(response, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		} else {
			var dataB64 = client._data;
			client.setData("");
			var items = dataB64.split("|");
			if (items.length == 2) {
				response.msg = items[1];
				response.pemCertificate = items[0];
			} else {
				response.msg = items[0];
			}
			if (client._successCallback) {
				client._successCallback(response, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		}
	});
	cSign.setErrorCallback(client.getWrappedErrorCallback());
	cSign.setBeforeSendCallback(client._beforeSendCallback);
	cSign.setCompleteCallback(undefined);
	cSign.setCommand("sign");
	cSign.invoke(parameters);
}
AfirmaClient.prototype.getFileNameContentBase64 = function(/* Any */parameters) {
	var client = this;
	var cFile = new AfirmaClient(this);
	client.setData("");
	cFile.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		if (client.EOF != response.msg && 0 == response.error) {
			client._data += response.msg;
			response.msg = null;
			cRemaining = new AfirmaClient(cFile);
			cRemaining.setCommand("getRemainingData");
			cRemaining.setSuccessCallback(cFile._successCallback);
			cRemaining.setErrorCallback(client.getWrappedErrorCallback());
			cRemaining.setBeforeSendCallback(client._beforeSendCallback);
			cRemaining.setCompleteCallback(undefined);
			cRemaining.invoke(undefined);
		} else if (0 != response.error) {
			client.setData("");
			if (client._successCallback) {
				client._successCallback(response, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		} else {
			var dataB64 = client._data;
			client.setData("");
			var items = dataB64.split("|");
			if (items.length == 2) {
				response.msg = items[1];
				response.fileName = items[0];
			} else {
				response.msg = items[0];
			}
			if (client._successCallback) {
				client._successCallback(response, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		}
	});
	cFile.setErrorCallback(client.getWrappedErrorCallback());
	cFile.setBeforeSendCallback(client._beforeSendCallback);
	cFile.setCompleteCallback(undefined);
	cFile.setCommand("getFileNameContentBase64");
	cFile.invoke(parameters);
}
AfirmaClient.prototype.getTextFromBase64 = function(/* Any */parameters) {
	var client = this;
	var textResponse = new Object();
	textResponse.error = 0;
	textResponse.descError = "";
	textResponse.time = "";
	textResponse.id = -1;
	textResponse.msg = "";
	var jqXHR = undefined;
	if (!(parameters && parameters.data && parameters.data.length > 0)) {
		textResponse.error = -1;
		textResponse.descError = "No data!";
		if (client._errorCallback) {
			client._errorCallback(textResponse, textResponse.descError, jqXHR);
		}
		if (client._completeCallback) {
			client._completeCallback(jqXHR, textResponse.descError);
		}
		return;
	}
	var cB64 = new AfirmaClient(this);
	cB64.setData(parameters.data);
	cB64.setErrorCallback(client.getWrappedErrorCallback());
	cB64.setBeforeSendCallback(client._beforeSendCallback);
	cB64.setCompleteCallback(undefined);
	cB64.setCommand("getTextFromBase64");
	cB64.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		textResponse.error = response.error;
		textResponse.descError = response.descError;
		textResponse.time = response.time;
		textResponse.id = response.id;
		if (response.msg && response.msg.length > 0 && 0 == response.error) {
			var param = new Object();
			param.charset = parameters.charset;
			if (cB64.getData().length > cB64.BUFFER_SIZE) {
				param.data = cB64.getData().substring(0, cB64.BUFFER_SIZE);
				cB64.setData(cB64.getData().substring(cB64.BUFFER_SIZE));
			} else {
				param.data = cB64.getData();
				cB64.setData("");
			}
			textResponse.error = response.error;
			textResponse.descError = response.descError;
			textResponse.time = response.time;
			textResponse.id = response.id;
			textResponse.msg = textResponse.msg + response.msg;
			if ("" == param.data) {
				if (client._successCallback) {
					client._successCallback(textResponse, textStatus, jqXHR);
				}
				if (client._completeCallback) {
					client._completeCallback(jqXHR, textStatus);
				}
			} else {
				cB64.invoke(param);
			}
		} else if (0 != response.error) {
			client.setData("");
			responseText.msg = "";
			if (client._errorCallback) {
				client._errorCallback(responseText, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		} else {
			textResponse.error = response.error;
			textResponse.descError = response.descError;
			textResponse.time = response.time;
			textResponse.id = response.id;
			textResponse.msg = textResponse.msg + response.msg;
			if (client._successCallback) {
				client._successCallback(textResponse, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		}
	});
	var param = new Object();
	param.charset = parameters.charset;
	if (cB64.getData().length > cB64.BUFFER_SIZE) {
		param.data = cB64.getData().substring(0, cB64.BUFFER_SIZE);
		cB64.setData(cB64.getData().substring(cB64.BUFFER_SIZE));
	} else {
		param.data = cB64.getData();
		cB64.setData("");
	}
	cB64.invoke(param);
}
AfirmaClient.prototype.getBase64FromText = function(/* Any */parameters) {
	var client = this;
	var textResponse = new Object();
	textResponse.error = 0;
	textResponse.descError = "";
	textResponse.time = "";
	textResponse.id = -1;
	textResponse.msg = "";
	var jqXHR = undefined;
	if (!(parameters && parameters.plainText && parameters.plainText.length > 0)) {
		textResponse.error = -1;
		textResponse.descError = "No data!";
		if (client._errorCallback) {
			client._errorCallback(textResponse, textResponse.descError, jqXHR);
		}
		if (client._completeCallback) {
			client._completeCallback(jqXHR, textResponse.descError);
		}
		return;
	}
	var cB64 = new AfirmaClient(this);
	cB64.setData(parameters.plainText);
	cB64.setErrorCallback(client.getWrappedErrorCallback());
	cB64.setBeforeSendCallback(client._beforeSendCallback);
	cB64.setCompleteCallback(undefined);
	cB64.setCommand("getBase64FromText");
	cB64.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		textResponse.error = response.error;
		textResponse.descError = response.descError;
		textResponse.time = response.time;
		textResponse.id = response.id;
		if (response.msg && response.msg.length > 0 && 0 == response.error) {
			var param = new Object();
			param.charset = parameters.charset;
			if (cB64.getData().length > cB64.B64_BUFFER_SIZE) {
				param.data = cB64.getData().substring(0, cB64.B64_BUFFER_SIZE);
				cB64.setData(cB64.getData().substring(cB64.B64_BUFFER_SIZE));
			} else {
				param.data = cB64.getData();
				cB64.setData("");
			}
			textResponse.error = response.error;
			textResponse.descError = response.descError;
			textResponse.time = response.time;
			textResponse.id = response.id;
			textResponse.msg = textResponse.msg + response.msg;
			if ("" == param.data) {
				if (client._successCallback) {
					client._successCallback(textResponse, textStatus, jqXHR);
				}
				if (client._completeCallback) {
					client._completeCallback(jqXHR, textStatus);
				}
			} else {
				cB64.invoke(param);
			}
		} else if (0 != response.error) {
			client.setData("");
			responseText.msg = "";
			if (client._errorCallback) {
				client._errorCallback(responseText, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		} else {
			textResponse.error = response.error;
			textResponse.descError = response.descError;
			textResponse.time = response.time;
			textResponse.id = response.id;
			textResponse.msg = textResponse.msg + response.msg;
			if (client._successCallback) {
				client._successCallback(textResponse, textStatus, jqXHR);
			}
			if (client._completeCallback) {
				client._completeCallback(jqXHR, textStatus);
			}
		}
	});
	var param = new Object();
	param.charset = parameters.charset;
	if (cB64.getData().length > cB64.B64_BUFFER_SIZE) {
		param.data = cB64.getData().substring(0, cB64.B64_BUFFER_SIZE);
		cB64.setData(cB64.getData().substring(cB64.B64_BUFFER_SIZE));
	} else {
		param.data = cB64.getData();
		cB64.setData("");
	}
	cB64.invoke(param);
}

AfirmaClient.prototype.setStickySignatory = function(sticky) {
	var request = new Object();
	request.sticky = sticky;
	var client = this;
	var cSticky = new AfirmaClient(this);
	cSticky.setCommand("setStickySignatory");
	cSticky.invoke(request);
}
