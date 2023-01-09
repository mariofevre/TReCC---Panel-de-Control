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


function cargaAccesos(){
	_parametros = {
        'panid': _PanelI
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
			consultaConfig();
			
			
        }
    })
}



function consultaConfig(){
	_parametros = {
        'panid': _PanelI
    };
    $.ajax({
        url:   './PAN/PAN_consulta_config.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			_Config=_res.data.config;
			
			_j=_Config['pla-nivel1'].split('/');
			_k=_Config['pla-nivel2'].split('/');
			_l=_Config['pla-nivel3'].split('/');
			
			_NomN={
				'PLAn1':_j[0],
				'PLAn2':_k[0],
				'PLAn3':_l[0]
			}
			
			_NomNs={
				'PLAn1':_j[1],
				'PLAn2':_k[1],
				'PLAn3':_l[1]
			}	
			
			if(_NomNs.PLAn1==null){_NomNs.PLAn1=_NomN.PLAn1;}
			if(_NomNs.PLAn2==null){_NomNs.PLAn1=_NomN.PLAn2;}
			if(_NomNs.PLAn3==null){_NomNs.PLAn1=_NomN.PLAn3;}
			
			consultarUsuarios();
			consultarGrupos();	    
			consultarCategorias();	
			consultarListadoIND();    //Consulta listado de indicadores para permitir vínculos de camponentes a indicadores
        }
    })
}



function cargarPlan(_actualizar_id,_actualizar_nivel,_actualizar_modo){						
    var parametros = {
        'panid': _PanId,
    	'actualizar_id':_actualizar_id,
    	'actualizar_nivel':_actualizar_nivel,
    	'actualizar_modo':_actualizar_modo
    };				
    $.ajax({
        data:  parametros,
        url:   './PLA/PLA_consulta.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
            var _res = PreprocesarRespuesta(response);
            //console.log(_res);
            
            analizarCategoriasEstandar(_res);
            
            _DataPlan=_res.data;
            
            cargarIndice();
            
        	if(_Modo=='tabla'){
        		generarFilas(_res.data);
        		return;
        	}else if(_Modo=='fichas'){
        		generarFichas();
        		return;
        	}else if(_Modo=='texto'){
        		generarTexto(_res.data);
        		return;
        	}else if(_Modo=='cronograma'){
        		generarCronograma(_res.data);
        		return;
        	}       	
        	document.querySelector('#page > #plan > #nombre > #dat').innerHTML=_res.data.PLA.general.nombre;
            document.querySelector('#page > #plan > #descripcion > #dat').innerHTML=_res.data.PLA.general.descripcion;
            document.querySelector('#encabezadopagina').innerHTML=_res.data.PLA.general.encabezado;
            
            if(document.querySelector('#page > #plan').clientHeight>=58){
            	document.querySelector('#page > #plan').setAttribute('ampliado','-1');
            }else{
            	document.querySelector('#page > #plan').setAttribute('ampliado','0');
            }
            	
        	if(_res.data.actualizar_id==''){	
        		
        	
        		             	
            	generarPlan(_res.data);
            	representarLinksPla('muestra');
            	representarLinksInd('muestra');
            	         
            }else if(
            	_res.data.actualizar_id > 0
            	&&
            	_res.data.actualizar_nivel != ''
            	&&
            	(_res.data.actualizar_modo == 'actualizar'
            	||
            	_res.data.actualizar_modo == 'insertar')
            ){
            	
            	_Actores=	_DataPlan.Actores;
            	
            	actualizarMuestraPlan();
            	 
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
       	llamarElementosIniciales();
       	
       	//document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
       	//document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').innerHTML='<option value="">- elegir -</option>';
       	/*
       	for(_nu in _DatosUsuarios.delPanelOrden){
       		_idusu = _DatosUsuarios.delPanelOrden[_nu];
       		_op=document.createElement('option');
       		_op.innerHTML=_DatosUsuarios.delPanel[_idusu].nombreusu;
       		_op.value=_idusu;
       		document.querySelector('form#seguimiento select[name="id_p_usuarios_responsable"]').appendChild(_op);
       		document.querySelector('form#accion select[name="id_p_usuarios_responsable"]').appendChild(_op.cloneNode(true));
       	}
		*/
		
		if(_DatosGrupos[0]!=undefined){
			//cargarPlan('','',''); 
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
                _DatosGrupos=_res.data.grupos;
                _DatosGruposCargado='si';
                llamarElementosIniciales();
           
		        if(_DatosUsuarios.delPanel!=undefined){
					consultarListado(); 
	  			}
            }
        }
    });
}

function consultarCategorias(){
	var parametros = {
        'panid': _PanId,
     };
	 $.ajax({
        data:  parametros,
        url:   './PLA/PLA_consulta_categorias.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
            var _res = PreprocesarRespuesta(response);
            //console.log(_res);
            
            
            _DatosCategorias=_res.data.categorias;
            _DatosCategoriasCargado='si';
           
           	cargarPlan('','','');
           	 
            _div=document.querySelector('#paquetecategorias #tiposcategorias #estandar');
            _div.innerHTML='';
            
            for(_idest in _DatosCategorias.estandar){
            	_dat=_DatosCategorias.estandar[_idest];
            	_aa=document.createElement('a');
            	_aa.innerHTML=_dat.codigo+': '+_dat.nombre;
            	_aa.setAttribute('idest',_idest);
            	_aa.setAttribute('onclick','crearCategoria(this.getAttribute("idest"),_DatosCategorias.estandar[this.getAttribute("idest")].nombre);');
            	_aa.setAttribute('onmouseover','describirEstandar(this.getAttribute("idest"))');
            	_aa.setAttribute('onmouseout','limpiarEstandar()');
            	_div.appendChild(_aa);
            }
        }
  });
        	
}




function describirEstandar(_idest){
	console.log(_idest);
	
	_dat=_DatosCategorias.estandar[_idest];

	
	_div=document.querySelector('#paquetecategorias #tiposcategorias #descripcion');
	_div.innerHTML ='<h4>'+_dat.codigo+'</h4>';
	_div.innerHTML+='<h4>'+_dat.nombre+'</h4>';
	_div.innerHTML+='<p>'+_dat.funcionamiento+'</p>';
}

function limpiarEstandar(){
	_div=document.querySelector('#paquetecategorias #tiposcategorias #descripcion');
	_div.innerHTML='';
}


