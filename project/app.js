module.exports = function(app) {
    "use strict";

    var model = require("./models/model.server")();

    require("./services/user.service.server.js")(app, model);
    require("./services/bookshelf.service.server.js")(app, model);
    require("./services/book.service.server.js")(app, model);
};