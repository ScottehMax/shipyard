$(function() {
    /////////////////////// Code for populating the home screen
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('.progress').hide();
    $('.slider').slider({full_width: true});
    // Create an array to keep track of all the boats you have on screen
    var boats = {"":""};
    console.log(boats);
    function updateHarbour() {
        var server_url = "http://shipyard.ngrok.com/boat/getall";
        $.get(server_url, function(data) {
            // Create an array of boats you've added this time
            for (var i = 0; i < data.length; i++) {
                var boatID = data[i]['id'];
                var boatdata = data[i];

                var name = boatdata['name'];
                var active = boatdata['active'];
                var giturl = boatdata['giturl'];
                var lastUpdated = Date(boatdata['lastUpdated']);

                var uptime = boatdata['uptime'];
                var uptimeMinutes = parseInt(uptime / 60)%60;
                var uptimeHours = parseInt(uptime / 3600)%24;
                var uptimeSeconds = uptime % 60
                var uptimeString = uptimeHours + " hours, " + uptimeMinutes + " mins and " + uptimeSeconds + " seconds."

                var icon = "";
                var activeString = "";
                if (active) {
                    icon = 'done';
                    activeString = 'Yes';
                } else {
                    icon = 'warning';
                    activeString = 'No';
                }

                // Don't look at the next line. Just. Don't. Please. For goodness sake save yoursef.
                var boatItemHTML = "<li id='" + boatID + "'><div class='collapsible-header'><i class='material-icons'>" + icon + "</i>" + name + '</div><div class="collapsible-body white"><p id="active"><strong class="teal-text text-lighter-1">Active:  </strong>' +
                    activeString + '</p><p id="giturl"><strong class="teal-text text-lighter-1">Git Repo:     </strong>' + giturl + '</p><p id="lastUpdated"><strong class="teal-text text-lighter-1">Last Updated: </strong>' + lastUpdated + '</p><p id="uptime"><strong class="teal-text text-lighter-1">Uptime:  </strong>' + uptimeString +
                    "</p><a onclick='deletion(" + boatID + ")' class='delete waves-effect waves-light btn' id='" + boatID + "'><i class='material-icons left'>delete</i>Delete</a></div></li>";
                if (boats.hasOwnProperty(boatID)) {
                    // If the boat is not already in the list add it.
                    // Add the new boat item
                    $('#'+boatID).replaceWith(boatItemHTML);
                    boats[boatID] = boatdata;
                } else {
                    // Hopefully if i have my control flow right, this should be where the boat already exists
                    // In which case just change the relevant info.

                    $('.boatlistcont').append(boatItemHTML);
                    boats[boatID] = boatdata;
                }
            }
            Materialize.toast('Your harbour is updated!', 2000, 'toastPos');
        });
    }
    updateHarbour();

    ///////////////// Code for dealing with the add item popup
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
      $('.progress').show();
      $.ajax({
          type: "POST",
          url: "http://shipyard.ngrok.com/boat/create",
          data: dataString,
          success: function(data) {
              if(data.success){
                  $('.progress').hide();
                  Materialize.toast('Ship has set sail successfully!', 2000, 'toastPos');
                  $('#modal1').closeModal();
                  $('#changemeplease').text(data.webhookurl);
                  $('#modal2').openModal();
                  setTimeout(updateHarbour(), 100000);
              } else {
                  $('.progress').hide();
                  Materialize.toast(data.error, 2000, 'toastPos');
              }


                 // $('.progress').hide();
                  //Materialize.toast('Ship has titanicked! Error.', 2000, 'toastPos');
          },
          error: function(thrownError) {
              $('.progress').hide();
              console.log(JSON.stringify(thrownError));
              Materialize.toast('We hit an iceberg launching your code. Sorry.', 2000, 'toastPos');
          }
      });
      return false;
    });

    setInterval(updateHarbour,15000);

});
