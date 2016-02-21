/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
var util  = require('util');
var spawnSync = require('child_process').spawnSync;
var spawn = require('child_process').spawn;

function getAllBoats(callback) {

    return http.get({
        host: '',
        path: '/boat/getAll',
        port: 1337
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);

            console.log("Before callback");

            callback(parsed);
        });
    });

}

module.exports = {
    checkActivityStatus: function(req,res){
        getAllBoats(function(boats) {
            console.log("In end of callback");
            console.log("boats: ", boats);

            var isActiveArray = [];

            console.log("boats: ", boats);
            console.log("boats.length: ", boats.length);

            for (var i = 0; i < boats.length; i++) {
              var boat = boats[i];

              //console.log("boat: ", boat);

              //ps = spawnSync('ps', ['aux', '|', 'grep', '/apps/'+boat.id+'/'+boat.mainAppFile, '|', 'wc', '-l', '|', '{', 'read', 'wc;', 'test', '$wc', '-gt', '1', '&&', 'echo', '"1"', '||', 'echo', '"0";', '}']); // runs the activity check

              //const ps=spawnSync('ls', ['-lh', '/usr']); // runs the 'ls -lh /usr' shell cmd

              //ps.stdout.on('data', function(data) { // handler for output on STDOUT
            //      console.log('stdout: '+data);
              //});

              console.log("");
              console.log("boat.id: ", boat.id);
              console.log("boat.name: ", boat.name);
              console.log("boat.mainAppFile: ", boat.mainAppFile);

              var idAndMainApp = '/apps/'+boat.id+'/'+boat.mainAppFile;

              var longString = "aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile;
              //var longString = "aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile + "\" | wc -l";
              //var longString = "ps aux | grep \"/apps/" + boat.id+ "/" + boat.mainAppFile + "\" | wc -l | { read wc; test $wc -gt 2 && echo \"true\" || echo \"false\"; }";

              var longStringSplit = longString.split(" ");

              console.log("longString: ", longString);
              console.log("longStringSplit: ", longStringSplit);

              var util = require('util');

              //console.log("idAndMainApp: ", idAndMainApp);

                function run(callback) {
                    var spawn = require('child_process').spawn;
                    var command = spawn('ps', ["aux"]);
                    var result = '';
                    command.stdout.on('data', function(data) {
                        result += data.toString();
                        console.log("Result in stdout: ", "abcdef");
                    });

                    command.on('close', function(code) {
                        console.log("Result in close: ", "abcdef2");

                        callback(result);
                    });
                }

                run(function(result) { console.log("Active: ", "resultOutside"); });
                //*/


                /*
                exec = require('child_process').exec, child;

                child = exec(longString, // command line argument directly in string
                  function (error, stdout, stderr) {      // one easy function to capture data/errors
                      console.log("boat.id: ", boat.id);
                      console.log("boat.name: ", boat.name);
                    console.log('stdout: ' + stdout);
                    //console.log('stderr: ' + stderr);
                    if (error !== null) {
                      console.log('exec error: ' + error);
                    }
                });
                */

              //var isActive = spawnSync('ps', ['aux', ''|'', 'grep', '/apps/'+boat.id+'/'+boat.mainAppFile, '|', 'wc', '-l', '|', '{', 'read', 'wc;', 'test', '$wc', '-gt', '1', '&&', 'echo', '"1"', '||', 'echo', '"0";', '}']);

              //isActiveArray.push(isActive);

              //console.log("isActive: ", isActive);
            }
            //console.log("isActiveArray: ", isActiveArray);
            return res.json(isActiveArray);
        });

        console.log("After callback");
    }
};
