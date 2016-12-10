(function () {
    angular
        .module("BookReviewApp")
        .controller("HomePageController", HomePageController);

    function HomePageController(UserService, GoogleBooksService, $location) {
        var vm = this;
        vm.getBookDetails = getBookDetails;

        function init() {
            UserService
                .checkLogin()
                .success(function (user) {
                    if(user != '0'){
                        vm.loggedIn = true;
                        vm.currentUser = user;
                    } else{
                        vm.loggedIn = false;
                    }
                })
                .error(function (error) {

                });
            GoogleBooksService
                .getNewReleasedBooks()
                .success(function (newReleases) {
                    vm.newReleases = newReleases.items.splice(0,6);
                })
                .then(function (error) {
                });
        }
        init();

        function getBookDetails(bookId) {
            $location.url("/book/"+bookId);
        }
    }
})();