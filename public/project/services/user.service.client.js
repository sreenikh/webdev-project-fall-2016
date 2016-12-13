(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .factory("UserService", UserService);

    function UserService($http) {
        var api = {
            createUser: createUser,
            login: login,
            checkLogin: checkLogin,
            findUserById: findUserById,
            bulkFindUsersByIds: bulkFindUsersByIds,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            findAllMatchingNames: findAllMatchingNames,
            findFriendsForUser: findFriendsForUser,
            addFriend: addFriend,
            removeFriend: removeFriend,
            updateUser: updateUser,
            deleteUser: deleteUser,
            logout: logout
        };
        return api;

        function createUser(user) {
            var url = '/api/user';
            return $http.post(url, user);
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            };
            var url = '/api/login';
            return $http.post(url, user);
        }

        function checkLogin() {
            var url = '/api/v';
            return $http.post(url);
        }

        function findUserById(userId) {
            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function bulkFindUsersByIds(listOfUserIds) {
            var requestJson = {listOfUserIds: listOfUserIds}
            var url = '/api/user/bulkFindUsersByIds';
            return $http.post(url, requestJson);
        }

        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function findAllMatchingNames(userId, searchText) {
            var requestBody = {searchText: searchText};
            var url = '/api/user/' + userId + '/findAllMatchingNames';
            return $http.post(url, requestBody);
        }

        function findFriendsForUser(userId) {
            var url = '/api/user/' + userId + '/findFriendsForUser';
            return $http.post(url);
        }

        function addFriend(existingUserId, newUser) {
            var url = '/api/user/' + existingUserId + '/addFriend';
            return $http.post(url, newUser)
        }

        function removeFriend(existingUserId, newUser) {
            var url = '/api/user/' + existingUserId + '/removeFriend';
            return $http.post(url, newUser)
        }

        function updateUser(userId, user) {
            var url = '/api/user/' + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = '/api/user/' + userId;
            return $http.delete(url);
        }

        function logout() {
            var url = '/api/logout';
            return $http.post(url);
        }

    }
})();