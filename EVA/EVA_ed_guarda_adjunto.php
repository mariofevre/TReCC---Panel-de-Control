<?php

/**
* COM_ed_guarda_adjunto.php
*
 * guarda documetnos adjuntos a una comunicación cargados en el formulacion de edicion de una comunicación.
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
chdir('..'); 
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.

ini_set('display_errors', '1');

$Tabla='EVAinstanciasAdjuntos';


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


include ('./SIS/SIS_login_registrousuario.php');//buscar el usuario activo.
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
}elseif($nivelespermitidos[$UsuarioAcc]!='si'){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 	
}




if(!isset($_POST['nfile'])){
	$Log['tx'][]='no fue definido el tipo de contenido';
	$Log['res']='err';
	terminar($Log);
}
$Log['data']['nf']=$_POST['nfile'];

if(!isset($_FILES['upload'])){
	$Log['tx'][]='no fue enviada la imagen en la variable FILES[upload]';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['id_inst'])){
	$Log['tx'][]='no fue enviada la imagen en la variable id_inst';
	$Log['res']='err';
	terminar($Log);
}
if(!isset($_POST['tipo'])){
	$Log['tx'][]='no fue enviado el tipo, se asume que es un documento adjunto';
	$_POST['tipo']='adjunto';
}
if($_POST['tipo']==''){
	$Log['tx'][]='no fue enviado el tipo, se asume que es un documento adjunto';
	$_POST['tipo']='adjunto';
}


	$Log['tx'][]= "archivo enviado";
	
	$ArchivoOrig = $_FILES['upload']['name'];	
	$Log['tx'][]= "cargando: ".$ArchivoOrig;
	
	$b = explode(".",$ArchivoOrig);
	$ext = strtolower($b[(count($b)-1)]);	
	
	$NombreTemp=$_FILES['upload']['tmp_name'];//nombre temporal del archivo en el servidor
	$IdInst=$_POST['id_inst'];
	$tipo=$_POST['tipo'];
	include('./EVA/EVA_edinterna_guarda_adjunto.php');
		//utiilza $tipo /para identificar la relación del archivo con la comunicación
		//utiliza $IdCom para identificar la comunicaión de referencia	
		//utiliza $ext para identificar la extensión del archivo
		//utiliza $ArchivoOrig para identificar el nombre original del archivo
		//utiliza $NombreTemp para identificar el nombre temporal donde se alija el archivo
	
$Log['tx'][]='completado';
$Log['res']='exito';

terminar($Log);

?>
