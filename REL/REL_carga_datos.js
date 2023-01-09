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

function cargaAccesos(){
	_parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './PAN/PAN_consulta_acceso.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			_Acc=_res.data.Acc;
			if(_Acc[0][0]=='administrador'||_Acc[0][0]=='editor'){
				_Habilitadoedicion='si';
			}
			consultarListado(); 
        }
    })
}
cargaAccesos();


function consultarListado(){
    _parametros = {
        'panid': _PanId
    };
    $.ajax({
        url:   './REL/REL_consulta_relevamientos.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            _res = PreprocesarRespuesta(response);
            
            _lista=document.querySelector('#listarelevamientos');
            _lista.innerHTML='';
            
            for(_idt in _res.data.tipos){
            	_tdat=_res.data.tipos[_idt];
            	_DataTipos[_idt]=_tdat;	
            }
            
            for(_idr in _res.data.relevamientos){
            	_DataRelevamientos[_idr]=_res.data.relevamientos[_idr];    
            }
            
            
            for(_idp in _res.data.planos){
            	_pdat=_res.data.planos[_idp];
            	_DataPlanos[_idp]=_pdat;	
            }
            
            
            for(_idl in _res.data.localizaciones){
            	_ldat=_res.data.localizaciones[_idl];
            	_DataLocalizaciones[_idl]=_ldat;	
            }
            
            for(_idr in _res.data.relevamientos){       	
            	listarRelevamiento(_idr);	
            }
            
       }
   })
}

function  listarPlano(_idp){	
	
	_lista=document.querySelector('#activadorplanos');
	
	_existe=document.querySelector('#activadorplanos > [idpla="'+_idp+'"]');
	if(_existe!=null){_existe.parentNode.removeChild(_existe);}	
	
	_pdat=_DataPlanos[_idp];	
	_div=document.createElement('a');
	_div.innerHTML=_pdat.nombre;
	if(_div.innerHTML==''){_div.innerHTML='- plano sin nombre -';}
	_div.setAttribute('idpla',_idp);
	_div.setAttribute('onclick',"cargarPlano(this.getAttribute('idpla'));formularPlano(this.getAttribute('idpla'))");
	
	_lista.appendChild(_div);
	
	if(_IdPlanoActivo==''){
		cargarPlano(_idp);
		formularPlano(_idp);
	}	
}



function consultarRelEditado(_idrel){
	_parametros = {
        'panid': _PanId,
        'idrel': _idrel
    };
    $.ajax({
        url:   './REL/REL_consulta_relevamientos.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			_idr=_res.data.relevamientoconsultado.id;
			_DataRelevamientos[_idr]=_res.data.relevamientoconsultado;
			formularRelevamiento(_idr);
			listarRelevamiento(_idr);		
			
        }
    })
}



function cargarRelevamiento(_idrel){
	
	cerrarFormPla(); 
	
	_listalocalizaciones=document.querySelector('#listalocalizaciones');
	_listalocalizaciones.innerHTML='';
	_listalocalizaciones.style.display='none';
	_IdLocEdit=''
	
	document.querySelector('#formlocalizacion').setAttribute('idloc','');
    document.querySelector('#formlocalizacion').style.display='none';
	limpiarSeleccionLoc();
	
	
	_IdRelEdit=_idr;
	document.querySelector('#columnalateral #planos').style.display='block';
	_lisptaplanos=document.querySelector('#activadorplanos');
	_lisptaplanos.innerHTML='';
	_lisptaplanos.style.display='block';
	
	
	for(_idp in _DataRelevamientos[_idrel].planos){
		listarPlano(_idp);
	}		
}


function consultarPlanoEditado(_idplan){
	_parametros = {
        'panid': _PanId,
        'idpla': _idplan
    };
    $.ajax({
        url:   './REL/REL_consulta_relevamientos.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			_idp=_res.data.planoconsultado.id;
			_DataPlanos[_idp]=_res.data.planoconsultado;
			formularPlano(_idp);
			listarPlano(_idp);		
			
        }
    })
}


function cargarPlano(_idplan){
	
	_IdPlanoActivo=_idplan;
    dibujarReleMapa();
    
    document.querySelector('#formlocalizacion').setAttribute('idloc','');
    document.querySelector('#formlocalizacion').style.display='none';
    limpiarSeleccionLoc();
    
    
    if(_DataPlanos[_idplan].FI_tipo=='dxf'){
		if(_DataPlanos[_idplan].FI_proces=='0'||_DataPlanos[_idplan].FI_proces==null){
			procesarDXF(_idplan,'0');		
		}else{
			cargarGeometriasPlano(_idplan,'0');
			
		}
	}
    
	_listalocalizaciones=document.querySelector('#listalocalizaciones');
	_listalocalizaciones.innerHTML='';
	_listalocalizaciones.style.display='block';
	
	document.querySelector('#localizaciones').style.display='block';
	
	for(_nl in _DataPlanos[_idplan].localizaciones){
		_idl=_DataPlanos[_idplan].localizaciones[_nl];
		
		_DataRelevamientos[_idr]
		
		listarLoc(_idl);
	}
	
	_li=document.querySelector('#formplano #listaunidades');
	for(_idu in _DataPlanos[_idplan].unidades){
		_udat=_DataPlanos[_idplan].unidades[_idu];
		_aa=document.createElement('a');
		_aa.setAttribute('onclick','editarUnidad(this.getAttribute("idu"))');
		_aa.setAttribute('idu',_idu);
		_aa.innerHTML=_udat.nombre;
		_aa.title=_udat.descripcion;
		_li.appendChild(_aa);
	}
	
	_li=document.querySelector('#formplano #listalocales');
	
	
	for(_idlal in _DataPlanos[_idplan].locales){
		_laldat=_DataPlanos[_idplan].locales[_idlal];
		_aa=document.createElement('a');
		_aa.setAttribute('onclick','editarLocal(this.getAttribute("idlal"))');
		_aa.setAttribute('idlal',_idlal);
		_aa.innerHTML=_laldat.nombre;
		_aa.title=_laldat.descripcion;
		_li.appendChild(_aa);
	}
			
}


function cargarGeometriasPlano(_idplano){
		_parametros = {
        'panid': _PanId,
        'idpla': _idplano
    };
    $.ajax({
        url:   './REL/REL_consulta_plano.php',
        type:  'post',
        data: _parametros,
		success:  function (response){
			_res = $.parseJSON(response);
			for(var _nm in _res.mg){alert(_res.mg[_nm]);}
			if(_res.res!='exito'){
				alert('se produjo un error al consultar la base de datos;')
				return;
			}
			
			_idpla=_res.data.planoconsultado.id;
			_DataPlanos[_idpla]=_res.data.planoconsultado;
			
			dibujarGeometriaArq(_idpla);
        
        }
    });
}



function procesarDXF(_idplano,_avance){
	_parametros = {
        'panid': _PanId,
        'idplano': _idplano,
        'avance':_avance
    };
    $.ajax({
        url:   './REL/REL_procesa_dxf.php',
        type:  'post',
        data: _parametros,

        success:  function (response){
            _res = $.parseJSON(response);
            for(var _nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){
            	alert('se produjo un error al consultar la base de datos;')
            	return;
            }
            
        	if(_res.data.avance==0){
        		alert('error, el proceso no avanzo');
        		return;
        	}
        	
            if(_res.data.avance!='final'){
                procesarDXF(_res.data.idplano,_res.data.avance);
                //document.querySelector('#avanceproceso').style.display='block';
                //document.querySelector('#avanceproceso').innerHTML=_res.data.avanceP+"%";
                //document.querySelector('#avanceproceso').setAttribute('avance',_res.data.avanceP);              
            }else{
                //document.querySelector('#avanceproceso').style.display='none';
                //document.querySelector('#avanceproceso').innerHTML=_res.data.avanceP+"%";
                //document.querySelector('#avanceproceso').setAttribute('avance',_res.data.avanceP);
                cargarPlano(_res.data.idplano);
            }
        
        }
    });
}



function hacerPoligonoUnidad(){
	addInteractionPolUni()
	_cont=document.getElementById('mapa').contentWindow;
	_cont.addInteractionPol();
	//_cont.mapa.removeInteraction(draw);
	//_cont.mapa.addInteraction(drawPol);		
}


function consultarLocalizacionEditada(_idloc){
	_parametros = {
        'panid': _PanId,
        'idloc': _idloc
    };
    $.ajax({
        url:   './REL/REL_consulta_relevamientos.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			_idl=_res.data.localizacionconsultada.id;
			_DataLocalizaciones[_idl]=_res.data.localizacionconsultada;
			formularLocalizacion(_idl);
			listarLoc(_idl);	
			dibujarReleMapa();	
        }
    })
}



function  listarLoc(_idloc){	
	
	_lista=document.querySelector('#listalocalizaciones');
	_lista.style.display='block';
	_existe=document.querySelector('#listalocalizaciones > [idloc="'+_idloc+'"]');
	if(_existe!=null){_existe.parentNode.removeChild(_existe);}	
	
	_ldat=_DataLocalizaciones[_idloc];
	_div=document.createElement('a');
	_div.setAttribute('idloc',_idloc);
	_div.setAttribute('class','loc');
	_div.setAttribute('onclick',"formularLocalizacion(this.getAttribute('idloc')); resaltarEnElMapa(this.getAttribute('idloc'))");	
	_listalocalizaciones.appendChild(_div);
	
	if(_DataTipos[_ldat.id_p_RELtipos_id_nombre]==undefined){
		_tipo='';
	}else{
		_tipo=_DataTipos[_ldat.id_p_RELtipos_id_nombre].nombre;
	}
	
	_de=document.createElement('div');
	_de.setAttribute('class','descripcion');
	_div.appendChild(_de);
	
	_c=document.createElement('div');
	_c.setAttribute('class','criticidad '+_ldat.criticidad);
	_de.appendChild(_c);


	if(_ldat.observaciones!=''){
		_o=document.createElement('span');
		_o.setAttribute('class','obs');
		_o.innerHTML=' ! ';
		_de.appendChild(_o);
	}
	
	_c=document.createElement('span');
	_c.setAttribute('class','tipo');
	_c.innerHTML=_tipo;
	_de.appendChild(_c);
					
	_de.innerHTML+=' '+_ldat.descripcion;
	
	_s=_ldat.fecha.split('-');
	
	_fe=document.createElement('div');
	_fe.setAttribute('class','fecha');
	_div.appendChild(_fe);
	
	_d=document.createElement('div');
	_d.setAttribute('class','dia');
	_d.innerHTML=_s[2];
	_fe.appendChild(_d);
	
	_d=document.createElement('div');
	_d.setAttribute('class','mes');
	_d.innerHTML= MesNaMesTxCorto(_s[1]);
	_fe.appendChild(_d);
	
	_d=document.createElement('div');
	_d.setAttribute('class','ano');
	_d.innerHTML=_s[0];
	_fe.appendChild(_d);
}


function  listarRelevamiento(_idr){	
	
	_lista=document.querySelector('#listarelevamientos');	
	
	_existe=document.querySelector('#listarelevamientos > [idrel="'+_idr+'"]');
	if(_existe!=null){_existe.parentNode.removeChild(_existe);}	
		
	_rdat=_DataRelevamientos[_idr];	
	_DataRelevamientos[_idr]=_rdat;
	
	_div=document.createElement('a');
	_div.innerHTML=_rdat.nombre;
	_div.setAttribute('idrel',_idr);
	_div.setAttribute('onclick',"cargarRelevamiento(this.getAttribute('idrel')),formularRelevamiento(this.getAttribute('idrel'))");
	
	_lista.appendChild(_div);
	if(_IdRelEdit==''){
		cargarRelevamiento(_idr);
		formularRelevamiento(_idr);
	}	
}

