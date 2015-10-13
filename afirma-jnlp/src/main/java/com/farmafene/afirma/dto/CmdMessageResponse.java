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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

@SuppressWarnings("serial")
public class CmdMessageResponse extends VoidMessageResponse implements Serializable {

	private static final AtomicLong ID_GENERATOR = new AtomicLong();
	private String time;
	private String call;
	private long id;

	public CmdMessageResponse() {
		this.id = ID_GENERATOR.getAndIncrement();
		this.time = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date());
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
		sb.append("time=").append(this.time);
		sb.append(", id=").append(this.id);
		sb.append(", call=").append(this.call);
		sb.append("]");
		return sb.toString();
	}

	/**
	 * Devuelve el valor de la propiedad 'time'
	 * @return Propiedad time
	 */
	public String getTime() {
		return this.time;
	}

	/**
	 * Asigna el valor de la propiedad 'time'
	 * @param time valor que se le quiere dar a la propiedad 'time'
	 */
	public void setTime(final String time) {
		this.time = time;
	}

	/**
	 * Devuelve el valor de la propiedad 'call'
	 * @return Propiedad call
	 */
	public String getCall() {
		return this.call;
	}

	/**
	 * Asigna el valor de la propiedad 'call'
	 * @param call valor que se le quiere dar a la propiedad 'call'
	 */
	public void setCall(final String call) {
		this.call = call;
	}

	/**
	 * Devuelve el valor de la propiedad 'id'
	 * @return Propiedad id
	 */
	public long getId() {
		return this.id;
	}

	/**
	 * Asigna el valor de la propiedad 'id'
	 * @param id valor que se le quiere dar a la propiedad 'id'
	 */
	public void setId(final long id) {
		this.id = id;
	}
}
