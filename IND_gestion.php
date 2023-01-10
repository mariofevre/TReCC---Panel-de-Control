<?php
/**
* IND_gestion.php
*
* Estructura HTML para cargar, configurar, visualizar y formular cambios para Indicadores.
 * 
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
	header('location: ./PAN_listado.php');//sin panel definido en sesion envía al selector de paneles
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
	
	<link rel="stylesheet" type="text/css" href="./IND/css/IND.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./IND/css/IND_form.css?v=<?php echo time();?>">
	
	
	<style type="text/css">

	</style>
	
	<style type="text/css" id='cssanchohistorial'>	
		#ventanahistorial > div {
			width: 1000px;
		}
    </style>
</head>
<body>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
    
	<?php  insertarmenu();//en PAN_comunes.php ?>
	
	<div id='formcent' class='formCent'>
		<form id='general'>
			<p><label>Id en la base </label><span id='cnid'>0000</span> <a class='cancelar' onclick='cerrarForm();'>cerrar</a><a id='acarga' onclick='activarCarga(this.getAttribute("indid"));'>cargar valores</a><a onclick="enviarFormulario();">guardar</a><a id="aactivaElim" class='eliminar' onclick="activarEliminar(this);">Eliminar</a></p>
			
			<label>nombre de indicador</label>
			<input id='cindicador' value='nn' name='indicador'>
			<input type='hidden' id='cid' name='id'>
			<input fijo='fijo' id='tabla' type="hidden" value="indicadores" name="tabla">
			<input fijo='fijo' type="hidden" value="cambia" name="accion">
			<input fijo='fijo' type="hidden" value="ajax" name="salida">
			<input fijo='fijo' type="hidden" value="ajax" name="modo">		
			
			<label title='identificacion local en documentos'>Número de Indicador</label>
			<input id='cn_id_local' value='nn' name='n_id_local'>
			
			<br>
			<label>grupo primario</label>
			<input 
				type='hidden' 
				id='cid_p_grupos_id_nombre_tipoa' 
				name='id_p_grupos_id_nombre_tipoa'
			><input 
				name='id_p_grupos_id_nombre_tipoa-n' 
				id='cid_p_grupos_id_nombre_tipoa-n' 
				onblur='vaciarOpcionares(event)' 
				onkeyup='filtrarOpciones(this);' 
				onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
			
			<label>grupo secundario</label>
			<input 
				type='hidden' 
				id='cid_p_grupos_id_nombre_tipob' 
				name='id_p_grupos_id_nombre_tipob'
			><input 
				name='id_p_grupos_id_nombre_tipob-n' 
				id='cid_p_grupos_id_nombre_tipob-n' 
				onblur='vaciarOpcionares(event)' 
				onkeyup='filtrarOpciones(this);' 
				onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
			
			<br>
			<label class='grande' >decripción extendida del indicador</label>
			<textarea id='cdescripcion' name='descripcion'></textarea>
			
			<label class='chica'>unidad de medida</label>
			<input id='cunidad'  name='unidad' value='nn'>
			
			<label  class='chica' title='periodicidad de seguimiento'>periodicidad</label>
			<select id='cid_p_INDperiodicidad' name='id_p_INDperiodicidad'></select>

			<label class='chica' title='diferencia a los indicadores de ocurrencia (registro) de los de proyección, que pueden ser cargados previamente'>caracter</label>
			<select id='ccaracter' name='caracter'></select>

			<label class='chica' title='fuente de los datos. (ver manual)'>Fuente</label>
			<select id='cfuente' name='fuente'><option>- elegir -</option></select>
					
			<br>			
			
			<label class='chica' >fecha de inicio</label>
			<input 
				type='hidden' 
				id='cid_p_HIThitos_id_nombre_desde' 
				name='id_p_HIThitos_id_nombre_desde'
			><input 
				id='cid_p_HIThitos_id_nombre_desde-n' 
				onblur='vaciarOpcionares(event)' 
				onkeyup='filtrarOpciones(this);' 
				onfocus='opcionarHitos(this);'
			><div class='auxopcionar'><div class='contenido'></div></div>
			<input id='cdesde_d' name='desde_d' class='dia' value='nn'>-<input id='cdesde_m' name='desde_m' class='mes' value='nn'>-<input id='cdesde_a' name='desde_a' class='ano' value='nn'>

			<label class='chica' >fecha de fin</label>
			<input 
				type='hidden' 
				id='cid_p_HIThitos_id_nombre_hasta' 
				name='id_p_HIThitos_id_nombre_hasta'
			><input 
				id='cid_p_HIThitos_id_nombre_hasta-n' 
				 onblur='vaciarOpcionares(event)' 
				onkeyup='filtrarOpciones(this);' 
				onfocus='opcionarHitos(this);'
			><div class='auxopcionar'><div class='contenido'></div></div>
			<input id='chasta_d' name='hasta_d' class='dia' value='nn'>-<input id='chasta_m' name='hasta_m' class='mes' value='nn'>-<input id='chasta_a' name='hasta_a' class='ano' value='nn'>

			<br>		
			<label class='chica' title='fórmula para cálculo del indicador. (ver manual)'>fórmula <a class='ayuda' href='./a_comunes/manuales/manualformulasindicadores.php' target='blank'>?</a></label>
			<input id='cformula' name='formula'>
			
			<br>			
			<label class='chica' title='indica si el indicador debe ser cargado forzosamente para todos los períodos previstos (su carga no es eventual).'>carga forsoza</label>
			<input id="ccargaforzada"  type='hidden' value="" name="cargaforzada">
			<input id="ccargaforzada-n" type="checkbox" onclick=" alterna('cmuestraforzada', this.checked); " checked="" value="" name="">
			
			<label class='chica' title='Indica si el resultado tiene que ser mostrado forzosamente en los informes. (los valores igual a 0 no se ocultan).'>muestra forsoza</label>
			<input id="cmuestraforzada"  type='hidden' value="" name="muestraforzada">
			<input id="cmuestraforzada-n" type="checkbox" onclick=" alterna('cmuestraforzada', this.checked); " checked="" value="" name="">

			<label class='chica' title='los indicadores publicados en la web son visibles para cualquier usuario no registrado'>Publicar en WEB</label>
			<input id="cpublicarweb"  type='hidden' value="" name="publicarweb">
			<input id="cpublicarweb-n" type="checkbox" onclick=" alterna('cmuestraforzada', this.checked); " checked="" value="" name="">	
			
			<label class='chica' title='Los valores cargados permanecen para los períodos siguientes hasta nueva carga. (Utilizar solo con indicadores cuya carga está asegurada, no permite aviso de demoras en la carga)'>val. persistentes</label>
			<input id="cpersistente"  type='hidden' value="1" name="persistente">
			<input id="cpersistente-n" type="checkbox" onclick=" alterna('cpersistente', this.checked); " checked="" value="" name="">
			
			<label>Responsable</label><select></select><br>
			
			<label class='chica' title='Se incluye su estado y nivel de alerta en el panel principal'>Mostrar en el panel rpincipal</label>
			<input id="a_panel_general"  type='hidden' value="" name="a_panel_general">
			<input id="a_panel_general-n" type="checkbox" onclick=" alterna('a_panel_general', this.checked); " checked="" value="" name="">

			<label class='chica'>Valor inicial de alerta (0%)</label>
			<input id='alerta_min'  name='alerta_min' value=''>
			<label class='chica'>Valor final de alerta (100%)</label>
			<input id='alerta_max'  name='alerta_max' value=''>
		</form>

		
		<div id ='cargavalores'>
			<div id ='titulo'><h2>Datos cargados en este indicador</h2></div>
			<div id ='contenido'></div>	
		</div>
		
	</div>
		
	<div id="encabezado">	
		
		<a class='boton' id='botoncrear' onclick='crearIndicador()'><img src='./a_comunes/img/agregar.png'> - crear indicador</a>
		<!--
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio aún no ha llegado' value='mostrar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?mostrarinactivos=si';">
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio aún no ha llegado' value='ocultar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?';">
		<input id='web' type='button' title='la publicación web es visible para el público en general sin usuario ni contraseña' value='ir a la publicación web' onclick="window.location='http://190.2.6.204:8008/net/paneldecontrol/index.php?id=<?php echo $PanelI;?>';">
		-->
		<a class='boton' id='botongestion' disabled title='el modo gestion sirve crear y modifitar la estructura d elos indicadores y cargar sus datos'       onclick="window.location='./IND_gestion.php?';" >modo gestion</a>
		<a class='boton' id='botongrafico'          title='el modo gráficos permite visualizar los indicadores en gráficos de lineas, barras, y tortas'       onclick="window.location='./IND_graficos.php';" >modo gráficos</a>	
		<a class='boton' id='botontabla'            title='el formato tabla sirve para copiar los datos a una hoja de cálculo (MS-excel o Libreoffice scalc)' onclick="window.location='./IND_tablas.php';"   >modo tablas</a>	
		
			
	</div>	

	<div id="pageborde">
		<div id="page">
			<h1>Registro de Indicadores</h1>	
			<h2>planilla de carga y seguimiento de registros</h2>
			<a id='verreg' onclick='this.innerHTML="cargando...";this.removeAttribute("onclick");consultarIndicadores();'>ver regitros</a>
			<!--- columna con titulos -->
			<div id="columnacalendario" class='columna'>
				<div style='text-align:center;' class="filaante nombre"><br>público <br><br> web</div>	
				<div class='filacabezaref'>
					año<br>mes<br>dias del mes<br>semana de seguimiento
				</div>
			</div>
			
			<!--- ventana con scroll y los datos históricos --->	
			<div id="ventanahistorial">
				<div id="etiqueteafechas"></div>	
					
				<div class='filacabezaref'>	
					<div id='anos'><!--- etiqutes de años --->
					</div>	
					<div id='meses'>
					</div>	
				</div>
			</div>
		</div>
	</div>	

	<script type="text/javascript" src="./includes/FuncionesComunes.js?v=<?php echo time();?>"></script>    
		
		
	<script type="text/javascript">
		var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';
		var _UsuarioAcc='';
		var _UsuarioTipo='';	
		var _HabilitadoEdicion='';	
		
		var _DatosGrupos=Array();
		
		var _editarInd = '';
		
		var DatosGenerales=Array();
		var DatosRegistros=Array();
			
		var _Opciones=Array();

		var _weekday = new Array(7);
		_weekday[0]=  "l";
		_weekday[1] = "m";
		_weekday[2] = "m";
		_weekday[3] = "j";
		_weekday[4] = "v";
		_weekday[5] = "s";
		_weekday[6] = "d"; 

		var _mesnom = new Array(7);
		_mesnom[1]=  "enero";
		_mesnom[2] = "febrero";
		_mesnom[3] = "marzo";
		_mesnom[4] = "abril";
		_mesnom[5] = "mayo";
		_mesnom[6] = "junio";
		_mesnom[7] = "julio"; 
		_mesnom[8] = "agosto";
		_mesnom[9] = "septiembre";
		_mesnom[10] = "octubre";
		_mesnom[11] = "noviembre";
		_mesnom[12] = "diciembre";

		var _cssanchohistorial=1000;
		var _anchodia=2;//ancho expresado en pixels;
		
		d= new Date;
		_Hoy= (d.getFullYear())+'-'+d.getMonth()+'-'+d.getDate();
		
	</script> 
		
	<script type="text/javascript" charset="UTF-8" src="./IND/IND_js_gestion_consultas.js?v=<?php echo time();?>"></script>   
	<script type="text/javascript" charset="UTF-8" src="./IND/IND_js_gestion_muestra.js?v=<?php echo time();?>"></script>  
	<script type="text/javascript" charset="UTF-8" src="./IND/IND_js_gestion_interaccion.js?v=<?php echo time();?>"></script>  

	<script type="text/javascript">		
		consultaGrupos();
	</script>	



</body>
