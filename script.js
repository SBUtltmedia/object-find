var clickable = [{
    Name: "ceilingLight",
    Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
}, {
    Name: "Window1",
    Text: "This is Window #1"
}, {
    Name: "Window2",
    Text: "This is Window #2"
}, {
    Name: "Rat_1",
    Text: "This is a rat.",
    totalAnimationFrames: 3
}];
var lookup = {};
var animationItem;
var animationFrame;
$(function () {

    $("#room").css("font-size", "100px");
    $("#roomSVG").load("img/asthmaRoom.svg", roomSvgLoad);

});




function roomSvgLoad() {

    $(clickable).each(function (index, value) {
        console.log($(value))
        $("#" + value.Name).addClass("clickable")
        lookup[value.Name] = index;
    })

    console.log("something")
    $(".clickable").click(function (evt) {
        $("#thoughtBubble").css({
            "left": evt.clientX + "px",
            "top": evt.clientY + "px",
            "display": "block"
        })
        element = document.getElementById("thoughtBubble");

        $("#thoughtBubble").removeClass("thoughtPop");
        void element.offsetWidth;
        var clickedItem = $(evt.target).closest('[id]').attr("id");
        console.log(clickedItem)
            //console.log(evt.clientX) 
        $("#thoughtBubble").text(clickable[lookup[clickedItem]].Text)
        $("#thoughtBubble").addClass("thoughtPop");
        startAnimating(1,clickable[lookup[clickedItem]])
    })


}



var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps, item) {
    animationItem = item;
    animationFrame = 1;
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}


function animate() {

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
console.log(animationFrame, animationItem.totalAnimationFrames)
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
if (animationFrame < animationItem.totalAnimationFrames) {
var selector = "#" + animationItem.Name.split("_")[0] +"_";
        $( selector + animationFrame ).attr("style","display:none")
       
        animationFrame++
         $( selector + animationFrame ).attr("style","display:inline")
        // Put your drawing code here
}
    
    
    else
        {
             $( selector + animationFrame ).css("display","none")  
            $( selector + 1 ).css("display","inline")
        }
    }
}