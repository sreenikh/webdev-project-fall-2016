(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .factory("BookshelfService", bookshelfService);

    function bookshelfService($http) {

        var api = {
            createBookshelf: createBookshelf,
            findBookshelvesForUser: findBookshelvesForUser,
            findBookshelfById: findBookshelfById,
            deleteAllBookshelves: deleteAllBookshelves
        };
        return api;

        function createBookshelf(userId, bookshelf) {
            if ("" === bookshelf.name) {
                return null;
            }
            var url = '/api/user/' + userId + "/bookshelf";
            return $http.post(url, bookshelf);
        }

        function findBookshelvesForUser(userId) {
            var url = '/api/user/' + userId + '/bookshelf';
            return $http.get(url);
        }

        function findBookshelfById(bookshelfId) {
            var url = '/api/bookshelf/' + bookshelfId;
            return $http.get(url);
        }

        function deleteAllBookshelves() {
            var url = '/api/admin/deleteAllBookshelves';
            return $http.delete(url);
        }
    }
})();