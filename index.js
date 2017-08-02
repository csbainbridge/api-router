/**
 * API Router
 * Usage:
 * ----------------------------------------
 * apiRouter.js
 * ----------------------------------------
 * var router = require('./router.js');
 * 
 * module.exports = router({
 *  get: function( req, res, params ) {
 *      var resource =
 *  },
 *  post: function( req, res, params ) {
 *      // define post method
 *  },
 *  invalid: function( req, res ) {
 *     // response to client
 *  }
 * })
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
                if (route) route.method(req, res, req.obj)
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

        if ( get[(Object.keys(params).length)] ) {
            return {
                method: get[Object.keys(params).length],
                obj
            }
        }

    }

    // Return configured router object
    return router;

}

/**
 * Expose createRouter function
 */
module.exports = createRouter;