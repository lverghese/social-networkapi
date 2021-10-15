const { Schema, model } = require('mongoose');


const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: 'You need to provide a username!',
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/]
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

//virtual called friendCount that retrives the length of the users friend array field on query

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;