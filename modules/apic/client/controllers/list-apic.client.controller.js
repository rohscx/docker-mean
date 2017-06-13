(function () {
  'use strict';

  angular
    .module('apic')
    .controller('ApicListController', ApicListController);

  ApicListController.$inject = ['ApicService'];

  function ApicListController(ApicService) {
    var vm = this;
    console.log("Hello W)rld");

    vm.apic = ApicService.query();
  }
}());
