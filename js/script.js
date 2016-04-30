/*
	Author : Jean-Christophe MELIKIAN
*/

$(document).ready(function () {

	// -- Personalizable settings
	var imgWidth = 1024;
	var imgHeight = 600;
	var aspectRatio = imgWidth/imgHeight;
	var animSpeed = 1500;
	var delay = animSpeed+2000;
	var playImg = "img/play.png";
	var pauseImg = "img/pause.png";
	// -- Variables (Flags and iterators) to initialize, DO NOT TOUCH
	var playPauseHeight = imgHeight*(1/3);
	var playPausePosition = -imgHeight*(2/3);
	var nbImg = 0;
	var isPlaying = false;
	var intervalID;
	
	// == DATA FETCH ===============================================================================================================================
	/*
	MAIL : y.skrzypczy@gmail.com
	Je vais chercher ce qu'il y a sur https://www.skrzypczyk.fr/ajax.php
	JSON récupéré :
	[{"desc":"La montagne","src":"https:\/\/static.pexels.com\/photos\/27912\/pexels-photo-27912.jpg"},{"desc":"L'oiseau","src":"https:\/\/static.pexels.com\/photos\/70913\/pexels-photo-70913.jpeg"},{"desc":"Le rongeur","src":"https:\/\/static.pexels.com\/photos\/35620\/guinea-pig-smooth-hair-silver-black-and-white-agouti.jpg"},{"desc":"L'arm\u00e9e","src":"https:\/\/static.pexels.com\/photos\/31511\/pexels-photo.jpg"}]
	*/
	$.ajax({
		method: "POST",
		url: "http://www.skrzypczyk.fr/ajax.php",
		data: { nom: "MELIKIAN" }
	}).done(function(msg) {
		var ListSlide = jQuery.parseJSON(msg);

		$("#slideshow").html('<div class="content"></div>');
		var slideIndex = 0;
		for (key in ListSlide) {
			$("#slideshow .content").append('<div class="slide" id="slideAtIndex'+ slideIndex++ +'"><div class="description"><p>'+ ListSlide[key].desc +'</p></div></div>');
			$(".slide:eq("+ nbImg++ +")").css({"background": "url(" + ListSlide[key].src + ") center", "background-size": "cover", "height": imgHeight, "width": imgWidth});
		}
		$("#slideshow").append('<div id="playpause"></div>');
		initCSS();

	function initCSS() {
		$("#slideshow").css({"width": imgWidth, "height": imgHeight});
		$(".slide img").css({"width": imgWidth});
		$(".content").css({"width": imgWidth*nbImg, "left": -imgWidth});
		$("#wrap").css({"width": imgWidth+140});
		$("div#playpause").css({"height": playPauseHeight+"px", "width": playPauseHeight+"px", "top": playPausePosition+"px","background-size": "100%"});
	};

	function moveSlide(direction) {
		/* 
			1 -> previous slide
			-1 -> next slide
		*/
		if(direction == "next") {
			$("#slideshow .content").animate({"margin-left": -imgWidth}, animSpeed, function() {
				$("#slideshow .content").css({marginLeft:0});
				$("#slideshow .slide:last").after($("#slideshow .slide:first"));
			});
		} else if(direction == "prev") {
			$("#slideshow .content").animate({"margin-left": imgWidth}, animSpeed, function() {
				$("#slideshow .slide:first").before($("#slideshow .slide:last"));
				$("#slideshow .content").css({marginLeft:0});
			});
		}
	};

	function slideTrigger() {
		if(!isPlaying) {
			intervalID = setInterval(function() { moveSlide("next"); }, delay);
			isPlaying = true;
			$("div#playpause").css('background-image', 'url(' + pauseImg + ')');
		} else {
			clearInterval(intervalID);
			isPlaying = false;
			$("div#playpause").css('background-image', 'url(' + playImg + ')');
		}
	};

	

	$("#next").click(function() {
		if(isPlaying) {
			clearInterval(intervalID);
			intervalID = setInterval(function() { moveSlide("next"); }, delay);
		}
		moveSlide("next");
	});

	$("#previous").click(function() {
		if(isPlaying) {
			clearInterval(intervalID);
			intervalID = setInterval(function() { moveSlide("prev"); }, delay);
		}
		moveSlide("prev");
	});

	$("div#playpause").click(function() {
		slideTrigger();
	});

	/*
	var bulletPoints = {};

	for(var i = 0; i < nbImg; i++) {
		bulletPoints[i] = i+".jpg";
	}
	for( var key in bulletPoints) {
		console.log(bulletPoints[i]);
	}*/
	});
});