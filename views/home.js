var submitBtn = document.getElementById("edit-button");
var id = "5baa62368b5f4c002194c7dc";

submitBtn.addEventListener("click", function(){
    var movie = new Movie({
        _id: id,

    });
    movie.editMovie().then(function(response) {
        console.log(response);
        console.log("Movie with id " + id + " was succesfully updated");
    }
)}
);