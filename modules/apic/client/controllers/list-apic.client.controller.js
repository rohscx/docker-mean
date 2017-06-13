(function () {
  'use strict';

  angular
    .module('apic')
    .controller('ApicListController', ApicListController);

  ApicListController.$inject = ['ApicService'];

  function ApicListController(ApicService) {
    var vm = this;
    message = "Hello W)rld";

    vm.apic = ApicService.query();
  }
}());
