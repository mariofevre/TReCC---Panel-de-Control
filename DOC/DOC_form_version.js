/*
funciones js para operacion del formulario de versiones 
*/
	
function cerrarForm(){
	
	_form.parentNode.removeChild(_form);		
}


var InputComActivo=null;

var _mesnom = new Array(7);
_mesnom[1]=  "enero";
_mesnom[2] = "febrero";
_mesnom[3] = "marzo";
_mesnom[4] = "abril";
_mesnom[5] = "mayo";
_mesnom[6] = "junio";
_mesnom[7] = "julio"; 
_mesnom[8] = "agosto";
_mesnom[9] = "septiembre";
_mesnom[10] = "octubre";
_mesnom[11] = "noviembre";
_mesnom[12] = "diciembre";

function elegirCom(_this,_tipo){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		_aes=document.getElementById('formcent').querySelectorAll('a.elige');
		
		for(_nn in _aes){//deselecciona otros botones 'elegir'
			if(typeof _aes[_nn].style=='object'){
				_aes[_nn].style.color='';
			}
		}
		
		_this.style.color='#999';//selecciona botón 'elegir'
		
				
		_aes=document.getElementById('formcent').querySelectorAll('span.muestra');
		for(_nn in _aes){
			if(typeof _aes[_nn].style=='object'){//deselecciona otros spn de muestra
				_aes[_nn].style.backgroundColor='';
			}
		}		
		_this.nextSibling.style.backgroundColor='#fff';//deselecciona actual span de muestra
		
		document.querySelector('#op_comunicaciones').style.display='inline-block';
		
		_divs=document.querySelectorAll('#op_comunicaciones #sentido div a,	#op_comunicaciones #sentido div h4,	#op_comunicaciones #contrasentido div a,#op_comunicaciones #contrasentido div h4');
		
		for(_nn in _divs){
			if(typeof _divs[_nn] =='object'){
			_divs[_nn].parentNode.removeChild(_divs[_nn]);
			}
		}

		var _this = _this;
		InputComActivo =_this;
        _parametros={'panid':_PanelI}
		
 		$.ajax({
			url:   './COM/COM_consulta_listadito.php',
			type:  'post',
			data: _parametros,
			success:  function (response){
				var _res = $.parseJSON(response);
				console.log(_res);
				DatosComs=_res.data.ordenado;	
				_form=document.getElementById('formcent');
				_grupoA=JSON.parse(_form.getAttribute('ga'));
				_grupoB=JSON.parse(_form.getAttribute('gb'));

				function agregaOp(_dat,_sent,_div){
					
					_spt=_dat.zz_reg_fecha_emision.split("-");
					_ano=_spt[0];
					_mes=_spt[1];
					
					_Ddiv=_form.querySelector("#op_comunicaciones #"+_sent+" #"+_div+", #op_comunicacionesCambia #"+_sent+" #"+_div);
					_mn=_Ddiv.getAttribute('mesano');
					
					if(_mn!=_mes+_ano){
						_Ddiv.setAttribute('mesano',_mes+_ano);
						_hh=document.createElement('h4');
						_hh.innerHTML= _mesnom[parseInt(_mes)]+' de '+_ano;
						_Ddiv.appendChild(_hh);
					}
					
					_op=document.createElement('a');
					_op.title=_dat.nombre;
					
					if(_Grupos.grupos[_dat.idga]==undefined){
						_grupocod='Grl';
					}else{
						_grupocod=_Grupos.grupos[_dat.idga].codigo;
					}
					_op.innerHTML='<span class="contenido aclara">'+_grupocod+'</span>';
					
					if(_Grupos.grupos[_dat.idgb]==undefined){
						_grupocod='Grl';
					}else{
						_grupocod=_Grupos.grupos[_dat.idgb].codigo;
					}
					_op.innerHTML+='<span class="contenido aclara">'+_grupocod+'</span>';
					
					_op.innerHTML+=_dat.falsonombre;
					_op.setAttribute('idreg',_dat.id);
					_op.setAttribute('onclick',"seleccionaCom(this)");
					//console.log("#op_comunicaciones #"+_sent+" #"+_div);
					_form.querySelector("#op_comunicaciones #"+_sent+" #"+_div+",#op_comunicacionesCambia #"+_sent+" #"+_div).appendChild(_op);
					//<span class="contenedor aclara">					
				}
				
				console.log(_tipo);
				if(_tipo=="presenta"||_tipo=="anula"){
					for(_nn in _res.data.comunicacionesOrden){
						_idcom=_res.data.comunicacionesOrden[_nn];
						_va=_res.data.comunicaciones[_idcom];

                        if(_va.sentido!='entrante'){continue;}
                        						
						_coincideA='no';
						for(_idg in _grupoA){
							if(_va.id_p_grupos_id_nombre_tipoa==_idg){
								_coincideA='si';
							}
							if(_idg==null||_idg=="0"){
								_coincideA='si';
							}
							if(_va.idga==0){
								_coincideA='si';
							}
						}
						
						_coincideB='no';
						for(_idg in _grupoB){
							if(_va.idgb==_idg){
								_coincideB='si';
							}
							if(_idg==null||_idg=="0"){
								_coincideB='si';
							}
							if(_va.idgb==0){
								_coincideB='si';
							}
						}
						
						
						
						if(_coincideA=='si'){
							if(_coincideB=='si'){
								//1seleccion
								agregaOp(_va,'sentido','sel1');
							}else{
								//2seleccion
								agregaOp(_va,'sentido','sel2');
							}
						
						}else if(_coincideB=='si'){
							//_3selec
							agregaOp(_va,'sentido','sel3');
						}else{
							//_4selec
							agregaOp(_va,'sentido','sel4');
						}
						
					}
					
					
					for(_nn in _res.data.comunicacionesOrden){
						_idcom=_res.data.comunicacionesOrden[_nn];
						_va=_res.data.comunicaciones[_idcom];
                        if(_va.sentido!='saliente'){continue;}
                        		
						
						if(_va.idga==0||_va.idga==_grupoA||_grupoA==0){
							if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
								//1seleccion
								agregaOp(_va,'contrasentido','sel1');
							}else{
								//2seleccion
								agregaOp(_va,'contrasentido','sel2');
							}
						
						}else if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
							//_3selec
							agregaOp(_va,'contrasentido','sel3');
						}else{
							//_4selec
							agregaOp(_va,'contrasentido','sel4');
						}
						
					}
				}
				if(_tipo=="aprueba"||_tipo=="rechaza"){
					for(_nn in _res.data.comunicacionesOrden){
						_idcom=_res.data.comunicacionesOrden[_nn];
						_va=_res.data.comunicaciones[_idcom];
                        if(_va.sentido!='saliente'){continue;}
						
						
						if(_va.idga==0||_va.idga==_grupoA||_grupoA==0){
							if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
								//1seleccion
								agregaOp(_va,'sentido','sel1');
							}else{
								//2seleccion
								agregaOp(_va,'sentido','sel2');
							}
						
						}else if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
							//_3selec
							agregaOp(_va,'sentido','sel3');
						}else{
							//_4selec
							agregaOp(_va,'sentido','sel4');
						}
						
					}
					
					for(_nn in _res.data.comunicacionesOrden){
						_idcom=_res.data.comunicacionesOrden[_nn];
						_va=_res.data.comunicaciones[_idcom];
                        if(_va.sentido!='entrante'){continue;}
						
						
						if(_va.idga==0||_va.idga==_grupoA||_grupoA==0){
							if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
								//1seleccion
								agregaOp(_va,'contrasentido','sel1');
							}else{
								//2seleccion
								agregaOp(_va,'contrasentido','sel2');
							}
						
						}else if(_va.idgb==0||_va.idgb==_grupoB||_grupoB==0){
							//_3selec
							agregaOp(_va,'contrasentido','sel3');
						}else{
							//_4selec
							agregaOp(_va,'contrasentido','sel4');
						}
						
					}
				}
				
			}
		});	
	
}	
	
	
function seleccionaCom(_this){

	_selecTx=_this.innerHTML;
	_selecTitle=_this.title;
	_selecId=_this.getAttribute('idreg');
	
		
	InputComActivo.parentNode.querySelector('span.muestra').style.backgroundColor='';
	InputComActivo.parentNode.querySelector('span.muestra').innerHTML=_selecTx;
	InputComActivo.parentNode.querySelector('span.muestra').title=_selecTitle;
	InputComActivo.parentNode.querySelector('span.muestra').setAttribute('onclick','verCom(this)');
	InputComActivo.parentNode.querySelector('input').value=_selecId;
	
	InputComActivo.parentNode.querySelector('.vacia').style.display='inline-block';
	InputComActivo.parentNode.querySelector('.elige').style.display='none';
	document.querySelector('#op_comunicaciones').style.display='none';
}

function verCom(_this){
	if(_this.parentNode.querySelector('input').value>0){
		_url="http://192.168.0.237/paneldecontrol/COM_gestion.php?id="+_this.parentNode.querySelector('input').value;
		window.open(_url,'_blank');
	}
}

function cargaCom(_idcom,_span){//consulta y carga las comunicaciones de una versión al formulario

	var _idcom = _idcom;		
	var _span = _span;
	var _parametros = {
		'id':_idcom
	};
	
	$.ajax({
		url:   './COM/COM_consulta_listadito.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			console.log(_res);
			//DatosComs=_res.data;	
			
			if(_res.data==''){
				return;
			}
			
			_idcom=_res.data.comunicacionesOrden[0];
			_dat=_res.data.comunicaciones[_idcom];
			if(_Grupos.grupos[_dat.idga]==undefined){
				_grupocod='Grl';
			}else{
				_grupocod=_Grupos.grupos[_dat.idga].codigo;
			}
			_span.setAttribute('onclick','verCom(this)');
			_span.innerHTML='<span class="contenido aclara">'+_grupocod+'</span>';
			if(_Grupos.grupos[_dat.idgb]==undefined){
				_grupocod='Grl';
			}else{
				_grupocod=_Grupos.grupos[_dat.idgb].codigo;
			}
			_span.innerHTML+='<span class="contenido aclara">'+_grupocod+'</span>';
			_span.innerHTML+=_dat.falsonombre;
				

		}
	});	
	
}	
	
	
	
//vacia eleccion de comunición	
function vaciar(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_this.parentNode.querySelector('.muestra').innerHTML='';
	_this.style.display='none';
	_this.parentNode.querySelector('.elige').style.display='inline-block';
	_this.parentNode.querySelector('input').value='-[-BORRX-]-';
}

//vacia fecha para un campo	
function vaciarFecha(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_campo=_this.getAttribute('para');
	document.querySelector('input[name="'+_campo+'_a"]').value='0000';
	document.querySelector('input[name="'+_campo+'_m"]').value='00';
	document.querySelector('input[name="'+_campo+'_d"]').value='00';
}	


function enviarFormularioVer(_accion){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_FF=$('#formcent').serialize();
	//console.log(_FF);
	//alert('o')
	//alert(_accion);
	
	$.post(
		'./DOC/DOC_ed_guarda_ver.php', 
		$('#formcent').serialize()+'&panid='+_PanelI+'&accion='+_accion,
		function(response){						  	
	        var _res = $.parseJSON(response);       
	        //alert(typeof _res);
	        if(_res.res=='err'){alert('ocurrió un error');}
	        for(_nm in _res.mg){alert(_res.mg[_nm]);}
			//consultarEstructura();	
			cerrarForm();
			
			
			//document.getElementById("contenidoextenso").innerHTML='';
			consultarDocs(_res.data.iddoc);		//funcion en el docuemtno raiz
		}
	);
}	
	
function enviarFormularioMulti(){
	
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	
	_parametros=$('#formcent').serialize()+'&panid='+_PanelI
	
	$.post('./DOC/DOC_ed_multiver.php', _parametros ,function(response){						  	
        var _res = $.parseJSON(response);               
        if(_res.res=='err'){alert('ocurrió un error');}
        
        for(_nm in _res.mg){alert(_res.mg[_nm]);}
		//consultarEstructura();	
		
		cerrarForm();
		//document.getElementById("contenidoextenso").innerHTML='';
		consultarDocs(_idreg);	
	});	
}		
	
/*de aquí en más están copiadas de arrastre: eliminar**/

function alterna(_id, _estado){
	if(_estado==false){
		document.getElementById(_id).value='0';
	}else if(_estado==true){
		document.getElementById(_id).value='1';
	}
}

function opcionar(_this){
	
	vaciarOpcionares();
	
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');
	_tipo=_id.substring(27,28);
	recargaDatosGrupos(_destino,_tipo);
}


function opcionarHitos(_this){
	vaciarOpcionares();		
	_this.nextSibling.style.display="inline-block";
	_destino=_this.nextSibling.querySelector(".contenido");
	_id=_this.getAttribute('id');
	
	_tipo=_id.substring(1,(_id.length-2));
	recargarHitos(_destino,_tipo);
}	

var _nFile=0;	
var xhr=Array();
var inter=Array();

function subirDocumento(_this){
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
	
  // Get the selected files from the input.  
	var files = _this.files;		
	
	_idreg=document.getElementById('cid').value;
	
    for (i = 0; i < files.length; i++) {    
        
        _nFile++;
        
        console.log(files[i]);
        var parametros = new FormData();
        parametros.append('upload',files[i]);
        parametros.append('nfile',_nFile);
        
        var _nombre=files[i].name;
        _upF=document.createElement('a');
        _upF.setAttribute('nf',_nFile);
        _upF.setAttribute('class',"archivo");
        _upF.setAttribute('size',Math.round(files[i].size/1000));
        _upF.innerHTML=files[i].name;
        document.querySelector('#listadosubiendo').appendChild(_upF);
        
        _nn=_nFile;
        xhr[_nn] = new XMLHttpRequest();
        xhr[_nn].open('POST', './DOC/DOC_ed_guarda_adjunto.php', true);
        xhr[_nn].upload.li=_upF;
        xhr[_nn].upload.addEventListener("progress", updateProgress, false);

        xhr[_nn].onreadystatechange = function(evt){
            //console.log(evt);
            
            if(evt.explicitOriginalTarget.readyState==4){
                var _res = $.parseJSON(evt.explicitOriginalTarget.response);
                //console.log(_res);
                //alert('terminó '+_res.data.nf);
                
                if(_res.res=='exito'){							
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');								
                    document.querySelector('#listadosubido').appendChild(_file);
                    _file.setAttribute('href',_res.data.ruta);
                    _file.setAttribute('download',_file.innerHTML);
                    _file.setAttribute('idfi',_res.data.nid);
                }else{
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
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


function ConfEliminarArchivo(_this,_event){
    _event.stopPropagation();
    _event.preventDefault();
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	var _this = _this;
	console.log(_this);
	_div=document.createElement('div');
	document.body.appendChild(_div);
	_div.setAttribute('class','alerta');
	_div.innerHTML="<h1>eliminar archivo</h1>";
    _div.innerHTML+="<a onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>cancelar</a>",
    _div.innerHTML+=" <a idarch='"+_this.getAttribute('idarch')+"' onclick='eliminarArchivo(this);'>eliminar</a>";
	_div.innerHTML+="<br>id: "+ _this.getAttribute('idarch');
	_div.innerHTML+="<br>archivo: "+ _this.getAttribute('archivo');
}

function eliminarArchivo(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	//console.log(_this);
	var _this=_this;
	
	_idver=document.querySelector('#formcent input#cid').value;
	_idarch=_this.getAttribute('idarch');			
	var parametros = new FormData();
	parametros.append("id_p_DOCversion_id",_idver);
	parametros.append("id",_idarch);
	parametros.append("zz_AUTOPANEL",_PanelI);
	
	_url = 	'./DOC/DOC_ed_borra_archivo.php';
	//parametros.append("idUbic",_idUbic);
	
	//cargando(_nom);
	
	$.ajax({
			data:  parametros,
			url:   _url,
			type:  'post',
			processData: false, 
			contentType: false,
			success:  function (response) {
				var _res = $.parseJSON(response);
				console.log(_res);
				if(_res.res=='exito'){
					_botonelim=document.querySelector('div#listadosubido a a.archivoelim[idarch="'+_res.data.id+'"]')
					_botonelim.parentNode.parentNode.removeChild(_botonelim.parentNode);
					
				}else{
					alert('error al eliminar el archivo');
				}
			}
	});
	
	
	_this.parentNode.parentNode.removeChild(_this.parentNode);
}	

function ConfirmaEliminarVersion(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_div=document.createElement('div');
	document.body.appendChild(_div);
	
	_cid=document.getElementById('formcent').querySelector('input#cid').value;
	_iddoc=document.getElementById('formcent').querySelector('input#Iid_p_DOCdocumento_id').value;
	
	_div.setAttribute('class','alerta');
	_div.innerHTML="<h1>eliminar version<h1>";
	_div.innerHTML+="<br>id: "+ _cid;
	_div.innerHTML+="<br><A onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>cancelar</a>";
	_div.innerHTML+="<br><A idver='"+_cid+"' iddoc='"+_iddoc+"' onclick='eliminarVersion(this);'>eliminar</a>";
	
}

function eliminarVersion(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
		//console.log(_this);
	var _this=_this;
	_idver=_this.getAttribute('idver');
	_iddoc=_this.getAttribute('iddoc');			
	var parametros = new FormData();
	parametros.append("accion","borrar");
	parametros.append("idver",_idver);
	parametros.append("iddoc",_iddoc);
	parametros.append("panid",_PanelI);
	
	$.ajax({
			data:  parametros,
			url:   './DOC/DOC_ed_borra_ver.php',
			type:  'post',
			processData: false, 
			contentType: false,
			success:  function (response) {
				var _res = $.parseJSON(response);
				console.log(_res);
				if(_res.res=='exito'){
					
					_alerta=_this.parentNode;
					_alerta.parentNode.removeChild(_alerta);
				
					_idreg=document.getElementById('Iid_p_DOCdocumento_id').value;
					cerrarForm();
					consultarDocs(_idreg);		//funcion en el docuemtno raiz
					
				}else{
					alert('error al eliminar la version');
				}
			}
	});
}	
