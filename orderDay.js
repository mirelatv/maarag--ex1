var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    orderDaySchema = new schema({
        date: {type:String, index:1, required:true, unique:true},
        movies: [{
            id: Number,
            name: String
        }]

    }, {collection: 'orderedDays'});


var OrderDay = mongoose.model('OrderDay', orderDaySchema); 

module.exports = OrderDay;