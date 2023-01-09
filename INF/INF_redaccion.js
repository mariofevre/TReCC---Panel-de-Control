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


 
function crearInforme(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	var _this=_this;
	var parametros = {
		"idmodelo": _IdModelo,
		'nuevoinformeN': _this.getAttribute('inum'),
		"nuevoinformefechaDesde" : _this.getAttribute('fechaanterior'),
		"nuevoinformefecha" : _this.getAttribute('fechap'),
		"idPanel":_PanId
	};	
    
	$.ajax({		
		data:  parametros,
		url:   './INF/INF_ed_crear_informe.php',
		type:  'post',
		success:  function (response){
			
			_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}
			
			_dat = _res.data;					
			
			_this.setAttribute('estado','generado');
			_this.setAttribute('onclick','cargarInforme(this)');
			_this.setAttribute('idinf',_res.data.nid);					

			_aa=document.createElement('a');

			_aa.innerHTML='<span doc="" presentado="no">pdf</span>/<span presentado="no">docs</span>';
			_aa.setAttribute('onclick','cargaPdf(this)');
			_aa.setAttribute('Inum',_this.getAttribute('inum'));
			_aa.setAttribute('Fecha',_this.getAttribute('fechap'));
			_aa.setAttribute('idInf',_res.data.nid);
			_aa.setAttribute('onclick','cargaPdf(this)'); 

			_this.parentNode.appendChild(_aa);
	
			_IdInforme=_res.data.nid;
			consultarInforme();
		}
	});
	
}


function consultarInforme(){		
	var parametros = {
		"Idinforme" : _IdInforme,
		"Edicion" : 'si',
		"Freportedesde" : '',
		"Freportehasta" : '',
		"idPanel":_PanId
	};		
		
	$.ajax({
		data:  parametros,
		url:   './INF/INF_consulta_informe.php',
		type:  'post',
		success:  function (response){
			
			_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}
			
			_resS = _res.data;
			
			_IdModelo=_resS.id_p_INFmodelo_id;
			
			 _fechaPresentacion=_resS.presentacion;
			//carga contenido de encabezado y pie en la hoja modelo.
			_MOD=document.getElementById('HojaModelo');
			_MOD.querySelector('div#encabezado').innerHTML=_resS.modelo.encabezadohtml;
			_MOD.querySelector('div#pie').innerHTML=_resS.modelo.piehtml;
			
			//console.log(_resS);	
			 _avanceP=0;
			 _avanceS=0;
			 
			//consultarInformesDisponibles();
			renderCaratula();
			procesarParrafos();	
		
		}
	});
}



function consultarModelosDisponibles(){
	$.ajax({			
		url:   './INF/INF_consulta_modelos_disponibles.php',
		error: function (response){
            alert('se produjo un error al intentar solicitar la acción en el servidor');
		},
		success:  function (response){
			_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}
             
            document.querySelector('#botoneraV2 #listadoMod').innerHTML=''; 
             
            _DatosModelos = _res.data;
            
            for(_nm in _res.data.modelosOrden){
                _mid = _res.data.modelosOrden[_nm];
                _dat=_res.data.modelos[_mid]
                _aa=document.createElement('a');
                _aa.innerHTML=_dat.nombre+' ('+_dat.periodicidad+')';
                _href='./'+_File+'?modeloid='+_dat.id;					
                _aa.setAttribute('href',_href); 
                document.querySelector('#botoneraV2 #listadoMod').appendChild(_aa);
                
                console.log(_mid);
                if(_IdModelo==""){
                    _IdModelo=_mid;
                }	
                
                if(_IdModelo==_mid){
                    _aa.setAttribute('class','cargado');	
                    _Modelocargado='si';	
                    
                }                                    
            }				
            paso2();
            
		}
	});
}

	
function consultarInformesDisponibles(){
	var parametros = {
		"IdinformeModelo" : _IdModelo,
		"fechadesde" : _DatosModelos.modelos[_IdModelo].desde,
		"fechahasta" : _DatosModelos.modelos[_IdModelo].hasta,
		"periodicidad" : _DatosModelos.modelos[_IdModelo].periodicidad,
		"idPanel":_PanId
	};		
		
	$.ajax({
		data:  parametros,
		url:   './INF/INF_consulta_informes_disponibles.php',
		type:  'post',
		error: function (response){
            alert('se produjo un error al intentar solicitar la acción en el servidor');
		},
		success:  function (response){
			_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}
			
            _resList=_res.data.informes;
            
            _ultNum=0;
            _Informecargado='no';
            _fechaanterior='';
            
            document.querySelector('#botoneraV2 #listado').innerHTML='';
            for(_ni in _resList){
                _adiv=document.createElement('div');
                document.querySelector('#botoneraV2 #listado').appendChild(_adiv);
                
                _fff=_ni;
                _ultNum+=1;
                _nnn=_ultNum;
                
                if(_resList[_ni].norden!=undefined){
                    _nnn=_resList[_ni].norden;
                    _ultNum=parseInt(_resList[_ni].norden);
                }
                
                _aa=document.createElement('a');
                _aa.setAttribute('class','editor');
                _aa.setAttribute('estado','inactivo');
                _adiv.appendChild(_aa);
                
                _aa=document.createElement('a');
                _aa.setAttribute('class','selector');
                _aa.innerHTML=_fff+' - '+_nnn;
                _aa.setAttribute('estado',_resList[_ni].estado);
                if(_resList[_ni].estado=='generado'){
                    _aa.setAttribute('idInf',_resList[_ni].id);
                    _aa.setAttribute('onclick','cargarInforme(this)');	
                }else if(_resList[_ni].estado=='previsto'){
                    _aa.setAttribute('onclick','crearInforme(this)');
                }
                
                _adiv.appendChild(_aa);
            
                if(_res.data.emision=='periódica'){
                    _aa.setAttribute('fechaAnterior',_fechaanterior);
                }else{
                    _aa.setAttribute('fechaAnterior',_res.data.desde);
                }
                _aa.setAttribute('fechaP',_fff);
                _aa.setAttribute('inum',_nnn);
                
                if(_IdInforme!='' && _resList[_ni].id==_IdInforme){// identifica el informe que se estï¿½ visualizando.
                    _aa.setAttribute('class','cargado');	
                    _aa.setAttribute('onclick','editarInforme(this)');
                    _Informecargado='si';				
                }
    
                _aa=document.createElement('a');
                _adiv.appendChild(_aa);
                
                if(_resList[_ni].FI_presentado==undefined){_resList[_ni].FI_presentado='';}
                
                if(_resList[_ni].reportehasta!=undefined){
                    _aa.innerHTML='<span id="p">pdf</span>/<span id="d">docs</span>';
                    
                    if(_resList[_ni].FI_presentado!=''){
                        _aa.querySelector('#p').setAttribute('presentado','pdf');
                        _aa.setAttribute('doc',_resList[_ni].FI_presentado);
                    }else{
                        _aa.querySelector('#p').setAttribute('presentado','no');
                        _aa.setAttribute('doc','');
                    }
                    
                    if(_resList[_ni].zz_cache_cant_INFdocumentos>'0'){
                        _aa.querySelector('#d').setAttribute('presentado','docs');
                    }else{
                        _aa.querySelector('#d').setAttribute('presentado','no');
                    }
                    
                    _aa.setAttribute('onclick','cargaPdf(this)');
                    _aa.setAttribute('Inum',_nnn);
                    _aa.setAttribute('Fecha',_fff);
                    _aa.setAttribute('idInf',_resList[_ni].id);
                    _aa.setAttribute('onclick','cargaPdf(this)'); 
                    
                    
                }else{
                    _aa.innerHTML='';
                }
                
                
                _fechaanterior=_fff;
            }	
            
            if(_Informecargado=='si'){
                _sss=$('#botoneraV2 #listado').scrollTop();
                _ttt=$("#botoneraV2 #listado a.cargado").offset().top;
                _alto=document.querySelector('#botoneraV2 #listado').clientHeight;
                $('#botoneraV2 #listado').scrollTop(_sss+_ttt-(_alto/2)-8);
            }
		}
	});
}



	
	function editordetextoAct(_this){
		
		_form=document.getElementById('editordetexto');
		_form.setAttribute('estado','activo');
		var _idseccion=	_this.getAttribute('idsecc');
		_form.setAttribute('idsec',_idseccion);
		_form.querySelector('input[name="id_p_INFsecciones_id"]').value=_idseccion;
		
		_parametros={
			'idsecc':_idseccion,
			'idinf':_IdInforme,
			"idPanel":_PanId,
			'modo':'actual'
		};
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_textos.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				editordetextoCargar(_res);
			}
		});
	}



	function copiarTexto(_this){
		
		_form=document.getElementById('editordetexto');
		_form.style.display='block';
		var _idseccion=	_this.parentNode.getAttribute('idsec');
		_form.setAttribute('idsec',_idsecc);
		
		_parametros={
			'idsecc':_idseccion,
			'idinf':_IdInforme,
			"idPanel":_PanId,
			'modo':'previo'
		};
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_textos.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				editordetextoCargarTxprev(_res);
			}
		});
	}
	
	function editordeimagenAct(_idseccion){
		_form=document.getElementById('editordeimagen');
		_form.style.display='block';
		_form.setAttribute('idsec',_idseccion);
		
		_parametros={
			'idsecc':_idseccion,
			'idinf':_IdInforme
		};
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_imagenes.php',
			error: function (response){alert('error al contactar el servidor');},
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				editordeimagenCargar(_res, _res.data.seccion);
			}
		});
	}


	function actualizaImgClass(_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _this=_this;
		_this.style.display='none';
		var _idimg=_this.parentNode.getAttribute('idimg');
		_parametros={
			'idimg':_idimg,
			'extraclasehtml' : _this.value,
			'idinf':_IdInforme,
			'idsecc':_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idsec'),
			"idPanel":_PanId
		};
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_ed_guarda_img_clase.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				_this.style.display='block';
				Actualizar(_res);
			}
		});
	}
	
	
	
	function EliminarModelo(){		
		if(!confirm('¡Eliminamos este modelo de informe?... ¿Segure?')){return;}
		
		var parametros = {
                "idmodelo" : _IdModelo,
                "panid":_PanId
        };		
		$.ajax({
                data:  parametros,
                url:   './INF/INF_ed_elimina_modelo.php',
                type:  'post',
                error: function (response){alert('error al contactar el servidor');},
                success:  function (response){	
                	_res = PreprocesarRespuesta(response);
					if(_res.res!='exito'){return;}		
                    			
					document.querySelector('#formmodelo').style.display='none';
					_IdModelo ='';
					paso1();
                    
                }
            });
		
		
	}
	
	function formularModelo(_this,_event){		
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
				
		_form=document.querySelector('.formCent#formmodelo');
		_form.style.display='block';
		
		_acc=_this.getAttribute('accion');
		_form.querySelector('input[name="accion"]').value=_acc;
		
		if(_acc=='guarda'){
		
            
            var parametros = {
                "idmodelo" : _IdModelo,
                "panid":_PanId
            };		
            
            $.ajax({
                data:  parametros,
                url:   './INF/INF_consulta_modelos_disponibles.php',
                type:  'post',
                error: function (response){alert('error al contactar el servidor');},
                success:  function (response){	
                	_res = PreprocesarRespuesta(response);
					if(_res.res!='exito'){return;}		
                    			
                    _form=document.querySelector('.formCent#formmodelo');
                    
                    _dat=_res.data.modelos[_IdModelo];
                    
                    _form.querySelector('input[name="id"]').value=_IdModelo;
                    
                    _form.querySelector('span#mid').value=_dat.id;
                    
                    _form.querySelector('input[name="nombre"]').value=_dat.nombre;
                    _form.querySelector('input[name="nprefijo"]').value=_dat.nprefijo;
                    
                    //_form.querySelector('select[name="emision"] option[value="'+_dat.emision+'"]').checked=true;
                    _form.querySelector('select[name="periodicidad"] option[value="'+_dat.periodicidad+'"]').selected='selected';
                    
                    _sp=_dat.desde.split('-');
                    if(_sp.length==3){
                        _form.querySelector('input[name="desde_a"]').value=_sp[0];
                        _form.querySelector('input[name="desde_m"]').value=_sp[1];
                        _form.querySelector('input[name="desde_d"]').value=_sp[2];
                    }
                    
                    _sp=_dat.hasta.split('-');
                    if(_sp.length==3){
                        _form.querySelector('input[name="hasta_a"]').value=_sp[0];
                        _form.querySelector('input[name="hasta_m"]').value=_sp[1];
                        _form.querySelector('input[name="hasta_d"]').value=_sp[2];
                    }
                    
                    _form.querySelector('input[name="desfase"]').value=_dat.desfase;
                    
					_form.querySelector('textarea[name="encabezadohtml"]').value=_dat.encabezadohtml;
                    _form.querySelector('textarea[name="piehtml"]').value=_dat.piehtml;
                    _form.querySelector('textarea[name="css"]').value=_dat.css;
                    
                }
            });
		}		
	
	}
	
	
	function editarInforme(_this){
		
		document.getElementById('formEditaInforme').style.display='block';
		
		_inn=document.querySelectorAll('#formEditaInforme input');		
		for(_nn in _inn){
			if(typeof _inn[_nn] == 'object'){
				_inn[_nn].value='';
			}			
		}		
		
		_cargando=document.createElement('img');
		_cargando.setAttribute('src','./img/cargando.gif');
		_cargando.setAttribute('id','cargando');
		
		document.getElementById('formEditaInforme').appendChild(_cargando);
		
		var parametros = {
			"Idinforme" : _IdInforme,
			"idPanel":_PanId
		};		
		
		$.ajax({
			data:  parametros,
			url:   './INF/INF_consulta_informe_min.php',
			type:  'post',
			error:  function (response){alert('error al contactar el servidor');},
			success:  function (response){	
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
							
				_form=document.getElementById('formEditaInforme');
				_form.querySelector('[name="norden"]').value=_res.data.datos.norden;
				_form.querySelector('[name="titulo"]').value=_res.data.datos.titulo;
				_form.querySelector('[name="id"]').value=_res.data.datos.id;
				
				if(_res.data.datos.reportedesdeextra!='0000-00-00'){
					_desde=_res.data.datos.reportedesdeextra;
				}else{
					_desde=_res.data.datos.reportedesde;
				}
				
				_ddd=_desde.split('-');
				_form.querySelector('[name="reportedesdeextra_d"]').value=_ddd[2];
				_form.querySelector('[name="reportedesdeextra_m"]').value=_ddd[1];
				_form.querySelector('[name="reportedesdeextra_a"]').value=_ddd[0];
				
				
				if(_res.data.datos.reportehastaextra!='0000-00-00'){
					_hasta=_res.data.datos.reportehastaextra;
				}else{
					_hasta=_res.data.datos.reportehasta;
				}
				
				_ddd=_hasta.split('-');
				_form.querySelector('[name="reportehastaextra_d"]').value=_ddd[2];
				_form.querySelector('[name="reportehastaextra_m"]').value=_ddd[1];
				_form.querySelector('[name="reportehastaextra_a"]').value=_ddd[0];
				
				_cargando=document.querySelector('#formEditaInforme #cargando');
				_cargando.parentNode.removeChild(_cargando);					
			}
		});
	}
	
	
			function cargarJpgCarat(_this){			
			
			_epi=_this.parentNode.querySelector('#epigrafe');
			files =_this.parentNode.querySelector('#upload').files;
		
			desactivarCargarJpgCarat(_this);
    
			for (i = 0; i < files.length; i++) {
		    
				var parametros = new FormData();
				parametros.append('upload',files[i]);
				parametros.append('epigrafe',_epi);
				parametros.append('tipo','imageninforme');
				parametros.append('idsecc','caratula');
				parametros.append('idinf',_IdInforme);
				
				var _nombre=files[i].name;
				//cargando(files[i].name);		
		
				$.ajax({
					data:  parametros,
					url:   './INF/INF_ed_guarda_img.php',
					type:  'post',
					processData: false, 
					contentType: false,
					error:  function (response) {alert('error al contactar el servidor');},
					success:  function (response) {
                       
						_res = PreprocesarRespuesta(response);
						if(_res.res!='exito'){return;}
						
                        _img=document.querySelector('#informe div.hoja.caratula [name="Nimagen"]');
                        _img.setAttribute('src',_res.data.ruta);
							
					}
				});
			}
		}
		
		
				function fijarImagen(_this){
			if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
			var _this=_this;
			
			if(_this.parentNode.getAttribute('idimg')==''){
				return;
				//puede pasar?
			}
			_txepi=_this.parentNode.querySelector('.botonepigrafe').innerHTML;
			
		    var r = confirm("¿Confirma fijar esta imagen esta imagen? ("+_txepi+") \n Esto creará un componente automático en esta sección que mostrará en todos los informes la misma imagen");
		    if (r == true) {
		    	
		    	var _parametros={
		    		'idimg':_this.parentNode.getAttribute('idimg'),
		    		'idinf':_IdInforme,
		    		'idsecc':_this.parentNode.parentNode.parentNode.getAttribute('idsec'),
		    		"idPanel":_PanId
		    	}
		    	
		    	$.ajax({
					data: _parametros,
					type:'post',
					url:   './INF/INF_ed_fijar_imagen.php',
					success:  function (response){
						_res = PreprocesarRespuesta(response);
						if(_res.res!='exito'){return;}
						_cont=_this.parentNode;
						_cont.parentNode.removeChild(_cont);
						
					}
				});
			}	

		}	
		function borrarImagen(_this){
			if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
			var _this=_this;
			
			if(_this.parentNode.getAttribute('idimg')==''){
				return;
				//puede pasar?
			}
			_txepi=_this.parentNode.querySelector('.botonepigrafe').innerHTML;
			
		    var r = confirm("¿Confirma eliminar esta imagen? ("+_txepi+")");
		    if (r == true) {
		    	
		    	var _parametros={
		    		'idimg':_this.parentNode.getAttribute('idimg'),
		    		'idinf':_IdInforme,
		    		'idsecc':_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idsec'),
		    		"idPanel":_PanId
		    	}
		    	
		    	$.ajax({
					data: _parametros,
					type:'post',
					url:   './INF/INF_ed_elim_imagen.php',
					success:  function (response){
						_res = PreprocesarRespuesta(response);
						if(_res.res!='exito'){return;}
						_cont=_this.parentNode;
						_cont.parentNode.removeChild(_cont);
						Actualizar(_res);
					}
				});
			}	

		}	
				
function enviarFormulario(_this){
    _form=_this.parentNode.parentNode;
    
    if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
    _parametros={"panid": _PanId};
    
    _inps=_form.querySelectorAll('input, textarea');
    
    for(_nin in _inps){
        if(typeof _inps[_nin] != 'object'){continue;}   
        if(_inps[_nin].getAttribute('name')==undefined){continue;}
        if(_inps[_nin].getAttribute('name')==''){continue;}
        if(_inps[_nin].getAttribute('type')!=undefined){
            if(_inps[_nin].getAttribute('type')=='checkbox'){
                continue;
            }
        }
        _parametros[_inps[_nin].name]=_inps[_nin].value;   
    }
    
    _inps=_form.querySelectorAll('select option:checked');		
    for(_nin in _inps){
        if(typeof _inps[_nin] != 'object'){continue;}   
        if(_inps[_nin].parentNode.getAttribute('name')==undefined){continue;}
        if(_inps[_nin].parentNode.getAttribute('name')==''){continue;}
        _parametros[_inps[_nin].parentNode.name]=_inps[_nin].value;   
    }
    
    if(_this.innerHTML=='guardar'){
        _url='./INF/INF_ed_guarda_modelo.php';
    }else if(_this.innerHTML=='crear'){
        _url='./INF/INF_ed_crear_modelo.php';
    }
    
    $.ajax({
        url:   _url,
        type:  'post',
        data: _parametros,
        success:  function (response){
        	_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}
            //cargarHitos();	
            cerrarForm();
            if(_IdInforme!=''){
            	_sel=document.querySelector('div#listado a[idinf="'+_IdInforme+'"');
            	if(_sel!=undefined){
            		cargarInforme(_sel);
            	}
            }
        }
    })

}


function cargaPdf(_this){
	var _this = _this;
	var _form=document.getElementById('editordepdf');
	_form.querySelector('#lienzo').innerHTML='';
	_form.querySelector('#lienzob').innerHTML='';
	_form.style.display="block";
	
	_form.setAttribute('idinf',_this.getAttribute('idinf'));
	_form.querySelector('h3').innerHTML='Informe: '+_this.previousSibling.innerHTML;

	
	_form.querySelector('#uploadinput').setAttribute('inum',_this.getAttribute('inum'));
	_form.querySelector('#uploadinput').setAttribute('idinf',_this.getAttribute('idinf'));
	
	_form.querySelector('#uploadinputb').setAttribute('idinf',_this.getAttribute('idinf'));
	

	var parametros = new FormData();
	parametros.append("idinf" , _this.getAttribute('idinf'));
	parametros.append("idPanel" , _PanId);
	$.ajax({
		data:  parametros,
		url:   './INF/INF_consulta_Docs.php',
		type:  'post',
		processData: false, 
		contentType: false,
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			if(_res.res!='exito'){return;}	
			
			if(_this.querySelector('#p').getAttribute('presentado')=='pdf'){
									
				_aa=document.createElement('a');
				_ruta=_res.data.pdf.FI_presentado;
				_rr=_ruta.split('/');
				
				if(_res.data.pdf.FI_presentado_nombre!=''){
					_nom=_res.data.pdf.FI_presentado_nombre;
				}else{
					_nom=_rr;
				}
				
				_aa.innerHTML=_nom;					
				_aa.setAttribute('href',_ruta);
				_aa.setAttribute('download',_ruta);
				
				_form.querySelector('#lienzo').appendChild(_aa);		
				
				_aa=document.createElement('a');
				
				_aa.innerHTML='elim';		
				_aa.setAttribute('class','elim');
				_aa.setAttribute('onclick','eliminarPDF(this)');
				_aa.setAttribute('doc',_ruta);				
				_aa.setAttribute('inum',_this.getAttribute('inum'));		
				_aa.setAttribute('idinf',_this.getAttribute('idinf'));		
				
				_form.querySelector('#lienzo').appendChild(_aa);
						
			}	
			
			for(_na in _res.data.docs){
			
				_aa=document.createElement('a');
				_aa.innerHTML=_res.data.docs[_na].nombre;
				_aa.setAttribute('class','doc');
				_aa.setAttribute('href',_res.data.docs[_na].FI_documento);
				_aa.setAttribute('download',_res.data.docs[_na].nombre);
				
				_form.querySelector('#lienzob').appendChild(_aa);
				
				_ae=document.createElement('a');
				_ae.innerHTML='elim';
				_ae.setAttribute('class','elim');
				_ae.setAttribute('idIdoc',_res.data.docs[_na].id);
				_ae.setAttribute('idinf',_this.getAttribute('idinf'));
				_ae.setAttribute('onclick','eliminarDoc(this)');				
				
				_form.querySelector('#lienzob').appendChild(_ae);
											
			}				
			
		}
	});
		
	
}
	
function eliminarDoc(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	var _this=_this;
	var _idinf=document.querySelector('#editordepdf').getAttribute('idinf');
	
	if(confirm('¿Confirma que desea eliminar este documento?')==true){
		var parametros = {
			"idIdoc" : _this.getAttribute('ididoc'),
			"idinf" : _idinf,
			"accion": 'borra',
			"IdPanel" : _PanId	
		};	
				
		$.ajax({
			data:  parametros,
			url:   './INF/INF_ed_borra_Docs.php',
			type:  'post',
			success:  function (response){
            	_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
					
				_this.parentNode.removeChild(_this.previousSibling);
				_this.parentNode.removeChild(_this);
				
				if(_res.data.zz_cache_cant_INFdocumentos=='0'){
					_atag=document.querySelector('#listado a[idinf="'+_idinf+'"] #d');
					_atag.setAttribute('presentado','no');
				}
			
			}
		});
	}
}
function eliminarPDF(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	if(confirm('¿Confirma eliminar el PDF guardado?')==true){
		var _this=_this;
		var _idinf=_this.getAttribute('idinf');
		
		var parametros = {
			"doc" : _this.getAttribute('doc'),
			"inum" : _this.getAttribute('inum'),
			"idinf" : _this.getAttribute('idinf'),
			"idmod" : _IdModelo,
			"accion": 'borra',
			"IdPanel" : _PanId
		};	
				
		$.ajax({
			data:  parametros,
			url:   './INF/INF_ed_PDF.php',
			type:  'post',
			success:  function (response){

            	_res = PreprocesarRespuesta(response);
				
				if(_res.res=='exito'){
				
					_this.parentNode.removeChild(_this.previousSibling);
					_this.parentNode.removeChild(_this);
					
					_atag=document.querySelector('#listado a[idinf="'+_idinf+'"] #p');
					_atag.setAttribute('presentado','no');
					_atag.setAttribute('doc','');
					
				}else{
					alert('error al eliminar el doumento');
					console.log(_res);
				}
			}
		});	
	}
} 


function enviarDocs(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	files = _this.files;
	for (i = 0; i < files.length; i++) {
    	_nFile++;
    	//console.log(files[i]);
		parametros = new FormData();
		
		_idinf=document.querySelector('#editordepdf').getAttribute('idinf');
		parametros.append('upload',files[i]);
		parametros.append('nfile',_nFile);
		parametros.append("inum" , _this.getAttribute('inum'));		
		parametros.append("idinf" , _idinf);
		parametros.append("idmod" , _IdModelo);
		parametros.append("accion", 'carga');		
		parametros.append("IdPanel",_PanId);
		
		_nombre=files[i].name;
		_upF=document.createElement('a');
		_upF.setAttribute('nf',_nFile);
		_upF.setAttribute('class',"archivo");
		_upF.setAttribute('idinf',_idinf);
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
		
		_this.parentNode.parentNode.querySelector('#lienzob').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './INF/INF_ed_guarda_Docs.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);

		_this.parentNode.parentNode.querySelector('#lienzob').appendChild(_upF);		

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
				if(document.querySelector('#editordepdf > [nf="'+_res.data.nf+'"]')!=null){			
					_file=document.querySelector('#editordepdf > [nf="'+_res.data.nf+'"]');
					_file.parentNode.removeChild(_file);							
					anadirAdjuntoDoc(_res);
				}else{
					_file=document.querySelector('.archivo[nf="'+_res.data.nf+'"]');								
                    _file.parentNode.removeChild(_file);
				}
			}else{
				_file=document.querySelector('.archivo[nf="'+_res.data.nf+'"]');
				_file.innerHTML+=' ERROR';
				_file.style.color='red';
			}
		}
		xhr[_nn].send(parametros);			
	}	
}

function enviarPdf(_this){
	
	files = _this.files;
	for (i = 0; i < files.length; i++) {
    	_nFile++;
    	//console.log(files[i]);
		parametros = new FormData();
		
		_idinf=document.querySelector('#editordepdf').getAttribute('idinf');
		parametros.append('upload',files[i]);
		parametros.append('nfile',_nFile);
		parametros.append("inum" , _this.getAttribute('inum'));		
		parametros.append("idinf" , _idinf);
		parametros.append("idmod" , _IdModelo);
		parametros.append("accion", 'carga');		
		parametros.append("IdPanel",_PanId);
		
		_nombre=files[i].name;
		_upF=document.createElement('a');
		_upF.setAttribute('nf',_nFile);
		_upF.setAttribute('class',"archivo");
		_upF.setAttribute('idinf',_idinf);
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
		
		_this.parentNode.parentNode.querySelector('#lienzo').appendChild(_upF);
		
		_nn=_nFile;
		xhr[_nn] = new XMLHttpRequest();
		xhr[_nn].open('POST', './INF/INF_ed_PDF.php', true);
		xhr[_nn].upload.li=_upF;
		xhr[_nn].upload.addEventListener("progress", updateProgress, false);

		_this.parentNode.parentNode.querySelector('#lienzo').appendChild(_upF);		

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
					
				if(document.querySelector('#editordepdf > [nf="'+_res.data.nf+'"]')!=null){			
					_file=document.querySelector('#editordepdf > [nf="'+_res.data.nf+'"]');
					_file.parentNode.removeChild(_file);							
					anadirAdjuntoPdf(_res);
				}else{
					_file=document.querySelector('.archivo[nf="'+_res.data.nf+'"]');								
                    _file.parentNode.removeChild(_file);
				}
			}else{
				_file=document.querySelector('.archivo[nf="'+_res.data.nf+'"]');
				_file.innerHTML+=' ERROR';
				_file.style.color='red';
			}	
		}
		xhr[_nn].send(parametros);			
	}	
}



function Actualizar(_res){
	if(_res.data==undefined){alert('sin datos para actualizar');return;}
	if(_res.data.def==undefined){alert('sin definicion para la actualizacion');return;}
	
	if(_res.data.def=='textomodificado'){
        console.log('se modificó texto');
		var _idcomp='tx';
		_pars=document.querySelectorAll('#contenidoBase > div.precarga[idsecc="'+_res.data.idsecc+'"][idcomp="'+_idcomp+'"]');
		_remos=0;
		
		for(_nn in _pars){
			if(typeof _pars[_nn] == 'object'){
				_remos++;				
				if(_remos=='1'){_ancla=_pars[_nn].previousSibling;}
				_pars[_nn].parentNode.removeChild(_pars[_nn]);
			}
		}
		
		
		var parametros = {
			"Idinforme" : _IdInforme,
			"Edicion" : 'no',
			"Freportedesde" : '',
			"Freportehasta" : '',	
			"idsecc": _res.data.idsecc,
			"idcomp": _idcomp,
			"IdPanel" : _PanId
		};		
			
		$.ajax({
			data:  parametros,
			url:   './INF/INF_consulta_informe.php',
			type:  'post',
			success:  function (response){
				
				_resAj= PreprocesarRespuesta(response);
				
				
				console.log(_resAj);
				if(_resAj.res=='exito'){
					_resS = _resAj.data;
					_seccid= _resAj.data.seccionesOrden[0];
					
					
					
					for(_pn in _resAj.data.secciones[_seccid].parrafos){
						if(
							_resAj.data.secciones[_seccid].parrafos[_pn].tipo=='texto'
							&&
							_resAj.data.secciones[_seccid].parrafos[_pn].idcomp==_idcomp
						){	
							_nnparr++;
							_div=document.createElement('div');
							_div.setAttribute('id',"parrafoprecarga"+_nnparr);
							_div.setAttribute('class',"precarga");
							
							_div.setAttribute('idsecc',_seccid);
							_div.setAttribute('idcomp',_idcomp);														
							_div.setAttribute('tipo',"texto");
							
							_pp=document.createElement('p');
							_pp.innerHTML=_resAj.data.secciones[_seccid].parrafos[_pn].data;			
					    	_div.appendChild(_pp);				
					    	
					    	console.log(_resAj.data.secciones[_seccid].parrafos[_pn].data);
					    	_ancla.parentNode.insertBefore(_div, _ancla.nextSibling);
					    	_ancla=_div;
						}
					}
				}
			}
		});
		
	}else if(_res.data.def=='textocreado'){
       
		
		var parametros = {
			"Idinforme" : _IdInforme,
			"Edicion" : 'no',
			"Freportedesde" : '',
			"Freportehasta" : '',	
			"idsecc": _res.data.idsecc,
			"idcomp": _idcomp,
			"IdPanel" : _PanId
		};		
			
		$.ajax({
			data:  parametros,
			url:   './INF/INF_consulta_informe.php',
			type:  'post',
			success:  function (response){
				
				_resAj= PreprocesarRespuesta(response);
				
				console.log(_resAj);
				if(_resAj.res=='exito'){
					_resS = _resAj.data;
					_seccid= _resAj.data.seccionesOrden[0];
					_idcomp='tx';
                    _ancla=document.querySelector('#contenidoBase > div[idsecc="'+_res.data.idsecc+'"][idcomp="'+_idcomp+'"]');
                    _remos=0;		
            		
                    console.log('sumando un parrafo al mundo');
					for(_pn in _resAj.data.secciones[_seccid].parrafos){
					console.log('unparrafo');
						if(
							_resAj.data.secciones[_seccid].parrafos[_pn].tipo=='texto'
							&&
							_resAj.data.secciones[_seccid].parrafos[_pn].idcomp==_idcomp
						){	
                            console.log('sumando un parrafo al mundo');
							_nnparr++;
							_div=document.createElement('div');
							_div.setAttribute('id',"parrafoprecarga"+_nnparr);
							_div.setAttribute('class',"precarga");
							
							_div.setAttribute('idsecc',_seccid);
							_div.setAttribute('idcomp',_idcomp);														
							_div.setAttribute('tipo',"texto");
							
							_pp=document.createElement('p');
							_pp.innerHTML=_resAj.data.secciones[_seccid].parrafos[_pn].data;			
					    	_div.appendChild(_pp);				
					    	
					    	console.log(_resAj.data.secciones[_seccid].parrafos[_pn].data);
					    	_ancla.parentNode.insertBefore(_div, _ancla.nextSibling);
						}
					}
				}
			}
		});
	}else if(_res.data.def=='imagenesmodificadas'){
		
		if(_res.data.idsecc==undefined){alert('la consulta a la base de datos no envió en id de seccion a actualizar en la representacion actual del informe.')}
		var _idcomp='img';
		
		var _ancla=document.querySelector('#contenidoBase > div.precarga[idsecc="'+_res.data.idsecc+'"][idcomp="img"]');
		
		//console.log('#contenidoBase > div.aux[idsecc="'+_res.data.idsecc+'"][idcomp="'+_idcomp+'"]');
		console.log(_ancla);
		
		_pars=document.querySelectorAll('#contenidoBase > div.precarga[idsecc="'+_res.data.idsecc+'"][idcomp="img"]');
		//alert('#contenidoBase > div.precarga[idsecc="'+_res.data.idsecc+'"][idcomp="'+_idcomp+'"]');
		_remos=0;
		for(_nn in _pars){
			if(typeof _pars[_nn] == 'object'){
				//alert('+');
				_remos++;
				if(_remos=='1'){_ancla=_pars[_nn].previousSibling;}
				_pars[_nn].parentNode.removeChild(_pars[_nn]);
			}
		}	
		
		_idsecc=_res.data.idsecc;
		var parametros = {
			"Idinforme" : _IdInforme,
			"Edicion" : 'no',
			"Freportedesde" : '',
			"Freportehasta" : '',	
			"idsecc": _res.data.idsecc,
			"idcomp": _idcomp,
			"IdPanel" : _PanId
		};		
			
		$.ajax({
			data:  parametros,
			url:   './INF/INF_consulta_informe.php',
			type:  'post',
			success:  function (response){
			
				_resAj =PreprocesarRespuesta(response);
					
				//console.log(_resAj);
				if(_resAj.res=='exito'){
					_resS = _resAj.data;
					
					_seccid= _resAj.data.seccionesOrden[0];
					
					for(_pn in _resAj.data.secciones[_seccid].parrafos){
						if(
							_resAj.data.secciones[_seccid].parrafos[_pn].tipo=='imagen'
							&&
							_resAj.data.secciones[_seccid].parrafos[_pn].idcomp==_idcomp
						){
							
							representarParrafoImagen(_resAj.data.secciones[_seccid].parrafos[_pn],_ancla);
							_ancla=_ancla.nextSibling;
						}
					}
				}
			}
		});
	}else{
		alert('no identifique el tpo de actualización requerida en el informe visible.');
	}	
		
	
}
function cargarJpg(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	console.log(_this.files);
	var _this=_this;
	var files = _this.files;
			
	for (i = 0; i < files.length; i++) {
    
		var parametros = new FormData();
		parametros.append('upload',files[i]);
		parametros.append('tipo','imageninforme');
		parametros.append('idsecc',_this.parentNode.parentNode.parentNode.getAttribute('idsec'));
		parametros.append('idinf',_IdInforme);
		
		var _nombre=files[i].name;
		//cargando(files[i].name);		

		$.ajax({
			data:  parametros,
			url:   './INF/INF_ed_guarda_img.php',
			type:  'post',
			processData: false, 
			contentType: false,
			success:  function (response) {
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				Actualizar(_res);
				
				_idsecc=_this.parentNode.parentNode.parentNode.getAttribute('idsec');
				editordeimagenAct(_idsecc);
				//limpiarcargando(_nombre);
			}
		});
	}
}

function cargarCmp(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	console.log(_this.files);

	var files = _this.files;
			
	for (i = 0; i < files.length; i++) {
    
		var parametros = new FormData();
		parametros.append('upload',files[i]);
		parametros.append('tipo','complemento');
		
		var _nombre=files[i].name;
		//cargando(files[i].name);		

		$.ajax({
				data:  parametros,
				url:   './INF/INF_ed_guarda_img.php',
				type:  'post',
				processData: false, 
				contentType: false,
				success:  function (response) {
					_res = PreprocesarRespuesta(response);
					if(_res.res!='exito'){return;}
					//cargaTodo();
					//limpiarcargando(_nombre);
				}
		});
	}


}

	function editarSeccion(_this){
		var _this =  _this;
		var _idseccion=_this.getAttribute('id');

		var _form = document.getElementById('editorseccion');
		_form.style.display='block';
		_form.reset();
		_form.querySelector('#listadoAutosecciones').innerHTML='';
		
		_parametros={			
			id:_idseccion
		}
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_seccion.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				
				_dat=_res.data.seccion;
				console.log(_res);
				_form.querySelector("input[name='id']").value=_dat.id;
				_form.querySelector("input[name='nombre']").value=_dat.nombre;
				
				if(_dat.usodesde=='0000-00-00'&&_dat.usohasta=='0000-00-00'){
					_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=false;
				}else{
					_sp=_dat.usodesde.split('-');
					_form.querySelector("input[name='usodesde_a']").value=_sp[0];
					_form.querySelector("input[name='usodesde_m']").value=_sp[1];
					_form.querySelector("input[name='usodesde_d']").value=_sp[2];
					_sp=_dat.usohasta.split('-');
					_form.querySelector("input[name='usohasta_a']").value=_sp[0];
					_form.querySelector("input[name='usohasta_m']").value=_sp[1];
					_form.querySelector("input[name='usohasta_d']").value=_sp[2];
					_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=true;
				}
				
				_elem=_form.querySelectorAll('input[too="fechasDisc"]');
				for(_ni in _elem){
					if(typeof _elem[_ni]!='object'){continue;}
					if(_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked==true){
						_elem[_ni].removeAttribute('readonly');
					}else{
						_elem[_ni].setAttribute('readonly','readonly');
						_elem[_ni].value='';
					}
				}
				
				_form.querySelector("input[name='permitetexto']").value=_dat.permitetexto;
				if(_dat.permitetexto=='1'){
					_form.querySelector("input[for='permitetexto']").checked=true;
				}else{
					_form.querySelector("input[for='permitetexto']").checked=false;
				}
				
				_form.querySelector("input[name='permiteimagen']").value=_dat.permiteimagen;
				if(_dat.permiteimagen=='1'){
					_form.querySelector("input[for='permiteimagen']").checked=true;
				}else{
					_form.querySelector("input[for='permiteimagen']").checked=false;
				}
				
				for(_nord in _dat.ordencontenidos){
					
					_idcont=_dat.ordencontenidos[_nord];
					
					_datacont=Array();
					
					_div=document.createElement('div');
					_div.setAttribute('class','componenteOrg');						
					_div.setAttribute('idcomp',_idcont);
					_div.setAttribute('idsecc',_idseccion);
					_div.setAttribute('onclick','editarComponente(this)');
					_div.setAttribute('draggable','true');
					_div.setAttribute('ondragstart',"drag(event,this)");
					_div.setAttribute('ondragend',"desgranda(this)");
					
					if(_idcont=='tx'){
						_datacont.tipo='texto manual';
						_datacont.formula='(texto cargado manualmente en cada informe)';
						_div.setAttribute('onclick','alert("no configurable")');
					}else if(_idcont=='img'){
						_datacont.tipo='imagen manual';
						_datacont.formula='(imagenes cargadas manualmente en cada informe)';
						_div.setAttribute('onclick','alert("no configurable")');
					}else if(_dat.contenidos[_idcont]!=undefined){
						_datacont=_dat.contenidos[_idcont];
					}else{
						_datacont.tipo='ERROR al interpretar orden';
						_datacont.formula='(ERROR al interpretar orden)';
						_div.setAttribute('onclick','alert("no configurable")');
					}
					
					_div.innerHTML=_datacont.tipo;
					_div.title=_datacont.formula;
					
					_form.querySelector('#listadoAutosecciones').appendChild(_div);
					
					_sep=document.createElement('div');
					_sep.setAttribute('class','separadorComp');
					_sep.setAttribute('ondragover','agranda(event,this)');
					_sep.setAttribute('ondragleave','desgranda(this)');
					_sep.setAttribute('ondrop','drop(event,this)');
					_form.querySelector('#listadoAutosecciones').appendChild(_sep);					
					
				}
				
				_div=document.createElement('a');
				_div.setAttribute('class','componenteOrg');
				_div.innerHTML="añadir un nuevo componente";
				_div.setAttribute('idsecc',_idseccion);
				_div.setAttribute('onmouseup','crearComponente(this)');
				_form.querySelector('#listadoAutosecciones').appendChild(_div);
			
			}
		})
	}
	

	function formIndice(_this){
		var _this =  _this;
		var _idmodelo= _IdModelo;
		var _idinforme= _IdInforme;
		
		var _editor = document.getElementById('editorindice');
		var _forMS = _editor.querySelectorAll('form');
		var _form=_forMS[0];
		
		_editor.style.display='block';
		_form.reset();
		_form.querySelector('#indiceSecciones').innerHTML='';
		
		_parametros={			
			'Idmodelo':_idmodelo,
			'Idinforme':_idinforme,
			'Edicion':'no',
			'Freportedesde':'',
			'Freportehasta':'',
			"IdPanel" : _PanId
		}
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_modelo.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}		
					
				_ModDat=_res.data.modelo;
				console.log(_res);
				
				_form.querySelector("input[name='idmodelo']").value=_ModDat.id;
				_form.querySelector("input[name='nombre']").value=_ModDat.nombre;
				
				_idmodelo=_res.data.id_p_INFmodelo;
				
				for(_nord in _res.data.seccionesOrden){
				
					_idseccion=_res.data.seccionesOrden[_nord];
					_datacont=_res.data.secciones[_idseccion];
					
					_div=document.createElement('div');
					_div.setAttribute('class','seccionOrg');
					_div.innerHTML='<b>Seccion:</b><br>'+_datacont.nombre;
					_div.setAttribute('idsecc',_idseccion);
					_div.setAttribute('id',_idseccion);
					_div.setAttribute('draggable','true');
					_div.setAttribute('ondragstart',"dragSecc(event,this)");
					_div.setAttribute('ondragend',"desgranda(this)");
					_div.setAttribute('onclick',"editarSeccion(this)");
					
					if(_datacont.usodesde=='0000-00-00'&&_datacont.usohasta=='0000-00-00'){
						_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=false;
					}else{
						/*
						_sp=_datacont.usodesde.split('-');
						_form.querySelector("input[name='usodesde_a']").value=_sp[0];
						_form.querySelector("input[name='usodesde_m']").value=_sp[1];
						_form.querySelector("input[name='usodesde_d']").value=_sp[2];
						_sp=_datacont.usohasta.split('-');
						_form.querySelector("input[name='usohasta_a']").value=_sp[0];
						_form.querySelector("input[name='usohasta_m']").value=_sp[1];
						_form.querySelector("input[name='usohasta_d']").value=_sp[2];
						_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=true;
						*/
					}
				
					_form.querySelector('#indiceSecciones').appendChild(_div);
					
					_sep=document.createElement('div');
					_sep.setAttribute('class','separadorSecc');
					_sep.setAttribute('ondragover','agranda(event,this)');
					_sep.setAttribute('ondragleave','desgranda(this)');
					_sep.setAttribute('ondrop','dropSecc(event,this)');
					_form.querySelector('#indiceSecciones').appendChild(_sep);					
					
				}
				
				_div=document.createElement('a');
				_div.setAttribute('class','seccionOrg');
				_div.innerHTML="añadir una nueva Seccion";
				_div.setAttribute('idmodelo',_idmodelo);
				_div.setAttribute('onclick','crearSeccion(this)');
				_form.querySelector('#indiceSecciones').appendChild(_div);
			}
		});
		
		_parametros=Array();
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_archivos.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				
				for(_nn in _res.data){
					
					_img=document.createElement('img');						
					
					if(_res.data[_nn].vers.muestra!='no'){
						_img.setAttribute('src',_res.data[_nn].vers.muestra);
					}else if(_res.data[_nn].vers.HD!='no'){
						_img.setAttribute('src',_res.data[_nn].vers.HD);
					}else{
						_img.setAttribute('src',_res.data[_nn].vers.original);
					}
					
					if(_res.data[_nn].vers.HD!='no'){
						_img.setAttribute('ref',_res.data[_nn].vers.HD);
					}else{
						_img.setAttribute('ref',_res.data[_nn].vers.original);
					}
					_img.setAttribute('onclick','referenciarComponente(this)');	
					//alert('?');		
					document.querySelector('#editorindice #editordecomp #lienzo').appendChild(_img);
				}
				
			}
		});			
	}


	function guardarTexto(){
		
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}		

		//accion para absorber código basura generado por editores de texto al copiar pegar
		_con=$('#editordetexto #mce_redacc').html( tinymce.get('mce_redacc').getContent({format: 'html'}));
		
		_contcrudo = _con['0'].textContent;
		//console.log(_contcrudo);
		
		_result=Array();		
		_regex=/<!-- \[if([^]+)<!\[endif]-->/g;
		if(new RegExp(_regex).test(_contcrudo)){
			_result = _contcrudo.match(_regex).map(function(val){
				return  val;
			});
		}
		
		for(_nc in _result){
			_contcrudo=_contcrudo.replace(_result[_nc],'');
		}
		
		//_contcrudo=_contcrudo.replace('&lt;p&gt;&nbsp;&lt;/p&gt;','');
		//_contcrudo=_contcrudo.replace(/<p>&nbsp;<\/p>/g,'');
		
		_contcrudo=_contcrudo.replace(new RegExp(String.fromCharCode(160), "g"),' ');
		$('#editordetexto #mce_redacc').html(tinymce.get('mce_redacc').setContent(_contcrudo, {format: 'HTML'}));		
		//$('#editordetexto #mce_redacc').html(_contcrudo);//actualiza el formulario de texto formateado		  
		//$('#editordetexto #mce_redacc').html(tinymce.get('mce_redacc').getContent());//actualiza el formularios de texto formateado		

		
		// Send the data using post		
		//alert($('#'+idform).serialize());
		//return;
		
		
		 cerrarFormEstado('editordetexto');
		_parametros={
			'id': document.querySelector('#editordetexto [name="id"]').value,
			'id_p_INFinforme_id': document.querySelector('#editordetexto [name="id_p_INFinforme_id"]').value,
			'id_p_INFsecciones_id': document.querySelector('#editordetexto [name="id_p_INFsecciones_id"]').value,
			'texto':_contcrudo
		}
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_ed_redacc.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				
				Actualizar(_res);
				
			}
		});			
				
	}


	function guardar(_this){
		
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}		
		
		var _this=_this;

		//accion para absorber código basura generado por editores de texto al copiar pegar
		_con=$('#editordetexto #mce_redacc').html( tinymce.get('mce_redacc').getContent({format: 'html'}));
		
		
		//console.log(_con);
		_contcrudo = _con['0'].textContent;
		//console.log(_contcrudo);
		
		_result=Array();
		
		_regex=/<!-- \[if([^]+)<!\[endif]-->/g;
		if(new RegExp(_regex).test(_contcrudo)){
			_result = _contcrudo.match(_regex).map(function(val){
				return  val;
			});
		}
		
		
		for(_nc in _result){
			_contcrudo=_contcrudo.replace(_result[_nc],'');
		}
		
		//_contcrudo=_contcrudo.replace('&lt;p&gt;&nbsp;&lt;/p&gt;','');
		//_contcrudo=_contcrudo.replace(/<p>&nbsp;<\/p>/g,'');
		
		_contcrudo=_contcrudo.replace(new RegExp(String.fromCharCode(160), "g"),' ');
		$('#editordetexto #mce_redacc').html(tinymce.get('mce_redacc').setContent(_contcrudo, {format: 'HTML'}));
		
		$('#editordetexto #mce_redacc').html(_contcrudo);//actualiza los formularios de texto formateado		  
		$('#editordetexto #mce_redacc').html(tinymce.get('mce_redacc').getContent());//actualiza los formularios de texto formateado		
		$('#mce_epigrafe').html( tinymce.get('mce_epigrafe').getContent());//actualiza los formularios de texto formateado

		url = _this.parentNode.getAttribute('action');
	    idform=_this.parentNode.getAttribute("id");

		// Send the data using post		
		//alert($('#'+idform).serialize());
		//return;

		
		var posting = $.post( url, $('#'+idform).serialize())
			.done(function(response,_tx,_algo) {
			
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				
				console.log(_res);
				var _idsecc=_res.data.idsecc;
				if(_res.data.def!=undefined){
					//efecto definido
					Actualizar(_res);
					if(_this.parentNode.getAttribute('action')=='./INF/INF_ed_epigrafe.php'){
						editordeimagenAct(_idsecc);
					}
				}
				cerrar(_this);
				
			});
	}

	function eliminar(_this){ //Elimina (permanente) un componente
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _this=_this;
		if(_this.parentNode.querySelector("input[name='id']").value==''){
			return;
		}
		
	    var r = confirm("¿Confirma eliminar este componente de sección de forma permanente?");
	    if (r == true) {
	    	_idcomp=_this.parentNode.querySelector("input[name='id']").value;
	    	_idsecc=_this.parentNode.querySelector("input[name='idsecc']").value;
	    	
	    	var _parametros={
	    		'idcomp':_idcomp,
	    		'idsecc':_idsecc,
	    		"IdPanel" : _PanId
	    	}
	    	
	    	$.ajax({
				data: _parametros,
				type:'post',
				url:   './INF/INF_ed_elim_componente.php',
				success:  function (response){
					_res = PreprocesarRespuesta(response);
					if(_res.res!='exito'){return;}
				
					cerrar(_this);
					
					_comp=_form.querySelectorAll('div[idcomp="'+_idcomp+'"][idsecc"'+_idsecc+'"]');
					for(_nc in _comp){
                        _comp[_nc].parentNode.removeChild(_comp[_nc]);
					}		
				}
			})
	    } else{
	    	//alert('f');
	    }	
	}

function formularCaratula(){
	
	document.querySelector('#formcaratula').setAttribute('estado','activo');
	
	_dat=_DatosModelos.modelos[_IdModelo];
	
	_opsel=document.querySelector('#formcaratula [name="caratulamodo"] option[value="'+_dat.caratulamodo+'"]');
	if(_opsel!=null){_opsel.selected='selected';}
	
    //document.querySelector('#formcaratula [name="caratulahtml"]').value=_dat.caratulahtml;            
    $('#formcaratula #caratulahtml').html(tinymce.get('caratulahtml').setContent(_dat.caratulahtml, {format: 'HTML'}));    
                    
}


	function editarCaratula(){

		
		_con=$('#' + 'caratulahtml').html( tinymce.get('caratulahtml').getContent({format: 'html'}));
		_contcrudo = _con['0'].textContent;
		_result=Array();		
		_regex=/<!-- \[if([^]+)<!\[endif]-->/g;
		if(new RegExp(_regex).test(_contcrudo)){
			_result = _contcrudo.match(_regex).map(function(val){
				return  val;
			});
		}
		
		
		for(_nc in _result){
			_contcrudo=_contcrudo.replace(_result[_nc],'');
		}
		_contcrudo=_contcrudo.replace(new RegExp(String.fromCharCode(160), "g"),' ');	
		$('#formcaratula #caratulahtml').html(tinymce.get('caratulahtml').setContent(_contcrudo, {format: 'HTML'}));	
		$('#formcaratula #caratulahtml').html(_contcrudo);//actualiza los formularios de texto formateado		  
		$('#formcaratula #caratulahtml').html(tinymce.get('caratulahtml').getContent());//actualiza los formularios de texto formateado		
		_html=tinymce.get('caratulahtml').getContent({format: 'html'});
		
		_parametros={			
				caratulahtml:_html,
				idmodelo:_IdModelo,
				caratulamodo:document.querySelector('#formcaratula #caratulahtml').value,
				panid:_PanId
		}
		
		document.querySelector('#formcaratula').removeAttribute('estado');
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_ed_guarda_modelo_caratula.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}			
				
				paso1();
			}
		})		
	}


	function eliminarSecc(_this){ //Elimina (papelera) una seccion
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _this=_this;
		if(_this.parentNode.querySelector("input[name='id']").value==''){
			return;
		}
		_idelim=_this.parentNode.querySelector("input[name='id']").value;
	    if (confirm("¿Confirma eliminar esta seccion id:"+_idelim+" ?")){
	    	
	    	var _parametros={
	    		'idsecc':_idelim
	    	}
	    	
	    	$.ajax({
				data: _parametros,
				type:'post',
				url:   './INF/INF_ed_elim_seccion.php',
				success:  function (response){
					_res = PreprocesarRespuesta(response);
					if(_res.res!='exito'){return;}
					cerrar(_this);
					
					_comp=_form.querySelector('div.componenteOrg[idcomp="'+_idcomp+'"]');
					_compi=_comp.nextSibling;
					_comp.parentNode.removeChild(_comp);
					_compi.parentNode.removeChild(_compi);
					
					_parrafoselim=dcoument.querySelectorAll("div#contenidobase .precarga[idsec='"+_idsecc+"']");
					
					for(_np in _parrafoselim){
						_parrafoselim[_np].paernteNode.removeChild(_parrafoselim[_np]);
					}								
				}
			})
	    }
	
	}
	


	
	function editarComponente(_this){
		var _this =  _this;
		var _idseccion=_this.getAttribute('idsecc');
		var _idcomp=_this.getAttribute('idcomp');

		_form = document.getElementById('editorComponente');
		_form.style.display='block';
		
		_parametros={
			id:_idseccion
		}
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_consulta_seccion.php',
			erro:   function (response){alert('error al intentar contactar al servidor');},
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
					
				_dat=_res.data.seccion.contenidos[_idcomp];
				_idsecc=_res.data.seccion.id;
				//console.log(_res);
				_form = document.getElementById('editorComponente');
				_form.querySelector("input[name='id']").value=_dat.id;
				_form.querySelector("input[name='obs']").value=_dat.obs;
				_form.querySelector("input[name='idsecc']").value=_idsecc;
				
				_form.querySelector("textarea[name='formula']").value=_dat.formula;				
				$("select[name='tipo']").val(_dat.tipo);
			}
		})
	}	
	
	function crearComponente(_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _this =  _this;
		var _idseccion=_this.getAttribute('idsecc');
		var _form = document.getElementById('editorseccion');
		
		_parametros={
			'idsecc':_idseccion
		}
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_ed_crear_componente.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}
				
				_div=document.createElement('div');
				_div.setAttribute('class','componenteOrg');
				_div.innerHTML='-tipo indefinido-';
				_div.title=_datacont.formula;
				_div.setAttribute('idcomp',_res.data.nid);
				_div.setAttribute('idsecc',_idseccion);
				_div.setAttribute('onclick','editarComponente(this)');
				_div.setAttribute('draggable','true');
				_div.setAttribute('ondragstart',"drag(event,this)");
				_div.setAttribute('ondragend',"desgranda(this)");
				
				_form.querySelector('#listadoAutosecciones').appendChild(_div);
				
				_sep=document.createElement('div');
				_sep.setAttribute('class','separadorComp');
				_sep.setAttribute('ondragover','agranda(event,this)');
				_sep.setAttribute('ondragleave','desgranda(this)');
				_sep.setAttribute('ondrop','drop(event,this)');
				_form.querySelector('#listadoAutosecciones').appendChild(_sep);		
				
				_form.querySelector('#listadoAutosecciones').appendChild(_this);			
			}
		})		
	}
	
	function crearSeccion(_this){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		var _this =  _this;
		var _form = document.getElementById('editorindice');
		var _idmodelo=_form.querySelector("input[name='idmodelo']").value;
		_parametros={
			'idmodelo':_idmodelo
		}
		
		$.ajax({
			data: _parametros,
			type:'post',
			url:   './INF/INF_ed_crear_seccion.php',
			success:  function (response){
				_res = PreprocesarRespuesta(response);
				if(_res.res!='exito'){return;}				
					
				_dat=_res.data;
				_ModDat=_res.data.modelo;			
				_idmodelo=_idmodelo;
			
				_idseccion=_dat.nid;
				_div=document.createElement('div');
				_div.setAttribute('class','seccionOrg');
				_div.innerHTML='<b>Seccion:</b>'+'Nueva Seccion';
				_div.setAttribute('idsecc',_idseccion);
				_div.setAttribute('id',_idseccion);
				_div.setAttribute('draggable','true');
				_div.setAttribute('ondragstart',"dragSecc(event,this)");
				_div.setAttribute('ondragend',"desgranda(this)");
				_div.setAttribute('onclick',"editarSeccion(this)");
				
				if(_datacont.usodesde=='0000-00-00'&&_datacont.usohasta=='0000-00-00'){
					_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=false;
				}else{
					/*
					_sp=_datacont.usodesde.split('-');
					_form.querySelector("input[name='usodesde_a']").value=_sp[0];
					_form.querySelector("input[name='usodesde_m']").value=_sp[1];
					_form.querySelector("input[name='usodesde_d']").value=_sp[2];
					_sp=_datacont.usohasta.split('-');
					_form.querySelector("input[name='usohasta_a']").value=_sp[0];
					_form.querySelector("input[name='usohasta_m']").value=_sp[1];
					_form.querySelector("input[name='usohasta_d']").value=_sp[2];
					_form.querySelector("input[type='checkbox'][for='fechasDisc']").checked=true;
					*/
				}
			
				_ind=_form.querySelector('#indiceSecciones');
				_boton=_form.querySelector('#indiceSecciones a');
				_ind.insertBefore(_div,_boton);
				
				_sep=document.createElement('div');
				_sep.setAttribute('class','separadorSecc');
				_sep.setAttribute('ondragover','agranda(event,this)');
				_sep.setAttribute('ondragleave','desgranda(this)');
				_sep.setAttribute('ondrop','dropSecc(event,this)');						
				_ind.insertBefore(_sep,_boton);					
			}
		})		
	}	
