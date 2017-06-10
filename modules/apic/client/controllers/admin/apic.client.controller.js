(function () {
  'use strict';

  angular
    .module('apic.admin')
    .controller('ApicAdminController', ApicAdminController);

  ApicAdminController.$inject = ['$scope', '$state', '$window', 'apicResolve', 'Authentication', 'Notification'];

  function ApicAdminController($scope, $state, $window, apic, Authentication, Notification) {
    var vm = this;

    vm.apic = apic;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Apic
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.apic.$remove(function() {
          $state.go('admin.apic.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Apic deleted successfully!' });
        });
      }
    }

    // Save Apic
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.apicForm');
        return false;
      }

      // Create a new apic, or update the current instance
      vm.apic.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.apic.list'); // should we send the User to the list or the updated Apic's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Apic saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Apic save error!' });
      }
    }
  }
}());
