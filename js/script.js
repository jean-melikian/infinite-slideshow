/*
 Author : Jean-Christophe MELIKIAN
 */

$(document).ready(function () {

	// -- Personalizable settings ---------------------------------
	var slideWidth = 1024;	// Sets the slideshow's width (px)
	var slideHeight = 600;	// Sets the slideshow's height (px)
	var slideAnimSpeed = 1000;	// Sets the slideshow'w translation speed in animate()(ms)
	var slideAnimDelay = slideAnimSpeed+2000;	//	Sets the delay between each translation of the slides (ms)
	var playOnLoading = true;	//	Tells the script whether the slideshow should be played on loading complete (true) or not (false) (default: true)
	// Path to images
	var playImg = "img/play.png";
	var pauseImg = "img/pause.png";
	var bulletpointImg = "img/bulletpoint.png";
	// ------------------------------------------------------------

	// ====== DO NOT TOUCH ========================================
	// -- Variables (Flags, calculations, iterators) to initialize
	// ====== DO NOT TOUCH ========================================
	var playPauseHeight = slideHeight*(1/3);	// Defines a dynamic height for the play/pause div according to the slideshow's height
	var playPausePosition = -slideHeight*(2/3);	// Defines a dynamic width for the play/pause div according to the slideshow's height <- because the images have a 1:1 aspect ratio
	var slideCount = 0;	// The number of slides loaded and displayed, incremented on each CSS injection displaying the image (default: 0)
	var isPlaying = false;	// This flag indicates if the slideshow is currently playing or not (default: false)
	var playClicked = false;	// This flag indicates if the play/pause buttons have been clicked by the user (in order to rerun the slideshow on mouseover("#wrap"))
	var intervalID;	// ID set by setInterval and used by clearInterval to manage delays between animations/translations
	var currentSlide = 1; // Loops 0->n in order to display the matching description to the current slide, n being the number of slides
	// ============================================================

	// =========================================================================================================================================
	// ================================================================= DATA FETCH W/ AJAX ====================================================
	// =========================================================================================================================================
	// ajax() : asynchronous loading of remote resources (images for the slide + their descriptions)
	// JSON data fetched :
	// [
	//	{"desc":"La montagne","src":"https:\/\/static.pexels.com\/photos\/27912\/pexels-photo-27912.jpg"},
	//	{"desc":"L'oiseau","src":"https:\/\/static.pexels.com\/photos\/70913\/pexels-photo-70913.jpeg"},
	//	{"desc":"Le rongeur","src":"https:\/\/static.pexels.com\/photos\/35620\/guinea-pig-smooth-hair-silver-black-and-white-agouti.jpg"},
	//	{"desc":"L'arm\u00e9e","src":"https:\/\/static.pexels.com\/photos\/31511\/pexels-photo.jpg"}
	// ]
	// Once in done(), injects HTML tags and injects CSS to display images in the slideshow
	$.ajax({
		method: "POST",
		url: "http://www.skrzypczyk.fr/ajax.php",
		data: { nom: "MELIKIAN" }
	}).done(function(msg) {
		var ListSlide = jQuery.parseJSON(msg);	// Makes the msg content parsable by jQuery

		$("#slideshow").html('<div class="content"></div>');
		// Injects each of the resources fetched from above in HTML and CSS
		for (key in ListSlide) {
			// Appends each slide and bulletpoint DIVs in the .content DIV
			$("#slideshow .content").append('<div class="slide" id="slideAtIndex'+ key +'"></div>');
			$(".bulletpoints").append('<img src="'+ bulletpointImg +'" id="'+ key +'"/>');
			// Injects CSS on each slide w/ the images as backgrounds, the background-size: cover here is important to crop the slide as we want
			$(".slide:eq("+ slideCount++ +")").css({"background": "url(" + ListSlide[key].src + ") center", "background-size": "cover", "height": slideHeight, "width": slideWidth});
		}

		// =========================================================================================================================================
		// ================================================================== INIT =================================================================
		// == HTML init ====================================
		// Description
		$(".description p").fadeIn(function(){
			$(this).text(ListSlide[currentSlide].desc);
		});
		// Bulletpoints
		$("img#" + currentSlide).css({"opacity": "0.9", "transition": "250ms ease-in"});
		// Play/Pause div that will contain the play/pause button
		$("#slideshow").append('<div id="playpause"></div>');
		// == CSS init =====================================
		// The slideshow's dimensions
		$("#slideshow").css({"width": slideWidth, "height": slideHeight});
		$(".slide img").css({"width": slideWidth});
		$(".content").css({"width": slideWidth*slideCount, "left": -slideWidth});
		// The slideshow's container width (The additional 140px are for the arrows on the sides)
		$("#wrap").css({"width": slideWidth+140});
		// The size of the play/pause button depends on the slideshow's dimensions (the height)
		$("div#playpause").css({"height": playPauseHeight+"px", "width": playPauseHeight+"px", "top": playPausePosition+"px","background-size": "100%"});


		// == Scripts init =================================
		// Play the slideshow when the view is loaded
		if(playOnLoading) {
			slidePlay();
		}

		// =========================================================================================================================================
		// =================================================================== EVENTS ==============================================================
		// =========================================================================================================================================

		// On click the next arrow
		$("#next").click(function() {
			if(isPlaying) {
				clearInterval(intervalID);
				intervalID = setInterval(function() { slideMove("next"); }, slideAnimDelay);
			} else
				slideMove("next");
		});

		// On click the previous arrow
		$("#previous").click(function() {
			if(isPlaying) {
				clearInterval(intervalID);
				intervalID = setInterval(function() { slideMove("prev"); }, slideAnimDelay);
			} else
				slideMove("prev");
		});

		// On click the play/pause button
		$("div#playpause").click(function() {
			if(!isPlaying) {
				slidePlay();
			} else {
				slidePause();
			}
			playClicked = true;
		});

		// -- Manages the pause when hover the slideshow ------------
		$("#wrap").mouseenter(function() {
			if(isPlaying) {
				slidePause();
			}
		});

		$("#wrap").mouseleave(function() {
			if(!isPlaying) {
				slidePlay();
			}
		});
		// ----------------------------------------------------------

		// =========================================================================================================================================
		// =============================================================== FUNCTIONS ===============================================================
		// =========================================================================================================================================

		// -- Play/Pause the slideshow -------------------------------------------------------
		// Depends on the slideMove(direction) and descUpdate(direction) function
		function slidePlay() {
			if(!isPlaying) {
				intervalID = setInterval(function() { slideMove("next"); }, slideAnimDelay);
				isPlaying = true;
				$("div#playpause").css('background-image', 'url(' + pauseImg + ')');
			}
		};

		function slidePause() {
			if(isPlaying) {
				clearInterval(intervalID);
				isPlaying = false;
				$("div#playpause").css('background-image', 'url(' + playImg + ')');
			}
		};
		// -----------------------------------------------------------------------------------

		// -- Play/Pause the slideshow -------------------------------------------------------
		// Depends on the slideMove(direction) and descUpdate(direction) function
		// direction :	"next" (previous slide)
		//				"previous" (next slide)
		function slideMove(direction) {
			if(direction == "next") {
				// Inserts the first slide at the last position
				// And scrolls the slides from the right to the left (margin-left: -slideWidth)
				$("#slideshow .content").animate({"margin-left": -slideWidth}, slideAnimSpeed, function() {
					$("#slideshow .content").css({marginLeft:0});
					$("#slideshow .slide:last").after($("#slideshow .slide:first"));
				});
			} else if(direction == "prev") {
				// Inserts the last slide at the first position
				// And scrolls the slides from the left to the right (margin-left: slideWidth)
				$("#slideshow .content").animate({"margin-left": slideWidth}, slideAnimSpeed, function() {
					$("#slideshow .slide:first").before($("#slideshow .slide:last"));
					$("#slideshow .content").css({marginLeft:0});
				});
			}
			// Finally we update the description of the slide
			descUpdate(direction);
		};
		// -----------------------------------------------------------------------------------

		function descUpdate(direction) {
			$(".description p").fadeOut(function() {

				// Updating the currentSlide flag
				if(direction == "next") {
					if(currentSlide < slideCount-1) {
						currentSlide++;
					} else if(currentSlide >= slideCount-1) {
						currentSlide = 0;
					}
				} else if(direction == "prev") {
					if(currentSlide > 0) {
						currentSlide--;
					} else if(currentSlide <= 0) {
						currentSlide = slideCount-1;
					}
				}
				// Displays the new description
				$(".description p").text(ListSlide[currentSlide].desc).fadeIn();
				// Updating the bulletpoints indication of the currentSlide
				$(".bulletpoints img").css({"opacity": "0.2", "transition": "250ms ease-out"});
				$("img#" + currentSlide).css({"opacity": "0.9", "transition": "250ms ease-in"});
			});
		};
	});
});