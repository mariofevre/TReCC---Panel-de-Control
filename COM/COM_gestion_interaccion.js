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


	
function toogle(_elem){
	    _nombre=_elem.parentNode.parentNode.getAttribute('class');

	    elementos = document.getElementsByName(_nombre);
	    for (x=0;x<elementos.length;x++){			
			elementos[x].removeAttribute('checked');
		}
	    _elem.previousSibling.setAttribute('checked','checked');		
}

	
function tecleoGeneral(_event){
	if(_event.keyCode==27){
		
		//console.log('es esc');
		if(typeof _StopTecleoEsc !== 'undefined'){//evita superposición con PAN_grupos_form.js
			//console.log('existe');
			//alert(_StopTecleoEsc);
			if(_StopTecleoEsc=='si'){
			//console.log('frenando');
			_StopTecleoEsc='no';
			return;
		}}
		
		if(
			document.querySelector('#form_com').style.display=='block'
		){
			_boton=document.querySelector('#form_com .cancela.general')
			cancelarCom(_boton);
		}
	}
}


function tecleaBusqueda(_this,_event){	
	
	if ( 
        _event.keyCode == '9'//presionó tab no es un nombre nuevo
        ||
        _event.keyCode == '13'//presionó enter
        ||
        _event.keyCode == '32'//presionó espacio
        ||
        _event.keyCode == '37'//presionó direccional
        ||
        _event.keyCode == '38'//presionó  direccional
        ||
        _event.keyCode == '39'//presionó  direccional
        || 
        _event.keyCode == '40'//presionó  direccional		  		
    ){
    	return;
    }
	
	
	if(document.querySelector('[name="busquedaprofunda"]').checked){
		_buscamas='si';
	}else{
		_buscamas='no';
	}
	
	_val=document.querySelector('[name="busqueda"]').value;
		
	_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
	_hatch=_hatch.replace(/ /g, '');
	_hatch=_hatch.toLowerCase();
	
	if(_hatch.length<3){
		_FiltroVisibles.busqueda_act='no'
		filtrarFilas();
		return;
	}

	if(_buscamas=='si'){
		_c=parseInt(document.querySelector('#cargandobuscar').getAttribute('consultas'));
		_c=_c+1;
		document.querySelector('#cargandobuscar').setAttribute('consultas',_c);
		_FiltroVisibles.busqueda_act='si'
		enviaBusqueda(_hatch);
	}else{
		_FiltroVisibles.busqueda_light_act='si'
		_FiltroVisibles.busqueda_light_hatch=_hatch;
		filtrarFilas();
	}
	
}
	
	
var _FiltroVisibles={
	busqueda:Array(),
	busqueda_act:'no',
	busqueda_light_act:'no',
	busqueda_light_hatch:'',
	sentido:Array(),
	abiertas:Array(),
	grupoa:Array(),
	grupob:Array()
};

_busquedaXHR=null;
function enviaBusqueda(_hatch){
	var parametros = {
    	'BUSQUEDA': _hatch
    };		
    if(_busquedaXHR!=null){
    	console.log(_busquedaXHR);
    	_busquedaXHR.abort();
    	_c=parseInt(document.querySelector('#cargandobuscar').getAttribute('consultas'));
    	_c=_c-1;
		document.querySelector('#cargandobuscar').setAttribute('consultas',_c);
		
	}	
    _busquedaXHR = $.ajax({
        data:  parametros,
        url:   './COM/COM_consulta_comunicaciones_busca.php',
        type:  'post',
        error:   function (response) {console.log('error al contactar el servidor / o búsqueda suspendida');},
        success:  function (response) {
        	_busquedaXHR=null;
            _res = PreprocesarRespuesta(response);
            _FiltroVisibles.busqueda=_res.data.comunicaciones;
            filtrarFilas();
            _c=parseInt(document.querySelector('#cargandobuscar').getAttribute('consultas'));
			document.querySelector('#cargandobuscar').setAttribute('consultas',(_c-1));
   		}
   	})
}


function filtrarLinks(_event,_this){
    if ( 
        _event.keyCode == '9'//presionó tab no es un nombre nuevo
        ||
        _event.keyCode == '13'//presionó enter
        ||
        _event.keyCode == '32'//presionó espacio
        ||
        _event.keyCode == '37'//presionó direccional
        ||
        _event.keyCode == '38'//presionó  direccional
        ||
        _event.keyCode == '39'//presionó  direccional
        || 
        _event.keyCode == '40'//presionó  direccional		  		
    ){
        return;
    }		  	
    
    if(_this.value=='0'){return;}
    //_valor = _this.value;
    
    _divsrta=document.querySelectorAll('#comandoAborde #formLink input.COMcomunicacion');
    for(_dn in _divsrta){	
        if(typeof _divsrta[_dn] != 'object'){return;}
        if(!_divsrta[_dn].value.toUpperCase().includes(_this.value.toUpperCase())){
            _divsrta[_dn].setAttribute('filtrado','si');
        }else{
            _divsrta[_dn].setAttribute('filtrado','no');
        }
    }
}



function filtrarFilas(){
	_form=document.querySelector('#formfiltro');
	
    _filtro.sentido =_form.querySelector('input[name="sentido"]:checked').value;        
    _filtro.abiertas=_form.querySelector('input[name="abiertas"]:checked').value;
    _filtro.grupoa  =_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked').value;
    _filtro.grupob  =_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked').value;
	
	
	for(_idcom in _ComunicacionesCargadas){
		
		_fila=document.querySelector('#comunicaciones .fila#fnc'+_idcom);
		
		
		if(_FiltroVisibles.busqueda_act=='si'){
			if(Object.keys(_FiltroVisibles.busqueda).length>0){
				
				//alert(_idcom);
				//console.log(_FiltroVisibles.busqueda[_idcom]);				
				if(_FiltroVisibles.busqueda[_idcom]!=undefined){	
					//alert(_idcom);
					//_FiltroVisibles.busqueda[_idcom]					
					_fila.setAttribute('filtroB',"siver");
				}else{
					_fila.setAttribute('filtroB',"nover");
					
				}
			}
		}else if(_FiltroVisibles.busqueda_light_act=='si'){
			
			_st =_ComunicacionesCargadas[_idcom].falsonombre;
			_st+='-'+_ComunicacionesCargadas[_idcom].fechaobjetivo;
			_st+='-'+_ComunicacionesCargadas[_idcom].id1;
			_st+='-'+_ComunicacionesCargadas[_idcom].id2;
			_st+='-'+_ComunicacionesCargadas[_idcom].id3;
			_st+='-'+_ComunicacionesCargadas[_idcom].nombre;
			_st+='-'+_ComunicacionesCargadas[_idcom].recepcion;
			_st+='-'+_ComunicacionesCargadas[_idcom].resumen;
			
			
			_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
			_st=_st.replace(/ /g, '');
			_st=_st.toLowerCase();
			
			
			if(_st.indexOf(_FiltroVisibles.busqueda_light_hatch)>=0){
				_fila.setAttribute('filtroB','siver');
				console.log(_FiltroVisibles.busqueda_light_hatch+' vs '+_st+' -- '+_st.indexOf(_FiltroVisibles.busqueda_light_hatch));
			}else{
				_fila.setAttribute('filtroB','nover');
				//console.log('nover');
			}
		}else{
			_fila.setAttribute('filtroB',"siver");
		}
		
		if(_filtro.sentido=='todas'){
			_fila.setAttribute('filtroS',"siver");
		}else if(_filtro.sentido==_ComunicacionesCargadas[_idcom].sentido){
			_fila.setAttribute('filtroS',"siver");
		}else{
			_fila.setAttribute('filtroS',"nover");
		}
		
		if(_filtro.abiertas=='todas'){
			_fila.setAttribute('filtroA',"siver");
		}else if(_ComunicacionesCargadas[_idcom].cerrado!='si'){
			_fila.setAttribute('filtroA',"siver");
		}else{
			_fila.setAttribute('filtroA',"nover");
		}
		
		if(_filtro.grupoa=='todas'){
			_fila.setAttribute('filtroGA',"siver");
		}else if(_filtro.grupoa==_ComunicacionesCargadas[_idcom].idga){
			_fila.setAttribute('filtroGA',"siver");
		}else{
			_fila.setAttribute('filtroGA',"nover");
		}
		
		if(_filtro.grupob=='todas'){
			_fila.setAttribute('filtroGB',"siver");
		}else if(_filtro.grupob==_ComunicacionesCargadas[_idcom].idgb){
			_fila.setAttribute('filtroGB',"siver");
		}else{
			_fila.setAttribute('filtroGB',"nover");
		}
					
	}
	
	
	_filas=document.querySelectorAll('#comunicaciones .fila');
	_ctot=Object.keys(_filas).length;
	document.querySelector('#formfiltro #canttotal').innerHTML=_ctot;
	document.querySelector('#formfiltro #porctotal').innerHTML='100%';
			
	_str ='#comunicaciones .fila[filtroB="nover"],';
	_str+='#comunicaciones .fila[filtroS="nover"],';
	_str+='#comunicaciones .fila[filtroA="nover"],';
	_str+='#comunicaciones .fila[filtroGB="nover"],';
	_str+='#comunicaciones .fila[filtroGA="nover"]';
	
	_filas=document.querySelectorAll(_str);
	_cocu=Object.keys(_filas).length;
	_pocu=Math.round(_cocu*100/_ctot);
	document.querySelector('#formfiltro #cantfiltrado').innerHTML=_cocu;
	document.querySelector('#formfiltro #porcfiltrado').innerHTML=_pocu+'%';
	
	_cvis=_ctot - _cocu;
	_pvis=100 - _pocu;
	document.querySelector('#formfiltro #cantvisible').innerHTML=_cvis;
	document.querySelector('#formfiltro #porcvisible').innerHTML=_pvis+'%';
	
}	

function ordenarFilas(){
	_ordenSel=document.querySelector('#formfiltro select[name="orden"]').value;
	_ordenArr=_ComunicacionesOrden[_ordenSel];
	//_cc=0;
	for(_on in _ordenArr){
		//_cc++;
		//if(_cc>10){break;}
		_idcom=_ordenArr[_on];
		
		_fila=document.querySelector('.fila#fnc'+_idcom);
		_fila.parentNode.appendChild(_fila);
		//_fila.style.backgroundColor='red';	
	}
}


function opcionar(_this){
    _gid=_this.getAttribute('idgrupo');
    _ifor=_this.parentNode.getAttribute('for');
    _gnom=_this.innerHTML;
    _this.parentNode.parentNode.querySelector('input[name="'+_ifor+'-n"]').value=_gnom;
    _this.parentNode.parentNode.querySelector('input[name="'+_ifor+'"]').value=_gid;
    
    _t=_ifor.slice(-1);

	_subs=document.querySelectorAll('#listacargando > .subiendo');
	
	for(_sn in _subs){
		if(typeof _subs[_sn] != 'object'){continue;}
		//console.log(_t);
		//console.log("#Iid_p_grupos_id_nombre_tipo"+_t+"-n");
		
		_inn=_subs[_sn].querySelector("#Iid_p_grupos_id_nombre_tipo"+_t+"-n");
		
		_inid=document.querySelector("#Iid_p_grupos_id_nombre_tipo"+_t);
		_inid.setAttribute('valcolect',_gnom);
			
		if(
			_inid.getAttribute('origen')=='colectivo'
			||
			_inid.getAttribute('origen')=='archivo'
		){
			_inn.value=_gnom;
			_inid.setAttribute('origen','colectivo');
			_inid.value=_gid;
		}
	}
}

function opcionNo(_this){
	
	_name=_this.getAttribute('name');
    _oname=_name.substr(0,(_name.length - 2));
    _t=_name.slice(-3,-2);
    
    _vn=_this.value;
	if(_this.value=''){
		_v='';
	}else{
		_v='n';			
	}
	_this.parentNode.querySelector('input[name="'+_oname+'"]').value=_v;
    
    _subs=document.querySelectorAll('#listacargando .subiendo');
    
    for(_sn in _subs){
    	if(typeof _subs[_sn] != 'object'){continue;}
    	
    	_subs[_sn].queryselector('#Iid_p_grupos_id_nombre_tipo'+_t).setAttribute('valcolectivo',_vn);
    	_ori=_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t).getAttribute('origen');
    	
    	if(_ori=='archivo'&&_v!=''){
    		_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t).setAttribute('origen','colectivo');
    	}else if(_ori=='colectivo'&&_v==''){
    		_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t).setAttribute('origen','archivo');
    		_v=_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t).getAttribute('valarchivo');
    		_vn=_Grupos.grupos[_v].nombre;
    	}
    	
    	_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t).value=_v;
    	_subs[_sn].querySelector('#Iid_p_grupos_id_nombre_tipo'+_t+'-n').value=_vn;	
    }
}
    
function cerrar(_this){
    _this.parentNode.style.display='none';
}


function togleInt(_this){
	
	_ref=_this.getAttribute('id');
	_v_vie=_this.parentNode.parentNode.getAttribute(_ref);
	console.log(_ref+' -> '+_v_vie);
	if(_v_vie=='si'){_v_nue='no';}else{_v_nue='si';}
	_this.parentNode.parentNode.setAttribute(_ref,_v_nue);
	
}

function opcionarGrupos(_this){		//en formulario de carga masiva de archivos
	
    vaciarOpcionares();		
    _this.nextSibling.style.display="inline-block";
    _destino=_this.nextSibling.querySelector(".contenido");
    _id=_this.getAttribute('id');
    //console.log(_id);
    _tipo=_id.substring(27,28);
    //consultarGrupos(_destino,_tipo);		
    
    _this.nextSibling.style.display="inline-block";
    _destino=_this.nextSibling.querySelector(".contenido");
    _id=_this.getAttribute('id');		
    _destino.innerHTML='';
    //console.log(_cat);
    
    for(_nn in _Grupos.gruposOrden[_tipo]){
    	_idgrupo=_Grupos.gruposOrden[_tipo][_nn];
        _dat=_Grupos.grupos[_idgrupo];
        //console.log(_dat);
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('regid',_idgrupo);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
}

function filtrarOpciones(_this){
	if(_this.getAttribute('soloeditores')=='cambia'&&_HabilitadoEdicion!='si'){return;}
	_idi=_this.getAttribute('id');
	_idi=_idi.replace("-n", "");
	_that=_this.parentNode.querySelector('#'+_idi);
	_that.value='n';
	_str=_this.value;
	_str=_str.replace(/\s+/g,"");
	_str=_str.toLowerCase();
	
	_ops=_this.parentNode.querySelectorAll('.auxopcionar .contenido a');
	for(_no in _ops){
		if(typeof _ops[_no] != 'object'){continue;}
		_str2=_ops[_no].innerHTML;		
		_str2=_str2.replace(/\s+/g,"");
		_str2=_str2.toLowerCase();
		if(_str2.includes(_str)){
			_ops[_no].removeAttribute('filtrado');
		}else{
			_ops[_no].setAttribute('filtrado','si');
		}	
	}
}

function controOpcionBlur(_this){
	
	_t=_this.getAttribute('id').slice(-3,-2);
	
	_inid=_this.parentNode.querySelector('#Iid_p_grupos_id_nombre_tipo'+_t);
	
	if(_this.value==""){
		
		_v=document.querySelector('#editorArchivos > input[name="idg'+_t+'"]').value;
		_vn=document.querySelector('#editorArchivos > input[name="idg'+_t+'-n"]').value;
		
		if(_v!==''){
			_this.value=_vn;	
			_inid.value=_v;
			_inid.setAttribute('origen','colectivo');	
		}else{
			_v=_inid.getAttribute('valarchivo');
			_inid.value=_v;
			_inid.setAttribute('origen','archivo');
			_this.value=_Grupos.grupos[_v].nombre;
		}
	//_this.value="-";	AHORA USAMOSPLACEHOLDER
	}
	
}

function vaciarOpcionares(_event){	//en formulario de carga masiva de archivos			
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
    _idcat=_this.getAttribute('regid');
    console.log(_idcat);
    _regnom=_this.innerHTML;
    //console.log(_regnom);
    _regtit=_this.title;	
            
    _inputN=_this.parentNode.parentNode.previousSibling;
    _inputN.title=_regtit;
    _inputN.value=_regnom;
    
    _inputN.focus();
    _id=_inputN.getAttribute('id');
    _ff=_id.substring(0,(_id.length-2));
    //console.log(_ff +' -> asignando:'+_idcat);
    _input=_inputN.parentNode.querySelector('input#'+_ff);
    _input.value=_idcat;
    _input.setAttribute('origen','particular');
        				
}

