<?php 
/**
* EVA_consulta.php
*
* realiza consultas a la base de datos remitiendo la estructura de EVALUACIONES Y CERTIFICACIONES POR PARTICIPANTE.
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
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
$PanelI = $_SESSION['panelcontrol']->PANELI;
include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.


$Log=array();
global $Log;
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


include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

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
}elseif($nivelespermitidos[$UsuarioAcc]!='si'){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 	
}

//include ('./PAN/PAN_consultainterna_config.php');//define variable $Config
//$Hoy = date("Y-m-d");
//include('./HIT/HIT_consultainterna_hitos_fechasbase.php');

$Hoy = date("Y-m-d");

$Pseudohoy= $Hoy;
if(isset($_POST['FechaHasta'])){
	if($_POST['FechaHasta']!='0000-00-00'&&$_POST['FechaHasta']!=''){
		$Pseudohoy=$_POST['FechaHasta'];
	}
}



$query="
	SELECT 
		*
	FROM 
		EVAperiodos
    WHERE 
    	zz_borrada='0'
    AND
		zz_preliminar='0'
    AND
    	zz_AUTOPANEL = '$PanelI'
    ORDER BY 
    	ano
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}


if($Consulta->num_rows==0){
	
	$query="
		INSERT INTO EVAperiodos
		(zz_AUTOPANEL, nombre, ano, zz_borrada)
		VALUES ('$PanelI', '".date("Y")."', '".date("Y")."', 0)
	";

	$ConsultaI = $Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar la base';
		$Log['tx'][]=$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='error';
		terminar($Log);		
	}
	
	$query="
		SELECT 			
			*
		FROM 
			EVAperiodos
		WHERE 
			zz_borrada='0'
		AND
			zz_AUTOPANEL = '$PanelI'
		ORDER BY 
			ano
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


$Log['data']['periodos']=array();
$Log['data']['periodosOrden']=array();

while($row = $Consulta->fetch_assoc()){	
	$Log['data']['periodosOrden'][]=$row['id'];
	
    foreach($row as $k => $v){
       $Log['data']['periodos'][$row['id']][$k]=utf8_encode($v);
    }		
}





$query="
	SELECT 
		id, nombre, apellido, zz_AUTOPANEL, numero, observaciones
	FROM 
		EVAparticipantes
    WHERE 
    	zz_borrada='0'
    AND
		zz_preliminar='0'
    AND
    	zz_AUTOPANEL = '$PanelI'
    ORDER BY 
    	apellido ASC,
    	nombre ASC
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}

$Log['data']['participantes']=array();
$Log['data']['participantesOrden']=array();

while($row = $Consulta->fetch_assoc()){	
	$Log['data']['participantesOrden'][]=$row['id'];
	
    foreach($row as $k => $v){
       $Log['data']['participantes'][$row['id']][$k]=utf8_encode($v);
    }		
}



$query="
	SELECT 
		id, orden, nombre, avance_acc, descripcion, zz_AUTOPANEL, usa_num_1, tit_num_1, usa_text_1, tit_text_1, usa_date_1, tit_date_1
	FROM 
		EVA_pasos
    WHERE 
    	
    	zz_AUTOPANEL = '$PanelI'
    ORDER BY 
    	orden
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}

$Log['data']['pasos']=array();
$Log['data']['pasosOrden']=array();

while($row = $Consulta->fetch_assoc()){	
	$Log['data']['pasosOrden'][]=$row['id'];	
    foreach($row as $k => $v){
       $Log['data']['pasos'][$row['id']][$k]=utf8_encode($v);
    }		
}




$query="
    SELECT 
		EVAinstanciaModelo.id, EVAinstanciaModelo.nombre, EVAinstanciaModelo.descripcion, 
		EVAinstanciaModelo.id_p_EVAperiodos, 
		EVAinstanciaModelo.defecto_min_ano, 
		EVAinstanciaModelo.defecto_max_ano, 
		EVAinstanciaModelo.requerido_def, EVAinstanciaModelo.codigo,
		EVAinstanciaModelo.*,
		EVAperiodos.ano
	FROM 
		paneles.EVAinstanciaModelo
	
	LEFT JOIN
		paneles.EVAperiodos 
			ON 
				EVAperiodos.id = EVAinstanciaModelo.id_p_EVAperiodos 
				AND EVAperiodos.zz_borrada='0'
				AND EVAperiodos.`zz_AUTOPANEL` = '$PanelI'
		
    WHERE 
    	EVAinstanciaModelo.zz_borrada='0'
    AND
		EVAinstanciaModelo.zz_preliminar='0'
    AND
    	EVAinstanciaModelo.`zz_AUTOPANEL` = '$PanelI'
    ORDER BY 
    	EVAperiodos.ano,
    	EVAinstanciaModelo.codigo
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}


$Log['data']['instanciasModelo']=array();
$Log['data']['instanciasModeloOrden']=array();

while($row = $Consulta->fetch_assoc()){	
	$Log['data']['instanciasModeloOrden'][]=$row['id'];
	
    foreach($row as $k => $v){
       $Log['data']['instanciasModelo'][$row['id']][$k]=utf8_encode($v);
    }		
}



$query="
	SELECT 
		id, id_p_EVAinstanciaModelo, id_p_EVAparticipante, observaciones, cumplido, id_p_EVAperiodo,
		est_alerta 
		
		
	FROM 
		EVAinstancias
    WHERE 
    	EVAinstancias.zz_borrada='0'
    AND
    	EVAinstancias.zz_preliminar='0'
    AND
    	EVAinstancias.`zz_AUTOPANEL` = '$PanelI'

    ";
$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error al consultar la base';
    $Log['tx'][]=$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='error';
    terminar($Log);		
}

$Log['data']['instancias']=array();
$Log['data']['instanciasOrden']=array();

while($row = $Consulta->fetch_assoc()){	
	$Log['data']['instanciasOrden'][]=$row['id'];
	
    foreach($row as $k => $v){
       $Log['data']['instancias'][$row['id']][$k]=utf8_encode($v);
    }	
    $Log['data']['instancias'][$row['id']]['adjuntos']=array();	
    $Log['data']['instancias'][$row['id']]['adjuntosOrden']=array();	
    
    $Log['data']['instancias'][$row['id']]['pasos']=array();	
}    


$query="
	SELECT 
		id, id_p_EVAinstancias, id_p_EVA_pasos, num_1, text_1, date_1, hecho
	FROM 
		EVA_pasos_estados
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

while($row = $Consulta->fetch_assoc()){	
	if(!isset($Log['data']['instancias'][$row['id_p_EVAinstancias']])){continue;}
	if(!isset($Log['data']['pasos'][$row['id_p_EVA_pasos']])){continue;}
	
    foreach($row as $k => $v){
       $Log['data']['instancias'][$row['id_p_EVAinstancias']]['pasos'][$row['id_p_EVA_pasos']][$k]=utf8_encode($v);
    }		
}



$query="

SELECT 
		EVAinstanciasAdjuntos.id, 
		EVAinstanciasAdjuntos.id_p_EVAinstancias, 
		EVAinstanciasAdjuntos.descripcion, 
		EVAinstanciasAdjuntos.FI_documento, 
		EVAinstanciasAdjuntos.FI_nombreorig,
		EVAinstanciasAdjuntos.tipo, 
		EVAinstanciasAdjuntos.FI_tipo, 
		EVAinstanciasAdjuntos.FI_extension
	FROM EVAinstanciasAdjuntos
	
	LEFT JOIN
		EVAinstancias
			ON EVAinstancias.id = EVAinstanciasAdjuntos.id_p_EVAinstancias
			AND EVAinstancias.zz_preliminar='0'
			AND EVAinstancias.zz_borrada='0'
	WHERE
    	EVAinstanciasAdjuntos.zz_borrada='0'
    AND
    	EVAinstanciasAdjuntos.`zz_AUTOPANEL` = '$PanelI'

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
	if(!isset($Log['data']['instancias'][$row['id_p_EVAinstancias']])){continue;}
		
	$Log['data']['instancias'][$row['id_p_EVAinstancias']]['adjuntosOrden'][]=$row['id'];
	
    foreach($row as $k => $v){
		$Log['data']['instancias'][$row['id_p_EVAinstancias']]['adjuntos'][$row['id']][$k]=utf8_encode($v);
    }		
}    



$Log['res']='exito';
terminar($Log);
?>
