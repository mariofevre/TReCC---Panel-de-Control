<?php

/**
* COM_ed_multiver.php
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

if(!isset($_POST['panid'])){
    $Log['tx'][]='error, no se envió la variable panid';
    $Log['res']='err';
    terminar($Log);		
}
if($_POST['panid']!=$PanelI){
    $Log['mg'][]=utf8_encode('error, puede que haya cambiado el panel activo o que se haya finalizado su sesión por falta de actividad. por favor, vuelva a ingresar al panel en el que intenta trabajar y vuelva a intentar esta acción');
    $Log['res']='err';
    terminar($Log);		
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

$P_requeridos=array('campo');
$P_llenos('campo');
$P_mayores=array();

foreach($P_requeridos as $r){
	if(!isset($_POST[$r])){
	    $Log['tx'][]=utf8_encode('error, no se envió la variable '.$r);
	    $Log['res']='err';
	    terminar($Log);				
	}
}

foreach($P_llenos as $r){
	if($_POST[$r]==''){
	    $Log['tx'][]=utf8_encode('error, la variable '.$r.' se envió vacia');
	    $Log['res']='err';
	    terminar($Log);				
	}
}

foreach($P_mayores as $r){
	if($_POST[$r]<1){
	    $Log['tx'][]=utf8_encode('error, no se envió un número mayor a 0 para '.$r);
	    $Log['res']='err';
	    terminar($Log);				
	}
}


$Hoy = date("Y-m-d");

$extra='';
if($_POST['campo']=='previstoactual'){
	
	if(
		!isset($_POST['previstoactual_a'])
		||
		!isset($_POST['previstoactual_m'])
		||
		!isset($_POST['previstoactual_d'])
	){	
		
		$Log['tx'][]='no fue definida la fecha _a _d _m';
		$Log['mg'][]='error al recibir variable de fecha';
		$Log['res']='err';
		terminar($Log);
	}
	
	$_POST['valor']=$_POST['previstoactual_a']."-".$_POST['previstoactual_m']."-".$_POST['previstoactual_d'];
	
}elseif(
	$_POST['campo']=='id_p_comunicaciones_id_ident_entrante'
	||
	$_POST['campo']=='id_p_comunicaciones_id_ident_aprobada'
	||
	$_POST['campo']=='id_p_comunicaciones_id_ident_rechazada'
	||
	$_POST['campo']=='id_p_comunicaciones_id_ident_anulada'	
){
	if(!isset($_POST['valor'])){
		$Log['tx'][]='no fue definida la la comunicacion';
		$Log['mg'][]='error al recibir variable de comunicacion';
		$Log['res']='err';
		terminar($Log);		
	}	
	
	
	if($_POST['campo']=='id_p_comunicaciones_id_ident_entrante'){
		$extra="zz_ultima_fecha_entrante_calculada";	
	}
	
	if($_POST['campo']=='id_p_comunicaciones_id_ident_aprobada'){
		$extra="zz_ultima_fecha_aprobada_calculada";
	}	
		
	if($_POST['campo']=='id_p_comunicaciones_id_ident_rechazada'){
		$extra="zz_ultima_fecha_rechazada_calculada";
	}
		
	if($_POST['campo']=='id_p_comunicaciones_id_ident_anulada'	){
		$extra="zz_ultima_fecha_anulada_calculada";
	}
	
	if($_POST['valor']=="-[-BORRX-]-"){
		$_POST['valor']=0;
		$extra =", ".$extra." = '0000-00-00'";
	}else{
		$query="
		SELECT 
			`comunicaciones`.`id`,
		    `comunicaciones`.`sentido`,
		    `comunicaciones`.`zz_borrada`,
		    `comunicaciones`.`zz_AUTOPANEL`,
		    `comunicaciones`.`zz_reg_fecha_emision`
		FROM 
			`paneles`.`comunicaciones`
	
		WHERE 
			id = '".$_POST['valor']."'
		AND
			`comunicaciones`.`zz_AUTOPANEL` = '".$PanelI."'
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar fecha de la comunicacion';
			$Log['mg'][]='error al consultar fecha de la comunicacion';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		$row = $Consulta->fetch_assoc();
		$extra =", ".$extra." = '".$row['zz_reg_fecha_emision']."'";
	}
	
}


if(!isset($_POST['MId'])){
	$Log['tx'][]='no fue definida la cadena MID, m´ñultiples ids separadas por comas';
	$Log['res']='err';
	terminar($Log);
}

$IdA=explode(",",$_POST['MId']);

$Log['tx'][]="ids: ".count($IdA);

$OR='';

foreach($IdA as $ids){
	if($ids<1){continue;}
	$OR.=" id='".$ids."' OR";
}
$OR=substr($OR, 0,-3);


$query="
	UPDATE 
		`paneles`.`DOCversion`
	SET
		".$_POST['campo']." = '".$_POST['valor']."'
		$extra
	WHERE
	`DOCversion`.`zz_AUTOPANEL`='".$PanelI."'
	AND
	(
	$OR
	)
";
$Log['tx'][]=utf8_encode($query);

$Consulta = $Conec1->query($query);

if($Conec1->error!=''){
	$Log['tx'][]='error al actualizar las versiones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}
		
$Log['res']='exito';
terminar($Log);
 
?>