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
            findAllUsers: findAllUsers,
            addFriend: addFriend,
            removeFriend: removeFriend,
            updateUser: updateUser,
            deleteUser: deleteUser,
            deleteAllUsers: deleteAllUsers,
            makeAdmin: makeAdmin,
            evictReader: evictReader,
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
            var url = '/api/checkLogin';
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

        function findAllUsers(adminId) {
            var url = '/api/admin/' + adminId + '/findAllUsers';
            return $http.get(url);
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

        function deleteAllUsers() {
            var url = '/api/admin/deleteAllUsers';
            return $http.delete(url);
        }

        function evictReader(user) {
            var url = '/api/admin/evictReader';
            return $http.post(url, user);
        }

        function makeAdmin(user) {
            var url = '/api/admin/makeAdmin';
            return $http.put(url, user);
        }

        function logout() {
            var url = '/api/logout';
            return $http.post(url);
        }

    }
})();