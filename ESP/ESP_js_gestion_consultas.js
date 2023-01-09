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



function cargaGrupos(){
	_parametros = {
		'panid': _PanId
	};
	$.ajax({
		url:   './PAN/PAN_grupos_consulta.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
		   _res = PreprocesarRespuesta(response);
		   _DatosGrupos=_res.data;
		   cargaBase();
		}
	})
}

function cargaBase(){
	document.querySelector('#contenidoextenso > .hijos').innerHTML='';			
	document.querySelector('#listadosubiendo').innerHTML='';
	document.querySelector('#listadoaordenar').innerHTML='';
	var _parametros = {};
	$.ajax({
		url:   'ESP/ESP_consulta_esp.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);
				
			_Items=_res.data.items;
			_Orden=_res.data.orden;
			generarItemsHTML();
			
			generarArchivosHTML();
			generarLinksHTML();
		
		}
	})	
}



function cargaAccesos(){
	_parametros = {
		'panid': _PanId
	};
	$.ajax({
		url:   './PAN/PAN_consulta_acceso.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);
			_Acc=_res.data.UsuarioAccs;
			if(_Acc[0][0]=='administrador'||_Acc[0][0]=='editor'){
				document.querySelector('#archivos #botonanadir').style.display='lnline-block';
			}
			cargaGrupos();
		}
	})
}

function cargarCmp(_this){
	
	var files = _this.files;
			
	for (i = 0; i < files.length; i++) {
		_nFile++;
		console.log(files[i]);
		var parametros = new FormData();
		parametros.append('upload',files[i]);
		parametros.append('nfile',_nFile);
		
		var _nombre=files[i].name;
		_upF=document.createElement('a');
		_upF.setAttribute('nf',_nFile);				
		_upF.setAttribute('class',"archivo");
		_upF.setAttribute('size',Math.round(files[i].size/1000));
		_upF.innerHTML=files[i].name;
		_upF.setAttribute('nombre',files[i].name);
		document.querySelector('#listadosubiendo').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './ESP/ESP_ed_guarda_archivo.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);
		
		
		xhr[_nn].onreadystatechange = function(evt){
			//console.log(evt);
			
			if(evt.explicitOriginalTarget.readyState==4){
				var _res = $.parseJSON(evt.explicitOriginalTarget.response);
				//console.log(_res);
				console.log('terminó '+_res.data.nf);
				
				if(_res.res=='exito'){							
					_file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');								
					document.querySelector('#listadoaordenar').appendChild(_file);
					
					_file.setAttribute('draggable',"true");
					_file.setAttribute('ondragstart',"dragFile(event)");
					_file.setAttribute('idfi',_res.data.nid);
					

				}else{
					_file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
					_file.innerHTML+=' ERROR';
					_file.style.color='red';
				}
				//cargaTodo();
				//limpiarcargando(_nombre);
			
			}
			
		}
		xhr[_nn].send(parametros);				
		
	}			
}
function updateProgress(evt) {
  if (evt.lengthComputable) {
	var percentComplete = 100 * evt.loaded / evt.total;		   
	this.li.style.width=Math.round(percentComplete)+"%";
  } else {
	// Unable to compute progress information since the total size is unknown
  }
}


/////////////////////////////////////////
///funciones para editar y crear items
/////////////////////////////////////////

function eliminarI(_event,_this){
	if (confirm("¿Eliminar item y sus archivos asociados? \n (los ítems anidados quedarán en la raiz)")==true){
		
		_event.preventDefault();
		
		var _this=_this;
		
		var _parametros = {
			"id": _this.parentNode.querySelector('input[name="id"]').value,
			"accion": "borrar",
			"tipo": "item"
		};
		$.ajax({
			url:   './ESP/ESP_ed_borrar_item.php',
			type:  'post',
			data: _parametros,
			success:  function (response){
				var _res = $.parseJSON(response);
					console.log(_res);
				if(_res.res=='exito'){	
					cerrar(_this);
					cargaBase();
				}else{
					alert('error asfffgh');
				}
			}
		});
		//envía los datos para editar el ítem				
	}
}
		
function guardarI(_event,_this){
	_event.preventDefault();
	_iditem=_this.querySelector('input[name="id"]').value;
	
	if(_Items[_iditem].edicion=='no'){
		alert('no dispone de permisos para modificar esta caja');
		return;
	}
	
	//console.log(_this);
	var _this=_this;
	var _parametros = {
		"id": _iditem,
		"titulo": _this.querySelector('input[name="titulo"]').value,
		"descripcion": _this.querySelector('[name="descripcion"]').value,
		"id_p_grupos_tipoa": _this.querySelector('[name="id_p_grupos_id_nombre_tipoa"]').value,
		"id_p_grupos_tipoa-n": _this.querySelector('[name="id_p_grupos_id_nombre_tipoa-n"]').value,
		"id_p_grupos_tipob": _this.querySelector('[name="id_p_grupos_id_nombre_tipob"]').value,
		"id_p_grupos_tipob-n": _this.querySelector('[name="id_p_grupos_id_nombre_tipob-n"]').value
	};
	$.ajax({
		url:   './ESP/ESP_ed_cambiar_item.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
				console.log(_res);
			if(_res.res=='exito'){	
				cerrar(_this.querySelector('#botoncierra'));
				//cargaBase();
			}else{
				alert('error asdfdasf');
			}
		}
	});
	//envía los datos para editar el ítem
	
}

function anadirItem(_iditempadre){
	
	_parametros = {
		"zz_AUTOPANEL":_PanId,
		'iditempadre':_iditempadre
	};
	$.ajax({
		url:   'ESP/ESP_ed_crear_item.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			console.log(_res);
			if(_res.res=='exito'){	
				cerrar(document.querySelector('#editoritem #botoncierra'));
				cargaBase();
			}else{
				alert('error asdfdasf');
			}
		}
	})	
}

/////////////////////////////////////////////////////
//funciones de opcines para seleccionar grupos a y b
function recargaDatosGrupos(_destino,_tipo){
	
	_destino = _destino;
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
				_grupoid=_res.data.gruposOrden[_tipo][_nn];
				_dat=_res.data.grupos[_grupoid];
				_anc=document.createElement('a');
				_anc.setAttribute('onclick','cargaOpcion(this);');
				_anc.setAttribute('regid',_grupoid);
				_anc.innerHTML=_dat.nombre;
				_anc.title=_dat.descripcion;
				_destino.appendChild(_anc);
			}
		}
	})		
}



//
//////////////////////////////////////////////////




//////////////////////////////////////////
///funciones para editar documentos	

function guardarD(_event,_this){// ajustado geogec
	_event.preventDefault();
	var _this=_this;
	
	_iddoc=_this.querySelector('input[name="id"]').value;
	if(_Items[_Docs[_iddoc].id_p_ESPitems].edicion=='no'){
		alert('no dispone de permisos para modificar los archivos de esta caja');
		return;            	
	}

	_parametros = {
		"zz_AUTOPANEL":_PanId,
		"id": _iddoc,
		"descripcion": _this.querySelector('[name="descripcion"]').value,
		"nombre": _this.querySelector('[name="nombre"]').value
	};
  
	$.ajax({
		url:   './ESP/ESP_ed_cambiar_archivo.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
					console.log(_res);
			if(_res.res=='exito'){	
					cerrar(_this.querySelector('#botoncierra'));
					cargaBase();
			}else{
					alert('error asdfdasf');
			}
		}
	});
	//envía los datos para editar el ítem
}

function descargarCont(_event,_this){
	
	_idit=_this.parentNode.getAttribute('idit');
	
	_event.preventDefault();
	
	_parametros = {
		"zz_AUTOPANEL":_PanId,
		"idit": _idit
	};
  
	$.ajax({
		url:   './ESP/ESP_consulta_descarga_item.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
				console.log(_res);
			if(_res.res=='exito'){	
				window.location.assign(_res.data.descarga);
			}else{
				alert('error asdfdasf');
			}
		}
	});   	
}


//
//////////////////////////////////////////////////



//////////////////////////////////////////
//funciones para editar documentos	

 function guardarL(_event,_this){
	_event.preventDefault();
	var _this=_this;
	
	_iddoc=_this.querySelector('input[name="id"]').value;
	if(_Items[_Docs[_iddoc].id_p_ESPitems].edicion=='no'){
		alert('no dispone de permisos para modificar los archivos de esta caja');
		return;            	
	}

	_parametros = {
		"zz_AUTOPANEL":_PanId,
		"id": _iddoc,
		"descripcion": _this.querySelector('[name="descripcion"]').value,
		"nombre": _this.querySelector('[name="nombre"]').value
	};
  
	$.ajax({
		url:   './ESP/ESP_ed_cambiar_archivo.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
					console.log(_res);
			if(_res.res=='exito'){	
					cerrar(_this.querySelector('#botoncierra'));
					cargaBase();
			}else{
					alert('error asdfdasf');
			}
		}
	});
}
//envía los datos para editar el ítem
        
//
//////////////////////////////////////////


 ///funciones para crear links
function enviarCrearLink(_event,_this){
	//Guardar Link url en la BD
	_event.preventDefault();
	
	_nFile++;
	
	var _linkName = _this.querySelector('input[name="linkName"]').value;
	var _linkdesc = _this.querySelector('textarea[name="descripcion"]').value;
	var _urlLink = _this.querySelector('input[name="linkUrl"]').value;

	if(_linkName==''){
		_linkName='-sin nombre-';
	}
	
	
	var _parametros = {
		'url':_urlLink,
		'nombre':_linkName,
		'descripcion':_linkdesc,
		'nlink':_nFile,
		'zz_AUTOPANEL':_PanId
	}
	
	_upF=document.createElement('a');
	_upF.setAttribute('nf',_nFile);
	_upF.setAttribute('class',"archivo link");
	_upF.innerHTML=_linkName;
	document.querySelector('#listadosubiendo').appendChild(_upF);

	 $.ajax({
		url:   './ESP/ESP_ed_crear_link.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			
			var _res = $.parseJSON(response);
			console.log(_res);
			if(_res.res=='exito'){			
								
				_link=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nl+'"]');								
				document.querySelector('#listadoaordenar').appendChild(_link);
				_link.setAttribute('href',_res.data.ruta);
				_link.setAttribute('target','_blank');
				_link.setAttribute('download',_link.innerHTML);
				_link.setAttribute('draggable',"true");
				_link.setAttribute('ondragstart',"dragLinkurl(event)");
				_link.setAttribute('idli',_res.data.nid);
				_aasub=document.createElement('a');
				_aasub.innerHTML='.!.';
				_aasub.setAttribute('onclick','editarLink(event,this)');
				_link.appendChild(_aasub);
				
				
				
			} else {
				_link=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nl+'"]');
				_link.innerHTML+=' ERROR';
				_link.style.color='red';
				alert('error cargarCmpLink');
			}
		}
	});
	
	cerrar(_this.querySelector('#botoncierra'));
	
}

function guardarLink(_event,_this){
	_event.preventDefault();
	alert('función en desarrollo');
}
//
////////////////////////////////////


///////////////////////////////////////
//funciones para gestionar drop en el tacho
function dropTacho(_event,_this){
	_event.stopPropagation();
	_event.preventDefault();
			   
	_tipo=JSON.parse(_event.dataTransfer.getData("text")).tipo;
	if(
		_tipo=='archivo'
		||
		_tipo=='link'
	){
		
		
		_id=JSON.parse(_event.dataTransfer.getData("text")).id;
		
		if(_tipo=='archivo'){
			
			_parametros={
				"idfi":JSON.parse(_event.dataTransfer.getData("text")).id,
				"tipo":JSON.parse(_event.dataTransfer.getData("text")).tipo,
				"accion":'borrar'
			};	
			_url='./ESP/ESP_ed_borrar_archivo.php';
			_edicion=_Items[_Docs[_id].id_p_ESPitems].edicion;
		}else if(_tipo=='link'){
			
			_parametros={
				"idli":JSON.parse(_event.dataTransfer.getData("text")).id,
				"tipo":JSON.parse(_event.dataTransfer.getData("text")).tipo,
				"accion":'borrar'
			};
			_url='./ESP/ESP_ed_borrar_link.php';
			_edicion=_Items[_Links[_id].id_p_ESPitems].edicion;
		}
		
		if(_edicion=='no'){
			alert('no dispone de permisos para modificar los '+_tipo+'s de esta caja');
			return;            	
		}
		
		if(confirm('¿Confirma que quiere eliminar el '+_tipo+' del panel?')==true){
			
			
			
			
			$.ajax({
				url:   _url,
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
						console.log(_res);
					if(_res.res=='exito'){	
						cargaBase();
					}else{
						alert('error asffsvrrfgh');
					}
				}
			});
			
		}
		return;
		
	}else if(_tipo=='item'){
		
		if(confirm('¿Confirma que quiere eliminar el Item y todo su contenido?')==true){
			return;
		}   			
		
	}
	
	var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
	console.log(_DragData);
	_el=document.querySelector('.archivo[idfi="'+_DragData+'"]');
	
	_ViejoIdIt=_el.parentNode.parentNode.getAttribute('idfi');
	_em=_el.nextSibling;
	_idit=_this.getAttribute('idit');
	_ref=document.querySelector('.item[idit="'+_idit+'"] .documentos');
	_ref.appendChild(_el);

 }
 
 
 
 	
		function drop(_event,_this){
			_event.stopPropagation();
    		_this.removeAttribute('style');
    		
    		_event.preventDefault();
    		
    		
    		if(JSON.parse(_event.dataTransfer.getData("text")).tipo=='archivo'){
				return;
			}
    		
		    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
		    //console.log('u');
		    //console.log(_event.dataTransfer.getData("text"));
		    
		    _el=document.querySelector('.item[idit="'+_DragData+'"]');
		    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idit');
		    _em=_el.previousSibling;
		    
		    
		    _evitar='no';//evita destinos erroneos por jerarquia.
		    if(_event.target.getAttribute('class')=='medio'){
		    	
		    	_tar=_event.target;
		    	
		    	_dest=_tar.parentNode;
		    					    
			    _dest.insertBefore(_el,_tar.nextSibling);
			    _dest.insertBefore(_em,_el.nextSibling);
			    
		    }else if(_event.target.getAttribute('class')=='submedio'){
		    	
		    	_tar=_event.target;
		    	
		    	_dest=_tar.parentNode.parentNode;
		    					    
			    _dest.insertBefore(_el,_tar.nextSibling);
			    _dest.insertBefore(_em,_el.nextSibling);
			    
		    }else if(_event.target.getAttribute('class')=='hijos'){
		    	_dest=_event.target;
			    _dest.appendChild(_el);
			    _dest.appendChild(_em);
		    	
		    	
		    }else{
		    	alert('destino inesperado.('+_event.target.getAttribute('class')+')');
		    	return;		    	
		    }
		    
		    _niv=_dest.parentNode.getAttribute('nivel');
		    _niv++;
		    _el.setAttribute('nivel',_niv.toString());
		    		    
		    _NuevoIdIt=_dest.parentNode.getAttribute('idit');
		    
		    _enviejo=document.querySelectorAll('[idit="'+_ViejoIdIt+'"] > .hijos > .item');
		    _serieviejo='';
		    for(_ni in _enviejo){
		    	if(typeof _enviejo[_ni]=='object'){
		    		_serieviejo+=_enviejo[_ni].getAttribute('idit')+',';
		    	}
		    }
		    
		    console.log(_NuevoIdIt);
		    _ennuevo=document.querySelectorAll('[idit="'+_NuevoIdIt+'"] > .hijos > .item');
		    _serienuevo='';
		    for(_ni in _ennuevo){
		    	console.log(_ennuevo[_ni]);
		    	if(typeof _ennuevo[_ni]=='object'){
		    		_serienuevo+=_ennuevo[_ni].getAttribute('idit')+',';
		    	}
		    }
		   
		    _parametros={
		    	"id":_DragData,
		    	"id_p_ESPitems_anidado":_NuevoIdIt,
		    	"viejoAnidado":_ViejoIdIt,
		    	"viejoAserie":_serieviejo,
		    	"nuevoAnidado":_NuevoIdIt,
		    	"nuevoAserie":_serienuevo
		    };
		    
	 		$.ajax({
				url:   './ESP/ESP_ed_anidar_item.php',
				type:  'post',
				data: _parametros,
				success:  function (response){
					var _res = $.parseJSON(response);
						console.log(_res);
					if(_res.res=='exito'){	
						cargaBase();
					}else{
						alert('error asfffgh');
					}
				}
			});
			//envía los datos para editar el ítem
		}
		
		
		
		function dropFile(_event,_this){
			_event.stopPropagation();
    		_event.preventDefault();
    		    		
    		_tipo=JSON.parse(_event.dataTransfer.getData("text")).tipo;
			if(
				_tipo!='archivo'
				&&
				_tipo!='link'
			){
				return;
			}
    		
		    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).id;
		    
		    //console.log(_DragData);
		    
		    
		    if(_tipo=='archivo'){
		    
		    	_el=document.querySelector('.archivo[idfi="'+_DragData+'"]');
		    	if(_el==null){alert('error');}
		    	
			    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idit');
			    _em=_el.nextSibling;
			    _idit=_this.getAttribute('idit');
			    _ref=document.querySelector('.item[idit="'+_idit+'"] .documentos');
			    _ref.appendChild(_el);
			    		    		    			    
			    _parametros={
			    	"id":_DragData,
			    	"id_p_ESPitems":_idit
			    };
			    
		 		$.ajax({
					url:   './ESP/ESP_ed_localizar_archivo.php',
					type:  'post',
					data: _parametros,
					success:  function (response){
						var _res = $.parseJSON(response);
							console.log(_res);
						if(_res.res=='exito'){	
							cargaBase();
						}else{
							alert('error asdfdsf');
						}
					}
				});
			    
			}else if(_tipo=='link'){
				
			  	_el=document.querySelector('.archivo[idli="'+_DragData+'"]');
			  	if(_el==null){alert('error');}
		  		
			    _ViejoIdIt=_el.parentNode.parentNode.getAttribute('idit');
			    _em=_el.nextSibling;
			    _idit=_this.getAttribute('idit');
			    _ref=document.querySelector('.item[idit="'+_idit+'"] .documentos');
			    _ref.appendChild(_el);
			    		    		    			    
			    _parametros={
			    	"id":_DragData,
			    	"id_p_ESPitems":_idit
			    };
			    
		 		$.ajax({
					url:   './ESP/ESP_ed_localizar_link.php',
					type:  'post',
					data: _parametros,
					success:  function (response){
						var _res = $.parseJSON(response);
							console.log(_res);
						if(_res.res=='exito'){	
							cargaBase();
						}else{
							alert('error asdfdsf');
						}
					}
				});
			    
			  }
		  }
