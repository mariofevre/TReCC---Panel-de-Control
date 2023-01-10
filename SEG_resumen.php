<?php
/**
* SEG_resumen.php
*
* genera la estructua HTML para cargar y visualizar seguimento y acciones activas.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Lista de seguimiento / tracking / segumiento
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 - 2023 TReCC SA
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
	
	#contenidoextenso{
    	border-top: 1px solid;
   }
    
	.fila{
		position:relative;
	}
	.fila .descripcion{
		font-size:12px;
		margin-left:20px;
	}
	.fila .responsable{
		font-size:12px;
		margin-left:25px;
		width:auto;
	}
	.fila .estado{
		font-size:12px;
		margin-left:25px;
		width:auto;
	}	
	.fila  h2{
		margin-top:15px;
		margin-bottom:5px;
		font-size:25px;
		text-decoration: underline;
		width: 75%;
	}
	
	.fila  h2 > span{
		font-size:70%;
		font-weight:normal;
	}
	
	.fila  h3{
		margin-top:15px;
		margin-left:25px;
		font-size:16px;
		text-decoration: underline;
	}
	
	.fila .acciones{
		margin-left:35px;
		width:calc(100% - 35px);
		line-height: 15px;
	}

	.fila  h4{
		text-decoration: underline;
	}
	
	.fila  h4 > span{
		font-size:70%;
		font-weight:normal;
	}
	.fila  h4 > #comentario{
		display:inline-block;
		margin-left:5px;
		font-weight:normal;
		vertical-align:center;
	}	
	.fila  h4 > #comentario img{
		height:12px;
		vertical-align:center;
	}
	
	.fila .accion{
		width:auto;
	}	
	
	.fila  h5{
		margin-top:10px;
		margin-left:25px;
		margin-bottom:0px;
	}
	
	.fila .accion .responsable{
		font-size:11px;
		margin:5px;
		margin-left:35px;
		margin-top:0px;
		width:auto;
	}
		
	.fila .accion .estado{
		font-size:11px;
		margin:5px;
		margin-left:35px;
		margin-top:0px;
		width:auto;
	}

	.accion.finalización.ocurrida >h4{
		display: inline-block;
		background-color:#ddd;
	}
	
	.accion.suspendida{
		color:#999;
	}
	
	.seguimiento{
		position:relative;
	} 
	
	.fila > .id_p_grupos_tipo_b{
		position:absolute;
		right:2px;
		top:-12px;
		text-align:center;
		width: 170px;
		border: 1px solid #000;
		line-height: 10px;
	}
	.fila > .id_p_grupos_tipo_a{
		position:absolute;
		right: 2px;
		top: 12px;
		text-align:center;
		width:120px;
		border: 1px solid #000;
		width: 170px;
		line-height: 10px;
	}
	
	.fila[name='finalización ocurrida']{
		display:none;
	}
	</style>

    
    
	<style type="text/css" id='estilomini'>
	
		.fila > .id_p_grupos_tipo_a{
			top:0px;
		}
		.fila > .id_p_grupos_tipo_b{
			top:23px;
		}
		.seguimiento > h2{
			margin-bottom:1px;
			margin-top:3px;
			width: 595px;
		}
		
		.seguimiento > .descripcion{
			display:none;
		}
		.seguimiento > .responsable{
			display:none;
		}
		.seguimiento > .estado{
			display:none;
		}
		.seguimiento > h3{
			display:none;
		}
		.seguimiento > .acciones > .accion > div{
			display:none;
		}
		.seguimiento > .acciones > .accion > h5{
			display:none;
		}
	</style>	
</head>
<body>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
    
	<?php  insertarmenu();	//en PAN_comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		

        <h1>Gestión de Seguimiento</h1>	
        <h2>modo resumen</h2>		
        <div class='botonerainicial'>	
            <a class='botonmenu' href="./SEG_listado.php">ver modo gestion</a> - 
            <!---<a class='botonmenu' href="./SEG_calendario.php">ver modo calendario</a> --->
            <a class='botonmenu' onclick='cambiarvista()' txsi='solo titulos' txno='todo el texto'>solo titulos</a> -
            <a class='botonmenu' id='filtroa' onclick='cambiarFiltroA()' estado='txsi' txsi='quitar activos' 		txno='mostrar activos'>quitar activos</a> -
            <a class='botonmenu' id='filtrob' onclick='cambiarFiltroB()' estado='txsi' txsi='quitar suspendidos' 	txno='mostrar suspendidos'>quitar suspendidos</a> -
            <a class='botonmenu' id='filtroc' onclick='cambiarFiltroC()' estado='txno' txsi='quitar cerrados' 		txno='mostrar cerrados'>mostrar cerrados</a> -
            <a class='botonmenu' id='orden'   onclick='cambiarOrden()'   estado='tx3' tx1='ordenar por responsable' 	tx2='ordenar por estado' tx3='ordenar por fecha' tx4='ordenar por prioridad' tx5='ordenar por ultima acción'>ordenar por prioridad</a>
        </div>
       	

		<div id="contenidoextenso">
		
        </div>	
                

    </div>
    </div>


	<script type="text/javascript">
		var _PanelI='<?php echo $PanelI;?>';
		var _PanId='<?php echo $PanelI;?>';
		var _UsuarioAcc='';
		var _UsuarioTipo='';	
		var _HabilitadoEdicion='';	
		
		var _DatosGrupos=Array();			
		var _DataSeguimientos=Array();
		var _DatosUsuarios=Array();
		var _IdSegEdit=''; //id del seguimiento en edicion
		var _IdAccEdit=''; //id de la accion en edicion
		var _Grupos=Array();
				
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
					 _res = PreprocesarRespuesta(response);
					
					_DataSeguimientos=_res.data;
					for(_ns in _res.data.seguimientosOrden){
						_idseg=_res.data.seguimientosOrden[_ns];
						_dat=_res.data.seguimientos[_idseg];
					
						_cfila=document.createElement('div');
						_cfila.setAttribute('class','fila '+_dat.estado);
						_cfila.setAttribute('name',_dat.estado);
						document.querySelector('#contenidoextenso').appendChild(_cfila);
		
						_ddd =document.createElement('div');
						_ddd.setAttribute('class','contenido id_p_grupos_tipo_a');
						_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_a].nombre;
						_cfila.appendChild(_ddd);
						
						_ddd =document.createElement('div');
						_ddd.setAttribute('class','contenido id_p_grupos_tipo_b');
						_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_b].nombre;
						_cfila.appendChild(_ddd);
						
						_aaa =document.createElement('div');
						_aaa.setAttribute('onclick','formularSeguimiento(this,event)');
						_aaa.setAttribute('idseg',_idseg);
						_aaa.setAttribute('class','seguimiento');
						_cfila.appendChild(_aaa);
						
						_ddd =document.createElement('h2');
						_ddd.innerHTML='<span>Seguimiento ('+_dat.id+'):</span>'+_dat.nombre;
						_aaa.appendChild(_ddd);
						
						_ddd =document.createElement('div');
						_ddd.setAttribute('class','descripcion');
						_ddd.innerHTML=_dat.info;
						_aaa.appendChild(_ddd);
						
						_ddd =document.createElement('h3');
						_ddd.innerHTML='Responsable';
						_aaa.appendChild(_ddd);	
						
						_ddd =document.createElement('div');
						_ddd.setAttribute('class','responsable');
						if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable] == undefined){
							_ddd.innerHTML='-';
						}else{	
							_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable].nombreusu;
						}
						_aaa.appendChild(_ddd);
						
						_ddd =document.createElement('h3');
						_ddd.innerHTML='Estado';
						_aaa.appendChild(_ddd);	
						
						_ddd =document.createElement('div');
						_ddd.setAttribute('class','estado');
						_ddd.innerHTML=_dat.estado+': '+_dat.ultimaabierta;
						_aaa.appendChild(_ddd);
		
						_ddd =document.createElement('h3');
						_ddd.innerHTML='Acciones';
						_aaa.appendChild(_ddd);	
						
						_acciones =document.createElement('div');
						_acciones.setAttribute('class','contenido acciones');
						_aaa.appendChild(_acciones);
						
						
						_dddt =document.createElement('div');
						_acciones.appendChild(_dddt);
									
						for(_na in _dat.accionesOrden){
						
							_idacc=_dat.accionesOrden[_na];
							_datacc=_dat.acciones[_idacc];
							
							_aaa =document.createElement('div');
							_aaa.setAttribute('class','filaitem '+_datacc.estado);
							_aaa.setAttribute('idacc',_idacc);                            
							_aaa.setAttribute('onclick','formularAccion(this,event)');
							_aaa.setAttribute('class','accion '+_datacc.estado);
							_aaa.title=_datacc.descripcion;
							_acciones.appendChild(_aaa);
							
							_ddd=document.createElement('h4');
							_ddd.innerHTML='<span>Accion ('+_datacc.id+'):</span> '+_datacc.nombre;
							_aaa.appendChild(_ddd);
							
							_com=document.createElement('div');
							_com.setAttribute('id','comentario');
							_ddd.appendChild(_com);
							if(_datacc.estado=='finalización ocurrida'){
								console.log('ooo');
								_com.innerHTML='completa <img src="./a_comunes/img/checkok.png">';
							}
							
							_ddd=document.createElement('div');
							_ddd.setAttribute('class','descripcion');
							_ddd.innerHTML=_datacc.descripcion;
							_aaa.appendChild(_ddd);                   
							
							_ddd =document.createElement('h5');
							_ddd.innerHTML='Responsable';
							_aaa.appendChild(_ddd);	
						
							_ddd =document.createElement('div');
							_ddd.setAttribute('class','responsable');
							if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable] == undefined){
								_ddd.innerHTML='sin responsable asignado-';
							}else{	
								_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable].nombreusu;
							}
							_aaa.appendChild(_ddd);
							
							_ddf=document.createElement('div');
							_ddf.setAttribute('class','filaitem '+_datacc.estado);
							_aaa.appendChild(_ddf);
							
							_ddr=document.createElement('div');
							_ddr.setAttribute('class','dato reclamo');
							_ddr.innerHTML=_datacc.reclamo;
							_aaa.appendChild(_ddr);
							
							_ddd =document.createElement('h5');
							_ddd.innerHTML='Estado';
							_aaa.appendChild(_ddd);
							
							_ddd=document.createElement('div');
							_ddd.setAttribute('class','estado');
							_ddd.innerHTML=_datacc.estado+': '+_datacc.fechacontrol;
							_aaa.appendChild(_ddd);
						}
					}
				}
			});
		}
		
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
						_res = PreprocesarRespuesta(response);
						
						_DatosUsuarios=_res.data.usuarios;   
						
						if(_Grupos[0]!=undefined){
							consultarListado(); 
						}
						 
					}
			   });
			}
			consultarUsuarios();
		
		
		var _Vista='normal';
		document.querySelector('#estilomini').disabled=true;
		function cambiarvista(){
			if(_Vista=='normal'){
				document.querySelector('#estilomini').disabled=false;
				_Vista='mini';
			}else if(_Vista=='mini'){
				document.querySelector('#estilomini').disabled=true;
				_Vista='normal';
			}
		}
		
		 function consultarGrupos(){
				var parametros = {
				};			
				$.ajax({
					data:  parametros,
					url:   './PAN/PAN_grupos_consulta.php',
					type:  'post',
					error:   function (response) {alert('error al contactar el servidor');},
					success:  function (response) {
						_res = PreprocesarRespuesta(response);
									
						_Grupos=_res.data.grupos;
						if(_DatosUsuarios.delPanel!=undefined){
							consultarListado(); 
						}
					}
				});
			}
	    consultarGrupos();
</script>	
	
	
	
	
<script type="text/javascript">
//formulario de filtros y orden	
	function cambiarFiltroA(){
		_input=document.querySelector('.botonerainicial #filtroa.botonmenu');
		_est=_input.getAttribute('estado');
		
		if(_est=='txsi'){
			_est='txno'
		}else if(_est=='txno'){
			_est='txsi'
		}
		_input.setAttribute('estado',_est);
		_tx=_input.getAttribute(_est);
		_input.innerHTML=_tx;
		
		_filas=document.querySelectorAll('div#contenidoextenso div.fila[name="seguimiento en curso"]');
		
		for(_fn in _filas){	
			if(typeof _filas[_fn] != 'object'){continue;}
			if(_est=='txsi'){
				_filas[_fn].style.display='block';
			}else{
				_filas[_fn].style.display='none';
			}
		}	
	}
	
	function cambiarFiltroB(){
		_input=document.querySelector('.botonerainicial #filtrob.botonmenu');
		_est=_input.getAttribute('estado');
		
		if(_est=='txsi'){
			_est='txno'
		}else if(_est=='txno'){
			_est='txsi'
		}
		_input.setAttribute('estado',_est);
		_tx=_input.getAttribute(_est);
		_input.innerHTML=_tx;
		
		_filas=document.querySelectorAll('div#contenidoextenso div.fila[name="seguimiento suspendido"]');
		
		for(_fn in _filas){	
			if(typeof _filas[_fn] != 'object'){continue;}
			if(_est=='txsi'){
				_filas[_fn].style.display='block';
			}else{
				_filas[_fn].style.display='none';
			}
		}	
	}
	
	function cambiarFiltroC(){
		_input=document.querySelector('.botonerainicial #filtroc.botonmenu');
		_est=_input.getAttribute('estado');
		
		if(_est=='txsi'){
			_est='txno'
		}else if(_est=='txno'){
			_est='txsi'
		}
		_input.setAttribute('estado',_est);
		_tx=_input.getAttribute(_est);
		_input.innerHTML=_tx;
		
		_filas=document.querySelectorAll('div#contenidoextenso div.fila[name="finalización ocurrida"]');
		
		for(_fn in _filas){	
			if(typeof _filas[_fn] != 'object'){continue;}
			if(_est=='txsi'){
				_filas[_fn].style.display='block';
			}else{
				_filas[_fn].style.display='none';
			}
		}	
	}	

	function cambiarOrden(){
		_input=document.querySelector('.botonerainicial #orden.botonmenu');
		_est=_input.getAttribute('estado');
		
		_nest=_est.substring(3,2);
		console.log(_nest);
		_nest++;
		if(_nest==6){
			_nest=1;
		}
		_est='tx'+_nest;
		
		_input.setAttribute('estado',_est);
		
		_tx=_input.getAttribute(_est);
		_input.innerHTML=_tx;
		
		_var={
			'1':'responsable',
			'2':'estado',
			'3':'fecha',
			'4':'prioridad',
			'5':'ultimaAcc'
		}
 		
		_orden=_DataSeguimientos['seguimientosOrden_'+_var[_nest]];
		
		_cont=document.querySelector('div#contenidoextenso');
		console.log(_orden);
		for(_no in _orden){
			_idseg=_orden[_no];
			_fila=document.querySelector('div#contenidoextenso div.fila > .seguimiento[idseg="'+_idseg+'"]').parentNode;
			_cont.appendChild(_fila);	
		}
		
	}	
	
</script>

</body>
