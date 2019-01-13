var movies = new Movies();
var movie2Edit;
modalMovieEditCreate();
modalMovieAdd();
let modalElements={};let alertElements={};let backgroundSync;extraLoad();//added by Tamas

function extraLoad(){ //added by Tamas
  //here it loads the blank modal & alert notification, but also the components for authentication, image uploading and background sysnc
  console.groupCollapsed('extraLoad');
  console.log('notification');
  modalElements["notification"]= new Modal({root:"#modalRoot",add2Root:true});
  alertElements["notification"]= new Alert({root:"#alertRoot",add2Root:true});
  jokeSocialMediaCall.init({root:"#modalRoot",add2Root:true,addEvents:true});
  notificationPopUp.init();
  console.log('auth');
  authModal.init({root:"#modalRoot",add2Root:true,add2Head:true,addEvents:true});
  authAlert=new Alert({root:"#alertRoot",add2Root:true});
  auth2Pages.init();

  console.log('backgroundSyncLoad');
  if(Worker){
    if(location.protocol==="file:"||location.protocol==="file"){
      console.warn('cannot do worker do to invalid protocol');
    }else{
    backgroundSync = new Worker('../workers/backgroundSync.js');
    console.log('backgroundSync loaded');
  }
  }else{
    console.warn('backgroundSync not loaded');
  }
  
  console.log('imageUploaderLoad');
  imageFileUploader.init();
  console.log('searchMovie');	
	search4Movie.init({root:"#searchRoot",setRoot:true,addEvents:true,addModal:true,addModalEvents:true});
	//search4Movie.toggleDropdown();
  console.groupEnd();
}

getMovies();
function getMovies(skip) {
	console.log("getMovies.skip=",skip);
	console.log("getMovies.searchParameters=",search4Movie.searchParameters);
  movies.getAllwSearch({skip:skip,take:10},search4Movie.searchParameters).then(function() {
    console.log("getAllList", movies.items);
    displayMovies(movies.items);
    displayPagination(movies.pagination);
	if(Worker&&backgroundSync){//added by Tamas
		console.log("sending data to backgroundSync");
		backgroundSync.postMessage({mode:1,movies:{skip:skip,searchparam:search4Movie.searchParameters}});
	}
  });
}

function displayMovies(response) {
  console.log("displayMovies");
  var template = document.getElementById("template");
  if(Auth.getAccessToken()){
    document.querySelector(".add-movie").removeAttribute("style");
    template.querySelector(".movie-edit").removeAttribute("style");
    template.querySelector(".movie-delete").removeAttribute("style");
  }else{
    document.querySelector(".add-movie").style.display="none";
    template.querySelector(".movie-edit").style.display="none";
    template.querySelector(".movie-delete").style.display="none";
  }
  var moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";
  // var regenerateMoviesContainer = document.getElementById("regenerate-movies");
  console.log("display movies response=", response);
  for (let i = 0; i < response.length; i++) {
    var moviesClone = template.cloneNode(true);
    // set a unique id for each movie
    moviesClone.id = "movie_" + response[i]._id;
    moviesClone.classList.add('new-movie');
    // populate the cloned template
    var movieTitleElement = moviesClone.querySelector(".movie-title");
    movieTitleElement.innerHTML = response[i].Title;

    var movieYearElement = moviesClone.querySelector(".movie-year");
    movieYearElement.innerHTML = response[i].Year;

    var movieRuntimeElement = moviesClone.querySelector(".movie-runtime");
    movieRuntimeElement.innerHTML = response[i].Runtime;

    var movieGenreElement = moviesClone.querySelector(".movie-genre");
    movieGenreElement.innerHTML = response[i].Genre;

    var moviePosterElement = moviesClone.querySelector(".movie-poster");
    moviePosterElement.src = response[i].Poster;

    var getMovieDetailsButton = moviesClone.querySelector(".movie-details");
    let id=response[i]._id;
    let me=response[i];
    getMovieDetailsButton.addEventListener(
      "click",
      function getMovieDetailsOnClick() {

        window.location = "movieDetails.html?_id=" + id;
      });
    moviesClone.style.display="inline-block";
    moviesContainer.appendChild(moviesClone);


    let editButton = moviesClone.querySelector(".movie-edit");
    editButton.addEventListener("click", function(){
        editMovie(me);
      
    });


    let deleteButton = moviesClone.querySelector(".movie-delete");
    deleteButton.addEventListener("click", function(){
      deleteMovieOnClick(me,i);
    });

    

  };

  if(Worker&&backgroundSync){//added by Tamas
    console.log("sending data to backgroundSync");
    backgroundSync.postMessage({movies:{items:movies.items,pagination:movies.pagination},timer:{command:'start'}});
  }

};

function displayPagination(response) { // corecte by Alex
  //console.log("response pagination", response)
  var templatePages = document.getElementById("pagination-template");
  var pagesContainer = document.getElementById("pagination");
  for ( let i=1; i<= response.numberOfPages; i++) {
    displayButtons(i);
    function displayButtons(i) {
    var pagesClone = templatePages.cloneNode(true);
    pagesClone.removeAttribute("style");
    pagesClone.removeAttribute("id");
    var pageButtonElement = pagesClone.querySelector(".pages-btn");
        pageButtonElement.innerHTML = i;
    // var numberPageButton = document.createTextNode(i);
    // pageButtonElement.appendChild(numberPageButton);
    // pagesClone.appendChild(pageButtonElement);
    pagesContainer.appendChild(pageButtonElement);
    pageButtonElement.addEventListener("click",function moveToPage(event){
      console.log("Button clicked: ", i);
      //return getMovies((i-1)*10 +1);
      pagesContainer.innerHTML = "";
    return getMovies((i-1)*10);
    });
  }
}
}
/*

// ALEXXXXXXX Search
////////// New
searchhhh();
function searchhhh() {
  movies.searchAllMovies(10, 0).then(function () {
    displayMovies(movies.items);
    console.log(" searchhhh", movies.items);
  });
}
//////////////////////
var inputText = document.querySelector("[name=search]");
var searchSelected = document.querySelector(".search-select");
var searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener("click", searchMovie);


  function searchMovie() {
    var searchByTitle = "Title";
    var searchInputValue = inputText.value;
    if (searchInputValue) {

      removeTemplateMovies();
      movies.searchAllMovies(10, 0, searchByTitle, searchInputValue).then(function () {
        console.log("searchMovie by Title: ", searchByTitle, searchInputValue, movies.items);
        displayMovies(movies.items);
        inputText.style.border = 'none';
      });
    } else {
      removeTemplateMovies();
      var body = document.body;
      var responseSearchParagraph = document.createElement('p');
      var responseSearchText = document.createTextNode(`There are no movies for "${searchInputValue}"`);
      responseSearchParagraph.appendChild(responseSearchText);
      body.appendChild(responseSearchParagraph);
    }
  }

  function removeTemplateMovies() {
    var movieDiv = document.getElementsByClassName('new-movie');
    while (movieDiv[0]) {
      movieDiv[0].parentNode.removeChild(movieDiv[0]);
    }
  }
///////////////////////////////////// Search Year

function searchYear() {
  var yearDiv = document.getElementById("searchDivYear");
  var yearArray = ["Year < 2000", "2000 - 2010", "2010 < Year"];
  var yearList = document.createElement("select");
  var optionYearDefault = document.createElement("option");
  optionYearDefault.value = "ALL";
  optionYearDefault.text = "ALL";
  yearList.appendChild(optionYearDefault);
  yearDiv.appendChild(yearList);
  
  for (let i = 0; i < yearArray.length; i++) {
    var singleYear = yearArray[i];
    var optionYear = document.createElement("option");
    optionYear.value = singleYear;
    optionYear.text = singleYear;
    yearList.appendChild(optionYear);

  }
  yearList.addEventListener('change', function() { 
    console.log("CHANGE?", this.value);
  }
);
  
=======


let addMovieBtn = document.querySelector(".add-movie");
addMovieBtn.addEventListener("click", function(){
   addNewMovie();
});


function searchGenre() {
  var responseMovies = movies.items;
  console.log("RRRRRRRRRRRRRRR", responseMovies);
  var moviesGenre = []; // String Genre Array
  
  for (let i=0; i<responseMovies.length; i++) {
    var responseMoviesGenre = responseMovies[i].Genre;
    getGenre();
    function getGenre(){
      var genreStringArray = responseMoviesGenre.split(", ");
      for(let i=0; i<genreStringArray.length;i++) {
        var genreString = genreStringArray[i];
        moviesGenre.push(genreString);
      }
    }
  }
  
  var genreObj = {};
  var genreArr = [];
  for (let i = 0; i < moviesGenre.length; i++) {
    if (!(moviesGenre[i] in genreObj)) {
      genreArr.push(moviesGenre[i]);
      genreObj[moviesGenre[i]] = true;
    }
  }
  
  var genreDiv = document.getElementById('searchDivGenre');
  var genreList = document.createElement('select');
  var genreListDefault = document.createElement("option");
  genreListDefault.value = "ALL";
  genreListDefault.text = "ALL";
  genreList.appendChild(genreListDefault);
  genreDiv.appendChild(genreList);

  for (let i=0; i<genreArr.length; i++) { 
    var singleGenre = genreArr[i]; //
    function addButtonGenre(singleGenre) { // div pentru butoane // creare buton
      var optionGenre = document.createElement("option");
      optionGenre.value = singleGenre;
      optionGenre.text = singleGenre;
      genreList.appendChild(optionGenre);
	  

  var languageDiv = document.getElementById('searchDivLanguage');
  var languageList = document.createElement('select');
  var languageListDefault = document.createElement("option");
  languageListDefault.value = "ALL";
  languageListDefault.text = "ALL";
  languageList.appendChild(languageListDefault);
  languageDiv.appendChild(languageList);
  
  for (let i=0; i<languageArr.length; i++) { 
    var singleLanguage = languageArr[i]; 
    function addButtonLanguage(singleLanguage) {



  });
}

*/
/////////////////////Dan
let addMovieBtn = document.querySelector(".add-movie");
addMovieBtn.addEventListener("click", function(){
   addNewMovie();
});
let movie2Add;
function addNewMovie(){
  modalMovieAdd();
  let movie = new Movie();
  movie2Add=movie;
  let container="";
   movie.getMovieDetails().then(function() {
    for (var key in movie){ //a for cycle that creates the titleLable,newLabel and so on elements
      if(key==="Title"||key==="Year"||key==="Runtime"||key==="Director"||key==="Writer"||key==="Plot"||key==="Language"||key==="Poster"||key==="imdbRating"){
      //console.log(movie[key]);
      container+=`<div class="md-form mb-5">  
      <label for="new${key}"><br>${key}<br></label>
      <input value="" type="text" id="new${key}" class="form-control validate">
    </div> `;
	if(key==="Poster"){//if added by Tamas to add file upload support to Poster
		container+=`<input class='fileInput' id='imageUpload' type="file" accept=".jpg, .jpeg, .png, .gif" style="padding-top:5px;" onchange="{imageFileUploader.fileUppload({event:event,element:this})}">`;
	}
 
      }
    }
    console.log("container=",container);
    $("#movie-Add").find(".modal-body").html(container);
    $("#movie-Add").modal("show");
	//insertlUploadImage(); //added by Tamas to add file upload support to Poster
    return;
        
												


  });

}


var movie2Edit;

function editMovie(movie){
 modalMovieEditCreate();					 
    movie2Edit=movie;
    console.log(movie);
    let container="";
	
    movie.getMovieDetails().then(function() {
    for (var key in movie){ //a for cycle that creates the titleLable,newLabel and so on elements
      if(key==="Title"||key==="Year"||key==="Runtime"||key==="Director"||key==="Writer"||key==="Plot"||key==="Language"||key==="Poster"||key==="imdbRating"){
      //console.log(movie[key]);
      container+=`<div class="md-form mb-5">  
      <label for="new${key}"><br>${key}<br></label>
      <input value="${movie[key]}" type="text" id="new${key}" class="form-control validate">
    </div> `;
	if(key==="Poster"){//if added by Tamas to add file upload support to Poster
		container+=`<input class='fileInput' id='imageUpload' type="file" accept=".jpg, .jpeg, .png, .gif" style="padding-top:5px;" onchange="{imageFileUploader.fileUppload({event:event,element:this})}">`;
	}
 
      }
    }
    console.log("container=",container);
    $("#movie-Edit").find(".modal-body").html(container);
    $("#movie-Edit").modal("show");
	//insertlUploadImage(); //added by Tamas to add file upload support to Poster
    return;
  });
}      

var myModal;
function simpleModal(name){
  myModal = `
	<div class="modal fade in" id="movie-${name}"  role="dialog" style="display:none">
	  <div class="modal-dialog" >
	  <form name="formMovieEdit" action="">
		<div class="modal-content">
		  <div class="modal-header text-center">
			<h4 class="modal-title w-100 font-weight-bold">${name} Movie</h4>
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
			  <span aria-hidden="true">×</span>
			</button>
		  </div>
		  <div class="modal-body mx-3">
		  </div>
		  <div class="modal-footer">
			<button type="button" class="btn btn-danger bt-close" data-dismiss="modal">Close</button>
			 <button type="button" class="btn btn-default bt-save" data-dismiss="modal">Save</button>
		  </div>
		 
		</div>
		</form>
	  </div>
  </div>`
  return;
}

function modalMovieAdd(){
	simpleModal("Add");
	document.querySelector("#movie-modal").innerHTML="";												 
	let movieAddModal=document.createElement("div");
	movieAddModal.innerHTML=myModal;
	document.querySelector("#movie-modal").appendChild(movieAddModal);
			
	movieAddModal.querySelector(".bt-save").addEventListener("click", function(){
	  let list=movieAddModal.querySelectorAll("input");
	  console.log("list=",list);
	  list.forEach(function(input){      
      console.log("value=",input.value);
      console.log("id=",input.id.replace("new",""));
      movie2Add[input.id.replace("new","")]=input.value;
	   
	  });
	  movie2Add.addMovie().then(function(response){
		    modalElements["notification"].setElement([{selector:".modal-title",task:"inner",value:"success"},{selector:".modal-body",task:"inner",value:"Movie successfully added "},"show"]);  
	    	getMovies();
	  },
	  function(error){
		console.log(error);
		
		modalElements["notification"].setElement([{selector:".modal-title",task:"inner",value:"fail"},{selector:".modal-body",task:"inner",value:error.responseJSON.message},"show"]);   
	  })
	});
}

function modalMovieEditCreate(){
	simpleModal("Edit");
	document.querySelector("#movie-modal").innerHTML="";
	var movieEditModal=document.createElement("div");
	movieEditModal.innerHTML=myModal;
	document.querySelector("#movie-modal").appendChild(movieEditModal);
	//movie2Edit
	movieEditModal.querySelector(".bt-save").addEventListener("click", function(){
	  console.log("movie2Edit_BEFORE=",movie2Edit);
	  var list=movieEditModal.querySelectorAll("input");
	  console.log("list=",list);
	  list.forEach(function(input){
		console.log("value=",input.value);
		console.log("id=",input.id.replace("new",""));
		movie2Edit[input.id.replace("new","")]=input.value;
	   
	  });
	  console.log("movie2Edit_AFTER=",movie2Edit);
	  movie2Edit.editMovie().then(function(response){
		console.log(response);
		
		modalElements["notification"].setElement([{selector:".modal-title",task:"inner",value:"success"},{selector:".modal-body",task:"inner",value:"Movie successfully edited "},"show"]);  
		displayMovies(movies.items); 
	  },
	  function(error){
		console.log(error);
		
		modalElements["notification"].setElement([{selector:".modal-title",task:"inner",value:"fail"},{selector:".modal-body",task:"inner",value:error.responseJSON.message},"show"]);   
	  })
	});
}


function insertlUploadImage(){//added by tamas 
	console.log('insertlUploadImage');
	$("#imageUpload").change(function(event){
			imageFileUploader.fileUppload({event:event,element:this});
		});
}
function doAfterSuccessImageUpload(data={}){//added by Tamas, will run this function after successful imate upload
  console.groupCollapsed('doAfterSuccessImageUpload');
  console.log('data=',data);
  
  //the data will contain information to the address of uploaded image
  //do to server side, the resposne might not be a json
  if(typeof data.response !="object"){
    //conver the result if not json
    var obj = JSON.parse(data.response);
    console.log('obj=',obj);
    console.log('address=',obj.address);
    //now we got the address of the image saved in obj.address
    notificationPopUp.post({body:"Image successfully uploaded",icon:obj.address});
		if($("#movie-Edit")||$("#movie-Edit").find("#newPoster")){
			$("#movie-Edit").find("#newPoster").val(obj.address);
		}
		if($("#movie-Add")||$("#movie-Add").find("#newPoster")){
			$("#movie-Add").find("#newPoster").val(obj.address);
		}
   
  }else{
    //we got the address of the image saved in data.response.address
    console.log('address=',data.response.address);
    notificationPopUp.post({body:"Image successfully uploaded",icon:data.response.address});
	if($("#movie-Edit")||$("#movie-Edit").find("#newPoster")){
		$("#movie-Edit").find("#newPoster").val(data.response.address);
	}
	if($("#movie-Add")||$("#movie-Add").find("#newPoster")){
		$("#movie-Add").find("#newPoster").val(data.response.address);
	}
  }
  
  console.groupEnd();
}



function getMovieById(event) {
  var theMovie = event.target.parentNode.parentNode;
  var theMovieId = theMovie.id;

  var movieId = theMovieId.replace("movie_", "");
  //call delete article model
  var movie = new Movie({ _id: movieId });
  return movie;
}


function deleteMovieOnClick(movie,positionInItems){
  
movie.deleteMovie().then(function(response){
 console.log("display", response);
 movies.items.splice(positionInItems, 1);
 displayMovies(movies.items);
});
}

function doAfterSuccessLogin(data={}){//added by Tamas, will run this function after successful log in
  console.groupCollapsed('doAfterSuccessLogin');
  displayEditButtons();
   // notificationPopUp.post({title:"Welcome "+Auth.getAccessName()+"!",body:"Welcome to Movie addicts, we are happy to see you here.\nWe have sent you an email verification to the email you provided us."});
  console.groupEnd();
}
function doAfterSuccessRegister(data={}){//added by Tamas, will run this function after successful register
  console.groupCollapsed('doAfterSuccessRegister');
  displayEditButtons();
  notificationPopUp.post({title:"Welcome "+Auth.getAccessName()+"!",body:"Welcome to Movie addicts, we are happy to see you here.\nWe have sent you an email verification to the email you provided us."});
  console.groupEnd();

}
function doAfterSuccessLogOut(data={}){//added by Tamas, will run this function after successful log out
  console.groupCollapsed('doAfterSuccessLogOut'); 
  hideEditButtons();
  console.groupEnd();
}
function displayEditButtons(){
  document.querySelector(".add-movie").removeAttribute("style");
  document.querySelectorAll(".movie-delete").forEach(function(buttons){buttons.removeAttribute("style")});
  document.querySelectorAll(".movie-edit").forEach(function(buttons){buttons.removeAttribute("style")});
}
function hideEditButtons(){
  console.log("hide");
  document.querySelector(".add-movie").style.display="none";;
  document.querySelectorAll(".movie-delete").forEach(function(buttons){buttons.style.display="none";});
  document.querySelectorAll(".movie-edit").forEach(function(buttons){buttons.style.display="none";});
}

if(Worker&&backgroundSync){ //added by Tamas, allows page to refresh its movies if it changed on the database
  //not tested it with search attributes
  console.log("receiving data to backgroundSync");
  backgroundSync.onmessage = function(event) {
    console.groupCollapsed('backgroundSync.onmessage');
    console.log("event:",event);
    console.log("data:",event.data);
    if(event.data.update){
      if(event.data.update.items){
        console.log("updated movies.items");
        if(event.data.update.items.length){
          movies.items=[];
          event.data.update.items.forEach(function(item,index){
            var movie = new Movie(item);
            movies.items.push(movie);
          });
        }
        
      }
      if(event.data.update.pagination){
        console.log("updated movies.pagination");
        movies.pagination=event.data.update.pagination;
      }
    }else
    if(event.data.display){
      console.log("do display");
      displayMovies(movies.items);
      displayPagination(movies.pagination);
      notificationPopUp.post({body:"Updated displayed movies."});
    }
  console.groupEnd();   
  }
}

