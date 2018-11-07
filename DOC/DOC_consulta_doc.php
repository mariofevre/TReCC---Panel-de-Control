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


/**
* realiza una consulta de documentos presntados asociando comunicaciones para determinar la fecha de presentación y el estado de cada una
*
 * variables globales de entrada
* @global integer $PanelI id del panel activo y validado para su acceso
* @global resource $Conec1 conección abierta a la base de datos mysql 
* @global array $Config configuración del panel, resultado de la búsqueda en la base.
* @global date $_POST['Freportehasta'] define fecha de consulta elimina todo registro postrior a la fecha de consulta, simula una consulta realizada en el pasado.  
* @global string $FILTRO filtro por estado, estando definido solo muestra documentaciones con estado de igual nombre.
* @global date $FILTROFECHAD filtra la búsqueda de documentos mostrando solo aquellos presentados porteriores a la fecha dada.
* @global date $FILTROFECHAH filtra la búsqueda de documentos mostrando solo aquellos presentados anteriores a la fecha dada (esto es distinto de $Freportehata).
 * variables globales de salida (devuelven vaaores sumarizados)
* @global integer $CANTdocumentos cantidad totale de documentos programados para el proyecto
* @global integer $CANTdocumentosaprobados cantidad de documentos aprobados en su última versión programada
* @global integer $CANTdocumentospresentados cantidad de documentos presntados en su última versión programada
* @global integer $CANTdocumentosrechazado cantidad de documentos rechazados en su última versión programada
* @global integer $CANTdocumentosapresentar cantidad de documentos a presentar en última versión programada
* @global integer $CANTdocumentosevaluando cantidad de documentos en evaluación en su última versión programada
 * 
* @return array Retorna listado de documentos con sublistados de versiones (con el key de su numeracion) y un sublistado de características del documento general (bajo el key 00)
	 *array
	 * DOCUMENTO 1
	 * 	V1
	 * 		id
	 * 		id documentación relacionada
	 * 		fecha versión relacionada
	 * 		etc.
	 * 	V2
	 * 		id
	 * 		id documentación relacionada
	 * 		fecha versión relacionada
	 * 		etc.
	 * 	V3
	 * 		id
	 * 		id documentación relacionada
	 * 		fecha versión relacionada
	 * 		etc.
	 * 	Vn
	 * 		id
	 * 		id documentación relacionada
	 * 		fecha versión relacionada
	 * 		etc.
	 * 	00 (datos del documento)
	 * 		númro
	 * 		planta
	 * 		etc.
	 * DOCUMENTO 2
	 * etc 
	 *
*/

if(!isset($_POST['Freportehasta'])){$_POST['Freportehasta']='9999-12-30';}
if($_POST['Freportehasta']=='0000-00-00'){$_POST['Freportehasta']='9999-12-30';}
	
	$Log['data']['indice']=array();	
	$Log['data']['categorias']=array();	
    $Log['data']['grupos']=array();
	$Log['data']['docs']=array();
	
	// consulta la información de las definiciones de documentos asociadas a este panel 		
	$query="
		SELECT 
			`DOCdef`.`id`,
            `DOCdef`.`tipo`,
            `DOCdef`.`nombre`,
            `DOCdef`.`descripcion`,
            `DOCdef`.`id_p_paneles_id_nombre`,
            `DOCdef`.`codigo`
        FROM 
            `paneles`.`DOCdef`
		WHERE 
            zz_AUTOPANEL = '$PanelI'
		AND
            zz_borrada='0'
        ORDER BY nombre asc
    ";

    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	

    $Log['data']['categorias']['id_escala'][0]['nombre']='-';	
    $Log['data']['categorias']['id_sector'][0]['nombre']='-';	
    $Log['data']['categorias']['id_rubro'][0]['nombre']='-';	
    $Log['data']['categorias']['id_planta'][0]['nombre']='-';	
    $Log['data']['categorias']['id_tipologia'][0]['nombre']='-';	
	//construye un array con las definiciones para luego  asignar a cada documento
	While($row = $Consulta->fetch_assoc()){
        $nom=$row['nombre'];
        
        $Log['data']['categorias']['id_'.$row['tipo']][$row['id']]['nombre']=utf8_encode($nom);
        
        $str = cadenaLimpiar($nom);//funcion en ./includes/cadenas.php
        $str = strtolower($str);
        if($str==''){continue;}
        
        $Log['data']['categorias']['id_'.$row['tipo']][$row['id']]['disp']='si';
        if(isset($Log['data']['categoriasHatch']['id_'.$row['tipo']][$str])){
            $Log['data']['categorias']['id_'.$row['tipo']][$row['id']]['disp']='no';
        }else{
            $Log['data']['categoriasOrden']['id_'.$row['tipo']][]=$row['id'];
        }
        $Log['data']['categorias']['id_'.$row['tipo']][$row['id']]['nombreHatch']=utf8_encode($str); 
        $Log['data']['categoriasHatch']['id_'.$row['tipo']][$str][$row['id']]='';
	}

	// consulta la información de los grupos asociados a este panel 		
	$query="
		SELECT 
			*
		FROM 
			grupos
		WHERE 
            zz_AUTOPANEL = '$PanelI'
		";
	
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
    
	While($row = $Consulta->fetch_assoc()){
        foreach($row as $k => $v){
            $Log['data']['grupos'][$row['id']][$k]=utf8_encode($v);
        }
	}
	
	$Log['data']['tipo']='estandar';
	$andwhereid='';
	if(isset($_POST['iddoc'])){
		if($_POST['iddoc']>0){
			$andwhereid=" AND id = '".$_POST['iddoc']."'";
			$Log['data']['tipo']='undoc';
		}
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
            DOCdocumento.zz_AUTOPANEL = '".$PanelI."'
		AND 
            zz_borrada !='1'
        ".$andwhereid."
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
	$PreContenido=array();
	
    while($row=$Consulta->fetch_assoc()){
        foreach($row as $k => $v){
            $Log['data']['docs'][$row['id']][$k]=utf8_encode($v);
        }
        
        $Log['data']['docs'][$row['id']]['versiones']=array();
        $Log['data']['docs'][$row['id']]['ultimaver']='';
        $Log['data']['docs'][$row['id']]['ultimaversionid']='';
        $Log['data']['docs'][$row['id']]['ultimaverestado']='';
        $Log['data']['docs'][$row['id']]['ultimaverfecha']='';


        if(!isset($Log['data']['categorias']['id_escala'][$row['id_escala']])){
            $Log['data']['categorias']['id_escala'][$row['id_escala']]='-';
        }
        if(!isset($Log['data']['categorias']['id_rubro'][$row['id_rubro']])){
            $Log['data']['categorias']['id_rubro'][$row['id_rubro']]='-';
        }
        if(!isset($Log['data']['categorias']['id_sector'][$row['id_sector']])){
            $Log['data']['categorias']['id_sector'][$row['id_sector']]='-';
        }
        if(!isset($Log['data']['categorias']['id_planta'][$row['id_planta']])){
            $Log['data']['categorias']['id_planta'][$row['id_planta']]='-';
        }
        if(!isset($Log['data']['categorias']['id_tipologia'][$row['id_tipologia']])){
            $Log['data']['categorias']['id_tipologia'][$row['id_tipologia']]='-';
        }

		$nombresinblancos=strtoupper(str_replace(" ", "", $row['numerodeplano']));
		if(!isset($PLANOSACARGADOS[$nombresinblancos])){$PLANOSACARGADOS[$nombresinblancos]=0;}
		$PLANOSACARGADOS[$nombresinblancos]++; //variable global, array listado de números de plano y sus respectivas cantidades		


		$np=$row['numerodeplano'];
		$row['id_p_grupos_id_nombre_tipoa']=intval($row['id_p_grupos_id_nombre_tipoa']);
		$row['id_p_grupos_id_nombre_tipob']=intval($row['id_p_grupos_id_nombre_tipob']);
		$Log['data']['indice'][$row['id_p_grupos_id_nombre_tipoa']][$row['id_p_grupos_id_nombre_tipob']][$row['id_sector']][$np][$row['id_sector']][]=$row['id'];

		
		if(isset($Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']])){
			if($Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']]['codigo']!=''){
				$g=$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']]['codigo'];
			}else{
				$g=$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipoa']]['nombre'];
			}
			$Log['data']['categorias']['grupoa'][$row['id_p_grupos_id_nombre_tipoa']]=$g;
		}
		
		if(isset($Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipob']])){		
			if($Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipob']]['codigo']!=''){
				$g=$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipob']]['codigo'];
			}else{
				$g=$Log['data']['grupos'][$row['id_p_grupos_id_nombre_tipob']]['nombre'];
			}
			$Log['data']['categorias']['grupob'][$row['id_p_grupos_id_nombre_tipob']]=$g;
		}		
	}
	
// consulta de comunicaciones asociadas al panel activo	 (restringe aquellas previas a la fecha rfeportehasta (simulaci´no de reporte pasado))
	$query="
		SELECT				
			comunicaciones.id as id,
			comunicaciones.ident as num,
			comunicaciones.zz_reg_fecha_emision as fecha,	
			comunicaciones.preliminar as prelim,		
			comunicaciones.sentido as sentido
		FROM
			comunicaciones	 
		WHERE 
			zz_AUTOPANEL = '$PanelI'
			AND 
			(
                comunicaciones.zz_reg_fecha_emision <= '".$_POST['Freportehasta']."' 
                OR comunicaciones.zz_reg_fecha_emision IS NULL
            )
		";			
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
   
//Itera el resultado de consulta de comunicaciónes en una array cuyo key es el id de la comunicación	
	while($row = $Consulta->fetch_assoc()){
		
        foreach($row as $k => $v){
            $Log['data']['comunicaciones'][$row['id']][$k]=utf8_encode($v);
        }
	
		if($row['sentido']=='entrante'){
			if($row['prelim']=='oficial'){ $Log['data']['comunicaciones'][$row['id']]['prefijo']=$Config['com-entra-preN'];}
			if($row['prelim']=='extraoficial'){ $Log['data']['comunicaciones'][$row['id']]['prefijo']=$Config['com-entra-preNx'];}
		}elseif($row['sentido']=='saliente'){
			if($row['prelim']=='oficial'){ $Log['data']['comunicaciones'][$row['id']]['prefijo']=$Config['com-sale-preN'];}
			if($row['prelim']=='extraoficial'){ $Log['data']['comunicaciones'][$row['id']]['prefijo']=$Config['com-sale-preNx'];}
		}					
	}

	
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
                id_p_DOCdocumento_id > 0
            AND 
                DOCversion.zz_borrada!='1'
			
			order by iddocumento, numversion
		";
			
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
	
	
	
	while($row = $Consulta->fetch_assoc()){		
        if(!isset($Log['data']['docs'][$row['iddocumento']])){continue;}
        unset($f);
		foreach($row as $k => $v){
			$f[$k]=utf8_encode($v);
		}
		if(!isset($nv[$row['iddocumento']])){$nv[$row['iddocumento']]='0';}
		
		
		if($_POST['idcom']>0){
			
			if(
				$_POST['idcom']==$row['idpresenta']
				||
				$_POST['idcom']==$row['idaprueba']
				||
				$_POST['idcom']==$row['idrechaza']
				||
				$_POST['idcom']==$row['idanula']
				){
				$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['selec']='1';
				$Log['data']['docs'][$row['iddocumento']]['selec']='1';
			}
		}
		
		
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]=$f;
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['desde']='';
		
		$nv[$row['iddocumento']]++;
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['numversion']=$nv[$row['iddocumento']];
		$Log['data']['docs'][$row['iddocumento']]['versionesOrden'][]=$row['id'];
		
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estado']='apresentar';
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estadotx']='a presentar';
		
		$Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['archivos']=array();
		
		$actualizas='';
		if($f['idpresenta']>0){
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estado']='enevaluacion';
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estadotx']='evaluando';            

            if(!isset($Log['data']['comunicaciones'][$row['idpresenta']]['fecha'])){
                $Log['mg'][]=utf8_encode('En el documento id:'.$row['iddocumento'].', la versión id:'.$row['id'].', la comunicacion por la cual se presenta esa versión parece pertenecer a otro panel, por favor soucione la inconsistencia en los datos'); 
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']='';
            }else{
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']=$Log['data']['comunicaciones'][$row['idpresenta']]['fecha'];
                if($Log['data']['comunicaciones'][$f['idpresenta']]['fecha']!=$f['zz_ultima_fecha_entrante_calculada']){
                    $actualizas.="zz_ultima_fecha_entrante_calculada = '".$Log['data']['comunicaciones'][$f['idpresenta']]['fecha']."', ";		
                }                  
            }
        }
        
        if($f['idaprueba']>0){
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estado']='aprobada';
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estadotx']='aprobado';
            
            if(!isset($Log['data']['comunicaciones'][$row['idaprueba']]['fecha'])){
                $Log['mg'][]=utf8_encode('En el documento id:'.$row['iddocumento'].', la versión id:'.$row['id'].', la comunicacion por la cual se aprueba esa versión parece pertenecer a otro panel, por favor soucione la inconsistencia en los datos'); 
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']='';
            }else{
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']=$Log['data']['comunicaciones'][$row['idaprueba']]['fecha'];
                if($Log['data']['comunicaciones'][$f['idaprueba']]['fecha']!=$f['zz_ultima_fecha_aprobada_calculada']){
                    $actualizas.="zz_ultima_fecha_aprobada_calculada = '".$Log['data']['comunicaciones'][$f['idaprueba']]['fecha']."', ";		
                }                
            }
            

        }

        if($f['idrechaza']>0){
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estadotx']=utf8_encode('a revisión');
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estado']=utf8_encode('rechazada');
            
            if(!isset($Log['data']['comunicaciones'][$row['idrechaza']]['fecha'])){
                $Log['mg'][]=utf8_encode('En el documento id:'.$row['iddocumento'].', la versión id:'.$row['id'].', la comunicacion por la cual se rechaza esa versión parece pertenecer a otro panel, por favor soucione la inconsistencia en los datos'); 
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']='';
            }else{
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']=$Log['data']['comunicaciones'][$row['idrechaza']]['fecha'];
                if($Log['data']['comunicaciones'][$f['idrechaza']]['fecha']!=$f['zz_ultima_fecha_rechazada_calculada']){
                    $actualizas.="zz_ultima_fecha_rechazada_calculada = '".$Log['data']['comunicaciones'][$f['idrechaza']]['fecha']."', ";		
                }    
            }
        }	
        
        if($f['idanula']>0){
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estado']=utf8_encode('anulada');
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['estadotx']=utf8_encode('anulada');
            $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']=$Log['data']['comunicaciones'][$f['idanula']]['fecha'];
            
            if(!isset($Log['data']['comunicaciones'][$row['idanula']]['fecha'])){
                $Log['mg'][]=utf8_encode('En el documento id:'.$row['iddocumento'].', la versión id:'.$row['id'].', la comunicacion por la cual se rechaza esa versión parece pertenecer a otro panel, por favor soucione la inconsistencia en los datos'); 
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']='';
            }else{
                $Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['desde']=$Log['data']['comunicaciones'][$row['idanula']]['fecha'];
                if($Log['data']['comunicaciones'][$f['idanula']]['fecha']!=$f['zz_ultima_fecha_anulada_calculada']){
                    $actualizas.="zz_ultima_fecha_anulada_calculada = '".$Log['data']['comunicaciones'][$f['idanula']]['fecha']."', ";		
                }
            }
        }	
        
        $actualizas=substr($actualizas, 0,-2);
        if($actualizas!=''){					
            $query="					
                UPDATE
                    DOCversion
                SET		
                    $actualizas
                WHERE 
                    DOCversion.id = '".$f['id']."'
                
                AND
                    DOCversion.zz_AUTOPANEL = '$PanelI'
                AND 
                    zz_borrada !='1'
            ";
            $ConsultaB = $Conec1->query($query);
            if($Conec1->error!=''){
                $Log['tx'][]='error al consultar la base';
                $Log['tx'][]=$Conec1->error;
                $Log['tx'][]=$query;
                $Log['res']='error';
                terminar($Log);		
            }							
        }
        
        
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['idanula']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['idaprueba']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['iddocumento']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['idpresenta']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['idrechaza']);
        
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['zz_ultima_fecha_entrante_calculada']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['zz_ultima_fecha_aprobada_calculada']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['zz_ultima_fecha_rechazada_calculada']);
        unset($Log['data']['docs'][$row['iddocumento']]['versiones'][$row['id']]['zz_ultima_fecha_anulada_calculada']);
        
        $Log['data']['docs'][$row['iddocumento']]['ultimaversionid']=$f['id'];
        $Log['data']['docs'][$row['iddocumento']]['ultimaver']=$f['numversion'];
        $Log['data']['docs'][$row['iddocumento']]['ultimaverestado']=$Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['estado'];
        $Log['data']['docs'][$row['iddocumento']]['ultimaverfecha']=$Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['desde'];
        
        if(!isset($Log['data']['docs'][$row['iddocumento']]['ultimaversionid'])){
            $Log['data']['docs'][$row['iddocumento']]['ultimaversionid']='';
        }
		if(!isset($Log['data']['docs'][$row['iddocumento']]['ultimaver'])){
            $Log['data']['docs'][$row['iddocumento']]['ultimaver']='';
        }
		if(!isset($Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['estado'])){
			$Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['estado']='';
		}            
		if(!isset($Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['desde'])){
			$Log['data']['docs'][$row['iddocumento']]['versiones'][$f['id']]['desde']='';
		}		
	}
	

// consulta de archivos de versiones asociadas al panel activo
	$query="
		SELECT
            DOCarchivos.id,
            DOCarchivos.FI_documento, 
            DOCarchivos.id_p_DOCversion_id,
            DOCversion.id_p_DOCdocumento_id
		FROM
			DOCarchivos,
			DOCversion
		WHERE 
            DOCarchivos.id_p_DOCversion_id = DOCversion.id 
        AND
            DOCarchivos.zz_borrada='no'			
        AND
            DOCarchivos.zz_AUTOPANEL='".$PanelI."'
    ";
			
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base';
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
	
	while($row = $Consulta->fetch_assoc()){		
        if(!isset($Log['data']['docs'][$row['id_p_DOCdocumento_id']])){
            $Log['mg'][]=utf8_encode('El archivo id:'.$row['id'].' se encuentra vinculado a un documento ausente, id:'.$row['id_p_DOCversion_id']);
            continue;
        }
        if(!isset($Log['data']['docs'][$row['id_p_DOCdocumento_id']]['versiones'][$row['id_p_DOCversion_id']])){
            continue;
        }
        unset($f);
		foreach($row as $k => $v){
			$f[$k]=utf8_encode($v);
		}
		
		$Log['data']['docs'][$row['id_p_DOCdocumento_id']]['versiones'][$row['id_p_DOCversion_id']]['archivos'][$row['id']]=$f;
		
		if(!isset($Log['data']['docs'][$row['id_p_DOCdocumento_id']]['ultimaversionid'])){
            print_r($Log['data']['docs'][$row['id_p_DOCdocumento_id']]);
		}
		if(
            $row['id_p_DOCversion_id']==$Log['data']['docs'][$row['id_p_DOCdocumento_id']]['ultimaversionid']
        ){
            $Log['data']['docs'][$row['id_p_DOCdocumento_id']]['ultimaadjuntos'][$row['id']]=$f;
		}		
	}
	
	
	foreach($Log['data']['docs'] as $idplano => $dat){							
		if(!isset($Log['data']['docs'][$idplano]['zz_ultima_idversion_calculada'])){
		
            echo $idplano."_";
            print_r($Log['data']['docs'][$idplano]);
		}
		if(
			$Log['data']['docs'][$idplano]['zz_ultima_idversion_calculada']!=$Log['data']['docs'][$idplano]['ultimaversionid']
			||
			$Log['data']['docs'][$idplano]['zz_ultimo_nversion_calculada']!=$Log['data']['docs'][$idplano]['ultimaver']
			||
			$Log['data']['docs'][$idplano]['zz_ultimo_estadoversion_calculado']!=$Log['data']['docs'][$idplano]['ultimaverestado']
			||
			$Log['data']['docs'][$idplano]['zz_ultima_fecha_calculada']!=$Log['data']['docs'][$idplano]['ultimaverfecha']
		){
		
			$query="
			
				UPDATE
					DOCdocumento
				SET		
					zz_ultima_idversion_calculada = '".$Log['data']['docs'][$idplano]['ultimaversionid']."',
					zz_ultimo_nversion_calculada = '".$Log['data']['docs'][$idplano]['ultimaver']."',
					zz_ultimo_estadoversion_calculado = '".$Log['data']['docs'][$idplano]['ultimaverestado']."',
					zz_ultima_fecha_calculada = '".$Log['data']['docs'][$idplano]['ultimaverfecha']."'
				WHERE 
					DOCdocumento.id = '$idplano'
				AND
					DOCdocumento.zz_AUTOPANEL = '$PanelI'
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
		}
		unset($Log['data']['docs'][$idplano]['zz_ultima_idversion_calculada']);
		unset($Log['data']['docs'][$idplano]['zz_ultimo_nversion_calculada']);
		unset($Log['data']['docs'][$idplano]['zz_ultimo_estadoversion_calculado']);
		unset($Log['data']['docs'][$idplano]['zz_ultima_fecha_calculada']);		
	}	

	
	if($_POST['idcom']>0){
		foreach($Log['data']['docs'] as $iddoc => $dat){
			if(!isset($dat['selec'])){
				unset($Log['data']['docs'][$iddoc]);	
			}
		}
	}
unset($Log['data']['comunicaciones']);
$Log['res']='exito';
terminar($Log);			
	/*
	
	global $CANTversionesevaluadas;
	$CANTversionesevaluadas = 0;
	
	global $CANTdocumentos;
	$CANTdocumentos=0;
	
	global $CANTdocumentosA;
		
	global $CANTdocumentosaprobados;
	$CANTdocumentosaprobados=0;
	
	global $CANTdocumentosaprobadosA;
	
	global $CANTdocumentospresentados;
	$CANTdocumentospresentados=0;
	global $CANTdocumentospresentadosA;
		
	global $CANTdocumentosrechazado;
	$CANTdocumentosrechazado=0;
	global $CANTdocumentosrechazadoA;
		
	global $CANTdocumentosapresentar;
	$CANTdocumentosapresentar=0;
	global $CANTdocumentosapresentarA;
		
	global $CANTdocumentosevaluando;
	$CANTdocumentosevaluando=0;
	global $CANTdocumentosevaluandoA;

	global $CANTdocumentosanulados;
	$CANTdocumentosanulados=0;
	global $CANTdocumentosanuladosA;
	

		
	foreach($PreContenido as $clave => $elemento){
		//print_r($elemento);
		foreach($elemento['versiones'] as $nver => $ver){
			//print_r($nver);			
			//print_r($elemento);
			if($ver['estado']!='enevaluacion'&&$ver['estado']!='apresentar'){
				$CANTversionesevaluadas++;
			}
			
		}
		
		//contabiliza documentos para resumen.
		if($elemento['ultimaver']==''){
			$estadodoc='apresentar';	
		}else{
			if(!isset($elemento['versiones'][$elemento['ultimaver']]['estado'])){
				$elemento['versiones'][$elemento['ultimaver']]['estado']='apresentar';
			}
			$estadodoc=$elemento['versiones'][$elemento['ultimaver']]['estado'];
		}
		
		if($estadodoc=='anulada'){
			$CANTdocumentosanulados++;
			if(!isset($CANTdocumentosanuladosA['B'][$elemento['sector']])){$CANTdocumentosanuladosA['B'][$elemento['sector']]=0;}	
			$CANTdocumentosanuladosA['B'][$elemento['sector']]++;
		}else{
			$CANTdocumentos++;
			if(!isset($CANTdocumentosA['B'][$elemento['sector']])){$CANTdocumentosA['B'][$elemento['sector']]=0;}		
			$CANTdocumentosA['B'][$elemento['sector']]++;					
		}
		//echo $elemento['sector'];
//echo $estadodoc." - ";
		if($estadodoc=='programado'){
				$CANTdocumentosapresentar++;
				if(!isset($CANTdocumentosapresentarA['B'][$elemento['sector']])){$CANTdocumentosapresentarA['B'][$elemento['sector']]=0;}
				$CANTdocumentosapresentarA['B'][$elemento['sector']]++;
		}
		
		if(
			$estadodoc=='enevaluacion'||
			$estadodoc=='aprobada'||
			$estadodoc=='rechazada'
		){
			$CANTdocumentospresentados++;
			if(!isset($CANTdocumentospresentadosA['B'][$elemento['sector']])){$CANTdocumentospresentadosA['B'][$elemento['sector']]=0;}
			$CANTdocumentospresentadosA['B'][$elemento['sector']]++;
		}
		
		if(
			$estadodoc=='enevaluacion'
		){
			$CANTdocumentosevaluando++;
			if(!isset($CANTdocumentosevaluandoA['B'][$elemento['sector']])){$CANTdocumentosevaluandoA['B'][$elemento['sector']]=0;}
			$CANTdocumentosevaluandoA['B'][$elemento['sector']]++;
		}			
					
		If($estadodoc=='aprobada'){
			$CANTdocumentosaprobados++;
			if(!isset($CANTdocumentosaprobadosA['B'][$elemento['sector']])){$CANTdocumentosaprobadosA['B'][$elemento['sector']]=0;}
			$CANTdocumentosaprobadosA['B'][$elemento['sector']]++;
		}
		
		If($estadodoc=='rechazada'){
			$CANTdocumentosrechazado++;
			if(!isset($CANTdocumentosrechazadoA['B'][$elemento['sector']])){$CANTdocumentosrechazadoA['B'][$elemento['sector']]=0;}
			$CANTdocumentosrechazadoA['B'][$elemento['sector']]++;
		}
	}	
	
	
	$est['CANTdocumentos']=$CANTdocumentos;
	$est['CANTdocumentosaprobados']=$CANTdocumentosaprobados;
	
	if($CANTdocumentos*$CANTdocumentosaprobados>0){
		$CANTdocumentosaprobadosP=round(100/$CANTdocumentos*$CANTdocumentosaprobados);
	}else{
		$CANTdocumentosaprobadosP=0;	
	}
	$est['CANTdocumentosaprobadosP']=$CANTdocumentosaprobadosP;				
	$est['CANTversionesevaluadas']=$CANTversionesevaluadas;
	if($CANTdocumentosaprobados>0){
		$CANTversionesevaluadasP=number_format(($CANTversionesevaluadas/$CANTdocumentosaprobados),2);
	}else{
		$CANTversionesevaluadasP=0;
	}
	$est['CANTversionesevaluadasP']=$CANTversionesevaluadasP;
	$est['CANTdocumentospresentados']=$CANTdocumentospresentados;
	$est['CANTdocumentosapresentar']=$CANTdocumentosapresentar;
	$est['CANTdocumentosevaluando']=$CANTdocumentosevaluando;
	$est['CANTdocumentosrechazado']=$CANTdocumentosrechazado;
	$est['CANTdocumentosanulado']=$CANTdocumentosanulados;
	
	
	documentacionPANestadisticasCargar($est);		
	

	$contenido['categorias']=$Categorias;
	$contenido['grupos']=$Log['data']['grupos'];
	$contenido['documentos']=$PreContenido;
	$contenido['indice']=$Log['data']['indice'];
	$contenido['rendimiento']=$_SESSION['DEBUG']['mensajes'];
	return $contenido;
	

}

/**
* realiza una consulta de documentos presentados asociados a estados de visado preliminar específico
*
 * variables globales de entrada
* @global integer $PanelI id del panel activo y validado para su acceso
* @global resource $Conec1 conección abierta a la base de datos mysql 
* @global array $Config configuración del panel, resultado de la búsqueda en la base.
* @global date $_POST['Freportehasta'] define fecha de consulta elimina todo registro postrior a la fecha de consulta, simula una consulta realizada en el pasado.  
* @global array $FILTRO valores válidos por estado, estando definido solo muestra documentaciones con estado de igual nombre.
* @global date $FILTROFECHAD filtra la búsqueda de documentos mostrando solo aquellos presentados porteriores a la fecha dada.
* @global date $FILTROFECHAH filtra la búsqueda de documentos mostrando solo aquellos presentados anteriores a la fecha dada (esto es distinto de $Freportehata).
 * variables globales de salida (devuelven vaaores sumarizados)
* @global integer $CANTdocumentos cantidad totale de documentos programados para el proyecto
* @global integer $CANTdocumentosaprobados cantidad de documentos aprobados en su última versión programada
* @global integer $CANTdocumentospresentados cantidad de documentos presntados en su última versión programada
* @global integer $CANTdocumentosrechazado cantidad de documentos rechazados en su última versión programada
* @global integer $CANTdocumentosapresentar cantidad de documentos a presentar en última versión programada
* @global integer $CANTdocumentosevaluando cantidad de documentos en evaluación en su última versión programada
 * 
* @return array Retorna listado de documentos con sublistados de versiones (con el key de su numeracion) y un sublistado de características del documento general (bajo el key 00)
*/
function documentoconsultavisado($MODOREPORTEIDVISADOS, $VERSIONES){
	global $PanelI, $Conec1, $Config;
	
	// carga consulta en la variable array: $Contenido 	
	$Contenido =  documentoconsulta();
	//echo "<pre>";print_r($Contenido);echo "</pre>";
	if($VERSIONES=='TodasLasVersiones'){
		echo "se muestran todas las versiones ";
	}else{
		echo "Solo se muestra el visado de última versión registrada para cada documento.";
	}
	
	Foreach($Contenido as $idplano => $Arrplano){
	
		$Fila[$idplano]['grupoa']= $Arrplano['grupoa'];
		$Fila[$idplano]['grupob']= $Arrplano['grupob'];		
		/*
		$Fila[$idplano]['sector']= $Arrplano['sector'];
		$Fila[$idplano]['planta']= $Arrplano['planta'];	
		$Fila[$idplano]['numero']= $Arrplano['numero'];	
		$Fila[$idplano]['nombre']= $Arrplano['nombre'];
		$Fila[$idplano]['escala']= $Arrplano['escala'];
		$Fila[$idplano]['rubro']= $Arrplano['rubro'];
		$Fila[$idplano]['tipologia']= $Arrplano['tipologia'];
		*/
		$Fila[$idplano]['estado']= $Arrplano['estado'];
		$Fila[$idplano]['desde']= $Arrplano['desde'];
		
		$FilaV[$idplano]=$Fila[$idplano];
		
		foreach ($Arrplano as $nver => $ver ){
			unset($visado);
			$estado='';
			If(isset($ver['anula']['fecha'])){$estado='anuladamuestra';}		
			If(!isset($ver['presenta']['fecha']) && !isset($ver['aprueba']['fecha']) && !isset($ver['anula']['fecha']) && !isset($ver['rechaza']['fecha'])){$cargadocsid='';}
			if($estado!='anuladamuestra'){$version = $ver["numversion"];}
			
			foreach($MODOREPORTEIDVISADOS as $idvisadoRep){
				
				foreach($ver['visados'] as $idvisado => $dato){
					
					
					if($idvisado == $idvisadoRep){
						
						$visado[$idvisado]['enviado']= $dato['evaluandodesde'];
						if($dato['evaluandodesde']=='0000-00-00'){
							$visado[$idvisado]['enviado']= '';	
						}

						if($dato['resultado']!==null){
							$visado[$idvisado]['enviado']= 'falta dato';	
						}						
						
						if($visado[$idvisado]['enviado']>'0000-00-00'||$dato['resultado']!==null){
							
							if(($dato['fecharespuesta']!='0000-00-00'&&$dato['fecharespuesta']!='')||$dato['resultado']!==null){
								$visado[$idvisado]['respuesta']='si';
							}else{
								$visado[$idvisado]['respuesta']='no';
							}
							
							if($dato['resultado']=='0'){
								$visado[$idvisado]['resultado']='a revisar';
							}elseif($dato['resultado']=='-1'){
								$visado[$idvisado]['resultado']='evaluando';
							}elseif($dato['resultado']=='1'){
								$visado[$idvisado]['resultado']='aprobado';
							}
							
						}else{
							$visado[$idvisado]['respuesta']='-';
							$visado[$idvisado]['resultado']='-';
						}												
						$visado[$idvisado]['observaciones']=$dato['observaciones'];	
						$visado[$idvisado]['version']=$version;
						//echo $visado[$idvisado]['respuesta'];
						
						//echo "<br>[$idplano][$nver][$idvisado]:".$visado[$idvisado]['respuesta']."__";
						if($VERSIONES=='TodasLasVersiones'){
							$FilaV[$idplano]['visados'][$nver]=$visado;
							
							/*$FilaV[$idplano][$nver][$idvisado]['enviado']=$visado['enviado'];
							$FilaV[$idplano][$nver][$idvisado]['respuesta']=$visado['respuesta'];
							$FilaV[$idplano][$nver][$idvisado]['resultado']=$visado['resultado'];
							$FilaV[$idplano][$nver][$idvisado]['observaciones']=$visado['observaciones'];*/
							if($visado[$idvisado]['enviado']!=''||$visado[$idvisado]['respuesta']!='-'){
								$FilaV[$idplano]['visados'][$nver]['visamiento']='si';//indica que este documento entro en circuito de visado para alguno de los visador requeridos
							}							
						}						
					}
				}
			}

			$Fila[$idplano]['version']=$version;
			
			$FilaV[$idplano]['version']=$version;
						
			$vers[$idplano]['version']=$version;
		}

		$Fila[$idplano]['version']=$version;

		foreach($MODOREPORTEIDVISADOS as $idvisado){
			//print_r($VisadoVer);

			$Fila[$idplano]['visados'][0][$idvisado]['enviado']= $visado[$idvisado]['enviado'];
			$Fila[$idplano]['visados'][0][$idvisado]['respuesta']= $visado[$idvisado]['respuesta'];
			$Fila[$idplano]['visados'][0][$idvisado]['resultado']= $visado[$idvisado]['resultado'];
			$Fila[$idplano]['visados'][0][$idvisado]['observaciones']= $visado[$idvisado]['observaciones'];
			if($visado[$idvisado]['enviado']!=''){
				$Fila[$idplano]['visados'][0]['visamiento']='si';//indica que este documento entro en circuito de visado para alguno de los visador requeridos
			}
		}
	}


//echo "<pre>";print_r($FilaV);echo"</pre>";
	if($VERSIONES=='TodasLasVersiones'){
		return $FilaV;	
	}else{
		return $Fila;
	}
}

/**
* realiza una búsqueda de todas comunicaciones en la base de datos para el panel activo y debuelve una array desordenado
* @global string $Base base de datos mysql de trabajo
* @global array $Config configuracion del panel activo
* @global int $PanelI id del panel activo
* @return array organizado y ordenado con el resultado de la búsqueda conteniendo los datos básicos de la comunicación, y arrays con estados y respuestas
* @global array $ACUM VALORES ACUMULADOS PARA GRAFICOS ESTADÍSITCOS
*/
function documentacionPANestadisticasCargar($est){
	global $PanelI, $Config, $Base; //entorno 

	
	$micro_date = microtime(true);
	$date_array = explode(" ",$micro_date);
	$Millidate = /*$date_array[1]*1000+*/round($date_array[0]*1000);	


	if(isset($_SESSION['panelcontrol'] -> McTi_Rdoc)){
		$smc=$_SESSION['panelcontrol'] -> McTi_Rdoc;
		unset($_SESSION['panelcontrol'] -> McTi_Rdoc);
		if($smc>1453750000){
			$mc=microtime(true)-$smc;//echo "<p>mT consulta: $mc</p>";
		}else{
		//	echo "error: $smc";
		}
		
		if($mc>(60*60*1000000)){unset($mc);}
	}else{
		$mc='';
	}
	$query = "
	
	INSERT INTO `paneles`.`PANestadisticasDOC`

	SET
		
		`zz_AUTOPANEL`='".$PanelI."',
		`fechahora`='".$Millidate."',
		`ano`='".date("Y")."',	
		`mes`='".date("m")."',	
		`totDocs`='".$est['CANTdocumentos']."',
		`totAprob`='".$est['CANTdocumentosaprobados']."',
		`totAprobP`='".$est['CANTdocumentosaprobadosP']."',
		`totVerEval`='".$est['CANTversionesevaluadas']."',
		`totVerEvalP`='".$est['CANTversionesevaluadasP']."',
		`totPres`='".$est['CANTdocumentospresentados']."',
		`statPend`='".$est['CANTdocumentosapresentar']."',			
		`statEval`='".$est['CANTdocumentosevaluando']."',		
		`statRev`='".$est['CANTdocumentosrechazado']."',
		`statAnulado`='".$est['CANTdocumentosanulado']."',
		zz_microtiempo='".$mc."',
		zz_server='".$_SERVER['HTTP_HOST']."'
		
	";
	//echo $query;
	mysql_query($query,$_SESSION['panelcontrol']->Conec1);
	echo mysql_error($_SESSION['panelcontrol']->Conec1);
}



?>
