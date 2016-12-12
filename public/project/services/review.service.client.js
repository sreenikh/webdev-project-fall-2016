/**
 * Created by kreenamehta on 12/2/16.
 */
(function () {
    angular
        .module("BookReviewApp")
        .factory("ReviewService", ReviewService);

    function ReviewService($http) {
        var api = {
            createReview: createReview,
            editReview: editReview,
            deleteReview: deleteReview
            //getAllReviews: getAllReviews - in book service instead
        };

        return api;

        function createReview(review, reviewer, book) {
            var newReview = {
                _book: book.id,
                title: book.volumeInfo.title,
                _user: reviewer._id,
                firstName: reviewer.firstName,
                lastName: reviewer.lastName,
                review: review
            };
            var url = "/api/user/"+reviewer._id+"/book/"+book.id+"/review";
            return $http.post(url, newReview);
        }

        function editReview(reviewId, review) {
            var editedReview = {
                review: review
            };
            var url = "/api/review/"+reviewId;
            return $http.put(url, editedReview);
        }

        function deleteReview(reviewId) {
            var url = "/api/review/"+reviewId;
            return $http.delete(url);
        }

        function getAllReviews() {
            var url = "/api/review";
            return $http.get(url);
        }
    }
})();