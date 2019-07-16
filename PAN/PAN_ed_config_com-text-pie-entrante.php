<?php
/**
* PAN_consultainterna_config.php
*
* genera una consulta a la base de datos y genera un array con sus contenidos, definiendo la configuración del panel activo
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
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.

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

$VarOblig=array(
	'com-text-encabezado-entrante',
	'zz_AUTOPANEL'
);
foreach($VarOblig as $v){
	if(!isset($_POST[$v])){
		$Log['tx'][]='error falta variable.'.$v;
	    $Log['res']='err';
	    terminar($Log); 
	}
}

if($_POST['zz_AUTOPANEL']!=$PanelI){
	$Log['tx'][]='error, los datos enviados ('.$_POST['zz_AUTOPANEL'].') no son del panel activo ('.$PanelI.')';
    $Log['res']='err';
    terminar($Log); 	
}

foreach($_POST as $k =>$v){
	$_POST[$k]=utf8_decode($v);
}
 
$query="
UPDATE configuracion
	SET
		`com-text-pie-entrante`='".$_POST['com-text-pie-entrante']."'
	WHERE
		configuracion.zz_AUTOPANEL='$PanelI'
";
$Consulta = $Conec1->query($query);

if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	

$Log['data']['pieHTML']=$_POST['com-text-pie-entrante'];
$Log['res']='exito';
terminar($Log);		
		
?>
