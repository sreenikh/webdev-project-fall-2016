module.exports = function () {
    "use strict";

    var mongoose = require("mongoose");
    var BookshelfSchema = require("./bookshelf.schema.server.js")();
    var BookshelfModel = mongoose.model("BookshelfModel", BookshelfSchema);

    var model = {};

    var api = {
        createBookshelf: createBookshelf,
        findAllBookshelvesForUser: findAllBookshelvesForUser,
        findBookshelfById: findBookshelfById,
        findBookObjectIdsForBookshelf: findBookObjectIdsForBookshelf,
        //updateBookshelf: updateBookshelf,
        deleteBookshelf: deleteBookshelf,
        setModel: setModel
    };
    return api;

    function createBookshelf(userId, bookshelf) {
        return BookshelfModel
            .create(bookshelf)
            .then(
                function (newBookshelf) {
                    return model
                        .userModel
                        .findUserById(userId)
                        .then(
                            function (user) {
                                user.bookshelves.push(newBookshelf);
                                newBookshelf._user = user._id;
                                user.save();
                                newBookshelf.save();
                                return newBookshelf;
                            },
                            function (error) {
                            }
                        );
                },
                function () {

                });
    }

    function findAllBookshelvesForUser(userId) {
        return model
            .userModel
            .findBookshelfObjectIdsForUser(userId)
            .then(
                function (listOfBookshelfObjectIds) {
                    return BookshelfModel
                        .find({_id: {$in: listOfBookshelfObjectIds}});
                },
                function (error) {
                }
            );
    }

    function findBookObjectIdsForBookshelf(bookshelfId) {
        return BookshelfModel
            .findById(bookshelfId)
            .then(
                function (bookshelf) {
                    return bookshelf.books;
                }
            );
    }

    function findBookshelfById(bookshelfId) {
        return BookshelfModel.findById(bookshelfId);
    }

    function updateBookshelf(bookshelfId, bookshelf) {
        return BookshelfModel.update(
            {_id: bookshelfId},
            {$set: {
                name: bookshelf.name,
                description: bookshelf.description
            }}
        );
    }

    function deleteBookshelf(bookshelfId) {
        return BookshelfModel
            .findById(bookshelfId)
            .then(
                function (bookshelf) {
                    var count = 0;
                    var listOfBookIds = [];

                    bookshelf.books.forEach(function (book) {
                        listOfBookIds.push(book.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfBooks(count, listOfBookIds);

                    function recursiveDeletionOfBooks(currentCount, inputListOfBookIds) {
                        if (currentCount === inputListOfBookIds.length) {
                            return model
                                .bookshelfModel
                                .findBookshelfById(bookshelfId)
                                .then(
                                    function (bookshelf) {
                                        var userId = bookshelf._user;
                                        return BookshelfModel
                                            .remove({_id: bookshelf._id.valueOf()})
                                            .then(
                                                function (response) {
                                                    model
                                                        .userModel
                                                        .findUserById(userId.valueOf())
                                                        .then(
                                                            function (user) {
                                                                const index = user.bookshelves.indexOf(bookshelf._id);
                                                                user.bookshelves.splice(index, 1);
                                                                return user.save();
                                                            },
                                                            function (error) {
                                                            }
                                                        );
                                                },
                                                function () {

                                                });
                                    }
                                );
                        } else {
                            return model
                                .bookModel
                                .deleteBook(inputListOfBookIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfBooks(currentCount + 1, inputListOfBookIds);
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