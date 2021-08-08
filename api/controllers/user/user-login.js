module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up new user',
  inputs: {
    username: {
      required: true,
      type: 'string',
      example: 'asd123',
      description: 'The username to use for the login account.',
    },

    password: {
      required: true,
      type: 'string',
      example: 'passwordlol',
      description: 'The unencrypted password to use for the login account.',
    },
  },

  exits: {
    success: {
      description: 'User login successfully.',
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided username and/or password are invalid.',
      extendedDescription:
        'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.',
    },
  },

  fn: async function ({ password, username }, exits) {
    const JWT = require('jsonwebtoken');

    const db = sails.config.datastores.default.firebaseAdmin;

    const docRef = db().collection('users');

    // Get user by username
    const isDocExistByUsername = await docRef
    .where('username', '==', username)
    .get();

    // Check is this user was registerd
    if (!isDocExistByUsername.size) {
      return this.res.status(400).json({
        success: false,
        message: 'User not exists',
      });
    }

    let user = {};

    // Get user data and add it to the user object
    isDocExistByUsername.forEach((querySnapshot) => {
      user = { ...user, ...querySnapshot._fieldsProto, id: querySnapshot.id };
    });

    // Check if the password is correct
    const isMatch = await sails.helpers
      .comparePassword(password, user.password.stringValue)
      .intercept('password', 'Passwort not match!');

    if (!isMatch) {
      return this.res.status(401).json({
        success: false,
        message: 'Passwprd not match!'
      });
    }

    // Sign token with user data
    const token = await JWT.sign(
      { username: user.username.stringValue, userId: user.id },
      sails.config.custom.JWT_SECRET_KEY,
      {
        expiresIn: sails.config.custom.JWT_EXPIRE,
      }
    );

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    // Return success response to the client
    this.res
      .status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        status: 200,
        message: 'User login successfully.',
        token,
        user: {
          username: user.username.stringValue,
          email: user.email.stringValue,
          age: user.age.stringValue,
          role: user.role.stringValue
        },
      });
  },
};
