var loginView = (function () {

    var generateWrapperLogin = function (containerId) {
        var html ='';

        html += '<div id = "' + containerId + '-error"' + ' class="padding-error"></div>';

        return html;
    }


    var generateLoginForm = function () {
        var html = '';        
        html += '<section class="col-md-8">' +
                    '<form id="form-login" class="form-horizontal" role="form">' +
                     '<ul class="text-danger"></ul>' +
                     '<div class="form-group">' +
                        '<label for="login-username" class="col-md-2 control-label">Потребител</label> ' +
                        '<div class="col-md-10">' +
                            '<input type="text" id="login-username" name="username" class="form-control" /><span class="validationMessage" style="display: none;"></span>' +
                        '</div>' +
                     '</div>' +
                     '<div class="form-group">' +
                        '<label for="login-password" class="col-md-2 control-label">Парола</label>' +
                        '<div class="col-md-10">' +
                            '<input type="password" id="login-password" name="password" class="form-control" /><span class="validationMessage" style="display: none;"></span>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<div class="col-md-offset-2 col-md-10">' +
                            '<button id="btn-login" type="submit" class="btn btn-default">Влез</button>' +
                        '</div>' +
                    '</div>' +
                    '<p><a href="#register">Регистрирай се</a> ако все още нямаш account</p>' +
                    '</form>' +
                '</section>';
        return html;
    };

    var generateRegisterForm = function () {
        var html = '';

        html += '<section class="col-md-8">' +
                '<form id="registration" class="form-horizontal" role="form">' +
                    '<ul class="text-danger" /></ul>' +
                    '<div class="form-group">' +
                        '<label for="registerUserName" class="col-md-2 control-label">Потребител</label>' +
                        '<div class="col-md-10">' +
                            '<input type="text" id="registerUserName" class="form-control" /"><span class="validationMessage" style="display: none;"></span>'+
                        '</div>' +
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="registerPassword" class="col-md-2 control-label">Парола</label>'+
                        '<div class="col-md-10">'+
                            '<input type="password" id="registerPassword" class="form-control"/><span class="validationMessage" style="display: none;"></span>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="registerConfirmPassword" class="col-md-2 control-label">Потвърди паролата</label>'+
                        '<div class="col-md-10">' +
                            '<input type="password" id="registerConfirmPassword" class="form-control"/><span class="validationMessage" style="display: none;"></span>' +
                        '</div>' +
                    '</div>'+
                    '<div class="form-group">' +
                        '<div class="col-md-offset-2 col-md-10">' +
                            '<button id="btn-register" type="submit" class="btn btn-default">Регистрирай</button>' +
                        '</div>' +
                    '</div>' +
                    '<p><a href="#enter">Вход</a> ако вече си регистриран и имаш account</p>' +
                '</form>' +
            '</section>';

        return html;
    };

    var generateLoginMainForm = function (containerId) {
        var html = '';

        html += '<div id="enter">' +
                    '<h2>Вход</h2>' +
                    '<hr>' +
                    '<div id="' + containerId + '-login-form" class="row"></div>' +
                '</div>';

        return html;
    };

    var generateRegisterMainForm = function (containerId) {
        var html = '';

        html += '<div id="register">' +
                    '<h2>Регистрация</h2>' +
                    '<hr>' +
                    '<div id="' + containerId + '-register-form" class="row"></div>' +
                '</div>';

        return html;
    }

    return {
        getWrapperLogin: generateWrapperLogin,
        getLoginForm: generateLoginForm,
        getRegisterForm: generateRegisterForm,
        getLoginMainForm: generateLoginMainForm,
        getRegisterMainForm: generateRegisterMainForm
    }
})();