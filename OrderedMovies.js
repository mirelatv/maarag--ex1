const EventEmitter = require('events'),
        moment = require('moment'),
        db = require('./data/db.js').moviesDB;

//console.log(moviesList);


exports.OrderedMoviesModule = class OrderedMoviesModule extends EventEmitter {

    constructor() {
       super();
       //console.log(now);
       this.movies = db.movies;
       this.orderedDays = db.orderedDays;
    }

    getAllOrderedMovies(){
        this.printLog('getAllOrderedMovies');
        var results = [];
        for(var d in this.orderedDays){
            var day = this.orderedDays[d];

            var result = {};
            result.day = day.date;
            result.movies = [];

            for(var m in this.movies){
                for(var om in day.movies){
                    if(day.movies[om] == this.movies[m].id)
                        result.movies.push(this.movies[m]);
                }
            }

            results.push(result);
        }

        return results
    }

    getOrderedMovieByName(name){
        this.printLog('getOrderedMovieByName', name);
        return this.findOrderedMovieByName(name);
    }


    findOrderedMovieByName(name){
        var foundMovie = null;

        for(var i in this.movies){
            if(this.movies[i].name == name){
                foundMovie = this.movies[i];
                break;
            }
        }
        if(foundMovie == null)
            return new Error(`Movie name ${name} not found`);

        var result = {};
        for(var d in this.orderedDays){
            var orderedDay = this.orderedDays[d];
            var moviesForDay = orderedDay.movies;

            for(var om in moviesForDay){
                if(moviesForDay[om] == foundMovie.id)
                    result.date = orderedDay.date;
            }
        }

        result.movie = foundMovie;
        return result;
    }

    getOrderedMoviesByIds(start, end){
        this.printLog('getOrderedMoviesByIds', `start: ${start}, end: ${end}`);

        var lastId = this.movies[this.movies.length - 1].id;
        var firstId = this.movies[0].id;
        if(start > end){
            console.log('Invalid params');
            return new Error(`Invalid params (min id: ${firstId}, max id: ${lastId}), start id must be bigger then end id`);
        }
        if(start < firstId || start > lastId || end < firstId || end > lastId ){
            console.log('Invalid params');
            return new Error(`Invalid params (min id: ${firstId}, max id: ${lastId})`);
        }

        var foundsMovies = [];
        for(var i in this.movies){
            var movie = this.movies[i];
            if(movie.id >= start && movie.id <= end){
                foundsMovies.push(movie.name);
            }
        }

        if(foundsMovies.length == 0){
            return new Error(``);
        }

        var results = [];

        for(var i in foundsMovies){
            var fullData = this.findOrderedMovieByName(foundsMovies[i]);

            results.push(fullData);
        }

        return results;
    }


    printLog(funcName, params = null){
        var now = moment().format('YYYY-MM-DD HH:mm');
        var rawStr = `${funcName} called at ${now}`;

        var str = params != null ? `${rawStr} with params ${params}` : rawStr;

        console.log(str);
    }
}