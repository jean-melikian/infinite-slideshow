$(document).ready(function () {
	// MAIL : y.skrzypczy@gmail.com
	// Objet : projet ajax slideshow nom prénom 3web janvier
	//Je vais chercher ce qu'il y a sur
	//https://skrzypczyk.fr/ajax.php
	//Pour être sur d'avoir des données
	//je dois passer une variable en POST
	//avec la clé "nom"
	//ca retourne ceci :

	// [{"desc":"La montagne","src":"https:\/\/static.pexels.com\/photos\/27912\/pexels-photo-27912.jpg"},{"desc":"L'oiseau","src":"https:\/\/static.pexels.com\/photos\/70913\/pexels-photo-70913.jpeg"},{"desc":"Le rongeur","src":"https:\/\/static.pexels.com\/photos\/35620\/guinea-pig-smooth-hair-silver-black-and-white-agouti.jpg"},{"desc":"L'arm\u00e9e","src":"https:\/\/static.pexels.com\/photos\/31511\/pexels-photo.jpg"}]
	$.ajax({
		method: "POST",
		url: "http://skrzypczyk.fr/ajax.php",
		data: { nom: "VOTRE NOM" }
	}).done(function(msg) {
			// CODE À RAJOUTER
		}
	})
});