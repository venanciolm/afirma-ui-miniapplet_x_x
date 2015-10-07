package es.gob.afirma.keystores;

import java.io.File;
import java.io.IOException;

final class FileBasedKeyStoreManagerFactory {

	private FileBasedKeyStoreManagerFactory() {
		// No permitimos la instanciacion
	}

	static AOKeyStoreManager getKeyStoreManager(final File ksFile, final Object parent) throws IOException, AOKeystoreAlternativeException {
		if (ksFile == null) {
			throw new IllegalArgumentException("El fichero de almacen no puede ser nulo"); //$NON-NLS-1$
		}
		if (!ksFile.exists() || !ksFile.isFile()) {
			throw new IOException("El fichero de almacen no existe"); //$NON-NLS-1$
		}
		if (!ksFile.canRead()) {
			throw new IOException("El fichero de almacen no se puede leer"); //$NON-NLS-1$
		}
		final String ksFileName = ksFile.getName().toLowerCase();
		final AOKeyStore ksType;
		if (ksFileName.endsWith(".pfx") || ksFileName.endsWith(".p12")) { //$NON-NLS-1$ //$NON-NLS-2$
			ksType = AOKeyStore.PKCS12; // PKCS#12 o Personal File Exchange (PFX)
		}
		else if (ksFileName.endsWith(".jks")) { //$NON-NLS-1$
			ksType = AOKeyStore.JAVA; // Java KeyStore
		}
		else if (ksFileName.endsWith(".dll") || ksFileName.endsWith(".dylib") || ksFileName.endsWith(".so")) { //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			ksType = AOKeyStore.PKCS11; // PKCS#11
		}
		else {
			throw new IllegalArgumentException("No se soporta el tipo de fichero: " + ksFile.getAbsolutePath()); //$NON-NLS-1$
		}
		return AOKeyStoreManagerFactory.getAOKeyStoreManager(
			ksType,
			ksFile.getAbsolutePath(),
			"File", //$NON-NLS-1$
			ksType.getStorePasswordCallback(parent),
			parent
		);
	}

}