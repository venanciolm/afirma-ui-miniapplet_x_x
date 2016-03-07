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

import java.awt.AWTException;
import java.awt.Menu;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.Toolkit;
import java.awt.TrayIcon;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URL;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.swing.JFrame;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.farmafene.afirma.rest.ServerCtrl;
import com.farmafene.protocolurl.URLProtocol;
import com.farmafene.protocolurl.URLProtocolParser;

import es.gob.afirma.miniapplet.MiniAfirmaApplet;

public class Main {

	private static final Logger logger = LoggerFactory.getLogger(Main.class);
	private static int POOL_SIZE = 5;

	public void init(int[] ports, int minutes, String sessionId) {
		final MiniAfirmaApplet applet = startApplet();
		final ServerCtrl serverCtrl;
		final ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(POOL_SIZE, POOL_SIZE, 10, TimeUnit.SECONDS,
				new LinkedBlockingQueue<Runnable>());
		serverCtrl = new ServerCtrl();
		final JFrame frame = new JFrame();
		final CloseWindowAdapter closeImpl = new CloseWindowAdapter(threadPoolExecutor, serverCtrl, frame);
		serverCtrl.setCloseHander(closeImpl);
		serverCtrl.setExecutor(threadPoolExecutor);
		serverCtrl.setWrapper(applet);
		serverCtrl.setJettyPorts(ports);
		serverCtrl.setSessionId(sessionId);
		if (minutes > 0) {
			serverCtrl.setTimeout(minutes);
		}
		frame.setUndecorated(true);
		frame.setSize(0, 0);
		frame.addWindowListener(closeImpl);
		frame.setSize(0, 0);
		threadPoolExecutor.execute(new StartSeverTask(serverCtrl));
		final URL image = Thread.currentThread().getContextClassLoader().getResource("resources/certicon.png");
		if (SystemTray.isSupported()) {
			final TrayIcon trayIcon = new TrayIcon(Toolkit.getDefaultToolkit().createImage(image));
			trayIcon.setImageAutoSize(true);
			final SystemTray tray = SystemTray.getSystemTray();
			// Create a pop-up menu components
			final Menu displayMenu = new Menu("Display");
			final MenuItem exitItem = new MenuItem("Exit");
			exitItem.addActionListener(new ActionListener() {
				@Override
				public void actionPerformed(final ActionEvent e) {
					threadPoolExecutor.execute(new Runnable() {
						@Override
						public void run() {
							closeImpl.forceClose();
						}
					});
				}
			});

			// Add components to pop-up menu
			final PopupMenu popup = new PopupMenu();
			popup.add(displayMenu);
			displayMenu.add(exitItem);

			trayIcon.setPopupMenu(popup);
			try {
				tray.add(trayIcon);
			} catch (final AWTException e) {
				logger.warn("TrayIcon could not be added.", e);
			}
		} else {
			logger.warn("TrayIcon could not be added.");
		}
	}

	/**
	 * @return
	 */
	private MiniAfirmaApplet startApplet() {
		final MiniAfirmaApplet applet = new MiniAfirmaApplet();
		applet.setStub(new StupImpl(applet));
		applet.init();
		applet.start();
		return applet;
	}

	private static int[] getPorts(String sPorts, int[] ports) {
		if (sPorts == null || "".equals(sPorts.trim())) {
			return ports;
		}
		String[] sp = sPorts.split(",");
		int[] out = new int[sp.length];
		int index = 0;
		for (String s : sp) {
			out[index++] = Integer.parseInt(s);
		}
		return out;
	}

	public static void main(final String... args) {
		final Main main = new Main();
		int[] ports = { 9999 };
		String sessionId = "";
		int minutes = 4;
		logger.error("Tenemos: argumentos? {}", args.length);
		logger.error("Tenemos: itemURL {}", System.getProperty("itemURL"));
		if (args.length > 0) {
			String url = args[0];
			if ("-open".equals(url) && args.length > 1) {
				url = args[1];
			}
			logger.error("La url es '{}'", url);
			URLProtocol p = URLProtocolParser.parse(url);
			logger.error("La url es '{}'", p);
			minutes = Integer.parseInt(p.getParamValue("timeout"));
			sessionId = p.getParamValue("sessionId");
			String sPorts = p.getParamValue("ports");
			ports = getPorts(sPorts, ports);
		}
		main.init(ports, minutes, sessionId);
	}
}
