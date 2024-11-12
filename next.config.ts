import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Active le mode strict de React pour détecter les erreurs potentiels
  swcMinify: true, // Active la minification avec le compilateur SWC pour des builds plus rapides

  // Désactiver ESLint pendant le build en production (option temporaire)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuration pour les exports statiques (si vous utilisez `next export`)
  output: 'export',

  // Configurer des variables d’environnement public (accessibles côté client)
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL, // exemple
  },

  // Ajoutez d'autres configurations si nécessaire
};

export default nextConfig;
