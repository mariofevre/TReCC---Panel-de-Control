<?php
/**
* IND_tablas.php
*
* Esta aplicación constituye la visualización en formato tabla de indicadores directos.
 * 
* 
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	documentos
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2022 TReCC SA
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

<head>
	<title>Panel.TReCC</title>
	
	<link href="./a_comunes/img/Panel.ico" type="image/x-icon" rel="shortcut icon">		
	<?php include("./a_comunes/a_comunes_html_meta.php"); ?>	
	
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_panel_base.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_mostrar_DOC_documentos.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./a_comunes/css/a_comunes_objetos_comunes.css?v=<?php echo time();?>">
	
	<link rel="stylesheet" type="text/css" href="./SIS/css/SIS_ayuda.css?v=<?php echo time();?>">			
	
	<link rel="stylesheet" type="text/css" href="./IND/css/IND.css?v=<?php echo time();?>">
	<link rel="stylesheet" type="text/css" href="./IND/css/IND_form.css?v=<?php echo time();?>">
	
	<?php 
	include("./includes/meta.php");
	?>
	
	<style type="text/css">
		table {
		font-size: 12px;
		display:block;
		}
		table tr .fecha{
			max-width:50px;
		}
		table {
		  border-collapse: collapse;
		  width:100%;
		  overflow-x:auto;
		}
		
		table, th, td {
		  border: 1px solid black;
		  text-align:right;
		  
		}
		td, th {
		  overflow:hidden;
		  
		}
		#tablascontenido{
			width:calc(100% - 20px);
		}
		#tablascontenido > div{
			width:100%;
		}
	</style>
</head>
<body>
	
    <script type="text/javascript" src="./_terceras_partes/jquery/jquery-3.2.1.js"></script> 
    <script type="text/javascript" src="./a_comunes/a_comunes_js_funciones_comunes.js?v=<?php echo time();?>"></script>  
    
	
	<?php insertarmenu(); ?>
	
	<div id ='cargavalores'>
	</div>

	<div id="encabezado">	
		
		<!--
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio aún no ha llegado' value='mostrar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?mostrarinactivos=si';">
		<input id='volver' type='button' title='los indicadores inactivos son aquellos que su fecha de inicio aún no ha llegado' value='ocultar inactivos' onclick="window.location='./IND_reporte_ajax_wip.php?';">
		<input id='web' type='button' title='la publicación web es visible para el público en general sin usuario ni contraseña' value='ir a la publicación web' onclick="window.location='http://190.2.6.204:8008/net/paneldecontrol/index.php?id=<?php echo $PanelI;?>';">
		-->
		<a class='boton' id='botongestion'          title='el modo gestion sirve crear y modifitar la estructura d elos indicadores y cargar sus datos'       onclick="window.location='./IND_gestion.php?';" >modo gestion</a>
		<a class='boton' id='botongrafico'          title='el modo gráficos permite visualizar los indicadores en gráficos de lineas, barras, y tortas'       onclick="window.location='./IND_graficos.php';" >modo gráficos</a>	
		<a class='boton' id='botontabla'   disabled title='el formato tabla sirve para copiar los datos a una hoja de cálculo (MS-excel o Libreoffice scalc)' onclick="window.location='./IND_tablas.php';"    >modo tablas</a>	
		
	</div>	

<div id="pageborde">
	<div id="page">
	<h1>Tablas de registro de Indicadores</h1>	
	
	<div id="tablascontenido">
	</div>
	
	
<script type="text/javascript">
		var _PanId='<?php echo $PanelI;?>';
		var _PanelI='<?php echo $PanelI;?>';
		var _DatosGrupos=Array();
		
		var _parametros = {
            'panid': _PanelI
		};
		$.ajax({
			url:   './PAN/PAN_grupos_consulta.php',
			type:  'post',
			data: _parametros,
			error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				_DatosGrupos=_res.data;
				consultarEstructura();
			}
		})
		
		function recargaDatosGrupos(_destino,_tipo){
			//console.log(_tipo);
			var _destino = _destino;
			var _tipo = _tipo; 
			var _parametros = {
                'panid': _PanelI
            };
			$.ajax({
				url:  './PAN/PAN_grupos_consulta.php',
				type:  'post',
				data: _parametros,
				error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
	            },
				success:  function (response){
					
					var _res = PreprocesarRespuesta(response);
					if(_res===false){return;}
				
					_DatosGrupos=_res.data;
					
				}
			})		
		}

		
		
	var _editarInd = '';
	var DatosGenerales=Array();
	function consultarEstructura(){				
        var _parametros = {
            'panid': _PanelI
        };

        $.ajax({
            url:   './IND/IND_consulta_estructura.php',
            type:  'post',
            data: _parametros,
            error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				
                DatosGenerales=_res.data;
                
                consultarIndicadores();
                    
            }
        });
	}

	var DatosRegistros=Array();
	//consulta los indicadores y sus registros o contenidos
	
	var _Tablas={};
	var _TN=0;
	function consultarIndicadores(){		
		
		var _parametros = {
			"hasta":'',
			"modo":'display',
			"indicador":'',
			'panid': _PanelI
		};
		
 		$.ajax({
			url:   'IND/IND_consulta_registros.php',
			type:  'post',
			data: _parametros,
            error: function(XMLHttpRequest, textStatus, errorThrown){ 
                    alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
            },
			success:  function (response){
				
				var _res = PreprocesarRespuesta(response);
				if(_res===false){return;}
				
				DatosRegistros=_res.data.registros;
				
						
				for(_idind in _res.data.registros){
					if(DatosGenerales.indicadores[_idind]==undefined){continue;}//desestima registros de indicadores no cargados
					_rdat=_res.data.registros[_idind];
					//console.log(_rdat);
					_indCont=document.getElementById('HcI'+_idind);
					
					
					_comparacion:	
					for(_idindcompara in DatosGenerales.indicadores){
						if(
							DatosGenerales.indicadores[_idind].id_p_INDperiodicidad != DatosGenerales.indicadores[_idindcompara].id_p_INDperiodicidad
							//coincide periodicidad
						){
							continue;
							//no coincide		
						} 
						
						
						if(Object.keys(_rdat).length == 0){
							if(DatosGenerales.indicadores[_idindcompara].TablaAsignada==undefined){									
								//el otro no tiene una tabal asignada	
							}else{
								_tasign=DatosGenerales.indicadores[_idindcompara].TablaAsignada;
								DatosGenerales.indicadores[_idind].TablaAsignada=_tasign;
								_Tablas[_tasign].indicadores.push(_idind);
							}	
							
							break _comparacion;
						}
						
						
						for(_FF in _rdat){
							
							for(_FFcompara in _res.data.registros[_idindcompara]){
							
								if(_FF == _FFcompara){
									
									//coincide: los dos indicadores pertenecen a una misma tabla
									
									if(DatosGenerales.indicadores[_idindcompara].TablaAsignada==undefined){
										
										//el otro no tiene una tabal asignada	
									}else{
										_tasign=DatosGenerales.indicadores[_idindcompara].TablaAsignada;
										DatosGenerales.indicadores[_idind].TablaAsignada=_tasign;
										_Tablas[_tasign].indicadores.push(_idind);
										
										for(_FF2 in _rdat){
											_Tablas[_tasign].fechas[_FF2]='';
										}
										
										break _comparacion;
									}
								}
							}	
						}	
					}
					
					
					if(DatosGenerales.indicadores[_idind].TablaAsignada==undefined){
						_TN++;
						DatosGenerales.indicadores[_idind].TablaAsignada=_TN;
						_Tablas[_TN]={
							'periodicidad':DatosGenerales.indicadores[_idind].periodicidadT,
							'indicadores':Array(_idind),
							'fechas':{}
						}
						//console.log('creando tabla '+_TN);
						//console.log(_rdat);
						for(_FF in _rdat){
							_Tablas[_TN].fechas[_FF]='';
						}
					}
					
					/*	
						_dato=document.createElement('div');
						_dato.setAttribute('class','dato');
						
						if(DatosGenerales.indicadores[_idind].id_p_INDperiodicidad>1){
							_dato.innerHTML=_rdat[_FF].valorT;
						}
						
						_dato.style.left=(_rdat[_FF].diasN + DatosGenerales.indicadores[_idind].diaN - 30)*2;
						
						document.getElementById('verreg').style.display='none';
						_indCont.appendChild(_dato);
					}
					
					
                    //console.log(_idind)
					if(DatosGenerales.indicadores[_idind]==undefined){continue;}//desestima registros de indicadores no cargados
					_rdat=_res.data.registros[_idind];
					_indCont=document.getElementById('HcI'+_idind);
					
					for(_FF in _rdat){
						_dato=document.createElement('div');
						_dato.setAttribute('class','dato');
						
						if(DatosGenerales.indicadores[_idind].id_p_INDperiodicidad>1){
							_dato.innerHTML=_rdat[_FF].valorT;
						}
						
						_dato.style.left=(_rdat[_FF].diasN + DatosGenerales.indicadores[_idind].diaN - 30)*2;
						
						document.getElementById('verreg').style.display='none';
						_indCont.appendChild(_dato);
					}*/
				}
				
				representarTablas();
			}
		});	
	}

	function representarTablas(){
		
		for(_TN in _Tablas){
			
			_divt=document.createElement('div');
			document.querySelector('#tablascontenido').appendChild(_divt);
			
			_tit=document.createElement('div');
			_divt.appendChild(_tit);
			_divt.innerHTML='tabla '+_Tablas[_TN].periodicidad;
			
			_tab=document.createElement('table');
			_divt.appendChild(_tab);
			
			_tabb=document.createElement('tbody');
			_tab.appendChild(_tabb);
			
			_tr=document.createElement('tr');
			_tabb.appendChild(_tr);
			
			_th=document.createElement('th');
			_tr.appendChild(_th);
			_th.innerHTML='id';
			
			_th=document.createElement('th');
			_tr.appendChild(_th);
			_th.innerHTML='indicador';
			
			_th=document.createElement('th');
			_tr.appendChild(_th);
			_th.innerHTML='grupo primario'
			
			_th=document.createElement('th');
			_tr.appendChild(_th);
			_th.innerHTML='grupo secundario'
			
			for(_ff in _Tablas[_TN].fechas){
				_th=document.createElement('th');
				_tr.appendChild(_th);
				_th.setAttribute('class','fecha');
				_fff=_ff.split('-');
				_th.innerHTML=_fff[2]+'<br>'+_mesnom[parseInt(_fff[1])] +'<br>'+_fff[0];
			}
			
			for(_ni in _Tablas[_TN].indicadores){
				_idind=_Tablas[_TN].indicadores[_ni];
				
				_tr=document.createElement('tr');
				_tabb.appendChild(_tr);
				
				_th=document.createElement('td');
				_tr.appendChild(_th);
				_th.innerHTML=_idind;
				
				_th=document.createElement('td');
				_tr.appendChild(_th);
				_th.innerHTML=DatosGenerales.indicadores[_idind].indicador;
				
				_th=document.createElement('td');
				_tr.appendChild(_th);
				_idg=DatosGenerales.indicadores[_idind].id_p_grupos_id_nombre_tipoa;
				_th.innerHTML=_DatosGrupos.grupos[_idg].nombre;
				
				_th=document.createElement('td');
				_tr.appendChild(_th);
				_idg=DatosGenerales.indicadores[_idind].id_p_grupos_id_nombre_tipob;
				_th.innerHTML=_DatosGrupos.grupos[_idg].nombre;
				
				_persiste='';
				for(_ff in _Tablas[_TN].fechas){
					
					_th=document.createElement('td');
					_tr.appendChild(_th);
					_th.setAttribute('class','fecha');
					
					
					if(DatosRegistros[_idind][_ff]!=undefined){
						_th.innerHTML=DatosRegistros[_idind][_ff].valorT;
						if(DatosGenerales.indicadores[_idind].persistente='1'){
							_persiste=DatosRegistros[_idind][_ff].valorT;
						}				
					}else if(_persiste !== ''){
						_th.innerHTML= _persiste;
					}
					
				}
			}			
		}	
	}
	
	
	
	var _weekday = new Array(7);
	_weekday[0]=  "l";
	_weekday[1] = "m";
	_weekday[2] = "m";
	_weekday[3] = "j";
	_weekday[4] = "v";
	_weekday[5] = "s";
	_weekday[6] = "d"; 

	var _mesnom = new Array(7);
	_mesnom[1]=  "enero";
	_mesnom[2] = "febrero";
	_mesnom[3] = "marzo";
	_mesnom[4] = "abril";
	_mesnom[5] = "mayo";
	_mesnom[6] = "junio";
	_mesnom[7] = "julio"; 
	_mesnom[8] = "agosto";
	_mesnom[9] = "septiembre";
	_mesnom[10] = "octubre";
	_mesnom[11] = "noviembre";
	_mesnom[12] = "diciembre";
		
	</script>	
</body>
