function Movie(options = {}) {
  this._id = options._id;
  this.Title = options.Title;
  this.Year = options.Year;
  this.Runtime = options.Runtime;
  this.Genre = options.Genre;
  this.Director = options.Director;
  this.Writer = options.Writer;
  this.Actors = options.Actors;
  this.Plot = options.Plot;
  this.Language = options.Language;
  this.Country = options.Country;
  this.Poster = options.Poster;
  this.imdbRating = options.imdbRating;
}

const moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/movies/5baa62368b5f4c002194c7dd";
Movie.prototype.getMovieDetails = function() {
  var me = this;
  return $.get(moviesRootUrl).then(function(response) {
    console.log("Movie", response);
    me._id = response._id;
    me.Title = response.Title;
    me.Year = response.Year;
    me.Runtime = response.Runtime;
    me.Genre = response.Genre;
    me.Director = response.Director;
    me.Writer = response.Writer;
    me.Actors = response.Actors;
    me.Plot = response.Plot;
    me.Language = response.Language;
    me.Country = response.Country;
    me.Poster = response.Poster;
    me.imdbRating = response.imdbRating;
  });
};

// Movie.prototype.regenerateMovies = function() {
//   return $.ajax({
//     url: moviesRootUrl + "regenerate-movies",
//     method: "GET"
//   });
// };

