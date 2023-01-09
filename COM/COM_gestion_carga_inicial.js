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




function consultarConfig(){				
    var parametros = {
            "panid" : _PanelI,
    };

    //Llamamos a los puntos de la actividad
    $.ajax({
        data:  parametros,
        url:   './COM/COM_consulta_config.php',
        type:  'post',
        success:  function (response){
            _res = PreprocesarRespuesta(response);
            _Config=_res.data.config;
            _DataPreferencias=_res.data.pref;
            
            document.querySelector('#form_com .paquete.identificacion option[sentido="saliente"]').innerHTML=_Config['com-sale'];
			document.querySelector('#form_com .paquete.identificacion option[sentido="entrante"]').innerHTML=_Config['com-entra'];
			document.querySelector('#form_com [innerhtml_config="com-ident"]').innerHTML=_Config['com-ident'];
			document.querySelector('#form_com [innerhtml_config="com-identdos"]').innerHTML=_Config['com-identdos'];	
			document.querySelector('#form_com [innerhtml_config="com-identtres"]').innerHTML=_Config['com-identtres'];	


            cargarFiltro();            
        }
    });
}

function cargarFiltro(){
    var parametros = {
    	'comunicaciones':'',
    	"panid" : _PanelI,
    };			
    $.ajax({
        data:  parametros,
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            
           	
            var _estadodecarga='activo';	
		    window.scrollTo(0, 0);
		    
            
            var _res = $.parseJSON(response);
            //console.log(_res);
            
            
            if(_DataPreferencias.COMfsentido!=undefined){ 	
	            _ops=document.querySelectorAll('[pref="COMfsentido"]');
	            for(_on in _ops){
	            	if(typeof _ops[_on] != 'object'){continue;}
	            	if(_ops[_on].value==_DataPreferencias.COMfsentido){
	            		_ops[_on].cheked=true;
	            		_ops[_on].setAttribute('checked','checked');
	            		//console.log(_ops[_on]);
	            	}else{
	            		_ops[_on].removeAttribute('checked');
	            	}
            	}
            }
             
            if(_DataPreferencias.COMfabiertas!=undefined){ 	
	            _ops=document.querySelectorAll('[pref="COMfabiertas"]');
	            for(_on in _ops){
	            	if(typeof _ops[_on] != 'object'){continue;}
	            	if(_ops[_on].value==_DataPreferencias.COMfabiertas){
	            		_ops[_on].cheked=true;
	            		_ops[_on].setAttribute('checked','checked');
	            		//console.log(_ops[_on]);
	            	}else{
	            		_ops[_on].removeAttribute('checked');
	            	}
            	}
            }  
            
            if(_DataPreferencias.COMforden!=undefined){ 	
	            _ops=document.querySelectorAll('[pref="COMforden"] option');
	            for(_on in _ops){
	            	if(typeof _ops[_on] != 'object'){continue;}
	            	if(_ops[_on].value==_DataPreferencias.COMforden){
	            		_ops[_on].checked=true;
	            		_ops[_on].setAttribute('checked','checked');
	            		_ops[_on].setAttribute('selected','selected');
	            		//console.log(_ops[_on]);
	            	}else{
	            		_ops[_on].removeAttribute('checked');
	            	}
            	}
            } 
            
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            
            if(_res.res=='exito'){		
                _Grupos=_res.data;
                                
                if(Object.keys(_res.data.gruposUsadosA).length<5){                                             
                    
                    _ll=document.createElement('label');
                    _ll.setAttribute('class','corto');
                    document.getElementById('filtroga').appendChild(_ll);
                    
                    _inT=document.createElement('input');
                    _inT.setAttribute('type','radio');
                   // _inT.setAttribute('onclick','filtrarFilas();guaradapref(this);');
                    _inT.setAttribute('name','grupoa');
                    _inT.setAttribute('pref','COMfgrupoa');                    
                    _inT.setAttribute('value','todas');
                    if(_DataPreferencias.COMfgrupoa!=undefined){
                    	if(_DataPreferencias.COMfgrupoa=='todas'||_DataPreferencias.COMfgrupoa===''){
                    		_inT.setAttribute('checked','checked');
                    	}
                    }else{
                    	_inT.setAttribute('checked','checked');	                    	
                    }
                    
                    _ll.appendChild(_inT);
                    
                    _sp=document.createElement('span');
                    _sp.setAttribute('onclick','toogle(this);filtrarFilas();guaradapref(this);');
                    _sp.innerHTML='todo';
                    _ll.appendChild(_sp);  
                        
                    for(_gid in _res.data.gruposUsadosA){
                        //if(typeof _res.data.gruposUsadosA[_no] != 'object'){continue;}
                        _gdat=_res.data.grupos[_gid];
                        //console.log(_gid);
                        //console.log(_gdat);
                        _ll=document.createElement('label');
                        _ll.setAttribute('class','corto');
                        document.getElementById('filtroga').appendChild(_ll);
                        
                        _in=document.createElement('input');
                        _in.setAttribute('type','radio');
                        if(_gdat.id==undefined){
                        	_in.value=0;	
                        }else{
                        	_in.value=_gdat.id;
                        }
                        _in.setAttribute('name','grupoa');
                   	 	_in.setAttribute('pref','COMfgrupoa');
                        
                        if(_DataPreferencias.COMfgrupoa!=undefined){
	                    	if(_DataPreferencias.COMfgrupoa==_in.value){
	                    		_in.setAttribute('checked','checked');
	                    	}
	                    }
                        
                        _ll.appendChild(_in);
                        
                        //console.log(_gid);
                        //console.log(_gdat);
                        _sp=document.createElement('span');
                        _sp.setAttribute('onclick','toogle(this);filtrarFilas();guaradapref(this);');
                        _sp.innerHTML=_gdat.nombre.substring(0, 4)+" "+_gdat.nombre.substring(4,4);
                        
                        _ll.appendChild(_sp);       
                        
                        if(_filtro.grupoa==_gdat.id){
                            _in.setAttribute('checked','checked');
                            _inT.removeAttribute('checked');
                        }
                    }
                    
                }else{
                
                    _ss=document.createElement('select');
                    _ss.setAttribute('name','grupoa');
                    _ss.setAttribute('pref','COMfgrupoa');
                    _ss.setAttribute('onchange','filtrarFilas();guaradapref(this);');
                    document.getElementById('filtroga').appendChild(_ss);
                    
                    _opT=document.createElement('option');
                    _opT.value='todas';
                    _opT.setAttribute('checked','checked');
                    _opT.innerHTML='todo';
                    _ss.appendChild(_opT);
                                                                            
                    for(_gid in _res.data.gruposUsadosA){
                        // if(typeof _res.data.gruposUsadosA[_no] != 'object'){continue;}
                        
                        _gdat=_res.data.grupos[_gid];
                        //console.log(_gdat);
                        
                        _op=document.createElement('option');
                        _op.value=_gdat.id;
                        if(_DataPreferencias.COMfgrupoa!=undefined){
	                    	if(_DataPreferencias.COMfgrupoa==_op.value){
	                    		_op.setAttribute('checked','checked');
	                    		_op.setAttribute('selected','selected');
	                    	}
	                    }
                        _op.innerHTML=_gdat.nombre;                        
                        _ss.appendChild(_op);
                    }                                    
                }


                if(Object.keys(_res.data.gruposUsadosB).length<5){                                             
                    
                    _ll=document.createElement('label');
                    _ll.setAttribute('class','corto');
                    document.getElementById('filtrogb').appendChild(_ll);
                    
                    _inT=document.createElement('input');
                    _inT.setAttribute('type','radio');
                   // _inT.setAttribute('onclick','filtrarFilas();');
                    _inT.setAttribute('name','grupob');
                    _inT.setAttribute('pref','COMfgrupob');
                    _inT.setAttribute('value','todas');
                    if(_DataPreferencias.COMfgrupob!=undefined){
                    	if(_DataPreferencias.COMfgrupob=='todas'||_DataPreferencias.COMfgrupob===''){
                    		_inT.setAttribute('checked','checked');
                    	}
                    }else{
                    	_inT.setAttribute('checked','checked');	                    	
                    }
                    _ll.appendChild(_inT);
                    
                    _sp=document.createElement('span');
                    _sp.setAttribute('onclick','toogle(this);filtrarFilas();guaradapref(this);');
                    _sp.innerHTML='todo';
                    _ll.appendChild(_sp); 
                        
                    for(_gid in _res.data.gruposUsadosB){
                        //if(typeof _res.data.gruposUsadosB[_no] != 'object'){continue;}
                        
                        _gdat=_res.data.grupos[_gid];
                        //console.log(_gdat);
                        _ll=document.createElement('label');
                        _ll.setAttribute('class','corto');
                        document.getElementById('filtrogb').appendChild(_ll);
                        
                        _in=document.createElement('input');
                        _in.setAttribute('type','radio');
                        if(_gdat.id==undefined){
                        	_in.value=0;	
                        }else{
                        	_in.value=_gdat.id;
                        }
                        _in.setAttribute('name','grupob');
                        _in.setAttribute('pref','COMfgrupob');
                        if(_DataPreferencias.COMfgrupob!=undefined){
	                    	if(_DataPreferencias.COMfgrupob==_in.value){
	                    		_in.setAttribute('checked','checked');
	                    	}
	                    }
	                    
                        _ll.appendChild(_in);
                        
                        _sp=document.createElement('span');
                        _sp.setAttribute('onclick','toogle(this);filtrarFilas();guaradapref(this);');
                        _sp.innerHTML=_gdat.nombre.substring(0, 4)+" "+_gdat.nombre.substring(4,4);                                
                        _ll.appendChild(_sp);    
                        
                        if(_filtro.grupob==_gdat.id){
                            _in.setAttribute('checked','checked');
                            _inT.removeAttribute('checked');
                        }
                    }
                    
                }else{
                
                    _ss=document.createElement('select');
                    _ss.setAttribute('onchange','filtrarFilas();guaradapref(this);');
                    _ss.setAttribute('name','grupob');
                    _ss.setAttribute('pref','COMfgrupob');
                    document.getElementById('filtrogb').appendChild(_ss);
                    
                    _opT=document.createElement('option');
                    _opT.value='todas';
                    _opT.setAttribute('checked','checked');
                    _opT.innerHTML='todo';
                    _ss.appendChild(_opT);
                                                                            
                    for(_gid in _res.data.gruposUsadosB){
                        //if(typeof _res.data.gruposUsadosB[_no] != 'object'){continue;}
                        
                        _gdat=_res.data.grupos[_gid];
                        //console.log(_gdat);
                        
                        _op=document.createElement('option');
                        _op.value=_gdat.id;
                        _op.innerHTML=_gdat.nombre;
                        _ss.appendChild(_op);
                        
                        if(_DataPreferencias.COMfgrupob!=undefined){
	                    	if(_DataPreferencias.COMfgrupob==_op.value){
	                    		_op.setAttribute('checked','checked');
	                    		_op.setAttribute('selected','selected');
	                    	}
	                    }   
                    }                                                    
                }
            }
            
            _form = document.querySelector('#formfiltro');
		    _filtro.busqueda=_form.querySelector('input[name="busqueda"]').value;
		   
		    
		    if(_form.querySelector('input[name="sentido"]:checked')==null){
		    	_form.querySelector('input[name="sentido"]').checked=true;
		    	_form.querySelector('input[name="sentido"]').setAttribute('checked','checked');
		    }
		    _filtro.sentido =_form.querySelector('input[name="sentido"]:checked').value;
		    
		    if(_form.querySelector('input[name="abiertas"]:checked')==null){
		    	_form.querySelector('input[name="abiertas"]').checked=true;
		    	_form.querySelector('input[name="abiertas"]').setAttribute('checked','checked');
		    }      
		    _filtro.abiertas=_form.querySelector('input[name="abiertas"]:checked').value;
		    
		    if(_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked')!=null){
		    	_filtro.grupoa  =_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked').value;
		    }
		    		
		    if(_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked')!=null){
		    	_filtro.grupob  =_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked').value;
		    }
		    _filtro.orden   =_form.querySelector('select[name="orden"] option:checked').value;
		    cargarFilas();    
        }
    });
}




function cargarFilas(){

    document.querySelector('#contenidoextenso #comunicaciones').innerHTML='';
    _estadodecarga='cargando';			
    var parametros = {
		"panid" : _PanelI,
        "avance" : 'inicial',
        "BUSQUEDA" : _filtro.busqueda,				
        "SENTIDO" : _filtro.sentido,
        "CERRADAS" : _filtro.abiertas,
        "GRUPOA" : _filtro.grupoa,
        "GRUPOB" : _filtro.grupob,
        "orden" : _filtro.orden,
        "DESDE" : '',
        "HASTA" : ''
    };
    document.querySelector('#cargandoinicial').style.display='inline-block';
    $.ajax({
        data:  parametros,
        url:   './COM/COM_consulta_comunicaciones_listado.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
        	
			var _res = PreprocesarRespuesta(response);
            //procesarRespuestaDescripcion(response, _destino);
            /*
            try {
                JSON.parse(response);
            }catch(_err){
                console.log(_err);
                alert('el servidor entregó un texto de formato inesperado');
                return;
            }
            
            var _res = $.parseJSON(response);
            console.log(_res);
            
             for(_nm in _res.mg){alert(_res.mg[_nm]);}
            
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }
            
            */
           
            _estadodecarga='activo';
            
            
           
            
            if(_res.res!='exito'){return;}
        	
        	if(_res.data.regs.length==0){invocarAyuda();}
        	
            for(i=0;i<_res.data.regs.length;i++){
                _ComunicacionesCargadas[_res.data.regs[i].id]=_res.data.regs[i];
                _ComunicacionesOrden=_res.data.comOrdenes;
                //console.log(_res.data.regs[i].id);
                generarFila(_res.data.regs[i],'carga');
            }
            if(_res.data.avance!='total'){
                continuarcarga(_res.data.avanceCod);
            }else{
            	document.querySelector('#cargandoinicial').style.display='none';
            }
        	
            filtrarFilas();
        }
    });
}

function cargarUnaFila(_id){						
    var parametros = {
        "id" : _id,
        "panid" : _PanelI
    };			
    $.ajax({
        data:  parametros,
        url:   './COM/COM_consulta_fila.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            try{
                _res = $.parseJSON(response);
            }catch(e){
                console.log(e);
                alert(e);
                return;
            }
            
            var _res = $.parseJSON(response);
            console.log(_res);
            _estadodecarga='activo';
            
            _ComunicacionesCargadas[_res.data.comunicacion.id]=_res.data.comunicacion;
            
            _ComunicacionesOrden=_res.data.comOrdenes;
            
            if(_res.res=='exito'){
                generarFila(_res.data.comunicacion,'nuevo');
            }
        }
    });
}
function actualizarUnaFila(_id){						
    var parametros = {
        "id" : _id,
        "panid" : _PanelI
    };			
    _cargandofila=document.createElement('div');
    _cargandofila.setAttribute('class','cargando');
    _fila=document.querySelector('#comunicaciones #fnc'+_id);
    if(_fila!=undefined){
    	_fila.appendChild(_cargandofila);
    }
    _cargandofila.setAttribute('class','cargando');
    
    $.ajax({
        data:  parametros,
        url:   './COM/COM_consulta_fila.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
            try{
                _res = $.parseJSON(response);
            }catch(e){
                console.log(e);
                alert(e);
                return;
            }
            //procesarRespuestaDescripcion(response, _destino);
            var _res = $.parseJSON(response);
            console.log(_res);
            _estadodecarga='activo';
            if(_res.res=='exito'){	
            	_ComunicacionesCargadas[_res.data.comunicacion.id]=_res.data.comunicacion;
            	_ComunicacionesOrden=_res.data.comOrdenes;	
                generarFila(_res.data.comunicacion,'actualiza');
            }
        }
    });
}

            
function continuarcarga(_cod){		
    //var _avance=_cargado.avance;
    //console.log(_estadodecarga);
    _avanceCod=_cod;		
    _parametros = {
        "codigo" : _avanceCod,
        'algo' : 'prueba',
        "panid" : _PanelI
    };

    $.ajax({
        data:  _parametros,
        url:   './COM/COM_consulta_comunicaciones_listado_reconsulta.php',
        type:  'post',
        error: function (response){alert('error al contactar al servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            try {
                JSON.parse(response);
            }catch(_err){
                console.log(_err);
                alert('el servidor entregó un texto de formato inesperado');
                return;
            }
            
            var _res = $.parseJSON(response);
            //console.log(_res);
            if(_res.res=='exito'){
                //console.log(_res.data.regs.length);
                //console.log(_estadodecarga);
                if(_res===null){
                    _estadodecarga='terminado';
                }else{
                	
                    _estadodecarga='activo';
                    for(i=0;i<_res.data.regs.length;i++){
                    	_ComunicacionesCargadas[_res.data.regs[i].id]=_res.data.regs[i];
                        generarFila(_res.data.regs[i],'carga');
                    }
    
                    if(_res.data.avance=='terminado'||_res.data.regs.length==0){
                        _estadodecarga='terminado';
                        
                        document.querySelector('#cargandoinicial').style.display='none';
                        filtrarFilas();
                        return;
                    }else{
                    	
                    	_pend=parseInt(_res.data.avance.replace('pend: ',''));
                    	_cargadas=Object.keys(_ComunicacionesCargadas).length;
                    	_porc=_cargadas*100/(_cargadas+_pend);
                    	document.querySelector('#cargandoinicial #avance').innerHTML=Math.round(_porc)+' %';
                    }
                        
                    if(_res.data.avance!='terminado'){
                        continuarcarga(_res.data.avanceCod);
                    } 
                }
                filtrarFilas();
            }
        }
    });
}

window.onscroll = function(ev){
    //console.log(_estadodecarga);
    if(_estadodecarga=='activo'){
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-600)) {
            _pag=document.getElementById('page');
            _altura=_pag.clientHeight;
            _altura=_altura+600;
            _pag.style.minHeight=_altura+'px';		    	
            _estadodecarga='cargando';
            console.log(_estadodecarga + ': ' + window.innerHeight + ' ' + window.scrollY + ' ' + document.body.offsetHeight);
            continuarcarga(_avanceCod);
        }
    }
}		

function quitarFila(_id){
    _cont=document.querySelector('#contenidoextenso #comunicaciones');
    _ref=document.querySelector('#contenidoextenso #comunicaciones .fila#fnc'+_id);
    _cont.removeChild(_ref);
}





function guaradapref(_this){
	
	if(_this.tagName=='SPAN'){
		_variable=_this.parentNode.querySelector('input').getAttribute('pref');
		_valor=_this.parentNode.querySelector('input').value;
	}else if(_this.tagName=='SELECT'){
		_variable=_this.getAttribute('pref');
		_valor=_this.value;
	}else{
		return;
	}
	
	 var _parametros = {
    	'panid':_PanelI,
    	'variable':_variable,
    	'valor':_valor
    };			
    
    $.ajax({
        data:  _parametros,
        url:   './PAN/PAN_ed_guarda_preferencia.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            
        }
    });
}



var _NroOrden=0;



var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Sepiembre','Ocubret','Noiembrev','Diciembre'];

function generarFila(_reg,_modo){	
    //modo puede ser carga, nuevo o actualiza
    //nuevo, genera una fila arriba de todo
    //carga genera una fila abajode todo
    //actualiza genera la fila reemplazando la existente co nel mismo id
    if(_modo==undefined){_modo='carga';}			
    //console.log('cargando fila' + _reg.id + ' en modo: '+_modo);
    _NroOrden=_NroOrden+1;
    _modF=document.getElementById("fcnModelo").cloneNode(true);
    _cont=document.querySelector('#contenidoextenso #comunicaciones');
    //_cont.appendChild(_modF);
    _modF.setAttribute('id','fnc'+_reg.id);
    
    _modF.setAttribute('deconexion',_reg.zz_cont_por_con);
    
    if(_reg.zz_contenido_conec_validado_id_p_usu>0){
    	_modF.setAttribute('convalidada','1');
    }else{
    	_modF.setAttribute('convalidada','0');
    }
    
    if(_reg.zz_conec_id_p_comunicacion>0){
    	_a=document.createElement('div');
    	_a.setAttribute('class','link');
    	
    	_modF.querySelector('#gestion').appendChild(_a);
    	if(_reg.zz_contenido_conec_validado_id_p_usu>0){
    		_a.title='esta comunicacion se encuentra convalidada por el usuario:';
    		
    		  var _f = new Date(_reg.zz_contenido_conec_validado_fechaunix * 1000);			  
    		_a.title+='\n'+ _reg.usuario_valida+' el día: '+_f.getDate()+' de '+months[_f.getMonth()]+' de '+_f.getFullYear()+'. '+_f.getHours()+':'+_f.getMinutes()+':'+_f.getSeconds();
    		_a.innerHTML='<img src="./img/linkeado_si.png">';
    		
    	}else{
    		_a.title='esta comunicacion no se encuentra convalidada';
    		_a.innerHTML='<img src="./img/linkeado_no.png">';
    		
    	}
    	 
    }
    
    if(_reg.idga==undefined){
    	_reg.idga=_reg.id_p_grupos_id_nombre_tipoa;
    }
    if(_reg.idga==undefined){_reg.idga='0';}
    if(_reg.idga==''){_reg.idga='0';}
    
    if(_reg.idgb==undefined){
    	_reg.idgb=_reg.id_p_grupos_id_nombre_tipob;
    }
    if(_reg.idgb==undefined){_reg.idgb='0';}
    if(_reg.idgb==''){_reg.idgb='0';}
    
    _modF.setAttribute('gaid',_reg.idga);
    _modF.setAttribute('gbid',_reg.idgb);
    _modF.setAttribute('regId',_reg.id);
    _modF.setAttribute('norden',_NroOrden);
    _modF.setAttribute('fecha',_reg.emision);
    _modF.setAttribute('estado',_reg.estado);
    _modF.setAttribute('sentido',_reg.sentido);
    _modF.setAttribute('pnom',_reg.falsonombre);

	_modF.setAttribute('largo',_reg.largo);
	if(_reg.largo>50000){
		_modF.setAttribute('alerta','largo');
		_modF.title+='Esta comunicación tiene un texto muy largo, verificar si contiene codigo basura';
		_modF.querySelector('#nom').title+='Esta comunicación tiene un texto muy largo, verificar si contiene codigo basura';
	}
	
    if(_reg.hfila>0){
        //_modF.setAttribute('style','height:'+_reg.hfila+'px;');
    }

    for(_idorig in _reg.origenes){					
        _modOrig=document.getElementById('modLink').cloneNode(true);
        _modOrig.removeAttribute('id');
        _modOrig.setAttribute('regId',_idorig);
        _modOrig.setAttribute('linkId',_reg.origenes[_idorig].linkid);
        _modOrig.childNodes[0].setAttribute('name','refOrig');
        //_modOrig.childNodes[0].setAttribute('href','#fnc'+_idorig);					
        //console.log(_idorig);
        _modOrig.childNodes[0].setAttribute('pnom',_reg.origenes[_idorig].falsonombre);
        _modOrig.childNodes[0].setAttribute('sentido',_reg.origenes[_idorig].sentido);
        _modOrig.childNodes[0].setAttribute('estado',_reg.origenes[_idorig].estado);
		_modOrig.childNodes[0].innerHTML=_reg.origenes[_idorig].falsonombre;
		_modF.childNodes[1].appendChild(_modOrig);
	}

	_altOri=_modF.childNodes[1].clientHeight;

	_gacod=_Grupos.grupos[_reg.idga].codigo;
	if(_gacod==''){_gacod=_Grupos.grupos[_reg.idga].nombre;}
	_modF.querySelector('#grupo').innerHTML=_gacod;
   

    if(_Grupos.grupos[_reg.idgb]==undefined){
		console.log('grupo no definido id:'+_reg.idgb+' para comunicacion id:'+_reg.id);
		_reg.idgb=0;
	}
    _gbcod=_Grupos.grupos[_reg.idgb].codigo;
    if(_gbcod==''){
		_gbcod=_Grupos.grupos[_reg.idgb].nombre;
	}
    _modF.querySelector('#grupo2').innerHTML=_gbcod;	
   	
    //console.log(_reg.fechaobjetivo +'<'+ _Hoy +'&&'+ _reg.cerrado+'=='+'no'+ '&&'+ _reg.requerimiento +'=='+'si');
    if(_reg.fechaobjetivo < _Hoy && _reg.cerrado=='no' && _reg.requerimiento =='si'){
        _modBR=document.getElementById("modbanderaroja").cloneNode(true); 
        _modBR.removeAttribute('id');
        _modF.querySelector('#gestion').appendChild(_modBR);
    }
    
               
    if(_reg.cerrado=="si (controlar)" ){
        _modOj=document.getElementById("modojito").cloneNode(true); 
        _modOj.removeAttribute('id');
        _modF.querySelector('#gestion').appendChild(_modOj);
    }
    
    if(_reg.relevante=='si'){
        _modF.querySelector('#rel').innerHTML='!';
    }else{
        _modF.querySelector('#rel').innerHTML='';
    }
    
    if(_reg.nombre==undefined){
    	console.log(_reg);
    }
    if(_reg.nombre.length>10 && _reg.resumen.length>10){
    	//balanceado
    	_max='35';
    	
    	_modF.querySelector('#nom span#n').style.display='inline-block';
	    _modF.querySelector('#nom span#n').style.width='100%';
	    _modF.querySelector('#nom span#r').style.display='inline-block';
	    _modF.querySelector('#nom span#r').style.width='100%';
	    
	    if(_reg.nombre.length>_max){ 
	    	_modF.querySelector('#nom span#n').innerHTML=_reg.nombre.substring(0, _max)+' . . .';	
	    }else{
	    	_modF.querySelector('#nom span#n').innerHTML=_reg.nombre;
	    }
	    
	    
    	_max='129';
    	if(_reg.nombre.length>_max){ 
	    	_modF.querySelector('#nom span#r').innerHTML=_reg.nombre.substring(0, _max)+' . . .';	
	    }else{
	    	_modF.querySelector('#nom span#r').innerHTML=_reg.resumen;	    	
	    }
    	
    }else if(_reg.nombre.length>10){
    	    	
    	_modF.querySelector('#nom span#r').style.marginLeft='10px';
    	
    	_max='79';
	    if(_reg.nombre.length>_max){ 
	    	_modF.querySelector('#nom span#n').innerHTML=_reg.nombre.substring(0, _max)+' . . .';	
	    }else{
	    	_modF.querySelector('#nom span#n').innerHTML=_reg.nombre;
	    	_modF.querySelector('#nom span#r').innerHTML=_reg.resumen;
	    }
	    
    }else{
    	
    	_max='129';
	    if(_reg.nombre.length>_max){ 
	    	_modF.querySelector('#nom span#r').innerHTML=_reg.nombre.substring(0, _max)+' . . .';	
	    }else{
	    	_modF.querySelector('#nom span#n').innerHTML=_reg.nombre;
	    	_modF.querySelector('#nom span#r').innerHTML=_reg.resumen;
	    }
    }
    
    
    
    _class=_modF.querySelector('#nom').getAttribute('class');
    _modF.querySelector('#nom').setAttribute('class', _class + ' ' + _reg.EstElim);
    
    //campo entra o sale;
    _corto = _reg.sentido.replace("entrante", "entra<");
    _corto = _corto.replace("saliente", "sale>");				
    _modF.querySelector('#sen').innerHTML+=_corto;
    
    
    
    if(_reg.preliminar=='extraoficial'){					
        _modextra=document.getElementById("modextra").cloneNode(true);
        _modextra.removeAttribute('id');
        _modF.querySelector('#sen').appendChild(_modextra);
    }
                            
    if(_reg.adjuntos.length>0){
        _modHadj=document.getElementById("modhayadjuntos").cloneNode(true);
        _modHadj.removeAttribute('id');
        _modHadj.setAttribute('title',_reg.adjuntos.length + ' adjuntos');
        _modHadj.innerHTML+='<span>'+_reg.adjuntos.length+'</span>';
        _modF.querySelector('.contenido.descrip').appendChild(_modHadj);
    }
    
    if(Object.keys(_reg.documentosasociados.presentados).length>0){
        if(_reg.documentosasociados.respuestos==undefined){_reg.documentosasociados.respuestos=Array();}
        _modDocs=document.getElementById("modDocs").cloneNode(true);
        _modDocs.removeAttribute('id');
        _modDocs.setAttribute('title',_reg.docsTitulo);
        _modDocs.innerHTML= Object.keys(_reg.documentosasociados.presentados).length.toString() + "/" + Object.keys(_reg.documentosasociados.respuestos).length.toString();
        _modDocs.setAttribute('href','./DOC_gestion.php?comunicacion='+_reg.id)					
        if(Object.keys(_reg.documentosasociados.presentados).length>Object.keys(_reg.documentosasociados.respuestos).length){
            _modDocs.setAttribute('class','alerta');	
        }
        _modF.querySelector('#adj').appendChild(_modDocs);		
    }		
    
    _modEval=document.createElement('div');
    _modEval.setAttribute('id','eval');    
    _modF.querySelector('#adj').appendChild(_modEval);
    
    if(Object.keys(_reg.documentosasociados.rechazados).length>0){
    	
    	_modRech=document.createElement('div');
    	_modRech.setAttribute('class','version rechazada');
        _modRech.innerHTML= Object.keys(_reg.documentosasociados.rechazados).length;
    	_modEval.appendChild(_modRech);    		
    }		
    if(Object.keys(_reg.documentosasociados.aprobados).length>0){
    	
    	_modRech=document.createElement('div');
    	_modRech.setAttribute('class','version aprobada');
        _modRech.innerHTML= Object.keys(_reg.documentosasociados.aprobados).length;
        _modEval.appendChild(_modRech);  	
    }	
    
    if(Object.keys(_reg.documentosasociados.anulados).length>0){
    	
    	_modRech=document.createElement('div');
    	_modRech.setAttribute('class','version anulada');
        _modRech.innerHTML= Object.keys(_reg.documentosasociados.anulados).length;
        _modEval.appendChild(_modRech);  	
    }	
    
    if(_reg.emision==''){
    	_modF.querySelector('#fem').innerHTML="<span class='alerta'>a emitir</span>";        	
    }else{
    	_sp=_reg.emision.split('-');
    	_modF.querySelector('#fem').innerHTML =parseInt(_sp[2])+"<br>";
    	_modF.querySelector('#fem').innerHTML+=_meses[_sp[1]]+"<br>";
    	_modF.querySelector('#fem').innerHTML+="<span>"+_sp[0]+"</span>";	
    }
    
    
    
    if(_reg.recepcion=='0000-00-00'){
    	_modF.querySelector('#fre').innerHTML="<span class='alerta'>a recibir</span>";        	
    	_modF.querySelector('#fre').innerHTML="";
    }else{
    	_sp=_reg.recepcion.split('-');
    	_modF.querySelector('#fre').innerHTML =parseInt(_sp[2])+"<br>";
    	_modF.querySelector('#fre').innerHTML+=_meses[_sp[1]]+"<br>";
    	_modF.querySelector('#fre').innerHTML+="<span>"+_sp[0]+"</span>";	
        }
 
        if(_reg.cerradodesde>'0000-00-00'){
    	_sp=_reg.cerradodesde.split('-');
    	_modF.querySelector('#fce').innerHTML =parseInt(_sp[2])+"<br>";
    	_modF.querySelector('#fce').innerHTML+=_meses[_sp[1]]+"<br>";
    	_modF.querySelector('#fce').innerHTML+="<span>"+_sp[0]+"</span>";	     	
    }else{
    	_modF.querySelector('#fce').innerHTML="";
    	
    }
                    
    _modF.querySelector('#id1').innerHTML=_reg.falsonombre;
    _modF.querySelector('#id2').innerHTML=_reg.id2;
    //_modF.querySelector('#id3').innerHTML=_reg.id3;
    
    for(_idRta in _reg.respuestas){		
        _modRta=document.getElementById('modLink').cloneNode(true);
        _modRta.setAttribute('regId',_idRta);
        _modRta.removeAttribute('id');
        _modRta.childNodes[0].setAttribute('regId',_idRta);
        _modRta.childNodes[0].setAttribute('linkId',_reg.respuestas[_idRta].linkid);
        _modRta.setAttribute('name','refRta');
        //console.log(_idRta);
        //_modRta.childNodes[0].setAttribute('href','#fnc'+_idRta);	
        _modRta.childNodes[0].setAttribute('pnom',_reg.respuestas[_idRta].falsonombre);
        _modRta.childNodes[0].setAttribute('sentido',_reg.respuestas[_idRta].sentido);
        _modRta.childNodes[0].setAttribute('estado',_reg.respuestas[_idRta].estado);
        _modRta.childNodes[0].innerHTML=_reg.respuestas[_idRta].falsonombre;
        _modF.querySelector('#cra').childNodes[1].appendChild(_modRta);
    }	
    _altRes=_modF.querySelector('#cra').childNodes[1].clientHeight;
    _modF.querySelector('#cra').childNodes[1].style.minHeight=(Math.max(_altOri,30))+'px';
    
    _modF.childNodes[1].style.minHeight=(Math.max(_altRes,30))+'px';
    
    if(_modo=='actualiza'){
    	_ref=document.querySelector('#contenidoextenso  #comunicaciones .fila#fnc'+_reg.id);
    	
    	if(_ref!=undefined){
    		
        	_ref.innerHTML=_modF.innerHTML;
        	_ref.setAttribute('pnom',_modF.getAttribute('pnom'));
        	_ref.setAttribute('fecha',_modF.getAttribute('fecha'));
        	_ref.setAttribute('estado',_modF.getAttribute('estado'));
        	_ref.setAttribute('deconexion',_modF.getAttribute('deconexion'));
        	_ref.setAttribute('convalidada',_modF.getAttribute('convalidada'));
        	_ref.setAttribute('gaid',_modF.getAttribute('gaid'));
        	_ref.setAttribute('gbid',_modF.getAttribute('gbid'));
        	
        	
        	
        	_altoventana=window.innerHeight;
        	$([document.documentElement, document.body]).animate({
		        scrollTop: $("#"+_ref.getAttribute('id')).offset().top - (_altoventana/2)
		    }, 2000);
		    
		    _ref.setAttribute('editada','no');
		    
		    
		    setTimeout(function(){_ref.setAttribute('editada','si'); }, 50);
		    
	    }else{
	    	
	    	console.log('no se encontró la filan de, se alterna a modo nuevo');
	    	_modo='nuevo';
	    }
	}
    
    //alert(_modo);
    if(_modo=='carga'){	
        $("#contenidoextenso  #comunicaciones").append(_modF);
    }else if(_modo=='nuevo'){
    	_ComCargada=_reg;
    	var _parametros = {
    		orden:_filtro.orden
        };
        //Llamamos a los puntos de la actividad
        $.ajax({
            data:  _parametros,
            url:   './COM/COM_consulta_listadito.php',
            type:  'post',
            success:  function (response) {
            	
            	//console.log('buscando id:'+_ComCargada.id);
            	
                var _res = $.parseJSON(response);
                _ref=null;
                _idcv=0;
                _ubicada='no';
                //console.log(_res.data.comunicacionesOrden);
               	for(_nc in _res.data.comunicacionesOrden){	
               		_idc=_res.data.comunicacionesOrden[_nc];
               		if(_idcv==_ComCargada.id||_ubicada=='si'){
               			_ubicada='si';		
               			console.log('ubicada en _res.data.comunicacionesOrden. _nc:'+_nc)
               			_ref=document.querySelector('div.fila#fnc'+_idc);
               			_i=_nc;
						while(_ref==null&&_i > 0){
							//console.log('buscando primer regirstro anterior con una fila existente.');
               				_fidc=_res.data.comunicacionesOrden[_i];
               				//console.log('idcv:'+_idcv+'; fidc:'+_fidc);
               			 	_i=_i-1;
               			 	_ref=document.querySelector('div.fila#fnc'+_fidc);
               			 	//console.log(_ref);
               			}
               			console.log('_ref.:'+_ref);
               			if(_ref!=null){
               				break;
               			}
               			//console.log(_ref)
               		}
               		_idcv=_idc;	               		
               	}
               	
               	_cont=document.querySelector('#contenidoextenso #comunicaciones');
               	
               	if(_idc==_ComCargada.id){
               		//el elemento es el último de la lista. por eso no fue asociado a un id pasado.
               		_cont.appendChild(_modF);
               	}else if(_ref==null){
               		_cont.insertBefore(_modF,_cont.childNodes[0]);
               		//_cont.appendChild(_modF);
               	}else{
	            	_cont.insertBefore(_modF,_ref);
	            }
	            
	            _altoventana=window.innerHeight;		            
	            $([document.documentElement, document.body]).animate({
			        scrollTop: $("#"+_modF.getAttribute('id')).offset().top - (_altoventana/2)
			    }, 2000);
				    _modF.setAttribute('editada','no');
				    _modF.setAttribute('editada','si');
	            }
	        })			
    	
        	
        	
            
        }else if(_modo=='actualiza'){
        	console.log('terminada la actualizacion');
      
        }else{
            alert('error dfsgdfgdfsgret');
        }
    }
    
   
