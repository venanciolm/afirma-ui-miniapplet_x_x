/**
 * 
 * Prototipo de un invoker
 * ____________________________________________________________________________
 */
var InvokerAbstract = function() {

}
InvokerAbstract.constructor = InvokerAbstract;
InvokerAbstract.prototype.toString = function() {
	return "InvokerAbstract={}";
}
InvokerAbstract.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	throw "AbstractMethod";
}
/**
 * 
 * Manejador de cliente.
 * 
 * Es un manejador, que no hace nada, simplemente es un punto comun que maneja
 * un determinado estado.
 * 
 * @param {String}
 *            protocol
 * 
 * ____________________________________________________________________________
 */
var InvokerWithState = function(protocol) {
	this.STATUS_STRING = [];
	this.STATUS_STRING["es_ES"] = [];
	this.STATUS_STRING["es_ES"][0] = "La petición no ha sido iniciada";
	this.STATUS_STRING["es_ES"][1] = "La conexión ha sido establecida";
	this.STATUS_STRING["es_ES"][2] = "Se ha recibido una petición";
	this.STATUS_STRING["es_ES"][3] = "Procesando petición";
	this.STATUS_STRING["es_ES"][4] = "El proceso ha sido finalizado y la respuesta está disponible";
	this.DEFAULT_LOCALE = this.STATUS_STRING["es_ES"];
	this._PREFIX_APP = protocol;
	this._SERVER = "https://localhost";
	this._VALID_CHARS_TO_ID = "1234567890abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	this._currentPort = "";
	this._sessionId = "";
	this._MINUTES_TIMEOUT = 2;
	this._MIN_PORT = 49152;
	this._MAX_PORT = 65535;
	this._NUM_PORTS = 3;
	this._LAUNCHING_TIME = 6000;
	this._CONNECTION_RETRIES = 15;
	this._invokers = [];
	this._invokers[0] = new SearchPortInvoker(this);
	this._invokers[1] = new PortByCookieInvoker(this);
	this._invokers[2] = new PortDetectedInvoker(this);
	this._state = 0;
	var cookiePort = this.readCookie(this._PREFIX_APP + "_port");
	var cookieSession = this.readCookie(this._PREFIX_APP + "_session");
	if (cookiePort && cookieSession) {
		this._currentPort = cookiePort;
		this._sessionId = cookieSession;
		// console.log("Cambiando estado de: " + this._state + " -> 1 ["
		// + cookiePort + ", " + cookieSession + "]");
		this._state = 1;
	}
}
InvokerWithState.constructor = InvokerWithState;
InvokerWithState.prototype = new InvokerAbstract();
InvokerWithState.prototype.getURL = function(command, port) {
	var uRL = this._SERVER + ":" + port + "/" + this.getContext() + "/"
			+ command;
	return uRL;
}
InvokerWithState.prototype.generateNewIdSession = function() {
	var ID_LENGTH = 20;
	var random = "";
	var randomInts;
	if (typeof window.crypto != "undefined"
			&& typeof window.crypto.getRandomValues != "undefined") {
		randomInts = new Uint32Array(ID_LENGTH);
		window.crypto.getRandomValues(randomInts);
	} else {
		randomInts = new Array(ID_LENGTH);
		for (var i = 0; i < ID_LENGTH; i++) {
			randomInts[i] = rnd() * MAX_NUMBER;
		}
	}
	for (var i = 0; i < ID_LENGTH; i++) {
		random += this._VALID_CHARS_TO_ID.charAt(Math.floor(randomInts[i]
				% this._VALID_CHARS_TO_ID.length));
	}
	return random;
}
InvokerWithState.prototype.getTestURL = function(port) {
	return this.getURL(this.getTestCommand(), port);
}
InvokerWithState.prototype.isTestResponseValid = function(obj) {
	if (obj && obj.error == 0 && obj.sessionId == this._sessionId) {
		delete obj.msg;
		delete obj.type;
		delete obj.error;
		delete obj.descError;
		delete obj.sessionId;
		delete obj;
		testResponseValid = true;
	}
	return testResponseValid;
}
//
//
// TODO
// ____________________________________________________________________________
InvokerWithState.prototype.getTestCommand = function() {
	return "echo";
}
InvokerWithState.prototype.getContext = function() {
	return "afirma";
}
// ____________________________________________________________________________

InvokerWithState.prototype.toString = function() {
	return "InvokerWithState={state=" + this._state + ", port="
			+ this._currentPort + ", sessionId=" + this._sessionId + "}";
}
InvokerWithState.prototype.changeState = function(
/* Estado */state,
/* Port */port,
/* sessionId */sessionId,
/* String */command,
/* Any */parameters,
/* On Success */successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	// console.log("Cambiando estado de: " + this._state + " -> " + state + " ["
	// + port + ", " + sessionId + "]");
	this._currentPort = port;
	this._sessionId = sessionId;
	this._state = state;
	this.invoke(command, parameters, successCallback, errorCallback,
			beforeSendCallback, completeCallback);
}
InvokerWithState.prototype.invoke = function(/* String */command, /* Any */
parameters, successCallback, errorCallback, beforeSendCallback,
		completeCallback) {
	this._invokers[this._state].invoke(/* String */command, /* Any */
	parameters, successCallback, errorCallback, beforeSendCallback,
			completeCallback);
}
InvokerWithState.prototype.getHttpRequest = function() {
	var xmlHttp = null;
	if (typeof XMLHttpRequest != "undefined") { // Navegadores actuales
		xmlHttp = new XMLHttpRequest();
	} else if (typeof window.ActiveXObject != "undefined") {
		// Internet Explorer antiguos
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP.4.0");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
			} catch (e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					xmlHttp = null;
				}
			}
		}
	}
	return xmlHttp;
}
InvokerWithState.prototype.createCookie = function(name, value, minutes) {
	if (minutes) {
		var date = new Date();
		date.setTime(date.getTime() + (minutes * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}
InvokerWithState.prototype.readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}
InvokerWithState.prototype.eraseCookie = function(name) {
	createCookie(name, "", -1);
}
InvokerWithState.prototype.getRandomPorts = function() {
	var ports = [];
	for (i = 0; i < this._NUM_PORTS; i++) {
		ports[i] = Math
				.floor((Math.random() * (this._MAX_PORT - this._MIN_PORT)))
				+ this._MIN_PORT;
	}
	return ports;
}
InvokerWithState.prototype.openNativeApp = function(ports) {
	var portsLine = "";
	for (var i = 0; i < ports.length; i++) {
		portsLine += ports[i];
		if (i < (ports.length - 1)) {
			portsLine += ",";
		}
	}
	this._sessionId = this.generateNewIdSession();
	var url = this._PREFIX_APP + "://service?ports=" + portsLine + "&timeout="
			+ this._MINUTES_TIMEOUT + "&sessionId=" + this._sessionId;
	this.openUrl(url);
}
InvokerWithState.prototype.isChrome = function() {
	return navigator.userAgent.toUpperCase().indexOf("CHROME") != -1
			|| navigator.userAgent.toUpperCase().indexOf("CHROMIUM") != -1;
}
InvokerWithState.prototype.openUrl = function(url) {
	// Usamos document.location porque tiene mejor soporte por los
	// navegadores que
	// window.location que es el mecanismo estandar
	if (this.isChrome()) {
		document.location = url;
	} else {
		if (document.getElementById("iframe_" + this._PREFIX_APP) != null) {
			document.getElementById("iframe_" + this._PREFIX_APP).src = url;
		} else {
			var iframeElem = document.createElement("iframe");

			var idAttr = document.createAttribute("id");
			idAttr.value = "iframe_" + this._PREFIX_APP;
			iframeElem.setAttributeNode(idAttr);

			var srcAttr = document.createAttribute("src");
			srcAttr.value = url;
			iframeElem.setAttributeNode(srcAttr);

			var heightAttr = document.createAttribute("height");
			heightAttr.value = 1;
			iframeElem.setAttributeNode(heightAttr);

			var widthAttr = document.createAttribute("width");
			widthAttr.value = 1;
			iframeElem.setAttributeNode(widthAttr);

			var styleAttr = document.createAttribute("style");
			styleAttr.value = "display: none;";
			iframeElem.setAttributeNode(styleAttr);

			document.body.appendChild(iframeElem);
		}
	}
}
/**
 * 
 * Realiza la búsqueda inicial de puertos para la conexión por protocolo
 * 
 * @param {InvokerWithState}
 *            parent
 * 
 * ____________________________________________________________________________
 */
var SearchPortInvoker = function(parent) {
	this._parent = parent;
}
SearchPortInvoker.constructor = SearchPortInvoker;
SearchPortInvoker.prototype = new InvokerAbstract();
SearchPortInvoker.prototype.invoke = function(
/* String */command,
/* Any */parameters,
/**/successCallback,
/**/errorCallback,
/**/beforeSendCallback,
/**/completeCallback) {
	// Calculamos los puertos
	var ports = this._parent.getRandomPorts();
	// Invocamos a la aplicacion nativa
	this._parent.openNativeApp(ports);
	// Enviamos la peticion a la app despues de esperar un tiempo
	// prudencial
	var actualInvoker = this;
	for (i = 0; i < ports.length; i++) {
		setTimeout(actualInvoker.executeTestConnect,
				actualInvoker._parent._LAUNCHING_TIME, actualInvoker, ports[i],
				actualInvoker._parent._sessionId,
				actualInvoker._parent._CONNECTION_RETRIES, command, parameters,
				successCallback, errorCallback, beforeSendCallback,
				completeCallback);
	}
}
SearchPortInvoker.prototype.executeTestConnect = function(actualInvoker, port,
		sessionId, timeoutResetCounter, command, parameters, successCallback,
		errorCallback, beforeSendCallback, completeCallback) {
	var httpRequest = actualInvoker._parent.getHttpRequest();
	httpRequest.open("POST", actualInvoker._parent.getTestURL(port), true);
	httpRequest.setRequestHeader("Content-type", "application/json");
	httpRequest.setRequestHeader("Accept", "application/json; charset=utf-8");
	var f_onreadystatechange = function(event) {
		var retorno = false;
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			retorno = actualInvoker._parent.isTestResponseValid(JSON
					.parse(httpRequest.responseText));
		}
		if (httpRequest.readyState == 4 && httpRequest.status == 200 && retorno
				&& !actualInvoker._connection) {
			//
			//
			// hemos encontrado el puerto!!!
			//
			actualInvoker._parent.changeState(2, port, sessionId, command,
					parameters, successCallback, errorCallback,
					beforeSendCallback, completeCallback);
		} else if (timeoutResetCounter == 0) {
			// Si hemos agotado todos los reintentos consideramos que la
			// aplicacion no esta instalada
			if (errorCallback) {
				errorCallback(
						"es.gob.afirma.standalone.ApplicationNotFoundException",
						"No se ha podido conectar con AutoFirma.");
			}
			return;
		}
		// Aun quedan reintentos
		else if (httpRequest.readyState == 4) {
			--timeoutResetCounter;
			setTimeout(actualInvoker.executeTestConnect,
					actualInvoker._parent._LAUNCHING_TIME, actualInvoker, port,
					sessionId, timeoutResetCounter, command, parameters,
					successCallback, errorCallback, beforeSendCallback,
					completeCallback);
		}
	}
	httpRequest.onreadystatechange = f_onreadystatechange;
	if (actualInvoker._parent._state == 0) {
		httpRequest.send();
	}
}
/**
 * 
 * Ejecución incial con puerto asignado por cookie
 * 
 * @param {InvokerWithState}
 *            parent
 * 
 * ____________________________________________________________________________
 */

var PortByCookieInvoker = function(parent) {
	this._parent = parent;
}
PortByCookieInvoker.prototype = new InvokerAbstract();
PortByCookieInvoker.constructor = PortByCookieInvoker;
PortByCookieInvoker.prototype.toString = function() {
	return "PortByCookieInvoker={}";
}
PortByCookieInvoker.prototype.invoke = function(
/* String */command,
/* Any */parameters,
/**/successCallback,
/**/errorCallback,
/**/beforeSendCallback,
/**/completeCallback) {
	var item = this._parent;
	var testPort = item._currentPort;
	var testSession = item._sessionId;
	var httpRequest = item.getHttpRequest();
	var testURL = item.getTestURL(testPort);
	httpRequest.open("POST", testURL, true);
	httpRequest.setRequestHeader("Content-type", "application/json");
	httpRequest.setRequestHeader("Accept", "application/json; charset=utf-8");
	var f_onreadystatechange = function(event) {
		var retorno = false;
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var retorno = item.isTestResponseValid(JSON
					.parse(httpRequest.responseText));
		}
		if (httpRequest.readyState == 4 && httpRequest.status == 200 && retorno) {
			//
			//
			// hemos encontrado el puerto!!!
			//
			item.changeState(2, testPort, testSession, command, parameters,
					successCallback, errorCallback, beforeSendCallback,
					completeCallback);
		} else if (httpRequest.readyState == 4) {
			//
			//
			// debemos buscar un nuevo puerto!
			//
			item.changeState(0, "", "", command, parameters, successCallback,
					errorCallback, beforeSendCallback, completeCallback);
		}
	}
	httpRequest.onreadystatechange = f_onreadystatechange;
	httpRequest.send();
}
/**
 * 
 * Ejecución normal con puerto asignado
 * 
 * @param {InvokerWithState}
 *            parent
 * 
 * ____________________________________________________________________________
 */
var PortDetectedInvoker = function(parent) {
	this._parent = parent;
}
PortDetectedInvoker.prototype = new InvokerAbstract();
PortDetectedInvoker.constructor = PortDetectedInvoker;
PortDetectedInvoker.prototype.toString = function() {
	return "PortDetectedInvoker={}";
}
PortDetectedInvoker.prototype.invoke = function(
/* String */command,
/* Any */parameters,
/**/successCallback,
/**/errorCallback,
/**/beforeSendCallback,
/**/completeCallback) {
	var request = undefined;
	if (parameters) {
		request = JSON.stringify(parameters, undefined, 2);
	}
	var httpRequest = this._parent.getHttpRequest();
	httpRequest.open("POST", this._parent.getURL(command,
			this._parent._currentPort), true);
	httpRequest.setRequestHeader("Content-type", "application/json");
	httpRequest.setRequestHeader("Accept", "application/json; charset=utf-8");
	var item = this._parent;
	var f_onreadystatechange = function(event) {
		var retorno = false;
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			response = JSON.parse(httpRequest.responseText);
			if (response.error == 0) {
				item.createCookie(item._PREFIX_APP + "_port",
						item._currentPort, item._MINUTES_TIMEOUT);
				item.createCookie(item._PREFIX_APP + "_session",
						item._sessionId, item._MINUTES_TIMEOUT);
				if (successCallback) {
					successCallback(response);
				}
			} else {
				if (errorCallback) {
					successCallback(response);
				}
			}
		} else if (httpRequest.readyState == 4) {
			//
			//
			// Esto es un error ... vamos a ver como lo solucionamos
			// lo mejor ... es empezar de nuevo!!!
			//
			item.changeState(0, "", "", command, parameters, successCallback,
					errorCallback, beforeSendCallback, completeCallback);
			return;
		}
	}
	httpRequest.onreadystatechange = f_onreadystatechange;
	httpRequest.send(parameters);
}

var Miniapplet13 = (function(window, undefined) {
	var VERSION = "1.3";
	var invoker = new InvokerWithState("afirmajnlp");
	var LOCALIZED_STRINGS = new Array();
	LOCALIZED_STRINGS["es_ES"] = {
		checktime_warn : "Se ha detectado un desfase horario entre su sistema y el servidor. Se recomienda que se corrija antes de pulsar Aceptar para continuar.",
		checktime_err : "Se ha detectado un desfase horario entre su sistema y el servidor. Debe corregir la hora de su sistema antes de continuar.",
		checktime_local_time : "Hora de su sistema",
		checktime_server_time : "Hora del servidor"
	};
	LOCALIZED_STRINGS["gl_ES"] = {
		checktime_warn : "Destectouse un desfase horario entre o seu sistema e o servidor. Recoméndase corrixilo antes de pulsar Aceptar para continuar.",
		checktime_err : "Destectouse un desfase horario entre o seu sistema e o servidor. Debe corrixir a hora do seu sistema antes de continuar.",
		checktime_local_time : "Hora do seu sistema",
		checktime_server_time : "Hora do servidor"
	};
	var DEFAULT_LOCALE = LOCALIZED_STRINGS["es_ES"];
	var currentLocale = DEFAULT_LOCALE;
	var BUFFER_SIZE = 1024 * 1024;
	var B64_BUFFER_SIZE = this.BUFFER_SIZE * 3 / 4;
	var EOF = "%%EOF%%";
	/**
	 * 
	 * Valores para la configuracion de la comprobacion de tiempo
	 */
	var CHECKTIME_NO = "CT_NO";
	var CHECKTIME_RECOMMENDED = "CT_RECOMMENDED";
	var CHECKTIME_OBLIGATORY = "CT_OBLIGATORY";
	var cargarMiniApplet = function() {
	}
	var echo = function() {
		invoker.invoke(
		/** command */
		"echo",
		/** parameters */
		undefined,
		/** successCallback */
		undefined,
		/** errorCallback */
		undefined,
		/** beforeSendCallback */
		undefined,
		/** completeCallback */
		undefined);
	}
	var exit = function() {
		invoker.invoke(
		/** command */
		"exit",
		/** parameters */
		undefined,
		/** successCallback */
		undefined,
		/** errorCallback */
		undefined,
		/** beforeSendCallback */
		undefined,
		/** completeCallback */
		undefined);
	}
	function signOperation(signId, dataB64, algorithm, format, extraParams) {
	}

	var sign = function(dataB64, algorithm, format, params, successCallback,
			errorCallback) {
		signOperation("sign", dataB64, algorithm, format, params,
				successCallback, errorCallback)
	}
	var coSign = function(signB64, dataB64, algorithm, format, params,
			successCallback, errorCallback) {
		signOperation("coSign", dataB64, algorithm, format, params,
				successCallback, errorCallback)
	}
	var counterSign = function(signB64, algorithm, format, params,
			successCallback, errorCallback) {
		signOperation("counterSign", dataB64, algorithm, format, params,
				successCallback, errorCallback)
	}

	/**
	 * 
	 * Metodos que publicamos del objeto MiniApplet
	 */
	return {
		VERSION : VERSION,
		/*
		 * 
		 * Publicamos las variables para la comprobacion de hora.
		 */
		CHECKTIME_NO : CHECKTIME_NO,
		CHECKTIME_RECOMMENDED : CHECKTIME_RECOMMENDED,
		CHECKTIME_OBLIGATORY : CHECKTIME_OBLIGATORY,
		/*
		 * 
		 * Cliente en si!
		 */
		cargarMiniApplet : cargarMiniApplet,
		exit : exit,
		echo : echo,
		sign : sign,
		coSign : coSign,
		counterSign : counterSign
	}
})(window, undefined);
