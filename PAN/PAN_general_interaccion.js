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

function actualizarVisible(){
	if(_UsuarioAcc=='administrador'){
		document.querySelector('#columnados').setAttribute('visible','si');
	}else{
		document.querySelector('#columnados').setAttribute('visible','si');
	}
}


Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
        
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


function colorAlerta(_alerta){
	_r0=50;
	_r100=220;
	_g0=220;
	_g100=50;
	_b0=80;
	_b100=80;
	
	_r=(_alerta/100 * (_r100-_r0))+_r0;
	_g=(_alerta/100 * (_g100-_g0))+_g0;
	_b=(_alerta/100 * (_b100-_b0))+_b0;
					
	_rgb={
		'r':_r,
		'g':_g,
		'b':_b,
	}
	return(_rgb);
}



function secuenciaActualizacionResumenes(){
	
	_divmods = document.querySelectorAll('#columnauno > .modulo');
	
	for(_n in _divmods){
		
		if(typeof _divmods[_n] != 'object'){continue;}
		_mod=_divmods[_n].getAttribute('id');
		_act=_divmods[_n].getAttribute('actualizado');
		if(_act=='no'){
			//console.log('actualiza '+_mod);
			_ResumenesEnConsulta[_mod]='consultando';
			actualizar(_mod);
			_divmods[_n].setAttribute('actualizado','encurso');
			
			secuenciaActualizacionResumenes();

			return;
		}
		
	}
	
}	



function cerrarFormalerta(){
	_form=document.querySelector('#formalerta');
	_form.style.display='none';
}

function cerrarFormPublicacionesWeb(){
	_form=document.querySelector('#formPublicacionesWeb');
	_form.style.display='none';
}

function cerrarFormAnularConec(){
	_form=document.querySelector('#formAnularConec');
	_form.style.display='none';
}


function cerrarFormAcepConec(){
	_form=document.querySelector('#formAcepConec');
	_form.style.display='none';	
}
function cerrarformIniciarConec(){
	_form=document.querySelector('#formConec');
	_form.style.display='none';	
}

function cerrarFormConfig(){
	_form=document.querySelector('#formconfig');
	_form.style.display='none';
}

function cerrarFormPan(){
	_form=document.querySelector('#formPAN');
	_form.style.display='none';
}




function iraPub(_this){
	_idpub=_this.parentNode.querySelector('[name="idpub"]').value;
	window.open("./PUB_www/ini.php?p="+_idpub); 
}


function togle(_this){
	_name=_this.getAttribute('for');
	_inp=_this.parentNode.querySelector("[name='"+_name+"']");
	if(_this.checked){
		_inp.value='1';
	}else{
		_inp.value='0';
	}
}


	
	
function tecleoGeneral(_event){
	
	
	if(_event.keyCode=='27'){
		_event.preventDefault();
		cerrarFormalerta();
		cerrarFormPublicacionesWeb();
		cerrarFormAnularConec();
		cerrarFormAcepConec();
		cerrarFormConfig();
		cerrarFormPan();
	}
	
	if(
		document.activeElement.getAttribute('class')=='modulo'
		||
		document.activeElement.getAttribute('class')=='opcion'
		||
		document.activeElement.getAttribute('class')==null
		){
		rolarseleccion(_event);
	}	
}


function rolarseleccion(_event){
	
	//console.log(_event.keyCode);
	
	if(_event.keyCode==40 || _event.keyCode==38){
		_event.preventDefault();
		_a=document.activeElement;
		
		//console.log(_a.getAttribute('class'));
			
		if(_a.getAttribute('class')=='modulo'){
			
			_a.removeAttribute('foco');
			if(_event.keyCode==40){
				_a=_a.nextSibling;
				if(_a==null||typeof _a != 'object'){
					_a=document.querySelector('#columnauno > a.modulo');		
				}
			}else if(_event.keyCode==38){
				_a=_a.previousSibling;
				if(_a==null||typeof _a != 'object'){
					_aaa=document.querySelectorAll('#columnauno > a.modulo');
					_a=_aaa[(Object.keys(_aaa).length-1)];		
				}
			}
			if(_a==null){console.log('c');return;}
			
		}else if(_a.getAttribute('class')=='opcion'){
			
			_a.removeAttribute('foco');
			if(_event.keyCode==40){
				
				for(_i=0;_i<20;_i++){
					_a=_a.nextSibling;	
					if(_a==null){
						_a=document.querySelector('#columnados > a.opcion[visible="si"]');
						break;
					}
					if(_a.tagName==undefined){continue;}
					if(_a.getAttribute('visible')=='no'){continue;}
					if(_a.getAttribute('visible')=='si'){break;}
					
					
					
				}
				
				if(_a==null||typeof _a != 'object'){
					_a=document.querySelector('#columnados > a.opcion[visible="si"]');		
				}
				
			}else if(_event.keyCode==38){
				
				_a=_a.previousSibling;
				for(_i=0;_i<20;_i++){
					_a=_a.previousSibling;	
					if(_a==null){
						_aaa=document.querySelectorAll('#columnados > a.opcion[visible="si"]');
						_a=_aaa[(Object.keys(_aaa).length-1)];		
						break;
					}
					if(_a.tagName==undefined){continue;}
					if(_a.getAttribute('visible')=='no'){continue;}
					if(_a.getAttribute('visible')=='si'){break;}
				}
				
				if(_a==null||typeof _a != 'object'){
					_aaa=document.querySelectorAll('#columnados > a.opcion[visible="si"]');
					_a=_aaa[(Object.keys(_aaa).length-1)];		
				}
			}
			if(_a==null){console.log('c');return;}
			
		}else{
			_a=document.querySelector('#columnauno > a.modulo');
		}
		
		_a.setAttribute('foco','enfoco');
		_a.focus();
		
	}else if(_event.keyCode==37 || _event.keyCode==39){
		
		_event.preventDefault();
		_a=document.activeElement;
		_a.removeAttribute('foco');
		//console.log(_a.parentNode.id);
		if(_a.parentNode.id=='columnauno'){
			_b=document.querySelector('#columnados > a.opcion[visible="si"]');
			if(_b!=null){
				_a=_b;
			}
			
		}else if(	_a.parentNode.id=='columnados'){
			_a=document.querySelector('#columnauno > a.modulo');
		}
		_a.setAttribute('foco','enfoco');
		_a.focus();
	}
}

function enfocar(_this){
	_paqs=	document.querySelectorAll('#columnauno > .modulo[foco="enfoco"], #columnados > .opcion[foco="enfoco"]');
	for(_np in _paqs){
		if(typeof _paqs[_np]!='object'){continue;}
		_paqs[_np].removeAttribute('foco');
	}
	_this.setAttribute('foco','enfoco');
	_this.focus();
}

function muestradet(_det){
	_det.nextSibling.style.display="block"
	_rect=_det.nextSibling.getBoundingClientRect();
	console.log(window.innerHeight-(_rect.bottom ));
	if(window.innerHeight-(_rect.bottom )<40){
		console.log('o');
		_det.nextSibling.style.top=(window.innerHeight-(_rect.bottom )-40)+'px';
	}
}
function ocultadet(_det){
	_det.nextSibling.style.display="none";
	_det.nextSibling.style.top="0px";
}
