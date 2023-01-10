<?php
/**
* PAN_usuarios.php
*
* Este genera la base HTML para representar y editar los usuarios con acceso al panel activo
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	common
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2012 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 (GPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU General Public License" para más detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aquí: <http://www.gnu.org/licenses/>.
*/





ini_set('display_errors',true);
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.
$UsuarioI = $_SESSION['panelcontrol']->USUARIO;
$PanelI = $_SESSION['panelcontrol']->PANELI;
include ('./a_comunes/a_comunes_consulta_usuario.php');//buscar el usuario activo.
include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

if($UsuarioI==""){header('Location: ./login.php');}


$Base = $_SESSION['panelcontrol']->DATABASE_NAME;

$query="SELECT * FROM $Base.usuarios WHERE id=$UsuarioI ORDER BY id DESC";
$Consulta = $Conec1->query($query);
$row = $Consulta->fetch_assoc();
$UsuarioN =$row['Nombre'];

$query="SELECT * FROM $Base.paneles WHERE id=$PanelI ORDER BY id DESC";
$Consulta = $Conec1->query($query);
$row = $Consulta->fetch_assoc();
$PanelN =$row['nombre'];
$PanelD=$row['descripcion'];


foreach($Usuario['Acc'] as $g => $nivel){
    //echo $g.$nivel;
    if($nivel=='editor'||$nivel=='administrador'){
        $HabilitadoEdicion='si';
    }elseif($nivel=='relevador'){
        header('location: ./inicio.php');
    }elseif($nivel=='visitante'||$nivel=='auditor'){
        $HabilitadoEdicion='no';
    }
}	
?>


<head>
	<title>Panel.TReCC</title>

	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">			
	
	<link rel="stylesheet" type="text/css" href="./PAN/css/PAN_usuarios.css?v=<?php echo time();?>">


	<style type="text/css">
	</style>

</head>
<body>
		
		<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
		<script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
		
		<?php insertarmenu(); ?>

		<div id="pageborde">
		<div id="page">
				
			<h1>Administrar Usuarios</h1>			
			<h2><?php echo $PanelN;?></h2>
				
			<div id="bajada">	
				<?php echo $PanelN;?>
				<div class="texto"><?php echo $PanelD;?></div>
				<a onclick='formularUsuario(this)'>crear nuevo usuario</a>

			</div>						

<?php
	$query="
		(
			SELECT concat(nombre, ' ', apellido, '(',log,')') as nombre, id 
			FROM paneles.usuarios
			WHERE zz_id_p_paneles='$PanelI'
		)UNION(
			SELECT nombre, id 
			FROM paneles.USU_usuarios_TReCC
			WHERE USU_usuarios_TReCC.id NOT IN (SELECT id_usuario FROM paneles.accesos WHERE id_paneles = '$PanelI')
		)
	";
	$Consulta = $Conec1->query($query);
	echo $Conec1->error;	
	while($row = $Consulta->fetch_assoc()){
		$ConAddUsu[$row['id']]=$row;
	}
	
	
	$query="
		SELECT concat(nombre, ' ', apellido, '(',log,')') as nombre, id 
		FROM usuarios
		ORDER BY nombre DESC 
	";
	$Consulta = $Conec1->query($query);
	while($row = $Consulta->fetch_assoc()){
		if(!isset($ConAddUsu[$row['id']])){
			$ConAddUsuMas[$row['id']]=$row;
		}
	}	
	
	$query="SELECT * FROM grupos WHERE id_p_paneles_id_nombre='$PanelI' AND tipo ='b'";
	$GruposHabilitados = $Conec1->query($query);
	
					       
?>
			
			<div id="contenidoextenso">
					
				<div class="paquete" href="./usuarios.php">
					
					<form action="./agrega.php" method="post">	
						<input type="hidden" name="tabla" value="accesos">
						<input type="hidden" name="nivel" value="visitante">
						<input type="hidden" name="id_paneles" value="<?php echo $PanelI;?>">
						<input type="hidden" name="salida" value="./usuarios">
						
						<div class='texto'>agregar</div>
															
						<select name='id_usuario' onchange='enviarAsignarUsuario(this)'><option value=''> - elegir - </option>
						<?php
							foreach($ConAddUsu as $f) {
							    echo "<option value='" . $f["id"] . "'>". $f["nombre"] . "</option>";
							}
						?>
						</select>
						<br>
					</form>
					<form action="./agrega.php" method="post">	
						<input type="hidden" name="tabla" value="accesos">
						<input type="hidden" name="nivel" value="visitante">
						<input type="hidden" name="id_paneles" value="<?php echo $PanelI;?>">
						<input type="hidden" name="salida" value="./usuarios">
						
						
						
						<br><div class='texto'>agregar de mis colaboradores en otros paneles:</div>
						
						<select name='id_usuario' onchange='enviarAsignarUsuario(this)'><option value=''> - elegir - </option>	
						<?php
							foreach($ConAddUsuMas as $f){
							    echo "<option value='" . $f["id"] . "'>". $f["nombre"] . "</option>";
							}
						?>
						</select>
					</form>	
					
					<div id='grupoUsuariosAsignados'>					
					
					</div>
														
				</div>
					
			</div>	
			
		</div>
			
<form id='formnuevousuario'>
	<input type="hidden" name="zz_AUTOPANEL" value="<?php echo $PanelI;?>">
	<label>Nombre</label><input name='nombre'><br>
	<label>Apellido</label><input name='apellido'><br>
	<label>e-mail</label><input name='mail'><br>
	<label>Log</label><input id="loginput" name='log'><span id='logstat'></span><br>
	<label>Password</label><input type='password' name='password'><br>
	<label>Nacimiento</label><input type='date' name='nacimiento'><br>
	<input type='button' onclick='enviarFormularioUsuario()' value='crear usuario'>
	
</form>
</body>
<script type='text/javascript'>
	
	var _PanelId="<?php echo $PanelI;?>";
	var _DatosGrupos=Array();
	
	
	_parametros = {
        'panid': _PanelId
    };
    $.ajax({
        url:   './PAN/PAN_grupos_consulta.php',
        type:  'post',
        data: _parametros,
        success:  function (response){
            var _res = $.parseJSON(response);
            console.log(_res);
            _DatosGrupos=_res.data;
            cargarUsuarios();
        }
    })
    
    function validarCadena(email) {
	  var re = /[$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
	  return re.test(email);
	}
		
	function validarlog() {
	  var $result = $("#logstat");
	  var email = $("#loginput").val();
	  $result.text("");
	
	  if(email.length>0){
	  	
		  	if(email.length<6){
		  		$result.text(email + " es muy corto");
		    	$result.css("color", "red");
		    	return  	
		  	}
		  	
	  		
		  if (validarCadena(email)) {
		    $result.text(email + " caracteres inválidos");
		    $result.css("color", "red");
		    return  	
		  } else {
		    $result.text(email + " consultando");
		    $result.css("color", "orange");
		    consultarLogDisponible();
		  }
		 
	  
	  }
	  return false;
	}
	
	$("#loginput").on("keyup", validarlog);
	
	function consultarLogDisponible(){
		_log=$("#loginput").val();
		
		_param={
			'log':_log 
		}
		
		$.ajax({
			data:_param,
			url:'./SIS/SIS_consulta_log_disponible.php',
			type:'post',
			success:  function (response) {
				var _res = $.parseJSON(response);
				console.log(_res);
				
				if(_res.data.valido=='no'){
					$("#logstat").text("invalido");
					$("#logstat").css("color", "red");
				}else{
					$("#logstat").text("ok");
					$("#logstat").css("color", "green");
				}					
			}					
		})
		
		
	}
	
    
	function enviarCambioNivelUsuario(_this){
		_idusu=_this.parentNode.getAttribute("idusu");
		_idacc=_this.parentNode.getAttribute("idacc");
		_params={
			'zz_AUTOPANEL':_PanelId,
			'idusu':_idusu,
			'idacc':_idacc,
			'nivel':_this.value			
		};
		$.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_cambia_acceso.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try {
                    JSON.parse(response);
                }catch(_err){
                    console.log(_err);
                    alert('el servidor entregó un texto de formato inesperado');
                    return;
                }
                
                 var _res = $.parseJSON(response);
                _estadodecarga='activo';
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                	_form=document.querySelector('#formnuevousuario');
					_form.reset();
					_form.style.display='none';
					cargarUsuarios();
				}
			}
		})
	}

	function enviarAsignarUsuario(_this){
		_idusu=_this.value;
		_params={
			'zz_AUTOPANEL':_PanelId,
			'idusu':_idusu,
			'nivel':_this.value			
		};
		$.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_asigna_usuario.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try {
                    JSON.parse(response);
                }catch(_err){
                    console.log(_err);
                    alert('el servidor entregó un texto de formato inesperado');
                    return;
                }
                
                 var _res = $.parseJSON(response);
                _estadodecarga='activo';
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                	_form=document.querySelector('#formnuevousuario');
					_form.reset();
					_form.style.display='none';
					cargarUsuarios();
				}
			}
		})		
	}
	
	function formularUsuario(){
		_form=document.querySelector('#formnuevousuario');
		_form.reset();
		_form.style.display='block';		
	}

	function enviarFormularioUsuario(){
		_form=document.querySelector('#formnuevousuario');
		_inps=_form.querySelectorAll('input');
		_params={};
		for(_in in _inps){
			if(typeof _inps[_in] != 'object'){continue;}
			if(_inps[_in].getAttribute('name')==undefined){
				continue;				
			}
			_name=_inps[_in].getAttribute('name');
			_params[_name]=_inps[_in].value;
		}
		
		 $.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_crea_usuario.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try {
                    JSON.parse(response);
                }catch(_err){
                    console.log(_err);
                    alert('el servidor entregó un texto de formato inesperado');
                    return;
                }
                
                 var _res = $.parseJSON(response);                
                _estadodecarga='activo';
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                	_form=document.querySelector('#formnuevousuario');
					_form.reset();
					_form.style.display='none';
					cargarUsuarios();
				}
			}
		})	
		
	}
	
	function cargarUsuarios(){
		document.querySelector('#grupoUsuariosAsignados').innerHTML='';
		_params={
			'zz_AUTOPANEL':_PanelId			
		};
		$.ajax({
            data:  _params,
            url:   './PAN/PAN_usuarios_consulta.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try {
                    JSON.parse(response);
                }catch(_err){
                    console.log(_err);
                    alert('el servidor entregó un texto de formato inesperado');
                    return;
                }
                
                 var _res = $.parseJSON(response);
                
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                	
                	_cont=document.querySelector('#grupoUsuariosAsignados');	                	
                	
                	for(_nn in _res.data.niveles){	                		
                	
	                	_h2=document.createElement('h2');
	                	_h2.innerHTML=_res.data.niveles[_nn].nombre;
	                	_cont.appendChild(_h2);
	                	
                		for(_ida in _res.data.accesos){
                			_data=_res.data.accesos[_ida];
                			if(_data.nivel!=_res.data.niveles[_nn].nombre){continue;}
                			
                			
                			_fila=document.createElement('div');
                			_fila.setAttribute('class','fila');
                			_fila.setAttribute('idusu',_data.idusu);
                			_fila.setAttribute('idacc',_ida);
                			_cont.appendChild(_fila);
                		
                			_div=document.createElement('a');
                			_div.title='eliminar acceso';
                			_div.setAttribute('onclick','alert("función en desarrollo"),eliminarAcceso(this)');
                			_div.innerHTML='x - ';
                			_fila.appendChild(_div);
                			
                			_div=document.createElement('div');
                			_div.setAttribute('class','nombre');
                			_div.innerHTML=_data.nombreusu;
                			_fila.appendChild(_div);
                			
                			_div=document.createElement('select');
                			_div.setAttribute('name','nivel');
                			_div.setAttribute('onchange','enviarCambioNivelUsuario(this)');
                			_fila.appendChild(_div);
                			
            				for(_Selnn in _res.data.niveles){
            					_datSel=_res.data.niveles[_Selnn];    
            					_op=document.createElement('option');
	                			_op.setAttribute('value',_datSel.nombre);
	                			_op.title=_datSel.descripcion;
	                			_op.innerHTML=_datSel.nombre;
	                			_div.appendChild(_op);
	                			//if(_data.nivel==_datSel.nombre){_op.se}
            				}   
                			_div.value=_data.nivel;
                			
                			        
    						_diva=document.createElement('div');
    						_diva.setAttribute('class','grupoa');
    						_fila.appendChild(_diva);
    						
    						_div=document.createElement('input');
                			_div.setAttribute('type','hidden');
                			_div.setAttribute('id','cid_p_grupos_id_nombre_tipoa');
                			_div.setAttribute('name','id_p_grupos_id_nombre_tipoa');
                			_diva.appendChild(_div);
                			
                			
                			_grupoa=_DatosGrupos.grupos[_data.id_p_grupos_id_nombre];
                			
                			_div=document.createElement('input');	                			
                			_div.setAttribute('name','id_p_grupos_id_nombre_tipoa-n');
                			_div.setAttribute('id','cid_p_grupos_id_nombre_tipoa-n');
                			_div.setAttribute('tipo','a');
                			_div.setAttribute('onblur','vaciarOpcionares(event)');
                			_div.setAttribute('onkeyup','activarOpciones(event,this)');
                			_div.setAttribute('onfocus','opcionarGrupos(this)');
                			if(_grupoa!=undefined){
                				_div.value=_grupoa.nombre;
                			}
                			_diva.appendChild(_div);
                			
                			_divb=document.createElement('div');
                			_divb.setAttribute('class','auxopcionar');
                			_diva.appendChild(_divb);
                			
    						_div=document.createElement('div');
                			_div.setAttribute('class','contenido');
                			_divb.appendChild(_div);
					             	 					             	 
                			_diva=document.createElement('div');
                			_diva.setAttribute('class','grupob');
    						_fila.appendChild(_diva);
    						
    						_div=document.createElement('input');
                			_div.setAttribute('type','hidden');
                			_div.setAttribute('id','cid_p_grupos_id_nombre_tipob');
                			_div.setAttribute('name','id_p_grupos_id_nombre_tipob');
                			_diva.appendChild(_div);
                			
                			
                			_grupob=_DatosGrupos.grupos[_data.id_p_grupos_id_nombre_b];
                			
                			_div=document.createElement('input');	                			
                			_div.setAttribute('name','id_p_grupos_id_nombre_tipob-n');
                			_div.setAttribute('id','cid_p_grupos_id_nombre_tipob-n');
                			_div.setAttribute('tipo','b');
                			_div.setAttribute('onblur','vaciarOpcionares(event)');
                			_div.setAttribute('onkeyup','activarOpciones(event,this)');
                			_div.setAttribute('onfocus','opcionarGrupos(this)');
                			if(_grupob!=undefined){
                				_div.value=_grupob.nombre;
                			}
                			_diva.appendChild(_div);
                			
                			_divb=document.createElement('div');
                			_divb.setAttribute('class','auxopcionar');
                			_diva.appendChild(_divb);
                			
    						_div=document.createElement('div');
                			_div.setAttribute('class','contenido');
                			_divb.appendChild(_div);
					             	 	
                		}	                			
                	}	                	
				}
			}
		})		
	}
	
	
</script>

<script type="text/javascript">
	//funciones de opcines para seleccionar grupos a y b
	 var _destino ='';
	function recargaDatosGrupos(_destino,_tipo){
        
        _destino = _destino;
        var _tipo = _tipo; 
        var _parametros = {
            'panid': _PanelId
        };
        $.ajax({
            url:  './PAN/PAN_grupos_consulta.php',
            type:  'post',
            data: _parametros,
            success:  function (response){
                var _res = $.parseJSON(response);
            
                _DatosGrupos=_res.data;
                
                for(_nn in _res.data.gruposOrden[_tipo]){
                    _grupoid=_res.data.gruposOrden[_tipo][_nn];
                    _dat=_res.data.grupos[_grupoid];
                    _anc=document.createElement('a');
                    _anc.setAttribute('onclick','cargaOpcion(this);');
                    _anc.setAttribute('regid',_grupoid);
                    _anc.innerHTML=_dat.nombre;
                    _anc.title=_dat.descripcion;
                    _destino.appendChild(_anc);
                }
            }
        })		
    }
    
	function opcionarGrupos(_this){		
		vaciarOpcionares();		
		_this.nextSibling.style.display="inline-block";
		_destino=_this.nextSibling.querySelector(".contenido");
		_id=_this.getAttribute('id');
		_tipo=_id.substring(27,28);
		recargaDatosGrupos(_destino,_tipo);		
	}
	
    function vaciarOpcionares(_event){			
        if(_event!=undefined){
                       
            if(
                _event.explicitOriginalTarget.parentNode.parentNode.parentNode.previousSibling==_event.originalTarget
                ||
                _event.explicitOriginalTarget.parentNode.parentNode.previousSibling==_event.originalTarget
                ){
                return;
            }
        }
        
        _vaciaresA=document.querySelectorAll('.auxopcionar');
        
        for(_nn in _vaciaresA){
            if(_vaciaresA[_nn].style!=undefined){
            //console.log(_vaciaresA[_nn]);
            _vaciaresA[_nn].style.display='none';
            }
        }
        
        _vaciares=document.querySelectorAll('.auxopcionar .contenido');
        for(_nn in _vaciares){
            _vaciares[_nn].innerHTML='';
        }
    }
    
    
    function activarOpciones(_event,_this){
    	//console.log(_event.keyCode);
    	if(_event.keyCode==13){
    		crearGrupo(_this);
    		return;
    	}
    	
    	filtrarOpciones();
    }
    
    function crearGrupo(_this){
    	
    	_pasar = {
    		'idacc' : _this.parentNode.parentNode.getAttribute('idacc'),
			'idusu' : _this.parentNode.parentNode.getAttribute('idusu') ,
			'tipo'  : _this.getAttribute('tipo')
    	}

        var _parametros = {
            'zz_AUTOPANEL': _PanelId,
            'tipo' : _this.getAttribute('tipo'),
            'nombre' : _this.value,
            'zz_pasar':_pasar
        };
        $.ajax({
            url:  './PAN/PAN_ed_crea_grupo.php',
            type:  'post',
            data: _parametros,
            success:  function (response){
                var _res = $.parseJSON(response);                
                
                if(_res.res!='exito'){alert("error al consutle base");return;}
            	
            	if(_res.data.grupo=='nuevo'){            		
            		//¿recargar grupos?...nah            		
				}else{
					
					enviarActualizarGrupo(_res.pasar.idacc,_res.pasar.idusu,_res.data.grupoid,_res.pasar.tipo);						
					
					
				}
            	
                _DatosGrupos=_res.data;
                
                for(_nn in _res.data.gruposOrden[_tipo]){
                	_grupoid=_res.data.gruposOrden[_tipo][_nn];
                    _dat=_res.data.grupos[_grupoid];
                    _anc=document.createElement('a');
                    _anc.setAttribute('onclick','cargaOpcion(this);');
                    _anc.setAttribute('regid',_grupoid);
                    _anc.innerHTML=_dat.nombre;
                    _anc.title=_dat.descripcion;
                    _destino.appendChild(_anc);
                }
            }
        })		
    }
    
    
     function enviarActualizarGrupo(_idacc,_idusu,_grupoid,_tipo){
    	
    	 var _parametros = {
    		'zz_AUTOPANEL': _PanelId,	
	        'idacc' : _idacc,
			'idusu' : _idusu, 		
	        'idgrupo':_grupoid,	
	        'tipo':_tipo		
    	}

        $.ajax({
            url:  './PAN/PAN_ed_cambia_acceso_grupo.php',
            type:  'post',
            data: _parametros,
     		success:  function (response){
                var _res = $.parseJSON(response);                
                
                if(_res.res!='exito'){alert("error al consutle base");return;}
            	
                
            }
        })		
    }
    
    
    
    function filtrarOpciones(){
    	//funcion sin uso ¿borrar?
    }
    
    function cargaOpcion(_this){
        console.log(_this.parentNode.parentNode.parentNode.parentNode);
        
        
        _regid =_this.getAttribute('regid');
      	_idacc =_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idacc');
      	_idusu =_this.parentNode.parentNode.parentNode.parentNode.getAttribute('idusu');
      	
      	_inputN=_this.parentNode.parentNode.previousSibling;
      	_tipo=_inputN.getAttribute('tipo');
      	
        enviarActualizarGrupo(_idacc,_idusu,_regid,_tipo);
        
        
        console.log(_regid);
        _regnom=_this.innerHTML;
        console.log(_regnom);
        _regtit=_this.title;	
                
        
        _inputN.title=_regtit;
        _inputN.value=_regnom;
        
        _inputN.focus();
        _id=_inputN.getAttribute('id');
        _ff=_id.substring(0,(_id.length-2));			
        console.log(_ff);
        
        _input=document.getElementById(_ff);
        _input.value=_regid;
        
        
        					
    }


	function eliminarAcceso(_this){
		
		_idacc = _this.parentNode.getAttribute('idacc');
		_nombre= _this.parentNode.querySelector('.nombre').innerHTML;
		_nivel = _this.parentNode.querySelector('[name="nivel"]').value;
		if(!confirm('¿Eliminamos el acceso de '+_nivel+' para '+_nombre+'?... ¿Segure?')){return;}
		
		 var _parametros = {
    		'zz_AUTOPANEL': _PanelId,	
	        'idacc' : _idacc
    	}

        $.ajax({
            url:  './PAN/PAN_ed_borra_acceso.php',
            type:  'post',
            data: _parametros,
     		success:  function (response){
                var _res = $.parseJSON(response);                
                
                if(_res.res!='exito'){alert("error al consutle base");return;}
                
                _fila=document.querySelector('.fila[idacc="'+_res.data.idacc+'"]');
                _fila.parentNode.removeChild(_fila);
            	
                
            }
        })		
		
	}
    
</script>

<script type="text/javascript">
	var _a = 0;
	var _seleccion = '';

	function mostrar(){
		$(".accionseleccion").css("color","black");
	}

	
	function esrespuesta(_origen){
		_destino = "./comunicacionesrespuesta.php?origen="+_origen+"&respuesta="+_seleccion;
		window.location = _destino;
	}

	function titila(identificador,_cuenta,_texto){
		_a = _a + _cuenta;
		var elementos = document.getElementsByName(identificador);
		if(_cuenta==1){
			_seleccionv	= _seleccion; 
			_seleccion	= _seleccion + "_" +_texto;
		}else{
			_seleccionv	= _seleccion; 
			_seleccion = _seleccion.replace("_"+_texto, "");
		}
		if(_a>0){
			var _selectos = _seleccion.split('_'); 
			for (x=0;x<elementos.length;x++){
				elementos[x].style.display = 'block';
				
				_vieja=(elementos[x].href);
				elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
				
				for (y=0;y<_selectos.length;y++){
					if (elementos[x].getAttribute("incompatible")==_selectos[y]){
						elementos[x].style.display = 'none';
					}
				}
			}
		}else{
			for (x=0;x<elementos.length;x++){			
				elementos[x].style.display = 'none';
				_vieja=(elementos[x].href);
				elementos[x].href = _vieja.replace("&destino="+_seleccionv, "&destino="+_seleccion);
			}
		}
		
	}

	function cambiame() 
{ 
    window.open("","ventanita","width=800,height=600,toolbar=0"); 
    var o = window.setTimeout("document.form1.submit();",500); 
}

	function cambiametb() 
{ 
    window.open("","ventanitatb","width=800,height=600,toolbar=0"); 
    var o = window.setTimeout("document.form1.submit();",500); 
}  
</script>
