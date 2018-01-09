<?php 


function cargaPanel($PanelI){
	global $UsuarioI;
	$query="
		SELECT * 
		FROM paneles 
		LEFT JOIN accesos ON accesos.id_paneles = paneles.id 
		LEFT JOIN paneles.configuracion ON configuracion.id_p_paneles_id_nombre = paneles.id
		WHERE 
			paneles.id ='".$PanelI."' 
		AND accesos.id_usuario='".$UsuarioI."'
	";
		
	$ConPan = mysql_query($query, $_SESSION['panelcontrol'] -> Conec1);
	echo mysql_error( $_SESSION['panelcontrol'] -> Conec1);
	
	// buscar el panel activo
	if (mysql_num_rows($ConPan) < 1) {
		echo "error accediendo como ".$UsuarioI.", a ".$PanelI."<br>"; 
		break;
	}else{
		$_SESSION['panelcontrol'] -> CONFIG = mysql_fetch_assoc($ConPan);
		$_SESSION['panelcontrol'] -> PANELI = $PanelI;	
	}
	
	
	//print_r($_SESSION['panelcontrol']);
}
	
?>
