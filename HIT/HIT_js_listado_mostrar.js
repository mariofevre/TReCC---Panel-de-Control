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

function FormularFecha(_res){
	_form=document.querySelector('#formcent[name="nuevafecha"]');
	_form.style.display='block';
	_form.querySelector('#cid').value=_idhito;
	
	
	_f=_Hitos[_idhito].fecha.split('-');
	_date = '';
	console.log('f');
	console.log(_f.length);
	if(_f.length==3){
		//es una fecha, no un mensaje
		_date=_f[0]+'-'+_f[1]+'-'+_f[2];
		console.log(_date);	
	}
	
	_form.querySelector('[name="fecha_fecha"]').value=_date;
	_form.querySelector('#cnombre').innerHTML=_Hitos[_idhito].nombre;
	_form.querySelector('#historial').innerHTML='';
	
	    
	if(
		_date == ''
	){
		document.querySelector('#nuevafecha #botonconfirma').style.display='none';
		alert('o');
	}else{
		if(
			_Hitos[_idhito].estado=='ocurrido'
			||
			_Hitos[_idhito].estado=='previstos'
		){
			_form.querySelector('a#botonconfirma').style.display='none';
		}else{
			_form.querySelector('a#botonconfirma').style.display='inline-block';
		}
	}
	
	
	
	_anchototal=_res.data.fechaUmax-_res.data.fechaUmin;	
	_form.querySelector('.barrafecha').setAttribute('anchoFechaU',_anchototal);
	_form.querySelector('.barrafecha').setAttribute('minFechaU',_res.data.fechaUmin);
	
	
	_nf=0;
	
	for(_nf in _res.data.fechasU){
		
		_datf=_res.data.fechasU[_nf];
		
	//	console.log(_datf);
		
		_fecha=document.createElement('div');
		_fecha.setAttribute('class','fecha');
		_fecha.setAttribute('idfecha',_datf.idfecha);
		_fecha.setAttribute('onclick','borrarFecha(this)');
		_fecha.setAttribute('superada',_datf.zz_superada);
		_fecha.setAttribute('tipo',_datf.fechatipo);
		
		
		_form.querySelector('#historial').appendChild(_fecha);
													
		_anchofecha=_datf.fechaUsuperadadesde-_datf.fechaUvalidodesde;
		console.log(_anchofecha+' '+_anchototal);
		_ancho=100*(_anchofecha)/(_anchototal);
		_fecha.style.width='calc('+_ancho+'% - 1px)';
		console.log(_ancho);
		_de=document.createElement('div');
		_top=(parseInt(_nf)+1)*30;
		_fecha.style.marginTop=_top+'px';
		_de.setAttribute('class','desde');					
		var date = new Date(_datf.fechaUvalidodesde*1000);
		var year = date.getFullYear();
		var month = 1+date.getMonth();
		var day = date.getDate();
		_de.innerHTML=day+'-'+month+'-'+year;
		_fecha.appendChild(_de);
		
		_ha=document.createElement('div');
		_ha.setAttribute('class','hasta');	
		var date = new Date(_datf.fechaUsuperadadesde*1000);
		var year = date.getFullYear();
		var month = 1+date.getMonth();
		var day = date.getDate();
		_ha.innerHTML=day+'-'+month+'-'+year;
		_fecha.appendChild(_ha);	
		
		_ob=document.createElement('div');
		_ob.setAttribute('class','objetivo');	
		var date = new Date(_datf.fechaU*1000);
		var year = date.getFullYear();
		var month = 1+date.getMonth();
		var day = date.getDate();
		
		if(_datf.fechatipo=='efectiva'){
			_ttxx='ocurrido: ';
		}else{
			_ttxx='previsto: ';
		}
		
		_ob.innerHTML=_ttxx+day+'-'+month+'-'+year;
		_fecha.appendChild(_ob);			
		
		_left=100*(_datf.fechaU-_datf.fechaUvalidodesde)/(_anchofecha);
		_ob.style.left=_left+'%'; 
		
	}
	

	var _d = new Date(_res.data.fechaUmin*1000);
	_ano=_d.getFullYear();
	_mes=_d.getMonth();
	_dia=_d.getDate();
	
	var _df = new Date(_res.data.fechaUmax*1000);
	_anof=_df.getFullYear();
	_mesf=_df.getMonth();
	
	_cal=document.createElement('div');
	_cal.setAttribute('class','calendario');
	_form.querySelector('#historial').appendChild(_cal);
	
	_c=0;
	while(
			(_ano < _anof) ||
			(_ano <= _anof && _mes <= _mesf)
		){
		
		_actual=new Date(_ano, _mes, _dia, 0, 0, 0, 0);
		_actual=(_actual.getTime()/1000);
		_c++;
		if(_c>50){break;}
		
		if(_mes==12){_mes=0;_ano++;}
		_mes++;
		_dia=1;
		
		_prox=new Date(_ano, _mes, _dia, 0, 0, 0, 0);
		_prox=(_prox.getTime()/1000);
		
		_anchofecha=_prox-_actual;
		_ancho=100*(_anchofecha)/(_anchototal);
		
		_fecha=document.createElement('div');
		_fecha.setAttribute('class','mes');
		_fecha.style.width='calc('+_ancho+'% - 1px)';
		_fecha.style.height=(parseInt(_nf)+2)*30;
		
		_tx=document.createElement('div');
		_tx.setAttribute('class','tx');
		_tx.innerHTML=_ano+'/ '+_NombreMeses[_mes];
		_fecha.appendChild(_tx);
		
		_alin=document.createElement('div');
		_alin.setAttribute('class','alinea');
		_fecha.appendChild(_alin);

		_cal.appendChild(_fecha);
	}
}

function asignarGrupos(){
    //console.log('asignando grupos');
    _filas=document.querySelectorAll('#contenidoextenso .fila');
    
    for(_nn in _filas){
        if(typeof _filas[_nn] != 'object'){continue;}
        if(_filas[_nn].getAttribute('id') == 'filaencabezado'){continue;}
        //console.log(_filas[_nn]);
        
        _idga=_filas[_nn].querySelector('#grupoa').getAttribute('idga');
        
        if(_idga>0){
            if(_DatosGrupos.grupos[_idga].codigo!=''){
                _in=_DatosGrupos.grupos[_idga].codigo;
            }else{
                _in=_DatosGrupos.grupos[_idga].nombre;
            }
            _filas[_nn].querySelector('#grupoa').innerHTML=_in;
        }
        
        _idgb=_filas[_nn].querySelector('#grupob').getAttribute('idgb');
        
        if(_idgb>0){
            if(_DatosGrupos.grupos[_idgb].codigo!=''){
                _in=_DatosGrupos.grupos[_idgb].codigo;
            }else{
                _in=_DatosGrupos.grupos[_idgb].nombre;
            }
            _filas[_nn].querySelector('#grupob').innerHTML=_in;			
        }	
    }
}	

function formularHito(_res){
	
            
    if(_HiId==0){
        document.querySelector('form#general a#submit').innerHTML='crear';
    }else{
        document.querySelector('form#general a#submit').innerHTML='guardar';
    }
    
    document.getElementById('cid').value=_HiId;
    document.getElementById('cnid').innerHTML=_HiId
    document.getElementById('cnombre').value=_Hitos[_HiId].nombre;
    _ga=_Hitos[_HiId].id_p_grupos_id_nombre_tipoa;
    if(_DatosGrupos.grupos[_ga]==undefined){_DatosGrupos.grupos[_ga]=Array();_DatosGrupos.grupos[_ga].nombre='S/D';}
    document.getElementById('cid_p_grupos_id_nombre_tipoa').value=_ga;
    document.getElementById('cid_p_grupos_id_nombre_tipoa-n').value=_DatosGrupos.grupos[_ga].nombre;
        
    _gb=_Hitos[_HiId].id_p_grupos_id_nombre_tipob;
    if(_DatosGrupos.grupos[_gb]==undefined){_DatosGrupos.grupos[_gb]=Array();_DatosGrupos.grupos[_gb].nombre='S/D';}
    document.getElementById('cid_p_grupos_id_nombre_tipob').value=_gb;
    document.getElementById('cid_p_grupos_id_nombre_tipob-n').value=_DatosGrupos.grupos[_gb].nombre;

     _ti=_Hitos[_HiId].id_p_HITtipohito_id_nombre;
    if(_Opciones.id_p_HITtipohito_id_nombre[_ti]==undefined){_Opciones.id_p_HITtipohito_id_nombre[_ti]=Array();_Opciones.id_p_HITtipohito_id_nombre[_ti].nombre='S/D';}
    document.getElementById('cid_p_HITtipohito_id_nombre').value=_ti;
    document.getElementById('cid_p_HITtipohito_id_nombre-n').value=_Opciones.id_p_HITtipohito_id_nombre[_ti].nombre;
    
    _ac=_Hitos[_HiId].id_p_ACTactores_id_nombre;
    if(_Opciones.id_p_ACTactores_id_nombre[_ac]==undefined){_Opciones.id_p_ACTactores_id_nombre[_ac]=Array();_Opciones.id_p_ACTactores_id_nombre[_ac].nombre='S/D';}
    document.getElementById('cid_p_ACTactores_id_nombre').value=_ac;
    document.getElementById('cid_p_ACTactores_id_nombre-n').value=_Opciones.id_p_ACTactores_id_nombre[_ac].nombre;
    
    document.getElementById('cformula').value=_Hitos[_HiId].formula;
    
    document.querySelector('form#general #opmanual').style.display='none';
    document.querySelector('form#general #opformula').style.display='none';
    document.querySelector('form#general #opprevision').style.display='none';
    document.querySelector('form#general #opnuevafecha').style.display='none';
    document.querySelector('form#general #opnuevafecha input').setAttribute('idhit',_HiId);
    
    document.querySelector('form#general [name="fecha_tipo"][value="prevista"]').checked=false;
    document.querySelector('form#general [name="fecha_tipo"][value="efectiva"]').checked=false;
     
    if(_Hitos[_HiId].formula!=''){
        document.querySelector('form#general input[name="origen"][value="opformula"]').checked=true;
    }else if(_HiId!=0){
        document.querySelector('form#general input[name="origen"][value="opmanual"]').checked=true;    
    }                    
    ajustarform();

}


function mostrarHitos(_res){
	_cont=document.querySelector('#contenidoextenso #listado');
	_cont.innerHTML='';
	
	
	if(
		_Modo=='tabla'
	){
	
		generarHitosTabla(_res);
	}else{
		generarHitosGestion(_res);
	}
	
	
	
}


function generarHitosTabla(_res){
	_cont=document.querySelector('#contenidoextenso #listado');
	_tabla=document.createElement('table');
	_cont.appendChild(_tabla);
	
	_the=document.createElement('thead');
	_tabla.appendChild(_the);
	
	_tr=document.createElement('tr');
	_tr.innerHTML='<th>Tipo</th><th>Grupo 1</th><th>Grupo 2</th><th>Tarea</th><th>Fecha</th><th>Estado</th>';
	_the.appendChild(_tr);
	
	for(_ff in _res.data.hitosOrden){
	    _nh=_res.data.hitosOrden[_ff];
	    
	    _dat=_res.data.hitos[_nh];
	                            
	    _tr=document.createElement('tr');
	    _tabla.insertBefore(_tr,_cont.childNodes[1]);
	
	    
		_td=document.createElement('td');
		_tr.appendChild(_td);
	    
	    _td.innerHTML='Estandar';
	    if(_dat.id_p_HITtipohito_id_nombre!='0'&&_dat.id_p_HITtipohito_id_nombre!=''&&_dat.id_p_HITtipohito_id_nombre!=null){
	    	if(_res.data.tiposhitos[_dat.id_p_HITtipohito_id_nombre]!=undefined){
				_td.innerHTML=_dat.id_p_HITtipohito_id_nombre;
	       }
	    }
	    
	    
	    _td=document.createElement('td');
		_tr.appendChild(_td);
	    
	    _dg=_DatosGrupos.grupos[_dat.id_p_grupos_id_nombre_tipoa];
	    if(_dg!=undefined){
	        if(_dg.codigo!=undefined){
	            if(_dg.codigo!=''){
	                _td.innerHTML=_dg.codigo;
	            }else{
	                _td.innerHTML=_dg.nombre;
	            }
	        }else{
	            _td.innerHTML=_dg.nombre;
	        }
	    }
	    
	    _td=document.createElement('td');
		_tr.appendChild(_td);
		
	    _dg=_DatosGrupos.grupos[_dat.id_p_grupos_id_nombre_tipob];	    
	    if(_dg!=undefined){
	    if(_dg.codigo!=undefined){
	        if(_dg.codigo!=''){
	            _td.innerHTML=_dg.codigo;
	        }else{
	            _td.innerHTML=_dg.nombre;
	        }
	    }else{
	        _td.innerHTML=_dg.nombre;
	    }
	    }

	    _td=document.createElement('td');
		_tr.appendChild(_td);	    
	    _td.innerHTML=_dat.nombre;
	    _tr.setAttribute('idhit',_dat.id);
	    
	    /*
	    if(_dat.actor!='undefined'){
	        _clon.querySelector('.actor').innerHTML=_dat.actor;
	    }
	    * */
	    
	    _td=document.createElement('td');
		_tr.appendChild(_td);
		
			    
	    _fff=_dat.fecha.split('-');
	    if(_fff.length==3){
	        _ftx=_fff[2]+'-'+_fff[1]+'-'+_fff[0];
	    }else{
	        _ftx=_dat.fecha;
	        //_clon.querySelector('.fecha').style.fontSize='10px';
	    }
	    
	    _td.innerHTML=_ftx;

	    _td=document.createElement('td');
		_tr.appendChild(_td);	    
	    _td.innerHTML=_dat.estado;
	    _td.setAttribute('class','estado '+_dat.estado);
	    
	    _td.setAttribute('avance',_dat.avance);
	    _td.setAttribute('tipo',_dat.fechatipo);
	    
	    /*
	    if(_dat.formula==''){
	        _clon.querySelector('.opcion').innerHTML='<a onclick="abreFormularioFecha(this)" idhit="'+_nh+'">< actualizar</a>';
	        _clon.querySelector('.opcion').removeAttribute('style');
	    }else{
	    	
	    	_clon.querySelector('.formula').innerHTML="<img title='"+_dat.formula+"' src='./img/calculadora.png'>";
	    	
	    	if(_dat.estado=='vencido'){
	        	_clon.querySelector('.opcion').innerHTML='<a onclick="abreFormularioConfirma(this)" idhit="'+_nh+'">< confirmar</a>';
	            _clon.querySelector('.opcion').removeAttribute('style');	
	    	}else{
	    		_clon.querySelector('.opcion').innerHTML='< confirmado';
	    	}
	    }*/
	}
	document.getElementById('cargainicial').style.display='none';
	probarCargaGrupos();
	
}


function generarHitosGestion(_res){
	
	for(_ff in _res.data.hitosOrden){
	    _nh=_res.data.hitosOrden[_ff];
	    
	    _dat=_res.data.hitos[_nh];
	                            
	    _clon=document.querySelector('#modelos .fila').cloneNode(true);
	    
	    _cont.insertBefore(_clon,_cont.childNodes[0]);
	
	    
	    if(_dat.id_p_HITtipohito_id_nombre!='0'&&_dat.id_p_HITtipohito_id_nombre!=''&&_dat.id_p_HITtipohito_id_nombre!=null){
	    	if(_res.data.tiposhitos[_dat.id_p_HITtipohito_id_nombre]!=undefined){
	            _clon.querySelector('#tipo').title=_res.data.tiposhitos[_dat.id_p_HITtipohito_id_nombre].tipo;
	            _clon.querySelector('#tipo').innerHTML=_dat.id_p_HITtipohito_id_nombre;
	            _clon.querySelector('#tipo').style.cursor='help';
	       }
	    }
	    
	    _clon.querySelector('#grupoa').setAttribute('idga',_dat.id_p_grupos_id_nombre_tipoa);
	    
	    _dg=_DatosGrupos.grupos[_dat.id_p_grupos_id_nombre_tipoa];
	    if(_dg!=undefined){
	        if(_dg.codigo!=undefined){
	            if(_dg.codigo!=''){
	                _clon.querySelector('#grupoa').innerHTML=_dg.codigo;
	            }else{
	                _clon.querySelector('#grupoa').innerHTML=_dg.nombre;
	            }
	        }else{
	            _clon.querySelector('#grupoa').innerHTML=_dg.nombre;
	        }
	    }
	    _clon.querySelector('#grupob').setAttribute('idgb',_dat.id_p_grupos_id_nombre_tipob);
	  
	    _dg=_DatosGrupos.grupos[_dat.id_p_grupos_id_nombre_tipob];
	    
	    if(_dg!=undefined){
	    if(_dg.codigo!=undefined){
	        if(_dg.codigo!=''){
	            _clon.querySelector('#grupob').innerHTML=_dg.codigo;
	        }else{
	            _clon.querySelector('#grupob').innerHTML=_dg.nombre;
	        }
	    }else{
	        _clon.querySelector('#grupob').innerHTML=_dg.nombre;
	    }
	    }
	    _clon.querySelector('.nombre').innerHTML=_dat.nombre;
	    _clon.setAttribute('idhit',_dat.id);
	    
	    if(_dat.actor!='undefined'){
	        _clon.querySelector('.actor').innerHTML=_dat.actor;
	    }
	    _fff=_dat.fecha.split('-');
	    if(_fff.length==3){
	        _ftx=_fff[2]+'-'+_fff[1]+'-'+_fff[0];
	    }else{
	        _ftx=_dat.fecha;
	        _clon.querySelector('.fecha').style.fontSize='10px';
	    }
	    
	    _clon.querySelector('.fecha').innerHTML=_ftx;
	    
	    _clon.querySelector('#estado').innerHTML=_dat.estado;
	    _clon.querySelector('#estado').setAttribute('class','estado '+_dat.estado);
	    
	    _clon.querySelector('#estado').setAttribute('avance',_dat.avance);
	    _clon.querySelector('#estado').setAttribute('tipo',_dat.fechatipo);
	    
	    if(_dat.formula==''){
	        _clon.querySelector('.opcion').innerHTML='<a onclick="abreFormularioFecha(this)" idhit="'+_nh+'">< actualizar</a>';
	        _clon.querySelector('.opcion').removeAttribute('style');
	    }else{
	    	
	    	_clon.querySelector('.formula').innerHTML="<img title='"+_dat.formula+"' src='./img/calculadora.png'>";
	    	
	    	if(_dat.estado=='vencido'){
	        	_clon.querySelector('.opcion').innerHTML='<a onclick="abreFormularioConfirma(this)" idhit="'+_nh+'">< confirmar</a>';
	            _clon.querySelector('.opcion').removeAttribute('style');	
	    	}else{
	    		_clon.querySelector('.opcion').innerHTML='< confirmado';
	    	}
	    }
	}
	document.getElementById('cargainicial').style.display='none';
	probarCargaGrupos();
	
}
