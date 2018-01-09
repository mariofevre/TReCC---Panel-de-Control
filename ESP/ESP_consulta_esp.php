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
ini_set('display_errors',true);
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
include ('../registrousuario.php');//buscar el usuario activo.

$Log['data']=Array();
$Log['tx']=Array();
$Log['res']='';

function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
	exit;
}

$Log['data']['items']=array();//una instancia por item
$Log['data']['items'][0]['archivos']=array();//el id item 0 refiere a archivos localizados en ningún ítem


$query="
	SELECT 
		`ESPitems`.`id`,
	    `ESPitems`.`id_p_ESPitems_anidado`,
	    `ESPitems`.`zz_AUTOPANEL`,
	    `ESPitems`.`zz_borrada`,
	    `ESPitems`.`titulo`,
	    `ESPitems`.`descripcion`,
	    orden
	FROM `paneles`.`ESPitems`
	WHERE
		`ESPitems`.`zz_AUTOPANEL`='".$PanelI."'
		AND zz_borrada=0
	ORDER BY orden asc
";
$Con=mysql_query($query,$Conec1);

if(mysql_error($Conec1)!=''){
	$Log['tx'][]='error al consultas secciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode(mysql_error($Conec1));
	$Log['res']='err';
	terminar($Log);
}
$Log['tx'][]=$query;
while ($fila=mysql_fetch_assoc($Con)){	
	$arr=array();
	foreach($fila as $k => $v){
		$arr[$k]=utf8_encode($v);	
	}
	//$Ord[$fila['id']]=$fila['orden'];	
	$Log['data']['items'][$fila['id']]=$arr;
	$Log['data']['items'][$fila['id']]['archivos']=Array();	
	$Log['data']['orden']['items'][]=$fila['id'];
}


$query="
	SELECT 
		`ESParchivos`.`id`,
	    `ESParchivos`.`FI_documento`,
	    `ESParchivos`.`nombre`,
	    `ESParchivos`.`id_p_ESPitems`,
	    orden
	FROM `paneles`.`ESParchivos`
	WHERE  
		`ESParchivos`.`zz_AUTOPANEL`='".$PanelI."'
		AND
		zz_borrada='0'
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
	$arr=array();	
	foreach($fila as $k => $v){
		$arr[$k]=utf8_encode($v);	
	}	
	$Log['data']['items'][$fila['id_p_ESPitems']]['archivos'][$fila['id']]=$arr;
	$Log['data']['items'][$fila['id_p_ESPitems']]['ordenarchivos'][]=$fila['id'];
}
$Log['res']='exito';
terminar($Log);
?>