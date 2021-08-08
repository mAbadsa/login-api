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

    password: {
      type: 'string',
      maxLength: 200,
      minLength: 6,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.',
      regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/i,
    },
    age: {
      type: 'number',
      max: 50,
      min: 18,
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

  fn: async function (inputs) {},
};
