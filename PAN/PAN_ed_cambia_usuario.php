<?php
/**
* PAN_consultainterna_config.php
*
* genera una consulta a la base de datos y genera un array con sus contenidos, definiendo la configuración del panel activo
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

chdir('..'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.

ini_set('display_errors', true);

$Hoy=date('Y-m-d');

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
'editor'=>'no',
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

$VarOblig=array(
 'log',
 'password_act', 
 'mail', 
 'nombre', 
 'apellido'
);
foreach($VarOblig as $v){
	if(!isset($_POST[$v])){
		$Log['tx'][]='error falta variable.'.$v;
	    $Log['res']='err';
	    terminar($Log); 
	}
}

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}

if($_POST['zz_AUTOPANEL']!=$PanelI){
	$Log['tx'][]='error, los datos enviados ('.$_POST['zz_AUTOPANEL'].') no son del panel activo ('.$PanelI.')';
    $Log['res']='err';
    terminar($Log); 	
}
 
 if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}



$query="
	SELECT usuarios.*, acceso.id_paneles as paneldef
	FROM 
	(
	(SELECT log, zz_pass, id, 'local' as host, mail FROM paneles.USU_usuarios_TReCC)
	UNION
	(SELECT log, zz_pass, id, 'visitante' as host, mail FROM paneles.usuarios)
	)as usuarios 
	
	LEFT JOIN 
		(SELECT * FROM
			(SELECT * 
				FROM paneles.USU_usuarios_TReCC_altas 
				ORDER BY fecha DESC, id desc
			) as listaordenada
			GROUP BY id_usuarios_id_nombre
		)ultimoestado
		ON ultimoestado.id_usuarios_id_nombre = usuarios.id	
	
	LEFT JOIN 
		(SELECT 
			* 
			FROM paneles.accesos 
			GROUP BY id_usuario
			ORDER BY nivel DESC 
		)as acceso
		ON acceso.id_usuario = usuarios.id
	
	WHERE log='".$_POST['log']."' AND (ultimoestado.nombre='alta' OR ultimoestado.nombre is null)
	";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base de usuarios';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log);
}
if($Consulta->num_rows==0){
	$Log['mg'][]="No existe el login introducido o ha sido dado de baja";
	$Log['data']['accion']='stop';
	$Log['tx'][]="No existe el login introducido o ha sido dado de baja";
    $Log['res']='err';
    terminar($Log);	
}

$row=$Consulta->fetch_assoc();

if($row["zz_pass"]!=md5($_POST['password_act'])){

	$Log['mg'][]="Password incorrecto!";
    $Log['data']['accion']='stop';
    $Log['tx'][]="Password incorrecto!";
    $Log['res']='err';
    terminar($Log);
    
}
if($row['host']=='local'){
	$tabla='USU_usuarios_TReCC';
}else{
	$tabla='usuarios';
}


if($tabla=='USU_usuarios_TReCC'){
	$Log['mg'][]="Los usuarios de IntrTReCC no pueden cambiar su pass desde este panel.";
    $Log['tx'][]="permiso denegado";
    $Log['res']='exito';
    terminar($Log);
}	


$query="
UPDATE paneles.$tabla 
	SET
		nombre='".$_POST['nombre']."',
		apellido='".$_POST['apellido']."',
		mail='".$_POST['mail']."'
	WHERE
		
		log='".$_POST['log']."'
	AND
	 	id='".$UsuarioI."'
		
	
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	


$query="
INSERT INTO USU_accesos_historial
	(
	
		id_p_USUusuarios,
		tiempounix, 
		evento, 
		comentario, 
		origen_file, 
		origen_usuario
		
	)VALUES (
	
		'".$UsuarioI."',
		'".time()."',
		'otro',
		'cambio en perfil usu: ".$_POST['log'].", nom:".$_POST['nombre'].", ape:".$_POST['apellido'].", mail:".$_POST['mail']."',
		'".__FILE__." ".__LINE__."', 
		'".$UsuarioI."'
	)
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar la base';
	$Log['tx'][]=$Conec1->error;
	$Log['tx'][]=$query;
	$Log['res']='error';
	terminar($Log);		
}	




if($_POST['password_nue']!=''){
	
	if($_POST['password_con']!=$_POST['password_nue']){
				
		$Log['mg'][]="el password de confirmación no coincide con el password nuevo. vuelva a intentarlo.";
	    $Log['tx'][]="Passwords inconsistentes";
	    $Log['res']='exito';
	    terminar($Log);
    
	}
	
	if($tabla=='USU_usuarios_TReCC'){
		$Log['mg'][]="Los usuarios de IntrTReCC no pueden cambiar su pass desde este panel.";
	    $Log['tx'][]="permiso denegado";
	    $Log['res']='exito';
	    terminar($Log);
	}	
	
	$query="
	UPDATE paneles.$tabla 
		SET
			zz_pass='".md5($_POST['password_nue'])."'
		WHERE
			log='".$_POST['log']."'
		AND
		 	id='".$UsuarioI."'
		
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}	

$query="
	INSERT INTO USU_accesos_historial
		(
		
			id_p_USUusuarios,
			tiempounix, 
			evento, 
			comentario, 
			origen_file, 
			origen_usuario
			
		)VALUES (
		
			'".$UsuarioI."',
			'".time()."',
			'otro',
			'cambio de contyraseña usu: ".$_POST['log']."',
			'".__FILE__." ".__LINE__."', 
			'".$UsuarioI."'
		)
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



$Log['res']='exito';
terminar($Log);		
		
?>
