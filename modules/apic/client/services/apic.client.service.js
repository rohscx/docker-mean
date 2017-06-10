(function () {
  'use strict';

  angular
    .module('apic.services')
    .factory('ApicService', ApicService);

  ApicService.$inject = ['$resource', '$log'];

  function ApicService($resource, $log) {
    var Apic = $resource('/api/apic/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Apic.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    return Apic;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
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
