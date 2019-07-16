<?php 
ini_set('display_errors', '1');
include ('./includes/header.php');
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
$Base = $_SESSION['panelcontrol']->DATABASE_NAME;
if($UsuarioI==""){echo "faltausuario";header('Location: ./login.php');}
function terminar(){
    echo "terminado";
}

include ('./login_registrousuario.php');
if(count($Usuario['Paneles'])>1){
    header('Location: ./PAN_listado.php');
}elseif(count($Usuario['Paneles'])==1){
    header('Location:./PAN_general.php');
}else{	
    header('Location: ./login.php');
}
