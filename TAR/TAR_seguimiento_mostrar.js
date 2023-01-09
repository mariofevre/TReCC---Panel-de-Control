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


function marcarDiasCalendario(){
	_diaspredibujados=document.querySelectorAll('#gantt .dia');
	for(_nd in _diaspredibujados){
		if(typeof _diaspredibujados[_nd] != 'object'){continue;}
		_diaspredibujados[_nd].parentNode.removeChild(_diaspredibujados[_nd]);
	}
	
	for(_i=0; _i <=_barrido; _i++){
		_diamuestra = new Date();
		_dif=_diaInicio_rel + _i;
		
		//console.log('desp:'+_desp_render_dias);
		_diamuestra.setDate(_f.getDate() + _dif + _desp_render_dias);
		
		
		if(_diamuestra.getDay()==0){
			_div=document.createElement('div');
			_div.setAttribute('dia','domingo');				
			_div.setAttribute('class','dia');
			_ini=(_i*_anchodia)+_offset-1;
			_div.style.left=_ini+'px';
			_div.style.width=_anchodia+'px';
			
			document.querySelector('#gantt').appendChild(_div);
		}
		if(_diamuestra.getDay()==6){
			_div=document.createElement('div');
			_div.setAttribute('dia','sabado');				
			_div.setAttribute('class','dia');
			_ini=(_i*_anchodia)+_offset-1;
			_div.style.left=_ini+'px';
			_div.style.width=_anchodia+'px';
			document.querySelector('#gantt').appendChild(_div);
		}

		if(_i + _diaInicio_rel == (-1*_desp_render_dias)){		
			_div=document.createElement('div');
			_div.setAttribute('dia','hoy');				
			_div.setAttribute('class','dia');
			_ini=(_i*_anchodia)+_offset-1;
			_div.setAttribute('ini',_ini);
			_div.style.left=_ini+'px';
			_div.style.width=(_anchodia)+'px';
			document.querySelector('#gantt').appendChild(_div);
		}
		
		if(_i + _diaInicio_rel == 0){		
			_div=document.createElement('div');
			_div.setAttribute('dia','DiaObsSel');				
			_div.setAttribute('class','dia');
			_ini=(_i*_anchodia)+_offset-1;
			_div.style.left=_ini+'px';
			_div.style.width=(_anchodia)+'px';
			document.querySelector('#gantt').appendChild(_div);
		}
	}
}
marcarDiasCalendario();


function listarPlanes(){
		
	_listado=document.querySelector('#listaplanes #listado');
	_listado.innerHTML='';	
	
	for(_pn in _DataPlanesOrden){
		_idp=_DataPlanesOrden[_pn];
		_pdat=_DataPlanes[_idp];
		_a=document.createElement('a');
		_a.setAttribute('idplan',_pdat.id);
		_a.setAttribute('superado',_pdat.zz_superado);
		_a.innerHTML=_pdat.nombre;
		_a.title=_pdat.descripcion;
		_a.setAttribute('onclick','cargarPlan(this.getAttribute("idplan"))');
		_listado.appendChild(_a);		
	}
	
	_act=document.querySelector('#listaplanes #listado > a[superado="0"]');
	
	if(_act==undefined){return;}
	
	_idplan=_act.getAttribute('idplan');
	cargarPlan(_idplan);	
}




var _ultN={	'1':'',	'2':'',	'3':''};
var _contultN={	'1':0,	'2':0,	'3':0};

function listarTareasPlan(_idplan){
		
	_listado=document.querySelector('#gantt #listado');
	_listado.innerHTML='';	
	
	for(_tn in _DataPlanes[_idplan].tareasOrden){
		_idtarea=_DataPlanes[_idplan].tareasOrden[_tn];
		_dat=_DataPlanes[_idplan].tareas[_idtarea];
		_idtarea=_dat.id;
		
		if(_ultN[_dat.nivel]==undefined){_ultN[_dat.nivel]="";}
		
				
		if(_dat.fecha_plan_fin_diashoy<_diaInicio_rel){
			_visible='no';
		}else if(_dat.fecha_plan_inicio_diashoy>_diaFin_rel){
			_visible='no';
		}else{
			_visible='si';	
		}

		_dato={};
		for(_on in _dat.observacionesOrden){	
			_idobserv=_dat.observacionesOrden[_on];
			_dato=_dat.observaciones[_idobserv];
			//console.log(_idtarea+' '+_dato.fecha_diashoy+' '+_diaInicio_rel);
			if(
				_dato.fecha_diashoy>_diaInicio_rel
				&&
				_dato.fecha_diashoy<_diaFin_rel
			){
				_visible='si';	
			}
		}	

		
	
		
		
		if(_IdItCPT>0){
			if(_dat.seleccion==undefined){
				_visible='no';		
			}else{
				_visible='si';		
			}
		}
		
		if(_dat.fecha_plan_fin_diashoy>=0
		){_pendiente='no';}else{_pendiente='si';}
		
		_estdadoactivo=document.querySelector('#gantt').getAttribute('estadoactivo');
		
		if((_pendiente=='si' && _IdItCPT<1)||_visible=='si'||(_dat.nivel<3 && _IdItCPT<1) ||_estdadoactivo=='mostrartodas'){
			
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
			_a.setAttribute('class','tarea');
			
			_a.setAttribute('nivel',_dat.nivel);		
			
			_a.title=_dat.descripcion;
			_a.setAttribute('onclick','consultarTarea(this.getAttribute("idtarea"))','formular','');
			
			_ini=((_dat.fecha_plan_inicio_diashoy-_diaInicio_rel)*_anchodia)+_offset-3;
			_a.style.left = _ini+ 'px';
			
			_cantdiasancho =Math.max(_dat.fecha_plan_fin_diashoy-_dat.fecha_plan_inicio_diashoy,1);
			_ancho=(_cantdiasancho*_anchodia)-2;
			_a.style.width=_ancho+ 'px';
			
			
			if(_dato.avance>99){
				// esta taea está terminada no requiere seguimiento
			}else if(_dat.tareas_hijas>0){
				//esta es una tarea grupo, no reuiere seguimiento puntual
			}else if(_margen_temporal_control=='no'){	
				//no se realiza control de seguimiento en este panel
				
			}else if(_dat.fecha_plan_inicio_diashoy > 0){
				//esta tarea no esta previsto que inicie aun
				
			}else if((-1*_dato.fecha_diashoy)<_margen_temporal_control){
				//el último control se realizó hace más tiempo del límite definido.
			}else{
				//el control de esta tarea está vencido
				
				_ojo=document.createElement('div');
				_ojo.innerHTML="<img src='./img/signo-alerta.png'>";
				_ojo.setAttribute('class', 'alerta_control');		
				_ojo.style.left=Math.round(_anchogantt/2)-_ini+'px';
				_ojo.title=(-1*_dato.fecha_diashoy)+' días desde el último control. (vs:'+_margen_temporal_control+')';
				_a.appendChild(_ojo);
			}			
			
			
			
			if(_IdItCPT<1){
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
			}
			
			_a.setAttribute('visible',_visible);	
			_a.setAttribute('pendiente',_pendiente);
					
			_div=document.createElement('div');
			_div.setAttribute('id','flotantetexto');
			_a.appendChild(_div);
			
			_span=document.createElement('span');
			_span.innerHTML=_dat.codigo+' - '+_dat.nombre;
			_div.appendChild(_span);
			
			_sp=document.createElement('span');
			_sp.innerHTML=_dat.contexto;
			_sp.setAttribute('class','contexto');	
			
			_div=document.createElement('div');
			_div.setAttribute('class','llave');
			_div.setAttribute('nivel',_dat.nivel);
			_div.appendChild(_sp);
			
						
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
			
			_dest=document.querySelector('.tarea[idtarea="'+_ultN[_dat.nivel]+'"]');
			
			if(_dest!=null){
				_left=_dest.querySelector('.contexto').style.left;
				_left=_left.replace('px', '');
				_left=parseInt(_left);
			}else{
				_left=0;
			}
			//console.log('y');
			if(_contultN[_dat.nivel]==null){
				_contultN[_dat.nivel]=0;
			}
			//console.log(_contultN[_dat.nivel]);
			//console.log((Math.max(0,(_contultN[_dat.nivel]*32)-6))+'px');
			_div.style.height=(Math.max(0,(_contultN[_dat.nivel]*32)-6))+'px';
			_pl=0;
			if(_dat.nivel=='1'){_pl=-5;}
			if(_dat.nivel=='2'){_pl=5;}
			_div.style.left=(_left+_pl)+'px';			
			_div.appendChild(_sp);		
		}
				
		if(_ultN[_dat.nivel]!=''){
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

		_divt=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]');
		if(_divt==null){return;}
		_vis=_divt.getAttribute('visible');
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





function canvasTarea(_idtarea){
	
	
	if(document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"] canvas')!=null){
		_el=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"] canvas');
		_el.parentNode.removeChild(_el);
	}
	
	_d = document.createElement("div");	
	_d.setAttribute('class','contienecanvas');
	_c = document.createElement("canvas");
	
	//console.log(_idtarea);
	_obs={};
	_divt=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]');
	
	if(_divt==null){return;}
	
	_obs=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]').querySelectorAll('.observacion');
	_antes=0;
	_w=_divt.style.width;
	_w=parseInt(_w.replace('px',''))
	_dps=_w;
	
	for(_on in _obs){
		if(typeof _obs[_on] != 'object'){continue;}
		_l=_obs[_on].style.left.replace('px','');
		
		_idobserv= _obs[_on].getAttribute('idobserv');
		_datob=_DataPlanes[_IdPlanActivo].tareas[_idtarea].observaciones[_idobserv];		
	
		if(_datob.avance>0||_datob.enejecucion=='si'){
			_antes=Math.min(_antes,_l);
			_dps=Math.max(_dps,_l);		
		}
	}
	
	
	//console.log("antes:"+_antes);
	//_dps=Math.max(_dps,_desarrollomin); //si no es lo suficientemene largo para llegar a hoy lo extiende.
	
	
	if(document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]')!=null){
		_el_tar=document.querySelector('#gantt #listado .tarea[idtarea="'+_idtarea+'"]');
		_tarl=_el_tar.style.left;
		_tl=_tarl.replace('px','');
		_ancho=_anchogantt/2;
		
		_desarrollomin=_ancho-_tl-_antes;
	}else{
		_desarrollomin=_anchodia;
	}	
	
	
	if(_idtarea=='35203'){		
		console.log(_ancho+ ' ' + _tl + ' ' + _antes+' '+_ancho);
		console.log(_desarrollomin);
	}	
	
	
	_w=Math.max(((-1*_antes)+_dps),_desarrollomin);
	
	//_c.setAttribute('width',(-1*_antes)+_dps);
	_d.style.width=_w+'px';
	_c.setAttribute('width',_w);	
	_d.style.left=_antes+'px';	
	_d.style.height=28+'px';	
	_c.setAttribute('height','28');
	_d.appendChild(_c);	
	_divt.appendChild(_d);
	_obs=_divt.querySelectorAll('.observacion');

	_lefts=Array();
	
	for(_on in _obs){
		if(typeof _obs[_on] != 'object'){continue;}	
		_tx=_obs[_on].style.left;
		_ln=parseInt(_tx.replace('px',''))+Math.round((_anchodia/2))+(-1*_antes);
		_lefts.push({
				'idobs':_obs[_on].getAttribute('idobserv'),
				'leftn':_ln
		});
	}

	_tprev=28;
	_lprev=0;
	
	_ctx = _c.getContext("2d");
	//_ctx.lineWidth = 3;
	//_ctx.fillStyle = 'rgba(50,50,155,1)';
	_ctx.fillStyle = 'rgba(30,30,90,1)';	
	_ctx.strokeStyle = 'rgba(50,50,155,1)';	
	_ctx.setLineDash([]);
	_ctx.beginPath();
	
	_ctx.moveTo(_lprev, _tprev);
	_lfin=0;
	for(_i in _lefts){		
		_idobserv= _lefts[_i].idobs;
		_av=_DataPlanes[_IdPlanActivo].tareas[_idtarea].observaciones[_idobserv].avance;		
		_avtoppx=28-(_av*28/100);		
		_ctx.lineTo(_lefts[_i].leftn, _avtoppx);
		_lfin=_lefts[_i].leftn;
	}
	_ctx.lineTo(_lfin, 28);
	_ctx.fill();
	_ctx.closePath();
	//console.log(_ctx);
	_ctx.stroke(); 	
	
	//DIBUJA proyección desde última observación hasta el presente
			
		// Create a pattern, offscreen
		const patternCanvas = document.createElement("canvas");
		const patternContext = patternCanvas.getContext("2d");

		// Give the pattern a width and height of 50
		patternCanvas.width = 20;
		patternCanvas.height = 20;

		// Give the pattern a background color and draw an arc
		patternContext.fillStyle = 'rgba(30,30,90,0.1)';	
		patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
		patternContext.beginPath();
		
		patternContext.strokeStyle = 'rgba(50,50,155,0.5)';	
		
		patternContext.moveTo(-20, 20);
		patternContext.lineTo(0, 0);
		
		patternContext.moveTo(-16, 20);
		patternContext.lineTo(4, 0);
		
		patternContext.moveTo(-12, 20);
		patternContext.lineTo(8, 0);
		
		patternContext.moveTo(-8, 20);
		patternContext.lineTo(12, 0);
		
		patternContext.moveTo(-4, 20);
		patternContext.lineTo(16, 0);
		
		patternContext.moveTo(0, 20);
		patternContext.lineTo(20, 0);
		
		patternContext.moveTo(4, 20);
		patternContext.lineTo(24, 0);
		
		patternContext.moveTo(8, 20);
		patternContext.lineTo(28, 0);
		
		patternContext.moveTo(12, 20);
		patternContext.lineTo(32, 0);
		
		patternContext.moveTo(16, 20);
		patternContext.lineTo(38, 0);
		
		patternContext.stroke();


	_pattern = _ctx.createPattern(patternCanvas, "repeat");

  
 	//_ctx.fillStyle = 'rgba(30,30,90,0.1)';	 
	_ctx.fillStyle = _pattern;	
	_ctx.strokeStyle = 'rgba(50,50,155,1)';	
	_ctx.setLineDash([3, 5]);
	_ctx.beginPath();
	
	_ctx.moveTo(_lfin, (Math.round(_avtoppx) + 1.5));
	//console.log('moveto:'+_lfin+', '+_avtoppx);
	
	_lefthoy=(-1*_antes)+_dps;
	_lefthoy=_w;
	
	_ctx.lineTo((_lefthoy -1), (Math.round(_avtoppx) + 1.5));
	_ctx.lineTo((_lefthoy -1) , 26.5);
	
	_ctx.lineTo(_lfin, 26.5);
	
	//_ctx.stroke();
	_ctx.closePath();
	
	_ctx.fill();
	_ctx.closePath();
	//console.log(_ctx);
	_ctx.stroke(); 
	delete _lefts;
	
	
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
	){
		//tarea actual
		_formO.querySelector('#preguntadurante').setAttribute('activa','si');
	}else{
		_formO.querySelector('#preguntadurante').setAttribute('activa','no');
	}
	
	if(_datT.fecha_plan_inicio_diashoy <= 0
		&&
		_datT.fecha_plan_fin_diashoy >= 0
	){
		//tarea actual
		_formO.querySelector('#preguntaatiempo').setAttribute('activa','si');
	}else{
		_formO.querySelector('#preguntaatiempo').setAttribute('activa','no');
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
	
	
    if(
		_datT.fecha_plan_inicio_diashoy <= 0
		&&
		(_datO.termino=='no'
		||
		_datO.avance<100)
		){
		_formO.querySelector('#preguntadurante').setAttribute('activa','si');
	}
    
	
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
		_ptar.innerHTML=_dat.codigo+' - '+_dat.nombre;;
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



