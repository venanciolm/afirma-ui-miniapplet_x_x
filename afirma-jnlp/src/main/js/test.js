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
	var invoker = new AfirmaClient();
	invoker.setCommand("echo");
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
}
function openWindow() {
	var invoker = new AfirmaClient();
	invoker.setCommand("open");
	invoker.setSuccessCallback(pageSuccessCallback);
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
}
function exit_jnlp() {
	var invoker = new AfirmaClient();
	invoker.setCommand("exit");
	invoker.setSuccessCallback(pageSuccessCallback);
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
}
function test() {
	var invoker = new AfirmaClient();
	invoker.setCommand("test");
	invoker.setSuccessCallback(pageSuccessCallback);
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(undefined);
}

function getBase64FromText() {
	var item = {
		plainText : $("#inputText").val(),
		charset : "default"
	};
	console.log("Enviando: " + item.plainText);
	var invoker = new AfirmaClient();
	invoker.setCommand("getBase64FromText");
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.invoke(item);
}

function sign(base64) {
	var item = {
		algorithm : 'SHA512withRSA',
		format : 'XAdES',
		extraParams : 'format=XAdES Enveloping'
	};
	var invoker = new AfirmaClient();
	invoker.setSuccessCallback(function(/* Anything */response, /* String */
	textStatus, /* jqXHR */
	jqXHR) {
		pageSuccessCallback(response, textStatus, jqXHR);
		$("#outputText").val(response.msg);
	});
	invoker.setErrorCallback(pageErrorCallback);
	invoker.setBeforeSendCallback(pageBeforeSendCallback);
	invoker.setCompleteCallback(pageCompleteCallback);
	invoker.sign(base64, item);
}
