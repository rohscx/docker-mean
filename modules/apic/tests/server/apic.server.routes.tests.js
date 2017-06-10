'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Apic = mongoose.model('Apic'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  apic;

/**
 * Apic routes tests
 */
describe('Apic CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new apic
    user.save(function () {
      apic = {
        title: 'Apic Title',
        content: 'Apic Content'
      };

      done();
    });
  });

  it('should not be able to save an apic if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/apic')
          .send(apic)
          .expect(403)
          .end(function (apicSaveErr, apicSaveRes) {
            // Call the assertion callback
            done(apicSaveErr);
          });

      });
  });

  it('should not be able to save an apic if not logged in', function (done) {
    agent.post('/api/apic')
      .send(apic)
      .expect(403)
      .end(function (apicSaveErr, apicSaveRes) {
        // Call the assertion callback
        done(apicSaveErr);
      });
  });

  it('should not be able to update an apic if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/apic')
          .send(apic)
          .expect(403)
          .end(function (apicSaveErr, apicSaveRes) {
            // Call the assertion callback
            done(apicSaveErr);
          });
      });
  });

  it('should be able to get a list of apic if not signed in', function (done) {
    // Create new apic model instance
    var apicObj = new Apic(apic);

    // Save the apic
    apicObj.save(function () {
      // Request apic
      request(app).get('/api/apic')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single apic if not signed in', function (done) {
    // Create new apic model instance
    var apicObj = new Apic(apic);

    // Save the apic
    apicObj.save(function () {
      request(app).get('/api/apic/' + apicObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', apic.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single apic with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/apic/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Apic is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single apic which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent apic
    request(app).get('/api/apic/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No apic with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an apic if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/apic')
          .send(apic)
          .expect(403)
          .end(function (apicSaveErr, apicSaveRes) {
            // Call the assertion callback
            done(apicSaveErr);
          });
      });
  });

  it('should not be able to delete an apic if not signed in', function (done) {
    // Set apic user
    apic.user = user;

    // Create new apic model instance
    var apicObj = new Apic(apic);

    // Save the apic
    apicObj.save(function () {
      // Try deleting apic
      request(app).delete('/api/apic/' + apicObj._id)
        .expect(403)
        .end(function (apicDeleteErr, apicDeleteRes) {
          // Set message assertion
          (apicDeleteRes.body.message).should.match('User is not authorized');

          // Handle apic error error
          done(apicDeleteErr);
        });

    });
  });

  it('should be able to get a single apic that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new apic
          agent.post('/api/apic')
            .send(apic)
            .expect(200)
            .end(function (apicSaveErr, apicSaveRes) {
              // Handle apic save error
              if (apicSaveErr) {
                return done(apicSaveErr);
              }

              // Set assertions on new apic
              (apicSaveRes.body.title).should.equal(apic.title);
              should.exist(apicSaveRes.body.user);
              should.equal(apicSaveRes.body.user._id, orphanId);

              // force the apic to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the apic
                    agent.get('/api/apic/' + apicSaveRes.body._id)
                      .expect(200)
                      .end(function (apicInfoErr, apicInfoRes) {
                        // Handle apic error
                        if (apicInfoErr) {
                          return done(apicInfoErr);
                        }

                        // Set assertions
                        (apicInfoRes.body._id).should.equal(apicSaveRes.body._id);
                        (apicInfoRes.body.title).should.equal(apic.title);
                        should.equal(apicInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single apic if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new apic model instance
    var apicObj = new Apic(apic);

    // Save the apic
    apicObj.save(function () {
      request(app).get('/api/apic/' + apicObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', apic.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single apic, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'apicowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Apic
    var _apicOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _apicOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Apic
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new apic
          agent.post('/api/apic')
            .send(apic)
            .expect(200)
            .end(function (apicSaveErr, apicSaveRes) {
              // Handle apic save error
              if (apicSaveErr) {
                return done(apicSaveErr);
              }

              // Set assertions on new apic
              (apicSaveRes.body.title).should.equal(apic.title);
              should.exist(apicSaveRes.body.user);
              should.equal(apicSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the apic
                  agent.get('/api/apic/' + apicSaveRes.body._id)
                    .expect(200)
                    .end(function (apicInfoErr, apicInfoRes) {
                      // Handle apic error
                      if (apicInfoErr) {
                        return done(apicInfoErr);
                      }

                      // Set assertions
                      (apicInfoRes.body._id).should.equal(apicSaveRes.body._id);
                      (apicInfoRes.body.title).should.equal(apic.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (apicInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Apic.remove().exec(done);
    });
  });
});
