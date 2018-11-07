<?php

/**
* COM_ed_guarda_adjunto.php
*
 * guarda documetnos adjuntos a una comunicaci�n cargados en el formulacion de edicion de una comunicaci�n.
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
ini_set('display_errors', '1');
chdir('..'); 

include ('./includes/header.php');

ini_set('display_errors',true);



$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['res']='';
$Log['loc']='';
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
'editor'=>'si',
'relevador'=>'si',
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

$HabilitadoEdicion='no';
$DisableEdicion="disabled='disabled'";


if(!isset($_POST['nfile'])){
	$Log['tx'][]='no fue definido el tipo de contenido';
	$Log['res']='err';
	terminar($Log);
}
$Log['data']['nf']=$_POST['nfile'];

if(!isset($_FILES['upload'])){
	$Log['tx'][]='no fue enviada la imagen en la variable FILES[upload]';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['id_p_DOCversion_id'])){
	$Log['tx'][]='no fue enviada la imagen en la variable id_p_DOCversion_id';
	$Log['res']='err';
	terminar($Log);
}
if(!isset($_POST['tipo'])){
	$Log['tx'][]='no fue enviado el tipo, se asume que es un documento adjunto';
	$_POST['tipo']='adjunto';
}
if($_POST['tipo']==''){
	$Log['tx'][]='no fue enviado el tipo, se asume que es un documento adjunto';
	$_POST['tipo']='adjunto';
}


	$Log['tx'][]= "archivo enviado";
	
	$ArchivoOrig = $_FILES['upload']['name'];	
	$Log['tx'][]= "cargando: ".$ArchivoOrig;
	
	$b = explode(".",$ArchivoOrig);
	$ext = strtolower($b[(count($b)-1)]);	

	
	$Tabla ='DOCarchivos';
	
	
if($_POST['tipo']=='origen'){
	$Dest="origen/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			
	
}elseif($_POST['tipo']=='contenido'){
	$Dest="origen/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='no';			
	
}elseif($_POST['tipo']=='adjunto'){
	$Dest="adjuntos/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='no';
}else{
	$Log['tx'][]='no hemos comprendido el tipo de archivo enviado (origne, adjunto, contenido';
	$Log['res']='err';
	terminar($Log);
}

	$PathBase="./documentos/p_".$PanelI."/DOC/".$Dest;
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

	$cod = cadenaArchivo(10); // define un c�digo que evita la predictivilidad de los documentos ante b�squedas maliciosas
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
	$query="
	INSERT INTO 
        `paneles`.`DOCarchivos`
    SET
        `id_p_DOCversion_id`='".$_POST['id_p_DOCversion_id']."',
        `descripcion`='-sin descripcion-',
        `FI_documento`='".$nombre."',
        `FI_nombreorig`='".$ArchivoOrig."',
        `zz_AUTOPANEL`='".$PanelI."'
	";
	
	$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar columnas';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	
	$NID = $Conec1->insert_id;
	
	
	if($NID<1){
		$Log['tx'][]='error al generar un nuevo id: '.$NID;
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	$Log['data']['nid']=$NID;
	$nuevonombre=str_replace("[NID]", $NID, $nombre);
	$Log['data']['ruta']=$nuevonombre;
	
	if(!rename($nombre,$nuevonombre)){		
	 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
		$Log['res']='err';
		terminar($Log);	
	}else{
	 	$query="
	 		UPDATE 
	 			`paneles`.`DOCarchivos`
	 		SET 
	 			FI_documento = '$nuevonombre' 
	 		WHERE
	 			id='$NID'
	 	";
		$Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar columnas';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}		
	}

$Log['tx'][]='completado';
$Log['res']='exito';

terminar($Log);

?>
