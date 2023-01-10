<?php
/**
* PUB_ini.php
*
 * pagina de visuallización pública de contenidos habilitados
 * y a las opciones de configuración de cada panel activo.
 * Este menú carga dentro de marcos interiores los resúmenes de distintos módulos brindando una síntesis general.
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2017-2023 TReCC SA
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
ini_set('display_errors', '1');
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.

if(!isset($_GET['p'])){$_GET['p'] = '';}
?>
<!DOCTYPE html>
<head>
	<title>Panel.TReCC</title>
	
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<META http-equiv="Content-Type" content="text/html; charset=windows-1252">
	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	
  	<link rel="stylesheet" href="./PUB/js_bootstrap/4.4.1/css/bootstrap.min.css">

	<style type="text/css">

	</style>
</head>
<body>
	
<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
<script src="./PUB/js_bootstrap/4.4.1/bootstrap.min.js"></script>
	
<div class="jumbotron text-center">
  <h1>My First Bootstrap Page</h1>
  <p>Resize this responsive page to see the effect!</p> 
</div>
  
<div class="container">
  <div class="row">
    <div class="col-sm-4">
      <h3>Column 1</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
    </div>
    <div class="col-sm-4">
      <h3>Column 2</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
    </div>
    <div class="col-sm-4">
      <h3>Column 3</h3>        
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
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
        <h3>
        	<label for='ind-activo'> Seguimimento de Indicadores</label><input type='checkbox' name='ind-activo' value=''>
        	<label class='secundario' for='ind-alternativo'>Nombre local:</label><input name='ind-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <input type='hidden' name='ind-rep-traking' value=''>
                <input type='hidden' name='ind-rep-com-sale' value=''>
                <input type='hidden' name='ind-rep-com-entra' value=''>
                <label for='ind-feriado' title='id del registro en la tabla indicadores que define si un dia es feriado (no laborable) con un valor igual a 1'>indicador feriado. </label><input type='text' name='ind-feriado' value=''>
            </div>    
    </div>
    <div>
        <h3>
        	<label for='com-activo'>Comunicaciones.</label><input type='checkbox' name='com-activo' value=''>
        	<label class='secundario' for='com-alternativo'>Nombre local:</label><input name='com-alternativo' value=''>
        </h3>
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
                <label for='com-seguimiento' title='realizar seguimiento si requiere o no respuesta para cada comunicación'>seguimiento de respuesta</label><input type='checkbox' name='com-seguimiento' value=''>
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
        <h3>
        	<label for='inf-activo'>Sistema de seguimiento de informes.</label><input type='checkbox' name='inf-activo' value=''>
        	<label class='secundario' for='inf-alternativo'>Nombre local:</label><input name='inf-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='doc-activo'>Módulo Activo, Sistema de Seguimiento de Documentación.</label><input type='checkbox' name='doc-activo' value=''>        	
        	<label class='secundario' for='doc-alternativo'>Nombre local:</label><input name='doc-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='doc-visadomultiple'>Aprobación de documentos en instancias intermedias</label><input type='checkbox' name='doc-visadomultiple' value=''>
                <label for='doc-criterionum'>Criterio de repetición para la numeración de documentos</label><input type='text' name='doc-criterionum' value=''>
                <label for='doc-nomenclaturaarchivos'>criterio de nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarchivos' value=''>
                <label for='doc-nomenclaturaarcseparador'>listado de separadores para la nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarcseparador' value=''>
            </div>
    </div>
    <div>            
        <h3>
        	<label for='tar-activo'>Sistema de Seguimiento de Tareas. <br>- en desarrollo -</label><input type='checkbox' name='tar-activo' value=''>
        	<label for='tar-alternativo'>Nombre local:</label><input name='tar-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='hit-activo'>Sistema de Seguimiento de Hitos. </label><input type='checkbox' name='hit-activo' value=''>
        	<label class='secundario' for='hit-alternativo'>Nombre local:</label><input name='hit-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='cer-activo'>Certificaciones. <br>- en desarrollo -</label><input type='checkbox' name='cer-activo' value=''>
        	<label class='secundario' for='cer-alternativo'>Nombre local:</label><input name='cer-alternativo' value=''>
        </h3>
             <div class='especifico'>
                <label for='cer-minimo'>Utilizar límite mínimo para el módulo de certificación</label><input type='text' name='cer-minimo' value=''>
                <label for='cer-maximo'>Utilizar límite máximo para el módulo de certificación</label><input type='text' name='cer-maximo' value=''>
            </div>    
    </div>
    <div>
        <h3>
        	<label for='rel-activo'>Módulo Activo, Relevamientos. <br>- en desarrollo -</label><input type='checkbox' name='rel-activo' value=''>
        	<label class='secundario' for='rel-alternativo'>Nombre local:</label><input name='rel-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='rel-tabladiag'>mostrar el campo diagnóstico en la tabla  </label><input type='checkbox' name='rel-tabladiag' value=''>
            </div>    
        <h3>
        	<label for='pla-activo'>Módulo Activo, Planes de Acción. </label><input type='checkbox' name='pla-activo' value=''>
        	<label class='secundario' for='pla-alternativo'>Nombre local:</label><input name='pla-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='pla-nivel1'>Nombre para el primer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel1' value=''>
                <label for='pla-nivel2'>Nombre para el segundo nivel de acción (singular / plural).</label><input type='text' name='pla-nivel2' value=''>
                <label for='pla-nivel3'>Nombre para el tercer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel3' value=''>
            </div>
    </div>
    <div>            
        <h3>
        	<label for='cpt-activo'>Módulo Activo, Computos y Avances de obra. <br>- en desarrollo -</label><input type='checkbox' name='cpt-activo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='esp-activo'>Módulo Activo, Especificaciones, condicones contractuales, glosarios. </label><input type='checkbox' name='esp-activo' value=''>
        	<label class='secundario' for='esp-alternativo'>Nombre local:</label><input name='esp-alternativo' value=''>
        </h3>
        	<div class='especifico'>
            </div>    
    </div>      
    <div>
        <h3>
        	<label for='seg-activo'>Módulo Activo, Seguimiento de acciones en curso. </label><input type='checkbox' name='seg-activo' value=''>
        	<label class='secundario' for='seg-alternativo'>Nombre local:</label><input name='seg-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>  
    <div>
        <h3>
        	<label for='cnt-activo'>Módulo Activo, Seguimiento de Contrataciones y proveedores. </label><input type='checkbox' name='cnt-activo' value=''>
        	<label class='secundario' for='cnt-alternativo'>Nombre local:</label><input name='cnt-alternativo' value=''>
        </h3>
        <div class='especifico'>
        	<label class='secundario' for='cnt-conceptospago'>conceptos utilizados para pago (separar por comas):</label><input name='cnt-conceptospago' value=''>
        </div>
    </div>      
</form>


<form id='formPublicacionesWeb'>
	
	<a id='cerrar' onclick='cerrar(this.parentNode)'>cerrar</a>
	<a onclick="anadirPublicacionWeb()">añadir publicacion</a>
	
	<h2>Publicaciones de este panel</h2>
	<div id='listapublicacionesweb'></div>
	
	
	<div id='formpublicacionweb'>
		
		<input type='hidden' name='idpub' autocomplete='off'>
	
		<label>Nombre de identificación: </label>
		<input name='nombre'>
		
		<label>Publicación activa: </label>
		<input type='checkbox' name='activa'>		
		
		<label>Titulo: </label>
		<textarea name='titulo'></textarea>
		
		<label>Copete: </label>
		<textarea name='copete'></textarea>
		
		<label>Pie: </label>
		<textarea name='pie'></textarea>
				
		<div id='listadecomponentes'></div>
			
		<div id='formcomponentes'>
		</div>	
	</div>
		
</form>   






<form id='formConec'>
	<label>id del panel a conectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<label>vision compartida de comunicaciones: </label>
	<input for='COMver' autocomplete='off' type='checkbox' onchange='togle(this)'>
	<input name='COMver' autocomplete='off' type='hidden' value='0'><br />
	<label>vision compartida de documentacion: </label>
	<input for='DOCver' autocomplete='off' type='checkbox' onchange='togle(this)'>
	<input name='DOCver' autocomplete='off' type='hidden' value='0'>
	
	<a id='crear' onclick='iniciarConexion()'>Proponer conexion</a>
	<a id='cerrar' onclick='cerrar(this.parentNode)'>cerrar</a>
</form>

<form id='formAcepConec'>
	
	<a id='guerdar' onclick='guardarPub(this.parentNode)'>guardar</a>
	<a id='cerrar' onclick='cerrar(this.parentNode)'>cerrar</a>
	
	<label>id del panel a conectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<input type='hidden' name='idpendiente' autocomplete='off'>
	
	<label>nombre:</label>
	<input id='nombre'></span>
	
	<label>Publicacion Activa: </label>
	<input type='checkbox'></div>
	
	<label>Titulo: </label>
	<input id='titulo'></div>
	
	<label>Descripcion: </label>
	<input id='descripcion'></div>
	
	<h2>Componentes</h2>
	<div id='pub_componentes'><div>
	
</form>
    
    
<form id='formAnularConec'>
	<label>id del panel a desconectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<input type='hidden' name='idcon' autocomplete='off'>
	
	<label>Nombre del panel a conectar: </label>
	<span id='nombrepanel'></span>
	
	<label>Descripcion del panel a desconectar: </label>
	<div id='descripcionpanel'></div>
	
	<label>vision compartida de comunicaciones: </label>
	<input for='COMver' autocomplete='off' type='checkbox' readonly>
	<input name='COMver' autocomplete='off' type='hidden' value='0'><br />
	
	<label>vision compartida de documentacion: </label>
	<input for='DOCver' autocomplete='off' type='checkbox' readonly>
	<input name='DOCver' autocomplete='off' type='hidden' value='0'>
	<br>
	<label>Términos de la extinsión del acuerdo: </label>
	<textarea name='terminos'></textarea>
	<br>
	
	<a id='apectarconeccion' onclick='anularConexion()'>Quiero exinguir este acuerdo de vinculación</a>
	<a id='cerrar' onclick='cerrar(this.parentNode)'>cerrar</a>
</form>   




 
<script type="text/javascript">


function formularWeb(){
	_form=document.querySelector('#formPublicacionesWeb');
	_form.style.display='block';
	
	_form.querySelector('#listapublicacionesweb').innerHTML='';
	for(_idp in _DataConfig.publicaciones){
		
		_aaa=document.createElement('a');
		_aaa.innerHTML=_DataConfig.publicaciones[_idp].nombre;
		_aaa.setAttribute('idpub',_idp);
		_aaa.setAttribute('activa',_DataConfig.publicaciones[_idp].activa);
		_aaa.setAttribute('onclick','formularPublicacion(this)');		
		
		_form.querySelector('#listapublicacionesweb').appendChild(_aaa);
	}
	
}

function formularPublicacion(_this){
	
	_idpub=_this.getAttribute('idpub');
	
	_dat=_DataConfig.publicaciones[_idpub]
	
	_form=document.querySelector('#formPublicacionesWeb #formpublicacionweb');
	_form.style.display='block';
	
	_form.querySelector('[name="nombre"]').value=_dat.nombre;
	_form.querySelector('[name="titulo"]').value=_dat.titulo;
	_form.querySelector('[name="copete"]').value=_dat.copete;
	_form.querySelector('[name="pie"]').value=_dat.pie;
	
	
	
	_form.querySelector('#listadecomponentes').innerHTML='';
	for(_nc in _dat.componentes){
		
		_aaa=document.createElement('a');
		_aaa.innerHTML="comp modulo: "+_dat.componentes[_nc].modulo;
		_aaa.setAttribute('idcomp',_dat.componentes[_nc].id);
		_aaa.setAttribute('onclick','formularComponente(this)');		
		_form.querySelector('#listadecomponentes').appendChild(_aaa);
	}
		
	
}




function togle(_this){
	_name=_this.getAttribute('for');
	_inp=_this.parentNode.querySelector("[name='"+_name+"']");
	if(_this.checked){
		_inp.value='1';
	}else{
		_inp.value='0';
	}
}


function formularConecPAN(){
	if(_UsuarioAcc!='administrador'){
		alert('Su usuario de Panel de Control TReCC, no tiene capacidad para solicitar la conexión de este panel con otro.\nSolicite mayor capacidad a:\n \t trecc@trecc.com.ar \no llamando a los teléfonos:\n \t (+5411) 4343-5264 \n \t (+5411) 4343-9007');
		return;
	}
	_form=document.querySelector('#formConec');
	_form.reset();
	_form.style.display='block';		
}


function anularConexion(){
	if(!confirm('¿Anulamos la conexión con el panel indicado? \n \n'+ 'A partir de este momento se perderá el intercambió de datos entre ambos paneles')){return;}
	

	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formAnularConec [name='idpanelcon']").value,
		'idcon':document.querySelector("#formAnularConec [name='idcon']").value,
		'COMver':document.querySelector("#formAnularConec [name='COMver']").value,
		'DOCver':document.querySelector("#formAnularConec [name='DOCver']").value,
		'terminos':document.querySelector("#formAnularConec [name='terminos']").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_anula_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            window.location.assign('./PAN_general.php');            
        }
    })	
}	



function aceptarConexion(){
	if(!confirm('¿Aceptamos la conexión con el panel indicado? \n \n'+ 'A partir de este momento el otro panel automáticamente tendrá acceso a las funciones tildadas en este formulario')){return;}
	

	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formAcepConec [name=idpanelcon]").value,
		'idpendiente':document.querySelector("#formAcepConec [name=idpendiente]").value,
		'COMver':document.querySelector("#formAcepConec [name=COMver]").value,
		'DOCver':document.querySelector("#formAcepConec [name=DOCver]").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_acepta_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            
            window.location.assign('./PAN_general.php');
           
            
        }
    })	
}	

function iniciarConexion(){
	if(!confirm('¿Solicitamos la conexión con el panel indicado? \n \n'+ 'Si la solicitud es aceptada por un administrador del otro panel automáticamente tendrá acceso a las funciones tildadas en este formulario')){return;}
	
	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formConec [name=idpanelcon]").value,
		'COMver':document.querySelector("#formConec [name=COMver]").value,
		'DOCver':document.querySelector("#formConec [name=DOCver]").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_solicita_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);

               window.location.assign('./PAN_listado.php');
            
        }
    })
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
            _res = PreprocesarRespuesta(response);

            window.location.assign('./PAN_listado.php');
           
        }
    })
}


function iniciarCierre(){
	if(!confirm('¿Damos por finalizada esta instancia de seguimiento?')){return;}
	
	_params={
		'panid':_PanelI
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_cierra_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            window.location.assign('./PAN_listado.php');

            
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
                _res = PreprocesarRespuesta(response);   
                _res = $.parseJSON(response);
                
                window.location.assign('./PAN_general.php?panel='+_res.data.nid);
                
            }
    })
}



	
////////////////////////////////////////////////////////
//funciones para manejar el fomrulario de configuración.
////////////////////////////////////////////////////////


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
				_res = PreprocesarRespuesta(response);

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
                _res = PreprocesarRespuesta(response);
                
                window.location.reload(); 
                
                
            }
        })
    }

</script>
    
<script type="text/javascript">

	var _UsuarioAcc='';
	var _DataPanel={};
	var _DataConfig={};
	var _ModulosActivos = {};
	
	
	function consultarPanel(){
		_parametros=Array();
		$.ajax({
			data:  _parametros,
			url:   './PAN/PAN_general_consulta.php',
			type:  'post',
			success:  function (response) {
				_res = PreprocesarRespuesta(response);
				
				_UsuarioAcc=_res.data.acceso;	
				_UsuarioTipo=_res.data.accesoTipo;
				_UsuarioDat=_res.data.usuarioDat;
				actualizarMenu();
				actualizarVisible();
				if(_UsuarioAcc=='administrador'){
					
					document.querySelector('#columnados .paquete.eliminacion').style.display='block';
						
				}else{
					document.querySelector('#columnados .cambiarnombre').style.display='none';
						
					document.querySelector('#columnados .paquete.caracteristicas').style.display='none';	
					document.querySelector('#columnados .paquete.estadisticas').style.display='none';
					document.querySelector('#columnados .paquete.usuarios').style.display='none';
					document.querySelector('#columnados .paquete.publicar').style.display='none';
					
					document.querySelector('#columnados .paquete.configuracion').style.display='none';
					document.querySelector('#columnados .paquete.cierre').style.display='none';
					document.querySelector('#columnados .paquete.duplicar').style.display='none';
					document.querySelector('#columnados .paquete.eliminacion').style.display='none';
				}
				
				
				if(_UsuarioTipo=='comercial' || _UsuarioTipo=='comercial autonomo'){
					document.querySelector('#columnados .cambiarnombre').style.display='none';
					document.querySelector('#columnados .paquete.caracteristicas').style.display='none';
					document.querySelector('#columnados .paquete.estadisticas').style.display='none';
					document.querySelector('#columnados .paquete.publicar').style.display='none';
					document.querySelector('#columnados .paquete.publicared').style.display='none';
					document.querySelector('#columnados .paquete.duplicar').style.display='none';
					document.querySelector('#columnados .paquete.conexion').style.display='none';
				}
				
				if(_UsuarioTipo=='comercial autonomo'){
					document.querySelector('#columnados .paquete.cierre').style.display='none';
					document.querySelector('#columnados .paquete.usuarios').style.display='none';
					document.querySelector('#columnados .paquete.eliminacion').style.display='none';
				}

				
				
				_DataPanel=_res.data.panel;
				_DataConfig=_res.data.config;
				document.querySelector('#bajada #id').innerHTML=_PanelI;
                document.querySelector('#bajada #nombre').innerHTML=_res.data.panel.nombre;
                document.querySelector('#bajada #descripcion').innerHTML=_res.data.panel.descripcion;
				_ModulosActivos=_res.data.config.modulosactivos;
				consultarModulos();
				
				
                for(_ncp in _res.data.config.conexiones.pendientes){                    	
                	_cont=document.querySelector('#columnados > a.conexion > h1');
                	
                	_dat=_res.data.config.conexiones.pendientes[_ncp];
                	
                	_div=document.createElement('div');
                	_div.setAttribute('npend',_ncp);
                	_div.setAttribute('class','conexion pendiente');
                	_div.setAttribute('onclick','event.stopPropagation();formularAceptarConexion(this.getAttribute("npend"))');
                	_cont.appendChild(_div);
                	
                	_div2=document.createElement('div');
                	_div2.setAttribute('id','contenido');
                	_div2.innerHTML="Conexión entre paneles solicitada por "+_dat.solicitante.Nombre+' '+_dat.solicitante.apellido+'<br>';
                	_div2.innerHTML+="El día "+_dat.desde+'<br>';
                	_div2.innerHTML+="Para vincular el presente Panel con el Panel "+_dat.solicitante.idpanel+', '+_dat.solicitante.nombrepanel+' | '+_dat.solicitante.descripcionpanel;
                	_div.appendChild(_div2);
                	
                }
                
                for(_ncp in _res.data.config.conexiones.vigentes){                    	
                	_cont=document.querySelector('#columnados > a.conexion > h1');
                	
                	_dat=_res.data.config.conexiones.vigentes[_ncp];
                	
                	_div=document.createElement('div');
                	_div.setAttribute('npend',_ncp);
                	_div.setAttribute('class','conexion vigente');
                	_div.setAttribute('onclick','event.stopPropagation();formularAnularConexion(this.getAttribute("npend"))');
                	_cont.appendChild(_div);
                	
                	_div2=document.createElement('div');
                	_div2.setAttribute('id','contenido');
                	_div2.innerHTML="Conexión vigente con panel"+_dat.datapanel.idpanel+', '+_dat.datapanel.nombrepanel+' | '+_dat.datapanel.descripcionpanel;
                	_div.appendChild(_div2);
                }
			}
		})
	}
	consultarPanel();
	
	function actualizarVisible(){
		if(_UsuarioAcc=='administrador'){
			document.querySelector('#columnados').style.display='inline-block';
		}else{
			document.querySelector('#columnados').style.display='none';
		}
	}
	
	function formularAnularConexion(_numpend){
		
		_form=document.querySelector('#formAnularConec');
		_form.style.display='block';
		_dat=_DataConfig.conexiones.vigentes[_numpend];
		_form.querySelector('[name="idpanelcon"').value=_dat.datapanel.idpanel;
		_form.querySelector('[name="idcon"').value=_dat.idcon;
		_form.querySelector('#nombrepanel').innerHTML=_dat.datapanel.nombrepanel;
		_form.querySelector('#descripcionpanel').innerHTML=_dat.datapanel.descripcionpanel;
		
		if(_dat.cond_COM_vision_compartida=='1'){
			//console.log('com');
			_form.querySelector('[for="COMver"]').checked=true;
		}else{
			_form.querySelector('[for="COMver"]').checked=false;
		}
		
		_form.querySelector('[name="COMver"]').value=_dat.cond_COM_vision_compartida;
		
		if(_dat.cond_DOC_vision_compartida=='1'){
			//console.log('doc');
			_form.querySelector('[for="DOCver"]').checked=true;
		}else{
			_form.querySelector('[for="DOCver"]').checked=false;
		}
		_form.querySelector('[name="DOCver"]').value=_dat.cond_DOC_vision_compartida;	
	}
	
	function formularAceptarConexion(_numpend){
		
		_form=document.querySelector('#formAcepConec');
		_form.style.display='block';
		_dat=_DataConfig.conexiones.pendientes[_numpend];
		_form.querySelector('[name="idpanelcon"').value=_dat.solicitante.idpanel;
		_form.querySelector('[name="idpendiente"').value=_dat.idpendiente;
		_form.querySelector('#nombrepanel').innerHTML=_dat.solicitante.nombrepanel;
		_form.querySelector('#descripcionpanel').innerHTML=_dat.solicitante.descripcionpanel;
		
		if(_dat.condiciones.COM_vision_compartida=='1'){
			//console.log('com');
			_form.querySelector('[for="COMver"]').checked=true;
		}else{
			_form.querySelector('[for="COMver"]').checked=false;
		}
		
		_form.querySelector('[name="COMver"]').value=_dat.condiciones.COM_vision_compartida;
		
		if(_dat.condiciones.DOC_vision_compartida=='1'){
			//console.log('doc');
			_form.querySelector('[for="DOCver"]').checked=true;
		}else{
			_form.querySelector('[for="DOCver"]').checked=false;
		}
		
		_form.querySelector('[name="DOCver"]').value=_dat.condiciones.DOC_vision_compartida;	
		
	}
	
	
	function consultarModulos(){
		_ModAct=_ModulosActivos;
		_parametros={};
		$.ajax({
			data:  _parametros,
			url:   './SIS_consulta_modulos.php',
			type:  'post',
			success:  function (response) {
				_res = PreprocesarRespuesta(response);

				_cont= document.querySelector('#contenidoextenso #columnauno');
				
				for(_Mcod in _res.data.modulos){
					if(_ModAct[_Mcod]!='1'){continue;}
					
					_Mdat=_res.data.modulos[_Mcod];
					_dpaq=document.createElement('div');
					_dpaq.setAttribute('class','modulo');
					_dpaq.setAttribute('actualizado','no');
					_dpaq.setAttribute('id',_Mcod);
					_cont.appendChild(_dpaq);
					
					_aaa=document.createElement('a');
					_aaa.setAttribute('href',_Mdat.index);
					_aaa.setAttribute('title',_Mdat.descripcion);
					_dpaq.appendChild(_aaa);
					
				
					_dantig=document.createElement('div');
					_dantig.setAttribute('class','antig');
					_dantig.innerHTML='hace:<span id="res_antig"></span> hs ';
					_dantig.innerHTML+="<a onclick='event.stopPropagation();event.preventDefault();actualizar(this.parentNode.parentNode.parentNode.getAttribute(\"id\"))' class='actualizar'><img src=\"./a_comunes/img/actualizar.png\"></a>";
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
				secuenciaActualizacionResumenes();
			}
		});
		
	}
	
	
	
	function cargaResumen(_COD){
		_parametros={
			"panid":_PanelI			
		};
		_url='./'+_COD+'/'+_COD+'_consulta_resumen.php';
		var _COD=_COD;
		$.ajax({
			data:  _parametros,
			url:  _url,
			type:  'post',
			success:  function (response) {
				_res = PreprocesarRespuesta(response);
				console.log(_res)
				for(_prop in _res.data){
					_htmlelem=document.querySelector('.modulo#'+_COD+' span#res_'+_prop);
					if(_htmlelem != null){
						if(typeof _htmlelem == 'object'){
							_htmlelem.innerHTML=_res.data[_prop];
						}
					}
				}
				
			}
		});
	}
	
	function actualizar(_COD){

		_parametros={
			"panid":_PanelI			
		};
		_url='./'+_COD+'/'+_COD+'_actualizar.php';
		var _COD=_COD;
		$.ajax({
			data:  _parametros,
			url:  _url,
			type:  'post',
			success:  function (response) {
				_res = PreprocesarRespuesta(response);
				cargaResumen(_COD);
			}
			
		});
	}	
	
	function secuenciaActualizacionResumenes(){
		
		_divmods = document.querySelectorAll('#columnauno > .modulo');
		
		for(_n in _divmods){
			
			if(typeof _divmods[_n] != 'object'){continue;}
			_mod=_divmods[_n].getAttribute('id');
			_act=_divmods[_n].getAttribute('actualizado');
			if(_act=='no'){
				console.log('actualiza '+_mod);
				actualizar(_mod);
				_divmods[_n].setAttribute('actualizado','encurso');
				secuenciaActualizacionResumenes();
				
				return;
			}
		}
		
	}		
</script>
		
</body>
