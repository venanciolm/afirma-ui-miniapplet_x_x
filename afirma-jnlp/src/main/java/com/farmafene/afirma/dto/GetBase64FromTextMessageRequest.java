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
package com.farmafene.afirma.dto;

public class GetBase64FromTextMessageRequest {
	private String plainText;
	private String charset;

	public GetBase64FromTextMessageRequest() {

	}

	/**
	 * {@inheritDoc}
	 *
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		final StringBuilder sb = new StringBuilder();
		sb.append(getClass().getSimpleName()).append(" [");
		sb.append("plainText=").append(this.plainText);
		sb.append(", charset=").append(this.charset);
		sb.append("]");
		return sb.toString();
	}

	/**
	 * @return the charset
	 */
	public String getCharset() {
		return this.charset;
	}

	/**
	 * @param charset the charset to set
	 */
	public void setCharset(final String charset) {
		this.charset = charset;
	}

	/**
	 * Devuelve el valor de la propiedad 'plainText'
	 * @return Propiedad plainText
	 */
	public String getPlainText() {
		return this.plainText;
	}

	/**
	 * Asigna el valor de la propiedad 'plainText'
	 * @param plainText valor que se le quiere dar a la propiedad 'plainText'
	 */
	public void setPlainText(final String plainText) {
		this.plainText = plainText;
	}
}
