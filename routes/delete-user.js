var express = require('express');
const permit = require('../lib/permit');
var router = express.Router();

/* Sync users from Stytch to Permit. */
router.post('/', async function(req, res, next) {
  // Sync the basic user to Permit
  const user = permit.syncUserToPermit(req.body.member);
  // Return in case no role assignment is found
  // Get the list of roles from Permit
  // If the assignement ins't to default tenant, safely create the tenant
  // Assign the roles to the user
  // Return success response
});

module.exports = router;
