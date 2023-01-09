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

function formularAnularConexion(_numpend){
	
	_form=document.querySelector('#formAnularConec');
	_form.style.display='block';
	_dat=_DataConfig.conexiones.vigentes[_numpend];
	_form.querySelector('[name="idpanelcon"').value=_dat.datapanel.idpanel;
	_form.querySelector('[name="idcon"').value=_dat.idcon;
	_form.querySelector('#nombrepanel').innerHTML=_dat.datapanel.nombrepanel;
	_form.querySelector('#descripcionpanel').innerHTML=_dat.datapanel.descripcionpanel;
	
	if(_dat.cond_COM_vision_compartida=='1'){
		//console.log('com');
		_form.querySelector('[for="COMver"]').checked=true;
	}else{
		_form.querySelector('[for="COMver"]').checked=false;
	}
	
	_form.querySelector('[name="COMver"]').value=_dat.cond_COM_vision_compartida;
	
	if(_dat.cond_DOC_vision_compartida=='1'){
		//console.log('doc');
		_form.querySelector('[for="DOCver"]').checked=true;
	}else{
		_form.querySelector('[for="DOCver"]').checked=false;
	}
	_form.querySelector('[name="DOCver"]').value=_dat.cond_DOC_vision_compartida;	
}

function formularAceptarConexion(_numpend){
	
	_form=document.querySelector('#formAcepConec');
	_form.style.display='block';
	_dat=_DataConfig.conexiones.pendientes[_numpend];
	_form.querySelector('[name="idpanelcon"').value=_dat.solicitante.idpanel;
	_form.querySelector('[name="idpendiente"').value=_dat.idpendiente;
	_form.querySelector('#nombrepanel').innerHTML=_dat.solicitante.nombrepanel;
	_form.querySelector('#descripcionpanel').innerHTML=_dat.solicitante.descripcionpanel;
	
	if(_dat.condiciones.COM_vision_compartida=='1'){
		//console.log('com');
		_form.querySelector('[type="checkbox"][for="COMver"]').checked=true;
	}else{
		_form.querySelector('[type="checkbox"][for="COMver"]').checked=false;
	}	
	_form.querySelector('[type="checkbox"][for="COMver"]').onchange();
	//_form.querySelector('[name="COMver"]').value=_dat.condiciones.COM_vision_compartida;
	
	
	if(_dat.condiciones.DOC_vision_compartida=='1'){
		//console.log('doc');
		_form.querySelector('[type="checkbox"][for="DOCver"]').checked=true;
	}else{
		_form.querySelector('[type="checkbox"][for="DOCver"]').checked=false;
	}	
	_form.querySelector('[type="checkbox"][for="DOCver"]').onchange();
	//_form.querySelector('[name="DOCver"]').value=_dat.condiciones.DOC_vision_compartida;	
	
	if(_dat.condiciones.TAR_vision_compartida=='1'){
		//console.log('doc');
		_form.querySelector('[type="checkbox"][for="TARver"]').checked=true;
	}else{
		_form.querySelector('[type="checkbox"][for="TARver"]').checked=false;
	}	
	_form.querySelector('[type="checkbox"][for="TARver"]').onchange();
	//_form.querySelector('[name="DOCver"]').value=_dat.condiciones.DOC_vision_compartida;	
	
}


function formularAlerta(_this){
	
	_form=document.querySelector('#formalerta');
	_form.style.display='block';
	_cod=_this.getAttribute('codigo');
	_ref_ed=_this.getAttribute('refed');
	_tipo=_this.parentNode.getAttribute('tipo');
	_mod=_this.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
	
	
	_form.querySelector('[name="codigo"]').value=_cod;	
	_form.querySelector('[name="tipo"]').value=_tipo;	
	_form.querySelector('[name="refed"]').value=_ref_ed;
	
	_form.querySelector('#indicadornombre').innerHTML=_DataAlertas[_mod][_cod].nombre;
	_form.querySelector('#indicadordescripcion').innerHTML=_DataAlertas[_mod][_cod].descripcion;
	
	if(_DataAlertas[_mod][_cod].idalerta==''){
		_form.querySelector('[name="max"]').value='';
		_form.querySelector('[name="min"]').value='';
		_form.querySelector('[value="desactivar"]').setAttribute('disabled','disabled');
	}else{
		_dat=_DataAlertas[_mod][_cod];
		
		_v=_dat.valor_max;
		_form.querySelector('[name="max"]').value=_v;
		
		_v=_dat.valor_min;
		_form.querySelector('[name="min"]').value=_v;
		_form.querySelector('[value="desactivar"]').removeAttribute('disabled');
		
	}
} 


function formularPAN(){	
	_form=document.querySelector('#formPAN');
	_form.style.display='block';
	
	_form.querySelector('[name="nombre"').value=_DataPanel.nombre;
	_form.querySelector('[name="descripcion"').value=_DataPanel.descripcion;
	_form.querySelector('[name="fin"').value=_DataPanel.fin;
	
	if(_DataPanel.localizacion_epsg3857!=''){
		_form.querySelector('#localizacion').style.display="block";
		cargarMapaObra();
	}
}


function formularWeb(){
	_form=document.querySelector('#formPublicacionesWeb');
	_form.style.display='block';
	
	_form.querySelector('#listapublicacionesweb').innerHTML='';
	for(_idp in _DataConfig.publicaciones){
		
		_aaa=document.createElement('a');
		_aaa.innerHTML=_DataConfig.publicaciones[_idp].nombre;
		_aaa.setAttribute('idpub',_idp);
		_aaa.setAttribute('activa',_DataConfig.publicaciones[_idp].activa);
		_aaa.setAttribute('onclick','formularPublicacion(this.getAttribute("idpub"))');		
		
		_form.querySelector('#listapublicacionesweb').appendChild(_aaa);
	}	
}

function formularPublicacion(_idpub){
	
	_dat=_DataConfig.publicaciones[_idpub]
	
	_form=document.querySelector('#formPublicacionesWeb #formpublicacionweb');
	_form.style.display='block';
	
	if(_dat.activa=='1'){
		_form.querySelector('[name="activa"]').checked=true;
	}else{
		_form.querySelector('[name="activa"]').checked=false;
	} 
	
	_form.querySelector('[name="idpub"]').value=_dat.id;
	_form.querySelector('[name="nombre"]').value=_dat.nombre;
	_form.querySelector('[name="titulo"]').value=_dat.titulo;
	_form.querySelector('[name="copete"]').value=_dat.copete;
	_form.querySelector('[name="pie"]').value=_dat.pie;
	
	_form.querySelector('[name="atribucion"]').value=_dat.atribucion;
	_form.querySelector('#listadecomponentes').innerHTML='';
	
	for(_nc in _dat.componentesOrden){
		
		_idcomp=_dat.componentesOrden[_nc];
		
		_div=document.createElement('div');
		_div.setAttribute('idcomp',_idcomp);	
		_form.querySelector('#listadecomponentes').appendChild(_div);
		
		_aaa=document.createElement('label');
		_aaa.innerHTML="comp modulo: "+_dat.componentes[_idcomp].modulo;
		_div.appendChild(_aaa);
		
		_sel=document.createElement('select');
		_sel.setAttribute('onchange','cambiarModComponente(this.value,this.parentNode.getAttribute("idcomp"))');
		_div.appendChild(_sel);
		
		_op=document.createElement('option');
		
		_op.value='';
		_op.innerHTML='- elegir -';
		_sel.appendChild(_op);
		
		for(_mod in _ModulosActivos){
			if(_ModulosActivos[_mod]==0){continue;}
			_op=document.createElement('option');
			_op.value=_mod;
			if(_Mdat[_mod].nombrealternativo != ''){
				_op.innerHTML=_Mdat[_mod].nombrealternativo;
			}else{
				_op.innerHTML=_Mdat[_mod].nombre;
			}
			_sel.appendChild(_op);
			
			if(_mod==_dat.componentes[_idcomp].modulo){
				_op.selected=true;
			}
		}
		_aaa=document.createElement('a');
		_aaa.innerHTML="x";
		_aaa.setAttribute('onclick',"eliminarComponentePub(this.parentNode.getAttribute('idcomp'))");
		_div.appendChild(_aaa);
	}
}



function actualizarAlertaGeneral(){
	
	_diva=document.querySelector('#page > h1 > #alerta');
	_cant=_diva.getAttribute('cant');
	_suma=_diva.getAttribute('suma');
	_alerta=_suma/_cant;
	
	
	_alerta=Math.round(_alerta);
	_diva.querySelector('#nivel #num').innerHTML=_alerta+'%';
	_diva.querySelector('#nivel #barra').style.width="calc("+_alerta+"% - 1px)";
	
	_rgb = colorAlerta(_alerta);
	_diva.querySelector('#nivel').style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.2)';
	_diva.querySelector('#nivel #barra').style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.6)';
	_diva.querySelector('#nivel #barra').style.borderColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',1)';	
}
	
