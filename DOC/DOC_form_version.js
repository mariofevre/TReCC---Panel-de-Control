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

function elegirCom(_this,_tipo){
		if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
		_aes=document.querySelectorAll('#formCent[tipo="version"] a.elige');
		
		for(_nn in _aes){//deselecciona otros botones 'elegir'
			if(typeof _aes[_nn].style=='object'){
				_aes[_nn].style.color='';
			}
		}
		
		_this.style.color='#999';//selecciona botón 'elegir'
		
				
		_aes=document.querySelectorAll('#formCent[tipo="version"] span.muestra');
		for(_nn in _aes){
			if(typeof _aes[_nn].style=='object'){//deselecciona otros spn de muestra
				_aes[_nn].style.backgroundColor='';
			}
		}		
		_this.nextSibling.style.backgroundColor='#fff';//deselecciona actual span de muestra
		
		
		if(document.querySelector('#op_comunicaciones')!=null){
			document.querySelector('#op_comunicaciones').style.display='inline-block';
			_divs=document.querySelectorAll('#op_comunicaciones #sentido div a,	#op_comunicaciones #sentido div h4,	#op_comunicaciones #contrasentido div a,#op_comunicaciones #contrasentido div h4');
		}else{
			alert('error');
			return;
		}
		
		
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
				
				_form=document.querySelector('#formCent[tipo="version"]');
				_grupoA=JSON.parse(DatosDocs.docs[_IdDoc].id_p_grupos_id_nombre_tipoa);
				_grupoB=JSON.parse(DatosDocs.docs[_IdDoc].id_p_grupos_id_nombre_tipob);

				function agregaOp(_dat,_sent,_div){
					
					_spt=_dat.zz_reg_fecha_emision.split("-");
					_ano=_spt[0];
					_mes=_spt[1];
					
					console.log("#op_comunicaciones #"+_sent+" #"+_div+", #op_comunicacionesCambia #"+_sent+" #"+_div);
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
	

function elegirComMulti(_this,_tipo){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_aes=document.querySelectorAll('#formCent[tipo="version"] a.elige');
	
	for(_nn in _aes){//deselecciona otros botones 'elegir'
		if(typeof _aes[_nn].style=='object'){
			_aes[_nn].style.color='';
		}
	}
	
	_this.style.color='#999';//selecciona botón 'elegir'
	
			
	_aes=document.querySelectorAll('#formCent[tipo="version"] span.muestra');
	for(_nn in _aes){
		if(typeof _aes[_nn].style=='object'){//deselecciona otros spn de muestra
			_aes[_nn].style.backgroundColor='';
		}
	}		
	_this.nextSibling.style.backgroundColor='#fff';//deselecciona actual span de muestra
	
	
	if(document.querySelector('#op_comunicacionesCambia')!=null){
		_divs=document.querySelectorAll('#op_comunicacionesCambia #sentido div a,	#op_comunicacionesCambia #sentido div h4,	#op_comunicacionesCambia #contrasentido div a, #op_comunicacionesCambia #contrasentido div h4');
		_modo='multiversion'
	}else{
		alert('error');
		return;
	}
	
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
			DatosComs=_res.data.ordenado;	
			
			_form=document.querySelector('#formCent[tipo="multiversion"]');
			
			function agregaOp(_dat,_sent,_div){
				
				_spt=_dat.zz_reg_fecha_emision.split("-");
				_ano=_spt[0];
				_mes=_spt[1];
				
								console.log("#op_comunicacionesCambia #"+_sent+" #"+_div+", #op_comunicacionesCambia #"+_sent+" #"+_div);
				_Ddiv=_form.querySelector(  "#op_comunicacionesCambia #"+_sent+" #"+_div+", #op_comunicacionesCambia #"+_sent+" #"+_div);
				
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
			
			if(_tipo=="presenta"||_tipo=="anula"){
				for(_nn in _res.data.comunicacionesOrden){
					_idcom=_res.data.comunicacionesOrden[_nn];
					_va=_res.data.comunicaciones[_idcom];

                    if(_va.sentido!='entrante'){continue;}
                    	
					if(_va.idga==0||_Ga[_va.idga]!=undefined||_Ga[0]=='si'){
						
						if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
							//1seleccion
							agregaOp(_va,'sentido','sel1');
						}else{
							//2seleccion
							agregaOp(_va,'sentido','sel2');
						}
					}else if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
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
                    	
					if(_va.idga==0||_Ga[_va.idga]!=undefined||_Ga[0]=='si'){
						if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
							//1seleccion
							agregaOp(_va,'contrasentido','sel1');
						}else{
							//2seleccion
							agregaOp(_va,'contrasentido','sel2');
						}
					}else if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
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
					
					if(_va.idga==0||_Ga[_va.idga]!=undefined||_Ga[0]=='si'){
						if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
							//1seleccion
							agregaOp(_va,'sentido','sel1');
						}else{
							//2seleccion
							agregaOp(_va,'sentido','sel2');
						}
					}else if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
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
					
					if(_va.idga==0||_Ga[_va.idga]!=undefined||_Ga[0]=='si'){
						if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
							//1seleccion
							agregaOp(_va,'contrasentido','sel1');
						}else{
							//2seleccion
							agregaOp(_va,'contrasentido','sel2');
						}
					}else if(_va.idgb==0||_Gb[_va.idgb]!=undefined||_Gb[0]=='si'){
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
	InputComActivo.parentNode.querySelector('input[tipo="valor"]').value=_selecId;
	
	InputComActivo.parentNode.querySelector('.vacia').style.display='inline-block';
}

function verCom(_this){
	if(_this.parentNode.querySelector('input').value>0){
		
		_url="./COM_gestion.php?id="+_this.parentNode.querySelector('input').value;
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
			
			_e=_dat.zz_reg_fecha_emision.split('-');
			
			_span.innerHTML+=' : '+_e[2]+'/'+ _e[1]+'/'+ _e[0];
				

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

function aCero(_sub){
	_sub.style.right='0';
	_sub.style.bottom='0';
}


function enviarFormularioVer(_accion){
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	
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
	
	
	
	_FF=$('#formCent[tipo="version"]').serialize();
	//console.log(_FF);
	//alert('o')
	//alert(_accion);
	
	$.post(
		'./DOC/DOC_ed_guarda_ver.php', 
		$('#formCent[tipo="version"]').serialize()+'&panid='+_PanelI+'&accion='+_accion,
		function(response){						  	
	        var _res = $.parseJSON(response);       
	        //alert(typeof _res);
	        if(_res.res=='err'){alert('ocurrió un error');}
	        for(_nm in _res.mg){alert(_res.mg[_nm]);}
			//consultarEstructura();
			console.log('cerrando formulario versión');	
			cerrarForm('version');
			
			
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
	
	_parametros=$('#formCent[tipo="multiversion"]').serialize()+'&panid='+_PanelI
	
	$.post('./DOC/DOC_ed_multiver.php', _parametros ,function(response){						  	
        var _res = $.parseJSON(response);               
        if(_res.res=='err'){alert('ocurrió un error');}
        
        for(_nm in _res.mg){alert(_res.mg[_nm]);}
		//consultarEstructura();	
		
		cerrarForm();
		//document.getElementById("contenidoextenso").innerHTML='';
		for(_nr in _res.data.idsdoc){
			_iddoc=_res.data.idsdoc[_nr]
			consultarDocs(_iddoc);	
		}
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
	if(_HabilitadoEdicion!='si'){alert('su usuario no tiene permisos de edicion');return;}
	var files = _this.files;		
	_idreg=document.querySelector('#formCent[tipo="version"] input#cid').value;
	
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
        _upF.setAttribute('idver',_idreg);
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
        
        
    	_upF.innerHTML+="<span id='nom'>"+_nombre+"</span>";
    	_upF.title=_nombre;
        document.querySelector('#formCent[tipo="version"] #listadosubiendo').appendChild(_upF);
        
        
        _nn=_nFile;
        xhr[_nn] = new XMLHttpRequest();
        xhr[_nn].idver=_idreg;
        xhr[_nn].open('POST', './DOC/DOC_ed_guarda_adjunto.php', true);
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
            	if(document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]')!=null){
                	_file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');								
                    document.querySelector('#listadosubido').appendChild(_file);
                    _file.removeChild(_file.querySelector('.cargando'));
                    _file.removeChild(_file.querySelector('#barra'));
                    _file.setAttribute('subiendo','no');
               	}else{
               		_file=document.querySelector('a.archivo[nf="'+_res.data.nf+'"]');								
                    _file.parentNode.removeChild(_file);
               	}
                _dataarchivo={
                	"id":_res.data.nid,
                	"FI_nombreorig":_file.innerHTML,
                	"FI_documento":_res.data.ruta
                }   
                _file.parentNode.removeChild(_file);
                muestraArchivoForm(_dataarchivo);
                	
            }else{
                _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
                _file.innerHTML+=' ERROR';
                _file.style.color='red';
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
	
	_idver=document.querySelector('#formCent[tipo="version"] input#cid').value;
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
	
	_cid=document.querySelector('#formCent[tipo="version"] input#cid').value;
	_iddoc=document.querySelector('#formCent[tipo="version"] input#Iid_p_DOCdocumento_id').value;
	
	_div.setAttribute('class','alerta');
	_div.innerHTML="<h1>eliminar version<h1>";
	_div.innerHTML+="<br>id: "+ _cid;
	_div.innerHTML+="<br><A onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>cancelar</a>";
	_div.innerHTML+="<br><A idver='"+_cid+"' iddoc='"+_iddoc+"' onclick='eliminarVersion(this);'>eliminar</a>";
	
}

function actualizarMuestraEstadoForm(){
	
	if(_form.querySelector('#Iid_p_comunicaciones_id_ident_anulada').value>0){
		_estado='anulada';
	}else if(_form.querySelector('#Iid_p_comunicaciones_id_ident_rechazada').value>0){
		_estado='rechazada';
	}else if(_form.querySelector('#Iid_p_comunicaciones_id_ident_aprobada').value>0){
		_estado='aprobada';
	}else if(_form.querySelector('#Iid_p_comunicaciones_id_ident_entrante').value>0){
		_estado='enevaluacion';
	}else{
		_estado='apresentar';
	}
	_form.querySelector('h2 .version').setAttribute('class','version '+_estado);	
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
