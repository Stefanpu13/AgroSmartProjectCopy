/// <reference path="../_references.js" />
/// <reference path="../persister/RegionPersister.js" />
/// <reference path="../view/MapView.js" />
/// <reference path="../_references.js" />
/// <reference path="../helpers/MapBuilder.js" />
/// <reference path="../helpers/MapManager.js" />
var ControlController = function () { };

ControlController.prototype = {
    containerId: null,
    accessToken: null,
    taskPersister: null,
    isInCurrentModule: false,

    init: function (containerId, accessToken) {
        this.containerId = containerId;
        this.accessToken = accessToken;
        this.taskPersister = new TaskPersister();
        this.taskPersister.init();
    },

    recieveCoordinates: function (unitId, lat, lng) {

        if (this.isInCurrentModule === true) {
            mapManager.updateLocation(unitId, lat, lng);
        }
    },

    generateLayout: function () {
        var self = this;

        this.isInCurrentModule = true;

        $('#' + this.containerId).empty();

        var panelHtml = controlView.getTaskPanel(this.containerId + '-mobile-panel');
        $('#' + this.containerId).html(panelHtml);

        this.attachHandlers();

        var parseDate = new Date();
        var currentDate = parseDate.getFullYear() + '-' + (parseDate.getMonth() + 1) + '-' + parseDate.getDate();

        this.taskPersister.listTasks(this.accessToken, function (data) {
            var tasks = self.taskPersister.dailyTasks = data;
            if (tasks.length === 0) {
                $('#' + self.containerId + '-mobile-panel').html('<div>Няма назначени задачи за деня</div>');
            } else {
                var mapObjects = tasks.map(function (t) {
                    return { regions: t.regions, units: t.unit };
                });
                mapManager.createMap('map-container', 'control', mapObjects);


                var tasksHtml = controlView.getTasksListName(tasks);
                $('#' + self.containerId + ' #col-tasks').html(tasksHtml);

                var tasksRegionsHtml = controlView.getTasksRegions(tasks);
                $('#' + self.containerId + ' #col-description').html(tasksRegionsHtml);

                $('#' + self.containerId + ' #col-description ul').hide();
                //$('#' + self.containerId + ' #col-tasks a:first').addClass('active');
                $('#' + self.containerId + ' #col-description ul:first').show();

            };
        }, function () {
            $('#' + self.containerId + '-mobile-panel').html('<div>Възникна грешка при зареждане на задачите!</div>');
        });
    },

    attachHandlers: function () {
        var self = this;

        $('#col-tasks').on('click', 'a', function (e) {
            $('#col-description ul').hide();

            // on click redraw map with new tasks and machines

            var taskId = $(this).attr('id');
            $('#col-description #regions' + taskId).show();

            // get regions and units for task -> 
            var task = self.taskPersister
                .dailyTasks
                .filter(function (t) { return t.id === Number(taskId); })[0];

            mapManager.redrawMap({ regions: task.regions, units: task.unit });

            // Change drop down to init value.
            $('#tasksFilterDropDown').val('-1');

            $('#col-tasks a').removeClass('active');
            $(this).addClass('active');
        });

        $('#tasksFilterDropDown').on('change', function (e) {
            var select = e.currentTarget;
            var option = select[select.selectedIndex];
            var filterFunc;
            var isActiveFilter = false;

            switch (option.value) {
                // Unstarted tasks
                case '0': filterFunc = function (t) { return t.status === 0 };
                    isActiveFilter = true;
                    break;
                    // started tasks
                case '1': filterFunc = function (t) { return t.status === 1 };
                    isActiveFilter = true;
                    break;
                    // finished tasks
                case '2': filterFunc = function (t) { return t.status === 2 };
                    isActiveFilter = true;
                    break;
                    // All tasks
                default:
                    filterFunc = function (t) { return true };
            }

            displayFilteredTasks(filterFunc);
            var container = $('#' + self.containerId);
            if (isActiveFilter) {
                container.find('.list-group-item').hide();
                container.find('.list-group-item[data-task-status=' + option.value + ']').show();
            }
            else {
                container.find('.list-group-item').show();
            }
            // if task button is chosen - deselect it. 
            $('#col-tasks a').removeClass('active');
        });

        function displayFilteredTasks(filterFunc) {
            var tasks = self.taskPersister.tasks.filter(function (t) {
                return filterFunc(t);
            });
            var regions = tasks.reduce(function (prevRegArr, currTask) {
                return prevRegArr.concat(currTask.regions);
            }, []);
            var units = tasks.reduce(function (prevUnitArr, currTask) {
                return prevUnitArr.concat(currTask.unit);
            }, []);

            mapManager.redrawMap({ regions: regions, units: units });
        }
    }
};