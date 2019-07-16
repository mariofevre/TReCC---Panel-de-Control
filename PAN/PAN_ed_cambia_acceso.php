<?php
/**
* PAN_consultainterna_config.php
*
* genera una consulta a la base de datos y genera un array con sus contenidos, definiendo la configuraci�n del panel activo
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	common
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los t�rminos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
*/

 //if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);/* verificaci�n de seguridad */

chdir('..'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso com�n.

ini_set('display_errors', true);

$Hoy=date('Y-m-d');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['res']='';
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
'editor'=>'no',
'relevador'=>'no',
'auditor'=>'no',
'visitante'=>'no'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}

$VarOblig=array(
 'zz_AUTOPANEL',
 'idacc', 
 'idusu',
 'nivel',
);
foreach($VarOblig as $v){
	if(!isset($_POST[$v])){
		$Log['tx'][]='error falta variable.'.$v;
	    $Log['res']='err';
	    terminar($Log); 
	}
}


foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}
 
 
if($_POST['zz_AUTOPANEL']!=$PanelI){
	$Log['tx'][]='error, los datos enviados ('.$_POST['zz_AUTOPANEL'].') no son del panel activo ('.$PanelI.')';
    $Log['res']='err';
    terminar($Log); 	
}



$query="
	SELECT 
		id_usuario, 
		id_paneles, 
		nivel, 
		id_p_grupos_id_nombre,
		id_p_grupos_id_nombre_b
		
	FROM 
		accesos
	WHERE
	
		id='".$_POST['idacc']."'
	AND
		id_usuario='".$_POST['idusu']."'
	AND
		id_paneles='".$_POST['zz_AUTOPANEL']."'
";
$Consulta = $Conec1->query($query);


if($Consulta->num_rows>0){
	
	$row=$Consulta->fetch_assoc();
	
	$query="
		UPDATE accesos
			SET
				nivel ='".$_POST['nivel']."'
			WHERE
				id='".$_POST['idacc']."'
			AND
				id_usuario='".$_POST['idusu']."'
			AND
				id_paneles='".$_POST['zz_AUTOPANEL']."'
	";
	$Consulta = $Conec1->query($query);
	
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}			
	
	
	$query="
	INSERT INTO USU_accesos_historial
		(
			id_p_USUaccesos,
			id_p_USUusuarios,
			tiempounix, 
			evento, 
			comentario, 
			origen_file, 
			origen_usuario,
			zz_AUTOPANEL
			
		)VALUES (
			'".$_POST['idacc']."',
			'".$_POST['idusu']."',
			'".time()."',
			'nuevo nivel',
			'cambio de nivel en panel:".$PanelI." nivel:".$row['nivel']." a-> ".$_POST['nivel']." idacc:".$_POST['idacc']."',
			'".__FILE__." ".__LINE__."', 
			'".$UsuarioI."',
			'".$PanelI."'
		)
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}	

}else{
		
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);
	
	/*
	$query="
	INSERT INTO accesos
		(
			id_usuario, 
			id_paneles, 
			nivel, 
			id_p_grupos_id_nombre
		)
		VALUES (
			'".$_POST['idusu']."',
			'".$PanelI."', 
			'".$_POST['nivel']."',
			'0'
		)
	";
	$Consulta = $Conec1->query($query);
	
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}	
	$Log['data']['nAid']=$Conec1->insert_id;	
		*/
		
}

	

$Log['res']='exito';
terminar($Log);		
		
?>
