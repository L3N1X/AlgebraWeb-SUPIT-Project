const charachter = (start, end, text) => {
    return text.substring(start, end);
}

const lastWord = (text) => {
    const words = text.split(' ');
    return words[words.length - 1];
}

function delay(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

function randomDelay(){
    let max = 200;
    let delayTime = Math.floor(Math.random() * max);
    return new Promise(resolve => setTimeout(resolve, delayTime));
}

function randomDelayAtSpeed(max){
    let delayTime = Math.floor(Math.random() * max);
    return new Promise(resolve => setTimeout(resolve, delayTime));
}

$(document).ready(function(){
    var animationHasPlayedOnce = false;
    var animationIsPlaying = false;
    function typingAnimation(text, replacementLastWord, finalWord){
        async function type(){
            animationIsPlaying = true;
            $('#blinker').remove();
            $('#typewriter_textbox').append('<div id="blinker"></div>')
            //types full text
            for(let i = 0; i < text.length; i++){
                await randomDelay();
                $('#typing_text').append(charachter(i, i+1, text));
            }
            await delay(500);
            const currentLastWord = lastWord($('#typing_text').text())
            //deletes last word
            for(let i = currentLastWord.length; i >= 0; i--){
                await randomDelay();
                let currentText = $('#typing_text').text();
                let newText = currentText.slice(0, -1);
                $('#typing_text').text(newText)
            }
            //types replacement word
            randomDelay();
            $('#typing_text').append(' ');
            for(let i = 0; i < replacementLastWord.length; i++){
                await randomDelay();
                $('#typing_text').append(charachter(i, i+1, replacementLastWord))
            }
            await randomDelayAtSpeed(500);
            $('#blinker').remove();
            //Types last word in new line
            // $('#typewriter_textbox').append('</br>');
            $('#typewriter_container').append('<div id="red_text_textbox"></div>')
            $('#red_text_textbox').append('<div id="red_text"></div>');
            $('#red_text_textbox').append('<div id="blinker"></div>');
            await delay(500);
            for(let i = 0; i < finalWord.length; i++){
                console.log($('#red_text').text());
                await randomDelayAtSpeed(600);
                $('#red_text').append(charachter(i, i+1, finalWord));
            }
            //add dot
            await delay(400);
            $('#red_text').append('.');
            await randomDelayAtSpeed(600);
            
            animationHasPlayedOnce = true;
            animationIsPlaying = false;
        }
        //type(text);
        type();
    }

    typingAnimation('Budi izvrstan u onom što vidiš!', 'voliš.', 'ZAISKRI');

    //Events start

    $('.algebra_logo').on('click',function(){
        if(animationHasPlayedOnce && !animationIsPlaying &&  ($(window).width() >= 500)){
            $('#typewriter_textbox').text('').append('<div id="typing_text"></div>');
            $('#red_text_textbox').text('');
            typingAnimation('Najbolji odjel Algebre je marketing!', 'IT.', 'ZAISKRI');
        }
    });
    
    var hamburgerMenuVisible = false;
    $('.algebra_logo').on('click', function(){
        if($(window).width() <= 500){
            hamburgerMenuVisible = !hamburgerMenuVisible;
            if(hamburgerMenuVisible){
                $('#hamburger_nav_buttons').css('display', 'inline-block');
            } else {
                $('#hamburger_nav_buttons').css('display', 'none');
            }
        }
    });

    $(window).resize(function() {
        if($(window).width() >= 500){
            hamburgerMenuVisible = false;
            $('#hamburger_nav_buttons').css('display', 'none');
        }
    });

    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
    
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
    
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $(window).on('resize scroll', function() {
        if ($('#fancy_text.fancy1 div').isInViewport()) {
            $('#fancy_text.fancy1').addClass('fancy_text_appear');
            $('#fancy_text.fancy2').removeClass('fancy_text_appear');
        } 
        else if($('#fancy_text.fancy2 div').isInViewport()){
            $('#fancy_text.fancy2').addClass('fancy_text_appear');
            $('#fancy_text.fancy1').removeClass('fancy_text_appear');
        }
        else if($('#fancy_text.fancy3 div').isInViewport()){
            $('#fancy_text.fancy3').addClass('fancy_text_appear');
        }
        else {
            // do something else
            $('#fancy_text.fancy1').removeClass('fancy_text_appear');
            $('#fancy_text.fancy2').removeClass('fancy_text_appear');
            $('#fancy_text.fancy3').removeClass('fancy_text_appear');
        }
    });

    

});
