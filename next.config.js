/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'rb.gy', 'localhost', "imgs.search.brave.com"]
  }
}
