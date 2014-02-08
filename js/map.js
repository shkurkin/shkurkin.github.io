$(function(){
  google.maps.event.addDomListener(window, 'load', initialize);
  getGraphData();
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

function getGraphData(user_id) {
  $.ajax({
    url: "http://graph.facebook.com/1036590399?fields=picture,name"
  }).done(function(response){
    processGraphData(response)
  }).fail(function(){
    console.log("Request Failed");
  });
}


function getByName(name) {
  $.ajax({
    url: "http://graph.facebook.com/search?q=joe&type=user&access_token=CAACEdEose0cBAPJr8yoHZAtqq5Te4HvlBazLBBSv3rjplyZCGvPtNGkR9LovHl2aslr47yVZCRmzyYZAHfyKC2jpil468NxfoezZChEZAZBicCNBwgnqFVarTHqYFZCfsxe3obpQekjNHIUYuTgI6S446WiIBehZCWZB5ZCZARZBQFGPvq9gLM82ZCEhrxwQdbxBrWZCxkZD"
  }).done(function(response){
    debugger
  })
}


function processGraphData(response) {
  var latLng = new google.maps.LatLng(0,0);
  var popup = '<img src="' + response.picture.data.url + '">' +
  '<p>' +  response.name + '</p>';
  addMarker(latLng, popup);
}


// https://graph.facebook.com/oauth/access_token?client_id=697839106933842&client_secret=ee0d7aec350977e215b54ce6e9856ad6&grant_type=client_cred
// access_token=697839106933842|PHYWDQwCwbxQtyKuz2sVuDVkbQQ
