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
                router.get(req, res, router.getParams(req.url))
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
    router.getParams = function( route ) {
        var params = route.split("/");

        var j = params.length;
        while (j--) if (params[j]==="") params.splice(j,1);
    
        var obj = {};
        for (i=0;i<params.length;i++) i === 1 ? obj.id = params[i] : obj.resource = params[i]

        return obj;
    }

    // Return configured router object
    return router;

}

/**
 * Expose createRouter function
 */
module.exports = createRouter;