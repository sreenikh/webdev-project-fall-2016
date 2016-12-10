module.exports = function () {

    var mongoose = require('mongoose');
    var ReviewSchema = require("./review.schema.server")();
    var ReviewModel = mongoose.model("ReviewModel", ReviewSchema);

    var api = {
        createReview: createReview,
        editReview: editReview,
        deleteReview: deleteReview,
        getReviewsByBookId: getReviewsByBookId,
        setModel:setModel
    };
    return api;
    
    function createReview(review) {
        return ReviewModel.create(review);
    }


    function getReviewsByBookId(bId) {
        return ReviewModel.find({_book: bId});
    }

    function editReview(reviewId, review_text) {
        return ReviewModel.update(
            {_id: reviewId}, {review: review_text}
        );
    }

    function deleteReview(reviewId) {
        return ReviewModel.remove({_id: reviewId});
    }
    function setModel(_model) {
        model = _model;
    }

};