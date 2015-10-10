package com.farmafene.afirma;

import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class Main {

	public static void main(String... args) {
		final JFrame frame = new JFrame("HelloWorldSwing");
		final JLabel label = new JLabel("Hello World");
		frame.getContentPane().add(label);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		// frame.pack();
		frame.setLayout(new GridLayout(2, 1));
		frame.add(label);
		JButton b = new JButton("Abre");
		// b.setLocation(0, 200);
		frame.add(b);
		b.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent ae) {
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
			}
		});
		frame.setSize(400, 300);
		frame.setVisible(true);
	}
}
