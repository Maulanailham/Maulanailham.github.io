"use strict"

function loadSite() {
  document.body.className = "loaded"
}

document.addEventListener("DOMContentLoaded", function() {
    /*
    var currentSlide = 0;
    
    var $slider = $('.slides .slide').length;
    
    var $slider = $('#slider');
    var $slideContainer = $slider.find('.slides');
    
    var $slides = $slideContainer.find('.slide');
    
    
    
    setInterval(function(){
       
        $slideContainer.animate({'margin-left':'-=' + 720}, 1000, function(){
            currentSlide++;
            if(currentSlide === 3){
                currentSlide = 0;
                $slideContainer.animate({'margin-left':'0'});
            }
            
        });
        
    }, 1000);
    */
    loadSite(); 
})
