var clickable;
var defaultFrameRate = 5
var lookup = {};
var animationItem;
var animationFrame;
var soundEffects = {};
var animatingList = [];
var isAnimating;
var triggersFound;
var totalTriggers;
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
$(window).resize(function () {
    resizeScreen();
});
$(function () {
    loadNewRoom("bathRoom");

});

function resizeScreen() {
    //console.log($("html").width())
    $("html").css('fontSize', $("html").width() / 100 + "px");
}

function loadNewRoom(roomName) {
    triggersFound = 0;
    totalTriggers = 0;
    $.getJSON(roomName + ".json", function (data) {
        clickable = data.targets;
        console.log(clickable);
        //$("#room").css("font-size", "100px");
        $("#roomSVG").load("img/" + data.roomImage, roomSvgLoad);
        resizeScreen();
    })
}

function roomSvgLoad() {
    $(clickable).each(function (index, value) {
        if ("audioFile" in value) {
            soundEffects[value.Name] = ss_soundbits("audio/" + value.audioFile);
        }
        if ("isTrigger" in value) {
            totalTriggers++;
            value.unClicked = true;
        }
        displayTriggersLeft();
        $("#" + value.Name).addClass("clickable")
        lookup[value.Name] = index;
    })
    $(".clickable").click(function (evt) {
        var clickedItem = $(evt.target).closest('.clickable').attr("id");
        var item = clickable[lookup[clickedItem]];
        var alreadyClickedText = ""
        if (item.unClicked == false) {
            alreadyClickedText = " <em>(You found this trigger already!)</em>"
        }
        $("#thoughtBubble").removeClass("thoughtPop");
        //$("#thoughtBubble").css("display: block");
        setTimeout(function () {
            $("#thoughtBubble").css({
                "left": item.xValue + "rem"
                , "top": item.yValue + "rem"
            });
            $("#thoughtBubble").addClass("thoughtPop");
            $("#thoughtBubble").css("display", "inline");
            $("#thoughtBubble p").html(item.Text + alreadyClickedText)
        }, 20);

      $("#close").click(function(evt) {
        console.log("mems");
         $("#thoughtBubble").css({"display": "none"});
            // $("#thoughtBubble").css("display", "inline");
        //})
        //element = document.getElementById("thoughtBubble");
        //element.css()
        //        $("#thoughtBubble").removeClass("thoughtPop").animate({
        //            'nothing': null
        //        }, 1, function () {
        //            $(this).addClass("thoughtPop");
      });
        //$("#thoughtBubble").removeClass("thoughtPop");
        //void element.offsetWidth;
        //console.log(evt.clientX)
        // $("#thoughtBubble").addClass("thoughtPop");
        var fps = item.frameRate || defaultFrameRate;
        if ("audioFile" in item) {
            soundEffects[item.Name].playclip();
        }
        if ("isTrigger" in item) {
            if (item.unClicked) {
                countTriggers(item);
            }

        }
        if (item.Name === "Door") {
            if (triggersFound >= 5) {
                loadNewRoom("livingRoom");

            }
        }
        startAnimating(fps, item);
    });

}

function countTriggers(item) {
    triggersFound += 1;
    item.unClicked = false;
    displayTriggersLeft();
}

function displayTriggersLeft() {
    var triggersLeft = totalTriggers - triggersFound;
    $('#triggersLeft').html(triggersLeft);
}
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
    isAnimating = requestAnimationFrame(animate);
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        animatingList.forEach(function (item, index) {
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
            }
            else {
                delete animatingList[index]
                $(selector + 1).attr("style", "display:inline")
            }
        });
    }
}
