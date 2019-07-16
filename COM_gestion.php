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
'visitante'=>'no'
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


	$Hoy_a = date("Y");
	$Hoy_m = date("m");	
	$Hoy_d = date("d");	
	$Hoy = $Hoy_a."-".$Hoy_m."-".$Hoy_d;
	

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
	
	
	.fila[filtrob='nover']{
		display:none;		
	}
	.fila[filtros='nover']{
		display:none;		
	}
	.fila[filtroa='nover']{
		display:none;		
	}
	.fila[filtroga='nover']{
		display:none;		
	}
	.fila[filtrogb='nover']{
		display:none;		
	}
	#formfiltro #conteo > div{
    	display:inline-block;
    	border:1px solid #444;
    	width:22px;
    	text-align:center;
    }
    #formfiltro #conteo > div{
    	vertical-align:top;
    	line-height: 8px;
    	font-size: 9px;
    }
    
    
    </style>
</head>

<body>

<script type="text/javascript" src="./js/jquery/jquery-1.8.2.js"></script>

<?php

insertarmenu();// en ./PAN/PAN_comunes.php

//consulta filtro abiertas
$abiertas=$_SESSION['preferencias'][0]['COMfabiertas'];	
if($abiertas=='todas'){$ceck['abtodas']="checked='checked'";}else{$ceck['abtodas']="";}
if($abiertas=='no'){$ceck['abab']="checked='checked'";}else{$ceck['abab']="";}

//consulta filtro sentido
$sentido=$_SESSION['preferencias'][0]['COMfsentido'];	
if($sentido=='entrante'){$ceck['seent']="checked='checked'";}else{$ceck['seent']="";}
if($sentido=='saliente'){$ceck['sesal']="checked='checked'";}else{$ceck['sesal']="";}				
if($sentido=='todas'){$ceck['setodas']="checked='checked'";}else{$ceck['setodas']="";}

//consulta filtro grupoa
$grupoa=$_SESSION['preferencias'][0]['COMfgrupoa'];	
$ceck['grupoa'][$grupoa]="checked='checked'";

//consulta filtro grupob
$grupob=$_SESSION['preferencias'][0]['COMfgrupob'];	
$ceck['grupob'][$grupob]="checked='checked'";	

//consulta filtro orden
$orden=$_SESSION['preferencias'][0]['COMforden'];	
$ceck['orden'][$orden]="selected='selected'";			

?>

<script type='text/javascript'>

    var _filtro={
        'busqueda' : '',
        'abiertas' : '<?php echo $abiertas;?>',
        'sentido' : '<?php echo $sentido;?>',
        'grupoa' : '<?php echo $grupoa;?>',
        'grupob' : '<?php echo $grupob;?>',
        'orden' : '<?php echo $orden;?>'
        
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
</script>


<div class='recuadros' id='recuadro4'>Seleccione una comunicación <div class='activo selector'></div> para visualizar su información asociada. <br>Ctrl+<div class='activo selector'></div> para una selección múltiple. <br>O shift+<div class='activo selector'></div> para una selección continua.</div>		

<div class='recuadros' id='comandoAborde' style='height:0px;display:none;' saliente='si' entrante='si'>
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
<script type='text/javascript'>
    
    function togleInt(_this){
        _id=_this.getAttribute('id');
        _stat=_this.parentNode.parentNode.getAttribute(_id);
        if(_stat=='si'){
            _this.parentNode.parentNode.setAttribute(_id,'no');
        }else{
            _this.parentNode.parentNode.setAttribute(_id,'si');
        }
    }
</script>	


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
    <label>Grupo Primario</label>
    <input type='hidden' name='idga' value=''>
    <input type='text' name='idga-n' onkeyup='opcionNo(this);' value=''>
    <div class='opciones' for='idga'></div>
    <label>Grupo Secundario</label>
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
    
    <label title="Esta secuencia es buscada dentro de los contenidos 'comenta' y se espera que a continuación se identifique tipo y numero de comunicaciones, ej: 'NP 34'">Identificador de vinculaciones</label>
    <input name='com-nomenclaturaarchivosRta' value='<?php echo $Config['com-nomenclaturaarchivosRta'];?>'>
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

<script type="text/javascript">
    _HabilitadoEdicion='si';
    var _Grupos={}; 
    var _PanId="<?php echo $PanelI;?>";

    function filtrarLinks(_event,_this){
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
        
        if(_this.value=='0'){return;}
        //_valor = _this.value;
        
        _divsrta=document.querySelectorAll('#comandoAborde #formLink input.COMcomunicacion');
        for(_dn in _divsrta){	
            if(typeof _divsrta[_dn] != 'object'){return;}
            if(!_divsrta[_dn].value.toUpperCase().includes(_this.value.toUpperCase())){
                _divsrta[_dn].setAttribute('filtrado','si');
            }else{
                _divsrta[_dn].setAttribute('filtrado','no');
            }
        }

    }
    
    
    function cargarOrigen(){
        _form=document.getElementById("editorArchivos");
        _form.querySelector('select[name="tipo"]').value='original';
        _form.querySelector('input[name="zz_AUTOPANEL"]').value='<?php echo $PanelI;?>';			
        _form.style.display = 'block';			
        _form.querySelector('h1#tituloformulario').innerHTML='Generar Comunicaciones a partir de archivos';
        _form.querySelector('p#desarrollo').innerHTML='Generar comunicaciones a partir de archivos. Cada archivo genera una nueva comunicación en función del nombre de archivo';
        
        _form.querySelector('div.opciones[for="idga"]').innerHTML='';
        _form.querySelector('div.opciones[for="idgb"]').innerHTML='';
        
        for(_ng in _Grupos){
            if(_Grupos[_ng].tipo=='a'){
                _cont= _form.querySelector('div.opciones[for="idga"]');
                
            }else if(_Grupos[_ng].tipo=='b'){
                _cont= _form.querySelector('div.opciones[for="idgb"]');
            }else{
            	continue;
            }
            _anc=document.createElement('a');
            _anc.setAttribute('onclick','opcionar(this)');
            _anc.setAttribute('idgrupo',_Grupos[_ng].id);
            _anc.title=_Grupos[_ng].codigo+" _ "+_Grupos[_ng].descripcion;
            _anc.innerHTML= _Grupos[_ng].nombre;
            _cont.appendChild(_anc);
        }
    }
    
    function opcionar(_this){
        _gid=_this.getAttribute('idgrupo');
        _ifor=_this.parentNode.getAttribute('for');
        _gnom=_this.innerHTML;
        _this.parentNode.parentNode.querySelector('input[name="'+_ifor+'-n"]').value=_gnom;
        _this.parentNode.parentNode.querySelector('input[name="'+_ifor+'"]').value=_gid;
    }
    
    function opcionNo(_this){
        _name=_this.getAttribute('name');
        _oname=_name.substr(0,(_name.length - 2));
        _this.parentNode.querySelector('input[name="'+_oname+'"]').value='n';
    }
            
    _nf=0;
    function cargarDoc(_this){
        
        _form=_this.parentNode.parentNode.parentNode;
        
        console.log(_this.files);
        var _this=_this;
        var files = _this.files;

        for (i = 0; i < files.length; i++){
            _nf++;
            _pp=document.createElement('p');
            _pp.setAttribute('nf',_nf);
            _pp.setAttribute('class','subiendo');
            console.log(files[i].name);
            _pp.innerHTML='<img src="./img/cargando.gif"> cargando '+files[i].name;
            _form.querySelector('#listacargando').appendChild(_pp);
            var parametros = new FormData();
            parametros.append("upload",files[i]);
            parametros.append("nf",_nf);
            parametros.append("tipo",_form.querySelector('select[name="tipo"').value);
            parametros.append("id_p_grupos_id_nombre_tipoa",_form.querySelector('input[name="idga"').value);
            parametros.append("id_p_grupos_id_nombre_tipoa-n",_form.querySelector('input[name="idga-n"').value);
            parametros.append("id_p_grupos_id_nombre_tipob",_form.querySelector('input[name="idgb"').value);
            parametros.append("id_p_grupos_id_nombre_tipob-n",_form.querySelector('input[name="idgb-n"').value);
            parametros.append("sentido",_form.querySelector('select[name="sentido"').value);
            
            
            _inns=_form.querySelectorAll('input, textarea');	
            
            for(_nn in _inns){
                if(typeof _inns[_nn] =='object'){
                    if(_inns[_nn].getAttribute('type')=='file'){continue;}
                    _nom=_inns[_nn].getAttribute('name');
                    _val=_inns[_nn].value;
                    parametros.append(_nom,_val);
                }
            }

            _xrr=$.ajax({
                    data:  parametros,
                    url:   './COM/COM_ed_guarda_doc.php',
                    type:  'post',
                    processData: false, 
                    contentType: false,
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
						
						for(_nm in _res.mg){alert(_res.mg[_nm]);}
						
                        if(_res.res!='exito'){alert('error durante la consulta a la base de datos');}
                        
                        if(_res.data.nf!=0){
	                        console.log(_res);
	                        if(_res.data.nf!=0){
	                            _ps=document.querySelector('p.subiendo[nf="'+_res.data.nf+'"]');
	                            _ps.parentNode.removeChild(_ps);
	                        }
	                        cargarUnaFila(_res.data.nid);
                       	}
                    }
            });
            //console.log(_xrr);
        }		
        //_form.style.display='none';
    }
    

    function cerrar(_this){
        _this.parentNode.style.display='none';
    }
</script>

<div id="pageborde">
    <div id="page">
        
        <h1>Comunicaciones</h1>		
        
        
        <div class='botonerainicial' tipo='modos'>
            <a class='botonmenu' href='./comunicacionesreporte.php?tabla=comunicaciones'>ver modo reporte</a>
            -
            <form id='form_sel' action='./COMresumenSel.php' method='post'>
                <label>ver resumen de selección:</label>
                <select name='id' onchange='this.parentNode.submit();'><option>-elegir-</option></select>
            </form>
        </div>
        
        <div class='botonerainicial' tipo='acciones'>
            <a class='botonmenu' onclick='iraCom(event,"","");' title='agregar comunicacion'><img src='./img/agregar.png' alt='agregar'> comunicación</a>
            -
            <a class='botonmenu' onclick='cargarOrigen();'><img src='./img/agregar_desdedocs.png' alt='subir'>cargar comunicaciones desde archivos</a>
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
                --><a id='nom' target='_top' title=''  onclick='iraCom(event,this.parentNode.getAttribute("regId"),"");' class='contenido nombre '></a><!--
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
           
            <a id='modcargarrespuesta' title='cargar respuesta' onclick='iraCom(event,"",this.parentNode.parentNode.getAttribute("regId"));' acc='Ed'><img src='./img/responder.png'></a>		
            <div id='modextra' class='extraoficialmarco' title='esta comunicaciones es extraoficial'>¡*!</div>	
            <img id='modhayadjuntos' alt='documentos adjuntos disponibles' src='./img/hayarchivo.png'>			
            <a id='modDocs'></a>
            <div id='modLink' regId='' pnom='' ><a onmouseover='resaltar(this);' onmouseout='deresaltar(this);' onclick="iraCom(event,this.parentNode.getAttribute('regId'),'');" sentido='' estado='' class='COMcomunicacion secundaria'></a><a onclick='elimRta(this);' class='eliminar respuesta' title='quitar como origen' target='_top'><-</a></div>
            <div id='modDesc' class='flotaDescripcion'><a onclick='toggleDesc(this)' estado='visible'>-</a><div class='descripcion'></div></div>
            <input id='modItem' class='COMcomunicacion' name='Crelac' title='' type='button' emision='' pnom='' regId='' sentido='' estado='' value='' onclick='crearLink(this);'>
        </div>
        
        
        <div id="contenidoextenso">				
            
            <div class="fila filtro">
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
                        <label class="corto"><input type="radio" name="sentido" value='todas' <?php echo $ceck['setodas'];?>><span onclick='toogle(this);filtrarFilas();'>todo</span></label>
                        <label class="largo"><input type="radio" name="sentido" value='saliente' <?php echo $ceck['sesal'];?>><span  class="saliente" onclick='toogle(this);filtrarFilas();'>salientes</span></label>    
                        <br>
                        <label class="largo"><input type="radio" name="sentido" value='entrante' <?php echo $ceck['seent'];?>><span  class="entrante" onclick='toogle(this);filtrarFilas();'>entrantes</span></label>
                    </div>	
                    <div class="abiertas">
                        <label><input type="radio" name="abiertas" value="todas" <?php echo $ceck['abtodas'];?>><span onclick='toogle(this);filtrarFilas();'>todo</span></label>
                        <label class="largo"><input type="radio" name="abiertas" value='no' <?php echo $ceck['abab'];?>><span onclick='toogle(this);filtrarFilas();'>abiertas</span></label>
                        <br>
                        <label class="largo"><input type="radio" readonly name="abiertas" value=''><span></span></label>
                    </div>											
                    <div class="busqueda">
                        <span>buscar:</span><input type='text' name='busqueda' onkeyup="tecleaBusqueda(this,event)">		
                    </div>	
                    
                    <div id='filtroga' class="grupoa">				
                    </div>	
                    <div id='filtrogb'  class="grupob">
                    </div>	
                    <div>	
                        orden:
                        <select name='orden' onchange="ordenarFilas();">
                            <option value='Id1'><?php echo $Config['com-ident'];?></option>
                            <option value='Id2'><?php echo $Config['com-identdos'];?></option>
                            <option value='Id3'><?php echo $Config['com-identtres'];?></option>								
                            <option value='FeEm'>redacción</option>
                            <option value='FeRe'>emisión</option>
                            <option value='FeCi'>cierre</option>	
                        </select>
                    </div>		
                </form>
            </div>
            
            <div id="comunicaciones">
            </div>

        </div>
    </div>
</div>

<script type='text/javascript'>
    function filtrar(_this,_event){
        _event.preventDefault();
        _form = _this.parentNode.parentNode;
        _filtro.busqueda=_form.querySelector('input[name="busqueda"]').value;
        _filtro.sentido =_form.querySelector('input[name="sentido"]:checked').value;        
        _filtro.abiertas=_form.querySelector('input[name="abiertas"]:checked').value;
        _filtro.grupoa  =_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked').value;
        _filtro.grupob  =_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked').value;
        _filtro.orden   =_form.querySelector('select[name="orden"] option:checked').value;    
 
        cargarFilas();
    }


    function cargarFiltro(){
        var parametros = {
        	'comunicaciones':''
        };			
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_grupos_consulta.php',
            type:  'post',
            error:   function (response) {alert('error al contactar el servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                
                
                var _res = $.parseJSON(response);
                //console.log(_res);
                
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }                
                
                if(_res.res=='exito'){		
                    _Grupos=_res.data.grupos;
                                    
                    if(Object.keys(_res.data.gruposUsadosA).length<5){                                             
                        
                        _ll=document.createElement('label');
                        _ll.setAttribute('class','corto');
                        document.getElementById('filtroga').appendChild(_ll);
                        
                        _inT=document.createElement('input');
                        _inT.setAttribute('type','radio');
                        _inT.setAttribute('onclick','filtrarFilas();');
                        _inT.setAttribute('name','grupoa');
                        _inT.setAttribute('value','todas');
                        _inT.setAttribute('checked','checked');
                        _ll.appendChild(_inT);
                        
                        _sp=document.createElement('span');
                        _sp.setAttribute('onclick','toogle(this)');
                        _sp.innerHTML='todo';
                        _ll.appendChild(_sp);  
                            
                        for(_gid in _res.data.gruposUsadosA){
                            //if(typeof _res.data.gruposUsadosA[_no] != 'object'){continue;}
                            _gdat=_res.data.grupos[_gid];
                            console.log(_gid);
                            console.log(_gdat);
                            _ll=document.createElement('label');
                            _ll.setAttribute('class','corto');
                            document.getElementById('filtroga').appendChild(_ll);
                            
                            _in=document.createElement('input');
                            _in.setAttribute('type','radio');
                            _in.value=_gdat.id;
                            _in.setAttribute('name','grupoa');
                            _ll.appendChild(_in);
                            
                            _sp=document.createElement('span');
                            _sp.setAttribute('onclick','toogle(this)');
                            _sp.innerHTML=_gdat.nombre.substring(0, 4)+" "+_gdat.nombre.substring(4,4);
                            
                            _ll.appendChild(_sp);       
                            
                            if(_filtro.grupoa==_gdat.id){
                                _in.setAttribute('checked','checked');
                                _inT.removeAttribute('checked');
                            }
                        }
                        
                    }else{
                    
                        _ss=document.createElement('select');
                        _ss.setAttribute('name','grupoa');
                        _ss.setAttribute('onchange','filtrarFilas();');
                        document.getElementById('filtroga').appendChild(_ss);
                        
                        _opT=document.createElement('option');
                        _opT.value='todas';
                        _opT.setAttribute('checked','checked');
                        _opT.innerHTML='todo';
                        _ss.appendChild(_opT);
                                                                                
                        for(_gid in _res.data.gruposUsadosA){
                            // if(typeof _res.data.gruposUsadosA[_no] != 'object'){continue;}
                            
                            _gdat=_res.data.grupos[_gid];
                            //console.log(_gdat);
                            
                            _op=document.createElement('option');
                            _op.value=_gdat.id;
                            _op.innerHTML=_gdat.nombre;
                            _ss.appendChild(_op);
                            if(_filtro.grupoa==_gdat.id){
                                _op.setAttribute('checked','checked');
                                _opT.removeAttribute('checked');
                            }
                        }                                                    
                    }
                
                
                
                    if(Object.keys(_res.data.gruposUsadosB).length<5){                                             
                        
                        _ll=document.createElement('label');
                        _ll.setAttribute('class','corto');
                        document.getElementById('filtrogb').appendChild(_ll);
                        
                        _inT=document.createElement('input');
                        _inT.setAttribute('type','radio');
                        _inT.setAttribute('onclick','filtrarFilas();');
                        _inT.setAttribute('name','grupob');
                        _inT.setAttribute('value','todas');
                        _inT.setAttribute('checked','checked');
                        _ll.appendChild(_inT);
                        
                        _sp=document.createElement('span');
                        _sp.setAttribute('onclick','toogle(this)');
                        _sp.innerHTML='todo';
                        _ll.appendChild(_sp); 
                            
                        for(_gid in _res.data.gruposUsadosB){
                            //if(typeof _res.data.gruposUsadosB[_no] != 'object'){continue;}
                            
                            _gdat=_res.data.grupos[_gid];
                            //console.log(_gdat);
                            _ll=document.createElement('label');
                            _ll.setAttribute('class','corto');
                            document.getElementById('filtrogb').appendChild(_ll);
                            
                            _in=document.createElement('input');
                            _in.setAttribute('type','radio');
                            _in.value=_gdat.id;
                            _in.setAttribute('name','grupob');
                            _ll.appendChild(_in);
                            
                            _sp=document.createElement('span');
                            _sp.setAttribute('onclick','toogle(this)');
                            _sp.innerHTML=_gdat.nombre.substring(0, 4)+" "+_gdat.nombre.substring(4,4);                                
                            _ll.appendChild(_sp);    
                            
                            if(_filtro.grupob==_gdat.id){
                                _in.setAttribute('checked','checked');
                                _inT.removeAttribute('checked');
                            }
                        }
                        
                    }else{
                    
                        _ss=document.createElement('select');
                        _ss.setAttribute('onchange','filtrarFilas();');
                        _ss.setAttribute('name','grupob');
                        document.getElementById('filtrogb').appendChild(_ss);
                        
                        _opT=document.createElement('option');
                        _opT.value='todas';
                        _opT.setAttribute('checked','checked');
                        _opT.innerHTML='todo';
                        _ss.appendChild(_opT);
                                                                                
                        for(_gid in _res.data.gruposUsadosB){
                            //if(typeof _res.data.gruposUsadosB[_no] != 'object'){continue;}
                            
                            _gdat=_res.data.grupos[_gid];
                            //console.log(_gdat);
                            
                            _op=document.createElement('option');
                            _op.value=_gdat.id;
                            _op.innerHTML=_gdat.nombre;
                            _ss.appendChild(_op);
                            
                            if(_filtro.grupob==_gdat.id){
                                _op.setAttribute('checked','checked');
                                _opT.removeAttribute('checked');
                            }
                        }                                                    
                    }
                    
                }
            }
        });
    }
    cargarFiltro();
    document.querySelector('#formfiltro .busqueda input[name="busqueda"]').focus();
</script>

<script type='text/javascript'>
    
	var _ComunicacionesOrden={};
    var _ComunicacionesCargadas={};
    var _avanceCod;
    
    function cargarFilas(){

        document.querySelector('#contenidoextenso #comunicaciones').innerHTML='';
        _estadodecarga='cargando';			
        var parametros = {
            "avance" : 'inicial',
            "BUSQUEDA" : _filtro.busqueda,				
            "SENTIDO" : _filtro.sentido,
            "CERRADAS" : _filtro.abiertas,
            "GRUPOA" : _filtro.grupoa,
            "GRUPOB" : _filtro.grupob,
            "orden" : _filtro.orden,
            "DESDE" : '',
            "HASTA" : ''
        };
        
        $.ajax({
            data:  parametros,
            url:   './COM/COM_consulta_comunicaciones_listado.php',
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
                console.log(_res);
                _estadodecarga='activo';
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }
                
                if(_res.res=='exito'){
                    console.log(_res.data.regs.length);
                    for(i=0;i<_res.data.regs.length;i++){
                        _ComunicacionesCargadas[_res.data.regs[i].id]=_res.data.regs[i];
                        _ComunicacionesOrden=_res.data.comOrdenes;
                        //console.log(_res.data.regs[i].id);
                        generarFila(_res.data.regs[i],'carga');
                    }
                    if(_res.data.avance!='total'){
                        continuarcarga(_res.data.avanceCod);
                    }
                }
                filtrarFilas();
            }
        });
    }

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
                try{
                    _res = $.parseJSON(response);
                }catch(e){
                    console.log(e);
                    alert(e);
                    return;
                }
                
                var _res = $.parseJSON(response);
                console.log(_res);
                _estadodecarga='activo';
                if(_res.res=='exito'){
                    generarFila(_res.data,'nuevo');
                }
            }
        });
    }
    function actualizarUnaFila(_id){						
        var parametros = {
            "id" : _id
        };			
        _cargandofila=document.createElement('div');
        _cargandofila.setAttribute('class','cargando');
        _fila=document.querySelector('#comunicaciones #fnc'+_id);
        if(_fila!=undefined){
        	_fila.appendChild(_cargandofila);
        }
        _cargandofila.setAttribute('class','cargando');
        
        $.ajax({
            data:  parametros,
            url:   './COM/COM_consulta_fila.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                try{
                    _res = $.parseJSON(response);
                }catch(e){
                    console.log(e);
                    alert(e);
                    return;
                }
                //procesarRespuestaDescripcion(response, _destino);
                var _res = $.parseJSON(response);
                console.log(_res);
                _estadodecarga='activo';
                if(_res.res=='exito'){		
                    generarFila(_res.data,'actualiza');
                }
            }
        });
    }

                
    function continuarcarga(_cod){		
        //var _avance=_cargado.avance;
        //console.log(_estadodecarga);
        _avanceCod=_cod;		
        _parametros = {
            "codigo" : _avanceCod,
            'algo' : 'prueba'
        };
    
        $.ajax({
            data:  _parametros,
            url:   './COM/COM_consulta_comunicaciones_listado_reconsulta.php',
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
                //console.log(_res);
                if(_res.res=='exito'){
                    //console.log(_res.data.regs.length);
                    //console.log(_estadodecarga);
                    if(_res===null){
                        _estadodecarga='terminado';
                    }else{
                    
                        _estadodecarga='activo';
                        for(i=0;i<_res.data.regs.length;i++){
                        	_ComunicacionesCargadas[_res.data.regs[i].id]=_res.data.regs[i];
                            generarFila(_res.data.regs[i],'carga');
                        }
        
                        if(_res.data.avance=='terminado'||_res.data.regs.length==0){
                            _estadodecarga='terminado';
                            return;
                        }
                            
                        if(_res.data.avance!='terminado'){
                            continuarcarga(_res.data.avanceCod);
                        } 
                    }
                    filtrarFilas();
                }
            }
        });
    }

    window.onscroll = function(ev){

        //console.log(_estadodecarga);
        if(_estadodecarga=='activo'){
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-600)) {
                _pag=document.getElementById('page');
                _altura=_pag.clientHeight;
                _altura=_altura+600;
                _pag.style.minHeight=_altura+'px';		    	
                _estadodecarga='cargando';
                console.log(_estadodecarga + ': ' + window.innerHeight + ' ' + window.scrollY + ' ' + document.body.offsetHeight);
                continuarcarga(_avanceCod);
            }
        }
    }		
    function quitarFila(_id){
            _cont=document.querySelector('#contenidoextenso #comunicaciones');
            
            _ref=document.querySelector('#contenidoextenso #comunicaciones .fila#fnc'+_id);
            
            _cont.removeChild(_ref);
    }
    var _NroOrden=0;
    
    
    function generarFila(_reg,_modo){
    	
        //modo puede ser carga, nuevo o actualiza
        //nuevo, genera una fila arriba de todo
        //carga genera una fila abajode todo
        //actualiza genera la fila reemplazando la existente co nel mismo id
        if(_modo==undefined){_modo='carga';}			
        //console.log('cargando fila' + _reg.id);
        _NroOrden=_NroOrden+1;
        _modF=document.getElementById("fcnModelo").cloneNode(true);
        _cont=document.querySelector('#contenidoextenso #comunicaciones');
        _cont.appendChild(_modF);
        _modF.setAttribute('id','fnc'+_reg.id);
        
        if(_reg.idga==undefined){
        	_reg.idga=_reg.id_p_grupos_id_nombre_tipoa;
        }
        if(_reg.idga==undefined){_reg.idga='0';}
        if(_reg.idga==''){_reg.idga='0';}
        
        if(_reg.idgb==undefined){
        	_reg.idgb=_reg.id_p_grupos_id_nombre_tipob;
        }
        if(_reg.idgb==undefined){_reg.idgb='0';}
        if(_reg.idgb==''){_reg.idgb='0';}
        
        _modF.setAttribute('gaid',_reg.idga);
        _modF.setAttribute('gbid',_reg.idgb);
        _modF.setAttribute('regId',_reg.id);
        _modF.setAttribute('norden',_NroOrden);
        _modF.setAttribute('fecha',_reg.emision);
        _modF.setAttribute('estado',_reg.estado);
        _modF.setAttribute('sentido',_reg.sentido);
        _modF.setAttribute('pnom',_reg.falsonombre);

        if(_reg.hfila>0){
            //_modF.setAttribute('style','height:'+_reg.hfila+'px;');
        }

        for(_idorig in _reg.origenes){					
            _modOrig=document.getElementById('modLink').cloneNode(true);
            _modOrig.removeAttribute('id');
            _modOrig.setAttribute('regId',_idorig);
            _modOrig.setAttribute('linkId',_reg.origenes[_idorig].linkid);
            _modOrig.childNodes[0].setAttribute('name','refOrig');
            //_modOrig.childNodes[0].setAttribute('href','#fnc'+_idorig);					
            //console.log(_idorig);
            _modOrig.childNodes[0].setAttribute('pnom',_reg.origenes[_idorig].falsonombre);
            _modOrig.childNodes[0].setAttribute('sentido',_reg.origenes[_idorig].sentido);
            _modOrig.childNodes[0].setAttribute('estado',_reg.origenes[_idorig].estado);
            _modOrig.childNodes[0].innerHTML=_reg.origenes[_idorig].falsonombre;
            _modF.childNodes[1].appendChild(_modOrig);
        }

        _altOri=_modF.childNodes[1].clientHeight;
        
        _gacod=_Grupos[_reg.idga].codigo;
        if(_gacod==''){_gacod=_Grupos[_reg.idga].nombre;}
        _modF.querySelector('#grupo').innerHTML=_gacod;
        

        _gbcod=_Grupos[_reg.idgb].codigo;
        if(_gbcod==''){_gbcod=_Grupos[_reg.idgb].nombre;}
        _modF.querySelector('#grupo2').innerHTML=_gbcod;	
        
        //console.log(_reg.fechaobjetivo +'<'+ _Hoy +'&&'+ _reg.cerrado+'=='+'no'+ '&&'+ _reg.requerimiento +'=='+'si');
        if(_reg.fechaobjetivo < _Hoy && _reg.cerrado=='no' && _reg.requerimiento =='si'){
	        _modBR=document.getElementById("modbanderaroja").cloneNode(true); 
            _modBR.removeAttribute('id');
            _modF.querySelector('#gestion').appendChild(_modBR);
	    }
	    
	               
        if(_reg.cerrado=="si (controlar)" ){
            _modOj=document.getElementById("modojito").cloneNode(true); 
            _modOj.removeAttribute('id');
            _modF.querySelector('#gestion').appendChild(_modOj);
        }
        
        if(_reg.relevante=='si'){
            _modF.querySelector('#rel').innerHTML='!';
        }else{
            _modF.querySelector('#rel').innerHTML='';
        }
        
        _modF.querySelector('#nom').innerHTML=_reg.nombre.substring(0, 40);
        _class=_modF.querySelector('#nom').getAttribute('class');
        _modF.querySelector('#nom').setAttribute('class', _class + ' ' + _reg.EstElim);
        
        //campo entra o sale;
        _corto = _reg.sentido.replace("entrante", "entra<");
        _corto = _corto.replace("saliente", "sale>");				
        _modF.querySelector('#sen').innerHTML+=_corto;
        
        if(_reg.estado!='cerrada'&&_reg.requerimiento=='si'){
            _modRta=document.getElementById("modcargarrespuesta").cloneNode(true); 
            _modRta.removeAttribute('id');
            _modF.querySelector('#sen').appendChild(_modRta);
        }
        
        if(_reg.preliminar=='extraoficial'){					
            _modextra=document.getElementById("modextra").cloneNode(true);
            _modextra.removeAttribute('id');
            _modF.querySelector('#sen').appendChild(_modextra);
        }
                                
        if(_reg.adjuntos.length>0){
            _modHadj=document.getElementById("modhayadjuntos").cloneNode(true);
            _modHadj.removeAttribute('id');
            _modHadj.setAttribute('title',_reg.adjuntos.length + ' adjuntos');
            _modF.querySelector('.contenido.descrip').appendChild(_modHadj);
        }
        
        if(Object.keys(_reg.documentosasociados.presentados).length>0){
            if(_reg.documentosasociados.respuestos==undefined){_reg.documentosasociados.respuestos=Array();}
            _modDocs=document.getElementById("modDocs").cloneNode(true);
            _modDocs.removeAttribute('id');
            _modDocs.setAttribute('title',_reg.docsTitulo);
            _modDocs.innerHTML= Object.keys(_reg.documentosasociados.presentados).length.toString() + "/" + Object.keys(_reg.documentosasociados.respuestos).length.toString();
            _modDocs.setAttribute('href','./DOC_gestion.php?comunicacion='+_reg.id)					
            if(Object.keys(_reg.documentosasociados.presentados).length>Object.keys(_reg.documentosasociados.respuestos).length){
                _modDocs.setAttribute('class','alerta');	
            }
            _modF.querySelector('#adj').appendChild(_modDocs);		
        }		
        
        
        
        
        if(_reg.emision==''){
        	_modF.querySelector('#fem').innerHTML="<span class='alerta'>a emitir</span>";        	
        }else{
        	_sp=_reg.emision.split('-');
        	_modF.querySelector('#fem').innerHTML =parseInt(_sp[2])+"<br>";
        	_modF.querySelector('#fem').innerHTML+=_meses[_sp[1]]+"<br>";
        	_modF.querySelector('#fem').innerHTML+="<span>"+_sp[0]+"</span>";	
        }
        
        
        
        if(_reg.recepcion=='0000-00-00'){
        	_modF.querySelector('#fre').innerHTML="<span class='alerta'>a recibir</span>";        	
        	_modF.querySelector('#fre').innerHTML="";
        }else{
        	_sp=_reg.recepcion.split('-');
        	_modF.querySelector('#fre').innerHTML =parseInt(_sp[2])+"<br>";
        	_modF.querySelector('#fre').innerHTML+=_meses[_sp[1]]+"<br>";
        	_modF.querySelector('#fre').innerHTML+="<span>"+_sp[0]+"</span>";	
        }
 
        if(_reg.cerradodesde>'0000-00-00'){
        	_sp=_reg.cerradodesde.split('-');
        	_modF.querySelector('#fce').innerHTML =parseInt(_sp[2])+"<br>";
        	_modF.querySelector('#fce').innerHTML+=_meses[_sp[1]]+"<br>";
        	_modF.querySelector('#fce').innerHTML+="<span>"+_sp[0]+"</span>";	     	
        }else{
        	_modF.querySelector('#fce').innerHTML="";
        	
        }
                        
        _modF.querySelector('#id1').innerHTML=_reg.falsonombre;
        _modF.querySelector('#id2').innerHTML=_reg.id2;
        //_modF.querySelector('#id3').innerHTML=_reg.id3;
        
        for(_idRta in _reg.respuestas){		
            _modRta=document.getElementById('modLink').cloneNode(true);
            _modRta.removeAttribute('id');
            _modRta.childNodes[0].setAttribute('regId',_idRta);
            _modRta.childNodes[0].setAttribute('linkId',_reg.respuestas[_idRta].linkid);
            _modRta.setAttribute('name','refRta');
            //console.log(_idRta);
            //_modRta.childNodes[0].setAttribute('href','#fnc'+_idRta);	
            _modRta.childNodes[0].setAttribute('pnom',_reg.respuestas[_idRta].falsonombre);
            _modRta.childNodes[0].setAttribute('sentido',_reg.respuestas[_idRta].sentido);
            _modRta.childNodes[0].setAttribute('estado',_reg.respuestas[_idRta].estado);
            _modRta.childNodes[0].innerHTML=_reg.respuestas[_idRta].falsonombre;
            _modF.querySelector('#cra').childNodes[1].appendChild(_modRta);
        }	
        _altRes=_modF.querySelector('#cra').childNodes[1].clientHeight;
        _modF.querySelector('#cra').childNodes[1].style.minHeight=(Math.max(_altOri,30))+'px';
        
        _modF.childNodes[1].style.minHeight=(Math.max(_altRes,30))+'px';
        
        if(_modo=='actualiza'){
        	_ref=document.querySelector('#contenidoextenso  #comunicaciones .fila#fnc'+_reg.id);
        	
        	if(_ref!=undefined){
        		
	        	_ref.innerHTML=_modF.innerHTML;
	        	_altoventana=window.innerHeight;
	        	$([document.documentElement, document.body]).animate({
			        scrollTop: $("#"+_ref.getAttribute('id')).offset().top - (_altoventana/2)
			    }, 2000);
			    
			    _ref.setAttribute('editada','no');
			    
			    
			    setTimeout(function(){_ref.setAttribute('editada','si'); }, 50);
			    
		    }else{
		    	_modo='nuevo';
		    }
		}
        
        //alert(_modo);
        if(_modo=='carga'){		
            $("#contenidoextenso  #comunicaciones").append(_modF);
        }else if(_modo=='nuevo'){
        	_ComCargada=_reg;
        	var _parametros = {
        		orden:_filtro.orden
	        };
	        //Llamamos a los puntos de la actividad
	        $.ajax({
	            data:  _parametros,
	            url:   './COM/COM_consulta_listadito.php',
	            type:  'post',
	            success:  function (response) {
	            	
	            	//console.log('buscando id:'+_ComCargada.id);
	            	
	                var _res = $.parseJSON(response);
	                _ref=null;
	                _idcv=0;
	                _ubicada='no';
	                //console.log(_res.data.comunicacionesOrden);
	               	for(_nc in _res.data.comunicacionesOrden){	
	               		_idc=_res.data.comunicacionesOrden[_nc];
	               		if(_idcv==_ComCargada.id||_ubicada=='si'){
	               			_ubicada='si';		
	               			console.log('ubicada en _res.data.comunicacionesOrden. _nc:'+_nc)
	               			_ref=document.querySelector('div.fila#fnc'+_idc);
	               			_i=_nc;
							while(_ref==null&&_i > 0){
								//console.log('buscando primer regirstro anterior con una fila existente.');
	               				_fidc=_res.data.comunicacionesOrden[_i];
	               				//console.log('idcv:'+_idcv+'; fidc:'+_fidc);
	               			 	_i=_i-1;
	               			 	_ref=document.querySelector('div.fila#fnc'+_fidc);
	               			 	//console.log(_ref);
	               			}
	               			console.log('_ref.:'+_ref);
	               			if(_ref!=null){
	               				break;
	               			}
	               			//console.log(_ref)
	               		}
	               		_idcv=_idc;	               		
	               	}
	               	
	               	_cont=document.querySelector('#contenidoextenso #comunicaciones');
	               	
	               	if(_idc==_ComCargada.id){
	               		//el elemento es el último de la lista. por eso no fue asociado a un id pasado.
	               		_cont.appendChild(_modF);
	               	}else if(_ref==null){
	               		_cont.insertBefore(_modF,_cont.childNodes[0]);
	               		//_cont.appendChild(_modF);
	               	}else{
		            	_cont.insertBefore(_modF,_ref);
		            }
		            
		            _altoventana=window.innerHeight;		            
		            $([document.documentElement, document.body]).animate({
				        scrollTop: $("#"+_modF.getAttribute('id')).offset().top - (_altoventana/2)
				    }, 2000);
				    _modF.setAttribute('editada','no');
				    _modF.setAttribute('editada','si');
	            }
	        })			
    	
        	
        	
            
        }else if(_modo=='actualiza'){
        	
      
        }else{
            alert('error dfsgdfgdfsgret');
        }
    }
    
    var _estadodecarga='activo';	
    window.scrollTo(0, 0);
    cargarFilas();

    
    
    function anadirAdjunto(_adat){					

        _h3=document.createElement('h3');
        _h3.setAttribute('idadj',_adat.id);
        
        _aaa=document.createElement('a');
        _aaa.innerHTML=_adat.FI_nombreorig;
        _aaa.setAttribute('href',_adat.FI_documento);
        _aaa.title=_adat.FI_nombreorig;
        _aaa.setAttribute('download',_adat.FI_nombreorig);
        _h3.appendChild(_aaa);

        _in=document.createElement('input');
        _in.value=_adat.descripcion;
        _in.setAttribute('type','text');
        _in.setAttribute('name','adj_'+_adat.id+'_descripcion');
        _h3.appendChild(_in);
        
        _in=document.createElement('input');
        _in.value=_adat.zz_borrada;
        _in.setAttribute('type','hidden');
        _in.setAttribute('id','eliminar');
        _in.setAttribute('name','adj_'+_adat.id+'_zz_borrada');
        _h3.appendChild(_in);
                                    
        _in=document.createElement('input');
        _in.value='X';
        _in.title='borrar documento';
        _in.setAttribute('type','button');
        _in.setAttribute('class','eliminar');
        _in.setAttribute('onclick','eliminarAdjunto(this)');
        _h3.appendChild(_in);
        
        _in=document.createElement('input');
        _in.value='<-';
        _in.title='recuperar documento';
        _in.setAttribute('type','button');
        _in.setAttribute('class','recuperar');
        _in.setAttribute('onclick','desEliminarAdjunto(this)');
        _h3.appendChild(_in);
                                        
        document.querySelector('#form_com #adjuntos #adjuntoslista').appendChild(_h3);
    }
    
    
    function reponderCom(_id){
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        window.location.assign('./agrega_fcom.php?tabla=comunicaciones&salida=agrega_fcom&salidatabla=comunicaciones&respondiendo='+_id);
    }
    
    function resaltar(_this){
        _regid = _this.parentNode.getAttribute('regid');
        console.log('fnc'+_regid);
        if(document.getElementById('fnc'+_regid)==null){return;}
        document.getElementById('fnc'+_regid).style.backgroundColor='lightblue';
    }
    
    function deresaltar(_this){
        _regid = _this.parentNode.getAttribute('regid');
        if(document.getElementById('fnc'+_regid)==null){return;}
        document.getElementById('fnc'+_regid).style.backgroundColor='';
    }
    
    function reponderComPrev(_this){	
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        //console.log(_this);		
        _id=_this.getAttribute('regid');
        _sentido=_this.getAttribute('sentido');
        _falsonombre=_this.innerHTML;
        _emision=_this.getAttribute('emision');
        _status=_this.getAttribute('estado');
        
        //console.log(_idAcc);	
        //console.log(_idAcc);
        _RespPor=document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');			
        //_RespPor.innerHTML='';	
        if(_emision<_idAccEmi){
            _sentido='alerta';
        }
        //console.log(_idAcc);
        _RespPor.innerHTML='<div sentido="'+_sentido+" ' estado='"+_status+'">'+_falsonombre+'</div>';	
    }
    
    
    function reponderComLimpia(){
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        _RespPor=document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
        _RespPor.innerHTML='';			
    }				
    
    function obtieneDescripcion(_idcomunicacion, _destino) {
        if(_destino.getAttribute('title')==''){				
            var parametros = {
                    "id" : _idcomunicacion,
                    "campo" : 'descripcion'
            };

            //Llamamos a los puntos de la actividad
            $.ajax({
                data:  parametros,
                url:   './COM/COM_consulta_comunicacion_campo.php',
                type:  'post',
                success:  function (response){
                    _res=JSON.parse(response);
                    if(_res.res='exito'){
                        procesarRespuestaDescripcion(response, _destino);
                    }else{
                        alert('error, consulte al administrador');
                        console.log(_res);
                    }
                }
            });
        }
    }
    
    function procesarRespuestaDescripcion(response, _destino) {			
        //console.log('response: '+response);
        var _res = $.parseJSON(response);
        //console.log(_res.length);	
        //console.log(_destino);	
        //_destino.setAttribute('title','hola');
        
        for (i = 0; i < _res.data.length; i++) {
            //console.log(_res[i].descripcion);				
            _destino.setAttribute('title',_res.data[i].descripcion);
            
            //console.log(_destino);
        }
    }
    
    function obtieneDescripcionI(_destino) {		
        _idcomunicacion=_destino.parentNode.parentNode.getAttribute('regid');
        
        var _destino=_destino;
        var parametros = {
                "id" : _idcomunicacion,
                "campo" : 'descripcion'
        };
        console.log(parametros);
        //Llamamos a los puntos de la actividad
        
        $.ajax({
            data:  parametros,
            url:  './COM/COM_consulta_comunicacion_campo.php',
            type:  'post',
            success:  function (response){
                _res=JSON.parse(response);
                
                if(_res.res='exito'){
                    procesarRespuestaDescripcionI(response, _destino);
                }else{
                    alert('error, consulte al administrador');
                    console.log(_res);
                }
            }
        });
    }
    
    
    function procesarRespuestaDescripcionI(response, _this) {		
        var _mod = document.getElementById('modDesc').cloneNode(true); 	
        _mod.removeAttribute('id');
        _this.innerHTML='-';
        _this.parentNode.style.zIndex='1001';
        _this.setAttribute('onclick',' toggleDesc(this)');
        var _res = $.parseJSON(response);
        for (i = 0; i < _res.data.length; i++) {
        	_di1=document.createElement('div');
        	_di1.setAttribute('class','flotaDescripcion');
        	_this.parentNode.appendChild(_di1);        	
            _div=document.createElement('div');
            _div.setAttribute('class','descripcion');
            _div.innerHTML=_res.data[i].descripcion;
            _di1.appendChild(_div);
        }
    }	

    function toggleDesc(_this){
    	_this.parentNode.removeChild(_this.parentNode.querySelector('.flotaDescripcion'));
    	_this.parentNode.removeAttribute('style');
    	_this.innerHTML='-i-';
    	_this.setAttribute('onclick','obtieneDescripcionI(this)');    	
    }
    
    function elimRta(_this){	
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        var _this=_this;	
        if(_this.parentNode.getAttribute('linkid')!=undefined){
            _ID=_this.parentNode.getAttribute('linkid');
        }else{
            _ID=_this.previousSibling.getAttribute('linkid');
        }
        
        if(_this.parentNode.parentNode.getAttribute('name')=='origen'){
            _orig = _this.parentNode.getAttribute('regid');
            _dest = _this.parentNode.parentNode.parentNode.getAttribute('regid');
        }else if(_this.parentNode.parentNode.getAttribute('name')=='destino'){
            _orig = _this.parentNode.parentNode.parentNode.parentNode.getAttribute('regid');
            _dest = _this.previousSibling.getAttribute('regid');
        }
        
        
        var parametros = {
            "accion" : 'desvincular',
            "tabla" : 'comunicacioneslinkrespuestas',
            "origen" : _orig,
            "destino" : _dest,
            "campo" : 'descripcion'
        };

        //Llamamos a los puntos de la actividad
        $.ajax({
            data:  parametros,
            url:   './COM/COM_ed_vincula_respuestas.php',
            type:  'post',
            success:  function (response) {
                var _res = $.parseJSON(response);
                console.log(_res, _this);
                if(_res.res='exito'){
                    _this.parentNode.parentNode.removeChild(_this.parentNode);
                }else{
                    alert('error al borrar');
                }
            }
        });
    }	

    var _linkeando='';
    var _idAcc='';
    
    function cargarListadito(){
        
        var _parametros = {
        };
        //Llamamos a los puntos de la actividad
        $.ajax({
            data:  _parametros,
            url:   './COM/COM_consulta_listadito.php',
            type:  'post',
            success:  function (response) {
                var _res = $.parseJSON(response);
                //console.log(_res);
                procesarListadito(_res);
                identificarEnListaditoPertenenciasAGrupos(_listaditoSolG.ga,_listaditoSolG.gb);
            }
        })			
    }		
    
    function procesarListadito(_res){
        _cont=document.getElementById('formLink');
        _separador=_cont.querySelector('#separador');
        for(_nc in _res.data.comunicacionesOrden){
        		_idc=_res.data.comunicacionesOrden[_nc];
           		_cdat=_res.data.comunicaciones[_idc];
           		
                _mod=document.getElementById('modItem').cloneNode(true);
                _mod.removeAttribute('id');
                _mod.setAttribute('regid',_idc);
                _mod.setAttribute('gaid',_cdat.idga);
                _mod.setAttribute('gbid',_cdat.idgb);
                _mod.setAttribute('sentido',_cdat.sentido);
                _mod.setAttribute('estado',_cdat.estado);
                _mod.setAttribute('pnom',_cdat.falsonombre);
                _mod.setAttribute('value',_cdat.etiqueta);
                
                if(
                    (
                        _filtro.grupoa!='todas'
                        &&
                        _filtro.grupoa!=_cdat.idga
                    )
                    ||
                    (
                        _filtro.grupob!='todas'
                        &&
                        _filtro.grupob!=_cdat.idgb
                    )
                ){
                    _cont.appendChild(_mod);	
                }else{
                    _cont.insertBefore(_mod,_separador);  
                }
           // }				
        }
        
        $(document).ready(function() {
            
        $('input[name=Crelac]').hover(				
            function () {
                reponderComPrev(this);
                obtieneDescripcion(this.getAttribute('regId'), this);
                $(this).css({"background-color":"red"});
            }, 				
            function () {
                reponderComLimpia();
                $(this).css({"background-color":""});
            }
        );				
            
        });
    }
    
    
        
    function identificarEnListaditoPertenenciasAGrupos(_ga,_gb){
    	//console.log('filtrando listadito por ga:'+_ga+' gb:'+_gb);
    	_elems=document.querySelectorAll('form.respuestar > .COMcomunicacion');
        for(_ne in _elems){
        	if(typeof _elems[_ne] != 'object'){continue;}
        	if(_elems[_ne].getAttribute('gaid')==_ga){
        		_elems[_ne].setAttribute('ga','si');
        	}else{
        		_elems[_ne].setAttribute('ga','no');
        	}
        	
        	if(_elems[_ne].getAttribute('gbid')==_gb){
        		_elems[_ne].setAttribute('gb','si');
        	}else{
        		_elems[_ne].setAttribute('gb','no');
        	}	
        }
    }
    //cargarListadito();
    
    var _listaditoSolG={
		"ga":'',
		"gb":''
	};
	
    function responderCom(_this){
 
        _ga=_this.parentNode.parentNode.parentNode.getAttribute('gaid');
        _gb=_this.parentNode.parentNode.parentNode.getAttribute('gbid');   
        _listaditoSolG.ga=_ga;
        _listaditoSolG.gb=_gb;
        	
        if(_listadocargado=='no'){
            cargarListadito();
            _listadocargado='si';
        }
        
        if(_this.parentNode.parentNode.parentNode.getAttribute('sentido')=='entrante'){
            document.querySelector('#comandoAborde').setAttribute('saliente','si');
            document.querySelector('#comandoAborde').setAttribute('entrante','no');
        }else{
            document.querySelector('#comandoAborde').setAttribute('saliente','no');
            document.querySelector('#comandoAborde').setAttribute('entrante','si');
        }
        
        document.querySelector('#comandoAborde').setAttribute('ga','no');
        document.querySelector('#comandoAborde').setAttribute('gb','no');
              
		console.log(_ga + ' '+_gb);
        identificarEnListaditoPertenenciasAGrupos(_ga,_gb);
        
        
        _gan=_Grupos[_ga].codigo;
        if(_gan==''){
        	_gan=_Grupos[_ga].nombre;	
        }
        document.querySelector('#comandoAborde #gacod').innerHTML=_gan;
        
        _gbn=_Grupos[_gb].codigo;
        if(_gbn==''){
        	_gbn=_Grupos[_gb].nombre;	
        }
        document.querySelector('#comandoAborde #gbcod').innerHTML=_gbn;
        
        
        _linkeando='respuesta';
                    
        _id=_this.parentNode.parentNode.parentNode.getAttribute('regId');
        _emision=_this.parentNode.parentNode.parentNode.getAttribute('emision');
        _status=_this.parentNode.parentNode.parentNode.getAttribute('estado');
        _falsonombre=_this.parentNode.parentNode.parentNode.getAttribute('pnom');
        
        if(_idAcc!=''){            
            _AuxViejo = document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
            _AuxViejo.style.display='none';					
        }
        
        //console.log(document.getElementById('fnc'+_id));
        _AuxResp =document.querySelector('#fnc'+_id+' #cra .contenedor .AuxResp');
        _AuxResp.style.display='inline-block';		
        
        _idAcc=_id;
        _idAccEmi=_emision;			
        
        document.getElementById('origen').value=_id;
        document.getElementById('destino').value='';
        document.getElementById('comandoAborde').removeAttribute('style');
        document.getElementById('seleorig').style.display='none';
        document.getElementById('selerta').style.display='inline';
        document.getElementById('origennombre').innerHTML=_falsonombre;
        _accion='respondiendo';
    } 
    
    
    _listadocargado='no';
    
    function originarCom(_this){
		_ga=_this.parentNode.parentNode.getAttribute('gaid');
        _gb=_this.parentNode.parentNode.getAttribute('gbid');   
        _listaditoSolG.ga=_ga;
        _listaditoSolG.gb=_gb;
        	
        if(_listadocargado=='no'){
            cargarListadito();
            _listadocargado='si';
        }
        
        if(_this.parentNode.parentNode.getAttribute('sentido')=='entrante'){
            document.querySelector('#comandoAborde').setAttribute('saliente','si');
            document.querySelector('#comandoAborde').setAttribute('entrante','no');
        }else{
            document.querySelector('#comandoAborde').setAttribute('saliente','no');
            document.querySelector('#comandoAborde').setAttribute('entrante','si');
        }
        
        document.querySelector('#comandoAborde').setAttribute('ga','no');
        document.querySelector('#comandoAborde').setAttribute('gb','no');
              
        identificarEnListaditoPertenenciasAGrupos(_ga,_gb);
        
        _gan=_Grupos[_ga].codigo;
        if(_gan==''){
        	_gan=_Grupos[_ga].nombre;	
        }
        document.querySelector('#comandoAborde #gacod').innerHTML=_gan;
        
        _gbn=_Grupos[_gb].codigo;
        if(_gbn==''){
        	_gbn=_Grupos[_gb].nombre;	
        }
        document.querySelector('#comandoAborde #gbcod').innerHTML=_gbn;    	

        _linkeando='origen';

        if(_idAcc!=''){	
            _AuxViejo = document.querySelector('#fnc'+_idAcc+' #cra .contenedor .AuxResp');
            _AuxViejo.style.display='none';
            _AuxResp = document.querySelector('#fnc'+_idAcc+' #cra .contenedor');
            _AuxResp.style.display='none';								
        }			

        _id=_this.parentNode.parentNode.getAttribute('regId');
        _falsonombre=_this.parentNode.parentNode.getAttribute('pnom');
        _emision=_this.parentNode.parentNode.getAttribute('fecha');
        _status=_this.parentNode.parentNode.getAttribute('estado');
        
        
        _idAcc=_id;
        _idAccEmi=_emision;			
        
        document.getElementById('origen').value='';
        document.getElementById('destino').value=_id;
        
        document.getElementById('comandoAborde').removeAttribute('style');
        document.getElementById('seleorig').style.display='inline';
        document.getElementById('selerta').style.display='none';
        document.getElementById('origennombre').innerHTML=_falsonombre;
        _accion='originando';
    } 

    
    function crearLink(_this){	
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        var _this=_this;
        
        if(_linkeando=='origen'){
            _orig = _this.getAttribute('regid');
            _dest = _idAcc;
        }else if(_linkeando=='respuesta'){
            _dest = _this.getAttribute('regid');
            _orig = _idAcc;				
        }
            
        var parametros = {
            "accion" : 'vincular',
            "tabla" : 'comunicacioneslinkrespuestas',
            "campo" : 'descripcion',
            "origen" : _orig,
            "destino" : _dest,
        };

        //Llamamos a los puntos de la actividad
        $.ajax({
                data:  parametros,
                url:   './COM/COM_ed_vincula_respuestas.php',
                type:  'post',
                success:  function (response) {
                    var _res = $.parseJSON(response);
                    console.log(_res);
                    if(_res.res='exito'){
                        representarLink(response, _this);
                    }else{
                        alert('error al borrar');
                    }
                }
        });
    }	

    function representarLink(response,_this){
        
        console.log(_this);
        
        _destino=document
        var _res = $.parseJSON(response);
        
        if(_linkeando=='origen'){
            _destino=document.querySelector('#fnc'+_idAcc+' div[name="origen"]');
            
        }else if(_linkeando=='respuesta'){
            _destino=document.querySelector('#fnc'+_idAcc+' #cra .contenedor');
            
        }
        
        _mod=document.getElementById('modLink').cloneNode(true);
        _mod.removeAttribute('id');
        
        _destino.appendChild(_mod);
        
        _mod.setAttribute('linkId',_res.data.nid);
        _mod.setAttribute('regId',_this.getAttribute('regid'));
        _mod.setAttribute('name','refRta');
        
        _mod.childNodes[0].setAttribute('href','#fnc'+_this.getAttribute('regid'));	
        _mod.childNodes[0].setAttribute('pnom',_this.getAttribute('pnom'));
        _mod.childNodes[0].setAttribute('sentido',_this.getAttribute('sentido'));
        _mod.childNodes[0].setAttribute('estado',_this.getAttribute('estado'));
        _mod.childNodes[0].innerHTML=_this.getAttribute('pnom');
    }
        
</script>

<script type='text/javascript'>

	function toogle(_elem){
		    _nombre=_elem.parentNode.parentNode.getAttribute('class');

		    elementos = document.getElementsByName(_nombre);
		    for (x=0;x<elementos.length;x++){			
				elementos[x].removeAttribute('checked');
			}
		    _elem.previousSibling.setAttribute('checked','checked');		
	}
</script>


<script type="text/javascript">	
//carga el formulario para editar múltiple localizaciones simultáneamente.

var _seleccionDOCSid = new Array();
var _ultimamarca='';

    function multieditDOC(_this,_event,_status){
    /*
        if(_HabilitadoEdicion!='si'){
            alert('su usuario no tiene permisos de edicion');
            return;
        }*/
        
        _id=_this.parentNode.parentNode.getAttribute('regid');
        _grupo='sinuso';
        _s=_this.getAttribute('selecto');

        if (_event.ctrlKey==1){ // con ctrl apretado incrementará la seleccion
            if(typeof _seleccionDOCSid[_grupo]=== 'undefined'){
                _seleccionDOCSid[_grupo]=_id;
            }else{
                _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_id;
            }
            
            _this.setAttribute('selecto','si');	
            _this.className += " seleccionado";	
        
        
        }else if(_event.altKey==1){ // con alt apretado eliminará de la selección todos los documentos intermedios entre el último seleccionado y el actual

            console.log('alt presionado');
            if(typeof _seleccionDOCSid[_grupo]=== 'undefined'){
                _seleccionDOCSid[_grupo]=_id;
            }else{
                _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo].replace("_ "+_id, ""); 
            }
            console.log(_seleccionDOCSid[_grupo]);
            
            _this.setAttribute('selecto','no');	
            _this.className = _this.className.replace(" seleccionado", "");
            
        }else if(_event.shiftKey==1){ // con shift apretado incorporará a la selección todos los documentos intermedios entre el último seleccionado y el actual
            
            console.log(_ultimamarca);
            _nuevamarca=_this.parentNode.parentNode.getAttribute('norden');
            
            _desde=Math.min(_nuevamarca,_ultimamarca); 
            _hasta=Math.max(_nuevamarca,_ultimamarca); 	
            _elem = document.getElementsByName('selector');
            
        
            for (var i = 0; i < _elem.length; ++i){

                _pos=_elem[i].parentNode.parentNode.getAttribute('norden');
                
                if(_pos>=_desde&&_pos<=_hasta){
                    _elem[i].setAttribute('selecto','si');	
                    _elem[i].className += " seleccionado";	
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
            _this.className += " seleccionado";	
        }
        
        
        _idstring="";
        _cont=0;
        _elem = document.getElementsByName('selector');
        _seleccionDOCSid[_grupo]='';
        
        for (var i = 0; i < _elem.length; ++i){
            _stat=_elem[i].getAttribute('selecto');
            if(_stat=='si'){
                _cont=_cont+1;
                _idstring=_idstring+"_"+_elem[i].parentNode.parentNode.getAttribute('regid');
                _seleccionDOCSid[_grupo]=_seleccionDOCSid[_grupo]+"_ "+_elem[i].parentNode.parentNode.getAttribute('regid');
                
            }else{
                
            }
        }
        
        if(_cont>1){
            document.getElementById('recuadro4').innerHTML='Selección múltiple de ('+_cont+') documentos:<br>'+_seleccionDOCSid[_grupo];
        }else{
            //_this.setAttribute('selecto','si');
        }
        
        _ultimamarca=_this.parentNode.parentNode.getAttribute('norden');
        
        document.getElementById('recuadro5').src='./agrega_fcoms.php?id='+_seleccionDOCSid[_grupo];		

    }

</script>

<script type="text/javascript">	
//funciones de filtrado

	function tecleaBusqueda(_this,_event){
			
			
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
			
			_val=document.querySelector('[name="busqueda"]').value;
				
			_hatch=_val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			_hatch=_hatch.replace('/[^A-Za-z0-9\-]/gi', '');
			_hatch=_hatch.replace(/ /g, '');
			_hatch=_hatch.toLowerCase();
			
			if(_hatch.length<3){
				_FiltroVisibles.busqueda_act='no'
				filtrarFilas();
				return;
			}
			_FiltroVisibles.busqueda_act='si'
			enviaBusqueda(_hatch);
			
		}
		
		
	var _FiltroVisibles={
		busqueda:Array(),
		busqueda_act:'no',
		sentido:Array(),
		abiertas:Array(),
		grupoa:Array(),
		grupob:Array()
	};
	
	function enviaBusqueda(_hatch){
		var parametros = {
        	'BUSQUEDA': _hatch
        };			
        $.ajax({
            data:  parametros,
            url:   './COM/COM_consulta_comunicaciones_busca.php',
            type:  'post',
            error:   function (response) {alert('error al contactar el servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                
                var _res = $.parseJSON(response);
                //console.log(_res);
                
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                for(_na in _res.acc){
                    if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
                }                
                
                if(_res.res=='exito'){
                	_FiltroVisibles.busqueda=_res.data.comunicaciones;
                	filtrarFilas();
                }
       		}
       	})
	}
	
	
	function filtrarFilas(){
		_form=document.querySelector('#formfiltro');
		
		
		//_filtro.busqueda=_form.querySelector('input[name="busqueda"]').value;
		
        _filtro.sentido =_form.querySelector('input[name="sentido"]:checked').value;        
        _filtro.abiertas=_form.querySelector('input[name="abiertas"]:checked').value;
        _filtro.grupoa  =_form.querySelector('input[name="grupoa"]:checked, select[name="grupoa"] option:checked').value;
        _filtro.grupob  =_form.querySelector('input[name="grupob"]:checked, select[name="grupob"] option:checked').value;
		
		
		
		for(_idcom in _ComunicacionesCargadas){
			
			_fila=document.querySelector('#comunicaciones .fila#fnc'+_idcom);
			
			
			
			if(_FiltroVisibles.busqueda_act=='no'){
				_fila.setAttribute('filtroB',"siver");
			}else{
				if(Object.keys(_FiltroVisibles.busqueda).length>0){
					
					//alert(_idcom);
					//console.log(_FiltroVisibles.busqueda[_idcom]);				
					if(_FiltroVisibles.busqueda[_idcom]!=undefined){	
						//alert(_idcom);
						_FiltroVisibles.busqueda[_idcom]					
						_fila.setAttribute('filtroB',"siver");
					}else{
						_fila.setAttribute('filtroB',"nover");
						
					}
				}
			}
			
			if(_filtro.sentido=='todas'){
				_fila.setAttribute('filtroS',"siver");
			}else if(_filtro.sentido==_ComunicacionesCargadas[_idcom].sentido){
				_fila.setAttribute('filtroS',"siver");
			}else{
				_fila.setAttribute('filtroS',"nover");
			}
			
			if(_filtro.abiertas=='todas'){
				_fila.setAttribute('filtroA',"siver");
			}else if(_ComunicacionesCargadas[_idcom].cerrado!='si'){
				_fila.setAttribute('filtroA',"siver");
			}else{
				_fila.setAttribute('filtroA',"nover");
			}
			
			
			if(_filtro.grupoa=='todas'){
				_fila.setAttribute('filtroGA',"siver");
			}else if(_filtro.grupoa==_ComunicacionesCargadas[_idcom].idga){
				_fila.setAttribute('filtroGA',"siver");
			}else{
				_fila.setAttribute('filtroGA',"nover");
			}
			
			if(_filtro.grupob=='todas'){
				_fila.setAttribute('filtroGB',"siver");
			}else if(_filtro.grupob==_ComunicacionesCargadas[_idcom].idgb){
				_fila.setAttribute('filtroGB',"siver");
			}else{
				_fila.setAttribute('filtroGB',"nover");
			}
						
		}
		
		
		_filas=document.querySelectorAll('#comunicaciones .fila');
		_ctot=Object.keys(_filas).length;
		document.querySelector('#formfiltro #canttotal').innerHTML=_ctot;
		document.querySelector('#formfiltro #porctotal').innerHTML='100%';
				
		_str ='#comunicaciones .fila[filtroB="nover"],';
		_str+='#comunicaciones .fila[filtroS="nover"],';
		_str+='#comunicaciones .fila[filtroA="nover"],';
		_str+='#comunicaciones .fila[filtroGB="nover"],';
		_str+='#comunicaciones .fila[filtroGA="nover"]'
		
		_filas=document.querySelectorAll(_str);
		_cocu=Object.keys(_filas).length;
		_pocu=Math.round(_cocu*100/_ctot);
		document.querySelector('#formfiltro #cantfiltrado').innerHTML=_cocu;
		document.querySelector('#formfiltro #porcfiltrado').innerHTML=_pocu+'%';
		
		_cvis=_ctot - _cocu;
		_pvis=100 - _pocu;
		document.querySelector('#formfiltro #cantvisible').innerHTML=_cvis;
		document.querySelector('#formfiltro #porcvisible').innerHTML=_pvis+'%';
		
	}	
	
	function ordenarFilas(){
		_ordenSel=document.querySelector('#formfiltro select[name="orden"]').value;
		_ordenArr=_ComunicacionesOrden[_ordenSel];
		//_cc=0;
		for(_on in _ordenArr){
			//_cc++;
			//if(_cc>10){break;}
			_idcom=_ordenArr[_on];
			
			_fila=document.querySelector('.fila#fnc'+_idcom);
			_fila.parentNode.appendChild(_fila);
			//_fila.style.backgroundColor='red';
			
		}
	}
</script>
		
		
<?php
ini_set('display_errors',true);
include('./COM/COM_form_com.php');

if(isset($_GET['id'])){$_GET['idcom']=$_GET['id'];}// $_GET['id'] deprecated 

if(isset($_GET['idcom'])){
	if($_GET['idcom']>0){		
		?>
		<script type="text/javascript">	
			iraCom('','<?php echo $_GET['id'];?>','');			
		</script>
		<?php
	}
}
?>
</body>
