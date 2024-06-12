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

function mostrarTabla(){
	_modo=document.querySelector("#contenidoextenso").getAttribute("modo");
	if(_modo == "participante"){
		mostrarTablaParticipante();
	}else{
		mostrarTablaInicial();
	}	
}


function mostrarTablaInicial(){
	_Columnas=Array();
	for(_npe in _DataPeriodosOrden){
		_idper= _DataPeriodosOrden[_npe];
		_datpe=_DataPeriodos[_idper];
		
		/*
		_th_exist=document.querySelectorAll('tr#cabecera_instancias th');
		for(_thn in _th_exist){
			if(typeof _th_exist[_thn] != 'object'){continue;}
			console.log(_th_exist[_thn].getAttribute('class'));
			if(_th_exist[_thn].getAttribute('class')=='primera'){continue;}
			_th_exist[_thn].parentNode.removeChild(_th_exist[_thn]);
		}
		*/
		
		
		_tr=document.querySelector('#modo_general #flotante_tabla #cabecera_periodos');
		_th=document.createElement('th');
		_th.setAttribute('idper',_idper);
		_th.innerHTML=_datpe.ano;
		_tr.appendChild(_th);

		_cn=0;
		
		
		for(_nim in _DataModelosInstanciasOrden){			
			_cn++;			
			
			_idinmo= _DataModelosInstanciasOrden[_nim];
			_datim=_DataModelosInstancias[_idinmo];
			if(_datim.id_p_EVAperiodos!='0' && _datim.id_p_EVAperiodos!=_idper){continue;}
			_tr=document.querySelector('#modo_general #flotante_tabla #cabecera_instancias');			
			_th=document.createElement('th');	
			_th.innerHTML=_datim.codigo;			
			/*
			if(_cn==1){
				_th=_tr.querySelector('th');
				_th.innerHTML=_datim.codigo;
				_th.innerHTML+='<a onclick="event.preventDefault();crearModeloInstancia()"><img src="./img/agregar.png"></a>';
			}else{

			}*/
	
			_th.setAttribute('onclick','formularModeloInstancia(this.getAttribute("id_minst"))');
			_th.setAttribute('id_minst',_idinmo);
			_tr.appendChild(_th);				
			_col={'idper':_idper, 'idim':_idinmo};
			_Columnas.push(_col);
		}
		
		document.querySelector('tr#cabecera_periodos th[idper="'+_idper+'"]').setAttribute('colspan',(_cn));
		
	}
	
	document.querySelector('#modo_general #flotante_columna_cabecera_tabla tbody').innerHTML='';
	document.querySelector('#modo_general #flotante_tabla tbody').innerHTML='';
	
	for(_np in _DataParticipantesOrden){
		_idpart= _DataParticipantesOrden[_np];
		_datp=_DataParticipantes[_idpart];
		_tr=document.createElement('tr');
		_tr.setAttribute('idpart',_idpart);
		_tr.setAttribute('onclick','_IdPart=this.getAttribute("idpart");document.querySelector("#contenidoextenso").setAttribute("modo","participante");mostrarTabla()');
		document.querySelector('#modo_general #flotante_tabla tbody').appendChild(_tr);
		_td=document.createElement('td');
		_td.innerHTML=_datp.nombre;
		_tr.appendChild(_td);
		_td=document.createElement('td');
		_td.innerHTML=_datp.apellido;
		_tr.appendChild(_td);
		_td=document.createElement('td');
		_td.innerHTML=_datp.numero;
		_tr.appendChild(_td);
		
		_copia=_tr.cloneNode(true);
		document.querySelector('#modo_general #flotante_columna_cabecera_tabla tbody').appendChild(_copia);		
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
				
		for(_nc in _Columnas){
			_td=document.createElement('td');
			_td.setAttribute('idper',_Columnas[_nc].idper);
			_td.setAttribute('idim',_Columnas[_nc].idim);
			
			_haycruce='no';
			//console.log(_DataInstanciasCruces);
			//console.log(_Columnas[_nc].idim);
			if(_DataInstanciasCruces[_Columnas[_nc].idim]!=undefined){
				if(_DataInstanciasCruces[_Columnas[_nc].idim][_idpart]!=undefined){
					if(_DataInstanciasCruces[_Columnas[_nc].idim][_idpart][_Columnas[_nc].idper]!=undefined){
						_haycruce='si';
					}
				}		
			}
				
			if(_haycruce=='si'){
				_idinst=_DataInstanciasCruces[_Columnas[_nc].idim][_idpart][_Columnas[_nc].idper];
				_td.setAttribute('onclick','formularInstancia(this.parentNode.getAttribute("idpart"),this.getAttribute("idim"),this.getAttribute("idper"))');
				_dat=_DataInstancias[_idinst];
				_td.innerHTML=_dat.cumplido;
				if(_dat.est_alerta != 0){
					_td.setAttribute('est_alerta',_dat.est_alerta);
				}
			}else{
				_td.setAttribute('onclick','crearInstancia(this.parentNode.getAttribute("idpart"),this.getAttribute("idim"),this.getAttribute("idper"))');
				_td.innerHTML='-';
			}
			_td.setAttribute('onmouseover','resaltaCeldaLimpia();resaltaCelda(this)');
			_td.setAttribute('onmouseout','resaltaCeldaLimpia()');
			_tr.appendChild(_td);
		}
	}
}


function resaltaCeldaLimpia(){
	_tdf=document.querySelectorAll('td[filaresaltada="si"], td[columnaresaltada="si"]');
	for(_n in _tdf){
		if(typeof _tdf[_n] != 'object'){continue;}
		_tdf[_n].removeAttribute('filaresaltada');
		_tdf[_n].removeAttribute('columnaresaltada');
	}	
}

function resaltaCelda(_this){
		
	_idim=_this.getAttribute('idim');
	_idper=_this.getAttribute("idper");
	
	_tdf=_this.parentNode.querySelectorAll('td');
	for(_n in _tdf){
		if(typeof _tdf[_n] != 'object'){continue;}
		_tdf[_n].setAttribute('filaresaltada','si');
	}
	
	_tdf=document.querySelectorAll('td[idim="'+_idim+'"][idper="'+_idper+'"]');
	for(_n in _tdf){
		if(typeof _tdf[_n] != 'object'){continue;}
		_tdf[_n].setAttribute('columnaresaltada','si');
	}
	
}


function mostrarTablaParticipante(){	
	
	_idpart=_IdPart;		
	_datp=_DataParticipantes[_idpart];
		
	document.querySelector('#modo_participante #tabla tbody').innerHTML='';
	
	_sel=document.querySelector('div#modo_participante select#periodo');
	
	_sel.innerHTML='';
	
	
	for(_npe in _DataPeriodosOrden){
		_ip= _DataPeriodosOrden[_npe];
		_dp=_DataPeriodos[_ip];		
		_op=document.createElement('option');
		_op.value=_ip;
		_op.innerHTML=_dp.ano;
		_sel.appendChild(_op);
	}
	_op.checked=true;
	
	if(_IdPer==0){_IdPer=_ip;}
	
	
	_sel.value=_IdPer;
	_idper= _IdPer;	
	_datpe=_DataPeriodos[_idper];

		
	for(_nim in _DataModelosInstanciasOrden){			
		_cn++;			
		
		_idinmo= _DataModelosInstanciasOrden[_nim];
		_datim=_DataModelosInstancias[_idinmo];
		
		if(_datim.id_p_EVAperiodos!='0' && _datim.id_p_EVAperiodos!=_idper){continue;}
		
		_tbody=document.querySelector('#modo_participante #tabla tbody');
		
		_tr=document.createElement('tr');	
		_tr.setAttribute('idim',_idinmo);
		_tbody.appendChild(_tr);
			
		_th=document.createElement('td');	
		_tr.appendChild(_th);
		
		_th.innerHTML=_datim.codigo;			
		_th.setAttribute('id_minst',_idinmo);
		_tr.appendChild(_th);				
	
		_th=document.createElement('td');	
		_tr.appendChild(_th);	
		_th.innerHTML=_datim.nombre;			
		_th.setAttribute('id_minst',_idinmo);
		_tr.appendChild(_th);				

		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_haycruce='no';
		
				
		

		//console.log(_DataInstanciasCruces);
		//console.log(_Columnas[_nc].idim);
		if(_DataInstanciasCruces[_idinmo]!=undefined){
			//console.log('cruce');
			if(_DataInstanciasCruces[_idinmo][_idpart]!=undefined){
				//console.log('part');
				if(_DataInstanciasCruces[_idinmo][_idpart][_idper]!=undefined){
					_haycruce='si';
					//console.log('hay');
				}
			}		
		}
		_min=1900;
		_max=3000;
		
		if(_datim.defecto_max_ano>0){
			_max=Math.min(_datim.defecto_max_ano,_max);
		}
		
		_min=Math.max(_datim.defecto_min_ano,_min);
		
		if(_datpe.ano >= _min && _datpe.ano <= _max){
			_por_defecto='si';
			
		}else{
			_por_defecto='no';
		}
		console.log('min:'+_min+' /max:'+_max+' /ano:'+_datpe.ano+' /def:'+_por_defecto);
			
		if(_haycruce=='si'){
			
			_tr.setAttribute('onclick','formularInstancia('+_idpart+',this.getAttribute("idim"),'+_idper+')');
		
			
			_idinst=_DataInstanciasCruces[_idinmo][_idpart][_idper];
			
			_dat=_DataInstancias[_idinst];
			
			if(_dat.est_alerta != 0){
				_tr.setAttribute('est_alerta',_dat.est_alerta);
			}
			
			_td.innerHTML=_dat.cumplido;
			if(_dat.est_alerta != 0){
				_td.setAttribute('est_alerta',_dat.est_alerta);
			}
			_ult_paso=0;
			_ult_paso_num_1='';
			_ult_paso_text_1='';
			for(_pn in _dat.pasos){
				_pdat=_dat.pasos[_pn];
				if(_pdat.hecho=='1'){
					_ult_paso_num_1=_pdat.num_1;
					_ult_paso_text_1=_pdat.text_1;
				}
			}
			_td=document.createElement('td');
			_tr.appendChild(_td);
			_td.innerHTML=_ult_paso_num_1;
			
			_td=document.createElement('td');
			_tr.appendChild(_td);
			_td.innerHTML=_ult_paso_text_1;
			
			
		}else{
			if(_por_defecto=='no'){
				_tr.setAttribute('oculta','si');
			}
			_tr.setAttribute('onclick','crearInstancia('+_idpart+',this.getAttribute("idim"),'+_idper+')');
			_td.innerHTML='-';
			
			_td=document.createElement('td');
			_tr.appendChild(_td);
			_td.innerHTML='-';
			
			_td=document.createElement('td');
			_tr.appendChild(_td);
			_td.innerHTML='-';
		}
	}
}



function anadirAdjunto(_daj){	                	
		_div=document.createElement('div');
		_div.setAttribute('class','adjunto');
		_div.setAttribute('ruta',_daj.FI_documento);
		_div.setAttribute('idadj',_daj.id);
		_div.setAttribute('onclick','mostrarAdjunto(this)');
		
		_img=document.createElement('img');
		_img.setAttribute('src',_daj.FI_muestra);
		_div.appendChild(_img)
		
		_epi=document.createElement('div');
		_epi.setAttribute('class','epigrafe');
		_epi.innerHTML=_daj.nombre;
		_div.appendChild(_epi);
		
		_borr=document.createElement('a');
		_borr.setAttribute('class','elimina');
		_borr.setAttribute('onclick','eliminaAdjunto(this,event)');
		_borr.innerHTML='x';
		_borr.title='Eliminar este adjunto';
		_div.appendChild(_borr);
		
		document.querySelector('form#accion #adjuntoslista').appendChild(_div);
	}
	
	
