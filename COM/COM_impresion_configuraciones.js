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


function actualizarCSS(_css){
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_css;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
	}  
	
function edicionCss(){
		
		_textarea=document.querySelector('#editorFormato textarea[name="css"]');
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormato #guardacss').setAttribute('estado','encendido');
			document.querySelector('#editorFormato #cancelacss').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');
			_textarea.value=_Data.comunicacion.CSS;			
		}else{	
			document.querySelector('#editorFormato #guardacss').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelacss').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			_textarea.value='';				
		}
		
	}
	
	function tomarCssTextoPre(_event,_this){     	
	   	
	   	if (_event.keyCode == 9){
	   	 	_event.preventDefault();
	   	 	
	   	 	var start = _this.selectionStart;
		    var end = _this.selectionEnd;
		
		    // set textarea value to: text before caret + tab + text after caret
		    _nuevo=	_this.value.substring(0, start)
		    		+ "\t"
		            + _this.value.substring(end);
			_this.value=_nuevo;
		    // put caret at right position again
		    _this.selectionStart = 
		    _this.selectionEnd = start + 1;
	   	} 
	   	      	
     	
     }	
     
     
     function tomarCssTextoPost(_event,_this){
     	_css= _this.value;
     	actualizarCSS(_css);
     }	
     
     function cancelarCss(){
     	_textarea=document.querySelector('#editorFormato textarea[name="css"]');
     	_textarea.value=_Data.CSS;
     	actualizarCSS(_Data.comunicacion.CSS);
     }
     
     function guardarCss(){
     	_textarea=document.querySelector('#editorFormato textarea[name="css"]');
     	
     	 var parametros = {
            "com-text-css" : _textarea.value,
            "zz_AUTOPANEL" : _PanelI
        };			
        
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-css.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                _Data.CSS=_res.data.CSS;
                _Data.pieCSS=_res.data.pieCSS;                
                  
                edicionCss();    
            }
        });
    }

	function edicionHTML(){
		_textarea=document.querySelector('#editorFormato textarea[name="HTML"]');		
		_editor = tinymce.get('editorHTML'); // use your own editor id here - equals the id of your textarea
			
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_Data.comunicacion.CSS;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
		
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormato #guardahtml').setAttribute('estado','encendido');
			document.querySelector('#editorFormato #cancelahtml').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');	
			document.querySelector('#mceu_14').setAttribute('estado','encendido');	
			_editor.setContent(_Data.comunicacion.encabezadoHTML);	
					
		}else{	
			document.querySelector('#editorFormato #guardahtml').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelahtml').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			document.querySelector('#mceu_14').setAttribute('estado','apagado');	
			_editor.setContent('');
		}
	}
	
	function guardarHtml(){
     	_editor = tinymce.get('editorHTML');
     	var parametros = {};
        parametros["com-text-encabezado-"+_Data.comunicacion.sentido] = _editor.getContent();
        parametros["zz_AUTOPANEL"]=_PanelI;
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-encabezado-'+_Data.comunicacion.sentido+'.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                cargarUnaFila(_IdCom);
            }
        });
     }
     	
     function cancelarHtml(){
     	_editor = tinymce.get('editorHTML');
     	_editor.setContent(_Data.encabezadoHTML);
     }
     	
     	
     	
	function edicionHTMLpie(){
		_textarea=document.querySelector('#editorFormato textarea[name="HTMLpie"]');		
		_editor = tinymce.get('editorHTMLpie'); // use your own editor id here - equals the id of your textarea
			
		_styleviejo=document.querySelector('#cssPersonalizado');
		_styleviejo.parentNode.removeChild(_styleviejo);
		
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML =_Data.comunicacion.CSS;
		_style.setAttribute('id','cssPersonalizado')
		document.getElementsByTagName('head')[0].appendChild(_style);
		
		_style2 = _style.cloneNode(true);
		//document.querySelector("#editorHTML_ifr").contentWindow.document.querySelector('head').appendChild(_style2);
		_head=$("#editorHTML_ifr").contents().find('head');
		_head.append(_style2);
		
		
		if(_textarea.getAttribute('estado')=='apagado'){
			document.querySelector('#editorFormato #guardahtmlpie').setAttribute('estado','encendido');
			document.querySelector('#editorFormato #cancelahtmlpie').setAttribute('estado','encendido');
			_textarea.setAttribute('estado','encendido');	
			document.querySelector('#mceu_42').setAttribute('estado','encendido');	
			_editor.setContent(_Data.comunicacion.pieHTML);	
					
		}else{	
			document.querySelector('#editorFormato #guardahtmlpie').setAttribute('estado','apagado');
			document.querySelector('#editorFormato #cancelahtmlpie').setAttribute('estado','apagado');
			_textarea.setAttribute('estado','apagado');
			document.querySelector('#mceu_42').setAttribute('estado','apagado');	
			_editor.setContent('');
		}
	}
	
	function guardarHtmlpie(){
     	_editor = tinymce.get('editorHTMLpie');
     	var parametros = {};
        parametros["com-text-pie-"+_Data.comunicacion.sentido]= _editor.getContent();
        parametros["zz_AUTOPANEL"]=_PanelI;
        $.ajax({
            data:  parametros,
            url:   './PAN/PAN_ed_config_com-text-pie-'+_Data.comunicacion.sentido+'.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                try{_res = $.parseJSON(response);}catch(e){console.log(e);alert('error al interpretar la respuesta del servidor');return;}
                for(_nm in _res.mg){alert(_res.mg[_nm]);}
                if(_res.res!='exito'){alert('error al consultar la base de datos');return;}                
                cargarUnaFila(_IdCom);
            }
        });
     }
     	
     function cancelarHtmlpie(){
     	_editor = tinymce.get('editorHTMLpie');
     	_editor.setContent(_Data.pieHTML);
     }


	function login_insitu(){
		_ifr=document.createElement('iframe');
		_ifr.setAttribute('id','logeadorportatil');
		_ifr.setAttribute('src','./login_mini.php');
		
	}
