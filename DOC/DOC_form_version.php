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

echo utf8_encode("

	<h2>Versión de un documento</h2>
	<p>
		<label>Id en la base </label><span id='cnid'>0000</span>
		<a onclick='cerrarForm();'>cerrar</a>
		<a id='bagrega' onclick='enviarFormularioVer(\"crear\");'>crear</a>
		<a id='bcambia' onclick='enviarFormularioVer(\"./DOC/DOC_ed_guarda_ver\");'>guardar cambios</a>
		<a id='bborra' class='eliminar' onclick='ConfirmaEliminarVersion();'>eliminar</a>
	</p>

	<input type='hidden' id='cid' name='id'>
	<input type='hidden' id='Iid_p_DOCdocumento_id' name='id_p_DOCdocumento_id'>
	<input type='hidden' value='DOCversion' name='tabla'>
	<input id='Iaccion' type='hidden' value='' name='accion'>	
		
	<label>Número de Versión Acordada</label>
	<input id='Inumero' name='version'>

	<label>Fecha de presentación original</label>
	<input id='Iprevistoorig_d' class='mini' name='previstoorig_d'>-<input id='Iprevistoorig_m' class='mini' name='previstoorig_m'>-<input id='Iprevistoorig_a' class='fecha' name='previstoorig_a'>

	<label>Fecha de presentación actualmente prevista</label>
	<input id='Iprevistoactual_d' class='mini' name='previstoactual_d'>-<input id='Iprevistoactual_m' class='mini' name='previstoactual_m'>-<input id='Iprevistoactual_a' class='fecha' name='previstoactual_a'>
	
	<br>
	<label>Copias digitales:</label>
	<div id='archivos'>
        <div id='listadosubido'></div>
        <div id='listadosubiendo'></div>
		<div id='carga'>    
			<label class='upload'>
			<span class='upload'> - arrastre archivos aquí - </span>
			<input id='uploadinput' class='uploadinput' type='file' name='archivo_FI_documento' value='' onchange='subirDocumento(this);' multiple></label>			
		</div>	
		
	</div>
	
	<label>Observaciones para esta Versión</label>
	<textarea id='Idescripcion' name='descripcion'></textarea>	

	<div id='comunicaciones'>
		<label><span class='enevaluacion'>Presentado</span> Por:</label>
		<div id='datoscomPresenta'>
            <a class='vacia' onclick='vaciar(this);'>vaciar</a>
			<a class='elige' onclick='elegirCom(this,\"presenta\");'>
				elegir
			</a><span class='muestra'></span><input type='hidden' id='Iid_p_comunicaciones_id_ident_entrante' name='id_p_comunicaciones_id_ident_entrante'>
		</div>
		
		<label><span class='aprobada'>Aprobado</span> Por:</label>
		<div id='datoscomAprueba'>
		 <a class='vacia' onclick='vaciar(this);'>vaciar</a>
			<a class='elige'  onclick='elegirCom(this,\"aprueba\");'>
				elegir
			</a><span class='muestra'></span><input type='hidden' id='Iid_p_comunicaciones_id_ident_aprobada' name='id_p_comunicaciones_id_ident_aprobada'>
		</div>
		
		<label><span class='rechazada'>Rechazado</span> Por:</label>
		<div id='datoscomRechaza'>
            <a class='vacia' onclick='vaciar(this);'>vaciar</a>
			<a class='elige' onclick='elegirCom(this,\"rechaza\");'>
				elegir
			</a><span class='muestra'></span><input type='hidden' id='Iid_p_comunicaciones_id_ident_rechazada' name='id_p_comunicaciones_id_ident_rechazada'>
		</div>
		
		<label><span class='anulada'>Anulado</span> Por:</label>
		<div id='datoscomAnula'>
            <a class='vacia' onclick='vaciar(this);'>vaciar</a>
			<a class='elige'  onclick='elegirCom(this,\"anula\");'>
				elegir
			</a><span class='muestra'></span><input type='hidden' id='Iid_p_comunicaciones_id_ident_anulada' name='id_p_comunicaciones_id_ident_anulada'>
		</div>
	</div>
	
	
	<div id='op_comunicaciones'>
		<label>comunicaciones del sentido previsible</label>
		<div id='sentido'>
			<div id='sel1'>
				<label>mismos grupos</label>
			</div>
			<div id='sel2'>
				<label> mismo grupo<br>primario</label>
			</div>
			<div id='sel3'>
				<label> mismo grupo<br>secundario</label>
			</div>
			<div id='sel4'>
				<label>sin grupos<br>en común</label>
			</div>
		</div>
		
		<label>comunicaciones del sentido contrario</label>
		<div id='contrasentido'>
			<div id='sel1'>
				<label>mismos grupos</label>
			</div>
			<div id='sel2'>
				<label> mismo grupo<br>primario</label>
			</div>
			<div id='sel3'>
				<label> mismo grupo<br>secundario</label>
			</div>
			<div id='sel4'>
				<label>sin grupos<br>en común</label>
			</div>
		</div>
		
	</div>
	

");
