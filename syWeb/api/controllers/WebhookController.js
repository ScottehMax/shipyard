/**
 * WebhookController
 *
 * @description :: Server-side logic for managing webhooks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const execSync = require('child_process').execSync; // scary!
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
				execSync('git pull', {'cwd': './apps/' + id});
				// fucking race conditions...
				console.log('running forever app.js...');
				try {
					execSync('forever stop app.js', {'cwd': './apps/' + id});
				} catch (e) {
					console.log('app is not running, or something else went wrong. blame jordan');
				}
				execSync('forever start app.js', {'cwd': './apps/' + id});
			}
		})
		return res.send(fug);
	}

	stop: function(req, res) {
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
				execSync('git pull', {'cwd': './apps/' + id});
				// fucking race conditions...
				console.log('running forever app.js...');
				try {
					execSync('forever stop app.js', {'cwd': './apps/' + id});
				} catch (e) {
					console.log('app is not running, or something else went wrong. blame jordan');
				}
			}
		})
		return res.send(fug);
	}
};
