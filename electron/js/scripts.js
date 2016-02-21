$(function() {
    // Code for populating the home screen
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    // Create an array to keep track of all the boats you have on screen
    var boats = {};

    ////////////////var server_url = "http://shipyard.ngrok.com/boat/getall";
    var server_url = 'http://localhost:1337/boat/getall';
    $.get(server_url, function(data) {
        // Create an array of boats you've added this time
        for (var i = 0; i < data.length; i++) {
            var boatID = data[i]['id'];
            var boatdata = data[i];

            boats[boatID] = boatdata;

            var name = boatdata['name'];
            var active = boatdata['active'];
            var giturl = boatdata['giturl'];
            var lastUpdated = boatdata['lastUpdated'];
            var uptime = boatdata['uptime'];
            var icon = "";
            var activeString = "";
            if (active) {
                icon = 'done';
                activeString = 'Yes';
            } else {
                icon = 'warning';
                activeString = 'No';
            }

            var boatItemHTML = "<li id='" + boatID + "'><div class='collapsible-header'><i class='material-icons'>" + icon + "</i>" + name + '</div><div class="collapsible-body"><p id="active">Active: ' + activeString + '</p><p id="giturl">Git Repo: ' + giturl + '</p><p id="lastUpdated">Last Updated: ' + lastUpdated + '</p><p id="uptime">Uptime: ' + uptime + "</p></div></li>";
            if (boatID in boats) {
                // If the boat is not already in the list add it.
                // Add the new boat item
                $('.boatlistcont').append(boatItemHTML);
            } else {
                // Hopefully if i have my control flow right, this should be where the boat already exists
                // In which case just change the relevant info.
                $('#'+boatID).replaceWith(boatItemHTML);
            }
        }
        Materialize.toast('Your harbour is set up!', 2000, 'toastPos');
    });

    // Code for dealing with the add item popup
    $('.error').hide();
    $(".subbutton").click(function() {
      // validate and process form here

        $('.error').hide();
  	    var boat_name = $("input#boat_name").val();
  		if (boat_name === "") {
            $('label#boat_name_label').hide();
            $("label#boat_name_error").show();
            $("input#name").focus();
        return false;
      }

  	  var boat_giturl = $("input#boat_giturl").val();
  		if (boat_giturl === "") {
            $('label#boat_giturl_label').hide();
            $("label#boat_giturl_error").show();
            $("input#email").focus();
        return false;
      }

      var boat_main_app_file = $("input#boat_main_app_file").val();

      var dataString = 'boat_name=' + boat_name + '&boat_giturl=' + boat_giturl + '&boat_main_app_file=' + boat_main_app_file;

      $.ajax({
          type: "POST",
          ///////////////url: "http://shipyard.ngrok.com/boat/create",
          url: "http://localhost:1337/boat/create",
          data: dataString,
          success: function() {
              Materialize.toast('Ship has set sail successfully!', 2000, 'toastPos');
              $('#modal1').closeModal();
          },
          error: function(thrownError) {
              alert(thrownError);
          }
      });
      return false;
  });
});
