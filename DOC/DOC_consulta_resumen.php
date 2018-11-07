<?php 
/**
* DOC_consulta_versionas.php 
*
* imprime JSON con datos de un conjunto de versiones.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
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

chdir(getcwd().'/../'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
include ('./registrousuario.php');//buscar el usuario activo.

ini_set('display_errors', '1');

$HOY=date("Y-m-d");

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['res']='';
function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
	exit;
}

	$query="
		SELECT 
			`PANestadisticasDOC`.`id`,
		    `PANestadisticasDOC`.`zz_AUTOPANEL`,
		    `PANestadisticasDOC`.`fechahora`,
		    `PANestadisticasDOC`.`mes`,
		    `PANestadisticasDOC`.`ano`,
		    `PANestadisticasDOC`.`totDocs`,
		    `PANestadisticasDOC`.`totAprob`,
		    `PANestadisticasDOC`.`totAprobP` as totAprob_P,
		    `PANestadisticasDOC`.`totVerEval`,
		    `PANestadisticasDOC`.`totVerEvalP` as totVerEval_F,
		    `PANestadisticasDOC`.`totPres`,
		    `PANestadisticasDOC`.`statPend`,
		    `PANestadisticasDOC`.`statEval`,
		    `PANestadisticasDOC`.`statRev`,
		    `PANestadisticasDOC`.statAnulado
		FROM `paneles`.`PANestadisticasDOC`
		WHERE zz_AUTOPANEL='".$PanelI."'
		ORDER BY fechahora DESC
		LIMIT 1
	";
	$Con=mysql_query($query,$Conec1);
	if(mysql_error($Conec1)!=''){
		$Log['tx'][]='error al consuoltar base de datos';
		$Log['tx'][]=mysql_error($Conec1);
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log);
	}
	
	foreach(mysql_fetch_assoc($Con) as $k => $v){
		$Log['data'][$k]=utf8_encode($v);
	}

	$micro_date = microtime();
	$date_array = explode(" ",$micro_date);
	$Millidate = $date_array[1]*1000+round($date_array[0]*1000);
	$hace=number_format((($Millidate-$Log['data']['fechahora'])/1000/60/60),0);
	$Log['data']['antig']=$hace;
	
	$Log['res']='exito';
	terminar($Log);	
	
?>