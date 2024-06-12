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
        url:   './EVA/EVA_consulta.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            console.log(_res);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
			_DataModelosInstancias=_res.data.instanciasModelo;
			_DataModelosInstanciasOrden=_res.data.instanciasModeloOrden;
			_DataInstancias=_res.data.instancias;
			_DataInstanciasOrden=_res.data.instanciasOrden;
			_DataPeriodos=_res.data.periodos;
			_DataPeriodosOrden=_res.data.periodosOrden;
			_DataParticipantes=_res.data.participantes;
			_DataParticipantesOrden=_res.data.participantesOrden;
			_DataPasos=_res.data.pasos;
			_DataPasosOrden=_res.data.pasosOrden;
			
			for(_n in _DataInstancias){
				_dat=_DataInstancias[_n];
				if(_DataInstanciasCruces[_dat.id_p_EVAinstanciaModelo]==undefined){_DataInstanciasCruces[_dat.id_p_EVAinstanciaModelo]={};}
				if(_DataInstanciasCruces[_dat.id_p_EVAinstanciaModelo][_dat.id_p_EVAparticipante]==undefined){_DataInstanciasCruces[_dat.id_p_EVAinstanciaModelo][_dat.id_p_EVAparticipante]={};}
				_DataInstanciasCruces[_dat.id_p_EVAinstanciaModelo][_dat.id_p_EVAparticipante][_dat.id_p_EVAperiodo]=_dat.id;
			}
			
			_modo=document.querySelector('#contenidoextenso').getAttribute('modo');
			
			if(_modo=='general'){
				mostrarTablaInicial();
			}else if(_modo=='participante'){
				mostrarTablaParticipante();
			}else{
				mostrarTablaInicial();
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
           	llamarElementosIniciales();//solo puede cargarse una contratacion con sus pagos sis se dispone de los datos de usuarios.
           	
           /*
						document.querySelector('form#general select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
					   
						for(_nu in _DatosUsuarios.delPanelOrden){
							_idusu = _DatosUsuarios.delPanelOrden[_nu];
							if(_DatosUsuarios.delPanel[_idusu]==undefined){continue;}
							_op=document.createElement('option');
							_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
							_op.value=_idusu;
							document.querySelector('form#general select[name="id_p_usuarios_responsable"]').appendChild(_op);
					   }
			*/
			
			if(_Grupos[0]!=undefined){
				consultarListado(); 
  			}
        }
   });
}


function consultarGrupos(){
    var parametros = {		
        'panid': _PanId
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


function crearParticipante(){	
	var parametros = {
		'panid': _PanId
    };			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_crear_participante.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            
            formularParticipante(_res.data.nid_part);
        }
    });		
}

function guardarParticipante(){	
	
	_form=document.querySelector('#form_participante');
	_form.setAttribute('activo','si');
	
	var parametros = {
		'panid':_PanelI,
		'id_part':_form.querySelector('[name="id_part"]').value,
		'nombre':_form.querySelector('[name="nombre"]').value,
		'apellido':_form.querySelector('[name="apellido"]').value,
		'numero':_form.querySelector('[name="numero"]').value	
    };
    			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_guarda_participante.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            _form=document.querySelector('#form_participante');
            _form.setAttribute('activo','no');
            consultarListado();
        }
    });		
}


function crearModeloInstancia(){	
	var parametros = {
		'panid': _PanId
    };			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_crear_modelo_instancia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            
            formularModeloInstancia(_res.data.nid_mi);
        }
    });		
}

	    	
function guardarModeloInstancia(){	
	
	_form=document.querySelector('#form_modelo_instancia');
	_form.setAttribute('activo','si');
	
	var parametros = {
		'panid':_PanelI,
		'id_minst':_form.querySelector('[name="id_minst"]').value,
		'codigo':_form.querySelector('[name="codigo"]').value,
		'nombre':_form.querySelector('[name="nombre"]').value,
		'descripcion':_form.querySelector('[name="descripcion"]').value,
		'requerido_def':_form.querySelector('[name="requerido_def"]').checked,
		'id_p_EVAperiodos':_form.querySelector('[name="id_p_EVAperiodos"]').value
    };
    			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_guarda_modelo_instancia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            _form=document.querySelector('#form_modelo_instancia');
            _form.setAttribute('activo','no');
            consultarListado();
        }
    });		
}


function crearPeriodo(){	
	var parametros = {
		'panid': _PanId
    };			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_crear_periodo.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            
            formularPeriodo(_res.data.nid_pe);
        }
    });		
}


function guardarPeriodo(){	
	
	_form=document.querySelector('#form_periodo');
	_form.setAttribute('activo','si');
	
	var parametros = {
		'panid':_PanelI,
		'id_per':_form.querySelector('[name="id_per"]').value,
		'nombre':_form.querySelector('[name="nombre"]').value,
		'ano':_form.querySelector('[name="ano"]').value,
    };
    			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_guarda_periodo.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            _form=document.querySelector('#form_periodo');
            _form.setAttribute('activo','no');
            consultarListado();
        }
    });		
}





function crearInstancia(_id_part,_id_minst,_id_per){	
	var parametros = {
		'panid': _PanId,
		'id_part':_id_part,
		'id_minst':_id_minst,
		'id_per':_id_per
    };			
    $.ajax({
        data:  parametros,
        url:   './EVA/EVA_ed_crear_instancia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            
            _DataInstancias[_res.data.nid_inst]={
				'id_p_EVAinstanciaModelo':_res.data.id_minst,
				'id_p_EVAparticipante':_res.data.id_part,
				'id_p_EVAperiodo':_res.data.id_per,
				'pasos':{}
			};
			if(_DataInstanciasCruces[_res.data.id_minst]==undefined){_DataInstanciasCruces[_res.data.id_minst]=Array();}
			if(_DataInstanciasCruces[_res.data.id_minst][_res.data.id_part]==undefined){_DataInstanciasCruces[_res.data.id_minst][_res.data.id_part]=Array();}
			_DataInstanciasCruces[_res.data.id_minst][_res.data.id_part][_res.data.id_per]=_res.data.nid_inst;
			formularInstancia(_res.data.id_part,_res.data.id_minst,_res.data.id_per);
        }
    });		
}


function guardarInstancia(){	
	
	_form=document.querySelector('#form_instancia');
	_form.setAttribute('activo','si');
	
	var _parametros = {
		'panid':_PanelI,
		'id_inst':_form.querySelector('[name="id_inst"]').value,
		'cumplido':_form.querySelector('[name="cumplido"]').value,
		'observaciones':_form.querySelector('[name="observaciones"]').value,
		'adjuntos_borrados':Array(),
		'est_alerta':Number(_form.querySelector('[name="est_alerta"]').checked),
		'pasos':{}
    };
    
    _divs_borrados=_form.querySelectorAll('#adjuntoslista > div[borrar="si"]');
    
    for(_dn in _divs_borrados){
		if(typeof _divs_borrados[_dn] != 'object'){continue;}
		_parametros['adjuntos_borrados'].push(_divs_borrados[_dn].getAttribute('id_adj'));
	}
    
    _inp_pasos_estados=_form.querySelectorAll('#listadopasos input');
    
    for(_dn in _inp_pasos_estados){
		if(typeof _inp_pasos_estados[_dn] != 'object'){continue;}
		_id_paso=_inp_pasos_estados[_dn].parentNode.getAttribute('id_paso');
	
		if(_parametros['pasos'][_id_paso]==undefined){
			_parametros['pasos'][_id_paso]={};
		}
		_parametros['pasos'][_id_paso][_inp_pasos_estados[_dn].getAttribute('name')]=_inp_pasos_estados[_dn].value;
		if(_inp_pasos_estados[_dn].getAttribute('name')=='hecho'){
			if(_parametros['pasos'][_id_paso][_inp_pasos_estados[_dn].getAttribute('name')]=_inp_pasos_estados[_dn].checked){
				_parametros['pasos'][_id_paso][_inp_pasos_estados[_dn].getAttribute('name')]=1;
			}else{
				_parametros['pasos'][_id_paso][_inp_pasos_estados[_dn].getAttribute('name')]=0;
			}
		}
	}
    
    console.log(_parametros);
    			
    $.ajax({
        data:  _parametros,
        url:   './EVA/EVA_ed_guarda_instancia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            _form=document.querySelector('#form_instancia');
            _form.setAttribute('activo','no');
            consultarListado();
        }
    });		
}


function borrarInstancia(){	
	
	_tx ='¿Borramos todo resitro de este/a participante en esta instancia?.. ¿Segure?';
	//_tx+='\n instancia id:'+document.querySelector('#formpago input[name="idpag"]').value;
	//_tx+=' | '+document.querySelector('#formpago [name="concepto"]').value;
	//_tx+=' | '+document.querySelector('#formpago [name="monto"]').value;
	//_tx+=' | '+document.querySelector('#formpago [name="nombre"]').value;
	
	if(!confirm(_tx)){return;}
	
	_form=document.querySelector('#form_instancia');
	_form.setAttribute('activo','si');
	
	var _parametros = {
		'panid':_PanelI,
		'id_inst':_form.querySelector('[name="id_inst"]').value
    };
    
    	
    			
    $.ajax({
        data:  _parametros,
        url:   './EVA/EVA_ed_borra_instancia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            _form=document.querySelector('#form_instancia');
            _form.setAttribute('activo','no');
            consultarListado();
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
