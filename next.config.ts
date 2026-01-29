

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable if using environment variables in browser
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig;