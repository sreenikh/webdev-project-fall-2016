module.exports = function () {
    "use strict";

    var mongoose = require('mongoose');
    var BookSchema = mongoose.Schema({
        title: String,
        googleBookId: String,
        _bookshelf: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        //reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'ReviewModel'}],
        averageRating: Number,
        ratingsCount: String,
        smallThumbnail: String,
        thumbnail: String,
        publisher: String,
        publishedDate: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.book"});
    return BookSchema;
};