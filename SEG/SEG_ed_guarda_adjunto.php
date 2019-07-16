<?php

/**
* SEG_ed_guarda_adjunto.php
*
* recibe y guarda archivos y genera un registro de los mismos asociado a un seguimiento o una acción, si puede gerenra una vista en miniatura.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Lista de seguimiento / tracking / segumiento
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 - 2019 TReCC SA
* @license    	http://www.gnu.org/licenses/agpl.html GNU Affero General Public License, version 3 (AGPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU Affero General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU Affero General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/
ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['loc']='';
$Log['res']='';
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
}



$HOY=date("Y-m-d");
$Tabla='SEGacciones_adjuntos';

if(!isset($_POST['idacc'])){
	$Log['tx'][]='no fue definida la variable idacc';
	$Log['res']='err';
	terminar($Log);
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

	$PathBase="./documentos/p_".$PanelI."/SEG/original/";
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
									
	$nombreprliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			

	$cod = cadenaArchivo(10); // define un código que evita la predictivilidad de los documentos ante búsquedas maliciosas
	$nombre='[NID]'.$cod.".".$ext;
	$ruta=$path.$nombre;
	
	$extVal['jpg']='1';
	$extVal['jpeg']='1';
	$extVal['png']='1';
	$extVal['tif']='1';
	$extVal['tiff']='1';
	$extVal['bmp']='1';
	$extVal['gif']='1';
	
	$Tipo='';
	if(isset($extVal[strtolower($ext)])){
		$Log['tx'][]= "tipo Imagen";	
		$Tipo="img";	
	}	
	
	if(strtolower($ext)=='pdf'){
		$Log['tx'][]= "tipo pdf";	
		$Tipo="pdf";	
	}	

	unset($extVal);
	$extVal['xls']='1';
	$extVal['xlsx']='1';
	$extVal['ods']='1';
	if(isset($extVal[strtolower($ext)])){
		$Log['tx'][]= "tipo hoja de calculo";	
		$Tipo="calc";	
	}	
	
	unset($extVal);	
	$extVal['doc']='1';
	$extVal['docx']='1';
	$extVal['odt']='1';
	if(isset($extVal[strtolower($ext)])){
		$Log['tx'][]= "tipo texto";	
		$Tipo="tx";	
	}	
		
	unset($extVal);
	$extVal['dwg']='1';
	$extVal['dxf']='1';
	if(isset($extVal[strtolower($ext)])){
		$Log['tx'][]= "tipo cad";	
		$Tipo="cad";	
	}				
				
	if (!copy($_FILES['upload']['tmp_name'], $ruta)) {	
	    $Log['tx'][]="Error al copiar $ruta";
		$Log['res']="err";
		terminar($Log);		
	}
		
		//$extVal['pdf']='1';
	//$extVal['zip']='1';
	
	/*}else{
		$ms="solo se aceptan los formatos:";
		foreach($extVal as $k => $v){$ms.=" $k,";}
		$Log['mg'][]= $ms;
		$ArchivoOrig='';
		$Log['res']='err';
		terminar($Log);
	}*/	

	$Log['data']['adjunto']['id_p_SEGacciones']=$_POST['idacc'];
	$Log['data']['adjunto']['FI_documento']=$nombre;
	$Log['data']['adjunto']['FI_tipo']=$Tipo;
	$Log['data']['adjunto']['FI_extension']=$ext;
	$Log['data']['adjunto']['nombre']=$ArchivoOrig;
	$Log['data']['adjunto']['zz_AUTOFECHACREACION']=$HOY;
	$Log['data']['adjunto']['zz_AUTOPANEL']=$PanelI;
	$Log['data']['adjunto']['zz_AUTOUSUCREA']=$UsuarioI;
	
	
	$query="
	INSERT INTO 
		`paneles`.`SEGacciones_adjuntos`
	SET
	id_p_SEGacciones='".$_POST['idacc']."',
	`FI_documento`='".$nombre."',
	`FI_tipo`='".$Tipo."',
	`FI_extension`='".$ext."',
	nombre='".$ArchivoOrig."',
	zz_AUTOFECHACREACION='".$HOY."',
	zz_AUTOPANEL='".$PanelI."',
	zz_AUTOUSUCREA = '".$UsuarioI."'
	";
	
	$Consulta = $Conec1->query($query);
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
	$nuevaruta=$PathBase.$nuevonombre;
	
	$Log['data']['adjunto']['id']=$NID;
	$Log['data']['adjunto']['FI_documento']=$nuevonombre;
	$Log['data']['adjunto']['FI_muestra']='./img/file_'.$Tipo.'.png';
	
	$Log['data']['ruta']=$nuevonombre;
	
	if(!rename($ruta,$nuevaruta)){		
	 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
		$Log['res']='err';
		terminar($Log);	
	}else{
	 	$query="
	 		UPDATE 
	 			`paneles`.$Tabla 
	 		SET 
	 			FI_documento = '$nuevonombre' 
	 		WHERE
	 			id='$NID'
	 	";
		$Consulta = $Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar columnas';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}	
	}
	
	
	
	$PathMuestra="./documentos/p_".$PanelI."/SEG/muestras/";
	$carpetas= explode("/",$PathMuestra);	
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
	
	
	if($Tipo == 'img'){
		
		$ladomayor=50;					
			//echo "<br>procesando: ".iconv('IBM850','ISO-8859-2', $file).filesize ($carp.$file)." -> ";
		$i = getimagesize($nuevaruta);	
		
			
		if($i[0]>$ladomayor*1.3&&$i[1]>$ladomayor*1.3){
			
			$filterType=imagick::FILTER_BOX;
			$blur=0;
			$bestFit=0;
			$cropZoom=0;
			
		    $imagick = new \Imagick(realpath($nuevaruta));
			
			$ancho = $imagick->getImageWidth();
			$alto = $imagick->getImageHeight();	
			if($ancho>($ladomayor*1.3)&&$alto>($ladomayor*1.3)){
				if($ancho<$alto){
					$nancho=$ladomayor;
					$nalto=$alto*$nancho/$ancho;			
				}else{
					$nalto=$ladomayor;
					$nancho=$ancho*$nalto/$alto;
				}		
			    $imagick->resizeImage($nancho, $nalto, $filterType, $blur, $bestFit);						    
			   // echo "<br>destino: ".$destino.$file. ": $carpetaTemporalA,$carpetaLocal,$carp";
			    $imagick->writeImage ($PathMuestra.$nuevonombre);
				chmod($PathMuestra.$nuevonombre,0777);
			}
		}
		$Log['tx'][]= filesize($PathMuestra.$nuevonombre);
		
		$Log['tx'][]='generada miniatura de imagen';
		
		
		$query="
	 		UPDATE 
	 			`paneles`.$Tabla 
	 		SET 
	 			FI_muestra = '".$nuevonombre."' 
	 		WHERE
	 			id='$NID'
	 	";
		$Consulta = $Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar columnas';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}		
		$Log['data']['adjunto']['FI_muestra']=$PathMuestra.$nuevonombre;
	}elseif($Tipo=='pdf'){
			
		$img = new Imagick();

		if(!isset($_POST['res'])){$_POST['res']='100';}
		if(!isset($_POST['qty'])){$_POST['qty']='80';}
		
		if(!is_numeric($_POST['res'])){
			$Log['mg'][]=utf8_encode('la resolución enviada no es numérica.'.$_POST['res']);
			$Log['res']='err';
			terminar($Log);
		}
		
		if(!is_numeric($_POST['qty'])){
			$Log['mg'][]=utf8_encode('la resolución enviada no es numérica.'.$_POST['qty']);
			$Log['res']='err';
			terminar($Log);
		}
	
		$img->setResolution($_POST['res'], $_POST['res']);
		$img->setCompressionQuality($_POST['qty']); 	
		
		$img->readImage("{$nuevaruta}[0]");
		
		$nombrepdfmuestra=str_replace($ext, 'jpg', $nuevonombre);
		
		$img->writeImage($PathMuestra.$nombrepdfmuestra);	
				
		$Log['tx'][]='generada miniatura de pdf';
		
		$query="
	 		UPDATE 
	 			`paneles`.$Tabla 
	 		SET 
	 			FI_muestra = '".$nombrepdfmuestra."' 
	 		WHERE
	 			id='$NID'
	 	";
		$Consulta = $Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar columnas';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}		
		$Log['data']['adjunto']['FI_muestra']=$PathMuestra.$nombrepdfmuestra;
		
	}elseif($ext=='odt'||$ext=='ods'){
		
		
		$TEMP=sys_get_temp_dir();			
		$comando='unzip '.$nuevaruta.' -d '.$TEMP;
		exec($comando,$exec_res);
		$Log['tx'][]=$comando;
		$nombreODmuestra=str_replace($ext, 'jpg', $nuevonombre);
		
		$scan=scandir($TEMP);
		
		
		if(copy($TEMP.'/Thumbnails/thumbnail.png', $PathMuestra.$nombreODmuestra)) {	
		    $query="
		 		UPDATE 
		 			`paneles`.$Tabla 
		 		SET 
		 			FI_muestra = '".$nombreODmuestra."' 
		 		WHERE
		 			id='$NID'
		 	";
			$Consulta = $Conec1->query($query);
		
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar columnas';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}		
			$Log['data']['adjunto']['FI_muestra']=$PathMuestra.$nombreODmuestra;		
		}else{
			$Log['tx'][]="Error al copiar $PathMuestra.$nombreODmuestra";
		}
  
	}

//echo $query;
$Log['data']['nid']=$NID;
$Log['data']['nf']=$_POST['nfile'];
$Log['data']['ruta']=$nuevonombre;
$Log['tx'][]='completado';
$Log['res']='exito';

terminar($Log);

?>
