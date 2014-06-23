/// <reference path="../Scripts/jquery-2.1.1.js" />
/// <reference path="../Scripts/jquery.signalR-2.0.3.js" />
/// <reference path="controller/Login.js" />
var IS_ADMIN;
var AgroSmart = (function () {
    var accessToken;
    var username;
    var menuController;
    var unitController;
    var taskController;
    var mapController;
    var mobileController;

    var init = function (containerId) {
        $(document.body).on('keydown', 'form input', function (e) {           
            if (e.keyCode == 13) {
                var inputs = $(this).parents("form").eq(0).find(":input");
                if (inputs[inputs.index(this) + 1] != null) {
                    inputs[inputs.index(this) + 1].focus();
                }
                e.preventDefault();
                return false;
            }
        });
         
        var mainContainer = $('#' + containerId);
        mainContainer.append('<div id="login-' + containerId + '"></div>');

        var loginController = new LoginController()
        loginController.init('login-' + containerId);

        loginController.generateLayout();

        var app = $(document.body);

        app.on('loggedIn', function (e, data) {
            accessToken = data.access_token;
            username = data.userName;
            IS_ADMIN = data.additionalInfo.isAdmin;

            initApplication();

            //if (username === 'Admin') {
            //    IS_ADMIN = true;
            //} else {
            //    IS_ADMIN = false;
            //};
            
            // hide disclamer when modules is selected;
            $('#menu li').click(function () {
                $('#disclamer-container').hide();
            });

            // show disclaimer when logged out
            $('#btn-logout').click(function () {
                $('#disclamer-container').show();
            })

            var locator = $.connection.geoLocatorHub;

            locator.client.sendNewCoords = function () {
                var unitId = arguments[0],
                    lat = arguments[1],
                    lng = arguments[2];

                mobileController.recieveCoordinates(unitId, lat, lng);
                controlController.recieveCoordinates(unitId, lat, lng);
            };
           
            $.connection.hub.start().done(function () {
                if (data.additionalInfo.trackCoordinates) {
                    var offset = 0;//0.1;
                    setInterval(function () {
                        navigator.geolocation.getCurrentPosition(function (possition) {
                            var lat = possition.coords.latitude;
                            var long = possition.coords.longitude;
                            locator.server.send(data.additionalInfo.unitId, lat + offset, long - offset);
                            //offset += 0.1;
                        });
                    }, consts.SEND_COORDS_INTERVAL);
                }
            });

        });
    };

    var initApplication = function () {
        menuController = new MenuController();
        unitController = new UnitController();
        taskController = new TaskController();
        mapController = new MapController();
        mobileController = new MobileController();
        controlController = new ControlController();

        menuController.init('menu', username);
        menuController.generateLayout();

        $('#enter').hide();
        $('#register').hide();

        unitController.init('main-container', accessToken);
        taskController.init('main-container', accessToken);
        mapController.init('main-container', accessToken);
        mobileController.init('main-container', accessToken);
        controlController.init('main-container', accessToken);

        attachHandlers();
    };

    var attachHandlers = function () {
        $('a[href="#Machines"]').on('click', function (e) {
            e.preventDefault();
            unitController.generateLayout();
        });

        $('a[href="#Tasks"]').on('click', function (e) {
            e.preventDefault();
            taskController.generateLayout();
        });

        $('a[href="#Maps"]').on('click', function (e) {           
            e.preventDefault();
            mapController.generateLayout();
        });

        $('a[href="#Mobile"]').on('click', function (e) {
            e.preventDefault();
            mobileController.generateLayout();
        });

        $('a[href="#Control"]').on('click', function (e) {
            e.preventDefault();
            controlController.generateLayout();
        });

        $('#btn-logout').on('click', function (e) {
            e.preventDefault();
            $(document.body).trigger('loggedOut', accessToken)
        });
    }

    return {
        init: init
    }
})();