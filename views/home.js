
// window.onload = function() {
//   var movie = new Movie();
//   movie.regenerateMovies().then(function(response) {
//     console.log("Complet regeneration", response);
//   });
// };

var movies = new Movies();
let modalElements={};let alertElements={};let backgroundSync;extraLoad();//added by Tamas
function extraLoad(){ //added by Tamas
  //here it loads the blank modal & alert notification, but also the components for authentication, image uploading and background sysnc
  console.groupCollapsed('extraLoad');
  console.log('notification');
  modalElements["notification"]= new Modal({root:"modalRoot",add2Root:true});
  alertElements["notification"]= new Alert({root:"alertRoot",add2Root:true});
  jokeSocialMediaCall.init({root:"modalRoot",add2Root:true,addEvents:true});
  notificationPopUp.init();
  console.log('auth');
  authModal.init({root:"modalRoot",add2Root:true,add2Head:true,addEvents:true});
  authAlert=new Alert({root:"alertRoot",add2Root:true});
  auth2Pages.init();

  console.log('backgroundSyncLoad');
  if(Worker){
    if(location.protocol==="file:"||location.protocol==="file"){
      console.warn('cannot do worker do to invalid protocol');
      console.groupEnd();
      return;
    }
    backgroundSync = new Worker('../workers/backgroundSync.js');
    console.log('backgroundSync loaded');
  }else{
    console.warn('backgroundSync not loaded');
  }
  
  console.log('imageUploaderLoad');
  imageFileUploader.init();
  console.groupEnd();
}

getMovies();
function getMovies(skip) {
  movies.getAll(skip).then(function() {
    console.log("getAllList", movies.items);
  if(Worker&&backgroundSync){ //added by Tamas
    console.log("sending data to backgroundSync");
    backgroundSync.postMessage({mode:1,movies:{skip:skip}});
  }
    displayMovies(movies.items);
    displayPagination(movies.pagination);
    searchYear();
    searchGenre();
  });
}

function displayMovies(response) {
  console.log("displayMovies");
  var template = document.getElementById("template");
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
    moviesClone.style.display="initial";
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
    backgroundSync.postMessage({mode:1,movies:{items:movies.items,pagination:movies.pagination},timer:{command:'start'}});
  }

};

function displayPagination(response) {
  //console.log("response pagination", response)
  var templatePages = document.getElementsByClassName("pagination-template");
  var pagesContainer = document.getElementById("pagination");
  pagesContainer.innerHTML = "";
  for ( let i=1; i<= response.numberOfPages; i++) {
    var pagesClone = templatePages.cloneNode(true);
    pagesClone.removeAttribute("style");
    pagesClone.removeAttribute("id");
    var pageButtonElement = pagesClone.querySelector(".pages-btn");
    pageButtonElement.innerHTML = i;
    pagesContainer.appendChild(pagesClone);
    pageButtonElement.addEventListener("click",function moveToPage(event){
      return getMovies((i-1)*10 +1);
    });
  }
}

// ALEXXXXXXX Search
var inputText = document.querySelector("[name=search]");
var searchSelected = document.querySelector(".search-select");
var searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener("click", searchMovie);

function searchMovie() {
  // var searchSelectedValue = searchSelected.value;
  var inputTextValue = inputText.value;
  console.log("SEARCH BUTTON");
  if (inputTextValue) {
    removeTemplateMovies();
    movies.getAll(10, 0, inputTextValue).then(function () {
      displayMovies(movies.items);
    });
  } else {
    removeTemplateMovies();
    movies.getAll(10, 0).then(function () {
      displayMovies(movies.items);
    });
  }}

  function removeTemplateMovies() {
    var movieDiv = document.getElementsByClassName('new-movie');
    while (movieDiv[0]) {
      movieDiv[0].parentNode.removeChild(movieDiv[0]);
    }
  }
///////////////////////////////////// Search Year

function searchYear() {
  var yearDiv = document.getElementById('searchDivYear');
  var buttonYearMin = document.createElement('button');
  var buttonYearMed = document.createElement('button');
  var buttonYearMax = document.createElement('button');
  var textButtonYearMin = document.createTextNode("Year < 2000");
  var textButtonYearMed = document.createTextNode("2000 - 2010");
  var textButtonYearMax = document.createTextNode("2010 < Year");
  buttonYearMin.appendChild(textButtonYearMin);
  buttonYearMin.addEventListener('click', function(){
    console.log("Year MIN clicked");
  })
  buttonYearMed.appendChild(textButtonYearMed);
  buttonYearMed.addEventListener('click', function(){
    console.log("Year MED clicked");
  })
  buttonYearMax.appendChild(textButtonYearMax);
  buttonYearMax.addEventListener('click', function(){
    console.log("Year MAX clicked");
  })
  yearDiv.appendChild(buttonYearMin);
  yearDiv.appendChild(buttonYearMed);
  yearDiv.appendChild(buttonYearMax);
  
}
///////////////////////////////////// Search Genre

function searchGenre() {
  var responseMovies = movies.items;
  var moviesGenre = []; // String Genre Array
  console.log("SEARCHHHHHHHHHH ", movies.items);
  
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
  
  for (let i=0; i<genreArr.length; i++) { 
    var singleGenre = genreArr[i]; //
    function addButtonGenre(singleGenre) {
    var genreDiv = document.getElementById('searchDivGenre'); // div pentru butoane
    var genreButton = document.createElement('button'); // creare buton
    var textButton = document.createTextNode(singleGenre); // nume buton (gen)
    genreButton.appendChild(textButton);
    genreDiv.appendChild(genreButton);
  
    genreButton.addEventListener("click", function() { // functie buton
        console.log("Genre button", singleGenre);
    });
  }
  
  addButtonGenre(singleGenre);
  }


}
//////////////////////ALEXXXXXXXXXXXX

function editMovie(movie){
   let myElement = document.querySelectorAll(".popup");
   for (let i = 0; i < myElement.length; i++){
     myElement[i].remove();
    
   }
   let grandpa = document.getElementById("movie_" + movie._id);
   let grandpaId = grandpa.id;
   let movieId = grandpaId.replace("movie_", "");

   movie.getMovie().then(function(response) {

        console.log(response);
        let divPopup = document.createElement("div");
        divPopup.setAttribute("class", "popup");
        divPopup.style.top = (document.body.scrollTop + document.documentElement.scrollTop + 35)+"px"
        grandpa.appendChild(divPopup);

        let spanPopup = document.createElement("span");
        spanPopup.setAttribute("class", "content");
    spanPopup.setAttribute("style", "color:black");//added by Tamas to fix the text color thats being inherited from bootstrap css
        divPopup.appendChild(spanPopup);

        let popupXButton = document.createElement("div");
        popupXButton.setAttribute("class", "closeButton");
        popupXButton.innerHTML = "X";
        divPopup.appendChild(popupXButton);

        popupXButton.addEventListener("click", function(){
          let eventButton = grandpa.querySelector('.movie-edit');
           console.log("Event button", eventButton);
           eventButton.disabled = false;
           divPopup.remove();

        });
        //title edit
        let titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", response.Title);
        titleLabel.innerHTML = "<br>Title of the movie<br>";
        spanPopup.appendChild(titleLabel);

        let newTitle = document.createElement("input");
        newTitle.setAttribute("value", response.Title);
        newTitle.setAttribute("class", "new-title");
        newTitle.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newTitle);

        //year edit
        let yearLabel = document.createElement("label");
        yearLabel.setAttribute("for", response.Year);
        yearLabel.innerHTML = "<br>Year<br>";
        spanPopup.appendChild(yearLabel);

        let newYear = document.createElement("input");
        newYear.setAttribute("value", response.Year);
        newYear.setAttribute("class", "new-year");
        newYear.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newYear);

        //runtime edit
        let runtimeLabel = document.createElement("label");
        runtimeLabel.setAttribute("for", response.Runtime);
        runtimeLabel.innerHTML = "<br>Runtime<br>";
        spanPopup.appendChild(runtimeLabel);

        let newRuntime = document.createElement("input");
        newRuntime.setAttribute("value", response.Runtime);
        newRuntime.setAttribute("class", "new-runtime");
        newRuntime.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newRuntime);

        //Genre edit
        let genreLabel = document.createElement("label");
        genreLabel.setAttribute("for", response.Genre);
        genreLabel.innerHTML = "<br>Genre<br>";
        spanPopup.appendChild(genreLabel);

        let newGenre = document.createElement("input");
        newGenre.setAttribute("value", response.Genre);
        newGenre.setAttribute("class", "new-genre");
        newGenre.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newGenre);

        //Director edit
        let directorLabel = document.createElement("label");
        directorLabel.setAttribute("for", response.Director);
        directorLabel.innerHTML = "<br>Director<br>";
        spanPopup.appendChild(directorLabel);

        let newDirector = document.createElement("input");
        newDirector.setAttribute("value", response.Director);
        newDirector.setAttribute("class", "new-director");
        newDirector.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newDirector);

        //Writer edit
        let writerLabel = document.createElement("label");
        writerLabel.setAttribute("for", response.Writer);
        writerLabel.innerHTML = "<br>Writer<br>";
        spanPopup.appendChild(writerLabel);

        let newWriter = document.createElement("input");
        newWriter.setAttribute("value", response.Writer);
        newWriter.setAttribute("class", "new-writer");
        newWriter.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newWriter);

        //Actors edit
        let actorsLabel = document.createElement("label");
        actorsLabel.setAttribute("for", response.Actors);
        actorsLabel.innerHTML = "<br>Actors<br>";
        spanPopup.appendChild(actorsLabel);

        let newActors = document.createElement("input");
        newActors.setAttribute("value", response.Actors);
        newActors.setAttribute("class", "new-actors");
        newActors.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newActors);

        //Plot edit
        let plotLabel = document.createElement("label");
        plotLabel.setAttribute("for", response.Plot);
        plotLabel.innerHTML = "<br>Plot<br>";
        spanPopup.appendChild(plotLabel);

        let newPlot = document.createElement("textarea");
        newPlot.value = response.Plot;
        newPlot.setAttribute("class", "new-plot");
        newPlot.setAttribute("style", "width: 90%; height: auto");
        spanPopup.appendChild(newPlot);

        //Language edit
        let languageLabel = document.createElement("label");
        languageLabel.setAttribute("for", response.Language);
        languageLabel.innerHTML = "<br>Language<br>";
        spanPopup.appendChild(languageLabel);

        let newLanguage = document.createElement("input");
        newLanguage.setAttribute("value", response.Language);
        newLanguage.setAttribute("class", "new-language");
        newLanguage.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newLanguage);

        //Country edit
        let countryLabel = document.createElement("label");
        countryLabel.setAttribute("for", response.Country);
        countryLabel.innerHTML = "<br>Country<br>";
        spanPopup.appendChild(countryLabel);

        let newCountry = document.createElement("input");
        newCountry.setAttribute("value", response.Country);
        newCountry.setAttribute("class", "new-country");
        newCountry.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newCountry);

        //Poster edit
        let posterLabel = document.createElement("label");
        posterLabel.setAttribute("for", response.Poster);
        posterLabel.innerHTML = "<br>Poster<br>";
        spanPopup.appendChild(posterLabel);

        let newPoster = document.createElement("input");
        newPoster.setAttribute("value", response.Poster);
        newPoster.setAttribute("class", "new-poster");
        newPoster.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newPoster);

    /*let posterUpload = document.createElement("input");//added by Tamas to allow uploading images
    posterUpload.setAttribute("type", "file");
    posterUpload.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
        spanPopup.appendChild(posterUpload);
    posterUpload.addEventListener("change", function(){
      console.groupCollapsed('ileInput');
      imageFileUploader.fileUppload({event:event,element:this});
      console.groupEnd();
    });*/

        //imdbRating edit
        let imdbLabel = document.createElement("label");
        imdbLabel.setAttribute("for", response.imdbRating);
        imdbLabel.innerHTML = "<br>IMDB Rating<br>";
        spanPopup.appendChild(imdbLabel);

        let newImdbRating = document.createElement("input");
        newImdbRating.setAttribute("value", response.imdbRating);
        newImdbRating.setAttribute("class", "new-imdb");
        newImdbRating.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newImdbRating);

        let submitBtn = document.createElement("button");
        submitBtn.setAttribute("class", "submit-updates");
        submitBtn.innerHTML = "Submit";
        spanPopup.appendChild(submitBtn);

        submitBtn.addEventListener("click", function() {
          if (
            newTitle.value === "" ||
            yearLabel.value === "" ||
            newRuntime.value === "" ||
            newGenre.value === "" ||
            newDirector.value === "" ||
            newWriter.value === "" ||
            newActors.value === "" ||
            newPlot.value === "" ||
            newLanguage.value === "" ||
            newCountry.value === "" ||
            newPoster.value === "" ||
            newImdbRating.value === ""
          ) {
            alert("Please fill up all fields");
          } else {

              movie._id = movieId;
              movie.Title = newTitle.value;
              movie.Year = newYear.value;
              movie.Runtime = newRuntime.value;
              movie.Genre = newGenre.value;
              movie.Director = newDirector.value;
              movie.Writer = newWriter.value;
              movie.Actors = newActors.value;
              movie.Plot = newPlot.value;
              movie.Language = newLanguage.value;
              movie.Country = newCountry.value;
              movie.Poster = newPoster.value;
              movie.imdbRating = newImdbRating.value;


            movie.editMovie().then(function(response) {
              console.log("Movie with id " + movieId + " was succesfully updated");
              divPopup.remove();

              displayMovies(movies.items);
            },
            function(reject){
              //  console.error("Error updating movie");
               let divDisplayError = document.createElement("div");
               divDisplayError.setAttribute("class", "display-error");
               divDisplayError.innerHTML = "Nothing to update";
               divPopup.appendChild(divDisplayError);

              
      

                
               

            });
          }
        });

      }


)
;
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
  //location.reload();  
  console.groupEnd();
}
function doAfterSuccessRegister(data={}){//added by Tamas, will run this function after successful register
  console.groupCollapsed('doAfterSuccessRegister');
  //location.reload();  
  console.groupEnd();
}
function doAfterSuccessLogOut(data={}){//added by Tamas, will run this function after successful log out
  console.groupCollapsed('doAfterSuccessLogOut'); 
  //location.reload();
  console.groupEnd();
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
    if(document.querySelector(".new-poster")){
      document.querySelector(".new-poster").value=obj.address;
    }
  }else{
    //we got the address of the image saved in data.response.address
    console.log('address=',data.response.address);
    notificationPopUp.post({body:"Image successfully uploaded",icon:data.response.address});
    document.querySelector(".new-poster").value=data.response.address;
  }
  
  console.groupEnd();
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
