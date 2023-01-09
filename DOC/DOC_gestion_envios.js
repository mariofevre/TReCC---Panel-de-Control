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
//funcion inicial para definir grupos.
function consultarGrupos(){		
	var _parametros = {	};
	
	$.ajax({
		url:   './PAN/PAN_grupos_consulta.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);   
			_Grupos=_res.data;
			_Grupos.grupos[0].tipo='0';
			if(_Estado=='actualizandofilas'){
				actualizarIndice();
			}
		}
	});	
}

//funcion inicial para definir visados.
function consultarVisados(){		
	var _parametros = {	};
	
	$.ajax({
		url:   './DOC/DOC_consulta_visados.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);   
			_DataVisados=_res.data;
		}
	});	
}


function actualizarIndice(){
	var _parametros = {	};
	
	$.ajax({
		url:   './DOC/DOC_consulta_doc_indice.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			DatosDocs.indiceOrdenadoA=_res.data.indiceOrdenadoA;
			DatosDocs.indiceOrdenadoB=_res.data.indiceOrdenadoB;
			DatosDocs.indice=_res.data.indice;
			remuestrearIndiceGestion(_res);
		}
	});	
}

//funcion de actualización de datos cargados
function consultarCategorias(){
	var _parametros = {	};
	
	$.ajax({
		url:   './DOC/DOC_consulta_categorias.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);   
			DatosDocs.categorias=_res.data.categorias;
			DatosDocs.categoriasOrden=_res.data.categoriasOrden;
			DatosDocs.categoriasHatch=_res.data.categoriasHatch;
		}
	});		
}

//consulta inicial de doumentos
function consultarDocs(_idreg,_modo){		
	
	if(_modo==null){_modo='normal';}
	
	var _parametros = {
		"panid" :_PanelI,
		"iddoc" :_idreg,
		"idcom" :_idCom,
		"modo":_modo
	};
	
	$.ajax({
		url:   './DOC/DOC_consulta_doc.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			if(_res.data.tipo=='undoc'){
				for(_iddoc in _res.data.docs){
					DatosDocs.docs[_iddoc]= _res.data.docs[_iddoc];	
				}
				
				DatosDocs.indiceOrdenadoA=_res.data.indiceOrdenadoA;
				DatosDocs.indiceOrdenadoB=_res.data.indiceOrdenadoB;
				DatosDocs.indice=_res.data.indice;
				DatosDocs.categorias=_res.data.categorias;
				DatosDocs.grupos=_res.data.grupos;
				DatosDocs.categoriasOrden=_res.data.categoriasOrden;
				DatosDocs.categoriasHatch=_res.data.categoriasHatch;
				
				
			}else{
				DatosDocs=_res.data;
				if(Object.keys(DatosDocs.docs).length==0){
					invocarAyuda();
				}
			}
			

					
			_HabilitadoEdicion=_res.data.habilitadoedicion;
			cargarPermisos();
			
			cargaFiltros();
			
			if(_res.data.tipo=='undoc'){
				//console.log('actualiza 1');
				_iddoc=Object.keys(_res.data.docs)[0];
				_modo=_res.data.modo;
				actualizarMuestra(_res,_iddoc,_modo);
			}else{
				//console.log('actualiza todo');
                
                if(_Modo == 'gestion'){
                	mostratComoGestion(_res);
                }else if(_Modo =='tabla'){
                	mostratComoTabla(_res);
                	medirAnchosTd();
                }else{
                	mostratComoGestion(_res);
                }
			}
		}
	});	
}

function medirAnchosTd(){	
	_tds=document.querySelectorAll('table #vercols td span');	
	_prev=0;	
	for(_tn in _tds){
		if(typeof _tds[_tn] !='object'){continue;}
		_tds[_tn].removeAttribute('style');
		_cl=_tds[_tn].parentNode.getAttribute('class');
		
		if(_cl=='versiones'){
			_ancho=0;
			_tr=document.querySelector('table#cont tr.fila');
			_tdvers=_tr.querySelectorAll('td.version');
			for(_vn in _tdvers){
				if(typeof _tdvers[_vn] !='object'){continue;}
				_ancho+=_tdvers[_vn].clientWidth+4;	
			}
			_ancho+=1;
		}else{
			_td=document.querySelector('table#cont tr.fila td.'+_cl);
			if(_td==null){_ancho=0;}else{			
				_ancho=_td.clientWidth - 2;
			}
		}
		
		if(_tds[_tn].parentNode.getAttribute('ver')!='-1'){
			_prev=0;
			_tds[_tn].style.width=_ancho+'px';
		}else{
			//console.log('o'+(4*_prev+'px'));
			_tds[_tn].style.left=4*_prev+'px';
			_prev++;
		}
	}
}

function descargarArchivos(){
	var _parametros = {
	};
	document.querySelector('.botonmenu#descarga').setAttribute('cargando','si');	
	
	$.ajax({
		url:   './DOC/DOC_proces_genera_descarga_docs.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			document.querySelector('.botonmenu#descarga').setAttribute('cargando','no');
			_res = PreprocesarRespuesta(response);
			
			window.location = _res.data.descarga;
		}
	});	
}



/*
function cargarDoc(_this){
	
	_form=_this.parentNode.parentNode.parentNode;
	
	//console.log(_this.files);
	var _this=_this;
	var files = _this.files;
			
	for (i = 0; i < files.length; i++){
    	_nf++;
    	_pp=document.createElement('p');
    	_pp.setAttribute('nf',_nf);
    	_pp.setAttribute('class','subiendo');
    	//console.log(files[i].name);
    	_pp.innerHTML='<img src="./img/cargando.gif"> cargando '+files[i].name;
    	_form.querySelector('#listacargando').appendChild(_pp);
		var parametros = new FormData();
		parametros.append("upload",files[i]);
		parametros.append("nf",_nf);
		
		_inns=_form.querySelectorAll('input, textarea');
		for(_nn in _inns){
			if(typeof _inns[_nn] =='object'){
				if(_inns[_nn].getAttribute('type')=='file'){continue;}
				_nom=_inns[_nn].getAttribute('name');
				_val=_inns[_nn].value;
				parametros.append(_nom,_val);
			}
		}
		
		
		var _xrr=$.ajax({
				data:  parametros,
				url:   './DOC/DOC_ed_guarda_doc.php',
				type:  'post',
				processData: false, 
				contentType: false,
				success:  function (response) {
					_res = PreprocesarRespuesta(response);   
					//console.log(_res);
					if(_res.data.nf!=0){
						_ps=document.querySelector('p.subiendo[nf="'+_res.data.nf+'"]');
						_ps.parentNode.removeChild(_ps);
					}
					actualizarMuestra(_res,_res.data.nid);
						
				}
		});
		//setInterval(function(){console.log(_xrr)}, 6000);
	}		
	//_form.style.display='none';
}
*/

function crearDoc(_this,_modo){
	
	if(_modo==null){_modo='normal';}
	if(_this!=undefined){
		if(_this.getAttribute('disabled')=='disabled'){
			return;
		}
	}
	
	//_modo='normal' crea un documento vacio y completa el formulario con esos datos
	//_modo='reciclaform' crea un documento vacio y completa el formulario con id
	
	_paramm={
		"zz_AUTOPANEL":_PanelI
	}	
	
	$.ajax({
		data:  _paramm,
		url:   './DOC/DOC_ed_crea_doc.php',
		type:  'post',
		error:   function (response) {alert('error al consultar el sevidor');console.log(response);},
		success:  function (response) {
			_res = PreprocesarRespuesta(response);   
			_IdDoc=_res.data.NidDoc;
			consultarDocs(_IdDoc,_modo);
		}
	});			                
}

function generarNuevaIdVer(){
	//solicita al servidor la creación de una nueva versión, sin datos.
	_paramm={
		'panid':_PanelI,
		'accion':'crear',
		'id_p_DOCdocumento_id':_IdDoc
	}
	
	$.ajax({
		data:  _paramm,
		url:   './DOC/DOC_ed_crear_ver_prelim.php',
		type:  'post',
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			_res = PreprocesarRespuesta(response);			
			_form.querySelector('#cnid').innerHTML=_res.data.nid;
			_form.querySelector('#cid').value=_res.data.nid;
			_form.querySelector('#bagrega').style.display='block';			
			_form.querySelector('#Iaccion').value='cambia';
		}
	});	
}


function actulazarVerSel(){	
	document.querySelector('#ayudaVerData #seleccionados').innerHTML='versiones seleccionadas: '+Object.keys(_VerSeleccion).length;
	
	if(Object.keys(_VerSeleccion).length==0){
		document.getElementById('ayudaVerResumen').style.display='none';
		document.getElementById('ayudaVerData').style.display='none';
		document.getElementById('ayudaVerCompleta').style.display='block';
		return;
	}else{
		//console.log(Object.keys(_VerSeleccion).length);
		//console.log(_VerSeleccion);
		document.getElementById('ayudaVerResumen').style.display='block';
		document.getElementById('ayudaVerData').style.display='block';
		document.getElementById('ayudaVerCompleta').style.display='none';
	}
	
	//console.log();
	_tx=JSON.stringify(_VerSeleccion);

	_sel='';
	for(_ns in _VerSeleccion){
		_sel+=_ns+",";		 
	}
	//alert(_sel);
	_paramm={
		"seleccion":_sel
	}	
	
	$.ajax({
		data:  _paramm,
		url:   './DOC/DOC_consulta_versiones.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);      
			//console.log(_res);
			//Actualizar(_res);
			_SiPla=0;
			_NoPla=0;
			
			_SiPre=0;
			_NoPre=0;
			
			_SiApr=0;
			_NoApr=0;
			
			_SiRev=0;
			_NoRev=0;
			
			_SiAnu=0;
			_NoAnu=0;
			
			_VerSeleccionData=_res.data;
			for(_idV in _res.data){			
                _DatosVer[_idV]=_res.data[_idV];
			
				if(_res.data[_idV].previstoactual!=''&&_res.data[_idV].previstoactual!='0000-00-00'){
					_SiPla++;
				}else{
					_NoPla++;
				}
				document.querySelector('#acciones #sifech').innerHTML=_SiPla;
				document.querySelector('#acciones #nofech').innerHTML=_NoPla;
			
				if(_res.data[_idV].id_presenta==''){_res.data[_idV].id_presenta=0;}
				if(_res.data[_idV].id_presenta>0){
					_SiPre++;
				}else{
					_NoPre++;
				}
				document.querySelector('#acciones #sipre').innerHTML=_SiPre;
				document.querySelector('#acciones #nopre').innerHTML=_NoPre;
				
				if(_res.data[_idV].id_aprueba==''){_res.data[_idV].id_aprueba=0;}
				if(_res.data[_idV].id_aprueba>0){
					_SiApr++;
				}else{
					_NoApr++;
				}
				document.querySelector('#acciones #siapr').innerHTML=_SiApr;
				document.querySelector('#acciones #noapr').innerHTML=_NoApr;
				
				if(_res.data[_idV].id_rechaza==''){_res.data[_idV].id_aprueba=0;}
				if(_res.data[_idV].id_rechaza>0){
					_SiRev++;
				}else{
					_NoRev++;
				}
				document.querySelector('#acciones #sirev').innerHTML=_SiRev;
				document.querySelector('#acciones #norev').innerHTML=_NoRev;
				
				if(_res.data[_idV].id_anula==''){_res.data[_idV].id_anula=0;}
				if(_res.data[_idV].id_anula>0){
					_SiAnu++;
				}else{
					_NoAnu++;
				}
				document.querySelector('#acciones #sianu').innerHTML=_SiAnu;
				document.querySelector('#acciones #noanu').innerHTML=_NoAnu;
			}
			
		}
	});		
}





function cargarDoc(_this){
	if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}		
	_form=_this.parentNode.parentNode.parentNode;
	var _this=_this;
	var files = _this.files;
	
				
	for (i = 0; i < files.length; i++) {
		_nFile++;
		console.log(files[i]);

		var parametros = new FormData();	    	
		parametros.append('nfile',_nFile);
		
		_inns=_form.querySelectorAll('input, textarea');				
		for(_nn in _inns){
			if(typeof _inns[_nn] =='object'){
				if(_inns[_nn].getAttribute('type')=='file'){continue;}
				_nom=_inns[_nn].getAttribute('name');
				_val=_inns[_nn].value;
				parametros.append(_nom,_val);
			}
		}			
		parametros.append("zz_AUTOPANEL",_PanelI);
		parametros.append("modos",'masivo');
		
		parametros.append('upload',files[i]);
		
		
		var _nombre=files[i].name;
		_upF=document.createElement('p');
		_upF.setAttribute('nf',_nFile);
		_upF.setAttribute('class',"archivo");
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
		_upF.title=files[i].name;;
		
		document.querySelector('#listadosubiendo').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './DOC/DOC_ed_guarda_doc.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);			
		xhr[_nn].onreadystatechange = function(evt){
			//console.log(evt);				
			if(evt.explicitOriginalTarget != undefined){	//parafirefox
				if(evt.explicitOriginalTarget.readyState==4){
					_res = $.parseJSON(evt.explicitOriginalTarget.response);
				}
			}else{ //para ghooglechrome
				if(evt.currentTarget.readyState==4){
					_res = $.parseJSON(evt.target.response);
				}					
			}
			
			if(_res.res=='exito'){		
				
				if(document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]')!=null){
										
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
					_file.parentNode.removeChild(_file);	
					//anadirAdjunto(_res.data); esto quedo copiado de COM_gestion
					
				}else{
					_file=document.querySelector('p.archivo[nf="'+_res.data.nf+'"]');								
					_file.parentNode.removeChild(_file);
				}
				
									
				if(
					_res.data.NuevoGrupo_a=='si'
					||
					_res.data.NuevoGrupo_b=='si'
				){
					_Estado='actualizandofilas';
					consultarGrupos();
					
				}else if(_res.data.cambiogrupo=='si'){
					_Estado='actualizandofilas';
					actualizarIndice(_res);
				}
				
				if(_res.data.nuevascategorias=='si'){
					_Estado='actualizandofilas';
					consultarCategorias();
				}
				   
				//Actualizar(_res);
				
			}else{
				_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
				_file.innerHTML+=' ERROR';
				_file.style.color='red';
			}
		}
		xhr[_nn].send(parametros);					
	}
}
	
	
	
//guardar nueva observación para un visado

function guardarVisObs(_this){						
	_parametros={
		'estado':_this.parentNode.querySelector('[name="estado_nuevo'),
		'observacion':_this.parentNode.querySelector('[name="observacion_nueva'),
		'idvis':_this.parentNode.getAttribute('idvis')
	}
	
	$.ajax({
		data:  _parametros,
		url:   './DOC/DOC_ed_crea_visado_observacion.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);      
			//console.log(_res);
			//Actualizar(_res);
			_SiPla=0;
			_NoPla=0;
		}
	})	
}



// Cosulta de datos para formular versión
function formularVersion(_idver,_accion,_iddoc){
 	
	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles	
	cerrarForm('version');
	document.querySelector('#formCent[tipo="version"]').setAttribute('estado','cargando');
	
	_IdVer=_idver;
	_IdDoc=_iddoc;
	
	
	//alert(_sel);
	_paramm={
		"seleccion":_IdVer
	}	
	
	var _accion = _accion;
	
		
	$.ajax({
		data:  _paramm,
		url:   './DOC/DOC_consulta_versiones.php',
		type:  'post',
		error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			var _res = PreprocesarRespuesta(response);
			//Actualizar(_res);
			_DatosVer[_IdVer]=_res.data[_IdVer];
			
				
			if(_accion=='crear'){
				if(_HabilitadoEdicion!='si'){
					alert('su usuario no tiene permisos de edicion');
					return;
				}
				
				_form=document.querySelector('#formCent[tipo="version"]');
				_form.setAttribute('estado','activo');
			
				generarNuevaIdVer();
				
				if(_IdVer!=null){
					_NnVer=document.querySelector('#contenidoextensoPost > .fila > .versionesventana .version[idreg="'+_IdVer+'"]').getAttribute('nver');
				}else{
					_pre=document.querySelector('#contenidoextensoPost > .fila[idreg="'+_IdDoc+'"] > .versionesventana .preversion');
					_sib=_pre.previousSibling;
					//console.log(_pre.previousSibling);
					if(_pre.previousSibling!=undefined){
						_NnVer=parseInt(_sib.getAttribute('nnver'))+1;
					}else{
						_NnVer=1;
					}
				}
				
				_form.querySelector('#Inumero').value=_NnVer;
				_form.querySelector('#bcambia').style.display='none';
				_form.querySelector('#bborra').style.display='none';
				_form.querySelector('#Iaccion').value='agrega';
				_form.querySelector('#Iid_p_DOCdocumento_id').value=_IdDoc;
				_form.querySelector('h2 .version').setAttribute('class','preversion');
				
				
				$('#formCent input,#formCent  textarea,#formCent  a').on('mouseover',function(){
					//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
					if(document.querySelector('#formCent')!=null){
						//esto evita el arrastre en sombra del formulario 
						document.querySelector('#formCent').removeAttribute('draggable');
					}
					_excepturadragform='si';
				});
				$('#formCent input,#formCent textarea,#formCent a').on('mouseout',function(){
					//gestiona el arrastre al hacer click sobre elementos interactivos del formulario
					if(document.querySelector('#formCent')!=null){
						document.querySelector('#formCent').setAttribute('draggable','true');
					}
					//estoreactiva el arrastre del formulario
					_excepturadragform='no';
				});
				
				cargarPermisos();
				
			}else if(_accion=='cargar'){
				formularVersion_muestra();
			}
		}
	});	
};


						
