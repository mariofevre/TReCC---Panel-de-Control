<?php

/**
* COM_ed_guarda_doc.php
*
* procesa archivos subidos referidos a una comunicacion
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
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
chdir(getcwd().'/../'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.


ini_set('display_errors', '1');


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
'editor'=>'si',
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

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

if(!isset($_POST['panid'])){
	$Log['tx'][]='no fue enviada variable panid';
	$Log['res']='err';
	terminar($Log);
}
if($_POST['panid']<1){
	$Log['tx'][]='no fue enviada variable id corretametne';
	$Log['res']='err';
	terminar($Log);
}
if($_POST['panid']!=$PanelI){
	$Log['tx'][]='error en la consistencia del id de panel';
	$Log['mg'][]='Al parecer ha cambiado de panel o ha caducado su sesión. Por favor vueva a intentar.';
	$Log['res']='err';
	terminar($Log);
}

$postes=array('idmod');
foreach($postes as $v){
	if(!isset($_POST[$v])){
		$Log['tx'][]='no fue enviada variable '.$v;
		$Log['res']='err';
		terminar($Log);
	}	
}

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}


$query="
	UPDATE COMmodelos
	SET
		
		zz_borrada='1'
	WHERE 
		id='".$_POST['idmod']."'
		AND
		zz_AUTOPANEL='".$PanelI."'
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar configuracióna editar';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}
$Log['data']['modelo']['id']=$_POST['idmod'];

$Log['res']='exito';
terminar($Log);
 
?>
