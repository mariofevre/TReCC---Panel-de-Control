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
function enviarFormularioUsuario(){
	
	
	_form=document.querySelector('#formusuario');
		_inps=_form.querySelectorAll('input');
		_params={};
		for(_in in _inps){
			if(typeof _inps[_in] != 'object'){continue;}
			if(_inps[_in].getAttribute('name')==undefined){
				continue;				
			}
			_name=_inps[_in].getAttribute('name');
			_params[_name]=_inps[_in].value;
		}
		_params['log']=_form.querySelector('[name="log"]').innerHTML;
		 $.ajax({
            data:  _params,
            url:   './PAN/PAN_ed_cambia_usuario.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
                //procesarRespuestaDescripcion(response, _destino);
                _res = PreprocesarRespuesta(response);               
                _estadodecarga='activo';
                          
            	_form=document.querySelector('#formusuario');
				_form.reset();
				_form.style.display='none';
				
			}
		})	
}




function crearPanel(){
	_form=document.querySelector('#formPAN');
	_inps= _form.querySelectorAll('input, textarea');
	
	_param={};
	for(_ni in _inps){
		if(typeof _inps[_ni] != 'object'){continue;}
		_n=_inps[_ni].getAttribute('name');
		_v=_inps[_ni].value;
		_param[_n]= _v;		
	}


	$.ajax({
		data:  _param,
		url:   './PAN/PAN_ed_crea_panel.php',
		type:  'post',
		success:  function (response) {
			_res = PreprocesarRespuesta(response);
			
			_url='./PAN_general.php?panel='+_res.data.nid;
			window.location.assign(_url);
		
		}			
	});

}


function consultarlistado(){
		
		var parametros = {
		};
		
		$.ajax({
			data:  parametros,
			url:   './PAN/PAN_listado_consulta.php',
			type:  'post',
			success:  function (response) {				
				_res = PreprocesarRespuesta(response);
				
				_UsuarioAcc=_res.data.acceso;
				_UsuarioTipo=_res.data.accesoTipo;
				_UsuarioDat=_res.data.usuarioDat;
				actualizarMenu();
					
				_DataListado=_res.data.paneles;
				_cont=document.querySelector('#contenidoextenso');
				
				_haylocalizaciones='no';
				for(_no in _res.data.panelesOrden){
					_pid=_res.data.panelesOrden[_no];
					_pdat=_res.data.paneles[_pid];
					
					if(_pdat.localizacion_epsg3857!=''){
						_haylocalizaciones='si';
					}
					
					_aaa=document.createElement('a');
					_aaa.setAttribute('class','paquete');
					_aaa.setAttribute('onmouseover','enfocar(this)');
					_aaa.setAttribute('idpan',_pid);
					_aaa.setAttribute('zz_cerrada',_pdat.zz_cerrada);
					_aaa.setAttribute('href','./PAN_general.php?panel='+_pid);
					_cont.appendChild(_aaa);
					
					_div=document.createElement('div');
					_div.setAttribute('class','texto');
					_div.innerHTML='<span class="idp">'+_pid+'</span>'+_pdat.nombre;
					_aaa.appendChild(_div);
					
					_div=document.createElement('div');
					_div.setAttribute('class','texto desc');
					_div.innerHTML=_pdat.descripcion;
					_aaa.appendChild(_div);
					
					_alerta=_pdat.zz_cache_alerta;
					
					if(_alerta!=''){
						
						_diva=document.createElement('div');
						_diva.setAttribute('id','alerta');
						_diva.title='Nivel de alerta, promedio promedio de los niveles de alerta de sus indicadores internos.';
						_aaa.appendChild(_diva);
						
						_min=document.createElement('span');
						_min.setAttribute('id','min');
						_min.innerHTML='0';
						_diva.appendChild(_min);
						
						
						_nivel=document.createElement('span');
						_nivel.setAttribute('id','nivel');
						_diva.appendChild(_nivel);
						
						_num=document.createElement('span');
						_num.setAttribute('id','num');
						_nivel.appendChild(_num);
						
						_barra=document.createElement('span');
						_barra.setAttribute('id','barra');
						_nivel.appendChild(_barra);
						
						_max=document.createElement('span');
						_max.setAttribute('id','max');
						_max.innerHTML='100';
						_diva.appendChild(_max);
						
						
						_num.innerHTML=_alerta+'%';
						
						_barra.style.width="calc("+_alerta+"% - 1px)";
						
						_rgb = colorAlerta(_alerta);
						_nivel.style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.4)';
						_barra.style.backgroundColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',0.7)';
						_barra.style.borderColor='rgba('+_rgb.r+','+_rgb.g+','+_rgb.b+',1)';	
					}
				}
				if(_haylocalizaciones=='si'){
					document.querySelector('body').setAttribute('mapeado','si');
					cargarMapaGeneral();
				}
			}
		});
	}
