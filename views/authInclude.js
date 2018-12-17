addUserAuth(); 
function addUserAuth(){ 
	console.groupCollapsed('addUserAuth');
	var domUserAuthElements={};
	var data={};
	var dataEncode={};
	function getCurrentPageAddressWithParameters(){
		console.groupCollapsed('getCurrentPageWithParameters');
		var path = window.location.pathname;
		var page = path.split("/").pop();
		console.log('page=',page );
		var search=location.search;
		console.log("search=", search);
		data.page=page;
		data.search=search;
		dataEncode.page=page;
		dataEncode.search=encodeURIComponent(search);
		console.log("data=", data);
		console.log("dataEncode=", dataEncode);
		console.groupEnd();	
	}
	//domUserAuthElements[""] = document.getElementById("");
	console.log('adding doms');
	domUserAuthElements["sectionUserAuth"] = document.getElementById("sectionUserAuth");
	domUserAuthElements["labelUserAuthStatus"] = document.getElementById("labelUserAuthStatus");
	domUserAuthElements["divUserAuthUsername"] = document.getElementById("divUserAuthUsername");
	domUserAuthElements["labelUserName"] = document.getElementById("labelUserName");
	domUserAuthElements["btnUserAuth"] = document.getElementById("btnUserAuth");
	console.log('domUserAuthElements=',domUserAuthElements);

	if(domUserAuthElements["btnUserAuth"]){
		console.log('add button event');
		getCurrentPageAddressWithParameters();
		domUserAuthElements["btnUserAuth"].addEventListener("click",function(event){
			event.preventDefault();
			console.groupCollapsed('btnUserAuth:click');
			if(Auth.getAccessToken()){
				console.log('loged in');
				Auth.userLogOut()
				.then(
					function(resolve){
						console.log('AuthRegister.userLogOut response:resolver=',resolve);	
						window.location = data.page+data.search;
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
			}else{
				console.log('not loged in');
				let wlocation="auth.html?page="+dataEncode.page+'&search='+dataEncode.search;
				console.log('location=',wlocation);
				window.location = wlocation;	
			}
			console.groupEnd();
		});
	}else{
		console.warn("button not found, can't add event");
	}
	
	console.log('display');
	if(Auth.getAccessToken()){
		console.log('loged in');
		for (var key in domUserAuthElements){
			if(domUserAuthElements[key]){
				console.log("domUserAuthElements["+key+"]->has something");
				if(key==="labelUserAuthStatus"){
					domUserAuthElements[key].innerText="User loged in";
				}
				if(key==="divUserAuthUsername"){
					domUserAuthElements[key].style.display="initial";
				}
				if(key==="labelUserName"){
					domUserAuthElements[key].innerText=Auth.getAccessName();
				}
				if(key==="btnUserAuth"){
					domUserAuthElements[key].innerText="Log out";
				}
				if(key==="sectionUserAuth"){
					domUserAuthElements[key].style.display="initial";
				}
			}else{
				console.warn("domUserAuthElements["+key+"]->has nothing");
			}
		}
	}else{
		console.log('not loged in');
		for (var key in domUserAuthElements){
			if(domUserAuthElements[key]){
				console.log("domUserAuthElements["+key+"]->has something");
				if(key==="labelUserAuthStatus"){
					domUserAuthElements[key].innerText="No user loged in";
				}
				if(key==="divUserAuthUsername"){
					domUserAuthElements[key].style.display="none";
				}
				if(key==="labelUserName"){
					domUserAuthElements[key].innerText="";
				}
				if(key==="btnUserAuth"){
					domUserAuthElements[key].innerText="Log in/Register";
				}
				if(key==="sectionUserAuth"){
					domUserAuthElements[key].style.display="initial";
				}
			}else{
				console.warn("domUserAuthElements["+key+"]->has nothing");
			}
		}
	}
	console.groupEnd();	
}