/*
 * Copyright (c) 2009-2015 farmafene.com
 * All rights reserved.
 * 
 * Permission is hereby granted, free  of charge, to any person obtaining
 * a  copy  of this  software  and  associated  documentation files  (the
 * "Software"), to  deal in  the Software without  restriction, including
 * without limitation  the rights to  use, copy, modify,  merge, publish,
 * distribute,  sublicense, and/or sell  copies of  the Software,  and to
 * permit persons to whom the Software  is furnished to do so, subject to
 * the following conditions:
 * 
 * The  above  copyright  notice  and  this permission  notice  shall  be
 * included in all copies or substantial portions of the Software.
 * 
 * THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 * EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 * MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package com.farmafene.afirma.rest;

import java.util.concurrent.CountDownLatch;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ServerCtrl {

	private static final String JERSEY_CONFIG_SERVER_PROVIDER_CLASSNAMES = "jersey.config.server.provider.classnames";
	private static final Logger logger = LoggerFactory
			.getLogger(ServerCtrl.class);
	private Server jettyServer = null;
	private CountDownLatch serverLatch = new CountDownLatch(1);

	public void done() throws Exception {
		ServletContextHandler context = new ServletContextHandler(
				ServletContextHandler.SESSIONS);
		context.setContextPath("/");

		jettyServer = new Server(9999);
		jettyServer.setHandler(context);

		ServletHolder jerseyServlet = context.addServlet(
				org.glassfish.jersey.servlet.ServletContainer.class, "/*");
		jerseyServlet.setInitOrder(0);

		// Tells the Jersey Servlet which REST service/class to load.
		jerseyServlet.setInitParameter(
				JERSEY_CONFIG_SERVER_PROVIDER_CLASSNAMES,
				EchoRest.class.getCanonicalName());

		jettyServer.start();
		logger.info("El servidor es: {} '{}'", jettyServer.getURI(),
				jettyServer.getState());
		serverLatch.await();
		try {
			context.stop();
			jettyServer.stop();
			logger.info("El servidor estado: '{}'", jettyServer.getState());
		} catch (Exception e) {
			logger.error("Excepción al destruir el servidor!", e);
		}
	}

	public static void main(String... args) throws Exception {
		new ServerCtrl().done();
	}

	/**
	 * @return the jettyServer
	 */
	public Server getJettyServer() {
		return jettyServer;
	}

	/**
	 * @return the serverLatch
	 */
	public CountDownLatch getServerLatch() {
		return serverLatch;
	}

	/**
	 * @param serverLatch
	 *            the serverLatch to set
	 */
	public void setServerLatch(CountDownLatch serverLatch) {
		this.serverLatch = serverLatch;
	}
}
