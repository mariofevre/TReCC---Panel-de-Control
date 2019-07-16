<?php 
/**
* consulta_grupos.php
*
* devuelve listado de grupos del panel.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	informes
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 - 2014 - 2015 TReCC SA
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

/*
if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);
*/

ini_set('display_errors', '1');
chdir('..'); 
include ('./includes/header.php');
include ('./login_registrousuario.php');//buscar el usuario activo.

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['res']='';
function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
	exit;
}

	//consulta las las características del informe solicitado
	$query="
	SELECT
		*
    FROM
		grupos
	WHERE
        zz_AUTOPANEL = '".$PanelI."'
	 ORDER BY 
        orden ASC, 
        nombre ASC, 
        id ASC
	";

	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error en consulta grupos: '.$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log); 
	}
	
	$Log['data']['grupos']=array();
	$Log['data']['gruposOrden']=array();
	//genera una array con los datos base del informe
	while($row = $Consulta->fetch_assoc()){
		foreach($row as $k => $v){
			$g[$k]=utf8_encode($v);	
		}
		$Log['data']['grupos'][$row['id']]=$g;
		//$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']]['coexistecon']=array();
		$Log['data']['gruposOrden'][]=$row['id'];			
	}
	
	
	$query="
		SELECT 
			`comunicaciones`.`id`,
		    `comunicaciones`.`sentido`,
		    `comunicaciones`.`id_p_grupos_id_nombre_tipoa`,
		    `comunicaciones`.`id_p_grupos_id_nombre_tipob`,
		    `comunicaciones`.`zz_borrada`,
		    `comunicaciones`.`zz_borradafecha`,
		    `comunicaciones`.`zz_borradausuario`,
		    `comunicaciones`.`zz_reg_fecha_emision`		    
		FROM 
			$Base.comunicaciones 						
		WHERE 
			comunicaciones.zz_AUTOPANEL = '$PanelI'
        AND 
			zz_borrada='0'					
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error en consulta grupos: '.$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log); 
	}
	
	$Log['data']['gruposUsadosA']=array();
	$Log['data']['gruposParaB']=array();
	
	$Log['data']['gruposUsadosB']=array();
	$Log['data']['gruposParaA']=array();
	
	while($row = $Consulta->fetch_assoc()){
		if($row['id_p_grupos_id_nombre_tipoa']>0){
			$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']]['coexistecon'][$row['id_p_grupos_id_nombre_tipob']]='si';
			$Log['data']['gruposUsadosA'][$row['id_p_grupos_id_nombre_tipoa']]='si';
			$Log['data']['gruposParaB'][$row['id_p_grupos_id_nombre_tipob']][$row['id_p_grupos_id_nombre_tipoa']]='si';
		}
		if($row['id_p_grupos_id_nombre_tipob']>0){
			$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipob']]['coexistecon'][$row['id_p_grupos_id_nombre_tipoa']]='si';
			$Log['data']['gruposUsadosB'][$row['id_p_grupos_id_nombre_tipob']]='si';
			$Log['data']['gruposParaA'][$row['id_p_grupos_id_nombre_tipoa']][$row['id_p_grupos_id_nombre_tipob']]='si';	
		}		
	}	

	$Log['res']='exito';
	terminar($Log);
?>
