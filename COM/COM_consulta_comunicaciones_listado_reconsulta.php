<?php
/**
* comunicaicones_ajax_reconsulta.php
*
 * consulta dentro de la variable session, contenidos trasmitidos parcialmente por extensos.
 * 
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
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.


$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['res']='';
function terminar($Log){
	error_reporting(-1);//report all errors	
	$res=json_encode($Log);
	if($res==''){
		ini_set('display_errors', 0);//do not display errors to standard output
		// json_encode(): Invalid UTF-8 sequence in argument
		
		$res=json_last_error()."<br>".print_r($Log,true);	
	}
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

if(!isset($_POST['codigo'])){
	$Log['res']='err';
	$Log['tx'][]=utf8_encode("no se encontró la variable cod");	
	$Log['tx'][]=$_POST;
	terminar($Log);
}

$cod = $_POST['codigo'];

if(!isset($_SESSION['paneldecontrol']['consultaguarda'])){
	$Log['res']='err';
	$Log['tx'][]=utf8_encode("no se encontró la sesión guardada");	
	terminar($Log);
}
$Log['tx'][]=$cod;
if(!isset($_SESSION['paneldecontrol']['consultaguarda'][$cod])){
	$Log['res']='err';
	$Log['tx'][]=utf8_encode("no se encontró la consulta solicitada $cod");	
	terminar($Log);
}
$TamanoPaquetes=100;

$salvar=array_slice($_SESSION['paneldecontrol']['consultaguarda'][$cod],$TamanoPaquetes);
$Log['data']['regs']=array_slice($_SESSION['paneldecontrol']['consultaguarda'][$cod], 0, $TamanoPaquetes);
if(count($salvar)>0){
	$Log['data']['avance']='pend: '.count($salvar);	
	$_SESSION['paneldecontrol']['consultaguarda'][$cod]=$salvar;
}else{
	$Log['data']['avance']='terminado';
	unset($_SESSION['paneldecontrol']['consultaguarda'][$cod]);
}



if(!isset($_POST['avance'])){$_POST['avance']='';}

if($_POST['avance']=='inicial'){
	$cod=str_pad(rand(0, 99999),5,"0",STR_PAD_LEFT);
	unset($_SESSION['paneldecontrol']['consultaguarda']);
	$salvar=array();
	if(isset($Log['data']['regs'])){		
		$salvar=array_slice($Log['data']['regs'],20);
		$Log['data']['regs']=array_slice($Log['data']['regs'], 0, 20);
	}
	$_SESSION['paneldecontrol']['consultaguarda'][$cod]=$salvar;
	$Log['data']['avanceCod']=$cod;
}

//$Log['data']['avance']=$_POST['avance'];


$Log['res']='exito';
$Log['data']['avanceCod']=$cod;
terminar($Log);

?>
