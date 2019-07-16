<?php 
/**
* SEG_consulta.php
*
* realiza consultas a la base de datos remitiendo la estructura de seguimientos y acciones en formato JSON.
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
ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');


$Log=array();
global $Log;
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['res']='';
$Log['loc']='';
function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
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
'relevador'=>'si',
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

//include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

//$Hoy = date("Y-m-d");

//include('./HIT/HIT_consultainterna_hitos_fechasbase.php');



$Hoy = date("Y-m-d");

$Pseudohoy= $Hoy;
if(isset($_POST['FechaHasta'])){
	if($_POST['FechaHasta']!='0000-00-00'&&$_POST['FechaHasta']!=''){
		$Pseudohoy=$_POST['FechaHasta'];
	}
}



$query="
    SELECT `tracking`.`id`,
        `tracking`.`nombre`,
        id_p_grupos_tipo_a,
        id_p_grupos_tipo_b,
        `tracking`.`info`,
        `tracking`.`id_p_paneles_id_nombre`,
        `tracking`.`tipo`,
        `tracking`.`fecha`,
        `tracking`.`fecha_tipo`,
        `tracking`.`fechacierre`,
        `tracking`.`fechacierre_tipo`,
        `tracking`.`id_p_usuarios_autor`,
        `tracking`.`id_p_usuarios_responsable`,
        `tracking`.`zz_AUTOPANEL`,
        zz_cache_primera_fechau
    FROM `paneles`.`tracking`
    WHERE 
    zz_borrada='0'
    AND
    `tracking`.`zz_AUTOPANEL` = '$PanelI'
    order by fecha desc
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}
while($row = $Consulta->fetch_assoc()){
	
	$Log['data']['seguimientosOrden'][]=$row['id'];
	$Log['data']['seguimientosOrden_prioridad'][]=$row['id'];
	
    foreach($row as $k => $v){
       $Log['data']['seguimientos'][$row['id']][$k]=utf8_encode($v);
    }	
	
	$Log['data']['seguimientos'][$row['id']]['ultimaabierta']='0000-00-00';
	$Log['data']['seguimientos'][$row['id']]['acciones']=array();
	
	
	$Log['data']['seguimientos'][$row['id']]['estado']='';
	$Log['data']['seguimientos'][$row['id']]['prioridad']=100;
	
	
	if($row['fecha_tipo']=='desconocida'){
		$Log['data']['seguimientos'][$row['id']]['prioridad']=0; //carga incompleta
		$Log['data']['seguimientos'][$row['id']]['estado']=utf8_encode('carga incompleta');
		
	}elseif($row['fechacierre_tipo']=='prevista' && $row['fechacierre']<=$Hoy){
		$Log['data']['seguimientos'][$row['id']]['prioridad']=1; //finalización vencida
		$Log['data']['seguimientos'][$row['id']]['estado']=utf8_encode('finalización vencida');
		
	}elseif(($row['fechacierre_tipo']=='desconocida' || $row['fechacierre'] > $Hoy) && $row['fecha'] <= $Hoy ){
		$Log['data']['seguimientos'][$row['id']]['prioridad']=2; //Seguimiento en curso
		$Log['data']['seguimientos'][$row['id']]['estado']=utf8_encode('seguimiento en curso');
		
	}elseif($row['fecha']>$Hoy){
		$Log['data']['seguimientos'][$row['id']]['prioridad']=3; //seguimiento programado
		$Log['data']['seguimientos'][$row['id']]['estado']=utf8_encode('seguimiento programado');
		
	}elseif($row['fechacierre']<=$Hoy){
		$Log['data']['seguimientos'][$row['id']]['prioridad']=4; //finalización ocurrida
		$Log['data']['seguimientos'][$row['id']]['estado']=utf8_encode('finalización ocurrida');
		
	}
	$prioridades[]=$Log['data']['seguimientos'][$row['id']]['prioridad'];
}	

array_multisort($prioridades,$Log['data']['seguimientosOrden_prioridad']);

		
	$query="
		SELECT 
			`SEGacciones`.`id`,
		    `SEGacciones`.`id_p_tracking_id`,
		    `SEGacciones`.`nombre`,
		    `SEGacciones`.`id_p_usuarios_autor`,
		    `SEGacciones`.`id_p_usuarios_responsable`,
		    
		    `SEGacciones`.`fechacreacion`,
		    `SEGacciones`.`fechacreacion_tipo`,
		    UNIX_TIMESTAMP(fechacreacion) as fechacreacion_unix,
		    `SEGacciones`.`fechacontrol`,
		    `SEGacciones`.`fechacontrol_tipo`,
		    UNIX_TIMESTAMP(fechacontrol) as fechacontrol_unix,
		    `SEGacciones`.`fechaejecucion`,
		    `SEGacciones`.`fechaejecucion_tipo`,
		    UNIX_TIMESTAMP(fechaejecucion) as fechaejecucion_unix,
		    
		    `SEGacciones`.`descripcion`,
		    `SEGacciones`.`reclamo`,
		    `SEGacciones`.`reclamar`,
		    `SEGacciones`.`id_p_comunicaciones_id_ident_requerida`,
		    `SEGacciones`.`zz_AUTOPANEL`,
		    `SEGacciones`.`zz_suspendida`,
		    
            `comunicaciones`.`id` as com_id,
		    `comunicaciones`.`sentido` as com_sentido,
		    `comunicaciones`.`fechaemisionref` as fechaemisionref,
		    `comunicaciones`.`fechaemision` as com_fechaemision,
		    `comunicaciones`.`fecharecepcion` as com_fecharecepcion,
		    `comunicaciones`.`fechainicio` as com_fechainicio,
		    `comunicaciones`.`fechaobjetivo` as com_fechaobjetivo,
		    `comunicaciones`.`ident` as com_ident,
		    `comunicaciones`.`identdos` as com_identdos,
		    `comunicaciones`.`identtres` as com_identtres,
		    `comunicaciones`.`cerrado` as com_cerrado,
		    `comunicaciones`.`cerradodesde` as com_cerradodesde,
		    `comunicaciones`.`nombre` as com_nombre,
		    `comunicaciones`.`id_p_grupos_id_nombre_tipoa` as com_id_p_grupos_id_nombre_tipoa,
		    `comunicaciones`.`id_p_grupos_id_nombre_tipob` as com_id_p_grupos_id_nombre_tipob,
		    `comunicaciones`.`zz_borrada` as com_zz_borrada
		FROM 
            `paneles`.`SEGacciones`
		LEFT JOIN
            comunicaciones
            ON
                comunicaciones.id = SEGacciones.id_p_comunicaciones_id_ident_requerida 
                AND 
                comunicaciones.`zz_AUTOPANEL` = '$PanelI'
		WHERE 
		SEGacciones.zz_borrada='0'
		AND
		`SEGacciones`.`zz_AUTOPANEL` = '$PanelI'
	";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}
$prioridadesA=Array();
while($row = $Consulta->fetch_assoc()){
	if(!isset($Log['data']['seguimientos'][$row['id_p_tracking_id']])){continue;}
    foreach($row as $k => $v){
        $Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']][$k]=utf8_encode($v);
    }
    $Log['data']['seguimientos'][$row['id_p_tracking_id']]['accionesOrden'][]=$row['id'];
    $Log['data']['seguimientos'][$row['id_p_tracking_id']]['accionesOrden_prioridad'][]=$row['id'];
    
    if($row['fechaejecucion']=='0000-00-00'||$row['fechaejecucion']==''){
    	if(!ISSET($Log['data']['seguimientos'][$row['id_p_tracking_id']]['ultimaabierta'])){$Log['data']['seguimientos'][$row['id_p_tracking_id']]['ultimaabierta']='0000-00-00';}    	
        $Log['data']['seguimientos'][$row['id_p_tracking_id']]['ultimaabierta']=max($Log['data']['seguimientos'][$row['id_p_tracking_id']]['ultimaabierta'],$row['fechacontrol']);
    }

	$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=100;
	$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']='';
	$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']='';
	
	if($row['fechacreacion_tipo']=='desconocida'){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=0; //carga incompleta
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('carga incompleta');
		if($row['fechacreacion']!=null){
			$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechacreacion'];
		}
		
	}elseif($row['fechaejecucion_tipo']=='prevista' && $row['fechaejecucion']<=$Hoy){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=1; //finalización vencida
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('finalización vencida');
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechaejecucion'];
		
	}elseif($row['fechacontrol_tipo']=='prevista' && $row['fechacontrol'] < $Hoy){		
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=2; //Control vencido
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('control vencido');
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechacontrol'];
		
	}elseif(($row['fechaejecucion_tipo']=='desconocida' || $row['fechaejecucion'] > $Hoy) && $row['fechacreacion'] <= $Hoy ){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=3; //accion en curso
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('acción en curso');
		
		if($row['fechacontrol_tipo']=='prevista'){
			if($row['fechaejecucion_tipo']=='prevista' && $row['fechacontrol'] > $row['fechaejecucion']){
				$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechaejecucion'];
			}else{
				$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechacontrol'];
			}
		}else{
			$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechaejecucion'];
		}
		
	}elseif($row['fechacreacion']>$Hoy){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=4; //accion programada
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('acción programada');
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechacreacion'];
		
	}elseif($row['fechaejecucion']<=$Hoy){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=5; //finalización ocurrida
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('finalización ocurrida');
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['fecha_proxima']=$row['fechaejecucion'];
		
	}
	
	if($row['zz_suspendida']==1){
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad']=5; //accion suspendida en hibernación
		$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['estado']=utf8_encode('suspendida');
	}

	$prioridadesA[$row['id_p_tracking_id']][]=$Log['data']['seguimientos'][$row['id_p_tracking_id']]['acciones'][$row['id']]['prioridad'];
}	


foreach($prioridadesA as $idseg => $sedat){
	array_multisort($prioridadesA[$idseg],$Log['data']['seguimientos'][$idseg]['accionesOrden_prioridad']);
}

foreach($Log['data']['seguimientos'] as $sid => $s){
	$ult[$sid]=$s['ultimaabierta'];
}
asort($ult);

foreach($ult as $sid => $v){
    $Log['data']['seguimientosOrden_ultimaAcc'][]=$sid;
}


$Log['res']='exito';
terminar($Log);
?>
