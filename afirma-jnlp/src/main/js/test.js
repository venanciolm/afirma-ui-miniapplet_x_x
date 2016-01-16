var pageClient = new AfirmaClient();
var pageSuccessCallback = function(/* Anything */response, /* String */
textStatus, /* jqXHR */
jqXHR) {
	var value = "id: " + response.id;
	value += "\n" + "type: " + response.type;
	value += "\n" + "time: " + response.time;
	value += "\n" + "error: " + response.error;
	value += "\n" + "descError: " + response.descError;
	value += "\n";
	value += "\n" + "textStatus: " + textStatus;
	$("#console").val(value);
};
var pageErrorCallback = function(/* jqXHR */jqXHR,/* String */textStatus,/* String */
errorThrown) {
	$("#console").val(errorThrown);
};
var pageBeforeSendCallback = function(/* jqXHR */jqXHR, /* PlainObject */
settings) {
	$("#resultado").html("Procesando, espere por favor...");
	$('#preloader').show();
};
var pageCompleteCallback = function( /* jqXHR */jqXHR, /* String */
textStatus) {
	$("#resultado").html(textStatus);
	$('#preloader').hide();
};

function showLogCallback(errorType, errorMessage) {
	showLog("Type: " + errorType + "\nMessage: " + errorMessage);
}

function echo() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setCommand("echo");
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#pem").val('');
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
}

function exit_jnlp() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setCommand("exit");
	invoker.setSuccessCallback(pageSuccessCallback);
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
	$("#outputText").val('');
	$("#pem").val('');
}

function getBase64FromText() {
	var item = {
		plainText : $("#inputText").val(),
		charset : "default"
	};
	console.log("Enviando: " + item.plainText);
	var invoker = new AfirmaClient(pageClient);
	invoker.setCommand("getBase64FromText");
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		$("#pem").val('');
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(item);
}

function signMsg(textPlain) {
	var item = {
		algorithm : 'SHA512withRSA',
		format : 'XAdES',
		extraParams : 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:'
	};
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		$("#pem").val(response.pemCertificate);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.signMsg(textPlain, item);
}
function signBase64(base64) {
	var item = {
		algorithm : 'SHA512withRSA',
		format : 'XAdES',
		extraParams : 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:'
	};
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		$("#pem").val(response.pemCertificate);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.signBase64(base64, item);
}
function signFile() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		$("#pem").val(response.pemCertificate);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	var item = {
		algorithm : 'SHA512withRSA',
		format : 'XAdES',
		extraParams : 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:'
	};
	invoker.sign(item);
}
function signFile2p() {
	var invoker = new AfirmaClient(pageClient);
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
		$("#pem").val(response.fileName);
	});
	var params = {
			title: 'Selecione fichero!'
	};
	// extensions;
	// description;
	// filePath;			
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.getFileNameContentBase64(params);
}
