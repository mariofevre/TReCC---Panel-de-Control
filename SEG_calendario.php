<?php
/**
* SEG_calendario.php
*
* genera la estructua HTML para cargar y visualizar seguimento y acciones activas en modo calendario.
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	Lista de seguimiento / tracking / segumiento
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013 - 2019 TReCC SA
* @license    	http://www.gnu.org/licenses/agpl.html GNU Affero General Public License, version 3 (AGPL-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm) y TReCC(tm) intraTReCC.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU Affero General Public License" 
* publicada por la Free Software Foundation, version 3
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser útil, eficiente, predecible y transparente
* pero SIN NIGUNA GARANTÍA; sin siquiera la garantía implícita de
* CAPACIDAD DE MERCANTILIZACIÓN o utilidad para un propósito particular.
* Consulte la "GNU Affero General Public License" para más detalles.
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

$HabilitadoEdicion='si';
?>

<head>
	<title>Panel.TReCC</title>
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">			
	
	<link rel="stylesheet" type="text/css" href="./SEG/css/SEG.css?v=<?php echo time();?>">
	
	<style type="text/css">
        
        
        body{
            overflow:hidden;
        }	
            
        .dia{
            display:inline-block;
            width:90px;
            height:59px;
            <?php if($reporte=="si"){echo"height:50px;";}?>		
            border:1px solid #000;
        }
                
        #encabezado{
            display:inline-block;	
            position:relative;	
        }
        
        .aclara{
            font-size:9px;
        }
        
        .dia > .etiqueta{
            vertical-align: top;
            border-right:1px solid #000;
            display:inline-block;
            width:17px;
            height:58px;
            <?php if($reporte=="si"){echo"height:50px;";}?>		
        }
        .dia > .obras{
            vertical-align: top;
            display:inline-block;	
            width:69px;
            height:58px;		
            <?php if($reporte=="si"){echo"height:50px;";}?>		
        }	
        
        .obras > .obra{
            vertical-align: top;
            display:block;		
            border-bottom:1px solid #000;
            width:69px;
            height:19px;		
            <?php if($reporte=="si"){echo"height:16px;";}?>		
            position: relative;
        }	
        
        .obras > .obra > .botonobra >div{
            font-size:10px;	
            display:inline-block;
            line-height: 9px;
            <?php if($reporte=="si"){echo"line-height: 8px;";}?>		
        }	
        
        .obras > .obra > .botonobra > div.nombre{
            font-size:10px;	
            width:67px;
            display:block;
        }
        
        div.mes{
            background-color:#fff;	
            display: inline-block;
            width: 580px;
            position:relative;
        }
        
        td, th{
            border:1px solid #000;
        }
        
        th{
            background-color:silver;
        }
        
        .lnombre, .lpartido{
            font-size:11px;
        }
            
        div.otromes > div{
            display:none;
            background-color:lightblue;
            color:gray;
        }
        div.otromes{
            background-color:lightblue;
            color:gray;
        }

        div.extraobras{
            display: inline-block;
            left: -24px;
            position: relative;
            top: -20px;
            width: 16px;
        }
            
        div.extraobra{
            display: inline-block;
            left: 7px;
            position: relative;
            top: 0px;
            width: 8px;
        }
        
        .extraobra > a{
            line-height: 9px;
            background:none;
        }

        .extraobra > a:hover{
            background-color:#08AFD9;;
            color:#000;

        }	
            
        .botonobra{
            width: 70px;
            height:19px;
            <?php if($reporte=="si"){echo"height: 16px;";}?>		
            color:#000;
            display:block;
        }
        a.botonobra:hover{
            background-color:#08AFD9;
            color:#000;

        }	

        .stat{
            position:absolute;
            top:2px;
            left:62px;
            width: 5px;
            height:10px;
            border:1px solid #000;
            display:block;		
        }	
                    
        .vencida{
            background-color: #FF7D9A;
            color: #9F0929;
        }
        
        .terminada{
            background-color: #FFFFFF;
            color: #90949F;
        }
        
        .enfecha{
            background-color: #7DE6FF;
            color: #077B98;
        }
        
        .bloque{
            text-align:center;
        }


        .navega{
            border:2px solid #08AFD9;
            width:90px;
            position:absolute;
            background-color:#fff;
        }
        
        .navega.anterior{
            top:5px;
            left:-95px;
        }
        
        .navega.posterior{
            top:5px;
            left:585px;
        }
        
        .navega >a{
            width:88px;
            display:block;
            border:1px solid;
        }	
        
        .dia{	
        overflow:hidden;
        }
        
        .dia.dom{
            width:25px;
        }
        
        .dia.dom > .etiqueta{
            position: absolute;
            z-index:2;
        }
        
        .sinanterior{
            position:absolute;
            top:400px;
            left:0px;
            background-color:#fff;
            opacity:0.8;
        }
		
	</style>
</head>
<body>


	<script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script>
	
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  


	<?php  insertarmenu();	//en comunes.php	?>
		
	<div id="pageborde">
    <div id="page">		
				
        <h1>Gestión de Seguimiento</h1>	
		<h2>modo calendario</h2>			
        <h2>
            <a href="./SEG_listado.php">ver modo lista</a>	
            <a href="./SEG_resumen.php">ver modo resumen</a><br>
        </h2>		
        <a href='./agrega_f.php?tabla=<?php echo $Tabla; ?>&salida=<?php echo $Estearchivo; ?>'>agregar seguimiento</a>

		<div id="contenidoextenso">
		
        
        <div class="tablahoraria">
            <div class="bloque">
                <div class="mes">
                    <div class="navega anterior">
                        <a href="./listadeseguimientocalendario.php?fecharequerida=2018-05-01">
                            &lt;&lt;&lt;--- <br>
                            mes anterior
                        </a>
                        <a class="terminada" href="./listadeseguimientocalendario.php?fecharequerida=2015-09-28">
                            &lt;&lt;&lt;---<br>
                            ant. terminadas<br>
                            <span class='cant'>0</span>. <span class='ultimafecha'></span>
                        </a>
                        <a class="enfecha" href="./listadeseguimientocalendario.php?fecharequerida=">
                            &lt;&lt;&lt;---<br>
                            ant. en fecha<br>
                            <span class='cant'>0</span>. <span class='ultimafecha'></span>
                        </a>
                        <a class="vencida" href="./listadeseguimientocalendario.php?fecharequerida=2016-02-01">
                            &lt;&lt;&lt;---<br>
                            ant. vencidas<br>
                            <span class='cant'>0</span>. <span class='ultimafecha'></span>
                        </a>
                    </div>
                    
                    <h1>Sin más fechas programadas &gt;&gt;&gt;&gt;|</h1>
                    <div class="navega posterior">
                        <a href="./listadeseguimientocalendario.php?fecharequerida=2018-07-01">
                            ---&gt;&gt;&gt;<br>
                            mes siguiente
                        </a>
                        <a class="terminada" href="./listadeseguimientocalendario.php?fecharequerida=2018-06-01">
                            ---&gt;&gt;&gt;<br>
                            sig. terminadas<br>
                            <span class='cant'>0</span>. <span class='primerfecha'></span>
                        </a>
                        <a class="enfecha" href="./listadeseguimientocalendario.php?fecharequerida=2018-06-01">
                            ---&gt;&gt;&gt;<br>
                            sig. en fecha  <br>
                            <span class='cant'>0</span>. <span class='primerfecha'></span>
                        </a>
                        <a class="vencida" href="./listadeseguimientocalendario.php?fecharequerida=2018-06-01">
                            ---&gt;&gt;&gt;<br>
                            sig. vencidas<br>
                            <span class='cant'>0</span>. <span class='primerfecha'></span>
                        </a>
                    </div>
                </div>
            </div>
		</div>
	</div>	
    </div>


<script type='text/javascript'>

    var _visibleDesde='<?php echo date("Y-m").'-01';?>';
    var _visibleHasta='<?php echo date("Y-m").'-'.diasenelmes(date("Y-m-d"));?>';

    var _PanId = '<?php echo $PanelI;?>';
    var _HabilitadoEdicion = '';

    function cargarFechas(){
        _parametros = {
            'panid': _PanId
        };
        $.ajax({
            url:   './SEG/SEG_consulta.php',
            type:  'post',
            data: _parametros,
            error: function (response){alert('error al intentar contatar el servidor');},
            success:  function (response){
                var _res = $.parseJSON(response);
                console.log(_res);
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
                
                for(_ns in _res.data.seguimientosOrden){
                    _idseg=_res.data.seguimientosOrden[_ns];
                    _dat=_res.data.seguimientos[_idseg];
                                
                    for(_na in _dat.accionesOrden){
                    
                        _idacc=_dat.accionesOrden[_na];
                        _datacc=_dat.acciones[_idacc];
                        
                        if( _datacc.fechaejecucion < _visibleDesde){         
                        
                            _cant=querySelector('div.navega.anterior > a.'+_datacc.estado+' > .cant');
                            _cant.innerHTML=parseInt(_cant.innerHTML)+1;
 
                            _uf=querySelector('div.navega.anterior > a.'+_datacc.estado+' > .ultimafecha');
                            if(_datacc.fechaejecucion>_uf.innerHTML){
                                _uf.innerHTML=_datacc.fechaejecucion;
                            }
                            
                        }else if( _datacc.fechaejecucion > _visibleHasta){                            
                        
                            _cant=querySelector('div.navega.posterior > a.'+_datacc.estado+' > .cant');
                            _cant.innerHTML=parseInt(_cant.innerHTML)+1;
 
                            _uf=querySelector('div.navega.posterior > a.'+_datacc.estado+' > .primerfecha');
                            if(_datacc.fechaejecucion>_uf.innerHTML){
                                _uf.innerHTML=_datacc.fechaejecucion;
                            }                            
                        }
                        
                        
                        if(
                            _datacc.fechaejecucion >= _visibleDesde
                            &&
                            _datacc.fechaejecucion <= _visibleHasta
                        ){
                                                
                            _loc=querySelector('div.tablahoraria div.mes div.dia[fecha="'+_datacc.fechaejecucion+'"]');
                            
                            _pl= _datacc.fechaejecucion.split('-');
                        
                            _aaa =document.createElement('a');
                            _aaa.setAttribute('class','botonobra '+_datacc.estado);
                            _aaa.title=_datacc.descripcion;
                            _aaa.setAttribute('idacc',_idacc);                            
                            _aaa.setAttribute('onclick','formularAccion(this,event)');
                            _loc.appendChild(_aaa);
                            
                            _ddd =document.createElement('div');
                            _ddd.setAttribute('class','nombre');
                            _ddd.innerHTML=_datacc.nombre;
                            _aaa.appendCHild(_ddd);
                            
                            _ddd =document.createElement('div');
                            _ddd.setAttribute('class','hora');
                            _ddd.innerHTML=_pl[2]+'-'+_pl[1]+'-'+_pl[0];
                            _aaa.appendCHild(_ddd);
                            
                            
                            _aaa.title=_datacc.descripcion;
                            _aaa.innerHTML= _datacc.nombre+'-'+_datacc.fechacontrol;
                            _tareas.appendChild(_aaa);
                        }     
                    }       
                }        
            }
        });   	
    }
    cargarFechas();

    function dibujarCalendario(){
    
        _cants=document.querySelectorAll('div.navega span.cant');
        for(_nc in _cants){
            if(typeof _cants[_nc] != 'object'){continue;}
            _cants[_nc].innerHTML=0;
        }
 
         _links=document.querySelectorAll('div.navega span.primerafecha, div.navega span.ultimafecha');
        for(_nc in _links){
            if(typeof _links[_nc] != 'object'){continue;}
            _links[_nc].innerHTML='';
        }
        
        _parametros = {
            'fecha': _visibleDesde
        };
        $.ajax({
            url:   './SEG/SEG_consulta_calendario.php',
            type:  'post',
            data: _parametros,
            error: function (response){alert('error al intentar contatar el servidor');},
            success:  function (response){
                var _res = $.parseJSON(response);
                console.log(_res);
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}      
                for(_ns in _res.data.fechas){
                
                    _tabla=document.querySelector('.tablahoraria .mes');
                    
                    _ddd = document.createElement('div');
                    _ddd.setAttribute('class','dia '+_res.data.fechas[_ns].dia+' '+_res.data.fechas[_ns].obs);
                    _tabla.appendChild(_ddd);
                    
                    _sp=_ns.split('-');
                    _dd1 = document.createElement('div');
                    _dd1.setAttribute('class','etiqueta');
                    _dd1.innerHTML=_sp[2]+'<div class="aclara">'+_res.data.fechas[_ns].dia.substring(0,3)+'<br>'+_res.data.fechas[_ns].mes+'<div>';
                    _ddd.appendChild(_dd1);
                    
                    _dd1 = document.createElement('div');
                    _dd1.setAttribute('class','obras');
                    _ddd.appendChild(_dd1);
                    
                    _dd2 = document.createElement('div');
                    _dd2.setAttribute('class','obra');
                    _dd2.setAttribute('estado','vacio');
                    _ddd.appendChild(_dd2);
                    
                    _dd2 = document.createElement('div');
                    _dd2.setAttribute('class','obra');
                    _dd2.setAttribute('estado','vacio');
                    _ddd.appendChild(_dd2);
                    
                    _dd2 = document.createElement('div');
                    _dd2.setAttribute('class','obra');
                    _dd2.setAttribute('estado','vacio');
                    _ddd.appendChild(_dd2);
                    
                    _dd2 = document.createElement('div');
                    _dd2.setAttribute('class','extraobra');
                    _dd2.setAttribute('estado','vacio');
                    _ddd.appendChild(_dd2);
                    
                    
                }
                
            }
        });
    }
    
    dibujarCalendario();
    
</script>

</body>

