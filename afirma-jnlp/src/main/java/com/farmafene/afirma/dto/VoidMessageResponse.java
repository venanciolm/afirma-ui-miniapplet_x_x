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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.io.Serializable;

@SuppressWarnings("serial")
public abstract class VoidMessageResponse implements Serializable {
	private int error;
	private String descError;

	public VoidMessageResponse() {

	}

	/**
	 * {@inheritDoc}
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(getClass().getSimpleName()).append(" [");
		sb.append(", error=").append(error);
		sb.append(", descError=").append(descError);
		sb.append("]");
		return sb.toString();
	}

	/**
	 * @return the error
	 */
	public int getError() {
		return error;
	}

	/**
	 * @return the descError
	 */
	public String getDescError() {
		return descError;
	}

	/**
	 * @param error
	 *            the error to set
	 */
	public void setError(int error) {
		this.error = error;
	}

	/**
	 * @param descError
	 *            the descError to set
	 */
	public void setDescError(String descError) {
		this.descError = descError;
	}

	/**
	 * 
	 * @param descError
	 *            the descError to set
	 */
	public void setDescError(Throwable th) {
		this.descError = null;
		if (th != null) {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			PrintStream ps = new PrintStream(baos);
			th.printStackTrace(ps);
			ps.flush();
			try {
				baos.flush();
			} catch (IOException e) {
				// do nothing
			}
			this.descError = baos.toString();
			ps.close();
			try {
				baos.close();
			} catch (IOException e) {
				// do nothing
			}
		}
	}
}
