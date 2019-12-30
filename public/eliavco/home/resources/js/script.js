$(document).ready(function(){
    
//    A simple Waypoints with direction and offset:
//    
//        var waypoint = new Waypoint({
//          element: document.getElementById('px-offset-waypoint'),
//          handler: function(direction) {
//            notify('I am 20px from the top of the window')
//          },
//          offset: 20 
//        })
    
    
////    Sticky Navigation
////        -Add a class "js--sticky-nav" to #main-nav-bar
    
        $('.js--section-features').waypoint(function(direction) {
            if (direction == "down"){
                $('#main-nav-bar').addClass('js--sticky-nav');
            } else {
                $('#main-nav-bar').removeClass('js--sticky-nav');
            }
          },{
            offset: '71px;'
        });
    
    
////    Scrolling to Elements

        $('.js--scroll-to-plans').click(function(){
            $('html,body').animate({ scrollTop: $('.js--section-plans').offset().top }, 2000)
        });
    
        $('.js--scroll-to-start').click(function(){
            $('html,body').animate({ scrollTop: $('.js--section-features').offset().top }, 1000)
        }); 
    
        $('.js--scroll-to-beginning').click(function(){
            $('html,body').animate({ scrollTop: $('header').offset().top }, 1000)
        }); 
    
////    Smooth Scrolling
    
        // Select all links with hashes
        $('a[href*="#"]')
          // Remove links that don't actually link to anything
          .not('[href="#"]')
          .not('[href="#0"]')
          .click(function(event) {
            // On-page links
            if (
              location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
              && 
              location.hostname == this.hostname
            ) {
              // Figure out element to scroll to
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
              // Does a scroll target exist?
              if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                  scrollTop: target.offset().top
                }, 1000, function() {
                  // Callback after animation
                  // Must change focus!
                  var $target = $(target);
                  $target.focus();
                  if ($target.is(":focus")) { // Checking if the target was focused
                    return false;
                  } else {
                    $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                    $target.focus(); // Set focus again
                  };
                });
              }
            }
          });

 
////    Animations on scroll
    
        function animationAdd(direction) {
            selfClass = this.element.classList[1];
            if (direction == 'down'){
                $('.' + selfClass).addClass('animated');
                if (selfClass == "js--wp-1"){
                    $('.' + selfClass).addClass('fadeIn');
                } else if (selfClass == "js--wp-4"){
                    $('.' + selfClass).addClass('pulse');
                } else {
                    $('.' + selfClass).addClass('fadeInUp');
                }
            } else {
                if (selfClass == "js--wp-1"){
                    $('.' + selfClass).removeClass('fadeIn');
                } else if (selfClass == "js--wp-4"){
                    $('.' + selfClass).removeClass('bounceInLeft pulse');
                } else {
                    $('.' + selfClass).removeClass('fadeInUp');
                }
            }
        }
        
        function animationRemove(direction){
            selfClassRemove = this.element.classList[1]
            if (direction == "up"){
                $('.' + selfClassRemove).removeClass('animated');
            }
        }
    
        $('.js--wp-1').waypoint(animationAdd,{offset: '50%'});
        $('.js--wp-2').waypoint(animationAdd,{offset: '50%'});
        $('.js--wp-3').waypoint(animationAdd,{offset: '50%'});
        $('.js--wp-4').waypoint(animationAdd,{offset: '50%'});
    
        $('.js--wp-1').waypoint(animationRemove,{offset: '100%'});
        $('.js--wp-2').waypoint(animationRemove,{offset: '100%'});
        $('.js--wp-3').waypoint(animationRemove,{offset: '100%'});
        $('.js--wp-4').waypoint(animationRemove,{offset: '100%'});
    
////    Mobile Navigation
        
        $('.js--nav-icon').click(function(){
            var nav = $('.js--main-nav');
            var icon = $('.js--nav-icon i');
            if (nav.hasClass('mobile-nav')){
                nav.removeClass('mobile-nav animated bounceIn');
            } else {
                nav.addClass('mobile-nav animated bounceIn');
            }
            if (icon.hasClass('ion-navicon-round')){
                icon.removeClass('ion-navicon-round tada');
                icon.addClass('ion-close-round tada');
            } else {
                icon.removeClass('ion-close-round tada');
                icon.addClass('ion-navicon-round tada');
            }
        });

});