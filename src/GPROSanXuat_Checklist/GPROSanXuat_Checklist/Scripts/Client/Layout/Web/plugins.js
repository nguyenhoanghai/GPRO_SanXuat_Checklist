jQuery(document).ready(function() {
  // 2/3/4th level menu  offscreen fix
        var MainWindowWidth = jQuery(window).width();
        jQuery(window).resize(function(){
            MainWindowWidth = jQuery(window).width();
        });        
        jQuery('.sf-menu ul li').mouseover(function(){
            // checks if third level menu exist         
            var subMenuExist = jQuery(this).find('.nav-child').length;            
            if( subMenuExist > 0){
                var subMenuWidth = jQuery(this).find('.nav-child').width();
                var subMenuOffset = jQuery(this).find('.nav-child').parent().offset().left + subMenuWidth;
                // if sub menu is off screen, give new position
                if((subMenuOffset + subMenuWidth) > MainWindowWidth){                  
                    var newSubMenuPosition = subMenuWidth + 3;
                    $(this).find('.nav-child').first().css({
                        left: -newSubMenuPosition,
                        //top: '10px',
                    });
                }
            }
         });

    //mobile menu
    jQuery('.sf-sub-indicator').remove();
    (function() {
        var $menu = jQuery('#mainmenu'),
            optionsList = '<option value="" selected>Menu...</option>';

        $menu.find('li').each(function() {
            var $this   = jQuery(this),
                $anchor = $this.children('a'),
                depth   = $this.parents('ul').length - 1,
                indent  = '';

            if( depth ) {
                while( depth > 0 ) {
                    indent += ' - ';
                    depth--;
                }
            }
            optionsList += '<option value="' + $anchor.attr('href') + '">' + indent + ' ' + $anchor.text() + '</option>';
        }).end()
          .after('<select class="res-menu visible-sm visible-xs form-control">' + optionsList + '</select>');

        jQuery('.res-menu').on('change', function() {
            window.location = jQuery(this).val();
        });
    })();
    
    //gallery
    (function($){ 
       $(window).load(function(){

        $(window).resize(function(){
            $windowWidth = $(window).width();
        });

        var $container = $('#portfolioContainer');
            $container.isotope({
                layoutMode : 'fitRows',
                animationEngine: 'best-available',
                animationOptions: {
                  queue: false,
                  duration: 800
                }
            });

            // filter items when filter link is clicked
            $('#filtrable a').click(function(){
                var selector = $(this).attr('data-filter');
                $container.isotope({ filter: selector, layoutMode : 'fitRows' });
                return false;
            });

            var $optionSets = $('#filtrable li'),
                $optionLinks = $optionSets.find('a');

                $optionLinks.click(function(){
                    var $this = $(this);
                    // don't proceed if already selected
                    if ( $this.hasClass('selected') ) {
                      return false;
                    }
                    var $optionSet = $this.parents('#filtrable');
                    $optionSet.find('.selected').removeClass('selected');
                    $this.addClass('selected');
              
                    // make option object dynamically, i.e. { filter: '.my-filter-class' }
                    var options = {},
                        key = $optionSet.attr('data-option-key'),
                        value = $this.attr('data-option-value');
                    // parse 'false' as false boolean
                    value = value === 'false' ? false : value;
                    options[ key ] = value;
                    if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
                      // changes in layout modes need extra logic
                      changeLayoutMode( $this, options )
                    } else {
                      // otherwise, apply new options
                      $container.isotope( options );
                    }
                    
                    return false;
                });
        });
    })(jQuery);  
});