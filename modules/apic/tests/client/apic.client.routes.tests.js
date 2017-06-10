(function () {
  'use strict';

  describe('Apic Route Tests', function () {
    // Initialize global variables
    var $scope,
      ApicService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ApicService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ApicService = _ApicService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('apic');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/apic');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('apic.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/apic/client/views/list-apic.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ApicController,
          mockApic;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('apic.view');
          $templateCache.put('/modules/apic/client/views/view-apic.client.view.html', '');

          // create mock apic
          mockApic = new ApicService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Apic about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ApicController = $controller('ApicController as vm', {
            $scope: $scope,
            apicResolve: mockApic
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:apicId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.apicResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            apicId: 1
          })).toEqual('/apic/1');
        }));

        it('should attach an apic to the controller scope', function () {
          expect($scope.vm.apic._id).toBe(mockApic._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/apic/client/views/view-apic.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/apic/client/views/list-apic.client.view.html', '');

          $state.go('apic.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('apic/');
          $rootScope.$digest();

          expect($location.path()).toBe('/apic');
          expect($state.current.templateUrl).toBe('/modules/apic/client/views/list-apic.client.view.html');
        }));
      });
    });
  });
}());
