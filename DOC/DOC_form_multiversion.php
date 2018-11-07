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

	<p>
		<a onclick='cerrarForm();'>cerrar</a>
		<a id='bcambia' onclick='enviarFormularioMulti(\"cambia\");'>guardar cambios</a>
	</p>

	<input type='hidden' id='Mid' name='MId'>
	<input type='hidden' value='DOCversion' name='tabla'>
	<input id='Icampo' type='hidden' value='' name='campo'>
	
	<h3>Lista de versiones seleccionadas</h3>
	<div id='listadeversiones'>
		<div id='versionmodelo'>
			<span id='documento'>documento</span>
			<span id='numero'>Nºv</span>
			<span id='fecha'>plan</span>
			<span id='pre'>Pr</span>
			<span id='apr'>Ap</span>
			<span id='rev'>Re</span>
			<span id='anu'>An</span>
			<span id='observ'>observaciones</textarea>
		</div>
	</div>	
	

	<div id='comunicacionesCambia'>
		<label id='pre'><span class='enevaluacion'>Presentado</span> Por:</label>
		<label id='apr'><span class='aprobada'>Aprobado</span> Por:</label>
		<label id='rev'><span class='rechazada'>Rechazado</span> Por:</label>
		<label id='anu'><span class='anulada'>Anulado</span> Por:</label>
		<input type='hidden' id='anulada' name=''>
		<div id='dummy'></div><span class='muestra'></span><input type='hidden' name='valor'><a  id='vaciarcomunicacion'  onclick='vaciar(this)'>vaciar</a>
		
		
		<label id='fecha'>Fecha prevista</label>
		<div id='inputfecha'>
		<input id='Iprevistoactual_d' class='mini' name='previstoactual_d'>-<input id='Iprevistoactual_m' class='mini' name='previstoactual_m'>-<input id='Iprevistoactual_a' class='fecha' name='previstoactual_a'><a id='vaciarfecha' para='previstoactual' onclick='vaciarFecha(this)'>vaciar</a>
		</div>
	
	
	</div>
	
	
	<div id='op_comunicacionesCambia'>
		<label>comunicaciones del sentido previsible</label>
		<div id='sentido'>
			<div id='sel1'>
				<label>de los mismos grupos</label>
			</div>
			<div id='sel2'>
				<label>del mismo grupo primario</label>
			</div>
			<div id='sel3'>
				<label>del mismo grupo secundario</label>
			</div>
			<div id='sel4'>
				<label>sin grupos en comun</label>
			</div>
		</div>
		
		<label>comunicaciones del sentido contrario</label>
		<div id='contrasentido'>
			<div id='sel1'>
				<label>de los mismos grupos</label>
			</div>
			<div id='sel2'>
				<label>del mismo grupo primario</label>
			</div>
			<div id='sel3'>
				<label>del mismo grupo secundario</label>
			</div>
			<div id='sel4'>
				<label>sin grupos en comun</label>
			</div>
		</div>
		
	</div>
	

");