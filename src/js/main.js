(function () {
	"use strict";

	/* =Loader
	-------------------------------------------------------------- */
	$("html").addClass('html-onload');

	/* disable browser scroll on desktop */
	var scrollPosition = [
		self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	];
	var html = $('html');

	html.data('scroll-position', scrollPosition);
	html.data('previous-overflow', html.css('overflow'));
	html.css('overflow', 'hidden');
	window.scrollTo(scrollPosition[0], scrollPosition[1]);

	$(window).load(function () {
		/* fade out the loading icon */
		$(".pageloader-content").addClass('pageloader-content-hide');

		/* after 250ms delay, restore browser scroll + fade out loader background */
		setTimeout(function () {

			/* enable browser scroll on desktop */
			var html = $('html');
			var scrollPosition = html.data('scroll-position');
			html.css('overflow', html.data('previous-overflow'));
			window.scrollTo(scrollPosition[0], scrollPosition[1]);

			/* fade out loader */
			$("#pageloader").addClass('pageloader-fade');

			/* slide down html */
			$("html").removeClass('html-onload');
			$("html").addClass('html-loaded');

		}, 250);

		/* after 1000ms delay, hide (not fade out) loader*/
		setTimeout(function () {
			jQuery("#pageloader").addClass('pageloader-hide');

		}, 1000);
	});

	/* =Center and Outline
	-------------------------------------------------------------- */
	function centerInit() {
		var hero = $('.hero');

		hero.css({
			"height": $(window).height() + "px"
		});
	}

	centerInit();
	$(window).resize(centerInit);

	/* =Local Scroll
	-------------------------------------------------------------- */
	$('.hero, nav').localScroll({
		duration: 1000
	});

	$('.offset').localScroll({
		duration: 1000,
		offset: -100
	});

	$('#top').on("click", function () {
		return $("body,html").stop().animate({
			scrollTop: 0
		}, 800, "easeOutCubic"), !1;
	});

	var sections = $('section');
	var navigation_links = $('nav a');
	sections.waypoint({
		handler: function (direction) {
			var active_section;
			active_section = $(this);
			if (direction === "up") active_section = active_section.prev();
			var active_link = $('nav a[href="#' + active_section.attr("id") + '"]');
			navigation_links.removeClass("active");
			active_link.addClass("active");
		},
		offset: '100'
	});

	if (Modernizr.touchevents) {
		skrollr.init().destroy();
	} else {
		skrollr.init({
			forceHeight: false
		});
	}

	/* =Sticky Navigation
	-------------------------------------------------------------- */
	function navigationSticky() {
		var st = $(window).scrollTop(),
			wh = $('.hero').outerHeight() - 40,
			logoHeight = $('.header-inner .logo').outerHeight(),
			navButton = $('.menu-button'),
			navButtonMargin = (logoHeight - 12) / 2;

		if (st > wh) {
			$('header').addClass('scrolled');
		} else {
			$('header').removeClass('scrolled');
		};

		navButton.css({
			"top": navButtonMargin + "px"
		});
	}

	navigationSticky();
	$(window).on("scroll", navigationSticky);
	$(window).on("resize", navigationSticky);

	$('.menu-button').on("click", function () {
		if ($('#side-nav').is(':hidden')) {
			$('#side-nav').slideDown();
			$('.menu-button').addClass('active');
		} else {
			$('#side-nav').slideUp();
			$('.menu-button').removeClass('active');
		}
	});

	$('#side-nav a').on("click", function () {
		if ($(window).width() < 992) {
			$('#side-nav').slideUp();
			$('.menu-button').removeClass('active');
		} else {
			return false;
		}
	});

	/* =Lightbox
	-------------------------------------------------------------- */
	$('.lightbox-gallery').magnificPopup({
		delegate: '.lightbox',
		type: 'image',
		mainClass: 'mfp-fade',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		}
	});
	$('.lightbox-youtube').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});

	/* =Thumbnail Effects
	-------------------------------------------------------------- */
	atvImg();

	function thumbHeight() {
		var imageContainer = $('.atvImg'),
			ww = $(window).width();

		imageContainer.css({
			"height": $('.folio-list li').width() + "px"
		});

	}

	thumbHeight();
	$(window).resize(thumbHeight);

	// Timeline
	$('.timeline').waypoint({
		handler: function () {
			$(this).addClass('on');
		},
		offset: '95%'
	});
	$('.resume').waypoint({
		handler: function () {
			$(this).addClass('on');
		},
		offset: '95%'
	});

	/* =Contact Form
	-------------------------------------------------------------- */
	$(function () {
		var cf = $('#contact_form');
		cf.on('submit', function (event) {
			// Prevent normal submission
			event.preventDefault();

			// Filter the inputs
			var data = $(this).find('input[name!=_gotcha], textarea').serializeArray();

			// Submit form via AJAX
			$.ajax({
				method: cf.attr('method'),
				data: data,
				dataType: 'json',
				url: cf.attr('action'),
				success: function (data) {
					cf.find('input').attr('disabled', 'disabled');
					cf.fadeTo('slow', 0.25, function () {
						$(this).find('input').attr('disabled', 'disabled');
						$(this).find('label').css('cursor', 'default');
						$('#success').fadeIn();
					});
				},
				error: function (data) {
					cf.fadeTo('slow', 0.25, function () {
						$('#error').fadeIn();
					});
				}
			});
		});
	});
})();