//success : function(/*Anything*/response, /*String*/textStatus, /*jqXHR*/
//error : function(/*jqXHR*/jqXHR,/*String*/textStatus,/*String*/
//beforeSend : function(/*jqXHR*/jqXHR, /*PlainObject*/settings) {
//complete : function( /*jqXHR*/jqXHR, /*String*/textStatus) {

var MiniAppletJNLP = (function(window, undefined) {
	var completeCallback;
	var beforeSendCallback;
	function setBeforeSendCallback(beforeSendCallback) {
		MiniAppletJNLP.beforeSendCallback = beforeSendCallback;
	}
	function setCompleteCallback(completeCallback) {
		MiniAppletJNLP.completeCallback = completeCallback;
	}

	function echo(sucessCallback,errorCallback) {
		callServer("echo",null,sucessCallback,errorCallback);
	}
	function getBase64FromText(/**/ msg,sucessCallback,errorCallback) {
		callServer("getBase64FromText", msg,sucessCallback,errorCallback);
	}
	
	function openWindow(sucessCallback,errorCallback) {
		callServer("open",null,sucessCallback,errorCallback);
	}
	function exit_jnlp(sucessCallback,errorCallback) {
		callServer("exit",null,sucessCallback,errorCallback);
	}
	function test(sucessCallback,errorCallback) {
		callServer("test",null,sucessCallback,errorCallback);
	}
	function callServer(/* String */command, /* Any */parameters,
			successCallback, errorCallback) {
		var server = "https://localhost:9999/afirma/";
		server = server + command;
		$.ajax({
			url : server,
			type : 'POST',
			contentType : 'application/json',
			crossOrigin : true,
			dataType : 'json',
			data : JSON.stringify(parameters),
			beforeSend : function(/* jqXHR */jqXHR, /* PlainObject */
			settings) {
				if (MiniAppletJNLP.beforeSendCallback) {
					MiniAppletJNLP.beforeSendCallback(/* jqXHR */jqXHR, /* PlainObject */
					settings)
				}
			},
			complete : function( /* jqXHR */jqXHR, /* String */
			textStatus) {
				if (MiniAppletJNLP.completeCallback) {
					MiniAppletJNLP.completeCallback( /* jqXHR */jqXHR, /* String */
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
	}

	return {

	/* Publicamos las variables para la comprobacion de hora. */
	// CHECKTIME_NO : CHECKTIME_NO,
	// CHECKTIME_RECOMMENDED : CHECKTIME_RECOMMENDED,
	// CHECKTIME_OBLIGATORY : CHECKTIME_OBLIGATORY,
	/*
	 * Publicamos las variables para establecer parametros personalizados en la
	 * JVM
	 */
	// JAVA_ARGUMENTS : JAVA_ARGUMENTS,
	// SYSTEM_PROPERTIES : SYSTEM_PROPERTIES,
	/*
	 * Publicamos las variables para configurar un almacen de certificados
	 * concreto.
	 */
	// KEYSTORE_WINDOWS : KEYSTORE_WINDOWS,
	// KEYSTORE_APPLE : KEYSTORE_APPLE,
	// KEYSTORE_PKCS12 : KEYSTORE_PKCS12,
	// KEYSTORE_PKCS11 : KEYSTORE_PKCS11,
	// KEYSTORE_FIREFOX : KEYSTORE_FIREFOX,
	// KEYSTORE_JAVA : KEYSTORE_JAVA,
	// KEYSTORE_JCEKS : KEYSTORE_JCEKS,
	// KEYSTORE_JAVACE : KEYSTORE_JAVACE,
	/* Metodos visibles. */
	setCompleteCallback: setCompleteCallback,
	setBeforeSendCallback: setBeforeSendCallback,

	// cargarMiniApplet : cargarMiniApplet,
	// cargarAppAfirma : cargarAppAfirma,
	echo : echo,
	// checkTime : checkTime,
	// sign : sign,
	// coSign : coSign,
	// counterSign : counterSign,
	// saveDataToFile : saveDataToFile,
	// getFileNameContentBase64 : getFileNameContentBase64,
	// getMultiFileNameContentBase64 : getMultiFileNameContentBase64,
	getBase64FromText : getBase64FromText,
	// getTextFromBase64 : getTextFromBase64,
	// setServlets : setServlets,
	// setStickySignatory : setStickySignatory,
	// setLocale : setLocale,
	// getErrorMessage : getErrorMessage,
	// getErrorType : getErrorType,
	// getCurrentLog : getCurrentLog
	openWindow:openWindow,
	exit: exit_jnlp,
	test: test
	};
})(window, undefined);
