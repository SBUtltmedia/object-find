var clickable = [{Name:"Mirror",Text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et scelerisque libero. Nunc sed nunc nec nisi mollis vestibulum. Praesent pulvinar magna et condimentum lacinia. Donec tortor felis, fringilla sed ipsum vel, finibus placerat urna. Maecenas consectetur suscipit luctus. Nunc tristique porttitor porta. Donec tincidunt eleifend vehicula. Ut iaculis sed ante a bibendum."}, {Name:"TV",Text:"TV Text"}, {Name:"Pillow",Text:"Pillow Text"}, {Name:"Bed",Text:"Bed Text"}, {Name:"Table",Text:"Table Text"}];
var lookup = {};
$(function() {

  $("#room").css("font-size","100px");  
    $("#roomSVG").load("img/room.svg", roomSvgLoad  );

});




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



