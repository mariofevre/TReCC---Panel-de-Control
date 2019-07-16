<?php 
/**
* paneles_duplica.php
*
* paneles_duplica.php permite generar un nuevo panel tomand de base otro existente. 
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	paneles
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2014 - 2015 TReCC SA
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

ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

$HOY=date('Y-m-d');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['loc']='';
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
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['mg'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['mg'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}


if(isset($_POST['inicio_a'])&&isset($_POST['inicio_m'])&&isset($_POST['inicio_d'])){
	$Inicio=$_POST['inicio_a']."-".$_POST['inicio_m']."-".$_POST['inicio_d'];// fecha de referencia para fecha de inicios de seguimientos
	if(!fechavalida($Inicio)){
		$Inicio=sumames($HOY,-2);
	}	
}

if(isset($_POST['fin_a'])&&isset($_POST['fin_m'])&&isset($_POST['fin_d'])){
	$Fin=$_POST['fin_a']."-".$_POST['fin_m']."-".$_POST['fin_d'];// fecha de referencia para fecha de fin de seguimientos
	if(!fechavalida($Fin)){
		$Fin=sumames($HOY,6);
	}	
}

$Nombre=utf8_decode($_POST['nombre']);
$Descripcion=utf8_decode($_POST['descripcion']);	
								
$query="
	INSERT INTO `paneles`.`paneles`
	(
		`nombre`,
		`id_p_B_usuarios_usuarios_id_nombre`,
		`descripcion`,
		zz_AUTOFECHACREACION
	)
	VALUES (
	
		'$Nombre',
	    '$UsuarioI',
	    '$Descripcion',	    
	    '$HOY'
	)
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['mg'][]= "error: no pudo crearse el nuevo panel";
	$Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
	$Log['tx'][]= $Conec1->error;
	terminar($Log);
}else{
	$NID['panel']=$Conec1->insert_id;
	$Log['tx'][]= utf8_encode("nuevo panel creado. ID: :".$NID['panel']);
	$Log['data']['nid']=$NID['panel'];
}

$query="
INSERT INTO `paneles`.`accesos`
	(
	`id_usuario`,
	`id_paneles`,
	`nivel`
	)
VALUES
	(
	'".$UsuarioI."',
	'".$NID['panel']."',
	'administrador'
	)
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudo crearse su permiso de acceso al panel, se ha creado pero no podrá acceder a el");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." se ha habilitado su acceso al panel creado.");
}	



$Log['res']='exito';
terminar($Log);
