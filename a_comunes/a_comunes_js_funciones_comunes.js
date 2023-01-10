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


function stickybar(){
	//esta función regula el comportamiento de la botonera inicial, para que permanezca visible al escrolear
	//activar al cargar html
	$(window).scroll(function(){
		var barra = $(window).scrollTop();
		var posicion =  (barra * .2);
		
		$('.page-header').css({
			'transform': 'translate3d(0px, '+ posicion + 'px, 0px)'
		});
		
		var navbar = document.querySelector(".botonerainicial");
		var sticky = navbar.offsetTop;// Get the offset position of the navbar
		
		//console.log(window.pageYOffset +'/'+ sticky);
		if (window.pageYOffset > sticky) {
			navbar.classList.add("fixed-top")
			navbar.classList.remove("navbar-transparent");
		} else {
			  
			navbar.classList.add("navbar-transparent")
			navbar.classList.remove("fixed-top");
		  }	 
	});
}



function PreprocesarRespuesta(response){	
	try {
        JSON.parse(response);
    }catch(_err){
        console.log(_err);
        alert('el servidor entregó un texto de formato inesperado');
        console.log(response);
        return;
    }
	
	_res = $.parseJSON(response);	
	for(_nm in  _res.mg){
        alert(_res.mg[_nm]);
    }
	for(_na in  _res.acc){
		if(_res.acc[_na]=='log'){LoguearAlVuelo(); return;}
		
		if(_res.acc[_na]=='inicio'){window.location.assign('./login.php');}
		if(_res.acc[_na]=='lista'){window.location.assign('./PAN_listado.php');}
		if(_res.acc[_na]=='loc'){window.location.assign(_res.loc);}
    }     
        
                   
	if(_res.res=='err'){
		 alert('error al consultar base de datos');
		 return false;
	}
	if(_res.res!='exito'){
		 alert('error al consultar base de datos');
		 return false;
	}	
	return _res;
}


function PreprocesarRespuestaFallida(_errorThrown, _textStatus, _jqXHR){	
	/*
	try {
        JSON.parse(response);
    }catch(_err){
        console.log(_err);
        alert('el servidor entregó un texto de formato inesperado');
        console.log(response);
        return;
    }*/
    
    alert('el servidor no pudo realizar la acción solicitada');
     
    _res={
		'_errorThrown':_errorThrown,
		'_textStatus':_textStatus,
		'_jqXHR':_jqXHR
	}
	
	return _res;
}



function LoguearAlVuelo(){
	
	_dialog=document.createElement('div');
	_dialog.setAttribute('id','cajalog');
	_dialog.setAttribute('class','cajalog');
	document.body.appendChild(_dialog);
	
	_tit=document.createElement('h1');
	_tit.innerHTML='Sesión caduca';
	_dialog.appendChild(_tit);
	
	_tit=document.createElement('p');
	_tit.innerHTML='Por favor vuelva a introducir sus datos, y repita la acción ejecutada';
	_tit.style.margin='2vw';
	_tit.style.fontSize='20px';
	
	_dialog.appendChild(_tit);
	
	_form=document.createElement('form');
	_form.setAttribute('onsubmit','event.preventDefault();enviarLoguearAlVuelo(this,event)');
	_dialog.appendChild(_form);
	
	_lab=document.createElement('label');
	_lab.innerHTML='nombre: ';
	_lab.style.width='calc(100% - 5px)';
	_form.appendChild(_lab);
	_lab.focus();
	
	_inp=document.createElement('input');
	_inp.setAttribute('name','log');
	_inp.style.width='100%';
	_lab.appendChild(_inp);
	_inp.focus();
	
	_lab=document.createElement('label');
	_lab.innerHTML='pass: ';
	_lab.style.width='calc(100% - 5px)';
	_form.appendChild(_lab);
	
	_inp=document.createElement('input');
	_inp.setAttribute('name','pass');
	_inp.setAttribute('type','password');
	_inp.style.width='100%';
	_lab.appendChild(_inp);
	
	
	
	_inp=document.createElement('input');
	_inp.setAttribute('name','panid');
	_inp.setAttribute('type','hidden');
	
	_pid=''
	if(typeof _PanelI !== 'undefined'){
		if(_PanelI>0){
			_pid=_PanelI;
		}
	}
	if(_pid==''){ //DEPRECAR
		if(typeof _PanId !== 'undefined'){
			if(_PanId>0){
				_pid=_PanId;
			}
		}
	}	
	_inp.value=_pid;
	_lab.appendChild(_inp);
	
	_inp=document.createElement('input');
	_inp.setAttribute('value','acceder');
	_inp.style.width='calc(100% - 5px)';
	_inp.style.margin='5px';
	
	_inp.setAttribute('type','submit');
	_form.appendChild(_inp);
	
}

function enviarLoguearAlVuelo(_this,_event){	
	_event.preventDefault();
	_parametros={
		'login':_this.querySelector('[name="log"]').value,
		'zz_pass':_this.querySelector('[name="pass"]').value,
		'panel':_this.querySelector('[name="panid"]').value,
		'modo':'alvuelo'
	}
	$.ajax({
		url:   './SIS/SIS_login_comprueba.php',
		type:  'post',
		data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			var _res = PreprocesarRespuesta(response);
			if(_res===false){return;}
			if(_res.res!='exito'){return;}
			
			_dial=document.querySelector('#cajalog');
			_dial.parentNode.removeChild(_dial);
			
			console.log(typeof Reincia);
			
			if (typeof Reincia !== "undefined"){
				Reincia();
			}else{
				window.location.reload();
			}
			
        }
    });
}

function CerrarSesion(){
	_parametros={};
	$.ajax({
		url:   './SIS/SIS_login_cerrarsesion.php',
		type:  'post',
		data: _parametros,
        error: function(XMLHttpRequest, textStatus, errorThrown){ 
                alert("Estado: " + textStatus); alert("Error: " + errorThrown); 
        },
		success:  function (response){
			var _res = PreprocesarRespuesta(response);
        }
    });	
}

