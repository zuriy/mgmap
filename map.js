function initMap() {
    //Определим карту
    var squareSize = 150;
    var zoom = 2;
    //Задаем специальную плоскую систему координат
    L.CRS.SimpleInvert = L.extend({}, L.CRS, {
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1, 0, 1, 0),

		scale: function (zoom) {
		return Math.pow(2, zoom);
		}
		,
		infinite: true
	});
    var map = new L.Map('map-container', {
        center: [75, 75],
        zoom: zoom,
        zoomControl: true,
        minZoom: 2,
        maxZoom: 6,
        // the next is the very main line here
        crs: L.CRS.SimpleInvert,
        //maxBounds: new L.LatLngBounds(
           // new L.LatLng(-100, -100),
           // new L.LatLng(squareSize + 100, squareSize + 100)
        //    		new L.LatLng(squareSize+10, -10),
        //    		new L.LatLng(-10, squareSize+10)
        //)
    });
  
    L.graticule({
        interval: 10
    }).addTo(map);
    //Контур фона
    polygon = L.polygon([
        [0, squareSize],
        [squareSize, squareSize],
        [squareSize, 0],
        [0, 0]
    ]);
    polygon.addTo(map);

    L.control.coordinates({
        position: "bottomleft", //optional default "bootomright"
        decimals: 0, //optional default 4
        decimalSeperator: ".", //optional default "."
        labelTemplateLat: "Координаты Х: {y}", //optional default "Lat: {y}"
        labelTemplateLng: "Y: {x}", //optional default "Lng: {x}"
        enableUserInput: true, //optional default true
        useDMS: false, //optional default false
        useLatLngOrder: true //ordering of labels, default false-> lng-lat
    }).addTo(map);
    //var miniMap = new L.Control.MiniMap(polygon, { toggleDisplay: true }).addTo(map); 
    return map;
}
function getStr(arrForSearch,searched,fieldName){
    for (var i = 0; i < arrForSearch.length; i++) {
        if (arrForSearch[i][fieldName] ==searched){
            return arrForSearch[i];
            break;
        } 
    };
    
}
function loadMapData(datas, mines, cityes, sindexLayer) {
    var maxAdd = datas.Map.length - 1;
    Players = datas.Players;
    for (var i = 0; i < maxAdd; i++) {
        if (datas.Map[i].type == 'mine') {
            //		locationx = Math.round(Math.random()*150);
            //		locationy = Math.round(Math.random()*150);
            locationx = datas.Map[i].location.x;
            locationy = datas.Map[i].location.y;
            league    = datas.Map[i].league;
            mine = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [locationx, locationy]
                },
                "type": "Feature",
                "league": league,
                "properties": {
                    "popupContent": "Шахта:<B>" + datas.Map[i].name+'</B><BR>Лига:<B>'+league+'</B>'
                },
                "id": i
            }
            mines.features.push(mine);
        }
        if (datas.Map[i].type == 'city') {
            //	locationx = Math.round(Math.random()*150);
            //	locationy = Math.round(Math.random()*150);
            var locationx  = datas.Map[i].location.x,
                locationy = datas.Map[i].location.y,
                title = datas.Map[i].nick,
                league = 0,
                us_id = datas.Map[i].us_id;
                plStr = getStr(Players,us_id,'us_id'),
                country_id = plStr.countryID;
                if (country_id != 0) {
                    country_name =  plStr.countryName;
                    league = getStr(datas.Countries,country_name,"name_s").league;
                }
                else country_name = 'Нет';
            city = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [locationx, locationy]
                },
                "type": "Feature",
                "us_id": us_id,
                "country_id": country_id,
                "country_name": country_name,
                "title": datas.Map[i],
                "league": league,
                "properties": {
                    "popupContent": " Игрок: <B>" + datas.Map[i].nick + "</B>" + "<BR>" 
                                    + "Город:<B>" + datas.Map[i].name + "</B>" + "<BR>" 
                                    + "Государство:<B>" + country_name + "</B>" + "<BR>"
                },  
                "id": i
            }
            cityes.features.push(city);
            var title = datas.Map[i].nick +","+ datas.Map[i].name,
                loc = [locationy,locationx];
            sindex.push({
                loc: loc,
                title: title
            });
        }

    };
}

function onEachFeature(feature, layer) {
	//Выделение при наведении
    var popupContent = "";
    var style = {
        "clickable": true,
       	//"color": "#00D",
        //"fillColor": "#00D",
        "weight": 1.0,
        "opacity": 0.3,
        "fillOpacity": 0.2
    };
    var hoverStyle = {
        "fillOpacity": 0.5
    };
    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    popupContent += "<BR>" + "Координаты x,y: " + feature.geometry.coordinates;
    layer.bindPopup(popupContent);
 //   if (!(layer instanceof L.Point)) {
 //                   layer.on('mouseover', function () {
 //                       layer.setStyle(hoverStyle);
 //                   });
 //                   layer.on('mouseout', function () {
 //                       layer.setStyle(style);
 //                   });
 //               }
}

function featureToMarkerSand(feature, latlng) {

    return L.circleMarker(latlng, {
        radius: 6,
        fillColor: "#70cc51",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
}

function featureToMarkerCity(feature, latlng) {
    if (feature.country_id == 0) 
        fillColor = "#ee7800"
    else fillColor = colors[feature.country_id];
        return L.circleMarker(latlng, {
            radius: 4,
            fillColor: fillColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    }


    /*		L.geoJson([mines], {

    			style: function (feature) {
    				return feature.properties && feature.properties.style;
    			},
    			onEachFeature: onEachFeature
    			,
    			pointToLayer: function (feature, latlng) {
    				return L.circleMarker(latlng, {
    					radius: 1+map.getZoom(),
    					fillColor: "#ff7800",
    					color: "#000",
    					weight: 1,
    					opacity: 1,
    					fillOpacity: 0.8
    				});
    			}
    		}).addTo(map);*/


//var popup = L.popup();
//
//function onMapClick(e) {
//			popup
//				.setLatLng(e.latlng)
//				.setContent("Свободное место: х,у:"+Math.round(e.latlng.lat)+","+Math.round(e.latlng.lng))
//				.openOn(map);
//		}

//	map.on('click', onMapClick);