(function (){
    "use strict";
    angular
        .module("BookReviewApp")
        .controller("HomePageController", HomePageController);

    function HomePageController(UserService, BookService, $location) {
        var vm = this;
        vm.sampleBooks = {};
        vm.login = login;
        vm.navigateToSearchBooks = navigateToSearchBooks;


        function init() {
            //getCurrentUser();
            vm.sampleBooks = getBooksForHomePage();
            console.log("sample books")
            console.log(vm.sampleBooks)
        }

        function login(username, password) {
            UserService
                .login(username, password)
                .success(function (user) {
                    if ('0' === user) {
                        vm.error = "Invalid username or password";
                    } else {
                        $location.url("/user/" + user._id+"/home");
                    }
                })
                .error(function (e) {
                    vm.error = "Invalid username or password";
                    console.log(e);
                });
        }
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
            // Go to book details page
            $location.url("/book/"+bookId);
        }

        function navigateToSearchBooks() {
            $location.url("/book/search");

        }

        return init();
    }
})();