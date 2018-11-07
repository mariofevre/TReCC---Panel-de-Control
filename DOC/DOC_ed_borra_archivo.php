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
ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

$Log=array();
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

$HOY=date("Y-m-d");

if(isset($_POST['zz_AUTOPANEL'])){
	if($_POST['zz_AUTOPANEL']!=$PanelI){
		$Log['tx'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['mg'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['res']='err';
		terminar($Log);
	}
}

if(!isset($_POST['id_p_DOCversion_id'])){
    $Log['tx'][]='falta la variable id_p_DOCversion_id';    
    $Log['res']='err';
    terminar($Log);   
}
if(!isset($_POST['id'])){
    $Log['tx'][]='falta la variable id';    
    $Log['res']='err';
    terminar($Log);   
}



$query="
SELECT 	
*
FROM 
	`paneles`.`DOCarchivos`
WHERE
		id='".$_POST['id']."'
	AND
		`id_p_DOCversion_id`='".$_POST['id_p_DOCversion_id']."'
    AND
        `zz_AUTOPANEL`='".$PanelI."'
	AND
  	  	zz_borrada='no'        
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error en consulta: '.$Conec1->error; 
	$Log['res']='err';
	terminar($Log);
}
if($Consulta->num_rows<1){
	$Log['tx'][]='error, no se encontro ningun registro de archivo con esas caracteristicas'; 
	$Log['res']='err';
	terminar($Log);
}
$row = $Consulta->fetch_assoc();

foreach($row as $k => $v){
	$Log['data'][$k]=utf8_encode($v);
}

$query="
UPDATE	 
	`paneles`.`DOCarchivos`
SET
		zz_borrada = 'si',
		zz_AUTOFECHABORRADA='".$HOY."'
WHERE
		id='".$_POST['id']."'
	AND
		`id_p_DOCversion_id`='".$_POST['id_p_DOCversion_id']."'
	AND
  	  	`zz_AUTOPANEL`='".$PanelI."'
    AND
  	  	zz_borrada='no'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error en consulta: '.$Conec1->error; 
	$Log['res']='err';
	terminar($Log);
}


$Log['res']='exito';
terminar($Log);

?>