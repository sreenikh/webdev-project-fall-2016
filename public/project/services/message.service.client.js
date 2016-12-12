(function () {
    angular
        .module("BookReviewApp")
        .factory("MessageService", MessageService);

    function MessageService($http) {
        var api = {
            createMessage: createMessage,
            deleteMessage: deleteMessage,
            getMessagesFromOneUserToAnotherUser: getMessagesFromOneUserToAnotherUser,
            getAllMessagesForUser: getAllMessagesForUser,
            setMessageStatusAsRead: setMessageStatusAsRead
        };
        return api;

        function createMessage(fromId, toId, messageText) {
            var url = '/api/message';
            var message = {
                fromId: fromId,
                toId: toId,
                message: messageText,
                fromStatus: 'READ',
                toStatus: 'UNREAD'
            };
            return $http.post(url, message);
        }

        function deleteMessage(messageId) {
            return $http.delete("/api/message/" + messageId);
        }

        function getMessagesFromOneUserToAnotherUser(fromId, toId) {
            var url = '/api/message/from/' + fromId + '/to/' + toId;
            return $http.get(url);
        }

        function getAllMessagesForUser(userId) {
            var url = '/api/message/user/' + userId;
            return $http.get(url);
        }

        function setMessageStatusAsRead(messageId) {
            var url = '/api/message/markasread/' + messageId;
            var emptyJson = {};
            return $http.put(url, emptyJson);
        }
    }

})();