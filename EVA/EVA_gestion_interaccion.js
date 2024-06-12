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
	return;
	if(_DatosUsuarios.delPanel==undefined){return;}
	if(_DataConformidadesCargado=='no'){return;}
	if(_IdCnt=='' && _IdPag==''){return;}
	formularContratacion(_IdCnt,_IdPag);
}

function formularParticipante(_id_part){
	
	_form=document.querySelector('#form_participante');
	_form.setAttribute('activo','si');
	
	_form.querySelector('[name="id_part"]').value=_id_part;
	_form.querySelector('[name="nombre"]').value='';	
	_form.querySelector('[name="apellido"]').value='';	
	_form.querySelector('[name="numero"]').value='';
	
	if(_DataParticipantes[_id_part]!=undefined){
		_form.querySelector('[name="nombre"]').value=_DataParticipantes[_id_part].nombre;
		_form.querySelector('[name="apellido"]').value=_DataParticipantes[_id_part].apellido;
		_form.querySelector('[name="numero"]').value=_DataParticipantes[_id_part].numero;
	}	
}


function formularModeloInstancia(_id_mi){
	
	_form=document.querySelector('#form_modelo_instancia');
	_form.setAttribute('activo','si');
	
	_form.querySelector('[name="id_minst"]').value=_id_mi;
	_form.querySelector('[name="descripcion"]').value='';	
	_form.querySelector('[name="codigo"]').value='';	
	_form.querySelector('[name="nombre"]').value='';	
	_form.querySelector('[name="requerido_def"]').value='';	
	_form.querySelector('[name="id_p_EVAperiodos"]').value='';
	
	console.log(_DataModelosInstancias);
	if(_DataModelosInstancias[_id_mi]!=undefined){
		_form.querySelector('[name="id_minst"]').value=_id_mi;
		_form.querySelector('[name="descripcion"]').value=_DataModelosInstancias[_id_mi].descripcion;	
		_form.querySelector('[name="codigo"]').value=_DataModelosInstancias[_id_mi].codigo;	
		_form.querySelector('[name="nombre"]').value=_DataModelosInstancias[_id_mi].nombre;	
		_form.querySelector('[name="requerido_def"]').value=_DataModelosInstancias[_id_mi].requerido_def;	
		_form.querySelector('[name="id_p_EVAperiodos"]').value=_DataModelosInstancias[_id_mi].id_p_EVAperiodos;
	}	
}

function formularPeriodo(_id_pe){
	
	_form=document.querySelector('#form_periodo');
	_form.setAttribute('activo','si');
	
	_form.querySelector('[name="id_per"]').value=_id_pe;
	_form.querySelector('[name="ano"]').value='';	
	_form.querySelector('[name="nombre"]').value='';	
	
	if(_DataModelosInstancias[_id_pe]!=undefined){
		_form.querySelector('[name="id_per"]').value=_id_pe;
		_form.querySelector('[name="ano"]').value=_DataPeriodos[_id_pe].ano;	
		_form.querySelector('[name="nombre"]').value=_DataPeriodos[_id_pe].nombre;	
	}	
}


function formularInstancia(_idpart,_idim,_idper){
	
	_form=document.querySelector('#form_instancia');
	_form.setAttribute('activo','si');
	
	_id_inst=_DataInstanciasCruces[_idim][_idpart][_idper];
	
	_id_minst=_DataInstancias[_id_inst].id_p_EVAinstanciaModelo;
	
	//console.log(_idpart);
	//console.log(_DataParticipantes[_idpart]);
	_form.querySelector('[name="participante"]').innerHTML =  _DataParticipantes[_idpart].apellido + ', ';
	_form.querySelector('[name="participante"]').innerHTML += _DataParticipantes[_idpart].nombre;
	
	_form.querySelector('[name="instancia"]').innerHTML=_DataModelosInstancias[_id_minst].nombre;	
	_form.querySelector('[name="codigo"]').innerHTML=_DataModelosInstancias[_id_minst].codigo;
	
	
	/*
	if(_DataModelosInstancias[_id_minst].est_alerta=='1'){
		_form.querySelector('[name="est_alerta"]').cheked=true;	
	}else{
			
	}*/
	
	_form.querySelector('[name="id_inst"]').value=_id_inst;
	_form.querySelector('[name="cumplido"]').value='';	
	_form.querySelector('[name="observaciones"]').value='';	
	_form.querySelector('#listadopasos').innerHTML='';  
	_form.querySelector('[name="est_alerta"]').checked=false;
	//_form.querySelector('[name="id_p_EVAinstanciaModelo"]').value='';	
	//_form.querySelector('[name="id_p_EVAparticipante"]').value='';	
	//_form.querySelector('[name="id_p_EVAperiodos"]').value='';
	
	//console.log(_DataInstancias);
	if(_DataInstancias[_id_inst]!=undefined){
		_form.querySelector('[name="id_inst"]').value=_id_inst;		
		_form.querySelector('[name="cumplido"]').value=_DataInstancias[_id_inst].cumplido;
		_form.querySelector('[name="observaciones"]').value=_DataInstancias[_id_inst].observaciones;
		
		//_form.querySelector('[name="est_alerta"]').checked=_DataInstancias[_id_inst].est_alerta;	
		
		//console.log(_DataInstancias[_id_inst].est_alerta);
		if(_DataInstancias[_id_inst].est_alerta==1){
			//console.log('marca');
			_form.querySelector('[name="est_alerta"]').checked=true;	
		}
		//_form.querySelector('[name="id_p_EVAinstanciaModelo"]').value=_DataInstancias[_id_inst].id_p_EVAinstanciaModelo;
		//_form.querySelector('[name="id_p_EVAparticipante"]').value=_DataInstancias[_id_inst].id_p_EVAparticipante;
		//_form.querySelector('[name="id_p_EVAperiodos"]').value=_DataInstancias[_id_inst].id_p_EVAperiodos;
		
		for(_np in _DataPasosOrden){
			
			_id_paso=_DataPasosOrden[_np];
			_dat_paso=_DataPasos[_id_paso];
			
			_div=document.createElement('div');
			_div.setAttribute('id_paso',_id_paso);
			_form.querySelector('#listadopasos').appendChild(_div);  	
			
			_lab=document.createElement('label');
			_lab.setAttribute('class','nombre');
			_div.appendChild(_lab);
			_lab.innerHTML=_dat_paso.nombre+' ('+_dat_paso.avance_acc+')';
		
			_in=document.createElement('input');
			_div.appendChild(_in);
			_in.setAttribute('type','checkbox');
			_in.setAttribute('name','hecho');
			_in.setAttribute('onchange','actualizaAvancePasos()');
			_in.value='1';
			
			
			if(_DataInstancias[_id_inst].pasos[_id_paso] != undefined){
				if(_DataInstancias[_id_inst].pasos[_id_paso].hecho=='1'){
					_in.checked=true;
				}else{
					_in.checked=false;
				}
			}
			
			if(_dat_paso.usa_date_1==1){
				
				_lab3=document.createElement('label');
				_div.appendChild(_lab3);
				_lab3.innerHTML=_dat_paso.tit_date_1+':';
				
				_in=document.createElement('input');
				_div.appendChild(_in);
				_in.setAttribute('type','date');
				
				_in.setAttribute('name','date_1');	
				_in.value='0000-00-00';	
				
				if(_DataInstancias[_id_inst].pasos[_id_paso] != undefined){
					_in.value=_DataInstancias[_id_inst].pasos[_id_paso].date_1;
				}
			}
				
			if(_dat_paso.usa_num_1==1){
				
				_lab1=document.createElement('label');
				_div.appendChild(_lab1);
				_lab1.innerHTML=_dat_paso.tit_num_1+':';
				
				_in=document.createElement('input');
				_div.appendChild(_in);
				_in.setAttribute('name','num_1');	
				
				_in.value='';	
				
				if(_DataInstancias[_id_inst].pasos[_id_paso] != undefined){
					_in.value=_DataInstancias[_id_inst].pasos[_id_paso].num_1;
				}
			
			}
			if(_dat_paso.usa_text_1==1){
				
				_lab2=document.createElement('label');
				_div.appendChild(_lab2);
				_lab2.innerHTML=_dat_paso.tit_text_1+':';
				
				_in=document.createElement('input');
				_div.appendChild(_in);
				_in.setAttribute('name','text_1');	
				
				_in.value='';	
				
				if(_DataInstancias[_id_inst].pasos[_id_paso] != undefined){
					_in.value=_DataInstancias[_id_inst].pasos[_id_paso].text_1;
				}
			}
		}
	}
	
	_form.querySelector('#adjuntoslista').innerHTML='';
	
	for(_na in _DataInstancias[_id_inst].adjuntosOrden){
		_idadj=_DataInstancias[_id_inst].adjuntosOrden[_na];
		_dat_adj=_DataInstancias[_id_inst].adjuntos[_idadj];
		
		_div=document.createElement('div');
		_div.setAttribute('id_adj',_idadj);
		_form.querySelector('#adjuntoslista').appendChild(_div);  	
		
		_a=document.createElement('a');
		_div.appendChild(_a);
		_a.setAttribute('download',_dat_adj.FI_nombreorig);
		_a.setAttribute('href',_dat_adj.FI_documento);
		_a.innerHTML=_dat_adj.FI_nombreorig;
		
		_in=document.createElement('input');
		_div.appendChild(_in);
		_in.value=_dat_adj.descripcion;
		
		_ab=document.createElement('a');
		_div.appendChild(_ab);
		_ab.setAttribute('id','boton_marca_borrar');
		_ab.setAttribute('onclick','marcarBorrarAdjunto('+_idadj+')');
		_ab.innerHTML='[X]';
		
		_ab=document.createElement('a');
		_div.appendChild(_ab);
		_ab.setAttribute('id','boton_desmarca_borrar');
		_ab.setAttribute('onclick','desMarcarBorrarAdjunto('+_idadj+')');
		_ab.innerHTML='[+]';
		
		_sp=document.createElement('span');
		_div.appendChild(_sp);
		_sp.innerHTML='[borrando]';		
		
	}	
}

function actualizaAvancePasos(){
	
	_inps=document.querySelectorAll('#form_instancia #listadopasos input[name="hecho"]:checked');
	_max_av=0;
	for(_ni in _inps){
		if(typeof _inps[_ni] != 'object'){continue;}
		_idp=_inps[_ni].parentNode.getAttribute('id_paso');
		_av_acc=_DataPasos[_idp].avance_acc;
		_max_av=Math.max(_max_av,_av_acc);	
	}
	document.querySelector('#form_instancia input[name="cumplido"]').value=_max_av;
}
function cerrarForm(_iddiv){
	_div=document.querySelector('#'+_iddiv);
	_div.setAttribute('activo','no');
}

function limpiarFormParticipantes(){
	//TODO
	document.querySelector('#form_participante [name="id_part"]').value='';
}
function limpiarFormModeloInstancia(){
	//TODO
	document.querySelector('#form_modelo_instancia [name="id_minst"]').value='';
}
function limpiarFormInstancia(){
	//TODO
	document.querySelector('#form_instancia [name="id_inst"]').value='';
}

function marcarBorrarAdjunto(_idadj){
	_div=document.querySelector('#adjuntoslista [id_adj="'+_idadj+'"]');
	_div.setAttribute('borrar','si');
}
function desMarcarBorrarAdjunto(_idadj){
	_div=document.querySelector('#adjuntoslista [id_adj="'+_idadj+'"]');
	_div.setAttribute('borrar','no');
}

document.querySelector('#pega_imagen').addEventListener("focus", (event) => {
	/*
	const end = document.querySelector('#pega_imagen').length;
	document.querySelector('#pega_imagen').setSelectionRange(end, end);*/
	
});

window.addEventListener('load', function (e) {
    var node = document.getElementById('pega_imagen');
    node.onpaste = function (e) {
    	node.innerHTML='';
        log('paste');
        if (e.clipboardData) {
            log('event.clipboardData');
            if (e.clipboardData.types) {
                log('event.clipboardData.types');

                // Look for a types property that is undefined
                if (!isArray(e.clipboardData.types)) {
                    log('event.clipboardData.types is undefined');
                }

                // Loop the data store in type and display it
                var i = 0;
                while (i < e.clipboardData.types.length) {
                    var key = e.clipboardData.types[i];
                    var val = e.clipboardData.getData(key);
                    log((i + 1) + ': ' + key + ' - ' + val);
                    i++;
                }

            } else {
                // Look for access to data if types array is missing 
                var text = e.clipboardData.getData('text/plain');
                var url = e.clipboardData.getData('text/uri-list');
                var html = e.clipboardData.getData('text/html');
                log('text/plain - ' + text);
                if (url !== undefined) {
                    log('text/uri-list - ' + url);
                }
                if (html !== undefined) {
                    log('text/html - ' + html);
                }
            }
        }

        // IE event is attached to the window object
        if (window.clipboardData) {
            log('window.clipboardData');
            // The schema is fixed
            var text = window.clipboardData.getData('Text');
            var url = window.clipboardData.getData('URL');
            log('Text - ' + text);
            if (url !== null) {
                log('URL - ' + url);
            }
        }

        // Needs a few msec to excute paste
        window.setTimeout(logContents, 50, true);
    };
	
	/*
    // Button events
   var btn = document.getElementById('clear-logs');
   btn.onclick = function (e) {
        clearLog();
    };*/
});


function logContents() {
    var node = document.getElementById('pega_imagen');
    log('Current contents - ' + node.innerHTML);    
	document.getElementById('portapapeles').value=document.getElementById('pega_imagen').childNodes[0].src;
	document.querySelector('#pega_imagen').innerHTML=document.querySelector('#pega_imagen_modelo').innerHTML;
	document.querySelector('#pega_imagen').blur();
	guardaCapturaComoAdjunto(); 
}

function log(str) {
	/*
    node = document.getElementById('log-box');
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(str));
    node.appendChild(li);*/
}

function clearLog() {
    var node = document.getElementById('log-box');
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function isArray(obj) {
    return obj && !(obj.propertyIsEnumerable('length')) && 
        typeof obj === 'object' && typeof obj.length === 'number';
}



function  tecleoGeneral(_ev){
	
	console.log(_ev.keyCode);
	
	_forms=Array();
	_forms.push(document.querySelector('form#form_instancia[activo="si"], form#form_modelo_instancia[activo="si"]'));
	
	if(_ev.keyCode=='27'){
				
		for(_i in _forms){
			if(typeof _forms[_i] !='object'){continue;}
			_at_activo=_forms[_i].getAttribute('activo');
			if(_at_activo=='si'){
				cerrarForm(_forms[_i].getAttribute('id'));
				return;		
			}
		}
		
	}else if(_ev.keyCode=='13'){
		
		if(document.activeElement.tagName == 'TEXTAREA'){
			//console.log('ii');
			return;
		}
		
		
		for(_i in _forms){
			if(typeof _forms[_i] !='object'){continue;}
			_at_activo=_forms[_i].getAttribute('activo');
			if(_at_activo=='si'){
				console.log(document.activeElement.tagName);
				
				_forms[_i].querySelector('.guardar').click();
				return;		
			}
		}
		
	}
	
}
