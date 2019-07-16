<?php 
/**
* fechas.php
*
* fechas se incorpora en la carpeta includes 
* ya que contiene funciones genéricas de operación de cadenas (strings)
* 
* @package    	intraTReCC
* @subpackage 	Comun
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2010-2013 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) intraTReCC y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) paneldecontrol.
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


	if(isset($Config["ind-feriado"])){
		$idferiados=$Config["ind-feriado"];
		$query="
            SELECT *
                    FROM
                    registros
                WHERE 
                    id_p_indicadores = '$idferiados'
                AND 
                    zz_superado='0'
                AND 
                    zz_borrada='0'
                AND 
                    zz_AUTOPANEL ='".$PanelI."'
                AND
                    valor = '1'
                    
                ORDER BY 
                    fecha, id DESC 					
        ";
    $Consulta = $Conec1->query($query);
    if($Conec1->error!=''){
        $Log['tx'][]='error al consultar la base de feriados en'.__FILE__;
        $Log['tx'][]=$Conec1->error;
        $Log['tx'][]=$query;
        $Log['res']='error';
        terminar($Log);		
    }	
    $Feriados=array();
    While($row = $Consulta->fetch_assoc()){
        $Feriados[$row['fecha']]=$row['valor'];
    }
    
}
?>
