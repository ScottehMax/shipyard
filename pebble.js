/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Shipyard',
  icon: 'images/menu_icon.png',
  subtitle: 'Welcome!',
  body: 'Press up to view your boats.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  // do ajax shit
  ajax({url: 'http://shipyard.ngrok.com/boat/getall', type: 'json' },
      function(data) {
        console.log(data);
        console.log(JSON.stringify(data));
        var boats = [];
        for (var i = 0; i < data.length; i++) {
          var boat = data[i];
          if (boat.active) {
            stitle = 'Up for ' + boat.uptime + ' seconds';
          } else {
            stitle = 'Down';
          }
          boats.push({
            title: '#' + boat.id + ': ' + boat.name,
            subtitle: stitle
          });
        }

        console.log(boats);


        var menu = new UI.Menu({
          sections: [{
            title: 'Boats',
            items: boats
          }]
        });

        menu.show();
      });


//   menu.on('select', function(e) {
//     var detailCard = new UI.Card({
//       title: 'Boat ' + e.id,
//       body: 'Your boat is online!'
//     });
//     detailCard.show();
// //     detailCard.on('click', 'select', function(e) {
// //       var text = new UI.Text({
// //         ''
// //       });
// //     });
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
