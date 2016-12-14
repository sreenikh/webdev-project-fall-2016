(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("BookshelfListController", BookshelfListController);

    function BookshelfListController($routeParams, $location, BookshelfService) {
        var vm = this;
        vm.enlistBooks = enlistBooks;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToSearchBooks = navigateToSearchBooks;
        vm.navigateToAllMessages = navigateToAllMessages;


        var userId = $routeParams['uid'];

        function init() {
            BookshelfService
                .findBookshelvesForUser(userId)
                .success(function (bookshelves) {
                    if ('0' !== bookshelves) {
                        vm.bookshelves = bookshelves;
                    }
                })
                .error(function (error) {
                });
        }
        init();


        function navigateToAllMessages() {
            $location.url("/user/" + userId + "/message");
        }

        function enlistBooks(bookshelf) {
            var bsId = bookshelf._id;
            $location.url("/user/" + userId + "/bookshelf/" + bsId + "/book");
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function navigateToSearchBooks() {
            $location.url("/user/" + userId + "/book/search");
        }
    }
})();