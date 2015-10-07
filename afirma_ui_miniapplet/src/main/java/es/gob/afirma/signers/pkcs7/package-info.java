/* Copyright (C) 2011 [Gobierno de Espana]
 * This file is part of "Cliente @Firma".
 * "Cliente @Firma" is free software; you can redistribute it and/or modify it under the terms of:
 *   - the GNU General Public License as published by the Free Software Foundation;
 *     either version 2 of the License, or (at your option) any later version.
 *   - or The European Software License; either version 1.1 or (at your option) any later version.
 * Date: 11/01/11
 * You may contact the copyright holder at: soporte.afirma5@mpt.es
 */

/**
 *	M&oacute;dulo de utilidad para la generaci&oacute;n de firmas digitales en formatos derivados de PKCS#7.
 *  No provee ninguna funcionalidad directa a los usuarios (ni siquiera genera firmas en formato PKCS#7),
 *  es un m&oacute;dulo de uso interno por parte de otros m&oacute;dulos.
 *  <p style="text-align: center;"><img src="doc-files/package-info-1.png" alt="Dependencias de subsistemas"></p>
 *  <p>Este m&oacute;dulo presenta las siguientes dependencias directas de primer nivel:</p>
 *  <ul>
 *   <li>Dependencia con el m&oacute;dulo N&uacute;cleo (<i>afirma-core</i>) del Cliente.</li>
 *   <li>Dependencia con BouncyCastle 1.46 o superior (Proveedor + <i>Mail</i>).</li>
 *  </ul>
 *  <p>
 *   Este m&oacute;dulo es compatible con cualquier entorno JSE 1.5 o superior y con Android 3 o superior.<br>
 *   Para compatibilidad con Android 2.x es necesario sustituir BouncyCastle por SpongyCastle. No hay llamadas
 *   al Proveedor de BouncyCastle por nombre ni instanciaciones din&aacute;micas de clases de BouncyCastle, por
 *   lo que una simple sustituci&oacute;n de <code>import org.bouncycastle.</code> por <code>org.spongycastle.</code>
 *   es suficiente.
 *  </p>
 *  <p>Desde este m&oacute;dulo no se realizan llamadas a interfaces gr&aacute;ficas.</p>
 */
package es.gob.afirma.signers.pkcs7;