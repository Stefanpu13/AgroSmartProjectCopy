/// <reference path="google-maps-3-vs-1-0.js" />
var MapBuilder = (function (maps) {
    var selectedMarkerOptions = {
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
        defaultMarkerIcon = {
            path: maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            strokeWeight: 1,
            scale: 9,
            fillColor: 'yellow'
        },
        defaultMarkerOptions = {
            icon: defaultMarkerIcon,
            draggable: true
        },
        defaultPolygonOptions = {
            strokeColor: 'yellow',
            strokeWeight: 3,
            editable: true
        },
        // #endregion
        mediator; // set in the 'MapBuilder' constructor.

    var BlockInfoBox = (function () {
        var infoBoxHTML = '<div id="block-name-info-box"></div>';

        function BlockInfoBox(map, blockInfo, position) {
            this.div = null;
            this.map_ = map;
            this.blockInfo = blockInfo;
            this.position = position;

            this.setMap(map);
        }

        // Must be set before 'prototype' functions!!!
        BlockInfoBox.prototype = new maps.OverlayView();

        BlockInfoBox.prototype.onAdd = function () {
            var panes = this.getPanes();

            this.div = $(infoBoxHTML)[0];
            this.div.innerHTML = this.blockInfo.name;

            panes.overlayImage.appendChild(this.div);
        };

        BlockInfoBox.prototype.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }

        BlockInfoBox.prototype.draw = function () {
            // set the position of the overlay to the position of the reference marker.
            var overlayProjection = this.getProjection(),
                pos = overlayProjection.fromLatLngToDivPixel(this.position);
            this.div.style.position = 'absolute';
            this.div.style.left = pos.x + 'px';
            this.div.style.top = pos.y + 'px';
        };

        return BlockInfoBox;
    })();

    function Block(blockNamePosition, polygon, blockInfo) {        
        this.polygon = polygon;               
        this.blockInfoBox = new BlockInfoBox(polygon.getMap(), blockInfo, blockNamePosition);
    }

    function MapBuilder(map, mapOptions, eventMediator, blocks) {
        map.setOptions(mapOptions);
        mediator = eventMediator;

        this.map = map;
        this.defaultMarkerOptions = setDefaultMarkerOptions(map);
        this.blocks = this.restoreBlocks(blocks);
        this.markers = [];
        this.activeBlock = null;
        this.activeMarker = null;

        
        attachBuilderFunctionality.apply(this);
    }

    // #region Private functions

    // Note: if any of these private functions is called as method of the 'MapBuilder' object,
    // the 'this' value refers to that object.
    function setDefaultMarkerOptions(map) {
        // copy the 'defaultMarkerOptions' onject to new object.
        var markerOptions = JSON.parse(JSON.stringify(defaultMarkerOptions));
        markerOptions.map = map;
        return markerOptions;
    }

    function attachBuilderFunctionality() {
        // map functionality
        mediator.subscribe(this, 'editingModeOn', this.enableMapEditing);
        mediator.subscribe(this, 'editingModeOff', this.disableMapEditing);

        //maps.event.addListener(map, 'click', drawPolygonPoint);

        // 'Block' functionality
        mediator.subscribe(this, 'blockButtonClicked', this.blockCanBeBuilt);
        mediator.subscribe(this, 'editButtonClicked', this.editBlockInfo)
        mediator.subscribe(this, 'blockCreated', this.addBlock);
        mediator.subscribe(this, 'blockUpdated', this.updateBlockInfo);
        mediator.subscribe(this, 'blockDeleted', this.removeBlock);
        mediator.subscribe(this, 'saveBlocks', this.saveBlocks);

        // 'Point' functionality
        mediator.subscribe(this, 'pointDeleted', this.removePoint);
        mediator.subscribe(this, 'allPointsDeleted', this.deleteAllPoints);

        mediator.publish('editingModeOff');
    }

    function createMarker(coords) {

        var markerOptions = this.defaultMarkerOptions,
            marker,
            self = this;

        markerOptions.position = coords;
        marker = new maps.Marker(markerOptions);

        this.markers.push(marker);

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
            marker.setOptions(markerOptions || defaultMarkerOptions);
            self.activeMarker = null;
        });

        return marker;

        function selectMarker(e) {
            if (self.activeMarker) {
                self.activeMarker.setOptions(defaultMarkerOptions);
            } else {
                // 'point selected' mode is entered only the first time.
                mediator.publish('pointSelected');
            }

            self.activeMarker = this;
            this.setOptions(selectedMarkerOptions);
        }
    }

    function restorePolygons(blocks) {
        var self = this;

        this.blocks = [];

        if (blocks && blocks.forEach) {
            blocks.forEach(function (block) {
                var blockCoords = [],
                    polygon;

                if (block.points) {
                    block.points.forEach(function (point) {
                        blockCoords.push(new maps.LatLng(point.lat, point.lng));
                    });
                }

                polygon = this.addBlock(blockCoords);
                this.blocks.push(polygon);
            });
        }
    }
 
    // #endregion

    MapBuilder.prototype.editBlockInfo = function editBlockInfo() {
        mediator.publish('editBlockInfo', this.activeBlock.blockInfoBox.blockInfo);
    }

    MapBuilder.prototype.updateBlockInfo = function updateBlockInfo(blockInfo) {
        this.activeBlock.blockInfoBox.blockInfo = blockInfo;
        this.activeBlock.blockInfoBox.div.innerHTML = blockInfo.name;
    }

    MapBuilder.prototype.blockCanBeBuilt = function blockCanBeBuilt() {
        if (this.markers.length >= 3) {
            mediator.publish('blockCanBeBuilt');
        }
    };

    MapBuilder.prototype.enableMapEditing = function enableMapEditing() {
        var self = this;        
        mediator.subscribe(this.map, 'click', function (e) {
            self.addPoint(e);
            mediator.publish('blockUnselected pointUnselected');
        });
    };

    MapBuilder.prototype.disableMapEditing = function disableMapEditing() {
        mediator.unsubscribe(this.map, 'click');   
    };

    MapBuilder.prototype.getBlockPath = function getBlockPath(points) {
        // return arrayf of 'mrakers' points.
        if (points && points.map) {
            return points.map(function (p) {
                return new maps.LatLng(Number(p.lat), Number(p.lng));
            });
        } else {
            return this.markers.map(function (m) { return m.getPosition(); });
        }
    };

    MapBuilder.prototype.removeMarkers = function removeMarkers() {
        if (this.markers && this.markers.length !== undefined) {
            this.markers.map(function (m) {
                m.setMap(null);
            });
            this.markers.length = 0;
        }
    };

    MapBuilder.prototype.addPoint = function addPoint(e) {
        var coords = e.latLng;

        if (this.activeBlock) {
            this.activeBlock.polygon.setOptions({ editable: false });
            this.activeBlock = null;
        }

        // Involke private function as method of this 'mapBuilder'.
        createMarker.call(this, coords);
    };

    MapBuilder.prototype.removePoint = function removePoint() {
        if (this.activeMarker) {
            this.activeMarker.setMap(null);
            this.markers.splice(this.markers.indexOf(this.activeMarker), 1);
            this.activeMarker = null;
        }
    };

    MapBuilder.prototype.addBlock = function addBlock(blockModel) {
        var block,
            blockNamePosition,
            polygon,
            self = this;

        this.blocks = this.blocks || [];
        if (blockModel.points) {
            blockNamePosition = new maps.LatLng(blockModel.points[0].lat, blockModel.points[0].lng);
        } else if(this.markers && this.markers.length > 0) {
            blockNamePosition = this.markers[0].getPosition();
        }

        if (blockModel.points || this.markers.length >= 3) {
            defaultPolygonOptions.path = this.getBlockPath(blockModel.points);
            defaultPolygonOptions.map = this.map;

            polygon = new maps.Polygon(defaultPolygonOptions);
            
            block = new Block(blockNamePosition, polygon, blockModel);

            this.blocks.push(block);
            this.blocks[this.blocks.length - 1].polygon.setOptions({ editable: false });

            // Delete markers that have been drawed.
            this.removeMarkers();

            mediator.subscribe(polygon, 'click', selectBlock);
            mediator.subscribe(polygon, 'editingModeOff', function () {
                mediator.unsubscribe(polygon, 'click');
                polygon.setOptions({ editable: false });
            });

            mediator.subscribe(polygon, 'editingModeOn', function () {
                mediator.subscribe(polygon, 'click', selectBlock);
            });
        }

        return block;

        function selectBlock(e) {
            if (self.activeBlock) {
                self.activeBlock.polygon.setOptions({ editable: false });
            }

            polygon.setOptions({ editable: true });
            // Get the 'Block' object, whose polygon is the clicked polygon.
            self.activeBlock = self.blocks.reduce(function (previousBlock, currentBlock) {
                return currentBlock.polygon === polygon ?
                    currentBlock : previousBlock;
            }, self.blocks[0]);

            mediator.publish('blockSelected');
        }
    };    

    MapBuilder.prototype.removeBlock = function removeBlock() {
        if (this.activeBlock) {
            // delete block name from map.
            this.activeBlock.blockInfoBox.setMap(null);
            this.activeBlock.polygon.setMap(null);
            // remove block from 'blocks'
            var activeBlockIndex = this.blocks.indexOf(this.activeBlock);
            if (activeBlockIndex > -1) {
                this.blocks.splice(activeBlockIndex, 1);
            }
        }
        
        this.activeBlock = null;
    };

    MapBuilder.prototype.saveBlocks = function saveBlocks() {
        var blocks = this.blocks.map(function (block) {
            var blockModel = {};
            // 'getPath()' returns an 'MVCArray' element. See 
            // https://developers.google.com/maps/documentation/javascript/reference#MVCArray
            //'getArray()' returns an array of 'LatLng' elements. See: https://developers.google.com/maps/documentation/javascript/reference#LatLng
            blockModel.points =
                block.polygon.getPath().getArray().map(function (p) { return { lat: p.lat(), lng: p.lng() } });
            blockModel.name = block.blockInfoBox.blockInfo.name;
            blockModel.description = block.blockInfoBox.blockInfo.description;
            
            return blockModel;
        });

        // Write blocks to local storage
        localStorage.setItem('blocks', JSON.stringify(blocks));

        return blocks;
    };

    MapBuilder.prototype.restoreBlocks = function restoreBlocks(blockModels) {
        var self = this, block,
        blocks = [];

        if (blockModels && blockModels.forEach) {
            blockModels.forEach(function (blockModel) {
                block = self.addBlock(blockModel);
                blocks.push(block);
            });
        }

        return blocks;
    }

    MapBuilder.prototype.deleteAllPoints = function deleteAllPoints() {
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });
        this.markers.length = 0;
        this.activeMarker = null;
    };

    return MapBuilder;
})(google.maps);