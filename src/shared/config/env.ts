import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    BETTER_AUTH_URL: z.url().optional(),

    STRIPE_SECRET_KEY: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    NEXT_PUBLIC_API_URL: z.url().optional(),

    NEXT_PUBLIC_ALCHEMY_API_URL: z.url().optional(),
    NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS: z.string().optional(),
    NEXT_PUBLIC_USDC_CONTRACT_ADDRESS: z.string().optional(),
    NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS: z.string().optional(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

    NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS: process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_USDC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS: process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

    NEXT_PUBLIC_ALCHEMY_API_URL: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
  },
});

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}