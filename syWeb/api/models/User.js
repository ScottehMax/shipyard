/**
* User.js
*
* @description :: This model represents the User entity
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true
        },

        password: {
            type: 'string',
            required: true
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },

        name: {
            type: 'string',
            required: true
        },

        email: {
            type: 'string'
        }
    },

    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else{
                    user.password = hash;
                    cb(null, user);
                }
            });
        });
    }
};
