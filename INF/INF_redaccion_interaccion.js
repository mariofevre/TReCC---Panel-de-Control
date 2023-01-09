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

function renderBotonImprimir(){		
	document.querySelector('#botoneraV2 #paginar').style.display='block';	
}
	
function dragImagen(_event){			
		//alert(_event.target.getAttribute('idit'));
		
		_dests=document.querySelectorAll('#editordeimagen .separador');
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].setAttribute('destino','puede');
			}
		}
		
		
		if(_event.target.getAttribute('class')!='marco'){
			_tar=_event.target.parentNode;
		}else{
			_tar=_event.target;
		}
		_arr=Array();
		_arr={
			'idimg':_tar.getAttribute('idimg')
		};		
		_arb = JSON.stringify(_arr);
		_event.dataTransfer.setData("text", _arb);
	}
		
	function allowDropImagen(_event,_this){
		//console.log(_this.parentNode.getAttribute('idit'));
		//console.log(_event.dataTransfer);
		//limpiarAllow();	
		desalta();	
		_event.stopPropagation();
		_this.setAttribute('destino','si');
		_event.preventDefault();
	}
	
	function resalta(_event,_this){
		_dests=document.querySelectorAll('#editordeimagen [destino="si"]');
		desalta(_this);
		_this.setAttribute('destino','si');
		_event.stopPropagation();
	}
	function desalta(){
		//realta el div del item al que pertenese un título o una descripcion
		//_this.style.backgroundColor='#fff';
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].setAttribute('destino','puede');
			}
		}
	}

	function limpiarAllow(){
		_dests=document.querySelectorAll('#editordeimagen .separador');
		for(_nn in _dests){
			if(typeof _dests[_nn]=='object'){
				_dests[_nn].removeAttribute('destino');
			}
		}
	}
		
	function dropImagen(_event,_this){//ajustado a geogec
		
		_event.stopPropagation();
		_this.removeAttribute('style');
		_this.removeAttribute('destino');
		_event.preventDefault();
		//console.log(JSON.parse(_event.dataTransfer.getData("text")));
	    var _DragData = JSON.parse(_event.dataTransfer.getData("text")).idimg;
	   	_el=document.querySelector('#editordeimagen .portaimagen[idimg="'+_DragData+'"]');
	    
	    
	    _idsecc=document.querySelector('#editordeimagen').getAttribute('idsec');
	    
	    if(_event.target.getAttribute('class')=='separador'){
	    	
	    	if(_event.target.getAttribute('class')=='submedio'){
	    		_tar=_event.target.parentNode;
	    	}else{
	    		_tar=_event.target;
	    	}
	    	
	    	_refMarc=_event.target.parentNode;
	    	_dest=_refMarc.parentNode; 
		    _dest.insertBefore(_el,_refMarc);
		    
	    }else{
	    	alert('destino inesperado');	    	
	    	return;	    	
	    }
	   
	    _ordennuevo=document.querySelectorAll('#editordeimagen .portaimagen');
	    
	    _serie=Array();
	    for(_ni in _ordennuevo){
	    	if(typeof _ordennuevo[_ni]=='object'){
	    		_serie.push(_ordennuevo[_ni].getAttribute('idimg'));
	    	}
	    }
	   
	    _parametros={
	    	"idsecc":_idsecc,
	    	"idInf":_IdInforme,
	    	"serie":_serie
	    };
	    
 		$.ajax({
			url:   './INF/INF_ed_orden_imagenes.php',
			type:  'post',
			data: _parametros,
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				Actualizar(_res);				
			}
		});
		//envía los datos para editar el ítem*/
	}
	


function editarepigrafe(_this){
		
		_idimg=_this.parentNode.getAttribute('idimg');
		_cont=_this.innerHTML;		
		_form=document.getElementById('editordeepigrafe');
		_form.style.display='block';
		_form.querySelector('input[name="idimg"]').value=_idimg;
		_form.querySelector('input[name="idsecc"]').value=_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idsec');
		//_form.querySelector('textarea[name="epigrafe"]').value=_this.parentNode.getAttribute('idimg');
		
		var editor = tinymce.get('mce_epigrafe'); // use your own editor id here - equals the id of your textarea
		editor.setContent(_cont);
	}
	

function cargarInforme(_this){
		limpiarHTML();
		
		_carga=document.querySelectorAll('#listado a[estado="cargado"]');
		for(_cc in _carga){
			if(typeof _carga[_cc] == 'object'){
				_carga[_cc].setAttribute('estado','inactivo');
			}
		}
		
		
		_carga=document.querySelectorAll('#listado a.editor[estado="activo"]');
		for(_cc in _carga){
			if(typeof _carga[_cc] == 'object'){
				_carga[_cc].removeAttribute('onclick');
				_carga[_cc].setAttribute('estado','inactivo');
			}
		}
		
		
		_this.setAttribute('estado','cargado');
		_this.parentNode.querySelector('.editor').setAttribute('estado','activo');
		_this.parentNode.querySelector('.editor').setAttribute('onclick','editarInforme(this)');
			
		_IdInforme = _this.getAttribute('idinf');
		_NumInforme = _this.getAttribute('inum');
		consultarInforme();
	}
	

	 // crea una copia de cada parrafo en el input resumen (sin paginar)
	 	function guardarTextoResumen(){
	 		if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
	 		var _nuevoaux = document.createElement('div');
			_nuevoaux.setAttribute('id','resumen');
			document.getElementsByTagName("BODY")[0].appendChild(_nuevoaux);
			_losparrafos=document.getElementsByName('parrafoPaginado');
			for (var i = 0; i < _losparrafos.length; i++){
				if(_losparrafos[i]!='[object Text]'){		
					
					_rectan=_losparrafos[i].getBoundingClientRect();
					_rectan.top;
					//_losparrafos[i].innerHTML=_losparrafos[i].innerHTML+_rectan.top;
										
					_nparr=_losparrafos[i].getAttribute('id');
					_nparr=_nparr.substr(15,10);						
					_copia=_losparrafos[i].cloneNode(true);
					_copia.removeAttribute('name');
					_copia.removeAttribute('id');						
					_copia.setAttribute('id','parrafoprecarga');
					_copia.removeAttribute('class');
					_copia.setAttribute('class','pregarga');						
					document.getElementById('resumen').appendChild(_copia);	
				}
			}
			_t1=document.getElementById('informe').innerHTML;
			_t2=document.getElementById('JSgraficos').innerHTML;
			_tx=_t1+_t2;
			document.getElementById('textoparaguardar').value=_tx;	
			document.getElementById('resumenparaguardar').value=document.getElementById('resumen').innerHTML;
			document.getElementById('formTextoResumen').submit();
		}			
	

		function activarCargarJpgCarat(_this){
			_this.parentNode.querySelector('input[inti="activa"]').style.display='none';
		 	_this.parentNode.querySelector('input[inti="anade"]').style.display='inline-block';
		 	_this.parentNode.querySelector('input[inti="desactiva"]').style.display='inline-block';
		 	_this.parentNode.querySelector('input[name="epigrafe"]').style.display='inline-block';
		 	_this.parentNode.querySelector('input[name="archivo_F"]').style.display='inline-block';	
		}	
		
		function desactivarCargarJpgCarat(_this){
			_this.parentNode.querySelector('input[inti="activa"]').style.display='inline-block';
		 	_this.parentNode.querySelector('input[inti="anade"]').style.display='none';
		 	_this.parentNode.querySelector('input[inti="desactiva"]').style.display='none';
		 	_this.parentNode.querySelector('input[name="epigrafe"]').style.display='none';
		 	_this.parentNode.querySelector('input[name="archivo_F"]').style.display='none';	
		}
		

		function activarEstiloImagen(_this){			
			_idimg=_this.getAttribute('IDIMG');
			_form=document.getElementById('formEstiloImagen');
			_input1=document.getElementById('formEstiloImagenI2');
			_input1.value=_idimg;
			_input2=document.getElementById('formEstiloImagenI3');
			_input2.value=_this.value;			
			_form.submit();
			_input1.value='';
			_input2.value='';			
		}	
		

function auxSeccion(_this){
		
		_OrdPrev=_this.getAttribute('OrdPrev');	
		_IdSec=_this.getAttribute('IdSec');	
		
		_hrefNsecPrev='./agrega_f.php?accion=agrega&tabla=INFsecciones&campofijo=orden&campofijo_c='+_OrdPrev+'&campofijob=id_p_INFmodelo_id&campofijob_c=".$modeloid."';		
		_hrefEdSec='./agrega_f.php?accion=cambia&tabla=INFsecciones&id='+_IdSec;
		_hrefNuAuto='./agrega_f.php?accion=agrega&tabla=INFseccionAUTO&campofijo=id_p_INFsecciones_id&campofijo_c='+_IdSec;			
		
		_cont='';
		_cont=_cont+'<a title=\"nueva secciï¿½n previa\" href=\"'+_hrefNsecPrev+'\"> + nueva Secciï¿½n</a>';
		_cont=_cont+'<a title=\"modificar esta secciï¿½n\" href=\"'+_hrefEdSec+'\">@ editar Secciï¿½n</a>';
		_cont=_cont+'<a title=\"incorporar automatizaciï¿½n a esta secciï¿½n\" href=\"'+_hrefNuAuto+'\">+ nuevo cont Auto</a>';
		
		_autosdesec=_Secciones[_IdSec];
		
		for (i = 0; i < _autosdesec.length; i++) {
			
			if(_autosdesec[i] !== undefined){	
				_hrefEdAuto='./agrega_f.php?accion=cambia&id='+i+'&tabla=INFseccionAUTO&campofijo=id_p_INFsecciones_id&campofijo_c='+_IdSec;
				_cont=_cont+'<a title=\"modificar componenete automatizado:'+_autosdesec[i]+'\" href=\"'+_hrefEdAuto+'\"> @ editar cont. Auto ('+i+')</a>';
			}			    
		}
		
		_this.style.height='80px';
		_this.style.width='150px';
		_this.innerHTML=_cont;
		
	}

	function auxDeSeccion(_this){
		_this.innerHTML='';
		_this.style.height='auto';
		_this.style.width='';
	}
	



function cerrarFormEstado(_idform){
	console.log(_idform);
	console.log(document.querySelector('.formCent#'+_idform));
	document.querySelector('.formCent#'+_idform).removeAttribute('estado');
}
function cerrarForm(){
    
    _form=document.querySelector('#formmodelo.formCent');
    _form.style.display='none';
    _inn=_form.querySelectorAll('input,textarea');
    for(_nn in _inn){
        if(typeof _inn[_nn]=='object'){
            if(_inn[_nn].getAttribute('fijo')=='fijo'){
                
            }else{
                if(_inn[_nn].getAttribute('type')!=undefined){
                    if(_inn[_nn].getAttribute('type')=='button'){continue;}
                    
                    if(_inn[_nn].getAttribute('type')=='radio'){
                        _inn[_nn].checked=false;
                    }else{
                        _inn[_nn].value='';
                    }                    
                }else{
                    _inn[_nn].value='';
                }
            }
        }
    }
    
    document.getElementById('mid').innerHTML='0000';
    _ac=document.getElementById('acancelarElim');
    if(_ac!=undefined){_ac.parentNode.removeChild(_ac);}
    _ae=document.getElementById('aElim');
    if(_ae!=undefined){_ae.parentNode.removeChild(_ae);}
    document.getElementById('aactivaElim').style.display="inline-block";
    
}

	function cerrar(_this){
		
		_subs=_this.parentNode.querySelectorAll('.archivo[subiendo="si"]');
		for(_sn in _subs){	
			if(typeof(_subs[_sn])!='object'){continue;}
			_pos=_subs[_sn].getBoundingClientRect();console.log(_pos);		
			document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
			_subs[_sn].style.position='relative';
			_sr=($(window).width() - _pos.right )+'px'
			_subs[_sn].style.right =_sr;
			_sh=($(window).height() - _pos.bottom)+'px';
			_subs[_sn].style.bottom=_sh;
			console.log(_sr);console.log(_sh);		
			setTimeout(aCero, 1, _subs[_sn]);
		}
		
		
		_this.parentNode.style.display='none';
	}
	
	
function aCero(_sub){
	_sub.style.right='0';
	_sub.style.bottom='0';
}


function updateProgress(evt) {
  if (evt.lengthComputable) {
  	var percentComplete = 100 * evt.loaded / evt.total;		 
	this.li.querySelector('#barra').style.width=Math.round(percentComplete)+"%";
	this.li.querySelector('#val').innerHTML="("+Math.round(percentComplete)+"%)";
  } else {
    // Unable to compute progress information since the total size is unknown
  }
}

	function drag(ev,_this){
		_this.style.opacity='0.5';
	    ev.dataTransfer.setData("text", _this.getAttribute('idcomp'));
	}
	
	function dragSecc(ev,_this){
		_this.style.opacity='0.5';
	    ev.dataTransfer.setData("text", _this.getAttribute('idsecc'));
	}
				
	function drop(ev,_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		ev.preventDefault();
		console.log(_this);
		console.log(ev);
		
		var _idcomp = ev.dataTransfer.getData("text");
		
		_papa=_this.parentNode;
		//alert(_idcomp);
		_uno=_papa.querySelector("div[idcomp='"+_idcomp+"']");
		_dos=_uno.nextSibling;
		_dest=ev.target;
		_papa.insertBefore(_uno,_dest);
		_papa.insertBefore(_dos,_uno);
		
		
		_this.removeAttribute('style');
		
		_tags=_this.parentNode.querySelectorAll('.componenteOrg');
		var param = {
			'idsecc':_this.parentNode.parentNode.querySelector("input[name='id']").getAttribute('value')
		};
		param.comps = Array();
		
		for(_en in _tags){
			
			if(typeof _tags[_en]=='object'){
				if(_idcomp!=null){
					_idcomp=_tags[_en].getAttribute('idcomp');
					param.comps.push(_idcomp);
				}		
			}
					
		}
		
		
		$.ajax({
				data:  param,
				url:   './INF/INF_ed_orden_comp.php',
				type:  'post',
				success:  function (response){
					var _res = $.parseJSON(response);
					console.log(_res);
					if(_res.res='exito'){		
						
					}else{
						
					}
				}
		});
	
	
	}


			


	function togleSeccFech(_this){
		
		_elem=_this.parentNode.querySelectorAll('input[too="fechasDisc"]');
		
		for(_ni in _elem){
			if(typeof _elem[_ni]!='object'){continue;}
			if(_this.checked==true){
				_elem[_ni].removeAttribute('readonly');
			}else{
				_elem[_ni].setAttribute('readonly','readonly');
				_elem[_ni].value='';
			}
		}
		
	}
	
	function togleDisp(_this){
		_for= _this.getAttribute('for');
		_input=_this.parentNode.querySelector('[name="'+_for+'"]');
		
		if(_this.checked==true){
			_input.value=_this.getAttribute('act');
		}else{
			_input.value=_this.getAttribute('inact');
		}
		
	}
	

	function referenciarComponente(_this){
		alert('puede referenciar este archivo con el siguiente link: '+_this.getAttribute('ref'));
	}
	
	
	function agranda(ev,_this){
		ev.preventDefault();
		_this.style.height='15px';
		_this.style.backgroundColor='#08afd9';
	}
	function desgranda(_this){
		_this.removeAttribute('style');
	}
	
	function achica(ev,_this){
		ev.preventDefault();
		_this.style.height='8px';
		_this.style.opacity='0.5';
	}
	
	
	function dragSecc(ev,_this){
		_this.style.opacity='0.5';
	    ev.dataTransfer.setData("text", _this.getAttribute('idsecc'));
	}
	
	function dropSecc(ev,_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		ev.preventDefault();
		console.log(_this);
		console.log(ev);
		
		var _idsecc = ev.dataTransfer.getData("text");
		
		_papa=_this.parentNode;
		console.log("div[idsecc='"+_idsecc+"']");
		_uno=_papa.querySelector("div[idsecc='"+_idsecc+"']");
		_dos=_uno.nextSibling;
		_dest=ev.target;
		_papa.insertBefore(_uno,_dest);
		_papa.insertBefore(_dos,_uno);
		
		
		_this.removeAttribute('style');
		
		_tags=_this.parentNode.querySelectorAll('.seccionOrg');
		var param = {
			'idmod':_this.parentNode.parentNode.querySelector("input[name='idmodelo']").getAttribute('value')
		};
		param.seccs = Array();
		
		for(_en in _tags){
			
			if(typeof _tags[_en]=='object'){
				if(_idcomp!=null){
					_idsecc=_tags[_en].getAttribute('idsecc');
					param.seccs.push(_idsecc);
				}		
			}
					
		}
		
		
		$.ajax({
				data:  param,
				url:   './INF/INF_ed_orden_secc.php',
				type:  'post',
				success:  function (response){
					var _res = $.parseJSON(response);
					console.log(_res);
					if(_res.res='exito'){		
						
					}else{
						
					}
				}
		});

	}
			
	function allowDrop(ev) {
	    ev.preventDefault();
	}
