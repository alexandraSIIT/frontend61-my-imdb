var domElements={};
var settings={nameLength_min:6,nameLength_max:36,passwordLength_min:6,passwordLength_max:36};
function adddomElements(){
	//domElements[""] = document.getElementById("");
	console.groupCollapsed('adddomElements');
	domElements["btnNewAccount"] = document.getElementById("btnNewAccount");
	domElements["btnGo2LogIn"] = document.getElementById("btnGo2LogIn");
	
	domElements["sectionUserLogIn"] = document.getElementById("sectionUserLogIn");
	domElements["authLoginOrRegister"]= document.getElementById("authLoginOrRegister");
	domElements["statusLogIn"]= document.getElementById("statusLogIn");
	domElements["inputLogInName"]= document.getElementById("inputLogInName");
	domElements["inputLogInPassword"] = document.getElementById("inputLogInPassword");
	domElements["btnLogIn"]= document.getElementById("btnLogIn");
	
	domElements["sectionUserRegister"]= document.getElementById("sectionUserRegister");
	domElements["statusRegister"]= document.getElementById("statusRegister");
	domElements["inputRegisterName"] = document.getElementById("inputRegisterName");
	domElements["inputRegisterPassword"] = document.getElementById("inputRegisterPassword");
	domElements["inputRegisterConfirmPassword"] = document.getElementById("inputRegisterConfirmPassword");
	domElements["btnRegister"] = document.getElementById("btnRegister");
	
	
	domElements["sectionUserLogedIn"]= document.getElementById("sectionUserLogedIn");
	domElements["labelUserLogedIn"]= document.getElementById("labelUserLogedIn");
	domElements["btnLogOut"]= document.getElementById("btnLogOut");
	domElements["btnGoHome"]= document.getElementById("btnGoHome");
	
	console.log('domElements=',domElements);
	console.groupEnd();
}
function addEvents(){
	console.groupCollapsed('addEvents');
	domElements["btnNewAccount"].addEventListener("click",function(event){
		console.groupCollapsed('btnNewAccount:keyup');
		domElements["sectionUserLogIn"].classList.add("auth-display-none");
		domElements["sectionUserRegister"].classList.remove("auth-display-none");
		console.groupEnd();
	});
	domElements["btnGo2LogIn"].addEventListener("click",function(event){
		console.groupCollapsed('btnGo2LogIn:keyup');
		domElements["sectionUserRegister"].classList.add("auth-display-none");
		domElements["sectionUserLogIn"].classList.remove("auth-display-none");
		console.groupEnd();
	});
	domElements["inputLogInName"].addEventListener("keyup",function(event){
		console.groupCollapsed('inputLogInName:keyup');
		inputCheck({dom:event.target,type:'name'});
		console.groupEnd();
	});
	domElements["inputLogInPassword"].addEventListener("keyup",function(event){
		console.groupCollapsed('inputLogInPassword:keyup');
		inputCheck({dom:event.target,type:'password'});
		console.groupEnd();
	});
	domElements["inputRegisterName"].addEventListener("keyup",function(event){
		console.groupCollapsed('inputRegisterName:keyup');
		inputCheck({dom:event.target,type:'name'});
		console.groupEnd();
	});
	domElements["inputRegisterPassword"].addEventListener("keyup",function(event){
		console.groupCollapsed('inputRegisterPassword:keyup');
		inputCheck({dom:event.target,type:'password'});
		console.groupEnd();
	});
	domElements["inputRegisterConfirmPassword"].addEventListener("keyup",function(event){
		console.groupCollapsed('inputRegisteronfirmPassword:keyup');
		inputCheck({dom:event.target,type:'password'});
		console.groupEnd();
	});
	domElements["btnLogOut"].addEventListener("click",function(event){
		event.preventDefault();
		console.groupCollapsed('btnLogOut:click');
		AuthRegister.userLogOut()
		.then(
			function(resolve){
				console.log('AuthRegister.userLogOut response:resolver=',resolve);	
				displayDomElement();
			}
		).catch(
			function(reject){
				console.log('AuthRegister.userLogOut response:reject=',reject);	
				if(reject.response&&reject.response.responseJSON&&reject.response.responseJSON.message){
					alert(reject.response.responseJSON.message);	
				}else{
					alert(reject.message);	
				}
			}
		);
		console.groupEnd();
	});
	domElements["btnGoHome"].addEventListener("click",function(event){
		event.preventDefault();
		console.groupCollapsed('btnGoHome:click');
		window.location = "home.html";		
		console.groupEnd();
	});
	domElements["btnLogIn"].addEventListener("click",function(event){
		event.preventDefault();
		console.groupCollapsed('btnLogIn:click');
		let errorLog=[];
		let inputLogInName=domElements["inputLogInName"];
		let inputLogInPassword=domElements["inputLogInPassword"];
		if(typeof inputLogInName === 'undefined' || typeof inputLogInPassword === 'undefined' ){
			console.warn('a field is not defined');
			errorLog.push('a field is not defined');
		}
		if(inputLogInName === '' || inputLogInPassword === ''){
			console.warn('a field is empyte');
			errorLog.push('a field is empyte');
		}
		if(inputLogInName.value.length<settings.nameLength_min){
			console.warn('name to small');
			errorLog.push('name to small');
		}
		if(inputLogInName.value.length>settings.nameLength_max){
			console.warn('name to big');
			errorLog.push('name to big');
		}
		if(inputLogInPassword.value.length<settings.passwordLength_min){
			console.warn('password to small');
			errorLog.push('password to small');
		}
		if(inputLogInPassword.value.length>settings.passwordLength_max){
			console.warn('password to big');
			errorLog.push('password to big');
		}
		if(errorLog.length>0){
			console.warn('has error, will not commence registration');
			console.warn('errorLog=',errorLog);
			//alert('LogIn aborted do to conditions: '+errorLog.toString());
			displayLabelStatus({domName:"statusLogIn",message:"LogIn aborted do to conditions: "+errorLog.toString()});
			
		}else{
			AuthRegister.userLogIn({username:inputLogInName.value,password:inputLogInPassword.value})
			.then(
				function(resolve){
					console.log('AuthRegister.userLogIn response:resolver=',resolve);
					//displayDomElement();	
					window.location = "home.html";					
				}
			).catch(
				function(reject){
					console.log('AuthRegister.userLogIn response:reject=',reject);
					if(reject.response&&reject.response.responseJSON&&reject.response.responseJSON.message){
						//alert(reject.response.responseJSON.message);	
						displayLabelStatus({domName:"statusLogIn",message:reject.response.responseJSON.message});
					}else{
						//alert(reject.message);	
						displayLabelStatus({domName:"statusLogIn",message:reject.message});
					}
								
				}
			);
		}
		console.groupEnd();
	});
	domElements["btnRegister"].addEventListener("click",function(event){
		event.preventDefault();
		console.groupCollapsed('btnRegister:click');
		let errorLog=[];
		let inputRegisterName=domElements["inputRegisterName"];
		let inputRegisterPassword=domElements["inputRegisterPassword"];
		let inputRegisterConfirmPassword=domElements["inputRegisterConfirmPassword"];
		if(typeof inputRegisterName === 'undefined' || typeof inputRegisterPassword === 'undefined' || typeof inputRegisterConfirmPassword === 'undefined'){
			console.warn('a field is not defined');
			errorLog.push('a field is not defined');
		}
		if(inputRegisterName === '' || inputRegisterPassword === '' ||inputRegisterConfirmPassword === ''){
			console.warn('a field is empyte');
			errorLog.push('a field is empyte');
		}
		if(inputRegisterName.value.length<settings.nameLength_min){
			console.warn('name to small');
			errorLog.push('name to small');
		}
		if(inputRegisterName.value.length>settings.nameLength_max){
			console.warn('name to big');
			errorLog.push('name to big');
		}
		if(inputRegisterPassword.value.length<settings.passwordLength_min){
			console.warn('password to small');
			errorLog.push('password to small');
		}
		if(inputRegisterPassword.value.length>settings.passwordLength_max){
			console.warn('password to big');
			errorLog.push('password to big');
		}
		if(inputRegisterPassword.value!=inputRegisterConfirmPassword.value){
			console.warn('password dont match');
			errorLog.push('password dont match');
		}
		if(errorLog.length>0){
			console.warn('has error, will not commence registration');
			console.warn('errorLog=',errorLog);
			//alert('Register aborted do to conditions: '+errorLog.toString());
			displayLabelStatus({domName:"statusRegister",message:"Register aborted do to conditions: "+errorLog.toString()});
			
		}else{
			AuthRegister.userRegister({username:inputRegisterName.value,password:inputRegisterPassword.value,confirmPassword:inputRegisterConfirmPassword.value})
			.then(
				function(resolve){
					console.log('AuthRegister.userRegister response:resolver=',resolve);
					//displayDomElement();
					window.location = "home.html";					
				}
			).catch(
				function(reject){
					console.log('AuthRegister.userRegister response:reject=',reject);	
					if(reject.response&&reject.response.responseJSON&&reject.response.responseJSON.message){
						//alert(reject.response.responseJSON.message);	
						displayLabelStatus({domName:"statusRegister",message:reject.response.responseJSON.message});
					}else{
						//alert(reject.message);
						displayLabelStatus({domName:"statusRegister",message:reject.message});						
					}
				}
			);
		}
		
		console.groupEnd();
	});
	console.groupEnd();
}
function displayDomElement(){
	console.groupCollapsed('displayDomElement');
	if(AuthRegister.getAccessToken()){
		console.log('loged in');
		domElements["authLoginOrRegister"].classList.add("auth-display-none");
		domElements["sectionUserLogedIn"].classList.remove("auth-display-none");
		domElements["labelUserLogedIn"].innerText=AuthRegister.getAccessName();
		
	}else{
		console.log('not loged in');
		domElements["sectionUserLogedIn"].classList.add("auth-display-none");
		domElements["authLoginOrRegister"].classList.remove("auth-display-none");
		domElements["labelUserLogedIn"].innerText="";
	}
	console.groupEnd();
}
function displayLabelStatus(options={}){
	console.groupCollapsed('displayLabelStatus');
	console.log('options:',options);
	if(!options.domName){
		console.groupEnd();
		return;
	}
	if(options.message){
		domElements[options.domName].innerText=options.message;
	}
	if(options.messageclear){
		domElements[options.domName].innerText="";
	}
	domElements[options.domName].classList.add("auth-color_red");
	
	console.groupEnd();
}
function inputCheck(options={}){
	console.groupCollapsed('inputCheck');
	console.log('options:',options);
	let colorClass="auth-border-color-red";
	if(!options.dom){
		console.groupEnd();
		return;
	}
	if(options.type){
		if(options.type==='name'){
			if(options.dom.value.length<settings.nameLength_min){
				console.warn('name to small');
				options.dom.classList.add(colorClass);
			}else
			if(options.dom.value.length>settings.nameLength_max){
				console.warn('name to big');
				options.dom.classList.add(colorClass);
			}else{
				options.dom.classList.remove(colorClass);
			}
		}else
		if(options.type==='password'){
			if(options.dom.value.length<settings.passwordLength_min){
				console.warn('password to small');
				options.dom.classList.add(colorClass);
			}else
			if(options.dom.value.length>settings.passwordLength_max){
				console.warn('password to big');
				options.dom.classList.add(colorClass);
			}else{
				options.dom.classList.remove(colorClass);
			}
		}
	}
	console.groupEnd();
}
function init() {
	console.groupCollapsed('init');
	adddomElements();
	addEvents();
	displayDomElement();
	console.groupEnd();
}
init();