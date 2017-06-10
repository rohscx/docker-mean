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
describe('Apic Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an apic if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new apic
        agent.post('/api/apics')
          .send(apic)
          .expect(200)
          .end(function (apicSaveErr, apicSaveRes) {
            // Handle apic save error
            if (apicSaveErr) {
              return done(apicSaveErr);
            }

            // Get a list of apics
            agent.get('/api/apics')
              .end(function (apicsGetErr, apicsGetRes) {
                // Handle apic save error
                if (apicsGetErr) {
                  return done(apicsGetErr);
                }

                // Get apics list
                var apics = apicsGetRes.body;

                // Set assertions
                (apics[0].user._id).should.equal(userId);
                (apics[0].title).should.match('Apic Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an apic if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new apic
        agent.post('/api/apics')
          .send(apic)
          .expect(200)
          .end(function (apicSaveErr, apicSaveRes) {
            // Handle apic save error
            if (apicSaveErr) {
              return done(apicSaveErr);
            }

            // Update apic title
            apic.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing apic
            agent.put('/api/apics/' + apicSaveRes.body._id)
              .send(apic)
              .expect(200)
              .end(function (apicUpdateErr, apicUpdateRes) {
                // Handle apic update error
                if (apicUpdateErr) {
                  return done(apicUpdateErr);
                }

                // Set assertions
                (apicUpdateRes.body._id).should.equal(apicSaveRes.body._id);
                (apicUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an apic if no title is provided', function (done) {
    // Invalidate title field
    apic.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new apic
        agent.post('/api/apics')
          .send(apic)
          .expect(422)
          .end(function (apicSaveErr, apicSaveRes) {
            // Set message assertion
            (apicSaveRes.body.message).should.match('Title cannot be blank');

            // Handle apic save error
            done(apicSaveErr);
          });
      });
  });

  it('should be able to delete an apic if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new apic
        agent.post('/api/apics')
          .send(apic)
          .expect(200)
          .end(function (apicSaveErr, apicSaveRes) {
            // Handle apic save error
            if (apicSaveErr) {
              return done(apicSaveErr);
            }

            // Delete an existing apic
            agent.delete('/api/apics/' + apicSaveRes.body._id)
              .send(apic)
              .expect(200)
              .end(function (apicDeleteErr, apicDeleteRes) {
                // Handle apic error error
                if (apicDeleteErr) {
                  return done(apicDeleteErr);
                }

                // Set assertions
                (apicDeleteRes.body._id).should.equal(apicSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single apic if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new apic model instance
    apic.user = user;
    var apicObj = new Apic(apic);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new apic
        agent.post('/api/apics')
          .send(apic)
          .expect(200)
          .end(function (apicSaveErr, apicSaveRes) {
            // Handle apic save error
            if (apicSaveErr) {
              return done(apicSaveErr);
            }

            // Get the apic
            agent.get('/api/apics/' + apicSaveRes.body._id)
              .expect(200)
              .end(function (apicInfoErr, apicInfoRes) {
                // Handle apic error
                if (apicInfoErr) {
                  return done(apicInfoErr);
                }

                // Set assertions
                (apicInfoRes.body._id).should.equal(apicSaveRes.body._id);
                (apicInfoRes.body.title).should.equal(apic.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (apicInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
