var beforeSendCallback = function(parameters, httpRequest) {
	try {
		$("#resultado").html("Procesando, espere por favor...");
		if (window && window.$ && $ && $.LoadingOverlay) {
			$.LoadingOverlay("show", {
				color : "rgba(53, 147, 1, 0.7)",
				maxSize : "100px",
				minSize : "20px",
				resizeInterval : 3,
				size : "100%"
			});
		}
	} catch (error) {
		console.log("Error: " + error);
		console.log("Error en beforeSendCallback(" + parameters + "" + ", "
				+ httpRequest + ")");
	}
};
var completeCallback = function(parameters, response, httpRequest) {
	if (httpRequest && "OK" == httpRequest.statusText) {
		var value = "id: " + response.id;
		value += "\n" + "type: " + response.type;
		value += "\n" + "time: " + response.time;
		value += "\n" + "error: " + response.error;
		value += "\n" + "descError: " + response.descError;
		value += "\n";
		$("#console").val(value);
	}
	try {
		var status = "KO";
		if (httpRequest && httpRequest.statusText) {
			status = httpRequest.statusText;
		}
		$("#resultado").html(status);
	} catch (error) {
		console.log("Error: " + error);
		console.log("Error en beforeSendCallback(" + parameters + ", "
				+ response + ", " + httpRequest + ")");
	}
	if (window && window.$ && $ && $.LoadingOverlay) {
		$.LoadingOverlay("hide", true);
	}
};
var maErrorCallback = function(
/* String */textStatus,
/* String */errorThrown) {
	$("#console").val(errorThrown);
	$("#outputText").val('');
	$("#pem").val('');
};
var successCallback = function(
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
};

var echo = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.echo(maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback);
}

var setStickySignatory_true = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.setStickySignatory(true, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var setStickySignatory_false = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.setStickySignatory(false, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var getFileNameContentBase64 = function() {
	var params = new Object();
	params.title = "Seleccione fichero:";
	params.extensions = "pdf,zip,odt,ini,rtf,doc,docx";
	params.description = undefined;
	params.filePath = undefined;
	var maSucessCallback = function(data) {
		var items = data.split("|");
		$("#outputText").val(items[1]);
		delete items[1];
		$("#pem").val(items[0]);
		delete items[0];
		delete items;
	}
	Miniapplet13.getFileNameContentBase64(params.title, params.extensions,
			params.description, params.filePath, maSucessCallback,
			maErrorCallback, beforeSendCallback, completeCallback);
}
var getMultiFileNameContentBase64 = function() {
	var params = new Object();
	params.title = "Seleccione fichero:";
	params.extensions = "pdf,zip,odt,ini,rtf,doc,docx";
	params.description = undefined;
	params.filePath = undefined;
	var c = new AfirmaClient(pageClient);
	var scb = function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		$("#outputText").val("");
		$("#pem").val("");
		for (i = 0; i < response.fileNames.length; i++) {
			$("#outputText").val(
					$("#outputText").val() + "\n>file: "
							+ response.fileNames[i]);
			$("#outputText").val(
					$("#outputText").val() + "\n" + response.msgs[i]);
			$("#pem")
					.val($("#pem").val() + "\n file: " + response.fileNames[i]);
		}
	}
	c.setSuccessCallback(scb);
	c.getMultiFileNameContentBase64(params);
}

var getErrorMessage = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.getErrorMessage(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var getErrorType = function() {
	var maSuccessCallback = function(data) {
		console.log("Estamos en SuccessCallback!!!");
		if (successCallback) {
			// successCallback(response, textStatus, jqXHR);
		}
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.getErrorType(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var getCurrentLog = function() {
	var maSuccessCallback = function(data) {
		console.log("Estamos en SuccessCallback!!!");
		if (successCallback) {
			// successCallback(response, textStatus, jqXHR);
		}
		$("#outputText").val(data);
		$("#console").val('');
		$("#pem").val('');
	}
	Miniapplet13.getCurrentLog(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var sign = function() {
	var maSuccessCallback = function(data) {
		var items = data.split("|");
		console.log("Escribiendo el fichero");
		$("#outputText").val(items[1]);
		delete items[1];
		console.log("Escribiendo el certificado");
		$("#pem").val(items[0]);
		delete items[0];
		delete items;
	}
	var params = new Object();
	params.data = undefined;
	params.algoritm = 'SHA512withRSA';
	params.format = 'XAdES';
	params.extraParameters = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
	Miniapplet13.sign(params.data, params.algoritm, params.format,
			params.extraParameters, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var counterSign = function() {
	var maSuccessCallback = function(data) {
		var items = data.split("|");
		$("#outputText").val(items[1]);
		delete items[1];
		$("#pem").val(items[0]);
		delete items[0];
		delete items;
	}
	var params = new Object();
	params.data = undefined;
	params.algoritm = 'SHA512withRSA';
	params.format = 'XAdES';
	params.extraParameters = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
	Miniapplet13.counterSign(params.data, params.algoritm, params.format,
			params.extraParameters, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback);
}
var getBase64FromText = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#pem").val('');
	};
	var item = new Object();
	item.plainText = $("#inputText").val();
	item.charset = "default";
	Miniapplet13.getBase64FromText(item.plainText, item.charset,
			maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback);
}
var getTextFromBase64 = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#pem").val('');
	};
	var item = new Object();
	item.data = $("#inputText").val();
	item.charset = "default";
	Miniapplet13.getTextFromBase64(item.data, item.charset, maSuccessCallback,
			maErrorCallback, beforeSendCallback, completeCallback);
}
var saveDataToFile = function() {
	var params = new Object();
	params.data = $("#inputText").val();
	params.title = "Guarde fichero";
	params.fileName = "sample";
	params.extension = "txt"
	params.description = undefined;
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#pem").val('');
	};
	Miniapplet13.saveDataToFile(params.data, params.title, params.fileName,
			params.extension, params.description, maSuccessCallback,
			maErrorCallback, beforeSendCallback, completeCallback);
}
var coSign_from_files = function() {
	var cFileNameContentBase64 = new AfirmaClient(pageClient);
	cFileNameContentBase64.setErrorCallback(pageClient
			.getWrappedErrorCallback());
	cFileNameContentBase64.setCompleteCallback(undefined);
	var cCoSign = new AfirmaClient(pageClient);
	var coSignCB = function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		if (pageClient._successCallback) {
			pageClient._successCallback(response, textStatus, jqXHR);
		}
		$("#outputText").val(response.msg);
		$("#pem").val(response.pemCertificate);
	};
	var fileNameContentBase64CB = function(
	/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		if (response.error == 0) {
			var pCoSign = new Object();
			pCoSign.data = response.msg;
			pCoSign.algorithm = 'SHA512withRSA';
			pCoSign.format = 'AUTO';
			pCoSign.extraParams = 'filters.1=signingCert:;nonexpired:';
			cCoSign.coSign(pCoSign);
		} else {
			if (pageClient._errorCallback) {
				pageClient._errorCallback(textResponse, textStatus, jqXHR);
			}
			if (pageClient._completeCallback) {
				pageClient._completeCallback(jqXHR, textStatus);
			}
		}
	}
	cCoSign.setSuccessCallback(coSignCB);
	cFileNameContentBase64.setSuccessCallback(fileNameContentBase64CB);
	var pFileNameContentBase64 = new Object();
	pFileNameContentBase64.title = "Seleccione fichero Original";
	pFileNameContentBase64.extensions = "pdf,zip,odt,ini,rtf,doc,docx,xml";
	pFileNameContentBase64.description = undefined;
	pFileNameContentBase64.filePath = undefined;
	cFileNameContentBase64.getFileNameContentBase64(pFileNameContentBase64);
}
var firmar_FileByName = function() {
	var extension = "";
	var fileName = "";
	var cSign = new AfirmaClient(pageClient);
	cSign.setBeforeSendCallback(undefined);
	var sscc = function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		console.log("El valor leido es de " + response.msg.length);
		document.getElementById("outputText").value = response.msg;
		// $("#outputText").val(response.msg);
		if (pageClient._successCallback) {
			pageClient._successCallback(response, textStatus, jqXHR);
		}
		delete response.msg;
		$("#form_item").submit();
	}
	var signCB = function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		$("#pem").val($('#pem').val() + response.pemCertificate);
		if (extension.toUpperCase() == "PDF") {
			console.log("El valor leido es de " + response.msg.length);
			document.getElementById("outputText").value = response.msg;
			// $("#outputText").val(response.msg);
			if (pageClient._successCallback) {
				pageClient._successCallback(response, textStatus, jqXHR);
			}
			delete response.msg;
			$("#form_item").submit();
		} else {
			var b64 = new AfirmaClient(pageClient);
			b64.setCompleteCallback(undefined);
			b64.setBeforeSendCallback(undefined);
			var params = new Object();
			params.data = response.msg;
			b64.setSuccessCallback(sscc);
			b64.getTextFromBase64(params);
		}
	}
	cSign.setSuccessCallback(signCB);
	var cAddData = new AfirmaClient(pageClient);
	cAddData.setErrorCallback(pageClient.getWrappedErrorCallback());
	cAddData.setCompleteCallback(undefined);
	cAddData.setBeforeSendCallback(undefined);
	var addDataCB = function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		var separatorExt = fileName.lastIndexOf(".");
		extension = fileName.substring(separatorExt + 1);
		var pSign = new Object();
		pSign.algorithm = 'SHA512withRSA';
		if (extension.toUpperCase() == "PDF") {
			pSign.format = 'PAdES';
			pSign.extraParams = 'format=PAdES-Simple';
		} else {
			pSign.format = 'XAdES';
			pSign.extraParams = 'format=XAdES Detached';
			cSign.setCompleteCallback(undefined);
		}
		pSign.extraParams = pSign.extraParams
				+ "\nfilters.1=signingCert:;nonexpired:"
		cSign.sign(pSign);
	}
	cAddData.setSuccessCallback(addDataCB);
	var cFileNameContentBase64 = new AfirmaClient(pageClient);
	var fileNameContentBase64CB = function(
	/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		if (response.error == 0) {
			fileName = response.fileName;
			$("#pem").val("fileName: " + fileName + "\n");
			var pAddData = new Object();
			pAddData.data = response.msg;
			fileName = response.fileName;
			cAddData.addData(pAddData);
		} else {
			if (pageClient._errorCallback) {
				pageClient._errorCallback(textResponse, textStatus, jqXHR);
			}
			if (pageClient._completeCallback) {
				pageClient._completeCallback(jqXHR, textStatus);
			}
		}
	}
	var cFileNameContentBase64 = new AfirmaClient(pageClient);
	cFileNameContentBase64.setErrorCallback(pageClient
			.getWrappedErrorCallback());
	cFileNameContentBase64.setCompleteCallback(undefined);
	var pFileNameContentBase64 = new Object();
	pFileNameContentBase64.title = "Seleccione fichero:";
	pFileNameContentBase64.extensions = "pdf,zip,odt,ini,rtf,doc,docx,xml";
	pFileNameContentBase64.description = undefined;
	pFileNameContentBase64.filePath = undefined;
	cFileNameContentBase64.setErrorCallback(pageClient
			.getWrappedErrorCallback());
	cFileNameContentBase64.setCompleteCallback(undefined);
	cFileNameContentBase64.setSuccessCallback(fileNameContentBase64CB);
	cFileNameContentBase64.getFileNameContentBase64(pFileNameContentBase64);
}
var jnlp_exit = function() {
	var maSuccessCallback = function(data) {
		$("#outputText").val(data);
		$("#pem").val('');
	}
	Miniapplet13.exit(maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback);
}
