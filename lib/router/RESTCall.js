/*

  Isomorphic SmartClient Node.js Server
  Copyright 2017 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE
     OF ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  LGPL LICENSE
     This software may be used under the terms of the Lesser GNU Public License (LGPL),
     version 3.0 (see http://www.gnu.org/licenses/lgpl-3.0.html).  The LGPL is generally
     considered a commercial-friendly license, and is used by the Hibernate framework
     among others.  For any questions about the LGPL, please refer to a qualified attorney;
     Isomorphic does not provide legal advice.

  OTHER LICENSE OPTIONS
     Alternative licensing terms, including licenses with no requirement to make modifications
     publicly available, can be arranged by contacting Isomorphic Software by email
     (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

"use strict";

const assert = require("assert");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

const RESTProcessor = require("../RESTProcessor");

/**
 * Route to execute REST calls.
 *
 * @extends Middleware
 */
class RESTCall extends Middleware {

    /**
     * Creates REST calls middleware instance.
     * Uses <code>server.router.restCall.path</code> configuration parameter as path to REST call (relative to <code>basePath</code>).
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._restPath = Config.getValue("server.router.restCall.path");
        assert.equal(typeof this._restPath, "string", "Route to REST call should be a string");
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        this.router.all(this._restPath, function(req, res) {
            req.log.debug({
                params: req.params,
                query: req.query,
                body: req.body,
                files: req.files,
                rawBody: (req.rawBody)?req.rawBody.toString():""
            }, "Request");
            process.nextTick(function() {
                const processor = new RESTProcessor(req, res);
                processor.processRequest();
            });
        });
    }

}

module.exports = RESTCall;
