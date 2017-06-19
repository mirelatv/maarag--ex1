const express = require('express'),
      bodyParser = require('body-parser'),
      app = new express(),
      path = require('path'),   
      port = process.env.PORT || 8080,
      moviesModule = require('./OrderedMovies.js').OrderedMoviesModule;

app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

app.use(
  (req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
      "Access-Control-Allow-Methods",
      "GET, POST"
  );
    res.header(
      "Access-Control-Allow-Credentials", true
  );
  res.set("Content-Type", "application/json");
  next();
});

var mm = new moviesModule();

app.get('/', (req,res) => {
	res.set("Content-Type", "text/html");
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