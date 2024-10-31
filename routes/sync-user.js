var express = require("express");
const permit = require("../lib/permit");
const { getOrganization, getMember } = require("../lib/stytch");
var router = express.Router();

async function getRolesToAssign(req, create_roles) {
  const stytchRoles = req.body.member.roles.map((role) => role.role_id);
  console.log("Stytch roles:", stytchRoles);
  const existingRoles = (await permit.client.api.roles.list()).map(
    (role) => role.key
  );
  console.log("Existing roles:", existingRoles);
  if (create_roles) {
    const nonExistingRoles = stytchRoles.filter(
      (role) => !existingRoles.some((existingRole) => existingRole === role)
    );
    await Promise.all(
      nonExistingRoles.map((role) =>
        permit.client.api.roles.create({
          key: role,
          name: role,
          description: `Role created from Stytch: ${role}`,
        })
      )
    );
    existingRoles.push(...nonExistingRoles);
  }
  const rolesToAssign = existingRoles.filter((role) =>
    stytchRoles.includes(role)
  );
  return rolesToAssign;
}

/* Sync users from Stytch to Permit. */
router.post("/", async function (req, res, next) {
  const { role_assignment, create_roles, create_tenant } = req.query;
  // Sync the basic user to Permit
  const member = await getMember(
    req.body.member.organization_id,
    req.body.member.member_id
  );
  console.log("Member:", member.member);
  const user = await permit.syncUserToPermit(member.member);
  if (!user) {
    return res.status(400).send({ error: "User sync failed" });
  }

  // If create organization is set, create the tenant in Permit
  if (create_tenant) {
    const organization = await getOrganization(req.body.member.organization_id);
    if (!organization) {
      return res.status(400).send({ error: "Organization not found" });
    }

    await permit.createTenant(
      organization.organization.organization_id,
      organization.organization.organization_name
    );
    if (!tenant) {
      return res.status(400).send({ error: "Tenant creation failed" });
    }
  }

  // Return in case no role assignment is found
  if (!role_assignment) {
    return res.status(204).send(); // No Content
  }

  // Assign the roles to the user
  const rolesToAssign = await getRolesToAssign(req, create_roles);
  console.log("Roles to assign:", rolesToAssign);
  if (rolesToAssign.length) {
    await permit.client.api.roleAssignments.bulkAssign(
      rolesToAssign.map((role) => ({
        user: user.key,
        role,
        tenant:
          role_assignment === "default"
            ? "default"
            : req.body.member.organization_id,
      }))
    );
  }
  
  const currentUserRoles = (await permit.client.api.roleAssignments.list({
    user: user.key,
    tenant:
      role_assignment === "default"
        ? "default"
        : req.body.member.organization_id,
  })).map((assignment) => assignment.role);

  const rolesToUnassign = currentUserRoles.filter(
    (role) => !rolesToAssign.includes(role)
  );

  if (rolesToUnassign.length) {
    await permit.client.api.roleAssignments.bulkUnassign(
      rolesToUnassign.map((role) => ({
        user: user.key,
        role,
        tenant:
          role_assignment === "default"
            ? "default"
            : req.body.member.organization_id,
      }))
    );
  }

  // Return success response
  return res.status(204).send(); // No Content
});

module.exports = router;
