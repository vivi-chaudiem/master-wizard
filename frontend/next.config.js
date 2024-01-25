const withBasicAuth = require('next-basic-auth');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withBasicAuth({
  ...nextConfig,

  // Basic Auth configuration
  basicAuth: {
    users: {
      [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD,
    },
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
  },
});
