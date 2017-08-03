/**
 * API Router
 * Usage:
 * ----------------------------------------
 * apiRouter.js
 * ----------------------------------------
 module.exports = router({
    get: {
        1: {
            route: "/resource",
            method: function( req, res, params ) {
                url params can be accessed here for database interaction.
            }
        },
        2: {
            route: "/resource/id",
            method: function( req, res, params ) {
                ...
            }
        },
        3: {
            route: "/resource/id/value",
            method: function( req, res, params ) {
                ...
            }
        }
    },
    invalidRoute: function( req, res ) {
        console.log("invalid route")
    }
});
 * ---------------------------------------
 *  server.js
 * ---------------------------------------
 *  var router = require('./apiRouter.js')
 *  var http = require('http');
 * 
 *  http.createServer(router).listen(port);
 */

/**
 * Returns configurable router object.
 * 
 * HTTP methods currently supported: GET, POST.
 * 
 * Support for invalid method also supported.
 * 
 * @param methods
 */
function createRouter(methods) {

    var router = function(req, res) {
        
        switch(req.method) {
            case "GET":
                var route = router.processParams(req, res);
                if (route) route.method(req, res, route.obj)
                else router.invalidRoute(req, res)
                break;
            case "POST":
                router.post(req, res)
                break;
            default:
                router.invalid(req, res)
                break;
        }

    }

    // Assign methods to router object
    Object.assign(router, methods);

    /**
     * Returns object containing url parameters.
     * 
     * Currently designed for api usage.
     * 
     * Accepts /resource or /resource/id
     * 
     * Example:
     * url: /player/1
     * object returned: { "resource": "player", id: 1 }
     * 
     * @param route (Expects request url)
     */
    router.processParams = function( req, res ) {
        var params = req.url.split("/");
        var j = params.length;

        // remove empty strings
        while (j--) if (params[j]==="") params.splice(j,1);
        
        var routes = [];
        var get = methods.get;

        for (i=0;i<Object.keys(get).length;i++) {
            routes.push(get[i+1].route) 
        }

        var obj = {};

        for (i=0;i<routes.length;i++) {

            var parts = routes[i].split("/");
            var k = parts.length;

            while (k--) if (parts[k]==="") parts.splice(k,1);

            if (parts.length === params.length) {
                for (i=0;i<params.length;i++) obj[parts[i]] = params[i]
            }

        }
        
        // undefined routes are ignored and should be handled by the user defined invalidRoute function
        if (get[(Object.keys(params).length)]) {
            return {
                method: get[(Object.keys(params).length)].method,
                obj
            }
        } else {
            return;
        }

    }

    // Return configured router object
    return router;

}

/**
 * Expose createRouter function
 */
module.exports = createRouter;