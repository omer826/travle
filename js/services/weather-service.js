




// function getWeather(lat, lng) {
//   debugger
//   const API_KEY = '489b43ec8d7640de3c51c666fd281a28'
//   const URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
//   var prm = fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`)
//     prm.then(res => {
//         console.log(res);
//         var prmJson = res.json()
//         console.log(prmJson)

//         prmJson.then(function (data) {
//             console.log('weather', data)
//             objWhearher = data
                
//         }).catch(err => {
//             console.log('eror in wehter', err)
//         })

//     });
// }

function getWeather(lat, lng) {
    var api = '489b43ec8d7640de3c51c666fd281a28'
var url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api}&units=metric`
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.onload = function() {
        
        setTimeout(()=>{
            resolve(request.response);
        }, 500)
      };
      request.send(); 
    });
  };


export default {
    getWeather,
}
