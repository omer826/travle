





function getWeather(lat, lng) {
    var api = '489b43ec8d7640de3c51c666fd281a28'
var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api}&units=metric`
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.onload = function() {
        
        setTimeout(()=>{
            resolve(request.response);
        }, 0)
      };
      request.send(); 
    });
  };


export default {
    getWeather,
}
