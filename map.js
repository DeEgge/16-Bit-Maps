/*function init() {
	$.ajax({
		url: "terraPoints.js",
		type: 'GET',
		dataType: 'json',
		cache: false,
		success: function (json) {
			_quality = json;
			initMap();
		}
	});
}*/

function initMap() {

		var overworld = L.tileLayer('overworldTiles/{z}/{x}/{y}.png', {
	        tms: true,
            attribution: 'Imagery and data: <a href="http://www.nintendo.com">NINTENDO</a>'
		});
		
		var underworld = L.tileLayer('underworldTiles/{z}/{x}/{y}.png', {
            tms: true,
            attribution: 'Imagery and data: <a href="http://www.nintendo.com">NINTENDO</a>'
		});

		var map = L.map('map', {
			maxZoom: 6,
			minZoom: 2,
			layers: [overworld, underworld],
			crs: L.CRS.Simple
		}).setView([0, 0], 2);
        var southWest = map.unproject([0,16384], map.getMaxZoom());
		var northEast = map.unproject([16384,0], map.getMaxZoom());
		map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

		var overworldPoints = new L.geoJson(overworldPoints, {
			//convert pixel coordinates to global coordinates
			coordsToLatLng: function (newcoords) {
				return (map.unproject([newcoords[0], newcoords[1]], map.getMaxZoom()));
			},
			pointToLayer: function (feature, coords) {
				return L.marker(coords);
			},
			onEachFeature: function(feature, layer) {
				layer.bindPopup(
					feature.properties["NAME"]);
			}
		});

		//Fasse die Basemap und das Overlay als Layergruppe zusammen
		var overworldGroup = L.layerGroup([overworld, overworldPoints]);

    	var underworldPoints = new L.geoJson(underworldPoints, {
			//convert pixel coordinates to global coordinates
			coordsToLatLng: function (newcoords) {
				return (map.unproject([newcoords[0], newcoords[1]], map.getMaxZoom()));
			},
			pointToLayer: function (feature, coords) {
				return L.marker(coords);
			},
			onEachFeature: function(feature, layer) {
				layer.bindPopup(
					feature.properties["NAME"]);
			}
		});

		var underworldGroup = L.layerGroup([underworld, underworldPoints]).addTo(map);

		var layers = {
			"Oberwelt": overworldGroup,
			"Unterwelt": underworldGroup
		};

		L.control.layers(layers, null, {
			collapsed: false
		}).addTo(map);
}