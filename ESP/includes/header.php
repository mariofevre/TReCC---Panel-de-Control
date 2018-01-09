<?php 
	header("Cache-control: private");
	include('./includes/panelaSettings.inc.php');
	session_start();
	if(!isset($_SESSION['panelcontrol'])){
		header('Location: ../login.php');
	}
	if(!isset($_SESSION['panelcontrol'] -> USUARIO)){
		header('Location: ../login.php');
	}
	if($_SESSION['panelcontrol'] -> USUARIO < 1){
		header('Location: ../login.php');
	}
	
	unset($_SESSION['dataglobal']['consultahitos']);//limpia el array que gurada consulta masivas
	unset($_SESSION['dataglobal']['indicadores']['resultados']);//limpia el array que guarda consulta masivas de la funcion indicadoresresultados()
				
	include_once("../comunes.php");// carga funciones comunes como la generación del mennu de navegacion			
				
	include_once("./includes/mensajesdesarrollo.php");// carga sistema de mensajes de desarrollo		
	include_once('../includes/cadenas.php');  // carga funciones para cadenas de caracteres
	include_once('../includes/fechas.php'); // carga funciones para fechas
	include_once('../includes/colores.php');  // carga funciones para colores
	include_once('../includes/PointInPol.php');// carga clase para calcular si un punto se encuentra dentro de un polígono  	

	include_once('./includes/preferencias.php');// gestiona les preferencias de usuario;  	

	include('./includes/mySqlConn.inc.php');
	
	$CODIGOELIMINACION = '-[-BORRX-]-';
	
	$Conec1 = $_SESSION['panelcontrol']->Conec1;
	$PanelI = $_SESSION['panelcontrol']->PANELI;

	registroLOG();	
?>
