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
    totalAnimationFrames: 3,
    loopAmount: 3,

}, {
    Name: "Cat_1",
    Text: "Furry pets can trigger an asthma attack. Keep furry pets out of bedrooms. Wash furry pets often",
    totalAnimationFrames: 3,
    loopAmount: 3,
    audioFile: "Cat.mp3"
}, {
    Name: "Dog_1",
    Text: "This is a dog.",
    totalAnimationFrames: 3,
    loopAmount: 3
}, {
    Name: "Febreze_1",
    Text: "This is lung cancer.",
    totalAnimationFrames: 5,
    loopAmount: 3
}, {
    Name: "Bed",
    Text: "This is a bed."
}, {
    Name: "Plant",
    Text: "This is a plant."
}, {
    Name: "Dresser",
    Text: "This is a dresser."
}, {
    Name: "Nightstand",
    Text: "This is a nightstand."
}, {
    Name: "Roach",
    Text: "This is Satan's little minion. "
}, {
    Name: "Dust_1",
    Text: "This is some dust.",
    totalAnimationFrames: 3,
    loopAmount: 3,
    frameRate: 10
}];
var defaultFrameRate = 5
var lookup = {};
var animationItem;
var animationFrame;
var soundEffects = {};




$(function () {

    $("#room").css("font-size", "100px");
    $("#roomSVG").load("img/asthmaRoom.svg", roomSvgLoad);

});







function roomSvgLoad() {

    $(clickable).each(function (index, value) {
        if ("audioFile" in value) {
            soundEffects[value.Name] = ss_soundbits("audio/" + value.audioFile);
        }
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
        var clickedItem = $(evt.target).closest('.clickable').attr("id");
        console.log(clickedItem)
            //console.log(evt.clientX) 
        $("#thoughtBubble").text(clickable[lookup[clickedItem]].Text)
        $("#thoughtBubble").addClass("thoughtPop");
        var item = clickable[lookup[clickedItem]];
        var fps = item.frameRate || defaultFrameRate;
        console.log(soundEffects, soundEffects[item.Name])

        if ("audioFile" in item) {
            soundEffects[item.Name].playclip();
        }
        startAnimating(fps, item)
    })


}



var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps, item) {

    animationItem = item;
    animationFrame = 0;
    loopCount = 0;
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
        then = now - (elapsed % fpsInterval);
        var itemID = animationItem.Name.split("_")[0] + "_";
        var selector = "#" + itemID;
        $("[id^='" + itemID + "']").attr("style", "display:none")

        if (animationFrame < animationItem.totalAnimationFrames * animationItem.loopAmount) {


            //var displayFrame = (animationFrame % animationItem.totalAnimationFrames) + 1
            var y = animationItem.loopAmount
            var displayFrame = Math.abs((animationFrame + y - 2) % ((y - 1) * 2) - (y - 1)) + 1
            console.log(displayFrame)
            $(selector + displayFrame).attr("style", "display:inline")
            animationFrame++
        } else {

            $(selector + 1).attr("style", "display:inline")
        }
    }






    //            // Get ready for next frame by setting then=now, but also adjust for your
    //            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    //        then = now - (elapsed % fpsInterval);
    //        if (animationFrame < animationItem.totalAnimationFrames) {
    //
    //
    //    animationFrame++
    //          
    //            console.log(animationFrame, animationItem.totalAnimationFrames)
    //             $( selector + animationFrame ).attr("style","display:inline")
    //           
    //            // Put your drawing code here
    //        } else if (loopCount < animationItem.loopAmount) {
    //            animationFrame = 0;
    //        
    //            loopCount++;
    //
    //        } else {
    //            //   $( selector + 1 ).css("display","inline")
    //        }
    //
    //
    //

}