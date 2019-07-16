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
chdir(getcwd().'/../'); 
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.

ini_set('display_errors', '1');

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

if(!isset($_POST['origen'])){
	$Log['tx'][]='no fue definido el id de origen';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['destino'])){
	$Log['tx'][]='no fue definido el criterio de interpretacion del titulo';
	$Log['res']='err';
	terminar($Log);
}

if(!isset($_POST['accion'])){
	$Log['tx'][]='no fue enviada variable accion';
	$Log['res']='err';
	terminar($Log);
}

if($_POST['accion']!='vincular'&&$_POST['accion']!='desvincular'){
    $Log['tx'][]='accion no reconocida';
	$Log['res']='err';
	terminar($Log);
}


$query="
    SELECT 
       *
    FROM
        `paneles`.`comunicaciones`
    WHERE
        `zz_AUTOPANEL`='".$PanelI."'
    AND
    (
            id='".$_POST['origen']."'
        OR
            id='".$_POST['destino']."'
    )
";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]='error al consultar configuracióna editar';
	$Log['tx'][]=utf8_encode($query);
	$Log['tx'][]=utf8_encode($Conec1->error);
	$Log['res']='err';
	terminar($Log);
}
if($Consulta->num_rows<1){
    $Log['tx'][]='no las comunicaciones a vincular no pertenecereía al panel atual'.
    $Log['res']='err';
    terminar($Log);
}


if($_POST['accion']=='vincular'){

    $query="
        SELECT 
            *
        FROM
            `paneles`.`COMlinkrespuesta`
        WHERE
            id_p_comunicaciones_id_nombre_origen = '".$_POST['origen']."'
        AND
            id_p_comunicaciones_id_nombre_respuesta = '".$_POST['destino']."'
        AND
            `zz_AUTOPANEL`='".$PanelI."'       
    ";
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar configuracióna editar';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }    
    if($Consulta->num_rows>0){
        $Log['tx'][]='esta vinculacion ya existía'.
        $Log['res']='exito';
        terminar($Log);
    }

    $query="
    
        INSERT INTO

            `paneles`.`COMlinkrespuesta`

        SET 
            id_p_comunicaciones_id_nombre_origen = '".$_POST['origen']."',
            id_p_comunicaciones_id_nombre_respuesta = '".$_POST['destino']."',
            `zz_AUTOPANEL`='".$PanelI."'       
    ";
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar configuracióna editar';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
    
    $Log['data']['acion']=$_POST['accion'];
    $Log['data']['origen']=$_POST['origen'];
    $Log['data']['destino']=$_POST['destino'];
    $Log['data']['nid']=$Conec1->insert_id;
    $Log['res']='exito';
    terminar($Log);
    
}elseif($_POST['accion']=='desvincular'){


    $query="
            SELECT 
                *
            FROM
                `paneles`.`COMlinkrespuesta`
            WHERE
                id_p_comunicaciones_id_nombre_origen = '".$_POST['origen']."'
            AND
                id_p_comunicaciones_id_nombre_respuesta = '".$_POST['destino']."'
            AND
                `zz_AUTOPANEL`='".$PanelI."'       
    ";
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar configuracióna editar';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
    if($Consulta->num_rows<1){
        $Log['tx'][]=utf8_encode('no se encontró el vínculo a elimnar. o:'.$_POST['origen'].' d:'.$_POST['destino'] );
        $Log['mg'][]=utf8_encode('no se encontró el vínculo a elimnar');
        $Log['res']='err';
        terminar($Log);
    }
    $query="
        DELETE
        FROM
            `paneles`.`COMlinkrespuesta`
        WHERE
            id_p_comunicaciones_id_nombre_origen = '".$_POST['origen']."'
        AND
            id_p_comunicaciones_id_nombre_respuesta = '".$_POST['destino']."'
        AND
            `zz_AUTOPANEL`='".$PanelI."'       
    ";
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar configuracióna editar';
        $Log['tx'][]=utf8_encode($query);
        $Log['tx'][]=utf8_encode($Conec1->error);
        $Log['res']='err';
        terminar($Log);
    }
    $Log['data']['acion']=$_POST['accion'];
    $Log['data']['origen']=$_POST['origen'];
    $Log['data']['destino']=$_POST['destino'];
    $Log['res']='exito';
    terminar($Log);
}else{
    $Log['tx'][]='error al comprender la acción solicitada';
    $Log['res']='err';
    terminar($Log);
}
 
?>
