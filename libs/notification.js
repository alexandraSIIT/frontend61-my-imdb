let notificationPopUp={
	init:function(options={}) {
		console.groupCollapsed('init');
		this.initDone=true;
		this.defaultNotificationData={icon:"../static/32396-popcorn-icon.png",body:"Hi",title:"Movie addicts",autoClose:true,timer:4000};
		this.permission="";
		this.called=0;
		this.list=[];
		console.groupEnd();
	},
	setDefault:function(options={}) {
		console.groupCollapsed('setDefault');
		if(!this.initDone)this.init();
		console.log("old=",this.defaultNotificationData);
		this.defaultNotificationData=options;
		console.log("new=",this.defaultNotificationData);
		console.groupEnd();
	},
	post:function(data={}) {
		console.groupCollapsed('post');
		if(!this.initDone)this.init();
		let me=this;
		function create(){
			var n = new Notification(data.title,options);
			me.list.push(n);
			if(data.autoClose){
				setTimeout(n.close.bind(n), data.timer);
			}
			n.onclick = function(event) {
				//event.preventDefault(); // prevent the browser from focusing the Notification's tab
				console.log('notification_click:',[n,event]);
			}
			n.onclose = function(event) {
				//event.preventDefault(); // prevent the browser from focusing the Notification's tab
				console.log('notification_close:',[n,event]);
			}
			n.onerror = function(event) {
				//event.preventDefault(); // prevent the browser from focusing the Notification's tab
				console.log('notification_error:',[n,event]);
				if(modalElements&&modalElements["notification"]){
					modalElements["notification"].addModal2Root();
					modalElements["notification"].setElement([{selector:".modal-title", task:"inner", value:"Error at notification"},{selector:".modal-body", task:"inner", value:event.error}, "show"]);
				}
			}
			n.onshow = function(event) {
				//event.preventDefault(); // prevent the browser from focusing the Notification's tab
				console.log('notification_show:',[n,event]);
			}
		}
		if (!("Notification" in window)) {
			console.warn("This browser does not support desktop notification");
			console.groupEnd();
			return;
		}
		this.called++;
		console.log('data=',data);
		//console.log('defaultNotificationData=',this.defaultNotificationData);
		for (var k in this.defaultNotificationData){
			if(!data[k]){data[k]=this.defaultNotificationData[k];}
		};
		let options={};
		for (var k in data){
			if(k.toLowerCase!="title"){options[k]=data[k];}
		};
		//console.log('data=',data);
		//console.log('options=',options);
		this.permission=Notification.permission;
		if (Notification.permission === "granted") {
			create();	
		}else if (Notification.permission !== "denied") {
			if(Notification.requestPermission){
				Notification.requestPermission().then(function (permission) {
					me.permission=permission;
					if (permission === "granted") {
						create();
					}
				});
			}
		}
		console.groupEnd();
	}
}
