/**
* este archivo contiene c�digo js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integraci�n del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2021 TReCC SA
* @source 		https://github.com/mariofevre/TReCC---Panel-de-Control/
* @license    	https://www.gnu.org/licenses/agpl-3.0-standalone.html GNU AFFERO GENERAL PUBLIC LICENSE, version 3 (agpl-3.0)
* Este archivo es parte de TReCC(tm) paneldecontrol y de sus proyectos hermanos: baseobra(tm), TReCC(tm) intraTReCC  y TReCC(tm) Procesos Participativos Urbanos.
* Este archivo es software libre: tu puedes redistriburlo 
* y/o modificarlo bajo los t�rminos de la "GNU AFero General Public License version 3" 
* publicada por la Free Software Foundation
* 
* Este archivo es distribuido por si mismo y dentro de sus proyectos 
* con el objetivo de ser �til, eficiente, predecible y transparente
* pero SIN NIGUNA GARANT�A; sin siquiera la garant�a impl�cita de
* CAPACIDAD DE MERCANTILIZACI�N o utilidad para un prop�sito particular.
* Consulte la "GNU General Public License" para m�s detalles.
* 
* Si usted no cuenta con una copia de dicha licencia puede encontrarla aqu�: <http://www.gnu.org/licenses/>.
*/

		



	
	///funciones para guardar archivos  //EVA

	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #upload').style.backgroundColor='lightblue';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#adjuntos #upload').removeAttribute('style');
	}
	
	function drag_start(_event,_this) {
        if(_excepturadragform=='si'){
            return;
        }
        //_event.stopPropagation();
        
        if(isResizing){console.log('resizing');return;}
        
        var crt = _this.cloneNode(true);
        crt.style.display = "none";
        _event.dataTransfer.setDragImage(crt, 0, 0);
        
        var style = window.getComputedStyle(_event.target, null);
         console.log(style.getPropertyValue("left"));
         console.log(parseInt(style.getPropertyValue("left"),10) - _event.clientX);
        _event.dataTransfer.setData(
            "text/plain",        
            (parseInt(style.getPropertyValue("left"),10) - _event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - _event.clientY)
        );
        
	} 
	
	function drag_over(event) {
	    event.preventDefault();
	    
	    var offset = event.dataTransfer.getData("text/plain").split(',');
	    // dm = document.getElementById('form_instancia');
	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    
	    return false; 
	} 
	
	function drop(event) { 
        if(event.target.getAttribute('id')=='uploadinput'){
            console.log('depositado en el cargador de archivos');
            return;
        }
        //console.log(event.target.getAttribute('id'));
        event.preventDefault();    
	    var offset = event.dataTransfer.getData("text/plain").split(',');
	    //dm = document.getElementById('form_instancia');
	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    
	    return false;
	}
	 
	 
	var dm = document.getElementById('form_instancia'); 
	document.body.addEventListener('dragover',drag_over,false); 
	document.body.addEventListener('drop',drop,false); 

	function cargarCmp(_this){
		
		var files = _this.files;
		if(document.querySelector('#form_instancia input[name="id_inst"]').value<1){
			alert('error al enviar archivos');
			return;
		}				
		for (i = 0; i < files.length; i++) {
	    	_nFile++;
	    	console.log(files[i]);
			var parametros = new FormData();
			_idinst=document.querySelector('#form_instancia input[name="id_inst"]').value;
			parametros.append('upload',files[i]);
			parametros.append('nfile',_nFile);
			parametros.append('id_inst',_idinst);
			
			var _nombre=files[i].name;
			_upF=document.createElement('p');
			_upF.setAttribute('nf',_nFile);
			_upF.setAttribute('class',"archivo");
			_upF.setAttribute('id_inst',_idinst);
       		_upF.setAttribute('subiendo',"si");
			_upF.setAttribute('size',Math.round(files[i].size/1000));
			
			_barra=document.createElement('div');
	        _barra.setAttribute('id','barra');
	        _upF.appendChild(_barra);
	        
	        _carg=document.createElement('div');
	        _carg.setAttribute('class','cargando');
	        _upF.appendChild(_carg);
	        
	        _img=document.createElement('img');
	        _img.setAttribute('src',"./img/cargando.gif");
	        _carg.appendChild(_img);
	        
	        _span=document.createElement('span');
	        _span.setAttribute('id',"val");
	        _carg.appendChild(_span);
	        
	        
	    	_upF.innerHTML+="<span id='nom'>"+files[i].name;+"</span>";
	    	_upF.title=files[i].name;;
			
			document.querySelector('#listadosubiendo').appendChild(_upF);
			
			_nn=_nFile;
			xhr[_nn] = new XMLHttpRequest();
			xhr[_nn].open('POST', './EVA/EVA_ed_guarda_adjunto.php', true);
			xhr[_nn].upload.li=_upF;
			xhr[_nn].upload.addEventListener("progress", updateProgress, false);			
			xhr[_nn].onreadystatechange = function(evt){
				//console.log(evt);				
				if(evt.explicitOriginalTarget != undefined){	//parafirefox
					if(evt.explicitOriginalTarget.readyState==4){
						_res = $.parseJSON(evt.explicitOriginalTarget.response);
					}
				}else{ //para ghooglechrome
	                if(evt.currentTarget.readyState==4){
	                    _res = $.parseJSON(evt.target.response);
	                }					
				}
				
				if(_res.res=='exito'){		
					
					if(document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]')!=null){
																	
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.parentNode.removeChild(_file);	
						anadirAdjunto(_res.data);
						
					}else{
                   		_file=document.querySelector('p.archivo[nf="'+_res.data.nf+'"]');								
	                    _file.parentNode.removeChild(_file);
					}
				}else{
					_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
					_file.innerHTML+=' ERROR';
					_file.style.color='red';
				}
				
			}
			xhr[_nn].send(parametros);				
		    
		}			
	}
	
	function updateProgress(evt) {
	  if (evt.lengthComputable) {
	  		var percentComplete = 100 * evt.loaded / evt.total;		 
			this.li.querySelector('#barra').style.width=Math.round(percentComplete)+"%";
			this.li.querySelector('#val').innerHTML="("+Math.round(percentComplete)+"%)";
	  } else {
	    // Unable to compute progress information since the total size is unknown
	  }  
	}


function guardaCapturaComoAdjunto(){
	_nFile++;
	_upF=document.createElement('p');
	_upF.setAttribute('nf',_nFile);
	_upF.setAttribute('class',"archivo");
	_upF.setAttribute('id_inst',_idinst);
	_upF.setAttribute('subiendo',"si");
	_upF.setAttribute('size','?');
	
	_barra=document.createElement('div');
	_barra.setAttribute('id','barra');
	_upF.appendChild(_barra);
	
	_carg=document.createElement('div');
	_carg.setAttribute('class','cargando');
	_upF.appendChild(_carg);
	
	_img=document.createElement('img');
	_img.setAttribute('src',"./img/cargando.gif");
	_carg.appendChild(_img);
	
	_span=document.createElement('span');
	_span.setAttribute('id',"val");
	_carg.appendChild(_span);
	
	
	_upF.innerHTML+="<span id='nom'>captura_pantalla.png</span>";
	
	document.querySelector('#listadosubiendo').appendChild(_upF);
	
	
	_form=document.querySelector('#form_instancia');
	
	
	var _parametros = {
		'panid':_PanelI,
		'id_inst':_form.querySelector('[name="id_inst"]').value,
		'nfile':_nFile,
		'imagen_str':_form.querySelector('#portapapeles').value,
		'tipo':''
    };
    
    _form.querySelector('#portapapeles').value='';
    			
    $.ajax({
        data:  _parametros,
        url:   './EVA/EVA_ed_guarda_imagen_como_adjunto.php',
        type:  'post',
        error:   function (response) {alert('error al contactar el servidor');},
        success:  function (response) {
            var _res = $.parseJSON(response);
            
            for(_nm in _res.mg){alert(_res.mg[_nm]);}
            for(_na in _res.acc){
                if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
            }                
            if(_res.res!='exito'){return;}
            
            	
			if(document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]')!=null){															
				_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
				_file.parentNode.removeChild(_file);	
				anadirAdjunto(_res.data);
			}else{
				_file=document.querySelector('p.archivo[nf="'+_res.data.nf+'"]');								
				_file.parentNode.removeChild(_file);
			}
        }
    });		
	
}
