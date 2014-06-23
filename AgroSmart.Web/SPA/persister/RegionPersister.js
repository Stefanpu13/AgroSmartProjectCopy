var RegionPersister = function () { };

RegionPersister.prototype = {
    regions: null,
    createdRegions: null,
    deletedRegions: null,
    modifiedRegions: null,
    regionsUrl: null,

    init: function () {
        this.regionsUrl = consts.DOMAIN_URL + consts.REGION_STATIC_PART;
    },

    listRegions: function (accessToken, success, error) {
        debugger;
        this.regions = {};
        if (accessToken) {
            var url = this.regionsUrl + '/' + 'GetAllUnassigned';

            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };

            var self = this;

            requestHelper.getJSON(url, header, function (data) {
                debugger;
                self.regions = data
                success(data);
            }, function () {
                debugger;
                error();
            });
        };
    },

    listRegionsWithPoints: function (accessToken, success, error) {
        var getAllWithPointsURl = "GetRegionsWithPoints";
        this.regionsWithPoints = {};
        if (accessToken) {
            var url = this.regionsUrl + "/" + getAllWithPointsURl;

            var header = "Authorization:" + consts.AUTHORIZATION + " " + accessToken;

            var self = this;

            requestHelper.getJSON(url, header, function (data) {
                self.regions = data
                success(data);
            }, function () {
            });
        }

        return this.regions;
    },

    createRegions: function (accessToken, success, error) {
      
        if (accessToken) {
            var url = this.regionsUrl + '/' + 'Create';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;

            requestHelper.postJSON(url, JSON.stringify(this.createdRegions), header, function () {
                if (success && typeof success === 'function') {
                    success();
                }

            }, function (e) {
                if (error && typeof error === 'function') {
                    error(e);
                    console.log(e);
                }
            });
        }

        return this.regions;
    },

    modifyRegions: function (accessToken, success, error) {
        if (accessToken) {
            var url = this.regionsUrl + '/' + 'Modify';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;

            requestHelper.putJSON(url, JSON.stringify(this.modifiedRegions), header, function () {
                if (success && typeof success === 'function') {
                    success();
                }

            }, function (e) {
                if (error && typeof error === 'function') {
                    error(e);
                    console.log(e);
                }
            });
        }
    },

    deleteRegions: function (accessToken, success, error) {
        if (accessToken) {
            var url = this.regionsUrl + '/' + 'Delete';
            var header = {
                Authorization: consts.AUTHORIZATION + " " + accessToken
            };
            var self = this;

            requestHelper.deleteJSON(url, JSON.stringify(this.deletedRegions), header, function () {
                if (success && typeof success === 'function') {
                    success();
                }

            }, function (e) {
                if (error && typeof error === 'function') {
                    error(e);
                    console.log(e);
                }
            });
        }
    }
}