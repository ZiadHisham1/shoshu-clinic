/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // required — Capacitor can't run Next image optimizer
  trailingSlash: true,           // helps with routing on file://
};

module.exports = nextConfig;