const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // src:https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-monorepo
    console.log(
      "firstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirstfirst"
    );

    // config.resolve.extensionAlias = {
    //   ".js": [".ts", ".tsx", ".js", ".jsx"],
    //   ".mjs": [".mts", ".mjs"],
    //   ".cjs": [".cts", ".cjs"],
    // };

    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  // transpilePackages: ["@repo/db"],
};
