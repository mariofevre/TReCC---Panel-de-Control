<?php
/**
* listado.php
*
* Este documento es uno de los posibles ingresos al sistema permitiendo seleccionar el entorno de trabajo y editar el perfil de usuario.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	common
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
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
ini_set('display_errors', '1');
include ('./includes/header.php');
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
if($UsuarioI==""){header('Location: ./login.php');}
$PanelI = $_SESSION['panelcontrol']->PANELI;

include ('./login_registrousuario.php');//buscar el usuario activo.
//$HabilitadoEdicion='no'; //por defecto no se permite la edicion hasta verificar el acceso del usuario para este modulo
/*
foreach($Usuario['Acc'] as $g => $nivel){
	//echo $g.$nivel;
	if($nivel=='editor'||$nivel=='administrador'){
		$HabilitadoEdicion='si';
	}elseif($nivel=='relevador'){
		header('location: ./inicio.php');
	}elseif($nivel=='visitante'||$nivel=='auditor'){
		$HabilitadoEdicion='no';
	}
}	
*/
$Hoy_a = date("Y");
$Hoy_m = date("m");	
$Hoy_d = date("d");	
$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;

?>
<!DOCTYPE html>
<html>
<head>
	<title>Panel de control</title>
	<link href="./img/Panel.ico" type="image/x-icon" rel="shortcut icon">
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/PAN_listado.css">

	<style type="text/css">
	#formusuario{
		    display: none;
		    position: fixed;
		    top: calc(50vh - 100px);
		    left: calc(50vw - 250px);
		    width: 500px;
		    height: 200px;
		    background-color: #EBFCFF;
		    border: 2px solid #08afd9;
		    box-shadow: 5px 5px 10px #000;
		    z-index: 50;
		    overflow-y: auto;
		}
		#formusuario #cambiapass{
		    display: none;
		}
		#formusuario label {
		    width: 100px;
		    text-align: right;
		    margin: 5px;
		    display: inline-block;
		}
		
	#columnados > .paquete.eliminacion{
			display:none;
			background-color:rgba(255,0,0,0.5);
		}
		#columnados > .paquete.eliminacion h1{
			color:rgba(155,0,0,1);
		}
		
		#barrabusqueda{
			box-shadow:2px 2px 4px rgba(0,0,0,0.5);
			display:inline-block;
			width: calc(100% - 10px);
			max-width:400px;
			height:20px;
			position:relative;
		}
		div#barrabusqueda:hover{
			box-shadow:4px 4px 8px rgba(0,0,0,0.5);
		}
		
		#barrabusqueda input{
			width:100%;
			border:none;
			margin:0;
			padding:0;
			height: 100%;
			display: block;
			color:#aaa;
		}
		#barrabusqueda a{
			right:2px;
			top:2px;
			height:10px;
			position:absolute;
			color:#E41937;
			background-color:#fff;
			border: 1px solid #E41937;
			border-radius: 3px;
			display:none;
		} 
		
		#barrabusqueda[estado='activo'] a{
			display:block;
		}

		#barrabusqueda[estado='activo'] input{
			color:#08afd9;
		} 
				
		#barrabusqueda a:hover{
			background-color:#E41937;			
		} 
		
		
		#contenidoextenso .paquete[filtrado='si']{
			display:none;
		}
		
		#contenidoextenso .paquete[zz_cerrada='1']{
			opacity:0.5;	
		}
		
		.idp{
			font-size:150%;
			font-weight:bold;
		}
		#formPAN{
			display:none;
			position:fixed;
			top:20vh;
			left:30vw;
			height:60vh;
			width:40vw;
			border:3px solid #08afd9;
			box-shadow:10px 10px 10px rgba(0,0,0,0.5);
			z-index:20;
			background-color:#fff;
		}
		#formPAN label{
			display:block;
		}
		#formPAN input{
			width:90%;
		}
		#formPAN textarea{
			width:90%;
		}
		#cerrar{
			position:absolute;
			right:10px;
			top:30px;
			border:1px solid #08afd9;
			box-shadow:4px 4px 4px rgba(0,0,0,0.5);
		}
		#crear{
			position:absolute;
			right:10px;
			top:10px;
			border:1px solid #08afd9;
			box-shadow:4px 4px 4px rgba(0,0,0,0.5);
		}
		
	</style>

</head>

<body>
	
<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>
		
<?php
	insertarmenu();	
?>

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
		
		<div id="contenidoextenso">
		</div>	
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
</body>

<script type='text/javascript'>

	var _Host='<?php echo $_SESSION['panelcontrol']->HOST;?>';
	var _DataListado={};
	
	function consultarlistado(){
		
		var parametros = {
		};
		
		$.ajax({
			data:  parametros,
			url:   './PAN/PAN_listado_consulta.php',
			type:  'post',
			success:  function (response) {
				
				
				var _res = $.parseJSON(response);
				console.log(_res);
				
				if(_res.res=='exito'){
					_DataListado=_res.data.paneles;
					_cont=document.querySelector('#contenidoextenso');
					for(_no in _res.data.panelesOrden){
						_pid=_res.data.panelesOrden[_no];
						_pdat=_res.data.paneles[_pid];
						
						_aaa=document.createElement('a');
						_aaa.setAttribute('class','paquete');
						_aaa.setAttribute('idpan',_pid);
						_aaa.setAttribute('zz_cerrada',_pdat.zz_cerrada);
						_aaa.setAttribute('href','./PAN_general.php?panel='+_pid);
						_cont.appendChild(_aaa);
						
						_div=document.createElement('div');
						_div.setAttribute('class','texto');
						_div.innerHTML='<span class="idp">'+_pid+' - </span>'+_pdat.nombre;
						_aaa.appendChild(_div);
						
						_div=document.createElement('div');
						_div.setAttribute('class','texto desc');
						_div.innerHTML=_pdat.descripcion;
						_aaa.appendChild(_div);
					}
											
				}
			}
		});
	}
	consultarlistado();
</script>

<script type='text/jscript'>
// js manejo de bús	quedas en la barra				
document.getElementById("barrabusquedaI").focus(); 

function limpiaBarra(_event){
	document.querySelector("#barrabusqueda input").value='';
	actualizarBusqueda(_event);
}

function actualizarBusqueda(_event){
	
	_input=document.querySelector("#barrabusqueda input");
	_str=_input.value;
	if(_str.length>=3){
		_input.parentNode.setAttribute('estado','activo');
	}else{
		_str='';
		_input.parentNode.setAttribute('estado','inactivo');
	}
	_str=_str.toLowerCase();
	console.log('buscando: '+_str);
	
	_lis=document.querySelectorAll('#contenidoextenso > a.paquete');	
	for(_ln in _lis){
		if(typeof _lis[_ln] != 'object'){continue;}
		_idp=_lis[_ln].getAttribute('idpan');
		
		if(
			_DataListado[_idp].nombre.toLowerCase().indexOf(_str)==-1
			&&
			_DataListado[_idp].descripcion.toLowerCase().indexOf(_str)==-1
		){				
			_lis[_ln].setAttribute('filtrado','si');
			
		}else{
			_lis[_ln].setAttribute('filtrado','no');
		}
	}	
}
function verControlMultiobra(){
	if(_Host != 'local'){
		alert('Su usuario de Panel de Control TReCC, no tiene permisos de seguimiento multipanel.');
		return;
	}else{
		alert('Función a desarrollar.');
	}
}

function formularNuevoPAN(){
	if(_Host != 'local'){
		alert('Su usuario de Panel de Control TReCC, no tiene capacidad para más paneles.\nSolicite mayor capacidad a:\n \t trecc@trecc.com.ar \no llamando a los teléfonos:\n \t (+5411) 4343-5264 \n \t (+5411) 4343-9007');
		return;
	}
	_form=document.querySelector('#formPAN');
	_form.reset();
	_form.style.display='block';		
}

function cerrar(_this){
	_this.parentNode.style.display='none';		
}

function crearPanel(){
	_form=document.querySelector('#formPAN');
	_inps= _form.querySelectorAll('input, textarea');
	
	_param={};
	for(_ni in _inps){
		if(typeof _inps[_ni] != 'object'){continue;}
		_n=_inps[_ni].getAttribute('name');
		_v=_inps[_ni].value;
		_param[_n]= _v;		
	}


	$.ajax({
		data:  _param,
		url:   './PAN/PAN_ed_crea_panel.php',
		type:  'post',
		success:  function (response) {
			var _res = $.parseJSON(response);
			
			if(_res.res=='exito'){
				_url='./PAN_general.php?panel='+_red.data.nid;
				window.location.assign(_url);
			}else{
				alert('error al ejecutar el comando');
			}
		}			
	});

}

function formularusuario(){
	document.querySelector('#formusuario').style.display='block';
	document.querySelector('#formusuario [name="log"]').innerHTML='<?php echo $Usuario['perfil']['log'];?>';
	document.querySelector('#formusuario input[name="nombre"]').value='<?php echo $Usuario['perfil']['Nombre'];?>';
	document.querySelector('#formusuario input[name="apellido"]').value='<?php echo $Usuario['perfil']['apellido'];?>';
	document.querySelector('#formusuario input[name="mail"]').value='<?php echo $Usuario['perfil']['mail'];?>';
	document.querySelector('#formusuario input[name="password_act"]').value='';
	document.querySelector('#formusuario input[name="password_nue"]').value='';
	document.querySelector('#formusuario input[name="password_con"]').value='';
	
}

function cambiarPassword(){
	document.querySelector('#formusuario #cambiapass').style.display='block';
}

function enviarFormularioUsuario(){
	
	
	_form=document.querySelector('#formusuario');
		_inps=_form.querySelectorAll('input');
		_params={};
		for(_in in _inps){
			if(typeof _inps[_in] != 'object'){continue;}
			if(_inps[_in].getAttribute('name')==undefined){
				continue;				
			}
			_name=_inps[_in].getAttribute('name');
			_params[_name]=_inps[_in].value;
		}
		_params['log']=_form.querySelector('[name="log"]').innerHTML;
		 $.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_cambia_usuario.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try {
                    JSON.parse(response);
                }catch(_err){
                    console.log(_err);
                    alert('el servidor entregó un texto de formato inesperado');
                    return;
                }
                
                 var _res = $.parseJSON(response);                
                _estadodecarga='activo';
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                	_form=document.querySelector('#formusuario');
					_form.reset();
					_form.style.display='none';
					//window.location.reload();
				}
			}
		})	
}
</script>

</body>
</html>
