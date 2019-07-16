<?php

/**
* SEG_listado.php
*
* genera la estructua HTML para cargar, visualizar y formular cambios para seguimentos y acciones.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Lista de seguimiento / tracking / segumiento
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
    error_reporting( E_ALL );
    include ('./includes/header.php');

    function terminar($Log){
        echo "<pre>".print_r($Log,true)."</pre>";
        exit;
    }

    include ('./login_registrousuario.php');//buscar el usuario activo.
    $Log['tx'][]='nivel de acceso: '.$UsuarioAcc;
    if(!isset($UsuarioAcc)){
        $Log['tx'][]='error en los permisos del usuario registrado';    
        $Log['res']='err';
        terminar($Log); 
    }

    $nivelespermitidos=array(
    'administrador'=>'si',
    'editor'=>'si',
    'relevador'=>'no',
    'auditor'=>'si',
    'visitante'=>'no'
    );
    if(!isset($nivelespermitidos[$UsuarioAcc])){
        $Log['tx'][]='error en los permisos del usuario registrado';    
        $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
        $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
        $Log['res']='err';
        terminar($Log); 
    }

    $Hoy_a = date("Y");
    $Hoy_m = date("m");	
    $Hoy_d = date("d");	
    $Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;



$HabilitadoEdicion='si';
?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/SEG.css">
	
	<style type="text/css">
	</style>
	
	<link id='stlores' rel="stylesheet" type="text/css" href="./css/SEGlores.css">
	
	
    <?php include("./includes/meta.php"); ?>
		
</head>

<body onkeyup='tecleoGeneral(event)' onresize="actualizarCss();">
	<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>
	
	<script type="text/javascript">
		function actualizarCss(){
			console.log('o');
			console.log($(window).width());
			if($(window).width() < 1168) {
				console.log('chico');
				document.querySelector('link#stlores').disabled=false;
			} else {
				console.log('grande');
				document.querySelector('link#stlores').disabled=true;
			}
			console.log(document.querySelector('link#stlores').disabled);
			console.log(document.querySelector('link#stlores'));
		}
		actualizarCss();
	</script>
	
	
	<?php  insertarmenu();	// en ./PAN/PAN_comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		
				
        <h1>Gestión de Seguimientos</h1>
        <h2>modo gestión</h2> 		
        
        
        <div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
        
        <div class='botonerainicial' tipo='modos'>	
            <a class='botonmenu' href="./SEG_resumen.php">ver modo resumen</a> - 
            <a class='botonmenu' href="./SEG_calendario.php">ver modo calendario</a> -
            <a class='botonmenu' onclick="filtrarUsuario()">filtar por responsable</a> -
            <a class='botonmenu' onclick="asignarFiltroUsuario('YO')">filtar mías</a> 
       </div>
       
        <div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="crearSeguimiento()" title='agregar seguimiento'><img src='./img/agregar.png' alt='agregar'> seguimiento</a>
		</div>
		
		<div id="contenidoextenso">
			
			<div class="fila">
				<div class="titulo idseg">id</div><!---
                ---><div class="titulo id_p_grupos_tipo_a">g1</div><!---
                ---><div class="titulo id_p_grupos_tipo_b">g2</div><!---								
                ---><div class="titulo nombre">nombre</div><!---
                ---><div class="titulo descrip">descrip.</div><!---
                ---><div class="titulo tipo">tipo</div><!---
                ---><div class="titulo alta">alta</div><!---
                ---><div class="titulo baja">baja</div><!---
                ---><div class="titulo id_p_B_usuarios_usuarios_id_nombre_autor">autor</div><!---
                ---><div class="titulo id_p_B_usuarios_usuarios_id_nombre_responsable">resp.</div><!---
                ---><div class="titulo tareas">acciones</div><!---
                ---><div class="titulo proxima_fecha">prox</div>
            </div>	
			
			<div id="seguimientos">					
           </div>	
        </div>
    </div>        
    </div>
    

    <form id='seguimiento' class='central'>
    	
    	<a class='cerrar' onclick='this.parentNode.style.display="none"'>cerrar</a>
    	<a class='guardar' onclick='guardarSeguimiento()'>guarda</a>
    	<a class='eliminar' onclick='borrarSeguimiento()'>borrar</a>
    	<div class='datos'><label>Por: </label><span name='id_p_usuarios_autor'></div>
    	<div class='datos'><label>Respons: </label><select name='id_p_usuarios_responsable'><option value=''>- elegir -</option></select></div>
    	<div class='datos'><label>Id sega: </label><input disabled='disabled' name='idseg'></div>
    	<div class='campo'><label>Nombre: </label><input name='nombre'></div>
    	<div class='datos'><span class='seguimiento' name='estado'></span></div>
    	<div class='campo'><label>Tipo: </label><input name='tipo'></div>
    	<div class='campo levantado'>
    		<label>G1:</label>
    		<input type='hidden' name='id_p_grupos_tipo_a' value=''>
    		<input type='text' name='id_p_grupos_tipo_a_n' onfocus='opcionesSi(this)' value=''>
    		<div class='opciones' for='id_p_grupos_tipo_a'>
    			<a class='cerrar' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
    		</div>
    	</div>
    	<div class='campo levantado'>    		
		    <label>G2:</label>
		    <input type='hidden' name='id_p_grupos_tipo_b' value=''>
		    <input type='text' name='id_p_grupos_tipo_b_n' onfocus='opcionesSi(this)' value=''>
		    <div class='opciones' for='id_p_grupos_tipo_b'>
		    	<a class='cerrar' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
		    </div>
   		</div>
   		
   		
    	<div class='campo'><label>Descripción: </label><br><textarea name='info'></textarea></div>
    	<div class='campo'>
	    	<select name='fecha_tipo'>
	    			<option value='desconocida'></option>
	    			<option value='prevista'>previsto</option>
	    			<option value='efectiva'>activo</option>
	    	</select><label>Desde: </label><input name='fecha' type='date' onchange='consistenciaFecha(this,event)'>
	    </div>
    	<div class='campo'>
	    	<select name='fechacierre_tipo'>
	    			<option value='desconocida'></option>
	    			<option value='prevista'>programado</option>
	    			<option value='efectiva'>ejecutado</option>
	    	</select>
    		<label>Hasta: </label><input name='fechacierre' type='date' onchange='consistenciaFecha(this,event)'>
    	</div>
    	<h2>Acciones</h2> 
    	<div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="guardarSeguimiento();crearAccion();" title='agregar acción'><img src='./img/agregar.png' alt='agregar'> acción</a>
		</div>
		
    	<div id="acciones"></div>
    </form>
    
    <form id='accion' class='central'>
    	<a class='cerrar' onclick='deformularAcciones();this.parentNode.style.display="none"'>cerrar</a>
    	<a class='guardar' onclick='guardarAccion()'>guarda</a>
    	<a class='eliminar' onclick='borrarAccion()'>borrar</a>
    	<a class='suspender' onclick='suspenderAccion()'>suspende</a>
    	<a class='desuspender' onclick='deSuspenderAccion()'>reactiva</a>
    	<div class='datos'><label>Por: </label><span name='id_p_usuarios_autor'></span></div>
    	<div class='datos'><label>Respons: </label><select name='id_p_usuarios_responsable'><option value=''>- elegir -</option></select></div>
    	<div class='datos'><label>Id Accion</label><input name='idacc'></div><input name='id_p_tracking_id' type='hidden'>
    	<div class='campo'><label>Nombre</label><input name='nombre' onkeyup='actualizarCandidatosAccion(this,event);'><div id='candidatos'><div id='listado'></div></div></div>
    	
    	
    	<div class='datos'><span class='accion' name='estado'></span></div>
    	<div class='campo'><label>Descripción</label><br><textarea name='descripcion'></textarea></div>

    	
    	<div class='campo'>
	    	<select name='fechacreacion_tipo'>
	    			<option value='desconocida'></option>
	    			<option value='prevista'>prevista</option>
	    			<option value='efectiva'>activa</option>
	    	</select><label>Desde: </label><input name='fechacreacion' type='date' onchange='consistenciaFecha(this,event)'>
	    </div>
    	<div class='campo'>
	    	<select name='fechaejecucion_tipo'>
	    			<option value='desconocida'></option>
	    			<option value='prevista'>programada</option>
	    			<option value='efectiva'>ejecutada</option>
	    	</select>
    		<label>Hasta: </label><input name='fechaejecucion' type='date' onchange='consistenciaFecha(this,event)'>
    	</div>
    	
    	<div class='campo'><label>Último Control:</label>
    		<select name='fechacontrol_tipo'>
	    			<option value='desconocida'></option>
	    			<option value='prevista'>programado</option>
	    			<option value='efectiva'>realizado</option>
	    	</select>
    		<input name='fechacontrol' type='date' onchange='consistenciaFecha(this,event)'>
    	</div>
    	
    	<div id='adjuntos' class='paquete adjuntos'>
        	<div id='contenedorlienzo' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>	
	            <h2>Adjuntos:</h2>					
	            
	            <label>Arraste todos los archivos aquí.</label>
	            <input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'></label>
	            
	            
	            <div id="listadosubiendo"></div>            
	        	<div id='adjuntoslista'></div>
        	</div>
        	
        </div>
        
    </form>
     
    <script type="text/javascript">
    	var _UsuId = '<?php echo $UsuarioI;?>';
        var _PanId = '<?php echo $PanelI; ?>';
        var _HabilitadoEdicion = '<?php echo $HabilitadoEdicion; ?>';
       
        var _DataSeguimientos=Array();
		var _DatosUsuarios=Array();
		var _IdSegEdit=''; //id del seguimiento en edicion
		var _IdAccEdit=''; //id de la accion en edicion
		var  _Grupos=Array();
		
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
		
		
	</script>
    <script tipe="text/javascript">
      
      	function MesNaMesTxCorto(_mn){
			_meses=Array('err','ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic');
			return _meses[parseInt(_mn)];
		}
		
		
		function consultarListado(){
	        _parametros = {
	            'panid': _PanId
	        };
	        $.ajax({
	            url:   './SEG/SEG_consulta.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	                var _res = $.parseJSON(response);
	                console.log(_res);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                document.querySelector('#contenidoextenso #seguimientos').innerHTML='';
	                for(_ns in _res.data.seguimientosOrden_prioridad){
	                    _idseg=_res.data.seguimientosOrden_prioridad[_ns];
	                    _dat=_res.data.seguimientos[_idseg];
	                
	                    _fila=document.createElement('div');
	                    _fila.setAttribute('class','fila seguimiento');
	                    _fila.setAttribute('filtroB','ver');
	                    _fila.setAttribute('onclick','formularSeguimiento("'+_idseg+'",event)');
	                    _fila.setAttribute('idresp',_dat.id_p_usuarios_responsable);
	                    
	                    _fila.title=_dat.estado;
	                    _fila.setAttribute('prioridad',_dat.prioridad);
	                    document.querySelector('#contenidoextenso #seguimientos').appendChild(_fila);
	                    
	                    	                    
	                    _ddd=document.createElement('div');
	                    _ddd.setAttribute('class','contenido idseg');
	                    _ddd.innerHTML=_dat.id;
	                    _fila.appendChild(_ddd);
	                    
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido id_p_grupos_tipo_a');
	                    if(_Grupos[_dat.id_p_grupos_tipo_a].codigo!=''){
	                    	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_a].codigo;	
	                    	_ddd.title=_Grupos[_dat.id_p_grupos_tipo_a].nombre;
	                    }else{
	                    	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_a].nombre;
	                    }	                    
	                    _fila.appendChild(_ddd);
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido id_p_grupos_tipo_b');
	                    if(_Grupos[_dat.id_p_grupos_tipo_b].codigo!=''){
	                    	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_b].codigo;	
	                    	_ddd.title=_Grupos[_dat.id_p_grupos_tipo_b].nombre;
	                    }else{
	                    	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_b].nombre;
	                    }	                    
	                    _fila.appendChild(_ddd);
	                    
	                    _aaa =document.createElement('a');
	                    _aaa.setAttribute('idseg',_idseg);
	                    _aaa.setAttribute('class','contenido nombre');
	                    _aaa.title=_dat.nombre;
	                    _aaa.innerHTML=_dat.nombre;
	                    _fila.appendChild(_aaa);
	                
	                    _aaa =document.createElement('a');
	                    _aaa.setAttribute('idseg',_idseg);
	                    _aaa.setAttribute('class','contenido descrip');
	                    _aaa.title=_dat.info;
	                    _aaa.innerHTML=_dat.info;
	                    _fila.appendChild(_aaa);
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido tipo');
	                    _ddd.innerHTML=_dat.tipo;
	                    _fila.appendChild(_ddd);
	
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido alta');
	                    if(_dat.fecha=='0000-00-00'){
	                    	_ddd.innerHTML='sin/dat';
	                    }else{
		                    _e=_dat.fecha.split('-');
		                    _ddd.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
	                    }
	                    _fila.appendChild(_ddd);
	
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido baja');
	                    if(_dat.fechacierre=='0000-00-00'){
	                    	_ddd.innerHTML='sin/dat';
	                    }else{
		                    _e=_dat.fechacierre.split('-');
		                    _ddd.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
	                    }
	                    _fila.appendChild(_ddd);
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido id_p_B_usuarios_usuarios_id_nombre_autor');
	                    if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_autor] == undefined){
	                    	_ddd.innerHTML='-';
	                    }else{	
	                    	_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_autor].nombreusu;
	                    }
	                    if(_dat.id_p_usuarios_autor==_UsuId){
	                    	_ddd.setAttribute('responsabilidad','propio');
	                    }
	                    _fila.appendChild(_ddd);
	                    
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido id_p_B_usuarios_usuarios_id_nombre_responsable');
	                    if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable] == undefined){
	                    	_ddd.innerHTML='-';
	                    }else{
	                    	_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable].nombreusu;
	                    }
	                    
	                    if(_dat.id_p_usuarios_responsable==_UsuId){
	                    	_ddd.setAttribute('responsabilidad','propio');
	                    }
	                    _fila.appendChild(_ddd);
	                    /*
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido');
	                    _ddd.innerHTML=Object.keys(_dat.acciones).length;
	                    _cfila.appendChild(_ddd);
	                    */
	                    _tareas =document.createElement('div');
	                    _tareas.setAttribute('class','contenido tareas');
	                    _fila.appendChild(_tareas);
	                    
	                    _dddt =document.createElement('div');
	                    _tareas.appendChild(_dddt);
	                
	                
	                    for(_na in _dat.accionesOrden_prioridad){
	                    	
	                        _idacc=_dat.accionesOrden_prioridad[_na];
	                        _datacc=_dat.acciones[_idacc];
	                       
	                        _ddf=document.createElement('div');
	                        _ddf.setAttribute('class','filaitem');
	                        _dddt.appendChild(_ddf);
	                        
	                        _aaa =document.createElement('a');
	                        _aaa.setAttribute('idacc',_idacc);                            
	                        _aaa.setAttribute('estado',_datacc.estado);
	                        _aaa.setAttribute('idresp',_datacc.id_p_usuarios_responsable);
	                        _aaa.setAttribute('prioridad',_datacc.prioridad);
	                        _aaa.setAttribute('onclick','formularSeguimiento("'+_idseg+'",event),formularAccion("'+_idacc+'",event)');
	                        _aaa.setAttribute('class','accion '+_datacc.estado);
	                        _aaa.title=_datacc.descripcion;
	                        
	                        _dddt.appendChild(_aaa);
	                        
	                        _spa=_ddf=document.createElement('span');
	                        _spa.setAttribute('class','responsable');
	                        _spa.innerHTML=_datacc.nombre.substring(0,2);	
	                        
	                        if(_DatosUsuarios.delPanel[_datacc.id_p_usuarios_responsable] == undefined){
		                    	_spa.innerHTML='-';
		                    }else{
		                    	_spa.innerHTML=_DatosUsuarios.delPanel[_datacc.id_p_usuarios_responsable].nombreusu.substring(0,2);
		                    }
		                    if(_datacc.id_p_usuarios_responsable==_UsuId){
		                    	_spa.setAttribute('responsabilidad','propio');
		                    }
		                    
	                        _aaa.appendChild(_spa);
	                    	
	                    	_spa=_ddf=document.createElement('span');
	                        _spa.setAttribute('class','nombre');
	                        _spa.innerHTML=_datacc.nombre;
	                        _aaa.appendChild(_spa);
	                    	
	                        _spa=_ddf=document.createElement('span');
	                        _spa.setAttribute('class','fecha');
	                        if(_datacc.fecha_proxima=='0000-00-00'){
	                    		_spa.innerHTML='sin/dat';
		                    }else{
		                    	_e=_datacc.fecha_proxima.split('-');
		                    	_h = _Hoy.split('-');
			                    if(_e[0]==_h[0]){  
				                    _spa.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1]);
		                    	}else{
				                    _spa.innerHTML=_e[0];
				                }
		                    }
	                        _aaa.appendChild(_spa);
	                    	
	                    }
	                    
	                    _aaa =document.createElement('a');
	                    _aaa.setAttribute('idacc',''); 
	                    _aaa.setAttribute('class','falsaaccion');
	                    _aaa.setAttribute('onclick','crearAccion("'+_idseg+'",event)');
	                    _aaa.innerHTML= 'agregar accion';
	                    
	                    _dddt.appendChild(_aaa);
	                    
	                    _ddd =document.createElement('div');
	                    _ddd.setAttribute('class','contenido proxima_fecha');
	                    
	                    	                    
	                    if(_dat.zz_cache_primera_fechau>0){
	                    	_diasfaltan = (_dat.zz_cache_primera_fechau-_Hoy_unix) / 60 / 60 / 24;
	                    	_ddd.setAttribute('diasfaltan',Math.round(_diasfaltan));
	                    	if(_diasfaltan < 8 ){
	                    		_falta=Math.round(_diasfaltan)+' días';
	                    	}else if(_diasfaltan < 30 ){
	                    		_falta=Math.round(_diasfaltan/7)+' sem.';
	                    	}else{
	                    		_falta=Math.round(_diasfaltan/30)+' mes';
	                    	}
	                    	_ddd.innerHTML=_falta;	
	                    	
	                    
		                    _alerta_max=3;	                    
		                    _alerta_min=8;	                    
		                    if(_diasfaltan<=_alerta_max){
		                    	_alerta_porc=1;
		                    }else if(_diasfaltan>=_alerta_min){
		                    	_alerta_porc=0;
		                    }else{
		                    	_alerta_porc=0.2+(_diasfaltan-_alerta_max)*0.8/(8-3);	
		                    }
		                    _ddd.style.backgroundColor='rgba(255,100,0,'+_alerta_porc+')';
		                    	
	                    	
	                    	
	                    }else{
	                    	_ddd.innerHTML='---';
	                    }
	                    
	                    
	                    _fila.appendChild(_ddd);
	                        
	                }
	                
	                asignarFiltroUsuario(_Filtros.usuario);
	                tecleaBusqueda('','');
	                
	            }
	        });
	    }   
        
        document.querySelector('#buscador input[name="busqueda"]').focus();
        
        
        function consultarUsuarios(){
        	_parametros = {
            'zz_AUTOPANEL': _PanId
	        };
	        $.ajax({
	            url:   './PAN/PAN_usuarios_consulta.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	               	_DatosUsuarios=_res.data.usuarios;   
	               	
	               	document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
	               	document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
	               	
	               	for(_nu in _DatosUsuarios.delPanelOrden){
	               		_idusu = _DatosUsuarios.delPanelOrden[_nu];
	               		_op=document.createElement('option');
	               		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
	               		_op.value=_idusu;
	               		document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').appendChild(_op);
	               		document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').appendChild(_op.cloneNode(true));
	               	}
    	
    				
    				if(_Grupos[0]!=undefined){
    					consultarListado(); 
    	  			}
	            }
	       });
        }
        consultarUsuarios();
        
        function consultarGrupos(){
	        var parametros = {
	        };			
	        $.ajax({
	            data:  parametros,
	            url:   './PAN/PAN_grupos_consulta.php',
	            type:  'post',
	            error:   function (response) {alert('error al contactar el servidor');},
	            success:  function (response) {
	                //procesarRespuestaDescripcion(response, _destino);
	                
	                
	                var _res = $.parseJSON(response);
	                //console.log(_res);
	                
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                for(_na in _res.acc){
	                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
	                }                
	                
	                if(_res.res=='exito'){
	                			
	                    _Grupos=_res.data.grupos;
		                
		           
				        if(_DatosUsuarios.delPanel!=undefined){
	    					consultarListado(); 
	    	  			}
	                }
	            }
	        });
	    }
	    consultarGrupos();
	    
	    
	    var _AccionesFrecuentes=Array();
	    
	    function consultarFrecuentes(){
	        var parametros = {
	        };			
	        $.ajax({
	            data:  parametros,
	            url:   './SEG/SEG_consulta_accion_frecuentes.php',
	            type:  'post',
	            error:   function (response) {alert('error al contactar el servidor');},
	            success:  function (response) {
	                //procesarRespuestaDescripcion(response, _destino);
	                 var _res = $.parseJSON(response);
	                //console.log(_res);
	                
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                for(_na in _res.acc){
	                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
	                }                
	                
	                if(_res.res=='exito'){
		                _AccionesFrecuentes=_res.data.casos;
					}  
	            }
	        });
	    }
	    consultarFrecuentes();
	    
	    
    </script>

	<script type="text/javascript">
		
		
		function formularSeguimiento(_idseg,event){
			_parametros = {
	            'panid': _PanId,
	            'idseg':_idseg
	        };
	        _IdSegEdit=_idseg;
	        $.ajax({
	            url:   './SEG/SEG_consulta_seguimiento.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	                var _res = $.parseJSON(response);
	                
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                _segid=_res.data.id;
	                
	                _dataseg=_res.data.seguimientos[_segid];
	                _DataSeguimientos[_segid]=_dataseg;
	                
	                _form=document.querySelector('form#seguimiento');
	                _form.style.display='block';
	                _form.querySelector('input[name="idseg"]').value=_segid;
	                	                
	                for(_campo in _dataseg){                	
	                	_inp=_form.querySelector('[name="'+_campo+'"]');
	                	
	                	if(_inp!=null){
	                		if(
	                			_inp.tagName=='INPUT'
	                			||
	                			_inp.tagName=='TEXTAREA'
	                		){
	                			_inp.value=_dataseg[_campo];
	                		}else if(
	                			_inp.tagName=='SELECT'
	                		){
	                			if(_inp.querySelector('option[value="'+_dataseg[_campo]+'"]')==null){continue;}
	                			_inp.querySelector('option[value="'+_dataseg[_campo]+'"]').selected='selected';
	                		}else if(
	                			_inp.tagName=='SPAN'
	                		){
	                			_inp.innerHTML=_dataseg[_campo];
	                		}
	                	}
	                }
	                
	                _form.querySelector('[name="id_p_grupos_tipo_a_n"]').value=_Grupos[_dataseg.id_p_grupos_tipo_a].nombre;
	                _form.querySelector('[name="id_p_grupos_tipo_b_n"]').value=_Grupos[_dataseg.id_p_grupos_tipo_b].nombre;
	                
	                _botonmenos=document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #menos');
	                opcionesMenos(_botonmenos);
	                _botonmenos=document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #menos');
	                opcionesMenos(_botonmenos);
	                
	                document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #enpanel').innerHTML='';
	                document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #fueradepanel').innerHTML='';
	                
	                document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #enpanel').innerHTML='';
	                document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #fueradepanel').innerHTML='';
	                
	                for(_ng in _Grupos){   
	                	 	
			            if(_Grupos[_ng].tipo=='a'){			            	
			                _cont= document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"]');			                
			            }else if(_Grupos[_ng].tipo=='b'){
			                _cont= document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"]');
			            }else{
			            	continue;
			            }
			            
			            if(_res.data.gruposdelpanel[_Grupos[_ng].id]!=undefined){
			            	_cont=_cont.querySelector('#enpanel');
			            }else{
			            	_cont=_cont.querySelector('#fueradepanel');
			            }
			            
			            _anc=document.createElement('a');
			            _anc.setAttribute('onclick','opcionar(this)');
			            _anc.setAttribute('idgrupo',_Grupos[_ng].id);
			            _anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
			            _anc.innerHTML= _Grupos[_ng].nombre;
			            _cont.appendChild(_anc);
			        }
			        
			        
			        
	                _form.querySelector('span[name="estado"]').setAttribute('prioridad',_dataseg.prioridad);	                
	                _form.querySelector('#acciones').innerHTML='';
	                
	                for(_an in _dataseg.acciones){
	                	
	                	_adat=_dataseg.acciones[_an];
	                	_div=document.createElement('a');			
	                	_div.title=_adat.descripcion;		
	                	_div.setAttribute('idacc',_adat.id);
	                	_div.setAttribute('class','accion');
	                	     
	                	_div.setAttribute('estado',_adat.estado);
	                	_div.setAttribute('prioridad',_adat.prioridad);
	                	_div.setAttribute('onclick','formularAccion("'+_adat.id+'",event)');
	                	
	                	
	                	_spa=_ddf=document.createElement('span');
                        _spa.setAttribute('class','responsable');
                        _spa.innerHTML=_adat.nombre;	
                        
                        if(_DatosUsuarios.delPanel[_adat.id_p_usuarios_responsable] == undefined){
	                    	_spa.innerHTML='-';
	                    }else{
	                    	_spa.innerHTML=_DatosUsuarios.delPanel[_adat.id_p_usuarios_responsable].nombreusu;
	                    }
	                    if(_adat.id_p_usuarios_responsable==_UsuId){
	                    	_spa.setAttribute('responsabilidad','propio');
	                    }
	                    
                        _div.appendChild(_spa);
                        
	                	
	                	_spa=_ddf=document.createElement('span');
                        _spa.setAttribute('class','nombre');
                        _spa.innerHTML=_adat.nombre;	
                        _div.appendChild(_spa);
                        
                        _spa=_ddf=document.createElement('div');
                        _spa.setAttribute('class','historia');	
                        _div.appendChild(_spa);
                        
                        _el=document.createElement('div');
                        _el.setAttribute('id','desarrollo');
                         _est=''
                        if(_adat.fechaejecucion_unix<_Hoy_unix&&_adat.fechaejecucion>'0000-00-00'){
                        	if(_adat.fechaejecucion_tipo=='efectiva'){
                        		_est='cumplido';
                        	}else{
                        		_est='vencido';
                        	}
                        }
                        _el.setAttribute('estado',_est);
                        _duracSeg=_dataseg.fecha_max-_dataseg.fecha_min;
                        _duracAcc=_adat.fecha_max - _adat.fecha_min;
                        _ocupAcc=_duracAcc * 100 / _duracSeg;
                        _duracPrev=_adat.fecha_min - _dataseg.fecha_min;
                        _ocupPrev=_duracPrev * 100 / _duracSeg;
                        _el.style.width= 'calc('+ _ocupAcc +'%)';
                        _el.style.left= 'calc('+ _ocupPrev +'%)';
	                    _spa.appendChild(_el);
	                     
	                    _el=document.createElement('div');
                        _el.setAttribute('id','inicio');                        
                        _est=''
                        if(_adat.fechacreacion_unix<_Hoy_unix){
                        	if(_adat.fechacreacion_tipo=='efectiva'){
                        		_est='cumplido';
                        	}else{
                        		_est='vencido';
                        	}
                        }
                        _el.setAttribute('estado',_est);
                        _duracPrev=_adat.fechacreacion_unix-_dataseg.fecha_min;
                        _ocupPrev=_duracPrev * 100 / _duracSeg;
                        _el.style.left= 'calc('+ _ocupPrev +'%)';
	                    _spa.appendChild(_el);
	                    
	                    _el=document.createElement('div');
                        _el.setAttribute('id','fin');
                        _est=''
                        if(_adat.fechaejecucion_unix<_Hoy_unix){
                        	if(_adat.fechaejecucion_tipo=='efectiva'){
                        		_est='cumplido';
                        	}else{
                        		_est='vencido';
                        	}
                        }
                        _el.setAttribute('estado',_est);
                        _duracPrev=_adat.fechaejecucion_unix-_dataseg.fecha_min;
                        _ocupPrev=_duracPrev * 100 / _duracSeg;
                        _el.style.left= 'calc('+ _ocupPrev +'% - 5px)';
	                    _spa.appendChild(_el);
	                    
	                    
	                    _el=document.createElement('div');
                        _el.setAttribute('id','control');
                        _est=''
                        if(_adat.fechacontrol_unix<_Hoy_unix){
                        	if(_adat.fechacontrol_tipo=='efectiva'){
                        		_est='cumplido';
                        	}else{
                        		_est='vencido';
                        	}
                        }
                        _el.setAttribute('estado',_est);
                        _duracPrev=_adat.fechacontrol_unix-_dataseg.fecha_min;
                        _ocupPrev=_duracPrev * 100 / _duracSeg;
                        _el.style.left= 'calc('+ _ocupPrev +'%)';
	                    _spa.appendChild(_el);
	                    
	                    _el=document.createElement('div');
                        _el.setAttribute('id','hoy');
                        _duracPrev=_Hoy_unix-_dataseg.fecha_min;
                        _ocupPrev=_duracPrev * 100 / _duracSeg;
                        _el.style.left= 'calc('+ _ocupPrev +'%)';
	                    _spa.appendChild(_el);
	                    
	                	_form.querySelector('#acciones').appendChild(_div);
	                }
	                
	                if(_DatosUsuarios.delPanel[_dataseg.id_p_usuarios_autor]==undefined){
	                	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML='-';	
	                }else{
	                	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML=_DatosUsuarios.delPanel[_dataseg.id_p_usuarios_autor].nombreusu;
	                }
	            }
	        });    
		}

		function guardarSeguimiento(_this,event){
			
			_parametros = {
	            'panid': _PanId,
	            'idseg':document.querySelector('form#seguimiento input[name="idseg"]').value,
	            'id_p_usuarios_responsable':document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').value,
	            'nombre':document.querySelector('form#seguimiento input[name="nombre"]').value,
	            'info':document.querySelector('form#seguimiento textarea[name="info"]').value,
	            'tipo':document.querySelector('form#seguimiento input[name="tipo"]').value,
	            'fecha':document.querySelector('form#seguimiento input[name="fecha"]').value,
	            'fecha_tipo':document.querySelector('form#seguimiento [name="fecha_tipo"]').value,
	            'fechacierre':document.querySelector('form#seguimiento input[name="fechacierre"]').value,
	            'fechacierre_tipo':document.querySelector('form#seguimiento [name="fechacierre_tipo"]').value,
	            'id_p_grupos_tipo_a':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a"]').value,
	            'id_p_grupos_tipo_a_n':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a_n"]').value,
	            'id_p_grupos_tipo_b':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b"]').value,
	            'id_p_grupos_tipo_b_n':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b_n"]').value
	        };
	        document.querySelector('form#seguimiento').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_seguimiento.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	            }
	        });    
		}	
		
		function crearSeguimiento(){
			
			_parametros = {
	            'panid': _PanId	        
	       }
	        $.ajax({
	            url:   './SEG/SEG_ed_crear_seguimiento.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                _idseg = _res.data.nidseg;
	                consultarListado();	                
	                formularSeguimiento(_idseg,event);
	                
	            }
	        });    
		}
		
		function borrarSeguimiento(){
			
			if(!confirm('¿Borramos este seguimiento?.. ¿Segure?')){return;}
			
			_parametros = {
	            'panid': _PanId,
	            'idseg':document.querySelector('form#seguimiento input[name="idseg"]').value,
	        };
	        document.querySelector('form#seguimiento').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_borrar_seguimiento.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	            }
	        });    
			
		}
		
		function deformularAcciones(){
			_sels=document.querySelectorAll('form#seguimiento #acciones [selecta="si"]');
            for(_ns in _sels){
            	if(typeof _sels[_ns] != 'object'){continue;}
            	_sels[_ns].removeAttribute('selecta');
            }
		}
				
		function formularAccion(_idacc,_event){
			
			consultarFrecuentes();
			
			_event.stopPropagation();
			_parametros = {
	            'panid': _PanId,
	            'idacc': _idacc,
	            'idseg':_IdSegEdit
	        };
	        
	        $.ajax({
	            url:   './SEG/SEG_consulta_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	                var _res = $.parseJSON(response);
	                
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                _accid=_res.data.idacc;
	                _IdAccEdit=_accid;
	                
	                
	                _sels=document.querySelectorAll('form#seguimiento #acciones [selecta="si"]');
	                for(_ns in _sels){
	                	if(typeof _sels[_ns] != 'object'){continue;}
	                	_sels[_ns].removeAttribute('selecta');
	                }
	                	                
	                _item=document.querySelector('form#seguimiento #acciones [idacc="'+_accid+'"]');
	                if(_item!= undefined){_item.setAttribute('selecta','si')}
	                
	                _dataacc=_res.data.accion;
	                
	                if(_dataacc.zz_suspendida=='0'){
	                	document.querySelector('form#accion .suspender').style.display='block';
	                	document.querySelector('form#accion .desuspender').style.display='none';
	                }else{
	                	document.querySelector('form#accion .suspender').style.display='none';
	                	document.querySelector('form#accion .desuspender').style.display='block';
	                }
	                
	                _DataSeguimientos[_IdSegEdit]['acciones'][_accid]=_dataacc;
	                
	                _form=document.querySelector('form#accion');
	                _form.style.display='block';
	                _form.querySelector('input[name="idacc"]').value=_accid;
	                
	                
	                 _form.querySelector('#candidatos #listado').innerHTML='';
	                 for(_hatch in _AccionesFrecuentes){
	                 	_dat=_AccionesFrecuentes[_hatch];
	                 	if(_dat.cant>2){_peso='alto';}else{_peso='bajo';}
	                 	
	                 	_item=document.createElement('div');
	                 	_item.innerHTML=_dat.muestra;
	                 	_item.setAttribute('peso',_peso);
	                 	_item.setAttribute('hatch',_hatch);
	                 	_item.setAttribute('onclick','cargarCandidatoAccion(this)');
	                 	_form.querySelector('#candidatos #listado').appendChild(_item);
	                 }
	                
	                
	                
	                for(_campo in _dataacc){                	
	                	_inp=_form.querySelector('[name="'+_campo+'"]');
	                	
	                	if(_inp!=null){
	                		if(
	                			_inp.tagName=='INPUT'
	                			||
	                			_inp.tagName=='TEXTAREA'
	                		){
	                			_inp.value=_dataacc[_campo];
	                		}else if(
	                			_inp.tagName=='SELECT'
	                		){
	                			if(_inp.querySelector('option[value="'+_dataacc[_campo]+'"]')==null){continue;}
	                			_inp.querySelector('option[value="'+_dataacc[_campo]+'"]').selected='selected';
	                		}else if(
	                			_inp.tagName=='SPAN'
	                		){
	                			_inp.innerHTML=_dataacc[_campo];
	                		}
	                	}
	                	
	                	
	                }
	                
	           		_form.querySelector('span[name="estado"]').setAttribute('prioridad',_dataacc.prioridad);	
						                                           
	                if(_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor]==undefined){
	                	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML='-';	
	                }else{
	                	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML=_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor].nombreusu;
	                }
	                
	                _form.querySelector('#adjuntoslista').innerHTML='';
	                for(_na in _dataacc.adjuntos){
	                	_daj=_dataacc.adjuntos[_na];	 
	                	 anadirAdjunto(_daj);	                	
	                }
	            }
	        });    
		}
		
		function anadirAdjunto(_daj){	                	
        	_div=document.createElement('div');
        	_div.setAttribute('class','adjunto');
        	_div.setAttribute('ruta',_daj.FI_documento);
        	_div.setAttribute('idadj',_daj.id);
        	_div.setAttribute('onclick','mostrarAdjunto(this)');
        	
        	_img=document.createElement('img');
        	_img.setAttribute('src',_daj.FI_muestra);
        	_div.appendChild(_img)
        	
        	_epi=document.createElement('div');
        	_epi.setAttribute('class','epigrafe');
        	_epi.innerHTML=_daj.nombre;
        	_div.appendChild(_epi);
        	
        	_borr=document.createElement('a');
        	_borr.setAttribute('class','elimina');
        	_borr.setAttribute('onclick','eliminaAdjunto(this,event)');
        	_borr.innerHTML='x';
        	_borr.title='Eliminar este adjunto';
        	_div.appendChild(_borr);
        	
        	document.querySelector('form#accion #adjuntoslista').appendChild(_div);
		}
		
		function mostrarAdjunto(_this){
			
			_ruta='./documentos/p_'+_PanId+'/SEG/original/'+_this.getAttribute('ruta');
			window.open( _ruta,'_blank');

		}
		
		function guardarAccion(_this,event){
			
			_parametros = {
	            'panid': _PanId,
	            'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
	            'idacc':document.querySelector('form#accion input[name="idacc"]').value,
	            'id_p_usuarios_responsable':document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').value,
	            'nombre':document.querySelector('form#accion input[name="nombre"]').value,
	            'descripcion':document.querySelector('form#accion textarea[name="descripcion"]').value,
	            
	            'fechacreacion':document.querySelector('form#accion input[name="fechacreacion"]').value,
	            'fechacreacion_tipo':document.querySelector('form#accion [name="fechacreacion_tipo"]').value,
	            'fechacontrol':document.querySelector('form#accion input[name="fechacontrol"]').value,
	            'fechacontrol_tipo':document.querySelector('form#accion [name="fechacontrol_tipo"]').value,
	            'fechaejecucion':document.querySelector('form#accion input[name="fechaejecucion"]').value,
	            'fechaejecucion_tipo':document.querySelector('form#accion [name="fechaejecucion_tipo"]').value
        
	        };
	        document.querySelector('form#accion').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	                
	                
	            }
	        });    
		}	
		
		function crearAccion(_idseg){
			
			_parametros = {
	            'panid': _PanId,
	            'idseg':_IdSegEdit	        
	       }
	        $.ajax({
	            url:   './SEG/SEG_ed_crear_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                _idacc = _res.data.nidacc;
	                formularSeguimiento(_IdSegEdit,event);
	                formularAccion(_idacc,event);
	                consultarListado();
	                
	            }
	        });    
		}	
		
		function borrarAccion(){
			
			if(!confirm('¿Borramos esta acción?.. ¿Segure?')){return;}
			
			_parametros = {
	            'panid': _PanId,
	            'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
	            'idacc':document.querySelector('form#accion input[name="idacc"]').value,
	        };
	        document.querySelector('form#accion').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_borrar_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	            }
	        });    
			
		}
		
		function suspenderAccion(){
			
			if(!confirm('Una acción suspendida será desestimada hasta que vuelva a ser activada ¿Continuamos?')){return;}
			
			_parametros = {
	            'panid': _PanId,
	            'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
	            'idacc':document.querySelector('form#accion input[name="idacc"]').value,
	        };
	        document.querySelector('form#accion').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_suspender_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	            }
	        });    
			
		}
		
		function deSuspenderAccion(){
			
			
			_parametros = {
	            'panid': _PanId,
	            'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
	            'idacc':document.querySelector('form#accion input[name="idacc"]').value,
	        };
	        document.querySelector('form#accion').style.display='none';
	        
	        $.ajax({
	            url:   './SEG/SEG_ed_desuspender_accion.php',
	            type:  'post',
	            data: _parametros,
	            error: function (response){alert('error al intentar contatar el servidor');},
	            success:  function (response){
	            	
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
	                consultarListado();
	            }
	        });    
			
		}
		
	</script>	
	<script type="text/javascript">
	
	
		
		function consistenciaFecha(_this,_event){
			//console.log(_event);
			_campo=_this.getAttribute('name');
			_campot=_campo+'_tipo';
			_tipoInp=_this.parentNode.querySelector('[name="'+_campot+'"]');
			
			if(
				_this.value=='0000-00-000'
				||
				_this.value==null
				||
				_this.value==undefined
				||
				_this.value==''
			){
				_tipoInp.value='desconocida'
			}else if(
				_tipoInp.value=='desconocida'
			){
				if(_Hoy<=_this.value){
					_tipoInp.value='prevista'
				}else{
					_tipoInp.value='efectiva'
				}
			}
		}
		
		function opcionar(_this){
		    _gid=_this.getAttribute('idgrupo');
		    _ifor=_this.parentNode.parentNode.getAttribute('for');
		    _gnom=_this.innerHTML;
		    _this.parentNode.parentNode.parentNode.querySelector('input[name="'+_ifor+'_n"]').value=_gnom;
		    _this.parentNode.parentNode.parentNode.querySelector('input[name="'+_ifor+'"]').value=_gid;
		    _this.parentNode.parentNode.style.display='none';
		}
		
		function opcionNo(_this){
		    _name=_this.getAttribute('name');
		    _oname=_name.substr(0,(_name.length - 2));
		    _this.parentNode.querySelector('input[name="'+_oname+'"]').value='n';
		}
		
		function opcionesSi(_this){
			_name=_this.getAttribute('name');
			_oname=_name.substr(0,(_name.length - 2));
			document.querySelector('form#seguimiento .opciones[for="'+_oname+'"]').style.display="block";	
		}
		function opcionesNo(_this){
			_name=_this.getAttribute('name');
			_oname=_name.substr(0,(_name.length - 2));
			document.querySelector('form#seguimiento .opciones[for="'+_oname+'"]').style.display="none";
		}		
	</script>
    <script type="text/javascript">

        _selectos=0;

        function agregainput(tracking){
            var nuevoinput = document.createElement('input');
            nuevoinput.setAttribute('id', 'i'+tracking);
            nuevoinput.setAttribute('type', 'text');
            nuevoinput.setAttribute("readOnly","true");
            nuevoinput.setAttribute('style', 'width:25px;');
            nuevoinput.setAttribute('name', tracking);
            nuevoinput.setAttribute('value', tracking);
            document.getElementById('formdepase').appendChild(nuevoinput);
            _selectos = _selectos + 1;
            document.getElementById('formcarga').innerHTML=_selectos;
            document.getElementById('formdepase').style.display='block';
        }

        function quitainput(tracking){
            input=document.getElementById('i'+tracking);
            document.getElementById('formdepase').removeChild(input);
            _selectos = _selectos - 1;
            document.getElementById('formcarga').innerHTML=_selectos;
            if(_selectos==0){document.getElementById('formdepase').style.display='none';}	
        }

        function titila(identificador){
            var elementos = document.getElementsByName(identificador);	 
            for (x=0;x<elementos.length;x++){
                if(elementos[x].style.display != 'none' ) {
                    elementos[x].style.display = 'none';
                }else{
                    elementos[x].style.display = '';
                }
            }
        }
        
        function tecleoGeneral(_event){

        	if(
        		document.querySelector('form#seguimiento').style.display=='none'
        		&&
        		document.querySelector('form#accion').style.display=='none'
        	){
        		asignarFiltroUsuario('NO');
        	}
        	
        	if(_event.keyCode==27){
        		document.querySelector('form#seguimiento').style.display='none';
        		document.querySelector('form#accion').style.display='none';
        	}
        }

		function opcionesMenos(_this){
			_this.parentNode.querySelector('#mas').style.display='block';
			_this.parentNode.querySelector('#menos').style.display='none';
			_this.parentNode.querySelector('#fueradepanel').style.display='none';
		}
		function opcionesMas(_this){
			_this.parentNode.querySelector('#mas').style.display='none';
			_this.parentNode.querySelector('#menos').style.display='block';
			_this.parentNode.querySelector('#fueradepanel').style.display='block';
		}
		
	
	
		function filtrarUsuario(){
			_form=document.createElement('form');
			_form.setAttribute('id','filtro');
			_form.setAttribute('class','central');
			document.querySelector('body').appendChild(_form);
			
			_idusu = _DatosUsuarios.delPanelOrden[_nu];
       		_op=document.createElement('a');
       		_op.setAttribute('onclick','asignarFiltroUsuario("NO")');
       		_op.innerHTML= "- MOSTRAR TODO -";
       		_op.value=_idusu;
       		_form.appendChild(_op);
       		
			for(_nu in _DatosUsuarios.delPanelOrden){
           		_idusu = _DatosUsuarios.delPanelOrden[_nu];
           		_op=document.createElement('a');
           		_op.setAttribute('onclick','asignarFiltroUsuario("'+_idusu+'")');
           		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
           		_op.value=_idusu;
           		_form.appendChild(_op);
           	}
		}
		
		function asignarFiltroUsuario(_idusu){
			
			_Filtros.usuario=_idusu;
			
			if(_idusu=='YO'){
				_idusu=_UsuId;
			}
			
			_form=document.querySelector('form.central#filtro');
			if(_form!=null){
				_form.parentNode.removeChild(_form);
			}
			
			_segs=document.querySelectorAll('#contenidoextenso #seguimientos .fila.seguimiento');
			for(_ns in _segs){
				if(typeof _segs[_ns] != 'object'){continue;}
				_segs[_ns].removeAttribute('filtro');				
			}
			
			_acc=document.querySelectorAll('.contenido.tareas .accion');
			for(_na in _acc){
				if(typeof _acc[_na] != 'object'){continue;}
				
				if(_idusu=='NO'){_acc[_na].removeAttribute('filtro');continue;}
				if(_acc[_na].getAttribute('idresp')==_idusu){
					_acc[_na].setAttribute('filtro','ver');
					_acc[_na].parentNode.parentNode.parentNode.setAttribute('filtro','ver');
				}else{
					_acc[_na].setAttribute('filtro','nover');
				}
			}
			
			_segs=document.querySelectorAll('#contenidoextenso #seguimientos .fila.seguimiento');
			for(_ns in _segs){
				if(typeof _segs[_ns] != 'object'){continue;}
				if(_idusu=='NO'){_segs[_ns].removeAttribute('filtro');continue;}
				//_segs[_ns].style.color='red';
				
				if(_segs[_ns].getAttribute('idresp')==_idusu){
					_segs[_ns].setAttribute('filtro','ver');
				}else{
					console.log(_segs[_ns].getAttribute('filtro'));
					if(_segs[_ns].getAttribute('filtro')==null){
						_segs[_ns].setAttribute('filtro','nover');
					}
				}			
			}
		
		}	
		
		
		function tecleaBusqueda(_this,_event){
			
			_val=document.querySelector('[name="busqueda"]').value;
						
			_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
			_hatch=_hatch.replace(/ /g, '');
			_hatch=_hatch.toLowerCase();
						
			_segs=document.querySelectorAll('#contenidoextenso #seguimientos .fila.seguimiento');
			for(_ns in _segs){
				if(typeof _segs[_ns] != 'object'){continue;}
				
				console.log(_hatch.length);
				if(_hatch.length<2){
					_segs[_ns].setAttribute('filtroB','ver');
					continue;
				}
				
				
				_st=_segs[_ns].querySelector('.contenido.descrip').innerHTML;
				_st+=_segs[_ns].querySelector('.contenido.nombre').innerHTML;
				_st+=_segs[_ns].querySelector('.contenido.idseg').innerHTML;
				_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_a').title;
				_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_b').title;
				
				_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
				_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
				_st=_st.replace(/ /g, '');
				_st=_st.toLowerCase();
				
				
				//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
				if(_st.indexOf(_hatch)>=0){
					_segs[_ns].setAttribute('filtroB','vera');
				}else{
					_segs[_ns].setAttribute('filtroB','nover');
					console.log('nover');
				}
				
				_acc=_segs[_ns].querySelectorAll('.accion');
				for(_na in _acc){
					if(typeof _acc[_na] != 'object'){continue;}
					
					_st=_acc[_na].querySelector('.nombre').innerHTML;
					_st+=_acc[_na].title;
					
					_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
					_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
					_st=_st.replace(/ /g, '');
					_st=_st.toLowerCase();
						
					//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
					if(_st.indexOf(_hatch)>=0){
						_segs[_ns].setAttribute('filtroB','ver');
						_acc[_na].setAttribute('filtroB','ver');
					}else{
						_acc[_na].setAttribute('filtroB','nover');
					}					
				}		
			}
		}
		
		function actualizarCandidatosAccion(_this,_event){
			
			_hatch=_this.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
			_hatch=_hatch.replace(/ /g, '');
			_hatch=_hatch.toLowerCase();
			
			
			
			_items=document.querySelectorAll('#accion #candidatos #listado div');
			for(_ni in _items){
				if(typeof(_items[_ni]) != 'object'){continue;}
				
				if(_hatch==''){
					_items[_ni].setAttribute('selecto','no');
				}else{
					if(_items[_ni].getAttribute('hatch').indexOf(_hatch)>=0){
						_items[_ni].setAttribute('selecto','si');
					}else{
						_items[_ni].setAttribute('selecto','no');
					}
				}
			}
		}
		
		function cargarCandidatoAccion(_this){
			document.querySelector('#accion input[name="nombre"]').value=_this.innerHTML;
			_items=document.querySelectorAll('#accion #candidatos #listado div');
			for(_ni in _items){
				if(typeof(_items[_ni]) != 'object'){continue;}
				_items[_ni].setAttribute('selecto','no');				
			}
		}
		
    </script>

<script type='text/javascript'>

	///funciones para guardar archivos

	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#contenedorlienzo').style.backgroundColor='lightblue';
		document.querySelector('#contenedorlienzo > label').style.display='block';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#contenedorlienzo').removeAttribute('style');
		document.querySelector('#contenedorlienzo > label').removeAttribute('style');
	}
	
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
	function cargarCmp(_this){
		
		var files = _this.files;
		if(document.querySelector('#accion input[name="idacc"]').value<1){
			alert('error al enviar archivos');
			return;
		}				
		for (i = 0; i < files.length; i++) {
	    	_nFile++;
	    	console.log(files[i]);
			var parametros = new FormData();
			parametros.append('upload',files[i]);
			parametros.append('nfile',_nFile);
			
			parametros.append('idacc',document.querySelector('#accion input[name="idacc"]').value);
			
			var _nombre=files[i].name;
			_upF=document.createElement('p');
			_upF.setAttribute('nf',_nFile);
			_upF.setAttribute('class',"archivo");
			_upF.setAttribute('size',Math.round(files[i].size/1000));
			_upF.innerHTML=files[i].name;
			document.querySelector('#listadosubiendo').appendChild(_upF);
			
			_nn=_nFile;
			xhr[_nn] = new XMLHttpRequest();
			xhr[_nn].open('POST', './SEG/SEG_ed_guarda_adjunto.php', true);
			xhr[_nn].upload.li=_upF;
			xhr[_nn].upload.addEventListener("progress", updateProgress, false);
			
			
			xhr[_nn].onreadystatechange = function(evt){
				//console.log(evt);
				
				if(evt.explicitOriginalTarget.readyState==4){
					var _res = $.parseJSON(evt.explicitOriginalTarget.response);
					//console.log(_res);

					if(_res.res=='exito'){							
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.parentNode.removeChild(_file);							
						anadirAdjunto(_res.data.adjunto);
					}else{
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.innerHTML+=' ERROR';
						_file.style.color='red';
					}
					//cargaTodo();
					//limpiarcargando(_nombre);
				
				}
				
			}
			xhr[_nn].send(parametros);				
		    
		}			
	}
	
	function updateProgress(evt) {
	  if (evt.lengthComputable) {
	    var percentComplete = 100 * evt.loaded / evt.total;		   
	    this.li.style.width=Math.round(percentComplete)+"%";
	  } else {
	    // Unable to compute progress information since the total size is unknown
	  }
	}
	
	function eliminaAdjunto(_this,_event){
		_event.preventDefault();
		_event.stopPropagation();
		
		_tx=_this.parentNode.querySelector('.epigrafe').innerHTML;
		if(!confirm('¿Borramos este adjunto ('+_tx+')?.. ¿Segure?')){return;}
			
		_parametros = {
            'panid': _PanId,
            'idadj':_this.parentNode.getAttribute('idadj'),
            'idacc':document.querySelector('form#accion input[name="idacc"]').value
        };
        
        $.ajax({
            url:   './SEG/SEG_ed_borrar_adjunto.php',
            type:  'post',
            data: _parametros,
            error: function (response){alert('error al intentar contatar el servidor');},
            success:  function (response){
            	
                var _res = $.parseJSON(response);
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
                
                _ele=document.querySelector('form#accion #adjuntos .adjunto[idadj="'+_res.data.idadj+'"]');
                _ele.parentNode.removeChild(_ele);
            }
        });    
	}
			
</script>
</body>
