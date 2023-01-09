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

function crearRelevamiento(){
	_parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './REL/REL_ed_crea_relevamiento.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			//consultarRelevamientoCreado(_res.data.nid);
			consultarListado();
        }
    })
}






function eliminarRel(){
	_form=document.getElementById('formrelevamiento');
	_idrel=_form.getAttribute('idrel');
	
	
	if(!confirm('¿Eliminamos este Relevamiento completo?... ¿Segure?')){return;}
	_form.style.display='none';
	_form.setAttribute('idrel','');
    
    _parametros = {
        'panid': _PanId,
        'idrel': _idrel,
    };
    
    $.ajax({
        url:   './REL/REL_ed_elim_relevamiento.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_li=document.querySelector('#listarelevamientos > a[idrel="'+_res.data.id+'"]');
			_li.parentNode.removeChild(_li);
        }
    })	
}


function enviarFormRel(){
	_form=document.getElementById('formrelevamiento');
	_idrel=_form.getAttribute('idrel');
	
	
	_form.style.display='none';
	_form.setAttribute('idrel','');
    
    _parametros = {
        'panid': _PanId,
        'idrel': _idrel,
        'nombre': _form.querySelector('[name="nombre"]').value,
        'descripcion': _form.querySelector('[name="descripcion"]').value,
        'desde': _form.querySelector('[name="desde"]').value,
        'hasta': _form.querySelector('[name="hasta"]').value
        
    };
    
    $.ajax({
        url:   './REL/REL_ed_guarda_rel.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			consultarRelEditado(_res.data.id);
        }
    });
        
}



function crearPlano(){
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit
    };
    $.ajax({
        url:   './REL/REL_ed_crea_plano.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			consultarListado();
			consultarPlanoEditado(_res.data.nid);
        }
    })
}

function enviarFormPla(){
	_form=document.getElementById('formplano');
	_idpla=_form.getAttribute('idpla');
	
	
	_form.style.display='none';
	_form.setAttribute('idpla','');
    
    
    _s = _form.querySelector('[name="modo"]');
    _m= _s.options[_s.selectedIndex].value;
    
    _parametros = {
        'panid': _PanId,
        'idpla': _idpla,
        'nombre': _form.querySelector('[name="nombre"]').value,
        'codigo': _form.querySelector('[name="codigo"]').value,
        'altura': _form.querySelector('[name="altura"]').value,
        'modo': _m
    };
    
    $.ajax({
        url:   './REL/REL_ed_guarda_plano.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			consultarPlanoEditado(_res.data.id);
        }
    });
        
}


function eliminarPla(){
	_form=document.getElementById('formplano');
	_idpla=_form.getAttribute('idpla');
	
	
	if(!confirm('¿Eliminamos este Plano?... ¿Segure?')){return;}
	_form.style.display='none';
	_form.setAttribute('idpla','');
    
    _parametros = {
        'panid': _PanId,
        'idpla': _idpla,
    };
    
    $.ajax({
        url:   './REL/REL_ed_elim_plano.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_li=document.querySelector('#activadorplanos > a[idpla="'+_res.data.id+'"]');
			_li.parentNode.removeChild(_li);
        }
    })	
}




var _nFile=0;	
var xhr=Array();
var inter=Array();
function cargarCmpPla(_this){
	
	var files = _this.files;
	if(document.querySelector('#formplano').getAttribute('idpla')<1){
		alert('error al enviar archivos');
		return;
	}				
	for (i = 0; i < files.length; i++) {
    	_nFile++;
    	console.log(files[i]);
		var parametros = new FormData();
		parametros.append('upload',files[i]);
		parametros.append('nfile',_nFile);
		
		parametros.append('idpla',document.querySelector('#formplano').getAttribute('idpla'));
		
		var _nombre=files[i].name;
		_upF=document.createElement('p');
		_upF.setAttribute('nf',_nFile);
		_upF.setAttribute('class',"archivo");
		_upF.setAttribute('size',Math.round(files[i].size/1000));
		_upF.innerHTML=files[i].name;
		document.querySelector('#listadosubiendo').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './REL/REL_ed_guarda_adjunto_plano.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);
		
		xhr[_nn].onreadystatechange = function(evt){
			//console.log(evt);
			
			if(evt.explicitOriginalTarget.readyState==4){
				var _res = $.parseJSON(evt.explicitOriginalTarget.response);
				//console.log(_res);

				if(_res.res=='exito'){							
										
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
					_file.parentNode.removeChild(_file);							
					_DataPlanos[_res.data.idpla]['FI_archivo']=_res.data.ruta;
					_DataPlanos[_res.data.idpla]['img_h']=_res.data.img_h;
					_DataPlanos[_res.data.idpla]['img_w']=_res.data.img_w;
					
					cargarPlano(_res.data.idpla);
					
				}else{
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
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

function eliminaAdjunto(_this,_event){
	_event.preventDefault();
	_event.stopPropagation();
	
	_tx=_this.parentNode.querySelector('.epigrafe').innerHTML;
	if(!confirm('¿Borramos este adjunto ('+_tx+')?.. ¿Segure?')){return;}
		
	_parametros = {
        'panid': _PanId,
        'idadj':_this.parentNode.getAttribute('idadj'),
        'idacc':document.querySelector('#formplano').getAttribute('idpla')
    };
    
    $.ajax({
        url:   './REL/REL_ed_elimina_adjunto_plano.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _ele=document.querySelector('#formplano #adjuntos .adjunto[idadj="'+_res.data.idadj+'"]');
            _ele.parentNode.removeChild(_ele);
            
            
        }
    });    
}


function crearUnidad(){
	document.querySelector('#formUnidad').setAttribute('estado','cargando');
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo
    };
    $.ajax({
        url:   './REL/REL_ed_crea_unidad.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			document.querySelector('#formUnidad').setAttribute('estado','cargando');
			editarUnidad(_res.data.nid);
        }
    })
}

function editarUnidad(_uid){
	document.querySelector('#formUnidad').setAttribute('estado','cargando');
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'uid': _uid,
    };
    $.ajax({
        url:   './REL/REL_consulta_unidad.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			document.querySelector('#formUnidad').setAttribute('estado','cargado');
			document.querySelector('#formUnidad [name="idu"]').value=_res.data.id;
			document.querySelector('#formUnidad [name="nombre"]').value=_res.data.nombre;
			document.querySelector('#formUnidad [name="descripcion"]').value=_res.data.descripcion;
			
			if(_res.data.geometria==''){
				addInteractionPolUni();				
			}
			document.querySelector('#formUnidad #geometria').value=_res.data.geometria;
			if(_res.data.geometria==''){
				document.querySelector('#formUnidad #geometria').setAttribute('estado','inactivo');
			}else{
				document.querySelector('#formUnidad #geometria').setAttribute('estado','activo');
			}
			
			

			//editarUnidad(_res.data.nid);
        }
    })
}

function enviarGeomUnidad(_geom){
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'uid': document.querySelector('#formUnidad [name="idu"]').value,
        'geom':_geom
  };
  $.ajax({
        url:   './REL/REL_ed_guarda_unidad_geometria.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'uid': _res.data.uid
		    };
		    
			
			$.ajax({
		        url:   './REL/REL_consulta_unidad.php',
		        type:  'post',
		        data: _parametros,
		        success:  function (response){
		        	_res = PreprocesarRespuesta(response);
		        	_DataPlanos[_IdPlanoActivo].unidades[_res.data.id]=_res.data;
		        	dibujarUnidades();
		        	
		        }
			});
        }
    })
}


function enviarFormUnidad(){
	document.querySelector('#formUnidad').setAttribute('estado','cerrado');
	
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'uid': document.querySelector('#formUnidad [name="idu"]').value,
        'nombre': document.querySelector('#formUnidad [name="nombre"]').value,
        'descripcion': document.querySelector('#formUnidad [name="descripcion"]').value
  	};
  
  $.ajax({
        url:   './REL/REL_ed_guarda_unidad.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'uid': _res.data.uid
		    };
		    
			
			$.ajax({
		        url:   './REL/REL_consulta_unidad.php',
		        type:  'post',
		        data: _parametros,
		        success:  function (response){
		        	_res = PreprocesarRespuesta(response);
		        	_DataPlanos[_IdPlanoActivo].unidades[_res.data.id]=_res.data;
		        	dibujarUnidades();
		        	
		        }
			});
        }
    })
}

function eliminarUnidad(){
	if(!confirm('¿Eliminamos esta unidad?... ¿Segure?')){return;};
	
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'uid': document.querySelector('#formUnidad [name="idu"]').value
  	};
  
 	$.ajax({
        url:   './REL/REL_ed_elim_unidad.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'uid': _res.data.uid
		    };
		    document.querySelector('#formUnidad').setAttribute('estado',"cerrado");
		    delete _DataPlanos[_IdPlanoActivo].unidades[_res.data.uid];
		    dibujarUnidades();
        }
    })
}

function crearLocal(){
	document.querySelector('#formLocal').setAttribute('estado','cargando');
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo
    };
    $.ajax({
        url:   './REL/REL_ed_crea_local.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			document.querySelector('#formLocal').setAttribute('estado','cargando');
			editarLocal(_res.data.nid);
        }
    })
}



function editarLocal(_idlal){
	document.querySelector('#formLocal').setAttribute('estado','cargando');
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'idlal': _idlal,
    };
    $.ajax({
        url:   './REL/REL_consulta_local.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			document.querySelector('#formLocal').setAttribute('estado','cargado');
			document.querySelector('#formLocal [name="idlal"]').value=_res.data.id;
			document.querySelector('#formLocal [name="nombre"]').value=_res.data.nombre;
			document.querySelector('#formLocal [name="descripcion"]').value=_res.data.descripcion;
			
			if(_res.data.geometria==''){
				addInteractionPolLocales();				
			}
			document.querySelector('#formLocal #geometria').value=_res.data.geometria;
			if(_res.data.geometria==''){
				document.querySelector('#formLocal #geometria').setAttribute('estado','inactivo');
			}else{
				document.querySelector('#formLocal #geometria').setAttribute('estado','activo');
			}
        }
    })
}



function enviarGeomLocal(_geom){
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'idlal': document.querySelector('#formLocal [name="idlal"]').value,
        'idul': document.querySelector('#formLocal [name="idu"]').value,
        'geom':_geom
  };
  $.ajax({
        url:   './REL/REL_ed_guarda_local_geometria.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'idlal': _res.data.idlal
		    };
		    
			
			$.ajax({
		        url:   './REL/REL_consulta_local.php',
		        type:  'post',
		        data: _parametros,
		        success:  function (response){
		        	_res = PreprocesarRespuesta(response);
		        	_DataPlanos[_IdPlanoActivo].locales[_res.data.id]=_res.data;
		        	dibujarLocales();
		        }
			});
        }
    })	
}


function enviarFormLocal(){
	document.querySelector('#formLocal').setAttribute('estado','cerrado');
	
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'idlal': document.querySelector('#formLocal [name="idlal"]').value,
        'idu': document.querySelector('#formLocal [name="idu"]').value,
        'unidad': document.querySelector('#formLocal [name="unidad"]').value,
        'nombre': document.querySelector('#formLocal [name="nombre"]').value,
        'descripcion': document.querySelector('#formLocal [name="descripcion"]').value
  	};
  
  $.ajax({
        url:   './REL/REL_ed_guarda_local.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'idlal': _res.data.idlal
		    };
		    
			
			$.ajax({
		        url:   './REL/REL_consulta_local.php',
		        type:  'post',
		        data: _parametros,
		        success:  function (response){
		        	_res = PreprocesarRespuesta(response);
		        	_DataPlanos[_IdPlanoActivo].locales[_res.data.id]=_res.data;
		        	dibujarLocales();		        	
		        }
			});
        }
    })
}

function eliminarLocal(){
	if(!confirm('¿Eliminamos esta unidad?... ¿Segure?')){return;};
	
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo,
        'idlal': document.querySelector('#formLocal [name="idlal"]').value
  	};
  
 	$.ajax({
        url:   './REL/REL_ed_elim_local.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_parametros = {
		        'panid': _PanId,
		        'idrel': _IdRelEdit,
		        'idpla': _IdPlanoActivo,
		        'idlal': _res.data.uid
		    };
		    document.querySelector('#formLocal').setAttribute('estado',"cerrado");
			delete _DataPlanos[_IdPlanoActivo].locales[_res.data.idlal];
		    dibujarLocales();		    
        }
    })
}




function crearLocaliz(){
	_parametros = {
        'panid': _PanId,
        'idrel': _IdRelEdit,
        'idpla': _IdPlanoActivo
    };
    $.ajax({
        url:   './REL/REL_ed_crea_localizacion.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			consultarLocalizacionEditada(_res.data.nid);
        }
    })
}

function listarLocalizacion(_idl){	
	_listalocalizaciones=document.querySelector('#listalocalizaciones');
	_ldat=_DataLocalizaciones[_idl];
	_div=document.createElement('a');
	_div.setAttribute('idloc',_idl);
	_div.setAttribute('class','loc');
	_div.setAttribute('onclick',"formularLocalizacion(this.getAttribute('idloc')); resaltarEnElMapa(this.getAttribute('idloc'))");	
	_listalocalizaciones.appendChild(_div);
	
	_tipo=_DataTipos[_ldat.id_p_RELtipos_id_nombre].nombre;
	
	_de=document.createElement('div');
	_de.setAttribute('class','descripcion');
	_div.appendChild(_de);
	
	_c=document.createElement('div');
	_c.setAttribute('class','criticidad '+_ldat.criticidad);
	_de.appendChild(_c);

	_c=document.createElement('span');
	_c.setAttribute('class','tipo');
	_c.innerHTML=_tipo;
	_de.appendChild(_c);
					
	_de.innerHTML+=_ldat.descripcion;
	
	_s=_ldat.fecha.split('-');
	
	_fe=document.createElement('div');
	_fe.setAttribute('class','fecha');
	_div.appendChild(_fe);
	
	_d=document.createElement('div');
	_d.setAttribute('class','dia');
	_d.innerHTML=_s[2];
	_fe.appendChild(_d);
	
	_d=document.createElement('div');
	_d.setAttribute('class','mes');
	_d.innerHTML= MesNaMesTxCorto(_s[1]);
	_fe.appendChild(_d);
	
	_d=document.createElement('div');
	_d.setAttribute('class','ano');
	_d.innerHTML=_s[0];
	_fe.appendChild(_d);
	
}


function enviarFormLoc(){
	_form=document.getElementById('formlocalizacion');
	_idloc=_form.getAttribute('idloc');
	
	
	_form.style.display='none';
	_form.setAttribute('idpla','');
    
    _s = _form.querySelector('[name="acciontipo"]');
    _at= _s.options[_s.selectedIndex].value;
    
    
    _crit='';
    _rads=document.querySelectorAll('[name="criticidad"]');
    for(_rn in _rads){
    	if(_rads[_rn].checked==true){
    		_crit=_rads[_rn].value;
    	}
    }
    
    
    _parametros = {
        'panid': _PanId,
        'idloc': _idloc,
        'id_p_RELtipos_id_nombre': _form.querySelector('[name="id_p_RELtipos_id_nombre"]').value,
        'id_p_RELtipos_id_nombre_n': _form.querySelector('[name="id_p_RELtipos_id_nombre_n"]').value,
        'descripcion': _form.querySelector('[name="descripcion"]').value,
        'observaciones': _form.querySelector('[name="observaciones"]').value,
        'criticidad': _crit,
        'diagnostico': _form.querySelector('[name="diagnostico"]').value,
        'curso': _form.querySelector('[name="curso"]').value,
        'accion': _form.querySelector('[name="accion"]').value,
        'acciontipo': _at,
        'id_p_RELacciones_id_nombre': _form.querySelector('[name="id_p_RELacciones_id_nombre"]').value,
        'locx': _form.querySelector('[name="locx"]').value,
        'locy': _form.querySelector('[name="locy"]').value,
        'id_p_RELplanos': _form.querySelector('[name="id_p_RELplanos"]').value,
        'id_p_RELtipos_id_nombre': _form.querySelector('[name="id_p_RELtipos_id_nombre"]').value,
        'fecha': _form.querySelector('[name="fecha"]').value,
        'verificado': _form.querySelector('[name="verificado"]').value,
        "local": _form.querySelector('[name="local"]').value
       
    };
    
    $.ajax({
        url:   './REL/REL_ed_guarda_loc.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			consultarLocalizacionEditada(_res.data.id);
        }
   });
        
}


function eliminarLoc(){
	_form=document.getElementById('formlocalizacion');
	_idloc=_form.getAttribute('idloc');
	
	if(!confirm('¿Eliminamos este Punto con sus datos?... ¿Segure?')){return;}
	_form.style.display='none';
	_form.setAttribute('idloc','');
    
    _parametros = {
        'panid': _PanId,
        'idloc': _idloc,
    };
    
    $.ajax({
        url:   './REL/REL_ed_elim_localizacion.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_li=document.querySelector('#listalocalizaciones > a[idloc="'+_res.data.id+'"]');
			_li.parentNode.removeChild(_li);
        }
    })	
}




