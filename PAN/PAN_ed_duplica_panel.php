<?php 
/**
* paneles_duplica.php
*
* paneles_duplica.php permite generar un nuevo panel tomand de base otro existente. 
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	paneles
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2014 - 2015 TReCC SA
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

$HOY=date('Y-m-d');

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
}
$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['mg'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['mg'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}


if(isset($_POST['inicio_a'])&&isset($_POST['inicio_m'])&&isset($_POST['inicio_d'])){
	$Inicio=$_POST['inicio_a']."-".$_POST['inicio_m']."-".$_POST['inicio_d'];// fecha de referencia para fecha de inicios de seguimientos
	if(!fechavalida($Inicio)){
		$Inicio=sumames($HOY,-2);
	}	
}

if(isset($_POST['fin_a'])&&isset($_POST['fin_m'])&&isset($_POST['fin_d'])){
	$Fin=$_POST['fin_a']."-".$_POST['fin_m']."-".$_POST['fin_d'];// fecha de referencia para fecha de fin de seguimientos
	if(!fechavalida($Fin)){
		$Fin=sumames($HOY,6);
	}	
}

$Nombre=utf8_decode($_POST['nombre']);
$Descripcion=utf8_decode($_POST['descripcion']);	

$Completo=$_POST['completo'];//si se solicita esta variable con valor SI, duplica elementos que sueles ser específicos de cada panel (documentaicón, comunicaciones, etc.)
								
$IDreferencia=$PanelI;
								
$Log['tx'][]= utf8_encode( "se inicia copia del panel: ".$IDreferencia);



//identifica el inicio del seguimimento en el panel de referencia IMPLEMENTAR
/*
$query="
	SELECT
		fecha
	FROM
		HIThitos
	LEFT JOIN
		HITfechas ON HITfechas.id_p_HIThitos_id_nombre =  HIThitos.id
	WHERE `id_p_paneles_id_nombre`='".$IDreferencia."'
	AND `id_p_HITtipohito_id_nombre`='1'
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudo identificarse el hito de inicio");
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$fechareferencia=mysql_result($Consulta,0,'fecha');
	$DIFERENCIATEMPORAL=diasentrefechas($fechareferencia,$HOY);
	$Log['tx'][]= utf8_encode( "se determinó una diferencia temporal de $DIFERENCIATEMPORAL dias entre el panel de referencia y la fecha de hoy, esta diferencia se aplicará a toda la información copiada.<br>";
}
*/


//FALTA COPIAR COMUN ESTADOS LISTA - IMPLEMENTAR


//crear nuevo panel en `paneles`.`paneles`
$query="
	INSERT INTO `paneles`.`paneles`
	(
		`nombre`,
		`id_p_B_usuarios_usuarios_id_nombre`,
		`descripcion`,
		`fin`,
		zz_AUTOFECHACREACION
	)
	SELECT 
		'$Nombre',
	    '$UsuarioI',
	    '$Descripcion',
	    `paneles`.`fin`,
	    '$HOY'
	FROM 
		`paneles`.`paneles`
	WHERE 
	   `paneles`.id='".$IDreferencia."'
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['mg'][]= "error: no pudo crearse el nuevo panel";
	$Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
	$Log['tx'][]= $Conec1->error;
	terminar($Log);
}else{
	$NID['panel']=$Conec1->insert_id;
	$Log['tx'][]= utf8_encode("nuevo panel creado. ID: :".$NID['panel']);
	$Log['data']['nid']=$NID['panel'];
}


//copiar configuración de `paneles`.`accesos`
$query="
INSERT INTO 
	`paneles`.`configuracion`
	(

		id_p_paneles_id_nombre, `gral-orden-grupo`, 
		`ind-activo`, `ind-rep-traking`, `ind-rep-com-sale`, 
		`ind-rep-com-entra`, `ind-feriado`, `seg-activo`, 
		`com-activo`, `com-entra`, `com-entrax`, 
		`com-entra-preN`, `com-entra-preNx`, `com-sale`, 
		`com-salex`, `com-sale-preN`, `com-sale-preNx`, 
		`com-grupob`, `com-grupoa`, `com-ident`, `com-identdos`, 
		`com-identtres`, `com-seguimiento`, `com-seguimiento-plazo`,
		 `com-seguimiento-inicio`, `com-aprobacion`, `com-aprobacion-sale`, 
		 `com-prefijo-grupo`, `com-text-encabezado-entrante`, `com-text-encabezado-saliente`,
		  `com-text-css`, `com-nomenclaturaarchivos`, `com-nomenclaturaarcseparador`, 
		  `com-nomenclaturaarchivosRta`, `inf-activo`, `doc-activo`, `doc-visadomultiple`, 
		  `doc-criterionum`, `doc-nomenclaturaarchivos`, `doc-nomenclaturaarcseparador`, 
		  `tar-activo`, `hit-activo`, `cer-activo`, `cer-minimo`, `cer-maximo`, `rel-activo`, 
		  `rel-tabladiag`, zz_AUTOPANEL, 
		  `pla-activo`, `pla-nivel1`, `pla-nivel2`, `pla-nivel3`, `cpt-activo`, `esp-activo`
	)
	
SELECT 

	id_p_paneles_id_nombre, `gral-orden-grupo`, 
	`ind-activo`, `ind-rep-traking`, `ind-rep-com-sale`, 
	`ind-rep-com-entra`, `ind-feriado`, `seg-activo`, 
	`com-activo`, `com-entra`, `com-entrax`, 
	`com-entra-preN`, `com-entra-preNx`, `com-sale`, 
	`com-salex`, `com-sale-preN`, `com-sale-preNx`, 
	`com-grupob`, `com-grupoa`, `com-ident`, `com-identdos`, 
	`com-identtres`, `com-seguimiento`, `com-seguimiento-plazo`,
	 `com-seguimiento-inicio`, `com-aprobacion`, `com-aprobacion-sale`, 
	 `com-prefijo-grupo`, `com-text-encabezado-entrante`, `com-text-encabezado-saliente`,
	  `com-text-css`, `com-nomenclaturaarchivos`, `com-nomenclaturaarcseparador`, 
	  `com-nomenclaturaarchivosRta`, `inf-activo`, `doc-activo`, `doc-visadomultiple`, 
	  `doc-criterionum`, `doc-nomenclaturaarchivos`, `doc-nomenclaturaarcseparador`, 
	  `tar-activo`, `hit-activo`, `cer-activo`, `cer-minimo`, `cer-maximo`, `rel-activo`, 
	  `rel-tabladiag`, '".$NID['panel']."',
	  `pla-activo`, `pla-nivel1`, `pla-nivel2`, `pla-nivel3`, `cpt-activo`, `esp-activo`

FROM 
	`paneles`.`configuracion`
WHERE 
	`zz_AUTOPANEL`='$IDreferencia'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['mg'][]= utf8_encode("error: no pudo copiarse la configuración al nuevo panel");
	$Log['tx'][]=  utf8_encode("<pre>".$query."</pre>");
	$Log['tx'][]=  utf8_encode($Conec1->error);
	terminar($Log);
}else{
	$NID['cofiguracion']=$Conec1->insert_id;
	$Log['tx'][]= utf8_encode("configuración copiada. ID: :".$NID['cofiguracion']);
}



// copiar grupos
$query="
INSERT INTO 
	`paneles`.`grupos`
	(
		`nombre`,
		`codigo`,
		`orden`,
		`responsable`,
		`n_id_local`,
		`id_p_paneles_id_nombre`,
		`tipo`,
		`descripcion`,
		`zz_AUTOPANEL`,
		`zz_AUTOIDCOPIA`
	)
SELECT 
    `grupos`.`nombre`,
    `grupos`.`codigo`,
    `grupos`.`orden`,
    `grupos`.`responsable`,
    `grupos`.`n_id_local`,
    '".$NID['panel']."',
    `grupos`.`tipo`,
    `grupos`.`descripcion`,
    '".$NID['panel']."',
	`grupos`.id
FROM
	`paneles`.`grupos`
WHERE 
	`grupos`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['mg'][]= utf8_encode("error: no pudieron copiarse los grupos al nuevo panel");
	$Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
	$Log['tx'][]= utf8_encode($Conec1->error);
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode($Conec1->affected_rows."grupos copiados.");
}


$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`grupos`
	WHERE 
		`grupos`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['grupos'][$row['zz_AUTOIDCOPIA']]=$row['id'];
}


//copiar indicadores

$query="
INSERT INTO 
	`paneles`.`indicadores`
	(
		`indicador`,
		`n_id_local`,
		`descripcion`,
		`unidad`,
		`id_p_INDperiodicidad`,
		`id_p_grupos_id_nombre_tipoa`,
		`id_p_grupos_id_nombre_tipob`,
		id_p_HIThitos_id_nombre_desde,
		`desde`,
		id_p_HIThitos_id_nombre_hasta,
		`hasta`,
		`caracter`,
		`fuente`,
		`formula`,
		`cargaforzada`,
		`id_p_INDvalorizacion_id`,
		`color`,
		`id_p_responsables_id_nombre`,
		`publicarweb`,
		`zz_AUTOPANEL`,
		`zz_id_p_escalas`,
		`zz_AUTOIDCOPIA`,
		valorpordefecto
	)
	
SELECT 
	`indicadores`.`indicador`,
	`indicadores`.`n_id_local`,
	`indicadores`.`descripcion`,
	`indicadores`.`unidad`,
	`indicadores`.`id_p_INDperiodicidad`,
	`gruposa`.`id`,
	`gruposb`.`id`,
	id_p_HIThitos_id_nombre_desde,
	'".$Inicio."',
	id_p_HIThitos_id_nombre_hasta,
	'".$Fin."',
	`indicadores`.`caracter`,
	`indicadores`.`fuente`,
	`indicadores`.`formula`,
	`indicadores`.`cargaforzada`,
	`indicadores`.`id_p_INDvalorizacion_id`,
	`indicadores`.`color`,
	'',
	`indicadores`.`publicarweb`,
	'".$NID['panel']."',
	`indicadores`.`zz_id_p_escalas`,
	`indicadores`.id,
	valorpordefecto

FROM
	`paneles`.`indicadores`

LEFT JOIN 
	grupos as gruposa 
	on gruposa.zz_AUTOIDCOPIA=`indicadores`.`id_p_grupos_id_nombre_tipoa`
	AND gruposa.`zz_AUTOPANEL`='".$NID['panel']."'
LEFT JOIN 
	grupos as gruposb 
	on gruposb.zz_AUTOIDCOPIA=`indicadores`.`id_p_grupos_id_nombre_tipob`
	AND gruposb.`zz_AUTOPANEL`='".$NID['panel']."'	
	
WHERE 
   `indicadores`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['mg'][]= "error: no pudieron copiarse los indicadores al nuevo panel";
    $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
	$Log['tx'][]= utf8_encode($Conec1->error);
	terminar($Log);
}else{
	$Log['tx'][]= $Conec1->affected_rows."indicadores copiados.";
}

// cargar traducción de indicadores
$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`indicadores`
	WHERE 
		`indicadores`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['indicadores'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	$TRADUCCIONES['viejosindicadores'][$row['id']]=$row['zz_AUTOIDCOPIA'];
}



if($Completo=='SI'){
	//copiar comunicaciones
	 $Log['tx'][]= utf8_encode("Se duplicarán las comunicacioes efectuadas.");
	
	$query="
		
		INSERT INTO 
			`paneles`.`comunicaciones`
			(
			`sentido`,
			`requerimiento`,
			`requerimientoescrito`,
			`fechaemisionref`,
			`fechaemision`,
			`fecharecepcion`,
			`fechainicio`,
			`fechaobjetivo`,
			`ident`,
			`identdos`,
			`identtres`,
			`cerrado`,
			`cerradodesde`,
		
			`nombre`,
			`descripcion`,
			`preliminar`,
			`relevante`,
			`id_p_grupos_id_nombre_tipoa`,
			`id_p_grupos_id_nombre_tipob`,
			`zz_borrada`,
			`zz_AUTOPANEL`,
			`zz_AUTOIDCOPIA`
			)
			SELECT

				`comunicaciones`.`sentido`,
				`comunicaciones`.`requerimiento`,
				`comunicaciones`.`requerimientoescrito`,
				`comunicaciones`.`fechaemisionref`,
				`comunicaciones`.`fechaemision`,
				`comunicaciones`.`fecharecepcion`,
				`comunicaciones`.`fechainicio`,
				`comunicaciones`.`fechaobjetivo`,
				`comunicaciones`.`ident`,
				`comunicaciones`.`identdos`,
				`comunicaciones`.`identtres`,
				`comunicaciones`.`cerrado`,
				`comunicaciones`.`cerradodesde`,
		
				`comunicaciones`.`nombre`,
				`comunicaciones`.`descripcion`,
				`comunicaciones`.`preliminar`,
				`comunicaciones`.`relevante`,
				`gruposa`.`id`,
				`gruposb`.`id`,
				`comunicaciones`.`zz_borrada`,
				'".$NID['panel']."',
				`comunicaciones`.id
				
			FROM `paneles`.`comunicaciones`
			
			LEFT JOIN 
				grupos as gruposa 
				on gruposa.zz_AUTOIDCOPIA=`comunicaciones`.`id_p_grupos_id_nombre_tipoa`
				AND gruposa.`zz_AUTOPANEL`='".$NID['panel']."'
				
			LEFT JOIN 
				grupos as gruposb 
				on gruposb.zz_AUTOIDCOPIA=`comunicaciones`.`id_p_grupos_id_nombre_tipob`
				AND gruposb.`zz_AUTOPANEL`='".$NID['panel']."'	
		
			WHERE 
				`comunicaciones`.`zz_AUTOPANEL`='".$IDreferencia."'
			AND
				`zz_borrada`='0'
	";

	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= "error: no pudieron copiarse las comunicaciones";
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= $Conec1->error;
        terminar($Log);
	}else{
		$Log['tx'][]= utf8_encode( $Conec1->affected_rows." comunicaciones duplicadas.");
		$query="
			SELECT 
			    id,
			   `zz_AUTOIDCOPIA`
			FROM
				`paneles`.`comunicaciones`
			WHERE 
				`comunicaciones`.`zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Consulta=$Conec1->query($query);
		while($row = $Consulta->fetch_assoc()){
			$TRADUCCIONES['comunicaciones'][$row['zz_AUTOIDCOPIA']]=$row['id'];
		}
	}

	//copiar documentacion
	 $Log['tx'][]= utf8_encode("Se duplicarán los documentos cargados.");	
	$query="
		INSERT INTO 
			`paneles`.`DOCdocumento`
			(
			`numerodeplano`,
			`nombre`,
			`id_p_DOCdef_id_nombre_tipo_escala`,
			`id_p_DOCdef_id_nombre_tipo_rubro`,
			`id_p_DOCdef_id_nombre_tipo_planta`,
			`id_p_DOCdef_id_nombre_tipo_sector`,
			`id_p_DOCdef_id_nombre_tipo_tipologia`,
			`descripcion`,
			`zz_borrada`,
			`zz_AUTOFECHACREACION`,
			`zz_AUTOFECHAMODIF`,
			`zz_AUTOPANEL`,
			`id_p_grupos_id_nombre_tipoa`,
			`id_p_grupos_id_nombre_tipob`,
			`zz_AUTOIDCOPIA`
			)

		
		SELECT
	
			`DOCdocumento`.`numerodeplano`,
			`DOCdocumento`.`nombre`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_escala`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_rubro`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_planta`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_sector`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_tipologia`,
			`DOCdocumento`.`descripcion`,
			`DOCdocumento`.`zz_borrada`,
			`DOCdocumento`.`zz_AUTOFECHACREACION`,
			`DOCdocumento`.`zz_AUTOFECHAMODIF`,
			'".$NID['panel']."',
			`gruposa`.`id`,
			`gruposb`.`id`,
			`DOCdocumento`.id
			
				
		FROM `paneles`.`DOCdocumento`

		LEFT JOIN 
			grupos as gruposa 
			on gruposa.zz_AUTOIDCOPIA=`DOCdocumento`.`id_p_grupos_id_nombre_tipoa`
			AND gruposa.`zz_AUTOPANEL`='".$NID['panel']."'
			
		LEFT JOIN 
			grupos as gruposb 
			on gruposb.zz_AUTOIDCOPIA=`DOCdocumento`.`id_p_grupos_id_nombre_tipob`
			AND gruposb.`zz_AUTOPANEL`='".$NID['panel']."'	
	
		WHERE 
			`DOCdocumento`.`zz_AUTOPANEL`='".$IDreferencia."'
		AND
			`zz_borrada`='0'
				
		
	";
	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= "error: no pudieron copiarse los documentos";
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= $Conec1->error;
        terminar($Log);
	}else{
		 $Log['tx'][]= utf8_encode($Conec1->affected_rows." documentos duplicados.");
		$query="
			SELECT 
			    id,
			   `zz_AUTOIDCOPIA`
			FROM
				`paneles`.`DOCdocumento`
			WHERE 
				`DOCdocumento`.`zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Consulta=$Conec1->query($query);
		while($row = $Consulta->fetch_assoc()){
			$TRADUCCIONES['DOCdocumento'][$row['zz_AUTOIDCOPIA']]=$row['id'];
		}
	}

	
	//copiar versiones
	 $Log['tx'][]= utf8_encode("Se duplicarán las versiones cargadas.");	
	$query="
		INSERT INTO `paneles`.`DOCversion`
			(
			`version`,
			`previstoorig`,
			`previstoactual`,
			`descripcion`,
			`id_p_DOCdocumento_id`,
			`id_p_comunicaciones_id_ident_entrante`,
			`id_p_comunicaciones_id_ident_aprobada`,
			`id_p_comunicaciones_id_ident_rechazada`,
			`id_p_comunicaciones_id_ident_anulada`,
			`zz_borrada`,
			`zz_AUTOFECHACREACION`,
			`zz_AUTOFECHAMODIF`,
			`zz_AUTOPANEL`
			)


		SELECT

			`DOCversion`.`version`,
			`DOCversion`.`previstoorig`,
			`DOCversion`.`previstoactual`,
			`DOCversion`.`descripcion`,
			`DOCversion`.`id_p_DOCdocumento_id`,
			`DOCversion`.`id_p_comunicaciones_id_ident_entrante`,
			`DOCversion`.`id_p_comunicaciones_id_ident_aprobada`,
			`DOCversion`.`id_p_comunicaciones_id_ident_rechazada`,
			`DOCversion`.`id_p_comunicaciones_id_ident_anulada`,
			`DOCversion`.`zz_borrada`,
			`DOCversion`.`zz_AUTOFECHACREACION`,
			`DOCversion`.`zz_AUTOFECHAMODIF`,
			'".$NID['panel']."'
			
		FROM `paneles`.`DOCversion`	
	
		WHERE 
			`DOCversion`.`zz_AUTOPANEL`='".$IDreferencia."'
		AND
			`zz_borrada`='0'			
		
	";
	
	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse las versiones");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);	
	}else{
		$Log['tx'][]= utf8_encode($Conec1->affected_rows." versiones duplicadas.");
		//no sería neseario gererar traducci´n de versi´noes por ahora
	}


	//copiar estados comunicaciones 
	$Log['tx'][]= utf8_encode("Se duplicarán los estados de las comunicaciones. ".$NID['panel']);	
	$query="
		INSERT INTO `paneles`.`comunestados`
			(
			`id_p_comunicaciones_id_nombre`,
			`id_p_comunestadoslista`,
			`desde`,
			`pordefecto`,
			`zz_AUTOPANEL`
			)
		SELECT
			
			`comunestados`.`id_p_comunicaciones_id_nombre`,
			`comunestados`.`id_p_comunestadoslista`,
			`comunestados`.`desde`,
			`comunestados`.`pordefecto`,
			'".$NID['panel']."'
			
		FROM `paneles`.`comunestados`
	
		WHERE 
			`comunestados`.`zz_AUTOPANEL`='".$IDreferencia."'		
		
	";

	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse los estados de las comunicaciones");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);	
	}else{
		$Log['tx'][]= utf8_encode( $Conec1->affected_rows." estados de  coms duplicados.");
		//no sería neseario gererar traducci´n de versi´noes por ahora
	}

	
}

//duplicar definiciones de documentos
	$Log['tx'][]= utf8_encode( "<br>Se duplicarán las definiciones de documentos.");	
	$query="
	INSERT INTO 
		`paneles`.`DOCdef`
		(
		`tipo`,
		`nombre`,
		`descripcion`,
		`zz_AUTOPANEL`,
		`codigo`,
		`zz_AUTOIDCOPIA`
		)
		SELECT
		
		`DOCdef`.`tipo`,
		`DOCdef`.`nombre`,
		`DOCdef`.`descripcion`,
		'".$NID['panel']."',
		`DOCdef`.`codigo`,
		`DOCdef`.`id`
		
		FROM `paneles`.`DOCdef`
	
		WHERE 
			`DOCdef`.`zz_AUTOPANEL`='".$IDreferencia."'
		AND
			`DOCdef`.`zz_borrada`='0'
				
		
	";
	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse las definiciones de documentos");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);	
	}else{
		$Log['tx'][]= utf8_encode($Conec1->affected_rows." definiciones de documentos duplicadas.");
		$query="
			SELECT 
			    id,
			   `zz_AUTOIDCOPIA`
			FROM
				`paneles`.`DOCdef`
			WHERE 
				`DOCdef`.`zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Consulta=$Conec1->query($query);
		while($row = $Consulta->fetch_assoc()){
			$TRADUCCIONES['DOCdef'][$row['zz_AUTOIDCOPIA']]=$row['id'];
		}
	}


//Copiar hitos tipificados
$query="
	INSERT INTO 
		`paneles`.`HIThitos`
		(
		`nombre`,
		`id_p_HITtipohito_id_nombre`,
		`id_p_ACTactores_id_nombre`,
		`zz_AUTOPANEL`,
		`id_p_grupos_id_nombre_tipoa`,
		`id_p_grupos_id_nombre_tipob`,
		`formula`,
		zz_AUTOIDCOPIA
		)
	SELECT 
	    `HIThitos`.`nombre`,
	    `HIThitos`.`id_p_HITtipohito_id_nombre`,
	    `HIThitos`.`id_p_ACTactores_id_nombre`,
	    ".$NID['panel'].",
	    gruposa.`id`,
	    gruposb.`id`,
	    `HIThitos`.`formula`,
		`HIThitos`.`id`	    
	    
	FROM `paneles`.`HIThitos`
	
	LEFT JOIN 
		grupos as gruposa 
		on gruposa.zz_AUTOIDCOPIA=`HIThitos`.`id_p_grupos_id_nombre_tipoa`
		AND gruposa .`zz_AUTOPANEL`='".$NID['panel']."'
	LEFT JOIN 
		grupos as gruposb on gruposb.zz_AUTOIDCOPIA=`HIThitos`.`id_p_grupos_id_nombre_tipob`
		AND gruposb .`zz_AUTOPANEL`='".$NID['panel']."'	
	WHERE
		`HIThitos`.zz_AUTOPANEL='".$IDreferencia."'
		AND `HIThitos`.id_p_HITtipohito_id_nombre IS NOT NULL
";

$Conec1->query($query);
if($Conec1->error!=''){
    $Log['mg'][]= utf8_encode("error: no pudieron copiarse los hitos tipificados");
    $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
    $Log['tx'][]= utf8_encode($Conec1->error);
    terminar($Log);		
}else{
	$Log['tx'][]= utf8_encode($Conec1->affected_rows." hitos tipificados copiados.");
	$query="
		SELECT 
		    id,
		   `zz_AUTOIDCOPIA`
		FROM
			`paneles`.`HIThitos`
		WHERE 
			`HIThitos`.`zz_AUTOPANEL`='".$NID['panel']."'
	";
	
	$Consulta=$Conec1->query($query);
	
	if($Conec1->error!=''){
	    $Log['mg'][]= utf8_encode("error: no pudieron copiarse los hitos tipificados");
	    $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
	    $Log['tx'][]= utf8_encode($Conec1->error);
	    terminar($Log);		
	}
	
	while($row = $Consulta->fetch_assoc()){
		$TRADUCCIONES['HIThitos'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	}
	
}


//genera las fechas asociadas a los hitos
$query="
INSERT INTO 
	HITfechas
	(
		id_p_HIThitos_id_nombre, 
		fecha, avance, tipo, zz_AUTOFECHACREACION, 
		zz_AUTOPANEL,
		zz_superada, fechaUvalidodesde, fechaUsuperadadesde, zz_AUTOUSUARIO
	)
	SELECT
		HIThitos.id, 
		HITfechas.fecha, HITfechas.avance, HITfechas.tipo, HITfechas.zz_AUTOFECHACREACION, 
		'".$NID['panel']."',
		HITfechas.zz_superada, HITfechas.fechaUvalidodesde, HITfechas.fechaUsuperadadesde, HITfechas.zz_AUTOUSUARIO
	FROM 
		paneles.HITfechas
		
	LEFT JOIN
		HIThitos 
			ON HIThitos.zz_AUTOIDCOPIA = HITfechas.id_p_HIThitos_id_nombre 
			AND `HIThitos`.`zz_AUTOPANEL`='".$NID['panel']."'
			
	WHERE
		HITfechas.`zz_AUTOPANEL`='".$IDreferencia."'
	AND
		HITfechas.zz_superada='0'		
	";
	
$Consulta=$Conec1->query($query);

if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse elementos en graficos");
	$Log['tx'][]= utf8_encode( $Conec1->error );		
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	$Log['res']='err';
	terminar($Log);
}



//actualizar las formulas asociadas de los indicadores y fechas asociadas a HITOS
$query="
	SELECT 
	   id,
	   formula,
	   	id_p_HIThitos_id_nombre_desde,
		id_p_HIThitos_id_nombre_hasta
	FROM
		`paneles`.`indicadores`
	WHERE 
		`indicadores`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);

$formmantiene=0;
$formcambia=0;

while($row = $Consulta->fetch_assoc()){
	$formula=$row['formula'];
	$ida=$row['id'];
	
	if($formula!=''){		
		preg_match_all("/\[.*?\]/", $formula, $coincidencias);
		foreach($coincidencias[0] as $coinc){
			$coincv = str_replace('[', '',$coinc);
			$coincv = str_replace(']', '',$coincv);
			if(substr($coincv,0,1)!='"'){//descarta los valores para carga de texto constante			
				if(isset($TRADUCCIONES['indicadores'][$coincv])){
					$nkey=$TRADUCCIONES['indicadores'][$coincv];
					$formula = str_replace($coinc, "[".$nkey."]" ,$formula);
				}else{
					$formula = '';
				}
			}	
		}
	}
	
	if($row['id_p_HIThitos_id_nombre_desde']>0&&isset($TRADUCCIONES['HIThitos'][$row['id_p_HIThitos_id_nombre_desde']])){
		$hdesde=$TRADUCCIONES['HIThitos'][$row['id_p_HIThitos_id_nombre_desde']];
	}else{
		$hdesde='';
	}

	if($row['id_p_HIThitos_id_nombre_hasta']>0&&isset($TRADUCCIONES['HIThitos'][$row['id_p_HIThitos_id_nombre_hasta']])){
		$hhasta=$TRADUCCIONES['HIThitos'][$row['id_p_HIThitos_id_nombre_hasta']];
	}else{
		$hhasta='';
	}
			
	$query="
	UPDATE
		`paneles`.`indicadores`
		set 
			`formula`='$formula',
			id_p_HIThitos_id_nombre_desde='$hdesde',
			id_p_HIThitos_id_nombre_hasta='$hhasta'
		
		WHERE 
			id='".$ida."'
			AND `zz_AUTOPANEL`='".$NID['panel']."'
	";
	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron actualizarse las fórmulas en indicadores en el nuevo panel");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);		
	}else{
		
		if($Conec1->affected_rows==0){
			$formmantiene++;
		}else{
			$formcambia++;
		}
	}	
}


 $Log['tx'][]= utf8_encode( $formcambia." fórmulas de indicadores actualizadas.");
 $Log['tx'][]= utf8_encode( $formmantiene." fórmulas de indicadores mantenidas.");

	//copiar graficos de indicadores
	$Log['tx'][]= utf8_encode("Se duplicarán los gráficos cargados.");	
	$query="
		INSERT INTO 
			`paneles`.`INDgra`
			(
			`tipo`,
			`titulo`,
			`zz_AUTOPANEL`,
			`publicacion`,
			`zz_AUTOIDCOPIA`
			)

		SELECT

		    `INDgra`.`tipo`,
		    `INDgra`.`titulo`,
		    '".$NID['panel']."',
		    `INDgra`.`publicacion`,
		    `INDgra`.`id`
			
		FROM 
			`paneles`.`INDgra`
	
		WHERE 
			`INDgra`.`zz_AUTOPANEL`='".$IDreferencia."'
		
	";

	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse los graficos");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);		
	}else{
		$Log['tx'][]= utf8_encode($Conec1->affected_rows." graficos copiados.");
		$query="
			SELECT 
			    id,
			   `zz_AUTOIDCOPIA`
			FROM
				`paneles`.`INDgra`
			WHERE 
				`INDgra`.`zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Consulta=$Conec1->query($query);
		while($row = $Consulta->fetch_assoc()){
			$TRADUCCIONES['INDgra'][$row['zz_AUTOIDCOPIA']]=$row['id'];
		}		
	}

	
	//copiar elementos de los gráficos de indicadores
	$Log['tx'][]= utf8_encode("Se duplicarán los elementos gráficos.");	
	
	$query="
		INSERT INTO `paneles`.`INDgraELEM`
			(
			`id_p_indicadores_id_indicador`,
			`id_p_INDgra`,
			`zz_AUTOPANEL`)

		SELECT
			
		    `INDgraELEM`.`id_p_indicadores_id_indicador`,
		    `INDgraELEM`.`id_p_INDgra`,
		     '".$NID['panel']."'
		    
		FROM
			`paneles`.`INDgraELEM`
	
		WHERE 
			`INDgraELEM`.`zz_AUTOPANEL`='".$IDreferencia."'
	";

	$Conec1->query($query);
	if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse los elementos para graficos");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);	
		terminar($Log);
	}else{
		 $Log['tx'][]=utf8_encode($Conec1->affected_rows." elementos para graficos copiados.");	
	}

	
		

//copiar lista de instancias para las comunicaciones
$query="
INSERT INTO 
	`paneles`.`comunestadoslista`
	(
	`estadio`,
	`descripcion`,
	`id_p_responsables_id_nombre`,
	`sentido`,
	`id_p_responsables_id_nombre_alerta`,
	`orden`,
	`requeridodefecto`,
	`id_p_grupos_id_nombre`,
	`zz_AUTOPANEL`,
	zz_AUTOIDCOPIA
	)
SELECT 
    `comunestadoslista`.`estadio`,
    `comunestadoslista`.`descripcion`,
    '',
    `comunestadoslista`.`sentido`,
    '',
    `comunestadoslista`.`orden`,
    `comunestadoslista`.`requeridodefecto`,
    '',
    '".$NID['panel']."',
    `comunestadoslista`.`id`
     
FROM 
	`paneles`.`comunestadoslista`
WHERE 
	`zz_AUTOPANEL`='".$IDreferencia."'

";
$Conec1->query($query);
if($Conec1->error!=''){
        $Log['mg'][]= utf8_encode("error: no pudieron copiarse las instancias para las comunicaciones");
        $Log['tx'][]= utf8_encode("<pre>".$query."</pre>");
        $Log['tx'][]= utf8_encode($Conec1->error);
        terminar($Log);	
		terminar($Log)	;
}else{
	$Log['tx'][]= utf8_encode($Conec1->affected_rows." instancias de las comunicaciones duplicadas.");
	
	$query="
		SELECT 
		    id,
		   `zz_AUTOIDCOPIA`
		FROM
			`paneles`.`comunestadoslista`
		WHERE 
			`comunestadoslista`.`zz_AUTOPANEL`='".$NID['panel']."'
	";
	$Consulta=$Conec1->query($query);
	while($row = $Consulta->fetch_assoc()){
		$TRADUCCIONES['comunestadoslista'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	}	
	
	
}

if($Completo=='SI'){
	//actualizar las definiciones asignadas a las documentaicones duplicadas
	
	$query="
		SELECT 
		   id,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_escala`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_rubro`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_planta`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_sector`,
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_tipologia`
		FROM
			`paneles`.`DOCdocumento`
		WHERE 
			`DOCdocumento`.`zz_AUTOPANEL`='".$NID['panel']."'
	";
	$Consulta=$Conec1->query($query);
	$Log['tx'][]= utf8_encode( $Consulta->num_rows. " documentos duplicados actualizando.");
	while($row = $Consulta->fetch_assoc()){
		$ida=$row['id'];
		
		if(isset($TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_escala']])){
			$esc=$TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_escala']];
		}else{
			$esc='';
		}

		if(isset($TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_rubro']])){
			$rub=$TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_rubro']];
		}else{
			$rub='';
		}
	
		if(isset($TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_planta']])){
			$pla=$TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_planta']];
		}else{
			$pla='';
		}
	
		if(isset($TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_sector']])){
			$sec=$TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_sector']];
		}else{
			$sec='';
		}

	
		if(isset($TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_tipologia']])){
			$tip=$TRADUCCIONES['DOCdef'][$row['id_p_DOCdef_id_nombre_tipo_tipologia']];
		}else{
			$tip='';
		}
								
		$query="
		UPDATE
			`paneles`.`DOCdocumento`
			set 
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_escala`='".$esc."',
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_rubro`='".$rub."',
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_planta`='".$pla."',
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_sector`='".$sec."',
			`DOCdocumento`.`id_p_DOCdef_id_nombre_tipo_tipologia`='".$tip."'
			
			WHERE 
				id='".$ida."'
				AND `zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse las definiciones de los documentos copiados");
			$Log['tx'][]= utf8_encode( $Conec1->error );		
			$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
			terminar($Log)	;
		}else{
			
			if($Conec1->affected_rows==0){
				$formmantiene++;
			}else{
				$formcambia++;
			}
		}	
	}
	$Log['tx'][]= utf8_encode( $formcambia." definicioens de coumentos actualizadas.");
	$Log['tx'][]= utf8_encode( $formmantiene." definicioens de coumentos mantenidas.");
	
	
//actualizar las comunicacioens y documentos asignados a las versiones
	
	$query="
	SELECT
		`DOCversion`.`id`,
		`DOCversion`.`id_p_DOCdocumento_id`,
		`DOCversion`.`id_p_comunicaciones_id_ident_entrante`,
		`DOCversion`.`id_p_comunicaciones_id_ident_aprobada`,
		`DOCversion`.`id_p_comunicaciones_id_ident_rechazada`,
		`DOCversion`.`id_p_comunicaciones_id_ident_anulada`,
		
		`DOCversion`.`zz_borrada`,
		`DOCversion`.`zz_AUTOFECHACREACION`,
		`DOCversion`.`zz_AUTOFECHAMODIF`
		
		FROM `paneles`.`DOCversion`			

		WHERE 
			`DOCversion`.`zz_AUTOPANEL`='".$NID['panel']."'
			AND `DOCversion`.`zz_borrada`='0'
			
	";
	$Consulta=$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse las versiones");
		$Log['tx'][]= utf8_encode( $Conec1->error );		
		$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
		terminar($Log)	;
	}
	
	
	//print_r($TRADUCCIONES['comunicaciones']);
	while($row = $Consulta->fetch_assoc()){
		//print_r($row);
		$ida=$row['id'];

		
		if(isset($TRADUCCIONES['DOCdocumento'][$row['id_p_DOCdocumento_id']])){
			$doc=$TRADUCCIONES['DOCdocumento'][$row['id_p_DOCdocumento_id']];
		}else{
			$doc='';
		}

		if(isset($TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_entrante']])){
			$ent=$TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_entrante']];
		}else{
			$ent='';
		}
	
		if(isset($TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_aprobada']])){
			$apr=$TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_aprobada']];
		}else{
			$apr='';
		}
		
		if(isset($TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_rechazada']])){
			$rec=$TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_rechazada']];
		}else{
			$rec='';
		}
		
		if(isset($TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_anulada']])){
			$anu=$TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_ident_anulada']];
		}else{
			$anu='';
		}				
								
		$query="
			UPDATE 
				`paneles`.`DOCversion`
			SET

				`id_p_DOCdocumento_id` = '".$doc."',
				`id_p_comunicaciones_id_ident_entrante` = '".$ent."',
				`id_p_comunicaciones_id_ident_aprobada` = '".$apr."',
				`id_p_comunicaciones_id_ident_rechazada` = '".$rec."',
				`id_p_comunicaciones_id_ident_anulada` = '".$anu."'
			
			WHERE 
				id='".$ida."'
				AND `zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse los documentos y cimunicaciones las vesriones");
			$Log['tx'][]= utf8_encode( $Conec1->error );
			$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
			terminar($Log)	;
		}else{
			
			if($Conec1->affected_rows==0){
				$formmantiene++;
			}else{
				$formcambia++;
			}
		}	
	}
	$Log['tx'][]= utf8_encode($formcambia." coms y doc de versiones actualizadas.");
	$Log['tx'][]= utf8_encode($formmantiene." coms y doc de versiones mantenidas.");


	//actualizar las comunicaciones de los estadods 
	
	$query="
		SELECT
		`comunestados`.`id`,
		`comunestados`.`id_p_comunicaciones_id_nombre`,
		`comunestados`.`id_p_comunestadoslista`
		
		FROM `paneles`.`comunestados`


		WHERE 
			`comunestados`.`zz_AUTOPANEL`='".$NID['panel']."'
			
	";
	$Consulta=$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse los estados de comunicaciones");
		$Log['tx'][]= utf8_encode( $Conec1->error );		
		$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
		terminar($Log)	;
	}

	
	//print_r($TRADUCCIONES['comunicaciones']);
	while($row = $Consulta->fetch_assoc()){
		//print_r($row);
		$ida=$row['id'];

		

		if(isset($TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_nombre']])){
			$com=$TRADUCCIONES['comunicaciones'][$row['id_p_comunicaciones_id_nombre']];
		}else{
			$com='';
		}
	
		if(isset($TRADUCCIONES['comunestadoslista'][$row['id_p_comunestadoslista']])){
			$est=$TRADUCCIONES['comunestadoslista'][$row['id_p_comunestadoslista']];
		}else{
			$est='';
		}
			
								
		$query="
			UPDATE 
				`paneles`.`comunestados`
			SET
				`comunestados`.`id_p_comunicaciones_id_nombre` = '".$com."',
				`comunestados`.`id_p_comunestadoslista` = '".$est."'

			WHERE 
				id='".$ida."'
				AND `zz_AUTOPANEL`='".$NID['panel']."'
		";
		$Conec1->query($query);
		if($Conec1->error!=''){
			$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse los estados de las coms");
			$Log['tx'][]= utf8_encode( $Conec1->error );
			$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
			terminar($Log)	;
		}else{
			
			if($Conec1->affected_rows==0){
				$formmantiene++;
			}else{
				$formcambia++;
			}
		}	
	}
	$Log['tx'][]= utf8_encode( $formcambia." estados de coms actualizadas.");
	$Log['tx'][]= utf8_encode( $formmantiene."estados de coms mantenidas.");



}



//actualiza las formulas asociadas a los hitos tipificados
$query="
	SELECT 
	    id,
	    formula
	FROM
		`paneles`.`HIThitos`
	WHERE 
		`HIThitos`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);

if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse las formulas de hitos");
	$Log['tx'][]= utf8_encode( $Conec1->error );		
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log)	;
}

while($row = $Consulta->fetch_assoc()){
	$formula=$row['formula'];
	$ida=$row['id'];	

	preg_match_all("/\[.*?\]/", $formula, $coincidencias);
	foreach($coincidencias[0] as $coinc){
		$coincv = str_replace('[', '',$coinc);
		$coincv = str_replace(']', '',$coincv);		
		$a=explode("|",$coincv);
		if($a[0]=='indicador'){
			$nkey=$TRADUCCIONES['indicadores'][$a[1]];
			$formula = str_replace($coinc, "[".$nkey."]" ,$formula);				
		}
	}		
					
	$query="
	UPDATE
		`paneles`.`HIThitos`
		set `formula`='$formula'
		WHERE id='".$ida."'
		AND `zz_AUTOPANEL`='".$NID['panel']."'
	";
	
	$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse las fórmulas en informes automaticos en el nuevo panel");
		$Log['tx'][]= utf8_encode( $Conec1->error );
		$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
		terminar($Log)	;
	}else{
		$Log['tx'][]= utf8_encode( $Conec1->affected_rows." fórmulas de automatizacion de informes actualizadas.");
	}	
}



while($row = $Consulta->fetch_assoc()){
	$idind=$row['id_p_indicadores_id_indicador'];
	$idgra=$row['id_p_INDgra'];
	$ida=$row['id'];	
	if(!isset($TRADUCCIONES['indicadores'][$idind])){continue;}
	$nkey=$TRADUCCIONES['indicadores'][$idind];						
	$query="
	UPDATE 
		`paneles`.`INDgraELEM`
	SET
		`id_p_indicadores_id_indicador` = '".$nkey."',
		`id_p_INDgra` = '".$TRADUCCIONES['INDgra'][$idgra]."'
		
	WHERE 
		`id` = '".$ida."'
		AND `zz_AUTOPANEL`='".$NID['panel']."'
	";
	
	$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse los indicadores en elmenetos para grafcos");
		$Log['tx'][]= utf8_encode( $Conec1->error );
		$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
		terminar($Log)	;
	}else{
		$Log['tx'][]= utf8_encode( $Conec1->affected_rows." indicadores en elementos para gráficos actualizados.");
	}	
}



//copiar indicador de feriados
$query="
	SELECT	
		*
		FROM
		configuracion
		WHERE id_p_paneles_id_nombre='".$NID['panel']."'
		AND (zz_AUTOPANEL='".$NID['panel']."' OR zz_AUTOPANEL='-1')
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no se pudo acceder a la nueva configuración");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." copia de la configuración verificada:");
	$feriadoviejo=$Consulta->fetch_assoc();
	if(isset($TRADUCCIONES['indicadores'][$feriadoviejo['ind-feriado']])){
	$NID['indferiado'] = $TRADUCCIONES['indicadores'][$feriadoviejo['ind-feriado']];
	}else{
		$NID['indferiado']='';
	}
	$Log['tx'][]= utf8_encode( "Indicador de feriados".$NID['indferiado']);
}

$query="
	UPDATE	
		configuracion
		SET `ind-feriado`='".$NID['indferiado']."'
		WHERE id_p_paneles_id_nombre='".$NID['panel']."'
		AND (zz_AUTOPANEL='".$NID['panel']."' OR zz_AUTOPANEL='-1')
";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no se pudo actualizar el indicador de feriados");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." nueva configuración de indicador de feriados.");
}

if(isset($TRADUCCIONES['viejosindicadores'][$NID['indferiado']])){
//copiar dias feriados cargados en el indicador correspondiente
$query="
	INSERT INTO 
		`paneles`.`registros`
		(
			`fecha`,
			`autor`,
			`valor`,
			`texto`,
			`id_p_indicadores`,
			`zz_AUTOPANEL`,
			`zz_AUTOFECHACREACION`,
			`zz_AUTOUSUARIO`
		)
		
		SELECT 
		    `registros`.`fecha`,
		    '$UsuarioI',
		    `registros`.`valor`,
		    `registros`.`texto`,
		    '".$NID['indferiado']."',
		    ".$NID['panel'].",
		    '$HOY',
		    '$UsuarioI'
		FROM 
			`paneles`.`registros`
		WHERE
			id_p_indicadores='".$TRADUCCIONES['viejosindicadores'][$NID['indferiado']]."'
			AND 
				(fecha>='$HOY' OR fecha>='$Inicio')
			AND 
				`zz_borrada`='0'
			AND 
				zz_AUTOPANEL='$IDreferencia'
	";
$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no se pudieron copiar los diás feriados");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}elseif($Conec1->affected_rows=='0'){
	$Log['tx'][]= utf8_encode( "no se dectó ningún día feriado en el panlel base. Prosigue la copia sin diás feriados.");	
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");	
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." dias feriado duplicados.");
}
}

//copiar listado de visado interno de documentos
$query="
	INSERT INTO 
	`paneles`.`DOCvisados`
		(

		`nombre`,
		`zz_AUTOPANEL`,
		`requeridopordefecto`,
		`vencimiento`
		)
	SELECT 

	    `DOCvisados`.`nombre`,
	     ".$NID['panel'].",
	    `DOCvisados`.`requeridopordefecto`,
	    `DOCvisados`.`vencimiento`
	FROM 
		`paneles`.`DOCvisados`
	WHERE 
		DOCvisados.zz_AUTOPANEL='$IDreferencia'
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse las instancias de visado de la docuemtnación");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." instancias de visado de documentos.");
}




//copiar objetos de certificacion
$query="
	INSERT INTO 
		`paneles`.`CERobjetos`
		(
		`nombre`,
		`zz_AUTOPANEL`,
		`monto`,
		`id_p_paneles_id_nombre`,
		`seccion`,
		zz_AUTOIDCOPIA
		)
	SELECT 
		`CERobjetos`.`nombre`,
		'".$NID['panel']."',
		`CERobjetos`.`monto`,
		'".$NID['panel']."',
		grupos.`id`,
		`CERobjetos`.id
		
		FROM 
		`paneles`.`CERobjetos`
		
		LEFT JOIN
			grupos
			on grupos.zz_AUTOIDCOPIA=`CERobjetos`.`seccion`
			AND grupos .`id_p_paneles_id_nombre`='".$NID['panel']."'		
		
		WHERE 
			`CERobjetos`.`id_p_paneles_id_nombre`='".$IDreferencia."'
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los objetos de certificación");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." objetos de certificación copiados.");
}

// cargar traducción de objetos de certificación
$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`CERobjetos`
	WHERE 
		`CERobjetos`.`id_p_paneles_id_nombre`='".$NID['panel']."'
		AND `zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['objetos'][$row['zz_AUTOIDCOPIA']]=$row['id'];
}

// cargar los grupos asociados a cada certificacion
$query="
INSERT INTO 
	`paneles`.`CERsecciones`
	(
	`id_p_paneles_id_nombre`,
	`zz_AUTOPANEL`,
	`id_p_grupos_id_nombre`
	)
	SELECT 
	    '".$NID['panel']."',
	    '".$NID['panel']."',
	    grupos.id
	FROM 
		`paneles`.`CERsecciones`
	LEFT JOIN
			grupos
			on grupos.zz_AUTOIDCOPIA=`CERsecciones`.`id_p_grupos_id_nombre`
			AND grupos .`id_p_paneles_id_nombre`='".$NID['panel']."'	
	WHERE
		`CERsecciones`.`id_p_paneles_id_nombre`='".$IDreferencia."'
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse los grupos correspondientes a las certificaciones copiadas");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." grupos de certificaciones actualizados.");
}



//copiar asociacion entre certificaciones e indicadores
$query="
INSERT INTO 
	`paneles`.`CERindicadores`
	(
	`id_p_paneles_id_nombre`,
	`id_p_indicadores_id_nombre`,
	`id_p_CERobjetos_id_nombre`,
	`id_p_CERtipos_id_nombre`
	)
	SELECT
	    '".$NID['panel']."',
	    `CERindicadores`.`id_p_indicadores_id_nombre`,
	    `CERindicadores`.`id_p_CERobjetos_id_nombre`,
	    `CERindicadores`.`id_p_CERtipos_id_nombre`
	FROM `paneles`.`CERindicadores`
	
	LEFT JOIN
	indicadores 
		ON indicadores.zz_AUTOIDCOPIA=`CERindicadores`.`id_p_indicadores_id_nombre`
		AND indicadores.zz_AUTOPANEL='".$NID['panel']."'	
	LEFT JOIN	
	CERobjetos 
		ON CERobjetos.zz_AUTOIDCOPIA=`CERindicadores`.`id_p_CERobjetos_id_nombre`
		AND CERobjetos.zz_AUTOPANEL='".$NID['panel']."'	
	WHERE `CERindicadores`.`id_p_paneles_id_nombre` = '".$IDreferencia."'
";
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse las relaciones entre certificaciones e indicadores");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." relación enntre certificacioens e indicadores duplicadas.");
}



//copiar modelos de informe
$query="
	insert into 
		INFmodelo 
		(
			`id_p_paneles_id`,
			`periodicidad`,
			`desde`,
			`hasta`,
			`nombre`,
			`nprefijo`,
			`redaccion`,
			`caratulahtml`,
			`encabezadohtml`,
			`piehtml`,
			`css`,
			`zz_AUTOPANEL`,
			`zz_AUTOIDCOPIA`
		) 
		select 
		   '".$NID['panel']."',
		    `INFmodelo`.`periodicidad`,
		    '".$HOY."',
		    '',
		    `INFmodelo`.`nombre`,
		    `INFmodelo`.`nprefijo`,
		    `INFmodelo`.`redaccion`,
		    `INFmodelo`.`caratulahtml`,
		    `INFmodelo`.`encabezadohtml`,
		    `INFmodelo`.`piehtml`,
		    `INFmodelo`.`css`,
		    '".$NID['panel']."',
		    `INFmodelo`.`id`
		from
			 INFmodelo 
		where 
			`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los modelos de informe al nuevo panel");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." modelos de informe copiados.");
}


$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`INFmodelo`
	WHERE 
		`INFmodelo`.`id_p_paneles_id`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['modelos'][$row['zz_AUTOIDCOPIA']]=$row['id'];
}


//copiar secciones de informe
$query="
	INSERT INTO 
	`paneles`.`INFsecciones`
		(
		`nombre`,
		`id_p_INFmodelo_id`,
		`orden`,
		`usodesde`,
		`usohasta`,
		`permitetexto`,
		`permiteimagen`,
		`zz_AUTOPANEL`,
		`zz_AUTOIDCOPIA`
	)
SELECT 
    `INFsecciones`.`nombre`,
    `INFmodelo`.`id`,
    `INFsecciones`.`orden`,
    '".$HOY."',
    '',
    `INFsecciones`.`permitetexto`,
    `INFsecciones`.`permiteimagen`,
   	'".$NID['panel']."',
    `INFsecciones`.`id`   	
FROM 
	`paneles`.`INFsecciones`
	LEFT JOIN
	`paneles`.`INFmodelo` 
		ON INFmodelo.zz_AUTOIDCOPIA=`INFsecciones`.`id_p_INFmodelo_id`
		AND `INFmodelo`.`id_p_paneles_id`= '".$NID['panel']."'
		
WHERE
	`INFsecciones`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse las secciones de informe al nuevo panel");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." secciones de informe copiadas.");
}


$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`INFsecciones`
	WHERE 
		`INFsecciones`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['secciones'][$row['zz_AUTOIDCOPIA']]=$row['id'];
}


//copiar contenido automático en secciones de informe
$query="
	INSERT INTO 
		`paneles`.`INFseccionAUTO`
			(
				`tipo`,
				`formula`,
				`id_p_INFsecciones_id`,
				`zz_AUTOPANEL`,
				zz_AUTOIDCOPIA
			)
	
	SELECT 
	    `INFseccionAUTO`.`tipo`,
	    `INFseccionAUTO`.`formula`,
	    `INFsecciones`.`id`,
	   	'".$NID['panel']."',
	   	`INFseccionAUTO`.id
	FROM 
		`paneles`.`INFseccionAUTO`
	
	LEFT JOIN
		`paneles`.`INFsecciones` 
			ON INFsecciones.zz_AUTOIDCOPIA=`INFseccionAUTO`.`id_p_INFsecciones_id`	
			AND INFsecciones.`zz_AUTOPANEL`= '".$NID['panel']."'
	WHERE 
		`INFseccionAUTO`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los componentes automáticos de informe al nuevo panel");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	$Log['res']='err';
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." componentes automáticos de informe copiados.");
}

$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`INFseccionAUTO`
	WHERE 
		`INFseccionAUTO`.`zz_AUTOPANEL`='".$NID['panel']."'
";

$Consulta=$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron seleecionarse los componentes automáticos de informe al nuevo panel");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	$Log['res']='err';
	terminar($Log);
}

while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['INFseccionAUTO'][$row['zz_AUTOIDCOPIA']]=$row['id'];
}


//actualiza las formulas asociadas de las auto secciones
$query="
	SELECT 
	    id,
	    tipo,
	    formula
	FROM
		`paneles`.`INFseccionAUTO`
	WHERE 
		`INFseccionAUTO`.`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);

$fo=0;
$fi=0;
while($row = $Consulta->fetch_assoc()){
	$tipo=$row['tipo'];		
	$formula=$row['formula'];
	$ida=$row['id'];	
	if($tipo=='check'||$tipo=='indicadores'||$tipo=='indicadores histograma'){
		
		preg_match_all("/\[.*?\]/", $formula, $coincidencias);
		foreach($coincidencias[0] as $coinc){
			$coincv = str_replace('[', '',$coinc);
			$coincv = str_replace(']', '',$coincv);
			if(substr($coincv,0,1)!='"'){//descarta los valores para carga de texto constante			
				$nkey=$TRADUCCIONES['indicadores'][$coincv];
				$formula = str_replace($coinc, "[".$nkey."]" ,$formula);
				
			}	
		}
	}elseif($tipo=='informes'){		
		preg_match_all("/\[.*?\]/", $formula, $coincidencias);
		foreach($coincidencias[0] as $coinc){
			$coincv = str_replace('[', '',$coinc);
			$coincv = str_replace(']', '',$coincv);		
			$nkey=$TRADUCCIONES['modelos'][$coincv];
			$formula = str_replace($coinc, "[".$nkey."]" ,$formula);
		}
	}elseif($tipo=='fechas'){
		preg_match_all("/\[.*?\]/", $formula, $coincidencias);
		foreach($coincidencias[0] as $coinc){
			$coincv = str_replace('[', '',$coinc);
			$coincv = str_replace(']', '',$coincv);		
			$a=explode("|",$coincv);
			if($a[0]=='indicador'){
				$nkey=$TRADUCCIONES['indicadores'][$a[1]];
				$formula = str_replace($coinc, "[".$nkey."]" ,$formula);				
			}
		}		
	}
				
	$query="
	UPDATE
		`paneles`.`INFseccionAUTO`
		set `formula`='$formula'
		WHERE id='".$ida."'
		AND `zz_AUTOPANEL`='".$NID['panel']."'
	";
	
	$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]= utf8_encode( "error: no pudieron actualizarse las fórmulas en informes automaticos en el nuevo panel");
	$Log['tx'][]= utf8_encode( $Conec1->error );
		$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
		terminar($Log);
	}else{
		if($Conec1->affected_rows==0){
			$fo++;
		}else{
			$fi++;
		}
	}	
}

$Log['tx'][]= utf8_encode( $fi." fórmulas de automatizacion (secciones en informes) copiadas adapatadas al nuevo panel.");
$Log['tx'][]= utf8_encode( $fo." fórmulas de automatizacion (secciones en informes)  copiadas sin adapatación requerida.");
// copiar accesos
$query="
INSERT INTO `paneles`.`accesos`
	(
	`id_usuario`,
	`id_paneles`,
	`nivel`
	)
VALUES
	(
	'".$UsuarioI."',
	'".$NID['panel']."',
	'administrador'
	)
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudo crearse su permiso de acceso al panel, se ha creado pero no podrá acceder a el");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." se ha habilitado su acceso al panel creado.");
}	



//copiar secciones de PLANES NIVEL 1
$query="
	INSERT INTO 
		PLAn1
	(
		nombre, numero, descripcion, 
		zz_AUTOPANEL, 
		id_p_GRAactores, zz_preliminar, zz_publico, CO_color, 
		zz_borrada, zz_AUTOIDCOPIA
	)
	
	SELECT 
		nombre, numero, descripcion, 
		'".$NID['panel']."', 
		id_p_GRAactores, zz_preliminar, zz_publico, CO_color, 
		zz_borrada, id
	FROM 
		`paneles`.`PLAn1`
	WHERE
		`PLAn1`.`zz_AUTOPANEL`='".$IDreferencia."'
";

	
	
$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los planes de nivel 1");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." secciones de informe copiadas.");
}


// cargar traducción de PLANES NIVEL 1
$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`PLAn1`
	WHERE 
		`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['PLAn1'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	$TRADUCCIONES['viejosPLAn1'][$row['id']]=$row['zz_AUTOIDCOPIA'];
}


//copiar PLANES NIVEL 2
$query="
	INSERT INTO 
		`paneles`.`PLAn2`
	(
		nombre, numero, descripcion, 
		zz_AUTOPANEL, 
		id_p_GRAactores,
		id_p_PLAn1, 
		zz_preliminar, zz_publico, CO_color, 
		zz_borrada, 
		zz_AUTOIDCOPIA
	)
	
	SELECT 
		PLAn2.nombre, PLAn2.numero, PLAn2.descripcion, 
		'".$NID['panel']."', 
		PLAn2.id_p_GRAactores, 
		PLAn1.id,
		PLAn2.zz_preliminar, PLAn2.zz_publico, PLAn2.CO_color, 
		PLAn2.zz_borrada, 
		PLAn2.id
	FROM
		`paneles`.`PLAn2`
		
	LEFT JOIN
		PLAn1 ON PLAn1.zz_AUTOIDCOPIA = PLAn2.id_p_PLAn1 AND `PLAn1`.`zz_AUTOPANEL`='".$NID['panel']."'
		
	WHERE
		`PLAn2`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los planes de nivel 2");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	$Log['res']='err';
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." secciones de informe copiadas.");
}

// cargar traducción de PLANES NIVEL 2
$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`PLAn2`
	WHERE 
		`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['PLAn2'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	$TRADUCCIONES['viejosPLAn2'][$row['id']]=$row['zz_AUTOIDCOPIA'];
}


//copiar secciones PLANES NIVEL 3


$query="
	INSERT INTO 
		PLAn3
	(
		nombre, numero, descripcion, 
		zz_AUTOPANEL, 
		id_p_GRAactores,
		id_p_PLAn2, 
		zz_preliminar, zz_publico, CO_color, 
		zz_borrada, 
		zz_AUTOIDCOPIA
	)
	
	SELECT 
		PLAn3.nombre, PLAn3.numero, PLAn3.descripcion, 
		'".$NID['panel']."', 
		PLAn3.id_p_GRAactores, 
		PLAn2.id,
		PLAn3.zz_preliminar, PLAn3.zz_publico, PLAn3.CO_color, 
		PLAn3.zz_borrada, 
		PLAn3.id
	FROM 
		`paneles`.PLAn3
		
	LEFT JOIN
		PLAn2 ON PLAn2.zz_AUTOIDCOPIA = PLAn3.id_p_PLAn2 AND `PLAn2`.`zz_AUTOPANEL`='".$NID['panel']."'
			
	WHERE
		`PLAn3`.`zz_AUTOPANEL`='".$IDreferencia."'
";

$Conec1->query($query);
if($Conec1->error!=''){
	$Log['tx'][]= utf8_encode( "error: no pudieron copiarse los planes de nivel 3");
	$Log['tx'][]= utf8_encode( $Conec1->error );
	$Log['tx'][]= utf8_encode( "<pre>".$query."</pre>");
	
	
	terminar($Log);
}else{
	$Log['tx'][]= utf8_encode( $Conec1->affected_rows." secciones de informe copiadas.");
}


// cargar traducción de indicadores
$query="
	SELECT 
	    id,
	   `zz_AUTOIDCOPIA`
	FROM
		`paneles`.`PLAn3`
	WHERE 
		`zz_AUTOPANEL`='".$NID['panel']."'
";
$Consulta=$Conec1->query($query);
while($row = $Consulta->fetch_assoc()){
	$TRADUCCIONES['PLAn3'][$row['zz_AUTOIDCOPIA']]=$row['id'];
	$TRADUCCIONES['viejosPLAn3'][$row['id']]=$row['zz_AUTOIDCOPIA'];
}





//crear capeta de documentos
$nuevacarpeta="./documentos/p_".$NID['panel'];
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear las carpeta de documento...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "carpeta de documentos craeda");
}

//crear subcapeta de informes
$nuevacarpeta="./documentos/p_".$NID['panel']."/informes";
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear la subcarpeta informes...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "subcarpeta de informes creada");
}

//crear sub-sub-carpeta de complementos
$nuevacarpeta="./documentos/p_".$NID['panel']."/informes/complementos";
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear la subcarpeta de complemtentos para informaes...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "sub-carpeta de complementos creada");
}

//copia contenidos de la carpeta complementos
$desde = "./documentos/p_".$IDreferencia."/informes/complementos";
$hasta = "./documentos/p_".$NID['panel']."/informes/complementos";

$src= "./documentos/p_".$IDreferencia;
$archivos = glob("$src/*.*");

foreach($archivos as $a){
      $comandohasta = str_replace($desde,$hasta,$a);
      copy($a, $comandohasta);
}

//crear subcapeta de documentacion
$nuevacarpeta="./documentos/p_".$NID['panel']."/documentacion";
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear la subcarpeta documentacion...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "subcarpeta de documentación creada");
}

//crear subcapeta de tareas
$nuevacarpeta="./documentos/p_".$NID['panel']."/tareas";
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear la subcarpeta tareas...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "subcarpeta de tareas creada");
}

//crear subcapeta de adjuntos
$nuevacarpeta="./documentos/p_".$NID['panel']."/comunicaciones/adjuntos";
if(!mkdir($nuevacarpeta, 0777, true)) {
    die('error al crear la subcarpeta de adjuntos...cominiquese con su administrador');
}else{
	$Log['tx'][]= utf8_encode( "subcarpeta de adjuntos a las comunicaciones creada");
}


$Log['tx'][]= utf8_encode( "terminado el proceso de duplicación sin errores");
$Log['tx'][]= utf8_encode( "<a href='./panelgeneral.php?panel=".$NID['panel']."'>ir al nuevo panel</a>");

$Log['res']='exito';
terminar($Log);
