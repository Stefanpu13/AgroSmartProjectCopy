/// <reference path="google-maps-3-vs-1-0.js" />
var MapBuilder = (function (maps) {
    // TODO: delete this var when finished testing    
    var UNIT_DEFAULT_SCALE = 13;

    var selectedPointOptions = {
        icon: {
            path: maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            strokeWeight: 1,
            scale: 13,
            fillColor: 'yellow'
        }
    },
        // #region default options
        defaultMapOptions = {
            center: new maps.LatLng(42.239818, 25.300602),
            zoom: 9,
            mapTypeId: maps.MapTypeId.SATELLITE,
            disableDefaultUI: true
        },
        defaultPointIcon = {
            path: maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            strokeWeight: 1,
            scale: 9,
            fillColor: 'yellow'
        },
        defaultPointOptions = {
            icon: defaultPointIcon,
            draggable: true
        },
        defaultUnitOptions = {
            icon: {
                path: maps.SymbolPath.CIRCLE,
                fillOpacity: 1,
                strokeWeight: 1,
                scale: UNIT_DEFAULT_SCALE,
                fillColor: 'red'
            }
        },
        defaultRegionOptions = {
            strokeColor: 'yellow',
            strokeWeight: 3,
            editable: true
        },
        // #endregion

        mediator; // set in the 'MapBuilder' constructor.

    var MapObjectNameBox = (function () {
        //var infoBoxHTML = '<div id="region-name-info-box"></div>';

        function MapObjectNameBox(map, mapObjectInfo, position, containerClass) {
            this.div = $('<div></div>').addClass(containerClass || '')[0];
            this.map_ = map;
            this.mapObjectInfo = mapObjectInfo;
            this.position = position;

            this.setMap(map);
        }

        // Must be set before 'prototype' functions!!!
        MapObjectNameBox.prototype = new maps.OverlayView();

        MapObjectNameBox.prototype.onAdd = function () {
            var panes = this.getPanes();
            this.div.innerHTML = this.mapObjectInfo.name;

            panes.overlayImage.appendChild(this.div);
        };

        MapObjectNameBox.prototype.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }

        MapObjectNameBox.prototype.draw = function () {
            // set the position of the overlay to the position of the reference marker.
            var overlayProjection = this.getProjection(),
                pos = overlayProjection.fromLatLngToDivPixel(this.position);
            this.div.style.position = 'absolute';
            this.div.style.left = pos.x + 'px';
            this.div.style.top = pos.y + 'px';
        };

        return MapObjectNameBox;
    })();

    function Region(regionNamePosition, polygon, mapObjectInfo, regionStatus) {
        this.id = mapObjectInfo.id;
        this.polygon = polygon;
        this.mapObjectInfoBox =
            new MapObjectNameBox(polygon.getMap(), mapObjectInfo, regionNamePosition, 'region-name-info-box');
        // on region creation status might be 'restored' or 'created'.
        this.regionStatus = regionStatus;
    }

    function MapBuilder(map, mapOptions, eventMediator, mapObjects, viewMode) {
        map.setOptions(mapOptions);
        mediator = eventMediator;

        this.map = map;
        this.defaultPointOptions = setMarkerOptions(map, defaultPointOptions);
        this.defaultUnitOptions = setMarkerOptions(map, defaultUnitOptions)
        this.markers = [];
        this.regions = [];
        this.units = [];
        this.activeRegion = null;
        this.activeMarker = null;

        restoreMapObjects.call(this, mapObjects);
        //this.regions = this.restoreRegions(regions, mapManager.regionStatus.RESTORED);
        if (viewMode === 'edit') {
            attachEditModeEvents.apply(this);
        }
    }

    // #region Private functions

    // Note: if any of these private functions is called as method of the 'MapBuilder' object,
    // the 'this' value refers to that object.
    function restoreMapObjects(mapObjects) {
        this.regions = this.restoreRegions(mapObjects.regions, mapManager.regionStatus.RESTORED);
        this.units = this.restoreUnits(mapObjects.units);
    }

    function setMarkerOptions(map, options) {
        // copy the 'defaultPointOptions' onject to new object.
        var markerOptions = JSON.parse(JSON.stringify(options));
        markerOptions.map = map;
        return markerOptions;
    }

    function attachEditModeEvents() {
        // map functionality
        mediator.subscribe(this, 'editingModeOn', this.enableMapEditing);
        mediator.subscribe(this, 'editingModeOff', this.disableMapEditing);

        //maps.event.addListener(map, 'click', drawPolygonPoint);

        // 'Region' functionality
        mediator.subscribe(this, 'regionButtonClicked', this.regionCanBeBuilt);
        mediator.subscribe(this, 'editButtonClicked', this.editRegionInfo)
        mediator.subscribe(this, 'regionCreated', this.addRegion);
        mediator.subscribe(this, 'regionUpdated', this.modifyRegion);
        mediator.subscribe(this, 'regionDeleted', this.removeRegion);
        mediator.subscribe(this, 'saveRegions', this.saveRegions);

        // 'Point' functionality
        mediator.subscribe(this, 'pointDeleted', this.removePoint);
        mediator.subscribe(this, 'allPointsDeleted', this.deleteAllPoints);

        mediator.publish('editingModeOff');
    }

    function deleteAllRegions() {
        this.regions.forEach(function (r) {
            r.mapObjectInfoBox.setMap(null);
            r.polygon.setMap(null);
        });

        this.activeRegion = null;
        // deletes all elems in array.
        this.regions.length = 0;
    }

    function deleteAllUnits() {
        this.units.forEach(function (u) {
            u.unitMarker.setMap(null);
            u.unitNameBox.setMap(null);
        });

        this.units.length = 0;
    }

    function attachRegionPointEvents(marker) {
        var self = this;
        mediator.subscribe(marker, 'click', selectMarker);

        mediator.subscribe(marker, 'editingModeOff', function () {
            mediator.unsubscribe(marker, 'click');
            marker.setDraggable(false);
        });

        mediator.subscribe(marker, 'editingModeOn', function () {
            mediator.subscribe(marker, 'click', selectMarker);
            marker.setDraggable(true);
        });

        // attach marker events
        mediator.subscribe(marker, 'pointUnselected', function (markerOptions) {
            // If 'pointUnselected' is fired due to 'editingModeOff' event
            // the marker should be made undraggable. This is made in 'markerOptions'.
            marker.setOptions(markerOptions || defaultPointOptions);
            self.activeMarker = null;
        });

        function selectMarker(e) {
            if (self.activeMarker) {
                self.activeMarker.setOptions(defaultPointOptions);
            } else {
                // 'point selected' mode is entered only the first time.
                mediator.publish('pointSelected');
            }

            self.activeMarker = this;
            this.setOptions(selectedPointOptions);
        }
    }

    function createPoint(coords, pointOptions) {
        var markerOptions = pointOptions || this.defaultPointOptions,
            point;

        markerOptions.position = coords;
        point = new maps.Marker(markerOptions);

        return point;
    }

    // #endregion

    MapBuilder.prototype.editRegionInfo = function editRegionInfo() {
        mediator.publish('editRegionInfo', this.activeRegion.mapObjectInfoBox.mapObjectInfo);
    }

    // 'data' comes from publishing event.
    MapBuilder.prototype.modifyRegion = function modifyRegion(mapObjectInfo) {
        if (this.activeRegion.regionStatus !== mapManager.regionStatus.CREATED &&
            this.activeRegion.regionStatus !== mapManager.regionStatus.SAVED) {
            this.activeRegion.regionStatus = mapManager.regionStatus.MODIFIED;
        }

        this.activeRegion.mapObjectInfoBox.mapObjectInfo = mapObjectInfo;
        this.activeRegion.mapObjectInfoBox.div.innerHTML = mapObjectInfo.name;
    }

    MapBuilder.prototype.regionCanBeBuilt = function regionCanBeBuilt() {
        if (this.markers.length >= 3) {
            mediator.publish('regionCanBeBuilt');
        }
    };

    MapBuilder.prototype.enableMapEditing = function enableMapEditing() {
        var self = this;
        mediator.subscribe(this.map, 'click', function (e) {
            self.addRegionPoint(e);
            mediator.publish('regionUnselected pointUnselected');
        });
    };

    MapBuilder.prototype.disableMapEditing = function disableMapEditing() {
        mediator.unsubscribe(this.map, 'click');
    };

    MapBuilder.prototype.getRegionPath = function getRegionPath(points) {
        // return arrayf of 'mrakers' points.
        if (points && points.map) {
            return points.map(function (p) {
                // 'p' might be object of type: {lat, lng} or 'marker' object.
                var pos = (typeof p.getPosition === 'function') && p.getPosition();
                return new maps.LatLng(Number(p.lat || pos.lat()), Number(p.lng || pos.lng()));
            });
        } else {
            return this.markers.map(function (m) { return m.getPosition(); });
        }
    };

    MapBuilder.prototype.removePoints = function removePoints() {
        if (this.markers && this.markers.length !== undefined) {
            this.markers.map(function (m) {
                m.setMap(null);
            });
            this.markers.length = 0;
        }
    };

    MapBuilder.prototype.addRegionPoint = function addRegionPoint(e) {
        var coords = e.latLng,
            pointMarker;

        if (this.activeRegion) {
            this.activeRegion.polygon.setOptions({ editable: false });
            this.activeRegion = null;
        }

        // Invoke private function as method of this 'mapBuilder'.
        pointMarker = createPoint.call(this, coords);
        this.markers.push(pointMarker);
        attachRegionPointEvents.call(this, pointMarker);
    };

    MapBuilder.prototype.addUnit = function addUnit(unitModel) {
        var coords = new maps.LatLng(Number(unitModel.lat), Number(unitModel.lng)),
            unitMarker,
            unitNameBox;

        unitNameBox = new MapObjectNameBox(this.map, unitModel, coords, 'unit-name-info-box');
        unitMarker = createPoint.call(this, coords, this.defaultUnitOptions);

        return {
            unitMarker: unitMarker, unitNameBox: unitNameBox, id: unitModel.id, name: unitModel.name
        };
    }

    MapBuilder.prototype.removePoint = function removePoint() {
        if (this.activeMarker) {
            this.activeMarker.setMap(null);
            this.markers.splice(this.markers.indexOf(this.activeMarker), 1);
            this.activeMarker = null;
        }
    };

    MapBuilder.prototype.addRegion = function addRegion(regionModel) {
        var region,
            regionNamePosition,
            polygon,
            points,
            self = this;

        if (regionModel.points && regionModel.points.length >= 3) {
            regionNamePosition = new maps.LatLng(regionModel.points[0].lat, regionModel.points[0].lng);
        } else if (this.markers && this.markers.length > 0) {
            regionNamePosition = this.markers[0].getPosition();
        }

        if ((regionModel.points && regionModel.points.length >= 3) ||
            (this.markers && this.markers.length >= 3)) {
            points = regionModel.points || this.markers;

            defaultRegionOptions.path = this.getRegionPath(points);
            defaultRegionOptions.map = this.map;

            polygon = new maps.Polygon(defaultRegionOptions);
            region = new Region(regionNamePosition, polygon, regionModel, regionModel.regionStatus);

            this.regions.push(region);
            this.regions[this.regions.length - 1].polygon.setOptions({ editable: false });

            // Delete markers that have been drawed.
            this.removePoints();

            mediator.subscribe(polygon, 'click', selectRegion);
            mediator.subscribe(polygon.getPath(), 'insert_at set_at', function () {
                mediator.publish('regionUpdated', region.mapObjectInfoBox.mapObjectInfo);
            });
            mediator.subscribe(polygon, 'editingModeOff', function () {
                mediator.unsubscribe(polygon, 'click');
                polygon.setOptions({ editable: false });
            });

            mediator.subscribe(polygon, 'editingModeOn', function () {
                mediator.subscribe(polygon, 'click', selectRegion);
            });
        }

        return region;

        function selectRegion(e) {
            if (self.activeRegion) {
                self.activeRegion.polygon.setOptions({ editable: false });
            }

            polygon.setOptions({ editable: true });
            // Get the 'Region' object, whose polygon is the clicked polygon.
            self.activeRegion = self.regions.reduce(function (previousRegion, currentRegion) {
                return currentRegion.polygon === polygon ?
                    currentRegion : previousRegion;
            }, self.regions[0]);

            mediator.publish('regionSelected');
        }
    };

    MapBuilder.prototype.removeRegion = function removeRegion(data) {
        if (this.activeRegion) {
            // delete region name from map.
            this.activeRegion.mapObjectInfoBox.setMap(null);
            this.activeRegion.polygon.setMap(null);
            // remove region from 'regions'
            var activeRegionIndex = this.regions.indexOf(this.activeRegion);
            if (activeRegionIndex > -1) {
                // If this is a restored region - delete on 'save regions'.
                if (this.activeRegion.regionStatus !== mapManager.regionStatus.CREATED) {
                    this.activeRegion.regionStatus = mapManager.regionStatus.DELETED;
                } else { // not saved to db - just delete it from 'regions'.
                    this.regions.splice(activeRegionIndex, 1);
                }
            }
        }

        this.activeRegion = null;
    };

    MapBuilder.prototype.saveRegions = function saveRegions() {
        var regions = this.regions.map(function (region) {
            var regionModel = {};
            // 'getPath()' returns an 'MVCArray' element. See 
            // https://developers.google.com/maps/documentation/javascript/reference#MVCArray
            //'getArray()' returns an array of 'LatLng' elements. See: https://developers.google.com/maps/documentation/javascript/reference#LatLng
            regionModel.points =
                region.polygon
                .getPath()
                .getArray()
                .map(function (p, i) {
                    return {
                        lat: p.lat(),
                        lng: p.lng(),
                        index: i
                    }
                });

            regionModel.name = region.mapObjectInfoBox.mapObjectInfo.name;
            regionModel.description = region.mapObjectInfoBox.mapObjectInfo.description;
            regionModel.regionStatus = region.regionStatus;
            // '0', undefined, null, 0 will not work
            if (region.id) {
                regionModel.id = region.id;
            }


            return regionModel;
        }),
        deletedRegions = [],
        modifiedRegions = [],
        createdRegions = [];

        // Write regions to local storage
        //localStorage.setItem('regions', JSON.stringify(regions));
        regions.forEach(function (region) {
            //console.log('index: ' + i + 'status: ' + region.regionStatus);
            switch (region.regionStatus) {
                case mapManager.regionStatus.CREATED:
                    createdRegions.push(region);
                    break;
                case mapManager.regionStatus.DELETED:
                    deletedRegions.push(region);
                    break;
                case mapManager.regionStatus.MODIFIED:
                    modifiedRegions.push(region);
                    break;
                default:
            }

            region.regionStatus = mapManager.regionStatus.SAVED;
        });

        mediator.publish('createdRegions', createdRegions);
        mediator.publish('modifiedRegions', modifiedRegions);
        mediator.publish('deletedRegions', deletedRegions);

        mediator.publish('editingModeOff');

        return regions;
    };

    MapBuilder.prototype.restoreRegions = function restoreRegions(regionModels, regionStatus) {
        var self = this, region,
        regions = [];

        if (regionModels && regionModels.forEach) {
            regionModels.forEach(function (regionModel) {
                regionModel.regionStatus = regionStatus;
                region = self.addRegion(regionModel);
                regions.push(region);
            });
        }

        return regions;
    }

    MapBuilder.prototype.restoreUnits = function restoreUnits(unitModels) {
        var self = this,
            unit,
            units = [];

        if (unitModels && unitModels.forEach) {
            unitModels.forEach(function (unitModel) {
                unit = self.addUnit(unitModel);
                units.push(unit);
            });
        } else if (unitModels !== undefined) {
            unit = self.addUnit(unitModels);
            units.push(unit)
        }

        return units
    }

    MapBuilder.prototype.deleteAllPoints = function deleteAllPoints() {
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });
        this.markers.length = 0;
        this.activeMarker = null;
    };

    MapBuilder.prototype.drawNewMapObjects = function redrawMapObjects(mapObjects) {
        var newRegions = mapObjects.regions,
            newUnits = mapObjects.units;

        deleteAllRegions.call(this);
        deleteAllUnits.call(this);

        this.regions = this.restoreRegions(newRegions);
        this.units = this.restoreUnits(newUnits);
    }

    MapBuilder.prototype.updateUnitLocation = function updateUnitLocation(unitId, lat, lng) {

        // TODO: deelte 'totalOffset'        
        var newCoords = new maps.LatLng(Number(lat), Number(lng));

        var unit = this.units.filter(function (u) {
            return u.id === unitId;
        })[0];


        var currentScale = 0;

        if (unit !== undefined) {
            unit.unitMarker.setPosition(newCoords);
            unit.unitMarker.setOptions({
                icon: {
                    scale: currentScale
                }
            });

            // Animate unit movement.
            var intervalHandle = setInterval(function () {
                if (++currentScale <= UNIT_DEFAULT_SCALE) {
                    unit.unitMarker.setOptions({
                        icon: {
                            path: maps.SymbolPath.CIRCLE,
                            fillOpacity: 1,
                            strokeWeight: 1,
                            scale: currentScale,
                            fillColor: 'red'
                        }
                    });
                } else {
                    clearInterval(intervalHandle);
                }
            }, 15);

            unit.unitNameBox.setMap(null);


            unit.unitNameBox =
                new MapObjectNameBox(this.map, { name: unit.name }, newCoords, 'unit-name-info-box');
        }    
    }


    return MapBuilder;
})(google.maps);