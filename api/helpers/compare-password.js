module.exports = {
  friendlyName: 'Compare password',

  description: '',

  inputs: {
    password: {
      type: 'string',
      required: true,
    },
    hashedPassword: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function ({ password, hashedPassword }) {
    const bcrypt = require('bcrypt');
    console.log({ password });
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  },
};
