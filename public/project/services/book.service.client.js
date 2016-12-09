(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .factory("BookService", bookService);

    function bookService($http) {
        var api = {
            createBook: createBook,
            findBooksForBookshelf: findBooksForBookshelf,
            findBookById: findBookById,
            searchForBooks: searchForBooks,
            findBookInfo: findBookInfo,
            deleteBook: deleteBook
        };
        return api;

        function createBook(bookshelfId, book) {
            var url = '/api/bookshelf/' + bookshelfId + '/book';
            return $http.post(url, book);
        }

        function findBooksForBookshelf(bookshelfId) {
            var url = '/api/bookshelf/' + bookshelfId + '/book';
            return $http.get(url);
        }

        function findBookById(bookId) {
            var url = '/api/book/' + bookId;
            return $http.get(url);
        }

        function searchForBooks(searchText) {
            var key = "AIzaSyB7ebWTJ8ZZ6HhFZsP3lCyFvQFe0lhK6jI";
            var url = "https://www.googleapis.com/books/v1/volumes?q=QUERY&key=KEY&maxR" +
                "esults=40";
            url = url.replace('KEY', key);
            url = url.replace('QUERY', searchText.trim());
            return $http.get(url);
        }

        function findBookInfo(googleBookId) {
            var url = "https://www.googleapis.com/books/v1/volumes/" + googleBookId;
            return $http.get(url);
        }

        function deleteBook(bookId) {
            var url = '/api/book/' + bookId;
            return $http.delete(url);
        }
    }
})();