module.exports = function (app, model) {
    "use strict";

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    //var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    /*var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };*/

    //Client ID : 84139842365-b2lfd7cshbdtsdihbhl2c54i3vnqfvet.apps.googleusercontent.com
    //Cliend URL: KWM1H-JrhxRNTIH_pICulBeR

    app.use(session({
        secret: 'this is a secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(localStrategy));
    //passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/logout', logout);
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

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
            .findUserByCredentials(username, password)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        return done(null, false);
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && user.password === password) {
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
                                    var listOfBookshelfTypes = ['CURRENTLY_READING', 'READ', 'TO_READ'];
                                    var listOfBookshelfNames = ['Currently Reading', 'Previously Read', 'To Be Read'];
                                    for (var bt in listOfBookshelfTypes) {
                                        var bookshelfName = listOfBookshelfNames[bt];
                                        var bookshelfType = listOfBookshelfTypes[bt];
                                        var bookshelf = {name: bookshelfName, type: bookshelfType};
                                        model
                                            .bookshelfModel
                                            .createBookshelf(newUser._id, bookshelf);
                                    }
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


    function findUser(req, res) {
        var query = req.query;
        if(query.password && query.username) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
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

};