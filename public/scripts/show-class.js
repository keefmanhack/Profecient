$('.assignment-description').on('click', function(){
	$(this).next().toggleClass('show');
});

$('.details-description button').on('click', function(){
	$(this).parent().removeClass('show');
});
