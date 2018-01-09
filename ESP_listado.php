<?php
/**
* ESP_listado.php
*
 * Esta aplicación constrituye el módulo principal para seguimento de especificaciones de proyecto.  
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	especificaciones
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2017 TReCC SA
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
$starttime = microtime(true);//medicion de rendimiento lamp
$mc=$starttime;//medicion de rendimiento lamp
$mcA[]=$mc;
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
//include ('./comunicaciones_consulta.php');//carga las funciones de consulta a la base de datos.
include ('./registrousuario.php');//buscar el usuario activo.
$UsuarioI = $_SESSION['panelcontrol'] -> USUARIO;
if ($UsuarioI == "") {header('Location: ./login.php');
}


$mc=microtime(true)-$mc;//medicion de rendimiento lamp
$mT=microtime(true);
$mcA[]=$mc;

$HabilitadoEdicion='no'; //por defecto no se permite la edicion hasta verificar el acceso del usuario para este modulo

foreach($Usuario['Acc'] as $g => $nivel){
	if($nivel=='editor'||$nivel=='administrador'){
		$HabilitadoEdicion='si';
	}elseif($nivel=='relevador'){
		header('location: ./inicio.php');
	}elseif($nivel=='visitante'||$nivel=='auditor'){
		$HabilitadoEdicion='no';
	}
}

$Pase = $_SESSION['panelcontrol']->PASE;
$Consultaconfig = mysql("$Base", "SELECT * FROM configuracion WHERE id_p_paneles_id_nombre='$PanelI'");
echo mysql_error();
global $config;
$config = mysql_fetch_assoc($Consultaconfig);
//print_r($config);
$Tabla = "comunicaciones";
$Base = $_SESSION['panelcontrol']->DATABASE_NAME;

$mc=microtime(true)-$mc;//medicion de rendimiento lamp
$mcA[]=$mT-microtime(true);
$mT=microtime(true);

$query="
SELECT 
`grupos`.`id`,
`grupos`.`nombre`,
`grupos`.`codigo`,
`grupos`.`orden`,
`grupos`.`responsable`,
`grupos`.`n_id_local`,
`grupos`.`tipo`,
`grupos`.`descripcion`,
    `grupos`.`zz_AUTOPANEL`
FROM `paneles`.`grupos`
WHERE zz_AUTOPANEL='".$PanelI."'
";
//echo $query;
$res=mysql_query($query,$Conec1);
echo mysql_error($Conec1);
while($row=mysql_fetch_assoc($res)){
	
	foreach($row as $k => $v){
		$Grupos[$row['id']][$k]=utf8_encode($v);
	}
}


	
//$ConUsu = mysql("usuarios", "SELECT * FROM usuarios WHERE id=$UsuarioI ORDER BY id DESC",$_SESSION['panelcontrol']->Conec1);
//$UsuarioN = mysql_result($ConUsu,0,'Nombre');	
	
	$Hoy_a = date("Y");
	$Hoy_m = date("m");	
	$Hoy_d = date("d");	
	$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;
	
	$grupocampo = $_GET[grupocampo];
	
	if($_POST['sentido']=='entrantes'){$CONTRASENTIDO='salientes';}
	elseif($_POST['sentido']=='salientes'){$CONTRASENTIDO='entrantes';}
	else{$CONTRASENTIDO='todas';}

//echo "<pre>";print_r($_SESSION['preferencias']);echo "</pre>";


insertarmenu();;

$VarD=array();
//$VarD= variablesDisponibles();// consulta las variables que tienen al menos una comunicacion coincidente.
?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/objetoscomunes.css">	
	<link rel="stylesheet" type="text/css" href="./css/ESP.css">	<link rel="stylesheet" type="text/css" href="./css/ESP_listado2.css">
	
	<?php 
	include("./includes/meta.php");
	?>
	<!---<link href='http://fonts.googleapis.com/css?family=Ropa+Sans' rel='stylesheet' type='text/css'>-->

	<style type="text/css">

	
	</style>
	
</head>
<body>
	
	<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>

	<div id="pageborde">
		<div id="page">
			<?php
			echo "<h1>Especificaciones y exigencias contractuales</h1>";			
			//echo "<p><a class='botonmenu' href='./comunicacionesreporte.php?tabla=comunicaciones'>ver modo reporte</a></p>"			
			?>					
			
			<div id='modelos'>
				<div 
					class='item' 
					idit='nn' 
					draggable="true" 
					ondragstart="drag(event);bloquearhijos(event,this);" 
					ondragleave="limpiarAllowFile()"
					ondragover="allowDropFile(event,this)"
					ondrop='dropFile(event,this)'
				>
					<h3 onmouseout='desaltar(this)' onmouseover='resaltar(this)' onclick='editarI(this)'>titulo</h3>
					<p onmouseout='desaltar(this)' onmouseover='resaltar(this)' onclick='editarI(this)'>descipcion</p>
					<div class='documentos'>
					</div>
					<div 
						class='hijos'  
						ondrop="drop(event,this)" 
						ondragover="allowDrop(event,this)" 
						ondragleave="limpiarAllow()" 
					></div>
				</div>
			</div>
			
			<div id="archivos">
				
				<form action='' enctype='multipart/form-data' method='post' id='uploader' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>
					<div id='contenedorlienzo'>									
						<div id='upload'>
							<label>Arraste todos los archivos aquí.</label>
							<input multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'></label>
						</div>
					</div>
				</form>
				<div id="listadosubiendo">
				</div>
				<div id="listadoaordenar">
				</div>
					
				<div id="eliminar"
					ondragover="allowDropFile(event,this)"
					ondragleave="limpiarAllowFile()"
					ondrop='dropTacho(event,this)'
				>
					<br>X
					<span>tacho de basura</span>
				</div>		
			</div>	
			
								
			<div id="contenidoextenso" idit='0'>
				<a id='botonanadir' onclick='anadirItem()'>añadir ítem</a>
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
	
	<form id="editoritem" onsubmit="guardarI(event,this)">
		<label>Título</label>
		<input name='titulo'>
		<input name='id' type='hidden'>
		<label>Descripcion</label>
		<textarea name='descripcion'></textarea>
		<a id='botoncierra' onclick='cerrar(this)'>cerrar</a>
		<input type='submit' value='guardar'>
		<a id='botonelimina' onclick='eliminarI(event,this)'>eliminar</a>
	</form>
	<script type='text/javascript'>
			
			
		var _avanceCod;	  
		
		
		//variables de filtro
		var _FilV4='<?php echo $grupoa;?>';
		var _FilV5='<?php echo $grupob;?>';
		
		var _NroOrden=0;

				
	</script>

	<script type='text/javascript'>
	///funciones para cargar información base
		var _Items=Array();
		var _Orden=Array();
		
		function cargaBase(){
			document.querySelector('#contenidoextenso > .hijos').innerHTML='';			
			document.querySelector('#listadosubiendo').innerHTML='';
			document.querySelector('#listadoaordenar').innerHTML='';
			var _parametros = {};
			$.ajax({
				url:   'ESP/ESP_consulta_esp.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
					console.log(_res);
					if(_res.res=='exito'){		
						_Items=_res.data.items;
						_Orden=_res.data.orden;
						generarItemsHTML();
						
						generarArchivosHTML();
					}else{
						alert('error dsfg');
					}
				}
			})	
		}
		
		cargaBase();
		
		function generarArchivosHTML(){
			for(_na in _Items[0].archivos){
				_dat=_Items[0].archivos[_na];
				_aaa=document.createElement('a');
				_aaa.innerHTML=_dat.nombre;
				_aaa.setAttribute('href',_dat.FI_documento);
				_aaa.setAttribute('download',_dat.nombre);
				_aaa.setAttribute('draggable',"true");
				_aaa.setAttribute('ondragstart',"dragFile(event)");
				_aaa.setAttribute('idfi',_dat.id);
				_aaa.setAttribute('class','archivo');
				
				document.getElementById('listadoaordenar').appendChild(_aaa);
			}			
		}
		
		function generarItemsHTML(){
			//genera un elemento html por cada instancia en el array _Items
			for(_nO in _Orden.items){
				_ni=_Orden.items[_nO];
				
				_dat=_Items[_ni];
				_clon=document.querySelector('#modelos .item').cloneNode(true);
				
				_clon.setAttribute('idit',_dat.id);
				_clon.querySelector('h3').innerHTML=_dat.titulo;
				_clon.querySelector('p').innerHTML=_dat.descripcion;
				_clon.setAttribute('nivel',"1");
				
				for(_na in _dat['archivos']){
					_dar=_dat['archivos'][_na];
					_aa=document.createElement('a');
					
					_aa.innerHTML=_dar.nombre;
					_aa.setAttribute('href',_dar.FI_documento);
					_aa.setAttribute('download',_dar.nombre);
					_aa.setAttribute('draggable',"true");
					_aa.setAttribute('ondragstart',"dragFile(event)");
					_aa.setAttribute('idfi',_dar.id);
					_aa.setAttribute('class','archivo');
					_clon.querySelector('.documentos').appendChild(_aa);
				}
				
				document.querySelector('#contenidoextenso > .hijos').appendChild(_clon);
			}
			  
			//anida los itmes genreados unos dentro de otros
			for(_nO in _Orden.items){
				_ni=_Orden.items[_nO];
				_el=document.querySelector('#contenidoextenso > .hijos > .item[idit="'+_Items[_ni].id+'"]');
				
				if(_Items[_ni].id_p_ESPitems_anidado!='0'){
					//alert(_Items[_ni].id_p_ESPitems_anidado);
					_dest=document.querySelector('#contenidoextenso > .hijos .item[idit="'+_Items[_ni].id_p_ESPitems_anidado+'"] > .hijos');
					_niv=_dest.parentNode.getAttribute('nivel');
					_niv++;
					_el.setAttribute('nivel',_niv.toString());
					_dest.appendChild(_el);
				}
			}
				
			_itemscargados=document.querySelectorAll('#contenidoextenso > .hijos .item');
			
			for(_nni in _itemscargados){
				if(typeof _itemscargados[_nni]=='object'){
					_esp=document.createElement('div');				
					_esp.setAttribute('class','medio');
					_esp.innerHTML='<div class="submedio"></div>';
					_esp.setAttribute('ondragover',"allowDrop(event,this);resaltaHijos(event,this)");
					_esp.setAttribute('ondragleave',"desaltaHijos(this)");
					_esp.setAttribute('ondrop',"drop(event,this)");  
					_itemscargados[_nni].parentNode.insertBefore(_esp, _itemscargados[_nni]);
				}
			}
		}
		
	
	</script>
	
	<script type='text/javascript'>
	///funciones para editar y crear items
	
		function resaltar(_this){
			//realta el div del item al que pertenese un título o una descripcion
			
			_dests=document.querySelectorAll('[resaltado="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('resaltado');
				}
			}
			_this.parentNode.setAttribute('resaltado','si');
			
		}
		function desaltar(_this){
			//realta el div del item al que pertenese un título o una descripcion
			_dests=document.querySelectorAll('[resaltado="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('resaltado');
				}
			}
			
		}
		function editarI(_this){				
			//abre el formulario para edittar item
			_idit=_this.parentNode.getAttribute('idit');
			_form=document.querySelector('#editoritem');
			_form.style.display='block';
			_form.querySelector('input[name="titulo"]').value=_Items[_idit].titulo;
			_form.querySelector('input[name="id"]').value=_Items[_idit].id;
			_form.querySelector('[name="descripcion"]').value=_Items[_idit].descripcion;
		}
		
		
		function cerrar(_this){
			//cierra el formulario que lo contiene
			_this.parentNode.style.display='none';
		}
		
		function eliminarI(_event,_this){
			if (confirm("¿Eliminar item y sus archivos asociados? \n (los ítems anidados quedarán en la raiz)")==true){
				
				_event.preventDefault();
				
				var _this=_this;
				
				var _parametros = {
					"id": _this.parentNode.querySelector('input[name="id"]').value,
					"accion": "borrar",
					"tipo": "item"
				};
				$.ajax({
					url:   './ESP/ESP_ed_borrar_item.php',
					type:  'post',
					data: _parametros,
					success:  function (response){
						var _res = $.parseJSON(response);
							console.log(_res);
						if(_res.res=='exito'){	
							cerrar(_this);
							cargaBase();
						}else{
							alert('error asfffgh');
						}
					}
				});
				//envía los datos para editar el ítem
				
			}
		}
		
		
		
		function guardarI(_event,_this){
			_event.preventDefault();
			console.log(_this);
			var _this=_this;
			var _parametros = {
				"id": _this.querySelector('input[name="id"]').value,
				"titulo": _this.querySelector('input[name="titulo"]').value,
				"descripcion": _this.querySelector('[name="descripcion"]').value
			};
			$.ajax({
				url:   './ESP/ESP_ed_cambiar_item.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
						console.log(_res);
					if(_res.res=='exito'){	
						cerrar(_this.querySelector('#botoncierra'));
						cargaBase();
					}else{
						alert('error asdfdasf');
					}
				}
			});
			//envía los datos para editar el ítem
			
		}
		
		function anadirItem(){
			
			var _parametros = {};
			$.ajax({
				url:   'ESP/ESP_ed_crear_item.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
					console.log(_res);
					if(_res.res=='exito'){	
						cargaBase();
					}else{
						alert('error asdfdasf');
					}
				}
			})	
		}
		
		
	</script>	
	
	
	
	<script type='text/javascript'>
		///funciones para gestionar drop en el tacho
		function dropTacho(_event,_this){
			
			_event.stopPropagation();
    		_event.preventDefault();    		
    		
    		limpiarAllowFile();
    		
    		if(JSON.parse(_event.dataTransfer.getData("text")).tipo=='archivo'){
    		
    			if(confirm('¿Confirma que quiere eliminar el archivo del panel?')==true){
    				
    				_parametros={
				    	"idfi":JSON.parse(_event.dataTransfer.getData("text")).id,
				    	"tipo":JSON.parse(_event.dataTransfer.getData("text")).tipo,
				    	"accion":'borrar'
				    };
				    
			 		$.ajax({
						url:   './ESP/ESP_ed_borrar_archivo.php',
						type:  'post',
						data: _parametros,
						success:  function (response){
							var _res = $.parseJSON(response);
								console.log(_res);
							if(_res.res=='exito'){	
								cargaBase();
							}else{
								alert('error asffsvrrfgh');
							}
						}
					});
    				
    			}
    			return;
    			
    		}else if(JSON.parse(_event.dataTransfer.getData("text")).tipo=='item'){
    			
    			if(confirm('¿Confirma que quiere eliminar el Item y todo su contenido?')==true)
	
    			}
    			return;
    			
    		}
    		
		    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
		    console.log(_DragData);
		    _el=document.querySelector('.archivo[idfi="'+_DragData+'"]');
		    
		    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idfi');
		    _em=_el.nextSibling;
		    _idit=_this.getAttribute('idit');
		    _ref=document.querySelector('.item[idit="'+_idit+'"] .documentos');
		    _ref.appendChild(_el);

		 }
		
		
	</script>
		
	<script type='text/javascript'>
		///funciones para gestionar drag y drop de archivos
			
		function dragFile(_event){
			//alert(_event.target.getAttribute('idit'));
			_event.stopPropagation();
    		_arr=Array();
			_arr={
				'id':_event.target.getAttribute('idfi'),
				'tipo':'archivo'
			};
			_arb = JSON.stringify(_arr);
    		_event.dataTransfer.setData("text", _arb);
		}
		
		function allowDropFile(_event,_this){
			//console.log(_this.parentNode.getAttribute('idit'));
			//console.log(_event.dataTransfer);
			if(_event.dataTransfer.items[0].kind=='file'){return;}
			if(JSON.parse(_event.dataTransfer.getData("text")).tipo!='archivo'){
				return;
			}
			
			limpiarAllowFile();
			_event.stopPropagation();
			_this.setAttribute('destinof','si');
			_event.preventDefault();
		}
		
		function limpiarAllowFile(){
			_dests=document.querySelectorAll('[destinof="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('destinof');
				}
			}
		}
		function dropFile(_event,_this){
			_event.stopPropagation();
    		_event.preventDefault();
    		    		
    		if(JSON.parse(_event.dataTransfer.getData("text")).tipo!='archivo'){
				return;
			}
    		
		    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
		    
		    console.log(_DragData);
		    
		    _el=document.querySelector('.archivo[idfi="'+_DragData+'"]');
		    
		    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idfi');
		    _em=_el.nextSibling;
		    _idit=_this.getAttribute('idit');
		    _ref=document.querySelector('.item[idit="'+_idit+'"] .documentos');
		    _ref.appendChild(_el);
		    		    			    
		    _parametros={
		    	"id":_DragData,
		    	"id_p_ESPitems":_idit
		    };
		    
	 		$.ajax({
				url:   './ESP/ESP_ed_localizar_archivo.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
						console.log(_res);
					if(_res.res=='exito'){	
						cargaBase();
					}else{
						alert('error asdfdsf');
					}
				}
			});
		    
		  }
	</script>
		
	<script type='text/javascript'>
		///funciones para gestjionar drag y drop de items
		
		function allowDrop(_event,_this){
			//console.log(_this.parentNode.getAttribute('idit'));
			
			console.log(_event.dataTransfer);
			
			if(JSON.parse(_event.dataTransfer.getData("text")).tipo!='item'){
				return;
			}
			
			limpiarAllow();
			
			_event.stopPropagation();
			_this.setAttribute('destino','si');
			_event.preventDefault();
			
		}
		
		function limpiarAllow(){
			_dests=document.querySelectorAll('[destino="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('destino');
				}
			}
		}
		
		function resaltaHijos(_event,_this){
			//realta el div del item al que pertenese un título o una descripcion
			//_this.style.backgroundColor='lightblue';
			_dests=document.querySelectorAll('[destino="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('destino');
				}
			}
			_this.setAttribute('destino','si');
			_event.stopPropagation();
			
		}
		function desaltaHijos(_this){
			//realta el div del item al que pertenese un título o una descripcion
			//_this.style.backgroundColor='#fff';
			_this.removeAttribute('destino');
			_this.parentNode.removeAttribute('destino');
		}
		
		
		function drag(_event){			
			//alert(_event.target.getAttribute('idit'));
			_arr=Array();
			_arr={
				'id':_event.target.getAttribute('idit'),
				'tipo':'item'
			};		
			_arb = JSON.stringify(_arr);

    		_event.dataTransfer.setData("text", _arb);
		}
		
		function bloquearhijos(_event,_this){			
			_idit=JSON.parse(_event.dataTransfer.getData("text")).id;
    		_negados = _this.querySelectorAll('.item[idit="'+_idit+'"] .hijos, .item[idit="'+_idit+'"] .medio');   
    		 		
    		for(_nn in _negados){
    			if(typeof _negados[_nn] == 'object'){
    				_negados[_nn].setAttribute('destino','negado');
    			}
    		}
		}
		
		function desbloquearhijos(_this){
    		_negados=document.querySelectorAll('[destino="negado"]');
    		for(_nn in _negados){
    			if(typeof _negados[_nn] == 'object'){
    				_negados[_nn].removeAttribute('destino');
    			}
    		}
		}	
		
			
		function drop(_event,_this){
			_event.stopPropagation();
    		_this.removeAttribute('style');
    		
    		_event.preventDefault();
    		
    		if(JSON.parse(_event.dataTransfer.getData("text")).tipo=='archivo'){
				return;
			}
    		
		    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
		    console.log('u');
		    console.log(_event.dataTransfer.getData("text"));
		    
		    _el=document.querySelector('.item[idit="'+_DragData+'"]');
		    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idit');
		    _em=_el.nextSibling;
		    
		    
		    _evitar='no';//evita destinos erronos por jerarquia.
		    if(_event.target.getAttribute('class')=='medio'){
		    	_tar=_event.target;
		    	
		    	_dest=_tar.parentNode;
		    					    
			    _dest.insertBefore(_el,_tar.nextSibling);
			    _dest.insertBefore(_em,_el.nextSibling);
			    
		    }else if(_event.target.getAttribute('class')=='hijos'){
		    	_dest=_event.target;
			    _dest.appendChild(_el);
			    _dest.appendChild(_em);
		    	
		    	
		    }else{
		    	alert('destino inesperado');
		    	return;		    	
		    }
		    
		    _niv=_dest.parentNode.getAttribute('nivel');
		    _niv++;
		    _el.setAttribute('nivel',_niv.toString());
		    		    
		    _NuevoIdIt=_dest.parentNode.getAttribute('idit');
		    
		    _enviejo=document.querySelectorAll('[idit="'+_ViejoIdIt+'"] > .hijos > .item');
		    _serieviejo='';
		    for(_ni in _enviejo){
		    	if(typeof _enviejo[_ni]=='object'){
		    		_serieviejo+=_enviejo[_ni].getAttribute('idit')+',';
		    	}
		    }
		    
		    console.log(_NuevoIdIt);
		    _ennuevo=document.querySelectorAll('[idit="'+_NuevoIdIt+'"] > .hijos > .item');
		    _serienuevo='';
		    for(_ni in _ennuevo){
		    	console.log(_ennuevo[_ni]);
		    	if(typeof _ennuevo[_ni]=='object'){
		    		_serienuevo+=_ennuevo[_ni].getAttribute('idit')+',';
		    	}
		    }
		   
		    _parametros={
		    	"id":_DragData,
		    	"id_p_ESPitems_anidado":_NuevoIdIt,
		    	"viejoAnidado":_ViejoIdIt,
		    	"viejoAserie":_serieviejo,
		    	"nuevoAnidado":_NuevoIdIt,
		    	"nuevoAserie":_serienuevo
		    };
		    
	 		$.ajax({
				url:   './ESP/ESP_ed_anidar_item.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
						console.log(_res);
					if(_res.res=='exito'){	
						cargaBase();
					}else{
						alert('error asfffgh');
					}
				}
			});
			//envía los datos para editar el ítem
		}
		
	
		
	</script>
	
	<script type='text/javascript'>
	///funciones para guardar archivos
	
		function resDrFile(_event){
			//console.log(_event);
			document.querySelector('#archivos #contenedorlienzo').style.backgroundColor='lightblue';
		}	
		
		function desDrFile(_event){
			//console.log(_event);
			document.querySelector('#archivos #contenedorlienzo').removeAttribute('style');
		}
		
		var _nFile=0;
		
		var xhr=Array();
		var inter=Array();
		function cargarCmp(_this){
			
			var files = _this.files;
					
			for (i = 0; i < files.length; i++) {
		    	_nFile++;
		    	console.log(files[i]);
				var parametros = new FormData();
				parametros.append('upload',files[i]);
				parametros.append('nfile',_nFile);
				
				var _nombre=files[i].name;
				_upF=document.createElement('a');
				_upF.setAttribute('nf',_nFile);
				_upF.setAttribute('class',"archivo");
				_upF.setAttribute('size',Math.round(files[i].size/1000));
				_upF.innerHTML=files[i].name;
				document.querySelector('#listadosubiendo').appendChild(_upF);
				
				_nn=_nFile;
				xhr[_nn] = new XMLHttpRequest();
				xhr[_nn].open('POST', './ESP/ESP_ed_guarda_archivo.php', true);
				xhr[_nn].upload.li=_upF;
				xhr[_nn].upload.addEventListener("progress", updateProgress, false);
				
				
				xhr[_nn].onreadystatechange = function(evt){
					//console.log(evt);
					
					if(evt.explicitOriginalTarget.readyState==4){
						var _res = $.parseJSON(evt.explicitOriginalTarget.response);
						//console.log(_res);
						
						alert('terminó '+_res.data.nf);
						
						if(_res.res=='exito'){							
							_file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');								
							document.querySelector('#listadoaordenar').appendChild(_file);
							_file.setAttribute('href',_res.data.ruta);
							_file.setAttribute('download',_file.innerHTML);
							_file.setAttribute('draggable',"true");
							_file.setAttribute('ondragstart',"dragFile(event)");
							_file.setAttribute('idfi',_res.data.nid);
						}else{
							_file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
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
				
	</script>
	

	<script type='text/javascript'>
		function toogle(_elem){
		    _nombre=_elem.parentNode.parentNode.getAttribute('class');
	
		    elementos = document.getElementsByName(_nombre);
		    for (x=0;x<elementos.length;x++){			
				elementos[x].removeAttribute('checked');
			}
		    _elem.previousSibling.setAttribute('checked','checked');		
		}
	</script>
	
	<script type="text/javascript">	
		//carga el formulario para editar múltiple localizaciones simultáneamente.
		
		var _seleccionDOCSid = new Array();
		var _ultimamarca='';
	</script>

</body>