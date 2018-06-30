console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherService from './services/weather-service.js'


locService.getLocs()

    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(
            () => {

                document.querySelector('.my-loc').addEventListener('click', onMyLoc)
                document.querySelector('.btn-search').addEventListener('click', onSearch)
                document.querySelector('.search-input').addEventListener('keydown', onKeyDown)
                document.querySelector('.btn-weather').addEventListener('click', openWeather)
                document.querySelector('.btn-copy').addEventListener('click', copyLink)
                getMyPos()
            }
        ).catch(console.warn);

}

function getMyPos() {
    locService.getPosition()
        .then(data => {
            console.log('User position is:', data.coords);
            var coords = data.coords
            var coordLat = coords.latitude;
            var coordLng = coords.longitude;
            mapService.findCenter(coordLat, coordLng)
                .then(() => {
                    mapService.addMarker({ lat: coordLat, lng: coordLng })
                    mapService.getAddress(coordLat, coordLng)
                    cleanWeather()
                    addLoad()
                    weatherService.getWeather(coordLat, coordLng)
                        .then(res => {
                            res = JSON.parse(res)
                            renderWeahter(res)
                        })
                })

        }).catch(err => {
            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
}

function onMyLoc() {
    getMyPos();
}

function onSearch() {
    let elInputSearch = document.querySelector('.search-input');
    let searchStr = elInputSearch.value;
    if (searchStr !== '') {
        mapService.getCoord(searchStr)

        mapService.getCoordForDisplay()
            .then(data => {
                var { lat, lng } = data
                console.log(lat, lng, 'data to wheter')

                cleanWeather()
                addLoad()
                weatherService.getWeather(lat, lng)
                    .then(res => {
                        res = JSON.parse(res)
                        renderWeahter(res)
                    })

            }).catch(err => {
                console.log('promise faild')
                renderWeahter(false)
                renderFaildLoc()
            })
    }
}

function openWeather(){
    document.querySelector('.weather').classList.toggle('show-weather');
    this.classList.toggle('fa-times');
    document.querySelector('.popup-arrow').classList.toggle('hide')

}

function renderFaildLoc() {
    document.querySelector('.location-data p').innerText = 'Location Didnt found'
}
function removeLoad() {
    document.querySelector('.weahter-load').classList.add('hide')
}

function addLoad() {
    document.querySelector('.weahter-load').classList.remove('hide')
}

function cleanWeather() {
    document.querySelector('.weather-icon').src = ''
    let elPs = document.querySelectorAll('.weather p');
    elPs.forEach(p => {
        p.innerText = '';
    })
}
function renderWeahter(data) {

    var elPWeather = document.querySelector('.weahter-data');
    var elWeatherAdd = document.querySelector('.weahter-address');
    var elWeatherStatus = document.querySelector('.weahter-status');
    var elWeatherImg = document.querySelector('.weather-icon');
    if (data) {
        elWeatherImg.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        elWeatherStatus.innerText = data.weather[0].description;
        elWeatherAdd.innerText = `${data.name},${data.sys.country}`;
        var tmp = data.main.temp.toFixed(0);
        var str = ` ${tmp} <span></span> ,\n wind speed: ${data.wind.speed}`
        elPWeather.innerHTML = str;
        removeLoad()
    } else {
        cleanWeather()
        elPWeather.innerHTML = 'weather not found,try again'
    }

}

function onKeyDown(ev) {
    if (ev.code === 'NumpadEnter') {
        onSearch();
    }
}

function copyLink() {
    mapService.getCoordForDisplay()
    .then(data =>{
        console.log('test',data)
        var tes = `https://maps.google.com/?ll=${data.lat},${data.lng}`
        copy(tes) 
        console.log('url',tes)
        

    }) .catch(err=> {
        console.log('url not copies')
    })

    
}

function copy(txt) {

    var copyText = document.getElementById("myInput");
    document.querySelector('.copy-txt').classList.toggle('hide');
    copyText.value = txt;
    copyText.select();
    document.execCommand("copy");
  
}



