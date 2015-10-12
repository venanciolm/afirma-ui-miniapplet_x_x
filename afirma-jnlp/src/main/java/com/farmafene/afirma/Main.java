package com.farmafene.afirma;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.farmafene.afirma.rest.ServerCtrl;

public class Main {

	private static final Logger logger = LoggerFactory.getLogger(Main.class);
	public static JButton item;
	public static void main(String... args) {
		final ServerCtrl serverCtrl = new ServerCtrl();

		final JFrame frame = new JFrame(/*"HelloWorldSwing"*/);
//		final JLabel label = new JLabel("Hello World");
//		frame.getContentPane().add(label);
		frame.addWindowListener(new WindowAdapter() {
			/**
			 * {@inheritDoc}
			 * 
			 * @see java.awt.event.WindowAdapter#windowClosing(java.awt.event.WindowEvent)
			 */
			@Override
			public void windowClosing(WindowEvent event) {
				logger.info("Procediendo a cerrar la ventana");
				serverCtrl.getServerLatch().countDown();
				logger.info("Destruida la ventana");
				event.getWindow().dispose();
			}
		});
		// frame.pack();
//		frame.setLayout(new GridLayout(2, 1));
//		frame.add(label);
		JButton b = new JButton("Abre");
		item = b;
		// b.setLocation(0, 200);
		frame.add(b);
		b.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent ae) {
				logger.info("Abriendo la ventana");
				JFileChooser chooser = new JFileChooser();
				chooser.setMultiSelectionEnabled(true);
				int option = chooser.showOpenDialog(frame);
				if (option == JFileChooser.APPROVE_OPTION) {
					File[] sf = chooser.getSelectedFiles();
					String filelist = "nothing";
					if (sf.length > 0)
						filelist = sf[0].getName();
					for (int i = 1; i < sf.length; i++) {
						filelist += ", " + sf[i].getName();
					}
				}
				chooser.setVisible(true);
				chooser.requestFocusInWindow();
			}
		});
		frame.setSize(0,0);
		Executor ex = Executors.newSingleThreadExecutor();
		ex.execute(new Runnable() {

			@Override
			public void run() {
				logger.info("Procediendo a a levantar el Jetty");
				try {
					serverCtrl.done();
				} catch (Exception e) {
					logger.error("Excepción en la creación del Servidor", e);
				}

			}
		});
	}
}
