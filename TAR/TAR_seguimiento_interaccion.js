/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2022 TReCC SA
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



function desplazarFecha(_desplazamientoendias){
	// utiliza
		// _anchodia=5;
		// _anchogantt=500;
		// _barrido=_anchogantt/_anchodia;	
		// _diaInicio_rel = Math.round((-1)*_barrido/2);
		// _offset=((-1*_barrido/2)-_diaInicio_rel)*_anchodia;
		// _diaFin_rel = Math.round(_barrido/2);
		
	
	_desp= _desplazamientoendias * _anchodia;
	
	document.querySelector('#gantt #listado').style.left=_desp+'px';
	
	_txtos=document.querySelectorAll('#gantt #listado .tarea > #flotantetexto');
	
	for(_n in _txtos){
		
		if(typeof _txtos[_n] != 'object'){continue;}
		
		_txtos[_n].style.left=(-1*_desp)+'px';
	}
}




function formularPlan(){

	_idplan=_IdPlanActivo;
	document.querySelector('#formPlan').setAttribute('activo','si');
	document.querySelector('#formPlan [name="idplan"]').value=_idplan;
	document.querySelector('#formPlan [name="nombre"]').value=_DataPlanes[_idplan].nombre;
	document.querySelector('#formPlan [name="descripcion"]').value=_DataPlanes[_idplan].descripcion;
	document.querySelector('#formPlan [name="zz_superado"]').value=_DataPlanes[_idplan].zz_superado;
}



function formularSelectorLocal(_r,_p){
	document.querySelector('#formSelectorLocal').setAttribute('activo','si');
	_lr=document.querySelector('#formSelectorLocal #seccionrel .lista');
	_lp=document.querySelector('#formSelectorLocal #seccionplano .lista');
	_ll=document.querySelector('#formSelectorLocal #seccionlocal .lista');
	
	_lr.innerHTML='';
	_lp.innerHTML='';
	_ll.innerHTML='';
	
	
	for(_ir in _DataRelLocales.relevamientos){
		_a=document.createElement('a');
		_a.setAttribute('idr',_ir);
		_a.innerHTML=_DataRelLocales.relevamientos[_ir].nombre;
		_a.title=_DataRelLocales.relevamientos[_ir].descripcion;
		_lr.appendChild(_a);
	}
	
	for(_ip in _DataRelLocales.planos){
		_a=document.createElement('a');
		_a.setAttribute('idr',_DataRelLocales.planos[_ip].id_p_RELrelevamientos_id_nombre);
		_a.setAttribute('idp',_ip);
		_a.innerHTML=_DataRelLocales.planos[_ip].nombre;
		_a.title=_DataRelLocales.planos[_ip].descripcion;
		_lp.appendChild(_a);
	}
	
	for(_il in _DataRelLocales.locales){
		_a=document.createElement('a');
		_a.setAttribute('idp',_DataRelLocales.locales[_il].id_p_RELplanos);
		_a.setAttribute('idl',_il);
		_a.innerHTML=_DataRelLocales.locales[_il].nombre;
		_a.title=_DataRelLocales.locales[_il].descripcion;
		_ll.appendChild(_a);
	}
	
	_SelRel=_r;
	if(Object.keys(_DataRelLocales.relevamientos).length == 1){
		document.querySelector('#formSelectorLocal #seccionrel .lista > a').setAttribute('selecto','si');
		_SelRel=document.querySelector('#formSelectorLocal #seccionrel .lista > a').getAttribute('idr');
	}
	
	_aplanos=document.querySelectorAll('#formSelectorLocal #seccionplano .lista a');
	_c=0;
	for(_np in _aplanos){
		if(typeof _aplanos[_np] != 'object'){continue;}
		if(_aplanos[_np].getAttribute('idr') == _SelRel || _SelRel == ''){
			_aplanos[_np].getAttribute('viable','si')
			_c++;
		}else{
			_aplanos[_np].getAttribute('viable','no')
		}
	}
	
	_SelPla=_p;
	if(_c==1){
		document.querySelector('#formSelectorLocal #seccionplano .lista > a[viable="si"]').setAttribute('selecto','si');
		_SelPla=document.querySelector('#formSelectorLocal #seccionplano .lista > a[viable="si"]').getAttribute('idp');
	}
	
	_alocales=document.querySelectorAll('#formSelectorLocal #seccionlocal .lista a');
	_c=0;
	for(_nl in _alocales){
		if(typeof _alocales[_nl] != 'object'){continue;}
		if(_alocales[_nl].getAttribute('idr') == _SelRel || _SelRel == ''){
			
			if(_alocales[_nl].getAttribute('idp') == _SelPla || _SelPla==''){			
				_alocales[_nl].getAttribute('viable','si');
				_c++;
			}else{
				_alocales[_nl].getAttribute('viable','no');
			}
		}else{
			_alocales[_nl].getAttribute('viable','no');
		}
	}
}



function mostrarAdjunto(_this){	
	_ruta='./documentos/p_'+_PanId+'/TAR/original/'+_this.getAttribute('ruta');
	window.open( _ruta,'_blank');
}




function cerrarForm(_idform){
	
	document.querySelector('#'+_idform).setAttribute('activo','no');	
}

function muestraSlide(_slide){
	_name=_slide.getAttribute('name');
	_slide.parentNode.querySelector('#muestra_'+_name).innerHTML=_slide.value;
	
}


function activarAdjuntaXlsx(_modo){
	
	cerrarForm('formTareaObservacion');
	
	
	_form=document.querySelector('#formadjuntarmpp');
	_form.setAttribute('activo','si');
	_form.setAttribute('modo',_modo);
	if(_modo=='version'){
		_form.querySelector('input[name="idsel"]').value=_IdPlanActivo;
		_form.querySelector('#plansel').innerHTML= _DataPlanes[_IdPlanActivo].nombre;
	}else{
		_form.querySelector('input[name="idsel"]').value='';
		_form.querySelector('#plansel').innerHTML= '';
	}
}


/*
function mostrar(){
	$(".accionseleccion").css("color","black");
}

*/
/*
function titila(identificador,_cuenta,_texto){
	_a = _a + _cuenta;
	var elementos = document.getElementsByName(identificador);
	if(_cuenta==1){
		_seleccionv	= _seleccion; 
		_seleccion	= _seleccion + "_" +_texto;
	}else{
		_seleccionv	= _seleccion; 
		_seleccion = _seleccion.replace("_"+_texto, "");
	}
	
	if(_a>0){
		var _selectos = _seleccion.split('_'); 
		for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'block';
			
			_vieja=(elementos[x].href);
			elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
			
			for (y=0;y<_selectos.length;y++){
				if (elementos[x].getAttribute("incompatible")==_selectos[y]){
					elementos[x].style.display = 'none';
				}
			}
		}
	}else{
		for (x=0;x<elementos.length;x++){			
			elementos[x].style.display = 'none';
			_vieja=(elementos[x].href);
			elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
		}
	}
}

*/

function opcionar(_this){
	_gid=_this.getAttribute('idgrupo');
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
	document.querySelector('form#ejecucion .opciones[for="'+_oname+'"]').style.display="block";	
}

function opcionesNo(_this){
	_name=_this.getAttribute('name');
	_oname=_name.substr(0,(_name.length - 2));
	document.querySelector('form#ejecucion .opciones[for="'+_oname+'"]').style.display="none";
}	


function oculta(name){
	var elementos = document.getElementsByName(name);
	for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'none';
	}
}
function muestra(name){
	var elementos = document.getElementsByName(name);
	for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'block';
	}
}

/*
function cambiame(){ 
	window.open("","ventanita","width=800,height=600,toolbar=0"); 
	var o = window.setTimeout("document.form1.submit();",500); 
}

function cambiametb(){ 
	window.open("","ventanitatb","width=800,height=600,toolbar=0"); 
	var o = window.setTimeout("document.form1.submit();",500); 
}  
*/


function cambiaDisable(_contenedor){ 
	_stat=parseInt(_contenedor.getAttribute('contenidoenable'));
	_contenedor.setAttribute('contenidoenable',(_stat*(-1)));
}





function cambiarMuestraTodas(){
	
	_div=document.querySelector('#botonmodovista');		
	_est=_div.getAttribute('estadoactivo');
	
	_botonesopociones=document.querySelectorAll('#botonmodovista > a');
	_c=0;
	_ops={};
	for(_bn in _botonesopociones){
		if(typeof(_botonesopociones[_bn]) != 'object'){continue;}
		_est_b=_botonesopociones[_bn].getAttribute('id');
		_c++;
		_ops[_c]=_est_b;
		console.log(_est_b+' vs '+_est);
		if(_est_b==_est){_posicion=_c;}
	}
	
	if(_posicion>=_c){_nueva_pos=1;}else{_nueva_pos=_posicion+1;}
	_nuevoestado=_ops[_nueva_pos];
	console.log(_nuevoestado);
	
	_div.setAttribute('estadoactivo',_nuevoestado);
	document.querySelector('#gantt').setAttribute('estadoactivo',_nuevoestado);
		
	_stat=parseInt(document.querySelector('#gantt').getAttribute('muestratodas'));
	document.querySelector('#gantt').setAttribute('muestratodas',(_stat*(-1)));
	document.querySelector('.botonerainicial').setAttribute('muestratodas',(_stat*(-1)));
	
	listarTareasPlan(_IdPlanActivo);
}
