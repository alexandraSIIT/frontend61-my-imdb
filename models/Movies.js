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
Movies.prototype.searchAllMovies = function(take='0', skip='0',searchName='',searchValue='') { //by Alex
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
Movies.prototype.getAllwSearch = function(defaultParams={skip:0,take:10}, serachParams={}) { //by Tamas
	console.log("getAllwSearch.defaultParams=",defaultParams);
	console.log("getAllwSearch.serachParams=",serachParams);
	var me = this; var address=moviesRootUrl + "movies?take="+(defaultParams.take||10)+"&skip=" + (defaultParams.skip||0)
	console.log("getAllwSearch.saddress=",address);
	for (var key in serachParams){ 
		let arrayOfKeysApproved=["Title","Year","Runtime","Genre","Language","Country","Poster","imdbRating","imdbVotes","imdbID","Type"];
		if(arrayOfKeysApproved.indexOf(key) > -1){
			address+="&"+key+"="+serachParams[key];
		}
	}
	console.log("address=",address);
	return $.get(address)
	.done(function(response) {
		console.log("found=",response);
		if(response.results.length>0){
			me.items=[];
			me.pagination=response.pagination;
			response=response.results;
			for (var i = 0; i < response.length; i++) {
				var movie = new Movie(response[i]);
				me.items.push(movie);
			};  
		}
		return response;
	})
	.fail(function(response) {
		console.log("notfound=",response);
		return response;
	});
};