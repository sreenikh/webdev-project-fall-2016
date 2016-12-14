(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("UserHomeController", UserHomeController)
        .controller("AdminOptionsListController", AdminOptionsListController)
        .controller("AdminOptionsController", AdminOptionsController);

    // vm means view model
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        /*function login(username, password) {
         UserService
         .findUserByCredentials(username, password)
         .success(function (user) {
         if ('0' === user) {
         vm.error = "Invalid username or password";
         } else {
         $location.url("/user/" + user._id);
         }
         })
         .error(function (e) {
         console.log(e);
         });
         }*/
        function login(username, password) {
            UserService
                .login(username, password)
                .success(function (user) {
                    if ('0' === user) {
                        vm.error = "Invalid username or password";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (e) {
                    vm.error = "Invalid username or password";
                    console.log(e);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, firstName, lastName, password1, password2, email, phone) {
            if (null === username || "" === username || undefined === username) {
                vm.usernameError = "Username cannot be empty";
                return;
            }
            if (null === firstName || "" === firstName || undefined === firstName) {
                vm.firstNameError = "First name cannot be empty";
                return;
            }
            if (undefined === password1 || undefined === password2 ||
                null === password1 || null === password2 ||
                "" === password1 || "" === password2) {
                vm.passwordError = "Empty Password(s)";
                document.getElementById("password1").value="";
                document.getElementById("password2").value="";
                return;
            }
            if (password1 !== password2) {
                vm.passwordError = "Passwords don't match!";
                document.getElementById("password1").value="";
                document.getElementById("password2").value="";
                return;
            }
            var user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password1,
                email: email,
                phone: phone
            };
            UserService
                .createUser(user)
                .success(function (newlyCreatedUser) {
                    if ('0' == newlyCreatedUser) {
                        vm.usernameError = "Username already exists. Try a different one.";
                        document.getElementById("username").value = "";
                        document.getElementById("password1").value = "";
                        document.getElementById("password2").value = "";
                    } else {
                        //$location.url("/user/" + newlyCreatedUser._id);
                        UserService
                            .login(newlyCreatedUser.username, password1)
                            .success(function (loggedInUser) {
                                if ('0' === loggedInUser) {
                                    vm.error = "Invalid username or password";
                                } else {
                                    $location.url("/user/" + loggedInUser._id);
                                }
                            })
                            .error(function (e) {
                                vm.error = "Invalid username or password";
                                console.log(e);
                            });
                    }
                })
                .error(function (error) {

                });

        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.enlistBookshelves = enlistBookshelves;
        vm.enlistFriends = enlistFriends;
        vm.saveProfile = saveProfile;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToListOfFriends = navigateToListOfFriends;
        vm.navigateToMessages = navigateToMessages;
        vm.navigateToAdminOptions = navigateToAdminOptions;
        vm.unregisterUser = unregisterUser;
        vm.logout = logout;

        var userId = $routeParams.uid;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    if ('0' !== user) {
                        vm.user = user;
                    }
                })
                .error(function (error) {
                });
        }
        init();

        function enlistBookshelves(user) {
            console.log(user);
            if (null !== user) {
                $location.url("/user/" + user._id + "/bookshelf");
            }
        }

        function enlistFriends(user) {
            if (null !== user) {
                $location.url("/user/" + user._id + "/friend");
            }
        }

        function saveProfile(user) {
            if (null === username || "" === username || undefined === username) {
                vm.usernameError = "Username cannot be empty";
                return;
            }
            UserService
                .updateUser(userId, user)
                .success(function (response) {
                    console.log(response);
                    if ('0' === response) {
                        alert("Update failed");
                    } else if (true === response) {
                        alert("Update was successful");
                    } else if (false === response) {
                        alert("User name exists. Please choose a different one.");
                        init();
                    }
                })
                .error(function (error) {
                });
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function navigateToListOfFriends(user) {
            $location.url("/user/" + userId + "/friend");
        }

        function navigateToMessages(user) {
            $location.url("/user/" + userId + "/message");
        }

        function navigateToAdminOptions(user) {
            $location.url("/admin/" + userId + "/option");
        }

        function unregisterUser(user) {
            UserService
                .deleteUser(user._id)
                .success(function (response) {
                    $location.url("/login");
                    if (true === response) {
                        alert("User unregistered");
                    } else {
                        alert("User was not unregistered");
                    }
                })
                .error(function (error) {
                })
        }

        function logout() {
            UserService
                .logout()
                .success(function () {
                    $location.url("/login");
                })
        }
    }
    function UserHomeController($routeParams, $location, UserService) {
        var vm = this;
        vm.enlistBookshelves = enlistBookshelves;
        vm.enlistFriends = enlistFriends;
        vm.saveProfile = saveProfile;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToListOfFriends = navigateToListOfFriends;
        vm.navigateToMessages = navigateToMessages;
        vm.unregisterUser = unregisterUser;
        vm.logout = logout;

        var userId = $routeParams.uid;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    if ('0' !== user) {
                        vm.user = user;
                    }
                })
                .error(function (error) {
                });
        }
        init();

        function enlistBookshelves(user) {
            console.log(user);
            if (null !== user) {
                $location.url("/user/" + user._id + "/bookshelf");
            }
        }

        function enlistFriends(user) {
            if (null !== user) {
                $location.url("/user/" + user._id + "/friend");
            }
        }

        function saveProfile(user) {
            if (null === username || "" === username || undefined === username) {
                vm.usernameError = "Username cannot be empty";
                return;
            }
            UserService
                .updateUser(userId, user)
                .success(function (response) {
                    console.log(response);
                    if ('0' === response) {
                        alert("Update failed");
                    } else if (true === response) {
                        alert("Update was successful");
                    } else if (false === response) {
                        alert("User name exists. Please choose a different one.");
                        init();
                    }
                })
                .error(function (error) {
                });
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function navigateToListOfFriends(user) {
            $location.url("/user/" + userId + "/friend");
        }

        function navigateToMessages(user) {
            $location.url("/user/" + userId + "/message");
        }

        function unregisterUser(user) {
            UserService
                .deleteUser(user._id)
                .success(function (response) {
                    $location.url("/login");
                    if (true === response) {
                        alert("User unregistered");
                    } else {
                        alert("User was not unregistered");
                    }
                })
                .error(function (error) {
                })
        }

        function logout() {
            UserService
                .logout()
                .success(function () {
                    $location.url("/login");
                })
        }
    }

    function AdminOptionsListController($routeParams, $location, UserService, BookshelfService, BookService, MessageService, ReviewService) {
        var vm = this;

        var adminId = $routeParams['aid'];

        var options = [
            {text: "Manage all readers", optionIndex: 0},
            {text: "Purge Messages", optionIndex: 1},
            {text: "Purge Reviews", optionIndex: 2},
            {text: "Clear DB completely", optionIndex: 3}
        ];

        vm.options = options;
        vm.submitOption = submitOption;

        function submitOption(optionIndex) {
            if (0 == optionIndex) {
                $location.url("/admin/" + adminId + "/option/" + optionIndex);
            } else if (1 == optionIndex) {
                MessageService
                    .deleteAllMessages()
                    .success(function (response) {
                        alert("All messages purged!");
                    })
                    .error(function (error) {
                    });
            } else if (2 == optionIndex) {
                ReviewService
                    .deleteAllReviews()
                    .success(function (response) {
                        alert("All reviews purged!");
                    })
                    .error(function (error) {
                    });
            } else if (3 == optionIndex) {
                UserService.deleteAllUsers();
                BookshelfService.deleteAllBookshelves();
                BookService.deleteAllBooks();
                MessageService.deleteAllMessages();
                ReviewService.deleteAllReviews();
                $location.url("/");
            }
        }
    }

    function AdminOptionsController($routeParams, $location, UserService) {
        var vm = this;
        var adminId = $routeParams['aid'];
        var optionIndex = $routeParams['oid'];

        vm.allEntities = [];
        vm.searchResults = [];
        vm.search = search;
        vm.makeAdmin = makeAdmin;
        vm.evictReader = evictReader;

        function init(optionIndex) {
            if (0 == optionIndex) {
                UserService
                    .findAllUsers()
                    .success(function (listOfAllUsers) {
                        vm.allEntities = listOfAllUsers;
                    })
                    .error(function (error) {
                    });
            }
        }
        init(optionIndex);

        function search(searchText) {
            if (0 == optionIndex) {
                UserService
                    .findAllMatchingNames(adminId, searchText)
                    .success(function (listOfUsers) {
                        vm.searchResults = listOfUsers;
                    })
                    .error(function (error) {
                    });
            }
        }

        function makeAdmin(user) {
            UserService
                .makeAdmin(user)
                .success(function (response) {
                    alert("Admin rights provided!");
                    init(optionIndex);
                })
                .error(function (error) {
                });
        }

        function evictReader(user) {
            UserService
                .evictReader(user)
                .success(function (response) {
                    alert("Reader deleted!");
                    init(optionIndex);
                })
                .error(function (error) {
                });
        }
    }
})();