class Movie {
    constructor(option = {}) {
        this._id = option._id;
        this.Title = option.Title;
        this.Year = option.Year;
        this.Runtime = option.Runtime;
        this.Genre = option.Genre;
        this.Director = option.Director;
        this.Writer = option.Writer;
        this.Actors = option.Actors;
        this.Plot = option.Plot;
        this.Language = option.Language;
        this.Country = option.Country;
        this.Poster = option.Poster;
        this.imdbRating = option.imdbRating;
        
    }
    editMovie() {
        return $
            .ajax({
                //Auth: "no auth needed",
                //Headers: {"x-auth-token" : "ZGFucG9wOmRhbnBvcA=="},
                method: "GET",
                url: rootUrl + "movies/" + this._id,
            });
    }
}

const rootUrl = "https://ancient-caverns-16784.herokuapp.com/";

