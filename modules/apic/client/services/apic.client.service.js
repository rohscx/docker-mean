(function () {
  'use strict';

  angular
    .module('apic.services')
    .factory('ApicService', ApicService);

  ApicService.$inject = ['$resource', '$log'];

  function ApicService($resource, $log) {
    var Apic = $resource('/api/apic/:apicId', {
      apicId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Apic.prototype, {
      createOrUpdate: function () {
        var apic = this;
        return createOrUpdate(apic);
      }
    });

    return Apic;

    function createOrUpdate(apic) {
      if (apic._id) {
        return apic.$update(onSuccess, onError);
      } else {
        return apic.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(apic) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
