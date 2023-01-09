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
	
if(_UsuarioTipo=='comercial' ||'comercial autonomo'){

}


function limpiaBarra(_event){
	document.querySelector("#barrabusqueda input").value='';
	actualizarBusqueda(_event);
}

function actualizarBusqueda(_event){	
	_input=document.querySelector("#barrabusqueda input");
	_str=_input.value;
	if(_str.length>=3){
		_input.parentNode.setAttribute('estado','activo');
	}else{
		_str='';
		_input.parentNode.setAttribute('estado','inactivo');
	}
	_str=_str.toLowerCase();
	console.log('buscando: '+_str);
	
	_lis=document.querySelectorAll('#contenidoextenso > a.paquete');	
	for(_ln in _lis){
		if(typeof _lis[_ln] != 'object'){continue;}
		_idp=_lis[_ln].getAttribute('idpan');
		
		if(
			_DataListado[_idp].nombre.toLowerCase().indexOf(_str)==-1
			&&
			_DataListado[_idp].descripcion.toLowerCase().indexOf(_str)==-1
		){				
			_lis[_ln].setAttribute('filtrado','si');
			
		}else{
			_lis[_ln].setAttribute('filtrado','no');
		}
	}	
}
function verControlMultiobra(){
	if(_UsuarioTipo != 'intratrecc'){
		alert('Su usuario de Panel de Control TReCC, no tiene permisos de seguimiento multipanel.');
		return;
	}else{
		alert('Función en desarrollo.');
	}
}

function formularNuevoPAN(){
	if(_UsuarioTipo != 'intratrecc'){
		alert('Su usuario de Panel de Control TReCC, no tiene capacidad para más paneles.\nSolicite mayor capacidad a:\n \t trecc@trecc.com.ar \no llamando a los teléfonos:\n \t (+5411) 4343-5264 \n \t (+5411) 4343-9007');
		return;
	}
	_form=document.querySelector('#formPAN');
	_form.reset();
	_form.style.display='block';		
}

function cerrar(_this){
	_this.parentNode.style.display='none';		
}


function formularusuario(){
	
	
	
	document.querySelector('#formusuario').style.display='block';
	document.querySelector('#formusuario [name="log"]').innerHTML=_UsuarioDat.perfil.log;
	document.querySelector('#formusuario input[name="nombre"]').value=_UsuarioDat.perfil.Nombre;
	document.querySelector('#formusuario input[name="apellido"]').value=_UsuarioDat.perfil.apellido;
	document.querySelector('#formusuario input[name="mail"]').value=_UsuarioDat.perfil.mail;
	document.querySelector('#formusuario input[name="password_act"]').value='';
	document.querySelector('#formusuario input[name="password_nue"]').value='';
	document.querySelector('#formusuario input[name="password_con"]').value='';
	
}

function cambiarPassword(){
	document.querySelector('#formusuario #cambiapass').style.display='block';
}

function tecleoGeneral(_event){
	if(document.activeElement.id=='barrabusquedaI'){
		rolarseleccion(_event);
	}else if(document.activeElement.getAttribute('class')=='paquete'){
		rolarseleccion(_event);
	}
}

function rolarseleccion(_event){
	
	if(_event.keyCode==40 || _event.keyCode==38){
		_event.preventDefault();
		_a=document.activeElement;
		if(_a.getAttribute('class')!='paquete'){			
			_a=document.querySelector('#contenidoextenso > a.paquete[filtrado="no"]');			
		}else{	
			for(_i=0;_i<1000;_i++){
				_a.removeAttribute('foco');			
				if(_event.keyCode==40){	
					_a=_a.nextSibling;
					if(_a==null||typeof _a != 'object'){
						_a=document.querySelector('#contenidoextenso > a.paquete[filtrado="no"]');		
					}
				}else if(_event.keyCode==38){
					_a=_a.previousSibling;
					if(_a==null||typeof _a != 'object'){
						_a=document.querySelector('#barrabusquedaI');		
					}
				}
								
				if(_a==null){return;}
				
				if(
					(
					_a.getAttribute('filtrado')=='no'
					&&
					_a.getAttribute('class')=='paquete'
					)
					||
					_a.id=='barrabusquedaI'
					
				){break;}
			}
		}
		
		_a.setAttribute('foco','enfoco');
		_a.focus();
		
	}
}

function enfocar(_this){
	_paqs=	document.querySelectorAll('#contenidoextenso .paquete[foco="enfoco"]');
	for(_np in _paqs){
		if(typeof _paqs[_np]!='object'){continue;}
		_paqs[_np].removeAttribute('foco');
	}
	_this.setAttribute('foco','enfoco');
	_this.focus();
}
