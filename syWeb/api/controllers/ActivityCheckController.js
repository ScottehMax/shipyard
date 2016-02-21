/**
 * ActivityCheckController
 *
 * @description :: Server-side logic for managing the activity checks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var http = require('http');
const spawnSync = require('child_process').spawnSync;

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

              console.log("boat: ", boat);

              var isActive = spawnSync('ps', ['aux', ''|'', 'grep', '/apps/'+boat.id+'/'+boat.mainAppFile, '|', 'wc', '-l', '|', '{', 'read', 'wc;', 'test', '$wc', '-gt', '1', '&&', 'echo', '"true"', '||', 'echo', '"false";', '}']);

              isActiveArray.push(isActive);

              console.log("isActive: ", isActive);
            }
            //console.log("isActiveArray: ", isActiveArray);
            return res.json(isActiveArray);
        });

        console.log("After callback");
    }
};
