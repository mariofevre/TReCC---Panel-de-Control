/* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
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
			
			
			
			consultarUsuarios();
        }
    })
}




function consultarListado(){
    _parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './SEG/SEG_consulta.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            //console.log(_res);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            
            _DataSeguimientos=_res.data.seguimientos;
            _DataSeguimientosCargado='si';
    		llamarElementosIniciales();
    
            mostrarListado(_res);
            
            if(document.querySelector('form#seguimiento[estado="activo"]')!=null){            	
            	if(document.querySelector('form#seguimiento[estado="activo"] [name="idseg"]')!=null){
            		_idseg=document.querySelector('form#seguimiento[estado="activo"] [name="idseg"]').value;
            		mostrarFormularioSeguimientoListaAcciones(_res.data.seguimientos[_idseg]);	
            	}	
            }
        }
    });
}   


function consultarUsuarios(){
	_parametros = {
	'zz_AUTOPANEL': _PanId
	};
	
	$.ajax({
    url:   './PAN/PAN_usuarios_consulta.php',
    type:  'post',
    data: _parametros,
    error: function (response){alert('error al intentar contatar el servidor');},
    success:  function (response){
        var _res = $.parseJSON(response);
        for(_nm in _res.mg){alert(_res.mg[_nm]);}
        if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
        
       	_DatosUsuarios=_res.data.usuarios;
       	llamarElementosIniciales()
       	
       	document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
       	document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
       	
       	for(_nu in _DatosUsuarios.delPanelOrden){
       		_idusu = _DatosUsuarios.delPanelOrden[_nu];
       		_op=document.createElement('option');
       		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
       		_op.value=_idusu;
       		document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').appendChild(_op);
       		document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').appendChild(_op.cloneNode(true));
       	}

		
		if(_DatosGrupos[0]!=undefined){
			consultarListado(); 
		}
   }
   });
}



function consultarGrupos(){
    var parametros = {
    };			
    $.ajax({
        data:  parametros,
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            
            
            var _res = $.parseJSON(response);
            //console.log(_res);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            
            if(_res.res=='exito'){
                _DatosGrupos=_res.data.grupos;
                _DatosGruposCargado='si';
                llamarElementosIniciales();
           
		        if(_DatosUsuarios.delPanel!=undefined){
					consultarListado(); 
	  			}
            }
        }
    });
}


function consultarFrecuentes(){
    var parametros = {};			
    $.ajax({
        data:  parametros,
        url:   './SEG/SEG_consulta_accion_frecuentes.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
             var _res = $.parseJSON(response);
            //console.log(_res);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            
            if(_res.res=='exito'){
                _AccionesFrecuentes=_res.data.casos;
			}  
        }
    });
}

function formularSeguimiento(_idseg,event){
	_parametros = {
        'panid': _PanId,
        'idseg':_idseg
    };
    _IdSegEdit=_idseg;
    $.ajax({
        url:   './SEG/SEG_consulta_seguimiento.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            mostrarFormularioSeguimiento(_res);
        }
    });    
}


function formularAccion(_idacc,_event){
			
	consultarFrecuentes();
	if(typeof _event == 'object'){
		_event.stopPropagation();
	}
	_parametros = {
        'panid': _PanId,
        'idacc': _idacc,
        'idseg':_IdSegEdit
    };
    
    $.ajax({
        url:   './SEG/SEG_consulta_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            mostrarFormularioAccion(_res);
        }
    });    
}

function formularAccionVinculosCom(_idacc,_event){
			
	consultarFrecuentes();
	if(typeof _event == 'object'){
		_event.stopPropagation();
	}
	_parametros = {
        'panid': _PanId,
        'idacc': _idacc,
        'idseg':_IdSegEdit
    };
    
    $.ajax({
        url:   './SEG/SEG_consulta_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _dataacc=_res.data.accion;
            mostrarFormularioAccionVinculosCom(_dataacc);
        }
    });    
}

function formularAccionVinculosCnt(_idacc,_event){
			
	consultarFrecuentes();
	if(typeof _event == 'object'){
		_event.stopPropagation();
	}
	_parametros = {
        'panid': _PanId,
        'idacc': _idacc,
        'idseg':_IdSegEdit
    };
    
    $.ajax({
        url:   './SEG/SEG_consulta_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _dataacc=_res.data.accion;
            mostrarFormularioAccionVinculosCnt(_dataacc);
        }
    });    
}


function guardarSeguimiento(_this,event){
			
	_parametros = {
        'panid': _PanId,
        'idseg':document.querySelector('form#seguimiento input[name="idseg"]').value,
        'id_p_usuarios_responsable':document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').value,
        'nombre':document.querySelector('form#seguimiento input[name="nombre"]').value,
        'info':document.querySelector('form#seguimiento textarea[name="info"]').value,
        'tipo':document.querySelector('form#seguimiento input[name="tipo"]').value,
        'fecha':document.querySelector('form#seguimiento input[name="fecha"]').value,
        'fecha_tipo':document.querySelector('form#seguimiento [name="fecha_tipo"]').value,
        'fechacierre':document.querySelector('form#seguimiento input[name="fechacierre"]').value,
        'fechacierre_tipo':document.querySelector('form#seguimiento [name="fechacierre_tipo"]').value,
        'id_p_grupos_tipo_a':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a"]').value,
        'id_p_grupos_tipo_a_n':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a_n"]').value,
        'id_p_grupos_tipo_b':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b"]').value,
        'id_p_grupos_tipo_b_n':document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b_n"]').value
    };
    document.querySelector('form#seguimiento').setAttribute('estado','inactivo');
    
    $.ajax({
        url:   './SEG/SEG_ed_seguimiento.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            
            for(_idg in _res.data.gruposcreados){
            	_DatosGrupos[_idg]=_res.data.gruposcreados[_idg];
            }
            
            consultarListado();
        }
    });    
}	

function crearSeguimiento(){
	
	_parametros = {
        'panid': _PanId	        
   }
    $.ajax({
        url:   './SEG/SEG_ed_crear_seguimiento.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idseg = _res.data.nidseg;
            consultarListado();	                
            formularSeguimiento(_idseg,event);
            
        }
    });    
}

function borrarSeguimiento(){
	
	if(!confirm('¿Borramos este seguimiento?.. ¿Segure?')){return;}
	
	_parametros = {
        'panid': _PanId,
        'idseg':document.querySelector('form#seguimiento input[name="idseg"]').value,
    };
    document.querySelector('form#seguimiento').style.display='none';
    
    $.ajax({
        url:   './SEG/SEG_ed_borrar_seguimiento.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            consultarListado();
        }
    });    
}



function aCero(_sub){
	_sub.style.right='0';
	_sub.style.bottom='0';
}
	
function guardarAccion(_this,event){
	
	_form=document.querySelector('form#accion');
	_subs=_form.querySelectorAll('.archivo[subiendo="si"]');
	for(_sn in _subs){
		if(typeof(_subs[_sn])!='object'){continue;}
		_pos=_subs[_sn].getBoundingClientRect();console.log(_pos);		
		document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
		_subs[_sn].style.position='relative';
		_sr=($(window).width() - _pos.right )+'px'
		_subs[_sn].style.right =_sr;
		_sh=($(window).height() - _pos.bottom)+'px';
		_subs[_sn].style.bottom=_sh;
		console.log(_sr);console.log(_sh);		
		setTimeout(aCero, 1, _subs[_sn]);
	}
	
	_parametros = {
        'panid': _PanId,
        'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
        'idacc':document.querySelector('form#accion input[name="idacc"]').value,
        'id_p_usuarios_responsable':document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').value,
        'nombre':document.querySelector('form#accion input[name="nombre"]').value,
        'descripcion':document.querySelector('form#accion textarea[name="descripcion"]').value,
        
        'fechacreacion':document.querySelector('form#accion input[name="fechacreacion"]').value,
        'fechacreacion_tipo':document.querySelector('form#accion [name="fechacreacion_tipo"]').value,
        'fechacontrol':document.querySelector('form#accion input[name="fechacontrol"]').value,
        'fechacontrol_tipo':document.querySelector('form#accion [name="fechacontrol_tipo"]').value,
        'fechaejecucion':document.querySelector('form#accion input[name="fechaejecucion"]').value,
        'fechaejecucion_tipo':document.querySelector('form#accion [name="fechaejecucion_tipo"]').value

    };
   _form.style.display='none';
    
    $.ajax({
        url:   './SEG/SEG_ed_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}         
            
            
            consultarListado(); 
        }
    });    
}	

function crearAccion(_idseg){
	
	_parametros = {
        'panid': _PanId,
        'idseg':_IdSegEdit	        
	}
    $.ajax({
        url:   './SEG/SEG_ed_crear_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idacc = _res.data.nidacc;
            formularSeguimiento(_IdSegEdit,event);
            formularAccion(_idacc,event);
            consultarListado();
            
        }
    });    
}	

function borrarAccion(){
	
	if(!confirm('¿Borramos esta acción?.. ¿Segure?')){return;}
	
	_parametros = {
        'panid': _PanId,
        'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
        'idacc':document.querySelector('form#accion input[name="idacc"]').value,
    };
    document.querySelector('form#accion').style.display='none';
    
    $.ajax({
        url:   './SEG/SEG_ed_borrar_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            consultarListado();
        }
    });    
}

function suspenderAccion(){
	
	if(!confirm('Una acción suspendida será desestimada hasta que vuelva a ser activada ¿Continuamos?')){return;}
	
	_parametros = {
        'panid': _PanId,
        'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
        'idacc':document.querySelector('form#accion input[name="idacc"]').value,
    };
    document.querySelector('form#accion').style.display='none';
    
    $.ajax({
        url:   './SEG/SEG_ed_suspender_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            consultarListado();
        }
    });    	
}

function deSuspenderAccion(){
	
	_parametros = {
        'panid': _PanId,
        'id_p_tracking_id':document.querySelector('form#accion input[name="id_p_tracking_id"]').value,
        'idacc':document.querySelector('form#accion input[name="idacc"]').value,
    };
    document.querySelector('form#accion').style.display='none';
    
    $.ajax({
        url:   './SEG/SEG_ed_desuspender_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            consultarListado();
        }
    });    
}


var _listaditoSolG={
	"ga":'',
	"gb":''
};
	
function cargarVincularComs(){
	
	_parametros = {
        'panid': _PanId
    };
    
    $.ajax({
        url:   './COM/COM_consulta_listadito.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            procesarListaditoCom(_res);
            identificarEnListaditoPertenenciasAGrupos(_listaditoSolG.ga,_listaditoSolG.gb);
        }
    }); 
}




function procesarListaditoCom(_res){
    _cont=document.querySelector('form#accion #tipocom #listadoopcion #formLink');
    _cont.innerHTML='<span id="separador"></span>';
    document.querySelector('form#accion #tipocom #busca').focus();
    _separador=_cont.querySelector('#separador');
    for(_nc in _res.data.comunicacionesOrden){
		_idc=_res.data.comunicacionesOrden[_nc];
   		_cdat=_res.data.comunicaciones[_idc];
   		
        _mod=document.createElement('input');
        _mod.setAttribute('type','button');;
        _mod.setAttribute('onclick','crearLinkCom(this)');
        _mod.setAttribute('class','COMcomunicacion');
        _mod.setAttribute('emision','');
        _mod.setAttribute('title','');
        _mod.setAttribute('regid',_idc);
        _mod.setAttribute('gaid',_cdat.idga);
        _mod.setAttribute('gbid',_cdat.idgb);
        _mod.setAttribute('sentido',_cdat.sentido);
        _mod.setAttribute('estado',_cdat.estado);
        _mod.setAttribute('pnom',_cdat.falsonombre);
        _mod.setAttribute('value',_cdat.etiqueta);
        
        if(
        	_cdat.idga==document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a"]').value
        	&&
        	_cdat.idgb==document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b"]').value
        ){
        	_cont.appendChild(_mod);	
        }else{
            _cont.insertBefore(_mod,_separador);  
        }			
    }
}
    
function identificarEnListaditoPertenenciasAGrupos(_ga,_gb){
	//console.log('filtrando listadito por ga:'+_ga+' gb:'+_gb);
	_elems=document.querySelectorAll('form.respuestar > .COMcomunicacion');
    for(_ne in _elems){
    	if(typeof _elems[_ne] != 'object'){continue;}
    	if(_elems[_ne].getAttribute('gaid')==_ga){
    		_elems[_ne].setAttribute('ga','si');
    	}else{
    		_elems[_ne].setAttribute('ga','no');
    	}
    	
    	if(_elems[_ne].getAttribute('gbid')==_gb){
    		_elems[_ne].setAttribute('gb','si');
    	}else{
    		_elems[_ne].setAttribute('gb','no');
    	}	
    }
}

function crearLinkCom(_this){
	_parametros = {
        'panid': _PanId,
        'idcom': _this.getAttribute('regid'),
        'idacc': document.querySelector('form#accion input[name="idacc"]').value,
    };
    
    $.ajax({
        url:   './SEG/SEG_linkear_acc_COMcomunicaciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularAccionVinculosCom(document.querySelector('form#accion input[name="idacc"]').value,'');
        }
    });  
}

function borrarLinkCom(_this){
	_parametros = {
        'panid': _PanId,
        'idcom': _this.getAttribute('regid'),
        'idacc': document.querySelector('form#accion input[name="idacc"]').value,
    };
    
    $.ajax({
        url:   './SEG/SEG_delinkear_acc_COMcomunicaciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            
            formularAccionVinculosCom(document.querySelector('form#accion input[name="idacc"]').value,'');
        }
    }); 
}


function cargarVincularCnts(){	
	_parametros = {
        'panid': _PanId
    };
    
    $.ajax({
        url:   './CNT/CNT_consulta.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            procesarListaditoCnt(_res);
            //identificarEnListaditoPertenenciasAGrupos(_listaditoSolG.ga,_listaditoSolG.gb);
        }
    }); 
}


function procesarListaditoCnt(_res){
    _cont=document.querySelector('form#accion #tipocnt #listadoopcion #formLink');
    _cont.innerHTML='<span id="separador"></span>';
    document.querySelector('form#accion #tipocnt #busca').focus();
    _separador=_cont.querySelector('#separador');
   
    for(_nc in _res.data.contrataciones){
		_cdat=_res.data.contrataciones[_nc];
        _mod=document.createElement('input');
        _mod.setAttribute('type','button');;
        _mod.setAttribute('onclick','crearLinkCnt(this)');
        _mod.setAttribute('class','CNTcomunicacion');
        _mod.setAttribute('emision','');
        _mod.setAttribute('title','');
        _mod.setAttribute('regid',_cdat.id);
        _mod.setAttribute('gaid',_cdat.id_p_grupos_tipo_a);
        _mod.setAttribute('gbid',_cdat.id_p_grupos_tipo_b);
        _mod.setAttribute('estado',_cdat.fechacierre_tipo);
        _mod.setAttribute('pnom',_cdat.nombre);
        
        if(_res.data.proveedores[_cdat.id_p_CNTproveedores]==undefined){
        	_prov='';	
        }else{
        	_prov=_res.data.proveedores[_cdat.id_p_CNTproveedores].nombre;
        }
        _mod.setAttribute('value',_cdat.nombre+' - '+_prov);
        
        if(
        	_cdat.id_p_grupos_tipo_a==document.querySelector('form#seguimiento [name="id_p_grupos_tipo_a"]').value
        	&&
        	_cdat.id_p_grupos_tipo_b==document.querySelector('form#seguimiento [name="id_p_grupos_tipo_b"]').value
        ){
        	_cont.appendChild(_mod);	
        }else{
            _cont.insertBefore(_mod,_separador);  
        }		
    }
}

function crearLinkCnt(_this){
	_parametros = {
        'panid': _PanId,
        'idcnt': _this.getAttribute('regid'),
        'idacc': document.querySelector('form#accion input[name="idacc"]').value
    };
    
    $.ajax({
        url:   './SEG/SEG_linkear_acc_CNTcontrataciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularAccionVinculosCnt(document.querySelector('form#accion input[name="idacc"]').value,'');
        }
    });  
}


function borrarLinkCnt(_this){
	_parametros = {
        'panid': _PanId,
        'idcnt': _this.getAttribute('regid'),
        'idacc': document.querySelector('form#accion input[name="idacc"]').value,
    };
    
    $.ajax({
        url:   './SEG/SEG_delinkear_acc_CNTcontrataciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularAccionVinculosCnt(document.querySelector('form#accion input[name="idacc"]').value,'');         
        }
    }); 
}

function crearContratacionLinkeada(){
	_parametros = {
        'panid': _PanId,
        'idacc': document.querySelector('form#accion input[name="idacc"]').value
    };
    
    $.ajax({
        url:   './CNT/CNT_crear_contratacion_desde_SEGaccion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularAccionVinculosCnt(document.querySelector('form#accion input[name="idacc"]').value,'');
            
        }
    });  
}
