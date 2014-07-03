/*global define:true, describe:true , it:true , expect:true, 
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['gpaginate', 'jquery'], function(GPaginate, $) {

    describe('just checking', function() {

        it('GPaginate should be loaded', function() {
            expect(GPaginate).toBeTruthy();
            var gpaginate = new GPaginate();
            expect(gpaginate).toBeTruthy();
        });

        it('GPaginate should initialize', function() {
            var gpaginate = new GPaginate();
            var output   = gpaginate.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });
        
    });

});