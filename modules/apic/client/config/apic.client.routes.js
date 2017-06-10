(function () {
  'use strict';

  angular
    .module('apic.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('apic', {
        abstract: true,
        url: '/apic',
        template: '<ui-view/>'
      })
      .state('apic.list', {
        url: '',
        templateUrl: '/modules/apic/client/views/list-apic.client.view.html',
        controller: 'ApicListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Apic List'
        }
      })
      .state('apic.view', {
        url: '/:apicId',
        templateUrl: '/modules/apic/client/views/view-apic.client.view.html',
        controller: 'ApicController',
        controllerAs: 'vm',
        resolve: {
          apicResolve: getApic
        },
        data: {
          pageTitle: 'Apic {{ apicResolve.title }}'
        }
      });
  }

  getApic.$inject = ['$stateParams', 'ApicService'];

  function getApic($stateParams, ApicService) {
    return ApicService.get({
      apicId: $stateParams.apicId
    }).$promise;
  }
}());
