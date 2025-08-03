/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/mf/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
      {
        source: '/dashboard/:path*',
        destination: `${process.env.NEXT_PUBLIC_MF_URL_DASHBOARD}/:path*`,
      },
    ];
  },

};

export default nextConfig;