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
package com.farmafene.afirma;

import java.applet.AppletContext;
import java.applet.AppletStub;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;

import javax.jnlp.BasicService;
import javax.jnlp.ServiceManager;
import javax.jnlp.UnavailableServiceException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import es.gob.afirma.miniapplet.MiniAfirmaApplet;

public class StupImpl implements AppletStub {

	private static final String JAVAX_JNLP_BASIC_SERVICE = "javax.jnlp.BasicService";
	private static final Logger logger = LoggerFactory
			.getLogger(StupImpl.class);
	private final MiniAfirmaApplet applet;

	/**
	 * @param applet
	 */
	public StupImpl(final MiniAfirmaApplet applet) {
		this.applet = applet;
	}

	/**
	 * {@inheritDoc}
	 * 
	 * @see java.applet.AppletStub#isActive()
	 */
	@Override
	public boolean isActive() {
		logger.info("isActive()");
		return this.applet.isActive();
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.applet.AppletStub#getDocumentBase()
	 */
	@Override
	public URL getDocumentBase() {
		return getCodeBase();
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.applet.AppletStub#getCodeBase()
	 */
	@Override
	public URL getCodeBase() {
		BasicService basicService = null;
		URL codeBase = null;
		try {
			basicService = (BasicService) ServiceManager
					.lookup(JAVAX_JNLP_BASIC_SERVICE);
			codeBase = basicService.getCodeBase();
		} catch (final UnavailableServiceException e) {
			try {
				codeBase = new File("").toURI().toURL();
			} catch (final MalformedURLException e1) {
			}
		}
		logger.info("getCodeBase(): {}", codeBase);
		return codeBase;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.applet.AppletStub#getParameter(java.lang.String)
	 */
	@Override
	public String getParameter(final String name) {
		logger.info("getParameter({})", name);
		String parameter="";
		if ("locale".equals(name)) {
			parameter = Locale.getDefault().toString();
		}
		return parameter;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.applet.AppletStub#getAppletContext()
	 */
	@Override
	public AppletContext getAppletContext() {
		logger.info("getAppletContext()");
		return null;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.applet.AppletStub#appletResize(int, int)
	 */
	@Override
	public void appletResize(final int width, final int height) {
		logger.info("appletResize({}, {})", width, height);
	}
}
