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
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.

$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){
	//sin panel definido en sesion o en url envía al selector de paneles
	header('location: ./PAN_listado.php');
}

$HabilitadoEdicion='si';
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
	
	<link rel="stylesheet" type="text/css" href="./SEG/css/SEG.css?v=<?php echo time();?>">
	
	
	
	<style type="text/css">
		#modocalendario{
			display:none;
		}
		
		#coladesubidas{
			position:fixed;
			bottom:0px;
			right:0px;
			background-color:#fff;
			max-width:90px;
			min-width: 5px;
			min-height: 5px;
			z-index:5000;
		}
		.archivo{
		  	border: 1px solid #08afd9;
			margin: 1px;
			color: #444;
			margin-top:12px;
		}
		
		.archivo img{
			margin: 1px;
			vertical-align:middle;
		}
		
		.archivo #nom{
			top:0px;
			left:0px;
			position:absolute;
			margin:1px;
		}
		
		#coladesubidas .archivo{
			position:relative;
		  	transition: right 4s, bottom 4s;
		  	background-color:#fff;
		  	display: block;
		}
			
		#coladesubidas .archivo img{
			width:12px;
			position:relative;
		}
		
		#coladesubidas .archivo #nom{
			display:none;
			position:relative;
			
		}
		#coladesubidas .archivo:hover span#nom{
			display:block;
			position:absolute;
			left:-150px;
			top:6px;
			width:150px;
			text-align:right;
			background-color:lightblue;
		}
		
		.archivo #barra{
			background-color:#ff944d;
			border-left:1px solid #ff6600; 
			display:block;
			position:absolute;
			z-index:1;
			height:100%;
			max-width: calc(100% - 1px);
		}
		
		.archivo div, .archivo span, .archivo img{
			z-index:2;
			position:relative;
		}
		.archivo .cargando{
			position:relative;
			top:-14px;
			left:0px;
			display:block;
			width:70px;
		}
		
		#coladesubidas .archivo .cargando{
			top:0px;
		}
		
		
		.archivo .cargando img{
			width: 11px;
		}
		
		.archivo .cargando #val{
			font-size:10px;
		}
		.archivo  #nom{
			width:calc(100% - 13px);
			height:15px;
			overflow:hidden;
		}
		
		#listadosubiendo > p.archivo{
			position:relative;
			margin-top:14px;
		}
		
		form#seguimiento{
			display:none;
		}
		form#seguimiento[estado='activo']{
			display:block;
		}
	</style>
	
	<link id='stlores' rel="stylesheet" type="text/css" href="./SEG/css/SEGlores.css">
	
		
</head>

<body onkeyup='tecleoGeneral(event)' onresize="actualizarCss();">
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  	

	<?php  insertarmenu();	// en ./PAN/PAN_comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		
				
        <h1>Gestión de Seguimientos</h1>
        <h2>modo gestión</h2> 		
        
        <div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
        
        <div class='botonerainicial' tipo='modos'>	
            <a class='botonmenu' href="./SEG_resumen.php">ver modo resumen</a> - <a class='botonmenu' href="./SEG_tabla.php">ver modo tabla</a> - 
            <a id='modocalendario' class='botonmenu' href="./SEG_calendario.php">ver modo calendario</a>
            <a class='botonmenu' onclick="filtrarUsuario()">filtrar por responsable</a> -
            <a class='botonmenu' onclick="asignarFiltroUsuario('YO')">filtrar mías</a> 
       </div>
       
        <div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="crearSeguimiento()" title='agregar seguimiento'><img src='./img/agregar.png' alt='agregar'> seguimiento</a>
		</div>
		
		<div id="contenidoextenso">
			
			<div class="fila encabezado">
				<div class="titulo idseg">id</div><!---
                ---><div class="titulo id_p_grupos_tipo_a">g1</label></div><!---
                ---><div class="titulo id_p_grupos_tipo_b">g2</label></div><!---					
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
    	
    	<a class='cerrar' onclick='cerrarFormularioSeguimiento()'>cerrar</a>
    	<a class='guardar' onclick='guardarSeguimiento()'>guarda</a>
    	<a class='eliminar' onclick='borrarSeguimiento()'>borrar</a>
    	<div class='datos'><label>Por: </label><span name='id_p_usuarios_autor'></div>
    	<div class='datos'><label>Respons: </label><select name='id_p_usuarios_responsable'><option value=''>- elegir -</option></select></div>
    	<div class='datos'><label>Id sega: </label><input disabled='disabled' name='idseg'></div>
    	<div class='campo'><label>Nombre: </label><input name='nombre'></div>
    	<div class='datos'><span class='seguimiento' name='estado'></span></div>
    	<div class='campo'><label>Tipo: </label><input name='tipo'></div>
    	<div class='campo levantado'>
    		<label>G1:<a href='javascript:void(0)' onclick='grupoForm("a")'><img alt='editar' src='./img/editar.png'></a></label>
    		<input type='hidden' name='id_p_grupos_tipo_a' value=''>
    		<input type='text' onkeyup='actualizaGrupoTx(this)' name='id_p_grupos_tipo_a_n' onfocus='opcionesSi(this)' value=''>
    		<div class='opciones' for='id_p_grupos_tipo_a'>
    			<a class='cerrar' onkeyup='actualizaGrupoTx(this)' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
    		</div>
    	</div>
    	<div class='campo levantado'>    		
		    <label>G2:<a href='javascript:void(0)' onclick='grupoForm("b")'><img alt='editar' src='./img/editar.png'></a></label>
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
    
    
    
    <form id='accion' class='central' modificado='no'>
    	<div id='testigomodificado'>*</div>
    	<a class='cerrar' onclick='deformularAcciones();'>cerrar</a>
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
    	<div id='vinculos'>
    		<div id='vincular' abierto='-1'>
    			<a onclick='togleAbierto(this.parentNode)'>vincular</a> 
    			<div id='tipos'> 
					<div id='tipocom' abierto='-1'>
						<a onclick='togleAbierto(this.parentNode);cargarVincularComs()'>Comunicación</a>
						<div id='listadoopcion' saliente='si' entrante='si'>
						    <div id='interruptores'>
						        <div id='saliente' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div> 
						        <div id='entrante' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gacod'></span></label>
						        <div id='ga' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gbcod'></span></label>
						        <div id='gb' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div>
						    </div>
						    <div id='comandoA'>
						    	<div id='encabezadoL'>
							        <span id='selerta'>comunicacion a vincular</span><br>
							        <span>núm: <input id='busca' type='text' onkeyup='filtrarLinks(event,this);'></span>
						        </div>
						        <div id='formLink' class='respuestar'>	
						            <span id='separador'></span>
						        </div>
						    </div>
					    </div>	
					</div>
				
					<div id='tipocnt' abierto='-1'>	
						<a onclick='togleAbierto(this.parentNode);cargarVincularCnts()'>Contratación</a>
						<div id='listadoopcion'>
							<div id='interruptores'>
						        <label>distinto a <span id='gacod'></span></label>
						        <div id='ga' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gbcod'></span></label>
						        <div id='gb' onclick='togleInt(this);'>
						            <img src='./img/check-sinborde.png'>
						        </div>
						    </div>
						    <a id='botonnuevo' onclick='crearContratacionLinkeada()'><img src='./img/agregar.png' alt='agregar'><span>Nueva Contratación</span></a>
						    <div id='comandoA'>
						    	<div id='encabezadoL'>
							        <span id='selerta'>contratación a vincular</span><br>
							        <span>nom: <input id='busca' type='text' onkeyup='filtrarLinksCnt(event,this);'></span>
						        </div>
						        <div id='formLink' class='respuestar'>	
						            <span id='separador'></span>
						        </div>
						    </div>
						</div>
					</div>  
				</div>  				
			</div>
    		<div id='COM'>
    			<h3>Comunicaciones</h3>
    			<div id='listado'></div>
    		</div>			
    		<div id='CNT'>
    			<h3>Contrataciones</h3>
    			<div id='listado'></div>
    		</div>
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
    
    <div id='coladesubidas'></div>	
    	
    <script type="text/javascript">
    	$( "form#accion input, form#accion textarea, form#accion select" ).change(function() {
    		$("form#accion").attr('modificado','si');
		});
    </script>
     
    <script type="text/javascript">
    
    	var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';
		
		var _UsuId = '';
		var _UsuarioAcc='';
		var _UsuarioTipo='';	
		var _HabilitadoEdicion='';	
		
		
		var _DatosGrupos=Array();
		var _DatosGruposCargado='no';
		
        var _DataSeguimientos=Array();
        var _DataSeguimientosCargado='no';
        
		var _DatosUsuarios=Array();
		
		var _AccionesFrecuentes=Array();
		
		var _selectos=0;
		var _IdSegEdit=''; //id del seguimiento en edicion
		var _IdAccEdit=''; //id de la accion en edicion
		
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
		
		
		var _nFile=0;	
		var xhr=Array();
		var inter=Array();
		
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
	
	<script type="text/javascript" src='./SEG/SEG_listado_consultas.js?v=<?php echo time();?>'></script>  	
	<script type="text/javascript" src='./SEG/SEG_listado_mostrar.js?v=<?php echo time();?>'></script> 
	<script type="text/javascript" src='./SEG/SEG_listado_interaccion.js?v=<?php echo time();?>'></script> 
	<script type="text/javascript" src='./SEG/SEG_listado_adjuntar.js?v=<?php echo time();?>'></script> 
	
	
	<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>
	
	
    <script type="text/javascript">
		cargaAccesos();		
        document.querySelector('#buscador input[name="busqueda"]').focus();       
	    consultarGrupos();	    
	    consultarFrecuentes();	    
	    
	    
	
		<?php if(!isset($_GET['idseg'])){$_GET['idseg']='';} ?>
		<?php if(!isset($_GET['idacc'])){$_GET['idacc']='';} ?>
		
		_Idseg='<?php echo $_GET['idseg'];?>'; 
		_Idacc='<?php echo $_GET['idacc'];?>';
			    
	    function llamarElementosIniciales(){
			if(_DatosUsuarios.delPanel==undefined){return;}
			if(_DatosGruposCargado=='no'){return;}
			if(_DataSeguimientosCargado=='no'){return;}
			if(_Idseg=='' && _Idacc==''){return;}
	  		formularSeguimiento(_Idseg,'');
	  		formularAccion(_Idacc,'');
	  		
	  		//evitar que se vuelva a disparar la carga autpmática.
	  		_Idacc='';
            _Idseg='';
		}
    </script>

</body>
