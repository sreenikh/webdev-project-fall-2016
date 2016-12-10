(function(){
    angular
        .module("BookReviewApp")
        .controller("ReviewController", ReviewController);

    function ReviewController($routeParams, $location, ReviewService){

        var vm = this;
        vm.userId = $routeParams.userId;
        vm.createReview = createReview;

        function init(){
            ReviewService.
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