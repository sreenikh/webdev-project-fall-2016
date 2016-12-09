module.exports = function () {
    "use strict";

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var model = {};

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findBookshelfObjectIdsForUser: findBookshelfObjectIdsForUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel
    };
    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.find({username: username});
    }

    function findUserByCredentials(username, password) {
        return UserModel.find({username: username, password: password});
    }

    function findBookshelfObjectIdsForUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    return user.bookshelves;
                }
            );
    }

    function updateUser(userId, user) {
        return UserModel.update({
            _id: userId
        }, {
            $set: {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }});
    }

    function deleteUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    var count = 0;
                    var listOfBookshelfIds = [];

                    user.bookshelves.forEach(function (bookshelf) {
                        listOfBookshelfIds.push(bookshelf.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfBookshelves(count, listOfBookshelfIds);

                    function recursiveDeletionOfBookshelves(currentCount, inputListOfBookshelfIds) {
                        if (currentCount === inputListOfBookshelfIds.length) {
                            return UserModel.remove({_id: userId});
                        } else {
                            return model
                                .bookshelfModel
                                .deleteBookshelf(inputListOfBookshelfIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfBookshelves(currentCount + 1, inputListOfBookshelfIds);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }
                    }
                },
                function (error) {

                });
    }

    function setModel(_model) {
        model = _model;
    }
};