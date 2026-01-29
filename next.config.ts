

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable if using environment variables in browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;