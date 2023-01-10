<?php
/**
* ESP_listado.php
*
 * Estructura HTML donde cargar los contenidos del módulo ESP (archivos y links).  
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
//ini_set('display_errors','On');
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

$modCod='ESP';
$Titulo='Archivos y enlaces de referencia';

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
	
	<link rel="stylesheet" type="text/css" href="./ESP/css/ESP.css?v=<?php echo time();?>">

	<style type="text/css">
	
	</style>
	
</head>
<body>	

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
	
	<?php	insertarmenu();  ?>
	
	<div id="pageborde">
		<div id="page">
			<h1 id='titulomodulo'><?php echo $Titulo;?></h1>
			
			<div id='modelos'>
				<div 
					class='item' 
					idit='nn' 
					draggable="true" 
					ondragstart="drag(event);bloquearhijos(event,this);" 
					ondragleave="limpiarAllowFile()"
					ondragover="allowDropFile(event,this)"
					ondrop='dropFile(event,this)'>
					<img src='./a_comunes/img/candado.png' class='bloqu'>
					<h3 onmouseout='desaltar(this)' onmouseover='resaltar(this)' onclick='editarI(this)'>titulo</h3>
					<p onmouseout='desaltar(this)' onmouseover='resaltar(this)' onclick='editarI(this)'>descipcion</p>
					<div class='documentos'>
					</div>
					<div class='hijos'  
						ondrop="drop(event,this)" 
						ondragover="allowDrop(event,this)" 
						ondragleave="limpiarAllow()">
					</div>
					<a id='botondescargaCont' onclick='descargarCont(event,this);' title='descargar esta carpeta y su contenido en un zip'><img src='./a_comunes/img/abajo.png'></a>
				</div>
			</div>
			
			<div id="archivos">
				
				<form action='' enctype='multipart/form-data' method='post' id='uploader' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>
	                <div id='contenedorlienzo'>									
	                    <div id='upload'>
	                        <label>Arrastre todos los archivos aquí.</label>
	                        <input multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'>
	                    </div>
	                </div>
	                <div id='contenedorlienzo'>									
	                    <div id='upload'>
	                        <label>O cree un link aquí.</label>
	                        <a id='uploadinputlink' name='uploadlink' onclick='formcrearlink(event,this)'>O cree un link aquí.</a>
	                    </div>
	                </div>
	            </form>
	            <div id="listadosubiendo">
	                <label>archivos subiendo...</label>
	            </div>
	            <div id="listadoaordenar">
	                <label>archivos subidos.</label>
	            </div>

	            <div id="eliminar"
	                 ondragover="allowDropFile(event,this)"
	                 ondragleave="limpiarAllowFile()"
	                 ondrop='dropTacho(event,this)'>
	                <br>X
	                <span>tacho de basura</span>
	            </div>

	            <a id='botonanadir' onclick='anadirItem("0")'>+ <br><span>nueva <br> caja</span></a>		
			</div>	
			
								
			<div id="contenidoextenso" idit='0'>
				
				<div 
					class='hijos'
					nivel="0"
					ondrop="drop(event,this)" 
					ondragover="allowDrop(event,this);resaltaHijos(event,this)" 
					ondragleave="desaltaHijos(this)" 
				></div>
			</div>
		</div>
	</div>
	
		
	<form id="editordoc" onsubmit="guardarD(event,this)">
		<h2>Documento</h2>
		<label>Cargado por: <span id='autor'></span> - <span id='fecha'></span></label>
	    <input name='id' type='hidden'>
	    <label>Nombre:</label>
	    <input name='nombre' value='--'>
	    <label>Descripción:</label>
	    <textarea name='descripcion'></textarea>
	    <a id='botondescarga' >descargar <img src='./a_comunes/img/abajo.png'></a>
	    <a id='botoncierra' onclick='cerrar(this)'>cerrar</a>
	    <input type='submit' value='guardar'>
	    <a style='display:none' id='botonelimina' onclick='eliminarD(event,this)'>eliminar</a>
	</form>
	
	<form id="editoritem" onsubmit="guardarI(event,this)">
		<label>Título</label>
		<input name='titulo'>
		<input name='id' type='hidden'>
		
		
		<div class='grupoa'>
		<label>grupo primario</label>
		<input 
            type='hidden' 
            id='cid_p_grupos_id_nombre_tipoa' 
            name='id_p_grupos_id_nombre_tipoa'
        ><input
        	tipo='a'
            name='id_p_grupos_id_nombre_tipoa-n'
            readonly='readonly' 
            id='cid_p_grupos_id_nombre_tipoa-n' 
            onblur='vaciarOpcionares(event)' 
            onkeyup='filtrarOpciones(this);' 
            onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
		</div>
		
		<div class='grupob'>
		<label>grupo secundario</label>
		<input 
            type='hidden' 
            id='cid_p_grupos_id_nombre_tipob' 
            name='id_p_grupos_id_nombre_tipob'
        ><input 
        	tipo='b'
        	readonly='readonly'
            name='id_p_grupos_id_nombre_tipob-n' 
            id='cid_p_grupos_id_nombre_tipob-n' 
            onblur='vaciarOpcionares(event)' 
            onkeyup='filtrarOpciones(this);' 
            onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
        </div>
        
		<label>Descripcion</label>
		<textarea name='descripcion'></textarea>
		<a id='botoncierra' onclick='cerrar(this)'>cerrar</a>
		<input type='submit' value='guardar'>
		<a id='botonelimina' onclick='eliminarI(event,this)'>eliminar</a>
	    <a id='botonanadir' onclick="anadirItem(this.parentNode.querySelector('input[name=\'id\']').value)">+<br><span>nueva <br> caja</span></a>
	</form>

	<form id="formcrearlink" onsubmit="enviarCrearLink(event,this)">
	    <label>Ingresar Link</label>
	    <label>Nombre del Link</label>
	    <input name='linkName' type='text'>
	    <label>URL</label>
	    <input name='linkUrl' type='url'>
	    <label>Descripcion</label>
	    <textarea name='descripcion'></textarea>
	    <a id='botoncierra' onclick='cerrar(this)'>cerrar</a>
	    <input type='submit' value='guardar'>
	    <a id='botonelimina' onclick='eliminarLink(event,this)'>eliminar</a>
	</form>
	
	<form id="editorlink" onsubmit="guardarLink(event,this)">
		<h2>Documento</h2>
		<label>Incluído por: <span id='autor'></span> - <span id='fecha'></span></label>
	    <input name='id' type='hidden'>
	    
		<label>Nombre:</label>
	    <input name='nombre'>
	    
	    <label >URL</label>
	    <input name='url'>
	    
	    <label >Descripcion</label>
	    <textarea name='descripcion'></textarea>
	    
	    <a id='botonlink'>ir a url <img src='./a_comunes/img/link.png'></a>
	    <a id='botoncierra' onclick='cerrar(this)'>cerrar</a>
	    <input type='submit' value='guardar'>
	    <a style='display:none' id='botonelimina' onclick='eliminarLink(event,this)'>eliminar</a>
	    
	</form>
	
	
	<script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js"></script>	
	
	<script type="text/javascript" src='./ESP/ESP_js_gestion_consultas.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./ESP/ESP_js_gestion_mostrar.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./ESP/ESP_js_gestion_interaccion.js?v=<?php echo time();?>'></script>
		
	<script type='text/javascript'>
		
		var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';//DEPRECAR
		var _UsuarioAcc='';
		var _UsuarioTipo='';	
		var _HabilitadoEdicion='';	
		
		var _Acc={};
		
		var _Docs={};
		var _Links={};
		///funciones para cargar información base
		var _Items=Array();
		var _Orden=Array();
		
		var _DatosGrupos=Array();
		
		var _nFile=0;
		var xhr=Array();
		var inter=Array();
		var _destino ='';
	</script>

		
	<script type='text/javascript'>
			cargaAccesos();
	</script>
</body>
