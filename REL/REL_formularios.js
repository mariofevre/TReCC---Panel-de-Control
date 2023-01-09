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
//Funciones de generación de formularios

var _accionactiva = 'nuevaincidencia';
var _idLocNuevopunto = 0;

function activarNuevopunto(_id) {
	_accionactiva = 'nuevopunto';
	_idLocNuevopunto = _id;
}

//creador de filas candidatos, nuevas localizaciones a validar por agrega_mini.php
function crearcandidato(_this) {

	_modelo = document.getElementById("modelo");
	_clon = _modelo.cloneNode(true);
	_clon.setAttribute("id", "candidato");
	_dest = document.getElementById("localizaciones")
	_dest.insertBefore(_clon, _dest.childNodes[2]);
	var _campos = _this.parentNode.getElementsByClassName("campo");

	_contenedores = document.getElementById("candidato").childNodes;
	_contenedores[0].childNodes[0].innerHTML = _campos[3].value;
	_contenedores[0].childNodes[1].innerHTML = _campos[4].value;
	_contenedores[0].childNodes[2].innerHTML = _campos[5].value;

	_contenedores[1].innerHTML = _campos[6].value;
	_contenedores[2].innerHTML = _campos[7].value;
	_contenedores[3].childNodes[0].src = '';

}

//creador de formulario y puntos candidatos, nuevas localizaciones a validar por agrega_mini.php
_formularLocalizacionSeteado = 'no';
function formularLocalizacion(_idloc) {

	actualizarTiposForm();
	deFormularLocalizacion();
	
	
	_divs = document.querySelectorAll('#listalocalizaciones > a');
	for (_nd in _divs) {
		if ( typeof _divs[_nd] != 'object') {continue;}
		_divs[_nd].setAttribute('cargado', 'no');
	}	
	if(document.querySelector('#listalocalizaciones > a[idloc="' + _idloc + '"]')==null){
		listarLoc(_idloc);
	}
	document.querySelector('#listalocalizaciones > a[idloc="' + _idloc + '"]').setAttribute('cargado', 'si');

	_form = document.querySelector('#formlocalizacion');
	_form.style.display = 'block';
	_form.setAttribute('idloc', _idloc);
	
	
	_form.querySelector('[name="locx"]').value = _DataLocalizaciones[_idloc].locx;
	_form.querySelector('[name="locy"]').value = _DataLocalizaciones[_idloc].locy;

	_form.querySelector('[name="descripcion"]').value = _DataLocalizaciones[_idloc].descripcion;
	_form.querySelector('[name="observaciones"]').value = _DataLocalizaciones[_idloc].observaciones;
	if(_DataLocalizaciones[_idloc].observaciones!=''){
		_form.querySelector('#b_obs').setAttribute('estado','activo');
	}
	
	if (_DataTipos[_DataLocalizaciones[_idloc].id_p_RELtipos_id_nombre] != undefined) {
		_txtipo = _DataTipos[_DataLocalizaciones[_idloc].id_p_RELtipos_id_nombre].nombre;
	} else {
		_txtipo = '';
	}
	
	_form.querySelector('#codnomloc').innerHTML = "<span class='titulo criticidad " + _DataLocalizaciones[_idloc].criticidad + "'></span> - " +  _txtipo;
	
	_form.querySelector('[name="acciontipo"] [value="' + _DataLocalizaciones[_idloc].acciontipo + '"]').selected = true;

	_form.querySelector('[name="id_p_RELtipos_id_nombre_n"]').value = _txtipo;
	_form.querySelector('[name="fecha"]').value = _DataLocalizaciones[_idloc].fecha;
	_form.querySelector('[name="criticidad"][value="' + _DataLocalizaciones[_idloc].criticidad + '"]').checked = true;
	_form.querySelector('[name="diagnostico"]').value = _DataLocalizaciones[_idloc].diagnostico;
	_form.querySelector('[name="curso"]').value = _DataLocalizaciones[_idloc].curso;

	_form.querySelector('#adjuntoslista').innerHTML = '';

	if (_DataLocalizaciones[_idloc].FI_foto != '') {
		_daj = {
			'FI_foto' : _DataLocalizaciones[_idloc].FI_foto,
			'idadj' : _idloc
		}
		anadirAdjuntoLoc(_daj);
	}
}

function deFormularLocalizacion(){
	_form = document.querySelector('#formlocalizacion');
	_form.querySelector('#b_obs').setAttribute('estado','inactivo');
	_form = document.querySelector('#divobserv').setAttribute('activ','-1');
}

function actualizarTiposForm(){
	_op1=document.querySelector('.opciones[campo="id_p_RELtipos_id_nombre"] #enpanel');
	_op1.innerHTML='';
	_op2=document.querySelector('.opciones[campo="id_p_RELtipos_id_nombre"] #enpanel');
	_op2.innerHTML='';
	
	_cont=_op1;
	for (_nt in _DataTipos) {		
		_anc = document.createElement('a');
		_anc.setAttribute('onclick', 'opcionar(this)');
		_anc.setAttribute('id', _DataTipos[_nt].id);
		_anc.title = _DataTipos[_nt].nombre + " _ " + _DataTipos[_nt].descripcion;
		_anc.innerHTML = _DataTipos[_nt].nombre;
		_cont.appendChild(_anc);
	}
}

function formularPlano(_idplan) {
	_divs = document.querySelectorAll('#activadorplanos > a');
	for (_nd in _divs) {
		if ( typeof _divs[_nd] != 'object') {continue;}
		_divs[_nd].setAttribute('cargado', 'no');
	}
	
	if(document.querySelector('#activadorplanos > a[idpla="' + _idplan + '"]')==null){
		listarPlano(_idplan);
	}
	document.querySelector('#activadorplanos > a[idpla="' + _idplan + '"]').setAttribute('cargado', 'si');
	
	document.getElementById('labelcod').innerHTML=_DataPlanos[_idplan].codigo;
	_form = document.getElementById('formplano');
	_form.style.display = 'block';
	_form.setAttribute('idpla', _idplan);

	_form.querySelector('#codnomplano').innerHTML = _DataPlanos[_idplan].codigo + ' - ' + _DataPlanos[_idplan].nombre;
	_form.querySelector('[name="nombre"]').value = _DataPlanos[_idplan].nombre;
	_form.querySelector('[name="codigo"]').value = _DataPlanos[_idplan].codigo;
	_form.querySelector('[name="altura"]').value = _DataPlanos[_idplan].altura;
	_form.querySelector('[name="modo"] option[value="' + _DataPlanos[_idplan].modo + '"]').selected = true;

}

function formularRelevamiento(_idr) {
	_IdRelEdit = _idr;
	_form = document.getElementById('formrelevamiento');
	_form.style.display = 'block';
	_form.setAttribute('idrel', _idr);

	_divs = document.querySelectorAll('#listarelevamientos > a');
	for (_nd in _divs) {
		if ( typeof _divs[_nd] != 'object') {continue;}
		_divs[_nd].setAttribute('cargado', 'no');
	}
	if(document.querySelector('#listarelevamientos > a[idrel="' + _idr + '"]')!=null){
		document.querySelector('#listarelevamientos > a[idrel="' + _idr + '"]').setAttribute('cargado', 'si');
	}
	
	_form.querySelector('#codnomrel').innerHTML = _DataRelevamientos[_idr].nombre;
	_form.querySelector('[name="nombre"]').value = _DataRelevamientos[_idr].nombre;
	_form.querySelector('[name="descripcion"]').value = _DataRelevamientos[_idr].descripcion;
	_form.querySelector('[name="desde"]').value = _DataRelevamientos[_idr].desde;
	_form.querySelector('[name="hasta"]').value = _DataRelevamientos[_idr].hasta;

}

function cerrarFormLoc() {
	_form = document.querySelector('#formlocalizacion');
	_form.style.display = 'none';
	_form.setAttribute('idloc', '');
}

function cerrarFormPla() {
	
	_form = document.querySelector('#formplano');
	_form.style.display = 'none';
	_form.setAttribute('idpla', '');
}

function cerrarFormRel() {
	_form = document.querySelector('#formrelevamiento');
	_form.style.display = 'none';
	_form.setAttribute('idrel', '');
}

function cerrar(_this){
	_this.setAttribute('estado','cerrado');
}

///funciones para guardar archivos en Localizaciones

function resDrFile(_event) {
	//console.log(_event);
	document.querySelector('#contenedorlienzo').style.backgroundColor = 'lightblue';
	document.querySelector('#contenedorlienzo > label').style.display = 'block';
}

function desDrFile(_event) {
	//console.log(_event);
	document.querySelector('#contenedorlienzo').removeAttribute('style');
	document.querySelector('#contenedorlienzo > label').removeAttribute('style');
}

var _nFile = 0;
var xhr = Array();
var inter = Array();
function cargarCmpLoc(_this) {

	var files = _this.files;
	if (document.querySelector('#formlocalizacion').getAttribute("idloc").value < 1) {
		alert('error al enviar archivos');
		return;
	}
	_idloc = document.querySelector('#formlocalizacion').getAttribute("idloc");
	for ( i = 0; i < files.length; i++) {
		_nFile++;
		console.log(files[i]);
		var parametros = new FormData();
		parametros.append('upload', files[i]);
		parametros.append('nfile', _nFile);

		parametros.append('idloc', _idloc);

		var _nombre = files[i].name;
		_upF = document.createElement('p');
		_upF.setAttribute('nf', _nFile);
		_upF.setAttribute('class', "archivo");
		_upF.setAttribute('size', Math.round(files[i].size / 1000));
		_upF.innerHTML = files[i].name;
		document.querySelector('#listadosubiendo').appendChild(_upF);

		_nn = _nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './REL/REL_ed_guarda_adjunto_loc.php', true);
		xhr[_nn].upload.li = _upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);

		xhr[_nn].onreadystatechange = function(evt) {
			//console.log(evt);

			if (evt.explicitOriginalTarget.readyState == 4) {
				var _res = $.parseJSON(evt.explicitOriginalTarget.response);
				//console.log(_res);

				if (_res.res == 'exito') {
					_file = document.querySelector('#listadosubiendo > p[nf="' + _res.data.nf + '"]');
					_file.parentNode.removeChild(_file);
					_DataLocalizaciones[_res.data.idloc].FI_foto = _res.data.ruta;
					_daj = {
						'FI_foto' : _res.data.ruta,
						'idadj' : _res.data.idloc
					}
					anadirAdjuntoLoc(_daj);
				} else {
					_file = document.querySelector('#listadosubiendo > p[nf="' + _res.data.nf + '"]');
					_file.innerHTML += ' ERROR';
					_file.style.color = 'red';
				}
				//cargaTodo();
				//limpiarcargando(_nombre);

			}

		}
		xhr[_nn].send(parametros);

	}
}

function updateProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = 100 * evt.loaded / evt.total;
		this.li.style.width = Math.round(percentComplete) + "%";
	} else {
		// Unable to compute progress information since the total size is unknown
	}
}

function eliminaAdjuntoLoc(_this, _event) {
	_event.preventDefault();
	_event.stopPropagation();

	_tx = _this.parentNode.querySelector('.epigrafe').innerHTML;
	if (!confirm('¿Borramos este adjunto (' + _tx + ')?.. ¿Segure?')) {
		return;
	}

	_parametros = {
		'panid' : _PanId,
		'idadj' : _this.parentNode.getAttribute('idadj'),
		'idacc' : document.querySelector('form#accion input[name="idacc"]').value
	};

	$.ajax({
		url : './SEG/SEG_ed_borrar_adjunto.php',
		type : 'post',
		data : _parametros,
		error : function(response) {
			alert('error al intentar contatar el servidor');
		},
		success : function(response) {

			var _res = $.parseJSON(response);
			for (_nm in _res.mg) {
				alert(_res.mg[_nm]);
			}
			if (_res.res != 'exito') {
				alert('error durante la consulta en el servidor');
				return
			}

			_ele = document.querySelector('form#accion #adjuntos .adjunto[idadj="' + _res.data.idadj + '"]');
			_ele.parentNode.removeChild(_ele);
		}
	});
}

function anadirAdjuntoLoc(_daj) {
	_div = document.createElement('div');
	_div.setAttribute('class', 'adjunto');
	_div.setAttribute('ruta', _daj.FI_foto);
	_div.setAttribute('idadj', _daj.idloc);
	_div.setAttribute('onclick', 'mostrarAdjunto(this)');

	_img = document.createElement('img');
	_img.setAttribute('src', _daj.FI_foto);
	_div.appendChild(_img);

	_epi = document.createElement('div');
	_epi.setAttribute('class', 'epigrafe');
	_epi.innerHTML = _daj.nombre;
	_div.appendChild(_epi);

	_borr = document.createElement('a');
	_borr.setAttribute('class', 'elimina');
	_borr.setAttribute('onclick', 'eliminaAdjunto(this,event)');
	_borr.innerHTML = 'x';
	_borr.title = 'Eliminar este adjunto';
	_div.appendChild(_borr);

	document.querySelector('#formlocalizacion #adjuntoslista').appendChild(_div);
}

function mostrarAdjuntoLoc(_this) {

	_ruta = './documentos/p_' + _PanId + '/SEG/original/' + _this.getAttribute('ruta');
	window.open(_ruta, '_blank');

}

//FUncionees de interacción general

function actualizarOpciones(_this) {

	_campo = _this.getAttribute('campo');
	_fuente = _this.getAttribute('fuente'); _this

	_campo = _this.getAttribute('campo');
	_this.parentNode.querySelector('[name="' + _campo + '"]').value = 'n';
	
	console.log('[name="' + _campo + '"]');
	if (_this.value == '') {
		_this.parentNode.querySelector('[name="' + _campo + '"]').value = '';
	}

}

function opcionar(_this) {
	_id = _this.getAttribute('id');
	_campo = _this.parentNode.parentNode.getAttribute('campo');

	_tx = _this.innerHTML;
	_this.parentNode.parentNode.parentNode.querySelector('input[name="' + _campo + '_n"]').value = _tx;
	_this.parentNode.parentNode.parentNode.querySelector('input[name="' + _campo + '"]').value = _id;
	opcionesNo(_this);
}

function opcionNo(_this) {
	_name = _this.getAttribute('name');
	_campo = _this.getAttribute('campo');
	_this.parentNode.querySelector('input[name="' + _campo + '"]').value = 'n';	
}

function opcionesSi(_this) {
	_name = _this.getAttribute('name');
	_campo = _this.getAttribute('campo');
	document.querySelector('.opciones[campo="' + _campo + '"]').style.display = "block";
}

function opcionesNo(_this) {
	_name = _this.getAttribute('name');
	var _campo = _this.getAttribute('campo');
	
	setTimeout(function () {
        document.querySelector('.opciones[campo="' + _campo + '"]').style.display = "none";
    }, 200);
}		

function togle(_ideelem){
	_a=document.getElementById(_ideelem).getAttribute('activ');	
	_a=_a*-1;
	document.getElementById(_ideelem).setAttribute('activ',_a);
}

function tecleoGeneral(){
	//faltafdefinir;
}
