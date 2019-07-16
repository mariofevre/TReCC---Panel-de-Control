

<div id='form_com' draggable='true' ondragstart='drag_start(event,this);'>	
    <div id='dBordeL' class='dragborde izquierdo'></div>

    <input type="hidden" name="id" value="">
    
    <div class='escroleable'>
    
        <div class='paquete identificacion'>

                <h2>Identificación</h2>
                <div class="dato" id='respuesta'>
                    ¿Dar por cerrada la comunicación original?
                    <input type='hidden' name='respuesta' id='respuesta' value=''>
                    <select name="Paraorigen">
                        <option value="no">no</option>
                        <option value="si">si</option>
                        <option value="si (controlar)">si (controlar)</option>
                    </select>
                    nombre: <span id="nombre"></span> <br>
                    del: <span id="fecha"></span>
                    
                </div>	

                <div class='medio'>
                    <h3>Sentido</h3>
                    <select name='sentido' onchange='cambioSentido(this);supervisarId1(event)'>
                        <option sentido='saliente' name='sentido' value='saliente'><?php echo $Config['com-sale'];?></option>
                        <option sentido='entrante' name='sentido' value='entrante'><?php echo $Config['com-entra'];?></option>
                    </select>
                </div>
                
                <div class='medio'>
                    <h3><?php echo $Config['com-ident'];?></h3>
                    <input id="ident" class="chico" type="text" size="2" name="ident" onkeyup='supervisarId1(event)'>
                    <div id='supervisornumero' onmouseover='pararCuenta()' onmouseover='pararCuenta()' onmouseout='reiniciarSeconds()'>
                    	<a id='botoncerrarcuenta' onclick='finalizarCuenta()'>x</a>
                    	<div id='cuentaregresiva'></div>
                    	<div id='mensaje'></div>  
                    	<div id='coincidenciatotal'></div>  
                    	<div id='coincidenciamedia'></div>
                    	<div id='coincidenciabaja'></div>   
                    </div>
                </div>
                   <script >
                   
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
                   </script>
                <div class='medio'>
                    <h3><?php echo $Config['com-identdos'];?></h3>
                    <input id="identdos" class="chico" type="text" size="2" name="identdos">
                </div>
                
                <div class='medio'>	
                    <h3><?php echo $Config['com-identtres'];?></h3>
                    <input id="identtres" class="chico" type="text" size="2" name="identtres">
                </div>	
        
                <h2>Definición</h2>
                <h3>Nombre o resumen</h3>
                <input id="nombre" class="chico" type="text" size="2" name="nombre">			
                    
                <div class='medio'>	
                    <input type="radio" value="extraoficial" name="preliminar" onchange='supervisarId1(event)'>preliminar<br>
                    <input type="radio" value="oficial" name="preliminar" onchange='supervisarId1(event)'>oficial
                </div>	
                
                <div class='medio'>	
                    <input id='relevante' name='relevante' type='hidden'>
                    <input for='relevante' type='checkbox' onclick="alternasino(this);">esta comunicación resulta relevante
                </div>	
                

        </div>
  
        <div class='paquete evolucion'>
            <h2>Vinculación:</h2>
                <h3>presenta <span id='docP'>0</span> documentaciones</h3>
                <h3>aprueba <span id='docA'>0</span> documentaciones</h3>
                <h3>rechaza <span id='docR'>0</span> documentaciones</h3>
            <h2>Evolución:</h2>
            <div id='fechas'></div>
            <div id='cerrTogle' onclick='togleCerr(this);'>
                <input type='hidden' name='cerrado'>
                <img visible='no' title='en curso' val='no' src='./img/obspend.png'>
                <img visible='no' title='terminada' val='si' src='./img/obsok.png'>
                <img visible='no' title='terminada a controlar' val='si (controlar)' src='./img/ojo.png'>
            </div>
            <h3 id='tareas'>
                <span>requiere respuesta</span>
                <input id='requerimiento' name='requerimiento' type='hidden'>
                <input for='requerimiento' type='checkbox' onclick="alternasinoTareas(this);">
                <div id='seccporescrito' class='cuarto'>
                    <span>solo por<br>escrito</span>
                    <input id='requerimientoescrito' name='requerimientoescrito' type='hidden'>
                    <input for='requerimientoescrito' type='checkbox' onclick="alternasinoTareas(this);">
                </div>
                <div class='medio'>
                    <div id='fechainicio'>
                        <span>desde</span>
                        <input name='fechainicio_d' class='dia'><input name='fechainicio_m' class='dia'><input name='fechainicio_a' class='mini'
                        ><input onclick="hoyFecha(this)" value="hoy" type="button"
                        ><input onclick="borrFecha(this)" value="borr" type="button">
                    </div>
                    <div id='fechaobjetivo'>
                        <span>hasta</span>
                        <input name='fechaobjetivo_d' class='dia'><input name='fechaobjetivo_m' class='dia'><input name='fechaobjetivo_a' class='mini'
                        ><input onclick="hoyFecha(this)" value="hoy" type="button"
                        ><input onclick="borrFecha(this)" value="borr" type="button">
                    </div>
                </div>
                
            </h3>
            
        </div>								

        <div id='adjuntos' class='paquete adjuntos'>
            <h2>
                Documentos Subidos:
                <form action='' enctype='multipart/form-data' method='post' id='uploader' ondragover='resDrFile(event)' ondragleave='desDrFile(event)'>
                    <div id='contenedorlienzo'>									
                        <div id='upload'>
                            <label>Arraste todos los archivos aquí.</label>
                            <input exo='si' multiple='' id='uploadinput' type='file' name='upload' value='' onchange='cargarCmp(this);'></label>
                        </div>
                    </div>
                </form>
            </h2>
            <div id="listadosubiendo">
            </div>
            
            <div id='adjuntoslista'></div>
        </div>
        <div class='paquete clasificacion'><h2>Clasificación</h2>
            <div class='medio' id="grupoa">	
                <h3 id='grupoa'>Grupo Primario</h3>				
                <input type='hidden' id='id_p_grupos_id_nombre_tipoa' name='id_p_grupos_id_nombre_tipoa'>
                <input type='text' class='chico' id='id_p_grupos_id_nombre_tipoa_n' name='id_p_grupos_id_nombre_tipoa_n'
                    onKeyUp="actualizarGrupos(event,this);"
                >
                <div class='sugerencia uno'>
                    <a idg='0' onclick="cargarOpcion(this);">-vacio-</a><br>
                </div>
                
                <div class='sugerencia dos'>
            
                </div>
                
                <a id='mostrar' title='mostrar grupos que no han sido utilizados para comunicaciones' 
                    onclick='
                    this.style.display="none";
                    this.parentNode.querySelector("#desmostrar").style.display="block";
                    this.parentNode.querySelector(".sugerencia.tres").style.display="block";
                    '>
                        >> + otros grupos 
                </a>
                <a id='desmostrar' style='display:none;' title='ocultar grupos que no han sido utilizados para comunicaciones' 
                    onclick='
                    this.style.display="none";
                    this.parentNode.querySelector("#mostrar").style.display="block";
                    this.parentNode.querySelector(".sugerencia.tres").style.display="none";
                    '>
                        << - otros grupos 
                </a>						
                <div id='masgruposa' class='sugerencia tres' style='display:none;'>
                </div>
            </div>
            
            <div class='medio' id="grupob">	
                <h3 id='grupob'>Grupo Secundario</h3>				
                <input type='hidden' id='id_p_grupos_id_nombre_tipob' name='id_p_grupos_id_nombre_tipob'>
                <input type='text' class='chico' id='id_p_grupos_id_nombre_tipob_n' name='id_p_grupos_id_nombre_tipob_n'
                    onKeyUp="actualizarGrupos(event,this);"
                >
                <div class='sugerencia uno'>
                    <a idg='0' onclick="cargarOpcion(this);">-vacio-</a><br>
                </div>
                
                <div class='sugerencia dos'>
            
                </div>
                
                <a id='mostrar' title='mostrar grupos que no han sido utilizados para comunicaciones' 
                    onclick='
                    this.style.display="none";
                    this.parentNode.querySelector("#desmostrar").style.display="block";
                    this.parentNode.querySelector(".sugerencia.tres").style.display="block";
                    '>
                        >> + otros grupos 
                </a>
                <a id='desmostrar' style='display:none;' title='ocultar grupos que no han sido utilizados para comunicaciones' 
                    onclick='
                    this.style.display="none";
                    this.parentNode.querySelector("#mostrar").style.display="block";
                    this.parentNode.querySelector(".sugerencia.tres").style.display="none";
                    '>
                        << - otros grupos 
                </a>		
                <div id='masgruposb' class='sugerencia tres' style='display:none;'>
                </div>
            </div>
                                        

        </div>	

        <div class='paquete texto'>
            <h3>	
            	Descripción extendida, transcripción 
            	<div id='aclaraciones' estado='0' onclick='this.setAttribute("estado",(this.getAttribute("estado")*-1));'>ver aclaraciones <div id='contenido'></div></div>
            	<a   id='guardamodelo' onclick='this.parentNode.querySelector("form#guardarmodelo").style.display="block";'>guardar como modelo</a>
            	<a   id='cargamodelo'  onclick='this.querySelector("#listacarga").style.display="block";'>
            		cargar modelo 
            		<div id='listacarga'>
            			<span onclick='event.stopPropagation();this.parentNode.style.display="none";'>cerrar</span>
            			<div id='modelos'>
            				- sin modelos disponibles -
            			</div>	
            		</div>
            	</a>
            	<form id='guardarmodelo'>
            		<a onclick='event.preventDefault();event.stopPropagation();this.parentNode.style.display="none";'>cerrar</a><br>
            		<label>nombre: </label><input name='mod_nombre'>
            		<input type='hidden' name='mod_contenido'><br>
            		<label>aclaraciones: </label><textarea name='mod_aclaraciones'></textarea>
            		<input type='submit' value='guardar' onclick='guardarModelo(event);'>
            	</form>
            </h3>
            <textarea class='mceEditable' id='descripcion' name="descripcion"></textarea>
        </div>
	 </div>
	<input id='ejec' type="submit" onclick='guardarCom(this,"")' class="general" value="crear">
	<input type="button" class="imprimir general" value="grd/impr." onclick="guardarCom(this,'aimpresion');">				
	<input type="button" class="cancela general" value="cancelar" onclick="cancelarCom(this);">
	<input id='elim' type="button" onclick='eliminarCom(this)' class="eliminar" value="eliminar">	
	
</div>
<script>
	$('head').append('<link rel="stylesheet" type="text/css" href="./COM/COM_form_com.css">');
	
	
	function imprimir(){		
		_url="./COM_impresion.php?idcom="+document.querySelector('#form_com input[name="id"]').value;
		 window.location.assign(_url);
	}
	
	function supervisarId1(_event){
		
		_this=document.querySelector('#form_com input#ident');
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
	
</script>	


<script type="text/javascript" src="./js/tinymce43/tinymce.min.js"></script>
   




<script type="text/javascript">

	tinymce.init({ 
		selector:'textarea.mceEditable',
		plugins: "code",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "615px",
		height : "280px",
		skin : "unmapa",
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
</script>


<script type='text/javascript'>

    var _DatosListadito={};
    
    $('input').on('mouseover',function(){
        document.querySelector('#form_com').removeAttribute('draggable');
        _excepturadragform='si';
    });
    $('input').on('mouseout',function(){
    document.querySelector('#form_com').setAttribute('draggable','true');
        _excepturadragform='no';
    });

	///funciones cargar el formulario
	var _ComCargada={};
	function iraCom(_event,_id,_idrespuesta){
		/*
			if (_event.ctrlKey) {
				if(_id!=''){
					window.location.assign('./agrega_fcom.php?tabla=comunicaciones&accion=cambia&id='+_id+'&salida=COM_reporte&salidaid='+_id);
				}else{
					
				}
				return;
			}*/
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
			
			if(_id==''){
				_form.querySelector('#ejec').value='crear';
			}else{
				_form.querySelector('#ejec').value='guardar';
			}
			
			if(_idrespuesta==''){
				_form.querySelector('#respuesta.dato').style.display='none';
				_form.querySelector('input#respuesta').value='';
			}else{
				_form.querySelector('#respuesta.dato').style.display='block';
				_form.querySelector('input#respuesta').value=_idrespuesta;
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
        
					_ComCargada=_res.data;
					//console.log(_res);
					
					_form=document.querySelector('#form_com');
					
					_form.querySelector('input[name="id"]').value=_res.data.id;
										
					_opt=_form.querySelector('select[name="sentido"] option[value="'+_res.data.sentido+'"]');
					_opt.selected = true;
					
					_form.querySelector('select[name="sentido"]').setAttribute('sentido',_res.data.sentido);
					
					_form.querySelector('input[name="ident"]').value=_res.data.ident;
					
					_form.querySelector('input[name="identdos"]').value=_res.data.id2;
					_form.querySelector('input[name="identtres"]').value=_res.data.id3;
					
					_form.querySelector('input[name="nombre"]').value=_res.data.nombre;					
					_form.querySelector('input[name="relevante"]').value=_res.data.relevante;
					
					if(_res.data.relevante=='no'){_form.querySelector('input[for="relevante"]').checked = false;}
					_form.querySelector('input[name="preliminar"][value="'+_res.data.preliminar+'"]').checked = true;

					_c=Object.keys(_res.data.documentosasociados.presentados).length;
					_span=_form.querySelector('span#docP');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','enevaluacion');
					}else{
						_span.removeAttribute('class');
					}
					
					_c=Object.keys(_res.data.documentosasociados.aprobados).length;
					_span=_form.querySelector('span#docA');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','aprobada');
					}else{
						_span.removeAttribute('class');
					}
					
					_c=Object.keys(_res.data.documentosasociados.rechazados).length;
					_span=_form.querySelector('span#docR');
					_span.innerHTML=_c;
					if(_c>0){
						_span.setAttribute('class','rechazada');
					}else{
						_span.removeAttribute('class');
					}
					
					
					var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea
					
					if(editor!=null){
					
						editor.setContent(_res.data.descripcion);
						
					}else{
						
						document.querySelector('#form_com .paquete.texto textarea#descripcion').value=_res.data.descripcion;
					
					}
					
					
					
					document.querySelector('.paquete.texto h3 > #aclaraciones').setAttribute('estado',0);
					document.querySelector('.paquete.texto h3 > #aclaraciones #contenido').innerHTML='';
					document.querySelector('#form_com .paquete.texto form#guardarmodelo').style.display='none';
					document.querySelector('#form_com .paquete.texto a#cargamodelo #listacarga').style.display='none';
					
					if(Object.keys(_res.data.modelos).length>0){
						document.querySelector('#listacarga #modelos').innerHTML='';
					}
					for(_idmod in _res.data.modelos){
						_datamod=_res.data.modelos[_idmod];
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
					
					if(_res.data.descripcion!=''){
						document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='inline-block';
						document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='none';
					}else{
						document.querySelector('#form_com  .paquete.texto a#guardamodelo').style.display='none';
						document.querySelector('#form_com  .paquete.texto a#cargamodelo').style.display='inline-block';
					}
					
					_contf=0;
					console.log(_res.data.sentido);
					
					_form.querySelector('.paquete.evolucion #fechas').innerHTML='';
					
					
					if(Object.keys(_res.data.estadosOrden[_res.data.sentido]).length>0){						
						for(_eo in _res.data.estadosOrden[_res.data.sentido]){
							_contf++;
							console.log('fechatipificada:'+_contf);
							console.log(_res.data.estadosOrden[_res.data.sentido][_eo]);
							
							if(isNaN(_eo)){continue;}
							_edat=_res.data.estados[_res.data.estadosOrden[_res.data.sentido][_eo]];
						
							_h3=document.createElement('h3');
							_h3.innerHTML="<span class='titulo'>"+_edat.descripcion+"</span>";
							console.log(_edat);
							if(_edat.desde==''){
								_fe='--';
							}else{
								_fe=_edat.desde;
							}
							_fff=_fe.split('-');
							
							_in=document.createElement('input');
							_in.setAttribute('class','dia');	
							_in.setAttribute('id','dia');
							_in.setAttribute('name','fecha_'+_edat.id+'_d');
							_in.value=_fff[2];
							_h3.appendChild(_in);
							
							_in=document.createElement('input');
							_in.setAttribute('class','dia');
							_in.setAttribute('id','mes');
							_in.setAttribute('name','fecha_'+_edat.id+'_m');
							_in.value=_fff[1];
							_h3.appendChild(_in);
							
							_in=document.createElement('input');
							_in.setAttribute('class','mini');
							_in.setAttribute('id','ano');
							_in.setAttribute('name','fecha_'+_edat.id+'_a');
							_in.value=_fff[0];
							_h3.appendChild(_in);
						
							_in=document.createElement('input');
							_in.setAttribute('type','button');
							_in.setAttribute('onclick','hoyFecha(this)');
							_in.value='hoy';
							_h3.appendChild(_in);
							if(_edat.desde==''){_in.style.display='inline-block';}
							
							_in=document.createElement('input');
							_in.setAttribute('type','button');
							_in.setAttribute('onclick','borrFecha(this)');
							_in.value='borr';
							_h3.appendChild(_in);
							if(_edat.desde!=''){_in.style.display='inline-block';}
							
							_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
						}	
					}else{
						_contf++;
						_h3=document.createElement('h3');						
						_h3.innerHTML="<span class='titulo'>Emisión</span>";
						console.log(_res.data.zz_reg_fecha_emision);
						if(_res.data.zz_reg_fecha_emision==''){
							_fe='--';
						}else{
							_fe=_res.data.zz_reg_fecha_emision;
						}
						_fff=_fe.split('-');
						
						_in=document.createElement('input');
						_in.setAttribute('class','dia');	
						_in.setAttribute('id','dia');					
						_in.setAttribute('name','zz_reg_fecha_emision_d');
						_in.value=_fff[2];
						_h3.appendChild(_in);
						
						_in=document.createElement('input');
						_in.setAttribute('class','dia');
						_in.setAttribute('id','mes');
						_in.setAttribute('name','zz_reg_fecha_emision_m');
						_in.value=_fff[1];
						_h3.appendChild(_in);
						
						_in=document.createElement('input');
						_in.setAttribute('class','mini');
						_in.setAttribute('id','ano');
						_in.setAttribute('name','zz_reg_fecha_emision_a');
						_in.value=_fff[0];
						_h3.appendChild(_in);
					
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','hoyFecha(this)');
						_in.value='hoy';
						_h3.appendChild(_in);
						if(_res.data.zz_reg_fecha_emision==''){_in.style.display='inline-block';}
						
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','borrFecha(this)');
						_in.value='borr';
						_h3.appendChild(_in);
						if(_res.data.zz_reg_fecha_emision!=''){_in.style.display='inline-block';}
						
						_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
					}
					
					if(_contf<2){
						_h3=document.createElement('h3');
						_h3.innerHTML="<span class='titulo'>Cierre</span>";
						
						if(_res.data.cerradodesde==''){
							_fe='--';
						}else{
							_fe=_res.data.cerradodesde;
						}
						_fff=_fe.split('-');
						
						_in=document.createElement('input');
						_in.setAttribute('class','dia');				
						_in.setAttribute('id','dia');		
						_in.setAttribute('name','cerradodesde_d');
						_in.value=_fff[2];
						_h3.appendChild(_in);
						
						_in=document.createElement('input');
						_in.setAttribute('class','dia');
						_in.setAttribute('id','mes');
						_in.setAttribute('name','cerradodesde_m');
						_in.value=_fff[1];
						_h3.appendChild(_in);
						
						_in=document.createElement('input');
						_in.setAttribute('class','mini');
						_in.setAttribute('id','ano');
						_in.setAttribute('name','cerradodesde_a');
						_in.value=_fff[0];
						_h3.appendChild(_in);
					
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','hoyFecha(this)');
						_in.value='hoy';
						_h3.appendChild(_in);
						if(_res.data.cerradodesde==''){_in.style.display='inline-block';}
						
						_in=document.createElement('input');
						_in.setAttribute('type','button');
						_in.setAttribute('onclick','borrFecha(this)');
						_in.value='borr';
						_h3.appendChild(_in);
						if(_res.data.cerradodesde!=''){_in.style.display='inline-block';}
						
						_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);	
						
					}
					
					
					_cerrT=_form.querySelector('.paquete.evolucion #cerrTogle');
                    _cerrT.querySelector('input[name="cerrado"]').value=_res.data.cerrado;
                    if(_res.data.cerrado==''){_res.data.cerrado='no';}
                    _cerrT.querySelector('img[val="'+_res.data.cerrado+'"]').setAttribute('visible','si');
                    _h3.appendChild(_cerrT);
					if(_res.data.cerrado=='no'){
						_cerrT.parentNode.querySelector('#dia').setAttribute('estado','cerrado');
						_cerrT.parentNode.querySelector('#mes').setAttribute('estado','cerrado');
						_cerrT.parentNode.querySelector('#ano').setAttribute('estado','cerrado');
					}					
					
					
					_tareas=_form.querySelector('.paquete.evolucion #tareas');					
					_h3.parentNode.insertBefore(_tareas,_h3);
					
					_hoy=_tareas.querySelector('#fechainicio input[value="hoy"]');
					_borr=_tareas.querySelector('#fechainicio input[value="borr"]');
					if(_res.data.fechainicio==''){
						_hoy.style.display='inline-block';
						_borr.style.display='none';
					}else{
						
						_hoy.style.display='none';
						_borr.style.display='inline-block';
					}
					if(_res.data.fechainicio==''){
						_fe='--';
					}else{
						_fe=_res.data.fechainicio;
					}
					_fff=_fe.split('-');
					_tareas.querySelector('#fechainicio input[name="fechainicio_a"]').value=_fff[0];
					_tareas.querySelector('#fechainicio input[name="fechainicio_m"]').value=_fff[1];
					_tareas.querySelector('#fechainicio input[name="fechainicio_d"]').value=_fff[2];
										
					_hoy=_tareas.querySelector('#fechaobjetivo input[value="hoy"]');
					_borr=_tareas.querySelector('#fechaobjetivo input[value="borr"]');
					if(_res.data.fechaobjetivo==''){
						_hoy.style.display='inline-block';
						_borr.style.display='none';
					}else{
						
						_hoy.style.display='none';
						_borr.style.display='inline-block';
					}
					if(_res.data.fechaobjetivo==''){
						_fe='--';
					}else{
						_fe=_res.data.fechaobjetivo;
					}
					_fff=_fe.split('-');
					_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_a"]').value=_fff[0];
					_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_m"]').value=_fff[1];
					_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_d"]').value=_fff[2];
					
					_ch=_tareas.querySelector('input[for="requerimiento"]');
					if(_res.data.requerimiento=='si'){
						_ch.checked=true;
					}else{
						_ch.checked=false;
					}
					alternasinoTareas(_ch);
					
					
					_ch=_tareas.querySelector('input[for="requerimientoescrito"]');
					if(_res.data.requerimiento=='si'){
						_ch.checked=true;
					}else{
						_ch.checked=false;
					}
					alternasinoTareas(_ch);

					if(Object.keys(_res.data.adjuntos).length>0){
						for(_na in _res.data.adjuntos){
							if(typeof _res.data.adjuntos[_na] != 'object'){continue;}							
							_adat=_res.data.adjuntos[_na];							
							anadirAdjunto(_adat);							
						}
					}
						
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa"]').value=_res.data.id_p_grupos_id_nombre_tipoa;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipoa_n"]').value=_res.data.grupoa;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipob"]').value=_res.data.id_p_grupos_id_nombre_tipob;
					_form.querySelector('input[name="id_p_grupos_id_nombre_tipob_n"]').value=_res.data.grupob;
					
					
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
                                    //console.log('el b es :'+_res.data.id_p_grupos_id_nombre_tipob);
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
                            
                            $('input').on('mouseover',function(){
                                document.querySelector('#form_com').removeAttribute('draggable');
                                _excepturadragform='si';
                            });
                            $('input').on('mouseout',function(){
                            document.querySelector('#form_com').setAttribute('draggable','true');
                                _excepturadragform='no';
                            });
						}
					})	
					
				}
			})			
		}
</script>

		

<script type='text/javascript'>
//funciones de arrastre para desplazar y cambiar el ctamaño del formulario

	var isResizing = false,
    lastDownX = 0,
    _anchoinicial = 0,
    _equisInicial = 0;
    
    var _excepturadragform='no';
    
    
        
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
    
    
</script>










<script type='text/javascript'>

	///funciones para guardar archivos

	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #contenedorlienzo').style.backgroundColor='lightblue';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #contenedorlienzo').removeAttribute('style');
	}
	
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
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
			parametros.append('upload',files[i]);
			parametros.append('nfile',_nFile);
			parametros.append('idcom',document.querySelector('#form_com > input[name="id"]').value);
			
			var _nombre=files[i].name;
			_upF=document.createElement('p');
			_upF.setAttribute('nf',_nFile);
			_upF.setAttribute('class',"archivo");
			_upF.setAttribute('size',Math.round(files[i].size/1000));
			_upF.innerHTML=files[i].name;
			document.querySelector('#listadosubiendo').appendChild(_upF);
			
			_nn=_nFile;
			xhr[_nn] = new XMLHttpRequest();
			xhr[_nn].open('POST', './COM/COM_ed_guarda_adjunto.php', true);
			xhr[_nn].upload.li=_upF;
			xhr[_nn].upload.addEventListener("progress", updateProgress, false);
			
			
			xhr[_nn].onreadystatechange = function(evt){
				//console.log(evt);
				
				if(evt.explicitOriginalTarget.readyState==4){
					var _res = $.parseJSON(evt.explicitOriginalTarget.response);
					//console.log(_res);

					if(_res.res=='exito'){							
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.parentNode.removeChild(_file);							
						anadirAdjunto(_res.data);
					}else{
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.innerHTML+=' ERROR';
						_file.style.color='red';
					}
					//cargaTodo();
					//limpiarcargando(_nombre);
				
				}
				
			}
			xhr[_nn].send(parametros);				
		    
		}			
	}
	
	function updateProgress(evt) {
	  if (evt.lengthComputable) {
	    var percentComplete = 100 * evt.loaded / evt.total;		   
	    this.li.style.width=Math.round(percentComplete)+"%";
	  } else {
	    // Unable to compute progress information since the total size is unknown
	  }
	  
	}
			
</script>

<script type='text/javascript'>			
	

	

	
</script>

<script type='text/javascript'>
//funciones de envio y salida del formulario
	
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
		
		_ct=document.querySelector('#form_com .paquete.evolucion #fechas #cerrTogle');
		document.querySelector('#form_com .paquete.evolucion').appendChild(_ct);
		
		_ct=document.querySelector('#form_com .paquete.evolucion #fechas #tareas');
		document.querySelector('#form_com .paquete.evolucion').appendChild(_ct);
		
		document.querySelector('#form_com .paquete.evolucion #fechas').innerHTML='';
		
		document.querySelector('#form_com #adjuntos #listadosubiendo').innerHTML='';
		document.querySelector('#form_com #adjuntos #adjuntoslista').innerHTML='';
		
		document.querySelector('#form_com input[for="relevante"]').checked = true;
		document.querySelector('#form_com input[name="relevante"]').value = 'si';
	}
		
	function cancelarCom(_this){
		_this.parentNode.style.display='none';
		limpiarFormCom();	
	}
	
	function eliminarCom(_this){
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
						_this.parentNode.style.display='none';
						limpiarFormCom();
					}
				}
			});

		}	
	}
	
		
				
	function guardarCom(_this,_modo){
		_form=document.querySelector('#form_com');
		
		_param={
			"sentido":_form.querySelector('.identificacion [name="sentido"]').value,
			"modo":_modo
		};
		
		if(_form.querySelector('input[name="preliminar"][value="extraoficial"]').checked){
			_param.preliminar="extraoficial";
		}else{
			_param.preliminar="oficial";
		}
				
		_innn=document.querySelectorAll('#form_com input');
		
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
		
		
		//accion para absorber código basura generado por editores de texto al copiar pegar
		var editor = tinymce.get('descripcion'); // use your own editor id here - equals the id of your textarea
		_con=$('#' + 'descripcion').html( editor.getContent({format: 'html'}));
		//_con=editor.getContent({format: 'html'});
		
		//console.log('_con:');
		//console.log(_con);
		_contcrudo = _con['0'].textContent;
		//console.log('_contcrudo:');
		//console.log(_contcrudo);			
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
</script>

<script type='text/javascript'>
//funciones interactivas del formulario

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
	console.log(_ComCargada.sentido);
	console.log(_ComCargada.estadosOrden[_ComCargada.sentido]);
	console.log(Object.keys(_ComCargada.estadosOrden[_ComCargada.sentido]).length);
	if(Object.keys(_ComCargada.estadosOrden[_ComCargada.sentido]).length>0){						
		for(_eo in _ComCargada.estadosOrden[_ComCargada.sentido]){
			_contf++;
			console.log(_ComCargada.estadosOrden[_ComCargada.sentido][_eo]);
			
			if(isNaN(_eo)){continue;}
			_edat=_ComCargada.estados[_ComCargada.estadosOrden[_ComCargada.sentido][_eo]];
		
			_h3=document.createElement('h3');
			_h3.innerHTML="<span class='titulo'>"+_edat.descripcion+"</span>";
			
			if(_edat.desde==''){
				_fe='--';
			}else{
				_fe=_edat.desde;
			}
			_fff=_fe.split('-');
			
			_in=document.createElement('input');
			_in.setAttribute('class','dia');	
			_in.setAttribute('id','dia');	
			_in.setAttribute('name','fecha_'+_edat.id+'_d');
			_in.value=_fff[2];
			_h3.appendChild(_in);
			
			_in=document.createElement('input');
			_in.setAttribute('class','dia');
			_in.setAttribute('id','mes');	
			_in.setAttribute('name','fecha_'+_edat.id+'_m');
			_in.value=_fff[1];
			_h3.appendChild(_in);
			
			_in=document.createElement('input');
			_in.setAttribute('class','mini');
			_in.setAttribute('id','ano');
			_in.setAttribute('name','fecha_'+_edat.id+'_a');
			_in.value=_fff[0];
			_h3.appendChild(_in);
		
			_in=document.createElement('input');
			_in.setAttribute('type','button');
			_in.setAttribute('onclick','hoyFecha(this)');
			_in.value='hoy';
			_h3.appendChild(_in);
			if(_edat.desde==''){_in.style.display='inline-block';}
			
			_in=document.createElement('input');
			_in.setAttribute('type','button');
			_in.setAttribute('onclick','borrFecha(this)');
			_in.value='borr';
			_h3.appendChild(_in);
			if(_edat.desde!=''){_in.style.display='inline-block';}
			
			_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
		}	
	}else{
		_contf++;
		_h3=document.createElement('h3');						
		_h3.innerHTML="<span class='titulo'>Emisión</span>";
		
		if(_ComCargada.zz_reg_fecha_emision==''){
			_fe='--';
		}else{
			_fe=_ComCargada.zz_reg_fecha_emision;
		}
		_fff=_fe.split('-');
		
		_in=document.createElement('input');
		_in.setAttribute('class','dia');		
		_in.setAttribute('id','dia');					
		_in.setAttribute('name','zz_reg_fecha_emision_d');
		_in.value=_fff[2];
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('class','dia');
		_in.setAttribute('id','mes');
		_in.setAttribute('name','zz_reg_fecha_emision_m');
		_in.value=_fff[1];
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('class','mini');
		_in.setAttribute('id','ano');
		_in.setAttribute('name','zz_reg_fecha_emision_a');
		_in.value=_fff[0];
		_h3.appendChild(_in);
	
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','hoyFecha(this)');
		_in.value='hoy';
		_h3.appendChild(_in);
		if(_ComCargada.zz_reg_fecha_emision==''){_in.style.display='inline-block';}
		
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','borrFecha(this)');
		_in.value='borr';
		_h3.appendChild(_in);
		if(_ComCargada.zz_reg_fecha_emision!=''){_in.style.display='inline-block';}
		
		_form.querySelector('.paquete.evolucion #fechas').appendChild(_h3);
	}
	if(_contf<2){
		_h3=document.createElement('h3');
		_h3.innerHTML="<span class='titulo'>Cierre</span>";
		
		if(_ComCargada.cerradodesde==''){
			_fe='--';
		}else{
			_fe=_ComCargada.cerradodesde;
		}
		_fff=_fe.split('-');
		
		_in=document.createElement('input');
		_in.setAttribute('class','dia');	
		_in.setAttribute('id','dia');						
		_in.setAttribute('name','cerradodesde_d');
		_in.value=_fff[2];
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('class','dia');
		_in.setAttribute('id','mes');
		_in.setAttribute('name','cerradodesde_m');
		_in.value=_fff[1];
		_h3.appendChild(_in);
		
		_in=document.createElement('input');
		_in.setAttribute('class','mini');
		_in.setAttribute('id','ano');
		_in.setAttribute('name','cerradodesde_a');
		_in.value=_fff[0];
		_h3.appendChild(_in);
	
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','hoyFecha(this)');
		_in.value='hoy';
		_h3.appendChild(_in);
		if(_ComCargada.cerradodesde==''){_in.style.display='inline-block';}
		
		_in=document.createElement('input');
		_in.setAttribute('type','button');
		_in.setAttribute('onclick','borrFecha(this)');
		_in.value='borr';
		_h3.appendChild(_in);
		if(_ComCargada.cerradodesde!=''){_in.style.display='inline-block';}
		
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
		_borr=_tareas.querySelector('#fechainicio input[value="borr"]');
	if(_ComCargada.fechainicio==''){
		_hoy.style.display='inline-block';
		_borr.style.display='none';
	}else{
		
		_hoy.style.display='none';
		_borr.style.display='inline-block';
	}
	if(_ComCargada.fechainicio==''){
		_fe='--';
	}else{
		_fe=_ComCargada.fechainicio;
	}
	_fff=_fe.split('-');
	_tareas.querySelector('#fechainicio input[name="fechainicio_a"]').value=_fff[0];
	_tareas.querySelector('#fechainicio input[name="fechainicio_m"]').value=_fff[1];
	_tareas.querySelector('#fechainicio input[name="fechainicio_d"]').value=_fff[2];
						
	_hoy=_tareas.querySelector('#fechaobjetivo input[value="hoy"]');
	_borr=_tareas.querySelector('#fechaobjetivo input[value="borr"]');
	if(_ComCargada.fechaobjetivo==''){
		_hoy.style.display='inline-block';
		_borr.style.display='none';
	}else{
		
		_hoy.style.display='none';
		_borr.style.display='inline-block';
	}
	if(_ComCargada.fechaobjetivo==''){
		_fe='--';
	}else{
		_fe=_ComCargada.fechaobjetivo;
	}
	_fff=_fe.split('-');
	_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_a"]').value=_fff[0];
	_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_m"]').value=_fff[1];
	_tareas.querySelector('#fechaobjetivo input[name="fechaobjetivo_d"]').value=_fff[2];
	
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
		console.log(_n);
		_l=_n.substring(_n.length-1,_n.length);
		console.log(_l);
		if(_l=='a'){_inps[_ninps].value='<?php echo date('Y');?>';}
		if(_l=='m'){_inps[_ninps].value='<?php echo date('m');?>';}
		if(_l=='d'){_inps[_ninps].value='<?php echo date('d');?>';}
		_this.parentNode.querySelector('input[value="borr"]').style.display="inline-block";
		_this.removeAttribute('style');
	}	
}
function actualizarGrupos(_event,_this){
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

</script>



