/*
 Graticule plugin for Leaflet powered maps.
*/
L.Graticule = L.GeoJSON.extend({

    options: {
        style: {
            color: '#333',
            weight: 1
        },
        interval: 10
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layers = {};

        if (this.options.sphere) {
            this.addData(this._getFrame());
        } else {
            this.addData(this._getGraticule());
        }
    },

    _getFrame: function() {
        return { "type": "Polygon",
          "coordinates": [
              this._getMeridian(0).concat(this._getMeridian(150).reverse())
          ]
        };
    },

    _getGraticule: function () {
        var features = [], interval = this.options.interval;

        // Meridians
        for (var lng = 0; lng <= 150; lng = lng + interval) {
            features.push(this._getFeature(this._getMeridian(lng), {
                "name": (lng) ? lng.toString() + "° E" : "Prime meridian"
            }));
            if (lng !== 0) {
                features.push(this._getFeature(this._getMeridian(-lng), {
                    "name": lng.toString() + "° W"
                }));
            }
        }

        // Parallels
        for (var lat = 0; lat <= 150; lat = lat + interval) {
            features.push(this._getFeature(this._getParallel(lat), {
                "name": (lat) ? lat.toString() + "° N" : "Equator"
            }));
/*            if (lat !== 0) {
                features.push(this._getFeature(this._getParallel(-lat), {
                    "name": lat.toString() + "° S"
                }));
            }*/
        }

        return {
            "type": "FeatureCollection",
            "features": features
        };
    },

    _getMeridian: function (lng) {
        lng = this._lngFix(lng);
        var coords = [];
        for (var lat = 0; lat <= 150; lat++) {
            coords.push([lng, lat]);
        }
        return coords;
    },

    _getParallel: function (lat) {
        var coords = [];
        for (var lng = 0; lng <= 150; lng++) {
            coords.push([this._lngFix(lng), lat]);
        }
        return coords;
    },

    _getFeature: function (coords, prop) {
        return {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            },
            "properties": prop
        };
    },

    _lngFix: function (lng) {
        if (lng >= 150) return 149.999999;
        if (lng <= 0) return 0.00000001;
        return lng;
    }

});

L.graticule = function (options) {
    return new L.Graticule(options);
};
