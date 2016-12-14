(function () {
    angular
        .module("BookReviewApp")
        .factory("ReviewService", ReviewService);

    function ReviewService($http) {
        var api = {
            createReview: createReview,
            getReviewsByGoogleBookId: getReviewsByGoogleBookId,
            findReviewByGoogleBookIdAndUser: findReviewByGoogleBookIdAndUser,
            updateReview: updateReview,
            deleteReview: deleteReview,
            deleteAllReviewsForUser: deleteAllReviewsForUser,
            deleteAllReviews: deleteAllReviews
            //getAllReviews: getAllReviews - in book service instead
        };

        return api;

        function createReview(review, reviewer, book) {
            var newReview = {
                googleBookId: book.id,
                //title: book.volumeInfo.title,
                _user: reviewer._id,
                //firstName: reviewer.firstName,
                //lastName: reviewer.lastName,
                review: review
            };
            var url = '/api/review';
            return $http.post(url, newReview);
        }

        function updateReview(reviewId, review) {
            var editedReview = {
                review: review
            };
            var url = '/api/review/' + reviewId;
            return $http.put(url, editedReview);
        }

        function deleteReview(reviewId) {
            var url = '/api/review/' + reviewId;
            return $http.delete(url);
        }

        function deleteAllReviews() {
            var url = '/api/admin/deleteAllReviews';
            return $http.delete(url);
        }

        function getAllReviews() {
            var url = '/api/review';
            return $http.get(url);
        }

        function getReviewsByGoogleBookId(googleBookId) {
            var url = '/api/book/google/' + googleBookId + '/review';
            return $http.get(url);
        }

        function findReviewByGoogleBookIdAndUser(googleBookId, userId) {
            var url = '/api/review/user/' + userId + '/book/' + googleBookId;
            return $http.get(url);
        }

        function deleteAllReviewsForUser(userId) {
            var url = '/api/review/user/' + userId;
            return $http.delete(url);
        }
    }
})();