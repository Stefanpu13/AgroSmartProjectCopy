var requestHelper = (function () {
    var postJSON = function (url, data, headers, success, error) {
        $.ajax({
            url: url,
            accepts: 'application/json',
            timeout: 5000,
            type: 'POST',
            contentType: 'application/json',
            headers: headers,
            data: data,
            cache: false,
            success: function (data) {
                if (success && typeof success === 'function') {
                    success(data);
                }
            },
            error: function (err) {
                if (error) {
                    error(err);
                }
            }
        });
    };

    var putJSON = function (url, data, headers, success, error) {
        $.ajax({
            url: url,
            timeout: 5000,
            type: 'PUT',
            headers: headers,
            dataType: 'json',
            contentType: 'application/json',
            data: data,
            cache: false,
            success: function (data) {
                if (success && typeof success === 'function') {
                    success(data);
                }
            },
            error: function (err) {
                if (error) {
                    error(err);
                }
            }
        });
    };

    /*
    * @isSync (optional)
    */
    var getJSON = function (url, headers, success, error, isSync) {
        isSync = isSync || false;
        $.ajax({
            url: url,
            timeout: 5000,
            type: "GET",
            contentType: "application/json",
            headers: headers,
            async: !isSync,
            cache: false,
            success: success,
            error: error
        });
    };

    var deleteJSON = function (url, data, headers, success, error) {
        $.ajax({
            url: url,
            timeout: 5000,
            type: "DELETE",
            contentType: "application/json",
            headers: headers,
            data: data,            
            cache: false,
            success: success,
            error: error
        });
    };

    return {
        getJSON: getJSON,
        postJSON: postJSON,
        deleteJSON: deleteJSON,
        putJSON: putJSON
    };
})();