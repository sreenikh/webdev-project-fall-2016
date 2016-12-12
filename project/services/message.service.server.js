module.exports = function(app, model){
    "use strict";

    app.post("/api/message/", createMessage);
    app.get("/api/message/user/:userId", getAllMessagesForUser);
    app.get("/api/message/from/:fromId/to/:toId", getMessagesFromOneUserToAnotherUser);
    app.put("/api/message/markasread/:messageId", setMessageStatusAsRead);
    app.delete("/api/message/:messageId", deleteMessage);

    function createMessage(req, res) {
        var message = req.body;
        model
            .messageModel
            .createMessage(message)
            .then(function (response) {
                res.send(200);
            }, function (error) {
                console.log(error);
                res.status(501).send("Message not sent")
            });

    }

    function deleteMessage(req, res) {
        var messageId = req.params.messageId;
        model
            .messageModel
            .deleteMessage(messageId)
            .then(function (response) {
                res.send(200);
            }, function () {
                res.status(501).send("Could not delete the message");
            });

    }

    function getAllMessagesForUser(req, res) {
        var userId = req.params.userId;
        model
            .messageModel
            .getAllMessagesForUser(userId)
            .then(function (listOfMessages) {
                res.json(listOfMessages);
            }, function () {
                res.status(501).send("Could not delete the message");
            });
    }

    function getMessagesFromOneUserToAnotherUser(req, res) {
        var toId = req.params.fromId;
        var fromId = req.params.toId;
        model
            .messageModel
            .getMessagesFromOneUserToAnotherUser(fromId, toId)
            .then(
                function (messages) {
                    res.json(messages);
                }, function (err) {
                    res.status(404).send("No Message Found");
                });
    }

    function setMessageStatusAsRead(req, res) {
        var messageId = req.params.messageId;
        model
            .messageModel
            .setMessageStatusAsRead(messageId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

};

