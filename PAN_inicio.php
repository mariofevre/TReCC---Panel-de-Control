<?php 
ini_set('display_errors', '1');
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
$Base = $_SESSION['panelcontrol']->DATABASE_NAME;
if($UsuarioI==""){echo "faltausuario";header('Location: ./login.php');}
function terminar(){
    echo "terminado";
}

include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.
if(count($Usuario['Paneles'])>1){
    header('Location: ./PAN_listado.php');
}elseif(count($Usuario['Paneles'])==1){
    header('Location:./PAN_general.php');
}else{	
    header('Location: ./login.php');
}
