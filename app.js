$(document).ready(function() {
	// If there is a nutrients list in localStorage
	// use it - otherwise
	// create an empty nutrients list
	var nutrients = Nutrients();

	var updateNutrientList = function(addedCalories){
		var nutrient;
		for (nutrient in addedCalories) {
			nutrients.update(nutrient, addedCalories[nutrient]);
		}
		console.log("Updated nutrient list");
		// Update localStorage
		// Update Summary page
	};

	var calorieOptions = function(){
		// Create and return html for calorie options list: 0, 5, 10...
		var i;
		var listOptions = '';
		var liOption = '';
	    for (i=0; i<310; i+=10){
	    	liOption = '<option value="' + i + '">' + i + '</option>';
	    	listOptions += liOption;
	    };
		var calorieOptions = '<div data-role="fieldcontain">
	    <label for="select-native-fc">Native select:</label>
	    <select name="select-native-fc" id="select-native-fc">' + listOptions + '</select>
		</div>';
		return calorieOptions;
	};
});