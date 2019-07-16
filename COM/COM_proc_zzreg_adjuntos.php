<?php 
/**
*
* consulta los adjuntos de una comunicación y genera información estática para minimizar el costo de reportes.
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

/**
*consultda por.
* COM_ed_guarda_adjunto
*
*requiere
*$_POST['idcom'] id de la comunicación a actualizar

*/

ini_set('display_errors', true);

$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'si',
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    terminar($Log); 
}

    $query="
 		SELECT 
        `COMdocumentos`.`id`,
	    `COMdocumentos`.`descripcion`,
	    `COMdocumentos`.`FI_nombreorig`
    FROM 
        `paneles`.`COMdocumentos`
	WHERE 
        id_p_comunicaciones_id = '".$_POST['idcom']."'
    AND
        `zz_AUTOPANEL`='".$PanelI."'
    AND
        `zz_borrada`='0'
 	";
	$ConsultaB=$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al consultar documentos asociados';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}
	
	$cant=0;
	$nombres='';
	
	while($rowB = $ConsultaB->fetch_assoc()){
        $cant++;
        $nombres.=$rowB['FI_nombreorig'].", ";
	}
	$Log['tx'][]='cantidad de adjunto: '.$cant;
	$nombres=substr($nombres,0,2);
	
	$query="
        UPDATE 
            `paneles`.`comunicaciones`
        SET
            `zz_reg_adjuntos_cant` = '".$cant."',
            `zz_reg_adjuntos_nombre` = '".$nombres."'
        WHERE 
            `id` = '".$_POST['idcom']."'
        AND
            `zz_AUTOPANEL`='".$PanelI."'
    ";
	$ConsultaB=$Conec1->query($query);
	if($Conec1->error!=''){
		$Log['tx'][]='error al actualiar los zz_reg_adjuntos';
		$Log['tx'][]=utf8_encode($query);
		$Log['tx'][]=utf8_encode($Conec1->error);
		$Log['res']='err';
		terminar($Log);
	}    
	
    $Log['data']['comunicacioneszzreg'][$_POST['idcom']]['zz_reg_adjuntos_cant']=$cant;
    $Log['data']['comunicacioneszzreg'][$_POST['idcom']]['zz_reg_adjuntos_nombre']=utf8_encode($nombres);

?>
