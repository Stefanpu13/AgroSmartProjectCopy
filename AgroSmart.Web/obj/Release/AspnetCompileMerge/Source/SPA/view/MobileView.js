var mobileView = (function () {
    var generateTaskPanel = function (containerId) {
        var html = '';

        var parseDate = new Date();
        var todayDate = parseDate.getDate() + '.' + (parseDate.getMonth() + 1) + '.' + parseDate.getFullYear();


        html += '<div class="panel panel-default">' +
                    '<div class="panel-heading">' +
                        '<h3 class="panel-title">СПИСЪК СЪС ЗАДАЧИ ЗА ДАТА: </h3>' + todayDate +
                    '</div>' +                    
                    '<div id="' + containerId + '">' +
                        '<div class="col-md-2" id="col-tasks">' +
                        '</div>' +
                        '<div class="col-md-8" id="col-map">' +
                            '<div style="height:400px; background-color: green;" id="map-container">' +
                            '</div>' +
                            '<div class="panel panel-default">' +
                                '<div class="panel-body">' +
                                    '<div class="form-group">' +
                                        '<button type="button" id="btn-start-task" class="btn btn-default btn-block">Начало на задачата</button>' +
                                        '<button type="button" id="btn-end-task" class="btn btn-default btn-block">Край на задачата</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-2" id="col-description">' +
                        '</div>' +
                    '</div>' +
                '</div>';
        
        return html;
    };

    var generateTasksListNames = function (tasks) {
        var html = '' + 
                    '<div class="list-group">';

        for (var i = 0; i < tasks.length; i++) {
            html += '<a href="#' + tasks[i].id + '" class="list-group-item" id="' + tasks[i].id + '">' +
                        '<h4 class="list-group-item-heading">' + tasks[i].name + '</h4>' +
                        '<p class="list-group-item-text">' + tasks[i].description + '</p>' +
                    '</a>';
        };

        html+='</div>'
        return html;
    };

    var generateTasksRegions = function (tasks) {
        var html = '';

        for (var i = 0; i < tasks.length; i++) {
            html += '<ul class="list-group" id="regions' + tasks[i].id + '">';
            for (var j = 0; j < tasks[i].regions.length; j++) {
                html += '<li class="list-group-item">' +
                            '<h4 class="list-group-item-heading">' + tasks[i].regions[j].name + '</h4>' +
                            '<p class="list-group-item-text">' + tasks[i].regions[j].description + '</p>' +
                        '</li>';
            }
            html += '</ul>';
        };

        return html;
    };

    return {
        getTaskPanel: generateTaskPanel,
        getTasksListName: generateTasksListNames,
        getTasksRegions: generateTasksRegions
    };
})();