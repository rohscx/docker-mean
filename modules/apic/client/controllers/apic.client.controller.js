(function () {
  'use strict';

  angular
    .module('apic')
    .controller('ApicController', ApicController);

  ApicController.$inject = ['$scope', 'articleResolve', 'Authentication'];

  function ApicController($scope, article, Authentication) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;

  }
}());
