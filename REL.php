<?php
/**
* REL.php
*
* Estructura HTML donde cargar los contenidos del módulo REL (relevamientos).  
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Relevamientos
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

$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){
	//sin panel definido en sesion o en url envía al selector de paneles
	header('location: ./PAN_listado.php');
}


$Hoy_a = date("Y");
$Hoy_m = date("m");	
$Hoy_d = date("d");	
$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;


$HabilitadoEdicion='no'; //por defecto no se permite la edicion hasta verificar el acceso del usuario para este modulo


?>
<!DOCTYPE html>
<head>
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./REL/css/REL.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./_terceras_partes/OL/ol_v6.15.1/ol.css">
	

	<style type="text/css">
	
	</style>
</head>

<body onkeyup='tecleoGeneral(event)' onresize="actualizarCss();">
	
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	<script type="text/javascript" src="./_terceras_partes/OL/ol_v6.15.1/ol.js"></script>

    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
		
	<?php insertarmenu();?>
		
		

		
			
	<div id="pageborde">
	    <div id="page">		
					
	        <h1>Gestión de Relevameintos</h1>
	        <h2>modo gestión</h2> 	
	        
			<div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
	        
	        <div class='botonerainicial' tipo='modos'>	
	            <a class='botonmenu' href="./REL_fichas.php">ver modo fichas</a> - 
	            <a id='modocalendario' class='botonmenu' href="./REL_tabla.php">ver modo tabla</a>
	            <a id='modocalendario' class='botonmenu' href="./REL_plano.php">ver modo plano</a>
	            <a class='botonmenu' onclick="filtrarUsuario()">filtrar por responsable</a> -
	            <a class='botonmenu' onclick="asignarFiltroUsuario('YO')">filtrar mías</a> 
	       </div>
	       
		    <div class='botonerainicial' tipo='acciones'>	
		       	<a class='botonmenu' onclick="crearSeguimiento()" title='agregar seguimiento'><img src='./img/agregar.png' alt='agregar'> seguimiento</a>
			</div>
			
			<div id='menufiltro'>
				<p>Filtrado por grupo:</p>
				<div>
					<input type='hidden' name='idrel'>		
					<select name='idtipo' onchange='this.parentNode.submit();'>
						<option value=''>-filtrar por-</option>
					</select> 
				</div>
				
				<p>Filtrado por Accion en curso:</p>
				<div>
					<input type='hidden' value='' name='idrel'>		
					<select name='idaccion' onchange='this.parentNode.submit();'>
						<option value=''>-filtrar por-</option>
					</select> 
				</div>
			</div>
							
			<div id='contenedorplanos'>
				<div id='labelcod'></div>
				<div id='mapa'></div>
			</div>
			
			<div id='menurelevamientos'>
				<div id='columnalateral'>	
					
					<div id='relevamientos'>
						<div class='fila'><h3>relevamientos <a onclick='crearRelevamiento()'><img src='./img/agregar.png' alt='añadir'> relevamiento</a></h3></div>
						<div id='listarelevamientos'></div>	
					</div>
					
					<div id='planos'>
						<div class='fila'><h3>planos cargados <a onclick='crearPlano()'><img src='./img/agregar.png' alt='añadir'> plano</a></h3></div>
						<div id='activadorplanos'></div>
					</div>
					
					<div id='localizaciones'>
						<div class='fila'><h3>puntos identificados <a onclick='crearLocaliz()'><img src='./img/agregar.png' alt='añadir'> punto</a></h3></div>
						<div id='listalocalizaciones'></div>			
					</div>			
				</div>
			</div>
		</div>
		</div>	

		<div class='formrel' id='formrelevamiento' method='post' enctype='multipart/form-data' idrel=''>
			<div id='frente'>
				<h1> relevamiento : <span id='codnomrel'></span></h1>
				<input id='b_guarda' type='button' value='guardar'  onclick='enviarFormRel()'>
				<input id='b_elimin' type='button' value='eliminar' onclick='eliminarRel()'>
				<input id='b_cancelar' 	type='button' value='cerrar' onclick='cerrarFormRel()'>
			</div>
			
			<h2>Nombre</h2>
			<input class='campo' type='text' name='nombre'>
							
			<h2>descripcion</h2>
			<textarea name='descripcion'></textarea>
						
			<h2>fecha de inicio del relevamiento</h2>
			<input class='campo' type='date' name='desde'>
			
			<h2>fecha de finalización del relevamiento</h2>
			<input class='campo' type='date' name='hasta'>
				
		</div>
		
		
		<div class='formrel' id='formplano' method='post' enctype='multipart/form-data' idpla=''>
			<div id='frente'>
				<h1> plano : <span id='codnomplano'></span></h1>
				<input id='b_guarda' type='button' value='guardar'  onclick='enviarFormPla()'>
				<input id='b_elimin' type='button' value='eliminar' onclick='eliminarPla()'>
				<input id='b_cancelar' 	type='button' value='cerrar' onclick='cerrarFormPla()'>
			</div>
			<h2>Nombre</h2>
			<input class='campo' type='text' name='nombre'>
							
			<h2>Código</h2>
			<input class='campo' type='text' name='codigo'>
						
			<h2>Altura</h2>
			<input class='campo' type='text' name='altura'>
			
			<h2>Modo</h2>
			<p>En el modo mapa, los puntos de relevamiento son cargados sobre mapas de calles e imagenes satelitales disponibles en la base.</p>
			<p>En el modo plano, el usuario debe cargar un archivo de imagen con el plano de arquitectura, para dibujar los puntos de relevamietno sobre este.</p>
			
			<select class='campo' name='modo' onchange='actualizarFormPlanoAdj();'>
				<option value='plano'>plano</option>
				<option value='mapa'>mapa</option>
			</select>
			
			<div id='adjuntos' class='paquete adjuntos'>
	        	<div id='contenedorlienzo' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>	
		            <h2>Adjuntos:</h2>					
		            
		            <label>Arraste todos los archivos aquí.</label>
		            <input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmpPla(this);'></label>
		            
		            
		            <div id="listadosubiendo"></div>            
		        	<div id='adjuntoslista'></div>
	        	</div>
        	</div>

        	
        	<h2>Unidades del proyecto <a onclick='crearUnidad()'><img src='./img/agregar.png' alt='añadir'> unidad</a></h2>
        	<div id='listaunidades'></div>
        	
        	<h2>Locales <a onclick='crearLocal()'><img src='./img/agregar.png' alt='añadir'> local</a></h2>
        	<div id='listalocales'></div>
        	
		</div>
		
		<div id='formUnidad' estado='cerrado'>
    		<img src='./img/cargando.gif'>
    		<input type='hidden' name='idu'>
    		<label>nombre<input name='nombre'></label><br>
    		<label>descripcion<input name='descripcion'></label>
    		<a onclick='enviarFormUnidad()' id='botonguardar'>guardar</a>
    		<a onclick='cerrar(this.parentNode)' id='botoncerrar'>cancelar</a>
    		<a onclick='eliminarUnidad()' id='botoneliminar'>eliminar</a>
    		<div id='geometria'>
    			<div id='inactivo'>
        			<label>geometría guardada</label>
        			<a onclick='addInteractionPolUni()'>modificar geometría</a>
    			</div>
    			<div id='activo'>
        			<label>sin geometría</label>
        			<label>cargando</label>
    			</div>
    		</div>
    	</div>
    	
		<div id='formLocal' estado='cerrado'>
    		<img src='./img/cargando.gif'>
    		<input type='hidden' name='idlal'>
    		<label>nombre<input name='nombre'></label><br>
    		<label>descripcion<input name='descripcion'></label>
    		<p>unidad: <input type='text' name="unidad"><input type='hidden' name="idu"></p>
    		<a onclick='enviarFormLocal()' id='botonguardar'>guardar</a>
    		<a onclick='cerrar(this.parentNode)' id='botoncerrar'>cancelar</a>
    		<a onclick='eliminarLocal()' id='botoneliminar'>eliminar</a>
    		<div id='geometria'>
    			<div id='inactivo'>
        			<label>geometría guardada</label>
        			<a onclick='addInteractionPolLocales()'>modificar geometría</a>
    			</div>
    			<div id='activo'>
        			<label>sin geometría</label>
        			<label>cargando</label>
    			</div>
    		</div>
    	</div>
    	
    	
		<div class='formrel' id='formlocalizacion' method='post' enctype='multipart/form-data'>
			<div id='frente'>
				<h1> punto : <span id='codnomloc'></span></h1>
				<input id='b_guarda' 	type='button' value='localizar'  onclick='accionEditarCrearGeometria()'>
				<input id='b_guarda' 	type='button' value='guardar'  onclick='enviarFormLoc()'>
				<input id='b_elimin'   	type='button' value='eliminar' onclick='eliminarLoc()'>
				<input id='b_cancelar' 	type='button' value='cerrar' onclick='cerrarFormLoc()'>
				
				<input id='b_obs' 		type='button' value='!' onclick='togle("divobserv")'>
			</div>
			
			<input type='hidden' name='locx'>
			<input type='hidden' name='locy'>
			
			<div class='colmed'>
				<h2>Tipo</h2>
				<input name='id_p_RELtipos_id_nombre' type='hidden'>
				<input 
					class='campo' id='campotx' type='text' id='id_p_RELtipos_id_nombre_n' name='id_p_RELtipos_id_nombre_n'
					fuente='_DataTipos' campo='id_p_RELtipos_id_nombre'  
					onKeyUp='actualizarOpciones(this)'
					onfocus='opcionesSi(this)'
					onblur='opcionesNo(this)'
				>
				<div class='opciones' campo='id_p_RELtipos_id_nombre'>
	    			<a class='cerrar' onkeyup='actualizaOpciones(this)' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
	    		</div>
					
				<h2>fecha de actualización</h2>
				<input class='campo' type='date' name='fecha' value='00'>

				<h2>criticidad</h2>
				<input type='radio' name='criticidad' value=''> <div class='criticidad '></div> s/d<br>
				<input type='radio' name='criticidad' value='bajo'> <div class='criticidad bajo'></div> baja<br>
				<input type='radio' name='criticidad' value='medio'> <div class='criticidad medio'></div> media<br>
				<input type='radio' name='criticidad' value='alto'> <div class='criticidad alto'></div> alta<br>
			</div>	
			
			<div class='colmed'>
				<h2>registro fotográfico</h2>					
		       	<div id='contenedorlienzo' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>	
		             
		            <label>Arraste todos los archivos aquí.</label>
		            <input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmpLoc(this);'></label>
		            
		            <div id="listadosubiendo"></div>            
		        	<div id='adjuntoslista'></div>
	        	</div>
	   			
	   			<h2>verificación</h2>
	   			<p>Confirmado: <input type='checkbox'><input type='hidden' name="verificado" value='0'></p>
	   			<p>local: <input type='text' name="local"><input type='hidden' name="idlal"></p>
	   			<p>unidad: <input type='text' name="unidad"><input type='hidden' name="idu"></p>
	   			
			</div>
			
			<div id='divobserv' activ='-1'>		
				<h2>observaciones internas</h2>
				<textarea name='observaciones'></textarea>
			</div>
			
			<h2>descripcion</h2>
			<textarea name='descripcion'></textarea>
			
			<h2>diagnóstico</h2>
			<textarea name='diagnostico'></textarea>
			
			<h2>curso de acción</h2>
			<textarea name='curso'></textarea>			
						
			<h2>acción adoptada</h2>
			
			<select name='acciontipo'>
				<option value=''>- indefinida -</option>
				<option value='correctiva'>correctiva</option>
				<option value='preventiva'>preventiva</option>
			</select>
			<input name='accion'>
			
			<input class='campo' type='hidden' name='locx'>
			<input class='campo' type='hidden' name='locy'>
			<input class='campo' type='hidden' name='id_p_RELplanos'>
			<input class='campo' type='hidden' id='id_p_RELacciones_id_nombre' name='id_p_RELacciones_id_nombre' value=''>
			<div class='aux' onclick='this.style.zIndex=2;'>
				<span class='botonito' onclick='this.parentNode.style.overflow=\"visible\";'>-></span>		
				<div class='listado'>
						<span class='items'  
							onclick="
								this.parentNode.parentNode.style.overflow='hidden';
						    	document.getElementById('campo-n').value = '';
						    	document.getElementById('campo').value = '0';"					    	
						><- -vacio-</span> 					
				
						<span 
							class='items'  
							onclick="
								this.parentNode.parentNode.style.overflow='hidden';
						    	document.getElementById('campo-n').value ='nombre';
						    	document.getElementById('campo').value ='id'
						    "
						>
						nombre</span>
				</div>
			</div>				
		</div>
	
		
		<form id='modeloNuevopunto' target='recuadro5' action='agregamini.php' method='post' enctype='multipart/form-data'>
			<div class='titulos'>
				<div >dd</div>-<div>mm</div>-<div>aaaa</div>
				<div style='width:83px;'>descripcion</div>
				<div style='width:40px;'>tipo</div>	
				<div style='width:5px;'>F</div>								
			</div>
			<input class='campo' type='hidden' name='locx'>
			<input class='campo' type='hidden' name='locy'>
			<input class='campo' type='hidden' name='id_p_RELplanos'>		
			<input type='hidden' name='id_p_RELlocalizaciones' value=''>	
	
			<input type='hidden' name='id_p_RELrelevamientos_id_nombre' value='$IDrel'>
			<input class='campo dia' type='text' name='fecha_d' value='$Hoy_d'><input class='campo mes' type='text' name='fecha_m' value='$Hoy_m'><input class='campo ano' type='text' name='fecha_a' value='$Hoy_a'>
			<input type='hidden' name='archivo_FI_foto_path' value='relevamientos/fotos'>
			<input type='file' name='archivo_FI_foto'>
			<input type='submit'  onclick='crearcandidato(this);' value='g'>
			<input type='hidden' name='tabla' value='RELlocpuntosadicionales'>
			<input type='hidden' name='accion' value='agrega'>		
			<input type='hidden' name='salida' value='REL'>				
			<input type='hidden' name='id_p_paneles' value='$PanelI'>
		</form>
		<form id='formulario' target='recuadro5' style='display:none;' action='./cambiamini.php' method='POST'>	
			<input type='hidden' id='cambiaminiTabla' name='tabla' value='RELlocalizaciones'>	
			<input type='hidden' id='cambiaminiPosId' name='id'   value=''>	
			<input type='hidden' id='cambiaminiPosX'  name='locx' value=''>
			<input type='hidden' id='cambiaminiPosY'  name='locy' value=''>		
		</form>
		<div id='auxX'></div>
		<div id='auxY'></div>	
			<div id='modelo' dbid='[NID]' class='fila' onmouseover='resaltaLocalizacion(this);'>
				<div class='fecha'>
					<div class='dia'></div>
					<div class='mes'></div>
					<div class='ano'></div>
				</div>
				<a class='descripcion' href='agrega_f.php?tabla=RELlocalizaciones&accion=cambia&id=&salida=REL'></a>
				<div class='tipo'></div>			
				<div class='muestra' onclick='muestraImagen();'><img></div>						
			</div>
		<a id='modeloP' dbid='' draggable='true' onmouseover='resaltaLocalizacion(this);' onclick='selectorLocaliazacion(this);' style='border-color:blue;' class='loc'></a>					
	</div>


		 	
<script type="text/javascript">
	var _PanelI='<?php echo $PanelI;?>';
	var _PanId='<?php echo $PanelI;?>';
	var _UsuarioAcc='';
	var _UsuarioTipo='';	
	var _HabilitadoEdicion='';	
			
	var _DatosGrupos=Array();

	var _U
	suId = '';
   
    var _DataLocalizaciones=Array();
    var _DataRelevamientos=Array();
    var _DataTipos=Array();
    var _DataPlanos=Array();
	var _DatosUsuarios=Array();
	
	
	var _IdRelEdit=''; //id del relevamiento activo
	var _IdPlanoActivo='';//id del plano activo	
	var _IdLocEdit=''; //id del localizacion activa
	
	var _Grupos=Array();
	
	var _Filtros={
		'usuario':'NO',
		'busqueda':''
	};
	
	_f = new Date();
	_m=(1+_f.getMonth());
	_m=_m.toString().padStart(2,"0");
	_d=(1+_f.getDate());
	_d=_d.toString().padStart(2,"0");
	var _Hoy = _f.getFullYear()+'-'+_m+'-'+_d;
	var _Hoy_unix=Math.round(_f.getTime()/1000);
	
  	function MesNaMesTxCorto(_mn){
	_meses=Array('err','ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic');
	return _meses[parseInt(_mn)];
}
		
</script>

<script type="text/javascript" src="./REL/REL_carga_datos.js"></script>
<script type="text/javascript" src="./REL/REL_formularios.js"></script>  
<script type="text/javascript" src="./REL/REL_enviar_datos.js"></script>  
<script type="text/javascript" src="./REL/REL_mapa.js"></script>  
<script type='text/javascript'>
	function actualizarFormPlanoAdj(){
		if(document.querySelector('#formplano select[name="modo"] option[value="plano"]').selected==false){
			document.querySelector('#formplano #adjuntos').style.display='none';
		}else{
			document.querySelector('#formplano #adjuntos').style.display='block';
		}
	}
</script>

<script type='text/javascript'>
	actualizarFormPlanoAdj();
</script>


</body>
