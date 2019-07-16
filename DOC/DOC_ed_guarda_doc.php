<?php

/**
* COM_ed_guarda_doc.php
*
* procesa archivos subidos referidos a documentos
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
ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

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


include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

$HOY=date("Y-m-d");


if(isset($_POST['zz_AUTOPANEL'])){
	if($_POST['zz_AUTOPANEL']!=$PanelI){
		$Log['tx'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['mg'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['res']='err';
		terminar($Log);
	}
}


				 
if(!isset($_POST['id_p_grupos_id_nombre_tipoa'])){
	$Log['tx'][]='no fue enviado en criterio respecto de la agrupacoino primaria)';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['id_p_grupos_id_nombre_tipob'])){
	$Log['tx'][]='no fue enviado en criterio respecto de la agrupacoion secundaria)';
	$Log['res']='err';
	terminar($Log);
}


foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}
//tipos de documentos a redefinir
/*
if($_FILES['upload']['type']!='image/jpeg'&&$_FILES['upload']['type']!='image/png'){
	$Log['tx'][]= "tipo de archivo no reconocido";
	$Log['tx'][]= "<br>archivo: ".$_FILES['upload']['name'];
	$Log['tx'][]= "<br>tipo: ".$_FILES['upload']['type'];
	terminar($Log);
}
*/




	//___________________
	/////////////////////
	//CREACIÓN DE GRUPOS
	/////////////////////
	//'''''''''''''''''''


/////GRUPOA
if(strtolower($_POST['id_p_grupos_id_nombre_tipoa'])!='n'&&strtolower($_POST['id_p_grupos_id_nombre_tipoa'])!=''){
	$_POST['id_p_grupos_id_nombre_tipoa'];
}else{
	if($_POST['id_p_grupos_id_nombre_tipoa-n']==''){
		$_POST['id_p_grupos_id_nombre_tipoa']='definir';
	}else{
	
		$query="
			SELECT 
				`grupos`.`id`,
			    `grupos`.`nombre`,
			    `grupos`.`codigo`,
			    `grupos`.`descripcion`
		    
			FROM 
				`paneles`.`grupos`
			WHERE
			`grupos`.`zz_AUTOPANEL`='".$PanelI."'
			AND
			(
				`grupos`.`nombre`='".$_POST['id_p_grupos_id_nombre_tipoa-n']."'
				OR
				`grupos`.`codigo`='".$_POST['id_p_grupos_id_nombre_tipoa-n']."'
			)
			AND
			tipo='a'
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		if($Consulta->num_rows==1){
			$f=$Consulta->fetch_assoc();
			$_POST['id_p_grupos_id_nombre_tipoa']=$f['id'];
			$Log['tx'][]='id grupo a: '.$f['id'];		
		}elseif($Consulta->num_rows<1){
			$query="
				INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_id_nombre_tipoa-n']."',
					`zz_AUTOPANEL`='".$PanelI."',
					tipo='a'
					";
			$Consulta = $Conec1->query($query);
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
					
			$_POST['id_p_grupos_id_nombre_tipoa'] = $Conec1->insert_id;
			if($_POST['id_p_grupos_id_nombre_tipoa']<1){
				$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_id_nombre_tipoa'];
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
		}
	}
}				

/////GRUPOB
if(strtolower($_POST['id_p_grupos_id_nombre_tipob'])!='n'&&strtolower($_POST['id_p_grupos_id_nombre_tipob'])!=''){
	
}else{
	
	if($_POST['id_p_grupos_id_nombre_tipob-n']==''){
		$_POST['id_p_grupos_id_nombre_tipob']='definir';
	}else{
		$query="
			SELECT 
				`grupos`.`id`,
			    `grupos`.`nombre`,
			    `grupos`.`codigo`,
			    `grupos`.`descripcion`
		    
			FROM `paneles`.`grupos`
			WHERE
			`grupos`.`zz_AUTOPANEL`='".$PanelI."'
			AND
			`grupos`.`nombre`='".$_POST['id_p_grupos_id_nombre_tipob-n']."'
			AND
			tipo='b'
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		if($Consulta->num_rows==1){
			$f=$Consulta->fetch_assoc();
			$_POST['id_p_grupos_id_nombre_tipob']=$f['id'];
			$Log['tx'][]='id grupo b: '.$f['id'];		
		}elseif($Consulta->num_rows<1){
			$query="
				INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_id_nombre_tipob-n']."',
					`zz_AUTOPANEL`='".$PanelI."',
					tipo='b'
					";
			$Consulta = $Conec1->query($query);
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
					
			$_POST['id_p_grupos_id_nombre_tipob'] = $Conec1->insert_id;
			if($_POST['id_p_grupos_id_nombre_tipob']<1){
				$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_id_nombre_tipob'];
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
		}
	}
}

////consultando info base
$query="
SELECT
	id, nombre, codigo, tipo
	FROM
	grupos
WHERE
 zz_AUTOPANEL = '".$PanelI."'
 ORDER BY orden ASC, id ASC
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error en consulta grupos: '.$Conec1->error; 
}
while($row = $Consulta->fetch_assoc()){
	$Grupos[$row['tipo']][$row['nombre']]=$row['id'];
	$Grupos[$row['tipo']][$row['codigo']]=$row['id'];				
}	





	//___________________
	/////////////////////
	//GESTIÓN DE ARCHIVOS (opcional. lee archivo enviado y determina que hacer a partir de su nombre y de los parámetros enviados)
	/////////////////////
	//'''''''''''''''''''



if(isset($_POST['modo'])&&isset($_FILES)){
		
	
	// generando nuevo documento a partir de archivo.
	
	if(!isset($_POST['criterio'])){
		$Log['tx'][]='no fue definido el criterio de interpretacion del titulo';
		$Log['res']='err';
		terminar($Log);
	}	
	
	if(!isset($_POST['criterioseparador'])){
		$Log['tx'][]='no fue definido el caracter de separadores del titulo';
		$Log['res']='err';
		terminar($Log);
	}
		
		
	if(!isset($_FILES['upload'])){
		$Log['tx'][]='no fue enviado el archivo en la variable FILES[upload]';
		$Log['tx'][]=print_r($_FILES,true);
		$Log['res']='err';
		terminar($Log);
	}

	if(!isset($_POST['tipo'])){
		$Log['tx'][]='no fue enviada variable tipo (auto/origen/adjunto/contenido)';
		$Log['res']='err';
		terminar($Log);
	}	

	$Type=$_FILES['upload']['type'];
	
	if(!isset($_POST['nf'])){$_POST['nf']=0;}
	$Log['data']['nf']=$_POST['nf'];
	
	$Log['tx'][]= "archivo enviado";
	
	$ArchivoOrig = $_FILES['upload']['name'];	
	$Log['tx'][]= utf8_encode("cargando: ".$ArchivoOrig);
		
		
	if($_POST['tipo']='origen'){
	
	 	$separadores=str_split($_POST['criterioseparador']);
		$ArchivoLimp=str_replace($separadores,$separadores[0],$ArchivoOrig);
		$CriterioLimp=str_replace($separadores,$separadores[0],$_POST['criterio']);
		
		$tt=explode($separadores[0],$CriterioLimp);
			
		$ta=explode($separadores[0],$ArchivoLimp);
		
		$RTAvincular=array();
		//print_r($ta);
		foreach($ta as $k => $v){
			//echo PHP_EOL.$tt[$k]." | ".$k ." ".$v;
			
			if(!isset($tt[$k])){continue;}
			
			if($tt[$k]=='nro' || $tt[$k]=='numero'){			
				$_POST['numero']=$v;
			}elseif($tt[$k]=='ver' || $tt[$k]=='vers' || $tt[$k]=='version'){			
				$version=$v;
			}elseif(strtolower($tt[$k])=='y'){			
				$Y=extraenumeros($v);			
			}elseif(strtolower($tt[$k])=='m'){			
				$m=extraenumeros($v);			
			}elseif(strtolower($tt[$k])=='d'){			
				$d=extraenumeros($v);			
			}elseif(($tt[$k]=='g1'||$tt[$k]=='ga') && $_POST['id_p_grupos_id_nombre_tipoa']=='definir'){
				$Log['tx'][]='solicitud de grupo a detectado';
				if(isset($Grupos['a'][$v])){
					$_POST['id_p_grupos_id_nombre_tipoa']=$Grupos['a'][$v];				
				}else{
					$query="
						INSERT INTO 
							`paneles`.`grupos`
						SET
							`nombre`='".$v."',
							`codigo`='".$v."',
							`zz_AUTOPANEL`='".$PanelI."',
							tipo='a'
					";
					$Consulta = $Conec1->query($query);	
					if($Conec1->error!=''){
						$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
						$Log['tx'][]=utf8_encode($query);
						$Log['tx'][]=utf8_encode($Conec1->error);
						$Log['res']='err';
						terminar($Log);
					}
							
					$_POST['id_p_grupos_id_nombre_tipoa'] = $Conec1->insert_id;
					if($_POST['id_p_grupos_id_nombre_tipoa']<1){
						$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_id_nombre_tipoa'];
						$Log['tx'][]=utf8_encode($query);
						$Log['tx'][]=utf8_encode($Conec1->error);
						$Log['res']='err';
						terminar($Log);
					}
				}
				
			}elseif(($tt[$k]=='g2'||$tt[$k]=='gb') && $_POST['id_p_grupos_id_nombre_tipob']=='definir'){
				if(isset($Grupos['b'][$v])){
					$_POST['id_p_grupos_id_nombre_tipoa']=$Grupos['b'][$v];				
				}else{
					$query="
						INSERT INTO `paneles`.`grupos`
							SET
							`nombre`='".$v."',
							`codigo`='".$v."',
							`zz_AUTOPANEL`='".$PanelI."',
							tipo='b'
							";
					$Consulta = $Conec1->query($query);	
					if($Conec1->error!=''){
						$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
						$Log['tx'][]=utf8_encode($query);
						$Log['tx'][]=utf8_encode($Conec1->error);
						$Log['res']='err';
						terminar($Log);
					}
							
					$_POST['id_p_grupos_id_nombre_tipob'] = $Conec1->insert_id;
					if($_POST['id_p_grupos_id_nombre_tipob']<1){
						$Log['tx'][]='error al generar un nuevo id de grupo: '.$_POST['id_p_grupos_id_nombre_tipoa'];
						$Log['tx'][]=utf8_encode($query);
						$Log['tx'][]=utf8_encode($Conec1->error);
						$Log['res']='err';
						terminar($Log);
					}
				}
			}elseif($tt[$k]=='escala'){				
				$POST['id_p_DOCdef_id_nombre_tipo_escala']='n';
				$POST['id_p_DOCdef_id_nombre_tipo_escala-n']=$v;
			}elseif($tt[$k]=='tipologia'){				
				$POST['id_p_DOCdef_id_nombre_tipo_tipologia']='n';
				$POST['id_p_DOCdef_id_nombre_tipo_tipologia-n']=$v;
			}elseif($tt[$k]=='planta'){				
				$POST['id_p_DOCdef_id_nombre_tipo_planta']='n';
				$POST['id_p_DOCdef_id_nombre_tipo_planta-n']=$v;
			}elseif($tt[$k]=='sector'){				
				$POST['id_p_DOCdef_id_nombre_tipo_sector']='n';
				$POST['id_p_DOCdef_id_nombre_tipo_sector-n']=$v;
			}elseif($tt[$k]=='rubro'){				
				$POST['id_p_DOCdef_id_nombre_tipo_rubro']='n';
				$POST['id_p_DOCdef_id_nombre_tipo_rubro-n']=$v;
			}
			
		}
	}
	
	if($_POST['id_p_grupos_id_nombre_tipoa']=='definir'){$_POST['id_p_grupos_id_nombre_tipoa']='';}
	if($_POST['id_p_grupos_id_nombre_tipob']=='definir'){$_POST['id_p_grupos_id_nombre_tipob']='';}


	$query="
	SELECT `DOCdocumento`.`id`,
	    `DOCdocumento`.`numerodeplano`
	FROM `paneles`.`DOCdocumento`
	WHERE
	    `DOCdocumento`.`zz_AUTOPANEL`='".$PanelI."'
	    AND
	    zz_borrada='0'
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error en consulta grupos: '.$Conec1->error; 
	}
	
	while($row = $Consulta->fetch_assoc()){
		$Planos[$row['numerodeplano']]['id']=$row['id'];
	}	
	
	$cant=0;
	if(!isset($_POST['numero'])){
		$cant=count($Planos);
		$txcant=str_pad($cant, 6,"0",STR_PAD_LEFT);
		while(isset($Planos[$txcant])){
			$cant++;		
		}
		$cant++;
		$_POST['numero']=str_pad($cant, 6,"0",STR_PAD_LEFT);
	}
	
	unset($idVersion);
		
	if(isset($Planos[$_POST['numero']])){
		
		$_POST['iddoc'] = $Planos[$_POST['numero']]['id'];	
		
		///verifica si existe la version
		$query="
			SELECT 
				`DOCversion`.`version`,
				`DOCversion`.`id`			
			FROM
				`paneles`.`DOCversion`			
			WHERE
			    `DOCversion`.`id_p_DOCdocumento_id`='".$_POST['iddoc']."'
			    AND
			    `DOCversion`.`zz_borrada`='0'
			    AND
			    `zz_AUTOPANEL`='".$PanelI."'
			order by version asc
		";
		$Consulta = $Conec1->query($query);
		
		if($Conec1->error!=''){
			$Log['tx'][]='error en consulta versiones: '.$Conec1->error;
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);	 
		}
	
		if(!isset($version)){
			$Log['tx'][]='generando string version automaticametne';
			while($row = $Consulta->fetch_assoc()){
				$ultTx=$row['version'];
			}
			$ultA = preg_replace("/[^a-zA-Z]+/", "", $ultTx);
			$ultN=preg_replace("/[^0-9]/","",$ultTx);
			$ultN++;
			$version=$ultA.$ultN;
			$Consulta->data_seek(0);
		}
	
		while($row = $Consulta->fetch_assoc()){
			if($row['version']==$version){
				$idVersion=$row['id'];
			}
		}
	
				
	}else{
		$_POST['accion']='crear';
		if(!isset($_POST['id_p_DOCdef_id_nombre_tipo_escala'])){$_POST['id_p_DOCdef_id_nombre_tipo_escala']='';}
		if(!isset($_POST['id_p_DOCdef_id_nombre_tipo_rubro'])){$_POST['id_p_DOCdef_id_nombre_tipo_rubro']='';}
		if(!isset($_POST['id_p_DOCdef_id_nombre_tipo_planta'])){$_POST['id_p_DOCdef_id_nombre_tipo_planta']='';}
		if(!isset($_POST['id_p_DOCdef_id_nombre_tipo_sector'])){$_POST['id_p_DOCdef_id_nombre_tipo_sector']='';}
		if(!isset($_POST['id_p_DOCdef_id_nombre_tipo_tipologia'])){$_POST['id_p_DOCdef_id_nombre_tipo_tipologia']='';}
		if(!isset($_POST['descripcion'])){$_POST['descripcion']='';}	
		$version='001';	
	}
	
	if(!isset($idVersion)){
		$query="
			INSERT INTO `paneles`.`DOCversion`
			SET
			`version`='$version',
			`zz_AUTOFECHACREACION`='$HOY',
			`zz_AUTOPANEL`='$PanelI'
		";	
		$Consulta = $Conec1->query($query);		
		if($Conec1->error!=''){
			$Log['tx'][]='error al crear version';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		$idVersion = $Conec1->insert_id;
	}
	$Log['data']['version']['id']=$idVersion;	
	
	
	$b = explode(".",$ArchivoOrig);
	$ext = strtolower($b[(count($b)-1)]);	
	
	$PathBase="./documentos/p_".$PanelI."/documentacion/";
	
		$Tabla='DOCarchivos';
		$Dest="archivo/";
		$nombretipo = $Tabla."[NID]";
		$nombrepreliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			
	
		$path=$PathBase.$Dest;
	
	$carpetas= explode("/",$path);	
	$rutaacumulada="";			
	foreach($carpetas as $valor){		
		$Log['tx'][]= utf8_encode("instancia de ruta: $valor ");
		$rutaacumulada.=$valor."/";
		if (!file_exists($rutaacumulada)&&$valor!=''){
			$Log['tx'][]="creando: $rutaacumulada ";
		    mkdir($rutaacumulada, 0777, true);
		    chmod($rutaacumulada, 0777);
		}
	}		
	// FIN verificar y crear directorio				

	$nombre=$nombretipo;
	
	$c=explode('.',$nombre);
	
	$cod = cadenaArchivo(10); // define un código que evita la predictivilidad de los documentos ante búsquedas maliciosas
	$nombre=$path.$c[0]."_".$cod.".".$ext;
	
	//$extVal['docx']='1';
	//$extVal['doc']='1';
	//$extVal['odt']='1';
	//$extVal['pdf']='1';
	//$extVal['jpg']='1';
	//$extVal['png']='1';
	//$extVal['tif']='1';
	//$extVal['bmp']='1';
	//$extVal['gif']='1';
	//$extVal['pdf']='1';
	//$extVal['zip']='1';
	
	if(isset($extVal[strtolower($ext)])||1==1){
		$Log['tx'][]= "guardado en: ".$nombre."<br>";
		
		if (!copy($_FILES['upload']['tmp_name'], $nombre)) {
		   	$Log['tx'][]= "Error al copiar $pathI...\n";
			$Log['res']='err';
			terminar($Log);
		}else{
			chmod($nombre, 0777);
			$Log['tx'][]= "documento guardado";
		}
	}else{
		$ms="solo se aceptan los formatos:";
		foreach($extVal as $k => $v){$ms.=" $k,";}
		$Log['mg'][]= $ms;
		$ArchivoOrig='';
		$Log['res']='err';
		terminar($Log);
	}	
	
	$nombreGuard=str_replace("../", "./", $nombre);
	
	$query="
		INSERT INTO 
		`paneles`.`DOCarchivos`
		SET
		`id_p_DOCversion_id`='$idVersion',
		`descripcion`='por carga masiva',
		`FI_documento`='$nombreGuard',
		`FI_nombreorig`='$ArchivoOrig',	
		`zz_AUTOPANEL`='$PanelI'
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al crear registro del archivo guardado';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}		
	$NID=$Conec1->insert_id;
	$Log['data']['docarchivo']['id']=$NID;



	
	if($nombrepreliminar=='si'){
		$nuevonombre=str_replace("[NID]", $NID, $nombre);
		$nuevonombreGuard=str_replace("[NID]", $NID, $nombreGuard);
		
		if(!rename($nombre,$nuevonombre)){
			
		 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
			$Log['res']='err';
			terminar($Log);	
		}else{
			$query="UPDATE 
				`paneles`.`DOCarchivos`
				SET
				`FI_documento`='$nuevonombreGuard'
				WHERE
				id='$NID'
				AND	
				`zz_AUTOPANEL`='$PanelI'
			";
			$Consulta = $Conec1->query($query);
			if($Conec1->error!=''){
				$Log['tx'][]='error al crear registro del archivo guardado';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}		
			$Log['data']['docarchivo']['fi']=$nuevonombreGuard;	
		}			
	}
	
	
	//EPILOGO (guarda el criterio de interpretación de nombre de archivo como default para la próxima)
	if($Config['doc-nomenclaturaarchivos'] != $_POST['criterio']){	
		$query="
			UPDATE 
			`paneles`.`configuracion`
			SET
			doc-nomenclaturaarchivos='".$_POST['criterio']."'
			WHERE 
			zz_AUTOPANEL='".$PanelI."'
		";
		$Consulta = $Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al guardar nuevo criterio de interpretacion de la nomenclatura de archivos';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
		}			
	}
	
	if($Config['doc-nomenclaturaarcseparador'] != $_POST['criterioseparador']){	
		$query="
			UPDATE 
			`paneles`.`configuracion`
			SET
			doc-nomenclaturaarcseparador='".$_POST['criterioseparador']."'
			WHERE 
			zz_AUTOPANEL='".$PanelI."'
		";
		$Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al guardar nuevo criterio de interpretacion de la nomenclatura de archivos';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
		}			
	}
}






//////////////////////////////////
////////////VERIFICANDO CATEGORIAS
//////////////////////////////////
$query="
SELECT id, tipo, nombre, descripcion, zz_AUTOPANEL, codigo, zz_AUTOIDCOPIA, zz_borrada
	FROM DOCdef
	WHERE
	zz_AUTOPANEL='$PanelI'
	AND
	zz_borrada='0'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar categorias';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}		
while($row = $Consulta->fetch_assoc()){
	$cats[$row['tipo']]['codigos'][$row['codigo']]=$row['id'];
	$cats[$row['tipo']]['nombres'][$row['nombre']]=$row['id'];
}

$categorias=array('escala','rubro','planta','sector','tipologia');

foreach($categorias as $v){
	
	$str="id_p_DOCdef_id_nombre_tipo_".$v;
	$Log['tx'][]='verificando'.$str;
	if($_POST[$str]=='n'&&$_POST[$str.'-n']!=''){
		$Log['tx'][]='analizando nueva propuesta';
		if(isset($cats[$v]['nombres'][$_POST[$str.'-n']])){
			$_POST[$str]=$cats[$v]['nombres'][$_POST[$str.'-n']];
		}elseif(isset($cats[$v]['codigos'][$_POST[$str.'-n']])){
			$_POST[$str]=$cats[$v]['codigos'][$_POST[$str.'-n']];
		}else{
			//hay que crearlo efectivamente
			
			$cod=substr($_POST[$str.'-n'],0,4);
			while(isset($cats[$v]['codigos'][$cod])){
				$cod=$cod.'X';
			}
			$query="
				INSERT INTO 
					DOCdef
					(tipo, nombre, codigo, zz_AUTOPANEL)
					VALUES 
					('".$v."', '".$_POST[$str.'-n']."', '".$cod."', '".$PanelI."')
			";
			$Consulta = $Conec1->query($query);
			
			if($Conec1->error!=''){
				$Log['tx'][]='error al intentar crear una categoria tipo '.$v;
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
			$_POST[$str]=$Conec1->insert_id;			
		}
	}	
	$Log['tx'][]='adoptado'.$_POST[$str];
}


	//________________
	//////////////////
	//GESTIÓN GENERAL. (crea documento y completa datos)
	//////////////////
	//''''''''''''''''



//echo $query;
/////////////////////////
//CREANDO DOCUMENTO NUEVO
/////////////////////////
if($_POST['accion']=='crear'){
	$query="
		INSERT INTO 
			`paneles`.`DOCdocumento`
		SET
			`zz_AUTOFECHACREACION` = '$HOY',
			`zz_AUTOPANEL`='".$PanelI."'		
	";
	$Log['tx'][]=utf8_encode($query);
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	$_POST['iddoc']=$Conec1->insert_id;
	$Log['niddoc']=$_POST['iddoc'];
}




if(!isset($_POST['iddoc'])){
	$Log['tx'][]='no fue enviada ni generada la varaible iddoc';
	$Log['res']='err';
	terminar($Log);
}
$Log['data']['plano']['id']=$_POST['iddoc'];



//actualiza una version que haya sido creada en este php previa a la creaci´n de su documento correspondiente.
if(isset($Log['data']['version']['id'])){
		
	$query="
		UPDATE
			`paneles`.`DOCversion`
		SET
			id_p_DOCdocumento_id='".$_POST['iddoc']."'
		WHERE
			id='".$Log['data']['version']['id']."'
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al intentar asignar a la nueva version el id del docuemtno creado';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}	
}

/////////////////////////////
//EDITANDO DATOS DE DOCUMENTO
/////////////////////////////
$query="
	UPDATE
		`paneles`.`DOCdocumento`
	SET
		`numerodeplano` = '".$_POST['numero']."',
		`nombre` = '".$_POST['nombre']."',
		`id_p_DOCdef_id_nombre_tipo_escala` ='".$_POST['id_p_DOCdef_id_nombre_tipo_escala']."',
		`id_p_DOCdef_id_nombre_tipo_rubro` ='".$_POST['id_p_DOCdef_id_nombre_tipo_rubro']."',
		`id_p_DOCdef_id_nombre_tipo_planta` ='".$_POST['id_p_DOCdef_id_nombre_tipo_planta']."',
		`id_p_DOCdef_id_nombre_tipo_sector` ='".$_POST['id_p_DOCdef_id_nombre_tipo_sector']."',
		`id_p_DOCdef_id_nombre_tipo_tipologia` ='".$_POST['id_p_DOCdef_id_nombre_tipo_tipologia']."',
		`descripcion` ='".$_POST['descripcion']."',
		`id_p_grupos_id_nombre_tipoa`=".$_POST['id_p_grupos_id_nombre_tipoa'].",
		`id_p_grupos_id_nombre_tipob`=".$_POST['id_p_grupos_id_nombre_tipob']."
	WHERE
		id = '".$_POST['iddoc']."'
		AND
		`zz_AUTOPANEL`='".$PanelI."'					
";
$Log['tx'][]=utf8_encode($query);
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}
$idPlano = $Conec1->insert_id;



$Log['tx'][]='completado';
$Log['res']='exito';


terminar($Log);

?>