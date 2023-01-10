<?php 
/**
* DOC_gestion.php
*
* genera la estructua HTML para cargar, visualizar y formular cambios para Documentación.
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

if(!isset($_GET['comunicacion'])){$_GET['comunicacion']='0';}
?>
<!DOCTYPE html>
<head>
		
	<title>Panel.TReCC</title>
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">	
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">			
	
	<link rel="stylesheet" type="text/css" href="./DOC/css/DOC.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./DOC/css/DOC_form.css?v=<?php echo time();?>">	

	
<style type="text/css">

</style>

	<style type="text/css" id='inhabilitadaedicion'>
		a.preversion{
			display:none;
		}
		body div.recuadros#recuadro{
			display:none;
		}
		
	</style>
</head>
<body
	onkeyup='tecleoGeneral(event);'
	>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>	
	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  

	<?php insertarmenu(); ?>
			
	<div class='recuadros' id='recuadro'>
		<div id='ayudaVerCompleta'>
			<span>doble click</span><div class='version enevaluacion'></div> <div class='des'>para editar datos.</div>
		<br><span>click</span><div class='version enevaluacion'></div> <div class='des'>para seleccionar puntualmente.</div>
		<br><span>ctrl +</span><div class='version enevaluacion'></div> <div class='des'>para sumar o restar al conjunto seleccionado.</div>
		<br><span>alt +</span><div class='version enevaluacion'></div><div class='des'> para un rango de últimas versiones.</div>
		</div>
		
		<div id='ayudaVerResumen'>
			<span>2click</span><div class='version enevaluacion'></div>: editar.
			<br><span>click</span><div class='version enevaluacion'></div>: seleccionar.
			<br><span>ctrl +</span><div class='version enevaluacion'></div>: sumar o restar.
			<br><span>alt +</span><div class='version enevaluacion'></div>: rango.
		</div>
		
		<div id='ayudaVerData'>
			<div id='seleccionados'></div>
			<div id='estados'></div>
			<div id='acciones'>
				<h2>planificados</h2>
				si: <span class='' id='sifech'></span> / no: <span id='nofech'></span> <a onclick='editarMultiVersion("fecha")'>cambiar</a>
				<h2>presentados</h2>
				si: <span class='enevaluacion' id='sipre'></span> / no: <span id='nopre'></span> <a onclick='editarMultiVersion("pre")'>cambiar</a>
				<h2>aprobado</h2>
				si: <span class='aprobada' id='siapr'></span> / no: <span id='noapr'></span> <a onclick='editarMultiVersion("apr")'>cambiar</a>
				<h2>enviado a revisión</h2>
				si: <span class='rechazada' id='sirev'></span> / no: <span id='norev'></span> <a onclick='editarMultiVersion("rev")'>cambiar</a>
				<h2>anulado</h2>
				si: <span class='anulada' id='sianu'></span> / no: <span id='noanu'></span> <a onclick='editarMultiVersion("anu")'>cambiar</a>
			</div>
		</div>
	</div>
	
	<div class='recuadros' id='CuadroSelecionDoc'>
		<a>Añadir versión</a><br>
		<a onclick='formularDocMultieditEditar()'>Editar</a><br>
		<a>Guardar selección</a><br>
		<div>con:</div>
		<div id='tx'></div>
	</div>
				
	<div id="pageborde">
		<div id="page">
			<h1>Gestor de documentos de obra</h1>
			
			<div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='filtrarDocs()'></div>
			
			<div class='botonerainicial' tipo='modos'>
				<label>ver en modo:</label>
				<select class='modo' onchange='cambiaModo(this.value);'>
					<option value='gestion'>Gestion</option>
					<option value='tabla'>Tabla</option>
					<option disabled='disabled' value='gestion'>Visado</option>	
				</select> - 
				<a id='botonfiltros' class='botonmenu' onclick='filtrarActivar()' txsi='ocultar filtros' txno='mostrar filtros'>mostrar filtros</a>
			</div>
		   
			<div soloeditores="ver" class='botonerainicial' tipo='acciones'>	
				<a id='creadoc' soloeditores="ver" class='botonmenu' onclick="crearDoc(this)" title='agregar documento'><img src='./a_comunes/img/agregar.png' alt='agregar'> documento</a>
				 -
				<a id='subedoc' soloeditores="ver" class='botonmenu' onclick="cargarOrigen(this)" title='subir archivos de forma masiva'><img src='./a_comunes/img/agregar_desdedocs.png' alt='subir'> subir grupo de documentos</a>
				 -   
				<a 
					id="descarga"
					soloeditores="ver" 
					class='botonmenu' 
					onclick="descargarArchivos()" 
					title='descargar una copia de todos los archivos (última versión) en un archivo zip'
				>
					<img src='./a_comunes/img/descargar_carpeta.png' alt='subir'> 
					descargar copia 
					<img class='cargando' src='./a_comunes/img/cargando.gif'>
				</a>
			</div>
			

		<div id='contenidoextenso'>	
		
			<div class="fila filtro" id='advertenciafiltro'>
				<h4>
					se muestran solo los documentos vinculados con la comunicacion
					<div style='display:inline-block;' class='COMcomunicacion' id='comunicacionmuestra'></div>
					<a href='./DOC_reporte.php'>mostrar todo</a>
				</h4>
			</div>
		
			<div style='display:none;' class="fila filtro" id='formfiltro'>
				<form action='' method='post' onsubmit="event.preventDefault();console.log('funcion en desarrollo\n por ahora recomendamos usar la barra de búsqueda.');">
					<div>
					   visible: <span id='cantvisible'>0</span><br>filtrado: <span id='cantfiltrado'>0</span>
					</div>			
					<div id='Fgrupoa' campo='grupoa'></div>
					<div id='Fgrupob' campo='grupob'></div>			
				</form>
			</div>	
			

			
			<div id='modelo' class='fila soloEdicion'>
				<div class='sector'></div>
				<div class='planta'></div>
				<div name='selector' class='activo selector' iddoc='' docorden='1'></div>
				<a href='./agrega_f.php?accion=cambia&tabla=DOCdocumento&id=&salida=documentos' title='' class='numero '></a>
				<a href='./agrega_f.php?accion=cambia&tabla=DOCdocumento&id=&salida=documentos' class='nombre'></a>
				<div class='escala'></div>
				<div class='rubro'></div>
				<div class='tipologia'></div>
				<div class='estado'></div>
				<div class='fecha'></div>
				<div class='versionesventana'></div>
			</div>

			</div>
				<div id='contenidoextensoPost'>
			</div>
		</div>			
	</div>		


	<form action='COM_ed_guarda_doc' enctype='multipart/form-data' method='post' style='display:none;' id="editorArchivos">
		<h1 id='tituloformulario'></h1>
		<p id='desarrollo'></p>
		<label>Tipo de carga</label>
		<select name='modo'>
			<option value='auto'>automático</option>
			<option value='original'>original</option>
			<option value='anexo'>anexo</option>			
		</select>
		
		<input type='hidden' name='tipo' value=''>
		<label>Grupo Primario</label>
		<input type='hidden' name='id_p_grupos_id_nombre_tipoa' value=''>
		<input type='text' name='id_p_grupos_id_nombre_tipoa-n' onkeyup='opcionNo(this);' value=''>
		<div class='opciones' for='id_p_grupos_id_nombre_tipoa'></div>
		<label>Grupo Secundario</label>
		<input type='hidden' name='id_p_grupos_id_nombre_tipob' value=''>
		<input type='text' name='id_p_grupos_id_nombre_tipob-n' onkeyup='opcionNo(this);' value=''>
		<div class='opciones' for='id_p_grupos_id_nombre_tipob'></div>
		
		<label title="">Un separador (o más) de términos en el nombre del archivo </label>
		<input name='criterioseparador' value=''> <?php /* PONER echo $Config['doc-nomenclaturaarcseparador'] */;?>
		<label
			title="IDENTIFICADORES
			nro : numero de comunicacion
			ident : numero y código (ej: OS0002 / Np-125)
			sent : sentido (ej: saliente / os / orden de servicio)
			identdos : identificación secundaria
			identtres : identificación terciaria
			fecha : fecha (ej: 1980-09-21)
			y : año de emisión
			m : mes de emisión
			d : dia de emisión
			comenta : cualquier informacíon adicional
			"
		>Criterio de interpretación de términos en el nombre de archivo</label>

		<textarea name='criterio'></textarea><?php /* echo $Config['doc-nomenclaturaarchivos'];*/?>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
		<label>Arraste archivos de documentacion al interior:</label>
		<div id='contenedorlienzo'>									
			<div id='upload'>
				<input multiple='' id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='cargarDoc(this);'>
			</div>
			<div id='enviados'></div>
		</div>
		<div id='listadosubiendo'>
		</div>						
	</form>	
	
	<div id='listaedicion'></div>		

	<div id='coladesubidas'></div>		

	<form id='formCent' 
		draggable='true' ondragstart='event.stopPropagation();drag_start(event,this)'
		ondblclick='reposForm(this)'
		tipo='version'
		class='formCent'
		ga='' gb=''
		estado='inactivo'
	>
		<img src='./a_comunes/img/cargando.gif' id='cargando'>


		<h2><div class='version'>.</div> <span>Versión de un documento</span></h2>
		
		<p>
			<label>Id en la base </label><span id='cnid'>0000</span>
			<a id='bcancela' onclick='cerrarForm("version");'>cerrar</a>
			<a soloeditores='ver' id='bagrega' onclick='enviarFormularioVer("crear");'>crear</a>
			<a soloeditores='ver' id='bcambia' onclick='enviarFormularioVer("./DOC/DOC_ed_guarda_ver");'>guardar</a>
			<a soloeditores='ver' id='bborra' class='eliminar' onclick='ConfirmaEliminarVersion();'>eliminar</a>
		</p>

		<input type='hidden' id='cid' name='id'>
		<input type='hidden' id='Iid_p_DOCdocumento_id' name='id_p_DOCdocumento_id'>
		<input type='hidden' value='DOCversion' name='tabla'>
		<input id='Iaccion' type='hidden' value='' name='accion'>	
			
		<div>
			<label>Número de Versión Acordada</label>
			<input 
				soloeditores='cambia' id='Inumero' name='version'
				onfocus='ponerEstadoDrag("version", true)' onblur='ponerEstadoDrag("version", false)'
				>
		</div>
		
		<div>
			<label>Fecha de presentación original</label>
			<input soloeditores='cambia'  id='Iprevistoorig' type='date' name='previstoorig'>
		</div>
		
		<div>
			<label>Fecha de presentación actualmente prevista</label>
			<input soloeditores='cambia'  id='Iprevistoactual' type='date' name='previstoactual'>
		</div>
		
		<div>
			<label>Fecha de vencimiento de la versión</label>
			<input soloeditores='cambia'  id='Ifechavence' type='date' name='fechavence'>
		</div>
		
		<br>
		<label>
		Archivos	 digitales:
		<div id='carga'>    
			<label class='upload'>
			<span class='upload'> - arrastre archivos aquí - </span>
			<input soloeditores='cambia' ondragover='event.stopPropagation();' ondrop='event.stopPropagation();' id='uploadinput' ondrop='event.preventDefault()' class='uploadinput' type='file' name='archivo_FI_documento' value='' onchange='subirDocumento(this);' multiple></label>			
		</div>	
		
		</label>
		<div id='archivos'>
			<div id='listadosubido'></div>
			<div id='listadosubiendo'></div>
		</div>
		
		<label>Observaciones para esta Versión</label>
		<textarea id='Idescripcion' name='descripcion'></textarea>	

		<div id='visados'>
			<h3>Visados <a><img src='./a_comunes/img/agregar.png'></a></h3>
			
			<div id='listavisados'></div>
		</div>
		<div id='comunicaciones'>
			<label id='labelpresenta'><span class='enevaluacion'>Presentado</span> Por:</label>
			<div id='datoscomPresenta'>
				<a soloeditores='ver' class='vacia' onclick='vaciar(this);'>vaciar</a>
				<a soloeditores='ver' class='elige' onclick='elegirCom(this,"presenta");'>
					elegir
				</a><span class='muestra'></span><input type='hidden' tipo='valor' id='Iid_p_comunicaciones_id_ident_entrante' name='id_p_comunicaciones_id_ident_entrante'>
			</div>
			
			<label id='labelaprueba'><span class='aprobada'>Aprobado</span> Por:</label>
			<div id='datoscomAprueba'>
			 <a soloeditores='ver' class='vacia' onclick='vaciar(this);'>vaciar</a>
				<a soloeditores='ver'  class='elige'  onclick='elegirCom(this,"aprueba");'>
					elegir
				</a><span class='muestra'></span><input type='hidden' tipo='valor' id='Iid_p_comunicaciones_id_ident_aprobada' name='id_p_comunicaciones_id_ident_aprobada'>
			</div>
			
			<label id='rechaza'><span class='rechazada'>Rechazado</span> Por:</label>
			<div id='datoscomRechaza'>
				<a soloeditores='ver' class='vacia' onclick='vaciar(this);'>vaciar</a>
				<a soloeditores='ver' class='elige' onclick='elegirCom(this,"rechaza");'>
					elegir
				</a><span class='muestra'></span><input type='hidden' tipo='valor' id='Iid_p_comunicaciones_id_ident_rechazada' name='id_p_comunicaciones_id_ident_rechazada'>
			</div>
			
			<label id='labelanula'><span class='anulada'>Anulado</span> Por:</label>
			<div id='datoscomAnula'>
				<a soloeditores='ver' class='vacia' onclick='vaciar(this);'>vaciar</a>
				<a soloeditores='ver' class='elige'  onclick='elegirCom(this,"anula");'>
					elegir
				</a><span class='muestra'></span><input type='hidden' tipo='valor' id='Iid_p_comunicaciones_id_ident_anulada' name='id_p_comunicaciones_id_ident_anulada'>
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

	</form>
		
		
		
	<div id='listaCat'>
		<h2>Agrupaciones</h2>
			<div id='botoneraform'>
				<a id="bcancela" onclick='cerrarFormGrupos();'>Cerrar</a>
			</div>
		<select name='tipo' onchange="_formGruposListar(this.value);">
			<option value='escala'>Escala</option>
			<option value='rubro'>Rubro</option>
			<option value='planta'>Planta</option>
			<option value='sector'>Sector</option>
			<option value='tipologia'>Tipología</option>
		</select>

		<input name='id_grupo' value='' type='hidden'>
		<table id='listagrupos'>
			<tr id='titulos'>
				<th>ID</th>
				<th>Nº Orden</th>
				<th>Nombre</th>
				<th>Código</th>
				<th>Descripción</th>
				<th>casos (documentos)</th>
			</tr>
		</table>
	</div>


	<div id='formCat'>
		<div id='botoneraform'>
			<a id="bborra" onclick="_formGruposBorrarGrupo()">Eliminar</a>
			<a id="bcambia" onclick="_formGruposGuardarGrupo()">Guardar</a>
			<a id="bcancela" onclick='_cerrarFormGrupo();'>Cancelar</a>
			<a id="bpasa" onclick='_formularListaPase()'>Pasar casos</a>
		</div>
		<input soloeditores='cambia' name='id' type='hidden'>
		<div>
			<label>Nº Orden</label>
			<input soloeditores='cambia' name='orden'>
		</div>


		<div>
			<label>Nombre de la Categoría</label>
			<input soloeditores='cambia' name='nombre'>
		</div>

		<div>
			<label>Código de la Categoría</label>
			<input soloeditores='cambia' name='codigo'>
		</div>	

		<div>
			<label>Descripción de la Categoría</label>
			<textarea soloeditores='cambia' name='descripcion'></textarea>
		</div>	
		
		<div id='formPase'>
			<h3>Elegir a que grupo quiere pasar todos el elementos que encontremos vinculados a esta categoría</h3>
			
			<table id='listacategoriaspase'>
				
			</table>
		</div>		
	</div>	
							

	<script type="text/javascript">

		var _PanelI="<?php echo $PanelI;?>";
		var _UsuarioAcc="";
		var _UsuarioTipo="";	
		var _HabilitadoEdicion='';	
		var _idCom="<?php echo $_GET['comunicacion'];?>";
		var _IdDoc='';// si se adopta un valor mayo a cero, al cargar el listado también abre el formuladio para documentos con los datos del doc id correspondiente.	
		var _Grupos;
		var _Modo='gestion';	

		var _Estado='cargainicial';

		var	DatosComs=Array();
		var DatosDocs=Array();
		var _Categ={};

		//carga formulario vacio de versiones
		var _IdVer =null; //versión en edicion
		var _IdDoc =null; //documento en edicion

		var _nf=0;//numero de archivo subido

		//varaiables para manipulación visual de formulario
		var isResizing = false;
		//var lastDownX = 0;
		var _anchoinicial = 0;
		var _equisInicial = 0;
		var _excepturadragform='no';


		var _seleccionfiltros = new Array();
		var _selecciontxfiltros='';
		var _seleccionversionesid = new Array();

		//carga las ventanas de edición y muestra información de la versión elegida (en los div recuadros)	

		var _VerSeleccion={};
		var _UltSelect='';

		var _VerSeleccionData= Array();
		var _DatosVer={};


		var _seleccionDOCSid={'unico': Array()};
		var _seleccionDOCUlt='';


		var _ultimamarca='';
		var _nuevamarca='';

		var _a = 0;
		var _seleccion = '';

		var _nFile=0;
	</script>

	<script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>

	<script type="text/javascript" src='./DOC/DOC_gestion_interaccion.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./DOC/DOC_gestion_envios.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./DOC/DOC_gestion_mostrar.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./DOC/DOC_gestion_cargamasiva.js?v=<?php echo time();?>'></script>

	<script type="text/javascript" src="./DOC/DOC_form_version.js?v=<?php echo time();?>">/*carga funciones para el formuario de versiones*/</script>
	<script type="text/javascript" src="./DOC/DOC_form_doc.js?v=<?php echo time();?>">/*carga funciones para el formuario de versiones*/</script>
	<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>

	<script type="text/javascript">	
		window.onbeforeunload = function(e) {
			//console.log(xhr)
			//console.log(Object(xhr).length);
			for(_xn in xhr){
				//console.log(xhr[_xn].readyState);
				if(xhr[_xn].readyState!=4){
					return 'Se suspenederan los documentos subiendo';
				}
			}
		}; 
	</script>

	<script type="text/javascript">	
		consultarGrupos();
		consultarVisados();
		consultarDocs('');	
	</script>

</body>
