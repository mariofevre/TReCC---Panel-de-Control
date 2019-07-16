<?php
/**
* panelgeneral.php
*
 * panelgeneral.php constituye la página principal que opera como menu de accise a los distintos módulos 
 * y a las opciones de configuración de cada panel activo.
 * Este menú carga dentro de marcos interiores los resúmenes de distintos módulos brindando una síntesis general.
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
ini_set('display_errors', '1');
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
if($UsuarioAcc==''){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';    
    $Log['res']='err';
    terminar($Log); 
}


if(isset($_POST['panel'])){
	$PanelI = $_POST['panel'];
}

$query="
	SELECT 
		* 
	FROM 
		paneles 
	LEFT JOIN 
		accesos ON accesos.id_paneles = paneles.id 
	WHERE 
		paneles.id = $PanelI
		AND 
		accesos.id_usuario=$UsuarioI
";			

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	
if ($Consulta->num_rows < 1) {
	$Log['tx'][]='no se localizó el acceso a ese panel';
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}
$row= $Consulta->fetch_assoc();

$Log['data']['panel']['nombre'] =utf8_encode($row['nombre']);
$Log['data']['panel']['descripcion'] =utf8_encode($row['descripcion']);

$Hoy_a = date("Y");
$Hoy_m = date("m");
$Hoy_d = date("d");
$Hoy = $Hoy_a . "-" . $Hoy_m . "-" . $Hoy_d;

$query="
	SELECT 
		* 
	FROM 
		configuracion 
	WHERE 
		zz_AUTOPANEL='$PanelI'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	

if ($Consulta->num_rows < 1) {
	$Log['tx'][]='creando registro de configuración para este panel';
	$query="
		INSERT INTO 
			configuracion 
		SET zz_AUTOPANEL='".$PanelI."'
	";
	$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}
	$Log['tx'][]='consultendo el registro creado de configuración para este panel';
	
	$query="
		SELECT 
			* 
		FROM 
			configuracion 
		WHERE 
			zz_AUTOPANEL='$PanelI'
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
		

global $config;
$config = $Consulta->fetch_assoc();

foreach($config as $k => $v){
	
	$e=explode("-",$k);
	if(count($e)==2){
		if($e[1]=='activo'){
			$Log['data']['config']['modulosactivos'][strtoupper($e[0])]=$v;
		}
	}
	$Log['data']['config'][$k]=utf8_encode($v);
}


$_SESSION['configuracion'] = $config;
$IDconfig=$config['id'];


$query="
	SELECT 
		accesos.*, 
		paneles.USU_usuarios_TReCC.nombre as nombreusu 
	FROM 
		accesos
	LEFT JOIN 
		paneles.USU_usuarios_TReCC 
	ON 
		paneles.USU_usuarios_TReCC.id = paneles.accesos.id_usuario 
	WHERE 
		id_paneles='".$PanelI."'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	
$Log['data']['accesos']=array('administrador'=>array(),'editor'=>array(),'visitante'=>array());
while($row = $Consulta->fetch_assoc()){
	foreach($row as $k => $v){
		$Log['data']['accesos'][$row['nivel']][$row['id_usuario']][$k]=utf8_encode($v);
	}
}

$query="
	SELECT * FROM publicacion WHERE zz_AUTOPANEL='$PanelI'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	
$row = $Consulta->fetch_assoc();
$Log['data']['publicacion']=$row['id'];


$Log['res']='exito';	
terminar($Log);
