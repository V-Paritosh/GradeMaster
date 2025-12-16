/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@supabase/supabase-js"],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
    };

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/(@supabase|@babel)/,
      type: "javascript/auto",
    });

    return config;
  },
};

export default nextConfig;
