const express = require('express'),
      bodyParser = require('body-parser'),
      app = new express(),
      path = require('path'),   
      port = process.env.PORT || 8080,
      moviesModule = require('./OrderedMovies.js').OrderedMoviesModule;

app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

var mm = new moviesModule();

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/api.html'));
});


app.get('/getAllOrderedMovies', function(req,res){
    mm.getAllOrderedMovies(req, res);    
});

app.post('/getOrederedMovie', function(req,res){
    var movieName = req.body.movieName;
    mm.getOrderedMovieByName(req, res, movieName);
});

app.get('/getOrderedMoviesByDateAndName/:date/:movieName', function(req,res){
    var date = req.params.date;
    var movieName = req.params.movieName;

    mm.getOrderedMoviesByDateAndName(req, res, date, movieName);
});

app.all('*', 
    (req, res, next) => {
        res.json("Somthing went wrong");
    });

app.listen(port, () => console.log(`listening on port ${port}`));