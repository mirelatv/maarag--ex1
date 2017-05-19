const   moment = require('moment'),
        consts = require('./consts'),
        mongoose = require('mongoose'),
        OrderDay = require('./orderDay');

mongoose.connect(consts.MLAB_KEY);

const conn = mongoose.connection;
conn.on('error', (err) => {
    console.log(`connection error: ${err}`);
});


exports.OrderedMoviesModule = class OrderedMoviesModule {

    constructor() {

    }

    getAllOrderedMovies(req, res){
        this.printLog('getAllOrderedMovies');

        var results = [];
        var dayPromise = OrderDay.find({}, 
            (err, days) => {
                if(err) this.sendJsonError(res, "Somthig went wrong - no data found");
                //Create json to client without mongo id
                for(var d in days){
                    var day = days[d];

                    var result = this.createDayObject(day);
                    results.push(result);
                }
                res.json(results)
            });
    }

    createDayObject(rawData){
        var day = {};
        day.date = rawData.date;
        day.movies = rawData.movies;

        return day;
    }

    getOrderedMovieByName(req, res, name){
        this.printLog('getOrderedMovieByName', `name: ${name}`);
        var promise = OrderDay.find({'movies': {$elemMatch: {"name": name }}}, 
            (err, days) => {
                if(err) console.log(err);
                //Create json for client
                if(days.length > 0){
                    var result = this.createSeacrhMovie(days, name);
                    res.json(result);
                }
                else{
                    this.sendJsonError(res, `${name} not found`);
                }
            });    
    }

    createSeacrhMovie(days, searchName){
        var results = [];

        for(var d in days){
            var day = days[d];

            var result = {};
            result.date = day.date;

            for(var m in day.movies){
                var movie = day.movies[m];
                if(movie.name == searchName){
                    result.movie = movie;
                    break;
                }
            }

            results.push(result);
        }   

        return results;
    }

    getOrderedMoviesByDateAndName(req, res, date, movieName){
        this.printLog('getOrderedMoviesByDateAndName', `date: ${date}, movieName: ${movieName}`);

        var validFormat = this.assertDateFormat(date);
        if(!validFormat){
            this.sendJsonError(res, `Unvalidated date format for ${date} - the requested format is YYYY-MM-DD`);
            return;
        }
        var promise = OrderDay.find({'date': date}, 
            (err, days) => {
                if(err) console.log(err);
                //Create json for client
                if(days.length > 0){
                    var result = this.createSeacrhMovie(days, movieName);
                    res.json(result);
                }
                else{
                    this.sendJsonError(res, `${date} not found`);
                }
            });
    }

    assertDateFormat(date){
        return /\d\d\d\d-\d\d-\d\d$/.test(date);
    }

    sendJsonError(res, error){
        var jsonError = {};
        jsonError.error = error;
        res.json(jsonError);
    }

    printLog(funcName, params = null){
        var now = moment().format('YYYY-MM-DD HH:mm');
        var rawStr = `${funcName} called at ${now}`;

        var str = params != null ? `${rawStr} with params ${params}` : rawStr;

        console.log(str);
    }
}