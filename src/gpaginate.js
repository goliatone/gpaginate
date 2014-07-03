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
}(this, "GPaginate", function() {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
     */
    var _extend = function extend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function(source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    target[property] = target[property] || {};
                    target[property] = extend(target[property], source[property]);
                } else target[property] = source[property];
            }
        });
        return target;
    };

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

    };

    /**
     * GPaginate constructor
     *
     * @param  {object} config Configuration object.
     */
    var GPaginate = function(config) {
        config = config || {};

        config = _extend({}, GPaginate.defaults || options, config);

        this.init(config);
    };

    /**
     * Make default options available so we
     * can override.
     */
    GPaginate.defaults = options;

    ///////////////////////////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////////////////////////

    GPaginate.prototype.init = function(config) {
        if (this.initialized) return this.logger.warn('Already initialized');
        this.initialized = true;
        if (!data) throw new Error('Required Argument Missing')
        if (!(data instanceof Array)) throw new Error('Invalid Argument Type')

        console.log('GPaginate: Init!');
        _extend(this, config);

        //TODO: We should get this from config.
        this.current = 0;
        this.cycle = false;
        this.startIndex = 1;
        this.defaultPageSize = 10;

        this.data = data;
        this.pageSize = pageSize || this.defaultPageSize;

        this.total = Math.ceil(this.data.length / this.pageSize);



        return 'This is just a stub!';
    };
    /**
     * Calculate the current offset
     * @return {Number}
     */
    GPaginate.prototype.offset = function() {
        return ((this.current - 1) * this.pageSize);
    };

    /**
     * [page description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    GPaginate.prototype.page = function(index) {

        if (!this.total) return this.handleNoPages();

        index = this.checkLowerBoundary(index);
        index = this.checkUpperBoundary(index);

        this.current = index;

        var start = this.offset(),
            end = start + this.pageSize;

        return this.data.slice(start, end);
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
        if (index <= this.total) return index;

        this.emit('paginate.end');

        index = this.cycle ? this.startIndex : this.total;

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
        return this.current < this.total;
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