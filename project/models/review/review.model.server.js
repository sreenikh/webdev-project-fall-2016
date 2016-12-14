module.exports = function () {

    var mongoose = require('mongoose');
    var ReviewSchema = require("./review.schema.server.js")();
    var ReviewModel = mongoose.model("ReviewModel", ReviewSchema);

    var api = {
        createReview: createReview,
        updateReview: updateReview,
        deleteReview: deleteReview,
        deleteAllReviewsForUser: deleteAllReviewsForUser,
        getReviewsByGoogleBookId: getReviewsByGoogleBookId,
        findReviewByGoogleBookIdAndUser: findReviewByGoogleBookIdAndUser,
        deleteAllReviews: deleteAllReviews,
        setModel:setModel
    };
    return api;

    function createReview(review) {
        return ReviewModel.create(review);
    }

    function getReviewsByGoogleBookId(googleBookId) {
        return ReviewModel.find({googleBookId: googleBookId});
    }

    function findReviewByGoogleBookIdAndUser(googleBookId, userId) {
        return ReviewModel.find({googleBookId: googleBookId, _user: userId})
    }

    function updateReview(reviewid, review_text) {
        return ReviewModel
            .update({
                _id: reviewid
            }, {
                $set: {
                    review: review_text
                }});
    }

    function deleteReview(reviewid) {
        return ReviewModel.remove({_id: reviewid});
    }

    function deleteAllReviewsForUser(userId) {
        return ReviewModel.remove({_user: userId});
    }

    function deleteAllReviews() {
        return ReviewModel.remove();
    }

    function setModel(_model) {
        model = _model;
    }
};