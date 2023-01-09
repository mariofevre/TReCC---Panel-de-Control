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
           	
			if(
				_Grupos[0]!=undefined
				&&
		       	Object.keys(_DataComputos).length>=0
				){		
				//consultarListado(); 
  			}  	
        }
   });
}
        
        
function consultarGrupos(){
    var parametros = {
		'panid':_PanId
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
            			
                _Grupos=_res.data.grupos;
                
		        if(
		        	_DatosUsuarios.delPanel!=undefined
		        	&&
		        	Object.keys(_DataComputos).length>=0
		        	){
					//consultarListado(); 
	  			}
            }
        }
    });
}

function consultarEstructuraXLSX(_res){
	document.querySelector('#formadjuntarxlsx [name="archivado"]').value=_res.data.archivado;
		
    var parametros = {
		'archivado':_res.data.archivado,
		'accion':'consulta',
		'panid':_PanId
    };					
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_adjunto_procesa_xlsx.php',
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
			
			_selscomp=document.querySelector('#formadjuntarxlsx .selectorcomputo');
			for (_nc in _DataComputos.computosOrden) {
				           
				_idc=_DataComputos.computosOrden;
				_cdat=_DataComputos.computos[_idc];
				_cdat.nombre
				
				_op=document.createElement('option');
				_op.value=_idc;
				_op.innerHTML=_cdat.nombre;
				_selscomp.appendChild(_op);
			}			
			_selscol=document.querySelectorAll('#formadjuntarxlsx .selectorcolumna');
			for(_ns in _selscol){
				if(typeof _selscol[_ns] != 'object'){continue;}
				_selscol[_ns].innerHTML='';
				for(_nc in _res.data.columnas){
					_op=document.createElement('option');
					_op.value=_nc;
					_op.innerHTML=_res.data.columnas[_nc];
					_selscol[_ns].appendChild(_op);
				}
			}
			document.querySelector('#formadjuntarxlsx #definiciones').setAttribute('estado','activo');
		}
    });    
}


function consultarProcesarXLSX(){

    var parametros = {
		'archivado':document.querySelector('#formadjuntarxlsx [name="archivado"]').value,
		'accion':'procesa',
		'idcomp':document.querySelector('#formadjuntarxlsx #definiciones [name="idcomp"]').value,
		'col_nivel':document.querySelector('#formadjuntarxlsx #definiciones [name="col_nivel"]').value,
		'col_numero':document.querySelector('#formadjuntarxlsx #definiciones [name="col_numero"]').value,
		'col_nom':document.querySelector('#formadjuntarxlsx #definiciones [name="col_nom"]').value,
		'col_uni':document.querySelector('#formadjuntarxlsx #definiciones [name="col_uni"]').value,
		'col_cant':document.querySelector('#formadjuntarxlsx #definiciones [name="col_cant"]').value,
		'col_prec_u':document.querySelector('#formadjuntarxlsx #definiciones [name="col_prec_u"]').value,
		'col_prec_parc':document.querySelector('#formadjuntarxlsx #definiciones [name="col_prec_parc"]').value,
		'panid':_PanId
    };					
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_adjunto_procesa_xlsx.php',
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
			
			consultarComputos();
			
			document.querySelector('#formadjuntarxlsx').setAttribute('estado','inactivo');
			document.querySelector('#formadjuntarxlsx #definiciones').setAttribute('estado','inactivo');
		}
    });    
}




function consultarComputos(){
    var parametros = {
    };			
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_consulta_computos.php',
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
            			
			_DataComputos=_res.data;
			
			_cant = Object.keys(_DataComputos.certificadosOrden).length;
			_keys = Object.keys(_DataComputos.certificadosOrden).sort(function(a, b) {
			  return a - b;
			});
			_loc = _cant-1;
			
			
			//console.log(_cant);
			//console.log(_keys);
			//console.log(_keys[_loc]);		
			_idcc=_DataComputos.certificadosOrden[_keys[_loc]];
			
			if(_loc>-1){				
				_CertificadoCargado=_DataComputos.certificados[_idcc];
				_CertificadoCargado['definido']='si';
			}else{
				_CertificadoCargado['definido']='no';				
			}
			
			if(_loc>1){
				_idca=_DataComputos.certificadosOrden[_keys[_loc-1]];
				_CertificadoCargadoAnterior=_DataComputos.certificados[_idca];
				
				_CertificadoCargadoAnterior['definido']='si';
			}else{
				_CertificadoCargadoAnterior['definido']='no';
			}
			listarComputos();
			
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

	
	
	
function crearEconomia(){
	
	_cantidavaria=document.querySelector('#formdemas [name="cantidadecon"]').value;
	_cantidavaria=_cantidavaria.replace(' ','');
	_i_pto=_cantidavaria.indexOf(".");
	_i_coma=_cantidavaria.indexOf(",");
	if(_i_pto>_i_coma){
		//decimal punto
		_cantidavaria=_cantidavaria.replace(',','');
	}else{
		//decimal coma
		_cantidavaria=_cantidavaria.replace('.','');
		_cantidavaria=_cantidavaria.replace(',','.');
	}	
	
	
	
    var parametros = {
		'sentido':'economia',
		'iditem':document.querySelector('#formecon [name="iditem"]').value,
		'id_p_CPTcomputos':document.querySelector('#formecon [name="idcomputo"]').value,
		'cantidavaria':_cantidavaria,
		'descripcion':document.querySelector('#formecon [name="descripcion"]').value,
		'id_p_CPTcertificados':document.querySelector('#formecon [name="id_p_CPTcertificados"]').value,
		'panid':_PanId
    };				
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_crear_CPTbed.php',
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
            cerrarForm("formecon");
            
            //TODO mostar economias en lista.
        }
    });			
}


function crearDemasia(){
	
	_precioparcial=document.querySelector('#formdemas [name="precioparcial"]').value;
	_precioparcial=_precioparcial.replace('$','');
	_precioparcial=_precioparcial.replace(' ','');
	_i_pto=_precioparcial.indexOf(".");
	_i_coma=_precioparcial.indexOf(",");
	if(_i_pto>_i_coma){
		//decimal punto
		_precioparcial=_precioparcial.replace(',','');
	}else{
		//decimal coma
		_precioparcial=_precioparcial.replace('.','');
		_precioparcial=_precioparcial.replace(',','.');
	}


	_preciounitario=document.querySelector('#formdemas [name="preciounitario"]').value;
	_preciounitario=_preciounitario.replace('$','');
	_preciounitario=_preciounitario.replace(' ','');
	_i_pto=_preciounitario.indexOf(".");
	_i_coma=_preciounitario.indexOf(",");
	if(_i_pto>_i_coma){
		//decimal punto
		_preciounitario=_preciounitario.replace(',','');
	}else{
		//decimal coma
		_preciounitario=_preciounitario.replace('.','');
		_preciounitario=_preciounitario.replace(',','.');
	}
	
	_cantidavaria=document.querySelector('#formdemas [name="cantidaddemas"]').value;
	_cantidavaria=_cantidavaria.replace(' ','');
	_i_pto=_cantidavaria.indexOf(".");
	_i_coma=_cantidavaria.indexOf(",");
	if(_i_pto>_i_coma){
		//decimal punto
		_cantidavaria=_cantidavaria.replace(',','');
	}else{
		//decimal coma
		_cantidavaria=_cantidavaria.replace('.','');
		_cantidavaria=_cantidavaria.replace(',','.');
	}	
	
    var parametros = {
		'sentido':'demasia',
		'iditem':document.querySelector('#formdemas [name="iditem"]').value,
		'id_p_CPTcomputos':document.querySelector('#formdemas [name="idcomputo"]').value,
		'nomitem':document.querySelector('#formdemas [name="nomitem"]').value,
		'numitem':document.querySelector('#formdemas [name="numitem"]').value,
		'unidad':document.querySelector('#formdemas [name="unidad"]').value,
		'id_p_CPTrubros_id':document.querySelector('#formdemas [name="idrubro"]').value,
		
		'precioparcial':_precioparcial,
		'preciounitario':_preciounitario,
		
		'cantidavaria':_cantidavaria,
		'descripcion':document.querySelector('#formdemas [name="descripcion"]').value,
		'id_p_CPTcertificados':document.querySelector('#formdemas [name="id_p_CPTcertificados"]').value,
		'panid':_PanId
    };				
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_crear_CPTbed.php',
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
            cerrarForm("formdemas");
            
            //TODO mostar economias en lista.
        }
    });			
}
	

function crearRubro(){
    var parametros = {
		'id_p_CPTcomputos':document.querySelector('#formrubro [name="idcomputo"]').value,
		'nomrubro':document.querySelector('#formrubro [name="nomrubro"]').value,
		'numrubro':document.querySelector('#formrubro [name="numrubro"]').value,
		'descripcion':document.querySelector('#formrubro [name="descripcion"]').value,
		'panid':_PanId
    };				
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_crear_CPTrubro.php',
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
            cerrarForm("formrubro");
            
            //TODO mostar rubros en lista.
        }
    });			
}
	
	
function consultaEditarLinkCptTar(_idi){
	var parametros = {
		'idi':_idi
    };			
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_consulta_computos_link_tareas.php',
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
            		
			_DataLinkTareas=_res.data;
			formularEditarLinkCptTar(_res.data.idi);   
			sumarIncidencias();   
        }
    });			
}

function eleminarLink(_idlink){
	
	_divfila=document.querySelector('#listadolinks [idlink="'+_idlink+'"]');	
	_iditem=document.querySelector('#formlinkcpttareas [name="idi"]').value;
			
	var parametros = {
		'iditem':_iditem,
		'idlink':_idlink,
		'panid':_PanId
    };			
    $.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_borra_computos_link_TARtareas.php',
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
            
			_divfila=document.querySelector('#listadolinks [idlink="'+_res.data.idlink+'"]');	
			_divfila.parentNode.removeChild(_divfila);
            
        }
    });			
	
}

function consultaPreliminarLink(_idi,_idt,_pi,_pt,_modo){
		
	var parametros = {
			'modo':_modo,
			'panid':_PanId
	};
	if(_idi!=undefined){parametros['iditem']=_idi;}
	if(_idt!=undefined){parametros['idtarea']=_idt;}
	if(_pi!=undefined){parametros['porc_item']=_pi;}
	if(_pt!=undefined){parametros['porc_tarea']=_pt;}
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_consulta_preliminar_computos_link_tareas.php',
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
		
			sumarFilaLinkCptTar(_res.data.nid); 
			
			if(_res.data.porc_item!=''){
				document.querySelector('#listadolinks [idlink="'+_res.data.nid+'"] [name="porc_item"]').value=_res.data.porc_item;
				document.querySelector('#listadolinks [idlink="'+_res.data.nid+'"] [name="porc_item"]').onchange();
			}
			if(_res.data.idtarea!=''){
				document.querySelector('#listadolinks [idlink="'+_res.data.nid+'"] [name="idtar"]').value=_res.data.idtarea;
				document.querySelector('#listadolinks [idlink="'+_res.data.nid+'"] [name="nombretar"]').value=_DataLinkTareas.tareas[_res.data.idtarea].codigo+'. '+_DataLinkTareas.tareas[_res.data.idtarea].nombre;
				document.querySelector('#listadolinks [idlink="'+_res.data.nid+'"] [name="nombretar"]').onchange();
            }
            
            if(_res.data.modo=='elegirtarea'){
				elegirTarea(_res.data.nid);
			}
			
			sumarIncidencias();
        }
    });				
}

function guardarLinkTarea(_idlink){	

	_divfila=document.querySelector('#listadolinks [idlink="'+_idlink+'"]');	
	_idtar=_divfila.querySelector('[name="idtar"]').value;
	_porc_tarea=_divfila.querySelector('[name="porc_tarea"]').value;
	_porc_item=_divfila.querySelector('[name="porc_item"]').value;
	_iditem=document.querySelector('#formlinkcpttareas [name="idi"]').value;
	
	var parametros = {
			'idlink':_idlink,
			'idtar':_idtar,
			'iditem':_iditem,
			'porc_tarea':_porc_tarea,
			'porc_item':_porc_item,
			'panid':_PanId	
	};
	
	if(_idtar==''){return;}
	if(!_porc_item>0){_divfila.querySelector('[name="porc_item"]').setAttribute('estado','alerta');return;
		}else if(_porc_item>100){_divfila.querySelector('[name="porc_item"]').setAttribute('estado','alerta');return;	
		}else{_divfila.querySelector('[name="porc_item"]').setAttribute('estado','ok');}
	
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_computos_link_TARtareas.php',
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
            
            _DataComputos.items[_res.data.iditem]['zz_cache_porc_link_tareas']=_res.data.zz_cache_porc_link_tareas;
            actualizarFilaListaComputo(_res.data.iditem);
            sumarIncidencias();
        }
    });		
		
}

function consultaCopiaLinks(_iditem_origen){
	_iditem_edita=document.querySelector('#formlinkcpttareas [name="idi"]').value;
	var parametros = {
		'iditem_origen':_iditem_origen,
		'iditem_edita':_iditem_edita,
		'panid':_PanId
	};
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_computos_duplicalink_TARtareas.php',
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
            
            _DataComputos.items[_res.data.iditem]['zz_cache_porc_link_tareas']=_res.data.zz_cache_porc_link_tareas;
            actualizarFilaListaComputo(_res.data.iditem);
            sumarIncidencias();
            
            cerrarForm('listadoitems');
            consultaEditarLinkCptTar(_res.data.iditem);
        }
    });	
}

function crearCertificado(_this){
	_idcomp=_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idcomp');
	var parametros = {
		'idcomp':_idcomp,
		'panid':_PanId
	};
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_crear_cert.php',
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
            
            consultarComputos();
            
        }
    });		
	
		
		
}

function cambiaAvance(_this){
	
	_iditem=_this.parentNode.parentNode.getAttribute('iditem');
	_this.setAttribute('estado','editando');
	_porcentaje=_this.value;
	_porcentaje_acc=parseFloat(_this.value)+parseFloat(document.querySelector('#tabla .item[iditem="'+_iditem+'"] #acp').innerHTML);
	
	_idcert=document.querySelector('#contenidoextenso #tabla thead #nom_cert').getAttribute('idcert');
	_idbed=_this.parentNode.parentNode.getAttribute('bed');
	
	var parametros = {
		'idcert':_idcert,
		'iditem':_iditem,		
		'idbed':_idbed,
		'porcentaje':_porcentaje,
		'porcentaje_acc':_porcentaje_acc,
		'panid':_PanId
	};
	$.ajax({
        data:  parametros,
        url:   './CPT/CPT_ed_cambia_avance_cert.php',
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
            
            if(_res.data.idcert == _CertificadoCargado.id){
				console.log('actualiza fila');
				
				
				if(_CertificadoCargadoAnterior.definido=='no'){
					
					/*_CertificadoCargadoAnterior['avancesitem'][_res.data.iditem][_res.data.idbed]={
						'porcentaje_acum':0
					};*/
					_ant_acc=0;
					
				}else{
					
					if(_CertificadoCargadoAnterior.avancesitem[_res.data.iditem][_res.data.idbed]==undefined){
						_CertificadoCargadoAnterior.avancesitem[_res.data.iditem][_res.data.idbed]={
							'porcentaje_acum':0
						};
					}
					
					_ant_acc=_CertificadoCargadoAnterior.avancesitem[_res.data.iditem][_res.data.idbed].porcentaje_acum;
				}
				
				if(_CertificadoCargado.avancesitem[_res.data.iditem][_res.data.idbed]==undefined){
					_CertificadoCargado.avancesitem[_res.data.iditem][_res.data.idbed]={
						'porcentaje_acum':0
					};
				}
					
				_CertificadoCargado.avancesitem[_res.data.iditem][_res.data.idbed].porcentaje_acum= _ant_acc + Number.parseFloat(_res.data.porcentaje);
				
				_CertificadoCargado.avancesitem[_res.data.iditem][_res.data.idbed].id=_res.data.idav;	
				//console.log(document.querySelector('tr.item[iditem="'+_res.data.iditem+'"] #ac'));
				//console.log(_CertificadoCargado.avancesitem[_res.data.iditem].porcentaje_acum);
				document.querySelector('tr[iditem="'+_res.data.iditem+'"][bed="'+_res.data.idbed+'"] #ac').innerHTML=_CertificadoCargado.avancesitem[_res.data.iditem][_res.data.idbed].porcentaje_acum;	
			}else{
				console.log('no actualiza fila');
			}
            
            
            //console.log('#contenidoextenso #tabla .item[iditem="'+_res.data.iditem+'"] [name="avan_p"]');
            document.querySelector('#contenidoextenso #tabla tr[iditem="'+_res.data.iditem+'"][bed="'+_res.data.idbed+'"] [name="avan_p"]').setAttribute('estado','guardado');
            
            document.querySelector('#contenidoextenso #tabla tr[iditem="'+_res.data.iditem+'"][bed="'+_res.data.idbed+'"] [name="avan_p"]').setAttribute('estado','guardado');
            
            
        }
    });		
	
}


function cambiarestado(){
	
	
	_idcert=document.querySelector('#contenidoextenso #tabla thead #nom_cert').getAttribute('idcert');
	
	if(_CertificadoCargado.estado=='en formulación'){
		_estado='publicado';
	}else{
		_estado='en formulación';
	}
	
	var parametros = {
		'idcert':_idcert,
		'estado':_estado,
		'panid':_PanId
	};
	$.ajax({
		data:  parametros,
		url:   './CPT/CPT_ed_cambia_estado_cert.php',
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
		

		if(_res.data.idcert == _CertificadoCargado.id){
			console.log('actualiza estado');
			
			_CertificadoCargado.estado= _res.data.estado;
			document.querySelector('#tabla #botonestado').setAttribute('estado',_res.data.estado);
			
			mostrarCertificado();// es un poco fuerte pero actualiza todas law filas para que los imputs sean o no readonly
		}else{
			console.log('no actualiza estado');
		}
	});
}
