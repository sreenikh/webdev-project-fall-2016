module.exports = function() {
    var mongoose = require("mongoose");

    var MessageSchema = mongoose.Schema({
        fromId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        toId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        fromId:Number,
        toId: Number,
        from: String,
        to: String,
        //subject: String,
        message: String,
        dateCreated: {type: Date, default: Date.now}

    },{collection: "project.message"});

    return MessageSchema;
};