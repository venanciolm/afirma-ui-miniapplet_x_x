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
	var item = new Object();
	item.plainText = $("#inputText").val();
	item.charset = "default";
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
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'XAdES';
	item.extraParams = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
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
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'XAdES';
	item.extraParams = 'format=XAdES Detached\nfilters.1=signingCert:;nonexpired:';
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
	var item = new Object();
	item.algorithm = 'SHA512withRSA';
	item.format = 'PAdES';
	item.extraParams = 'format=PAdES-Simple\nfilters.1=signingCert:;nonexpired:';
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
		var item = new Object();
		item.algorithm = 'SHA512withRSA';
		if (extension.toUpperCase() == "PDF") {
			item.format = 'PAdES';
			item.extraParams = 'format=PAdES-Simple';
		} else {
			item.format = 'XAdES';
			item.extraParams = 'format=XAdES Detached';
		}
		item.extraParams = item.extraParams
				+ "\nfilters.1=signingCert:;nonexpired:"
		var invokerSign = new AfirmaClient(invoker);
		invokerSign.setErrorCallback(pageErrorCallback);
		invokerSign.setBeforeSendCallback(undefined);
		invokerSign.setCompleteCallback(pageCompleteCallback);
		invokerSign.setSuccessCallback(function(
		/* Anything */response, /* String */
		textStatus, /* jqXHR */
		jqXHR) {
			if (extension.toUpperCase() == "PDF") {
				$("#outputText").val(response.msg);
			} else {
				$("#outputText").val(base64ToString(response.msg));
			}
			$("#pem").val(response.pemCertificate);
			if (pageSuccessCallback) {
				pageSuccessCallback(response, textStatus, jqXHR);
			}
		});
		invokerSign.signBase64(response.msg, item);
	});
	var params = new Object();
	params.title = "Seleccione fichero:";
	params.extensions = "pdf,zip,odt,ini,rtf,doc,docx";
	params.description = undefined;
	params.filePath = undefined;
	invoker.setErrorCallback(function(/* jqXHR */jqXHR,/* String */
	textStatus,/* String */
	descError) {
		if (pageErrorCallback) {
			pageErrorCallback(/* jqXHR */jqXHR,/* String */textStatus,/* String */
			descError)
		}
		if (pageCompleteCallback) {
			pageCompleteCallback( /* jqXHR */jqXHR, /* String */
			textStatus)
		}
	});
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(undefined);
	invoker.getFileNameContentBase64(params);
}
