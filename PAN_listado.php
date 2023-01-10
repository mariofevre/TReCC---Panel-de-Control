<?php
/**
* PAN_listado.php
*
* Este genera la base HTML para representar el listado de paneles disponibles para un usuario
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	common
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2012 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/

//if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);/* verificación de seguridad */
ini_set('display_errors',true);
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
?>
<!DOCTYPE html>
<html>
<head>
	
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./PAN/css/PAN_listado.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./_terceras_partes/OL/ol_v6.15.1/ol.css">
	

		
	<style type="text/css">


	</style>

</head>

<body>
	
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	<script charset="UTF-8" type="text/javascript" src="./_terceras_partes/OL/ol_v6.15.1/ol.js"></script>

    <script charset="UTF-8" type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
		
	<?php insertarmenu();?>
		

	<div id="pageborde">
	<div id="page">
			
		<h1>Paneles activos</h1>	
			
		<div id="bajada">	
			<p>Paneles en seguimiento</p>
			<div class="texto">Paneles en seguimiento para tu usuario</div>				
			<a onclick='formularNuevoPAN()'>crear nuevo panel</a>
						
			<p>Perfil de usuario</p>		
			<a onclick='formularusuario()'>editar TU perfil de usuario</a>
			
			<p>Seguimiento General</p>		
			<a onclick='verControlMultiobra();'>ver resumen de indicadores de tus Paneles</a>								
		</div>		
		
		<div id='barrabusqueda'><input id='barrabusquedaI' autocomplete='off' value='' onkeyup="actualizarBusqueda(event);"><a onclick='limpiaBarra(event);'>x</a></div>
		
		<div id="contenidoextenso"></div>	
	</div>
	</div>

	<form id='formPAN'>
		<label>Nombre: </label>
		<input name='nombre' autocomplete='off'>
		<label>Descripción: </label>
		<textarea name='descripcion'></textarea>
		<a id='crear' onclick='crearPanel()'>Crear Panel</a>
		<a id='cerrar' onclick='cerrar(this)'>cerrar</a>
	</form>
	
	<form id='formusuario'>
		<input type="hidden" name="zz_AUTOPANEL" value="<?php echo $PanelI;?>">
		<label>Log</label><span name='log'></span><br>
		<label>Nombre</label><input name='nombre'><br>
		<label>Apellido</label><input name='apellido'><br>
		<label>e-mail</label><input name='mail'><br>
		<label>Password actual</label><input type='password' name='password_act'><br>
		
		<a onclick='cambiarPassword()'>cambiar password</a>
		<div id='cambiapass'>
			
			<label>Password nuevo</label><input type='password' name='password_nue'><br>
			<label>Password nuevo, confirmación</label><input type='password' name='password_con'><br>
		</div>
		<input type='button' onclick='enviarFormularioUsuario()' value='guardar cambios'>
		
	</form>


	<div id='mapaborde'>
	<div id='mapa'>
		
	</div>
	</div>
	
<script type='text/javascript'>
	var _UsuarioAcc='';
	var _UsuarioTipo='';
	var _UsuarioDat={};
	var _PanelI='<?php echo $PanelI;?>';
	
	var _DataListado={};		
</script>


<script type="text/javascript" src='./PAN/PAN_listado_consultas.js?v=<?php echo time();?>'></script>
<script type="text/javascript" src='./PAN/PAN_listado_interaccion.js?v=<?php echo time();?>'></script>
<script type="text/javascript" src='./PAN/PAN_listado_mapa.js?v=<?php echo time();?>'></script>


<script type='text/jscript'>
	consultarlistado();
	document.getElementById("barrabusquedaI").focus();
	document.querySelector('body').setAttribute('onkeydown',"tecleoGeneral(event)");
	
	function Reincia(){consultarlistado();}
</script>


</body>
</html>
