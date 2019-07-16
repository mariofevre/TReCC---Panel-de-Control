<?php
/**
* listado.php
*
* Este documento es uno de los posibles ingresos al sistema permitiendo seleccionar el entorno de trabajo y editar el perfil de usuario.
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
* y/o modificarlo bajo los términos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/

 //if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);/* verificación de seguridad */

chdir('..');
include ('./includes/header.php');
ini_set('display_errors',true);
error_reporting(E_ERROR | E_WARNING | E_PARSE);
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

/*
$Log['tx'][]='nivel de acceso: '.$UsuarioAcc;
if(!isset($UsuarioAcc)){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['res']='err';
    terminar($Log); 
}
if($UsuarioAcc==''){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';    
    $Log['res']='err';
    terminar($Log); 
}


$HabilitadoEdicion='no'; //por defecto no se permite la edicion hasta verificar el acceso del usuario para este modulo	
foreach($Usuario['Acc'] as $g => $nivel){
	//echo $g.$nivel;
	if($nivel=='editor'||$nivel=='administrador'){
		$HabilitadoEdicion='si';
	}elseif($nivel=='relevador'){
		header('location: ./inicio.php');
	}elseif($nivel=='visitante'||$nivel=='auditor'){
		$HabilitadoEdicion='no';
	}
}	
	*/
$Hoy_a = date("Y");
$Hoy_m = date("m");	
$Hoy_d = date("d");	
$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;


$query="
	SELECT
		id_paneles,
		id_usuario
	FROM
		accesos	
	WHERE 
		id_usuario = '$UsuarioI'
		
";
	
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	

while($row=$Consulta->fetch_assoc()){
	$Accesos[$row['id_paneles']]=$row;
}	


$query="
	SELECT
		paneles.*, 
		paneles.id_p_B_usuarios_usuarios_id_nombre as admin,
		paneles.id as idfila
	
	FROM paneles.paneles
	WHERE
		zz_borrada='0'
	order by
		zz_cerrada asc
			
";
	
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	

while($row=$Consulta->fetch_assoc()){
	
	
	if(!isset($Accesos[$row['idfila']])){
		if($row!=$UsuarioI){
			continue;
		}
	}
	
	foreach($row as $k => $v){
		$Log['data']['paneles'][$row['idfila']][$k]=utf8_encode($v);
	}
	//$Log['data']['paneles'][$row['idfila']]['accesos'][$row['accusu']]=$row['accusu'];
	
	$Log['data']['panelesOrden'][]=$row['idfila'];
}		
	
	$Log['res']='exito';	
terminar($Log);
		
?>
