/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

const withBasicAuth = require('next-basic-auth');

module.exports = withBasicAuth({
  basicAuth: {
    users: {
      [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD,
    },
    unauthorizedResponse: 'Unauthorized',
  }
});
