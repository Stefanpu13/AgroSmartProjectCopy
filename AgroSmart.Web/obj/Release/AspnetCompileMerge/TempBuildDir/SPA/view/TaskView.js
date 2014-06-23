var taskView = (function () {
    var generateTasksList = function (containerId, tasks) {
        var html = '';

        html += '<div class="panel panel-default">' +
                    '<div class="panel-heading">' +
                        '<h3 class="panel-title">СПИСЪК СЪС ЗАДАЧИ</h3>' +
                    '</div>' +
                    '<div class="panel-body" id="frm-new-task">';
        
        if (IS_ADMIN) {
                    html+=   '<button class="btn btn-success btn-lg  pull-right" type="button" id="add-new-task-form">' +
                                    '<span class="glyphicon glyphicon-plus"></span>' +
                                '</button>'
                    };
                    
                    html+=  '</div>' +
                                '<div id="' + containerId + '" class="table-responsive" >' +
                                    '<table class="table table-hover">' +
                                        '<tbody>' +
                                        '</tbody>' +
                                    '</table>' +
                                '</div>' +
                            '</div>';

        return html;
    };

    var addNewTask = function (containerId, ranges, units) {
        var unitsHtml = '';
        for (var i = 0; i < units.length; i++) {
            unitsHtml += '<option id="' + units[i].id + '" value=' + units[i].id + '>' + units[i].name + '</option>';
        };

        var rangesHtml = '';
        for (var i = 0; i < ranges.length; i++) {
            rangesHtml += '<div class="checkbox">' +
                            '<label>' +
                                '<input type="checkbox" value="' + ranges[i].id + '">' +
                                ranges[i].name + ' ' + ranges[i].description +
                            '</label>' +
                          '</div>';
        };

        var html = '';

        html += '<form role="form" id="' + containerId + '">' +
                    '<div class="col-md-4">' +
                        '<div class="form-group">' +
                            '<label for="taskInput">Име на задачата:</label>' +
                            '<input type="text" class="form-control" id="taskInput" placeholder="Въведи име">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="descriptionArea">Описание</label>' +
                            '<textarea class="form-control" id="descriptionArea" placeholder="Въведи описание" rows="3"></textarea>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                        '<div class="form-group">' +
                            '<label>Области:</label>' +
                            '<p class="help-block">Избери областите на задачата.</p>' +
                            '<div id="all-ranges" class="btn-group" style="overflow-y: scroll; height:100px;" >' +
                                rangesHtml +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                        '<div class="form-group">' +
                            '<label for="planningDate">Планирана дата</label>' +
                            '<input type="date" class="form-control" id="planningDate">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="unitDropDown">Машина</label>' +
                            '<select class="form-control" id="unitDropDown">' +
                                unitsHtml +
                            '</select>' +
                        '</div>' +
                        '<button type="submit" id="save-new-task" class="btn btn-default">Съхрани</button>' +
                        '<button type="submit" id="cancel-new-task" class="btn btn-default">Отказ</button>' +
                    '</div>' +
                '</form>';

        return html;
    };

    var generateOnlyListOfTasks = function (tasks) {
        var html = '';

        var statuses = ["Планирана", "Стартирана", "Свършена"];
        var index = 1;
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];

            var htmlRegions = '';
            for (var j = 0; j < task.regions.length; j++) {
                htmlRegions += '<p>' +
                                    '<a href="#' + task.regions[j].id + '">' + task.regions[j].name + '</a>' +
                                    '&nbsp;' + task.regions[j].description +
                               '</p>';
            };

            
            var parseDate = new Date(task.assignedDate);
            var newDate = parseDate.getDate() + '.' + (parseDate.getMonth() + 1) + '.' + parseDate.getFullYear();

            html += '<tr class="row" id="' + task.id + '">' +
                        '<td><span data-original-title="' + task.description + '" data-placement="bottom" data-toggle="tooltip" class="badge pull-left">' + index + '</span>&nbsp;' + task.name + '</td>' +
                        '<td><p class="text-muted">Обща информация:</p></td>' +
                        '<td>' +
                           htmlRegions +
                        '</td>' +
                        '<td>Планирана дата: <strong>' + newDate + '</strong></td>' +
                        '<td>Машина: <strong>' + task.unit.name + '</strong></td>' +
                        '<td>Статус: <strong>' + statuses[task.status] + '</strong></td>';
                            if (task.status === 0 && IS_ADMIN) {
                                html += '<td><buton class="btn btn-default btn-sm" id="btn-remove-task"><span class="glyphicon glyphicon-remove"></span></button></td>';
                            } else {
                                html += '<td></td>';
                            };
                    '</tr>';
            index++;
        };

        return html;
    };

    return {
        getTasksList: generateTasksList,
        addNewTask: addNewTask,
        getOnlyTasksList: generateOnlyListOfTasks
    };
})();