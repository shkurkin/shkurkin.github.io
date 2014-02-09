$(document).ready(function() {  
  // apiCall("Nicole Paz")
})

function apiCall(name) {
  $.ajax({
    url: 'http://api.pipl.com/search/v3/json/?raw_name=' + name + '&key=39udcd3gfy38bf6m6ya6vn7r&pretty=true&callback=parseResponse',
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