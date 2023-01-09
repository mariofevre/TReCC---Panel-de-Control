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

	
////////////////////////////////////////////////////////
//funciones para manejar el fomrulario de configuración.
////////////////////////////////////////////////////////



function activarFormularioConf(){
	
	document.querySelector('#formconfig').style.display='block';
	_parametros=Array();
	$.ajax({
		data:  _parametros,
		url:   './PAN/PAN_general_consulta.php',
		type:  'post',
		success:  function (response) {
			//procesarRespuestaDescripcion(response, _destino);
			_res = PreprocesarRespuesta(response);

			for(_campo in _res.data.config){
				if(_campo == 'modulosactivos'){continue;}
				
				_inp=document.querySelector('#formconfig [name="'+_campo+'"]');
				if(_inp == null){continue;}
				_inp.value=_res.data.config[_campo];
			}
			
			for(_mod in _res.data.modulosactivos){
			
				_modStat=_res.data.modulosactivos[_mod];
				_modT=_mod.toLowerCase();
				
				_inputs=document.querySelectorAll('#formconfig input, #formconfig textarea');
									
				for(_nin in _inputs){
					//console.log( _modT);
					if(typeof _inputs[_nin] != 'object'){continue;}
					_ss=_inputs[_nin].getAttribute('name').split("-");
					if(_ss[1]=='activo'){continue;}
					if(_ss[0]!=_modT){continue;}
					if(_modStat=='1'){_inputs[_nin].style.display='inline-block';}
					if(_modStat=='0'){_inputs[_nin].style.display='none';}
				}

				_inputs=document.querySelectorAll('#formconfig label');                    
				for(_nin in _inputs){
					if(typeof _inputs[_nin] != 'object'){continue;}
					_ss=_inputs[_nin].getAttribute('for').split("-");
					if(_ss[1]=='activo'){continue;}
					if(_ss[0]!=_modT){continue;}
					if(_modStat=='1'){_inputs[_nin].style.display='inline-block';}
					if(_modStat=='0'){_inputs[_nin].style.display='none';}
				}
				
			}
			
			
			
			_inputs=document.querySelectorAll('#formconfig input[type="checkbox"]');                                            
			for(_nin in _inputs){
				if(typeof _inputs[_nin] != 'object'){continue;}
				_nam=_inputs[_nin].getAttribute('name');
				_val=_res.data.config[_nam];
				
				_ss=_inputs[_nin].getAttribute('name').split("-");
				
				if(_val==undefined){continue;}
				
				if(_val=='1'){
					_inputs[_nin].checked=true;                        	
				}else{
					_inputs[_nin].checked=false;
				}    
			}
				
		}
	});  
}

$("#formconfig input[type='checkbox']").on('change',function(_event){
	if(_event.currentTarget.checked==true){
		_event.currentTarget.value=1;
	}else{
		_event.currentTarget.value=0;
	}
	
});

function enviarFormConfig(){
	_form=document.querySelector('#formconfig');
	
	_inps=_form.querySelectorAll('input, textarea');
	_parametros={};
	for(_ni in _inps){
		if(typeof _inps[_ni] != 'object'){continue;}
		_parametros[_inps[_ni].getAttribute('name')]=_inps[_ni].value;            
	}
	
	$.ajax({
		data:  _parametros,
		url:   './PAN/PAN_ed_config.php',
		type:  'post',
		success:  function (response) {
			//procesarRespuestaDescripcion(response, _destino);
			_res = PreprocesarRespuesta(response);
			
			window.location.reload(); 
			
			
		}
	})
}
