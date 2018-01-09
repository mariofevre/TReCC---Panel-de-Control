<?php 
/**
* mensajedesarrollo.php
*
* mensajedesarrollo.php se incorpora en la carpeta raiz en tanto resulta una de las funcionesbásicas para el funcionamiento de la aplicacion 
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	general
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2014 TReCC SA
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

//al inicio define las vaiables globales y setea el tiemo de referencia 0.
//session_start();//
global $cadenatemporalativa, $duraconacum, $duration, $time, $starttime;



function registroLOG(){

	
	$query="
		INSERT INTO
			`paneles`.`USUlog`
		SET
			id_p_usuarios_id='".$_SESSION['panelcontrol']->USUARIO."',
			server='".str_replace("'","`",print_r($_SERVER, true))."',
			post='".str_replace("'","`",print_r($_POST, true))."',
			get='".str_replace("'","`",print_r($_GET, true))."',
			fecha='".date("Y-m-d")."',
			hora='".date("H:i:s")."'
	";
	
	mysql_query($query,$_SESSION['panelcontrol']->Conec1);
	echo mysql_error($_SESSION['panelcontrol']->Conec1);
	//echo mysql_insert_id($_SESSION['panelcontrol']->Conec1);
}




function rendimiento_checkpoint($nombre,$dir,$file,$line){
	global $cadenatemporalativa, $duraconacum, $duration, $time, $starttime, $Conec1;	
	$cadenatemporalativa='si';
	$HOY=date("Y-m-d");
	$duraconacum = number_format((microtime(true) - $starttime),6);		
	$duration = number_format((microtime(true) - $time),6);
	$time = microtime(true);
	if($duration>'0.3'){$stat='zarpado';}elseif($duration>='0.1'){$stat='resaltado';}else{$stat='';}
	
	$msg['title']=utf8_encode($dir.PHP_EOL.$file.PHP_EOL.$line);	
	$msg['linea']=utf8_encode($nombre."<br><span class='$stat'>".$duration."s.</span>(ac:".number_format((microtime(true) - $starttime),4)."s.)");
	
	$_SESSION['DEBUG']['mensajes'][]=$msg;

	//echo "<pre>".__FILE__;print_r($GLOBALS);echo "</pre>";
	/*if($duration>2){
		$query="
			INSERT INTO `avisos`.`debug`
			SET
			`tiempo`='$duration',
			`mensaje`='$nombre',
			`url`='".$_SERVER['REQUEST_URI']."',
			`archivo`='$file',
			`ruta`='$dir',
			`linea`='$line',						
			`zz_AUTOFECHACREACION`='$HOY'		
		";
		mysql_query($query,$Conec1);
		if(mysql_error($Conec1)!=''){
			$_SESSION['DEBUG']['mensajes'][]= "Error mysql: ".mysql_error($Conec1);
			$_SESSION['DEBUG']['mensajes'][]= "llamada mysql: ".$query;
		}
	}*/

	
}



function rendimiento_imprimir(){
	echo "";
global $cadenatemporalativa, $UsuarioAcc, $duraconacum, $duration, $time, $starttime, $Conec1;
	//include_once(dirname(__FILE__).'/../includes/usuarioaccesos.php');
	//$Usuario = usuarioaccesos();// en ./usuarioaccesos.php
	rendimiento_checkpoint('fin del seguimiento: ',__DIR__,__FILE__,__LINE__);//medicion rendimiento lamp
		
	if($UsuarioAcc!="administrador"){
		echo"<div class='recuadros ventanadesarrollo'>";
		foreach($_SESSION['DEBUG']['mensajes'] as $mensaje){
			echo "<p>";
			echo $mensaje;
			echo "</p>";
		}
		echo"</div>";
	}	
	unset($_SESSION['DEBUG']['mensajes']);
	$cadenatemporalativa='no';
}

if($cadenatemporalativa!='si'){
$time = microtime(true);
$starttime = microtime(true);
$duraconacum = 0;		
$duration = 0;		
$cadenatemporalativa=='si';
rendimiento_checkpoint('acceso a url: ',__DIR__,__FILE__,__LINE__);//medicion rendimiento lamp
}