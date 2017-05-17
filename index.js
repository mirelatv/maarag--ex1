const express = require('express'),
      bodyParser = require('body-parser'),
      app = new express(),
      path = require('path'),   
      port = process.env.PORT || 8080,
	  // consts = require('./consts'),
	  // mongoose = require('mongoose'),
	  // Movie = require('./movie'),
	  // Promise = require("bluebird"),
      moviesModule = require('./OrderedMovies.js').OrderedMoviesModule;

// mongoose.connect(consts.MLAB_KEY);

// const conn = mongoose.connection;
// conn.on('error', (err) => {
//     console.log(`connection error: ${err}`);
// });

// conn.once('open',
//             () => {
//                 console.log('start2');
//                 var promise = Movie.find({}, 
//                     (err, movie) => {
//                         if(err) console.log(`query error: ${err}`);
//                     console.log(movie);
                
//                     mongoose.disconnect();
                
//                     });
//                 promise.then((data) => {
//                 	console.log(data);
//                 });

//                 console.log('connected');
//             });

app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

var mm = new moviesModule();

function errorMsg(msg){
  return {"ErrorMsg": msg};
}


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/api.html'));
});

app.get('/test', (req,res) => {
	mm.test(req, res);	
});


app.get('/getAllOrderedMovies', function(req,res){
    var movies = mm.getAllOrderedMovies();    
    res.json(movies);
});

app.post('/getOrederedMovie', function(req,res){
    var movieName = req.body.movieName;
    var foundMovie = mm.getOrderedMovieByName(movieName);

    if(foundMovie instanceof Error){
        res.json(errorMsg(foundMovie.message))
    }
    else{
        res.json(foundMovie);
    }
    
});

app.get('/getOrderedMoviesByIdsRange/:start_id/:end_id', function(req,res){
    var start = req.params.start_id;
    var end = req.params.end_id;

    var foundMovies = mm.getOrderedMoviesByIds(start, end);

    if ( foundMovies instanceof Error ) {
      var err = errorMsg(`Movies ids range ${start} - ${end} not found - ${foundMovies.message}`);
      res.json(err);
    }
    else{
      res.json(foundMovies);
    }
});

app.all('*', 
    (req, res, next) => {
        res.json(errorMsg(""));
    });

app.listen(port, () => console.log(`listening on port ${port}`));




