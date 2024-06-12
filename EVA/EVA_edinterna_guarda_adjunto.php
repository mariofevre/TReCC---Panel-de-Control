<?php

/**
* COM_edinterna_guarda_adjunto.php
*
 * guarda documetnos adjuntos a una comunicación
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

/**
*consultda por.
* COM_ed_guarda_adjunto
* COM_ed_guarda_com 
*
*	$Log
	$tipo
	$ext
	$NombreTemp
	$ArchivoOrig
	$IdCom

*/


if(!function_exists("terminar")){
	echo "error:".__FILE__;
	exit;
}
 
if(!isset($UsuarioAcc)){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['res']='err';
    terminar($Log); 
}
$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'no',
'visitante'=>'no'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}elseif($nivelespermitidos[$UsuarioAcc]!='si'){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 	
}


$VarRequeridas=array(
	'Log',
	'tipo',
	'ext',
	'NombreTemp',
	'ArchivoOrig',
	'IdInst'
);

foreach($VarRequeridas as $v){
	if(!isset($$v)){
		$Log['tx'][]='no se encuentra la variable $'.$v.' en '.__FILE__;
		$Log['res']='err';
		terminar($Log);	
	}
}

$Tabla='EVAinstanciasAdjuntos';
if($tipo=='origen'){
	$Dest="origen/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			
	
}elseif($tipo=='contenido'){
	$Dest="origen/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='no';			
	
}elseif($tipo=='imagenembebida'){
	$Dest="embebidas/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='no';
}elseif($tipo=='adjunto'){
	$Dest="adjuntos/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='no';		
}else{
	$Log['tx'][]='no hemos comprendido el tipo de archivo enviado (origen, adjunto, contenido, imagenembebida';
	$Log['res']='err';
	terminar($Log);
}

$PathBase="./documentos/p_".$PanelI."/EVA/".$Dest;
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


//if(isset($extVal[strtolower($ext)])){
$Log['tx'][]= "guardado en: ".$nombre."<br>";

if (!copy($NombreTemp, $nombre)) {
   	$Log['tx'][]= "Error al copiar $pathI...\n";
	$Log['res']='err';
	terminar($Log);
}else{
	chmod($nombre, 0777);
	$Log['tx'][]= "archivo guardado";
}



$query="
INSERT INTO 
	`paneles`.`EVAinstanciasAdjuntos`
SET
`id_p_EVAinstancias`='".$IdInst."',
`FI_documento`='".$nombre."',
`FI_nombreorig`='".$ArchivoOrig."',
`zz_AUTOPANEL`='".$PanelI."',
`tipo`='".$tipo."'
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

$nuevonombre=str_replace("[NID]", $NID, $nombre);
$Log['data']['ruta']=$nuevonombre;

if(!rename($nombre,$nuevonombre)){		
 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
	$Log['res']='err';
	terminar($Log);	
}else{
 	$query="
 		UPDATE 
 			`paneles`.`EVAinstanciasAdjuntos`
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


//include('./COM/COM_proc_zzreg_adjuntos.php');
	// utiliza $IdInst con el id de la comuniocanio de referncia

$query="
	SELECT `EVAinstanciasAdjuntos`.`id`,
    `EVAinstanciasAdjuntos`.`id_p_EVAinstancias`,
    `EVAinstanciasAdjuntos`.`descripcion`,
    `EVAinstanciasAdjuntos`.`FI_documento`,
    `EVAinstanciasAdjuntos`.`FI_nombreorig`,
    `EVAinstanciasAdjuntos`.`zz_borrada`,
    `EVAinstanciasAdjuntos`.`zz_AUTOPANEL`,
    `EVAinstanciasAdjuntos`.`tipo`
FROM `paneles`.`EVAinstanciasAdjuntos`
WHERE id = '$NID'
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar columnas';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}			
while($row = $Consulta->fetch_assoc()){
	foreach($row as $k => $v){
		$Log['data'][$k]=utf8_encode($v);
	}
}

/*
$query="
	UPDATE 
		EVAinstancias
	SET
		zz_ultimamodif=UNIX_TIMESTAMP()
	WHERE 
		id='".$IdCom."'
	AND
		`zz_AUTOPANEL`='".$PanelI."'
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar columnas';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}		
*/
	
$Log['tx'][]='adjunto guardado';

?>
