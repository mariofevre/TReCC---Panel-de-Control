<?php

/**
* COM_ed_guarda_doc.php
*
* procesa archivos subidos referidos a una comunicacion
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
chdir('..'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.

ini_set('display_errors', '1');

$Tabla='COMcomunicaciones';


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


include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

if(isset($_POST['zz_AUTOPANEL'])){
	if($_POST['zz_AUTOPANEL']!=$PanelI){
		$Log['tx'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['mg'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['res']='err';
		terminar($Log);
	}
}


if(!isset($_POST['criterioseparador'])){
	$Log['tx'][]='no fue definido el caracter de separadores del título';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['criterio'])){
	$Log['tx'][]='no fue definido el criterio de interpretacion del titulo';
	$Log['res']='err';
	terminar($Log);
}


if(!isset($_POST['tipo'])){
	$Log['tx'][]='no fue enviada variable tipo (origen/adjunto/contenido)';
	$Log['res']='err';
	terminar($Log);
}


if(!isset($_FILES['upload'])){
	$Log['tx'][]='no fue enviado el archivo en la variable FILES[upload]';
	$Log['tx'][]=print_r($_FILES,true);
	$Log['res']='err';
	terminar($Log);
}

$Type=$_FILES['upload']['type'];

if(!isset($_POST['nf'])){$_POST['nf']=0;}
$Log['data']['nf']=$_POST['nf'];
//tipos de documentos a redefinir
/*
if($_FILES['upload']['type']!='image/jpeg'&&$_FILES['upload']['type']!='image/png'){
	$Log['tx'][]= "tipo de archivo no reconocido";
	$Log['tx'][]= "<br>archivo: ".$_FILES['upload']['name'];
	$Log['tx'][]= "<br>tipo: ".$_FILES['upload']['type'];
	terminar($Log);
}
*/

$datos=array();
unset($datos['ident']);
unset($datos['sentido']);
unset($datos['identdos']);
unset($datos['identtres']);
unset($datos['fecha']);
$datos['nombre']='';

if(!isset($_POST['id_p_grupos_id_nombre_tipoa'])){
	$Log['tx'][]='falta varaiable grupo a';
	$Log['res']='err';
	terminar($Log);
}
if(!isset($_POST['id_p_grupos_id_nombre_tipob'])){
	$Log['tx'][]='falta varaiable grupo b';
	$Log['res']='err';
	terminar($Log);
}


if($_POST['id_p_grupos_id_nombre_tipoa']!=''){
	
	if(strtolower($_POST['id_p_grupos_id_nombre_tipoa'])=='n'){
		if($_POST['id_p_grupos_id_nombre_tipoa-n']==''){
			$Log['tx'][]='se ha solicitado la creación de un grupo sin nombre '.$_POST['id_p_grupos_id_nombre_tipoa']." ".$_POST['id_p_grupos_id_nombre_tipoa-n'];
			$Log['res']='err';
			terminar($Log);
		}
				
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
			`grupos`.`nombre`='".$_POST['id_p_grupos_id_nombre_tipoa-n']."'
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
			$datos['id_p_grupos_id_nombre_tipoa']=$f['id'];
			$Log['tx'][]='id grupo a: '.$f['id'];
		}elseif($Consulta->num_rows<1){
			$query="
				INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_id_nombre_tipoa-n']."',
					`zz_AUTOPANEL`='".$PanelI."'
					";
			
			$Consulta = $Conec1->query($query);
			
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
					
			$gaNID = $Conec1->insert_id;
		
			if($gaNID<1){
				$Log['tx'][]='error al generar un nuevo id de grupo: '.$gaNID;
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
			$datos['id_p_grupos_id_nombre_tipoa']=$gaNID;		
						
		}
					
		
			
	}elseif($_POST['id_p_grupos_id_nombre_tipoa']!=''){
		
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
				`grupos`.`id`='".$_POST['id_p_grupos_id_nombre_tipoa']."'
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		if($Consulta->num_rows<1){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		$datos['id_p_grupos_id_nombre_tipoa']=$_POST['id_p_grupos_id_nombre_tipoa'];
	}
}


if($_POST['id_p_grupos_id_nombre_tipob']!=''){
	
	if(strtolower($_POST['id_p_grupos_id_nombre_tipob'])=='n'){
		if($_POST['id_p_grupos_id_nombre_tipob-n']==''){
			$Log['tx'][]='se ha solicitado la creación de un grupo sin nombre '.$_POST['id_p_grupos_id_nombre_tipob']." ".$_POST['id_p_grupos_id_nombre_tipob-n'];
			$Log['res']='err';
			terminar($Log);
		}
				
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
			$datos['id_p_grupos_id_nombre_tipob']=$f['id'];

		}elseif($Consulta->num_rows<1){
			$query="
				INSERT INTO `paneles`.`grupos`
					SET
					`nombre`='".$_POST['id_p_grupos_id_nombre_tipob-n']."',
					`zz_AUTOPANEL`='".$PanelI."'
					";
			$Conec1->query($query);
			
			if($Conec1->error!=''){
				$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
					
			$gbNID = $Conec1->insert_id;
		
			if($gbNID<1){
				$Log['tx'][]='error al generar un nuevo id de grupo: '.$gbNID;
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}
			$datos['id_p_grupos_id_nombre_tipob']=$gbNID;		
						
		}
					
		
			
	}elseif($_POST['id_p_grupos_id_nombre_tipob']!=''){
		
		$query="
			SELECT 
			    `grupos`.`nombre`,
			    `grupos`.`codigo`,
			    `grupos`.`descripcion`
			    
			FROM `paneles`.`grupos`
			WHERE
			`grupos`.`zz_AUTOPANEL`='".$PanelI."'
			AND
			`grupos`.`id`='".$_POST['id_p_grupos_id_nombre_tipob']."'
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		if($Consulta->num_rows<1){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		$datos['id_p_grupos_id_nombre_tipob']=$_POST['id_p_grupos_id_nombre_tipob'];
	}
}





		$query="
			SELECT 
			    `grupos`.id,
			    `grupos`.`nombre`,
			    `grupos`.`codigo`,
			    `grupos`.`descripcion`,
			    `grupos`.tipo
			    
			FROM 
				`paneles`.`grupos`
			WHERE
				`grupos`.`zz_AUTOPANEL`='".$PanelI."'
			
		";
		$Consulta = $Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}
		while($row=$Consulta->fetch_assoc()){
			
			if($row['codigo']!=''){
				$CODg[$row['tipo']][strtolower($row['codigo'])]=$row['id'];
			}
			if(!isset($CODg[$row['tipo']][strtolower($row['nombre'])])){
				$CODg[$row['tipo']][strtolower($row['nombre'])]=$row['id'];
			}
		}





	//armar este array dinámicamente en funcion de la configuración general del panel.
	$CODS = array(
	    "os" => "saliente",
	    "odes" => "saliente",
	    "ods" => "saliente",
	    "np" => "entrante",
	    "ndp" => "entrante",
	    "ndep" => "entrante"
	);
	
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
		
		if($tt[$k]=='nro' && !isset($datos['ident'])){			
			$datos['ident']=$v;
		}
		
		if($tt[$k]=='ident' && !isset($datos['ident'])){
			
			if($_POST['sentido']=='auto'){
				foreach($CODS as $cod => $sent){
					//echo PHP_EOL.$cod." - ".$sent." --".$v;
					if(strpos(strtolower($v),strtolower($cod))!==false){
						//echo "...$cod enconetrado. es $sent";		
						$val= str_ireplace($cod, '', $v);
						$val= str_ireplace(' ', '', $val);
						$val = extraenumeros($val);
						$datos['ident']=$val;
						$datos['sentido']=$sent;
						break;
					}
				}
			}else{
				
				$datos['sentido']=$_POST['sentido'];
				$datos['ident']=$v;
								
			}
			
		}
		
		if(strtolower($tt[$k]=='identdos') && !isset($identdos)){			
			$datos['identdos']=$v;			
		}				
		
		if(strtolower($tt[$k]=='identtres') && !isset($identtres)){			
			$datos['identtres']=$v;
		}				
		
		if(strtolower($tt[$k]=='fecha') && !isset($fecha)){			
			$datos['zz_reg_fecha_emision']=$v;			
		}	
		
		if(strtolower($tt[$k]=='g1') && $_POST['id_p_grupos_id_nombre_tipoa']==''){
			if(isset($CODg['a'][strtolower($v)])){
				$datos['id_p_grupos_id_nombre_tipoa']=$CODg['a'][$v];
			}						
		}	
		
		if(strtolower($tt[$k]=='g2') && $_POST['id_p_grupos_id_nombre_tipob']==''){
			if(isset($CODg['b'][strtolower($v)])){
				$datos['id_p_grupos_id_nombre_tipob']=$CODg['b'][$v];
			}						
		}
		
		if(strtolower($tt[$k])=='nombre'){
			$datos['nombre'].=$v;
		}
		
		if(strtolower($tt[$k])=='comenta'){
			
			$stRta=strtolower($_POST['com-nomenclaturaarchivosRta']);
			$subV=strtolower($v);
			$sp=strpos($subV,$stRta);
			
			if($sp!==false){
				$cadena='';
				$sp+=strlen($stRta);
				$NsubV=substr($subV, $sp);
				
				
				foreach($CODS as $co => $sent){
					if(strpos($co,$NsubV)==0){
						$largo[]=strlen($co);
						$encajan[]=$co;
						
					}
				}
				
				if(isset($encajan)){
					array_multisort($encajan,$largo,SORT_DESC);					
				}
				
				$cod=$encajan[0];
				
				$rtasent=$CODS[$encajan[0]];
				
				
				$NNsubV=substr($NsubV, strlen($cod));
				if(substr($NNsubV,0,1)==' '){
					$NNsubV=substr($NNsubV,1);
				}
				
				$Nsp=0;
								
				while($Nsp<(strlen($NNsubV)-1)){
					
					$char=substr($NNsubV,$Nsp,1);
					
					if($char==' '){
						break;
					}
					
					$cadena.=$char;					
					$Nsp++;					
				}
				
				if($cadena!=''){
					$rtl['sentido']=$rtasent;
					$rtl['ident']=$cadena;
					$RTAvincular[]=$rtl;
				}
			}			
						
			$datos['nombre'].=$v.PHP_EOL;
		}	


		if(strtolower($tt[$k])=='y'){			
			$Y=extraenumeros($v);			
		}
		if(strtolower($tt[$k])=='m'){			
			$m=extraenumeros($v);			
		}
		if(strtolower($tt[$k])=='d'){			
			$d=extraenumeros($v);			
		}									
	}
	
}


	
if(isset($Y)&&isset($m)&&isset($d)&&!isset($datos['zz_reg_fecha_emision'])){
	$datos['zz_reg_fecha_emision']=$Y.'-'.$m.'-'.$d;
}
	
if(!isset($datos['sentido'])){
	$Log['tx'][]=utf8_encode('no pudo ser definido el sentido de la comunicación');
	$Log['tx'][]='postenviado:'.utf8_encode(print_r($_POST,true));	
	$Log['mg'][]=utf8_encode('no pudo ser definido el sentido de la comunicación. Por favor revise haber indicado en el formulario el sentido o que el segmento destinado para ident (identificación), contenga el númer y el tipo: OS, NP; etc');		
	$Log['res']='err';
	terminar($Log);	
}

if($datos['sentido']!='entrante'&&$datos['sentido']!='saliente'){
	$Log['tx'][]=utf8_encode('no pudo ser identificado el sentido de la comunicación');	
	$Log['mg'][]=utf8_encode('no pudo ser identificado el sentido de la comunicación. Por favor revise haber indicado en el formulario el sentido o que  el segmento destinado para ident (identificación), contenga el númer y el tipo: OS, NP; etc');		
	$Log['res']='err';
	terminar($Log);	
}	



$b = explode(".",$ArchivoOrig);
$ext = strtolower($b[(count($b)-1)]);	

$PathBase="./documentos/p_".$PanelI."/comunicaciones/";


if($_POST['tipo']=='origen'){
	$Dest="origen/";
	$nombretipo = $Tabla."[NID]";
	$nombrepreliminar='si';//indica que el documento debe ser renombrado luego de creado el registro.			
	
}elseif($_POST['tipo']=='contenido'){
	$Dest="origen/";
	$nombretipo = $Tabla.$Id;
	$nombrepreliminar='no';			
	
}elseif($_POST['tipo']=='adjuntos'){
	$Dest="adjuntos/";
	$nombretipo = $Tabla.$Id;
	$nombrepreliminar='no';
}

$path=$PathBase.$Dest;

$carpetas= explode("/",$path);	
$rutaacumulada="";			
foreach($carpetas as $valor){		
$Log['tx'][]= utf8_encode("instancia de ruta: $valor ");
$rutaacumulada.=$valor."/";
	if (!file_exists($rutaacumulada)&&$valor!=''){
		$Log['tx'][]="creando: $rutaacumulada ";
	    if(!mkdir($rutaacumulada, 0777, true)){
	    	$Log['tx'][]="error creando: $rutaacumulada ";
	    }
	    chmod($rutaacumulada, 0777);
	}
}		
// FIN verificar y crear directorio				


$nombre=$nombretipo;

$c=explode('.',$nombre);

$cod = cadenaArchivo(10); // define un código que evita la predictivilidad de los documentos ante búsquedas maliciosas
$nombre=$path.$c[0].$cod.".".$ext;

$extVal['docx']='1';
$extVal['doc']='1';
$extVal['odt']='1';
$extVal['pdf']='1';
//$extVal['jpg']='1';
//$extVal['png']='1';
//$extVal['tif']='1';
//$extVal['bmp']='1';
//$extVal['gif']='1';
//$extVal['pdf']='1';
//$extVal['zip']='1';

if(isset($extVal[strtolower($ext)])){
	$Log['tx'][]= "guardado en: ".$nombre."<br>";
	
	if (!copy($_FILES['upload']['tmp_name'], $nombre)) {
	   	$Log['tx'][]= "Error al copiar $nombre ...\n";
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



$cont='';
if($Type=="application/octet-stream" && strtolower($ext)=='doc'){
	$Log['tx'][]=utf8_encode('se identificó archivo .doc (ms-word)');
	$cont=read_DOC($_FILES['upload']['tmp_name']);
	
}elseif($Type=="application/octet-stream" && strtolower($ext)=='docx'){
	$Log['tx'][]=utf8_encode('se identificó archivo .docx (ms-word)');
	$cont=readDOCX($_FILES['upload']['tmp_name']);
	
}elseif($Type=="application/vnd.oasis.opendocument.text" && strtolower($ext)=='odt'){
	$Log['tx'][]=utf8_encode('se identificó archivo .odt (ODF)');
	echo $nombre;
	$cont=read_ODT($_FILES['upload']['tmp_name']);
	
}elseif($Type=="application/pdf" && strtolower($ext)=='pdf'){
	$Log['tx'][]=utf8_encode('se identificó archivo .pdf (acrobat)');
	$cont=read_PDF($_FILES['upload']['tmp_name']);
	
}else{
	$Log['tx'][]=utf8_encode('no se identificó el tipo de archivo');
}
$datos['descripcion']=$datos['nombre'].PHP_EOL.nl2br($cont);

if($_POST['tipo']=='origen'){
	
	$query="
		SELECT 
		`comunestadoslista`.`id`,
	    `comunestadoslista`.`sentido`,
	    `comunestadoslista`.`orden`
		FROM 
		`paneles`.`comunestadoslista`
		
		WHERE 
		`zz_AUTOPANEL`='".$PanelI."'
		AND
		sentido = '".$datos['sentido']."'
		
		ORDER by orden desc
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	if($Consulta->num_rows<1){
		$Log['tx'][]='error al consultar estados configurados de las comunicaciones';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	
	$f=$Consulta->fetch_assoc();
	$Idestadolista=$f['id'];
		
	
	$sets='';
	foreach($datos as $k => $v){
		$sets.="`".$k."`='".utf8_decode($v)."',";
	}
	$query="
		INSERT INTO 
		`paneles`.`comunicaciones`
		SET
		$sets
		`zz_AUTOPANEL`='".$PanelI."'
		
	";
	
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al crear registro';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	
	$NID = $Conec1->insert_id;
	$Log['data']['nid']=$NID;
	if($NID<1){
		$Log['tx'][]='error al generar un nuevo id: '.$NID;
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}

	if(count($RTAvincular)>0){
		foreach($RTAvincular as $rtl){			
			$query="
				SELECT
					`comunicaciones`.`id`,
				    `comunicaciones`.`sentido`,
				    `comunicaciones`.`ident`,
				    `comunicaciones`.`zz_AUTOPANEL`,
				    `comunicaciones`.`zz_reg_fecha_emision`,
				    `comunicaciones`.`zz_AUTOIDCOPIA`
				FROM `paneles`.`comunicaciones`
				WHERE
				`comunicaciones`.`ident`='".$rtl['ident']."'
				AND
				`comunicaciones`.`sentido`='".$rtl['sentido']."'
				AND
				`comunicaciones`.`zz_AUTOPANEL`='".$PanelI."'
				AND
				`comunicaciones`.`zz_borrada`='0'			
			";
			$Consulta=$Conec1->query($query);
		
			if($Conec1->error!=''){
				$Log['tx'][]='fallo la identificacion de la comuniccion de origen a asociar';
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}	
			if($Consulta->num_rows<1){
				$Log['tx'][]='fallo la identificacion de la comuniccion de origen a asociar';
				$Log['tx'][]='se encontraron '.$Consulta->num_rows.'comunicaciones posibles';
				$idO='';
				$coment='falta identificar'.$rtl['ident'];
			}else{
				$res= $Consulta->fetch_assoc();
				$idO=$res['id'];
				$coment='generado automáticamente';
			}

			$query="
				INSERT INTO
					`paneles`.`COMlinkrespuesta`
				SET
					`id_p_comunicaciones_id_nombre_origen` = '".$idO."',
					`id_p_comunicaciones_id_nombre_respuesta` = '".$NID."',
					`zz_AUTOPANEL` = '".$PanelI."',
					`comentario` = '".$coment."'
			";
			$Conec1->query($query);
		
			if($Conec1->error!=''){
				$Log['tx'][]=utf8_encode('fallo la creación del vínculo a comunicación de origen');
				$Log['tx'][]=utf8_encode($query);
				$Log['tx'][]=utf8_encode($Conec1->error);
				$Log['res']='err';
				terminar($Log);
			}	
		}
	}



	
	if( $Idestadolista != '' && $datos['zz_reg_fecha_emision'] != '') {
	
		$query="
			INSERT INTO 
				`paneles`.`comunestados`
			SET
				`id_p_comunicaciones_id_nombre`='".$NID."',
				`id_p_comunestadoslista`='".$Idestadolista."',
				`desde`='".$datos['zz_reg_fecha_emision']."',
				`zz_AUTOPANEL`='".$PanelI."'
		";
		$Conec1->query($query);
		
		if($Conec1->error!=''){
			$Log['tx'][]=utf8_encode('error al registrar fecha de emisión');
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}	
		
	}else{
		$Log['tx'][]="No se registra tipo de estado original o fecha para ese estado".$Idestadolista." / ".$datos['zz_reg_fecha_emision'];
		
	}
	
}

if($nombrepreliminar=='si'){

	$nuevonombre=str_replace("[NID]", $NID, $nombre);
	$nuevonombreGuard=str_replace("../", "./", $nuevonombre);
	
	if(!rename($nombre,$nuevonombre)){
		
	 	$Log['tx'][]=" error al renombrar el documento ".$origen['nombre']." con el nuevo id => $nuevonombre";
		$Log['res']='err';
		terminar($Log);	
	}else{
		
		
		$query="
			INSERT INTO 
			`paneles`.`COMdocumentos`
			SET	
			`id_p_comunicaciones_id`='".$NID."',
			`descripcion`='documento de origen',
			`FI_documento`='".$nuevonombreGuard."',
			`FI_nombreorig`='".$_FILES['upload']['name']."',
			`zz_AUTOPANEL`='".$PanelI."',
			`tipo`='origen'
		";
		
		$Conec1->query($query);
	
		if($Conec1->error!=''){
			$Log['tx'][]='error al guardar registro del archivo guardado';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
		}		
	}			
	
}


//echo $query;

$Log['tx'][]='completado';
$Log['res']='exito';

if($Config['com-nomenclaturaarchivos'] != $_POST['criterio']){	
	$query="
		UPDATE 
		`paneles`.`configuracion`
		SET
		com-nomenclaturaarchivos='".$_POST['criterio']."'
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

if($Config['com-nomenclaturaarcseparador'] != $_POST['criterioseparador']){	
	$query="
		UPDATE 
		`paneles`.`configuracion`
		SET
		com-nomenclaturaarcseparador='".$_POST['criterioseparador']."'
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




terminar($Log);




//////////////
///si es docX
//////////////
//echo readDOCX("test.docx"); // Save this contents to file

function readDOCX($filename) {
   return readZippedXML($filename, "word/document.xml");
}

function readZippedXML($archiveFile, $dataFile) {
// Create new ZIP archive
	$zip = new ZipArchive;
	
	// Open received archive file
	if (true === $zip->open($archiveFile)) {
	    // If done, search for the data file in the archive
	    if (($index = $zip->locateName($dataFile)) !== false) {
	        // If found, read it to the string
	        $data = $zip->getFromIndex($index);
	        // Close archive file
	        $zip->close();
	        // Load XML from a string
	        // Skip errors and warnings
	        $xml = new DOMDocument();
	    	$xml->loadXML($data, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);
	        // Return data without XML formatting tags
	        return strip_tags($xml->saveXML());
	    }
	    $zip->close();
	}
	
	// In case of failure return empty string
	return "";
}
	

////////////
///si es doc
////////////
function read_DOC($filename) {
    $fileHandle = fopen($filename, "r");
    $line = @fread($fileHandle, filesize($filename));   
    $lines = explode(chr(0x0D),$line);
    $outtext = "";
    foreach($lines as $thisline){
        $pos = strpos($thisline, chr(0x00));
        if (($pos !== FALSE)||(strlen($thisline)==0))
          {
          } else {
            $outtext .= $thisline.PHP_EOL;
          }

		$p=0;
		$ult=0;
		
		while(strlen($outtext)>$p){
			if($outtext[$p]!==' '){
				$ult++;
				$p++;
			}else{
				if($ult>50){
					$outtext=substr($outtext, 0,($p - $ult)).substr($outtext, ($p+1));
					$ult=0;
					$p=$p-$ult;
				}else{
					$ult=0;
					$p++;
				}
			}			
		}
    }
	  
	  
    $outtext = preg_replace("/[^a-zA-Z0-9\s\,\á\é\í\ó\ú\ñ\ü\Á\É\Í\Ó\Ú\Ñ\Ú\.\-\n\r\t@\/\_\(\)]/","",$outtext);
	// echo $outtext.PHP_EOL;
    return $outtext;
}





///////////
//si es PDF
///////////
function read_PDF($filename) {
	include_once('class.pdf2text.php');
	$a = new PDF2Text();
	$a->setFilename($filename);
	$a->decodePDF();
	return $a->output();
}
 
 
 
/////////////
///si es ODT
/////////////

 
//Function to extract text
function read_ODT($filename){

	$e=explode('.', $filename);

	$ext=end($e);
    //Check for extension

    //if its docx file
    if($ext == 'docx')
    $dataFile = "word/document.xml";
    //else it must be odt file
    else
    $dataFile = "content.xml";     
       
    //Create a new ZIP archive object
    $zip = new ZipArchive;
 
    // Open the archive file
    if (true === $zip->open($filename)) {
        // If successful, search for the data file in the archive
        if (($index = $zip->locateName($dataFile)) !== false) {
            // Index found! Now read it to a string
            $text = $zip->getFromIndex($index);
            // Load XML from a string
            // Ignore errors and warnings
            $xml = new DOMDocument();
			$xml->loadXML($text, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);
            //$xml = DOMDocument::loadXML($text, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);
            // Remove XML formatting tags and return the text
            return strip_tags($xml->saveXML());
        }
        //Close the archive file
        $zip->close();
    }
 
    // In case of failure return a message
    return "File not found";
}

 
?>
