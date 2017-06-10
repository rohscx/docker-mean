(function () {
  'use strict';

  angular
    .module('apic.admin')
    .controller('ApicAdminListController', ApicAdminListController);

  ApicAdminListController.$inject = ['ApicService'];

  function ApicAdminListController(ApicService) {
    var vm = this;

    vm.apic = ApicService.query();
  }
}());
