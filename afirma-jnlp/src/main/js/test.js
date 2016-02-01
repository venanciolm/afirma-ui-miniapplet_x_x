var pageClient = new AfirmaClient();
pageClient.setBeforeSendCallback(function(
/* jqXHR */jqXHR,
/* PlainObject */settings) {
	$("#resultado").html("Procesando, espere por favor...");
	$('#preloader').show();
});
pageClient.setCompleteCallback(function(
/* jqXHR */jqXHR,
/* String */textStatus) {
	$("#resultado").html(textStatus);
	$('#preloader').hide();
});
pageClient.setErrorCallback(function(
/* jqXHR */jqXHR,
/* String */textStatus,
/* String */errorThrown) {
	$("#console").val(errorThrown);
});
pageClient.setSuccessCallback(function(
/* Anything */response,
/* String */textStatus,
/* jqXHR */jqXHR) {
	var value = "id: " + response.id;
	value += "\n" + "type: " + response.type;
	value += "\n" + "time: " + response.time;
	value += "\n" + "error: " + response.error;
	value += "\n" + "descError: " + response.descError;
	value += "\n";
	value += "\n" + "textStatus: " + textStatus;
	$("#console").val(value);
});

function echo() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setCommand("echo");
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		if (pageClient._successCallback) {
			pageClient._successCallback(response, textStatus, jqXHR);
		}
		$("#outputText").val(response.msg);
		$("#pem").val('');
	});
	invoker.invoke(undefined);
}

function exit_jnlp() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setCommand("exit");
	invoker.invoke(undefined);
	$("#outputText").val('');
	$("#pem").val('');
}

function getBase64FromText() {
	var item = new Object();
	item.plainText = $("#inputText").val();
	item.charset = "default";
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		if (pageClient._successCallback) {
			pageClient._successCallback(response, textStatus, jqXHR);
		}
		$("#outputText").val(response.msg);
		$("#pem").val('');
	});
	invoker.getBase64FromText(item);
}

function signMsg(textPlain) {
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
function signBase64(base64) {
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
function signFile() {
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
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'XAdES';
	item.extraParams = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
	invoker.sign(item);
}
function signFile2p() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		var separatorExt = response.fileName.lastIndexOf(".");
		var extension = response.fileName.substring(separatorExt + 1);
		var invokerSign = new AfirmaClient(invoker);
		invokerSign.setErrorCallback(pageClient._errorCallback);
		invokerSign.setBeforeSendCallback(undefined);
		var item = new Object();
		item.algorithm = 'SHA512withRSA';
		if (extension.toUpperCase() == "PDF") {
			item.format = 'PAdES';
			item.extraParams = 'format=PAdES-Simple';
			invokerSign.setCompleteCallback(pageClient._completeCallback);
		} else {
			item.format = 'XAdES';
			item.extraParams = 'format=XAdES Detached';
			invokerSign.setCompleteCallback(undefined);
		}
		item.extraParams = item.extraParams
				+ "\nfilters.1=signingCert:;nonexpired:"
		invokerSign.setSuccessCallback(function(
		/* Anything */response, /* String */
		textStatus, /* jqXHR */
		jqXHR) {
			if (extension.toUpperCase() == "PDF") {
				$("#outputText").val(response.msg);
				if (pageClient._successCallback) {
					pageClient._successCallback(response, textStatus, jqXHR);
				}
			} else {
				var decode = new AfirmaClient(invokerSign);
				decode.setErrorCallback(pageClient._errorCallback);
				decode.setCompleteCallback(pageClient._completeCallback);
				decode.setSuccessCallback(function(/* Anything */response, /* String */
				textStatus, /* jqXHR */
				jqXHR) {
					if (pageClient._successCallback) {
						pageClient
								._successCallback(response, textStatus, jqXHR);
					}
					$("#outputText").val(response.msg);
				});
				var decodeParams = new Object();
				decodeParams.data = response.msg;
				console.log("El tamaño en B64 es: "+decodeParams.data.length);
				decodeParams.charset = "default";
				decode.getTextFromBase64(decodeParams);
			}
			$("#pem").val(response.pemCertificate);
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
