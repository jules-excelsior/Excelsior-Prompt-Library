import { defineConfig } from "@/lib/config";

const useCloneBranding = true;

export default defineConfig({
  branding: {
    name: "Excelsior Prompt Library",
    logo: "/logo.svg",
    logoDark: "/logo-dark.svg",
    favicon: "/logo.svg",
    description: "Battle-tested AI prompts for business, operations, and growth — by Excelsior Consultancy",
  },

  theme: {
    radius: "md",
    variant: "default",
    density: "default",
    colors: {
      primary: "#7c3aed", // Excelsior violet
    },
  },

  auth: {
    // Use credentials only — add "google" and "github" once OAuth apps are configured
    providers: ["credentials"],
    allowRegistration: true,
  },

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  features: {
    privatePrompts: true,
    changeRequests: true,
    categories: true,
    tags: true,
    aiSearch: false,
    aiGeneration: false,
    mcp: false,
    comments: true,
  },

  homepage: {
    useCloneBranding,
    achievements: {
      enabled: false,
    },
    sponsors: {
      enabled: false,
      items: [],
    },
  },
});
