/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'gpaginate': 'gpaginate'
    }
});

define(['gpaginate', 'jquery'], function (GPaginate, $) {
    console.log('Loading');
	var gpaginate = new GPaginate();
	gpaginate.init();
});