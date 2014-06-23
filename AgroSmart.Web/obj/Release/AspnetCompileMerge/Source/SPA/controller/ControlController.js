/// <reference path="../_references.js" />
/// <reference path="../persister/RegionPersister.js" />
/// <reference path="../view/MapView.js" />
var ControlController = function () { };

ControlController.prototype = {
    containerId: null,
    regionPersister: null,
    accessToken: null,
    mapManager: null,

    init: function (containerId, accessToken) {
        this.containerId = containerId,
        this.accessToken = accessToken,
        this.mapManager = mapManager;
        this.taskPersister = new TaskPersister();
    },

    generateLayout: function (viewMode) {
        var self = this,
            mapContainerHTML;

        // TODO: See what method will return the 'tasks' data that
        // should be visualised in 'control' module.
        this.taskPersister.listTasks(this.accessToken, function (tasks) {
            var allRegionsArrays = tasks.map(function (t) { return t.regions; });            
            var mapObjects = {
                // concatenate all regions from all tasks.
                regions: [].concat.apply([], allRegionsArrays),
                units: tasks.map(function (t) { return t.unit; })
            };

            mapContainerHTML = mapView.generateMap(self.containerId, viewMode);
            $('#' + self.containerId).html(mapContainerHTML);
            self.mapManager.createMap('map-canvas', viewMode, mapObjects, this.map);
            self.attachHandlers();

        }, function error() { });

        this.regionPersister.listRegionsWithPoints(this.accessToken, function (data) {
            var regions = data;
            self.unitPersister.listWithCoordinates(self.accessToken, function (units) {
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
        // Attach 

    }
};