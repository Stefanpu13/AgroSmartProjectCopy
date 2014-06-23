var TaskPersister = function () { }

TaskPersister.prototype = {
    tasks: null,
    tasksUrl: null,
    dailyTasks: [],

    init: function () {
        this.tasksUrl = consts.DOMAIN_URL + consts.TASK_STATIC_PART;
    },

    listTasks: function (accessToken, success, error) {
        this.tasks = {};

        if (accessToken) {
            var url = this.tasksUrl + '/' + 'GetAll';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;

            requestHelper.getJSON(url, header, function (data) {
                self.tasks = data;
                success(data);
            }, function () {
                self.tasks = {};
                error();
            });
        };
    },

    addNewTask: function (accessToken, task, success, error) {
        if (accessToken) {
            var url = this.tasksUrl + '/' + 'Create';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.postJSON(url, JSON.stringify(task), header, function (data) {
                
                self.listTasks(accessToken, function (data) {
                    success(data);
                }, function () {
                    error();
                });
            }, function () {
                error();
            });
        };
    },

    listTaskByDay: function (accessToken, planningDate, success, error) {
        if (accessToken) {           
            var url = this.tasksUrl + '/' + 'GetTasksForUserByDate' + '?date=' + planningDate;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;
            requestHelper.getJSON(url, header, function (data) {
                self.dailyTasks = data;
                success(data);
            }, function () {
                self.dailyTasks = [];
                error();
            })
        }
    },

    setStarted: function (accessToken, taskId, success, error) {
        if (accessToken) {
            var url = this.tasksUrl + '/' + 'SetStarted/' + taskId;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.putJSON(url, null, header, function (data) {
                success(data);
            }, function () {
                error();
            })
        };
    },

    setFinished: function (accessToken, taskId, success, error) {
        if (accessToken) {
            var url = this.tasksUrl + '/' + 'SetFinished/' + taskId;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.putJSON(url, null, header, function (data) {
                success(data);
            }, function () {
                error();
            })
        };
    },

    deleteTask: function (accessToken, task, success, error) {
        if (accessToken) {
            var url = this.tasksUrl + '/' + 'Delete';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.deleteJSON(url, task, header, function (data) {
                
                success(data);
            }, function () {
                
                error();
            })
        };
    }
};