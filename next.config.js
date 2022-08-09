/** @type {import('next').NextConfig} */
module.exports = () => {
  return {
    reactStrictMode: true,
    swcMinify: true,
    env: {
      BUILD_ENV: process.env.BUILD_ENV,
      MONGODB_URI: process.env.MONGODB_URI,

      SESSION_NAME: process.env.SESSION_NAME,
      SESSION_ROLE: process.env.SESSION_ROLE,
      SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
      API_KEY: process.env.API_KEY,

      HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY,
      HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,

      DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT,
      DO_SPACES_REGION: process.env.DO_SPACES_REGION,
      DO_SPACES_KEY: process.env.DO_SPACES_KEY,
      DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
      DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
    },
  };
};
