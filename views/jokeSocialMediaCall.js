//the idea is based on what modules are
//the idea is of: maintainability, namespacing and reusability to some degree

let jokeSocialMediaCall={
	init:function(options={root:"body",add2Root:true}) {
		console.groupCollapsed('init');
		this.initDone=true;
		this.modal="";
		this.root={id:'',dom:'',jquery:''};
		this.buttonsList;
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$(this.root.id); 
			}
			if(options.add2Root){
				this.add2Root(options.add2Root);
				if(options.addEvents){
					this.addEvents();
				}
			}
		}
		
		console.groupEnd();
	},
	add2Root:function(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('add2Root');
		if(!this.initDone)this.init();
		if(!(typeof options === 'object')){options={}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.querySelector(this.root.id);
				this.root.jquery=$(this.root.id); 
			}
		}
		//console.log('root=',this.root);
		this.modal= new Modal({root:this.root.id});
		if(!options.addSkip){
			this.modal.add2Root(options.modal);
		}
		console.groupEnd();
	},
	addEvents:function(){
		console.groupCollapsed('addEvents');
		if(!this.initDone)this.init();
		//console.groupCollapsed('4Buttons');
		this.buttonsList=document.querySelectorAll('.jokesocialmediacall');
		let me=this;
		this.buttonsList.forEach(function(element,i){
			element.addEventListener("click", function(event){
				event.preventDefault();
				me.modal.setElement([{selector:".modal-title", task:"inner", value:"Opps."},{selector:".modal-body", task:"inner", value:"Would open the page if there was any to open. :3"}]);
				me.showModal();
			});
		});
		//console.groupEnd();
		console.groupEnd();
	},
	showModal:function(){
		if(!this.initDone)this.init();
		this.modal.show();
	},
	hideModal:function(){
		if(!this.initDone)this.init();
		this.modal.hide();
	}

}