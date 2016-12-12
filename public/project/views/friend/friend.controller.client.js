(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("FriendsListController", FriendsListController);

    function FriendsListController($routeParams, $location, UserService) {
        var vm = this;
        vm.navigateToProfile = navigateToProfile;
        vm.searchForFriends = searchForFriends;
        vm.navigateToMessageFriend = navigateToMessageFriend;
        vm.addFriend = addFriend;
        vm.removeFriend = removeFriend;
        vm.enlistFriends = enlistFriends;

        var userId = $routeParams['uid'];

        vm.friends = [];
        vm.searchResults = [];

        function init() {
            UserService
                .findFriendsForUser(userId)
                .success(function (listOfFriends) {
                    vm.friends = listOfFriends;
                })
                .error(function (error) {
                });
        }
        init();

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function enlistFriends() {

        }

        function searchForFriends(searchText) {
            if (undefined !== searchText && null !== searchText && "" !== searchText) {
                UserService
                    .findAllMatchingNames(userId, searchText)
                    .success(function (listOfUsers) {
                        vm.searchResults = listOfUsers;
                    })
                    .error(function (error) {
                    });
            } else {
                vm.searchResults = [];
            }
        }

        function navigateToMessageFriend(friend) {
            $location.url("/user/" + userId + "/message/" + friend._id);
        }

        function addFriend(newUser) {
            if (userId !== newUser) {
                UserService
                    .addFriend(userId, newUser)
                    .success(function (response) {
                        document.getElementById("searchText").value = "";
                        vm.searchResults = [];
                        init();
                    })
                    .error(function (error) {
                    });
            }
        }

        function removeFriend(friend) {
            UserService
                .removeFriend(userId, friend)
                .success(function (response) {
                    $location.url("/user/" + userId + "/friend")
                })
                .error(function (error) {
                });
        }
    }
})();