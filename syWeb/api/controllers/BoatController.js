/**
 * BoatController
 *
 * @description :: Server-side logic for managing Boats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const spawnSync = require('child_process').spawnSync; // scary!

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
    // check if valid git repo
    try {
      console.log("[ADD] Checking validity of " + req.param('boat_giturl'));
      spawnSync('git', ['ls-remote', '--exit-code', -'h', req.param('boat_giturl')], {'cwd': './apps'});
      console.log("[ADD] Repo is valid");
    } catch(e) {
      res.json({error: 'Repo invalid: ' + e});
    }
    // create boat object
    Boat.create({
      name: req.param('boat_name'),
      active: false,
      giturl: req.param('boat_giturl'),
      mainAppFile: req.param('boat_main_app_file'),
      lastUpdated: new Date()
    }, function(err, entry){
        if (err){
            return res.send(err);
        }
        //console.log(entry);
      //create dir for id
      try {
          stats = fs.lstatSync('./apps/'+entry.id);
          if (!stats.isDirectory()) {

              console.log(entry.id + ' is a file, removing it and making a directory');
              // >: (
              spawnSync('rm', ['apps/'+entry.id]);
              spawnSync('mkdir', ['apps/'+entry.id]);
          }
      }
      catch (e) {
          // doesn't exist tbh
          console.log('Folder ' + entry.id + ' does not exist, creating...');
          spawnSync('mkdir', ['apps/'+entry.id]);
          console.log("Created the folder");
      }

      // MAN THE DECK BOYS, WE'RE COMING INTO THE HARBOUR
      try {
        try {
          // Clone git
          console.log("[ADD] Cloning repo");
          spawnSync('git', ['clone', entry.giturl, entry.id], {'cwd': './apps'});
          console.log("Cloned the repo");
        } catch(e) {
          spawnSync('rm', ['-rf', 'apps/'+entry.id]);
          Boat.destroy({id:entry.id}, function(err, done){
            if (err) return res.json({error: err});
            return res.json({error: 'Couldn\'t clone repo: ' + e});
          });
        }

        try {
          // install dependencies
          spawnSync('npm', ['install'], {'cwd': './apps/' + entry.id});
          console.log("Installed dependencies");
        } catch(e) {
          spawnSync('rm', ['-rf', 'apps/'+entry.id]);
          Boat.destroy({id:entry.id}, function(err, done){
            if (err) return res.json({error: err});
            return res.json({error: 'Couldn\'t install dependencies: ' + e});
          });
        }

        // Create log entry, code has been downloaded
        Log.create({
          type: 'pull',
          message: 'HMS ' + entry.name + ' has been built and is almost ready for sailing.',
          boat: entry.id
        }, function(err,newLog){
          if (err) return res.json({error: 'Error cloning repo:' + e});

          try {
            // Start server
            spawnSync('forever', ['start', 'app.js'], {'cwd': './apps/' + entry.id});
          } catch(e) {
            spawnSync('rm', ['-rf', 'apps/'+entry.id]);
            Boat.destroy({id:entry.id}, function(err, done){
              if (err) return res.json({error: err});
              return res.json({error: 'Couldn\'t start server: ' + e});
            });
          }

          // Create log entry, server is up
          Log.create({
            type: 'up',
            message: 'The good ship ' + entry.name + ' is sailing.',
            boat: entry.id
          }, function(err,newLog){
            return res.json({success: 'YAY'});
          });
        });
      } catch (e){
        // failed, delete directory and object
        console.log(e);
        spawnSync('rm', ['-rf', 'apps/'+entry.id]);
        Boat.destroy({id:entry.id}, function(err, done){
          if (err) return res.json({error: err});
          return res.json({error: e});
        });
      }
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
