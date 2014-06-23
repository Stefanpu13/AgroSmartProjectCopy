/// <reference path="../Scripts/jquery-ui-1.10.4.min.js" />
/// <reference path="../Scripts/jquery-ui-1.10.4.js" />
/// <reference path="../Scripts/jquery-2.1.1.js" />
/// <reference path="google-maps-3-vs-1-0.js" />

var menu = (function (maps) {
    var mediator,
        menuMap,
        menuItems = (function () {
            button = (function () {
                var editingOnHandlerObject = {
                    type: 'editingModeOn', handler: show
                },
                    editingOffHandlerObject = {
                        type: 'editingModeOff', handler: hide
                    }, createdHidden = true;

                var Button = function (controlContent, events, position, createdHidden) {
                    this.html = createButtonControl(controlContent, createdHidden);
                    this.map = menuMap;
                    this.position = position;
                    this.map.controls[position].push(this.html);

                    var self = this;
                    events.forEach(function (e) {
                        mediator.subscribe(self.html, e.type, e.handler);
                    });
                };

                var regionButton = (function () {
                    var position = maps.ControlPosition.LEFT,
                        saveRegionsButtonPos = maps.ControlPosition.BOTTOM_LEFT;

                    function create(buttonAction) {
                        var button;
                        switch (buttonAction) {
                            case 'delete':
                                // create 'delete button'
                                button = new Button('Delete Region', [{
                                    type: 'click', handler: publish('regionDeleted regionUnselected', { regionStatus: mapManager.regionStatus.DELETED })
                                }, {
                                    type: 'regionSelected', handler: show
                                }, {
                                    type: 'regionUnselected editingModeOff', handler: hide
                                }], position, createdHidden);
                                break;
                            case 'build':
                                // When button is clicked region is not necessary created. 
                                // 'regionButtonClicked' is fired and then builder fires 'regionCanbeBuilt'
                                // if at least 3 markers are present.
                                button = new Button('Build Region', [{
                                    type: 'click', handler: publish('regionButtonClicked')
                                }, {
                                    type: 'regionCanBeBuilt', handler: showRegionWindow
                                }, editingOnHandlerObject, editingOffHandlerObject], position, createdHidden);
                                break;
                            case 'edit':
                                button = new Button('Edit region info', [{
                                    type: 'click', handler: publish('editButtonClicked')
                                }, {
                                    type: 'editRegionInfo', handler: showRegionWindow
                                }, {
                                    type: 'regionSelected', handler: show
                                }, {
                                    type: 'regionUnselected editingModeOff', handler: hide
                                }], position, createdHidden);
                                break;
                            case 'saveAll':
                                button = new Button('Save Regions',
                                    [{
                                        type: 'click', handler: publish('saveRegions regionUnselected')
                                    }, {
                                        type: 'editingModeOn', handler: show
                                    }, { type: 'editingModeOff', handler: hide }], saveRegionsButtonPos, createdHidden);
                                break;
                            default:
                        }

                        return button;
                    }

                    function showRegionWindow(mapObjectInfo) {
                        var dialogForm = $("#dialog-form"),
                            name = dialogForm.find('#name'),
                            description = dialogForm.find('#descritpion'),
                            minRegionNameLength = 3,
                            submitButtonName,
                            eventPublished,
                            regionStatus;

                        // If region is edited then it current data should be displayed.
                        if (mapObjectInfo !== undefined) {
                            name.val(mapObjectInfo.name);
                            description.val(mapObjectInfo.description);
                            submitButtonName = "Update Region";
                            eventPublished = 'regionUpdated';
                            regionStatus = mapManager.regionStatus.MODIFIED;
                        } else { // It is new region - reset 'region info' form.
                            name.val('');
                            description.val('');
                            submitButtonName = "Create Region";
                            eventPublished = 'regionCreated pointUnselected';
                            regionStatus = mapManager.regionStatus.CREATED;
                        }

                        dialogForm.dialog({
                            autoOpen: false,
                            height: 400,
                            width: 350,
                            modal: true,
                            position: 'center',
                            buttons: [{
                                text: submitButtonName, click: function submitRegionInfo() {
                                    var newRegionInfo;
                                    if (name.val().length < minRegionNameLength) {
                                        name.addClass("ui-state-error");
                                        displayError("Region name must be at least " + minRegionNameLength + " characters long!");

                                    } else {
                                        newRegionInfo = {
                                            name: name.val(),
                                            description: description.val(),
                                            regionStatus: regionStatus
                                        };

                                        mediator.publish(eventPublished, newRegionInfo);
                                        $(this).dialog("close");
                                    }
                                }
                            }]
                        });
                        dialogForm.dialog('open');
                    }

                    function displayError(t) {
                        var errorContainer = $('#error-content');

                        errorContainer.text(t)
                            .addClass("ui-state-highlight");

                        setTimeout(function () {
                            errorContainer.text('Fill in region name and description')
                                .removeClass("ui-state-highlight");
                        }, 2500);
                    }

                    return {
                        create: create
                    };
                })();

                var pointButton = (function () {
                    var position = maps.ControlPosition.RIGHT;

                    function create(buttonAction) {
                        var button;

                        switch (buttonAction) {
                            case 'deleteAll':
                                button = new Button('Delete all points',
                                    [{
                                        type: 'click', handler: publish('allPointsDeleted pointUnselected')
                                    }, editingOnHandlerObject, editingOffHandlerObject], position, createdHidden);
                                break;
                            case 'delete':
                                button = new Button('Delete Point',
                                    [{
                                        type: 'click', handler: publish('pointDeleted pointUnselected')
                                    }, {
                                        type: 'pointSelected', handler: show

                                    }, {
                                        type: 'pointUnselected editingModeOff', handler: hide
                                    }], position, createdHidden);
                                break;
                            default:
                        }

                        return button;
                    }

                    return {
                        create: create
                    };

                })();

                var globalButton = (function () {
                    var position = maps.ControlPosition.TOP,
                        isEditingMode = false;

                    function toggleEditingMode() {
                        isEditingMode = !isEditingMode;

                        // Call functions on button
                        if (isEditingMode) {
                            editingModeOn.apply(this);
                        } else {
                            editingModeOff.apply(this);
                        }
                    }

                    function editingModeOff() {
                        mediator.publish('editingModeOff pointUnselected regionUnselected', { markerOptions: { draggable: false } });
                        $(this).find('.control').first().html('Enable editing');
                    }

                    function editingModeOn() {
                        mediator.publish('editingModeOn');
                        $(this).find('.control').first().html('Disable editing');
                    }

                    function create(buttonAction) {
                        var button;
                        switch (buttonAction) {
                            case 'edit':
                                button = new Button('Enable editing', [{
                                    type: 'click', handler: toggleEditingMode
                                }, {
                                    type: 'saveRegions', handler: editingModeOff

                                }, {
                                    type: 'editingModeOff', handler: function () { isEditingMode = false; }
                                }], position);
                                break;
                            default:
                                break;
                        }

                        return button;
                    }

                    return {
                        create: create
                    };
                })();

                // 'this' refers to 'self.html'. See  event handling attachment in 'Button'.
                // #region visibility
                function show() {
                    $(this).removeClass('control-container-hidden');
                }

                function hide() {
                    $(this).addClass('control-container-hidden');
                }
                // #endregion

                function createButtonControl(controlName, createdHidden) {
                    var buttonHTML = '<div class="control-container">' +
                        '<div class="control">' + controlName + '</div></div>',
                        container = $(buttonHTML);

                    if (createdHidden === true) {
                        container.addClass('control-container-hidden');
                    }

                    // return the 'Element' object.
                    return container[0];
                }

                function publish(eventType, data) {
                    return function () { mediator.publish(eventType, data); };
                }
                // Creates button based on its type
                function create(buttonSubType) {
                    var separatorIndex = buttonSubType.indexOf('.'),
                        supType = buttonSubType.substr(0, separatorIndex),
                        buttonAction = buttonSubType.substr(separatorIndex + 1),
                        button;

                    switch (supType) {
                        case 'region':
                            button = regionButton.create(buttonAction); // TODO: should return button.
                            break;
                        case 'point':
                            button = pointButton.create(buttonAction);
                            break;
                        case 'global':
                            button = globalButton.create(buttonAction);
                            break;
                        default:
                    }

                    return button;
                }

                return {
                    create: create
                };
            })();

            function create(menuItemType) {
                var separatorIndex = menuItemType.indexOf('.');
                var itemMainType = menuItemType.substr(0, separatorIndex);
                var itemSubType = menuItemType.substr(separatorIndex + 1),
                    item;

                switch (itemMainType) {
                    case 'button':
                        item = button.create(itemSubType);
                        break;
                    default:
                        break;
                }
            }

            return {
                create: create
            };
        })();

    function Menu(map, menuPosition, eventMediator) {
        this.map = map;
        this.menuPosition = menuPosition || maps.ControlPosition.TOP_CENTER;
        this.menuItems = menuItems;
        // TODO: 'mediator' should be initialized in 'create' as this constructor will be hidden.
        mediator = eventMediator;

        menuMap = map;
    }

    function create(viewMode, initMenuItems) {

        switch (viewMode) {
            case 'edit':
                createEditModeMenu();
                break;
            case 'control':
                createControlModeMenu();
                break;
            case 'mobile':
                createMobileModeMenu();
                break;
            default:
                break;

        }
    }

    function createControlModeMenu() { }

    function createMobileModeMenu() { }

    function createEditModeMenu() {
        // Buttons will be added to the map in 'Button' constructor
        // in the order they were invoked.       
        var startEditingButton = menuItems.create('button.global.edit'),
            createRegionButton = menuItems.create('button.region.build'),
            deleteRegionButton = menuItems.create('button.region.delete'),
            editRegionButton = menuItems.create('button.region.edit'),
            saveAllRegionsButton = menuItems.create('button.region.saveAll'),
            deleteAllPointsButton = menuItems.create('button.point.deleteAll'),
            deletePointButton = menuItems.create('button.point.delete');
    }

    return {
        Menu: Menu,
        create: create
    };
})(google.maps);
