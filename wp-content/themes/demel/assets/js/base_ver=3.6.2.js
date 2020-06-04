var $scrollReady = false;
var player;
var scrollbar;
var $scrolled = 0;
var horzTimeout;
var $horz = false;
var $scroll = true;
function isIE() {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE '); // IE 10 or older
    var trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}

function resizeStuff(){
	$winH = $(window).height();
	$winW = $(window).width();
	$winWH = $winW/2;
	if($('div.page .vert').length >= 1){
		$hW = $('div.page .horz').outerWidth();
		$('div.page .vert section').each(function(){
			$in = $(this).index();
			if($winW < 1024){
				$size = $('div.page .horz section').eq($in).outerHeight();
				
			} else{
				$size = $('div.page .horz section').eq($in).outerWidth();
				
			}

			$(this).css('height',$size);
			//$(this).css('width',$hW);
		})
		$vH = $('div.page .vert').height();
		if($scrollReady){
			scrollbar.setPosition(0, 0);
			
		}	
		if($('div.page.active').hasClass('horizontal') && $winW > 1023){
			$horz = true;
		}	else{
			$horz = false;
		}			
	} else{
		$vH = 0;
		$hW = 0;
	}	
}
var resizeTimer;
resizeStuff();	
$(window).on('load', function(){
	$('body').addClass('loaded');
}).on('resize orientationchange', function(){
clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    resizeStuff();
            
  }, 250);	
		
});



function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady
    }
  });
}
function onPlayerReady(event) {
  
  // bind events
/*  var playButton = document.getElementById("play-button");
  playButton.addEventListener("click", function() {
    player.playVideo();
  });
  
  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function() {
    player.pauseVideo();
  });*/

  
}		    
$mouse = false;
$(document)
.init(function(){
	/*global items*/
	var
		contentSelector = '#wrapper',
		$content = $(contentSelector).filter(':first'),
		contentNode = $content.get(0),
		completedEventName = 'statechangecomplete',
		$window = $(window),
		$history = $window[0].history,
		$document = $(document);
		$body = $('body');
	if ( $content.length === 0 ) {
		$content = $body;
	}
	$.expr[':'].internal = function(obj, index, meta, stack){
		var
			$this = $(obj),
			url = $this.attr('href')||'',
			isInternalLink;
		
		
		return isInternalLink;
	};
	var documentHtml = function(html){
		var result = String(html)
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
		;
		return $.trim(result);
	};
	var $transition;
	function updateContent(url){
		$transitionTimeout = 0;
		clearTimeout($transition);
		$('body').addClass('transition');
		var random = Math.floor(Math.random()*$('#loading span').length);
		
		$('#loading span.shown').removeClass('shown');
		$('#loading span').eq(random).addClass('shown');
		$transition = setTimeout(function(){
			$('body').removeClass('show-nav');
			$.ajax({
				url: url,
				headers: {
				    'Access-Control-Allow-Origin': '*'
				},				
				success: function(data, textStatus, jqXHR){
					var
						$data = $(documentHtml(data)),
						$dataBody = $data.find('.document-body:first'),
						$dataContent = $dataBody.find(contentSelector).filter(':first'),
						$menuChildren, contentHtml, $scripts;
						contentHtml = $dataContent.html();
					if ( !contentHtml ) {
						$document[0].location.href = url;
						return false;
					} else{
						$document[0].title = $data.find('.document-title:first').text();
						$('#wrapper .page.active').addClass('old').removeClass('active');
						$('#wrapper').append(contentHtml);
						$('body').attr('class','transition loaded ' + $('#wrapper .page.new').attr('data-body'));
						$('#wrapper .page.new').addClass('active').removeClass('new');
						if($('#wrapper .page.active').hasClass('dark')){
							$('body').addClass('dark');
						} else{
							$('body').removeClass('dark');
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					document.location.href = url;
					return false;
				}
			}).done(function(){
				newPage();
				gtag('config', 'UA-132500461-1', {'page_path':  window.location.pathname});
				//gtag('set', { page: window.location.pathname, title: $document.title });
				//gtag('send', 'pageview');	
				$('body').removeClass('transition');
			});
		},$transitionTimeout);	
	}
	function newPage(){
		 $('.wysiwyg h1, .wysiwyg h2, .wysiwyg h3:not(.article-title), .wysiwyg h3.article-title a, .wysiwyg h4').addClass('lettering').lettering('words');
		if($('.page.active section.form').length == 1){
			//console.log('test');
			//$('section.form .document-script').each(function () { eval($(this).html()); })			
			var resetForm;
			var formInit;
			adminAjax = $('.page.active section.form').attr('data-ajax');
			formID = $('.page.active section.form').attr('data-form');
			//setupForm();
			$.get(adminAjax+'?action=gf_button_get_form&form_id='+formID,function(response){
				$('.page.active section.form .container').append(response)
				formInit = setInterval(function(){
					if($('.form .gform_body').length >= 1){
						clearTimeout(resetForm);
						setupForm();
						clearInterval(formInit);
					}
				},1000);	
				$('section.form').find('form').submit(function(e){
					$('section.form .gform_body>ul>li.gfield').addClass('active');
					$('section.form').addClass('processing');
					scrollbar.scrollTo(0, ($scrolled + $('section.form').offset().top), 1000);		
					//console.log('submitted');
					formFix = setInterval(function(){
						if($('.form .validation_error').length >= 1){
							clearTimeout(resetForm);
							setupForm();
							clearInterval(formFix);
							
							resetForm = setTimeout(function(){
								$(document).find('section.form').removeClass('processing');
							},1000);
						} else if($(document).find('section.form .gform_confirmation_message').length >= 1){
							//console.log('success');
							$title = window.location.pathname;
							//console.log('event, generate_lead, submit, '+$title);
							gtag('event', 'generate_lead', {
							  'event_category' : 'engagement',
							  'event_label' : window.location.pathname
							});

							clearInterval(formFix);
						}

					},1000);	
					//e.stopPropagation();		
				});
			});

			
		}
		
		$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
		$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight+'px');
		$('nav.global .menu-item-has-children.active').removeClass('active');
	
		$('img.lazyload').each(function(){
			$src = $(this).attr('data-src');
			$(this).attr('src',$src);
			//$(this).load();
			$(this).removeClass('lazyload');
		});
		if($('div.page.active').hasClass('horizontal') && $winW > 1023){
			$horz = true;
		}	else{
			$horz = false;
		}
		if($('div.page.active').hasClass('horizontal')){
			preloadImages();
		}
		$body.removeClass('transition');
		resizeStuff();

		scrollbar = Scrollbar.init($('.page.active')[0], {
			//speed: .4,
			damping: 0.1,
			renderByPixels: true,
			syncCallbacks: true,
			continuousScrolling: false,
			overscrollEffect: false
		});
		$(document).find('a').hover(function(){
			$(this).attr('title','');
		});
		$(document).on('click','a', function(e){
			//$section = $(this).attr('href');
			if($('.page.active').hasClass('horizontal')){
				if($(this).attr('href').toString().charAt(0) === "#"){
					$section = $(this).attr('href').replace('#', '');
					
					if($section.length >= 1 && $section.length < 3){
						if($('.page.horizontal section:nth-of-type('+$section+')').length >= 1){
							if($winW > 1023){
								//console.log(scrollbar);
								//console.log($scrolled + $('.page .vert section:nth-of-type('+$section+')').offset().top);
								scrollbar.scrollTo(0, ($scrolled + $('.page .vert section:nth-of-type('+$section+')').offset().top ), $section * 300);		
							} else{
								//console.log($scrolled + $('.page .horz section:nth-of-type('+$section+')').offset().top);
								scrollbar.scrollTo(0, ($scrolled + $('.page .horz section:nth-of-type('+$section+')').offset().top ), $section * 300);		
								//scrollbar.scrollIntoView($('.page .horz section:nth-of-type('+$section+')')[0]);		
								
							}
							
						}
						e.preventDefault();
					}
				}
			} else if($('.page.active').hasClass('standard')){
				if($(this).attr('href').toString().charAt(0) === "#"){
					$section = $(this).attr('href').replace('#', '');
					if($section.length >= 1 && $section.length < 3){
						if($('.page section:nth-of-type('+$section+')').length >= 1){
							//console.log($section);
							scrollbar.scrollTo(0, ($('.page section:nth-of-type('+$section+')').offset().top ), $section * 300);		
						}
						e.preventDefault();
					}
				}		
			}
		});	
		
		$scrollReady = true;
		var lastScrollY = 0 ;
		var lastScrollX = 0;
		scrollbar.addListener(function (status) {
			$scrolled = status.offset.y;
			$scrolledLeft = status.offset.y;
			scrollbar.limit.x = 0;
			scrollbar.scrollLeft = 0;
			scrollStuff($scrolled);
		});	
				scrollStuff(0);
		
		$('#wrapper .page.active').addClass('loaded');
		setTimeout(function(){
			$('#wrapper .page.old').remove();		
		},1000);
		$document.find('[href*="#"]').click(function(e){
			e.preventDefault();
		});
		$document.find('section.video .controls').on('click', function (e) {
		    $(this).parents('.video').addClass('started');
		    $(this).parents('.video').append('<iframe src="'+$(this).parents('.video').attr('data-video')+'" ></iframe>')
		    e.preventDefault();
		});
		$('.page.active.horizontal .photo.slider .container').slick({
			arrows : false,
			autoplay : true,
			adaptiveHeight: false,
			infinite : true,
			fade : true,
			slide : 'figure',
			useCSS: false,
			speed : 1200,
			pauseOnFocus: false,
			pauseOnHover: false,
			slidesToShow:1
		});
		$('.page.active.horizontal .photo.style-grid .container').slick({
			arrows : false,
			autoplay : true,
			adaptiveHeight: false,
			infinite : true,
			fade : false,
			slide : 'figure',
			cssEase: 'cubic-bezier(0.28,0,0.18,1)',
			useCSS: true,
			speed : 2000,
			initialSlide: 1,
			pauseOnFocus: false,
			pauseOnHover: false,
			slidesToShow:1
		}).on('afterChange', function(currentSlide){
			$(currentSlide.currentTarget).removeClass('zoomed');
			$(currentSlide.currentTarget).find('.expand').removeClass('expand');
		});
		$('.page.active.horizontal .photo.style-grid figure').click(function(){
			if($(this).hasClass('slick-current') && !$(this).hasClass('expand')){
				$(this).parents('.container').addClass('zoomed');
				$(this).parents('.container').find('figure.expand').removeClass('expand');
				$(this).addClass('expand');
			} else{
				$(this).parents('.container').find('figure.expand').removeClass('expand');
				$(this).parents('.container').removeClass('zoomed');
				$(this).parents('.container')[0].slick.slickGoTo( parseInt($(this).attr('data-slick-index')) );		
			}
		});
		$('.page.active .slideshow').each(function(){
			$(this).slick({
				arrows : false,
				autoplay : true,
				infinite : true,
				fade : false,
				slide : 'figure',
				useCSS: false,
				speed : 700,
				autoplaySpeed: 4000,
				pauseOnFocus: false,
				pauseOnHover: false,
				slidesToShow:1
			});		
			$(this).slick('pause');	
			$(this).on('swipe', function(){
				if(!$(this).find('.controls').hasClass('paused')){
					$(this).find('.controls').removeClass('playing');
					$(this).find('.controls').addClass('paused');
					$(this).slick('pause');
				}				
			});
		});	
		$document.find('.slideshow .controls').click(function(){
			if($(this).hasClass('paused')){
				$(this).removeClass('paused');
				$(this).addClass('playing');
				$(this).parents('section.slideshow').slick('next');
				$(this).parents('section.slideshow').slick('play');
			} else{
				$(this).removeClass('playing');
				$(this).addClass('paused');
				$(this).parents('section.slideshow').slick('pause');
			}
		})				
		$document.find('a:internal:not(.no-ajax):not([href*="#"])').click(function(event){
			var
			$this = $(this),
			url = $this.attr('href');
			//console.log(window.location.pathname +', '+ url);
			if(url !== window.location.pathname){
			$history.pushState({'url':url},null,url);
			updateContent(url);
			}
			event.preventDefault();
		});	
		//if($horz){
			
		//}
		if(!$horz){
			//$('body').removeClass('dark');
		}
				

	}
	function scrollStuff($scrolled){
		if($horz){
			
			$offset = ( ($scrolled) / ($vH + (($winW - $winH))) ) * -1;
			$('div.page .horz').css('top',$scrolled);
			$('div.page .backgrounds').css('top',$scrolled);
			//$('div.page .backgrounds').css('left',$offset * $hW * -1);
			if( ($hW * $offset)*-1 <= ($hW - $winW ) ){
				$('div.page .horz').css('transform','translateX('+(($hW) * $offset)+'px)');		
			}
			$('div.page .horz section.column').each(function(){
				if($(this).offset().left <= $winW*.7 && $(this).offset().left >= $winW*-.2){
					$(this).addClass('shown');
					if($(this).hasClass('style-grid') && $(this).find('.container').hasClass('slick-initialized')){
						//$(this).find('.container')[0].slickPause();
						$(this).find('.container').slick('slickPlay');
					}
				} else{
					if($(this).hasClass('style-grid') && $(this).find('.container').hasClass('slick-initialized')){
						$(this).find('.container').slick('slickPause');
						//$(this).find('.container')[0].slickPlay();
					}	
					$(this).removeClass('shown');				
				}
				if($(this).hasClass('style-message')){
					if($(this).offset().left <= $('header.global').outerWidth() && $(this).offset().left >= $winW*-1){
						$('body').removeClass('dark');
					} else{
						$('body').addClass('dark');
					}					
				}			
				if($(this).hasClass('quote')){
					if($(this).offset().left <= $('header.global').outerWidth() && $(this).offset().left >= $winW*-.5){
						//$('body').removeClass('dark');
						$src = $(this).attr('data-bg');
						$('.backgrounds img[src="'+$src+'"]').addClass('active');
					} else{
						$src = $(this).attr('data-bg');
						$('.backgrounds img[src="'+$src+'"]').removeClass('active');
					}
				}	
			})	
			//$('.backgrounds').css('top','0px');		
		} else if($('div.page.active').hasClass('horizontal') && $winW < 1023){
			$('div.page .backgrounds').css('top',$scrolled);
			$offset = ( ($scrolled) / ($vH + (($winW - $winH))) ) * -1;
			$('div.page .horz section.column').each(function(){
				if($(this).offset().top <= $winH*.7 && $(this).offset().top >= $winH*-.7){
					$(this).addClass('shown');
				} else{
					$(this).removeClass('shown');				
				}
				if($(this).hasClass('style-message')){
					if($(this).offset().top <= $('header.global').outerWidth() && $(this).offset().top >= $winH*-1){
						$('body').removeClass('dark');
					} else{
						$('body').addClass('dark');
					}					
				}			
				if($(this).hasClass('quote')){
					if($(this).offset().top <= $('header.global').outerWidth() && $(this).offset().top >= $winH*-.5){
						//$('body').removeClass('dark');
						$src = $(this).attr('data-bg');
						$('.backgrounds img[src="'+$src+'"]').addClass('active');
					} else{
						$src = $(this).attr('data-bg');
						$('.backgrounds img[src="'+$src+'"]').removeClass('active');
					}
				}	
			})				
		} else{
			$('div.page.active section:not(.listing)').each(function(){
				if($(this).offset().top <= $winH*.9){
					$(this).addClass('shown');
				} 
			});
			$('div.page.active section.grid figure').each(function(){
				if($(this).offset().top <= $winH*.9){
					$(this).addClass('shown');
				} 
			});
			$('div.page.active section.listing article, div.page.active section.listing .hairline').each(function(){
				if($(this).offset().top <= $winH*.9){
					$(this).addClass('shown');
				} 
			});
		}
	}
	function preloadImages(){
		var images = [];
		if($('div.page .horz .quote').length >= 1){
			$('div.page .horz .quote').each(function(){
				images.push($(this).attr('data-bg'));
			});
		}
		var preloadedImages = [];
		for(i=0;i<images.length;i++){
			preloadedImages[i] = new Image();
			preloadedImages[i].src = images[i];
			$('div.page.horizontal .backgrounds').append(preloadedImages[i]);
		}
	}
	if(isIE()){
	   $('html').addClass('ie-alert');
	   $('body').html('<div id="alert">Please view this site in a modern browser such as Chrome, Firefox, Edge, Opera, or Safari.<br /><br />We apologize for any inconvenience.</div>');
	} else{
		newPage();
		$history.replaceState({'url':document.location.href}, null , document.location.href);
		var timeout;
		$window[0].addEventListener('popstate',function(event){
			updateContent(event.state.url);
		}); 

	}	
	var navScrollbar = Scrollbar.init($('nav.global')[0], {
		speed: .6,
		damping: 0.1,
		renderByPixels: true,
		syncCallbacks: true,
		continuousScrolling: false,
		overscrollEffect: false
	});	
	$('header.global .toggle').click(function(e){
		e.preventDefault();
	})
	$('div#wrapper').click(function(){
		if($('body').hasClass('show-nav')){
			$('body').removeClass('show-nav');
		}
	})
	$('header.global .toggle')
	.on('mousedown touchstart', function(e){
		$mouse = true;
		//e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();		
	})
	.on('mouseup touchend', function(e){
		$mouse = false;
		if($('body').hasClass('show-nav')){
			$('body').removeClass('show-nav')
			/*$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
			$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight+'px');			
			$('nav.global .menu-item-has-children.active').removeClass('active');*/
		} else{
			$('body').addClass('show-nav');
		}
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();		
	})
	.on('focus', function(){
		if(!$mouse){
			if($('body').hasClass('show-nav')){
				$('body').removeClass('show-nav')
				$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
				$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight+'px');			
				$('nav.global .menu-item-has-children.active').removeClass('active');
			} else{
				$('body').addClass('show-nav');
			}
		}
	});
	$('nav.global ul.primary > .menu-item-has-children > a').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();		
	})
	$('nav.global ul.primary > .menu-item-has-children > a')
	.on('mousedown touchstart',function(e){
		$mouse = true;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	})
	.on('mouseup touchend',function(e){
		$parent = $(this).parents('li');
		if($parent.hasClass('active')){
			$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
			$parent.removeClass('active');
			$parent.css('max-height',$maxHeight+'px');
		} else{
			$parent.addClass('active');
			$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
			$parent.css('max-height','calc('+ (parseFloat($maxHeight)+parseFloat($parent.find('ul').actual('outerHeight'))) + 'px )');
		}
		$mouse = false;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	})
	.on('focus', function(e){
		if(!$mouse){
			if(!$('body').hasClass('show-nav')){
				$('body').addClass('show-nav');
			}
			$parent = $(this).parents('li');
			if(!$parent.hasClass('active')){
				$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
				$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight);
				$('nav.global .menu-item-has-children.active').removeClass('active');
				$parent.addClass('active');
				$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
				$parent.css('max-height','calc('+ (parseFloat($maxHeight)+parseFloat($parent.find('ul').actual('outerHeight'))) +'px )');
			}
		}
		e.preventDefault();
		e.stopImmediatePropagation()
		e.stopPropagation();
	});
	$('nav.global ul.primary > .menu-item-has-children > ul > li > a')
	.on('focus', function(){
		if(!$mouse){
			if(!$('body').hasClass('show-nav')){
				$('body').addClass('show-nav');
			}
			$parent = $(this).parents('li.menu-item-has-children');
			if(!$parent.hasClass('active')){
				$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
				$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight+'px');
				$('nav.global .menu-item-has-children.active').removeClass('active');
				$parent.addClass('active');
				$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
				$parent.css('max-height','calc('+ (parseFloat($maxHeight)+parseFloat($parent.find('ul').actual('outerHeight'))) +'px )');
	
			}		
		}
	});
	$('nav.global').on('blur', function(){
		//$('body').removeClass('show-nav');
	})
	$('nav.global ul.primary > li:not(.menu-item-has-children) > a')
	.on('focus', function(){
		$maxHeight = $('nav.global .menu-item-has-children.active > a').height();
		$('nav.global .menu-item-has-children.active').css('max-height',$maxHeight+'px');
		$('nav.global .menu-item-has-children.active').removeClass('active');
	});
	$('nav.global #mc_embed_signup input[type=email]').on('focus',function(){
		$('nav.global #mc_embed_signup').addClass('engaged');
	});
	$('nav.global #mc_embed_signup input[type=email]').on('blur',function(){
		if($(this).val().length == 0){
			$('nav.global #mc_embed_signup').removeClass('engaged');
			
		}
	});

})
.on('keydown',function(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 27: //esc
			if($('body').hasClass('show-nav')){
				$('body').removeClass('show-nav');	
			}
            break;
    }
});

$(document).on('mousemove', function(e){
    $('#loading').css({
       left:  e.pageX,
       top:   e.pageY
    });
});
function setupForm(){

	$(document).find('section.form form .gfield input, section.form form .gfield textarea').on('focus', function(){
		$(this).parents('.gfield').removeClass('gfield_error'); 
	   $(this).parents('.gfield').addClass('active'); 
    });
    $(document).find('section.form form .gfield input, section.form form .gfield textarea').on('blur', function(){
	    if($(this).val()){
			$(this).parents('.gfield').addClass('active'); 
			$(this).parents('.gfield').removeClass('gfield_error'); 
	    } else{
		   $(this).parents('.gfield').removeClass('active'); 
	    }
    });
	$(document).find('section.form form .gfield input, section.form form .gfield textarea').each(function(){
	    if($(this).val()){
			$(this).parents('.gfield').addClass('active'); 
	    } else{
		   $(this).parents('.gfield').removeClass('active'); 
	    }
	});
   $(document).find('section.form form .gfield select').on('change',function(){
	    if($(this).val()){
			$(this).parents('.gfield').addClass('active'); 
			$(this).parents('.gfield').removeClass('gfield_error'); 
		} else{
		   $(this).parents('.gfield').removeClass('active'); 
	    }
    });	
	$(document).find('section.form form .gform_drop_area').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
	})
	.on('dragover dragenter', function() {
		$(document).find('section.form form .gform_drop_area').addClass('is-dragover');
	})
	.on('dragleave dragend drop', function() {
		$(document).find('section.form form .gform_drop_area').removeClass('is-dragover');
	})
	$(document).find('section.form form .gfield.tst-btn input').on('change',function(){
	   if($(document).find('section.form form .gfield.tst-btn  input[value=yes]:checked').length == 1){
		   $(document).find('.form input[type=submit]').prop('disabled', false);
	   } else{
		   $(document).find('.form input[type=submit]').prop('disabled', true);
	   }
	});    
	$(document).find('section.form form .gfield input, .gfield textarea').each(function(){
	    if($(this).val()){
			$(this).parents('.gfield').addClass('active'); 
	    } else{
		   $(this).parents('.gfield').removeClass('active'); 
	    }
	});
	if($(document).find('section.form form .gfield.tst-btn input[value=yes]:checked').length == 1){
	   $(document).find('.form input[type=submit]').prop('disabled', false);
	} else{
	   $(document).find('.form input[type=submit]').prop('disabled', true);
	}
}