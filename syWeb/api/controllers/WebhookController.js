/**
 * WebhookController
 *
 * @description :: Server-side logic for managing webhooks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const exec = require('child_process').exec; // scary!
var fs = require('fs');

module.exports = {
	run: function(req, res) {
		var fug = 'aaa';
		var id = req.param('id');
		Boat.findOne({id: id}).exec(function(err, boat) {
			if (err) {
				console.log('err');
				return res.json({error: err});
			}
			if (!boat) {
				console.log('no boat :(');
			} else {
				// everything worked, our ship has come in!
				console.log('running git pull...');
				exec('git pull', {'cwd': './apps/' + id});
				console.log('running forever app.js...');
				exec('forever stop app.js', {'cwd': './apps/' + id});
				exec('forever start app.js', {'cwd': './apps/' + id});
			}
		})
		return res.send(fug);
	}
};
