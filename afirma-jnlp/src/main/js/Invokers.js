/**
 * 
 * Prototipo de un invoker
 * 
 * @constructor
 * @this {InvokerAbstract}
 * @return {InvokerAbstract}
 * 
 * ____________________________________________________________________________
 */
var InvokerAbstract = function() {

}
InvokerAbstract.constructor = InvokerAbstract;
InvokerAbstract.prototype.toString = function() {
	return "InvokerAbstract={}";
}
/**
 * @this {InvokerAbstract}
 * @param {string}
 *            command
 * @param {Object}
 *            parameters
 * @param {Function}
 *            successCallback
 * @param {Function}
 *            errorCallback
 * @param {Function}
 *            beforeSendCallback
 * @param {Function}
 *            completeCallback
 */
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
 * @constructor
 * @this {InvokerWithState}
 * @param {String}
 *            protocol
 * @return {InvokerWithState}
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
	this._LAUNCHING_TIME = 5000;
	this._CONNECTION_RETRIES = 20;
	this._invokers = [];
	this._invokers[0] = new SearchPortInvoker(this);
	this._invokers[1] = new PortByCookieInvoker(this);
	this._invokers[2] = new PortDetectedInvoker(this);
	this._invokers[3] = new ErrorInvoker(this);
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
InvokerWithState.prototype.alert = function(
/** {String} */
text) {
	alert(text);
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
 * @constructor
 * @this {SearchPortInvoker}
 * @param {InvokerWithState}
 *            parent
 * @return {SearchPortInvoker}
 * 
 * ____________________________________________________________________________
 */
var SearchPortInvoker = function(parent) {
	this._parent = parent;
}
/**
 * @this {SearchPortInvoker}
 * @param {string}
 *            command
 * @param {Object}
 *            parameters
 * @param {Function}
 *            successCallback
 * @param {Function}
 *            errorCallback
 * @param {Function}
 *            beforeSendCallback
 * @param {Function}
 *            completeCallback
 */
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
		if (httpRequest.readyState == 4 && httpRequest.status == 200 && retorno) {
			//
			//
			// hemos encontrado el puerto!!!
			//
			actualInvoker._parent.changeState(2, port, sessionId, command,
					parameters, successCallback, errorCallback,
					beforeSendCallback, completeCallback);
		} else if (timeoutResetCounter == 0) {
			actualInvoker._parent.changeState(3, "", "", command, parameters,
					successCallback, errorCallback, beforeSendCallback,
					completeCallback);
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
 * @constructor
 * @this {PortByCookieInvoker}
 * @param {InvokerWithState}
 *            parent
 * @return {PortByCookieInvoker}
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
/**
 * @this {PortByCookieInvoker}
 * @param {string}
 *            command
 * @param {Object}
 *            parameters
 * @param {Function}
 *            successCallback
 * @param {Function}
 *            errorCallback
 * @param {Function}
 *            beforeSendCallback
 * @param {Function}
 *            completeCallback
 */
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
 * @constructor
 * @this {PortDetectedInvoker}
 * @param {InvokerWithState}
 *            parent
 * @returns {PortDetectedInvoker}
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
/**
 * @this {PortDetectedInvoker}
 * @param {string}
 *            command
 * @param {Object}
 *            parameters
 * @param {Function}
 *            successCallback
 * @param {Function}
 *            errorCallback
 * @param {Function}
 *            beforeSendCallback
 * @param {Function}
 *            completeCallback
 */
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
	var item = this._parent;
	var httpRequest = item.getHttpRequest();
	httpRequest.open("POST", this._parent.getURL(command,
			this._parent._currentPort), true);
	httpRequest.setRequestHeader("Content-type", "application/json");
	httpRequest.setRequestHeader("Accept", "application/json; charset=utf-8");
	var f_onreadystatechange = function(event) {
		var retorno = false;
		if (beforeSendCallback) {
			beforeSendCallback(parameters, httpRequest);
		}
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			response = JSON.parse(httpRequest.responseText);
			if (response.error == 0) {
				item.createCookie(item._PREFIX_APP + "_port",
						item._currentPort, item._MINUTES_TIMEOUT);
				item.createCookie(item._PREFIX_APP + "_session",
						item._sessionId, item._MINUTES_TIMEOUT);
				if (successCallback) {
					successCallback(response, httpRequest);
				}
			} else {
				if (errorCallback) {
					errorCallback(parameters, response, httpRequest);
				}
			}
			if (completeCallback) {
				completeCallback(parameters, response, httpRequest);
			}
		} else if (httpRequest.readyState == 4) {
			var cookiePort = item.readCookie(this._PREFIX_APP + "_port");
			var cookieSession = item.readCookie(this._PREFIX_APP + "_session");
			if (cookiePort && cookieSession) {
				//
				//
				// Esto es un error ... y lo presentamos
				item._invokers[3]._error = item._NUM_PORTS - 1;
				item.changeState(3, "", "", command, parameters,
						successCallback, errorCallback, beforeSendCallback,
						completeCallback);
			} else {
				//
				//
				// Tenemos una caida por timeout
				//
				item.changeState(0, "", "", command, parameters,
						successCallback, errorCallback, beforeSendCallback,
						completeCallback);
			}
			return;
		}
	}
	httpRequest.onreadystatechange = f_onreadystatechange;
	httpRequest.send(request);
}
/**
 * 
 * Ejecución con error
 * 
 * @constructor
 * @this {ErrorInvoker}
 * @param {InvokerWithState}
 *            parent
 * @return {ErrorInvoker}
 * 
 * ____________________________________________________________________________
 */

var ErrorInvoker = function(parent) {
	this._parent = parent;
	this._error = 0;
}
ErrorInvoker.prototype = new InvokerAbstract();
ErrorInvoker.constructor = ErrorInvoker;
ErrorInvoker.prototype.toString = function() {
	return "ErrorInvoker={}";
}
ErrorInvoker.prototype.invoke = function(
/* String */command,
/* Any */parameters,
/**/successCallback,
/**/errorCallback,
/**/beforeSendCallback,
/**/completeCallback) {
	var item = this._parent;
	this._error += 1;
	if (this._error == item._NUM_PORTS) {
		if (errorCallback) {
			errorCallback(parameters, undefined, undefined);
		}
	} else if (this._error > item._NUM_PORTS) {
		this._error = 0;
		item.changeState(0, "", "", command, parameters, successCallback,
				errorCallback, beforeSendCallback, completeCallback);
	}
}

var Miniapplet13 = (function(window, undefined) {
	var VERSION = "1.3";
	var invoker = new InvokerWithState("afirmajnlp");
	var LOCALIZED_STRINGS = new Array();
	var locale = "es";
	LOCALIZED_STRINGS["es_ES"] = {
		checktime_warn : "Se ha detectado un desfase horario entre su sistema y el servidor. Se recomienda que se corrija antes de pulsar Aceptar para continuar.",
		checktime_err : "Se ha detectado un desfase horario entre su sistema y el servidor. Debe corregir la hora de su sistema antes de continuar.",
		checktime_local_time : "Hora de su sistema",
		checktime_server_time : "Hora del servidor"
	};
	LOCALIZED_STRINGS["es"] = {
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
	LOCALIZED_STRINGS["gl"] = {
		checktime_warn : "Destectouse un desfase horario entre o seu sistema e o servidor. Recoméndase corrixilo antes de pulsar Aceptar para continuar.",
		checktime_err : "Destectouse un desfase horario entre o seu sistema e o servidor. Debe corrixir a hora do seu sistema antes de continuar.",
		checktime_local_time : "Hora do seu sistema",
		checktime_server_time : "Hora do servidor"
	};
	var severeTimeDelay = false;
	var DEFAULT_LOCALE = LOCALIZED_STRINGS[locale];
	var currentLocale = DEFAULT_LOCALE;
	var BUFFER_SIZE = 1024 * 1024;
	var B64_BUFFER_SIZE = BUFFER_SIZE * 3 / 4;
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
	var setLocale = function(newLocale) {
		locale = newLocale;
		DEFAULT_LOCALE = LOCALIZED_STRINGS[locale];
	}
	var checkTime = function(checkType, maxMillis) {

		if (checkType == undefined || checkType == null
				|| checkType == CHECKTIME_NO || maxMillis == undefined
				|| maxMillis == null || maxMillis < /* = */0) {
			return;
		}
		// Hacemos una llamada al servidor para conocer su hora
		var xhr = invoker.getHttpRequest();
		xhr.open('GET', document.URL + '/' + Math.random(), false);
		xhr.send();

		// Recogemos la hora local, nada mas obtener la respuesta del servidor
		var clientDate = new Date();
		// Tomamos la hora a partir de la respuesta del servidor. Si esta es 0,
		// estamos en local
		var serverDate = new Date(xhr.getResponseHeader("Date"));
		if (serverDate == null || serverDate.getTime() == 0) {
			// No hacemos nada si estamos en local
			return;
		}
		var delay = Math.abs(clientDate.getTime() - serverDate.getTime());
		if (delay >= maxMillis) {
			if (checkType == CHECKTIME_RECOMMENDED) {
				invoker.alert(DEFAULT_LOCALE.checktime_warn + "\n"
						+ DEFAULT_LOCALE.checktime_local_time
						+ clientDate.toLocaleString() + "\n"
						+ DEFAULT_LOCALE.checktime_server_time
						+ serverDate.toLocaleString());
			} else if (checkType == CHECKTIME_OBLIGATORY) {
				severeTimeDelay = true;
				invoker.alert(DEFAULT_LOCALE.checktime_err + "\n"
						+ DEFAULT_LOCALE.checktime_local_time
						+ clientDate.toLocaleString() + "\n"
						+ DEFAULT_LOCALE.checktime_server_time
						+ serverDate.toLocaleString());
			}
		}
	}
	var getErrorMessage = function(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback) {
		invoker.invoke(
		/** command */
		"getErrorMessage",
		/** parameters */
		undefined,
		/** successCallback */
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(response.msg);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var getErrorType = function(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback) {
		invoker.invoke(
		/** command */
		"getErrorType",
		/** parameters */
		undefined,
		/** successCallback */
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(response.msg);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var getCurrentLog = function(maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback) {
		invoker.invoke(
		/** command */
		"getCurrentLog",
		/** parameters */
		undefined,
		/** successCallback */
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(response.msg);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}

	var echo = function(maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback) {
		invoker.invoke(
		/** command */
		"echo",
		/** parameters */
		undefined,
		/** successCallback */
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(undefined);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var exit = function(maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback) {
		invoker.invoke(
		/** command */
		"exit",
		/** parameters */
		undefined,
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(undefined);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var setStickySignatory = function(sticky
	/** adicionales */
	, maSuccessCallback, maErrorCallback, beforeSendCallback, completeCallback) {
		var parameters = new Object();
		parameters.sticky = sticky;
		var innerCallBack = function() {
		}
		invoker.invoke(
		/** command */
		"setStickySignatory",
		/** parameters */
		parameters,
		/** successCallback */
		function(response, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(undefined);
			}
		},
		/** errorCallback */
		function(params, response, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(undefined, undefined);
			}
		},
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var getBase64FromText = function(plainText, charset, maSuccessCallback,
			maErrorCallback, beforeSendCallback, completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msg = "";
		textResponse.dataToSend = plainText;
		var efectiveBeforeSendCallback = beforeSendCallback;
		var errorCallback = function(params, item, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, item, xmlReq)
			}
			delete item.error;
			delete item.descError;
			delete item.type;
			delete item.time;
			delete item.id;
			delete item.dataToSend;
			delete item.msg;
			delete item;
		}
		var paramsInner = new Object();
		paramsInner.charset = charset;
		var cont = false;
		var innerSuccess = function( /* Any */response, /* XMLHttpRequest */
		xmlReq) {
			if (response) {
				textResponse.error = response.error;
				textResponse.descError = response.descError;
				textResponse.time = response.time;
				textResponse.id = response.id;
				textResponse.msg += response.msg;
				delete response.error;
				delete response.type;
				delete response.id;
				delete response.time;
				delete response.msg;
				delete response;
			}
			cont = false;
			if (textResponse.dataToSend && textResponse.dataToSend.length > 0) {
				cont = true;
				if (textResponse.dataToSend.length > BUFFER_SIZE) {
					paramsInner.plainText = textResponse.dataToSend.substring(
							0, BUFFER_SIZE);
					textResponse.dataToSend = textResponse.dataToSend
							.substring(BUFFER_SIZE);
				} else {
					paramsInner.plainText = textResponse.dataToSend;
					delete textResponse.dataToSend;
				}
			}
			if (!cont) {
				if (maSuccessCallback) {
					maSuccessCallback(/* String */textResponse.msg);
				}
				if (completeCallback) {
					completeCallback(undefined, textResponse, xmlReq);
				}
				delete textResponse.error;
				delete textResponse.descError;
				delete textResponse.time;
				delete textResponse.id;
				delete textResponse.type;
				delete textResponse.dataToSend;
				delete textResponse.msg;
				delete textResponse;
			}
			if (cont) {
				invoker.invoke(
				/** String */
				"getBase64FromText",
				/** Any */
				paramsInner,
				/** successCallback */
				innerSuccess,
				/** errorCallback */
				errorCallback,
				/** beforeSendCallback */
				efectiveBeforeSendCallback,
				/** completeCallback */
				undefined);
				efectiveBeforeSendCallback = null;
			}
		}
		innerSuccess(undefined, undefined);
	}
	var getTextFromBase64 = function(data, charset, maSuccessCallback,
			maErrorCallback, beforeSendCallback, completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msg = "";
		textResponse.dataToSend = data;
		var efectiveBeforeSendCallback = beforeSendCallback;
		var errorCallback = function(params, item, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, item, xmlReq)
			}
			delete item.error;
			delete item.descError;
			delete item.type;
			delete item.time;
			delete item.id;
			delete item.dataToSend;
			delete item.msg;
			delete item;
		}
		var paramsInner = new Object();
		paramsInner.charset = charset;
		var cont = false;
		var innerSuccess = function( /* Any */response, /* XMLHttpRequest */
		xmlReq) {
			if (response) {
				textResponse.error = response.error;
				textResponse.descError = response.descError;
				textResponse.time = response.time;
				textResponse.id = response.id;
				textResponse.msg += response.msg;
				delete response.error;
				delete response.type;
				delete response.id;
				delete response.time;
				delete response.msg;
				delete response;
			}
			cont = false;
			if (textResponse.dataToSend && textResponse.dataToSend.length > 0) {
				cont = true;
				if (textResponse.dataToSend.length > B64_BUFFER_SIZE) {
					paramsInner.data = textResponse.dataToSend.substring(0,
							B64_BUFFER_SIZE);
					textResponse.dataToSend = textResponse.dataToSend
							.substring(B64_BUFFER_SIZE);
				} else {
					paramsInner.data = textResponse.dataToSend;
					delete textResponse.dataToSend;
				}
			}
			if (!cont) {
				if (maSuccessCallback) {
					maSuccessCallback(/* String */textResponse.msg);
				}
				if (completeCallback) {
					completeCallback(undefined, textResponse, xmlReq);
				}
				delete textResponse.error;
				delete textResponse.descError;
				delete textResponse.time;
				delete textResponse.id;
				delete textResponse.type;
				delete textResponse.dataToSend;
				delete textResponse.msg;
				delete textResponse;
			}
			if (cont) {
				invoker.invoke(
				/** String */
				"getTextFromBase64",
				/** Any */
				paramsInner,
				/** successCallback */
				innerSuccess,
				/** errorCallback */
				errorCallback,
				/** beforeSendCallback */
				efectiveBeforeSendCallback,
				/** completeCallback */
				undefined);
				efectiveBeforeSendCallback = null;
			}
		}
		innerSuccess(undefined, undefined);
	}
	var buildDataRecursive = function(textResponse, successCallback,
			errorCallback) {
		var paramsInner = new Object();
		var cont = false;
		var buildDataRecursiveInner = function( /* Any */response, /* XMLHttpRequest */
		xmlReq) {
			if (response) {
				textResponse.error = response.error;
				textResponse.descError = response.descError;
				textResponse.time = response.time;
				textResponse.id = response.id;
				delete response.error;
				delete response.type;
				delete response.id;
				delete response.time;
				delete response;
			}
			cont = false;
			if (textResponse.dataToSend && textResponse.dataToSend.length > 0) {
				cont = true;
				if (textResponse.dataToSend.length > BUFFER_SIZE) {
					paramsInner.data = textResponse.dataToSend.substring(0,
							BUFFER_SIZE);
					textResponse.dataToSend = textResponse.dataToSend
							.substring(BUFFER_SIZE);
				} else {
					paramsInner.data = textResponse.dataToSend;
					delete textResponse.dataToSend;
				}
			}
			if (!cont) {
				delete textResponse.dataToSend;
				if (successCallback) {
					successCallback(textResponse, xmlReq);
				}
			}
			if (cont) {
				invoker.invoke(
				/** String */
				"addData",
				/** Any */
				paramsInner,
				/** successCallback */
				buildDataRecursiveInner,
				/** errorCallback */
				errorCallback,
				/** beforeSendCallback */
				undefined,
				/** completeCallback */
				undefined);
			}

		}
		buildDataRecursiveInner();
	}
	var retriveDataRecursive = function(textResponse, successCallback,
			errorCallback) {
		var paramsInner = new Object();
		var cont = false;
		var retriveDataRecursiveInner = function( /* Any */response, /* XMLHttpRequest */
		xmlReq) {
			cont = true;
			if (response) {
				textResponse.error = response.error;
				textResponse.descError = response.descError;
				textResponse.time = response.time;
				textResponse.id = response.id;
				cont = EOF != response.msg;
				if (cont) {
					textResponse.msg += response.msg;
				}
				delete response.error;
				delete response.type;
				delete response.id;
				delete response.time;
				delete response.msg;
				delete response;
			}
			if (!cont) {
				if (successCallback) {
					successCallback(textResponse, xmlReq);
				}
			}
			if (cont) {
				invoker.invoke(
				/** String */
				"getRemainingData",
				/** Any */
				paramsInner,
				/** successCallback */
				retriveDataRecursiveInner,
				/** errorCallback */
				errorCallback,
				/** beforeSendCallback */
				undefined,
				/** completeCallback */
				undefined);
			}
		}
		retriveDataRecursiveInner(undefined, undefined);
	}
	function signOperation(signId, dataB64, algorithm, format, extraParams,
			maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msg = "";
		textResponse.pemCertificate = "";
		textResponse.dataToSend = dataB64;
		var params = new Object();
		params.algorithm = algorithm;
		params.format = format;
		params.extraParams = extraParams;
		var errorCallback = function(item, textResponse, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var retriveDataRecursiveCallback = function(textResponse, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(textResponse.msg);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var signOperationSuccess = function(response, xmlReq) {
			retriveDataRecursive(response, retriveDataRecursiveCallback,
					errorCallback);
		}
		var buildDataSuccessCallback = function(item, xmlReq) {
			invoker.invoke(
			/** String */
			signId,
			/** Any */
			params,
			/** successCallback */
			signOperationSuccess,
			/** errorCallback */
			errorCallback,
			/** beforeSendCallback */
			undefined,
			/** completeCallback */
			undefined);
		}
		if (beforeSendCallback) {
			beforeSendCallback(params, undefined);
		}
		buildDataRecursive(textResponse, buildDataSuccessCallback,
				errorCallback);
	}

	var sign = function(dataB64, algorithm, format, params, successCallback,
			errorCallback, beforeSendCallback, completeCallback) {
		signOperation("sign", dataB64, algorithm, format, params,
				successCallback, errorCallback, beforeSendCallback,
				completeCallback)
	}
	var coSign = function(signB64, dataB64, algorithm, format, params,
			successCallback, errorCallback, beforeSendCallback,
			completeCallback) {
		signOperation("coSign", dataB64, algorithm, format, params,
				successCallback, errorCallback, beforeSendCallback,
				completeCallback)
	}
	var counterSign = function(signB64, algorithm, format, params,
			successCallback, errorCallback, beforeSendCallback,
			completeCallback) {
		signOperation("counterSign", dataB64, algorithm, format, params,
				successCallback, errorCallback, beforeSendCallback,
				completeCallback)
	}
	var setServlets = function(storageServlet, retrieverServlet) {
		// throw "Not Supported!";
		// do nothing
	}
	var saveDataToFile = function(dataB64, title, fileName, extension,
			description, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msg = "";
		textResponse.dataToSend = dataB64;
		var params = new Object();
		params.title = title;
		params.fileName = fileName;
		params.extension = extension;
		params.description = description;
		var errorCallback = function(item, textResponse, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var saveDataToFileSuccess = function(textResponse, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(textResponse.msg);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var buildDataSuccessCallback = function(item, xmlReq) {
			invoker.invoke(
			/** String */
			"saveDataToFile",
			/** Any */
			params,
			/** successCallback */
			saveDataToFileSuccess,
			/** errorCallback */
			errorCallback,
			/** beforeSendCallback */
			undefined,
			/** completeCallback */
			undefined);
		}
		if (beforeSendCallback) {
			beforeSendCallback(params, undefined);
		}
		buildDataRecursive(textResponse, buildDataSuccessCallback,
				errorCallback);
	}
	var getFileNameContentBase64 = function(title, extensions, description,
			filePath, maSuccessCallback, maErrorCallback, beforeSendCallback,
			completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msg = "";
		var params = new Object();
		params.title = title;
		params.extensions = extensions;
		params.description = description;
		params.filePath = filePath;
		var errorCallback = function(item, textResponse, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var retriveDataRecursiveCallback = function(textResponse, xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(textResponse.msg);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var getFileNameContentBase64Callback = function(textResponse, xmlReq) {
			retriveDataRecursive(response, retriveDataRecursiveCallback,
					errorCallback);
		}
		if (beforeSendCallback) {
			beforeSendCallback(params, undefined);
		}
		invoker.invoke(
		/** String */
		"getFileNameContentBase64",
		/** Any */
		params,
		/** successCallback */
		getFileNameContentBase64Callback,
		/** errorCallback */
		errorCallback,
		/** beforeSendCallback */
		undefined,
		/** completeCallback */
		undefined);
	}
	var getMultiFileNameContentBase64 = function(title, extensions,
			description, filePath, maSuccessCallback, maErrorCallback,
			beforeSendCallback, completeCallback) {
		var textResponse = new Object();
		textResponse.error = -2;
		textResponse.descError = "";
		textResponse.time = "";
		textResponse.id = -1;
		textResponse.msgs = [];
		var params = new Object();
		params.title = title;
		params.extensions = extensions;
		params.description = description;
		params.filePath = filePath;
		var errorCallback = function(item, textResponse, xmlReq) {
			if (maErrorCallback) {
				maErrorCallback(/* String */undefined,/* String */undefined);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msg;
			delete textResponse;
		}
		var getMultiFileNameContentBase64Callback = function(textResponse,
				xmlReq) {
			if (maSuccessCallback) {
				maSuccessCallback(textResponse.msgs);
			}
			if (completeCallback) {
				completeCallback(params, textResponse, xmlReq);
			}
			delete textResponse.error;
			delete textResponse.descError;
			delete textResponse.time;
			delete textResponse.id;
			delete textResponse.type;
			delete textResponse.dataToSend;
			delete textResponse.msgs;
			delete textResponse;
		}
		invoker.invoke(
		/** command */
		"getMultiFileNameContentBase64",
		/** parameters */
		params,
		/** successCallback */
		getMultiFileNameContentBase64Callback,
		/** errorCallback */
		errorCallback,
		/** beforeSendCallback */
		beforeSendCallback,
		/** completeCallback */
		completeCallback);
	}
	var setAlert = function(fn_alert) {
		invoker.alert = fn_alert;
	}
	var alert = function(texto) {
		invoker.alert(texto);
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
		getErrorMessage : getErrorMessage,
		getErrorType : getErrorType,
		getCurrentLog : getCurrentLog,
		setServlets : setServlets,
		checkTime : checkTime,
		cargarMiniApplet : cargarMiniApplet,// deprecated
		exit : exit,
		echo : echo,
		sign : sign,
		coSign : coSign,
		counterSign : counterSign,
		getBase64FromText : getBase64FromText,
		getTextFromBase64 : getTextFromBase64,
		getFileNameContentBase64 : getFileNameContentBase64,
		saveDataToFile : saveDataToFile,
		getMultiFileNameContentBase64 : getMultiFileNameContentBase64,
		setAlert : setAlert,
		alert : alert
	}
})(window, undefined);

if (window && window.bootbox && bootbox) {
	Miniapplet13.setAlert(bootbox.alert);
}
