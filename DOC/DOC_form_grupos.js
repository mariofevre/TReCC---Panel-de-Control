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
/*
funciones js para operacion del formulario de versiones 
*/
	
var _DatosPanGrupos={};
var _idgrupoform='';
function grupoForm(_tipo,_grupo){
	if(_grupo=='n'){_grupo='';}
	if(_grupo==undefined){_grupo='';}
	_idgrupoform=_grupo;
	$.ajax({
		url:   './PAN/PAN_grupos_form.php',
		dataType: 'html',
		type: 'GET',
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown);
        } 
	}).done(function(html){
   	
       	_form=document.createElement('form');
		_form.setAttribute('id','FormPanGrupos');
		document.querySelector('body').appendChild(_form);		
		_form.innerHTML=html;
		_form.style.display='block';
		_form.querySelector('[name="tipo"] option[value="'+_tipo+'"]').selected = 'selected';
		_form.querySelector('[name="idgrupo"]').value = _idgrupoform;
		_param={
			'modulo':'todos'
		}
		$.ajax({
			data:  _param,
			url:   './PAN/PAN_grupos_consulta_lista.php',
			type:  'post',
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
	                alert("Estado: " + textStatus); 
			},success:  function (response){
				var _res = PreprocesarRespuesta(response);
				//Actualizar(_res);
				_DatosPanGrupos=_res.data;
				
				_tipo=_form.querySelector('[name="tipo"]').value;
				formGruposListar(_tipo);
				if(_idgrupoform!=''){
					formularGrupo(document.querySelector('#FormPanGrupos .fila [idgrupo="'+_idgrupoform+'"'));
				}
			}	
		});
	})	
}



function formGruposListar(_tipo){
	_form=document.querySelector('#FormPanGrupos');
	_tabla=_form.querySelector('table');
	
	_filas=_form.querySelectorAll('tr.fila');
	for(_nf in _filas){
		if(typeof _filas[_nf] !='object'){continue;}
		_filas[_nf].parentNode.removeChild(_filas[_nf]);
	}
	for(_gn in	_DatosPanGrupos.gruposOrden[_tipo]){
				
		_gid=_DatosPanGrupos.gruposOrden[_tipo][_gn];
		_gdat=_DatosPanGrupos.grupos[_gid];
		
		_tr=document.createElement('tr');
		_tr.setAttribute('class','fila');
		_tr.setAttribute('idgrupo',_gid);
		_tr.setAttribute('onclick','formularGrupo(this)');
		_tabla.appendChild(_tr);
	
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.setAttribute('campo','id');
		_td.innerHTML=_gdat.id;
	
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.nombre;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.codigo;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.descripcion;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.n_id_local;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.responsable;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.orden;
		
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_gdat.cant.DOC;
		
		_ctot=0;
		for(_mod in _gdat.cant){
			_ctot+=_gdat.cant[_mod];
		}
		_td=document.createElement('td');
		_tr.appendChild(_td);
		_td.innerHTML=_ctot;
		
	}
}



function formularGrupo(_this){
	
	_id=_this.querySelector('[campo="id"]').innerHTML;
	console.log(_id);
	_form=document.querySelector('#FormPanGrupos #formgrupo');
	_form.style.display='block';
	
	_form.querySelector('[name="id"]').value=_DatosPanGrupos.grupos[_id].id;
	_form.querySelector('[name="nombre"]').value=_DatosPanGrupos.grupos[_id].nombre;
	_form.querySelector('[name="codigo"]').value=_DatosPanGrupos.grupos[_id].codigo;
	_form.querySelector('[name="descripcion"]').value=_DatosPanGrupos.grupos[_id].descripcion;
	_form.querySelector('[name="responsable"]').value=_DatosPanGrupos.grupos[_id].responsable;
	_form.querySelector('[name="orden"]').value=_DatosPanGrupos.grupos[_id].orden;
}			
		
		
function cerrarFormGrupos(){
	_form=document.querySelector('#FormPanGrupos');
	_form.parentNode.removeChild(_form);	
}

function cerrarFormGrupo(){
	_form=document.querySelector('#FormPanGrupos #formgrupo');
	_form.style.display='none';		
}


function formGruposBorrarGrupo(){
	if(!confirm('¿Eliminamos este Grupo?... ¿Segure?')){return;}
	
	
	_idg=document.querySelector('#FormPanGrupos #formgrupo [name="id"]').value;
	_param={
		'idgrupo':_idg
	}
	$.ajax({
		data:  _param,
		url:   './PAN/PAN_ed_borra_grupo.php',
		type:  'post',
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); 
		},success:  function (response){
			var _res = PreprocesarRespuesta(response);
			
			grupoForm();
		}	
	});			
}
