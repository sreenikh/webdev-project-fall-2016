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
            deleteBook: deleteBook,
            moveToBookshelf: moveToBookshelf,
            getSampleBooks:getSampleBooks,
            createReviewForBook:createReviewForBook,
            findReviewsByBookId:findReviewsByBookId,
            findReviewsByGoogleBookId:findReviewsByGoogleBookId
        };
        return api;

        function createBook(bookshelfId, book) {
            var url = '/api/bookshelf/' + bookshelfId + '/book';
            return $http.post(url, book);
        }

        function createReviewForBook(userId,bookId,review) {
            var url = '/api/user/'+userId+'/book/'+bookId+'/review';
            return $http.post(url, review);
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

        function moveToBookshelf(bookId, bookshelfWithNewType) {
            var url = '/api/book/movetobookshelf/' + bookId;
            return $http.put(url, bookshelfWithNewType);
        }
        function getSampleBooks() {
            var url = "https://www.googleapis.com/books/v1/volumes?q=%22%20%22&orderBy=newest";
            return $http.get(url);
        }

        function findReviewsByBookId(bookId) {
            var url = "/api/book/"+bookId+"/review";
            return $http.get(url);
        }
        function findReviewsByGoogleBookId(googleBookId) {
            var url = "/api/book/google/"+googleBookId+"/review";
            return $http.get(url);
        }
    }
})();