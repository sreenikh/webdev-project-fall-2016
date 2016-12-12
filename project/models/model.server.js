module.exports = function() {
    "use strict";

    var mongoose = require('mongoose');
    var connectionString = 'mongodb://localhost:27017/web-project-fall-2016';
    if(process.env.MLAB_DB_USERNAME) {
        connectionString = process.env.MLAB_DB_URL_INIT +
            process.env.MLAB_DB_USERNAME + ":" +
            process.env.MLAB_DB_PASSWORD +
            process.env.MLAB_DB_URL_END + '/' +
            process.env.MLAB_DB_NAME;
    }
    mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server.js")();
    var bookshelfModel = require("./bookshelf/bookshelf.model.server.js")();
    var bookModel = require("./book/book.model.server.js")();
    var messageModel = require("./message/message.model.server")();
    var reviewModel = require("./review/review.model.server.js")();


    var model = {
        userModel: userModel,
        bookshelfModel: bookshelfModel,
        bookModel: bookModel,
        messageModel: messageModel,
        reviewModel: reviewModel
    };

    userModel.setModel(model);
    bookshelfModel.setModel(model);
    bookModel.setModel(model);
    messageModel.setModel(model);
    reviewModel.setModel(model);

    return model;
};