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
var triggersLeft;
var stop = false;
var frameCount = 0;
var nextRoom;
var fps, fpsInterval, startTime, now, then, elapsed;
$(window).resize(function () {
    resizeScreen();
});
$(function () {
    $.get("opening.txt", function (data){
      var item ={}
      item.Text=data;
      item.xValue=5
      item.yValue=10
      thoughts(item);
    })
    loadNewRoom("bedRoom");

});

function resizeScreen() {
    //console.log($("html").width())
    $("html").css('fontSize', $("html").width() / 100 + "px");
}

function loadNewRoom(roomName) {
    totalTriggers = 0;
    $.getJSON(roomName + ".json", function (data) {
        console.log(data);
        nextRoom = data.nextRoom;
        console.log(nextRoom);
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
            triggersLeft = totalTriggers;
        displayTriggersLeft();

        $("#" + value.Name).addClass("clickable")
        lookup[value.Name] = index;

        console.log(triggersLeft);
    })
makeClickEvents();
}

function makeClickEvents(){

  $(".clickable").click(function (evt) {
    console.log(evt.currentTarget)
      var clickedItem =   evt.currentTarget.id// $(evt.target).closest('.clickable').attr("id");
    itemClicked(clickedItem)
});
}

function itemClicked(clickedItem){
  var item = clickable[lookup[clickedItem]];
  console.log(clickedItem);
  if (clickedItem == "Door"){

    if (triggersLeft == 0){
          loadNewRoom(nextRoom);
          return;
    }



  }
  thoughts(item);

  var fps = item.frameRate || defaultFrameRate;
  if ("audioFile" in item) {
      soundEffects[item.Name].playclip();
  }
  if ("isTrigger" in item) {
      if (item.unClicked) {
          countTriggers(item);
      }

  }

  startAnimating(fps, item);
};






function thoughts(it) {
  $("#thoughtBubble").removeClass("thoughtPop");
  //$("#thoughtBubble").css("display: block");
  setTimeout(function () {
      $("#thoughtBubble").css({
          "left": it.xValue + "rem"
          , "top": it.yValue + "rem"
      });
      $("#thoughtBubble").addClass("thoughtPop");
      $("#thoughtBubble").css("display", "inline");
      $("#thoughtBubble p").html(it.Text + alreadyClickedText)
  }, 20);

  var alreadyClickedText = ""
  if (it.unClicked == false) {
      alreadyClickedText = " <em>(You found this trigger already!)</em>"
  }

$("#close").click(function(evt) {

   $("#thoughtBubble").css({"display": "none"});

});
}

function countTriggers(item) {
    triggersLeft--;
    item.unClicked = false;
    displayTriggersLeft();
}

function displayTriggersLeft() {

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
