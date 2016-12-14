module.exports = function () {
    "use strict";

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var model = {};

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        bulkFindUsersByIds: bulkFindUsersByIds,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findAllMatchingNames: findAllMatchingNames,
        findBookshelfObjectIdsForUser: findBookshelfObjectIdsForUser,
        findFriendObjectIdsForUser: findFriendObjectIdsForUser,
        findFriendsForUser: findFriendsForUser,
        findAllUsers: findAllUsers,
        addFriend: addFriend,
        removeFriend: removeFriend,
        updateUser: updateUser,
        makeAdmin: makeAdmin,
        deleteUser: deleteUser,
        deleteAllUsers: deleteAllUsers,
        setModel: setModel
    };
    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function bulkFindUsersByIds(listOfUserIds) {
        return UserModel
            .find()
            .then(
                function (unwantedList) {
                    var count = 0;
                    var listOfUsers = [];

                    return recursiveFormationOfList(count, listOfUserIds, listOfUsers);

                    function recursiveFormationOfList(currentCount, inputListOfUserIds, userAccumulator) {
                        if (currentCount === inputListOfUserIds.length) {
                            return userAccumulator;
                        } else {
                            return UserModel
                                .findById(inputListOfUserIds[currentCount])
                                .then(
                                    function (user) {
                                        userAccumulator.push(user);
                                        return recursiveFormationOfList(currentCount + 1, inputListOfUserIds, userAccumulator);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }
                    }
                }
            );
    }

    function findUserByUsername(username) {
        return UserModel.find({username: username});
    }

    function findAllMatchingNames(name) {
        var searchJson = {$or: [{username: {'$regex': name, $options:'i'}},
            {firstName: {'$regex': name, $options:'i'}},
            {lastName: {'$regex': name, $options:'i'}}]};
        return UserModel.find(searchJson);
    }

    function findUserByCredentials(username, password) {
        return UserModel.find({username: username, password: password});
    }

    function findBookshelfObjectIdsForUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    return user.bookshelves;
                }
            );
    }

    function findFriendObjectIdsForUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    return user.friends;
                }
            );
    }

    function findFriendsForUser(userId) {
        return model
            .userModel
            .findFriendObjectIdsForUser(userId)
            .then(
                function (listOfFriendObjectIds) {
                    return UserModel
                        .find({_id: {$in: listOfFriendObjectIds}});
                },
                function (error) {
                }
            );
    }

    function findAllUsers() {
        return UserModel.find();
    }

    function addFriend(existingUserId, newUserId) {
        return UserModel
            .findById(existingUserId)
            .then(
                function (existingUser) {
                    existingUser.friends.push(newUserId);
                    return existingUser.save();
                }
            )
    }

    function removeFriend(existingUserId, newUserId) {
        return UserModel
            .findById(existingUserId)
            .then(
                function (existingUser) {
                    const index = existingUser.friends.indexOf(newUserId);
                    existingUser.friends.splice(index, 1);
                    return existingUser.save();
                }
            )
    }

    function updateUser(userId, user) {
        return UserModel
            .update({
                _id: userId
            }, {
                $set: {
                    username: user.username,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }});
    }

    function makeAdmin(userId) {
        return UserModel
            .update({
               _id: userId
            }, {
                $set: {
                    role: 'ADMIN'
                }
            });
    }

    function deleteUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    var count = 0;
                    var listOfBookshelfIds = [];

                    user.bookshelves.forEach(function (bookshelf) {
                        listOfBookshelfIds.push(bookshelf.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfBookshelves(count, listOfBookshelfIds);

                    function recursiveDeletionOfBookshelves(currentCount, inputListOfBookshelfIds) {
                        if (currentCount === inputListOfBookshelfIds.length) {
                            return UserModel.remove({_id: userId});
                        } else {
                            return model
                                .bookshelfModel
                                .deleteBookshelf(inputListOfBookshelfIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfBookshelves(currentCount + 1, inputListOfBookshelfIds);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }
                    }
                },
                function (error) {

                });
    }

    function deleteAllUsers() {
        return UserModel.remove();
    }

    function setModel(_model) {
        model = _model;
    }
};