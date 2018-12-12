var movies = new Movies();
getMovies();
function getMovies() {
  movies.getAll().then(function() {
    console.log("getALLList", movies.items);
    displayMovies(movies.items);
  });
}
function displayMovies(response) {
  var template = document.getElementById("template");
  var moviesContainer = document.getElementById("movies");
console.log("display movies resonse=", response);
  for (var i = 0; i < response.length; i++) {
    var moviesClone = template.cloneNode(true);
    // set a unique id for each movie
    moviesClone.id = "movie_" + response[i]._id;
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

    moviesContainer.appendChild(moviesClone);
  };

};
