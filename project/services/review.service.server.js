module.exports = function (app, model) {

    app.post('/api/review', createReview);
    app.get('/api/book/google/:gbid/review', getReviewsByGoogleBookId);
    app.get('/api/review/user/:uid/book/:gbid', findReviewByGoogleBookIdAndUser);
    app.put('/api/review/:rid', updateReview);
    app.delete('/api/review/:rid', deleteReview);
    app.delete('/api/review/user/:uid', deleteAllReviewsForUser);
    app.delete('/api/admin/deleteAllReviews', deleteAllReviews);

    function createReview(req, res) {
        var newReview = req.body;
        var userId = newReview._user;
        var googleBookId = newReview.googleBookId;
        model
            .reviewModel
            .findReviewByGoogleBookIdAndUser(googleBookId, userId)
            .then(
                function (listOfReviews) {
                    if (0 == listOfReviews.length) {
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
                    } else {
                        res.send(false);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(400);
                });
    }

    function getReviewsByGoogleBookId(req, res) {
        var googleBookId = req.params.gbid;
        model
            .reviewModel
            .getReviewsByGoogleBookId(googleBookId)
            .then(
                function (bookReviews) {
                    res.json(bookReviews);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );

    }

    function findReviewByGoogleBookIdAndUser(req, res) {
        var userId = req.params.uid;
        var googleBookId = req.params.gbid;
        model
            .reviewModel
            .findReviewByGoogleBookIdAndUser(googleBookId, userId)
            .then(
                function (listOfReviews) {
                    if (0 == listOfReviews.length) {
                        res.send('0');
                    } else {
                        var review = listOfReviews[0];
                        res.json(review);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error)
                }
            );
    }

    function updateReview(req, res) {
        var reviewId = req.params.rid;
        var review = req.body.review;
        model
            .reviewModel
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
        model
            .reviewModel
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

    function deleteAllReviewsForUser(req, res) {
        var userId = req.params.uid;
        model
            .reviewModel
            .deleteAllReviewsForUser(userId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteAllReviews(req, res) {
        model
            .reviewModel
            .deleteAllReviews()
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }
};