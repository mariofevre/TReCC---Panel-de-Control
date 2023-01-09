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

function vaciarOpcionares(_event){
	
	if(_event!=undefined){
		//console.log(_event);
		//console.log(_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling);
		//console.log(_event.originalTarget);
		
		if(
			_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling==_event.originalTarget
			||
			_event.explicitOriginalTarget.parentNode.parentNode.previousSibling==_event.originalTarget
			){
			return;
		}
	}
	
	_vaciaresA=document.querySelectorAll('.auxopcionar');
	
	for(_nn in _vaciaresA){
		if(_vaciaresA[_nn].style!=undefined){
		//console.log(_vaciaresA[_nn]);
		_vaciaresA[_nn].style.display='none';
		}
	}
	
	_vaciares=document.querySelectorAll('.auxopcionar .contenido');
	for(_nn in _vaciares){
		_vaciares[_nn].innerHTML='';
	}
}

function cargaOpcion(_this){
	//console.log(_this);
	_regid=_this.getAttribute('regid');
	//console.log(_regid);
	_regnom=_this.innerHTML;
	//console.log(_regnom);
	_regtit=_this.title;	
			
	_inputN=_this.parentNode.parentNode.previousSibling;
	_inputN.title=_regtit;
	_inputN.value=_regnom;
	
	_inputN.focus();
	_id=_inputN.getAttribute('id');
	_ff=_id.substring(0,(_id.length-2));			
	//console.log(_ff);
	
	_input=document.getElementById(_ff);
	_input.value=_regid;
	
	if(_id.substring(0,14)=='cid_p_HIThitos'){
		actualizarFechaHito(_input);
	}					
}	





function cerrarInfo(_this){
_I=_this.parentNode.parentNode;
_I.removeChild(_this.parentNode);
setTimeout(function(){_I.setAttribute('onclick','info(this)');},100)	
}


function suscripcion(_event,_this){
	
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	//console.log(_this.value);
	//console.log(_event);
	if(_event.keyCode==110){
		 _nn = _this.value.lastIndexOf(".");
		 _res= _this.value.substr(0, _nn) + "," + _this.value.substr(_nn+1);
		 _this.value=_res;
		 //console.log(_res);
	}
	
	if(_event.keyCode==13){		
		_this.parentNode.querySelector('#estado').setAttribute('estado','cargando');
		_this.parentNode.querySelector('#estado').title='estado: se ha enviado el nuevo dato para guardarlo';
		guardarValor(_this);
	}else{
		_idind=document.querySelector('#formcent #cid').value;
		_inpid=_this.getAttribute('id');
		_v_nue=_this.value;
		_v_nue= _v_nue.replace('.','');
		_v_nue= _v_nue.replace(',','.');
		console.log(_this);
		console.log(_inpid);
		_fecha=_inpid.substring(1);
		_v_ant=DatosRegistros.registros[_idind][_fecha].valor;
		
		console.log(parseFloat(_v_nue)+'!='+parseFloat(_v_ant));
		
		if(parseFloat(_v_nue)!=parseFloat(_v_ant)){
			_this.setAttribute('actual','no');
		}else{
			_this.setAttribute('actual','si');			
		}
	}

}
	   
	
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


	function  filtrarOpciones(_this){
		_id=_this.getAttribute('id');
		_idref=_id.substring(0,(_id.length-2));
		document.getElementById(_idref).value='n';
		
		if(_this.value.length>2){
			_contenido=_this.nextSibling.querySelector('.contenido');			
			_list=_contenido.childNodes;
			//_list=_Opciones.id_p_HIThitos_id_nombre_desde
			for(_nn in _list){
				if(typeof _list[_nn]==object){
				_list[_nn].style.backgroundColor='transparent';
				//console.log(_list[_nn]);
				if(_list[_nn].innerHTML.toLowerCase().indexOf(_this.value.toLowerCase()) !== -1){				
					_list[_nn].style.backgroundColor='yellow';
					_contenido.insertBefore(_list[_nn], _contenido.firstChild);			
				}
				}
			}
		}
	}

	function cerrarForm(){
		
		
		
		
		_ins_pend=document.querySelectorAll('#formcent input[actual="no"]');		
		if(Object(_ins_pend).length > 0){
			if(!confirm('Si cierra este formulario ahora, perderá '+Object(_ins_pend).length+' valores de Datos que aún no guardó. \n Para guardarlos presione enter en cada celda. \n ¿Acepta cerrar en formulario?')){
				return;
			}
		}
		
		_form=document.getElementById('general');
		_inn=_form.querySelectorAll('input');
		for(_nn in _inn){
			if(typeof _inn[_nn]=='object'){
				if(_inn[_nn].getAttribute('fijo')=='fijo'){
					
				}else{
					_inn[_nn].value='';
				}
			}
		}

		_form.descripcion.value='';
		document.getElementById('cdescripcion').innerHTML='';
		document.getElementById('cnid').innerHTML='0000';
		document.getElementById('acarga').removeAttribute('indid');
		
		_ac=document.getElementById('acancelarElim');
		if(_ac!=undefined){_ac.parentNode.removeChild(_ac);}
		_ae=document.getElementById('aElim');
		if(_ae!=undefined){_ae.parentNode.removeChild(_ae);}
		document.getElementById('aactivaElim').style.display="inline-block";
		document.getElementById('formcent').style.display='none';
		document.querySelector('#cargavalores #contenido').innerHTML='';
	}


	function alterna(_id, _estado){
		if(_estado==false){
			document.getElementById(_id).value='0';
		}else if(_estado==true){
			document.getElementById(_id).value='1';
		}
	}


	function opcionarGrupos(_this){
		
		vaciarOpcionares();
		
		_this.nextSibling.style.display="inline-block";
		_destino=_this.nextSibling.querySelector(".contenido");
		_id=_this.getAttribute('id');
		_tipo=_id.substring(27,28);
		recargaDatosGrupos(_destino,_tipo);
		
	}


	function opcionarHitos(_this){
		vaciarOpcionares();		
		_this.nextSibling.style.display="inline-block";
		_destino=_this.nextSibling.querySelector(".contenido");
		_id=_this.getAttribute('id');
		
		_tipo=_id.substring(1,(_id.length-2));
		recargarHitos(_destino,_tipo);
	}	



	function activarEliminar(_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
            return;
		}
		_indId=_this.parentNode.parentNode.querySelector('#cid').value;
		
		_borrar=document.createElement('a');
		_borrar.setAttribute('class','cancelar');
		_borrar.setAttribute('id','acancelarElim');
		_borrar.setAttribute('onclick','cancelarEliminar(this);');
		_borrar.innerHTML="Cancelar";
		_this.parentNode.insertBefore(_borrar,_this);
		
		_borrar=document.createElement('a');
		_borrar.setAttribute('class','eliminar');
		_borrar.setAttribute('id','aElim');
		_borrar.setAttribute('onclick','enviarEliminar('+_indId+');');
		_borrar.innerHTML="Si, Borrar";
		_this.parentNode.insertBefore(_borrar,_this);

		_this.style.display='none';
	}


	function cancelarEliminar(_this){
		_conf=_this.nextSibling;
		_conf.parentNode.removeChild(_conf);
		_this.nextSibling.style.display='inline-block';
		_this.parentNode.removeChild(_this);
	}	
