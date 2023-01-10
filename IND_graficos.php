<?php
/**
* IND_graficos.php
*
* Estructura HTML donde se cargan los indicadores y sus datos en modo gr·fico.
 * 
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2023 TReCC SA
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los t·rminos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser ·til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT·A; sin siquiera la garant·a impl·cita de
* CAPACIDAD DE MERCANTILIZACI·N o utilidad para un prop·sito particular.
* Consulte la "GNU General Public License" para m·s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu·: <http://www.gnu.org/licenses/>.
*/
ini_set('display_errors',true);
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso com˙n.
$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){	
	header('location: ./PAN_listado.php');//sin panel definido en sesion, envÌa al selector de paneles
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
	
	<link rel="stylesheet" type="text/css" href="./_terceras_partes/jqplot/jqplot.1.0.9/jquery.jqplot.css">
	
	<style type="text/css">
	</style>
</head>
<body>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
	
	<?php 	insertarmenu();	?>
		
	<div id='formcent' class='formCent'>
		<form id='general'>
			<p><label>Id en la base </label><span id='cnid'>0000</span>
				<a class='cancelar' onclick='cerrarForm();'>cerrar</a>
				<a onclick="enviarFormulario();">guardar</a>
				<a id="aactivaElim" class='eliminar' onclick="activarEliminar(this);">Eliminar</a>
			</p>
			
			<label>titulo del grafico</label>
			<input id='ctitulo' value='nn' name='titulo'>
			<input type='hidden' id='cid' name='id'>
			<input fijo='fijo' type="hidden" value="cambia" name="accion">
			
			<label  class='chica' title='tipo de gr·fico'>tipo</label>
			
			<select id='ctipo' name='tipo'>
	            <option value='histograma anual'>histograma anual</option>
	            <option value='variacion temporal'>variacion temporal</option>
	            <option value='torta mensual'>torta mensual</option>
			</select>
			<br>
			<h2>restringir periodo de visualizaciÛn</h2>
			<label class='chica'>inicio:</label><input type='date' name='fecha_inicio'> / 
			<label class='chica'>fin:</label><input type='date' name='fecha_fin'>
			<label class='chica'>elementos (series)(indicadores)</label>
			<br>
			<div id='listadeindicadores'></div>
			<div id='selectordeindicadores'></div>
		</form>
		
	</div>

		
	<div id="encabezado">	
			
		<a class='boton' id='botoncrear' onclick='crearGrafico()'>crear Gr·fico</a>
		<!--
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio a·n no ha llegado' value='mostrar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?mostrarinactivos=si';">
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio a·n no ha llegado' value='ocultar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?';">
		-->
		<a class='boton' id='botongestion'          title='el modo gestion sirve crear y modifitar la estructura d elos indicadores y cargar sus datos'       onclick="window.location='./IND_gestion.php?';" >modo gestion</a>
		<a class='boton' id='botongrafico' disabled title='el modo gr·ficos permite visualizar los indicadores en gr·ficos de lineas, barras, y tortas'       onclick="window.location='./IND_graficos.php';" >modo gr·ficos</a>	
		<a class='boton' id='botontabla'            title='el formato tabla sirve para copiar los datos a una hoja de c·lculo (MS-excel o Libreoffice scalc)' onclick="window.location='./IND_tablas.php';"    >modo tablas</a>	

	</div>	

	<div id="pageborde">	
		<div id="page">
			<h1>Gr·ficos de Indicadores</h1>	
			<h2>planilla de carga y seguimiento de registros</h2>
			<div id="contenedor"></div>
		</div>
	</div>



	<script type='text/jscript'>	
		var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';//DEPRECAR
		var _UsuarioAcc='';
		var _UsuarioTipo='';	
		var _HabilitadoEdicion='si';	


		var _Opciones=Array();
		var _idgra='';

		var _DatosGrupos=Array();
			
		var _editarInd = '';
		var DatosGenerales=Array();		
		var _DatosIndicadores=Array();
	</script>

    <script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/jquery.jqplot.min.js"></script>
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.canvasAxisLabelRenderer.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.dateAxisRenderer.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.barRenderer.js"></script>
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.categoryAxisRenderer.js"></script>
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.pointLabels.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.pieRenderer.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.donutRenderer.js"></script>
	
	<script type="text/javascript" src="./IND/IND_js_graficos.js"></script>

	<script type='text/jscript'>	
		consultarDatosGrupos();
	</script>


</body>
