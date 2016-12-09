module.exports = function () {
    "use strict";

    var mongoose = require('mongoose');
    var BookshelfSchema = mongoose.Schema({
        name: String,
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        type:  {type: String, enum: ['CURRENTLY_READING', 'READ', 'TO_READ']},
        books: [{type: mongoose.Schema.Types.ObjectId, ref: 'BookModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "project.bookshelf"});
    return BookshelfSchema;
};