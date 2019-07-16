<?php 
/**
* SEG_consulta_calendario.php
*
* consulta informaicón general sobre acciones y seguimientos para ser representados en un calendario.
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

//ESTE ARCHIVO REQUIERE ACTUALIZACION; NO RESULTA FUNCIONAL EN LA ACTUALUIDAD


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

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config
include ('./PAN/PAN_consultainterna_feriados.php');//define variable $Feriados

//$Hoy = date("Y-m-d");

if(!isset($_POST['fecha'])){
    $Log['tx'][]='falta variable fecha';
    $Log['res']='err';
    terminar($Log);
}

if(!fechavalida($_POST['fecha'])){
    $Log['tx'][]='la variable fecha no es una fecha valida';
    $Log['res']='err';
    terminar($Log);
} 


$e = explode($_POST['fecha'],'-');

$primerfecha=$e[2].'-'.$e[1].'-01';
$ultimafecha=$e[2].'-'.$e[1].'-'.diasenelmes($_POST['fecha']);

while(traducirdiasemanados($primerfecha)!='Domingo'){
    $primerfecha=sumadias($primerfecha,-1);   
}

$f =$primerfecha;


while($f <= ($ultimafecha+1)){
    $Log['data']['fechas'][$f]['dia']=traducirdiasemanados($f);
    $Log['data']['fechas'][$f]['mes']=mesuno($f);
    $Log['data']['fechas'][$f]['obs']='';
    $m=explode($f,'-');    
    if($m[1]!=$e[1]){
        $Log['data']['fechas'][$f]['obs']='otromes';    
    }
    $f=sumadias($f,1);
}

while(traducirdiasemanados($ultimafecha) != 'Sábado'){
    $Log['data']['fechas'][$ultimafecha]['dia']=traducirdiasemanados($ultimafecha);
    $Log['data']['fechas'][$ultimafecha]['mes']=mesuno($ultimafecha);
    $Log['data']['fechas'][$ultimafecha]['obs']='otromes';    
    $ultimafecha=sumadias($ultimafecha,1);
}

$Log['data']['fechas'][$ultimafecha]['dia']=traducirdiasemanados($ultimafecha);
$Log['data']['fechas'][$ultimafecha]['mes']=mesuno($ultimafecha);
$Log['data']['fechas'][$ultimafecha]['obs']='otromes';

$Log['res']='exito';
terminar($Log);
?>
