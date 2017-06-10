'use strict';

describe('Apic E2E Tests:', function () {
  describe('Test apic page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/apic');
      expect(element.all(by.repeater('article in apic')).count()).toEqual(0);
    });
  });
});
