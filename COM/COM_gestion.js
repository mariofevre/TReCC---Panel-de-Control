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


function anadirAdjunto(_adat){					

        _h3=document.createElement('h3');
        _h3.setAttribute('idadj',_adat.id);
        
        
        _aaa=document.createElement('a');
        _aaa.innerHTML=_adat.FI_nombreorig;
        _aaa.setAttribute('href',_adat.FI_documento);
        _aaa.title=_adat.FI_nombreorig;
        _aaa.setAttribute('download',_adat.FI_nombreorig);
        _h3.appendChild(_aaa);

		_sel=document.createElement('select');
		_sel.setAttribute('name','adj_'+_adat.id+'_tipo');
        _sel.setAttribute('onclick','cambiaTipoAdjunto(this)');
        _h3.appendChild(_sel);
        
        _op=document.createElement('option');
        _op.value='origen';
        _op.innerHTML='origen';
        _sel.appendChild(_op);
        
        _op=document.createElement('option');
        _op.value='adjunto';
        _op.innerHTML='adjunto';
        _sel.appendChild(_op);
        
        _op=document.createElement('option');
        _op.value='contenido';
        _op.innerHTML='contenido';
        _sel.appendChild(_op);
        
        _op=document.createElement('option');
        _op.value='imagenembebida';
        _op.innerHTML='imagenembebida';
        _sel.appendChild(_op);
        
        _sel.value=_adat.tipo;
        
        _in=document.createElement('input');
        _in.value=_adat.descripcion;
        _in.setAttribute('type','text');
        _in.setAttribute('name','adj_'+_adat.id+'_descripcion');
        _h3.appendChild(_in);
        
        _in=document.createElement('input');
        _in.value=_adat.zz_borrada;
        _in.setAttribute('type','hidden');
        _in.setAttribute('id','eliminar');
        _in.setAttribute('name','adj_'+_adat.id+'_zz_borrada');
        _h3.appendChild(_in);
                                    
        _in=document.createElement('input');
        _in.value='X';
        _in.title='borrar documento';
        _in.setAttribute('type','button');
        _in.setAttribute('class','eliminar');
        _in.setAttribute('onclick','eliminarAdjunto(this)');
        _h3.appendChild(_in);
        
        _in=document.createElement('input');
        _in.value='<-';
        _in.title='recuperar documento';
        _in.setAttribute('type','button');
        _in.setAttribute('class','recuperar');
        _in.setAttribute('onclick','desEliminarAdjunto(this)');
        _h3.appendChild(_in);
                                        
        document.querySelector('#form_com #adjuntos #adjuntoslista').appendChild(_h3);
    }
    
    
    function reponderCom(_id){
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        window.location.assign('./agrega_fcom.php?tabla=comunicaciones&salida=agrega_fcom&salidatabla=comunicaciones&respondiendo='+_id);
    }
    
    
    function resaltar(_this){
        _regid = _this.parentNode.getAttribute('regid');
        //console.log('fnc'+_regid);
        if(document.getElementById('fnc'+_regid)==null){return;}
        document.getElementById('fnc'+_regid).style.backgroundColor='lightblue';
    }
    
    
    function deresaltar(_this){
        _regid = _this.parentNode.getAttribute('regid');
        if(document.getElementById('fnc'+_regid)==null){return;}
        document.getElementById('fnc'+_regid).style.backgroundColor='';
    }
    
    
    function reponderComPrev(_this){	
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        //console.log(_this);		
        _id=_this.getAttribute('regid');
        _sentido=_this.getAttribute('sentido');
        _falsonombre=_this.innerHTML;
        _emision=_this.getAttribute('emision');
        _status=_this.getAttribute('estado');
        
        //console.log(_idAcc);	
        //console.log(_idAcc);
        _RespPor=document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');			
        //_RespPor.innerHTML='';	
        if(_emision<_idAccEmi){
            _sentido='alerta';
        }
        //console.log(_idAcc);
        _RespPor.innerHTML='<div sentido="'+_sentido+" ' estado='"+_status+'">'+_falsonombre+'</div>';	
    }
    
    
    function reponderComLimpia(){
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        _RespPor=document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
        _RespPor.innerHTML='';			
    }				
    
    function obtieneDescripcion(_idcomunicacion, _destino) {
        if(_destino.getAttribute('title')==''){				
            var parametros = {
                    "id" : _idcomunicacion,
                    "campo" : 'descripcion',
                    "panid" : _PanelI
            };

            
            $.ajax({
                data:  parametros,
                url:   './COM/COM_consulta_comunicacion_campo.php',
                type:  'post',
                success:  function (response){
                    _res = PreprocesarRespuesta(response);      
                    procesarRespuestaDescripcion(response, _destino);
                    
                }
            });
        }
    }
    

    
    function procesarRespuestaDescripcion(response, _destino) {			
        //console.log('response: '+response);
        var _res = $.parseJSON(response);
        //console.log(_res.length);	
        //console.log(_destino);	
        //_destino.setAttribute('title','hola');
        
        for (i = 0; i < _res.data.length; i++) {
            //console.log(_res[i].descripcion);				
            _destino.setAttribute('title',_res.data[i].descripcion);
            
            //console.log(_destino);
        }
    }
    
    
    
    
    function obtieneDescripcionI(_destino) {		
        _idcomunicacion=_destino.parentNode.parentNode.getAttribute('regid');
        
        var _destino=_destino;
        var parametros = {
                "id" : _idcomunicacion,
                "campo" : 'descripcion',
                "panid" : _PanelI
        };
        console.log(parametros);
        
        
        $.ajax({
            data:  parametros,
            url:  './COM/COM_consulta_comunicacion_campo.php',
            type:  'post',
            success:  function (response){
                _res = PreprocesarRespuesta(response);      
                procesarRespuestaDescripcionI(response, _destino);
            }
        });
    }
    


    function procesarRespuestaDescripcionI(response, _this) {		
        var _mod = document.getElementById('modDesc').cloneNode(true); 	
        _mod.removeAttribute('id');
        _this.innerHTML='-';
        _this.parentNode.style.zIndex='1001';
        _this.setAttribute('onclick',' toggleDesc(this)');
        var _res = $.parseJSON(response);
        for (i = 0; i < _res.data.length; i++) {
        	_di1=document.createElement('div');
        	_di1.setAttribute('class','flotaDescripcion');
        	_this.parentNode.appendChild(_di1);        	
            _div=document.createElement('div');
            _div.setAttribute('class','descripcion');
            _div.innerHTML=_res.data[i].descripcion;
            _di1.appendChild(_div);
        }
    }	


    function toggleDesc(_this){
    	_this.parentNode.removeChild(_this.parentNode.querySelector('.flotaDescripcion'));
    	_this.parentNode.removeAttribute('style');
    	_this.innerHTML='-i-';
    	_this.setAttribute('onclick','obtieneDescripcionI(this)');    	
    }
    
    
    function elimRta(_this){	
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        var _this=_this;	
        if(_this.parentNode.getAttribute('linkid')!=undefined){
            _ID=_this.parentNode.getAttribute('linkid');
        }else{
            _ID=_this.previousSibling.getAttribute('linkid');
        }
        
        if(_this.parentNode.parentNode.getAttribute('name')=='origen'){
            _orig = _this.parentNode.getAttribute('regid');
            _dest = _this.parentNode.parentNode.parentNode.getAttribute('regid');
        }else if(_this.parentNode.parentNode.getAttribute('name')=='destino'){
            _orig = _this.parentNode.parentNode.parentNode.parentNode.getAttribute('regid');
            _dest = _this.previousSibling.getAttribute('regid');
        }
        
        
        var _parametros = {
            "accion" : 'desvincular',
            "tabla" : 'comunicacioneslinkrespuestas',
            "origen" : _orig,
            "destino" : _dest,
            "campo" : 'descripcion',
            "cerrar_origen": 'no',
            "cerrar_origen_fecha": '',
            "reabrir_origen":'no',
            "panid" : _PanelI
        };


		if(_ComunicacionesCargadas[_orig] == undefined){
			
			alert('error al buscar la comunicación a vincular. Vuelva a intentarlo');
			
		}
		
		
		if(_ComunicacionesCargadas[_orig].cerrado=='si'){
			
			if(confirm('La comunicación de origen ('+_ComunicacionesCargadas[_orig].etiqueta+') se encuentra cerrada. ¿Deséa reabrila (eliminando su fecha de cierre)?')){
				_parametros["reabrir_origen"]='si';
			}else{				
				_parametros["reabrir_origen"]='no';		
			}
		
		}
	

        $.ajax({
            data:  _parametros,
            url:   './COM/COM_ed_vincula_respuestas.php',
            type:  'post',
            success:  function (response) {
                _res = PreprocesarRespuesta(response);      
                if(_res.res!='exito'){alert('Error, no se recibió la respueta esperada del servidor.');return;}
                _this.parentNode.parentNode.removeChild(_this.parentNode);
                actualizarUnaFila(_res.data.origen);
            }
        });
    }
    
    
	function cargarListadito(){
    	var _parametros = {"panid" : _PanelI};
        
        $.ajax({
            data:  _parametros,
            url:   './COM/COM_consulta_listadito.php',
            type:  'post',
            success:  function (response) {
                 _res = PreprocesarRespuesta(response);   
                //console.log(_res);
                procesarListadito(_res);
                identificarEnListaditoPertenenciasAGrupos(_listaditoSolG.ga,_listaditoSolG.gb);
            }
        })			
    }		
    
    
    
    
    function procesarListadito(_res){
        _cont=document.getElementById('formLink');
        _separador=_cont.querySelector('#separador');
        for(_nc in _res.data.comunicacionesOrden){
        		_idc=_res.data.comunicacionesOrden[_nc];
           		_cdat=_res.data.comunicaciones[_idc];
           		
                _mod=document.getElementById('modItem').cloneNode(true);
                _mod.removeAttribute('id');
                _mod.setAttribute('regid',_idc);
                _mod.setAttribute('gaid',_cdat.idga);
                _mod.setAttribute('gbid',_cdat.idgb);
                _mod.setAttribute('sentido',_cdat.sentido);
                _mod.setAttribute('estado',_cdat.estado);
                _mod.setAttribute('pnom',_cdat.falsonombre);
                _mod.setAttribute('value',_cdat.etiqueta);
                
                if(
                    (
                        _filtro.grupoa!='todas'
                        &&
                        _filtro.grupoa!=_cdat.idga
                    )
                    ||
                    (
                        _filtro.grupob!='todas'
                        &&
                        _filtro.grupob!=_cdat.idgb
                    )
                ){
                    _cont.appendChild(_mod);	
                }else{
                    _cont.insertBefore(_mod,_separador);  
                }
           // }				
        }
        
        $(document).ready(function() {
            
        $('input[name=Crelac]').hover(				
            function () {
                reponderComPrev(this);
                obtieneDescripcion(this.getAttribute('regId'), this);
                $(this).css({"background-color":"red"});
            }, 				
            function () {
                reponderComLimpia();
                $(this).css({"background-color":""});
            }
        );				
            
        });
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
    //cargarListadito();
    

    function responderCom(_this){
 
        _ga=_this.parentNode.parentNode.parentNode.getAttribute('gaid');
        _gb=_this.parentNode.parentNode.parentNode.getAttribute('gbid');   
        _listaditoSolG.ga=_ga;
        _listaditoSolG.gb=_gb;
        	
        if(_listadocargado=='no'){
            cargarListadito();
            _listadocargado='si';
        }
        
        if(_this.parentNode.parentNode.parentNode.getAttribute('sentido')=='entrante'){
            document.querySelector('#comandoAborde').setAttribute('saliente','si');
            document.querySelector('#comandoAborde').setAttribute('entrante','no');
        }else{
            document.querySelector('#comandoAborde').setAttribute('saliente','no');
            document.querySelector('#comandoAborde').setAttribute('entrante','si');
        }
        
        document.querySelector('#comandoAborde').setAttribute('ga','no');
        document.querySelector('#comandoAborde').setAttribute('gb','no');
              
		console.log(_ga + ' '+_gb);
        identificarEnListaditoPertenenciasAGrupos(_ga,_gb);
        
        
        _gan=_Grupos.grupos[_ga].codigo;
        if(_gan==''){
        	_gan=_Grupos.grupos[_ga].nombre;	
        }
        document.querySelector('#comandoAborde #gacod').innerHTML=_gan;
        
        _gbn=_Grupos.grupos[_gb].codigo;
        if(_gbn==''){
        	_gbn=_Grupos.grupos[_gb].nombre;	
        }
        document.querySelector('#comandoAborde #gbcod').innerHTML=_gbn;
        
        
        _linkeando='respuesta';
                    
        _id=_this.parentNode.parentNode.parentNode.getAttribute('regId');
        _emision=_this.parentNode.parentNode.parentNode.getAttribute('emision');
        _status=_this.parentNode.parentNode.parentNode.getAttribute('estado');
        _falsonombre=_this.parentNode.parentNode.parentNode.getAttribute('pnom');
        
        if(_idAcc!=''){            
            _AuxViejo = document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
            _AuxViejo.style.display='none';					
        }
        
        //console.log(document.getElementById('fnc'+_id));
        _AuxResp =document.querySelector('#fnc'+_id+' #cra .contenedor .AuxResp');
        _AuxResp.style.display='inline-block';		
        
        _idAcc=_id;
        _idAccEmi=_emision;			
        
        document.getElementById('origen').value=_id;
        document.getElementById('destino').value='';
        document.querySelector('#comandoAborde').setAttribute('estado','activo');
        document.getElementById('seleorig').style.display='none';
        document.getElementById('selerta').style.display='inline';
        document.getElementById('origennombre').innerHTML=_falsonombre;
        _accion='respondiendo';
    } 
    
	function originarCom(_this){
		_ga=_this.parentNode.parentNode.getAttribute('gaid');
        _gb=_this.parentNode.parentNode.getAttribute('gbid');   
        _listaditoSolG.ga=_ga;
        _listaditoSolG.gb=_gb;
        	
        if(_listadocargado=='no'){
            cargarListadito();
            _listadocargado='si';
        }
        
        if(_this.parentNode.parentNode.getAttribute('sentido')=='entrante'){
            document.querySelector('#comandoAborde').setAttribute('saliente','si');
            document.querySelector('#comandoAborde').setAttribute('entrante','no');
        }else{
            document.querySelector('#comandoAborde').setAttribute('saliente','no');
            document.querySelector('#comandoAborde').setAttribute('entrante','si');
        }
        
        document.querySelector('#comandoAborde').setAttribute('ga','no');
        document.querySelector('#comandoAborde').setAttribute('gb','no');
              
        identificarEnListaditoPertenenciasAGrupos(_ga,_gb);
        
        _gan=_Grupos.grupos[_ga].codigo;
        if(_gan==''){
        	_gan=_Grupos.grupos[_ga].nombre;	
        }
        document.querySelector('#comandoAborde #gacod').innerHTML=_gan;
        
        _gbn=_Grupos.grupos[_gb].codigo;
        if(_gbn==''){
        	_gbn=_Grupos.grupos[_gb].nombre;	
        }
        document.querySelector('#comandoAborde #gbcod').innerHTML=_gbn;    	

        _linkeando='origen';

        if(_idAcc!=''){	
            _AuxViejo = document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
            _AuxViejo.style.display='none';
            _AuxResp = document.querySelector('#fnc'+_idAcc+' #cra .contenedor');
            _AuxResp.style.display='none';								
        }			

        _id=_this.parentNode.parentNode.getAttribute('regId');
        _falsonombre=_this.parentNode.parentNode.getAttribute('pnom');
        _emision=_this.parentNode.parentNode.getAttribute('fecha');
        _status=_this.parentNode.parentNode.getAttribute('estado');
        
        
        _idAcc=_id;
        _idAccEmi=_emision;			
        
        
        document.getElementById('origen').value='';
        document.getElementById('destino').value=_id;
        
        
        document.querySelector('#comandoAborde').setAttribute('estado','activo');
        document.getElementById('seleorig').style.display='inline';
        document.getElementById('selerta').style.display='none';
        document.getElementById('origennombre').innerHTML=_falsonombre;
        _accion='originando';
    } 

    
function crearLink(_this){	
    /*
    if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }*/
    var _this=_this;
    
    if(_linkeando=='origen'){
        _orig = _this.getAttribute('regid');
        _dest = _idAcc;
    }else if(_linkeando=='respuesta'){
        _dest = _this.getAttribute('regid');
        _orig = _idAcc;				
    }
    
    
    var _parametros = {
        "accion" : 'vincular',
        "tabla" : 'comunicacioneslinkrespuestas',
        "campo" : 'descripcion',
        "origen" : _orig,
        "destino" : _dest,
        "cerrar_origen" : 'no',
        "cerrar_origen_fecha" : '',
        "reabrir_origen":'no',
        "panid" : _PanelI
    };  
    
    
    if(_ComunicacionesCargadas[_orig] == undefined){
		alert('error al buscar lacomunicación a vincular. Vuelva a intentarlo');
	}
	
	
	if(_ComunicacionesCargadas[_orig].cerrado=='no'){
		
		if(_ComunicacionesCargadas[_dest].emision==''){
			if(confirm('La comunicación de origen ('+_ComunicacionesCargadas[_orig].etiqueta+') se encuentra abierta. ¿Deséa cerrarla (sin fecha de cierre definida)?')){
				_parametros["cerrar_origen"]='si';
				_parametros["cerrar_origen_fecha"]='';	
			}else{				
				_parametros["cerrar_origen"]='no';
				_parametros["cerrar_origen_fecha"]='';				
			}
			
		}else{
		
			_f=_ComunicacionesCargadas[_dest].emision.split('-');
			
			if(confirm('La comunicación de origen ('+_ComunicacionesCargadas[_orig].etiqueta+') se encuentra abierta. ¿Deséa cerrarla con fecha '+_f[2]+'/'+_f[1]+'/'+_f[0]+'?')){
				_parametros["cerrar_origen"]='si';
				_parametros["cerrar_origen_fecha"]=_ComunicacionesCargadas[_dest].emision;
			}else{
				_parametros["cerrar_origen"]='no';
				_parametros["cerrar_origen_fecha"]='';
			}
		}
	}
	

    
    $.ajax({
            data:  _parametros,
            url:   './COM/COM_ed_vincula_respuestas.php',
            type:  'post',
            success:  function (response) {
                _res = PreprocesarRespuesta(response);      
               
               if(_res.res!='exito'){alert('Error, no se recibió la respueta esperada del servidor.');return;}
               
                actualizarUnaFila(_res.data.origen);
                
                representarLink(response, _this);
                
            }
    });
}	

function representarLink(response,_this){
    
    _destino=document
    var _res = $.parseJSON(response);
    
    if(_linkeando=='origen'){
        _destino=document.querySelector('#fnc'+_idAcc+' div[name="origen"]');
        
    }else if(_linkeando=='respuesta'){
        _destino=document.querySelector('#fnc'+_idAcc+' #cra .contenedor');
        
    }
    
    _mod=document.getElementById('modLink').cloneNode(true);
    _mod.removeAttribute('id');
    
    _destino.appendChild(_mod);
    
    _mod.setAttribute('linkId',_res.data.nid);
    _mod.setAttribute('regId',_this.getAttribute('regid'));
    _mod.setAttribute('name','refRta');
    
    _mod.childNodes[0].setAttribute('href','#fnc'+_this.getAttribute('regid'));	
    _mod.childNodes[0].setAttribute('pnom',_this.getAttribute('pnom'));
    _mod.childNodes[0].setAttribute('sentido',_this.getAttribute('sentido'));
    _mod.childNodes[0].setAttribute('estado',_this.getAttribute('estado'));
    _mod.childNodes[0].innerHTML=_this.getAttribute('pnom');
}


function multieditDOC(_this,_event,_status){
    /*
    if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }*/
    
    _id=_this.parentNode.parentNode.getAttribute('regid');
    _grupo='sinuso';
    _s=_this.getAttribute('selecto');

    if (_event.ctrlKey==1){ // con ctrl apretado incrementará la seleccion
        if(typeof _seleccionDOCSid[_grupo]=== 'undefined'){
            _seleccionDOCSid[_grupo]=_id;
        }else{
            _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_id;
        }
        
        _this.setAttribute('selecto','si');	
        _this.className += " seleccionado";	
    
    
    }else if(_event.altKey==1){ // con alt apretado eliminará de la selección todos los documentos intermedios entre el último seleccionado y el actual

        console.log('alt presionado');
        if(typeof _seleccionDOCSid[_grupo]=== 'undefined'){
            _seleccionDOCSid[_grupo]=_id;
        }else{
            _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo].replace("_ "+_id, ""); 
        }
        console.log(_seleccionDOCSid[_grupo]);
        
        _this.setAttribute('selecto','no');	
        _this.className = _this.className.replace(" seleccionado", "");
        
    }else if(_event.shiftKey==1){ // con shift apretado incorporará a la selección todos los documentos intermedios entre el último seleccionado y el actual
        
        console.log(_ultimamarca);
        _nuevamarca=_this.parentNode.parentNode.getAttribute('norden');
        
        _desde=Math.min(_nuevamarca,_ultimamarca); 
        _hasta=Math.max(_nuevamarca,_ultimamarca); 	
        _elem = document.getElementsByName('selector');
        
    
        for (var i = 0; i < _elem.length; ++i){

            _pos=_elem[i].parentNode.parentNode.getAttribute('norden');
            
            if(_pos>=_desde&&_pos<=_hasta){
                _elem[i].setAttribute('selecto','si');	
                _elem[i].className += " seleccionado";	
                // _elem[i].className = _elem[i].className.replace(/(?:^|\s)seleccionado(?!\S)/g , '');
            }
        }
        
    }else{
        _seleccionDOCSid[_grupo]=_id; // sin ctrl apretado definirá una nueva seleccion
        
        _elem = document.getElementsByName('selector');
        
        document.getElementById('recuadro4').innerHTML=_this.innerHTML;
        
        for (var i = 0; i < _elem.length; ++i){
            _elem[i].setAttribute('selecto','no');	
            _elem[i].className = _elem[i].className.replace(/(?:^|\s)seleccionado(?!\S)/g , '');
            
        }
        
        _this.setAttribute('selecto','si');	
        _this.className += " seleccionado";	
    }
    
    
    _idstring="";
    _cont=0;
    _elem = document.getElementsByName('selector');
    _seleccionDOCSid[_grupo]='';
    
    for (var i = 0; i < _elem.length; ++i){
        _stat=_elem[i].getAttribute('selecto');
        if(_stat=='si'){
            _cont=_cont+1;
            _idstring=_idstring+"_"+_elem[i].parentNode.parentNode.getAttribute('regid');
            _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_elem[i].parentNode.parentNode.getAttribute('regid');            
        }else{
            
        }
    }
    
    if(_cont>1){
        document.getElementById('recuadro4').innerHTML='Selección múltiple de ('+_cont+') documentos:<br>'+_seleccionDOCSid[_grupo];
    }else{
        //_this.setAttribute('selecto','si');
    }
    
    _ultimamarca=_this.parentNode.parentNode.getAttribute('norden');
    
    document.getElementById('recuadro5').src='./agrega_fcoms.php?id='+_seleccionDOCSid[_grupo];		
}

function eliminarDocCandidato(_this){
	_candidato=_this.parentNode;
	_nf=_candidato.getAttribute('nf');
	delete _Candidatos[_nf];
	_candidato.parentNode.removeChild(_candidato);
}

var _Candidatos={};

function borrarTodo(){
	document.querySelector('#listacargando').innerHTML='';
	_Candidatos={};
}        

function iniciaProcesarTodo(){	
	_subn=document.querySelector('.subiendo[estado="verificado"]');
	if(_subn==null){return;}
	subirDocCandidato(_subn,'todo');
}

function reinterpretarTodo(){	
	_modocod= Math.random().toString(36).substring(7);
	_subs=document.querySelectorAll('.subiendo[estado="verificado"]');
	for(_sn in _subs){
		if(typeof _subs[_sn] != 'object'){continue;}
		_subs[_sn].setAttribute('modocod',_modocod);//mara los subs que analizará
	}
	
	_subn=document.querySelector('.subiendo[estado="verificado"]');
	
	if(_subn==null){return;}
	
	console.log('iniciando reconsulta');
	reinterpretarCandidato(_subn,'todo',_modocod);
}


function reinterpretarCandidato(_this,_modo){
	
	_form=_this.parentNode.parentNode.parentNode;
	_archivo=_Candidatos[_nf].name;
	_nf=_this.getAttribute('nf');
	
//	console.log('reconsultando: '+_nf);
	
	consultarInterpretacionNombre(
		_form.querySelector('[name="criterioseparador"]').value,
		_form.querySelector('[name="criterio"]').value,
		_form.querySelector('[name="com-nomenclaturaarchivosRta"]').value,
		_archivo,
		_nf,
		_modo,
		_modocod
	);	
}


function probarnombreDoc(_this){

	_form=_this.parentNode.parentNode.parentNode;
    
    console.log(_this.files);
    var _this=_this;
    var files = _this.files;
	
	for (i = 0; i < files.length; i++){
		_nf++;
		_Candidatos[_nf]=files[i];
		_pp=document.querySelector('#modelosubida').cloneNode(true);
		_pp.removeAttribute('id');
		_pp.setAttribute('nf',_nf);
		_pp.setAttribute('class','subiendo');
		_pp.setAttribute('estado','leyendonombre');
		_pp.querySelector('#archivo').innerHTML=files[i].name;
        
		_form.querySelector('#listacargando').appendChild(_pp);
			
		consultarInterpretacionNombre(
			_form.querySelector('[name="criterioseparador"]').value,
			_form.querySelector('[name="criterio"]').value,
			_form.querySelector('[name="com-nomenclaturaarchivosRta"]').value,
			files[i].name,
			_nf,
			'uno',
			''
		);	
	}		
	return;

}


function consultarInterpretacionNombre(
		_criterioseparador,
		_criterio,
		_nomenclarespuesta,
		_nombrearchivo,
		_nf,
		_modo,
		_modocod
	){

	_parametros={
    	'criterioseparador':_criterioseparador,
    	'criterio':_criterio,
    	'com-nomenclaturaarchivosRta':_nomenclarespuesta,
    	'nombrearchivo':_nombrearchivo,
    	'nf':_nf,
    	'modo':_modo,
    	'modocod':_modocod,
    	"panid" : _PanelI
    };            
    
    $.ajax({
        data:  _parametros,
        url:   './COM/COM_ed_prueba_nombre_doc_com.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            _res = PreprocesarRespuesta(response);
            
            _q='#listacargando [nf="'+_res.data.nf+'"]';
            _pp=document.querySelector(_q);
            _pp.setAttribute('estado','verificado');
            _var=Array(
            		'ident',
            		'identdos',
            		'identtres',
            		'nombre',	
            		'resumen',
            		'sentido',
            		'emision',
            		'id_p_grupos_id_nombre_tipoa',
            		'id_p_grupos_id_nombre_tipoa-n',
            		'id_p_grupos_id_nombre_tipob',
            		'id_p_grupos_id_nombre_tipob-n'
            );
            
            
            for(_i=0;_i<_var.length;_i++){
                      console.log(_var[_i]);  
	            if(_res.data.definiciones[_var[_i]]!=undefined){
	            	console.log(_var[_i]+' -> '+_res.data.definiciones[_var[_i]]);
	            	_in=_pp.querySelector('[name="'+_var[_i]+'"]');
	            	if(_in==null){
	            		console.log('input no encontrado');
	            		continue;
	            	}
	            	console.log(_in);	
	            	_in.value=_res.data.definiciones[_var[_i]];
	            }else{
	            	//console.log('sin definicion');
	            }            
	            if(_res.data.observaciones[_var[_i]]!=undefined){
            		_in.title=_res.data.observaciones[_var[_i]];
            		_in.setAttribute('observado','si');
            		//console.log('sin observación');
            	}
        	}
        	
        	/*
        	console.log(_pp);
        	console.log(_pp.querySelector('[name="id_p_grupos_id_nombre_tipoa-n"]'));
        	controOpcionBlur(_pp.querySelector('[name="id_p_grupos_id_nombre_tipoa-n"]'));
        	controOpcionBlur(_pp.querySelector('[name="id_p_grupos_id_nombre_tipob-n"]'));
        	*/
        	
        	_inid=_pp.querySelector('#Iid_p_grupos_id_nombre_tipoa');
        	_inn=_pp.querySelector('#Iid_p_grupos_id_nombre_tipoa-n');
        	
        	_inid.setAttribute('origen','archivo');
        	_inid.setAttribute('valarchivo',_inid.value);
        	
        	            	
        	_va=document.querySelector('#editorArchivos > input[name="idga"]').value;
        	_vna=document.querySelector('#editorArchivos > input[name="idga-n"]').value;
            if(_va!==''){
            	_inid.value=_va;
            	_inid.setAttribute('origen','colectivo');
            	_inn.value=_vna;
            }
            
            _inid=_pp.querySelector('#Iid_p_grupos_id_nombre_tipob');
        	_inn=_pp.querySelector('#Iid_p_grupos_id_nombre_tipob-n');
        	
        	_inid.setAttribute('origen','archivo');
        	_inid.setAttribute('valarchivo',_inid.value);
        		            	
        	_vb=document.querySelector('#editorArchivos > input[name="idgb"]').value;
        	_vnb=document.querySelector('#editorArchivos > input[name="idgb-n"]').value;
            if(_vb!==''){
            	_inid.value=_vb;
            	_inid.setAttribute('origen','colectivo');
            	_inn.value=_vnb;		            	
            }
            
            
            if(_res.data.modo=='todo'){
            	_subn=document.querySelector('.subiendo[estado="verificado"][modocod="'+_res.data.modocod+'"]');
				if(_subn==null){return;}
				_subn.removeAttribute('modocod');
				reinterpretarCandidato(_subn,'todo');
            }
        
		}
	});	
}




function subirDocCandidato(_candidato,_modo){
	_candidato.setAttribute('estado','subiendo');
	_nf=_candidato.getAttribute('nf');
	_file=_Candidatos[_nf];
   
	_form=document.querySelector('#editorArchivos');
	   
    var _parametros = new FormData();
    _parametros.append("upload",_file);
    _parametros.append("nf",_nf);
    _parametros.append("panid",_PanelI);
    _parametros.append("modo",_modo);
    _parametros.append("tipo",_form.querySelector('select[name="tipo"').value);
    
    id_p_grupos_id_nombre_tipoa
    id_p_grupos_id_nombre_tipoa
    console.log(_candidato);
    console.log(_candidato.querySelector('input[name="id_p_grupos_id_nombre_tipoa"'));
    _parametros.append("id_p_grupos_id_nombre_tipoa",_candidato.querySelector('input[name="id_p_grupos_id_nombre_tipoa"').value);
    _parametros.append("id_p_grupos_id_nombre_tipoa-n",_candidato.querySelector('input[name="id_p_grupos_id_nombre_tipoa-n"').value);
    _parametros.append("id_p_grupos_id_nombre_tipob",_candidato.querySelector('input[name="id_p_grupos_id_nombre_tipob"').value);
    _parametros.append("id_p_grupos_id_nombre_tipob-n",_candidato.querySelector('input[name="id_p_grupos_id_nombre_tipob-n"').value);
    
    _parametros.append("nombre",_candidato.querySelector('input[name="nombre"').value);
    _parametros.append("resumen",_candidato.querySelector('textarea[name="resumen"').value);
    _parametros.append("ident",_candidato.querySelector('input[name="ident"').value);
    _parametros.append("identdos",_candidato.querySelector('input[name="identdos"').value);
    _parametros.append("identtres",_candidato.querySelector('input[name="identtres"').value);
    _parametros.append("emision",_candidato.querySelector('input[name="emision"').value);
    _parametros.append("preliminar",_candidato.querySelector('select[name="preliminar"').value);
    _parametros.append("sentido",_candidato.querySelector('select[name="sentido"').value);
    
    _xrr=$.ajax({
        data:  _parametros,
        url:   './COM/COM_ed_guarda_doc.php',
        type:  'post',
        processData: false, 
        contentType: false,
        error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	_res = PreprocesarRespuesta(response);      
			                        
            if(_res.data.nf!=0){
                console.log(_res);
                if(_res.data.nf!=0){
                    _ps=document.querySelector('.subiendo[nf="'+_res.data.nf+'"]');
                    _ps.setAttribute('estado','subido');
                }
                cargarUnaFila(_res.data.nid);
                
                if(_res.data.modo=='todo'){
                	_subn=document.querySelector('.subiendo[estado="verificado"]');
                	if(_subn==null){return;}
                	subirDocCandidato(_subn,'todo');
                }
           	}
        }
    });
    //console.log(_xrr);
		
    //_form.style.display='none';
}
    


function cargarOrigen(){
    _form=document.getElementById("editorArchivos");
    _form.querySelector('select[name="tipo"]').value='original';
    _form.querySelector('input[name="zz_AUTOPANEL"]').value=_PanId;			
    _form.style.display = 'block';			
    _form.querySelector('h1#tituloformulario').innerHTML='Generar Comunicaciones a partir de archivos';
    _form.querySelector('p#desarrollo').innerHTML='Generar comunicaciones a partir de archivos. Cada archivo genera una nueva comunicación en función del nombre de archivo';
    
    _form.querySelector('div.opciones[for="idga"]').innerHTML='';
    _form.querySelector('div.opciones[for="idgb"]').innerHTML='';
    
    
    _tipos=Array('a','b');
    for(i=0;i<_tipos.length;i++){
    	_t=_tipos[i];
	    for(_ng in _Grupos.gruposOrden[_t]){
	    	_idg=_Grupos.gruposOrden[_t][_ng];
	    	_gdat=_Grupos.grupos[_idg];
	    	_cont= _form.querySelector('div.opciones[for="idg'+_t+'"]');
	        
	        _anc=document.createElement('a');
	        _anc.setAttribute('onclick','opcionar(this)');
	        if(_gdat.id==undefined){_gid=0;}else{_gid=_gdat.id;}	        
	        _anc.setAttribute('idgrupo',_gid);
	        _anc.title=_gdat.codigo+" _ "+_gdat.descripcion;
	        _anc.innerHTML=_gdat.nombre;
	        _cont.appendChild(_anc);
	    }
    }
}

