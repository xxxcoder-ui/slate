const withOffline = require("next-offline");

const nextConfig = {
  webpack5: true,
};

module.exports = withOffline(nextConfig);
