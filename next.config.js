/** @type {import('next').NextConfig} */
module.exports = () => {
  return {
    reactStrictMode: true,
    swcMinify: true,
    env: {
      BUILD_ENV: process.env.BUILD_ENV,
      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_DB: process.env.MONGODB_DB,
      SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
      HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY,
      HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,
    },
  };
};
