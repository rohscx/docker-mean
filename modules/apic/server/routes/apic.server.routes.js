'use strict';

/**
 * Module dependencies
 */
var apicPolicy = require('../policies/apic.server.policy'),
  apic = require('../controllers/apic.server.controller');

module.exports = function (app) {
  // Apic collection routes
  app.route('/api/apic').all(apicPolicy.isAllowed)
    .get(apic.list)
    .post(apic.create);

  // Single apic routes
  app.route('/api/apic/:apicId').all(apicPolicy.isAllowed)
    .get(apic.read)
    .put(apic.update)
    .delete(apic.delete);

  // Finish by binding the apic middleware
  app.param('apicId', apic.apicByID);
};
