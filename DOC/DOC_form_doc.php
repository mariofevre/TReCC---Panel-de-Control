<?php 
/**
* documentos.php
*
* documentos.php se incorpora en la carpeta raiz en tanto resulta el punto inicial del módulo 
* de gestión y archivo de documentación
* contiene y coordina aplicaciones específicas para gestiónar documentación.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/


 //if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);/* verificación de seguridad */
header('Content-Type: text/html; charset=CP1252');
?>

	<h2>Documento</h2>
	<p>
		<label>Id en la base </label><span id='cnid'>0000</span>
		<a onclick='cerrarForm();'>cerrar</a>
		<a id='bagrega' onclick='enviarFormularioDoc("./DOC/DOC_ed_agrega_ver");'>crear</a>
		<a id='bcambia' onclick='enviarFormularioDoc("./DOC/DOC_ed_guarda_doc");'>guardar cambios</a>
		<a id='bborra' class='eliminar' onclick='ConfEliminarDocumento(this,event);'>eliminar</a>
	</p>

	<input type='hidden' id='cid' name='iddoc'>
	<input id='Iaccion' type='hidden' value='' name='accion'>	
		
	<div>
		<label>Número de Documento</label>
		<input id='Inumero' name='numero'>
	</div>
	
	<div>
		<label>Nombre del Documento</label>
		<input id='Inombre' name='nombre'>
	</div>
	
    <div>
		<label>grupo primario</label>
		<input 
            type='hidden' 
            id='Iid_p_grupos_id_nombre_tipoa' 
            name='id_p_grupos_id_nombre_tipoa'
        ><input 
            name='id_p_grupos_id_nombre_tipoa-n' 
            id='Iid_p_grupos_id_nombre_tipoa-n' 
            onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
            onkeyup='filtrarOpciones(this);' 
            onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>
    
    <div>
    <label>grupo secundario</label>
    <input 
        type='hidden' 
        id='Iid_p_grupos_id_nombre_tipob' 
        name='id_p_grupos_id_nombre_tipob'
    ><input 
        name='id_p_grupos_id_nombre_tipob-n' 
        id='Iid_p_grupos_id_nombre_tipob-n' 
        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
        onkeyup='filtrarOpciones(this);' 
        onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>

    <div>
    <label>Escala</label>
    <input 
        type='hidden' 
        id='Iid_p_DOCdef_id_nombre_tipo_escala' 
        name='id_p_DOCdef_id_nombre_tipo_escala'
    ><input 
        name='id_p_DOCdef_id_nombre_tipo_escala-n' 
        id='Iid_p_DOCdef_id_nombre_tipo_escala-n' 
        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
        onkeyup='filtrarOpciones(this);' 
        onfocus='opcionarDef(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>
    
    <div>
    <label>Rubro</label>
    <input 
        type='hidden' 
        id='Iid_p_DOCdef_id_nombre_tipo_rubro' 
        name='id_p_DOCdef_id_nombre_tipo_rubro'
    ><input 
        name='id_p_DOCdef_id_nombre_tipo_rubro-n' 
        id='Iid_p_DOCdef_id_nombre_tipo_rubro-n' 
        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
        onkeyup='filtrarOpciones(this);' 
        onfocus='opcionarDef(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>

    <div>    
    <label>Planta</label>
    <input 
        type='hidden' 
        id='Iid_p_DOCdef_id_nombre_tipo_planta' 
        name='id_p_DOCdef_id_nombre_tipo_planta'
    ><input 
        name='id_p_DOCdef_id_nombre_tipo_planta-n' 
        id='Iid_p_DOCdef_id_nombre_tipo_planta-n' 
        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
        onkeyup='filtrarOpciones(this);' 
        onfocus='opcionarDef(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>        
    
    
    <div>
	    <label>Sector</label>
	    <input 
	        type='hidden' 
	        id='Iid_p_DOCdef_id_nombre_tipo_sector' 
	        name='id_p_DOCdef_id_nombre_tipo_sector'
	    ><input 
	        name='id_p_DOCdef_id_nombre_tipo_sector-n' 
	        id='Iid_p_DOCdef_id_nombre_tipo_sector-n' 
	        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
	        onkeyup='filtrarOpciones(this);' 
	        onfocus='opcionarDef(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>     

    <div>    
	    <label>Tipologìa</label>
	    <input 
	        type='hidden' 
	        id='Iid_p_DOCdef_id_nombre_tipo_tipologia' 
	        name='id_p_DOCdef_id_nombre_tipo_tipologia'
	    ><input 
	        name='id_p_DOCdef_id_nombre_tipo_tipologia-n' 
	        id='Iid_p_DOCdef_id_nombre_tipo_tipologia-n' 
	        onblur='vaciarOpcionares(event);if(this.value==""){this.value="-";}' 
	        onkeyup='filtrarOpciones(this);' 
	        onfocus='opcionarDef(this);'><div class='auxopcionar'><div class='contenido'></div></div>
    </div>        
    
    <br>
    
    <div id='descripcion'>
	    <label class='grande' >decripción extendida del Documento</label>
	    <textarea id='cdescripcion' name='descripcion'></textarea>
	</div>
		
	

