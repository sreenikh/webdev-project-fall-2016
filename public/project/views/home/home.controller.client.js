(function (){
    "use strict";
    angular
        .module("BookReviewApp")
        .controller("HomePageController", HomePageController);

    function HomePageController(UserService, BookService, $sce) {
        var vm = this;
        vm.sampleBooks = {};


        function init() {
            //getCurrentUser();
            vm.sampleBooks = getBooksForHomePage();
            console.log("sample books")
            console.log(vm.sampleBooks)
        }

        return init();

        function getCurrentUser() {
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                })
        }

        function getBooksForHomePage() {
            BookService
                .getSampleBooks()
                .then(function(response) {
                    console.log("response data");
                    vm.sampleBooks = response.data.items.splice(1,6);
                    console.log(vm.sampleBooks);

                }, function (err) {
                    vm.error = err;
                })
        }

        function getBookDetails(bookId) {
            console.log(bookId)
            // Go to book details page
            $location.url("/book/"+bookId);
        }
    }
})();