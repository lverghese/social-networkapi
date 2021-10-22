const { User } = require('../models');

const userController = {
    //get all users
    getAllUsers(req, res) {
      User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    //get User by ID with thoughts and friends
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
         .populate({
             path: 'thoughts',
             select: '-__v'
          })
          .populate ({
              path: 'friends',
              select: '-__v'
          })
         .select('-__v')
         .then((dbUserData) => {
          // If no user is found
          if (!dbUserData) {
            res.status(404).json({ message: "No user found with this ID" });
            return;
          }
          res.json(dbUserData);
        })
         .catch(err => {
             console.log(err)
             res.status(400).json(err)
      });
   },

    //create new user
    createUser({ body }, res) {
        User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
    },

    //update a user
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
    },

    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    //add friend to users friend list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            // add user to friend's friend list
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserDataTwo => {
                if(!dbUserDataTwo) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },

    //remove friend 
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            // remove user from friend's friend list
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData2 => {
                if(!dbUserData2) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json({message: 'Successfully deleted the friend'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
}



module.exports = userController;