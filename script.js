<<<<<<< HEAD
var clickable = [{Name:"Mirror",Text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et scelerisque libero. Nunc sed nunc nec nisi mollis vestibulum. Praesent pulvinar magna et condimentum lacinia. Donec tortor felis, fringilla sed ipsum vel, finibus placerat urna. Maecenas consectetur suscipit luctus. Nunc tristique porttitor porta. Donec tincidunt eleifend vehicula. Ut iaculis sed ante a bibendum."}, {Name:"TV",Text:"TV Text"}, {Name:"Pillow",Text:"Pillow Text"}, {Name:"Bed",Text:"Bed Text"}, {Name:"Table",Text:"Table Text"}];
=======
var clickable;

var defaultFrameRate = 5
>>>>>>> origin/master
var lookup = {};
var animationItem;
var animationFrame;
var soundEffects = {};
var animatingList =[];
var isAnimating;


$(function () {

<<<<<<< HEAD
  $("#room").css("font-size","100px");  
    $("#roomSVG").load("img/room.svg", roomSvgLoad  );

=======
    $.getJSON("clickable.json", function (data) {
        clickable = data.targets;
        console.log(clickable);
        //$("#room").css("font-size", "100px");
        $("#roomSVG").load("img/" + data.roomImage, roomSvgLoad);
    })
>>>>>>> origin/master
});




<<<<<<< HEAD
function roomSvgLoad (){
    
  $(clickable).each(function( index, value ) { 
      console.log($(value))     
       $("#" + value.Name).addClass("clickable")
       lookup[value.Name]=index;
   })
                 
  console.log("something")  
 $(".clickable").click( function(evt){
  $("#thoughtBubble").css({ "left":evt.clientX+ "px", "top": evt.clientY+"px","display":"block" })
  element = document.getElementById("thoughtBubble");
     
  $("#thoughtBubble").removeClass("thoughtPop");
     void element.offsetWidth;
    console.log(lookup) 
     var clickedItem = $(evt.target).closest('[id]').attr("id");
    //console.log(evt.clientX) 
     $("#thoughtBubble").text(clickable[lookup[clickedItem]].Text)
       $("#thoughtBubble").addClass("thoughtPop");
 }  ) 
    
    
}


=======



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
        console.log($("svg").width(), $("svg").height()); 
        $("#thoughtBubble").css({
                "left": evt.clientX + "px",
                "top": evt.clientY + "px",
                "display": "block"
            })
            //element = document.getElementById("thoughtBubble");
            //element.css()


        $("#thoughtBubble").removeClass("thoughtPop").animate({
            'nothing': null
        }, 1, function () {
            $(this).addClass("thoughtPop");
        });

        //$("#thoughtBubble").removeClass("thoughtPop");
        $("#thoughtBubble").css("display", "inline")
            //void element.offsetWidth;
        var clickedItem = $(evt.target).closest('.clickable').attr("id");
        console.log(clickedItem)
            //console.log(evt.clientX) 
        $("#thoughtBubble").html(clickable[lookup[clickedItem]].Text)
            // $("#thoughtBubble").addClass("thoughtPop");
        var item = clickable[lookup[clickedItem]];
        var fps = item.frameRate || defaultFrameRate;
        console.log(soundEffects, soundEffects[item.Name])

        if ("audioFile" in item) {
            soundEffects[item.Name].playclip();
        }
        
        if ("triggerClicked" in item) {
            item.triggerClicked = true;
        }
        
        console.log(item.triggerClicked);
        startAnimating(fps, item);
    })


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
>>>>>>> origin/master


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