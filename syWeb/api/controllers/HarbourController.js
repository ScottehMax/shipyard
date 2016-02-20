/**
 * HarbourController
 *
 * @description :: Server-side logic for managing Harbours
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    var fleetOfBoats = [];

    Boat.find().exec(function(err, boats) {
      if (err) {
        return res.json({
          error: err
        });
      }

      if (boats === undefined) {
        return res.notFound();
      } else {

        for (var i = 0; i < boats.length; i++) {
          var boat = boats[i];

          boat.uptime = Math.floor((Date.now() - boat.lastUpdated) / 1000);

          fleetOfBoats.push(boat);
        }
        return res.view('homepage', {boats: fleetOfBoats});
      }
    });
  }
};
