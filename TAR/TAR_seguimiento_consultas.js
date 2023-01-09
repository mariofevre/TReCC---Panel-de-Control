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


function consultaConfig(){
	_parametros = {
        'panid': _PanelI
    };
    $.ajax({
        url:   './PAN/PAN_consulta_config.php',
        data: _parametros,        
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
			
		_Config=_res.data.config;
					
		_margen_temporal_visible=Math.max(5,_Config['tar-periodo']);			
		_margen_temporal_control = _Config['tar-diascontrol'];
		_anchodia=_anchogantt/2/_margen_temporal_visible;
		_barrido=_anchogantt/_anchodia;	
		_diaInicio_rel = Math.round((-1)*_barrido/2);
		_offset=((-1*_barrido/2)-_diaInicio_rel)*_anchodia;
		_diaFin_rel = Math.round(_barrido/2);
	
		consultarGrupos();
		consultarUsuarios();
		consultarPlanes();
		
    })
}



function consultarUsuarios(){
	_parametros = {
    'zz_AUTOPANEL': _PanId
    };
    $.ajax({
        url:   './PAN/PAN_usuarios_consulta.php',
        data: _parametros,
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
	  
		_DatosUsuarios=_res.data.usuarios;   		
		if(
			_Grupos[0]!=undefined
			&&
			Object.keys(_DataPlanes).length>=0
			){
			//consultarListado(); 
		}
   });
}
        
        
function consultarGrupos(){
    _parametros = {
		'PanelI': _PanelI
    };			
    $.ajax({
        data:  _parametros,
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
		//procesarRespuestaDescripcion(response, _destino);
		
		for(_nm in _res.mg){alert(_res.mg[_nm]);}
		for(_na in _res.acc){
			if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
		}                
		
		if(_res.res=='exito'){
					
			_Grupos=_res.data.grupos;
			
			if(
				_DatosUsuarios.delPanel!=undefined
				&&
				Object.keys(_DataPlanes).length>=0
				){
				//consultarListado(); 
			}
		}        
    });
}

function consultarPlanes(){
    var _parametros = {
		'PanelI': _PanelI
    };			
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_consulta_planes.php',
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}
		
		//console.log(_res);
		
		for(_nm in _res.mg){alert(_res.mg[_nm]);}
		for(_na in _res.acc){
			if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
		}                
		
		if(_res.res=='exito'){
					
			_DataPlanes=_res.data.planes;
			_DataPlanesOrden=_res.data.planesOrden;
			listarPlanes();
			
			if(
				_DatosUsuarios.delPanel!=undefined
				&&
				_Grupos[0]!=undefined
				){
				//consultarListado(); 
			}
		}
   
    });
}


function crearPlanVacio(){
	_parametros = {
		'PanelI': _PanelI
    };    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_crear_plan.php',
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
		consultarPlanes();		
	});        
}


function borrarPlan(_idplan){
	
	_parametros = {
		'idplan':_idplan,
		'PanelI': _PanelI
    };
    
    if(!confirm('¿Eliminamos de forma definitiva este plan?... ¿Segure?')){return;}
    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_borra_plan.php',
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
            
            if(_res.res!='exito'){return;}
            
            delete _DataPlanes[_res.data.idplan];
            
            for(_n in _DataPlanesOrden){
				if(_DataPlanesOrden[_n]==_res.data.idplan){
					 delete _DataPlanesOrden[_n];
				}
			}
			
			_li=document.querySelector('#listaplanes #listado > [idplan="'+_res.data.idplan+'"]');
			_li.parentNode.removeChild(_li);
			
			_lis=document.querySelectorAll('#listaplanes #listado > a');
			for(_ln in _lis){
				if(_lis[_ln] != 'object'){continue;}
				_idprimero=_lis[_ln].getAttribute('idplan');
				break;
			}
			cargarPlan(_idprimero);
        }
    });
}


function subirTodo1Nivel(){
	_parametros = {
		'idplan':_idplan
    };			

	cerrarForm('formPlan');
	
	$.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_sube_nivel_todas_tarea.php',
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
            
            if(_res.res!='exito'){return;}

			
			
			consultarPlanes();
        }
    });
	
}



function guardarEdicionPlan(){
	
	_parametros = {
		'PanelI': _PanelI,
		'idplan': document.querySelector('#formPlan [name="idplan"]').value,
		'nombre': document.querySelector('#formPlan [name="nombre"]').value,
		'descripcion': document.querySelector('#formPlan [name="descripcion"]').value,
		'zz_superado': document.querySelector('#formPlan [name="zz_superado"]').value
    };    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_guarda_plan.php',
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
		
		cargarPlan(_res.data.idplan);	
	});        
}




function cargarPlan(_idplan){
	_parametros = {
		'idplan':_idplan,
		'iditcpt':_IdItCPT
    };			
    _IdPlanActivo=0;
    
    _sels=document.querySelectorAll('#listaplanes #listado > a[activo="si"]');
	for(_sn in _sels){
		if(typeof _sels[_sn] != 'object'){continue;}
		_sels[_sn].setAttribute('activo','no');
	}
		
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_consulta_plan.php',
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
            	_IdPlanActivo=_res.data.idplan;
            	document.querySelector('#listaplanes #listado > a[idplan="'+_IdPlanActivo+'"]').setAttribute('activo','si');
            	document.querySelector('#menuflotante #planactivo').innerHTML=_res.data.plan.nombre;
            	document.querySelector('#menuflotante #planactivo').title=_res.data.plan.descripcion;
            	
            	document.querySelector('#menuflotante #listado [idplan="'+_res.data.plan.id+'"]').innerHTML=_res.data.plan.nombre;
            	document.querySelector('#menuflotante #listado [idplan="'+_res.data.plan.id+'"]').title=_res.data.plan.descripcion;
            	
                _DataPlanes[_res.data.idplan]['tareas']=_res.data.tareas;
                _DataPlanes[_res.data.idplan]['tareasOrden']=_res.data.tareasOrden;
                
                //console.log('a listar');
                listarTareasPlan(_res.data.idplan);
                
                document.querySelector('.botonerainicial').setAttribute('planselecto',_IdPlanActivo);
            }
        }
    });
}




function consultarTarea(_idtarea,_accion,_idobserv){
	_parametros = {
		'idobserv':_idobserv,
		'idtarea':_idtarea,
		'idplan':_IdPlanActivo,
		'accion':_accion
    };			
    
    _obsb=document.querySelectorAll('#gantt #listado .observacion');
    for(_no in _obsb){
		if(typeof _obsb[_no]!='object'){continue;}
		_obsb[_no].removeAttribute('activa');
		
		if(_obsb[_no].getAttribute('preliminar')=='1'){
			_idtvieja=_obsb[_no].parentNode.getAttribute('idtarea');
			_obsb[_no].parentNode.removeChild(_obsb[_no]);			
			canvasTarea(_idtvieja);
		}
	}
	
	_tart=document.querySelectorAll('#gantt #listado .tarea');
    for(_nt in _tart){
		if(typeof _tart[_nt]!='object'){continue;}
		_tart[_nt].removeAttribute('activa');
	}
		
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_consulta_tarea.php',
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
                _DataPlanes[_res.data.tarea.id_p_TARplanes]['tareas'][_res.data.tarea.id]=_res.data.tarea;
                redibujarTarea(_idtarea);
                formularTarea(_res.data.tarea.id);
                
                
                if(_res.data.idobserv!=''){                	
                	formularObserv(_res.data.tarea.id,_res.data.idobserv);	
                }else{
					_desp_render_dias=0;					
					marcarDiasCalendario();
					_obs=_DataPlanes[_IdPlanActivo].tareas[_res.data.tarea.id].observacionesOrden;
					
					for(_on in _obs){
						_ido=_obs[_on]
						//console.log(_obs[_on]);
						_odat=_DataPlanes[_IdPlanActivo].tareas[_res.data.tarea.id].observaciones[_ido];
						if(_odat.fecha_diashoy==0){
							//ya hay una observación para hoy.
							//console.log('consultando');
							//console.log(_res.data.tarea.id,"formular",_odat.id);
							consultarTarea(_res.data.tarea.id,"formular",_odat.id);
							return;
						}
					}
					
					
					if(_UsuAcc=='auditor'){return;}
					if(_UsuAcc=='visitante'){return;}
					
					generarObservPreliminar(_res.data.tarea.id);
					
				}
            }
        }
    });
}


function crearTareaVacia(){
	_parametros = {
		'PanelI': _PanelI,
		'idplan':_IdPlanActivo,
    };    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_crear_plan.php',
        type:  'post'
	})
	.fail(function (_jqXHR, _textStatus, _errorThrown){
		_res = PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR);
		console.log(_res);
	})
	.done(function (_data,  _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}		
		consultarPlanes();		
	});        
}



function generarObservPreliminar(_idtarea){
	_parametros = {
		'idtarea':_idtarea,
		'idplan':_IdPlanActivo
    };		
    
    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_crear_observacion.php',
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
				document.querySelector('#formObservacion [name="id"]').value=_res.data.nidobs;
				consultarObserv(_res.data.nidobs,'actualizagantt');			
				_offset=0;
				_txs=document.querySelectorAll('#gantt #listado .tarea #flotantetexto');
				for(_n in _txs){
					if(typeof _txs[_n] != 'object'){continue;}
					_txs[_n].style.left=(-1*parseInt(_offset))+'px';		
				}
				document.querySelector('#gantt #listado').style.left=(-1*parseInt(_offset))+'px';
            }
        }
    });	
}


function microguardarTarea(_this){
	_campo=_this.getAttribute('name');
	_valor=_this.value;
	_parametros = {
		'idtarea':document.querySelector('#formTarea [name="id"]').value,
		'idplan':_IdPlanActivo,
		'campo':_campo,
		'valor':_valor
	};			
		
	document.querySelector('#formTarea [name="'+_campo+'"]').setAttribute('cambiando','si');
	
	$.ajax({
		data:  _parametros,
		url:   './TAR/TAR_ed_guarda_tarea_campo.php',
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
				document.querySelector('#formTarea [name="'+_res.data.campo+'"]').setAttribute('cambiando','listo');
				consultarTarea(_res.data.idtarea,'',document.querySelector('#formObservacion [name="id"]').value);
				
			}
		}
	});		
}


function moverTareaAqui(_idtarea,_marcadorDestino){	
	
	
	
	_listado=document.querySelector('#formMoverTareas #listamovertareas');		
	
	if(_idtarea!='seleccionvisual'){	
	
		_selectas=Array(_listado.querySelector('p[idt="'+_idtarea+'"]'));		
		
	}else{		
		_selectas=_listado.querySelectorAll('.tarealistada[selecta="si"]');	
	}
	
	
	_dest=_marcadorDestino;
	
	for(_sm in _selectas){
		if(typeof(_selectas[_sm])!='object'){continue;}		
		_mov=_selectas[_sm];	
		console.log(_mov);
		_dest.parentNode.insertBefore(_mov,_dest.nextSibling);	
		_dest=_mov;
	}
	
	_tls=_listado.querySelectorAll('.tarealistada');
	
	_nuevoord=0;
	_arrpost=Array();
	for(_n in _tls){
		if(typeof _tls[_n] != 'object'){continue;}
		_nuevoord++;
		_idt=_tls[_n].getAttribute('idt');
		_arrpost.push({
			'idt':_idt,
			'ord':_nuevoord
		});
		
	}
	
	_parametros = {
		'idtarea':_idtarea,
		'idplan':_IdPlanActivo,
        'panid': _PanId	,
        'orden': _arrpost
	};		
	
	$.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_reordenar_tareas.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
			
			PreprocesarRespuesta(response);
            
            var _res = $.parseJSON(response);
            console.log(_res);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            
            if(_res.res=='exito'){
				_DataPlanes[_res.data.idplan].tareasOrden=_res.data.tareasOrden;
				ordenarTareas();	
            }
        }
    });	
}
			
function borrarTarea(_idtarea){
	
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
	if(!confirm("¿Eliminamos esta tarea?... ¿Segure?")){return;}
	
	
	_parametros = {
		'idtarea':_idtarea,
		'idplan':_IdPlanActivo,
        'panid': _PanId	  
	};		
	
	$.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_borra_tarea.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
			
			PreprocesarRespuesta(response);
            
            var _res = $.parseJSON(response);
            //console.log(_res);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            
            if(_res.res=='exito'){
				
				delete _DataPlanes[_res.data.idplan].tareas[_res.data.idtarea];
				cerrarForm("formTareaObservacion");
				_fila=document.querySelector('#gantt > #listado a.tarea[idtarea="'+_res.data.idtarea+'"]');
				_fila.parentNode.removeChild(_fila);
				for(_tn in _DataPlanes[_res.data.idplan].tareasOrden){
					if(_DataPlanes[_res.data.idplan].tareasOrden[_tn]==_idtarea){
						delete _DataPlanes[_res.data.idplan].tareasOrden[_tn];
						break;
					}
				}								
            }
        }
    });
	
}
	
	
function microguardar(_this){
	
	_campo=_this.getAttribute('name');
	_valor=_this.value;
	_parametros = {
		'idtarea':document.querySelector('#formTarea [name="id"]').value,
		'idobserv':document.querySelector('#formObservacion [name="id"]').value,
		'idplan':_IdPlanActivo,
		'campo':_campo,
		'valor':_valor
    };			
    	
    document.querySelector('#formObservacion [name="'+_campo+'"]').setAttribute('cambiando','si');
    
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_guarda_observ_campo.php',
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
				
				document.querySelector('#formObservacion [name="'+_res.data.campo+'"]').setAttribute('cambiando','listo');
				
				consultarObserv(_res.data.idobserv,'actualizagantt');

            }
        }
    });	
	
}

function redefinirPadresPlan(){
	_parametros = {
		'idplan':document.querySelector('#formPlan [name="idplan"]').value,
    };			

    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_procesa_redefine_padres.php',
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
								
				cargarPlan(_res.data.idplan)

            }
        }
    });	
}




function borrarObervacion(){
	if(!confirm('¿Eliminamos esta obseración de la tarea?... ¿Segure?')){return;};
	_parametros = {
		'idtarea':document.querySelector('#formTarea [name="id"]').value,
		'idobserv':document.querySelector('#formObservacion [name="id"]').value,
		'idplan':_IdPlanActivo
    };			
    	
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_ed_borra_observacion.php',
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
				
				cerrarForm('formTareaObservacion');
				_od=document.querySelector('#gantt #listado .observacion[idobserv="'+_res.data.idobserv+'"]');
				_od.parentNode.removeChild(_od);
				delete _DataPlanes[_IdPlanActivo]['tareas'][_res.data.idtarea]['observaciones'][_res.data.idobserv];
				
				
				canvasTarea(_res.data.idtarea);
				
            }
        }
    });	
}

function consultaLocalesDisponibles(){
	_parametros = {
		'idplan':_IdPlanActivo
    };			
    	
    $.ajax({
        data:  _parametros,
        url:   './REL/REL_consulta_relevamientos_locales.php',
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
				_DataRelLocales=_res.data;			
				formularSelectorLocal('','');
            }
        }
    });			
}




function consultarObserv(_idbserv,_accion){
	
	_parametros = {
		'idobserv':document.querySelector('#formObservacion [name="id"]').value,
		'idtarea':document.querySelector('#formTarea [name="id"]').value,
		'idplan':_IdPlanActivo,
		'accion':_accion
    };			
    	
    $.ajax({
        data:  _parametros,
        url:   './TAR/TAR_consulta_observacion.php',
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
				console.log(_IdPlanActivo+' ' +_res.data.observacion.id_p_TARtareas+' '+_res.data.idobserv);
				_DataPlanes[_IdPlanActivo]['tareas'][_res.data.observacion.id_p_TARtareas]['observaciones'][_res.data.idobserv]=_res.data.observacion;
				
				muestraObservacion(_IdPlanActivo,_res.data.observacion.id_p_TARtareas,_res.data.idobserv,'si');
				canvasTarea(_res.data.observacion.id_p_TARtareas);
				
				actualizarFormObserv();
								
            }
        }
    });	
	
}
	

function drag_over(_event,_this){
				
	_event.preventDefault();
	
	_ini = _event.dataTransfer.getData("text/plain").split(',');
	if(_ini[0]==''){
		//sin datos tal vez un archivo, se asume que debe ser suspendida esta aación
		_this.setAttribute('estadodrag','archivo');
		return;
	}
	
	return false; 
}

function drag_out(_event,_this){

	_event.preventDefault();			
	_this.setAttribute('estadodrag','');
	
}

function dropHandler(ev) {
	  console.log('File(s) dropped');
	  ev.preventDefault();
	  document.querySelector('#formadjuntarmpp #carga span.upload').setAttribute('estadodrag','terminado');
	  // Prevent default behavior (Prevent file from being opened)
	  ev.preventDefault();
	  if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
		  // If dropped items aren't files, reject them
		  if (ev.dataTransfer.items[i].kind === 'file') {		      	
			_nFile++;
			var file = ev.dataTransfer.items[i].getAsFile();
			console.log('... file[' + i + '].name = ' + file.name);
			//crearCuadroCarga(file,_NFile);
			subirDocumento(file,_nFile);
		  }
		}
	  } else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			_nFile++;
			console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
			//crearCuadroCarga(ev.dataTransfer.files[i],_NFile);
			subirDocumento(ev.dataTransfer.file[i],_nFile);
		}
	  } 
	  // Pass event to removeDragData for cleanup
	  removeDragData(ev);
}
	
function crearCuadroCarga(_filedata,_nfile){
	/*
	_cuadro=document.querySelector('#cuadrocarga.modelo').cloneNode(true);
	document.querySelector('#columnaCarga').appendChild(_cuadro);
	_cuadro.removeAttribute('class');
	_cuadro.setAttribute('nfile',_nfile);
	console.log(_filedata);
	_cuadro.querySelector('#nombre').innerHTML=_filedata.name;
	_cuadro.querySelector('[name="nombre"]').value=_filedata.name;
	_cuadro.querySelector('#avance #numero').innerHTML='0 %';
	_cuadro.querySelector('#avance #barra').style.width='0%';*/
}

		
function removeDragData(ev) {
  console.log('Removing drag data');	
  if (ev.dataTransfer.items) {
	// Use DataTransferItemList interface to remove the drag data
	ev.dataTransfer.items.clear();
  } else {
	// Use DataTransfer interface to remove the drag data
	ev.dataTransfer.clearData();
  }
}

function subirDocumento(_filedata,_nfile){
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }      
    
    
	var parametros = new FormData();
	parametros.append('upload',_filedata);
	parametros.append('nfile',_nfile);
	parametros.append('criterio','consulta');
	parametros.append('idsel',document.querySelector('#formadjuntarmpp [name="idsel"]').value);

	var _nombre=_filedata.name;
	
	//_upF=document.querySelector('#columnaCarga [nfile="'+_nfile+'"]');
	_upF=document.createElement('a');
	document.querySelector('#listadosubiendo').appendChild(_upF);
	_upF.setAttribute('nf',_nFile);
	_upF.setAttribute('class',"archivo");
	_upF.setAttribute('size',Math.round(_filedata.size/1000));
	_upF.innerHTML=_filedata.name;
	_im=document.createElement('img');
	_im.setAttribute('class','cargando');
	_im.setAttribute('src','./img/cargando.gif');
	_upF.appendChild(_im);
		
		
		
	_nn=_nfile;
	xhr[_nn] = new XMLHttpRequest();
	xhr[_nn].open('POST', './TAR/TAR_ed_procesa_adjunto_mpp_xml_import.php', true);
	xhr[_nn].upload.li=_upF;
	xhr[_nn].upload.addEventListener("progress", updateProgressMPP, false);

	xhr[_nn].onreadystatechange = function(evt){
		//console.log(evt);

		if(evt.explicitOriginalTarget.readyState==4){
			var _res = $.parseJSON(evt.explicitOriginalTarget.response);
			//console.log(_res);

			if(_res.res=='exito'){				
							
				_file=document.querySelector('#listadosubiendo .archivo[nf="'+_res.data.nf+'"]');
				
				_file.setAttribute('estado','terminado');
				_file.setAttribute('idfi',_res.data.nid);
				
				consultarPlanes();
									
			} else {
				_file=document.querySelector('#listadosubiendo .archivo > [nf="'+_res.data.nf+'"]');
				_file.innerHTML+=' ERROR';
				_file.style.color='red';
			}
		}
	};
	xhr[_nn].send(parametros);

}	

				
function subirDocumentoMPP(_this){
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
  	// Get the selected files from the input.  
	var files = _this.files;		
	
    for (i = 0; i < files.length; i++) {    
        
        _nFile++;        
        console.log(files[i]);
        
       
        var parametros = new FormData();        
		parametros.append('upload',files[i]);
        parametros.append('nfile',_nFile);
        parametros.append('idsel',document.querySelector('#formadjuntarmpp [name="idsel"]').value);
        
        var _nombre=files[i].name;

        _nn=_nFile;        
        xhr[_nn] = new XMLHttpRequest();
        xhr[_nn].open('POST', './TAR/TAR_ed_procesa_adjunto_mpp_xml_import.php', true);
        xhr[_nn].upload.li=_upF;
        xhr[_nn].upload.addEventListener("progress", updateProgressMPP, false);
        
        _upF=document.createElement('a');
        _upF.setAttribute('nf',_nFile);
        _upF.setAttribute('class',"archivo");
        _upF.setAttribute('size',Math.round(files[i].size/1000));
        _upF.innerHTML=files[i].name;
        _im=document.createElement('img');
        _im.setAttribute('class','cargando');
        _im.setAttribute('src','./img/cargando.gif');
        _upF.appendChild(_im);
        document.querySelector('#listadosubiendo').appendChild(_upF);
                 
        xhr[_nn].onreadystatechange = function(evt){
            //console.log(evt);
            
            if(evt.explicitOriginalTarget.readyState==4){				
                var _res = $.parseJSON(evt.explicitOriginalTarget.response);
                //console.log(_res);
                
                if(_res.res=='exito'){	
											
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');	
                    _file.parentNode.removeChild(_file);
                    consultarPlanes();
                    
                }else{
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
                    _im=_file.querySelector('img.cargando');
                    _im.parentNode.removeChild(_im);
                    
                    _file.innerHTML+=' ERROR';
                    _file.style.color='red';
                    for(_nm in _res.mg){_file.innerHTML+='<br>'+_res.mg[_nm];}
                }
                //cargaTodo();
                //limpiarcargando(_nombre);            
            }
        }
        xhr[_nn].send(parametros);		
    }
}	

function updateProgressMPP(evt) {
	if (evt.lengthComputable) {
		var percentComplete = 100 * evt.loaded / evt.total;		   
		this.li.style.width="calc("+Math.round(percentComplete)+"% - ("+Math.round(percentComplete)/100+" * 6px))";
	} else {
		// Unable to compute progress information since the total size is unknown
	} 
}



function formularValidacionDatosMPP(){
	
	
		
}
	    
	
