/*
 * gpaginate
 * https://github.com/goliatone/gpaginate
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function(root, name, deps, factory) {
    "use strict";
    // Node
    if (typeof deps === 'function') {
        factory = deps;
        deps = [];
    }

    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0,
            global = root,
            old = global[name],
            mod;
        while ((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function() {
            global[name] = old;
            return mod;
        };
    }
}(this, "GPaginate", ['extend'], function(extend) {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
     */
    var _extend = extend;

    /**
     * Shim console, make sure that if no console
     * available calls do not generate errors.
     * @return {Object} Console shim.
     */
    var _shimConsole = function() {
        var empty = {},
            con = {},
            noop = function() {},
            properties = 'memory'.split(','),
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
                'table,time,timeEnd,timeStamp,trace,warn').split(','),
            prop,
            method;

        while (method = methods.pop()) con[method] = noop;
        while (prop = properties.pop()) con[prop] = empty;

        return con;
    };


    ///////////////////////////////////////////////////
    // CONSTRUCTOR
    ///////////////////////////////////////////////////

    var options = {
        current: 0,
        cycle: false,
        startIndex: 1,
        pageSize: 10
    };

    /**
     * GPaginate constructor
     *
     * @param  {object} config Configuration object.
     */
    var GPaginate = function(config) {
        if (config) this.init(config);
    };

    /**
     * GPaginate release VERSION number.
     * Semantic Versioning
     * @type {String}
     */
    GPaginate.VERSION = '0.0.0';

    /**
     * Update class with a name property.
     * @type {[type]}
     */
    GPaginate.name = GPaginate.prototype.name = 'GPaginate';

    /**
     * Make default options available so we
     * can override.
     */
    GPaginate.DEFAULTS = options;

    /**
     * INVALID_ARGUMENT_ERROR message
     * @type {String}
     */
    GPaginate.INVALID_ARGUMENT_ERROR = 'Invalid Argument Type';

    /**
     * ARGUMENT_MISSING_ERROR message
     * @type {String}
     */
    GPaginate.ARGUMENT_MISSING_ERROR = 'Required Argument Missing';



    ///////////////////////////////////////////////////
    // PUBLIC METHODS
    ///////////////////////////////////////////////////

    /**
     * Initialize the instance with default values
     * and configuration options.
     *
     * @param  {Object} config Configuration object.
     *
     * @throws {Error} If `config` is missing a `data` property
     * @throws {Error} If `data` is not an Array instance
     *
     * @return {this}
     */
    GPaginate.prototype.init = function(config) {
        if (this.initialized) return this.logger.warn('Already initialized');
        this.initialized = true;

        if (!config.data) throw new Error(GPaginate.ARGUMENT_MISSING_ERROR);
        if (!(config.data instanceof Array)) throw new Error(GPaginate.INVALID_ARGUMENT_ERROR);

        console.log('GPaginate: Init!');

        config = _extend({}, this.constructor.DEFAULTS, config);

        _extend(this, config);

        this.setData(config.data);

        return this;
    };

    /**
     * Resets the property.
     * @param  {Object} config Configuration object.
     * @return {this}
     */
    GPaginate.prototype.reset = function(config) {
        this.initialized = false;
        this.init(config);
        return this;
    };

    /**
     * Sets the data source object containing the
     * array to be paginated.
     * @param {Array} data Data Array.
     */
    GPaginate.prototype.setData = function(data) {
        if (!data) throw new Error(GPaginate.INVALID_ARGUMENT_ERROR);
        this.data = data;
        this.totalPages = Math.ceil(this.data.length / this.pageSize);
        return this;
    };

    /**
     * Gets the current page chunk from the
     * data source array based on the provided
     * index.
     *
     * @param  {Number} index Pagination index.
     * @return {Array}        Array slice of `pageSize`
     *                        length that holds current
     *                        page.
     */
    GPaginate.prototype.page = function(index) {

        if (!this.totalPages) return this.handleNoPages();

        index = this.checkLowerBoundary(index);
        index = this.checkUpperBoundary(index);

        this.current = index;

        var start = this.offset(),
            end = start + this.pageSize;

        return this.data.slice(start, end);
    };

    /**
     * Calculate the current offset
     *
     * @private
     * @return {Number}
     */
    GPaginate.prototype.offset = function() {
        return ((this.current - 1) * this.pageSize);
    };

    /**
     * Handle the case of empty content.
     * @return {Array} Returns original dataset.
     */
    GPaginate.prototype.handleNoPages = function() {
        this.logger.warn('GPaginate: we do not have content');
        return this.data;
    };

    /**
     * Handle lower boundary. If our `index`
     * is a negative value, make it first page.
     * @param  {Number} index
     * @return {Number}
     */
    GPaginate.prototype.checkLowerBoundary = function(index) {
        if (index > 1) return index;

        this.emit('paginate.start');
        index = this.startIndex;

        return index;
    };

    /**
     * Handle upper boundary. If `cycle` is `true`
     * we loop to `startIndex` else we stay in place.
     * @param  {Number} index
     * @return {Number}
     */
    GPaginate.prototype.checkUpperBoundary = function(index) {
        if (index <= this.totalPages) return index;

        this.emit('paginate.end');

        index = this.cycle ? this.startIndex : this.totalPages;

        return index;
    };

    /**
     * Move cursor to next page.
     * @return {Array}
     */
    GPaginate.prototype.next = function() {
        return this.page(this.current + 1);
    };

    /**
     * Move cursor to previous page.
     * @return {Array}
     */
    GPaginate.prototype.prev = function() {
        return this.page(this.current - 1);
    };

    /**
     * Do we have a `next` page?
     * @return {Boolean}
     */
    GPaginate.prototype.hasNext = function() {
        return this.current < this.totalPages;
    };

    GPaginate.prototype.emit = function() {};
    /**
     * Logger method, meant to be implemented by
     * mixin. As a placeholder, we use console if available
     * or a shim if not present.
     */
    GPaginate.prototype.logger = console || _shimConsole();

    return GPaginate;
}));