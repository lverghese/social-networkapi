const router = require('express').Router();

const {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
    getAllUsers
  } = require('../../controllers/user-controller');

// Set up GET all and POST at /api/users
router
.route('/')
.get(getAllUsers)
.post(createUser);

// Set up GET one, PUT, and DELETE at /api/users/:id
router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);


//friend routes with /api/users/:userId/friends/:friendId
router
.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(removeFriend)


module.exports = router;