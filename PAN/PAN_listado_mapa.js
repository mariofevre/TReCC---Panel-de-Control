/**
*
* @package    	geoGEC
* @author     	GEC - Gestión de Espacios Costeros, Facultad de Arquitectura, Diseño y Urbanismo, Universidad de Buenos Aires.
* @author     	<mario@trecc.com.ar>
* @author    	http://www.municipioscosteros.org
* @copyright	2018 Universidad de Buenos Aires
* @copyright	esta aplicación se desarrollo sobre una publicación GNU 2017 TReCC SA
* @license    	http://www.gnu.org/licenses/gpl.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (GPL-3.0)
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los términos de la "GNU AFFERO GENERAL PUBLIC LICENSE" 
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


var mapa={};
var _view={};
var _Dibujando='no';

_view =	new ol.View({
  projection: 'EPSG:3857',
  center: [-7000000,-4213000],
  zoom: 5,
  minZoom:2,
  maxZoom:19	      
});

_view.on('change:resolution', function(evt){   
    if(_view.getZoom()>=19){
   		layerBing.setSource(_sourceBaseBING);
   		layerBing.setOpacity(0.8);
   }else if(_view.getZoom()>=17){
   		layerBing.setSource(_sourceBaseBING);
   		layerBing.setOpacity(0.5);
   }else{
   		layerBing.setSource();
   }
});

    

////SOURCES
var _sourceBaseOSM=new ol.source.Stamen({
	layer: 'toner'
});

var _sourceBaseBING=new ol.source.BingMaps({
 	key: 'CygH7Xqd2Fb2cPwxzhLe~qz3D2bzJlCViv4DxHJd7Iw~Am0HV9t9vbSPjMRR6ywsDPaGshDwwUSCno3tVELuob__1mx49l2QJRPbUBPfS8qN',
 	imagerySet:  'Aerial'
});
var _source_rel_sel= new ol.source.Vector({
	wrapX: false,   
	projection: 'EPSG:3857' 
});
	
var _SourceLocalizaciones= new ol.source.Vector({
	wrapX: false,   
	projection: 'EPSG:3857' 
});


////LAYERS
var layerOSM = new ol.layer.Tile({
	 source: _sourceBaseOSM
});

var layerBing = new ol.layer.Tile({
	 source: _sourceBaseBING	 
});	

var _layer_Localizaciones= new ol.layer.Vector({
	name: 'relevamiento',
	source: _SourceLocalizaciones,
	zIndex:10,
	/*style: function(feature) {
		if(feature.get('name')!=null){
		//labelStyle.getText().setText(feature.get('name'));
		
	   }else{
		//labelStyle.getText().setText('');
	   }
	   return labelStyle;
	},*/
	declutter: false   
});

//layer de geometría seleccionadad para cargar datos
var _st_rel_sel=new ol.style.Style({
	 image: new ol.style.Circle({
		   stroke: new ol.style.Stroke({color:'rgb(8, 175, 217)',width: 2}),
		   fill: new ol.style.Stroke({color:'rgb(100, 256, 256)',width: 2}),
		   radius: 8
	 }),
	 stroke: new ol.style.Stroke({color: 'rgb(8, 175, 217)',width: 2}),
	 zIndex:2
});
var _layer_rel_sel= new ol.layer.Vector({
	name: 'indicador: elemento selecto',
	source: _source_rel_sel,
	style: _st_rel_sel,
	zIndex:10
});


function localizarPan(){
	cargarMapaObra();
	accionEditarCrearGeometria();
}


var _encuadrado='no';
var _mapaEstado ='';

var _color='rgba(0,200,256,0.2)';
var _colorb='rgba(0,0,100,1)';
var _ancho='0.5';

var labelStyle = new ol.style.Style({

	image: new ol.style.Circle({
	       fill: new ol.style.Fill({color: _color}),
	       stroke: new ol.style.Stroke({color: _colorb,width: 0.8}),
	       radius: 6
	}),
	fill: new ol.style.Fill({color: _color}),
	stroke: new ol.style.Stroke({color: _colorb,width: _ancho}),
	zIndex:100,
	text: new ol.style.Text({
    	font: '12px Calibri,sans-serif',
    	overflow: true,
    	fill: new ol.style.Fill({
      	color: '#000'
	    }),
	    stroke: new ol.style.Stroke({color: '#fff', width: 2})
	})
});

function cargarMapaGeneral(){
	
	document.querySelector('#mapa').innerHTML='';
	document.querySelector('#mapa').setAttribute('estado','activo');
	document.querySelector('#mapa').style.display='block'

	mapa = new ol.Map({
	    layers: [
			layerOSM,
			layerBing,
			_layer_rel_sel,
			_layer_Localizaciones
	    ],
	    target: 'mapa',
	    view: _view
	});
	
		
	var _color='rgba(0,200,256,0.2)';
	var _colorb='rgba(0,0,100,1)';
	var _ancho='0.5';
	

	for(_idpan in _DataListado){
		
		_pandat=_DataListado[_idpan];
		if(_pandat.localizacion_epsg3857==''){continue;}
		
		_val=null;
		_haygeom='si';
			
		//console.log('+ um geometria: campo'+_campo+'. valor:'+_val);
		var _format = new ol.format.WKT();
		var _ft = _format.readFeature(_pandat.localizacion_epsg3857, {
	        dataProjection: 'EPSG:3857',
	        featureProjection: 'EPSG:3857'
	    });	   
		_ft.set('idloc',_idpan);
		//console.log(_color);
		_ancho=1.8;
		//console.log(_res.data.capa);
		
	    _estilo=asignarRepresentacion(_idpan);
	    _ft.setStyle(_estilo);//por ahora usamos el estilo del mapa
	        	    
	   	_SourceLocalizaciones.addFeature(_ft); 
	   	
	}
	console.log('aa');
	if(_haygeom=='si'){
		_ext= _SourceLocalizaciones.getExtent();	
		//console.log(_ext);		
		mapa.getView().fit(_ext, { duration: 1000 });			
	}
	console.log('ab');
	/*
	mapa.on('click', function(evt){   
		if(_mapaEstado=='dibujando'){return;}   	
	  	consultaPuntoRel(evt.pixel,evt);       
	});*/
	
	
	function consultaPuntoRel(pixel,_event) { 
		
		if(_mapaEstado=='dibujando'){return;}       
		//if(_Dibujando=='si'){return;}	
		
		_source_rel_sel.clear();
	    var feature = mapa.forEachFeatureAtPixel(pixel, function(feature, layer){
	        if(layer.get('name')=='relevamiento'){	        	
	          return feature;
	        }else{
	        	console.log('no');
	        }
	    });
	    if(feature==undefined){return;}
	    
	    _idloc=feature.get('idloc');
	    resaltarEnElMapa(_idloc);
			
	    //console.log(feature.getProperties());
	    formularLocalizacion(_idloc);
	      
	   //alert('hizo click en registro id:')
	}
	
	function limpiarSeleccionLoc(){
		_source_rel_sel.clear();
	}
	
	function reiniciarMapa(){
		_features=_SourceLocalizaciones.getFeatures();	
		for (i = 0; i < _features.length; i++) {		
			_sCargado.removeFeature(_features[i]);
		}
		//mostrarArea(parent._Adat);	
	}
	
	
}	
	
	
	


function asignarRepresentacion(_idl){	
	_alerta=_DataListado[_idl].zz_cache_alerta;
	
	
	_c=colorAlerta(_alerta);
	
	
	_color='rgba('+_c.r+','+_c.g+','+_c.b+',0.8)';
	_colorb='rgba(20,20,20,1)';		
	
	
	_ancho='0.5';
	_estilo =new ol.style.Style({
         image: new ol.style.Circle({
		       fill: new ol.style.Fill({color: _color}),
		       stroke: new ol.style.Stroke({color: _colorb,width: 0.8}),
		       radius: 5
		 }),
		 fill: new ol.style.Fill({color: _color}),
		 stroke: new ol.style.Stroke({color: _colorb,width: _ancho}),
		 zIndex:100,
		 text: new ol.style.Text({
	    	font: '12px Calibri,sans-serif',
	    	overflow: true,
	    	fill: new ol.style.Fill({
	      	color: '#000'
		    }),
		    textAlign:'left',
		    text: ' '+_idl+' ',
		    offsetX: 9,
		    offsetY: -8,
		    backgroundFill:new ol.style.Fill({color: 'rgb(255,255,255)'}),
		    backgroundStroke:new ol.style.Stroke({color: '#08afd9', width: 2,lineCap:'miter'})
		    
		 })
	});
	
	console.log(_color);
	return _estilo;
}




function dibujarReleMapa(){
	console.log('00');	
	_haygeom='no';
	_SourceLocalizaciones.clear();
	for(_nl in _DataPlanos[_IdPlanoActivo].localizaciones){
		_idl=_DataPlanos[_IdPlanoActivo].localizaciones[_nl];
		_ldat=_DataLocalizaciones[_idl];
		if(_ldat.locx==''||_ldat.locy==''){continue;}
		console.log('POINT('+_ldat.locx+' '+_ldat.locy+')');
		_geo='POINT('+_ldat.locx+' '+_ldat.locy+')';
		
		_val=null;
		_haygeom='si';
		
				
		//console.log('+ um geometria: campo'+_campo+'. valor:'+_val);
		var _format = new ol.format.WKT();
		var _ft = _format.readFeature(_geo, {
	        dataProjection: 'EPSG:3857',
	        featureProjection: 'EPSG:3857'
	    });	   
		_ft.set('idloc',_idl);
		//console.log(_color);
		_ancho=1.8;
		//console.log(_res.data.capa);
		
	    _estilo=asignarRepresentacion(_idl);
	    _ft.setStyle(_estilo);//por ahora usamos el estilo del mapa
	    
	    console.log('a');
	   	_SourceLocalizaciones.addFeature(_ft); 
	}
	console.log('b');
	if(_haygeom=='si'){
		_ext= _SourceLocalizaciones.getExtent();	
		//console.log(_ext);
	console.log('c');	
		mapa.getView().fit(_ext, { duration: 1000 });
			
	}
	console.log('d');	
	//geometryOrExtent
	
	/*
	mapa.on('pointermove', function(evt){
		if(_mapaEstado=='dibujando'){return;}   
        if (evt.dragging) {	
        	//console.log(evt);
        	//deltaX = evt.coordinate[0] - evt.coordinate_[0];
  			//deltaY = evt.coordinate[1] - evt.coordinate_[1];
			//console.log(deltaX);			
          return;
        }
        var pixel = mapa.getEventPixel(evt.originalEvent);
        sobreIndicador(pixel);
    });*/

	var sobreIndicador = function(pixel) {     
	 
		if(_mapaEstado=='dibujando'){return;}   
    	
        var feature = mapa.forEachFeatureAtPixel(pixel, function(feature, layer){
	        if(layer.get('name')=='indicador'){	        	
	          return feature;
	        }else{
	        	//console.log('no');
	        }
        });
        //console.log(feature.getProperties);
       //alert('señaló en registro id:')
    }
    
    
	console.log('e');	
	
}






var drawL={};
var _nnelem=0;
function accionEditarCrearGeometria(){    	
	
	mapa.removeInteraction(drawL);
    drawL = new ol.interaction.Draw({
        source: _source_rel_sel,
        type: "Point"
    });
    
    _mapaEstado='dibujando';        
    mapa.addInteraction(drawL);  
	_mapaEstado='dibujando';
	
	
	_source_rel_sel.on('change', function(evt){	
	
		if(_mapaEstado!='dibujando'){return;}
		if(_mapaEstado=='terminado'){_mapaEstado.estado='nuevaGeom';return;}	
		if(_mapaEstado.estado=='error'){
			_mapaEstado.estado='terminado';
			_source_rel_sel.clear();
			return;
		}
		_features=_source_rel_sel.getFeatures();
		_nnelem++;
		
		
		if(_features[1]!=undefined){
			_source_rel_sel.removeFeature(_features[0]);
		}
		
		_coord=_features[0].getGeometry().getCoordinates();

		document.querySelector('#formPAN [name="localizacion_epsg3857"]').value="POINT("+_coord[0]+" "+_coord[1]+")";
	
	});	
	
	alert('dibuje en el mapa la nueva geometría');
}




var selecP={};
var _nnelem=0;
function accionSeleccionarGeometria(){    
	_DataCapa.tipogeometria='Polygon';
	_typeGeom=_DataCapa.tipogeometria;
	mapa.removeInteraction(drawL);
    drawL = new ol.interaction.Draw({
        source: _source_rel_sel,
        type: _typeGeom
    });
    
    _mapaEstado='dibujando';        
    mapa.addInteraction(drawL);  
	
	
	_source_rel_sel.on('change', function(evt){	
	
		if(_mapaEstado!='dibujando'){return;}
	
		if(_mapaEstado=='terminado'){_mapaEstado.estado='nuevaGeom';return;}	
		if(_mapaEstado.estado=='error'){
			_mapaEstado.estado='terminado';
			_source_rel_sel.clear();
			return;
		}	
		
		_features=_source_rel_sel.getFeatures();
		var _format = new ol.format.WKT();
		_geometria=_format.writeGeometry(_features[0].getGeometry());
		
		_nnelem++;		
		guardarNuevaGeometria(_geometria,_nnelem);
		
		_mapaEstado='terminado';	
		_clon=_features[0].clone();
		_source_rele.addFeature(_clon);
		_clon.setId('nn'+_nnelem);
		
		_source_rel_sel.clear();
	
	});	
	
	alert('dibuje en el mapa la nueva geometría');
}






function resaltarEnElMapaPaneles(_idl){
	
	_haygeom='no';
	_source_rel_sel.clear();
	
	_ldat=_DataLocalizaciones[_idl];
	
	if(_ldat.locx===''||_ldat.locy===''){return;}
	_geo='POINT('+_ldat.locx+' '+_ldat.locy+')';
	
	//console.log('+ um geometria: campo'+_campo+'. valor:'+_val);
	var _format = new ol.format.WKT();
	var _ft = _format.readFeature(_geo, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
    });
    	    	    
   	_source_rel_sel.addFeature(_ft); 
	
	_ext= _source_rel_sel.getExtent();	
		
	_coord=[parseInt(_ldat.locx), parseInt(_ldat.locy)];
	
	console.log(_coord);
	mapa.getView().fit(_ext, {maxZoom:18, duration:1000});
	
}

