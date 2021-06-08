/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2021 TReCC SA
* @source 		https://github.com/mariofevre/TReCC---Panel-de-Control/
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/


function filtrar(_this,_event){
    _event.preventDefault();
    _form = _this.parentNode.parentNode;
    _filtro.busqueda=_form.querySelector('input[name="busqueda"]').value;
    _filtro.sentido =_form.querySelector('input[name="sentido"]:checked').value;        
    _filtro.abiertas=_form.querySelector('input[name="abiertas"]:checked').value;
    if(_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked')!=null){
    	_filtro.grupoa  =_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked').value;
    }
    if(_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked')!=null){
    	_filtro.grupob  =_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked').value;
    }
    _filtro.orden   =_form.querySelector('select[name="orden"] option:checked').value;     
    cargarFilas();
}




