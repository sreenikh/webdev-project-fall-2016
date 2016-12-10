(function () {
    "use strict";
    angular
        .module("BookReviewApp")
        .controller("FriendsListController", FriendsListController);

    function FriendsListController($routeParams, $location) {
        var vm = this;
        vm.enlistFriends = enlistFriends;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToSearchFriends = navigateToSearchFriends;

        var userId = $routeParams['uid'];

        function init() {

            vm.friends = enlistFriends() ;

        }
        init();

        function enlistFriends() {
            return $location.url("/user/" + userId + "/friends/");
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function navigateToSearchFriends() {
            $location.url("/user/" + userId + "/friends/search");
        }
    }
})();