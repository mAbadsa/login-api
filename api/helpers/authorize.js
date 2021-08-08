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

  fn: async (role) => (req, res, next) => {
    if (req.user.role !== 'admin' || !role) {
      return next(
        `User role ${req.user.role} is not authorized to access this roles`
      );
    }
    next();
  },
};
