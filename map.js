var _overworld,_underworld

function init() {
	$.get("data/underworld.geojson", function(json){
		_underworld = json;
		$.get("data/overworld.geojson", function(json){
			_overworld = json;
			initMap();
		});
	});
}

function initMap() {

		var overworldBasemap = L.tileLayer('overworldTiles/{z}/{x}/{y}.png', {
	        tms: true,
            attribution: 'Imagery and data: <a href="http://www.nintendo.com">NINTENDO</a>'
		});
		
		var underworldBasemap = L.tileLayer('underworldTiles/{z}/{x}/{y}.png', {
            tms: true,
            attribution: 'Imagery and data: <a href="http://www.nintendo.com">NINTENDO</a>'
		});

		var map = L.map('map', {
			maxZoom: 6,
			minZoom: 2,
			layers: [overworldBasemap, underworldBasemap],
			crs: L.CRS.Simple
		}).setView([0, 0], 2);
        var southWest = map.unproject([0,16384], map.getMaxZoom());
		var northEast = map.unproject([16384,0], map.getMaxZoom());
		map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

		var icons = {
			'village': L.icon({
				iconUrl: 'img/village.png',
				iconSize: [60,64], // size of the icon width,height
				iconAnchor: [30,32], // point of the icon which will correspond to marker's location
				popupAnchor: [30,32] // point from which the popup should open relative to the iconAnchor
			}),
			'dungeon': L.icon({
				iconUrl: 'img/dungeon.png',
				iconSize: [64,55], 
				iconAnchor: [32,27], 
				popupAnchor: [32,27] 
			})
		};

		var overlay = {
			'Unterwelt': new L.layerGroup(),
			'Oberwelt': new L.layerGroup()
		};

		L.control.layers(overlay, null, {
			collapsed: false
		}).addTo(map);

		//Unterwelt
		$.getJSON("data/underworld.geojson",function(data){
   			// add GeoJSON layer to the map once the file is loaded
    		var underworldPoints = L.geoJson(data,{
    			coordsToLatLng: function (newcoords) {
					return (map.unproject([newcoords[0], newcoords[1]], map.getMaxZoom()));
				},
				pointToLayer: function (feature, coords) {
				return L.marker(coords);
				},
				onEachFeature: function (feature, layer) {
					layer.bindPopup(feature.properties.NAME);
				}
			});
			overlay['Unterwelt'].addLayer(underworldPoints);
			overlay['Unterwelt'].addLayer(underworldBasemap);
		});

		//Oberwelt
		$.getJSON("data/overworld.geojson",function(data){
   			// add GeoJSON layer to the map once the file is loaded
    		var overworldPoints = L.geoJson(data,{
    			coordsToLatLng: function (newcoords) {
					return (map.unproject([newcoords[0], newcoords[1]], map.getMaxZoom()));
				},
				pointToLayer: function (feature, coords) {
				return L.marker(coords);
				},
				onEachFeature: function (feature, layer) {
					layer.bindPopup(feature.properties.NAME);
				}
			});
			overlay['Oberwelt'].addLayer(overworldPoints);
			overlay['Oberwelt'].addLayer(overworldBasemap);
		});
}