<?php
/**
* CPT_gestion.php
*
* genera la estructua HTML para cargar, visualizar y formular cambios para Cómputos y certificaciones.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Lista de contratacion / tracking / segumiento
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 - 2019 TReCC SA
* @license    	http://www.gnu.org/licenses/agpl.html GNU Affero General Public License, version 3 (AGPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU Affero General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU Affero General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/



    ini_set('display_errors',true);
    include ('./a_comunes/a_comunes_consulta_encabezado.php');	
    include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.
    include('./PAN/PAN_consultainterna_config.php');//define variable $Config    
    //include_once('./a_comunes/a_comunes_html_menu.php');    

	$HabilitadoEdicion='si';

?><!DOCTYPE html>

<head>
	<title>Panel.TReCC</title>
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">	
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./CPT/css/CPT_gestion.css?v=<?php echo time();?>">
    
	<style type="text/css">	

	</style>
</head>

<body>
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
	<?php  insertarmenu();	//en PAN/PAN_comunes.php	?>
	
	<div id="pageborde">
		<div id="page">
			<h1>Cómputo</h1>			
			<div class='botonerainicial' planselecto='0' muestratodas='-1'>	
	        	<a class='botonmenu' id='nuevoplan' onclick="formularSubirComputo('nuevo')">Subír cómputo desde archivo xlsx</a>
	        	<a class='botonmenu' id='formularplan' onclick="formularComputo()">Editar Computo</a>
	        	<a class='botonmenu' id='activarGeneraDemasias' onclick="formularRubro()"><img src='./a_comunes/img/agregar.png'> rubro</a>
	        	<a class='botonmenu' id='activarGeneraDemasias' onclick="activarGeneraDemasias()"><img src='./a_comunes/img/agregar.png'> Demasías</a>
	        	<a class='botonmenu' id='desactivarGeneraDemasias' onclick="desactivarGeneraDemasias()">Terminar Demasías</a>
	        	<a class='botonmenu' id='activarGeneraEconomias' onclick="activarGeneraEconomias()"><img src='./a_comunes/img/agregar.png'> Economías</a>
	        	<a class='botonmenu' id='desactivarGeneraEconomias' onclick="desactivarGeneraEconomias()">Terminar Economías</a>
	        	
	        	<a class='botonmenu' id='filtrarsobrecert' onclick="activarFiltroSobreCert()">Filtrar Sobrecertificado</a>
	        	<a class='botonmenu' id='filtrarsobrecert' onclick="desactivarFiltro()">Apagar filtro</a>
			</div>
			
			<div id='listacomputos'>
				<h2>computos</h2>
				<div id='listado'>	
				</div>
			</div>	
			
			
			<div id="contenidoextenso">		
				<table id='tabla'>
					<thead>
						<th>N</th>
						<th>N<br>orig</th>
						<th>Nombre</th>
						<th>Link a Tareas</th>
						<th>Avance en Tareas</th>
						<th>Uni</th>
						<th>Cantidad</th>
						<th>Precio Unitario</th>
						<th>Parcial</th>
						<th>Precio rubro</th>
						<th>acum. prev</th>
						<th id='cert'>
							Avan. en<br> Cert. <br> 
							<span id='nom_cert'></span> 
							<a id='botoncertanterior' onclick='cargarCertificadoAnterior(this);'><img src='./a_comunes/img/flecha_anterior.png'></a>
							<a id='botoncertsiguiente' onclick='cargarCertificadoSiguiente(this);'><img src='./a_comunes/img/flecha_siguiente.png'></a>
							<a id='botoncertnuevo' onclick='crearCertificado(this);'><img src='./a_comunes/img/agregar.png'></a>							
							<a id='botonestado' estado='oculto' onclick='cambiarestado();'>
								<img id='candadocerrado' src='./a_comunes/img/candado_cerrado.png'>
								<img id='candadoabierto' src='./a_comunes/img/candado_abierto_azul.png'>
							</a>
						</th>
						<th>acum</th>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
	</div>

	<div id='formlinkcpttareas' class='formCent' estado='inactivo'>
		<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
		<h3>Vinculación con tareas del plan de trabajo</h3>
		<input type='button' value='Copiar links de otro item' onclick="listaCopiaLinks()">
		<input type='button' value='Ingresar lista de tareas como texto' onclick="subFormlistaTareasTx()">
		<input type='button' value='Ver en plan de trabajo' onclick="abrirTARItCPT()">
		<div id='item'>
		<h3>Ítem:</h3>
		<p id='numero'></p>
		<p id='nombre'></p>
		<p id='cantidad'></p>
		<p id='unidad'></p>
		<input type='hidden' name='idi'>
		</div>
		<input type='button' value='Sumar link para este ítem' onclick="consultaPreliminarLink()">
		- <input type='button' value='Repartir iguales incidencias' onclick="linksRepartirIgualesIncidencias()"> cumulado actual <span id='incidenciaacumulada'></span>
		<br>
		<div id='listadolinks'>
		</div>
		<div id='listadotareas'  class='subform'  inner_dinamico='si' estado='inactivo'>			
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
			<div id='lista'></div>
		</div>
		<div id='listadoitems' class='subform'  inner_dinamico='si' estado='inactivo'>
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
			<div id='lista'></div>
		</div>
		<div id='ingresaListaTarTx' class='subform'  estado='inactivo'>
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
			<label>Caracter separador:</label>
			<input type='text' onchange="prelimiarTareaTx()" value='-' name='separador'>
			<label>Listado de tareas separador:</label>
			<textarea name='listado' onkeyup="prelimiarTareaTx()"></textarea>
			<input type='button' value='Procesar' onclick="procesarListadoTareas()">
			<br>
			<label>previsualizacion:</label>
			<div id='previsualizacion'></div>
		</div>
	</div>			
			
			
			
	<div id='formadjuntarxlsx' class='formCent'>
		<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
		<h3>Adjuntar archivo .xlsx exportado desde xlsx</h3>
		<p>Deberá tener los siguientes contenidos</p>
		<ul>
			<li>nombres de columna solo en la primera fila</li>
			<li>nivel de ca fila (1:rubro, 2:sub-rubro, 3:item)</li>
			<li>columna con id de item (opcional)</li>
			<li>columna con unidad</li>
			<li>columna con cantidad</li>
			<li>columna con precio unitario ofertado</li>
			<li>columna con precio parcial ofertado</li>
		</ul>
		
		<input type='hidden' name='idsel'>
		<div id='listadosubido'></div>
		<div id='listadosubiendo'></div>
		<div id='carga'>    
			<label class='upload'>
			<span class='upload' 
					ondrop='event.preventDefault();dropHandler(event);' 
					ondragover='drag_over(event,this)' 
					ondragleave='drag_out(event,this)'
			> - arrastre archivo aquí - </span>
		<!--	
			<input id='uploadinput' class='uploadinput' type='file' name='archivo_FI_documento' value='' onchange='subirDocumentoMPP(this);'></label>			
		-->
		</div>
		<input name='archivado' type='hidden'>
		
		<div id='definiciones'>    			
			<div>
				<label>Incorporar contenidos al cómputo:</label>
				<select name='idcomp' class='selectorcomputo'></select>
			</div>
			<div>
				<label>Columna con <b>nivel</b> (rubro, surubro o item):</label>
				<select name='col_nivel' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>número</b> o identificadór único:</label>
				<select name='col_numero' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>nombre</b>:</label>
				<select name='col_nom' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>unidad</b> de cómputo utilizada:</label>
				<select name='col_uni' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>cantidad</b> computada:</label>
				<select name='col_cant' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>precio unitario</b> ofertado:</label>
				<select name='col_prec_u' class='selectorcolumna'></select>
			</div>
			<div>
				<label>Columna con <b>precio parcial</b> ofertado:</label>
				<select name='col_prec_parc' class='selectorcolumna'></select>
			</div>
			
			<input type='submit' value='procesar contenido' onclick='consultarProcesarXLSX()'>
		</div>
		
	</div>

	<div class='formCent' id='formecon'>
		<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
		
		<input name='iditem' type='hidden'>
		<input name='idcomputo' type='hidden'>
		<p id='nombreitem'></p>
		<p>Cantidad Base: <span id='cantidadbase'></span></p>
		<p>Cantidad Economizada: <input name='cantidadecon' onkeyup='actualizabalancecantidad("formecon")'></p>
		<p>Cantidad Resultante: <span id='cantidadres'></span></p>
		<p>Certificado de aplicación de la economía: <select name='id_p_CPTcertificados'></select></p>
		<p>Descripción, justificación o localización: <textarea name='descripcion'></textarea></p>
		<input type='submit' value='Crear Economía' onclick='crearEconomia()'>
	</div>
		
	<div class='formCent' id='formdemas'>
		<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
		
		<input name='iditem' type='hidden'>
		<input name='idrubro' type='hidden'>
		<input name='idcomputo' type='hidden'>
		<p id='nombreitem'></p>
		<div id='nuevoitem'>
			<input name='numitem' placeholder="Nº"> - <input name='nomitem' placeholder="Nombre del nuevo item"> 
			<select name='unidad'>
			<option value='u'>u</option>
			<option value='m'>m</option>
			<option value='m²'>m²</option>
			<option value='m³'>m³</option>
			<option value='gl'>gl</option>
			</select>
			
			<p id='renglon_precio'>
				Precio unitario: <input name='preciounitario'>
			</p>

		</div>

		<p id='renglon_precio_parcial'>	
			Precio parcial: <input name='precioparcial'>			
		</p>
		<p>Cantidad Base: <span id='cantidadbase'></span></p>
		<p>Cantidad Incrementada: <input name='cantidaddemas' onkeyup='actualizabalancedemasia("formdemas")'></p>
		<p>Cantidad Resultante: <span id='cantidadres'></span></p>
		<p>Certificado de aplicación de la demasía: <select name='id_p_CPTcertificados'></select></p>
		
		<p>Descripción, justificación o localización: <textarea name='descripcion'></textarea></p>
		<input type='submit' value='Crear Demasía' onclick='crearDemasia()'>
	</div>
	
		
		
	<div class='formCent' id='formrubro'>
		<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
		
		<input name='idcomputo' type='hidden'>
		<p id='nuevorubro'>
			<input name='numrubro' placeholder="Nº"> - <input name='nomrubro' placeholder="Nombre del nuevo rubro"> 
		</p>
		
		
		<p>Descripción, justificación o localización: <textarea name='descripcion'></textarea></p>
		<input type='submit' value='Crear Rubro' onclick='crearRubro()'>
	</div>
	
	
	
	<div id='menuflotante'>
	
		<div id='formTareaObservacion'>
			
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
				
		</div>		
			
	</div>
	
	<div id='formPlan'>
		<input type='button' value='Eliminar' onclick="borrarPlan(this.parentNode.querySelector('[name=\'idplan\']').value)" >
		<a onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>	
		<input name='idplan' type='hidden'>
		<input name='nombre'>
		<textarea  name='descripcion'></textarea>
		<a onclick='redefinirPadresPlan()'>redefinir padres por posicion actual</a>				
	</div>
	
	
    <script tipe="text/javascript">
		
		
        var _PanelI = '<?php echo $PanelI; ?>';
        var _PanId = '<?php echo $PanelI; ?>';//DEPRECAR
    	var _UsuId = '';
    	var _UsuAcc = '';
        var _HabilitadoEdicion = '';
       
        var _DataComputos={};
        var _DataLinkTareas={};//datos para vincular items a tareas
		var _DatosUsuarios=Array();
		var _IdEjecEdit=''; //id de la ejcucion en edicion
		var _Grupos=Array();
		var _CertificadoCargado={'definido':'no'};
		var _CertificadoCargadoAnterior={'definido':'no'};
		    
		    
		
		_f = new Date();
		_m=(1+_f.getMonth());
		_m=_m.toString().padStart(2,"0");
		_d=(_f.getDate());
		_d=_d.toString().padStart(2,"0");
		var _Hoy = _f.getFullYear()+'-'+_m+'-'+_d;
		var _Hoy_unix=Math.round(_f.getTime()/1000);
		
		
		var _nFile=0;	
		var xhr=Array();
		var inter=Array();
		
	</script>

	<script type="text/javascript" charset="UTF-8" src='./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>'></script>

	<script type="text/javascript" charset="UTF-8" src='./CPT/CPT_js_gestion_consultas.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" charset="UTF-8" src='./CPT/CPT_js_gestion_interaccion.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" charset="UTF-8" src='./CPT/CPT_js_gestion_mostrar.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" charset="UTF-8" src='./CPT/CPT_js_gestion_arrastrar_archivo.js?v=<?php echo time();?>'></script>
	 
	<script type="text/javascript">
		consultarGrupos();
		consultarUsuarios();
		consultarComputos();
		
		$(document).ready(function(){stickybar();});
	</script>

</body>
