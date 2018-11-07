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

function opcionarGrupos(_this){		
    vaciarOpcionares();		
    _this.nextSibling.style.display="inline-block";
    _destino=_this.nextSibling.querySelector(".contenido");
    _id=_this.getAttribute('id');
    console.log(_id);
    _tipo=_id.substring(27,28);
    //consultarGrupos(_destino,_tipo);		
    
    _this.nextSibling.style.display="inline-block";
    _destino=_this.nextSibling.querySelector(".contenido");
    _id=_this.getAttribute('id');		
    _destino.innerHTML='';
    console.log(_cat);
    
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


function opcionarDef(_this){
	if(_this.value=='-'){_this.value='';}
    vaciarOpcionares();		
    _nn=_this.getAttribute('name');
    _ss=_nn.split('-');//para separar el final -n utilizado en un input de texto que refiere a una categoría con id
    _spl=_ss[0].split('_');
    _cat='id_'+_spl[6];
    _this.nextSibling.style.display="inline-block";
    _destino=_this.nextSibling.querySelector(".contenido");
    _id=_this.getAttribute('id');		
    _destino.innerHTML='';
    console.log(_cat);
    for(_nn in DatosDocs.categoriasOrden[_cat]){
        _regid=DatosDocs.categoriasOrden[_cat][_nn];
        _dat=DatosDocs.categorias[_cat][_regid];
        console.log(_dat);
         console.log(_regid);
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('regid',_regid);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
}	

function vaciarOpcionares(_event){
				
    if(_event!=undefined){
        console.log(_event);
        console.log(_event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling);
        console.log(_event.originalTarget);
        
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
    			
    console.log(_ff +' -> asignando:'+_idcat);
    
    _input=document.querySelector('#formcent input#'+_ff);
    _input.value=_idcat;
    
    				
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


function enviarFormularioDoc(_accion){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_FF=$('#formcent').serialize();
	console.log(_FF);
	_idreg=document.querySelector('#formcent #cid').value;
	
	
	$.post(_accion+'.php', _FF ,function(response){						  	
        var _res = $.parseJSON(response);
		//consultarEstructura();	
		cerrarForm();
		
		for(_nm in _res.mg){
			alert(_res.mg[_nm]);
		}
		if(_res.res!='exito'){
			alert('error al consultar la base de datos')
		}
		
		//document.getElementById("contenidoextenso").innerHTML='';
		consultarDocs(_res.data.plano.id);		//funcion en el docuemtno raiz
	});	
}	
	
	/*
function enviarFormularioMulti(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	
	$.post('./DOC/DOC_ed_multiver.php', $('#formcent').serialize(),function(response){						  	
        //var _res = $.parseJSON(response);
		//consultarEstructura();	
		cerrarForm();
		//document.getElementById("contenidoextenso").innerHTML='';
		location.reload();
	});	
}		*/
	
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
		if(_HabilitadoEdicion!='si'){alert('su usuario no tiene permisos de edicion');return;}
		var files = _this.files;		
		_idreg=document.querySelector('#formcent input#cid').value;
		
        for (i = 0; i < files.length; i++) {  
            _nFile++;            
            //console.log(files[i]);
            var parametros = new FormData();
            parametros.append('upload',files[i]);
            parametros.append('nfile',_nFile);
            parametros.append('id_p_DOCversion_id',_idreg);
            parametros.append('zz_AUTOPANEL',_PanelI);
            
            
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

	function updateProgress(evt) {
		if (evt.lengthComputable) {
			var percentComplete = 100 * evt.loaded / evt.total;		   
			this.li.style.width="calc("+Math.round(percentComplete)+"% - ("+Math.round(percentComplete)/100+" * 6px))";
		} else {
			// Unable to compute progress information since the total size is unknown
		} 
	}

function ConfEliminarDocumento(_this,_event){
	_ff=document.querySelectorAll('#formconfirma');
	for(_nf in _ff){
		if(typeof _ff[_nf] != 'object'){continue;}
		_ff[_nf].parentNode.removeChild(_ff[_nf]);	
	}
	
    _event.stopPropagation();
    _event.preventDefault();
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	var _this = _this;
	console.log(_this);
	_div=document.createElement('div');
	_div.setAttribute('id','formconfirma');
	document.body.appendChild(_div);
	_div.setAttribute('class','alerta');
	
	_hh=document.createElement('h1');
	_hh.innerHTML='eliminar Documento';
	_div.appendChild(_hh);
	
	_aa=document.createElement('a');
	_aa.setAttribute('onclick','this.parentNode.parentNode.removeChild(this.parentNode);');
	_aa.innerHTML='cancelar';
	_div.appendChild(_aa);

	_iddoc=document.querySelector('#formcent #cid').value;
	
	_aa=document.createElement('a');
	_aa.setAttribute('iddoc',_iddoc);
	_aa.setAttribute('onclick','eliminarDocumento(this);');
	_aa.innerHTML='eliminar';
	_div.appendChild(_aa);
	
	_div.innerHTML+="<br>id: "+ _iddoc;
	_div.innerHTML+="<br>numero: "+ document.querySelector('#formcent #Inumero').value;
	_div.innerHTML+="<br>nombre: "+ document.querySelector('#formcent #Inombre').value;
	
}

function eliminarDocumento(_this){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	//console.log(_this);
	var _this=_this;
		
	_param={
		'iddoc':_this.getAttribute('iddoc')		
	};
	
	$.ajax({
			data:  _param,
			url:   './DOC/DOC_ed_borra_doc.php',
			type:  'post', 
			error:  function (response) {alert('error al consultar el servidor');},
			success:  function (response) {
				var _res = $.parseJSON(response);
				console.log(_res);
				if(_res.res=='exito'){
					consultarDocs('');
					//actualizarMedicionesTodos();
					document.querySelector('#formconfirma').parentNode.removeChild(document.querySelector('#formconfirma'));
					document.querySelector('#formcent').parentNode.removeChild(document.querySelector('#formcent'));
					
				}else{
					alert('error al cargar el archivo');
				}
			}
	});

}	

