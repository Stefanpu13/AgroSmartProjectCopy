/// <reference path="../_references.js" />
var TaskController = function () { };

TaskController.prototype = {
    containerId: null,
    taskPersister: null,
    unitPersister: null,
    regionPersister: null,
    accessToken: null,

    init: function (containerId, accessToken) {
        this.containerId = containerId;
        this.accessToken = accessToken;
        this.taskPersister = new TaskPersister();
        this.taskPersister.init();
        this.unitPersister = new UnitPersister();
        this.unitPersister.init();
        this.regionPersister = new RegionPersister();
        this.regionPersister.init();
    },

    generateLayout: function () {
        var tasks;
        var self = this;
        this.taskPersister.listTasks(this.accessToken, function (data) {
            tasks = data;
            var tasksHtml = taskView.getTasksList(self.containerId + '-tasks-list', tasks);
            $('#' + self.containerId).html(tasksHtml);

            var tasksListHtml = taskView.getOnlyTasksList(tasks);
            $('#' + self.containerId + '-tasks-list tbody').html(tasksListHtml);
            self.attachHandlers();

        }, function () {
            $('#' + self.containerId).html('<div>Възникна проблем със зареждането на задачите!</div>');

        })
    },
    
    renderFormForNewTasks: function () {
        var ranges = null;
        var units = null;

        var self = this;
        this.unitPersister.list(this.accessToken, function (data) {                
            units = data;
            var containerId = self.containerId;
            self.regionPersister.listRegions(self.accessToken, function (data) {                    
                ranges = data;
                var newTaskHtml = '';
                if (ranges.length === 0) {
                    newTaskHtml = '<div>Все още няма дефинирани региони.</div>';
                } else if (units.length === 0) {
                    newTaskHtml = '<div>Все още няма дефинирани машини.</div>';
                } else {
                    newTaskHtml = taskView.addNewTask(self.containerId + '-new-task', ranges, units);
                };

                $('#' + self.containerId + ' div.panel-body').append(newTaskHtml);
                $('#add-new-task-form').hide();
            }, function () {
                var errorHtml = '<div>Грешка при зареждане на регионите!</div>'
                $('#' + self.containerId + ' div.panel-body').append(errorHtml);
                $('#add-new-task-form').hide();
            });
        }, function () {
            var errorHtml = '<div>Грешка при зареждане на машините!</div>'
            $('#' + self.containerId + ' div.panel-body').append(errorHtml);
            $('#add-new-task-form').hide();
        });
    },

    attachHandlers: function () {
        var self = this;

        $('#frm-new-task').on('click', '#save-new-task', function (e) {
            e.preventDefault();
            var newTask = {
                name: $('#taskInput').val(),
                description: $('#descriptionArea').val(),
                regions: [],
                unit: {
                    id: $('#unitDropDown').val()
                },
                assignedDate: $('#planningDate').val()
            };


            $('#all-ranges  input:checkbox').each(function () {
                var sThisVal = (this.checked ? $(this).val() : "");

                if (sThisVal !== "") {
                    newTask.regions.push({
                        id: sThisVal
                    });
                };
            });

            if (!newTask.name) {
                return;
            }

            if (newTask.regions.length === 0) {
                return;
            }

            if (!newTask.assignedDate) {
                return;
            }

            if (!newTask.unit.id) {
                return;
            }

            self.taskPersister.addNewTask(self.accessToken, newTask, function (data) {
                
                var updateListTasksHtml = taskView.getOnlyTasksList(data);
                $('#main-container-tasks-list tbody').empty();
                $('#main-container-tasks-list tbody').html(updateListTasksHtml);
                $('#cancel-new-task').trigger('click');

            }, function () {
                $('#main-container-tasks-list tbody').html('<div>Възникна проблем при запис на задачата!</div>');
            });
        });

        $('#add-new-task-form').tooltip({
            placement: 'left',
            title: 'Добави задача'
        });

        $('#btn-remove-task').tooltip({
            placement: 'left',
            title: 'Изтрий задача'
        });
        
        $("[data-toggle='tooltip']").tooltip();

        $('#frm-new-task').on('click', '#add-new-task-form', function (e) {        
            self.renderFormForNewTasks();
         //   $('#main-container-new-task').show();
            $(this).hide();
        });        

        $('#frm-new-task').on('click', '#cancel-new-task', function (e) {
            e.preventDefault();
           // $(this).parents('form').hide();
            $('#main-container-new-task').remove();
            $('#add-new-task-form').show();
        })

        $('#' + this.containerId + '-tasks-list').on('click', '#btn-remove-task', function () {
            var taskToRemoveId = $(this).closest('tr').attr('id');
            var task = {
                id: taskToRemoveId
            };
            self.taskPersister.deleteTask(self.accessToken, JSON.stringify(task), function (data) {
                $('#main-container-tasks-list tbody').empty();
                self.taskPersister.listTasks(self.accessToken, function (data) {
                    var updateListTasksHtml = taskView.getOnlyTasksList(data);                    
                    $('#main-container-tasks-list tbody').html(updateListTasksHtml);
                }, function () {
                    $('#main-container-tasks-list tbody').html('<tr><td>Възникна грешка при зареждане на задачите!</td></tr>');
                });                
            }, function () {
                $('#main-container-tasks-list tbody').empty();
                $('#main-container-tasks-list tbody').html('<tr><td>Възникна грешка при изтриване на задачата!</td></tr>');
            });
        });
    }
};