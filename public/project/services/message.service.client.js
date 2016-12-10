(function () {
    angular
        .module("BookReviewApp")
        .factory("MessageService", MessageService);

    function MessageService($http) {
        var api = {
            createMessage: createMessage,
            deleteMessage: deleteMessage,
            getMessages: getMessages
        };

        return api;


        function createMessage(message) {
            return $http.post("/api/message/", message);
        }

        function deleteMessage(messageId) {
            return $http.delete("/api/message/" + messageId);
        }

        function getMessages(filterparams) {
            return $http.post("/api/message/get",filterparams);
        }

    }

})();