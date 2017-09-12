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
var currentRoom;
var phase;
var fps, fpsInterval, startTime, now, then, elapsed;
$(window).resize(function() {
  resizeScreen();
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
  var startingRoom = getParameterByName("room");
  console.log(startingRoom)
  if (!startingRoom) {
    startingRoom = "bedRoom";
  }

  loadNewRoom(startingRoom);

  resizeScreen();
});


//setTimeout(resizeScreen,'200');																		//	For IE
function resizeScreen() {
  $("#roomSVG > svg").attr({
    'width': $("html").width() + 'px',
    'height': $("html").width() / 1.6 + 'px'
  }); //	For IE
  //console.log($("html").width())
  $("html").css('fontSize', $("html").width() / 120 + "px");
}

function loadNewRoom(roomName) {
  currentRoom = roomName;
  var roomPhase = roomName;
  var phase = getParameterByName("phase");
  if (phase) {
    roomPhase += phase;
  }
  totalTriggers = 0;
  $.getJSON(roomPhase + ".json", function(data) {
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
  $(clickable).each(function(index, value) {
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
  if (getParameterByName("edit")) {
    var item = getParameterByName("item")
    if (item) {
      thoughts(clickable[lookup[item]]);
    }
  }

  thoughts(clickable[lookup["Intro"]]);
  resizeScreen(); //	For IE
}

function makeClickEvents() {

  $(".clickable").click(function(evt) {
    //  console.log(evt.currentTarget)
    var clickedItem = evt.currentTarget.id // $(evt.target).closest('.clickable').attr("id");
    itemClicked(clickedItem)
  });
}

function itemClicked(clickedItem) {
  var item = clickable[lookup[clickedItem]];
  //console.log(clickedItem);
  if (clickedItem == "Door") {

    if (triggersLeft == 0) {
      loadNewRoom(nextRoom);
      return;
    }



  }


  var fps = item.frameRate || defaultFrameRate;
  if ("audioFile" in item) {
    soundEffects[item.Name].playclip();
  }
  if ("isTrigger" in item) {
    if (item.unClicked) {
      countTriggers(item);
    }

  }

  if (item["totalAnimationFrames"]) {
    startAnimating(fps, item);
  } else {
    thoughts(item);
    if ("isTrigger" in item) {
      disappear($("#"+item.Name));
    }
  }
};

function disappear(it){
  console.log(it);
  it.animate({
      opacity: 0
    },
    1000,
    function() {
      $(this).css('visibility', 'hidden');
    }
  );
}

function thoughts(it) {
  $("#thoughtBubble").removeClass("thoughtPop");
  //$("#thoughtBubble").css("display: block");
  setTimeout(function() {
    displayThought()
  }, 20);

  var alreadyClickedText = ""
  if (it.unClicked == false) {
    alreadyClickedText = " <em>(You found this trigger already!)</em>"
  }

  $("#close").click(function(evt) {

    $("#thoughtBubble").css({
      "display": "none"
    });

  });

  function displayThought() {

    $("#thoughtBubble").css({
      "left": it.xValue + "rem",
      "top": it.yValue + "rem"
    });
    $("#thoughtBubble").addClass("thoughtPop");
    $("#thoughtBubble").css("display", "inline");

    if (getParameterByName("edit")) {

      $('#thoughtBubble p').html('<form><textarea id=txtArea></textarea> </form>');


      $('textarea#txtArea').ckeditor({
        height: "300px",
        toolbarStartupExpanded: true,
        width: "100%"
      });

      $('textarea').val(it.Text)

      $('form').submit(function(event) {

        $.post("save.php", {
          name: it.Name,
          room: currentRoom,
          text: $('textarea').val()
        }).done(function(data) {
          window.location = "?edit=True&item=" + it.Name;
        });
        console.log("" || it.Name)
        event.preventDefault();
      })



    } else {
      $("#thoughtBubble p").html(it.Text + alreadyClickedText)
    }

  }


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
    animatingList.forEach(function(item, index) {
      //console.log(item)
      var itemID = item.Name.split("_")[0] + "_";
      var selector = "#" + itemID;
      $("[id^='" + itemID + "']").attr("style", "display:none")
      if (item.animationFrame < animationItem.totalAnimationFrames * animationItem.loopAmount) {
        //var displayFrame = (animationFrame % animationItem.totalAnimationFrames) + 1
        var y = item.totalAnimationFrames
        var displayFrame = Math.abs((item.animationFrame + y - 2) % ((y - 1) * 2) - (y - 1)) + 1

        $(selector + displayFrame).attr("style", "display:inline")
        item.animationFrame++
      } else {
        thoughts(item);
        delete animatingList[index]
        $(selector + 1).attr("style", "display:inline");
        disappear($(selector + 1));

      }
    });
  }
}
