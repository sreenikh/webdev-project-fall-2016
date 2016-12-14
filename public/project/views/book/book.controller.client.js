(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("BookListController", BookListController)
        .controller("BookController", BookController)
        .controller("BookSearchController", BookSearchController)
        .controller("PublicBookSearchController", PublicBookSearchController)
        .controller("BookInfoController", BookInfoController)
        .controller("PublicBookInfoController", PublicBookInfoController);

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

    function BookController($routeParams, $location, $sce, BookshelfService, BookService, UserService, ReviewService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var bookshelfId = $routeParams['bsid'];
        var bookId = $routeParams['bid'];

        var username = "";

        vm.checkBookshelf = checkBookshelf;
        vm.deleteBook = deleteBook;
        vm.moveToBookshelf = moveToBookshelf;
        vm.createReview = createReview;
        vm.checkSafeHtml = checkSafeHtml;
        vm.editOrUpdate = editOrUpdate;
        vm.deleteReview = deleteReview;

        var bookshelvesForUser = [];
        vm.bookshelf = {};
        vm.bookshelf.type = null;
        vm.reviews = [];
        vm.userHasAlreadyReviewed = false;
        vm.EDIT = "Edit";
        vm.UPDATE = "Update";
        vm.editUpdateString = "Edit";
        vm.reviewOfThisUser = {review: ""};

        function init() {
            vm.editUpdateString = "Edit";
            vm.reviewOfThisUser = {review: ""};
            vm.userHasAlreadyReviewed = false;
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
                    BookService
                        .findBookInfo(book.googleBookId)
                        .success(function (info) {
                            vm.book = info;
                            console.log(info);
                            ReviewService
                                .getReviewsByGoogleBookId(book.googleBookId)
                                .success(function (listOfReviews) {
                                    vm.reviews = listOfReviews;
                                    for (var r in vm.reviews) {
                                        if (vm.reviews[r]._user == userId) {
                                            vm.userHasAlreadyReviewed = true;
                                            vm.reviewOfThisUser = vm.reviews[r];
                                        }
                                        UserService
                                            .findUserById(vm.reviews[r]._user)
                                            .success(function (foundUser) {
                                                vm.reviews[r]['name'] = foundUser.firstName + " " + foundUser.lastName;
                                            })
                                    }
                                })
                                .error(function (error) {
                                    console.log(error);
                                })
                        })
                        .error(function (error) {
                        });
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
            UserService
                .findUserById(userId)
                .success(function (user) {
                    vm.user = user;
                })
                .error(function (error) {
                    console.log(error);
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
            var bookshelfWithNewType = vm.bookshelf;
            bookshelfWithNewType.type = bookshelfType;
            BookService
                .moveToBookshelf(bookId, bookshelfWithNewType)
                .success(function (response) {
                    $location.url("/user/" + userId + "/bookshelf/" + bookshelfId + "/book");
                })
                .error(function (error) {
                });

        }

        function createReview(review) {
            ReviewService
                .createReview(review, vm.user, vm.book)
                .success(function (response) {
                    init();
                })
                .error(function (error) {
                })
        }

        function editOrUpdate() {
            if (vm.EDIT == vm.editUpdateString) {
                vm.editUpdateString = vm.UPDATE;
            } else if (vm.UPDATE == vm.editUpdateString) {
                ReviewService
                    .updateReview(vm.reviewOfThisUser._id, vm.reviewOfThisUser.review)
                    .success(function (response) {
                        init();
                        vm.editUpdateString = vm.EDIT;
                    })
                    .error(function () {

                    });
            }
        }

        function deleteReview() {
            ReviewService
                .deleteReview(vm.reviewOfThisUser._id)
                .success(function (response) {
                    init();
                })
                .error(function (error) {
                });
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
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
                            console.log(response);
                            vm.books = response.items
                        }
                    })

            }
        }

        function navigateToBookView(book) {
            $location.url("/user/" + userId + "/book/info/" + book.id);
        }
    }

    function PublicBookSearchController($routeParams, $location, BookService) {
        var vm = this;
        vm.navigateToProfile = navigateToProfile;
        vm.searchForBooks = searchForBooks;
        vm.navigateToBookView = navigateToBookView;

        vm.books = [];

        //var userId = $routeParams['uid'];

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
            $location.url("/book/info/" + book.id);
        }
    }

    function BookInfoController($routeParams, $location, $sce, BookshelfService, BookService, UserService, ReviewService) {
        var vm = this;
        var googleBookId = $routeParams.googleBookId;
        var userId = $routeParams['uid'];
        var bookshelvesForUser = [];

        vm.addToBookshelf = addToBookshelf;
        vm.createReview = createReview;
        vm.checkSafeHtml = checkSafeHtml;

        vm.reviews = [];

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
            UserService
                .findUserById(userId)
                .success(function (user) {
                    vm.user = user;
                })
                .error(function (error) {
                    console.log(error);
                });
            BookService
                .findReviewsByGoogleBookId(googleBookId)
                .success(function (reviews_list) {
                    vm.reviews = reviews_list;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        init();

        function addToBookshelf(bookshelfType) {
            console.log(bookshelfType);
            for (var bs in bookshelvesForUser) {
                var bookshelf = bookshelvesForUser[bs];
                if (bookshelfType === bookshelf.type) {
                    var bookToBeCreated = {
                        googleBookId: vm.book.id
                    };
                    if ('volumeInfo' in vm.book) {
                        if ('title' in vm.book.volumeInfo) {
                            bookToBeCreated['title'] = vm.book.volumeInfo.title;
                        }
                        if ('authors' in vm.book.volumeInfo) {
                            bookToBeCreated['authors'] = vm.book.volumeInfo.authors;
                        }
                        if ('publishedDate' in vm.book.volumeInfo) {
                            bookToBeCreated['publishedDate'] = vm.book.volumeInfo.publishedDate;
                        }
                        if ('publisher' in vm.book.volumeInfo) {
                            bookToBeCreated['publisher'] = vm.book.volumeInfo.publisher;
                        }
                        if ('averageRating' in vm.book.volumeInfo) {
                            bookToBeCreated['averageRating'] = vm.book.volumeInfo.averageRating;
                        }
                        if ('ratingsCount' in vm.book.volumeInfo) {
                            bookToBeCreated['ratingsCount'] = vm.book.volumeInfo.ratingsCount;
                        }
                        if ('imageLinks' in vm.book.volumeInfo) {
                            if ('smallThumbnail' in vm.book.volumeInfo.imageLinks) {
                                bookToBeCreated['smallThumbnail'] = vm.book.volumeInfo.imageLinks.smallThumbnail;
                            }
                            if ('thumbnail' in vm.book.volumeInfo.imageLinks) {
                                bookToBeCreated['thumbnail'] = vm.book.volumeInfo.imageLinks.thumbnail;
                            }
                        }
                    }
                    BookService
                        .createBook(bookshelf._id, bookToBeCreated)
                        .success(function (newBook) {
                            console.log(newBook);
                            $location.url("/user/" + userId + "/bookshelf");
                        })
                        .error(function (error) {
                        });
                }
            }
        }

        function createReview(review) {
            console.log("In the function");
            ReviewService
                .createReview(review,vm.user, vm.book )
                .success(function () {
                    console.log("Created review");
                })
                .error(function (error) {
                })
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }
    }
    function PublicBookInfoController($routeParams, $location, BookshelfService, BookService, UserService, ReviewService) {
        var vm = this;
        var googleBookId = $routeParams.googleBookId;
        vm.book = BookService
            .findBookInfo(googleBookId)
            .success(function (info) {
                vm.book = info;
                console.log(info);
            })
            .error(function (error) {
            });

        function init() {
            BookService
                .findBookInfo(googleBookId)
                .success(function (info) {
                    vm.book = info;
                    console.log(info);
                })
                .error(function (error) {
                });

            BookService
                .findReviewsByGoogleBookId(googleBookId)
                .success(function (reviews_list) {
                    vm.reviews = reviews_list;
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        init();
    }
})();