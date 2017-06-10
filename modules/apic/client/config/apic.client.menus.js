(function () {
  'use strict';

  angular
    .module('apic')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];
  /*
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Apic',
      state: 'apic',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'apic', {
      title: 'List Apic',
      state: 'apic.list',
      roles: ['*']
    });
    */
    menuService.addMenuItem('topbar', {
      title: 'Apic',
      state: 'apic.list',
      roles: ['*']
    });
  }
}());
