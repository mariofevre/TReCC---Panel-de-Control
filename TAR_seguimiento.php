<?php
/**
* TAR_seguimiento.php
*
 * Esta aplicación constituye el archivo principal para acceso al módulo de tareas en el plan de trabajo
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	TAR
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2016 TReCC SA
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
ini_set('display_errors',true);
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.

$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){
	//sin panel definido en sesion o en url envía al selector de paneles
	header('location: ./PAN_listado.php');
}

	$HabilitadoEdicion='si';
	
	
	if(isset($_GET['iditcpt'])){
		$iditemcpt=$_GET['iditcpt']; //indica un único item de certificado para mostrar solo las tareas vinculadas a ese certificado.
	}else{
		$iditemcpt=''; //representación normal de tareas.
	}
	

?><!DOCTYPE html>

<head>
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./TAR/css/TAR_seguimiento.css?v<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./TAR/css/TAR_seguimiento_mobil.css?v<?php echo time();?>">


	<style type="text/css">
		
		#carga .upload[estadodrag='archivo']{
			background-color:red;
		}
		
		@media print{
			#menuflotante{
				display:none;
			}
			#pageborde{
				background-color:transparent;
			}
		}
	</style>
</head>

<body>
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  	
    
	<?php  insertarmenu();?>
	
	
	<div id="pageborde">
		<div id="page">
			<h1>Seguimiento de tareas en obra</h1>			
			<div class='botonerainicial' planselecto='0' muestratodas='-1'>	

				
				<a class='botonmenu' id='b_verrepote' onclick="iraReporteTar()">ver reporte</a>
	        	<a class='botonmenu' id='nuevoplan' onclick="activarAdjuntaXlsx('nuevo')">Nuevo Plan desde MS-Project</a>
	        	<a class='botonmenu' id='nuevaver' onclick="activarAdjuntaXlsx('version')">Nueva version desde MS-Project</a>
	        	<a class='botonmenu' id='nuevoplan_vacio' onclick="crearPlanVacio()">Nuevo Plan Vacío</a>
	        	<a class='botonmenu' id='formularplan' onclick="formularPlan()">Editar Plan</a>
	        	<a class='botonmenu' id='nuevatarea_vacia' onclick="crearTareaVacia()">Editar Plan</a>
	        	<br>
	        	<div class='botonmenu' id='botonmodovista' estadoactivo='mostraralgunas'>
		        	<a id='mostraralgunas' onclick="cambiarMuestraTodas()" title='Mostrar Todas las tareas'><img src='./img/vista_acotada_30.png'></a>
		        	<a id='mostrarincompletas' onclick="cambiarMuestraTodas()" title='Mostrar tareas incompletas'><img src='./img/vista_vencidas_42.png'></a>
		        	<a id='mostrartodas' onclick="cambiarMuestraTodas()" title='Mostrar Solo tareas de este periodo'><img src='./img/vista_ampliada_42.png'></a>
	        	</div>
			</div>
			<div id="contenidoextenso">		
				<div id='gantt' muestratodas='-1'>
					<div id='hoy'>
					</div>
					<div id='semanam2'>
					</div>
					<div id='semanapasada'>
					</div>
					<div id='semanaqueviene'>
					</div>
					<div id='semanaMa2'>
					</div>
					<div id='listado'></div>
				</div>
					
			</div>
		</div>
	</div>


	
	<div id='menuflotante'>
		<h2>plan: <div id='planactivo'></div></h2>
		<div id='listaplanes'>
			<h2>Planes disponibles</h2>
			<div id='listado'>	
			</div>
		</div>	
		
		<div id='formadjuntarmpp'>
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
			<h3>Adjuntar archivo .xml exportado desde MS-project.</h3>
			<p>Se buscarán las columnas de tipo: </p>
			<ul>
				<li>Name</li>
				<li>Start</li>
				<li>Finish</li>
				<li>Outline Level</li>			
				<li>text1 (código de tarea)</li>			
				<li>text2 (opcional) (nombre corto de tarea)</li>			
			</ul>
			<p>Para definir las características de cada tarea.</p>
			
			<p class='soloversion'>Se asociará cada tarea del plan <span id='plansel'></span> a las tareas del archivo enviado según su código a la columna text1</p>
			<input type='hidden' name='idsel'>
			<div id='listadosubido'></div>
			<div id='listadosubiendo'></div>
			<div id='carga'>    
				<label class='upload'>
				<span class='upload' 
						ondrop='event.preventDefault();dropHandler(event);' 
						ondragover='drag_over(event,this)' 
						ondragleave='drag_out(event,this)'
				> - arrastre archivos aquí - </span>
			<!--	
				<input id='uploadinput' class='uploadinput' type='file' name='archivo_FI_documento' value='' onchange='subirDocumentoMPP(this);'></label>			
			-->
			</div>
		</div>


		<div id='formMoverTareas'>
			<a onclick='cerrarForm(this.parentNode.getAttribute("id"))' class='cerrarform'>cerrar</a>
			<div id='listamovertareas'>
			</div>				
		</div>
		
		
		<div id='formTareaObservacion'>
			
			<a class='cerrarform' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>X</a>
				
			<div id='formTarea'>
				<input type='button' value='Mover'    onclick="formularMover(this.parentNode.querySelector('input[name=\'id\']').value)">
				<input type='button' value='Eliminar' onclick="borrarTarea(this.parentNode.querySelector('[name=\'id\']').value)" >
				<input type='hidden' name='id' id='idinput'>
				<div id='contexto'><label>en</label><span></span></div>
				<div><label modo='desktop'>codigo</label><label modo='mob'>cod</label><input name='codigo' onchange='microguardarTarea(this)'></div>
				<div><label modo='desktop'>nombre</label><label modo='mob'>nom</label><input name='nombre'></div>
				<div id='divdescripcion'><label modo='desktop'>descripcion</label><a modo='desktop' onclick="consultaLocalesDisponibles();">Localizar</a>
				<textarea placeholder='descripción' onchange='microguardarTarea(this)' name='descripcion'></textarea></div>
				
				<div>
					<label class='libre'>Plan</label> 
					<label class='libre'>inicio</label>
					<input name='fecha_plan_inicio' type='date'>
					<label class='libre'>fin</label>
					<input name='fecha_plan_fin' type='date'>
				</div>
				<div>
					<label class='libre'>Real</label>
					<label class='libre'>inicio</label>
					<input name='fecha_hecho_inicio' type='date'>
					<label class='libre'>fin</label>
					<input name='fecha_hecho_fin' type='date'>
				</div>
			</div>
			
			
			
				
			<div id='formObservacion'>
				<div id='listaobs'></div>
				<h3>Estado al día de hoy <a onclick='borrarObervacion()'>borrar</a></h3>
				<input type='hidden' name='id'>
				<div><label>fecha <span id='porc_pasado'></span></label><input name='fecha' type='date' onchange='microguardar(this)'></div>
				
				<div class='contieneinput' contenidoenable='-1'>
					<label><span modo='desktop'>Avance </span><span modo='mob'>Av</span><span id='muestra_avance'>0</span>%
					<a id='botonenable' onclick='cambiaDisable(this.parentNode.parentNode)'>
						<img id='inactivo' src='./img/candado_cerrado.png'>
						<img id='activo' src='./img/candado_abierto_azul.png'>
					</a>
					</label>
					 
					<input onchange='muestraSlide(this);microguardar(this)' type="range" min="1" max="100" value="0" class="slider" id="myRange" name='avance'>
				</div>
				<div><label modo='desktop'>Nivel de alerta</label><label modo='mob'>Alerta</label>
					<select name='alerta' onchange='microguardar(this)' >
						<option value=''>No lo se</option>
						<option value='nula'>Nulo</option>
						<option value='baja'>Bajo</option>
						<option value='media'>Medio</option>
						<option value='alta'>Alto</option>
						<option value='extrema'>Extremo</option>
					</select>
				</div>
					
				<div id='preguntaprevia'>
					<label>¿Empezará a tiempo?</label><label modo='mob'>Empzó/Tpo</label>	
					<select name='iniciara' onchange='microguardar(this)'>
						<option value='S/D'>No lo se</option>
						<option value='si'>Si</option>
						<option value='no'>No</option>
						<option value='N/A'>Ya empezó</option>
					</select></div>
					
				<div id='preguntadurante'>
					<label modo='desktop'>¿Hoy se ejecuta?</label><label modo='mob'>Hoy ej</label>
					<select name='enejecucion' onchange='microguardar(this)'>
						<option value='S/D'>No lo se</option>
						<option value='si'>Si</option>
						<option value='no'>No</option>
						<option value='en taller'>en taller</option>
						<option value='en pausa momentánea'>en pausa momentánea</option>
						<option value='N/A'>No empezó</option>
						<option value='termino'>Ya terminó</option>
					</select>						
				</div>
				
				<div id='preguntaatiempo'>
					<label modo='desktop'>¿Terminará a tiempo?</label><label modo='mob'>Tmnrá/Tpo</label>
					<select name='terminara' onchange='microguardar(this)'>
						<option value='S/D'>No lo se</option>
						<option value='si'>Si</option>
						<option value='no'>No</option>
						<option value='no inició'>No empezó</option>
						<option value='ya terminó'>Ya terminó</option>
					</select>	
				</div>
				
				<div id='preguntaposterior'><label modo='desktop'>¿Terminó a tiempo?</label><label modo='mob'>Tmnó/Tpo</label>
					<select name='termino' onchange='microguardar(this)'>
						<option value='S/D'>No lo se</option>
						<option value='si'>Si</option>
						<option value='no'>No</option>
						<option value='no inició'>No empezó</option>
					</select></div>
				
				<div id='divdescripcion' ><label modo='desktop'>Observaciones del día</label><textarea placeholder='Observaciones del día' name='observaciones' onchange='microguardar(this)'></textarea></div>
				
				<div id='formadjuntarfotoobs' class='paquete adjuntos'>
					<div id='contenedorlienzo' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>	
						<h2>Adjuntos:</h2>			
						<label>Arraste todos los archivos aquí.</label>
						<input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'>
						<div id="listadosubiendo"></div>            
						<div id='adjuntoslista'></div>
					</div>
				</div>
			</div>
		</div>		
	</div>
	
	<form id='formPlan' class='central'>
		<input class='eliminar' type='button' value='Eliminar' onclick="borrarPlan(this.parentNode.querySelector('[name=\'idplan\']').value)" >
		<a class='cerrar' onclick='cerrarForm(this.parentNode.getAttribute("id"))'>cerrar - X</a>	
		<a class='guardar' onclick='guardarEdicionPlan()'>Guardar</a>	
		<a class='boton'  onclick='redefinirPadresPlan()'>redefinir padres por posicion actual</a>
		<a class='boton' onclick='subirTodo1Nivel()'>subir un nivel todas las tareas</a>			
		
		<input name='idplan' type='hidden'>
		<label>nombre: </label><input type='text' name='nombre'><br>
		<label>estado: </label>
			<select name='zz_superado'>
				<option value='0'>vigente</option>
				<option value='1'>obsoleto</option>
			</select> <br>
		
		<textarea  name='descripcion'></textarea>
	
	</form>
	

	
    <script tipe="text/javascript">
    	var _UsuId = '';
    	var _UsuAcc = '';
        var _PanId = '<?php echo $PanelI; ?>';
        var _PanelI = '<?php echo $PanelI; ?>';
        var _HabilitadoEdicion = '<?php echo $HabilitadoEdicion; ?>';
		var _IdItCPT='<?php echo $iditemcpt;?>'; // solo se usa para mostrar las tareas de un solo ítem de compute (modulo CPT).
       
        var _DataPlanes=Array();
        var _DataPlanesOrden=Array();
        
        var _DataEjecuciones=Array();
		var _DatosUsuarios=Array();
		var _IdEjecEdit=''; //id de la ejcucion en edicion
		var _Grupos=Array();

				
		_f = new Date();
		_m=(1+_f.getMonth());
		_m=_m.toString().padStart(2,"0");
		_d=(_f.getDate());
		_d=_d.toString().padStart(2,"0");
		var _Hoy = _f.getFullYear()+'-'+_m+'-'+_d;
		var _Hoy_unix=Math.round(_f.getTime()/1000);
		
		
		//definen zoom temporal....		
		var _margen_temporal_visible='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _margen_temporal_control ='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _anchogantt=500;
		var _anchodia='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		//caracteristicas del zoom temporal...
		var _barrido='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _diaInicio_rel ='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _offset='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _diaFin_rel='';// se define en consultaConfig() ed ./TAR/TAR_seguimiento_consulta.js
		var _desp_render_dias=0;
		
	</script>


<script tipe="text/javascript">
    var _DataTareas=Array();
	var _IdTareaEdit=''; //id del seguimiento en edicion
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();

	var _DataRelLocales={};
	
	var _IdPlanActivo=0;

</script>

<script charset="UTF-8" type="text/javascript" src='./TAR/TAR_seguimiento_consultas.js?v<?php echo time();?>'></script>
<script charset="UTF-8" type="text/javascript" src='./TAR/TAR_seguimiento_interaccion.js?v<?php echo time();?>'></script>
<script charset="UTF-8" type="text/javascript" src='./TAR/TAR_seguimiento_mostrar.js?v<?php echo time();?>'></script>
<script charset="UTF-8" type="text/javascript" src='./TAR/TAR_seguimiento_adjuntar.js?v<?php echo time();?>'></script>
 
<script type="text/javascript">
	
	
	consultaConfig(); // al finalizar ejecuta siguientes 			consultarGrupos();consultarUsuarios();consultarPlanes();
	function Reinicia(){consultaConfig();}
	
	

	function iraReporteTar(){
		_url='./TAR_reporte_display.php?idplan='+_IdPlanActivo;
		location.assign(_url);
	}
</script>


</body>
