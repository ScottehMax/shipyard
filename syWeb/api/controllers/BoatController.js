/**
 * BoatController
 *
 * @description :: Server-side logic for managing Boats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function getLastPullTime(boat, callback) {

  // find last pull time
  Log.findOne({
    where: {
      boat: boat.id,
      type: 'pull'
    },
    sort: 'createdAt DESC'
  }).exec(function(err, log) {
    if (err) {
      return res.json({
        error: err
      });
    }

    console.log(log);

    if (log !== undefined) {
      callback(log.createdAt);
    } else {
      callback(null);
    }

  });
}

function getUptime(boat, callback) {

  // find and calculate uptime
  Log.findOne({
    where: {
      boat: boat.id,
      type: 'up'
    },
    sort: 'createdAt DESC'
  }).exec(function(err, log) {
    if (err) {
      return res.json({
        error: err
      });
    }

    if (log !== undefined) {
      var currentTime = Date.now();
      var upAt = Date.parse(log.createdAt);
      var uptime = Math.floor((currentTime - upAt) / 1000);
      callback(uptime);
    } else {
      callback(null);
    }

  });

}

function getBoat(boatID){
  Boat.findOne({
    id: boatID
  }).exec(function(err, boat) {
    if (err) {
      return res.json({
        error: err
      });
    }

    if (boat === undefined) {
      return res.notFound();
    } else {
      var boatObj = {};
      boatObj.name = boat.name;
      boatObj.port = boat.port;
      boatObj.active = boat.active;

      // find last pull time
      Log.findOne({
        where: {
          boat: boat.id,
          type: 'pull'
        },
        sort: 'createdAt DESC'
      }).exec(function(err, log) {
        if (err) {
          return res.json({
            error: err
          });
        }

        console.log(log);

        if (log !== undefined) {
          boatObj.lastUpdated = log.createdAt;
        } else {
          boatObj.lastUpdated = null;
        }

        // find and calculate uptime
        Log.findOne({
          where: {
            boat: boat.id,
            type: 'up'
          },
          sort: 'createdAt DESC'
        }).exec(function(err, log) {
          if (err) {
            return res.json({
              error: err
            });
          }

          if (log !== undefined) {
            var currentTime = Date.now();
            var upAt = Date.parse(log.createdAt);
            var uptime = Math.floor((currentTime - upAt) / 1000);
            boatObj.uptime = uptime;
          } else {
            boatObj.uptime = null;
          }

          return boatObj;

        });

      });

    }
  });
}

module.exports = {

  get: function(req, res) {
    var boatID = req.param('id');
    return ret.json(getBoat(boatID));
  },

  getAll: function(req, res) {

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
          
          fleetOfBoats.push(getBoat(boat.id));

          console.log(fleetOfBoats);
        }
        return res.json(fleetOfBoats);
      }
    });
  }
};
