<?php

/**
* CNT_gestion.php
*
* genera la estructua HTML para cargar, visualizar y formular cambios para Contatros.
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
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
if($UsuarioI==""){header('Location: ./login.php');}
$PanelI = $_SESSION['panelcontrol']->PANELI;
include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.


//include ('./login_registrousuario.php');//buscar el usuario activo.
include ('./PAN/PAN_consultainterna_config.php');//define variable $Config


$Hoy_a = date("Y");
$Hoy_m = date("m");	
$Hoy_d = date("d");	
$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;


$HabilitadoEdicion='si';
?>
<!DOCTYPE html>
<head>
	<title>Panel.TReCC</title>
	
	<link rel="shortcut icon" href="./a_comunes/img/Panel.ico">	
    <?php include("./includes/meta.php"); ?>			
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css">	
	<link id='stlores' rel="stylesheet" type="text/css" href="./EVA/css/EVA.css?v=<?php echo time();?>">
</head>

<body onkeyup='tecleoGeneral(event)'>
	
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>    	
	
	<?php  insertarmenu();	// en ./PAN/PAN_comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		
		
        <h2>Evaluación</h2> 		
        
        <div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
        
        <div class='botonerainicial' tipo='modos'>	
            <a class='botonmenu' href="./EVA_participantes.php">ver modo resumen</a> - <a class='botonmenu' href="./CNT_tabla.php">ver modo tabla</a> - 
            <a id='modocalendario' class='botonmenu' href="./EVA_modelos_instancias.php">ver mododelos</a>
            <a class='botonmenu' onclick="filtrarUsuario()">filtrar por año</a> -
            <a class='botonmenu' onclick="asignarFiltroUsuario('YO')">filtrar mías</a> 
       </div>
       
        <div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="crearParticipante()" title='agregar contratacion'><img src='./a_comunes/img/agregar.png' alt='agregar'> contratacion</a>
		</div>
		
		
		<div id="contenidoextenso" modo='general'>
			
			<div id='modo_general'>
				<div id='flotante_columna_cabecera_tabla'>
					<table>
						<thead>
							<tr>
								<th colspan='3'>Participante <a onclick='crearParticipante()'><img src='./img/agregar.png'></a></th>
							</tr>
							
							<tr id='cabecera_anos'>
								<th rowspan='3'>nombre</th>
								<th rowspan='3'>apellido</th>
								<th rowspan='3'>numero</th>
								
							</tr>
							
							<tr id='cabecera_periodos'>							
							</tr>
							
							<tr id='cabecera_instancias'>
							</tr>
							
						</thead>
						<tbody>
							
						</tbody>
					</table>	
				</div>
					
				<div id='flotante_tabla'>
					<table>
						<thead>
							<tr>
								<th colspan='3'>Participante <a onclick='crearParticipante()'><img src='./img/agregar.png'></a></th>
								<th>Instancias</th>
							</tr>
							
							<tr id='cabecera_anos'>
								<th rowspan='3'>nombre</th>
								<th rowspan='3'>apellido</th>
								<th rowspan='3'>numero</th>
								
								<th>año</th>
							</tr>
							
							<tr id='cabecera_periodos'>
								<th class='primera'>Sin periodos <a onclick='crearPeriodo()'><img src='./img/agregar.png'></a></th>
							</tr>
							
							<tr id='cabecera_instancias'>
								<th class='primera'>Sin instancia <a onclick='event.preventDefault();crearModeloInstancia()'><img src='./img/agregar.png'></a></th>
							</tr>
							
						</thead>
						<tbody>
							
						</tbody>
					</table>	
				</div>
				
			</div>
			<div id='modo_participante'>	
				
				<div id='selector' >
					<select id='periodo' onchange='_IdPer=this.value;mostrarTablaParticipante();'></select>
				</div>
				<div id='tabla'>
					<table>
						<thead>
							
							<tr>
								<th>cod <a onclick='crearParticipante()'><img src='./img/agregar.png'></a><div id='selector_nodef'></div></th>
								<th>nombre</th>
								<th>máxima instancia</th>
								<th>resultado num</th>
								<th>resultado tx</th>
							</tr>
							
						</thead>
						<tbody>
							
						</tbody>
					</table>	
				</div>
					
			
			</div>
        </div>
        
    </div>        
    </div>
    

    <form id='form_participante' class='central'>
    	<a class='cerrar' onclick='cerrarForm("form_participante");limpiarFormParticipantes()'>cerrar</a>
    	<a class='guardar' onclick='guardarParticipante();'>guarda</a>
    	<a class='eliminar' onclick='borrarParticipante()'>borrar</a>
	    	
	    <div id='participante'>	
	    	<h2>Participante</h2> 
	    	<input type='hidden' name='id_part'>
	    	<div class='datos'><label>Nombre:</label><input name='nombre'></div>
	    	<div class='datos'><label>Apellido:</label><input name='apellido'></div>
	    	<div class='datos'><label>Numero:</label><input name='numero'></div>
	    </div>
    </form>
 
 
    <form id='form_periodo' class='central'>
    	<a class='cerrar' onclick='cerrarForm("form_periodo");limpiarFormPeriodo()'>cerrar</a>
    	<a class='guardar' onclick='guardarPeriodo();'>guarda</a>
    	<a class='eliminar' onclick='borrarPeriodo()'>borrar</a>
	    	
	    <div id='periodo'>	
	    	<h2>Periodo</h2> 
	    	<input type='hidden' name='id_per'>
	    	<div class='datos'><label>Nombre:</label><input name='nombre'></div>
	    	<div class='datos'><label>Año:</label><input name='ano'></div>
	    </div>
    </form>
 
 
    <form id='form_modelo_instancia' class='central'>
    	<a class='cerrar' onclick='cerrarForm("form_modelo_instancia");limpiarFormModeloInstancia()'>cerrar</a>
    	<a class='guardar' onclick='guardarModeloInstancia();'>guarda</a>
    	<a class='eliminar' onclick='borrarModeloInstancia()'>borrar</a>
	    	
	    <div id='instancia'>	
	    	<h2>Instancia</h2> 
	    	<input type='hidden' name='id_minst'>
	    	
	    	<div class='datos'><label>Codigo:</label><input name='codigo'></div>
	    	<div class='datos'><label>Nombre:</label><input name='nombre'></div>
	    	<div class='datos'><label>Descripcion:</label><input name='descripcion'></div>
	    	<div class='datos'><label>Requerido por defecto:</label><input name='requerido_def'></div>
	    	<div class='datos'><label>Periodo:</label><input name='id_p_EVAperiodos'></div>
	    </div>
    </form>
   
    <form id='form_instancia' class='central'>
    	<a class='cerrar' onclick='cerrarForm("form_instancia");limpiarFormInstancia()'>cerrar</a>
    	<a class='guardar' onclick='guardarInstancia();'>guarda</a>
    	<a class='eliminar' onclick='borrarInstancia()'>borrar</a>
	    	
	    <div id='instancia'>	
	    	<h2>Instancia</h2> 	  
	    	<input type='hidden' name='id_inst'>
	    	<div class='datos'><label>Participante: </label><span name='participante'></span></div>
	    	<div class='datos'><label>Instancia: </label><span name='instancia'></span></div>
	    	<div class='datos'><label>Codigo: </label><span name='codigo'></span></div>
	    	<div class='datos'><label>Período: </label><span name='periodo'></span></div>
	    	<div class='datos'><label>Cumplido: </label><input type='number' name='cumplido'></div>
	    	<div class='datos'><label>Alerta: </label><input type='checkbox' name='est_alerta'></div>
	    	<div class='datos'><label>Observaciones: </label><textarea name='observaciones'></textarea></div>
	    	
	    	<div id='pasos' class='datos'>
				<h2>Pasos:</h2>
				<div id="listadopasos">
				</div>
			</div>	
				
	    	<div id='adjuntos' class='datos'>
				<h2>
					Documentos Adjuntos:
											
					<div id='upload'>
						<label>Arraste todos los archivos aquí.</label>
						<input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'></label>
					</div>
					
					o 
					
					<a id='pega_imagen' onchange="document.getElementById('portapapeles').value=this.innerHTML" id="edit-box" class="edit-box" contenteditable="true"><span foco='no'>click aquí <br> para pegar una imagen</span><span foco='si'>presione <br> ctrl + v</span></a>
					<div id='pega_imagen_modelo' ><span foco='no'>click aquí <br> para pegar una imagen</span><span foco='si'>presione <br> ctrl + v</span></div>
					
					<input type='hidden' name='portapapeles' id='portapapeles' value=''>
					
				</h2>
				<div id="listadosubiendo">
				</div>
				
				<div id='adjuntoslista'></div>
			</div>
	    </div>
    </form>
    
      
    
    <script type="text/javascript">
    	
		//Dato Panel
       	var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';
		
		//Dato Usuario
		var _UsuId = '<?php echo $UsuarioI;?>';
		var _UsuarioAcc='<?php echo $UsuarioAcc;?>';
		var _UsuarioTipo='<?php echo $Usuario['perfil']['tipo'];?>';	
		var _DatosUsuarios=Array();
		var _HabilitadoEdicion='';	
		
		//Dato Grupos
		var _Grupos=Array();
		var _DatosGrupos=Array();
		
		//datos contenidos
		var _DataModelosInstancias={};
		var _DataModelosInstanciasOrden={};
		var _DataInstancias={};
		var _DataInstanciasOrden={};
		var _DataInstanciasCruces={};
		var _DataPeriodos={};
		var _DataPeriodosOrden={};
		var _DataParticipantes={};
		var _DataParticipantesOrden={};
		
		//datos de visualización
		var _IdPart = '0'; //para visualizar un solo participante.
		var _IdPer = '0'; //para visualizar un solo periodo.
		
		//representacion
		var _Columnas=Array();
		var _Filtros={
			'usuario':'NO',
			'busqueda':''
		};
				
		//consulta guarda adjuntos
		var _nFile=0;
		var xhr=Array();
		
		//fecha
		_f = new Date();
		_m=(1+_f.getMonth());
		_m=_m.toString().padStart(2,"0");
		_d=(1+_f.getDate());
		_d=_d.toString().padStart(2,"0");
		var _Hoy = _f.getFullYear()+'-'+_m+'-'+_d;
		var _Hoy_unix=Math.round(_f.getTime()/1000);
		
		//presconsultas
		<?php if(!isset($_GET['idpart'])){$_GET['idpart']='';} ?>
		var _IdPart='<?php echo $_GET['idpart'];?>'; 

	</script> 	
	
	
	<script type="text/javascript" src='./EVA/EVA_gestion_consultas.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./EVA/EVA_gestion_mostrar.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./EVA/EVA_gestion_interaccion.js?v=<?php echo time();?>'></script>	
	<script type="text/javascript" src='./EVA/EVA_gestion_adjuntos.js?v=<?php echo time();?>'></script>		
	
	<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>
		
		
	<script type="text/javascript">		

		//actualizarCss();
    	
        cargaAccesos();
        document.querySelector('#buscador input[name="busqueda"]').focus();      
		consultarGrupos(); 

	</script>
</body>
