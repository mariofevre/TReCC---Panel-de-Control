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


//funciones de envio y salida del formulario
	
	function eliminarPlan(_this){
		
		_id= document.querySelector('#form_pla input[name="id"]').value;
		_nivel= document.querySelector('#form_pla input[name="nivel"]').value;
		_cont=document.querySelectorAll('div[nivel="'+_nivel+'"][iddb="'+_id+'"] > div.contenidos > div');
		//console.log('div[nivel="'+_nivel+'"][iddb="'+_id+'"] > contenidos > div');
		//console.log(_cont);
		_cuenta=0;
		for(_in in _cont){
			if(typeof _cont[_in] != 'object'){continue;}
			_cuenta++;
		}
		if(_cuenta>1){
			alert('este componente tiene subcomponente. Antes debe eliminar los subcomponentes');
			return;
		}
		if(confirm("¿Realmente querés eliminar este componente?")){
			
			_params={
            	'panid': _PanId,
				"id":_id,
				"nivel":_nivel
			}
			$.ajax({
				data:_params,
				url:'./PLA/PLA_ed_borra_plan.php',
				type:'post',
				error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
                success:  function (response,status,xhr) {
                	_res = PreprocesarRespuesta(response);
					
					_ficha=document.querySelector('#contenidos > .ficha[iddb="'+_res.data.id+'"][nivel="'+_res.data.nivel+'"]');
					_ficha.parentNode.removeChild(_ficha);
					
					
					if(_res.res='exito'){
						quitarFila(_res.data.nivel,_res.data.id);
						//_this.parentNode.setAttribute('estado','inactivo');
						limpiarFormPlan();
					}
				}
			});

		}	
	}
	
			
				
	function guardarPlan(_this){
		_form=document.querySelector('#form_pla');
		
		_subs=_form.querySelectorAll('.archivo[subiendo="si"]');
		for(_sn in _subs){
			if(typeof(_subs[_sn])!='object'){continue;}
			_pos=_subs[_sn].getBoundingClientRect();console.log(_pos);		
			document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
			_subs[_sn].style.position='relative';
			_sr=($(window).width() - _pos.right )+'px'
			_subs[_sn].style.right =_sr;
			_sh=($(window).height() - _pos.bottom)+'px';
			_subs[_sn].style.bottom=_sh;
			//console.log(_sr);console.log(_sh);		
			setTimeout(aCero, 1, _subs[_sn]);
		}
			
						
		_innn=_form.querySelectorAll('input');
		_param={};		
		for(_nin in _innn){
			if(typeof _innn[_nin] != 'object'){continue;}
			if(_innn[_nin].getAttribute('type')=='button'){continue;}
			if(_innn[_nin].getAttribute('type')=='checkbox'){continue;}
			if(_innn[_nin].getAttribute('type')=='submit'){continue;}
			if(_innn[_nin].getAttribute('type')=='radio'){
				if(!_innn[_nin].selected){
					continue;
				}
			}
			if(_innn[_nin].getAttribute('exo')=='si'){continue;}
			if(_innn[_nin].getAttribute('name')==undefined){
				console.log('le falta name al siguiente:');
				console.log(_innn[_nin]);
				continue;
			}
			
			_name=_innn[_nin].getAttribute('name');
			_param[_name]=_innn[_nin].value;
		}
		
		
		//accion para absorber código basura generado por editores de texto al copiar pegar
		var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea
		_con=$('#form_pla #descripcion').html(editor.getContent({format: 'html'}));
		//_con=editor.getContent({format: 'html'});
		
		_contcrudo = _con['0'].innerHTML;
		//console.log(_contcrudo);
		$('#form_pla #descripcion').html(editor.setContent(_contcrudo, {format: 'HTML'}));	
		_param.descripcion=_contcrudo;
	
		var _comid=_param.id;
		
		if(_this.value=='guardar'){
			_param['modo']='actualizar';
		}else{
			_param['modo']='insertar';
		}
		
		$.ajax({
			data:_param,
			type:'post',
			url:'./PLA/PLA_ed_guarda_plan.php',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	_res = PreprocesarRespuesta(response);
				limpiarFormPlan();
				cargarPlan(_res.data.id,_res.data.nivel,_res.data.modo);
			}
		})
	}
	
	
	function guardarPlanEnca(_this){
		_form=document.querySelector('#form_pla_encabeza');
				
		var editor = tinymce.get('encabezado'); // use your own editor id here - equals the id of your textarea
		_con=$('#' + 'descripcion').html(editor.getContent({format: 'html'}));
		_contcrudo = _con['0'].innerHTML;
		$('#encabezado').html(editor.setContent(_contcrudo, {format: 'HTML'}));
		
					
		_param={
			
			'panid': _PanId,
			'encabezado':_contcrudo
		}
			
		$.ajax({
			data:_param,
			type:'post',
			url:'./PLA/PLA_ed_guarda_plan_encabezado.php',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	_res = PreprocesarRespuesta(response);
				limpiarFormPlan();
				cargarPlan(_res.data.id,_res.data.nivel,_res.data.modo);
			}
		})
	}
	
	
	function moverNivelPlan(_id,_nivel,_id_dest){
		_param={
			'panid': _PanId,
			'id':_id,
			'nivel':_nivel,
			'id_dest':_id_dest
		}		
		
		$.ajax({
			data:_param,
			type:'post',
			url:'./PLA/PLA_ed_mueve_plan.php',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	_res = PreprocesarRespuesta(response);
				limpiarFormPlan();
				borrarPlan(_res.data.id,_res.data.nivel);
				cargarPlan(_res.data.id,_res.data.nivel,'insertar');
			}
		})
		
	}
	
	
	
	function subirNivel(_this){
		
		_form=document.querySelector('#form_pla');
		_idp=_form.querySelector('[name="id"]').value;
		_nivel=_form.querySelector('[name="nivel"]').value;
		
		console.log(_idp);
		
		_subs=_form.querySelectorAll('.archivo[subiendo="si"]');
		for(_sn in _subs){
			
			if(typeof(_subs[_sn])!='object'){continue;}
			console.log('subiendo en curso:'+_sn);	
			_pos=_subs[_sn].getBoundingClientRect();console.log(_pos);		
			document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
			_subs[_sn].style.position='relative';
			_sr=($(window).width() - _pos.right )+'px'
			_subs[_sn].style.right =_sr;
			_sh=($(window).height() - _pos.bottom)+'px';
			_subs[_sn].style.bottom=_sh;
			//console.log(_sr);console.log(_sh);		
			setTimeout(aCero, 1, _subs[_sn]);
		}
		
		
		_param={
			'id':_idp,
			'nivel':_nivel
		}
		
		$.ajax({
			data:_param,
			type:'post',
			url:'./PLA/PLA_ed_nivel_sube_plan.php',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	_res = PreprocesarRespuesta(response);
				limpiarFormPlan();
				
				borrarPlan(_res.data.id,_res.data.nivel);
				cargarPlan(_res.data.nid,_res.data.nnivel,'insertar');
			}
		})
	}


	
	function bajarNivel(_id,_nivel,_id_dest,_nivel_dest){
		
		_form=document.querySelector('#form_pla');
		
		_subs=_form.querySelectorAll('.archivo[subiendo="si"]');
		for(_sn in _subs){
			
			if(typeof(_subs[_sn])!='object'){continue;}
			console.log('subiendo en curso:'+_sn);	
			_pos=_subs[_sn].getBoundingClientRect();console.log(_pos);		
			document.querySelector('#coladesubidas').appendChild(_subs[_sn]);
			_subs[_sn].style.position='relative';
			_sr=($(window).width() - _pos.right )+'px'
			_subs[_sn].style.right =_sr;
			_sh=($(window).height() - _pos.bottom)+'px';
			_subs[_sn].style.bottom=_sh;
			//console.log(_sr);console.log(_sh);		
			setTimeout(aCero, 1, _subs[_sn]);
		}
		
		
		_param={
			'id':_id,
			'nivel':_nivel,
			'id_dest':_id_dest,
			'nivel_dest':_nivel_dest
		}
		
		$.ajax({
			data:_param,
			type:'post',
			url:'./PLA/PLA_ed_nivel_baja_plan.php',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	_res = PreprocesarRespuesta(response);
				limpiarFormPlan();
				
				borrarPlan(_res.data.id,_res.data.nivel);
				cargarPlan(_res.data.nid,_res.data.nnivel,'insertar');
			}
		})
	}
	

///funciones cargar muestra
var _PlaCargada={};
function muestraPlan(_id,_nivel,_idpadre){

	_form=document.querySelector('#muestra_pla');
	_form.setAttribute('estado','activo');
	
	_this=document.querySelector('div[nivel="'+_nivel+'"][iddb="'+_id+'"]');

	_params={
        'panid': _PanId,
		"id":_id,
		"nivel":_nivel,
		"id_p_PLA":_idpadre //solo para crear un nuevo elemento, indica donde crearlo.
	};			
	$.ajax({
		data:_params,
		url:'./PLA/PLA_consulta_componente.php',
		type:'post'
	})
	.done(function (_data, _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}
		
		
		_PlaCargada=_res.data.componente;
		console.log(_PlaCargada);
		formularPlanmuestra();	// en PLA_js_interaccion
		
		_div=document.querySelector('#selectorarchivo .historico[id_reg_hist="'+_res.data.id_registro_rele+'"]');
		_div.parentNode.removeChild(_div);
		
		if(_res.res!='exito'){cancelarPlan(this);}
		
		cargarRegistroHistorico('actual');

	});			
}


///funciones cargar el formulario
var _PlaCargada={};
function iraPlan(_id,_nivel,_idpadre){

	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	
	_form=document.querySelector('#form_pla');
	_form.setAttribute('estado','activo');
	
	if(_id==''){
		//creando nuevo
		if(_nivel!='PLAn1' && _idpadre==''){
			alert('error, vuelva a intentar. No hemos identificado la ubicación del elemento a crear.');
			_form.style.display='none';
			return;
		}
		_form.querySelector('#ejec').value='crear';
		
	}else{
		_this=document.querySelector('div[nivel="'+_nivel+'"][iddb="'+_id+'"]');
		_form.querySelector('#ejec').value='guardar';	
	}
	
	
	_params={
        'panid': _PanId,
		"id":_id,
		"nivel":_nivel,
		"id_p_PLA":_idpadre //solo para crear un nuevo elemento, indica donde crearlo.
	};			
	$.ajax({
		data:_params,
		url:'./PLA/PLA_consulta_componente.php',
		type:'post'
	})
	.done(function (_data, _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}
		
		_PlaCargada=_res.data.componente;
		console.log(_PlaCargada);
		formularPlanCargado();		// en PLA_js_interaccion

	});		
}

/*
function formularPlanCargado(){
	
	_form=document.querySelector('#form_pla');
	_form.querySelector('[name="id"]').value=_PlaCargada.id;
	_form.querySelector('[name="nombre"]').value=_PlaCargada.nombre;					
	_form.querySelector('[name="numero"]').value=_PlaCargada.numero;
	_form.setAttribute('nivel',_PlaCargada.nivel);
	_form.querySelector('[name="nivel"]').value=_PlaCargada.nivel;
	
	_form.querySelector('[name="CO_color"]').value=_PlaCargada.CO_color;
	
	_form.querySelector('[name="id_p_GRAactores"]').value=_PlaCargada.id_p_GRAactores;
	
	_ch=_form.querySelector('input[for="zz_publico"]');
	if(_PlaCargada.zz_publico=='0'){
		_ch.checked = false;
	}else{
		_ch.checked = true;
	}
			
	
	_div=_form.querySelector('#atributoslista');
	_div.innerHTML='';
	for(_idcat in _DatosCategorias.depanel){
		
		_dat=_DatosCategorias.depanel[_idcat];
		if(_dat.nivel!=_PlaCargada.nivel){continue;}
		
		_div2=document.createElement('div');
		_div2.setAttribute('idcat',_idcat);
		_div.appendChild(_div2);
					
		_la=document.createElement('label');
		_la.innerHTML=_dat.nombre;
		_div2.appendChild(_la);
		
		_valor='';
		if(_PlaCargada.categorias[_idcat]!=undefined){
			_valor=_PlaCargada.categorias[_idcat];
		}
		
		_in=document.createElement('input');
		_in.value=_valor;
		_in.setAttribute('catid',_idcat);
		_in.setAttribute('name','categoria_'+_idcat);
		
		_div2.appendChild(_in);
	}
	

	for(_en in _PlaCargada.estados){
		if(typeof _PlaCargada.estados[_en] != 'object'){continue;}			
		_ddd=document.createElement('div');
		_ddd.setAttribute('class','estado');
		_ddd.setAttribute('ide',_PlaCargada.estados[_en].id);
		_ddd.innerHTML='<div class="nombre">'+_PlaCargada.estados[_en].nombre+'</div> desde: <div class="desde">'+_PlaCargada.estados[_en].desde+'</div>';
		_form.querySelector('#listaestados').appendChild(_ddd);
	}
	
	
	if(Object.keys(_PlaCargada.documentos).length>0){
		for(_na in _PlaCargada.documentos){
			if(typeof _PlaCargada.documentos[_na] != 'object'){continue;}							
			_adat=_PlaCargada.documentos[_na];							
			anadirAdjunto(_adat);	
		}
	}
	
	
	for(_aid in _res.data.Actores){			
		_datA=_res.data.Actores[_aid];
		if(_aid==_PlaCargada.id_p_GRAactores){
			_form.querySelector('input[name="id_p_GRAactores_n"]').value=_datA.nombre+' '+_datA.apellido;				
		}	
	}
	

	_FormE = $('#form_pla .escroleable');
	_handle = $('#dBordeL');
	_handle.css('height',_FormE.height());
	_FormE.scrollTop(0);
	
	$('input').on('mouseover',function(){
		document.querySelector('#form_pla').removeAttribute('draggable');
		_excepturadragform='si';
	});
	$('input').on('mouseout',function(){
	document.querySelector('#form_pla').setAttribute('draggable','true');
		_excepturadragform='no';
	});
}
*/


function borraEstado(_this){
	if(!confirm("¿Comfirmás que querés eliminar el registro de que ha existido este estado?")){
		return;	
	}

	
	_param={
		"ide":_this.parentNode.getAttribute('ide'),
		"panid":_PanId
	};
	$.ajax({
		data:_param,
		type:'post',
		url:'./PLA/PLA_ed_borra_estado.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	_res = PreprocesarRespuesta(response);
        	
        	_el=document.querySelector('#listaestados [ide="'+_res.data.ide+'"]');
        	_el.parentNode.removeChild(_el);
			
		}
	})
	
	
	
}


function guardarPlanGral(_this){
	_form=document.querySelector('#form_pla_gral');		
	_form.setAttribute('estado','inactivo');
	_param={
		"nombre":_form.querySelector('input[name="nombre"]').value,
		"panid":_PanId
	};
	//accion para absorber código basura generado por editores de texto al copiar pegar
	var editor = tinymce.get('descripciongral'); // use your own editor id here - equals the id of your textarea
	_con=$('#' + 'descripciongral').html( editor.getContent({format: 'html'}));
	console.log(_con['0']);
	_contcrudo = _con['0'].textContent;		
	/*
	_result=Array();			
	_regex=/<!-- \[if([^]+)<!\[endif]-->/g;

	if(new RegExp(_regex).test(_contcrudo)){
		_result = _contcrudo.match(_regex).map(function(val){
	   		return  val;
		});
	}			
	for(_nc in _result){
		//console.log('_nc:'+_nc);
		_contcrudo=_contcrudo.replace(_result[_nc],'');
	}
	_contcrudo=_contcrudo.replace('<p>&nbsp;</p>','');*/
	_param.descripcion=_contcrudo;
	
	$.ajax({
		data:_param,
		type:'post',
		url:'./PLA/PLA_ed_guarda_plan_general.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	_res = PreprocesarRespuesta(response);
        	
			limpiarFormPlan();
			cargarPlan(_res.data.id,_res.data.nivel,_res.data.modo);
		}
	})
}


function crearCategoria(_id_estandar,_nombre){
	
	_nivel=document.querySelector('#form_pla input[name="nivel"]').value;
	
	_params={
        'panid': _PanId,
		"nivel":_nivel,
		"id_p_PLAcategoria_estandar":_id_estandar,
		'nombre':_nombre
	};	
			
	$.ajax({
		data:_params,
		url:'./PLA/PLA_ed_crea_categoria.php',
		type:'post',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	
        	_res = PreprocesarRespuesta(response);
        	
        	consultarCategorias();
        	
		}
	})
}

function borrarCategoria(_idcat){
	if(!confirm('¿Borramos esta categoría para todos los niveles de este plan?... ¿Segure?')){return;}
	_param={
		'panid': _PanId,
		'idcat':_idcat
	}		
	
	$.ajax({
		data:_param,
		type:'post',
		url:'./PLA/PLA_ed_borra_categoria.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
		success:  function (response,status,xhr) {
			_res = PreprocesarRespuesta(response);
			
			_div=document.querySelector('#paquetecategorias #atributoslista [idcat="'+_res.data.idcat+'"]');
			_div.parentNode.removeChild(_div);
			
		}
	})
	
}



function cargarCmp(_this){
	
	var files = _this.files;
	if(document.querySelector('#form_pla input[name="id"]').value<1){
		alert('error al enviar archivos');
		return;
	}				
	for (i = 0; i < files.length; i++) {
		_nFile++;
		//console.log(files[i]);
		var parametros = new FormData();
		_idpla=document.querySelector('#form_pla input[name="id"]').value;
		_nivel=document.querySelector('#form_pla input[name="nivel"]').value;
		parametros.append('upload',files[i]);
		parametros.append('nfile',_nFile);
		parametros.append('idpla',_idpla);
		parametros.append('nivel',_nivel);
		
		var _nombre=files[i].name;
		_upF=document.createElement('p');
		_upF.setAttribute('nf',_nFile);
		_upF.setAttribute('class',"archivo");
		_upF.setAttribute('idpla',_idpla);
		_upF.setAttribute('idpla',_nivel);
		_upF.setAttribute('subiendo',"si");
		_upF.setAttribute('size',Math.round(files[i].size/1000));

		_barra=document.createElement('div');
		_barra.setAttribute('id','barra');
		_upF.appendChild(_barra);
		
		_carg=document.createElement('div');
		_carg.setAttribute('class','cargando');
		_upF.appendChild(_carg);
		
		_img=document.createElement('img');
		_img.setAttribute('src',"./img/cargando.gif");
		_carg.appendChild(_img);
		
		_span=document.createElement('span');
		_span.setAttribute('id',"val");
		_carg.appendChild(_span);	        
		
		_upF.innerHTML+="<span id='nom'>"+files[i].name;+"</span>";
		_upF.title=files[i].name;
		
		document.querySelector('#listadosubiendo').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './PLA/PLA_ed_guarda_adjunto.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);
		
		xhr[_nn].onreadystatechange = function(evt){
			//console.log(evt);
			
			if(evt.explicitOriginalTarget.readyState==4){
				var _res = $.parseJSON(evt.explicitOriginalTarget.response);
				//console.log(_res);

				if(_res.res=='exito'){
						
					if(document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]')!=null){			
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.parentNode.removeChild(_file);				
						_h3 = anadirAdjunto(_res.data);	
						document.querySelector('#form_pla #adjuntos #adjuntoslista').appendChild(_h3);
					}else{
						_file=document.querySelector('.archivo[nf="'+_res.data.nf+'"]');								
						_file.parentNode.removeChild(_file);
					}
				}else{
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
					_file.innerHTML+=' ERROR';
					_file.style.color='red';
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
	this.li.querySelector('#barra').style.width=Math.round(percentComplete)+"%";
	this.li.querySelector('#val').innerHTML="("+Math.round(percentComplete)+"%)";
  } else {
	// Unable to compute progress information since the total size is unknown
  }  
}
         
function consultarListadoIND(){
	 var _parametros = {
		'panid': _PanId
	};

	$.ajax({
		url:   './IND/IND_consulta_estructura.php',
		type:  'post',
		data: _parametros
	})
	.done(function (_data, _textStatus, _jqXHR){
		_res = PreprocesarRespuesta(_data, _textStatus, _jqXHR);
		if(_res===false){return;}
		_DatosIndicadores=_res.data;
		mostrarMenuReferenciasIND();
	});	
}
