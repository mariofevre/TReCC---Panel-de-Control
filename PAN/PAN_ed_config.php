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
	'com-sale-preN',
	'com-sale-preNx',
	'com-salex',
	'com-seguimiento',
	'com-seguimiento-inicio',
	'com-seguimiento-plazo',
	'cpt-activo',
	'doc-activo',
	'doc-criterionum',
	'doc-nomenclaturaarchivos',
	'doc-nomenclaturaarcseparador',
	'doc-visadomultiple',
	'esp-activo',
	'esp-nombrealternativo',
	'gral-orden-grupo',
	'hit-activo',
	'zz_AUTOPANEL',
	'ind-activo',
	'ind-feriado',
	'ind-rep-com-entra',
	'ind-rep-com-sale',
	'ind-rep-traking',
	'inf-activo',
	'pla-activo',
	'pla-nivel1',
	'pla-nivel2',
	'pla-nivel3',
	'rel-activo',
	'rel-tabladiag',
	'tar-activo',
	'tra-activo'
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
		`gral-orden-grupo`='".$_POST['gral-orden-grupo']."',
		`ind-activo`='".$_POST['ind-activo']."',
		`ind-rep-traking`='".$_POST['ind-rep-traking']."',
		`ind-rep-com-sale`='".$_POST['ind-rep-com-sale']."',
		`ind-rep-com-entra`='".$_POST['ind-rep-com-entra']."',
		`ind-feriado`='".$_POST['ind-feriado']."',
		`seg-activo`='".$_POST['seg-activo']."',
		`com-activo`='".$_POST['com-activo']."',
		`com-entra`='".$_POST['com-entra']."',
		`com-entrax`='".$_POST['com-entrax']."',
		`com-entra-preN`='".$_POST['com-entra-preN']."',
		`com-entra-preNx`='".$_POST['com-entra-preNx']."',
		`com-sale`='".$_POST['com-sale']."',
		`com-salex`='".$_POST['com-salex']."',
		`com-sale-preN`='".$_POST['com-sale-preN']."',
		`com-sale-preNx`='".$_POST['com-sale-preNx']."',
		`com-grupob`='".$_POST['com-grupob']."',
		`com-grupoa`='".$_POST['com-grupoa']."',
		`com-ident`='".$_POST['com-ident']."',
		`com-identdos`='".$_POST['com-identdos']."',
		`com-identtres`='".$_POST['com-identtres']."',
		`com-seguimiento`='".$_POST['com-seguimiento']."',
		`com-seguimiento-plazo`='".$_POST['com-seguimiento-plazo']."',
		`com-seguimiento-inicio`='".$_POST['com-seguimiento-inicio']."',
		`com-aprobacion`='".$_POST['com-aprobacion']."',
		`com-aprobacion-sale`='".$_POST['com-aprobacion-sale']."',
		`com-prefijo-grupo`='".$_POST['com-prefijo-grupo']."',
		`com-text-encabezado-entrante`='".$_POST['com-text-encabezado-entrante']."',
		`com-text-encabezado-saliente`='".$_POST['com-text-encabezado-saliente']."',
		`com-text-css`='".$_POST['com-text-css']."',
		`com-nomenclaturaarchivos`='".$_POST['com-nomenclaturaarchivos']."',
		`com-nomenclaturaarcseparador`='".$_POST['com-nomenclaturaarcseparador']."',
		`com-nomenclaturaarchivosRta`='".$_POST['com-nomenclaturaarchivosRta']."',
		`inf-activo`='".$_POST['inf-activo']."',
		`doc-activo`='".$_POST['doc-activo']."',
		`doc-visadomultiple`='".$_POST['doc-visadomultiple']."',
		`doc-criterionum`='".$_POST['doc-criterionum']."',
		`doc-nomenclaturaarchivos`='".$_POST['doc-nomenclaturaarchivos']."',
		`doc-nomenclaturaarcseparador`='".$_POST['doc-nomenclaturaarcseparador']."',
		`tar-activo`='".$_POST['tar-activo']."',
		`hit-activo`='".$_POST['hit-activo']."',
		`cer-activo`='".$_POST['cer-activo']."',
		`cer-minimo`='".$_POST['cer-minimo']."',
		`cer-maximo`='".$_POST['cer-maximo']."',
		`rel-activo`='".$_POST['rel-activo']."',
		`rel-tabladiag`='".$_POST['rel-tabladiag']."',
		`pla-activo`='".$_POST['pla-activo']."',
		`pla-nivel1`='".$_POST['pla-nivel1']."',
		`pla-nivel2`='".$_POST['pla-nivel2']."',
		`pla-nivel3`='".$_POST['pla-nivel3']."',
		`cpt-activo`='".$_POST['cpt-activo']."',
		`esp-activo`='".$_POST['esp-activo']."',
		`esp-nombrealternativo`='".$_POST['esp-nombrealternativo']."'
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

$Log['res']='exito';
terminar($Log);		
		
?>
