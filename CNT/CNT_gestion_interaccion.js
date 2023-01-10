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



function MesNaMesTxCorto(_mn){
	_meses=Array('err','ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic');
	return _meses[parseInt(_mn)];
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function toglecheck(_this){
	if(_this.getAttribute('for')!=undefined){
		
		console.log('es check');
		_for=_this.getAttribute('for');
		if(_this.checked==true){_val='1'}else{_val='0';}
		console.log(_val);
		_this.parentNode.querySelector('[name="'+_for+'"]').value=_val;
		console.log(_this.parentNode.querySelector('[name="'+_for+'"]'));
	}else{
		console.log('es hidden');
		_name=_this.getAttribute('name');
		if(_this.value==1){
			_this.parentNode.querySelector('[for="'+_name+'"]').checked=true;
		}else{
			_this.parentNode.querySelector('[for="'+_name+'"]').checked=false;					
		}
		
	}
	
}

function actualizaFechaEjecPago(){
	_val=document.querySelector('#formpago [name="fechaejecucion_tipo"]').value;
	
	if(_val=='desconocido'){
		document.querySelector('#formpago [name="fechaejecucion"]').style.display='none';
	}else if(_val=='previsto'){
		document.querySelector('#formpago [name="fechaejecucion"]').style.display='inline-block';
	}else if(_val=='efectivo'){
		document.querySelector('#formpago [name="fechaejecucion"]').style.display='inline-block';
	}else if(_val=='suspendido'){
		document.querySelector('#formpago [name="fechaejecucion"]').style.display='none';
	}
	
}
			
	
function consistenciaFecha(_this,_event){
	//console.log(_event);
	_campo=_this.getAttribute('name');
	_campot=_campo+'_tipo';
	_tipoInp=_this.parentNode.querySelector('[name="'+_campot+'"]');
	
	if(
		_this.value=='0000-00-000'
		||
		_this.value==null
		||
		_this.value==undefined
		||
		_this.value==''
	){
		_tipoInp.value='desconocida'
	}else if(
		_tipoInp.value=='desconocida'
	){
		if(_Hoy<=_this.value){
			_tipoInp.value='prevista'
		}else{
			_tipoInp.value='efectiva'
		}
	}
}

function opcionar(_this){
    _gid=_this.getAttribute('idReferencia');
    _ifor=_this.parentNode.parentNode.getAttribute('for');
    _gnom=_this.innerHTML;
    _this.parentNode.parentNode.parentNode.querySelector('input[name="'+_ifor+'_n"]').value=_gnom;
    _this.parentNode.parentNode.parentNode.querySelector('input[name="'+_ifor+'"]').value=_gid;
    _this.parentNode.parentNode.style.display='none';
}

function opcionNo(_this){
    _name=_this.getAttribute('name');
    _oname=_name.substr(0,(_name.length - 2));
    _this.parentNode.querySelector('input[name="'+_oname+'"]').value='n';
}

function opcionesSi(_this){
	_name=_this.getAttribute('name');
	_oname=_name.substr(0,(_name.length - 2));
	document.querySelector('form#general .opciones[for="'+_oname+'"]').style.display="block";	
}
function opcionesNo(_this){
	_name=_this.getAttribute('name');
	_oname=_name.substr(0,(_name.length - 2));
	document.querySelector('form#general .opciones[for="'+_oname+'"]').style.display="none";
}	

_selectos=0;

function agregainput(tracking){
    var nuevoinput = document.createElement('input');
    nuevoinput.setAttribute('id', 'i'+tracking);
    nuevoinput.setAttribute('type', 'text');
    nuevoinput.setAttribute("readOnly","true");
    nuevoinput.setAttribute('style', 'width:25px;');
    nuevoinput.setAttribute('name', tracking);
    nuevoinput.setAttribute('value', tracking);
    document.getElementById('formdepase').appendChild(nuevoinput);
    _selectos = _selectos + 1;
    document.getElementById('formcarga').innerHTML=_selectos;
    document.getElementById('formdepase').style.display='block';
}

function quitainput(tracking){
    input=document.getElementById('i'+tracking);
    document.getElementById('formdepase').removeChild(input);
    _selectos = _selectos - 1;
    document.getElementById('formcarga').innerHTML=_selectos;
    if(_selectos==0){document.getElementById('formdepase').style.display='none';}	
}

function titila(identificador){
    var elementos = document.getElementsByName(identificador);	 
    for (x=0;x<elementos.length;x++){
        if(elementos[x].style.display != 'none' ) {
            elementos[x].style.display = 'none';
        }else{
            elementos[x].style.display = '';
        }
    }
}

function tecleoGeneral(_event){

	if(
		document.querySelector('form#general').style.display=='none'
	){
		asignarFiltroUsuario('NO');
	}
	
	if(_event.keyCode==27){
		
		//console.log('es esc');
		if(typeof _StopTecleoEsc !== 'undefined'){//evita superposición con PAN_grupos_form.js
			//console.log('existe');
			//alert(_StopTecleoEsc);
			if(_StopTecleoEsc=='si'){
			//console.log('frenando');
			_StopTecleoEsc='no';
			return;
		}}
		
		document.querySelector('form#general').style.display='none';limpiarSeleccionContrataciones();
	}
}

function opcionesMenos(_this){
	_this.parentNode.querySelector('#mas').style.display='block';
	_this.parentNode.querySelector('#menos').style.display='none';
	_this.parentNode.querySelector('#fueradepanel, #inactivos').style.display='none';
}
function opcionesMas(_this){
	_this.parentNode.querySelector('#mas').style.display='none';
	_this.parentNode.querySelector('#menos').style.display='block';
	_this.parentNode.querySelector('#fueradepanel, #inactivos').style.display='block';
}


function filtrarUsuario(){
	_form=document.createElement('form');
	_form.setAttribute('id','filtro');
	_form.setAttribute('class','central');
	document.querySelector('body').appendChild(_form);
	
	_idusu = _DatosUsuarios.delPanelOrden[_nu];
	_op=document.createElement('a');
	_op.setAttribute('onclick','asignarFiltroUsuario("NO")');
	_op.innerHTML= "- MOSTRAR TODO -";
	_op.value=_idusu;
	_form.appendChild(_op);
	
	for(_nu in _DatosUsuarios.delPanelOrden){
   		_idusu = _DatosUsuarios.delPanelOrden[_nu];
   		_op=document.createElement('a');
   		_op.setAttribute('onclick','asignarFiltroUsuario("'+_idusu+'")');
   		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
   		_op.value=_idusu;
   		_form.appendChild(_op);
   	}
}

function asignarFiltroUsuario(_idusu){
	
	_Filtros.usuario=_idusu;
	
	if(_idusu=='YO'){
		_idusu=_UsuId;
	}
	
	_form=document.querySelector('form.central#filtro');
	if(_form!=null){
		_form.parentNode.removeChild(_form);
	}
	
	_segs=document.querySelectorAll('#contenidoextenso #contrataciones .fila.contratacion');
	for(_ns in _segs){
		if(typeof _segs[_ns] != 'object'){continue;}
		_segs[_ns].removeAttribute('filtro');				
	}
	
	_acc=document.querySelectorAll('.contenido.tareas .accion');
	for(_na in _acc){
		if(typeof _acc[_na] != 'object'){continue;}
		
		if(_idusu=='NO'){_acc[_na].removeAttribute('filtro');continue;}
		if(_acc[_na].getAttribute('idresp')==_idusu){
			_acc[_na].setAttribute('filtro','ver');
			_acc[_na].parentNode.parentNode.parentNode.setAttribute('filtro','ver');
		}else{
			_acc[_na].setAttribute('filtro','nover');
		}
	}
	
	_segs=document.querySelectorAll('#contenidoextenso #contrataciones .fila.contratacion');
	for(_ns in _segs){
		if(typeof _segs[_ns] != 'object'){continue;}
		if(_idusu=='NO'){_segs[_ns].removeAttribute('filtro');continue;}
		//_segs[_ns].style.color='red';
		
		if(_segs[_ns].getAttribute('idresp')==_idusu){
			_segs[_ns].setAttribute('filtro','ver');
		}else{
			console.log(_segs[_ns].getAttribute('filtro'));
			if(_segs[_ns].getAttribute('filtro')==null){
				_segs[_ns].setAttribute('filtro','nover');
			}
		}			
	}

}	


function tecleaBusqueda(_this,_event){
	
	if ( 
	
        _event.keyCode == '9'//presionó tab no es un nombre nuevo
        ||
        _event.keyCode == '13'//presionó enter
        ||
        _event.keyCode == '32'//presionó espacio
        ||
        _event.keyCode == '37'//presionó direccional
        ||
        _event.keyCode == '38'//presionó  direccional
        ||
        _event.keyCode == '39'//presionó  direccional
        || 
        _event.keyCode == '40'//presionó  direccional		  		
    ){
    	return;
    }
	
	console.log(_event.keyCode);
	if ( 
		_event.keyCode == '27'//presionó tab no es un nombre nuevo
	){
		document.querySelector('[name="busqueda"]').value='';
	}
		
	_val=document.querySelector('[name="busqueda"]').value;
				
	_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
	_hatch=_hatch.replace(/ /g, '');
	_hatch=_hatch.toLowerCase();
				
	_segs=document.querySelectorAll('#contenidoextenso #contrataciones .fila.contratacion');
	for(_ns in _segs){
		if(typeof _segs[_ns] != 'object'){continue;}
		
		console.log(_hatch.length);
		if(_hatch.length<2){
			_segs[_ns].setAttribute('filtroB','ver');
			continue;
		}
		
		
		_st=_segs[_ns].querySelector('.contenido.descrip').innerHTML;
		_st+=_segs[_ns].querySelector('.contenido.nombre').innerHTML;
		_st+=_segs[_ns].querySelector('.contenido.idcnt').innerHTML;
		_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_a').innerHTML;
		_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_a').title;
		_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_b').innerHTML;
		_st+=_segs[_ns].querySelector('.contenido.id_p_grupos_tipo_b').title;
		
		_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
		_st=_st.replace(/ /g, '');
		_st=_st.toLowerCase();
		
		
		//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
		if(_st.indexOf(_hatch)>=0){
			_segs[_ns].setAttribute('filtroB','vera');
		}else{
			_segs[_ns].setAttribute('filtroB','nover');
			console.log('nover');
		}
		
		_acc=_segs[_ns].querySelectorAll('.accion');
		for(_na in _acc){
			if(typeof _acc[_na] != 'object'){continue;}
			
			_st=_acc[_na].querySelector('.nombre').innerHTML;
			_st+=_acc[_na].title;
			
			_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
			_st=_st.replace(/ /g, '');
			_st=_st.toLowerCase();
				
			//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
			if(_st.indexOf(_hatch)>=0){
				_segs[_ns].setAttribute('filtroB','ver');
				_acc[_na].setAttribute('filtroB','ver');
			}else{
				_acc[_na].setAttribute('filtroB','nover');
			}					
		}		
	}
}

function actualizarCandidatosAccion(_this,_event){
	
	_hatch=_this.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
	_hatch=_hatch.replace(/ /g, '');
	_hatch=_hatch.toLowerCase();
	
	
	
	_items=document.querySelectorAll('#accion #candidatos #listado div');
	for(_ni in _items){
		if(typeof(_items[_ni]) != 'object'){continue;}
		
		if(_hatch==''){
			_items[_ni].setAttribute('selecto','no');
		}else{
			if(_items[_ni].getAttribute('hatch').indexOf(_hatch)>=0){
				_items[_ni].setAttribute('selecto','si');
			}else{
				_items[_ni].setAttribute('selecto','no');
			}
		}
	}
}

function cargarCandidatoAccion(_this){
	document.querySelector('#accion input[name="nombre"]').value=_this.innerHTML;
	_items=document.querySelectorAll('#accion #candidatos #listado div');
	for(_ni in _items){
		if(typeof(_items[_ni]) != 'object'){continue;}
		_items[_ni].setAttribute('selecto','no');				
	}
}


function actualizaGrupoTx(_this){
	_name = _this.getAttribute('name');
	_for=_name.substring(0, 18);
	_this.parentNode.querySelector('[name="'+_for+'"]').value='n';
	
	if(_this.value==''){
		_this.parentNode.querySelector('[name="'+_for+'"]').value='';
	}
	
}

function mostrarAdjunto(_this){
	
	_ruta='./documentos/p_'+_PanId+'/CNT/original/'+_this.getAttribute('ruta');
	window.open( _ruta,'_blank');

}	

function togleAbierto(_this){
	_stat=parseInt(_this.getAttribute('abierto'));
	_this.setAttribute('abierto',(_stat*-1));
}

function llamarElementosIniciales(){
	if(_DatosUsuarios.delPanel==undefined){return;}
	if(_DataConformidadesCargado=='no'){return;}
	if(_IdCnt=='' && _IdPag==''){return;}
	formularContratacion(_IdCnt,_IdPag);
}

function actualizarCss(){
	/*
	if($(window).width() < 1168) {
		//console.log('chico');
		document.querySelector('link#stlores').disabled=false;
	} else {
		//console.log('grande');
		document.querySelector('link#stlores').disabled=true;
	}
	//console.log(document.querySelector('link#stlores').disabled);
	//console.log(document.querySelector('link#stlores'));
	* */
}	
