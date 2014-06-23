/// <reference path="../_references.js" />
var LoginController = function () { };

LoginController.prototype = {
    containerId: null,
    loginPersister: null,
    loginFormId: null,
    username: null,

    init: function (containerId) {
        this.containerId = containerId;
        this.loginPersister = new LoginPersister();
        this.loginPersister.init();
    },

    generateLayout: function () {
        var wrapperLoginHtml = loginView.getWrapperLogin(this.containerId);
        $('#' + this.containerId).append(wrapperLoginHtml);

        var loginMainFormHtml = loginView.getLoginMainForm(this.containerId);
        $('#' + this.containerId).append(loginMainFormHtml);

        this.loginFormId = this.containerId + '-login-form';
        var loginFormHtml = loginView.getLoginForm();
        $('#' + this.loginFormId).append(loginFormHtml);

        var registerMainFormHtml = loginView.getRegisterMainForm(this.containerId);
        $('#' + this.containerId).append(registerMainFormHtml);

        var registerFormId = this.containerId + '-register-form';
        var registerFormHtml = loginView.getRegisterForm(registerFormId);
        $('#' + registerFormId).append(registerFormHtml);

        $('#register').hide();

        this.attachHandlers();
    },

    attachHandlers: function () {
        var self = this;
        $('#btn-login').on('click', function (e) {
            e.preventDefault();

            var user = $('#form-login').serialize();

            self.username = $('#login-username').val();

            self.loginPersister.login(user, function (data) {
                data.additionalInfo = self.loginPersister.getAdditionalInfo(data.access_token);
                $(document.body).trigger('loggedIn', data);                
                $('#enter').hide();
                $('#register').hide();
            }, function (err) {
                errorSpan = $('#login-password').next();
                errorSpan.text(err);
                errorSpan.show();
            });
        });

        $('#btn-register').on('click', function (e) {
            e.preventDefault();
            var user = {
                username: $('#registerUserName').val(),
                password: $('#registerPassword').val(),
                confirmPassword: $('#registerConfirmPassword').val()
            };

            self.username = user.username;
            self.loginPersister.register(user, function (data) {
                var accessToken = data;
                data.additionalInfo = self.loginPersister.getAdditionalInfo(data.access_token);
                $(document.body).trigger('loggedIn', data);
                
            }, function error() {
                console.log(error);
            });
        })

        $('a[href="#enter"]').on('click', function (e) {
            e.preventDefault();
            $('#enter').show();
            $('#register').hide();
        });

        $('a[href="#register"]').on('click', function (e) {
            e.preventDefault();
            $('#register').show();
            $('#enter').hide();
        });

        $(document.body).on('loggedOut', function (e, accessToken) {
            e.preventDefault();
            self.loginPersister.logout(accessToken, function (data) {
                window.location.replace('../spa');
            }, function (e) {

            });
        });
    }
};