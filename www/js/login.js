// LOGIN JS - SUDI V3 | Mayo 2015 | Upgrade Diseño Interactivo

// CONFIGURABLE

var debugMode = true;
var serverSource = 'remote'; // <-- Fuente del proyecto
//var serverSource = 'local'; // <-- Fuente del proyecto

var rootPath = (serverSource === 'local') ? './' : 'https://armoniaestetica.com/';
var phpValidate = rootPath+'_sudiv3/ar_engine/login_validate_ios.php';

// Touch or Click Definimos si se usará click o Touch según disponibilidad // touchstart
	var clickHandler = ('ontouchstart' in document.documentElement ? "touchend" : "click");
	var touchmoved;
	if ('ontouchstart' in document.documentElement){ document.addEventListener("touchstart", function(){}, false); /*var touchSet = true;*/ }

(debugMode) ? console.log("iniciado ok") : '';

// Function - GET ACCESS
	//Si se otorga el acceso, se realiza la siguiente acción:
	
	function getLoginAcess(userCompanyData) {
		// Aquí va la acción a seguir (eje. Reload Location)
		// Aquí va la acción a seguir (eje. Reload Location)
			
		var id_pat = userCompanyData[0] ;    //id del paciente
		var mail_pat = userCompanyData[1];	 //mail del paciente
		var pass_pat = userCompanyData[2];	 //pass del paciente

		 $.cookie("id_pat", id_pat, { expires : 30 });
		 var cookieId = $.cookie("id_pat");
		 (debugMode) ? console.log(cookieId) : '';

		 $.cookie("mail_pat", mail_pat, { expires : 30 });
		 var cookieMail = $.cookie("mail_pat");
		 (debugMode) ? console.log(cookieMail) : '';

		 $.cookie("pass_pat", pass_pat, { expires : 30 });
		 var cookiePass = $.cookie("pass_pat");
		 (debugMode) ? console.log(cookiePass) : '';


		
		   setTimeout(function() {
			 modal.hide();
		   }, 2000);
		   setTimeout(function() {
			 var url = "home.html";
			 window.location.replace(url);
			 //document.querySelector('#myNavigator').resetToPage("home.html");
		   }, 500);
		   
	}

	//Si se da click en # do_logout, se realiza la siguiente acción.
	function getLogOut() {
		
		//Aquí va la instrucción de como cerrar sesión.
		// Aquí va la acción a seguir (eje. Reload Location)
		var modal = document.querySelector('ons-modal');
		   modal.show();
		   setTimeout(function() {
			 modal.hide();
		   }, 2000);
		   setTimeout(function() {
			 var url = "index.html";
			 window.location.replace(url);
			 //document.querySelector('#myNavigator').resetToPage("home.html");
		   }, 2000);
	}

	

// V A L I D A T E   S E S S I O N
	// validamos si existe una sesión de usuario.
function validate_phpSession() {

		(debugMode) ? console.log("revisando sesion...") : '';
		
		 var cookieIdAutologin = $.cookie("id_pat");
		 (debugMode) ? console.log(cookieIdAutologin) : '';
		
		 var cookieMailAutologin = $.cookie("mail_pat");
		 (debugMode) ? console.log(cookieMailAutologin) : '';

		 var cookiePassAutologin = $.cookie("pass_pat");
		 (debugMode) ? console.log(cookiePassAutologin) : '';

		 $sessionData = new Array(cookieIdAutologin,cookieMailAutologin,cookiePassAutologin);
		 (debugMode) ? console.log($sessionData) : '';

		 if ( $.cookie("id_pat") != '' ) {

		 		getLoginAcess($sessionData);
		 }else{
		 	console.log('No hay sesión activa');
			// $('#page_principal').css('opacity', '1');
		 }
	 		
}


/* FIN DE CONFIGURABLE */

var init_status = false; // <-- Indica si se ha iniciado sesión.
var clickHandler = ('ontouchstart' in document.documentElement ? "touchend" : "click");
var msgTimer; // <-- Temporizador para el mensaje 
var time_session; // <-- Monitor de sessión una ves iniciada esta.

// Envir el formulario al hacer click en el botón.
$(document).on(clickHandler,'#submit_login',function(){
	"use strict";
	(debugMode) ? console.log("Click en 'enviar'") : '';	

	$('#login_form').submit();
	
});


// Click en "Olvido su Password"
		$('#forget_pass').bind(clickHandler, function(e) {
        	
			// Si vamos a recuperar password
			if($(this).data('request') == "0"){
				$(this).data('request','1');
				$(this).html('Cancelar');
				$('#submit_login').html('Enviar');
				$('#login_user').attr('placeholder','Capture su correo para recuperar password');
				$('#login_user').val('');
				showMsgError($('.error_login'),'Capture su correo electrÃ³nico:','#FFF');
				
			// Si vamos a cancelar	
			}else{
				$(this).data('request','0');
				$(this).html('Recuperar acceso');
				$('#submit_login').html('Ingresar');
				$('#login_user').attr('placeholder','Correo');
			}
			$(this).toggleClass('cancel');
			$('#login_password_box').toggleClass('closed');
        });
		

		
		


$(document).on('submit','#login_form',function(){
	"use strict";
	
	//Tipo: typeOfSubmit = 0) Login 1) Solicitud de cambio de password 2)Establecer nuevo password
	var modal = document.querySelector('ons-modal');
	var typeOfSubmit = 0;
			
			// Si se requiere el campo
			if(typeOfSubmit != 2){
				var lenUser = ($('#login_user').val().length >= 4 ) ? 1 : 0 ;
			}else{
				var lenUser = 1;	
			}
			var lenPass = ($('#login_password').val().length >= 4 ) ? 1 : 0 ;
			
			// SI - procede a enviar el formulario
			if((lenUser + lenPass == 2) || (typeOfSubmit == 1)){
			
				// Definimos el tipo de formulario
				var loginPath = phpValidate+'?method=validate_login';
				
				// Variable que contiene la solicitud
				var request;

				//Abortamos cualquier solicitud actual
				if (request){ request.abort(); }
				
				// Establecemos la variable del Formulario
				var $form = $(this);
			
				// Seleccionamos todos los posibles inputs
				var $inputs = $form.find("input, select, button, textarea, checkbox");
			
				// Serializamos la información del Formulario
				var serializedData = $form.serialize();
			
				// Deshabilitamos los inputs mientras se ejecuta el Ajax
				$inputs.prop("disabled", true);
				var login_btn_text = $('#submit_login').html();
				
				// animation PENDING
				modal.show();
				
				(debugMode) ? console.log('serializedData: ' + serializedData) : '';
				// Disparamos la solicitud (request) 
				request = $.ajax({
					url: loginPath,
					type: "post",
					data: serializedData
				});
				
				// Conexión exitosa
				request.done(function (response, textStatus, jqXHR){
					// Si es para Login
					switch(typeOfSubmit) {
						
						// Si es para recuperar password	
						case 1:
							
							if(response !== 'unsuccessful'){
								
								var request_response = $.parseJSON(response);
								
								var requestMsg = '<i class="fa fa-envelope" style="color:#83DF83;"></i> ' + request_response[0] + ', hemos enviado un correo a "' + request_response[1] + '"';
								
								//showMsgError($('.error_login'),requestMsg,'#FFF');
								ons.notification.toast({message: requestMsg, timeout: 1000});
								
								$('#forget_pass').trigger('click');
								$('#submit_login').html('Enviar');
								
								$inputs.prop("disabled", false);
								
							
							}else {
								
								// Mostramos el mensaje de error
								//showMsgError($('.error_login'),'<i class="fa fa-warning" style="color:#F00;"></i> No hemos encontrado el usuario','#FFF');
								ons.notification.toast({message: 'No hemos encontrado el usuario', timeout: 1000});
								// Reestablecemos el login
								$inputs.prop("disabled", false);
								$('#submit_login').html(login_btn_text);
							}
							

							break;
						
						// Si es para establecer nuevo password	
						case 2:
						
						
							if(response != 'unsuccessful'){
								
								//showMsgError($('.error_login'),'Password cambiado correctamente. <a href="'+rootPath+'">Iniciar sesión</a>','#FFF',true);
								
								ons.notification.toast({message: 'Password cambiado correctamente.', timeout: 1000});
								
								$('#login_password_box').remove();
								$('.login_buttons').remove();
															
							}else {
								
								// Mostramos el mensaje de error
								ons.notification.toast({message: 'El código de solicitud ya ha sido usado o ha caducado', timeout: 1000});
								// Reestablecemos el login
								$inputs.prop("disabled", false);
								$('#submit_login').html(login_btn_text);
							}
						break;	
							
						default:
							(debugMode) ? console.log('Resultado: ' + response) : '';
							if(response !== 'unsuccessful'){
								var session_response = $.parseJSON(response);
								
								// getLoginAcess();
								getLoginAcess(session_response);
								
								// Reestablecemos el login
								$inputs.prop("disabled", false);
								$('#submit_login').html(login_btn_text);
								
							// Si no es correcto
							}else {
								// Mostramos el mensaje de error
								//showMsgError($('.error_login'),'Acceso denegado','#F00');
								modal.hide();
								ons.notification.toast({message: 'Datos incorrectos', timeout: 1000});		
								
								// Reestablecemos el login
								$inputs.prop("disabled", false);
								$('#submit_login').html(login_btn_text);
							}
							break;
					}
				});
			
				// Si falla la conexión
				request.fail(function (jqXHR, textStatus, errorThrown){
					console.error(
						"Han ocurrido los siguientes errores: "+
						textStatus, errorThrown
					);
				});
			
				// Habilitamos de nuevo los botones
				request.always(function () {
					
				});
		}else{ // Fin de <-- Si hay suficientes caracteres en el formulario
			
			if(!lenUser){ $('#login_user').addClass('input_required'); }
			if(!lenPass){ $('#login_password').addClass('input_required'); }
			//showMsgError($('.error_login'),'Faltan datos para ingresar','#FFF');
			ons.notification.toast({message: 'Faltan datos para ingresar', timeout: 1000});
			
		}
		
		// No enviar el formulario
		return false; 
		});

//Registro de nuevo usuario
$(document).on('submit','#register_form', function(){
	
		"use strict";

		var lenUser = ($('#login_register_user').val().length >= 4 ) ? 1 : 0 ;
		var lenPass = ($('#login_register_password').val().length >= 4 ) ? 1 : 0 ;
	console.log($('#login_register_password').val() + ' / ' + $('#login_register_password_confirm').val());
	// SI - Las contraseñas coinciden
	if( $('#login_register_password').val() == $('#login_register_password_confirm').val() ) {
		// SI - procede a enviar el formulario
		
		console.log("Iguales");
		
		if(lenUser + lenPass === 2 ){

			// Definimos el tipo de formulario
			var loginPath = phpValidate+'?method=register_user';

			// Variable que contiene la solicitud
			var request;

			//Abortamos cualquier solicitud actual
			if (request){ request.abort(); }

			// Establecemos la variable del Formulario
			var $form = $(this);

			// Seleccionamos todos los posibles inputs
			var $inputs = $form.find("input, select, button, textarea, checkbox");

			// Serializamos la información del Formulario
			var serializedData = $form.serialize();

			// Deshabilitamos los inputs mientras se ejecuta el Ajax
			$inputs.prop("disabled", true);
			var register_btn_text = $('#get_register').html();
			
			// animation PENDING
			(debugMode) ? console.log('serializedData: ' + serializedData) : '';
			// Disparamos la solicitud (request) 
			request = $.ajax({
				url: loginPath,
				type: "post",
				data: serializedData
			});

			// Conexión exitosa
			request.done(function (response, textStatus, jqXHR){
				console.log(response);
				if ( response !== 'unsuccessful' ){ // $.isNumeric(response) 
					ons.notification.toast({message: 'Registro exitoso', timeout: 2000});
					//console.log(response);
					/*var session_response = $.parseJSON(response);
					getLoginAcess();*/
					$('#push-return').trigger('click');
					
				} else {
					ons.notification.toast({message: response, timeout: 2000});

					// Reestablecemos el login
					$inputs.prop("disabled", false);
					$('#get_register').html(register_btn_text);
				}
			});

			// Si falla la conexión
			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error(
					"Han ocurrido los siguientes errores: "+
					textStatus, errorThrown
				);
			});

			// Habilitamos de nuevo los botones
			request.always(function () {

			});
		}else{ // Fin de <-- Si hay suficientes caracteres en el formulario

			ons.notification.toast({message: 'Password o usuario incompleto', timeout: 2000});

		}
	}else{ // Fin de <-- Si hay suficientes caracteres en el formulario

			ons.notification.toast({message: 'Las contraseñas no coinciden', timeout: 2000});

		}
// No enviar el formulario
return false; 
});	


//Recuperar password
$(document).on('submit','#recover_form', function(){
"use strict";

		var lenPass = ($('#login_recover_pass').val().length >= 4 ) ? 1 : 0 ;
	
	// SI - Las contraseñas coinciden
	if( $('#login_register_password').val() === $('#login_register_password_confirm').val() ) {
		// SI - procede a enviar el formulario
		if(lenPass === 1 ){

			// Definimos el tipo de formulario
			var loginPath = phpValidate+'?method=request_pass';

			// Variable que contiene la solicitud
			var request;

			//Abortamos cualquier solicitud actual
			if (request){ request.abort(); }

			// Establecemos la variable del Formulario
			var $form = $(this);

			// Seleccionamos todos los posibles inputs
			var $inputs = $form.find("input, select, button, textarea, checkbox");

			// Serializamos la información del Formulario
			var serializedData = $form.serialize();

			// Deshabilitamos los inputs mientras se ejecuta el Ajax
			$inputs.prop("disabled", true);
			var register_btn_text = $('#get_register').html();
			
			// animation PENDING
			(debugMode) ? console.log('serializedData: ' + serializedData) : '';
			// Disparamos la solicitud (request) 
			request = $.ajax({
				url: loginPath,
				type: "post",
				data: serializedData
			});

			// Conexión exitosa
			request.done(function (response, textStatus, jqXHR){

				if ( response !== 'unsuccessful' ){ // $.isNumeric(response) 
					ons.notification.toast({message: 'Revise su correo electrónico.', timeout: 2000});
					//console.log(response);
					/*var session_response = $.parseJSON(response);
					getLoginAcess();*/
					myNavigator.popPage();
					
				} else {
					ons.notification.toast({message: 'No se localiza el usuario', timeout: 2000});

					// Reestablecemos el login
					$inputs.prop("disabled", false);
				}
			});

			// Si falla la conexión
			request.fail(function (jqXHR, textStatus, errorThrown){
				console.error(
					"Han ocurrido los siguientes errores: "+
					textStatus, errorThrown
				);
			});

			// Habilitamos de nuevo los botones
			request.always(function () {

			});
		}else{ // Fin de <-- Si hay suficientes caracteres en el formulario

			ons.notification.toast({message: 'Faltan datos por ingresar', timeout: 2000});

		}
	}else{ // Fin de <-- Si hay suficientes caracteres en el formulario

		ons.notification.toast({message: 'Las contraseñas no coiciden', timeout: 2000});

	}
// No enviar el formulario
return false; 
});	

$(document).on(clickHandler,'#do_logout',function(){ "use strict"; if(!touchmoved){ do_logout(); } return false; }).on('touchmove', function(e){
		"use strict";
		touchmoved = true;
	}).on('touchstart', function(){
		"use strict";
		touchmoved = false;
	});


function do_logout(){
	"use strict";
 		Cookies.remove('id_pat');

 		Cookies.remove('mail_pat');

 		Cookies.remove('pass_pat');


	// [A] solicitamos la baja de la sessión
	var request = $.ajax({
		url: phpValidate,
		type: "post",
		data: {method : 'do_logout'}
	});
	request.done(function (data, textStatus, jqXHR){
		if(data == 'successful')
		{			
			// Si se cerro sesión completamente:
			(debugMode) ? console.log("sesión cerrada") : '';
			getLogOut();
			
		}
	});
} // Log Out


	// Función "Mostrar Mensaje"
	function showMsgError(target, message, color, timer) {
		target.html(message);
		target.css('color',color);
		target.addClass('show');

		clearTimeout(msgTimer)
		msgTimer = setTimeout(function(){
			target.removeClass('show');
		}, 3500);
		if(timer){clearTimeout(msgTimer)}
	}