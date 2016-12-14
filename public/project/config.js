(function() {
    angular
        .module("BookReviewApp")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
        // authentication routes
            .when ("/", {
                templateUrl: "views/home/public.home.view.client.html",
                controller: "HomePageController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                   checkLogin: checkLogin
                }
            })
            .when("/user/:uid/home", {
                templateUrl: "views/user/user.home.view.client.html",
                controller: "UserHomeController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }

            })
            .when("/admin/:aid/option", {
                templateUrl: "views/user/admin-option-list.view.client.html",
                controller: "AdminOptionsListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/admin/:aid/option/:oid", {
                templateUrl: "views/user/admin-option.view.client.html",
                controller: "AdminOptionsController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/bookshelf", {
                templateUrl: "views/bookshelf/bookshelf-list.view.client.html",
                controller: "BookshelfListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/friend", {
                templateUrl: "views/friend/friend-list.view.client.html",
                controller: "FriendsListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/message", {
                templateUrl: "views/message/message-list.view.client.html",
                controller: "MessageListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/message/:fid", {
                templateUrl: "views/message/message-chat.view.client.html",
                controller: "MessageChatController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/friends", {
                templateUrl: "views/friends/friends.list.view.client.html",
                controller: "FriendsListController",
                controllerAs: "model"
            })
            .when("/user/:uid/bookshelf/:bsid/book", {
                templateUrl: "views/book/book-list.view.client.html",
                controller: "BookListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/book/search", {
                templateUrl: "views/book/book-search.view.client.html",
                controller: "BookSearchController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/book/search", {
                templateUrl: "views/book/public-book-search.view.client.html",
                controller: "PublicBookSearchController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/book/info/:googleBookId", {
                templateUrl: "views/book/book-info.view.client.html",
                controller: "BookInfoController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/book/info/:googleBookId", {
                templateUrl: "views/book/public-book-info.view.client.html",
                controller: "PublicBookInfoController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid/bookshelf/:bsid/book/:bid", {
                templateUrl: "views/book/book.view.client.html",
                controller: "BookController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .otherwise({
                redirectTo: "/login"
            });

        function checkLogin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if (user !== '0') {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                            $location.url("/login");
                        }
                    }
                );
            return deferred.promise;
        }
    }
})();