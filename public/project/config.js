(function () {
    angular
        .module ("MyBooks")
        .config (Configure);

    function Configure ($routeProvider) {
        $routeProvider
        // authentication routes
            .when ("/", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when ("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when ("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when ("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }

            })
            .otherwise ({
                redirectTo: "/"
            });
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };


})();