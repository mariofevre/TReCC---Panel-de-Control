<?php 
/**
* COM_consulta_listado.php
*
* devuelve un array con las omunicaciones de un panel, deacuerdo a un filtro y orden definidos
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

// consultado por:
// COM_consulta_listadito
// CER_consulta_certificaciones.php

ini_set('display_errors', true);

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

	
	$query="
		SELECT `grupos`.`id`,
		    `grupos`.`nombre`,
		    `grupos`.`codigo`			  
		FROM `paneles`.`grupos`
		WHERE 
			zz_AUTOPANEL ='$PanelI'
	";
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='err';
        terminar($Log); 
    }
	$dg['nombre']='General';
	$dg['codigo']='grl';
	$dg['descripcion']=utf8_encode('Sin asignación a ningún grupo específico de este proyecto');
	unset($Grupos);
	$Grupos['0']=$dg;
	while($row = $Consulta->fetch_assoc()){
        foreach($row as $k => $v){
            $Grupos[$row['id']][$k]=utf8_encode($v);
		}
	}

	$wheresel='';
	if(isset($_POST['id'])){
	    if($_POST['id']>0){
	        $wheresel= " AND id = '".$_POST['id']."'";
	    }
	}

	$wehreborr=" ";
	if(!isset($_POST['borr'])){
		$wehreborr=" AND comunicaciones.zz_borrada='0' ";
	}
	
	if(!isset($_POST['orden'])){$_POST['orden']='cast(id1 as unsigned)';}
	if($_POST['orden']=='ident'){$_POST['orden']='cast(id1 as unsigned)';}
	
	if(!isset($_POST['ordensentido'])){$_POST['ordensentido']='DESC';}
	if($_POST['ordensentido']==''){$_POST['ordensentido']='DESC';}

	
// consulta todas las comunicaciones previos a la fecha límite de reporte ($Freportehasta)
	$query="
		SELECT 
			comunicaciones.id as id,
			comunicaciones.sentido as sentido,
			comunicaciones.cerrado as cerrado,
			comunicaciones.cerradodesde as cerradodesde,
			comunicaciones.nombre as nombre,
			comunicaciones.id_p_grupos_id_nombre_tipoa as idga,			
			comunicaciones.id_p_grupos_id_nombre_tipob as idgb,					
			comunicaciones.zz_borrada as zz_borrada,
			
			comunicaciones.ident as id1,
			
			comunicaciones.identdos as id2,
			comunicaciones.identtres as id3,
			comunicaciones.preliminar as pre,
			comunicaciones.relevante,
			comunicaciones.`zz_reg_fecha_emision`,
            `comunicaciones`.`zz_reg_adjuntos_cant`,
            `comunicaciones`.`zz_reg_adjuntos_nombre`
			
		FROM 
			comunicaciones 	
		
		WHERE 
			`comunicaciones`.zz_preliminar = '0'
			AND
			comunicaciones.zz_AUTOPANEL = '$PanelI'
			$wheresel
			$wehreborr				
			
		ORDER BY 
			".$_POST['orden']." ".$_POST['ordensentido'].", `zz_reg_fecha_emision` DESC, id1 DESC

	";
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='err';
        terminar($Log); 
    }
	//$Log['tx'][]=$query;
	
	$r['tx'][]=$Consulta->num_rows.' comunicaciones cargadas al listadito.';
	
	$Log['data']['comunicaciones']=array();	
	$Log['data']['comunicacionesOrden']=array();		
		
	
	while($row = $Consulta->fetch_assoc()){
			
   		$Log['data']['comunicacionesOrden'][]=$row['id'];
    	if($row['idga']==''){$row['idga']=0;}
    	if($row['idgb']==''){$row['idgb']=0;}
    	
        foreach($row as $k => $v){
            $Log['data']['comunicaciones'][$row['id']][$k]=utf8_encode($v);
		}
        
        if($row['zz_reg_adjuntos_cant']=='-1'){
            $_POST['idcom']=$row['id'];
            $Log['tx'][]='actualizanro zz_rreg_adjuntos de comunicacion id:'.$row['id'];
		    include('./COM/COM_proc_zzreg_adjuntos.php');
		    unset($_POST['idcom']);
        }
        
		if($row['cerrado']=='si'){
            $e='cerrada';
		}else{
            $e='abierto';
        }
		$Log['data']['comunicaciones'][$row['id']]['estado']=$e;			
				

		$gna='';
		$gca='';
		if(isset($Grupos[$row['idga']])){
			/* ya viene encodeado
			$gna=utf8_encode($Grupos[$row['idga']]['nombre']);
			$gca=utf8_encode($Grupos[$row['idga']]['codigo']);
			*/
			$gna=$Grupos[$row['idga']]['nombre'];
			$gca=$Grupos[$row['idga']]['codigo'];
		}				
		//$Log['data']['comunicaciones'][$row['id']]['grupoa']=$gna;
		//$Log['data']['comunicaciones'][$row['id']]['grupoacod']=$gca;
		
		$gnb='';
		$gcb='';
		if(isset($Grupos[$row['idgb']])){
			/* ya viene encodeado
			$gnb=utf8_encode($Grupos[$row['idgb']]['nombre']);
			$gcb=utf8_encode($Grupos[$row['idgb']]['codigo']);
			*/
			$gnb=$Grupos[$row['idgb']]['nombre'];
			$gcb=$Grupos[$row['idgb']]['codigo'];
		}
		
		//$Log['data']['comunicaciones'][$row['id']]['grupob']=$gnb;
		//$Log['data']['comunicaciones'][$row['id']]['grupobcod']=$gcb;
		
		// obtiene de la configuración los prefijos para cada comunicacion 
		if($row['pre']=='extraoficial'){$o='x';}else{$o='';}
		
		// incorpora al array un nombre que incluye el prefijo generado	
		$PREN['entrante']=$Config['com-entra-preN'.$o];
		$PREN['saliente']=$Config['com-sale-preN'.$o];

		
		
		if($row['sentido']==''){
            $falsonombre = 'registro incompleto';
		}else{
            $falsonombre=$PREN[$row['sentido']].utf8_encode($row['id1']);	
        }
		$Log['data']['comunicaciones'][$row['id']]['falsonombre']=$falsonombre;			
		$resumen=$gca."-".$gcb."-".$falsonombre;
		$Log['data']['comunicaciones'][$row['id']]['etiqueta']=$resumen;
		
		unset($Log['data']['comunicaciones'][$row['id']]['cerrado']);
		unset($Log['data']['comunicaciones'][$row['id']]['cerradodesde']);		
		unset($Log['data']['comunicaciones'][$row['id']]['zz_borrada']);
		}
	
	foreach($Log['data']['comunicaciones'] as $reg){
		$Log['data']['ordenGAB'][$reg['idga']][$reg['idgb']][]=$reg['id'];
		$Log['data']['ordenGBA'][$reg['idgb']][$reg['idga']][]=$reg['id'];
		$Log['data']['ordenGA'][$reg['idga']][]=$reg['id'];
		$Log['data']['ordenGB'][$reg['idgb']][]=$reg['id'];		
	}

?>
