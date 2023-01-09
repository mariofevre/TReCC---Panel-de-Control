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

function cambiaModo(_valor){
	
	_Modo=_valor;
	console.log('pp');
	if(_valor=='tabla'){
		document.querySelector('#creadoc').setAttribute('disabled','disabled');
		document.querySelector('#subedoc').setAttribute('disabled','disabled');
		document.querySelector('#ayudaVerCompleta').style.display='none';
		document.querySelector('#ayudaVerResumen').style.display='none';
		document.querySelector('#ayudaVerData').style.display='none';
	}else{
		document.querySelector('#creadoc').removeAttribute('disabled');
		document.querySelector('#subedoc').removeAttribute('disabled');
		document.querySelector('#ayudaVerCompleta').removeAttribute('style');
		document.querySelector('#ayudaVerResumen').removeAttribute('style');
		document.querySelector('#ayudaVerData').removeAttribute('style');
	}
	consultarDocs();
}

function toogle(_elem){//utiliado por la barra de filtros para activar y desactivar botones imitando el radio button
	_nombre=_elem.parentNode.parentNode.getAttribute('campo');
	
	elementos = document.getElementsByName(_nombre);
	
	for (x=0;x<elementos.length;x++){			
		elementos[x].removeAttribute('checked');
	}
	_elem.previousSibling.setAttribute('checked','checked');		
}	


function drag_start(_event,_this) {
		//console.log(_this);
		//console.log(_event);
        if(_excepturadragform=='si'){
            return;
        }
        //_event.stopPropagation();
        
        if(isResizing){console.log('resizing');return;}
        
        var crt = _this.cloneNode(true);
        crt.style.display = "none";
        _event.dataTransfer.setDragImage(crt, 0, 0);
        
        var style = window.getComputedStyle(_event.target, null);
         //console.log(style.getPropertyValue("left"));
         //console.log(parseInt(style.getPropertyValue("left"),10) - _event.clientX);
         
	    _rect=_this.getBoundingClientRect();
	    
        _event.dataTransfer.setData(
            "text/plain",        
            _event.clientX + ',' + _event.clientY + ',' + _rect.left + ',' + _rect.top + ','+ _this.getAttribute('tipo')
        );
 	    
	    return false;
	    	    
	} 
	
	
	
	function drag_over(_event,_this){
				
		_event.preventDefault();
		
	    _ini = _event.dataTransfer.getData("text/plain").split(',');
	    if(_ini[0]==''){
	    	//sin datos tal vez un archivo, se asume que debe ser suspendida esta aación
	    	return;
	    }
		var dm = document.querySelector('#formCent[tipo="'+_ini[4]+'"]');
	    //console.log(_ini);
	    _offsetx=_event.clientX-_ini[0];
	    _offsety=_event.clientY-_ini[1];
		
		_left=parseInt(Number(_ini[2])+_offsetx);
		_top=parseInt(Number(_ini[3])+_offsety);
		
	    dm.style.left = _left + 'px';
	    dm.style.top = _top + 'px';
	    
	    return false; 
	}
	
	function reposForm(_this) {
		_this.removeAttribute('style');
		_this.style.display='block';
	}
	

function multifiltro(_this,_event){ 

	if (_event.ctrlKey==1){ // con ctrl apretado incrementará la seleccion
		
		_estadoseleccion = _this.className;
		_valor = _this.value;
					
		if(_estadoseleccion == 'seleccionado'){

			_this.className='';	
			//alert(_valor);				
			document.getElementById(_valor).setAttribute('disabled','disabled');				
			delete _seleccionfiltros[_valor];
						

		}else if(_estadoseleccion == ''){
			_seleccionfiltros[_valor]=_valor;
			document.getElementById(_valor).removeAttribute('disabled');				
			//_this.className='seleccionado';
		}
		
		_selecciontxfiltros='';
		
		for (i in _seleccionfiltros){
			document.getElementById
		    _selecciontxfiltros=_selecciontxfiltros+"&filtro["+i+"]="+i;
		}
		
		document.getElementById('filtro').value=_selecciontxfiltros;
		
	}else{
		window.location='./documentos.php?filtro[]=' + _this.value;
	}
}	


for (i in _seleccionfiltros){
    _selecciontxfiltros=_selecciontxfiltros+"&filtro["+i+"]="+i;
	document.getElementById(i).removeAttribute('disabled');	    
}


_elem = document.getElementsByName('cuadrodeversiones');
for (var i = 0; i < _elem.length; ++i) {		
	_elem[i].scrollLeft = 100;
}	

function mostrar(){
	$(".accionseleccion").css("color","black");
}

function esrespuesta(_origen){
	_destino = "./comunicacionesrespuesta.php?origen="+_origen+"&respuesta="+_seleccion;
	window.location = _destino;
}

function titila(identificador,_cuenta,_texto){
	_a = _a + _cuenta;
	var elementos = document.getElementsByName(identificador);
	if(_cuenta==1){
		_seleccionv	= _seleccion; 
		_seleccion	= _seleccion + "_" +_texto;
	}else{
		_seleccionv	= _seleccion; 
		_seleccion = _seleccion.replace("_"+_texto, "");
	}
	if(_a>0){
		var _selectos = _seleccion.split('_'); 
		for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'block';
			
			_vieja=(elementos[x].href);
			elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
			
			for (y=0;y<_selectos.length;y++){
				if (elementos[x].getAttribute("incompatible")==_selectos[y]){
					elementos[x].style.display = 'none';
				}
			}
		}
	}else{
		for (x=0;x<elementos.length;x++){			
			elementos[x].style.display = 'none';
			_vieja=(elementos[x].href);
			elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
		}
	}
}

function oculta(name){
	var elementos = document.getElementsByName(name);
	for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'none';
	}
}
function muestra(name){
	var elementos = document.getElementsByName(name);
	for (x=0;x<elementos.length;x++){
			elementos[x].style.display = 'block';
	}
}


function cerrar(_this){
	_this.parentNode.style.display='none';
}

function resaltafila(_event,_this){
	_sels=document.querySelectorAll(".fila[resaltado='si']");
	for(_ns in _sels){
		if(typeof _sels[_ns] != 'object'){continue;}
		desaltafila(_event,_sels[_ns]);
	}
	_this.setAttribute('resaltado','si');
}

function desaltafila(_event,_this){
	_this.removeAttribute('resaltado');
	
}

function tecleoGeneral(_event){
	//console.log(_event.keyCode);
	
	if(_event.keyCode==27){
		
		
		
		if(document.querySelector('body > div.alerta')!=null){
			_al=document.querySelector('body > div.alerta');
			_al.parentNode.removeChild(_al);
			return;
		}
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
			document.querySelector('form#formCent[tipo="version"]')!=null
		){
			cerrarForm('version');
			return;
		}		
		if(
			document.querySelector('form#formCent[tipo="documento"]')!=null
		){
			cerrarForm('documento');
			return;
		}
	}
}

function ponerEstadoDrag(_tipo,_estado){
		document.querySelector('#formCent[tipo="'+_tipo+'"]').setAttribute('draggable',_estado);
}

function cerrarForm(_tipo){
	if(_tipo!=undefined){
		//admite formularos simulatneos
		_ff=document.querySelector('#formCent[tipo="'+_tipo+'"]');
		
		
		if(_tipo=='version'){
				
			_subs=document.querySelectorAll('#formCent[tipo="version"] a.archivo[subiendo="si"]');
			for(_sn in _subs){
				if(typeof(_subs[_sn])!='object'){continue;}
				_pos=_subs[_sn].getBoundingClientRect();//console.log(_pos);		
				document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
				_subs[_sn].style.position='relative';
				_sr=($(window).width() - _pos.right )+'px'
				_subs[_sn].style.right =_sr;
				_sh=($(window).height() - _pos.bottom)+'px';
				_subs[_sn].style.bottom=_sh;//console.log(_sr);//console.log(_sh);		
				setTimeout(aCero, 1, _subs[_sn]);
			}
			
			_IdVer=null;
			
			_ff.querySelector("#Inumero").value='';			
			_ff.querySelector("#Iprevistoorig").value='';
			_ff.querySelector("#Iprevistoactual").value='';
			_ff.querySelector("#Ifechavence").value='';
			_ff.querySelector("#Ifechavence").value='';
			
			
			_ff.querySelector("#listadosubiendo").innerHTML='';
			_ff.querySelector("#listadosubido").innerHTML='';
			
			_ff.querySelector("#Idescripcion").innerHTML='';
			
			
			_ff.querySelector("#datoscomPresenta .vacia").onclick();
			_ff.querySelector("#datoscomAprueba .vacia").onclick();
			_ff.querySelector("#datoscomRechaza .vacia").onclick();
			_ff.querySelector("#datoscomAnula .vacia").onclick();
			
			_ff.querySelector("#listavisados").innerHTML='';
			_ff.setAttribute('estado','inactivo');
		}
		if(_tipo=='documento'){
			if(_IdVer==null){
				_IdDoc=null;
			}
			_ff.parentNode.removeChild(_ff);
		}
	}else{
		//no admite formularos simulatneos	
		_form=document.querySelector('form#formCent');
		_form.parentNode.removeChild(_form);
	}		
}



function filtrarActivar(){
	
	_input=document.querySelector('.botonerainicial #botonfiltros');
	_est=_input.getAttribute('estado');
	
	if(_est=='txsi'){
		_est='txno'
	}else if(_est=='txno'){
		_est='txsi'
	}else{
		_est='txsi';
	}
	_input.setAttribute('estado',_est);
	console.log(_input);
	_tx=_input.getAttribute(_est);
	_input.innerHTML=_tx;
	
	if(_est=='txsi'){
		document.querySelector('#contenidoextenso #formfiltro').style.display='block';
	}else{
		document.querySelector('#contenidoextenso #formfiltro').style.display='none';
		mostrarFiltros();
		cargaFiltros();
		filtrarDocs();
	}
}


function filtrarDocs(){
	
	filtrarPorGrupos();
	filtrarPorBusqueda();
	filtrarPorEstado();
	filtrarPorAdjuntos();
	filtrarPorNulos();
	
	computarFiltrados();
	filtrarTitulos();
		
}


function filtrarPorGrupos(){
	
	_val=document.querySelector('#formfiltro [name="grupoa"]').value;
	
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		if(_val=='todo'){
			_fila[_ns].setAttribute('filtroGa','ver');
			continue;
		}		
		if(_fila[_ns].getAttribute('ga')==_val){
			_fila[_ns].setAttribute('filtroGa','ver');
		}else{
			_fila[_ns].setAttribute('filtroGa','nover');
		}
	}
	
	
	_val=document.querySelector('#formfiltro [name="grupob"]').value;
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		if(_val=='todo'){
			_fila[_ns].setAttribute('filtroGb','ver');
			continue;
		}		
		if(_fila[_ns].getAttribute('gb')==_val){
			_fila[_ns].setAttribute('filtroGb','ver');
		}else{
			_fila[_ns].setAttribute('filtroGb','nover');
		}
	}
	
}




function filtrarPorEstado(){
	
	_val=document.querySelector('#formfiltro [name="estado"][checked="checked"]').value;
	
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		if(_val=='todo'){
			_fila[_ns].setAttribute('filtroE','ver');
			continue;
		}		
		console.log(_fila[_ns].getAttribute('estado')+' vs '+_val);
		if(_fila[_ns].getAttribute('estado')==_val){
			_fila[_ns].setAttribute('filtroE','ver');
		}else{
			_fila[_ns].setAttribute('filtroE','nover');
		}
	}
}

function filtrarPorAdjuntos(){
	
	_val=document.querySelector('#formfiltro [name="adjuntos"][checked="checked"]').value;
	
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		if(_val=='todo'){
			_fila[_ns].setAttribute('filtroF','ver');
			continue;
		}		
		if(_val=='s/ adjuntos'){
			if(_fila[_ns].getAttribute('adjuntos')=='si'){
				_fila[_ns].setAttribute('filtroF','nover');
			}else{
				_fila[_ns].setAttribute('filtroF','ver');
			}
		}
		if(_val=='c/ adjuntos'){
			if(_fila[_ns].getAttribute('adjuntos')=='si'){
				_fila[_ns].setAttribute('filtroF','ver');
			}else{
				_fila[_ns].setAttribute('filtroF','nover');
			}
		}
		
	}
}



function filtrarPorNulos(){
	
	_val=document.querySelector('#formfiltro [name="estado"][checked="checked"]').value;
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		if(_val=='todo'){
			_fila[_ns].setAttribute('filtroN','ver');
			continue;
		}		
		
		if(_fila[_ns].getAttribute('estado')=='anulado'){
			if(_val='no anulados'){			
				_fila[_ns].setAttribute('filtroN','nover');
			}else{			
				_fila[_ns].setAttribute('filtroN','ver');			
			}
		}else{
			if(_val='no anulados'){			
				_fila[_ns].setAttribute('filtroN','ver');
			}else{			
				_fila[_ns].setAttribute('filtroN','nover');			
			}
		}
	}
}



function filtrarPorBusqueda(){
		
	_val=document.querySelector('[name="busqueda"]').value;
				
	_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
	_hatch=_hatch.replace(/ /g, '');
	_hatch=_hatch.toLowerCase();
				
	
	if(_Modo=='tabla'){
		_fila=document.querySelectorAll('#contenidoextensoPost > table#cont > tr.fila');
	}else{
		_fila=document.querySelectorAll('#contenidoextensoPost .fila');	
	}
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		//console.log(_hatch.length);
		if(_hatch.length<2){
			_fila[_ns].setAttribute('filtroB','ver');
			continue;
		}
		
		_st=_fila[_ns].querySelector('.sector').innerHTML;
		_st+=_fila[_ns].querySelector('.planta').innerHTML;
		_st+=_fila[_ns].querySelector('.numero').innerHTML;
		_st+=_fila[_ns].querySelector('.nombre').innerHTML;
		_st+=_fila[_ns].querySelector('.escala').innerHTML;
		_st+=_fila[_ns].querySelector('.rubro').innerHTML;
		_st+=_fila[_ns].querySelector('.tipologia').innerHTML;
		_st+=_fila[_ns].querySelector('.fecha').innerHTML;
		_st+=_fila[_ns].title;
		
		_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
		_st=_st.replace(/ /g, '');
		_st=_st.toLowerCase();
		
		
		//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
		if(_st.indexOf(_hatch)>=0){
			_fila[_ns].setAttribute('filtroB','vera');
		}else{
			_fila[_ns].setAttribute('filtroB','nover');
			//console.log('nover');
		}
		
		_acc=_fila[_ns].querySelectorAll('.accion');
		for(_na in _acc){
			if(typeof _acc[_na] != 'object'){continue;}
			
			_st=_acc[_na].querySelector('.nombre').innerHTML;
			_st+=_acc[_na].title;
			
			_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
			_st=_st.replace(/ /g, '');
			_st=_st.toLowerCase();
				
			//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
			if(_st.indexOf(_hatch)>=0){
				_fila[_ns].setAttribute('filtroB','ver');
				_acc[_na].setAttribute('filtroB','ver');
			}else{
				_acc[_na].setAttribute('filtroB','nover');
			}					
		}		
	}
	

	
}

function filtrarTitulos(){
		
	if(_Modo=='tabla'){
		_renglones=document.querySelectorAll('#contenidoextensoPost > table#cont > tr');
	}else{
		_renglones=document.querySelectorAll('#contenidoextensoPost .fila, #contenidoextensoPost .titulo');	
	}
	
	_filasT1=0;
	_filasT2=0;
	_filasT3=0;
	_ultimoT1=null;
	_ultimoT2=null;
	_ultimoT3=null;
	
	for(_nr in _renglones){		
		if(typeof _renglones[_nr] != 'object'){continue;}		
		if(
			_renglones[_nr].getAttribute('class')=='titulo'
			||
			_renglones[_nr].getAttribute('class')=='titulines'
		){			
			_renglones[_nr].setAttribute('filtroB','ver');			
			if(_renglones[_nr].getAttribute('nivel')=='1'){			
				
				if(_ultimoT3!=null){					
					if(_filasT3==0){
						_ultimoT3.setAttribute('filtroB','nover');
					}else{
						_ultimoT3.setAttribute('filtroB','ver');
					}
					_ultimoT3=null;
				}
					
				if(_ultimoT2!=null){					
					if(_filasT2==0){
						_ultimoT2.setAttribute('filtroB','nover');
					}else{
						_ultimoT2.setAttribute('filtroB','ver');
					}
					_ultimoT2=null;
				}
				
				
				if(_ultimoT1!=null){					
					if(_filasT1==0){
						_ultimoT1.setAttribute('filtroB','nover');
					}else{
						_ultimoT1.setAttribute('filtroB','ver');
					}										
				}
				
				_ultimoT1=_renglones[_nr];
				_filasT1=0;
				_filasT2=0;
				_filasT3=0;
				
			}else if(_renglones[_nr].getAttribute('nivel')=='2'){
				
				if(_ultimoT3!=null){					
					if(_filasT3==0){
						_ultimoT3.setAttribute('filtroB','nover');
					}else{
						_ultimoT3.setAttribute('filtroB','ver');
					}
					_ultimoT3=null;
				}
					
				if(_ultimoT2!=null){
					if(_filasT2==0){					
						_ultimoT2.setAttribute('filtroB','nover');
					}else{
						_ultimoT2.setAttribute('filtroB','ver');
					}
				}
				
				_ultimoT2=_renglones[_nr];				
				_filasT2=0;
				_filasT3=0;
				
			}else if(_renglones[_nr].getAttribute('class')=='titulines'){
				_ultimoT3=_renglones[_nr];
			}
			
		}else if(_renglones[_nr].getAttribute('class')=='fila'){
			
			if(
				_renglones[_nr].getAttribute('filtroB')!='nover'
				&&
				_renglones[_nr].getAttribute('filtroGa')!='nover'
				&&
				_renglones[_nr].getAttribute('filtroGb')!='nover'
				&&
				_renglones[_nr].getAttribute('filtroE')!='nover'
				&&
				_renglones[_nr].getAttribute('filtroF')!='nover'
				&&
				_renglones[_nr].getAttribute('filtroN')!='nover'
			){
				_filasT1++;
				_filasT2++;
				_filasT3++;
			}
			
		}
	}

	if(_ultimoT3!=null){					
		if(_filasT3==0){
			_ultimoT3.setAttribute('filtroB','nover');
		}else{
			_ultimoT3.setAttribute('filtroB','ver');
		}
		_ultimoT3=null;
	}
		
	if(_ultimoT2!=null){
		if(_filasT2==0){		
			_ultimoT2.setAttribute('filtroB','nover');
		}else{
			_ultimoT2.setAttribute('filtroB','ver');
		}
	}
	
	if(_ultimoT1!=null){
		if(_filasT1==0){		
			_ultimoT1.setAttribute('filtroB','nover');
		}else{
			_ultimoT1.setAttribute('filtroB','ver');
		}										
	}
	
}


function computarFiltrados(){
	_str='#contenidoextensoPost .fila[filtroB="nover"],';
	_str+='#contenidoextensoPost .fila[filtroE="nover"],';
	_str+='#contenidoextensoPost .fila[filtroGb="nover"],';
	_str+='#contenidoextensoPost .fila[filtroGa="nover"],'
	_str+='#contenidoextensoPost .fila[filtroF="nover"],';
	_str+='#contenidoextensoPost .fila[filtroN="nover"]';
	
	_filas=document.querySelectorAll(_str);
	_filtrados=Object.keys(_filas).length;
	document.querySelector('#formfiltro #cantfiltrado').innerHTML=_filtrados;
	
	_filas=document.querySelectorAll('#contenidoextensoPost .fila');
	_totales=Object.keys(_filas).length;
	document.querySelector('#formfiltro #cantvisible').innerHTML=_totales-_filtrados;
}


function actualizarCantFiltro(){
	_filas=document.querySelectorAll('#contenidoextensoPost .fila');
	_tot=Object.keys(_filas).length;
	
	_str='#contenidoextensoPost .fila[filtroB="nover"],';
	_str+='#contenidoextensoPost .fila[filtroE="nover"],';
	_str+='#contenidoextensoPost .fila[filtroGb="nover"],';
	_str+='#contenidoextensoPost .fila[filtroGa="nover"],'
	_str+='#contenidoextensoPost .fila[filtroF="nover"],';
	_str+='#contenidoextensoPost .fila[filtroN="nover"]';
	
	_filas=document.querySelectorAll(_str);
	_fil=Object.keys(_filas).length;
	document.querySelector('#formfiltro #cantfiltrado').innerHTML=_fil+' ('+(_fil*100/_tot)+'%)';
	document.querySelector('#formfiltro #cantvisible').innerHTML=(_tot-_fil)+' ('+(_tot-_fil)*100/_tot+'%)';
}

function filtrarEstado(_this,_event){
	_params={};
	_aaa= $("#formfiltro form").serializeArray();
	//console.log(_aaa);
	for(_i in _aaa){
		if(typeof _aaa[_i] != 'object'){continue;}
		//console.log(_aaa[_i].name);
		_params[_aaa[_i].name]=_aaa[_i].value;
	}
	
	_fila=document.querySelectorAll('#contenidoextensoPost .fila');
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		//console.log(_hatch.length);
		if(_params.estado=='todo'){
			_fila[_ns].setAttribute('filtroE','ver');
			continue;
		}
		
		if(_fila[_ns].querySelector('.estado').innerHTML==_params.estado){
			_fila[_ns].setAttribute('filtroE','vera');
		}else{
			_fila[_ns].setAttribute('filtroE','nover');
		}
	}
}

function filtrarGrupoA(_this,_event){
	_params={};
	_aaa= $("#formfiltro form").serializeArray();
	//console.log(_aaa);
	for(_i in _aaa){
		if(typeof _aaa[_i] != 'object'){continue;}
		//console.log(_aaa[_i].name);
		_params[_aaa[_i].name]=_aaa[_i].value;
	}
	
	_fila=document.querySelectorAll('#contenidoextensoPost .fila');
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		//console.log(_hatch.length);
		if(_params.grupoa=='todo'){
			_fila[_ns].setAttribute('filtroGa','ver');
			continue;
		}
		
		
		if(_fila[_ns].getAttribute('ga')==_params.grupoa){
			_fila[_ns].setAttribute('filtroGa','vera');
		}else{
			_fila[_ns].setAttribute('filtroGa','nover');
		}

	}
}

function filtrarGrupoB(_this,_event){
	_params={};
	_aaa= $("#formfiltro form").serializeArray();
	//console.log(_aaa);
	for(_i in _aaa){
		if(typeof _aaa[_i] != 'object'){continue;}
		//console.log(_aaa[_i].name);
		_params[_aaa[_i].name]=_aaa[_i].value;
	}
	
	_fila=document.querySelectorAll('#contenidoextensoPost .fila');
	for(_ns in _fila){
		if(typeof _fila[_ns] != 'object'){continue;}
		
		//console.log(_hatch.length);
		if(_params.grupob=='todo'){
			_fila[_ns].setAttribute('filtroGb','ver');
			continue;
		}
		
		console.log(_fila[_ns].getAttribute('gb')+'=='+_params.grupob);
		if(_fila[_ns].getAttribute('gb')==_params.grupob){
			_fila[_ns].setAttribute('filtroGb','vera');
		}else{
			_fila[_ns].setAttribute('filtroGb','nover');
		}
	}
}



function categoriaform(){
	
		
}


function listarcategorias(_tipo){
	
		
}
