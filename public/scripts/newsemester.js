const courseName = "Course Name";

var newClass = $("form button:contains(New Class)");
var complete = $("form button:contains(Complete)");
var removeButton = $("form button:contains(Remove Class)");

var form = document.querySelectorAll("form");

function addDayChecked(){
	document.querySelectorAll(".select-Days > .col-auto > .col-sm-12> label").forEach(function(label){
			label.onclick = function(){
				this.classList.toggle("dayChecked");
			}
	});

}

addDayChecked();
createFun();

newClass.click(function(){
	form[0].insertAdjacentHTML('beforeend',`<div class="newClass">
			<div class="row">
				<div class="col-sm-3">
					<input type="text" class="form-control" name="class[name]" placeholder="Course Name" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
					</div>
				<div class="col-sm-3">
					<input type="text" class="form-control" name="class[instructor]" placeholder="Instructor" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-3">
					<input type="text" class="form-control" name="class[location]" placeholder="Location" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-2">
					<button class="btn btn-danger" type="button">Remove Class</button>
				</div>
			</div>

			<div class="row">
				<div class="select-Days">
					<div class="col-auto">
						<div class="col-sm-12">
							<input class=check type="checkbox" value="true" id="monday" name="class[days][monday]">
							<input class=hid type="hidden" value="false" name="class[days][monday]">
							<label for="monday">Monday</label>
							<input class=check type="checkbox" id="tuesday" value="true" name="class[days][tuesday]">
							<input class=hid type="hidden" value="false" name="class[days][tuesday]">
							<label for="tuesday">Tuesday</label>
							<input class=check type="checkbox" id="wednesday" value="true" name="class[days][wednesday]">
							<input class=hid type="hidden" value="false" name="class[days][wednesday]">
							<label for="wednesday">Wednesday</label>
							<input class=check type="checkbox" id="thursday" value="true" name="class[days][thursday]">
							<input class=hid type="hidden" value="false" name="class[days][thursday]">
							<label for="thursday">Thursday</label>
							<input class=check type="checkbox" id="friday" value="true" name="class[days][friday]">
							<input class=hid type="hidden" value="false" name="class[days][friday]">
							<label for="friday">Friday</label>
							<input class=check type="checkbox" id="saturday" value="true" name="class[days][saturday]">
							<input class=hid type="hidden" value="false" name="class[days][saturday]">
							<label for="saturday">Saturday</label>
							<input class=check type="checkbox" id="sunday" value="true" name="class[days][sunday]">
							<input class=hid type="hidden" value="false" name="class[days][sunday]">
							<label for="sunday">Sunday</label>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<h5>From</h5>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-1">
					<input placeholder="10" class="form-control" type="number" min="1" max="12" name="class[time][startHour]" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-1">
					<input placeholder='15' class='minute form-control' type="number" min="0" max="60" name="class[time][startMinute]" onchange="if(parseInt(this.value,10)<10 && this.value !== '00')this.value='0'+this.value;" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-1">
					<select class="form-control" name="class[time][startAMPM]">
						<option value="AM">AM</option>
						<option value="PM">PM</option>
					</select>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<h5>To</h5>
				</div>
			</div>
			<div class="row">
					<div class="col-sm-1">
					<input placeholder="10" class="form-control" type="number" min="1" max="12" name="class[time][endHour]" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-1">
					<input placeholder='15' class='minute form-control' type="number" min="0" max="60" name="class[time][endMinute]" onchange="if(parseInt(this.value,10)<10 && this.value !== '00')this.value='0'+this.value;" required>
					<div class="invalid-feedback">
					 	<i class="fas fa-exclamation-circle"></i>
					</div>
					<div class="valid-feedback">
						<i class="fas fa-check"></i>
					</div>
				</div>
				<div class="col-sm-1">
					<select class="form-control" name="class[time][endAMPM]">
						<option value="PM">PM</option>
						<option value="AM">AM</option>
					</select>
				</div>
				</div>
			<hr>
		</div>`);

	addDayChecked();
	createFun();
});



function createFun(){
	$("form button:contains(Remove Class)").on("click", function(){
		$(this).parents(".newClass").remove();
	});
}



$("form").submit(function(){
	var checkboxes = $(".check");
	var hiddenboxes = $(".hid");
	var labels = $(".select-Days > .col-auto > .col-sm-12> label");
	var times = $('.time .minute');

	var ct =0;

	for(var i =0; i< checkboxes.length; i++){
		console.log('for');
		if (labels[i].classList.contains("dayChecked")){
			checkboxes[i].checked = true;
		}else{
			checkboxes[i].checked = false;
		}


		if(checkboxes[i].checked){
			console.log("checkbox");
			hiddenboxes[i].remove();
		}else{
			console.log("hid");
			checkboxes[i].remove();
		}
	}
});



