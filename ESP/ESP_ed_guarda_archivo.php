<?php

/**
* INF_ed_seccion.php
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
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
include ('../registrousuario.php');//buscar el usuario activo.


ini_set('display_errors', '1');

$HOY=date("Y-m-d");
$Tabla='ESParchivos';


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

if(!isset($_POST['nfile'])){
	$Log['tx'][]='no fue definido el tipo de contenido';
	$Log['res']='err';
	terminar($Log);
}


if(!isset($_FILES['upload'])){
	$Log['tx'][]='no fue enviada la imagen en la variable FILES[upload]';
	$Log['res']='err';
	terminar($Log);
}

	$Log['tx'][]= "archivo enviado";
	
	$ArchivoOrig = $_FILES['upload']['name'];	
	$Log['tx'][]= "cargando: ".$ArchivoOrig;
	
	$b = explode(".",$ArchivoOrig);
	$ext = strtolower($b[(count($b)-1)]);	

	$PathBase="../documentos/p_".$PanelI."/ESP/original/";
	$path=$PathBase;
	$carpetas= explode("/",$path);	
	$rutaacumulada="";			
	foreach($carpetas as $valor){		
	$Log['tx'][]= "instancia de ruta: $valor ";
	$rutaacumulada.=$valor."/";
		if (!file_exists($rutaacumulada)&&$valor!=''){
			$Log['tx'][]="creando: $rutaacumulada ";
		    mkdir($rutaacumulada, 0777, true);
		    chmod($rutaacumulada, 0777);
		}
	}		
	// FIN verificar y crear directorio				
										
	$nombretipo = $Tabla."[NID]_";
	$nombre=$nombretipo;
	$nombreprliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			
	
	$c=explode('.',$nombre);

	$cod = cadenaArchivo(10); // define un código que evita la predictivilidad de los documentos ante búsquedas maliciosas
	$nombre=$path.$c[0].$cod.".".$ext;
	
	/*
	$extVal['jpg']='1';
	$extVal['png']='1';
	$extVal['tif']='1';
	$extVal['bmp']='1';
	$extVal['gif']='1';
	//$extVal['pdf']='1';
	//$extVal['zip']='1';
	*/
	
	//if(isset($extVal[strtolower($ext)])){
		$Log['tx'][]= "guardado en: ".$nombre."<br>";
		
		if (!copy($_FILES['upload']['tmp_name'], $nombre)) {
		   	$Log['tx'][]= "Error al copiar $pathI...\n";
			$Log['res']='err';
			terminar($Log);
		}else{
			chmod($nombre, 0777);
			$Log['tx'][]= "imagen guardada";
		}
	/*}else{
		$ms="solo se aceptan los formatos:";
		foreach($extVal as $k => $v){$ms.=" $k,";}
		$Log['mg'][]= $ms;
		$ArchivoOrig='';
		$Log['res']='err';
		terminar($Log);
	}*/	

	
	$nombreGuard=str_replace("../", "./", $nombre);
		
	$query="
	INSERT INTO `paneles`.`ESParchivos`
	SET
	`FI_documento`='".$nombreGuard."',
	nombre='".$ArchivoOrig."',
	zz_AUTOFECHACREACION='".$HOY."',
	zz_AUTOPANEL='".$PanelI."',
	zz_AUTOUSUCREA = '".$UsuarioI."'
	";
	
	mysql_query($query,$Conec1);
	if(mysql_error($Conec1)!=''){
		$Log['tx'][]='error al consultar columnas';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode(mysql_error($Conec1));
		$Log['res']='err';
		terminar($Log);
	}
	
	$NID = mysql_insert_id($Conec1);
	if($NID<1){
		$Log['tx'][]='error al generar un nuevo id: '.$NID;
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode(mysql_error($Conec1));
		$Log['res']='err';
		terminar($Log);
	}
	
	
	$nuevonombre=str_replace("[NID]", $NID, $nombre);
	$nuevonombreGuard=str_replace("../", "./", $nuevonombre);
	$Log['data']['ruta']=$nuevonombreGuard;
	
	if(!rename($nombre,$nuevonombre)){		
	 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
		$Log['res']='err';
		terminar($Log);	
	}else{
	 	$query="
	 		UPDATE 
	 			`paneles`.$Tabla 
	 		SET 
	 			FI_documento = '$nuevonombreGuard' 
	 		WHERE
	 			id='$NID'
	 	";
		mysql_query($query,$Conec1);
	
		if(mysql_error($Conec1)!=''){
			$Log['tx'][]='error al consultar columnas';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode(mysql_error($Conec1));
			$Log['res']='err';
			terminar($Log);
		}		
	}

//echo $query;
$Log['data']['nid']=$NID;
$Log['data']['nf']=$_POST['nfile'];
$Log['data']['ruta']=$nuevonombreGuard;
$Log['tx'][]='completado';
$Log['res']='exito';

terminar($Log);

?>