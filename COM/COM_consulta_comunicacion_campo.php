<?php 
/**
* comunicaciones_consultas_ajax.php
*
* realiza consultas para un campo en la base de datos de comunicaciones y devuelve json. Pensado para consultar el texto de una comunicaci{on que suele no ser consultedo de modo masivo}
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	comunicaciones
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2016 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NINGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/
ini_set('display_errors',true);
chdir('..');
include ('./includes/header.php');


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
  



if(!isset($_POST['id'])){
    $Log['tx'][]='falta variable id';
    $Log['res']='err';
    terminar($Log);
}

if(!isset($_POST['campo'])){
    $Log['tx'][]='falta variable campo';
    $Log['res']='err';
    terminar($Log);
}

$query="
    select ".$_POST['campo']." 
    FROM ".$Base.".comunicaciones
    WHERE id='".$_POST['id']."' 
    AND zz_AUTOPANEL='$PanelI'
";

$Consulta = $Conec1->query($query);
if($Conec1->error != ''){
	$Log['tx'][]='error al consultar comunicaciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}

if($Consulta->num_rows<1){
	$Log['tx'][]='no se identificaron comunicaiones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';	
	terminar($Log);	
}

while($fila=$Consulta->fetch_assoc()){
	$f=$fila;
	$f[$_POST['campo']]=utf8_encode(strip_tags($fila[$_POST['campo']]));
	$registros[] = $f;
}	
	
$Log['data']=$registros;
$Log['res']='exito';
terminar($Log);

?>
