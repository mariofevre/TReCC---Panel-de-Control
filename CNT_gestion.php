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
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
if($UsuarioI==""){header('Location: ./login.php');}
$PanelI = $_SESSION['panelcontrol']->PANELI;

include ('./login_registrousuario.php');//buscar el usuario activo.
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
	
	<style type="text/css">
		#modocalendario{
			display:none;
		}
	</style>
	
	<link id='stlores' rel="stylesheet" type="text/css" href="./CNT/css/CNT.css?v=<?php echo time();?>">
	

</head>

<body onkeyup='tecleoGeneral(event)' onresize="actualizarCss();">
	
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>    	
	
	
	<?php  insertarmenu();	// en ./PAN/PAN_comunes.php	?>
		
		
	<div id="pageborde">
    <div id="page">		
				
        <h1>Gestión de Contrataciones</h1>
        <h2>modo gestión</h2> 		
        
        <div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
        
        <div class='botonerainicial' tipo='modos'>	
            <a class='botonmenu' href="./CNT_resumen.php">ver modo resumen</a> - <a class='botonmenu' href="./CNT_tabla.php">ver modo tabla</a> - 
            <a id='modocalendario' class='botonmenu' href="./CNT_calendario.php">ver modo calendario</a>
            <a class='botonmenu' onclick="filtrarUsuario()">filtrar por responsable</a> -
            <a class='botonmenu' onclick="asignarFiltroUsuario('YO')">filtrar mías</a> 
       </div>
       
        <div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="crearContratacion()" title='agregar contratacion'><img src='./a_comunes/img/agregar.png' alt='agregar'> contratacion</a>
		</div>
		
		<div id="contenidoextenso">
			
			<div class="fila encabezado">
				<div class="titulo idpag">id</div><!---
                ---><div class="titulo id_p_grupos_tipo_a">g1</div><!---
                ---><div class="titulo id_p_grupos_tipo_b">g2</div><!---								
                ---><div class="titulo nombre">nombre</div><!---
                ---><div class="titulo id_p_cntproveedores">proveedor</div><!---
                ---><div class="titulo pago">pago</div><!---
                ---><div class="titulo factura">factura</div><!---
                ---><div class="titulo conformidad">conformidad</div>
            </div>	
			
			<div id="contrataciones">					
           </div>	
        </div>
    </div>        
    </div>
    

    <form id='general' class='central'>
    	
    	
    	<a class='cerrar' onclick='this.parentNode.style.display="none";limpiarSeleccionContrataciones()'>cerrar</a>
    	<a class='guardar' onclick='guardarContratacion();guardarPago();'>guarda</a>
    	<a class='eliminar' onclick='borrarContratacion()'>borrar</a>
	    	
	    <div id='contratacion'>	
	    	<h2>Contratación</h2> 
	    	<div class='datos'><label>Por: </label><span name='id_p_usuarios_autor'></div>
	    	<div class='datos'><label>Respons:</label> <select name='id_p_usuarios_responsable'><option value=''>- elegir -</option></select></div>
	    	<div class='datos'><label>Id cnt:</label><input disabled='disabled' name='idcnt'></div>
	    	<div class='campo'><label>Contratación:</label> <input name='nombre'></div>
	    	<div class='datos'><span class='contratacion' name='estado'></span></div>
	    	<div class='campo'><label>Proveedor:</label>
	    		
	    		<input type='text' readonly='readonly' onkeyup='actualizaGrupoTx(this)' name='id_p_CNTproveedores_n' onfocus='opcionesSi(this)' value=''>
	    		<input type='hidden'  name='id_p_CNTproveedores' value=''>
	    		<a id='edi' onclick='formularProveedor(this.parentNode.querySelector("[name=\"id_p_CNTproveedores\"]").value)' alt='editar'  title='modificar Proveedor'><img src='./a_comunes/img/editar.png'></a>
	    		<a id='cre' onclick='crearProveedor()' alt='agregar' title='nuevo Proveedor'><img src='./a_comunes/img/agregar.png'></a>
	    		
	    		<div class='opciones' for='id_p_CNTproveedores' style="display:none;">
	    			<a class='cerrar' onkeyup='actualizaGrupoTx(this)' onclick='this.parentNode.style.display="none";'>x</a>
	    			<div id='activos'></div>
	    			<a id='mas' onclick='opcionesMas(this)'>mostrar más</a>
	    			<a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a>
	    			<div id='inactivos'></div>
	    		</div>
	    	</div>
	    	<br>
	    	<div class='campo levantado'>
	    		<label>Grupo Primario: <a href='javascript:void(0)' onclick='grupoForm("a")'><img alt='editar' src='./a_comunes/img/editar.png'></a></label>
	    		<input type='hidden' name='id_p_grupos_tipo_a' value=''>
	    		<input type='text' onkeyup='actualizaGrupoTx(this)' name='id_p_grupos_tipo_a_n' onfocus='opcionesSi(this)' value=''>
	    		<div class='opciones' for='id_p_grupos_tipo_a'  style="display:none;">
	    			<a class='cerrar' onkeyup='actualizaGrupoTx(this)' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
	    		</div>
	    	</div>
	    	<div class='campo levantado'>    		
			    <label>Grupo Secundario: <a href='javascript:void(0)' onclick='grupoForm("b")'><img alt='editar' src='./a_comunes/img/editar.png'></a></label>
			    <input type='hidden' name='id_p_grupos_tipo_b' value=''>
			    <input type='text' name='id_p_grupos_tipo_b_n' onfocus='opcionesSi(this)' value=''>
			    <div class='opciones' for='id_p_grupos_tipo_b' style="display:none;">
			    	<a class='cerrar' onclick='this.parentNode.style.display="none";'>x</a><div id='enpanel'></div><a id='mas' onclick='opcionesMas(this)'>mostrar más</a><a id='menos' onclick='opcionesMenos(this)'>mostrar menos</a><div id='fueradepanel'></div>
			    </div>
	   		</div>
	   		
	   		<div class='campo'>
		    	
		    	<label>Desde:</label> <input name='fecha' type='date' onchange='consistenciaFecha(this,event)'>
		    	<select name='fecha_tipo'>
		    			<option value='desconocida'></option>
		    			<option value='prevista'>previsto</option>
		    			<option value='efectiva'>activo</option>
		    	</select>
		    
		    	
	    		<label>Hasta:</label> <input name='fechacierre' type='date' onchange='consistenciaFecha(this,event)'>
	    		<select name='fechacierre_tipo'>
		    			<option value='desconocida'></option>
		    			<option value='prevista'>programado</option>
		    			<option value='efectiva'>ejecutado</option>
		    	</select>
	    	</div>
	    	
	    	<div class='campo'><label>Descripción: </label><br><textarea name='descripcion'></textarea></div>
	    	<div id='vinculos'>
    		<div id='vincular' abierto='-1'>
    			<a onclick='togleAbierto(this.parentNode)'>vincular</a> 
    			<div id='tipos'> 
					<div id='tipocom' abierto='-1'>
						<a onclick='togleAbierto(this.parentNode);cargarVincularComs()'>Comunicación</a>
						<div id='listadoopcion' saliente='si' entrante='si'>
						    <div id='interruptores'>
						        <div id='saliente' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
						        </div> 
						        <div id='entrante' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gacod'></span></label>
						        <div id='ga' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gbcod'></span></label>
						        <div id='gb' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
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
				
					<div id='tiposeg' abierto='-1'>	
						<a onclick='togleAbierto(this.parentNode);cargarVincularSegs()'>Acción</a>
						<div id='listadoopcion'>
							<div id='interruptores'>
						        <br><label>distinto a <span id='gacod'></span></label>
						        <div id='ga' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
						        </div>
						        <br><label>distinto a <span id='gbcod'></span></label>
						        <div id='gb' onclick='togleInt(this);'>
						            <img src='./a_comunes/img/check-sinborde.png'>
						        </div>
						    </div>
						    <div id='comandoA'>
						    	<div id='encabezadoL'>
							        <span id='selerta'>contratación a vincular</span><br>
							        <span>nom: <input id='busca' type='text' onkeyup='filtrarLinksSeg(event,this);'></span>
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
    		<div id='SEG'>
    			<h3>Acciones de Seguimiento</h3>
    			<div id='listado'></div>
    		</div>
    	</div>
	    </div>
	    
	    <div id='formpago'>
	    	<input type='hidden' name='idpag'>
	    	<a class='eliminar' onclick='borrarPago()'>borrar pago</a>
    		
    		
    		
    		<div>
    			<label>Pago:</label> <span id='pagoid'></span>
    			<label class='min'>Monto:</label> <input name='monto'>
    			 	
    			<label>Observaciones:</label> <input name='nombre'></span>
				<label class='min'>Concepto:</label>
				<select name='concepto'>
					<option value=''>- elegir -</option>
					<option value='total'>Total</option>
					<option value='anticipo'>Anticipo</option>
					<option value='saldo'>Saldo</option>
					<option value='cuota'>Cuota</option>
				</select>
			</div>
			
			<div id='conformidad'>
				<label>Conformidad:</label> <span id='statconf'>sin conformidad</span> 
				<input id='dar' type='button' value='Dar Conformidad' onclick='crearConformidad();'>
				<input id='ver' type='button' value='Historial'>
				<input id='revocar' type='button' value='Revocar Conformidad'>
				
			</div>	
			<div>
				<label  >Facturado: </label>
				<div>
					
					
					<input type='hidden' name='facturado' onchange='toglecheck(this)'>
					<input type='checkbox' for='facturado' onchange='toglecheck(this);togleAbierto(this.parentNode)'>
				
				 	<div class='tapable'>
						<label class='min'>Nº Factura:</label> <input name='num_factura'>
					</div>
				</div>
			</div>			
			<div><label>Pagado: </label>
				<select name='fechaejecucion_tipo' onchange='actualizaFechaEjecPago()'>
					<option value='desconocido'>Desconocido</option>
					<option value='previsto'>Previsto</option>
					<option value='efectivo'>Ocurrido</option>
					<option value='suspendido'>Suspendido</option>>
				</select>
				<label class='min'>fecha:</label> <input name='fechaejecucion' type='date'>
			</div>
			
    	</div>
    	
    	<div id='formotrospago'>

			<h3>Lista de pagos de esta contratación</h3>

	    	<div id="pagos">
	    		<table  style='border-collapse: collapse;'>
	    			<thead>
	    			<tr>
	    				<th>id</th>
	    				<th>nombre</th>
	    				<th>monto</th>
	    				<th>concepto</th>
	    				<th>conforme</th>
	    				<th>factura</th>
	    				<th>pagado</th>
	    			</tr>
	    			</thead>
	    			<tbody>
	    			<tr>
	    				<td></td><td></td><td></td><td></td>
	    			</tr>
	    			</tbody>	
	    		</table>
	    	</div>	
	    	<div class='botonerainicial' tipo='acciones'>	
	        	<a class='botonmenu' onclick="guardarContratacion();guardarPago();crearPago('encontratacion');" title='agregar pago'><img src='./a_comunes/img/agregar.png' alt='agregar'> pago a la contratacion</a>
			</div>			   		
    	</div>
    	
    	
    	
    </form>
 
 	<form id='conformidad'>
 		<h2>conformidades</h2> 
    	<div class='botonerainicial' tipo='acciones'>	
        	<a class='botonmenu' onclick="guardarContratacion();guardarPago();crearConformidad();" title='agregar nuevo estado de conformidad'><img src='./a_comunes/img/agregar.png' alt='agregar'> conformidad</a>
		</div>
		
    	<div id="conformidades"></div>
    	
    	<div id='formconformidad'>
    		<input name='idconf' type='hidden'>
    		<div><label>autor</label><input name='id_p_usuarios_id'></div>
    		<div><label>fecha</label><input name='fechau'></div>
    		<div><label>justificacion</label><input name='justificacion'></div>
    		<div><label>superada</label><input name='zz_superada'></div>
    	</div>    	
    </form>   	
    	
 	<form id='proveedor'>
 		
 		<a class='cerrar' onclick='this.parentNode.style.display="none";'>cerrar</a>
    	<a class='guardar' onclick='guardarProveedor()'>guarda</a>
    	<a class='eliminar' onclick='borrarProveedor()'>borrar</a>
    	
 		<input type='hidden' name='idprov'>
 		<div><label>empresa</label><input name='nombre'></div>
		<div><label>contacto</label><input name='contacto'></div>
		<div><label>cuit</label><input name='cuit'></div>
		<div><label>descripcion</label><textarea name='descripcion'></textarea></div>
		<div><label>telefonos</label><input name='telefonos'></div>
		<div><label>mail</label><input name='mail'></div>
		
		
	</form>
	
    <script type="text/javascript">
    	var _UsuId = '<?php echo $UsuarioI;?>';
       
       	var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';
		var _UsuarioAcc='<?php echo $UsuarioAcc;?>';
		var _UsuarioTipo='<?php echo $Usuario['perfil']['tipo'];?>';	
		var _HabilitadoEdicion='';	
		
		var _DatosGrupos=Array();
		
        
		var _DatosUsuarios=Array();
		var _IdCntEdit=''; //id del contratacion en edicion
		var _IdAccEdit=''; //id de la accion en edicion
		var  _Grupos=Array();
		
		var _PagoSelect;
		
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
		
		var _DataProveedores={
			'proveedores':{},
			'activos':{}
		};
		console.log(_DataProveedores);
		
		var _DataContrataciones={};
		var _DataPagos={};
		var _DataConformidades={};
		var _DataConformidadesCargado='no';
		
		<?php if(!isset($_GET['idcnt'])){$_GET['idcnt']='';} ?>
		<?php if(!isset($_GET['idpag'])){$_GET['idpag']='';} ?>
		
		_IdCnt='<?php echo $_GET['idcnt'];?>'; 
		_IdPag='<?php echo $_GET['idpag'];?>';

	</script> 	
	
	
	<script type="text/javascript" src='./CNT/CNT_gestion_consultas.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./CNT/CNT_gestion_mostrar.js?v=<?php echo time();?>'></script>
	<script type="text/javascript" src='./CNT/CNT_gestion_interaccion.js?v=<?php echo time();?>'></script>	
	<script type="text/javascript" src='./CNT/CNT_gestion_adjuntos.js?v=<?php echo time();?>'></script>		
	
	<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>
		
		
	<script type="text/javascript">		

		//actualizarCss();
    	
        cargaAccesos();
        document.querySelector('#buscador input[name="busqueda"]').focus();      
		consultarGrupos(); 

	</script>
</body>
