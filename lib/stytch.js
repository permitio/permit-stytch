const stytch = require("stytch");

const client = new stytch.B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET,
});

const getOrganization = async (organization_id) => {
  try {
    const organization = await client.organizations.get({ organization_id });
    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
};

const getMember = async (organization_id, member_id) => {
  try {
    const member = await client.organizations.members.get({
      organization_id,
      member_id,
    });
    return member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
};

module.exports = {
  client,
  getMember,
  getOrganization,
};
