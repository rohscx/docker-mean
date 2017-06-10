(function (app) {
  'use strict';

  app.registerModule('apic', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('apic.admin', ['core.admin']);
  app.registerModule('apic.admin.routes', ['core.admin.routes']);
  app.registerModule('apic.services');
  app.registerModule('apic.routes', ['ui.router', 'core.routes', 'apic.services']);
}(ApplicationConfiguration));
