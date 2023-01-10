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

function consultarPanel(){
	 var parametros = {
		"id" : _IdCom,
		"tabla":'comunicaciones',
		"cargapanel":'si'
	};
	$.ajax({
		data:  parametros,
		url:   './PAN/PAN_localizar_panel_desde_objeto.php',
		type:  'post',
		error: function (response){alert('error al contactar al servidor');},
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			 
			if(_res.res!='exito'){return;}
			
			if(
				_res.data.usuarioacc=='administrador'
				||
				_res.data.usuarioacc=='editor'
			){
				
				document.querySelector('#editorFormato').setAttribute('visible','si');
			}else{
				//document.querySelector('#editorFormato').style.display='none';	
			}
			cargarUnaFila(_IdCom);
		}
	})
}


function mostrarCom(){
	
	actualizarCSS(_Data.comunicacion.CSS)

	document.querySelector('#page').innerHTML='';
	
	_div = document.createElement('div');
	_div.setAttribute('id','encabezado');
	_div.innerHTML=_Data.comunicacion.encabezadoHTML;
	document.querySelector('#page').appendChild(_div);
	
	_div = document.createElement('div');
	_div.setAttribute('id','cuerpo');
	_div.innerHTML = _Data.comunicacion.descripcion;
	document.querySelector('#page').appendChild(_div);

	
	if(Object.keys(_Data.comunicacion.adjuntos).length>0){
		
		_divad=document.createElement('div');
		_divad.setAttribute('id','parrafoadjuntos');
		document.querySelector('#page').appendChild(_divad);
		
		_h3=document.createElement('h3');
		
		_h3.innerHTML='Documentos adjuntos';
		_divad.appendChild(_h3);
		
		for(_na in _Data.comunicacion.adjuntos){
			
			_datad=_Data.comunicacion.adjuntos[_na];
			_aaa=document.createElement('a');
			
			if(_datad.descripcion!=''){
				_nom=_datad.descripcion;
			}else{
				_nom=_datad.FI_nombreorig;
			}
			_aaa.setAttribute('href',_datad.FI_documento);
			_aaa.setAttribute('download',_nom);
			_aaa.setAttribute('class','adjunto');
			_aaa.innerHTML=_nom;
			
			_divad.appendChild(_aaa);	
		}
	}
	
	
	
	_divp = document.createElement('div');
	_divp.setAttribute('id','pie');
	_divp.innerHTML=_Data.comunicacion.pieHTML;
	document.querySelector('#page').appendChild(_divp);

	
	
	_campos=document.querySelector('#page').querySelectorAll('[campo="ident"], [class="ident"]');
	for(_nc in _campos){
		_campos[_nc].innerHTML=_Data.comunicacion.id1;
	}
	
	_campos=document.querySelector('#page').querySelectorAll('[campo="id2"], [class="id2"]');
	for(_nc in _campos){
		_campos[_nc].innerHTML=_Data.comunicacion.id2;
	}
	
	_campos=document.querySelector('#page').querySelectorAll('[campo="emision"], [class="emision"]');
	for(_nc in _campos){
		_campos[_nc].innerHTML=_Data.comunicacion.zz_reg_fecha_emisionTx;
	}
	
	document.querySelector('div.aux').setAttribute('estado','encendido');
	
	
	
	paginar();	
 }


 function paginar(){
	_componentes=document.querySelector('#page[pagenum="'+_Pag+'"] > #cuerpo').childNodes;
	
	_repaginarDesde='0';
	
	for(_cn in _componentes){
		if(typeof _componentes[_cn] != 'object'){continue;}
		
		_el=_componentes[_cn];
		if(_el.nodeName=='#text'){continue;}
		//console.log(_cn);
		//console.log(_el);
		
		/*
		_rect = _el.getBoundingClientRect();
		console.log(_cn, _rect.top, _rect.right, _rect.bottom, _rect.left);
		*/
		
		//console.log(_el.offsetTop, (_el.offsetHeight+_el.offsetTop));
		 
		_posfondo=_el.offsetHeight+_el.offsetTop
		if(_posfondo>986){
			
			_repaginarDesde=parseInt(_cn);
			console.log('repaginanddo desde'+_cn);
			break;
		}
	}
	
	
	
	if(_repaginarDesde>0){
		console.log('creando pagina');
		_componentes=document.querySelector('#page[pagenum="'+_Pag+'"] > #cuerpo').childNodes;
		_Pag++;
		
		_pageb=document.createElement('div');
		_pageb.setAttribute('id','pageborde');
		document.querySelector('body').appendChild(_pageb);
		
		_page=document.createElement('div');
		_page.setAttribute('id','page');
		_page.setAttribute('pagenum',_Pag);
		_pageb.appendChild(_page);
	
		_div = document.createElement('div');
		_div.setAttribute('id','encabezado');
		_div.innerHTML=_Data.encabezadoHTML;
		_page.appendChild(_div);

		_cuerpo = document.createElement('div');
		_cuerpo.setAttribute('id','cuerpo');
		_page.appendChild(_cuerpo);
		
		_div = document.createElement('div');
		_div.setAttribute('id','pie');
		_div.innerHTML=_Data.pieHTML;
		_page.appendChild(_div);

					
		_campos=_page.querySelectorAll('[campo="ident"], [class="ident"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_Data.ident;
		}
		
		_campos=_page.querySelectorAll('[campo="id2"], [class="id2"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_Data.id2;
		}
		
		_campos=_page.querySelectorAll('[campo="emision"], [class="emision"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_Data.zz_reg_fecha_emisionTx;
		}
		
		console.log(_componentes);
		console.log(_componentes.length);
		_largo=_componentes.length;
		_nn=0;
		var i;
		
		for (i = 0; i < (_largo-_repaginarDesde); i++) {
			
			console.log(i);
			//console.log(_repaginarDesde);
			//console.log(_componentes[_repaginarDesde]);
			
			if(typeof _componentes[_repaginarDesde] != 'object'){continue;}
			//console.log("elemento a paginar");
			
			//console.log(_componentes[_repaginarDesde]);
			//console.log(_cuerpo);
			
			_cuerpo.appendChild(_componentes[_repaginarDesde]);
		}	
		
		paginar();
	}
 }
