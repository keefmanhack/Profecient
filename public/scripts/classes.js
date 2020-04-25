$(".dropdown").click(function(e){
	var classContent = $(this).parent().next();
	if(classContent.is(":visible")){
		classContent.hide("fast", "linear");
	}else{
		classContent.show("fast", "linear");
	}
});