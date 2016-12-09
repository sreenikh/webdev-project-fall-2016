module.exports = function (app, model) {
    "use strict";

    app.post('/api/user/:userId/bookshelf', createBookshelf);
    app.get('/api/user/:userId/bookshelf', findAllBookshelvesForUser);
    app.get('/api/bookshelf/:bookshelfId', findBookshelfById);
    app.put('/api/bookshelf/:bookshelfId', updateBookshelf);
    app.delete('/api/bookshelf/:bookshelfId', deleteBookshelf);

    function createBookshelf(req, res) {
        var userId = req.params.userId;
        var bookshelf = req.body;
        model
            .bookshelfModel
            .createBookshelf(userId, bookshelf)
            .then(
                function (newBookshelf) {
                    res.json(newBookshelf);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllBookshelvesForUser(req, res) {
        var userId = req.params.userId;
        model
            .bookshelfModel
            .findAllBookshelvesForUser(userId)
            .then(
                function (listOfBookshelves) {
                    res.json(listOfBookshelves);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findBookshelfById(req, res) {
        var bookshelfId = req.params.bookshelfId;
        model
            .bookshelfModel
            .findBookshelfById(bookshelfId)
            .then(
                function (bookshelf) {
                    res.json(bookshelf);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateBookshelf(req, res) {
        var bookshelfId = req.params.bookshelfId;
        var bookshelf = req.body;
        model
            .bookshelfModel
            .updateBookshelf(bookshelfId, bookshelf)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteBookshelf(req, res) {
        var bookshelfId = req.params.bookshelfId;
        model
            .bookshelfModel
            .deleteBookshelf(bookshelfId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
}