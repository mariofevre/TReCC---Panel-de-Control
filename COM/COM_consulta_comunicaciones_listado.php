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

ini_set('display_errors', true);
chdir('..'); 

include ('./includes/header.php');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['acc']=array();
$Log['loc']='';
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
    exit();
}
$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['acc'][]='loc';
    $Log['loc'][]='./login.php';
    $Log['res']='err';
    terminar($Log); 
}

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

$Hoy = date("Y-m-d");					


$variables=array('DESDE','HASTA');
foreach($variables as $v){
    if(!isset($_POST[$v])){
        $Log['tx'][]=utf8_encode('error en la recepción de variables necesarias. falta variable '.$v);
        $Log['tx'][]=$_POST;
        $Log['res']='error';
        terminar($Log);    
    }
	
}

foreach($_POST as $k => $v){
	$_POST[$k]=utf8_decode($v);
}


	
$nomid1=$Config['com-ident'];
$nomid2=$Config['com-identdos'];
	
include('./COM/COM_consultainterna_listadito.php');
// define $Grupos
// define $Log['data']['comunicacionesOrden']
// define $Log['data']['comunicaciones']
// define $Log['data']['ordenGAB']
// define $Log['data']['ordenGBA']
// define $Log['data']['ordenGA']
// define $Log['data']['ordenGB']


$documentosasociados = consultaversionesdereferencia();


	$query="
		SELECT 
			comunicaciones.id as id,
			comunicaciones.sentido as sentido,
			comunicaciones.cerrado as cerrado,
			comunicaciones.cerradodesde as cerradodesde,
			comunicaciones.nombre as nombre,
			comunicaciones.id_p_grupos_id_nombre_tipoa as idga,			
			comunicaciones.id_p_grupos_id_nombre_tipob as idgb,
			comunicaciones.fechaobjetivo,
			comunicaciones.ident as id1,
			comunicaciones.identdos as id2,
			comunicaciones.identtres as id3,
			comunicaciones.relevante,
			comunicaciones.`zz_reg_fecha_emision`,
            `comunicaciones`.`zz_reg_adjuntos_cant`,
            `comunicaciones`.`zz_reg_adjuntos_nombre`,
            comunicaciones.requerimiento
			
		FROM 
			comunicaciones 	
		
		WHERE 
			comunicaciones.zz_AUTOPANEL = '$PanelI'
			AND
			comunicaciones.`zz_preliminar`='0'

	";
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error en consulta grupos: '.$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='err';
        terminar($Log); 
    }


	while($row = $Consulta->fetch_assoc()){
		if(!isset($Log['data']['comunicaciones'][$row['id']])){continue;}
		$Log['data']['comunicaciones'][$row['id']]['cerrado']=utf8_encode($row['cerrado']);	
		$Log['data']['comunicaciones'][$row['id']]['cerradodesde']=utf8_encode($row['cerradodesde']);
		$Log['data']['comunicaciones'][$row['id']]['fechaobjetivo']=utf8_encode($row['fechaobjetivo']);
		$Log['data']['comunicaciones'][$row['id']]['zz_reg_adjuntos_cant']=utf8_encode($row['zz_reg_adjuntos_cant']);
		$Log['data']['comunicaciones'][$row['id']]['zz_reg_adjuntos_nombre']=utf8_encode($row['zz_reg_adjuntos_nombre']);
		//$Log['data']['comunicaciones'][$row['id']]['zz_borrada']=utf8_encode($row['zz_borrada']);		
		$Log['data']['comunicaciones'][$row['id']]['requerimiento']=utf8_encode($row['requerimiento']);
	}

foreach($Log['data']['comunicaciones'] as $comid => $comdata){
	
    $Log['data']['comunicaciones'][$comid]['respuestas']=array();
    $Log['data']['comunicaciones'][$comid]['origenes']=array();
    $Log['data']['comunicaciones'][$comid]['adjuntos']=array();
	$Log['data']['comunicaciones'][$comid]['documentosasociados']['presentados']=array();
	if(isset($documentosasociados[$comid])){
        $Log['data']['comunicaciones'][$comid]['documentosasociados']['presentados']=$documentosasociados[$comid]['presentados'];
    }	
}


$query="		
    SELECT 
        COMdocumentos.id, 
        COMdocumentos.descripcion, 
        COMdocumentos.FI_documento, 
        COMdocumentos.FI_nombreorig, 
        COMdocumentos.zz_borrada,  
        COMdocumentos.tipo,
        COMdocumentos.id_p_comunicaciones_id as idcom
    FROM 
        COMdocumentos
    WHERE
        COMdocumentos.zz_AUTOPANEL = '$PanelI'
        AND 
        COMdocumentos.zz_borrada='no'
";

$Consulta = $Conec1->query($query);
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta de documentos en el panel: '.$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}
while($row = $Consulta->fetch_assoc()){
    if($row['id']!=''&&isset($Log['data']['comunicaciones'][$row['idcom']])){	
        
        foreach($row as $k => $v){
            $r[$k]=utf8_encode($v);
        }
        $r['FI_nombreorig']=utf8_encode($row['FI_nombreorig']);
        $r['descripcion']=utf8_encode($row['descripcion']);
        $Log['data']['comunicaciones'][$row['idcom']]['adjuntos'][]=$r;
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
";
$Consulta = $Conec1->query($query);		
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta de estados posibles: '.$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}
while($row = $Consulta->fetch_assoc()){
    foreach($row as $k => $v){
            $Listadeestados[$row['id']][$k]=utf8_encode($v);
    }
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
    ORDER BY orden, desde 
";
$Consulta = $Conec1->query($query);			
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta de estados: '.$Conec1->error;
    $Log['tx'][]=$query;
    $Log['res']='err';
    terminar($Log); 
}
while($row = $Consulta->fetch_assoc()){

    if(isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']])){
        if(!isset($Listadeestados[$row['id_p_comunestadoslista']]['sentido'])){continue;}
        if($Listadeestados[$row['id_p_comunestadoslista']]['sentido']==$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['sentido']){
            //$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['estados'][]=array_merge($row,$Listadeestados[$row['id_p_comunestadoslista']]);
                
            if(!isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['emision'])){					
                $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['emision']=$row['desde'];					
            }
            
            if($Listadeestados[$row['id_p_comunestadoslista']]['requeridodefecto']=='1'){
                $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['recepcion']=$row['desde'];
                $r='requerido';
            }else{
                $r='norequerido';
            }
            /*
            $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['estados'][$row['id']]['nombre']=utf8_encode($Listadeestados[$row['id_p_comunestadoslista']]['estadio']);
            $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['estados'][$row['id']]['desde']=$row['desde'];
            $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre']]['estados'][$row['id']]['requerido']=$r;*/
        }
    }		
}	

$query="
    SELECT 
        `COMlinkrespuesta`.`id`,
        `COMlinkrespuesta`.`id_p_comunicaciones_id_nombre_origen`,
        `COMlinkrespuesta`.`id_p_comunicaciones_id_nombre_respuesta`,
        `COMlinkrespuesta`.`zz_AUTOPANEL`
        FROM 
        	$Base.`COMlinkrespuesta`
        WHERE 
        	zz_AUTOPANEL='$PanelI'
";
$Consulta = $Conec1->query($query);		
if($Conec1->error!=''){
    $Log['tx'][]='error en consulta de respuestas: '.$Conec1->error;
    $Log['tx'][]=$query;
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
        if(
            isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_respuesta']])
            &&
            isset($Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_origen']])
        ){
                        
            //inserta el vínculo a su objeto de origen  
            $res=$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_respuesta']];				
            
            //$rta['id1']=utf8_encode($res['id1']);
			$rta['id1']=$res['id1'];
			
            //$rta['id2']=utf8_encode($res['id2']);
			$rta['id2']=$res['id2'];
			
            //$rta['id3']=utf8_encode($res['id3']);
			$rta['id3']=$res['id3'];
			
			
            //$rta['nombre']=utf8_encode($res['nombre']);
			$rta['nombre']=$res['nombre'];
			
            $rta['linkid']=$row['id'];
            $rta['cerrado']=$res['cerrado'];
            
            if(!isset($res['emision'])){$res['emision']='0000-00-00';}	
            $rta['emision']=$res['emision'];
            
            $rta['sentido']=$res['sentido'];
			
            //$rta['falsonombre']=utf8_encode($res['falsonombre']);
			$rta['falsonombre']=$res['falsonombre'];
			
            $rta['estado']=$res['estado'];					
            $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_origen']]['respuestas'][$row['id_p_comunicaciones_id_nombre_respuesta']]=$rta;
            
            unset($res);
            
            //inserta el vínculo a su objeto de destino	
            $res=$Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_origen']];
			//$ori['id1']=utf8_encode($res['id1']);
            $ori['id1']=$res['id1'];
            //$ori['id2']=utf8_encode($res['id2']);
			$ori['id2']=$res['id2'];
            //$ori['id3']=utf8_encode($res['id3']);
			$ori['id3']=$res['id3'];
            //$ori['nombre']=utf8_encode($res['nombre']);
            $ori['nombre']=$res['nombre'];
            $ori['linkid']=$row['id'];
            $ori['cerrado']=$res['cerrado'];	
            if(!isset($res['emision'])){$res['emision']='0000-00-00';}						
            $ori['emision']=$res['emision'];
            $ori['sentido']=$res['sentido'];
            //$ori['falsonombre']=utf8_encode($res['falsonombre']);
			$ori['falsonombre']=$res['falsonombre'];
            $ori['estado']=$res['estado'];
            $Log['data']['comunicaciones'][$row['id_p_comunicaciones_id_nombre_respuesta']]['origenes'][$row['id_p_comunicaciones_id_nombre_origen']]=$ori;
            //echo "____";
            //if($row['id']=='658'){echo $row['id_p_comunicaciones_id_nombre_origen']; print_r($res);}
            //echo $row['id'].",";																
        }	
    }
}	


$primerfecha=$Hoy;
$ultimafecha=$Hoy;


// genera vacios los array de ordenes pde representación de comunicicones
$ArrOrig=array();
$ArOrd['Id1']=array();
$ArOrd['Id2']=array();
$ArOrd['Id3']=array();
$ArOrd['FeEm']=array();
$ArOrd['FeRe']=array();
$ArOrd['FeCi']=array();

foreach($Log['data']['comunicaciones'] as $id => $row){

	
    if(count($row['adjuntos'])!=$row['zz_reg_adjuntos_cant']){
        $_POST['idcom']=$id;
        include('./COM/COM_proc_zzreg_adjuntos.php');
        unset($Log['data']['comunicacioneszzreg']);
        unset($_POST['idcom']);
    }
    
    if(isset($row['emision'])){
        if($row['emision']>0){
            $primerfecha=min($primerfecha,$row['emision']);
        }
    }else{
    	$row['emision']='a emitir';
    }
    if(isset($row['cerradodesde'])){
        $ultimafecha=max($ultimafecha,$row['cerradodesde']);
    }else{
    	$Log['data']['comunicaciones'][$id]['cerradodesde']='0000-00-00';
    }

	// llena de datos los array de ordenes pde representación de comunicicones
	$ArrOrig[]=$id; 
	$ArOrd['Id1'][]=$row['id1'];
	$ArOrd['Id2'][]=$row['id2'];
	$ArOrd['Id3'][]=$row['id3'];
	$ArOrd['FeEm'][]=$row['emision'];
	$ArOrd['FeRe'][]=array();
	$ArOrd['FeCi'][]=$row['cerradodesde'];
}
$fecharas=$primerfecha;

foreach($ArOrd as $nom => $cont){// ordena los array de ordenes pde representación de comunicicones
	$Log['data']['comOrdenes'][$nom]=$ArrOrig;	
	array_multisort(	
		$cont, SORT_DESC, SORT_NUMERIC,
		$Log['data']['comOrdenes'][$nom], SORT_NUMERIC, SORT_DESC
	);	
}



while($fecharas<=$ultimafecha){
    $fecharas=sumadias($fecharas,7);
    $EmSal=0;
    $EmEnt=0;
    $AcSal=0;
    $AcEnt=0;
    
    foreach($Log['data']['comunicaciones'] as $id => $row){
        
        
        if(!isset($row['sentido'])){
            $Log['tx'][]='error en el sentido de la comunicación id: '. $id;
            $Log['tx'][]=$row;
            terminar($Log);
        }
        
        if(isset($row['emision'])){$em=$row['emision'];}
        if(isset($em)){
        if($em<=$fecharas){
            if($row['sentido']=='saliente'){
                $EmSal++;
            }elseif($row['sentido']=='entrante'){
                $EmEnt++;	
            }
                
            $fechas[$fecharas]=$fecharas;
            if($row['cerradodesde']>=$fecharas||$row['estado']!='cerrado'){	
                if($row['sentido']=='saliente'){
                $AcSal++;
                }elseif($row['sentido']=='entrante'){
                $AcEnt++;	
                }
            }
        }
        }
    }	

    $ACUM['emitidos']['saliente'][$fecharas]=$EmSal;
    $ACUM['emitidos']['entrante'][$fecharas]=$EmEnt;
    $ACUM['abiertos']['saliente'][$fecharas]=$AcSal;
    $ACUM['abiertos']['entrante'][$fecharas]=$AcEnt;

}


//terminada la definición de comunicaciones

comunicacionesPANestadisticasCargar($ACUM);


if(!isset($_POST['ID'])){
    $_POST['ID']=0;
}

//organizacion de comunicaciones

$a = $Log['data']['comunicaciones'];
$Log['tx'][]="consulta arroja: ".count($a)." resultados";	
//print_r($a);



foreach($a as $k => $datos){		
    $Listados[$datos['id']]='si';
    
    if(!isset($datos['recepcion'])){
        $a[$k]['recepcion']='';
    }
    if(!isset($datos['emision'])){
        $a[$k]['emision']='';
    }
}

unset($orden);


$elem=array();

foreach($a as $k => $datos){
    if(!isset($datos['emision'])){
        $datos['emision']='';
    }
    if($datos['id1']==''||$datos['emision']==''||$datos['emision']=='0000-00-00'){
        $elem[$k] = $datos;
        
        if($datos['emision']==''||$datos['emision']=='0000-00-00'){
            $elem[$k]['emision']="<span class='alerta'>a emitir</span>";
			$elem[$k]['emision']="";
        }		
        if($datos['id1']==''){
            $elem[$k]['id1']="<span class='alerta'>a definir</span>";	
            $elem[$k]['falsonombre'].="<span class='alerta'>a definir</span>";	
        }					
        unset($a[$k]);			
    }
}	

if(count($elem)>0){		
    $a=$a + $elem;		//esto no se lo que hace
}

$nOrden=-1;

$Log['data']['regs']=array();



foreach($Log['data']['comunicacionesOrden'] as $valororden => $k){
    
    if(!isset($a[$k])){continue;}
    
    $datos=$a[$k];
    
    $nOrden++;
    $id=$datos['id'];
	
    if($Config['com-prefijo-grupo']=='primario'){
        $campogrupo=$Grupos[$datos['idga']]['codigo'];
        $campogrupo2=$Grupos[$datos['idgb']]['codigo'];;
    }elseif($Config['com-prefijo-grupo']=='secundario'){
        $campogrupo=$Grupos[$datos['idgb']]['codigo'];;
        $campogrupo2=$Grupos[$datos['idga']]['codigo'];;			
    }else{
        $campogrupo="";		
        $campogrupo2="";	
    }
	
	
    $rtas=$datos['respuestas'];
    
    if(count($rtas)>3||count($datos['origenes'])>3){
        $h=round(max(count($rtas),count($datos['origenes']))*10);
        $st="style='height:".$h."px'";
    }else{
        $st="";
    }
    $Log['data']['regs'][$nOrden]=$datos;
	
    $Log['data']['regs'][$nOrden]['campogrupo']=$campogrupo;
    $Log['data']['regs'][$nOrden]['campogrupo2']=$campogrupo2;
	
	
	if(!isset($datos['fechaobjetivo'])){$datos['fechaobjetivo']='9999-99-99';}
    if(!isset($datos['cerrado'])){$datos['cerrado']='no';}
	

    $title='';
    
    
    $Log['data']['regs'][$nOrden]['documentosasociados']=$datos['documentosasociados'];
    //print_r($Log['data']['regs'][$nOrden]['documentosasociados']);
    
    foreach($datos['documentosasociados']['presentados'] as $iver => $dat){		
        $title.=$dat['numdoc']." v:".$dat['numversion'];
        if(isset($datos['documentosasociados']['presentados'][$iver])){
            $title.=" (R)";
        }
        $title.=PHP_EOL;
    }
    
    $Log['data']['regs'][$nOrden]['docsTitulo']=$title;	
    
    if(count($rtas)>3||count($datos['origenes'])>2){
        $h=round(max(count($rtas),(count($datos['origenes'])+1))*10);
        $st=$h;
    }else{
        $st="";
    }
    $Log['data']['regs'][$nOrden]['hfila']=$st;

}
$Log['tx'][]="eliminando el array comunicaciones. se para a regs";
unset($Log['data']['comunicaciones']);
if(!isset($_POST['avance'])){$_POST['avance']='total';}
if($_POST['avance']=='inicial'){
	$cod=str_pad(rand(0, 99999),5,"0",STR_PAD_LEFT);
	unset($_SESSION['paneldecontrol']['consultaguarda']);
	$salvar=array();
	$tamanoPaquetes=20;
	if(isset($Log['data']['regs'])){		
		$salvar=array_slice($Log['data']['regs'],$tamanoPaquetes);
		$Log['data']['regs']=array_slice($Log['data']['regs'], 0, $tamanoPaquetes);
	}	
	$_SESSION['paneldecontrol']['consultaguarda'][$cod]=$salvar;
	$Log['data']['avanceCod']=$cod;
}
$Log['data']['avance']=$_POST['avance'];


//echo "HH<pre>";print_r($Log);echo "</pre>ZZ";
$Log['res']='exito';
terminar($Log);



	
	
	
	

	
	
/**
* realiza una búsqueda de todas comunicaciones en la base de datos para el panel activo y debuelve una array desordenado
* @global string $Base base de datos mysql de trabajo
* @global array $Config configuracion del panel activo
* @global int $PanelI id del panel activo
* @return array organizado y ordenado con el resultado de la búsqueda conteniendo los datos básicos de la comunicación, y arrays con estados y respuestas
* @global array $ACUM VALORES ACUMULADOS PARA GRAFICOS ESTADÍSITCOS
*/
function comunicacionesPANestadisticasCargar($ACUM){
	global $PanelI, $Config, $Base, $Conec1;

	$micro_date = microtime(true);
	
	$Millidate=$micro_date*1000;
	
	if(isset($_SESSION['panelcontrol'] -> McTi_Rcom)){
		$smc=$_SESSION['panelcontrol'] -> McTi_Rcom;
		unset($_SESSION['panelcontrol'] -> McTi_Rcom);	
	}else{$smc=0;}
	
	$mc=0;
	if($smc>1453750000){$mc=microtime(true)-$smc;echo "<p>mT consulta: $mc</p>";}
	if($mc>60*60*1000000){unset($mc);}
	
	$query = "
	INSERT INTO 
		`paneles`.`PANestadisticasCOM`
	SET
	
		`zz_AUTOPANEL`='".$PanelI."',
		`fechahora`='".$Millidate."',
		`ano`='".date("Y")."',	
		`mes`='".date("m")."',	
		`totsalientes`='".end($ACUM['emitidos']['saliente'])."',
		`totentrantes`='".end($ACUM['emitidos']['entrante'])."',
		`pendsalientes`='".end($ACUM['abiertos']['saliente'])."',
		`pendentrentes`='".end($ACUM['abiertos']['entrante'])."',
		zz_microtiempo='".$mc."',
		zz_server='".$_SERVER['HTTP_HOST']."'
	";
	$Consulta = $Conec1->query($query);	
	$Log['data']['ectualizadionestadistica']['nid']=$Conec1->insert_id;
    if($Conec1->error!=''){
		$Log['tx'][]='error en consulta de edicion de estadísticas: '.$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log); 
	}
}












/**
* realiza una búsqueda de versiones de documentos utilizado para contabilizar cantidad de documentación presentada y respondida de y a cada comunicación 
*
* @param 
* @return array 
*/
function consultaversionesdereferencia(){
global $PanelI, $Conec1, $Config;
// consulta de versiones asociadas al panel activo
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
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
		$Log['tx'][]='error en consulta gdocumentos: '.$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log); 
	}
	while($row = $Consulta->fetch_assoc()){
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
				AND DOCversion.zz_borrada='0'
			order by id_p_DOCdocumento_id, id
		";
	$Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
		$Log['tx'][]='error en consulta versions: '.$Conec1->error;
		$Log['tx'][]=$query;
		$Log['res']='err';
		terminar($Log); 
	}
	while($row = $Consulta->fetch_assoc()){
		$versiones[$row['idversion']]=$row;
		$ultimaversion[$row['iddocumento']]=$row['idversion'];
	}		
	
	foreach($versiones as $idver => $dataver){
		$dat['id']=$dataver['iddocumento'];
		if(isset($docs[$dataver['iddocumento']])){
			$dat['ndoc']=utf8_encode($docs[$dataver['iddocumento']]['nombre']);
			$dat['numdoc']=utf8_encode($docs[$dataver['iddocumento']]['numerodeplano']);	
		}
		
		$dat['numversion']=$dataver['numversion'];
	
		if(isset($docs[$dataver['iddocumento']])){
						
			$Ddocumentosasoc[$dataver['idpresenta']]['presentados'][$idver]=$dat;
			if(!isset($Ddocumentosasoc[$dataver['idpresenta']]['respuestos'])){$Ddocumentosasoc[$dataver['idpresenta']]['respuestos']=array();}
			if($dataver['idanula']>0||$dataver['idaprueba']>0||$dataver['idrechaza']>0||$dataver['idversion']!=$ultimaversion[$dataver['iddocumento']]){				
				$Ddocumentosasoc[$dataver['idpresenta']]['respuestos'][$idver]=$dat;
			}		
		}
	}	
	
	return($Ddocumentosasoc);	
}



?>
