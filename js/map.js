connections = new Connections();

$(function(){
  google.maps.event.addDomListener(window, 'load', initialize());

  $('.submit-name').on('submit', function(e){
    e.preventDefault();
    var mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: 2
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    name = $(this).find('input').val();
    apiCall(name);
  });
});

/////////////////
// GOOGLE MAPS
////////////////

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


function addMarker(latLng, popup) {
  var marker = new google.maps.Marker({
    position: latLng,
    animation: google.maps.Animation.DROP,
    map: map
  });
  addInfoWindow(marker, popup);
}

function addInfoWindow(marker, popup) {
  var infoWindow = new google.maps.InfoWindow({
    content: popup
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map, marker);
  });
}

//////////////
// PIPL API
//////////////

function apiCall(name) {
  $.ajax({
    url: 'http://api.pipl.com/search/v3/json/?raw_name=' + name + '&key=39udcd3gfy38bf6m6ya6vn7r&pretty=true&callback=parseResponse',
    dataType: 'jsonp',
    async: false,
    beforeSend: loadingGif()
  }).done(function(response) {
    $('#loader').hide()
    json = response;
    makePeople();
    getDisplay();
  }).fail(function() {
    console.log("Failed");
  })
}

function loadingGif() {
  $('#loader').show()
}

function getDisplay(){
  display = new Connections();
  for(var i = 0; i < json.records.length; i++){
    if(json.records[i].addresses){
      var img = '#'
      if (json.records[i].images) {
        var img = json.records[i].images[0].url;
      }
      info = {
        map: json.records[i].addresses[0].display,
        img: img
      };
      display.addConnection(info);
    }
  }

  for(var i = 0; i < display.all.length; i++){
    if (display.all[i].map) {
    $.ajax({
      url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + display.all[i].map + '&sensor=false',
      async: false
    }).done(function(e){
      if(e.results[0]){
        var lat = e.results[0].geometry.location.lat;
        var lng = e.results[0].geometry.location.lng;
        var latLng = new google.maps.LatLng(lat, lng);
        if(display.all[i]){var popup = '<img src="' + display.all[i].img + '" class="embed-img">'}
        addMarker(latLng, popup);
        }
      })
    }
  }
}

function makePeople(){
  for(var i = 0; i < json.records.length; i++) {
    var newPerson = new Person(json.records[i].source);
    connections.addConnection(newPerson);
  }
}

////////////
// OBJECTS
///////////

function Person(source) {
  this.source = source
}

Person.prototype.addFb = function(FbId) {
  this.FbId = FbId
}

function Connections() {
  this.all = []
}

Connections.prototype.addConnection = function(person) {
  this.all.push(person);
}
