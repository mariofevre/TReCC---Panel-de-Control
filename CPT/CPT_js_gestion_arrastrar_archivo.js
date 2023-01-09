/** este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
* @package    	TReCC(tm) paneldecontrol.
* @subpackage 	
* @author     	TReCC SA
* @author     	<mario@trecc.com.ar> <trecc@trecc.com.ar>
* @author    	www.trecc.com.ar  
* @copyright	2013-2023 TReCC SA
* @source 		https://github.com/mariofevre/TReCC---Panel-de-Control/
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
function drag_over(_event,_this){				
	_event.preventDefault();	
	_ini = _event.dataTransfer.getData("text/plain").split(',');
	if(_ini[0]==''){
		//sin datos tal vez un archivo, se asume que debe ser suspendida esta aación
		_this.setAttribute('estadodrag','archivo');
		return;
	}	
	return false; 
}

function drag_out(_event,_this){
	_event.preventDefault();			
	_this.setAttribute('estadodrag','');
	
}

function dropHandler(ev) {
	  console.log('File(s) dropped');
	  ev.preventDefault();
	  document.querySelector('#formadjuntarxlsx #carga span.upload').setAttribute('estadodrag','terminado');
	  // Prevent default behavior (Prevent file from being opened)
	  ev.preventDefault();
	  if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
		  // If dropped items aren't files, reject them
		  if (ev.dataTransfer.items[i].kind === 'file') {		      	
			_nFile++;
			var file = ev.dataTransfer.items[i].getAsFile();
			console.log('... file[' + i + '].name = ' + file.name);
			//crearCuadroCarga(file,_NFile);
			subirDocumento(file,_nFile);
		  }
		}
	  } else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			_nFile++;
			console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
			//crearCuadroCarga(ev.dataTransfer.files[i],_NFile);
			subirDocumento(ev.dataTransfer.file[i],_nFile);
		}
	  } 
	  // Pass event to removeDragData for cleanup
	  removeDragData(ev);
}
	
function crearCuadroCarga(_filedata,_nfile){
	/*
	_cuadro=document.querySelector('#cuadrocarga.modelo').cloneNode(true);
	document.querySelector('#columnaCarga').appendChild(_cuadro);
	_cuadro.removeAttribute('class');
	_cuadro.setAttribute('nfile',_nfile);
	console.log(_filedata);
	_cuadro.querySelector('#nombre').innerHTML=_filedata.name;
	_cuadro.querySelector('[name="nombre"]').value=_filedata.name;
	_cuadro.querySelector('#avance #numero').innerHTML='0 %';
	_cuadro.querySelector('#avance #barra').style.width='0%';*/
}

function removeDragData(ev) {
  console.log('Removing drag data');	
  if (ev.dataTransfer.items) {
	// Use DataTransferItemList interface to remove the drag data
	ev.dataTransfer.items.clear();
  } else {
	// Use DataTransfer interface to remove the drag data
	ev.dataTransfer.clearData();
  }
}


function subirDocumento(_filedata,_nfile){
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }      
    
    
	var parametros = new FormData();
	parametros.append('upload',_filedata);
	parametros.append('nfile',_nfile);

	var _nombre=_filedata.name;
	
	//_upF=document.querySelector('#columnaCarga [nfile="'+_nfile+'"]');
	_upF=document.createElement('a');
	document.querySelector('#formadjuntarxlsx #listadosubiendo').appendChild(_upF);
	_upF.setAttribute('nf',_nFile);
	_upF.setAttribute('class',"archivo");
	_upF.setAttribute('size',Math.round(_filedata.size/1000));
	_upF.innerHTML=_filedata.name;
	_im=document.createElement('img');
	_im.setAttribute('class','cargando');
	_im.setAttribute('src','./img/cargando.gif');
	_upF.appendChild(_im);

		
	_nn=_nfile;
	xhr[_nn] = new XMLHttpRequest();
	xhr[_nn].open('POST', './CPT/CPT_ed_adjunto_guarda_xlsx.php', true);
	xhr[_nn].upload.li=_upF;
	xhr[_nn].upload.addEventListener("progress", updateProgressMPP, false);

	xhr[_nn].onreadystatechange = function(evt){
		//console.log(evt);

		if(evt.explicitOriginalTarget.readyState==4){
			var _res = $.parseJSON(evt.explicitOriginalTarget.response);
			//console.log(_res);

			if(_res.res=='exito'){				
							
				_file=document.querySelector('#formadjuntarxlsx #listadosubiendo .archivo[nf="'+_res.data.nf+'"]');
				
				_file.setAttribute('estado','terminado');
				
				//crearFila(_res.data.conserva,'');
				_file=document.querySelector('#formadjuntarxlsx #carga').setAttribute('estado', 'inactivo');
				
				consultarEstructuraXLSX(_res);
									
			} else {
				_file=document.querySelector('#formadjuntarxlsx #listadosubiendo .archivo[nf="'+_res.data.nf+'"]');
				_file.innerHTML+=' ERROR';
				_file.style.color='red';
			}
		}
	};
	xhr[_nn].send(parametros);

}	

	/*			
function subirDocumentoMPP(_this){
	if(_HabilitadoEdicion!='si'){
        alert('su usuario no tiene permisos de edicion');
        return;
    }
  	// Get the selected files from the input.  
	var files = _this.files;		
	
    for (i = 0; i < files.length; i++) {    
        
        _nFile++;        
        console.log(files[i]);
        
       
        var parametros = new FormData();        
		parametros.append('upload',files[i]);
        parametros.append('nfile',_nFile);
        
        var _nombre=files[i].name;

        _nn=_nFile;        
        xhr[_nn] = new XMLHttpRequest();
        xhr[_nn].open('POST', './CPT/CPT_ed_adjunto_guarda_xlsx.php', true);
        xhr[_nn].upload.li=_upF;
        xhr[_nn].upload.addEventListener("progress", updateProgressMPP, false);
        
        _upF=document.createElement('a');
        _upF.setAttribute('nf',_nFile);
        _upF.setAttribute('class',"archivo");
        _upF.setAttribute('size',Math.round(files[i].size/1000));
        _upF.innerHTML=files[i].name;
        _im=document.createElement('img');
        _im.setAttribute('class','cargando');
        _im.setAttribute('src','./img/cargando.gif');
        _upF.appendChild(_im);
        document.querySelector('#listadosubiendo').appendChild(_upF);
                 
        xhr[_nn].onreadystatechange = function(evt){
            //console.log(evt);
            
            if(evt.explicitOriginalTarget.readyState==4){				
                var _res = $.parseJSON(evt.explicitOriginalTarget.response);
                //console.log(_res);
                
                if(_res.res=='exito'){	
											
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');	
                    _file.parentNode.removeChild(_file);
                    consultarPlanes();
                    
                }else{
                    _file=document.querySelector('#listadosubiendo > a[nf="'+_res.data.nf+'"]');
                    _im=_file.querySelector('img.cargando');
                    _im.parentNode.removeChild(_im);
                    
                    _file.innerHTML+=' ERROR';
                    _file.style.color='red';
                    for(_nm in _res.mg){_file.innerHTML+='<br>'+_res.mg[_nm];}
                }
                //cargaTodo();
                //limpiarcargando(_nombre);            
            }
        }
        xhr[_nn].send(parametros);		
    }
}	*/

function updateProgressMPP(evt) {
	if (evt.lengthComputable) {
		var percentComplete = 100 * evt.loaded / evt.total;		   
		this.li.style.width="calc("+Math.round(percentComplete)+"% - ("+Math.round(percentComplete)/100+" * 6px))";
	} else {
		// Unable to compute progress information since the total size is unknown
	} 
}



function formularValidacionDatosMPP(){
	
	
		
}
	  
