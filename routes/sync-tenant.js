var express = require('express');
var router = express.Router();

/* Sync tenants from Stytch to Permit. */
router.post('/', function(req, res, next) {
  res.status(204).send(); // No Content
});

module.exports = router;
