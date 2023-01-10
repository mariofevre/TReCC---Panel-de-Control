<?php 
/**
* INF_redaccion.php
*
* Estructura HTML donde se cargarán lso listados de modelos de informes, informes y contenido de informe
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	informes
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2014 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los tï¿½rminos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser ï¿½til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTï¿½A; sin siquiera la garantï¿½a implï¿½cita de
* CAPACIDAD DE MERCANTILIZACIï¿½N o utilidad para un propï¿½sito particular.
* Consulte la "GNU General Public License" para mï¿½s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquï¿½: <http://www.gnu.org/licenses/>.
*/
ini_set('display_errors',true);
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){	
	header('location: ./PAN_listado.php');//sin panel definido en sesion, envía al selector de paneles
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
		
	<link rel="stylesheet" type="text/css" href="./INF/css/INF.css?v=<?php echo time();?>">	
	
	<style type="text/css">
			<?php  echo $InformeDatos['css'];?>		
	</style>

	<link rel="stylesheet" type="text/css" href="./_terceras_partes/jqplot/jqplot.1.0.9/jquery.jqplot.css">
</head>
<body>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script> 
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>    	
    
    
	<div id="informe">		
	</div>	

	<div class="hoja" id='HojaModelo'>
		<div id='encabezado'></div>			
		<div class='contenido'></div>
		<div id='pie'></div>
	</div>		

	<div id='hojaBase' class='hoja'>
		<div id='encabezado'></div>
		<div class='contenido' id='contenidoBase'></div>
	</div>

	<div id='botoneraV2'>
		<a class='secund' href='./PAN_general.php'>volver al panel general</a>	
		<a class='secund' accion='crear' onclick='formularModelo(this,event)'>crear nuevo modelo de informe</a>	
		<div id='listadoMod' class='marco'></div>
		<div id='listado' class='marco'></div>		
		<div id='estado' class='marco'>
			<div id='im'></div><div id='tx'></div>	
		</div>
			
		<a id='paginar' class='ppal' onclick='_ModoEdicion="si";INICIAPAG();'>terminar edicion</a>
		<a class='ppal' accion='guarda' onclick='formularModelo(this,event);'>configurar modelo</a>
		<a class='ppal' onclick='formIndice();'>configurar índice</a>	
		<a class='ppal' onclick='formularCaratula();'>configurar carátula</a>	
	</div>

	<div id='editorindice' style='display:none;'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>		
		<a class='botonguardar' onclick='guardar(this);'>guardar</a>	
		<form action='./INF/INF_ed_indice.php' method='post' >
			
			<label>Título del modelo</label>
			<input name='nombre'>
			<input type='hidden' name='id'>
			<br>
			<br>
			<input type='hidden' name='idmodelo'>
			<h2>Índice de secciones</h2>
			<div id='indiceSecciones'></div>
			<h2 title='documentos linkeados, imagener de rótulos, etc.'>Links complementarios</h2>
			<div id='documentosComplementarios'></div>		
		</form>
		
		<form action='' enctype='multipart/form-data' method='post' id='editordecomp'>
			<label>Arraste archivos de imagen al interior:</label>
			<div id='contenedorlienzo'>									
				<div id='upload'>
					<input multiple='' id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='cargarCmp(this);'></label>
				</div>
				<div id='lienzo'>
					
				</div>	
			</div>
		</form>	
	</div>

	<form id='formEditaInforme' style='display:none;' method='POST' target='ventanaaccion' action='./INF/INF_ed_cambiar_informe.php' enctype='multipart/form-data'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>		
		<a class='botonguardar' onclick='guardar(this);'>guardar</a>
		<input type='hidden' name='id' value=''>
		
		<h3><label>Número de informe</label></h3>
		<input type='text' name='norden'>
		
		<h3><label>Título del Informe (de este informe en particular)</label></h3>
		<input type='text' name='titulo'>
		
		<h3><label>Fecha de inicio del período de tiempo del cual da cuenta este informe</label></h3>
		<input class='mes' name='reportedesdeextra_d'>-<input  class='mes' name='reportedesdeextra_m'>-<input class='fecha' name='reportedesdeextra_a'> 

		<h3><label>Fecha de cierre del período de tiempo del cual da cuenta este informe</label></h3>
		<input class='mes' name='reportehastaextra_d'>-<input  class='mes' name='reportehastaextra_m'>-<input class='fecha' name='reportehastaextra_a'> 
	</form>	


	<form action='./INF/INF_ed_seccion.php' method='post' id='editorseccion' style='display:none;'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>		
		<a class='botonguardar' onclick='guardar(this);'>guardar</a>
		<a class='botoneliminar' onclick='eliminarSecc(this);'>eliminar</a>		
		<label>Título de la Sección</label>
		<input name='nombre'>
		<input type='hidden' name='id'>
		<br>
		<br>
		
		<label>Sección discontinua (se incorpora solo para algunas fechas)</label>
		<input onclick='togleSeccFech(this);' id='fechas' type='checkbox' for='fechasDisc'>
		<br>		
		<label>desde</label>
		<input too='fechasDisc' readonly='readonly' class='mes' name='usodesde_d'>-<input too='fechasDisc' readonly='readonly' class='mes' name='usodesde_m'>-<input too='fechasDisc' readonly='readonly' class='fecha' name='usodesde_a'> 
		<label>hasta</label>
		<input too='fechasDisc' readonly='readonly' class='mes' name='usohasta_d'>-<input too='fechasDisc' readonly='readonly' class='mes' name='usohasta_m'>-<input too='fechasDisc' readonly='readonly' class='fecha' name='usohasta_a'>
		<br>
		<br>
		
		<label>Permite escribir texto manualmente</label>
		<input onclick='togleDisp(this)' type='checkbox' for='permitetexto' act='1' inact="0" >
		<input type='hidden' name='permitetexto'>
		<br>
		
		<label>Permite cargar fotos manualmente</label>
		<input onclick='togleDisp(this)' type='checkbox' for='permiteimagen' act='1' inact="0" >
		<input type='hidden' name='permiteimagen'>
		<br>
		<h2>listado de componentes automáticos incorporados <a target='blank' href='./complementos/manualformulasautomaticas.php' >ver manual</a></h2>
		<div id='listadoAutosecciones'></div>
	</form>	
	
	<form action='./INF/INF_ed_componente.php' method='post' id='editorComponente' style='display:none;'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>		
		<a class='botonguardar' onclick='guardar(this);'>guardar</a>
		<a class='botoneliminar' onclick='eliminar(this);'>eliminar</a>
		<label>Descripción del componente</label>
		<input name='obs'>
		<input type='hidden' name='idsecc'>
		<input type='hidden' name='id'>
		<label>Tipo</label>

		<select name='tipo'>
			<option>-elegir-</option>
			<option value='certificaciones'>certificaciones</option>
			<option value='check'>check</option>
			<option value='comunicaciones'>comunicaciones</option>
			<option value='documentacion'>documentacion</option>
			<option value='fechas'>fechas</option>
			<option value='indicadores'>indicadores</option>
			<option value='informes'>informes</option>
			<option value='hitos'>hitos</option>
			<option value='magen'>magen</option>
			<option value='indicadores histograma'>indicadores histograma</option>
			<option value='indicadores grafico'>indicadores grafico</option>
			<option value='tareas'>tareas</option>
		</select>
		 <a target='_blank' href='./complementos/manualformulasautomaticas.php' onclick='irAlManual(event,this);'> ver manual</a>
		<textarea class='mceNoEditor' name='formula'></textarea>
	</form>	
	
	<form class='formCent' id='editordetexto'>
		<a class='botoncerrar' onclick='cerrarFormEstado(this.parentNode.getAttribute("id"));'>cerrar</a>		
		<a class='botonguardar' onclick=' guardarTexto();'>guardar</a>
		<a class='botonretexto' onclick='copiarTexto(this);'>copiar texto anterior</a>
		<input type='hidden' name='id'>
		<input type='hidden' name='id_p_INFinforme_id'>
		<input type='hidden' name='id_p_INFsecciones_id'>
		<label>Texto</label>
		<textarea id='mce_redacc' class='mceEditable' name='texto'></textarea>
	</form>	
		
	<form action='' enctype='multipart/form-data' method='post' id='editordeimagen' style='display:none;'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
		<label>Arraste archivos de imagen al interior:</label>
		<div id='contenedorlienzo'>									
			<div id='upload'>
				<input multiple='' id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='cargarJpg(this);'></label>
			</div>
			<div id='lienzo'></div>	
		</div>
	</form>		

	<form action='./INF/INF_ed_epigrafe.php' method='post' id='editordeepigrafe' style='display:none;'>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
		<a class='botonguardar' onclick='guardar(this);'>guardar</a>	
		
		<input type='hidden' name='idsecc'>
		<input type='hidden' name='idimg'>
		<label>Epígrafe</label><br>
		<textarea id='mce_epigrafe' class='mceEditable' name='epigrafe'></textarea>
	</form>	

	<form action='' method='post' id='editordepdf' style='display:none;'>
		<h3></h3>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
		<input type='hidden' name='ninf'>
		<input type='hidden' name='fechainf'>
		
		<label>Presentación PDF</label>		
		<div id='contenedorlienzo'>									
			<div id='upload'>
				<input id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='enviarPdf(this);'></label>
			</div>
			<div id='lienzo'>f</div>	
		</div>
		
		<label>Versiones editables, preliminares y archivos de trabajo</label>
		<div id='contenedorlienzo'>									
			<div id='upload'>
				<input id='uploadinputb' multiple style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='enviarDocs(this);'></label>
			</div>
			<div id='lienzob'></div>	
		</div>
	</form>	
			
	<form class='formCent' id='formmodelo' style='display:none;'>
		<p>
			<label>Id en la base </label><span id="mid"></span> 
			 <input id="mid" name="id" value="" type="hidden">
			 <input name="accion" value="" type="hidden">
			<a class="cancelar" onclick="cerrarForm();">cerrar</a>
			<a id="submit" onclick="enviarFormulario(this);">guardar</a>
			<a id="aactivaElim" class="eliminar" onclick="EliminarModelo();">Eliminar</a>
		</p>
		<h1>Modelo de Informe</h1>
		
		<p>Un Modelo de Informe es la estructura básica sobre la cual se generarán periódicamente los informes</p>
			<br>
			<h2>Características Generales</h2><br>
			<div>
				<label>Nombre del modelo</label>
				<input id="nombre" class="chico" name="nombre" value="" type="text">
				<br>
			</div>
			<div>
			<label>Prefijo en la numeración del modelo</label>
			<input id="nprefijo" class="chico" name="nprefijo" value="" type="text">
			 </div>
			<div>		
			<label>Tipo de presentación</label>
			<select name="emision"><option value="-[-BORRX-]-">-ninguno-</option><option value="periódica" selected="yes">periódica</option><option value="eventual">eventual</option></select>
			 </div>
		   <div>	
			<label>Redacción en línea, (permite generar el informe en línea. de otro modo solo permite archivos PDF como registro)</label>
			<input name="redaccion" id="redaccion" value="1" type="hidden">
			<input name="" value="" checked='' onclick="alterna('redaccion', this.checked);" type="checkbox">	
			</div>
			
			<br>
			
			<h2>Características Temporales</h2>
			<br>
			 <div>
			<label>Periodicidad de presentación</label>
			<select name="periodicidad">
				<option value="-[-BORRX-]-">-ninguno-</option>
				<option value="diario">diario</option>
				<option value="semanal">semanal</option>
				<option selected="yes" value="mensual">mensual</option>
				<option value="bimestral">bimestral</option>
				<option value="trimestral">trimestral</option>
			</select>
			</div>
			<div>
			
			<label>Fecha de inicio (la fecha de inicio fija la fecha base de presentación de cada uno de los infomes siguientes)</label>
			<input class="dia" size="2" id="desde_d" name="desde_d" value="" type="text">
			<input class="mes" id="desde_m" name="desde_m" value="" type="text">
			<input class="ano" id="desde_a" name="desde_a" value="" type="text">
			</div>
			<div>
			
			<label>Fecha de fin (no se generan más informes a presentar, superada esta fecha)</label>
			<input class="dia" id="hasta_d" name="hasta_d" value="" type="text">
			<input class="mes" id="hasta_m" name="hasta_m" value="" type="text">
			<input class="ano" id="hasta_a" name="hasta_a" value="" type="text">
			  </div>
			<div>	
			
			<label>Desfasaje temporal entre la fecha de cierre de datos y fecha de publicación. Por lo general se adopta 1 dia</label>
			<input id="desfase" class="chico" name="desfase" value="1" type="text">
		
			</div>
			<br>
			<h2>Características de Visualización</h2>
			<br>
			
			
			<div>
				<label>encabezado para todas las hojas en formato HTML</label>
				<textarea name="encabezadohtml"></textarea>
			 </div>
			<div>
				<label>pie para todas las hojas en formato HTML</label>
				<textarea name="piehtml"></textarea>
			 </div>
			<div>
				<label>estilo por cascada para aplicar en el informe para su formato HTML</label>
				<textarea name="css"></textarea>
			 </div>
	</form>	

	<form class='formCent' id='formcaratula'>
		<p>
			<label>Id en la base </label><span id="mid"></span> 
			 <input id="mid" name="id" value="" type="hidden">
			 <input name="accion" value="" type="hidden">
			<a class="cancelar" onclick="cerrarFormEstado(this.parentNode.parentNode.getAttribute('id'));">cerrar</a>
			<a id="submit" onclick="editarCaratula();">guardar</a>
		</p>
		<h1>Diseño de carátula</h1>
		
		<p>La carátula se aplica a cada informe permitiendo algunos ajustes automáticos y manuales</p>
	 
		<p>para automatizar campos, debe editar el contenido en HTML <> e introducir el código correspondiente a cada campo</p>
		<ul>
			<li><b>Número de informe:</b>  <pre><code>&lt;span name="Ninforme">NI&lt;/span></code></pre></li>
			<li><b>Imagen del informe:</b>  <pre><code>&lt;span name="Nimagen">imagen&lt;/span></code></pre></li>
			<li><b>Fecha del informe:</b>  <pre><code>&lt;span name="Nfecha">fecha&lt;/span></code></pre></li>	
			<li><b>Mes de emisión:</b>  <pre><code>&lt;span name="Nmesano">mes&lt;/span></code></pre></li>
			<li><b>Mes previo a la emisión:</b>  <pre><code>&lt;span name="Nantemesano">mes&lt;/span></code></pre></li>		
		</ul>
		
		<p>
			  <label>Modo caratula</label>
				<select name="caratulamodo">
					<option value='sin caratula'>Sin Carátula</option>
					<option value='pagina'>Primera página completa</option>
					<option value='media pagina'>Primera media página</option>
					<option value='flexible'>Alto flexible al inicio</option>
				</select>
		</p>
		<br>
			
		<h2>Modelo de carátula</h2>
		<textarea id='caratulahtml' name="caratulahtml" class='mceEditable'></textarea>
	</form>	
	

			
	<div id='coladesubidas'></div>	

    <script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/jquery.jqplot.min.js"></script>

	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.dateAxisRenderer.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.barRenderer.js"></script>
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.categoryAxisRenderer.js"></script>
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.pointLabels.js"></script>	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.pieRenderer.js"></script>
	
	<script type="text/javascript" src="./_terceras_partes/jqplot/jqplot.1.0.9/plugins/jqplot.donutRenderer.js"></script>
	
	<script type="text/javascript" src="./_terceras_partes/tinymce/tinymce.6.3.1/tinymce.min.js"></script>



<?php
	$Id = isset($_GET['id']) ? $_GET['id'] : '';
	$EDICION=isset($_GET['edicion'])? $_GET['edicion'] : 'si';
	$MODOTEXTO=isset($_GET['modotexto'])? $_GET['modotexto'] : 'no';

	$f=explode("/",__FILE__);
	$File=$f[(count($f)-1)];
		
	$Idinforme = isset($_GET['informeid']) ? $_GET['informeid'] : null;
	$grupocampo = isset($_GET['grupocampo'])?$_GET['grupocampo']:null;		
	
	if(isset($_GET['modeloid'])){$modeloId=$_GET['modeloid'];}else{$modeloId='';}
?>
	
<script type='text/javascript'>

	
	var _File = '<?php echo $File;?>';
	var _PanId = '<?php echo $PanelI;?>';
	
	var _HabilitadoEdicion='';
	
	var _resS=Array();//variable global que almacena los relustados del informe (listado de secciones sin procesamiento de fï¿½rmulas.);
	var _nnparr=0;
	var _ModoEdicion = '<?php echo $EDICION;?>';
	var _IdInforme = '<?php echo $Idinforme;?>';
	var _NumInforme = '';
	
	var _IdModelo = '<?php echo $modeloId;?>';
	
	var _fechaPresentacion = '';
	
	var _Alturacontenido=810;
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
	
    var _DatosModelos={};

	var _avanceS=0;
	var _avanceP=0;
	var _keyS=_avanceS;
	var _keyP=_avanceP;
		
	var _idcomp='';
	var _idsecc='';
	var txSecc=Array();
	var imgSecc=Array();
				
	var _fn=0;
		
		
	var _uP={'tipo':'no', 'node':null};
	
	window.onbeforeunload = function(e) {
		console.log(xhr)
		console.log(Object(xhr).length);
		for(_xn in xhr){
			console.log(xhr[_xn].readyState);
			if(xhr[_xn].readyState!=4){
				return 'Se suspenederan los documentos subiendo';
			}
		}
	}; 
</script>

<script type="text/javascript" src="./INF/INF_redaccion.js"></script>
<script type="text/javascript" src="./INF/INF_redaccion_interaccion.js"></script>
<script type="text/javascript" src="./INF/INF_redaccion_muestra.js"></script>	
	
<script type='text/javascript'>	
	function paso1(){consultarModelosDisponibles();}
	paso1();

	function paso2(){
		if(_IdInforme!=''){
			consultarInforme();
		}else{
			consultarInformesDisponibles();
		}		
	}
	
	document.querySelector('body').setAttribute('editable','<?php echo $EDICION;?>');
	document.querySelector('body').setAttribute('periodicidad','');
	document.querySelector('body').setAttribute('pruebadefallos','');
	
</script>


<script type='text/javascript'>
	function irAlManual(_event,_this){
		_event.preventDefault();
		_titulo=_this.parentNode.querySelector('select[name="tipo"]').value;
		_href=_this.getAttribute('href');
		window.open(_href+'#'+_titulo, '_blank');
	}
</script>
	
<script type="text/javascript">
	tinymce.init({ 
		selector:'textarea.mceEditable',
		plugins: "code",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "750px",
		height : "280px",
		skin : "oxide",
		forced_root_block: "p",
		remove_trailing_nbsp : true,
		remove_trailing_brs: true,
		editor_deselector : "mceNoEditor",
		invalid_elements : "br",
		extended_valid_elements: "span[name]",
		});
</script>

<script type='text/javascript'>
    window.location='#informehoy';
</script>	

<script type='text/javascript'>
    <?php if(!isset($_GET['y'])){$_GET['y']=0;};?>
    window.scrollTo(0,'<?php echo $_GET['y'];?>');
</script>
	
</body>
