var movies = new Movies();
getMovies();
function getMovies() {
  movies.getAll().then(function() {
    console.log("getAllList", movies.items);
    displayMovies(movies.items);
  });
}
function displayMovies(response) {
  var template = document.getElementById("template");
  var moviesContainer = document.getElementById("movies");
  // var regenerateMoviesContainer = document.getElementById("regenerate-movies");
  console.log("display movies response=", response);
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

    var getMovieDetailsButton = moviesClone.querySelector(".movie-details");
    getMovieDetailsButton.addEventListener(
      "click",
      function getMovieDetailsOnClick() {
        var theMovie = event.target.parentNode.parentNode;
        var theMovieId = theMovie.id;
        var movieId = theMovieId.replace("movie_", "");

        window.location = "movieDetails.html?_id=" + movieId;
        // console.log("id", movieId)
      });

    moviesContainer.appendChild(moviesClone);
  };

  // var regenerateMoviesButton = regenerateMoviesContainer.querySelector(
  //   ".movie-regenerateMovies"
  // );
  // regenerateMoviesButton.addEventListener("click", function(event) {
  //   var movie = getMovieById(event);
  //   movie.regenerateMovies().then(function() {
  //     window.location.reload();
  //     console.log("refresh", response);
  //   });
  // });

  template.remove();

};


function getMovieById(event) {
  var theMovie = event.target.parentNode.parentNode;
  var theMovieId = theMovie.id;

  var movieId = theMovieId.replace("movie_", "");
  //call delete article model
  var movie = new Movie({ _id: movieId });
  return movie;
}
