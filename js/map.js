connections = new Connections();

$(function(){
  google.maps.event.addDomListener(window, 'load', initialize);
  // getGraphData();
  $('.name-input').on('submit', function(e){
    e.preventDefault();
    processName(e);
  });

/////////////
// FB LOGIN
/////////////

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '697839106933842',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      testAPI();
    } else if (response.status === 'not_authorized') {
      FB.login();
    } else {
      FB.login();
    }
  });
  };

  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "http://connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }
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

////////////////
// FACEBOOK API
////////////////


function processName(e){
  var name = $(e.target).find("input").val().toLowerCase();
  var encodedName = encodeURI(name);
  getByName(encodedName);
}

function getByName(name) {
  $.ajax({
    type: 'GET',
    dataType: 'JSON',
    url: "https://graph.facebook.com/search?q=" +
      name +
      "&type=user&access_token=" +
      FB.getAccessToken()
  }).done(function(response){
    for(var i = 0; i < 10; i++) {
      if(response.data[i]){
        var newPerson = new Person(response.data[i].id);
        connections.addConnection(newPerson);
      }
    }
    getGraphData();
  }).fail(function(response){
    debugger
    console.log("Failed");
  })
}

function getGraphData() {
  debugger
  for (var i = 0; i < connections.all.length; i++) {
    $.ajax({
      url: "https://graph.facebook.com/"+
      connections.all[i].fbId +
      "?fields=picture,name"
    }).done(function(response){
      processGraphData(response)
    }).fail(function(){
      console.log("Request Failed");
    });
  }
}

function processGraphData(response) {
  debugger
  var lat = Math.floor((Math.random()*100)+1);
  var lng = Math.floor((Math.random()*100)+1);
  var latLng = new google.maps.LatLng(lat, lng);
  var popup = '<img src="' + response.picture.data.url + '">' +
  '<p>' +  response.name + '</p>';
  addMarker(latLng, popup);
}

////////////
// OBJECTS
///////////

function Person(fbId) {
  this.fbId = fbId
}

function Connections() {
  this.all = []
}

Connections.prototype.addConnection = function(person) {
  this.all.push(person);
}
