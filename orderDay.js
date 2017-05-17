var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    orderDaySchema = new schema({
        date: {type:Date, index:1, required:true, unique:true},
        movies: [Number]

    }, {collection: 'orderedDays'});


var OrderDay = mongoose.model('OrderDay', orderDaySchema); 

module.exports = OrderDay;