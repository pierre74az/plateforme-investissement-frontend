import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Requis pour le Dockerfile — génère un serveur standalone minimaliste
  output: "standalone",
};

export default nextConfig;

