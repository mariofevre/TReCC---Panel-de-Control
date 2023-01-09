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

function mostrarListado(_res){
	
	document.querySelector('#contenidoextenso #seguimientos').innerHTML='';
    for(_ns in _res.data.seguimientosOrden_prioridad){
        _idseg=_res.data.seguimientosOrden_prioridad[_ns];
        _dat=_res.data.seguimientos[_idseg];
    
        _fila=document.createElement('div');
        _fila.setAttribute('class','fila seguimiento');
        _fila.setAttribute('filtroB','ver');
        _fila.setAttribute('onclick','formularSeguimiento("'+_idseg+'",event)');
        _fila.setAttribute('idresp',_dat.id_p_usuarios_responsable);
        
        _fila.title=_dat.estado;
        _fila.setAttribute('prioridad',_dat.prioridad);
        document.querySelector('#contenidoextenso #seguimientos').appendChild(_fila);
        
        	                    
        _ddd=document.createElement('div');
        _ddd.setAttribute('class','contenido idseg');
        _ddd.innerHTML=_dat.id;
        _fila.appendChild(_ddd);
        
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_grupos_tipo_a');
        
        if(_DatosGrupos[_dat.id_p_grupos_tipo_a]==undefined){
        	_DatosGrupos[_dat.id_p_grupos_tipo_a]={
        		'codigo':'err',
        		'nombre':'error, no encontrado'
        	}
        }
        
        if(_DatosGrupos[_dat.id_p_grupos_tipo_a].codigo!=''){
        	_ddd.innerHTML=_DatosGrupos[_dat.id_p_grupos_tipo_a].codigo;	
        	_ddd.title=_DatosGrupos[_dat.id_p_grupos_tipo_a].nombre;
        }else{
        	_ddd.innerHTML=_DatosGrupos[_dat.id_p_grupos_tipo_a].nombre;
        }	                    
        _fila.appendChild(_ddd);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_grupos_tipo_b');
        
        if(_DatosGrupos[_dat.id_p_grupos_tipo_b]==undefined){
        	_DatosGrupos[_dat.id_p_grupos_tipo_b]={
        		'codigo':'err',
        		'nombre':'error, no encontrado'
        	}
        }
        
        if(_DatosGrupos[_dat.id_p_grupos_tipo_b].codigo!=''){
        	_ddd.innerHTML=_DatosGrupos[_dat.id_p_grupos_tipo_b].codigo;	
        	_ddd.title=_DatosGrupos[_dat.id_p_grupos_tipo_b].nombre;
        }else{
        	_ddd.innerHTML=_DatosGrupos[_dat.id_p_grupos_tipo_b].nombre;
        }	                    
        _fila.appendChild(_ddd);
        
        _aaa =document.createElement('a');
        _aaa.setAttribute('idseg',_idseg);
        _aaa.setAttribute('class','contenido nombre');
        _aaa.title=_dat.nombre;
        _aaa.innerHTML=_dat.nombre;
        _fila.appendChild(_aaa);
    
        _aaa =document.createElement('a');
        _aaa.setAttribute('idseg',_idseg);
        _aaa.setAttribute('class','contenido descrip');
        _aaa.title=_dat.info;
        _aaa.innerHTML=_dat.info;
        _fila.appendChild(_aaa);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido tipo');
        _ddd.innerHTML=_dat.tipo;
        _fila.appendChild(_ddd);

        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido alta');
        if(_dat.fecha=='0000-00-00'){
        	_ddd.innerHTML='sin/dat';
        }else{
            _e=_dat.fecha.split('-');
            _ddd.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
        }
        _fila.appendChild(_ddd);

        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido baja');
        if(_dat.fechacierre=='0000-00-00'){
        	_ddd.innerHTML='sin/dat';
        }else{
            _e=_dat.fechacierre.split('-');
            _ddd.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
        }
        _fila.appendChild(_ddd);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_B_usuarios_usuarios_id_nombre_autor');
        if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_autor] == undefined){
        	_ddd.innerHTML='-';
        }else{	
        	_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_autor].nombreusu;
        }
        if(_dat.id_p_usuarios_autor==_UsuId){
        	_ddd.setAttribute('responsabilidad','propio');
        }
        _fila.appendChild(_ddd);
        
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_B_usuarios_usuarios_id_nombre_responsable');
        if(_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable] == undefined){
        	_ddd.innerHTML='-';
        }else{
        	_ddd.innerHTML=_DatosUsuarios.delPanel[_dat.id_p_usuarios_responsable].nombreusu;
        }
        
        if(_dat.id_p_usuarios_responsable==_UsuId){
        	_ddd.setAttribute('responsabilidad','propio');
        }
        _fila.appendChild(_ddd);

        _tareas =document.createElement('div');
        _tareas.setAttribute('class','contenido tareas');
        _fila.appendChild(_tareas);
        
        _dddt =document.createElement('div');
        _tareas.appendChild(_dddt);
    
    
        for(_na in _dat.accionesOrden_prioridad){
        	
            _idacc=_dat.accionesOrden_prioridad[_na];
            _datacc=_dat.acciones[_idacc];
           
            _ddf=document.createElement('div');
            _ddf.setAttribute('class','filaitem');
            _dddt.appendChild(_ddf);
            
            _aaa =document.createElement('a');
            _aaa.setAttribute('idacc',_idacc);                            
            _aaa.setAttribute('estado',_datacc.estado);
            _aaa.setAttribute('idresp',_datacc.id_p_usuarios_responsable);
            _aaa.setAttribute('prioridad',_datacc.prioridad);
            _aaa.setAttribute('onclick','formularSeguimiento("'+_idseg+'",event),formularAccion("'+_idacc+'",event)');
            _aaa.setAttribute('class','accion '+_datacc.estado);
            _aaa.title=_datacc.descripcion;
            
            _dddt.appendChild(_aaa);
            
            _spa=_ddf=document.createElement('span');
            _spa.setAttribute('class','responsable');
            _spa.innerHTML=_datacc.nombre.substring(0,2);	
            
            if(_DatosUsuarios.delPanel[_datacc.id_p_usuarios_responsable] == undefined){
            	_spa.innerHTML='-';
            }else{
            	_spa.innerHTML=_DatosUsuarios.delPanel[_datacc.id_p_usuarios_responsable].nombreusu.substring(0,2);
            }
            if(_datacc.id_p_usuarios_responsable==_UsuId){
            	_spa.setAttribute('responsabilidad','propio');
            }
            
            _aaa.appendChild(_spa);
        	
        	_spa=_ddf=document.createElement('span');
            _spa.setAttribute('class','nombre');
            _spa.innerHTML=_datacc.nombre;
            _aaa.appendChild(_spa);
        	
            _spa=_ddf=document.createElement('span');
            _spa.setAttribute('class','fecha');
            if(_datacc.fecha_proxima=='0000-00-00'){
        		_spa.innerHTML='sin/dat';
            }else{
            	_e=_datacc.fecha_proxima.split('-');
            	_h = _Hoy.split('-');
                if(_e[0]==_h[0]){  
                    _spa.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1]);
            	}else{
                    _spa.innerHTML=_e[0];
                }
            }
            _aaa.appendChild(_spa);
        	
        }
        
        _aaa =document.createElement('a');
        _aaa.setAttribute('idacc',''); 
        _aaa.setAttribute('class','falsaaccion');
        _aaa.setAttribute('onclick','crearAccion("'+_idseg+'",event)');
        _aaa.innerHTML= 'agregar accion';
        
        _dddt.appendChild(_aaa);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido proxima_fecha');
        
        	                    
        if(_dat.zz_cache_primera_fechau>0){
        	_diasfaltan = (_dat.zz_cache_primera_fechau-_Hoy_unix) / 60 / 60 / 24;
        	_ddd.setAttribute('diasfaltan',Math.round(_diasfaltan));
        	if(_diasfaltan < 8 ){
        		_falta=Math.round(_diasfaltan)+' días';
        	}else if(_diasfaltan < 30 ){
        		_falta=Math.round(_diasfaltan/7)+' sem.';
        	}else{
        		_falta=Math.round(_diasfaltan/30)+' mes';
        	}
        	_ddd.innerHTML=_falta;	
        	
            _alerta_max=3;	                    
            _alerta_min=8;	                    
            if(_diasfaltan<=_alerta_max){
            	_alerta_porc=1;
            }else if(_diasfaltan>=_alerta_min){
            	_alerta_porc=0;
            }else{
            	_alerta_porc=0.2+(_diasfaltan-_alerta_max)*0.8/(8-3);	
            }
            _ddd.style.backgroundColor='rgba(255,100,0,'+_alerta_porc+')';
            	
        }else{
        	_ddd.innerHTML='---';
        }
        _fila.appendChild(_ddd);
            
    }
    
    asignarFiltroUsuario(_Filtros.usuario);
    tecleaBusqueda('','');
}

function cerrarFormularioSeguimiento(){
	document.querySelector('form#seguimiento').setAttribute('estado','inactivo');
}

function mostrarFormularioSeguimiento(_res){
			
	_segid=_res.data.id;
            
    _dataseg=_res.data.seguimientos[_segid];
    _DataSeguimientos[_segid]=_dataseg;
    
    _form=document.querySelector('form#seguimiento');
    _form.setAttribute('estado','activo');
    _form.querySelector('input[name="idseg"]').value=_segid;
    	                
    for(_campo in _dataseg){                	
    	_inp=_form.querySelector('[name="'+_campo+'"]');
    	
    	if(_inp!=null){
    		if(
    			_inp.tagName=='INPUT'
    			||
    			_inp.tagName=='TEXTAREA'
    		){
    			_inp.value=_dataseg[_campo];
    		}else if(
    			_inp.tagName=='SELECT'
    		){
    			if(_inp.querySelector('option[value="'+_dataseg[_campo]+'"]')==null){continue;}
    			_inp.querySelector('option[value="'+_dataseg[_campo]+'"]').selected='selected';
    		}else if(
    			_inp.tagName=='SPAN'
    		){
    			_inp.innerHTML=_dataseg[_campo];
    		}
    	}
    }
    
    _form.querySelector('[name="id_p_grupos_tipo_a_n"]').value=_DatosGrupos[_dataseg.id_p_grupos_tipo_a].nombre;
    _form.querySelector('[name="id_p_grupos_tipo_b_n"]').value=_DatosGrupos[_dataseg.id_p_grupos_tipo_b].nombre;
    
    _botonmenos=document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #menos');
    opcionesMenos(_botonmenos);
    _botonmenos=document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #menos');
    opcionesMenos(_botonmenos);
    
    document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #enpanel').innerHTML='';
    document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"] #fueradepanel').innerHTML='';
    
    document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #enpanel').innerHTML='';
    document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"] #fueradepanel').innerHTML='';
    
    for(_ng in _DatosGrupos){   
    	 	
        if(_DatosGrupos[_ng].tipo=='a'){			            	
            _cont= document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_a"]');			                
        }else if(_DatosGrupos[_ng].tipo=='b'){
            _cont= document.querySelector('form#seguimiento div.opciones[for="id_p_grupos_tipo_b"]');
        }else{
        	continue;
        }
        
        if(_res.data.gruposdelpanel[_DatosGrupos[_ng].id]!=undefined){
        	_cont=_cont.querySelector('#enpanel');
        }else{
        	_cont=_cont.querySelector('#fueradepanel');
        }
        
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','opcionar(this)');
        _anc.setAttribute('idgrupo',_DatosGrupos[_ng].id);
        _anc.title=_DatosGrupos[_ng].codigo+" _ "+_DatosGrupos[_ng].descripcion;
        _anc.innerHTML= _DatosGrupos[_ng].nombre;
        _cont.appendChild(_anc);
    }
    
    
    _form.querySelector('span[name="estado"]').setAttribute('prioridad',_dataseg.prioridad);	                
    
    
    mostrarFormularioSeguimientoListaAcciones(_dataseg);
    
    if(_DatosUsuarios.delPanel[_dataseg.id_p_usuarios_autor]==undefined){
    	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML='-';	
    }else{
    	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML=_DatosUsuarios.delPanel[_dataseg.id_p_usuarios_autor].nombreusu;
    }
}


function mostrarFormularioSeguimientoListaAcciones(_dataseg){
	 _form=document.querySelector('form#seguimiento');
	 _form.querySelector('#acciones').innerHTML='';
	for(_an in _dataseg.acciones){
    	
    	_adat=_dataseg.acciones[_an];
    	_div=document.createElement('a');			
    	_div.title=_adat.descripcion;		
    	_div.setAttribute('idacc',_adat.id);
    	_div.setAttribute('class','accion');
    	     
    	_div.setAttribute('estado',_adat.estado);
    	_div.setAttribute('prioridad',_adat.prioridad);
    	_div.setAttribute('onclick','formularAccion("'+_adat.id+'",event)');
    	
    	_marco=document.createElement('div');
    	_marco.setAttribute('class','marco');
    	_div.appendChild(_marco);
    	
    	_spa=_ddf=document.createElement('span');
        _spa.setAttribute('class','responsable');
        _spa.innerHTML=_adat.nombre;	
        
        if(_DatosUsuarios.delPanel[_adat.id_p_usuarios_responsable] == undefined){
        	_spa.innerHTML='-';
        }else{
        	_spa.innerHTML=_DatosUsuarios.delPanel[_adat.id_p_usuarios_responsable].nombreusu;
        }
        if(_adat.id_p_usuarios_responsable==_UsuId){
        	_spa.setAttribute('responsabilidad','propio');
        }
        
        _div.appendChild(_spa);
        
    	
    	_spa=_ddf=document.createElement('span');
        _spa.setAttribute('class','nombre');
        _spa.innerHTML=_adat.nombre;	
        _div.appendChild(_spa);
        
        _spa=_ddf=document.createElement('div');
        _spa.setAttribute('class','historia');	
        _div.appendChild(_spa);
        
        _el=document.createElement('div');
        _el.setAttribute('id','desarrollo');
         _est=''
        if(_adat.fechaejecucion_unix<_Hoy_unix&&_adat.fechaejecucion>'0000-00-00'){
        	if(_adat.fechaejecucion_tipo=='efectiva'){
        		_est='cumplido';
        	}else{
        		_est='vencido';
        	}
        }
        _el.setAttribute('estado',_est);
        _duracSeg=_dataseg.fecha_max-_dataseg.fecha_min;
        _duracAcc=_adat.fecha_max - _adat.fecha_min;
        _ocupAcc=_duracAcc * 100 / _duracSeg;
        _duracPrev=_adat.fecha_min - _dataseg.fecha_min;
        _ocupPrev=_duracPrev * 100 / _duracSeg;
        _el.style.width= 'calc('+ _ocupAcc +'%)';
        _el.style.left= 'calc('+ _ocupPrev +'%)';
        _spa.appendChild(_el);
         
        _el=document.createElement('div');
        _el.setAttribute('id','inicio');                        
        _est=''
        if(_adat.fechacreacion_unix<_Hoy_unix){
        	if(_adat.fechacreacion_tipo=='efectiva'){
        		_est='cumplido';
        	}else{
        		_est='vencido';
        	}
        }
        _el.setAttribute('estado',_est);
        _duracPrev=_adat.fechacreacion_unix-_dataseg.fecha_min;
        _ocupPrev=_duracPrev * 100 / _duracSeg;
        _el.style.left= 'calc('+ _ocupPrev +'%)';
        _spa.appendChild(_el);
        
        _el=document.createElement('div');
        _el.setAttribute('id','fin');
        _est=''
        if(_adat.fechaejecucion_unix<_Hoy_unix){
        	if(_adat.fechaejecucion_tipo=='efectiva'){
        		_est='cumplido';
        	}else{
        		_est='vencido';
        	}
        }
        _el.setAttribute('estado',_est);
        _duracPrev=_adat.fechaejecucion_unix-_dataseg.fecha_min;
        _ocupPrev=_duracPrev * 100 / _duracSeg;
        _el.style.left= 'calc('+ _ocupPrev +'% - 5px)';
        _spa.appendChild(_el);
        
        
        _el=document.createElement('div');
        _el.setAttribute('id','control');
        _est=''
        if(_adat.fechacontrol_unix<_Hoy_unix){
        	if(_adat.fechacontrol_tipo=='efectiva'){
        		_est='cumplido';
        	}else{
        		_est='vencido';
        	}
        }
        _el.setAttribute('estado',_est);
        _duracPrev=_adat.fechacontrol_unix-_dataseg.fecha_min;
        _ocupPrev=_duracPrev * 100 / _duracSeg;
        _el.style.left= 'calc('+ _ocupPrev +'%)';
        _spa.appendChild(_el);
        
        _el=document.createElement('div');
        _el.setAttribute('id','hoy');
        _duracPrev=_Hoy_unix-_dataseg.fecha_min;
        _ocupPrev=_duracPrev * 100 / _duracSeg;
        _el.style.left= 'calc('+ _ocupPrev +'%)';
        _spa.appendChild(_el);
        
    	_form.querySelector('#acciones').appendChild(_div);
    }
}


function mostrarFormularioAccion(_res){
    	
    _accid=_res.data.idacc;
    _IdAccEdit=_accid;
    
    _sels=document.querySelectorAll('form#accion [abierto="1"]');
    for(_ns in _sels){
    	console.log('u');
    	console.log(_sels[_ns]);
    	if(typeof _sels[_ns] != 'object'){continue;}
    	
    	_sels[_ns].setAttribute('abierto','-1');
    }
    
    
    _sels=document.querySelectorAll('form#seguimiento #acciones [selecta="si"]');
    for(_ns in _sels){
    	if(typeof _sels[_ns] != 'object'){continue;}
    	_sels[_ns].removeAttribute('selecta');
    }
    	                
    _item=document.querySelector('form#seguimiento #acciones [idacc="'+_accid+'"]');
    if(_item!= undefined){_item.setAttribute('selecta','si')}
    
    _dataacc=_res.data.accion;
    
    if(_dataacc.zz_suspendida=='0'){
    	document.querySelector('form#accion .suspender').style.display='block';
    	document.querySelector('form#accion .desuspender').style.display='none';
    }else{
    	document.querySelector('form#accion .suspender').style.display='none';
    	document.querySelector('form#accion .desuspender').style.display='block';
    }
    
    _DataSeguimientos[_IdSegEdit]['acciones'][_accid]=_dataacc;
    

    
    _form=document.querySelector('form#accion');
    _form.style.display='block';
    _form.querySelector('input[name="idacc"]').value=_accid;
    
    
     _form.querySelector('#candidatos #listado').innerHTML='';
     for(_hatch in _AccionesFrecuentes){
     	_dat=_AccionesFrecuentes[_hatch];
     	if(_dat.cant>2){_peso='alto';}else{_peso='bajo';}
     	
     	_item=document.createElement('div');
     	_item.innerHTML=_dat.muestra;
     	_item.setAttribute('peso',_peso);
     	_item.setAttribute('hatch',_hatch);
     	_item.setAttribute('onclick','cargarCandidatoAccion(this)');
     	_form.querySelector('#candidatos #listado').appendChild(_item);
     }
    
    for(_campo in _dataacc){                	
    	_inp=_form.querySelector('[name="'+_campo+'"]');
    	
    	if(_inp!=null){
    		if(
    			_inp.tagName=='INPUT'
    			||
    			_inp.tagName=='TEXTAREA'
    		){
    			_inp.value=_dataacc[_campo];
    		}else if(
    			_inp.tagName=='SELECT'
    		){
    			if(_inp.querySelector('option[value="'+_dataacc[_campo]+'"]')==null){continue;}
    			_inp.querySelector('option[value="'+_dataacc[_campo]+'"]').selected='selected';
    		}else if(
    			_inp.tagName=='SPAN'
    		){
    			_inp.innerHTML=_dataacc[_campo];
    		}
    	}
    	
    	
    }
    
	_form.querySelector('span[name="estado"]').setAttribute('prioridad',_dataacc.prioridad);	
		                                           
    if(_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor]==undefined){
    	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML='-';	
    }else{
    	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML=_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor].nombreusu;
    }
    
    
    mostrarFormularioAccionVinculosCom(_dataacc);

	mostrarFormularioAccionVinculosCnt(_dataacc)
        
    _form.querySelector('#adjuntoslista').innerHTML='';
    for(_na in _dataacc.adjuntos){
    	_daj=_dataacc.adjuntos[_na];	 
    	 anadirAdjunto(_daj);	                	
    }
    
    _form.setAttribute('modificado','no');
}



function mostrarFormularioAccionVinculosCom(_dataacc){
	_form.querySelector('#vinculos #COM #listado').innerHTML='';
    if(Object.keys(_dataacc.comunicaciones).length>0){
    	_form.querySelector('#vinculos #COM').style.display='block';
    }else{
    	_form.querySelector('#vinculos #COM').style.display='none';
    }
    for(_idc in _dataacc.comunicaciones){
    	_datcom=_dataacc.comunicaciones[_idc];
    	
    	_com=document.createElement('a');
    	_com.setAttribute('class','COMcomunicacion');
    	_com.setAttribute('gaid',_datcom.idga);
    	_com.setAttribute('gbid',_datcom.idgb);
        _com.setAttribute('sentido',_datcom.sentido);
        _com.setAttribute('estado',_datcom.estado);
        _com.setAttribute('pnom',_datcom.falsonombre);
        _com.innerHTML=_datcom.etiqueta;
        
        _com.setAttribute('target','blank');
        _com.setAttribute('href','./COM_gestion.php?idcom='+_idc);
        
        _form.querySelector('#vinculos #COM #listado').appendChild(_com);
        
        _decom=document.createElement('a');
        _decom.innerHTML='<span>x</span> - desvincular';
        _decom.setAttribute('regid',_idc);
        _decom.setAttribute('class','delink');
        _decom.setAttribute('onclick','borrarLinkCom(this)');
        
        _form.querySelector('#vinculos #COM #listado').appendChild(_decom);
    }
}

function mostrarFormularioAccionVinculosCnt(_dataacc){
	
	_form.querySelector('#vinculos #CNT #listado').innerHTML='';
    if(Object.keys(_dataacc.contrataciones).length>0){
    	_form.querySelector('#vinculos #CNT').style.display='block';
    }else{
    	_form.querySelector('#vinculos #CNT').style.display='none';
    }
    for(_idc in _dataacc.contrataciones){
    	_datcnt=_dataacc.contrataciones[_idc];
    	
    	_com=document.createElement('a');
    	_com.setAttribute('class','CNTcontrataciones');
    	_com.setAttribute('gaid',_datcnt.id_p_grupos_tipo_a);
    	_com.setAttribute('gbid',_datcnt.id_p_grupos_tipo_b);
        _com.setAttribute('estado',_datcnt.fechacierretipo);
        _com.setAttribute('pnom',_datcnt.falsonombre);
        _com.innerHTML='<span>'+_datcnt.etiqueta+'</span><div class="iconopago">';
        
        _com.setAttribute('target','blank');
        _com.setAttribute('href','./CNT_gestion.php?idcnt='+_idc);
        
        _form.querySelector('#vinculos #CNT #listado').appendChild(_com);
        
        _decom=document.createElement('a');
        _decom.innerHTML='<span>x</span> - desvincular';
        _decom.setAttribute('regid',_idc);
        _decom.setAttribute('class','delink');
        _decom.setAttribute('onclick','borrarLinkCnt(this)');
        
        _form.querySelector('#vinculos #CNT #listado').appendChild(_decom);
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

function mostrarAdjunto(_this){
	
	_ruta='./documentos/p_'+_PanId+'/SEG/original/'+_this.getAttribute('ruta');
	window.open( _ruta,'_blank');

}
