module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up new user',
  inputs: {
    username: {
      type: 'string',
      required: true,
      example: 'asd123',
      description: 'The user name.',
      unique: true,
    },
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },
    age: {
      type: 'number',
      max: 50,
      min: 18,
    },
  },

  exits: {
    success: {
      description: 'New user account was created successfully.',
    },

    invalid: {
      responseType: 'badRequest',
      description:
        'The provided fullName, password and/or email address are invalid.',
      extendedDescription:
        'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.',
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    usernameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided username address is already in use.',
    },
    age: {
      statusCode: 409,
      description: 'The provided age must be less than 50 and greater than 18.',
    },
  },

  fn: async function ({ email, username, age }) {
    const JWT = require('jsonwebtoken');
    let newEmail;
    let user = {};

    if (newEmail) {
      newEmail = email.toLowerCase();
    }

    console.log({ email, username, age });

    const db = sails.config.datastores.default.firebaseAdmin;
    const docRef = db().collection('users');

    const token = this.req.headers['x-access-token'].split(' ')[1];
    const decoded = await sails.helpers.verifying(token);
    console.log(decoded);
    // console.log(docRef.doc(decoded.userId));

    const userData = await docRef
      .where('username', '==', decoded.username)
      .get();

    userData.forEach((querySnapshot) => {
      user = {
        ...user,
        id: querySnapshot.id,
        username: querySnapshot._fieldsProto.username.stringValue,
        email: querySnapshot._fieldsProto.email.stringValue,
        password: querySnapshot._fieldsProto.password.stringValue,
        age:
          querySnapshot._fieldsProto.age.stringValue ||
          querySnapshot._fieldsProto.age.integerValue,
        role: querySnapshot._fieldsProto.role.stringValue,
      };
      // console.log(querySnapshot);
    });

    console.log({ user });

    if (user.username === username || user.email === email) {
      // return exits.invalid();
      return this.res.status(409).json({
        statusCode: 409,
        description:
          'The provided username or email address is already in used.',
      });
    }

    await docRef.doc(decoded.userId).update({
      ...user,
      username: username || user.username,
      email: email || user.email,
      age: age || user.age,
    });

    // await docRef.doc().update({
    //   ...user,
    //   username: user.username.stringValue || username,
    //   email: user.email.stringValue || email,
    //   age: user.age.integerValue || age,
    // });

    const userUpdated = await docRef.where('username', '==', username).get();

    userUpdated.forEach((querySnapshot) => {
      user = {
        ...user,
        id: querySnapshot.id,
        username: querySnapshot._fieldsProto.username.stringValue,
        email: querySnapshot._fieldsProto.email.stringValue,
        password: querySnapshot._fieldsProto.password.stringValue,
        age:
          querySnapshot._fieldsProto.age.stringValue ||
          querySnapshot._fieldsProto.age.integerValue,
        role: querySnapshot._fieldsProto.role.stringValue,
      };
      console.log(user);
    });

    console.log({ user });

    const newToken = await JWT.sign(
      { username: user.username, userId: user.id },
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

    this.res.status(200).cookie('token', newToken, options).json({
      success: true,
      message: 'User-updated successfully!',
    });
  },
};
