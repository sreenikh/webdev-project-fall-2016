(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("BookListController", BookListController)
        .controller("BookController", BookController)
        .controller("BookSearchController", BookSearchController)
        .controller("BookInfoController", BookInfoController);

    function BookListController($routeParams, $location, BookService) {
        var vm = this;
        vm.books = [];

        var userId = $routeParams['uid'];
        var bookshelfId = $routeParams['bsid'];

        vm.navigateToBookDetails = navigateToBookDetails;
        vm.navigateToSearchBooks = navigateToSearchBooks;

        function init() {
            BookService
                .findBooksForBookshelf(bookshelfId)
                .success(function (books) {
                    if ('0' !== books) {
                        vm.books = books;
                    }
                })
                .error(function (error) {
                });
        }
        init();

        function navigateToBookDetails(book) {
            var bookId = book._id;
            $location.url("/user/" + userId + "/bookshelf/" + bookshelfId + "/book/" + bookId);
        }

        function navigateToSearchBooks() {
            $location.url("/user/" + userId + "/book/search");
        }
    }

    function BookController($routeParams, $location, BookshelfService, BookService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var bookshelfId = $routeParams['bsid'];
        var bookId = $routeParams['bid'];

        vm.checkBookshelf = checkBookshelf;
        vm.deleteBook = deleteBook;
        vm.moveToBookshelf = moveToBookshelf;
        var bookshelvesForUser = [];

        function init() {
            BookshelfService
                .findBookshelfById(bookshelfId)
                .success(function (bookshelf) {
                    vm.bookshelf = bookshelf;
                })
                .error(function (error) {
                });
            BookService
                .findBookById(bookId)
                .success(function (book) {
                    vm.book = book;
                })
                .error(function (error) {
                    console.log(error);
                });
            BookshelfService
                .findBookshelvesForUser(userId)
                .success(function (listOfBookshelves) {
                    bookshelvesForUser = listOfBookshelves;
                })
                .error(function (error) {
                });
        }
        init();

        function checkBookshelf(bookshelfType) {
            return bookshelfType === vm.bookshelf.type;
        }

        function deleteBook(book) {
            BookService
                .deleteBook(bookId)
                .success(function (response) {
                    $location.url("/user/" + userId + "/bookshelf/" + bookshelfId + "/book");
                })
                .error(function (error) {
                });
        }

        function moveToBookshelf(bookshelfType) {
            var bookshelfWithNewType = vm.bookshelf
            bookshelfWithNewType.type = bookshelfType;
            BookService
                .moveToBookshelf(bookId, bookshelfWithNewType)
                .success(function (response) {
                    $location.url("/user/" + userId + "/bookshelf/" + bookshelfId + "/book");
                })
                .error(function (error) {
                });

        }
    }

    function BookSearchController($routeParams, $location, BookService) {
        var vm = this;
        vm.navigateToProfile = navigateToProfile;
        vm.searchForBooks = searchForBooks;
        vm.navigateToBookView = navigateToBookView;

        vm.books = [];

        var userId = $routeParams['uid'];

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function searchForBooks() {
            if (undefined !== vm.searchText && null !== vm.searchText && "" !== vm.searchText) {
                BookService
                    .searchForBooks(vm.searchText)
                    .success(function (response) {
                        if (0 !== response.totalItems) {
                            console.log(response)
                            vm.books = response.items
                        }
                    })

            }
        }

        function navigateToBookView(book) {
            $location.url("/user/" + userId + "/book/info/" + book.id);
        }
    }

    function BookInfoController($routeParams, $location, BookshelfService, BookService) {
        var vm = this;
        var googleBookId = $routeParams.googleBookId;
        vm.addToBookshelf = addToBookshelf;

        var userId = $routeParams['uid'];
        var bookshelvesForUser = [];

        function init() {
            BookService
                .findBookInfo(googleBookId)
                .success(function (info) {
                    vm.book = info;
                    console.log(info);
                })
                .error(function (error) {
                });
            BookshelfService
                .findBookshelvesForUser(userId)
                .success(function (listOfBookshelves) {
                    bookshelvesForUser = listOfBookshelves;
                })
                .error(function (error) {
                });
        }
        init();

        function addToBookshelf(bookshelfType) {
            console.log(bookshelfType);
            for (var bs in bookshelvesForUser) {
                var bookshelf = bookshelvesForUser[bs];
                if (bookshelfType === bookshelf.type) {
                    var bookToBeCreated = {
                        title: vm.book.volumeInfo.title,
                        googleBookId: vm.book.id,
                        smallThumbnail: vm.book.volumeInfo.imageLinks.smallThumbnail,
                        thumbnail: vm.book.volumeInfo.imageLinks.thumbnail
                    };
                    BookService
                        .createBook(bookshelf._id, bookToBeCreated)
                        .success(function (newBook) {
                            console.log(newBook);
                            $location.url("/user/" + userId + "/bookshelf");
                        })
                        .error(function (error) {
                        })
                }
            }
        }
    }
})();