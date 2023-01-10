<?php
/**
* TAR_reporte_display.php
*
 * Estructura HTML que genera un reporte de estado del seguimiento de tareas
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
	 
if(!isset($_GET['idplan'])){$_GET['idplan']='';}
?><!DOCTYPE html>

<head>
<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./TAR/css/TAR_reporte_display.css?v<?php echo time();?>">
	
	<style type="text/css">
		
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
	        	<a class='botonmenu' href='./TAR_seguimiento.php'>Volver a la versión interactiva</a>
	        	<a class='botonmenu' id='botonpaginar' onclick='paginar();'./TAR_seguimiento.php'>paginar para imprimir</a>
			</div>
			
			<div id="contenidoextenso">	
				
				<div id="Reporte Inicial">

					<div id='indicadores'>
						
					<h1>Estado General de la obra</h1>	
					<p indicador='avance_plazo' visible='si'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)" checked='checked'>
						  <span class="slider round"></span>
						</label>
						<b>Avance del plazo de obra : </b>
						<span id='resultado'>
							<span id='avance_plazo'></span>
							<br>
							(%)		
						</span>	
						<span class='explica'>
							(Porcentaje de joranadas planificadas de obra transcurridas sobre total de jornadas de obra planificadas)
						</span>			
					</p>
					<p indicador='avance_certificacion' visible='si'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)" checked='checked'>
						  <span class="slider round"></span>
						</label>
						<b>Avance de certificación al <span id='fecha_certificacion'></span>: </b>
						<span id='resultado'>
							<span id='avance_certificacion'></span>
							<br>
							(%)		
						</span>	
						
						<span class='explica'>
							(Avance correspondiente al certificado de avance de obra.)
						</span>			
					</p>

					<p indicador='avance_curva' visible='si'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)" checked='checked'>
						  <span class="slider round"></span>
						</label>
						<b>Avance de previsto en curva: </b>
						<span id='resultado'>
							<span id='avance_curva'></span>
							<br>
							(%)		
						</span>	
						
						<span class='explica'>
							(Avance correspondiente a la curva de inversión proyectada vigente.)
						</span>			
					</p>
		
					<h1 visible='no'>Indicadores de cumplimiento del plan</h1>						
					<p indicador='desfase_medio_fin' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>Desfase medio de finalización de tareas terminadas: </b>
						<span id='resultado'>
							<span id='desfase_medio_fin'></span>
							<br>
							(días)
						</span>
						<span class='explica'>(un valor negativo representa anticipo, un valor positivo retraso)</span>			
					</p>
					
					<p indicador='dilacion_media' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>Dilación media de tareas terminadas: </b>
						<span id='resultado'>
							<span id='dilacion_media' visible='no'></span>
							<br>
							(días)
						</span>
						<span class='explica'>(solo se consideran tareas que se extendieron en su duración prevista)</span>
					</p>

					<p indicador='demora_actual_estimada' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>Demora actual estimada en tareas activas: </b>
						<span id='resultado'>
							<span id='demora_actual_estimada' visible='no'></span>
							<br>
							(días)
						</span>
						
							
						<span class='explica'>
							(diferencia media entre medición de relevamiento y avance del plazo de las tareas activas y completadas en los últimos 30 días).
							(un valor negativo representa anticipo, un valor positivo retraso).	
						</span>			
					</p>
					
					<p indicador='avance_jornadas' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>Avance de jornadas de tarea : </b>
						<span id='resultado'>
							<span id='avance_jornadas'></span>
							<br>
							(%)
						</span>
								
						<span class='explica'>
							(Porcentaje de joranadas planificadas de tarea ya ejecutadas del total de jornadas de tarea planificadas)
						</span>			
					</p>

					<p indicador='ocurrencia_jornadas' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>Ocurrencia de jornadas de tarea planificadas hasta la fecha: </b>
						<span id='resultado'>
							<span id='ocurrencia_jornadas'></span>
							<br>
							(%)
							<span id='histograma'><canvas></canvas></span>
						</span>
						<span class='explica'>
							(Porcentaje de joranadas planificadas de tarea ya ejecutadas del total de jornadas de tarea planificadas hasta la fecha)
						</span>			
					</p>
					
					
					<p indicador='superposicion_jornadas_alacanzada' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>nivel de complejidad alcanzado: </b>
						<span id='resultado'>
							<span id='superposicion_jornadas_alacanzada'></span>
							<br>
							(%)		
							<span id='histograma'><label>Parcial</label><canvas id='abs'></canvas><label>Acumulado</label><canvas id='acc'></canvas></span>
						</span>	
						<span class='explica'>
							Índice de saturación de tareas expresado como porcentaje en relación al punto máximo de tareas que se van a realizar en simultáneo.
						</span>			
					</p>

					<p indicador='proxima_varicion_jornadas' visible='no'>
						<label class="switch">
						  <input type="checkbox" onchange="guardarConfigReporteMuestra(this)">
						  <span class="slider round"></span>
						</label>
						<b>proxima variación en complejidad: </b>
						<span id='resultado'>
							<span id='proxima_varicion_jornadas'></span>
							<br>
							(%)
							<span id='histograma'><canvas></canvas></span>
						</span>
						<span class='explica'>
							(Variación para el próximo trimestre en superposición de jornadas de tareas respecto del último trimestre transcurrido)
						</span>			
					</p>
					
				</div>
			</div>
				
				
			<h1>Diagramas de tareas activas y tareas planificadas para esta fecha</h1>			
			<canvas id="canvasgrafico"></canvas>			
			<h1>Registro fotográfico</h1>
			<div id='registro_foto'>
			</div>

				
		</div>
	</div>
	</div>
	
<div id='iconos'>
	<img id='tilde_ok' src='./a_comunes/img/tilde_ok.png'>
	<img id='tilde_ini' src='./a_comunes/img/tilde_ini.png'>
	<img id='tilde_vacio' src='./a_comunes/img/tilde_vacio.png'>
	<img id='tilde_foto' src='./a_comunes/img/icono_foto.png'>
</div>
	
    <script tipe="text/javascript">
		

	
        var _PanId = '<?php echo $PanelI; ?>'; //deprecar
        var _PanelI = '<?php echo $PanelI; ?>';
        
    	var _UsuId = '';
    	var _UsuAcc = '';
        var _HabilitadoEdicion = '<?php echo $HabilitadoEdicion; ?>';

        var _DataPlanes=Array();
        var _DataPlanesOrden=Array();
        
        var _DataEjecuciones=Array();
		var _DatosUsuarios=Array();
		var _IdEjecEdit=''; //id de la ejcucion en edicion
		var _Grupos=Array();
		
		var _Reporte = {};


		
		_f = new Date();
		_m=(1+_f.getMonth());
		_m=_m.toString().padStart(2,"0");
		_d=(_f.getDate());
		_d=_d.toString().padStart(2,"0");
		var _Hoy = _f.getFullYear()+'-'+_m+'-'+_d;
		var _Hoy_unix=Math.round(_f.getTime()/1000);
		
		
		//definen zoom temporal....
		
		var _margen_temporal_visible='';
		
		var _anchogantt=500;
		var _anchodia=_anchogantt/2/_margen_temporal_visible;
		//caracteristicas del zoom temporal...
		_barrido=_anchogantt/_anchodia;	
		var _diaInicio_rel = Math.round((-1)*_barrido/2);
		var _offset=((-1*_barrido/2)-_diaInicio_rel)*_anchodia;
		var _diaFin_rel = Math.round(_barrido/2);
		var _desp_render_dias=0;
		

		var _DataTareas=Array();
		var _IdTareaEdit=''; //id del seguimiento en edicion
		
		var _nFile=0;	
		var xhr=Array();
		var inter=Array();

		var _DataRelLocales={};
		
		var _IdPlanActivo='<?php echo $_GET['idplan']; ?>';
		
		var _IdIndCurva='';
		

		var _ConfGra={
			'canvas_ancho':1200, //	_anchototal=1000;
			'canvas_alto':1250, //_altototal=1250;

			'fila_alto':45, //	_altofila=30;
			
			'barra_alto':8, //_altoBarras=5;
			'barra_separa':3, //	_separacionbarras=2;
			
			'dias_dehoy_inicio': -80, //_dias_dehoy_inicio = -150;
			'dias_ancho':10, //_anchodia = 3
			
			'tilde_ini':document.querySelector('#iconos img#tilde_ini'),
			'tilde_fin':document.querySelector('#iconos img#tilde_ok'),
			'tilde_vacio':document.querySelector('#iconos img#tilde_vacio'),
			'tilde_foto':document.querySelector('#iconos img#tilde_foto')
		};
		_ConfGra['encabez_alto']= _ConfGra.barra_alto * 14;
		_ConfGra['dias_dehoy_fin']= (_ConfGra.canvas_ancho / _ConfGra.dias_ancho) - _ConfGra.dias_dehoy_inicio;
		_Meses=Array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre');

</script>

<script type="text/javascript" charset="UTF-8" src='./TAR/TAR_js_reporte.js'></script>
 
<script type="text/javascript">
	

	consultaConfig(); // al finalizar ejecuta siguientes consultarReporte();consultarResumenCertificacion();consultarResumenIndicadores();
	function Reinicia(){consultaConfig();}
	// consultarGrupos();
	// consultarUsuarios();
	
	
</script>


</body>
