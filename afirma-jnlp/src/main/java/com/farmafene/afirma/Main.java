package com.farmafene.afirma;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.farmafene.afirma.rest.ServerCtrl;

public class Main {

	private static final Logger logger = LoggerFactory.getLogger(Main.class);
	public static JButton item;
	private static int POOL_SIZE = 5;

	public static void main(final String... args) {
		final ServerCtrl serverCtrl;
		final ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(POOL_SIZE, POOL_SIZE, 10, TimeUnit.SECONDS,
				new LinkedBlockingQueue<Runnable>());
		serverCtrl = new ServerCtrl();
		serverCtrl.setExecutor(threadPoolExecutor);
		serverCtrl.setWrapper(/* Debemos añadir el applet */null);// TODO
		final JFrame frame = new JFrame();
		frame.setUndecorated(true);
		frame.setSize(0, 0);
		frame.addWindowListener(new WindowAdapter() {
			/**
			 * {@inheritDoc}
			 *
			 * @see java.awt.event.WindowAdapter#windowClosing(java.awt.event.WindowEvent)
			 */
			@Override
			public void windowClosing(final WindowEvent event) {
				logger.info("Procediendo a cerrar la ventana");
				threadPoolExecutor.shutdown();
				serverCtrl.getServerLatch().countDown();
				logger.info("Destruida la ventana");
				event.getWindow().dispose();
			}
		});
		final JButton b = new JButton("Abre");
		item = b;
		frame.add(b);
		b.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(final ActionEvent ae) {
				logger.info("Abriendo la ventana");
				final JFileChooser chooser = new JFileChooser();
				frame.setAlwaysOnTop(true);
				frame.setVisible(true);
				frame.toFront();
				frame.setVisible(false);
				chooser.addComponentListener(new ComponentListener() {
					@Override
					public void componentShown(final ComponentEvent e) {
					}

					@Override
					public void componentResized(final ComponentEvent e) {
						chooser.setVisible(true);
						chooser.requestFocus();
					}

					@Override
					public void componentMoved(final ComponentEvent e) {
					}

					@Override
					public void componentHidden(final ComponentEvent e) {
					}
				});
				chooser.setMultiSelectionEnabled(true);
				logger.info("Antes");
				logger.info("Antes2");
				final int option = chooser.showOpenDialog(frame);
				logger.info("Despues");
				if (option == JFileChooser.APPROVE_OPTION) {
					final File[] sf = chooser.getSelectedFiles();
					@SuppressWarnings("unused")
					String filelist = "nothing";
					if (sf.length > 0) {
						filelist = sf[0].getName();
					}
					for (int i = 1; i < sf.length; i++) {
						filelist += ", " + sf[i].getName();
					}
				}
			}
		});
		frame.setSize(0, 0);
		threadPoolExecutor.execute(new Runnable() {
			@Override
			public void run() {
				logger.info("Procediendo a a levantar el Jetty");
				try {
					serverCtrl.done();
				} catch (final Exception e) {
					logger.error("Excepción en la creación del Servidor", e);
				}

			}
		});
	}
}
