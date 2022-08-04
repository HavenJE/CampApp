

   mapboxgl.accessToken = mapToken;
   const map = new mapboxgl.Map({
       container: 'map', // container ID
       style: 'mapbox://styles/mapbox/streets-v11', // style URL
       center: campground.geometry.coordinates, // starting position [lng, lat]
       zoom: 10, // starting zoom
       // projection: 'globe' // display the map as a 3D globe
   });

const marker2 = new mapboxgl.Marker({ color: 'darkblue', rotation: 325 })
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);