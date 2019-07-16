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
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}

$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'si',
'auditor'=>'no',
'visitante'=>'no'
);

$Hoy_a = date("Y");
$Hoy_m = date("m");	
$Hoy_d = date("d");	
$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;



$colores['base'][] = "#8258FA";
$colores['fondo'][] = "#D0A9F5";
$colores['base'][] = "#00BFFF";
$colores['fondo'][] = "#A9F5F2";
$colores['base'][] = "#80FF00";
$colores['fondo'][] = "#D0F5A9";
$colores['base'][] = "#DF013A";
$colores['fondo'][] = "#F7819F";
$colores['base'][] = "#FFBF00";
$colores['fondo'][] = "#F7D358";
$coloresn = 0;

$HabilitadoEdicion='si';

?>

<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/SEG.css">
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
		width:auto;
		line-height: 15px;
	}

	.fila  h4{
		text-decoration: underline;
	}
	
	.fila  h4 > span{
		font-size:70%;
		font-weight:normal;
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
		right:2px;
		top:2px;
		text-align:center;
		width:120px;
		border: 1px solid #000;
		width: 170px;
		line-height: 10px;
	}
	</style>
    <?php include("./includes/meta.php"); ?>
    
    
	<style type="text/css" id='estilomini'>
	
		.fila > .id_p_grupos_tipo_a{
			top:0px;
		}
		.fila > .id_p_grupos_tipo_b{
			top:16px;
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

<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>	

<?php  insertarmenu();	//en comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		

        <h1>Gestión de Seguimiento</h1>	
        <h2>modo resumen</h2>		
        <div class='botonerainicial'>	
            <a class='botonmenu' href="./SEG_listado.php">ver modo gestion</a> - 
            <a class='botonmenu' href="./SEG_calendario.php">ver modo calendario</a> -             
            <a class='botonmenu' onclick='cambiarvista()'>solo titulos</a>
        </div>
       	

		<div id="contenidoextenso">

        </div>	
                

    </div>
    </div>

<script LANGUAGE="javascript">
    var _PanId = '<?php echo $PanelI;?>';
    var _HabilitadoEdicion = '<?php echo $HabilitadoEdicion;?>';
	
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
	            var _res = $.parseJSON(response);
	            console.log(_res);
	            for(_nm in _res.mg){alert(_res.mg[_nm]);}
	            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	            
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
	                var _res = $.parseJSON(response);
	                for(_nm in _res.mg){alert(_res.mg[_nm]);}
	                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
	                
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
	
</script>

</body>
