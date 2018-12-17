function Movies() {
  this.items = [];
  this.pagination = {};
}
var moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";
Movies.prototype.getAll = function(options="0") {
  var me = this;
  return $.get(moviesRootUrl + "movies?take=10&skip=" + options).then(function(response) {
  me.pagination=response.pagination;
  response=response.results;
  for (var i = 0; i < response.length; i++) {
    var movie = new Movie(response[i]);
    me.items.push(movie);
  };
  console.log("me.items=", me.items);

});
};
