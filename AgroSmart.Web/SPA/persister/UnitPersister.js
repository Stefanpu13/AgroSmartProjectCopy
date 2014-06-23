var UnitPersister = function () { };


UnitPersister.prototype = {
    units: null,
    unitsUrl: null,

    init: function () {
        this.unitsUrl = consts.DOMAIN_URL + consts.UNIT_STATIC_PART;
    },

    list: function (accessToken, success, error) {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'GetAll';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;
            requestHelper.getJSON(url, header, function (data) {
                
                success(data);
            }, function () {
                
                error();
            })
        };
        return this.units;
    },


    listWithCoordinates: function (accessToken, success, error) {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'GetAllWithCoordinates';

            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;
            requestHelper.getJSON(url, header, function (data) {
                success(data);
            }, function () {
                error();
            })
        };

        return this.units;

    },

    addUnit: function (accessToken, unit, success, error) {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'Create';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.postJSON(url, JSON.stringify(unit), header, function (data) {
                self.list(accessToken, function (data) {
                    success(data);
                }, function () {
                    error();
                })
            }, function () {
                error();
            })
        }

        return error();
    },

    updateUnit: function (accessToken, unit, success, error) {
        if (accessToken) {
            
            var url = this.unitsUrl + '/' + 'ChangeName/' + unit.id;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;
            requestHelper.putJSON(url, JSON.stringify(unit), header, function (data) {
                success(data);
            }, function () {
                error();
            });
        };
    },

    assigneUserToUnit: function(accessToken, userWithUnit, success, error)  {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'AssigneUser/' + userWithUnit.userId;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var unit = {
                id: userWithUnit.unitId,
                name: userWithUnit.unitName
            };

            var self = this;
            requestHelper.putJSON(url, JSON.stringify(unit), header, function (data) {
                success(data);
            }, function () {
                error();
            });
        };
    },

    getAllUnassignedUsers: function (accessToken, success, error) {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'GetUnassignedUsers';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;
            requestHelper.getJSON(url, header, function (data) {
                success(data);
            }, function () {
                error();
            })
        };
    },

    unassigneUserFromUnit: function (accessToken, userId, success, error) {
        if (accessToken) {
            var url = this.unitsUrl + '/' + 'UnassigneUser/' + userId;
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            
            var self = this;
            requestHelper.putJSON(url, null, header, function (data) {
                success(data);
            }, function () {
                error();
            });
        };
    }
};