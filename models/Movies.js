function Movies() {
  this.items = [];
  this.pagination = {};
}
// const moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";
Movies.prototype.getAll = function(skip="0") {
  var me = this;
  return $.get(moviesRootUrl + "movies?take=10&skip=" + skip).then(function(response) {
    me.items=[];
    me.pagination=response.pagination;
    response=response.results;
    for (var i = 0; i < response.length; i++) {
      var movie = new Movie(response[i]);
      me.items.push(movie);
    };
    console.log("me.items=", me.items);

  });
};

/////////////////////////////////// Search
Movies.prototype.searchAllMovies = function(take='0', skip='0',searchName='',searchValue='') {
  var me = this;
  var urlSearchMoviesPaginated;
  if (!searchName || !searchValue) {
    urlSearchMoviesPaginated = moviesRootUrl + `movies?take=${take}&skip=${skip}`;
  } else {
    urlSearchMoviesPaginated = moviesRootUrl + `movies?${searchName}=${searchValue}&take=${take}&skip=${skip}`;
  }
  return $.get(urlSearchMoviesPaginated).then(function(searchResponse) {
    console.log('searchResponse: ', searchResponse);
    me.items = [];
    for (var i = 0; i < searchResponse.results.length; i++) {
        var movie = new Movie(searchResponse.results[i]);
        me.items.push(movie);
    }
    me.numberOfPages = searchResponse.pagination.numberOfPages;
    me.currentPage = searchResponse.pagination.currentPage;
},
    function (error) {
        console.log(
            'GET movies request error status: ',
            error.status
        );
    })
};

//////////////////////////////////////////////////////////////////////