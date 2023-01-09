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


function generarArchivosHTML(){
	
	 if(Object.keys(_Items[0].archivos).length>0){
		for(_na in _Items[0].archivos){
			_dat=_Items[0].archivos[_na];
			
			 _Docs[_dat.id]=_dat;
	   
			_aaa=document.createElement('a');
			_aaa.innerHTML=_dat.nombre;
			_aaa.setAttribute('onclick','editarD(event,this)');
			_aaa.setAttribute('draggable',"true");
			_aaa.setAttribute('ondragstart',"dragFile(event)");
			_aaa.setAttribute('idfi',_dat.id);
			_aaa.setAttribute('class','archivo');					
			document.getElementById('listadoaordenar').appendChild(_aaa);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/editar.png">';
			_aasub.setAttribute('onclick','event.stopPropagation();editarD(event,this.parentNode)');
			_aaa.appendChild(_aasub);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/abajo.png">';
			_aasub.setAttribute('download',_dat.nombre);
			_aasub.setAttribute('onclick','event.stopPropagation();');
			_aasub.setAttribute('href',_dat.archivo); 
			_aaa.appendChild(_aasub);
			
			_spansub=document.createElement('span');
			_spansub.innerHTML=_dat.usu_log+' '+_dat.zz_AUTOFECHACREACION;
			_spansub.title=_dat.usu_nombre;
			_aaa.appendChild(_spansub);
								
			document.getElementById('listadoaordenar').appendChild(_aaa);					
		}	
	}		
}



function generarLinksHTML(){	 
	for(_na in _Items[0].links){
		_dat=_Items[0].links[_na];
		
		 _Links[_dat.id]=_dat;
   
		_aaa=document.createElement('a');
		_aaa.innerHTML=_dat.nombre;
		_aaa.setAttribute('onclick','editarL(event,this)');
		_aaa.setAttribute('draggable',"true");
		_aaa.setAttribute('ondragstart',"dragFile(event)");
		_aaa.setAttribute('idli',_dat.id);
		_aaa.setAttribute('class','archivo link');					
		document.getElementById('listadoaordenar').appendChild(_aaa);
		
		_aasub=document.createElement('a');
		_aasub.innerHTML='<img src="./img/editar.png">';
		_aasub.setAttribute('onclick','event.stopPropagation();editarL(event,this.parentNode)');
		_aaa.appendChild(_aasub);
		
		_aasub=document.createElement('a');
		_aasub.innerHTML='<img src="./img/link.png">';
		_aasub.setAttribute('href',_dat.url);
		_aasub.setAttribute('target','blank');
		_aasub.setAttribute('onclick','event.stopPropagation();'); 
		_aaa.appendChild(_aasub);
		
		_spansub=document.createElement('span');
		_spansub.innerHTML=_dat.usu_log+' '+_dat.zz_AUTOFECHACREACION;
		_spansub.title=_dat.usu_nombre;
		_aaa.appendChild(_spansub);
							
		document.getElementById('listadoaordenar').appendChild(_aaa);					
	}					
}		

function generarItemsHTML(){
	//genera un elemento html por cada instancia en el array _Items
	for(_nO in _Orden.items){
		_ni=_Orden.items[_nO];
		
		_Items[_ni].edicion='no';
		
		_dat=_Items[_ni];
		_clon=document.querySelector('#modelos .item').cloneNode(true);
		
		_clon.setAttribute('grupoa',_dat.id_p_grupos_tipoa);						
		_clon.setAttribute('grupob',_dat.id_p_grupos_tipob);						
			
		_clon.setAttribute('idit',_dat.id);
		_clon.querySelector('h3').innerHTML=_dat.titulo;
		_clon.querySelector('p').innerHTML=_dat.descripcion;
		_clon.setAttribute('nivel',"1");
		
		
		for(_na in _dat['archivos']){
			_dar=_dat['archivos'][_na];
			
			_Docs[_dar.id]=_dar;
			_aa=document.createElement('a');
			_aa.innerHTML=_dar.nombre;
			_aa.setAttribute('onclick','editarD(event,this)');					
			_aa.setAttribute('draggable',"true");
			_aa.setAttribute('ondragstart',"dragFile(event)");
			_aa.setAttribute('idfi',_dar.id);
			_aa.setAttribute('class','archivo');
			_clon.querySelector('.documentos').appendChild(_aa);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/editar.png">';
			_aasub.setAttribute('onclick','event.stopPropagation();editarD(event,this.parentNode)');
			_aa.appendChild(_aasub);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/abajo.png">';
			_aasub.setAttribute('download',_dar.nombre);
			_aasub.setAttribute('onclick','event.stopPropagation();');
			_aasub.setAttribute('href',_dar.FI_documento);
			_aa.appendChild(_aasub);
			
			_spansub=document.createElement('span');
			_spansub.innerHTML=_dar.usu_log+' '+_dar.zz_AUTOFECHACREACION;
			_spansub.title=_dar.usu_nom;
			_aa.appendChild(_spansub);
					
		}
		
		for(_na in _dat['links']){
			_dar=_dat['links'][_na];
			
			_Links[_dar.id]=_dar;
			_aa=document.createElement('a');
			_aa.innerHTML=_dar.nombre;
			_aa.setAttribute('onclick','editarL(event,this)');					
			_aa.setAttribute('draggable',"true");
			_aa.setAttribute('ondragstart',"dragFile(event)");
			_aa.setAttribute('idli',_dar.id);
			_aa.setAttribute('class','archivo link');
			_clon.querySelector('.documentos').appendChild(_aa);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/editar.png">';
			_aasub.setAttribute('onclick','event.stopPropagation();editarL(event,this.parentNode)');
			_aa.appendChild(_aasub);
			
			_aasub=document.createElement('a');
			_aasub.innerHTML='<img src="./img/link.png">';
			_aasub.setAttribute('onclick','event.stopPropagation();');
			_aasub.setAttribute('href',_dar.url);
			_aasub.setAttribute('target','blank');
			_aa.appendChild(_aasub);
			
			_spansub=document.createElement('span');
			_spansub.innerHTML=_dar.usu_log+' '+_dar.zz_AUTOFECHACREACION;
			_spansub.title=_dar.usu_nom;
			_aa.appendChild(_spansub);
					
		}
		
		document.querySelector('#contenidoextenso > .hijos').appendChild(_clon);
	}
	  
	//anida los items generados unos dentro de otros
	for(_nO in _Orden.items){
		_ni=_Orden.items[_nO];
		_el=document.querySelector('#contenidoextenso > .hijos > .item[idit="'+_Items[_ni].id+'"]');				
		
		_grupoa=_Items[_ni].id_p_grupos_tipoa;
		_grupob=_Items[_ni].id_p_grupos_tipob;
		
		if(_Items[_ni].id_p_ESPitems_anidado!='0'){
			//alert(_Items[_ni].id_p_ESPitems_anidado);
			_dest=document.querySelector('#contenidoextenso > .hijos .item[idit="'+_Items[_ni].id_p_ESPitems_anidado+'"] > .hijos');
			_niv=_dest.parentNode.getAttribute('nivel');
			
			if(_dat.id_p_grupos_tipoa=='0'){
				_grupoa=_dest.parentNode.getAttribute('grupoa');
				_el.setAttribute('grupoa',_grupoa);						
			}
			
			if(_dat.id_p_grupos_tipob=='0'){	
				_grupob=_dest.parentNode.getAttribute('grupob');
				_el.setAttribute('grupob',_grupob);
			}
			
			_niv++;
			_el.setAttribute('nivel',_niv.toString());
			_dest.appendChild(_el);
		}
		
		console.log(_Acc);
		if(_Acc[0][0]=='editor'||_Acc[0][0]=='administrador'){
			console.log('administrador');
			_el.querySelector('img.bloqu').style.display='none';
			_Items[_ni].edicion='ok';
			
		}else{					
			
			if(_Acc[_grupoa]!=undefined){						
				if(_Acc[_grupoa][_grupob]!=undefined){							
					if(
						_Acc[_grupoa][_grupob]=='editor'
						||
						_Acc[_grupoa][_grupob]=='administrador'
					){
						_el.querySelector('img.bloqu').style.display='none';	
						_Items[_ni].edicion='ok';				
					}
				}	
			}
		}
	}
	
		
	_itemscargados=document.querySelectorAll('#contenidoextenso > .hijos .item');
	
	for(_nni in _itemscargados){
		if(typeof _itemscargados[_nni]=='object'){
			_esp=document.createElement('div');				
			_esp.setAttribute('class','medio');
			_esp.innerHTML='<div class="submedio"></div>';
			_esp.setAttribute('ondragover',"allowDrop(event,this);resaltaHijos(event,this)");
			_esp.setAttribute('ondragleave',"desaltaHijos(this)");
			_esp.setAttribute('ondrop',"drop(event,this)");  
			_itemscargados[_nni].parentNode.insertBefore(_esp, _itemscargados[_nni]);
		}
	}
}
