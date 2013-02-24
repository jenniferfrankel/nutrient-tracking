define(
	["jquery", "underscore", "text!../Sum.html"],
	function($, _, template) {
	return Backbone.View.extend({

		pageTitle: "Summary",
		tabId: "#sumTab",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			this.render();
		},

		render: function() {
			this.$el.html(this.template(nutrients));
			return this;
		}
	});
});
