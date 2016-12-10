module.exports = function (app, model) {

    app.post('/api/user/:uid/book/:bid/review', createReview);
    app.get('/api/book/:bid/review', getReviewsByBookId);
    app.put('/api/review/:rid', updateReview);
    app.delete('/api/review/:rid', deleteReview);
    
    function createReview(req, res) {
        var newReview = req.body;
        model.reviewModel
            .createReview(newReview)
            .then(
                function (review) {
                    res.json(review);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function getReviewsByBookId(req, res) {
        var bookId = req.params.bId;
        model.reviewModel
            .getReviewsByBookId(bookId)
            .then(
                function (bookReviews) {
                    res.json(bookReviews);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );

    }

    function updateReview(req, res) {
        var reviewId = req.params.rid;
        var review = req.body.review;
        model.reviewModel
            .updateReview(reviewId, review)
            .then(
                function (status) {
                    res.send(review);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function deleteReview(req, res) {
        var reviewId = req.params.rid;
        model.reviewModel
            .deleteReview(reviewId)
            .then(
                function () {
                    res.send(200);
                },
                function () {
                    res.send(400);
                }
            );

    }
};