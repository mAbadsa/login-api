module.exports = {
  friendlyName: 'Auth',

  description: 'Auth something.',

  inputs: {
    token: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function ({ token }) {
    const util = require('util');
    const JWT = require('jsonwebtoken');

    const verifying = util.promisify(JWT.verify);

    let decoded = await verifying(token, sails.config.custom.JWT_SECRET_KEY);

    return decoded;
    // TODO
  },
};
