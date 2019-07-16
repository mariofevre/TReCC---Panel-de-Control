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

 //consultado desde:
 //./IND_gestion.php
 //./IND_gestion.php
 
chdir('..');
include ('./includes/header.php');
ini_set('display_errors',true);

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
if($UsuarioAcc==''){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';    
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['HabilitadoEdicion']='no'; //por defecto no se permite la edicion hasta verificar el acceso del usuario para este modulo
	
foreach($Usuario['Acc'] as $g => $nivel){
	//echo $g.$nivel;
	if($nivel=='editor'||$nivel=='administrador'){
		$Log['data']['HabilitadoEdicion']='si';
	}elseif($nivel=='relevador'){
		$Log['tx'][]='no cuenta con niveles suficeintes';	
		$Log['res']='err';	
        terminar($Log);
	}elseif($nivel=='visitante'||$nivel=='auditor'){
		$Log['data']['HabilitadoEdicion']='no';
	}
}	


$query="
    SELECT 
        `grupos`.`id`,
        `grupos`.`nombre`,
        `grupos`.`codigo`,
        `grupos`.`orden`,
        `grupos`.`responsable`,
        `grupos`.`n_id_local`,
        `grupos`.`tipo`,
        `grupos`.`descripcion`,
        `grupos`.`zz_AUTOPANEL`
    FROM 
        `paneles`.`grupos`
    WHERE 
        zz_AUTOPANEL='".$PanelI."'
    ORDER BY
        orden
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	

$dg['nombre']='General';
$dg['codigo']='grl';
$dg['descripcion']=utf8_encode('Sin asignación a ningún grupo específico de este proyecto');
$Log['data']['grupos']['0']=$dg;	
$Log['data']['gruposOrden']['a'][]='0';
$Log['data']['gruposOrden']['b'][]='0';

while($row=$Consulta->fetch_assoc()){	
	foreach($row as $k => $v){
		$Log['data']['grupos'][$row['id']][$k]=utf8_encode($v);
	}
	$Log['data']['gruposOrden'][$row['tipo']][]=$row['id'];
}


if(isset($_POST['comunicaciones'])){
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
			`paneles`.comunicaciones 						
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
}


    
$Log['res']='exito';	
terminar($Log);
		
?>
