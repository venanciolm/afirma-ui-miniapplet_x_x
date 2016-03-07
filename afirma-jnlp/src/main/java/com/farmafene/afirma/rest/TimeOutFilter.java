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

import java.io.IOException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.farmafene.afirma.CloseWindowAdapter;

/**
 * Filtro para matar por timeOut el paquete
 * 
 * @author vlopez@farmafene.com
 */
class TimeOutFilter implements ContainerResponseFilter, ContainerRequestFilter, Runnable {

	private static final Logger logger = LoggerFactory.getLogger(TimeOutFilter.class);
	private int timeout = -1;
	private BlockingQueue<String> queue = new LinkedBlockingQueue<>();
	private CloseWindowAdapter adapter;

	public TimeOutFilter() {

	}

	/**
	 * {@inheritDoc}
	 * 
	 * @see java.lang.Runnable#run()
	 */
	@Override
	public void run() {
		logger.debug("Configurando timeout a {} minutos", timeout);
		try {
			for (;;) {
				String item = null;
				if (-1 == timeout) {
					queue.take();
				} else {
					item = queue.poll(timeout, TimeUnit.MINUTES);
				}
				if (null == item) {
					throw new InterruptedException("Se ha producido un timeout controlado");
				}
			}
		} catch (InterruptedException e) {
			logger.info("Timeout!!!! {}", e.getMessage());
			logger.info("Timeout!!!! Matando el servidor");
			this.adapter.forceClose();
		}
	}

	/**
	 * {@inheritDoc}
	 * 
	 * @see javax.ws.rs.container.ContainerResponseFilter#filter(javax.ws.rs.container.ContainerRequestContext,
	 *      javax.ws.rs.container.ContainerResponseContext)
	 */
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
			throws IOException {
		this.filter(requestContext);
	}

	/**
	 * {@inheritDoc}
	 * 
	 * @see javax.ws.rs.container.ContainerRequestFilter#filter(javax.ws.rs.container.ContainerRequestContext)
	 */
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		if (-1 != timeout) {
			try {
				queue.put("");
			} catch (InterruptedException e) {
				// do nothing
			}
		}
	}

	public int getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public void setAdapter(CloseWindowAdapter adapter) {
		this.adapter = adapter;
	}
}
