# Permit <-> Stytch Integrations
This repository contains a collection of webhooks to provision users from Stych authentication service to Permit.io for Fine Grained Authorization.

The webhooks service is Node.js based and are written using the Express.js webframework.

## Usage
To properly run the service, follow these steps.

> To support multiple webhhoks that provides difference secrets, the project is utilize a custom header named `x-stytch-webhook-secret` that contains the environment variable name of the relevant secret. For example, if the header value is `SYNC_USER_SECRET` the webhook will look for the `SYNC_USER_SECRET` environment variable to validate the webhook.

### Run the Project

1. Configure the relevant webhooks in Stytch to point to your server.
1. Create an `.env` file, and copy the content from `.env.template` to it
    ```
    cp .env.template .env
    ```
2. Replace the `PERMIT_API_TOKEN` and `STYTCH_API_TOKEN` with the proper tokens from Permit and Stytch
3. Add the relevant webhook secrets to the `.env` file, using the same names as the custom header values.
4. Install the dependencies
    ```
    npm install
    ```
5. Start the server
    ```
    npm start
    ```
6. (Optional) If you're running the project locally, you'll probably have to use a proxy service (like [https://ngrok.com/](ngrok)) to expose it to Stytch.

You can now check the logs to see if the webhooks are being received and processed correctly. Stytch platform provide a test button to trigger the webhooks for testing.

## Supported Flows
The project is currently supported the following flows to sync users (with roles) and tenants to Permit.

> The project is utilizing the query params of the webhooks to pass configuration for the flows.

### Sync User
This hook is getting the user from Stych and create/update it in Permit.

#### Webhook URL
```
https://{YOUR_SERVER_URL}/sync-users{optional_query_parameters}
```

#### Supported Stytch events
* `*.user.create` - A new user has been created in Stytch
* `*.user.update` - An existing user has been updated in Stytch

#### Optional Params
* `role_assignment = default | tenant` - if set will assign the role to a user. In case of `tenant` the assignment will be done to the organization of the user.
* `create_roles = true` - if set to true will create the roles if it does not exist.
* `create_tenants = true` - if set to true will create the tenants if it does not exist.

### Sync Tenant - TBD
### Delete User - TBD
### Delete Tenant - TBD