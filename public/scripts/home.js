$(".dropdown").click(function(e){
	var classContent = $(this).parent().next();
	if(classContent.is(":visible")){
		classContent.hide("slow", "swing");
	}else{
		classContent.show("slow", "swing");
	}
});