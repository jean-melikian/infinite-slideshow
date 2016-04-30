/*
	Author : Jean-Christophe MELIKIAN
*/

$(document).ready(function () {

	// -- Personalizable settings ---------------------------------
	var slideWidth = 1024;	// Sets the slideshow's width (px)
	var slideHeight = 600;	// Sets the slideshow's height (px)
	var slideAnimSpeed = 1000;	// Sets the slideshow'w translation speed in animate()(ms)
	var slideAnimDelay = slideAnimSpeed+2000;	//	Sets the delay between each translation of the slides (ms)
	var playImg = "img/play.png";	// Path to the play button image
	var pauseImg = "img/pause.png";	// Path to the pause button image
	var playOnLoading = true;	//	Tells the script whether the slideshow should be played on loading complete (true) or not (false) (default: true)
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
	// ============================================================
	
	// == DATA FETCH ===============================================================================================================================
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
			$("#slideshow .content").append('<div class="slide" id="slideAtIndex'+ key +'"><div class="description"><p>'+ ListSlide[key].desc +'</p></div></div>');
			$(".slide:eq("+ slideCount++ +")").css({"background": "url(" + ListSlide[key].src + ") center", "background-size": "cover", "height": slideHeight, "width": slideWidth});
		}
		$("#slideshow").append('<div id="playpause"></div>');
		$("#slideshow").css({"width": slideWidth, "height": slideHeight});
		$(".slide img").css({"width": slideWidth});
		$(".content").css({"width": slideWidth*slideCount, "left": -slideWidth});
		$("#wrap").css({"width": slideWidth+140});
		$("div#playpause").css({"height": playPauseHeight+"px", "width": playPauseHeight+"px", "top": playPausePosition+"px","background-size": "100%"});

		// Play the slideshow when the view is loaded
		if(playOnLoading) {
			slidePlay();
		}

		// ==============================================================================
		// ==== EVENTS ==================================================================
		// ==============================================================================

		$("#next").click(function() {
			if(isPlaying) {
				clearInterval(intervalID);
				intervalID = setInterval(function() { slideMove("next"); }, slideAnimDelay);
			}
			slideMove("next");
		});

		$("#previous").click(function() {
			if(isPlaying) {
				clearInterval(intervalID);
				intervalID = setInterval(function() { slideMove("prev"); }, slideAnimDelay);
			}
			slideMove("prev");
		});

		$("div#playpause").click(function() {
			if(!isPlaying) {
				slidePlay();
			} else {
				slidePause();
			}
			playClicked = true;
		});

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

		/*
		$("body, section").hover(function() {
			if(isPlaying && playClicked) {
				slidePlay();
			} else if(!isPlaying && playClicked) {
				slidePause();
			}
		});
		*/
		// ==============================================================================
		// ==== FUNCTIONS ===============================================================
		// ==============================================================================

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

		function slideMove(direction) {
			/*
			 1 -> previous slide
			 -1 -> next slide
			 */
			if(direction == "next") {
				$("#slideshow .content").animate({"margin-left": -slideWidth}, slideAnimSpeed, function() {
					$("#slideshow .content").css({marginLeft:0});
					$("#slideshow .slide:last").after($("#slideshow .slide:first"));
				});
			} else if(direction == "prev") {
				$("#slideshow .content").animate({"margin-left": slideWidth}, slideAnimSpeed, function() {
					$("#slideshow .slide:first").before($("#slideshow .slide:last"));
					$("#slideshow .content").css({marginLeft:0});
				});
			}
		};
	});
});