# responsive-image-lightbox
A lightbox that adjusts its size to fit the image of a containing image - but allows other elements as well

##installation
Include Responsive Image scripts and styling and jQuery library:
```html
<link rel="stylesheet" href="responsive-image.min.css">
<script src="//code.jquery.com/jquery-latest.js"></script> 
<script src="responsive-image.js"></script> 
```

##usage
Initialize Responsive Image on every jQuery element, and passing jQuery element that click on this element will open. example:

````html
    <img src="http://lorempixel.com/300/300/" class="img" />
    
    <div id="popup" style="display: none">
        <img src="http://lorempixel.com/1000/600/" />
        <h4>text below the image</h4>
    </div>
````

````javascript
 $('.img').responsiveImage($('#popup'));
````

This code will add click event on the image and when the click event will be fired it will open the popup content

##options
````javascript
defaultOptions = {
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
````


