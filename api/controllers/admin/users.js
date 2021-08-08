module.exports = {
  friendlyName: 'Get profile',

  description: 'Get loged in user profile.',

  exits: {
    success: {
      descriprion: 'User is authorized',
    },

    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect',
    },
  },

  fn: async function () {
    //Connect to database
    const db = sails.config.datastores.default.firebaseAdmin;
    const docRef = db().collection('users');
    const limit = +this.req.query.limit;

    // Get token from request header
    const token = this.req.headers['authorization'].split(' ')[1];

    // verifying token
    const decoded = await sails.helpers.verifying(token);

    // Check if token is correct
    if (!decoded) {
      this.res
        .status(401)
        .json({ success: false, message: 'User unathorized!' });
    }

    // Fetch user from database
    const getUserByUsername = await docRef
      .where('username', '==', decoded.username)
      .get();

    let user;

    // Check if user is exist
    if (!getUserByUsername.size) {
      return this.res
        .status(400)
        .json({ success: true, message: 'User not exists!' });
    }

    // Put user data into user object
    getUserByUsername.forEach((querySnapshot) => {
      user = querySnapshot._fieldsProto;
    });

    try {
      await sails.helpers.authorize(user.role.stringValue);
    } catch (error) {
      return this.res.status(403).json({
        success: false,
        message: error.cause.raw || 'sometheng went wrong!',
      });
    }

    const documentQuery = await docRef.limit(limit).get();

    let users = [];
    documentQuery.forEach((user) => {
      users.push({
        id: user.id,
        username: user._fieldsProto.username.stringValue,
        email: user._fieldsProto.email.stringValue,
        age:
          user._fieldsProto.age.integerValue ||
          user._fieldsProto.age.stringValue,
      });
    });

    // Return success response with user data
    return this.res.status(200).json({
      success: true,
      users,
    });
  },
};
