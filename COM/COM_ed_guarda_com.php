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
chdir(getcwd().'/../'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.


ini_set('display_errors', '1');


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

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

if(!isset($_POST['id'])){
	$Log['tx'][]='no fue enviada variable id';
	$Log['res']='err';
	terminar($Log);
}
if($_POST['id']<1){
	$Log['tx'][]='no fue enviada variable id corretametne';
	$Log['res']='err';
	terminar($Log);
}
if(!isset($_POST['sentido'])){
	$Log['tx'][]='no fue enviada variable sentido';
	$Log['res']='err';
	terminar($Log);
}

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}

$Log['data']['modo']=$_POST['modo'];

$query=" 
	SELECT `comunicaciones`.`id`,
	    `comunicaciones`.`zz_AUTOPANEL`
	FROM `paneles`.`comunicaciones`
	WHERE 
	id='".$_POST['id']."'
	AND
	zz_AUTOPANEL='".$PanelI."'
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar configuracióna editar';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}
if($Consulta->num_rows<1){
	$Log['tx'][]='no se encontró una comnuicación válida con ese ID en este panel: '.$Consulta['nombre'];
	$Log['mg'][]='no se encontró una comnuicación válida con ese ID en este panel: '.$Consulta['nombre'];
	$Log['res']='err';
	terminar($Log);
}

$gs=array('a','b');
foreach($gs as $g){
	if(isset($_POST['id_p_grupos_id_nombre_tipo'.$g])){
		if($_POST['id_p_grupos_id_nombre_tipo'.$g]=='n'){
			if(!isset($_POST['id_p_grupos_id_nombre_tipo'.$g.'_n'])){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g;
				$Log['res']='err';
				terminar($Log);
			}
			if($_POST['id_p_grupos_id_nombre_tipo'.$g.'_n']==''){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g.' no asignaremos grupo por ahora';
				$_POST['id_p_grupos_id_nombre_tipoa'.$g]='';
				continue;
			}
			if(str_replace(' ','',$_POST['id_p_grupos_id_nombre_tipo'.$g.'_n'])==''){
				$Log['tx'][]='inconsistencia para valores de grupo '.$g.' no asignaremos grupo por ahora';
				$_POST['id_p_grupos_id_nombre_tipoa'.$g]='';
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
					`grupos`.`nombre`='".$_POST['id_p_grupos_id_nombre_tipo'.$g.'_n']."'
					OR
					`grupos`.`codigo`='".$_POST['id_p_grupos_id_nombre_tipo'.$g.'_n']."'
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
				$_POST['id_p_grupos_id_nombre_tipo'.$g]=$f['id'];
				$Log['tx'][]='id grupo '.$g.': '.$f['id'];		
			}elseif($Consulta->num_rows<1){
				$query="
					INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_id_nombre_tipo'.$g.'_n']."',
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
				$_POST['id_p_grupos_id_nombre_tipo'.$g]=$Conec1->insert_id;
				if($_POST['id_p_grupos_id_nombre_tipo'.$g]<1){
					$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_id_nombre_tipo'.$g];
					$Log['tx'][]=utf8_encode($query);
					$Log['tx'][]=utf8_encode($Conec1->error);
					$Log['res']='err';
					terminar($Log);
				}
			}	
		}
	}
}

foreach($_POST as $k => $v){
	$i=explode('_',$k);	
	$Log['tx'][]=$i;
	if($i[0]=='fecha'&&$i[2]=='a'){
		$Log['tx'][]='localizada variable enviada para actualizar un registro de estado';
		$desde=$_POST['fecha_'.$i[1].'_a']."-".$_POST['fecha_'.$i[1].'_m']."-".$_POST['fecha_'.$i[1].'_d'];		
		
		
		$query="
		UPDATE 
			`paneles`.`comunestados`
		SET
		`desde` = '".$desde."'
				
		WHERE
		`id_p_comunicaciones_id_nombre` = '".$_POST['id']."'		
		AND
		`id_p_comunestadoslista` = '".$i[1]."'
		AND
		`zz_AUTOPANEL` = '$PanelI' 
				
		";		
		
		$Conec1->query($query);		
		if($Conec1->error!=''){
			$Log['tx'][]='error al modificar estados registrados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		
		if($Conec1->affected_rows=='0'){
			$Log['tx'][]='no se encontraros registros previos de este estado. se provcede a crearlo';
			
			$query="
			INSERT INTO
				`paneles`.`comunestados`
			SET
			`desde` = '".$desde."',
			`id_p_comunicaciones_id_nombre` = '".$_POST['id']."',
			`id_p_comunestadoslista` = '".$i[1]."',
			`zz_AUTOPANEL` = '$PanelI'		
			";		
			
			$Conec1->query($query);		
			if($Conec1->error!=''){
				$Log['tx'][]='error al crear registro en base de datos';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
		}
		
	}	
					
}

foreach($_POST as $k => $v){
	$i=explode('_',$k);	
	if($i[0]=='adj'){
		$campo=str_replace($i[0].'_'.$i[1].'_','',$k);
		$query="
		UPDATE
			`paneles`.`COMdocumentos`
		SET
		".$campo." = '".$v."'
		WHERE 
		`id` = '".$i[1]."'
		AND
		`id_p_comunicaciones_id` = '".$_POST['id']."'
		AND		
		`zz_AUTOPANEL` = '$PanelI' 	
		";		
		$Conec1->query($query);		
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		//$Log['tx'][]='consultar: '.$query;
		
	}					
}

$query="
	SELECT 
		`comunestadoslista`.`id`,
	    `comunestadoslista`.`estadio` as estadio,
	    `comunestadoslista`.`descripcion`,
	    `comunestadoslista`.`id_p_responsables_id_nombre`,
	    `comunestadoslista`.`sentido`,
	    `comunestadoslista`.`id_p_responsables_id_nombre_alerta`,
	    `comunestadoslista`.`orden`,
	    `comunestadoslista`.`requeridodefecto`,
	    `comunestadoslista`.`id_p_grupos_id_nombre`,
	    `comunestadoslista`.`zz_AUTOPANEL`
	FROM 
		$Base.`comunestadoslista`			
	WHERE 
		 zz_AUTOPANEL = '$PanelI' 
	AND
		`comunestadoslista`.`sentido`='".$_POST['sentido']."'
	ORDER BY orden DESC
";
$Consulta=$Conec1->query($query);		
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}

while($row = $Consulta->fetch_assoc()){
	$listadoEst[]=$row;
	if(!isset($primerest)){$primerest='fecha_'.$row['id'];}
	if($primerest!='fecha_'.$row['id']){$ultimoest='fecha_'.$row['id'];}
}	

	
if(isset($primerest)){
	$Log['tx'][]='primer estado asimilado a inicio:'.$primerest;
	$_POST['zz_reg_fecha_emision_a']=$_POST[$primerest.'_a'];
	$_POST['zz_reg_fecha_emision_m']=$_POST[$primerest.'_m'];
	$_POST['zz_reg_fecha_emision_d']=$_POST[$primerest.'_d'];
}
if(isset($ultimoest)){
	$Log['tx'][]='ultimo estado asimilado a cierre:'.$ultimoest;
	$_POST['cerradodesde_a']=$_POST[$ultimoest.'_a'];
	$_POST['cerradodesde_m']=$_POST[$ultimoest.'_m'];
	$_POST['cerradodesde_d']=$_POST[$ultimoest.'_d'];
}

$sets='';
if(isset($_POST['sentido'])){
	$sets.="sentido='".$_POST['sentido']."', ".PHP_EOL;
}
if(isset($_POST['ident'])){
	$sets.="ident='".$_POST['ident']."', ".PHP_EOL;
}
if(isset($_POST['identdos'])){
	$sets.="identdos='".$_POST['identdos']."', ".PHP_EOL;
}
if(isset($_POST['identtres'])){
	$sets.="identtres='".$_POST['identtres']."', ".PHP_EOL;
}
if(isset($_POST['nombre'])){
	$sets.="nombre='".$_POST['nombre']."', ".PHP_EOL;
}
if(isset($_POST['descripcion'])){
	$sets.="descripcion='".$_POST['descripcion']."', ".PHP_EOL;
}
if(isset($_POST['preliminar'])){
	$sets.="preliminar='".$_POST['preliminar']."', ".PHP_EOL;
}
if(isset($_POST['relevante'])){
	$sets.="relevante='".$_POST['relevante']."', ".PHP_EOL;
}

if(
	isset($_POST['zz_reg_fecha_emision_a'])
	&&
	isset($_POST['zz_reg_fecha_emision_m'])
	&&
	isset($_POST['zz_reg_fecha_emision_d'])
){
	$sets.="zz_reg_fecha_emision='".$_POST['zz_reg_fecha_emision_a']."-".$_POST['zz_reg_fecha_emision_m']."-".$_POST['zz_reg_fecha_emision_d']."', ".PHP_EOL;
}
if(isset($_POST['cerrado'])){
	$sets.="cerrado='".$_POST['cerrado']."', ".PHP_EOL;
}
if(
	isset($_POST['cerradodesde_a'])
	&&
	isset($_POST['cerradodesde_m'])
	&&
	isset($_POST['cerradodesde_d'])
){
	$sets.="cerradodesde='".$_POST['cerradodesde_a']."-".$_POST['cerradodesde_m']."-".$_POST['cerradodesde_d']."', ".PHP_EOL;
}
if(isset($_POST['id_p_grupos_id_nombre_tipoa'])){
	$sets.="id_p_grupos_id_nombre_tipoa='".$_POST['id_p_grupos_id_nombre_tipoa']."', ".PHP_EOL;
}
if(isset($_POST['id_p_grupos_id_nombre_tipob'])){
	$sets.="id_p_grupos_id_nombre_tipob='".$_POST['id_p_grupos_id_nombre_tipob']."', ".PHP_EOL;
}
if(isset($_POST['requerimiento'])){
	$sets.="requerimiento='".$_POST['requerimiento']."', ".PHP_EOL;
}
if(isset($_POST['requerimientoescrito'])){
	$sets.="requerimientoescrito='".$_POST['requerimientoescrito']."', ".PHP_EOL;
}
if(
	isset($_POST['fechainicio_a'])
	&&
	isset($_POST['fechainicio_m'])
	&&
	isset($_POST['fechainicio_d'])
){
	$sets.="fechainicio='".$_POST['fechainicio_a']."-".$_POST['fechainicio_a']."-".$_POST['fechainicio_d']."', ".PHP_EOL;
}
if(
	isset($_POST['fechaobjetivo_a'])
	&&
	isset($_POST['fechaobjetivo_m'])
	&&
	isset($_POST['fechaobjetivo_d'])
){
	$sets.="fechaobjetivo='".$_POST['fechaobjetivo_a']."-".$_POST['fechaobjetivo_m']."-".$_POST['fechaobjetivo_d']."', ".PHP_EOL;
}
$Log['tx'][]=utf8_encode($sets);

$query=" 
UPDATE 
	`paneles`.`comunicaciones`
SET
	$sets
	`zz_preliminar`='0'	
	WHERE 
	id='".$_POST['id']."'
	AND
	zz_AUTOPANEL='".$PanelI."'

";
//$Log['tx'][]='consultar: '.$query;
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar configuracióna editar';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}

$Log['res']='exito';
terminar($Log);
 
?>
