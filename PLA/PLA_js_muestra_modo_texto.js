/** este archivo contiene c�digo js del proyecto TReCC(tm) paneldecontrol. Plataforma de Integraci�n del Conocimiento en Obra
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

//generador HTML para mod fichas
   	
function generarTexto(_data){	
	
	_cont=document.querySelector('#contenidos');
	_cont.innerHTML='';
	_Actores=_data.Actores;
	_CAT =_data.CAT;
						
	for(_n1 in _data.PLA.PLAn1.componentes){
	_n1id = _data.PLA.PLAn1.componentes[_n1].id;
	_n1d = _data.PN1[_n1id];
	
		creartexto(_n1d,'','','PLAn1');	
		
		for(_n2 in _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes){
		_n2id = _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].id;
		_n2d = _data.PN2[_n2id];
		
		creartexto(_n1d,_n2d,'','PLAn2');	
		
			for(_n3 in _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes){
				/*console.log('n1:'+_n1);
				console.log('n2:'+_n2);
				console.log('n3:'+_n3);*/
				_n3id = _data.PLA.PLAn1.componentes[_n1].PLAn2.componentes[_n2].PLAn3.componentes[_n3].id;
				_n3d = _data.PN3[_n3id];
				
				creartexto(_n1d,_n2d,_n3d,'PLAn3');	
			}  	
		}
	}  		
}   
	
	               	
	
function creartexto(_datan1,_datan2,_datan3,_nivel){
	
	_nivelA={};
	_datan={};
	_nivelA[0] = _nivel;
	if(_nivel=='PLAn3'){
		_datan[0] = _datan3;		
		_datan[-1] = _datan2;
		_nivelA[-1]='PLAn2';
		
		_datan[-2] = _datan1;
		_nivelA[-2]='PLAn1';
		
		_tag='h3';
	}else if(	_nivel=='PLAn2'){
		//_datan[1] = _datan3;
		_datan[0] = _datan2;
		_datan[-1] = _datan1;
		_nivelA[-1]='PLAn1';
		
		_datan[-2] = null;
		
		_tag='h2';
	}else if(	_nivel=='PLAn1'){
		//_datan[2] = _datan3;
		//_datan[1] = _datan2;
		_datan[0] = _datan1;
		_datan[-1] = null;
		_datan[-2] = null;
		
		_tag='h1';
	}

	_ficha=document.createElement('div');
	_ficha.setAttribute('iddb',_datan[0].id);
	_ficha.setAttribute('tadb',_nivel);
	_ficha.setAttribute('nivel',_nivel);
	_ficha.setAttribute('class','texto');
	document.querySelector('#page #contenidos').appendChild(_ficha);

	_hr=document.createElement('hr');
	_ficha.appendChild(_hr);
	
	
	_nom=document.createElement(_tag);
	_nom.setAttribute('class','nombre');
	_nom.innerHTML="<div class='color' style='background-color:"+_datan[0].CO_color+"'>"+_NomN[_nivelA[0]]+" "+_datan[0].numero+':  '+_datan[0].nombre+"</span></div>";
	_ficha.appendChild(_nom);
	
	
	if(_datan[-2]!=null){
		_n1div=document.createElement('p');
		_n1div.setAttribute('class','n1');
		_n1div.innerHTML="<div class='color' style='background-color:"+_datan[-2].CO_color+"'>pertenece a "+_NomN[_nivelA[-2]]+"<b> "+_datan[-2].numero +"</b> : <span class='tx'>"+ _datan[-2].nombre+'</span></div>';
		_ficha.appendChild(_n1div);
	}
	
	if(_datan[-1]!=null){
	_n2div=document.createElement('p');
	_n2div.setAttribute('class','n2');
	_n2div.innerHTML="<div class='color' style='background-color:"+_datan[-1].CO_color+"'>pertenece a "+_NomN[_nivelA[-1]]+"<b> "+_datan[-1].numero +"</b> : <span class='tx'>"+ _datan[-1].nombre+'</span></div>';
	_ficha.appendChild(_n2div);
	}
	
	
		
	_res=document.createElement('p');
	_res.innerHTML="<b>responsable: </b>";
	_ficha.appendChild(_res);
	
	
	
	if(_datan[0].id_p_GRAactores==''){_datan[0].id_p_GRAactores=-1;}
	if(_datan[-1]!=null){if(_datan[-1].id_p_GRAactores==''){_datan[-1].id_p_GRAactores=-1;}}
	if(_datan[-2]!=null){if(_datan[-2].id_p_GRAactores==''){_datan[-2].id_p_GRAactores=-1;}}
	
	_act='';
	if(_Actores[_datan[0].id_p_GRAactores]!=undefined){
		_act=_Actores[_datan[0].id_p_GRAactores].nombre+ " "+_Actores[_datan[0].id_p_GRAactores].apellido;		
	}
	
	if(_act==''){
		if(_datan[-1]!=null){
			if(_Actores[_datan[-1].id_p_GRAactores]!=undefined){	
				_act=_Actores[_datan[-1].id_p_GRAactores].nombre+ " "+_Actores[_datan[-1].id_p_GRAactores].apellido+' <span class="mini">(de nivel superior)</span>';		
			}
		}	
	}	
	if(_act==''){
		if(_datan[-2]!=null){
			if(_Actores[_datan[-2].id_p_GRAactores]!=undefined){	
				_act==_Actores[_datan[-2].id_p_GRAactores].nombre+ " "+_Actores[_datan[-2].id_p_GRAactores].apellido+' <span class="mini">(de nivel superior)</span>';
			}
		}
	}
	_res.innerHTML+=_act;
	
	_est=document.createElement('p');
	_est.setAttribute('class','estado');
	_est.innerHTML="<b>estado:</b> ";
	if(_datan[0].estados[0]!=undefined){
	_est.innerHTML+=_datan[0].estados[0].nombre;
	_est.innerHTML+=" ("+_datan[0].estados[0].desde+")";
	}	
	_ficha.appendChild(_est);
	
	_des=document.createElement('p');
	_des.setAttribute('class','descripcion');
	_des.innerHTML="<b>descripci�n: </b><br> "+_datan[0].descripcion.replace('---','');
	_ficha.appendChild(_des);
			
	_col2=document.createElement('p');
	_col2.setAttribute('class','columna2');
	_ficha.appendChild(_col2);
			
	_fot=document.createElement('p');		
	_fot.setAttribute('class','portafoto');
	_col2.appendChild(_fot);
		
	if(Object.keys(_datan[0].documentos).length>0){
		for(_na in _datan3.documentos){
			if(typeof _datan3.documentos[_na] != 'object'){continue;}							
			_adat=_datan[0].documentos[_na];							
			
			if(_adat.mostrar=='si'){
				_aaa=document.createElement('img');
				_aaa.setAttribute('src',_adat.FI_documento);
				_fot.appendChild(_aaa);	
				_aaa=document.createElement('div');
				_aaa.setAttribute('class','alineaimg');
				_fot.appendChild(_aaa);	
				break;
			}			
		}
	}
	
	/*
	_catini=0;
	_catfin=0;
	if(
		_DatosCategorias.estandar[1].usadoennivel['PLAn3']!=undefined
		&&
		_DatosCategorias.estandar[2].usadoennivel['PLAn3']!=undefined
	){
		_catini=_DatosCategorias.estandar[1].usadoennivel['PLAn3'];
		_catfin=_DatosCategorias.estandar[2].usadoennivel['PLAn3'];
		
		_duracion=_VariablesEstandar._mes_max-_VariablesEstandar._mes_min;
		
		_cron=document.createElement('div');
		_cron.setAttribute('class','cronograma');
		_cron.innerHTML='<h3>Cronograma (meses activo)</h3>';
		_col2.appendChild(_cron);
		
		_cont=document.createElement('div');
		_cont.setAttribute('class','contenido');
		_cron.appendChild(_cont);
		
		_salto=1;
		//ancho 300px
		if((280/(_duracion+2))<20){
			_salto=2;
		}
		
		_ancho=280/(_duracion+2);		
		_s=0;		
		
		for(i=_VariablesEstandar._mes_min;i<_VariablesEstandar._mes_max+1;i++){
			_s++;
			if(_s==_salto){_s=0}
			if(i==0){_s=1;}
			if(i==_VariablesEstandar._mes_max){_s=1;}
			if(0-i<_salto&&0-i>0){_s=0;}
			if(_VariablesEstandar._mes_max-i<_salto&&_VariablesEstandar._mes_max-i>0){_s=0;}
								
			_mes=document.createElement('div');
			_mes.setAttribute('class','mes');
			_mes.style.width=_ancho+'px';
			_cont.appendChild(_mes);
			
			_eti=document.createElement('div');
			_eti.setAttribute('class','eti');
			_eti.style.width=_ancho;
			if(_s=='1'){
				_eti.innerHTML=i
				_eti.style.borderLeft='1px solid #000';
			}						
			_mes.appendChild(_eti);
			
			_barra=document.createElement('div');
			_barra.setAttribute('class','barra');
			_barra.style.width=_ancho;
			
			if(_datan[0].categorias[_catini]!=undefined
				&&
				_datan[0].categorias[_catfin]!=undefined
			){
				if(
					i>=_datan[0].categorias[_catini]
					&&
					i<_datan[0].categorias[_catfin]
				){
					_barra.setAttribute('estado','activa');
				}
			}			
			_mes.appendChild(_barra);
		}		
	} 	 	 	
	*/
	
	
	_cat=document.createElement('div');		
	_cat.setAttribute('class','categorias');
	_ficha.appendChild(_cat);
	
	for(_nc in _CAT[_nivel]){
		_vc = _CAT[_nivel][_nc];
		
		/*
		if(_catfin!=undefined){
			if(_nc==_catfin){
				continue;//esta categor�a ya fue representada en el cronograma
			}
		}
		if(_catini!=undefined){
			if(_nc==_catini){
				continue;//esta categor�a ya fue representada en el cronograma
			}
		}*/
		
		_divC=document.createElement('p');
		_divC.setAttribute('class','categoria');
		_cat.appendChild(_divC);
		
		_divS=document.createElement('b');
		_divS.innerHTML=_vc.nombre+': ';
		_divC.appendChild(_divS);
			/*
		for(_Kv in _datan[0].categorias[_nc]){
			_Vv=_datan[0].categorias[_nc][_Kv];
			
			_divV=document.createElement('div');
			_divV.setAttribute('class','tx');
			_divC.innerHTML=_Vv;
		}
		*/
			
		_Vv=_datan[0].categorias[_nc];
		if(_Vv!=undefined){
			_e=_Vv.split('---');
				if(_e.length>1){
					_valor='<ul>';
					for(_en in _e){
							_valor+='<li>'+_e[_en]+'</li>';					
					}
					_valor+='</ul>';
					_Vv=_valor;
				}
				console.log(_Vv);
			_divC.innerHTML+=_Vv;
		}
	}
}
