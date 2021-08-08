module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up new user',
  inputs: {
    username: {
      required: true,
      type: 'string',
      example: 'asd123',
      description: 'The user name.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.',
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

  fn: async function ({ password, username }, exits) {},
};
