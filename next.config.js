const withOffline = require("next-offline");

const nextConfig = {
  webpack5: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = withOffline(nextConfig);
