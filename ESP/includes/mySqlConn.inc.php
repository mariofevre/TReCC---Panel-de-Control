<?php


if (!isset($_SESSION['panelcontrol'])) {
	$_SESSION['panelcontrol'] = new ApplicationSettings();
}

$_SESSION['panelcontrol']->Conec1 = mysql_connect(
	$_SESSION['panelcontrol']->DATABASE_HOST, 
	$_SESSION['panelcontrol']->DATABASE_USERNAME, 
	$_SESSION['panelcontrol']->DATABASE_PASSWORD
)or die(
	mysql_error()
);

mysql_select_db(
	$_SESSION['panelcontrol']->DATABASE_NAME,$_SESSION['panelcontrol']->Conec1
)or die(
	mysql_error()
);
?>
