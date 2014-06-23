/// <reference path="../helpers/RequestHelper.js" />
var LoginPersister = function () { };

LoginPersister.prototype = {
    logoutUrl: null,
    loginUrl: null,
    registerUrl: null,

    init: function () {
        this.logoutUrl = consts.DOMAIN_URL + consts.LOGOUT_STATIC_PART;
        this.registerUrl = consts.DOMAIN_URL + consts.REGISTER_STATIC_PART;
        this.loginUrl = consts.LOGIN_URL;
        this.additionalInfoUrl = consts.DOMAIN_URL + consts.UNIT_STATIC_PART + '/GetAdditionalUserData';
    },

    getAdditionalInfo: function (accessToken) {
        var result;
        var header = {
            Authorization: consts.AUTHORIZATION + " " + accessToken
        };

        requestHelper.getJSON(this.additionalInfoUrl, header, function (data) {
            result = data;
        }, function () {
            throw Error('Request error!');
        }, true);

        return result;
    },

    login: function (user, success, error) {

        var data = user + '&grant_type=password';

        var url = this.loginUrl;

        var self = this;
        requestHelper.postJSON(url, data, null, function (data) {
            console.log(data);
            self.setAccessToken(data.access_token);
            success(data);
        }, function (err) {
            var errorText = JSON.parse(err.responseText);
            console.log(errorText.error_description);
            error(errorText.error_description);
        });
    },

    register: function (user, success, error) {
        var data = {
            userName: user.username,
            password: user.password,
            confirmPassword: user.confirmPassword
        }
        var url = this.registerUrl;
        var self = this;
        requestHelper.postJSON(url, JSON.stringify(data), null, function (data) {
            console.log(data);
            var userLogin = 'username=' + user.username + '&password=' + user.password;
            self.login(userLogin, success, error);
        }, function () {
        });
    },

    logout: function (accessToken, success, error) {
        var url = this.logoutUrl;
        var header = {
            Authorization: consts.AUTHORIZATION + " " + accessToken
        };
        requestHelper.postJSON(url, null, header, function (data) {
            success(data);
        }, function () {
            error();
        });
    },

    getAccessToken: function() {
        var accessToken = sessionStorage['accessToken'] || localStorage['accessToken'];

        if (accessToken) {
            return {
                "Authorization": "Bearer " + accessToken
            };
        }

        return {}
    },

    setAccessToken: function (accessToken) {
        sessionStorage['accessToken'] = accessToken;
        localStorage['accessToken'] = accessToken;
    },

    clearAccessToken: function () {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
    }
}