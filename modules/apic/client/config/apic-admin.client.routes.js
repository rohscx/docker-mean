(function () {
  'use strict';

  angular
    .module('apic.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.apic', {
        abstract: true,
        url: '/apic',
        template: '<ui-view/>'
      })
      .state('admin.apic.list', {
        url: '',
        templateUrl: '/modules/apic/client/views/admin/list-apic.client.view.html',
        controller: 'ApicAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.apic.create', {
        url: '/create',
        templateUrl: '/modules/apic/client/views/admin/form-apic.client.view.html',
        controller: 'ApicAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          apicResolve: newApic
        }
      })
      .state('admin.apic.edit', {
        url: '/:apicId/edit',
        templateUrl: '/modules/apic/client/views/admin/form-apic.client.view.html',
        controller: 'ApicAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          apicResolve: getApic
        }
      });
  }

  getApic.$inject = ['$stateParams', 'ApicService'];

  function getApic($stateParams, ApicService) {
    return ApicService.get({
      apicId: $stateParams.apicId
    }).$promise;
  }

  newApic.$inject = ['ApicService'];

  function newApic(ApicService) {
    return new ApicService();
  }
}());
