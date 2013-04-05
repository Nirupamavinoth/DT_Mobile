(function($){
	
	//set default values in Model //
		var LoginFormModel = Backbone.Model.extend({
		
		url :function()
		{return "https://admin.telekom.intercloud.net/Orchestration/user/rac"},
		
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
				$("#usernameError").text("Please enter username");
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

	var LoginForm = new Backbone.Collection.extend({
        model: LoginFormModel
        
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
			fnLoginDisplay("#contentFilteringTemplate");
        	//viewDeviceName = this.model.get('name')
        	
        	$("#contentFilteringTemplate").html()
			this.log_router=new LoginFormModel();
			this.log_router.fetch({
				success:function(model, response){
					login.collection = new LoginForm(response);
					login.render();	
				},
				error:function(data){
					alert("")
				}
			});
	}
	
	});
	
	var loginView = new LoginFormView({
		model : new LoginFormModel()
	});
	
	var loginroute = new mobRouter();
	login = new LoginFormView();
	Backbone.history.start();
	
})(jQuery);


