module.exports = {
  friendlyName: 'Signup',
  description: 'Sign up new user',
  inputs: {
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
  },

  fn: async function (inputs) {},
};
