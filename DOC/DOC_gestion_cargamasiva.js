/** este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2023 TReCC SA
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

//funciones para carga masiva de documentos.
function cargarOrigen(_this){
	if(_this!=undefined){
		if(_this.getAttribute('disabled')=='disabled'){
			return;
		}
	}
	
	_form=document.getElementById("editorArchivos");
	_form.querySelector('input[name="tipo"]').value='origen';	
	_form.style.display = 'block';			
	_form.querySelector('h1#tituloformulario').innerHTML='Generar Documentos automáticametne a partir de archivos';
	_form.querySelector('p#desarrollo').innerHTML='Cada archivo genera una nueva documentación en función del nombre de archivo o una nueva versión';
	
	_form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipoa"]').innerHTML='';
	_form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipob"]').innerHTML='';
	
	for(_ng in _Grupos){
		if(_Grupos[_ng].tipo=='a'){
			_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipoa"]');
			
		}else if(_Grupos[_ng].tipo=='b'){
			_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipob"]');
		}
		_anc=document.createElement('a');
		_anc.setAttribute('onclick','opcionar(this)');
		_anc.setAttribute('idgrupo',_Grupos[_ng].id);
		_anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
		_anc.innerHTML= _Grupos[_ng].nombre;
		_cont.appendChild(_anc);
	}
}




	function updateProgress(evt) {
	  if (evt.lengthComputable) {
	  		var percentComplete = 100 * evt.loaded / evt.total;		 
			this.li.querySelector('#barra').style.width=Math.round(percentComplete)+"%";
			this.li.querySelector('#val').innerHTML="("+Math.round(percentComplete)+"%)";
	  } else {
	    // Unable to compute progress information since the total size is unknown
	  }
	  
	}
