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
function signMsg() {
	var textPlain = $("#inputText").val();
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'XAdES';
	item.extraParams = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
	var invoker = new AfirmaClient(pageClient);
	invoker.setCompleteCallback(undefined);
	invoker.setErrorCallback(pageClient.getWrappedErrorCallback());
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		var decode = new AfirmaClient(invoker);
		decode.setCompleteCallback(pageClient._completeCallback);
		decode.setSuccessCallback(function(/* Anything */response, /* String */
		textStatus, /* jqXHR */
		jqXHR) {
			if (pageClient._successCallback) {
				pageClient._successCallback(response, textStatus, jqXHR);
			}
			$("#outputText").val(response.msg);
		});
		$("#pem").val(response.pemCertificate);
		console.log("Decodificacioón!");
		var decodeParams = new Object();
		decodeParams.data = response.msg;
		decodeParams.charset = "default";
		decode.getTextFromBase64(decodeParams);
	});
	invoker.signMsg(textPlain, item);
}
function signBase64() {
	var base64 = $("#inputText").val();
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'XAdES';
	item.extraParams = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
	var invoker = new AfirmaClient(pageClient);
	invoker.setCompleteCallback(undefined);
	invoker.setErrorCallback(pageClient.getWrappedErrorCallback());
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		var decode = new AfirmaClient(invoker);
		decode.setCompleteCallback(pageClient._completeCallback);
		decode.setSuccessCallback(function(/* Anything */response, /* String */
		textStatus, /* jqXHR */
		jqXHR) {
			if (pageClient._successCallback) {
				pageClient._successCallback(response, textStatus, jqXHR);
			}
			$("#outputText").val(response.msg);
		});
		$("#pem").val(response.pemCertificate);
		var decodeParams = new Object();
		decodeParams.data = response.msg;
		decodeParams.charset = "default";
		decode.getTextFromBase64(decodeParams);
	});
	invoker.signBase64(base64, item);
}
function signFile2p() {
	var invoker = new AfirmaClient(pageClient);
	invoker
			.setSuccessCallback(function(/* Anything */response, /* String */
			textStatus, /* jqXHR */
			jqXHR) {
				var separatorExt = response.fileName.lastIndexOf(".");
				var extension = response.fileName.substring(separatorExt + 1);
				var invokerSign = new AfirmaClient(invoker);
				invokerSign.setErrorCallback(pageClient._errorCallback);
				invokerSign.setBeforeSendCallback(undefined);
				var item = new Object();
				item.algorithm = 'SHA512withRSA';
				$("#pem").val("fileName: " + response.fileName + "\n");
				if (extension.toUpperCase() == "PDF") {
					item.format = 'PAdES';
					item.extraParams = 'format=PAdES-Simple';
					invokerSign
							.setCompleteCallback(pageClient._completeCallback);
				} else {
					item.format = 'XAdES';
					item.extraParams = 'format=XAdES Detached';
					invokerSign.setCompleteCallback(undefined);
				}
				item.extraParams = item.extraParams
						+ "\nfilters.1=signingCert:;nonexpired:"
				invokerSign
						.setSuccessCallback(function(
						/* Anything */response, /* String */
						textStatus, /* jqXHR */
						jqXHR) {
							if (extension.toUpperCase() == "PDF") {
								$("#outputText").val(response.msg);
								if (pageClient._successCallback) {
									pageClient._successCallback(response,
											textStatus, jqXHR);
								}
							} else {
								var decode = new AfirmaClient(invokerSign);
								decode
										.setErrorCallback(pageClient._errorCallback);
								decode
										.setCompleteCallback(pageClient._completeCallback);
								decode.setSuccessCallback(function(
								/* Anything */response, /* String */
								textStatus, /* jqXHR */
								jqXHR) {
									if (pageClient._successCallback) {
										pageClient._successCallback(response,
												textStatus, jqXHR);
									}
									$("#outputText").val(response.msg);
								});
								var decodeParams = new Object();
								decodeParams.data = response.msg;
								console.log("El tamaño en B64 es: "
										+ decodeParams.data.length);
								decodeParams.charset = "default";
								decode.getTextFromBase64(decodeParams);
							}
							$("#pem").val(
									$('#pem').val() + response.pemCertificate);
						});
				invokerSign.signBase64(response.msg, item);
			});
	var params = new Object();
	params.title = "Seleccione fichero:";
	params.extensions = "pdf,zip,odt,ini,rtf,doc,docx";
	params.description = undefined;
	params.filePath = undefined;
	invoker.setErrorCallback(pageClient.getWrappedErrorCallback());
	invoker.setCompleteCallback(undefined);
	invoker.getFileNameContentBase64(params);
}
