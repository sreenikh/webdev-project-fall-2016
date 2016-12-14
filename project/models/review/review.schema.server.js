module.exports = function () {

    var mongoose = require('mongoose');

    var ReviewSchema = mongoose.Schema({
        _user : {type: mongoose.Schema.Types.ObjectId, ref:'UserModel'},
        googleBookId: String,
        review: String,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "project.review"});

    return ReviewSchema;
};