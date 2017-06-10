(function () {
  'use strict';

  // Configuring the apic Admin module
  angular
    .module('apic.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage apic',
      state: 'admin.apic.list'
    });
  }
}());
