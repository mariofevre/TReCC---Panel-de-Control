/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2021 TReCC SA
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


$('head').append('<link rel="stylesheet" type="text/css" href="./COM/COM_form_com.css">');

	tinymce.init({
	  	selector: 'textarea.mceEditable',  // change this value according to your HTML
	  	menubar: false,
	  	width : "616px",
		height : "280px",
	  	plugins: "code table image imagetools lists",
	   	format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat' },
	  	toolbar: "undo redo |   bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table |  styleselect | code ",
	  	forced_root_block: "p",
		remove_trailing_nbsp : true,
		editor_deselector : "mceNoEditor",
		init_instance_callback: function (editor) {
			editor.on('keyup', function (e) {
				_cont=editor.getContent();
				if(_cont!=''){
					document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='inline-block';
					document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='none';
				}else{
					document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='none';
					document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='inline-block';
				}
		      
		    });
		}
		
	});	
	
	function imprimir(){		
		_url="./COM_impresion.php?idcom="+document.querySelector('#form_com input[name="id"]').value;
		 window.location.assign(_url);
	}
	
	function supervisarId1(_event){
		
		
		
		_this=document.querySelector('#form_com input#ident');
		
		console.log(_event.keyCode);
		if ( 
	            _event.keyCode == '9'//presionó tab no es un nombre nuevo
	            ||
	            _event.keyCode == '13'//presionó enter
	            ||
	            _event.keyCode == '32'//presionó espacio
	            ||
	            _event.keyCode == '37'//presionó direccional
	            ||
	            _event.keyCode == '38'//presionó  direccional
	            ||
	            _event.keyCode == '39'//presionó  direccional
	            || 
	            _event.keyCode == '40'//presionó  direccional		  
				|| 
	            _event.keyCode == undefined//presionó accion disparada sin tecleo		  
	            		
	    ){
	        	//tecleo sin cambio
	    }else{
	    	_this.setAttribute('autoid','no');	
	    }
		
		
		_cartel=_this.parentNode.querySelector('#supervisornumero');
		
		_cartel.querySelector('#mensaje').innerHTML='';
		_cartel.querySelector('#coincidenciatotal').innerHTML='';
		_cartel.querySelector('#coincidenciamedia').innerHTML='';
		_cartel.querySelector('#coincidenciabaja').innerHTML='';

		
		_idprop=_this.value;
		_gaprop=document.querySelector('#form_com input#id_p_grupos_id_nombre_tipoa').value;
		_gbprop=document.querySelector('#form_com input#id_p_grupos_id_nombre_tipob').value;
		_idinput=document.querySelector('input[name="id"]').value;
		if(_DatosListadito.comunicaciones==undefined){
			_cartel.querySelector('#mensaje').innerHTML='-Sin datos de control-';
			return;
		}
		
		_matches={};
		_n=0;
		_nt=0;
		  
		for(_nc in _DatosListadito.comunicaciones){
			
			_lcdat=_DatosListadito.comunicaciones[_nc];
			//console.log(_lcdat);
			_id1a=_lcdat.id1.replace(/^0+/, '');
			_id1b=_idprop.replace(/^0+/, '');
			
			if(_id1a==_id1b&&_lcdat.id!=_idinput){
				//console.log(_lcdat);
				_matches[_lcdat.id]={};
				_matches[_lcdat.id]['num']=_id1a;
				_matches[_lcdat.id]['eti']=_lcdat.etiqueta;
				_matches[_lcdat.id]['sen']=_lcdat.sentido;
				_n++;
				
				_puntaje=0;
									
				if(_gaprop==_lcdat.idga){
					_puntaje++;
				}
				
				if(_gbprop==_lcdat.idgb){
					_puntaje++;
				}
				
				if(_lcdat.sentido==document.querySelector('#form_com select[name="sentido"]').value){
					_puntaje++;					
				}
				
				if(document.querySelector('#form_com input[value="'+_lcdat.pre+'"]').checked){
					_puntaje++;
				}
				
				_matches[_lcdat.id]['puntaje']=_puntaje;
				
				if(_puntaje==4){_nt++;}	
			}			
		}
		
		_cartel.querySelector('#mensaje').innerHTML='Se han identificado '+_n+' comunicaciones que utilizan este número';
		_cartel.querySelector('#mensaje').innerHTML+='<br>Coincidencia de sentido: Total: '+_nt;		
		_cartel.setAttribute('consultado','si');
		

		if(_n>0){
			_this.parentNode.appendChild(_cartel);
			
			for(_nn in _matches){				
				_com=document.createElement('a');
				_com.innerHTML=_matches[_nn].eti;
				_com.setAttribute('puntaje',_matches[_nn].puntaje);
				_com.setAttribute('sentido',_matches[_nn].sen);
				_com.setAttribute('class','COMcomunicacion secundaria');
				
				if(_matches[_nn].puntaje<3){
					_div=_cartel.querySelector('#coincidenciabaja');
				}else if(_matches[_nn].puntaje<4){
					_div=_cartel.querySelector('#coincidenciamedia');
				}else{
					_div=_cartel.querySelector('#coincidenciatotal');
				}				
				_div.appendChild(_com);
				
				document.querySelector('#form_com #supervisornumero').style.display='block';
				reiniciarSeconds();
				//setTimeout(cerrarSupervisornumero(),3000);
				
			}
		}else{
			document.querySelector('#form_com #supervisornumero').style.display='none';
			finalizarCuenta();
		}
		
	}
	
	function cerrarSupervisornumero(){
		document.querySelector('#form_com #supervisornumero').style.display='none';
	}

	


function iraCom(_event,_id,_idrespuesta,_tipo){
	
			if(_tipo==undefined){_tipo='existente';}
					
			_modF=document.querySelector('#fnc'+_id);
			if(_modF!=null){
				_altoventana=window.innerHeight;
				$([document.documentElement, document.body]).animate({
			        scrollTop: $("#"+_modF.getAttribute('id')).offset().top - (_altoventana/2)
			    }, 2000);
			    _modF.setAttribute('editada','no');
			    _modF.setAttribute('editada','si');
   			}
   		
			var _idrespuesta;
			if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
			
			document.querySelector('#form_com #supervisornumero').style.display='none';			
			document.querySelector('#form_com').style.display='block';
			
			
			_form=document.querySelector('#form_com');
			
			limpiarFormCom();
			_form.setAttribute('estado','cargando');
			
			
			if(_id==''||_tipo=='duplicada'){
				
				_maxpad={
					'entrante':1,
					'saliente':1
				}
				_preform={
					'entrante':'',
					'saliente':''
				};
				
				_Npos_ini={'entrante':'','saliente':''};
				_Npos_fin={'entrante':'','saliente':''};
				_Ipos_ini={'entrante':'','saliente':''};
				_Ipos_fin={'entrante':'','saliente':''};
				_Upos_ini={'entrante':'','saliente':''};
				_Upos_fin={'entrante':'','saliente':''};
				
				_form.querySelector('#ejec').value='crear';
				
				for(_s in _maxpad){
					if(_s=='entrante'){_scod='entra';}
					if(_s=='saliente'){_scod='sale';}					
					
					if(_Config['com-'+_scod+'-ident-formato']!=''){
					
						_arr=_Config['com-'+_scod+'-ident-formato'].split("");
						_stat='buscafunc';
						_var='';
						for(_c in _arr){	
							if(_stat=='buscafunc'){
								if(_arr[_c]==''){continue;}
									
								if(_arr[_c]=='N'){
									_stat='func_n_declarada';
									continue;
								}else if(_arr[_c]=='U'){
									_stat='func_u_declarada';
									continue;
								}else if(_arr[_c]=='C'){
									_stat='func_c_declarada';
									continue;
								}else if(_arr[_c]=='I'){
									_stat='func_i_declarada';
									continue;
								}else if(_arr[_c]=='Y'){
									_stat='func_y_declarada';
									continue;
								}
																												
							}else if(_stat=='func_n_declarada'){
								if(_arr[_c]==''){continue;}
								
								if(_arr[_c]!='('){
									alert('error, es esperaba ( luego de N');
									break;
								}else{
									_var='';
									_stat='func_n_abierta';
									continue;
								}
							}else if(_stat=='func_n_abierta'){
								
								if(_arr[_c]==')'){
									_pad=parseInt(_var);
									_Npos_ini[_s]=_preform[_s].length;
									_Npos_fin[_s]=_Npos_ini[_s] + _pad;
									for(_i = 0;_i<_pad;_i++){
										_preform[_s]+='0';
									}
									_stat='buscafunc';
									_var='';								
									continue;
								}else{
									_var+=_arr[_c].toString();
									_stat='func_n_abierta';
									continue;
								}
							
							}else if(_stat=='func_u_declarada'){
								if(_arr[_c]==''){continue;}
								
								if(_arr[_c]!='('){
									alert('error, es esperaba ( luego de U');
									break;
								}else{
									_var='';
									_stat='func_u_abierta';
									continue;
								}
							}else if(_stat=='func_u_abierta'){
								
								if(_arr[_c]==')'){
									_pad=parseInt(_var);
									_Upos_ini[_s]=_preform[_s].length;
									_Upos_fin[_s]=_Upos_ini[_s] + _pad;
									for(_i = 0;_i<_pad;_i++){
										_preform[_s]+='0';
									}
									_stat='buscafunc';
									_var='';								
									continue;
								}else{
									_var+=_arr[_c].toString();
									_stat='func_u_abierta';
									continue;
								}
							
							}else if(_stat=='func_y_declarada'){
								if(_arr[_c]==''){continue;}
								
								if(_arr[_c]!='('){
									alert('error, es esepraba ( luego de Y');
									break;
								}else{
									_var='';
									_stat='func_y_abierta';
									continue;
								}
							}else if(_stat=='func_y_abierta'){
								
								if(_arr[_c]==')'){
									_preform[_s]+=_var;
									_stat='buscafunc';
									_var='';								
									continue;
								}else{
									 if(_arr[_c]==2){
									 	
										_var=_Hoy.split('-')[0].toString().substr(2, 2);
									}else{
										_var=_Hoy.split('-')[0].toString();
									}
									_stat='func_y_abierta';
									continue;
								}
							}else if(_stat=='func_i_declarada'){
								if(_arr[_c]==''){continue;}
								
								if(_arr[_c]!='('){
									alert('error, es esepraba ( luego de I');
									break;
								}else{
									_var='';
									_stat='func_i_abierta';
									continue;
								}
							}else if(_stat=='func_i_abierta'){
								
								if(_arr[_c]==')'){
									_pad=parseInt(_var);
									_Ipos_ini[_s]=_preform[_s].length;
									_Ipos_fin[_s]=_Ipos_ini[_s] + _pad;
									for(_i = 0;_i<_pad;_i++){
										_preform[_s]+='0';
									}
									_stat='buscafunc';
									_var='';								
									continue;
								}else{
									_var+=_arr[_c].toString();
									_stat='func_i_abierta';
									continue;
								}
							
							
							}else if(_stat=='func_c_declarada'){
								if(_arr[_c]==''){continue;}
								
								if(_arr[_c]!='('){
									alert('error, es esepraba ( luego de C');
									break;
								}else{
									_var='';
									_stat='func_c_abierta';
									continue;
								}
							}else if(_stat=='func_c_abierta'){
								
								if(_arr[_c]==')'){
									_preform[_s]+=_var;
									_stat='buscafunc';
									_var='';								
									continue;
								}else{
									_var+=_arr[_c].toString();
									_stat='func_c_abierta';
									continue;
								}							
							}		
						}				
					}
				}	
			
				_max={
					'entrante':0,
					'saliente':0
				}
				_maxn={
					'entrante':0,
					'saliente':0
				}
				_maxi={
					'entrante':{},
					'saliente':{},
					'unico':{}
				}
				_maxu=0;
				
				
				for(_nc in _ComunicacionesCargadas){
					
					_d=_ComunicacionesCargadas[_nc];
					_s=_d.sentido;
					if(_preform[_d.sentido]!=''){
						
						//console.log(_Npos_ini[_s]+' : '+_Ipos_fin[_s]);		
						
						if(_Upos_ini[_s]!=='' && _Upos_fin[_s] !== ''){
							if(_d.id1.length<_Upos_fin[_s]){continue;}
							
							_u=_d.id1.substring(_Upos_ini[_s],_Upos_fin[_s]);
							if(isNaN(_u)){continue;}
							_u=parseInt(_u);
							//if(!Number.isInteger(_n)){continue;}
							
							//console.log(_n+' id1:'+_d.id1);
							_maxu=Math.max(_maxu, _u);				
							
						}	
							
						if(_Npos_ini[_s]!=='' && _Npos_fin[_s] !== ''){
							if(_d.id1.length<_Npos_fin[_s]){continue;}
							
							//console.log(_Npos_ini[_s]+','+_Npos_fin[_s]);
							_n=_d.id1.substring(_Npos_ini[_s],_Npos_fin[_s]);
							
							if(isNaN(_n)){continue;}
							_n=parseInt(_n);
							//if(!Number.isInteger(_n)){continue;}
							//console.log(_n+' id1:'+_d.id1);
							_maxn[_d.sentido]=Math.max(_maxn[_d.sentido], _n);
						}
						
						if(_Upos_ini[_s]!=='' && _Upos_fin[_s] !== ''){
							
							if(_maxi.unico[_u]==undefined){_maxi.unico[_u]=1;}
							
							if(_Ipos_ini[_s]!='' && _Ipos_fin[_s] != ''){
								if(_d.id1.length<_Ipos_fin[_s]){continue;}
								_i=_d.id1.substring(_Ipos_ini[_s],_Ipos_fin[_s]);
								if(isNaN(_i)){continue;}
								_i=parseInt(_i);	
								//console.log(_i+' mas '+_maxi[_d.sentido][_n]);					
								_maxi.unico[_u]=Math.max(_maxi.unico[_u], _i);
							}
							
						}else if(_Npos_ini[_s]!=='' && _Npos_fin[_s] !==''){
							
							if(_maxi[_d.sentido][_n]==undefined){_maxi[_d.sentido][_n]=0;}
							
							if(_Ipos_ini[_s]!='' && _Ipos_fin[_s] != ''){
								if(_d.id1.length<_Ipos_fin[_s]){continue;}
								_i=_d.id1.substring(_Ipos_ini[_s],_Ipos_fin[_s]);
								if(isNaN(_i)){continue;}
								_i=parseInt(_i);	
								console.log(_i+' mas '+_maxi[_d.sentido][_n]);					
								_maxi[_d.sentido][_n]=Math.max(_maxi[_d.sentido][_n], _i);
							}							
						}
							
					}else{
					
						_maxpad[_d.sentido]=Math.max(_maxpad[_d.sentido], parseInt(_d.id1.length));
						
						_id1=parseInt(_d.id1);
						if(isNaN(_id1)){
							_id1=0;
						}
						_max[_d.sentido]=Math.max(_max[_d.sentido], parseInt(_id1));
					}
				}
				

				_max['entrante']++;				
				_max['saliente']++;
				
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante',_preform['entrante']);
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente',_preform['saliente']);
				
				_form.querySelector('input[name="ident"]').setAttribute('autoid_entrante',_max['entrante']);
				_form.querySelector('input[name="ident"]').setAttribute('autoid_saliente',_max['saliente']);
				
				_form.querySelector('input[name="ident"]').setAttribute('autoid_n_entrante',_maxn['entrante']);
				_form.querySelector('input[name="ident"]').setAttribute('autoid_n_saliente',_maxn['saliente']);				
				_form.querySelector('input[name="ident"]').setAttribute('autoid_u',_maxu);
				
				_form.querySelector('input[name="ident"]').setAttribute('autoid_i_entrante',_maxi['entrante'][_maxn['entrante']]);
				_form.querySelector('input[name="ident"]').setAttribute('autoid_i_saliente',_maxi['saliente'][_maxn['saliente']]);
				_form.querySelector('input[name="ident"]').setAttribute('autoid_i_unico',_maxi.unico[_maxu]);
				
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_n_i',_Npos_ini.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_n_f',_Npos_fin.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_n_i',_Npos_ini.entrante);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_n_f',_Npos_fin.entrante);
				
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_u_i',_Upos_ini.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_u_f',_Upos_fin.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_u_i',_Upos_ini.entrante);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_u_f',_Upos_fin.entrante);
				
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_i_i',_Ipos_ini.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_saliente_i_f',_Ipos_fin.saliente);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_i_i',_Ipos_ini.entrante);
				_form.querySelector('input[name="ident"]').setAttribute('preform_entrante_i_f',_Ipos_fin.entrante);
								
				
				_form.querySelector('input[name="ident"]').setAttribute('autoid','si');
				_form.querySelector('input[name="ident"]').setAttribute('autoid_entrante_pad',_maxpad['entrante']);
				_form.querySelector('input[name="ident"]').setAttribute('autoid_saliente_pad',_maxpad['saliente']);
				
				
			}else{
				_form.querySelector('#ejec').value='guardar';
				_form.querySelector('input[name="ident"]').setAttribute('autoid','no');
				_form.querySelector('input[name="ident"]').setAttribute('autoid_entrante','no');
				_form.querySelector('input[name="ident"]').setAttribute('autoid_saliente','no');
			}
			
			if(_idrespuesta==''){
				_form.querySelector('#respuesta.dato').style.display='none';
				_form.querySelector('input#respuesta').value='';
			}else{
				_form.querySelector('#respuesta.dato').style.display='block';
				_form.querySelector('input#respuesta').value=_idrespuesta;
				if(_ComunicacionesCargadas[_idrespuesta]!=undefined){
					_form.querySelector('#respuesta.dato span#nombre').innerHTML=_ComunicacionesCargadas[_idrespuesta].nombre;
					_form.querySelector('#respuesta.dato span#fecha').innerHTML=_ComunicacionesCargadas[_idrespuesta].zz_reg_fecha_de_emision;
					
					if(_ComunicacionesCargadas[_idrespuesta].sentido=='entrante'){
						_opt=_form.querySelector('select[name="sentido"] option[value="saliente"]');
						_opt.selected = true;
					}else{
						_opt=_form.querySelector('select[name="sentido"] option[value="entrante"]');
						_opt.selected = true;
				}
				}
			}
			
			
			_params={};			
			$.ajax({
				data:_params,
				url:'COM/COM_consulta_listadito.php',
				type:'post',
				error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
                success:  function (response,status,xhr) {
                	try {
						_res = $.parseJSON(response);
					}
					catch(error) {
					  console.error(error);
					  // expected output: SyntaxError: unterminated string literal
					  // Note - error messages will vary depending on browser
					  console.log(xhr);
					  alert('error al prosesar la respuesta del servidor');
					  return;
					}
					
                    if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
        
					_DatosListadito=_res.data;
				}
			});
			
			
			if(_id==''){
				_params={
					"id":_id,
					"filtro_sentido":_filtro.sentido,
					"filtro_idga":_filtro.grupoa,
					"filtro_idgb":_filtro.grupob
				}
			}else{
				_params={
					"id":_id
				};
			}	
			$.ajax({
				data:_params,
				url:'COM/COM_consulta_fila.php',
				type:'post',
				error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
                success:  function (response,status,xhr) {
                	try {
						_res = $.parseJSON(response);
					}
					catch(error) {
					  console.error(error);
					  // expected output: SyntaxError: unterminated string literal
					  // Note - error messages will vary depending on browser
					  console.log(xhr);
					  alert('error al prosesar la respuesta del servidor');
					  return;
					}
					
                    if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
        			
        			
        			
					
        			
        			_ComunicacionesCargadas[_res.data.comunicacion.id]=_res.data.comunicacion;
        			_Modelos=_res.data.modelos;
					_ComCargada=_res.data.comunicacion;
					//console.log(_res);
					
					_form=document.querySelector('#form_com');
					
					_form.setAttribute('estado','cargado');
					
					_form.querySelector('input[name="id"]').value=_ComCargada.id;
										
					_opt=_form.querySelector('select[name="sentido"] option[value="'+_ComCargada.sentido+'"]');
					_opt.selected = true;
					
					_form.querySelector('select[name="sentido"]').setAttribute('sentido',_ComCargada.sentido);
					
					_inputident=_form.querySelector('input[name="ident"]');
					_inputident.value=_ComCargada.id1;
					
					
					if(_ComCargada.id1==''){
						
							
						if(_inputident.getAttribute('preform_'+_ComCargada.sentido)!=''){
							
							_pre=_inputident.getAttribute('preform_'+_ComCargada.sentido);
							
							if(_inputident.getAttribute('autoid_u')>0){								
								_ante=_pre.substr(0,_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_i'));								
								_v=(parseInt(_inputident.getAttribute('autoid_u'))+1).toString();								
								//console.log(_v);
								_pad=parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_f'))-parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_i'));
								_v=_v.padStart(_pad,'0');								
								_post=_pre.substr(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_f'));								
								_pre=_ante+_v+_post;
								
							}else if(_inputident.getAttribute('autoid_n_'+_ComCargada.sentido)>0){
								_ante=_pre.substr(0,_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_i'));
								//console.log(_v);								
								
								_v=(parseInt(_inputident.getAttribute('autoid_n_'+_ComCargada.sentido))+1).toString();								
								
								_pad=parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_f'))-parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_i'));
								_v=_v.padStart(_pad,'0');								
								_post=_pre.substr(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_f'));								
								_pre=_ante+_v+_post;
								
							}
							
							_inputident.value=_pre;
															
						}else if(_inputident.getAttribute('autoid')=='si'){
							_v=_inputident.getAttribute('autoid_'+_ComCargada.sentido);
							_pad=_inputident.getAttribute('autoid_'+_ComCargada.sentido+'_pad');
							_inputident.value=_v.padStart(_pad,'0');		
						}
					}
					
					_form.querySelector('input[name="identdos"]').value=_ComCargada.id2;
					_form.querySelector('input[name="identtres"]').value=_ComCargada.id3;
					
					_form.querySelector('input[name="nombre"]').value=_ComCargada.nombre;					
					_form.querySelector('input[name="relevante"]').value=_ComCargada.relevante;
					
					if(_ComCargada.relevante=='no'){_form.querySelector('input[for="relevante"]').checked = false;}
					_form.querySelector('input[name="preliminar"][value="'+_ComCargada.preliminar+'"]').checked = true;

					_c=Object.keys(_ComCargada.documentosasociados.presentados).length;
					_span=_form.querySelector('span#docP');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','enevaluacion');
					}else{
						_span.removeAttribute('class');
					}
										
					_form.querySelector('input#ejec').style.display='block';
					
						
					if(_ComCargada.zz_cont_por_con=='1'
						&&
						_ComCargada.zz_contenido_conec_validado_id_p_usu=='0'
					){
						alert('Esta comunicación fue importada automáticametne desde otro panel. Debe ser validada por un usuario habilitado en el panel presente.');						
						if(_ComCargada.sentido=='entrante'){
							_form.querySelector('input#ejec').style.display='none';
						}
						_form.querySelector('input.validar').style.display='block';
					}else{
						_form.querySelector('input.validar').style.display='none';
					}
						
					if(_ComCargada.zz_conec_id_p_comunicacion>0&&_ComCargada.zz_contenido_conec_validado_id_p_usu>0){
						//esta comunicacion ya fue convalidada no puede ser modificada.
						alert('Esta comunicacion ya fue convalidada no puede ser modificada.');
						_form.querySelector('input#ejec').style.display='none';
					}
					
					_c=Object.keys(_ComCargada.documentosasociados.aprobados).length;
					_span=_form.querySelector('span#docA');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','aprobada');
					}else{
						_span.removeAttribute('class');
					}
					
					_c=Object.keys(_ComCargada.documentosasociados.rechazados).length;
					_span=_form.querySelector('span#docR');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','rechazada');
					}else{
						_span.removeAttribute('class');
					}
					
					_form.querySelector('[name="resumen"]').value=_ComCargada.resumen;							
					var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea					
					if(editor!=null){					
						editor.setContent(_ComCargada.descripcion);						
					}else{						
						document.querySelector('#form_com .paquete.texto textarea#descripcion').value=_ComCargada.descripcion;					
					}
					
					document.querySelector('.paquete.texto h3 > #aclaraciones').setAttribute('estado',0);
					document.querySelector('.paquete.texto h3 > #aclaraciones #contenido').innerHTML='';
					document.querySelector('#form_com .paquete.texto form#guardarmodelo').style.display='none';
					document.querySelector('#form_com .paquete.texto a#cargamodelo #listacarga').style.display='none';
					
					if(Object.keys(_Modelos).length>0){
						document.querySelector('#listacarga #modelos').innerHTML='';
					}
					for(_idmod in _Modelos){
						_datamod=_Modelos[_idmod];
						_div=document.createElement('div');
						_div.setAttribute('idmod',_idmod);
		    			_div.setAttribute('onclick','cargarModelo("'+_idmod+'")');
		    			_div.innerHTML=_datamod.nombre;
		    			
		    			_aa=document.createElement('a');
		    			_aa.innerHTML='x';
		    			_aa.setAttribute('onclick','borrarModelo(event,"'+_idmod+'")');
		    			_aa.setAttribute('class','borrarmodelo');
		    			_div.appendChild(_aa);
		    			document.querySelector('#listacarga #modelos').appendChild(_div);
					}
					
					if(_ComCargada.descripcion!=''){
						document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='inline-block';
						document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='none';
					}else{
						document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='none';
						document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='inline-block';
					}
					
					_contf=0;
					console.log(_ComCargada.sentido);
					
					_form.querySelector('.paquete.evolucion #fechas').innerHTML='';
					
					
					if(Object.keys(_ComCargada.estadosOrden[_ComCargada.sentido]).length>0){						
						for(_eo in _ComCargada.estadosOrden[_ComCargada.sentido]){
							_contf++;
							//console.log('fechatipificada:'+_contf);
							//console.log(_ComCargada.estadosOrden[_ComCargada.sentido][_eo]);
							
							if(isNaN(_eo)){continue;}
							_edat=_ComCargada.estados[_ComCargada.estadosOrden[_ComCargada.sentido][_eo]];
						
							_h3=document.createElement('h3');
							_h3.innerHTML="<span class='titulo'>"+_edat.descripcion+"</span>";
							//console.log(_edat);
							_fe=_edat.desde;
							
							
							_in=document.createElement('input');
							_in.setAttribute('type','date');
							_in.setAttribute('onchange','borrFecha(this)');
							_in.setAttribute('name','fecha_'+_edat.id);
							_in.value=_fe;
							_h3.appendChild(_in);
							
							_in=document.createElement('input');
							_in.setAttribute('type','button');
							_in.setAttribute('onclick','hoyFecha(this)');
							_in.value='hoy';
							_h3.appendChild(_in);
							if(_edat.desde==''){_in.style.display='inline-block';}
							
							
							_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
						}	
					}else{
						_contf++;
						_h3=document.createElement('h3');						
						_h3.innerHTML="<span class='titulo'>Emisión</span>";
						//if(_ComCargada.zz_reg_fecha_emision==''){
						_fe=_ComCargada.zz_reg_fecha_emision;
						
												
						_in=document.createElement('input');
						_in.setAttribute('type','date');			
						_in.setAttribute('onchange','borrFecha(this)');		
						_in.setAttribute('name','zz_reg_fecha_emision_d');
						_in.value=_fe;
						_h3.appendChild(_in);
											
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','hoyFecha(this)');
						_in.value='hoy';
						_h3.appendChild(_in);
						if(_ComCargada.zz_reg_fecha_emision==''){_in.style.display='inline-block';}
						
						_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
					}
					
					if(_contf<2){
						_h3=document.createElement('h3');
						_h3.innerHTML="<span class='titulo'>Cierre</span>";
						
						_fe=_ComCargada.cerradodesde;			
						_in=document.createElement('input');
						_in.setAttribute('type','date');			
						_in.setAttribute('onchange','borrFecha(this)');
						_in.setAttribute('name','cerradodesde');
						_in.value=_fe;
						_h3.appendChild(_in);
						
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','hoyFecha(this)');
						_in.value='hoy';
						_h3.appendChild(_in);
						if(_ComCargada.cerradodesde==''){_in.style.display='inline-block';}
						
						_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);	
					}
					
					_cerrT=_form.querySelector('.paquete.evolucion #cerrTogle');
                    _cerrT.querySelector('input[name="cerrado"]').value=_ComCargada.cerrado;
                    if(_ComCargada.cerrado==''){_ComCargada.cerrado='no';}
                    _cerrT.querySelector('img[val="'+_ComCargada.cerrado+'"]').setAttribute('visible','si');
                    _h3.appendChild(_cerrT);
					if(_ComCargada.cerrado=='no'){
						_cerrT.parentNode.querySelector('[type="date"]').setAttribute('estado','cerrado');
					}					
					
					_tareas=_form.querySelector('.paquete.evolucion #tareas');					
					_h3.parentNode.insertBefore(_tareas,_h3);
					
					
					_hoy=_tareas.querySelector('#fechainicio input[value="hoy"]');
					if(_ComCargada.fechainicio==''){
						_hoy.style.display='inline-block';
					}else{
						_hoy.style.display='none';
					}
					_fe=_ComCargada.fechainicio;
					
					_tareas.querySelector('#fechainicio input[name="fechainicio"]').value=_fe;
										
					_hoy=_tareas.querySelector('#fechaobjetivo input[value="hoy"]');
					if(_ComCargada.fechaobjetivo==''){
						_hoy.style.display='inline-block';
					}else{
						_hoy.style.display='none';
					}
					_fe=_ComCargada.fechaobjetivo;
					
					_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo"]').value=_fe;
					
					_ch=_tareas.querySelector('input[for="requerimiento"]');
					if(_ComCargada.requerimiento=='si'){
						_ch.checked=true;
					}else{
						_ch.checked=false;
					}
					alternasinoTareas(_ch);
					
					_ch=_tareas.querySelector('input[for="requerimientoescrito"]');
					if(_ComCargada.requerimiento=='si'){
						_ch.checked=true;
					}else{
						_ch.checked=false;
					}
					alternasinoTareas(_ch);

					if(Object.keys(_ComCargada.adjuntos).length>0){
						for(_na in _ComCargada.adjuntos){
							if(typeof _ComCargada.adjuntos[_na] != 'object'){continue;}							
							_adat=_ComCargada.adjuntos[_na];							
							anadirAdjunto(_adat);							
						}
					}
						
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa"]').value=_ComCargada.id_p_grupos_id_nombre_tipoa;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa_n"]').value=_ComCargada.grupoa;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipob"]').value=_ComCargada.id_p_grupos_id_nombre_tipob;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipob_n"]').value=_ComCargada.grupob;
					
					_parametros={
						'comunicaciones':''
					};
					
					$.ajax({
						url:'./PAN/PAN_grupos_consulta.php',
						type:'post',
						data:_parametros,
						error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
		                success:  function (response,status,xhr) {
		                	try {
								_reg = $.parseJSON(response);
							}
							catch(error) {
							  console.error(error);
							  // expected output: SyntaxError: unterminated string literal
							  // Note - error messages will vary depending on browser
							  console.log(xhr);
							  alert('error al prosesar la respuesta del servidor');
							  return;
							}
							
		                    if(_reg.res!='exito'){alert('error durante la consulta a la base de datos');}
		                    
							console.log(_reg);
							
							_dest0=document.querySelector('#form_com #grupoa');
							for(_gn in _reg.data.gruposOrden.a){
								
								_idg=_reg.data.gruposOrden.a[_gn];
								_aa=document.createElement('a');
								_aa.setAttribute('onclick','cargarOpcion(this)');
								_aa.setAttribute('ondblclick','editarGrupo(this)');
								_aa.setAttribute('idg',_idg);
								_aa.title=_reg.data.grupos[_idg].nombre+'\n'+_reg.data.grupos[_idg].descripcion;
								_aa.innerHTML=_reg.data.grupos[_idg].nombre;
								
								//console.log('es grupo tipo a');
								
								if(_reg.data.gruposUsadosA == undefined){continue;}
								if(_reg.data.gruposUsadosA[_idg] != undefined){
                                    //console.log('es un grupo usado');
                                    if(
                                    	_ComCargada.id_p_grupos_id_nombre_tipob==0
                                        ||
                                        _ComCargada.id_p_grupos_id_nombre_tipob==''
                                    ){
                                        console.log('el b está vacio');
                                        _destI=_dest0.querySelector('.sugerencia.uno');
                                        _destI.appendChild(_aa);	
                                        continue;
                                    }
                                    //console.log('el b es :'+_ComCargada.id_p_grupos_id_nombre_tipob);
                                    
									if(_reg.data.grupos[_ComCargada.id_p_grupos_id_nombre_tipob]['coexistecon'][_idg] != undefined){
										_destI=_dest0.querySelector('.sugerencia.uno');
									}else{
										_destI=_dest0.querySelector('.sugerencia.dos');
									}
								}else{
									_destI=_dest0.querySelector('.sugerencia.tres');
									_dest0.querySelector('#mostrar').style.display='block';	
								}
								
								_destI.appendChild(_aa);					
							}
							
							_dest0=document.querySelector('#form_com #grupob');
							for(_gn in _reg.data.gruposOrden.b){
								
								_idg=_reg.data.gruposOrden.b[_gn];
								
								_aa=document.createElement('a');
								_aa.setAttribute('onclick','cargarOpcion(this)');
								_aa.setAttribute('ondblclick','editarGrupo(this)');
								_aa.setAttribute('idg',_idg);
								_aa.title=_reg.data.grupos[_idg].nombre+'\n'+_reg.data.grupos[_idg].descripcion;
								_aa.innerHTML=_reg.data.grupos[_idg].nombre;
								
								if(_reg.data.gruposUsadosB == undefined){continue;}
								if(_reg.data.gruposUsadosB[_idg] != undefined){
                                    if(_ComCargada.id_p_grupos_id_nombre_tipoa==0){
                                        _destI=_dest0.querySelector('.sugerencia.uno');
                                        _destI.appendChild(_aa);	
                                        continue;
                                    }
                                    
									if(_reg.data.grupos[_ComCargada.id_p_grupos_id_nombre_tipoa]['coexistecon'][_idg] != undefined){
										_destI=_dest0.querySelector('.sugerencia.uno');
									}else{
										_destI=_dest0.querySelector('.sugerencia.dos');
									}
								}else{
									_destI=_dest0.querySelector('.sugerencia.tres');
									_dest0.querySelector('#mostrar').style.display='block';	
								}
								
								_destI.appendChild(_aa);					
							}
														
							_FormE = $('#form_com .escroleable');
                            _handle = $('#dBordeL');
                            _handle.css('height',_FormE.height());
                            _FormE.scrollTop(0);
                            
                            $('input, textarea').on('mouseover',function(){
                                document.querySelector('#form_com').removeAttribute('draggable');
                                _excepturadragform='si';
                            });
                            $('input, textarea').on('mouseout',function(){
                            document.querySelector('#form_com').setAttribute('draggable','true');
                                _excepturadragform='no';
                            });
						}
					})	
					
				}
			})			
		}
		

function editarGrupo(_this){
	_idg=_this.getAttribute('idg');
	_comid=document.querySelector('#form_com input[name="id"]').value;
	_url="./agrega_f.php?accion=cambia&tabla=grupos&id="+_idg+"&tabla=grupos&salida=COM_reporte&salidatabla=comunicaciones&salidaid="+_comid;
	window.location=_url;	
}

function limpiarFormCom(){
	console.log('en desarrollo');
	document.querySelector('#form_com > input[name="id"]').value='';
	document.querySelector('#form_com #grupoa .sugerencia.uno').innerHTML='<a idg="0" onclick="cargarOpcion(this);">-vacio-</a><br>';
	document.querySelector('#form_com #grupoa .sugerencia.dos').innerHTML='';
	document.querySelector('#form_com #grupoa .sugerencia.tres').innerHTML='';
	
	document.querySelector('#form_com #grupob .sugerencia.uno').innerHTML='<a idg="0" onclick="cargarOpcion(this);">-vacio-</a><br>';
	document.querySelector('#form_com #grupob .sugerencia.dos').innerHTML='';
	document.querySelector('#form_com #grupob .sugerencia.tres').innerHTML='';
	
	document.querySelector('#form_com #grupob #mostrar').style.display='none';
	document.querySelector('#form_com #grupob #desmostrar').style.display='none';
	document.querySelector('#form_com #grupoa #mostrar').style.display='none';
	document.querySelector('#form_com #grupoa #desmostrar').style.display='none';
	
	_ct=document.querySelector('#form_com .paquete.evolucion #cerrTogle');
	document.querySelector('#form_com .paquete.evolucion').appendChild(_ct);
	
	_ct=document.querySelector('#form_com .paquete.evolucion #tareas');
	document.querySelector('#form_com .paquete.evolucion').appendChild(_ct);
	
	document.querySelector('#form_com .paquete.evolucion #fechas').innerHTML='';
	
	document.querySelector('#form_com #adjuntos #listadosubiendo').innerHTML='';
	document.querySelector('#form_com #adjuntos #adjuntoslista').innerHTML='';
	
	document.querySelector('#form_com input[for="relevante"]').checked = true;
	document.querySelector('#form_com input[name="relevante"]').value = 'si';
	
	
	document.querySelector('#form_com  input[name="ident"]').value='';
	document.querySelector('#form_com  input[name="identdos"]').value='';
	document.querySelector('#form_com  input[name="identtres"]').value='';
	document.querySelector('#form_com  input[name="nombre"]').value='';
	document.querySelector('#form_com  input[name="id_p_grupos_id_nombre_tipoa_n"]').value='';
	document.querySelector('#form_com  input[name="id_p_grupos_id_nombre_tipob_n"]').value='';
	document.querySelector('#form_com  textarea[name="resumen"]').value='';
	
	_editor = tinymce.get('descripcion'); 
	$('#descripcion').html(_editor.setContent('', {format: 'HTML'}));	
}
	
function cancelarCom(){
	document.querySelector('#form_com').style.display='none';		
	limpiarFormCom();	
}

function validarCom(){
	
	if(document.querySelector('#form_com [name="sentido"]').value=="entrante"){
		_tx="¿Realmente querés convalidar esta comunicación? \n al tratarse de una comunicación entrante, esta acción queda documentada como recepción de la comunicacion.";
	}else{
		_tx="¿Realmente querés convalidar esta comunicación? \n al tratarse de una comunicación saliente, los contenidos sesrá considerados como formulados por su organización.";
		_tx+="\n tal vez prefieras verificar y editar los contenidos. Nadie quiere que pongan palabras en su boca.";
	}
	
	if(confirm(_tx)){
		_id= document.querySelector('#form_com > input[name="id"]').value;
		_params={
			"id":_id
		}
		$.ajax({
			data:_params,
			url:'./COM/COM_ed_valida_com.php',
			type:'post',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	try {
					_res = $.parseJSON(response);
				}
				catch(error) {
				  console.error(error);
				  console.log(xhr);
				  alert('error al prosesar la respuesta del servidor');
				  return;
				}
				
                if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
    
		
				for(_nm in _res.mg){
					alert(_res.mg[_nm]);
				}
				console.log(_res);
				if(_res.res='exito'){
					document.querySelector('#form_com').style.display='none';
					limpiarFormCom();
					actualizarUnaFila(_ComCargada.comid);
					
				}
			}
		});

	}	
}

function duplicarCom(){
	_id= document.querySelector('#form_com > input[name="id"]').value;
	_params={
		"id":_id
	}
	
	$.ajax({
		data:_params,
		url:'./COM/COM_ed_duplica_com.php',
		type:'post',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	try {
				_res = $.parseJSON(response);
			}
			catch(error) {
			  console.error(error);
			  // expected output: SyntaxError: unterminated string literal
			  // Note - error messages will vary depending on browser
			  console.log(xhr);
			  alert('error al prosesar la respuesta del servidor');
			  return;
			}
			
            if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
			for(_nm in _res.mg){
				alert(_res.mg[_nm]);
			}
			//console.log(_res);
			if(_res.res='exito'){
				_idcom=_res.data.nid;
				document.querySelector('#form_com').style.display='none';
				limpiarFormCom();
				cargarUnaFila(_idcom);
				iraCom(event,_idcom,'','duplicada');
			}
		}
	});
	
}

function eliminarCom(){
	if(confirm("¿Realmente querés eliminar esta comunicación?")){
		_id= document.querySelector('#form_com > input[name="id"]').value;
		_params={
			"id":_id
		}
		$.ajax({
			data:_params,
			url:'./COM/COM_ed_borra_com.php',
			type:'post',
			error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
            success:  function (response,status,xhr) {
            	try {
					_res = $.parseJSON(response);
				}
				catch(error) {
				  console.error(error);
				  // expected output: SyntaxError: unterminated string literal
				  // Note - error messages will vary depending on browser
				  console.log(xhr);
				  alert('error al prosesar la respuesta del servidor');
				  return;
				}
				
                if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
    
		
				for(_nm in _res.mg){
					alert(_res.mg[_nm]);
				}
				console.log(_res);
				if(_res.res='exito'){
					quitarFila(_res.data.id);
					document.querySelector('#form_com').style.display='none';
					limpiarFormCom();
				}
			}
		});	
	}	
}

function aCero(_sub){
	_sub.style.right='0';
	_sub.style.bottom='0';
}
	
			
function guardarCom(_this,_modo){
	_form=document.querySelector('#form_com');
	
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
		console.log(_sr);console.log(_sh);		
		setTimeout(aCero, 1, _subs[_sn]);
	}
	
	
	_param={
		"sentido":_form.querySelector('.identificacion [name="sentido"]').value,
		"modo":_modo
	};
	
	if(_form.querySelector('input[name="preliminar"][value="extraoficial"]').checked){
		_param.preliminar="extraoficial";
	}else{
		_param.preliminar="oficial";
	}
			
	_innn=document.querySelectorAll('#form_com input, #form_com select');
	
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
			console.log('le falta name al siguietne:');
			console.log(_innn[_nin]);
			continue;
		}
		
		_name=_innn[_nin].getAttribute('name');
		_param[_name]=_innn[_nin].value;
	}
	
	
	_param.resumen=_form.querySelector('[name="resumen"]').value;
	//accion para absorber código basura generado por editores de texto al copiar pegar
	var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea
	_con=$('#' + 'descripcion').html( editor.getContent({format: 'html'}));
	_contcrudo = _con['0'].textContent;		
	_result=Array();			
	_regex=/<!-- \[if([^]+)<!\[endif]-->/g;
	if(new RegExp(_regex).test(_contcrudo)){
		_result = _contcrudo.match(_regex).map(function(val){
	   		return  val;
		});
	}			
	for(_nc in _result){
		console.log('_nc:'+_nc);
		_contcrudo=_contcrudo.replace(_result[_nc],'');
	}
	_contcrudo=_contcrudo.replace('<p>&nbsp;</p>','');
	//console.log(_contcrudo);
	$('#descripcion').html(editor.setContent(_contcrudo, {format: 'HTML'}));	
	_param.descripcion=_contcrudo;

	var _comid=_param.id;
	
	if(_this.value=='guardar'){
		var _modo='actualiza';
	}else{
		var _modo='nuevo';
	}
	
	$.ajax({
		data:_param,
		type:'post',
		url:'./COM/COM_ed_guarda_com.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	try {
				_res = $.parseJSON(response);
			}
			catch(error) {
			  console.error(error);
			  // expected output: SyntaxError: unterminated string literal
			  // Note - error messages will vary depending on browser
			  console.log(xhr);
			  alert('error al prosesar la respuesta del servidor');
			  return;
			}
			for(_nm in _res.mg){
				alert(_res.mg[_nm]);
			}
            if(_res.res!='exito'){alert('error durante la consulta a la base de datos');return;}

			if(_res.res='exito'){
				//procesarRespuestaDescripcion(response, _destino);
				if(_res.data.modo=='aimpresion'){
					imprimir();
					return;
				}
				if(_res.data.modo=='aduplicar'){
					duplicarCom();
					return;
				}
				document.querySelector('#form_com').style.display='none';
				limpiarFormCom();
				//alert(_modo);
				if(_modo=='actualiza'){
					console.log('actualizando fila de:'+_comid);				
					actualizarUnaFila(_comid);
				}else{
					cargarUnaFila(_comid);
				}
				
			}else{
				alert('error, consulte al administrador');
				console.log(_res);
			}
		}
	})				
	console.log(_param);
}


function guardarModelo(_event){
	_event.stopPropagation();
	_event.preventDefault();
	
	_editor = tinymce.get('descripcion');
	_form= document.querySelector('form#guardarmodelo');
	_parametros={
		'nombre':_form.querySelector('[name="mod_nombre"]').value,
		'aclaraciones':_form.querySelector('[name="mod_aclaraciones"]').value,
		'descripcion': _editor.getContent(),
		'panid':_PanId
	}
	
	if(_parametros.nombre==''){alert('Error, nombre vacío');return;}
	if(_parametros.descripcion==''){alert('Error al leer el contenido modelo');return;}
	
	
	$.ajax({
		data:_parametros,
		type:'post',
		url:'./COM/COM_ed_guarda_modelo.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	
        	try {_res = $.parseJSON(response);}
			catch(error) {
			  console.error(error);console.log(xhr);alert('error al prosesar la respuesta del servidor');
			  return;
			}
			
			for(_nm in _res.mg){alert(_res.mg[_nm]);}
			
            if(_res.res!='exito'){alert('error durante la consulta a la base de datos');return;}    

			_div=document.createElement('div');
			_div.setAttribute('onclick','cargarModelo("'+_res.data.modelo.nid+'")');
			_div.innerHTML=_res.data.modelo.nombre;
			document.querySelector('#listacarga #modelos').appendChild(_div);
			document.querySelector('form#guardarmodelo').style.display='none';
			
			alert('El modelo '+_res.data.modelo.nombre+' fue guardado. \n Se encontrará disponible para su carga al editar una comunicaicón sin decripción extendida.');
		}
	})	
}

function cargarModelo(_idmod){
	
	_parametros={
		'idmod':_idmod,
		'panid':_PanId
	}

	$.ajax({
		data:_parametros,
		type:'post',
		url:'./COM/COM_consulta_modelo.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	
        	try {_res = $.parseJSON(response);}
			catch(error) {
			  console.error(error);console.log(xhr);alert('error al prosesar la respuesta del servidor');
			  return;
			}
			
			for(_nm in _res.mg){alert(_res.mg[_nm]);}
			
            if(_res.res!='exito'){alert('error durante la consulta a la base de datos');return;}

			_editor = tinymce.get('descripcion');
			_editor.setContent(_res.data.modelo.descripcion);
			
			document.querySelector('.paquete.texto h3 > #aclaraciones #contenido').innerHTML='';
			if(_res.data.modelo.aclaraciones!=''){
				document.querySelector('.paquete.texto h3 > #aclaraciones').setAttribute('estado',-1);
				document.querySelector('.paquete.texto h3 > #aclaraciones #contenido').innerHTML=_res.data.modelo.aclaraciones;
			}
			document.querySelector('.paquete.texto h3 #cargamodelo').style.display='none';
			document.querySelector('.paquete.texto h3 #guardamodelo').style.display='inline-block';
		}
	})	
}


function borrarModelo(_event,_idmod){
	_event.stopPropagation();
	if(!confirm('¿Borramos este modelo de comunicación?... ¿Segure?'));	
	_parametros={
		'idmod':_idmod,
		'panid':_PanId
	}
	
	$.ajax({
		data:_parametros,
		type:'post',
		url:'./COM/COM_ed_borra_modelo.php',
		error: function (requestObject, error, errorThrown) {alert('error al contactar al servidor');console.log(requestObject)},
        success:  function (response,status,xhr) {
        	
        	try {_res = $.parseJSON(response);}
			catch(error) {
			  console.error(error);console.log(xhr);alert('error al prosesar la respuesta del servidor');
			  return;
			}
			
			for(_nm in _res.mg){alert(_res.mg[_nm]);}
			
            if(_res.res!='exito'){alert('error durante la consulta a la base de datos');return;}

			_boton=document.querySelector('.paquete.texto h3 #cargamodelo #listacarga #modelos [idmod="'+_res.data.modelo.id+'"]');
			_boton.parentNode.removeChild(_boton);
		}
	})	
}



function cargarOpcion(_this){
	_idg=_this.getAttribute('idg');
	_tx=_this.innerHTML;
	if(_idg==0){
		_idg='';
		_tx='';
	}
	_this.parentNode.parentNode.querySelector('input[type="hidden"]').value=_idg;
	_this.parentNode.parentNode.querySelector('input[type="text"]').value=_tx;
	supervisarId1('');
}

function cambioSentido(_this){
	
	_this.setAttribute('sentido',_this.value);
	
	
	
	_paquete = _form.querySelector('.paquete.evolucion');	
	_tareas=_form.querySelector('.paquete.evolucion #tareas');
	_paquete.appendChild(_tareas);

	_cerrT=_form.querySelector('.paquete.evolucion #cerrTogle');
	_paquete.appendChild(_cerrT);
	
	_form.querySelector('.paquete.evolucion #fechas').innerHTML='';
		
	_contf=0;
	_ComCargada.sentido=document.querySelector('#form_com select[name="sentido"] option:checked').value;	
	
	_ident=document.querySelector('#form_com [name="ident"]');
	_autoid=_ident.getAttribute('autoid');
	/*
	if(_autoid=='si'){
		_v=_ident.getAttribute('autoid_'+_ComCargada.sentido);
		_pad=_ident.getAttribute('autoid_'+_ComCargada.sentido+'_pad');		
		_ident.value=_v.padStart(_pad,'0');
	}
	*/

	
	if(_ComCargada.id1==''){						
		
		if(_inputident.getAttribute('preform_'+_ComCargada.sentido)!=''){
			
			_pre=_inputident.getAttribute('preform_'+_ComCargada.sentido);
			
			if(_inputident.getAttribute('autoid_u')>0){								
				_ante=_pre.substr(0,_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_i'));								
				_v=(parseInt(_inputident.getAttribute('autoid_u'))+1).toString();								
				//console.log(_v);
				_pad=parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_f'))-parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_i'));
				_v=_v.padStart(_pad,'0');								
				_post=_pre.substr(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_u_f'));								
				_pre=_ante+_v+_post;
				
			}else if(_inputident.getAttribute('autoid_n_'+_ComCargada.sentido)>0){
				
				_ante=_pre.substr(0,_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_i'));
				
				//console.log(_ante);
												
				_v=(parseInt(_inputident.getAttribute('autoid_n_'+_ComCargada.sentido))+1).toString();								
				
				_pad=parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_f'))-parseInt(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_i'));
				_v=_v.padStart(_pad,'0');								
				_post=_pre.substr(_inputident.getAttribute('preform_'+_ComCargada.sentido+'_n_f'));								
				_pre=_ante+_v+_post;
				
			}
			
			_inputident.value=_pre;
											
		}else if(_inputident.getAttribute('autoid')=='si'){
			_v=_inputident.getAttribute('autoid_'+_ComCargada.sentido);
			_pad=_inputident.getAttribute('autoid_'+_ComCargada.sentido+'_pad');
			_inputident.value=_v.padStart(_pad,'0');		
		}
	}
	

	if(Object.keys(_ComCargada.estadosOrden[_ComCargada.sentido]).length>0){						
		for(_eo in _ComCargada.estadosOrden[_ComCargada.sentido]){
			_contf++;
			console.log(_ComCargada.estadosOrden[_ComCargada.sentido][_eo]);
			
			if(isNaN(_eo)){continue;}
			_edat=_ComCargada.estados[_ComCargada.estadosOrden[_ComCargada.sentido][_eo]];
		
			_h3=document.createElement('h3');
			_h3.innerHTML="<span class='titulo'>"+_edat.descripcion+"</span>";
			
			_fe=_edat.desde;
			
			_in=document.createElement('input');
			_in.setAttribute('type','date');
			_in.setAttribute('onchange','borrFecha()');
			_in.setAttribute('name','fecha_'+_edat.id);
			_in.value=_fe;
			_h3.appendChild(_in);
			
			_in=document.createElement('input');
			_in.setAttribute('type','button');
			_in.setAttribute('onclick','hoyFecha(this)');
			_in.value='hoy';
			_h3.appendChild(_in);
			if(_edat.desde==''){_in.style.display='inline-block';}
				
			_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
		}	
	}else{
		_contf++;
		_h3=document.createElement('h3');						
		_h3.innerHTML="<span class='titulo'>Emisión</span>";
		
		
		_fe=_ComCargada.zz_reg_fecha_emision;
		
		
		_in=document.createElement('input');
		_in.setAttribute('type','date');				
		_in.setAttribute('onchange','borrFecha()');
		_in.setAttribute('name','zz_reg_fecha_emision');
		_in.value=_fe;
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','hoyFecha(this)');
		_in.value='hoy';
		_h3.appendChild(_in);
		if(_ComCargada.zz_reg_fecha_emision==''){_in.style.display='inline-block';}
		
		
		_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
	}
	if(_contf<2){
		_h3=document.createElement('h3');
		_h3.innerHTML="<span class='titulo'>Cierre</span>";
		
		
		_fe=_ComCargada.cerradodesde;
		
		
		_in=document.createElement('input');
		_in.setAttribute('type','date');		
		_in.setAttribute('onchange','borrFecha()');				
		_in.setAttribute('name','cerradodesde');
		_in.value=_fe;
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','hoyFecha(this)');
		_in.value='hoy';
		_h3.appendChild(_in);
		if(_ComCargada.cerradodesde==''){_in.style.display='inline-block';}
		
		
		_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);	
		
	}
	
	_cerrT=_form.querySelector('.paquete.evolucion #cerrTogle');
    _cerrT.querySelector('input[name="cerrado"]').value=_ComCargada.cerrado;
    
    if(_ComCargada.cerrado==''){_ComCargada.cerrado='no';}
	    _cerrT.querySelector('img[val="'+_ComCargada.cerrado+'"]').setAttribute('visible','si');
	    _h3.appendChild(_cerrT);					
		
		_tareas=_form.querySelector('.paquete.evolucion #tareas');					
		_h3.parentNode.insertBefore(_tareas,_h3);
		
		_hoy=_tareas.querySelector('#fechainicio input[value="hoy"]');
	if(_ComCargada.fechainicio==''){
		_hoy.style.display='inline-block';
	}else{
		
		_hoy.style.display='none';
	}
	_fe=_ComCargada.fechainicio;

	_tareas.querySelector('#fechainicio input[name="fechainicio"]').value=_fe;
						
	_hoy=_tareas.querySelector('#fechaobjetivo input[value="hoy"]');
	if(_ComCargada.fechaobjetivo==''){
		_hoy.style.display='inline-block';
	}else{
		
		_hoy.style.display='none';
	}
	_fe=_ComCargada.fechaobjetivo;
	
	_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo"]').value=_fe;
	
	_ch=_tareas.querySelector('input[for="requerimiento"]');
	if(_ComCargada.requerimiento=='si'){
		_ch.checked=true;
	}else{
		_ch.checked=false;
	}
	alternasinoTareas(_ch);
	
	
	_ch=_tareas.querySelector('input[for="requerimientoescrito"]');
	if(_ComCargada.requerimiento=='si'){
		_ch.checked=true;
	}else{
		_ch.checked=false;
	}
	alternasinoTareas(_ch);
		
	
}

function borrFecha(_this){	
	if(_this.value==''){
		_this.parentNode.querySelector('input[value="hoy"]').style.display="inline-block";
		_this.removeAttribute('style');
	}
}

function hoyFecha(_this){
	_inp=_this.parentNode.querySelector('input[type="date"]');
	_n=_inp.getAttribute('name');
	_inp.value=_Hoy;
	_this.removeAttribute('style');

}
function actualizarGrupos(_event,_this){
	//console.log(_event.keyCode);
  	if ( 
  		_event.keyCode == '9'//presionó tab no es un nombre nuevo
  		||
  		_event.keyCode == '13'//presionó enter
  		||
  		_event.keyCode == '32'//presionó espacio
  		||
  		_event.keyCode == '37'//presionó direccional
  		||
  		_event.keyCode == '38'//presionó  direccional
  		||
  		_event.keyCode == '39'//presionó  direccional
  		|| 
  		_event.keyCode == '40'//presionó  direccional
  		
  	){
   		return;
  	}
	_campo=_this.getAttribute('name').substr(0,27);
	console.log(_campo);
	//_valor = _this.value;
	document.getElementById(_campo).value = 'n';
	
}
function eliminarAdjunto(_this){
	_this.parentNode.setAttribute('eliminar','si');
	_this.style.display='none';
	_this.parentNode.querySelector('#eliminar').value='si';
	_this.parentNode.querySelector('.recuperar').style.display='inline-block';
}

function desEliminarAdjunto(_this){
	_this.parentNode.removeAttribute('eliminar');
	_this.style.display='none';
	_this.parentNode.querySelector('#eliminar').value='si';
	_this.parentNode.querySelector('.eliminar').style.display='inline-block';
}



function togleCerr(_this){
	_img=_this.querySelector('img[visible="si"]');
	_list=_this.querySelectorAll('img');
	_cont=0;
	_ind=Array();
	for(_ni in _list){
		if(typeof _list[_ni] !='object'){continue;}
		_cont++;
		_ind[_cont]=_ni;
		//console.log(_ind);
		//console.log(_list);
		
		if(_list[_ni].getAttribute('visible')=='si'){
			_list[_ni].setAttribute('visible','no');
			//console.log(_cont);
			if(_cont=='3'){
				_list[_ind[1]].setAttribute('visible','si');
				_val=_list[_ind[1]].getAttribute('val');
				break;
			}else{
				_nni=parseInt(_ni)+1
				//console.log(_ni+' -> '+_nni);
				_list[_nni].setAttribute('visible','si');
				_val=_list[_nni].getAttribute('val');
				break;
			}
		}
	
	}
	if(_val=='no'){
		_estado='cerrado';
	}else{
		_estado='abierto';
	}
	
	_inps=_this.parentNode.querySelectorAll('input[type="date"]');
	for(_ninps in _inps){
		if(typeof _inps[_ninps] != 'object'){continue;}
		_inps[_ninps].setAttribute('estado',_estado);
	}
	_this.querySelector('input[name="cerrado"]').value=_val;		
}


function include(arr, obj) {
    for(var i=0; i<arr['n'].length; i++) {
        if (arr['n'][i] == ob){ return arr['id'][i];}
        else {return 'n';}
    }
}

function includes(_arr, obj) {
    return 'n';
}

function alterna(_id, _estado){
	if(_estado==false){
		document.getElementById(_id).value='1';
	}else if(_estado==true){
		document.getElementById(_id).value='0';
	}
}

function alternasino(_this){
	_for= _this.getAttribute('for');
	if(_this.checked==false){
		document.getElementById(_for).value='no';
	}else if(_this.checked==true){
		document.getElementById(_for).value='si';
	}
}

function alternasinoTareas(_this){

	_for= _this.getAttribute('for');
	if(_this.checked==false){
		document.getElementById(_for).value='no';		
	}else if(_this.checked==true){
		document.getElementById(_for).value='si';
	}
	displayInputsTareas();
}

function displayInputsTareas(){

	_req=document.querySelector('.paquete.evolucion input#requerimiento').value;
	_esc=document.querySelector('.paquete.evolucion input#requerimientoescrito').value;
	//console.log(_req+'_'+_esc);
	if(_req=='si'){
		document.querySelector('.paquete.evolucion div.cuarto').style.display='inline-block';
		document.querySelector('.paquete.evolucion div.medio').style.display='inline-block';
		if(_esc=='si'){
			document.querySelector('.paquete.evolucion div.medio #fechainicio').style.display='none';
		}else{
			document.querySelector('.paquete.evolucion div.medio #fechainicio').style.display='inline-block';
		}
	}else{
		document.querySelector('.paquete.evolucion div.medio').style.display='none';
		document.querySelector('.paquete.evolucion div.cuarto').style.display='none';		
	}	
}




function cargarCmp(_this){
		
		var files = _this.files;
		if(document.querySelector('#form_com > input[name="id"]').value<1){
			alert('error al enviar archivos');
			return;
		}				
		for (i = 0; i < files.length; i++) {
	    	_nFile++;
	    	console.log(files[i]);
			var parametros = new FormData();
			_idcom=document.querySelector('#form_com > input[name="id"]').value;
			parametros.append('upload',files[i]);
			parametros.append('nfile',_nFile);
			parametros.append('idcom',_idcom);
			
			var _nombre=files[i].name;
			_upF=document.createElement('p');
			_upF.setAttribute('nf',_nFile);
			_upF.setAttribute('class',"archivo");
			_upF.setAttribute('idcom',_idcom);
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
			xhr[_nn].open('POST', './COM/COM_ed_guarda_adjunto.php', true);
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
						anadirAdjunto(_res.data);
						
					}else{
                   		_file=document.querySelector('p.archivo[nf="'+_res.data.nf+'"]');								
	                    _file.parentNode.removeChild(_file);
					}
				}else{
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
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
	
	///funciones para guardar archivos

	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #contenedorlienzo').style.backgroundColor='lightblue';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #contenedorlienzo').removeAttribute('style');
	}
	
	function drag_start(_event,_this) {
        if(_excepturadragform=='si'){
            return;
        }
        //_event.stopPropagation();
        
        if(isResizing){console.log('resizing');return;}
        
        var crt = _this.cloneNode(true);
        crt.style.display = "none";
        _event.dataTransfer.setDragImage(crt, 0, 0);
        
        var style = window.getComputedStyle(_event.target, null);
         console.log(style.getPropertyValue("left"));
         console.log(parseInt(style.getPropertyValue("left"),10) - _event.clientX);
        _event.dataTransfer.setData(
            "text/plain",        
            (parseInt(style.getPropertyValue("left"),10) - _event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - _event.clientY)
        );
        
	} 
	
	function drag_over(event) {
	    event.preventDefault();
	    
	    var offset = event.dataTransfer.getData("text/plain").split(',');
	    var dm = document.getElementById('form_com');
	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    
	    return false; 
	} 
	
	function drop(event) { 
        if(event.target.getAttribute('id')=='uploadinput'){
            console.log('depositado en el cargador de archivos');
            return;
        }
        //console.log(event.target.getAttribute('id'));
        event.preventDefault();    
	    var offset = event.dataTransfer.getData("text/plain").split(',');
	    var dm = document.getElementById('form_com');
	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    
	    return false;
	}
	 
	var dm = document.getElementById('form_com'); 
	document.body.addEventListener('dragover',drag_over,false); 
	document.body.addEventListener('drop',drop,false); 
	


    $(function () {
        var 
         _Form = $('#form_com'),
         _FormE = $('#form_com .escroleable'),
         _handle = $('#dBordeL');
            
        
        _handle.on('mousedown', function (e) {
            e.stopPropagation();
            isResizing = true;
            lastDownX = e.clientX;
            _anchoinicial=_Form.width();
            _equisInicial=_Form.offset().left;
        });
    
        
        $(document).on('mousemove', function (e) {
            e.stopPropagation();
            // we don't want to do anything if we aren't resizing.
            if (!isResizing) 
                return;
                      
           console.log('anchoinicial:'+_anchoinicial);
           console.log('ultimox:'+lastDownX);
           console.log('ahora x:'+e.clientX);
           var offsetWidth = _anchoinicial - (e.clientX - lastDownX);
           console.log('offset:'+offsetWidth);
            
            var offsetLeft = _equisInicial + (e.clientX - lastDownX);
            
           // _form.css('right', offsetRight);
            _Form.css('left', offsetLeft);
            _Form.css('width', offsetWidth);
            _handle.css('height',_FormE.height());
          // _Form.style.width=offsetWidth;
        }).on('mouseup', function (e) {
            // stop resizing
            isResizing = false;
        });

        
    });
    
    
    	var _seconds = 7;
		
		function incrementSeconds() {
		    _seconds -= 1;
		    if(_seconds<0){
		    	finalizarCuenta();
		    }
		    document.getElementById('cuentaregresiva').innerHTML = _seconds;
		    
		}
		
		var cancel = setInterval(incrementSeconds, 1000);
		
		
		function reiniciarSeconds(){	
			clearInterval(cancel);					
			_seconds=7;
			document.querySelector('#form_com #supervisornumero').setAttribute('consultado','si');
			document.getElementById('cuentaregresiva').innerHTML = _seconds;
			cancel = setInterval(incrementSeconds, 1000);						
		}
		
		function pararCuenta(){
			clearInterval(cancel);
			document.querySelector('#form_com #supervisornumero').style.display='block';
			document.querySelector('#form_com #supervisornumero').setAttribute('consultado','fijo');
			seconds=7;			
			document.getElementById('cuentaregresiva').innerHTML = _seconds;									
		}                  	
		 
		function finalizarCuenta(){
			clearInterval(cancel);
			document.querySelector('#form_com #supervisornumero').setAttribute('consultado','no');
			document.querySelector('#form_com #supervisornumero').style.display='none';						
			seconds=7;			
			document.getElementById('cuentaregresiva').innerHTML = _seconds;									
		}        
	
