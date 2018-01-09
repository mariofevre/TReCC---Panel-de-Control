<?php
/**
* ESP_consulta_esp.php
*
 * ejecuta funciones dentro de una aplicaci{on php devolviendo el resultado en formtao json
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los t�rminos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
*/
include ('../includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso com�n.
include ('../registrousuario.php');//buscar el usuario activo.

function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
	exit;
}



if(!isset($_POST['titulo'])){
	$Log['tx'][]='error, falta titulo';
	$Log['res']='err';
	terminar($Log);	
}
if(!isset($_POST['descripcion'])){
	$Log['tx'][]='error, falta titulo';
	$Log['res']='err';
	terminar($Log);	
}
if(!isset($_POST['id'])){
	$Log['tx'][]='error, falta titulo';
	$Log['res']='err';
	terminar($Log);	
}

$query="
	UPDATE
	`paneles`.`ESPitems`
	SET 
	titulo='".utf8_decode($_POST['titulo'])."',
	descripcion='".utf8_decode($_POST['descripcion'])."'
	WHERE
	id='".$_POST['id']."'
	AND
	`zz_AUTOPANEL`='".$PanelI."'
";
$Con=mysql_query($query,$Conec1);

if(mysql_error($Conec1)!=''){
	$Log['tx'][]='error al consultas secciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode(mysql_error($Conec1));
	$Log['res']='err';
	terminar($Log);
}

$Log['res']='exito';
terminar($Log)
?>