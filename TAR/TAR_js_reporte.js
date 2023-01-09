/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2022 TReCC SA
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




function consultaConfig(){
	_parametros = {
        'panid': _PanelI
    };
    $.ajax({
        url:   './PAN/PAN_consulta_config.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
			_res = PreprocesarRespuesta(response);
			
			_Config=_res.data.config;
			
			_margen_temporal_visible=Math.max(5,_Config['tar-periodo']);
			_IdIndCurva=_Config['ind-cert-proy'];
			
			consultarReporte();
			consultarResumenCertificacion();			
			if(_IdIndCurva!=''){
				consultarResumenIndicadores();
			}else{
				document.querySelector('#indicadores #avance_curva').parentNode.parentNode.setAttribute('estado','inactivo');
			}
			
			
        }
    })
}




function consultarReporte(){
	
		
		
	d = new Date();
	_hoy=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	_parametros = {
		'zz_AUTOPANEL': _PanId,
		'idplan':_IdPlanActivo,
		'fecha_fin_reporte':_hoy,
		'periodicidad':'mes'
		
    };
    $.ajax({
        url:   './TAR/TAR_consulta_reporte.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
            
			_Reporte=_res.data;
			RepresentarReporte();  	
			
        }
   });
}

function guardarConfigReporteMuestra(_this){
	
	if(_this.checked){
		_this.parentNode.parentNode.setAttribute('visible','si');
	}else{
		_this.parentNode.parentNode.setAttribute('visible','no');
	}
	
	_parametros = {
		'zz_AUTOPANEL': _PanId,
		'indicador':_this.parentNode.parentNode.getAttribute('indicador'),
		'estado':_this.checked
    };
    
    
    
}

function consultarResumenCertificacion(){
	_parametros = {
		'zz_AUTOPANEL': _PanId,
		'panid': _PanId
    };
    $.ajax({
        url:   './CPT/CPT_consulta_resumen.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
            
			document.querySelector('#indicadores #avance_certificacion').innerHTML=Math.round(_res.data.ultmonto_P*10)/10;
			_d_hoy = new Date();
			

			
			_dias=(_d_hoy.getTime()/86400000) - _res.data.descdecertcerr;
			_d= new Date(_dias*86400000);
			_tx=_d.getDate()+' de '+_Meses[_d.getMonth()]+' de '+_d.getFullYear();
			document.querySelector('#indicadores #fecha_certificacion').innerHTML=_tx;
			
			
			console.log('hoy:t:'+_d_hoy.getTime());
			console.log(new Date(_d_hoy.getTime()));
					
			_ddia=(_d_hoy.getTime()/86400000);
			console.log('hoy:d:'+_ddia);
			console.log(new Date(_ddia*86400000));
			
			console.log('desde:d:'+_res.data.descdecertcerr);
			console.log('new:d:'+_dias);
			console.log(new Date(_dias*86400000));
        }
   });
}




function consultarResumenIndicadores(){
	/*
	_parametros = {
		'zz_AUTOPANEL': _PanId,
		'panid': _PanId
    };
    $.ajax({
        url:   './IND/IND_consulta_resumen.php',
        type:  'post',
        data: _parametros,
        error: function (response){alert('error al intentar contatar el servidor');},
        success:  function (response){
            var _res = $.parseJSON(response);
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}

			 if(_res.data.otrainfo!=''){
				 _oi=$.parseJSON(_res.data.otrainfo);
			 }else{
				_oi={};
			}
			 if(_oi[_IdIndCurva]==undefined){
				document.querySelector('#indicadores #avance_curva').parentNode.parentNode.setAttribute('estado','inactivo');
			 }else{
				 _tx=Math.round(_oi[_IdIndCurva].valor*10)/10;
				 document.querySelector('#indicadores #avance_curva').innerHTML=_tx;
			 }
			
        }
   });*/
}



function RepresentarReporte(){
	

//Carga indicadores
	document.querySelector('#contenidoextenso #desfase_medio_fin').innerHTML=(Math.round(10*_Reporte.resumen.desfase_medio_fin.t)/10);
	document.querySelector('#contenidoextenso #dilacion_media').innerHTML=(Math.round(10*_Reporte.resumen.dilacion_media.t)/10);
	document.querySelector('#contenidoextenso #demora_actual_estimada').innerHTML=(Math.round(10*_Reporte.resumen.demora_actual_estimada.t)/10);
	document.querySelector('#contenidoextenso #avance_jornadas').innerHTML=(Math.round(10*_Reporte.resumen.avance_jornadas.t)/10);
	document.querySelector('#contenidoextenso #ocurrencia_jornadas').innerHTML=(Math.round(10*_Reporte.resumen.ocurrencia_jornadas.t)/10);
	document.querySelector('#contenidoextenso #avance_plazo').innerHTML=(Math.round(10*_Reporte.resumen.avance_plazo.t)/10);
	document.querySelector('#contenidoextenso #superposicion_jornadas_alacanzada').innerHTML=(Math.round(10*_Reporte.resumen.superposicion_jornadas_alacanzada.t)/10);
	if(_Reporte.resumen.proxima_varicion_jornadas.t>0){_pre='+';}else{_pre='';}
	document.querySelector('#contenidoextenso #proxima_varicion_jornadas').innerHTML=_pre+(Math.round(10*_Reporte.resumen.proxima_varicion_jornadas.t)/10);
	dibujarHistogramaJornadas();
	
	
	
//GANTT
	_gra={
		'tareas':Array(),
		'meses':Array(),
		'findes':Array(),
		'annos':Array(),
		'feriados':Array(),
		'hoy':Array(),
		'eventos':Array()
	};
	
	_d_hoy = new Date();
	
	_dias=_d_hoy.getTime()/86400000 + _ConfGra.dias_dehoy_inicio;
	_d_ini= new Date(_dias*86400000);
	
	_dias = _d_ini.getTime()/86400000 + Math.floor(_ConfGra.canvas_ancho / _ConfGra.dias_ancho);
	_d_fin= new Date(_dias*86400000);
	
	_ms_scan = _d_ini.getTime();
	
		

	while(_ms_scan < _d_fin.getTime()){
		
		_d_scan=new Date(_ms_scan);
		((_ms_scan - _d_ini.getTime())/86400000)*_ConfGra.dias_ancho;
		
		if(_d_scan.getDate() == 1 || _d_scan.getTime() == _d_ini.getTime()){
			//nuevo mes
			if(_d_scan.getMonth()==11){
				_dfin=new Date((_d_scan.getFullYear()+1),0,1);
			}else{
				_dfin=new Date((_d_scan.getFullYear()),_d_scan.getMonth()+1,1);
			}			
			_mes={
				'tx':_Meses[_d_scan.getMonth()],
				'ini':Math.floor(((_ms_scan - _d_ini.getTime())/86400000)*_ConfGra.dias_ancho),
				'fin':Math.floor(((_dfin.getTime()- _d_ini.getTime())/86400000)*_ConfGra.dias_ancho)
			}
			_gra.meses.push(_mes);
			
			if(_d_scan.getMonth() == 0 || _d_scan.getTime() == _d_ini.getTime()){
				//nuevo anno
				_dfin=new Date((_d_scan.getFullYear()+1),_d_scan.getMonth(),_d_scan.getDate());
				_anno={
					'tx':_d_scan.getFullYear(),
					'ini':Math.floor(((_ms_scan - _d_ini.getTime())/86400000)*_ConfGra.dias_ancho),
					'fin':Math.floor(
							Math.min(
								((_dfin.getTime()- _d_ini.getTime())/86400000)*_ConfGra.dias_ancho,
								_ConfGra.canvas_ancho
							)
						)
				}
				_gra.annos.push(_anno);
			}
		}
		
		if(_d_scan.getDay() == 0 || _d_scan.getDay() == 6){
			//finde
			_finde={
				'tx':'',
				'ini':Math.floor(((_ms_scan - _d_ini.getTime())/86400000)*_ConfGra.dias_ancho),
				'fin':Math.floor((((_ms_scan - _d_ini.getTime())/86400000)+1)*_ConfGra.dias_ancho),
			}
			_gra.findes.push(_finde);
		}
		
		_ms_scan += 86400000;	
	}
	
				
	
	_gra['hoy']={
		'tx':_d_hoy.getDate()+' de '+_Meses[_d_hoy.getMonth()]+' de '+_d_hoy.getFullYear(),
		'ini':Math.floor(_ConfGra.dias_ancho * -1 * _ConfGra.dias_dehoy_inicio),
		'fin':Math.floor(_ConfGra.dias_ancho * (-1 * _ConfGra.dias_dehoy_inicio + 1))
	}
	
	_fila = 0;
	_nf=0; //numero de foto referida;
	_fotos_referidas={};//objetos fotos referidas en gantt;
	for(_nt in _Reporte.tareasOrden){
			
		_tarea={
			'y_pos':_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto),
			'plan':{
				'formulado':'no',
				'ini':'',
				'ancho':'',
				'fin':''
			},
			'hecho':{
				'formulado':'no',
				'ini':'',
				'ancho':'',
				'fin':''		
			},
			'hecho_extendido':{
				'formulado':'no',
				'ini':'',
				'ancho':'',
				'fin':''		
			},
			'hecho_fintemprano':{
				'formulado':'no',
				'ini':'',
				'ancho':'',
				'fin':''		
			},
			'texto':{
				'formulado':'no',
				'ini':'',
				'ancho':'',
				'fin':''
			}
		};

		//_pos_y_fila=		_ConfGra.encabez_alto+(_fila*_altofila);
		_idt=_Reporte.tareasOrden[_nt];
		_datt=_Reporte.tareas[_idt];
		
		
		//calcular fila planificada original
			_dias_de_canvas_ini= Math.floor(_datt.fecha_plan_inicio_diashoy) - Math.floor(_ConfGra.dias_dehoy_inicio);
			_dias_de_canvas_ini=Math.max(_dias_de_canvas_ini,0);
			
			
			_p_dias_de_canvas_fin= Math.floor(_datt.fecha_plan_fin_diashoy) - Math.floor(_ConfGra.dias_dehoy_inicio);
			_p_dias_de_canvas_fin=Math.min(_p_dias_de_canvas_fin,_ConfGra.canvas_ancho);
			
			_tarea.plan['ini']  = _dias_de_canvas_ini * _ConfGra.dias_ancho;
			_tarea.plan['ancho']=(_p_dias_de_canvas_fin * _ConfGra.dias_ancho) - (_dias_de_canvas_ini * _ConfGra.dias_ancho);
			_tarea.plan['formulado']  ='si';
			
		//calcular fila efectiva				
			_datt.fecha_hecho_inicio_diashoy;			
			//console.log(_datt.fecha_hecho_inicio_diashoy+' ' +_ConfGra.dias_dehoy_inicio);
			
			_dias_de_canvas_ini= Math.floor(_datt.fecha_hecho_inicio_diashoy) - Math.floor( _ConfGra.dias_dehoy_inicio);
			//console.log(_dias_de_canvas_ini);
			
			
			if(_dias_de_canvas_ini<-10000){//el campo fecha_ini_hecho no tiene un valor cargado (tal vez no empezó)		
				
				_min_dias=(_ConfGra.canvas_ancho/_ConfGra.dias_ancho)+_ConfGra.dias_dehoy_inicio;//dias desde hoy al final del grafico. si el inicio supera se desestima
				
				//console.log('min_dias:'+_min_dias);
				for(_no in _datt.observaciones){	
					if(_datt.observaciones[_no].avance>0){//esta observación indica que si empezó				
						
						_o_dias=_datt.observaciones[_no].fecha_diashoy;
						//console.log('_o_dias:'+_o_dias);
						_min_dias=Math.min(_o_dias,_min_dias);
						//console.log(_min_dias);
					}
				}	
				//console.log(_min_dias+'vs'+((_ConfGra.canvas_ancho/_ConfGra.dias_ancho)+_ConfGra.dias_dehoy_inicio));
				if(_min_dias<((_ConfGra.canvas_ancho/_ConfGra.dias_ancho)+_ConfGra.dias_dehoy_inicio)){
					_dias_de_canvas_ini=_min_dias-_ConfGra.dias_dehoy_inicio;
				}
			}
			//console.log(_dias_de_canvas_ini);
		
			if(_dias_de_canvas_ini<-10000){//confirmado, no empezó, no dibujamos esta barra												
				_tarea.texto['ini'] = _tarea.plan['ini'];
				_tarea.texto['y_offset'] = - _ConfGra.barra_alto;
				_tarea.hecho['formulado']  ='no';
			}else{
				_tarea.texto['y_offset'] = 0;
				
				_dias_de_canvas_ini=Math.max(_dias_de_canvas_ini,0);				
				_dias_de_canvas_fin= Math.floor(_datt.fecha_hecho_fin_diashoy) - Math.floor(_ConfGra.dias_dehoy_inicio);
				_min_dias=(_ConfGra.canvas_ancho/_ConfGra.dias_ancho)+_ConfGra.dias_dehoy_inicio;				
				
				if(_dias_de_canvas_fin<-10000){//el campo fecha_fin_hecho no tiene un valor cargado (tal vez no terminó)
					for(_no in _datt.observaciones){
						if(_datt.observaciones[_no].avance>99){//esta observación indica que si terminó					
							_o_dias=_datt.observaciones[_no].fecha_diashoy;
							//console.log('_o_dias:'+_o_dias);
							_min_dias=Math.min(_o_dias,_min_dias);
							//console.log(_min_dias);
						}
					}
				}
				
				if(_min_dias<(_ConfGra.canvas_ancho/_ConfGra.dias_ancho)+_ConfGra.dias_dehoy_inicio){
					_dias_de_canvas_fin=_min_dias-_ConfGra.dias_dehoy_inicio;
				}else{
					_dias_de_canvas_fin=0-_ConfGra.dias_dehoy_inicio;
				}				
				_dias_de_canvas_fin=Math.min(_dias_de_canvas_fin,_ConfGra.canvas_ancho);
				
				//_h_pos_x=(_dias_de_canvas_ini * _ConfGra.dias_ancho);
				
				
				_tarea.hecho['ini'] = _dias_de_canvas_ini * _ConfGra.dias_ancho;		
				_tarea.texto['ini'] = _tarea.hecho['ini'];			
				_tarea.hecho['formulado']  ='si';
				_tarea.hecho['ancho']=(_dias_de_canvas_fin * _ConfGra.dias_ancho) - (_dias_de_canvas_ini * _ConfGra.dias_ancho);
			}
							
			_dibujar_flecha_plan_pasado='si';
			if(_p_dias_de_canvas_fin<0){//el plan inicia despu de terminado el grafico
				//if(_dias_de_canvas_ini<-10000){continue;}// la fecha plaeada es anterior y la tarea no inicio
				if(_p_dias_de_canvas_fin<0){continue;}// la fecha planeada y la efectiva de fin ocurrieron antes de la primera fecha de reporte						
				_dibujar_flecha_plan_pasado='si';
			}
				
				
			_dibujar_flecha_plan_futuro='no';
			if(_tarea.plan['ini'] > _ConfGra.canvas_ancho){//el plan aún no entra				
				if(_tarea.hecho['formulado']!='si'){continue;}// la tarea no tiene un inicio hecho
				if(_ConfGra.canvas_ancho<_dias_de_canvas_ini){continue;}//aun es muy temprano para dibujar esta tarea				
				if(_tarea.hecho['ini']<0){continue;}// la fecha planeada y la efectiva de fin ocurrieron antes de la primera fecha de reporte					
				_dibujar_flecha_plan_futuro='si';
			}
			

		
			//generar inicio demorado
			//generar desarrollo
			//generar final anticipado
		
		//calcular fila efectiva
			
		
			//generar flecha de demora en inicio
			//generar desarrollo inicial anticipado
			//generar desarrollo
			//generar desarrollo final demorado
			//generar flecha de inicio anticipado			
			if(_tarea.hecho.ini + _tarea.hecho.ancho > _tarea.plan.ini + _tarea.plan.ancho){ // final demorado						
				_tarea.hecho_extendido['formulado']='si';
				_tarea.hecho_extendido['ini']='si';
				_tarea.hecho_extendido['ancho']=(_tarea.hecho.ini + _tarea.hecho.ancho) - (_tarea.plan.ini + _tarea.plan.ancho);
			}else{
				_tarea.hecho_extendido['formulado']='no';
			}	

		
		//generar fila controles
			//marcar controles numerados
		
		//generar texto nombre			
		_tarea.texto['formulado']='si';
		_tarea.texto['tx']=_datt.codigo+':  '+_datt.nombre;
		
		_gra.tareas.push(_tarea);
			
			
		_fecha_min_fotos=-30;
		_fecha_min_fotos=Math.min(-30, _ConfGra.dias_dehoy_inicio/3);
		
		_iniciada='no';
		_terminada='no';
		_foto_ultima_ob=null;
		for(_no in 	_datt.observaciones){
						
			_obdata =_datt.observaciones[_no];
			
			if(_obdata.avance > 0 && _iniciada=='no'){	
				//accá inicia la tarea
				_iniciada='si';
				if(_obdata.fecha_diashoy >= _ConfGra.dias_dehoy_inicio){
						//entra en el gráfico
						_eve={
							'y_pos':Math.floor(_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto)+1),
							'ini': Math.floor((_obdata.fecha_diashoy - _ConfGra.dias_dehoy_inicio) * _ConfGra.dias_ancho)-2,
							'img': _ConfGra.tilde_ini,
							'tx':'',
							'x_offset':0,
							'y_offset':0
						}
						_gra.eventos.push(_eve);
				}
			}
			
			if(_obdata.avance > 99 && _terminada=='no'){	
				//acá terminó la tarea
				_terminada='si';
				if(_obdata.fecha_diashoy >= _ConfGra.dias_dehoy_inicio){
					//entra en el gráfico
					_eve={
						'y_pos':Math.floor(_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto)+1),
						'ini': Math.floor((_obdata.fecha_diashoy - _ConfGra.dias_dehoy_inicio) * _ConfGra.dias_ancho)-2,
						'img': _ConfGra.tilde_fin,
						'tx':'',
						'x_offset':0,
						'y_offset':0
					}
					_gra.eventos.push(_eve);
				}else{
					//se marca al inicio del gráfico
					_eve={
						'y_pos':Math.floor(_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto)+1),
						'ini': 0,
						'img': _ConfGra.tilde_fin,
						'tx': (_ConfGra.dias_dehoy_inicio - _obdata.fecha_diashoy) + ' días antes',
						'x_offset':8,
						'y_offset':0
					}
					_gra.eventos.push(_eve);
				}
			}	
			
			if(_obdata.fecha_diashoy >= _fecha_min_fotos){
				if(Object.keys(_obdata.fotos).length > 0){
					_fotodata=_obdata.fotos[Object.keys(_obdata.fotos)[0]];
					_np1='';
					_np2='';
					if(_Reporte.tareas[_datt.id_p_TARtareas_padre] != undefined){
						_np1=_Reporte.tareas[_datt.id_p_TARtareas_padre].nombre;
						if(_Reporte.tareas[_Reporte.tareas[_datt.id_p_TARtareas_padre].id_p_TARtareas_padre] != undefined){
							_np2=_Reporte.tareas[_Reporte.tareas[_datt.id_p_TARtareas_padre].id_p_TARtareas_padre].nombre;
							//console.log(_np2);
						}						
					}
					
					_foto_ultima_ob={
						'y_pos':Math.floor(_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto)+1),
						'ini': Math.floor((_obdata.fecha_diashoy - _ConfGra.dias_dehoy_inicio) * _ConfGra.dias_ancho)-12,
						'img': _ConfGra.tilde_foto,
						'meta':{
							'tarea_codigo':_datt.codigo,
							'tarea_nombre':_datt.nombre,
							'tarea_en1_nombre':_np1,
							'tarea_en2_nombre':_np2,
							'obs_fecha':_obdata.fecha,
							'obs_avance':_obdata.avance,
							'foto_epigrafe':_fotodata.epigrafe,
							'foto_archivo':_fotodata.FI_documento
						},
						'tx': '',
						'x_offset':-8,
						'y_offset':-24
					}
				}
			}
		}
		
		if(_foto_ultima_ob != null){
			_nf++;
			_fotos_referidas[_nf]=_foto_ultima_ob;
			_eve={
				'y_pos':_foto_ultima_ob.y_pos,
				'ini': _foto_ultima_ob.ini,
				'img': _foto_ultima_ob.img,
				'tx':_nf,
				'x_offset':_foto_ultima_ob.x_offset,
				'y_offset':_foto_ultima_ob.y_offset
			}
			_gra.eventos.push(_eve);		
		}
		
		if(_iniciada=='si' &&  _terminada=='no' && _obdata.fecha_diashoy >= _ConfGra.dias_dehoy_inicio){
				//última observación
				//entra en el gráfico
				_eve={
					'y_pos':Math.floor(_ConfGra.encabez_alto+(_fila*_ConfGra.fila_alto)-2),
					'ini': Math.floor((-1 * _ConfGra.dias_dehoy_inicio) * _ConfGra.dias_ancho)-2,
					'img': _ConfGra.tilde_vacio,
					'tx':_obdata.avance+'%',
					'x_offset':0,
					'y_offset':-12
				}
				_gra.eventos.push(_eve);		
		}
		_fila ++;
	}
	
	
	dibujarContenidosGrafico(_gra);	
	
	dibujarFotos(_gra);	
}


	
function dibujarContenidosGrafico(_gra){	

		
	//console.log(_gra);
	
	_canvas=document.querySelector('#canvasgrafico');
	
	
	
	_canvas.setAttribute('height',(Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto);
	_canvas.setAttribute('width',_ConfGra.canvas_ancho);
	_alto=(Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto;
	if(_alto>30000){
		alert('El reporte es demasiado grande. Solo se mostrará una parte del gantt');
		_alto=30000;
	}
	_canvas.setAttribute('height',_alto);
			
	_ctx = _canvas.getContext('2d');
	
	
	
		
		//dibuja fondo blanco
	_ctx.fillStyle = 'rgba(256,256,256,1)';
	_ctx.fillRect( //fillect(x, y, width, height)
		0, 
		0,
		_ConfGra.canvas_ancho,
		(Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto 
	);
	
	
	for(_n in _gra.findes){	
		_elem=_gra.findes[_n];
		
		_pos_y_fila=_ConfGra.encabez_alto;
		
		_ctx.fillStyle = 'rgba(220,220,220,1)';
		_ctx.strokeStyle = 'rgba(0,0,0,0)';
				   
		_ctx.fillRect( //fillect(x, y, width, height)
			_elem.ini, 
			_pos_y_fila,
			_elem.fin-_elem.ini,
			(Object.keys(_gra.tareas).length * _ConfGra.fila_alto)
		);
	}
	

	_ctx.fillStyle = 'rgba(255,200,200,1)';
	_ctx.strokeStyle = 'rgba(0,0,0,0)';
			   
	_ctx.fillRect( //fillect(x, y, width, height)
		 _gra.hoy.ini, 
		_pos_y_fila,
		_gra.hoy.fin-_gra.hoy.ini,
		(Object.keys(_gra.tareas).length * _ConfGra.fila_alto)
	);
	
	
		
	for(_n in _gra.annos){	
		
		_elem=_gra.annos[_n];
		
		_pos_y_fila=_ConfGra.encabez_alto;
		
		//dibujar linea vertica
		_ctx.fillStyle = 'rgba(0,0,0,0)';
		_ctx.strokeStyle = 'rgba(0,0,0,1)';
		_ctx.lineWidth = 3;		
		_ctx.beginPath();
		_ctx.moveTo( _elem.ini +0.5 , (_pos_y_fila-37));
		_ctx.lineTo( _elem.ini +0.5, (Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto);
		_ctx.stroke();
		
		// dibujar texto		
		_ctx.font = '16px serif';
		_ctx.fillStyle = 'rgba(0,0,0,1)';
		_ctx.textAlign = 'center';
		
		_y_inner = (_ConfGra.barra_separa + _ConfGra.barra_alto)*3 + _ConfGra.barra_separa - 2;		
		
		_ctx.fillText(//strokeText(text, x, y [, maxWidth])
			_elem.tx, 
			(_elem.ini+_elem.fin)/2, 
			(_pos_y_fila-20)
		);	
		
	}
	
	//Linea horizontal sobre meses
	_ctx.beginPath();
	_ctx.moveTo( 0.5 , _ConfGra.encabez_alto-19+0.5);
	_ctx.lineTo(  _ConfGra.canvas_ancho +0.5, _ConfGra.encabez_alto - 17 +0.5);
	_ctx.stroke();
	
	//Linea horizontal sobre años
	_ctx.beginPath();
	_ctx.moveTo( 0.5 , _ConfGra.encabez_alto-37+0.5);
	_ctx.lineTo(  _ConfGra.canvas_ancho +0.5, _ConfGra.encabez_alto - 33 +0.5);
	_ctx.stroke();
	
	//AL final del gráfico
	_ctx.beginPath();
	_ctx.moveTo( 0.5 , (Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto-0.5);
	_ctx.lineTo(  _ConfGra.canvas_ancho +0.5,(Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto-0.5);
	_ctx.stroke();
	
	for(_n in _gra.meses){	
		_elem=_gra.meses[_n];
		
		_pos_y_fila=_ConfGra.encabez_alto;
		
		//dibujar linea
		_ctx.fillStyle = 'rgba(0,0,0,0)';
		_ctx.strokeStyle = 'rgba(0,0,0,1)';
		_ctx.lineWidth = 1;
		
		_ctx.beginPath();
		_ctx.moveTo( _elem.ini +0.5, (_pos_y_fila-17));
		_ctx.lineTo( _elem.ini +0.5, (Object.keys(_gra.tareas).length * _ConfGra.fila_alto) + _ConfGra.encabez_alto);
		_ctx.stroke();
		
		// dibujar texto		
		_ctx.font = '14px serif';
		_ctx.fillStyle = 'rgba(0,0,0,1)';
		_ctx.textAlign = 'center';
		_y_inner = (_ConfGra.barra_separa + _ConfGra.barra_alto)*3 + _ConfGra.barra_separa;			
		_ctx.fillText(//strokeText(text, x, y [, maxWidth])
			_elem.tx, 
			(_elem.ini+_elem.fin)/2, 
			(_pos_y_fila-5)
		);			
	}
	_ctx.beginPath();
	_ctx.moveTo( 0.5 , _ConfGra.encabez_alto-2+0.5);
	_ctx.lineTo(  _ConfGra.canvas_ancho +0.5, _ConfGra.encabez_alto - 2 +0.5);
	_ctx.stroke();
				
	//dibujar referencias en encabezado
	_x_ref=_ConfGra.canvas_ancho*0.5;	
	_ctx.textAlign = 'right';		
	_ctx.font = '11px sans-serif';
			
		//barra planeado
			_ctx.fillStyle = 'rgba(0,0,0,0)';
			_ctx.strokeStyle = 'rgba(0,0,0,1)';
			_ctx.setLineDash([3, 2]);
			_ctx.lineDashOffset=-0.5;		   
			_ctx.strokeRect( //strokeRect(x, y, width, height)
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)/2-0.5,
				_ConfGra.barra_alto-0.5,
				(_ConfGra.canvas_ancho-_x_ref)*0.4, 
				_ConfGra.barra_alto
			);	
			
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Período planificado para la ejecución de la tarea:', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-5.5,
				_ConfGra.barra_alto*2-1.5
			);	
			
				
		//barra hecho
			_ctx.fillStyle = 'rgba(100,100,256,1)';
			_ctx.strokeStyle = 'rgba(0,0,0,1)';
			_ctx.setLineDash([]);
			_ctx.fillRect( //fillRect(x, y, width, height)
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-0.5,
				_ConfGra.barra_alto*3-0.5,
				(_ConfGra.canvas_ancho-_x_ref)*0.4, 
				_ConfGra.barra_alto
			);
			_ctx.strokeRect( //strokeRect(x, y, width, height)
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-0.5,
				_ConfGra.barra_alto*3-0.5,
				(_ConfGra.canvas_ancho-_x_ref)*0.4, 
				_ConfGra.barra_alto
			);
						
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Período verificado de tarea activa:', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-5.5,
				_ConfGra.barra_alto*4-1.5
			);	
			
		//icono inicio
			_ctx.drawImage(// image, dx, dy, [dWidth], [dHeight]
				_ConfGra.tilde_ini,
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5,
				_ConfGra.barra_alto*5-1
			);
			
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Primera fecha de actividad relevada:', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-5.5,
				_ConfGra.barra_alto*6-1.5
			);	
			
		//icono fin
			_ctx.drawImage(// image, dx, dy, [dWidth], [dHeight]
				_ConfGra.tilde_fin,
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.9,
				_ConfGra.barra_alto*5-1
			);	
			
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Fecha relevada con tarea completa:', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.9-5.5,
				_ConfGra.barra_alto*6-1.5
			);
		
		//icono foto
			_ctx.drawImage(// image, dx, dy, [dWidth], [dHeight]
				_ConfGra.tilde_foto,
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5,
				_ConfGra.barra_alto*7
			);	
			
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Registro fotográfico (al final del informe):', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.5-5.5,
				_ConfGra.barra_alto*8-1.5
			);
			
			
		//icono vacio
			_ctx.drawImage(// image, dx, dy, [dWidth], [dHeight]
				_ConfGra.tilde_vacio,
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.9,
				_ConfGra.barra_alto*7-4
			);
			
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				'Avance relevado a la fecha:', 
				_x_ref+(_ConfGra.canvas_ancho-_x_ref)*0.9-5.5,
				_ConfGra.barra_alto*8-1.5
			);
		
	for(_n in _gra.tareas){		
		
		_pos_y_fila=((_n)* _ConfGra.fila_alto) + _ConfGra.encabez_alto;		
		
		_tarea=_gra.tareas[_n];
		//console.log(_tarea);
		//dibujar fila planificada					
		_y_inner = _ConfGra.barra_separa;
		
		_ctx.fillStyle = 'rgba(0,0,0,0)';
		_ctx.strokeStyle = 'rgba(0,0,0,1)';
		_ctx.setLineDash([3, 2]);
		_ctx.lineDashOffset=-0.5;		   
		_ctx.strokeRect( //strokeRect(x, y, width, height)
			_tarea.plan['ini']+3.5 ,
			(_pos_y_fila + _y_inner)+0.5,
			_tarea.plan['ancho'], 
			_ConfGra.barra_alto
		);
		//console.log(_tarea.plan['ini'], (_pos_y_fila + _y_inner),	_tarea.plan['ancho'], 	_ConfGra.barra_alto);
		
		//dibujar fila hecho
		if(_tarea.hecho.formulado=='si'){
			_y_inner = (_ConfGra.barra_separa + _ConfGra.barra_alto)*1 + _ConfGra.barra_separa;

			_ctx.fillStyle = 'rgba(100,100,256,1)';
			_ctx.strokeStyle = 'rgba(0,0,0,1)';
			_ctx.setLineDash([]);

			_ctx.fillRect( //fillRect(x, y, width, height)
				_tarea.hecho['ini']+0.5, 
				(_pos_y_fila + _y_inner)+0.5,
				_tarea.hecho['ancho'], 
				_ConfGra.barra_alto
			);
			_ctx.strokeRect( //strokeRect(x, y, width, height)
				_tarea.hecho['ini']+0.5, 
				(_pos_y_fila + _y_inner)+0.5,
				_tarea.hecho['ancho'], 
				_ConfGra.barra_alto
			);
		}
			
		// dibujar final demorado				
			if(_tarea.hecho_extendido['formulado']=='si'){
				
				_ctx.fillStyle = 'rgba(200,50,50,1)';
				_ctx.strokeStyle = 'rgba(0,0,0,0)';
				_ctx.setLineDash([]);
						   
				_ctx.fillRect( //fillRect(x, y, width, height)
					_tarea.hecho_extendido['ini']+0.5, 
					(_pos_y_fila + _y_inner)+0.5,
					_tarea.hecho_extendido['ancho'],
					_ConfGra.barra_alto
				);				
			}
				
		// dibujar texto		
			_ctx.font = '14px sans-serif';
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			
			_ctx.textAlign = 'left';
			_y_inner = (_ConfGra.barra_separa + _ConfGra.barra_alto)*3 + _ConfGra.barra_separa;			
			
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				_tarea.texto.tx, 
				_tarea.texto.ini, 
				(_pos_y_fila + _y_inner + _tarea.texto.y_offset)
			);					
	}
	
	
	for(_n in _gra.eventos){		
		
		_eve=_gra.eventos[_n];
		_pos_y_fila=_eve.y_pos;
		_y_inner = _ConfGra.barra_separa;
		_ctx.textAlign = 'left';
		
		_ctx.drawImage(// image, dx, dy, [dWidth], [dHeight]
			_eve.img,
			_eve.ini,
			Math.floor(_pos_y_fila + _y_inner)
		);
		
		// dibujar texto		
		if(_eve.tx!=''){
			_ctx.font = '12px sans-serif';
			_ctx.fillStyle = 'rgba(0,0,0,1)';
			_y_inner = (_ConfGra.barra_separa + _ConfGra.barra_alto)*3 + _ConfGra.barra_separa;			
			
			_ctx.fillText(//strokeText(text, x, y [, maxWidth])
				_eve.tx, 
				_eve.ini+_eve.x_offset+1.5, 
				Math.floor((_pos_y_fila + _y_inner))+_eve.y_offset-10				
			);	
		}
	}
}

function dibujarFotos(_gra){


	_marcos_en_fila=0;
	for(_nf in _fotos_referidas){		
		if(_fotos_referidas[_nf].meta==undefined){continue;}
		
		if(_marcos_en_fila==0 ||_marcos_en_fila==2){
			_fila=document.createElement('div');
			_fila.setAttribute('class','fila');
			document.querySelector('#registro_foto').appendChild(_fila);
			_marcos_en_fila=0;
		}
		
		
		_eve=_fotos_referidas[_nf];
		//console.log(_eve);
		
		_marco=document.createElement('div');
		_marco.setAttribute('class','marco');
		_fila.appendChild(_marco);
		_marcos_en_fila++;
		
		_foto=document.createElement('img');
		_foto.setAttribute('class','foto');
		_ruta='./documentos/p_'+_PanId+'/TAR/original/';	
		_foto.setAttribute('src',_ruta+_eve.meta.foto_archivo);
		_marco.appendChild(_foto);
		
		_num_fot=document.createElement('div');
		_marco.appendChild(_num_fot);
		_num_fot.setAttribute('class','numero_foto');
		_num_fot.innerHTML=_nf+'<img id="iconofoto" src="./img/icono_foto.png">';
		
		_p=document.createElement('p');
		_marco.appendChild(_p);
		_p.setAttribute('class','epigrafe');
		
		_f=_eve.meta.obs_fecha.split('-');
		_p.innerHTML=_f[2]+' / '+_f[1]+' / '+_f[0];
		
		if(_eve.meta.foto_epigrafe!=''){
			_p.innerHTML+=' - '+_eve.meta.foto_epigrafe;
		}
		
		
		_p=document.createElement('p');
		_marco.appendChild(_p);
		_p.innerHTML='Tarea: ';
		
		
		_codigo=document.createElement('span');
		_p.appendChild(_codigo);
		_codigo.setAttribute('class','codigo');
		_codigo.innerHTML=_eve.meta.tarea_codigo;
		
		_p.innerHTML+=' - ';
		
		_nombre=document.createElement('span');
		_p.appendChild(_nombre);
		_nombre.setAttribute('class','nombre');
		_nombre.innerHTML=_eve.meta.tarea_nombre;		
		_nombre=document.createElement('span');
		
		
		_p.innerHTML+='<br>';
		
		if(_eve.meta.tarea_en1_nombre!=''){
			_p.innerHTML+='<span class="contexto1">en: '+_eve.meta.tarea_en1_nombre+'</span>';			
			if(_eve.meta.tarea_en2_nombre!=''){
				_p.innerHTML+=' / ';
			}
		}
		if(_eve.meta.tarea_en2_nombre!=''){
			_p.innerHTML+='<span class="contexto2">en: '+_eve.meta.tarea_en2_nombre+'</span>';		
		}
		
		
		_p.appendChild(_nombre);
		_nombre.setAttribute('class','avance');
		_nombre.innerHTML='<br> Avance estimado al finalizar la jornada:<span class="valor">'+ _eve.meta.obs_avance+' %</span>';
		
		
		
	}	
	
}

_anchohoja=1200;
_altohoja=_anchohoja*29.7/21-80; //(A4)
_altoencabezado=0;
_altopie=0;
_num_pag=0;
_pagina_con_lugar='no';
_Pagina_activa=null;
function paginar(_pag){

	document.querySelector('#page #botonpaginar').setAttribute('estado','inactivo');
	_Pagina_activa=nuevapagina();	
	_contenidos=document.querySelectorAll('#page > #contenidoextenso > *');
	
	for(_cn in _contenidos){
		
		
		if(typeof _contenidos[_cn] != 'object'){continue;}	
		//console.log('contenido:'+_contenidos[_cn].getAttribute('id'));
		
		//recortar canvas para múltiples hojas repitiendo encabezado
		if(_contenidos[_cn].getAttribute('id')=="canvasgrafico"){//console.log('es canvas');
			_espaciolibre=_altohoja-_Pagina_activa.clientHeight-_ConfGra.encabez_alto;
			if(_contenidos[_cn].clientHeight>_espaciolibre){
				_aporte=Array();	
				_scanline=0;				
				while(_scanline<_contenidos[_cn].clientHeight){//console.log('scan: '+_scanline+'; ');
					
					if(_espaciolibre<_ConfGra.encabez_alto){_espaciolibre=_altohoja-80;}//salto de página si no entra el encabezado
					
					_scan_remanente=_contenidos[_cn].clientHeight-_scanline;
					
					if(_scanline>0){
						//si no es la primera página
						//replica encabezado en cada hoja.	
						_canvas_enc_cortado=crop(_contenidos[_cn], {'x':0,'y':0}, {'x':_contenidos[_cn].clientWidth,'y':_ConfGra.encabez_alto})
						_aporte.push(_canvas_enc_cortado);
						
						
						
						_avance=Math.min(_espaciolibre,_scan_remanente);
						
						
					}else{
						
						_avance=Math.min(_espaciolibre+_ConfGra.encabez_alto,_scan_remanente);
						
					}
					
					_scanline_n=_scanline+_avance;
					
					_canvas_cortado=crop(_contenidos[_cn], {'x':0,'y':_scanline}, {'x':_contenidos[_cn].clientWidth,'y':_scanline_n})
					_aporte.push(_canvas_cortado);
					_espaciolibre=_altohoja-80;	
					_scanline=_scanline_n;
				}					
				_contenidos[_cn].parentNode.removeChild(_contenidos[_cn]);
			}else{
				_aporte=Array(_contenidos[_cn]);
			}
			
			
		}else{
			_aporte=Array(_contenidos[_cn]);
		}
		for(_na in _aporte){
		_Pagina_activa.appendChild(_aporte[_na]);
		
			if(_Pagina_activa.clientHeight>_altohoja){
				_Pagina_activa=nuevapagina();
				_Pagina_activa.appendChild(_aporte[_na]);
			}
		}
		
	}
	_c=document.querySelector('#pageborde #page #contenidoextenso');
	_c.parentNode.removeChild(_c);
}


function crop(can, a, b) {
    // get your canvas and a context for it
    var ctx = can.getContext('2d');
    
    // get the image data you want to keep.
    var imageData = ctx.getImageData(a.x, a.y, b.x, b.y);
  
    // create a new cavnas same as clipped size and a context
    var newCan = document.createElement('canvas');
    newCan.width = b.x - a.x;
    newCan.height = b.y - a.y;
    var newCtx = newCan.getContext('2d');
  
    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);
  
    return newCan;    
 }
			  
function nuevapagina(){
	
	_num_pag++;
	
	_pag=document.createElement('div');
	_pag.setAttribute('class','pagina');
	_pag.setAttribute('num_pag',_num_pag);
	document.querySelector('#pageborde #page').appendChild(_pag);
	return(_pag);
	
}

function dibujarHistogramaJornadas(){
//HISTOGRAMAS	
	_meses=Object.keys(_Reporte.resumen.superposicion_jornadas_alacanzada.tmp).length;
	_v_max=0;
	_acc_max=0;
	for(_mes in _Reporte.resumen.superposicion_jornadas_alacanzada.tmp){
		_v_max=Math.max(_v_max,_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes]);
		_acc_max+=_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes];
	}
	_pos_x=0;
	_pos_y=0;
	_alto=70;
	_ancho=205;
	_margen=2;
	_anchofecha=((_ancho-(2*_margen))/_meses);
	//dibujar linea vertica
	_canvas=document.querySelector('#contenidoextenso [indicador="superposicion_jornadas_alacanzada"] #histograma canvas#acc');
	_canvas.setAttribute('height',_alto);
	_canvas.setAttribute('width',_ancho);
	_ctx = _canvas.getContext('2d');
	_ctx.fillStyle = 'rgba(8,175,217,0)';
	_ctx.strokeStyle = 'rgba(8,175,217,1)';
	_ctx.lineWidth = 3;		
	_ctx.beginPath();
	_ctx.moveTo( 0.5+_margen , _alto-0.5-_margen);	
	_c=0;
	_acc=0;
	for(_mes in _Reporte.resumen.superposicion_jornadas_alacanzada.tmp){
		_c++;
		_v=_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes];
		_acc+=_v;
		_porc=_acc/_acc_max;
		_altoval=_porc*(_alto-2*_margen);
		_ctx.lineTo( 0.5+_anchofecha*_c+_margen, _alto-0.5-_altoval-_margen);
	}
	_ctx.stroke();
	
	_c=0;
	_acc=0;
	for(_mes in _Reporte.resumen.superposicion_jornadas_alacanzada.tmp){
		_c++;		
		_d=_mes.split('-');
		_date=new Date();
		
		if(_d[0]== _date.getFullYear() && parseInt(_d[1])==(_date.getMonth()+1)){			
			_v=_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes];
			_acc+=_v;
			_porc=_acc/_acc_max;
			_altoval=_porc*(_alto-2*_margen);
			
			_ctx.strokeStyle = 'rgba(255,200,200,1)';
			_ctx.lineWidth = 1;	
			_ctx.beginPath();	
			_ctx.moveTo( 0.5+_anchofecha*_c+_margen , _alto-0.5-_margen);	
			_ctx.lineTo( 0.5+_anchofecha*_c+_margen , 0.5+_margen);
			_ctx.stroke();
			
			_ctx.strokeStyle = 'rgba(8,175,217,1)';
			_ctx.beginPath();
			console.log(0.5+_anchofecha*_c+_margen, _alto-0.5-_altoval-_margen);
			_ctx.arc( 0.5+_anchofecha*_c+_margen, _alto-1.5-_altoval-_margen-2, 4, 0, 2 * Math.PI, false);
			_ctx.stroke();
			break;
		}		
	}

		//linea vertical mitad	
	_ctx.strokeStyle = 'rgba(150,150,150,1)';
	_ctx.lineWidth = 1;	
	_ctx.beginPath();	
	_ctx.moveTo(  Math.round(_anchofecha*_meses/2)+0.5+_margen , _alto-0.5-_margen);	
	_ctx.lineTo(  Math.round(_anchofecha*_meses/2)+0.5+_margen , 0.5+_margen);
	_ctx.stroke();
	
		//linea vertical 3/4
	_ctx.strokeStyle = 'rgba(150,150,150,1)';
	_ctx.lineWidth = 1;	
	_ctx.beginPath();	
	_ctx.moveTo( Math.round(_anchofecha*_meses*.75)+0.5+_margen , _alto-0.5-_margen);	
	_ctx.lineTo( Math.round(_anchofecha*_meses*.75)+0.5+_margen , 0.5+_margen);
	_ctx.stroke();
	
	//línea diagonal de referencia	
	_ctx.strokeStyle = 'rgba(100,100,100,1)';
	_ctx.lineWidth = 1;		
	_ctx.beginPath();
	_ctx.moveTo( 0.5+_margen , _alto-0.5-_margen);	
	_ctx.lineTo(  0.5+_anchofecha*_meses+_margen, 0.5+_margen);
	_ctx.stroke();
	
	
	_canvas2=document.querySelector('#contenidoextenso [indicador="superposicion_jornadas_alacanzada"] #histograma canvas#abs');
	_canvas2.setAttribute('height',_alto);
	_canvas2.setAttribute('width',_ancho);
	_ctx = _canvas2.getContext('2d');
	_ctx.fillStyle = 'rgba(8,175,217,0)';
	_ctx.strokeStyle = 'rgba(8,175,217,1)';
	_ctx.lineWidth = 3;		
	_ctx.beginPath();
	_ctx.moveTo( 0.5+_margen , _alto-0.5-_margen);	
	_c=0;
	for(_mes in _Reporte.resumen.superposicion_jornadas_alacanzada.tmp){
		_c++;
		_v=_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes];		
		_porc=_v/_v_max;
		_altoval=_porc*(_alto-2*_margen);
		_ctx.lineTo( 0.5+_anchofecha*_c+_margen, _alto-0.5-_altoval-_margen);
	}
	_ctx.stroke();
	
	_c=0;
	for(_mes in _Reporte.resumen.superposicion_jornadas_alacanzada.tmp){
		_c++;		
		_d=_mes.split('-');
		_date=new Date();
		
		if(_d[0]== _date.getFullYear() && parseInt(_d[1])==(_date.getMonth()+1)){			
			_v=_Reporte.resumen.superposicion_jornadas_alacanzada.tmp[_mes];
			_porc=_v/_v_max;
			_altoval=_porc*(_alto-2*_margen);
			
			_ctx.strokeStyle = 'rgba(255,200,200,1)';
			_ctx.lineWidth = 1;	
			_ctx.beginPath();	
			_ctx.moveTo( 0.5+_anchofecha*_c+_margen , _alto-0.5-_margen);	
			_ctx.lineTo( 0.5+_anchofecha*_c+_margen , 0.5+_margen);
			_ctx.stroke();
			
			_ctx.strokeStyle = 'rgba(8,175,217,1)';
			_ctx.beginPath();
			console.log(0.5+_anchofecha*_c+_margen, _alto-0.5-_altoval-_margen);
			_ctx.arc( 0.5+_anchofecha*_c+_margen, _alto-0.5-_altoval-_margen, 4, 0, 2 * Math.PI, false);
			_ctx.stroke();
			break;
		}		
	}
	
		//linea vertical mitad	
	_ctx.strokeStyle = 'rgba(150,150,150,1)';
	_ctx.lineWidth = 1;	
	_ctx.beginPath();	
	_ctx.moveTo(  Math.round(_anchofecha*_meses/2)+0.5+_margen , _alto-0.5-_margen);	
	_ctx.lineTo(  Math.round(_anchofecha*_meses/2)+0.5+_margen , 0.5+_margen);
	_ctx.stroke();
	
		//linea vertical 3/4
	_ctx.strokeStyle = 'rgba(150,150,150,1)';
	_ctx.lineWidth = 1;	
	_ctx.beginPath();	
	_ctx.moveTo( Math.round(_anchofecha*_meses*.75)+0.5+_margen , _alto-0.5-_margen);	
	_ctx.lineTo( Math.round(_anchofecha*_meses*.75)+0.5+_margen , 0.5+_margen);
	_ctx.stroke();
		
	//línea horizontal de promedio
	_ctx.strokeStyle = 'rgba(100,100,100,1)';
	_ctx.lineWidth = 1;		
	_ctx.beginPath();
	_porc=(_acc_max/_meses)/_v_max;
	_ctx.moveTo(0.5+_margen ,  _porc*(_alto-2*_margen));
	_ctx.lineTo(0.5+_anchofecha*_meses, _porc*(_alto-2*_margen));
	_ctx.stroke();
}
