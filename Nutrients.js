var Nutrients = Backbone.Model.extend({

	initialize: function() {
		var nutrients = {
			Protein: 0,
			Carbohydrates: 0,
			Dairy: 0,
			Fat: 0,
			Vegetables: 0,
			Fruit: 0,
			Condiments: 0,
			Snack: 0,
			Bar: 0,
			Drink: 0
		};
		return nutrients;
	},

	updateNutrients: function(updates) {
		for (var item in updates) {
			this.nutrients[item] += updates[item];
		}
	},

	resetNutrients: function() {
		for (var item in nutrients) {
			this.nutrients[item] = 0;
		}
	},

	update: function(nutrient, calories) {
		this.nutrients[nutrient] += calories;
	},

	getTotalCalories: function() {
		return _.reduce(_.values(this.nutrients), function(memo, num){return memo+num;}, 0);
	}
});