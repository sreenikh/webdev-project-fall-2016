(function(){
    angular
        .module("BookReviewApp")
        .controller("ReadMessageController", ReadMessageController);

    function ReadMessageController($routeParams, $location, MessageService){

        var vm = this;
        vm.userId = $routeParams.userId;
        vm.deleteMessage = deleteMessage;

        function init(){
            MessageService.
            getMessages(vm.userId)
                .then(function (response) {
                    vm.messages = response.data;
                    console.log(vm.messages);
                }, function (err){
                    vm.info = "No messages found";
                });

        }

        init();

        function deleteMessage(messageId) {
            MessageService
                .deleteMessage(messageId)
                .then(function (response) {
                    init();
                }, function (err) {
                    vm.error = "Error deleting message"
                });

        }
    }

})();