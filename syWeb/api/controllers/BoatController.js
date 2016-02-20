/**
 * BoatController
 *
 * @description :: Server-side logic for managing Boats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	get: function (req, res) {
		var boatID = req.param('id');
		Boat.findOne({id:boatID}).exec(function (err,boat) {
        	if(err){
            	return res.json({
              		error:err
            	});
          	}

			console.log(boat)

          	if(boat === undefined) {
            	return res.notFound();
          	}
          	else {
				var boatObj = {};
			  	boatObj.name = boat.name;
			  	boatObj.port = boat.port;
			  	boatObj.active = boat.active;

				// find last pull time
				Log.findOne({where: { boat: boat.id, type: 'pull'}, sort: 'createdAt DESC'}).exec(function (err,log) {
		        	if(err){
		            	return res.json({
		              		error:err
		            	});
		          	}

					console.log(log);

		          	if(log !== undefined) {
						boatObj.lastUpdated = log.createdAt;
					}

					// find and calculate uptime
					Log.findOne({where: { boat: boat.id, type: 'up'}, sort: 'createdAt DESC'}).exec(function (err,log) {
			        	if(err){
			            	return res.json({
			              		error:err
			            	});
			          	}

						console.log(log);

			          	if(log !== undefined) {
							var currentTime = Date.now;
							var upAt = Date.parse(log.createdAt);
							var uptime = currentTime - upAt;
							boatObj.uptime = uptime;
						}

						return res.json(boatObj);

					});

				});


		  	}
        });
 	}




};
