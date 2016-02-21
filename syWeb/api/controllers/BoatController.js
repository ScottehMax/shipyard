/**
 * BoatController
 *
 * @description :: Server-side logic for managing Boats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Git = require("nodegit");
const exec = require('child_process').spawn; // scary!

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
      return {
        error: err
      };
    }

    if (boat === undefined) {
      return {};
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
          return {};
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
            return {};
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

  create: function(req,res) {
    // create boat object
    Boat.create({
      name: req.param('boat_name'),
      active: false,
      giturl: req.param('boat_giturl'),
      lastUpdated: Date.now()
    }, function(err, entry){
      //create dir for id
      try {
          stats = fs.lstatSync('./apps/'+entry.id);
          if (!stats.isDirectory()) {

              console.log(entry.id + ' is a file, removing it and making a directory');
              // >: (
              exec('rm apps/'+entry.id);
              exec('mkdir apps/'+entry.id);
          }
      }
      catch (e) {
          // doesn't exist tbh
          console.log('Folder ' + entry.id + ' does not exist, creating...');
          exec('mkdir apps/'+entry.id);
      }

      // MAN THE DECK BOYS, WE'RE COMING INTO THE HARBOUR
      Git.Clone(entry.giturl, './apps/' + id).then(function(repository) {
        // Start server
        var foreverstart = spawn('forever', ['start', 'app.js'], {'cwd': './apps/' + id});
        foreverstart.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
      }).catch(function (reasonForFailure) {
        // failed, delete directory and object
        exec('rm apps/'+entry.id);
        Boat.destroy({id:entry.id}, function(err, done){
          if (err) return res.json({error: err});
          return res.json({error: reasonForFailure});
        });
      }).done(function (reasonForFailure) {
        // failed, delete directory and object
        exec('rm apps/'+entry.id);
        Boat.destroy({id:entry.id}, function(err, done){
          if (err) return res.json({error: err});
          return res.json({error: reasonForFailure});
        });
      });
    });
  },

  get: function(req, res) {
    var boatID = req.param('id');
    return res.json(getBoat(boatID));
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

		  boat.uptime = Math.floor((Date.now() - boat.lastUpdated)/1000);

          fleetOfBoats.push(boat);

          console.log(fleetOfBoats);
        }
        return res.json(fleetOfBoats);
      }
    });
  }
};
