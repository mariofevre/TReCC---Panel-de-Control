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

function mostrarFiltros(){
	
	var _ff= {
		"estado": {
				'todo':'todo',
				'prog':'apresentar',
				'eval':'enevaluacion',
				'aprob':'aprobada',
				'a rev':'rechazada'
		},
		"anulado": {
				'todo':'todo',
				'no anulados':'no anulados',
				'anulados':'anulados'
		},
		"adjuntos": {
			'todo':'todo',
			'c/ adjuntos':'c/ adjuntos',
			's/ adjuntos':'s/ adjuntos'
		}
	};
	
	for(_campo in _ff){
		_in=document.querySelector('#formfiltro #F'+_campo);
		if(_in == null){continue;}
		_in.parentNode.removeChild(_in);
	}		
		
	for(_campo in _ff){
		_valores=_ff[_campo];
		_div=document.createElement('div');
		document.querySelector('#formfiltro > form').appendChild(_div);
		_div.setAttribute('id','F'+_campo);
		_div.setAttribute('campo',_campo);
		
		for(_i in _valores){
			_val=_valores[_i];
			_lab=document.createElement('label');
			_div.appendChild(_lab);
			_lab.setAttribute('val',_val);
			_lab.setAttribute('class',_val);
			_lab.setAttribute('campo',_campo);
			
			_inp=document.createElement('input');
			_lab.appendChild(_inp);
			_inp.setAttribute('type','radio');
			_inp.setAttribute('name',_campo);
			_inp.setAttribute('value',_val);
			
			_inp=document.createElement('span');
			_lab.appendChild(_inp);
			_inp.setAttribute('onclick','toogle(this);filtrarDocs();');
			_inp.innerHTML=_i;											
		}
	}
	
	var _criteriosdeorden={
		'':'- elegir -',
		'grupoa':'Grupo A',
		'grupob':'Grupo B',
		'sector':'Sect',
		'planta':'Planta',		
		'numero':'Documento Número',	
		'nombre':'Nombre del Documento',	
		'escala':'escala',	
		'rubro':'rubro',	
		'tipologia':'tipo',	
		'estado':'estado',	
		'desde':'desde',	
		'ultimaver':'versiones'
	};
	_campo='orden1';
	
	_ff= {
		"orden1": _criteriosdeorden,
		"orden2": _criteriosdeorden,
		"orden3": _criteriosdeorden
	};
	
	for(_campo in _ff){
		_in=document.querySelector('#formfiltro #O'+_campo);
		if(_in == null){continue;}
		_in.parentNode.removeChild(_in);
	}		

	_nn=0;
	for(_campo in _ff){
		
		_div=document.createElement('div');
		document.querySelector('#formfiltro > form').appendChild(_div);
		_div.setAttribute('id','O'+_campo);
		_div.setAttribute('campo',_campo);
		
		_nn++;
		_div.innerHTML='ord '+_nn+':';
		
		_sel=document.createElement('select');
		_div.appendChild(_sel);
		_sel.setAttribute('name',_campo);
		_sel.setAttribute('disabled','disabled');
		
		for(_k in _criteriosdeorden){
			_c = _criteriosdeorden[_k];
			
			_opt=document.createElement('option');
			_sel.appendChild(_opt);
			_opt.setAttribute('value',_k);
			_opt.innerHTML=_c;
		}
	}
		
	document.querySelector('#formfiltro > form select[name="orden1"] > option[value="grupoa"]').selected = 'selected';
	document.querySelector('#formfiltro > form select[name="orden2"] > option[value="grupob"]').selected = true;
	document.querySelector('#formfiltro > form select[name="orden3"] > option[value="nombre"]').selected = true;
	
	_rads=document.querySelectorAll('#formfiltro > form > div > label');
	
	for(_nr in _rads){
		if(typeof _rads[_nr] != 'object'){continue;}
		if(_rads[_nr].getAttribute('val')=='todo'){toogle(_rads[_nr].querySelector('span'));console.log(_rads[_nr]);}
	}
}
mostrarFiltros();

function cargaFiltros(){
	
	/////////// registra el estado de filtro actual de grupos para conservarlo después de regenerar el listado.
	_v={'grupoa':'todo','grupob':'todo'}		
	if(document.querySelector('#formfiltro [name="grupoa"]')!=null){
		_v['grupoa']=document.querySelector('#formfiltro [name="grupoa"]').value;
	}
		
	if(document.querySelector('#formfiltro [name="grupob"]')!=null){
		_v['grupob']=document.querySelector('#formfiltro [name="grupob"]').value;
	}
	/////////////////////////////////////////
	
	
	_cATS=Array('grupoa','grupob');
	for(_nc in _cATS){
		_cat=_cATS[_nc];
		//console.log(_cat);
		
		_div=document.getElementById('F'+_cat);
		_div.innerHTML='';
		
		if(DatosDocs.categorias[_cat]==undefined){
			
			_lab=document.createElement('input');
			_lab.setAttribute('type','hidden');
			_lab.setAttribute('name',_cat);
			_lab.setAttribute('campo',_cat);
			_lab.setAttribute('value','todo');
			_div.appendChild(_lab);
			
		}else{
			
			console.log(Object.keys(DatosDocs.categorias[_cat]).length);
			if(Object.keys(DatosDocs.categorias[_cat]).length<3){
				
				_lab=document.createElement('label');
				_lab.setAttribute('class','corto');
				_lab.setAttribute('campo',_cat);
				_div.appendChild(_lab);
				_lab.innerHTML="<input type='radio' name='"+_cat+"' value='todo'><span onclick='toogle(this);filtrarDocs();'>todo</span>";
				
				_in=document.createElement('input');
				_lab.appendChild(_in);
				_in.setAttribute('type','radio');
				_in.setAttribute('name',_cat);
				_in.setAttribute('value','todo');
				
				if(_in.getAttribute('value')==_v[_cat]){
					_in.checked = true;
				}
				
				_ssp=document.createElement('span');
				_lab.appendChild(_ssp);
				_ssp.setAttribute('onclick','toogle(this);filtrarDocs();');
				_ssp.innerHTML="todo";				
				
				_sp=_lab.querySelector('span');
				
				for(_nn in DatosDocs.categorias[_cat]){
					_Nam=DatosDocs.categorias[_cat][_nn];
					_lab=document.createElement('label');
					_lab.setAttribute('class','corto');
					_div.appendChild(_lab);
										
					_in=document.createElement('input');
					_lab.appendChild(_in);
					_in.setAttribute('type','radio');
					_in.setAttribute('name',_cat);
					_in.setAttribute('value',_nn);
					
					if(_in.getAttribute('value')==_v[_cat]){
						_in.checked = true;
					}					
					_ssp=document.createElement('span');
					_lab.appendChild(_ssp);
					_ssp.setAttribute('onclick','toogle(this);filtrarDocs();');
					_ssp.innerHTML=_Nam;				
					
					
				}
				
				toogle(_sp);
				
			}else{
				_sel=document.createElement('select');
				_sel.setAttribute('name',_cat);
				_sel.setAttribute('onchange','filtrarDocs()');
				_div.appendChild(_sel);
				_op=document.createElement('option');
				_sel.appendChild(_op);
				_op.setAttribute('name',_cat);
				_op.value='todo';
				_op.innerHTML='todo';						
				
				for(_nn in DatosDocs.categorias[_cat]){
					
					_Nam=DatosDocs.categorias[_cat][_nn];
					
					_op=document.createElement('option');
					_sel.appendChild(_op);
					_op.setAttribute('name',_cat);
					_op.value=_nn;
					_op.innerHTML=_Nam;		
					
					if(_nn==_v[_cat]){
						console.log('es:'+_nn);
						_op.selected = 'selected';
					}
				}
			}
		}
	}
}




function cargarPermisos(){
	
	if(_HabilitadoEdicion=='si'){
		document.querySelector("#inhabilitadaedicion").disabled=true;
	}
	
	_ocults=document.querySelectorAll('[soloeditores="ver"]');
	
	if(_HabilitadoEdicion!='si'){
		for(_on in _ocults){
			if(typeof(_ocults[_on])!='object'){continue;}
			_ocults[_on].style.display='none';
		}
	}
	if(_HabilitadoEdicion=='si'){
		for(_on in _ocults){
			if(typeof(_ocults[_on])!='object'){continue;}
			_ocults[_on].removeAttribute('style');
		}
	}
	
	_readonlys=document.querySelectorAll('[soloeditores="cambia"]');
	
	if(_HabilitadoEdicion!='si'){
		for(_on in _readonlys){
			if(typeof(_readonlys[_on])!='object'){continue;}
			_readonlys[_on].setAttribute('readonly','readonly');
		}
	}
	if(_HabilitadoEdicion=='si'){
		for(_on in _readonlys){
			if(typeof(_readonlys[_on])!='object'){continue;}
			_readonlys[_on].removeAttribute('readonly');
		}
	}
}



function actualizarMuestra(_res,_idreg,_modo){
	if(_modo==null){_modo='normal';}
	_conE=document.getElementById('contenidoextensoPost');
	_Categ=_res.data.categorias;
	_datos=_res.data.docs[_idreg];
	if(_conE.querySelector(".fila[idreg='"+_idreg+"']") != null){ //registro existente	
		_fila =_conE.querySelector(".fila[idreg='"+_idreg+"']");
	}else{
		var _Categ=_res.data.categorias;
		console.log(_modo);
		_fila=generarFila(_datos,null,_modo);
	}
	_fila.innerHTML='';	
	_fila.setAttribute('class','fila');
	_fila.setAttribute('idreg',_datos.id);
	if(_datos.grupoa==null){_I1=0;}else{_I1=_datos.grupoa;}
	_fila.setAttribute('ga',_I1);
	if(_datos.grupob==null){_I2=0;}else{_I2=_datos.grupob;}
	_fila.setAttribute('gb',_I2);
	
	_fila.innerHTML="<div class='sector'>"+_Categ.id_sector[_datos.id_sector].nombre+"</div>";
	_fila.innerHTML+="<div class='planta'>"+_Categ.id_planta[_datos.id_planta].nombre+"</div>";
	_fila.innerHTML+="<div class='activo selector' onclick='event.stopPropagation();multieditDOC(this,event,\"\");_ultimamarca=\"4\";' iddoc='"+_idreg+"' name='selector'>";
	
	_dnum=document.createElement('a');
	_dnum.setAttribute('class','numero');
	_dnum.setAttribute('onclick','formularDocumento(this.parentNode.getAttribute("idreg"),"cargar")');
	_dnum.innerHTML=_datos.numerodeplano;
	_fila.appendChild(_dnum);
	
	_dnom=document.createElement('a');
	_dnom.setAttribute('class','nombre');
	_dnom.setAttribute('onclick','formularDocumento(this.parentNode.getAttribute("idreg"),"cargar")');
	_dnom.innerHTML=_datos.nombre;
	_fila.appendChild(_dnom);
		
	
	_fila.innerHTML+="<div class='escala'>"+_Categ.id_escala[_datos.id_escala].nombre+"</div>";
	_fila.innerHTML+="<div class='rubro'>"+_Categ.id_rubro[_datos.id_rubro].nombre+"</div>";
	_fila.innerHTML+="<div class='tipologia'>"+_Categ.id_tipologia[_datos.id_tipologia].nombre+"</div>";
	var _divest=document.createElement('div');
	_divest.setAttribute('class','estado');										
	_fila.appendChild(_divest);
	
	var _divfech=document.createElement('div');
	_divfech.setAttribute('class','fecha');										
	_fila.appendChild(_divfech);
	
	_versionesv=document.createElement('div');
	_versionesv.setAttribute('class','versionesventana');
	
	_versionesc=document.createElement('div');
	_versionesc.setAttribute('class','cversiones');
	_versionesv.appendChild(_versionesc);
	
	//console.log("____"+_idreg);
	for(_vn in _datos.versionesOrden){
		_idv = _datos.versionesOrden[_vn];
		_datv=_datos.versiones[_idv];
		_estado=_datv.estado;
		_estadotx=_datv.estadotx;
		
		_divest.innerHTML=_estadotx;
		_divest.setAttribute('class','estado '+_estado);
		
		_divfech.innerHTML=_datv.desde;
		
		_verI =document.createElement('div');
		_verI.setAttribute('class','version '+_estado);
		_verI.setAttribute('name','cuadrodeversiones');
		_verI.setAttribute('onclick','event.stopPropagation();multieditVER(this,event)');
		_verI.setAttribute('selecto','no');
		_verI.setAttribute('idreg',_datv.id);
		_verI.setAttribute('ondblclick','formularVersion(this.getAttribute("idreg"),"cargar", this.parentNode.parentNode.parentNode.getAttribute("idreg"))');
		_verI.setAttribute('name','elemento');
		_verI.setAttribute('nnver',_datv.numversion);
		_verI.setAttribute('nover',_vn);
		_verI.innerHTML=_datv.numversion;
		
		if(Object.keys(_datv.archivos).length>0){		
			_img=document.createElement('img');
			_img.src="./img/hayarchivo.png";
			_ni=0;
			_str='';
			for(_nn in _datv.archivo){
                _ni+=1;
                _str+=_ni+": "+_datv.archivo[_nn].archivo;
            }
            _img.title=_str;
            _verI.appendChild(_img);	
		}
		
		_versionesc.appendChild(_verI);
	}
	
									
	_verI =document.createElement('a');
	_verI.setAttribute('class','version');
	_verI.setAttribute('ondblclick','formularVersion(this.getAttribute("idreg"),"crear",this.parentNode.parentNode.parentNode.getAttribute("idreg"))');
	_verI.innerHTML="+";
	_versionesc.appendChild(_verI);
		
	_fila.appendChild(_versionesv);
	//_fila.innerHTML=_docid;				

}	

var _VerCols={
	'sector':1,
	'planta':1,
	'numero':1,
	'nombre':1,
	'escala':1,
	'rubro':1,
	'tipologia':1,
	'estado':1,
	'descargas':1,
	'versiones':1,
	'fecha':1
};
function verCol(_this){	
	_cn=_this.getAttribute('class');	
	_VerCols[_cn]=parseInt(_VerCols[_cn])*-1;
	consultarDocs();
}

function mostratComoTabla(_res){
	_conE=document.getElementById('contenidoextensoPost');	
	_conE.innerHTML='';
	
	_cont=document.createElement('table');
	_cont.setAttribute('id','tabvercol');
	_conE.appendChild(_cont);	
	_fila=document.createElement('tr');
	_fila.setAttribute('class','fila titulines');	
	_fila.setAttribute('id','vercols');
	for(_cn in _VerCols){
		_td=document.createElement('td');
		_td.setAttribute('ver',_VerCols[_cn]);
		_td.setAttribute('class',_cn);		
		_td.setAttribute('onclick','verCol(this)');
		_td.innerHTML="<span>"+_cn+"<img id='si' src='./img/ojo.png'><img id='no' src='./img/candado.png'></span>";
		_fila.appendChild(_td);
	}
	_cont.appendChild(_fila);
		
	_cont=document.createElement('table');
	_cont.setAttribute('id','cont');
	_conE.appendChild(_cont);
	
	//itera datos para saber cuantas columnas de versiones poner en la tabla
	_vercols=0;
	
	for( _docid in _res.data.docs){
		_datos=_res.data.docs[_docid];
		_vercols=Math.max(_vercols, Object.keys(_datos.versiones).length);
	}
	
	
	_res.data.grupos[0]={'nombre':'General','tipo':'0'};	
	
	
	for(_ni in _res.data.indiceOrdenadoA){
		_I1= _res.data.indiceOrdenadoA[_ni];
		console.log(_I1);
		if(_res.data.grupos[_I1] == undefined){_res.data.grupos[_I1]=0;}

		_filaN1=document.createElement('tr');
		_cont.appendChild(_filaN1);	
		
		_filaN1.setAttribute('class','titulo');
		_filaN1.setAttribute('docs_contenidos','0');
		_filaN1.setAttribute('nivel','1');
		_filaN1.style.backgroundColor='#cccccc';
		if(_res.data.grupos[_I1] == undefined){_grupo ='General';}else{
			_grupo =_res.data.grupos[_I1].nombre;
		}
		_th=document.createElement('th');
		_th.style.backgroundColor='#cccccc';
		_th.innerHTML="<h1>"+_grupo+"</h1>";
		_th.setAttribute('colspan',3);
		_filaN1.appendChild(_th);
		
		_c=0;
		for(_cn in _VerCols){
			if(_VerCols[_cn]==-1){continue;}
			_c++;
			if(_c<=3){continue;}
			_td =document.createElement('td');
			if(_cn=='versiones'){
			 	_td.setAttribute('colspan',_vercols);	
			}
			_filaN1.appendChild(_td);
		}
		
			
		for(_ni in _res.data.indiceOrdenadoB){
			_I2= _res.data.indiceOrdenadoB[_ni];
			if(_res.data.grupos[_I2] == undefined){_res.data.grupos[_I2] = '0';}		
			
			if(_res.data.grupos[_I2] == ''){_res.data.grupos[_I2] = '0';}	
			
			_filaN2=document.createElement('tr');
			_cont.appendChild(_filaN2);	
			
			_filaN2.setAttribute('class','titulo');
			
			_filaN2.setAttribute('docs_contenidos','0');
			_filaN2.setAttribute('nivel','2');
			_filaN2.style.backgroundColor='#cccccc';
			if(_res.data.grupos[_I2] == undefined){_grupo ='General';}else{
				_grupo =_res.data.grupos[_I2].nombre;
			}			
			_th=document.createElement('th');
			_th.innerHTML="<h2>"+_grupo+"</h2>";
			_th.setAttribute('colspan',3);
			_filaN2.appendChild(_th);
			
			_c=0;
			for(_cn in _VerCols){
				if(_VerCols[_cn]==-1){continue;}
				_c++;
				if(_c<=3){continue;}
				_td =document.createElement('td');
				if(_cn=='versiones'){
				 	_td.setAttribute('colspan',_vercols);	
				}
				_filaN2.appendChild(_td);
			}	
			
			
			_filaN3=document.createElement('tr');
			_filaN3.setAttribute('class','titulines');	
			_filaN3.setAttribute('docs_contenidos','0');		
			for(_cn in _VerCols){
				if(_VerCols[_cn]==-1){continue;}
				_td =document.createElement('td');
				_td.innerHTML=_cn;
				if(_cn=='versiones'){
				 	_td.setAttribute('colspan',_vercols);	
				}
				_filaN3.appendChild(_td);
			}
			_cont.appendChild(_filaN2);		
			
			//console.log(_I1+' + '+_I2);
			
			if(_res.data.indice[_I1]==undefined){continue;}
			if(_res.data.indice[_I1][_I2]==undefined){continue;}
			for(_I3 in _res.data.indice[_I1][_I2]){
				//console.log(' i3: '+_I3);
				for(_I4 in _res.data.indice[_I1][_I2][_I3]){
					//console.log(' i4: '+_I4);
					for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
						//console.log(' i5: '+_I5);
						for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
							//console.log(' i6: '+_I6);
							_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
							
							_datos=_res.data.docs[_docid];
							
							_fila=document.createElement('tr');
							_cont.appendChild(_fila);
							console.log(_fila);
							
							_nd=Number(_filaN1.getAttribute('docs_contenidos'));
							_filaN1.setAttribute('docs_contenidos',_nd+1);
							_nd=Number(_filaN2.getAttribute('docs_contenidos'));
							_filaN2.setAttribute('docs_contenidos',_nd+1);
							_nd=Number(_filaN3.getAttribute('docs_contenidos'));
							_filaN3.setAttribute('docs_contenidos',_nd+1);
							
							
							
							_fila.setAttribute('class','fila');
							_fila.setAttribute('ga',_I1);
							_fila.setAttribute('gb',_I2);
							
							_tdvers=Array();
							_c=0;
							_bg="#fff";	
							_estado='apresentar';
							_estadotx='a presentar';
							_fecha='';
							for(_vn in _datos.versionesOrden){
								_idv=_datos.versionesOrden[_vn];
								_datv=_datos.versiones[_idv];
								_c++;
																	
								_estado=_datv.estado;
								_estadotx=_datv.estadotx;
								
								_fecha=_datv.desde;
								
								_verI =document.createElement('td');
								_tdvers.push(_verI);
								_verI.setAttribute('class','version '+_estado);
								
								
								if(_estado=='aprobada'){
									_verI.setAttribute('style','background-color:#37ff37');
									_bg="#37ff37";
								}
								if(_estado=='rechazada'){
									_verI.setAttribute('style','background-color:#FF565B');
									_bg="#FF565B";
								}
								if(_estado=='enevaluacion'){
									_verI.setAttribute('style','background-color:#3797FF');
									_bg="#3797FF";
								}
			  					if(_estado=='apresentar'){
									_verI.setAttribute('style','background-color:#979797');
									_bg="#979797";
								}
			  					if(_estado=='anulada'){
									_verI.setAttribute('style','background-color:#000;color:#fff');
									_verI.setAttribute('style','color:#fff');
									_bg="#fff";						
								}
								_verI.setAttribute('name','cuadrodeversiones');
								_verI.setAttribute('name','elemento');
								_verI.innerHTML=_datv.numversion;
							}
							
							for (i = _c; i < _vercols; i++) {
							  _verI =document.createElement('td');
							  _tdvers.push(_verI);
							  _verI.setAttribute('class','version');
							  _verI.setAttribute('style','background-color:#fff;border-color:#fff');
							} 
	
														
							for(_cn in _VerCols){
								if(_VerCols[_cn]==-1){continue;}
								_td=document.createElement('td');
								_td.setAttribute('class',_cn);										
								_fila.appendChild(_td);
								
								_fila.appendChild(_td);
								
								if(_cn=='sector'){_td.innerHTML=_Categ.id_sector[_datos.id_sector].nombre;}
								if(_cn=='planta'){_td.innerHTML=_Categ.id_planta[_datos.id_planta].nombre;}
								if(_cn=='numero'){_td.innerHTML=_datos.numerodeplano;}
								if(_cn=='nombre'){_td.innerHTML=_datos.nombre;}
								if(_cn=='escala'){_td.innerHTML=_Categ.id_escala[_datos.id_escala].nombre;}
								if(_cn=='rubro'){_td.innerHTML=_Categ.id_rubro[_datos.id_rubro].nombre;}
								if(_cn=='tipologia'){_td.innerHTML=_Categ.id_tipologia[_datos.id_tipologia].nombre;}
								if(_cn=='estado'){_td.innerHTML=_estadotx;_td.setAttribute('class','estado '+_estado);_fila.setAttribute('estado',_estado);_td.style.backgroundColor=_bg;}
								if(_cn=='fecha'){_td.innerHTML=_fecha;}
								
								
								if(_cn=='descargas'){
									if(Object.keys(_datos.versiones).length>0){
										_dataver=_datos.versiones[_datos.ultimaversionid];
										for(_na in _dataver.archivos){
											_datarch=_dataver.archivos[_na];
											_aa=document.createElement('a');
											_aa.setAttribute('class','archivo');
											_aa.innerHTML=_datarch.FI_nombreorig;
											_aa.setAttribute('href','http://190.2.6.204:8237/paneldecontrol/'+_datarch.FI_documento)
											_fila.setAttribute('adjuntos','si');									
											_td.appendChild(_aa);
											_br=document.createElement('br');
											_td.appendChild(_br);
										}
										if(Object.keys(_dataver.archivos).length>0){
											_td.removeChild(_br);
										}
									}
								}
								
								if(_cn=='versiones'){
									_td.parentNode.removeChild(_td);
									for(_ntd in _tdvers){
										if(typeof _tdvers[_ntd] != 'object'){continue;}
										_fila.appendChild(_tdvers[_ntd]);
									}
								}
								
							}
							
												
							
						}
					}
				}
			}
		}
	}
	_vacios=document.querySelectorAll('#contenidoextensoPost [docs_contenidos="0"]');
	for(_ni in _vacios){
		if(typeof _vacios[_ni] != 'object'){continue;}
		_vacios[_ni].parentNode.removeChild(_vacios[_ni]);
	}
}

function mostratComoGestion(_res){
	_cont=document.getElementById('contenidoextensoPost');	
	_cont.innerHTML='';
	_Categ=_res.data.categorias;	
	
	_res.data.grupos[0]={'nombre':'General','tipo':'0'};
	
	
	for(_ni in _res.data.indiceOrdenadoA){
		_I1= _res.data.indiceOrdenadoA[_ni];
		//console.log(_I1);
		if(_res.data.grupos[_I1] == undefined){_res.data.grupos[_I1]=0;}
		
		_filaN1=document.createElement('h1');
		_filaN1.setAttribute('nivel','1');
		_filaN1.setAttribute('grupoa',_I1);
		_filaN1.setAttribute('grupob','no');
		_filaN1.setAttribute('class','titulo');
		_filaN1.setAttribute('docs_contenidos','0');
		_filaN1.setAttribute('idreg',_I1);
		_filaN1.setAttribute('tipo',_res.data.grupos[_I1].tipo);
		_filaN1.innerHTML=_res.data.grupos[_I1].nombre;
		_cont.appendChild(_filaN1);

		//console.log(_filaN1);
		for(_ni in _res.data.indiceOrdenadoB){
			_I2= _res.data.indiceOrdenadoB[_ni];
			if(_res.data.grupos[_I2] == undefined){_res.data.grupos[_I2] = '0';}		
			
			if(_res.data.grupos[_I2] == ''){_res.data.grupos[_I2] = '0';}		
			//console.log('idgb: '+_I2);
			
			_filaN2=document.createElement('h2');
			_filaN2.setAttribute('nivel','2');
			_filaN2.setAttribute('class','titulo');
			_filaN2.setAttribute('docs_contenidos','0');
			_filaN2.setAttribute('grupoa',_I1);
			_filaN2.setAttribute('enid',_I1);
			_filaN2.setAttribute('grupob',_I2);
			_filaN2.setAttribute('idreg',_I2);
			_filaN2.setAttribute('tipo',_res.data.grupos[_I2].tipo);
			_filaN2.innerHTML=_res.data.grupos[_I2].nombre;
			_cont.appendChild(_filaN2);
			
			if(_res.data.indice[_I1]==undefined){continue;}
			if(_res.data.indice[_I1][_I2]==undefined){continue;}
			for(_I3 in _res.data.indice[_I1][_I2]){
					
				for(_I4 in _res.data.indice[_I1][_I2][_I3]){
					for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
						for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
							_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
							
							if(_res.data.docs[_docid]==undefined){
									continue;//este deocumento fue filtrado por no involucrear a la comunicacion en get
							}
							
							//console.log(_docid);
							_datos=_res.data.docs[_docid];
							//console.log(_datos);
							generarFila(_datos);
							
							_nd=Number(_filaN1.getAttribute('docs_contenidos'));
							_filaN1.setAttribute('docs_contenidos',_nd+1);
							_nd=Number(_filaN2.getAttribute('docs_contenidos'));
							_filaN2.setAttribute('docs_contenidos',_nd+1);
							
						}						
					}	
				}
			}			
		}
	}
	_vacios=document.querySelectorAll('#contenidoextensoPost .titulo[docs_contenidos="0"]');
	for(_ni in _vacios){
		if(typeof _vacios[_ni] != 'object'){continue;}
		_vacios[_ni].parentNode.removeChild(_vacios[_ni]);
	}
	/*
	
	for(_I1 in _res.data.indice){
		if(_I1!=-1){
			_fila=document.createElement('h1');
			if(_res.data.grupos[_I1] == undefined){
				_res.data.grupos[_I1]=0;
			}
			_fila.setAttribute('nivel','1');
			_fila.setAttribute('class','titulo');
			_fila.setAttribute('idreg',_I1);
			_fila.setAttribute('tipo',_res.data.grupos[_I1].tipo);
			_fila.innerHTML=_res.data.grupos[_I1].nombre;
			_cont.appendChild(_fila);

			for(_I2 in _res.data.indice[_I1]){
				_fila=document.createElement('h2');	
				if(_res.data.grupos[_I2] == undefined){_res.data.grupos[_I2] == '0';}
				
				_fila.setAttribute('nivel','2');
				_fila.setAttribute('class','titulo');
				_fila.setAttribute('enid',_I1);
				_fila.setAttribute('idreg',_I2);
				_fila.setAttribute('tipo',_res.data.grupos[_I2].tipo);
				_fila.innerHTML=_res.data.grupos[_I2].nombre;
				_cont.appendChild(_fila);

				for(_I3 in _res.data.indice[_I1][_I2]){
					
					for(_I4 in _res.data.indice[_I1][_I2][_I3]){
						for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
							for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
								_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
								
								if(_res.data.docs[_docid]==undefined){
										continue;//este deocumento fue filtrado por no involucrear a la comunicacion en get
								}
								
								_datos=_res.data.docs[_docid];
								
								generarFila(_datos);
							}						
						}	
					}
				}	
			}
		}
	}*/
}


function remuestrearIndiceGestion(_res){
	
	_cont=document.querySelector('#contenidoextensoPost');
	cont_i=0;
	
	iteracionListado:
	for(_nl in _res.data.listado){
		cont_i++;
		_ldat=_res.data.listado[_nl];
		
		_renglones=_cont.querySelectorAll('.fila, .titulo');
		cont_r = 0;
		iteracionRenglonesExistentes:
		for(_nr in _renglones){
			cont_r++;
			if(typeof _renglones[_nr] != 'object'){continue}
			_renglon=_renglones[_nr];
			
			
			//console.log(cont_i+' vs '+cont_r);
				
			if(cont_i==cont_r){
				//console.log(_renglon.getAttribute('nivel')+' vs '+_ldat.nivel);
				//console.log(_renglon.getAttribute('idreg')+' vs '+_ldat.idreg);
				//console.log(_renglon.getAttribute('class')+' vs '+_ldat['class']);
				
				if(
					_renglon.getAttribute('nivel')==_ldat.nivel
					&&
					_renglon.getAttribute('idreg')==_ldat.idreg
					&&
					_renglon.getAttribute('class')==_ldat['class']
				){
					
					//console.log(' renglon macheado ');
					continue iteracionListado;	
				}else{
					
					if(_ldat['nivel']=='2'){
						_consulta='.'+_ldat['class']+'[nivel="'+_ldat['nivel']+'"][idreg="'+_ldat['idreg']+'"][enid="'+_ldat['enid']+'"]';
					}else{
						_consulta='.'+_ldat['class']+'[nivel="'+_ldat['nivel']+'"][idreg="'+_ldat['idreg']+'"]';
					}
					//console.log(_consulta);
					if(document.querySelector(_consulta)==null){
					
					//console.log('creando '+_ldat['class']);
					
						if(_ldat['class']=='titulo'){
									
							_fila=document.createElement('h'+_ldat['nivel']);	
							_fila.setAttribute('nivel',_ldat['nivel']);
							_fila.setAttribute('class',_ldat['class']);
							_fila.setAttribute('idreg',_ldat['idreg']);
							_fila.setAttribute('tipo',_Grupos.grupos[_ldat['idreg']].tipo);
							_fila.innerHTML=DatosDocs.grupos[_ldat['idreg']].nombre;
							_cont.insertBefore(_fila,_renglon);
							continue iteracionListado;
							
						}else if(_ldat['class']=='fila'){
							
							_fila=generarFila(_datos);	
							_cont.insertBefore(_fila,_renglon);
							//console.log('creando ');
							continue iteracionListado;
							
						}
						
					}else{
						
						_fila=document.querySelector(_consulta);
						_cont.insertBefore(_fila,_renglon);
						//console.log('fila movida');
						continue iteracionListado;
					}
				}
			}
		}
	}



/*
	iteracionRenglonesExistentes:
	for(_nr in _renglones){
		cont_r++;
		if(typeof _renglones[_nr] != 'object'){continue}
		_renglon=_renglones[_nr];
		
		cont_i=0;
		iteracionIndice:
		for(_I1 in _res.data.indice){
			
			if(_I1!=-1){
				
				cont_i++;
				
				console.log(cont_i+' vs '+cont_r);
				
				if(cont_i==cont_r){
					
					console.log(_renglon.getAttribute('nivel')+' vs '+'1');
					console.log(_renglon.getAttribute('id')+' vs '+_I1);
					
					if(
						_renglon.getAttribute('nivel')=='1'
						&&
						_renglon.getAttribute('id')==_I1
					){
						//renglon macheado
						console.log(' renglon macheado ');
						continue iteracionRenglonesExistentes;
						
					}else{
					
						if(document.querySelector('.titulo[nivel="1"][id="'+_I1+'"]')==null){
							
							console.log(' creandotitulo');
						
							if(_res.data.grupos[_I1] == undefined){_res.data.grupos[_I1]=0;}						
							_fila=document.createElement('h1');	
							_fila.setAttribute('nivel','1');
							_fila.setAttribute('class','titulo');
							_fila.setAttribute('id',_I1);
							_fila.setAttribute('tipo',_res.data.grupos[_I1].tipo);
							_fila.innerHTML=_res.data.grupos[_I1].nombre;
							_cont.insertBefore(_fila,_renglon);
							continue iteracionRenglonesExistentes;
						}else{
							_fila=document.querySelector('.titulo[nivel="1"][id="'+_I1+'"]');
							_cont.insertBefore(_fila,_renglon);
							console.log('  movidendo titulo');
							alert('1');
							console.log(_fila);
							continue iteracionRenglonesExistentes;
						}
						
					}	
				}	
				
	
				for(_I2 in _res.data.indice[_I1]){
					cont_i++;
					
					console.log(cont_i+' vs '+cont_r);
					
					if(cont_i==cont_r){
						
						
						console.log(_renglon.getAttribute('nivel')+' vs '+'2');
						console.log(_renglon.getAttribute('id')+' vs '+_I2);
						
						if(
							_renglon.getAttribute('nivel')=='2'
							&&
							_renglon.getAttribute('id')==_I2
						){
							//renglon macheado
							console.log(' englon macheado ');
							continue iteracionRenglonesExistentes;
							
						}else{		
							
							if(document.querySelector('.titulo[nivel="2"][id="'+_I2+'"]')==null){							
							
								if(_res.data.grupos[_I2] == undefined){_res.data.grupos[_I2]=0;}
								_fila=document.createElement('h1');
								_fila.setAttribute('nivel','2');
								_fila.setAttribute('class','titulo');
								_fila.setAttribute('id',_I2);
								_fila.setAttribute('tipo',_res.data.grupos[_I2].tipo);
								_fila.innerHTML=_res.data.grupos[_I2].nombre;
								_cont.insertBefore(_fila,_renglon);
								console.log(' creandotitulo');
								continue iteracionRenglonesExistentes;
							}else{
								_fila=document.querySelector('.titulo[nivel="2"][id="'+_I2+'"]');
								_cont.insertBefore(_fila,_renglon);
								console.log('  movidendo titulo');
								console.log(_fila);
								alert('2');
								continue iteracionRenglonesExistentes;
							}						
						}
					}	
					
					for(_I3 in _res.data.indice[_I1][_I2]){						
						for(_I4 in _res.data.indice[_I1][_I2][_I3]){
							for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
								for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
									_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
									
									if(_res.data.docs[_docid]==undefined){
											continue;//este deocumento fue filtrdo por no involucrear a la comunicacion en get
									}
									
									cont_i++;
									
									console.log(cont_i+' vs '+cont_r);
									
									if(cont_i==cont_r){
										
										console.log(_renglon.getAttribute('nivel')+' vs '+'doc');
										console.log(_renglon.getAttribute('idreg')+' vs '+_docid);
										
										if(
											_renglon.getAttribute('nivel')=='doc'
											&&
											_renglon.getAttribute('idreg')==_docid
										){
											console.log(' englon macheado ');
											//renglon macheado
											continue iteracionRenglonesExistentes;
										}else{
										
											_datos=_res.data.docs[_docid];
											if(document.querySelector('.fila[idreg="'+_docid+'"]')==null){
												_fila=generarFila(_datos);	
												_cont.insertBefore(_fila,_renglon);
												console.log('creando ');
												continue iteracionRenglonesExistentes;
											}else{
												_fila=document.querySelector('.fila[idreg="'+_docid+'"]');
												_cont.insertBefore(_fila,_renglon);
												console.log('  movidendofila');
												console.log(_fila);
												continue iteracionRenglonesExistentes;
											}
										}										
									}
								}						
							}	
						}
					}	
				}
			}
		}	
	}*/
	_Estado='cargado';
}



function editarMultiVersion(_accion){
	
	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles
	_viejo=document.getElementById('formCent');
	if(_viejo!=null){
		_viejo.parentNode.removeChild(_viejo);
	}		
	
	_form=document.createElement('form');
	_form.setAttribute('id','formCent');
	_form.setAttribute('tipo','multiversion');
	_form.setAttribute('ondragstart','drag_start(event,this)');
	_form.setAttribute('ondblclick','reposForm(this)');
	_form.setAttribute('tipo','multiversion');
	//_form.setAttribute('ondrag','drag_end(event,this)');
	_form.setAttribute('draggable','true');
	_form.setAttribute('class','formCent');
	_form.style.display='block';
	_form.setAttribute('ga',_I1);
	_form.setAttribute('gb',_I2);
	document.body.appendChild(_form);
	
	_cargando=document.createElement('img');
	_cargando.setAttribute('src','./img/cargando.gif');
	_cargando.setAttribute('id','cargando');
	_form.appendChild(_cargando);
	
	var _this = _this;
	var _accion = _accion;
	
	
	$.ajax({
		url: './DOC/DOC_form_multiversion.php',
		dataType: 'html',
		type: 'GET'
	}).done(function(html) {
		_form.innerHTML=html;
		_form.style.display='block';
			
			_menu=_form.querySelectorAll('#comunicacionesCambia > label');
			
			for(_nn in _menu){
				if(typeof _menu[_nn] !='object'){continue;}
				//console.log(_menu[_nn].getAttribute('id')+" "+_accion);
				 if(_menu[_nn].getAttribute('id')==_accion){
				 	_menu[_nn].style.display="inline-block";
				 }else{
				 	_menu[_nn].style.display="none";
				 }
			}
			
			if(_accion=='fecha'){
				_form.querySelector('#inputfecha').style.display='inline-block';
				_form.querySelector('.muestra').style.display='none';
				_form.querySelector('#op_comunicacionesCambia').style.display='none';
				
				_form.querySelector('#vaciarcomunicacion').style.display='none';
				_form.querySelector('#vaciarfecha').style.display='inline-block';				
			}else{
				_form.querySelector('#inputfecha').style.display='none';
				_form.querySelector('.muestra').style.display='inline-block';
				_form.querySelector('#op_comunicacionesCambia').style.display='inline-block';
				
				_form.querySelector('#vaciarcomunicacion').style.display='inline-block';
				_form.querySelector('#vaciarfecha').style.display='none';
			}
			
			
			if(_accion=='fecha'){_campo='previstoactual';}
			if(_accion=='pre'){_campo='id_p_comunicaciones_id_ident_entrante';}
			if(_accion=='apr'){_campo='id_p_comunicaciones_id_ident_aprobada';}
			if(_accion=='rev'){_campo='id_p_comunicaciones_id_ident_rechazada';}
			if(_accion=='anu'){_campo='id_p_comunicaciones_id_ident_anulada';}		
			_form.querySelector('#Icampo').value=_campo;
			
			_MultiId='';
			
			_Ga={};
			_Gb={};
			for(_idV in _VerSeleccionData){
				_MultiId+=_idV+',';
				_dat=_VerSeleccionData[_idV];
				_iddoc=_dat.id_p_DOCdocumento_id;
				
				
				if(DatosDocs.docs[_iddoc] == undefined){alert('se registra la versión id:'+_idV+' asociada al documento id:'+_iddoc+' sin represantación para este panel');}
				_docnom=DatosDocs.docs[_iddoc].numerodeplano;
				
				
				_Ga[DatosDocs.docs[_iddoc].id_p_grupos_id_nombre_tipoa]='si';
				_Gb[DatosDocs.docs[_iddoc].id_p_grupos_id_nombre_tipob]='si';
				
				_docGa=DatosDocs.docs[_iddoc].id_p_grupos_id_nombre_tipoa;
				_docGb=DatosDocs.docs[_iddoc].id_p_grupos_id_nombre_tipob;
				
				_vernum=_dat.numversion;
				
				_clon=_form.querySelector('#versionmodelo').cloneNode(true);
				_form.querySelector('#listadeversiones').appendChild(_clon);
				
				_clon.removeAttribute('id');
				_clon.querySelector('#documento').innerHTML=_docnom;
				_clon.querySelector('#numero').innerHTML=_vernum;
				
				
				if(_dat.previstoactual==''||_dat.previstoactual=='0000-00-00'){
					_fecha='sin prev';	
				}else{
					_fecha=_dat.previstoactual;
				}
				_clon.querySelector('#fecha').innerHTML=_fecha;
				
				if(_dat.idpresenta>0){
					_pre="<span class='enevaluacion'>X</span>";
				}else{
					_pre="-";
				}
				_clon.querySelector('#pre').innerHTML=_pre;
				
				if(_dat.idaprueba>0){
					_apr="<span class='aprobada'>X</span>";
				}else{
					_apr="-";
				}
				_clon.querySelector('#apr').innerHTML=_apr;
				
				if(_dat.idrechaza>0){
					_rev="<span class='rechazada'>X</span>";
				}else{
					_rev="-";
				}
				_clon.querySelector('#rev').innerHTML=_rev;
				
				if(_dat.idanula>0){
					_anu="<span class='anulada'>X</span>";
				}else{
					_anu="-";
				}
				_clon.querySelector('#anu').innerHTML=_anu;
				
				
			}
			_form.querySelector('#Mid').value=_MultiId;
			
			_form.setAttribute('ga',JSON.stringify(_Ga));
			_form.setAttribute('gb',JSON.stringify(_Gb));
				
			if(_accion!='fecha'){
				_dummy=_form.querySelector('#dummy');
				if(_accion=='pre'){_tipo='presenta';}
				if(_accion=='apr'){_tipo='aprueba';}
				if(_accion=='rev'){_tipo='rechaza';}
				if(_accion=='anu'){_tipo='anula';}
				elegirComMulti(_dummy,_tipo);
			}		
	});
	
}


function formularDocMultieditEditar(){
	_viejo=document.getElementById('formCent');
	if(_viejo!=null){
		_viejo.parentNode.removeChild(_viejo);
	}		
	_form=document.createElement('form');
	_form.style.display='block';
	_form.setAttribute('id','formCent');
	
	_form.setAttribute('ondragstart','event.stopPropagation();drag_start(event,this)');
	_form.setAttribute('ondblclick','reposForm(this)');
	
	//_form.setAttribute('ondrag','drag_end(event,this)');
	_form.setAttribute('draggable','true');
	_form.setAttribute('tipo','documento');
	_form.setAttribute('class','formCent');
	
	
	document.body.appendChild(_form);
	
	$.ajax({
		url: './DOC/DOC_form_doc.php',
		dataType: 'html',
		contentType:"application/x-javascript; charset=CP1252",
		type: 'GET'
	}).done(function(html) {
		_form.innerHTML=html;
		_form.style.display='block';

		_form.querySelector('#cnid').innerHTML='multiple';
		_form.querySelector('#cid').value=JSON.stringify(_seleccionDOCSid['unico']);
		
		_form.querySelector('#Iaccion').value='cambiamultiple';
		_form.querySelector('#bborra').style.display='none';
		
		_form.querySelector('#Inumero').value='';
		_form.querySelector('#Inumero').setAttribute('disabled','disabled');
		_form.querySelector('#Inombre').setAttribute('disabled','disabled');
		
		_form.querySelector('#cdescripcion').value='';		
		
		_form.querySelector('#versiones').style.display='none';
		
		_camposdef=[
		'rubro',
		'escala',
		'planta',
		'sector',
		'tipologia'
		];
		
		
		_valores={};
		for(_nr in _camposdef){            
            _valores[_camposdef]='';
            _catref='id_'+_camposdef[_nr];
            _catcampo='id_p_DOCdef_id_nombre_tipo_'+_camposdef[_nr];
            
            _ref='';
        	for(_ns in _seleccionDOCSid.unico){				
				_idd=_seleccionDOCSid.unico[_ns];
				console.log(_idd);
				console.log(_catref);
				if(_ref==''){
					_ref=DatosDocs.docs[_idd][_catref];
				}
				if(_ref!=DatosDocs.docs[_idd][_catref]){
					_ref='[VARIOS]';
				}
			}
			if(_ref==undefined){_ref='';}
			
			if(_ref=='[VARIOS]'){                    
                _form.querySelector('#I'+_catcampo).value=_ref;
                _form.querySelector('#I'+_catcampo+'-n').value=_ref;
            }else{
				
				console.log('catref:'+_catref);
				console.log('_ref:'+_ref);
				
				if(_ref!=''){                    
					_form.querySelector('#I'+_catcampo).value=_ref;
					_form.querySelector('#I'+_catcampo+'-n').value=DatosDocs.categorias[_catref][_ref].nombre;
				}else{
					_form.querySelector('#I'+_catcampo).value='';
					_form.querySelector('#I'+_catcampo+'-n').value='-';
				}
			}
		}
		


		_camposdef=[
		'a',
		'b'
		];
		
		
		_valores={};
		for(_nr in _camposdef){            
            _valores[_camposdef]='';
            _catref='grupo'+_camposdef[_nr];
            _catcampo='id_p_grupos_id_nombre_tipo'+_camposdef[_nr];
                       
            
            _ref='';
        	for(_ns in _seleccionDOCSid.unico){				
				
				_idd=_seleccionDOCSid.unico[_ns];
				
				console.log(DatosDocs.docs[_idd][_catcampo]);
				
				if(_ref==''){
					_ref=DatosDocs.docs[_idd][_catcampo];
				}
				
				if(_ref!=DatosDocs.docs[_idd][_catcampo]){
					_ref='[VARIOS]';
				}
			}
			
			
			if(_ref=='[VARIOS]'){                    
                _form.querySelector('#I'+_catcampo).value=_ref;
                _form.querySelector('#I'+_catcampo+'-n').value=_ref;
            }else{
				
				console.log('catref:'+_catref);
				console.log('_ref:'+_ref);
				
				if(_ref!=''){                    
					_form.querySelector('#I'+_catcampo).value=_ref;
					_form.querySelector('#I'+_catcampo+'-n').value=DatosDocs.grupos[_ref].nombre;
				}else{
					_form.querySelector('#I'+_catcampo).value='';
					_form.querySelector('#I'+_catcampo+'-n').value='-';
				}
			}
		}

			

        $('#formCent input,#formCent  textarea,#formCent a').on('mouseover',function(){
			//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
			if(document.querySelector('#formCent')!=null){
				//esto evita el arrastre en sombra del formulario 
            	document.querySelector('#formCent').removeAttribute('draggable');
           	}
            _excepturadragform='si';
        });
        $('#formCent input,#formCent textarea,#formCent a').on('mouseout',function(){
        	//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
        	if(document.querySelector('#formCent')!=null){
        		document.querySelector('#formCent').setAttribute('draggable','true');
        	}
        	//estoreactiva el arrastre del formulario
            _excepturadragform='no';
        });
        
        cargarPermisos();
	});
}



//carga formulario vacio de documentos
function formularDocumento(_docid,_accion,_modo){
	
	//console.log(_modo);
	
	if(_modo=='reciclaform'){
		_form.querySelector('#cnid').innerHTML=_docid;
		_form.querySelector('#cid').value=_docid;
		_vs=_form.querySelectorAll('#versiones > .version');
		for(_nv in _vs){
			if(typeof _vs[_nv] != 'object'){continue;}
			_vs[_nv].parentNode.removeChild(_vs[_nv]);
		}
		return;
	}
	
		
	_IdDoc=_docid;
	
	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles
	_viejo=document.querySelector('#formCent[tipo="documento"]');
	
	_acc='generar';
	if(_viejo!=null){
		if(_viejo.querySelector('input[name="iddoc"]').value!=_docid){
			_viejo.parentNode.removeChild(_viejo);
			_acc='generar';
		}else{
			_form=_viejo;
			_acc='actualizar';
		}
	}		
	if(_acc=='generar'){
		_form=document.createElement('form');
		_form.style.display='block';
		_form.setAttribute('id','formCent');
		
		_form.setAttribute('ondragstart','event.stopPropagation();drag_start(event,this)');
		_form.setAttribute('ondblclick','reposForm(this)');
		
		//_form.setAttribute('ondrag','drag_end(event,this)');
		_form.setAttribute('draggable','true');
		_form.setAttribute('tipo','documento');
		_form.setAttribute('class','formCent');
		
		_cargando=document.createElement('img');
		_cargando.setAttribute('src','./img/cargando.gif');
		_cargando.setAttribute('id','cargando');
		_form.appendChild(_cargando);
		//_form.setAttribute('ga',JSON.stringify(_I1));	
		//_form.setAttribute('gb',JSON.stringify(_I2));
		
		document.body.appendChild(_form);
		var _this   = _this;
		var _accion = _accion;
		//var self = this;
		
		
				
		
		$.ajax({
			url: './DOC/DOC_form_doc.php',
			dataType: 'html',
			contentType:"application/x-javascript; charset=CP1252",
			type: 'GET'
		}).done(function(html) {
			_form.innerHTML=html;
			_form.style.display='block';
				
			if(_accion=='crear'){
				if(_HabilitadoEdicion!='si'){
					alert('su usuario no tiene permisos de edicion');
					return;
				}
			
			}else if(_accion=='cargar'){
				
				_doC=DatosDocs.docs[_IdDoc];
				//console.log(_IdDoc);
				//console.log(_doC);
				
				_form.querySelector('#cnid').innerHTML=_docid;
				_form.querySelector('#cid').value=_docid;
				
				_form.querySelector('#Iaccion').value='cambia';
				
				_form.querySelector('#Inumero').value=_doC.numerodeplano;
				_form.querySelector('#Inombre').value=_doC.nombre;
				
				_form.querySelector('#cdescripcion').value=_doC.descripcion;		
				
				_form.querySelector('#versiones').innerHTML='';
				for(_nv in _doC.versionesOrden){
					_idver=_doC.versionesOrden[_nv];
					_datver=_doC.versiones[_idver];
					_div=document.createElement('div');
					_div.setAttribute('class','version '+_datver.estado);
					_div.setAttribute('nnver',_datver.numversion);
					_div.setAttribute('idreg',_idver);
					_div.setAttribute('nover',_nv);
					_div.setAttribute('nnver',_datver.numversion);
					_div.setAttribute('onclick','formularVersion(this.getAttribute("idreg"),"cargar",this.parentNode.parentNode.parentNode.querySelector("#cid").value)');
					_div.innerHTML=_datver.numversion;
					_form.querySelector('#versiones').appendChild(_div);
				}
				
				_verI =document.createElement('a');
				_verI.setAttribute('class','preversion');
				_verI.setAttribute('onclick','event.stopPropagation();formularVersion(null,"crear",this.parentNode.parentNode.parentNode.querySelector("#cid").value)');
				_verI.innerHTML="+";
				_form.querySelector('#versiones').appendChild(_verI);
		
				
				_camposdef=[
				'rubro',
				'escala',
				'planta',
				'sector',
				'tipologia'
				];
				
				for(_nr in _camposdef){
		            _catid=_doC['id_'+_camposdef[_nr]];
		            _catref='id_'+_camposdef[_nr];
		            _catcampo='id_p_DOCdef_id_nombre_tipo_'+_camposdef[_nr];
		            
		            if(_catid!=''){                    
		                _form.querySelector('#I'+_catcampo).value=_catid;
		                _form.querySelector('#I'+_catcampo+'-n').value=DatosDocs.categorias[_catref][_catid].nombre;
		            }else{
		                _form.querySelector('#I'+_catcampo).value='';
		                _form.querySelector('#I'+_catcampo+'-n').value='-';
		            }
				}
				
				if(_doC.id_p_grupos_id_nombre_tipoa==''){_doC.id_p_grupos_id_nombre_tipoa=0;}
		        _form.querySelector('#Iid_p_grupos_id_nombre_tipoa').value=_doC.id_p_grupos_id_nombre_tipoa;
		        _form.querySelector('#Iid_p_grupos_id_nombre_tipoa-n').value=_Grupos.grupos[_doC.id_p_grupos_id_nombre_tipoa].nombre;
			
				if(_doC.id_p_grupos_id_nombre_tipob==''){_doC.id_p_grupos_id_nombre_tipob=0;}
		        _form.querySelector('#Iid_p_grupos_id_nombre_tipob').value=_doC.id_p_grupos_id_nombre_tipob;
		        _form.querySelector('#Iid_p_grupos_id_nombre_tipob-n').value=_Grupos.grupos[_doC.id_p_grupos_id_nombre_tipob].nombre;
		          
		          
		          
		        $('#formCent input,#formCent  textarea,#formCent a').on('mouseover',function(){
					//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
					if(document.querySelector('#formCent')!=null){
						//esto evita el arrastre en sombra del formulario 
		            	document.querySelector('#formCent').removeAttribute('draggable');
		           	}
		            _excepturadragform='si';
		        });
		        $('#formCent input,#formCent textarea,#formCent a').on('mouseout',function(){
		        	//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
		        	if(document.querySelector('#formCent')!=null){
		        		document.querySelector('#formCent').setAttribute('draggable','true');
		        	}
		        	//estoreactiva el arrastre del formulario
		            _excepturadragform='no';
		        });
		        
		        cargarPermisos();
		    }
			
		});
	}else if(_acc=='actualizar'){

		_doC=DatosDocs.docs[_IdDoc];
		//console.log(_IdDoc);
		//console.log(_doC);
		
		_form.querySelector('#versiones').innerHTML='';
		for(_nv in _doC.versionesOrden){
			_idver=_doC.versionesOrden[_nv];
			_datver=_doC.versiones[_idver];
			_div=document.createElement('div');
			_div.setAttribute('class','version '+_datver.estado);
			_div.setAttribute('nnver',_datver.numversion);
			_div.setAttribute('idreg',_idver);
			_div.setAttribute('nover',_nv);
			_div.setAttribute('nnver',_datver.numversion);
			_div.setAttribute('onclick','formularVersion(this.getAttribute("idreg"),"cargar",this.parentNode.parentNode.parentNode.getAttribute("idreg"))');
			_div.innerHTML=_datver.numversion;
			_form.querySelector('#versiones').appendChild(_div);
		}
		
		_verI =document.createElement('a');
		_verI.setAttribute('class','preversion');
		_verI.setAttribute('onclick','event.stopPropagation();formularVersion(null,"crear","'+_docid+'")');
		_verI.innerHTML="+";
		_form.querySelector('#versiones').appendChild(_verI);


	}
	
};


function muestraArchivoForm(_dataarchivo){
	_spl=_dataarchivo.FI_documento.split("/");
	_aaa=document.createElement('a');
	_aaa.setAttribute('download',_dataarchivo.FI_nombreorig);
	_aaa.setAttribute('class','archivo');
	_aaa.setAttribute('href',_dataarchivo.FI_documento);
	_aaa.innerHTML='<img src="./img/hayarchivo.png"><span id="nom">'+_dataarchivo.FI_nombreorig+'</span>';
	_aaa.title=_dataarchivo.FI_nombreorig;
	_form.querySelector('#archivos #listadosubido').appendChild(_aaa);
	
	_aab=document.createElement('a');
	_aab.setAttribute('idarch',_dataarchivo.id);
	_aab.setAttribute('class','archivoelim');
	_aab.setAttribute('archivo',_dataarchivo.FI_documento);
	_aab.setAttribute('onclick','ConfEliminarArchivo(this,event)');
	_aab.innerHTML='elim';
	_aaa.appendChild(_aab);
}



function multieditDOC(_this,_event){
	
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
 	if (_event.ctrlKey!=1){
		_VerSeleccion={};
	}
			
			   
	if(typeof _grupoSelDoc == 'undefined'){
		_grupoSelDoc='unico';
	}
	
	_id=_this.parentNode.getAttribute('idreg');
	//_nuevamarca=_this.getAttribute('docorden');
	//console.log('desde:'+_nuevamarca+' hasta:'+_ultimamarca); 	
	
	_s=_this.parentNode.getAttribute('selecto');
		

	if (_event.ctrlKey==1 && _s!='si'){ // con ctrl apretado incrementará la seleccion	
		//console.log(_grupoSelDoc);
		_seleccionDOCSid[_grupoSelDoc].push(_id);
		_this.parentNode.setAttribute('selecto','si');	
		//_this.className += " seleccionado";	
	}else if(_event.ctrlKey==1 && _s=='si'){
				
		for(_grupoSelDoc in _seleccionDOCSid){			
			for(_no in _seleccionDOCSid[_grupoSelDoc]){
				if(_seleccionDOCSid[_grupoSelDoc][_no]==_id){
					_seleccionDOCSid[_grupoSelDoc].splice(_no,1);
				}	
			}
		}
		_this.parentNode.setAttribute('selecto','no');	
		
	}else if(_event.altKey==1 && _s!='si'){ // con alt apretado incorporará a la selección todos los documentos intermedios entre el último seleccionado y el actual
		if(_seleccionDOCUlt!=''){
			
			_Docs=document.querySelectorAll('#contenidoextensoPost > .fila');
			
			_marcando='no';
			_ultmarcado='no';
			_nuemarcado='no';
			//console.log(_id + ' a '+_seleccionDOCUlt);
				
			for(_nD in _Docs){
				if(typeof _Docs[_nD] != 'object'){continue;}
				
				if(
					_Docs[_nD].getAttribute('idreg')==_seleccionDOCUlt
					||_Docs[_nD].getAttribute('idreg')==_id
				){
					_marcando='si';
					//console.log('_marcando en: '+_Docs[_nD].getAttribute('idreg'));
				}
						
				if(_Docs[_nD].getAttribute('idreg')==_seleccionDOCUlt){
					_ultmarcado='si';
				}
				
				if(_Docs[_nD].getAttribute('idreg')==_id){
					_nuemarcado='si';
				}
				
				if(_marcando=='si'){
					//console.log(_Docs[_nD].getAttribute('idreg'));
					_seleccionDOCSid[_grupoSelDoc].push(_Docs[_nD].getAttribute('idreg'));
					_Docs[_nD].setAttribute('selecto','si');
				}
				
				if(_ultmarcado=='si'&&_nuemarcado=='si'){
					_marcando='no';
				}
			}
		}
	}else{
		
		_seleccionDOCSid[_grupoSelDoc]=Array(_id); // sin ctrl apretado definirá una nueva seleccion
		_Docs=document.querySelectorAll('#contenidoextensoPost > .fila');
		for(_nD in _Docs){
			if(typeof _Docs[_nD] != 'object'){continue;}
			_Docs[_nD].removeAttribute('selecto');
		}
		_this.parentNode.setAttribute('selecto','si');	
	}

	_seleccionDOCUlt=_id;	
	
	actualizarSelecDoc();
}	


function multieditVER(_this,_event,_id,_docid,_status){

	if(_HabilitadoEdicion!='si'){
        //alert('su usuario no tiene permisos de edicion');
        return;
    }
	if(_status=='apresentar'){
		_grupo='apresentar';
	}else{
		_grupo='presentados';
	}
	
	if (_event.ctrlKey!=1){
		_VerSeleccion={};
	}
				
	_sS=_this.getAttribute('selecto');
	_VerSeleccion[_this.getAttribute('idreg')]='si';
	
	if(_sS!='si'){
		if (_event.altKey==true||_event.altKey){ // con alt apretado selecionará el rango
			if(_UltSelect!=''){
				_Ndoc=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
				_Docs=document.querySelectorAll('#contenidoextensoPost > .fila');
				
				_marcando='no';
				_ultmarcado='no';
				_nuemarcado='no';
				for(_nD in _Docs){
					if(typeof _Docs[_nD] != 'object'){continue;}
					
					if(
						_Docs[_nD].getAttribute('idreg')==_UltSelect
						||_Docs[_nD].getAttribute('idreg')==_Ndoc
					){
						_marcando='si';
					}
										
					if(_Docs[_nD].getAttribute('idreg')==_UltSelect){
						_ultmarcado='si';
					}
					
					if(_Docs[_nD].getAttribute('idreg')==_Ndoc){
						_nuemarcado='si';
					}
					
					if(_marcando=='si'){
						
						_ver=_Docs[_nD].querySelectorAll('.version');
						_add='no';																		
						for(_nverd in _ver){
							if(typeof _ver[_nverd] != 'object'){continue;}
							_add=_ver[_nverd].getAttribute('idreg');
						}
						if(_add!='no'){_VerSeleccion[_add]='si';}
					}
					
					if(_ultmarcado=='si'&&_nuemarcado=='si'){
						_marcando='no';
					}
				}
			}
		}else{			
            _this.className += " seleccionado";	
			_this.setAttribute('selecto','si');		
		}
	}else{
		delete _VerSeleccion[_this.getAttribute('idreg')];
	}
	_UltSelect=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
	_versiones=document.querySelectorAll('.version');		
	for(_nv in _versiones){
		if(typeof _versiones[_nv]=='object'){
			if(_VerSeleccion[_versiones[_nv].getAttribute('idreg')]=='si'){
				_versiones[_nv].setAttribute('selecto','si');
			}else{
				_versiones[_nv].setAttribute('selecto','no');
			}
		}
	}		
	
	actulazarVerSel();	
}


function actualizarSelecDoc(){
	
	document.querySelector('#CuadroSelecionDoc #tx').innerHTML='';
	//console.log(_seleccionDOCSid);
	_contar=0;
	for(_grupo in _seleccionDOCSid){
		for(_sn in _seleccionDOCSid[_grupo]){
			_contar++;
			_id=_seleccionDOCSid[_grupo][_sn];
			//console.log(_id);
			_div=document.createElement('div');
			_div.innerHTML=document.querySelector('.fila[idreg="'+_id+'"] .numero').innerHTML;
			document.querySelector('#CuadroSelecionDoc #tx').appendChild(_div);	
		}		
	}
	if(_contar == 0){document.querySelector('#CuadroSelecionDoc').style.display='none';}else{document.querySelector('#CuadroSelecionDoc').style.display='block';}
}

function numerarFilas(){
	_filas=document.querySelector('#contenidoextenso .fila .selector');
	_norden=0;
	for(_nf in _filas){
		
		if(typeof _filas[_nf] != 'object'){continue};
		_norden++;
		_filas[_nf].setAttribute('docorden',_norden);
	}	
} 
function generarFila(_datos,_docorden,_modo){
	
	
	_cont=document.getElementById('contenidoextensoPost');		
									
	_fila=document.createElement('div');
	
	_cont.appendChild(_fila);
	
	_fila.setAttribute('nivel','doc');
	
	_fila.setAttribute('class','fila');									
	_fila.setAttribute('idreg',_datos.id);
	
	_fila.setAttribute('ga',_datos.id_p_grupos_id_nombre_tipoa);
	_fila.setAttribute('gb',_datos.id_p_grupos_id_nombre_tipob);
	
	_fila.setAttribute('onmouseover','resaltafila(event,this)');
	_fila.setAttribute('onmouseout','desaltafila(event,this)');
	_fila.setAttribute('onclick','formularDocumento(this.getAttribute("idreg"),"cargar")');
	
	_fila.innerHTML="<div class='sector'>"+_Categ.id_sector[_datos.id_sector].nombre+"</div>";
	_fila.innerHTML+="<div class='planta'>"+_Categ.id_planta[_datos.id_planta].nombre+"</div>";
	_fila.innerHTML+="<div class='activo selector' onclick='event.stopPropagation();multieditDOC(this,event,\"\");' docorden='"+_docorden+"' name='selector'>";
	
	_dnum=document.createElement('a');
    _dnum.setAttribute('class','numero');
    _dnum.setAttribute('onclick','formularDocumento(this.parentNode.getAttribute("idreg"),"cargar")');
    _dnum.innerHTML=_datos.numerodeplano;
    _fila.appendChild(_dnum);
    
    if(_IdDoc == _datos.id){console.log(_modo);formularDocumento(_datos.id,'cargar',_modo);}
    
    _dnom=document.createElement('a');
    _dnom.setAttribute('class','nombre');
    _dnom.setAttribute('onclick','formularDocumento(this.parentNode.getAttribute("idreg"),"cargar")');
    _dnom.innerHTML=_datos.nombre;
    _fila.appendChild(_dnom);
    
	_fila.innerHTML+="<div class='escala'>"+_Categ.id_escala[_datos.id_escala].nombre+"</div>";
	_fila.innerHTML+="<div class='rubro'>"+_Categ.id_rubro[_datos.id_rubro].nombre+"</div>";
	_fila.innerHTML+="<div class='tipologia'>"+_Categ.id_tipologia[_datos.id_tipologia].nombre+"</div>";
	var _divest=document.createElement('div');
	_divest.setAttribute('class','estado');										
	_fila.appendChild(_divest);
	
	var _divfech=document.createElement('div');
	_divfech.setAttribute('class','fecha');										
	_fila.appendChild(_divfech);
	
	_versionesv=document.createElement('div');
	_versionesv.setAttribute('class','versionesventana');
	
	_versionesc=document.createElement('div');
	_versionesc.setAttribute('class','cversiones');
	_versionesv.appendChild(_versionesc);
	
	
	for(_vn in _datos.versionesOrden){
		_idv=_datos.versionesOrden[_vn];
		_datv=_datos.versiones[_idv];
		_estado=_datv.estado;
		_estadotx=_datv.estadotx;
		
		_divest.innerHTML=_estadotx;
		_divest.setAttribute('class','estado '+_estado);
		_fila.setAttribute('estado',_estado);
		
		_divfech.innerHTML=_datv.desde;
		
		
		_verI =document.createElement('div');
		_verI.setAttribute('idreg',_datv.id);
		_verI.setAttribute('class','version '+_estado);
		_verI.setAttribute('name','cuadrodeversiones');
		_verI.setAttribute('onclick','event.stopPropagation();multieditVER(this,event)');
		_verI.setAttribute('selecto','no');
		_verI.setAttribute('ondblclick','formularVersion(this.getAttribute("idreg"),"cargar",this.parentNode.parentNode.parentNode.getAttribute("idreg"))');
		_verI.setAttribute('name','elemento');
		_verI.setAttribute('nnver',_datv.numversion);
		_verI.setAttribute('nover',_vn);
		_verI.innerHTML=_datv.numversion;
		
		if(_datv.extraclase!=undefined){
            _verI.setAttribute('class',_verI.getAttribute('class')+' '+_datv.extraclase);
        }
		
		//console.log(typeof _datv.archivo);
		//console.log(" | "+_docid +" _ v: "+_vn+" |");
        if(Object.keys(_datv.archivos).length>0){
			
			_fila.setAttribute('adjuntos','si');
			
			_adj=document.createElement('div');
			_adj.setAttribute('class','adjuntos');
			_adj.innerHTML='<span>'+Object.keys(_datv.archivos).length+'</span>';
			
			
			_img=document.createElement('img');
			_img.src="./img/hayarchivo.png";
			_ni=0;
			_str='';
			for(_nn in _datv.archivo){
                _ni+=1;
                _str+=_ni+": "+_datv.archivo[_nn].archivo;
            }
            _img.title=_str;
            _adj.appendChild(_img);
            _verI.appendChild(_adj);
			
		}else{
			_fila.setAttribute('adjuntos','no');
		}
		_versionesc.appendChild(_verI);
	}
									
	_verI =document.createElement('a');
	_verI.setAttribute('class','preversion');
	_verI.setAttribute('onclick','event.stopPropagation();formularVersion(this.getAttribute("idreg"),"crear",this.parentNode.parentNode.parentNode.getAttribute("idreg"))');
	_verI.innerHTML="+";
	
	_versionesc.appendChild(_verI);
	
	_fila.appendChild(_versionesv);
	//_fila.innerHTML=_docid;
	return(_fila);
}

function cargarDocs(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_form=document.getElementById("editorArchivos");
	_form.querySelector('input[name="tipo"]').value='origen';
	_form.querySelector('input[name="zz_AUTOPANEL"]').value='<?php echo $PanelI;?>';			
	_form.style.display = 'block';			
	_form.querySelector('h1#tituloformulario').innerHTML='Generar Documentos y versiones a partir de archivos';
	_form.querySelector('p#desarrollo').innerHTML='Generar Documentos y versiones a partir de archivos. Cada archivo genera una nueva documentación en función del nombre de archivo';
	
	
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


// muestra forlumlario de version
function formularVersion_muestra(){
	
	_form=document.querySelector('#formCent[tipo="version"]');
	_form.setAttribute('estado','activo');
	
	_veR=_DatosVer[_IdVer];
	_doC=DatosDocs.docs[_IdDoc];
	//console.log('doc: '+_IdDoc+' ; verno:'+_veR.numversion);
	
	_form.querySelector('#Iaccion').value='cambia';
	
	_form.querySelector('#cnid').innerHTML=_IdVer;
	_form.querySelector('#cid').value=_IdVer;
	_form.querySelector('#Iid_p_DOCdocumento_id').value=_veR.id_p_DOCdocumento_id;
	_form.querySelector('#Inumero').value=_veR.numversion;				
	_form.querySelector('#Iprevistoorig').value=_veR.previstoorig;
	_form.querySelector('#Iprevistoactual').value=_veR.previstoactual;				
	_fv=_veR.fechavence;
	if(_fv==null){_fv=_veR.fechavence_auto;}
	_form.querySelector('#Ifechavence').value=_fv;
	
	for(_nn in _veR.archivos){
		muestraArchivoForm(_veR.archivos[_nn]);
	}
	_form.querySelector('#Idescripcion').value=_veR.descripcion;
					
					
	for(_idvi in _DataVisados.visados){
		_dat_vi=_DataVisados.visados[_idvi];
		
		_divvis=document.createElement('div');
		_form.querySelector('#listavisados').appendChild(_divvis);
		_divvis.setAttribute('idvis',_idvi);
		
		_h4=document.createElement('h4');
		_divvis.appendChild(_h4);
		_h4.innerHTML=_dat_vi.nombre+'<a onclick="guardarVisObs(this)"><img src="./img/guardar.png"></a>';
		

		_obs=document.createElement('div');					
		_divvis.appendChild(_obs);
		_obs.setAttribute('id','listaobservaciones');					
		
		_div_vis_obs=document.createElement('div');
		_obs.appendChild(_div_vis_obs);
		_div_vis_obs.setAttribute('idob','nueva');
		_div_vis_obs.setAttribute('type','hidden');
		
		_estado=document.createElement('select');
		_obs.appendChild(_estado);
		_estado.setAttribute('name','estado_nuevo');
		
		_estado.innerHTML="<option>- estado -</option>";
		_estado.innerHTML+="<option value='ok'>OK</option>";
		_estado.innerHTML+="<option value='seguir'>continuar</option>";
		_estado.innerHTML+="<option value='consultar'>consultar</option>";
		_estado.innerHTML+="<option value='frenar'>frenar</option>";
		_estado.innerHTML+="<option value='critico'>critico</option>";
		
		_desc=document.createElement('textarea');
		_obs.appendChild(_desc);
		_desc.setAttribute('name','observacion_nueva');
					
		if(_veR.visados[_idvi]!=undefined){
			for(_idob in _veR.visados[_idvi].observaciones){
				_dataob=_veR.visados[_idvi].observaciones[_idob];	
				
				_div_vis_obs=document.createElement('div');
				_obs.appendChild(_div_vis_obs);
				_div_vis_obs.setAttribute('estado',_dataob.estado_actual);
				_div_vis_obs.setAttribute('idob',_idob);
				
				
				_estado=document.createElement('select');
				_obs.appendChild(_estado);
				_estado.setAttribute('name','estado_original');
				_estado.innerHTML="<option>- estado -</option>";
				_estado.innerHTML+="<option value='ok'>OK</option>";
				_estado.innerHTML+="<option value='seguir'>continuar</option>";
				_estado.innerHTML+="<option value='consultar'>consultar</option>";
				_estado.innerHTML+="<option value='frenar'>frenar</option>";
				_estado.innerHTML+="<option value='critico'>critico</option>";
				_estado.value=_dataob.estado_original;
				
				_data=document.createElement('p');
				_obs.appendChild(_data);
				_data.innerHTML='<span>Por:'+_dataob.zz_AUTO_CREA_usu+'<br>el: '+zz_AUTO_CREA_fechau+'</span>'
				
				
				_desc=document.createElement('textarea');
				_obs.appendChild(_desc);
				_desc.setAttribute('name','observacion_original');
				_desc.value=_dataob.observacion_original;
										
				_estado=document.createElement('select');
				_obs.appendChild(_estado);
				_estado.setAttribute('name','estado_actual');
				_estado.innerHTML="<option>- estado -</option>";
				_estado.innerHTML+="<option value='ok'>OK</option>";
				_estado.innerHTML+="<option value='seguir'>continuar</option>";
				_estado.innerHTML+="<option value='consultar'>consultar</option>";
				_estado.innerHTML+="<option value='frenar'>frenar</option>";
				_estado.innerHTML+="<option value='critico'>critico</option>";
				_estado.value=_dataob.estado_actual;
				
				_data=document.createElement('p');
				_obs.appendChild(_data);
				_data.innerHTML='<span>Por:'+_dataob.zz_AUTO_EDI_usu+'<br>el: '+zz_AUTO_EDI_fechau+'</span>'
				
				_desc=document.createElement('textarea');
				_obs.appendChild(_desc);
				_desc.setAttribute('name','observacion_actual');
				_desc.value=_dataob.observacion_actual
				
				_obs.appendChild(_div_vis_obs);
				_div_vis_obs.setAttribute('estado',_dataob.estado_actual);
				
				
				_divvis.setAttribute('idvis',_idvi);
				
				_h4=document.createElement('h4');
				_divvis.appendChild(_h4);
				_h4.innerHTML=_dat_vi.nombre;
				}					
			muestraArchivoForm(_veR.archivos[_nn]);
		}
	}
	_form.querySelector('#Idescripcion').value=_veR.descripcion;
					
									
					
	_form.querySelector('#Iid_p_comunicaciones_id_ident_entrante').value=_veR.id_presenta;
	_form.querySelector('#Iid_p_comunicaciones_id_ident_aprobada').value=_veR.id_aprueba;
	_form.querySelector('#Iid_p_comunicaciones_id_ident_rechazada').value=_veR.id_rechaza;
	_form.querySelector('#Iid_p_comunicaciones_id_ident_anulada').value=_veR.id_anula;
	
	actualizarMuestraEstadoForm();
	
	if(_veR.id_presenta>0){
		cargaCom(_veR.id_presenta,_form.querySelector('#datoscomPresenta span.muestra'));
		_form.querySelector('#datoscomPresenta').setAttribute('estado','cargado');
	}else{
		_form.querySelector('#datoscomPresenta').setAttribute('estado','vacio');
	}
	
	if(_veR.id_aprueba>0){
		cargaCom(_veR.id_aprueba,_form.querySelector('#datoscomAprueba span.muestra'));
		_form.querySelector('#datoscomAprueba').setAttribute('estado','cargado');
	}else{
		_form.querySelector('#datoscomAprueba').setAttribute('estado','vacio');
	}
	
	if(_veR.id_rechaza>0){
		cargaCom(_veR.id_rechaza,_form.querySelector('#datoscomRechaza span.muestra'));
		_form.querySelector('#datoscomRechaza').setAttribute('estado','cargado');
	}else{
		_form.querySelector('#datoscomRechaza').setAttribute('estado','vacio');
	}
	
	if(_veR.id_anula>0){
		cargaCom(_veR.id_anula,_form.querySelector('#datoscomAnula span.muestra'));
		_form.querySelector('#datoscomAnula').setAttribute('estado','cargado');
	}else{
		_form.querySelector('#datoscomAnula').setAttribute('estado','vacio');
	}


	
	$('#formCent input,#formCent  textarea,#formCent  a').on('mouseover',function(){
		//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
		if(document.querySelector('#formCent')!=null){
			//esto evita el arrastre en sombra del formulario 
			document.querySelector('#formCent').removeAttribute('draggable');
		}
		_excepturadragform='si';
	});
	$('#formCent input,#formCent textarea,#formCent a').on('mouseout',function(){
		//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
		if(document.querySelector('#formCent')!=null){
			document.querySelector('#formCent').setAttribute('draggable','true');
		}
		//estoreactiva el arrastre del formulario
		_excepturadragform='no';
	});
	
	cargarPermisos();


	
}
