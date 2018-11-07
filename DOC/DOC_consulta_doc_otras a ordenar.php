<?php
/*
 * dirije una consulta ajax a una función php
 * 
 * 
 */
ini_set('display_errors', '1');
header("Cache-control: private");
chdir(getcwd().'/../'); 
include ('./includes/header.php');
include ('./registrousuario.php');//buscar el usuario activo.
include ('./DOC/DOC_consultas.php');//buscar el usuario activo.

ini_set('display_errors', '1');
$func = $_POST['funcion'];
iF(!isset($_POST['v1'])){$_POST['v1']='';}
iF(!isset($_POST['v2'])){$_POST['v2']='';}
$resultado=$func($_POST['v1'],$_POST['v2']);
$resA['res']='exito';

$resA['data']=$resultado;

$res=json_encode($resA);
if($res==''){
	print_r($resA);
}else{
	echo $res;
	//ini_set('display_errors', '1');
	//echo json_encode($resultado);
}
?>