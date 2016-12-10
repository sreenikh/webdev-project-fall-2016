module.exports = function(app, model){

    var messageModel = model.messageModel;


    app.post("/api/message/", createMessage);
    app.post("/api/message/get", getMessages);
    app.delete("/api/message/:messageId", deleteMessage);


    function createMessage(req, res) {
        var message = req.body;
        messageModel
            .createMessage(message)
            .then(function (response) {
                res.send(200);
            }, function (error) {
                console.log(error)
                res.status(501).send("Message not sent")
            });

    }

    function deleteMessage(req, res) {
        var messageId = req.params.messageId;
        messageModel
            .deleteMessage(messageId)
            .then(function (response) {
                res.send(200);
            }, function () {
                res.status(501).send("Could not delete the message")
            });

    }

    function getMessages(req, res) {
        var toId = req.body.fromId;
        var fromId = req.body.toId;
        messageModel
            .getMessages(fromId,toId)
            .then( function (messages) {
                res.json(messages);
            }, function (err) {
                res.status(404).send("No Message Found")
            })

    }

};

