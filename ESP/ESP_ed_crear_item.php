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

$query="
	SELECT `ESPitems`.`id`,
	    orden
	FROM `paneles`.`ESPitems`
	WHERE `ESPitems`.`zz_AUTOPANEL`='".$PanelI."'
	AND id_p_ESPitems_anidado ='0'
	ORDER BY orden
";
$Con=mysql_query($query,$Conec1);

if(mysql_error($Conec1)!=''){
	$Log['tx'][]='error al consultas secciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode(mysql_error($Conec1));
	$Log['res']='err';
	terminar($Log);
}
while ($fila=mysql_fetch_assoc($Con)){
	$ultimoorden=$fila['orden'];
}

$ultimoorden++;
$query="
	INSERT INTO
	`paneles`.`ESPitems`
	SET 
	`zz_AUTOPANEL`='".$PanelI."',
	orden='".$ultimoorden."'
";
$Con=mysql_query($query,$Conec1);

if(mysql_error($Conec1)!=''){
	$Log['tx'][]='error al consultas secciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode(mysql_error($Conec1));
	$Log['res']='err';
	terminar($Log);
}

$NID=mysql_insert_id($Conec1);
if($NID<1){
	$Log['tx'][]='error al crear Nid';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode(mysql_error($Conec1));
	$Log['res']='err';
	terminar($Log);
}

$Log['data']['nid']=$NID;
$Log['res']='exito';
terminar($Log)
?>