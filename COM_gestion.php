<?php
/**
* COM_gestion.php
*
 * genera la estructua HTML para cargar, visualizar y formular cambios para Comunicaciones.
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

$PanelI ='';
if(isset($_SESSION['panelcontrol'])){
	if(isset($_SESSION['panelcontrol']->PANELI)){$PanelI = $_SESSION['panelcontrol']->PANELI;}
}
if($PanelI==''||$PanelI==0){
	//sin panel definido en sesion o en url envía al selector de paneles
	header('location: ./PAN_listado.php');
}

?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./COM/css/COM.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./COM/css/COM_tinymce.css?v=<?php echo time();?>">	
	
    <link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">
    <link rel="stylesheet" type="text/css" href="./SIS/css/SIS_upload.css?v=<?php echo time();?>">
	
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>
	<link rel="shortcut icon" href="./img/Panel.ico">	
		
    <style type="text/css">
            
    </style>
</head>

<body onkeyup='tecleoGeneral(event)'>

	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	
	<script type="text/javascript" src="./_terceras_partes/tinymce/tinymce.6.3.1/tinymce.min.js"></script>

	<?php insertarmenu();// en ./a_comunes/a_comunes_html_menu.php ?>

<div class='recuadros' id='recuadro4'>Seleccione una comunicación <div class='activo selector'></div> para visualizar su información asociada. <br>Ctrl+<div class='activo selector'></div> para una selección múltiple. <br>O shift+<div class='activo selector'></div> para una selección continua.</div>		

<div class='recuadros' id='comandoAborde' estado='inactivo' saliente='si' entrante='si'>
    <div id='interruptores'>
        <div id='saliente' onclick='togleInt(this);'>
            <img src='./img/check-sinborde.png'>
        </div> 
        <div id='entrante' onclick='togleInt(this);'>
            <img src='./img/check-sinborde.png'>
        </div>
        <br><label>distinto a <span id='gacod'></span></label>
        <div id='ga' onclick='togleInt(this);'>
            <img src='./img/check-sinborde.png'>
        </div>
        <br><label>distinto a <span id='gbcod'></span></label>
        <div id='gb' onclick='togleInt(this);'>
            <img src='./img/check-sinborde.png'>
        </div>
    </div>
    <div id='comandoA'>
    	<div id='encabezadoL'>
	        <span id='selerta'>seleccione la respuesta para:</span>
	        <span id='seleorig'>seleccione el origen de:</span>
	        <span id='origennombre'></span>
	        <span>buscar núm: <input id='busca' type='text' onkeyup='filtrarLinks(event,this);'></span>
        </div>
        <form id='formLink' class='respuestar'>
            <input id='origen' type='hidden' name='origen' value=''>				
            <input id='destino' type='hidden' name='destino' value=''>	
            <span id='separador'></span>
        </form>
            
    </div>
</div>

<form action='COM_ed_guarda_doc' enctype='multipart/form-data' method='post' style='display:none;' id="editorArchivos">
    <h1 id='tituloformulario'></h1>
    <p id='desarrollo'></p>
    <label>Tipo de carga</label>
    <select name='tipo'>
        <option value='auto'>automático</option>
        <option value='original'>original</option>
        <option value='anexo'>anexo</option>			
    </select>
    <label>Sentido de la comunicacion</label>
    <select name='sentido'>
        <option value='auto'>automático</option>
        <option value='entrante'>entrante</option>
        <option value='saliente'>saliente</option>			
    </select>		
    <input type='hidden' name='zz_AUTOPANEL' value=''>
    <label>Grupo Primario </label>
    <input type='hidden' name='idga' value=''>
    <input type='text' name='idga-n' onkeyup='opcionNo(this);' value=''>
    <div class='opciones' for='idga'></div>
    <label>Grupo Secundario </label>
    <input type='hidden' name='idgb' value=''>
    <input type='text' name='idgb-n' onkeyup='opcionNo(this);' value=''>
    <div class='opciones' for='idgb'></div>
    
    <label title="">Un separador (o más) de términos en el nombre del archivo </label>
    <input name='criterioseparador' value='<?php echo $Config['com-nomenclaturaarcseparador'];?>'>
    <label
        title="IDENTIFICADORES
        nro : numero de comunicacion
        ident : numero y código (ej: OS0002 / Np-125)
        sent : sentido (ej: saliente / os / orden de servicio)
        identdos : identificación secundaria
        identtres : identificación terciaria
        fecha : fecha (ej: 1980-09-21)
        y : año de emisión
        m : mes de emisión
        d : dia de emisión
        comenta : cualquier informacíon adicional
        "
    >Criterio de interpretación de términos en el nombre de archivo</label>
    <textarea name='criterio'><?php echo $Config['com-nomenclaturaarchivos'];?></textarea>
    <a id='reinterpretatodo' onclick='reinterpretarTodo()'><span> R </span>reinterpretar nombres</a>
    
    <label title="Esta secuencia es buscada dentro de los contenidos 'comenta' y se espera que a continuación se identifique tipo y numero de comunicaciones, ej: 'NP 34'">Identificador de vinculaciones</label>
    <input name='com-nomenclaturaarchivosRta' value='<?php echo $Config['com-nomenclaturaarchivosRta'];?>'>
    <a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
    <label>Arraste archivos de comunicaciones al interior:</label>
    <div id='contenedorlienzo'>									
        <div id='upload'>
            <input multiple='' id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='probarnombreDoc(this);'>
        </div>
        <div id='enviados'></div>
        
    </div>
        <a id='borratodo' onclick="borrarTodo()"><span> X </span>cancela todos</a>
        <a id='procesatodo' onclick="iniciaProcesarTodo()"><span> >> </span>procesar todos</a>
    <div id='listacargando'>
    </div>						
</form>


<div id="pageborde">
    <div id="page">
        
        <h1>Comunicaciones <div id='cargandoinicial'><img  src='./img/cargando.gif'><span id='avance'>0%</span></div></h1>		
        
        
        <div class='botonerainicial' tipo='modos'>
			<div class='filabotonera'>
            <a class='botonmenu' onclick='event.preventDefault();alert("funcion  en desarrollo");' href='./comunicacionesreporte.php?tabla=comunicaciones'>ver modo reporte</a>
            -
            <form id='form_sel' action='./COMresumenSel.php' method='post'>
                <label>ver resumen de selección:</label>
                <select name='id' onchange='this.parentNode.submit();'><option>-elegir-</option></select>
            </form>
            
			</div>
			
			<div class='filabotonera'>
            <a class='botonmenu' onclick='iraCom(event,"","");' title='agregar comunicacion'><img src='./img/agregar.png' alt='agregar'> comunicación</a>
            -
            <a class='botonmenu' onclick='cargarOrigen();'><img src='./img/agregar_desdedocs.png' alt='subir'>cargar comunicaciones desde archivos</a>
            </div>
            
            <div class="filabotonera filtro">
                <form id='formfiltro' action='' method='post' onsubmit='event.preventDefault();'>
                    <div id='conteo'>
                        	<div>
                        		<div class='tit'>ver</div>
                        		<span id='cantvisible'>0</span><br>
                        		<span id='porcvisible'>0</span>
                        	</div><!--
                        ---><div>
                        		<div class='tit'>ocu</div>
                        		<span id='cantfiltrado'>0</span><br>
                        		<span id='porcfiltrado'>0</span>
                        	</div><!--
                        ---><div>
                        		<div class='tit'>tot</div>
                        		<span id='canttotal'>0</span><br>
                        		<span id='porctotal'>0</span>
                        	</div>
                    </div>
                    <div class="sentido">
                        <label class="corto"><input type="radio" pref='COMfsentido' name="sentido" value='todas' checked='checked'><span onclick='toogle(this);filtrarFilas();guaradapref(this);'>todo</span></label>
                        <label class="largo"><input type="radio" pref='COMfsentido' name="sentido" value='saliente' ><span  class="saliente" onclick='toogle(this);filtrarFilas();guaradapref(this);'>salientes</span></label>    
                        <br>
                        <label class="largo"><input type="radio" pref='COMfsentido' name="sentido" value='entrante' ><span  class="entrante" onclick='toogle(this);filtrarFilas();guaradapref(this);'>entrantes</span></label>
                    </div>	
                    <div class="abiertas">
                        <label><input type="radio" name="abiertas" pref='COMfabiertas' value="todas" checked='checked'><span onclick='toogle(this);filtrarFilas();guaradapref(this);'>todo</span></label>
                        <label class="largo"><input type="radio" pref='COMfabiertas' name="abiertas" value='no' ><span onclick='toogle(this);filtrarFilas();guaradapref(this);'>abiertas</span></label>
                        <br>
                        <label class="largo"><input type="radio" readonly name="abiertas" value=''><span></span></label>
                    </div>											
                    <div class="busqueda">
                        <span id='buscarconsulta'>buscar: <img id='cargandobuscar' consultas='0' src='./img/cargando.gif'><br>
                        	<span id='buscarmas' title='buscar dentro de contenidos.'>text:<input type='checkbox' checked='checked' name='busquedaprofunda'></span>
                        </span><input type='text' name='busqueda' onkeyup="tecleaBusqueda(this,event)">		
                    </div>	
                    
                    <div id='filtroga' class="grupoa">				
                    </div>	
                    <div id='filtrogb'  class="grupob">
                    </div>	
                    <div>	
                        orden:
                        <select name='orden' pref='COMforden'  onchange="ordenarFilas();guaradapref(this);">
                            <option value='Id1'><?php echo $Config['com-ident'];?></option>
                            <option value='Id2'><?php echo $Config['com-identdos'];?></option>
                            <option value='Id3'><?php echo $Config['com-identtres'];?></option>								
                            <option value='FeEm'>redacción</option>
                            <option value='FeEm'>emisión</option>
                            <option value='FeCi'>cierre</option>	
                        </select>
                    </div>		
                </form>
            </div>
            
        </div>
        
        <div id='modelos'>
            <div id='fcnModelo' class='fila' name='' regId='' pnom='' fecha='' estado='' norden=''>
                
                <div name='origen' class='contenido origen'>
                    <a id='' name='cargarorigen' class='cargarorigen' title='sumar un origen' onclick='originarCom(this);' acc='Ed'> <-+  </a>
                </div><!--
                --><div class='contenido seleccion' acc='Ed'>
                    <div id='gestion'>
                        <div id='selector' name='selector' class='activo selector' onclick='multieditDOC(this,event);ultimamarca=this.parentNode.parentNode.getAttribute(\"norden\");'></div>
                        <div id='rel' class='relevante' ></div>
                    </div>
                    <div id='clasificacion'>
                        <span id='grupo'></span><span id='grupo2'></span>
                    </div>
                </div><!--
                --><a id='nom' target='_top' title=''  onclick='iraCom(event,this.parentNode.getAttribute("regId"),"");' class='contenido nombre '><span id='n'></span><span id='r'></span></a><!--
                --><div class='contenido descrip'>
                    <a class='infoDesc' onclick='obtieneDescripcionI(this);'>-I-</a>
                </div><!--
                --><div id='sen' class='contenido tipo abierta entrante oficial'></div><!--
                --><div id='adj' class='contenido adjunto'></div><!--						
                --><div id='fem' class='contenido emision'></div><!--
                --><div id='fre' class='contenido recepcion'></div><!--
                --><div id='fce' class='contenido cerradodesde'></div><!--
                --><div class='contenido ids'>
                    <div id='id1' class='id1 COMcomunicacion'></div>
                    <div id='id2' class='id2'>()</div>
                </div><!--
                --><div class='contenido responder'>si</div><!--
                --><div id='cra' class='contenido respuesta'>
                    <div class='contenedor' name='destino'>
                        <a id='' name='cargarespuesta' class='cargarespuesta' title='sumar una respuesta' onclick='responderCom(this);'> <-+  </a>
                        <div id='' name='AuxResp' class='AuxResp' >
                            <div sentido=''></div> <- Resp por: <div>...........</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id='modbanderaroja' class='banderaroja' title='la fecha de terminación esperada se encuentra vencida'></div>
            <div id='modojito' class='ojito' title='esta comunicación aún debe ser controlada'><img src='./img/ojo.png'></div>
           
            	
            <div id='modextra' class='extraoficialmarco' title='esta comunicaciones es extraoficial'>¡*!</div>	
            <div id='modhayadjuntos' class='hayadjuntos'>
				<img id='' alt='documentos adjuntos disponibles' src='./img/hayarchivo.png'>			
			</div>	
            
            <a id='modDocs'></a>
            <div id='modLink' regId='' pnom='' ><a onmouseover='resaltar(this);' onmouseout='deresaltar(this);' onclick="iraCom(event,this.parentNode.getAttribute('regId'),'');" sentido='' estado='' class='COMcomunicacion secundaria'></a><a onclick='elimRta(this);' class='eliminar respuesta' title='quitar como origen' target='_top'><-</a></div>
            <div id='modDesc' class='flotaDescripcion'><a onclick='toggleDesc(this)' estado='visible'>-</a><div class='descripcion'></div></div>
            <input id='modItem' class='COMcomunicacion' name='Crelac' title='' type='button' emision='' pnom='' regId='' sentido='' estado='' value='' onclick='crearLink(this);'>
        </div>
        
        
        <div id="contenidoextenso">				
            
            
            
            <div id="comunicaciones">
            </div>

        </div>
    </div>
</div>



<div id='form_com' estado='apagado' draggable='true' ondragstart='drag_start(event,this);'>	
    <div id='dBordeL' class='dragborde izquierdo'></div>
	
    <input type="hidden" name="id" value="">
    
    <div class='escroleable'>
    
        <div class='paquete identificacion'>

                <h2>Identificación <img id='cargando' src='img/cargando.gif'></h2>
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
                        <option sentido='saliente' name='sentido' value='saliente'>-saliente-</option>
                        <option sentido='entrante' name='sentido' value='entrante'>-entrante-</option>
                    </select>
                </div>
                
                <div class='medio'>
                    <h3 innerhtml_config='com-ident'>Nro</h3>
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
                <div class='medio'>
                    <h3 innerhtml_config='com-identdos'>numero secundario</h3>
                    <input id="identdos" class="chico" type="text" size="2" name="identdos">
                </div>
                
                <div class='medio'>	
                    <h3 innerhtml_config='com-identtres'>numero terciario</h3>
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
                        <input type='date' name='fechainicio' onchange='borrFecha(this)'>
                        <input onclick="hoyFecha(this)" value="hoy" type="button">
                    </div>
                    <div id='fechaobjetivo'>
                        <span>hasta</span>
                        <input type='date' name='fechaobjetivo' onchange='borrFecha(this)'>
                        <input onclick="hoyFecha(this)" value="hoy" type="button">
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
                <h3 id='grupoa'>Grupo Primario  <a href='javascript:void(0)' onclick='grupoForm("a")'><img alt='editar' src='./img/editar.png'></a></h3>				
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
                <h3 id='grupob'>Grupo Secundario  <a href='javascript:void(0)' onclick='grupoForm("b")'><img alt='editar' src='./img/editar.png'></a></h3>				
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
            	Resumen, descripcion extendida
            </h3>
             <textarea id='resumen' name="resumen"></textarea>
            <h3>	
            	Transcripción 
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
	<input type="button" class="cancela general" value="cancelar" onclick="cancelarCom();">
						
	<div id='botonescomplementarios'>	
		<input type="button" class="imprimir general" value="imprimir" onclick="guardarCom(this,'aimpresion');">
		<input id='elim' type="button" onclick='eliminarCom()' class="eliminar" value="eliminar">
		<input id='convalidar' type="button" onclick='validarCom()' class="validar" value="validar">
		<input id='duplicar' type="button" onclick="guardarCom(this,'aduplicar');" class="duplicar" value="duplicar">
	</div>
</div>


<div id='modelosubida' class="subiendo">
	<img id="cargando" src="./img/cargando.gif">
	<a onclick='eliminarDocCandidato(this)' id='eliminar'>x</a>
	
	<span id="archivo"></span>
	<div id='idents'>
		<input placeholder="id 1" name="ident">
		<input placeholder="id 2" name="identdos">
		<input placeholder="id 3" name="identtres">
	</div>
	<div id='sels'>
		<select name="sentido"><option value=''></option><option value='saliente'>saliente</option><option value='entrante'>entrante</option></select>
		<select name="preliminar"><option value='oficial'>oficial</option><option value='extraoficial'>extraoficial</option></select>
		<input type='date' name="emision">
	</div>
	<div id='txs'>
		<input placeholder="nombre" name="nombre">
		<textarea placeholder="resumen" name='resumen'></textarea>
	</div>
	<div id="grupoa">			
		<input 
	        type='hidden' 
	        id='Iid_p_grupos_id_nombre_tipoa' 
	        name='id_p_grupos_id_nombre_tipoa'
	    ><input
				soloeditores='cambia' 
	        name='id_p_grupos_id_nombre_tipoa-n' 
	        id='Iid_p_grupos_id_nombre_tipoa-n' 
	        onblur='controOpcionBlur(this);vaciarOpcionares(event)' 
	        onkeyup='filtrarOpciones(this);' 
	        onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
	    
    </div>
    
    
	<div id="grupob">	
		
		<input 
	        type='hidden' 
	        id='Iid_p_grupos_id_nombre_tipob' 
	        name='id_p_grupos_id_nombre_tipob'
	    ><input
				soloeditores='cambia' 
	        name='id_p_grupos_id_nombre_tipob-n' 
	        id='Iid_p_grupos_id_nombre_tipob-n' 
	        onblur='controOpcionBlur(this);vaciarOpcionares(event)' 
	        onkeyup='filtrarOpciones(this);' 
	        onfocus='opcionarGrupos(this);'><div class='auxopcionar'><div class='contenido'></div></div>
        
        
    </div>
	<a onclick='subirDocCandidato(this.parentNode)' id='procesar'>></a>
</div>	


<div id='coladesubidas'></div>	



<script type="text/javascript">
	
	var _UsuarioAcc='';
	var _UsuarioTipo='';
	
	var _PanelI='<?php echo $PanelI;?>';
    var _PanId='<?php echo $PanelI;?>';//deprecar
    
    var _nf=0;  
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
	
	
	$(document).ready(function(){stickybar();});
	
	var _ComunicacionesOrden={};//deprecated
	var _ComunicacionesCargadas={};// almacena datos de todas la ocmunicaciones cargdas
	var _avanceCod; //avance de la carga de ocmuniccnioes;
    var _Modelos={}; // modelos de comunicación definidos
	
	var _Config={};// configurción del panel
	
	document.querySelector('#formfiltro .busqueda input[name="busqueda"]').focus();
	
	

	
    var _HabilitadoEdicion='si';
    var _Grupos={
    	'grupos':{},
    	'grupsOrden':{}    	
    }; 
    
   
    var _linkeando='';
    var _idAcc='';
    
    var _listaditoSolG={
		"ga":'',
		"gb":''
	};
    
    var _listadocargado='no';

	var _seleccionDOCSid = new Array();
	var _ultimamarca='';

    var _filtro={
        'busqueda' : '',
        'abiertas' : 'todas',
        'sentido' : 'todas',
        'grupoa' : 'todas',
        'grupob' : 'todas',
        'orden' : 'Id1'
    };
    
    var _Hoy='<?php echo date("Y-m-d");?>';
    var _meses={
    	'01':'ene',
    	'02':'feb',
    	'03':'mar',
    	'04':'abr',
    	'05':'may',
    	'06':'jun',
    	'07':'jul',
    	'08':'ago',
    	'09':'sep',
    	'10':'oct',
    	'11':'nov',
    	'12':'dic'
    };



	//variables de arrastre para desplazar y cambiar el ctamaño del formulario
	var isResizing = false,
    lastDownX = 0,
    _anchoinicial = 0,
    _equisInicial = 0;
    var _excepturadragform='no';
    

	var _DatosListadito={};

	///variables cargar el formulario
    var _ComCargada={};
    $('input').on('mouseover',function(){
        document.querySelector('#form_com').removeAttribute('draggable');
        _excepturadragform='si';
    });
    $('input').on('mouseout',function(){
    document.querySelector('#form_com').setAttribute('draggable','true');
        _excepturadragform='no';
    });
    
</script>    
    	
	
<script charset='UTF-8' type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>

<script type="text/javascript" src="./COM/COM_gestion_filtrado.js?v=<?php echo time();?>"></script> <!--//funciones para filtrar las comunicaciones que se muestran.-->
<script type="text/javascript" src="./COM/COM_gestion_carga_inicial.js?v=<?php echo time();?>"></script> <!--//funciones para cargar los datos iniciales de la página.-->
<script type="text/javascript" src="./COM/COM_gestion.js?v=<?php echo time();?>"></script>
<script type="text/javascript" src="./COM/COM_gestion_interaccion.js?v=<?php echo time();?>"></script> <!--//funciones para ara mejora de la interaccion.-->
<script type="text/javascript" src="./COM/COM_gestion_form.js?v=<?php echo time();?>"></script> <!--//funciones para cargar los datos iniciales de la página.-->

<script type="text/javascript" src="./PAN/PAN_grupos_form.js?v=<?php echo time();?>"></script><!--///*carga funciones para el formuario de grupos*/.-->


<script type='text/javascript'>
	
	
	consultarConfig();// desencadena carga
	
	function Reinicia(){consultarConfig()};
	
	
	window.onbeforeunload = function(e) {
		//console.log(xhr)
		//console.log(Object(xhr).length);
		for(_xn in xhr){
			//console.log(xhr[_xn].readyState);
			if(xhr[_xn].readyState!=4){
				return 'Se suspenederan los documentos subiendo';
			}
		}
    }; 
</script>

<script type="text/javascript">
	
	<?php if(!isset($_GET['idcom'])){$_GET['idcom']=0;} ?>
	<?php if(isset($_GET['id'])){$_GET['idcom']=$_GET['id'];}// $_GET['id'] deprecated ?>
	
	var _IdCom='<?php echo $_GET['idcom'];?>';
	if(_IdCom > 0){	
		iraCom('','<?php echo $_GET['idcom'];?>','');			
	}
	
</script>

</body>
