<?php 
/**
* documentos_consulta.php
*
* documentos_consulta.php se incorpora en la carpeta raiz como una función complementaria básica 
* para aquellas aplicaciones que consultan el listado de documentos presentados 
* contiene una única función que realiza una búsqueda y evalua los resultados devolviendo un array.
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

include_once('./PAN/PAN_consultainterna_config.php');//define variable $Config

$Hoy = date("Y-m-d");


if(!isset($_POST['iddoc'])){
    $Log['tx'][]='falta la variable idver';    
    $Log['res']='err';
    terminar($Log);   
}
if(!isset($_POST['panid'])){
    $Log['tx'][]='falta la variable panid';    
    $Log['res']='err';
    terminar($Log);   
}




	// consulta la información de los documentos (no de sus definiciones)(no de sus versiones) 
	$query="
		SELECT 
			`DOCdocumento`.`id`,
            `DOCdocumento`.`numerodeplano`,
            `DOCdocumento`.`nombre`,
            `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_escala` as id_escala,
            `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_rubro` as id_rubro,
            `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_planta` as id_planta,
            `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_sector` as id_sector,
            `DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_tipologia` as id_tipologia,
            `DOCdocumento`.`descripcion`,
            `DOCdocumento`.`id_p_grupos_id_nombre_tipoa`,
            `DOCdocumento`.`id_p_grupos_id_nombre_tipob`,
            `DOCdocumento`.`zz_ultimo_nversion_calculada`,
            `DOCdocumento`.`zz_ultimo_estadoversion_calculado`,
            `DOCdocumento`.`zz_ultima_fecha_calculada`,
            `DOCdocumento`.`zz_ultima_idversion_calculada`

		FROM 
			DOCdocumento
					
		WHERE     
			id = '".$_POST['iddoc']."'
		AND
            DOCdocumento.zz_AUTOPANEL = '".$PanelI."'
		AND 
            zz_borrada !='1'
	";
	
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }
    if($Consulta->num_rows<1){
        $Log['mg'][]=utf8_encode('Este panel no registra ningún Documento aún. Puede Registrar uno de forma manual o cargar los documentos para que swean registrados.');
        $Log['res']='exito';
        terminar($Log);		   
    }
    
    
    
    // la Consulta de documentos para construir un arra de documentos y asigna las definiciones obtenidas

    
	// consulta de versiones asociadas al panel activo
	$query="
		SELECT
			DOCversion.id as id,
			DOCversion.version as numversion,
					
			DOCversion.id_p_DOCdocumento_id as iddocumento,
			
			DOCversion.id_p_comunicaciones_id_ident_entrante as idpresenta,
			DOCversion.id_p_comunicaciones_id_ident_aprobada as idaprueba,		
			DOCversion.id_p_comunicaciones_id_ident_rechazada as idrechaza,
			DOCversion.id_p_comunicaciones_id_ident_anulada as idanula,

			
			DOCversion.zz_ultima_fecha_entrante_calculada,
			DOCversion.zz_ultima_fecha_aprobada_calculada,
			DOCversion.zz_ultima_fecha_rechazada_calculada,
			DOCversion.zz_ultima_fecha_anulada_calculada
			
			
			FROM
				DOCversion
				
			WHERE
				DOCversion.zz_AUTOPANEL = '$PanelI'
            AND
                id_p_DOCdocumento_id = '".$_POST['iddoc']."'
            AND 
                DOCversion.zz_borrada!='1'
			
			order by 
				numversion DESC
			LIMIT 
				1
				
		";
			
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
	
	
	while($dat = $Consulta->fetch_assoc()){		
		
		$estado='apresentar';
		$fecha='0000-00-00';
		if($dat['idpresenta']>0){
			$estado='evaluando';
			$fecha=$dat['zz_ultima_fecha_entrante_calculada'];		
		}
		if($dat['idaprueba']>0){
			$estado='aprobada';
			$fecha=$dat['zz_ultima_fecha_aprobada_calculada'];						
		}
		if($dat['idrechaza']>0){
			$estado='rechazada';						
			$fecha=$dat['zz_ultima_fecha_rechazada_calculada'];
		}
		if($dat['idanula']>0){
			$estado='anulada';						
			$fecha=$dat['zz_ultima_fecha_anulada_calculada'];
		}

		$query="
		
			UPDATE
				DOCdocumento
			SET		
				zz_ultima_idversion_calculada = '".$dat['id']."',
				zz_ultimo_nversion_calculada = '".$dat['numversion']."',
				zz_ultimo_estadoversion_calculado = '".$estado."',
				zz_ultima_fecha_calculada = '".$fecha."'
			WHERE 
				DOCdocumento.id = '".$_POST['iddoc']."'
			AND
				DOCdocumento.zz_AUTOPANEL = '$PanelI'
			AND 
				zz_borrada !='1'
		";
		
        $Consulta2 = $Conec1->query($query);
        if($Conec1->error!=''){
            $Log['tx'][]='error al consultar la base';
            $Log['tx'][]=$Conec1->error;
            $Log['tx'][]=$query;
            $Log['res']='error';
            terminar($Log);		
        }	

	}	

?>
