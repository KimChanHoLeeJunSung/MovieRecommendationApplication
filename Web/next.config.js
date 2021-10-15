/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images:{
    domains:['image.tmdb.org'],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://221.147.149.142:8000/:path*',
      },
    ]
  },
}
