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


$Log['data']['niveles'][]=array('nombre'=>'administrador','descripcion'=>utf8_encode('puede hacer todo'));
$Log['data']['niveles'][]=array('nombre'=>'editor','descripcion'=>utf8_encode('puede cargar cualquier dato, puede ver cualquier dato, no puede configurar el panel'));
$Log['data']['niveles'][]=array('nombre'=>'auditor','descripcion'=>utf8_encode('puede ver todos los datos, no puede cargar ningún dato'));
$Log['data']['niveles'][]=array('nombre'=>'relevador','descripcion'=>utf8_encode('puede cargar datos menores, puede ver parte de los datos'));
$Log['data']['niveles'][]=array('nombre'=>'visitante','descripcion'=>utf8_encode('no puede ingresar datos, puede ver parte de los datos'));
	
		
$query="
	SELECT 
		accesos.*, 
		usuarios.id as idusu,
		usuarios.nombre as nombreusu
		
		FROM 
			accesos 
		LEFT JOIN 
			(
				SELECT concat(nombre, ' ', apellido, '(',log,')') as nombre, id 
				FROM usuarios 
			UNION
				SELECT concat(nombre, ' ', apellido, '(',log,')') as nombre, id 
				FROM paneles.USU_usuarios_TReCC
			)as usuarios ON usuarios.id = paneles.accesos.id_usuario

		WHERE 
			id_paneles=$PanelI
			AND
			zz_vigente='1'
			ORDER BY nombreusu
";

$Consulta = $Conec1->query($query);
echo $Conec1->error;

while ($fila = $Consulta->fetch_assoc()) { // loop para todos los usuarios de este nivel
	foreach($fila as $k => $v){
		$Log['data']['accesos'][$fila['id']][$k]=utf8_encode($v);
		
		if(!isset($Log['data']['usuarios']['delPanel'][$fila['idusu']])){$Log['data']['usuarios']['delPanelOrden'][]=$fila['idusu'];}
		$Log['data']['usuarios']['delPanel'][$fila['idusu']][$k]=utf8_encode($v);
		
	}
}



$Log['res']='exito';	
terminar($Log);
