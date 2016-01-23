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
						errorCallback(/* jqXHR */jqXHR,/* String */textStatus,/* String */
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
	this._invoker.invoke(/* String */"echo", /* Any */
	undefined, p_success, p_error, p_beforeSend, p_complete);
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
}
AfirmaClient.constructor = AfirmaClient;
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
	var item = new Object();
	item.plainText = textPlain;
	item.charset = charset;
	cBase64.setCommand("getBase64FromText");
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

//Paul Tero, July 2001
//http://www.tero.co.uk/des/

//Optimised for performance with large blocks by Michael Hayworth, November 2001
//http://www.netdealing.com

//THIS SOFTWARE IS PROVIDED "AS IS" AND
//ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
//FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
//OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
//SUCH DAMAGE.

//des
//this takes the key, the message, and whether to encrypt or decrypt
function des (key, message, encrypt, mode, iv, padding) {
	  //declaring this locally speeds things up a bit
	  var spfunction1 = new Array (0x1010400,0,0x10000,0x1010404,0x1010004,0x10404,0x4,0x10000,0x400,0x1010400,0x1010404,0x400,0x1000404,0x1010004,0x1000000,0x4,0x404,0x1000400,0x1000400,0x10400,0x10400,0x1010000,0x1010000,0x1000404,0x10004,0x1000004,0x1000004,0x10004,0,0x404,0x10404,0x1000000,0x10000,0x1010404,0x4,0x1010000,0x1010400,0x1000000,0x1000000,0x400,0x1010004,0x10000,0x10400,0x1000004,0x400,0x4,0x1000404,0x10404,0x1010404,0x10004,0x1010000,0x1000404,0x1000004,0x404,0x10404,0x1010400,0x404,0x1000400,0x1000400,0,0x10004,0x10400,0,0x1010004);
	  var spfunction2 = new Array (-0x7fef7fe0,-0x7fff8000,0x8000,0x108020,0x100000,0x20,-0x7fefffe0,-0x7fff7fe0,-0x7fffffe0,-0x7fef7fe0,-0x7fef8000,-0x80000000,-0x7fff8000,0x100000,0x20,-0x7fefffe0,0x108000,0x100020,-0x7fff7fe0,0,-0x80000000,0x8000,0x108020,-0x7ff00000,0x100020,-0x7fffffe0,0,0x108000,0x8020,-0x7fef8000,-0x7ff00000,0x8020,0,0x108020,-0x7fefffe0,0x100000,-0x7fff7fe0,-0x7ff00000,-0x7fef8000,0x8000,-0x7ff00000,-0x7fff8000,0x20,-0x7fef7fe0,0x108020,0x20,0x8000,-0x80000000,0x8020,-0x7fef8000,0x100000,-0x7fffffe0,0x100020,-0x7fff7fe0,-0x7fffffe0,0x100020,0x108000,0,-0x7fff8000,0x8020,-0x80000000,-0x7fefffe0,-0x7fef7fe0,0x108000);
	  var spfunction3 = new Array (0x208,0x8020200,0,0x8020008,0x8000200,0,0x20208,0x8000200,0x20008,0x8000008,0x8000008,0x20000,0x8020208,0x20008,0x8020000,0x208,0x8000000,0x8,0x8020200,0x200,0x20200,0x8020000,0x8020008,0x20208,0x8000208,0x20200,0x20000,0x8000208,0x8,0x8020208,0x200,0x8000000,0x8020200,0x8000000,0x20008,0x208,0x20000,0x8020200,0x8000200,0,0x200,0x20008,0x8020208,0x8000200,0x8000008,0x200,0,0x8020008,0x8000208,0x20000,0x8000000,0x8020208,0x8,0x20208,0x20200,0x8000008,0x8020000,0x8000208,0x208,0x8020000,0x20208,0x8,0x8020008,0x20200);
	  var spfunction4 = new Array (0x802001,0x2081,0x2081,0x80,0x802080,0x800081,0x800001,0x2001,0,0x802000,0x802000,0x802081,0x81,0,0x800080,0x800001,0x1,0x2000,0x800000,0x802001,0x80,0x800000,0x2001,0x2080,0x800081,0x1,0x2080,0x800080,0x2000,0x802080,0x802081,0x81,0x800080,0x800001,0x802000,0x802081,0x81,0,0,0x802000,0x2080,0x800080,0x800081,0x1,0x802001,0x2081,0x2081,0x80,0x802081,0x81,0x1,0x2000,0x800001,0x2001,0x802080,0x800081,0x2001,0x2080,0x800000,0x802001,0x80,0x800000,0x2000,0x802080);
	  var spfunction5 = new Array (0x100,0x2080100,0x2080000,0x42000100,0x80000,0x100,0x40000000,0x2080000,0x40080100,0x80000,0x2000100,0x40080100,0x42000100,0x42080000,0x80100,0x40000000,0x2000000,0x40080000,0x40080000,0,0x40000100,0x42080100,0x42080100,0x2000100,0x42080000,0x40000100,0,0x42000000,0x2080100,0x2000000,0x42000000,0x80100,0x80000,0x42000100,0x100,0x2000000,0x40000000,0x2080000,0x42000100,0x40080100,0x2000100,0x40000000,0x42080000,0x2080100,0x40080100,0x100,0x2000000,0x42080000,0x42080100,0x80100,0x42000000,0x42080100,0x2080000,0,0x40080000,0x42000000,0x80100,0x2000100,0x40000100,0x80000,0,0x40080000,0x2080100,0x40000100);
	  var spfunction6 = new Array (0x20000010,0x20400000,0x4000,0x20404010,0x20400000,0x10,0x20404010,0x400000,0x20004000,0x404010,0x400000,0x20000010,0x400010,0x20004000,0x20000000,0x4010,0,0x400010,0x20004010,0x4000,0x404000,0x20004010,0x10,0x20400010,0x20400010,0,0x404010,0x20404000,0x4010,0x404000,0x20404000,0x20000000,0x20004000,0x10,0x20400010,0x404000,0x20404010,0x400000,0x4010,0x20000010,0x400000,0x20004000,0x20000000,0x4010,0x20000010,0x20404010,0x404000,0x20400000,0x404010,0x20404000,0,0x20400010,0x10,0x4000,0x20400000,0x404010,0x4000,0x400010,0x20004010,0,0x20404000,0x20000000,0x400010,0x20004010);
	  var spfunction7 = new Array (0x200000,0x4200002,0x4000802,0,0x800,0x4000802,0x200802,0x4200800,0x4200802,0x200000,0,0x4000002,0x2,0x4000000,0x4200002,0x802,0x4000800,0x200802,0x200002,0x4000800,0x4000002,0x4200000,0x4200800,0x200002,0x4200000,0x800,0x802,0x4200802,0x200800,0x2,0x4000000,0x200800,0x4000000,0x200800,0x200000,0x4000802,0x4000802,0x4200002,0x4200002,0x2,0x200002,0x4000000,0x4000800,0x200000,0x4200800,0x802,0x200802,0x4200800,0x802,0x4000002,0x4200802,0x4200000,0x200800,0,0x2,0x4200802,0,0x200802,0x4200000,0x800,0x4000002,0x4000800,0x800,0x200002);
	  var spfunction8 = new Array (0x10001040,0x1000,0x40000,0x10041040,0x10000000,0x10001040,0x40,0x10000000,0x40040,0x10040000,0x10041040,0x41000,0x10041000,0x41040,0x1000,0x40,0x10040000,0x10000040,0x10001000,0x1040,0x41000,0x40040,0x10040040,0x10041000,0x1040,0,0,0x10040040,0x10000040,0x10001000,0x41040,0x40000,0x41040,0x40000,0x10041000,0x1000,0x40,0x10040040,0x1000,0x41040,0x10001000,0x40,0x10000040,0x10040000,0x10040040,0x10000000,0x40000,0x10001040,0,0x10041040,0x40040,0x10000040,0x10040000,0x10001000,0x10001040,0,0x10041040,0x41000,0x41000,0x1040,0x1040,0x40040,0x10000000,0x10041000);

	  //create the 16 or 48 subkeys we will need
	  var keys = des_createKeys (key);
	  var m=0, i, j, temp, right1, right2, left, right, looping;
	  var cbcleft, cbcleft2, cbcright, cbcright2;
	  var endloop, loopinc;
	  var len = message.length;
	  var chunk = 0;
	  //set up the loops for single and triple des
	  var iterations = keys.length == 32 ? 3 : 9; //single or triple des
	  if (iterations == 3) {looping = encrypt ? new Array (0, 32, 2) : new Array (30, -2, -2);}
	  else {looping = encrypt ? new Array (0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array (94, 62, -2, 32, 64, 2, 30, -2, -2);}

	  //pad the message depending on the padding parameter
	  if (padding == 2) message += "        "; //pad the message with spaces
	  else if (padding == 1) {temp = 8-(len%8); message += String.fromCharCode (temp,temp,temp,temp,temp,temp,temp,temp); if (temp==8) len+=8;} //PKCS7 padding
	  else if (!padding) message += "\0\0\0\0\0\0\0\0"; //pad the message out with null bytes

	  //store the result here
	  result = "";
	  tempresult = "";

	  if (mode == 1) { //CBC mode
	    cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
	    cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
	    m=0;
	  }

	  //loop through each 64 bit chunk of the message
	  while (m < len) {
	    left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
	    right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);

	    //for Cipher Block Chaining mode, xor the message with the previous result
	    if (mode == 1) {if (encrypt) {left ^= cbcleft; right ^= cbcright;} else {cbcleft2 = cbcleft; cbcright2 = cbcright; cbcleft = left; cbcright = right;}}

	    //first each 64 but chunk of the message must be permuted according to IP
	    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
	    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
	    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
	    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
	    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);

	    left = ((left << 1) | (left >>> 31)); 
	    right = ((right << 1) | (right >>> 31)); 

	    //do this either 1 or 3 times for each chunk of the message
	    for (j=0; j<iterations; j+=3) {
	      endloop = looping[j+1];
	      loopinc = looping[j+2];
	      //now go through and perform the encryption or decryption  
	      for (i=looping[j]; i!=endloop; i+=loopinc) { //for efficiency
	        right1 = right ^ keys[i]; 
	        right2 = ((right >>> 4) | (right << 28)) ^ keys[i+1];
	        //the result is attained by passing these bytes through the S selection functions
	        temp = left;
	        left = right;
	        right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]
	              | spfunction6[(right1 >>>  8) & 0x3f] | spfunction8[right1 & 0x3f]
	              | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]
	              | spfunction5[(right2 >>>  8) & 0x3f] | spfunction7[right2 & 0x3f]);
	      }
	      temp = left; left = right; right = temp; //unreverse left and right
	    } //for either 1 or 3 iterations

	    //move then each one bit to the right
	    left = ((left >>> 1) | (left << 31)); 
	    right = ((right >>> 1) | (right << 31)); 

	    //now perform IP-1, which is IP in the opposite direction
	    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
	    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
	    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
	    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
	    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);

	    //for Cipher Block Chaining mode, xor the message with the previous result
	    if (mode == 1) {if (encrypt) {cbcleft = left; cbcright = right;} else {left ^= cbcleft2; right ^= cbcright2;}}
	    tempresult += String.fromCharCode ((left>>>24), ((left>>>16) & 0xff), ((left>>>8) & 0xff), (left & 0xff), (right>>>24), ((right>>>16) & 0xff), ((right>>>8) & 0xff), (right & 0xff));

	    chunk += 8;
	    if (chunk == 512) {result += tempresult; tempresult = ""; chunk = 0;}
	  } //for every 8 characters, or 64 bits in the message

	  //return the result as an array
	  return result + tempresult;
	} //end of des

	//des_createKeys
	//this takes as input a 64 bit key (even though only 56 bits are used)
	//as an array of 2 integers, and returns 16 48 bit keys
	function des_createKeys (key) {
	  //declaring this locally speeds things up a bit
	  pc2bytes0  = new Array (0,0x4,0x20000000,0x20000004,0x10000,0x10004,0x20010000,0x20010004,0x200,0x204,0x20000200,0x20000204,0x10200,0x10204,0x20010200,0x20010204);
	  pc2bytes1  = new Array (0,0x1,0x100000,0x100001,0x4000000,0x4000001,0x4100000,0x4100001,0x100,0x101,0x100100,0x100101,0x4000100,0x4000101,0x4100100,0x4100101);
	  pc2bytes2  = new Array (0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808,0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808);
	  pc2bytes3  = new Array (0,0x200000,0x8000000,0x8200000,0x2000,0x202000,0x8002000,0x8202000,0x20000,0x220000,0x8020000,0x8220000,0x22000,0x222000,0x8022000,0x8222000);
	  pc2bytes4  = new Array (0,0x40000,0x10,0x40010,0,0x40000,0x10,0x40010,0x1000,0x41000,0x1010,0x41010,0x1000,0x41000,0x1010,0x41010);
	  pc2bytes5  = new Array (0,0x400,0x20,0x420,0,0x400,0x20,0x420,0x2000000,0x2000400,0x2000020,0x2000420,0x2000000,0x2000400,0x2000020,0x2000420);
	  pc2bytes6  = new Array (0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002,0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002);
	  pc2bytes7  = new Array (0,0x10000,0x800,0x10800,0x20000000,0x20010000,0x20000800,0x20010800,0x20000,0x30000,0x20800,0x30800,0x20020000,0x20030000,0x20020800,0x20030800);
	  pc2bytes8  = new Array (0,0x40000,0,0x40000,0x2,0x40002,0x2,0x40002,0x2000000,0x2040000,0x2000000,0x2040000,0x2000002,0x2040002,0x2000002,0x2040002);
	  pc2bytes9  = new Array (0,0x10000000,0x8,0x10000008,0,0x10000000,0x8,0x10000008,0x400,0x10000400,0x408,0x10000408,0x400,0x10000400,0x408,0x10000408);
	  pc2bytes10 = new Array (0,0x20,0,0x20,0x100000,0x100020,0x100000,0x100020,0x2000,0x2020,0x2000,0x2020,0x102000,0x102020,0x102000,0x102020);
	  pc2bytes11 = new Array (0,0x1000000,0x200,0x1000200,0x200000,0x1200000,0x200200,0x1200200,0x4000000,0x5000000,0x4000200,0x5000200,0x4200000,0x5200000,0x4200200,0x5200200);
	  pc2bytes12 = new Array (0,0x1000,0x8000000,0x8001000,0x80000,0x81000,0x8080000,0x8081000,0x10,0x1010,0x8000010,0x8001010,0x80010,0x81010,0x8080010,0x8081010);
	  pc2bytes13 = new Array (0,0x4,0x100,0x104,0,0x4,0x100,0x104,0x1,0x5,0x101,0x105,0x1,0x5,0x101,0x105);

	  //how many iterations (1 for des, 3 for triple des)
	  var iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys
	  //stores the return keys
	  var keys = new Array (32 * iterations);
	  //now define the left shifts which need to be done
	  var shifts = new Array (0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
	  //other variables
	  var lefttemp, righttemp, m=0, n=0, temp;

	  for (var j=0; j<iterations; j++) { //either 1 or 3 iterations
	    left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
	    right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);

	    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
	    temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
	    temp = ((left >>> 2) ^ right) & 0x33333333; right ^= temp; left ^= (temp << 2);
	    temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
	    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
	    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
	    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);

	    //the right side needs to be shifted and to get the last four bits of the left side
	    temp = (left << 8) | ((right >>> 20) & 0x000000f0);
	    //left needs to be put upside down
	    left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
	    right = temp;

	    //now go through and perform these shifts on the left and right keys
	    for (var i=0; i < shifts.length; i++) {
	      //shift the keys either one or two bits to the left
	      if (shifts[i]) {left = (left << 2) | (left >>> 26); right = (right << 2) | (right >>> 26);}
	      else {left = (left << 1) | (left >>> 27); right = (right << 1) | (right >>> 27);}
	      left &= -0xf; right &= -0xf;

	      //now apply PC-2, in such a way that E is easier when encrypting or decrypting
	      //this conversion will look like PC-2 except only the last 6 bits of each byte are used
	      //rather than 48 consecutive bits and the order of lines will be according to 
	      //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
	      lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
	              | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
	              | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
	              | pc2bytes6[(left >>> 4) & 0xf];
	      righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
	                | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
	                | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
	                | pc2bytes13[(right >>> 4) & 0xf];
	      temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff; 
	      keys[n++] = lefttemp ^ temp; keys[n++] = righttemp ^ (temp << 16);
	    }
	  } //for each iterations
	  //return the keys we've created
	  return keys;
	} //end of des_createKeys

//Convierte una cadena a Base 64. Debido a un error en el algoritmo original, pasaremos
//de cadena a hexadecimal y de hexadecimal a Base64
function stringToBase64 (s) {
	return hexToBase64(stringToHex(s));
}

//Convert a base64 string into a normal string
function base64ToString (s) {
//the base 64 characters
var BASE64 = new Array ('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/');
	
var decode = new Object();
for (var i=0; i<BASE64.length; i++) {decode[BASE64[i]] = i;} //inverse of the array
decode['='] = 0; //add the equals sign as well
var r = "", c1, c2, c3, c4, len=s.length; //define variables
s += "===="; //just to make sure it is padded correctly
for (var i=0; i<len; i+=4) { //4 input characters at a time
  c1 = s.charAt(i); //the 1st base64 input characther
  c2 = s.charAt(i+1);
  c3 = s.charAt(i+2);
  c4 = s.charAt(i+3);
  r += String.fromCharCode (((decode[c1] << 2) & 0xff) | (decode[c2] >> 4)); //reform the string
  if (c3 != '=') r += String.fromCharCode (((decode[c2] << 4) & 0xff) | (decode[c3] >> 2));
  if (c4 != '=') r += String.fromCharCode (((decode[c3] << 6) & 0xff) | decode[c4]);
}
return r;
}

function stringToHex (s) {
	  var r = "";
	  var hexes = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
	  for (var i=0; i<s.length; i++) {r += hexes [s.charCodeAt(i) >> 4] + hexes [s.charCodeAt(i) & 0xf];}
	  return r;
}

//--- Funciones para pasar de Hexadecimal a base64

var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var tableStr_URL_SAFE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function btoa (bin, urlSafe) {
	var table = (urlSafe == true ? tableStr_URL_SAFE : tableStr).split("");
	
	for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
		var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
		if ((a | b | c) > 255) throw new Error("String contains an invalid character");
		base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
		(isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
		(isNaN(b + c) ? "=" : table[c & 63]);
	}
	return base64.join("");
}

function hexToBase64(str, urlSafe) {
	var byteString;
	var byteArray = str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ");
	try {
		byteString = String.fromCharCode.apply(null, byteArray);
	} catch (e) {
		var strTemp = "";
		for (var i = 0, len = byteArray.length; i < len; i++) {
			strTemp += String.fromCharCode(byteArray[i]);
		}
		byteString = strTemp;
	}
	
	return btoa(byteString, urlSafe);
}