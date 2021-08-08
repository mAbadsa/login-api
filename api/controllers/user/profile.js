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

    // Return success response with user data
    return this.res.status(200).json({
      success: true,
      user: {
        username: user.username.stringValue,
        email: user.email.stringValue,
        age: user.age.integerValue,
      },
    });
  },
};
