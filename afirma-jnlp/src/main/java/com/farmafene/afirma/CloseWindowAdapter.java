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

import java.awt.Window;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.farmafene.afirma.rest.ServerCtrl;

public class CloseWindowAdapter extends WindowAdapter {
	private static final Logger logger = LoggerFactory.getLogger(CloseWindowAdapter.class);
	private ThreadPoolExecutor threadPoolExecutor = null;
	private ServerCtrl serverCtrl = null;
	private final Window window;

	public CloseWindowAdapter(final ThreadPoolExecutor threadPoolExecutor, final ServerCtrl serverCtrl, final Window window) {
		this.threadPoolExecutor = threadPoolExecutor;
		this.serverCtrl = serverCtrl;
		this.window = window;
	}

	public void forceClose() {
		windowClosing(new WindowEvent(this.window, WindowEvent.WINDOW_CLOSING));

	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.awt.event.WindowAdapter#windowClosing(java.awt.event.WindowEvent)
	 */
	@Override
	public void windowClosing(final WindowEvent event) {
		logger.info("Procediendo a cerrar la ventana");
		this.threadPoolExecutor.shutdown();
		this.serverCtrl.getServerLatch().countDown();
		logger.info("Destruida la ventana");
		event.getWindow().dispose();
		logger.info("bye!!!");
		// TODO - Matar googleAnalitics!!!
		System.exit(0);
	}
}
