const withOffline = require("next");

const nextConfig = {
  webpack5: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = withOffline(nextConfig);
