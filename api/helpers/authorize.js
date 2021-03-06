module.exports = {
  friendlyName: 'Admin authorized',

  description: 'Authorized to access to all user data.',

  inputs: {
    role: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async ({ role }) => {
    if (role !== 'admin' || !role) {
      throw `User role ${role} is not authorized to access this roles`;
    } else {
      return;
    }
  },
};
