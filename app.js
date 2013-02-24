// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	
	urlArgs: 'cb=' + Math.random(),
	paths: {
		// Core Libraries
		"jquery": "../lib/jquery-1.8.3",
		"jquery.serializeobject": "./serializeObject",
		"underscore": "../lib/lodash",
		"moment": "../lib/moment",
		"bootstrap": "../lib/bootstrap",
		"spin": "../lib/spin",
		"spinhelper": "../lib/spin.helper",
		"ratchet": "../lib/ratchet"
	},

	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		"bootstrap": ['jquery'],
		"spin": ['jquery'],
		"nouislider": ['jquery'],
		"spinhelper": ['jquery', 'spin']
	} // end Shim Configuration
});

require(["./Workspace", "bootstrap", "ratchet"], function(Workspace, bootstrap, ratchet) {
	
	
	console.log("Starting app...");

	$(document).ready(function() {

		// If there is a nutrients list in localStorage
		// use it - otherwise
		// create an empty nutrients list
		var nutrients = Nutrients();
		// Create a workspace for the app. This will partly be responsible for
		// routing the app to the right place, but also hold any state or
		// caches that we might need. It will create views, objects and collections
		// as neccessary when routing.
		var Workspace = Backbone.Router.extend({

			routes: {
				"home":       "home",    // #home
				"summary":    "summary",  // #sum
				"eat":        "eat"   // #eat
			},

			updateContent : function(view) {
				$(".content").empty().append(view.render().$el);
				$(".content").scrollTop(0);
				$("body").scrollTop(0);
				
				// This is a fix for non-working drop-down menus on iPad and iPhone (from https://github.com/twitter/bootstrap/issues/2975#issuecomment-6659992)
				$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
				
				this.updatePageTitle(view);
				this.updateActiveTab(view);
			},

			home: function() {
				this.updateContent(new HomeView());
				// update content with HomeView
				// where nutrient list can be reset
				// and days result can be exported?
			},

			summary: function() {
				this.updateContent(new SumView(nutrients));
				// update content with SumView
			},

			eat: function() {
				this.updateContent(new EatView());
				// update content with EatView
			}

		});
	});
});