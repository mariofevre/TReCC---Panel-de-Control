<?php 
/**
* SEG_ed_suspender_accion.php
*
* actualiza los atributos de una accion en la base de datos para que sea considerada en suspensi�n o hibernaci�n, hasta nuevo aviso. 
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
* y/o modificarlo bajo los t�rminos de la "GNU Affero General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU Affero General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
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


if(!isset($_POST['idacc'])){
    $Log['tx'][]='no se env�o la variable idseg';
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['id']=$_POST['idacc'];


$Hoy = date("Y-m-d");

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}



$query="
	INSERT INTO 
	SEGacciones_suspenciones(
		zz_AUTOUSUCREACION, zz_AUTOFECHACREACION,
		zz_AUTOPANEL, id_p_SEGacciones,
		suspdesde_u)
	VALUES (
		'".$UsuarioI."', '".$Hoy."',
		'$PanelI', '".$_POST['idacc']."',		
		'".time()."')

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
   UPDATE
   		`paneles`.`SEGacciones`
   	SET
        zz_suspendida='1'	
    WHERE
   		id = '".$_POST['idacc']."'
    AND
    	id_p_tracking_id = '".$_POST['id_p_tracking_id']."'
    AND
    	zz_AUTOPANEL = '$PanelI'
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}


$Log['res']='exito';
terminar($Log);
?>
