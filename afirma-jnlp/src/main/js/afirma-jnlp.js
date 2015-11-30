/*
//success : function( Anything response,String textStatus, jqXHR jqXHR)
//error : function(jqXHR jqXHR,String textStatus, String errorThrown)
//beforeSend : function(jqXHR jqXHR, PlainObject settings) {
//complete : function(jqXHR jqXHR,String textStatus) {
 */
//
//
// JAVAScript client
// 
var AfirmaClient = function() {
	this._command;
	this._successCallback;
	this._errorCallback;
	this._beforeSendCallback;
	this._completeCallback;
	this._server = "https://localhost:9999/afirma/";
	this.BUFFER_SIZE = 1024 * 1024;
	this.EOF = "%%EOF%%";
	this._data;
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
	this._invoker(this._command, parameters, this._successCallback,
			this._errorCallback, this._beforeSendCallback,
			this._completeCallback);
}
AfirmaClient.prototype.getData = function() {
	return this._data;
}
AfirmaClient.prototype.setData = function(/* string */data) {
	this._data = data;
}
AfirmaClient.prototype.sign = function(/* String */base64,/* Any */parameters) {
	var client = this;
	var responseErrorCallback = function(/* jqXHR */jqXHR,/* String */
	textStatus,/* String */errorThrown) {
		if (client._errorCallback) {
			client._errorCallback(jqXHR, textStatus, errorThrown);
		}
		if (client._completeCallback) {
			client._completeCallback(jqXHR, textStatus);
		}

	};
	if (base64) {
		client.setData(base64);
		var responseCallback = function( /* Any */response,/* String */
		textStatus, /* jqXHR */jqXHR) {
			if (client.getData() && client.getData().length > 0) {
				client.sign(client.getData(), parameters);
			} else {
				client.sign(undefined, parameters);
			}
		};
		var msgRequest;
		if (client.BUFFER_SIZE < client.getData().length) {
			msgRequest = client.getData().substring(0, client.BUFFER_SIZE);
			client.setData(client.getData().substring(client.BUFFER_SIZE));
		} else {
			msgRequest = client.getData();
			client.setData("");
		}
		var parametersCarga = {
			data : msgRequest
		};
		client._invoker("addData", parametersCarga, responseCallback,
				responseErrorCallback, client._beforeSendCallback, undefined);
	} else {
		client.setData("");
		var responseCallback = function( /* Any */response,/* String */
		textStatus, /* jqXHR */jqXHR) {
			if (client.EOF != response.msg) {
				client._data += response.msg;
				client._invoker("getRemainingData", undefined,
						responseCallback, client._errorCallback,
						client._beforeSendCallback, undefined);
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
		};
		client._invoker("sign", parameters, responseCallback,
				responseErrorCallback, client._beforeSendCallback, undefined);
	}
}
