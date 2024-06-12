<?php 
/**
* SEG_ed_borrar_accion.php
*
* modifica los atributos de una acción para que sea considerada eliminada (no es devuelto por las consultas habituales)  
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
ini_set('display_errors', true);
chdir('..'); 
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
$PanelI = $_SESSION['panelcontrol']->PANELI;
include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.

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

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config
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


if(!isset($_POST['panid'])){
	$Log['tx'][]='no fue definida la variable panid';
	$Log['res']='err';
	terminar($Log);
}
if($_POST['panid']!=$PanelI){
	$Log['tx'][]='erroe, id de panel no coincide';
	$Log['mg'][]='error, ha cambiado de panel, vuelva a seleccional el panel con el que queire trabajar';
	$Log['res']='err';
	terminar($Log);
}

$variables=array(
	'id_inst'=>'set',
	'cumplido'=>'set',
	'observaciones'=>'set',
	'est_alerta'=>'set',
	'adjuntos_borrados'=>'opcional',
	'pasos'=>'opcional'
);

foreach($variables as $var => $tipo){
	if($tipo=='opcional'){continue;}
	if(!isset($_POST[$var])){
		$Log['tx'][]='no fue definida la variable '.$var;
		$Log['mg'][]='error. Consulta incompleta.';
		$Log['res']='err';
		terminar($Log);
	}
}


$Hoy = date("Y-m-d");

foreach($_POST as $k => $v){
	if(is_array($v)){continue;}
	$_POST[$k]=utf8_decode($v);
}
$query="
	UPDATE
		EVAinstancias
	SET
		cumplido='".$_POST['cumplido']."', 
		observaciones='".$_POST['observaciones']."',		
		est_alerta='".$_POST['est_alerta']."',		
		zz_preliminar='0'		
	WHERE
		id='".$_POST['id_inst']."'
	AND
		zz_AUTOPANEL='".$PanelI."'
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}


if(isset($_POST['adjuntos_borrados'])){
	foreach($_POST['adjuntos_borrados'] as $id_adj){
		$query="
			UPDATE EVAinstanciasAdjuntos
			SET
				zz_borrada='1'
			WHERE 
			
				id='".$id_adj."'
			AND
				zz_AUTOPANEL='".$PanelI."'
		";

		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar la base';
			$Log['tx'][]=$Conec1->error;
			$Log['tx'][]=$query;
			$Log['res']='error';
			terminar($Log);		
		}	
	}
}


if(isset($_POST['pasos'])){
	
	$Log['tx'][]='hay pasos';
	$query="
		SELECT 
			id, id_p_EVAinstancias, id_p_EVA_pasos, num_1, text_1, date_1, hecho
		FROM 
			EVA_pasos_estados
		WHERE 	
			zz_AUTOPANEL = '$PanelI'
			AND
			id_p_EVAinstancias = '".$_POST['id_inst']."'
		
	";

	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}

	$pasos=array();
	while($row = $Consulta->fetch_assoc()){	
		$pasos[$row['id_p_EVA_pasos']]=$row;	
	}



	
	
	
	
	foreach($_POST['pasos'] as $id_paso => $p_data){
		
		if(!isset($pasos[ $id_paso])){
			$Log['tx'][]='creamos paso estado';
			$query="
				INSERT INTO
					EVA_pasos_estados
				SET
					zz_AUTOPANEL = '$PanelI',
					id_p_EVAinstancias = '".$_POST['id_inst']."',
					id_p_EVA_pasos = '".$id_paso."'
			";

			$Consulta = $Conec1->query($query);
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar la base';
				$Log['tx'][]=$Conec1->error;
				$Log['tx'][]=$query;
				$Log['res']='error';
				terminar($Log);		
			}	
			
		}
		
		if(!isset($p_data['num_1'])){$p_data['num_1']='';}
		if(!isset($p_data['text_1'])){$p_data['text_1']='';}
		if(!isset($p_data['date_1'])){$p_data['date_1']='000-00-00';}
		if(!isset($p_data['hecho_1'])){$p_data['hecho_1']='0';}
		
		$query="
			UPDATE 
				EVA_pasos_estados
			SET
				num_1='".$p_data['num_1']."',
				text_1='".$p_data['text_1']."',
				date_1='".$p_data['date_1']."',
				hecho='".$p_data['hecho']."'
				
			WHERE 
			
				id_p_EVAinstancias = '".$_POST['id_inst']."'
				AND
				id_p_EVA_pasos = '".$id_paso."'
				AND
				zz_AUTOPANEL='".$PanelI."'
		";

		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar la base';
			$Log['tx'][]=$Conec1->error;
			$Log['tx'][]=$query;
			$Log['res']='error';
			terminar($Log);		
		}	
		$Log['tx'][]='datos a paso estado';
	}
}


$Log['data']['id_inst']=$_POST['id_inst'];
$Log['res']='exito';
terminar($Log);
?>
