<?php 
/**
* preferencias.php
*
* se incorpora en la carpeta includes 
* ya que contiene funciones recurrentes para la gestión de la preferencias del usuario
* 
* @package    	TReCC panel de control
* @subpackage 	Comun
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2015 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) intraTReCC y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) paneldecontrol.
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



function PREFconsultas(){
	
	
return '';
}


function PREFactualizar($usuario,$panel,$valores){
	global $PanelI, $UsuarioI, $Conec1;
	
	if($UsuarioI!=$usuario||($panel!=$PanelI&&$panel!='')||count($valores)==0){
			$_SESSION['DEBUG']['mensajes'][]="actualizando preferencias";	
	}
	
	$query="
		SELECT 
			`USUpref`.`id_p_usuarios_id`,
		    `USUpref`.`id_p_paneles_id`
		FROM `paneles`.`USUpref`
		WHERE `USUpref`.`id_p_usuarios_id`='$usuario' AND `USUpref`.`id_p_paneles_id`='$panel'
	";
	$consulta =	mysql_query($query,$Conec1);
	$_SESSION['DEBUG']['mensajes'][]=mysql_error($Conec1);
	
	unset($set);
	
	foreach($valores as $campo => $valor){
		if($campo!='id_p_usuarios_id'&&$campo!='id_p_paneles_id'){
			$set .= "`$campo` = '$valor', ";
		}
	}
	$set=substr($set,0,-2);
	
	if(mysql_num_rows($consulta)==0){
		$query="
			INSERT INTO `paneles`.`USUpref` SET
			`id_p_usuarios_id`= '$usuario',
			`id_p_paneles_id` = '$panel',
			$set
		";		
		//echo $query;
	}else{
		$query="
			UPDATE `paneles`.`USUpref` SET
				$set
			WHERE
			`id_p_usuarios_id`= '$usuario'
			AND
			`id_p_paneles_id` = '$panel'
		";			
		//echo $query;
	}
	mysql_query($query,$Conec1);	
	$_SESSION['DEBUG']['mensajes'][]= mysql_error($Conec1);

}