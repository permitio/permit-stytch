const { Webhook } = require("svix");

const verifySecret = (secret, headers, payload) => {
  const wh = new Webhook(secret);
  try {
    const event = wh.verify(payload, headers);
    return event;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return null;
  }
};

const routeEvents = {
  "sync-user": [
    "dashboard.member.create",
    "dashboard.member.update",
    "direct.member.create",
    "direct.member.update",
    "scim.member.create",
    "scim.member.update",
  ],
  "sync-tenant": [
    "dashboard.organization.create",
    "dashboard.organization.update",
    "direct.organization.create",
    "direct.organization.update",
  ],
  "delete-user": [
    "dashboard.member.delete",
    "direct.member.delete",
    "scim.member.delete",
  ],
  "delete-tenant": ["dashboard.organization.delete", "direct.organization.delete"],
};

const stytchMiddleware = (req, res, next) => {
  const { headers, body } = req;
  // Check if secret is valid
  const secretName = req.headers["x-stytch-webhook-secret"];
  const secret = process.env[secretName];
  if (!secret || !verifySecret(secret, headers, JSON.stringify(body))) {
    return res.status(401).send("Invalid secret");
  }

  // Verify event for route handling
  const endpoint = req.url.split("/").pop().split("?")[0];
  const {source, object_type, action} = body;

  if (!routeEvents[endpoint]?.includes(`${source.toLowerCase()}.${object_type.toLowerCase()}.${action.toLowerCase()}`)) {
    console.error("Invalid event for endpoint:", endpoint);
    return res.status(400).send("Invalid payload");
  }

  console.log(req.query);

  next();
};

module.exports = stytchMiddleware;
