var clickable;
var defaultFrameRate = 5
var lookup = {};
var items={};
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
var startingWidth, startingHeight, aspect;
var phaseText = ["Find the Triggers", "Ways to avoid the triggers:"]
var phase = getParameterByName("phase");
var factorTranslate = 1;
var factorScale = 1;
if (!phase) {
  phase = 0
}
$('#phaseNum').html(phaseText[phase]);



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
  currentRoom = getParameterByName("room");
  if (!currentRoom) {
    currentRoom = "bedRoom";
  }

  loadNewRoom(currentRoom);

  resizeScreen();

  $('#scalerDiv input').on("change", function(evt) {

    var item = $('#item').val()

    factorTranslate = $('#factorTranslate').val();
    factorScale = $('#factorScale').val();
    var scale = ($('#scale').val()) * factorScale + .5;
    var translateX = ($('#translateX').val() - 50) * factorTranslate;
    var translateY = ($('#translateY').val() - 50) * factorTranslate;
    console.log(translateX, translateY, scale);



    var cubbyItem = $("#cubbySVG_" + item).attr("transform", `translate(${translateX},${translateY}) scale(${scale})`);
    console.log(`"Scale":"translate(${translateX},${translateY}) scale(${scale})"`)


  })

});


//setTimeout(resizeScreen,'200');																		//	For IE
function resizeScreen() {
  var w = $(window).width();
  var h = $(window).height();

  // If the aspect ratio is greater than or equal to 4:3, fix height and set width based on height
  if ((w / h) >= aspect) {
    stageHeight = h;
    stageWidth = (aspect) * h;
    stageLeft = (w - stageWidth) / 2;
    stageTop = 0;
  }
  // If the aspect ratio is less than 4:3, fix width and set height based on width
  else {
    stageWidth = w;
    stageHeight = (aspect) * w;
    stageTop = (h - stageHeight) / 2;
    stageLeft = 0;
  }

  // Set "screen" object width and height to stageWidth and stageHeight, and center screen
  $("#screen").css({
    width: stageWidth + "px",
    height: stageHeight + "px",
    left: stageLeft + "px",
    top: stageTop + "px"
  });

  // $("#roomSVG > svg").attr({
  // 	'width': $("html").width() + 'px',
  // 	'height': $("html").width() / 1.6 + 'px'
  // }); //	For IE
  //console.log($("html").width())
  $("html").css('fontSize', $("html").width() / 120 + "px");
}

function loadNewRoom(roomName) {
  currentRoom = roomName;
  console.log(roomName)
  $('#phaseNum').html(phaseText[phase]);
  totalTriggers = 0;
  var Dev = getParameterByName("Dev") || "";
  $.getJSON(roomName + Dev + ".json", function(data) {
    nextRoom = data.nextRoom;
    console.log(roomName + "what")
    clickable = data.targets;
    //$("#room").css("font-size", "100px");
    $("#roomSVG").load("img/rooms/" + data.roomImage, roomSvgLoad);

    resizeScreen();
  }).fail(function() {
    console.log(roomName + "Dev.json");
  })
}


function roomSvgLoad() {
  $("#treasureChest").empty();
  $(clickable).each(function(index, value) {

    if ("audioFile" in value) {
      soundEffects[value.Name] = ss_soundbits("audio/" + value.audioFile);
    }
    if ("isTrigger" in value) {

      if (phase == 1) {
        var cubbyDiv = $(".cubbyCopier").clone()
        cubbyDiv.attr("id", "cubby_" + value.Name)
        cubbyDiv.attr("class", "cubbyCopy")

        $("#treasureChest").append(cubbyDiv)
        var cubbySVG = $("#cubby_" + value.Name + " svg");



        var cubbyItem = jQuery("#" + value.Name).clone();

        cubbyItem.attr("id", "cubbySVG_" + value.Name);

        cubbyItem.appendTo(cubbySVG).css('opacity', '0');
        console.log("cubbySVG_" + value.Name)
        cubbyItemBBox = document.getElementById("cubbySVG_" + value.Name).getBBox()
        console.log();
        $("#cubbySVG_" + value.Name + ' g[id]').each(function(item, val) {

          var oldID = $(val).attr("id");
          $(val).attr("id", "cubbySVG_" + oldID)

        })

          document.getElementById("cubbySVG_"+value.Name).setAttribute("transform", value.thumbScale || "");
          
      }

      totalTriggers++;
      value.unClicked = true;
    }
    $('.cubbyCopy').css("width", (100 / totalTriggers) + "%")
    triggersLeft = getParameterByName("triggersLeft") || totalTriggers;

    displayTriggersLeft();

    $("#" + value.Name).addClass("clickable")
    lookup[value.Name] = index;
    //startingWidth=$("#screen").width();
    //startingHeight=$("#screen").height();

    //aspect=startingWidth/startingHeight;
    aspect = 1 / 1
    //console.log(aspect,$("#screen").height(),$("#roomSVG").height())
  })

  /*
	$(".cubbyCopy").css("width", (100/totalTriggers)+"%" )

	var cubbyCount = totalTriggers
	while (cubbyCount--) {

	}
	*/
  makeClickEvents();

  var item = getParameterByName("item") || "Intro"

  console.log(item)
  $('#' + item).trigger('click')
  $('#item').val(item)
  //"translate(275,-350) scale(1.3)"
  //var itemObject = clickable.find(function(d){return d.Name==item})

  $('#factorTranslate').val(factorTranslate)
  $('#factorScale').val(factorScale)
  resizeScreen(); //	For IE
}

function makeClickEvents() {

  $(".clickable").click(function(evt) {
    console.log(evt)

    var clickedItem = evt.currentTarget.id

    // $(evt.target).closest('.clickable').attr("id");
    itemClicked(clickedItem)
  });
}

function itemClicked(clickedItem) {
  console.log(clickedItem)
  var item = clickable[lookup[clickedItem]];


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

function disappear(it) {
  var xerox = $("#cubbySVG_" + $(it).attr('id'));
  it.animate({
      opacity: 0,
    },
    1000,
    function() {


    }
  );
  xerox.animate({
      opacity: 1,
    },
    1000,
    function() {


    }
  );


}

function transition() {
  if (!triggersLeft) {
    triggersLeft = totalTriggers;
    var room = currentRoom;
    console.log(currentRoom)
    if (phase == 1) {
      console.log(currentRoom, nextRoom)
      room = nextRoom;
    }
    changePhase();
    loadNewRoom(room);
    console.log(room)
    return;
  }

}

function thoughts(it) {
  $("#thoughtBubble").removeClass("thoughtPop");





  var alreadyClickedText = ""
  if (!it.unClicked && it.isTrigger) {
    alreadyClickedText = " <em>(You found this already!)</em>"
  }


  displayThought()
  it.unClicked = false;
  $("#close").click(function(evt) {


    $("#thoughtBubble").css({
      "display": "none"
    });

    if (phase == 1 && it.isTrigger) {
      disappear($("#" + it.Name));
    }

    transition();
  });

  function displayThought() {
    console.log(it.xValue || 50)
    $("#thoughtBubble").css({
      "left": it.xValue || 25 + "%",
      "top": it.yValue || 25 + "%"
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

      $('textarea').val(it.Text[phase])

      $('form').submit(function(event) {

        $.post("save.php", {
          name: it.Name,
          room: currentRoom,
          phase: phase,
          text: $('textarea').val()
        }).done(function(data) {
          window.location = "?edit=True&item=" + it.Name + "&room=" + currentRoom + "&phase=" + phase;
          ///  window.location = window.location.search
        });
        console.log("" || it.Name)
        event.preventDefault();
      })



    } else {
      $("#thoughtBubble p").html(it.Text[phase] + alreadyClickedText)
    }

  }


}

function countTriggers(item) {
  if (triggersLeft) triggersLeft--;
  displayTriggersLeft();
}

function changePhase() {
  phase = 1 - phase
}



function displayTriggersLeft() {

  $('#triggersLeft').html(triggersLeft);
}
// initialize the timer variables and start the animation
function startAnimating(fps, item) {
  if (!isAnimating) {
    isAnimating = true;
    animationItem = item;
    animationItem.animationFrame = 1;
    animationItem.loopAmount = item.loopAmount | 0;
    animatingList.push(animationItem)
    fpsInterval = 1000 / fps;

    then = Date.now();
    startTime = then;
    animate();
  }
}

function animate() {
  if (isAnimating) requestAnimationFrame(animate);
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  // if enough time has elapsed, dr)aw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    animatingList.forEach(function(item, index) {

      var itemID = item.Name.split("-")[0] + "-";
      var selector = "#" + itemID;
      var animationLength = 0
      //console.log(y);
      $("[id^='" + itemID + "']").each(function(idx, val) {

          if (RegExp(itemID + '[0-9]*$').test(val.id)) {
            $(val).attr("style", "display:none")
            animationLength++;
          }


        }



      )






      if (item.animationFrame <= (animationLength * (animationItem.loopAmount + 1))) {
        //var displayFrame = (animationFrame % animationItem.totalAnimationFrames) + 1
        //wacky cal
        var displayFrame = Math.abs((item.animationFrame + animationLength - 2) % ((animationLength - 1) * 2) - (animationLength - 1)) + 1

        $(selector + displayFrame).attr("style", "display:inline")
        item.animationFrame++
      } else {
        thoughts(item);
        delete animatingList[index]
        isAnimating = false;
        if (item.stopAtEnd) {
          $(selector + animationLength).attr("style", "display:inline");
        } else {
          $(selector + 1).attr("style", "display:inline");
        }

      }
    });
  }
}
