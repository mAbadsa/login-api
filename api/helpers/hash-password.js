module.exports = {
  friendlyName: 'Hash password',

  description: '',

  inputs: {
    password: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function ({ password }) {
    const bcrypt = require('bcrypt');
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  },
};
