const withOffline = require("next-offline");

const nextConfig = {
  future: { webpack5: true, }
};

module.exports = withOffline(nextConfig);
