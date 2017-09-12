(function($){

    "use strict";

    if(typeof $ === 'undefined') {
        console.log('The Responsive image plugin need to have jQuery')
    }


    function ResponsiveImage(element, $content, options) {
        var defaultOptions = {
            selector: 'img',                //Selector of the image that will be responsive by it (if there is more then one image)
            background: 'rgba(0,0,0,0.4)',  //background color
            root: 'body',                   //where to append responsive image element
            maxWindowWidth: '0.8',          //Max content width base by window width, ex: 0.9 means the max width will be 90%
            maxWindowHeight: '0.8',         //Max content height base by window height, ex: 0.9 means the max height will be 90%
            contentBg: '#fff',              //Background Color of the Content background
            contentPadding: '10',           //Content Padding size in pixels
            loaderElement: '<i class="fa fa-spinner rs-loader-spinner" aria-hidden="true"></i>',
            onlyShowContent: false          //If true - Don't generate new popup element, use existing one add just add loader and classes
        };

        var instance = null; //instance of the popup element
        var imageNaturalWidth = null;
        var imageNaturalHeight = null;

        options = options || {};
        defaultOptions = $.extend(defaultOptions, options);

        /**
         * Create Html Element with the inside html of the passing content
         * Only if defaultOptions.onlyShowContent is false, otherwise use the content element itself and just append classes
         */
        var createPopupElement = function () {

            var popupHtml = [
                '<div class="rs-img-bg" style="display:none; background-color: ' + defaultOptions.background + '">',
                defaultOptions.loaderElement,
                '<div class="rs-content-wrapper" style="display:none; background-color: ' +
                defaultOptions.contentBg + '; padding: ' + defaultOptions.contentPadding + 'px">',
                $content.html(),
                '</div>',
                '</div>'].join('');

            instance = $(popupHtml).appendTo($(defaultOptions.root));
            $(instance).fadeIn();
        };

        /**
         * Don't generate new popup element, use existing one just wrap with the background and add classes and loader
         * @param $content
         */
        var appendContentElements = function($content) {
            $content.wrap(function() {
                return '<div class="rs-img-bg" style="display:none; background-color: ' + defaultOptions.background + '"></div>';
            });

            $content.addClass('rs-content-wrapper').css('display','none')
                .css('background-color', defaultOptions.contentBg)
                .css('padding',defaultOptions.contentPadding + 'px');

            $content.closest('.rs-img-bg').append(defaultOptions.loaderElement);
            instance = $content.closest('.rs-img-bg');
            $(instance).fadeIn();

        };

        /**
         * Open Popup - create the html and fade in
         * If instance exists, delete it
         * @param $content
         */
        var openPopup = function($content) {

            if(instance) {
                resetAll();
            }
            if(defaultOptions.onlyShowContent) {
                appendContentElements($content);
            } else {
                createPopupElement($content);
            }

            setImageNaturalSizes(function(){
                setListeners();
                updateContentSize();
                showPopup();
            });

        };

        /**
         * Reset the plugin - remove all saved data and listeners
         */
        var resetAll = function() {
            $(instance).remove();
            instance = null;
            imageNaturalHeight = null;
            imageNaturalWidth = null;
            removeListeners();
        };

        /**
         * Load the image and set the natural image sizes
         * @param cb - Callback function to lunch after the image is loaded
         */
        var setImageNaturalSizes = function(cb) {
            var src = instance.find(defaultOptions.selector).attr('src');
            var img = new Image();

            img.onload = function() {
                imageNaturalHeight = this.height;
                imageNaturalWidth = this.width;

                if(typeof cb === 'function') {
                    cb();
                }
            };

            img.src = src;
        };

        /**
         * Get the image current sizes to save the ratio and fit inside the window width and height
         * @returns {{width: number, height: number}}
         */
        var getCurrentSizes = function() {

            var maxWidth = $(window).width() * defaultOptions.maxWindowWidth - defaultOptions.contentPadding * 2;
            var maxHeight = $(window).height() * defaultOptions.maxWindowHeight - defaultOptions.contentPadding * 2;

            var ratio = Math.min(( maxWidth/ imageNaturalWidth), ( maxHeight/ imageNaturalHeight));

            if(ratio > 1) {
                return {
                    width: imageNaturalWidth,
                    height: imageNaturalHeight
                }
            }

            return {
                width: imageNaturalWidth * ratio,
                height: imageNaturalHeight * ratio
            };
        };

        /**
         * Fade in the popup instance content and hide the preloader
         */
        var showPopup = function() {
            $(instance).find('.rs-loader-spinner').hide();
            $(instance).find('.rs-content-wrapper').fadeIn();
        };

        /**
         * Close popup in fade out.
         * @param event
         */
        var closePopup = function(event) {

            //if the event is keyup and it's different then the esc button, do nothing
            if(event.type === "keyup" && event.keyCode !== 27) {
                return;
            }

            //if the click event has been on the background - close the popup
            if(event.target === this) {
                $(instance).fadeOut(400, function(){
                    resetAll();
                });
            }

        };

        /**
         * Set All the plugin listeners
         */
        var setListeners = function() {

            //on window resize listener
            $(window).on('resize',updateContentSize);

            //clear on the instance listener
            $(instance).on('click',closePopup);

            //listen to esc button
            $(document).on('keyup',closePopup);


        };

        /**
         * Remove all Listeners
         */
        var removeListeners = function() {
            $(window).off('resize',updateContentSize);
            $(instance).off('click',closePopup);
            $(document).off('keyup',closePopup);
        };

        /**
         * Update Content size by the image size
         */
        var updateContentSize = function() {
            var sizes = getCurrentSizes();
            $(instance).find('.rs-content-wrapper').css('width',sizes.width + 'px').css('height',sizes.height + 'px');
        };


        /**
         * Initiate the plugin
         * @param element
         * @param $content
         */
        var init = function(element, $content) {

            //bind click event
            element.click(function(){
                openPopup($content);
            });
        };


        //Initiate the plugin
        init(element, $content);

    }

    $.fn.responsiveImage = function($content, options) {
        var rsImg = new ResponsiveImage(this, $content, options);
        return rsImg;
    };


}(jQuery));