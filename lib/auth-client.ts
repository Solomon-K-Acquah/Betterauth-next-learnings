import { twoFactorClient } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "./permissions";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",

  plugins: [
    twoFactorClient(),
    adminClient({
      ac,
      roles,
    }),
  ],
});

// export const { signIn, signUp, useSession } = authClient;
