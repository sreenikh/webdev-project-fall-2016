module.exports = function() {
    var mongoose = require('mongoose');
    var MessageSchema = require("./message.schema.server.js")();
    var MessageModel = mongoose.model("MessageModel", MessageSchema);

    var model = {};

    var api = {
        createMessage: createMessage,
        getMessagesFromOneUserToAnotherUser: getMessagesFromOneUserToAnotherUser,
        getAllMessagesForUser: getAllMessagesForUser,
        setMessageStatusAsRead: setMessageStatusAsRead,
        deleteMessage: deleteMessage,
        setModel: setModel
    };
    return api;

    function createMessage(message) {
        return MessageModel.create(message);
    }

    function deleteMessage(messageId) {
        return MessageModel.remove({_id : messageId});
    }

    function getMessagesFromOneUserToAnotherUser(fromId, toId){
        return MessageModel
            .find({
                $or: [
                    {fromId: fromId, toId: toId},
                    {fromId: toId, toId: fromId}
                ]
            })
            .sort({
                dateCreated: -1
            });
    }

    function getAllMessagesForUser(userId) {
        return MessageModel
            .find({
                $or: [
                    {fromId: userId},
                    {toId: userId}
                ]
            })
            .sort({
                toStatus: -1,
                dateCreated: -1
            });
    }

    function setMessageStatusAsRead(messageId) {
        return MessageModel
            .findById(messageId)
            .then(
                function (message) {
                    message.toStatus = 'READ';
                    return message.save();
                }
            );
    }

    function setModel(_model) {
        model = _model;
    }
};