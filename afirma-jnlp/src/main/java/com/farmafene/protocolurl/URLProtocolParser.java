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
package com.farmafene.protocolurl;

public class URLProtocolParser {
	private static final String KEY_PART = "=";
	private static final String URI_PARTS = "&";
	private static final String HOST_PART = "\\?";
	private static final String PROTOCOL_PART = "\\:\\/\\/";

	private URLProtocolParser() {
	}

	public static URLProtocol parse(String url) {
		URLProtocol p = new URLProtocol();
		String[] a = url.split(PROTOCOL_PART);
		p.setName(a[0]);
		String[] a2 = a[1].split(HOST_PART);
		p.setHost(a2[0]);
		String[] params = a2[1].split(URI_PARTS);
		for (String param : params) {
			String[] a3 = param.split(KEY_PART, 2);
			p.putValue(a3[0], a3[1]);
		}
		return p;
	}

	public static void main(String... args) {
		URLProtocol p = URLProtocolParser.parse(
				"miniapplet13://service?ports=9999,59117,49248,63579,51983&timeout=4&sessionId=qMJ4nN1Kq9c8zstKo8Pg");
		System.out.println(p);

	}
}
