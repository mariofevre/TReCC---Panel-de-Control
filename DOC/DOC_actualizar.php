<?php
/**
* actualiza estad�sticas del m�dulos DOC. esta aplicaci�n es preliminar y deber�a generarse otra que no tenga dependencias
*
 * panelgeneral.php constituye la p�gina principal que opera como menu de accise a los distintos m�dulos 
 * y a las opciones de configuraci�n de cada panel activo.
 * Este men� carga dentro de marcos interiores los res�menes de distintos m�dulos brindando una s�ntesis general.
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los t�rminos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
*/

ini_set('display_errors', '1');
chdir(getcwd().'/../'); 
include ('./includes/header.php');

$Log=array();
$Log['data']=array();
$Log['tx']=array();
$Log['mg']=array();
$Log['res']='';
function terminar($Log){
	$res=json_encode($Log);
	if($res==''){$res=print_r($Log,true);}
	echo $res;
	exit;
}


if($_GET['panel']>0){
	$_SESSION['panelcontrol'] -> PANELI = $_GET['panel'];
}


$UsuarioI = $_SESSION['panelcontrol'] -> USUARIO;

if ($UsuarioI == "") {header('Location: ./login.php');
}
$Pase = $_SESSION['panelcontrol'] -> PASE;
$PanelI = $_SESSION['panelcontrol'] -> PANELI;
$Conec1=$_SESSION['panelcontrol'] -> Conec1;

include ('./registrousuario.php');//buscar el usuario activo.

if ($_GET['panel'] != '') {
	$PanelI = $_GET['panel'];
	$_SESSION['panelcontrol'] -> PANELI = $PanelI;
} else {
	$PanelI = $_SESSION['panelcontrol'] -> PANELI;
	
}

$Accion = $_GET[accion];
$Campo = $_GET[campo];
$Base = $_SESSION['panelcontrol'] -> DATABASE_NAME;
$Hoy=date("Y-m-d");

$filtrocampo = $_GET[filtrocampo];
/* filtrado en la b�squeda */
$filtroid = $_GET[filtroid];
/* filtrado en la b�squeda */


$_SESSION['panelcontrol'] -> McTi_Rdoc = microtime(true);		
//include_once('./documentos_consulta.php');
include_once('./DOC/DOC_consultas.php');
$ret=documentoconsulta();

$Log['tx'][]=$ret;
$Log['res']='exito';
terminar($Log);



?>