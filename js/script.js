$jQuery.fn.exists = function(){
	return $jQuery(this).length > 0;
 };

$jQuery(document).ready(function() {
	
	$jQuery('.no-js').removeClass('no-js');
	
	$jQuery('#faq h2').next('div').siblings('div').slideUp();
	$jQuery('#faq h2').click(function(e) {
		$jQuery(e.target).next('div').siblings('div').slideUp();
        $jQuery(e.target).next('div').slideToggle();
	});

	$jQuery('._blank').live('click', function(e) {
		window.open($jQuery(this).attr('href'));
		e.preventDefault();
	});
	
	if ($jQuery('#homeMannequin').exists()) {
		$jQuery('#travelling-tailor').removeClass('dNone');
		$jQuery('#travelling-tailor').css('opacity', 0);
		$jQuery('#travelling-tailor').animate({
			'opacity': 1
		}, 'slow');
	}
	
	$jQuery('#travelling-tailor .closeMe').click(function() {
		$jQuery('#travelling-tailor').animate({
			'opacity': 0
		}, 'slow');
	});
	
	//Measurements
	bsc.init();
	
	$jQuery('.expandable-tab h1').click(function() {
		var parent = $jQuery(this).parent();
		bsc.expandableClick(parent);
		
		if (parent.hasClass('first')) {
			var sizechart = $('.sizeChartLink');
			sizechart.qtip({
				style: {
					classes: 'qtip-tipsy',
					position: {
						my: 'top center',  // Position my top left...
						at: 'left center', // at the bottom right of...
						target: $('.sizeChartLink') // my target,
					}
				},
				
				content: {
					attr: 'data-tip'
				},
			});
			sizechart.qtip("show");
		} else {
			$('.sizeChartLink').qtip("hide");
		}
	});
	
	$jQuery('#custom-measurements, #custom-measurements-button').click(function(e) {
		if (!bsc.isSignedIn()) {
			bsc.setBuyPath($(this).attr('id'));
			bsc.openSignIn();
		} else {
			bsc.setBuyPath('false');
		
			$jQuery('label:contains("Size")').parent().find('select :nth-child(5)').attr('selected', 'selected');
			$jQuery('label:contains("Fit")').parent().find('select :nth-child(3)').attr('selected', 'selected');
			
			$jQuery('#productData, #shirt-customization').slideUp(2000, 'swing', function() {
				$jQuery('.shirt-measurements').slideDown(2000, 'swing', function() {
					//$jQuery('.expandable-tab.first h1').trigger('click');
				});
			});

			bsc.measurementsContentSwitch();
		}
		
		e.preventDefault();
	});
	
	$jQuery('.measurement-regulator .cm-increase').click(function() {
		var input = $jQuery(this).parent().find('input');
		bsc.measurementIncrease(input);
	});
	
	$jQuery('.measurement-regulator .cm-decrease').click(function() {
		var input = $jQuery(this).parent().find('input');
		bsc.measurementDecrease(input);
	});
	
	$jQuery('.back-to-shirt').click(function(e) {
		
		if ($(this).attr('id', 'cancel-customization')) {
			bsc.customized = false;
		}
	
		$jQuery('label:contains("Size")').parent().find('select :nth-child(1)').attr('selected', 'selected');
		$jQuery('label:contains("Fit")').parent().find('select :nth-child(1)').attr('selected', 'selected');
		
		$jQuery('.shirt-measurements, #shirt-customization').slideUp(2000, 'swing', function() {
			$jQuery('#productData').slideDown(2000, 'swing');
		});

		$jQuery('.breadcrumbs').removeClass('customizer');
		bsc.shirtContentSwitch();
		e.preventDefault();
		
	});
	
	$jQuery('.gender input').click(function() {
		bsc.checkProfileGender();
		bsc.selectBaseSize();
	});
	
	$jQuery('.fit input').click(function() {
		bsc.checkProfileGender();
		bsc.selectBaseSize();
	});
	
	$jQuery('.measurement-type input').click(function() {
		//Disable Fit Check
		//bsc.checkMeasurementType();
		bsc.selectBaseSize();
	});
	
	$jQuery('.pre-defined-sizes a').click(function(e) {
		$('.pre-defined-sizes a').removeClass('active');
		$(this).addClass('active');
		bsc.selectBaseSize();
		
		e.preventDefault();
	});
	
	//Removed
	//$jQuery('label:contains("Size")').parent().find('select :nth-child(5)').hide();
	//$jQuery('label:contains("Fit")').parent().find('select :nth-child(3)').hide();
	
	//Customization Hover
	$jQuery('#customization').hover(function() {
		$('.cm-thumbnails-mini:eq(1) img').click();
	}, function() {
		$('.cm-thumbnails-mini:eq(0) img').click();
	});
	
	//Fabric Overlay Hover
	$jQuery(document).on('mouseenter', '.product-cell a', function() {
		$jQuery(this).find('.fabric-overlay').stop(true, false).fadeIn();
	});
	$jQuery(document).on('mouseleave', '.product-cell a',function() {
		$jQuery(this).find('.fabric-overlay').stop(true, false).fadeOut();
	});
	
	//Customization
	$jQuery('.product-cell a').click(function(e) {
		bsc.buyPath = $(this).attr('href');
		if (!bsc.isSignedIn()) {
			Shadowbox.open({
				content:    '#sign-in',
				player:     "inline",
				title:      "",
				width: 836,
				height: 482
			});
		} else {
			window.location.href = 'http://bombayshirts.com' + bsc.buyPath;
		}
		
		e.preventDefault();
		return false;
	});
	
	$jQuery('body').on('click', '#sb-player .register', function(e) {
		Shadowbox.close();
		bsc.setBuyPath(bsc.buyPath);
		bsc.openSignIn();
		e.preventDefault();
	});
	
	$jQuery('body').on('click', '#customize', function(e) {
		Shadowbox.close();
		window.location.href = 'http://bombayshirts.com' + bsc.buyPath;
		e.preventDefault();
		return false;
	});
	
	$jQuery('.customization-section .option a').click(function(e) {
		
		bsc.customizationOptionClick(this);
		e.preventDefault();
		
		var option = $jQuery(this).find('h2').html();
		var element = $jQuery(this).closest('.subsection').attr('title');
		
		bsc.customizations[element] = option;
	
		var noupdate = $jQuery(this).closest('.subsection').hasClass('noupdate');
		
		if (!noupdate) {
			//Image Generation
			bsc.imageVariables.bsc[$jQuery(this).closest('.subsection').attr('id')] = $jQuery(this).parent().attr('id');
			
			bsc.collarStyle();
			bsc.pocketStyle();
			bsc.cuffStyle();
			bsc.placketStyle();
			bsc.elbowPatch();
			bsc.shoulderEpaulettes();
			bsc.collarPipingContrast();
			bsc.cuffPipingContrast();
			bsc.placketPipingContrast();
			bsc.collarContrast();
			bsc.cuffContrast();
			bsc.placketContrast();
			bsc.pocketContrast();
			bsc.elbowPatchContrast();
			bsc.shoulderContrast();
			bsc.generateImage();
		}
	});
	
	$jQuery('.subsection select').change(function(e) {
		bsc.customizationSelectOptionChange(this);
		
		var option = this.value;
		var element = $jQuery(this).attr('title');
		
		bsc.customizations[element] = option;
	});
	
	$jQuery('.subsection .input-text').keyup(function(e) {
		var option = $jQuery(this).val();
		var element = $jQuery(this).attr('title');
		
		bsc.customizations[element] = option;
	});
	
	$jQuery('.custom-size').change(function(e) {
		var index = this.selectedIndex;
		$jQuery('label:contains("Size")').parent().find('select').prop('selectedIndex', index);
	});
	
	$jQuery('.custom-fit').change(function(e) {
		var index = this.selectedIndex;
		$jQuery('label:contains("Fit")').parent().find('select').prop('selectedIndex', index);
		
		if (index == 0) {
			bsc.toggleMenFitSizes(true);
		} else {
			bsc.toggleMenFitSizes(false);
		}
	});
	
	//Customization Conditions
	$jQuery('#sleeve-style a').click(function(e) {
		var sleeve = $jQuery(this).parent().attr('id');
		bsc.sleeveChange(sleeve);
	});
	
	$jQuery('#monogram-style a').click(function(e) {
		var monogram = $jQuery(this).parent().attr('id');
		bsc.monogramChange(monogram);
	});
	
	$jQuery('#extras-elbow-patch a').click(function(e) {
		var elbow = $jQuery(this).parent().attr('id');
		bsc.elbowPatchChange(elbow);
	});
	
	$jQuery('#extras-shoulders a').click(function(e) {
		var shoulder = $jQuery(this).parent().attr('id');
		bsc.shoulderChange(shoulder);
	});
	
	$jQuery('#contrast-collar-style a').click(function(e) {
		var collar = $jQuery(this).parent().attr('id');
		bsc.collarChange(collar);
	});
	
	$jQuery('#contrast-cuff-style a').click(function(e) {
		var cuff = $jQuery(this).parent().attr('id');
		bsc.cuffChange(cuff);
	});
	
	$jQuery('#contrast-collar-piping-style a').click(function(e) {
		var piping = $jQuery(this).parent().attr('id');
		bsc.pipingCollarChange(piping);
	});
	
	$jQuery('#contrast-cuff-piping-style a').click(function(e) {
		var piping = $jQuery(this).parent().attr('id');
		bsc.pipingCuffChange(piping);
	});
	
	$jQuery('#contrast-placket-piping-style a').click(function(e) {
		var piping = $jQuery(this).parent().attr('id');
		bsc.pipingPlacketChange(piping);
	});
	
	$jQuery('#contrast-placket-style a').click(function(e) {
		var placket = $jQuery(this).parent().attr('id');
		bsc.placketChange(placket);
	});
	
	$jQuery('#contrast-pocket-style a').click(function(e) {
		var pocket = $jQuery(this).parent().attr('id');
		bsc.pocketContrastChange(pocket);
	});
	
	$jQuery('#extras-elbow a').click(function(e) {
		var elbowPatch = $jQuery(this).parent().attr('id');
		bsc.elbowPatchChange(elbowPatch);
	});
	
	$jQuery('#pocket-placement').change(function() {
		bsc.pocketStyle();
		bsc.pocketChange(this.value);
		bsc.generateImage();
	});
	
	$jQuery('#pocket-style a').click(function() {
		bsc.pocketStyleChange(this);
	});
	
	$jQuery('#cuff-shape').change(function() {
		bsc.cuffStyle();
		bsc.generateImage();
	});
	
	
	//Add to cart clicks
	$jQuery('.measurements .save_profile_but').click(function(e) {
		$jQuery('label:contains("Size")').parent().find('select option:last').prop('selected', 'selected');
		$jQuery('label:contains("Fit")').parent().find('select option:last').prop('selected', 'selected');
		
		if (!bsc.isSignedIn()) {
			bsc.createCustomizationsString(true);
			$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
			
			e.preventDefault();
		} else {
			bsc.createCustomizationsString(false);
			bsc.saveBaseSize();
			//$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
			//e.preventDefault();
		}
	});

	//Save Profile Button
	$('.account #save_profile_but').click(function() {
		if (bsc.isSignedIn()) {
			bsc.saveBaseSize();
		}
	});
	
	$jQuery('#travelling-tailor-expand #travelling_tailor_cart').click(function() {
		bsc.createCustomizationsString(false);
		
		$jQuery('label:contains("Travelling Tailor")').parent().find('input.checkbox').attr('checked', 'checked');
		$jQuery('label:contains("Send Us a Shirt")').parent().find('input.checkbox').removeAttr('checked', 'checked');
		$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
	});
	
	$jQuery('.send-shirt .send_shirt_cart').click(function() {
		bsc.createCustomizationsString(false);
		
		$jQuery('label:contains("Send Us a Shirt")').parent().find('input.checkbox').attr('checked', 'checked');
		$jQuery('label:contains("Travelling Tailor")').parent().find('input.checkbox').removeAttr('checked', 'checked');
		$jQuery('label:contains("Size")').parent().find('select option:last').prop('selected', 'selected');
		$jQuery('label:contains("Fit")').parent().find('select option:last').prop('selected', 'selected');
		$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
	});
	
	$jQuery('.send_customization_cart').click(function() {
		bsc.createCustomizationsString(false);
		$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
	});
	
	$jQuery('.newsletter .blackButton').click(function() {
		suscriber = {
			custName: '',
			custEmail: $jQuery('.newsletter .text').val()
		};
		window.canvass_nlsWidget.subscribe(suscriber, function() {});
	});
	

	//Lightboxes
	$jQuery('#open-reward-points').live('click', function(e) {
		Shadowbox.close();
		setTimeout(function(){
			window.referralWidget.showWidget();
		}, 500);
		
		e.preventDefault();
	});

	$jQuery('.gallery .cm-image-wrap a.cm-image-previewer').click(function(e) {
		var img = $(this).find('img').attr('rel');
		Shadowbox.open({
			content:    img,
			player:     "img",
		});
	
		e.preventDefault();
	});
	
	$jQuery('.buy-path').click(function() {
		$jQuery('.custom-size').trigger('change');
		//$jQuery('.custom-fit').trigger('change');
		$jQuery('.send_customization_cart').trigger('click');
	});

	$jQuery(document).on('mouseenter', '.product-image > a', function() {
		$jQuery(this).parent().find('.options-overlay-wrap').stop(false, true).fadeIn(750);
	});
	
	$jQuery(document).on('mouseleave', '.options-overlay-wrap',function() {
		$jQuery(this).stop(false, true).fadeOut(250);
	});
	
	$jQuery(document).on('click', '.options-overlay-wrap', function() {
		window.location.href = $(this).find('a.buy').attr('href');
	});
	
	if(window.location.hash == '#customize') {
	  $jQuery('#customization').click();
	}
	
	$jQuery('#accordion').accordion({
		active: false,
		collapsible: true,
		heightStyle: "content",
		animate: 300,
		activate: function(event, ui) {
			$("#collar-style > div").mCustomScrollbar("update");
			$("#contrast-cuff-swatch > div").mCustomScrollbar("update");
			$("#contrast-collar-swatch > div").mCustomScrollbar("update");
			$("#contrast-placket-swatch > div").mCustomScrollbar("update");
			$("#contrast-collar-piping-swatch > div").mCustomScrollbar("update");
			$("#contrast-placket-piping-swatch > div").mCustomScrollbar("update");
			$("#contrast-pocket-swatch > div").mCustomScrollbar("update");
			$("#contrast-elbow-swatch > div").mCustomScrollbar("update");
			$("#contrast-shoulder-swatch > div").mCustomScrollbar("update");
		}
	});
	
	$jQuery('.accordion-dos').accordion({
		active: true,
		collapsible: true,
		heightStyle: "content",
		animate: 300,
		activate: function(event, ui) {
			//$(".customizationGallery.gallery").css('position', 'relative');
			//$(".customizationGallery.gallery").css('top', '550px');
		}
	});
	
	$jQuery('#accordion h3, .accordion-dos h3, .expandable-tab h1').bind('click',function(){
		var self = this;
		
		setTimeout(function() {
			theOffset = $(self).offset();
			$jQuery('body,html').animate({ scrollTop: theOffset.top - 100 }, 'slow');
		}, 310); // ensure the collapse animation is done
	});
	
	//Cart Update 
	$jQuery('.cart-update input').click(function() {
		$jQuery('.options select').removeAttr('disabled');
		$jQuery('.options textarea').removeAttr('disabled');

		$('#button_cart').click();
		
		$jQuery('.options select').attr('disabled, disabled');
		$jQuery('.options textarea').attr('disabled, disabled');
	});
	
	//Customizations Product Fabric/Care Overlay
	$jQuery('.product-data-horizontal .more').click(function() {
		bsc.productMoreClick(this);
	});
	
	$jQuery('.product-data-horizontal .close').on('click', function() {
		bsc.productMoreCloseClick();
	});
	
	
	
	
	//Tooltips
	$('.option h2[title!=""]').qtip({
		style: {
			classes: 'qtip-tipsy',
			position: {
				my: 'top center',  // Position my top left...
				at: 'bottom center', // at the bottom right of...
				target: $('.option h2[title!=""]') // my target
			}
		}
	});
	
	$('.leather h1[title!=""]').qtip({
		style: {
			classes: 'qtip-tipsy',
			position: {
				my: 'top center',  // Position my top left...
				at: 'top center', // at the bottom right of...
				target: $('.leather h1[title!=""]') // my target
			}
		}
	});
	
	$('.measurements span[title!=""]').qtip({
		style: {
			classes: 'qtip-tipsy',
			position: {
				my: 'top center',  // Position my top left...
				at: 'bottom center', // at the bottom right of...
				target: $('.measurements span[title!=""]') // my target
			}
		}
	});
	
	//API Zoom
	$jQuery('.customizationGallery .zoom').click(function(e) {
		Shadowbox.open({
			content:    '#api-gallery-zoom',
			player:     "inline",
			title:      "",
			width: 850,
			height: 600
		});
		
		e.preventDefault();
	});
	
	
	bsc.initImageVariables();
	bsc.generateDefault = true;
	bsc.generateImage();
	
	bsc.initHomepage();
	
	bsc.animateToElement('.stylist-link', '.travelform');
	
	//Instagram Feed
	/*var feed = new Instafeed({
		get: 'user',
		limit: 8,
		sortBy: 'random',
        userId: 490632506,
		accessToken: '490632506.467ede5.46509a93ffd946e287e9feafce4423a4',
		template: '<li><a href="{{link}}" class="_blank" target="_blank"><img src="{{image}}" height="250" width="250" /><div class="bottom"><span class="likes"><i class="fa fa-heart"></i> {{likes}}</span><span class="comments"><i class="fa fa-comment"></i> {{comments}}</span></div></a></li>',
		resolution: 'low_resolution',
		after: function() {
			$jQuery("#instafeed li").last().css("margin", "0");
			$jQuery('#instafeed li').fadeOut(0).fadeIn('slow');
		}
    });
	feed.run();
	*/

	$('.measurement-static #body').slideUp(0);
	$('.measurement-static .body-link').click(function(e) {
		$(this).slideUp('fast');
		$('.measurement-static #body').slideDown('fast');

		e.preventDefault();
		return false;
	});
	
	function startScrolling(scroller_obj, velocity, start_from) {
        //bind animation  inside the scroller element
        scroller_obj.bind('marquee', function (event, c) {
            //text to scroll
            var ob = $(this);
            //scroller width
            var sw = parseInt(ob.parent().width());
            //text width
            var tw = parseInt(ob.width());
            //text left position relative to the offset parent
            var tl = parseInt(ob.position().left);
            //velocity converted to calculate duration
            var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
            //same velocity for different text's length in relation with duration
            var dr = (v * tw / sw) + v;
            //is it scrolling from right or left?
            switch (start_from) {
                case 'right':
                    //is it the first time?
                    if (typeof c == 'undefined') {
                        //if yes, start from the absolute right
                        ob.css({
                            left: sw
                        });
                        sw = -tw;
                    } else {
                        //else calculate destination position
                        sw = tl - (tw + sw);
                    };
                    break;
                default:
                    if (typeof c == 'undefined') {
                        //start from the absolute left
                        ob.css({
                            left: -tw
                        });
                    } else {
                        //else calculate destination position
                        sw += tl + tw;
                    };
            }
            //attach animation to scroller element and start it by a trigger
            ob.animate({
                left: sw
            }, {
                duration: dr,
                easing: 'linear',
                complete: function () {
                    ob.trigger('marquee');
                },
                step: function () {
                    //check if scroller limits are reached
                    if (start_from == 'right') {
                        if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                            //we need to stop and restart animation
                            ob.stop();
                            ob.trigger('marquee');
                        };
                    } else {
                        if (parseInt(ob.position().left) > parseInt(ob.parent().width())) {
                            ob.stop();
                            ob.trigger('marquee');
                        };
                    };
                }
            });
        }).trigger('marquee');
        //pause scrolling animation on mouse over
        scroller_obj.mouseover(function () {
            $(this).stop();
        });
        //resume scrolling animation on mouse out
        scroller_obj.mouseout(function () {
            $(this).trigger('marquee', ['resume']);
        });
    };

    //the main app starts here...
    //change the cursor type for each scroller
    $('.scroller').css("cursor", "pointer");

    //settings to pass to function
    var scroller = $('.scrollingtext'); // element(s) to scroll
    var scrolling_velocity = 85; // 1-99
    var scrolling_from = 'right'; // 'right' or 'left'

    //call the function and start to scroll..
    startScrolling(scroller, scrolling_velocity, scrolling_from);
	
});

$jQuery(window).load(function() {
	//if($jQuery.cookie('rewards_init') != "1") {
	if($jQuery.cookie('collections_init') != "1") {
		/*
		Shadowbox.open({
			content:    '#bsc-perks-and-rewards',
			player:     "inline",
			title:      "",
			height:     600,
			width:      800
		});*/
		Shadowbox.open({
			content:    '#bsc-collection',
			player:     "inline",
			title:      "",
			height:     600,
			width:      839
		});
		//$jQuery.cookie('rewards_init', "1", { expires: 1 });
		$jQuery.cookie('collections_init', "1", { expires: 1 });
	}

	//Buy-Path Trigger
	if (bsc.isSignedIn()) {
		var location = bsc.getBuyPath();
		if (typeof(location) != "undefined" & location != false & location != 'false' & location != 'undefined' & location != '' & location != 'none') {
			window.location.href = 'http://bombayshirts.com' + location;
			bsc.setBuyPath('false');
		}
	}
	
});

$(window).scroll(function(){});

$L = function (c, d) {
    for (var b = c.length, e = b, f = function () {
            if (!(this.readyState
            		&& this.readyState !== "complete"
            		&& this.readyState !== "loaded")) {
                this.onload = this.onreadystatechange = null;
                --e || d()
            }
        }, g = document.getElementsByTagName("head")[0], i = function (h) {
            var a = document.createElement("script");
            a.async = true;
            a.src = h;
            a.onload = a.onreadystatechange = f;
            g.appendChild(a)
        }; b;) i(c[--b])
};

var scripts = [];
scripts[0] = 'http://platform.twitter.com/widgets.js';
scripts[1] = '//dashboard.canvass.in/res/js/NewsLetterSubScriberWidget.min.js';
//scripts[2] = '//dashboard.canvass.in/res/js/OnlineCustomerInteractionWidget.min.js';
scripts[2] = '//dashboard.canvass.in/res/js/OnlineReferralWidget.min.js';

$L(scripts, function () {
	window.canvass_nlsWidget.init("e90daf937d1cf3c1c3ceea45249ff6d81d43e594", {});
	
	var d = document.getElementsByTagName("head")[0];
	var css = document.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = document.location.protocol + "//dashboard.canvass.in/res/css/customerinteraction-widget.css";
	d.appendChild(css);
	
/* 	window.canvass_ciWidget.init("c38f7f03ff0b6f6109a236c013d6094334f8cc59", {
		widgetStyle: {
			width: "600px",
			height: "420px"
		},
		onload: function (msg) {
			window.canvass_ciWidget.show();
		}
	});  */
	
	var d = document.getElementsByTagName("head")[0];
	var css = document.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = document.location.protocol + "//dashboard.canvass.in/res/css/referral-widget.css";
	d.appendChild(css);
	
	window.referralWidget.init("1f8778648d876ad3c23979c3356392272621a4f0", {
	  label: 'Refer &amp; Earn',
	  position: 'EAST-HORIZONTAL',
	  widgetStyle: {
	  	width: "630px",
	  	height: "580px"
	  },
	  style: {},
	  onload: function(msg) {},
	  onclick: function(msg) {}
	});

	try {
	  window.referralWidget.hide();
	} catch (e) {}
});

$L(['//connect.facebook.net/en_US/all.js#xfbml=1&appId=374674915941246'], function () {
	//window.fbAsyncInit.hasRun = true;
	FB.init({
		appId: '374674915941246',
		status: true,
		cookie: true,
		xfbml: true
	});
});
