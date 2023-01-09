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


function formularSubirComputo(){
	
	document.querySelector('#formadjuntarxlsx').setAttribute('estado','activo');
	document.querySelector('#formadjuntarxlsx #carga').setAttribute('estado','activo');
	document.querySelector('#formadjuntarxlsx #definiciones').setAttribute('estado','inactivo');
	
}
        

function abrirTARItCPT(){
		_iditcpt=document.querySelector('#formlinkcpttareas [name="idi"]').value;
		window.open('./TAR_seguimiento.php?iditcpt='+_iditcpt);
}

function formularEditarLinkCptTar(_idi){
	
	_form=document.querySelector('#formlinkcpttareas');
	_form.setAttribute('estado','activo');
	_form.querySelector('[name="idi"]').value=_idi;
	
	_form.querySelector('#item #numero').innerHTML=_DataComputos.items[_idi].numero;
	_form.querySelector('#item #nombre').innerHTML=_DataComputos.items[_idi].nombre;
	_form.querySelector('#item #cantidad').innerHTML=_DataComputos.items[_idi].cantidad;
	_form.querySelector('#item #unidad').innerHTML=_DataComputos.items[_idi].unidad;
	
	_lista=_form.querySelector('#listadolinks');
	_lista.innerHTML='';
	
	_cert_item_acc=0;
	console.log(_idi);
	for(_nl in _DataLinkTareas.itemslinksOrden[_idi]){
		
		console.log(_nl);
		_idl=_DataLinkTareas.itemslinksOrden[_idi][_nl];
		console.log(_idl);
		_ldat=_DataLinkTareas.itemslinks[_idi][_idl];
		_tdat=_DataLinkTareas.tareas[_ldat.id_tarea];
		
		_div= generarFilaLink();
		_lista.appendChild(_div);			
		_div.setAttribute('idlink',_ldat.id);
		
		_div.querySelector('[name="porc_item"]').value=_ldat.porc_item;		
		_cert_item_acc+=_ldat.porc_item;
		_div.querySelector('[name="porc_tarea"]').value=_ldat.porc_tarea;		
		_div.querySelector('[name="idtar"]').value=_ldat.id_p_TARtareas;	
		_div.querySelector('[name="nombretar"]').value=_DataLinkTareas.tareas[_ldat.id_p_TARtareas].codigo+'. '+_DataLinkTareas.tareas[_ldat.id_p_TARtareas].nombre;
		
		/*
		_sp=document.createElement('span');
		_div.appendChild(_sp);
		_sp.innerHTML='% de tarea ';
		
		_in=document.createElement('input');
		_div.appendChild(_in);
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','elegirTarea(this.parentNode.getAttribute("idlink"))');
		_in.setAttribute('onchange','guardarLinkTarea(this.parentNode.getAttribute("idlink"))');
		_in.value=_tdat.nombre;		
		
		_in=document.createElement('input');
		_div.appendChild(_in);
		_in.setAttribute('type','hidden');
		_in.value=_tdat.id;				
			*/	
	}	
}


function generarFilaLink(){
			
		_div=document.createElement('div');
				
		_sp=document.createElement('span');
		_div.appendChild(_sp);		
		_sp.innerHTML='Certifica';
		
		_in=document.createElement('input');
		_in.setAttribute('name','porc_item');
		_in.setAttribute('type','text');
		_in.setAttribute('onkeyup','guardarLinkTarea(this.parentNode.getAttribute("idlink"))');
		_in.setAttribute('onchange','guardarLinkTarea(this.parentNode.getAttribute("idlink"))');
		_div.appendChild(_in);
		
		_sp=document.createElement('span');
		_sp.setAttribute('id','autoporc_cpt');
		_div.appendChild(_sp);
		_sp.innerHTML='% con ';
		
		_in=document.createElement('input');
		_in.setAttribute('name','porc_tarea');
		_in.setAttribute('type','text');
		_in.setAttribute('onkeyup','guardarLinkTarea(this.parentNode.getAttribute("idlink"))');
		_div.appendChild(_in);	
		
		_sp=document.createElement('span');
		_sp.setAttribute('id','autoporc_tarea');
		_div.appendChild(_sp);
		_sp.innerHTML='';
		
		_sp=document.createElement('span');
		_div.appendChild(_sp);
		_sp.innerHTML='% de tarea ';
		
		_in=document.createElement('input');
		_div.appendChild(_in);
		_in.setAttribute('type','button');
		_in.setAttribute('name','nombretar');
		_in.setAttribute('onclick','elegirTarea(this.parentNode.getAttribute("idlink"))');
		_in.setAttribute('onchange','guardarLinkTarea(this.parentNode.getAttribute("idlink"))');
		_in.value='-elegir tarea-';
		
		_in=document.createElement('input');
		_in.setAttribute('name','idtar');
		_div.appendChild(_in);
		_in.setAttribute('type','hidden');
		
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('type','button');
		_in.setAttribute('name','elim');
		_in.setAttribute('value','X');
		_in.setAttribute('class','elimina');
		_in.setAttribute('onclick','eleminarLink(this.parentNode.getAttribute("idlink"))');
		_div.appendChild(_in);
		
		return _div;
}

function sumarFilaLinkCptTar(_idlink){

	_lista=document.querySelector('#formlinkcpttareas #listadolinks');
	_div= generarFilaLink();
	_div.setAttribute('idlink',_idlink);
	_lista.appendChild(_div);
	

}

function subFormlistaTareasTx(){
	
	document.querySelector('#formlinkcpttareas #ingresaListaTarTx').setAttribute('estado','activo');
	
	
	
}

function prelimiarTareaTx(){
	_sep=document.querySelector('#formlinkcpttareas #ingresaListaTarTx [name="separador"]').value;
	_tx=document.querySelector('#formlinkcpttareas #ingresaListaTarTx [name="listado"]').value;
	
	_arr=_tx.split(_sep);
	
	_definidas=Array();
	for(_an in _arr){
		for(_nt in _DataLinkTareas.tareas){
				//console.log(_DataLinkTareas.tareas[_nt].codigo+' vs '+_arr[_an]);
			if(_DataLinkTareas.tareas[_nt].codigo==_arr[_an]){
				console.log(_DataLinkTareas.tareas[_nt].nombre);
				_definidas.push(_DataLinkTareas.tareas[_nt].id);
			}
		}
	}
	_cant=_definidas.length;
	_piso=Math.floor(100/_cant);
	_resto=100-(_piso*_cant);
	
	document.querySelector('#formlinkcpttareas #ingresaListaTarTx #previsualizacion').innerHTML='';
	//alert('resto:'+_resto);
	_c=0;
	for(_nd in _definidas){
		_c++;
		_protolink=document.createElement('div');
		//alert((_c)+'vs'+_resto);
		if((_c)<=_resto){_v=_piso+1;}else{_v=_piso;}
		_protolink.innerHTML=_v+' % asignado a tarea: '+_DataLinkTareas.tareas[_definidas[_nd]].codigo+'. '+_DataLinkTareas.tareas[_definidas[_nd]].nombre;
		_protolink.setAttribute('porc_item',_v);
		_protolink.setAttribute('class','protolink');
		_protolink.setAttribute('id_tarea',_definidas[_nd]);
		document.querySelector('#formlinkcpttareas #ingresaListaTarTx #previsualizacion').appendChild(_protolink);
	}
}



function sumarIncidencias(){
	_links=document.querySelectorAll('#formlinkcpttareas #listadolinks > div');
	_accum=0;
	
	for(_nl in _links){
		if(typeof _links[_nl] != 'object'){continue;}
		
		if(_links[_nl].querySelector('[name="porc_item"]').value == 'undefined'){continue;}
		_accum+=parseInt(_links[_nl].querySelector('[name="porc_item"]').value);
	}
	
	document.querySelector('#formlinkcpttareas #incidenciaacumulada').innerHTML=_accum+' %';
}

function linksRepartirIgualesIncidencias(){
	_links=document.querySelectorAll('#formlinkcpttareas #listadolinks > div');
	_cant=0;
	for(_nl in _links){
		if(typeof _links[_nl] != 'object'){continue;}
		_cant++;
	}
	
	_piso=Math.floor(100/_cant);
	_resto=100-(_piso*_cant);
	
	_c=0;
	for(_nl in _links){
		_c++;
		if((_c)<=_resto){_v=_piso+1;}else{_v=_piso;}
		_links[_nl].querySelector('[name="porc_item"]').value=_v;
		_links[_nl].querySelector('[name="porc_item"]').onchange();
	}	
	
	sumarIncidencias();
}


function procesarListadoTareas(){
	
	_protolinks=document.querySelectorAll('#formlinkcpttareas #ingresaListaTarTx .protolink');
	for(_np in _protolinks){
		if(typeof _protolinks[_np] != 'object'){continue;}
		_idi='';
		_idt=_protolinks[_np].getAttribute('id_tarea');
		_pi=_protolinks[_np].getAttribute('porc_item');
		
		consultaPreliminarLink(_idi,_idt,_pi,'');
		
		_protolinks[_np].parentNode.removeChild(_protolinks[_np]);
		
	}
	
}

function elegirTarea(_idlink){
	
	_otras=document.querySelectorAll('#formlinkcpttareas #listadolinks [asignandotarea="si"]');	
	for(_no in _otras){	
		if(typeof _otras[_no] != 'object'){continue;}
		_otras[_no].setAttribute('asignandotarea','no');
	}
	
	_filalink=document.querySelector('#formlinkcpttareas #listadolinks [idlink="'+_idlink+'"]');
	_filalink.setAttribute('asignandotarea','si');
	
	_subformtareas=document.querySelector('#formlinkcpttareas #listadotareas');
	_listatareas=document.querySelector('#formlinkcpttareas #listadotareas #lista');
	_listatareas.setAttribute('idlink',_idlink);
	
	if(_subformtareas.getAttribute('estado')=='activo'){return;}
	
	_subformtareas.setAttribute('estado','activo');
	_listatareas.innerHTML='';
	
	for(_nt in _DataLinkTareas.tareasOrden){
		
		 _idt=_DataLinkTareas.tareasOrden[_nt];
		 _datt=_DataLinkTareas.tareas[_idt];
		 
		_a=document.createElement('a');
		_a.setAttribute('nivel',_datt.nivel);
		_a.setAttribute('idtar',_idt);
		_a.setAttribute('onclick','elegirTareaAsignar(event,this.getAttribute("idtar"))');
		_listatareas.appendChild(_a);
		
		_sp=document.createElement('span');
		_a.appendChild(_sp);			
		_sp.innerHTML=_datt.codigo+' ';
		
		_sp=document.createElement('span');
		_a.appendChild(_sp);			
		_sp.innerHTML=_datt.nombre+' ';
		
		_sp=document.createElement('span');
		_a.appendChild(_sp);			
		_sp.innerHTML=_datt.descripcion+' ';
			
	}	
}


function elegirTareaAsignar(_event,_idtar){
	
	_listatareas=document.querySelector('#formlinkcpttareas #listadotareas #lista');
	//_listatareas.setAttribute('estado','inactivo');
	_idlink=_listatareas.getAttribute('idlink');
	_filalink=document.querySelector('#formlinkcpttareas #listadolinks [idlink="'+_idlink+'"]');
	_filalink.setAttribute('asignandotarea','no');
	
	document.querySelector('#formlinkcpttareas #listadolinks [idlink="'+_idlink+'"] [name="nombretar"]').value=_DataLinkTareas.tareas[_idtar].codigo+'. '+_DataLinkTareas.tareas[_idtar].nombre;
	document.querySelector('#formlinkcpttareas #listadolinks [idlink="'+_idlink+'"] [name="idtar"]').value=_idtar;
	document.querySelector('#formlinkcpttareas #listadolinks [idlink="'+_idlink+'"] [name="nombretar"]').onchange();
	
	if(_event.ctrlKey){
		_prox=_filalink.nextSibling;		
		
		if(_prox!=null){
			_nidlink=_filalink.nextSibling.getAttribute('idlink');			
			elegirTarea(_nidlink);
		}else{
			_modo='elegirtarea';
			consultaPreliminarLink(null,null,null,null,_modo);
		}		
	}	
}


function cerrarForm(_idform){
	
		document.querySelector('.subform#'+_idform+', .formCent#'+_idform).setAttribute('estado','inactivo');
		_inputs=document.querySelectorAll('.formCent#'+_idform+' input, .formCent#'+_idform+' textarea');
		for(_in in _inputs){
				if(typeof _inputs[_in] != 'object'){continue;}
				if(_inputs[_in].getAttribute('type') == 'submit'){continue;}
				if(_inputs[_in].getAttribute('type') == 'button'){continue;}
				
				if(_idform=='formdemas'){
					_inputs[_in].value='';
				}
				//_inputs[_in].value='';//TODO esto requiere un poco más de estudio para que no rompa los formularios
		}
		
}

function listaCopiaLinks(){
	_trs=document.querySelectorAll('#tabla tbody tr');
	_listado=document.querySelector('#formlinkcpttareas #listadoitems #lista');
	document.querySelector('#formlinkcpttareas #listadoitems').setAttribute('estado','activo');
	_listado.innerHTML='';
	for(_trn in _trs){
		
		if(typeof _trs[_trn]!='object'){continue;}
		
		
		_a=document.createElement('a');
		_a.setAttribute('iditem',_trs[_trn].getAttribute('iditem'));
		_a.setAttribute('onclick','consultaCopiaLinks(this.getAttribute("iditem"))');
		_listado.appendChild(_a);
		_nn=_trs[_trn].querySelector('#nu').cloneNode(true);
		_a.appendChild(_nn);
		_nn=_trs[_trn].querySelector('#co').cloneNode(true);
		_a.appendChild(_nn);
		_nn=_trs[_trn].querySelector('#no').cloneNode(true);
		_a.appendChild(_nn);
		
	}
}


function activarGeneraDemasias(){
	document.querySelector('.botonerainicial').setAttribute('generandodemasias','si');
	
	_trs = document.querySelectorAll('#tabla tr.item,#tabla tr.subrubro, #tabla tr.rubro');
	
	for(_ntr in _trs){
		if(typeof(_trs[_ntr])!='object'){continue;}
		_a=document.createElement('a');
		_a.innerHTML='<img src="./img/agregar.png">';
		_a.setAttribute('onclick','formularDemasia(this)');
		_a.setAttribute('class','botoncreademas');
		_trs[_ntr].querySelector('#no').appendChild(_a);
	}	
}
function desactivarGeneraDemasias(){
	_bts = document.querySelectorAll('#tabla .botoncreademas');	
	for(_bn in _bts){
		if(typeof _bts[_bn] != 'object'){continue;}
		_bts[_bn].parentNode.removeChild(_bts[_bn]);
	}
	document.querySelector('.botonerainicial').setAttribute('generandodemasias','no');
	document.querySelector('#formdemas').setAttribute('estado','inactivo');
	
}

function activarGeneraEconomias(){
	document.querySelector('.botonerainicial').setAttribute('generandoeconomias','si');
	_trs = document.querySelectorAll('#tabla tr.item');
	
	for(_ntr in _trs){
		if(typeof(_trs[_ntr])!='object'){continue;}
		_a=document.createElement('a');
		_a.innerHTML='<img src="./img/menos.png">';
		_a.setAttribute('onclick','formularEconomia(this)');
		_a.setAttribute('class','botoncreaecon');
		_trs[_ntr].querySelector('#no').appendChild(_a);
	}	
}
function desactivarGeneraEconomias(){
	_bts = document.querySelectorAll('#tabla .botoncreaecon');	
	for(_bn in _bts){
		if(typeof _bts[_bn] != 'object'){continue;}
		_bts[_bn].parentNode.removeChild(_bts[_bn]);
	}
	document.querySelector('.botonerainicial').setAttribute('generandoeconomias','no');
	document.querySelector('#formecon').setAttribute('estado','inactivo');
	
}


function formularEconomia(_this){
	
	_form=document.querySelector('#formecon');
	_form.setAttribute('estado','activo');
	_idit=_this.parentNode.parentNode.getAttribute('iditem');
	_idcomp=_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idcomp');
	_form.querySelector('[name="idcomputo"]').value=_idcomp;
	
	_form.querySelector('[name="iditem"]').value=_idit;
	_form.querySelector('[id="nombreitem"]').innerHTML=_DataComputos.items[_idit].numero+' - '+_DataComputos.items[_idit].nombre;
	_form.querySelector('[id="cantidadbase"]').innerHTML=_DataComputos.items[_idit].cantidad+' '+_DataComputos.items[_idit].unidad;
	_form.querySelector('[name="cantidadecon"]').value='';
	_form.querySelector('[id="cantidadres"]').innerHTML=_DataComputos.items[_idit].cantidad+' '+_DataComputos.items[_idit].unidad;

	_sel=_form.querySelector('[name="id_p_CPTcertificados"]');
	_sel.innerHTML='';
	for(_nc in _DataComputos.certificados){
		_cdat=_DataComputos.certificados[_nc];
		_op=document.createElement('option');
		_op.value=_cdat.id;
		_op.innerHTML=_cdat.numero+' - '+_cdat.nombre;
		_sel.appendChild(_op);
	}
	if(_CertificadoCargado.id!=undefined){
		_sel.value=_CertificadoCargado.id;
	}
}

function actualizabalancecantidad(_idform){
	_form=document.querySelector('#'+_idform);
	_idit=_form.querySelector('[name="iditem"]').value;
	_res = Number.parseFloat(_DataComputos.items[_idit].cantidad) - Number.parseFloat(_form.querySelector('[name="cantidadecon"]').value);
	_form.querySelector('[id="cantidadres"]').innerHTML=_res + ' ' +_DataComputos.items[_idit].unidad;
}



function formularDemasia(_this){
	
	_form=document.querySelector('#formdemas');
	_form.setAttribute('estado','activo');
	_form.setAttribute('modo',_this.parentNode.parentNode.getAttribute('class'));
	
	if(_this.parentNode.parentNode.getAttribute('class')=='rubro'){
		_idit='nuevo';
		_idrubro=_this.parentNode.parentNode.getAttribute('idrubro');
		_form.querySelector('[id="nombreitem"]').innerHTML='';
		_cantidadbase='0';
		
	}
	if(_this.parentNode.parentNode.getAttribute('class')=='item'){
		_idit=_this.parentNode.parentNode.getAttribute('iditem');
		_idrubro='';
		_form.querySelector('[id="nombreitem"]').innerHTML=_DataComputos.items[_idit].numero+' - '+_DataComputos.items[_idit].nombre;
		_cantidadbase=_DataComputos.items[_idit].cantidad;
		
	}
	_idcomp=_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idcomp');
	
	_form.querySelector('[name="idcomputo"]').value=_idcomp;
	
	_form.querySelector('[name="iditem"]').value=_idit;
	_form.querySelector('[name="idrubro"]').value=_idrubro;
	
	_form.querySelector('[id="cantidadbase"]').innerHTML=_cantidadbase;
	_form.querySelector('[name="cantidaddemas"]').value='';
	_form.querySelector('[id="cantidadres"]').innerHTML=_cantidadbase;

	_sel=_form.querySelector('[name="id_p_CPTcertificados"]');
	_sel.innerHTML='';
	for(_nc in _DataComputos.certificados){
		_cdat=_DataComputos.certificados[_nc];
		_op=document.createElement('option');
		_op.value=_cdat.id;
		_op.innerHTML=_cdat.numero+' - '+_cdat.nombre;
		_sel.appendChild(_op);
	}
	if(_CertificadoCargado.id!=undefined){
		_sel.value=_CertificadoCargado.id;
	}
}


function formularRubro(_this){
	
	_form=document.querySelector('#formrubro');
	_form.setAttribute('estado','activo');
	
	_idcomp=document.querySelector("#contenidoextenso #tabla").getAttribute('idcomp');
	
	_form.querySelector('[name="idcomputo"]').value=_idcomp;
	
	_form.querySelector('[name="numrubro"]').value="";
	_form.querySelector('[name="nomrubro"]').value="";	
	_form.querySelector('[name="descripcion"]').value="";
	
}



function actualizabalancedemasia(_idform){
	_form=document.querySelector('#'+_idform);
	
	if(_form.getAttribute('modo')=='item'){
		_idit=_form.querySelector('[name="iditem"]').value;
		_res = Number.parseFloat(_DataComputos.items[_idit].cantidad) + Number.parseFloat(_form.querySelector('[name="cantidaddemas"]').value);
		_form.querySelector('[id="cantidadres"]').innerHTML=_res + ' ' +_DataComputos.items[_idit].unidad;
	}else{

		_res =  Number.parseFloat(_form.querySelector('[name="cantidaddemas"]').value);
		_form.querySelector('[id="cantidadres"]').innerHTML=_res + ' ' +_form.querySelector('[name="unidad"]').value;
	}
}


function activarFiltroSobreCert(){
	
		document.querySelector('.botonerainicial').setAttribute('filtrar','sobrecertificado');
		document.querySelector('#tabla').setAttribute('filtrar','sobrecertificado');
}

function desactivarFiltro(){
		document.querySelector('.botonerainicial').setAttribute('filtrar','no');
		document.querySelector('#tabla').setAttribute('filtrar','no');
}

