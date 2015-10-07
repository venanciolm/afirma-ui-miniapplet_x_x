package es.gob.afirma.keystores.filters;

import java.math.BigInteger;
import java.security.cert.X509Certificate;

import es.gob.afirma.core.misc.AOUtil;

final class FilterUtils {

	private static final String[] SUBJECT_SN_RDN = new String[] {
		"serialnumber", //$NON-NLS-1$
		"2.5.4.5" //$NON-NLS-1$
	};

	private FilterUtils() {
		// No instanciable
	}

	/** Recupera el n&uacute;mero de serie del subject de un certificado en formato hexadecimal.
	 * Los ceros ('0') a la izquierda del n&uacute;mero de serie se eliminan durante el
	 * proceso. Si el certificado no tiene n&uacute;mero de serie, devolver&aacute;
	 * {@code null}.
	 * @param cert Certificado.
	 * @return N&uacute;mero de serie del subject en hexadecimal. */
	static String getSubjectSN(final X509Certificate cert) {
		final String principal = cert.getSubjectX500Principal().getName();
		for (final String rdn : SUBJECT_SN_RDN) {
			final String snumber = AOUtil.getRDNvalueFromLdapName(rdn, principal);
			if (snumber != null ) {
				return snumber.replace("#", ""); //$NON-NLS-1$ //$NON-NLS-2$
			}
		}
		return null;
	}

	/** Convierte un opbjeto BigInteger a Hexadecimal.
	 * @param bi Entero que deseamos convertir.
	 * @return Hexadecimal. */
	static String bigIntegerToHex(final BigInteger bi) {
		return AOUtil.hexify(bi.toByteArray(), ""); //$NON-NLS-1$
	}

}
