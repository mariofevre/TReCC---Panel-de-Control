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

function formularGra(_idgra){
	
		vaciarOpcionares();
		document.getElementById('formcent').style.display='block';
		var _parametros = {
            "panid":_PanId,
            "graid":_idgra
		};
		
 		$.ajax({
			url:   './IND/IND_consulta_graficos_estructura.php',
			type:  'post',
			data: _parametros,
            error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}
			
                _Opciones=_res.data.opciones;
                //console.log(_idgra);
                _datgra=_res.data.graficos[_idgra];
                
                document.getElementById('cid').value=_idgra;    
                document.getElementById('ctitulo').value=_datgra.titulo;
                document.querySelector('select[name="tipo"] option[value="'+_datgra.tipo+'"]').selected=true;
                
                 document.querySelector('[name="fecha_inicio"]').value=_datgra.fecha_inicio;
                 document.querySelector('[name="fecha_fin"]').value=_datgra.fecha_fin;
                
                _cont2=document.querySelector('#selectordeindicadores');
                _cont2.innerHTML='';
                for(_nb in _DatosGrupos.gruposOrden.b){
                	//console.log(_na);
                	_idgb = _DatosGrupos.gruposOrden.b[_nb];
                	//console.log('idgb:'+ _idgb);
                	if(_DatosIndicadores.agrupacion[_idgb]==undefined){continue;}
                    _h2=document.createElement('h2');
                    _h2.innerHTML=_DatosGrupos.grupos[_idgb].nombre;
                    _cont2.appendChild(_h2);
                                        
                                        
                    for(_na in _DatosGrupos.gruposOrden.a){
                    	_idga = _DatosGrupos.gruposOrden.a[_na];
                    	//console.log(_idga);
                    	if(_DatosIndicadores.agrupacion[_idgb][_idga]==undefined){console.log('salta');continue;}
                    	
                        _h3=document.createElement('h3');
                        _h3.innerHTML=_DatosGrupos.grupos[_idga].nombre;
                        _cont2.appendChild(_h3);
                        
                    
                        for(_idind in _DatosIndicadores.agrupacion[_idgb][_idga]){
                        	
                            _aaa=document.createElement('a');
                            _cont2.appendChild(_aaa);
                            _aaa.setAttribute('idind',_idind);
                            _aaa.setAttribute('onclick','crearElemento(this)');
                            _aaa.innerHTML=_idind+' - '+_DatosIndicadores.indicadores[_idind].indicador;
                            
                        }
                    }
                }
                
                _cont=document.querySelector('#listadeindicadores');
                _cont.innerHTML='';
                for(_ni in _datgra.elementosOrden){
                
                    _idelem=_datgra.elementosOrden[_ni];
                    _datelem=_datgra.elementos[_idelem];
                    //console.log('a[idind="'+_datelem.indicador+'"]');
                    _cont2.querySelector('a[idind="'+_datelem.indicador+'"]').style.display='none';
                    
                    
                    _mar=document.createElement('div');
                    _mar.setAttribute('class','marco');
                    _mar.style.backgroundColor=_datelem.CO_color;
                    _mar.setAttribute('idelem',_idelem);
                    _mar.setAttribute('idind',_datelem.indicador);
                                            
                    _mar.setAttribute('draggable','true');
                    _mar.setAttribute('ondragstart','dragcaja(event)');
                    _mar.setAttribute('ondragleave','limpiarAllow()');
                    
                    _sep=document.createElement('div');
                    _sep.setAttribute('class','separador');
                    _sep.setAttribute('ondragover','allowDrop(event,this),resaltaHijos(event,this)');
                    _sep.setAttribute('ondragleave',"desaltaHijos(this)");
                    _sep.setAttribute('ondrop','dropcaja(event,this)');		 
                    
                    _mar.appendChild(_sep);
                       
                    _par=document.createElement('p');
                    _par.setAttribute('class','elemento');
                    
                    _inn=document.createElement('span');
                    _inn.innerHTML=_datelem.indicador;
                    _par.appendChild(_inn);
                    
                    _inn=document.createElement('input');
                    _inn.setAttribute('name','nombre');
                    if(_datelem.nombre!=''){
                        _inn.value=_datelem.nombre;
                    }else{
                        _inn.value=_res.data.tablaindicadores[_datelem.indicador].indicador;
                    }
                    _par.appendChild(_inn);
                    
                    _inn=document.createElement('input');
                    _inn.setAttribute('name','CO_color');
                    _inn.value=_datelem.CO_color;
                    _inn.setAttribute('type','color');
                    _par.appendChild(_inn);
                    
                    _inn=document.createElement('input');
                    _inn.setAttribute('name','trazo');
                    _inn.value=_datelem.trazo;
                    _par.appendChild(_inn);
                    
                    _mar.appendChild(_par);
                    
                    _inn=document.createElement('a');
                    _inn.setAttribute('onclick','eliminarElemento(this)');
                    _inn.setAttribute('class','eliminar');
                    _inn.innerHTML='x';
                    _par.appendChild(_inn);
                    
                    _cont.appendChild(_mar);
                    
                }				
			}
		})	
	}
	
	
	function crearElemento(_this){
	
        _parametros={
            'panid':_PanId,
            'idind':_this.getAttribute('idind'),
            'idgra':document.querySelector('#formcent #cid').value
        };
        $.ajax({
			url:   './IND/IND_ed_graficos_crear_elemento.php',
			type:  'post',
			data: _parametros,
            error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}                 
                formularGra(_res.data.idgra);             
                
            }
        });
	}

	function eliminarElemento(_this){	
        if(!confirm('áComnfirmas eliminar este elemento para este gráfico?')){return;}
        _parametros={
            'panid':_PanId,
            'idind':_this.parentNode.parentNode.getAttribute('idind'),
            'idgra':document.querySelector('#formcent #cid').value
        };
        $.ajax({
			url:   './IND/IND_ed_graficos_eliminar_elemento.php',
			type:  'post',
			data: _parametros,
           error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}   
    
                formularGra(_res.data.idgra);             
               
            }
        });
	}
	
	function dragcaja(_event){			
		//alert(_event.target.getAttribute('idit'));
		
		if(_event.target.getAttribute('class')!='marco'){
			_tar=_event.target.parentNode;
		}else{
			_tar=_event.target;
		}
		_arr=Array();
		_arr={
			'id':_tar.getAttribute('idelem')
		};		
		_arb = JSON.stringify(_arr);
		_event.dataTransfer.setData("text", _arb);
	}
		
	function allowDrop(_event,_this){
		//console.log(_this.parentNode.getAttribute('idit'));
		//console.log(_event.dataTransfer);
		limpiarAllow();		
		_event.stopPropagation();
		_this.setAttribute('destino','si');
		_event.preventDefault();
	}
	function resaltaHijos(_event,_this){
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
		//realta el div del item al que pertenese un tátulo o una descripcion
		//_this.style.backgroundColor='#fff';
		_this.removeAttribute('destino');
		_this.parentNode.removeAttribute('destino');
	}
	
	function limpiarAllow(){
		_dests=document.querySelectorAll('[destino="si"]');
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].removeAttribute('destino');
			}
		}
	}
			
	function dropcaja(_event,_this){//ajustado a geogec
		
		_event.stopPropagation();
		_this.removeAttribute('style');
		_this.removeAttribute('destino');
		_event.preventDefault();
		//console.log(JSON.parse(_event.dataTransfer.getData("text")));
	    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
	   	_el=document.querySelector('#formCent .marco[idelem="'+_DragData+'"]');
	    
	    if(_event.target.getAttribute('class')=='separador'){
	    	
	    	if(_event.target.getAttribute('class')=='submedio'){
	    		_tar=_event.target.parentNode;
	    	}else{
	    		_tar=_event.target;
	    	}
	    	
	    	_refMarc=_event.target.parentNode;
	    	_dest=_refMarc.parentNode; 
		    _dest.insertBefore(_el,_refMarc);
		    
	    }else{
	    	alert('destino inesperado');	    	
	    	return;	    	
	    }
	   
	    _ordennuevo=document.querySelectorAll('#formCent .marco');
	    
	    _serie=Array();
	    for(_ni in _ordennuevo){
	    	if(typeof _ordennuevo[_ni]=='object'){
	    		_serie.push(_ordennuevo[_ni].getAttribute('idelem'));
	    	}
	    }
	   
	    _parametros={
	    	"panid":_PanId,
	    	"serie":_serie
	    };
	    
 		$.ajax({
			url:   './IND_ed_reordenar_graficos_elementos.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}
				cargaBase();
				
			}
		});
		//enváa los datos para editar el átem
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
				if(typeof _list[_nn]==object){
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
		_form=document.getElementById('formcent');
		_inn=_form.querySelectorAll('input');
		for(_nn in _inn){
			if(typeof _inn[_nn]=='object'){
				if(_inn[_nn].getAttribute('fijo')=='fijo'){
					
				}else{
					_inn[_nn].value='';
				}
			}
		}

		_form.style.display='none';
		
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


	function opcionarHitos(_this){
		vaciarOpcionares();		
		_this.nextSibling.style.display="inline-block";
		_destino=_this.nextSibling.querySelector(".contenido");
		_id=_this.getAttribute('id');
		
		_tipo=_id.substring(1,(_id.length-2));
		recargarHitos(_destino,_tipo);
	}	


	function enviarFormulario(){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		_parametros={"panid": _PanId};
		_inps=document.querySelectorAll('#general > input, #general > select');
		
		for(_nin in _inps){            
            _parametros[_inps[_nin].name]=_inps[_nin].value;   
		}
		
		_parametros['fecha_inicio']=document.querySelector('input[name="fecha_inicio"]').value;
		_parametros['fecha_fin']=document.querySelector('input[name="fecha_fin"]').value;
		
		_elems=document.querySelectorAll('#listadeindicadores div.marco');
		_parametros.elementos={};
		for(_nel in _elems){
			if(typeof _elems[_nel] != 'object'){continue;} 
            _idelem=_elems[_nel].getAttribute('idelem');
            _parametros.elementos[_idelem]={
            	'nombre':_elems[_nel].querySelector('input[name="nombre"]').value,
            	'CO_color':_elems[_nel].querySelector('input[name="CO_color"]').value,
            	'trazo':_elems[_nel].querySelector('input[name="trazo"]').value
            }
            
            _parametros[_inps[_nin].name]=_inps[_nin].value;   
		}
		
		document.querySelector('div#formcent').style.display='none';
		_inps=document.querySelectorAll('#general select option:checked');		
		for(_nin in _inps){
            if(typeof _inps[_nin] != 'object'){continue;}   
            if(_inps[_nin].parentNode.getAttribute('name')==undefined){continue;}
            if(_inps[_nin].parentNode.getAttribute('name')==''){continue;}
            _parametros[_inps[_nin].parentNode.name]=_inps[_nin].value;   
		}
		
		$.ajax({
			url:   './IND/IND_ed_graficos_guardar.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}
                consultarEstructura();	
                cerrarForm();              
            }
        })
	}


	function activarEliminar(_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
            return;
		}
		_graId=_this.parentNode.parentNode.querySelector('#cid').value;
		
		_borrar=document.createElement('a');
		_borrar.setAttribute('class','cancelar');
		_borrar.setAttribute('id','acancelarElim');
		_borrar.setAttribute('onclick','cancelarEliminar(this);');
		_borrar.innerHTML="Cancelar";
		_this.parentNode.insertBefore(_borrar,_this);
		
		_borrar=document.createElement('a');
		_borrar.setAttribute('class','eliminar');
		_borrar.setAttribute('id','aElim');
		_borrar.setAttribute('onclick','enviarEliminar('+_graId+');');
		_borrar.innerHTML="Si, Borrar";
		_this.parentNode.insertBefore(_borrar,_this);

		_this.style.display='none';
	}


	function cancelarEliminar(_this){
		_conf=_this.nextSibling;
		_conf.parentNode.removeChild(_conf);
		_this.nextSibling.style.display='inline-block';
		_this.parentNode.removeChild(_this);
	}	


	function enviarEliminar(_idgra){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _parametros = {
            "idgra" : _idgra,
			"panid": _PanId,		
			"accion":"eliminar"
		};
		$.ajax({
			url:   './IND/IND_ed_graficos_eliminar.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}	
				cerrarForm();
				consultarEstructura();
		
			}
		})
	}	
	
	function crearGrafico(){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _parametros = {
			"panid": _PanId,		
			"accion":"crear"
		};
		$.ajax({
			url:   './IND/IND_ed_graficos_crear.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);				
				if(_res===false){return;}
				
				cerrarForm();
				consultarEstructura();

			}
		})		
	}
	

	function consultarDatosGrupos(){
		var _parametros = {
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
				cargaDatosIndicadores();
			}
		})
	}		
	
	
	function cargaDatosIndicadores(){
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
				
				_DatosIndicadores=_res.data;
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
	
	function vaciarOpcionares(_event){
		
		if(_event!=undefined){
            //console.log(_event);
			//console.log(_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling);
			//console.log(_event.originalTarget);
			
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
        //console.log(_this);
		_regid=_this.getAttribute('regid');
		//console.log(_regid);
		_regnom=_this.innerHTML;
		//console.log(_regnom);
		_regtit=_this.title;	
				
		_inputN=_this.parentNode.parentNode.previousSibling;
		_inputN.title=_regtit;
		_inputN.value=_regnom;
		
		_inputN.focus();
		_id=_inputN.getAttribute('id');
		_ff=_id.substring(0,(_id.length-2));			
		//console.log(_ff);
		
		_input=document.getElementById(_ff);
		_input.value=_regid;
		
		if(_id.substring(0,14)=='cid_p_HIThitos'){
			actualizarFechaHito(_input);
		}					
	}
	



function consultarEstructura(){				
    var _parametros = {
        'panid': _PanId
    };

    $.ajax({
        url:   './IND/IND_consulta_graficos_estructura.php',
        type:  'post',
        data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			
            DatosGenerales=_res.data;
        
            _cont=document.querySelector('#contenedor');
           	_cont.innerHTML='';
            for(_idgra in _res.data.graficos){
            	
                _datgra=_res.data.graficos[_idgra];
                 
                _divppal=document.createElement('div');
                _divppal.setAttribute('idgra',_idgra);
                _cont.appendChild(_divppal);
                
                _aaa=document.createElement('div');
                _aaa.setAttribute('class','botoneditar');
                _aaa.setAttribute('idgra',_idgra);
                _aaa.setAttribute('onclick','formularGra("'+_idgra+'")');
                _divppal.appendChild(_aaa);
                _h1=document.createElement('h1');
                _h1.innerHTML=_idgra+' - ' + _datgra.titulo;
                _aaa.appendChild(_h1);
                _p=document.createElement('p');
                _p.innerHTML='tipo: '+_datgra.tipo;
                _aaa.appendChild(_p);
                
            
                _aa=document.createElement('a');
                
                _aa.innerHTML='<img src="./img/abajo.png">';
                _aa.title='descargar imagen'; 
                _aa.setAttribute('onclick','event.stopPropagation();descargarImagen(this);');
                _h1.appendChild(_aa);
                
                for(_ne in _datgra.elementosOrden){
                
                    _idelem = _datgra.elementosOrden[_ne];
                    _datelem=_datgra.elementos[_idelem];
                    _p=document.createElement('p');
                    if(_datelem.nombre!=''){
                        _p.innerHTML=_datelem.nombre;
                    }else{
                        _p.innerHTML=_res.data.tablaindicadores[_datelem.indicador].indicador;
                    }
                    _aaa.appendChild(_p);
                }
                
              
                _divG=document.createElement('div');
                _divppal.appendChild(_divG);
                _divG.setAttribute('id',"chartdiv"+_datgra.id);                            
                
                if(_datgra.graficocalculado!='ok'){                        	
                	_h1.innerHTML+=' - Sin datos disponibles para ninguna fecha.';
                	continue;
                }
                
                if( _datgra.jqplot.series!= undefined){
                    if(_datgra.jqplot.seriesDefaults.renderer=='$.jqplot.BarRenderer'){
                        _datgra.jqplot.seriesDefaults.renderer=$.jqplot.BarRenderer;
                    }
                    if(_datgra.jqplot.seriesDefaults.renderer=='$.jqplot.LineRenderer'){
                        _datgra.jqplot.seriesDefaults.renderer=$.jqplot.LineRenderer;
                    }
                    
                    if(_datgra.jqplot.axes.xaxis.renderer=='$.jqplot.CategoryAxisRenderer'){
                        _datgra.jqplot.axes.xaxis.renderer=$.jqplot.CategoryAxisRenderer;
                    }
                    
                    _val=Array();
                    
                    for(_ns in _datgra.series){
                        _valores=Array();
                                    
                        for(_fech in _datgra.series[_ns]){
                            if(_datgra.series[_ns][_fech]===null){
                                _valores.push(undefined);
                            }else{
                                _valores.push(parseFloat(_datgra.series[_ns][_fech]));
                            }
                        }
                        _val.push(_valores);	
                                
                    }
                    
                    //console.log(_datgra.jqplot);
                    //console.log(_val);
                    //_val=[[1,int(),,1,1,2,2,4],[6,7,6,4,3,1,1,2,],[8,5,1,3,2,3,1,]];
                    //console.log(_val);
                    //console.log(_datgra.jqplot.axes.xaxis.ticks);
                    //_val=[[1,2,3,1,1,2,2,4],[6,7,6,4,3,1,1,2,],[8,5,1,3,2,3,1,]];
                    //_datgra.jqplot.axes.xaxis.ticks=["a","","","b","","","c",""];
                    //console.log("chartdiv"+_datgra.id);
                    
                    $.jqplot( "chartdiv"+_datgra.id, _val, _datgra.jqplot );
                }
            }            
        }
    });
}



function descargarImagen(_this){
	
	_chart=_this.parentNode.parentNode.parentNode.querySelector('.jqplot-target');
	_idgra=_this.parentNode.parentNode.parentNode.getAttribute('idgra');
	_idch=_chart.getAttribute('id');

	
	_nombre=DatosGenerales.graficos[_idgra].titulo;
	_f=new Date();    
    _filename=_nombre+'_'+_f.getFullYear()+'_'+_f.getMonth()+'_'+_f.getDate()+'.png';
    
	
	var imgData = $("#"+_idch).jqplotToImageStr({}); // given the div id of your plot, get the img data
	var imgElem = $('<img/>').attr('src',imgData);
	$('body').append(imgElem);
	//window.location.href = 'data:application/octet-stream;base64,' + imgData;
	//window.location.href = imgData.replace("image/png", "image/octet-stream");
	var imgData = $("#"+_idch).jqplotToImageStr({});
	
    
    
    var element = document.createElement('a');
    element.setAttribute('href', imgData.replace("image/png", "image/octet-stream"));
    element.setAttribute('download', _filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
}



