/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'explorer.solana.com'
    ]
  }
}

module.exports = nextConfig
