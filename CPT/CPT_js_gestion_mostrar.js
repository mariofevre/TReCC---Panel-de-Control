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

function listarComputos(){
		
	//listado derecha
	_listado=document.querySelector('#listacomputos #listado');
	_listado.innerHTML='';
	for(_pn in _DataComputos.computosOrden){
		_idp=_DataComputos.computosOrden[_pn];
		_pdat=_DataComputos.computos[_idp];
		_a=document.createElement('a');
		_a.setAttribute('idcomp',_pdat.id);
		_a.setAttribute('superado',_pdat.zz_superado);
		_a.innerHTML=_pdat.nombre;
		_a.title=_pdat.descripcion;
		_a.setAttribute('onclick','cargarcomputo(this.getAttribute("idcomp"))');
		_listado.appendChild(_a);
		
	}
	/*
	_act=document.querySelector('#listacomputos #listado > a[superado="0"]');	
	if(_act==undefined){return;}
	*/
	
	//contenido principal	
	_cont=document.querySelector('#contenidoextenso #tabla tbody');
	_cont.innerHTML='';
	
	for(_cn in _DataComputos.computosOrden){
		_idc=_DataComputos.computosOrden[_cn];
		_cdat=_DataComputos.computos[_idc];
		
		document.querySelector('#contenidoextenso #tabla').setAttribute('idcomp',_idc);


				
		for(_rn in _cdat.rubrosOrden){			
			_idr=_cdat.rubrosOrden[_rn];
			
			
			_tr=generaFilaVacia();	
			llenarFilaRubro(_tr,_idr);
			
			for(_in in _rdat.itemsOrden){
				_idi=_rdat.itemsOrden[_in];
				
				_tr=generaFilaVacia();				
				_idsr='';				
				llenarFilaItem(_tr,_idc,_idr,_idsr,_idi);		
				
				_beds=0;
				_idat=_DataComputos.items[_idi];
				for(_idb in _idat.bed){
					
					
					_idb=_idb;
					_tr=generaFilaVacia();
					_tr.setAttribute('primer_cert',_idat.bed[_idb].num_certificado_en_que_aparece);
					llenarFilaBed(_tr,_idc,_idr,_idsr,_idi, _idb);		
					_beds++;
				}
				if(_beds>0){
					_tr=generaFilaVacia();
					_tr.setAttribute('primer_cert',_idat.bed[_idb].num_certificado_en_que_aparece);
					llenarFilaSaldo(_tr,_idc,_idr,_idsr,_idi);		
				}
			}			
				
			for(_srn in _rdat.subrubrosOrden){
				_idsr=_rdat.subrubrosOrden[_srn];
				
				_tr=generaFilaVacia();				
				llenarFilaSubRubro(_tr,_idr,_idsr);
											
				for(_in in _srdat.itemsOrden){
					_idi=_srdat.itemsOrden[_in];
					
					_tr=generaFilaVacia();		
					llenarFilaItem(_tr,_idc,_idr,_idsr,_idi);					
					
					_idat=_DataComputos.items[_idi];
					for(_idb in _idat.bed){
						_idb=_idb;
						_tr=generaFilaVacia();
						llenarFilaBed(_tr,_idc,_idr,_idsr,_idi, _idb);		
					}
					
				}	
			}			
		}		
	}
	
	mostrarCertificado();
}


function mostrarCertificado(){
	
	if(_CertificadoCargado['definido']!='no'){
		document.querySelector('#contenidoextenso #tabla thead #nom_cert').innerHTML='N '+_CertificadoCargado.numero+' <br> '+_CertificadoCargado.nombre;
		document.querySelector('#contenidoextenso #tabla thead #nom_cert').setAttribute('idcert',_CertificadoCargado.id);
	
		_ultimo='no';
		
		console.log(_CertificadoCargado.estado);
		document.querySelector('#tabla #botonestado').setAttribute('estado',_CertificadoCargado.estado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

		
		if(_loc > 0){
			document.querySelector('#botoncertanterior').setAttribute('estado','disponible');
		}else{
			document.querySelector('#botoncertanterior').setAttribute('estado','nodisponible');
		}
		
		if(_loc < (_cant-1)){
			document.querySelector('#botoncertsiguiente').setAttribute('estado','disponible');
			document.querySelector('#botoncertnuevo').setAttribute('estado','nodisponible');
		}else{
			_ultimo='si';
			document.querySelector('#botoncertsiguiente').setAttribute('estado','nodisponible');
			document.querySelector('#botoncertnuevo').setAttribute('estado','disponible');
		}
		
		_filas=document.querySelectorAll('#tabla tr.demasia, #tabla tr.economia, #tabla tr.saldo');
		for(_nf in _filas){
			if(typeof _filas[_nf]!='object'){continue;}
			
			_filas[_nf].setAttribute('presente_en_certificado','si');
			
			_pc=_filas[_nf].getAttribute('primer_cert');
			
			if(_pc == null){continue;}
			
			if(Number(_pc) > Number(_CertificadoCargado.numero)){
				_filas[_nf].setAttribute('presente_en_certificado','no');
			}
		}
	}else{
		document.querySelector('#botoncertnuevo').setAttribute('estado','disponible');
	}
	
	for(_cn in _DataComputos.computosOrden){
		_idc=_DataComputos.computosOrden[_cn];
		_cdat=_DataComputos.computos[_idc];
							
		for(_rn in _cdat.rubrosOrden){		
			_idr=_cdat.rubrosOrden[_rn];
			_rdat=_DataComputos.rubros[_idr];
							
			for(_in in _rdat.itemsOrden){
				
				_idi=_rdat.itemsOrden[_in];
				_idsr='';				
				

				_prev=0;
				if(_CertificadoCargadoAnterior.avancesitem!=undefined){						
					if(_CertificadoCargadoAnterior.avancesitem[_idi]!=undefined){
						if(_CertificadoCargadoAnterior.avancesitem[_idi][0]!=undefined){
							_prev=parseFloat(_CertificadoCargadoAnterior.avancesitem[_idi][0].porcentaje_acum);
							if(isNaN(_prev)){_prev=0;}
						}
					}
				}
				document.querySelector('tr.item[iditem="'+_idi+'"] #acp').innerHTML=_prev;
				
				_porc=0;
				
				if(_CertificadoCargado.definido!='no'){
						
					if(_CertificadoCargado.avancesitem[_idi]!=undefined){
						if(_CertificadoCargado.avancesitem[_idi][0]!=undefined){
							if(_CertificadoCargado.avancesitem[_idi][0]!=''){
								_porc=parseFloat(_CertificadoCargado.avancesitem[_idi][0].porcentaje);
							}						
						}
					}
					if(isNaN(_porc)){_porc=0;}
					
					
					_inp=document.querySelector('tr.item[iditem="'+_idi+'"] #av input');
					_inp.value=_porc;
					
					if(_CertificadoCargado.estado=='publicado'){
						_inp.setAttribute('readonly','readonly');
					}else{
						_inp.removeAttribute('readonly');						
					}
					//console.log(_inp);
					
					_acum=_prev+_porc;
					document.querySelector('tr.item[iditem="'+_idi+'"] #ac').innerHTML=_acum;
					
					//_DataComputos
					if(
						_DataComputos.items[_idi].cert_relev_tareas < _acum
						&&
						_DataComputos.items[_idi].zz_cache_porc_link_tareas>99
						){
						document.querySelector('tr.item[iditem="'+_idi+'"]').setAttribute('sobrecertificado','si');
						document.querySelector('tr.rubro[idrubro="'+_idr+'"]').setAttribute('sobrecertificado','si');
					}
					//console.log(_idi);
					//console.log(_CertificadoCargado.avancesitem[_idi]);
					//console.log(_prev);
					
						
					if(				
						_CertificadoCargado.avancesitem[_idi]==undefined
					){
						
						if(_prev>0){
							document.querySelector('tr.item[iditem="'+_idi+'"] #av input').onchange();
						}
					}else if(
						_CertificadoCargado.avancesitem[_idi][0]==undefined
						&&
						_prev>0				
					){
						document.querySelector('tr.item[iditem="'+_idi+'"] #av input').onchange();
					}
					
					if(_ultimo=='si'){
						if(_acum-parseFloat(_idat.cert_relev_tareas)>5){
							_tr.querySelector('#avt').setAttribute('alerta','avancecert');
						}
					}
				}
			}	
			
			for(_srn in _rdat.subrubrosOrden){
				_idsr=_rdat.subrubrosOrden[_srn];
				_srdat=_DataComputos.subrubros[_idsr];
									
				for(_in in _srdat.itemsOrden){
					_idi=_srdat.itemsOrden[_in];
					
					_prev=0;
					if(_CertificadoCargadoAnterior.avancesitem[_idi][0]!=''){
						_prev=parseFloat(_CertificadoCargadoAnterior.avancesitem[_idi][0].porcentaje_acum);
					}
					document.querySelector('tr.item[iditem="'+_idi+'"] #acp').innerHTML=_prev;
					
					_inp=document.querySelector('tr.item[iditem="'+_idi+'"] #av input');
					_inp.value=_CertificadoCargado.avancesitem[_idi][0].porcentaje;
					
					if(_CertificadoCargado.estado=='publicado'){
						_inp.setAttribute('readonly','readonly');
					}else{
						_inp.removeAttribute('readonly');						
					}
					//console.log(_inp);
					
					_acum=_prev+parseFloat(_CertificadoCargado.avancesitem[_idi][0].porcentaje);
					document.querySelector('tr.item[iditem="'+_idi+'"] #ac').innerHTML=_prev+parseFloat(_CertificadoCargado.avancesitem[_idi][0].porcentaje);
			
				}	
			}			
		}
	}			
		
}

function cargarCertificadoAnterior(){
	_loc--;
	//console.log(_cant);
	//console.log(_keys);
	//console.log(_keys[_loc]);		
	_idcc=_DataComputos.certificadosOrden[_keys[_loc]];
	_CertificadoCargado=_DataComputos.certificados[_idcc];
	_CertificadoCargado['definido']='si';
	if(_loc>0){
		_idca=_DataComputos.certificadosOrden[_keys[_loc-1]];
		_CertificadoCargadoAnterior=_DataComputos.certificados[_idca];
		_CertificadoCargadoAnterior['definido']='si';
	}else{
		_CertificadoCargadoAnterior={'definido':'no'};
	}
	mostrarCertificado();
}

function cargarCertificadoSiguiente(){
	_loc++;
	console.log(_cant);
	console.log(_keys);
	console.log(_keys[_loc]);	
	_idcc=_DataComputos.certificadosOrden[_keys[_loc]];
	_CertificadoCargado=_DataComputos.certificados[_idcc];
	_CertificadoCargado['definido']='si';
	if(_loc>0){
		_idca=_DataComputos.certificadosOrden[_keys[_loc-1]];
		_CertificadoCargadoAnterior=_DataComputos.certificados[_idca];
		_CertificadoCargadoAnterior['definido']='si';
	}else{
		_CertificadoCargadoAnterior={'definido':'no'};
	}
	mostrarCertificado();
}

function generaFilaVacia(){
	_cont=document.querySelector('#contenidoextenso #tabla tbody');	
	
	_tr=document.createElement('tr');	
	_tr.setAttribute('sobrecertificado','no');
	_cont.appendChild(_tr);
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','nu');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','co');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','no');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','lnk');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','avt');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','un');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','cnt');
	_td.setAttribute('class','num');
	
	_td=document.createElement('td');	
	_tr.appendChild(_td);
	_td.setAttribute('id','pu');
	_td.setAttribute('class','num');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','pp');
	_td.setAttribute('class','num');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','pr');	
	_td.setAttribute('class','num');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','acp');	
	_td.setAttribute('class','num');
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','av');
	_td.setAttribute('class','inp');
	_inp=document.createElement('input');
	_td.appendChild(_inp);
	_inp.setAttribute('type','text');	
	_inp.setAttribute('name','avan_p');	
	_inp.setAttribute('onchange','cambiaAvance(this)');	
	
	_td=document.createElement('td');
	_tr.appendChild(_td);
	_td.setAttribute('id','ac');	
	_td.setAttribute('class','num');
	
	
	return _tr;
	
}

function llenarFilaRubro(_tr,_idr){
	
	_rdat=_DataComputos.rubros[_idr];
	
	_tr.setAttribute('class','rubro');
	_tr.setAttribute('idrubro',_idr);
	_tr.querySelector('#nu').innerHTML=_rdat.orden;
	_tr.querySelector('#co').innerHTML=_rdat.numero;
	_tr.querySelector('#no').innerHTML=_rdat.nombre;				
	_tr.querySelector('#lnk').innerHTML='';
	_tr.querySelector('#avt').innerHTML='';
	_tr.querySelector('#un').innerHTML='';
	_tr.querySelector('#cnt').innerHTML='';
	_tr.querySelector('#pu').innerHTML='';
	_tr.querySelector('#pp').innerHTML='';
	_tr.querySelector('#pr').innerHTML=formateaPesos(_rdat.precio_parc,2);
	_tr.querySelector('#acp').innerHTML='';
	_tr.querySelector('#av').innerHTML='';
	_tr.querySelector('#ac').innerHTML='';
}

function llenarFilaSubRubro(_tr,_idr,_idsr){
	
	_rdat=_DataComputos.rubros[_idr];
	_srdat=_DataComputos.subrubros[_idsr];	
	
	_tr.setAttribute('class','subrubro');
	_tr.setAttribute('p_idrubro',_idr);
	_tr.setAttribute('idsubrubro',_idsr);
	_tr.querySelector('#nu').innerHTML=_rdat.orden+'.'+_srdat.orden;
	_tr.querySelector('#co').innerHTML=_srdat.numero;
	_tr.querySelector('#no').innerHTML=_srdat.nombre;				
	_tr.querySelector('#lnk').innerHTML='';
	_tr.querySelector('#avt').innerHTML='';
	_tr.querySelector('#un').innerHTML='';
	_tr.querySelector('#cnt').innerHTML='';
	_tr.querySelector('#pu').innerHTML='';
	_tr.querySelector('#pp').innerHTML='';
	_tr.querySelector('#pr').innerHTML='';
	_tr.querySelector('#acp').innerHTML='';
	_tr.querySelector('#av').innerHTML='';
	_tr.querySelector('#ac').innerHTML='';

}


function llenarFilaItem(_tr,_idc,_idr,_idsr,_idi){
	// Esta función llena la fila de un ítem, pero no su certiciación.
	// la certificación de carga en mostrarCertificado().
	
	_cdat=_DataComputos.computos[_idc];			
	_rdat=_DataComputos.rubros[_idr];
	_srdat=_DataComputos.subrubros[_idsr];	
	_idat=_DataComputos.items[_idi];		
	
	_tr.setAttribute('class','item');
	_tr.setAttribute('iditem',_idi);
	_tr.setAttribute('p_idrubro',_idr);
	_tr.setAttribute('p_idsubrubro',_idsr);
	_tr.setAttribute('bed','0');
	
	_tr.querySelector('#nu').innerHTML=_rdat.orden;
	if(_idsr!=''){_tr.querySelector('#nu').innerHTML+='.'+_srdat.orden;}
	_tr.querySelector('#nu').innerHTML+='.'+_idat.orden;
	
	_tr.querySelector('#co').innerHTML=_idat.numero;
	_tr.querySelector('#no').innerHTML=_idat.nombre;				
	
	_a=document.createElement('a');
	_a.setAttribute('id','link_tar');
	_a.setAttribute('onclick','consultaEditarLinkCptTar('+_idi+')');
	_sp=document.createElement('span');
	_a.appendChild(_sp);
	_sp.style.width=_idat.zz_cache_porc_link_tareas+'%';
	if(_idat.zz_cache_porc_link_tareas==100){
		_sp.innerHTML='linkeado';
		_a.setAttribute('estado','linkeado');
	}else if(_idat.zz_cache_porc_link_tareas<1){
		_sp.innerHTML='no';
		_a.setAttribute('estado','vacio');
	}else{
		_sp.innerHTML=_idat.zz_cache_porc_link_tareas+'%';		
		_a.setAttribute('estado','parcial');
	}
	_tr.querySelector('#lnk').appendChild(_a);
	
	_tr.querySelector('#avt').innerHTML=_idat.cert_relev_tareas+' %';
	
	_tr.querySelector('#un').innerHTML=_idat.unidad;
	_tr.querySelector('#cnt').innerHTML=_idat.cantidad;
	_tr.querySelector('#pu').innerHTML=formateaPesos(_idat.precio_unit,2);
	_tr.querySelector('#pp').innerHTML=formateaPesos(_idat.precio_parc,2);
	_tr.querySelector('#pr').innerHTML='';
	
}





function llenarFilaBed(_tr,_idc,_idr,_idsr,_idi, _idb){
	
	_cdat=_DataComputos.computos[_idc];			
	_rdat=_DataComputos.rubros[_idr];
	_srdat=_DataComputos.subrubros[_idsr];	
	_idat=_DataComputos.items[_idi];		
	_bdat=_DataComputos.items[_idi].bed[_idb];		
	
	if(_bdat['variacion_cantidad']<0){
		_c='economia';
	}else if(_bdat['variacion_cantidad']>0){
		_c='demasia';
	}else{
		alert('error');
		return;
	}
	
	_tr.setAttribute('class',_c);
	_tr.setAttribute('bed',_idb);
	_tr.setAttribute('iditem',_idi);
	_tr.setAttribute('p_idrubro',_idr);
	_tr.setAttribute('p_idsubrubro',_idsr);

	//_tr.querySelector('#nu').innerHTML=_rdat.orden;
	//if(_idsr!=''){_tr.querySelector('#nu').innerHTML+='.'+_srdat.orden;}
	//_tr.querySelector('#nu').innerHTML+='.'+_idat.orden;
	
	
	//_tr.querySelector('#co').innerHTML=_idat.numero;
	//_tr.querySelector('#no').innerHTML=_idat.nombre;				
	
	if(_bdat['variacion_cantidad']<0){
		_tr.querySelector('#no').innerHTML="Economía";					
	}else{
		_tr.querySelector('#no').innerHTML="Demasía";					
	}

	
	_tr.querySelector('#un').innerHTML=_idat.unidad;
	_tr.querySelector('#cnt').innerHTML=parseFloat(_bdat['variacion_cantidad']);
	_tr.querySelector('#pu').innerHTML=formateaPesos(_idat.precio_unit,2);
	_tr.querySelector('#pp').innerHTML=formateaPesos(_bdat['variacion_cantidad']*_idat.precio_unit);
	_tr.querySelector('#pr').innerHTML='';
	

	_porc=0;	
	if(_CertificadoCargado.avancesitem[_idi]!=undefined){
		if(_CertificadoCargado.avancesitem[_idi][_idb]!=undefined){
			if(_CertificadoCargado.avancesitem[_idi][_idb]!=''){
				_porc=parseFloat(_CertificadoCargado.avancesitem[_idi][_idb].porcentaje);
			}						
		}
	}
	if(isNaN(_porc)){_porc=0;}
	
	_tr.querySelector('#av input').value=_porc;
}


function llenarFilaSaldo(_tr,_idc,_idr,_idsr,_idi){
	
	_cdat=_DataComputos.computos[_idc];			
	_rdat=_DataComputos.rubros[_idr];
	_srdat=_DataComputos.subrubros[_idsr];	
	_idat=_DataComputos.items[_idi];			
	
	_tr.setAttribute('class','saldo');
	_tr.setAttribute('iditem',_idi);
	_tr.setAttribute('p_idrubro',_idr);
	_tr.setAttribute('p_idsubrubro',_idsr);

	_saldo_cant=parseFloat(_idat.cantidad);
	_saldo_monto=parseFloat(_idat.precio_parc);
	
	for(_nbed in _idat.bed){
		_bdat=_idat.bed[_nbed];
		_saldo_cant += parseFloat(_bdat['variacion_cantidad']);
		_saldo_monto += parseFloat(_bdat['variacion_cantidad'])*parseFloat(_idat.precio_unit);
	}
	
	_tr.querySelector('#no').innerHTML="Saldo";			
	
	_tr.querySelector('#un').innerHTML=_idat.unidad;
	_tr.querySelector('#cnt').innerHTML=Math.round(_saldo_cant*100)/100;
	_tr.querySelector('#pu').innerHTML='';
	_tr.querySelector('#pp').innerHTML=formateaPesos(_saldo_monto,2);
	_tr.querySelector('#pr').innerHTML='';
	
}



function actualizarFilaListaComputo(_iditem){
	_fila= document.querySelector('.item[iditem="'+_iditem+'"]');
	console.log('.item[iditem="'+_iditem+'"]');
	_fila.querySelector('a#link_tar').innerHTML=_DataComputos.items[_iditem].zz_cache_porc_link_tareas+'%';
	
	//TODO el resto de los campos de la fila
}

function formateaPesos(_valor,_decimales){	
	_options = { style: 'currency', currency: 'ARS' ,maximumFractionDigits: _decimales,minimumFractionDigits: _decimales};	
	_formateado = new Intl.NumberFormat('es-ar', _options);
	return _formateado.format(_valor);
}

function formularOpcionesProceso(_res){
	
		
	
}



//DE ACÁ PRA ABAJO ES CÓDIGO ARRASTRADO DE TAR // pero lo dejamos un tiempo por las dudas
/*

var _ultN={	'1':'',	'2':'',	'3':''};
var _contultN={	'1':0,	'2':0,	'3':0};

function listarTareasPlan(_idplan){
		
	_listado=document.querySelector('#gantt #listado');
	_listado.innerHTML='';
	
	for(_tn in _DataPlanes[_idplan].tareasOrden){
		_idtarea=_DataPlanes[_idplan].tareasOrden[_tn];
	
		_dat=_DataPlanes[_idplan].tareas[_idtarea];
		
		
		_dd=document.createElement('div');
		_listado.appendChild(_dd);
		
		_dd.setAttribute('class','renglontarea');
		_dd.setAttribute('nivel',_dat.nivel);		
		
		_ss=document.createElement('div');
		_ss.setAttribute('id','separador');
		_dd.appendChild(_ss);
		
		
				
		_a=document.createElement('a');
		_dd.appendChild(_a);
		
		//console.log(_dat);
		//console.log(_dat.observaciones);
		if(Object.keys(_dat.observaciones).length==0){
			_a.setAttribute('conobservaciones','no');
		}		
		_a.setAttribute('enultimoimport',_dat.zz_presente_en_ultimo_import);
		_a.setAttribute('idtarea',_dat.id);
		_idtarea=_dat.id;
		_a.setAttribute('class','tarea');
		
		_a.setAttribute('nivel',_dat.nivel);		
		
		_a.title=_dat.descripcion;
		_a.setAttribute('onclick','consultarTarea(this.getAttribute("idtarea"))','formular','');
		
		_ini=((_dat.fecha_plan_inicio_diashoy-_diaInicio_rel)*_anchodia)+_offset-3;
		_a.style.left = _ini+ 'px';
		
		_cantdiasancho =Math.max(_dat.fecha_plan_fin_diashoy-_dat.fecha_plan_inicio_diashoy,1);
		_ancho=(_cantdiasancho*_anchodia)-2;
		_a.style.width=_ancho+ 'px';
		
		_visible='si';
		if(_dat.fecha_plan_fin_diashoy<_diaInicio_rel){
			_a.setAttribute('tiempo','pasado');	
			_visible='no';
		}else if(_dat.fecha_plan_inicio_diashoy>_diaFin_rel){
			_a.setAttribute('tiempo','futuro');	
			_visible='no';
		}else{
			_visible='si';	
		}
		_a.setAttribute('visible',_visible);	
		
		if(
			_dat.fecha_plan_fin_diashoy>=0
		){
			_pendiente='no';
		}else{
			_pendiente='si';
		}
		_a.setAttribute('pendiente',_pendiente);
		
		
		_div=document.createElement('div');
		_div.setAttribute('id','flotantetexto');
		_a.appendChild(_div);
		
		_span=document.createElement('span');
		_span.innerHTML=_dat.nombre;
		_div.appendChild(_span);
		
		_sp=document.createElement('span');
		_sp.innerHTML=_dat.contexto;
		_sp.setAttribute('class','contexto');		
		
		if(_dat.fecha_plan_inicio_diashoy < _diaInicio_rel){
			_span.style.left= (_diaInicio_rel - _dat.fecha_plan_inicio_diashoy)*_anchodia+'px';
			_sp.style.left= (_diaInicio_rel - _dat.fecha_plan_inicio_diashoy)*_anchodia+'px';
		}
		
		if(_dat.fecha_plan_inicio_diashoy > 5){
			_span.style.left= 'auto';
			_span.style.right=(_dat.fecha_plan_fin_diashoy - _dat.fecha_plan_inicio_diashoy)*_anchodia+'px';
			_sp.style.left= 'auto';
			_sp.style.right=(_dat.fecha_plan_fin_diashoy - _dat.fecha_plan_inicio_diashoy)*_anchodia+'px';			
			if(_dat.fecha_plan_inicio_diashoy > _diaFin_rel){				
				_span.style.right=(_dat.fecha_plan_fin_diashoy - _diaFin_rel + 2)*_anchodia+'px';
				_sp.style.right=(_dat.fecha_plan_fin_diashoy - _diaFin_rel + 2)*_anchodia+'px';				
			}
		}		
		
		
		if(_ultN[_dat.nivel]==undefined){_ultN[_dat.nivel]="";}
		
		if(_ultN[_dat.nivel]!=''){
			_dest=document.querySelector('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]');
			if(_dest==null){
				console.log('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]');
				}
			//console.log(_dest.querySelector('.contexto'));
			if(_dest.querySelector('.contexto')==null){
				console.log('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]');
				}
			_left=_dest.querySelector('.contexto').style.left;
			_left=_left.replace('px', '');
			_left=parseInt(_left);
						
			_div=document.createElement('div');
			_div.setAttribute('class','llave');
			_div.setAttribute('nivel',_dat.nivel);
			_div.style.height=((_contultN[_dat.nivel]*32)-6)+'px';
			_pl=0;
			if(_dat.nivel=='1'){_pl=-5;}
			if(_dat.nivel=='2'){_pl=5;}
			//console.log((_left+_pl)+'px');
			_div.style.left=(_left+_pl)+'px';
			
			//console.log(_ultN[_dat.nivel]);
			//console.log('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]');
			if(_contultN[_dat.nivel]>1){
				document.querySelector('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]').appendChild(_div);
			}
			_contultN[_dat.nivel]=0;
		}		
		
		if(_visible=='si'){
			_contultN[(_dat.nivel-0)]++;
			_contultN[(_dat.nivel-1)]++;
			_contultN[(_dat.nivel-2)]++;
			_ultN[_dat.nivel]=_idtarea;
			_ultN[(_dat.nivel+1)]='';
			_ultN[(_dat.nivel+2)]='';
		}
		
		_div.appendChild(_sp);		
		
			
		
		listarObservacionesTareaPlan(_dat.id,_idplan);
		canvasTarea(_idtarea);
		
		_ultN={	'1':'',	'2':'',	'3':''	};
		_contultN={	'1':0,	'2':0,	'3':0	};
	}	
}


function listarObservacionesTareaPlan(_idtarea,_idplan){			
	//console.log('o');
	//console.log(_DataPlanes[_idplan].tareas[_idtarea]);
	for(_on in _DataPlanes[_idplan].tareas[_idtarea].observacionesOrden){	
		_idobserv=_DataPlanes[_idplan].tareas[_idtarea].observacionesOrden[_on];
		//console.log(_idobserv);
		muestraObservacion(_idplan,_idtarea,_idobserv,'no');	
	}	
}


function redibujarTarea(_idtarea){
	
	_idplan=_IdPlanActivo;
	
	_dat=_DataPlanes[_idplan].tareas[_idtarea];

	_a=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]');
	
	_ini=((_dat.fecha_plan_inicio_diashoy-_diaInicio_rel)*_anchodia)+_offset-3;
	_a.style.left = _ini+ 'px';
	
	_cantdiasancho =Math.max(_dat.fecha_plan_fin_diashoy-_dat.fecha_plan_inicio_diashoy,1);
	_ancho=(_cantdiasancho*_anchodia)-2;
	_a.style.width=_ancho+ 'px';
	
	
	listarObservacionesTareaPlan(_idtarea,_idplan);	
	canvasTarea(_idtarea);	
		
}


function formularPlan(){

	_idplan=_IdPlanActivo;
	document.querySelector('#formPlan').setAttribute('estado','activo');
	document.querySelector('#formPlan [name="idplan"]').value=_idplan;
	document.querySelector('#formPlan [name="nombre"]').value=_DataPlanes[_idplan].nombre;
	document.querySelector('#formPlan [name="descripcion"]').value=_DataPlanes[_idplan].descripcion;;

}


function muestraObservacion(_idplan,_idtarea,_idobserv,_existente){
		//console.log(_idplan+','+_idtarea+','+_idobserv+','+_existente);		
		
		if(_existente=='si'){
			if(document.querySelector('#gantt #listado .tarea .observacion[idobserv="'+_idobserv+'"]')!=null){
				_a=document.querySelector('#gantt #listado .tarea .observacion[idobserv="'+_idobserv+'"]');
			}else{
				_a=document.createElement('a');
			}
		}else{
			_a=document.createElement('a');
		}
	
		_dat=_DataPlanes[_idplan].tareas[_idtarea].observaciones[_idobserv];
		
		_a.setAttribute('idobserv',_dat.id);
		_a.setAttribute('class','observacion');
		_a.setAttribute('preliminar',_dat.zz_preliminar);
		if(_dat.zz_preliminar=='1'){
			_a.setAttribute('activa','si');
		}
		_a.setAttribute('alerta',_dat.alerta);
		_a.title=_dat.observaciones;
		_a.setAttribute('onclick','event.stopPropagation();consultarTarea(this.parentNode.getAttribute("idtarea"),"formular",this.getAttribute("idobserv"))');
	
		document.querySelector('#formObservacion [name="avance"]').value=_dat.avance;
		muestraSlide(document.querySelector('#formObservacion [name="avance"]'));
		//_ini=((_dat.fecha_diashoy-_diaInicio_rel)*_anchodia)+_offset-1;
		//console.log(_dat.fecha_diashoy+'-'+_diaInicio_rel+'*'+_anchodia);
		//console.log(_dat.fecha_diashoy-_diaInicio_rel+'*'+_anchodia);
		
		_desplazaIniTarea=_DataPlanes[_idplan].tareas[_idtarea].fecha_plan_inicio_diashoy-_diaInicio_rel;
		_ini=((_dat.fecha_diashoy-_diaInicio_rel-_desplazaIniTarea)*_anchodia)+0;

		_vis=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').getAttribute('visible');
		if(_vis=='no'){
			//console.log(_idtarea+': '+_dat.fecha_diashoy+ '>' +_diaInicio_rel+ ' && '+_dat.fecha_diashoy+ ' < '+_diaFin_rel);
			if(_dat.fecha_diashoy>_diaInicio_rel&&_dat.fecha_diashoy<_diaFin_rel){
				//console.log('tarea:'+_idtarea+' a visible');
				_vis='si';
				document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').setAttribute('visible',_vis);
			}			
		}
		
		_pendiente=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').getAttribute('pendiente');
		
		if(_pendiente=='si'){
			if(_dat.avance==100){
				_pendiente='no';
				document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').setAttribute('pendiente',_pendiente);
			}
		}
		
		
		_a.style.left = _ini+ 'px';
		
		_ancho=((1)*_anchodia-2);
		_a.style.width=_ancho+ 'px';
				
		document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').appendChild(_a);	
}






function formularTarea(_idtarea){	

	_datT=_DataPlanes[_IdPlanActivo]['tareas'][_idtarea];
	
	document.querySelector('#formTareaObservacion').setAttribute('activo','si');
	_formT=document.querySelector('#formTarea');
		
	_obsb=document.querySelector('#gantt #listado .tarea[idtarea="'+_datT.id+'"]');
	_obsb.setAttribute('activa','si');
	
	_formT.querySelector('[name="id"]').value=_datT.id;
	_formT.querySelector('[name="codigo"]').value=_datT.codigo;
	_formT.querySelector('[name="nombre"]').value=_datT.nombre;
	_formT.querySelector('[name="descripcion"]').value=_datT.descripcion;
	_formT.querySelector('[name="fecha_plan_inicio"]').value=_datT.fecha_plan_inicio;
	_formT.querySelector('[name="fecha_plan_fin"]').value=_datT.fecha_plan_fin;
	_formT.querySelector('[name="fecha_hecho_inicio"]').value=_datT.fecha_hecho_inicio;
	_formT.querySelector('[name="fecha_hecho_fin"]').value=_datT.fecha_hecho_fin;
	//_formT.querySelector('[name="id_p_TARtareas_padre"]').value=_datT.id_p_TARtareas_padre;
	
	_formT.querySelector('#contexto span').innerHTML=_datT.contexto;
	if(_datT.contexto!=''){
		_formT.querySelector('#contexto').setAttribute('cargado','si');		
	}else{
		_formT.querySelector('#contexto').setAttribute('cargado','no');
	}
	
	document.querySelector('#formTareaObservacion #listaobs').innerHTML='';
	
	for(_on in _datT.observacionesOrden){
		_ido=_datT.observacionesOrden[_on];
		_do=_datT.observaciones[_ido];
		
		_a=document.createElement('a');		
		_a.setAttribute('idobserv',_do.id);
		_a.setAttribute('class','observacion');
		_a.setAttribute('preliminar',_do.zz_preliminar);
		if(_dat.zz_preliminar=='1'){
			_a.setAttribute('activa','si');
		}
		_a.setAttribute('alerta',_do.alerta);
		
		_fe=_do.fecha.split('-');
		_a.title=_fe[2]+' / ' + _fe[1] + ' / ' + _fe[0] + '\n';
		_a.title+=_do.observaciones;
		_a.innerHTML=parseInt(_fe[2])+'<br>'+parseInt(_fe[1]);
		_a.setAttribute('onclick','event.stopPropagation();consultarTarea('+_idtarea+',"formular",this.getAttribute("idobserv"))');
	
		//_ancho=((1)*_anchodia-2);
		//_a.style.width=_ancho+ 'px';
				
		document.querySelector('#formTareaObservacion #listaobs').appendChild(_a);	
				
	}
	
	_a=document.createElement('a');		
	_a.setAttribute('idobserv','');
	_a.setAttribute('class','observacion');
	_a.setAttribute('activa','si');	
	_a.setAttribute('onclick','event.stopPropagation();consultarTarea('+_idtarea+')');

	_ancho=((1)*_anchodia-2);
	_a.style.width=_ancho+ 'px';
			
	document.querySelector('#formTareaObservacion #listaobs').appendChild(_a);	
	
	_formO=document.querySelector('#formObservacion');
	//console.log(_formO);
	_formO.querySelector('[name="id"]').value='crear';
	//console.log(_formO.querySelector('[name="id"]'));
	_formO.querySelector('[name="fecha"]').value=_Hoy;
	_formO.querySelector('[name="avance"]').value=0;
	_formO.querySelector('#muestra_avance').innerHTML='0';
	_formO.querySelector('[name="alerta"]').value='';
	_formO.querySelector('[name="iniciara"]').value='';
	_formO.querySelector('[name="enejecucion"]').value='';
	_formO.querySelector('[name="terminara"]').value='';
	_formO.querySelector('[name="termino"]').value='';
	_formO.querySelector('[name="observaciones"]').value='';

	_formO.querySelector('#adjuntoslista').innerHTML='';
	
	if(_datT.fecha_plan_inicio_diashoy > 0){
		
		_formO.querySelector('#porc_pasado').innerHTML='0%';
	}else if(_datT.fecha_plan_fin_diashoy < 0){
		_formO.querySelector('#porc_pasado').innerHTML='100%';
	}else{
		
		_dur = _datT.fecha_plan_fin_diashoy - _datT.fecha_plan_inicio_diashoy;
		_av = (_datT.fecha_plan_inicio_diashoy  * (-1));
		_porc=Math.round(100*(_av/_dur));
		_formO.querySelector('#porc_pasado').innerHTML=_porc+'%';
		
	}
	
	if(_datT.fecha_plan_inicio_diashoy > 0){
		//tarea futura
		_formO.querySelector('#preguntaprevia').setAttribute('activa','si');
	}else{
		_formO.querySelector('#preguntaprevia').setAttribute('activa','no');
	}
	
	if(_datT.fecha_plan_inicio_diashoy <= 0
		&&
		_datT.fecha_plan_fin_diashoy >= 0
	){
		//tarea actual
		_formO.querySelector('#preguntadurante').setAttribute('activa','si');
	}else{
		_formO.querySelector('#preguntadurante').setAttribute('activa','no');
	}
	
	
	if(
		_datT.fecha_plan_fin_diashoy < 0
	){
		//tarea pasada
		_formO.querySelector('#preguntaposterior').setAttribute('activa','si');
	}else{
		_formO.querySelector('#preguntaposterior').setAttribute('activa','no');
	}
	
}


function ordenarTareas(){
	console.log('ordenando');
	for(_nt in _DataPlanes[_IdPlanActivo].tareasOrden){
		_idt=_DataPlanes[_IdPlanActivo].tareasOrden[_nt];
		console.log('ordenando_visual afuera');
		_rt=document.querySelector('#gantt #listado .tarea[idtarea="'+_idt+'"]').parentNode;
		_rt.parentNode.appendChild(_rt);
	}
		
}

function formularObserv(_idtarea,_idobserv){
	
	//console.log(_IdPlanActivo+' '+_idtarea);
	_datO=_DataPlanes[_IdPlanActivo]['tareas'][_idtarea]['observaciones'][_idobserv];
	_datT=_DataPlanes[_IdPlanActivo]['tareas'][_idtarea];
	
	
	//console.log(document.querySelector('#gantt #listado .observacion[idobserv="'+_datO.id+'"]'));
	_obsb=document.querySelector('#gantt #listado .observacion[idobserv="'+_datO.id+'"]');
	_obsb.setAttribute('activa','si');
	//console.log(_obsb);
	//console.log(_datO);
	
	
	document.querySelector('#formTareaObservacion').setAttribute('activo','si');
	_formO=document.querySelector('#formObservacion');
	
	_formO.querySelector('[name="id"]').value=_datO.id;
	_formO.querySelector('[name="fecha"]').value=_datO.fecha;
	_formO.querySelector('[name="avance"]').value=_datO.avance;
	_formO.querySelector('#muestra_avance').innerHTML=_datO.avance;
	_formO.querySelector('[name="alerta"]').value=_datO.alerta;
	_formO.querySelector('[name="iniciara"]').value=_datO.iniciara;
	_formO.querySelector('[name="enejecucion"]').value=_datO.enejecucion;
	_formO.querySelector('[name="terminara"]').value=_datO.terminara;
	_formO.querySelector('[name="termino"]').value=_datO.termino;
	_formO.querySelector('[name="observaciones"]').value=_datO.observaciones;
	
	_dur = _datT.fecha_plan_fin_diashoy - _datT.fecha_plan_inicio_diashoy;
	_av = ((_datT.fecha_plan_inicio_diashoy - _datO.fecha_diashoy) * (-1));
	_porc=Math.round(100*(_av/_dur));
	_formO.querySelector('#porc_pasado').innerHTML=_porc+'%';
			
	_formO.querySelector('#adjuntoslista').innerHTML='';
	//console.log(_datO); 
    for(_na in _datO.fotos){
    	_daj=_datO.fotos[_na];	
    	console.log(_daj); 
    	anadirAdjunto(_daj);	                	
    }
    
    
    //desplazar listado en gantt para visualizar la observación formulada
    _desp_render_dias=0;
    if(_datO.fecha_diashoy != 0){
		_desp_render_dias = _datO.fecha_diashoy;
	}
	_txs=document.querySelectorAll('#gantt #listado .tarea #flotantetexto');
	for(_n in _txs){
		if(typeof _txs[_n] != 'object'){continue;}
		_txs[_n].style.left=(parseInt(_desp_render_dias*_anchodia))+'px';		
	}	
	
	_seps=document.querySelectorAll('#gantt #listado .renglontarea #separador');
	for(_n in _seps){
		if(typeof _seps[_n] != 'object'){continue;}
		_seps[_n].style.left=(parseInt(_desp_render_dias*_anchodia))+'px';		
	}
	
	
	document.querySelector('#gantt #listado').style.left=(-1*parseInt(_desp_render_dias*_anchodia))+'px';
	
	marcarDiasCalendario();
	
}



function formularMover(_idtarea,_event){

	_listado=document.querySelector('#formMoverTareas #listamovertareas');
	document.querySelector('#formMoverTareas').setAttribute('activo','si');

	
	_sel_array={};	
	_sel_array[_idtarea]='nueva';
		
	if(_event!=undefined){
		
		if(_event.ctrlKey){
			//suma al listado existente
			_listado=document.querySelector('#formMoverTareas #listamovertareas');		
			_selectas=_listado.querySelectorAll('.tarealistada[selecta="si"]');	
			for(_sm in _selectas){
				if(typeof(_selectas[_sm])!='object'){continue;}		
				_mov=_selectas[_sm];	
				_sel_array[_mov.getAttribute('idt')]='previa';
			}
		}
	}
		
	_listado.innerHTML='';
	
	_t=_DataPlanes[_IdPlanActivo].tareasOrden;
	
	_no=0;
	
	console.log(_sel_array);
	
	for(_n in _t){
		
		_no++;
		
		_idt=_t[_n];
		_dat=_DataPlanes[_IdPlanActivo].tareas[_idt];
		
		_ptar=document.createElement('p');
		_ptar.innerHTML=_dat.nombre;
		_ptar.setAttribute('class','tarealistada');
		_ptar.setAttribute('orden',_no);
		_ptar.setAttribute('idt',_idt);
		_ptar.setAttribute('nivel',_dat.nivel);
		
		console.log(_idt);
		if(_sel_array[_idt]!=undefined){
			_ptar.setAttribute('selecta','si');
			_selecto=_ptar;
		}
		
		_listado.appendChild(_ptar);
		
		_scon=document.createElement('span');
		_scon.innerHTML=' / '+_dat.contexto;
		_ptar.appendChild(_scon);
		
		_mov=document.createElement('a');
		_mov.innerHTML='m';
		_mov.setAttribute('class','botonmoverenform');
		_mov.setAttribute('onclick','formularMover("'+_idt+'",event)');
		_ptar.appendChild(_mov);
		
		_insert=document.createElement('a');
		_insert.innerHTML='mover aqui->';
		_insert.setAttribute('class','botondestinoform');
		_insert.setAttribute('onclick','moverTareaAqui("seleccionvisual",this.parentNode)');
		_ptar.appendChild(_insert);
		
	}
	
	_topPos = _selecto.offsetTop - 100;
	//console.log(_topPos);
	_listado.scrollTop = _topPos;

}




function anadirAdjunto(_daj){	                	
	_div=document.createElement('div');
	_div.setAttribute('class','adjunto');
	_div.setAttribute('ruta',_daj.FI_documento);
	_div.setAttribute('idadj',_daj.id);
	_div.setAttribute('onclick','mostrarAdjunto(this)');
	
	_img=document.createElement('img');
	_img.setAttribute('src',_daj.FI_muestra);
	_img.setAttribute('src','./documentos/p_'+_PanId+'/TAR/original/'+_daj.FI_documento);
	_div.appendChild(_img);
	
	_epi=document.createElement('div');
	_epi.setAttribute('class','epigrafe');
	_epi.innerHTML=_daj.FI_original+' '+_daj.epigrfe;
	_div.appendChild(_epi);
	
	_borr=document.createElement('a');
	_borr.setAttribute('class','elimina');
	_borr.setAttribute('onclick','eliminaAdjunto(this,event)');
	_borr.innerHTML='x';
	_borr.title='Eliminar este adjunto';
	_div.appendChild(_borr);
	
	document.querySelector('#formTareaObservacion #adjuntoslista').appendChild(_div);
}



*/
