/**
* este archivo contiene código js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integración del Conocimiento en Obra
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

		

		
	///funciones para guardar archivos

	function resDrFile(_event){
		//console.log(_event);
		document.querySelector('#contenedorlienzo').style.backgroundColor='lightblue';
		document.querySelector('#contenedorlienzo > label').style.display='block';
	}	
	
	function desDrFile(_event){
		//console.log(_event);
		document.querySelector('#contenedorlienzo').removeAttribute('style');
		document.querySelector('#contenedorlienzo > label').removeAttribute('style');
	}
	
	
	var _nFile=0;	
	var xhr=Array();
	var inter=Array();
	function cargarCmp(_this){
		
		var files = _this.files;
		if(document.querySelector('#accion input[name="idacc"]').value<1){
			alert('error al enviar archivos');
			return;
		}				
		for (i = 0; i < files.length; i++) {
	    	_nFile++;
	    	console.log(files[i]);
			var parametros = new FormData();
			parametros.append('upload',files[i]);
			parametros.append('nfile',_nFile);
			
			parametros.append('idacc',document.querySelector('#accion input[name="idacc"]').value);
			
			var _nombre=files[i].name;
			_upF=document.createElement('p');
			_upF.setAttribute('nf',_nFile);
			_upF.setAttribute('class',"archivo");
			_upF.setAttribute('size',Math.round(files[i].size/1000));
			_upF.innerHTML=files[i].name;
			document.querySelector('#listadosubiendo').appendChild(_upF);
			
			_nn=_nFile;
			xhr[_nn] = new XMLHttpRequest();
			xhr[_nn].open('POST', './CNT/CNT_ed_guarda_adjunto.php', true);
			xhr[_nn].upload.li=_upF;
			xhr[_nn].upload.addEventListener("progress", updateProgress, false);
			
			
			xhr[_nn].onreadystatechange = function(evt){
				//console.log(evt);
				
				if(evt.explicitOriginalTarget.readyState==4){
					var _res = $.parseJSON(evt.explicitOriginalTarget.response);
					//console.log(_res);

					if(_res.res=='exito'){							
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.parentNode.removeChild(_file);							
						anadirAdjunto(_res.data.adjunto);
					}else{
						_file=document.querySelector('#listadosubiendo > p[nf="'+_res.data.nf+'"]');
						_file.innerHTML+=' ERROR';
						_file.style.color='red';
					}
					//cargaTodo();
					//limpiarcargando(_nombre);
				
				}
				
			}
			xhr[_nn].send(parametros);				
		    
		}			
	}
	
	function updateProgress(evt) {
	  if (evt.lengthComputable) {
	    var percentComplete = 100 * evt.loaded / evt.total;		   
	    this.li.style.width=Math.round(percentComplete)+"%";
	  } else {
	    // Unable to compute progress information since the total size is unknown
	  }
	}
	
	function eliminaAdjunto(_this,_event){
		_event.preventDefault();
		_event.stopPropagation();
		
		_tx=_this.parentNode.querySelector('.epigrafe').innerHTML;
		if(!confirm('¿Borramos este adjunto ('+_tx+')?.. ¿Segure?')){return;}
			
		_parametros = {
            'panid': _PanId,
            'idadj':_this.parentNode.getAttribute('idadj'),
            'idacc':document.querySelector('form#accion input[name="idacc"]').value
        };
        
        $.ajax({
            url:   './CNT/CNT_ed_borrar_adjunto.php',
            type:  'post',
            data: _parametros,
            error: function (response){alert('error al intentar contatar el servidor');},
            success:  function (response){
            	
                var _res = $.parseJSON(response);
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error durante la consulta en el servidor');return}
                
                _ele=document.querySelector('form#accion #adjuntos .adjunto[idadj="'+_res.data.idadj+'"]');
                _ele.parentNode.removeChild(_ele);
            }
        });    
	}
			
