<?php 
/**
* documentos.php
*
* documentos.php se incorpora en la carpeta raiz en tanto resulta el punto inicial del módulo 
* de gestión y archivo de documentación
* contiene y coordina aplicaciones específicas para gestiónar documentación.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2015 TReCC SA
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

ini_set('display_errors', '1');

include ('./includes/header.php');

ini_set('display_errors',true);
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
    terminar($Log); 
}

$HabilitadoEdicion='no';
$DisableEdicion="disabled='disabled'";

$nivelespermitidos=array(
'administrador'=>'si',
'editor'=>'si',
'relevador'=>'no',
'auditor'=>'no',
'visitante'=>'no'
);
if(!isset($nivelespermitidos[$UsuarioAcc])){
    $HabilitadoEdicion='no';
	$DisableEdicion="disabled='disabled'";
}
if($nivelespermitidos[$UsuarioAcc]=='si'){
    $HabilitadoEdicion='si';
	$DisableEdicion="";
}

include ('./PAN/PAN_consultainterna_config.php');//define variable $Config

		
	$Hoy_a = date("Y");
	$Hoy_m = date("m");	
	$Hoy_d = date("d");
	$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;	

	if(!isset($_GET['comunicacion'])){$_GET['comunicacion']='0';}
?>
<!DOCTYPE html>
<head>
	<title>Panel de control</title>
	<link rel="stylesheet" type="text/css" href="./css/panelbase.css">
	<link rel="stylesheet" type="text/css" href="./css/documentos_comunes.css">
	<link rel="stylesheet" type="text/css" href="./css/DOC.css">
	<link rel="stylesheet" type="text/css" href="./css/DOC_form.css">	
	<link rel="stylesheet" type="text/css" href="./css/objetoscomunes.css">	
	<link rel="stylesheet" type="text/css" href="./css/form.css"> <!--//estilo para el formulario central -->
	<?php 
	include("./includes/meta.php");
	?>

	<style type="text/css">
	
.fila > a {
    max-height: 20px;
	overflow:hidden;
}

.version[selecto='si']{
	border:2px solid #000;
}
.version[selecto='no']{
}

#ayudaVerResumen, #ayudaVerData{
	display:none;
}
#ayudaVerResumen > .version{
	height:7px;
	width:8px;
	vertical-align:middle;
}
#ayudaVerCompleta > span,
#ayudaVerResumen > span{
	display:inline-block;
	width:30px;
	vertical-align:middle;
}

#ayudaVerData > #seleccionados{
	border-top:1px solid #000;
	border-bottom:1px solid #000;
}
#acciones > span{
	display:inline-block;
	min-width:30px;
	text-align:center;
	border:1px solid #000;
}
#advertenciafiltro{
    display:none;
}
.formCent label.upload{
    position:relative;
    margin:0;
}
.formCent textarea {
    width: calc(100% - 140px - 10px);
    vertical-align: top;
}
.formCent #comunicaciones {
    width: 150px;
}
#op_comunicaciones {
    display: inline-block;
    width: calc(100% - 150px - 10px);
    height: 365px;
    overflow-y:hidden ;
    overflow-x:auto ;
}
.formCent #sentido,.formCent #contrasentido{
   white-space: nowrap;
}

.formCent #sentido div {
    display: inline-block;
    border: 1px solid #000;
    width: calc(25% - 6px);
    min-width: 100px;
    white-space: normal;
}
.formCent #contrasentido div {
    display: inline-block;
    border: 1px solid #000;
    width: calc(25% - 6px);
    min-width: 100px;
    white-space: normal;

}
#archivos > div{
    display:inline-block;
}
#listadosubido > a{
    position:relative;    
}

a.archivoelim{
    position:absolute;
    color:red;
    top:-8px;
    right:1px;
    z-index:5;
    font-size:10px;    
}

.formCent #comunicaciones > div[estado='cargado'] a.elige{
    display:none;
}
.formCent #comunicaciones > div[estado='vacio'] a.vacia{
    display:none;
}
select.modo{
	width:100px;
}
	</style>
</head>
<body>

<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>	
<script type="text/javascript">
	var _PanelI='<?php echo $PanelI;?>';	
	var _HabilitadoEdicion='<?php echo $HabilitadoEdicion;?>';	
	var _idCom='<?php echo $_GET['comunicacion'];?>';
	var _idDoc='';// si se adopta un valor mayo a cero, al cargar el listado también abre el formuladio para documentos con los datos del doc id correspondiente.	
	var _Grupos;
	var _Modo='gestion';
	
</script> 

<?php
insertarmenu();
?>
		
    <div class='recuadros' id='recuadro'>
        <div id='ayudaVerCompleta'>
            <span>click</span><div class='version enevaluacion'></div> para visualiar su información asociada.
        <br><span>ctrl +</span><div class='version enevaluacion'></div> para sumar o restar una versión al conjunto seleccionado.
        <br><span>alt +</span><div class='version enevaluacion'></div> para seleccionar todas las últimas versiones entre la selección anterior y la nueva.
        </div>
        
        <div id='ayudaVerResumen'>
            <span>click</span><div class='version enevaluacion'></div>: seleccionar.
            <br><span>ctrl +</span><div class='version enevaluacion'></div>: sumar o restar.
            <br><span>alt +</span><div class='version enevaluacion'></div>: rango.
        </div>
        
        <div id='ayudaVerData'>
            <div id='seleccionados'></div>
            <div id='estados'></div>
            <div id='acciones'>
                <h2>planificados</h2>
                si: <span class='' id='sifech'></span> / no: <span id='nofech'></span> <a onclick='editarMultiVersion("fecha")'>cambiar</a>
                <h2>presentados</h2>
                si: <span class='enevaluacion' id='sipre'></span> / no: <span id='nopre'></span> <a onclick='editarMultiVersion("pre")'>cambiar</a>
                <h2>aprobado</h2>
                si: <span class='aprobada' id='siapr'></span> / no: <span id='noapr'></span> <a onclick='editarMultiVersion("apr")'>cambiar</a>
                <h2>enviado a revisión</h2>
                si: <span class='rechazada' id='sirev'></span> / no: <span id='norev'></span> <a onclick='editarMultiVersion("rev")'>cambiar</a>
                <h2>anulado</h2>
                si: <span class='anulada' id='sianu'></span> / no: <span id='noanu'></span> <a onclick='editarMultiVersion("anu")'>cambiar</a>
            </div>
        </div>
    </div>
					
	<div id="pageborde">
		<div id="page">
			<h1>Gestor de documentos de obra</h1>
			<label>ver en modo:</label>
			<select class='modo' onchange='_Modo=this.value;consultarDocs();'>
				<option value='gestion'>Gestion</option>
				<option value='tabla'>Tabla</option>
				<option value='gestion'>Visado</option>	
			</select>	
			<br>
			<a onclick='cargarOrigen();'>cargar Documentos desde archivos</a>
			<br>
			<a onclick='crearDoc()'>agregar Documento</a>
				
			
			<script type='text/jscript'>			
				function filtrado(_idDoc){
					//console.log(_idCom);
					if(_idCom=='0'){return true;}
                    //define filtro para elimina planos del array cuando no cumplen con las condiciones de filtro
                    return true;
                    _dat=DatosDocs.docs[_idDoc];
                    _filtComId=_idCom;                        
                    for(_nov in _dat.versiones){                            
                        if(_dat.versiones[_nov].presenta==_filtComId){                                
                            DatosDocs.docs[_idDoc].versiones[_nov].extraclase='resaltado';
                            return true;
                        }
                        if(_dat.versiones[_nov].aprueba==_filtComId){                            
                            DatosDocs.docs[_idDoc].versiones[_nov].extraclase='resaltado';
                            return true;
                        }
                        if(_dat.versiones[_nov].rechaza==_filtComId){                                
                            DatosDocs.docs[_idDoc].versiones[_nov].extraclase='resaltado';
                            return true;
                        }
                        if(_dat.versiones[_nov].anula==_filtComId){
                            DatosDocs.docs[_idDoc].versiones[_nov].extraclase='resaltado';
                            return true;
                        }
                    }
                    return false;			
                }
			</script>
			
<?php		
	$filtros[]='estado';
	$filtros[]='anulado';
	$filtros[]='adjuntos';	
	$filtros[]='grupoa';
	$filtros[]='grupob';	
	$filtros[]='orden1';
	$filtros[]='orden2';
	$filtros[]='orden3';
	$filtrodefaults['estado']='todas';
	$filtrodefaults['anulado']='todas';
	$filtrodefaults['adjuntos']='todas';
	$filtrodefaults['grupoa']='todas';
	$filtrodefaults['grupob']='todas';
?>

        <div id='contenidoextenso'>	
        
			<div class="fila filtro" id='advertenciafiltro'>
                <h4>
                    se muestran solo los documentos vinculados con la comunicacion
                    <div style='display:inline-block;' class='COMcomunicacion' id='comunicacionmuestra'></div>
                    <a href='./DOC_reporte.php'>mostrar todo</a>
                </h4>
			</div>
		
				<div style='display:none;' class="fila filtro">
					<form action='' method='post'>
						<div>
                            <input type='submit' value='mostrar'><br>filtrado: 0
						</div>
						
							<?php 
							
							$FF= array(
								"estado" => array('todo','prog','eval','aprob','a rev'),
								"anulado" => array('todo','no anulados','anulados'),
								"adjuntos" => array('todo','c/ adjuntos','s/ adjuntos'));
							
							foreach($FF as $campo => $valores){
								echo "<div id='F$campo' campo='$campo'>";
								foreach($valores as $val){
									echo "<label val='$val'>
										<input type='radio' name='$campo' value='$val' "./*$ceck[$campo.'-'.$valor].*/"><span onclick='toogle(this);'>".$val."</span>
									</label>";
								}
								echo "</div>";
							}
						
							$CCC=array('grupoa','grupob');
							foreach($CCC as $campo){						
								echo "
								<div id='F$campo' campo='$campo'>							
									<label class='corto'>
										<input type='radio' name='$campo' value='todo' "./*$ceck[$campo.'-'.$valor].*/"><span onclick='toogle(this);'>todo</span>
									</label>
								</div>
								";		
							}		

						$criteriosdeorden['sector']='Sect';
						$criteriosdeorden['planta']='Planta';		
						$criteriosdeorden['numero']='Documento Número';	
						$criteriosdeorden['nombre']='Nombre del Documento';	
						$criteriosdeorden['escala']='escala';	
						$criteriosdeorden['rubro']='rubro';	
						$criteriosdeorden['tipologia']='tipo';	
						$criteriosdeorden['estado']='estado';	
						$criteriosdeorden['desde']='desde';	
						$criteriosdeorden['ultimaver']='versiones';												
									
						?>	
						
			
							<?php
							$campo='orden1';
							echo "<div id='O$campo' campo='$campo'>";
							echo "
							ord 1:
							<select name='$campo'>";		
								echo "<option value=''>-elegir-</option>";			
								foreach($criteriosdeorden as $k => $c){
									echo "
									<option value='$k'>$c</option>
									";
								}
							echo "</select>";
							echo "</div>";
					
							$campo='orden2';
							echo "<div id='O$campo' campo='$campo'>";
							echo "
							ord 2:
							<select name='$campo'>";	
								echo "<option value=''>-elegir-</option>";							
								foreach($criteriosdeorden as $k => $c){
									echo "
									<option value='$k'>$c</option>
									";
								}
							echo "</select>";
							echo "</div>";
				
							$campo='orden3';
							echo "<div id='O$campo' campo='$campo'>";
							echo "
							ord 3:
							<select name='$campo'>";	
							echo "<option value=''>-elegir-</option>";							
								foreach($criteriosdeorden as $k => $c){
									echo "
									<option value='$k'>$c</option>
									";
								}
							echo "</select>";
							echo "</div>";
							
						
							?>					
							
					</form>
				</div>	
				
                <div id='modelo' class='fila soloEdicion'>
                    <div class='sector'></div>
                    <div class='planta'></div>
                    <div name='selector' class='activo selector' iddoc='' docorden='1'></div>
                    <a href='./agrega_f.php?accion=cambia&tabla=DOCdocumento&id=&salida=documentos' title='' class='numero '></a>
                    <a href='./agrega_f.php?accion=cambia&tabla=DOCdocumento&id=&salida=documentos' class='nombre'></a>
                    <div class='escala'></div>
                    <div class='rubro'></div>
                    <div class='tipologia'></div>
                    <div class='estado'></div>
                    <div class='fecha'></div>
                    <div class='versionesventana'></div>
                </div>

				</div>
                    <div id='contenidoextensoPost'>
				</div>
			</div>			
		</div>		
	</div>

	<form action='COM_ed_guarda_doc' enctype='multipart/form-data' method='post' style='display:none;' id="editorArchivos">
		<h1 id='tituloformulario'></h1>
		<p id='desarrollo'></p>
		<label>Tipo de carga</label>
		<select name='modo'>
			<option value='auto'>automático</option>
			<option value='original'>original</option>
			<option value='anexo'>anexo</option>			
		</select>
		
		<input type='hidden' name='tipo' value=''>
		<input type='hidden' name='zz_AUTOPANEL' value=''>
		<label>Grupo Primario</label>
		<input type='hidden' name='id_p_grupos_id_nombre_tipoa' value=''>
		<input type='text' name='id_p_grupos_id_nombre_tipoa-n' onkeyup='opcionNo(this);' value=''>
		<div class='opciones' for='id_p_grupos_id_nombre_tipoa'></div>
		<label>Grupo Secundario</label>
		<input type='hidden' name='id_p_grupos_id_nombre_tipob' value=''>
		<input type='text' name='id_p_grupos_id_nombre_tipob-n' onkeyup='opcionNo(this);' value=''>
		<div class='opciones' for='id_p_grupos_id_nombre_tipob'></div>
		
		<label title="">Un separador (o más) de términos en el nombre del archivo </label>
		<input name='criterioseparador' value='<?php echo $Config['doc-nomenclaturaarcseparador'];?>'>
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

		<textarea name='criterio'><?php echo $Config['doc-nomenclaturaarchivos'];?></textarea>
		<a class='botoncerrar' onclick='cerrar(this);'>cerrar</a>
		<label>Arraste archivos de comunicaciones al interior:</label>
		<div id='contenedorlienzo'>									
			<div id='upload'>
				<input multiple='' id='uploadinput' style='position:relative;opacity:0.5;' type='file' name='upload' value='' onchange='cargarDoc(this);'>
			</div>
			<div id='enviados'></div>
		</div>
		<div id='listacargando'>
		</div>						
	</form>	
<div id='listaedicion'></div>																

<script type="text/javascript">


function consultarGrupos(){		
	var _parametros = {	};
	
	$.ajax({
		url:   './PAN/PAN_grupos_consulta.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			if(_res.res=='exito'){
				_Grupos=_res.data;
			}else{
				alert('error al consultar los grupos de este panel');
				console.log(_res);
			}
		}
	});	
}
consultarGrupos();


function cargaFiltros(){
	
	$_cATS=Array('grupoa','grupob');
	for(_nc in $_cATS){
		_cat=$_cATS[_nc];
		
		if(DatosDocs.categorias[_cat]!=undefined){
		_div=document.getElementById('F'+_cat);
		//console.log(DatosDocs.categorias[_cat].length);
		if(Object.keys(DatosDocs.categorias[_cat]).length<3){
			for(_nn in DatosDocs.categorias[_cat]){
				_Nam=DatosDocs.categorias[_cat][_nn];
				_lab=document.createElement('label');
				_lab.setAttribute('class','corto');
				_div.appendChild(_lab);
				_lab.innerHTML="<input type='radio' name='"+_cat+"' value='"+_nn+"'><span onclick='toogle(this);'>"+_Nam+"</span>";
			}
		}else{
			_sel=document.createElement('select');
			_sel.setAttribute('name',_cat);
			for(_nn in DatosDocs.categorias[_cat]){
				//alert(_nn);
				_Nam=DatosDocs.categorias[_cat][_nn];
				_lab=document.createElement('label');
				_lab.setAttribute('class','corto');
				_div.appendChild(_lab);
				_lab.innerHTML="<input type='radio' name='"+_cat+"' value='"+_nn+"'><span onclick='toogle(this);'>"+_Nam+"</span>";
			}
		}
	}
	}
}




var	DatosComs=Array();
var DatosDocs=Array();

//consulta inicial de doumentos
function consultarDocs(_idreg){		
	 
	var _parametros = {
		"panid" :_PanelI,
		"iddoc" :_idreg,
		"idcom" :_idCom
	};
	
	$.ajax({
		url:   './DOC/DOC_consulta_doc.php',
		type:  'post',
		data: _parametros,
		success:  function (response){
			var _res = $.parseJSON(response);
			
			DatosDocs=_res.data;
			
			for(_nm in _res.mg){
                alert(_res.mg[_nm]);
			}
			
			cargaFiltros();
			
			if(_res.data.tipo=='undoc'){
				console.log('actualiza 1');
				_iddoc=Object.keys(_res.data.docs)[0];
				actualizarMuestra(_res,_iddoc);
			}else{
				console.log('actualiza todo');
                
                if(_Modo == 'gestion'){
                	mostratComoGestion(_res);
                }else if(_Modo =='tabla'){
                	mostratComoTabla(_res);
                }else{
                	mostratComoGestion(_res);
                }
                
			}
			
		}
	});	
}
consultarDocs('');

function actualizarMuestra(_res,_idreg){
	_conE=document.getElementById('contenidoextensoPost');
	_categ=_res.data.categorias;
	_datos=_res.data.docs[_idreg];	
	_fila =_conE.querySelector(".fila[idreg='"+_idreg+"']");
	_fila.innerHTML='';	
	_fila.setAttribute('class','fila');
	_fila.setAttribute('idreg',_datos.id);
	if(_datos.grupoa==null){_I1=0;}else{_I1=_datos.grupoa;}
	_fila.setAttribute('ga',_I1);
	if(_datos.grupob==null){_I2=0;}else{_I2=_datos.grupob;}
	_fila.setAttribute('gb',_I2);
	
	_fila.innerHTML="<div class='sector'>"+_categ.id_sector[_datos.id_sector].nombre+"</div>";
	_fila.innerHTML+="<div class='planta'>"+_categ.id_planta[_datos.id_planta].nombre+"</div>";
	_fila.innerHTML+="<div class='activo selector' onclick='multieditDOC(this,event,\"\");_ultimamarca=\"4\";' docorden='4' iddoc='"+_idreg+"' name='selector'>";
	
	_dnum=document.createElement('a');
	_dnum.setAttribute('class','numero');
	_dnum.setAttribute('ondblclick','formularDocumento(this,"cargar")');
	_dnum.innerHTML=_datos.numerodeplano;
	_fila.appendChild(_dnum);
	
	_dnom=document.createElement('a');
	_dnom.setAttribute('class','nombre');
	_dnom.setAttribute('ondblclick','formularDocumento(this,"cargar")');
	_dnom.innerHTML=_datos.nombre;
	_fila.appendChild(_dnom);
		
	
	_fila.innerHTML+="<div class='escala'>"+_categ.id_escala[_datos.id_escala].nombre+"</div>";
	_fila.innerHTML+="<div class='rubro'>"+_categ.id_rubro[_datos.id_rubro].nombre+"</div>";
	_fila.innerHTML+="<div class='tipologia'>"+_categ.id_tipologia[_datos.id_tipologia].nombre+"</div>";
	var _divest=document.createElement('div');
	_divest.setAttribute('class','estado');										
	_fila.appendChild(_divest);
	
	var _divfech=document.createElement('div');
	_divfech.setAttribute('class','fecha');										
	_fila.appendChild(_divfech);
	
	_versionesv=document.createElement('div');
	_versionesv.setAttribute('class','versionesventana');
	
	_versionesc=document.createElement('div');
	_versionesc.setAttribute('class','cversiones');
	_versionesv.appendChild(_versionesc);
	
	//console.log("____"+_idreg);
	for(_vn in _datos.versiones){
		console.log(_vn);
		_estado=_datos.versiones[_vn].estado;
		_estadotx=_datos.versiones[_vn].estadotx;
		
		_divest.innerHTML=_estadotx;
		_divest.setAttribute('class','estado '+_estado);
		
		_divfech.innerHTML=_datos.versiones[_vn].desde;
		
		_verI =document.createElement('div');
		_verI.setAttribute('class','version '+_estado);
		_verI.setAttribute('name','cuadrodeversiones');
		_verI.setAttribute('onclick','multieditVER(this,event)');
		_verI.setAttribute('selecto','no');
		_verI.setAttribute('idreg',_datos.versiones[_vn].id);
		_verI.setAttribute('ondblclick','formularVersion(this,"cargar")');
		_verI.setAttribute('name','elemento');
		_verI.setAttribute('nnver',_datos.versiones[_vn].numversion);
		_verI.setAttribute('nover',_vn);
		_verI.innerHTML=_datos.versiones[_vn].numversion;
		_versionesc.appendChild(_verI);	
	}
	
									
	_verI =document.createElement('a');
	_verI.setAttribute('class','version');
	_verI.setAttribute('onclick','formularVersion(this,"crear")');
	_verI.innerHTML="+";
	_versionesc.appendChild(_verI);
		
	_fila.appendChild(_versionesv);
	//_fila.innerHTML=_docid;				

}	

function mostratComoTabla(_res){
	_conE=document.getElementById('contenidoextensoPost');	
	_conE.innerHTML='';
	_cont=document.createElement('table');
	_conE.appendChild(_cont);
	
	for(_I1 in _res.data.indice){
		_fila=document.createElement('tr');

		
		if(_res.data.grupos[_I1] == undefined){_grupo ='General';}else{
			_grupo =_res.data.grupos[_I1].nombre;
		}
		
		_fila.innerHTML="<th>"+_grupo+"</th>";
		_cont.appendChild(_fila);		
		for(_I2 in _res.data.indice[_I1]){
			_fila=document.createElement('tr');
			
			if(_res.data.grupos[_I2] == undefined){_grupo ='General';}else{
				_grupo ="<th>"+_res.data.grupos[_I2].nombre+"</th>";
			}						
			_fila.innerHTML=_grupo;
			
			_cont.appendChild(_fila);		
			for(_I3 in _res.data.indice[_I1][_I2]){
				
				for(_I4 in _res.data.indice[_I1][_I2][_I3]){
					for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
						for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
							_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
							_datos=_res.data.docs[_docid];
							_fila=document.createElement('tr');
							
							_fila.setAttribute('class','fila');
							_fila.setAttribute('ga',_I1);
							_fila.setAttribute('gb',_I2);
							
							_fila.innerHTML="<td class='sector'>"+_categ.id_sector[_datos.id_sector].nombre+"</td>";
							_fila.innerHTML+="<td class='planta'>"+_categ.id_planta[_datos.id_planta].nombre+"</td>";
							
							_fila.innerHTML+="<td class='numero' >"+_datos.numerodeplano+"</td>";
							_fila.innerHTML+="<td class='nombre' >"+_datos.nombre+"</td>";
							_fila.innerHTML+="<td class='escala'>"+_categ.id_escala[_datos.id_escala].nombre+"</td>";
							_fila.innerHTML+="<td class='rubro'>"+_categ.id_rubro[_datos.id_rubro].nombre+"</td>";
							_fila.innerHTML+="<td class='tipologia'>"+_categ.id_tipologia[_datos.id_tipologia].nombre+"</td>";
							var _divest=document.createElement('td');
							_divest.setAttribute('class','estado');										
							_fila.appendChild(_divest);
							
							var _divfech=document.createElement('td');
							_divfech.setAttribute('class','fecha');										
							_fila.appendChild(_divfech);
				
							
							for(_vn in _datos.versiones){									
								_estado=_datos.versiones[_vn].estado;
								_estadotx=_datos.versiones[_vn].estadotx;
								_divest.innerHTML=_estadotx;
								_divest.setAttribute('class','estado '+_estado);
								_divfech.innerHTML=_datos.versiones[_vn].desde;
								_verI =document.createElement('td');
								_verI.setAttribute('class','version '+_estado);
								_verI.setAttribute('name','cuadrodeversiones');
								_verI.setAttribute('name','elemento');
								_verI.innerHTML=_datos.versiones[_vn].numversion+" "+_estadotx ;
								_fila.appendChild(_verI);
							}
							
							
							//_fila.innerHTML=_docid;
							_cont.appendChild(_fila);					
							
						}	
					}	
				}
			}	
		}
	}
}

function mostratComoGestion(_res){
	_cont=document.getElementById('contenidoextensoPost');	
	_cont.innerHTML='';
	_categ=_res.data.categorias;
	for(_I1 in _res.data.indice){
		if(_I1!=-1){
			_fila=document.createElement('h1');
			if(_res.data.grupos[_I1] == undefined){_grupo ='General';}else{
				_grupo =_res.data.grupos[_I1].nombre;
			}
			_fila.innerHTML=_grupo;
			_cont.appendChild(_fila);
					
			for(_I2 in _res.data.indice[_I1]){
				_fila=document.createElement('h2');	
				if(_res.data.grupos[_I2] == undefined){_grupo ='General';}else{
					_grupo =_res.data.grupos[_I2].nombre;
				}						
				_fila.innerHTML=_grupo;
				_cont.appendChild(_fila);
						
				for(_I3 in _res.data.indice[_I1][_I2]){
					
					for(_I4 in _res.data.indice[_I1][_I2][_I3]){
						for(_I5 in _res.data.indice[_I1][_I2][_I3][_I4]){
							for(_I6 in _res.data.indice[_I1][_I2][_I3][_I4][_I5]){
								_docid=_res.data.indice[_I1][_I2][_I3][_I4][_I5][_I6];
								
								if(_res.data.docs[_docid]==undefined){
										continue;//este deocumento fue filtrdo por no involucrear a la comunicacion en get
								}
								_datos=_res.data.docs[_docid];
								
								if(filtrado(_docid)){
									
									_fila=document.createElement('div');
									
									_fila.setAttribute('class','fila');
									_fila.setAttribute('idreg',_datos.id);
									
	
									_fila.setAttribute('ga',_I1);
									_fila.setAttribute('gb',_I2);
									
									_fila.innerHTML="<div class='sector'>"+_categ.id_sector[_datos.id_sector].nombre+"</div>";
									_fila.innerHTML+="<div class='planta'>"+_categ.id_planta[_datos.id_planta].nombre+"</div>";
									_fila.innerHTML+="<div class='activo selector' onclick='multieditDOC(this,event,\"\");_ultimamarca=\"4\";' docorden='4' iddoc='2889' name='selector'>";
									
									_dnum=document.createElement('a');
                                    _dnum.setAttribute('class','numero');
                                    _dnum.setAttribute('ondblclick','formularDocumento(this,"cargar")');
                                    _dnum.innerHTML=_datos.numerodeplano;
                                    _fila.appendChild(_dnum);
                                    if(_idDoc == _datos.id){formularDocumento(_dnum,'cargar');}
                                    
                                    _dnom=document.createElement('a');
                                    _dnom.setAttribute('class','nombre');
                                    _dnom.setAttribute('ondblclick','formularDocumento(this,"cargar")');
                                    _dnom.innerHTML=_datos.nombre;
                                    _fila.appendChild(_dnom);
                                    
									_fila.innerHTML+="<div class='escala'>"+_categ.id_escala[_datos.id_escala].nombre+"</div>";
									_fila.innerHTML+="<div class='rubro'>"+_categ.id_rubro[_datos.id_rubro].nombre+"</div>";
									_fila.innerHTML+="<div class='tipologia'>"+_categ.id_tipologia[_datos.id_tipologia].nombre+"</div>";
									var _divest=document.createElement('div');
									_divest.setAttribute('class','estado');										
									_fila.appendChild(_divest);
									
									var _divfech=document.createElement('div');
									_divfech.setAttribute('class','fecha');										
									_fila.appendChild(_divfech);
									
									_versionesv=document.createElement('div');
									_versionesv.setAttribute('class','versionesventana');
									
									_versionesc=document.createElement('div');
									_versionesc.setAttribute('class','cversiones');
									_versionesv.appendChild(_versionesc);
									
									
									for(_vn in _datos.versiones){
										
										_estado=_datos.versiones[_vn].estado;
										_estadotx=_datos.versiones[_vn].estadotx;
										
										_divest.innerHTML=_estadotx;
										_divest.setAttribute('class','estado '+_estado);
										
										_divfech.innerHTML=_datos.versiones[_vn].desde;
										
										
										_verI =document.createElement('div');
										_verI.setAttribute('idreg',_datos.versiones[_vn].id);
										_verI.setAttribute('class','version '+_estado);
										_verI.setAttribute('name','cuadrodeversiones');
										_verI.setAttribute('onclick','multieditVER(this,event)');
										_verI.setAttribute('selecto','no');
										_verI.setAttribute('ondblclick','formularVersion(this,"cargar")');
										_verI.setAttribute('name','elemento');
										_verI.setAttribute('nnver',_datos.versiones[_vn].numversion);
										_verI.setAttribute('nover',_vn);
										_verI.innerHTML=_datos.versiones[_vn].numversion;
										
										if(_datos.versiones[_vn].extraclase!=undefined){
                                            _verI.setAttribute('class',_verI.getAttribute('class')+' '+_datos.versiones[_vn].extraclase);
                                        }
										
										//console.log(typeof _datos.versiones[_vn].archivo);
										//console.log(" | "+_docid +" _ v: "+_vn+" |");
                                        if(Object.keys(_datos.versiones[_vn].archivos).length>0){
												
											_img=document.createElement('img');
											_img.src="./img/hayarchivo.png";
											_ni=0;
											_str='';
											for(_nn in _datos.versiones[_vn].archivo){
                                                _ni+=1;
                                                _str+=_ni+": "+_datos.versiones[_vn].archivo[_nn].archivo;
                                            }
                                            _img.title=_str;
                                            _verI.appendChild(_img);
											
										}
										_versionesc.appendChild(_verI);
									}
																	
									_verI =document.createElement('a');
									_verI.setAttribute('class','preversion');
									_verI.setAttribute('onclick','formularVersion(this,"crear")');
									_verI.innerHTML="+";
									
									_versionesc.appendChild(_verI);
									
									_fila.appendChild(_versionesv);
									//_fila.innerHTML=_docid;
									_cont.appendChild(_fila);
								}	
								
							}	
						}	
					}
				}	
			}
		}
	}
	
}
</script>

<script type="text/javascript" src="./DOC/DOC_form_version.js">
	//carga funciones para el formuario de versiones
</script>	

<script type="text/javascript" src="./DOC/DOC_form_doc.js">
	//carga funciones para el formuario de versiones
</script>	


<script type="text/javascript">
//carga formulario vacio de versiones
function formularVersion(_this,_accion){

	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles
	_viejo=document.getElementById('formcent');
	if(_viejo!=null){
		_viejo.parentNode.removeChild(_viejo);
	}		
	_form=document.createElement('form');
	_form.setAttribute('id','formcent');
	_form.setAttribute('class','formCent');
	_form.setAttribute('ga',JSON.stringify(_I1));
	
	_form.setAttribute('gb',JSON.stringify(_I2));
	document.body.appendChild(_form);
	var _this = _this;
	var _accion = _accion;
	//var self = this;
	
	$.ajax({
		url: './DOC/DOC_form_version.php',
		dataType: 'html',
		type: 'GET',
		async: false
	}).done(function(html) {
		_form.innerHTML=html;
		_form.style.display='block';
			
		if(_accion=='crear'){
			if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
			if(_this.previousSibling==null){
			_NnVer=1;	
			}else{
			_NnVer=parseInt(_this.previousSibling.getAttribute('nnver'))+1;
			}
			_docid=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
			_form.querySelector('#Inumero').value=_NnVer;
			_form.querySelector('#bcambia').style.display='none';
			_form.querySelector('#bborra').style.display='none';
			_form.querySelector('#Iaccion').value='agrega';
			_form.querySelector('#Iid_p_DOCdocumento_id').value=_docid;
			
			
		}else if(_accion=='cargar'){
			
			_docid=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
			_verid=_this.getAttribute('idreg');
			_veR=_DatosVer[_verid];
			_doC=DatosDocs.docs[_docid];
			console.log('doc: '+_docid+' ; verno:'+_veR.numversion);
			
			_form.querySelector('#cnid').innerHTML=_verid;
			_form.querySelector('#cid').value=_verid;
			_form.querySelector('#Iid_p_DOCdocumento_id').value=_docid;
			
			_form.querySelector('#bagrega').style.display='none';
			_form.querySelector('#Iaccion').value='cambia';
			
			_form.querySelector('#Inumero').value=_veR.numversion;
			
        
            _spl=_veR.previstoorig.split("-");
            if(_spl.length>1){
                _form.querySelector('#Iprevistoorig_d').value=_spl[2];
                _form.querySelector('#Iprevistoorig_m').value=_spl[1];
                _form.querySelector('#Iprevistoorig_a').value=_spl[0];
            }
        
			
            _spl=_veR.previstoactual.split("-");
            if(_spl.length>1){
                _form.querySelector('#Iprevistoactual_d').value=_spl[2];
                _form.querySelector('#Iprevistoactual_m').value=_spl[1];
                _form.querySelector('#Iprevistoactual_a').value=_spl[0];
            }
			
			for(_nn in _veR.archivos){
				_spl=_veR.archivos[_nn].FI_documento.split("/");
				_aaa=document.createElement('a');
				_aaa.setAttribute('download',_veR.archivos[_nn].FI_nombreorig);
				_aaa.setAttribute('href',_veR.archivos[_nn].FI_documento);
				_aaa.innerHTML=_spl[(_spl.length-1)];
				_form.querySelector('#archivos #listadosubido').appendChild(_aaa);
				
				_aab=document.createElement('a');
				_aab.setAttribute('idarch',_veR.archivos[_nn].id);
				_aab.setAttribute('class','archivoelim');
				_aab.setAttribute('archivo',_veR.archivos[_nn].FI_documento);
				_aab.setAttribute('onclick','ConfEliminarArchivo(this,event)');
				_aab.innerHTML='elim';
				_aaa.appendChild(_aab);
				
			}
			_form.querySelector('#Idescripcion').value=_veR.descripcion;
							
			_form.querySelector('#Iid_p_comunicaciones_id_ident_entrante').value=_veR.id_presenta;
			_form.querySelector('#Iid_p_comunicaciones_id_ident_aprobada').value=_veR.id_aprueba;
			_form.querySelector('#Iid_p_comunicaciones_id_ident_rechazada').value=_veR.id_rechaza;
			_form.querySelector('#Iid_p_comunicaciones_id_ident_anulada').value=_veR.id_anula;
			
			if(_veR.id_presenta>0){
				cargaCom(_veR.id_presenta,_form.querySelector('#datoscomPresenta span.muestra'));
				_form.querySelector('#datoscomPresenta').setAttribute('estado','cargado');
			}else{
                _form.querySelector('#datoscomPresenta').setAttribute('estado','vacio');
			}
			
			if(_veR.id_aprueba>0){
				cargaCom(_veR.id_aprueba,_form.querySelector('#datoscomAprueba span.muestra'));
                _form.querySelector('#datoscomAprueba').setAttribute('estado','cargado');
			}else{
                _form.querySelector('#datoscomAprueba').setAttribute('estado','vacio');
			}
			
			if(_veR.id_rechaza>0){
				cargaCom(_veR.id_rechaza,_form.querySelector('#datoscomRechaza span.muestra'));
                _form.querySelector('#datoscomRechaza').setAttribute('estado','cargado');
			}else{
                _form.querySelector('#datoscomRechaza').setAttribute('estado','vacio');
			}
			
			if(_veR.id_anula>0){
				cargaCom(_veR.id_anula,_form.querySelector('#datoscomAnula span.muestra'));
                _form.querySelector('#datoscomAnula').setAttribute('estado','cargado');
			}else{
                _form.querySelector('#datoscomAnula').setAttribute('estado','vacio');
			}
			
		}
		
	});
	
};


function editarMultiVersion(_accion){
	
	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles
	_viejo=document.getElementById('formcent');
	if(_viejo!=null){
		_viejo.parentNode.removeChild(_viejo);
	}		
	
	_form=document.createElement('form');
	_form.setAttribute('id','formcent');
	_form.setAttribute('class','formCent');
	_form.setAttribute('ga',_I1);
	_form.setAttribute('gb',_I2);
	document.body.appendChild(_form);
	var _this = _this;
	var _accion = _accion;
	
	//var self = this;
	
	$.ajax({
		url: './DOC/DOC_form_multiversion.php',
		dataType: 'html',
		type: 'GET',
		async: false
	}).done(function(html) {
		_form.innerHTML=html;
		_form.style.display='block';
			
			_menu=_form.querySelectorAll('#comunicacionesCambia > label');
			
			for(_nn in _menu){
				if(typeof _menu[_nn] !='object'){continue;}
				console.log(_menu[_nn].getAttribute('id')+" "+_accion);
				 if(_menu[_nn].getAttribute('id')==_accion){
				 	_menu[_nn].style.display="inline-block";
				 }else{
				 	_menu[_nn].style.display="none";
				 }
			}
			
			if(_accion=='fecha'){
				_form.querySelector('#inputfecha').style.display='inline-block';
				_form.querySelector('.muestra').style.display='none';
				_form.querySelector('#op_comunicacionesCambia').style.display='none';
				
				_form.querySelector('#vaciarcomunicacion').style.display='none';
				_form.querySelector('#vaciarfecha').style.display='inline-block';
				
				
			}else{
				_form.querySelector('#inputfecha').style.display='none';
				_form.querySelector('.muestra').style.display='inline-block';
				_form.querySelector('#op_comunicacionesCambia').style.display='inline-block';
				
				_form.querySelector('#vaciarcomunicacion').style.display='inline-block';
				_form.querySelector('#vaciarfecha').style.display='none';
			}
			
			
			if(_accion=='fecha'){_campo='previstoactual';}
			if(_accion=='pre'){_campo='id_p_comunicaciones_id_ident_entrante';}
			if(_accion=='apr'){_campo='id_p_comunicaciones_id_ident_aprobada';}
			if(_accion=='rev'){_campo='id_p_comunicaciones_id_ident_rechazada';}
			if(_accion=='anu'){_campo='id_p_comunicaciones_id_ident_anulada';}		
			_form.querySelector('#Icampo').value=_campo;
			
			_MultiId='';
			
			_Ga={};
			_Gb={};
			for(_idV in _VerSeleccionData){
				_MultiId+=_idV+',';
				_dat=_VerSeleccionData[_idV];
				_iddoc=_dat.id_p_DOCdocumento_id;				
				
				if(DatosDocs.docs[_iddoc] == undefined){alert('se registra la versión id:'+_idV+' asociada al documento id:'+_iddoc+' sin represantación para este panel');}
				_docnom=DatosDocs.docs[_iddoc].numerodeplano;
				
				_Ga[DatosDocs.docs[_iddoc].grupoa]='si';
				_Gb[DatosDocs.docs[_iddoc].grupob]='si';
				
				_docGa=DatosDocs.docs[_iddoc].grupoa;
				_docGb=DatosDocs.docs[_iddoc].grupob;
				
				_vernum=_dat.numversion;
				
				_clon=_form.querySelector('#versionmodelo').cloneNode(true);
				_form.querySelector('#listadeversiones').appendChild(_clon);
				
				_clon.removeAttribute('id');
				_clon.querySelector('#documento').innerHTML=_docnom;
				_clon.querySelector('#numero').innerHTML=_vernum;
				
				
				if(_dat.previstoactual==''||_dat.previstoactual=='0000-00-00'){
					_fecha='sin prev';	
				}else{
					_fecha=_dat.previstoactual;
				}
				_clon.querySelector('#fecha').innerHTML=_fecha;
				
				if(_dat.idpresenta>0){
					_pre="<span class='enevaluacion'>X</span>";
				}else{
					_pre="-";
				}
				_clon.querySelector('#pre').innerHTML=_pre;
				
				if(_dat.idaprueba>0){
					_apr="<span class='aprobada'>X</span>";
				}else{
					_apr="-";
				}
				_clon.querySelector('#apr').innerHTML=_apr;
				
				if(_dat.idrechaza>0){
					_rev="<span class='rechazada'>X</span>";
				}else{
					_rev="-";
				}
				_clon.querySelector('#rev').innerHTML=_rev;
				
				if(_dat.idanula>0){
					_anu="<span class='anulada'>X</span>";
				}else{
					_anu="-";
				}
				_clon.querySelector('#anu').innerHTML=_anu;
				
				
			}
			_form.querySelector('#Mid').value=_MultiId;
			
			_form.setAttribute('ga',JSON.stringify(_Ga));
			_form.setAttribute('gb',JSON.stringify(_Gb));
				
			if(_accion!='fecha'){
				_dummy=_form.querySelector('#dummy');
				if(_accion=='pre'){_tipo='presenta';}
				if(_accion=='apr'){_tipo='aprueba';}
				if(_accion=='rev'){_tipo='rechaza';}
				if(_accion=='anu'){_tipo='anula';}
				elegirCom(_dummy,_tipo);
			}
		
	});
	
}

//carga formulario vacio de documentos
function formularDocumento(_this,_accion){

	//elegirCom('','actualiza');//recarga datos de comunicacioes disponibles
	_viejo=document.getElementById('formcent');
	if(_viejo!=null){
		_viejo.parentNode.removeChild(_viejo);
	}		
	_form=document.createElement('form');
	_form.setAttribute('id','formcent');
	_form.setAttribute('class','formCent');
	//_form.setAttribute('ga',JSON.stringify(_I1));	
	//_form.setAttribute('gb',JSON.stringify(_I2));
	
	document.body.appendChild(_form);
	var _this = _this;
	var _accion = _accion;
	//var self = this;
	
	$.ajax({
		url: './DOC/DOC_form_doc.php',
		dataType: 'html',
		contentType:"application/x-javascript; charset=CP1252",
		type: 'GET',
		async: false
	}).done(function(html) {
		_form.innerHTML=html;
		_form.style.display='block';
			
		if(_accion=='crear'){
			if(_HabilitadoEdicion!='si'){
				alert('su usuario no tiene permisos de edicion');
				return;
			}
			if(_this.previousSibling==null){
			_NnVer=1;	
			}else{
			_NnVer=parseInt(_this.previousSibling.getAttribute('nnver'))+1;
			}
			_docid=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
			_form.querySelector('#Inumero').value=_NnVer;
			_form.querySelector('#bcambia').style.display='none';
			_form.querySelector('#bborra').style.display='none';
			_form.querySelector('#iaccion').style.display='agrega';
			_form.querySelector('#Iid_p_DOCdocumento_id').value=_docid;
			
			_form.querySelector('#avform').setAttribute('href','./agrega_f.php?accion=agrega&tabla=DOCversion&campofijo=id_p_DOCdocumento_id&campofijo_c='+_docid+'&C-version='+_NnVer);
		}else if(_accion=='cargar'){
			
			_docid=_this.parentNode.getAttribute('idreg');
			_doC=DatosDocs.docs[_docid];
			
			_form.querySelector('#cnid').innerHTML=_docid;
			_form.querySelector('#cid').value=_docid;
			
			_form.querySelector('#bagrega').style.display='none';
			_form.querySelector('#Iaccion').value='cambia';
			
			_form.querySelector('#Inumero').value=_doC.numerodeplano;
			_form.querySelector('#Inombre').value=_doC.nombre;
			
			_camposdef=[
			'rubro',
			'escala',
			'planta',
			'sector',
			'tipologia'
			];
			
			for(_nr in _camposdef){
                _catid=_doC['id_'+_camposdef[_nr]];
                _catref='id_'+_camposdef[_nr];
                _catcampo='id_p_DOCdef_id_nombre_tipo_'+_camposdef[_nr];
                
                if(_catid!=''){                    
                    _form.querySelector('#I'+_catcampo).value=_catid;
                    _form.querySelector('#I'+_catcampo+'-n').value=DatosDocs.categorias[_catref][_catid].nombre;
                }else{
                    _form.querySelector('#I'+_catcampo).value='';
                    _form.querySelector('#I'+_catcampo+'-n').value='-';
                }
			}
			
			if(_doC.id_p_grupos_id_nombre_tipoa==''){_doC.id_p_grupos_id_nombre_tipoa=0;}
                _form.querySelector('#Iid_p_grupos_id_nombre_tipoa').value=_doC.id_p_grupos_id_nombre_tipoa;
                _form.querySelector('#Iid_p_grupos_id_nombre_tipoa-n').value=_Grupos.grupos[_doC.id_p_grupos_id_nombre_tipoa].nombre;
			
			if(_doC.id_p_grupos_id_nombre_tipob==''){_doC.id_p_grupos_id_nombre_tipob=0;}
                _form.querySelector('#Iid_p_grupos_id_nombre_tipob').value=_doC.id_p_grupos_id_nombre_tipob;
                _form.querySelector('#Iid_p_grupos_id_nombre_tipob-n').value=_Grupos.grupos[_doC.id_p_grupos_id_nombre_tipob].nombre;
            
        }
		
	});
	
};
</script>
	
<script type="text/javascript">	
	
var _seleccionfiltros = new Array();

_selecciontxfiltros='';

for (i in _seleccionfiltros){
    _selecciontxfiltros=_selecciontxfiltros+"&filtro["+i+"]="+i;
	document.getElementById(i).removeAttribute('disabled');	    
}
//document.getElementById('filtro').value=_selecciontxfiltros;


function multifiltro(_this,_event){ 

	if (_event.ctrlKey==1){ // con ctrl apretado incrementará la seleccion
		
		_estadoseleccion = _this.className;
		_valor = _this.value;
					
		if(_estadoseleccion == 'seleccionado'){

			_this.className='';	
			//alert(_valor);				
			document.getElementById(_valor).setAttribute('disabled','disabled');				
			delete _seleccionfiltros[_valor];
						

		}else if(_estadoseleccion == ''){
			_seleccionfiltros[_valor]=_valor;
			document.getElementById(_valor).removeAttribute('disabled');				
			//_this.className='seleccionado';
		}
		
		_selecciontxfiltros='';
		
		for (i in _seleccionfiltros){
			document.getElementById
		    _selecciontxfiltros=_selecciontxfiltros+"&filtro["+i+"]="+i;
		}
		
		document.getElementById('filtro').value=_selecciontxfiltros;
		
	}else{
		window.location='./documentos.php?filtro[]=' + _this.value;
	}
}	

</script>

	

<script type="text/javascript">	
var _seleccionversionesid = new Array();

//carga las ventanas de edición y muestra información de la versión elegida (en los div recuadros)	

var _VerSeleccion={};
var _UltSelect='';

function multieditVER(_this,_event,_id,_docid,_status){

	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
	if(_status=='apresentar'){
		_grupo='apresentar';
	}else{
		_grupo='presentados';
	}
	
	if (_event.ctrlKey!=1){
		_VerSeleccion={};
	}
				
	_sS=_this.getAttribute('selecto');
	_VerSeleccion[_this.getAttribute('idreg')]='si';
	
	
	if(_sS!='si'){
		
		//_this.setAttribute('selecto','si');
		
		if (_event.altKey==1){ // con ctrl apretado incrementará la seleccion
			
			if(_UltSelect!=''){
				
				_Ndoc=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
				
				_Docs=document.querySelectorAll('#contenidoextensoPost > .fila');
				
				_marcando='no';
				_ultmarcado='no';
				_nuemarcado='no';
				for(_nD in _Docs){
					
					if(typeof _Docs[_nD] != 'object'){continue;}
					
					//console.log(_Docs[_nD].getAttribute('idreg')+" "+_Docs[_nD].getAttribute('idreg')+" "+_Ndoc);
					
					if(
						_Docs[_nD].getAttribute('idreg')==_UltSelect
						||_Docs[_nD].getAttribute('idreg')==_Ndoc
					){
						_marcando='si';
					}
					
					
					if(_Docs[_nD].getAttribute('idreg')==_UltSelect){
						_ultmarcado='si';
					}
					
					if(_Docs[_nD].getAttribute('idreg')==_Ndoc){
						_nuemarcado='si';
					}
					
					//console.log(typeof _Docs[_nD]+" _> "+_marcando);
					
					if(_marcando=='si'){
						
						_ver=_Docs[_nD].querySelectorAll('.version');
						_add='no';																		
						for(_nverd in _ver){
							if(typeof _ver[_nverd] != 'object'){continue;}
							_add=_ver[_nverd].getAttribute('idreg');
						}
						if(_add!='no'){_VerSeleccion[_add]='si';}
					}
					
					if(_ultmarcado=='si'&&_nuemarcado=='si'){
						_marcando='no';
					}
							
				}
				
				
			}
			
			
		}else{
			
            _this.className += " seleccionado";	
			_this.setAttribute('selecto','si');			

		}
		

	}else{
		delete _VerSeleccion[_this.getAttribute('idreg')];
	}
	
	_UltSelect=_this.parentNode.parentNode.parentNode.getAttribute('idreg');
	
	console.log(_VerSeleccion);
	
	_versiones=document.querySelectorAll('.version');		
	for(_nv in _versiones){
		if(typeof _versiones[_nv]=='object'){
			if(_VerSeleccion[_versiones[_nv].getAttribute('idreg')]=='si'){
				_versiones[_nv].setAttribute('selecto','si');
			}else{
				_versiones[_nv].setAttribute('selecto','no');
			}
		}
	}		
	
	actulazarVerSel();	
}

var _VerSeleccionData= Array();

var _DatosVer={};

function actulazarVerSel(){
	
	document.querySelector('#ayudaVerData #seleccionados').innerHTML='versiones seleccionadas: '+Object.keys(_VerSeleccion).length;
	
	if(Object.keys(_VerSeleccion).length==0){
		document.getElementById('ayudaVerResumen').style.display='none';
		document.getElementById('ayudaVerData').style.display='none';
		document.getElementById('ayudaVerCompleta').style.display='block';
		return;
	}else{
		//console.log(Object.keys(_VerSeleccion).length);
		//console.log(_VerSeleccion);
		document.getElementById('ayudaVerResumen').style.display='block';
		document.getElementById('ayudaVerData').style.display='block';
		document.getElementById('ayudaVerCompleta').style.display='none';
	}
	
	//console.log();
	_tx=JSON.stringify(_VerSeleccion);

	_sel='';
	for(_ns in _VerSeleccion){
		_sel+=_ns+",";		 
	}
	//alert(_sel);
	_paramm={
		"seleccion":_sel
	}	
	
	$.ajax({
			data:  _paramm,
			url:   './DOC/DOC_consulta_versiones.php',
			type:  'post',
			success:  function (response) {
				var _res = $.parseJSON(response);
				//console.log(_res);
				//Actualizar(_res);
				if(_res.res=='exito'){
			                
                for(_nm in _res.mg){
                    alert(_res.mg[_nm]);
                }
			
						_SiPla=0;
						_NoPla=0;
						
						_SiPre=0;
						_NoPre=0;
						
						_SiApr=0;
						_NoApr=0;
						
						_SiRev=0;
						_NoRev=0;
						
						_SiAnu=0;
						_NoAnu=0;
					
					_VerSeleccionData=_res.data;
					for(_idV in _res.data){			
                        _DatosVer[_idV]=_res.data[_idV];
					
						if(_res.data[_idV].previstoactual!=''&&_res.data[_idV].previstoactual!='0000-00-00'){
							_SiPla++;
						}else{
							_NoPla++;
						}
						document.querySelector('#acciones #sifech').innerHTML=_SiPla;
						document.querySelector('#acciones #nofech').innerHTML=_NoPla;
					
						if(_res.data[_idV].idpresenta==''){_res.data[_idV].idpresenta=0;}
						if(_res.data[_idV].idpresenta>0){
							_SiPre++;
						}else{
							_NoPre++;
						}
						document.querySelector('#acciones #sipre').innerHTML=_SiPre;
						document.querySelector('#acciones #nopre').innerHTML=_NoPre;
						
						if(_res.data[_idV].idaprueba==''){_res.data[_idV].idaprueba=0;}
						if(_res.data[_idV].idaprueba>0){
							_SiApr++;
						}else{
							_NoApr++;
						}
						document.querySelector('#acciones #siapr').innerHTML=_SiApr;
						document.querySelector('#acciones #noapr').innerHTML=_NoApr;
						
						if(_res.data[_idV].idrechaza==''){_res.data[_idV].idaprueba=0;}
						if(_res.data[_idV].idrechaza>0){
							_SiRev++;
						}else{
							_NoRev++;
						}
						document.querySelector('#acciones #sirev').innerHTML=_SiRev;
						document.querySelector('#acciones #norev').innerHTML=_NoRev;
						
						if(_res.data[_idV].idanula==''){_res.data[_idV].idanula=0;}
						if(_res.data[_idV].idanula>0){
							_SiAnu++;
						}else{
							_NoAnu++;
						}
						document.querySelector('#acciones #sianu').innerHTML=_SiAnu;
						document.querySelector('#acciones #noanu').innerHTML=_NoAnu;
					}
				}
			}
	});	
	
}
	

var _seleccionDOCSid = new Array();

function multieditDOC(_this,_event,_id,_docid,_status){

	if(_HabilitadoEdicion!='si'){
		alert('su usuario no tiene permisos de edicion');
		return;
	}
	if(_status=='apresentar'){
		_grupo='apresentar';
	}else{
		_grupo='presentados';
	}
	
	_s=_this.getAttribute('selecto');
			
	if(_s!='si'){

		if (_event.ctrlKey==1){ // con ctrl apretado incrementará la seleccion
		alert('o');
			if(typeof _seleccionDOCSid[_grupo]=== 'undefined'){
				_seleccionDOCSid[_grupo]=_id;
			}else{
				_seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_id;
			}
			
			_this.setAttribute('selecto','si');	
			//_this.className += " seleccionado";	
			
		}else if(_event.shiftKey==1){ // con shift apretado incorporará a la selección todos los documentos intermedios entre el último seleccionado y el actual
			_nuevamarca=_this.getAttribute('docorden');
			_desde=Math.min(_nuevamarca,_ultimamarca); 
			_hasta=Math.max(_nuevamarca,_ultimamarca); 	
			_elem = document.getElementsByName('selector');
			
			for (var i = 0; i < _elem.length; ++i){

				_pos=_elem[i].getAttribute('docorden');
				
				if(_pos>=_desde&&_pos<=_hasta){
					 _elem[i].setAttribute('selecto','si');	
					// _elem[i].className += " seleccionado";	
					// _elem[i].className = _elem[i].className.replace(/(?:^|\s)seleccionado(?!\S)/g , '');
				}
			}
			
		}else{
			_seleccionDOCSid[_grupo]=_id; // sin ctrl apretado definirá una nueva seleccion
			
			_elem = document.getElementsByName('selector');
			
			
			document.getElementById('recuadro4').innerHTML=_this.innerHTML;
			
			for (var i = 0; i < _elem.length; ++i){
				 _elem[i].setAttribute('selecto','no');	
				 _elem[i].className = _elem[i].className.replace(/(?:^|\s)seleccionado(?!\S)/g , '');	 
			}
			
			_this.setAttribute('selecto','si');	
			//_this.className += " seleccionado";	
		}
		
		
		_idstring="";
		_cont=0;
		_elem = document.getElementsByName('selector');
		_seleccionDOCSid[_grupo]='';
		
		for (var i = 0; i < _elem.length; ++i){
			_stat=_elem[i].getAttribute('selecto');
			if(_stat=='si'){
				_cont=_cont+1;
				_idstring=_idstring+"_"+_elem[i].getAttribute('iddoc');
				_seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_elem[i].getAttribute('iddoc');
				
			}else{
				
			}
		}
		
		if(_cont>1){
			document.getElementById('recuadro4').innerHTML='Selección múltiple de ('+_cont+') documentos:<br>'+_seleccionDOCSid[_grupo];
		}else{
			
		}
		
		document.getElementById('recuadro5').src='./agrega_fdocs.php?id='+_seleccionDOCSid[_grupo];
		
	}
}	
</script>

<script type="text/javascript">	
	_elem = document.getElementsByName('cuadrodeversiones');
	for (var i = 0; i < _elem.length; ++i) {		
		_elem[i].scrollLeft = 100;
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

function oculta(name){
		var elementos = document.getElementsByName(name);
		for (x=0;x<elementos.length;x++){
				elementos[x].style.display = 'none';
		}
}
function muestra(name){
		var elementos = document.getElementsByName(name);
		for (x=0;x<elementos.length;x++){
				elementos[x].style.display = 'block';
		}
}


</script>
<script type='text/javascript'>
function cargarDocs(){
	if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}
	_form=document.getElementById("editorArchivos");
	_form.querySelector('input[name="tipo"]').value='origen';
	_form.querySelector('input[name="zz_AUTOPANEL"]').value='<?php echo $PanelI;?>';			
	_form.style.display = 'block';			
	_form.querySelector('h1#tituloformulario').innerHTML='Generar Documentos y versiones a partir de archivos';
	_form.querySelector('p#desarrollo').innerHTML='Generar Documentos y versiones a partir de archivos. Cada archivo genera una nueva documentación en función del nombre de archivo';
	
	
	for(_ng in _Grupos){
		if(_Grupos[_ng].tipo=='a'){
			_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipoa"]');
			
		}else if(_Grupos[_ng].tipo=='b'){
			_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipob"]');
		}
		_anc=document.createElement('a');
		_anc.setAttribute('onclick','opcionar(this)');
		_anc.setAttribute('idgrupo',_Grupos[_ng].id);
		_anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
		_anc.innerHTML= _Grupos[_ng].nombre;
		_cont.appendChild(_anc);
	}
}

function cargarDoc(_this){
	if(_HabilitadoEdicion!='si'){
			alert('su usuario no tiene permisos de edicion');
			return;
		}		
	_form=_this.parentNode.parentNode.parentNode;
	
	//console.log(_this.files);
	var _this=_this;
	var files = _this.files;
			
	for (i = 0; i < files.length; i++){
	
		
		var parametros = new FormData();
		parametros.append("upload",files[i]);
		
		_inns=_form.querySelectorAll('input, textarea');	
		
		for(_nn in _inns){
			if(typeof _inns[_nn] =='object'){
				if(_inns[_nn].getAttribute('type')=='file'){continue;}
				_nom=_inns[_nn].getAttribute('name');
				_val=_inns[_nn].value;
				parametros.append(_nom,_val);
			}
		}
	
		$.ajax({
			data:  parametros,
			url:   './DOC/DOC_ed_guarda_doc.php',
			type:  'post',
			processData: false, 
			contentType: false,
			error:  function (response) {alert('error al consultar el servidor');},
			success:  function (response) {
				var _res = $.parseJSON(response);
				if(_res.res!='exito'){alert('error al consultar la base de datos');}
				Actualizar(_res);
									
			}
		});
	}			
	
	_form.style.display='none';
		
}
	

function cerrar(_this){
	_this.parentNode.style.display='none';
}
</script>		
<script type='text/javascript'>
//funciones para carga masiva de documentos.


	function cargarOrigen(){
		_form=document.getElementById("editorArchivos");
		_form.querySelector('input[name="tipo"]').value='origen';
		_form.querySelector('input[name="zz_AUTOPANEL"]').value='<?php echo $PanelI;?>';			
		_form.style.display = 'block';			
		_form.querySelector('h1#tituloformulario').innerHTML='Generar Comunicaciones a partir de archivos';
		_form.querySelector('p#desarrollo').innerHTML='Generar Documentaciones a partir de archivos. Cada archivo genera una nueva documentación en función del nombre de archivo o una nueva versión';
		
		_form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipoa"]').innerHTML='';
		_form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipob"]').innerHTML='';
		
		for(_ng in _Grupos){
			if(_Grupos[_ng].tipo=='a'){
				_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipoa"]');
				
			}else if(_Grupos[_ng].tipo=='b'){
				_cont= _form.querySelector('div.opciones[for="id_p_grupos_id_nombre_tipob"]');
			}
			_anc=document.createElement('a');
			_anc.setAttribute('onclick','opcionar(this)');
			_anc.setAttribute('idgrupo',_Grupos[_ng].id);
			_anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
			_anc.innerHTML= _Grupos[_ng].nombre;
			_cont.appendChild(_anc);
		}
	}
	
	_nf=0;
	function cargarDoc(_this){
		
		_form=_this.parentNode.parentNode.parentNode;
		
		//console.log(_this.files);
		var _this=_this;
		var files = _this.files;
				
		for (i = 0; i < files.length; i++){
	    	_nf++;
	    	_pp=document.createElement('p');
	    	_pp.setAttribute('nf',_nf);
	    	_pp.setAttribute('class','subiendo');
	    	//console.log(files[i].name);
	    	_pp.innerHTML='<img src="./img/cargando.gif"> cargando '+files[i].name;
	    	_form.querySelector('#listacargando').appendChild(_pp);
			var parametros = new FormData();
			parametros.append("upload",files[i]);
			parametros.append("nf",_nf);
			
			_inns=_form.querySelectorAll('input, textarea');
			for(_nn in _inns){
				if(typeof _inns[_nn] =='object'){
					if(_inns[_nn].getAttribute('type')=='file'){continue;}
					_nom=_inns[_nn].getAttribute('name');
					_val=_inns[_nn].value;
					parametros.append(_nom,_val);
				}
			}
			
			//console.log(parametros);
			
			var _xrr=$.ajax({
					data:  parametros,
					url:   './DOC/DOC_ed_guarda_doc.php',
					type:  'post',
					processData: false, 
					contentType: false,
					success:  function (response) {
						var _res = $.parseJSON(response);
						
						//console.log(_res);
						if(_res.data.nf!=0){
							_ps=document.querySelector('p.subiendo[nf="'+_res.data.nf+'"]');
							_ps.parentNode.removeChild(_ps);
						}
						actualizarMuestra(_res,_res.data.nid);
						
					}
			});
			//setInterval(function(){console.log(_xrr)}, 6000);
		}		
		//_form.style.display='none';
	}
	
	
	
	
	function crearDoc(){
		
		_paramm={
			"zz_AUTOPANEL":_PanelI
		}	
		
		$.ajax({
			data:  _paramm,
			url:   './DOC/DOC_ed_crea_doc.php',
			type:  'post',
			error:   function (response) {alert('error al consultar el sevidor');console.log(response);},
			success:  function (response) {
				
				try {_res = $.parseJSON(response);}catch(err){alert('error al procesar la respuesta del servidor');console.log(err);}
				for(_nm in _res.mg){alert(_res.mg[_nm]);}
				if(_res.res!='exito'){alert('error al consultar la base de datos');}
					
				if(_res.res=='exito'){
					_idDoc=_res.data.NidDoc;
					consultarDocs('');
				}
			}
		});			                
	}
</script>		

<script type='text/javascript'>
	function toogle(_elem){//utiliado por la barra de filtros para activar y desactivar botones imitando el radio button
	    _nombre=_elem.parentNode.parentNode.getAttribute('campo');
	    
	    elementos = document.getElementsByName(_nombre);
	    
	    for (x=0;x<elementos.length;x++){			
			elementos[x].removeAttribute('checked');
		}
	    _elem.previousSibling.setAttribute('checked','checked');		
	}
</script>

	

</body>
