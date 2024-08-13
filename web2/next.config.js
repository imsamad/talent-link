const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // src:https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-monorepo

    // if (isServer) {
    config.plugins = [...config.plugins, new PrismaPlugin()];
    // }
    return config;
  },
};
