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
var phaseText = ["Find the Triggers", "Ways to avoid the triggers:"]
var phase = getParameterByName("phase");

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

	$('#phaseNum').html(phaseText[phase]);
	totalTriggers = 0;
	$.getJSON(roomName + ".json", function(data) {
		console.log(data);
		nextRoom = data.nextRoom;

		clickable = data.targets;
		//$("#room").css("font-size", "100px");
		$("#roomSVG").load("img/" + data.roomImage, roomSvgLoad);

		resizeScreen();
	})
}


function roomSvgLoad() {

	$(clickable).each(function(index, value) {
		console.log(value.Name)
		if ("audioFile" in value) {
			soundEffects[value.Name] = ss_soundbits("audio/" + value.audioFile);
		}
		if ("isTrigger" in value) {
			/*
			var cubbyDiv = $( ".cubbyCopier" ).clone()
			cubbyDiv.attr("id" ,  "cubby_" + value.Name)
			cubbyDiv.attr("class",   "cubbyCopy")
				$("#treasureChest").append(cubbyDiv)
			var cubbySVG= $("#cubby_" + value.Name+" svg");

			jQuery("#" + value.Name).detach().appendTo(cubbySVG)
			//$("body").append(cubbyDiv)
			*/
			totalTriggers++;
			value.unClicked = true;
		}
		triggersLeft = getParameterByName("triggersLeft") || totalTriggers;

		displayTriggersLeft();

		$("#" + value.Name).addClass("clickable")
		lookup[value.Name] = index;

	})

  /*
	$(".cubbyCopy").css("width", (100/totalTriggers)+"%" )

	var cubbyCount = totalTriggers
	while (cubbyCount--) {

	}
	*/
	makeClickEvents();

	var item = getParameterByName("item") || "Intro"

	$('#' + item).trigger('click')


	resizeScreen(); //	For IE
}

function makeClickEvents() {

	$(".clickable").click(function(evt) {
		console.log(evt)

		var clickedItem = evt.currentTarget.id
		if (clickedItem == "Door") {
			if (!triggersLeft) {
				changePhase();
				loadNewRoom(nextRoom);
				evt.preventDefault();
				return;
			}
		}
		// $(evt.target).closest('.clickable').attr("id");
		itemClicked(clickedItem)
	});
}

function itemClicked(clickedItem) {
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
	it.animate({
			opacity: 0,
		},
		1000,
		function() {

			//$(this).css('visibility', 'hidden');
		}
	);

}


function thoughts(it) {
	console.log(it)
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
	console.log("phase")
	phase = phase == 0 ? 1 : 0;
}



function displayTriggersLeft() {

	$('#triggersLeft').html(triggersLeft);
}
// initialize the timer variables and start the animation
function startAnimating(fps, item) {
	animationItem = item;
	animationItem.animationFrame = 1;
	animationItem.loopAmount = item.loopAmount | 0;
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
	// if enough time has elapsed, dr)aw the next frame
	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		animatingList.forEach(function(item, index) {
			console.log(item)
			var itemID = item.Name.split("_")[0] + "_";
			var selector = "#" + itemID;
			$("[id^='" + itemID + "']").attr("style", "display:none")
			var animationLength = $("[id^='" + itemID + "']").length;
			//console.log(y);
			if (item.animationFrame <= (animationLength * (animationItem.loopAmount + 1))) {
				//var displayFrame = (animationFrame % animationItem.totalAnimationFrames) + 1
				//wacky cal
				var displayFrame = Math.abs((item.animationFrame + animationLength - 2) % ((animationLength - 1) * 2) - (animationLength - 1)) + 1

				$(selector + displayFrame).attr("style", "display:inline")
				item.animationFrame++
			} else {
				thoughts(item);
				delete animatingList[index]
				if (item.stopAtEnd) {
					$(selector + animationLength).attr("style", "display:inline");
				} else {
					$(selector + 1).attr("style", "display:inline");
				}
				if (phase == 1 && item.isTrigger) {
					disappear($("#" + item.Name));
				}
			}
		});
	}
}
