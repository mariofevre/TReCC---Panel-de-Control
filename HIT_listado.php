<?php 
/**
* HIT_listado.php
*
 * Estructura HTML donde cargar los contenidos del módulo HIT, hitos.  
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	especificaciones
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2023 TReCC SA
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
	header('location: ./PAN_listado.php');//sin panel definido en sesion, envía al selector de paneles
}
?>

<head>
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">			
	
	<link rel="stylesheet" type="text/css" href="./HIT/css/HIT.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./HIT/css/HIT_form.css?v=<?php echo time();?>">
	
	
	<style type="text/css">	
		<?php 
		if(!isset($_GET['modo'])){$_GET['modo']='';}
		if($_GET['modo']=='resumen'){
			echo"
				body{
					padding:0;
					background-image:none;
					margin:0px;
				}
			";		
		}		
		?>
	</style>
</head>
<body onkeyup="tecleoGeneral(event)">

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
	
	<?php  insertarmenu();	//en comunes.php	?>
	
	<div id="pageborde">
		<div id="page">	
			<h1>Hitos</h1>
			
			<div class="botonerainicial" tipo="acciones">	
				<a class="botonmenu" idhit='0' onclick="abreFormularioHit(this)" title="agregar HITO"><img src="./a_comunes/img/agregar.png" alt="agregar"> Hito</a>
				<a class="botonmodogestion" idhit='0' onclick="modoA('gstion')" title="modo gestión">modo gestión</a>
				<a class="botonmodotabla" idhit='0' onclick="modoA('tabla')" title="modo tabla">modo tabla</a>
			</div>
			
			<div id="contenidoextenso">			
				<div id='filaencabezado' class='fila encabezado'><!--
					--><div id='tipo'>T</div><!--
					--><div class='grupos'>G</div><!--
					--><div class='nombre'>Hito</div><!--
					--><div class='actor'>Actor</div><!--
					--><div class='estado'>estado</div><!--
					--><div class='formula'></div><!--
					--><div class='fecha'>Fecha</div><!--
				--></div>
				<img id='cargainicial' src='./a_comunes/img/cargando.gif'>
				<div id='listado'></div>
				</div>
			</div>
		</div>
			
		<div id='modelos'>
			
			<div class='fila'><!--
				--><div id='tipo' title=''></div><!--
				--><div class='grupos'><div id='grupoa'></div><div id='grupob'></div></div><!--
				
				--><a onclick='abreFormularioHit(this.parentNode);' class='nombre'></a><!--
				--><div class='actor'></div><!--
				
				--><div id='estado' class='estado '></div><!--
				--><div id='formula' class='formula '></div><!--
				--><div class='fecha'></div><!--
				--><div class='opcion' style='color:silver;' href=''>< automático</div><!--
			--></div>
		</div>


		<div id='formcent' class='formCent' name='general'>
			<form id='general'>
				<p><label>Id en la base </label><span id='cnid'>0000</span> <a class='cancelar' onclick='cerrarForm();'>cerrar</a><a id='submit' onclick="enviarFormulario(this);">guardar</a><a id="aactivaElim" class='eliminar' onclick="activarEliminar(this);">Eliminar</a></p>
				
				<div>
					<label>nombre del Hito</label>
					<input type='hidden' id='cid' name='id'>
					<input type='text' id='cnombre' name='nombre'>
					<input fijo='fijo' type="hidden" value="cambia" name="accion">
				</div>
				
				<br>
				<div>
				<label>grupo primario <a href='javascript:void(0)' onclick='grupoForm("a")'><img alt='editar' src='./a_comunes/img/editar.png'></a></label>
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
				</div>
				
				<div>
				<label>grupo secundario <a href='javascript:void(0)' onclick='grupoForm("b")'><img alt='editar' src='./a_comunes/img/editar.png'></a></label>
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
				</div>

				<div>
				<label class='chica' >Tipificación.<br> Hitos estandar.</label>
				<input 
					type='hidden' 
					id='cid_p_HITtipohito_id_nombre' 
					name='id_p_HITtipohito_id_nombre'
				><input 
					id='cid_p_HITtipohito_id_nombre-n' 
					onblur='vaciarOpcionares(event)' 
					onkeyup='filtrarOpciones(this);' 
					onfocus='opcionarTipos(this);'
				><div class='auxopcionar'><div class='contenido'></div></div>

				</div>
				<div>

				<label class='chica' >Actor responsable principal.</label>
				<input 
					type='hidden' 
					id='cid_p_ACTactores_id_nombre' 
					name='id_p_ACTactores_id_nombre'
				><input 
					id='cid_p_ACTactores_id_nombre-n'
					name='id_p_ACTactores_id_nombre-n' 
					onblur='vaciarOpcionares(event)' 
					onkeyup='filtrarOpciones(this);' 
					onfocus='opcionarActores(this);'
				><div class='auxopcionar'><div class='contenido'></div></div>        
				</div><br>
			 
				<div>
					<label>Cargar fecha manualmente</label><input type='radio' name='origen' value='opmanual' onchange='ajustarform();'><br>
					<label>Calcular fecha por fórmula</label><input type='radio' name='origen' value='opformula' onchange='ajustarform();'>
				</div>
				
				<div id='opprevision'>
					<label>Fecha Prevista</label><input type='radio' name='fecha_tipo' value='prevista'><br>
					<label>Fecha Efectiva</label><input type='radio' name='fecha_tipo' value='efectiva'>
				</div>
				
				<div id='opmanual'>
					<label>Fecha</label><br>
					<input id='cfecha_fecha' name='fecha_fecha' type='date' value=''>
					<br>
					<label>considerar esto desde una fecha previa al día de hoy</label><input type='checkbox' onchange='cambiarFechaVal(this)'>
					<br>
					<label id='etiqueta_validodesde'>fecha considerada desde:</label>
					<input id='cfecha_validodesde' name='fecha_validodesde' class='dia' value='' type='date'>
				</div>

				<div id='opformula'>
					<label title='fórmula para cálculo del indicador. (ver manual)'>fórmula <a target='blank' href='./a_comunes/manuales/manualformulashitos.php'>ver manual</a></label><br>
					<input id='cformula' name='formula'>       
				</div>
				
				<div id='opnuevafecha'>
					<label title='definir una nueva fecha para este hito'>Nueva fecha</label><br>
					<input type='button' id='nuevafecha' onclick='abreFormularioFecha(this)' value='nueva fecha'>       
				</div>
			</form>
		</div>

		<div id='formcent' class='formCent' name='nuevafecha'>
			<form id='nuevafecha'>
				<p>
					<label>nombre del Hito</label><span id='cnombre' name='nombre'></span>
					<input type='hidden' id='cid' name='id'>
					
					<br>
					
					<label>Id en la base </label><span id='cnid'>0000</span> 
					<a class='cancelar' onclick='cerrarForm();'>cerrar</a>
					<a id='submit' onclick="enviarFormularioFechanueva();">guardar</a>
					<a id='botonconfirma' title='Confirma que la fecha prevista ocurrió ese día' class='confirmar' onclick='confirmarFormularioFechanueva();'>Confirmar</a>
				
					<input type='hidden' name='fechaprevista'>
					
					
					<br>
				<div id='opprevision'>
					<label>Fecha Prevista</label><input type='radio' name='fecha_tipo' value='prevista'><br>
					<label>Fecha Efectiva</label><input type='radio' name='fecha_tipo' value='efectiva'>
				</div>
				<label>nueva fecha para este hito</label>
				<input id='cfecha_fecha' name='fecha_fecha' type='date' value=''>
				<br>
				<label>considerar esto desde una fecha previa al día de hoy</label><input type='checkbox' onchange='cambiarFechaVal(this)'>
				<br>
				<div class='barrafecha'>
					<div class='inputfecha'>
					<label id='etiqueta_validodesde'>fecha considerada desde:</label>
					<input onchange='localizarFechaVal(this)' id='cfecha_validodesde' name='fecha_validodesde' type='date'>
				</div>
				</div>
				<div id='historial'>
					
				</div>
			</form>
		</div>	
			
		<div id='formcentConf' class='formCent' name='nuevafecha'>
			<form id='confirmar'>
				<p><label>Id en la base </label><span id='cnid'>0000</span> <a class='cancelar' onclick='cerrarForm();'>cancelar</a><a id='submit' onclick="enviarFormularioConf();">confirmar</a>
				<div>
				<label>nombre del Hito</label>
				<input type='hidden' id='cid' name='id'>
				<span id='cnombre' name='nombre'></span>
				<br>
				<label>fecha de ocurrencia confirmada</label>
				<input id='cfecha_fecha' name='fecha_fecha' value='' type='date'>	
			</form>
		</div>	
	</div>	


		
	<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>
		
	<script type="text/javascript" src="./HIT/HIT_js_listado_consultas.js?v=<?php echo time();?>"></script>
	<script type="text/javascript" src="./HIT/HIT_js_listado_interaccion.js?v=<?php echo time();?>"></script>
	<script type="text/javascript" src="./HIT/HIT_js_listado_mostrar.js?v=<?php echo time();?>"></script>
		
		
		
		
	<script tipe="text/javascript">	 
		
		var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';//DEPRECAR
		var _UsuId = '';
    	var _UsuAcc = '';
        var _HabilitadoEdicion = '';
		
		
		    
		var _DatosGrupos=Array();
		var _Hitos=Array();


		var _Modo='gestion'; //modo de representación
			
		//funciones para la operación del formulario central
		var _NombreMeses=Array(
			'',
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
	   );
	   
		
			
		//cargarGrupos();
			
		cargaAccesos();
		
		

		function Reincia(){
			cargaAccesos();
		}

		function modoA(_nuevomodo){
			if(_nuevomodo==_Modo){return;}
			_Modo=_nuevomodo;
			document.querySelector('#page').setAttribute('modo',_nuevomodo);
			cargarHitos();
		}
	</script>

</body>
</html>
