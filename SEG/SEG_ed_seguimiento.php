<?php 
/**
* SEG_ed_seguimiento.php
*
* edita los atributos editables de un seguimento en la base de datos. Si se le asigna un grupo nuevo, este se crea en la base correspondiente. 
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
* y/o modificarlo bajo los t�rminos de la "GNU Affero General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU Affero General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
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


if(!isset($_POST['idseg'])){
    $Log['tx'][]='no se env�o la variable idseg';
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['id']=$_POST['idseg'];


$Hoy = date("Y-m-d");

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}

$gs=array('a','b');
$Log['tx'][]='i';
foreach($gs as $g){
	$Log['tx'][]='e';
	if(isset($_POST['id_p_grupos_tipo_'.$g])){
		if($_POST['id_p_grupos_tipo_'.$g]=='n'){
			if(!isset($_POST['id_p_grupos_tipo_'.$g.'_n'])){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g;
				$Log['res']='err';
				terminar($Log);
			}
			if($_POST['id_p_grupos_tipo_'.$g.'_n']==''){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g.' no asignaremos grupo por ahora';
				$_POST['id_p_grupos_tipoa'.$g]='';
				continue;
			}
			if(str_replace(' ','',$_POST['id_p_grupos_tipo_'.$g.'_n'])==''){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g.' no asignaremos grupo por ahora';
				$_POST['id_p_grupos_tipoa'.$g]='';
				continue;
			}		
			$query="
				SELECT 
					`grupos`.`id`,
				    `grupos`.`nombre`,
				    `grupos`.`codigo`,
				    `grupos`.`descripcion`
			    
				FROM `paneles`.`grupos`
				WHERE
				`grupos`.`zz_AUTOPANEL`='".$PanelI."'
				AND
				(
					`grupos`.`nombre`='".$_POST['id_p_grupos_tipo_'.$g.'_n']."'
					OR
					`grupos`.`codigo`='".$_POST['id_p_grupos_tipo_'.$g.'_n']."'
				)
				AND
				tipo='".$g."'
			";
			$Log['tx'][]=utf8_encode($query);
			$Consulta=$Conec1->query($query);
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
			if($Consulta->num_rows==1){
				$f=$Consulta->fetch_assoc();
				$_POST['id_p_grupos_tipo_'.$g]=$f['id'];
				$Log['tx'][]='id grupo '.$g.': '.$f['id'];		
			}elseif($Consulta->num_rows<1){
				$query="
					INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_tipo_'.$g.'_n']."',
					`zz_AUTOPANEL`='".$PanelI."',
					tipo='".$g."'
				";
				$Conec1->query($query);		
				if($Conec1->error!=''){
					$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
					$Log['tx'][]=utf8_encode($query);
					$Log['tx'][]=utf8_encode($Conec1->error);
					$Log['res']='err';
					terminar($Log);
				}
				$_POST['id_p_grupos_tipo_'.$g]=$Conec1->insert_id;
				if($_POST['id_p_grupos_tipo_'.$g]<1){
					$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_tipo_'.$g];
					$Log['tx'][]=utf8_encode($query);
					$Log['tx'][]=utf8_encode($Conec1->error);
					$Log['res']='err';
					terminar($Log);
				}
			}	
		}else{
			$Log['tx'][]='refiere a un grupo existente: '.$g;
		}
	}else{
		$Log['tx'][]='error, no se enviaron datos de grupo: '.$g;
	}
}





$query="
   UPDATE
   	`paneles`.`tracking`
   	SET
        `nombre`='".$_POST['nombre']."',
        `info`='".$_POST['info']."',
        `tipo`='".$_POST['tipo']."',
        `fecha`='".$_POST['fecha']."',
        `fecha_tipo`='".$_POST['fecha_tipo']."',
        `fechacierre`='".$_POST['fechacierre']."',
        `fechacierre_tipo`='".$_POST['fechacierre_tipo']."',
        `id_p_usuarios_responsable`='".$_POST['id_p_usuarios_responsable']."',
        `id_p_grupos_tipo_a`='".$_POST['id_p_grupos_tipo_a']."',
        `id_p_grupos_tipo_b`='".$_POST['id_p_grupos_tipo_b']."'
        
    WHERE
    id = '".$_POST['idseg']."'
    AND
     `tracking`.`zz_AUTOPANEL` = '$PanelI'
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
