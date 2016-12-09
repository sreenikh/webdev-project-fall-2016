module.exports = function (app, model) {
    "use strict";

    app.post('/api/bookshelf/:bookshelfId/book', createBook);
    app.get('/api/bookshelf/:bookshelfId/book', findAllBooksForBookshelf);
    app.get('/api/book/:bookId', findBookById);
    app.put('/api/book/:bookId', updateBook);
    app.delete('/api/book/:bookId', deleteBook);

    function createBook(req, res) {
        var bookshelfId = req.params.bookshelfId;
        var book = req.body;
        model
            .bookModel
            .findBooksByBookshelfIdAndName(bookshelfId, book.name)
            .then(
                function (listOfBooks) {
                    if (0 !== listOfBooks.length) {
                        res.send('0');
                    } else {
                        model
                            .bookModel
                            .createBook(bookshelfId, book)
                            .then(
                                function (newPage) {
                                    res.json(newPage);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllBooksForBookshelf(req, res) {
        var bookshelfId = req.params.bookshelfId;
        model
            .bookModel
            .findAllBooksForBookshelf(bookshelfId)
            .then(
                function (listOfBooks) {
                    res.json(listOfBooks);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findBookById(req, res) {
        var bookId = req.params.bookId;
        model
            .bookModel
            .findBookById(bookId)
            .then(
                function (book) {
                    res.json(book);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateBook(req, res) {
        var bookId = req.params.bookId;
        var book = req.body;
        model
            .pageModel
            .updateBook(bookId, book)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteBook(req, res) {
        var bookId = req.params.bookId;
        model
            .bookModel
            .deleteBook(bookId)
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