(function($){
	
	//set default values in Model //
		var LoginFormModel = Backbone.Model.extend({
		defaults : {
			username : '',
			pass	 : '',
			rememberMe : true
		},
		// Its called when an instance of the model is created
		initialize : function(){
			console.log(this);
		},
		
		// for credentials set and validations
		
		enterLogin : function(e){
			
			this.setCredentials();
			this.validateForm();
		},
		setCredentials : function(){
			this.set({
				username 	: $("#username").val(),
				password 	: $("#password").val(),
				rememberMe 	: $("#rememberMe").is(":checked") ? true : false
			});

		},
		
		// validate the form
		validateForm : function(){
			
			if(!this.get("username")){
				$("#usernameError").text("Enter username");
			}
			else{
				$("#usernameError").text("");
			}

			if(!this.get("password")){
				$("#passwordError").text("Please enter password");	
			}
			else{
				$("#passwordError").text("");
			}

			this.getLoginDetails();
		},
		
		getLoginDetails : function(){
			console.log("Logging in");
		}
		
	});

	var LoginFormView = Backbone.View.extend({
		el : "#frmLogin",
		tmpl : $('#tmplFrmLogin').html(),
		events : {
			"submit" : "handleLoginSubmit"
		},
		initialize : function(){
			// render the login form whne the instance is created
			this.render();
		},
		
		render : function(){
			
			var form = _.template(this.tmpl,{ username : this.model.attributes.username });

			// $el is created by Backbone for us.. from the string selector given into el
			this.$el.append(form);
		},
		
		handleLoginSubmit : function(e){
			// prevent form submission
			e.preventDefault();
			
			if(this.model.enterLogin(true)){
				
		      this.$('.alert-success').fadeIn();
		    }
		    else {
		      this.$('.alert-error').fadeIn();
		    }
		}
	});

	var loginView = new LoginFormView({
		model : new LoginFormModel()
	});
	
})(jQuery);
