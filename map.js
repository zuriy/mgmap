var info;
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
    // control that shows state info on hover
    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
            this._div.innerHTML = '<h4>Информация</h4>' +  (props ?
                //'<b>' + props.name + '</b><br />'
                props.popupContent +'<br/> Координаты х,у:' + props.coordinates + ' '
                : 'Для получения информации <br/> об игроке <br/> Наведите на город / шахту');
    };

    info.addTo(map);

с= L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(map);

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
                "coordinates":[locationx,locationy],
                "type": "Feature",
                "league": league,
                "properties": {
                    "coordinates":[locationx,locationy],
                    "popupContent": "Шахта:<B>" + datas.Map[i].name+'</B><BR>Лига:<B>'+league+'</B>'
                },
                "id": i
            }
            mines.features.push(mine);
            var title = "Шахта ("+league+"):"+ datas.Map[i].name,
                loc = [locationy,locationx];
            sindex.push({
                loc: loc,
                title: title
            });
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
            if (country_id == 0) 
             //fillColor = "#ee7800"
             fillColor = "#333333"
            else fillColor = colors[country_id];
            city = {
                "geometry": {
                    "type": "MultiPolygon",
                    //"coordinates": [locationx, locationy]
                    "coordinates": [[[ [locationx-1,locationy -1],[locationx,locationy -1],
                    [locationx,locationy],[locationx-1,locationy],[locationx-1,locationy -1] ]
                    ]]
                },
                "type": "Feature",
                "us_id": us_id,
                "country_id": country_id,
                "country_name": country_name,
                "title": datas.Map[i],
                "league": league,
                "properties": {
                    "style": {
                        weight: 1,
                        color: '#000',
                        //opacity: 1,
                        fillColor: fillColor,
                        fillOpacity: 1
                    },
                    "coordinates":[locationx,locationy],
                    "color": fillColor,
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
function highlightFeature(e){
    var layer = e.target;

    layer.setStyle({
                weight: 5,
                color: '#666',
                fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}
function resetHighlight(e){
  //  e.layer.resetStyle(e.target);
  var layer = e.target;
   layer.setStyle({
                weight: 1,
                color: '#000',
                fillOpacity: 1
    });
    info.update();
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
    popupContent += "<BR>" + "Координаты x,y: " + feature.properties.coordinates;
    layer.bindPopup(popupContent);
    layer.on({
        mouseover: highlightFeature, //you need to change this
        mouseout: resetHighlight,
    });
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