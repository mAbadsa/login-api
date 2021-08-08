module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up new user',
  // Desfined the inputs with validation
  inputs: {
    username: {
      required: true,
      type: 'string',
      example: 'asd123',
      description: 'The user name.',
      unique: true,
    },

    email: {
      required: true,
      type: 'string',
      isEmail: true,
      unique: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      minLength: 6,
      example: 'passwordlol',
      description: 'The encrypted password to use for the new account.',
      regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/i,
    },
    age: {
      type: 'number',
      required: true,
      max: 50,
      min: 18,
    },
    role: {
      type: 'string',
      description: 'User\'s role, we have two user\' role either user or admin',
      isIn: ['user', 'admin']
    }
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

  fn: async function ({ username, email, password, age }) {
    const newEmail = email.toLowerCase();
    // Import initialize-database' function
    const db = sails.config.datastores.default.firebaseAdmin;

    // Make refs to specific collection
    const docRef = db().collection('users');

    // Get user data by email and username
    const isDocExistByEmail = await docRef.where('email', '==', newEmail).get();
    const isDocExistByUsername = await docRef
    .where('username', '==', username)
    .get();

    // Check if user is already exists by email or username
    if (isDocExistByEmail.size || isDocExistByUsername.size) {
      return this.res.status(409).json({
        statusCode: 409,
        description:
          'The provided username or email address is already in use.',
      });
    }

    // Add new user to the database
    await docRef.doc().set({
      username,
      email: newEmail,
      password: await sails.helpers.hashPassword(password),
      age,
      role: 'user',
    });

    // Return success response to the client
    this.res.status(201).json({
      success: true,
      message: 'User-created successfully!',
    });
  },
};
