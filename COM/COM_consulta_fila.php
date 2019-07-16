<?php 
/**
* comunicaciones_consulta.php
*
* comunicaciones_consulta.php se incorpora en la carpeta raiz como una función complementaria básica 
* para aquellas aplicaciones que consultan el listado de comunicaciones emitidas o redactadas 
* contiene una única función que realiza una búsqueda y evalua los resultados devolviendo un array.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 2014 TReCC SA
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

chdir('..'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.

ini_set('display_errors', true);

$Hoy=date('Y-m-d');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['res']='';
function terminar($Log){
    $res=json_encode($Log);
    if($res==''){$Log['tx'][]=erroresJson();$res=print_r($Log,true);}
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

if(!isset($_POST['id'])){
    $Log['tx'][]='falta variable id';
    $Log['res']='err';
    terminar($Log);
}

$Id=$_POST['id'];	

if($Id == ''){
	
	$setsent='';
	if($_POST['filtro_sentido']=='saliente'||$_POST['filtro_sentido']=='entrante'){$setsent=" sentido ='".$_POST['filtro_sentido']."', ";}

	$setga='';
	if(is_numeric($_POST['filtro_idga'])){$setga=" id_p_grupos_id_nombre_tipoa ='".$_POST['filtro_idga']."', ";}

	$setgb='';
	if(is_numeric($_POST['filtro_idgb'])){$setgb=" id_p_grupos_id_nombre_tipob ='".$_POST['filtro_idgb']."', ";}
			
    $query="		
        INSERT INTO 
        `paneles`.`comunicaciones`
        SET
        ".$setsent."
        ".$setga."
        ".$setgb."
        `zz_AUTOPANEL` = '".$PanelI."',
        `zz_preliminar`='1'
    ";							
    $Conec1->query($query);;
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar columnas';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
    
    $Id = $Conec1->insert_id;
    
    if($Id<1){
        $Log['tx'][]='error al generar un nuevo id: '.$Id;
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }	
}	

unset($_POST['id']);

include('./COM/COM_consultainterna_listadito.php');


$query="
    SELECT 
        `comunicaciones`.`id`,
        `comunicaciones`.`sentido`,
        `comunicaciones`.`requerimiento`,
        `comunicaciones`.`requerimientoescrito`,
        `comunicaciones`.`fecharecepcion`,
        `comunicaciones`.`fechainicio`,
        `comunicaciones`.`fechaobjetivo`,
        `comunicaciones`.`ident`,
        `comunicaciones`.`identdos` as id2,
        `comunicaciones`.`identtres` as id3,
        `comunicaciones`.`cerrado`,
        `comunicaciones`.`cerradodesde`,
        `comunicaciones`.`nombre`,
        `comunicaciones`.`descripcion`,
        `comunicaciones`.`preliminar`,
        `comunicaciones`.`relevante`,
        `comunicaciones`.`id_p_grupos_id_nombre_tipoa`,
        `comunicaciones`.`id_p_grupos_id_nombre_tipob`,
        `comunicaciones`.`zz_borrada`,
        `comunicaciones`.`zz_preliminar`,
        `comunicaciones`.`zz_borradafecha`,
        `comunicaciones`.`zz_borradausuario`,
        `comunicaciones`.`zz_reg_fecha_emision`
        
    FROM 
        $Base.comunicaciones 						
    WHERE 
        comunicaciones.zz_AUTOPANEL = '$PanelI'
        AND 
        comunicaciones.id = '$Id'
                            
";
$Consulta=	$Conec1->query($query);;
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar columnas';
    $Log['tx'][]=utf8_encode($query);
    $Log['tx'][]=utf8_encode($Conec1->error);
    $Log['res']='err';
    terminar($Log);
}
    
if($Consulta->num_rows<1){
    $Log['tx'][]='no se encontro ninguna comunicacion';
    $Log['res']='err';
    terminar($Log);		
}

while($row = $Consulta->fetch_assoc()){
    
    foreach($row as $k => $v){
        $Log['data'][$k]=utf8_encode($v);
    }
    
    $Log['data']['encabezadoHTML']=utf8_encode($Config['com-text-encabezado-'.$row['sentido']]);
    $Log['data']['pieHTML']=utf8_encode($Config['com-text-pie-'.$row['sentido']]);
    $Log['data']['CSS']=utf8_encode($Config['com-text-css']);
    
    $Log['data']['respuestas']=array();
    $Log['data']['origenes']=array();
    $Log['data']['adjuntos']=array();		
    
    $Log['data']['documentosasociados']['presentados']=array();
    $Log['data']['documentosasociados']['aprobados']=array();
    $Log['data']['documentosasociados']['rechazados']=array();
    if(isset($documentosasociados[$row['id']])){
        $Log['data']['documentosasociados']['presentados']=$documentosasociados[$row['id']]['presentados'];
    }
    
    $Log['data']['documentosasociados']['respuestos']=array();
    if(isset($documentosasociados[$row['id']])){
        $Log['data']['documentosasociados']['respuestos']=$documentosasociados[$row['id']]['respuestos'];
    }		
    
    $gn='';
    $gc='';
    if(isset($Grupos[$row['id_p_grupos_id_nombre_tipoa']])){
        $gn=$Grupos[$row['id_p_grupos_id_nombre_tipoa']]['nombre'];
        $gc=$Grupos[$row['id_p_grupos_id_nombre_tipoa']]['codigo'];
    }				
    $Log['data']['grupoa']=$gn;
    $Log['data']['grupoacod']=$gc;
    
    $gn='';
    $gc='';
    if(isset($Grupos[$row['id_p_grupos_id_nombre_tipob']])){
        $gn=utf8_encode($Grupos[$row['id_p_grupos_id_nombre_tipob']]['nombre']);
        $gc=utf8_encode($Grupos[$row['id_p_grupos_id_nombre_tipob']]['codigo']);
    }								

    $Log['data']['grupob']=$gn;
    $Log['data']['grupobcod']=$gc;
    
    if($row['preliminar']=='extraoficial'){$o='x';}else{$o='';}
    
    // incorpora al array un nombre que incluye el prefijo generado	
    $PREN['entrante']=$Config['com-entra-preN'.$o];
    $PREN['saliente']=$Config['com-sale-preN'.$o];
    $Log['data']['falsonombre']=$PREN[$row['sentido']].$row['ident'];		
    
    //define el status de la comunicación en abierta o cerrado
    if($row['cerrado']=='si'){
        $Log['data']['estado']='cerrada';
    }else{
        $Log['data']['estado']='abierta';
    }	


    if($Log['data']['fechaobjetivo']<$Hoy && $Log['data']['cerrado']=='no' && $Log['data']['requerimiento']=='si'){
        $Log['data']['banderaroja']='si';
    }else{
        $Log['data']['banderaroja']='no';
    }
            
    if($Log['data']['cerrado']=="si (controlar)"){
        $Log['data']['ojito']='si';						
    }else{
        $Log['data']['ojito']='no';
    }
    
    if($Log['data']['zz_borrada']=='1'){
        $Log['data']['EstElim']='eliminada';
        $Log['data']['nombre']='-Comnunicación Eliminada- '+$Log['data']['nombre']; 
    }else{
        $Log['data']['EstElim']='';
    }

    if(!validaracceso($row['id_p_grupos_id_nombre_tipob'],$row['id_p_grupos_id_nombre_tipoa'])){
        unset($Log['data']);
    }
}


// consulta documentos adjuntos

$query="		
    SELECT 
        COMdocumentos.*,
        COMdocumentos.id_p_comunicaciones_id as idcom
    FROM 
        $Base.COMdocumentos
    WHERE
        (
            COMdocumentos.zz_AUTOPANEL = '$PanelI'
            OR 
            COMdocumentos.zz_AUTOPANEL = '-1'
        )
        AND 
        COMdocumentos.zz_borrada='no'
        AND
        COMdocumentos.id_p_comunicaciones_id='$Id'
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar documentos';
    $Log['tx'][]=utf8_encode($query);
    $Log['tx'][]=utf8_encode($Conec1->error);
    $Log['res']='err';
    terminar($Log);
}
while($row = $Consulta->fetch_assoc()){
    
    if($row['id']!=''){	
                //echo " rowfiltrada ";
        foreach($row as $k => $v){
        	$r[$k]=utf8_encode($v);
		}
        $Log['data']['adjuntos'][]=$r;
    }
}	


// consulta lista de estados 
$query="
    SELECT 
        `comunestadoslista`.`id`,
        `comunestadoslista`.`estadio` as estadio,
        `comunestadoslista`.`descripcion`,
        `comunestadoslista`.`id_p_responsables_id_nombre`,
        `comunestadoslista`.`sentido`,
        `comunestadoslista`.`id_p_responsables_id_nombre_alerta`,
        `comunestadoslista`.`orden`,
        `comunestadoslista`.`requeridodefecto`,
        `comunestadoslista`.`id_p_grupos_id_nombre`,
        `comunestadoslista`.`zz_AUTOPANEL`
    FROM 
        $Base.`comunestadoslista`			
    WHERE 
            zz_AUTOPANEL = '$PanelI' 
    ORDER BY
        orden asc
";
$Consulta = $Conec1->query($query);		
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar estados';
    $Log['tx'][]=utf8_encode($query);
    $Log['tx'][]=utf8_encode($Conec1->error);
    $Log['res']='err';
    terminar($Log);
}
$Log['data']['estadosOrden']['entrante']=array();
$Log['data']['estadosOrden']['saliente']=array();
while($row = $Consulta->fetch_assoc()){
    
    $Log['data']['estadosOrden'][$row['sentido']][]=$row['id'];
    
    foreach($row as $k => $v){
        $Log['data']['estados'][$row['id']][$k]=utf8_encode($v);			
    }
    $Log['data']['estados'][$row['id']]['desde']='';
}	
 
$query="		
    SELECT 
        comunestados.`id`,
        comunestados.`id_p_comunicaciones_id_nombre`,
        comunestados.`id_p_comunestadoslista`,
        comunestados.`desde`,
        comunestados.`pordefecto`,
        comunestados.`zz_AUTOPANEL`,
        comunestadoslista.orden
    FROM 
        $Base.comunestados,
        $Base.comunestadoslista
    WHERE 
        comunestados.id_p_comunestadoslista = comunestadoslista.id
        AND
        comunestados.zz_AUTOPANEL = '$PanelI'
        AND
        comunestados.`id_p_comunicaciones_id_nombre`='$Id'
    ORDER BY orden, desde 
";
//echo $query;
$Consulta = $Conec1->query($query);			
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar estados';
    $Log['tx'][]=utf8_encode($query);
    $Log['tx'][]=utf8_encode($Conec1->error);
    $Log['res']='err';
    terminar($Log);
}
//$resultado=array();	
unset($primero);
while($row = $Consulta->fetch_assoc()){
	
    if(!isset($Log['data']['estados'][$row['id_p_comunestadoslista']])){continue;}
    
    $setidoEstado = $Log['data']['estados'][$row['id_p_comunestadoslista']]['sentido'];
    $setidoCom = $Log['data']['sentido'];
    if($setidoEstado != $setidoCom){continue;}
    
    if($Log['data']['estados'][$row['id_p_comunestadoslista']]['requeridodefecto']=='1'){
        $Log['data']['recepcion']=$row['desde'];
    }
    
    $Log['data']['estados'][$row['id_p_comunestadoslista']]['desde']=$row['desde'];
    if(!isset($primero)){
    	$Log['data']['emision']=$row['desde'];
    	$primero=$Log['data']['estados'][$row['id_p_comunestadoslista']];
    };
}	
 
if(!isset($Log['data']['emision'])){
    $Log['data']['emision']=$Log['data']['zz_reg_fecha_emision'];
}else if($Log['data']['emision']!=$Log['data']['zz_reg_fecha_emision']){
    $Log['data']['zz_reg_fecha_emision']=$Log['data']['emision'];
    $query="	
        UPDATE `paneles`.`comunicaciones`
        SET `zz_reg_fecha_emision` = '".$Log['data']['emision']."'
        WHERE 
        `id` = '".$Id."'
        AND zz_AUTOPANEL='$PanelI'
    ";
    //echo PHP_EOL.$query;
    
    $Conec1->query($query);		
    if($Conec1->error!=''){
        $Log['tx'][]='error al actualizar la fcha de emision';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
    $Log['tx'][]=utf8_encode('actualizado el cache de la fecha de emisión de '.$Id." a ".$row['emision']);
}		

	if(fechavalida($Log['data']['zz_reg_fecha_emision'])){
		$Log['data']['zz_reg_fecha_emisionTx']= utf8_encode(traducirdiasemanados($Log['data']['zz_reg_fecha_emision']).', '.dia($Log['data']['zz_reg_fecha_emision']).' de '.mesano($Log['data']['zz_reg_fecha_emision']));
	}else{
		$Log['data']['zz_reg_fecha_emisionTx']= 'sin dato';
	}
	//terminar($Log);
	$versiones=array();// variable de versiones asociadas a una comunicacion
	$Ddocumentosasoc=array();// vriable resultado
	$query="
		SELECT
			id,nombre,numerodeplano
		FROM
			paneles.DOCdocumento
		WHERE
			zz_AUTOPANEL = '$PanelI'
		AND
			zz_borrada='0'
		";
	$Consulta = $Conec1->query($query);;
	 if($Conec1->error!=''){
        $Log['tx'][]='error al actualizar la fecha de emision';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
	
	while($row=$Consulta->fetch_assoc()){
		foreach($row as $k => $v){
			$docs[$row['id']][$k]=utf8_encode($v);
		}
	}	
	    
	$query="
		SELECT
			DOCversion.id as idversion,
			DOCversion.version as numversion,	
			DOCversion.previstoactual as programada,			
			DOCversion.id_p_DOCdocumento_id as iddocumento,
			DOCversion.id_p_comunicaciones_id_ident_entrante as idpresenta,
			DOCversion.id_p_comunicaciones_id_ident_aprobada as idaprueba,
			DOCversion.id_p_comunicaciones_id_ident_anulada as idanula,			
			DOCversion.id_p_comunicaciones_id_ident_rechazada as idrechaza
		
		FROM
			DOCversion
		WHERE 
			DOCversion.zz_AUTOPANEL = '$PanelI'
			AND 
			DOCversion.zz_borrada='0'
			AND
			DOCversion.id_p_comunicaciones_id_ident_entrante='$Id'
		order by id_p_DOCdocumento_id, id
	";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar versiones';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	while($row=$Consulta->fetch_assoc()){
		$versiones[$row['idversion']]=$row;
		$ultimaversion[$row['iddocumento']]=$row['idversion'];
	}		

	foreach($versiones as $Idver => $dataver){
		$dat['id']=$dataver['iddocumento'];
		if(isset($docs[$dataver['iddocumento']])){
			$dat['ndoc']  =utf8_encode($docs[$dataver['iddocumento']]['nombre']);
			$dat['numdoc']=utf8_encode($docs[$dataver['iddocumento']]['numerodeplano']);	
		}
		
		$dat['numversion']=$dataver['numversion'];
	
		if(isset($docs[$dataver['iddocumento']])){	
			$Log['data']['documentosasociados']['presentados'][$Idver]=$dat;			
			if(!isset($Log['data']['respuestos'])){$Log['data']['respuestos']=array();}
			if($dataver['idanula']>0||$dataver['idaprueba']>0||$dataver['idrechaza']>0||$dataver['idversion']!=$ultimaversion[$dataver['iddocumento']]){				
				$Log['data']['documentosas']['respuestos'][$Idver]=$dat;
			}		
		}
	}	
	
	$query="
		SELECT
			DOCversion.id as idversion,
			DOCversion.version as numversion,	
			DOCversion.previstoactual as programada,			
			DOCversion.id_p_DOCdocumento_id as iddocumento,
			DOCversion.id_p_comunicaciones_id_ident_entrante as idpresenta,
			DOCversion.id_p_comunicaciones_id_ident_aprobada as idaprueba,
			DOCversion.id_p_comunicaciones_id_ident_anulada as idanula,			
			DOCversion.id_p_comunicaciones_id_ident_rechazada as idrechaza
			
			FROM
				DOCversion
			WHERE 
				DOCversion.zz_AUTOPANEL = '$PanelI'
				AND 
				DOCversion.zz_borrada='0'
				AND
				DOCversion.id_p_comunicaciones_id_ident_aprobada='$Id'
			order by id_p_DOCdocumento_id, id
		";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar versiones2';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	while($row=$Consulta->fetch_assoc()){
		$versiones[$row['idversion']]=$row;
		$ultimaversion[$row['iddocumento']]=$row['idversion'];
	}		

	foreach($versiones as $Idver => $dataver){
		
		if($dataver['idaprueba'] != $Id){continue;}
		
		$dat['id']=$dataver['iddocumento'];
		
		if(isset($docs[$dataver['iddocumento']])){
			$dat['ndoc']=utf8_encode($docs[$dataver['iddocumento']]['nombre']);
			$dat['numdoc']=utf8_encode($docs[$dataver['iddocumento']]['numerodeplano']);	
		}
		
		$dat['numversion']=$dataver['numversion'];
	
		if(isset($docs[$dataver['iddocumento']])){
			$Log['data']['documentosasociados']['aprobados'][$Idver]=$dat;		
		}
	}	
	
$query="
		SELECT
			DOCversion.id as idversion,
			DOCversion.version as numversion,	
			DOCversion.previstoactual as programada,			
			DOCversion.id_p_DOCdocumento_id as iddocumento,
			DOCversion.id_p_comunicaciones_id_ident_entrante as idpresenta,
			DOCversion.id_p_comunicaciones_id_ident_aprobada as idaprueba,
			DOCversion.id_p_comunicaciones_id_ident_anulada as idanula,			
			DOCversion.id_p_comunicaciones_id_ident_rechazada as idrechaza
			
			FROM
				DOCversion
			WHERE 
				DOCversion.zz_AUTOPANEL = '$PanelI'
				AND 
				DOCversion.zz_borrada='0'
				AND
				DOCversion.id_p_comunicaciones_id_ident_rechazada='$Id'
			order by id_p_DOCdocumento_id, id
		";
	$Consulta = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar versiones3';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	
	
	$versiones=Array();
	while($row=$Consulta->fetch_assoc()){
		$versiones[$row['idversion']]=$row;
		$ultimaversion[$row['iddocumento']]=$row['idversion'];
	}		

	foreach($versiones as $Idver => $dataver){
		
		if($dataver['idrechaza']!= $Id){continue;}
		
		$dat['id']=$dataver['iddocumento'];
		
		if(isset($docs[$dataver['iddocumento']])){
			$dat['ndoc']=utf8_encode($docs[$dataver['iddocumento']]['nombre']);
			$dat['numdoc']=utf8_encode($docs[$dataver['iddocumento']]['numerodeplano']);	
		}
		
		$dat['numversion']=$dataver['numversion'];
	
		if(isset($docs[$dataver['iddocumento']])){
			$Log['data']['documentosasociados']['rechazados'][$Idver]=$dat;		
		}
	}	
		
	$query="
		SELECT 
			`COMlinkrespuesta`.`id`,
			`COMlinkrespuesta`.`id_p_comunicaciones_id_nombre_origen`,
			`COMlinkrespuesta`.`id_p_comunicaciones_id_nombre_respuesta`,
			`COMlinkrespuesta`.`zz_AUTOPANEL`
			FROM 
				`COMlinkrespuesta`
			WHERE 
				zz_AUTOPANEL='$PanelI'
			AND
			(
				id_p_comunicaciones_id_nombre_origen='$Id'
				OR
				id_p_comunicaciones_id_nombre_respuesta='$Id'
			)
			
	";
	$Consulta = $Conec1->query($query);		
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar respuestas';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}

	while($row = $Consulta->fetch_assoc()){
		
		if(
			isset($row['id_p_comunicaciones_id_nombre_origen'])
			&&
			isset($row['id_p_comunicaciones_id_nombre_respuesta'])
		){//verifica que l registro de link esté completo
			
			//verifica que los objetos a linkear estén diponibles
					
				//inserta el vínculo a su objeto de origen  
				if(
					$row['id_p_comunicaciones_id_nombre_origen']==$Id
				){
					if(isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_respuesta']])){
							
						$res=$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_respuesta']];
								
						$rta['ident']=utf8_encode($res['id1']);
						$rta['identdos']=utf8_encode($res['id2']);
						$rta['identtres']=utf8_encode($res['id3']);
						$rta['nombre']=utf8_encode($res['nombre']);
						$rta['linkid']=$row['id'];
						$rta['estado']=$res['estado'];
						
						if(!isset($res['emision'])){$res['emision']='0000-00-00';}	
						$rta['emision']=$res['emision'];
						
						$rta['sentido']=$res['sentido'];
						$rta['falsonombre']=utf8_encode($res['falsonombre']);
						$rta['estado']=$res['estado'];				
						
						if($row['id_p_comunicaciones_id_nombre_origen']==$Id){
		                    $Log['data']['respuestas'][$row['id']]=$rta;
						}
					}else{
						$Log['data']['respuestas'][$row['id']]['linkid']=$row['id'];
						$Log['data']['respuestas'][$row['id']]['falsonombre']='ELIMINADA';
					}
					
					
					
					unset($res);
				}elseif(
					$row['id_p_comunicaciones_id_nombre_respuesta']==$Id
				){
			
					if(isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_origen']])){
						$res=$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_origen']];			
						
						//inserta el vínculo a su objeto de destino	
								
						$ori['ident']=utf8_encode($res['id1']);
						$ori['identdos']=utf8_encode($res['id2']);
						$ori['identtres']=utf8_encode($res['id3']);
						$ori['nombre']=utf8_encode($res['nombre']);
						$ori['linkid']=$row['id'];
						if(!isset($res['emision'])){$res['emision']='0000-00-00';}						
						$ori['emision']=$res['emision'];
						$ori['sentido']=$res['sentido'];
						$ori['falsonombre']=utf8_encode($res['falsonombre']);
						$ori['estado']=$res['estado'];
						
						if($row['id_p_comunicaciones_id_nombre_respuesta']==$Id){
		                    $Log['data']['origenes'][$row['id']]=$ori;
						}
						unset($res);
					}else{
						$Log['data']['origenes'][$row['id']]['linkid']=$row['id'];
						$Log['data']['origenes'][$row['id']]['falsonombre']='ELIMINADA';
					}
					
				}	
				//echo "____";
				//if($row['id']=='658'){echo $row['id_p_comunicaciones_id_nombre_origen']; print_r($res);}
				//echo $row['id'].",";																
				
		}
	}	
	unset($Log['data']['comunicaciones']);
	unset($Log['data']['ordenado']);

	if(!isset($Log['data']['emision'])){$Log['data']['emision']="<span class='alerta'>a emitir</span>";}
	if($Log['data']['emision']=="<span class='alerta'>a emitir</span>"){
		$Log['data']['emisionHTML']=$Log['data']['emision'];
	}else{
		$Log['data']['emisionHTML']=dia($Log['data']['emision'])."<br>".mesuno($Log['data']['emision'])."<br><span>".ano($Log['data']['emision'])."</span>";
	}
	
	if(!isset($Log['data']['recepcion'])){$Log['data']['recepcion']='0000-00-00';}
	$Log['data']['recepcionHTML']=dia($Log['data']['recepcion'])."<br>".mesuno($Log['data']['recepcion'])."<br><span>".ano($Log['data']['recepcion'])."</span>";
		
	If(!isset($ultimafecha)){$ultimafecha='';}	
	if($ultimafecha!='' && ($Log['data']['recepcion']=='' || $Log['data']['recepcion']=='0000-00-00')){
		$Log['data']['recepcionHTML'] .= "<span title='esta fecha no es la última prevista del ciclo'>*</span>" ;
	}
	
	if($Log['data']['cerradodesde']>'0000-00-00'){
		$Log['data']['cerradodesdeHTML']=dia($Log['data']['cerradodesde'])."<br>".mesuno($Log['data']['cerradodesde'])."<br><span>".ano($Log['data']['cerradodesde'])."</span>";
	}else{
		$Log['data']['cerradodesdeHTML']="";
	}	
	
	$Log['data']['modelos']=array();		
	$query="
		SELECT 
			id, descripcion, aclaraciones, nombre
		FROM 
			COMmodelos
		WHERE
		zz_borrada='0'
		AND
			zz_AUTOPANEL='".$PanelI."'
	";
	$Consulta=$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar configuracióna editar';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	while($row = $Consulta->fetch_assoc()){
		foreach($row as $k => $v){
			$Log['data']['modelos'][$row['id']][$k]=utf8_encode($v);		
		}
	}

	$Log['res']='exito';
	terminar($Log);
	

?>
