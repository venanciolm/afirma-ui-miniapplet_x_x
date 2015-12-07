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

import java.net.URL;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;

import org.eclipse.jetty.http.HttpVersion;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.core.util.StatusPrinter;

import com.farmafene.afirma.CloseWindowAdapter;

import es.gob.afirma.miniapplet.MiniAfirmaApplet;

public class ServerCtrl {

	private static final int HTTPS_IDLE_TIMEOUT = 500000;
	private static final int JETTY_OUTPUT_BUFFER_SIZE = 32768;
	private static final String BIND_ADDRESS = "localhost";
	private static final int JETTY_PORT = 9999;
	private static final String HTTPS_SCHEME = "https";
	private static final String AFIRMA_CTX = "/afirma";
	private static final Logger logger = LoggerFactory.getLogger(ServerCtrl.class);
	private Server jettyServer = null;
	private CountDownLatch serverLatch = new CountDownLatch(1);
	private Executor executor;
	private MiniAfirmaApplet wrapper;
	private CloseWindowAdapter closeHandler;

	/**
	 * {@link http
	 * ://www.eclipse.org/jetty/documentation/current/embedded-examples
	 * .html#embedded-many-connectors}
	 *
	 * @see http 
	 *      ://www.eclipse.org/jetty/documentation/current/embedded-examples.
	 *      html#embedded-many-connectors
	 * @throws Exception
	 */
	public void done() throws Exception {
		final ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath(AFIRMA_CTX);

		this.jettyServer = new Server();

		final SslContextFactory sslContextFactory = new SslContextFactory();
		final URL keyStoreURL = Thread.currentThread().getContextClassLoader().getResource("jks/jetty.keystore.jks");
		sslContextFactory.setKeyStorePath(keyStoreURL.toExternalForm());
		sslContextFactory.setKeyStorePassword("changeit");
		sslContextFactory.setKeyManagerPassword("changeit");

		final HttpConfiguration http_config = new HttpConfiguration();
		http_config.setSecureScheme(HTTPS_SCHEME);
		http_config.setSecurePort(getJettyPort());
		http_config.setOutputBufferSize(JETTY_OUTPUT_BUFFER_SIZE);

		final HttpConfiguration https_config = new HttpConfiguration(http_config);
		https_config.addCustomizer(new SecureRequestCustomizer());

		final ServerConnector https = new ServerConnector(this.jettyServer, new SslConnectionFactory(sslContextFactory,
				HttpVersion.HTTP_1_1.asString()), new HttpConnectionFactory(https_config));
		https.setPort(getJettyPort());
		https.setIdleTimeout(HTTPS_IDLE_TIMEOUT);
		https.setHost(BIND_ADDRESS);
		this.jettyServer.setConnectors(new Connector[] { https });
		this.jettyServer.setHandler(context);

		final AfirmaRest request = new AfirmaRest();
		request.setExecutor(this.executor);
		request.setWrapper(this.wrapper);
		request.setCloseHandler(this.closeHandler);

		final CorsFilter cors = new CorsFilter();
		final ResourceConfig resourceConfig = new ResourceConfig().register(request).register(cors);
		final ServletHolder aFirmaServlet = new ServletHolder(new ServletContainer(resourceConfig));
		aFirmaServlet.setInitOrder(0);
		// todo lo del contexto /afirma, pertenece a este servlet ...
		context.addServlet(aFirmaServlet, "/*");
		this.jettyServer.start();
		logger.info("El servidor es: {} '{}'", this.jettyServer.getURI(), this.jettyServer.getState());
		final LoggerContext lContext = (LoggerContext) LoggerFactory.getILoggerFactory();

		try {
			final JoranConfigurator configurator = new JoranConfigurator();
			configurator.setContext(lContext);
			// Call context.reset() to clear any previous configuration, e.g.
			// default
			// configuration. For multi-step configuration, omit calling
			// context.reset().
			lContext.reset();
			configurator.doConfigure(Thread.currentThread().getContextClassLoader().getResourceAsStream("logback.xml"));
		} catch (final JoranException je) {
			// StatusPrinter will handle this
		}
		StatusPrinter.printInCaseOfErrorsOrWarnings(lContext);
		this.serverLatch.await();
		if (null != this.wrapper) {
			logger.info("Destroy the Mini@firmaApplet");
			this.wrapper.stop();
		}
		try {
			context.stop();
			this.jettyServer.stop();
			((ExecutorService) this.executor).shutdown();
			logger.info("El servidor estado: '{}'", this.jettyServer.getState());
		} catch (final Exception e) {
			logger.error("Excepción al destruir el servidor!", e);
		}
	}

	private int getJettyPort() {
		return JETTY_PORT;
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
	 *
	 * @return Propiedad executor
	 */
	public Executor getExecutor() {
		return this.executor;
	}

	/**
	 * Asigna el valor de la propiedad 'executor'
	 *
	 * @param executor valor que se le quiere dar a la propiedad 'executor'
	 */
	public void setExecutor(final Executor executor) {
		this.executor = executor;
	}

	/**
	 * Devuelve el valor de la propiedad 'wrapper'
	 *
	 * @return Propiedad wrapper
	 */
	public MiniAfirmaApplet getWrapper() {
		return this.wrapper;
	}

	/**
	 * Asigna el valor de la propiedad 'wrapper'
	 *
	 * @param wrapper valor que se le quiere dar a la propiedad 'wrapper'
	 */
	public void setWrapper(final MiniAfirmaApplet wrapper) {
		this.wrapper = wrapper;
	}

	public void setCloseHander(final CloseWindowAdapter closeImpl) {
		this.closeHandler = closeImpl;
	}

}
