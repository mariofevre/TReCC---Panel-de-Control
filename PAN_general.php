<?php
/**
* PAN_general.php
*
* Estructura HTML donde se cargarán los datos de acceso y estado de cada panel
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
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
if(isset($_GET['panel'])){
	if($_GET['panel']!=''){
		$PanelI =$_GET['panel'];
		$_SESSION['panelcontrol']->PANELI=$PanelI;
	}
}
if($PanelI==''||$PanelI==0){
	//sin panel definido en sesion o en url envía al selector de paneles
	header('location: ./PAN_listado.php');
}

?>
<!DOCTYPE html>
<head>
	
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./PAN/css/PAN_general.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
	
	
	<link rel="stylesheet" type="text/css" href="./_terceras_partes/OL/js/ol_v7.1.0/theme/ol.css">
	
	<style type="text/css">
		#formAcepConec{
			style:none;
		}
		
		[sentido="entrante"]{
		    background-color: #839ef8;
		    border-color: #272fb6;
		}
		 
		[sentido="saliente"]{
		    background-color: #c1f270;
		    border-color: #57a532;
		}
		
		div.campo{
			display:inline-block;
		}
		
		#columnauno > .modulo[foco='enfoco']{
			border-color:#000;
		}
		
		#columnados > .opcion[foco='enfoco']{
			border-color:#000;
		}
		
		#columnados > .opcion[visible='no']{
			display:none;
		}
		#columnados {
		    display: inline-block;
		}
		#columnados[visible='no']{
			display:none;
		}
		#botoneditarpan[visible='no']{
			display:none;
		}
	</style>
</head>
<body>
	
	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	<script type="text/javascript" src="./_terceras_partes/OL/ol_v7.1.0/main.js"></script>

    <script type="text/javascript" charset='UTF-8' src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
		
	<?php insertarmenu();?>

	<div id="pageborde">
		<div id="page">
			<h1>
				Panel general
				<span id="alerta" cant='0' suma='0'>
					<span id="min">0</span>
					<span id="nivel">
						<span id="num"></span>
						<span id="barra"></span>
					</span>
					<span id="max">100</max>	
				</span>
			</h1>
			
			<a style='display:none;' id='botonreporte' href='./panelgeneral_reporte.php'>Ver en modo reporte</a>
			<h2></h2>
			<div id="bajada">
				<div class="texto" id='id'>
				</div>
				<a id='botoneditarpan' nivel='administrador' onclick='formularPAN()'><img src='./a_comunes/img/editar.png' alt='editar'></a>
					
				<div class="texto" id='nombre'>
				</div>
				<div class="texto" id='descripcion'>
				</div>
					
			</div>
			
			<div id="contenidoextenso">
				<div id='columnauno'>
				</div>	
				<div id='columnados'>
					<a nivel='administrador' visible='no' class="opcion" opcion="caracteristicas" href="./caracteristicas.php">ver caracteristicas de este proyecto</a>					
					<a nivel='administrador' visible='si' class="opcion" opcion="usuarios" href="./PAN_usuarios.php"> 
						<h1>Usuarios habilitados</h1> 
						<h2>Administradores</h2>
						<h2>Editores</h2> 
						<h2>Visitantes</h2> 
					</a>
					<a nivel='administrador' visible='si' class="opcion" opcion="publicar" href="javascript:void(0)" onclick='formularWeb();'>
						<h1>Publicación Web</h1>
						activar
					</a>
					<a nivel='administrador' visible='si' class="opcion" opcion="duplicar" onclick="this.lastElementChild.style.display='block'" href="javascript:void(0)" > 
						<h1>Duplicar este panel</h1>
						<p>crear copia tomando la configuración, indicadores e informes de modelo.</p>
						<form onsubmit='enviarduplicacion(this,event)' method='POST' style='display:none;' action=''>
							<label>completo</label>
							<input class='dia' type='checkbox' name='completo' value='SI'><span>(copia particularidades)</span>
							<label>Fecha inicio</label>
							<input class='dia' name='inicio_d' value=''>-
							<input class='mes' name='inicio_m' value=''>-
							<input class='ano' name='inicio_a' value=''>
							<br><label>Fecha fin</label>
							<input class='dia' name='fin_d' value=''>-
							<input class='mes' name='fin_m' value=''>-
							<input class='ano' name='fin_a' value=''>		
							<br><label>Titulo</label>
							<input name='nombre' value=''>	
							<br><label>Descripción</label>
							<input name='descripcion' value=''>		
							<input type='submit' value='crear duplicado'>																				
						</form>
					</a>
					<a nivel='administrador' visible='si' class="opcion" opcion="grupos" onclick="grupoForm('a')" href="javascript:void(0)" ><h1>Editar Grupos</h1></a>		
					<a nivel='administrador' visible='si' class="opcion" opcion="configuracion" onclick='activarFormularioConf()' href="javascript:void(0)" > <h1>Configuración</h1></a>
					<a nivel='administrador' visible='si' class="opcion" opcion="conexion" onclick='formularConecPAN()' 		href="javascript:void(0)" > <h1>Conectar con otro panel</h1></a>
					<a nivel='administrador' visible='si' class="opcion" opcion="cierre" onclick='iniciarCierre()' 			href="javascript:void(0)" ><h1>Dar por cerrado este panel</h1></a>
					<a nivel='administrador' visible='si' class="opcion" opcion="eliminacion" onclick='iniciarEliminacion()' href="javascript:void(0)" ><h1>Eliminar este panel</h1></a>
				</div>
			</div>			
		</div>					
	</div>					

	<form id='formPAN'>
        <a class='botoncerrar' id='cerrar' onclick='cerrarFormPan()'>cerrar</a>
        <a id='guardar' onclick='enviarFormPan()'>guardar</a>
        
        <label>Nombre: </label>
		<input name='nombre'><br>
		
		<label>Descripción: </label>
		<textarea name='descripcion'></textarea><br>
		
		<label>Fecha de Cierre: </label>
		<input name='fin' type='date'><br>
				
		<a onclick="localizarPan()">localizar</a>
		<a onclick="limpiarLocalizarPan()">eliminar localizacion</a>
		<input type="hidden" name='localizacion_epsg3857'></input>	
		<div id="localizacion"></div>		
		
		<label>Tipo de contrato: <span name='tipocontrato'></span></label>		        
    </form>
    	
    	
    	
    <form id='formconfig'>
        <a class='botoncerrar' id='cerrar' onclick='cerrarFormConfig()'>cerrar</a>
        <a class='botonguardar' onclick='enviarFormConfig()'>guardar</a>
    <div>
        <h3><label for=''>Opciones Generales</label></h3>   
         <div class='especifico'>
            <input type='hidden' name='id' value=''>
            <input type='hidden' name='zz_AUTOPANEL' value=''>
            <label for='gral-orden-grupo'>Orden normal o invertido</label><input type='hidden' name='gral-orden-grupo' value=''>
            <label for='com-grupob'>Criterio 1º de agrupación</label><input type='text' name='com-grupob' value=''>
            <label for='com-grupoa'>Criterio 2º de Agrupación</label><input type='text' name='com-grupoa' value=''>
         </div> 
     </div>    
    <div>
        <h3>
        	<label for='ind-activo'> Seguimimento de Indicadores</label><input type='checkbox' name='ind-activo' value=''>
        	<label class='secundario' for='ind-alternativo'>Nombre local:</label><input name='ind-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <input type='hidden' name='ind-rep-traking' value=''>
                <input type='hidden' name='ind-rep-com-sale' value=''>
                <input type='hidden' name='ind-rep-com-entra' value=''>
                <label for='ind-feriado' title='id del registro en la tabla indicadores que define si un dia es feriado (no laborable) con un valor igual a 1'>indicador feriado. </label><input type='text' name='ind-feriado' value=''>
                <label for='ind-cert-proy' title='id del registro en la tabla indicadores que define el avance porcentual de la obra previsto'>Avance previsto. </label><input type='text' name='ind-cert-proy' value=''>
            </div>    
    </div>
    <div>
        <h3>
        	<label for='com-activo'>Comunicaciones.</label><input type='checkbox' name='com-activo' value=''>
        	<label class='secundario' for='com-alternativo'>Nombre local:</label><input name='com-alternativo' value=''>
        </h3>
            <div class='especifico'>
            	
	            <div sentido='entrante'>
		            <div class='campo'><label for='com-entra' title='Nombre de la comunicación entrante.'>Nombre Entrante</label><input type='text' name='com-entra' value=''></div>
		            <div class='campo'><label for='com-entrax' title='Nombre de la comunicación entrante extraoficial'>Nombre Entrante Extraoficial</label><input type='text' name='com-entrax' value=''></div>
		            <div class='campo'><label for='com-entra-preN' title='prefijo para el número identificador primario de comunicación entrante'>Prefijo de entrante</label><input type='text' name='com-entra-preN' value=''></div>
		            <div class='campo'><label for='com-entra-preNx' title='prefijo para el número identificador primario de comunicación entrante extraoficial'>Prefijo de entrante extraoficial</label><input type='text' name='com-entra-preNx' value=''></div>
		            <div class='campo'><label for='com-entra-ident-formato'>Num. preformateado <a target='blank' href='./complementos/manualformatosident.php'>ver manual</a></label><input type='text' name='com-entra-ident-formato' value=''></div>    	            
	            </div>
	            
	            <div sentido='saliente'>
	                <div class='campo'><label for='com-sale' title='Nombre de la comunicación saliente'>Nombre Saliente</label><input type='text' name='com-sale' value=''></div>
	                <div class='campo'><label for='com-salex' title='Nombre de la comunicación saliente extraoficial'>Nombre Saliente</label><input type='text' name='com-salex' value=''></div>
	                <div class='campo'><label for='com-sale-preN' title='prefijo para enúmero identificador primario de comunicación saliente'>repfijo al númenro de comun. saliente</label><input type='text' name='com-sale-preN' value=''></div>
	                <div class='campo'><label for='com-sale-preNx' title='prefijo para el número identificador primario de comunicación saliente extraoficial'>Prefijo de saliente extraoficial</label><input type='text' name='com-sale-preNx' value=''></div>
	                <div class='campo'><label for='com-sale-ident-formato'>Num. preformateado <a target='blank' href='./complementos/manualformatosident.php'>ver manual</a></label><input type='text' name='com-sale-ident-formato' value=''></div>
	            </div>
	            
	            <div>
	                <label for='com-ident'>Identificador primario</label><input type='text' name='com-ident' value=''>
	                
	                <label for='com-identdos'>identificador secundario</label><input type='text' name='com-identdos' value=''>
	                <label for='com-identtres'>Identificador terciario</label><input type='text' name='com-identtres' value=''>
	                <label for='com-prefijo-grupo'>Criterio de agrupación de comunicaciones:</label><input type='text' name='com-prefijo-grupo' value=''>
	            </div>
	            <div>
	                <label for='com-seguimiento' title='realizar seguimiento si requiere o no respuesta para cada comunicación'>seguimiento de respuesta</label><input type='checkbox' name='com-seguimiento' value=''>
	                <label for='com-seguimiento-plazo'>plazo por defecto en días para de respuesta inicial</label><input type='text' name='com-seguimiento-plazo' value=''>
	                <label for='com-seguimiento-inicio'>realizar seguimiento de inicio de activides asociadas</label><input type='text' name='com-seguimiento-inicio' value=''>
	                <label for='com-aprobacion'>Aprobación múltiple de comunicaciones entrantes</label><input type='checkbox' name='com-aprobacion' value=''>
	                <label for='com-aprobacion-sale'>Aprobación múltiple de comunicaciones salientes</label><input type='checkbox' name='com-aprobacion-sale' value=''>
	            </div>
	            <div>
	                <label for='com-text-encabezado-entrante'>encabezado HTML para comunicaciones entrante</label>
	                <textarea type='text' name='com-text-encabezado-entrante'></textarea> 
	                
	                <label for='com-text-encabezado-saliente'>encabezado HTML para comunicaciones salientes</label>
	                <textarea type='text' name='com-text-encabezado-saliente'></textarea> 
	                
	                <label for='com-text-css'>estilo en cascada CSS comunicaciones</label>
	                <textarea type='text' name='com-text-css'></textarea> 
	            </div>
	            <div> 
	                <label for='com-nomenclaturaarchivos'>criterio de nomenclatura para documentos de comunicaciones.</label><input type='text' name='com-nomenclaturaarchivos' value=''>
	                <label for='com-nomenclaturaarcseparador'>nomenclaturaarcseparador</label><input type='text' name='com-nomenclaturaarcseparador' value=''>
	                <label for='com-nomenclaturaarchivosRta'>nomenclaturaarchivosRta</label><input type='text' name='com-nomenclaturaarchivosRta' value=''>
	            </div>
            </div>
    </div>
    <div>
        <h3>
        	<label for='inf-activo'>Sistema de seguimiento de informes.</label><input type='checkbox' name='inf-activo' value=''>
        	<label class='secundario' for='inf-alternativo'>Nombre local:</label><input name='inf-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='doc-activo'>Módulo Activo, Sistema de Seguimiento de Documentación.</label><input type='checkbox' name='doc-activo' value=''>        	
        	<label class='secundario' for='doc-alternativo'>Nombre local:</label><input name='doc-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='doc-visadomultiple'>Aprobación de documentos en instancias intermedias</label><input type='checkbox' name='doc-visadomultiple' value=''>
                <label for='doc-criterionum'>Criterio de repetición para la numeración de documentos</label><input type='text' name='doc-criterionum' value=''>
                <label for='doc-nomenclaturaarchivos'>criterio de nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarchivos' value=''>
                <label for='doc-nomenclaturaarcseparador'>listado de separadores para la nomenclatura para documentos de documentacion</label><input type='text' name='doc-nomenclaturaarcseparador' value=''>
            </div>
    </div>
    <div>            
        <h3>
        	<label for='tar-activo'>Sistema de Seguimiento de Tareas. <br>- en desarrollo -</label><input type='checkbox' name='tar-activo' value=''>
        	<label for='tar-alternativo'>Nombre local:</label><input name='tar-alternativo' value=''>
        </h3>
        <div class='especifico'>
        	<label for='tar-periodo'>Margen temporal de visualización gantt (días)</label><input type='number' name='tar-periodo' value=''>       
        	<label for='tar-diascontrol'>Margen temporal para relevar tareas plinificadsa activas (días)</label><input type='number' name='tar-diascontrol' value=''>               
        </div>
    </div>
    <div>
        <h3>
        	<label for='hit-activo'>Sistema de Seguimiento de Hitos. </label><input type='checkbox' name='hit-activo' value=''>
        	<label class='secundario' for='hit-alternativo'>Nombre local:</label><input name='hit-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='cer-activo'>Certificaciones. <br>- en desarrollo -</label><input type='checkbox' name='cer-activo' value=''>
        	<label class='secundario' for='cer-alternativo'>Nombre local:</label><input name='cer-alternativo' value=''>
        </h3>
             <div class='especifico'>
                <label for='cer-minimo'>Utilizar límite mínimo para el módulo de certificación</label><input type='text' name='cer-minimo' value=''>
                <label for='cer-maximo'>Utilizar límite máximo para el módulo de certificación</label><input type='text' name='cer-maximo' value=''>
            </div>    
    </div>
    <div>
        <h3>
        	<label for='rel-activo'>Módulo Activo, Relevamientos. <br>- en desarrollo -</label><input type='checkbox' name='rel-activo' value=''>
        	<label class='secundario' for='rel-alternativo'>Nombre local:</label><input name='rel-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='rel-tabladiag'>mostrar el campo diagnóstico en la tabla  </label><input type='checkbox' name='rel-tabladiag' value=''>
            </div>    
        <h3>
        	<label for='pla-activo'>Módulo Activo, Planes de Acción. </label><input type='checkbox' name='pla-activo' value=''>
        	<label class='secundario' for='pla-alternativo'>Nombre local:</label><input name='pla-alternativo' value=''>
        </h3>
            <div class='especifico'>
                <label for='pla-nivel1'>Nombre para el primer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel1' value=''>
                <label for='pla-nivel2'>Nombre para el segundo nivel de acción (singular / plural).</label><input type='text' name='pla-nivel2' value=''>
                <label for='pla-nivel3'>Nombre para el tercer nivel de acción (singular / plural).</label><input type='text' name='pla-nivel3' value=''>
            </div>
    </div>
    <div>            
        <h3>
        	<label for='cpt-activo'>Módulo Activo, Computos y Avances de obra. <br>- en desarrollo -</label><input type='checkbox' name='cpt-activo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>
    <div>
        <h3>
        	<label for='esp-activo'>Módulo Activo, Especificaciones, condicones contractuales, glosarios. </label><input type='checkbox' name='esp-activo' value=''>
        	<label class='secundario' for='esp-alternativo'>Nombre local:</label><input name='esp-alternativo' value=''>
        </h3>
        	<div class='especifico'>
            </div>    
    </div>      
    <div>
        <h3>
        	<label for='seg-activo'>Módulo Activo, Seguimiento de acciones en curso. </label><input type='checkbox' name='seg-activo' value=''>
        	<label class='secundario' for='seg-alternativo'>Nombre local:</label><input name='seg-alternativo' value=''>
        </h3>
        <div class='especifico'></div>
    </div>  
    <div>
        <h3>
        	<label for='cnt-activo'>Módulo Activo, Seguimiento de Contrataciones y proveedores. </label><input type='checkbox' name='cnt-activo' value=''>
        	<label class='secundario' for='cnt-alternativo'>Nombre local:</label><input name='cnt-alternativo' value=''>
        </h3>
        <div class='especifico'>
        	<label class='secundario' for='cnt-conceptospago'>conceptos utilizados para pago (separar por comas):</label><input name='cnt-conceptospago' value=''>
        </div>
    </div>      
</form>


<form id='formPublicacionesWeb'>
	
	<a id='cerrar' onclick='cerrarFormPublicacionesWeb()'>cerrar</a>
	<a onclick="anadirPublicacionWeb()">añadir publicacion</a>
	
	<h2>Publicaciones de este panel</h2>
	<div id='listapublicacionesweb'></div>
	
	
	<div id='formpublicacionweb'>
		
		<input type='hidden' name='idpub' autocomplete='off'>
		<a id='guardar' onclick='guardarPub(this.parentNode)'>guardar</a>
		<a id='irapub' onclick='iraPub(this)'>ir a publicación</a>
		<br>
		<label>Nombre de identificación: </label>
		
		
		<input name='nombre'>
		
		<label>Publicación activa: </label>
		<input type='checkbox' name='activa' readonly='readonly'><br>		
		
		<label>Titulo: </label>
		<textarea name='titulo'></textarea><br>
		
		<label>Copete: </label>
		<textarea name='copete'></textarea><br>
		
		<label>Pie: </label>
		<textarea name='pie'></textarea><br>
		
		<label>Atribución: </label>
		<textarea name='atribucion'></textarea><br>
				
		<h2>Listado de componentes visibles</h2>
		<a onclick='crearPUBcomponente()'><img src='./a_comunes/img/agregar.png'>componente visible</a>		
		<div id='listadecomponentes'></div>
			

	</div>
		
</form>   






<form id='formConec'>
	<label>id del panel a conectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<label>vision compartida de comunicaciones: </label>
	<input for='COMver' autocomplete='off' type='checkbox' onchange='togle(this)'>
	<input name='COMver' autocomplete='off' type='hidden' value='0'><br />
	<label>vision compartida de documentacion: </label>
	<input for='DOCver' autocomplete='off' type='checkbox' onchange='togle(this)'>
	<input name='DOCver' autocomplete='off' type='hidden' value='0'>
	
	<a id='crear' onclick='iniciarConexion()'>Proponer conexion</a>
	<a id='cerrar' onclick='cerrarformIniciarConec()'>cerrar</a>
</form>

<form id='formAcepConec'>
	
	<a id='cerrar' onclick='cerrarFormAcepConec()'>cerrar</a>
	<a class='botonguardar' onclick='aceptarConexion()'>aceptar</a>
	<label>id del panel a conectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<input type='hidden' name='idpendiente' autocomplete='off'>
	
	<label>nombre:</label>
	<input readonly='readonly' id='nombrepanel' name='nombrepanel'>
	
	<label>Publicacion Activa: </label>
	<input readonly='readonly' type='checkbox' name='publicacionactiva'>
	
	<label>Titulo: </label>
	<input readonly='readonly'id='titulo' name='titulo'>
	
	<label>Descripcion: </label>
	<input readonly='readonly' id='descripcionpanel' name='dsecripcionpanel'>
	
	<h2>Componentes</h2>
	<div id='pub_componentes'>
	
		<label for='COMver'>Comunicaciones</label>
		<input type='checkbox' for='COMver'  onchange='togle(this)'>
		<input type='hidden' name='COMver'>
		
		<label for='DOCver'>Documentación</label>
		<input type='checkbox' for='DOCver'  onchange='togle(this)'>
		<input type='hidden' name='DOCver'>
		
		<label for='TARver'>Plan de Trabajo</label>
		<input type='checkbox' for='TARver'  onchange='togle(this)'>
		<input type='hidden' name='TARver'>
	</div>
	
</form>
    
    
<form id='formAnularConec'>
	<label>id del panel a desconectar: </label>
	<input name='idpanelcon' autocomplete='off'>
	<input type='hidden' name='idcon' autocomplete='off'>
	
	<label>Nombre del panel a conectar: </label>
	<span id='nombrepanel'></span>
	
	<label>Descripcion del panel a desconectar: </label>
	<div id='descripcionpanel'></div>
	
	<label>vision compartida de comunicaciones: </label>
	<input for='COMver' autocomplete='off' type='checkbox' readonly>
	<input name='COMver' autocomplete='off' type='hidden' value='0'><br />
	
	<label>vision compartida de documentacion: </label>
	<input for='DOCver' autocomplete='off' type='checkbox' readonly>
	<input name='DOCver' autocomplete='off' type='hidden' value='0'>
	<br>
	<label>Términos de la extinsión del acuerdo: </label>
	<textarea name='terminos'></textarea>
	<br>
	
	<a id='apectarconeccion' onclick='anularConexion()'>Quiero exinguir este acuerdo de vinculación</a>
	<a id='cerrar' onclick='cerrarFormAnularConec()'>cerrar</a>
</form>   


<form id='formalerta' onsubmit='event.preventDefault();guardarFormAlerta()'>
	<a class='cerrar' id='cerrar' onclick='cerrarFormalerta()'>cerrar</a>
	<h2>Configuración de niveles de alerta para el indicador:</h2>
	<h1 id='indicadornombre'></h1>
	<p id='indicadordescripcion'></p>
	<div id='inputs'>
		<div id='min'><label>min</label><input name='min'><label>0 %</label></div>
		<div id='barra'></div>
		<div id='max'><label>max</label><input name='max'><label>100 %</label></div>
	</div>
	 <input name='codigo' type='hidden'>
	 <input name='tipo' type='hidden'>
	 <input name='refed' type='hidden'>
	<input type='submit' value = 'guardar'>
	<input type='button' value = 'desactivar' onclick='desactivarAlerta()'>
</form>




<script type="text/javascript">

	var _UsuarioAcc='';
	var _UsuarioTipo='';
	var _PanelI='<?php echo $PanelI;?>';
	var _PanId ='<?php echo $PanelI;?>';

	var _DataPanel={};
	var _DataAlertas={};
	var _DataConfig={};
	var _ModulosActivos = {};
	
		
	var _alertageneral=Array();	
	
	var _ResumenesEnConsulta={};
	
	var _Mdat={};

	var _haylocalizaciones='no';
	
</script>
   
<script type="text/javascript" src="./PAN/PAN_general_consultas.js?v=<?php echo time();?>"></script>

<script type="text/javascript" src="./PAN/PAN_general_mostrar.js?v=<?php echo time();?>"></script>

<script type="text/javascript" src='./PAN/PAN_general_form_config.js?v=<?php echo time();?>'></script>

<script type="text/javascript" src='./PAN/PAN_general_interaccion.js?v=<?php echo time();?>'>	</script>
<script type="text/javascript" src='./PAN/PAN_general_form_conexion.js?v=<?php echo time();?>'></script>

<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>">/*carga funciones para el formuario de grupos*/</script>


<script type="text/javascript">
	consultarPanel();		
	
	document.querySelector('body').setAttribute('onkeydown',"tecleoGeneral(event)");
</script>
		
</body>
