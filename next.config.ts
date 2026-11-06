import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub project Pages uses this prefix; local development stays at /.
  basePath: process.env.NODE_ENV === "production" ? "/sauna_app" : "",
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
