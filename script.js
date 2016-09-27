var clickable = [{Name:"Mirror",Text:"Mirror Text"}, {Name:"TV",Text:"TV Text"}, {Name:"Pillow",Text:"Pillow Text"}, {Name:"Bed",Text:"Bed Text"}, {Name:"Table",Text:"Table Text"}];
var lookup = {};
$(function() {

  $("#room").css("font-size","100px");  
    $("#roomSVG").load("img/room.svg", roomSvgLoad  );
  $("#thoughtbubbleSVG").load("img/thought_bubble.svg", thoughtBubbleSvgLoad  );
});




function roomSvgLoad (){
    
  $(clickable).each(function( index, value ) { 
      console.log($(value))     
       $("#" + value.Name).addClass("clickable")
       lookup[value.Name]=index;
   }
                 
                ) 
   
    
  console.log("something")  
 $(".clickable").click( function(evt){
  $("#thoughtbubbleSVG").css({ "left":evt.clientX+ "px", "top": evt.clientY+"px","display":"block" })
  $("#thoughtbubbleSVG svg").removeClass("thoughtPop");
   
    console.log(lookup) 
     var clickedItem = $(evt.target).closest('[id]').attr("id");
    //console.log(evt.clientX) 
     $("#thoughtbubbleSVG text").text(clickable[lookup[clickedItem]].Text)
       $("#thoughtbubbleSVG svg").addClass("thoughtPop");
 }  ) 
    
    
}

function  thoughtBubbleSvgLoad (){
  console.log("something")  
 $("#Mirror").click( function(){
        
     
 }  ) 
    
    
}

