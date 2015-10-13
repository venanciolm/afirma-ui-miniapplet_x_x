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
import java.util.concurrent.Executor;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import es.gob.afirma.miniapplet.MiniAfirmaWrapper;

public class ServerCtrl {

	private static final Logger logger = LoggerFactory.getLogger(ServerCtrl.class);
	private Server jettyServer = null;
	private CountDownLatch serverLatch = new CountDownLatch(1);
	private Executor executor;
	private MiniAfirmaWrapper wrapper;

	public void done() throws Exception {
		final ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath("/afirma");

		this.jettyServer = new Server(9999);
		this.jettyServer.setHandler(context);

		final AfirmaRest request = new AfirmaRest();
		request.setExecutor(this.executor);
		request.setWrapper(this.wrapper);
		final ServletHolder aFirmaServlet = new ServletHolder(new ServletContainer(new ResourceConfig().register(request)));
		aFirmaServlet.setInitOrder(0);
		// todo lo del contexto /afirma, pertenece a este servlet ...
		context.addServlet(aFirmaServlet, "/*");
		this.jettyServer.start();
		logger.info("El servidor es: {} '{}'", this.jettyServer.getURI(), this.jettyServer.getState());
		this.serverLatch.await();
		try {
			context.stop();
			this.jettyServer.stop();
			logger.info("El servidor estado: '{}'", this.jettyServer.getState());
		} catch (final Exception e) {
			logger.error("Excepción al destruir el servidor!", e);
		}
	}

	/**
	 * @return the jettyServer
	 */
	public Server getJettyServer() {
		return this.jettyServer;
	}

	/**
	 * @return the serverLatch
	 */
	public CountDownLatch getServerLatch() {
		return this.serverLatch;
	}

	/**
	 * @param serverLatch the serverLatch to set
	 */
	public void setServerLatch(final CountDownLatch serverLatch) {
		this.serverLatch = serverLatch;
	}

	/**
	 * Devuelve el valor de la propiedad 'executor'
	 * @return Propiedad executor
	 */
	public Executor getExecutor() {
		return this.executor;
	}

	/**
	 * Asigna el valor de la propiedad 'executor'
	 * @param executor valor que se le quiere dar a la propiedad 'executor'
	 */
	public void setExecutor(final Executor executor) {
		this.executor = executor;
	}

	/**
	 * Devuelve el valor de la propiedad 'wrapper'
	 * @return Propiedad wrapper
	 */
	public MiniAfirmaWrapper getWrapper() {
		return this.wrapper;
	}

	/**
	 * Asigna el valor de la propiedad 'wrapper'
	 * @param wrapper valor que se le quiere dar a la propiedad 'wrapper'
	 */
	public void setWrapper(final MiniAfirmaWrapper wrapper) {
		this.wrapper = wrapper;
	}
}
