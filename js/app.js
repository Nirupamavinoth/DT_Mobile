(function($){
	
	//set default values in Model //
		var LoginFormModel = Backbone.Model.extend({
		
		url :function(){
			
			return "data.json"
			
		},
		
			defaults : {
			username : '',
			password : '',
			rememberMe : ''
			
		},
		
		
		// Its called when an instance of the model is created
		initialize : function(){
			console.log();
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
				//$("#usernameError").text("Please enter username");
				$("#username").addClass("error_input")
			}
			else{
				//$("#usernameError").text("");
				$("#username").removeClass("error_input")
			}

			if(!this.get("password")){
				//("#passwordError").text("Please enter password");
				$("#password").addClass("error_input")	
			}
			else{
				//$("#passwordError").text("");
				$("#password").removeClass("error_input")	
			}

			this.getLoginDetails();
		},
		
		getLoginDetails : function(){
			console.log("Logging in");
		}
		
	});

	var LoginFormCollection = new Backbone.Collection.extend({
        model : LoginFormModel,
        url: ' data.json',
       	url:function()
			{
				return this.urlRoot;
			}
        
	});
	
	var LoginForm = Backbone.View.extend({
		
		currentTemplate: "tmplFrmLogin",
			initialize:function(){
					this.render();
				},
			
	
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
			this.$el.append(form);
		},
		
		handleLoginSubmit : function(e){
			// prevent form submission
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			console.log(data);
			this.model.save();
			
			if(this.model.enterLogin(true)){
				
		      this.$('.alert-success').fadeIn();
		    }
		    else {
		      this.$('.alert-error').fadeIn();
		    }
		    
		    
		}
	});
	
	var mobRouter = Backbone.Router.extend({
		
		routes: {
           
 	    	"btnLogin":"loginbut"
 	    
        },
        
        loginbut: function(){
			("#contentFilteringTemplate").show();
      /*  	      	
        	$("#contentFilteringTemplate").html()
			this.log_router=new LoginFormModel();
			this.log_router.fetch({
				success:function(model, response){
					login.collection = new LoginFormCollection(response);
					login.render();	
				},
				error:function(data){
					alert("")
				}
			});*/
	}
	
	});
	
	var loginView = new LoginFormView({
		model : new LoginFormModel()
	});
	
	var loginroute = new mobRouter();
	login = new LoginFormView();
	Backbone.history.start();
	
})(jQuery);


