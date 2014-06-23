/// <reference path="../_references.js" />
/// <reference path="../persister/RegionPersister.js" />
/// <reference path="../view/MapView.js" />
var MapController = function () { };

MapController.prototype = {
    containerId: null,
    regionPersister: null,
    accessToken: null,
    mapManager: null,
    menuContainerId:null,
    isInCurrentModule: false,

    init: function (containerId, accessToken) {
        this.containerId = containerId;
        this.menuContainerId = 'menu-container';
        this.accessToken = accessToken;
        this.mapManager = mapManager;
        this.regionPersister = new RegionPersister();
        this.unitPersiter = new UnitPersister();
        this.regionPersister.init();
        this.unitPersiter.init();
        
    },

   

    generateLayout: function () {
        var viewMode = 'edit';
        this.generateMapLayout(viewMode);

        this.isInCurrentModule = true;
    },

    generateMapLayout: function (viewMode) {
        var self = this;

        this.regionPersister.listRegionsWithPoints(this.accessToken, function (data) {
            var mapObjects = {
                regions: data
            };

            mapView.generateMap(self.containerId, viewMode);            
            self.mapManager.createMap('map-canvas', self.menuContainerId, viewMode, mapObjects);
            self.attachHandlers();
        }, function () {

        });
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