<?php 
/**
* COM_consulta_listado.php
*
* devuelve un array con las omunicaciones de un panel, deacuerdo a un filtro y orden definidos
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 2014 TReCC SA
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

ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['loc']='';
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
    exit();
}
$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['acc'][]='loc';
    $Log['loc'][]='./login.php';
    $Log['res']='err';
    terminar($Log); 
}

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

$Hoy = date("Y-m-d");					


$variables=array('BUSQUEDA');
foreach($variables as $v){
    if(!isset($_POST[$v])){
        $Log['tx'][]=utf8_encode('error en la recepción de variables necesarias. falta variable '.$v);
        $Log['tx'][]=$_POST;
        $Log['res']='error';
        terminar($Log);    
    }
	
}

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}


$query="
	SELECT 
		comunicaciones.id as id,
		comunicaciones.descripcion
					
	FROM 
		comunicaciones 	
	
	WHERE 
		comunicaciones.zz_AUTOPANEL = '$PanelI'
		AND
		comunicaciones.`zz_preliminar`='0'
		AND
		(
			descripcion LIKE '%".$_POST['BUSQUEDA']."%'
			OR
			nombre LIKE '%".$_POST['BUSQUEDA']."%'
			OR
			ident LIKE '%".$_POST['BUSQUEDA']."%'
			OR
			identdos LIKE '%".$_POST['BUSQUEDA']."%'
			OR
			identtres LIKE '%".$_POST['BUSQUEDA']."%'				
		)
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}

while($row = $Consulta->fetch_assoc()){
	foreach($row as $k => $v){
		$Log['data']['comunicaciones'][$row['id']][$k]=utf8_encode($v);		
    }
}

//echo "HH<pre>";print_r($Log);echo "</pre>ZZ";
$Log['res']='exito';
terminar($Log);

?>