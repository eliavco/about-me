/* eslint-disable */

const tourDuration = document.getElementById('map').dataset.duration * 1;
const locations = JSON.parse(document.getElementById('map').dataset.locations);
locations[0].day = 0;
// console.log(locations);
// console.log(tourDuration);

mapboxgl.accessToken =
    'pk.eyJ1IjoiZWxpYXZjbyIsImEiOiJjazBydGQ3azkwNWgxM2JwaGs3dms2cWx2In0.6Z-xCrzOEYMrkA9IGBeXGw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/eliavco/ck0rthbtb0ke21cqk87epl4ys',
    // style: './../../vendors/MapBox/Light(ck0rthbtb0ke21cqk87epl4ys)/style.json',
    // style: path.join(__dirname, 'vendors/MapBox/Light(ck0rthbtb0ke21cqk87epl4ys)/style.json'),
    // style: 'htttp://127.0.0.1:3000/vendors/MapBox/Light(ck0rthbtb0ke21cqk87epl4ys)/style.json',
    logoPosition: 'bottom-right'
    // interactive: false,
    // zoom: 13,
    // center: [2.2871428, 48.8579466],
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc, i) => {
    const el = document.createElement('div');
    let anchorMarker = 'bottom';
    let anchorPopup = 'bottom';
    let offsetPopup = 30;
    if (i === 0) {
        el.className = 'marker-start';
        anchorPopup = 'top';
        offsetPopup = 0;
    
    // number of days in duration doesn't include day of departure 0
    } else if (loc.day === tourDuration) {
        el.className = 'marker-end';
        anchorMarker = 'bottom-left';
        anchorPopup = 'top';
        offsetPopup = 0;
    } else {
        el.className = 'marker';
    }
    
    new mapboxgl.Marker({
        element: el,
        anchor: anchorMarker,
    }).setLngLat(loc.coordinates).addTo(map).setPopup(
        new mapboxgl.Popup({
            offset: offsetPopup,
            closeButton: false,
            closeOnClick: true,
            anchor: anchorPopup
        })
            .setLngLat(loc.coordinates)
            .setHTML(
                `<p>Day ${loc.day}: <a target="_blank" class="link-google-maps" href="http://www.google.com/maps/place/${loc.coordinates[1]},${loc.coordinates[0]}">${loc.description}</a></p>`
            )
    );

    // .addTo(map);

    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
    }
});

const coordinatesLine = locations.map(loc => {
    return loc.coordinates;
});
// console.log(coordinatesLine);

map.on('load', function () {
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinatesLine
                }
            }
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            // 'line-color': '#84DCC6',
            // 'line-color': '#FFA69E',
            'line-color': '#8DC1D6',
            // 'line-color': '#FF686B',
            // 'line-color': '#FFF09E',
            'line-width': 3
        }
    });
});