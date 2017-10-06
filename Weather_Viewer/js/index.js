var longitude = 0;
var latitude = 0;
var fahrenheit = false;
var temp = 0;

var backgroundImages = {
  "01d":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bridge_at_Trekanten%2C_south_Stockholm_%28Sweden%29_-_panoramio_%281%29.jpg/800px-Bridge_at_Trekanten%2C_south_Stockholm_%28Sweden%29_-_panoramio_%281%29.jpg",
  "01n":"https://upload.wikimedia.org/wikipedia/commons/e/e9/Czech_sunset_-_panoramio.jpg",
  "02d":"https://upload.wikimedia.org/wikipedia/commons/1/16/Big_Bear_Sky_%287891621042%29_%282%29.jpg",
  "02n":"https://upload.wikimedia.org/wikipedia/commons/0/05/Moon_Monster2.jpg",
  "03d":"https://upload.wikimedia.org/wikipedia/commons/1/16/Big_Bear_Sky_%287891621042%29_%282%29.jpg",
  "03n":"https://upload.wikimedia.org/wikipedia/commons/0/05/Moon_Monster2.jpg",
  "04d":"https://upload.wikimedia.org/wikipedia/commons/1/16/Big_Bear_Sky_%287891621042%29_%282%29.jpg",
  "04n":"https://upload.wikimedia.org/wikipedia/commons/0/05/Moon_Monster2.jpg",
  "09d":"https://upload.wikimedia.org/wikipedia/commons/8/8d/Here_comes_rain_again.jpg",
  "09n":"https://upload.wikimedia.org/wikipedia/commons/8/8d/Here_comes_rain_again.jpg",
  "10d":"https://upload.wikimedia.org/wikipedia/commons/8/8d/Here_comes_rain_again.jpg",
  "10n":"https://upload.wikimedia.org/wikipedia/commons/8/8d/Here_comes_rain_again.jpg",
  "11d":"https://upload.wikimedia.org/wikipedia/commons/1/1c/Phatman_-_Lightning_on_the_Columbia_River_%28by-sa%29.jpg",
  "11n":"https://upload.wikimedia.org/wikipedia/commons/1/1c/Phatman_-_Lightning_on_the_Columbia_River_%28by-sa%29.jpg",
  "13d":"https://upload.wikimedia.org/wikipedia/commons/b/b5/GothafossWinter.jpg",
  "13n":"https://upload.wikimedia.org/wikipedia/commons/b/b5/GothafossWinter.jpg",
  "50d":"https://upload.wikimedia.org/wikipedia/commons/2/2c/Misty_valley_-_swifts_creek04.jpg",
  "50n":"https://upload.wikimedia.org/wikipedia/commons/2/2c/Misty_valley_-_swifts_creek04.jpg",
};



$(document).ready(function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
     longitude = position.coords.longitude;
     latitude = position.coords.latitude;
     var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?APPID=121f3d86ef5450faeb3a2afd612df660&lon="+longitude+"&lat="+latitude;
     $.getJSON(weatherApiUrl, function(json){
       $("#cityName").html(json.name);
       temp = Math.floor(json.main.temp-273.15);
       $("#temperature").html(Math.floor(temp)+" C°");
       $("#description").html(json.weather[0].description);
       $("#weatherIcon").addClass("owf owf-"+json.weather[0].id);
       $("#background").css("background-image", 'url('+backgroundImages[json.weather[0].icon]+')');
       $("#mainWell").removeClass("hide");
     }); 
    });	
  } else {
    alert("I am unable to find your longitude and latitude.");  
  }
  $("#toggleFahrenheit").on("click", function () {
    if (fahrenheit){
      $("#temperature").html(Math.floor(temp)+" C°");
      $("#toggleFahrenheit").html("F°");
      fahrenheit = false;
    } else {
      $("#temperature").html(Math.floor(toFahrenheit(temp))+" F°");
      $("#toggleFahrenheit").html("C°");
      
      fahrenheit = true;
    }
  });
});

function toFahrenheit(celsius){
  return Math.floor(celsius*(9/5)+32);
}
