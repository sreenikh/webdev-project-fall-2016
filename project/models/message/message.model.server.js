module.exports = function() {
    var mongoose = require('mongoose');
    var MessageSchema = require("./message.schema.server.js")();
    var Message = mongoose.model("Message", MessageSchema);

    var api = {
        createMessage: createMessage,
        getMessages: getMessages,
        deleteMessage: deleteMessage
    };

    return api;

    function createMessage(message) {
        return Message.create(message);
    }

    function deleteMessage(messageId) {
        return Message.remove({_id : messageId});
    }

    function getMessages(fromId, toId){
        return Message.find({$or: [{fromId: fromId, toId: toId}, {fromId: toId, toId: fromId}]})

        //return Message.find({toId: toId});
    }
};