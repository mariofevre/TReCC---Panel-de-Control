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

///funciones para editar y crear items
	
function resaltar(_this){
	//realta el div del item al que pertenese un título o una descripcion
	
	_dests=document.querySelectorAll('[resaltado="si"]');
	for(_nn in _dests){
		if(typeof _dests[_nn]=='object'){
			_dests[_nn].removeAttribute('resaltado');
		}
	}
	_this.parentNode.setAttribute('resaltado','si');
	
}

function desaltar(_this){
	//realta el div del item al que pertenese un título o una descripcion
	_dests=document.querySelectorAll('[resaltado="si"]');
	for(_nn in _dests){
		if(typeof _dests[_nn]=='object'){
			_dests[_nn].removeAttribute('resaltado');
		}
	}
}

function editarI(_this){
	//abre el formulario para edittar item
	_idit=_this.parentNode.getAttribute('idit');
	_form=document.querySelector('#editoritem');
	_form.style.display='block';
	_form.querySelector('input[name="titulo"]').value=_Items[_idit].titulo;
	_form.querySelector('input[name="id"]').value=_Items[_idit].id;
	_form.querySelector('[name="descripcion"]').value=_Items[_idit].descripcion;			
	
	if(_Items[_idit].edicion=='no'){
		_form.setAttribute('bloqueado','si');
	}else{
		_form.setAttribute('bloqueado','no');
	}
	
	_grupoa=_Items[_idit].id_p_grupos_tipob;
	_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa"]').value=_Items[_idit].id_p_grupos_tipoa;
	_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa-n"]').value=_DatosGrupos.grupos[_Items[_idit].id_p_grupos_tipoa].nombre;
		
		
	if(_Items[_idit].id_p_grupos_tipoa=='0'){
		if(_this.getAttribute('grupoa')!='0'){
			_grupoa=_this.parentNode.getAttribute('grupoa');
			_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa-n"]').value=_DatosGrupos.grupos[_grupoa].nombre;
		}
	}
	
	_grupob=_Items[_idit].id_p_grupos_tipob;		
	_form.querySelector('input[name="id_p_grupos_id_nombre_tipob"]').value=_Items[_idit].id_p_grupos_tipob;
	_form.querySelector('input[name="id_p_grupos_id_nombre_tipob-n"]').value=_DatosGrupos.grupos[_Items[_idit].id_p_grupos_tipob].nombre;
		
	if(_Items[_idit].id_p_grupos_tipob=='0'){
		
		if(_this.parentNode.getAttribute('grupob')!='0'){
			_grupob=_this.parentNode.getAttribute('grupob');
			_form.querySelector('input[name="id_p_grupos_id_nombre_tipob-n"]').value=_DatosGrupos.grupos[_grupob].nombre;
		}
	}
}


function cerrar(_this){
	//cierra el formulario que lo contiene
	_this.parentNode.style.display='none';
}





function opcionarGrupos(_this){		
	vaciarOpcionares();		
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');
	_tipo=_id.substring(27,28);
	recargaDatosGrupos(_destino,_tipo);		
}

function vaciarOpcionares(_event){			
	if(_event!=undefined){
				   
		if(
			_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling==_event.originalTarget
			||
			_event.explicitOriginalTarget.parentNode.parentNode.previousSibling==_event.originalTarget
			){
			return;
		}
	}
	
	_vaciaresA=document.querySelectorAll('.auxopcionar');
	
	for(_nn in _vaciaresA){
		if(_vaciaresA[_nn].style!=undefined){
		//console.log(_vaciaresA[_nn]);
		_vaciaresA[_nn].style.display='none';
		}
	}
	
	_vaciares=document.querySelectorAll('.auxopcionar .contenido');
	for(_nn in _vaciares){
		_vaciares[_nn].innerHTML='';
	}
}

function cargaOpcion(_this){
	console.log(_this);
	_regid=_this.getAttribute('regid');
	console.log(_regid);
	_regnom=_this.innerHTML;
	console.log(_regnom);
	_regtit=_this.title;	
			
	_inputN=_this.parentNode.parentNode.previousSibling;
	_inputN.title=_regtit;
	_inputN.value=_regnom;
	
	_inputN.focus();
	_id=_inputN.getAttribute('id');
	_ff=_id.substring(0,(_id.length-2));			
	console.log(_ff);
	
	_input=document.getElementById(_ff);
	_input.value=_regid;
	
			
}

   ///funciones para editar documentos	
    function editarD(_event,_this){				
        //abre el formulario para edittar item
        _event.preventDefault();
        _event.stopPropagation();
           
        _iddoc=_this.getAttribute('idfi');
        
        _form=document.querySelector('#editordoc');
        _form.style.display='block';
        
        _form.querySelector('#autor').innerHTML=_Docs[_iddoc].usu_nom;
        _form.querySelector('#fecha').innerHTML=_Docs[_iddoc].zz_AUTOFECHACREACION;
        
        _form.querySelector('#botondescarga').setAttribute('href',_Docs[_iddoc].FI_documento)
        _form.querySelector('#botondescarga').setAttribute('download',_Docs[_iddoc].nombre);
        
        _form.querySelector('[name="nombre"]').value=_Docs[_iddoc].nombre;
        _form.querySelector('input[name="id"]').value=_Docs[_iddoc].id;
        _form.querySelector('[name="descripcion"]').value=_Docs[_iddoc].descripcion;
        
        if(_Items[_Docs[_iddoc].id_p_ESPitems].edicion=='no'){
        	_form.setAttribute('bloqueado','si');            	
        }else{
        	_form.setAttribute('bloqueado','no');
        }
    }
    
    
    
    ///funciones para editar links
    function editarL(_event,_this){				
        //abre el formulario para edittar item
        _event.preventDefault();
        _event.stopPropagation();
           
        _idlink=_this.getAttribute('idli');
        
        _form=document.querySelector('#editorlink');
        _form.style.display='block';
        
        _form.querySelector('#autor').innerHTML=_Links[_idlink].usu_nom;
        _form.querySelector('#fecha').innerHTML=_Links[_idlink].zz_AUTOFECHACREACION;
        
        _form.querySelector('#botonlink').setAttribute('href',_Links[_idlink].url)
        
        _form.querySelector('[name="nombre"]').value=_Links[_idlink].nombre;
        _form.querySelector('[name="url"]').value=_Links[_idlink].url;
        _form.querySelector('input[name="id"]').value=_Links[_idlink].id;
        _form.querySelector('[name="descripcion"]').value=_Links[_idlink].descripcion;
        
        if(_Items[_Links[_idlink].id_p_ESPitems].edicion=='no'){
        	_form.setAttribute('bloqueado','si');            	
        }else{
        	_form.setAttribute('bloqueado','no');
        }
    }
    
    ///////////////////////////
//funciones para crear links
function formcrearlink(_event,_this){				
	//abre el formulario para cargar link
	_event.preventDefault();
	_event.stopPropagation();
	_form=document.querySelector('#formcrearlink');
	_form.style.display='block';
	_form.querySelector('input[name="linkName"]').value=null;
	_form.querySelector('input[name="linkUrl"]').value=null;
	_form.querySelector('textarea[name="descricpion"]').value=null;
}






//
/////////////////////
		function toogle(_elem){
		    _nombre=_elem.parentNode.parentNode.getAttribute('class');
	
		    elementos = document.getElementsByName(_nombre);
		    for (x=0;x<elementos.length;x++){			
				elementos[x].removeAttribute('checked');
			}
		    _elem.previousSibling.setAttribute('checked','checked');		
		}
//
/////////////////////


//funciones para guardar archivos
	
	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#archivos #contenedorlienzo').style.backgroundColor='lightblue';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#archivos #contenedorlienzo').removeAttribute('style');
	}

	
	
/////////////////////
//funciones para gestionar drag y drop de items
	function allowDrop(_event,_this){
		_event.stopPropagation();
		if(JSON.parse(_event.dataTransfer.getData("text")).tipo!='item'){
			return;
		}
		limpiarAllow();		
		_this.setAttribute('destino','si');
		_event.preventDefault();
		
	}
	
	function limpiarAllow(){
		_dests=document.querySelectorAll('[destino="si"]');
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].removeAttribute('destino');
			}
		}
	}
	
	function resaltaHijos(_event,_this){
		//realta el div del item al que pertenese un título o una descripcion
		_dests=document.querySelectorAll('[destino="si"]');
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].removeAttribute('destino');
			}
		}
		_this.setAttribute('destino','si');
		_event.stopPropagation();
		
	}
	function desaltaHijos(_this){
		//realta el div del item al que pertenese un título o una descripcion
		_this.removeAttribute('destino');
		_this.parentNode.removeAttribute('destino');
	}
	
	
	function drag(_event){			
		_arr=Array();
		_arr={
			'id':_event.target.getAttribute('idit'),
			'tipo':'item'
		};		
		_arb = JSON.stringify(_arr);

		_event.dataTransfer.setData("text", _arb);
	}
	
	function bloquearhijos(_event,_this){			
		_idit=JSON.parse(_event.dataTransfer.getData("text")).id;
		_negados = _this.querySelectorAll('.item[idit="'+_idit+'"] .hijos, .item[idit="'+_idit+'"] .medio');   
				
		for(_nn in _negados){
			if(typeof _negados[_nn] == 'object'){
				_negados[_nn].setAttribute('destino','negado');
			}
		}
	}
	
	function desbloquearhijos(_this){
		_negados=document.querySelectorAll('[destino="negado"]');
		for(_nn in _negados){
			if(typeof _negados[_nn] == 'object'){
				_negados[_nn].removeAttribute('destino');
			}
		}
	}	
	
//
//////////////////////

////////////////////////////////////////////////////
//funciones para gestionar drag y drop de archivos
		
		function dragFile(_event){
			//alert(_event.target.getAttribute('idit'));
			_event.stopPropagation();
			
			if(_event.target.getAttribute('idfi')!=undefined){
				_id=_event.target.getAttribute('idfi')
				_tipo='archivo';
			}else{
				_id=_event.target.getAttribute('idli')
				_tipo='link';
			}
			
    		_arr=Array();
			_arr={
				'id':_id,
				'tipo':_tipo
			};
			_arb = JSON.stringify(_arr);
    		_event.dataTransfer.setData("text", _arb);
    		
    		
    		//console.log(_event.dataTransfer.getData("text"));
		}
		
		function allowDropFile(_event,_this){
			//console.log(_this.parentNode.getAttribute('idit'));
			//console.log(_event.dataTransfer);
			
			if(_event.dataTransfer.items[0].kind=='file'){return;}
			_tipo=JSON.parse(_event.dataTransfer.getData("text")).tipo;
			if(
				_tipo!='archivo'
				&&
				_tipo!='link'
			){
				return;
			}
			
					
			_iddoc=JSON.parse(_event.dataTransfer.getData("text")).id;
			
			if(_Docs[_iddoc]!=undefined){
				_iditemorigen=_Docs[_iddoc].id_p_ESPitems;
				if(_Items[_iditemorigen]!=undefined){
					if(_Items[_iditemorigen].edicion=='no'){
						return;
					}
				}
			}
			
			//console.log(_this.getAttribute('idit'));
			if(_Items[_this.getAttribute('idit')]!=undefined){
				if(_Items[_this.getAttribute('idit')].edicion=='no'){
			    	return;
			    }
			}
			
			limpiarAllowFile();
			_event.stopPropagation();
			_this.setAttribute('destinof','si');
			_event.preventDefault();
		}
		
		function limpiarAllowFile(){
			_dests=document.querySelectorAll('[destinof="si"]');
			for(_nn in _dests){
				if(typeof _dests[_nn]=='object'){
					_dests[_nn].removeAttribute('destinof');
				}
			}
		}
		
