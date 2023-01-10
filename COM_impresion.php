<?php
/**
* COM_impresion.php
*
 * Genera visualización de una comunicación con formato de impresión.  
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
include ('./a_comunes/a_comunes_consulta_encabezado.php');//carga los recursos de consulta a base de datos y funciones de uso común.

?>
<!DOCTYPE html>
<head>
	<title>Panel.TReCC</title>
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./COM/css/COM.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./COM/css/COM_impresion.css?v<?php echo time();?>">
	
    <link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
    <link rel="stylesheet" type="text/css" href="./SIS/css/SIS_upload.css?v=<?php echo time();?>">
	
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	<link rel="shortcut icon" href="./img/Panel.ico">	

	
	
    <style type="text/css">
		
		.tox.tox-tinymce{
			display:none;
		}
		
		.tox.tox-tinymce[estado='encendido']{
			display:flex;
		}
	</style>
    
    <style id='cssPersonalizado' type="text/css">
    </style>
</head>

<body>

<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>

<script type="text/javascript" src="./_terceras_partes/tinymce/tinymce.6.3.1/tinymce.min.js"></script>



<script type="text/javascript">
	tinymce.init({ 
		selector:'textarea#editorHTML',
		plugins: "code, lists",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "615px",
		height : "280px",
		skin : "oxide",
		forced_root_block: "p",
		remove_trailing_nbsp : true,
		remove_trailing_brs: true,
		editor_deselector : "mceNoEditor",
		invalid_elements : "br"
	});
		
	tinymce.init({ 
		selector:'textarea#editorHTMLpie',
		plugins: "code, lists",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
		menubar: false,
		width : "615px",
		height : "280px",
		skin : "oxide",
		forced_root_block: "p",
		remove_trailing_nbsp : true,
		remove_trailing_brs: true,
		editor_deselector : "mceNoEditor",
		invalid_elements : "br"
	});
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
    <div id="page" pagenum='1'></div>
</div>


<script type="text/javascript">    
    var _IdCom='<?php echo $_GET['idcom'];?>';
    var _PanelI='<?php echo $PanelI;?>';
	var _Data={};
	var _Pag=1;
</script>


<script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>

<script type="text/javascript" src="./COM/COM_impresion_configuraciones.js?v=<?php echo time();?>"></script>
<script type="text/javascript" src="./COM/COM_impresion_consultas.js?v=<?php echo time();?>"></script>
<script type="text/javascript" src="./COM/COM_impresion_muestra.js?v=<?php echo time();?>"></script>

<script type='text/javascript'>
	consultarPanel();
	
	_editor = tinymce.get('editorHTML'); // use your own editor id here - equals the id of your textarea
	console.log(_editor.getContainer());
		
	/*
	_textarea=document.querySelector('#editorFormato textarea[name="HTMLpie"]');		
	_ns=_textarea.nextSibling;	
	if(_ns.tagName!='DIV'){_ns=_ns.nextSibling;}
	_ns.setAttribute('estado','apagado');	
	
	
	_textarea=document.querySelector('#editorFormato textarea[name="HTML"]');		
	_ns=_textarea.nextSibling;	
	if(_ns.tagName!='DIV'){_ns=_ns.nextSibling;}
	_ns.setAttribute('estado','apagado');	*/
</script>



</body>
