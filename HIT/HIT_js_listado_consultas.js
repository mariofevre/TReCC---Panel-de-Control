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

function cargaAccesos(){//TAL VEZ ESTA FuNCIÓN HABRÍA Que estandarizarla
	_parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './PAN/PAN_consulta_acceso.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			if(
				_res.data.Acc=='administrador'||_res.data.Acc=='editor'
				||
				_res.data.Acc[0]=='administrador'||_res.data.Acc[0]=='editor'
				||
				_res.data.Acc[0][0]=='administrador'||_res.data.Acc[0][0]=='editor'
			
			){
				_HabilitadoEdicion='si';
			}
			
			_UsuId = _res.data.UsuarioId;
			_UsuarioTipo= _res.data.Usuario_Tipo;
			_UsuarioAcc = _res.data.Acc;			
			document.querySelector("#encabezado #identificacion #nombre").innerHTML=_res.data.Usuario_Nombre;
			document.querySelector("#encabezado #identificacion #apellido").innerHTML=_res.data.Usuario_Apellido

			consultaGruposInicial();
        }
    })
}



function consultaGruposInicial(){
	var _parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
            var _res = $.parseJSON(response);
            console.log(_res);
            _DatosGrupos=_res.data;
            
            cargarHitos();
        }
    })
}



function enviarBorrarFormula(){    	
	_idhito=document.querySelector('.formCent[name="general"] input#cid').value;
    _parametros={
    	"idhito":_idhito,
    	"panid" : _PanId
    }
	$.ajax({
        url:   './HIT/HIT_ed_hit_borra_formula.php',
        type:  'post',
        data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
        success:  function (response){
            var _res = $.parseJSON(response);
            console.log(_res);
            for(_nm in _res.mg){
            	alert(_res.mg[_nm]);
            }
            if(_res.res!='exito'){
            	alert('error al consultar la base de datos');
            }else{
            	
            }
        }
    })
}



function recargaDatosGrupos(_destino,_tipo){
    //console.log(_tipo);
    var _destino = _destino;
    var _tipo = _tipo; 
    var _parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:  './PAN/PAN_grupos_consulta.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
            var _res = $.parseJSON(response);
        
            _DatosGrupos=_res.data;
            
            for(_nn in _res.data.gruposOrden[_tipo]){
                _dat=_res.data.grupos[_res.data.gruposOrden[_tipo][_nn]];
                _anc=document.createElement('a');
                _anc.setAttribute('onclick','cargaOpcion(this);');
                _anc.setAttribute('regid',_dat.id);
                _anc.innerHTML=_dat.nombre;
                _anc.title=_dat.descripcion;
                _destino.appendChild(_anc);
            }
        }
    })		
}

function enviarFormularioConf(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}	
	
		
	if(
        document.querySelector('#formcentConf[name="nuevafecha"] #cfecha_fecha').value==''
	){
	 	alert('por favor, defina la fecha');
        return;
	}
	_parametros={
        "panid": _PanId,
        "hitid": document.querySelector('#confirmar #cid').value,
        "fechaconfirmada": document.querySelector('#confirmar #cfecha_fecha').value
    };

	$.ajax({
		url:   './HIT/HIT_ed_crea_fecha_confirmada.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);
			//console.log(_this);
			for(_nm in _res.mg){
                alert(_res.mg[_nm]);
			}
			if(_res.res=='exito'){
               cargarHitos();	
               cerrarForm();
            }else{
                alert('ha ocurrido un error');
            }
        }
    })		
}


function borrarFecha(_this){
	if(!confirm('¿Borramos la fecha seleccionada para este hito?... ¿segure?')){return;}
	
	var _parametros = {
		'idfecha':_this.getAttribute('idfecha'),
		'idhito':document.querySelector('form#nuevafecha #cid').value,
		'panid':_PanId
	};
	
	$.ajax({
		url:   './HIT/HIT_ed_elim_fecha.php',
		type:  'post',
		data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			
			var _res = $.parseJSON(response);
			//console.log(_res);
			if(_res.res=='exito'){
				abreFormularioFecha(_this);
			}
		}    	
	})
}
 
function cargarHitos(){
    
    _parametros={};
    
    $.ajax({
        url:   './HIT/HIT_consulta_hitos.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
        	_res = PreprocesarRespuesta(response);
            
            if(_res.res!='exito'){
            	alert('error al consultar los hitos de este panel');
                console.log(_res);
                return;
            }
                
            _Hitos=_res.data.hitos;
                
            mostrarHitos(_res);
            
        }
    });	    
}


function cargarGrupos(){
    
    _parametros={};
    
    $.ajax({
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
            var _res = $.parseJSON(response);
            if(_res.res=='exito'){
                
                _DatosGrupos=_res.data;
                
                probarCargaGrupos();
            }else{
                alert('error al consultar los grupos de este panel');
                console.log(_res);
            }
        }
    });				
}

function enviarEliminar(_idhito){
		if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
        return;
	}
	var _parametros = {
        "panid" : _PanId,
		"id" : _idhito,			
		"accion":"eliminar"
	};
	$.ajax({
		url:   './HIT/HIT_ed_elim_hit.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			console.log(_res);
			for(_nm in _res.mg){
                alert(_res.mg[_nm]);
			}
			if(_res.res=='exito'){		
				cargarHitos();	
                cerrarForm();
            }else{
                alert('ha ocurrido un error');
			}
		}
	})
} 
 
function abreFormularioHit(_this){
    var _this=_this;
    _HiId=_this.getAttribute('idhit');
    if(_HiId==0){
        document.querySelector('form#general a#submit').innerHTML='crear';
    }else{
        document.querySelector('form#general a#submit').innerHTML='guardar';
    }
	vaciarOpcionares();
	document.querySelector('#formcent[name="general"]').style.display='block';
	var _parametros = {};
	
	$.ajax({
		url:   './HIT/HIT_consulta_opciones.php',
		type:  'post',
		data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);
			
			
			if(_res.res!='exito'){
                alert('error al consultar variables del formulario');
                return;
           }
           
           _Opciones=_res.data.opciones;
            
           formularHito(_res);

		}
	})	
}

function enviarFormularioFechanueva(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}	
	
	if(document.querySelector('#nuevafecha [name="fecha_tipo"]:checked')==undefined){
        alert('por favor, indique cual si se trata de una fecha prevista o de una fecha ocurrida');
        return;
	}
	if(
        document.querySelector('#nuevafecha #cfecha_fecha').value==''
	){
	 alert('por favor, defina la fecha (d m aaaa)');
        return;
	}
	_parametros={
        "panid": _PanId,
        "hitid": document.querySelector('#nuevafecha #cid').value,
        "fecha": document.querySelector('#nuevafecha #cfecha_fecha').value,
        "tipo": document.querySelector('#nuevafecha [name="fecha_tipo"]:checked').value,
        "fecha_validodesde": document.querySelector('#nuevafecha #cfecha_validodesde').value
    };

	$.ajax({
		url:   './HIT/HIT_ed_crea_fecha.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);
			//console.log(_this);
			for(_nm in _res.mg){
                alert(_res.mg[_nm]);
			}
			if(_res.res=='exito'){
                cargarHitos();	
                cerrarForm();
            }else{
                alert('ha ocurrido un error');
            }
        }
    })
	
}


function enviarFormulario(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_parametros={"panid": _PanId};
	_inps=document.querySelectorAll('#general input, #general textarea');
	
	for(_nin in _inps){
        if(typeof _inps[_nin] != 'object'){continue;}   
        if(_inps[_nin].getAttribute('name')==undefined){continue;}
        if(_inps[_nin].getAttribute('name')==''){continue;}
        if(_inps[_nin].getAttribute('type')!=undefined){
            if(_inps[_nin].getAttribute('type')=='checkbox'){
                continue;
            }
        }
        _parametros[_inps[_nin].name]=_inps[_nin].value;   
	}
	
	_inps=document.querySelectorAll('#general select option:checked');		
	for(_nin in _inps){
        if(typeof _inps[_nin] != 'object'){continue;}   
        if(_inps[_nin].parentNode.getAttribute('name')==undefined){continue;}
        if(_inps[_nin].parentNode.getAttribute('name')==''){continue;}
        _parametros[_inps[_nin].parentNode.name]=_inps[_nin].value;   
	}
	
	
	_inps=document.querySelectorAll('#general input[type="radio"]:checked');		
	for(_nin in _inps){
        if(typeof _inps[_nin] != 'object'){continue;}   
        if(_inps[_nin].getAttribute('name')==undefined){continue;}
        if(_inps[_nin].getAttribute('name')==''){continue;}
        if(_inps[_nin].getAttribute('type')!=undefined){
            if(_inps[_nin].getAttribute('type')=='checkbox'){
                continue;
            }
        }
        _parametros[_inps[_nin].name]=_inps[_nin].value;   
	}
	
	if(_this.innerHTML=='guardar'){
        _url='./HIT/HIT_ed_guarda_hit.php';
	}else if(_this.innerHTML=='crear'){
	    _url='./HIT/HIT_ed_crea_hit.php';
	}
	
	$.ajax({
		url:   _url,
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);
			//console.log(_this);
			if(_res.res=='exito'){
                cargarHitos();	
                cerrarForm();
            }else{
                alert('ha ocurrido un error');
            }
        }
    })
}



function confirmarFormularioFechanueva(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}			
	_form=document.querySelector('#formCent[name="nuevafecha"]');				
	_parametros={
        "panid": _PanId,
        "hitid": _form.querySelector('#cid').value,
        "fechaconfirmada": _form.querySelector('input[name="fecha_fecha"]').value
    };

	$.ajax({
		url:   './HIT/HIT_ed_crea_fecha_confirmada.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);
			//console.log(_this);
			for(_nm in _res.mg){
                alert(_res.mg[_nm]);
			}
			if(_res.res=='exito'){
               cargarHitos();	
               cerrarForm();
            }else{
                alert('ha ocurrido un error');
            }
        }
    })			
}

function abreFormularioFecha(_this){
    _idhito=_this.getAttribute('idhit');
    _parametros={
    	"idhito":_idhito        	
    }
    $.ajax({
		url:   './HIT/HIT_consulta_hito_evolucion.php',
		type:  'post',
		data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
    	success:  function (response){
			var _res = $.parseJSON(response);
			//console.log(_res);			
			FormularFecha(_res);
		}
	});
}
