// JavaScript Document

$(document).ready(function() {
	// Recargar contenido en el segundo touch
	document.querySelector('#tabbar').addEventListener('reactive', function() { 
		var tab_index = document.querySelector('#tabbar').getActiveTabIndex();
		if(tab_index == 2){
			//loadElements();
		}else if(tab_index == 4){
			//loadNotifications();
		}	
	});
	
	$(document).on(clickHandler, "textarea", function(){
		"use strict";
		
		if(!touchmoved){	
				console.log('touched3');
			$(this).focus();
		}
	}).on('touchmove', function(e){
		"use strict";
		touchmoved = true;
	}).on('touchstart', function(){
		"use strict";
		touchmoved = false;
	});

});

//Cambio de tamaño en la vetana
function thisResize() {
	
}

var resizeTimer; $(window).resize(function () { if (resizeTimer) { clearTimeout(resizeTimer); } resizeTimer = setTimeout(function() { resizeTimer = null; thisResize(); }, 500);});