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

function formulaIND(){
	
	document.getElementById('cid').value=_InId;
		document.getElementById('tabla').value='indicadores';                
		document.getElementById('cnid').innerHTML=_InId;
		
		document.getElementById('acarga').setAttribute('indid',_InId);	
		document.getElementById('cindicador').value=DatosGenerales.indicadores[_InId].indicador;
		document.getElementById('cn_id_local').value=DatosGenerales.indicadores[_InId].n_id_local;
		_ga=DatosGenerales.indicadores[_InId].id_p_grupos_id_nombre_tipoa;
		if(_DatosGrupos.grupos[_ga]==undefined){_DatosGrupos.grupos[_ga]=Array();_DatosGrupos.grupos[_ga].nombre='S/D';}
		document.getElementById('cid_p_grupos_id_nombre_tipoa').value=_ga;
		document.getElementById('cid_p_grupos_id_nombre_tipoa-n').value=_DatosGrupos.grupos[_ga].nombre;
			
		_gb=DatosGenerales.indicadores[_InId].id_p_grupos_id_nombre_tipob;
		if(_DatosGrupos.grupos[_gb]==undefined){_DatosGrupos.grupos[_gb]=Array();_DatosGrupos.grupos[_gb].nombre='S/D';}
		document.getElementById('cid_p_grupos_id_nombre_tipob').value=_gb;
		document.getElementById('cid_p_grupos_id_nombre_tipob-n').value=_DatosGrupos.grupos[_gb].nombre;
		
		_form=document.getElementById('general');
		_form.descripcion.value=DatosGenerales.indicadores[_InId].descripcion;                           
		document.getElementById('cunidad').value=DatosGenerales.indicadores[_InId].unidad;
		document.getElementById('cformula').value=DatosGenerales.indicadores[_InId].formula;
			
		_campA=Array('muestraforzada','persistente','cargaforzada','publicarweb');
		for(_nn in _campA){
			_campo=_campA[_nn];
			document.getElementById('c'+_campo).value=DatosGenerales.indicadores[_InId][_campo];
			_dato =DatosGenerales.indicadores[_InId][_campo]
			_In=document.getElementById('c'+_campo+'-n');
			if(_dato=='1'){	_In.checked=true;}
			if(_dato=='0'){	_In.checked=false;}
		}	
			
		_campA=Array('caracter','fuente','id_p_INDperiodicidad');
		for(_nn in _campA){
			_campo=_campA[_nn];
			_sele=document.getElementById('c'+_campo);
			//console.log(_campo);
			_sele.innerHTML='';
			
			_op=document.createElement('option');					
			_op.innerHTML='- elegir -';
			_sele.appendChild(_op);
				
			for(_nn in _Opciones[_campo]){
				_op=document.createElement('option');
				_op.value=_Opciones[_campo][_nn].id;
				_op.innerHTML=_Opciones[_campo][_nn].nombre;
				_sele.appendChild(_op);
			}
			_idper=DatosGenerales.indicadores[_InId][_campo];
			//document.getElementById('cid_p_INDperiodicidad-n').value=_Opciones.INDperiodicidad[_idper].nombre;
			var opts = _sele.options;
			for(var opt, j = 0; opt = opts[j]; j++) {
				if(opt.value == _idper) {
					_sele.selectedIndex = j;
					break;
				}
			}
		}    
		
		
		_ffd=DatosGenerales.indicadores[_InId].desde.split("-");
		document.getElementById('cdesde_a').value=_ffd[0];
		document.getElementById('cdesde_m').value=_ffd[1];
		document.getElementById('cdesde_d').value=_ffd[2];			    
		
		document.getElementById('cid_p_HIThitos_id_nombre_desde-n').value='- cargar fecha menualmente -';

		_campo='desde';
		if(_Opciones.id_p_HIThitos_id_nombre_desde[DatosGenerales.indicadores[_InId].id_p_HIThitos_id_nombre_desde]!=undefined){
			document.getElementById('cid_p_HIThitos_id_nombre_desde-n').value=_Opciones.id_p_HIThitos_id_nombre_desde[DatosGenerales.indicadores[_InId].id_p_HIThitos_id_nombre_desde].nombre;
			document.getElementById('cdesde_a').disabled=true;
			document.getElementById('cdesde_m').disabled=true;
			document.getElementById('cdesde_d').disabled=true;
		}else{
			document.getElementById('c'+_campo+'_a').removeAttribute('disabled');
			document.getElementById('c'+_campo+'_m').removeAttribute('disabled');
			document.getElementById('c'+_campo+'_d').removeAttribute('disabled');
		}


		_ffd=DatosGenerales.indicadores[_InId].hasta.split("-");
		document.getElementById('chasta_a').value=_ffd[0];
		document.getElementById('chasta_m').value=_ffd[1];
		document.getElementById('chasta_d').value=_ffd[2];			    
		
		document.getElementById('cid_p_HIThitos_id_nombre_hasta-n').value='- cargar fecha manualmente -';
		_campo='hasta';
		if(_Opciones.id_p_HIThitos_id_nombre_hasta[DatosGenerales.indicadores[_InId].id_p_HIThitos_id_nombre_hasta]!=undefined){
			document.getElementById('cid_p_HIThitos_id_nombre_hasta-n').value=_Opciones.id_p_HIThitos_id_nombre_hasta[DatosGenerales.indicadores[_InId].id_p_HIThitos_id_nombre_hasta].nombre;
			document.getElementById('chasta_a').disabled=true;
			document.getElementById('chasta_m').disabled=true;
			document.getElementById('chasta_d').disabled=true;
		}else{
			document.getElementById('c'+_campo+'_a').removeAttribute('disabled');
			document.getElementById('c'+_campo+'_m').removeAttribute('disabled');
			document.getElementById('c'+_campo+'_d').removeAttribute('disabled');
		}
		
		document.querySelector('form#general [name=a_panel_general]').value=DatosGenerales.indicadores[_InId].a_panel_general;
		if(DatosGenerales.indicadores[_InId].a_panel_general<1){
			document.querySelector('form#general #a_panel_general-n').checked=false;
		}else{                    	
			document.querySelector('form#general #a_panel_general-n').checked=true;
		}
		
		document.querySelector('form#general [name=alerta_min]').value=DatosGenerales.indicadores[_InId].alerta_min;    
		document.querySelector('form#general [name=alerta_max]').value=DatosGenerales.indicadores[_InId].alerta_max;
		
		document.querySelector('#acarga').style.display='none';
		activarCarga(_InId);	

}
	


	
function mostrarRegistros(){
	
	var _fechascroll=0;
	var	_maxfechapasado='0000-00-00';
	var	_maxleftpasado='0';
	
	document.getElementById('verreg').style.display='none';		
	for(_idind in DatosRegistros){

		if(DatosGenerales.indicadores[_idind]==undefined){continue;}//desestima registros de indicadores no cargados
		_rdat=DatosRegistros[_idind];
		_indCont=document.getElementById('HcI'+_idind);
		
		for(_FF in _rdat){
			_dato=document.createElement('div');
			_dato.setAttribute('class','dato');
			
			if(_rdat[_FF].diasN==undefined){continue;}

			if(DatosGenerales.indicadores[_idind].id_p_INDperiodicidad>1){
				_dato.innerHTML=_rdat[_FF].valorT;
			}
			
			
			_left=(_rdat[_FF].diasN + DatosGenerales.indicadores[_idind].diaN )*_anchodia;
			
			if(_rdat[_FF].fecha < _Hoy){	
				_maxfechapasado=Math.max(_maxfechapasado,_rdat[_FF].fecha);
				_maxleftpasado=Math.max(_maxleftpasado,_left);
			}
			_dato.style.left=_left+'px';
			
			if((_left+100)>_cssanchohistorial){
				_cssanchohistorial=_left+100;
				document.getElementById('cssanchohistorial').textContent="#ventanahistorial > div {width: "+_cssanchohistorial+"px;}";
			}			
			_indCont.appendChild(_dato);
			asignarAlerta(_dato,_idind, _rdat[_FF].valor);
		}
	}	
	
	document.querySelector('#ventanahistorial').scrollLeft=(_maxleftpasado-500);
	
	
}
	
	
function recargarHitos(_destino,_tipo){
	//console.log(_tipo);
	
	_anc=document.createElement('a');
	_anc.setAttribute('onclick','cargaOpcion(this);');
	_anc.setAttribute('regid','0');
	_anc.innerHTML='- cargar fecha manualmente -';
	_anc.title='si carga manualmente la fecha de seguimiento de un indicador se expone a producir errores en la carga, sobretodo cuando se trabaja en panele con muchos indicadores.';
	_destino.appendChild(_anc);
	
	for(_nn in _Opciones[_tipo]){
		_anc=document.createElement('a');
		_anc.setAttribute('onclick','cargaOpcion(this);');
		_anc.setAttribute('regid',_Opciones[_tipo][_nn].id);
		_anc.innerHTML=_Opciones[_tipo][_nn].nombre;
		_anc.title=_Opciones[_tipo][_nn].descripcion;
		_destino.appendChild(_anc);
	}
}

	
	

	
function activarCarga(_indId){
	_cont=document.querySelector('#cargavalores #contenido');
	_cont.innertHTML='';
	_fechasInd=DatosGenerales.indicadores[_indId].fechas;
	
	consultarIndicadorCarga(_indId);
	
	_tipoinput=DatosGenerales.indicadores[_indId].tipo.substr(0,3);
	
	for(_ff in _fechasInd){
		_fA=_ff.split('-');
		_anoN=_fA[0];
		_mesN=_fA[1];
		_diaN=_fA[2];
		if(_diaN<=7){_cuartN=1;}
		else if(_diaN<=15){_cuartN=2;}
		else if(_diaN<=22){_cuartN=3;}
		else {_cuartN=4;}			

		if(_cont.querySelector('.cano#a'+_anoN)==undefined){
			_dano=document.createElement('div');
			_dano.setAttribute('class','cano');
			_dano.setAttribute('id','a'+_anoN);
			_conA=document.createElement('div');
			_conA.setAttribute('class','cont');
			_conA.setAttribute('tipo',_tipoinput);
			_conTT=_conA;
			_cont.appendChild(_dano);
			_dano.appendChild(_conA);
			_labelA=document.createElement('label');
			_labelA.innerHTML=_anoN;
			_dano.appendChild(_labelA);
		}
		
		if(_cont.querySelector('.cano#a'+_anoN+' .cmes#m'+_mesN)==undefined){
			_dmes=document.createElement('div');
			_dmes.setAttribute('class','cmes');
			_dmes.setAttribute('id','m'+_mesN);
			_conM=document.createElement('div');
			_conM.setAttribute('class','cont');
			_conM.setAttribute('tipo',_tipoinput);
			_conTT=_conM;
			_conA.appendChild(_dmes);
			_dmes.appendChild(_conM);
			_labelM=document.createElement('label');
			_labelM.innerHTML=_mesnom[parseInt(_mesN)];
			_dmes.appendChild(_labelM);
		}
		
		if(_cont.querySelector('.cano#a'+_anoN+' .cmes#m'+_mesN+' .ccuart#c'+_cuartN)==undefined){
			_dcuart=document.createElement('div');
			_dcuart.setAttribute('class','ccuart');
			_dcuart.setAttribute('id','c'+_cuartN);
			_conC=document.createElement('div');
			_conC.setAttribute('class','cont');
			_conC.setAttribute('tipo',_tipoinput);
			_conTT=_conC;
			_conM.appendChild(_dcuart);
			_dcuart.appendChild(_conC);
			_labelC=document.createElement('label');
			//_labelC.innerHTML=_cuartN;
			_dcuart.appendChild(_labelC);
		}

		if(_cont.querySelector('.cano#a'+_anoN+' .cmes#m'+_mesN+' .ccuart#c'+_cuartN+' .cdia#d'+_diaN)==undefined){
			_ddia=document.createElement('div');
			_ddia.setAttribute('class','cdia');
			_ddia.setAttribute('id','d'+_diaN);
			_conD=document.createElement('div');
			_conD.setAttribute('class','cont');
			_conD.setAttribute('tipo',_tipoinput);
			_conTT=_conD;
			_conC.appendChild(_ddia);
			_ddia.appendChild(_conD);
			_labelD=document.createElement('label');
			_labelD.innerHTML=_diaN;
			_fD=new Date(_ff);
			_diaS=_weekday[_fD.getDay()];
			_ddia.setAttribute('sem',_diaS);
			_labelD.innerHTML+='<span>'+_diaS+'</span>';				 
			_ddia.appendChild(_labelD);
		}
		
		_input=document.createElement('input');
		_input.setAttribute('readonly','readonly');
		_input.setAttribute('id','i'+_ff);					
		_conTT.appendChild(_input);
		
		_inf=document.createElement('a');
		_inf.setAttribute('id','info');
		_inf.innerHTML='(i)';
		_inf.setAttribute('visible','no');
		_inf.setAttribute('onclick','info(this)');
		_conTT.appendChild(_inf);
		
		_estado=document.createElement('div');
		_estado.setAttribute('id','estado');
		_estado.title='estado: registro consultado';
		_conTT.appendChild(_estado);
		
		
	}
	
	$("#cargavalores #contenido input").blur(function(){
		if(this.value==''){this.value='SD';}
	});
	
	$("#cargavalores #contenido input").click(function(){
		//$("#cargavalores input").attr('readonly','readonly');	
		if(document.getElementById('cfuente').value!='carga manual'){
			alert('para ingresar datos la fuente configurada debe ser carga manual');
		}else{
			this.removeAttribute('readonly');
			if(this.value=='SD'){this.value='';}
			this.setAttribute('onkeyup','suscripcion(event,this)');
	   }
	});	
}

function asignarAlerta(_div,_IdInd, _valor){
	_datind=DatosGenerales.indicadores[_IdInd];
	if(_datind.alerta_max=='0'&&_datind.alerta_min=='0'){// TODO mejorar esta condicion
		return;
	} 
	
	_v=Number(_valor);
	_max=Number(_datind.alerta_max);
	_min=Number(_datind.alerta_min);
	//console.log(_v);
	_rango=Math.abs(_max - _min);
	
	if( _min <  _max){
		
		_v=Math.max(_v, _min);			
		_v=Math.min(_v, _max);
		
	}else if( _min >  _max){
		//console.log('çb');
		//console.log(_v+'vs'+ _min);
		_v=Math.min(_v, _min);
		
		//console.log(_v+'vs'+ _max);
		_v=Math.max(_v, _max);
		//console.log('v:'+_v);	
	}
	
	//console.log('v:'+_v);
	_valorrel= Math.abs(_v -  _min);
	//console.log('vr:'+_valorrel);
	//console.log('ra:'+_rango);
	_alerta=_valorrel * 100/ _rango;
	_alerta=Math.round(_alerta);
	
	_div.setAttribute('alerta',_alerta+'%');
	
	_rgb = colorAlerta(_alerta);
	_div.style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.6)';
	
}
