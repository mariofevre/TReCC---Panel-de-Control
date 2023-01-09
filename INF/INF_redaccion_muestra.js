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


function renderCaratula(){
		
		var css = document.createElement( "style" );
		css.type = "text/css";
		css.innerHTML = _resS.modelo.css;
		document.getElementsByTagName( "head" )[0].appendChild( css );
		
		if(_resS.modelo.caratulamodo=='sin caratula'){return;}
			
		
		_hc=document.createElement('div');
		
		if(_resS.modelo.caratulamodo=='pagina'){
			_hc.setAttribute('class','hoja caratula');
			document.getElementById('informe').appendChild(_hc);
		}else{
						
			_cont=document.getElementById('contenidoBase');		
			_nnparr++;
			_hc=document.createElement('div');
			_cont.appendChild(_hc);
			_hc.setAttribute('id',"parrafoprecarga"+_nnparr);
			_hc.setAttribute('class',"precarga");
			
			
			_hc.setAttribute('idsecc','00');
			_hc.setAttribute('idcomp','00');		
			if(_resS.modelo.caratulamodo=='media pagina'){
				_hc.setAttribute('tipo',"caratulamedia");
			}
			if(_resS.modelo.caratulamodo=='flexible'){
				_hc.setAttribute('tipo',"caratulaflexible");
			}
				
		}
		
		
		_hc.innerHTML=_resS.modelo.caratulahtml;
		
		if(_resS.modelo.caratulahtml==''){
			_hc.style.display='none';
		}
		
		_arr=document.querySelectorAll("#hojaBase [name='Ninforme'], #informe [name='Ninforme'], #HojaModelo [name='Ninforme']");
		for(_nn in _arr){
			_arr[_nn].innerHTML=_resS.norden;
			_arr[_nn].innerHTML=_resS.norden;
		}

		_meses=Array('','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre');
		
		_arr=document.querySelectorAll("#hojaBase [name='Nfecha'], #informe [name='Nfecha'], #HojaModelo [name='Nfecha']");
		for(_nn in _arr){
			
			_f=_resS.presentacion.split('-');
			
			_arr[_nn].innerHTML= parseInt(_f[2]) + ' de ' + _meses[parseInt(_f[1])] + ' de ' + _f[0];
		}
		
		_arr=document.querySelectorAll("#hojaBase [name='Nmesano'], #informe [name='Nmesano'], #HojaModelo [name='Nmesano']");
		for(_nn in _arr){
			
			_f=_resS.presentacion.split('-');
			
			_arr[_nn].innerHTML= _meses[parseInt(_f[1])] + ' de ' + _f[0];
		}
		
		
		
		_arr=document.querySelectorAll("#hojaBase [name='Nantemesano'], #informe [name='Nantemesano'], #HojaModelo [name='Nantemesano']");
		for(_nn in _arr){			
			_f=_resS.presentacion.split('-');
			_f[1]=_f[1]-1;
			if(_f[1]==0){_f[1]=12;_f[0]--;}
			
			_arr[_nn].innerHTML= _meses[parseInt(_f[1])] + ' de ' + _f[0];
		}
		
		_arr =document.querySelectorAll("#hojaBase [name='Nimagen'], #informe [name='Nimagen'], #HojaModelo [name='Nimagen']"); // numera las hojas reemplazando el contenido html de todos los elementos con name 'Nhoja' 
		var length = _arr.length;
		if(_resS.Nimagen != undefined){
		    element = null;
			for (var i = 0; i < length; i++) {
			  element = _arr[i];
			  element.setAttribute('src',_resS.Nimagen);
			}
		}
		_fhc=document.createElement('form');
		_fhc.setAttribute('extraclase','aux');
		_hc.appendChild(_fhc);
		
		_fhc.innerHTML ="<input type='button' value='añadir imagen carátula' onclick='activarCargarJpgCarat(this);' InTi='activa'>";
		_fhc.innerHTML+="<input style='display:none' type='button' value='guardar' onclick='cargarJpgCarat(this);' InTi='anade'>";
		_fhc.innerHTML+="<input style='display:none' type='button' value='cancelar' onclick='desactivarCargarJpgCarat(this);' InTi='desactiva'>";
		_fhc.innerHTML+="<label style='display:none'>epígrafe:</label>";
		_fhc.innerHTML+="<input style='display:none;width:200px;' type='text' name='epigrafe' InTi='data'>";
		_fhc.innerHTML+="<input id='upload' style='display:none;width:250px;' type='file' name='archivo_F' InTi='data'>";
		_fhc.innerHTML+="<input style='display:none;width:250px;' type='hidden' name='id_p_INFsecciones_id' InTi='data' value='00'>";
		
	}
	
	

function procesarParrafos(){
		//toma el componente actual del indorme definido por _avanceS y _avanceP (key seccion y key parrafo); 
		console.log(" ks: "+_avanceS+" kp: "+_avanceP);

		if(typeof _resS.seccionesOrden[_avanceS] =='undefined'){
			console.log('terminado carga y presentacion de contenidos');
			
			if(_ModoEdicion=='no'){
				document.querySelector('#botoneraV2 #estado #tx').innerHTML='compaginando';
				INICIAPAG();
			}else{
				document.querySelector('#botoneraV2 #estado #tx').innerHTML='terminada la generación de contenidos. disponible el botón de terminar edicion para compaginar';
				renderBotonImprimir();
			}
			return;
		}else{
		
            _seccid=_resS.seccionesOrden[_avanceS];
            
            
            if(typeof _resS.secciones[_seccid].parrafos != undefined){	
			
                //console.log(_res.secciones[_key].parrafos);ó
                
                console.log(_resS.secciones[_seccid].nombre);
                if(_resS.secciones[_seccid].parrafos.length>0){
                    
                    _idsecc=_resS.secciones[_seccid].idseccion;
                    _idcomp=_resS.secciones[_seccid].parrafos[_avanceP].idcomp;
                    
                    //console.log('hay parrafos');
                    
                    
                    if(_avanceP==0){
                        _terminarseccion='no';
                        _extraclase='';
                        
                        _resS.secciones[_seccid].estado="";
                        
                        if(_resS.secciones[_seccid].seccionhasta!='0000-00-00'&&_resS.secciones[_seccid].seccionhasta<_fechaPresentacion){
                            _extraclase='aux';
                            _resS.secciones[_seccid].estado=" ... discontinuado desde " + _resS.secciones[_seccid].seccionhasta;
                            _terminarseccion='si';	
                        }
                        
                        if(_resS.secciones[_seccid].secciondesde!='0000-00-00'&&_resS.secciones[_seccid].secciondesde>_fechaPresentacion){
                            _extraclase='aux';	
                            _resS.secciones[_seccid].estado=" ... a incorporar a partir de " + _resS.secciones[_seccid].secciondesde;
                            _terminarseccion='si';	
                        }
                        
                        //alert('tit: '+_resS.secciones[_seccid].nombre);
                                    
                        representarTitulo(
                            _resS.secciones[_seccid].nombre,
                            _resS.secciones[_seccid].idseccion,
                            _resS.secciones[_seccid].orden,
                            _extraclase,
                            _resS.secciones[_seccid].estado,
                        );			
                        
                        
                        if(_terminarseccion=='si'){
                            _avanceP=0;
                            _avanceS=_avanceS+1;
                            procesarParrafos();
                            return;
                        }
                    }
                        
                        
                    if(
                        _resS.secciones[_seccid].parrafos[_avanceP].tipo =='textoeditor'
                    ){
                        representarEditorTx();
                    }else if(_resS.secciones[_seccid].parrafos[_avanceP].tipo =='imageneditor'){
                        representarEditorImg();
                    }
                    
                    
                    if(
                        (_resS.secciones[_seccid].parrafos[_avanceP].formula!=undefined &&_resS.secciones[_seccid].parrafos[_avanceP].formula!='')
                        || _resS.secciones[_seccid].parrafos[_avanceP].tipo =='hitos'
                        || _resS.secciones[_seccid].parrafos[_avanceP].tipo =='comunicaciones'
                        || _resS.secciones[_seccid].parrafos[_avanceP].tipo =='documentacion'
                    ){
                        
                        //console.log('hay consulta');	
                        _formula=_resS.secciones[_seccid].parrafos[_avanceP].formula;
                        
                        var parametros = {
                            "tipo" : _resS.secciones[_seccid].parrafos[_avanceP].tipo,
                            "formula" : _formula,
                            "Freportedesde" : _resS.reporteDesdeFin,
                            "Freportehasta" : _resS.reporteHastaFin,
                            "idinforme":_IdInforme,
                            "numinforme":_NumInforme,
                            "idmodelo":_IdModelo
                        };
                        
                        _iim=document.createElement('img');
                        _iim.setAttribute('src','img/cargando.gif');
                        _iim.setAttribute('id','cargando');
                        document.getElementById('contenidoBase').appendChild(_iim);			
                        _iiM=_iim.cloneNode(true);
                        document.querySelector('#botoneraV2 #estado #im').appendChild(_iiM);
                        document.querySelector('#botoneraV2 #estado #tx').innerHTML='..generando contenido '+_resS.secciones[_seccid].parrafos[_avanceP].tipo;
                        //console.log('por consultar');		
                        
                        //alert(_resS.secciones[_seccid].parrafos[_avanceP].tipo+" "+_resS.secciones[_seccid].parrafos[_avanceP].formula);
                        _botComp=document.createElement('div');
                        _botComp.setAttribute('class','componenteOrg');
                        _botComp.setAttribute('idcomp',_idcomp);
                        _botComp.setAttribute('idsecc',_idsecc);
                        _botComp.setAttribute('onclick',"editarComponente(this)");
                        _botComp.setAttribute('title',_resS.secciones[_seccid].parrafos[_avanceP].formula);
                        _botComp.innerHTML= _resS.secciones[_seccid].parrafos[_avanceP].tipo+"<div class='bordesuperior'></div>";					
                        document.getElementById('contenidoBase').appendChild(_botComp);
                        
                        $.ajax({
                            data:  parametros,
                            url:   './INF/INF_procesar_componente.php',
                            type:  'post',
                            success:  function (response){
                            	
                            	_resF = PreprocesarRespuesta(response);
                                console.log('procesando compoente: ');                            	
                                _gg=document.getElementById('cargando');
                                _gg.parentNode.removeChild(_gg);
                                
                                document.querySelector('#botoneraV2 #estado #im').innerHTML='';
                                document.querySelector('#botoneraV2 #estado #tx').innerHTML='';
                                //console.log(_resF);
                                representarParrafos(_resF);
                                        
                            },
                            error: function (){
                                _gg=document.getElementById('cargando');
                                _gg.parentNode.removeChild(_gg);
                                document.querySelector('#botoneraV2 #estado #im').innerHTML='';
                                document.querySelector('#botoneraV2 #estado #tx').innerHTML='';
                                alert('ERROR al consultar contenido. carga del informe interumpuda');
                            }
                        });						
                        
                    }else if(_resS.secciones[_seccid].parrafos[_avanceP].tipo =='texto'){
                        
                        _resF={'data':[_resS.secciones[_seccid].parrafos[_avanceP]]};         
                        representarParrafos(_resF);
                        
                    }else if(
                    	
                        _resS.secciones[_seccid].parrafos[_avanceP].tipo =='imagen' 
                       /* && 
                        _resS.secciones[_seccid].parrafos[_avanceP].modo!='mosaico'
                        && 
                        _resS.secciones[_seccid].parrafos[_avanceP].modo!='mosaico4'*/
                        ){
                        	
                        _resF={'data':[
                        	{
                        		'tipo':'imagen',
                        		'modo':_resS.secciones[_seccid].parrafos[_avanceP].modo,
                        		'data':_resS.secciones[_seccid].parrafos[_avanceP].data
	                        }                 	
                        ]}; 
                        
                        representarParrafos(_resF);
                        	/*
                        _resF=Array();
                        _resF.tipo='imagen';
                        _resF.att=Array();
                        _resF.att.class=_resS.secciones[_seccid].parrafos[_avanceP].extraclase;
                        _resF.att.src=_resS.secciones[_seccid].parrafos[_avanceP].path;*/
                        
                        console.log(_resF);
                        representarParrafos(_resF);
                        
                    }else{
						/*
                        _resF={
                        	'data':[_resS.secciones[_seccid].parrafos[_avanceP]],
                        	'tipo':'imagenes'
                        };
                        
                        representarParrafos(_resF);
                        */
                       representarParrafos(Array());
                    }
                }else{
                    representarParrafos(Array());
                }
			
			}else{
                representarParrafos(Array());
            }   
		}
	}
	
	

function representarParrafos(_resF){
		console.log(_resF);
		if(_resS.seccionesOrden[_avanceS]==undefined){return;}
		_seccid=_resS.seccionesOrden[_avanceS];		
		//console.log('id seccion: '+_seccid);
		//console.log('avanceS: '+_avanceS);
		//console.log(_resS.secciones[_seccid].nombre);
		
		if(_resF.tipo!=undefined){
		
			if(_resF.tipo=='textoeditor'){
				representarEditorTx();
			}else if(_resF.tipo=='imageneditor'){
				representarEditorImg();
			}else if(_resF.tipo=='imagen'){
				//console.log('esimagen');
				representarParrafoImagen(_resF);
			}else if(_resF.tipo=='fechas'){
				representarParrafoFormateado(_resF.data);
			}else if(_resF.tipo==''){
				representarParrafoFormateado(_resF.tx);
			}else if(_resF.tipo=='tabla'){
				representarParrafoTabla(_resF.tabla);
			}
		
		}else if(_resF.data!=undefined){
			
			if(_resF.data.length>0){
				
				for(_cc in _resF.data){	
					//alert('?00');		
					_tipo=_resF.data[_cc].tipo;
					console.log(_tipo);
					if(_tipo=='parrafos'){
						representarParrafosParrafos(_resF.data[_cc].data);
					}else if(_tipo=='texto'){
                        representarParrafoTexto(_resF.data[_cc].data);
                    }else if(_tipo=='tituloobjeto'){
						representarParrafosTituloobjeto(_resF.data[_cc]);
					}else if(_tipo=='tabla'){
						representarParrafoTabla(_resF.data[_cc]);
					}else if(_tipo=='lista'){
						representarParrafoLista(_resF.data[_cc]);
					}else if(_tipo=='imagen'){
						representarParrafoImagen(_resF.data[_cc]);
					}else if(_tipo=='grafico'){						
						representarParrafoGrafico(_resF.data[_cc].data);
					}else{
						//alert('error al interpretar contenido devuelto');
						console.log('error al interpretar contenido devuelto: '+_tipo);
					}										
				}				
			}
		}else{			
			console.log('no se interpretó un contenido mostrable.');
		}
		
		//console.log('id seccion: '+_seccid);
		//console.log(_resS.secciones[_seccid]);
		if(_resS.secciones[_seccid].parrafos.length>(_avanceP+1)){
			_avanceP=_avanceP+1;						
		}
		else{
			_avanceP=0;
			_avanceS=_avanceS+1;						
		}
		procesarParrafos();
		
	}
	


	function representarEditorTx(){
		_cont=document.getElementById('contenidoBase');
					
		_nnparr++;
		
		_botComp=document.createElement('div');
		_botComp.setAttribute('class','componenteOrg');
		_botComp.setAttribute('idcomp',_idcomp);
		_botComp.setAttribute('idsecc',_idsecc);
		_botComp.setAttribute('onclick','editordetextoAct(this)');
		_botComp.innerHTML= 'editar texto'+"<div class='bordesuperior'></div>";					
		_cont.appendChild(_botComp);
		
	}


	function representarEditorImg(){		
		
		_cont=document.getElementById('contenidoBase');
					
		_nnparr++;

		_botComp=document.createElement('div');
		_botComp.setAttribute('class','componenteOrg');
		_botComp.setAttribute('idcomp',_idcomp);
		_botComp.setAttribute('idsecc',_idsecc);
		_botComp.setAttribute('onclick','editordeimagenAct(this.getAttribute("idsecc"))');
		_botComp.innerHTML= 'editar imagen'+"<div class='bordesuperior'></div>";					
		_cont.appendChild(_botComp);
			
	}
	


function editordetextoCargar(_res){
        _idseccion=_res.data.seccion;
		var editor = tinymce.get('mce_redacc'); // use your own editor id here - equals the id of your textarea
		editor.setContent('');	
		
		document.getElementById('editordetexto').querySelector('input[name="id_p_INFsecciones_id"]').value=_idseccion;
		document.getElementById('editordetexto').querySelector('input[name="id_p_INFinforme_id"]').value=_IdInforme;	
			
		if(_res.data.textos.length==0){
			//no hay textos previos, guardar deberá crear uno nuevo
			document.getElementById('editordetexto').querySelector('input[name="id"]').value='nid';
		}else{
			_tx=document.createElement('div');
			_tx.innerHTML=_res.data.textos[0].texto;
			while(_tx.querySelector('.precarga')!=null){
				
				_pc=_tx.querySelectorAll('.precarga');
				for(_nn in _pc){
					if(typeof _pc[_nn] == 'object'){					
						_dum=document.createElement('p');
						_dum.innerHTML=_pc[_nn].innerHTML;
						_pc[_nn].parentNode.insertBefore(_dum,_pc[_nn]);
						_pc[_nn].parentNode.removeChild(_pc[_nn]);				
					}
				}
			}					
			_cont=_tx.innerHTML;	
			editor.setContent(_cont);
			document.getElementById('editordetexto').querySelector('input[name="id"]').value=_res.data.textos[0].id;
		}
	}
	
function editordetextoCargarTxprev(_res){
		var editor = tinymce.get('mce_redacc'); // use your own editor id here - equals the id of your textarea
        _idseccion = _res.seccion;
			
		if(_res.data.textos.length>0){
			_tx=document.createElement('div');
			_tx.innerHTML=_res.data.textos[0].texto;
			console.log(_tx.innerHTML);
			while(_tx.querySelector('.precarga')!=null){
				
				_pc=_tx.querySelectorAll('.precarga');
				for(_nn in _pc){
					if(typeof _pc[_nn] == 'object'){					
						_dum=document.createElement('p');
						_dum.innerHTML=_pc[_nn].innerHTML;
						_pc[_nn].parentNode.insertBefore(_dum,_pc[_nn]);
						_pc[_nn].parentNode.removeChild(_pc[_nn]);				
					}
				}
			}					
			_cont=_tx.innerHTML;
			//editor.getContent({format: 'raw'});
			editor.setContent(editor.getContent()+_cont);
		}
	}		
	
function editordeimagenCargar(_res,_idseccion){
		document.getElementById('editordeimagen').querySelector('#lienzo').innerHTML='';
		
		for(_nimg in _res.data.imagenesOrden){
			_idimg = _res.data.imagenesOrden[_nimg];
			_imdat=_res.data.imagenes[_idimg];
			_div=document.createElement('div');
			_div.setAttribute('class','portaimagen');
			_div.setAttribute('idimg',_idimg);
			
			_sep=document.createElement('div');
			_sep.setAttribute('class','separador');
			_sep.setAttribute('ondragover','allowDropImagen(event,this),resalta(event,this)');
			_sep.setAttribute('ondragleave',"desalta(this)");
			_sep.setAttribute('ondrop','dropImagen(event,this)');		 			
			_div.appendChild(_sep);			
			
			_sel=document.createElement('select');
			_div.appendChild(_sel);
			_sel.setAttribute('name','extraclasehtml');
			_sel.setAttribute('onchange','actualizaImgClass(this)');
			
			if(_imdat.extraclasehtml==''){_imdat.extraclasehtml='normal';}
			
			_vals=["micro", "normal", "completa"];
			for(i in _vals){
				_op=document.createElement('option');
				_op.value=_vals[i];
				_op.innerHTML=_op.value;
				_sel.appendChild(_op);	
				if(_vals[i]==_imdat.extraclasehtml){
					_op.setAttribute('selected','selected');
				}
			}
			
			_fija=document.createElement('input');
			_fija.setAttribute('type','button');
			_div.appendChild(_fija);
			_fija.setAttribute('onclick','fijarImagen(this)');
			_fija.value='fijar';
			_fija.title='fijar esta imagen de modo permanente a la sección';
			
			_borra=document.createElement('input');
			_borra.setAttribute('type','button');
			_div.appendChild(_borra);
			_borra.setAttribute('onclick','borrarImagen(this)');
			_borra.value='borrar';
			_borra.title='borrar esta imagen';
			
			
			_img=document.createElement('img');
			_img.setAttribute('draggable','true');
			_img.setAttribute('ondragstart','dragImagen(event)');
			_img.setAttribute('ondragend','limpiarAllow()');
			//_img.setAttribute('ondragleave','limpiarAllow()');
			_div.appendChild(_img);
			_img.setAttribute('src',_imdat.FI_documento);
			_img.title=_imdat.FI_nombreorig;
			_epi=document.createElement('a');
			_div.appendChild(_epi);
			_epi.setAttribute('class','botonepigrafe');
			if(_imdat.epigrafe==''){_imdat.epigrafe=' - sin texto - ';}
			_epi.innerHTML=_imdat.epigrafe;
			_epi.setAttribute('onclick','editarepigrafe(this)');
			document.getElementById('editordeimagen').querySelector('#lienzo').appendChild(_div);
		}
	}
	


function representarParrafoGrafico(_grafico){
        console.log('representando grafico');
		_nnparr++;
		_cont=document.getElementById('contenidoBase');
		
		_div=document.createElement('div');
		_cont.appendChild(_div);
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp',_idcomp);
		
		_div.setAttribute('class',"precarga grafico");
		_div.setAttribute('tipo',"indicadoresgrafico");
		
		_divG=document.createElement('div');
		_div.appendChild(_divG);
		_divG.setAttribute('id',"chartdiv"+_grafico.id);
		console.log(_grafico);
		
		
		if(_grafico.jqplot.seriesDefaults.renderer=='$.jqplot.BarRenderer'){
			_grafico.jqplot.seriesDefaults.renderer=$.jqplot.BarRenderer;
		}
		if(_grafico.jqplot.seriesDefaults.renderer=='$.jqplot.LineRenderer'){
			_grafico.jqplot.seriesDefaults.renderer=$.jqplot.LineRenderer;
		}
		
		if(_grafico.jqplot.axes.xaxis.renderer=='$.jqplot.CategoryAxisRenderer'){
			_grafico.jqplot.axes.xaxis.renderer=$.jqplot.CategoryAxisRenderer;
		}
		
		_val=Array();
		
		for(_ns in _grafico.series){
			_valores=Array();
						
			for(_fech in _grafico.series[_ns]){
				if(_grafico.series[_ns][_fech]===null){
					_valores.push(undefined);
				}else{
					_valores.push(parseFloat(_grafico.series[_ns][_fech]));
				}
			}
			_val.push(_valores);	
					
		}
		
		console.log(_grafico.jqplot);
		console.log(_val);
		//_val=[[1,int(),,1,1,2,2,4],[6,7,6,4,3,1,1,2,],[8,5,1,3,2,3,1,]];
		console.log(_val);
		console.log(_grafico.jqplot.axes.xaxis.ticks);
		//_val=[[1,2,3,1,1,2,2,4],[6,7,6,4,3,1,1,2,],[8,5,1,3,2,3,1,]];
		//_grafico.jqplot.axes.xaxis.ticks=["a","","","b","","","c",""];
		console.log("chartdiv"+_grafico.id);
		
		if(_grafico.graficoconvalores=='si'){
			$.jqplot( "chartdiv"+_grafico.id, _val, _grafico.jqplot );
		}

	}	
	
	
	function representarParrafoImagen(_imagen,_ancla){
			
		if(_imagen.modo==undefined){
			if(_imagen.att!=undefined){
				if(_imagen.att.src==null){
					console.log('este parrafo es solo un indicador de contenidos de imagenes.');
					//este parrafo es solo un indicador de contenidos de imagenes.
					return;
				}
			}
		}
		//console.log('cargandoimagen');
		_nnparr++;
		
		_cont=document.getElementById('contenidoBase');
		
		if(_ancla==undefined){
			_ancla=_cont.lastChild;
		}
		_div=document.createElement('div');
		//_cont.appendChild(_div);		
		_ancla.parentNode.insertBefore(_div, _ancla.nextSibling);
		
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp','img');
		
		_div.setAttribute('class',"precarga imagen ");
		
		_controlsSrc='ok';
		
		console.log('modo: '+_imagen.modo);
		if(_imagen.modo==undefined){
				
			if(_imagen.att!=undefined){
				if(_imagen.att['class']!=undefined){
					_ec=_imagen.att['class'];
				}else{
					_ec='';
				}
			}else{
				_ec='';	
			}
			
			_div.setAttribute('class',_div.getAttribute('class')+_ec);
			_div.setAttribute('tipo',"imagen");
		    
			_img=document.createElement('img');
			
			if(_imagen.att!=undefined){
		    	for(_an in _imagen.att){
		    		console.log('¡asignando atributo: '+_an+' - '+_imagen.att[_an]);
		    		if(_an=='src'){
		    			if(_imagen.att.src==undefined){
			    			_controlsSrc='nok';
			    			continue;
		    			}
		    		}
		    		_img.setAttribute(_an,_imagen.att[_an]);
		    	}
		    }
		    console.log(_img);
		    console.log(_controlsSrc);
		    if(_imagen.att.src==undefined){_controlsSrc='nok';}
		     console.log(_controlsSrc);
		    
	   }else{
	   	
	   		if(_imagen.modo=="mosaico" ||_imagen.modo=="mosaico4"){
                
				for(_nn in _imagen.data){
				
                    _div.setAttribute('class',_div.getAttribute('class')+" "+_imagen.data[_nn].extraclase);
                    
					_pimg=document.createElement('div');
					
					_pimg.setAttribute('class',"portaimagen");
					_div.appendChild(_pimg);
					
					_img=document.createElement('img');
					_pimg.appendChild(_img);
					
					_img.setAttribute('src',_imagen.data[_nn].path);
					
					_epi=document.createElement('div');
					_epi.setAttribute('class','epigrafe');
					_pimg.appendChild(_epi);
					_epi.innerHTML=_imagen.data[_nn].texto;
				
				}
			}
					
			if(_imagen.att!=undefined){
				if(_imagen.att['class']!=undefined){
					_ec=_imagen.att['class'];
				}else{
					_ec='';
				}
			}else{
				_ec='';	
			}
			
			_div.setAttribute('class',_div.getAttribute('class')+_ec);
			
			_div.setAttribute('tipo',"imagen");
		    
		    
			_img=document.createElement('img');
			
			console.log('hasta aca: '+_controlsSrc);
			if(_imagen.att!=undefined){
				
		    	for(_an in _imagen.att){
		    		if(_an=='src'){
		    			if(_imagen.att.src==undefined){
		    				console.log('falta .src');
			    			_controlsSrc='nok';
			    			continue;
		    			}
		    		}
		    		
		    		_img.setAttribute(_an,_imagen.att[_an]);
		    		console.log('¡asignando atributos');
		    	}
		    }	   	
	   }
	    if(_controlsSrc!='nok'){	    	
	    	_div.appendChild(_img);
	    }			
	}	


	function representarParrafoTexto(_texto){	
		//console.log('representando texto: '+ _texto);
		if(_texto==''){
			//este parrafo es solo un indicador de contenifodos de imagenes.
			return;
		}			
		_cont=document.getElementById('contenidoBase');
					
		_nnparr++;
		_div=document.createElement('div');
		_cont.appendChild(_div);
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		_div.setAttribute('class',"precarga");
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp',_idcomp);
				
		_div.setAttribute('tipo',"texto");
		
		_pp=document.createElement('p');
		_pp.innerHTML=_texto;			
    	_div.appendChild(_pp);				
		
	}	
		
	function representarParrafosTituloobjeto(_parrafos){
		_cont=document.getElementById('contenidoBase');
	    
		for(_pn in _parrafos.data){
			
			_nnparr++;
			_div=document.createElement('div');
			_cont.appendChild(_div);
			_div.setAttribute('id',"parrafoprecarga"+_nnparr);
			_div.setAttribute('class',"precarga");
			
			_div.setAttribute('idsecc',_idsecc);
			_div.setAttribute('idcomp',_idcomp);
					
			_div.setAttribute('tipo',"tituloobjeto");
			
			_pp=document.createElement('p');
			if(_parrafos.data[_pn]['cont']!=undefined){
				if(_parrafos.data[_pn]['att'] !=undefined){
					for(_natt in _parrafos.data[_pn]['att']){
						_pp.setAttribute(_natt,_parrafos.data[_pn]['att'][_natt]);
					}				
				}
				_pp.innerHTML=_parrafos.data[_pn]['cont'];
				
			}else{
				_pp.innerHTML=_parrafos.data[_pn];	
			}						
	    	_div.appendChild(_pp);			
		}	
	}	
		
	function representarParrafosParrafos(_parrafos){	
		console.log('parrafos');
		_cont=document.getElementById('contenidoBase');
	    
		for(_pn in _parrafos){
			
			_nnparr++;
			_div=document.createElement('div');
			_cont.appendChild(_div);
			_div.setAttribute('id',"parrafoprecarga"+_nnparr);
			_div.setAttribute('class',"precarga");
			
			_div.setAttribute('idsecc',_idsecc);
			_div.setAttribute('idcomp',_idcomp);
					
			_div.setAttribute('tipo',"texto");
			
			_pp=document.createElement('p');
			if(_parrafos[_pn]['cont']!=undefined){
				if(_parrafos[_pn]['att'] !=undefined){
					for(_natt in _parrafos[_pn]['att']){
						_pp.setAttribute(_natt,_parrafos[_pn]['att'][_natt]);
					}				
				}
				_pp.innerHTML=_parrafos[_pn]['cont'];				
			}else{
				_pp.innerHTML=_parrafos[_pn];	
			}
			
	    	_div.appendChild(_pp);			
		}		
			
	}	
	
	function representarParrafoTabla(_tabla){	
		_nnparr++;
		_cont=document.getElementById('contenidoBase');
		
		_div=document.createElement('div');
		_cont.appendChild(_div);
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		_div.setAttribute('class',"precarga");
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp',_idcomp);
				
		_div.setAttribute('tipo',"tabla");
		
	    _TT=document.createElement('table');
	    _TT.setAttribute('class',"histograma");
	    
	    _div.appendChild(_TT);
	    
	    _TB=document.createElement('tbody');
	    _TT.appendChild(_TB);
	    
	    if(_tabla.att!=undefined){
	    	for(_an in _tabla.att){
	    		_TT.setAttribute(_an,_tabla.att[_an]);
	    	}
	    }
	    
		for(_lin in _tabla.data){
			_tr=document.createElement('tr');
			_TB.appendChild(_tr);
			
		    if(_tabla.data[_lin].att!=undefined){
		    	for(_an in _tabla.data[_lin].att){
		    		_tr.setAttribute(_an,_tabla.data[_lin].att[_an]);
		    	}
		    }
			
			for(_col in _tabla.data[_lin].data){
				
				_td=document.createElement(_tabla.data[_lin].data[_col].tag);
				
				if(_tabla.data[_lin].data[_col].att!=undefined){
			    	for(_an in _tabla.data[_lin].data[_col].att){
			    		//console.log(_an+' '+_tabla.data[_lin].data[_col].att[_an]);
			    		_td.setAttribute(_an,_tabla.data[_lin].data[_col].att[_an]);
			    	}
		    	}
		    
				_tr.appendChild(_td);
				_td.innerHTML=_tabla.data[_lin].data[_col].data;
			
			}			
		}			
	}	

	function representarParrafoLista(_lista){	
		
		_cont=document.getElementById('contenidoBase');
	    
		for(_lin in _lista.data){
				
			_nnparr++;
			_div=document.createElement('div');
			_cont.appendChild(_div);
			_div.setAttribute('id',"parrafoprecarga"+_nnparr);
			_div.setAttribute('class',"precarga");
			
			_div.setAttribute('idsecc',_idsecc);
			_div.setAttribute('idcomp',_idcomp);
					
			_div.setAttribute('tipo',"tabla");

			_tr=document.createElement('div');
			_tr.setAttribute('class','fila');
			_div.appendChild(_tr);
			
		    if(_lista.data[_lin].att!=undefined){
		    	for(_an in _lista.data[_lin].att){
		    		_tr.setAttribute(_an,_lista.data[_lin].att[_an]);
		    	}
		    }
			
			for(_col in _lista.data[_lin].data){
				_td=document.createElement('div');
				_td.setAttribute('class',_lista.data[_lin].data[_col].tag);
				
				if(_lista.data[_lin].data[_col].att!=undefined){
			    	for(_an in _lista.data[_lin].data[_col].att){
			    		//console.log(_an+' '+_lista.data[_lin].data[_col].att[_an]);
			    		_td.setAttribute(_an,_lista.data[_lin].data[_col].att[_an]);
			    	}
		    	}
		    
				_tr.appendChild(_td);
				_td.innerHTML=_lista.data[_lin].data[_col].data;
			
			}			
		}			
	}
	
	function representarParrafoFormateado(_tx){	
		_nnparr++;
		_cont=document.getElementById('contenidoBase');
		_div=document.createElement('div');
		_cont.appendChild(_div);
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		_div.setAttribute('class',"precarga");
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp',_idcomp);
			
		_div.setAttribute('tipo',"fechas");
		_div.innerHTML=_tx;		
	}	
	
	
	function representarTitulo(_nombre,_idseccion,_orden,_extraclase,_estado){
		_nnparr++;
		
		_cont=document.getElementById('contenidoBase');
		_div=document.createElement('div');
		_cont.appendChild(_div);
		_div.setAttribute('id',"parrafoprecarga"+_nnparr);
		_div.setAttribute('tipo',"tituloseccion");
		_div.setAttribute('class',"precarga");
		
		_div.setAttribute('idsecc',_idsecc);
		_div.setAttribute('idcomp','titulo');
				
		_div.setAttribute('extraclase',_extraclase);
				
		_h1=document.createElement('h1');
		_div.appendChild(_h1);
		_h1.setAttribute('id',_idseccion);
		//_h1.setAttribute('onclick','editarSeccion(this);');
		
		_dia = document.createElement('div');
		_dia.setAttribute('class','seccionOrg');
		_dia.setAttribute('idsecc',_idsecc);
		_dia.setAttribute('id',_idsecc);
		_dia.setAttribute('draggable','true');
		_dia.setAttribute('ondragstart',"dragSecc(event,this)");		
		_dia.setAttribute('onclick','editarSeccion(this);');
		_dia.innerHTML="<b>Seccion:</b><br>"+_estado;
		
		_h1.appendChild(_dia);

		if(_nombre!='SN'){
			_h1.innerHTML+=_nombre;
		}
	}	
	
	function anadirAdjuntoPdf(_res){
	
	_aa=document.querySelector('a[nf="'+_res.data.nf+'"]');
	_aa.innerHTML=_res.data.nombre;
	_aa.setAttribute('href',_res.data.ruta);
	_aa.setAttribute('download',_res.data.nombre);
	
	_ae=document.createElement('a');
	_ae.innerHTML='elim';
	_ae.setAttribute('class','elim');
	_ae.setAttribute('onclick','eliminarPDF(this)');		
	_ae.setAttribute('idinf',_idinf);
	_ae.setAttribute('idIdoc',_res.data.nid);
	_ae.setAttribute('doc',_res.data.ruta);	
	
	_aa.appendChild(_ae);
		
	_atag=document.querySelector('#listado a[idinf="'+_idinf+'"] #p');
	_atag.setAttribute('presentado','pdf');
	_atag.parentNode.setAttribute('doc',_res.data.nombre);
}

function anadirAdjuntoDoc(_res){
	
	_aa=document.querySelector('a[nf="'+_res.data.nf+'"]');
	_aa.innerHTML=_res.data.nombre;
	_aa.setAttribute('href',_res.data.ruta);
	_aa.setAttribute('download',_res.data.nombre);
	
	_this.parentNode.parentNode.querySelector('#lienzob').appendChild(_aa);
	
	_ae=document.createElement('a');
	_ae.innerHTML='elim';
	_ae.setAttribute('idIdoc',_res.data.nid);	
	_ae.setAttribute('onclick','eliminarDoc(this)');				
	_ae.setAttribute('class','elim');
	
	_this.parentNode.parentNode.querySelector('#lienzob').appendChild(_ae);	
					
	_atag=document.querySelector('#listado a[idinf="'+_idinf+'"] #d');
	_atag.setAttribute('presentado','docs');
}



function INICIAPAG(){

    _auxes=document.querySelectorAll('#informe div.hoja.caratula [extraclase="aux"]');
    for(_nax in _auxes){
        console.log(_auxes[_nax]);
        if(typeof _auxes[_nax]=="object"){
            _auxes[_nax].parentNode.removeChild(_auxes[_nax]);
        }
    }
    
    
    _solapas=document.querySelectorAll('#hojaBase .seccionOrg');
    for(_nax in _solapas){
        if(typeof _solapas[_nax]=="object"){
            _solapas[_nax].parentNode.removeChild(_solapas[_nax]);
        }
    }
    
    
    document.querySelector('#botoneraV2 #estado #tx').innerHTML='compaginando';
    document.querySelector('#botoneraV2 #paginar').style.display='none';
    
    _mod=document.getElementById('HojaModelo');
    _cont=document.getElementById('contenidoBase');
    _parrafos=_cont.childNodes;    
    _saltomanual='no';
    
    _AlturaAcc=0;		
    
    _paquetes=[];
    _PNum=1;
    
    crearhoja(_PNum);

    _parrafos=_cont.querySelectorAll('div.precarga');
    
    console.log(_parrafos);
    
    for (i in _parrafos){				

        j=parseInt(i)+1;
        //console.log(j);
        h=parseInt(i)-1;
        //console.log(h);
            
        console.log('analizando p:'+i+' > '+_parrafos[i].id);
        //alert(_AlturaAcc);
        if(_parrafos[i]=='[object Text]'){
            console.log('	parrafo eliminado por ser texto suelto');
            continue;
        }
        
        
        if(typeof _parrafos[i]!='object'){					
            continue;
        }
        
        if(_parrafos[i].getAttribute('extraclase')=='aux'){
            _parrafos[i].style.display='none';
        }
        
        _saltomanual=_parrafos[i].getAttribute('salto');
        _ppp=_parrafos[i].id;
        
        _parrCont=_parrafos[i].childNodes;
        _alturaExt=$('#'+_ppp).height();
        
        if(_alturaExt<5){//si un parrafo no tiene contenido, es eliminado.
            _parrafos[i].parentElement.removeChild(_parrafos[i]);
            console.log('	parrafo eliminado por no tener altura');
            continue;
        }
        
        //console.log('en'+_ppp+ ':' +_alturaExt+'vs'+_parrafos[i].clientHeight);
            
        _tipoParrafo=_parrafos[i].getAttribute('tipo');	
        
        
        if(_tipoParrafo=='tituloseccion'){
            console.log('parrafo de tipo seccion');

            while (_parrafos[j]=='[object Text]'&&(j+1)<_parrafos.length){
                console.log('parrafo siguiente('+j+') de tipo [object Text]');
                j=j+1;
            }
                        
            
            if(j>=_parrafos.length){//si un parrafo de titulo de sección es continuado por nada, es eliminado.
                _parrafos[i].parentElement.removeChild(_parrafos[i]);
                console.log('es el úlltimo parrafo -> eliminar');
                continue;
            }
            
            if(_parrafos[j]=='[object Text]'){
                console.log('solo quedan delante de tipo [object Text]');
                continue;
            }
            
            
            if(_parrafos[j]!=undefined){
                _sig=_parrafos[j].getAttribute('tipo');
                if(_sig=='tituloseccion'){//si un parrafo de titulo de sección es continuado por otro tótulo de sección, es eliminado.
                    _parrafos[i].parentElement.removeChild(_parrafos[i]);
                    console.log('el próximo parrafo es de seccion');
                    continue;	
                }			
            }                
        }		
		
        _AlturaAcc=_AlturaAcc+_alturaExt+2;
        console.log('altura acc p.'+_PNum+':'+_AlturaAcc);		
        console.log('+ '+ _parrafos[i].clientHeight +' '+_AlturaAcc+ '>' +_Alturacontenido);			
                
        if(
			i!=0 //la carátula no lleva salto
			&&
			(
				_AlturaAcc>_Alturacontenido
				||
				 _saltomanual=='si'
			)
			){//si alcanza la altura móxima por hoja, pasa a la siguiente.	
            
            _PNum=_PNum+1;
            crearhoja(_PNum);
            _AlturaAcc=0;
            
            //repaginación de tótulos como óltimo elemento de una pógina.
            
            if(_uP.tipo=='tituloseccion'||_uP.tipo=='tituloobjeto'){
                console.log('	tótulo de seccion perdido en la pag anterior');						
                _ultPpp=_uP.node.id;
                _alturaUlExt=$('#'+_ultPpp).height();					
                _AlturaAcc=_alturaUlExt;
                paginaren(_uP.node,_PNum);					
                
            }
            
            _AlturaAcc=_AlturaAcc+_alturaExt+2;	
			console.log('altura acc p.'+_PNum+':'+_AlturaAcc);		
        }
        paginaren(_parrafos[i],_PNum);

    }
    
    
    _HojaBase=document.getElementById('hojaBase');
    _HojaBase.querySelector('#encabezado').innerHTML='';
    _HojaBase.querySelector('#contenidoBase').innerHTML='';
    _HojaBase.style.display='none';
    
    //console.log(_Alturas)
    
    foliado();
    document.querySelector('#botoneraV2 #estado #tx').innerHTML='compaginación terminada, listo para imprimir';
}

function crearhoja(_PNum){
    console.log('creando hoja:'+_PNum);
    _modelo = document.getElementById('HojaModelo');
    _nuevahoja=_modelo.cloneNode(true);
    _nuevahoja.setAttribute('id','hoja'+_PNum);
    _nuevahoja.setAttribute('seimprime','si');
    _informe= document.getElementById('informe');
    _informe.appendChild(_nuevahoja);
    if(_PNum==1){
		//la caratula no lleva encabezado ni pie
		_enc=document.querySelector('#hoja'+_PNum+' > #encabezado');
		_nuevahoja.removeChild(_enc);
		
		//la caratula no lleva encabezado ni pie
		_pie=document.querySelector('#hoja'+_PNum+' > #pie');
		_nuevahoja.removeChild(_pie);
	}
}



function paginaren(_cont,_PNum){
    _cont.setAttribute('name','parrafoPaginado');
    //console.log('	paginando:'+_cont.id);
    console.log('	altura:'+_alturaExt + ' -- '+_AlturaAcc);
    _hoja= document.getElementById('hoja'+_PNum);
    _divContenido=_hoja.querySelector('div.contenido');
    _divContenido.appendChild(_cont);
    _ultimoparr=_cont;
    
    _uP.tipo=_cont.getAttribute('tipo');
    _uP.node=_cont;
}
    
function limpiarHTML(){
    document.querySelector('#informe').innerHTML='';
    document.getElementById('hojaBase').removeAttribute('style');
    document.querySelector('#hojaBase #contenidoBase').innerHTML='';
    
    //document.querySelector('#HojaModelo #encabezado').innerHTML='';
    //document.querySelector('#HojaModelo #contenido').innerHTML='';
    //document.querySelector('#HojaModelo #pie').innerHTML='';
}


    function foliado(){
        _hojas=document.querySelectorAll('div.hoja[seimprime="si"]');			
        _cant=Object.keys(_hojas).length;		
        for (_nh in _hojas);
                
        _qwers = document.getElementsByName('totalhojas');
        for (var i=0,len=_qwers.length; i<len; i++){
            _qwers[i].innerHTML=_cant;
        }
    
        _arr = document.getElementsByName('Nhoja'); // numera las hojas reemplazando el contenido html de todos los elementos con name 'Nhoja' 			
        var length = _arr.length;
        _Nhoja = 1;
        element = null;
        for (var i = 0; i < length; i++) {
            element = _arr[i];
            element.innerHTML = _Nhoja;
            _Nhoja = _Nhoja + 1;
        }
    }
