<?php 
/**
* SEG_consulta_accion.php
*
* consulta la base de datos generando un objeto array con las propiedades de la accion solicitada.
* 
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


if(!isset($_POST['idseg'])){
    $Log['tx'][]='no se envío la variable idseg';
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['idseg']=$_POST['idseg'];


if(!isset($_POST['idacc'])){
    $Log['tx'][]='no se envío la variable idacc';
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['idacc']=$_POST['idacc'];



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
        `tracking`.`info`,
        `tracking`.`id_p_paneles_id_nombre`,
        `tracking`.`tipo`,
        `tracking`.`fecha`,
        `tracking`.`fechacierre`,
        `tracking`.`id_p_usuarios_autor`,
        `tracking`.`id_p_usuarios_responsable`,
        `tracking`.`zz_AUTOPANEL`
    FROM `paneles`.`tracking`
    
    WHERE
    id = '".$_POST['idseg']."'
    AND
     `tracking`.`zz_AUTOPANEL` = '$PanelI'
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
    foreach($row as $k => $v){
       $Log['data']['seguimiento'][$k]=utf8_encode($v);
    }
}	

		
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
		id_p_tracking_id = '".$_POST['idseg']."'
		AND
		SEGacciones.id =  '".$_POST['idacc']."'
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
while($row = $Consulta->fetch_assoc()){
    foreach($row as $k => $v){
        $Log['data']['accion'][$k]=utf8_encode($v);
    }
    $Log['data']['accion']['adjuntos']=array();
    
    $Log['data']['accion']['estado']='';
    if($row['fechaejecucion']!='0000-00-00'){
        $Log['data']['accion']['estado']='terminada';
    }
    
    
	if($row['fechacreacion_unix']<='0'){$row['fechacreacion_unix']=time();}
	if($row['fechacontrol_unix']<='0'){$row['fechacontrol_unix']=time();}
	if($row['fechaejecucion_unix']<='0'){$row['fechaejecucion_unix']=time();}
	
	$Log['data']['seguimientos'][$row['id']]['fecha_max']=max(time(),$row['fechacreacion_unix'],$row['fechacontrol_unix'],$row['fechaejecucion_unix']);
	$Log['data']['seguimientos'][$row['id']]['fecha_min']=min(time(),$row['fechacreacion_unix'],$row['fechacontrol_unix'],$row['fechaejecucion_unix']);
		
		
	 $Log['data']['accion']['prioridad']=100;
	 $Log['data']['accion']['estado']='';
	
	if($row['fechacreacion_tipo']=='desconocida'){
		 $Log['data']['accion']['prioridad']=0; //carga incompleta
		 $Log['data']['accion']['estado']=utf8_encode('carga incompleta');	
	}elseif($row['fechaejecucion_tipo']=='prevista' && $row['fechaejecucion']<=$Hoy){
		 $Log['data']['accion']['prioridad']=1; //finalización vencida
		 $Log['data']['accion']['estado']=utf8_encode('finalización vencida');
		
	}elseif($row['fechacontrol_tipo']=='prevista' && $row['fechacontrol'] < $Hoy){
		
		 $Log['data']['accion']['prioridad']=2; //Control vencido
		 $Log['data']['accion']['estado']=utf8_encode('control vencido');
		
	}elseif(($row['fechaejecucion_tipo']=='desconocida' || $row['fechaejecucion'] > $Hoy) && $row['fechacreacion'] < $Hoy ){
		 $Log['data']['accion']['prioridad']=3; //accion en curso
		 $Log['data']['accion']['estado']=utf8_encode('accion en curso');
		
	}elseif($row['fechacreacion']>=$Hoy){
		 $Log['data']['accion']['prioridad']=4; //accion programada
		 $Log['data']['accion']['estado']=utf8_encode('accion programado');
		
	}elseif($row['fechaejecucion']<=$Hoy){
		 $Log['data']['accion']['prioridad']=5; //finalización ocurrida
		 $Log['data']['accion']['estado']=utf8_encode('finalización ocurrida');	
	}

	if($row['zz_suspendida']==1){
		$Log['data']['accion']['prioridad']=5; //accion suspendida en hibernación
		$Log['data']['accion']['estado']=utf8_encode('suspendida');
	}
}	

$ruta='./documentos/p_'.$PanelI.'/SEG/muestras/';
$query="
	SELECT 
		id, id_p_SEGacciones, 
		FI_tipo, FI_muestra, FI_extension, FI_documento, nombre, 
		zz_AUTOFECHACREACION, zz_AUTOPANEL, zz_AUTOUSUCREA
		FROM SEGacciones_adjuntos
	WHERE
		zz_AUTOPANEL='".$PanelI."'
		and
		id_p_SEGacciones='".$_POST['idacc']."'
		and
		zz_borrada='0'
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
	
    foreach($row as $k => $v){
        $Log['data']['accion']['adjuntos'][$row['id']][$k]=utf8_encode($v);
    }
	if(file_exists($ruta.$row['FI_muestra'])){
		$Log['data']['accion']['adjuntos'][$row['id']]['FI_muestra']=$ruta.$row['FI_muestra'];
	}else{
		$Log['data']['accion']['adjuntos'][$row['id']]['FI_muestra']='./img/file_'.$row['FI_tipo'].'.png';
	}
}

$Log['res']='exito';
terminar($Log);
?>
