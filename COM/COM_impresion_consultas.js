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

 function cargarUnaFila(_id){
				
        var parametros = {
            "id" : _id
        };
        $.ajax({
            data:  parametros,
            url:   './COM/COM_consulta_fila.php',
            type:  'post',
            error: function (response){alert('error al contactar al servidor');},
            success:  function (response) {
				_res = PreprocesarRespuesta(response);
                        
                _Data=_res.data;
                mostrarCom();
				
                tinymce.init({ 
					selector:'textarea.mceEditable',
					plugins: "code image",
					menubar: "insert",
					image_caption: true,
					toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | code",					
					width : "615px",
					height : "280px",
					skin : "oxide",
					forced_root_block: "p",
					remove_trailing_nbsp : true,
					remove_trailing_brs: true,
					editor_deselector : "mceNoEditor",
					invalid_elements : "br",
					extended_valid_elements: "+@[campo]"
				});            
            }
        });
    }
    
    
