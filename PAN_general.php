<?php
/**
* panelgeneral.php
*
 * panelgeneral.php constituye la página principal que opera como menu de accise a los distintos módulos 
 * y a las opciones de configuración de cada panel activo.
 * Este menú carga dentro de marcos interiores los resúmenes de distintos módulos brindando una síntesis general.
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
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

include ('./includes/header.php');
$UsuarioI = $_SESSION['panelcontrol'] -> USUARIO;
if ($UsuarioI == "") {header('Location: ./login.php');
}

if ($UsuarioI == "1") {
	$_SESSION['usuario']='programador';
}

if ($_GET['panel'] != '') {
	ini_set('display_errors', '1');
	include_once('./includes/cargapanel.php');
	cargaPanel($_GET['panel']);
}

if(!isset($_GET['accion'])){$_GET['accion']='';}
$Accion = $_GET['accion'];
if(!isset($_GET['campo'])){$_GET['campo']='';}
$Campo = $_GET['campo'];


//$Pase = $_SESSION['panelcontrol'] -> PASE;
$PanelI = $_SESSION['panelcontrol'] -> PANELI;


include ('./login_registrousuario.php');//buscar el usuario activo



	

$Hoy_a = date("Y");
$Hoy_m = date("m");
$Hoy_d = date("d");
$Hoy = $Hoy_a . "-" . $Hoy_m . "-" . $Hoy_d;
?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/PAN_general.css">
	<META http-equiv="Content-Type" content="text/html; charset=windows-1252">
	<style type="text/css">
		#columnados{
			display:none;
		}
	</style>
</head>
<body>
	
	<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>
	<div class='recuadros' id="encabezado">
		<a href="./PAN_listado.php?tabla=paneles">ver el listado de paneles</a>
		<br>
	</div>

	<div id="pageborde">
		<div id="page">
			<h1>Panel general</h1>
			<?php
			if($UsuarioAcc=='administrador'){
				echo "<a href='./panelgeneral_reporte.php'>Ver en modo reporte</a>";
			}
			?>			
			<h2></h2>
			<div id="bajada">
				<div class="texto" id='nombre'>
				</div>
				<div class="texto" id='descripcion'>
				</div>
					
			</div>
			
			<div id="contenidoextenso">
				<div id='columnauno'>
				</div>	
				<div id='columnados'>
					<a class='cambiarnombre' nivel='administrador' href='./agrega_f.php?accion=cambia&tabla=paneles&id=".$PanelI."'>cambiar nombre</a><br>
					<a nivel='administrador' class="paquete caracteristicas" href="./caracteristicas.php">ver caracteristicas de este proyecto</a>
					<a nivel='administrador' class="paquete estadisticas" href="./panelgeneral_reporte.php">ver reporte de la actividad de este proyecto</a>					
					
					<a nivel='administrador' class="paquete usuarios" href="./PAN_usuarios.php"> 
						<h1>Usuarios habilitados</h1> 
						<h2>Administradores</h2>
						<h2>Editores</h2> 
						<h2>Visitantes</h2> 
					</a>
					
					<a nivel='administrador' class="paquete publicar" target='_blank' href="./agrega_f.php?tabla=publicacion&accion=agrega&campofijo=id&valorfijo=<?php echo $PanelD;?>">
						<h1>Publicación Web</h1>
						activar
					</a>
					
					<a nivel='administrador' class="paquete publicared" target='_blank' href="./agrega_f.php?tabla=publicacion&accion=cambia&id=<?php echo $publicacion;?>">
						<h1>Publicación Web</h1>
						editar publicación web de indicadores.
					</a>
					
					<div nivel='administrador' class="paquete duplicar" onclick="this.lastElementChild.style.display='block'"> 
						<h1>Duplicar este panel</h1>
						<p>crear copia tomando la configuración, indicadores e informes de modelo.</p>
						<form onsubmit='enviarduplicacion(this,event)' method='POST' style='display:none;' action=''>
							<label>completo</label>
							<input class='dia' type='checkbox' name='completo' value='SI'><span>(copia particularidades)</span>
							<label>Fecha inicio</label>
							<input class='dia' name='inicio_d' value=''>-
							<input class='mes' name='inicio_m' value=''>-
							<input class='ano' name='inicio_a' value=''>
							<br><label>Fecha fin</label>
							<input class='dia' name='fin_d' value=''>-
							<input class='mes' name='fin_m' value=''>-
							<input class='ano' name='fin_a' value=''>		
							<br><label>Titulo</label>
							<input name='nombre' value=''>	
							<br><label>Descripción</label>
							<input name='descripcion' value=''>		
							<input type='submit' value='crear duplicado'>																				
						</form>
					</div>			
				
					<a nivel='administrador' class="paquete configuracion" target='_blank' onclick='activarFormularioConf()'> <h1>Configuración</h1></a>
					
					
					<a nivel='administrador' class="paquete cierre" onclick='iniciarCierre()'> <h1>Dar por cerrado este panel</h1></a>
					
					<a nivel='administrador' class="paquete eliminacion" onclick='iniciarEliminacion()'> <h1>Eliminar este panel</h1></a>
				</div>
			</div>			
		</div>					
	</div>					


    <form id='formconfig'>
        <a class='botoncerrar' onclick='cerrar(this.parentNode)'>x - cerrar</a>
        <a class='botonguardar' onclick='enviarFormConfig()'>guardar</a>
    <div>
        <h3><label for=''>Opciones Generales</label></h3>   
         <div class='especifico'>
            <input type='hidden' name='id' value=''>
            <input type='hidden' name='zz_AUTOPANEL' value=''>
            <label for='gral-orden-grupo'>Orden normal o invertido</label><input type='hidden' name='gral-orden-grupo' value=''>
            <label for='com-grupob'>Criterio 1º de agrupación</label><input type='text' name='com-grupob' value=''>
            <label for='com-grupoa'>Criterio 2º de Agrupación</label><input type='text' name='com-grupoa' value=''>
         </div> 
     </div>    
    <div>
        <h3><label for='ind-activo'> Seguimimento de Indicadores</label><input type='checkbox' name='ind-activo' value=''></h3>
            <div class='especifico'>
                <input type='hidden' name='ind-rep-traking' value=''>
                <input type='hidden' name='ind-rep-com-sale' value=''>
                <input type='hidden' name='ind-rep-com-entra' value=''>
                <label for='ind-feriado' title='id del registro en la tabla indicadores que define si un dia es feriado (no laborable) con un valor igual a 1'>indicador feriado. </label><input type='text' name='ind-feriado' value=''>
            </div>    
        <h3><label for='tra-activo'>Rastreo de Actividades Internas.</label><input type='checkbox' name='tra-activo' value=''></h3>
        <div class='especifico'></div>    
    </div>
    <div>
        <h3><label for='com-activo'>Comunicaciones.</label><input type='checkbox' name='com-activo' value=''></h3>
            <div class='especifico'>
            <div>
                <label for='com-entra' title='Nombre de la comunicación entrante.'>Nombre Entrante</label><input type='text' name='com-entra' value=''>
                <label for='com-entrax' title='Nombre de la comunicación entrante extraoficial'>Nombre Entrante Extraoficial</label><input type='text' name='com-entrax' value=''>
                <label for='com-entra-preN' title='prefijo para el número identificador primario de comunicación entrante'>Prefijo de entrante</label><input type='text' name='com-entra-preN' value=''>
                <label for='com-entra-preNx' title='prefijo para el número identificador primario de comunicación entrante extraoficial'>Prefijo de entrante extraoficial</label><input type='text' name='com-entra-preNx' value=''>
            </div>
            <div>
                <label for='com-sale' title='Nombre de la comunicación saliente'>Nombre Saliente</label><input type='text' name='com-sale' value=''>
                <label for='com-salex' title='Nombre de la comunicación saliente extraoficial'>Nombre Saliente</label><input type='text' name='com-salex' value=''>
                <label for='com-sale-preN' title='prefijo para enúmero identificador primario de comunicación saliente'>repfijo al númenro de comun. saliente</label><input type='text' name='com-sale-preN' value=''>
                <label for='com-sale-preNx' title='prefijo para el número identificador primario de comunicación saliente extraoficial'>Prefijo de saliente extraoficial</label><input type='text' name='com-sale-preNx' value=''>
            </div>
            <div>
                <label for='com-ident'>Identificador primario</label><input type='text' name='com-ident' value=''>
                <label for='com-identdos'>identificador secundario</label><input type='text' name='com-identdos' value=''>
                <label for='com-identtres'>Identificador terciario</label><input type='text' name='com-identtres' value=''>
                <label for='com-prefijo-grupo'>Criterio de agrupación de comunicaciones:</label><input type='text' name='com-prefijo-grupo' value=''>
            </div>
            <div>
                <label for='com-seguimiento' title='realizar seguimiento si requiere o no respuesta para cada comunicación'>seguimento de respuesta</label><input type='checkbox' name='com-seguimiento' value=''>
                <label for='com-seguimiento-plazo'>plazo por defecto en días para de respuesta inicial</label><input type='text' name='com-seguimiento-plazo' value=''>
                <label for='com-seguimiento-inicio'>realizar seguimiento de inicio de activides asociadas</label><input type='text' name='com-seguimiento-inicio' value=''>
                <label for='com-aprobacion'>Aprobación múltiple de comunicaciones entrantes</label><input type='checkbox' name='com-aprobacion' value=''>
                <label for='com-aprobacion-sale'>Aprobación múltiple de comunicaciones salientes</label><input type='checkbox' name='com-aprobacion-sale' value=''>
            </div>
            <div>
                <label for='com-text-encabezado-entrante'>encabezado HTML para comunicaciones entrante</label>
                <textarea type='text' name='com-text-encabezado-entrante'></textarea> 
                
                <label for='com-text-encabezado-saliente'>encabezado HTML para comunicaciones salientes</label>
                <textarea type='text' name='com-text-encabezado-saliente'></textarea> 
                
                <label for='com-text-css'>estilo en cascada CSS comunicaciones</label>
                <textarea type='text' name='com-text-css'></textarea> 
            </div>
            <div> 
                <label for='com-nomenclaturaarchivos'>criterio de nomenclatura para documentos de comunicaciones.</label><input type='text' name='com-nomenclaturaarchivos' value=''>
                <label for='com-nomenclaturaarcseparador'>nomenclaturaarcseparador</label><input type='text' name='com-nomenclaturaarcseparador' value=''>
                <label for='com-nomenclaturaarchivosRta'>nomenclaturaarchivosRta</label><input type='text' name='com-nomenclaturaarchivosRta' value=''>
            </div>
            </div>
    </div>
    <div>
        <h3><label for='inf-activo'>Sistema de seguimiento de informes.</label><input type='checkbox' name='inf-activo' value=''></h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3><label for='doc-activo'>Módulo Activo, Sistema de Seguimiento de Documentación.</label><input type='checkbox' name='doc-activo' value=''></h3>
            <div class='especifico'>
                <label for='doc-visadomultiple'>Aprobación de documentos en instancias intermedias</label><input type='checkbox' name='doc-visadomultiple' value=''>
                <label for='doc-criterionum'>Criterio de repetición para la numeración de documentos</label><input type='text' name='doc-criterionum' value=''>
                <label for='doc-nomenclaturaarchivos'>criterio de nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarchivos' value=''>
                <label for='doc-nomenclaturaarcseparador'>listado de separadores para la nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarcseparador' value=''>
            </div>
    </div>
    <div>            
        <h3><label for='tar-activo'>Sistema de Seguimiento de Tareas. </label><input type='checkbox' name='tar-activo' value=''></h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3><label for='hit-activo'>Sistema de Seguimiento de Hitos. </label><input type='checkbox' name='hit-activo' value=''></h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3><label for='cer-activo'>Certificaciones. </label><input type='checkbox' name='cer-activo' value=''></h3>
             <div class='especifico'>
                <label for='cer-minimo'>Utilizar límite mínimo para el módulo de certificación</label><input type='text' name='cer-minimo' value=''>
                <label for='cer-maximo'>Utilizar límite máximo para el módulo de certificación</label><input type='text' name='cer-maximo' value=''>
            </div>    
    </div>
    <div>
        <h3><label for='rel-activo'>Módulo Activo, Relevamientos. </label><input type='checkbox' name='rel-activo' value=''></h3>
            <div class='especifico'>
                <label for='rel-tabladiag'>mostrar el campo diagnóstico en la tabla  </label><input type='checkbox' name='rel-tabladiag' value=''>
            </div>    
        <h3><label for='pla-activo'>Módulo Activo, Planes de Acción. </label><input type='checkbox' name='pla-activo' value=''></h3>
            <div class='especifico'>
                <label for='pla-nivel1'>Nombre para el primer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel1' value=''>
                <label for='pla-nivel2'>Nombre para el segundo nivel de acción (singular / plural).</label><input type='text' name='pla-nivel2' value=''>
                <label for='pla-nivel3'>Nombre para el tercer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel3' value=''>
            </div>
    </div>
    <div>            
        <h3><label for='cpt-activo'>Módulo Activo, Computos y Avances de obra.</label><input type='checkbox' name='cpt-activo' value=''></h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3><label for='esp-activo'>Módulo Activo, Especificaciones, condicones contractuales, glosarios. </label><input type='checkbox' name='esp-activo' value=''></h3>
        	<div class='especifico'>
                <label for='esp-nombrealternativo'>Utilizar un nombre alternativo para el módulo </label><input type='text' name='esp-nombrealternativo' value=''>
            </div>    
    </div>      
    <div>
        <h3><label for='seg-activo'>Módulo Activo, Seguimineto de acciones en curso. </label><input type='checkbox' name='seg-activo' value=''></h3>
        <div class='especifico'></div>
    </div>    
 
</form>

    
<script type="text/javascript">

_UsuarioAcc='<?php echo $UsuarioAcc;?>';
_PanelI='<?php echo $PanelI;?>';

if(_UsuarioAcc=='administrador'){
	document.querySelector('#columnados .paquete.eliminacion').style.display='block';
		
}else{
	document.querySelector('#bajada .cambiarnombre').style.display='none';
		
	document.querySelector('#columnados .paquete.caracteristicas').style.display='none';	
	document.querySelector('#columnados .paquete.estadisticas').style.display='none';
	document.querySelector('#columnados .paquete.usuarios').style.display='none';
	document.querySelector('#columnados .paquete.publicar').style.display='none';
	document.querySelector('#columnados .paquete.publicared').style.display='none';
	
	document.querySelector('#columnados .paquete.configuracion').style.display='none';
	document.querySelector('#columnados .paquete.cierre').style.display='none';
	document.querySelector('#columnados .paquete.duplicar').style.display='none';
	document.querySelector('#columnados .paquete.eliminacion').style.display='none';
}

function iniciarEliminacion(){
	if(!confirm('¿Eliminamos el panel? \n \n'+ _DataPanel.nombre +'\n \n ....  ¿Segure?')){return;}
	
	_params={
		'panid':_PanelI
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_borra_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            
            _res = $.parseJSON(response);
            
            for(_nm in _res.mg){
                alert(_res.mg[_nm]);
            }
            
            if(_res.res=='exito'){
               window.location.assign('./PAN_listado.php');
            }
            
        }
    })
}


function iniciarCierre(){
	if(!confirm('¿Damos por finalizada esta instancia de seguimento?')){return;}
	
	_params={
		'panid':_PanelI
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_cierra_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            
            _res = $.parseJSON(response);
            
            for(_nm in _res.mg){
                alert(_res.mg[_nm]);
            }
            
            if(_res.res=='exito'){
               window.location.assign('./PAN_listado.php');
            }
            
        }
    })
}


function enviarduplicacion(_this,_event){
    _event.preventDefault();
    _inps=_this.querySelectorAll('input');
    _params={};
    for(_ni in _inps){
        if(typeof _inps[_ni] !='object'){continue;}
        _params[_inps[_ni].getAttribute('name')]=_inps[_ni].value;
    }
     $.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_duplica_panel.php',
            type:  'post',
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                
                _res = $.parseJSON(response);
                
                for(_nm in _res.mg){
                    alert(_res.mg[_nm]);
                }
                
                if(_res.res=='exito'){
                   // window.location.assign('./PAN_general.php?panel='+_res.data.nid);
                }
                
            }
    })
}



	

//funciones para manejar el fomrulario de configuración.


    function cerrar(_ventana){
        _ventana.style.display='none';
        
    }


    function activarFormularioConf(){
        
        document.querySelector('#formconfig').style.display='block';
        _parametros=Array();
        $.ajax({
            data:  _parametros,
            url:   './PAN/PAN_general_consulta.php',
            type:  'post',
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                
                var _res = $.parseJSON(response);
                console.log(_res);
                
                if(_res.res=='exito'){	
                    
                    
                    for(_campo in _res.data.config){
                        if(_campo == 'modulosactivos'){continue;}
                        
                        _inp=document.querySelector('#formconfig [name="'+_campo+'"]');
                        if(_inp == null){continue;}
                        _inp.value=_res.data.config[_campo];
                    }
                    
                    for(_mod in _res.data.modulosactivos){
                    
                        _modStat=_res.data.modulosactivos[_mod];
                        _modT=_mod.toLowerCase();
                        
                        _inputs=document.querySelectorAll('#formconfig input, #formconfig textarea');
                                            
                        for(_nin in _inputs){
                            console.log( _modT);
                            if(typeof _inputs[_nin] != 'object'){continue;}
                            _ss=_inputs[_nin].getAttribute('name').split("-");
                            if(_ss[1]=='activo'){continue;}
                            if(_ss[0]!=_modT){continue;}
                            if(_modStat=='1'){_inputs[_nin].style.display='inline-block';}
                            if(_modStat=='0'){_inputs[_nin].style.display='none';}
                        }
    
                        _inputs=document.querySelectorAll('#formconfig label');                    
                        for(_nin in _inputs){
                            if(typeof _inputs[_nin] != 'object'){continue;}
                            _ss=_inputs[_nin].getAttribute('for').split("-");
                            if(_ss[1]=='activo'){continue;}
                            if(_ss[0]!=_modT){continue;}
                            if(_modStat=='1'){_inputs[_nin].style.display='inline-block';}
                            if(_modStat=='0'){_inputs[_nin].style.display='none';}
                        }
                        
                    }
                    
                    _inputs=document.querySelectorAll('#formconfig input[type="checkbox"]');                                            
                    for(_nin in _inputs){
                        if(typeof _inputs[_nin] != 'object'){continue;}
                        _nam=_inputs[_nin].getAttribute('name');
                        _val=_res.data.config[_nam];
                        
                        _ss=_inputs[_nin].getAttribute('name').split("-");
                        
                        if(_val==undefined){continue;}
                       	
                        if(_val=='1'){
                        	_inputs[_nin].checked=true;                        	
                        }else{
                        	_inputs[_nin].checked=false;
                        }    
                    }
                    
                }
            }
        });  
    }
	
	$("#formconfig input[type='checkbox']").on('change',function(_event){
		if(_event.currentTarget.checked==true){
			_event.currentTarget.value=1;
		}else{
			_event.currentTarget.value=0;
		}
		
    });

    function enviarFormConfig(){
        _form=document.querySelector('#formconfig');
        
        _inps=_form.querySelectorAll('input, textarea');
        _parametros={};
        for(_ni in _inps){
            if(typeof _inps[_ni] != 'object'){continue;}
            _parametros[_inps[_ni].getAttribute('name')]=_inps[_ni].value;            
        }
        
        $.ajax({
                data:  _parametros,
                url:   './PAN/PAN_ed_config.php',
                type:  'post',
                success:  function (response) {
                    //procesarRespuestaDescripcion(response, _destino);
                    
                    _res = $.parseJSON(response);
                    
                    for(_nm in _res.mg){
                        alert(_res.mg[_nm]);
                    }
                    
                    if(_res.res=='exito'){
                        window.location.reload(); 
                    }
                    
                }
        })
    }

</script>
    
<script type="text/javascript">
	var _Acc='<?php echo $UsuarioAcc;?>';
	var _DataPanel={};
	var _ModulosActivos = {};
	
	if(_Acc=='administrador'){
		document.querySelector('#columnados').style.display='inline-block';
	}
	
	function consultarPanel(){
		_parametros=Array();
		$.ajax({
			data:  _parametros,
			url:   './PAN/PAN_general_consulta.php',
			type:  'post',
			success:  function (response) {
				//procesarRespuestaDescripcion(response, _destino);
				
				var _res = $.parseJSON(response);
				console.log(_res);
				
				if(_res.res=='exito'){	
					_DataPanel=_res.data.panel;
                    document.querySelector('#bajada #nombre').innerHTML=_res.data.panel.nombre;
                    document.querySelector('#bajada #descripcion').innerHTML=_res.data.panel.descripcion;
					_ModulosActivos=_res.data.config.modulosactivos;
					consultarModulos();
				}
			}
		})
	}
	consultarPanel();
	
	
	function consultarModulos(){
		_ModAct=_ModulosActivos;
		_parametros={};
		$.ajax({
			data:  _parametros,
			url:   './SIS_consulta_modulos.php',
			type:  'post',
			success:  function (response) {
				//procesarRespuestaDescripcion(response, _destino);
				
				var _res = $.parseJSON(response);
				console.log(_res);
				
				if(_res.res=='exito'){
					
					_cont= document.querySelector('#contenidoextenso #columnauno');
					
					for(_Mcod in _res.data.modulos){
						if(_ModAct[_Mcod]!='1'){continue;}
						
						_Mdat=_res.data.modulos[_Mcod];
						_dpaq=document.createElement('div');
						_dpaq.setAttribute('class','paquete');
						_dpaq.setAttribute('id',_Mcod);
						_cont.appendChild(_dpaq);
						
						_aaa=document.createElement('a');
						_aaa.setAttribute('href',_Mdat.index);
						_aaa.setAttribute('title',_Mdat.descripcion);
						_dpaq.appendChild(_aaa);
						
						_dantig=document.createElement('div');
						_dantig.setAttribute('class','antig');
						_dantig.innerHTML='útlima actualización: <br> <span id="res_antig"></span> horas <br>';
						_dantig.innerHTML+="<a onclick='actualizar(this,event)' class='actualizar'><img alt='actualizar'></a>";
						_aaa.appendChild(_dantig);
						
						_h1=document.createElement('h1');
						if(_Mdat.nombrealternativo!=''){
							_h1.innerHTML=_Mdat.nombrealternativo;	
						}else{
							_h1.innerHTML=_Mdat.nombre;
						}
						_aaa.appendChild(_h1);
						
						_dres=document.createElement('div');
						_dres.setAttribute('class','resumen');
						_aaa.appendChild(_dres);
						
						
						for(_io in _Mdat.indicadoresOrden){
							
							_Icod=_Mdat.indicadoresOrden[_io];
							
							_Idat = _Mdat.indicadores[_Icod];
						
							_spl=_Idat.codigo.split('_');
							//console.log(_Idat.codigo+' '+_spl[1]);
							if(_spl[1]!=undefined){
								// este es un indicador complementario porcentual, será uncluido en el reporte de su indicador original.
								continue;
							}
								
							_dren=document.createElement('div');
							_dren.setAttribute('class','renglon');
							_dren.title=_Idat.descripcion;
							_dres.appendChild(_dren);
						
							_spa1=document.createElement('span');
							_spa1.setAttribute('class','definicion');
							_spa1.innerHTML=_Idat.nombre;
							_dren.appendChild(_spa1);
							
							_spa2=document.createElement('span');
							_spa2.setAttribute('id','res_'+_Idat.codigo);
							_spa2.setAttribute('class','res1');
							_dren.appendChild(_spa2);
							
							
							if(_Mdat.indicadores[_Idat.codigo+'_P']!=undefined){
								_spa3=document.createElement('span');
								_spa3.innerHTML='(';
								_dren.appendChild(_spa3);
								
								_spa4=document.createElement('span');
								_spa4.setAttribute('id','res_'+_Idat.codigo+'_P');
								_spa3.appendChild(_spa4);
								_spa3.innerHTML+='%)';														
							}
							
							if(_Mdat.indicadores[_Idat.codigo+'_F']!=undefined){
								_spa3=document.createElement('span');
								_spa3.innerHTML='(';
								_dren.appendChild(_spa3);
								
								_spa4=document.createElement('span');
								_spa4.setAttribute('id','res_'+_Idat.codigo+'_F');
								_spa3.appendChild(_spa4);
								_spa3.innerHTML+='x)';														
							}
							
							if(_Mdat.indicadores[_Idat.codigo+'_Tx']!=undefined){
								_spa3=document.createElement('span');
								_spa3.setAttribute('onmouseover','this.nextSibling.style.display="block";');
								_spa3.setAttribute('onmouseout','this.nextSibling.style.display="none";');
								_spa3.innerHTML=' (ver)';
								_dren.appendChild(_spa3);
								
								_spa4=document.createElement('span');
								_spa4.setAttribute('id','res_'+_Idat.codigo+'_Tx');
								_spa4.setAttribute('class','restx');
								_dren.appendChild(_spa4);
																						
							}
						}
									
	
						cargaResumen(_Mcod);
						
					}
				}
			}
		});
	}
	function cargaResumen(_COD){
		_parametros={};
		_url='./'+_COD+'/'+_COD+'_consulta_resumen.php';
		var _COD=_COD;
		$.ajax({
			data:  _parametros,
			url:  _url,
			type:  'post',
			success:  function (response) {
				//procesarRespuestaDescripcion(response, _destino);
				
				var _res = $.parseJSON(response);
				//console.log(_res);
				
				if(_res.res=='exito'){
					for(_prop in _res.data){
						_htmlelem=document.querySelector('.paquete#'+_COD+' span#res_'+_prop);
						if(_htmlelem != null){
							if(typeof _htmlelem == 'object'){
								_htmlelem.innerHTML=_res.data[_prop];
							}
						}
					}
				}
			}
		});
	}
	
	function actualizar(_this,_event){
		_event.preventDefault();
		_event.stopPropagation();
		_COD=_this.parentNode.parentNode.parentNode.getAttribute('id');
		

		_parametros={};
		_url='./'+_COD+'/'+_COD+'_actualizar.php';
		var _COD=_COD;
		$.ajax({
			data:  _parametros,
			url:  _url,
			type:  'post',
			success:  function (response) {
				//procesarRespuestaDescripcion(response, _destino);
				
				var _res = $.parseJSON(response);
				console.log(_res);
				cargaResumen(_COD);
			}
			
		});
	}			
</script>
		
</body>
