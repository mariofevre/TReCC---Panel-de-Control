/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2021 TReCC SA
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
			_Acc=_res.data.Acc;
			if(_Acc[0][0]=='administrador'||_Acc[0][0]=='editor'){
				_Habilitadoedicion='si';
			}
			consultarUsuarios();
        }
    })
}



function consultarListado(){
	
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
            console.log(_res);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _DataProveedores.proveedores=_res.data.proveedores;
            _DataProveedores.activos=_res.data.proveerdoresactivos;
            _DataContrataciones=_res.data.contrataciones;
            _DataConformidades=_res.data.conformidades;
            _DataConformidadesCargado='si';
            
            llamarElementosIniciales();//solo puede cargarse una contratacion con sus pagos si se dispone de los datos de usuarios.
           	
            _DataPagos=_res.data.pagos;
            
            mostarListado(_res)
            
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
           	llamarElementosIniciales();//solo puede cargarse una contratacion con sus pagos sis se dispone de los datos de usuarios.
           	
           	document.querySelector('form#general select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
           
           	for(_nu in _DatosUsuarios.delPanelOrden){
           		_idusu = _DatosUsuarios.delPanelOrden[_nu];
           		_op=document.createElement('option');
           		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
           		_op.value=_idusu;
           		document.querySelector('form#general select[name="id_p_usuarios_responsable"]').appendChild(_op);
           }

			
			if(_Grupos[0]!=undefined){
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
            			
                _Grupos=_res.data.grupos;
                
                
           
		        if(_DatosUsuarios.delPanel!=undefined){
					consultarListado(); 
	  			}
            }
        }
    });
}



function guardarPago(_this,event){
	_selc = document.querySelector('#formpago [name="concepto"]');
	_selt = document.querySelector('#formpago [name="fechaejecucion_tipo"]');
	_parametros = {
        'panid': _PanId,
        'idpago':document.querySelector('#formpago input[name="idpag"]').value,
        'nombre':document.querySelector('#formpago input[name="nombre"]').value,
        'monto':document.querySelector('#formpago input[name="monto"]').value,
        'concepto':_selc.options[_selc.selectedIndex].value,
		'fechaejecucion_tipo':_selt.options[_selt.selectedIndex].value,
		'fechaejecucion':document.querySelector('#formpago input[name="fechaejecucion"]').value,
		'facturado':document.querySelector('#formpago input[name="facturado"]').value,
        'num_factura':document.querySelector('#formpago input[name="num_factura"]').value
    };
    
    
    $.ajax({
        url:   './CNT/CNT_ed_pago.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _IdCnt='';_IdPag=''; //limpia la definición de items activos para que no sean cargados.
            consultarListado();
        }
    });
        	
}


function guardarContratacion(_this,event){
	
	_parametros = {
        'panid': _PanId,
        'idcnt':document.querySelector('form#general input[name="idcnt"]').value,
        'id_p_usuarios_responsable':document.querySelector('form#general select[name="id_p_usuarios_responsable"]').value,
        'id_p_CNTproveedores':document.querySelector('form#general [name="id_p_CNTproveedores"]').value,
        'nombre':document.querySelector('form#general input[name="nombre"]').value,
        'descripcion':document.querySelector('form#general [name="descripcion"]').value,
        'fecha':document.querySelector('form#general input[name="fecha"]').value,
        'fecha_tipo':document.querySelector('form#general [name="fecha_tipo"]').value,
        'fechacierre':document.querySelector('form#general input[name="fechacierre"]').value,
        'fechacierre_tipo':document.querySelector('form#general [name="fechacierre_tipo"]').value,
        'id_p_grupos_tipo_a':document.querySelector('form#general [name="id_p_grupos_tipo_a"]').value,
        'id_p_grupos_tipo_a_n':document.querySelector('form#general [name="id_p_grupos_tipo_a_n"]').value,
        'id_p_grupos_tipo_b':document.querySelector('form#general [name="id_p_grupos_tipo_b"]').value,
        'id_p_grupos_tipo_b_n':document.querySelector('form#general [name="id_p_grupos_tipo_b_n"]').value
    };
    document.querySelector('form#general').style.display='none';
    
    $.ajax({
        url:   './CNT/CNT_ed_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            
            for(_idg in _res.data.gruposcreados){
            	_Grupos[_idg]=_res.data.gruposcreados[_idg];
            }
            
            _IdCnt='';_IdPag=''; //limpia la definición de items activos para que no sean cargados.
            consultarListado();
        }
    });    
}	



function crearContratacion(){
	
	_parametros = {
        'panid': _PanId	        
   }
    $.ajax({
        url:   './CNT/CNT_ed_crear_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idcnt = _res.data.nidcnt;
            consultarListado();	                
            formularContratacion(_idcnt,event);
            
        }
    });    
}

function crearPago(_modo){
	
	_parametros={
		'panid': _PanId,
		'idcnt':document.querySelector('form#general input[name="idcnt"]').value
	};
	 $.ajax({
        url:   './CNT/CNT_ed_crear_pago.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idpag = _res.data.nidpago;
            _idcnt = _res.data.idcnt;
            
            consultarListado();	                
            formularContratacion(_idcnt,_idpag);
        }
    });    
}

function crearConformidad(){
	_parametros={
		'panid': _PanId,
		'idcnt':document.querySelector('form#general input[name="idcnt"]').value,
		'idpag':document.querySelector('#formpago input[name="idpag"]').value
	};
	$.ajax({
        url:   './CNT/CNT_ed_crear_conformidad.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idcnt = _res.data.nidcnt;
            
            consultarListado();	                
            formularContratacion(_idcnt,event);
            
        }
    });    			
}
	
function borrarContratacion(){
	
	_idcnt=document.querySelector('form#general input[name="idcnt"]').value;
	_cant=Object.keys(_DataContrataciones[_idcnt].pagos).length;
	
	_DataContrataciones[_idcnt].nombre
	
	_tx ='¿Borramos este contratacion?.. ¿Segure?';
	_tx+='\n Contratación: '+_DataContrataciones[_idcnt].nombre;
	_tx+='\n Compuesta por '+_cant+' pagos';
	
	_c=0;
	for(_idpag in _DataContrataciones[_idcnt].pagos){
		_c++;
		_tx+='\n '+_c+': '+_DataPagos[_idpag].concepto+' '+_DataPagos[_idpag].monto+' '+_DataPagos[_idpag].nombre;
	}
		
	if(!confirm(_tx)){return;}
	
	_parametros = {
        'panid': _PanId,
        'idcnt':_idcnt,
    };
    document.querySelector('form#general').style.display='none';
    
    $.ajax({
        url:   './CNT/CNT_ed_borrar_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _IdCnt='';_IdPag=''; //limpia la definición de items activos para que no sean cargados.
            consultarListado();
        }
    });    
	
}


function crearProveedor(){
	_parametros = {
        'panid': _PanId
    }
    $.ajax({
        url:   './CNT/CNT_ed_crear_proveedor_prelim.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idprov = _res.data.nidprov;
            
            console.log(_DataProveedores);
            console.log(_DataProveedores.proveedores);
            console.log(_idprov);
            _DataProveedores.proveedores[_idprov]=_res.data.dataprov;   
            formularProveedor(_idprov,event);                
        }
    });
}

function guardarProveedor(){

	_parametros = {
        'panid': _PanId,
        'idprov':document.querySelector('form#proveedor input[name="idprov"]').value,
        'nombre':document.querySelector('form#proveedor input[name="nombre"]').value,
        'descripcion':document.querySelector('form#proveedor [name="descripcion"]').value,
        'contacto':document.querySelector('form#proveedor input[name="contacto"]').value,
        'cuit':document.querySelector('form#proveedor input[name="cuit"]').value,
        'telefonos':document.querySelector('form#proveedor input[name="telefonos"]').value,
        'mail':document.querySelector('form#proveedor input[name="mail"]').value,

    };
    document.querySelector('form#proveedor').style.display='none';
    
    $.ajax({
        url:   './CNT/CNT_ed_proveedor.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            
            _idprov=_res.data.dataprov.id;
            _DataProveedores.proveedores[_idprov]=_res.data.dataprov;
            _DataProveedores.activos[_idprov]='';
            
            document.querySelector('form#general [name="id_p_CNTproveedores"]').value=_idprov;
            document.querySelector('form#general [name="id_p_CNTproveedores_n"]').value=_DataProveedores.proveedores[_idprov].nombre;
            
            
            alert('aqui programar la actualización de la lista de opciones de proveedores');
                
            }
        });   
	
}

function borrarProveedor(){
	if(!confirm('¿Borramos este proveedor?.. ¿Segure?')){return;}
	
	_parametros = {
        'panid': _PanId,
        'idprov':document.querySelector('form#proveedor input[name="idprov"]').value
    };
    document.querySelector('form#proveedor').style.display='none';
    
    $.ajax({
        url:   './CNT/CNT_ed_borrar_proveedor.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            alert('aqui programar la actualización de la lista de opciones de proveedores');
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
    _cont=document.querySelector('form#general #tipocom #listadoopcion #formLink');
    _cont.innerHTML='<span id="separador"></span>';
    document.querySelector('form#general #tipocom #busca').focus();
    _separador=_cont.querySelector('#separador');
    for(_nc in _res.data.comunicacionesOrden){
		_idc=_res.data.comunicacionesOrden[_nc];
   		_cdat=_res.data.comunicaciones[_idc];
   		
        _mod=document.createElement('input');
        _mod.setAttribute('type','button');;
        _mod.setAttribute('onclick','crearLinkCOM(this)');
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
        
        
        _cont.appendChild(_mod);	
       		
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

function crearLinkCOM(_this){
	_parametros = {
        'panid': _PanId,
        'idcom': _this.getAttribute('regid'),
        'idcnt': document.querySelector('form#general input[name="idcnt"]').value,
    };
    
    $.ajax({
        url:   './CNT/CNT_linkear_cnt_COMcomunicaciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularContratacionVinculosCom(document.querySelector('form#general input[name="idcnt"]').value,'');
        }
    });  
}

function borrarLinkCOM(_this){
	_parametros = {
        'panid': _PanId,
        'idcom': _this.getAttribute('regid'),
        'idcnt': document.querySelector('form#general input[name="idcnt"]').value,
    };
    
    $.ajax({
        url:   './CNT/CNT_delinkear_cnt_COMcomunicaciones.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return;}
            
            formularContratacionVinculosCom(document.querySelector('form#general input[name="idcnt"]').value,'');
        }
    }); 
}


function formularContratacionVinculosCom(_idcnt,_event){
			
	
	if(typeof _event == 'object'){
		_event.stopPropagation();
	}
	_parametros = {
        'panid': _PanId,
        'idcnt': _idcnt,
        'idpag': ''
    };
    
    $.ajax({
        url:   './CNT/CNT_consulta_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _datacnt=_res.data;
            mostrarFormularioCntVinculosCom(_datacnt);
        }
    });    
}










function cargarVincularSegs(){	
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
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            procesarListaditoSeg(_res);
            //identificarEnListaditoPertenenciasAGrupos(_listaditoSolG.ga,_listaditoSolG.gb);
        }
    }); 
}


function procesarListaditoSeg(_res){
	
    _cont=document.querySelector('form#general #tiposeg #listadoopcion #formLink');
    _cont.innerHTML='<span id="separador"></span>';
    document.querySelector('form#general #tiposeg #busca').focus();
    _separador=_cont.querySelector('#separador');
   
    for(_nc in _res.data.seguimientos){
		_sdat=_res.data.seguimientos[_nc];
		
		_sdiv=document.createElement('div');
		_sdiv.setAttribute('class','listadoseguimento')
		_h3=document.createElement('h3');
		_h3.innerHTML='('+_sdat.id+') '+_sdat.nombre;
		_sdiv.appendChild(_h3);
		
		_li=document.createElement('div');
		_sdiv.appendChild(_li);
		
		
		for(_na in _sdat.acciones){
			_adat=_sdat.acciones[_na];
	        _mod=document.createElement('input');
	        _mod.setAttribute('type','button');
	        _mod.setAttribute('onclick','crearLinkSeg(this)');
	        _mod.setAttribute('class','SEGaccion');
	        _mod.setAttribute('title','');
	        _mod.setAttribute('regid',_adat.id);
	        _mod.setAttribute('gaid',_adat.id_p_grupos_tipo_a);
	        _mod.setAttribute('gbid',_adat.id_p_grupos_tipo_b);
	        _mod.setAttribute('estado',_adat.estado);
	        _mod.setAttribute('pnom',_adat.nombre);
       		_mod.setAttribute('value',_adat.nombre+' - '+_adat.estado);
       		_li.appendChild(_mod);
        }
        
        if(
        	_sdat.id_p_grupos_tipo_a==document.querySelector('form#general [name="id_p_grupos_tipo_a"]').value
        	&&
        	_sdat.id_p_grupos_tipo_b==document.querySelector('form#general [name="id_p_grupos_tipo_b"]').value
        ){
        	_cont.appendChild(_sdiv);	
        }else{
            _cont.insertBefore(_sdiv,_separador);  
        }		
    }
}

function crearLinkSeg(_this){
	_parametros = {
        'panid': _PanId,
        'idacc': _this.getAttribute('regid'),
        'idcnt': document.querySelector('form#general input[name="idcnt"]').value
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
            
            formularContratacionVinculosSeg(document.querySelector('form#general input[name="idcnt"]').value,'');
        }
    });  
}


function borrarLinkSEG(_this){
	_parametros = {
        'panid': _PanId,
        'idcnt': document.querySelector('form#general input[name="idcnt"]').value,
        'idacc': _this.getAttribute('regid'),
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
            
            formularContratacionVinculosSeg(document.querySelector('form#general input[name="idcnt"]').value,'');         
        }
    }); 
}


function formularContratacionVinculosSeg(_idcnt,_event){
			
	
	if(typeof _event == 'object'){
		_event.stopPropagation();
	}
	_parametros = {
        'panid': _PanId,
        'idcnt': _idcnt,
        'idpag': ''
    };
    
    $.ajax({
        url:   './CNT/CNT_consulta_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _datacnt=_res.data;
            mostrarFormularioCntVinculosSeg(_datacnt);
        }
    });    
}


function borrarPago(){
	
	_tx ='¿Borramos este pago?.. ¿Segure?';
	_tx+='\n instancia id:'+document.querySelector('#formpago input[name="idpag"]').value;
	_tx+=' | '+document.querySelector('#formpago [name="concepto"]').value;
	_tx+=' | '+document.querySelector('#formpago [name="monto"]').value;
	_tx+=' | '+document.querySelector('#formpago [name="nombre"]').value;
	
	if(!confirm(_tx)){return;}
	
	_idcnt=document.querySelector('form#general input[name="idcnt"]').value;
	
	
	
	if(Object.keys(_DataContrataciones[_idcnt].pagos).length<2){
		alert('Toda contratación debe tener al menos una instancia de pago asociada. \n Acción suspendida.');
	}
	
	_parametros = {
        'panid': _PanId,
        'idpag':document.querySelector('#formpago input[name="idpag"]').value,
        'idcnt':_idcnt
    };
    document.querySelector('form#proveedor').style.display='none';
    
    $.ajax({
        url:   './CNT/CNT_ed_borrar_pago.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
        	
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _idcnt=_res.data.idcnt;
        	_idpag=_res.data.idpag;
        	
        	delete _DataContrataciones[_idcnt].pagos[_idpag];
        	delete _DataPagos[_idpag];
        	for(_idp in _DataContrataciones[_idcnt].pagos){
        		formularPago(_idp);
        		break;
        	}
        	
        	_fi=document.querySelector('#contenidoextenso .fila.pago[idpag="'+_idpag+'"]');
        	_fi.parentNode.removeChild(_fi);
        	
        	console.log('form#general #formotrospago .pago[idpag="'+_idpag+'"]');
        	_fi=document.querySelector('form#general #formotrospago .pago[idpag="'+_idpag+'"]');
        	_fi.parentNode.removeChild(_fi);
        }
    });    
}
