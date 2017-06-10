(function () {
  'use strict';

  angular
    .module('apic')
    .controller('ApicController', ApicController);

  ApicController.$inject = ['$scope', 'apicResolve', 'Authentication'];

  function ApicController($scope, apic, Authentication) {
    var vm = this;

    vm.apic = apic;
    vm.authentication = Authentication;

  }
}());
