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



var _opcionarActivo=null;
function opcionarGrupos(_this){		
	if(_this.getAttribute('soloeditores')=='cambia'&&_HabilitadoEdicion!='si'){return;}
	
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
        _anc.setAttribute('class','opcion');
        _anc.setAttribute('href','javascript:void(0)');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('onkeydown','rolarOpcion(this,event);');
        _anc.setAttribute('filtrado','no');
        
        _anc.setAttribute('regid',_idgrupo);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
    
    filtrarOpciones(_this);    
}

function rolarOpcion(_this,_event){
	console.log(_this);
	_this.removeAttribute('foco');
	_a=_this;
	if(_event.keyCode==40||_event.keyCode==38){
		for(_i=0;_i<100;_i++){
			if(_event.keyCode==40){_a=_a.nextSibling;}
			if(_event.keyCode==38){_a=_a.previousSibling;}
			if(_a==null){break;}
			if(_a.getAttribute('class')!='opcion'){continue;}
			if(_a.getAttribute('filtrado')=='no'){break;}
		}	
	}
	
	if(_a==null){_a=_this.parentNode.parentNode.parentNode.querySelector('[tipo="opcionar"]');}
	_a.focus();
	_opcionarActivo=_a;
	_a.setAttribute('foco','enfoco');
	//console.log(_a);
	//console.log(document.activeElement);
}

function filtrarOpciones(_this,_event){
	if(_this.getAttribute('soloeditores')=='cambia'&&_HabilitadoEdicion!='si'){return;}
	
	if(_event!=null){
		console.log(_event.keyCode);
		if(_event.keyCode==40){ //flecha pabajo
			_event.preventDefault();
			_op=_this.parentNode.querySelector('.auxopcionar .contenido a[filtrado="no"]');
			console.log(_op);
			_opcionarActivo=_op;
			_op.focus();
			_op.setAttribute('foco','enfoco');
			return;
		}
	}
	_idi=_this.getAttribute('id');
	_idi=_idi.replace("-n", "");
	_that=_this.parentNode.querySelector('#'+_idi);
	_that.value='n';
	_str=_this.value;
	
	//_str=_str.replace(/\s+/g,"");
	
	_str=_str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_str=_str.replace('/[^A-Za-z0-9\-]/gi', '');
	_str=_str.replace(/ /g, '');
	_str=_str.toLowerCase();
	
	console.log(_str);
	
	if(_str=='-'){_str='';}
	_str=_str.toLowerCase();
	
	_ops=_this.parentNode.querySelectorAll('.auxopcionar .contenido a');
	for(_no in _ops){
		if(typeof _ops[_no] != 'object'){continue;}
		_str2=_ops[_no].innerHTML;		
		_str2=_str2.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		_str2=_str2.replace('/[^A-Za-z0-9\-]/gi', '');
		_str2=_str2.replace(/ /g, '');
		_str2=_str2.toLowerCase();
		
		if(_str2.includes(_str)){
			_ops[_no].setAttribute('filtrado','no');
		}else{
			_ops[_no].setAttribute('filtrado','si');
		}		
	}
}


function opcionarDef(_this){
	if(_this.getAttribute('soloeditores')=='cambia'&&_HabilitadoEdicion!='si'){return;}
	console.log(_this.getAttribute('soloeditores'));
	console.log(_HabilitadoEdicion);
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
        //console.log(_dat);
        //console.log(_regid);
        _anc=document.createElement('a');
        _anc.setAttribute('onclick','cargaOpcion(this);');
        _anc.setAttribute('regid',_regid);
        _anc.innerHTML=_dat.nombre;
        _destino.appendChild(_anc);
    }
}	




function vaciarOpcionares(_event,_this){	
	
	if(_this!=undefined){
		if(_opcionarActivo!=null){
		if(_opcionarActivo.parentNode.parentNode.parentNode!=null){
		if(_this.parentNode==_opcionarActivo.parentNode.parentNode.parentNode){
			//este opcionar está abierto.
			//_opcionarActivo=null;
			return;
		} 
		}
		}
	}

    if(_event!=undefined){    
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
    //console.log(_idcat);
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
    
    _input=document.querySelector('#formCent input#'+_ff);
    _input.value=_idcat;
    
    _opcionarActivo=null;
    vaciarOpcionares();
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


function enviarFormularioDoc(_event){
	

	
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	//_FF=$('#formCent').serialize();
	//console.log(_FF);
	_idreg=document.querySelector('#formCent[tipo="documento"] #cid').value;
	
	
	_form=document.querySelector('#formCent[tipo="documento"]');
	console.log(_form);
	
	_param={
		'numero':_form.querySelector('[name="numero"]').value,
		'iddoc':_form.querySelector('[name="iddoc"]').value,
		'accion':_form.querySelector('[name="accion"]').value,
		'nombre':_form.querySelector('[name="nombre"]').value,
		'descripcion':_form.querySelector('[name="descripcion"]').value,
		'id_p_grupos_id_nombre_tipoa':_form.querySelector('[name="id_p_grupos_id_nombre_tipoa"]').value,
		'id_p_grupos_id_nombre_tipoa-n':_form.querySelector('[name="id_p_grupos_id_nombre_tipoa-n"]').value,
		'id_p_grupos_id_nombre_tipob':_form.querySelector('[name="id_p_grupos_id_nombre_tipob"]').value,
		'id_p_grupos_id_nombre_tipob-n':_form.querySelector('[name="id_p_grupos_id_nombre_tipob-n"]').value,
		'id_p_DOCdef_id_nombre_tipo_escala':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_escala"]').value,
		'id_p_DOCdef_id_nombre_tipo_escala-n':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_escala-n"]').value,
		'id_p_DOCdef_id_nombre_tipo_rubro':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_rubro"]').value,
		'id_p_DOCdef_id_nombre_tipo_rubro-n':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_rubro-n"]').value,
		'id_p_DOCdef_id_nombre_tipo_planta':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_planta"]').value,
		'id_p_DOCdef_id_nombre_tipo_planta-n':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_planta-n"]').value,
		'id_p_DOCdef_id_nombre_tipo_sector':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_sector"]').value,
		'id_p_DOCdef_id_nombre_tipo_sector-n':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_sector-n"]').value,
		'id_p_DOCdef_id_nombre_tipo_tipologia':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_tipologia"]').value,
		'id_p_DOCdef_id_nombre_tipo_tipologia-n':_form.querySelector('[name="id_p_DOCdef_id_nombre_tipo_tipologia-n"]').value
	};
	
		
	
	if(_form.querySelector('[name="id_p_grupos_id_nombre_tipoa"]').value=='n'){
		console.log('se crea grupo a: definiendo orden automatico.');
		_o=0;
		for(_gn in DatosDocs.indiceOrdenadoA){
			_idg=DatosDocs.indiceOrdenadoA[_gn];
			if(DatosDocs.grupos[_idg]['orden']==''){DatosDocs.grupos[_idg]['orden']=0;}
			console.log('orden candidato:'+DatosDocs.grupos[_idg]['orden']);			
			_o=Math.max(parseInt(DatosDocs.grupos[_idg]['orden']),_o);
			console.log('orden acc:'+_o);
		}
		_param['id_p_grupos_id_nombre_tipoa-orden']=_o+1;
		
	}else if(_form.querySelector('[name="id_p_grupos_id_nombre_tipob"]').value=='n'){
		_iga=_form.querySelector('[name="id_p_grupos_id_nombre_tipoa"]').value;
		console.log('se crea grupo b: definiendo orden automatico.');
		console.log('iga:'+_iga);
		_o=0;
		for(_idb in DatosDocs.indice[_iga]){	
			console.log('idb:'+_idb);
			if(DatosDocs.grupos[_idb]==undefined){continue;}
			if(DatosDocs.grupos[_idb]['orden']==''){DatosDocs.grupos[_idb]['orden']=0;}			
			console.log('orden candidato:'+DatosDocs.grupos[_idb]['orden']);
			_o=Math.max(parseInt(DatosDocs.grupos[_idb]['orden']),_o);			
			console.log('orden acc:'+_o);
		}
		_param['id_p_grupos_id_nombre_tipob-orden']=_o+1;
	}

	if(!_event.ctrlKey){
		cerrarForm('documento');
	}else{
		_param['modo']='reciclaform';
	}
	
	$.ajax({
			data:  _param,
			url:   './DOC/DOC_ed_guarda_doc.php',
			type:  'post', 
			error:  function (response) {alert('error al consultar el servidor');},
			success:  function (response) {
				var _res = $.parseJSON(response);
				for(_nm in _res.mg){
					alert(_res.mg[_nm]);
				}
				if(_res.res!='exito'){
					alert('error al consultar la base de datos')
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
					actualizarIndice();
				}
				
				if(_res.data.nuevascategorias=='si'){
					_Estado='actualizandofilas';
					consultarCategorias();
				}
				
				consultarDocs(_res.data.plano.id);		//funcion en el documento raiz
				
				if(_res.data.modo=='reciclaform'){crearDoc(document.querySelector('#creadoc'),_res.data.modo);}
			}
	});

}	
	
	/*
function enviarFormularioMulti(){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	
	$.post('./DOC/DOC_ed_multiver.php', $('#formCent').serialize(),function(response){						  	
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

	//console.log(document.querySelector('#formCent[tipo="documento"]'));
	_iddoc=document.querySelector('#formCent[tipo="documento"] #cid').value;
	
	_aa=document.createElement('a');
	_aa.setAttribute('iddoc',_iddoc);
	_aa.setAttribute('onclick','eliminarDocumento(this);');
	_aa.innerHTML='eliminar';
	_div.appendChild(_aa);
	
	_div.innerHTML+="<br>id: "+ _iddoc;
	_div.innerHTML+="<br>numero: "+ document.querySelector('#formCent #Inumero').value;
	_div.innerHTML+="<br>nombre: "+ document.querySelector('#formCent #Inombre').value;
	
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
					document.querySelector('#formCent').parentNode.removeChild(document.querySelector('#formCent'));
					
				}else{
					alert('error al cargar el archivo');
				}
			}
	});

}	

