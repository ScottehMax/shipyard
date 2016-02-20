/**
 * BoatController
 *
 * @description :: Server-side logic for managing Boats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	get: function (req, res) {
		var id = req.param('id');
		Boat.findOne({id:id})
        .exec(function (err,boat) {
          if(err){
            return res.json({
              error:err
            });
          }
          if(boat === undefined) {
            return res.notFound();
          }
          else {
			  var boatObj = {};
			  boatObj.name = boat.name;
			  boatObj.port = boat.port;
			  boatObj.active = boat.active;
			  return res.json(boatObj);
		  }
        });
 	}




};
