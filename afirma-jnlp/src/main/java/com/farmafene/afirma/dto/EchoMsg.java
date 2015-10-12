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

import java.io.Serializable;
import java.util.concurrent.atomic.AtomicLong;

@SuppressWarnings("serial")
public class EchoMsg implements Serializable {

	private static final AtomicLong ID_GENERATOR = new AtomicLong();
	private String in;
	private String out;
	private long id;

	public EchoMsg() {
		id = ID_GENERATOR.getAndIncrement();
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
		sb.append("in=").append(in);
		sb.append(", out=").append(out);
		sb.append(", id=").append(id);
		sb.append("]");
		return sb.toString();
	}

	/**
	 * @return the in
	 */
	public String getIn() {
		return in;
	}

	/**
	 * @return the out
	 */
	public String getOut() {
		return out;
	}

	/**
	 * @return the id
	 */
	public long getId() {
		return id;
	}

	/**
	 * @param in
	 *            the in to set
	 */
	public void setIn(String in) {
		this.in = in;
	}

	/**
	 * @param out
	 *            the out to set
	 */
	public void setOut(String out) {
		this.out = out;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(long id) {
		this.id = id;
	}
}
