/// <reference path="../_references.js" />
/// <reference path="../helpers/MapBuilder.js" />
/// <reference path="../helpers/MapManager.js" />
var MobileController = function () { };

MobileController.prototype = {
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

        var panelHtml = mobileView.getTaskPanel(this.containerId + '-mobile-panel');
        $('#' + this.containerId).html(panelHtml);

        this.attachHandlers();

        var parseDate = new Date();
        var currentDate = parseDate.getFullYear() + '-' + (parseDate.getMonth() + 1) + '-' + parseDate.getDate();

        this.taskPersister.listTaskByDay(this.accessToken, currentDate, function (data) {
            var tasks =self.taskPersister.dailyTasks = data;
            if (tasks.length === 0) {
                $('#' + self.containerId + '-mobile-panel').html('<div>Потребителят няма назначени задачи за деня</div>');
            } else {
                mapManager.createMap('map-container', 'mobile', { regions: tasks[0].regions, units: tasks[0].unit });


                var tasksHtml = mobileView.getTasksListName(tasks);
                $('#' + self.containerId + ' #col-tasks').html(tasksHtml);

                var tasksRegionsHtml = mobileView.getTasksRegions(tasks);
                $('#' + self.containerId + ' #col-description').html(tasksRegionsHtml);

                $('#' + self.containerId + ' #col-description ul').hide();
                $('#' + self.containerId + ' #col-tasks a:first').addClass('active');
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

            $('#col-tasks a').removeClass('active');
            $(this).addClass('active');
        });

        $('#btn-start-task').on('click', function (e) {
            var taskId = $('#col-tasks a.active').attr('id');
            var btn = $(this);
            self.taskPersister.setStarted(self.accessToken, taskId, function (data) {
                btn.attr('disabled', 'disabled');
            }, function () {
                debugger;
            });
        });

        $('#btn-end-task').on('click', function (e) {
            var taskId = $('#col-tasks a.active').attr('id');
            var btn = $(this);
            self.taskPersister.setFinished(self.accessToken, taskId, function (data) {
                btn.attr('disabled', 'disabled');
            }, function () {
                debugger;
            });
        });
    }
};