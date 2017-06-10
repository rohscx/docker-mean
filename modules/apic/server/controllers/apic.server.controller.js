'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Apic = mongoose.model('Apic'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an apic
 */
exports.create = function (req, res) {
  var apic = new Apic(req.body);
  apic.user = req.user;

  apic.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apic);
    }
  });
};

/**
 * Show the current apic
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var apic = req.apic ? req.apic.toJSON() : {};

  // Add a custom field to the Apic, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Apic model.
  apic.isCurrentUserOwner = !!(req.user && apic.user && apic.user._id.toString() === req.user._id.toString());

  res.json(apic);
};

/**
 * Update an apic
 */
exports.update = function (req, res) {
  var apic = req.apic;

  apic.title = req.body.title;
  apic.content = req.body.content;

  apic.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apic);
    }
  });
};

/**
 * Delete an apic
 */
exports.delete = function (req, res) {
  var apic = req.apic;

  apic.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apic);
    }
  });
};

/**
 * List of Apic
 */
exports.list = function (req, res) {
  Apic.find().sort('-created').populate('user', 'displayName').exec(function (err, apic) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apic);
    }
  });
};

/**
 * Apic middleware
 */
exports.apicByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Apic is invalid'
    });
  }

  Apic.findById(id).populate('user', 'displayName').exec(function (err, apic) {
    if (err) {
      return next(err);
    } else if (!apic) {
      return res.status(404).send({
        message: 'No apic with that identifier has been found'
      });
    }
    req.apic = apic;
    next();
  });
};
