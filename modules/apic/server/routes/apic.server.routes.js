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

  // Single article routes
  app.route('/api/apic/:articleId').all(apicPolicy.isAllowed)
    .get(apic.read)
    .put(apic.update)
    .delete(apic.delete);

  // Finish by binding the article middleware
  app.param('articleId', apic.articleByID);
};
