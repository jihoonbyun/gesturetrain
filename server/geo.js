// gist from http://breakthebit.org/post/10512237123/using-html5-geolocation-api-to-get-the-distance-of-the 
// 2013.11.25
var Geolocation = {
  rad: function(x) { return x * Math.PI / 180 },

  // Distance in kilometers between two points using the Haversine algo.
  haversine: function(p1, p2) {
    var R = 6371
    var dLat  = this.rad(p2.latitude - p1.latitude)
    var dLong = this.rad(p2.longitude - p1.longitude)

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c

    return Math.round(d)
  },

  // Distance between me and the passed position.
  distance_from: function(position) {
    Geolocation.display_location()
    var distance = Geolocation.haversine(position.coords, current_location)

    // Sugar: If distance is less than 1km, don't bump into me.
    if ( distance && distance > 0 ) $("#distance").text(distance + " km")
    else $("#user_distance").html("<strong>You're close!</strong> Watch my toes!")
  },

  // Hide spinner and show location.
  display_location: function() {
    $("#user_distance").show()
    $("#geolocating").hide()
  }
}

