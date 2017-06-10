(function () {
  'use strict';

  describe('Apic List Controller Tests', function () {
    // Initialize global variables
    var ApicListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ApicService,
      mockApic;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ApicService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ApicService = _ApicService_;

      // create mock apic
      mockApic = new ApicService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Apic about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Apic List controller.
      ApicListController = $controller('ApicListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockApicList;

      beforeEach(function () {
        mockApicList = [mockApic, mockApic];
      });

      it('should send a GET request and return all apic', inject(function (ApicService) {
        // Set POST response
        $httpBackend.expectGET('/api/apic').respond(mockApicList);

        // Ignore parent template get on state transition
        $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.apic.length).toEqual(2);
        expect($scope.vm.apic[0]).toEqual(mockApic);
        expect($scope.vm.apic[1]).toEqual(mockApic);

      }));
    });
  });
}());
