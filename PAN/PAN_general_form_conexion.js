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


function formularConecPAN(){
	if(_UsuarioAcc!='administrador'){
		alert('Su usuario de Panel de Control TReCC, no tiene capacidad para solicitar la conexión de este panel con otro.\nSolicite mayor capacidad a:\n \t trecc@trecc.com.ar \no llamando a los teléfonos:\n \t (+5411) 4343-5264 \n \t (+5411) 4343-9007');
		return;
	}
	_form=document.querySelector('#formConec');
	_form.reset();
	_form.style.display='block';		
}


function anularConexion(){
	if(!confirm('¿Anulamos la conexión con el panel indicado? \n \n'+ 'A partir de este momento se perderá el intercambió de datos entre ambos paneles')){return;}

	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formAnularConec [name='idpanelcon']").value,
		'idcon':document.querySelector("#formAnularConec [name='idcon']").value,
		'COMver':document.querySelector("#formAnularConec [name='COMver']").value,
		'DOCver':document.querySelector("#formAnularConec [name='DOCver']").value,
		'TARver':document.querySelector("#formAnularConec [name='TARver']").value,
		'terminos':document.querySelector("#formAnularConec [name='terminos']").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_anula_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            window.location.assign('./PAN_general.php');            
        }
    })	
}	



function aceptarConexion(){
	if(!confirm('¿Aceptamos la conexión con el panel indicado? \n \n'+ 'A partir de este momento el otro panel automáticamente tendrá acceso a las funciones tildadas en este formulario')){return;}
	

	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formAcepConec [name=idpanelcon]").value,
		'idpendiente':document.querySelector("#formAcepConec [name=idpendiente]").value,
		'COMver':document.querySelector("#formAcepConec [name=COMver]").value,
		'DOCver':document.querySelector("#formAcepConec [name=DOCver]").value,
		'TARver':document.querySelector("#formAcepConec [name=TARver]").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_acepta_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);
            
            window.location.assign('./PAN_general.php');
           
        }
    })	
}	

function iniciarConexion(){
	if(!confirm('¿Solicitamos la conexión con el panel indicado? \n \n'+ 'Si la solicitud es aceptada por un administrador del otro panel automáticamente tendrá acceso a las funciones tildadas en este formulario')){return;}
	
	_params={
		'zz_AUTOPANEL':_PanelI,
		'idpanelcon':document.querySelector("#formConec [name=idpanelcon]").value,
		'COMver':document.querySelector("#formConec [name=COMver]").value,
		'DOCver':document.querySelector("#formConec [name=DOCver]").value,
		'TARver':document.querySelector("#formConec [name=TARver]").value
	}
	
	$.ajax({
        data:  _params,
        url:   './PAN/PAN_ed_conec_solicita_panel.php',
        type:  'post',
        success:  function (response) {
            //procesarRespuestaDescripcion(response, _destino);
            _res = PreprocesarRespuesta(response);

               window.location.assign('./PAN_listado.php');
            
        }
    })
}
