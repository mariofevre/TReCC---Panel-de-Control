<?php
/**
* comunicaciones.php
*
 * Esta aplicación constrituye el módulo principal para seguimento de comunicaciones.  
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	comunicaciones
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2016 TReCC SA
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
ini_set('display_errors',true);
include ('./includes/header.php');//carga los recursos de consulta a base de datos y funciones de uso común.
//include ('./comunicaciones_consulta.php');//carga las funciones de consulta a la base de datos.


function terminar($Log){
	echo "<pre>".print_r($Log,true)."</pre>";
	exit;
}

include ('./login_registrousuario.php');//buscar el usuario activo.
$Log['tx'][]='nivel de acceso: '.$UsuarioAcc;
if(!isset($UsuarioAcc)){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['res']='err';
    terminar($Log); 
}

$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'si',
'visitante'=>'si'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $Log['tx'][]='error en los permisos del usuario registrado';    
    $Log['tx'][]='error en los permisos del usuario registrado. El nivel asignado: '.$UsuarioAcc.', es insuficiente';  
    $Log['tx'][]='niveles de acceso permitidos: '.print_r($nivelespermitidos,true);
    $Log['res']='err';
    header('location: ./login.php');
    //terminar($Log); 
}

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

    if(!isset($_GET['campoorden'])){$_GET['campoorden']='';}
	$campoorden=$_GET['campoorden'];	
	
	if($campoorden==''){
        if(isset($_SESSION['campoorden'])){
            $campoorden=$_SESSION['campoorden'];
        }
	}else{
        $_SESSION['campoorden']=$campoorden;
    }
    
	if($campoorden==''){$campoorden='fechaemision';}
	
	$Hoy_a = date("Y");
	$Hoy_m = date("m");	
	$Hoy_d = date("d");	
	$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;
	
	 if(!isset($_GET['grupocampo'])){$_GET['grupocampo']='';}
	$grupocampo = $_GET['grupocampo'];
	

?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/objetoscomunes.css">	
	<link rel="stylesheet" type="text/css" href="./css/documentos_comunes.css">
	<link rel="stylesheet" type="text/css" href="./css/COM.css">
	
	<?php 
	include("./includes/meta.php");
	?>
	
    <style type="text/css">
	            
	    div[editada='si'] {
		    background-color:#fff;
		    animation-name: example;
		    animation-duration: 4s;
		}
		
		/* Standard syntax */
		@keyframes example {
			0%   {background-color: #fff;}
		    5%  {background-color: #08afd9;}
		    100% {background-color: #fff;}
		}
		
		#page{
			width:690px;
			height:auto;
			padding-left:5px;
			padding-right:5px;
			background-color:#fff;
			background-image:none;
			margin:1px;
		}
		
		#pageborde{
			width:702px;
		}
		
		#encabezado{
			left: 0px;
	    	width: 100%;
	    	height: auto;
	    	top: 0px;
	    	position: relative;
			min-height: 100px;
		}

		#pie{
			left: 0px;
	    	width: 100%;
	    	height: auto;
	    	bottom: 0px;
	    	position: relative;
			min-height: 50px;
		}
		h1{
			width: 656px;position: relative;
		}
		
		@media print{
			.aux{
				display:none;	
			}
			
			#pageborde{
				border: none;
				background-color: #fff;
			}
			#page{
				border: none;
			}
		}
		
		.aux{
			position:fixed;
			width: auto;
			height: auto;
			position: fixed;
			left: 0.5vw;
			top: 0.5vh;
			border: 2px solid #08afd9;
			box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.2);
			z-index: 10;
			background-color: #fff;
			overflow-y: auto;
			cursor: move;
		}
		
		
		.aux .editando{
			display:inline-block;
			margin-right:10px;
		}		
		.aux [estado='apagado']{
			display:none;	
		}
		
		.aux a{
			display:block;
		}
		.aux textarea{
			font-size:11px;
			width:30vw;
			height:30vh;
			display:block;
		}
		.aux button{
			min-width: 0;
		}
		#editorFormato > .mce-tinymce.mce-container.mce-panel{
			display:none;			
		}
		#editorFormato > .mce-tinymce.mce-container.mce-panel[estado='encendido']{
			display:block;			
		}
		
		.id2{
			width: unset;
			display: unset;
		}
	</style>
    
    <style id='cssPersonalizado' type="text/css">
    </style>
</head>

<body>

<script type="text/javascript" src="./js/jquery/jquery-3.2.1.js"></script>
<script type="text/javascript" src="./js/tinymce43/tinymce.min.js"></script>

<script type="text/javascript">
	tinymce.init({ 
		selector:'textarea#editorHTML',
		plugins: "code",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "615px",
		height : "280px",
		skin : "unmapa",
		forced_root_block: "p",
		remove_trailing_nbsp : true,
		remove_trailing_brs: true,
		editor_deselector : "mceNoEditor",
		invalid_elements : "br"
		});
		
	tinymce.init({ 
		selector:'textarea#editorHTMLpie',
		plugins: "code",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "615px",
		height : "280px",
		skin : "unmapa",
		forced_root_block: "p",
		remove_trailing_nbsp : true,
		remove_trailing_brs: true,
		editor_deselector : "mceNoEditor",
		invalid_elements : "br"
		});
</script>

<script type="text/javascript">    
    _IdCom='<?php echo $_GET['idcom'];?>';
</script>

<div class='aux' id='editorFormato'>
	<a id='editacss' onclick='edicionCss()'>Editar CSS (on-off)</a>
	<a id='guardacss' estado='apagado' class='editando' onclick='guardarCss()'>Guardar</a><a id='cancelacss' estado='apagado' class='editando' onclick='cancelarCss()'>Cancelar</a>
	<textarea name='css' estado='apagado' onkeydown="tomarCssTextoPre(event,this)" onkeyup="tomarCssTextoPost(event,this)"></textarea>
	<a onclick='edicionHTML()'>Editar Encabezado (on-off)</a>
	<a id='guardahtml' estado='apagado' class='editando' onclick='guardarHtml()'>Guardar</a> 
	<a id='cancelahtml' estado='apagado' class='editando' onclick='cancelarHtml()'>Cancelar</a>
	<a onclick='edicionHTMLpie()'>Editar Pie (on-off)</a>
	<a id='guardahtmlpie' estado='apagado' class='editando' onclick='guardarHtmlpie()'>Guardar</a> 
	<a id='cancelahtmlpie' estado='apagado' class='editando' onclick='cancelarHtmlpie()'>Cancelar</a> 
	<a href="./complementos/manualformatocomunicaciones.php" target='_blank'>Ayuda</a> 
	<a href="./COM_gestion.php?idcom=<?php echo $_GET['idcom'];?>" target='_blank'>Volver a la gestion de comunicaciones</a>
	
	<textarea id='editorHTML' name='HTML' estado='apagado'></textarea>
	<textarea id='editorHTMLpie' name='HTMLpie' estado='apagado'></textarea>
</div>
<div id="pageborde">
    <div id="page">
        
       
    </div>
</div>


<script type='text/javascript'>
    var _PanelI='<?php echo $PanelI;?>';
	var _Data={};


    function cargarUnaFila(_id){						
        var parametros = {
            "id" : _id
        };			
        $.ajax({
            data:  parametros,
            url:   './COM/COM_consulta_fila.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                _Data=_res.data;
                mostrarCom(_res.data);
               
                tinymce.init({ 
					selector:'textarea.mceEditable',
					plugins: "code image",
					menubar: "insert",
					image_caption: true,
					toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | code",					
					width : "615px",
					height : "280px",
					skin : "unmapa",
					forced_root_block: "p",
					remove_trailing_nbsp : true,
					remove_trailing_brs: true,
					editor_deselector : "mceNoEditor",
					invalid_elements : "br",
					extended_valid_elements: "+@[campo]"
				});            
            }
        });
    }
    cargarUnaFila(_IdCom);

    
    function mostrarCom(_data){
     	
     	actualizarCSS(_data.CSS)

		document.querySelector('#page').innerHTML='';
		
		_div = document.createElement('div');
		_div.setAttribute('id','encabezado');
		_div.innerHTML=_data.encabezadoHTML;
		document.querySelector('#page').appendChild(_div);

     	_div = document.createElement('div');
		_div.innerHTML = _data.descripcion;
		document.querySelector('#page').appendChild(_div);
		
		
		_campos=document.querySelector('#page').querySelectorAll('[campo="ident"], [class="ident"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_data.ident;
		}
		
		_campos=document.querySelector('#page').querySelectorAll('[campo="id2"], [class="id2"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_data.id2;
		}
		
		_campos=document.querySelector('#page').querySelectorAll('[campo="emision"], [class="emision"]');
		for(_nc in _campos){
			_campos[_nc].innerHTML=_data.zz_reg_fecha_emisionTx;
		}
		
		document.querySelector('div.aux').setAttribute('estado','encendido');
     }
     
	function actualizarCSS(_css){
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_css;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
	}    
     

     
</script>



<script type='text/javascript'>

	function edicionCss(){
		
		_textarea=document.querySelector('#editorFormato textarea[name="css"]');
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormato #guardacss').setAttribute('estado','encendido');
			document.querySelector('#editorFormato #cancelacss').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');
			_textarea.value=_Data.CSS;			
		}else{	
			document.querySelector('#editorFormato #guardacss').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelacss').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			_textarea.value='';				
		}
		
	}
	
	function tomarCssTextoPre(_event,_this){     	
	   	
	   	if (_event.keyCode == 9){
	   	 	_event.preventDefault();
	   	 	
	   	 	var start = _this.selectionStart;
		    var end = _this.selectionEnd;
		
		    // set textarea value to: text before caret + tab + text after caret
		    _nuevo=	_this.value.substring(0, start)
		    		+ "\t"
		            + _this.value.substring(end);
			_this.value=_nuevo;
		    // put caret at right position again
		    _this.selectionStart = 
		    _this.selectionEnd = start + 1;
	   	} 
	   	      	
     	
     }	
     
     
     function tomarCssTextoPost(_event,_this){
     	_css= _this.value;
     	actualizarCSS(_css);
     }	
     
     function cancelarCss(){
     	_textarea=document.querySelector('#editorFormato textarea[name="css"]');
     	_textarea.value=_Data.CSS;
     	actualizarCSS(_Data.CSS);
     }
     
     function guardarCss(){
     	_textarea=document.querySelector('#editorFormato textarea[name="css"]');
     	
     	 var parametros = {
            "com-text-css" : _textarea.value,
            "zz_AUTOPANEL" : _PanelI
        };			
        
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-css.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                _Data.CSS=_res.data.CSS;
                _Data.pieCSS=_res.data.pieCSS;                
                  
                edicionCss();    
            }
        });
    }

	function edicionHTML(){
		_textarea=document.querySelector('#editorFormato textarea[name="HTML"]');		
		_editor = tinymce.get('editorHTML'); // use your own editor id here - equals the id of your textarea
			
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_Data.CSS;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
		
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormato #guardahtml').setAttribute('estado','encendido');
			document.querySelector('#editorFormato #cancelahtml').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');	
			document.querySelector('#mceu_14').setAttribute('estado','encendido');	
			_editor.setContent(_Data.encabezadoHTML);	
					
		}else{	
			document.querySelector('#editorFormato #guardahtml').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelahtml').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			document.querySelector('#mceu_14').setAttribute('estado','apagado');	
			_editor.setContent('');
		}
	}
	
	function guardarHtml(){
     	_editor = tinymce.get('editorHTML');
     	var parametros = {};
        parametros["com-text-encabezado-"+_Data.sentido]= _editor.getContent();
        parametros["zz_AUTOPANEL"]=_PanelI;
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-encabezado-'+_Data.sentido+'.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                cargarUnaFila(_IdCom);
            }
        });
     }
     	
     function cancelarHtml(){
     	_editor = tinymce.get('editorHTML');
     	_editor.setContent(_Data.encabezadoHTML);
     }
     	
     	
     	
	function edicionHTMLpie(){
		_textarea=document.querySelector('#editorFormato textarea[name="HTMLpie"]');		
		_editor = tinymce.get('editorHTMLpie'); // use your own editor id here - equals the id of your textarea
			
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_Data.CSS;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
		
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormatopie #guardahtmlpie').setAttribute('estado','encendido');
			document.querySelector('#editorFormatopie #cancelahtmlpie').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');	
			document.querySelector('#mceu_14').setAttribute('estado','encendido');	
			_editor.setContent(_Data.pieHTML);	
					
		}else{	
			document.querySelector('#editorFormato #guardahtmlpie').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelahtmlpie').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			document.querySelector('#mceu_14').setAttribute('estado','apagado');	
			_editor.setContent('');
		}
	}
	
	function guardarHtmlpie(){
     	_editor = tinymce.get('editorHTMLpie');
     	var parametros = {};
        parametros["com-text-pie-"+_Data.sentido]= _editor.getContent();
        parametros["zz_AUTOPANEL"]=_PanelI;
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-pie-'+_Data.sentido+'.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                cargarUnaFila(_IdCom);
            }
        });
     }
     	
     function cancelarHtmlpie(){
     	_editor = tinymce.get('editorHTMLpie');
     	_editor.setContent(_Data.pieHTML);
     }
	
</script>
<script type="text/javascript">
		
</script>
</body>
