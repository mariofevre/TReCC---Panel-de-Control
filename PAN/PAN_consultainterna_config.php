<?php
/**
* PAN_consultainterna_config.php
*
* genera una consulta a la base de datos y genera un array con sus contenidos, definiendo la configuraci�n del panel activo
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
* y/o modificarlo bajo los t�rminos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
*/

 //if($_SERVER[SERVER_ADDR]=='192.168.0.252')ini_set('display_errors', '1');ini_set('display_startup_errors', '1');ini_set('suhosin.disable.display_errors','0'); error_reporting(-1);/* verificaci�n de seguridad */

$query="
	SELECT 
		configuracion.*,
		paneles.nombre,
		paneles.descripcion,
		paneles.fin
	FROM 
		configuracion,
		paneles
	WHERE 
		configuracion.zz_AUTOPANEL='$PanelI'
    AND
		paneles.id=configuracion.zz_AUTOPANEL;
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
	$Log['tx'][]='creando registro de configuraci�n para este panel';
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
	$Log['tx'][]='consultendo el registro creado de configuraci�n para este panel';
	
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
		
$Config = $Consulta->fetch_assoc();
		
?>
