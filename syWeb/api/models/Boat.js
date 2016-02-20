/**
* Boat.js
*/

module.exports = {

    attributes: {
        name: {
            type: 'string'
        },

        port: {
            type: 'integer'
        },

        active: {
            type: 'boolean'
        },

        gitUrl: {
            type: 'string'
        },

        owner: {
            model: 'user'
        }
    }
};
