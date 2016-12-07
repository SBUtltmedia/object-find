var clickable;

var defaultFrameRate = 5
var lookup = {};
var animationItem;
var animationFrame;
var soundEffects = {};
var animatingList =[];
var isAnimating;
var triggersFound = 0;
var totalTriggers = 0;


$(function(){
 loadNewRoom("bedRoom");
   $( window ).resize( function() {
       
        resizeScreen();
  });
            resizeScreen();
});

function resizeScreen(){
    //console.log($("html").width())
    $("html").css('fontSize',$("html").width()/100+"px");
    
    
}


function loadNewRoom(roomName)
    {
 $.getJSON(roomName+".json", function (data) {
        clickable = data.targets;
        console.log(clickable);
        //$("#room").css("font-size", "100px");
        $("#roomSVG").load("img/" + data.roomImage, roomSvgLoad);
    })      
    }
    

    
    
    
function roomSvgLoad() {


    $(clickable).each(function (index, value) {
        if ("audioFile" in value) {
            soundEffects[value.Name] = ss_soundbits("audio/" + value.audioFile);
        }
        console.log($(value))
        $("#" + value.Name).addClass("clickable")
        lookup[value.Name] = index;
    })

    $(".clickable").click(function (evt) {
        var clickedItem = $(evt.target).closest('.clickable').attr("id");
        var item = clickable[lookup[clickedItem]];
        console.log(item)
        $("#thoughtBubble").removeClass("thoughtPop");
        setTimeout(function() {
            $("#thoughtBubble").addClass("thoughtPop");
            $("#thoughtBubble").css({
                "left": item.xValue + "rem",
                "top": item.yValue + "rem",
                "display": "block"
            })
        }, 20);
        
            //element = document.getElementById("thoughtBubble");
            //element.css()


//        $("#thoughtBubble").removeClass("thoughtPop").animate({
//            'nothing': null
//        }, 1, function () {
//            $(this).addClass("thoughtPop");
//        });
        

        //$("#thoughtBubble").removeClass("thoughtPop");
        $("#thoughtBubble").css("display", "inline")
            //void element.offsetWidth;
      
      
            //console.log(evt.clientX) 
        $("#thoughtBubble").html(clickable[lookup[clickedItem]].Text)
            // $("#thoughtBubble").addClass("thoughtPop");

        var fps = item.frameRate || defaultFrameRate;
       

        if ("audioFile" in item) {
            soundEffects[item.Name].playclip();
        }
        
        if ("triggerClicked" in item) {
            item.triggerClicked = true;
            countTriggers(item);
        }
        
        if (item.Name === "Door") {
            if(triggersFound >= 5){
                triggersFound = 0;
                for (i = 0; i<clickable.length; i++) {
                    if ("triggerClicked" in clickable[i] && "alreadyClicked" in clickable[i]){
                    clickable[i].triggerClicked = false;
                    clickable[i].alreadyClicked = false;
                    }
                    else{}
                };
               loadNewRoom("livingRoom");
            }
        }
        
        console.log(triggersFound);
        startAnimating(fps, item);
        
    })


}

function countTriggers(item) {
    if (item.triggerClicked === true) {
        if (item.alreadyClicked === false) {
            triggersFound += 1;
            item.alreadyClicked = true;
             console.log($(clickable).length)
        }
        
        else {
            //do nothing
        }
    }
    
    return triggersFound;
}

var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps, item) {

    animationItem = item;
    animationItem.animationFrame = 1;
    animatingList.push(animationItem)
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}


function animate() {

    // request another frame

    isAnimating= requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        animatingList.forEach(function(item,index){
        //console.log(item)
        var itemID = item.Name.split("_")[0] + "_";
        var selector = "#" + itemID;
        $("[id^='" + itemID + "']").attr("style", "display:none")

        if (item.animationFrame < animationItem.totalAnimationFrames * animationItem.loopAmount) {


            //var displayFrame = (animationFrame % animationItem.totalAnimationFrames) + 1
            var y = item.totalAnimationFrames
            var displayFrame = Math.abs((item.animationFrame + y - 2) % ((y - 1) * 2) - (y - 1)) + 1
            console.log(displayFrame, item.animationFrame, item.totalAnimationFrames)
            $(selector + displayFrame).attr("style", "display:inline")
            item.animationFrame++
        } else {
            delete  animatingList[index]
            $(selector + 1).attr("style", "display:inline")
        }
    });



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

}}