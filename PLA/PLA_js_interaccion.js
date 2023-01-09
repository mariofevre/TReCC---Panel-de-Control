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


function tecleoGeneral(_event){
	
	
	if(_event.keyCode=='27'){
		_event.preventDefault();
		
		cancelarPlan(document.querySelector('#form_pla input[value="cancelar"]'));
		//cerrarFormPublicacionesWeb();
		//cerrarFormAnularConec();
		//cerrarFormAcepConec();
		//cerrarFormConfig();
		//cerrarFormPan();
	}
	
	
}

function tecleoEstado(_event,_this){
	_tx=_this.value;
	_f=_this.parentNode.querySelector('[name="desde"]');
	if(_tx.length>0){
		if(_f.value==''){
			_f.value=_Hoy;
		}
	}else{
		_f.value='';
	}	
		
}


function agregarN1(_this){
	_this.nextSibling.style.display='block';
}	
function cancelarN1(_this){
	_this.parentNode.style.display='none';
}	
function cancelarPlanGral(_this){
	_this.parentNode.parentNode.setAttribute('estado','inactivo');
}	


function ampliaCierraTextoplan(){
	_plan=document.querySelector("#plan");
	_plan.setAttribute("ampliado",(-1*parseInt(_plan.getAttribute('ampliado'))));
}


	function crearFormularioCambiaActor(_this){
		_modelo=document.getElementById("modeloresponsable");
		_clon=_modelo.cloneNode(true);
		
		_tabla=_this.parentNode.parentNode.getAttribute('tadb');		
		_clon.childNodes[0].value=_tabla;
		_iddb=_this.parentNode.parentNode.getAttribute('iddb');		
		_clon.childNodes[2].value=_iddb;
		_clon.setAttribute("id","candidato");
		
		_dest=_this.parentNode;
		//_dest.apendchild(_clon);
		_dest.insertBefore(_clon,_this);	
		
		_this.innerHTML='cambiar responsable';
		_this.style.setAttribute('estado','inactivo');
	}	




function formularPlanCargado(){
	
	_form=document.querySelector('#form_pla');
	_form.querySelector('input[name="id"]').value=_PlaCargada.id;
	_form.querySelector('input[name="nombre"]').value=_PlaCargada.nombre;					
	_form.querySelector('input[name="numero"]').value=_PlaCargada.numero;
	
	_form.setAttribute('nivel',_PlaCargada.nivel);
	_form.querySelector('input[name="nivel"]').value=_PlaCargada.nivel;
	
	_form.querySelector('input[name="CO_color"]').value=_PlaCargada.CO_color;
	
	_form.querySelector('input[name="id_p_GRAactores_n"]').value='';//vaciamos antes de cargar
	_form.querySelector('input[name="id_p_GRAactores"]').value=_PlaCargada.id_p_GRAactores;
	
	_form.querySelector('#nuevoestado input[name="estado"]').value='';
	_form.querySelector('#nuevoestado input[name="desde"]').value='';
	
	
	
	_ch=_form.querySelector('input[for="zz_publico"]');
	
	if(_PlaCargada.zz_publico=='0'){
		_ch.checked = false;
	}else{
		_ch.checked = true;
	}
	alterna01(_ch);
	
	
	_div=_form.querySelector('#atributoslista');
	_div.innerHTML='';
	for(_idcat in _DatosCategorias.depanel){
		
		_dat=_DatosCategorias.depanel[_idcat];
		if(_dat.nivel!=_PlaCargada.nivel){continue;}
		
		_div2=document.createElement('div');
		_div2.setAttribute('idcat',_idcat);
		_div.appendChild(_div2);
		
		_borra=document.createElement('a');
		_borra.innerHTML='[-]';
		_borra.setAttribute('onclick','borrarCategoria(this.parentNode.getAttribute("idcat"))');
		_div2.appendChild(_borra);
		
		
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
	
	
	var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea
	editor.setContent(_PlaCargada.descripcion);	
		
	representarLinksPla('editor');
	representarLinksInd('editor');

	for(_en in _PlaCargada.estados){
		if(typeof _PlaCargada.estados[_en] != 'object'){continue;}
		
		_ddd=document.createElement('div');
		_ddd.setAttribute('class','estado');
		_ddd.setAttribute('ide',_PlaCargada.estados[_en].id);
		_ddd.innerHTML='<a class="elim" onclick="borraEstado(this)">X</a><div class="nombre">'+_PlaCargada.estados[_en].nombre+'</div> desde: <div class="desde">'+_PlaCargada.estados[_en].desde+'</div>';
		_form.querySelector('#listaestados').appendChild(_ddd);
	}
	
	
	if(Object.keys(_PlaCargada.documentos).length>0){
		for(_na in _PlaCargada.documentos){
			if(typeof _PlaCargada.documentos[_na] != 'object'){continue;}							
			_adat=_PlaCargada.documentos[_na];							
			_h3 = anadirAdjunto(_adat);	
			document.querySelector('#form_pla #adjuntos #adjuntoslista').appendChild(_h3);
		}
	}
	
	
	for(_aid in _res.data.Actores){
		
		_datA=_res.data.Actores[_aid];
		
		_aa=document.createElement('a');
		_aa.setAttribute('onclick','cargarOpcion(this)');
		_aa.setAttribute('ondblclick','editarActor(this)');
		_aa.setAttribute('aid',_aid);
		_aa.title=_datA.nombre+'\n'+_datA.apellido;
		_aa.innerHTML=_datA.nombre+' '+_datA.apellido;
		
		
		if(_aid==_PlaCargada.id_p_GRAactores){
			_form.querySelector('input[name="id_p_GRAactores_n"]').value=_datA.nombre+' '+_datA.apellido;
			
		}
					
		//console.log('es grupo tipo a');
		
		if(_res.data.ActoresAsignados == undefined){continue;}
		if(_datA.elementos	> 0){
		//console.log('es un grupo usado');
			_destI=_form.querySelector('.sugerencia.uno');
		}else{
			_destI=_form.querySelector('.sugerencia.dos');
		
		}
		
		_destI.appendChild(_aa);					
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


function formularPlanmuestra(){

	_form=document.querySelector('#muestra_pla');
	_form.querySelector('[name="id"]').value=_PlaCargada.id;
	_form.querySelector('[name="nombre"]').innerHTML=_PlaCargada.nombre;					
	_form.querySelector('[name="numero"]').innerHTML=_PlaCargada.numero;
	
	_form.setAttribute('nivel',_PlaCargada.nivel);
	_form.querySelector('[name="nivel"]').value=_PlaCargada.nivel;
	_form.querySelector('#divident').style.backgroundColor=_PlaCargada.CO_color;
	

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
		_div.appendChild(_div2);
					
		_la=document.createElement('label');
		_la.innerHTML=_dat.nombre;
		_div2.appendChild(_la);
		
		_valor='';
		if(_PlaCargada.categorias[_idcat]!=undefined){
			_valor=_PlaCargada.categorias[_idcat];
		}
		_in=document.createElement('span');
		_in.innerHTML=_valor;
		_div2.appendChild(_in);
	}
	

	for(_en in _PlaCargada.estados){
		if(typeof _PlaCargada.estados[_en] != 'object'){continue;}			
		_ddd=document.createElement('div');
		_ddd.setAttribute('class','estado');
		_ddd.innerHTML='<div class="nombre">'+_PlaCargada.estados[_en].nombre+'</div> desde: <div class="desde">'+_PlaCargada.estados[_en].desde+'</div>';
		_form.querySelector('#listaestados').appendChild(_ddd);
	}
	
	
	if(Object.keys(_PlaCargada.documentos).length>0){
		for(_na in _PlaCargada.documentos){
			if(typeof _PlaCargada.documentos[_na] != 'object'){continue;}							
			_adat=_PlaCargada.documentos[_na];							
			_h3 = anadirAdjunto(_adat);	
			_form.querySelector('#adjuntos #adjuntoslista').appendChild(_h3);
		}
	}
	
	
	for(_aid in _res.data.Actores){			
		_datA=_res.data.Actores[_aid];
		if(_aid==_PlaCargada.id_p_GRAactores){
			_form.querySelector('[name="id_p_GRAactores_n"]').innerHTML=_datA.nombre+' '+_datA.apellido;				
		}	
	}
	

	_FormE = $('#form_pla .escroleable');
	_handle = $('#dBordeL');
	_handle.css('height',_FormE.height());
	_FormE.scrollTop(0);

}

function bajarNivelMenu(){
	
	_id=document.querySelector("#form_pla [name='id']").value;
	_nivel=document.querySelector("#form_pla [name='nivel']").value;
	
	_n=parseInt(_nivel.replace('PLAn',''));
	_nv='PN'+_n;
	
	_nn=_n+1;
	_nnv='PN'+_nn;
	_nnivel='PLAn'+_nn;
	
	
	_nnn=_nn+1;
	_nnnv='PN'+_nnn;
	_nnnivel='PLAn'+_nnn;
	
	document.querySelector("#form_pla #menumover #listamover").innerHTML='';
	
	
	_hijes=Array();
	_nietes=Array();
	
	for(_no in _DataPlan[_nnv]){	
		if(_DataPlan[_nnv][_no]['id_p_PLAn'+_n]==_id){
			_hijes.push(_DataPlan[_nnv][_no].id);			
		}
	}
	
	
	console.log(_nnnv);
	if(_DataPlan[_nnnv]!=undefined){
		for(_i in _hijes){	
			
			_idh=_hijes[_i];			
			console.log(_idh);
			
			for(_no in _DataPlan[_nnnv]){	
				console.log('id_p_PLAn'+_nn);
				console.log(_DataPlan[_nnnv][_no]);
				if(_DataPlan[_nnnv][_no]['id_p_PLAn'+_nn]==_idh){
					_nietes.push(_DataPlan[_nnnv][_no].id);			
				}
			}
		}		
	}
	
	
	_disponible='';
	
	
	if(_nietes.length>0){
		alert('El componente que intenta bajar de categoría tiene 2 niveles de componententes dentro. Debe mover fuera al menos los componentes de segundo nivel antes de poder pasar este a un nivel inferior.');
		return;
	}
	
	if(_hijes.length>0 && _nv=='PN2'){
		alert('El componente que intenta bajar de categoría tiene componententes dentro. Debe mover fuera sus componentes antes de poder pasar este al nivel inferior.');
		return;
	}
	
	if(_hijes.length>0 && _nv=='PN1'){
		_disponible='1_nivel';
		
	}
	document.querySelector("#form_pla #menumover").setAttribute('disponible',_disponible);
	
		
	_nv='PN1';		
	
	document.querySelector("#form_pla #menumover").setAttribute('nivel',_nnv);
	
	
	
	for(_no in 	_DataPlan[_nv+'_orden']){
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		if(_id_dest==_id){continue;}
		_dat_dest=_DataPlan[_nv][_id_dest];
		
		if(_nnv!=_nv){
			_ael=document.createElement('div');
		}else{
			_ael=document.createElement('a');
			_ael.setAttribute('onclick','bajarNivel("'+_id+'","'+_nivel+'","'+_id_dest+'","PLAn1")');
		}
		
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
		
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);		
		
		if(_nnv=='PN3'){
			_num=document.createElement('span');
		}else{
			_num=document.createElement('a');
			_ael.setAttribute('onclick','bajarNivel("'+_id+'","'+_nivel+'","'+_id_dest+'","PLAn1")');
		}
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
		
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);


		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');
		_ael.appendChild(_list);
			
		document.querySelector("#form_pla #menumover #listamover").appendChild(_ael);
		
	}
		
	
	_nv='PN2';		
	for(_no in 	_DataPlan[_nv+'_orden']){
		
		if(_disponible=='1_nivel'){continue;}
		
		
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		if(_id_dest==_id){continue;}
		
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ael=document.createElement('a');
		
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('onclick','bajarNivel("'+_id+'","'+_nivel+'","'+_id_dest+'","PLAn2")');
									
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);
				
		if(
			document.querySelector("#form_pla #menumover #listamover > [id_dest='"+_dat_dest['id_p_PLAn1']+"'] .contenidos")==null
		){continue;}
		
		document.querySelector("#form_pla #menumover #listamover > [id_dest='"+_dat_dest['id_p_PLAn1']+"'] .contenidos").appendChild(_ael);
		
		
		
	}

	document.querySelector('#form_pla #menumover').setAttribute('activo','si');
	

	
}



function moverNivelMenu(){
	
	_id=document.querySelector("#form_pla [name='id']").value;
	_nivel=document.querySelector("#form_pla [name='nivel']").value;
	_nn=parseInt(_nivel.replace('PLAn',''))-1;
	_nnv='PN'+_nn;
	
	document.querySelector("#form_pla #menumover #listamover").innerHTML='';
	
	
		
	_nv='PN1';		
	
	document.querySelector("#form_pla #menumover").setAttribute('nivel',_nnv);
	
	
	for(_no in 	_DataPlan[_nv+'_orden']){
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		
		if(_nnv!=_nv){
			_ael=document.createElement('div');
		}else{
			_ael=document.createElement('a');
			_ael.setAttribute('onclick','moverNivelPlan("'+_id+'","'+_nivel+'",this.getAttribute("id_dest"))');
		}
		
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
		
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);		
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
		
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);


		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');
		_ael.appendChild(_list);
			
		document.querySelector("#form_pla #menumover #listamover").appendChild(_ael);
		
	}
		
	
	_nv='PN2';		
	for(_no in 	_DataPlan[_nv+'_orden']){
		if(_nnv!=_nv){continue;}
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ael=document.createElement('a');
		
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('onclick','moverNivelPlan("'+_id+'","'+_nivel+'",this.getAttribute("id_dest"))');
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);
				
		document.querySelector("#form_pla #menumover #listamover > [id_dest='"+_dat_dest['id_p_PLAn1']+"'] .contenidos").appendChild(_ael);
		
		
		
	}

	document.querySelector('#form_pla #menumover').setAttribute('activo','si');
		
	
}



function cargarIndice(){
	

	document.querySelector("#navega_plan #indice").innerHTML='';	
	_nv='PN1';			
		
	console.log(_nv);
	
	for(_no in 	_DataPlan[_nv+'_orden']){
		
		if(_DataPlan[_nv]==undefined){
			console.log('error. componente perdido:'+_nv);
			console.log(_DataPlan);
			continue;
		}
		
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		
		_ael=document.createElement('div');
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
				
		_link=document.createElement('a');
		_ael.appendChild(_link);
		_link.setAttribute('id_dest',_id_dest);
		_link.setAttribute('href','#'+_nv+'_'+_id_dest);
		//_link.setAttribute('onclick','irANivelPlan("'+_id_dest+'","'+_nv+'")');
		_link.setAttribute('class','link');
		_link.setAttribute('nivel',_nv);
				
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_link.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_link.appendChild(_nom);
		
		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');
		_list.setAttribute('abierto','-1');
		_ael.appendChild(_list);
		
		_abrecomp = document.createElement('a');
		_abrecomp.setAttribute('class','toggle');
		_abrecomp.setAttribute('onclick','toggleCompIndice(this.parentNode)');
		_abrecomp.innerHTML='<span id="abre">+</span><span id="cierra">-</span>';
		_list.appendChild(_abrecomp);
			
		document.querySelector("#navega_plan #indice").appendChild(_ael);	
	}
		
	
	_nv='PN2';		
	for(_no in _DataPlan[_nv+'_orden']){
		
		if(_DataPlan[_nv]==undefined){
			console.log('error. componente perdido:'+_nv);
			console.log(_DataPlan);
			continue;
		}
				
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ael=document.createElement('a');
		
		_ael=document.createElement('div');
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
				
		_link=document.createElement('a');
		_ael.appendChild(_link);
		_link.setAttribute('id_dest',_id_dest);
		
		_link.setAttribute('href','#'+_nv+'_'+_id_dest);
		//_link.setAttribute('onclick','irANivelPlan("'+_id_dest+'","'+_nv+'")');
		_link.setAttribute('class','link');
		_link.setAttribute('nivel',_nv);
				
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_link.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_link.appendChild(_nom);
		
		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');	
		_list.setAttribute('abierto','-1');
		_ael.appendChild(_list);
		
		_abrecomp = document.createElement('a');
		_abrecomp.setAttribute('class','toggle');	
		_abrecomp.setAttribute('onclick','toggleCompIndice(this.parentNode)');
		_abrecomp.innerHTML='<span id="abre">+</span><span id="cierra">-</span>';
		_list.appendChild(_abrecomp);
		
		document.querySelector("#navega_plan #indice > [id_dest='"+_dat_dest['id_p_PLAn1']+"'] .contenidos ").appendChild(_ael);
		
	}
	
	
	_nv='PN3';		
	for(_no in 	_DataPlan[_nv+'_orden']){
		
		if(_DataPlan[_nv]==undefined){
			console.log('error. componente perdido:'+_nv);
			console.log(_DataPlan);
			continue;
		}
		
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		
		
		if(_DataPlan.PN2[_dat_dest['id_p_PLAn2']]==undefined){
			console.log('errorm. componente perdido:'+_dat_dest['id_p_PLAn2']);
			console.log(_DataPlan.PN2[_dat_dest['id_p_PLAn2']]);
			continue;
		}
		_dat_dest_superior=_DataPlan.PN2[_dat_dest['id_p_PLAn2']].id_p_PLAn1;
		
		
		_ael=document.createElement('div');
		_ael.style.backgroundColor=_dat_dest['CO_color'];
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
				
		_link=document.createElement('a');
		_ael.appendChild(_link);
		_link.setAttribute('id_dest',_id_dest);
		
		_link.setAttribute('href','#'+_nv+'_'+_id_dest);
		//_link.setAttribute('onclick','irANivelPlan("'+_id_dest+'","'+_nv+'")');
		_link.setAttribute('class','link');
		_link.setAttribute('nivel',_nv);
				
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_link.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_link.appendChild(_nom);
				
		_str ="#navega_plan #indice > [id_dest='"+_dat_dest_superior+"'] .contenidos [id_dest='"+_dat_dest['id_p_PLAn2']+"'] .contenidos";
		
		document.querySelector(_str).appendChild(_ael);
		
	}	
}
function toggleCompIndice(_list){
	_list.setAttribute('abierto',(parseInt(_list.getAttribute('abierto'))*-1));
}

//FUNciones de filtro por búsqueda

function tecleaBusqueda(_this,_event){
	
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
	
	//console.log(_event.keyCode);
	if ( 
		_event.keyCode == '27'//presionó tab no es un nombre nuevo
	){
		document.querySelector('[name="busqueda"]').value='';
	}
		
	_val=document.querySelector('[name="busqueda"]').value;
				
	_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
	_hatch=_hatch.replace(/ /g, '');
	_hatch=_hatch.toLowerCase();
				
	if(_hatch.length>2){limpiarBuquedaB();}
				
	_segs=document.querySelectorAll('#contenidoextenso #seguimientos .fila.seguimiento');
	_pl1=document.querySelectorAll('.PLAn1 > .encabezado');
	for(_npl1 in _pl1){
		if(typeof _pl1[_npl1] != 'object'){continue;}
		if(_pl1[_npl1].parentNode.getAttribute('iddb')==null){continue;}
		
		//console.log(_hatch.length);
		if(_hatch.length<2){
			_pl1[_npl1].setAttribute('filtroB','ver');
			return;
		}
		
		_st =_pl1[_npl1].querySelector('.numero').innerHTML;
		_st+=_pl1[_npl1].querySelector('.nombre').innerHTML;
		_st+=_pl1[_npl1].querySelector('.decripcion').innerHTML;
		_st+=_pl1[_npl1].querySelector('.listaestados').innerHTML;
		_st+=_pl1[_npl1].querySelector('.documentos').innerHTML;
		
		_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
		_st=_st.replace(/ /g, '');
		_st=_st.toLowerCase();
		
		
		//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
		if(_st.indexOf(_hatch)>=0){
			_pl1[_npl1].parentNode.setAttribute('filtroB','vera');
		}else{
			_pl1[_npl1].parentNode.setAttribute('filtroB','nover');
		}
		
		
		_pl2=_pl1[_npl1].parentNode.querySelectorAll('.PLAn2 > .encabezado');
		for(_npl2 in _pl2){
			if(typeof _pl2[_npl2] != 'object'){continue;}
			if(_pl2[_npl2].parentNode.getAttribute('iddb')==null){continue;}
			
			_st =_pl2[_npl2].querySelector('.numero').innerHTML;
			_st+=_pl2[_npl2].querySelector('.nombre').innerHTML;
			_st+=_pl2[_npl2].querySelector('.decripcion').innerHTML;
			_st+=_pl2[_npl2].querySelector('.listaestados').innerHTML;
			_st+=_pl2[_npl2].querySelector('.documentos').innerHTML;
			
			_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
			_st=_st.replace(/ /g, '');
			_st=_st.toLowerCase();
				
			//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
			if(_st.indexOf(_hatch)>=0){
				_pl1[_npl1].parentNode.setAttribute('filtroB','ver');
				_pl2[_npl2].parentNode.setAttribute('filtroB','ver');
			}else{
				_pl2[_npl2].parentNode.setAttribute('filtroB','nover');
			}				
			
			_pl3=_pl2[_npl2].parentNode.querySelectorAll('.PLAn3 > .encabezado');
			for(_npl3 in _pl3){
				if(typeof _pl3[_npl3] != 'object'){continue;}
				if(_pl3[_npl3].parentNode.getAttribute('iddb')==null){continue;}
				
				_st =_pl3[_npl3].querySelector('.numero').innerHTML;
				_st+=_pl3[_npl3].querySelector('.nombre').innerHTML;
				_st+=_pl3[_npl3].querySelector('.decripcion').innerHTML;
				_st+=_pl3[_npl3].querySelector('.listaestados').innerHTML;
				_st+=_pl3[_npl3].querySelector('.documentos').innerHTML;
				
				_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
				_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
				_st=_st.replace(/ /g, '');
				_st=_st.toLowerCase();
					
				//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
				if(_st.indexOf(_hatch)>=0){
					_pl1[_npl1].parentNode.setAttribute('filtroB','ver');
					_pl2[_npl2].parentNode.setAttribute('filtroB','ver');
					_pl3[_npl3].parentNode.setAttribute('filtroB','ver');
				}else{
					_pl3[_npl3].parentNode.setAttribute('filtroB','nover');
				}				
			}	
		}
	}
	
	//para fichas
	_pl3=document.querySelectorAll('.Ficha[tadb="PLAn3"]');
	for(_npl3 in _pl3){
		if(typeof _pl3[_npl3] != 'object'){continue;}
		if(_pl3[_npl3].parentNode.getAttribute('iddb')==null){continue;}
		
		_st =_pl3[_npl3].querySelector('.encabezado > .numero').innerHTML;
		_st+=_pl3[_npl3].querySelector('.encabezado > .nombre').innerHTML;
		_st+=_pl3[_npl3].querySelector('.encabezado > .responsable').innerHTML;
		_st+=_pl3[_npl3].querySelector('.encabezado > .estado').innerHTML;
		_st+=_pl3[_npl3].querySelector('.encabezado > .decripcion').innerHTML;
		_st+=_pl3[_npl3].querySelector('.portafoto').innerHTML;
		_st+=_pl3[_npl3].querySelector('.categorias').innerHTML;
		
		_st=_st.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		_st=_st.replace('/[^A-Za-z0-9\-]/gi', '');
		_st=_st.replace(/ /g, '');
		_st=_st.toLowerCase();
			
		//console.log(_hatch+' vs '+_st+' -- '+_st.indexOf(_hatch));
		if(_st.indexOf(_hatch)>=0){
			_pl3[_npl3].setAttribute('filtroB','ver');
		}else{
			_pl3[_npl3].setAttribute('filtroB','nover');
		}				
	}	
}

function limpiarBuquedaB(){
	_filtrados=document.querySelectorAll("[filtroB='nover'], [filtroB='ver']");
	for(_nf in _filtrados){
		if(typeof _filtrados[_nf] != 'object'){continue;}
		_filtrados[_nf].removeAttribute('filtradoB');
	}
	
}


function escrolearA(_n,_id){
	alert('n desarrollo');
}

function formularInsertarReferencia(){
		
	_id=document.querySelector("#form_pla [name='id']").value;
	_nivel=document.querySelector("#form_pla [name='nivel']").value;
	_nn=parseInt(_nivel.replace('PLAn',''))-1;
	_nnv='PN'+_nn;
	
	document.querySelector("#form_pla #menureferenciar #listareferenciar").innerHTML='';
	document.querySelector("#form_pla #menureferenciar #listareferenciarindicadores").innerHTML='';

	_modo = document.querySelector("#form_pla #menureferenciar select[name='ref_modo']").value;
	
	if(_modo == 'PLA'){
		mostrarMenuReferenciasPLA();
	}else if(_modo == 'IND'){
		consultarListadoIND(); //deriva en mostrarMenuReferenciasIND();
	}
	
}

function mostrarMenuReferenciasPLA(){
	
	_nv='PN1';			
	for(_no in 	_DataPlan[_nv+'_orden']){
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ni=_nv.replace('PN','');
				
		_ael=document.createElement('a');
		_ael.setAttribute('onclick','event.stopPropagation();insertarReferencia("'+_id_dest+'","'+_nv+'")');		
		_ael.setAttribute('class','componente');
		_ael.setAttribute('nivel',_nv);
		
		_rgb=hexToRgb(_dat_dest['CO_color']);
		if(_ni=='1'){_alpha=1;}
		if(_ni=='2'){_alpha=0.4;}
		if(_ni=='3'){_alpha=0.4;}
		_rgbastr='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';
		
		_ael.style.backgroundColor=_rgbastr;
		_ael.setAttribute('id_dest',_id_dest);
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
		
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);

		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');
		_ael.appendChild(_list);
					
		document.querySelector("#form_pla #menureferenciar #listareferenciar").appendChild(_ael);		
	}
	
	_nv='PN2';		
	for(_no in 	_DataPlan[_nv+'_orden']){
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ael=document.createElement('a');
		_ni=_nv.replace('PN','');
		
		_rgb=hexToRgb(_dat_dest['CO_color']);
		if(_ni=='1'){_alpha=1;}
		if(_ni=='2'){_alpha=0.4;}
		if(_ni=='3'){_alpha=0.4;}
		_rgbastr='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';
		
		_ael.style.backgroundColor=_rgbastr;
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('onclick','event.stopPropagation();insertarReferencia("'+_id_dest+'","'+_nv+'")');		
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);
				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);
		
		_list=document.createElement('div');
		_list.setAttribute('class','contenidos');
		_ael.appendChild(_list);
		
		document.querySelector("#form_pla #menureferenciar #listareferenciar > [id_dest='"+_dat_dest['id_p_PLAn1']+"'] .contenidos").appendChild(_ael);
	}
	
	_nv='PN3';		
	for(_no in _DataPlan[_nv+'_orden']){		
		_id_dest=_DataPlan[_nv+'_orden'][_no];
		_dat_dest=_DataPlan[_nv][_id_dest];
		_ael=document.createElement('a');
		_ni=_nv.replace('PN','');
		
		_rgb=hexToRgb(_dat_dest['CO_color']);
		if(_ni=='1'){_alpha=1;}
		if(_ni=='2'){_alpha=0.4;}
		if(_ni=='3'){_alpha=0.4;}
		_rgbastr='rgba('+_rgb.r+', '+_rgb.g+', '+_rgb.b+', '+_alpha+')';
		
		_ael.style.backgroundColor=_rgbastr;
		_ael.setAttribute('id_dest',_id_dest);
		_ael.setAttribute('onclick','event.stopPropagation();insertarReferencia("'+_id_dest+'","'+_nv+'")');		
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_dat_dest['numero'];
		_ael.appendChild(_num);		
		//console.log(_num);				
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_dat_dest['nombre'];
		_ael.appendChild(_nom);
				
		document.querySelector("#form_pla #menureferenciar #listareferenciar >  a > div.contenidos > [id_dest='"+_dat_dest['id_p_PLAn2']+"'] .contenidos").appendChild(_ael);
	}

	document.querySelector('#form_pla #menureferenciar').setAttribute('activo','si');
}


function mostrarMenuReferenciasIND(){
	
	for(_nn in _DatosIndicadores.agrupacion){
		_cont=document.querySelector("#form_pla #menureferenciar #listareferenciarindicadores");
		
		_nv='1';
		_idGP=_nn;
		_ael=document.createElement('a');		
		_cont.appendChild(_ael);
		
		
		_ael.setAttribute('onclick','event.stopPropagation();event.preventDefault();');		
		_ael.setAttribute('nivel',_nv);
		_ael.setAttribute('class','componente');	
		if(_DatosGrupos[_idGP]==undefined){
			_nom_tx ='S/D';
		}else{
			_nom_tx=_DatosGrupos[_idGP].nombre;
		}		
		
		_num=document.createElement('span');
		_num.setAttribute('class','numero');
		_num.innerHTML=_idGP;
		_ael.appendChild(_num);
		
		_nom=document.createElement('span');
		_nom.setAttribute('class','nombre');
		_nom.innerHTML=_nom_tx;
		_ael.appendChild(_nom);

		_list1=document.createElement('div');
		_list1.setAttribute('class','contenidos');
		_ael.appendChild(_list1);
		
		
		_nv='2';		
		for(_ns in _DatosIndicadores.agrupacion[_nn]){
			
			_cont=_list1;
			_idGS=_ns;
			_ael=document.createElement('a');
			_cont.appendChild(_ael);
			_ni=_nv;
			
			_ael.setAttribute('onclick','event.stopPropagation();event.preventDefault();');		
			
			if(_DatosGrupos[_idGS]==undefined){
				_nom_tx ='S/D';
			}else{
				_nom_tx=_DatosGrupos[_idGS].nombre;
			}
			
			
			_num=document.createElement('span');
			_num.setAttribute('class','numero');
			_num.innerHTML=_ns;
			_ael.appendChild(_num);
					
			_nom=document.createElement('span');
			_nom.setAttribute('class','nombre');
			_nom.innerHTML=_nom_tx;
			_ael.appendChild(_nom);
			
			_list2=document.createElement('div');
			_list2.setAttribute('class','contenidos');
			_ael.appendChild(_list2);
			
			
			_nv='3';		
			for(_idInd in _DatosIndicadores.agrupacion[_nn][_ns]){
				
				_cont=_list2;
				
				
				_id_dest=_idInd;
				
				_dat_dest=_DatosIndicadores.indicadores[_idInd];
				
				_ael=document.createElement('a');
				_cont.appendChild(_ael);
				
				_ael.setAttribute('id_dest',_id_dest);
				_ael.setAttribute('onclick','event.stopPropagation();insertarReferenciaInd("'+_id_dest+'")');		
				
				_num=document.createElement('span');
				_num.setAttribute('class','numero');
				_num.innerHTML=_dat_dest['n_id_local']+'('+_id_dest+')';
				_ael.appendChild(_num);		
				//console.log(_num);				
				_nom=document.createElement('span');
				_nom.setAttribute('class','nombre');
				_nom.innerHTML=_dat_dest.indicador;
				_ael.appendChild(_nom);
						
			}	
		}
	}	
}


function desactivarForm(_idform){
	document.querySelector('#'+_idform).setAttribute('activo','no');
}


function insertarReferencia(_idpla,_nivel){
	
	_tx= " <span tipo='PLA' plan="+_nivel+" idpla="+_idpla+">cargando...</span> ";
	tinymce.activeEditor.execCommand('mceInsertContent', false, _tx);
	representarLinksPla('editor');
	
	desactivarForm('menureferenciar');
}


function insertarReferenciaInd(_id_ind){

	_tx= " <span tipo='IND' idind="+_id_ind+">cargando...</span> ";
	tinymce.activeEditor.execCommand('mceInsertContent', false, _tx);
	representarLinksPla('editor');
	representarLinksInd('editor');
	
	desactivarForm('menureferenciar');
}


//funciones interactivas del formulario

function cargarOpcion(_this){
	_aid=_this.getAttribute('aid');
	_tx=_this.innerHTML;
	if(_aid==0){
		_aid='';
		_tx='';
	}
	_this.parentNode.parentNode.querySelector('input[type="hidden"]').value=_aid;
	_this.parentNode.parentNode.querySelector('input[type="text"]').value=_tx;
	supervisarId1('');
}
	
function borrFecha(_this){
	_inps=_this.parentNode.querySelectorAll('input.dia, input.mini');
	for(_ninps in _inps){
		if(typeof _inps[_ninps] != 'object'){continue;}
		_inps[_ninps].value='';
	}	
	_this.parentNode.querySelector('input[value="hoy"]').style.display="inline-block";
	_this.removeAttribute('style');
}


function hoyFecha(_this){
	_inps=_this.parentNode.querySelectorAll('input.dia, input.mini');
	for(_ninps in _inps){
		if(typeof _inps[_ninps] != 'object'){continue;}
		_n=_inps[_ninps].getAttribute('name');
		//console.log(_n);
		_l=_n.substring(_n.length-1,_n.length);
		//console.log(_l);
		if(_l=='a'){_inps[_ninps].value=_Hoy.split('-')[2];}
		if(_l=='m'){_inps[_ninps].value=_Hoy.split('-')[1];}
		if(_l=='d'){_inps[_ninps].value=_Hoy.split('-')[0];}
		_this.parentNode.querySelector('input[value="borr"]').style.display="inline-block";
		_this.removeAttribute('style');
	}	
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
	//console.log(_campo);
	//_valor = _this.value;
	document.getElementById(_campo).value = 'n';
	
}

function actualizarResponsables(_event,_this){
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
	_name=_this.getAttribute('name');
	_campo=_name.substr(0,(_name.length-2));
	//console.log(_campo);
	//_valor = _this.value;
	document.getElementById(_campo).value = 'n';
	
}
	
function eliminarAdjunto(_this){
	_this.parentNode.setAttribute('eliminar','si');
	_this.style.display='none';
	_this.parentNode.querySelector('#eliminar').value='1';
	_this.parentNode.querySelector('.recuperar').style.display='inline-block';
}

function desEliminarAdjunto(_this){
	_this.parentNode.removeAttribute('eliminar');
	_this.style.display='none';
	_this.parentNode.querySelector('#eliminar').value='1';
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
	
	_inps=_this.parentNode.querySelectorAll('input.dia, input.mini');
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

function alterna01(_this){
	_for= _this.getAttribute('for');
	if(_this.checked==false){
		document.getElementById(_for).value='0';
	}else if(_this.checked==true){
		document.getElementById(_for).value='1';
	}
}




function anadirAdjunto(_adat){					

    _h3=document.createElement('h3');
    _h3.setAttribute('idadj',_adat.id);
    
    _aaa=document.createElement('a');
    _aaa.innerHTML=_adat.FI_nombreorig;
    _aaa.setAttribute('href',_adat.FI_documento);
    _aaa.title=_adat.FI_nombreorig;
    _aaa.setAttribute('download',_adat.FI_nombreorig);
    _h3.appendChild(_aaa);

    _in=document.createElement('input');
    _in.value=_adat.descripcion;
    _in.setAttribute('type','text');
    _in.setAttribute('name','adj_'+_adat.id+'_descripcion');
    _h3.appendChild(_in);
    
    _in=document.createElement('input');
    _in.value=_adat.zz_borrada;
    _in.setAttribute('type','hidden');
    _in.setAttribute('id','eliminar');
    _in.setAttribute('name','adj_'+_adat.id+'_zz_borrada');
    _h3.appendChild(_in);
                                
    _in=document.createElement('input');
    _in.value='X';
    _in.title='borrar documento';
    _in.setAttribute('type','button');
    _in.setAttribute('class','eliminar');
    _in.setAttribute('onclick','eliminarAdjunto(this)');
    _h3.appendChild(_in);
    
    _in=document.createElement('input');
    _in.value='<-';
    _in.title='recuperar documento';
    _in.setAttribute('type','button');
    _in.setAttribute('class','recuperar');
    _in.setAttribute('onclick','desEliminarAdjunto(this)');
    _h3.appendChild(_in);
    
    return _h3;                              
    
}


//funciones para arrastrar archivos
function resDrFile(_event){
	//console.log(_event);
	document.querySelector('#adjuntos #contenedorlienzo').style.backgroundColor='lightblue';
}	

function desDrFile(_event){
	//console.log(_event);
	document.querySelector('#adjuntos #contenedorlienzo').removeAttribute('style');
}
    

//funciones de arrastre para desplazar y cambiar el tamaño del formulario

	var isResizing = false,
    lastDownX = 0,
    _anchoinicial = 0,
    _equisInicial = 0;
    
    var _excepturadragform='no';
    
    ///funciones para guardar archivos


	function drag_start(_event,_this) {
        if(_excepturadragform=='si'){
            return;
        }
        _event.stopPropagation();
        //console.log(_event);
        
        if(isResizing){return;}
        
        var crt = _this.cloneNode(true);
        crt.style.display = "none";
        _event.dataTransfer.setDragImage(crt, 0, 0);
        
        var style = window.getComputedStyle(_event.target, null);
        _event.dataTransfer.setData(
            "text/plain",        
            (parseInt(style.getPropertyValue("left"),10) - _event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - _event.clientY)
        );
	} 
	
	function drag_over(event) { 
	    event.preventDefault(); 
	    var offset = event.dataTransfer.getData("text/plain").split(',');
	    var dm = document.getElementById('form_pla');
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
	    var dm = document.getElementById('form_pla');
	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    
	    return false;
	} 
	var dm = document.getElementById('form_pla'); 
	document.body.addEventListener('dragover',drag_over,false); 
	document.body.addEventListener('drop',drop,false); 
	


    $(function () {
        var 
            _Form = $('#form_pla'),
            _FormE = $('#form_pla .escroleable'),
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
                      
           //console.log('anchoinicial:'+_anchoinicial);
           //console.log('ultimox:'+lastDownX);
           //console.log('ahora x:'+e.clientX);
           var offsetWidth = _anchoinicial - (e.clientX - lastDownX);
           //console.log('offset:'+offsetWidth);
            
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
    
    //Funciones de arrastre para mover puntos.
 
	_mouseY=0;
	_mouseX=0;
	
	_auxX = document.getElementById('auxX');
	_auxY = document.getElementById('auxY');

	//activar drag an drop para los puntos de relevamiento
	function handleDragStart(e) {
		
		this.style.opacity = '0.4';  // this / e.target is the source node.
		//this.style.overflow = 'hidden'; 
		//this.style.border='none';		
		_mouseX=e.pageX;
		_mouseY=e.pageY;	
		_elementoDrag=this;
		//_auxX.innerHTML=_mouseX;
		//_auxY.innerHTML=_mouseY;		
		
	}
	
	//acciones al pasar sobre un objeto
	function handleDragOver(e) {
		
		if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		}
		//this.style.opacity = '0.8';
		//e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.	
		return false;
	}	
	
	
	//funcion disparada al soltar un punto sobre un plano
	function handleDrop(e) {

		this.style.opacity = '1';  // this / e.target is the source node.	  
		_varX= e.pageX-_mouseX;
		_varY= e.pageY-_mouseY;
		_elementoDrag.style.opacity = '1';
		
		_valx = parseInt(_elementoDrag.style.left.replace('px', ''));
		_valx = _valx +  (e.pageX-_mouseX);

		_valy = parseInt(_elementoDrag.style.top.replace('px', ''));
		_valy = _valy +  (e.pageY-_mouseY);		
		_auxX.innerHTML=_valx;
		_auxY.innerHTML=_valy;
		
		_elementoDrag.style.left=(_valx + "px");		
		_elementoDrag.style.top =(_valy + "px");		
		//alert(_varX + " , "+ _varY);
		
		_dbid=_elementoDrag.getAttribute('dbid');

		document.getElementById('cambiaminiTabla').value='RELlocalizaciones';			
		document.getElementById('cambiaminiPosId').value=_dbid;		
		document.getElementById('cambiaminiPosX').value=_valx+3;	
		document.getElementById('cambiaminiPosY').value=_valy+3;		
		
		_dbidPA=_elementoDrag.getAttribute('dbidPA');//identifica a los elementos de la tabla de putnos adicionales	
		if(_dbidPA>0){
			document.getElementById('cambiaminiTabla').value='RELlocpuntosadicionales';				
			document.getElementById('cambiaminiPosId').value=_dbidPA;					
		}
	
		document.getElementById('cambiaminiPosY').parentNode.submit();	

	}
	
	//activar funcion (event listener) para handleDragStart para puntos principales y adicionales
	var cols = document.querySelectorAll('.loc');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragstart', handleDragStart, false);
	});
	
	//activar funcion (event listener) para handleDragOver para planos	
	var cols = document.querySelectorAll('.imagenplano');
	[].forEach.call(cols, function(col) {
 		col.addEventListener('dragover', handleDragOver, false);  
 		col.addEventListener('drop', handleDrop, false);
	});	
		


	function editarActor(_this){
		alert('en desarrollo');	
	}
	
	function limpiarFormPlan(){
		document.querySelector('#form_pla').setAttribute('estado','inactivo');
		//console.log('en desarrollo');
				
		document.querySelector('#form_pla input[name="id"]').value='';
		document.querySelector('#form_pla input[name="numero"]').value='';
		document.querySelector('#form_pla input[name="nombre"]').value='';
		document.querySelector('#form_pla input[name="nivel"]').value='';
		document.querySelector('#form_pla div .sugerencia.uno').innerHTML='<a aid="0" onclick="cargarOpcion(this);">-vacio-</a><br>';
		document.querySelector('#form_pla div .sugerencia.dos').innerHTML='';
		
		document.querySelector('#form_pla .paquete #listaestados').innerHTML='';
		
		document.querySelector('#form_pla #adjuntos #listadosubiendo').innerHTML='';
		document.querySelector('#form_pla #adjuntos #adjuntoslista').innerHTML='';

		document.querySelector('#form_pla #menumover').setAttribute('activo','no');
		document.querySelector("#form_pla #menumover #listamover").innerHTML='';
	}
		
	function cancelarPlan(_this){
		_this.parentNode.setAttribute('estado','inactivo');
		if(_this.parentNode.getAttribute('id')=='form_pla'){
			limpiarFormPlan();
		}
	}
	
	function quitarFila(_nivel,_id){
		//en desarrollo;
		_elem=document.querySelector('div[nivel="'+_nivel+'"][iddb="'+_id+'"]');
		_elem.parentNode.removeChild(_elem);
	}
		
		
	function aCero(_sub){
		_sub.style.right='0';
		_sub.style.bottom='0';
	}	
//Funciones de generación de formularios

	function evaluaActor(_this){	
		if(_this.value=='n'){
			_this.style.display='none';
			_this.nextSibling.style.display='inline-block';
			_this.nextSibling.nextSibling.style.display='inline-block';			
		}else if(_this.value===''){
			
		}else{
			cambiaActor(_this.parentNode);
			_this.parentNode.nextSibling.style.display='inline-block';
			_this.parentNode.submit();
			_this.parentNode.parentNode.removeChild(_this.parentNode);
		}
	}

	function cambiaActor(_this){
		//console.log(_this.previousSibling.value);
		_this.previousSibling.innerHTML=_this.childNodes[3].options[_this.childNodes[3].selectedIndex].text;
		
	}
	
	function cargaNuevoActor(_this){
		if(_this.childNodes[4].value!=''){
		//console.log(_this.previousSibling.value);
		_this.previousSibling.innerHTML=_this.childNodes[4].value;
		_this.nextSibling.style.display='inline-block';		
		_this.style.display='none';	
		_dest=document.getElementById('auxiliares');
		_dest.appendChild(_this);		
		//_this.submit();		
		//_this.parentNode.removeChild(_this);
		}
	}
		

///funciones cargar el formulario general

function editarPlanGral(){
	
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_form=document.querySelector('#form_pla_gral');
	_form.setAttribute('estado','activo');
	_form.querySelector('#ejec').value='guardar';
	
	_form.querySelector('[name="nombre"]').value=_DataPlan.PLA.general.nombre;
	var editor = tinymce.get('descripciongral'); // use your own editor id here - equals the id of your textarea
	
	editor.setContent(_DataPlan.PLA.general.descripcion);	
							
}




$('input').on('mouseover',function(){
    document.querySelector('#form_pla').removeAttribute('draggable');
    _excepturadragform='si';
});
$('input').on('mouseout',function(){
document.querySelector('#form_pla').setAttribute('draggable','true');
    _excepturadragform='no';
});



function editarPlanEncabeza(){
	
	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	_form=document.querySelector('#form_pla_encabeza');
	_form.setAttribute('estado','activo');
	_form.querySelector('#ejec').value='guardar';
	
	var editor = tinymce.get('encabezado'); // use your own editor id here - equals the id of your textarea
	editor.setContent(_DataPlan.PLA.general.encabezado);	
							
}

