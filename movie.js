var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    movieSchema = new schema({
        name: {type:String, index:1, required:true, unique:true},
        id: Number,
    }, {collection: 'movies'});


var Movie = mongoose.model('Movie', movieSchema); 

module.exports = Movie;