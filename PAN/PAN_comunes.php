<?php

//define variables generales para el análisi sde accesos
$Jerarquiasdeusuario['administrador']=10;
$Jerarquiasdeusuario['editor']=9;
$Jerarquiasdeusuario['auditor']=8;
$Jerarquiasdeusuario['visitante']=7;
$Jerarquiasdeusuario['relevador']=4;


$a['nom']='Indicadores';
$a['fil']='IND_reporte_ajax_wip.php';
$a['niv']=2;
$a['cod']='IND';
//$Modulos['reporte']=$a;
$Modulos[$a['cod']]=$a;
unset($a);

$a['nom']='Comunicaciones';
$a['fil']='COM_reporte.php';
$a['cod']='COM';
$a['niv']=2;
//$Modulos['comunicaciones']=$a;
$Modulos[$a['cod']]=$a;
unset($a);

$a['nom']='Informes';
$a['fil']='informe.php';
$a['doc']='informes';
$a['cod']='INF';
$a['niv']=2;
$Modulos['informe']=$a;
unset($a);


$a['nom']='Documentos';
$a['fil']='DOC_reporte.php';
$a['cod']='DOC';
$a['niv']=2;
//$Modulos['documentos']=$a;
$Modulos[$a['cod']]=$a;
unset($a);

$a['nom']='Tareas';
$a['fil']='TAR_gestion.php';
$a['cod']='TAR';
$a['niv']=2;
$Modulos['tareas']=$a;
unset($a);

$a['nom']='Hitos';
$a['fil']='HIT_listado.php';
$a['cod']='HIT';
$a['niv']=2;
//$Modulos['hitos']=$a;
$Modulos[$a['cod']]=$a;
unset($a);

$Modulos['panelgeneral']['nom']='Panel General';
$Modulos['panelgeneral']['niv']=1;

$Modulos['listado']['nom']='Listado de Paneles';
$Modulos['listado']['niv']=0;

$Modulos['REL']['nom']='Relevamientos';
$Modulos['REL']['fil']='REL.php';
$Modulos['REL']['doc']='relevamientos';
$Modulos['REL']['cod']='REL';
$Modulos['REL']['niv']=2;

$Modulos['COM']['nom']='Comunicaciones';
$Modulos['COM']['fil']='COM_gestion.php';
$Modulos['COM']['doc']='comunicaciones';
$Modulos['COM']['cod']='COM';
$Modulos['COM']['niv']=2;

$Modulos['PLA']['nom']='Planes de Gestión';
$Modulos['PLA']['fil']='PLA.php';
$Modulos['PLA']['doc']='planes';
$Modulos['PLA']['cod']='PLA';
$Modulos['PLA']['niv']=2;

$Modulos['CPT']['nom']='Computo y Avance de Obra';
$Modulos['CPT']['fil']='CPT.php';
$Modulos['CPT']['doc']='computoyavance';
$Modulos['CPT']['cod']='CPT';
$Modulos['CPT']['niv']=2;

$Modulos['ESP']['nom']='Especificaciones';
$Modulos['ESP']['fil']='ESP_listado.php';
$Modulos['ESP']['cod']='ESP';
$Modulos['ESP']['niv']=2;

$Modulos['SEG']['nom']='Seguimientos';
$Modulos['SEG']['fil']='SEG_listado.php';
$Modulos['SEG']['cod']='SEG';
$Modulos['SEG']['niv']=2;


$Modulos['PAN']['nom']='Panel';
$Modulos['PAN']['fil']='PAN_general.php';
$Modulos['PAN']['cod']='PAN';
$Modulos['PAN']['niv']=0;

$_SESSION['modulos']=$Modulos;
/* 
 * genera (echo) el menú de navigación en función del documetno php que lo llama
 * */
function insertarmenu(){
	ini_set('display_errors',true);
	global $Usuario, $PanelI;
	global $Modulos, $Jerarquiasdeusuario;
	//print_r($Usuario);
	//print_r($Modulos);		
	$e=explode("/",$_SERVER['PHP_SELF']);
	
	$e=end($e);
	$e=explode(".",$e);
	

	echo '<script type="text/javascript" src="./includes/FuncionesComunes.js"></script>';
	
	echo "<div class='recuadros' id='encabezado'>";
	if(isset($_SESSION['panelcontrol']->CONFIG)){
		echo $_SESSION['panelcontrol']->CONFIG['nombre'];
		$config = $_SESSION['panelcontrol']->CONFIG;
	}
	
	foreach($Modulos as $k => $v){
		if(strpos($e[0], $k)===0){
			echo "<br>Módulo: ".$Modulos[$k]['nom'];
			$Codigoactivo=$k;
		}		
	}
				
	echo "<br>hola: ".$Usuario['perfil']['Nombre']." ".$Usuario['perfil']['apellido'];
	echo "<br><a onclick='CerrarSesion()'>cerrar sesión</a>";

	foreach($Usuario['Niveles'] as $g => $nivs){
	
		foreach($nivs as $nn => $niv){
			if($niv['a']==0&&$niv['b']==0){
				echo "<br>acceso General: ".$g;
			}else{
				echo "<br>acceso Puntual: ".$g." ".$niv['a']." ".$niv['b'];
			}
		}
		
	}

	$e=explode("_",$e[0]);
	if(isset($Modulos[$e[0]])){
		if($Modulos[$e[0]]['niv']>0){
			echo"<br><a href='./PAN_listado.php'>ver Listado de Paneles</a>";
		}
		if($Modulos[$e[0]]['niv']<>1){
			echo"<br><a href='./PAN_general.php'>ver Panel General</a>";
		}
	}
	//print_r($config);
	if($PanelI>0 && $Modulos[$e[0]]['niv']>0){
			echo "<br>ver <select onchange='window.location=this.value;'>";
			//echo"<option value=''>- ??? -</option>";		
		foreach($Modulos as $m => $n){
			
			if($n['niv']==2){
				
				$kcod=strtolower($n['cod']).'-activo';
				
				if($config[$kcod]!='1'){continue;}
				if($n['cod']==$Codigoactivo){$selected="selected";}else{$selected='';}
				echo"<option $selected value='./".$n['fil']."'>".$n['nom']."</option>";
			}
		 
		}	
			echo "</select>";				
	}

	echo "</div>";
}


function validaracceso($ga,$gb){
	global $Usuario, $PanelI, $Jerarquiasdeusuario;
	//print_r($Usuario);
	//print_r($Usuario['Acc']);
	//echo "$ga y $gb";
	//$Usuario['Acc'][$ga].",".$Usuario['Acc'][$gb].",".$Usuario['Acc'][0]."_";
	$a=0;
	$b=0;
	$c=0;
	$d=0;
	if(isset($Usuario['Acc'][$ga])){
		$a=$Jerarquiasdeusuario[$Usuario['Acc'][$ga][0]];	
	}
	
	if(isset($Usuario['Acc'][$gb])){
		$b=$Jerarquiasdeusuario[$Usuario['Acc'][$gb][0]];
	}
	
	if(isset($Usuario['Acc'][0])){
		//print_r($Usuario['Acc'][0]);
		
		if(isset($Usuario['Acc'][0][0])){
			$c=$Jerarquiasdeusuario[$Usuario['Acc'][0][0]];
		}
		
		if(isset($Usuario['Acc'][0][$ga])){$a=$Jerarquiasdeusuario[$Usuario['Acc'][0][$ga]];}
		if(isset($Usuario['Acc'][0][$gb])){$b=$Jerarquiasdeusuario[$Usuario['Acc'][0][$gb]];}
		
	}
	if(isset($Usuario['Acc'][''])){$d=$Jerarquiasdeusuario[$Usuario['Acc']['']];}

	//echo $a.$b.$c;
	$NACC=max($a,$b,$c,$d);
	
	if($NACC > 5){
		return true;
	}else{
		//echo $NACC;
		//echo "false";
		//echo $Jerarquiasdeusuario[$Usuario['Acc'][$ga]].",".$Jerarquiasdeusuario[$Usuario['Acc'][$gb]].",".$Jerarquiasdeusuario[$Usuario['Acc']['']]."_";
		return false;
	}
}

?>
