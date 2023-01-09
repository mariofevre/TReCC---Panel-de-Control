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
	_parametros=Array();
	$.ajax({
		data:  _parametros,
		url:   './PAN/PAN_general_consulta.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			
			_DataAlertas=_res.data.alertas;
			_UsuarioAcc=_res.data.acceso;	
			_UsuarioTipo=_res.data.accesoTipo;
			_UsuarioDat=_res.data.usuarioDat;
			actualizarMenu();
			actualizarVisible();
			if(_UsuarioAcc=='administrador'){
				
				document.querySelector('#columnados .opcion[opcion="eliminacion"]').setAttribute('visible','si');
					
			}else{				
				document.querySelector('#botoneditarpan').setAttribute('visible','no');
				//document.querySelector('#columnados > .opcion[opcion="caracteristicas"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="usuarios"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="publicar"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="configuracion"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="cierre"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="duplicar"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="conexion"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="eliminacion"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="grupos"]').setAttribute('visible','no');
			}
			
			if(_UsuarioTipo=='comercial' || _UsuarioTipo=='comercial autonomo'){
				
				document.querySelector('#botoneditarpan').setAttribute('visible','no');
				//document.querySelector('#columnados > .opcion[opcion="caracteristicas"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="publicar"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="duplicar"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="conexion"]').setAttribute('visible','no');
			}
			
			if(_UsuarioTipo=='comercial autonomo'){
				document.querySelector('#columnados > .opcion[opcion="cierre"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="usuarios"]').setAttribute('visible','no');
				document.querySelector('#columnados > .opcion[opcion="eliminacion"]').setAttribute('visible','no');				
			}
			
			
			_DataPanel=_res.data.panel;
			_DataConfig=_res.data.config;
			document.querySelector('#bajada #id').innerHTML=_PanelI;
            document.querySelector('#bajada #nombre').innerHTML=_res.data.panel.nombre;
            document.querySelector('#bajada #descripcion').innerHTML=_res.data.panel.descripcion;
			_ModulosActivos=_res.data.config.modulosactivos;
			consultarModulos();
			
			
            for(_ncp in _res.data.config.conexiones.pendientes){                    	
            	_cont=document.querySelector('#columnados > a[opcion="conexion"] > h1');
            	
            	_dat=_res.data.config.conexiones.pendientes[_ncp];
            	
            	_div=document.createElement('div');
            	_div.setAttribute('npend',_ncp);
            	_div.setAttribute('class','conexion pendiente');
            	_div.setAttribute('onclick','event.stopPropagation();formularAceptarConexion(this.getAttribute("npend"))');
            	_cont.appendChild(_div);
            	
            	_div2=document.createElement('div');
            	_div2.setAttribute('id','contenido');
            	_div2.innerHTML="Conexión entre paneles solicitada por "+_dat.solicitante.Nombre+' '+_dat.solicitante.apellido+'<br>';
            	_div2.innerHTML+="El día "+_dat.desde+'<br>';
            	_div2.innerHTML+="Para vincular el presente Panel con el Panel "+_dat.solicitante.idpanel+', '+_dat.solicitante.nombrepanel+' | '+_dat.solicitante.descripcionpanel;
            	_div.appendChild(_div2);
            	
            }
            
            for(_ncp in _res.data.config.conexiones.vigentes){                    	
            	_cont=document.querySelector('#columnados > a[opcion="conexion"] > h1');
            	
            	_dat=_res.data.config.conexiones.vigentes[_ncp];
            	
            	_div=document.createElement('div');
            	_div.setAttribute('npend',_ncp);
            	_div.setAttribute('class','conexion vigente');
            	_div.setAttribute('onclick','event.stopPropagation();formularAnularConexion(this.getAttribute("npend"))');
            	_cont.appendChild(_div);
            	
            	_div2=document.createElement('div');
            	_div2.setAttribute('id','contenido');
            	_div2.innerHTML="Conexión vigente con panel"+_dat.datapanel.idpanel+', '+_dat.datapanel.nombrepanel+' | '+_dat.datapanel.descripcionpanel;
            	_div.appendChild(_div2);
            }

            
		}
	})
}



function consultarModulos(){
	_ModAct=_ModulosActivos;
	_parametros={};
	$.ajax({
		data:  _parametros,
		url:   './SIS/SIS_consulta_modulos.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			_cont= document.querySelector('#contenidoextenso #columnauno');
			_cont.innerHTML='';
			for(_Mcod in _res.data.modulos){
				if(_ModAct[_Mcod]!='1'){continue;}				
				if(_UsuarioDat.AccModulos['']==undefined){
					if(_UsuarioDat.AccModulos[_Mcod]==undefined){
						continue;
					}
				}
								
				_Mdat[_Mcod]=_res.data.modulos[_Mcod];
				_dpaq=document.createElement('a');
				_dpaq.setAttribute('href',_Mdat[_Mcod].index);
				_dpaq.setAttribute('class','modulo');
				_dpaq.setAttribute('onmouseover','enfocar(this)');
				_dpaq.setAttribute('actualizado','no');
				_dpaq.setAttribute('id',_Mcod);
				_cont.appendChild(_dpaq);
				
				_aaa=document.createElement('a');
				_aaa.setAttribute('href',_Mdat[_Mcod].index);
				_aaa.setAttribute('title',_Mdat[_Mcod].descripcion);
				_dpaq.appendChild(_aaa);
				
				_dantig=document.createElement('div');
				_dantig.setAttribute('class','antig');
				_dantig.innerHTML='hace:<span id="res_antig"></span> hs ';
				_dantig.innerHTML+="<a onclick='event.stopPropagation();event.preventDefault();actualizar(this.parentNode.parentNode.parentNode.getAttribute(\"id\"))' class='actualizar'><img src=\"./img/actualizar.png\"></a>";
				_aaa.appendChild(_dantig);
				
				_h1=document.createElement('h1');
				if(_Mdat[_Mcod].nombrealternativo!=''){
					_h1.innerHTML=_Mdat[_Mcod].nombrealternativo;	
					
				}else{
					_h1.innerHTML=_Mdat[_Mcod].nombre;
				}
				_aaa.appendChild(_h1);
				
				_dres=document.createElement('div');
				_dres.setAttribute('class','resumen');
				_aaa.appendChild(_dres);
				
				for(_io in _Mdat[_Mcod].indicadoresOrden){
					_Icod=_Mdat[_Mcod].indicadoresOrden[_io];	
					_Idat = _Mdat[_Mcod].indicadores[_Icod];					
					//console.log(_Idat.codigo+' '+_spl[1]);
					mostrarFilaIndicadorInterno(_Mcod, _Icod, _Idat, 'estandar',_Icod);
				}
				cargaResumen(_Mcod);
				
			}
			
			document.querySelector('#columnauno > a.modulo').setAttribute('foco',"enfoco");
			document.querySelector('#columnauno > a.modulo').focus();
			
			secuenciaActualizacionResumenes();
		}
	});
	
}



function mostrarFilaIndicadorInterno(_Mcod, _Icod, _Idat, _tipo, _ref_ed){
	//esta función general las filas de indicadores pero no carga los valores ni niveles de alerta actuales, eso se realiza con la función de consulta: cargaResumen()
	_spl=_Idat.codigo.split('_');
				
	_dres=document.querySelector('a.modulo#'+_Mcod+' .resumen');
	
	_spl=_Idat.codigo.split('_');
	if(_spl[1]!=undefined){
		// este es un indicador complementario porcentual, será uncluido en el reporte de su indicador original.
		return;
	}
	
	if(_dres.querySelector('.renglon[idint="'+_Idat.codigo+'"]')!=undefined){
		_dren=_dres.querySelector('.renglon[idint="'+_Idat.codigo+'"]');
		_dres.removeChild(_dren);
	}
		
	_dren=document.createElement('div');
	_dren.setAttribute('class','renglon');
	_dren.setAttribute('tipo',_tipo);
	_dren.setAttribute('idint',_Idat.codigo);
	_dren.title=_Idat.descripcion;
	_dres.appendChild(_dren);

	_spa1=document.createElement('span');
	_spa1.setAttribute('class','definicion');
	_spa1.innerHTML=_Idat.nombre;
	_dren.appendChild(_spa1);
	
	_spa2=document.createElement('span');
	_spa2.setAttribute('id','res_'+_Idat.codigo);
	_spa2.setAttribute('class','res1');
	_dren.appendChild(_spa2);
	
	
	_lugares=1;
	if(_Mdat[_Mcod].indicadores[_Idat.codigo+'_Pes']!=undefined){
		_spa3=document.createElement('span');
		_spa3.title=' ';
	  	_spa3.setAttribute('class','res'+(3-_lugares));	  	
		_spa3.innerHTML='$';
		_dren.appendChild(_spa3);
		
		_spa4=document.createElement('span');
		_spa4.setAttribute('id','res_'+_Idat.codigo+'_Pes');
		_spa3.appendChild(_spa4);
		//_spa3.innerHTML+='-';
		
		_lugares--;														
	}
	
	if(_Mdat[_Mcod].indicadores[_Idat.codigo+'_P']!=undefined){
		_spa3=document.createElement('span');
		_spa3.title=' ';
	  	_spa3.setAttribute('class','res'+(3-_lugares));
		_spa3.innerHTML='';
		_dren.appendChild(_spa3);
		
		_spa4=document.createElement('span');
		_spa4.setAttribute('id','res_'+_Idat.codigo+'_P');
		_spa3.appendChild(_spa4);
		_spa3.innerHTML+='%';
		
		_lugares--;														
	}
	
	if(_Mdat[_Mcod].indicadores[_Idat.codigo+'_F']!=undefined){
		_spa3=document.createElement('span');
	  	_spa3.setAttribute('class','res'+(3-_lugares));
	  	_spa3.title=' ';
		_dren.appendChild(_spa3);
		
		_spa4=document.createElement('span');
		_spa4.setAttribute('id','res_'+_Idat.codigo+'_F');
		_spa3.appendChild(_spa4);
		_spa3.innerHTML+='x';
		
		_lugares--;														
	}
	
	if(_Mdat[_Mcod].indicadores[_Idat.codigo+'_Tx']!=undefined){
		_spa3=document.createElement('span');
	  	_spa3.setAttribute('class','res'+(3-_lugares));
	  	_spa3.title=' ';
		_spa3.setAttribute('onmouseover','muestradet(this);');
		_spa3.setAttribute('onmouseout','ocultadet(this);');
		_spa3.innerHTML=' det.';
		_dren.appendChild(_spa3);
		
		_spa4=document.createElement('span');
		_spa4.setAttribute('id','res_'+_Idat.codigo+'_Tx');
		_spa4.setAttribute('class','restx');
		_dren.appendChild(_spa4);
					
		_lugares--;											
	}
	
	//console.log(_Idat.codigo);
	//console.log(_lugares);
	for (i = 0; _lugares > 0; _lugares--) {
	  	_spa3=document.createElement('span');
	  	_spa3.setAttribute('class','res'+(3	-_lugares));
		_dren.appendChild(_spa3);
	} 

	
	_alertas={};
	if(_DataAlertas[_Mcod]!=undefined){
		if(_DataAlertas[_Mcod][_Idat.codigo]!=undefined){
			_alertas[_Idat.codigo]=_Idat.codigo;
		}
		
		if(_DataAlertas[_Mcod][_Idat.codigo+'_P']!=undefined){
			_alertas[_Idat.codigo+'_P']=_Idat.codigo+'_P';
		}
		if(_DataAlertas[_Mcod][_Idat.codigo+'_Pes']!=undefined){
			_alertas[_Idat.codigo+'_Pes']=_Idat.codigo+'_Pes';
		}
		
		
		for(_na in _alertas){	
			_diva=document.createElement('a');
			_diva.setAttribute('onclick','event.preventDefault();event.stopPropagation();formularAlerta(this)');
			_diva.setAttribute('id','alerta');
			_diva.setAttribute('refed',_ref_ed);
			_diva.title='Nivel de alerta obtenido para esta variable.';
			_diva.setAttribute('codigo',_na);
			_dren.appendChild(_diva);
			if(_DataAlertas[_Mcod][_na].idalerta==''||_DataAlertas[_Mcod][_na].valor_min===null||_DataAlertas[_Mcod][_na].valor_max===null){
				_diva.setAttribute('estado','inactiva');
				_diva.innerHTML+='<img src="./img/agregar.png">';
			}else{
				_diva.setAttribute('estado','activa');

				_diva.innerHTML='<span id="min">'+redondeoGral(_DataAlertas[_Mcod][_na].valor_min)+'</span>';				
				_diva.innerHTML+='<span id="nivel"><span id="num"></span><span id="barra"></span></span>';				
				_diva.innerHTML+='<span id="max">'+redondeoGral(_DataAlertas[_Mcod][_na].valor_max)+'</max>';
				
			}							
		}
	}	
}

function redondeoGral(_v){
	
	_v=Math.round(_v);
		
	if(_v>=1000000){_v=Math.round(_v/1000000)+'<span>M</span>';
	}else if(_v>=1000){_v=Math.round(_v/1000)+'<span>K</span>';}
	
	
	
	
	return(_v);
}


function cargaResumen(_COD){
	_parametros={
		"panid":_PanelI			
	};
	_url='./'+_COD+'/'+_COD+'_consulta_resumen.php';
	var _COD=_COD;
	$.ajax({
		data:  _parametros,
		url:  _url,
		type:  'post',
        error: function(XMLHttpRequest, textStatus, errorThrown){         	
            _url=this.url;
            _s=_url.split('/');
            _cod=_s[1]; 
            delete _ResumenesEnConsulta[_cod];
			console.log('faltan:'+Object.keys(_ResumenesEnConsulta).length);
			console.log(_ResumenesEnConsulta);
			if(Object.keys(_ResumenesEnConsulta).length == 0){
				guardarCacheAlerta();
			}
        },
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			
			if(_res.data.otrainfo!=''&&_res.data.otrainfo!=undefined){
				//console.log(_res.data.otrainfo);	
				//alert(_res.data.otrainfo)
				
				//_res.data.otrainfo='{"3127":{"nombre":"REASIGNACION DE TAREAS","descripcion":"iR - Evaluacion de la cantidad de tareas con asignacion deficiente original de personal. Motivos de reasignacion: incumplimiento de horaraio, bajo rendimiento, incapacidad fisca, falta de capacitacion.ResponsableAsistente social - Arquitecto/a","alerta_min":"5","alerta_max":"10","valor":"2.00000000"}}';

				//_res.data.otrainfo= _res.data.otrainfo.replace(/(\r\n|\n|\r)/gm, "");
				
				_otra=JSON.parse(_res.data.otrainfo);
				
				
				for(_k in _otra){					
					
					_dat=_otra[_k];
					
					if(_COD=='PLA'){
						_tipo='estadoplan';
						_prop='estadopla'+_k;
						_ref_ed=_dat.estado;// nombre del estado sin hatch;
					}else if(_COD=='IND'){
						_tipo='personalizado';
						_prop='ind'+_k;
						_ref_ed=_k;//id del indicador
					}else{
						_tipo='desconocido';
						_prop='';
						_ref_ed='';
					}
					
					
					//console.log(_dat);		
							
					if(_dat.alerta_min==''||_dat.alerta_min==null){_amin=null;}else{_amin=Number(_dat.alerta_min);}
					if(_dat.alerta_max==''||_dat.alerta_max==null){_amax=null;}else{_amax=Number(_dat.alerta_max);}
					_DataAlertas[_COD][_prop]={
						'codigo':_prop,
						'descripcion':_dat.descripcion,
						'id_p_SISmodulos':_COD,
						'idalerta':'NA',
						'nombre':_dat.nombre,
						'valor_max':_amax,
						'valor_min':_amin		
					}					
					_res.data[_prop]=Number(_dat.valor);
					
					_dat['codigo']=_prop;
					_dat['codigo']['valor']=Number(_dat['codigo']['valor']);
					
					
					mostrarFilaIndicadorInterno(_COD, _prop, _dat, _tipo,_ref_ed);
				}
			} 
			
			for(_prop in _res.data){
				_htmlelem=document.querySelector('.modulo#'+_COD+' span#res_'+_prop);
				if(_htmlelem != null){
					if(typeof _htmlelem == 'object'){
						
						_s=_prop.split('_');
						
						if(_s[1]=='Pes'){		
							_htmlelem.innerHTML=redondeoGral(_res.data[_prop]);
							//_htmlelem.innerHTML=parseInt(_res.data[_prop]).format(0,0, ".", ",");
						}else if(_s[1]=='Tx'){
							_htmlelem.innerHTML=_res.data[_prop];
						}else if(_s[1]=='P'){							
							_htmlelem.innerHTML=redondeoGral(_res.data[_prop]);
						}else if(_s[1]==null){
							_htmlelem.innerHTML=redondeoGral(_res.data[_prop]);
						}		
					}
				}
				
				if(_DataAlertas[_COD]!=undefined){
				if(_DataAlertas[_COD][_prop]!=undefined){
					
					if(_DataAlertas[_COD][_prop].idalerta==''){continue;}
					_d=_DataAlertas[_COD][_prop];
					_v=_res.data[_prop];
					_rango=Math.abs(_d.valor_max - _d.valor_min);
					console.log('v:'+_v);
					console.log(_d.valor_min +'vs'+ _d.valor_max);
					console.log(_d);
					if(Number(_d.valor_min) < Number(_d.valor_max)){
						console.log('ça');
						_v=Math.max(_v,_d.valor_min);
						_v=Math.min(_v,_d.valor_max);						
					}else if(Number(_d.valor_min) > Number(_d.valor_max)){
						console.log('çb');
						//console.log(_v+'vs'+_d.valor_min);
						_v=Math.min(_v,_d.valor_min);						
						//console.log(_v+'vs'+_d.valor_max);
						_v=Math.max(_v,_d.valor_max);
						//console.log('v:'+_v);	
					}
					
					
					//console.log('v:'+_v);
					_valorrel= Math.abs(_v - _d.valor_min);
					console.log('vr:'+_valorrel);
					console.log('ra:'+_rango);
					_alerta=_valorrel * 100/ _rango;
					_alertageneral.push(_alerta);
					_alerta=Math.round(_alerta);
					
					_query='.modulo#'+_COD+' #alerta[codigo="'+_prop+'"] #nivel #num';
					_num=document.querySelector(_query);
					if(_num==null){continue;}
					_num.innerHTML=_alerta+'%';
					
					_query='.modulo#'+_COD+' #alerta[codigo="'+_prop+'"] #nivel #barra';
					_barra=document.querySelector(_query);
					if(_barra==null){continue;}
					_barra.style.width="calc("+_alerta+"% - 1px)";
					
					_rgb = colorAlerta(_alerta);
					document.querySelector('.modulo#'+_COD+' #alerta[codigo="'+_prop+'"] #nivel').style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.2)';
					document.querySelector('.modulo#'+_COD+' #alerta[codigo="'+_prop+'"] #nivel #barra').style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.6)';
					document.querySelector('.modulo#'+_COD+' #alerta[codigo="'+_prop+'"] #nivel #barra').style.borderColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',1)';
					
					_adiv=document.querySelector('#page h1 #alerta');
					_n=_adiv.getAttribute('cant');
					_n=parseInt(_n)+1;
					_adiv.setAttribute('cant',_n);
					_v=_adiv.getAttribute('suma');
					_v=parseFloat(_v)+_alerta;
					_adiv.setAttribute('suma',_v);
					
					actualizarAlertaGeneral();	
				}	
				}	
			}
			delete _ResumenesEnConsulta[_COD];
			if(Object.keys(_ResumenesEnConsulta).length == 0){
				guardarCacheAlerta();
			}
		}
	});
}
	


function guardarCacheAlerta(){
	_diva=document.querySelector('#page > h1 > #alerta');
	
	_cant=parseInt(_diva.getAttribute('cant'));
	_suma=parseInt(_diva.getAttribute('suma'));
	console.log(_diva.getAttribute('suma'));
	console.log(_diva.getAttribute('cant'));
	_alerta=_suma/_cant;
	_parametros={
		'panid': _PanId,
		'alerta':_alerta
	}
	$.ajax({
		data:  _parametros,
		url:   './PAN/PAN_ed_guarda_cache_alerta.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
		}
	});
	
}



function iniciarEliminacion(){
	if(!confirm('¿Eliminamos el panel? \n \n'+ _DataPanel.nombre +'\n \n ....  ¿Segure?')){return;}
	
	_params={
		'panid':_PanelI
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_borra_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);

            window.location.assign('./PAN_listado.php');
           
        }
    })
}


function iniciarCierre(){
	if(!confirm('¿Damos por finalizada esta instancia de seguimiento?')){return;}
	
	_params={
		'panid':_PanelI
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_cierra_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            window.location.assign('./PAN_listado.php');

            
        }
    })
}

function enviarduplicacion(_this,_event){
    _event.preventDefault();
    _inps=_this.querySelectorAll('input');
    _params={};
    for(_ni in _inps){
        if(typeof _inps[_ni] !='object'){continue;}
        _params[_inps[_ni].getAttribute('name')]=_inps[_ni].value;
    }
     $.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_duplica_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            
            window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
    })
}


function actualizar(_COD){

	_parametros={
		"panid":_PanelI			
	};
	_url='./'+_COD+'/'+_COD+'_actualizar.php';
	var _COD=_COD;
	$.ajax({
		data:  _parametros,
		url:  _url,
		type:  'post',
		success:  function (response, request) {
			_res = PreprocesarRespuesta(response);
			if(_res.data.MOD!=undefined){
				cargaResumen(_res.data.MOD);
			}
		}
		
	});
}	
	


function guardarFormPublicacion(){
	_form=document.querySelector('#formPublicacionesWeb');
	_form.querySelector('#');
	
}


function crearPUBcomponente(){
	_parametros={
		'idpub':document.querySelector('#formpublicacionweb [name="idpub"]').value,
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_crea_PUBcomponente.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            
            ActualizarPubComponenteConfig();
			
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
    })
}

function eliminarComponentePub(_idpubcomp){
	
	if(!confirm("¿Eliminamos este componente?... ¿Segure?")){return;}
	
	
	_parametros={
		'idpub':document.querySelector('#formpublicacionweb [name="idpub"]').value,
		'idpubcomp':_idpubcomp,
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_borra_PUBcomponente.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            
            ActualizarPubComponenteConfig();
			
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
   });
}

function cambiarModComponente(_mod,_idpubcomp){
	_parametros={
		'idpub':document.querySelector('#formpublicacionweb [name="idpub"]').value,
		'idpubcomp':_idpubcomp,
		'mod':_mod,
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_cambia_PUBcomponente_mod.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            
            ActualizarPubComponenteConfig();
			
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
   });
}

function ActualizarPubComponenteConfig(){
	_parametros=Array();
	$.ajax({
		data:  _parametros,
		url:   './PAN/PAN_general_consulta.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			_DataConfig=_res.data.config;
			formularPublicacion(document.querySelector('#formpublicacionweb [name="idpub"]').value);
		}
	})
}
	



function guardarFormAlerta(){
	
	_parametros={
		'codigo':document.querySelector('#formalerta [name="codigo"]').value,
		'refed':document.querySelector('#formalerta [name="refed"]').value,
		'tipo':document.querySelector('#formalerta [name="tipo"]').value,
		'min':document.querySelector('#formalerta [name="min"]').value,
		'max':document.querySelector('#formalerta [name="max"]').value,
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_alerta.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            
            consultarPanel();
			cerrarFormalerta();
			
			
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
    })
}


function desactivarAlerta(){
	
	_parametros={
		'codigo':document.querySelector('#formalerta [name="codigo"]').value,
		'refed':document.querySelector('#formalerta [name="refed"]').value,
		'tipo':document.querySelector('#formalerta [name="tipo"]').value,
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_alerta_desactiva.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            consultarPanel();
			cerrarFormalerta();
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
    })
}


function enviarFormPan(){
	
	_parametros={
		'nombre':document.querySelector('#formPAN [name="nombre"]').value,
		'descripcion':document.querySelector('#formPAN [name="descripcion"]').value,
		'localizacion_epsg3857':document.querySelector('#formPAN [name="localizacion_epsg3857"]').value,
		'fin':document.querySelector('#formPAN [name="fin"]').value,		
		"panid":_PanelI			
	}
	$.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_cambia_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);   
            consultarPanel();
			cerrarFormPan();
            //consultarModulos();
            //window.location.assign('./PAN_general.php?panel='+_res.data.nid);
            
        }
    })	
	
}
