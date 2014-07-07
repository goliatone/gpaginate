/*global define:true, describe:true , it:true , expect:true,
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['gpaginate'], function(GPaginate) {

    describe('GPaginate should', function() {

        it('be loaded', function() {
            expect(GPaginate).toBeTruthy();
            var gpaginate = new GPaginate();
            expect(gpaginate).toBeTruthy();
        });

        var paginage;
        var fixture = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        beforeEach(function() {
            paginage = new GPaginate({
                data: fixture
            });
        });

        it('initialize instance with DEFAULTS', function() {
            var properties = Object.keys(GPaginate.DEFAULTS);
            expect(paginage).toHaveProperties(properties);
        });

        it('throw ARGUMENT_MISSING_ERROR if not data provided', function() {
            var fake = new GPaginate();
            expect(fake.init({})).toThrow(new Error(GPaginate.ARGUMENT_MISSING_ERROR));
        });

        it('throw INVALID_ARGUMENT_ERROR if provided data is not an array', function() {
            var fake = new GPaginate();
            expect(fake.init({
                data: {}
            })).toThrow(new Error(GPaginate.INVALID_ARGUMENT_ERROR));
        });

        it('calculate totalPages based on pageSize', function() {
            paginage.reset({
                pageSize: 5,
                data: new Array(15)
            });
            expect(paginage.totalPages).toEqual(3);
        });

        it('update totalPages value if data changes', function() {
            paginage.setData(new Array(3 * paginage.pageSize));
            expect(paginage.totalPages).toEqual(3);
        });
    });
});