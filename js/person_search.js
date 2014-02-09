$(document).ready(function() {  
  // apiCall("Nicole Paz")
})

function apiCall(name) {
  $.ajax({
    url: 'http://api.pipl.com/search/v3/json/?raw_name=' + name + '&key=ask_for_key&pretty=true&callback=parseResponse',
    dataType: 'jsonp'
  }).done(function(response) {
    console.log(response)
    $.each(response.records, function(index, value) {
      if (this.source.name === "Personal Web Profile - Facebook") {
        console.log(this.user_ids[0].content)
      }
    })
  })
}