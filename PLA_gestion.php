<?php
/**
* PLA_gestion.php
*
 * Esta aplicación constrituye el módulo principal para seguimento de Planes.  
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	comunicaciones
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2023 TReCC SA
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
$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){	
	header('location: ./PAN_listado.php');//sin panel definido en sesion, envía al selector de paneles
}
?>
<!DOCTYPE html>
<head>
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./PLA/css/PLA.css?v<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./PLA/css/PLA_ref_pla.css?v<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v<?php echo time();?>">

	<style type="text/css">

	
	
	</style>
</head>


<body>
		
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  

	
	<?php	
		insertarmenu();		
	?>
	<div id='encabezadopagina'></div>	
	
	<div id='navega_plan'>
		<div id='indice'>
		</div>
	</div>
	
	<div id="pageborde">
	<div id="page" nivel='page' iddb='' modo='gestion' imprimiendo='-1'>
		<a id='botongestion' onclick='modoA("gestion");' >ver modo gestion</a>
		<a id='botonfichas'  onclick='modoA("fichas");' >ver modo fichas</a>
		<a id='botontabla'  onclick='modoA("tabla");' >ver modo tabla</a>
		<a id='botontexto'  onclick='modoA("texto");' >ver modo texto</a>
		<a id='botoncronograma'  onclick='modoA("cronograma");' >ver cronograma</a>
		<div id='buscador'><label>buscar:</label><input name='busqueda' onkeyup='tecleaBusqueda(this,event)'></div>
		<br>
		<a id='botondescargatabla' onclick='alert("función en desarrollo");'>decargar tabla de acciones</a><br>
		<a id='botonencabezado' onclick='editarPlanEncabeza();'>configurar encabezado</a><br>
		
		
		
		<div id='plan'>
			<a id='botonmas' onclick='ampliaCierraTextoplan()'>ver mas</a>
			<a id='botonmenos' onclick='ampliaCierraTextoplan()'>ver menos</a>
			<div id='nombre'><span id='dat'></span><a id='botoneditartextoplan' onclick='editarPlanGral()'>editar</a></div>	
			<div id='descripcion'><span id='dat'></span></div>
		</div>
		<div id='contenidos' class='contenidos'></div>
	</div>
	</div>
	
	<div id='form_pla_encabeza' draggable='true' ondragstart='drag_start(event,this);'>
		<div id='dBordeL' class='dragborde izquierdo'></div>
		<div class='escroleable'>
          				
		   	<br>contenido:<br>
			<textarea class='mceEditable' id='encabezado' name='encabezado'></textarea>

			<input id='ejec' type="submit" onclick='guardarPlanEnca(this)' class="general" value="guardar	">
			<input type="button" class="cancela general" value="cancelar" onclick="cancelarPlanGral(this);">
			
		</div>   
	</div>
	
	<div id='form_pla_gral' draggable='true' ondragstart='drag_start(event,this);'>
		<div id='dBordeL' class='dragborde izquierdo'></div>
		<div class='escroleable'>
		    <input type="hidden" name="id" value="">	
		    <input type='hidden' name='nivel' value='PLAn0'>
		    <input type='hidden' name='accion' value='agrega'>
		    
		    
  
        	<h2>Nombre</h2>
        	<input class='nombre' type='text' name='nombre'>
        				
		   	<br>descripcion:<br>
			<textarea class='mceEditable' id='descripciongral' name='descripcion'></textarea>

			<input id='ejec' type="submit" onclick='guardarPlanGral(this)' class="general" value="crear">
			<input type="button" class="cancela general" value="cancelar" onclick="cancelarPlanGral(this);">
			
		</div>   
	</div>
		
	<div id='form_pla' draggable='true' ondragstart='drag_start(event,this);' nivel=''>	
	    <div id='dBordeL' class='dragborde izquierdo'></div>
	    
	    <div class='escroleable'>
		    <input type="hidden" name="id" value="">	
		    <input type='hidden' name='nivel' value='PLAn1'>
		    <input type='hidden' name='accion' value='agrega'>
			
		    <h2 style='display:none'>Añadir <span id='nombreElemento'></span><span id='aclaracion'>en plan 1</span></h2>

		    
	    	    
	        <div class='paquete identificacion'>
	        	<h2>Nombre</h2>
	        	<input class='nombre' type='text' name='nombre'>
	        	<h2>Número</h2>
				<input class='nombre' type='text' name='numero'>				
				Color: <input type='color' name='CO_color' value='agrega'> Público: <input id='zz_publico' name='zz_publico' type='hidden'>
				<input for='zz_publico' type='checkbox' onclick="alterna01(this);">
				
				<h2 id='responsables'>Responsable:</h2>
				<div>	
			  	<input type='hidden' id='id_p_GRAactores' name='id_p_GRAactores'>
	            <input type='text' class='chico' id='id_p_GRAactores_n' name='id_p_GRAactores_n'
	                onKeyUp="actualizarResponsables(event,this);"
	            >
	            <div class='sugerencia uno'>
	                <a idg='0' onclick="cargarOpcion(this);">-vacio-</a><br>
	            </div>
	            <a id='muestramas' onclick="this.parentNode.querySelector('.sugerencia.dos').style.display='block';">mostrar más</a>	
	            <div class='sugerencia dos'>    
	            </div>
	            </div>
	            
				<h2 id='estados'>Estados:</h2>
				<div id='listaestados'>
					
					
					
				</div>
	            <div class='estado' id='nuevoestado'> 
					nuevo estado: <input type='text' name='estado' onkeyup='tecleoEstado(event,this)'> 
					desde:   <input type='date' name='desde'>
				</div>	
	            <div id='adjuntos' class='adjuntos'>
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
            </div>

 			<div id='paquetecategorias' class='paquete atributos'>
	        	<h2>Atributos</h2>
	        	<div id='atributoslista'></div>
	        	<a onclick='document.querySelector("#paquetecategorias #tiposcategorias").style.display="block";'>+ categría</a>
	        	<div id='tiposcategorias'>
	        		<h4>Elija el tipo de categoría que prefiere</h4>
		        	<div id='opciones'>
		        		<a onclick='document.querySelector("#paquetecategorias #nombrecategoria").style.display="block";document.querySelector("#paquetecategorias #tiposcategorias").removeAttribute("style")'>Libre</a>
		        		<div id='estandar'>
		        		</div>
	        		</div>
	        		<div id='descripcion'>
	        		</div>	        		
	        		
	        	</div>
	        	<div id='nombrecategoria'>
	        		<h4>Elija un nombre para la categoría</h4>
	        		<input name='catnom' value=''>
	        		<a onclick='crearCategoria("",this.parentNode.querySelector("[name=\"catnom\"]").value)'>crear categoría</a>
	        	</div>		
	        </div>
	        	
			<div class='paquete desarrollo' >
			   	<br>descripcion:
			   	<a onclick='formularInsertarReferencia()'>+ Referencia</a>
			   	<br>
			   	<div id='menureferenciar'>
					<select name='ref_modo' onchange='formularInsertarReferencia()'>
						<option value='PLA'>Componentes de este módulo</option>
						<option value='IND'>Indicadores</option>
					</select>
					<a onclick="desactivarForm('menureferenciar')">cerrar</a>
					<div id='listareferenciar'>
					
					</div>
					<div id='listareferenciarindicadores'>
					
					</div>
				</div>
				<textarea class='mceEditable' id='descripcion' name='descripcion'></textarea>
				
	        </div>
		  
			    
		</div>    

		<input id='ejec' type="submit" onclick='guardarPlan(this)' class="general" value="crear">
		<input type="button" class="imprimir general" value="grd/impr." onclick="imprimir();">				
		<input type="button" class="cancela general" value="cancelar" onclick="cancelarPlan(this);">
		<input id='elim' type="button" onclick='eliminarPlan(this)' class="eliminar" value="eliminar">	
		<input type="button" class="moverN general" value="^ mover" onclick="moverNivelMenu();">
		<div id='menumover'>
			<a>cerrar</a>
			<div id='listamover'>
			
			</div>
		</div>
		<input type="button" class="subirN general" value="<+ nivel" onclick="subirNivel(this);">
		<input type="button" class="bajarN general" value="nivel ->" onclick="bajarNivelMenu();">
	</div>
	
		    
	<div id='muestra_pla' draggable='true' ondragstart='drag_start(event,this);' nivel=''>	
	    <div id='dBordeL' class='dragborde izquierdo'></div>
	    
	    <div class='escroleable'>
		    <input type="hidden" name="id" value="">	
		    <input type='hidden' name='nivel' value='PLAn1'>	
			<div class='paquete identificacion' id='divident'>
	        	<h2>Nombre</h2>
	        	<span class='nombre' name='nombre'></span>
	        	<h2>Número</h2>
				<span class='nombre' name='numero'>	</span>			
				Público: <input for='zz_publico' type='checkbox' readonly=readonly>
				
				<h2 id='responsables'>Responsable:</h2>
				<div>	
					<span  class='chico' id='id_p_GRAactores_n' name='id_p_GRAactores_n'></span>
					
					<h2 id='estados'>Estados:</h2>
					<div id='listaestados'></div>
				</div>
	           
	            <div id='adjuntos' class='adjuntos'>
		            <h2>
		                Documentos Subidos:
		            </h2>
		            <div id='adjuntoslista'></div>
		        </div>
            </div>

 			<div id='paquetecategorias' class='paquete atributos'>
	        	<h2>Atributos</h2>
	        	<div id='atributoslista'></div>	        			
	        </div>
	        	
		</div>
		
		<input type="submit" onclick='iraPlan(this.parentNode.querySelector("[name=\"id\"]").value,this.parentNode.querySelector("[name=\"nivel\"]").value,""),cancelarPlan(this);' class="general" value="editar">
		<input type="button" class="imprimir general" value="imprimir" onclick="imprimir();">				
		<input type="button" class="cancela general" value="cerrar" onclick="cancelarPlan(this);">

	</div>		
		
	
	
	<div id='coladesubidas'></div>	

	
	
	<script type="text/javascript" src="./_terceras_partes/tinymce/tinymce.6.3.1/tinymce.min.js"></script>
	
	
<?php
		
	

	if(!isset($_GET['modo'])){$_GET['modo']='';}

?>

<script type="text/javascript">
	var _Config={};
	var _PanelI='<?php echo $PanelI;?>';
	var _PanId='<?php echo $PanelI;?>';		//deprecar
	var _UsuId = '';
	var _UsuarioAcc='';
	var _UsuarioTipo='';	
	var _HabilitadoEdicion='';	

	var _PlaCargada={};
	//var _PlanId=''; // id del plan cargado en pantalla. TODO no permite más de un plan por panel.
	
	var _DatosGrupos=Array();
	var _DatosGruposCargado='no';
	
	var _DatosUsuarios=Array();
	
	var _DatosCategorias=Array();
	var _DatosCategoriasCargado='no';
	
	var _DatosIndicadores=Array(); //usado para vincular componentes a indicadores.
	
	var _Hoy='<?php echo date("Y-m-d"); ?>';
	var _Actores = Array();
	var _CAT = Array();
	var _NomN=Array(); 
	var _NomNs=Array(); 
	var _Modo='gestion'; //modo de representación
	
	var _NomN={
		'PLAn1':'',
		'PLAn2':'',
		'PLAn3':''
	}
	var _NomNs={
		'PLAn1':'',
		'PLAn2':'',
		'PLAn3':''
	}
	
	var _DataPlan={};
	var _DataPlanCargado='no';
	
	var _HabilitadoEdicion='si';
	var _DatosListadito={};

	var _VariablesEstandar={
		'_mes_min':null,
		'_mes_max':null
	};
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
	
	window.onbeforeunload = function(e) {
		console.log(xhr)
		console.log(Object(xhr).length);
		for(_xn in xhr){
			console.log(xhr[_xn].readyState);
			if(xhr[_xn].readyState!=4){
				return 'Se suspenederan los documentos subiendo';
			}
		}
    }; 
    
</script>


<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_consulta.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_consulta_inicial.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_interaccion.js?v<?php echo time();?>'></script>
<script type='text/javascript'  src='./PLA/PLA_js_muestra.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_muestra_modo_cronograma.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_muestra_modo_fichas.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_muestra_modo_tabla.js?v<?php echo time();?>'></script>
<script type='text/javascript' charset="UTF-8" src='./PLA/PLA_js_muestra_modo_texto.js?v<?php echo time();?>'></script>


<script type='text/javascript'>
	
	cargaAccesos();
	
	function Reinicia(){cargaAccesos();}
	
    document.querySelector('#buscador input[name="busqueda"]').focus();       

    
	<?php if(!isset($_GET['idseg'])){$_GET['idseg']='';} ?>
	<?php if(!isset($_GET['idacc'])){$_GET['idacc']='';} ?>
	
	_Idsel='<?php echo $_GET['idseg'];?>'; // id del elemento seleccionado 
	_Nivelsel='<?php echo $_GET['idacc'];?>'; // nivle dle elemento seleccionado
		    
    function llamarElementosIniciales(){
		if(_DatosUsuarios.delPanel==undefined){return;}
		if(_DatosGruposCargado=='no'){return;}
		if(_DatosCategoriasCargado=='no'){return;}		
		if(_DataPlanCargado=='no'){return;}		
		
		if(_Idsel=='' && _Nivelsel==''){return;}
		iraPlan(_Idsel,_Nivelsel,"");
  		  		
  		//evitar que se vuelva a disparar la carga autpmática.
  		_Idsel='';
        _Nivelsel='';
	}
</script>

	
		
</body>

