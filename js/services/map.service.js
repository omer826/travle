
var map;
var currAddress;
const API_KEY = 'AIzaSyC9Acl7xrSZ1oWcQtptp-vxSnmADcWrFpA';

var objCoord = false
var marker;


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return findCenter(lat, lng)

}

function addMarker(loc) {
    let iconMarker = {
        url: "img/marker.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    marker = new google.maps.Marker({
        position: loc,
        map: map,
        icon: iconMarker,
        title: 'hello',
    });

    return marker;
}


function findCenter(lat, lng) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', map);
        })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    // const API_KEY = ;
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')

    })
}

function getCoord(...params) {
    var searchArg = params;
    var searchStr = '';
    searchArg.forEach(str => {
        searchStr += `${str}`
    });
    searchStr = searchStr.replace(/[,]/g, '+');
    var prm = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchStr}&key=${API_KEY}`)
    prm.then(res => {
        console.log(res);
        var prmJson = res.json()
        console.log(prmJson)

        prmJson.then(data => {
            console.log('addres', data);
            var formatedAdd = data.results[0].formatted_address
            var dataCoord = data.results[0].geometry.location
            var lat = dataCoord.lat
            var lng = dataCoord.lng;

            findCenter(lat, lng)
                .then(() => {
                    addMarker({ lat: lat, lng: lng })
                    getAddress(lat, lng)

                    objCoord = {
                        lat: lat,
                        lng: lng
                    }
                })
        }).catch(err => {
            console.log('eror in address', err)

        })

    });
}


function getAddress(lat, lng) {
    var prm = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    prm.then(res => {
        console.log(res);
        var prmJson = res.json()
        console.log(prmJson)

        prmJson.then(function (data) {
            console.log('addres', data);
            let formatedAdd = data.results[0].formatted_address
            renderAddress(formatedAdd)
        }).catch(err => {
            console.log('eror', err)
            renderAddress(false)
        })

    });
}

function renderAddress(str) {
    let elP = document.querySelector('.location-data p');
    if (!str) str = "We didnt find your search"
    elP.innerText = str;
    google.maps.event.addListener(marker, 'mouseover', function () {
        marker.setTitle(str);
    });

    marker.addListener('click', function () {
        map.setZoom(18);
    });

}

function getCoordForDisplay() {
    return new Promise(function (resolve, reject) {
        if (objCoord) {
            setTimeout(() => {
                resolve(objCoord)
            }, 2000)

        } else {
            console.log('promise faild')
            reject(err)
        }
    });

}


export default {
    initMap,
    addMarker,
    findCenter,
    getCoord,
    getAddress,
    getCoordForDisplay
}

