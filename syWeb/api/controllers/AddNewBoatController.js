/**
 * AddNewBoatController
 *
 * @description :: Server-side logic for managing AddNewBoat
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    index: function(req, res) {
        return res.view('addNewBoatForm');
    }
};
