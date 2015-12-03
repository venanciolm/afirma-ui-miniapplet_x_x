/*
//success : function( Anything response,String textStatus, jqXHR jqXHR)
//error : function(jqXHR jqXHR,String textStatus, String errorThrown)
//beforeSend : function(jqXHR jqXHR, PlainObject settings) {
//complete : function(jqXHR jqXHR,String textStatus) {
 */
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
				if (successCallback) {
					successCallback(/* Anything */response, /* String */
					textStatus, /* jqXHR */
					jqXHR);
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
InvokerAfirmaClient.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	this._invoker(/* String */command, /* Any */parameters, successCallback,
			errorCallback, beforeSendCallback, completeCallback);
}
InvokerAfirmaClient.prototype.toString = function() {
	return "InvokerAfirmaClient";
}
//
//
//
// PreInvoker!
//
PreInvokerAfirmaClient = function(invokerSubject, dummy) {
	this._subject = invokerSubject;
	this._dummy = dummy;
	this._invoker = new InvokerAfirmaClient();
}
PreInvokerAfirmaClient.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	console.log("Llamando a PreInvokerAfirmaClient.invoke(" + parameters + ")");
	this._subject.remove(this);
	this._subject.remove(this._dummy);
	this._subject.register(this._invoker);
	this._invoker.invoke(/* String */command, /* Any */
	parameters, successCallback, errorCallback, beforeSendCallback,
			completeCallback);
}
PreInvokerAfirmaClient.prototype.toString = function() {
	return "PreInvokerAfirmaClient";
}
//
//
//
// Dummy!
//
DummyInvokerAfirmaClient = function() {
}
DummyInvokerAfirmaClient.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	console.log("Llamando a DummyInvokerAfirmaClient.invoke(" + parameters
			+ ")");
}
DummyInvokerAfirmaClient.prototype.toString = function() {
	return "DummyInvokerAfirmaClient";
}
//
//
//
// Manejador del cliente
//
var InvokerSubject = function() {
	this._observers = [];
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
	console.log("Eliminando "+observer);
	for (i = 0; i < this._observers.length; i++) {
		console.log("Comparando ["+i+"]"+this._observers[i]);
		if (this._observers[i] === observer) {
			console.log("Eliminando " + observer);
			this._observers.splice(i, 1);
			break;	
		}
		
	}
	console.log("Saliendo!");
}
//
//
// JavaScript client
// 
var AfirmaClient = function(/* AfirmaClient */parent) {
	this._command;
	this._root = parent;
	this._invoker;
	this._successCallback;
	this._errorCallback;
	this._beforeSendCallback;
	this._completeCallback;
	this.BUFFER_SIZE = 5 * 1024;
	this.EOF = "%%EOF%%";
	this._data;
	var root = this._root;
	while (root) {
		this._root = root;
		root = root._root;
	}
	if (this._root) {
		console.log("Utilizando el invoker del padre!");
		this._invoker = this._root._invoker;
	} else {
		console.log("El padre no existe, creando un invoker nuevo!");
		this._invoker = new InvokerSubject();
		var dummy = new DummyInvokerAfirmaClient();
		this._invoker.register(dummy);
		this._invoker.register(new PreInvokerAfirmaClient(this._invoker,dummy));
	}
}
AfirmaClient.prototype.setServer = function(/* String */serverBaseUrl) {
	this._server = serverBaseUrl;
}
AfirmaClient.prototype.setSuccessCallback = function(callback) {
	this._successCallback = callback;
}
AfirmaClient.prototype.setErrorCallback = function(callback) {
	this._errorCallback = callback;
}
AfirmaClient.prototype.setBeforeSendCallback = function(callback) {
	this._beforeSendCallback = callback;
}
AfirmaClient.prototype.setCompleteCallback = function(callback) {
	this._completeCallback = callback;
}
AfirmaClient.prototype.setCommand = function(/* String */command) {
	this._command = command;
}
AfirmaClient.prototype.invoke = function( /* Any */parameters) {
	console.log("Llamando a AfirmaClient.invoke(" + parameters + ")");
	this._invoker.invoke(/* String */this._command, /* Any */
	parameters, this._successCallback, this._errorCallback,
			this._beforeSendCallback, this._completeCallback)
}
AfirmaClient.prototype.getData = function() {
	return this._data;
}
AfirmaClient.prototype.setData = function(/* string */data) {
	this._data = data;
}
AfirmaClient.prototype.signMsg = function(/* String */textPlain,/* Any */
parameters,/* String */charset) {
	if (!textPlain) {
		return;
	}
	var client = this;
	var cBase64 = new AfirmaClient(this);
	cBase64.setBeforeSendCallback(client._beforeSendCallback);
	cBase64.setErrorCallback(client.getWrappedErrorCallback());
	cBase64.setCompleteCallback(undefined);
	cBase64.setSuccessCallback(function( /* Any */response,/* String */
	textStatus, /* jqXHR */jqXHR) {
		client.signBase64(response.msg, parameters);
	});
	cBase64.setCommand("getBase64FromText");
	var item = {
		plainText : textPlain,
		charset : charset
	};
	cBase64.invoke(item);
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
	cAddData.setCommand("addData");
	var parametersCarga = {
		data : msgRequest
	};
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
			cRemaining = new AfirmaClient(cSign);
			cRemaining.setCommand("getRemainingData");
			cRemaining.setSuccessCallback(cSign._successCallback);
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
			response.msg = client._data;
			client.setData("");
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
