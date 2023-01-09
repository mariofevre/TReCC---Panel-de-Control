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


//funciones generales de funcionamiento de la pagina

   


function hexToRgb(hex){
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
     
tinymce.init({
  	selector: 'textarea.mceEditable',  // change this value according to your HTML
  	menubar: false,
  	width : "615px",
	height : "280px",
  	plugins: "code table lists",
   	format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat' },
  	toolbar: "undo redo |   bold italic |alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table |  styleselect | code ",
  	forced_root_block: "p",
	remove_trailing_nbsp : true,
	extended_valid_elements: 'span[title|tipo|idind|plan|idpla|style]',
	editor_deselector : "mceNoEditor",
	content_css: "./PLA/css/PLA_ref_pla.css",
	browser_spellcheck: true
	
});





function modoA(_nuevomodo){
	if(_nuevomodo==_Modo){return;}
	_Modo=_nuevomodo;
	document.querySelector('#page').setAttribute('modo',_nuevomodo);
	document.querySelector('body').setAttribute('modo',_nuevomodo);	
	cargarPlan('','','');
}

function actualizarMuestraPlan(){
	
	for(_n1 in _DataPlan.PLA.PLAn1.componentes){
		_n1id = _DataPlan.PLA.PLAn1.componentes[_n1].id;
		_n1d = _DataPlan.PN1[_n1id];
		
		if(_DataPlan.actualizar_nivel=='PLAn1' && _DataPlan.actualizar_id == _n1id){
			_ref=_DataPlan.PLA.PLAn1.componentes[_n1-1];
			if(_ref==undefined){_refid=null;}else{_refid=_ref.id;}
			_padreNivel='page';
			_padreId='';
			_data=_n1d;
		}
		
		for(_n2 in _DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes){						
			_n2id = _DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].id;
			_n2d = _DataPlan.PN2[_n2id];
			
			if(_DataPlan.actualizar_nivel=='PLAn2' && _DataPlan.actualizar_id == _n2id){
				_ref=_DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2-1];
				if(_ref==undefined){_refid=null;}else{_refid=_ref.id;}
				_padreNivel='PLAn1';
				_padreId=_n1id;
				_data=_n2d;
			}			
						
			for(_n3 in _DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes){
				
				_n3id = _DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes[_n3].id;
				_n3d = _DataPlan.PN3[_n3id];
				
				if(_DataPlan.actualizar_nivel=='PLAn3' && _DataPlan.actualizar_id == _n3id){
					_ref=_DataPlan.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes[_n3-1];
					if(_ref==undefined){_refid=null;}else{_refid=_ref.id;}
					_padreNivel='PLAn2';
					_padreId=_n2id;
					_data=_n3d;
				}

			}  	
		}  	
	}  
	
	if(_DataPlan.actualizar_modo == 'actualizar'){
		_div = document.querySelector('div#page div[nivel="'+_DataPlan.actualizar_nivel+'"][iddb="'+_DataPlan.actualizar_id+'"]');
		_padre=_div.parentNode;
		
		_enc = document.querySelector('div#page div[nivel="'+_DataPlan.actualizar_nivel+'"][iddb="'+_DataPlan.actualizar_id+'"] > div.encabezado');
		_cont = generarEncabezado(_data,_DataPlan.actualizar_nivel);					
		_enc.innerHTML=_cont.innerHTML;
		
	}else if(_DataPlan.actualizar_modo == 'insertar'){
		_div = crearDivComp(_data,_DataPlan.actualizar_nivel);
		
		_enc = generarEncabezado(_data,_DataPlan.actualizar_nivel);
		_div.appendChild(_enc);
		
		_Cont2=document.createElement('div');
		_Cont2.setAttribute('class','contenidos');
		_div.appendChild(_Cont2);	
		
		if(_DataPlan.actualizar_nivel=='PLAn1'){_nivelhijos='PLAn2';}
		if(_DataPlan.actualizar_nivel=='PLAn2'){_nivelhijos='PLAn3';}
		if(_DataPlan.actualizar_nivel=='PLAn3'){_nivelhijos='';}
		if(_nivelhijos!=''){
			_divAn=crearDivAnadir(_nivelhijos);
			console.log(_Cont2.childNodes.length);
			if(_Cont2.childNodes.length==0){
				_divAn.setAttribute('primero','si');
			}
			_Cont2.appendChild(_divAn);	
			

		}
								
		_padre=document.querySelector('div[nivel="'+_padreNivel+'"][iddb="'+_padreId+'"] > .contenidos');
	}
	
	if(_ref==undefined){
		_padre.insertBefore(_div, _padre.firstChild);
	}else{
		_refObj=document.querySelector('div#page div[nivel="'+_DataPlan.actualizar_nivel+'"][iddb="'+_refid+'"]');
		_padre.insertBefore(_div, _refObj.nextSibling);
	}
	
	_rgb=hexToRgb(_data.CO_color);					
	if(_DataPlan.actualizar_nivel=='PLAn1'){_alpha=1;}
	if(_DataPlan.actualizar_nivel=='PLAn2'){_alpha=0.4;}
	if(_DataPlan.actualizar_nivel=='PLAn3'){_alpha=0.4;}
	_div.style.backgroundColor='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';		
				
			
	_altoventana=window.innerHeight;		            
	$([document.documentElement, document.body]).animate({
		scrollTop: $("div[iddb='"+_DataPlan.actualizar_id+"'][nivel='"+_DataPlan.actualizar_nivel+"']").offset().top - (_altoventana/2)
	}, 2000);
	_div.setAttribute('editada','no');
	//_div.setAttribute('editada','si');
	
	representarLinksPla('muestra');
	representarLinksInd('muestra');
	
	setTimeout(function(){_div.setAttribute('editada','si'); }, 50);      	
}


function borrarPlan(_id,_nivel){						
    
    if(document.querySelector(".contenidos [nivel='"+_nivel+"'][iddb='"+_id+"']")!=null){
		_el=document.querySelector(".contenidos [nivel='"+_nivel+"'][iddb='"+_id+"']");
		_el.parentNode.removeChild(_el);
	}else{
		console.log('no se encontró:'+".contenidos [nivel='"+_nivel+"'][iddb='"+_id+"']");
	}
    
}


function representarLinksPla(_modo){
	
	if(_modo=='editor'){
		_if = document.querySelector("iframe#descripcion_ifr");
		_query  = 'span[plan="PN1"]';
		_query += ', span[plan="PN2"]';
		_query += ', span[plan="PN3"]';
		_spans = _if.contentWindow.document.querySelectorAll(_query);			
	}else{
		_query  = '#contenidos .encabezado > .decripcion span[plan="PN1"]';
		_query += ', #contenidos .encabezado > .decripcion span[plan="PN2"]';
		_query += ', #contenidos .encabezado > .decripcion span[plan="PN3"]';
		_spans  = document.querySelectorAll(_query);
	}
	
	
	for(_ns in _spans){
		if(typeof _spans[_ns] != 'object'){continue;}
		_id=_spans[_ns].getAttribute('idpla');
		_nivel=_spans[_ns].getAttribute('plan');	
		_nivelN=parseInt(_nivel.substr(2,3));
		_dat=_DataPlan[_nivel][_id];
		_n=_nivelN;
		
		_spans[_ns].innerHTML='';
		
		
		if(_modo!='editor'){
			_spans[_ns].setAttribute('onclick','event.stopPropagation();escrolearA("'+_n+'","'+_id+'")');
		}
		_datn=Array();
		
		if(_n==3){
			_datn[3]=_dat;
			_idnivel2=_dat.id_p_PLAn2;
			_n=2;
			_dat=_DataPlan['PN'+_n][_idnivel2];
		}
		
		if(_n==2){
			_datn[2]=_dat;
			_idnivel1=_dat.id_p_PLAn1;
			_n=1;
			_dat=_DataPlan['PN'+_n][_idnivel1];
		}
		
		if(_n==1){
			_datn[1]=_dat;
		}
		
		_dest=_spans[_ns];
		
		
		_sp=Array();
		_strnum='';
		_strtit='';
		for(_ni in _datn){
			
			_sp[_ni]=document.createElement('span');
			_sp[_ni].setAttribute('nivel',_ni);
			
			_rgb=hexToRgb(_datn[_ni].CO_color);
			if(_ni=='1'){_alpha=1;}
			if(_ni=='2'){_alpha=0.4;}
			if(_ni=='3'){_alpha=0.4;}
			
			_sp[_ni].style.backgroundColor='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';
			_dest.appendChild(_sp[_ni]);
			_dest=_sp[_ni];
			_strnum+=_datn[_ni].numero+'-';
			
			if(_ni=='1'){_indent='o ';}
			if(_ni=='2'){_indent=' - ';}
			if(_ni=='3'){_indent='  · ';}
			
			_strtit+=_indent+_datn[_ni].nombre+'\n';
			//_ultnombre=_datn[_ni].nombre;			
		}
		_strnum=_strnum.substr(0,(_strnum.length-1));
		
		_dest.innerHTML=_strnum;
		_dest.title=_strtit;				
		
	}
}



function representarLinksInd(_modo){
	
	if(_modo=='editor'){
		_if = document.querySelector("iframe#descripcion_ifr");
		_query  = 'span[tipo="IND"]';
		_spans = _if.contentWindow.document.querySelectorAll(_query);			
	}else{
		_query  = '#contenidos .encabezado > .decripcion span[tipo="IND"]';
		_spans  = document.querySelectorAll(_query);
	}
	
	
	for(_ns in _spans){
		if(typeof _spans[_ns] != 'object'){continue;}
		_id=_spans[_ns].getAttribute('idind');
		_dat=_DatosIndicadores.indicadores[_id];
		
		_spans[_ns].innerHTML='';
		
		
		if(_modo!='editor'){
			_spans[_ns].setAttribute('onclick','event.stopPropagation();event.preventDefault();');
		}
		_datn=Array();
			
		
		_sp=Array();
		_strnum='';
		_strtit='';
		
		_spans[_ns].innerHTML=_dat.n_id_local+' | '+_dat.indicador;
		_spans[_ns].title='('+_id+')'+' | '+_dat.descripcion;				
		
	}
}






function analizarCategoriasEstandar(_res){
	//identifica plazo de obra
    if(
    	_DatosCategorias.estandar[1].usadoennivel!=null
    	&&
    	_DatosCategorias.estandar[2].usadoennivel!=null
    	){	
    		_min=9999;
    		_max=-9999;
    		
    		if(_DatosCategorias.estandar[1].usadoennivel['PLAn1']!=undefined){
    			_idcat_ini=_DatosCategorias.estandar[1].usadoennivel['PLAn1'];
        		for(_idp in _res.data.PN1){
        			if(_res.data.PN1[_idp].categorias[_idcat_ini]!=undefined){
						_min=Math.min(_min,_res.data.PN1[_idp].categorias[_idcat_ini]);	            				
        			}
        		}	
    		}
    		
    		if(_DatosCategorias.estandar[2].usadoennivel['PLAn1']!=undefined){
    			_idcat_fin=_DatosCategorias.estandar[2].usadoennivel['PLAn1'];
        		for(_idp in _res.data.PN1){
        			if(_res.data.PN1[_idp].categorias[_idcat_fin]!=undefined){
						_max=Math.max(_max,_res.data.PN1[_idp].categorias[_idcat_fin]);	            				
        			}
        		}	
    		}
    	
    		if(_DatosCategorias.estandar[1].usadoennivel['PLAn2']!=undefined){
    			_idcat_ini=_DatosCategorias.estandar[1].usadoennivel['PLAn2'];
        		for(_idp in _res.data.PN2){
        			if(_res.data.PN2[_idp].categorias[_idcat_ini]!=undefined){
						_min=Math.min(_min,_res.data.PN2[_idp].categorias[_idcat_ini]);	            				
        			}
        		}	
    		}
    		
    		if(_DatosCategorias.estandar[2].usadoennivel['PLAn2']!=undefined){
    			_idcat_fin=_DatosCategorias.estandar[2].usadoennivel['PLAn2'];
        		for(_idp in _res.data.PN2){
        			if(_res.data.PN2[_idp].categorias[_idcat_fin]!=undefined){
						_max=Math.max(_max,_res.data.PN2[_idp].categorias[_idcat_fin]);	            				
        			}
        		}	
    		}
    		
    		if(_DatosCategorias.estandar[1].usadoennivel['PLAn3']!=undefined){
    			_idcat_ini=_DatosCategorias.estandar[1].usadoennivel['PLAn3'];
        		for(_idp in _res.data.PN3){
        			if(_res.data.PN3[_idp].categorias[_idcat_ini]!=undefined){
						_min=Math.min(_min,_res.data.PN3[_idp].categorias[_idcat_ini]);	            				
        			}
        		}	
    		}
    		
    		if(_DatosCategorias.estandar[2].usadoennivel['PLAn3']!=undefined){
    			_idcat_fin=_DatosCategorias.estandar[2].usadoennivel['PLAn3'];
        		for(_idp in _res.data.PN3){
        			if(_res.data.PN3[_idp].categorias[_idcat_fin]!=undefined){
						_max=Math.max(_max,_res.data.PN3[_idp].categorias[_idcat_fin]);	            				
        			}
        		}	
    		}
    		
    		if(_min<9999){
    			_VariablesEstandar['_mes_min']=_min;
    		}
    		if(_max>-9999){
    			_VariablesEstandar['_mes_max']=_max;
    		}
    }
}

function generarPlan(_data){	
	
	_Actores=_data.Actores;
	_CAT =_data.CAT;
	
	_cont=document.querySelector('#page > .contenidos');
	_cont.innerHTML='';
						
	for(_n1 in _data.PLA.PLAn1.componentes){
		_n1id = _data.PLA.PLAn1.componentes[_n1].id;
		//console.log(_n1);
		//console.log(_n1id);
		_n1d = _data.PN1[_n1id];
		
		_div = crearDivComp(_n1d,'PLAn1');		
		
		document.querySelector('#page > .contenidos').appendChild(_div);
		
		_divE=generarEncabezado(_n1d,'PLAn1');
		_div.appendChild(_divE);
		
		_Cont=document.createElement('div');
		_Cont.setAttribute('class','contenidos');
		_div.appendChild(_Cont);	
		
			for(_n2 in _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes){
				_n2id = _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].id;
				_n2d = _data.PN2[_n2id];
				
				_div = crearDivComp(_n2d,'PLAn2');		
				
				_Cont.appendChild(_div);
				
				_divE=generarEncabezado(_n2d,'PLAn2');
				_div.appendChild(_divE);
				
				_Cont2=document.createElement('div');
				_Cont2.setAttribute('class','contenidos');
				_div.appendChild(_Cont2);	
				
					for(_n3 in _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes){
						_n3id = _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes[_n3].id;
						_n3d = _data.PN3[_n3id];
						
						_div = crearDivComp(_n3d,'PLAn3');
						_Cont2.appendChild(_div);
						
						_divE=generarEncabezado(_n3d,'PLAn3');
						_div.appendChild(_divE);	
					}  	
					
					_divAn=crearDivAnadir('PLAn3');
					console.log(_Cont2.childNodes.length);
					if(_Cont2.childNodes.length==0){
						_divAn.setAttribute('primero','si');
					}		
					_Cont2.appendChild(_divAn);	
					

				
			}  				
			_divAn=crearDivAnadir('PLAn2');
			console.log(_Cont.childNodes.length);
			if(_Cont.childNodes.length==0){
				_divAn.setAttribute('primero','si');
			}
			_Cont.appendChild(_divAn);	
			
	}   
	
	_divAn=crearDivAnadir('PLAn1');
	console.log(document.querySelector('#page > .contenidos').childNodes.length);
	if(document.querySelector('#page > .contenidos').childNodes.length==0){
		_divAn.setAttribute('primero','si');
	}
	document.querySelector('#page > .contenidos').appendChild(_divAn);	
				 
}	


 
function crearDivAnadir(_nivel){
	
	_divAN=document.createElement('div');
	_divAN.setAttribute('class',_nivel+' anade');
	_divAN.setAttribute('nivel',_nivel);
	
	_div2=document.createElement('div');
	_div2.setAttribute('class','encabezado');
	_div2.setAttribute('onclick','iraPlan("",this.parentNode.getAttribute("nivel"),this.parentNode.parentNode.parentNode.getAttribute("iddb"))');
	_divAN.appendChild(_div2);
	
	_aaa=document.createElement('a');
	_aaa.innerHTML=_NomN[_nivel]+"<br><img src='./img/agregar.png'>";
	_div2.appendChild(_aaa);
		
	return _divAN; 
	
}

 
function crearDivComp(_data,_nivel){
	
	_div=document.createElement('div');
	_div.setAttribute('iddb',_data.id);
	_div.setAttribute('class',_nivel);
	_div.setAttribute('nivel',_nivel);
	//console.log('d');
	//console.log(_data);
	//console.log(_data.CO_color);
	_rgb=hexToRgb(_data.CO_color);
	
	if(_nivel=='PLAn1'){_alpha=1;}
	if(_nivel=='PLAn2'){_alpha=0.4;}
	if(_nivel=='PLAn3'){_alpha=0.4;}
	_div.style.backgroundColor='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';
		
	return _div
}


function generarEncabezado(_data,_nivel){
	//console.log(_data);
	_divE=document.createElement('div');
	_divE.setAttribute('class','encabezado');
	_divE.setAttribute('onclick','muestraPlan(this.parentNode.getAttribute("iddb"),this.parentNode.getAttribute("nivel"),"")');
	
	
	_id_p_PLAn2 = '';
	_id_p_PLAn3 = '';
	if(_nivel=='PLAn3'){
		_id_p_PLAn3 = _data.id;
		_id_p_PLAn2 = _data.id_p_PLAn2;
		_id_p_PLAn1 = _DataPlan.PN2[_data.id_p_PLAn2].id_p_PLAn1;
		
	}else if(_nivel=='PLAn2'){
		_id_p_PLAn2 = _data.id;
		_id_p_PLAn1 = _data.id_p_PLAn1;
	}else{
		_id_p_PLAn1 = _data.id;
	}
	
	_divE.setAttribute('onclick','crearficha("'+_id_p_PLAn1+'","'+_id_p_PLAn2+'","'+_id_p_PLAn3+'","'+_nivel+'","autonoma")');	
	
	_divN=document.createElement('div');
	_divN.setAttribute('class','numero');
	_divN.setAttribute('id','PN'+_nivel.substr(-1)+'_'+_data.id);
	
	_divE.appendChild(_divN);
	
	/*_divA=document.createElement('div');
			_divA.setAttribute('class','aux num');
			_divA.title="identificador único para el nivel 2 de planificación";
			_divA.innerHTML="n2 "+_n2;
			_divN.appendChild(_divA);*/
	
	_divN.innerHTML+=_NomN[_nivel];
	_divN.innerHTML+=' <span class="val">'+_data.numero+'</span>';
				
	_divN=document.createElement('div');
	_divN.setAttribute('class','nombre');
	_divN.innerHTML=_data.nombre;
	_divE.appendChild(_divN);

	_divN=document.createElement('div');
	_divN.setAttribute('class','decripcion');
	_divN.innerHTML="<div class='subtitulo'>Descripción:</div>"+_data.descripcion;
	_divE.appendChild(_divN);	
	
	_divN=document.createElement('div');
	_divN.setAttribute('class','subtitulo');
	_divN.innerHTML="Responsables:";
	_divE.appendChild(_divN);	

	
	if(_data.id_p_GRAactores!=''){
		
		if(_Actores[_data.id_p_GRAactores]!=undefined){
			_divE.innerHTML+=_Actores[_data.id_p_GRAactores].nombre+ " "+_Actores[_data.id_p_GRAactores].apellido;		
		}
	}			
	
	_divN=document.createElement('div');
	_divN.setAttribute('class','estado');
	_divE.appendChild(_divN);	
	
	
	_divS=document.createElement('div');
	_divS.setAttribute('class','subtitulo');
	_divS.innerHTML="Estados:";
	_divN.appendChild(_divS);	
	
	
	_nl=document.createElement('ul');
	_nl.setAttribute('class','listaestados');
	_divN.appendChild(_nl);		
	
	for(_Ke in _data.estados){
		_Ve = _data.estados[_Ke];
		_li=document.createElement('li');
		_li.innerHTML="<span class='estnombre'>"+_Ve.nombre+"</span><span class='desde'>desde:</span>"+_Ve.desde;
		_nl.appendChild(_li);		
	}
	
	
	for(_nc in _CAT[_nivel]){
		_vc = _CAT[_nivel][_nc];
		
		
		_divS=document.createElement('div');
		_divS.setAttribute('class','categoria');
		_divS.innerHTML="<label>"+_vc.nombre+"</label>";
		_divE.appendChild(_divS);
		
		_valor='';
		if(_data.categorias[_nc]!=undefined){
			_valor=_data.categorias[_nc];
		}
		
		
		_e=_valor.split('---');
		if(_e.length>1){
				_valor='<ul>';
				for(_en in _e){
						_valor+='<li>'+_e[_en]+'</li>';					
				}
				_valor+='</ul>';
		}
		
		_divS.innerHTML += "<span class='categoriavalor'>"+_valor+"</span>";
		
	}
	
	
	for(_nc in _CAT['x']){
		_vc = _CAT['x'][_nc];
				
		_divS=document.createElement('div');
		_divS.setAttribute('class','categoria');
		_divS.innerHTML="<label>"+_vc.nombre+"</label>";
		_divE.appendChild(_divS);
		
		_valor='';
		if(_data.categorias[_nc]!=undefined){
			_valor=_data.categorias[_nc];
		}
		_divS.innerHTML += "<span class='categoriavalor'>"+_valor+"</span>";	
	}
	
	
	
	_divN=document.createElement('div');
	_divN.setAttribute('class','documentos');
	_divE.appendChild(_divN);	
	
	if(Object.keys(_data.documentos).length>0){
		for(_na in _data.documentos){
			if(typeof _data.documentos[_na] != 'object'){continue;}							
			_adat=_data.documentos[_na];							
			
			if(_adat.mostrar=='si'){
				_aaa=document.createElement('a');
				_aaa.setAttribute('download',_adat.FI_nombreorig);
				_aaa.setAttribute('onclick','event.stopPropagation()');
				_aaa.setAttribute('href',_adat.FI_documento);
				_aaa.innerHTML='<img src="'+_adat.FI_documento+'"><div>'+_adat.FI_nombreorig+'</div>';
				_aaa.title=_adat.descripcion;
				_divN.appendChild(_aaa);	
				
			}else{
				_aaa=document.createElement('a');
				_aaa.setAttribute('download',_adat.FI_nombreorig);
				_aaa.setAttribute('onclick','event.stopPropagation()');
				_aaa.setAttribute('href',_adat.FI_documento);
				_aaa.innerHTML='<img src="./img/hayarchivo.png"><div>'+_adat.FI_nombreorig+'</div>';
				_aaa.title=_adat.descripcion;
				_divN.appendChild(_aaa);							
			}						
		}
	}

	return _divE;

}	
