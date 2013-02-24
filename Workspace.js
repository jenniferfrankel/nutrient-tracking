define([
	"jquery","parse","underscore", "spin",
	"SumView",
	"EatView",
	"HomeView"
	],
function(
	$, Parse, _, spin,
	SumView,
	EatView,
	HomeView
	) {
	return Parse.Router.extend({
		/**
		 * A list of routes for this app.
		 */
		routes: {
			"": "home",
			"home": "home",
			"summary": "summary",
			"eat": "eat",
			"*path": "home"
		},

		initialize: function() {
			_.bindAll(this);
			Parse.history.start();

			this.on("all", function() {
				var url = Parse.history.getFragment();
				// Track the route in google analytics
				_gaq.push(['_trackPageview', "/#"+url]);
				localStorage.setItem("lastRoute", window.location.hash);
			});

			var lastRoute = localStorage.getItem("lastRoute");
			if (lastRoute) {
				console.log("Restoring last route to "+lastRoute);
				window.location.hash = lastRoute;
			}
		},

		/**
		 * The default route. For now, just take the users to the categories list.
		 */
		home: function(){
			this.updateContent(new HomeView());
			//this.navigate("categories", {trigger: true, replace: true});
		},

		eat: function(){
			this.updateContent(new EatView());
		},

		releasenotes: function(){
			this.updateContent(new ReleasenotesView());
		},

		faq: function(){
			this.updateContent(new FaqView());
		},

		feedback: function(){
			this.updateContent(new FeedbackView());
		},

		resetPassword: function(){
			this.updateContent(new ResetPasswordView(), true);
			$("#myModal").modal('hide');
		},

		about: function(){
			//this.updateContent(new AboutView());
			var view = new AboutView();
			$("#myModal").empty().append(view.render().$el);
			$('#myModal').modal();
		},

		addCategory: function(){
			this.updateContent(new AddCategoryView());
		},

		/**
		 * List the available categories of symptoms
		 */
		listCategories: function(){
			this.updateContent(new CategoryListView());
		},

		/**
		 * Show the list of symptoms for the specified category.
		 *
		 * @param categoryName - the name of the category of the symptoms we are listing.
		 */
		listSymptoms: function(categoryName) {
			this.updateContent(new SymptomListView(categoryName));
		},

		addSymptom: function(categoryName) {
			this.updateContent(new AddSymptomView(categoryName));
		},

		editSymptom: function(categoryName, symptomId) {
			this.updateContent(new AddSymptomView(categoryName, symptomId));
		},

		signup: function() {
			var that = this;
			var onSignupSuccess = function() {
				// TODO: Take user to tutorial
				that.navigate("categories", {trigger: true, replace: true});
				QueryHelper.resetCache();
			};
			var signUpView = new SignUpView({
				success: onSignupSuccess
			});
			this.updateContent(signUpView, true);
			// Remove the login modal to show signup screen:
			$("#myModal").modal('hide');
		},

		login: function() {
			if (!!Parse.User.current()) {
				// If we are logged in already, and the user goes to the login
				// page (somehow), just send them home.
				this.navigate("categories", {trigger: true, replace: true});
			} else {
				var that = this;
				var onLoginSuccess = function() {
					$('#myModal').modal('hide');
					QueryHelper.emptyCache();
					that.navigate("categories", {trigger: true, replace: true});
				};
				var view = new LogInView({
					success: onLoginSuccess
				});
				//this.updateContent(view, true);
				$("#myModal").empty().append(view.render().$el);
				$('#myModal').modal({backdrop: 'static'});
			}
		},

		logout: function() {
			Parse.User.logOut();
			this.navigate("login", {trigger: true, replace: true});
		},

		/**
		 * Swap out the current contents with a new view. If a user is not
		 * logged in, they will be directed to the login/signup flow unless
		 * the allowWithoutLogin flag is passed.
		 *
		 * @param view - the view that should be rendered
		 * @param allowWithoutLogin - boolean to determine if we are skipping the login requirement.
		 */
		updateContent : function(view, allowWithoutLogin) {
			if (allowWithoutLogin || !!Parse.User.current()) {
				$(".content").empty().append(view.render().$el);
				$(".content").scrollTop(0);
				$("body").scrollTop(0);
			} else {
				this.locationAfterLogin = window.location.hash;
				this.navigate("login", {trigger: true, replace: true});
			}
			
			// This is a fix for non-working drop-down menus on iPad and iPhone (from https://github.com/twitter/bootstrap/issues/2975#issuecomment-6659992)
			$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
			
			this.updatePageTitle(view);
			this.updateBackButton(view);
			this.updateNewButton(view);
			this.updateActiveTab(view);
		},

		updatePageTitle : function(view) {
			$("#page-title").html(view.pageTitle);
		},

		updateBackButton : function(view) {
			if(!!view.backButtonText){
				$("#backButton").text(view.backButtonText);
				$("#backButton").show();
				$("#backButton").off("click").click(function(event) {
					event.preventDefault();
					window.location.hash = view.backLocation;
				});
			}else{
				$("#backButton").hide();
			}
			
		},

		updateNewButton : function(view) {
			if (view.newButtonFn) {
				$("#newButton").show().off("click").click(function(event) {
					event.preventDefault();
					view.newButtonFn();
				});
			} else {
				$("#newButton").hide();
			}
		},

		updateActiveTab : function(view) {
			if (view.tabId) {
				$(".bar-tab .tab-item").removeClass("active");
				$(view.tabId).addClass("active");
			}
		}
	});
});