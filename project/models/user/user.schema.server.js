
module.exports = function () {
    "use strict";

    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        bookshelves: [{type: mongoose.Schema.Types.ObjectId, ref: 'BookshelfModel'}],
        dateCreated: {type: Date, default: Date.now},
        role: {type: String, enum:["ADMIN", "READER"], default: "READER"},
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}]
    }, {collection: "project.user"});
    return UserSchema;
};