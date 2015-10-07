/*
 * Controlador Java de la Secretaria de Estado de Administraciones Publicas
 * para el DNI electronico.
 *
 * El Controlador Java para el DNI electronico es un proveedor de seguridad de JCA/JCE
 * que permite el acceso y uso del DNI electronico en aplicaciones Java de terceros
 * para la realizacion de procesos de autenticacion, firma electronica y validacion
 * de firma. Para ello, se implementan las funcionalidades KeyStore y Signature para
 * el acceso a los certificados y claves del DNI electronico, asi como la realizacion
 * de operaciones criptograficas de firma con el DNI electronico. El Controlador ha
 * sido disenado para su funcionamiento independiente del sistema operativo final.
 *
 * Copyright (C) 2012 Direccion General de Modernizacion Administrativa, Procedimientos
 * e Impulso de la Administracion Electronica
 *
 * Este programa es software libre y utiliza un licenciamiento dual (LGPL 2.1+
 * o EUPL 1.1+), lo cual significa que los usuarios podran elegir bajo cual de las
 * licencias desean utilizar el codigo fuente. Su eleccion debera reflejarse
 * en las aplicaciones que integren o distribuyan el Controlador, ya que determinara
 * su compatibilidad con otros componentes.
 *
 * El Controlador puede ser redistribuido y/o modificado bajo los terminos de la
 * Lesser GNU General Public License publicada por la Free Software Foundation,
 * tanto en la version 2.1 de la Licencia, o en una version posterior.
 *
 * El Controlador puede ser redistribuido y/o modificado bajo los terminos de la
 * European Union Public License publicada por la Comision Europea,
 * tanto en la version 1.1 de la Licencia, o en una version posterior.
 *
 * Deberia recibir una copia de la GNU Lesser General Public License, si aplica, junto
 * con este programa. Si no, consultelo en <http://www.gnu.org/licenses/>.
 *
 * Deberia recibir una copia de la European Union Public License, si aplica, junto
 * con este programa. Si no, consultelo en <http://joinup.ec.europa.eu/software/page/eupl>.
 *
 * Este programa es distribuido con la esperanza de que sea util, pero
 * SIN NINGUNA GARANTIA; incluso sin la garantia implicita de comercializacion
 * o idoneidad para un proposito particular.
 */
package es.gob.jmulticard.ui.passwordcallback.gui;

import javax.swing.JDialog;
import javax.swing.JFrame;

/** Componente que define un di&aacute;logo de alerta.
 * @author Inteco */
abstract class JAccessibilityCustomDialog extends JDialog {

	/**
	 * uid.
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Posicion X actual.
	 */
	private static int actualPositionX = -1;

	/**
	 * Posicion Y actual.
	 */
	private static int actualPositionY = -1;

	/**
	 * Ancho actual.
	 */
	private static int actualWidth = -1;

	/**
	 * Alto actual.
	 */
	private static int actualHeight = -1;

	/**
	 * Indica si el di&aacute;logo requiere un tamano grande por defecto.
	 */
	private boolean bigSizeDefault = false;

    /** Si se trata de un di&aacute;logo de confirmacion o tiene entradas */
    private final boolean isInputDialog;

	/** Constructor con par&aacute;metros.
	 * @param dialog Di&aacute;logo base.
	 * @param modal <code>true</code> si el di&aacute;logo debe ser modal,
	 *              <code>false</code> en caso contrario.
	 * @param isInputDialog <code>true</code> si el di&aacute;logo es de entrada de datos,
	 *              <code>false</code> en caso contrario. */
	JAccessibilityCustomDialog(final JDialog dialog, final boolean modal, final boolean isInputDialog){
		super(dialog, modal);
		this.isInputDialog = isInputDialog;
		final ResizingAdaptor adaptador = new ResizingAdaptor(this);
		this.addComponentListener(adaptador);
		this.setResizable(false);
	}

	/** Constructor con parametros.
	 * @param frame Componente base.
	 * @param modal <code>true</code> si el di&aacute;logo debe ser modal,
	 *              <code>false</code> en caso contrario.
	 * @param isInputDialog <code>true</code> si el di&aacute;logo es de entrada de datos,
	 *              <code>false</code> en caso contrario. */
	JAccessibilityCustomDialog(final JFrame frame, final boolean modal, final boolean isInputDialog){
		super(frame, modal);
		this.isInputDialog = isInputDialog;
		final ResizingAdaptor adaptador = new ResizingAdaptor(this);
		this.addComponentListener(adaptador);
		this.setResizable(false);
	}

	/** Constructor.
	 * @param isInputDialog Indica si el di&aacute;logo es de entrada de datos. */
	JAccessibilityCustomDialog(final boolean isInputDialog){
		super();
		this.isInputDialog = isInputDialog;
		final ResizingAdaptor adaptador = new ResizingAdaptor(this);
		this.addComponentListener(adaptador);
		this.setResizable(false);
	}

	/** Relaci&oacute;n m&iacute;nima que se aplica para la redimensi&oacute;n de los componentes.
	 * Cuanto menor es este n&uacute;mero menor es la redimensi&oacute;n aplicada.
	 * @return int Relaci&oacute;n m&iacute;nima */
	abstract int getMinimumRelation();

	/** Obtiene el componente horizontal de la posici&oacute;n en pantalla del di&aacute;logo.
	 * @return Componente horizontal de la posici&oacute;n del di&aacute;logo. */
	static int getActualPositionX() {
		return actualPositionX;
	}

	/** Establece el componente horizontal de la posici&oacute;n en pantalla del di&aacute;logo.
	 * @param actualPositionX Componente horizontal de la posici&oacute;n del di&aacute;logo. */
	static void setActualPositionX(final int actualPositionX) {
		JAccessibilityCustomDialog.actualPositionX = actualPositionX;
	}

	/** Obtiene el componente vertical de la posici&oacute;n en pantalla del di&aacute;logo.
	 * @return Componente vertical de la posici&oacute;n del di&aacute;logo. */
	static int getActualPositionY() {
		return actualPositionY;
	}

	/** Establece el componente vertical de la posici&oacute;n en pantalla del di&aacute;logo.
	 * @param actualPositionY Componente vertical de la posici&oacute;n del di&aacute;logo. */
	static void setActualPositionY(final int actualPositionY) {
		JAccessibilityCustomDialog.actualPositionY = actualPositionY;
	}

	/**
     * Getter para la variable ActualWidth.
     * @return ActualWidth
     */
	static int getActualWidth() {
		return actualWidth;
	}

	/** Establece el ancho del di&aacute;logo.
     * @param actualWidth Ancho del di&aacute;logo. */
	static void setActualWidth(final int actualWidth) {
		JAccessibilityCustomDialog.actualWidth = actualWidth;
	}

	/**
     * Getter para la variable ActualHeight.
     * @return ActualHeight
     */
	static int getActualHeight() {
		return actualHeight;
	}

	/** Establece el alto del di&aacute;logo.
     * @param actualHeight Alto del di&aacute;logo. */
	static void setActualHeight(final int actualHeight) {
		JAccessibilityCustomDialog.actualHeight = actualHeight;
	}

	/** Indica si el di&aacute;logo debe tener un tama&ntilde;o grande por defecto.
	 * @return boolean */
	boolean isBigSizeDefault() {
		return this.bigSizeDefault;
	}

	/** Indica si el di&aacute;logo debe tener un tama&ntilde;o grande por defecto.
	 * @param bigSizeDefault <code>true</code> si el di&aacute;logo debe tener un tama&ntilde;o grande por defecto,
	 *                       <code>false</code> en caso contrario. */
	void setBigSizeDefault(final boolean bigSizeDefault) {
		this.bigSizeDefault = bigSizeDefault;
	}

	/**
     * Retorna el ancho inicial del di&aacute;logo
     * @return Ancho inicial del di&aacute;logo
     */
    int getInitialWidth(){
    	if(this.isInputDialog){
    		return Constants.CUSTOMDIALOG_INITIAL_WIDTH;
    	}return Constants.CUSTOMCONFIRMATION_INITIAL_WIDTH;
    }

    /**
     * Retorna el alto inicial del di&aacute;logo
     * @return Alto inicial del di&aacute;logo
     */
    int getInitialHeight(){
    	if(this.isInputDialog){
    		return Constants.CUSTOMDIALOG_INITIAL_HEIGHT;
    	}
    	return Constants.CUSTOMCONFIRMATION_INITIAL_HEIGHT;
    }

    /**
     * Retorna el ancho maximo del di&aacute;logo
     * @return Ancho maximo del di&aacute;logo
     */
    int getMaxWidth(){
    	if(this.isInputDialog){
    		return Constants.CUSTOMDIALOG_MAX_WIDTH;
    	}
		return Constants.CUSTOMCONFIRMATION_MAX_WIDTH;
    }

    /**
     * Retorna el alto maximo del di&aacute;logo
     * @return Alto maximo del di&aacute;logo
     */
    int getMaxHeight(){
    	if(this.isInputDialog){
    		return Constants.CUSTOMDIALOG_MAX_HEIGHT;
    	}
    	return Constants.CUSTOMCONFIRMATION_MAX_HEIGHT;
    }
}
