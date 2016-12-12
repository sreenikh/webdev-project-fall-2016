module.exports = function () {

    var mongoose = require('mongoose');
    var ReviewSchema = require("./review.schema.server.js")();
    var ReviewModel = mongoose.model("ReviewModel", ReviewSchema);

    var api = {
        createReview: createReview,
        editReview: editReview,
        deleteReview: deleteReview,
        getReviewsByBookId: getReviewsByBookId,
        getReviewsByGoogleBookId: getReviewsByGoogleBookId,
        setModel:setModel
    };
    return api;
    
    function createReview(review) {
        return ReviewModel.create(review);
    }


    function getReviewsByBookId(bid) {
        return ReviewModel.find({_book: bid});
    }

    function getReviewsByGoogleBookId(bid) {
        return ReviewModel.find({googleBookId: bid});
    }

    function editReview(reviewid, review_text) {
        return ReviewModel.update(
            {_id: reviewid}, {review: review_text}
        );
    }

    function deleteReview(reviewid) {
        return ReviewModel.remove({_id: reviewid});
    }
    function setModel(_model) {
        model = _model;
    }

};