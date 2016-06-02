var bsc = {
	shirtContent: '',
	measurementsContent: "<p>Made to measure needs custom measurements or standard sizes that can be tweaked.<br />You've got options! <strong>Furnish</strong> your <strong>measurements</strong> or<br /><strong>send</strong> us your <strong>best fitting shirt</strong> to <strong>copy</strong>.</p>",
	customizationContent: "<p>Use our <strong>Simple</strong> options to customise your <strong>sleeve, shirt, collar, cuffs</strong> and <strong>monogram</strong>. <br />Or go <strong>Advanced</strong> to tweak <strong>buttons, plackets, pockets, back details</strong> and <strong>more</strong>. You can choose <strong>contrast colours</strong> for the various shirt elements under the <strong>Contrasts</strong> tab.</p>",
	shirtContent: "",
	menuAnimating: false,
	submenuAnimating: false,
	animating: false,
	customized: false,
	baseSize: 'default',
	allowGeneration: false,
	buyPath: 0,
	undo: {
		gender: '',
		measurement: '',
		male: {
			fit: '',
			collar: '',
			chest: '',
			waist: '',
			shirtLength: '',
			sleeveLength: '',
			shoulder: '',
			biceps: '',
			cuffs: ''
		},
		
		female: {
			bust: '',
			waist: '',
			hips: '',
			shirtLength: '',
			sleeveLength: ''
		}
	},

	init: function() {
		bsc.removeDuplicateCheckout();
		bsc.createMeasurementsExpandable();
		bsc.checkProfileGender();
		bsc.initHomepageMenu();
		
		//Clear customizations for product data
		$jQuery('#productData label:contains("Customizations")').parent().find('textarea').val('None');
		
		//Initialize scrollbars for customizations
		bsc.initializeScrollBars();
		
		//Initialize fabric contrasts
		$jQuery('#advanced, #contrasts').fadeOut(0);
		
		//Adjust measurements expandable
		$jQuery('.measurements').css("width", $jQuery('.measurements').attr('g'));
		$jQuery('.expandable-tab').find('> div').slideUp(0);
		$jQuery('.shirt-measurements').slideUp(0);
		
		//Hide checkout option variables
		$jQuery('label:contains("Travelling Tailor")').parent().hide();
		$jQuery('label:contains("Send Us a Shirt")').parent().hide();
		
		//Initialize saved/new base size
		bsc.initBaseSize();
		
		//Make measurement textboxes ready-only
		$jQuery('.measurement-regulator input').attr('readonly', 'readonly');
		$jQuery('.updated-field input').attr('readonly', 'readonly');
		
		//Disable cart modfications
		$jQuery('#cart_items label:contains("Fit")').parent().find('select').attr('disabled', 'disabled').addClass('readonly');
		$jQuery('#cart_items label:contains("Size")').parent().find('select').attr('disabled', 'disabled').addClass('readonly');
		$jQuery('#cart_items label:contains("Customizations")').parent().find('textarea').attr('disabled', 'disabled').addClass('readonly');
		
		//Set base fabric for image generation
		bsc.imageVariables.bsc['fabric'] = $jQuery('#fabricCode').html();
		
		if (!bsc.isSignedIn()) {
			$('.measurements .lastUpdated').remove();
			$('.measurements .measurements-expand').attr('name', '');
			$('.measurements .measurements-expand').attr('action', '');
			$('.measurements .measurements-expand').attr('method', '');
			$('.measurements .measurements-expand').removeClass('cm-ajax');
		}
		
		//Collection Slider
		bsc.collectionSlider();
		
		//Generate image if custom shirt
		if ($jQuery('#shirt-customization').is(':visible')) {
			bsc.generateImage();
		}
		
		bsc.animateToElement('#to-top', '#ci_top_wrapper');
	},
	
	animateToElement: function(element, scrollTo) {
		$jQuery(element).click(function(e) {
			$('html, body').animate({
				scrollTop: $(scrollTo).offset().top
			}, 2000);
			
			e.preventDefault();
			return false;
		});
	},
	
	initHomepage: function() {
		//Init How it Works Slider
		$jQuery('.bxslider').bxSlider({
			slideWidth: '1170px',
			//pager: false,
			pagerCustom: '#how-it-works-pager',
			hideControlOnEnd: true,
			infiniteLoop: false,
			onSlideBefore: function(){
				$jQuery('.how-it-works-first a').trigger('click');
			}
		});
		
		
		//Where to Buy fade animation
		$jQuery('#where-to-buy li').hover(function() {
			var li = $jQuery(this).parent().find('li').not(this);
			$jQuery(li).stop(true, false).animate({
				opacity: 0.25
			},'fast');
		}, function() {
			var li = $jQuery(this).parent().find('li').not(this);
			$jQuery(li).stop(true, false).animate({
				opacity: 1.0
			});
		});
		
		//Measurement homepage animation
		
		
		$("#home-about-us a.video img").hover(function(){
			$("#home-about-us a.measurements img").stop().animate({"opacity": 0.25});
			
		},function(){
			$("#home-about-us a.measurements img").stop().animate({"opacity": 1});
		});
		
		$("#home-about-us a.measurements img").hover(function(){
			$("#home-about-us a.video img").stop().animate({"opacity": 0.25});
			
		},function(){
			$("#home-about-us a.video img").stop().animate({"opacity": 1});
		});
		
		//Top menu fade animation
		/*$jQuery('#top-menu li').hover(function() {
			var li = $jQuery(this).parent().find('> li').not(this);
			$jQuery(li).stop(true, false).animate({
				opacity: 0.5
			});
		}, function() {
			var mine = $jQuery(this).parent();
			var li = $jQuery(this).parent().find('> li').not(this);
			$jQuery(li).stop(true, false).animate({
				opacity: 1.0
			});
		});*/
		
		//How it Works Customizations 
		$jQuery('#how-it-works #shirt-customizations img').fadeOut(0);
		$jQuery('#how-it-works #shirt-customizations ul li').not('.divider').hover(function() {
			var linked = $jQuery(this).attr('class');
			var parent = $jQuery(this).parent().parent();
			
			parent.find('img').stop(true, false).fadeOut('fast');
			parent.find('img.' + linked).stop(true, true).fadeIn('fast');
			
			parent.find('.active').removeClass('active');
			$(this).addClass('active');
		}, function() {
			var parent = $jQuery(this).parent().parent();
			parent.find('.active').removeClass('active');
			parent.find('img').stop(true, false).fadeOut('fast');
		});
		
		$jQuery('.how-it-works-first a').click(function(e) {
			$(this).parent().fadeOut('normal');
			e.preventDefault();
			return false;
		});
		
		$jQuery('#how-it-works #shirt-customizations ul li a').click(function(e) {
			e.preventDefault();
		});
		
		$jQuery('.subscribe').hover(function() {
			$(this).find('span').stop(true, true).fadeIn('normal');
		}, function() {
			$(this).find('span').stop(true, true).fadeOut('normal');
		});
		
		$jQuery('.measure-body').hover(function() {
			$(this).find('span').stop(true, true).fadeIn('normal');
		}, function() {
			$(this).find('span').stop(true, true).fadeOut('normal');
		});
		
		$jQuery('.measure-shirt').hover(function() {
			$(this).find('span').stop(true, true).fadeIn('normal');
		}, function() {
			$(this).find('span').stop(true, true).fadeOut('normal');
		});
	},
	
	initializeScrollBars: function() {
		var defaults = {
			'mouseWheel': true,
			theme : 'dark-thick'
		};
		
		$("#collar-style > div").mCustomScrollbar(defaults);
		$("#contrast-cuff-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-collar-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-placket-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-elbow-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-shoulder-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-collar-piping-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-cuff-piping-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-placket-piping-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-pocket-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-elbow-swatch > div").mCustomScrollbar(defaults);
		$("#contrast-shoulder-swatch > div").mCustomScrollbar(defaults);
	},
	
	initBaseSize: function() {
		var element = $jQuery('label:contains("Base Size")').parent().find('input');
		var gender = $jQuery('.gender input:checked').val() == 1 ? 'men' : 'women';
		element.parent().hide();

		if (gender = 'men') {
			bsc.baseSize = bsc.computeBaseSizes(element.val(), 'm');
		} else {
			bsc.baseSize = bsc.computeBaseSizes(element.val(), 'w');
		}
		
		if (!bsc.isSignedIn()) {
			var sizeElement = $jQuery('.pre-defined-sizes a').find('#' + bsc.baseSize);
			sizeElement.parent().addClass('active');
			bsc.populateLimiters(bsc.baseSize);
		} else {
			$jQuery('.pre-defined-sizes a#' + bsc.baseSize).addClass('active');
		}
		
		bsc.populateLimiters(bsc.baseSize);
	},
	
	selectBaseSize: function(){
		var size = $jQuery('.pre-defined-sizes a.active').attr('id');
		if (size != "" && typeof size !== "undefined") {
			bsc.populateSizes(size);
			bsc.baseSize = size;
		}
	},
	
	saveBaseSize: function() {
		var sizeElement = $jQuery('.base-size').find('input');
		var newSize = $jQuery('.pre-defined-sizes a.active').attr('id');
		$jQuery(sizeElement).val(newSize);
	},
	
	removeDuplicateCheckout: function() {
		if ($jQuery('#shirt-customization').is(':visible')) {
			$jQuery('#productData .accordion-dos').remove();
		} else {
			$jQuery('#shirt-customization').remove();
		}
	},
	
	collectionSlider: function() {
		if($jQuery.cookie('collections_slider') != "1") {
			setTimeout(function() {
				$('.homepage .collection-slider').slideDown(1000, 'swing');
				/*
				$('.homepageMenu').each(function() {
					var menuTop = $('.homepageMenu').css('margin-top');
					
					$(this).animate({
						'margin-top': -245
					}, 1000, 'swing');
				});
				*/
			}, 1000);
			
			$jQuery.cookie('collections_slider', "1", { expires: 1 });
		}
		
		//Collections Slider Close
		$jQuery('.collection-slider .close').click(function() {
			$('.homepage .collection-slider').slideUp(1000, 'swing');
		});
	},
	
	isSignedIn: function() {
		if ($jQuery('.cm-dialog-opener.account').length > 0) {
			return false;
		}
		
		return true;
	},
	
	openSignIn: function() {
		$('.unlogged').trigger('click');
		$('.account').trigger('click');
	},
	
	setBuyPath: function(buyPath) {
		$jQuery.cookie('bsc_buy_path', buyPath);
	},
	
	getBuyPath: function() {
		return $jQuery.cookie('bsc_buy_path');
	},
	
	initHomepageMenu: function() {
		$jQuery('#home-menu ul li p:not(.solo)').fadeOut(0);
		$jQuery('#home-menu h1 a').hoverIntent(function() {
			$jQuery(this).parent().parent().find('p').stop(true, true).fadeIn('fast');
		}, function() {
			$jQuery(this).parent().parent().find('p').stop(true, true).fadeOut('fast');
		});
	},
	
	
	createMeasurementsExpandable: function() {
		var container = $jQuery('.men-collar').parent();
		container.addClass('measurements-expand');
		
		var predefined = '<div class="split-left resize"><h1>Step 3</h1></div><div class="split-right resize"><p>Select a size that best reflects your <b>final shirt</b> measurements, in inches. You can tweak the values that appear to arrive at your custom measurements. For help visit our <a class="_blank" href="measuring.html">How to Measure</a> page.</p></div><ul class="pre-defined-sizes floatClear male regular"> <li>BASE SIZE:</li><li> <a href="" id="M36">36<br/>(XS)</a> </li><li> <a href="" id="M38">38<br/>(S)</a> </li><li> <a href="" id="M40">40<br/>(M)</a> </li><li> <a href="" id="M42">42<br/>(L)</a> </li><li> <a href="" id="M44">44<br/>(XL)</a> </li><li> <a href="" id="M46">46<br/>(XXL)</a> </li><li> <a href="" id="M48">48<br/>(XXXL)</a> </li></ul><ul class="pre-defined-sizes floatClear male slim"> <li>BASE SIZE:</li><li> <a href="" id="M36">36<br/>(XS)</a> </li><li> <a href="" id="M38">38<br/>(S)</a> </li><li> <a href="" id="M40">40<br/>(M)</a> </li><li> <a href="" id="M42">42<br/>(L)</a> </li><li> <a href="" id="M44">44<br/>(XL)</a> </li></ul><ul class="pre-defined-sizes floatClear female"> <li>BASE SIZE:</li><li> <a href="" id="W0">0</a> </li><li> <a href="" id="W2">2</a> </li><li> <a href="" id="W4">4</a> </li><li> <a href="" id="W6">6</a> </li><li> <a href="" id="W8">8</a> </li><li> <a href="" id="W10">10</a> </li></ul>';
		
		if ($jQuery('.measurement-type').find('input[type=radio]:checked').val() == 4) {
			$jQuery('.measurement-type').find('label').html('What kind of measurements are you using? <span title="For shirt measurements, the shirt we make will be exactly to those specifications and the fit is irrelevant.">(?)</span>');
		} else {
			$jQuery('.measurement-type').hide();
		}
		
		$jQuery('.fit').find('label').html('What kind of fit do you prefer to wear? <span title="Relaxed fit implies ample breathing margin around the chest, waist and arms. Slim fit shirts are more fitted around the same areas.">(?)</span>');
		
		$jQuery(predefined).insertAfter('.fit');
		
		var undo = '<div class="undo"><a href="" title="Revert back to the settings saved in your profile.">Undo</a></div>';
		$jQuery(undo).insertAfter('.saveTip');
		$jQuery('.undo').click(function(e) {
			bsc.undoClick();
			e.preventDefault();
		});
		bsc.populateUndo();
		
		bsc.insertMeasurementRegulators();
	},
	
	populateUndo: function() {
		bsc.undo.gender = $jQuery('.gender input:checked').val() == 1 ? 1 : 2;
		bsc.undo.measurement = $jQuery('.measurement-type input:checked').val() == 4 ? 4 : 3;
		
		if (bsc.undo.gender == 1) {
			bsc.undo.male.fit = $jQuery('.fit input:checked').val() == 6 ? 6 : 5;
			
			bsc.undo.male.collar = $jQuery('.men-collar input').val();
			bsc.undo.male.chest = $jQuery('.men-chest input').val();
			bsc.undo.male.waist = $jQuery('.men-waist input').val();
			bsc.undo.male.shirtLength = $jQuery('.men-shirt-length input').val();
			bsc.undo.male.sleeveLength = $jQuery('.men-sleeve-length input').val();
			bsc.undo.male.shoulder = $jQuery('.men-shoulder input').val();
			bsc.undo.male.cuffs = $jQuery('.men-cuffs input').val();
			bsc.undo.male.biceps = $jQuery('.men-biceps input').val();
			
			bsc.undo.female.bust = '';
			bsc.undo.female.waist = '';
			bsc.undo.female.hips = '';
			bsc.undo.female.shirtLength = '';
			bsc.undo.female.sleeveLength = '';
			
		} else {
			bsc.undo.female.bust = $jQuery('.women-bust input').val();
			bsc.undo.female.waist = $jQuery('.women-waist input').val();
			bsc.undo.female.hips = $jQuery('.women-hips input').val();
			bsc.undo.female.shirtLength = $jQuery('.women-shirt-length input').val();
			bsc.undo.female.sleeveLength = $jQuery('.women-sleeve-length input').val();
			
			bsc.undo.male.collar  = '';
			bsc.undo.male.chest = '';
			bsc.undo.male.waist = '';
			bsc.undo.male.shirtLength = '';
			bsc.undo.male.sleeveLength = '';
			bsc.undo.male.shoulder = '';
			bsc.undo.male.cuffs = '';
			bsc.undo.male.biceps = '';
		}
	},

	undoClick: function() {
		$jQuery('.gender input[value="' + bsc.undo.gender + '"]').attr('checked', 'checked');
		$jQuery('.measurement-type input[value="' + bsc.undo.measurement + '"]').attr('checked', 'checked');

		if (bsc.undo.gender == 1) {
			$jQuery('.fit input[value="' + bsc.undo.male.fit + '"]').attr('checked', 'checked');
		} else {
			$jQuery('.fit input[value="5"]').removeAttr('checked');
			$jQuery('.fit input[value="6"]').removeAttr('checked');
		}

		$jQuery('.men-collar input').val(bsc.undo.male.collar);
		$jQuery('.men-chest input').val(bsc.undo.male.chest);
		$jQuery('.men-waist input').val(bsc.undo.male.waist);
		$jQuery('.men-shirt-length input').val(bsc.undo.male.shirtLength);
		$jQuery('.men-sleeve-length input').val(bsc.undo.male.sleeveLength);
		$jQuery('.men-shoulder input').val(bsc.undo.male.shoulder);
		$jQuery('.men-biceps input').val(bsc.undo.male.biceps);
		$jQuery('.men-cuffs input').val(bsc.undo.male.cuffs);

		$jQuery('.women-bust input').val(bsc.undo.female.bust);
		$jQuery('.women-waist input').val(bsc.undo.female.waist);
		$jQuery('.women-hips input').val(bsc.undo.female.hips);
		$jQuery('.women-shirt-length input').val(bsc.undo.female.shirtLength);
		$jQuery('.women-sleeve-length input').val(bsc.undo.female.sleeveLength);
		
		bsc.checkProfileGender();
	},
	
	insertMeasurementRegulators: function() {
		var inputs = $jQuery('.my_account_profile .measurements-expand [class^="form-field men-"] input, .my_account_profile .measurements-expand [class^="form-field women-"] input');
		$jQuery(inputs).wrap('<div class="measurement-regulator floatClear">');
		$jQuery('<a class="cm-increase"></a>').insertBefore(inputs);
		$jQuery('<a class="cm-decrease"></a>').insertAfter(inputs);
	},
	
	measurementIncrease: function(input) {
		var limit = parseFloat($jQuery(input).attr('max'));
		var value = parseFloat($jQuery(input).val() == "" ? limit : $jQuery(input).val());
		if (value < limit) {
			value += 0.5;
		}
		
		$jQuery(input).val(value.toFixed(2));
	},
	
	measurementDecrease: function(input) {
		var limit = parseFloat($jQuery(input).attr('min'));
		var value = parseFloat($jQuery(input).val() == "" ? limit : $jQuery(input).val());
		
		if (value > limit) {
			value -= 0.5;
		}
		
		$jQuery(input).val(value.toFixed(2));
	},
	
	productMoreClick: function(more) {
		var overlay = $jQuery('.product-data-horizontal .data-overlay');
		var content = $jQuery(more).find('span').html();
		
		overlay.find('.content').html(content);
		
		overlay.slideDown('slow');
	},
	
	productMoreCloseClick: function() {
		var overlay = $jQuery('.product-data-horizontal .data-overlay');
		overlay.slideUp('slow');
	},

	expandableClick: function(tab) {
		$jQuery('.expandable-tab > div').slideUp('slow', 'swing');
		tab.find('> div').css("height", tab.find('> div').height());
		tab.find('> div').stop(true, false).slideDown('slow', 'swing');
		bsc.checkProfileGender();
	},

	measurementsContentSwitch: function() {
		var area = $jQuery('.product-description');
		var old = area.html();
		area.find('p').fadeOut(1500, function() {
			area.find('p').remove();
			area.html(bsc.measurementsContent);
			area.find('p').fadeOut(0).fadeIn(1500, function() {
				bsc.shirtContent = old;
			});
		});
	},
	
	customizationContentSwitch: function() {
		var area = $jQuery('.product-description');
		var old = area.html();
		area.find('p').fadeOut(1500, function() {
			area.find('p').remove();
			area.html(bsc.customizationContent);
			area.find('p').fadeOut(0).fadeIn(1500, function() {
				bsc.shirtContent = old;
			});
		});
	},

	shirtContentSwitch: function() {
		var area = $jQuery('.product-description');
		area.find('p').fadeOut(1500, function() {
			area.find('p').remove();
			area.html(bsc.shirtContent);
			area.find('p').fadeOut(0).fadeIn(1500, function() {});
		});
	},
	
	computeBaseSizes: function(size, gender) {
		
		if (gender == 'm') {
			switch(size) {
				case 'M36':
				case 'M38':
				case 'M40':
				case 'M42':
				case 'M44':
				case 'M46':
				case 'M48':
					return size;
					
				case 'small':
					return 'M36';
					
				case 'medium':
					return 'M38';
					
				case 'large':
					return 'M40';
					
				case 'extra-large':
					return 'M42';
					
				case 'default':
					return 'M38';
						
				default:
					return 'M38';
			}
		} else {
			switch(size) {
				case 'W0':
				case 'W2':
				case 'W4':
				case 'W6':
				case 'W8':
				case 'W10':
					return size;
					
				case 'extra-small':
					return 'W0';
					
				case 'small':
					return 'W2';
					
				case 'medium':
					return 'W4';
					
				case 'large':
					return 'W6';
					
				case 'extra-large':
					return 'W8';
					
				case 'default':
					return 'W4';
		
				default: 
					return 'W4';
			}
		}
	},
	
	checkProfileGender: function() {
		if ($jQuery('.gender input:checked').val() == 1) {
			//if Male
			if ($jQuery('.fit input:checked').val() == 6) {
				$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').show();
				$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').hide();
			} else {
				$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').hide();
				$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').show();
			}
			
			$jQuery('*[class^="form-field men-"]').show();
			$jQuery('*[class^="form-field women-"]').hide();
			$jQuery('*[class^="pre-defined-sizes floatClear female"]').hide();
			bsc.checkMeasurementType();
		} else {
			//if Female
			$jQuery('*[class^="form-field men-"]').hide();
			$jQuery('*[class^="form-field women-"]').show();
			$jQuery('*[class^="pre-defined-sizes floatClear female"]').show();
			$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').hide();
			$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').hide();
			bsc.checkMeasurementType();
		}
		
		bsc.populateLimiters(bsc.baseSize);
	},
	
	checkMeasurementType: function() {
		if ($jQuery('.gender input:checked').val() == 1) {
			$jQuery('*[class^="form-field fit"]').slideDown('slow');
		} else {
			$jQuery('*[class^="form-field fit"]').slideUp('slow');
		}
	},
	
	populateSizes: function(size) {
		var gender = $jQuery('.gender input:checked').val() == 1 ? 'men' : 'women';
		var measure = $jQuery('.measurement-type input:checked').val() == 3 ? 's' : 'b';
		var fit = $jQuery('.fit input:checked').val() == 6 ? 'r' : 's';
		
		var element = "";
		if (gender == "men") {
			if (measure == "b") {
				element = gender + '-' + measure + '-';
			}
			else{
				element = gender + '-' + measure + '-' + fit + '-';
			}
		} else {
			element = gender + '-' + measure + '-';
		} 
		
		$jQuery('.men-collar input').val(bsc.measurements[size][element + 'collar']);
		$jQuery('.men-chest input').val(bsc.measurements[size][element + 'chest']);
		$jQuery('.men-waist input').val(bsc.measurements[size][element + 'waist']);
		$jQuery('.men-shirt-length input').val(bsc.measurements[size][element + 'shirt-length']);
		$jQuery('.men-sleeve-length input').val(bsc.measurements[size][element + 'sleeve-length']);
		$jQuery('.men-shoulder input').val(bsc.measurements[size][element + 'shoulder']);
		$jQuery('.men-biceps input').val(bsc.measurements[size][element + 'biceps']);
		$jQuery('.men-cuffs input').val(bsc.measurements[size][element + 'cuffs']);
		
		$jQuery('.women-bust input').val(bsc.measurements[size][element + 'bust'])
		$jQuery('.women-waist input').val(bsc.measurements[size][element + 'waist']);
		$jQuery('.women-hips input').val(bsc.measurements[size][element + 'hips']);
		$jQuery('.women-shirt-length input').val(bsc.measurements[size][element + 'shirt-length']);
		$jQuery('.women-sleeve-length input').val(bsc.measurements[size][element + 'sleeve-length']);
		
		bsc.populateLimiters(size);
	},
	
	populateLimiters: function(size) {
		var gender = $jQuery('.gender input:checked').val() == 1 ? 'men' : 'women';
		var measure = $jQuery('.measurement-type input:checked').val() == 3 ? 's' : 'b';
		var fit = $jQuery('.fit input:checked').val() == 6 ? 'r' : 's';
				
		var element = "";
		if (gender == "men") {
			size = bsc.computeBaseSizes(size, 'm');
			
			if (measure == "b") {
				element = gender + '-' + measure + '-';
			} else {
				element = gender + '-' + measure + '-' + fit + '-';
			}
			
		} else {
			size = bsc.computeBaseSizes(size, 'w');
			element = gender + '-' + measure + '-';
		}
		
		$jQuery('.men-collar input').attr('min', bsc.measurements[size][element + 'collar'] - 2);
		$jQuery('.men-collar input').attr('max', bsc.measurements[size][element + 'collar'] + 2);
		
		$jQuery('.men-chest input').attr('min', bsc.measurements[size][element + 'chest'] - 4);
		$jQuery('.men-chest input').attr('max', bsc.measurements[size][element + 'chest'] + 4);
		
		$jQuery('.men-waist input').attr('min', bsc.measurements[size][element + 'waist'] - 4);
		$jQuery('.men-waist input').attr('max', bsc.measurements[size][element + 'waist'] + 4);
		
		$jQuery('.men-shirt-length input').attr('min', bsc.measurements[size][element + 'shirt-length'] - 3);
		$jQuery('.men-shirt-length input').attr('max', bsc.measurements[size][element + 'shirt-length'] + 3);
		
		$jQuery('.men-sleeve-length input').attr('min', bsc.measurements[size][element + 'sleeve-length'] - 3);
		$jQuery('.men-sleeve-length input').attr('max', bsc.measurements[size][element + 'sleeve-length'] + 3);
		
		$jQuery('.men-shoulder input').attr('min', bsc.measurements[size][element + 'shoulder'] - 2);
		$jQuery('.men-shoulder input').attr('max', bsc.measurements[size][element + 'shoulder'] + 2);
		
		$jQuery('.men-biceps input').attr('min', bsc.measurements[size][element + 'biceps'] - 2);
		$jQuery('.men-biceps input').attr('max', bsc.measurements[size][element + 'biceps'] + 2);

		$jQuery('.men-cuffs input').attr('min', bsc.measurements[size][element + 'cuffs'] - 3);
		$jQuery('.men-cuffs input').attr('max', bsc.measurements[size][element + 'cuffs'] + 3);
		
		$jQuery('.women-bust input').attr('min', bsc.measurements[size][element + 'bust'] - 4);
		$jQuery('.women-bust input').attr('max', bsc.measurements[size][element + 'bust'] + 4);
		
		$jQuery('.women-waist input').attr('min', bsc.measurements[size][element + 'waist'] - 4);
		$jQuery('.women-waist input').attr('max', bsc.measurements[size][element + 'waist'] + 4);
		
		$jQuery('.women-hips input').attr('min', bsc.measurements[size][element + 'hips'] - 4);
		$jQuery('.women-hips input').attr('max', bsc.measurements[size][element + 'hips'] + 4);
		
		$jQuery('.women-shirt-length input').attr('min', bsc.measurements[size][element + 'shirt-length'] - 3);
		$jQuery('.women-shirt-length input').attr('max', bsc.measurements[size][element + 'shirt-length'] + 3);
		
		$jQuery('.women-sleeve-length input').attr('min', bsc.measurements[size][element + 'sleeve-length'] - 3);
		$jQuery('.women-sleeve-length input').attr('max', bsc.measurements[size][element + 'sleeve-length'] + 3);
		
	},
	
	measurements: {
		W0: {
			'women-s-bust': 35,
			'women-s-waist': 29,
			'women-s-hips': 35,
			'women-s-shirt-length': 24,
			'women-s-sleeve-length': 22,	
			'women-s-biceps': 12.5,	
			'women-s-cuffs': 8,	

			'women-b-bust': 32,
			'women-b-waist': 26,
			'women-b-hips': 32,
			'women-b-shirt-length': 24,
			'women-b-sleeve-length': 22
		},
		
		W2: {
			'women-s-bust': 37,
			'women-s-waist': 31,
			'women-s-hips': 37,
			'women-s-shirt-length': 24.5,
			'women-s-sleeve-length': 22.5,		
			'women-s-biceps': 13,	
			'women-s-cuffs': 8,	

			'women-b-bust': 34,
			'women-b-waist': 28,
			'women-b-hips': 34,
			'women-b-shirt-length': 24.5,
			'women-b-sleeve-length': 22.5
		},
		
		W4: {
			'women-s-bust': 40,
			'women-s-waist': 34,
			'women-s-hips': 40,
			'women-s-shirt-length': 25,
			'women-s-sleeve-length': 23.5,	
			'women-s-biceps': 13.5,	
			'women-s-cuffs': 9,	

			'women-b-bust': 36,
			'women-b-waist': 30,
			'women-b-hips': 36,
			'women-b-shirt-length': 25,
			'women-b-sleeve-length': 23.5	
		},
		
		W6: {
			'women-s-bust': 42,
			'women-s-waist': 36,
			'women-s-hips': 42,
			'women-s-shirt-length': 25.5,
			'women-s-sleeve-length': 23.5,	
			'women-s-biceps': 14,	
			'women-s-cuffs': 9.5,	

			'women-b-bust': 38,
			'women-b-waist': 32,
			'women-b-hips': 38,
			'women-b-shirt-length': 25.5,
			'women-b-sleeve-length': 23.5
		},
		
		W8: { // Update
			'women-s-bust': 44,
			'women-s-waist': 38,
			'women-s-hips': 44,
			'women-s-shirt-length': 26,
			'women-s-sleeve-length': 24,	
			'women-s-biceps': 14.5,	
			'women-s-cuffs': 10,	

			'women-b-bust': 40,
			'women-b-waist': 34,
			'women-b-hips': 40,
			'women-b-shirt-length': 26,
			'women-b-sleeve-length': 24
		},
		
		W10: { // Update
			'women-s-bust': 46,
			'women-s-waist': 40,
			'women-s-hips': 46,
			'women-s-shirt-length': 26,
			'women-s-sleeve-length': 24,	
			'women-s-biceps': 15,	
			'women-s-cuffs': 10,	

			'women-b-bust': 42,
			'women-b-waist': 36,
			'women-b-hips': 42,
			'women-b-shirt-length': 26,
			'women-b-sleeve-length': 24
		},
		
		M36: { //Update
			'men-s-r-collar': 15,
			'men-s-r-chest': 40,
			'men-s-r-waist': 38,
			'men-s-r-shirt-length': 28,
			'men-s-r-sleeve-length': 24,
			'men-s-r-shoulder': 16.5,
			'men-s-r-biceps': 14,	
			'men-s-r-cuffs': 8.5,	
			
			'men-s-s-collar': 15,
			'men-s-s-chest': 39,
			'men-s-s-waist': 36,
			'men-s-s-shirt-length': 28,
			'men-s-s-sleeve-length': 24,
			'men-s-s-shoulder': 16.5,
			'men-s-s-biceps': 13.5,	
			'men-s-s-cuffs': 8.5,	
			
			'men-b-collar': 15,
			'men-b-chest': 36,
			'men-b-waist': 34,
			'men-b-shirt-length': 28,
			'men-b-sleeve-length': 24,
			'men-b-shoulder': 16.5,
		},
		
		M38: {
			'men-s-r-collar': 15.5,
			'men-s-r-chest': 42,
			'men-s-r-waist': 40,
			'men-s-r-shirt-length': 29,
			'men-s-r-sleeve-length': 24.5,
			'men-s-r-shoulder': 17,
			'men-s-r-biceps': 15.5,	
			'men-s-r-cuffs': 9,	
			
			'men-s-s-collar': 15.5,
			'men-s-s-chest': 41,
			'men-s-s-waist': 38,
			'men-s-s-shirt-length': 29,
			'men-s-s-sleeve-length': 24.5,
			'men-s-s-shoulder': 17,
			'men-s-s-biceps': 15,	
			'men-s-s-cuffs': 9,	
			
			'men-b-collar': 15.5,
			'men-b-chest': 38,
			'men-b-waist': 36,
			'men-b-shirt-length': 29,
			'men-b-sleeve-length': 24.5,
			'men-b-shoulder': 17,
		},
		
		M40: {
			'men-s-r-collar': 16,
			'men-s-r-chest': 44,
			'men-s-r-waist': 42,
			'men-s-r-shirt-length': 30,
			'men-s-r-sleeve-length': 25,
			'men-s-r-shoulder': 17.5,
			'men-s-r-biceps': 16.5,	
			'men-s-r-cuffs': 9.5,	
						
			'men-s-s-collar': 16,
			'men-s-s-chest': 43,
			'men-s-s-waist': 40,
			'men-s-s-shirt-length': 30,
			'men-s-s-sleeve-length': 25,
			'men-s-s-shoulder': 17.5,
			'men-s-s-biceps': 16,	
			'men-s-s-cuffs': 9.5,
			
			'men-b-collar': 16,
			'men-b-chest': 40,
			'men-b-waist': 38,
			'men-b-shirt-length': 30,
			'men-b-sleeve-length': 25,
			'men-b-shoulder': 17.5,
		},
		
		M42: {	
			'men-s-r-collar': 16.5,
			'men-s-r-chest': 47,
			'men-s-r-waist': 45.5,
			'men-s-r-shirt-length': 31,
			'men-s-r-sleeve-length': 25.5,
			'men-s-r-shoulder': 18,
			'men-s-r-biceps': 17.5,	
			'men-s-r-cuffs': 10,
			
			'men-s-s-collar': 16.5,
			'men-s-s-chest': 46,
			'men-s-s-waist': 43,
			'men-s-s-shirt-length': 31,
			'men-s-s-sleeve-length': 25.5,
			'men-s-s-shoulder': 18,
			'men-s-s-biceps': 17,	
			'men-s-s-cuffs': 10,
			
			'men-b-collar': 16.5,
			'men-b-chest': 42,
			'men-b-waist': 40,
			'men-b-shirt-length': 31,
			'men-b-sleeve-length': 25.5,
			'men-b-shoulder': 18,
		},
		
		M44: {
			'men-s-s-collar': 17.25,
			'men-s-s-chest': 48,
			'men-s-s-waist': 45,
			'men-s-s-shirt-length': 31.5,
			'men-s-s-sleeve-length': 26,
			'men-s-s-shoulder': 18.5,
			'men-s-s-biceps': 18.5,	
			'men-s-s-cuffs': 10.5,
			
			'men-s-r-collar': 17.25,
			'men-s-r-chest': 50,
			'men-s-r-waist': 48.5,
			'men-s-r-shirt-length': 31.5,
			'men-s-r-sleeve-length': 26,
			'men-s-r-shoulder': 19,
			'men-s-r-biceps': 18,	
			'men-s-r-cuffs': 10.5,	
			
			
			'men-b-collar': 17.25,
			'men-b-chest': 44,
			'men-b-waist': 42,
			'men-b-shirt-length': 31.5,
			'men-b-sleeve-length': 26,
			'men-b-shoulder': 19,
		},
		
		M46: { //Update
			'men-s-r-collar': 17.5,
			'men-s-r-chest': 54,
			'men-s-r-waist': 52.5,
			'men-s-r-shirt-length': 32,
			'men-s-r-sleeve-length': 26,
			'men-s-r-shoulder': 19.5,	
			'men-s-r-biceps': 19.5,	
			'men-s-r-cuffs': 11,
			
			'men-b-collar': 17.5,
			'men-b-chest': 46,
			'men-b-waist': 44,
			'men-b-shirt-length': 32,
			'men-b-sleeve-length': 26,
			'men-b-shoulder': 19.5
		},
		
		M48: { //Update
			'men-s-r-collar': 18,
			'men-s-r-chest': 58,
			'men-s-r-waist': 56,
			'men-s-r-shirt-length': 32,
			'men-s-r-sleeve-length': 26,
			'men-s-r-shoulder': 20,
			'men-s-r-biceps': 21,	
			'men-s-r-cuffs': 11,	
			
			'men-b-collar': 18,
			'men-b-chest': 48,
			'men-b-waist': 46,
			'men-b-shirt-length': 32,
			'men-b-sleeve-length': 26,
			'men-b-shoulder': 20
		}
	},
	
	toggleMenFitSizes: function(toggle) {
		var select = $jQuery('.custom-size');
		var O46 = select.find('option:contains("46")');
		var O48 = select.find('option:contains("48")');
		
		if (toggle) {
			O46.css('display', 'block');
			O48.css('display', 'block');
		} else {
			O46.css('display', 'none');
			O48.css('display', 'none');
		}
		
		select.find('option:selected').prop("selected", false);
	},
	
	populateSelected: function(option) {
		var def = "";
		$jQuery(option).closest('.ui-accordion-content').find('.defaultSection').each(function() {
			def += $(this).attr('default') + " + ";
		});
		def = def.slice(0, -3);
		
		var index = $jQuery('#accordion').children('.ui-accordion-content').index($(option).closest('.customization-section').parent());
		$jQuery('#accordion').find('h3:eq(' + index + ')').find('span.right').html(def);
	},
	
	customizationOptionClick: function(option) {
		var title = $jQuery(option).find('h2').html();
		var parent = $jQuery(option).parent();
		var isMultiple = parent.closest('.subsection').hasClass('multiple') ? true: false;
		
		if (isMultiple) {
			var subsection = parent.closest('.customization-section');
			subsection.find('.multiple .active').removeClass('active');
		}
		
		parent.parent().find('.active').removeClass('active');
		parent.addClass('active');

		$jQuery(option).closest('.defaultSection').attr('default', title);
		bsc.populateSelected(option);
	},
	
	customizationSelectOptionChange: function(option) {
		var value = option.value;
		$jQuery(option).closest('.subsection').attr('default', value);
		bsc.populateSelected(option);
	},
	
	customizationPopulate: function() {},
	
	customizations: {
		'Sleeve Style': 'Long',
		'Bottom Cut Style': 'Modern',
		
		'Collar Style': 'Prince Charlie',
		'Collar Height': 'Normal Collar',
		'Collar Stiffness': 'Stiff',
		'Contrast Collar Style': '',
		'Contrast Collar Swatch': '',
		'Collar Piping Style': '',
		'Collar Piping Contrast': '',
		
		'Button': 'White',
		'Button Style': 'Single Button Placket',
		'Button Hole Colour': 'White',
		
		'Cuff Style': 'Single Convertible',
		'Cuff Shape': 'Angled',
		'Cuff Stiffness': 'Stiff',
		'Contrast Cuff Style': '',
		'Contrast Cuff Swatch': '',
		
		'Pockets Style': 'No Pocket',
		'Pockets Placement': '',

		'Placket Style': 'French Front',
		'Placket Angled': '',
		'Contrast Placket Style': '',
		'Contrast Placket Swatch': '',
		'Placket Piping Style': '',
		'Placket Piping Contrast': '',
		
		'Back Style': 'No Pleats',
		
		'Epaulettes': '',
		'Epaulette Swatch': '',
		
		'Elbow Patch': '',
		'Elbow Patch Swatch': '',

		'Monogram Style': '',
		//'Monogram Font': '',
		'Monogram Text': '',
		'Monogram Color': ''
	},
	
	createCustomizationsString: function(measurement) {
		var customizations = "";
		for (var option in bsc.customizations) {
			if (bsc.customizations[option] != '') {
				customizations += option + ': ' + bsc.customizations[option] + ', ';
			}
		}
		
		if (measurement) {
			var options = $('.measurements .measurements-expand .form-field:visible').each(function() {
				var label = $(this).find('label').text();
				var value = "";
				
				if ($(this).hasClass('form-radio')) {
					var value = $(this).find('.radio:checked').next('span:first').text();
				} else if ($(this).hasClass('form-input')) {
					var value = $(this).find('input').val();
				}
				
				label = label.replace(' *', '');
				label = label.replace(' (?)', '');
				customizations += label + ': ' + value + ', ';
			});
		}
		
		customizations = customizations.substring(0, customizations.length - 2);
		$jQuery('label:contains("Customizations")').parent().find('textarea').val(customizations);
	},
	
	disableCuffs: function() {
		$jQuery('.cuffMenu').hide();
		
		bsc.customizations['Cuff Style'] = '';
		bsc.customizations['Cuff Height'] = '';
		bsc.customizations['Cuff Stiffness'] = '';
		bsc.customizations['Contrast Cuff Style'] = '';
		bsc.customizations['Contrast Cuff Swatch'] = '';
	},
	
	enableCuffs: function() {
		$jQuery('.cuffMenu').show();
	},
	
	
	disableElbow: function() {
		$jQuery('.elbowOption').hide();
		bsc.customizations['Elbow Patch Swatch'] = '';

		bsc.disableElbowSwatch();
	},
	
	enableElbow: function() {
		$jQuery('.elbowOption').show();
	},
	
	disableElbowSwatch: function() {
		$jQuery('#contrast-elbow').hide();
		
		bsc.customizations['Elbow Patch'] = '';
		bsc.customizations['Elbow Patch Swatch'] = '';
	},
	
	enableElbowSwatch: function() {
		$jQuery('#contrast-elbow').show(0, function() {
			$("#contrast-elbow-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-elbow .option.active').exists()) {
			$jQuery('#contrast-elbow .option:first a').trigger('click');
		} 
	},
	
	disableShoulder: function() {
		$jQuery('.epauletteOption').hide();
		bsc.customizations['Epaulette Swatch'] = '';

		bsc.disableShoulderSwatch();
	},
	
	enableShoulder: function() {
		$jQuery('.epauletteOption').show();
	},
	
	disableShoulderSwatch: function() {
		$jQuery('.contrast-shoulder-swatch').hide();
		
		bsc.customizations['Epaulettes'] = '';
		bsc.customizations['Epaulette Swatch'] = '';
	},
	
	enableShoulderSwatch: function() {
		$jQuery('.contrast-shoulder-swatch').show();
		$jQuery('#contrast-shoulders').show(0, function() {
			$("#contrast-shoulder-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-shoulders .option.active').exists()) {
			$jQuery('#contrast-shoulders .option:first a').trigger('click');
		}
	},
	
	disablePocketSwatch: function() {
		$jQuery('.pocketOption').hide();
		
		bsc.customizations['Contrast Pocket Style'] = '';
		bsc.customizations['Contrast Pocket Swatch'] = '';
	},
	
	enablePocketSwatch: function() {
		$jQuery('.pocketOption').show(0, function() {
			$("#contrast-pocket-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-pocket-swatch .option.active').exists()) {
			$jQuery('#contrast-pocket-swatch .option:first a').trigger('click');
		}
	},
	
	disableMonogram: function() {
		$jQuery('.monogramOption').hide();
		
		bsc.customizations['Monogram Style'] = '';
		//bsc.customizations['Monogram Font'] = '';
		bsc.customizations['Monogram Text'] = '';
		bsc.customizations['Monogram Color'] = '';
	},
	
	enableMonogram: function() {
		$jQuery('.monogramOption').show();
		
		if (!$jQuery('#monogram-color .option.active').exists()) {
			$jQuery('#monogram-color .option:first a').trigger('click');
		}
	},
	
	disableCollarSwatch: function() {
		$jQuery('.collarOption').hide();
		
		bsc.customizations['Contrast Collar Style'] = '';
		bsc.customizations['Contrast Collar Swatch'] = '';
	},
	
	enableCollarSwatch: function() {
		$jQuery('.collarOption').show(0, function() {
			$("#contrast-collar-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-collar-swatch .option.active').exists()) {
			$jQuery('#contrast-collar-swatch .option:first a').trigger('click');
		}
	},
	
	disablePlacketSwatch: function() {
		$jQuery('.placketOption').hide();
		
		bsc.customizations['Contrast Placket Style'] = '';
		bsc.customizations['Contrast Placket Swatch'] = '';
	},
	
	enablePlacketSwatch: function() {
		$jQuery('.placketOption').show(0, function() {
			$("#contrast-placket-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-placket-swatch .option.active').exists()) {
			$jQuery('#contrast-placket-swatch .option:first a').trigger('click');
		}
	},
	
	disableCuffSwatch: function() {
		$jQuery('.cuffOption').hide();
		
		bsc.customizations['Contrast Cuff Style'] = '';
		bsc.customizations['Contrast Cuff Swatch'] = '';
	},
	
	enableCuffSwatch: function() {
		$jQuery('.cuffOption').show(0, function() {
			$("#contrast-cuff-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-cuff-swatch .option.active').exists()) {
			$jQuery('#contrast-cuff-swatch .option:first a').trigger('click');
		} 
	},
	
	disableCuffPiping: function() {
		$jQuery('.cuffPipingOption').hide();

		bsc.customizations['Contrast Cuff Piping Style'] = '';
		bsc.customizations['Contrast Cuff Piping Swatch'] = '';
	},
	
	enableCuffPiping: function() {
		$jQuery('.cuffPipingOption').show(0, function() {
			$("#contrast-cuff-piping-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-cuff-piping-swatch .option.active').exists()) {
			$jQuery('#contrast-cuff-piping-swatch .option:first a').trigger('click');
		} 
	},
	
	disableCollarPiping: function() {
		$jQuery('.collarPipingOption').hide();

		bsc.customizations['Contrast Collar Piping Style'] = '';
		bsc.customizations['Contrast Collar Piping Swatch'] = '';
	},
	
	enableCollarPiping: function() {
		$jQuery('.collarPipingOption').show(0, function() {
			$("#contrast-collar-piping-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-collar-piping-swatch .option.active').exists()) {
			$jQuery('#contrast-collar-piping-swatch .option:first a').trigger('click');
		} 
	},
	
	disablePlacketPiping: function() {
		$jQuery('.placketPipingOption').hide();
		
		bsc.customizations['Contrast Placket Piping Style'] = '';
		bsc.customizations['Contrast Placket Piping Swatch'] = '';
	},
	
	enablePlacketPiping: function() {
		$jQuery('.placketPipingOption').show(0, function() {
			$("#contrast-placket-piping-swatch > div").mCustomScrollbar("update");
		});
		
		if (!$jQuery('#contrast-placket-piping-swatch .option.active').exists()) {
			$jQuery('#contrast-placket-piping-swatch .option:first a').trigger('click');
		} 
	},
	
	sleeveChange: function(sleeve) {
		if (sleeve == 'sleeve-long') {
			bsc.enableCuffs();
			bsc.enableElbow();
		}
		else {
			bsc.disableCuffs();
			bsc.disableElbow();
		}
	},
	
	monogramChange: function(monogram) {
		if (monogram == 'monogram-none') {
			bsc.disableMonogram();
		}
		else {
			bsc.enableMonogram();
		}
	},
	
	elbowPatchChange: function(elbowPatch) {
		if (elbowPatch == 'extras-elbow-none') {
			bsc.disableElbowSwatch();			
		} else {
			bsc.enableElbowSwatch();
		}
	},
	
	shoulderChange: function(shoulder) {
		if (shoulder == 'extras-shoulder-none') {
			bsc.disableShoulderSwatch();
		}
		else {
			bsc.enableShoulderSwatch();
		}
	},
	
	collarChange: function(collar) {
		if (collar == 'contrasts-collar-none') {
			bsc.disableCollarSwatch();
		}
		else {
			bsc.enableCollarSwatch();
		}
		bsc.collarContrast();
	},
	
	cuffChange: function(cuff) {
		if (cuff == 'contrasts-cuff-none') {
			bsc.disableCuffSwatch();
		}
		
		else {
			bsc.enableCuffSwatch();
		}
	},
	
	
	pipingCollarChange: function(piping) {
		if (piping == 'contrasts-collar-piping-none') {
			bsc.disableCollarPiping();
		}
		else {
			bsc.enableCollarPiping();
		}
		bsc.collarPipingContrast();
	},
	
	
	
	pipingCuffChange: function(piping) {
		if (piping == 'contrasts-cuff-piping-none') {
			bsc.disableCuffPiping();
		}
		else {
			bsc.enableCuffPiping();
		}
		bsc.cuffPipingContrast();
	},
	
	pipingPlacketChange: function(piping) {
		if (piping == 'contrasts-placket-piping-none') {
			bsc.disablePlacketPiping();
		}
		else {
			bsc.enablePlacketPiping();
		}
		bsc.placketPipingContrast();
	},
	
	placketChange: function(placket) {
		if (placket == 'contrasts-placket-none') {
			bsc.disablePlacketSwatch();
		}
		else {
			bsc.enablePlacketSwatch();
		}
	},
	
	pocketChange: function(pocket) {
		if (pocket != 'No Pocket') {
			$jQuery('#pocket-style .option:first a').trigger('click');
		} else {
			$jQuery('#pocket-style .option:last a').trigger('click');
			//bsc.customizations['Pockets Placement'] = '';
			//bsc.customizations['Pockets Style'] = '';
		}
	},
	
	pocketStyle: function() {
		var style = $jQuery('#pocket-style .option.active').attr('id');
		var placement = $jQuery('#pocket-placement :selected').val();
		
		if (placement == "Single Pocket") {
			bsc.imageVariables.bsc['pocket'] = 'single-' + style;
		} else if (placement == "Double Pocket") {
			bsc.imageVariables.bsc['pocket'] = 'double-' + style;
		} else {
			bsc.imageVariables.bsc['pocket'] = 'no-' + style;
		}
	},
	
	pocketStyleChange: function(style) {
		if ($jQuery(style).find('h2').text() != 'None' && $jQuery('#pocket-placement').prop("selectedIndex") == 0) {
			$jQuery('#pocket-placement').prop("selectedIndex", 1).change();
		}
	},
	
	pocketContrastChange: function(pocket) {
		if (pocket == 'contrasts-pocket-none') {
			bsc.disablePocketSwatch();	
		} else {
			bsc.enablePocketSwatch();
		}
		
		bsc.pocketContrast();
	},
	

	populateDefaultOptions: function(option, holder) {
		if ($jQuery('#' + option).hasClass('option')) {
			$jQuery('#' + option + ' a').trigger('click');
		} else if ($jQuery('#' + holder).is('select')) {
			$jQuery('#' + holder).val(option).change();
		} else if (!$(option).exists()) {
			var element = '#' + holder + " [class*='" + option + "'] a";
			$jQuery(element).trigger('click');
		}
	},
	
	initImageVariables: function() {
		if ($jQuery('.defaults').exists()) {
			$jQuery('.defaults input').each(function() {
				var variable = $jQuery(this).attr('class');
				var value = $jQuery(this).attr('value');
				
				//bsc.imageVariables.bsc[variable] = value;
				bsc.populateDefaultOptions(value, variable);
			});
		}
		bsc.allowGeneration = true;
	},
	
	imageVariables: {
		bsc: {
			"fabric": 						"BB0012",
			"bottom-cut-style": 			"bottom-cut-modern",
			
            "collar": 						"normal-collar-the-madmen",
			"collar-swatch-inner":			"",
			"collar-swatch-outer":			"",
			
			"placket": 						"single-placket-regular",
			"placket-swatch-button":		"",
			"placket-swatch-inner": 		"",
			"placket-swatch-outer": 		"",
			
            "cuff": 						"angled-cuff-single-convertible",
			"cuff-swatch-inner":			"",
			"cuff-swatch-outer":			"",
            
            "elbow-patch": 					"extras-elbow-none",
			"elbow-patch-swatch":			"",
            
			"pocket": 						"",
            "sleeve-style": 				"sleeve-long",
			
			"buttons-style": 				"buttons-single-button-placket",
            "button": 						"buttons-button-white",
			"contrast-button-hole-color": 	"button-hole-color-black",

			"shoulder-epa": 				"extras-shoulder-none",
			"shoulder-epa-swatch":			""
		}
	},
	
	collarStyle: function() {
		var style = $jQuery('#collar-style .option.active').attr('id');
		var height = $jQuery('#collar-height .option.active').attr('id');
		
		if (height == "collar-height-high") {
			bsc.imageVariables.bsc['collar'] = 'high-' + style;
		} else {
			bsc.imageVariables.bsc['collar'] = 'normal-' + style;
		}
	},
	
	placketStyle: function() {
		var style = $jQuery('#placket-style .option.active').attr('id');
		var button = $jQuery('#buttons-style .option.active').attr('id');
		
		if (button == "buttons-single-button-placket") {
			bsc.imageVariables.bsc['placket'] = 'single-' + style;
		} else {
			bsc.imageVariables.bsc['placket'] = 'double-' + style;
		}
	},
	
	cuffStyle: function() {
		var style = $jQuery('#cuff-style .option.active').attr('id');
		var shape = $jQuery('#cuff-shape :selected').val();
		
		if (shape == "Angled") {
			bsc.imageVariables.bsc['cuff'] = 'angled-' + style;
		} else if (shape == "Square") {
			bsc.imageVariables.bsc['cuff'] = 'square-' + style;
		} else {
			bsc.imageVariables.bsc['cuff'] = 'rounded-' + style;
		}
	},
	
	elbowPatch: function() {
		var elbow = $jQuery('#extras-elbow .option.active').attr('id');
		bsc.imageVariables.bsc['elbow-patch'] = elbow;
	},
	
	shoulderEpaulettes: function() {
		var shoulder = $jQuery('#extras-shoulders .option.active').attr('id');
		bsc.imageVariables.bsc['shoulder-epa'] = shoulder;
	},
	
	collarContrast: function() {
		if ($jQuery('#contrasts-collar-inside.active').exists()) {
			var swatch = $jQuery('#contrast-collar-swatch .active h2').html();
			bsc.imageVariables.bsc["collar-swatch-inner"] = (swatch != null ? swatch : "");
			bsc.imageVariables.bsc["collar-swatch-outer"] = "";
		} else if ($jQuery('#contrasts-collar-outside.active').exists()) {
			var swatch = $jQuery('#contrast-collar-swatch .active h2').html();
			bsc.imageVariables.bsc["collar-swatch-inner"] = "";
			bsc.imageVariables.bsc["collar-swatch-outer"] = (swatch != null ? swatch : "");
		} else {
			$jQuery('#contrast-collar-swatch .active').removeClass('active');
			bsc.imageVariables.bsc["collar-swatch-inner"] = "";
			bsc.imageVariables.bsc["collar-swatch-outer"] = "";
		}
	},
	
	collarPipingContrast: function() {
	
	
		if ($jQuery('#contrasts-collar-piping-full.active').exists()) {
			var swatch = $jQuery('.contrast-collar-piping-swatch .active h2').html();
			bsc.imageVariables.bsc["collar-piping"] = (swatch != null ? 'collar-piping-' + swatch : "");
			
		} else {
			$jQuery('.contrast-collar-piping-swatch .active').removeClass('active');
			bsc.imageVariables.bsc["collar-piping"]= "";
		}
	},
	
	cuffPipingContrast: function() {
	
	
		if ($jQuery('#contrasts-cuff-button-placket.active').exists()) {
			var swatch = $jQuery('.contrast-cuff-piping-swatch .active h2').html();
			bsc.imageVariables.bsc["cuff-piping"] = (swatch != null ? 'cuff-piping-' + swatch : "");
			
		} else {
			$jQuery('.contrast-cuff-piping-swatch .active').removeClass('active');
			bsc.imageVariables.bsc["cuff-piping"]= "";
		}
	},
	
	
	placketPipingContrast: function() {
		if ($jQuery('#contrasts-placket-piping-button.active').exists()) {
			var swatch = $jQuery('.contrast-placket-piping-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-piping"] = (swatch != null ? 'button-placket-piping-' + swatch : "");
			
		} else if ($jQuery('#contrasts-placket-piping-inside.active').exists()) {
			var swatch = $jQuery('.contrast-placket-piping-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-piping"] = (swatch != null ? 'inside-placket-piping-' + swatch : "");
			
		} else if ($jQuery('#contrasts-placket-piping-outside.active').exists()) {
			var swatch = $jQuery('.contrast-placket-piping-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-piping"] = (swatch != null ? 'outside-placket-piping-' + swatch : "");
			
		}
		else {
			$jQuery('.contrast-placket-piping-swatch .active').removeClass('active');
			bsc.imageVariables.bsc["placket-piping"]= "";
		}
	},
	
	cuffContrast: function() {
		if ($jQuery('#contrasts-cuff-inside.active').exists()) {
			var swatch = $jQuery('#contrast-cuff-swatch .active h2').html();
			bsc.imageVariables.bsc["cuff-swatch-inner"] = (swatch != null ? swatch : "");
			bsc.imageVariables.bsc["cuff-swatch-outer"] = "";
		} else if ($jQuery('#contrasts-cuff-outside.active').exists()) {
			var swatch = $jQuery('#contrast-cuff-swatch .active h2').html();
			bsc.imageVariables.bsc["cuff-swatch-inner"] = "";
			bsc.imageVariables.bsc["cuff-swatch-outer"] = (swatch != null ? swatch : "");
		} else {
			$jQuery('#contrast-cuff-swatch .active').removeClass('active');
			bsc.imageVariables.bsc["cuff-swatch-inner"] = "";
			bsc.imageVariables.bsc["cuff-swatch-outer"] = "";
		}
	},
	
	placketContrast: function() {
		if ($jQuery('#contrasts-button-placket.active').exists()) {
			var swatch = $jQuery('#contrast-placket-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-swatch-button"] = (swatch != null ? swatch : "");
			bsc.imageVariables.bsc["placket-swatch-inner"] = "";
			bsc.imageVariables.bsc["placket-swatch-outer"] = "";
		} else if ($jQuery('#contrasts-inside-placket.active').exists()) {
			var swatch = $jQuery('#contrast-placket-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-swatch-inner"] = (swatch != null ? swatch : "");
			bsc.imageVariables.bsc["placket-swatch-button"] = "";
			bsc.imageVariables.bsc["placket-swatch-outer"] = "";
		} else if ($jQuery('#contrasts-outside-placket.active').exists()) {
			var swatch = $jQuery('#contrast-placket-swatch .active h2').html();
			bsc.imageVariables.bsc["placket-swatch-outer"] = (swatch != null ? swatch : "");
			bsc.imageVariables.bsc["placket-swatch-button"] = "";
			bsc.imageVariables.bsc["placket-swatch-inner"] = "";
		} else {
			$jQuery('#contrast-placket-swatch .active').removeClass('active');;
			bsc.imageVariables.bsc["placket-swatch-outer"] = "";
			bsc.imageVariables.bsc["placket-swatch-button"] = "";
			bsc.imageVariables.bsc["placket-swatch-inner"] = "";
		}	
	},	
	
	
	pocketContrast: function() {
		if ($jQuery('#contrasts-pocket-full.active').exists()) {
			var swatch = $jQuery('.contrast-pocket-swatch .active h2').html();
			bsc.imageVariables.bsc["pocket-swatch"] = (swatch != null ? swatch : "");
			
		}
		else {
			bsc.imageVariables.bsc["pocket-swatch"] = "";
		}
	},
	
	elbowPatchContrast: function() {
		var swatch = $jQuery('.contrast-elbow-swatch .active h2').html();
		if (swatch != null) {
			bsc.imageVariables.bsc["elbow-patch-swatch"] = (swatch != null ? swatch : "");
		} else {
			bsc.imageVariables.bsc["elbow-patch-swatch"] = "";
		}
	},
	
	shoulderContrast: function() {
		var swatch = $jQuery('.contrast-shoulder-swatch .active h2').html();
		if (swatch != null) {
			bsc.imageVariables.bsc["shoulder-epa-swatch"] = (swatch != null ? swatch : "");
		} else {
			bsc.imageVariables.bsc["shoulder-epa-swatch"] = "";
		}
	},
	
	generateImage: function() {
		
		if (!bsc.allowGeneration) return false;
		if ($jQuery('.customizationGallery .cm-image-wrap').exists()) {
			$.ajax ({
				type: "POST",
				url: "api/default.php",
				data: {json: bsc.imageVariables},
				beforeSend: function() {
					$jQuery('.customizationGallery .cm-image-wrap').html('');
					// $jQuery('.customizationGallery .cm-image-wrap').css('background', 'transparent url(/skins/bsc/customer/images/loader.gif) no-repeat center center');
					$jQuery('.customizationGallery .cm-image-wrap').css('background', 'transparent url(/skins/bsc/customer/images/loader.gif) no-repeat center center');
			   },
			   
				error: function(jqXHR, textStatus, errorMessage) {
					//alert(errorMessage);
				},
				
				success: function(data) {
					$jQuery('.customizationGallery .cm-image-wrap').css('background', 'transparent none');
					//$jQuery('.customizationGallery .cm-image-wrap').html($jQuery(data).filter('.body').html());
					$jQuery('.customizationGallery .cm-image-wrap').html(data);
					$jQuery('.customizationGallery #api-gallery-zoom').html(data);
					$jQuery('#api-gallery-zoom img').removeAttr('height');
					$jQuery('#api-gallery-zoom img').attr('width', '850');
				} 
			});
		}
	},
	
	designYourOwn: function() {
		bsc.setBuyPath('false');
		bsc.customized = true;
		
		$jQuery('#productData, .shirt-measurements').slideUp(2000, 'swing', function() {
			$jQuery('#shirt-customization').slideDown(2000, 'swing', function() {
			
			});
		});
		
		bsc.customizationContentSwitch();
		
		$jQuery('.breadcrumbs').addClass('customizer');
		bsc.generateImage();
	},
	
	initCustomer: function() {
		bsc.insertSizePopulators();
		bsc.checkCustomerProfileGender();
		
		$jQuery('.pre-defined-sizes a').click(function(e) {
			var baseInput = $jQuery('label:contains("Base Size")').parent().find('input');
			var gender = $jQuery('label:contains("Gender")').parent().find('input:checked').val() == 1 ? 'm' : 'w';
			var size = bsc.computeBaseSizes($jQuery(this).attr('id'), gender);
			
			baseInput.val(size);
			if (size == 'custom') {
				var fit = $jQuery('label:contains("What kind of fit do you prefer to wear?")').parent().find('input:checked');
				$jQuery(fit).prop('checked', false);
			}
			
			e.preventDefault();
			return false;
		});
		
		$jQuery('label:contains("Gender")').parent().find('input.radio').click(function(e) {
			bsc.checkCustomerProfileGender();
		});
		
		$jQuery('label:contains("What kind of fit do you prefer to wear?")').parent().find('input.radio').click(function(e) {
			bsc.checkCustomerProfileGender();
		});
	},
	
	insertSizePopulators: function() {
		if ($jQuery('label:contains("Base Size")')) {
			var field = $('label:contains("Base Size")').parent().parent().find('.subheader');
			var populators = '<ul class="pre-defined-sizes floatClear male regular"><li> <a href="" id="M36">36</a> </li><li> <a href="" id="M38">38</a> </li><li> <a href="" id="M40">40</a> </li><li> <a href="" id="M42">42</a> </li><li> <a href="" id="M44">44</a> </li><li> <a href="" id="M46">46</a> </li><li> <a href="" id="M48">48</a> </li> </li></ul><ul class="pre-defined-sizes floatClear male slim"><li> <a href="" id="M36">36</a> </li><li> <a href="" id="M38">38</a> </li><li> <a href="" id="M40">40</a> </li><li> <a href="" id="M42">42</a> </li><li> <a href="" id="M44">44</a> </li> </li></ul><ul class="pre-defined-sizes floatClear female"><li><a href="" id="W0">0</a> </li><li> <a href="" id="W2">2</a> </li><li> <a href="" id="W4">4</a> </li><li> <a href="" id="W6">6</a> </li><li> <a href="" id="W8">8</a> </li><li> <a href="" id="W10">10</a> </li> </li></ul>';
			
			$jQuery(populators).insertAfter($(field));	
		}
	},
	
	checkCustomerProfileGender: function() {
		var gender = $jQuery('label:contains("Gender")').parent().find('input:checked').val() == 1 ? 'm' : 'w';
		var fit = $jQuery('label:contains("What kind of fit do you prefer to wear?")').parent().find('input:checked').val() == 6 ? 'regular' : 'slim';
		
		if (gender == 'm') {
			//if Men
			if (fit == 'regular') {
				$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').show();
				$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').hide();
			} else {
				$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').hide();
				$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').show();
			}
			
			$jQuery('*[class^="form-field men-"]').show();
			$jQuery('*[class^="form-field women-"]').hide();
			$jQuery('*[class^="pre-defined-sizes floatClear female"]').hide();
		} else {
			//if Women
			$jQuery('*[class^="form-field men-"]').hide();
			$jQuery('*[class^="form-field women-"]').show();
			$jQuery('*[class^="pre-defined-sizes floatClear female"]').show();
			$jQuery('*[class^="pre-defined-sizes floatClear male regular"]').hide();
			$jQuery('*[class^="pre-defined-sizes floatClear male slim"]').hide();
		}
	},
	
	sheetCustomizationArray: {},
	parseOrder: function(orderfield) {
		
		bsc.sheetCustomizationArray = bsc.sheetSetCustomizationArray(orderfield.find('.options-info'));
		
		var fabric = $jQuery(orderfield).find('p:contains(CODE:)').text().replace(/CODE:/, '').trim();
		var order = $jQuery('#order_summary .order').text().trim('#');
		var date = $jQuery('#order_summary .date').text();
		var name = $jQuery('.name').first().text();
		var comments = $jQuery('#notes').text();
		
		var address = $jQuery('.address-1').first().text() + ', ' + $jQuery('.address-2').first().text() + ', ' +  $jQuery('.address-3').first().text() + ', ' +  $jQuery('.address-4').first().text();
		address = address.replace(/, ,/g, ',');
		
		var orderFit = bsc.sheetCustomizationArray['Fit'] === undefined ? 'custom' : bsc.sheetCustomizationArray['Fit'];
		var orderSize = bsc.sheetCustomizationArray['Size'];
		var gender = (bsc.sheetGetProfileVariable('Gender', true) == "-" || bsc.sheetGetProfileVariable('Gender', true) == 'male') ? 'men' : 'women';
		
		var measurementtype = 0;
		var fit 			= 0;
		var basesize 		= 0;
		var collar 			= 0;
		var chest 			= 0;
		var waist 			= 0;
		var hip 			= 0;
		var shirtlength 	= 0;
		var sleevelength 	= 0;
		var shoulder 		= 0;
		var biceps 			= 0;
		var cuff 			= 0;
		
		//Profile Measurements
		
		if (orderFit == "custom") {
			measurementtype = bsc.sheetGetProfileVariable('What kind of measurements are you using?', true);
			fit = bsc.sheetGetProfileVariable('What kind of fit do you prefer to wear?', true);
			basesize = bsc.sheetGetProfileVariable('Base Size', true);
			collar = bsc.sheetGetProfileVariable('Collar', true);
			chest = bsc.sheetGetProfileVariable('Chest', true);
			waist = bsc.sheetGetProfileVariable('Waist', true);
			hip = bsc.sheetGetProfileVariable('Hips', true);
			shirtlength = bsc.sheetGetProfileVariable('Shirt Length', true);			
			sleevelength = bsc.sheetGetProfileVariable('Sleeve Length', true);
			shoulder = bsc.sheetGetProfileVariable('Shoulder ', true);
			biceps = bsc.sheetGetProfileVariable('Biceps', true);
			cuff = bsc.sheetGetProfileVariable('Cuffs', true);
			
			console.log(bsc.sheetGetProfileVariable('Shirt Length', true));
		} else {
			measurementtype = 'shirt';
			fit = orderFit;
			basesize = orderSize.replace(/\([a-z]*\)/g, '');
			var arrSize = (gender == 'men' ? 'M' : 'W') + basesize;
			var element = gender + '-' + 's' + '-' + fit.charAt(0) + '-';

			collar = bsc.measurements[arrSize][element + 'collar'];
			chest = bsc.measurements[arrSize][element + 'chest'];
			waist = bsc.measurements[arrSize][element + 'waist'];
			hip = bsc.measurements[arrSize][element + 'hips'];
			shirtlength = bsc.measurements[arrSize][element + 'shirt-length'];
			sleevelength = bsc.measurements[arrSize][element + 'sleeve-length'];
			shoulder = bsc.measurements[arrSize][element + 'shoulder'];
			biceps = '-';
			cuff = '-';
		}
		

		var sleeve = bsc.sheetCustomizationArray['Sleeve Style'];
		var sidecut = bsc.sheetCustomizationArray['Bottom Cut Style'];
		var collarstyle = bsc.sheetCustomizationArray['Collar Style'];
		var collarbutton = bsc.sheetCustomizationArray['Collar Height'];
		var collarstiffness = bsc.sheetCustomizationArray['Collar Stiffness'];
		var collarcontrast = bsc.sheetCustomizationArray['Contrast Collar Style'];
		var collarcontrastfabric = bsc.sheetCustomizationArray['Contrast Collar Swatch'];
		var collarpiping = bsc.sheetCustomizationArray['Contrast Collar Piping Style'];
		var collarpipingswatch = bsc.sheetCustomizationArray['Contrast Collar Piping Swatch'];
		var cuffstyle = bsc.sheetCustomizationArray['Cuff Style'];
		var cuffstiffness = bsc.sheetCustomizationArray['Cuff Stiffness'];
		var cuffshape = bsc.sheetCustomizationArray['Cuff Shape'];
		var cuffcontrast = bsc.sheetCustomizationArray['Contrast Cuff Style'];
		var cuffcontrastfabric = bsc.sheetCustomizationArray['Contrast Cuff Swatch'];
		var cuffpipingstyle = typeof bsc.sheetCustomizationArray["Contrast Cuff Piping Style"] != "undefined" ?  bsc.sheetCustomizationArray["Contrast Cuff Piping Style"].replace('/', '') : "-";
		var cuffpipingswatch = bsc.sheetCustomizationArray["Contrast Cuff Piping Swatch"];
		var button = bsc.sheetCustomizationArray['Button'];
		var buttonthread = bsc.sheetCustomizationArray['Button Hole Colour'];
		var buttonstyle = bsc.sheetCustomizationArray['Button Style'];
		var pocket = bsc.sheetCustomizationArray['Pockets Style'];
		var pocketnumber = bsc.sheetCustomizationArray['Pocket Placement'];
		var pocketcontrast = bsc.sheetCustomizationArray['Contrast Pocket Swatch'];
		var placket = bsc.sheetCustomizationArray['Placket Style'];
		var placketcontrast = bsc.sheetCustomizationArray['Contrast Placket Style'];
		var placketcontrastfabric = bsc.sheetCustomizationArray['Contrast Placket Swatch'];
		var placketpipingstyle = bsc.sheetCustomizationArray['Contrast Placket Piping Style'] != "undefined" ?  bsc.sheetCustomizationArray["Contrast Placket Piping Style"] : "-";
		var placketpipingswatch = bsc.sheetCustomizationArray['Contrast Placket Piping Swatch'];
		var backstyle = bsc.sheetCustomizationArray['Back Style'];
		var epaulette = bsc.sheetCustomizationArray['Epaulettes'];
		var epaulettecontrast = bsc.sheetCustomizationArray['Epaulette Swatch'];
		var elbowpatch = bsc.sheetCustomizationArray['Elbow Patch'];
		var elbowpatchcontrast = bsc.sheetCustomizationArray['Elbow Patch Swatch'];
		var monogram = bsc.sheetCustomizationArray['Monogram Text'];
		var monogramcolour = bsc.sheetCustomizationArray['Monogram Color'];
		var monogramplacement = bsc.sheetCustomizationArray['Monogram Style'];
		//var stitchcolour = bsc.sheetCustomizationArray['Stitch Color'];
	
		var query = "?fabric=-fabric-&order=-order-&date=-date-&name=-name-&gender=-gender-&measurementtype=-measurementtype-&fit=-fit-&basesize=-basesize-&collar=-collar-&chest=-chest-&waist=-waist-&hip=-hip-&shirtlength=-shirtlength-&sleevelength=-sleevelength-&shoulder=-shoulder-&biceps=-biceps-&cuff=-cuff-&armhole=-armhole-&comments=-comments-&address=-address-&sleeve=-sleeve-&sidecut=-sidecut-&collarstyle=-collarstyle-&collarbutton=-collarbutton-&collarstiffness=-collarstiffness-&collarcontrast=-collarcontrast-&collarcontrastfabric=-collarcontrastfabric-&collarpiping=-collarpiping-&collarpipingswatch=-collarpipingswatch-&cuffstyle=-cuffstyle-&cuffstiffness=-cuffstiffness-&cuffshape=-cuffshape-&cuffcontrast=-cuffcontrast-&cuffcontrastfabric=-cuffcontrastfabric-&cuffpipingstyle=-cuffpipingstyle-&cuffpipingswatch=-cuffpipingswatch-&button=-button-&buttonthread=-buttonthread-&buttonstyle=-buttonstyle-&pocket=-pocket-&pocketnumber=-pocketnumber-&pocketcontrast=-pocketcontrast-&placket=-placket-&placketcontrast=-placketcontrast-&placketcontrastfabric=-placketcontrastfabric-&placketpipingstyle=-placketpipingstyle-&placketpipingswatch=-placketpipingswatch-&backstyle=-backstyle-&epaulette=-epaulette-&epaulettecontrast=-epaulettecontrast-&elbowpatch=-elbowpatch-&elbowpatchcontrast=-elbowpatchcontrast-&monogram=-monogram-&monogramcolour=-monogramcolour-&monogramplacement=-monogramplacement-&stitchcolour=-stitchcolour-";
		
		query = query.replace('-order-', order);
		query = query.replace('-date-', date);
		query = query.replace('-name-', name);
		query = query.replace('-gender-', gender);
		query = query.replace('-address-', address);
		query = query.replace('-comments-', comments);
		query = query.replace('-measurementtype-', measurementtype);
		query = query.replace('-fit-', fit);
		query = query.replace('-basesize-', basesize);
		query = query.replace('-collar-', collar);
		query = query.replace('-chest-', chest);
		query = query.replace('-waist-', waist);
		query = query.replace('-hip-', hip);
		query = query.replace('-shirtlength-', shirtlength);
		query = query.replace('-sleevelength-', sleevelength);
		query = query.replace('-shoulder-', shoulder);
		query = query.replace('-biceps-', biceps);
		query = query.replace('-cuff-', cuff);
		query = query.replace('-fabric-', fabric);
		query = query.replace('-sleeve-', sleeve);
		query = query.replace('-sidecut-', sidecut);
		query = query.replace('-collarstyle-', collarstyle);
		query = query.replace('-collarbutton-', collarbutton);
		query = query.replace('-collarstiffness-', collarstiffness);
		query = query.replace('-collarcontrast-', collarcontrast);
		query = query.replace('-collarcontrastfabric-', collarcontrastfabric);
		query = query.replace('-collarpiping-', collarpiping);
		query = query.replace('-collarpipingswatch-', collarpipingswatch);
		query = query.replace('-cuffstyle-', cuffstyle);
		query = query.replace('-cuffstiffness-', cuffstiffness);
		query = query.replace('-cuffshape-', cuffshape);
		query = query.replace('-cuffcontrast-', cuffcontrast);
		query = query.replace('-cuffcontrastfabric-', cuffcontrastfabric);
		query = query.replace('-cuffpipingstyle-', cuffpipingstyle);
		query = query.replace('-cuffpipingswatch-', cuffpipingswatch);
		query = query.replace('-button-', button);
		query = query.replace('-buttonthread-', buttonthread);
		query = query.replace('-buttonstyle-', buttonstyle);
		query = query.replace('-pocket-', pocket);
		query = query.replace('-pocketnumber-', pocketnumber);
		query = query.replace('-pocketcontrast-', pocketcontrast);
		query = query.replace('-placket-', placket);
		query = query.replace('-placketcontrast-', placketcontrast);
		query = query.replace('-placketcontrastfabric-', placketcontrastfabric);
		query = query.replace('-placketpipingstyle-', placketpipingstyle);
		query = query.replace('-placketpipingswatch-', placketpipingswatch);
		query = query.replace('-backstyle-', backstyle);
		query = query.replace('-epaulette-', epaulette);
		query = query.replace('-epaulettecontrast-', epaulettecontrast);
		query = query.replace('-elbowpatch-', elbowpatch);
		query = query.replace('-elbowpatchcontrast-', elbowpatchcontrast);
		query = query.replace('-monogram-', monogram);
		query = query.replace('-monogramcolour-', monogramcolour);
		query = query.replace('-monogramplacement-', monogramplacement);
		//query = query.replace('#stitchcolour#', stitchcolour);
		query = query.replace(/#/g, '');
		query = query.replace(/undefined/g, '-');
		query = query.replace(/"/g, '');
		
		var queryLink = 'http://bombayshirts.com/order/default.htm' + query;
		var link = '<a href="' + queryLink + '" target="_blank" style="float:right">View/Print Order Sheet</a>';
		
		$jQuery(orderfield).prepend(link);
	},
	
	sheetGetProfileVariable: function(label, clean) {
		var parent 	= $jQuery('label:contains(' + label + ')').first().parent().clone();
		parent.find('label').remove();
		
		var val 	= parent.text();
		
		if (clean) {
			val 	= val.replace(/\s/g, '').toLowerCase();
		}
		
		return val;
	},
	
	sheetSetCustomizationArray: function(orderfield) {
		var options 			= $(orderfield).clone();
		options.find('span').remove();
		options					= options.text();
		options					= options.replace(/Customizations:/g, '');
		console.log(options);
		
		var arr 				= options.split(',');
		var dictionary			= {};
		
		arr.forEach(function(val, i) {
			var ar 				= val.split(':');
			dictionary[ar[0].trim()]	= ar[1].trim().replace(/\s/g, '').toLowerCase();
		});
		console.log(dictionary);
		
		return dictionary;
	}
	
}

Shadowbox.init({
	handleOversize: "drag",
	modal: false,
	initialHeight: 200
});

$.fn.exists = function(){
	return jQuery(this).length > 0;
}

$jQuery.fn.exists = function(){
	return jQuery(this).length > 0;
}

function fn_form_post_login_popup_form121(data) {
	if (bsc.isSignedIn()) {
		if (bsc.checkBuyPath != 'false') {
			$jQuery('#' + bsc.buyPath).trigger('click');
		}
	}
}

function fn_form_post_login_popup_form133(data) {
	if (bsc.isSignedIn()) {
		if (bsc.checkBuyPath != 'false') {
			$jQuery('#' + bsc.buyPath).trigger('click');
		}
	}
}

function fn_form_pre_profile_form(data) {
	if($jQuery('.lastUpdated').exists() || $jQuery('.updated-field').exists()) {
		var datetime = new Date();
		var name = $jQuery('.user-name').html();
		var dt = $.format.date(datetime, "HH:mm ddd, D MMM yyyy by ") + name;
	
		$jQuery('.updated-field input').val(dt);
		$jQuery('.lastUpdated').html('<strong>Last Updated: ' + dt + '</strong>');
		return true;
	}
	
	//if ($jQuery('a:contains("Administration")').exists()) {
	if ($jQuery('li.dashboard').exists()) {
		return true;
	}
}

function fn_form_post_profile_form(data) {
	if(!$jQuery('#buyBox').exists()) {
		return true;
	}
	
	if (bsc.customized) {
		bsc.createCustomizationsString(false);
	}
	
	//setTimeout(function() {
	$jQuery('#customBox .buttons-container .buttons-container input').trigger('click');
	//}, 500);
}
