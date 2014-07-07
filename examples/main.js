/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'gpaginate': 'gpaginate',
        'extend': 'gextend/extend'
    }
});

define(['gpaginate'], function(GPaginate) {
    console.log('Loading');
    var pager = new GPaginate({
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        pageSize: 5
    });

    console.log(pager.page())
    console.log(pager.next())
    console.log(pager.next())
});