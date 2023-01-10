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

function limpiarSeleccionContrataciones(){
	_fis=document.querySelectorAll('#contenidoextenso .fila.pago');
	for(_n in _fis){
		if(typeof _fis[_n] != 'object'){continue;}
		_fis[_n].setAttribute('selecto','no');
	}
}

function formularPago(_idpag){
	_PagoSelect=_idpag;
	if(_idpag==0){return;}
	_datp=_DataPagos[_idpag];
	

	_trs=document.querySelectorAll('#pagos tbody tr');
	for(_trn in _trs){
		if(typeof _trs[_trn] != 'object'){continue;}
		if(_trs[_trn].getAttribute('idpag')==_idpag){
			_trs[_trn].setAttribute('selecto','selecto');
		}else{
			_trs[_trn].setAttribute('selecto','no');
		}	
	}
	
	_trs=document.querySelectorAll('#contenidoextenso #contrataciones .fila');
	for(_trn in _trs){
		if(typeof _trs[_trn] != 'object'){continue;}
		if(_trs[_trn].getAttribute('idpag')==_idpag){
			_trs[_trn].setAttribute('selecto','si');
		}else{
			_trs[_trn].setAttribute('selecto','no');
		}	
	}
	
	_form=document.querySelector('#formpago');
	_form.querySelector('#pagoid').innerHTML=_idpag;
	_form.querySelector('[name="idpag"]').value=_idpag;
	_form.querySelector('[name="nombre"]').value=_datp.nombre;			
	_form.querySelector('[name="facturado"]').value=_datp.facturado;$('#formpago [name="facturado"]').trigger("change");
	if(_datp.facturado=='1'){_form.querySelector('[name="facturado"]').parentNode.setAttribute('abierto','1')}else{_form.querySelector('[name="facturado"]').parentNode.setAttribute('abierto','-1');}			
	_form.querySelector('[name="monto"]').value=_datp.monto;			
	_form.querySelector('[name="concepto"] option[value="'+_datp.concepto+'"]').selected=true;			
	_form.querySelector('[name="fechaejecucion_tipo"] option[value="'+_datp.fechaejecucion_tipo+'"]').selected=true;_datp.facturado;$('#formpago [name="fechaejecucion_tipo"]').trigger("change");
	_form.querySelector('[name="fechaejecucion"]').value=_datp.fechaejecucion;
	
	if(_datp.conformidadVigente=='0'){
		_form.querySelector('#statconf').innerHTML='Sin Conformidad';
		
		_form.querySelector('#conformidad #dar').style.display='inline-block';
		_form.querySelector('#conformidad #revocar').style.display='none';
		_form.querySelector('#conformidad #ver').style.display='none';
	}else{
		
		_form.querySelector('#conformidad #dar').style.display='none';
		_form.querySelector('#conformidad #revocar').style.display='inline-block';
		_form.querySelector('#conformidad #ver').style.display='inline-block';
		
		_dconf=_DataConformidades[_datp.conformidadVigente];
        _u=_DatosUsuarios.delPanel[_dconf.id_p_usuarios_id];	            
        _form.querySelector('#statconf').innerHTML=_u.nombreusu;
        	           
    	_f = new Date(_dconf.fechau*1000);
    	_dat['fecha']=_f.getFullYear()+'-'+(1+_f.getMonth())+'-'+_f.getDate();
        _e=_dat.fecha.split('-');
        _form.querySelector('#statconf').innerHTML+=' <br> '+parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+' '+_e[0];
	}
	_form.querySelector('[name="num_factura"]').value=_datp.num_factura;

}

function formularContratacion(_idcnt,_idpag){
	
	limpiarSeleccionContrataciones();
		
		
	
	if(document.querySelector('#contenidoextenso .fila.pago[idpag="'+_idpag+'"]')!=null){
		document.querySelector('#contenidoextenso .fila.pago[idpag="'+_idpag+'"]').setAttribute('selecto','si');
	}
	
	_parametros = {
        'panid': _PanId,
        'idcnt':_idcnt,
        'idpag':_idpag,
    };
    _IdCntEdit=_idcnt;
    $.ajax({
        url:   './CNT/CNT_consulta_contratacion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            if(_res.data.proveedores!=undefined){
            _DataProveedores.proveedores=_res.data.proveedores;
            }
            
            _idcnt=_res.data.id;
            _DataProveedores.activos[_res.data.contrataciones[_idcnt].id_p_CNTproveedores]='';
            
            _datacnt=_res.data.contrataciones[_idcnt];
            _DataContrataciones[_idcnt]=_datacnt;
            
            for(_idconf in _res.data.conformidades){
            	_DataConformidades[_idconf]=_res.data.conformidades[_idconf];	
            }
            
            for(_idp in _res.data.pagos){
            	_DataPagos[_idp]=_res.data.pagos[_idp];	
            }
                   
            _form=document.querySelector('form#general');
            
            _als=_form.querySelectorAll('.alertacontratacion');
            for(_an in _als){
            	if(typeof _als[_an] != 'object'){continue;}
            	_als[_an].parentNode.removeChild(_als[_an]);
            }
            
            _form.style.display='block';
            _form.querySelector('input[name="idcnt"]').value=_idcnt;
                   
            for(_campo in _datacnt){                	
            	_inp=_form.querySelector('[name="'+_campo+'"]');
            	if(_inp!=null){
            		if(
            			_inp.tagName=='INPUT'
            			||
            			_inp.tagName=='TEXTAREA'
            		){
            			_inp.value=_datacnt[_campo];
            		}else if(
            			_inp.tagName=='SELECT'
            		){
            			if(_inp.querySelector('option[value="'+_datacnt[_campo]+'"]')==null){continue;}
            			_inp.querySelector('option[value="'+_datacnt[_campo]+'"]').selected='selected';
            		}else if(
            			_inp.tagName=='SPAN'
            		){
            			_inp.innerHTML=_datacnt[_campo];
            		}
            	}
            }
            
            
            if(_datacnt.fechaU >0 && _datacnt.fecha_tipo =='desconocida'){
            	
            	
            	_ref=_form.querySelector('select[name="fecha_tipo"]');
            	_dal=document.createElement('div');
	        	_dal.setAttribute('class','alertacontratacion');
	        	_dal.innerHTML="<img src='./img/signo-alerta.png'>";
	        	_dal.title='Debe definir si la fecha de inicio cargada es una previsión o una confirmación';
	        	_ref.parentNode.insertBefore(_dal,_ref.nextSibling);
	        	
            }
            
             if(_datacnt.fechacerreU >0 && _datacnt.fechacierre_tipo =='desconocida'){
            	
            	
            	_ref=_form.querySelector('select[name="fechacierre_tipo"]');
            	_dal=document.createElement('div');
	        	_dal.setAttribute('class','alertacontratacion');
	        	_dal.innerHTML="<img src='./img/signo-alerta.png'>";
	        	_dal.title='Debe definir si la fecha de cierre cargada es una previsión o una confirmación';
	        	_ref.parentNode.insertBefore(_dal,_ref.nextSibling);
	        	
            }
            
            _form.querySelector('[name="id_p_grupos_tipo_a_n"]').value=_Grupos[_datacnt.id_p_grupos_tipo_a].nombre;
            _form.querySelector('[name="id_p_grupos_tipo_b_n"]').value=_Grupos[_datacnt.id_p_grupos_tipo_b].nombre;
            
            _botonmenos=document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_a"] #menos');
            opcionesMenos(_botonmenos);
            document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_a"] #enpanel').innerHTML='';
            document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_a"] #fueradepanel').innerHTML='';
            
            _botonmenos=document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_b"] #menos');
            opcionesMenos(_botonmenos);
            document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_b"] #enpanel').innerHTML='';
            document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_b"] #fueradepanel').innerHTML='';
            
            for(_ng in _Grupos){	 	
	            if(_Grupos[_ng].tipo=='a'){			            	
	                _cont= document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_a"]');			                
	            }else if(_Grupos[_ng].tipo=='b'){
	                _cont= document.querySelector('form#general div.opciones[for="id_p_grupos_tipo_b"]');
	            }else{
	            	continue;
	            }
	            
	            if(_res.data.gruposdelpanel[_Grupos[_ng].id]!=undefined){
	            	_cont=_cont.querySelector('#enpanel');
	            }else{
	            	_cont=_cont.querySelector('#fueradepanel');
	            }
	            _anc=document.createElement('a');
	            _anc.setAttribute('onclick','opcionar(this)');
	            _anc.setAttribute('idReferencia',_Grupos[_ng].id);
	            _anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
	            _anc.innerHTML= _Grupos[_ng].nombre;
	            _cont.appendChild(_anc);
	        }

			if(_datacnt['fechaU']>0){	
				_f = new Date(_datacnt['fechaU'] * 1000);
				_str=_f.getFullYear()+'-'+pad((1+_f.getMonth()),2)+'-'+pad(_f.getDate(),2);
				
				_form.querySelector('.campo > [name="fecha"]').value=_str;
				console.log('ppp');
				console.log(_form.querySelector('.campo > [name="fecha"]'));
			}
			if(_datacnt['fechacierreU']>0){
				_f = new Date(_datacnt['fechacierreU'] * 1000);
				_str=_f.getFullYear()+'-'+pad((1+_f.getMonth()),2)+'-'+pad(_f.getDate(),2);
				_form.querySelector('.campo > [name="fechacierre"]').value=_str;
			}
	        if(_datacnt.id_p_CNTproveedores>0){
	        	_form.querySelector('input[name="id_p_CNTproveedores_n"]').value=_DataProveedores.proveedores[_datacnt.id_p_CNTproveedores].nombre;
	        }else{
	        	_form.querySelector('input[name="id_p_CNTproveedores_n"]').value='';	
	        }
	        _botonmenos=document.querySelector('form#general div.opciones[for="id_p_CNTproveedores"] #menos');
            opcionesMenos(_botonmenos);
            document.querySelector('form#general div.opciones[for="id_p_CNTproveedores"] #activos').innerHTML='';
            document.querySelector('form#general div.opciones[for="id_p_CNTproveedores"] #inactivos').innerHTML='';
            _cont= document.querySelector('form#general div.opciones[for="id_p_CNTproveedores"]');			             
            
            _cont.querySelector('#activos').innerHTML='';
            _cont.querySelector('#inactivos').innerHTML='';
            
            if(_DataProveedores.proveedores!=undefined){
            for(_np in _DataProveedores.proveedores){
	            _data=_DataProveedores.proveedores[_np];
	            if(_DataProveedores.activos[_data.id]!==undefined){
	            	_ccont=_cont.querySelector('#activos');
	            }else{
	            	_ccont=_cont.querySelector('#inactivos');
	            }
	            _anc=document.createElement('a');
	            _anc.setAttribute('onclick','opcionar(this)');
	            _anc.setAttribute('idReferencia',_data.id);
	            _anc.title=_data.nombre+" _ "+_data.contacto;
	            _anc.innerHTML= _data.nombre;
	            _ccont.appendChild(_anc);
	        }
	        }
	        
	        _form.querySelector('#vinculos #COM #listado').innerHTML='';

		    if(Object.keys(_res.data.comunicaciones).length>0){
		    	_form.querySelector('#vinculos #COM').style.display='block';
		    }else{
		    	_form.querySelector('#vinculos #COM').style.display='none';
		    }
		    for(_idc in _res.data.comunicaciones){
		    	_datcom=_res.data.comunicaciones[_idc];
		    	
		    	_com=document.createElement('a');
		    	_com.setAttribute('class','COMcomunicacion');
		    	_com.setAttribute('gaid',_datcom.idga);
		    	_com.setAttribute('gbid',_datcom.idgb);
		        _com.setAttribute('sentido',_datcom.sentido);
		        _com.setAttribute('estado',_datcom.estado);
		        _com.setAttribute('pnom',_datcom.falsonombre);
		        _com.innerHTML=_datcom.etiqueta;
		        
		        _com.setAttribute('target','blank');
		        _com.setAttribute('href','./COM_gestion.php?idcom='+_idc);
		        
		        _form.querySelector('#vinculos #COM #listado').appendChild(_com);
		        
		        _decom=document.createElement('a');
		        _decom.innerHTML='<span>x</span> - desvincular';
		        _decom.setAttribute('regid',_idc);
		        _decom.setAttribute('class','delink');
		        _decom.setAttribute('onclick','borrarLinkCOM(this)');
		        
		        _form.querySelector('#vinculos #COM #listado').appendChild(_decom);
		    }
		
			_form.querySelector('#vinculos #SEG #listado').innerHTML='';
		    if(Object.keys(_datacnt.acciones).length>0){
		    	_form.querySelector('#vinculos #SEG').style.display='block';
		    }else{
		    	_form.querySelector('#vinculos #SEG').style.display='none';
		    }
		    for(_accn in _datacnt.acciones){
		    	_idacc=_datacnt.acciones[_accn];
		    	_datseg=_res.data.acciones[_idacc];
		    	
		    	_com=document.createElement('a');
		    	_com.setAttribute('class','SEGacciones');
		    	_com.setAttribute('gaid',_datseg.id_p_grupos_tipo_a);
		    	_com.setAttribute('gbid',_datseg.id_p_grupos_tipo_b);
		        _com.setAttribute('estado',_datseg.fechacierretipo);
		        _com.setAttribute('pnom',_datseg.nombre);
		        _com.setAttribute('target','blank');
		        _com.setAttribute('href','./SEG_listado.php?idseg='+_datseg.id_p_tracking_id+'&idacc='+_idacc);
		        
		        _com.innerHTML=_datseg.seguimientonombre;
		        
		        _acc=document.createElement('span');
		        _acc.setAttribute('id','accom');
		        _acc.setAttribute('class','accion');
		        _acc.setAttribute('prioridad',_datseg.prioridad);
		        _acc.innerHTML=_datseg.nombre;
		        _com.appendChild(_acc);
		        
		        _ddd =document.createElement('div');
		        _ddd.setAttribute('class','proxima_fecha');	                    
		        if(_datseg.zz_cache_primera_fechau>0){
		        	_diasfaltan = (_datseg.zz_cache_primera_fechau-_Hoy_unix) / 60 / 60 / 24;
		        	_ddd.setAttribute('diasfaltan',Math.round(_diasfaltan));
		        	if(_diasfaltan < 8 ){
		        		_falta=Math.round(_diasfaltan)+' días';
		        	}else if(_diasfaltan < 30 ){
		        		_falta=Math.round(_diasfaltan/7)+' sem.';
		        	}else{
		        		_falta=Math.round(_diasfaltan/30)+' mes';
		        	}
		        	_ddd.innerHTML=_falta;	
		        	
		            _alerta_max=3;	                    
		            _alerta_min=8;	                    
		            if(_diasfaltan<=_alerta_max){
		            	_alerta_porc=1;
		            }else if(_diasfaltan>=_alerta_min){
		            	_alerta_porc=0;
		            }else{
		            	_alerta_porc=0.2+(_diasfaltan-_alerta_max)*0.8/(8-3);	
		            }
		            _ddd.style.backgroundColor='rgba(255,100,0,'+_alerta_porc+')';
		            	
		        }else{
		        	_ddd.innerHTML='---';
		        }
		        _com.appendChild(_ddd);
        
		        
		        _form.querySelector('#vinculos #SEG #listado').appendChild(_com);
		        
		        _decom=document.createElement('a');
		        _decom.innerHTML='<span>x</span> - desvincular';
		        _decom.setAttribute('regid',_idacc);
		        _decom.setAttribute('class','delink');
		        _decom.setAttribute('onclick','borrarLinkSEG(this)');
		        
		        _form.querySelector('#vinculos #SEG #listado').appendChild(_decom);
		    }
		    
		    
            _form.querySelector('span[name="estado"]').setAttribute('prioridad',_datacnt.prioridad);
            _tabla=_form.querySelector('#pagos tbody');
            _tabla.innerHTML='';
            
            for(_pn in _res.data.pagosOrden){
            	_idp=_res.data.pagosOrden[_pn];
            	//console.log(_pn+': ');
            	_pdat=_res.data.pagos[_idp];
            	//console.log(_pdat);
            	_tr=document.createElement('tr');			
            	_tr.title=_pdat.descripcion;		
            	_tr.setAttribute('idpag',_pdat.id);
            	_tr.setAttribute('class','pago');
            	_tr.setAttribute('estado',_pdat.estado);
            	_tr.setAttribute('prioridad',_pdat.prioridad);
            	_tr.setAttribute('onclick','formularPago("'+_pdat.id+'",event)');
				_tabla.appendChild(_tr);
				
				
            	_td=document.createElement('td');
                _td.setAttribute('class','id');
                _td.innerHTML=_pdat.id;
                _tr.appendChild(_td);
                
                _td=document.createElement('td');
                _td.setAttribute('id','nombre');
                _td.innerHTML=_pdat.nombre;
                _tr.appendChild(_td);
                
                _td=document.createElement('td');
                _td.setAttribute('id','monto');
                _td.innerHTML=_pdat.monto;
                _tr.appendChild(_td);
                
                _td=document.createElement('td');
                _td.setAttribute('class','concepto');
                _td.innerHTML=_pdat.concepto;	
                _tr.appendChild(_td);                        
                
                
                _td=document.createElement('td');
                _td.setAttribute('class','conforme');	                        
                if(_pdat.conformidadVigente=='0'){
                	_td.innerHTML='sin conformidad';
                }else{
                	console.log(_pdat.conformidadVigente);
                	_dconf=_DataConformidades[_pdat.conformidadVigente];
                	console.log(_dconf);
                    _u=_DatosUsuarios.delPanel[_dconf.id_p_usuarios_id];
                    _td.innerHTML=_u.nombreusu;
                	_f = new Date(_dconf.fechau*1000);
                	_dat['fecha']=_f.getFullYear()+'-'+(1+_f.getMonth())+'-'+_f.getDate();
                    _e=_dat.fecha.split('-');
                    _td.innerHTML+=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
                }
                _tr.appendChild(_td);     
                
                _td=document.createElement('td');
                _td.setAttribute('class','factura');
                _td.innerHTML='facturado';                        
                if(_pdat.facturado=='1'){
                	_td.innerHTML='facturó<br>Nº ';
                	_td.innerHTML+=_pdat.num_factura;
                }else{
                	_td.innerHTML='no';
                }   
                _tr.appendChild(_td);     
              
                _td=document.createElement('td');
                _td.setAttribute('class','pagado');	
                _td.innerHTML=_pdat.fechaejecucion_tipo;
                console.log(_pdat.fechaejecucion);
                if(_pdat.fechaejecucion_tipo=='previsto'||_pdat.fechaejecucion_tipo=='ocurrido'){
                	console.log(_pdat.fechaejecucion);
                	_e=_pdat.fechaejecucion.split('-');
                    _td.innerHTML+='<br><span>'+parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0]+'</span>';
                }
                _tr.appendChild(_td);    
             }    
            
            formularPago(_res.data.idpag);

        }
    });    
}

function mostarListado(_res){
	
    document.querySelector('#contenidoextenso #contrataciones').innerHTML='';
    
    for(_np in _res.data.pagosOrden_prioridad){
    	_idpag=_res.data.pagosOrden_prioridad[_np];
    	_pdat=_res.data.pagos[_idpag];
    	_idcnt=_pdat.id_p_CNTcontrataciones_id;
        _dat=_res.data.contrataciones[_idcnt];

        _fila=document.createElement('div');
        _fila.setAttribute('class','fila pago');
        _fila.setAttribute('filtroB','ver');
        _fila.setAttribute('onclick','formularContratacion(this.getAttribute("idcnt"),this.getAttribute("idpag"))');
        
        _fila.setAttribute('idresp',_dat.id_p_usuarios_responsable);
        _fila.setAttribute('idpag',_pdat.id);
        _fila.setAttribute('idcnt',_idcnt);
        
        document.querySelector('#contenidoextenso #contrataciones').appendChild(_fila);
        
        	                    
        _ddd=document.createElement('div');
        _ddd.setAttribute('class','contenido idpag');
        _ddd.innerHTML=_idpag;
        _fila.appendChild(_ddd);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_grupos_tipo_a');
        	                    
        if(_Grupos[_dat.id_p_grupos_tipo_a]==undefined){
        	_Grupos[_dat.id_p_grupos_tipo_a]={
        		'codigo':'err',
        		'nombre':'error, no encontrado'
        	}
        }
        
        
        if(_Grupos[_dat.id_p_grupos_tipo_a].codigo!=''){
        	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_a].codigo;	
        	_ddd.title=_Grupos[_dat.id_p_grupos_tipo_a].nombre;
        }else{
        	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_a].nombre;
        }	                    
        _fila.appendChild(_ddd);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido id_p_grupos_tipo_b');
        
        if(_Grupos[_dat.id_p_grupos_tipo_b]==undefined){
        	_Grupos[_dat.id_p_grupos_tipo_b]={
        		'codigo':'err',
        		'nombre':'error, no encontrado'
        	}
        }
        
        if(_Grupos[_dat.id_p_grupos_tipo_b].codigo!=''){
        	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_b].codigo;	
        	_ddd.title=_Grupos[_dat.id_p_grupos_tipo_b].nombre;
        }else{
        	_ddd.innerHTML=_Grupos[_dat.id_p_grupos_tipo_b].nombre;
        }	                    
        _fila.appendChild(_ddd);
        
        _aaa =document.createElement('a');
        _aaa.setAttribute('idcnt',_idcnt);
        _aaa.setAttribute('class','contenido nombre');
        _aaa.setAttribute('estado',_dat.estado);
        
        _aaa.title=_dat.nombre;
        _aaa.innerHTML=_dat.nombre;
        _fila.appendChild(_aaa);
        
        if(_dat.estado=='carga incompleta'){
        	_dal=document.createElement('div');
        	_dal.setAttribute('class','alertacontratacion');
        	_dal.innerHTML="<img src='./img/signo-alerta.png'>";
        	_dal.title='Información faltante';
        	_aaa.appendChild(_dal);      	
        }
        
        if(_dat.fechacierre_tipo=='efectiva' && _dat.fechacierreU>0){
        	_fila.setAttribute('estado','finalizado');
        	_sp =document.createElement('span');
	        _sp.setAttribute('class','aclaracion');
	        _aaa.appendChild(_sp);
        	
			_f = new Date(_dat['fechacierreU'] * 1000);
			_f=_f.getFullYear()+'-'+(1+_f.getMonth())+'-'+_f.getDate();
	        _e=_f.split('-');
	        _sp.innerHTML='terminó '+parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+' '+_e[0];
		}
    
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido proveedor');
        if(_DataProveedores.proveedores[_dat.id_p_CNTproveedores]!=undefined){
        	_ddd.innerHTML=_DataProveedores.proveedores[_dat.id_p_CNTproveedores].nombre+' '+_DataProveedores.proveedores[_dat.id_p_CNTproveedores].contacto;
        }
        _fila.appendChild(_ddd);
        
        	                    	                    
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido pago');
        _ddd.innerHTML=_pdat.nombre;
        _ddd.innerHTML+='<br>('+_pdat.concepto+')';
        _ddd.innerHTML+='<br>$'+_pdat.monto+'-';
        _fila.appendChild(_ddd);
       

		_ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido factura');
        
        if(_pdat.facturado==0){
        	_ddd.innerHTML='no facturó';
        }else{
        	_ddd.innerHTML='facturó';
            _ddd.innerHTML+='<br>Nº '+_pdat.num_factura;
        }
        _fila.appendChild(_ddd);
        
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido conformidad');	                    
        if(_pdat.conformidadVigente=='0'){
        	_ddd.innerHTML='sin conformidad';
        }else{
        	
        	_dconf=_DataConformidades[_pdat.conformidadVigente];
        	_f = new Date(_dconf.fechau*1000);
        	_dat['fecha']=_f.getFullYear()+'-'+(1+_f.getMonth())+'-'+_f.getDate();
            _e=_dat.fecha.split('-');
            _ddd.innerHTML=parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+'<br>'+_e[0];
            
            _u=_DatosUsuarios.delPanel[_dconf.id_p_usuarios_id];
            
            _ddd.innerHTML=_u.nombreusu;
        }
        _fila.appendChild(_ddd);
            
        _ddd=document.createElement('div');
        _ddd.setAttribute('class','contenido pagado');	
        
        _ddd.innerHTML=_pdat.fechaejecucion_tipo;
        
        if(_pdat.fechaejecucion_tipo=='previsto'&&_pdat.fechaejecucion<_Hoy){
        	_ddd.innerHTML='vencido';
        }
        
        if(_ddd.innerHTML=='efectivo'){_ddd.innerHTML='ocurrió';}
        //console.log(_pdat.fechaejecucion);
        if(_pdat.fechaejecucion_tipo=='previsto'||_pdat.fechaejecucion_tipo=='efectivo'){
        	//console.log(_pdat.fechaejecucion);
        	_e=_pdat.fechaejecucion.split('-');
            _ddd.innerHTML+='<br><span>'+parseInt(_e[2])+' '+MesNaMesTxCorto(_e[1])+' '+_e[0]+'</span>';
        }
        _fila.appendChild(_ddd); 
        
        _ddd=document.createElement('div');
        _ddd.setAttribute('class','iconopago');
        _ddd.setAttribute('estado',_pdat.fechaejecucion_tipo);
        if(_pdat.fechaejecucion_tipo=='efectivo'){
	        _iii=document.createElement('img');
	        _iii.setAttribute('src','./img/check-sinborde_hd.png');
	        _ddd.appendChild(_iii);
        }else if(_pdat.fechaejecucion_tipo=='previsto'&&_pdat.fechaejecucion<_Hoy){
        	_iii=document.createElement('img');
	        _iii.setAttribute('src','./img/signo-alerta.png');
	        _ddd.setAttribute('estado','vencido');
	        _ddd.appendChild(_iii);
        }
        _fila.appendChild(_ddd); 
    }
    
    asignarFiltroUsuario(_Filtros.usuario);
    tecleaBusqueda('','');
    	
}



function deformularAcciones(){
	_sels=document.querySelectorAll('form#general #acciones [selecta="si"]');
    for(_ns in _sels){
    	if(typeof _sels[_ns] != 'object'){continue;}
    	_sels[_ns].removeAttribute('selecta');
    }
}
		
function formularAccion(_idacc,_event){
				
	_event.stopPropagation();
	_parametros = {
        'panid': _PanId,
        'idacc': _idacc,
        'idcnt':_IdCntEdit
    };
    
    $.ajax({
        url:   './CNT/CNT_consulta_accion.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            _accid=_res.data.idacc;
            _IdAccEdit=_accid;
            
            
            _sels=document.querySelectorAll('form#general #acciones [selecta="si"]');
            for(_ns in _sels){
            	if(typeof _sels[_ns] != 'object'){continue;}
            	_sels[_ns].removeAttribute('selecta');
            }
            	                
            _item=document.querySelector('form#general #acciones [idacc="'+_accid+'"]');
            if(_item!= undefined){_item.setAttribute('selecta','si')}
            
            _dataacc=_res.data.accion;
            
            if(_dataacc.zz_suspendida=='0'){
            	document.querySelector('form#accion .suspender').style.display='block';
            	document.querySelector('form#accion .desuspender').style.display='none';
            }else{
            	document.querySelector('form#accion .suspender').style.display='none';
            	document.querySelector('form#accion .desuspender').style.display='block';
            }
            
            _DataSeguimientos[_IdCntEdit]['acciones'][_accid]=_dataacc;
            
            _form=document.querySelector('form#accion');
            _form.style.display='block';
            _form.querySelector('input[name="idacc"]').value=_accid;
            
            
             _form.querySelector('#candidatos #listado').innerHTML='';
             for(_hatch in _AccionesFrecuentes){
             	_dat=_AccionesFrecuentes[_hatch];
             	if(_dat.cant>2){_peso='alto';}else{_peso='bajo';}
             	
             	_item=document.createElement('div');
             	_item.innerHTML=_dat.muestra;
             	_item.setAttribute('peso',_peso);
             	_item.setAttribute('hatch',_hatch);
             	_item.setAttribute('onclick','cargarCandidatoAccion(this)');
             	_form.querySelector('#candidatos #listado').appendChild(_item);
             }
            
            
            
            for(_campo in _dataacc){                	
            	_inp=_form.querySelector('[name="'+_campo+'"]');
            	
            	if(_inp!=null){
            		if(
            			_inp.tagName=='INPUT'
            			||
            			_inp.tagName=='TEXTAREA'
            		){
            			_inp.value=_dataacc[_campo];
            		}else if(
            			_inp.tagName=='SELECT'
            		){
            			if(_inp.querySelector('option[value="'+_dataacc[_campo]+'"]')==null){continue;}
            			_inp.querySelector('option[value="'+_dataacc[_campo]+'"]').selected='selected';
            		}else if(
            			_inp.tagName=='SPAN'
            		){
            			_inp.innerHTML=_dataacc[_campo];
            		}
            	}
            	
            	
            }
            
       		_form.querySelector('span[name="estado"]').setAttribute('prioridad',_dataacc.prioridad);	
				                                           
            if(_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor]==undefined){
            	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML='-';	
            }else{
            	_form.querySelector('span[name="id_p_usuarios_autor"]').innerHTML=_DatosUsuarios.delPanel[_dataacc.id_p_usuarios_autor].nombreusu;
            }
            
            _form.querySelector('#adjuntoslista').innerHTML='';
            for(_na in _dataacc.adjuntos){
            	_daj=_dataacc.adjuntos[_na];	 
            	 anadirAdjunto(_daj);	                	
            }
        }
    });    
}

function anadirAdjunto(_daj){	                	
        	_div=document.createElement('div');
        	_div.setAttribute('class','adjunto');
        	_div.setAttribute('ruta',_daj.FI_documento);
        	_div.setAttribute('idadj',_daj.id);
        	_div.setAttribute('onclick','mostrarAdjunto(this)');
        	
        	_img=document.createElement('img');
        	_img.setAttribute('src',_daj.FI_muestra);
        	_div.appendChild(_img)
        	
        	_epi=document.createElement('div');
        	_epi.setAttribute('class','epigrafe');
        	_epi.innerHTML=_daj.nombre;
        	_div.appendChild(_epi);
        	
        	_borr=document.createElement('a');
        	_borr.setAttribute('class','elimina');
        	_borr.setAttribute('onclick','eliminaAdjunto(this,event)');
        	_borr.innerHTML='x';
        	_borr.title='Eliminar este adjunto';
        	_div.appendChild(_borr);
        	
        	document.querySelector('form#accion #adjuntoslista').appendChild(_div);
		}
		
function formularProveedor(_idprov,_event){
	console.log(_idprov);
	document.querySelector('form#general [name="id_p_CNTproveedores"]').value=_idprov;
	document.querySelector('form#general [name="id_p_CNTproveedores_n"]').value=_DataProveedores.proveedores[_idprov].nombre;
	
	_form=document.querySelector('form#proveedor');
	_form.style.display='block';
	
	_form.querySelector('[name="idprov"]').value=_DataProveedores.proveedores[_idprov].id;
	_form.querySelector('[name="nombre"]').value=_DataProveedores.proveedores[_idprov].nombre;
	_form.querySelector('[name="contacto"]').value=_DataProveedores.proveedores[_idprov].contacto;
	_form.querySelector('[name="cuit"]').value=_DataProveedores.proveedores[_idprov].cuit;
	_form.querySelector('[name="descripcion"]').value=_DataProveedores.proveedores[_idprov].descripcion;
	_form.querySelector('[name="telefonos"]').value=_DataProveedores.proveedores[_idprov].telefonos;		
	_form.querySelector('[name="mail"]').value=_DataProveedores.proveedores[_idprov].mail;
	
}

		 
function mostrarFormularioCntVinculosCom(_datacnt){
	_form=document.querySelector('form#general');
	_form.querySelector('#vinculos #COM #listado').innerHTML='';
    if(Object.keys(_datacnt.contrataciones).length>0){
    	_form.querySelector('#vinculos #COM').style.display='block';
    }else{
    	_form.querySelector('#vinculos #COM').style.display='none';
    }
    for(_idc in _datacnt.comunicaciones){
    	console.log(_idc);
    	_datcom=_datacnt.comunicaciones[_idc];
    	
    	_com=document.createElement('a');
    	_com.setAttribute('class','COMcomunicacion');
    	_com.setAttribute('gaid',_datcom.idga);
    	_com.setAttribute('gbid',_datcom.idgb);
        _com.setAttribute('sentido',_datcom.sentido);
        _com.setAttribute('estado',_datcom.estado);
        _com.setAttribute('pnom',_datcom.falsonombre);
        _com.innerHTML=_datcom.etiqueta;
        
        _com.setAttribute('target','blank');
        _com.setAttribute('href','./COM_gestion.php?idcom='+_idc);
        
        _form.querySelector('#vinculos #COM #listado').appendChild(_com);
        
        _decom=document.createElement('a');
        _decom.innerHTML='<span>x</span> - desvincular';
        _decom.setAttribute('regid',_idc);
        _decom.setAttribute('class','delink');
        _decom.setAttribute('onclick','borrarLinkCOM(this)');
        
        _form.querySelector('#vinculos #COM #listado').appendChild(_decom);
    }
}
	
	
function mostrarFormularioCntVinculosSeg(_datacnt){	
	_form=document.querySelector('form#general');
	_form.querySelector('#vinculos #SEG #listado').innerHTML='';
    if(Object.keys(_datacnt.acciones).length>0){
    	_form.querySelector('#vinculos #SEG').style.display='block';
    }else{
    	_form.querySelector('#vinculos #SEG').style.display='none';
    }
    for(_idacc in _datacnt.acciones){
    	_datseg=_datacnt.acciones[_idacc];
    	
    	_com=document.createElement('a');
    	_com.setAttribute('class','SEGacciones');
    	_com.setAttribute('gaid',_datseg.id_p_grupos_tipo_a);
    	_com.setAttribute('gbid',_datseg.id_p_grupos_tipo_b);
        _com.setAttribute('estado',_datseg.fechacierretipo);
        _com.setAttribute('pnom',_datseg.nombre);
        _com.setAttribute('target','blank');
        _com.setAttribute('href','./SEG_listado.php?idseg='+_datseg.id_p_tracking_id+'&idacc='+_idacc);
        
        _com.innerHTML=_datseg.seguimientonombre;
        
        _acc=document.createElement('span');
        _acc.setAttribute('id','accom');
        _acc.setAttribute('class','accion');
        _acc.setAttribute('prioridad',_datseg.prioridad);
        _acc.innerHTML=_datseg.nombre;
        _com.appendChild(_acc);
        
        _ddd =document.createElement('div');
        _ddd.setAttribute('class','contenido proxima_fecha');	                    
        if(_datseg.zz_cache_primera_fechau>0){
        	_diasfaltan = (_datseg.zz_cache_primera_fechau-_Hoy_unix) / 60 / 60 / 24;
        	_ddd.setAttribute('diasfaltan',Math.round(_diasfaltan));
        	if(_diasfaltan < 8 ){
        		_falta=Math.round(_diasfaltan)+' días';
        	}else if(_diasfaltan < 30 ){
        		_falta=Math.round(_diasfaltan/7)+' sem.';
        	}else{
        		_falta=Math.round(_diasfaltan/30)+' mes';
        	}
        	_ddd.innerHTML=_falta;	
        	
            _alerta_max=3;	                    
            _alerta_min=8;	                    
            if(_diasfaltan<=_alerta_max){
            	_alerta_porc=1;
            }else if(_diasfaltan>=_alerta_min){
            	_alerta_porc=0;
            }else{
            	_alerta_porc=0.2+(_diasfaltan-_alerta_max)*0.8/(8-3);	
            }
            _ddd.style.backgroundColor='rgba(255,100,0,'+_alerta_porc+')';
            	
        }else{
        	_ddd.innerHTML='---';
        }
        _com.appendChild(_ddd);

        
        _form.querySelector('#vinculos #SEG #listado').appendChild(_com);
        
        _decom=document.createElement('a');
        _decom.innerHTML='<span>x</span> - desvincular';
        _decom.setAttribute('regid',_idacc);
        _decom.setAttribute('class','delink');
        _decom.setAttribute('onclick','borrarLinkSEG(this)');
        
        _form.querySelector('#vinculos #SEG #listado').appendChild(_decom);
    }
    
}
	
