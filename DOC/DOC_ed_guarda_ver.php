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
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

$Hoy = date("Y-m-d");


if(isset($_POST['panid'])){
	if($_POST['panid']!=$PanelI){
		$Log['tx'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['mg'][]='al parecer la solicitud está vinculada a un panel difenrente al activo. '.$_POST['zz_AUTOPANEL'].'!='.$PanelI;
		$Log['res']='err';
		terminar($Log);
	}
}

if(!isset($_POST['accion'])){
    $Log['tx'][]='falta la variable accion';    
    $Log['res']='err';
    terminar($Log); 
}

if(!isset($_POST['id_p_DOCdocumento_id'])){
    $Log['tx'][]='falta la variable id_p_DOCdocumento_id';    
    $Log['res']='err';
    terminar($Log); 
}
$Log['data']['iddoc']=$_POST['id_p_DOCdocumento_id'];

if($_POST['accion']=='crear'){
	$Log['tx'][]='creando una nueva version';
    $query="
        INSERT INTO 
            `paneles`.`DOCversion`
        SET
            id_p_DOCdocumento_id = '".$_POST['id_p_DOCdocumento_id']."',
            `zz_AUTOFECHACREACION` = '".$Hoy."',
            `zz_AUTOPANEL` = '".$PanelI."'
    ";
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='err';
        terminar($Log); 
    }
    $Log['data']['nid']=$Conec1->insert_id;
    if($Log['data']['nid']>0){
        $_POST['id']=$Log['data']['nid'];
    }

}

if(!isset($_POST['id'])){
    $Log['tx'][]='falta la variable id';    
    $Log['res']='err';
    terminar($Log);   
}
$_POST['idver']=$_POST['id']; //para no confundir a ./COM/COM_consultainterna_listadito.php
unset($_POST['id']);	
include('./COM/COM_consultainterna_listadito.php');

$estado='apresentar';
if($_POST['id_p_comunicaciones_id_ident_entrante']==0){$_POST['id_p_comunicaciones_id_ident_entrante']='';}
if($_POST['id_p_comunicaciones_id_ident_entrante']!=''){
    $_POST['zz_ultima_fecha_entrante_calculada']=$Log['data']['comunicaciones'][$_POST['id_p_comunicaciones_id_ident_entrante']]['zz_reg_fecha_emision'];
    if( 
        $_POST['zz_ultima_fecha_entrante_calculada']<$Hoy 
        && 
        $_POST['zz_ultima_fecha_entrante_calculada']!= ''  
        &&
        $_POST['zz_ultima_fecha_entrante_calculada']){
        
        $estado='evaluando';
    }
}else{
    $_POST['zz_ultima_fecha_entrante_calculada']='';
}

if($_POST['id_p_comunicaciones_id_ident_aprobada']==0){$_POST['id_p_comunicaciones_id_ident_aprobada']='';}
if($_POST['id_p_comunicaciones_id_ident_aprobada']!=''){

    $_POST['zz_ultima_fecha_aprobada_calculada']=$Log['data']['comunicaciones'][$_POST['id_p_comunicaciones_id_ident_aprobada']]['zz_reg_fecha_emision'];
    
    if( 
        $_POST['zz_ultima_fecha_aprobada_calculada']<$Hoy 
        && 
        $_POST['zz_ultima_fecha_aprobada_calculada']!= ''  
        &&
        $_POST['zz_ultima_fecha_aprobada_calculada']){
        
        $estado='aprobada';
    }    
    
}else{
    $_POST['zz_ultima_fecha_aprobada_calculada']='';
    
}

if($_POST['id_p_comunicaciones_id_ident_rechazada']==0){$_POST['id_p_comunicaciones_id_ident_rechazada']='';}
if($_POST['id_p_comunicaciones_id_ident_rechazada']!=''){
    $_POST['zz_ultima_fecha_rechazada_calculada']=$Log['data']['comunicaciones'][$_POST['id_p_comunicaciones_id_ident_rechazada']]['zz_reg_fecha_emision'];
}else{
    $_POST['zz_ultima_fecha_rechazada_calculada']='';
    
    if( 
        $_POST['zz_ultima_fecha_rechazada_calculada']<$Hoy 
        && 
        $_POST['zz_ultima_fecha_rechazada_calculada']!= ''  
        &&
        $_POST['zz_ultima_fecha_rechazada_calculada']){
        
        $estado='rechazada';
    }    
}

if($_POST['id_p_comunicaciones_id_ident_anulada']==0){$_POST['id_p_comunicaciones_id_ident_anulada']='';}
if($_POST['id_p_comunicaciones_id_ident_anulada']!=''){
    $_POST['zz_ultima_fecha_anulada_calculada']=$Log['data']['comunicaciones'][$_POST['id_p_comunicaciones_id_ident_anulada']]['zz_reg_fecha_emision'];
}else{
    $_POST['zz_ultima_fecha_anulada_calculada']='';
    
    if( 
        $_POST['zz_ultima_fecha_anulada_calculada']<$Hoy 
        && 
        $_POST['zz_ultima_fecha_anulada_calculada']!= ''  
        &&
        $_POST['zz_ultima_fecha_anulada_calculada']){
        
        $estado='anulada';
    }            
}

$_POST['previstoorig']=$_POST['previstoorig_a'].'-'.$_POST['previstoorig_m'].'-'.$_POST['previstoorig_d'];
if(!fechavalida($_POST['previstoorig'])){$_POST['previstoorig']='';}

$_POST['previstoactual']=$_POST['previstoactual_a'].'-'.$_POST['previstoactual_m'].'-'.$_POST['previstoactual_d'];
if(!fechavalida($_POST['previstoactual'])){$_POST['previstoactual']='';}

$Log['tx'][]='editando una version existente';
$query="
    UPDATE
        `paneles`.`DOCversion`
    SET
        `version` = '".$_POST['version']."',
        `previstoorig` = '".$_POST['previstoorig']."',
        `previstoactual` = '".$_POST['previstoactual']."',
        `descripcion` = '".$_POST['descripcion']."',
        `id_p_comunicaciones_id_ident_entrante` = '".$_POST['id_p_comunicaciones_id_ident_entrante']."',
        `id_p_comunicaciones_id_ident_aprobada` = '".$_POST['id_p_comunicaciones_id_ident_aprobada']."',
        `id_p_comunicaciones_id_ident_rechazada` = '".$_POST['id_p_comunicaciones_id_ident_rechazada']."',
        `id_p_comunicaciones_id_ident_anulada` = '".$_POST['id_p_comunicaciones_id_ident_anulada']."',
        `zz_ultima_fecha_entrante_calculada` = '".$_POST['zz_ultima_fecha_entrante_calculada']."',
        `zz_ultima_fecha_aprobada_calculada` = '".$_POST['zz_ultima_fecha_aprobada_calculada']."',
        `zz_ultima_fecha_rechazada_calculada` = '".$_POST['zz_ultima_fecha_rechazada_calculada']."',
        `zz_ultima_fecha_anulada_calculada` = '".$_POST['zz_ultima_fecha_anulada_calculada']."'
    WHERE 
        `id` = '".$_POST['idver']."'
    AND
        zz_AUTOPANEL='".$PanelI."'
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}


$_POST['iddoc']=$_POST['id_p_DOCdocumento_id'];
include('./DOC/DOC_proces_ultimaversion.php');//actualiza el estado cacheado del documento deacuerdo a las características de su última versión. 


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
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}

while($row = $Consulta->fetch_assoc()){
	$Grupos[$row['tipo']][$row['nombre']]=$row['id'];
	$Grupos[$row['tipo']][$row['codigo']]=$row['id'];				
}	


if(isset($_FILES['upload'])){// solo al generar documento a partir de archivo.
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
				$datos['numerodeplano']=$v;
			}
			if($tt[$k]=='ver' || $tt[$k]=='vers' || $tt[$k]=='version'){			
				$version=$v;
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
			
			if(($tt[$k]=='g1'||$tt[$k]=='ga') && $grupoa=='definir'){
				$Log['tx'][]='solicitud de grupo a detectado';
				if(isset($Grupos['a'][$v])){
					$grupoa=$Grupos['a'][$v];				
				}else{
					$query="
						INSERT INTO `paneles`.`grupos`
							SET
							`nombre`='".$v."',
							`codigo`='".$v."',
							`zz_AUTOPANEL`='".$PanelI."',
							tipo='a'
					";
					
					$Consulta = $Conec1->query($query);	
					if($Conec1->error!=''){
					    $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
					    $Log['tx'][]=$query;
					    $Log['res']='err';
					    terminar($Log); 
					}
					$Log['data']['ngaid']=$Conec1->insert_id;
											
					$grupoa = $Conec1->insert_id;
					if($grupoa<1){
						$Log['tx'][]='error al generar un nuevo id de grupo: '.$grupoa;
						$Log['tx'][]=utf8_encode($query);
						$Log['res']='err';
						terminar($Log);
					}
				}
				
			}
			
			if(($tt[$k]=='g2'||$tt[$k]=='gb') && $grupob=='definir'){
				if(isset($Grupos['b'][$v])){
					$grupoa=$Grupos['b'][$v];				
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
					    $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
					    $Log['tx'][]=$query;
					    $Log['res']='err';
					    terminar($Log); 
					}
					$Log['data']['ngbid']=$Conec1->insert_id;
							
					$grupob = $Conec1->insert_id;
					if($grupob<1){
						$Log['tx'][]='error al generar un nuevo id de grupo: '.$grupob;
						$Log['tx'][]=utf8_encode($query);
						$Log['res']='err';
						terminar($Log);
					}
				}
			}
		}
	}

	
	if($grupoa=='definir'){$grupoa='';}
	if($grupob=='definir'){$grupob='';}
	
	$query="
	SELECT 
		`DOCdocumento`.`id`,
	    `DOCdocumento`.`numerodeplano`,
	    `DOCdocumento`.`nombre`,
	    `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_escala`,
	    `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_rubro`,
	    `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_planta`,
	    `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_sector`,
	    `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_tipologia`,
	    `DOCdocumento`.`descripcion`,
	    `DOCdocumento`.`zz_borrada`,
	    `DOCdocumento`.`zz_AUTOPANEL`,
	    `DOCdocumento`.`id_p_grupos_id_nombre_tipoa`,
	    `DOCdocumento`.`id_p_grupos_id_nombre_tipob`
	FROM `paneles`.`DOCdocumento`
	WHERE
	    `DOCdocumento`.`zz_AUTOPANEL`='".$PanelI."'
	    AND
	    zz_borrada='0'
	";
	
	$Consulta = $Conec1->query($query);	
	if($Conec1->error!=''){
	    $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
	    $Log['tx'][]=$query;
	    $Log['res']='err';
	    terminar($Log); 
	}
	
	while($row = $Consulta->fetch_assoc()){
		$Planos[$row['numerodeplano']]['id']=$row['id'];
	}	
	
	
	$cant=0;
	if(!isset($datos['numerodeplano'])){
		$cant=count($Planos);
		$txcant=str_pad($cant, 6,"0",STR_PAD_LEFT);
		while(isset($Planos[$txcant])){
			$cant++;		
		}
		$cant++;
		$datos['numerodeplano']=str_pad($cant, 6,"0",STR_PAD_LEFT);
	}
		
		
	$datos['id_p_DOCdef_id_nombre_tipo_escala']='';
	$datos['id_p_DOCdef_id_nombre_tipo_rubro']='';
	$datos['id_p_DOCdef_id_nombre_tipo_planta']='';
	$datos['id_p_DOCdef_id_nombre_tipo_sector']='';
	$datos['id_p_DOCdef_id_nombre_tipo_tipologia']='';
	$datos['descripcion']='';
				
	if(isset($Planos[$datos['numerodeplano']])){
		$idPlano = $Planos[$datos['numerodeplano']]['id'];		
	}else{
		
		$query="
			INSERT INTO 
				`paneles`.`DOCdocumento`
			SET
				`numerodeplano` = '".$datos['numerodeplano']."',
				`nombre` = '".$datos['nombre']."',
				`id_p_DOCdef_id_nombre_tipo_escala` ='".$datos['id_p_DOCdef_id_nombre_tipo_escala']."',
				`id_p_DOCdef_id_nombre_tipo_rubro` ='".$datos['id_p_DOCdef_id_nombre_tipo_rubro']."',
				`id_p_DOCdef_id_nombre_tipo_planta` ='".$datos['id_p_DOCdef_id_nombre_tipo_planta']."',
				`id_p_DOCdef_id_nombre_tipo_sector` ='".$datos['id_p_DOCdef_id_nombre_tipo_sector']."',
				`id_p_DOCdef_id_nombre_tipo_tipologia` ='".$datos['id_p_DOCdef_id_nombre_tipo_tipologia']."',
				`descripcion` ='".$datos['descripcion']."',
				`zz_AUTOFECHACREACION` = '$HOY',
				`zz_AUTOPANEL`='".$PanelI."',
				`id_p_grupos_id_nombre_tipoa`='$grupoa',
				`id_p_grupos_id_nombre_tipob`='$grupob'			
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
	
	}
	
	if($idPlano<1){
			$Log['tx'][]='error al crear documento';
			$Log['tx'][]=utf8_encode($query);
			$Log['tx'][]=utf8_encode($Conec1->error);
			$Log['res']='err';
			terminar($Log);
	}
	
	$Log['data']['plano']['id']=$idPlano;
	
	$query="
		SELECT 
			`DOCversion`.`version`,
			`DOCversion`.`id`
			
		FROM
			`paneles`.`DOCversion`
			
		WHERE
		    `DOCversion`.`id_p_DOCdocumento_id`='".$idPlano."'
		    AND
		    `DOCversion`.`zz_borrada`='0'
		    AND
		    `zz_AUTOPANEL`='".$PanelI."'
		order by version asc
	";
	$Consulta = $Conec1->query($query);
	
	if($Conec1->error!=''){
		$Log['tx'][]='error en consulta grupos: '.$Conec1->error;
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
	
	if(!isset($idVersion)){
		$query="
			INSERT INTO 
				`paneles`.`DOCversion`
			SET
				`version`='$version',
				`id_p_DOCdocumento_id`='".$idPlano."',
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
	
	$_POST['iddoc']=$idPlano;
	include('./DOC/DOC_proces_ultimaversion.php');//actualiza el estado cacheado del documento deacuerdo a las características de su última versión. 
	
	
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
	
	$nombreGuard=$nombre;
	
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
	
	
	//echo $query;
	
	$Log['tx'][]='completado el regsitro del archivo subido';

	
	if($config['doc-nomenclaturaarchivos'] != $_POST['criterio']){	
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
	
	if($config['doc-nomenclaturaarcseparador'] != $_POST['criterioseparador']){	
		$query="
			UPDATE 
			`paneles`.`configuracion`
			SET
			doc-nomenclaturaarcseparador='".$_POST['criterioseparador']."'
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
}

$Log['res']='exito';
terminar($Log);

?>
