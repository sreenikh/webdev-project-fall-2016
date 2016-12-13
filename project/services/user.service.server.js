module.exports = function (app, model) {
    "use strict";

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };

    app.use(session({
        secret: 'this is a secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/logout', logout);
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:uid', findUserById);
    app.post('/api/user/bulkFindUsersByIds', bulkFindUsersByIds);
    app.post('/api/user/:uid/findFriendsForUser', findFriendsForUser);
    app.post('/api/user/:uid/findAllMatchingNames', findAllMatchingNames);
    app.post('/api/user/:uid/addFriend', addFriend);
    app.post('/api/user/:uid/removeFriend', removeFriend);
    app.put('/api/user/:uid', loggedInAndSelf, updateUser);
    app.delete('/api/user/:uid', loggedInAndSelf, deleteUser);

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (error) {
                    done(error, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        return done(null, false);
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && bcrypt.compareSync(password, user.password)) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                },
                function (error) {
                    return done(error);
                }
            );
    }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.uid;
        var self = userId == req.user._id;
        if (self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("User not logged in");
        }
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model
                            .userModel
                            .createUser(newGoogleUser)
                            .then(
                                function (newUser) {
                                    createNecessaryBookshelves(newUser);
                                    return newUser;
                                },
                                function (error) {
                                    return error
                                }
                            );
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            lastName:  names[1],
                            firstName: names[0],
                            username: profile.username ? profile.username : names[0].toLowerCase() + '.' + names[1].toLowerCase(),
                            email:     profile.emails ? profile.emails[0].value : "",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model
                            .userModel
                            .createUser(newFacebookUser)
                            .then(
                                function (newUser) {
                                    createNecessaryBookshelves(newUser);
                                    return newUser;
                                },
                                function (error) {
                                    return error
                                }
                            );
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function createUser(req, res) {
        var user = req.body;
        user.password =  bcrypt.hashSync(user.password);
        model
            .userModel
            .findUserByUsername(user.username)
            .then(
                function (listOfExistingUsers) {
                    if (0 !== listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        model
                            .userModel
                            .createUser(user)
                            .then(
                                function (newUser) {
                                    createNecessaryBookshelves(newUser)
                                    res.send(newUser)
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function createNecessaryBookshelves(user) {
        var listOfBookshelfTypes = ['CURRENTLY_READING', 'READ', 'TO_READ'];
        var listOfBookshelfNames = ['Currently Reading', 'Previously Read', 'To Be Read'];
        for (var bt in listOfBookshelfTypes) {
            var bookshelfName = listOfBookshelfNames[bt];
            var bookshelfType = listOfBookshelfTypes[bt];
            var bookshelf = {name: bookshelfName, type: bookshelfType};
            model
                .bookshelfModel
                .createBookshelf(user._id, bookshelf);
        }
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        res.send(user);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && user.password === password) {
                            res.send(user);
                        } else {
                            res.send('0');
                        }
                    }
                }
            );
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        model
            .userModel
            .findUserById(uid)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function bulkFindUsersByIds(req, res) {
        var listOfUserIds = req.body.listOfUserIds;
        model
            .userModel
            .bulkFindUsersByIds(listOfUserIds)
            .then(
                function (listOfUsers) {
                    res.json(listOfUsers);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findFriendsForUser(req, res) {
        var userId = req.params.uid;
        model
            .userModel
            .findFriendsForUser(userId)
            .then(
                function (listOfFriends) {
                    res.json(listOfFriends);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllMatchingNames(req, res) {
        var searchText = req.body.searchText;
        model
            .userModel
            .findAllMatchingNames(searchText)
            .then(
                function (listOfUsers) {
                    res.json(listOfUsers);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function addFriend(req, res) {
        var existingUserId = req.params.uid;
        var newUserId = req.body._id;
        model
            .userModel
            .findFriendsForUser(existingUserId)
            .then(
                function (listOfFriends) {
                    var friendAlreadyExists = false;
                    for (var f in listOfFriends) {
                        var friend = listOfFriends[f];
                        if (newUserId == friend._id) {
                            friendAlreadyExists = true;
                        }
                    }
                    if (!friendAlreadyExists) {
                        model
                            .userModel
                            .addFriend(existingUserId, newUserId)
                            .then(
                                function (response) {
                                    res.send(true);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    } else {
                        res.send(false);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function removeFriend(req, res) {
        var existingUserId = req.params.uid;
        var newUserId = req.body._id;
        model
            .userModel
            .removeFriend(existingUserId, newUserId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.uid;
        var user = req.body;
        model
            .userModel
            .findUserById(userId)
            .then(
                function (existingUser) {
                    if (existingUser) {
                        if (existingUser.username === user.username) {
                            model
                                .userModel
                                .updateUser(userId, user)
                                .then(
                                    function (response) {
                                        res.send(true);
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        } else {
                            model
                                .userModel
                                .findUserByUsername(user.username)
                                .then(
                                    function (listOfExistingUsers) {
                                        if (0 === listOfExistingUsers.length) {
                                            model
                                                .userModel
                                                .updateUser(userId, user)
                                                .then(
                                                    function (response) {
                                                        res.send(true);
                                                    },
                                                    function (error) {
                                                        res.sendStatus(400).send(error);
                                                    }
                                                );
                                        } else {
                                            res.send(false);
                                        }
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        }
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.uid;
        model
            .userModel
            .deleteUser(userId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}