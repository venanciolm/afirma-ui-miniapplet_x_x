/*
 * $Id: Anchor.java 3373 2008-05-12 16:21:24Z xlv $
 *
 * Copyright 1999, 2000, 2001, 2002 by Bruno Lowagie.
 *
 * The contents of this file are subject to the Mozilla Public License Version 1.1
 * (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the License.
 *
 * The Original Code is 'iText, a free JAVA-PDF library'.
 *
 * The Initial Developer of the Original Code is Bruno Lowagie. Portions created by
 * the Initial Developer are Copyright (C) 1999, 2000, 2001, 2002 by Bruno Lowagie.
 * All Rights Reserved.
 * Co-Developer of the code is Paulo Soares. Portions created by the Co-Developer
 * are Copyright (C) 2000, 2001, 2002 by Paulo Soares. All Rights Reserved.
 *
 * Contributor(s): all the names of the contributors are added in the source code
 * where applicable.
 *
 * Alternatively, the contents of this file may be used under the terms of the
 * LGPL license (the "GNU LIBRARY GENERAL PUBLIC LICENSE"), in which case the
 * provisions of LGPL are applicable instead of those above.  If you wish to
 * allow use of your version of this file only under the terms of the LGPL
 * License and not to allow others to use your version of this file under
 * the MPL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the LGPL.
 * If you do not delete the provisions above, a recipient may use your version
 * of this file under either the MPL or the GNU LIBRARY GENERAL PUBLIC LICENSE.
 *
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the MPL as stated above or under the terms of the GNU
 * Library General Public License as published by the Free Software Foundation;
 * either version 2 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Library general Public License for more
 * details.
 *
 * If you didn't download this code from the following link, you should check if
 * you aren't using an obsolete version:
 * http://www.lowagie.com/iText/
 */

package com.lowagie.text;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * An <CODE>Anchor</CODE> can be a reference or a destination of a reference.
 * <P>
 * An <CODE>Anchor</CODE> is a special kind of <CODE>Phrase</CODE>.
 * It is constructed in the same way.
 * <P>
 * Example:
 * <BLOCKQUOTE><PRE>
 * <STRONG>Anchor anchor = new Anchor("this is a link");</STRONG>
 * <STRONG>anchor.setName("LINK");</STRONG>
 * <STRONG>anchor.setReference("http://www.lowagie.com");</STRONG>
 * </PRE></BLOCKQUOTE>
 *
 * @see		Element
 * @see		Phrase
 */

public class Anchor extends Phrase {

	// constant
	private static final long serialVersionUID = -852278536049236911L;

    // membervariables

	/** This is the name of the <CODE>Anchor</CODE>. */
    private String name = null;

    /** This is the reference of the <CODE>Anchor</CODE>. */
    private String reference = null;

    // constructors

    /**
     * Constructs an <CODE>Anchor</CODE> without specifying a leading.
     */
    public Anchor() {
        super(16);
    }

    /**
     * Constructs an <CODE>Anchor</CODE> with a certain <CODE>Phrase</CODE>.
     *
     * @param	phrase		a <CODE>Phrase</CODE>
     */
    public Anchor(final Phrase phrase) {
    	super(phrase);
    	if (phrase instanceof Anchor) {
    		final Anchor a = (Anchor) phrase;
    		setName(a.name);
    		setReference(a.reference);
    	}
    }

    // implementation of the Element-methods

    /**
     * Processes the element by adding it (or the different parts) to an
     * <CODE>ElementListener</CODE>.
     *
     * @param	listener	an <CODE>ElementListener</CODE>
     * @return	<CODE>true</CODE> if the element was processed successfully
     */
    @Override
	public boolean process(final ElementListener listener) {
        try {
            Chunk chunk;
            final Iterator i = getChunks().iterator();
            final boolean localDestination = this.reference != null && this.reference.startsWith("#");
            boolean notGotoOK = true;
            while (i.hasNext()) {
                chunk = (Chunk) i.next();
                if (this.name != null && notGotoOK && !chunk.isEmpty()) {
                    chunk.setLocalDestination(this.name);
                    notGotoOK = false;
                }
                if (localDestination) {
                    chunk.setLocalGoto(this.reference.substring(1));
                }
                listener.add(chunk);
            }
            return true;
        }
        catch(final DocumentException de) {
            return false;
        }
    }

    /**
     * Gets all the chunks in this element.
     *
     * @return	an <CODE>ArrayList</CODE>
     */
    @Override
	public ArrayList getChunks() {
        final ArrayList tmp = new ArrayList();
        Chunk chunk;
        final Iterator i = iterator();
        final boolean localDestination = this.reference != null && this.reference.startsWith("#");
        boolean notGotoOK = true;
        while (i.hasNext()) {
            chunk = (Chunk) i.next();
            if (this.name != null && notGotoOK && !chunk.isEmpty()) {
                chunk.setLocalDestination(this.name);
                notGotoOK = false;
            }
            if (localDestination) {
                chunk.setLocalGoto(this.reference.substring(1));
            }
            else if (this.reference != null) {
				chunk.setAnchor(this.reference);
			}
            tmp.add(chunk);
        }
        return tmp;
    }

    /**
     * Gets the type of the text element.
     *
     * @return	a type
     */
    @Override
	public int type() {
        return Element.ANCHOR;
    }

    // methods

    /**
     * Sets the name of this <CODE>Anchor</CODE>.
     *
     * @param	name		a new name
     */
    public void setName(final String name) {
        this.name = name;
    }

    /**
     * Sets the reference of this <CODE>Anchor</CODE>.
     *
     * @param	reference		a new reference
     */
    public void setReference(final String reference) {
        this.reference = reference;
    }

    // methods to retrieve information

	/**
     * Returns the name of this <CODE>Anchor</CODE>.
     *
     * @return	a name
     */
    public String getName() {
        return this.name;
    }

	/**
     * Gets the reference of this <CODE>Anchor</CODE>.
     *
     * @return	a reference
     */
    public String getReference() {
        return this.reference;
    }

	/**
     * Gets the reference of this <CODE>Anchor</CODE>.
     *
     * @return	an <CODE>URL</CODE>
     */
    public URL getUrl() {
        try {
            return new URL(this.reference);
        }
        catch(final MalformedURLException mue) {
            return null;
        }
    }

}
