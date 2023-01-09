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

function cambiarFechaVal(_this){
 	 var today = new Date();
    _Hoy = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' +  ("0" + today.getDate()).slice(-2);
    _this.parentNode.querySelector('.barrafecha input#cfecha_validodesde').value=_Hoy;
    localizarFechaVal(_this.parentNode.querySelector('.barrafecha input#cfecha_validodesde'));
        
    if(_this.checked==true){
        _this.parentNode.querySelector('#etiqueta_validodesde').style.display='inline-block';
        _this.parentNode.querySelector('.barrafecha').style.display='inline-block';
        _this.parentNode.parentNode.querySelector('#historial').style.display='inline-block';
        
    }else{
        _this.parentNode.querySelector('#etiqueta_validodesde').style.display='none';
        
        _this.parentNode.querySelector('.barrafecha').style.display='none';
        _this.parentNode.parentNode.querySelector('#historial').style.display='none';
    }
    
}
 
function localizarFechaVal(_this){
 	_e=_this.value.split('-');
 	//console.log(_e);
 	_y=Array(
 		parseInt(_e[0]),
 		parseInt(_e[1]),
 		parseInt(_e[2])
 	);
 	//console.log(_y);
 	//console.log(_y[0]+', ('+_y[1]+'-1), '+_y[2]);
 	_fecha=new Date(_y[0], (_y[1]-1), _y[2]);
 	//console.log(_fecha);
 	
 	_fechaU=_fecha.getTime()/1000;
 	
 	//console.log('fechaU en input: '+_fechaU);
 	_ancho=_this.parentNode.parentNode.getAttribute('anchoFechaU');
 	_min=_this.parentNode.parentNode.getAttribute('minFechaU');
 	_fechaleft=_fechaU-_min;
 	
 	_fechaleft=Math.min(_ancho,_fechaleft);
 	
 	_fechaleft=Math.max(0,_fechaleft);
 	
 	_this.parentNode.style.left='calc('+(100*_fechaleft/_ancho)+'% - 100px )';
}
 

function ajustarform(){
    if(
    	document.querySelector('form#general [name="origen"][value="opmanual"]').checked     
    ){
		if(document.querySelector('form#general div#opformula #cformula').value!=''){
        	if(!confirm('Esto eliminará la fórmula cargada. ¿Continuamos?')){
        		return;
        	}
        	enviarBorrarFormula();
        }
        document.querySelector('form#general div#opformula #cformula').value='';
                 
        document.querySelector('form#general div#opformula').style.display='none';
        
        if(document.querySelector('form#general input[name="id"]').value==0){
            document.querySelector('form#general div#opnuevafecha').style.display='none';
            document.querySelector('form#general div#opprevision').style.display='inline-block';
            document.querySelector('form#general div#opmanual').style.display='inline-block';                
        }else{
            document.querySelector('form#general div#opnuevafecha').style.display='inline-block';
            document.querySelector('form#general div#opprevision').style.display='none';
            document.querySelector('form#general div#opmanual').style.display='none';        
        }
    }else if(
        document.querySelector('form#general [name="origen"][value="opformula"]').checked
    ){
        document.querySelector('form#general div#opprevision').style.display='none';
        document.querySelector('form#general div#opmanual').style.display='none';
        document.querySelector('form#general div#opformula').style.display='inline-block';
        document.querySelector('form#general div#opnuevafecha').style.display='none';
    }

}


function activarEliminar(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
        return;
	}
	_indId=_this.parentNode.parentNode.querySelector('#cid').value;
	
	_borrar=document.createElement('a');
	_borrar.setAttribute('class','cancelar');
	_borrar.setAttribute('id','acancelarElim');
	_borrar.setAttribute('onclick','cancelarEliminar(this);');
	_borrar.innerHTML="Cancelar";
	_this.parentNode.insertBefore(_borrar,_this);
	
	_borrar=document.createElement('a');
	_borrar.setAttribute('class','eliminar');
	_borrar.setAttribute('id','aElim');
	_borrar.setAttribute('onclick','enviarEliminar('+_indId+');');
	_borrar.innerHTML="Si, Borrar";
	_this.parentNode.insertBefore(_borrar,_this);

	_this.style.display='none';
}

function probarCargaGrupos(){            
    _a=Object.keys(_DatosGrupos).length;
    _b=Object.keys(_Hitos).length;
    if(_a>0&_b>0){
        asignarGrupos();	
    }		
}

function cancelarEliminar(_this){
	_conf=_this.nextSibling;
	_conf.parentNode.removeChild(_conf);
	_this.nextSibling.style.display='inline-block';
	_this.parentNode.removeChild(_this);
}	


function tecleoGeneral(_event){
	if(_event.keyCode==27){
		
		//console.log('es esc');
		if(typeof _StopTecleoEsc !== 'undefined'){//evita superposición con PAN_grupos_form.js
			//console.log('existe');
			//alert(_StopTecleoEsc);
			if(_StopTecleoEsc=='si'){
			//console.log('frenando');
			_StopTecleoEsc='no';
			return;
		}}
		
		if(
			document.querySelector('#formcent[name="nuevafecha"]').style.display=='block'
		){
			cerrarForm();
		}else if(document.querySelector('#formcent[name="general"]').style.display=='block'){
			cerrarForm();
		}else if(document.querySelector('#formcentConf[name="nuevafecha"]').style.display=='block'){
			formcentConf
		}
	}
}


function abreFormularioConfirma(_this){	 	
    _idhito=_this.getAttribute('idhit');
    _form=document.querySelector('#formcentConf');
	_form.style.display='block';
	_form.querySelector('#cid').value=_idhito;
	_form.querySelector('#cnombre').innerHTML=_Hitos[_idhito].nombre;
	_form.querySelector('#cfecha_fecha').value=_Hitos[_idhito].fecha;	
}    


function alterna(_id, _estado){
	if(_estado==false){
		document.getElementById(_id).value='0';
	}else if(_estado==true){
		document.getElementById(_id).value='1';
	}
}


function opcionarGrupos(_this){		
	vaciarOpcionares();		
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');
	_tipo=_id.substring(27,28);
	recargaDatosGrupos(_destino,_tipo);		
}


function opcionarTipos(_this){
	vaciarOpcionares();		
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');		
	_destino.innerHTML='';      
    for(_nn in _Opciones.id_p_HITtipohito_id_nombre){
        _dat=_Opciones.id_p_HITtipohito_id_nombre[_nn];
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('regid',_dat.id);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
}	


function opcionarActores(_this){
	vaciarOpcionares();		
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');	
    _destino.innerHTML='';
    for(_nn in _Opciones.id_p_ACTactores_id_nombre){
        _dat=_Opciones.id_p_ACTactores_id_nombre[_nn];
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('regid',_dat.id);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
}	


function vaciarOpcionares(_event){			
    if(_event!=undefined){
        console.log(_event);
        console.log(_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling);
        console.log(_event.originalTarget);
        
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
    
    if(_id.substring(0,14)=='cid_p_HIThitos'){
        actualizarFechaHito(_input);
    }					
}

function  filtrarOpciones(_this){
	_id=_this.getAttribute('id');
	_idref=_id.substring(0,(_id.length-2));
	document.getElementById(_idref).value='n';
	
	if(_this.value.length>2){
		_contenido=_this.nextSibling.querySelector('.contenido');			
		_list=_contenido.childNodes;
		//_list=_Opciones.id_p_HIThitos_id_nombre_desde
		
		for(_nn in _list){
			if(typeof _list[_nn]=='object'){
			_list[_nn].style.backgroundColor='transparent';
			//console.log(_list[_nn]);
			if(_list[_nn].innerHTML.toLowerCase().indexOf(_this.value.toLowerCase()) !== -1){				
				_list[_nn].style.backgroundColor='yellow';
				_contenido.insertBefore(_list[_nn], _contenido.firstChild);			
			}
			}
		}
	}
}


function cerrarForm(){
	document.querySelector('#formcentConf').style.display='none';
    document.querySelector('#formcent[name="general"]').style.display='none';
    document.querySelector('form#general #opnuevafecha').style.display='none';
	_form=document.getElementById('general');
	_inn=_form.querySelectorAll('input');
	for(_nn in _inn){
		if(typeof _inn[_nn]=='object'){
			if(_inn[_nn].getAttribute('fijo')=='fijo'){
				
			}else{
                if(_inn[_nn].getAttribute('type')!=undefined){
                    if(_inn[_nn].getAttribute('type')=='button'){continue;}
                    
                    if(_inn[_nn].getAttribute('type')=='radio'){
                        _inn[_nn].checked=false;
                    }else{
                        _inn[_nn].value='';
                    }                    
                }else{
                    _inn[_nn].value='';
				}
			}
		}
	}

	document.getElementById('cnid').innerHTML='0000';
	_ac=document.getElementById('acancelarElim');
	if(_ac!=undefined){_ac.parentNode.removeChild(_ac);}
	_ae=document.getElementById('aElim');
	if(_ae!=undefined){_ae.parentNode.removeChild(_ae);}
	document.getElementById('aactivaElim').style.display="inline-block";

    
    
    document.querySelector('#formcent[name="nuevafecha"]').style.display='none';        
	_form=document.querySelector('#formcent[name="nuevafecha"] #nuevafecha');
	_inn=_form.querySelectorAll('input');
	for(_nn in _inn){
		if(typeof _inn[_nn]=='object'){
			
            if(_inn[_nn].getAttribute('type')!=undefined){
            	
                if(_inn[_nn].getAttribute('type')=='button'){
                	continue;
                }
                
                if(_inn[_nn].getAttribute('type')=='radio'){
					_inn[_nn].checked=false;
                }else{
					_inn[_nn].value='';
                }
            }else{
                _inn[_nn].value='';
            }
		}
	}	
}
