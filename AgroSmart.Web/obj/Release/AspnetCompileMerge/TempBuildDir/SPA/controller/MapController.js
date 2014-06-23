/// <reference path="../_references.js" />
/// <reference path="../persister/RegionPersister.js" />
/// <reference path="../view/MapView.js" />
var MapController = function () { };

MapController.prototype = {
    containerId: null,
    regionPersister: null,
    accessToken: null,
    mapManager: null,
    isInCurrentModule: false,

    init: function (containerId, accessToken) {
        this.containerId = containerId,
        this.accessToken = accessToken,
        this.mapManager = mapManager;
        this.regionPersister = new RegionPersister();
        this.unitPersiter = new UnitPersister();
        this.regionPersister.init();
        this.unitPersiter.init();
    },

   

    generateLayout: function (isAdmin) {
        var viewMode = 'edit';
        this.generateMapLayout(viewMode);

        this.isInCurrentModule = true;
    },

    generateMapLayout: function (viewMode) {
        var self = this,
            mapContainerHTML;

        this.regionPersister.listRegionsWithPoints(this.accessToken, function (data) {
            var mapObjects = {
                regions: data
            };

            mapContainerHTML = mapView.generateMap(self.containerId, viewMode);
            $('#' + self.containerId).html(mapContainerHTML);
            self.mapManager.createMap('map-canvas', viewMode, mapObjects, this.map);
            self.attachHandlers();
        }, function () {

        });
    },

    generateControlMapLayout: function (viewMode) {
        var self = this,
         mapContainerHTML;

        this.regionPersister.listRegionsWithPoints(this.accessToken, function (data) {
            var regions = data;
            self.unitPersister.listWithCoordinates(self.accessToken, function(units){
                var mapObjects = {
                    regions: regions,
                    units: units
                };

                mapContainerHTML = mapView.generateMap(self.containerId, viewMode);
                $('#' + self.containerId).html(mapContainerHTML);
                self.mapManager.createMap('map-canvas', viewMode, mapObjects, this.map);
                self.attachHandlers();
            }, function () { });
     
        }, function () { });
    },

    attachHandlers: function () {
        var regionPersister = this.regionPersister,
            self = this;
        this.mapManager.mediator.subscribe(regionPersister, 'createdRegions', function (regions) {
            if (regions && regions.length) {
                this.createdRegions = regions;
                this.createRegions(self.accessToken);
            }
        });

        this.mapManager.mediator.subscribe(regionPersister, 'deletedRegions', function (regions) {
            if (regions && regions.length) {
                this.deletedRegions = regions;
                this.deleteRegions(self.accessToken)
            }
        });

        this.mapManager.mediator.subscribe(regionPersister, 'modifiedRegions', function (regions) {
            this.modifiedRegions = regions;
            if (regions && regions.length) {
                this.modifiedRegions = regions;
                this.modifyRegions(self.accessToken);
            }
        });
    }
};