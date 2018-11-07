<?php 
/**
* DOC_consulta_versionas.php 
*
* imprime JSON con datos de un conjunto de versiones.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
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

if(isset($_POST['seleccion'])){
	$Log['tx'][]='seleccion provista: '.count($_POST['seleccion'])." elementos.";
	$e=explode(",",$_POST['seleccion']);
	
	$wheresel='AND (';
	$wherearch='AND (';
	foreach($e as $v){
        if($v==''){continue;}
		$Sel[$v]='';
		$wheresel.="id = '".$v."' OR "; 
		$wherearch.="id_p_DOCversion_id = '".$v."' OR "; 
	}
	if($wheresel=='AND ('){
        $wheresel='';
        $wherearch='';
    }else{
        $wheresel = substr($wheresel,0,-3).')';
        $wherearch = substr($wherearch,0,-3).')';
    }

}else{
    $wheresel='';
}

	$query="
		SELECT
			DOCversion.id as idversion,
			DOCversion.version as numversion,
			
			DOCversion.descripcion,			
			DOCversion.id_p_DOCdocumento_id,
			
			DOCversion.id_p_comunicaciones_id_ident_entrante as id_presenta,
			DOCversion.id_p_comunicaciones_id_ident_aprobada as id_aprueba,		
			DOCversion.id_p_comunicaciones_id_ident_rechazada as id_rechaza,
			DOCversion.id_p_comunicaciones_id_ident_anulada as id_anula,

			DOCversion.previstoactual,
			DOCversion.previstoorig,
			
			DOCversion.zz_ultima_fecha_entrante_calculada,
			DOCversion.zz_ultima_fecha_aprobada_calculada,
			DOCversion.zz_ultima_fecha_rechazada_calculada,
			DOCversion.zz_ultima_fecha_anulada_calculada
			
			FROM
				DOCversion
				
			WHERE 
				DOCversion.zz_AUTOPANEL = '$PanelI'
			AND 
                DOCversion.zz_borrada!='1'
				".$wheresel."			
			order by id_p_DOCdocumento_id, numversion
		";
			
	$Consulta = $Conec1->query($query);
	
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base:'.$Conec1->error;
		$Log['tx'][]=utf8_encode($query);
		$Log['mg'][]='error al consultar la base #hthdeer';
		$Log['res']='err';
		terminar($Log);
	}	
		
	while($row = $Consulta->fetch_assoc()){
						
		if(isset($Sel)){
			if(!isset($Sel[$row['idversion']])){continue;}
		}	
		foreach($row as $k => $v){
			$f[$k]=utf8_encode($v);
		}
		
		$Versiones[$row['idversion']]=$f;
		$Versiones[$row['idversion']]['archivos']=array();
	}

	
// consulta de archivos de versiones asociadas al panel activo
	$query="
		SELECT
            DOCarchivos.id,
            DOCarchivos.FI_documento, 
            DOCarchivos.FI_nombreorig, 
            DOCarchivos.id_p_DOCversion_id
		FROM
			DOCarchivos 
		WHERE 
            DOCarchivos.zz_AUTOPANEL = '$PanelI'
        AND
            zz_borrada='no'
			$wherearch
		";
	$Consulta = $Conec1->query($query);
	
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=utf8_encode($query);
		$Log['mg'][]='error al consultar la base #hthdeer';
		$Log['res']='err';
		terminar($Log);
	}	
	
	while($row = $Consulta->fetch_assoc()){
		if(!isset($Versiones[$row['id_p_DOCversion_id']])){continue;}
		foreach($row as $k => $v){
			$Versiones[$row['id_p_DOCversion_id']]['archivos'][$row['id']][$k]=utf8_encode($v);
		}
	}	
	
	$Log['res']='exito';
	$Log['data']=$Versiones;
	terminar($Log);	
?>
