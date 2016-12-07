module.exports = function() {

    var mongoose = require('mongoose');
    var connectionString = 'mongodb://localhost/web-project-fall-2016';
    if(process.env.MLAB_DB_USERNAME) {
        connectionString = process.env.MLAB_DB_URL_INIT +
            process.env.MLAB_DB_USERNAME + ":" +
            process.env.MLAB_DB_PASSWORD +
            process.env.MLAB_DB_URL_END + '/' +
            process.env.MLAB_DB_NAME;
    }
    //mongoose.connect('mongodb://localhost/webappmaker');
    mongoose.connect(connectionString);

    var models;
    models = {
        userModel: require("./user/user.model.server.js")()

    };

    //userModel.setModel(models);

    return models;
};