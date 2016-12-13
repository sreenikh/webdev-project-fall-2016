(function () {
    "use strict";

    angular
        .module("BookReviewApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("UserHomeController", UserHomeController);

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
                        $location.url("/user/" + newlyCreatedUser._id);
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
})();