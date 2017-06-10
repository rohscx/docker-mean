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
        url: '/:articleId',
        templateUrl: '/modules/apic/client/views/view-article.client.view.html',
        controller: 'ApicController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getApic
        },
        data: {
          pageTitle: 'Apic {{ articleResolve.title }}'
        }
      });
  }

  getApic.$inject = ['$stateParams', 'ApicService'];

  function getApic($stateParams, ApicService) {
    return ApicService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }
}());
