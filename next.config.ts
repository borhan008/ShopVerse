import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amethyst-selective-panda-666.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
