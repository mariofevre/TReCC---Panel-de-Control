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

	function consultaGrupos(){
			_parametros = {
	            'panid': _PanId
			};
			$.ajax({
				url:   './PAN/PAN_grupos_consulta.php',
				type:  'post',
				data: _parametros,
				error: function(XMLHttpRequest, textStatus, errorThrown){ 
	                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
	            },
				success:  function (response){
					
					var _res = PreprocesarRespuesta(response);
					if(_res===false){return;}
					_DatosGrupos=_res.data;
					consultarEstructura();
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
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
			},
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
			
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
	
	
	function consultarEstructura(){				
        var _parametros = {
            'panid': _PanId
        };

        $.ajax({
            url:   './IND/IND_consulta_estructura.php',
            type:  'post',
            data: _parametros,
            error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				
				
                DatosGenerales=_res.data;
				_HabilitadoEdicion=_res.data.habilitadoedicion;
                    
                _Tits=document.getElementById('columnacalendario');
                _Tits.innerHTML='';
                _Hist=document.getElementById('ventanahistorial');
                _Hist.innerHTML='';
                for(_nn in _res.data.agrupacion){
                    _idGP=_nn;
                    _Tita=document.createElement('div');
                    _Tita.setAttribute('class','grupoa titulo');
                    
                    if(_DatosGrupos.grupos[_idGP]==undefined){
                        _nom ='S/D';
                    }else{
                        _nom=_DatosGrupos.grupos[_idGP].nombre;
                    }
                    _Tita.innerHTML=_nom;
                    _Tits.appendChild(_Tita);
                    
                    _Hista=document.createElement('div');
                    _Hista.setAttribute('class','grupoa historial');
                    //_Hista.innerHTML=_idGP;
                    _Hist.appendChild(_Hista);
                    
                    for(_ns in _res.data.agrupacion[_nn]){
                        _idGS=_ns;
                        
                        _Titb=document.createElement('div');
                        _Titb.setAttribute('class','filasepara');
                        
                        if(_DatosGrupos.grupos[_idGS]==undefined){
	                        _nom ='S/D';
	                    }else{
	                        _nom=_DatosGrupos.grupos[_idGS].nombre;
	                    }
	                    
                        _Titb.innerHTML=_nom;
                        _Tits.appendChild(_Titb);
                        
                        _Histb=document.createElement('div');
                        _Histb.setAttribute('class','filasepara');
                        //_Hista.innerHTML=_idGP;
                        _Hist.appendChild(_Histb);							
                        
                        for(_idInd in _res.data.agrupacion[_nn][_ns]){
                            _Ind=document.createElement('div');
                            _Ind.setAttribute('class','fila nombre');
                            _Ind.setAttribute('id','Ind'+_idInd);
                            _Ind.innerHTML=_res.data.indicadores[_idInd].indicador+"<br>"+_res.data.indicadores[_idInd].descripcion.substring(0,30)+"...";
                            
                            _IndiD=document.createElement('div');
                            _IndiD.setAttribute('class','indid');
                            _IndiD.innerHTML=_idInd;
                            _Ind.appendChild(_IndiD);
                            
                            _Tits.appendChild(_Ind);
                            
                            _HistI=document.createElement('div');
                            _HistI.setAttribute('class','fila histo');
                            _HistI.setAttribute('periodicidad',_res.data.indicadores[_idInd].id_p_INDperiodicidad);
                            _HistI.setAttribute('id','HcI'+_idInd);
                            //_HistI.innerHTML=_idGP;
                            _Hist.appendChild(_HistI);		
                            
                            
                            if(_editarInd != ''){
                                if(_editarInd == _idInd){
                                    consultaInd(_Ind);
                                }
                            }
                            
                            for(_nf in _res.data.indicadores[_idInd].fechas){
								_fechainicial=new Date(_nf);
								break;
							}
							
                            for(_nf in _res.data.indicadores[_idInd].fechas){
								var date1 = new Date(_nf);
								var date2 = _fechainicial;
								var difference = date1.getTime() - date2.getTime();
								var days = Math.ceil(difference / (1000 * 3600 * 24))+_res.data.indicadores[_idInd].diaN;
								//console.log('d:'+days);
								
							}
                            
                        }
                    }
                }	
                document.getElementById('verreg').style.display='block';
                //consultarIndicadores();
                $( ".fila.nombre" ).click(function() {
                    consultaInd(this);
                });
                
                
                document.querySelector('#verreg').innerHTML="<img src='./img/cargando.gif'>cargando...";
                document.querySelector('#verreg').removeAttribute("onclick");
                consultarIndicadores();
            }
        });
	}
	
	function enviarFormulario(){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		
		
		_ins_pend=document.querySelectorAll('#formcent input[actual="no"]');
		
		if(Object(_ins_pend).length > 0){
			if(confirm('Aún tiene '+Object(_ins_pend).length+' valores de Datos sin guardar. \n ¿Desea guardarlos ahora?')){
				guardarDatos_ante_form();
				return;
			}
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
		$.ajax({
			url:   './IND/IND_ed_guarda_ind.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				_res = PreprocesarRespuesta(response);
				if(_res===false){return;}
                consultarEstructura();	
                cerrarForm();

            }
        })
		
	}



	function guardarDatos_ante_form(){		
		
		_ins_pend=document.querySelectorAll('#formcent input[actual="no"]');
		console.log('pendientes: '+Object(_ins_pend).length);
		if(Object(_ins_pend).length == 0){
			enviarFormulario();
			return;
		}		
		
		_imp=document.querySelector('#formcent input[actual="no"]');				
		_modo='masivo';
		guardarValor(_imp,_modo);						
		
	}


	function enviarEliminar(_idInd){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _idInd=_idInd;
		var _parametros = {
            "panid" : _PanId,
			"indicador" : _idInd,			
			"accion":"eliminar"
		};
		$.ajax({
			url:   './IND/IND_ed_borra_ind.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				_res = PreprocesarRespuesta(response);
				if(_res===false){return;}	
				cerrarForm();
				_fila=document.querySelector('#Ind'+_idInd);
				_fila.parentNode.removeChild(_fila);
				_fila=document.querySelector('#HcI'+_idInd);
				_fila.parentNode.removeChild(_fila);
			
			}
		})
	}	

//consulta los indicadores y sus registros o contenidos
function consultarIndicadores(){		
	
	var _parametros = {
		"hasta":'',
		"modo":'display',
		"indicador":'',
		'panid': _PanId
	};
	
	$.ajax({
		url:   './IND/IND_consulta_registros.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			
			_Logs['tx_registros']={};
			_Logs['tx_registros']=_res.tx;
			
			DatosRegistros=_res.data.registros;
			
			mostrarRegistros();
		}
	});	
}

function info(_this){
	_a=_this.parentNode.querySelector('input');
	if(_a.getAttribute('regid')!=undefined){
		
		var _this=_this;
		_parametros={
			'idreg': _a.getAttribute('regid'),
			'panid': _PanId
		}
		$.ajax({
			url: './IND/IND_consulta_registro.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
			},
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				_this.removeAttribute('onclick');						
				if(_res.data.id!='undefined'){
					_div=document.createElement('div');
					_div.setAttribute('class','info');
					_this.appendChild(_div);
					_div.innerHTML="<a id='cerrar' onclick='cerrarInfo(this)'>cerrar</a><a id='elim' onclick='eliminarReg(this)'>elim</a><h3>reg:</h3><p id='regid'></p><h3>valor:</h3><p id='valor'></p><h3>cargado:</h3><p id='fecha'></p><h3>por:</h3><p id='usuario'></p>";
					_div.querySelector('#regid').innerHTML=_res.data.id;
					_div.querySelector('#valor').innerHTML=_res.data.valor +" / "+_res.data.texto;
					_div.querySelector('#fecha').innerHTML=_res.data.zz_AUTOFECHACREACION;
					_div.querySelector('#usuario').innerHTML=_res.data.usuariotx;	
				}
			}
		});
	}
}


function eliminarReg(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	var _I=_this.parentNode.parentNode;
	
	_regid=_this.parentNode.parentNode.parentNode.querySelector('input').getAttribute('regid');
	var r = confirm("Va a borrar este registro de la base?");
	if (r == true) {
		
		var _IndId=document.querySelector('div#formcent input#cid').value;

		var _parametros = {
			"indicador" : _IndId,
			"accion":'eliminar',
			"registro": _regid,
			'panid': _PanId
		};
		
		$.ajax({
			url: './IND/IND_ed_elimina_reg.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
					alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
			},
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				
				consultarIndicadorCarga(_IndId);
				//_this.setAttribute('readonly','readonly');
				_I.removeChild(_this.parentNode);
				setTimeout(function(){_I.setAttribute('onclick','info(this)');},100);
			}
		});
		
	} else {
		
	}
}	




function guardarValor(_this,_modo){
	if(_modo==undefined){_modo='';}
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		_this.parentNode.querySelector('#estado').removeAttribute('estado');
		_this.parentNode.querySelector('#estado').title='estado: envío suspendido';
		return;
	}
	
	_indicador=document.getElementById('acarga').getAttribute('indid');
	_ff=_this.getAttribute('id').substring(1);
	
	var _parametros = {
		"indicador" : _indicador,
		"accion":'carga',
		"fecha":_ff,
		"valor":_this.value,
		"tipo": _this.parentNode.getAttribute('tipo'),
		'panid': _PanId,
		'modo':_modo
	};
	
	$.ajax({
		url: './IND/IND_ed_guarda_reg.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
		
				console.log('o');
			if(document.querySelector('#general #cid').value!=_res.data.indicador){
				
				console.log('cambió el indicador visible mientrazs se guardaba, no actualizar formulario.');
				// cambió el indicador visible mientrazs se guardaba, no actualizar formulario.
				
			}else{
		
				console.log('#i'+_res.data.fecha);
				_inp=document.querySelector('#i'+_res.data.fecha);
				_inp.setAttribute('readonly','readonly');
				
				console.log(_inp);
				
				if(_res.data.modo=='masivo'){
					
					console.log('f');
					_inp.setAttribute('actual','si');
					console.log(_inp);
					guardarDatos_ante_form();
					return;
				}				
				_inp.parentNode.querySelector('#estado').title='estado: se ha guardado el dato, se está consultando el nuevo valor resultante';
				
			}
			
			consultarIndicadorCarga(_res.data.indicador);
			
			if(_res.acc.actualizarIndicadores!=undefined){
				//console.log(_res.acc.actualizarIndicadores);
				consultarIndicadores();
			}
			if(_res.acc.actualizarHitos!=undefined){
				//console.log(_res.acc.actualizarHitos);
				actualizarHitos();
			}
			
		}
	});
}

function actualizarHitos(){
	$.ajax({
		url:   './HIT/HIT_consulta_hitos.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			console.log(_res);
			//aca falta algo TODO
		}
	})
}
 
 
 var _Logs={};
function consultarIndicadorCarga(_ind){	
	var _IndId=_ind;
	var _parametros = {
		"hasta":'',
		"modo":'display',
		"indicador":_ind,
		'panid': _PanId
	};
	
	$.ajax({
		url:   './IND/IND_consulta_registros.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			DatosRegistros=_res.data;
			
				
			for(_FF in _res.data.registros[_IndId]){
				
				if(document.getElementById('i'+_FF)!=undefined){
					if(document.getElementById('i'+_FF).getAttribute('readonly')=='readonly'){
						if(DatosGenerales.indicadores[_InId].tipo=='textolibre'||DatosGenerales.indicadores[_InId].tipo=='categoria'){
							document.getElementById('i'+_FF).value=_res.data.registros[_IndId][_FF].texto;
							document.getElementById('i'+_FF).parentNode.querySelector('#estado').title='estado: se ha guardado el dato.';	document.getElementById('i'+_FF).parentNode.querySelector('#estado').setAttribute('estado','ok');
							_this.setAttribute('readonly','readonly');
							document.getElementById('i'+_FF).setAttribute('actual','si');
						}else{
							document.getElementById('i'+_FF).value=_res.data.registros[_IndId][_FF].valorT;
							document.getElementById('i'+_FF).parentNode.querySelector('#estado').title='estado: se ha guardado el dato.';	document.getElementById('i'+_FF).parentNode.querySelector('#estado').setAttribute('estado','ok');
							document.getElementById('i'+_FF).setAttribute('actual','si');
						}
						
						if(_res.data.registros[_IndId][_FF].id!=undefined){
							document.getElementById('i'+_FF).setAttribute('regid',_res.data.registros[_IndId][_FF].id);
							document.getElementById('i'+_FF).parentNode.querySelector('#info').setAttribute('visible','si');
						}else{
							document.getElementById('i'+_FF).parentNode.querySelector('#info').setAttribute('visible','no');
						}
					}
					
				}
			}
			
			if(DatosGenerales.indicadores[_IndId].persistente=='1'){
				_inputs=document.querySelector('#cargavalores #contenido').querySelectorAll('input');
				_persisteValue='';
				for(_nn in _inputs){
					
					if(typeof _inputs[_nn]=='object'){
						//console.log(_persisteValue);
						if(_inputs[_nn].value!=''){
							//console.log(_inputs[_nn].value);
							_persisteValue=_inputs[_nn].value;
						}else{
							//console.log(_persisteValue);
							_inputs[_nn].value=_persisteValue;                             
						}	
					}
				}	
			}
		}
	});	
}


function crearIndicador(_this){

	var _parametros = {
	'accion':'crearindicador',
	'panid': _PanId
	};

	$.ajax({
		url:   './IND/IND_ed_crea_ind.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			//console.log(_res);
			if(_res.data.nid>0){
				_editarInd=_res.data.nid;
				consultarEstructura();
			}
		}
	})                                   
}


function consultaInd(_this){
	var _this=_this;
	vaciarOpcionares();
	document.querySelector('#cargavalores #contenido').innerHTML='';
	document.getElementById('formcent').style.display='block';
	var _parametros = {};
	
	$.ajax({
		url:   './IND/IND_consulta_opciones.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
		
			_Opciones=_res.data.opciones;					
			_InId=_this.getAttribute('id').substring(3);			
			formulaIND();
				
		}
	})	
}


function actualizarFechaHito(_this){
	var _parametros = {
		'panid': _PanId
	};
	
	$.ajax({
		url:   './HIT/HIT_consulta_hitos_fechasbase.php',
		type:  'post',
		data: _parametros,
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
				alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
		},
		success:  function (response){
			
			_res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			//console.log(_this);
			_Opciones.HIThitos=_res.data.hitos;
			//console.log(_this.value);
			_thiId=_this.getAttribute('id');
			_field=_thiId.substring(1);
			_fi=_field.split('_');
			_campo=_fi[(_fi.length-1)];
			//console.log('c'+_campo+'_a');
				
			if(_this.value>0){
				console.log(_Opciones.HIThitos[_this.value].ultimafechacalculada);
				_fecha=_Opciones.HIThitos[_this.value].ultimafechacalculada;
				_ff=_fecha.split("-");
				document.getElementById('c'+_campo+'_a').value=_ff[0];
				document.getElementById('c'+_campo+'_a').disabled=true;
				document.getElementById('c'+_campo+'_m').value=_ff[1];
				document.getElementById('c'+_campo+'_m').disabled=true;
				document.getElementById('c'+_campo+'_d').value=_ff[2];
				document.getElementById('c'+_campo+'_d').disabled=true;
			}else{
				_indicador=document.getElementById('cid').value;
				_fecha=DatosGenerales.indicadores[_indicador][_campo];
				_ff=_fecha.split("-");
				document.getElementById('c'+_campo+'_a').value=_ff[0];
				document.getElementById('c'+_campo+'_a').removeAttribute('disabled');
				document.getElementById('c'+_campo+'_m').value=_ff[1];
				document.getElementById('c'+_campo+'_m').removeAttribute('disabled');
				document.getElementById('c'+_campo+'_d').value=_ff[2];
				document.getElementById('c'+_campo+'_d').removeAttribute('disabled');
			}
		}
	})	
}
	
