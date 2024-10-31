const { Permit, PermitApiError } = require("permitio");

const permit = new Permit({
  apiKey: process.env.PERMIT_API_KEY,

});

const syncUserToPermit = async ({ email_address, name, member_id }) => {
  try {
    const user = await permit.api.syncUser({
      email: email_address,
      first_name: name && name.split(" ")?.[0],
      last_name: name && name.split(" ")?.[1],
      key: member_id,
    });
    console.debug("User synced to Permit:", user.key);
    return user;
  } catch (error) {
    console.error("Error syncing user to Permit:", error);
    return null;
  }
};

const createTenant = async (key, name) => {
  try {
    const existingTenant = await permit.api.tenants.get(key);
    console.debug("Tenant already exists:", existingTenant.key);
    if (existingTenant) {
      return existingTenant;
    }
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error("Error checking existing tenant:", error.response.status);
      return null;
    }
  }
  try {
    const tenant = await permit.api.tenants.create({
      key,
      name,
    });
    console.debug("Tenant created:", tenant.id);
    return tenant;
  } catch (error) {
    console.error("Error creating tenant:", error);
    return null;
  }
};

module.exports = {
  client: permit,
  createTenant,
  syncUserToPermit,
};
