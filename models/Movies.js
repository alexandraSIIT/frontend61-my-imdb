function Movies() {
  this.items = [];
}
var moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";
Movies.prototype.getAll = function() {
  var me = this;
  return $.get(moviesRootUrl + "movies?take=10&skip=0").then(function(response) {
  response=response.results;
  for (var i = 0; i < response.length; i++) {
    var movie = new Movie(response[i]);
    me.items.push(movie);
  };
  console.log("me.items=", me.items);

});
};
