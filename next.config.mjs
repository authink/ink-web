/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/api/:path*', // Proxy to Backend
    },
  ],
  i18n: {
    locales: ['en', 'zh-CN'],
    defaultLocale: 'en',
  },
  transpilePackages: ['@ant-design/icons'],
}

export default nextConfig
